import { TICKET_SEVERITIES, type TicketSeverity } from "./itsm.js";

export const ALERT_SOURCES = ["devtest.webhook"] as const;
export type AlertSource = (typeof ALERT_SOURCES)[number];

export const ALERT_STATUSES = ["open", "acknowledged", "closed"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  closed: "Closed",
};

export function isValidAlertSource(value: string): value is AlertSource {
  return (ALERT_SOURCES as readonly string[]).includes(value);
}

export function isValidAlertStatus(value: string): value is AlertStatus {
  return (ALERT_STATUSES as readonly string[]).includes(value);
}

export function isValidAlertSeverity(value: string): value is TicketSeverity {
  return (TICKET_SEVERITIES as readonly string[]).includes(value);
}

export function nextAlertCode(existingCodes: readonly string[]): string {
  let max = 0;
  for (const code of existingCodes) {
    const match = /^ALT-(\d+)$/i.exec(code.trim());
    if (!match) continue;
    max = Math.max(max, Number(match[1]));
  }
  return `ALT-${String(max + 1).padStart(4, "0")}`;
}

export function canTransitionAlert(
  from: AlertStatus,
  action: "acknowledge" | "close",
): { allowed: true; next: AlertStatus } | { allowed: false; reason: "invalid_transition" } {
  if (action === "acknowledge" && from === "open") return { allowed: true, next: "acknowledged" };
  if (action === "close" && (from === "open" || from === "acknowledged")) {
    return { allowed: true, next: "closed" };
  }
  return { allowed: false, reason: "invalid_transition" };
}

export type SecurityAlert = {
  id: string;
  tenantId: string;
  alertCode: string;
  source: AlertSource;
  title: string;
  summary?: string;
  severity: TicketSeverity;
  status: AlertStatus;
  externalId?: string;
  ciId?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
  createdByPrincipalId: string;
  updatedByPrincipalId: string;
};
