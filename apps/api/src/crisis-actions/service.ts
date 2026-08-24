import {
  authorize,
  canMutateCrisisAction,
  canTransitionCrisisAction,
  isValidCrisisActionStatus,
  newId,
  nextCrisisActionCode,
  type CrisisAction,
  type CrisisActionStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureCrisisActionCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateCrisisAction(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type CrisisActionView = {
  id: string;
  actionCode: string;
  title: string;
  status: CrisisActionStatus;
  ownerLabel?: string;
  notes?: string;
  crisisId: string;
  crisisCode?: string;
};

function resolveCrisisCode(store: Store, tenantId: string, crisisId: string): string | undefined {
  return store.crisisCases.find((row) => row.id === crisisId && row.tenantId === tenantId)?.crisisCode;
}

function sanitize(store: Store, row: CrisisAction): CrisisActionView {
  const view: CrisisActionView = {
    id: row.id,
    actionCode: row.actionCode,
    title: row.title,
    status: row.status,
    crisisId: row.crisisId,
  };
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  if (row.notes) view.notes = row.notes;
  const code = resolveCrisisCode(store, row.tenantId, row.crisisId);
  if (code) view.crisisCode = code;
  return view;
}

function resolveOpenCrisisId(
  store: Store,
  principal: Principal,
  crisisId: string | undefined,
):
  | { ok: true; crisisId: string }
  | { error: "invalid"; reason: "crisis_not_found" }
  | { error: "conflict"; reason: "case_closed" } {
  const trimmed = crisisId?.trim() ?? "";
  if (!trimmed) return { error: "invalid", reason: "crisis_not_found" };
  const row = store.crisisCases.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "crisis_not_found" };
  if (row.status === "closed") return { error: "conflict", reason: "case_closed" };
  return { ok: true, crisisId: trimmed };
}

export function getCrisisActionsHealth(store: Store, principal: Principal) {
  ensureCrisisActionCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:action",
    action: "read:crisis_actions_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.crisisActions.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "crisis-actions",
    increment: "K2" as const,
    status: "ok" as const,
    actions: items.length,
    openActions: items.filter((row) => row.status === "open").length,
  };
}

export function listCrisisActions(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; crisisId?: string },
) {
  ensureCrisisActionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:read:action",
    action: "list:crisis_action",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidCrisisActionStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const crisisId = query?.crisisId?.trim();
  const items = store.crisisActions
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !crisisId || row.crisisId === crisisId)
    .filter(
      (row) =>
        !q || `${row.actionCode} ${row.title} ${row.ownerLabel ?? ""} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getCrisisAction(store: Store, principal: Principal, id: string) {
  ensureCrisisActionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:read:action",
    action: "get:crisis_action",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.crisisActions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { action: sanitize(store, row) };
}

export function createCrisisAction(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    ownerLabel?: string;
    notes?: string;
    crisisId?: string;
  },
) {
  ensureCrisisActionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:action",
    action: "create:crisis_action",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const ownerLabel = input.ownerLabel?.trim();
  if (ownerLabel && ownerLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "owner_label_too_long" };
  }
  const notes = input.notes?.trim();
  if (notes && notes.length > TEXT_MAX) return { error: "invalid" as const, reason: "notes_too_long" };
  const crisis = resolveOpenCrisisId(store, principal, input.crisisId);
  if ("error" in crisis) return crisis;
  const now = new Date().toISOString();
  const row: CrisisAction = {
    id: newId(),
    tenantId: principal.tenantId,
    actionCode: nextCrisisActionCode(
      store.crisisActions.filter((item) => item.tenantId === principal.tenantId).map((item) => item.actionCode),
    ),
    title,
    status: "open",
    crisisId: crisis.crisisId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (ownerLabel) row.ownerLabel = ownerLabel;
  if (notes) row.notes = notes;
  store.crisisActions.push(row);
  return { action: sanitize(store, row) };
}

export function patchCrisisAction(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    ownerLabel?: string;
    notes?: string;
  },
) {
  ensureCrisisActionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:action",
    action: "patch:crisis_action",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.crisisActions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "done") return { error: "conflict" as const, reason: "done" };
  if (row.status === "cancelled") return { error: "conflict" as const, reason: "cancelled" };
  const parent = resolveOpenCrisisId(store, principal, row.crisisId);
  if ("error" in parent) return parent;
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel.length > LABEL_MAX) {
      return { error: "invalid" as const, reason: "owner_label_too_long" };
    }
    if (ownerLabel) row.ownerLabel = ownerLabel;
    else delete row.ownerLabel;
  }
  if (input.notes !== undefined) {
    const notes = input.notes.trim();
    if (notes.length > TEXT_MAX) return { error: "invalid" as const, reason: "notes_too_long" };
    if (notes) row.notes = notes;
    else delete row.notes;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { action: sanitize(store, row) };
}

export function transitionCrisisAction(
  store: Store,
  principal: Principal,
  id: string,
  action: "complete" | "cancel",
) {
  ensureCrisisActionCollections(store);
  const auth = authorize({
    principal,
    permission: "crisis:write:action",
    action: `transition:crisis_action:${action}`,
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.crisisActions.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const parent = resolveOpenCrisisId(store, principal, row.crisisId);
  if ("error" in parent) return parent;
  const next = canTransitionCrisisAction(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { action: sanitize(store, row) };
}
