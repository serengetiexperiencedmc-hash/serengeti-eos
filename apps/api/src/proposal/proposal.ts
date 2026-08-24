import {
  authorize,
  buildProposalCode,
  canGenerateProposal,
  canTransitionProposalStatus,
  canTransitionRfpStage,
  COST_LINE_CATEGORY_LABELS,
  isValidProposalStatus,
  newId,
  type Principal,
  type PropProposal,
  type PropProposalSnapshot,
  type PropProposalVersion,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { allowProposalAudit, denyProposalAudit } from "./audit.js";
import { ensureProposalCollections } from "./collections.js";

function sanitizeProposal(p: PropProposal) {
  return {
    id: p.id,
    proposalCode: p.proposalCode,
    rfpId: p.rfpId,
    programmeId: p.programmeId,
    costSheetId: p.costSheetId,
    approvalRequestId: p.approvalRequestId,
    organizationId: p.organizationId,
    title: p.title,
    status: p.status,
    currency: p.currency,
    totalCost: p.totalCost,
    sellPrice: p.sellPrice,
    marginPercent: p.marginPercent,
    paxCount: p.paxCount,
    programmeSummary: p.programmeSummary,
    itineraryDayCount: p.itineraryDayCount,
    sentAt: p.sentAt,
    clientViewedAt: p.clientViewedAt,
    currentVersion: p.currentVersion,
    classification: p.classification,
    version: p.version,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function findProposal(store: Store, tenantId: string, id: string): PropProposal | undefined {
  return store.propProposals.find((p) => p.id === id && p.tenantId === tenantId && !p.archivedAt);
}

function findProposalByRfp(store: Store, tenantId: string, rfpId: string): PropProposal | undefined {
  return store.propProposals.find((p) => p.rfpId === rfpId && p.tenantId === tenantId && !p.archivedAt);
}

function buildSnapshot(store: Store, programmeId: string, costSheetId: string): PropProposalSnapshot {
  const programme = store.prgProgrammes.find((p) => p.id === programmeId);
  const days = store.prgDays.filter((d) => d.programmeId === programmeId);
  const items = store.prgItems.filter((i) => i.programmeId === programmeId);
  const sheet = store.costSheets.find((s) => s.id === costSheetId);
  const lines = store.costLineItems.filter((l) => l.costSheetId === costSheetId);
  const categoryTotals: Record<string, number> = {};
  for (const line of lines) {
    categoryTotals[COST_LINE_CATEGORY_LABELS[line.category] ?? line.category] =
      Math.round(((categoryTotals[COST_LINE_CATEGORY_LABELS[line.category] ?? line.category] ?? 0) + line.lineTotal) * 100) /
      100;
  }

  return {
    programmeTitle: programme?.title ?? "Programme",
    itineraryDayCount: days.length,
    itineraryItemCount: items.length,
    totalCost: sheet?.totalCost ?? 0,
    sellPrice: sheet?.sellPrice ?? sheet?.totalCost ?? 0,
    marginPercent: sheet?.marginPercent ?? 0,
    currency: sheet?.currency ?? "USD",
    categoryTotals,
  };
}

export function getProposalModuleHealth(store: Store, principal: Principal) {
  ensureProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:prop_proposal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const tenantId = principal.tenantId;
  const proposals = store.propProposals.filter((p) => p.tenantId === tenantId && !p.archivedAt);
  const ids = new Set(proposals.map((p) => p.id));
  return {
    module: "proposal",
    increment: "C8",
    status: "ok" as const,
    proposals: proposals.length,
    versions: store.propProposalVersions.filter((v) => v.tenantId === tenantId && ids.has(v.proposalId)).length,
  };
}

export function listProposals(
  store: Store,
  principal: Principal,
  query?: { rfpId?: string; status?: string; organizationId?: string },
) {
  ensureProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:prop_proposal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  let items = store.propProposals.filter((p) => p.tenantId === principal.tenantId && !p.archivedAt);
  if (query?.rfpId) items = items.filter((p) => p.rfpId === query.rfpId);
  if (query?.status) items = items.filter((p) => p.status === query.status);
  if (query?.organizationId) items = items.filter((p) => p.organizationId === query.organizationId);
  items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeProposal) };
}

export function getProposalDetail(store: Store, principal: Principal, id: string) {
  ensureProposalCollections(store);
  const proposal = findProposal(store, principal.tenantId, id);
  if (!proposal) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:prop_proposal",
    resource: {
      tenantId: proposal.tenantId,
      type: "proposal",
      id: proposal.id,
      classification: proposal.classification,
    },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const versions = store.propProposalVersions
    .filter((v) => v.proposalId === id)
    .sort((a, b) => b.versionNumber - a.versionNumber);

  const programme = store.prgProgrammes.find((p) => p.id === proposal.programmeId);
  const days = store.prgDays
    .filter((d) => d.programmeId === proposal.programmeId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber)
    .map((d) => ({
      dayNumber: d.dayNumber,
      title: d.title,
      location: d.location,
      items: store.prgItems
        .filter((i) => i.dayId === d.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((i) => ({ startTime: i.startTime, title: i.title, description: i.description ?? i.supplierLabel })),
    }));

  const costLines = store.costLineItems
    .filter((l) => l.costSheetId === proposal.costSheetId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => ({
      category: COST_LINE_CATEGORY_LABELS[l.category],
      description: l.description,
      lineTotal: l.lineTotal,
      currency: l.currency,
    }));

  return {
    proposal: sanitizeProposal(proposal),
    programme: programme ? { id: programme.id, title: programme.title, days } : undefined,
    costLines,
    versions,
  };
}

export function getProposalByRfp(store: Store, principal: Principal, rfpId: string) {
  ensureProposalCollections(store);
  const proposal = findProposalByRfp(store, principal.tenantId, rfpId);
  if (!proposal) return { error: "not_found" as const };
  return getProposalDetail(store, principal, proposal.id);
}

export type GenerateProposalInput = { rfpId: string; title?: string };

export function generateProposal(
  store: Store,
  principal: Principal,
  input: GenerateProposalInput,
  correlationId: string,
) {
  ensureProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:write:proposal",
    action: "generate:prop_proposal",
  });
  if (decision.result === "deny") {
    denyProposalAudit(store, principal, "proposal:write:proposal", "prop_proposal", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  const rfp = store.rfpRfps.find(
    (r) => r.id === input.rfpId && r.tenantId === principal.tenantId && !r.archivedAt,
  );
  if (!rfp) return { error: "not_found" as const, reason: "rfp_not_found" };

  if (findProposalByRfp(store, principal.tenantId, input.rfpId)) {
    return { error: "conflict" as const, reason: "proposal_exists_for_rfp" };
  }

  const programme = store.prgProgrammes.find(
    (p) => p.rfpId === input.rfpId && p.tenantId === principal.tenantId && !p.archivedAt,
  );
  const sheet = store.costSheets.find(
    (s) => s.rfpId === input.rfpId && s.tenantId === principal.tenantId && !s.archivedAt,
  );
  const approval = store.comApprovalRequests.find(
    (a) => a.rfpId === input.rfpId && a.tenantId === principal.tenantId && a.status === "approved",
  );

  const gate = canGenerateProposal({
    hasProgramme: !!programme,
    hasCostSheet: !!sheet,
    approvalStatus: approval?.status,
  });
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };

  const proposalCode = buildProposalCode(rfp.rfpCode);
  if (store.propProposals.some((p) => p.tenantId === principal.tenantId && p.proposalCode === proposalCode)) {
    return { error: "conflict" as const, reason: "duplicate_proposal_code" };
  }

  const now = new Date().toISOString();
  const snapshot = buildSnapshot(store, programme!.id, sheet!.id);
  const dayCount = store.prgDays.filter((d) => d.programmeId === programme!.id).length;

  const proposal: PropProposal = {
    id: newId(),
    tenantId: principal.tenantId,
    proposalCode,
    rfpId: rfp.id,
    programmeId: programme!.id,
    costSheetId: sheet!.id,
    approvalRequestId: approval!.id,
    organizationId: rfp.organizationId,
    title: input.title?.trim() || programme!.title,
    status: "approved",
    currency: sheet!.currency,
    totalCost: sheet!.totalCost,
    sellPrice: sheet!.sellPrice ?? sheet!.totalCost,
    marginPercent: sheet!.marginPercent,
    paxCount: sheet!.paxCount ?? programme!.paxCount,
    programmeSummary: programme!.destinations ?? rfp.destinations,
    itineraryDayCount: dayCount,
    currentVersion: 1,
    classification: rfp.classification,
    version: 1,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };

  const version: PropProposalVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    proposalId: proposal.id,
    versionNumber: 1,
    summary: "Initial proposal generated from approved programme and costing",
    snapshot,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };

  store.propProposals.push(proposal);
  store.propProposalVersions.push(version);

  allowProposalAudit(
    store,
    principal,
    "proposal:write:proposal",
    "prop_proposal",
    proposal.id,
    correlationId,
    sanitizeProposal(proposal),
  );
  return getProposalDetail(store, principal, proposal.id);
}

export function transitionProposalStatus(
  store: Store,
  principal: Principal,
  id: string,
  toStatus: string,
  correlationId: string,
) {
  ensureProposalCollections(store);
  const proposal = findProposal(store, principal.tenantId, id);
  if (!proposal) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "proposal:transition:status",
    action: "transition:prop_proposal",
    resource: {
      tenantId: proposal.tenantId,
      type: "proposal",
      id: proposal.id,
      classification: proposal.classification,
    },
  });
  if (decision.result === "deny") {
    denyProposalAudit(store, principal, "proposal:transition:status", "prop_proposal", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!isValidProposalStatus(toStatus)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  if (!canTransitionProposalStatus(proposal.status, toStatus)) {
    return { error: "conflict" as const, reason: "invalid_status_transition" };
  }

  const now = new Date().toISOString();
  const fromStatus = proposal.status;
  proposal.status = toStatus;
  proposal.updatedAt = now;
  proposal.updatedByPrincipalId = principal.id;
  proposal.version += 1;

  if (toStatus === "sent") proposal.sentAt = now;
  if (toStatus === "accepted") proposal.clientViewedAt = proposal.clientViewedAt ?? now;

  const rfp = store.rfpRfps.find((r) => r.id === proposal.rfpId && r.tenantId === principal.tenantId);
  if (rfp && toStatus === "sent" && rfp.workflowStage === "proposal" && canTransitionRfpStage("proposal", "sent")) {
    rfp.workflowStage = "sent";
    rfp.updatedAt = now;
    rfp.version += 1;
    rfp.updatedByPrincipalId = principal.id;
  }

  allowProposalAudit(store, principal, "proposal:transition:status", "prop_proposal", proposal.id, correlationId, {
    fromStatus,
    toStatus,
  });
  return { proposal: sanitizeProposal(proposal) };
}

export function createProposalVersion(
  store: Store,
  principal: Principal,
  id: string,
  summary: string,
  correlationId: string,
) {
  ensureProposalCollections(store);
  const proposal = findProposal(store, principal.tenantId, id);
  if (!proposal) return { error: "not_found" as const };

  const decision = authorize({
    principal,
    permission: "proposal:write:version",
    action: "create:prop_proposal_version",
    resource: {
      tenantId: proposal.tenantId,
      type: "proposal",
      id: proposal.id,
      classification: proposal.classification,
    },
  });
  if (decision.result === "deny") {
    denyProposalAudit(store, principal, "proposal:write:version", "prop_proposal_version", correlationId, decision.reason, id);
    return { error: "forbidden" as const, reason: decision.reason };
  }

  if (!summary?.trim()) return { error: "invalid_request" as const, reason: "summary_required" };

  const now = new Date().toISOString();
  const versionNumber = proposal.currentVersion + 1;
  const snapshot = buildSnapshot(store, proposal.programmeId, proposal.costSheetId);
  const version: PropProposalVersion = {
    id: newId(),
    tenantId: principal.tenantId,
    proposalId: proposal.id,
    versionNumber,
    summary: summary.trim(),
    snapshot,
    createdAt: now,
    createdByPrincipalId: principal.id,
  };

  proposal.currentVersion = versionNumber;
  proposal.updatedAt = now;
  proposal.version += 1;
  store.propProposalVersions.push(version);

  allowProposalAudit(store, principal, "proposal:write:version", "prop_proposal_version", version.id, correlationId, version);
  return { version, proposal: sanitizeProposal(proposal) };
}
