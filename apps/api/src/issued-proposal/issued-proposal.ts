import {
  authorize,
  type CostLineItem,
  type CostSheet,
  type IssuedProposal,
  type Principal,
} from "@sedmc/kernel";
import { composeH203ClientPrice } from "@sedmc/kernel/h203-commercial-policy";
import {
  createIssuedProposal,
  ISSUED_PROPOSAL_DELIVERY,
  clientIssueApprovalAuthority,
  issuedIdentityDistinctFromC8,
  pickIssuedClientSafe,
  principalMayAuthorizeClientIssue,
  programmeEligibleForClientIssue,
} from "@sedmc/kernel/issued-proposal";
import type { Store } from "../store.js";
import { recordAudit } from "../store.js";
import { findLatestApprovedApprovalForProgramme } from "../persistence/commercial-approval-repository.js";
import { listCostLineItems, listCostSheetsByTenant } from "../persistence/costing-repository.js";
import {
  allowAuditRecord,
  insertChainedAudit,
  isMixedSqlDurable,
  isUniqueViolation,
  rememberPostCommit,
  runDurableTx,
} from "../persistence/durable.js";
import {
  getIssuedProposalById,
  insertIssuedProposal,
  listIssuedProposalsByTenant,
} from "../persistence/issued-proposal-repository.js";
import {
  getProgrammeById,
  listProgrammeDays,
  listProgrammeItems,
  listProgrammeVersions,
} from "../persistence/programme-repository.js";
import { getProposalById } from "../persistence/proposal-repository.js";
import { ensureIssuedProposalCollections } from "./collections.js";

function denyIssuedAudit(
  store: Store,
  principal: Principal,
  action: string,
  correlationId: string,
  reason: string,
  resourceId?: string,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType: "issued_proposal",
    ...(resourceId !== undefined ? { resourceId } : {}),
    correlationId,
    authorization: "deny",
    evidence: { reason },
  });
}

function allowIssuedAudit(
  store: Store,
  principal: Principal,
  action: string,
  resourceId: string,
  correlationId: string,
  newState: unknown,
) {
  recordAudit(store, {
    tenantId: principal.tenantId,
    occurredAt: new Date().toISOString(),
    actorType: principal.actorType,
    actorPrincipalId: principal.id,
    action,
    resourceType: "issued_proposal",
    resourceId,
    correlationId,
    authorization: "allow",
    evidence: { newState },
  });
}

function composeIssuedClientPrice(sheet: CostSheet, lines: CostLineItem[]) {
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

function sanitizeIssued(record: IssuedProposal) {
  return {
    issuedProposal: {
      id: record.id,
      issuedCode: record.issuedCode,
      kind: record.kind,
      programmeId: record.programmeId,
      rfpId: record.rfpId,
      ...(record.c8ProposalId !== undefined ? { c8ProposalId: record.c8ProposalId } : {}),
      programmeCommercialVersionLabel: record.programmeCommercialVersionLabel,
      ...(record.programmeVersionNumber !== undefined
        ? { programmeVersionNumber: record.programmeVersionNumber }
        : {}),
      ...(record.programmeVersionId !== undefined ? { programmeVersionId: record.programmeVersionId } : {}),
      issuedAt: record.issuedAt,
      issuedByPrincipalId: record.issuedByPrincipalId,
      approvalAuthority: record.approvalAuthority,
      ...(record.approvalRequestId !== undefined ? { approvalRequestId: record.approvalRequestId } : {}),
      approvalRecordedAt: record.approvalRecordedAt,
      immutable: true as const,
      createdAt: record.createdAt,
    },
    clientSafe: pickIssuedClientSafe(record.clientSafe as unknown as Record<string, unknown>),
    delivery: ISSUED_PROPOSAL_DELIVERY,
  };
}

async function loadProgramme(store: Store, tenantId: string, programmeId: string) {
  if (isMixedSqlDurable(store)) {
    const persisted = await getProgrammeById(store.dbPool, tenantId, programmeId);
    if (persisted) return persisted;
  }
  return store.prgProgrammes.find((p) => p.id === programmeId && p.tenantId === tenantId && !p.archivedAt);
}

async function loadProgrammeGraph(store: Store, tenantId: string, programmeId: string) {
  const memory = {
    days: store.prgDays.filter((d) => d.programmeId === programmeId && d.tenantId === tenantId),
    items: store.prgItems.filter((i) => i.programmeId === programmeId && i.tenantId === tenantId),
    versions: store.prgProgrammeVersions.filter((v) => v.programmeId === programmeId && v.tenantId === tenantId),
  };
  if (isMixedSqlDurable(store)) {
    const [days, items, versions] = await Promise.all([
      listProgrammeDays(store.dbPool, tenantId, programmeId),
      listProgrammeItems(store.dbPool, tenantId, programmeId),
      listProgrammeVersions(store.dbPool, tenantId, programmeId),
    ]);
    if (days.length > 0 || items.length > 0 || versions.length > 0) {
      return { days, items, versions };
    }
  }
  return memory;
}

async function loadCostSheetForProgramme(store: Store, tenantId: string, programmeId: string, rfpId: string) {
  if (isMixedSqlDurable(store)) {
    const persisted = (await listCostSheetsByTenant(store.dbPool, tenantId, { programmeId }))[0];
    if (persisted) return persisted;
  }
  return store.costSheets.find(
    (s) => s.programmeId === programmeId && s.rfpId === rfpId && s.tenantId === tenantId && !s.archivedAt,
  );
}

async function loadCostLines(store: Store, tenantId: string, costSheetId: string) {
  const memory = store.costLineItems.filter((l) => l.costSheetId === costSheetId && l.tenantId === tenantId);
  if (isMixedSqlDurable(store)) {
    const persisted = await listCostLineItems(store.dbPool, tenantId, costSheetId);
    if (persisted.length > 0) return persisted;
  }
  return memory;
}

async function loadC8Proposal(store: Store, tenantId: string, id: string) {
  if (isMixedSqlDurable(store)) {
    const persisted = await getProposalById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  return store.propProposals.find((p) => p.id === id && p.tenantId === tenantId && !p.archivedAt);
}

async function loadApprovedApproval(store: Store, tenantId: string, programmeId: string) {
  if (isMixedSqlDurable(store)) {
    const persisted = await findLatestApprovedApprovalForProgramme(store.dbPool, tenantId, programmeId);
    if (persisted) return persisted;
  }
  return store.comApprovalRequests
    .filter((r) => r.tenantId === tenantId && r.programmeId === programmeId && r.status === "approved")
    .sort((a, b) => (b.decidedAt ?? b.updatedAt).localeCompare(a.decidedAt ?? a.updatedAt))[0];
}

export function listIssuedProposalRoutes(): string[] {
  return ["/v1/issued-proposals", "/v1/issued-proposals/:id"];
}

export function unauthorizedClientIssueRoutes(): string[] {
  return [
    "/v1/client/issued-proposals",
    "/v1/client/proposals",
    "/v1/public/issued-proposals",
    "/v1/issued-proposals/:id/download",
    "/v1/issued-proposals/:id/pdf",
  ];
}

export async function issueProposal(
  store: Store,
  principal: Principal,
  input: { programmeId: string; c8ProposalId?: string },
  correlationId: string,
) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:write:proposal",
    action: "issue:issued_proposal",
  });
  if (decision.result === "deny") {
    denyIssuedAudit(store, principal, "issue:issued_proposal", correlationId, decision.reason);
    return { error: "forbidden" as const, reason: decision.reason };
  }
  if (!principalMayAuthorizeClientIssue(principal)) {
    denyIssuedAudit(store, principal, "issue:issued_proposal", correlationId, "commercial_issue_approval_required");
    return { error: "forbidden" as const, reason: "commercial_issue_approval_required" };
  }
  const approvalAuthority = clientIssueApprovalAuthority(principal);
  if (!approvalAuthority) {
    denyIssuedAudit(store, principal, "issue:issued_proposal", correlationId, "commercial_issue_approval_required");
    return { error: "forbidden" as const, reason: "commercial_issue_approval_required" };
  }

  const programme = await loadProgramme(store, principal.tenantId, input.programmeId);
  if (!programme) return { error: "not_found" as const, reason: "programme_not_found" };

  const eligibility = programmeEligibleForClientIssue(programme.commercialVersionLabel);
  if (!eligibility.allowed) {
    denyIssuedAudit(
      store,
      principal,
      "issue:issued_proposal",
      correlationId,
      eligibility.reason,
      programme.id,
    );
    return { error: "conflict" as const, reason: eligibility.reason };
  }

  const sheet = await loadCostSheetForProgramme(store, principal.tenantId, programme.id, programme.rfpId);
  if (!sheet) return { error: "invalid_request" as const, reason: "cost_sheet_required" };

  let c8ProposalId = input.c8ProposalId;
  let c8ApprovalRequestId: string | undefined;
  if (c8ProposalId) {
    const c8 = await loadC8Proposal(store, principal.tenantId, c8ProposalId);
    if (!c8 || c8.programmeId !== programme.id) {
      return { error: "invalid_request" as const, reason: "c8_proposal_mismatch" };
    }
    c8ApprovalRequestId = c8.approvalRequestId;
  }

  const graph = await loadProgrammeGraph(store, principal.tenantId, programme.id);
  const lines = await loadCostLines(store, principal.tenantId, sheet.id);
  const composed = composeIssuedClientPrice(sheet, lines);
  const latestVersion = graph.versions.reduce<
    { versionNumber: number; id?: string } | undefined
  >((max, v) => {
    if (!max || v.versionNumber > max.versionNumber) return { versionNumber: v.versionNumber, id: v.id };
    return max;
  }, undefined);

  let approvalRequestId = c8ApprovalRequestId;
  if (!approvalRequestId) {
    const approved = await loadApprovedApproval(store, principal.tenantId, programme.id);
    if (approved) approvalRequestId = approved.id;
  }

  const created = createIssuedProposal({
    tenantId: principal.tenantId,
    programme,
    days: graph.days,
    items: graph.items,
    currency: sheet.currency,
    clientSellingPrice: composed.clientSellingPrice,
    issuedBy: principal,
    approvalAuthority,
    ...(latestVersion !== undefined ? { programmeVersionNumber: latestVersion.versionNumber } : {}),
    ...(latestVersion?.id !== undefined ? { programmeVersionId: latestVersion.id } : {}),
    ...(c8ProposalId !== undefined ? { c8ProposalId } : {}),
    ...(approvalRequestId !== undefined ? { approvalRequestId } : {}),
  });
  if ("error" in created) {
    denyIssuedAudit(store, principal, "issue:issued_proposal", correlationId, created.error, programme.id);
    return { error: "conflict" as const, reason: created.error };
  }
  if (c8ProposalId && !issuedIdentityDistinctFromC8(created.id, c8ProposalId)) {
    return { error: "conflict" as const, reason: "issued_identity_must_be_distinct_from_c8" };
  }

  if (isMixedSqlDurable(store)) {
    try {
      const committed = await runDurableTx(store, async (client) => {
        await insertIssuedProposal(client, created);
        const audit = await insertChainedAudit(
          client,
          allowAuditRecord(
            principal,
            "issue:issued_proposal",
            "issued_proposal",
            created.id,
            correlationId,
            { issuedCode: created.issuedCode, programmeId: created.programmeId },
          ),
        );
        return { audit };
      });
      rememberPostCommit(store, committed.audit);
    } catch (error) {
      if (isUniqueViolation(error)) return { error: "conflict" as const, reason: "duplicate_issued_code" };
      throw error;
    }
    store.issuedProposals.push(created);
    return sanitizeIssued(created);
  }

  store.issuedProposals.push(created);
  allowIssuedAudit(store, principal, "issue:issued_proposal", created.id, correlationId, {
    issuedCode: created.issuedCode,
    programmeId: created.programmeId,
  });
  return sanitizeIssued(created);
}

export async function listIssuedProposals(
  store: Store,
  principal: Principal,
  query?: { programmeId?: string },
) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_proposal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  if (isMixedSqlDurable(store)) {
    const items = await listIssuedProposalsByTenant(store.dbPool, principal.tenantId, query);
    return { items: items.map(sanitizeIssued) };
  }
  const items = store.issuedProposals
    .filter((p) => p.tenantId === principal.tenantId)
    .filter((p) => (query?.programmeId ? p.programmeId === query.programmeId : true))
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
    .map(sanitizeIssued);
  return { items };
}

export async function loadIssuedProposalRecord(
  store: Store,
  tenantId: string,
  id: string,
): Promise<IssuedProposal | undefined> {
  ensureIssuedProposalCollections(store);
  if (isMixedSqlDurable(store)) {
    const persisted = await getIssuedProposalById(store.dbPool, tenantId, id);
    if (persisted) return persisted;
  }
  return store.issuedProposals.find((p) => p.id === id && p.tenantId === tenantId);
}

export async function getIssuedProposal(store: Store, principal: Principal, id: string) {
  ensureIssuedProposalCollections(store);
  const decision = authorize({
    principal,
    permission: "proposal:read:proposal",
    action: "read:issued_proposal",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const record = await loadIssuedProposalRecord(store, principal.tenantId, id);
  if (!record) return { error: "not_found" as const };
  return sanitizeIssued(record);
}
