import {
  authorize,
  canMutatePrivacyDpia,
  canPatchPrivacyDpiaStatus,
  isValidPrivacyDpiaStatus,
  newId,
  nextDpiaCode,
  type PrivacyDpia,
  type PrivacyDpiaStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensurePrivacyDpiaCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutatePrivacyDpia(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type PrivacyDpiaView = {
  id: string;
  dpiaCode: string;
  title: string;
  status: PrivacyDpiaStatus;
  notes?: string;
};

function sanitize(row: PrivacyDpia): PrivacyDpiaView {
  const view: PrivacyDpiaView = {
    id: row.id,
    dpiaCode: row.dpiaCode,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  return view;
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

export function getPrivacyDpiasHealth(store: Store, principal: Principal) {
  ensurePrivacyDpiaCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:dpia",
    action: "read:privacy_dpias_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.privacyDpias.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "privacy-dpias" as const,
    increment: "P2" as const,
    status: "ok" as const,
    dpias: items.length,
    openDpias: items.filter((row) => row.status === "open").length,
  };
}

export function listPrivacyDpias(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensurePrivacyDpiaCollections(store);
  const auth = authorize({
    principal,
    permission: "privacy:read:dpia",
    action: "list:privacy_dpia",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidPrivacyDpiaStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.privacyDpias
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q || `${row.dpiaCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitize);
  return { items };
}

export function getPrivacyDpia(store: Store, principal: Principal, id: string) {
  ensurePrivacyDpiaCollections(store);
  const auth = authorize({
    principal,
    permission: "privacy:read:dpia",
    action: "get:privacy_dpia",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.privacyDpias.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { dpia: sanitize(row) };
}

export function createPrivacyDpia(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensurePrivacyDpiaCollections(store);
  const auth = authorize({
    principal,
    permission: "privacy:write:dpia",
    action: "create:privacy_dpia",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const now = new Date().toISOString();
  const row: PrivacyDpia = {
    id: newId(),
    tenantId: principal.tenantId,
    dpiaCode: nextDpiaCode(
      store.privacyDpias.filter((item) => item.tenantId === principal.tenantId).map((item) => item.dpiaCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.privacyDpias.push(row);
  return { dpia: sanitize(row) };
}

export function patchPrivacyDpia(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensurePrivacyDpiaCollections(store);
  const auth = authorize({
    principal,
    permission: "privacy:write:dpia",
    action: "patch:privacy_dpia",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.privacyDpias.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidPrivacyDpiaStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchPrivacyDpiaStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { dpia: sanitize(row) };
}
