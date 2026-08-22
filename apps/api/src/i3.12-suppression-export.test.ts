import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import { exportEmailSuppressions } from "./notifications/email-suppression.js";
import { listEmailDeliveryEvents } from "./notifications/ses-webhook.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.12 suppression export and delivery audit", () => {
  it("exports suppressions as json and csv", () => {
    const store = seedStore("i312-export", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailSuppressions.push(
      {
        id: newId(),
        tenantId: carol.tenantId,
        email: "a@example.com",
        reason: "bounce",
        createdAt: "2026-08-01T00:00:00.000Z",
      },
      {
        id: newId(),
        tenantId: carol.tenantId,
        email: "b@example.com",
        reason: "complaint",
        createdAt: "2026-08-02T00:00:00.000Z",
        liftedAt: "2026-08-03T00:00:00.000Z",
      },
    );

    const json = exportEmailSuppressions(store, carol, { format: "json" });
    expect("items" in json && json.count).toBe(1);
    expect("increment" in json && json.increment).toBe("I3.21");

    const withLifted = exportEmailSuppressions(store, carol, { format: "csv", includeLifted: true });
    expect("csv" in withLifted && withLifted.count).toBe(2);
    expect("csv" in withLifted && withLifted.csv).toContain("b@example.com");
  });

  it("filters delivery events and optionally returns payload", () => {
    const store = seedStore("i312-audit", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailDeliveryEvents.push(
      {
        id: newId(),
        tenantId: carol.tenantId,
        eventType: "bounce",
        recipientEmail: "x@example.com",
        receivedAt: "2026-08-10T12:00:00.000Z",
        payload: { notificationType: "Bounce" },
      },
      {
        id: newId(),
        tenantId: carol.tenantId,
        eventType: "delivery",
        recipientEmail: "y@example.com",
        receivedAt: "2026-08-11T12:00:00.000Z",
        payload: { notificationType: "Delivery" },
      },
    );

    const filtered = listEmailDeliveryEvents(store, carol.tenantId, { eventType: "bounce" });
    expect(filtered.items).toHaveLength(1);
    expect(filtered.increment).toBe("I3.12");
    expect(filtered.items[0]).not.toHaveProperty("payload");

    const withPayload = listEmailDeliveryEvents(store, carol.tenantId, {
      eventType: "bounce",
      includePayload: true,
    });
    expect(withPayload.items[0]).toHaveProperty("payload");
  });

  it("exposes export HTTP route and I3.12 health", async () => {
    const store = seedStore("i312-http", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    store.notifEmailSuppressions.push({
      id: newId(),
      tenantId: carol.tenantId,
      email: "export@example.com",
      reason: "reject",
      createdAt: new Date().toISOString(),
    });

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const exported = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/suppressions/export?format=json",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(exported.statusCode).toBe(200);
    expect(exported.json().increment).toBe("I3.21");
    expect(exported.json().count).toBe(1);

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.21");
  });
});

