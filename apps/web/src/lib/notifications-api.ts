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
