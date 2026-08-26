import {
  authorize,
  canMutateItAsset,
  canPatchItAssetStatus,
  isValidItAssetStatus,
  newId,
  nextAssetCode,
  type ItAsset,
  type ItAssetStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItAssetCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateItAsset(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ItAssetView = {
  id: string;
  assetCode: string;
  title: string;
  status: ItAssetStatus;
  notes?: string;
};

function sanitize(row: ItAsset): ItAssetView {
  const view: ItAssetView = {
    id: row.id,
    assetCode: row.assetCode,
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

export function getItAssetsHealth(store: Store, principal: Principal) {
  ensureItAssetCollections(store);
  const decision = authorize({
    principal,
    permission: "asset:read:register",
    action: "read:it_assets_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.itAssets.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "it-assets" as const,
    increment: "ITA1" as const,
    status: "ok" as const,
    assets: items.length,
    openAssets: items.filter((row) => row.status === "open").length,
  };
}

export function listItAssets(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureItAssetCollections(store);
  const auth = authorize({
    principal,
    permission: "asset:read:register",
    action: "list:it_asset",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidItAssetStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.itAssets
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q || `${row.assetCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitize);
  return { items };
}

export function getItAsset(store: Store, principal: Principal, id: string) {
  ensureItAssetCollections(store);
  const auth = authorize({
    principal,
    permission: "asset:read:register",
    action: "get:it_asset",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.itAssets.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { asset: sanitize(row) };
}

export function createItAsset(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItAssetCollections(store);
  const auth = authorize({
    principal,
    permission: "asset:write:register",
    action: "create:it_asset",
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
  const row: ItAsset = {
    id: newId(),
    tenantId: principal.tenantId,
    assetCode: nextAssetCode(
      store.itAssets.filter((item) => item.tenantId === principal.tenantId).map((item) => item.assetCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.itAssets.push(row);
  return { asset: sanitize(row) };
}

export function patchItAsset(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItAssetCollections(store);
  const auth = authorize({
    principal,
    permission: "asset:write:register",
    action: "patch:it_asset",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.itAssets.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidItAssetStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchItAssetStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { asset: sanitize(row) };
}
