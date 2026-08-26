import {
  authorize,
  canMutateProcurementRecord,
  canPatchProcurementRecordStatus,
  isValidProcurementRecordStatus,
  newId,
  nextProcurementCode,
  type Principal,
  type ProcurementRecord,
  type ProcurementRecordStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureProcurementCollections } from "./collections.js";

const TITLE_MAX = 200;
const OWNER_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateProcurementRecord(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ProcurementRecordView = {
  id: string;
  procurementCode: string;
  title: string;
  status: ProcurementRecordStatus;
  notes?: string;
  ownerLabel?: string;
  supplierId?: string;
  supplierCode?: string;
};

function resolveSupplierCode(store: Store, tenantId: string, supplierId?: string): string | undefined {
  if (!supplierId) return undefined;
  return store.supSuppliers.find((row) => row.id === supplierId && row.tenantId === tenantId)?.supplierCode;
}

function sanitize(store: Store, row: ProcurementRecord): ProcurementRecordView {
  const view: ProcurementRecordView = {
    id: row.id,
    procurementCode: row.procurementCode,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  if (row.supplierId) {
    view.supplierId = row.supplierId;
    const code = resolveSupplierCode(store, row.tenantId, row.supplierId);
    if (code) view.supplierCode = code;
  }
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

function resolveSupplierId(
  store: Store,
  principal: Principal,
  supplierId: string | null | undefined,
): { ok: true; supplierId?: string } | { error: "invalid"; reason: "supplier_not_found" } {
  if (supplierId === undefined) return { ok: true };
  if (supplierId === null) return { ok: true };
  const trimmed = String(supplierId).trim();
  if (!trimmed) return { ok: true };
  const row = store.supSuppliers.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "supplier_not_found" };
  return { ok: true, supplierId: trimmed };
}

export function getProcurementHealth(store: Store, principal: Principal) {
  ensureProcurementCollections(store);
  const decision = authorize({
    principal,
    permission: "procure:read:record",
    action: "read:procurement_records_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.procurementRecords.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "procurement-catalogue" as const,
    increment: "PR1" as const,
    status: "ok" as const,
    records: items.length,
    openRecords: items.filter((row) => row.status === "open").length,
  };
}

export function listProcurementRecords(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureProcurementCollections(store);
  const auth = authorize({
    principal,
    permission: "procure:read:record",
    action: "list:procurement_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidProcurementRecordStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.procurementRecords
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !q || `${row.procurementCode} ${row.title}`.toLowerCase().includes(q))
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return a.procurementCode < b.procurementCode ? 1 : a.procurementCode > b.procurementCode ? -1 : 0;
    })
    .map((row) => sanitize(store, row));
  return { items };
}

export function getProcurementRecord(store: Store, principal: Principal, id: string) {
  ensureProcurementCollections(store);
  const auth = authorize({
    principal,
    permission: "procure:read:record",
    action: "get:procurement_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.procurementRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { record: sanitize(store, row) };
}

export function createProcurementRecord(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    ownerLabel?: string;
    supplierId?: string | null;
    status?: string;
  },
) {
  ensureProcurementCollections(store);
  const auth = authorize({
    principal,
    permission: "procure:write:record",
    action: "create:procurement_record",
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
  const supplier = resolveSupplierId(store, principal, input.supplierId);
  if ("error" in supplier) return supplier;
  const now = new Date().toISOString();
  const row: ProcurementRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    procurementCode: nextProcurementCode(
      store.procurementRecords
        .filter((item) => item.tenantId === principal.tenantId)
        .map((item) => item.procurementCode),
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
  if (supplier.supplierId) row.supplierId = supplier.supplierId;
  store.procurementRecords.push(row);
  return { record: sanitize(store, row) };
}

export function patchProcurementRecord(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string | null;
    ownerLabel?: string | null;
    supplierId?: string | null;
    status?: string;
  },
) {
  ensureProcurementCollections(store);
  const auth = authorize({
    principal,
    permission: "procure:write:record",
    action: "patch:procurement_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.procurementRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
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
  if (input.ownerLabel !== undefined) {
    const ownerLabel = optionalText(input.ownerLabel, OWNER_MAX, "owner_label_too_long");
    if ("error" in ownerLabel) return ownerLabel;
    if (ownerLabel.value) row.ownerLabel = ownerLabel.value;
    else delete row.ownerLabel;
  }
  if (input.supplierId !== undefined) {
    const supplier = resolveSupplierId(store, principal, input.supplierId);
    if ("error" in supplier) return supplier;
    if (supplier.supplierId) row.supplierId = supplier.supplierId;
    else delete row.supplierId;
  }
  if (input.status !== undefined) {
    if (!isValidProcurementRecordStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchProcurementRecordStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { record: sanitize(store, row) };
}
