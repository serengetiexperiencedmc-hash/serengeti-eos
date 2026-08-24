import {
  authorize,
  canMutateObligation,
  canTransitionObligation,
  isValidObligationStatus,
  newId,
  nextObligationCode,
  type ComplianceObligation,
  type ObligationStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureComplianceCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateObligation(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ComplianceObligationView = {
  id: string;
  obligationCode: string;
  title: string;
  status: ObligationStatus;
  ownerLabel?: string;
};

function sanitize(row: ComplianceObligation): ComplianceObligationView {
  const view: ComplianceObligationView = {
    id: row.id,
    obligationCode: row.obligationCode,
    title: row.title,
    status: row.status,
  };
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  return view;
}

export function getComplianceHealth(store: Store, principal: Principal) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:read:obligation",
    action: "read:compliance_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.complianceObligations.filter((o) => o.tenantId === principal.tenantId);
  return {
    module: "compliance",
    increment: "G1" as const,
    status: "ok" as const,
    obligations: items.length,
    openObligations: items.filter((o) => o.status !== "closed").length,
  };
}

export function listObligations(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:read:obligation",
    action: "list:compliance_obligation",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidObligationStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.complianceObligations
    .filter((o) => o.tenantId === principal.tenantId)
    .filter((o) => !query?.status || o.status === query.status)
    .filter((o) => !q || `${o.obligationCode} ${o.title} ${o.ownerLabel ?? ""}`.toLowerCase().includes(q))
    .map(sanitize);
  return { items };
}

export function getObligation(store: Store, principal: Principal, id: string) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:read:obligation",
    action: "get:compliance_obligation",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.complianceObligations.find((o) => o.id === id && o.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { obligation: sanitize(row) };
}

export function createObligation(
  store: Store,
  principal: Principal,
  input: { title?: string; ownerLabel?: string },
) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:write:obligation",
    action: "create:compliance_obligation",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const ownerLabel = input.ownerLabel?.trim();
  if (ownerLabel && ownerLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "owner_label_too_long" };
  }
  const now = new Date().toISOString();
  const row: ComplianceObligation = {
    id: newId(),
    tenantId: principal.tenantId,
    obligationCode: nextObligationCode(
      store.complianceObligations.filter((o) => o.tenantId === principal.tenantId).map((o) => o.obligationCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (ownerLabel) row.ownerLabel = ownerLabel;
  store.complianceObligations.push(row);
  return { obligation: sanitize(row) };
}

export function patchObligation(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; ownerLabel?: string },
) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:write:obligation",
    action: "patch:compliance_obligation",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.complianceObligations.find((o) => o.id === id && o.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel.length > LABEL_MAX) return { error: "invalid" as const, reason: "owner_label_too_long" };
    if (ownerLabel) row.ownerLabel = ownerLabel;
    else delete row.ownerLabel;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { obligation: sanitize(row) };
}

export function transitionObligation(
  store: Store,
  principal: Principal,
  id: string,
  action: "activate" | "close",
) {
  ensureComplianceCollections(store);
  const decision = authorize({
    principal,
    permission: "compliance:write:obligation",
    action: `transition:compliance_obligation:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.complianceObligations.find((o) => o.id === id && o.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionObligation(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { obligation: sanitize(row) };
}
