import {
  authorize,
  canMutateItLicense,
  canPatchItLicenseStatus,
  isValidItLicenseStatus,
  newId,
  nextLicenseCode,
  type ItLicense,
  type ItLicenseStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItLicenseCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateItLicense(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ItLicenseView = {
  id: string;
  licenseCode: string;
  title: string;
  status: ItLicenseStatus;
  notes?: string;
};

function sanitize(row: ItLicense): ItLicenseView {
  const view: ItLicenseView = {
    id: row.id,
    licenseCode: row.licenseCode,
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

export function getItLicensesHealth(store: Store, principal: Principal) {
  ensureItLicenseCollections(store);
  const decision = authorize({
    principal,
    permission: "license:read:register",
    action: "read:it_licenses_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.itLicenses.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "it-licenses" as const,
    increment: "ITL1" as const,
    status: "ok" as const,
    licenses: items.length,
    openLicenses: items.filter((row) => row.status === "open").length,
  };
}

export function listItLicenses(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureItLicenseCollections(store);
  const auth = authorize({
    principal,
    permission: "license:read:register",
    action: "list:it_license",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidItLicenseStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.itLicenses
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q || `${row.licenseCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitize);
  return { items };
}

export function getItLicense(store: Store, principal: Principal, id: string) {
  ensureItLicenseCollections(store);
  const auth = authorize({
    principal,
    permission: "license:read:register",
    action: "get:it_license",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.itLicenses.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { license: sanitize(row) };
}

export function createItLicense(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItLicenseCollections(store);
  const auth = authorize({
    principal,
    permission: "license:write:register",
    action: "create:it_license",
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
  const row: ItLicense = {
    id: newId(),
    tenantId: principal.tenantId,
    licenseCode: nextLicenseCode(
      store.itLicenses.filter((item) => item.tenantId === principal.tenantId).map((item) => item.licenseCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.itLicenses.push(row);
  return { license: sanitize(row) };
}

export function patchItLicense(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItLicenseCollections(store);
  const auth = authorize({
    principal,
    permission: "license:write:register",
    action: "patch:it_license",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.itLicenses.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidItLicenseStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchItLicenseStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { license: sanitize(row) };
}
