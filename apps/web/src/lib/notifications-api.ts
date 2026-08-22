import { eosFetch } from "./eos-client";

export type NotificationItem = {
  key: string;
  category: "rfp" | "finance" | "operations" | "approval" | "handover";
  severity: "info" | "warning" | "urgent";
  title: string;
  body: string;
  href: string;
  createdAt: string;
};

export async function listNotifications(token: string) {
  return eosFetch<{ items: NotificationItem[]; unreadCount: number }>("/v1/notifications", { token });
}

export async function getUnreadCount(token: string) {
  return eosFetch<{ unreadCount: number }>("/v1/notifications/unread-count", { token });
}

export async function dismissNotification(token: string, key: string) {
  return eosFetch<{ dismissed: string }>(`/v1/notifications/${encodeURIComponent(key)}/dismiss`, {
    token,
    method: "POST",
    body: "{}",
  });
}

export async function dismissAllNotifications(token: string) {
  return eosFetch<{ dismissed: number }>("/v1/notifications/dismiss-all", { token, method: "POST", body: "{}" });
}

export type EmailOutboxItem = {
  id: string;
  notificationKey: string;
  to: string;
  subject: string;
  templateKey: string;
  status: "queued" | "sent" | "failed";
  adapter: string;
  sentAt?: string;
  createdAt: string;
};

export async function listEmailOutbox(token: string) {
  return eosFetch<{ items: EmailOutboxItem[] }>("/v1/notifications/email/outbox", { token });
}

export async function dispatchEmailDigest(token: string) {
  return eosFetch<{ dispatched: string[]; skipped: { key: string; reason?: string }[]; adapter: string }>(
    "/v1/notifications/email/dispatch-digest",
    { token, method: "POST", body: "{}" },
  );
}

export async function getEmailAdapterHealth(token: string) {
  return eosFetch<{ module: string; increment: string; adapter: string; status: string; outboxCount: number }>(
    "/v1/notifications/email/health",
    { token },
  );
}
