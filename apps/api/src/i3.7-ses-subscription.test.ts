import { describe, expect, it, vi } from "vitest";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { confirmSnsSubscription, isSnsAutoConfirmEnabled } from "./notifications/sns-subscription.js";
import { handleSesDeliveryWebhook } from "./notifications/ses-webhook.js";

describe("I3.7 SNS subscription auto-confirm", () => {
  it("is enabled by default", () => {
    const prev = process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION;
    delete process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION;
    expect(isSnsAutoConfirmEnabled()).toBe(true);
    process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION = "0";
    expect(isSnsAutoConfirmEnabled()).toBe(false);
    if (prev === undefined) delete process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION;
    else process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION = prev;
  });

  it("fetches SubscribeURL for SubscriptionConfirmation", async () => {
    const fetchFn = vi.fn(async () => ({ ok: true }) as Response);
    const result = await confirmSnsSubscription(
      {
        Type: "SubscriptionConfirmation",
        SubscribeURL: "https://sns.eu-west-1.amazonaws.com/?Action=ConfirmSubscription",
      },
      { fetchFn },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.result).toBe("subscription_confirmed");
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it("rejects non-AWS SubscribeURL", async () => {
    const fetchFn = vi.fn(async () => ({ ok: true }) as Response);
    const result = await confirmSnsSubscription(
      {
        Type: "SubscriptionConfirmation",
        SubscribeURL: "https://evil.example.com/confirm",
      },
      { fetchFn },
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("invalid_subscribe_url");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("acknowledges when auto-confirm disabled", async () => {
    const prev = process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION;
    process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION = "0";
    try {
      const fetchFn = vi.fn(async () => ({ ok: true }) as Response);
      const result = await confirmSnsSubscription(
        {
          Type: "SubscriptionConfirmation",
          SubscribeURL: "https://sns.eu-west-1.amazonaws.com/?Action=ConfirmSubscription",
        },
        { fetchFn },
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.result).toBe("subscription_acknowledged");
      expect(fetchFn).not.toHaveBeenCalled();
    } finally {
      if (prev === undefined) delete process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION;
      else process.env.EOS_SES_AUTO_CONFIRM_SUBSCRIPTION = prev;
    }
  });

  it("handles webhook SubscriptionConfirmation via HTTP", async () => {
    const prevSecret = process.env.EOS_SES_WEBHOOK_SECRET;
    process.env.EOS_SES_WEBHOOK_SECRET = "test-webhook-secret";
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);
    try {
      const store = seedStore("i37-http", TEST_BOOTSTRAP_SECRETS);
      const app = buildServer({ store });

      const webhook = await app.inject({
        method: "POST",
        url: "/v1/notifications/email/ses-webhook",
        headers: { "x-eos-webhook-secret": "test-webhook-secret" },
        payload: {
          Type: "SubscriptionConfirmation",
          SubscribeURL: "https://sns.eu-west-1.amazonaws.com/?Action=ConfirmSubscription",
        },
      });
      expect(webhook.statusCode).toBe(200);
      expect(webhook.json().result).toBe("subscription_confirmed");
    } finally {
      fetchSpy.mockRestore();
      if (prevSecret === undefined) delete process.env.EOS_SES_WEBHOOK_SECRET;
      else process.env.EOS_SES_WEBHOOK_SECRET = prevSecret;
    }
  });

  it("handleSesDeliveryWebhook returns subscription_confirmed", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);
    try {
      const store = seedStore("i37-handler", TEST_BOOTSTRAP_SECRETS);
      const result = await handleSesDeliveryWebhook(store, {
        body: {
          Type: "SubscriptionConfirmation",
          SubscribeURL: "https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription",
        },
      });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.result).toBe("subscription_confirmed");
    } finally {
      fetchSpy.mockRestore();
    }
  });
});
