import { authorize, type NotifEmailDeliveryAnalytics, type Principal } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";

const DEFAULT_WINDOW_HOURS = 168;

function bump(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

/** I3.11 — aggregate delivery events, suppressions, and outbox for the tenant. */
export function getEmailDeliveryAnalytics(
  store: Store,
  principal: Principal,
  options: { windowHours?: number } = {},
): { analytics: NotifEmailDeliveryAnalytics; increment: "I3.11" } | { error: "forbidden"; reason: string } {
  const decision = authorize({
    principal,
    permission: "notification:read:email_outbox",
    action: "read:email_analytics",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const windowHours = options.windowHours && options.windowHours > 0 ? options.windowHours : DEFAULT_WINDOW_HOURS;
  const cutoff = Date.now() - windowHours * 60 * 60 * 1000;

  const deliveryEventsByType: Record<string, number> = {};
  let recentDeliveryEvents = 0;
  for (const event of store.notifEmailDeliveryEvents ?? []) {
    if (event.tenantId && event.tenantId !== principal.tenantId) continue;
    bump(deliveryEventsByType, event.eventType);
    if (new Date(event.receivedAt).getTime() >= cutoff) recentDeliveryEvents += 1;
  }

  const suppressionsByReason: Record<string, number> = {};
  let activeSuppressions = 0;
  let liftedSuppressions = 0;
  for (const row of store.notifEmailSuppressions ?? []) {
    if (row.tenantId !== principal.tenantId) continue;
    if (row.liftedAt) {
      liftedSuppressions += 1;
      continue;
    }
    activeSuppressions += 1;
    bump(suppressionsByReason, row.reason);
  }

  const outboxByStatus: Record<string, number> = {};
  for (const entry of store.notifEmailOutbox ?? []) {
    if (entry.tenantId !== principal.tenantId) continue;
    bump(outboxByStatus, entry.status);
  }

  return {
    analytics: {
      deliveryEventsByType,
      suppressionsByReason,
      activeSuppressions,
      liftedSuppressions,
      outboxByStatus,
      recentDeliveryEvents,
      windowHours,
    },
    increment: "I3.11" as const,
  };
}
