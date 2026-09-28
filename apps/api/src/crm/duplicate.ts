import {
  authorize,
  canonicalDuplicatePair,
  canReviewDuplicateDecision,
  clearanceAllows,
  CRM_DUPLICATE_SUPPRESSION_DAYS,
  CRM_EVENT_TYPES,
  duplicateReviewTargetStatus,
  duplicateScoreMeetsThreshold,
  newId,
  scoreOrganizationDuplicatePair,
  type CrmDuplicateCandidate,
  type CrmOrganization,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCrmAudit, denyCrmAudit } from "./audit.js";
import { ensureCrmCollections } from "./collections.js";
import { commitCrmWithOutbox } from "./events.js";
import { orgResource } from "./organization.js";
import { personDomainRemoved } from "../personal-data-phase1.js";

export type DuplicateCandidateEmitCtx = {
  principal: Principal;
  correlationId: string;
};

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

function suppressionExpired(reviewedAt: string | undefined): boolean {
  if (!reviewedAt) return true;
  const elapsed = Date.now() - new Date(reviewedAt).getTime();
  return elapsed >= CRM_DUPLICATE_SUPPRESSION_DAYS * 24 * 60 * 60 * 1000;
}

function findCandidate(store: Store, tenantId: string, id: string): CrmDuplicateCandidate | undefined {
  const candidate = store.crmDuplicateCandidates.find((c) => c.id === id);
  if (!candidate || candidate.tenantId !== tenantId) return undefined;
  return candidate;
}

function existingPairCandidate(
  store: Store,
  tenantId: string,
  entityType: "organization",
  entityIdA: string,
  entityIdB: string,
): CrmDuplicateCandidate | undefined {
  const [a, b] = canonicalDuplicatePair(entityIdA, entityIdB);
  return store.crmDuplicateCandidates.find(
    (c) => c.tenantId === tenantId && c.entityType === entityType && c.entityIdA === a && c.entityIdB === b,
  );
}

function isActiveOrganization(org: CrmOrganization): boolean {
  return !org.archivedAt && !org.mergedIntoId;
}

export async function registerDuplicateCandidatesForOrganization(
  store: Store,
  tenantId: string,
  organizationId: string,
  emitCtx?: DuplicateCandidateEmitCtx,
) {
  ensureCrmCollections(store);
  const org = store.crmOrganizations.find((o) => o.id === organizationId && o.tenantId === tenantId);
  if (!org || !isActiveOrganization(org)) return;

  const signals = {
    legalName: org.legalName,
    ...(org.tradingName !== undefined ? { tradingName: org.tradingName } : {}),
    ...(org.domain !== undefined ? { domain: org.domain } : {}),
    ...(org.website !== undefined ? { website: org.website } : {}),
  };

  for (const other of store.crmOrganizations) {
    if (other.id === org.id || other.tenantId !== tenantId || !isActiveOrganization(other)) continue;
    const match = scoreOrganizationDuplicatePair(signals, {
      legalName: other.legalName,
      ...(other.tradingName !== undefined ? { tradingName: other.tradingName } : {}),
      ...(other.domain !== undefined ? { domain: other.domain } : {}),
      ...(other.website !== undefined ? { website: other.website } : {}),
    });
    if (!match || !duplicateScoreMeetsThreshold(match.score)) continue;
    await upsertDuplicateCandidate(store, tenantId, "organization", org.id, other.id, match, emitCtx);
  }
}

export async function registerDuplicateCandidatesForContact(
  store: Store,
  _tenantId: string,
  _contactId: string,
  _emitCtx?: DuplicateCandidateEmitCtx,
) {
  ensureCrmCollections(store);
}

async function upsertDuplicateCandidate(
  store: Store,
  tenantId: string,
  entityType: "organization",
  entityIdA: string,
  entityIdB: string,
  match: { rule: string; score: number; matchReason: string },
  emitCtx?: DuplicateCandidateEmitCtx,
) {
  const [a, b] = canonicalDuplicatePair(entityIdA, entityIdB);
  const existing = existingPairCandidate(store, tenantId, entityType, a, b);
  if (existing) {
    if (existing.status === "NotDuplicate" && !suppressionExpired(existing.reviewedAt)) return;
    if (existing.status === "ConfirmedDuplicate" || existing.status === "UnderReview") return;
    if (existing.status === "PotentialDuplicate" && existing.score >= match.score) return;
    existing.score = match.score;
    existing.detectionRule = match.rule;
    existing.matchReason = match.matchReason;
    existing.status = "PotentialDuplicate";
    existing.detectedAt = new Date().toISOString();
    return;
  }

  const candidate: CrmDuplicateCandidate = {
    id: newId(),
    tenantId,
    entityType,
    entityIdA: a,
    entityIdB: b,
    score: match.score,
    detectionRule: match.rule,
    matchReason: match.matchReason,
    status: "PotentialDuplicate",
    detectedAt: new Date().toISOString(),
  };
  if (emitCtx) {
    await commitCrmWithOutbox(store, emitCtx.principal, {
      eventType: CRM_EVENT_TYPES.DUPLICATE_CANDIDATE_CREATED,
      entityType: "duplicate_candidate",
      entityId: candidate.id,
      classification: "Internal",
      correlationId: emitCtx.correlationId,
      payload: {
        duplicateCandidateId: candidate.id,
        matchedEntityType: entityType,
        entityIdA: candidate.entityIdA,
        entityIdB: candidate.entityIdB,
        score: candidate.score,
      },
      mutate: () => {
        store.crmDuplicateCandidates.push(candidate);
      },
    });
    return;
  }

  store.crmDuplicateCandidates.push(candidate);
}

function entityReadable(
  store: Store,
  principal: Principal,
  entityType: string,
  entityId: string,
): boolean {
  if (entityType !== "organization") return false;
  const org = store.crmOrganizations.find((o) => o.id === entityId && o.tenantId === principal.tenantId);
  if (!org) return false;
  const decision = authorize({
    principal,
    permission: "crm:read:organization",
    action: "read:crm_organization",
    resource: orgResource(org),
  });
  return decision.result === "allow" && clearanceAllows(principal.classificationClearance, org.classification);
}

function sanitizeCandidate(candidate: CrmDuplicateCandidate) {
  return {
    id: candidate.id,
    entityType: candidate.entityType,
    entityIdA: candidate.entityIdA,
    entityIdB: candidate.entityIdB,
    score: candidate.score,
    detectionRule: candidate.detectionRule,
    matchReason: candidate.matchReason,
    status: candidate.status,
    detectedAt: candidate.detectedAt,
    reviewedAt: candidate.reviewedAt,
    reviewedByPrincipalId: candidate.reviewedByPrincipalId,
    reviewReason: candidate.reviewReason,
  };
}

export function listDuplicateCandidates(
  store: Store,
  principal: Principal,
  query?: { status?: string; entityType?: string; limit?: number; cursor?: string },
) {
  ensureCrmCollections(store);
  const decision = authorize({
    principal,
    permission: "crm:read:duplicate",
    action: "read:crm_duplicate_candidate",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.crmDuplicateCandidates.filter((c) => c.tenantId === principal.tenantId);
  if (query?.status) items = items.filter((c) => c.status === query.status);
  if (query?.entityType) {
    if (query.entityType === "contact") return personDomainRemoved();
    if (query.entityType !== "organization") {
      return { error: "invalid_request" as const, reason: "invalid_entity_type" };
    }
    items = items.filter((c) => c.entityType === query.entityType);
  }
  items = items.filter((c) => c.entityType === "organization");

  items = items.filter(
    (c) =>
      entityReadable(store, principal, "organization", c.entityIdA) &&
      entityReadable(store, principal, "organization", c.entityIdB),
  );
  items.sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));

  const limit = Math.min(Math.max(query?.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
  if (query?.cursor) {
    const idx = items.findIndex((c) => c.id === query.cursor);
    if (idx >= 0) items = items.slice(idx + 1);
  }
  const page = items.slice(0, limit);
  const nextCursor = page.length === limit && items.length > limit ? page[page.length - 1]?.id : undefined;
  return {
    items: page.map(sanitizeCandidate),
    ...(nextCursor !== undefined ? { nextCursor } : {}),
  };
}

export function getDuplicateCandidate(store: Store, principal: Principal, candidateId: string) {
  ensureCrmCollections(store);
  const candidate = store.crmDuplicateCandidates.find((c) => c.id === candidateId);
  if (!candidate || candidate.tenantId !== principal.tenantId) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:read:duplicate",
    action: "read:crm_duplicate_candidate",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if (
    !entityReadable(store, principal, candidate.entityType, candidate.entityIdA) ||
    !entityReadable(store, principal, candidate.entityType, candidate.entityIdB)
  ) {
    return { error: "not_found" as const };
  }

  return { candidate: sanitizeCandidate(candidate) };
}

export async function reviewDuplicateCandidate(
  store: Store,
  principal: Principal,
  candidateId: string,
  input: { decision: "confirm" | "reject"; reason?: string },
  correlationId: string,
) {
  ensureCrmCollections(store);
  const candidate = findCandidate(store, principal.tenantId, candidateId);
  if (!candidate) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "crm:review:duplicate",
    action: "review:crm_duplicate_candidate",
  });
  if (decision.result === "deny") {
    denyCrmAudit(
      store,
      principal,
      "crm:review:duplicate",
      "crm_duplicate_candidate",
      correlationId,
      decision.reason,
      candidateId,
    );
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (
    !entityReadable(store, principal, candidate.entityType, candidate.entityIdA) ||
    !entityReadable(store, principal, candidate.entityType, candidate.entityIdB)
  ) {
    return { error: "not_found" as const };
  }

  if (!canReviewDuplicateDecision(candidate.status, input.decision)) {
    return { error: "conflict" as const, reason: "invalid_duplicate_status" };
  }

  const reason = input.reason?.trim();
  if (!reason) return { error: "invalid_request" as const, reason: "review_reason_required" };

  const previousState = { status: candidate.status };
  candidate.status = duplicateReviewTargetStatus(input.decision);
  candidate.reviewedAt = new Date().toISOString();
  candidate.reviewedByPrincipalId = principal.id;
  candidate.reviewReason = reason;

  const committed = await commitCrmWithOutbox(store, principal, {
    eventType: CRM_EVENT_TYPES.DUPLICATE_CANDIDATE_REVIEWED,
    entityType: "duplicate_candidate",
    entityId: candidate.id,
    classification: "Internal",
    correlationId,
    payload: {
      duplicateCandidateId: candidate.id,
      decision: input.decision,
    },
    mutate: () => {
      allowCrmAudit(
        store,
        principal,
        "crm:review:duplicate",
        "crm_duplicate_candidate",
        candidate.id,
        correlationId,
        {
          status: candidate.status,
          decision: input.decision,
        },
        previousState,
      );
    },
  });
  if (!committed.ok) return { error: "conflict" as const, reason: committed.reason };

  return { candidate: sanitizeCandidate(candidate) };
}
