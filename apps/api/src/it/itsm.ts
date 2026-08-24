import {
  authorize,
  canTransitionTicket,
  isValidTicketSeverity,
  isValidTicketStatus,
  isValidTicketType,
  newId,
  nextTicketCode,
  type ItsmTicket,
  type ItsmTicketCi,
  type Principal,
  type TicketAction,
  type TicketSeverity,
  type TicketStatus,
  type TicketType,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { principalById } from "../store.js";
import { ensureItCollections } from "./collections.js";

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function findTicket(store: Store, tenantId: string, id: string) {
  return store.itsmTickets.find((t) => t.id === id && t.tenantId === tenantId);
}

function findCi(store: Store, tenantId: string, id: string) {
  return store.cmdbCis.find((c) => c.id === id && c.tenantId === tenantId);
}

export type ItsmTicketView = {
  id: string;
  ticketCode: string;
  title: string;
  ticketType: TicketType;
  severity: TicketSeverity;
  status: TicketStatus;
  ciCount: number;
  description?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  environment?: string;
};

export type ItsmTicketCiView = {
  ciId: string;
  ciCode: string;
  name: string;
  ciClass: string;
};

function assignee(store: Store, ticket: ItsmTicket) {
  if (!ticket.assignedPrincipalId) return {};
  const principal = principalById(store, ticket.assignedPrincipalId);
  if (!principal || principal.tenantId !== ticket.tenantId) return {};
  const out: { assignedToEmail?: string; assignedToName?: string } = {
    assignedToName: principal.displayName,
  };
  if (principal.email) out.assignedToEmail = principal.email;
  return out;
}

function sanitizeTicket(store: Store, ticket: ItsmTicket): ItsmTicketView {
  const view: ItsmTicketView = {
    id: ticket.id,
    ticketCode: ticket.ticketCode,
    title: ticket.title,
    ticketType: ticket.ticketType,
    severity: ticket.severity,
    status: ticket.status,
    ciCount: store.itsmTicketCis.filter((l) => l.ticketId === ticket.id && l.tenantId === ticket.tenantId).length,
  };
  if (ticket.description) view.description = ticket.description;
  if (ticket.environment) view.environment = ticket.environment;
  Object.assign(view, assignee(store, ticket));
  return view;
}

export function getItsmModuleHealth(store: Store, principal: Principal) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:read:ticket", action: "read:itsm_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const tenantId = principal.tenantId;
  const tickets = store.itsmTickets.filter((t) => t.tenantId === tenantId);
  return {
    module: "itsm",
    increment: "I11" as const,
    status: "ok" as const,
    tickets: tickets.length,
    openTickets: tickets.filter((t) => t.status !== "closed" && t.status !== "cancelled").length,
  };
}

export function listTickets(
  store: Store,
  principal: Principal,
  query?: { q?: string; status?: string; ticketType?: string },
) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:read:ticket", action: "read:itsm_ticket" });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidTicketStatus(query.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  if (query?.ticketType && !isValidTicketType(query.ticketType)) {
    return { error: "invalid_request" as const, reason: "invalid_ticket_type" };
  }
  let items = store.itsmTickets.filter((t) => t.tenantId === principal.tenantId);
  if (query?.status) items = items.filter((t) => t.status === query.status);
  if (query?.ticketType) items = items.filter((t) => t.ticketType === query.ticketType);
  const q = query?.q?.trim().toLowerCase();
  if (q) {
    items = items.filter((t) => `${t.ticketCode} ${t.title} ${t.description ?? ""}`.toLowerCase().includes(q));
  }
  items = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map((t) => sanitizeTicket(store, t)) };
}

export function getTicket(store: Store, principal: Principal, id: string) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:read:ticket", action: "read:itsm_ticket" });
  if (decision.result === "deny") return deny(decision.reason);
  const ticket = findTicket(store, principal.tenantId, id);
  if (!ticket) return { error: "not_found" as const, reason: "ticket_not_found" };
  const cis: ItsmTicketCiView[] = store.itsmTicketCis
    .filter((l) => l.ticketId === ticket.id && l.tenantId === principal.tenantId)
    .map((l) => {
      const ci = findCi(store, principal.tenantId, l.ciId);
      return {
        ciId: l.ciId,
        ciCode: ci?.ciCode ?? "",
        name: ci?.name ?? "",
        ciClass: ci?.ciClass ?? "",
      };
    });
  return { ticket: sanitizeTicket(store, ticket), cis };
}

export type CreateTicketInput = {
  title?: string;
  description?: string;
  ticketType?: string;
  severity?: string;
  environment?: string;
};

export function createTicket(store: Store, principal: Principal, input: CreateTicketInput) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:write:ticket", action: "write:itsm_ticket" });
  if (decision.result === "deny") return deny(decision.reason);
  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };
  if (!input.ticketType || !isValidTicketType(input.ticketType)) {
    return { error: "invalid_request" as const, reason: "invalid_ticket_type" };
  }
  if (input.severity && !isValidTicketSeverity(input.severity)) {
    return { error: "invalid_request" as const, reason: "invalid_severity" };
  }
  const now = new Date().toISOString();
  const tenantTickets = store.itsmTickets.filter((t) => t.tenantId === principal.tenantId);
  const ticket: ItsmTicket = {
    id: newId(),
    tenantId: principal.tenantId,
    ticketCode: nextTicketCode(tenantTickets.map((t) => t.ticketCode)),
    title,
    ticketType: input.ticketType,
    severity: input.severity && isValidTicketSeverity(input.severity) ? input.severity : "medium",
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  const description = input.description?.trim();
  if (description) ticket.description = description;
  const environment = input.environment?.trim();
  if (environment) ticket.environment = environment;
  store.itsmTickets.push(ticket);
  return { ticket: sanitizeTicket(store, ticket) };
}

export type PatchTicketInput = {
  title?: string;
  description?: string | null;
  severity?: string;
  environment?: string | null;
};

export function patchTicket(store: Store, principal: Principal, id: string, input: PatchTicketInput) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:write:ticket", action: "write:itsm_ticket" });
  if (decision.result === "deny") return deny(decision.reason);
  const ticket = findTicket(store, principal.tenantId, id);
  if (!ticket) return { error: "not_found" as const, reason: "ticket_not_found" };
  if (ticket.status === "closed" || ticket.status === "cancelled") {
    return { error: "conflict" as const, reason: "ticket_terminal" };
  }
  if (input.severity && !isValidTicketSeverity(input.severity)) {
    return { error: "invalid_request" as const, reason: "invalid_severity" };
  }
  if (typeof input.title === "string") {
    const title = input.title.trim();
    if (!title) return { error: "invalid_request" as const, reason: "title_required" };
    ticket.title = title;
  }
  if (input.description === null) delete ticket.description;
  else if (typeof input.description === "string") {
    const description = input.description.trim();
    if (description) ticket.description = description;
    else delete ticket.description;
  }
  if (input.severity && isValidTicketSeverity(input.severity)) ticket.severity = input.severity;
  if (input.environment === null) delete ticket.environment;
  else if (typeof input.environment === "string") {
    const environment = input.environment.trim();
    if (environment) ticket.environment = environment;
    else delete ticket.environment;
  }
  ticket.updatedAt = new Date().toISOString();
  ticket.updatedByPrincipalId = principal.id;
  return { ticket: sanitizeTicket(store, ticket) };
}

function permissionForAction(action: TicketAction): string {
  if (action === "assign") return "itsm:assign:ticket";
  if (action === "resolve") return "itsm:resolve:ticket";
  if (action === "close") return "itsm:close:ticket";
  return "itsm:write:ticket";
}

function resolveAssignee(store: Store, tenantId: string, email: string | undefined) {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return { error: "invalid_request" as const, reason: "assigned_to_email_required" };
  const principal = [...store.principals.values()].find(
    (p) => p.tenantId === tenantId && p.email?.toLowerCase() === normalized,
  );
  if (!principal) return { error: "invalid_request" as const, reason: "principal_not_found" };
  return { principalId: principal.id };
}

export function transitionTicket(
  store: Store,
  principal: Principal,
  id: string,
  action: TicketAction,
  input?: { assignedToEmail?: string },
) {
  ensureItCollections(store);
  const decision = authorize({
    principal,
    permission: permissionForAction(action),
    action: `${action}:itsm_ticket`,
  });
  if (decision.result === "deny") return deny(decision.reason);
  const ticket = findTicket(store, principal.tenantId, id);
  if (!ticket) return { error: "not_found" as const, reason: "ticket_not_found" };

  if (action === "assign") {
    const resolved = resolveAssignee(store, principal.tenantId, input?.assignedToEmail);
    if ("error" in resolved) return resolved;
    ticket.assignedPrincipalId = resolved.principalId;
    if (ticket.status === "open" || ticket.status === "assigned" || ticket.status === "in_progress") {
      ticket.updatedAt = new Date().toISOString();
      ticket.updatedByPrincipalId = principal.id;
      return { ticket: sanitizeTicket(store, ticket) };
    }
  }

  const gate = canTransitionTicket(ticket.status, action);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };
  if (action === "assign" && !ticket.assignedPrincipalId) {
    return { error: "invalid_request" as const, reason: "assigned_to_email_required" };
  }
  ticket.status = gate.next;
  ticket.updatedAt = new Date().toISOString();
  ticket.updatedByPrincipalId = principal.id;
  return { ticket: sanitizeTicket(store, ticket) };
}

export function linkTicketCi(store: Store, principal: Principal, ticketId: string, ciId: string | undefined) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:write:ticket", action: "write:itsm_ticket_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  const ticket = findTicket(store, principal.tenantId, ticketId);
  if (!ticket) return { error: "not_found" as const, reason: "ticket_not_found" };
  if (!ciId) return { error: "invalid_request" as const, reason: "ci_id_required" };
  const ci = findCi(store, principal.tenantId, ciId);
  if (!ci) return { error: "not_found" as const, reason: "ci_not_found" };
  const existing = store.itsmTicketCis.find(
    (l) => l.ticketId === ticket.id && l.ciId === ci.id && l.tenantId === principal.tenantId,
  );
  if (existing) return getTicket(store, principal, ticket.id);
  const link: ItsmTicketCi = {
    id: newId(),
    tenantId: principal.tenantId,
    ticketId: ticket.id,
    ciId: ci.id,
    createdAt: new Date().toISOString(),
  };
  store.itsmTicketCis.push(link);
  return getTicket(store, principal, ticket.id);
}

export function unlinkTicketCi(store: Store, principal: Principal, ticketId: string, ciId: string) {
  ensureItCollections(store);
  const decision = authorize({ principal, permission: "itsm:write:ticket", action: "write:itsm_ticket_ci" });
  if (decision.result === "deny") return deny(decision.reason);
  const ticket = findTicket(store, principal.tenantId, ticketId);
  if (!ticket) return { error: "not_found" as const, reason: "ticket_not_found" };
  const idx = store.itsmTicketCis.findIndex(
    (l) => l.ticketId === ticket.id && l.ciId === ciId && l.tenantId === principal.tenantId,
  );
  if (idx < 0) return { error: "not_found" as const, reason: "ticket_ci_not_found" };
  store.itsmTicketCis.splice(idx, 1);
  return getTicket(store, principal, ticket.id);
}

export function createSocIncidentTicket(
  store: Store,
  principal: Principal,
  input: { title: string; severity: TicketSeverity; description?: string; ciId?: string },
) {
  ensureItCollections(store);
  if (input.ciId) {
    const ci = findCi(store, principal.tenantId, input.ciId);
    if (!ci) return { error: "not_found" as const, reason: "ci_not_found" };
  }
  const now = new Date().toISOString();
  const tenantTickets = store.itsmTickets.filter((t) => t.tenantId === principal.tenantId);
  const ticket: ItsmTicket = {
    id: newId(),
    tenantId: principal.tenantId,
    ticketCode: nextTicketCode(tenantTickets.map((t) => t.ticketCode)),
    title: input.title,
    ticketType: "incident",
    severity: input.severity,
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (input.description) ticket.description = input.description;
  store.itsmTickets.push(ticket);
  if (input.ciId) {
    store.itsmTicketCis.push({
      id: newId(),
      tenantId: principal.tenantId,
      ticketId: ticket.id,
      ciId: input.ciId,
      createdAt: now,
    });
  }
  return { ticket: sanitizeTicket(store, ticket) };
}
