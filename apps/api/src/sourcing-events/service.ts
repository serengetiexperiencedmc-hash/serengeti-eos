import {
  authorize,
  canMutateSourcingEvent,
  canPatchSourcingEventStatus,
  isValidSourcingEventStatus,
  newId,
  nextSourcingEventCode,
  type Principal,
  type SourcingEvent,
  type SourcingEventStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureSourcingEventCollections } from "./collections.js";

const TITLE_MAX = 200;
const OWNER_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateSourcingEvent(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type SourcingEventView = {
  id: string;
  code: string;
  title: string;
  status: SourcingEventStatus;
  notes?: string;
  ownerLabel?: string;
};

function sanitize(row: SourcingEvent): SourcingEventView {
  const view: SourcingEventView = {
    id: row.id,
    code: row.code,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  return view;
}

function optionalText<T extends string>(
  value: string | null | undefined,
  max: number,
  tooLong: T,
): { ok: true; value?: string } | { error: "invalid"; reason: T } {
  if (value === undefined || value === null) return { ok: true };
  const trimmed = value.trim();
  if (trimmed.length > max) return { error: "invalid", reason: tooLong };
  if (!trimmed) return { ok: true };
  return { ok: true, value: trimmed };
}

export function getSourcingEventHealth(store: Store, principal: Principal) {
  ensureSourcingEventCollections(store);
  const decision = authorize({
    principal,
    permission: "sourcingEvent:read:register",
    action: "read:sourcing_event_records_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.sourcingEventRecords.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "sourcing-event-register" as const,
    increment: "PR2" as const,
    status: "ok" as const,
    records: items.length,
    openRecords: items.filter((row) => row.status === "open").length,
  };
}

export function listSourcingEvents(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureSourcingEventCollections(store);
  const auth = authorize({
    principal,
    permission: "sourcingEvent:read:register",
    action: "list:sourcing_event",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidSourcingEventStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.sourcingEventRecords
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !q || `${row.code} ${row.title}`.toLowerCase().includes(q))
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return a.code < b.code ? 1 : a.code > b.code ? -1 : 0;
    })
    .map(sanitize);
  return { items };
}

export function getSourcingEvent(store: Store, principal: Principal, id: string) {
  ensureSourcingEventCollections(store);
  const auth = authorize({
    principal,
    permission: "sourcingEvent:read:register",
    action: "get:sourcing_event",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.sourcingEventRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { sourcingEvent: sanitize(row) };
}

export function createSourcingEvent(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    status?: string;
  },
) {
  ensureSourcingEventCollections(store);
  const auth = authorize({
    principal,
    permission: "sourcingEvent:write:register",
    action: "create:sourcing_event",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const ownerLabel = optionalText(input.ownerLabel, OWNER_MAX, "owner_label_too_long");
  if ("error" in ownerLabel) return ownerLabel;
  const now = new Date().toISOString();
  const row: SourcingEvent = {
    id: newId(),
    tenantId: principal.tenantId,
    code: nextSourcingEventCode(
      store.sourcingEventRecords
        .filter((item) => item.tenantId === principal.tenantId)
        .map((item) => item.code),
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
  store.sourcingEventRecords.push(row);
  return { sourcingEvent: sanitize(row) };
}

export function patchSourcingEvent(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string | null;
    ownerLabel?: string | null;
    status?: string;
  },
) {
  ensureSourcingEventCollections(store);
  const auth = authorize({
    principal,
    permission: "sourcingEvent:write:register",
    action: "patch:sourcing_event",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.sourcingEventRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    const ownerLabel = optionalText(input.ownerLabel, OWNER_MAX, "owner_label_too_long");
    if ("error" in ownerLabel) return ownerLabel;
    if (ownerLabel.value) row.ownerLabel = ownerLabel.value;
    else delete row.ownerLabel;
  }
  if (input.status !== undefined) {
    if (!isValidSourcingEventStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchSourcingEventStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { sourcingEvent: sanitize(row) };
}
