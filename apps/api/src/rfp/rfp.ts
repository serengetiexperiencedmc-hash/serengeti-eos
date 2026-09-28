import {
  authorize,
  canTransitionRfpStage,
  computeSlaStatus,
  isValidRfpWorkflowStage,
  newId,
  RFP_EVENT_TYPES,
  RFP_WORKFLOW_LABELS,
  RFP_WORKFLOW_STAGES,
  type Principal,
  type RfpRecord,
  type RfpVersion,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowRfpAudit, denyRfpAudit } from "./audit.js";
import { ensureRfpCollections } from "./collections.js";
import {
  allowAuditRecord,
  denyAuditRecord,
  insertChainedAudit,
  insertDomainOutbox,
  isMixedSqlDurable,
  isUniqueViolation,
  OptimisticConcurrencyError,
  persistDenyAudit,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import { getOpportunityById } from "../persistence/opportunity-repository.js";
import { persistOpportunityStageAdvanceInTx } from "../pipeline/opportunity.js";
import {
  countRfps,
  getRfpById,
  insertRfp,
  insertRfpVersion,
  listRfpVersions,
  listRfpsByTenant,
  rfpCodeExists,
  updateRfpOptimistic,
} from "../persistence/rfp-repository.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

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
    notes: r.notes,
    source: r.source,
    receivedAt: r.receivedAt,
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

function sanitizeVersion(v: RfpVersion) {
  return {
    id: v.id,
    rfpId: v.rfpId,
    versionNumber: v.versionNumber,
    summary: v.summary,
    createdAt: v.createdAt,
    createdByPrincipalId: v.createdByPrincipalId,
  };
}

function findRfpMemory(store: Store, tenantId: string, id: string): RfpRecord | undefined {
  return store.rfpRfps.find((r) => r.id === id && r.tenantId === tenantId && !r.archivedAt);
}

export async function loadRfp(store: Store, tenantId: string, id: string): Promise<RfpRecord | undefined> {
  if (isMixedSqlDurable(store)) return getRfpById(store.dbPool, tenantId, id);
  ensureRfpCollections(store);
  return findRfpMemory(store, tenantId, id);
}

async function deny(store: Store, principal: Principal, action: string, resourceType: string, correlationId: string, reason: string, resourceId?: string) {
  if (isMixedSqlDurable(store)) {
    await persistDenyAudit(store, denyAuditRecord(principal, action, resourceType, correlationId, reason, resourceId));
  } else {
    denyRfpAudit(store, principal, action, resourceType, correlationId, reason, resourceId);
  }
}

export async function getRfpModuleHealth(store: Store, principal: Principal) {
  ensureRfpCollections(store);
  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const counts = await countRfps(store.dbPool, principal.tenantId);
    return { module: "rfp", increment: "C3", status: "ok" as const, ...counts };
  }
  const rfps = store.rfpRfps.filter((r) => r.tenantId === principal.tenantId && !r.archivedAt);
  return {
    module: "rfp",
    increment: "C3",
    status: "ok" as const,
    rfps: rfps.length,
    versions: store.rfpVersions.filter((v) => v.tenantId === principal.tenantId).length,
  };
}

export function listRfpWorkflowStages(store: Store, principal: Principal) {
  ensureRfpCollections(store);
  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return {
    items: RFP_WORKFLOW_STAGES.map((stage) => ({
      key: stage,
      label: RFP_WORKFLOW_LABELS[stage],
    })),
  };
}

export async function listRfps(
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

  if (query?.workflowStage && !isValidRfpWorkflowStage(query.workflowStage)) {
    return { error: "invalid_request" as const, reason: "invalid_workflow_stage" };
  }

  const items = isMixedSqlDurable(store)
    ? await listRfpsByTenant(store.dbPool, principal.tenantId, query)
    : store.rfpRfps
        .filter((r) => r.tenantId === principal.tenantId && !r.archivedAt)
        .filter((r) => (query?.opportunityId ? r.opportunityId === query.opportunityId : true))
        .filter((r) => (query?.workflowStage ? r.workflowStage === query.workflowStage : true))
        .filter((r) => (query?.status ? r.status === query.status : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeRfp) };
}

export async function getRfp(store: Store, principal: Principal, id: string) {
  ensureRfpCollections(store);
  const rfp = await loadRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const versions = isMixedSqlDurable(store)
    ? await listRfpVersions(store.dbPool, principal.tenantId, id)
    : store.rfpVersions
        .filter((v) => v.rfpId === id && v.tenantId === principal.tenantId)
        .sort((a, b) => b.versionNumber - a.versionNumber);

  return { rfp: sanitizeRfp(rfp), versions: versions.map(sanitizeVersion) };
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
  notes?: string;
  source?: string;
  receivedAt?: string;
  slaDueAt?: string;
  assignedPrincipalId?: string;
  initialVersionSummary?: string;
};

export async function createRfp(store: Store, principal: Principal, input: CreateRfpInput, correlationId: string) {
  ensureRfpCollections(store);
  const decision = authorize({
    principal,
    permission: "rfp:write:rfp",
    action: "create:rfp",
  });
  if (decision.result === "deny") {
    await deny(store, principal, "rfp:write:rfp", "rfp", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const opp = isMixedSqlDurable(store)
    ? await getOpportunityById(store.dbPool, principal.tenantId, input.opportunityId)
    : store.oppOpportunities.find(
        (o) => o.id === input.opportunityId && o.tenantId === principal.tenantId && !o.archivedAt,
      );
  if (!opp) return { error: "invalid_request" as const, reason: "invalid_opportunity" };

  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };

  const code = input.rfpCode?.trim();
  if (!code) return { error: "invalid_request" as const, reason: "rfp_code_required" };
  if (isMixedSqlDurable(store)) {
    if (await rfpCodeExists(store.dbPool, principal.tenantId, code)) {
      return { error: "conflict" as const, reason: "duplicate_rfp_code" };
    }
  } else if (store.rfpRfps.some((r) => r.tenantId === principal.tenantId && r.rfpCode === code)) {
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
    title,
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
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    receivedAt: input.receivedAt ?? now,
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

  const advanceOpp = opp.stage === "new_qualified";
  const oppExpectedVersion = opp.version;
  if (advanceOpp) {
    opp.stage = "rfp_received";
    opp.updatedAt = now;
    opp.version += 1;
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertRfp(client, rfp);
        await insertRfpVersion(client, version);
        if (advanceOpp) {
          await persistOpportunityStageAdvanceInTx(client, opp, {
            id: newId(),
            tenantId: principal.tenantId,
            opportunityId: opp.id,
            fromStage: "new_qualified",
            toStage: "rfp_received",
            changedAt: now,
            changedByPrincipalId: principal.id,
            notes: `RFP ${code} created`,
          }, oppExpectedVersion);
        }
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "rfp:write:rfp", "rfp", rfp.id, correlationId, sanitizeRfp(rfp)),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: RFP_EVENT_TYPES.RFP_CREATED,
          payload: { rfpId: rfp.id, rfpCode: rfp.rfpCode, opportunityId: rfp.opportunityId },
          classification: rfp.classification,
          correlationId,
          aggregateId: rfp.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_rfp_code" };
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { rfp: sanitizeRfp(rfp), version };
  }

  store.rfpRfps.push(rfp);
  store.rfpVersions.push(version);
  if (advanceOpp) {
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

export async function transitionRfpStage(
  store: Store,
  principal: Principal,
  id: string,
  toStage: string,
  correlationId: string,
) {
  ensureRfpCollections(store);
  const rfp = await loadRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:transition:stage",
    action: "transition:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "rfp:transition:stage", "rfp", correlationId, decision.reason, id);
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
  const expectedVersion = rfp.version;
  rfp.workflowStage = toStage;
  rfp.updatedAt = now;
  rfp.updatedByPrincipalId = principal.id;
  rfp.version += 1;
  if (toStage === "closed") rfp.status = "closed";
  if (rfp.slaDueAt) rfp.slaStatus = computeSlaStatus(rfp.slaDueAt);

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateRfpOptimistic(client, rfp, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("rfp");
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "rfp:transition:stage", "rfp", rfp.id, correlationId, { fromStage, toStage }),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: RFP_EVENT_TYPES.RFP_STAGE_CHANGED,
          payload: { rfpId: rfp.id, fromStage, toStage },
          classification: rfp.classification,
          correlationId,
          aggregateId: rfp.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { rfp: sanitizeRfp(rfp) };
  }

  allowRfpAudit(store, principal, "rfp:transition:stage", "rfp", rfp.id, correlationId, { fromStage, toStage });
  return { rfp: sanitizeRfp(rfp) };
}

export async function createRfpVersion(
  store: Store,
  principal: Principal,
  id: string,
  summary: string,
  correlationId: string,
) {
  ensureRfpCollections(store);
  const rfp = await loadRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:write:version",
    action: "create:rfp_version",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "rfp:write:version", "rfp_version", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const now = new Date().toISOString();
  const expectedVersion = rfp.version;
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

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateRfpOptimistic(client, rfp, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("rfp");
        await insertRfpVersion(client, version);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "rfp:write:version", "rfp_version", version.id, correlationId, sanitizeVersion(version)),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: RFP_EVENT_TYPES.RFP_VERSION_CREATED,
          payload: { rfpId: rfp.id, versionNumber },
          classification: rfp.classification,
          correlationId,
          aggregateId: rfp.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_version" };
      throw error;
    }
    return { version: sanitizeVersion(version), rfp: sanitizeRfp(rfp) };
  }

  store.rfpVersions.push(version);
  allowRfpAudit(store, principal, "rfp:write:version", "rfp_version", version.id, correlationId, sanitizeVersion(version));
  return { version: sanitizeVersion(version), rfp: sanitizeRfp(rfp) };
}

export type PatchRfpInput = {
  title?: string;
  notes?: string | null;
  source?: string | null;
  receivedAt?: string | null;
  travelDates?: string | null;
  destinations?: string | null;
  paxCount?: number | null;
  requirementsText?: string | null;
  assignedPrincipalId?: string | null;
};

export async function patchRfp(
  store: Store,
  principal: Principal,
  id: string,
  input: PatchRfpInput,
  correlationId: string,
) {
  ensureRfpCollections(store);
  const rfp = await loadRfp(store, principal.tenantId, id);
  if (!rfp) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "rfp:write:rfp",
    action: "patch:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "rfp:write:rfp", "rfp", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  if (input.title !== undefined) {
    const title = input.title?.trim();
    if (!title) return { error: "invalid_request" as const, reason: "title_required" };
    rfp.title = title;
  }
  if (input.notes !== undefined) {
    const notes = input.notes?.trim();
    if (notes) rfp.notes = notes;
    else delete rfp.notes;
  }
  if (input.source !== undefined) {
    const source = input.source?.trim();
    if (source) rfp.source = source;
    else delete rfp.source;
  }
  if (input.receivedAt !== undefined) {
    if (input.receivedAt) rfp.receivedAt = input.receivedAt;
    else delete rfp.receivedAt;
  }
  if (input.travelDates !== undefined) {
    const travelDates = input.travelDates?.trim();
    if (travelDates) rfp.travelDates = travelDates;
    else delete rfp.travelDates;
  }
  if (input.destinations !== undefined) {
    const destinations = input.destinations?.trim();
    if (destinations) rfp.destinations = destinations;
    else delete rfp.destinations;
  }
  if (input.paxCount !== undefined) {
    if (input.paxCount !== null && (typeof input.paxCount !== "number" || input.paxCount < 0)) {
      return { error: "invalid_request" as const, reason: "invalid_pax_count" };
    }
    if (input.paxCount === null) delete rfp.paxCount;
    else rfp.paxCount = input.paxCount;
  }
  if (input.requirementsText !== undefined) {
    const requirementsText = input.requirementsText?.trim();
    if (requirementsText) rfp.requirementsText = requirementsText;
    else delete rfp.requirementsText;
  }
  if (input.assignedPrincipalId !== undefined) {
    if (input.assignedPrincipalId) rfp.assignedPrincipalId = input.assignedPrincipalId;
    else delete rfp.assignedPrincipalId;
  }

  const now = new Date().toISOString();
  const expectedVersion = rfp.version;
  rfp.updatedAt = now;
  rfp.updatedByPrincipalId = principal.id;
  rfp.version += 1;

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateRfpOptimistic(client, rfp, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("rfp");
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "rfp:write:rfp", "rfp", rfp.id, correlationId, sanitizeRfp(rfp)),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { rfp: sanitizeRfp(rfp) };
  }

  allowRfpAudit(store, principal, "rfp:write:rfp", "rfp", rfp.id, correlationId, sanitizeRfp(rfp));
  return { rfp: sanitizeRfp(rfp) };
}

export { sanitizeRfp };

export function refreshRfpSlaStatuses(store: Store, tenantId: string): void {
  ensureRfpCollections(store);
  if (isMixedSqlDurable(store)) return;
  for (const rfp of store.rfpRfps) {
    if (rfp.tenantId === tenantId && rfp.slaDueAt && rfp.status === "active") {
      rfp.slaStatus = computeSlaStatus(rfp.slaDueAt);
    }
  }
}

/** Used by Programme/Costing/Approval to advance RFP workflow in the same durable transaction. */
export async function persistRfpStageAdvanceInTx(
  client: Parameters<typeof updateRfpOptimistic>[0],
  rfp: RfpRecord,
  expectedVersion: number,
): Promise<void> {
  const updated = await updateRfpOptimistic(client, rfp, expectedVersion);
  if (updated === 0) throw new OptimisticConcurrencyError("rfp");
}
