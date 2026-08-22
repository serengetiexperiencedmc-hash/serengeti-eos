import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { getEmailDeliveryAnalytics } from "./notifications/email-analytics.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.11 email delivery analytics", () => {
  it("aggregates delivery events, suppressions, and outbox", () => {
    const store = seedStore("i311-analytics", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    store.notifEmailDeliveryEvents.push(
      {
        id: newId(),
        tenantId: carol.tenantId,
        eventType: "bounce",
        recipientEmail: "a@example.com",
        receivedAt: new Date().toISOString(),
      },
      {
        id: newId(),
        tenantId: carol.tenantId,
        eventType: "delivery",
        recipientEmail: "b@example.com",
        receivedAt: new Date().toISOString(),
      },
      {
        id: newId(),
        tenantId: carol.tenantId,
        eventType: "bounce",
        recipientEmail: "c@example.com",
        receivedAt: new Date().toISOString(),
      },
    );
    store.notifEmailSuppressions.push(
      {
        id: newId(),
        tenantId: carol.tenantId,
        email: "a@example.com",
        reason: "bounce",
        createdAt: new Date().toISOString(),
      },
      {
        id: newId(),
        tenantId: carol.tenantId,
        email: "old@example.com",
        reason: "complaint",
        createdAt: new Date().toISOString(),
        liftedAt: new Date().toISOString(),
      },
    );
    store.notifEmailOutbox.push({
      id: newId(),
      tenantId: carol.tenantId,
      principalId: carol.id,
      notificationKey: "x",
      to: "a@example.com",
      subject: "Hi",
      bodyText: "Body",
      templateKey: "default",
      status: "bounced",
      adapter: "ses",
      createdAt: new Date().toISOString(),
    });

    const result = getEmailDeliveryAnalytics(store, carol, { windowHours: 24 });
    expect("analytics" in result).toBe(true);
    if (!("analytics" in result)) return;
    expect(result.increment).toBe("I3.11");
    expect(result.analytics.deliveryEventsByType.bounce).toBe(2);
    expect(result.analytics.deliveryEventsByType.delivery).toBe(1);
    expect(result.analytics.activeSuppressions).toBe(1);
    expect(result.analytics.liftedSuppressions).toBe(1);
    expect(result.analytics.suppressionsByReason.bounce).toBe(1);
    expect(result.analytics.outboxByStatus.bounced).toBe(1);
    expect(result.analytics.recentDeliveryEvents).toBe(3);
  });

  it("exposes analytics HTTP route and I3.11 health", async () => {
    const store = seedStore("i311-http", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailDeliveryEvents.push({
      id: newId(),
      tenantId: carol.tenantId,
      eventType: "complaint",
      recipientEmail: "x@example.com",
      receivedAt: new Date().toISOString(),
    });

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const analytics = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/analytics",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(analytics.statusCode).toBe(200);
    expect(analytics.json().increment).toBe("I3.11");
    expect(analytics.json().analytics.deliveryEventsByType.complaint).toBe(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.14");
  });
});
