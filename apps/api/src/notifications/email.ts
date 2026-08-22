import {
  authorize,
  buildEmailFromNotification,
  newId,
  shouldEmailNotification,
  type EmailNotificationAdapter,
  type EmailNotificationMessage,
  type NotifEmailOutboxEntry,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";
import { buildLiveNotifications } from "./notifications.js";

export function createDevOutboxEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  return {
    name: "dev-outbox",
    async send(message: EmailNotificationMessage) {
      ensureNotificationCollections(store);
      if (!store.notifEmailOutbox) store.notifEmailOutbox = [];

      const existing = store.notifEmailOutbox.find(
        (e) =>
          e.tenantId === principal.tenantId &&
          e.principalId === principal.id &&
          e.notificationKey === message.notificationKey,
      );
      if (existing) return { status: "skipped", reason: "already_dispatched" };

      const now = new Date().toISOString();
      const entry: NotifEmailOutboxEntry = {
        id: newId(),
        tenantId: principal.tenantId,
        principalId: principal.id,
        notificationKey: message.notificationKey,
        to: message.to,
        subject: message.subject,
        bodyText: message.bodyText,
        templateKey: message.templateKey,
        status: "sent",
        adapter: "dev-outbox",
        sentAt: now,
        createdAt: now,
      };
      store.notifEmailOutbox.push(entry);
      return { status: "sent" };
    },
  };
}

export async function dispatchEmailDigest(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:dispatch:email", action: "dispatch:email_digest" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  if (!principal.email) return { error: "invalid_request" as const, reason: "principal_has_no_email" };

  const adapter = createDevOutboxEmailAdapter(store, principal);
  const items = buildLiveNotifications(store, principal).filter(shouldEmailNotification);

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string }[] = [];

  for (const item of items) {
    const message = buildEmailFromNotification(item, principal.email);
    const result = await adapter.send(message);
    if (result.status === "sent") dispatched.push(item.key);
    else skipped.push({ key: item.key, reason: result.reason });
  }

  return { dispatched, skipped, adapter: adapter.name };
}

export function listEmailOutbox(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:read:email_outbox", action: "read:email_outbox" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const items = (store.notifEmailOutbox ?? [])
    .filter((e) => e.tenantId === principal.tenantId && e.principalId === principal.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((e) => ({
      id: e.id,
      notificationKey: e.notificationKey,
      to: e.to,
      subject: e.subject,
      templateKey: e.templateKey,
      status: e.status,
      adapter: e.adapter,
      sentAt: e.sentAt,
      createdAt: e.createdAt,
    }));
  return { items };
}

export function getEmailAdapterHealth(store: Store) {
  ensureNotificationCollections(store);
  return {
    module: "notification-email",
    increment: "I3.1",
    adapter: "dev-outbox",
    status: "ok" as const,
    outboxCount: (store.notifEmailOutbox ?? []).length,
  };
}
