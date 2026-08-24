import {
  authorize,
  canMutateItsmChange,
  canPatchItsmChangeStatus,
  isValidItsmChangeStatus,
  newId,
  nextChangeCode,
  type ItsmChange,
  type ItsmChangeStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItsmChangeCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateItsmChange(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ItsmChangeView = {
  id: string;
  changeCode: string;
  title: string;
  status: ItsmChangeStatus;
  notes?: string;
  ciId?: string;
  ciCode?: string;
};

function resolveCiCode(store: Store, tenantId: string, ciId: string): string | undefined {
  return store.cmdbCis.find((row) => row.id === ciId && row.tenantId === tenantId)?.ciCode;
}

function sanitize(store: Store, row: ItsmChange): ItsmChangeView {
  const view: ItsmChangeView = {
    id: row.id,
    changeCode: row.changeCode,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  if (row.ciId) {
    view.ciId = row.ciId;
    const code = resolveCiCode(store, row.tenantId, row.ciId);
    if (code) view.ciCode = code;
  }
  return view;
}

function resolveOptionalCiId(
  store: Store,
  principal: Principal,
  ciId: string | undefined,
): { ok: true; ciId?: string } | { error: "invalid"; reason: "ci_not_found" } {
  if (ciId === undefined) return { ok: true };
  const trimmed = ciId.trim();
  if (!trimmed) return { ok: true };
  const row = store.cmdbCis.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "ci_not_found" };
  return { ok: true, ciId: trimmed };
}

function optionalText(
  value: string | undefined,
  max: number,
  tooLong: "notes_too_long",
): { ok: true; value?: string } | { error: "invalid"; reason: "notes_too_long" } {
  if (value === undefined) return { ok: true };
  const trimmed = value.trim();
  if (trimmed.length > max) return { error: "invalid", reason: tooLong };
  if (!trimmed) return { ok: true };
  return { ok: true, value: trimmed };
}

export function getItsmChangesHealth(store: Store, principal: Principal) {
  ensureItsmChangeCollections(store);
  const decision = authorize({
    principal,
    permission: "itsm:read:change",
    action: "read:itsm_changes_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.itsmChanges.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "itsm-changes" as const,
    increment: "ITC1" as const,
    status: "ok" as const,
    changes: items.length,
    openChanges: items.filter((row) => row.status === "open").length,
  };
}

export function listItsmChanges(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; ciId?: string },
) {
  ensureItsmChangeCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:read:change",
    action: "list:itsm_change",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidItsmChangeStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const ciId = query?.ciId?.trim();
  const items = store.itsmChanges
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !ciId || row.ciId === ciId)
    .filter(
      (row) =>
        !q ||
        `${row.changeCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getItsmChange(store: Store, principal: Principal, id: string) {
  ensureItsmChangeCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:read:change",
    action: "get:itsm_change",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.itsmChanges.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { change: sanitize(store, row) };
}

export function createItsmChange(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    ciId?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItsmChangeCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:write:change",
    action: "create:itsm_change",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const ci = resolveOptionalCiId(store, principal, input.ciId);
  if ("error" in ci) return ci;
  const now = new Date().toISOString();
  const row: ItsmChange = {
    id: newId(),
    tenantId: principal.tenantId,
    changeCode: nextChangeCode(
      store.itsmChanges.filter((item) => item.tenantId === principal.tenantId).map((item) => item.changeCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (ci.ciId) row.ciId = ci.ciId;
  if (notes.value) row.notes = notes.value;
  store.itsmChanges.push(row);
  return { change: sanitize(store, row) };
}

export function patchItsmChange(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    ciId?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItsmChangeCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:write:change",
    action: "patch:itsm_change",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.itsmChanges.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "done") return { error: "conflict" as const, reason: "done" };
  if (row.status === "cancelled") return { error: "conflict" as const, reason: "cancelled" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.notes !== undefined) {
    const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
    if ("error" in notes) return notes;
    if (notes.value) row.notes = notes.value;
    else delete row.notes;
  }
  if (input.status !== undefined) {
    if (!isValidItsmChangeStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchItsmChangeStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { change: sanitize(store, row) };
}
