import {
  authorize,
  canMutateKri,
  canPatchKriStatus,
  isValidKriStatus,
  newId,
  nextKriCode,
  type ErmKri,
  type KriStatus,
  type Principal,
} from "@sedmc/kernel";
import { ensureErmCollections } from "../erm/collections.js";
import type { Store } from "../store.js";
import { ensureErmKriCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateKri(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ErmKriView = {
  id: string;
  kriCode: string;
  title: string;
  status: KriStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  riskCode?: string;
};

function resolveRiskCode(store: Store, tenantId: string, riskId?: string): string | undefined {
  if (!riskId) return undefined;
  return store.ermRisks.find((r) => r.id === riskId && r.tenantId === tenantId)?.riskCode;
}

function sanitize(store: Store, row: ErmKri): ErmKriView {
  const view: ErmKriView = {
    id: row.id,
    kriCode: row.kriCode,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  if (row.riskId) {
    view.riskId = row.riskId;
    const code = resolveRiskCode(store, row.tenantId, row.riskId);
    if (code) view.riskCode = code;
  }
  return view;
}

function optionalText(
  value: string | null | undefined,
  max: number,
  tooLong: "notes_too_long",
): { ok: true; value?: string } | { error: "invalid"; reason: "notes_too_long" } {
  if (value === undefined || value === null) return { ok: true };
  const trimmed = value.trim();
  if (trimmed.length > max) return { error: "invalid", reason: tooLong };
  if (!trimmed) return { ok: true };
  return { ok: true, value: trimmed };
}

function optionalOwnerLabel(value: string | null | undefined): { ok: true; value?: string } {
  if (value === undefined || value === null) return { ok: true };
  const trimmed = value.trim();
  if (!trimmed) return { ok: true };
  return { ok: true, value: trimmed };
}

function resolveRiskId(
  store: Store,
  principal: Principal,
  riskId: string | null | undefined,
): { ok: true; riskId?: string } | { error: "invalid"; reason: "risk_not_found" } {
  if (riskId === undefined) return { ok: true };
  if (riskId === null) return { ok: true };
  const trimmed = String(riskId).trim();
  if (!trimmed) return { ok: true };
  ensureErmCollections(store);
  const row = store.ermRisks.find((r) => r.id === trimmed && r.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "risk_not_found" };
  return { ok: true, riskId: trimmed };
}

export function getErmKrisHealth(store: Store, principal: Principal) {
  ensureErmKriCollections(store);
  const decision = authorize({
    principal,
    permission: "erm:read:kri",
    action: "read:erm_kris_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.ermKris.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "erm-kris" as const,
    increment: "E1" as const,
    status: "ok" as const,
    kris: items.length,
    openKris: items.filter((row) => row.status === "open").length,
  };
}

export function listErmKris(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureErmKriCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:read:kri",
    action: "list:erm_kri",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidKriStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.ermKris
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q || `${row.kriCode} ${row.title} ${row.notes ?? ""} ${row.ownerLabel ?? ""}`.toLowerCase().includes(q),
    )
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return a.kriCode < b.kriCode ? 1 : a.kriCode > b.kriCode ? -1 : 0;
    })
    .map((row) => sanitize(store, row));
  return { items };
}

export function getErmKri(store: Store, principal: Principal, id: string) {
  ensureErmKriCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:read:kri",
    action: "get:erm_kri",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.ermKris.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { kri: sanitize(store, row) };
}

export function createErmKri(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string | null;
    status?: string;
  },
) {
  ensureErmKriCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:write:kri",
    action: "create:erm_kri",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const ownerLabel = optionalOwnerLabel(input.ownerLabel);
  const risk = resolveRiskId(store, principal, input.riskId);
  if ("error" in risk) return risk;
  const now = new Date().toISOString();
  const row: ErmKri = {
    id: newId(),
    tenantId: principal.tenantId,
    kriCode: nextKriCode(
      store.ermKris.filter((item) => item.tenantId === principal.tenantId).map((item) => item.kriCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  if (ownerLabel.value) row.ownerLabel = ownerLabel.value;
  if (risk.riskId) row.riskId = risk.riskId;
  store.ermKris.push(row);
  return { kri: sanitize(store, row) };
}

export function patchErmKri(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    riskId?: string | null;
    status?: string;
  },
) {
  ensureErmKriCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:write:kri",
    action: "patch:erm_kri",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.ermKris.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "retired") return { error: "conflict" as const, reason: "retired" };
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
  if (input.ownerLabel !== undefined) {
    const ownerLabel = optionalOwnerLabel(input.ownerLabel);
    if (ownerLabel.value) row.ownerLabel = ownerLabel.value;
    else delete row.ownerLabel;
  }
  if (input.riskId !== undefined) {
    const risk = resolveRiskId(store, principal, input.riskId);
    if ("error" in risk) return risk;
    if (risk.riskId) row.riskId = risk.riskId;
    else delete row.riskId;
  }
  if (input.status !== undefined) {
    if (!isValidKriStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchKriStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { kri: sanitize(store, row) };
}
