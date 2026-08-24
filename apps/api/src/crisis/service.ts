import {
  authorize,
  canCloseCrisis,
  canCloseCrisisBy,
  canMutateCrisis,
  canWriteOpenCrisis,
  isValidCrisisSeverity,
  isValidCrisisStatus,
  newId,
  nextCrisisCode,
  nextTimelineCode,
  type CrisisCase,
  type CrisisSeverity,
  type CrisisStatus,
  type CrisisTimelineEntry,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureCrisisCollections } from "./collections.js";

const TEXT_MAX = 2000;
const TITLE_MAX = 200;
const LABEL_MAX = 200;
const BODY_MAX = 20_000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateCrisis(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type CrisisCaseView = {
  id: string;
  crisisCode: string;
  title: string;
  severity: CrisisSeverity;
  status: CrisisStatus;
  timelineCount: number;
  commanderLabel?: string;
  summary?: string;
};

export type CrisisTimelineView = {
  id: string;
  entryCode: string;
  crisisId: string;
  crisisCode: string;
  body: string;
  createdAt: string;
};

function sanitizeCase(store: Store, crisis: CrisisCase): CrisisCaseView {
  const timelineCount = store.crisisTimelineEntries.filter(
    (e) => e.tenantId === crisis.tenantId && e.crisisId === crisis.id,
  ).length;
  const view: CrisisCaseView = {
    id: crisis.id,
    crisisCode: crisis.crisisCode,
    title: crisis.title,
    severity: crisis.severity,
    status: crisis.status,
    timelineCount,
  };
  if (crisis.commanderLabel) view.commanderLabel = crisis.commanderLabel;
  if (crisis.summary) view.summary = crisis.summary;
  return view;
}

function sanitizeTimeline(store: Store, entry: CrisisTimelineEntry): CrisisTimelineView | { error: "not_found" } {
  const crisis = store.crisisCases.find((c) => c.id === entry.crisisId && c.tenantId === entry.tenantId);
  if (!crisis) return { error: "not_found" };
  return {
    id: entry.id,
    entryCode: entry.entryCode,
    crisisId: entry.crisisId,
    crisisCode: crisis.crisisCode,
    body: entry.body,
    createdAt: entry.createdAt,
  };
}

export function getCrisisHealth(store: Store, principal: Principal) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:case",
    action: "read:crisis_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const cases = store.crisisCases.filter((c) => c.tenantId === principal.tenantId);
  const timeline = store.crisisTimelineEntries.filter((e) => e.tenantId === principal.tenantId);
  return {
    module: "crisis",
    increment: "I18" as const,
    status: "ok" as const,
    cases: cases.length,
    openCases: cases.filter((c) => c.status === "open").length,
    timelineEntries: timeline.length,
  };
}

export function listCrisisCases(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; severity?: string },
) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:case",
    action: "list:crisis_case",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidCrisisStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  if (query?.severity && !isValidCrisisSeverity(query.severity)) {
    return { error: "invalid" as const, reason: "invalid_severity" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const items = store.crisisCases
    .filter((c) => c.tenantId === principal.tenantId)
    .filter((c) => !query?.status || c.status === query.status)
    .filter((c) => !query?.severity || c.severity === query.severity)
    .filter(
      (c) =>
        !q ||
        `${c.crisisCode} ${c.title} ${c.summary ?? ""} ${c.commanderLabel ?? ""}`.toLowerCase().includes(q),
    )
    .map((c) => sanitizeCase(store, c));
  return { items };
}

export function getCrisisCase(store: Store, principal: Principal, id: string) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:case",
    action: "get:crisis_case",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const crisis = store.crisisCases.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!crisis) return { error: "not_found" as const };
  return { crisis: sanitizeCase(store, crisis) };
}

export function createCrisisCase(
  store: Store,
  principal: Principal,
  input: { title?: string; severity?: string; commanderLabel?: string; summary?: string },
) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:write:case",
    action: "create:crisis_case",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const severity = input.severity?.trim() ?? "";
  if (!isValidCrisisSeverity(severity)) return { error: "invalid" as const, reason: "invalid_severity" };
  const commanderLabel = input.commanderLabel?.trim();
  if (commanderLabel && commanderLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "commander_label_too_long" };
  }
  const summary = input.summary?.trim();
  if (summary && summary.length > TEXT_MAX) return { error: "invalid" as const, reason: "summary_too_long" };
  const now = new Date().toISOString();
  const row: CrisisCase = {
    id: newId(),
    tenantId: principal.tenantId,
    crisisCode: nextCrisisCode(
      store.crisisCases.filter((c) => c.tenantId === principal.tenantId).map((c) => c.crisisCode),
    ),
    title,
    severity,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (commanderLabel) row.commanderLabel = commanderLabel;
  if (summary) row.summary = summary;
  store.crisisCases.push(row);
  return { crisis: sanitizeCase(store, row) };
}

export function patchCrisisCase(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; commanderLabel?: string; summary?: string },
) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:write:case",
    action: "patch:crisis_case",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const crisis = store.crisisCases.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!crisis) return { error: "not_found" as const };
  const writable = canWriteOpenCrisis(crisis.status);
  if (!writable.allowed) return { error: "conflict" as const, reason: writable.reason };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    crisis.title = title;
  }
  if (input.commanderLabel !== undefined) {
    const commanderLabel = input.commanderLabel.trim();
    if (commanderLabel.length > LABEL_MAX) {
      return { error: "invalid" as const, reason: "commander_label_too_long" };
    }
    if (commanderLabel) crisis.commanderLabel = commanderLabel;
    else delete crisis.commanderLabel;
  }
  if (input.summary !== undefined) {
    const summary = input.summary.trim();
    if (summary.length > TEXT_MAX) return { error: "invalid" as const, reason: "summary_too_long" };
    if (summary) crisis.summary = summary;
    else delete crisis.summary;
  }
  crisis.updatedAt = new Date().toISOString();
  crisis.updatedByPrincipalId = principal.id;
  return { crisis: sanitizeCase(store, crisis) };
}

export function closeCrisisCase(store: Store, principal: Principal, id: string) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:write:case",
    action: "close:crisis_case",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const crisis = store.crisisCases.find((c) => c.id === id && c.tenantId === principal.tenantId);
  if (!crisis) return { error: "not_found" as const };
  const next = canCloseCrisis(crisis.status);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  const sod = canCloseCrisisBy(crisis.createdByPrincipalId, principal.id);
  if (!sod.allowed) return deny(sod.reason);
  crisis.status = next.next;
  crisis.updatedAt = new Date().toISOString();
  crisis.updatedByPrincipalId = principal.id;
  return { crisis: sanitizeCase(store, crisis) };
}

export function listCrisisTimeline(store: Store, principal: Principal, crisisId: string) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:timeline",
    action: "list:crisis_timeline",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const crisis = store.crisisCases.find((c) => c.id === crisisId && c.tenantId === principal.tenantId);
  if (!crisis) return { error: "not_found" as const };
  const items = store.crisisTimelineEntries
    .filter((e) => e.tenantId === principal.tenantId && e.crisisId === crisisId)
    .map((e) => sanitizeTimeline(store, e))
    .filter((row): row is CrisisTimelineView => !("error" in row));
  return { items };
}

export function getCrisisTimelineEntry(store: Store, principal: Principal, id: string) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:read:timeline",
    action: "get:crisis_timeline",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const entry = store.crisisTimelineEntries.find((e) => e.id === id && e.tenantId === principal.tenantId);
  if (!entry) return { error: "not_found" as const };
  const view = sanitizeTimeline(store, entry);
  if ("error" in view) return view;
  return { entry: view };
}

export function createCrisisTimelineEntry(
  store: Store,
  principal: Principal,
  crisisId: string,
  input: { body?: string },
) {
  ensureCrisisCollections(store);
  const decision = authorize({
    principal,
    permission: "crisis:write:timeline",
    action: "create:crisis_timeline",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const crisis = store.crisisCases.find((c) => c.id === crisisId && c.tenantId === principal.tenantId);
  if (!crisis) return { error: "not_found" as const };
  const writable = canWriteOpenCrisis(crisis.status);
  if (!writable.allowed) return { error: "conflict" as const, reason: writable.reason };
  const body = input.body?.trim() ?? "";
  if (!body) return { error: "invalid" as const, reason: "body_required" };
  if (body.length > BODY_MAX) return { error: "invalid" as const, reason: "body_too_long" };
  const now = new Date().toISOString();
  const entry: CrisisTimelineEntry = {
    id: newId(),
    tenantId: principal.tenantId,
    crisisId: crisis.id,
    entryCode: nextTimelineCode(
      store.crisisTimelineEntries.filter((e) => e.tenantId === principal.tenantId).map((e) => e.entryCode),
    ),
    body,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  store.crisisTimelineEntries.push(entry);
  const view = sanitizeTimeline(store, entry);
  if ("error" in view) return view;
  return { entry: view };
}
