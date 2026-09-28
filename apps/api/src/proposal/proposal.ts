import {
  authorize,
  buildProposalCode,
  canGenerateProposal,
  canTransitionProposalStatus,
  canTransitionRfpStage,
  COST_LINE_CATEGORY_LABELS,
  isValidProposalStatus,
  newId,
  PROPOSAL_EVENT_TYPES,
  type CostLineItem,
  type CostSheet,
  type Principal,
  type PropProposal,
  type PropProposalSnapshot,
  type PropProposalVersion,
} from "@sedmc/kernel";
import { composeH203ClientPrice } from "@sedmc/kernel/h203-commercial-policy";
import type { Store } from "../store.js";
import { allowProposalAudit, denyProposalAudit } from "./audit.js";
import { ensureProposalCollections } from "./collections.js";
import { evaluatePreviewPathBSend } from "../commercial-facts/path-b.js";
import { isF2Dp01PersistEnabled } from "../commercial-facts/persist.js";
import { listApprovalsByTenant } from "../persistence/commercial-approval-repository.js";
import { listCostLineItems, listCostSheetsByTenant } from "../persistence/costing-repository.js";
import {
  allowAuditRecord,
  denyAuditRecord,
  insertChainedAudit,
  insertDomainOutbox,
  isDurableSoR,
  isMixedSqlDurable,
  isUniqueViolation,
  persistDenyAudit,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import { getProgrammeByRfpId, listProgrammeDays, listProgrammeItems } from "../persistence/programme-repository.js";
import {
  getProposalById,
  getProposalByRfpId as getStoredProposalByRfpId,
  insertProposal,
  insertProposalVersion,
  listProposalsByTenant,
  listProposalVersions,
  proposalCodeExists,
} from "../persistence/proposal-repository.js";
import { getRfpById } from "../persistence/rfp-repository.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

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
    clientFacing: {
      currency: p.currency,
      clientSellingPrice: p.sellPrice,
    },
    sentAt: p.sentAt,
    clientViewedAt: p.clientViewedAt,
    currentVersion: p.currentVersion,
    classification: p.classification,
    version: p.version,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function sanitizeVersion(v: PropProposalVersion) {
  return {
    id: v.id,
    proposalId: v.proposalId,
    versionNumber: v.versionNumber,
    summary: v.summary,
    snapshot: v.snapshot,
    createdAt: v.createdAt,
    createdByPrincipalId: v.createdByPrincipalId,
  };
}

function findProposal(store: Store, tenantId: string, id: string): PropProposal | undefined {
  return store.propProposals.find((p) => p.id === id && p.tenantId === tenantId && !p.archivedAt);
}

function findProposalByRfp(store: Store, tenantId: string, rfpId: string): PropProposal | undefined {
  return store.propProposals.find((p) => p.rfpId === rfpId && p.tenantId === tenantId && !p.archivedAt);
}

async function loadProposal(store: Store, tenantId: string, id: string): Promise<PropProposal | undefined> {
  if (isMixedSqlDurable(store)) {
    const persisted = await getProposalById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  ensureProposalCollections(store);
  return findProposal(store, tenantId, id);
}

async function loadProposalByRfp(store: Store, tenantId: string, rfpId: string): Promise<PropProposal | undefined> {
  if (isMixedSqlDurable(store)) {
    const persisted = await getStoredProposalByRfpId(store.dbPool, tenantId, rfpId);
    if (persisted) return persisted;
  }
  ensureProposalCollections(store);
  return findProposalByRfp(store, tenantId, rfpId);
}

function composeProposalClientPrice(sheet: CostSheet, lines: CostLineItem[]) {
  return composeH203ClientPrice({
    lines: lines.map((l) => ({ category: l.category, lineTotal: l.lineTotal })),
    currency: sheet.currency,
    ...(sheet.markupPercent !== undefined ? { markupPercent: sheet.markupPercent } : {}),
    ...(sheet.sellPrice !== undefined ? { sellPriceOverride: sheet.sellPrice } : {}),
    ...(sheet.paxCount !== undefined ? { paxCount: sheet.paxCount } : {}),
    ...(sheet.fileFeeAmount !== undefined ? { fileFeeAmount: sheet.fileFeeAmount } : {}),
    ...(sheet.taxMode !== undefined ? { taxMode: sheet.taxMode } : {}),
    ...(sheet.taxRatePercent !== undefined ? { taxRatePercent: sheet.taxRatePercent } : {}),
    ...(sheet.taxMode === "amount" && sheet.taxAmount !== undefined ? { taxAmountEntered: sheet.taxAmount } : {}),
  });
}

function snapshotFrom(input: {
  programmeTitle: string;
  dayCount: number;
  itemCount: number;
  sheet: CostSheet;
  lines: CostLineItem[];
}): PropProposalSnapshot {
  const composed = composeProposalClientPrice(input.sheet, input.lines);
  const categoryTotals: Record<string, number> = {};
  for (const line of input.lines) {
    const label = COST_LINE_CATEGORY_LABELS[line.category] ?? line.category;
    categoryTotals[label] = Math.round(((categoryTotals[label] ?? 0) + line.lineTotal) * 100) / 100;
  }
  return {
    programmeTitle: input.programmeTitle,
    itineraryDayCount: input.dayCount,
    itineraryItemCount: input.itemCount,
    totalCost: composed.totalCost,
    sellPrice: composed.clientSellingPrice,
    marginPercent: composed.marginPercent,
    currency: input.sheet.currency ?? "USD",
    categoryTotals,
  };
}

function buildSnapshot(store: Store, programmeId: string, costSheetId: string): PropProposalSnapshot {
  const programme = store.prgProgrammes.find((p) => p.id === programmeId);
  const days = store.prgDays.filter((d) => d.programmeId === programmeId);
  const items = store.prgItems.filter((i) => i.programmeId === programmeId);
  const sheet = store.costSheets.find((s) => s.id === costSheetId);
  const lines = store.costLineItems.filter((l) => l.costSheetId === costSheetId);
  if (!sheet) {
    return {
      programmeTitle: programme?.title ?? "Programme",
      itineraryDayCount: days.length,
      itineraryItemCount: items.length,
      totalCost: 0,
      sellPrice: 0,
      marginPercent: 0,
      currency: "USD",
      categoryTotals: {},
    };
  }
  return snapshotFrom({
    programmeTitle: programme?.title ?? "Programme",
    dayCount: days.length,
    itemCount: items.length,
    sheet,
    lines,
  });
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
    denyProposalAudit(store, principal, action, resourceType, correlationId, reason, resourceId);
  }
}

export async function getProposalModuleHealth(store: Store, principal: Principal) {
  ensureProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:prop_proposal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const tenantId = principal.tenantId;
  const proposals = isMixedSqlDurable(store)
    ? await listProposalsByTenant(store.dbPool, tenantId)
    : store.propProposals.filter((p) => p.tenantId === tenantId && !p.archivedAt);
  const ids = new Set(proposals.map((p) => p.id));
  const versions = isMixedSqlDurable(store)
    ? (
        await Promise.all(proposals.map((p) => listProposalVersions(store.dbPool, tenantId, p.id)))
      ).reduce((n, list) => n + list.length, 0)
    : store.propProposalVersions.filter((v) => v.tenantId === tenantId && ids.has(v.proposalId)).length;
  return {
    module: "proposal",
    increment: "C8",
    status: "ok" as const,
    proposals: proposals.length,
    versions,
  };
}

export async function listProposals(
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

  const items = isMixedSqlDurable(store)
    ? await listProposalsByTenant(store.dbPool, principal.tenantId, query)
    : store.propProposals
        .filter((p) => p.tenantId === principal.tenantId && !p.archivedAt)
        .filter((p) => (query?.rfpId ? p.rfpId === query.rfpId : true))
        .filter((p) => (query?.status ? p.status === query.status : true))
        .filter((p) => (query?.organizationId ? p.organizationId === query.organizationId : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map(sanitizeProposal) };
}

export async function getProposalDetail(store: Store, principal: Principal, id: string) {
  ensureProposalCollections(store);
  const proposal = await loadProposal(store, principal.tenantId, id);
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

  const versions = (
    isMixedSqlDurable(store)
      ? await listProposalVersions(store.dbPool, proposal.tenantId, id)
      : store.propProposalVersions.filter((v) => v.proposalId === id && v.tenantId === proposal.tenantId)
  )
    .sort((a, b) => b.versionNumber - a.versionNumber)
    .map(sanitizeVersion);

  const programme = isMixedSqlDurable(store)
    ? undefined
    : store.prgProgrammes.find((p) => p.id === proposal.programmeId);
  const days = isMixedSqlDurable(store)
    ? (await listProgrammeDays(store.dbPool, proposal.tenantId, proposal.programmeId))
        .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber)
    : store.prgDays
        .filter((d) => d.programmeId === proposal.programmeId)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.dayNumber - b.dayNumber);
  const items = isMixedSqlDurable(store)
    ? await listProgrammeItems(store.dbPool, proposal.tenantId, proposal.programmeId)
    : store.prgItems.filter((i) => i.programmeId === proposal.programmeId);
  const mappedDays = days.map((d) => ({
    dayNumber: d.dayNumber,
    title: d.title,
    location: d.location,
    items: items
      .filter((i) => i.dayId === d.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((i) => ({ startTime: i.startTime, title: i.title, description: i.description ?? i.supplierLabel })),
  }));

  const costLines = (
    isMixedSqlDurable(store)
      ? await listCostLineItems(store.dbPool, proposal.tenantId, proposal.costSheetId)
      : store.costLineItems.filter((l) => l.costSheetId === proposal.costSheetId)
  )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => ({
      category: COST_LINE_CATEGORY_LABELS[l.category],
      description: l.description,
      lineTotal: l.lineTotal,
      currency: l.currency,
    }));

  const pathB = evaluatePreviewPathBSend(store, proposal.rfpId);

  return {
    proposal: sanitizeProposal(proposal),
    pathBApproval: {
      required: pathB.required,
      status: pathB.status,
      categories: pathB.categories,
    },
    programme: programme
      ? { id: programme.id, title: programme.title, days: mappedDays }
      : mappedDays.length > 0
        ? { id: proposal.programmeId, title: versions[0]?.snapshot.programmeTitle ?? "Programme", days: mappedDays }
        : undefined,
    costLines,
    versions,
  };
}

export async function getProposalByRfp(store: Store, principal: Principal, rfpId: string) {
  ensureProposalCollections(store);
  const proposal = await loadProposalByRfp(store, principal.tenantId, rfpId);
  if (!proposal) return { error: "not_found" as const };
  return getProposalDetail(store, principal, proposal.id);
}

export type GenerateProposalInput = { rfpId: string; title?: string };

export async function generateProposal(
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
    await deny(store, principal, "proposal:write:proposal", "prop_proposal", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const rfp = isMixedSqlDurable(store)
    ? ((await getRfpById(store.dbPool, principal.tenantId, input.rfpId)) ??
      store.rfpRfps.find((r) => r.id === input.rfpId && r.tenantId === principal.tenantId && !r.archivedAt))
    : store.rfpRfps.find((r) => r.id === input.rfpId && r.tenantId === principal.tenantId && !r.archivedAt);
  if (!rfp) return { error: "not_found" as const, reason: "rfp_not_found" };

  if (await loadProposalByRfp(store, principal.tenantId, input.rfpId)) {
    return { error: "conflict" as const, reason: "proposal_exists_for_rfp" };
  }

  const programme = isMixedSqlDurable(store)
    ? ((await getProgrammeByRfpId(store.dbPool, principal.tenantId, input.rfpId)) ??
      store.prgProgrammes.find((p) => p.rfpId === input.rfpId && p.tenantId === principal.tenantId && !p.archivedAt))
    : store.prgProgrammes.find((p) => p.rfpId === input.rfpId && p.tenantId === principal.tenantId && !p.archivedAt);
  const sheet = isMixedSqlDurable(store)
    ? ((await listCostSheetsByTenant(store.dbPool, principal.tenantId, { rfpId: input.rfpId }))[0] ??
      store.costSheets.find((s) => s.rfpId === input.rfpId && s.tenantId === principal.tenantId && !s.archivedAt))
    : store.costSheets.find((s) => s.rfpId === input.rfpId && s.tenantId === principal.tenantId && !s.archivedAt);
  const approval = isMixedSqlDurable(store)
    ? ((
        await listApprovalsByTenant(store.dbPool, principal.tenantId, {
          rfpId: input.rfpId,
          status: "approved",
        })
      )[0] ??
      store.comApprovalRequests.find(
        (a) => a.rfpId === input.rfpId && a.tenantId === principal.tenantId && a.status === "approved",
      ))
    : store.comApprovalRequests.find(
        (a) => a.rfpId === input.rfpId && a.tenantId === principal.tenantId && a.status === "approved",
      );

  if (isDurableSoR(store) && !isF2Dp01PersistEnabled(store)) {
    const gate = canGenerateProposal({
      hasProgramme: !!programme,
      hasCostSheet: !!sheet,
      ...(approval?.status ? { approvalStatus: approval.status } : {}),
    });
    if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };
  } else {
    const pathB = evaluatePreviewPathBSend(store, rfp.id);
    if (!pathB.allowed) {
      return { error: "conflict" as const, reason: pathB.reason ?? "path_b_approval_required" };
    }
    const gate = canGenerateProposal({
      hasProgramme: !!programme,
      hasCostSheet: !!sheet,
      approvalStatus: "approved",
    });
    if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };
  }

  if (!programme || !sheet) {
    return { error: "conflict" as const, reason: !programme ? "programme_required" : "cost_sheet_required" };
  }

  const proposalCode = buildProposalCode(rfp.rfpCode);
  const codeTaken = isMixedSqlDurable(store)
    ? await proposalCodeExists(store.dbPool, principal.tenantId, proposalCode)
    : store.propProposals.some((p) => p.tenantId === principal.tenantId && p.proposalCode === proposalCode);
  if (codeTaken) {
    return { error: "conflict" as const, reason: "duplicate_proposal_code" };
  }

  const now = new Date().toISOString();
  const days = isMixedSqlDurable(store)
    ? await listProgrammeDays(store.dbPool, principal.tenantId, programme.id)
    : store.prgDays.filter((d) => d.programmeId === programme.id);
  const items = isMixedSqlDurable(store)
    ? await listProgrammeItems(store.dbPool, principal.tenantId, programme.id)
    : store.prgItems.filter((i) => i.programmeId === programme.id);
  const lines = isMixedSqlDurable(store)
    ? await listCostLineItems(store.dbPool, principal.tenantId, sheet.id)
    : store.costLineItems.filter((l) => l.costSheetId === sheet.id);
  const snapshot = snapshotFrom({
    programmeTitle: programme.title,
    dayCount: days.length,
    itemCount: items.length,
    sheet,
    lines,
  });
  const dayCount = days.length;
  const composed = composeProposalClientPrice(sheet, lines);

  const proposal: PropProposal = {
    id: newId(),
    tenantId: principal.tenantId,
    proposalCode,
    rfpId: rfp.id,
    programmeId: programme.id,
    costSheetId: sheet.id,
    ...(approval ? { approvalRequestId: approval.id } : {}),
    organizationId: rfp.organizationId,
    title: input.title?.trim() || programme.title,
    status: "approved",
    currency: sheet.currency,
    totalCost: composed.totalCost,
    sellPrice: composed.clientSellingPrice,
    marginPercent: composed.marginPercent,
    ...((): object => {
      const paxCount = sheet.paxCount ?? programme.paxCount;
      return paxCount !== undefined ? { paxCount } : {};
    })(),
    ...((): object => {
      const programmeSummary = programme.destinations ?? rfp.destinations;
      return programmeSummary !== undefined ? { programmeSummary } : {};
    })(),
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

  if (isMixedSqlDurable(store) && proposal.approvalRequestId) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertProposal(client, proposal);
        await insertProposalVersion(client, version);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "proposal:write:proposal",
            "prop_proposal",
            proposal.id,
            correlationId,
            sanitizeProposal(proposal),
          ),
        );
        const outbox = await insertDomainOutbox(client, {
          principal,
          eventType: PROPOSAL_EVENT_TYPES[0],
          payload: { proposalId: proposal.id, rfpId: proposal.rfpId, proposalCode: proposal.proposalCode },
          classification: proposal.classification,
          correlationId,
          aggregateId: proposal.id,
        });
        return { audit, outbox };
      });
      rememberPostCommit(store, committed.audit, committed.outbox);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_proposal_code" };
      throw error;
    }
    store.propProposals.push(proposal);
    store.propProposalVersions.push(version);
    return getProposalDetail(store, principal, proposal.id);
  }

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

  if (toStatus === "sent") {
    const pathB = evaluatePreviewPathBSend(store, proposal.rfpId);
    if (!pathB.allowed) {
      return { error: "conflict" as const, reason: pathB.reason ?? "path_b_approval_required" };
    }
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
