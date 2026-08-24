import {
  authorize,
  canCloseDsrBy,
  canMutatePrivacy,
  canRetireProcessingActivity,
  canTransitionDsr,
  isValidDsrRequestType,
  isValidDsrStatus,
  isValidProcessingActivityStatus,
  newId,
  nextDsrCode,
  nextProcessingActivityCode,
  type DsrRequestType,
  type DsrStatus,
  type Principal,
  type PrivacyDsrCase,
  type PrivacyProcessingActivity,
  type ProcessingActivityStatus,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensurePrivacyCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutatePrivacy(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type PrivacyActivityView = {
  id: string;
  activityCode: string;
  title: string;
  status: ProcessingActivityStatus;
  purpose?: string;
  ownerLabel?: string;
};

export type PrivacyDsrView = {
  id: string;
  dsrCode: string;
  requestType: DsrRequestType;
  status: DsrStatus;
  subjectLabel?: string;
  note?: string;
};

function sanitizeActivity(row: PrivacyProcessingActivity): PrivacyActivityView {
  const view: PrivacyActivityView = {
    id: row.id,
    activityCode: row.activityCode,
    title: row.title,
    status: row.status,
  };
  if (row.purpose) view.purpose = row.purpose;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  return view;
}

function sanitizeDsr(row: PrivacyDsrCase): PrivacyDsrView {
  const view: PrivacyDsrView = {
    id: row.id,
    dsrCode: row.dsrCode,
    requestType: row.requestType,
    status: row.status,
  };
  if (row.subjectLabel) view.subjectLabel = row.subjectLabel;
  if (row.note) view.note = row.note;
  return view;
}

export function getPrivacyHealth(store: Store, principal: Principal) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:activity",
    action: "read:privacy_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const activities = store.privacyProcessingActivities.filter((a) => a.tenantId === principal.tenantId);
  const dsrs = store.privacyDsrCases.filter((d) => d.tenantId === principal.tenantId);
  return {
    module: "privacy",
    increment: "P1" as const,
    status: "ok" as const,
    activities: activities.length,
    openActivities: activities.filter((a) => a.status !== "retired").length,
    dsrs: dsrs.length,
    openDsrs: dsrs.filter((d) => d.status !== "closed").length,
  };
}

export function listProcessingActivities(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string },
) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:activity",
    action: "list:privacy_activity",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidProcessingActivityStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.privacyProcessingActivities
    .filter((a) => a.tenantId === principal.tenantId)
    .filter((a) => !query?.status || a.status === query.status)
    .filter(
      (a) =>
        !q || `${a.activityCode} ${a.title} ${a.purpose ?? ""} ${a.ownerLabel ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitizeActivity);
  return { items };
}

export function getProcessingActivity(store: Store, principal: Principal, id: string) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:activity",
    action: "get:privacy_activity",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.privacyProcessingActivities.find((a) => a.id === id && a.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { activity: sanitizeActivity(row) };
}

export function createProcessingActivity(
  store: Store,
  principal: Principal,
  input: { title?: string; purpose?: string; ownerLabel?: string },
) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:activity",
    action: "create:privacy_activity",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const purpose = input.purpose?.trim();
  if (purpose && purpose.length > TEXT_MAX) return { error: "invalid" as const, reason: "purpose_too_long" };
  const ownerLabel = input.ownerLabel?.trim();
  if (ownerLabel && ownerLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "owner_label_too_long" };
  }
  const now = new Date().toISOString();
  const row: PrivacyProcessingActivity = {
    id: newId(),
    tenantId: principal.tenantId,
    activityCode: nextProcessingActivityCode(
      store.privacyProcessingActivities.filter((a) => a.tenantId === principal.tenantId).map((a) => a.activityCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (purpose) row.purpose = purpose;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  store.privacyProcessingActivities.push(row);
  return { activity: sanitizeActivity(row) };
}

export function patchProcessingActivity(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; purpose?: string; ownerLabel?: string },
) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:activity",
    action: "patch:privacy_activity",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.privacyProcessingActivities.find((a) => a.id === id && a.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "retired") return { error: "conflict" as const, reason: "retired" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.purpose !== undefined) {
    const purpose = input.purpose.trim();
    if (purpose.length > TEXT_MAX) return { error: "invalid" as const, reason: "purpose_too_long" };
    if (purpose) row.purpose = purpose;
    else delete row.purpose;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel.length > LABEL_MAX) return { error: "invalid" as const, reason: "owner_label_too_long" };
    if (ownerLabel) row.ownerLabel = ownerLabel;
    else delete row.ownerLabel;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { activity: sanitizeActivity(row) };
}

export function retireProcessingActivity(store: Store, principal: Principal, id: string) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:activity",
    action: "retire:privacy_activity",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.privacyProcessingActivities.find((a) => a.id === id && a.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canRetireProcessingActivity(row.status);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { activity: sanitizeActivity(row) };
}

export function listDsrCases(store: Store, principal: Principal, query?: { q?: string; status?: string }) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:dsr",
    action: "list:privacy_dsr",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidDsrStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.privacyDsrCases
    .filter((d) => d.tenantId === principal.tenantId)
    .filter((d) => !query?.status || d.status === query.status)
    .filter(
      (d) =>
        !q ||
        `${d.dsrCode} ${d.requestType} ${d.subjectLabel ?? ""} ${d.note ?? ""}`.toLowerCase().includes(q),
    )
    .map(sanitizeDsr);
  return { items };
}

export function getDsrCase(store: Store, principal: Principal, id: string) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:read:dsr",
    action: "get:privacy_dsr",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.privacyDsrCases.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { dsr: sanitizeDsr(row) };
}

export function createDsrCase(
  store: Store,
  principal: Principal,
  input: { requestType?: string; subjectLabel?: string; note?: string },
) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:dsr",
    action: "create:privacy_dsr",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const requestType = input.requestType?.trim() ?? "";
  if (!isValidDsrRequestType(requestType)) return { error: "invalid" as const, reason: "invalid_request_type" };
  const subjectLabel = input.subjectLabel?.trim();
  if (subjectLabel && subjectLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "subject_label_too_long" };
  }
  const note = input.note?.trim();
  if (note && note.length > TEXT_MAX) return { error: "invalid" as const, reason: "note_too_long" };
  const now = new Date().toISOString();
  const row: PrivacyDsrCase = {
    id: newId(),
    tenantId: principal.tenantId,
    dsrCode: nextDsrCode(store.privacyDsrCases.filter((d) => d.tenantId === principal.tenantId).map((d) => d.dsrCode)),
    requestType,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (subjectLabel) row.subjectLabel = subjectLabel;
  if (note) row.note = note;
  store.privacyDsrCases.push(row);
  return { dsr: sanitizeDsr(row) };
}

export function patchDsrCase(
  store: Store,
  principal: Principal,
  id: string,
  input: { requestType?: string; subjectLabel?: string; note?: string },
) {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:dsr",
    action: "patch:privacy_dsr",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.privacyDsrCases.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.requestType !== undefined) {
    if (row.status !== "open") return { error: "conflict" as const, reason: "invalid_transition" };
    const requestType = input.requestType.trim();
    if (!isValidDsrRequestType(requestType)) return { error: "invalid" as const, reason: "invalid_request_type" };
    row.requestType = requestType;
  }
  if (input.subjectLabel !== undefined) {
    const subjectLabel = input.subjectLabel.trim();
    if (subjectLabel.length > LABEL_MAX) return { error: "invalid" as const, reason: "subject_label_too_long" };
    if (subjectLabel) row.subjectLabel = subjectLabel;
    else delete row.subjectLabel;
  }
  if (input.note !== undefined) {
    const note = input.note.trim();
    if (note.length > TEXT_MAX) return { error: "invalid" as const, reason: "note_too_long" };
    if (note) row.note = note;
    else delete row.note;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { dsr: sanitizeDsr(row) };
}

export function transitionDsrCase(store: Store, principal: Principal, id: string, action: "start" | "close") {
  ensurePrivacyCollections(store);
  const decision = authorize({
    principal,
    permission: "privacy:write:dsr",
    action: `transition:privacy_dsr:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.privacyDsrCases.find((d) => d.id === id && d.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionDsr(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  if (action === "close") {
    const sod = canCloseDsrBy(row.createdByPrincipalId, principal.id);
    if (!sod.allowed) return deny(sod.reason);
  }
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { dsr: sanitizeDsr(row) };
}
