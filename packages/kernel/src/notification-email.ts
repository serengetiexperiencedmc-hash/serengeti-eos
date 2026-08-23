import type { NotifItem } from "./notification.js";
import { resolveEmailTemplate } from "./notification-template.js";

export type EmailNotificationMessage = {
  to: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  notificationKey: string;
  templateKey: string;
};

export type EmailSendResult = {
  status: "sent" | "queued" | "skipped";
  reason?: string;
};

export type EmailNotificationAdapter = {
  readonly name: string;
  send(message: EmailNotificationMessage): Promise<EmailSendResult>;
};

export type NotifEmailOutboxEntry = {
  id: string;
  tenantId: string;
  principalId: string;
  notificationKey: string;
  to: string;
  subject: string;
  bodyText: string;
  templateKey: string;
  status: "queued" | "sent" | "failed" | "bounced" | "complained" | "delivered" | "rejected";
  adapter: string;
  sesMessageId?: string;
  sentAt?: string;
  createdAt: string;
};

export type NotifEmailDeliveryEvent = {
  id: string;
  tenantId?: string;
  outboxId?: string;
  eventType: "bounce" | "complaint" | "delivery" | "reject" | "open" | "click";
  sesMessageId?: string;
  snsMessageId?: string;
  recipientEmail?: string;
  receivedAt: string;
  /** Optional SES/SNS payload retained for Dev/Test audit (I3.12). */
  payload?: Record<string, unknown>;
};

export type NotifEmailSuppressionReason = "bounce" | "complaint" | "reject" | "manual" | "ses_account";

export type NotifEmailSuppression = {
  id: string;
  tenantId: string;
  email: string;
  reason: NotifEmailSuppressionReason;
  sourceEventId?: string;
  createdAt: string;
  liftedAt?: string;
};

/** I3.14–I3.16 — transactional override: allowlisted addresses bypass active suppressions. */
export type NotifEmailAllowlistEntry = {
  id: string;
  tenantId: string;
  email: string;
  note?: string;
  createdAt: string;
  createdByPrincipalId?: string;
  /** ISO timestamp; when set and past, entry is inactive (I3.15). */
  expiresAt?: string;
  revokedAt?: string;
  /** Last time SES sync saw this address on the account suppression list (I3.16). */
  sesNotedAt?: string;
  /** SES reason captured during sync when allowlisted (I3.16). */
  sesSyncNote?: string;
  /** I3.17 — dual-control gate when SES-noted VIP override is active. */
  sesDualControlStatus?: "not_required" | "pending" | "approved";
  sesApprovedAt?: string;
  sesApprovedByPrincipalId?: string;
  sesApprovalRequestedByPrincipalId?: string;
  /** I3.20 — suppress dual-control inbox reminder until this time. */
  dualReminderSnoozeUntil?: string;
  dualReminderSnoozedByPrincipalId?: string;
  /** I3.20 — dismiss dual-control inbox reminder (until cleared). */
  dualReminderDismissedAt?: string;
  dualReminderDismissReason?: string;
  dualReminderDismissedByPrincipalId?: string;
};

/** I4.17 — ops aliases that also receive DLQ SLA digest emails. */
export type NotifDlqSlaDigestRecipient = {
  id: string;
  tenantId: string;
  email: string;
  note?: string;
  source: "store" | "env";
  createdAt: string;
  createdByPrincipalId?: string;
  revokedAt?: string;
};

/** I4.24 — tenant-level snooze/ack for stale DLQ SLA digest inbox. */
export type NotifDlqSlaDigestStaleSuppression = {
  tenantId: string;
  acknowledgedAt?: string;
  snoozedUntil?: string;
  updatedAt: string;
  updatedByPrincipalId: string;
};

/** I4.26 — audit trail for stale DLQ SLA digest snooze/ack/clear. */
export type NotifDlqSlaDigestStaleSuppressionAudit = {
  id: string;
  tenantId: string;
  action: "snooze" | "ack" | "cleared";
  snoozedUntil?: string;
  acknowledgedAt?: string;
  createdAt: string;
  createdByPrincipalId: string;
};

/** I4.19/I4.20 — last DLQ SLA digest dispatch stamp (per tenant). */
export type NotifDlqSlaDigestLastRun = {
  tenantId: string;
  day: string;
  lastRunAt: string;
  lastRunByPrincipalId: string;
  breachedCount: number;
  dispatchedCount: number;
  skippedCount: number;
  recipientCount: number;
};

/** I3.22 — ops aliases that also receive allowlist dual-control digest emails. */
export type NotifAllowlistDualDigestRecipient = {
  id: string;
  tenantId: string;
  email: string;
  note?: string;
  source: "store" | "env";
  createdAt: string;
  createdByPrincipalId?: string;
  revokedAt?: string;
};

/** I3.29 — audit trail for stale allowlist dual digest snooze/ack/clear. */
export type NotifAllowlistDualDigestStaleSuppressionAudit = {
  id: string;
  tenantId: string;
  action: "snooze" | "ack" | "cleared";
  snoozedUntil?: string;
  acknowledgedAt?: string;
  createdAt: string;
  createdByPrincipalId: string;
};

/** I3.27 — tenant-level snooze/ack for stale allowlist dual digest inbox. */
export type NotifAllowlistDualDigestStaleSuppression = {
  tenantId: string;
  acknowledgedAt?: string;
  snoozedUntil?: string;
  updatedAt: string;
  updatedByPrincipalId: string;
};

/** I3.23 — last allowlist dual-control digest dispatch stamp (per tenant). */
export type NotifAllowlistDualDigestLastRun = {
  tenantId: string;
  day: string;
  lastRunAt: string;
  lastRunByPrincipalId: string;
  pendingCount: number;
  dispatchedCount: number;
  skippedCount: number;
  recipientCount: number;
};

export type NotifEmailDeliveryAnalytics = {
  deliveryEventsByType: Record<string, number>;
  suppressionsByReason: Record<string, number>;
  activeSuppressions: number;
  liftedSuppressions: number;
  outboxByStatus: Record<string, number>;
  recentDeliveryEvents: number;
  windowHours: number;
};

export function buildEmailFromNotification(
  item: NotifItem,
  recipientEmail: string,
  templateOverrides: Parameters<typeof resolveEmailTemplate>[2] = [],
): EmailNotificationMessage {
  const templateKey = `notif.${item.category}.${item.severity}`;
  const resolved = resolveEmailTemplate(
    templateKey,
    { severity: item.severity, title: item.title, body: item.body, href: item.href },
    templateOverrides,
  );
  return {
    to: recipientEmail,
    subject: resolved.subject,
    bodyText: resolved.bodyText,
    bodyHtml: resolved.bodyHtml,
    notificationKey: item.key,
    templateKey: resolved.templateKey,
  };
}

export function shouldEmailNotification(item: NotifItem): boolean {
  return item.severity === "urgent" || item.severity === "warning";
}
