import {
  authorize,
  canMutateDatasetRecord,
  canPatchDatasetRecordStatus,
  isValidDatasetRecordStatus,
  newId,
  nextDatasetCode,
  type DatasetRecord,
  type DatasetRecordStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureDatasetRecordCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateDatasetRecord(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type DatasetRecordView = {
  id: string;
  datasetCode: string;
  title: string;
  status: DatasetRecordStatus;
  notes?: string;
};

function sanitize(row: DatasetRecord): DatasetRecordView {
  const view: DatasetRecordView = {
    id: row.id,
    datasetCode: row.datasetCode,
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

export function getDatasetsHealth(store: Store, principal: Principal) {
  ensureDatasetRecordCollections(store);
  const decision = authorize({
    principal,
    permission: "dataset:read:register",
    action: "read:dataset_records_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.datasetRecords.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "dataset-register" as const,
    increment: "DG1" as const,
    status: "ok" as const,
    datasets: items.length,
    openDatasets: items.filter((row) => row.status === "open").length,
  };
}

export function listDatasets(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureDatasetRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "dataset:read:register",
    action: "list:dataset_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidDatasetRecordStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.datasetRecords
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !q || `${row.datasetCode} ${row.title}`.toLowerCase().includes(q))
    .map(sanitize);
  return { items };
}

export function getDataset(store: Store, principal: Principal, id: string) {
  ensureDatasetRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "dataset:read:register",
    action: "get:dataset_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.datasetRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { dataset: sanitize(row) };
}

export function createDataset(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureDatasetRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "dataset:write:register",
    action: "create:dataset_record",
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
  const row: DatasetRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    datasetCode: nextDatasetCode(
      store.datasetRecords.filter((item) => item.tenantId === principal.tenantId).map((item) => item.datasetCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.datasetRecords.push(row);
  return { dataset: sanitize(row) };
}

export function patchDataset(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureDatasetRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "dataset:write:register",
    action: "patch:dataset_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.datasetRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidDatasetRecordStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchDatasetRecordStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { dataset: sanitize(row) };
}
