import {
  authorize,
  canTransitionOpportunityStage,
  isValidOpportunityStage,
  newId,
  OPPORTUNITY_STAGE_LABELS,
  OPPORTUNITY_STAGES,
  type OppOpportunity,
  type OpportunityStage,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowPipelineAudit, denyPipelineAudit } from "./audit.js";
import { ensurePipelineCollections } from "./collections.js";

function sanitize(o: OppOpportunity) {
  return {
    id: o.id,
    opportunityCode: o.opportunityCode,
    title: o.title,
    organizationId: o.organizationId,
    accountId: o.accountId,
    stage: o.stage,
    status: o.status,
    programmeSummary: o.programmeSummary,
    estimatedValue: o.estimatedValue,
    currency: o.currency,
    paxCount: o.paxCount,
    expectedCloseDate: o.expectedCloseDate,
    ownerPrincipalId: o.ownerPrincipalId,
    classification: o.classification,
    version: o.version,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

function sanitizeHistory(h: {
  id: string;
  opportunityId: string;
  fromStage?: OpportunityStage;
  toStage: OpportunityStage;
  changedAt: string;
  notes?: string;
}) {
  return {
    id: h.id,
    opportunityId: h.opportunityId,
    toStage: h.toStage,
    changedAt: h.changedAt,
    ...(h.fromStage !== undefined ? { fromStage: h.fromStage } : {}),
    ...(h.notes !== undefined ? { notes: h.notes } : {}),
  };
}

function findOpportunity(store: Store, tenantId: string, id: string): OppOpportunity | undefined {
  const o = store.oppOpportunities.find((x) => x.id === id && x.tenantId === tenantId && !x.archivedAt);
  return o;
}

export function getPipelineModuleHealth(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    module: "pipeline",
    increment: "C2",
    status: "ok" as const,
    opportunities: store.oppOpportunities.filter((o) => o.tenantId === principal.tenantId && !o.archivedAt).length,
  };
}

export function listPipelineStages(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: OPPORTUNITY_STAGES.filter((s) => s !== "lost").map((stage) => ({
      key: stage,
      label: OPPORTUNITY_STAGE_LABELS[stage],
    })),
  };
}

export function listOpportunities(
  store: Store,
  principal: Principal,
  query?: { stage?: string; organizationId?: string; status?: string },
) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.oppOpportunities.filter((o) => o.tenantId === principal.tenantId && !o.archivedAt);
  if (query?.stage) {
    if (!isValidOpportunityStage(query.stage)) {
      return { error: "invalid_request" as const, reason: "invalid_stage" };
    }
    items = items.filter((o) => o.stage === query.stage);
  }
  if (query?.organizationId) items = items.filter((o) => o.organizationId === query.organizationId);
  if (query?.status) items = items.filter((o) => o.status === query.status);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitize) };
}

export function getPipelineBoard(store: Store, principal: Principal) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const columns = OPPORTUNITY_STAGES.filter((s) => s !== "lost").map((stage) => {
    const cards = store.oppOpportunities.filter(
      (o) => o.tenantId === principal.tenantId && !o.archivedAt && o.stage === stage,
    );
    return {
      stage,
      label: OPPORTUNITY_STAGE_LABELS[stage],
      count: cards.length,
      items: cards.map(sanitize),
    };
  });
  return { columns };
}

export function getOpportunity(store: Store, principal: Principal, id: string) {
  ensurePipelineCollections(store);
  const opp = findOpportunity(store, principal.tenantId, id);
  if (!opp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "pipeline:read:opportunity",
    action: "read:opp_opportunity",
    resource: { tenantId: opp.tenantId, type: "opportunity", id: opp.id, classification: opp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const history = store.oppStageHistory
    .filter((h) => h.opportunityId === id && h.tenantId === principal.tenantId)
    .sort((a, b) => b.changedAt.localeCompare(a.changedAt));

  return { opportunity: sanitize(opp), stageHistory: history.map(sanitizeHistory) };
}

export type CreateOpportunityInput = {
  opportunityCode: string;
  title: string;
  organizationId: string;
  accountId?: string;
  programmeSummary?: string;
  estimatedValue?: number;
  currency?: string;
  paxCount?: number;
  expectedCloseDate?: string;
  ownerPrincipalId?: string;
};

export function createOpportunity(
  store: Store,
  principal: Principal,
  input: CreateOpportunityInput,
  correlationId: string,
) {
  ensurePipelineCollections(store);
  const decision = authorize({
    principal,
    permission: "pipeline:write:opportunity",
    action: "create:opp_opportunity",
  });
  if (decision.result === "deny") {
    denyPipelineAudit(store, principal, "pipeline:write:opportunity", "opp_opportunity", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const org = store.crmOrganizations.find(
    (o) => o.id === input.organizationId && o.tenantId === principal.tenantId && !o.archivedAt,
  );
  if (!org) return { error: "invalid_request" as const, reason: "invalid_organization" };

  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };

  const code = input.opportunityCode?.trim();
  if (!code) return { error: "invalid_request" as const, reason: "opportunity_code_required" };
  if (store.oppOpportunities.some((o) => o.tenantId === principal.tenantId && o.opportunityCode === code)) {
    return { error: "conflict" as const, reason: "duplicate_opportunity_code" };
  }

  const now = new Date().toISOString();
  const opp: OppOpportunity = {
    id: newId(),
    tenantId: principal.tenantId,
    opportunityCode: code,
    title,
    organizationId: input.organizationId,
    ...(input.accountId !== undefined ? { accountId: input.accountId } : {}),
    stage: "new_qualified",
    status: "open",
    ...(input.programmeSummary !== undefined ? { programmeSummary: input.programmeSummary } : {}),
    ...(input.estimatedValue !== undefined ? { estimatedValue: input.estimatedValue } : {}),
    ...(input.currency !== undefined ? { currency: input.currency } : {}),
    ...(input.paxCount !== undefined ? { paxCount: input.paxCount } : {}),
    ...(input.expectedCloseDate !== undefined ? { expectedCloseDate: input.expectedCloseDate } : {}),
    ownerPrincipalId: input.ownerPrincipalId ?? principal.id,
    classification: org.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  store.oppOpportunities.push(opp);
  store.oppStageHistory.push({
    id: newId(),
    tenantId: principal.tenantId,
    opportunityId: opp.id,
    toStage: "new_qualified",
    changedAt: now,
    changedByPrincipalId: principal.id,
  });

  allowPipelineAudit(store, principal, "pipeline:write:opportunity", "opp_opportunity", opp.id, correlationId, sanitize(opp));
  return { opportunity: sanitize(opp) };
}

export function transitionOpportunityStage(
  store: Store,
  principal: Principal,
  id: string,
  toStage: string,
  correlationId: string,
  notes?: string,
) {
  ensurePipelineCollections(store);
  const opp = findOpportunity(store, principal.tenantId, id);
  if (!opp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "pipeline:transition:stage",
    action: "transition:opp_opportunity",
    resource: { tenantId: opp.tenantId, type: "opportunity", id: opp.id, classification: opp.classification },
  });
  if (decision.result === "deny") {
    denyPipelineAudit(store, principal, "pipeline:transition:stage", "opp_opportunity", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidOpportunityStage(toStage)) {
    return { error: "invalid_request" as const, reason: "invalid_stage" };
  }
  if (!canTransitionOpportunityStage(opp.stage, toStage)) {
    return { error: "conflict" as const, reason: "invalid_stage_transition" };
  }

  const now = new Date().toISOString();
  const fromStage = opp.stage;
  opp.stage = toStage;
  opp.updatedAt = now;
  opp.updatedByPrincipalId = principal.id;
  opp.version += 1;
  if (toStage === "won") opp.status = "won";
  if (toStage === "lost") opp.status = "lost";

  store.oppStageHistory.push({
    id: newId(),
    tenantId: principal.tenantId,
    opportunityId: opp.id,
    fromStage,
    toStage,
    changedAt: now,
    changedByPrincipalId: principal.id,
    ...(notes !== undefined ? { notes } : {}),
  });

  allowPipelineAudit(store, principal, "pipeline:transition:stage", "opp_opportunity", opp.id, correlationId, {
    fromStage,
    toStage,
  });
  return { opportunity: sanitize(opp) };
}
