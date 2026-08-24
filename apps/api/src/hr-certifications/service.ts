import {
  authorize,
  canMutateHrCertification,
  canPatchCertificationStatus,
  isValidCertificationStatus,
  newId,
  nextCertificationCode,
  validateCertificationDates,
  type CertificationStatus,
  type HrCertification,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureHrCertificationCollections } from "./collections.js";

const NAME_MAX = 200;
const LABEL_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateHrCertification(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type HrCertificationView = {
  id: string;
  certificationCode: string;
  name: string;
  status: CertificationStatus;
  issuerLabel?: string;
  issuedOn?: string;
  expiresOn?: string;
  notes?: string;
  employeeId: string;
  employeeCode?: string;
};

function resolveEmployeeCode(store: Store, tenantId: string, employeeId: string): string | undefined {
  return store.hrEmployees.find((row) => row.id === employeeId && row.tenantId === tenantId)?.employeeCode;
}

function sanitize(store: Store, row: HrCertification): HrCertificationView {
  const view: HrCertificationView = {
    id: row.id,
    certificationCode: row.certificationCode,
    name: row.name,
    status: row.status,
    employeeId: row.employeeId,
  };
  if (row.issuerLabel) view.issuerLabel = row.issuerLabel;
  if (row.issuedOn) view.issuedOn = row.issuedOn;
  if (row.expiresOn) view.expiresOn = row.expiresOn;
  if (row.notes) view.notes = row.notes;
  const code = resolveEmployeeCode(store, row.tenantId, row.employeeId);
  if (code) view.employeeCode = code;
  return view;
}

function resolveEmployeeId(
  store: Store,
  principal: Principal,
  employeeId: string | undefined,
): { ok: true; employeeId: string } | { error: "invalid"; reason: "employee_not_found" } {
  const trimmed = employeeId?.trim() ?? "";
  if (!trimmed) return { error: "invalid", reason: "employee_not_found" };
  const row = store.hrEmployees.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "employee_not_found" };
  return { ok: true, employeeId: trimmed };
}

function optionalText(
  value: string | undefined,
  max: number,
  tooLong: "issuer_label_too_long" | "notes_too_long",
):
  | { ok: true; value?: string }
  | { error: "invalid"; reason: "issuer_label_too_long" | "notes_too_long" } {
  if (value === undefined) return { ok: true };
  const trimmed = value.trim();
  if (trimmed.length > max) return { error: "invalid", reason: tooLong };
  if (!trimmed) return { ok: true };
  return { ok: true, value: trimmed };
}

export function getHrCertificationsHealth(store: Store, principal: Principal) {
  ensureHrCertificationCollections(store);
  const decision = authorize({
    principal,
    permission: "hr:read:certification",
    action: "read:hr_certifications_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.hrCertifications.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "hr-certifications" as const,
    increment: "H1" as const,
    status: "ok" as const,
    certifications: items.length,
    heldCertifications: items.filter((row) => row.status === "held").length,
  };
}

export function listHrCertifications(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; employeeId?: string },
) {
  ensureHrCertificationCollections(store);
  const auth = authorize({
    principal,
    permission: "hr:read:certification",
    action: "list:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidCertificationStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const employeeId = query?.employeeId?.trim();
  const items = store.hrCertifications
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !employeeId || row.employeeId === employeeId)
    .filter(
      (row) =>
        !q ||
        `${row.certificationCode} ${row.name} ${row.issuerLabel ?? ""} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getHrCertification(store: Store, principal: Principal, id: string) {
  ensureHrCertificationCollections(store);
  const auth = authorize({
    principal,
    permission: "hr:read:certification",
    action: "get:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.hrCertifications.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { certification: sanitize(store, row) };
}

export function createHrCertification(
  store: Store,
  principal: Principal,
  input: {
    name?: string;
    employeeId?: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureHrCertificationCollections(store);
  const auth = authorize({
    principal,
    permission: "hr:write:certification",
    action: "create:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const name = input.name?.trim() ?? "";
  if (!name) return { error: "invalid" as const, reason: "name_required" };
  if (name.length > NAME_MAX) return { error: "invalid" as const, reason: "name_too_long" };
  const issuer = optionalText(input.issuerLabel, LABEL_MAX, "issuer_label_too_long");
  if ("error" in issuer) return issuer;
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const issuedOn = input.issuedOn?.trim() || undefined;
  const expiresOn = input.expiresOn?.trim() || undefined;
  const dates = validateCertificationDates(issuedOn, expiresOn);
  if (!dates.ok) return { error: "invalid" as const, reason: dates.reason };
  const employee = resolveEmployeeId(store, principal, input.employeeId);
  if ("error" in employee) return employee;
  const now = new Date().toISOString();
  const row: HrCertification = {
    id: newId(),
    tenantId: principal.tenantId,
    certificationCode: nextCertificationCode(
      store.hrCertifications.filter((item) => item.tenantId === principal.tenantId).map((item) => item.certificationCode),
    ),
    name,
    status: "held",
    employeeId: employee.employeeId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (issuer.value) row.issuerLabel = issuer.value;
  if (issuedOn) row.issuedOn = issuedOn;
  if (expiresOn) row.expiresOn = expiresOn;
  if (notes.value) row.notes = notes.value;
  store.hrCertifications.push(row);
  return { certification: sanitize(store, row) };
}

export function patchHrCertification(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    name?: string;
    employeeId?: string;
    issuerLabel?: string;
    issuedOn?: string;
    expiresOn?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureHrCertificationCollections(store);
  const auth = authorize({
    principal,
    permission: "hr:write:certification",
    action: "patch:hr_certification",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.hrCertifications.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "revoked") return { error: "conflict" as const, reason: "revoked" };
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) return { error: "invalid" as const, reason: "name_required" };
    if (name.length > NAME_MAX) return { error: "invalid" as const, reason: "name_too_long" };
    row.name = name;
  }
  if (input.issuerLabel !== undefined) {
    const issuer = optionalText(input.issuerLabel, LABEL_MAX, "issuer_label_too_long");
    if ("error" in issuer) return issuer;
    if (issuer.value) row.issuerLabel = issuer.value;
    else delete row.issuerLabel;
  }
  if (input.notes !== undefined) {
    const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
    if ("error" in notes) return notes;
    if (notes.value) row.notes = notes.value;
    else delete row.notes;
  }
  const nextIssued = input.issuedOn !== undefined ? input.issuedOn.trim() : row.issuedOn;
  const nextExpires = input.expiresOn !== undefined ? input.expiresOn.trim() : row.expiresOn;
  const dates = validateCertificationDates(nextIssued || undefined, nextExpires || undefined);
  if (!dates.ok) return { error: "invalid" as const, reason: dates.reason };
  if (input.issuedOn !== undefined) {
    if (nextIssued) row.issuedOn = nextIssued;
    else delete row.issuedOn;
  }
  if (input.expiresOn !== undefined) {
    if (nextExpires) row.expiresOn = nextExpires;
    else delete row.expiresOn;
  }
  if (input.status !== undefined) {
    if (!isValidCertificationStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchCertificationStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { certification: sanitize(store, row) };
}
