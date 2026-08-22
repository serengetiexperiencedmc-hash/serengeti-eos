import {
  authorize,
  buildApprovalRequestCode,
  canDecideCommercialApproval,
  canRequestCommercialApproval,
  canTransitionRfpStage,
  evaluateCommercialApprovalGate,
  marginMeetsFloor,
  newId,
  type ComApprovalRequest,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowCommercialApprovalAudit, denyCommercialApprovalAudit } from "./audit.js";
import { ensureCommercialApprovalCollections } from "./collections.js";

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

function findRequest(store: Store, tenantId: string, id: string): ComApprovalRequest | undefined {
  return store.comApprovalRequests.find((r) => r.id === id && r.tenantId === tenantId);
}

function findPendingForSheet(store: Store, tenantId: string, costSheetId: string): ComApprovalRequest | undefined {
  return store.comApprovalRequests.find(
    (r) => r.costSheetId === costSheetId && r.tenantId === tenantId && r.status === "pending",
  );
}

export function getCommercialApprovalModuleHealth(store: Store) {
  ensureCommercialApprovalCollections(store);
  return {
    module: "commercial-approval",
    increment: "C7",
    status: "ok" as const,
    requests: store.comApprovalRequests.length,
    pending: store.comApprovalRequests.filter((r) => r.status === "pending").length,
  };
}

export function listCommercialApprovalRequests(
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

  let items = store.comApprovalRequests.filter((r) => r.tenantId === principal.tenantId);
  if (query?.costSheetId) items = items.filter((r) => r.costSheetId === query.costSheetId);
  if (query?.rfpId) items = items.filter((r) => r.rfpId === query.rfpId);
  if (query?.status) items = items.filter((r) => r.status === query.status);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitize) };
}

export function getCommercialApprovalRequest(store: Store, principal: Principal, id: string) {
  ensureCommercialApprovalCollections(store);
  const req = findRequest(store, principal.tenantId, id);
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

export function requestCommercialApproval(
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
    denyCommercialApprovalAudit(store, principal, "commercial:request:approval", "com_approval", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const sheet = store.costSheets.find(
    (s) => s.id === costSheetId && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  if (!sheet) return { error: "not_found" as const, reason: "cost_sheet_not_found" };

  if (!canRequestCommercialApproval(sheet.marginPercent, sheet.marginFloorPercent)) {
    return { error: "conflict" as const, reason: "margin_below_floor" };
  }

  if (findPendingForSheet(store, principal.tenantId, costSheetId)) {
    return { error: "conflict" as const, reason: "pending_approval_exists" };
  }

  const sellPrice = sheet.sellPrice ?? sheet.totalCost;
  const gate = evaluateCommercialApprovalGate({
    marginPercent: sheet.marginPercent,
    marginFloorPercent: sheet.marginFloorPercent,
    sellPrice,
  });

  const now = new Date().toISOString();
  const requestCode = buildApprovalRequestCode(sheet.sheetCode);
  if (store.comApprovalRequests.some((r) => r.tenantId === principal.tenantId && r.requestCode === requestCode)) {
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

  store.comApprovalRequests.push(req);

  const rfp = store.rfpRfps.find((r) => r.id === sheet.rfpId && r.tenantId === principal.tenantId);
  if (rfp && rfp.workflowStage === "costing" && canTransitionRfpStage("costing", "approval")) {
    rfp.workflowStage = "approval";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

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

export function decideCommercialApproval(
  store: Store,
  principal: Principal,
  id: string,
  outcome: "approved" | "rejected",
  correlationId: string,
  decisionNotes?: string,
) {
  ensureCommercialApprovalCollections(store);
  const req = findRequest(store, principal.tenantId, id);
  if (!req) return { error: "not_found" as const };
  if (req.status !== "pending") return { error: "conflict" as const, reason: "approval_not_pending" };

  const decision = authorize({
    principal,
    permission: "commercial:decide:approval",
    action: "decide:com_approval",
    resource: { tenantId: req.tenantId, type: "com_approval", id: req.id, classification: req.classification },
  });
  if (decision.result === "deny") {
    denyCommercialApprovalAudit(store, principal, "commercial:decide:approval", "com_approval", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const sod = canDecideCommercialApproval(req.requestedByPrincipalId, principal.id);
  if (!sod.allowed) {
    denyCommercialApprovalAudit(store, principal, "commercial:decide:approval", "com_approval", correlationId, sod.reason!, id);
    return { error: "forbidden" as const, reason: sod.reason };
  }

  const now = new Date().toISOString();
  req.status = outcome === "approved" ? "approved" : "rejected";
  req.decidedByPrincipalId = principal.id;
  req.decidedAt = now;
  req.updatedAt = now;
  req.version += 1;
  if (decisionNotes?.trim()) req.decisionNotes = decisionNotes.trim();

  const rfp = store.rfpRfps.find((r) => r.id === req.rfpId && r.tenantId === principal.tenantId);
  if (rfp && outcome === "approved" && rfp.workflowStage === "approval" && canTransitionRfpStage("approval", "proposal")) {
    rfp.workflowStage = "proposal";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  allowCommercialApprovalAudit(store, principal, "commercial:decide:approval", "com_approval", req.id, correlationId, {
    outcome,
    request: sanitize(req),
  });
  return { request: sanitize(req) };
}
