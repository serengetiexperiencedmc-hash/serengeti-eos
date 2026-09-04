import {
  authorize,
  canMutateClassificationRecord,
  canPatchClassificationRecordStatus,
  isValidClassificationRecordStatus,
  newId,
  nextClassificationCode,
  type ClassificationRecord,
  type ClassificationRecordStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureClassificationRecordCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateClassificationRecord(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ClassificationRecordView = {
  id: string;
  classificationCode: string;
  title: string;
  status: ClassificationRecordStatus;
  notes?: string;
};

function sanitize(row: ClassificationRecord): ClassificationRecordView {
  const view: ClassificationRecordView = {
    id: row.id,
    classificationCode: row.classificationCode,
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

export function getClassificationsHealth(store: Store, principal: Principal) {
  ensureClassificationRecordCollections(store);
  const decision = authorize({
    principal,
    permission: "classification:read:register",
    action: "read:classification_records_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.classificationRecords.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "classification-register" as const,
    increment: "DG2" as const,
    status: "ok" as const,
    classifications: items.length,
    openClassifications: items.filter((row) => row.status === "open").length,
  };
}

export function listClassifications(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureClassificationRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "classification:read:register",
    action: "list:classification_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidClassificationRecordStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.classificationRecords
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !q || `${row.classificationCode} ${row.title}`.toLowerCase().includes(q))
    .map(sanitize);
  return { items };
}

export function getClassification(store: Store, principal: Principal, id: string) {
  ensureClassificationRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "classification:read:register",
    action: "get:classification_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.classificationRecords.find(
    (item) => item.id === id && item.tenantId === principal.tenantId,
  );
  if (!row) return { error: "not_found" as const };
  return { classification: sanitize(row) };
}

export function createClassification(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureClassificationRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "classification:write:register",
    action: "create:classification_record",
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
  const row: ClassificationRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    classificationCode: nextClassificationCode(
      store.classificationRecords
        .filter((item) => item.tenantId === principal.tenantId)
        .map((item) => item.classificationCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (notes.value) row.notes = notes.value;
  store.classificationRecords.push(row);
  return { classification: sanitize(row) };
}

export function patchClassification(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureClassificationRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "classification:write:register",
    action: "patch:classification_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.classificationRecords.find(
    (item) => item.id === id && item.tenantId === principal.tenantId,
  );
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
    if (!isValidClassificationRecordStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchClassificationRecordStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { classification: sanitize(row) };
}
