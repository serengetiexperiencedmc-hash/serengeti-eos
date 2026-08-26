import {
  authorize,
  canMutateTreatment,
  canPatchTreatmentStatus,
  isValidTreatmentStatus,
  newId,
  nextTreatmentCode,
  type ErmTreatment,
  type Principal,
  type TreatmentStatus,
} from "@sedmc/kernel";
import { ensureErmCollections } from "../erm/collections.js";
import type { Store } from "../store.js";
import { ensureErmTreatmentCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateTreatment(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ErmTreatmentView = {
  id: string;
  treatmentCode: string;
  title: string;
  status: TreatmentStatus;
  notes?: string;
  ownerLabel?: string;
  riskId?: string;
  riskCode?: string;
};

function resolveRiskCode(store: Store, tenantId: string, riskId?: string): string | undefined {
  if (!riskId) return undefined;
  return store.ermRisks.find((r) => r.id === riskId && r.tenantId === tenantId)?.riskCode;
}

function sanitize(store: Store, row: ErmTreatment): ErmTreatmentView {
  const view: ErmTreatmentView = {
    id: row.id,
    treatmentCode: row.treatmentCode,
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

export function getErmTreatmentsHealth(store: Store, principal: Principal) {
  ensureErmTreatmentCollections(store);
  const decision = authorize({
    principal,
    permission: "erm:read:treatment",
    action: "read:erm_treatments_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.ermTreatments.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "erm-treatments" as const,
    increment: "E2" as const,
    status: "ok" as const,
    treatments: items.length,
    openTreatments: items.filter((row) => row.status === "open").length,
  };
}

export function listErmTreatments(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureErmTreatmentCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:read:treatment",
    action: "list:erm_treatment",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidTreatmentStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.ermTreatments
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter(
      (row) =>
        !q ||
        `${row.treatmentCode} ${row.title} ${row.notes ?? ""} ${row.ownerLabel ?? ""}`
          .toLowerCase()
          .includes(q),
    )
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
      return a.treatmentCode < b.treatmentCode ? 1 : a.treatmentCode > b.treatmentCode ? -1 : 0;
    })
    .map((row) => sanitize(store, row));
  return { items };
}

export function getErmTreatment(store: Store, principal: Principal, id: string) {
  ensureErmTreatmentCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:read:treatment",
    action: "get:erm_treatment",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.ermTreatments.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { treatment: sanitize(store, row) };
}

export function createErmTreatment(
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
  ensureErmTreatmentCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:write:treatment",
    action: "create:erm_treatment",
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
  const row: ErmTreatment = {
    id: newId(),
    tenantId: principal.tenantId,
    treatmentCode: nextTreatmentCode(
      store.ermTreatments
        .filter((item) => item.tenantId === principal.tenantId)
        .map((item) => item.treatmentCode),
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
  store.ermTreatments.push(row);
  return { treatment: sanitize(store, row) };
}

export function patchErmTreatment(
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
  ensureErmTreatmentCollections(store);
  const auth = authorize({
    principal,
    permission: "erm:write:treatment",
    action: "patch:erm_treatment",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.ermTreatments.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidTreatmentStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchTreatmentStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { treatment: sanitize(store, row) };
}
