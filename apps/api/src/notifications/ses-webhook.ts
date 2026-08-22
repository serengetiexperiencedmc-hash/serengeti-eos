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
import { upsertEmailSuppression } from "./email-suppression.js";

type DeliveryEventType = NotifEmailDeliveryEvent["eventType"];
type OutboxStatus = NotifEmailOutboxEntry["status"];

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

function parseEventType(payload: Record<string, unknown>, snsType?: string): DeliveryEventType | undefined {
  const notificationType = typeof payload.notificationType === "string" ? payload.notificationType : snsType;
  const eventType = typeof payload.eventType === "string" ? payload.eventType : undefined;

  if (notificationType === "Bounce" || eventType === "bounce") return "bounce";
  if (notificationType === "Complaint" || eventType === "complaint") return "complaint";
  if (notificationType === "Delivery" || eventType === "delivery") return "delivery";
  if (notificationType === "Reject" || eventType === "reject") return "reject";
  if (notificationType === "Open" || eventType === "open") return "open";
  if (notificationType === "Click" || eventType === "click") return "click";
  return undefined;
}

function outboxStatusForEvent(eventType: DeliveryEventType): OutboxStatus | undefined {
  if (eventType === "bounce") return "bounced";
  if (eventType === "complaint") return "complained";
  if (eventType === "delivery") return "delivered";
  if (eventType === "reject") return "rejected";
  return undefined;
}

function findOutboxEntry(store: Store, sesMessageId?: string, recipient?: string): NotifEmailOutboxEntry | undefined {
  if (sesMessageId) {
    const bySes = store.notifEmailOutbox.find((e) => e.sesMessageId === sesMessageId);
    if (bySes) return bySes;
  }
  if (recipient) {
    return [...store.notifEmailOutbox]
      .filter((e) => e.to.toLowerCase() === recipient.toLowerCase() && (e.status === "sent" || e.status === "delivered"))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }
  return undefined;
}

async function applyDeliveryEvent(
  store: Store,
  input: {
    eventType: DeliveryEventType;
    sesMessageId?: string;
    recipient?: string;
    snsMessageId?: string;
    payload: Record<string, unknown>;
  },
): Promise<{ status: "updated" | "recorded_only"; outboxId?: string }> {
  ensureNotificationCollections(store);
  const outbox = findOutboxEntry(store, input.sesMessageId, input.recipient);
  const nextStatus = outboxStatusForEvent(input.eventType);

  if (outbox && nextStatus) {
    outbox.status = nextStatus;
    await updateNotifEmailOutboxStatus(store.dbPool, outbox.id, nextStatus);
    if (input.sesMessageId && !outbox.sesMessageId) {
      outbox.sesMessageId = input.sesMessageId;
      await updateNotifEmailOutboxBySesMessageId(store.dbPool, outbox.id, input.sesMessageId);
    }
  } else if (outbox && input.sesMessageId && !outbox.sesMessageId) {
    outbox.sesMessageId = input.sesMessageId;
    await updateNotifEmailOutboxBySesMessageId(store.dbPool, outbox.id, input.sesMessageId);
  }

  const delivery: NotifEmailDeliveryEvent = {
    id: newId(),
    ...(outbox ? { tenantId: outbox.tenantId, outboxId: outbox.id } : {}),
    eventType: input.eventType,
    ...(input.sesMessageId ? { sesMessageId: input.sesMessageId } : {}),
    ...(input.snsMessageId ? { snsMessageId: input.snsMessageId } : {}),
    ...(input.recipient ? { recipientEmail: input.recipient } : {}),
    receivedAt: new Date().toISOString(),
    payload: input.payload,
  };
  store.notifEmailDeliveryEvents.push(delivery);
  await persistNotifEmailDeliveryEvent(store.dbPool, delivery, input.payload);

  if (
    (input.eventType === "bounce" || input.eventType === "complaint" || input.eventType === "reject") &&
    (input.recipient || outbox?.to)
  ) {
    const email = input.recipient ?? outbox!.to;
    const tenantId = outbox?.tenantId;
    if (tenantId) {
      await upsertEmailSuppression(store, {
        tenantId,
        email,
        reason: input.eventType,
        sourceEventId: delivery.id,
      });
    }
  }

  return outbox && nextStatus ? { status: "updated", outboxId: outbox.id } : { status: "recorded_only", ...(outbox ? { outboxId: outbox.id } : {}) };
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

export function listEmailDeliveryEvents(
  store: Store,
  tenantId: string,
  options: {
    limit?: number;
    eventType?: string;
    from?: string;
    to?: string;
    includePayload?: boolean;
  } = {},
) {
  ensureNotificationCollections(store);
  const limit = options.limit && options.limit > 0 ? Math.min(options.limit, 500) : 50;
  let items = store.notifEmailDeliveryEvents.filter((e) => !e.tenantId || e.tenantId === tenantId);
  if (options.eventType) {
    items = items.filter((e) => e.eventType === options.eventType);
  }
  if (options.from) {
    items = items.filter((e) => e.receivedAt >= options.from!);
  }
  if (options.to) {
    items = items.filter((e) => e.receivedAt <= options.to!);
  }
  items = items.slice(-limit);
  return {
    items: items.map((e) => {
      const { payload, ...rest } = e;
      return options.includePayload ? e : rest;
    }),
    increment: "I3.12" as const,
  };
}
