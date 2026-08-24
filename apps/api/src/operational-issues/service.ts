import {
  authorize,
  canMutateOperationalIssue,
  canTransitionOperationalIssue,
  isValidOperationalIssueStatus,
  newId,
  nextOperationalIssueCode,
  type OperationalIssue,
  type OperationalIssueStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureOperationalIssueCollections } from "./collections.js";

const TITLE_MAX = 200;
const LABEL_MAX = 200;
const DESCRIPTION_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateOperationalIssue(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type OperationalIssueView = {
  id: string;
  issueCode: string;
  title: string;
  status: OperationalIssueStatus;
  description?: string;
  ownerLabel?: string;
  bookingId: string;
  bookingCode?: string;
};

function resolveBookingCode(store: Store, tenantId: string, bookingId: string): string | undefined {
  return store.bkgBookings.find((b) => b.id === bookingId && b.tenantId === tenantId)?.bookingCode;
}

function sanitize(store: Store, row: OperationalIssue): OperationalIssueView {
  const view: OperationalIssueView = {
    id: row.id,
    issueCode: row.issueCode,
    title: row.title,
    status: row.status,
    bookingId: row.bookingId,
  };
  if (row.description) view.description = row.description;
  if (row.ownerLabel) view.ownerLabel = row.ownerLabel;
  const code = resolveBookingCode(store, row.tenantId, row.bookingId);
  if (code) view.bookingCode = code;
  return view;
}

function resolveBookingId(
  store: Store,
  principal: Principal,
  bookingId: string | undefined,
): { ok: true; bookingId: string } | { error: "invalid"; reason: "booking_not_found" } {
  const trimmed = bookingId?.trim() ?? "";
  if (!trimmed) return { error: "invalid", reason: "booking_not_found" };
  const row = store.bkgBookings.find((b) => b.id === trimmed && b.tenantId === principal.tenantId && !b.archivedAt);
  if (!row) return { error: "invalid", reason: "booking_not_found" };
  return { ok: true, bookingId: trimmed };
}

export function getOperationalIssuesHealth(store: Store, principal: Principal) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:read:issue",
    action: "read:operational_issues_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.operationalIssues.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "operational-issues",
    increment: "O6" as const,
    status: "ok" as const,
    issues: items.length,
    openIssues: items.filter((row) => row.status !== "closed").length,
  };
}

export function listOperationalIssues(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; bookingId?: string },
) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:read:issue",
    action: "list:operational_issue",
  });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidOperationalIssueStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const bookingId = query?.bookingId?.trim();
  const items = store.operationalIssues
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !bookingId || row.bookingId === bookingId)
    .filter(
      (row) =>
        !q ||
        `${row.issueCode} ${row.title} ${row.ownerLabel ?? ""} ${row.description ?? ""}`.toLowerCase().includes(q),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getOperationalIssue(store: Store, principal: Principal, id: string) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:read:issue",
    action: "get:operational_issue",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const row = store.operationalIssues.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { issue: sanitize(store, row) };
}

export function createOperationalIssue(
  store: Store,
  principal: Principal,
  input: { title?: string; description?: string; ownerLabel?: string; bookingId?: string },
) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:write:issue",
    action: "create:operational_issue",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const description = input.description?.trim();
  if (description && description.length > DESCRIPTION_MAX) {
    return { error: "invalid" as const, reason: "description_too_long" };
  }
  const ownerLabel = input.ownerLabel?.trim();
  if (ownerLabel && ownerLabel.length > LABEL_MAX) {
    return { error: "invalid" as const, reason: "owner_label_too_long" };
  }
  const booking = resolveBookingId(store, principal, input.bookingId);
  if ("error" in booking) return booking;
  const now = new Date().toISOString();
  const row: OperationalIssue = {
    id: newId(),
    tenantId: principal.tenantId,
    issueCode: nextOperationalIssueCode(
      store.operationalIssues.filter((item) => item.tenantId === principal.tenantId).map((item) => item.issueCode),
    ),
    title,
    status: "open",
    bookingId: booking.bookingId,
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (description) row.description = description;
  if (ownerLabel) row.ownerLabel = ownerLabel;
  store.operationalIssues.push(row);
  return { issue: sanitize(store, row) };
}

export function patchOperationalIssue(
  store: Store,
  principal: Principal,
  id: string,
  input: { title?: string; description?: string; ownerLabel?: string; bookingId?: string },
) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:write:issue",
    action: "patch:operational_issue",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.operationalIssues.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  if (row.status === "closed") return { error: "conflict" as const, reason: "closed" };
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) return { error: "invalid" as const, reason: "title_required" };
    if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
    row.title = title;
  }
  if (input.description !== undefined) {
    const description = input.description.trim();
    if (description.length > DESCRIPTION_MAX) {
      return { error: "invalid" as const, reason: "description_too_long" };
    }
    if (description) row.description = description;
    else delete row.description;
  }
  if (input.ownerLabel !== undefined) {
    const ownerLabel = input.ownerLabel.trim();
    if (ownerLabel.length > LABEL_MAX) return { error: "invalid" as const, reason: "owner_label_too_long" };
    if (ownerLabel) row.ownerLabel = ownerLabel;
    else delete row.ownerLabel;
  }
  if (input.bookingId !== undefined) {
    const booking = resolveBookingId(store, principal, input.bookingId);
    if ("error" in booking) return booking;
    row.bookingId = booking.bookingId;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { issue: sanitize(store, row) };
}

export function transitionOperationalIssue(
  store: Store,
  principal: Principal,
  id: string,
  action: "start" | "close",
) {
  ensureOperationalIssueCollections(store);
  const decision = authorize({
    principal,
    permission: "ops:write:issue",
    action: `transition:operational_issue:${action}`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.operationalIssues.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  const next = canTransitionOperationalIssue(row.status, action);
  if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
  row.status = next.next;
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { issue: sanitize(store, row) };
}
