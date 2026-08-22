import {
  authorize,
  canTransitionRfpStage,
  computeSlaStatus,
  isValidRfpWorkflowStage,
  newId,
  RFP_WORKFLOW_LABELS,
  RFP_WORKFLOW_STAGES,
  type Principal,
  type RfpRecord,
  type RfpVersion,
  type RfpWorkflowStage,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowRfpAudit, denyRfpAudit } from "./audit.js";
import { ensureRfpCollections } from "./collections.js";

function sanitizeRfp(r: RfpRecord) {
  const slaStatus = r.slaDueAt ? computeSlaStatus(r.slaDueAt) : undefined;
  return {
    id: r.id,
    rfpCode: r.rfpCode,
    opportunityId: r.opportunityId,
    organizationId: r.organizationId,
    title: r.title,
    workflowStage: r.workflowStage,
    status: r.status,
    programmeType: r.programmeType,
    paxCount: r.paxCount,
    travelDates: r.travelDates,
    destinations: r.destinations,
    budgetMin: r.budgetMin,
    budgetMax: r.budgetMax,
    currency: r.currency,
    requirementsText: r.requirementsText,
    slaDueAt: r.slaDueAt,
    slaStatus,
    assignedPrincipalId: r.assignedPrincipalId,
    currentVersion: r.currentVersion,
    classification: r.classification,
    version: r.version,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function findRfp(store: Store, tenantId: string, id: string): RfpRecord | undefined {
  return store.rfpRfps.find((r) => r.id === id && r.tenantId === tenantId && !r.archivedAt);
}

export function getRfpModuleHealth(store: Store) {
  ensureRfpCollections(store);
  return {
    module: "rfp",
    increment: "C3",
    status: "ok" as const,
    rfps: store.rfpRfps.filter((r) => !r.archivedAt).length,
    versions: store.rfpVersions.length,
  };
}

export function listRfpWorkflowStages() {
  return {
    items: RFP_WORKFLOW_STAGES.map((stage) => ({
      key: stage,
      label: RFP_WORKFLOW_LABELS[stage],
    })),
  };
}

export function listRfps(
  store: Store,
  principal: Principal,
  query?: { opportunityId?: string; workflowStage?: string; status?: string },
) {
  ensureRfpCollections(store);
  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.rfpRfps.filter((r) => r.tenantId === principal.tenantId && !r.archivedAt);
  if (query?.opportunityId) items = items.filter((r) => r.opportunityId === query.opportunityId);
  if (query?.workflowStage) {
    if (!isValidRfpWorkflowStage(query.workflowStage)) {
      return { error: "invalid_request" as const, reason: "invalid_workflow_stage" };
    }
    items = items.filter((r) => r.workflowStage === query.workflowStage);
  }
  if (query?.status) items = items.filter((r) => r.status === query.status);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeRfp) };
}

export function getRfp(store: Store, principal: Principal, id: string) {
  ensureRfpCollections(store);
  const rfp = findRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const versions = store.rfpVersions
    .filter((v) => v.rfpId === id)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  return { rfp: sanitizeRfp(rfp), versions };
}

export type CreateRfpInput = {
  rfpCode: string;
  opportunityId: string;
  title: string;
  programmeType?: string;
  paxCount?: number;
  travelDates?: string;
  destinations?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  requirementsText?: string;
  slaDueAt?: string;
  assignedPrincipalId?: string;
  initialVersionSummary?: string;
};

export function createRfp(store: Store, principal: Principal, input: CreateRfpInput, correlationId: string) {
  ensureRfpCollections(store);
  const decision = authorize({
    principal,
    permission: "rfp:write:rfp",
    action: "create:rfp",
  });
  if (decision.result === "deny") {
    denyRfpAudit(store, principal, "rfp:write:rfp", "rfp", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const opp = store.oppOpportunities.find(
    (o) => o.id === input.opportunityId && o.tenantId === principal.tenantId && !o.archivedAt,
  );
  if (!opp) return { error: "invalid_request" as const, reason: "invalid_opportunity" };

  const code = input.rfpCode?.trim();
  if (!code) return { error: "invalid_request" as const, reason: "rfp_code_required" };
  if (store.rfpRfps.some((r) => r.tenantId === principal.tenantId && r.rfpCode === code)) {
    return { error: "conflict" as const, reason: "duplicate_rfp_code" };
  }

  const now = new Date().toISOString();
  const slaDueAt = input.slaDueAt ?? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const rfp: RfpRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    rfpCode: code,
    opportunityId: input.opportunityId,
    organizationId: opp.organizationId,
    title: input.title.trim(),
    workflowStage: "intake",
    status: "active",
    ...(input.programmeType !== undefined ? { programmeType: input.programmeType } : {}),
    ...(input.paxCount !== undefined ? { paxCount: input.paxCount } : {}),
    ...(input.travelDates !== undefined ? { travelDates: input.travelDates } : {}),
    ...(input.destinations !== undefined ? { destinations: input.destinations } : {}),
    ...(input.budgetMin !== undefined ? { budgetMin: input.budgetMin } : {}),
    ...(input.budgetMax !== undefined ? { budgetMax: input.budgetMax } : {}),
    currency: input.currency ?? "USD",
    ...(input.requirementsText !== undefined ? { requirementsText: input.requirementsText } : {}),
    slaDueAt,
    slaStatus: computeSlaStatus(slaDueAt),
    assignedPrincipalId: input.assignedPrincipalId ?? principal.id,
    currentVersion: 1,
    classification: opp.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const version: RfpVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    rfpId: rfp.id,
    versionNumber: 1,
    summary: input.initialVersionSummary ?? "Initial RFP intake",
    createdAt: now,
    createdByPrincipalId: principal.id,
  };

  store.rfpRfps.push(rfp);
  store.rfpVersions.push(version);

  if (opp.stage === "new_qualified") {
    opp.stage = "rfp_received";
    opp.updatedAt = now;
    opp.version += 1;
    store.oppStageHistory.push({
      id: newId(),
      tenantId: principal.tenantId,
      opportunityId: opp.id,
      fromStage: "new_qualified",
      toStage: "rfp_received",
      changedAt: now,
      changedByPrincipalId: principal.id,
      notes: `RFP ${code} created`,
    });
  }

  allowRfpAudit(store, principal, "rfp:write:rfp", "rfp", rfp.id, correlationId, sanitizeRfp(rfp));
  return { rfp: sanitizeRfp(rfp), version };
}

export function transitionRfpStage(
  store: Store,
  principal: Principal,
  id: string,
  toStage: string,
  correlationId: string,
) {
  ensureRfpCollections(store);
  const rfp = findRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:transition:stage",
    action: "transition:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") {
    denyRfpAudit(store, principal, "rfp:transition:stage", "rfp", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidRfpWorkflowStage(toStage)) {
    return { error: "invalid_request" as const, reason: "invalid_workflow_stage" };
  }
  if (!canTransitionRfpStage(rfp.workflowStage, toStage)) {
    return { error: "conflict" as const, reason: "invalid_stage_transition" };
  }

  const now = new Date().toISOString();
  const fromStage = rfp.workflowStage;
  rfp.workflowStage = toStage;
  rfp.updatedAt = now;
  rfp.updatedByPrincipalId = principal.id;
  rfp.version += 1;
  if (toStage === "closed") rfp.status = "closed";
  if (rfp.slaDueAt) rfp.slaStatus = computeSlaStatus(rfp.slaDueAt);

  allowRfpAudit(store, principal, "rfp:transition:stage", "rfp", rfp.id, correlationId, {
    fromStage,
    toStage,
  });
  return { rfp: sanitizeRfp(rfp) };
}

export function createRfpVersion(
  store: Store,
  principal: Principal,
  id: string,
  summary: string,
  correlationId: string,
) {
  ensureRfpCollections(store);
  const rfp = findRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:write:version",
    action: "create:rfp_version",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") {
    denyRfpAudit(store, principal, "rfp:write:version", "rfp_version", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const now = new Date().toISOString();
  const versionNumber = rfp.currentVersion + 1;
  const version: RfpVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    rfpId: rfp.id,
    versionNumber,
    summary: summary.trim(),
    createdAt: now,
    createdByPrincipalId: principal.id,
  };

  rfp.currentVersion = versionNumber;
  rfp.updatedAt = now;
  rfp.version += 1;
  store.rfpVersions.push(version);

  allowRfpAudit(store, principal, "rfp:write:version", "rfp_version", version.id, correlationId, version);
  return { version, rfp: sanitizeRfp(rfp) };
}

export function refreshRfpSlaStatuses(store: Store, tenantId: string): void {
  ensureRfpCollections(store);
  for (const rfp of store.rfpRfps) {
    if (rfp.tenantId === tenantId && rfp.slaDueAt && rfp.status === "active") {
      rfp.slaStatus = computeSlaStatus(rfp.slaDueAt);
    }
  }
}
