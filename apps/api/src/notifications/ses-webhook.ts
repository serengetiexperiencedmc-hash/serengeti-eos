import { newId, type NotifEmailDeliveryEvent, type NotifEmailOutboxEntry } from "@sedmc/kernel";
import type { Store } from "../store.js";
import { ensureNotificationCollections } from "./collections.js";
import {
  insertNotifEmailDeliveryEvent,
  updateNotifEmailOutboxBySesMessageId,
  updateNotifEmailOutboxStatus,
} from "../persistence/pg-repository.js";
import { persistNotifEmailDeliveryEvent } from "../persistence/notifications.js";
import { isSnsSignatureVerificationEnabled, verifySnsMessage } from "./sns-signature.js";
import { confirmSnsSubscription } from "./sns-subscription.js";

function webhookSecretOk(provided?: string): boolean {
  const expected = process.env.EOS_SES_WEBHOOK_SECRET;
  if (!expected) return true;
  return provided === expected;
}

function parseSesMessageId(payload: Record<string, unknown>): string | undefined {
  const mail = payload.mail as { messageId?: string } | undefined;
  if (mail?.messageId) return mail.messageId;
  return typeof payload.sesMessageId === "string" ? payload.sesMessageId : undefined;
}

function parseRecipient(payload: Record<string, unknown>): string | undefined {
  const mail = payload.mail as { destination?: string[] } | undefined;
  if (mail?.destination?.[0]) return mail.destination[0];
  return typeof payload.recipientEmail === "string" ? payload.recipientEmail : undefined;
}

function parseEventType(payload: Record<string, unknown>, snsType?: string): "bounce" | "complaint" | undefined {
  const notificationType = typeof payload.notificationType === "string" ? payload.notificationType : snsType;
  if (notificationType === "Bounce") return "bounce";
  if (notificationType === "Complaint") return "complaint";
  if (payload.eventType === "bounce") return "bounce";
  if (payload.eventType === "complaint") return "complaint";
  return undefined;
}

function findOutboxEntry(store: Store, sesMessageId?: string, recipient?: string): NotifEmailOutboxEntry | undefined {
  if (sesMessageId) {
    const bySes = store.notifEmailOutbox.find((e) => e.sesMessageId === sesMessageId);
    if (bySes) return bySes;
  }
  if (recipient) {
    return [...store.notifEmailOutbox]
      .filter((e) => e.to.toLowerCase() === recipient.toLowerCase() && e.status === "sent")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }
  return undefined;
}

async function applyDeliveryEvent(
  store: Store,
  input: {
    eventType: "bounce" | "complaint";
    sesMessageId?: string;
    recipient?: string;
    snsMessageId?: string;
    payload: Record<string, unknown>;
  },
): Promise<{ status: "updated" | "recorded_only"; outboxId?: string }> {
  ensureNotificationCollections(store);
  const outbox = findOutboxEntry(store, input.sesMessageId, input.recipient);
  const status = input.eventType === "bounce" ? "bounced" : "complained";

  if (outbox) {
    outbox.status = status;
    await updateNotifEmailOutboxStatus(store.dbPool, outbox.id, status);
    if (input.sesMessageId && !outbox.sesMessageId) {
      outbox.sesMessageId = input.sesMessageId;
      await updateNotifEmailOutboxBySesMessageId(store.dbPool, outbox.id, input.sesMessageId);
    }
  }

  const delivery: NotifEmailDeliveryEvent = {
    id: newId(),
    ...(outbox ? { tenantId: outbox.tenantId, outboxId: outbox.id } : {}),
    eventType: input.eventType,
    ...(input.sesMessageId ? { sesMessageId: input.sesMessageId } : {}),
    ...(input.snsMessageId ? { snsMessageId: input.snsMessageId } : {}),
    ...(input.recipient ? { recipientEmail: input.recipient } : {}),
    receivedAt: new Date().toISOString(),
  };
  store.notifEmailDeliveryEvents.push(delivery);
  await persistNotifEmailDeliveryEvent(store.dbPool, delivery, input.payload);

  return outbox ? { status: "updated", outboxId: outbox.id } : { status: "recorded_only" };
}

export async function handleSesDeliveryWebhook(
  store: Store,
  input: { secret?: string; body: unknown },
):
  | { ok: true; result: string; outboxId?: string }
  | { ok: false; reason: string } {
  if (!webhookSecretOk(input.secret)) return { ok: false, reason: "webhook_unauthorized" };

  const body = input.body as Record<string, unknown>;
  const snsVerified = await verifySnsMessage(body);
  if (!snsVerified.ok) return { ok: false, reason: snsVerified.reason };

  if (body.Type === "SubscriptionConfirmation") {
    const confirmed = await confirmSnsSubscription(body);
    if (!confirmed.ok) return { ok: false, reason: confirmed.reason };
    return { ok: true, result: confirmed.result };
  }

  let payload = body;
  let snsMessageId = typeof body.MessageId === "string" ? body.MessageId : undefined;
  if (body.Type === "Notification" && typeof body.Message === "string") {
    try {
      payload = JSON.parse(body.Message) as Record<string, unknown>;
    } catch {
      return { ok: false, reason: "invalid_sns_message" };
    }
  }

  const eventType = parseEventType(payload, typeof body.Type === "string" ? body.Type : undefined);
  if (!eventType) return { ok: false, reason: "unsupported_event_type" };

  const sesMessageId = parseSesMessageId(payload);
  const recipient = parseRecipient(payload);
  const applied = await applyDeliveryEvent(store, {
    eventType,
    ...(sesMessageId ? { sesMessageId } : {}),
    ...(recipient ? { recipient } : {}),
    ...(snsMessageId ? { snsMessageId } : {}),
    payload,
  });

  return {
    ok: true,
    result: applied.status,
    ...(applied.outboxId ? { outboxId: applied.outboxId } : {}),
  };
}

export function listEmailDeliveryEvents(store: Store, tenantId: string, limit = 50) {
  ensureNotificationCollections(store);
  const items = store.notifEmailDeliveryEvents
    .filter((e) => !e.tenantId || e.tenantId === tenantId)
    .slice(-limit);
  return { items };
}
