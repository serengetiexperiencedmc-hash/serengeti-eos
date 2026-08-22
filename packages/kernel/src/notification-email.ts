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

/** I3.14 — transactional override: allowlisted addresses bypass active suppressions. */
export type NotifEmailAllowlistEntry = {
  id: string;
  tenantId: string;
  email: string;
  note?: string;
  createdAt: string;
  createdByPrincipalId?: string;
  revokedAt?: string;
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
