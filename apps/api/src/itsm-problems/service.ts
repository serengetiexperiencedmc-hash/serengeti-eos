import {
  authorize,
  canMutateItsmProblem,
  canPatchItsmProblemStatus,
  isValidItsmProblemStatus,
  newId,
  nextProblemCode,
  type ItsmProblem,
  type ItsmProblemStatus,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureItsmProblemCollections } from "./collections.js";

const TITLE_MAX = 200;
const TEXT_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function requireHuman(principal: Principal) {
  const human = canMutateItsmProblem(principal.actorType);
  if (!human.allowed) return deny(human.reason);
  return null;
}

export type ItsmProblemView = {
  id: string;
  problemCode: string;
  title: string;
  status: ItsmProblemStatus;
  notes?: string;
  ticketId?: string;
  ticketCode?: string;
  ciId?: string;
  ciCode?: string;
};

function resolveTicketCode(store: Store, tenantId: string, ticketId: string): string | undefined {
  return store.itsmTickets.find((row) => row.id === ticketId && row.tenantId === tenantId)?.ticketCode;
}

function resolveCiCode(store: Store, tenantId: string, ciId: string): string | undefined {
  return store.cmdbCis.find((row) => row.id === ciId && row.tenantId === tenantId)?.ciCode;
}

function sanitize(store: Store, row: ItsmProblem): ItsmProblemView {
  const view: ItsmProblemView = {
    id: row.id,
    problemCode: row.problemCode,
    title: row.title,
    status: row.status,
  };
  if (row.notes) view.notes = row.notes;
  if (row.ticketId) {
    view.ticketId = row.ticketId;
    const code = resolveTicketCode(store, row.tenantId, row.ticketId);
    if (code) view.ticketCode = code;
  }
  if (row.ciId) {
    view.ciId = row.ciId;
    const code = resolveCiCode(store, row.tenantId, row.ciId);
    if (code) view.ciCode = code;
  }
  return view;
}

function resolveOptionalTicketId(
  store: Store,
  principal: Principal,
  ticketId: string | undefined,
): { ok: true; ticketId?: string } | { error: "invalid"; reason: "ticket_not_found" } {
  if (ticketId === undefined) return { ok: true };
  const trimmed = ticketId.trim();
  if (!trimmed) return { ok: true };
  const row = store.itsmTickets.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "ticket_not_found" };
  return { ok: true, ticketId: trimmed };
}

function resolveOptionalCiId(
  store: Store,
  principal: Principal,
  ciId: string | undefined,
): { ok: true; ciId?: string } | { error: "invalid"; reason: "ci_not_found" } {
  if (ciId === undefined) return { ok: true };
  const trimmed = ciId.trim();
  if (!trimmed) return { ok: true };
  const row = store.cmdbCis.find((item) => item.id === trimmed && item.tenantId === principal.tenantId);
  if (!row) return { error: "invalid", reason: "ci_not_found" };
  return { ok: true, ciId: trimmed };
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

export function getItsmProblemsHealth(store: Store, principal: Principal) {
  ensureItsmProblemCollections(store);
  const decision = authorize({
    principal,
    permission: "itsm:read:problem",
    action: "read:itsm_problems_health",
  });
  if (decision.result === "deny") return deny(decision.reason);
  const items = store.itsmProblems.filter((row) => row.tenantId === principal.tenantId);
  return {
    module: "itsm-problems" as const,
    increment: "ITP1" as const,
    status: "ok" as const,
    problems: items.length,
    openProblems: items.filter((row) => row.status === "open").length,
  };
}

export function listItsmProblems(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; ticketId?: string; ciId?: string },
) {
  ensureItsmProblemCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:read:problem",
    action: "list:itsm_problem",
  });
  if (auth.result === "deny") return deny(auth.reason);
  if (query?.status && !isValidItsmProblemStatus(query.status)) {
    return { error: "invalid" as const, reason: "invalid_status" };
  }
  const q = query?.q?.trim().toLowerCase() ?? "";
  const ticketId = query?.ticketId?.trim();
  const ciId = query?.ciId?.trim();
  const items = store.itsmProblems
    .filter((row) => row.tenantId === principal.tenantId)
    .filter((row) => !query?.status || row.status === query.status)
    .filter((row) => !ticketId || row.ticketId === ticketId)
    .filter((row) => !ciId || row.ciId === ciId)
    .filter(
      (row) =>
        !q ||
        `${row.problemCode} ${row.title} ${row.notes ?? ""}`.toLowerCase().includes(q),
    )
    .map((row) => sanitize(store, row));
  return { items };
}

export function getItsmProblem(store: Store, principal: Principal, id: string) {
  ensureItsmProblemCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:read:problem",
    action: "get:itsm_problem",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const row = store.itsmProblems.find((item) => item.id === id && item.tenantId === principal.tenantId);
  if (!row) return { error: "not_found" as const };
  return { problem: sanitize(store, row) };
}

export function createItsmProblem(
  store: Store,
  principal: Principal,
  input: {
    title?: string;
    ticketId?: string;
    ciId?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItsmProblemCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:write:problem",
    action: "create:itsm_problem",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const title = input.title?.trim() ?? "";
  if (!title) return { error: "invalid" as const, reason: "title_required" };
  if (title.length > TITLE_MAX) return { error: "invalid" as const, reason: "title_too_long" };
  const notes = optionalText(input.notes, TEXT_MAX, "notes_too_long");
  if ("error" in notes) return notes;
  const ticket = resolveOptionalTicketId(store, principal, input.ticketId);
  if ("error" in ticket) return ticket;
  const ci = resolveOptionalCiId(store, principal, input.ciId);
  if ("error" in ci) return ci;
  const now = new Date().toISOString();
  const row: ItsmProblem = {
    id: newId(),
    tenantId: principal.tenantId,
    problemCode: nextProblemCode(
      store.itsmProblems.filter((item) => item.tenantId === principal.tenantId).map((item) => item.problemCode),
    ),
    title,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (ticket.ticketId) row.ticketId = ticket.ticketId;
  if (ci.ciId) row.ciId = ci.ciId;
  if (notes.value) row.notes = notes.value;
  store.itsmProblems.push(row);
  return { problem: sanitize(store, row) };
}

export function patchItsmProblem(
  store: Store,
  principal: Principal,
  id: string,
  input: {
    title?: string;
    ticketId?: string;
    ciId?: string;
    notes?: string;
    status?: string;
  },
) {
  ensureItsmProblemCollections(store);
  const auth = authorize({
    principal,
    permission: "itsm:write:problem",
    action: "patch:itsm_problem",
  });
  if (auth.result === "deny") return deny(auth.reason);
  const human = requireHuman(principal);
  if (human) return human;
  const row = store.itsmProblems.find((item) => item.id === id && item.tenantId === principal.tenantId);
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
    if (!isValidItsmProblemStatus(input.status)) {
      return { error: "conflict" as const, reason: "invalid_transition" };
    }
    const next = canPatchItsmProblemStatus(row.status, input.status);
    if (!next.allowed) return { error: "conflict" as const, reason: next.reason };
    row.status = input.status;
  }
  row.updatedAt = new Date().toISOString();
  row.updatedByPrincipalId = principal.id;
  return { problem: sanitize(store, row) };
}
