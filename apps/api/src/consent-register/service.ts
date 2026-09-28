import {
  authorize,
  canMutateConsentRecord,
  canPatchConsentRecordStatus,
  isValidConsentRecordStatus,
  newId,
  nextConsentCode,
  type ConsentRecord,
  type ConsentRecordStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureConsentRecordCollections } from "./collections.js";

const TITLE_MAX = 200;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateConsentRecord(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ConsentRecordView = {
  id: string;
  consentCode: string;
  title: string;
  status: ConsentRecordStatus;
};

function sanitize(row: ConsentRecord): ConsentRecordView {
  return {
    id: row.id,
    consentCode: row.consentCode,
    title: row.title,
    status: row.status,
  };
}

export function getConsentsHealth(store: Store, principal: Principal) {
  ensureConsentRecordCollections(store);
  const decision = authorize({
    principal,
    permission: "consent:read:register",
    action: "read:consent_records_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.consentRecords.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "consent-register" as const,
    increment: "P3" as const,
    status: "ok" as const,
    consents: items.length,
    openConsents: items.filter((row) => row.status === "open").length,
  };
}

export function listConsents(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensureConsentRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "consent:read:register",
    action: "list:consent_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidConsentRecordStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.consentRecords
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !q || `${row.consentCode} ${row.title}`.toLowerCase().includes(q))
    .map(sanitize);
  return { items };
}

export function getConsent(store: Store, principal: Principal, id: string) {
  ensureConsentRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "consent:read:register",
    action: "get:consent_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.consentRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { consent: sanitize(row) };
}

export function createConsent(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureConsentRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "consent:write:register",
    action: "create:consent_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  void input.notes;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const now = new Date().toISOString();
  const row: ConsentRecord = {
    id: newId(),
    tenantId: principal.tenantId,
    consentCode: nextConsentCode(
      store.consentRecords.filter((item) => item.tenantId === principal.tenantId).map((item) => item.consentCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.consentRecords.push(row);
  return { consent: sanitize(row) };
}

export function patchConsent(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureConsentRecordCollections(store);
  const auth = authorize({
    principal,
    permission: "consent:write:register",
    action: "patch:consent_record",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  void input.notes;
  const row = store.consentRecords.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "done") return { error: "conflict" as const, reason: "done" };
  if (row.status === "cancelled") return { error: "conflict" as const, reason: "cancelled" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.status !== undefined) {
    if (!isValidConsentRecordStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchConsentRecordStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { consent: sanitize(row) };
}
