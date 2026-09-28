import {
  authorize,
  canDecideCommercialApproval,
  evaluatePathBApprovalRequirement,
  isPathBExceptionalApprovalCategory,
  type PathBExceptionalApprovalCategory,
  type Principal,
} from "@sedmc/kernel";
import { isDurableSoR } from "../persistence/durable.js";
import type { Store } from "../store.js";
import { f2FactsMemory, type F2PathBApproval, type F2PathBStatus } from "./memory.js";
import { f2Dp01DurablePreviewBlock, f2FactsPersistenceMeta, isF2Dp01PersistEnabled, readPathB, writePathB } from "./persist.js";
import { lookupOpportunity, lookupRfp } from "./entity-lookup.js";
import { rejectPersonDomainContent } from "../personal-data-content-contract.js";

const IN_MEMORY_ONLY = { error: "conflict" as const, reason: "f2_i3_in_memory_preview_only" };

function defaultPathB(rfpId: string, tenantId: string, now: string, actorPrincipalId: string): F2PathBApproval {
  return {
    rfpId,
    tenantId,
    categories: [],
    required: false,
    status: "not_required",
    updatedAt: now,
    updatedByPrincipalId: actorPrincipalId,
  };
}

export function pathBView(record: F2PathBApproval, context?: {
  qualificationStatus?: string;
  primarySource?: string;
  channel?: string;
  followUpOwnerPrincipalId?: string;
  legacyCollapsedSourceAuthoritativeForF2?: false;
}) {
  return {
    rfpId: record.rfpId,
    required: record.required,
    status: record.status,
    categories: record.categories,
    requestedByPrincipalId: record.requestedByPrincipalId,
    decidedAt: record.decidedAt,
    decidedByPrincipalId: record.decidedByPrincipalId,
    decisionNotes: record.decisionNotes,
    commercialFacts: {
      qualificationStatus: context?.qualificationStatus,
      primarySource: context?.primarySource,
      channel: context?.channel,
      followUpOwnerPrincipalId: context?.followUpOwnerPrincipalId,
      legacyCollapsedSourceAuthoritativeForF2: false as const,
    },
  };
}

async function commercialContext(store: Store, rfpId: string, tenantId: string) {
  const mem = f2FactsMemory(store);
  const rfpFacts = mem.rfps.get(rfpId);
  const rfp = await lookupRfp(store, tenantId, rfpId);
  const opportunity = rfp ? await lookupOpportunity(store, tenantId, rfp.opportunityId) : undefined;
  const oppFacts = opportunity ? mem.opportunities.get(opportunity.id) : undefined;
  const ctx: {
    qualificationStatus?: string;
    primarySource?: string;
    channel?: string;
    followUpOwnerPrincipalId?: string;
    legacyCollapsedSourceAuthoritativeForF2: false;
  } = { legacyCollapsedSourceAuthoritativeForF2: false };
  if (oppFacts?.qualificationStatus) ctx.qualificationStatus = oppFacts.qualificationStatus;
  if (rfpFacts?.primarySource) ctx.primarySource = rfpFacts.primarySource;
  if (rfpFacts?.channel) ctx.channel = rfpFacts.channel;
  const followUp = oppFacts?.followUpOwnerPrincipalId ?? opportunity?.ownerPrincipalId;
  if (followUp) ctx.followUpOwnerPrincipalId = followUp;
  return ctx;
}

/**
 * Path B eligibility for generate and send.
 * Categories are declared, never inferred from sell price/margin.
 * On eos_gateb / Production-like durable stores (F2-DP-01 not enabled), this gate is skipped
 * and mixed ComApprovalRequest remains. F2-DP-01 Dev/Test uses Path B (G-04-B).
 */
export function evaluatePreviewPathBSend(
  store: Store,
  rfpId: string,
): {
  allowed: boolean;
  reason?: string;
  required: boolean;
  status: F2PathBStatus;
  categories: PathBExceptionalApprovalCategory[];
} {
  if (isDurableSoR(store) && !isF2Dp01PersistEnabled(store)) {
    return { allowed: true, required: false, status: "not_required", categories: [] };
  }
  const record = f2FactsMemory(store).pathB.get(rfpId);
  if (!record || !record.required) {
    return { allowed: true, required: false, status: "not_required", categories: record?.categories ?? [] };
  }
  if (record.status !== "approved") {
    return {
      allowed: false,
      reason: "path_b_approval_required",
      required: true,
      status: record.status,
      categories: record.categories,
    };
  }
  return { allowed: true, required: true, status: "approved", categories: record.categories };
}

export async function getPathBApproval(store: Store, principal: Principal, rfpId: string) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const rfp = await lookupRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "rfp:read:rfp",
    action: "read:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const stored = await readPathB(store, rfp.tenantId, rfpId);
  const record = stored ?? defaultPathB(rfp.id, rfp.tenantId, rfp.createdAt, rfp.createdByPrincipalId);
  return {
    pathB: pathBView(record, await commercialContext(store, rfpId, principal.tenantId)),
    persistence: f2FactsPersistenceMeta(store, Boolean(stored)),
  };
}

export async function putPathBCategories(
  store: Store,
  principal: Principal,
  rfpId: string,
  input: { categories?: string[] },
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const rfp = await lookupRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const decision = authorize({
    principal,
    permission: "rfp:write:rfp",
    action: "update:rfp",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };
  const personContent = rejectPersonDomainContent(input);
  if (personContent) return personContent;

  const raw = input.categories ?? [];
  for (const category of raw) {
    if (!isPathBExceptionalApprovalCategory(category)) {
      return { error: "invalid_request" as const, reason: "invalid_path_b_category" };
    }
  }
  const requirement = evaluatePathBApprovalRequirement(raw as PathBExceptionalApprovalCategory[]);
  const now = new Date().toISOString();
  const next: F2PathBApproval = {
    rfpId: rfp.id,
    tenantId: rfp.tenantId,
    categories: requirement.categories,
    required: requirement.required,
    status: requirement.required ? "pending" : "not_required",
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  if (requirement.required) next.requestedByPrincipalId = principal.id;
  await writePathB(store, next);
  return {
    pathB: pathBView(next, await commercialContext(store, rfpId, principal.tenantId)),
    persistence: f2FactsPersistenceMeta(store, true),
  };
}

export async function decidePathBApproval(
  store: Store,
  principal: Principal,
  rfpId: string,
  input: { outcome: "approved" | "rejected"; notes?: string },
) {
  const blocked = f2Dp01DurablePreviewBlock(store, IN_MEMORY_ONLY.reason);
  if (blocked) return blocked;
  const rfp = await lookupRfp(store, principal.tenantId, rfpId);
  if (!rfp) return { error: "not_found" as const };
  const record = await readPathB(store, rfp.tenantId, rfpId);
  if (!record || !record.required) return { error: "conflict" as const, reason: "path_b_approval_not_required" };
  if (record.status !== "pending") return { error: "conflict" as const, reason: "path_b_approval_not_pending" };

  const decision = authorize({
    principal,
    permission: "commercial:decide:approval",
    action: "decide:com_approval",
    resource: { tenantId: rfp.tenantId, type: "rfp", id: rfp.id, classification: rfp.classification },
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if (record.requestedByPrincipalId) {
    const sod = canDecideCommercialApproval(record.requestedByPrincipalId, principal.id);
    if (!sod.allowed) return { error: "forbidden" as const, reason: sod.reason };
  }

  const now = new Date().toISOString();
  const next: F2PathBApproval = {
    ...record,
    status: input.outcome === "approved" ? "approved" : "rejected",
    decidedAt: now,
    decidedByPrincipalId: principal.id,
    updatedAt: now,
    updatedByPrincipalId: principal.id,
  };
  if (input.notes?.trim()) next.decisionNotes = input.notes.trim();
  await writePathB(store, next);
  return {
    pathB: pathBView(next, await commercialContext(store, rfpId, principal.tenantId)),
    persistence: f2FactsPersistenceMeta(store, true),
  };
}
