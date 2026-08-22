import {
  authorize,
  newId,
  sortNotifications,
  type NotifItem,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { DLQ_SLA_THRESHOLD_HOURS } from "../outbox.js";
import { persistNotifDismissal } from "../persistence/notifications.js";
import { ensureNotificationCollections } from "./collections.js";
import { resolveEmailAdapterName } from "./email-config.js";

function isDismissed(store: Store, principalId: string, key: string): boolean {
  return store.notifDismissals.some((d) => d.principalId === principalId && d.notificationKey === key);
}

export function buildLiveNotifications(store: Store, principal: Principal): NotifItem[] {
  ensureNotificationCollections(store);
  const tenantId = principal.tenantId;
  const now = new Date().toISOString();
  const items: NotifItem[] = [];

  for (const rfp of store.rfpRfps.filter((r) => r.tenantId === tenantId && !r.archivedAt && r.status !== "closed")) {
    if (rfp.slaStatus === "at_risk" || rfp.slaStatus === "breached") {
      const key = `rfp-sla:${rfp.id}`;
      items.push({
        key,
        category: "rfp",
        severity: rfp.slaStatus === "breached" ? "urgent" : "warning",
        title: rfp.slaStatus === "breached" ? "RFP SLA breached" : "RFP SLA at risk",
        body: `${rfp.rfpCode} · ${rfp.title}`,
        href: `/commercial/rfps/${rfp.id}`,
        createdAt: rfp.updatedAt ?? now,
      });
    }
  }

  for (const rec of (store.finReconciliations ?? []).filter((r) => r.tenantId === tenantId && r.status === "exception")) {
    const key = `recon:${rec.id}`;
    items.push({
      key,
      category: "finance",
      severity: "warning",
      title: "Reconciliation exception",
      body: `Variance ${rec.variance} ${rec.currency} on booking ${rec.bookingId.slice(0, 8)}…`,
      href: "/commercial/finance",
      createdAt: rec.updatedAt,
    });
  }

  for (const conflict of (store.opsSyncConflicts ?? []).filter((c) => c.tenantId === tenantId && !c.resolution)) {
    const key = `sync:${conflict.id}`;
    items.push({
      key,
      category: "operations",
      severity: "warning",
      title: "Field sync conflict",
      body: `${conflict.entityType.replace(/_/g, " ")} · v${conflict.clientVersion} vs v${conflict.serverVersion}`,
      href: "/commercial/sync",
      createdAt: conflict.createdAt,
    });
  }

  for (const [approvalId, task] of store.approvals.entries()) {
    if (task.tenantId !== tenantId || task.status !== "pending" || task.actionClass !== "payment.release") continue;
    const payment = store.payments.get(task.resourceId);
    if (!payment) continue;
    const key = `payment-approval:${approvalId}`;
    items.push({
      key,
      category: "approval",
      severity: "urgent",
      title: "Payment approval required",
      body: `${payment.amount} ${payment.currency} to ${payment.beneficiary}`,
      href: "/commercial/finance",
      createdAt: now,
    });
  }

  for (const booking of store.bkgBookings.filter((b) => b.tenantId === tenantId && !b.archivedAt && b.status === "handover_pending")) {
    const pending = store.bkgHandoverTasks.filter((t) => t.bookingId === booking.id && t.status === "pending");
    if (pending.length > 0) {
      const key = `handover:${booking.id}`;
      items.push({
        key,
        category: "handover",
        severity: "info",
        title: "Handover tasks pending",
        body: `${booking.bookingCode} · ${pending.length} task(s) remaining`,
        href: `/commercial/bookings/${booking.id}`,
        createdAt: booking.updatedAt,
      });
    }

    const draftVouchers = (store.opsVouchers ?? []).filter(
      (v) => v.bookingId === booking.id && v.status === "draft",
    ).length;
    if (draftVouchers > 0) {
      items.push({
        key: `vouchers:${booking.id}`,
        category: "operations",
        severity: "info",
        title: "Guest vouchers pending issue",
        body: `${booking.bookingCode} · ${draftVouchers} draft voucher(s)`,
        href: `/commercial/operations/${booking.id}`,
        createdAt: now,
      });
    }
  }

  // I4.14 — escalate open DLQ rows past SLA threshold
  const canReadDlq =
    authorize({ principal, permission: "events:read:dlq", action: "read:dlq" }).result === "allow";
  if (canReadDlq) {
    const thresholdMs = DLQ_SLA_THRESHOLD_HOURS * 3_600_000;
    const nowMs = Date.now();
    for (const dlq of store.deadLetters.filter(
      (d) => d.tenantId === tenantId && d.status !== "closed" && d.status !== "resolved",
    )) {
      const ageMs = Math.max(0, nowMs - new Date(dlq.firstFailureAt).getTime());
      if (ageMs < thresholdMs) continue;
      const ageHours = Math.round((ageMs / 3_600_000) * 10) / 10;
      items.push({
        key: `dlq-sla:${dlq.id}`,
        category: "operations",
        severity: "urgent",
        title: "DLQ SLA breached",
        body: `${dlq.eventType} · ${ageHours}h open${dlq.owner ? ` · owner ${dlq.owner}` : ""}`,
        href: "/commercial/events",
        createdAt: dlq.firstFailureAt,
      });
    }
  }

  return sortNotifications(items.filter((item) => !isDismissed(store, principal.id, item.key)));
}

export function listNotifications(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:read:inbox", action: "read:notifications" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const items = buildLiveNotifications(store, principal);
  return { items, unreadCount: items.length };
}

export async function dismissNotification(store: Store, principal: Principal, key: string) {
  ensureNotificationCollections(store);
  const decision = authorize({ principal, permission: "notification:write:inbox", action: "dismiss:notification" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if (!store.notifDismissals.some((d) => d.principalId === principal.id && d.notificationKey === key)) {
    const entry = {
      id: newId(),
      tenantId: principal.tenantId,
      principalId: principal.id,
      notificationKey: key,
      dismissedAt: new Date().toISOString(),
    };
    store.notifDismissals.push(entry);
    await persistNotifDismissal(store.dbPool, entry);
  }
  return { dismissed: key };
}

export async function dismissAllNotifications(store: Store, principal: Principal) {
  const live = buildLiveNotifications(store, principal);
  for (const item of live) {
    await dismissNotification(store, principal, item.key);
  }
  return { dismissed: live.length };
}

export function getNotificationHealth(store: Store) {
  ensureNotificationCollections(store);
  return {
    module: "notifications",
    increment: "I3-I3.2",
    status: "ok" as const,
    dismissals: store.notifDismissals.length,
    emailOutbox: (store.notifEmailOutbox ?? []).length,
    emailAdapter: resolveEmailAdapterName(),
    emailTemplates: (store.notifEmailTemplates ?? []).length,
  };
}
