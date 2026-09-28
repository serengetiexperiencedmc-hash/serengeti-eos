import {
  authorize,
  buildApprovalRequestCode,
  canDecideCommercialApproval,
  canRequestCommercialApproval,
  canTransitionRfpStage,
  COMMERCIAL_APPROVAL_EVENT_TYPES,
  evaluateCommercialApprovalGate,
  marginMeetsFloor,
  newId,
  type ComApprovalRequest,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCommercialApprovalAudit, denyCommercialApprovalAudit } from "./audit.js";
import { ensureCommercialApprovalCollections } from "./collections.js";
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
import {
  countApprovals,
  findPendingApprovalForSheet,
  getApprovalById,
  insertApprovalRequest,
  listApprovalsByTenant,
  requestCodeExists,
  updateApprovalOptimistic,
} from "../persistence/commercial-approval-repository.js";
import { getCostSheetById } from "../persistence/costing-repository.js";
import { loadRfp, persistRfpStageAdvanceInTx } from "../rfp/rfp.js";

function sanitize(r: ComApprovalRequest) {
  return {
    id: r.id,
    requestCode: r.requestCode,
    costSheetId: r.costSheetId,
    rfpId: r.rfpId,
    programmeId: r.programmeId,
    organizationId: r.organizationId,
    status: r.status,
    gateType: r.gateType,
    gateReason: r.gateReason,
    marginPercent: r.marginPercent,
    marginFloorPercent: r.marginFloorPercent,
    totalCost: r.totalCost,
    sellPrice: r.sellPrice,
    currency: r.currency,
    marginMeetsFloor: r.marginMeetsFloor,
    requestedByPrincipalId: r.requestedByPrincipalId,
    decidedByPrincipalId: r.decidedByPrincipalId,
    decidedAt: r.decidedAt,
    decisionNotes: r.decisionNotes,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

async function loadRequest(store: Store, tenantId: string, id: string): Promise<ComApprovalRequest | undefined> {
  if (isMixedSqlDurable(store)) return getApprovalById(store.dbPool, tenantId, id);
  ensureCommercialApprovalCollections(store);
  return store.comApprovalRequests.find((r) => r.id === id && r.tenantId === tenantId);
}

async function deny(
  store: Store,
  principal: Principal,
  action: string,
  resourceType: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  if (isMixedSqlDurable(store)) {
    await persistDenyAudit(store, denyAuditRecord(principal, action, resourceType, correlationId, reason, resourceId));
  } else {
    denyCommercialApprovalAudit(store, principal, action, resourceType, correlationId, reason, resourceId);
  }
}

export async function getCommercialApprovalModuleHealth(store: Store, principal: Principal) {
  ensureCommercialApprovalCollections(store);
  const decision = authorize({
    principal,
    permission: "commercial:read:approval",
    action: "read:com_approval",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const counts = await countApprovals(store.dbPool, principal.tenantId);
    return { module: "commercial-approval", increment: "C7", status: "ok" as const, ...counts };
  }
  const items = store.comApprovalRequests.filter((r) => r.tenantId === principal.tenantId);
  return {
    module: "commercial-approval",
    increment: "C7",
    status: "ok" as const,
    requests: items.length,
    pending: items.filter((r) => r.status === "pending").length,
  };
}

export async function listCommercialApprovalRequests(
  store: Store,
  principal: Principal,
  query?: { costSheetId?: string; rfpId?: string; status?: string },
) {
  ensureCommercialApprovalCollections(store);
  const decision = authorize({
    principal,
    permission: "commercial:read:approval",
    action: "read:com_approval",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const items = isMixedSqlDurable(store)
    ? await listApprovalsByTenant(store.dbPool, principal.tenantId, query)
    : store.comApprovalRequests
        .filter((r) => r.tenantId === principal.tenantId)
        .filter((r) => (query?.costSheetId ? r.costSheetId === query.costSheetId : true))
        .filter((r) => (query?.rfpId ? r.rfpId === query.rfpId : true))
        .filter((r) => (query?.status ? r.status === query.status : true));
  return { items: items.map(sanitize) };
}

export async function getCommercialApprovalRequest(store: Store, principal: Principal, id: string) {
  ensureCommercialApprovalCollections(store);
  const req = await loadRequest(store, principal.tenantId, id);
  if (!req) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "commercial:read:approval",
    action: "read:com_approval",
    resource: { tenantId: req.tenantId, type: "com_approval", id: req.id, classification: req.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  return { request: sanitize(req) };
}

export async function requestCommercialApproval(
  store: Store,
  principal: Principal,
  costSheetId: string,
  correlationId: string,
  notes?: string,
) {
  ensureCommercialApprovalCollections(store);
  const decision = authorize({
    principal,
    permission: "commercial:request:approval",
    action: "request:com_approval",
  });
  if (decision.result === "deny") {
    await deny(store, principal, "commercial:request:approval", "com_approval", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const sheet = isMixedSqlDurable(store)
    ? await getCostSheetById(store.dbPool, principal.tenantId, costSheetId)
    : store.costSheets.find((s) => s.id === costSheetId && s.tenantId === principal.tenantId && !s.archivedAt);
  if (!sheet) return { error: "not_found" as const, reason: "cost_sheet_not_found" };

  if (!canRequestCommercialApproval(sheet.marginPercent, sheet.marginFloorPercent)) {
    return { error: "conflict" as const, reason: "margin_below_floor" };
  }

  const pending = isMixedSqlDurable(store)
    ? await findPendingApprovalForSheet(store.dbPool, principal.tenantId, costSheetId)
    : store.comApprovalRequests.find(
        (r) => r.costSheetId === costSheetId && r.tenantId === principal.tenantId && r.status === "pending",
      );
  if (pending) return { error: "conflict" as const, reason: "pending_approval_exists" };

  const sellPrice = sheet.sellPrice ?? sheet.totalCost;
  const gate = evaluateCommercialApprovalGate({
    marginPercent: sheet.marginPercent,
    marginFloorPercent: sheet.marginFloorPercent,
    sellPrice,
  });

  const now = new Date().toISOString();
  const requestCode = buildApprovalRequestCode(sheet.sheetCode);
  if (isMixedSqlDurable(store)) {
    if (await requestCodeExists(store.dbPool, principal.tenantId, requestCode)) {
      return { error: "conflict" as const, reason: "duplicate_request_code" };
    }
  } else if (store.comApprovalRequests.some((r) => r.tenantId === principal.tenantId && r.requestCode === requestCode)) {
    return { error: "conflict" as const, reason: "duplicate_request_code" };
  }

  const req: ComApprovalRequest = {
    id: newId(),
    tenantId: principal.tenantId,
    requestCode,
    costSheetId: sheet.id,
    rfpId: sheet.rfpId,
    programmeId: sheet.programmeId,
    organizationId: sheet.organizationId,
    status: "pending",
    gateType: gate.gateType,
    gateReason: notes?.trim() || gate.gateReason,
    marginPercent: sheet.marginPercent,
    marginFloorPercent: sheet.marginFloorPercent,
    totalCost: sheet.totalCost,
    sellPrice,
    currency: sheet.currency,
    marginMeetsFloor: marginMeetsFloor(sheet.marginPercent, sheet.marginFloorPercent),
    requestedByPrincipalId: principal.id,
    classification: sheet.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  const rfp = await loadRfp(store, principal.tenantId, sheet.rfpId);
  const advance = Boolean(rfp && rfp.workflowStage === "costing" && canTransitionRfpStage("costing", "approval"));
  const rfpExpected = rfp?.version ?? 0;
  if (advance && rfp) {
    rfp.workflowStage = "approval";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertApprovalRequest(client, req);
        if (advance && rfp) await persistRfpStageAdvanceInTx(client, rfp, rfpExpected);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "commercial:request:approval", "com_approval", req.id, correlationId, sanitize(req)),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: COMMERCIAL_APPROVAL_EVENT_TYPES[0],
          payload: { requestId: req.id, costSheetId: req.costSheetId },
          classification: req.classification,
          correlationId,
          aggregateId: req.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_request_code" };
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { request: sanitize(req) };
  }

  store.comApprovalRequests.push(req);
  allowCommercialApprovalAudit(
    store,
    principal,
    "commercial:request:approval",
    "com_approval",
    req.id,
    correlationId,
    sanitize(req),
  );
  return { request: sanitize(req) };
}

export async function decideCommercialApproval(
  store: Store,
  principal: Principal,
  id: string,
  outcome: "approved" | "rejected",
  correlationId: string,
  decisionNotes?: string,
) {
  ensureCommercialApprovalCollections(store);
  const req = await loadRequest(store, principal.tenantId, id);
  if (!req) return { error: "not_found" as const };
  if (req.status !== "pending") return { error: "conflict" as const, reason: "approval_not_pending" };

  const decision = authorize({
    principal,
    permission: "commercial:decide:approval",
    action: "decide:com_approval",
    resource: { tenantId: req.tenantId, type: "com_approval", id: req.id, classification: req.classification },
  });
  if (decision.result === "deny") {
    await deny(store, principal, "commercial:decide:approval", "com_approval", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const sod = canDecideCommercialApproval(req.requestedByPrincipalId, principal.id);
  if (!sod.allowed) {
    await deny(store, principal, "commercial:decide:approval", "com_approval", correlationId, sod.reason!, id);
    return { error: "forbidden" as const, reason: sod.reason };
  }

  const now = new Date().toISOString();
  const expectedVersion = req.version;
  req.status = outcome === "approved" ? "approved" : "rejected";
  req.decidedByPrincipalId = principal.id;
  req.decidedAt = now;
  req.updatedAt = now;
  req.version += 1;
  if (decisionNotes?.trim()) req.decisionNotes = decisionNotes.trim();

  const rfp = await loadRfp(store, principal.tenantId, req.rfpId);
  const advance = Boolean(
    rfp && outcome === "approved" && rfp.workflowStage === "approval" && canTransitionRfpStage("approval", "proposal"),
  );
  const rfpExpected = rfp?.version ?? 0;
  if (advance && rfp) {
    rfp.workflowStage = "proposal";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        const updated = await updateApprovalOptimistic(client, req, expectedVersion);
        if (updated === 0) throw new OptimisticConcurrencyError("com_approval");
        if (advance && rfp) await persistRfpStageAdvanceInTx(client, rfp, rfpExpected);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(principal, "commercial:decide:approval", "com_approval", req.id, correlationId, {
            outcome,
            request: sanitize(req),
          }),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: outcome === "approved" ? COMMERCIAL_APPROVAL_EVENT_TYPES[1] : COMMERCIAL_APPROVAL_EVENT_TYPES[2],
          payload: { requestId: req.id, outcome },
          classification: req.classification,
          correlationId,
          aggregateId: req.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (error instanceof OptimisticConcurrencyError) return { error: "conflict" as const, reason: "stale_version" };
      throw error;
    }
    return { request: sanitize(req) };
  }

  allowCommercialApprovalAudit(store, principal, "commercial:decide:approval", "com_approval", req.id, correlationId, {
    outcome,
    request: sanitize(req),
  });
  return { request: sanitize(req) };
}
