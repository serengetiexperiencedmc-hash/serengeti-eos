import {
  authorize,
  canMutateItEndpoint,
  canPatchItEndpointStatus,
  isValidItEndpointStatus,
  newId,
  nextEndpointCode,
  type ItEndpoint,
  type ItEndpointStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItEndpointCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateItEndpoint(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ItEndpointView = {
  id: string;
  endpointCode: string;
  title: string;
  status: ItEndpointStatus;
  notes?: string;
};

function sanitize(row: ItEndpoint): ItEndpointView {
  const view: ItEndpointView = {
    id: row.id,
    endpointCode: row.endpointCode,
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

export function getItEndpointsHealth(store: Store, principal: Principal) {
  ensureItEndpointCollections(store);
  const decision = authorize({
    principal,
    permission: "endpoint:read:register",
    action: "read:it_endpoints_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.itEndpoints.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "it-endpoints" as const,
    increment: "ITE1" as const,
    status: "ok" as const,
    endpoints: items.length,
    openEndpoints: items.filter((row) => row.status === "open").length,
  };
}

export function listItEndpoints(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureItEndpointCollections(store);
  const auth = authorize({
    principal,
    permission: "endpoint:read:register",
    action: "list:it_endpoint",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidItEndpointStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.itEndpoints
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q || `${row.endpointCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitize);
  return { items };
}

export function getItEndpoint(store: Store, principal: Principal, id: string) {
  ensureItEndpointCollections(store);
  const auth = authorize({
    principal,
    permission: "endpoint:read:register",
    action: "get:it_endpoint",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.itEndpoints.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { endpoint: sanitize(row) };
}

export function createItEndpoint(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItEndpointCollections(store);
  const auth = authorize({
    principal,
    permission: "endpoint:write:register",
    action: "create:it_endpoint",
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
  const row: ItEndpoint = {
    id: newId(),
    tenantId: principal.tenantId,
    endpointCode: nextEndpointCode(
      store.itEndpoints.filter((item) => item.tenantId === principal.tenantId).map((item) => item.endpointCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.itEndpoints.push(row);
  return { endpoint: sanitize(row) };
}

export function patchItEndpoint(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItEndpointCollections(store);
  const auth = authorize({
    principal,
    permission: "endpoint:write:register",
    action: "patch:it_endpoint",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.itEndpoints.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidItEndpointStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchItEndpointStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { endpoint: sanitize(row) };
}
