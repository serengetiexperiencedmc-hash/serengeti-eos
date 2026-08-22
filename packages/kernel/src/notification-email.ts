import type { NotifItem } from "./notification.js";

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
  status: "queued" | "sent" | "failed";
  adapter: string;
  sentAt?: string;
  createdAt: string;
};

export function buildEmailFromNotification(item: NotifItem, recipientEmail: string): EmailNotificationMessage {
  return {
    to: recipientEmail,
    subject: `[EOS ${item.severity.toUpperCase()}] ${item.title}`,
    bodyText: `${item.title}\n\n${item.body}\n\nView in EOS: ${item.href}`,
    notificationKey: item.key,
    templateKey: `notif.${item.category}.${item.severity}`,
  };
}

export function shouldEmailNotification(item: NotifItem): boolean {
  return item.severity === "urgent" || item.severity === "warning";
}
