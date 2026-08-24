export const TICKET_TYPES = ["incident", "request"] as const;
export type TicketType = (typeof TICKET_TYPES)[number];

export const TICKET_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type TicketSeverity = (typeof TICKET_SEVERITIES)[number];

export const TICKET_STATUSES = [
  "open",
  "triaged",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "cancelled",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_ACTIONS = ["triage", "assign", "start", "resolve", "close", "cancel"] as const;
export type TicketAction = (typeof TICKET_ACTIONS)[number];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  triaged: "Triaged",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const TICKET_TYPE_LABELS: Record<TicketType, string> = {
  incident: "Incident",
  request: "Request",
};

export function isValidTicketType(value: string): value is TicketType {
  return (TICKET_TYPES as readonly string[]).includes(value);
}

export function isValidTicketSeverity(value: string): value is TicketSeverity {
  return (TICKET_SEVERITIES as readonly string[]).includes(value);
}

export function isValidTicketStatus(value: string): value is TicketStatus {
  return (TICKET_STATUSES as readonly string[]).includes(value);
}

export function nextTicketCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^TKT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `TKT-${String(max + 1).padStart(4, "0")}`;
}

const TICKET_TRANSITIONS: Record<TicketStatus, Partial<Record<TicketAction, TicketStatus>>> = {
  open: { triage: "triaged", cancel: "cancelled" },
  triaged: { assign: "assigned", cancel: "cancelled" },
  assigned: { start: "in_progress", triage: "triaged" },
  in_progress: { resolve: "resolved", assign: "assigned" },
  resolved: { close: "closed", start: "in_progress" },
  closed: {},
  cancelled: {},
};

export function canTransitionTicket(
  from: TicketStatus,
  action: TicketAction,
): { allowed: true; next: TicketStatus } | { allowed: false; reason: "invalid_transition" } {
  const next = TICKET_TRANSITIONS[from][action];
  if (!next) return { allowed: false, reason: "invalid_transition" };
  return { allowed: true, next };
}

export type ItsmTicket = {
  id: string;
  tenantId: string;
  ticketCode: string;
  title: string;
  description?: string;
  ticketType: TicketType;
  severity: TicketSeverity;
  status: TicketStatus;
  assignedPrincipalId?: string;
  environment?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};

export type ItsmTicketCi = {
  id: string;
  tenantId: string;
  ticketId: string;
  ciId: string;
  createdAt: string;
};
