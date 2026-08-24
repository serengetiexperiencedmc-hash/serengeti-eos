import {
  authorize,
  canTransitionAlert,
  isValidAlertSeverity,
  isValidAlertStatus,
  newId,
  nextAlertCode,
  type AlertStatus,
  type Principal,
  type SecurityAlert,
  type TicketSeverity,
} from "@sedmc/kernel";
import { createSocIncidentTicket } from "../it/itsm.js";
import type { Store } from "../store.js";
import { ensureSocCollections } from "./collections.js";

const SUMMARY_MAX = 2000;

function deny<T extends string>(reason: T) {
  return { error: "forbidden" as const, reason };
}

function findAlert(store: Store, tenantId: string, id: string) {
  return store.securityAlerts.find((a) => a.id === id && a.tenantId === tenantId);
}

export type SecurityAlertView = {
  id: string;
  alertCode: string;
  source: "devtest.webhook";
  title: string;
  severity: TicketSeverity;
  status: AlertStatus;
  summary?: string;
  externalId?: string;
  ciId?: string;
  ticketId?: string;
  ticketCode?: string;
};

function ticketCodeFor(store: Store, alert: SecurityAlert) {
  if (!alert.ticketId) return undefined;
  return store.itsmTickets.find((t) => t.id === alert.ticketId && t.tenantId === alert.tenantId)?.ticketCode;
}

function sanitize(store: Store, alert: SecurityAlert): SecurityAlertView {
  const view: SecurityAlertView = {
    id: alert.id,
    alertCode: alert.alertCode,
    source: "devtest.webhook",
    title: alert.title,
    severity: alert.severity,
    status: alert.status,
  };
  if (alert.summary) view.summary = alert.summary;
  if (alert.externalId) view.externalId = alert.externalId;
  if (alert.ciId) view.ciId = alert.ciId;
  if (alert.ticketId) view.ticketId = alert.ticketId;
  const ticketCode = ticketCodeFor(store, alert);
  if (ticketCode) view.ticketCode = ticketCode;
  return view;
}

export function getSecurityHealth(store: Store, principal: Principal) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:read:alert", action: "read:security_health" });
  if (decision.result === "deny") return deny(decision.reason);
  const alerts = store.securityAlerts.filter((a) => a.tenantId === principal.tenantId);
  return {
    module: "security",
    increment: "I13" as const,
    status: "ok" as const,
    alerts: alerts.length,
    openAlerts: alerts.filter((a) => a.status !== "closed").length,
    cases: alerts.filter((a) => Boolean(a.ticketId)).length,
  };
}

export function listAlerts(store: Store, principal: Principal, query?: { q?: string; status?: string }) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:read:alert", action: "read:security_alert" });
  if (decision.result === "deny") return deny(decision.reason);
  if (query?.status && !isValidAlertStatus(query.status)) {
    return { error: "invalid_request" as const, reason: "invalid_status" };
  }
  let items = store.securityAlerts.filter((a) => a.tenantId === principal.tenantId);
  if (query?.status) items = items.filter((a) => a.status === query.status);
  const q = query?.q?.trim().toLowerCase();
  if (q) items = items.filter((a) => `${a.alertCode} ${a.title}`.toLowerCase().includes(q));
  items = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return { items: items.map((a) => sanitize(store, a)) };
}

export function getAlert(store: Store, principal: Principal, id: string) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:read:alert", action: "read:security_alert" });
  if (decision.result === "deny") return deny(decision.reason);
  const alert = findAlert(store, principal.tenantId, id);
  if (!alert) return { error: "not_found" as const, reason: "alert_not_found" };
  return { alert: sanitize(store, alert) };
}

export function ingestAlert(
  store: Store,
  principal: Principal,
  input: { title?: string; summary?: string; severity?: string; externalId?: string; ciId?: string },
) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:ingest:alert", action: "ingest:security_alert" });
  if (decision.result === "deny") return deny(decision.reason);
  const title = input.title?.trim();
  if (!title) return { error: "invalid_request" as const, reason: "title_required" };
  if (input.severity && !isValidAlertSeverity(input.severity)) {
    return { error: "invalid_request" as const, reason: "invalid_severity" };
  }
  const summary = input.summary?.trim();
  if (summary && summary.length > SUMMARY_MAX) {
    return { error: "invalid_request" as const, reason: "summary_too_long" };
  }
  const externalId = input.externalId?.trim();
  if (externalId) {
    const existing = store.securityAlerts.find(
      (a) => a.tenantId === principal.tenantId && a.externalId?.toLowerCase() === externalId.toLowerCase(),
    );
    if (existing) return { alert: sanitize(store, existing), idempotent: true as const };
  }
  if (input.ciId) {
    const ci = store.cmdbCis.find((c) => c.id === input.ciId && c.tenantId === principal.tenantId);
    if (!ci) return { error: "not_found" as const, reason: "ci_not_found" };
  }
  const now = new Date().toISOString();
  const tenantAlerts = store.securityAlerts.filter((a) => a.tenantId === principal.tenantId);
  const alert: SecurityAlert = {
    id: newId(),
    tenantId: principal.tenantId,
    alertCode: nextAlertCode(tenantAlerts.map((a) => a.alertCode)),
    source: "devtest.webhook",
    title,
    severity: input.severity && isValidAlertSeverity(input.severity) ? input.severity : "medium",
    status: "open",
    createdAt: now,
    updatedAt: now,
    createdByPrincipalId: principal.id,
    updatedByPrincipalId: principal.id,
  };
  if (summary) alert.summary = summary;
  if (externalId) alert.externalId = externalId;
  if (input.ciId) alert.ciId = input.ciId;
  store.securityAlerts.push(alert);
  return { alert: sanitize(store, alert) };
}

export function transitionAlert(
  store: Store,
  principal: Principal,
  id: string,
  action: "acknowledge" | "close",
) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:write:alert", action: `${action}:security_alert` });
  if (decision.result === "deny") return deny(decision.reason);
  const alert = findAlert(store, principal.tenantId, id);
  if (!alert) return { error: "not_found" as const, reason: "alert_not_found" };
  const gate = canTransitionAlert(alert.status, action);
  if (!gate.allowed) return { error: "conflict" as const, reason: gate.reason };
  alert.status = gate.next;
  alert.updatedAt = new Date().toISOString();
  alert.updatedByPrincipalId = principal.id;
  return { alert: sanitize(store, alert) };
}

export function openAlertCase(store: Store, principal: Principal, id: string) {
  ensureSocCollections(store);
  const decision = authorize({ principal, permission: "security:write:case", action: "write:security_case" });
  if (decision.result === "deny") return deny(decision.reason);
  const alert = findAlert(store, principal.tenantId, id);
  if (!alert) return { error: "not_found" as const, reason: "alert_not_found" };
  if (alert.status === "closed") return { error: "conflict" as const, reason: "alert_closed" };
  if (alert.ticketId) return { error: "conflict" as const, reason: "case_already_open" };
  const description = [`SOC ${alert.alertCode}`, alert.summary].filter(Boolean).join("\n");
  const created = createSocIncidentTicket(store, principal, {
    title: alert.title,
    severity: alert.severity,
    description,
    ...(alert.ciId ? { ciId: alert.ciId } : {}),
  });
  if ("error" in created) return created;
  alert.ticketId = created.ticket.id;
  if (alert.status === "open") alert.status = "acknowledged";
  alert.updatedAt = new Date().toISOString();
  alert.updatedByPrincipalId = principal.id;
  return { alert: sanitize(store, alert), ticket: created.ticket };
}
