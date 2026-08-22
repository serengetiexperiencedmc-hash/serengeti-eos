import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { handleSesDeliveryWebhook } from "./notifications/ses-webhook.js";
import { parseSesConfigFromEnv } from "@sedmc/kernel";

describe("I3.8 SES configuration-set event routing", () => {
  it("parses configuration set from env", () => {
    const prev = process.env.EOS_SES_CONFIGURATION_SET;
    const prevRegion = process.env.EOS_SES_REGION;
    process.env.EOS_SES_REGION = "eu-west-1";
    process.env.EOS_SES_CONFIGURATION_SET = "eos-email-events";
    try {
      const cfg = parseSesConfigFromEnv();
      expect(cfg?.configurationSet).toBe("eos-email-events");
    } finally {
      if (prev === undefined) delete process.env.EOS_SES_CONFIGURATION_SET;
      else process.env.EOS_SES_CONFIGURATION_SET = prev;
      if (prevRegion === undefined) delete process.env.EOS_SES_REGION;
      else process.env.EOS_SES_REGION = prevRegion;
    }
  });

  it("records Delivery and updates outbox to delivered", async () => {
    const store = seedStore("i38-delivery", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const sesMessageId = "ses-msg-delivery-1";
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      notificationKey: "test.delivery",
      to: "guest@example.com",
      subject: "Test",
      bodyText: "Hello",
      templateKey: "default",
      status: "sent",
      adapter: "ses",
      sesMessageId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const result = await handleSesDeliveryWebhook(store, {
      body: {
        Type: "Notification",
        MessageId: "sns-delivery-1",
        Message: JSON.stringify({
          notificationType: "Delivery",
          mail: { messageId: sesMessageId, destination: ["guest@example.com"] },
        }),
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result).toBe("updated");
    expect(store.notifEmailOutbox[0]!.status).toBe("delivered");
    expect(store.notifEmailDeliveryEvents[0]!.eventType).toBe("delivery");
  });

  it("records Open without changing outbox status", async () => {
    const store = seedStore("i38-open", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const sesMessageId = "ses-msg-open-1";
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      notificationKey: "test.open",
      to: "guest@example.com",
      subject: "Test",
      bodyText: "Hello",
      templateKey: "default",
      status: "delivered",
      adapter: "ses",
      sesMessageId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const result = await handleSesDeliveryWebhook(store, {
      body: {
        notificationType: "Open",
        mail: { messageId: sesMessageId, destination: ["guest@example.com"] },
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result).toBe("recorded_only");
    expect(store.notifEmailOutbox[0]!.status).toBe("delivered");
    expect(store.notifEmailDeliveryEvents[0]!.eventType).toBe("open");
  });

  it("marks Reject as rejected", async () => {
    const store = seedStore("i38-reject", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const sesMessageId = "ses-msg-reject-1";
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: "11111111-1111-4111-8111-111111111111",
      principalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      notificationKey: "test.reject",
      to: "bad@example.com",
      subject: "Test",
      bodyText: "Hello",
      templateKey: "default",
      status: "sent",
      adapter: "ses",
      sesMessageId,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const result = await handleSesDeliveryWebhook(store, {
      body: {
        notificationType: "Reject",
        mail: { messageId: sesMessageId },
      },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(store.notifEmailOutbox[0]!.status).toBe("rejected");
    expect(store.notifEmailDeliveryEvents[0]!.eventType).toBe("reject");
  });
});
