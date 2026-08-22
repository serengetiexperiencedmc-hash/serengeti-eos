import { describe, expect, it } from "vitest";
import { newId } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "./app.js";
import { buildServer } from "./server.js";
import { ensureNotificationCollections } from "./notifications/collections.js";
import {
  bulkLiftEmailSuppressions,
  importEmailSuppressions,
} from "./notifications/email-suppression.js";
import { allPrincipals } from "./store.js";

const P = TEST_BOOTSTRAP_SECRETS;

describe("I3.13 suppression bulk lift and import", () => {
  it("imports rows and bulk-lifts by id", async () => {
    const store = seedStore("i313-bulk", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

    const imported = await importEmailSuppressions(
      store,
      carol,
      {
        csv: "email,reason\none@example.com,bounce\ntwo@example.com,manual\nbad,bounce",
      },
      { sesClient: null },
    );
    expect("imported" in imported && imported.imported).toBe(2);
    expect("skipped" in imported && imported.skipped).toBe(1);
    expect("increment" in imported && imported.increment).toBe("I3.20");

    const active = store.notifEmailSuppressions.filter((s) => !s.liftedAt);
    expect(active).toHaveLength(2);
    const ids = active.map((s) => s.id);

    const lifted = await bulkLiftEmailSuppressions(store, carol, { ids }, { sesClient: null });
    expect("lifted" in lifted && lifted.lifted).toBe(2);
    expect(store.notifEmailSuppressions.every((s) => Boolean(s.liftedAt))).toBe(true);
  });

  it("exposes bulk-lift and import HTTP routes", async () => {
    const store = seedStore("i313-http", TEST_BOOTSTRAP_SECRETS);
    ensureNotificationCollections(store);
    const carol = allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;
    const id = newId();
    store.notifEmailSuppressions.push({
      id,
      tenantId: carol.tenantId,
      email: "bulk@example.com",
      reason: "complaint",
      createdAt: new Date().toISOString(),
    });

    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "carol.admin@sedmc.local", password: P.carolPassword, tenantSlug: "sedmc" },
    });
    const token = login.json().accessToken as string;

    const bulk = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/suppressions/bulk-lift",
      headers: { authorization: `Bearer ${token}` },
      payload: { ids: [id] },
    });
    expect(bulk.statusCode).toBe(200);
    expect(bulk.json().lifted).toBe(1);

    const imported = await app.inject({
      method: "POST",
      url: "/v1/notifications/email/suppressions/import",
      headers: { authorization: `Bearer ${token}` },
      payload: { items: [{ email: "new@example.com", reason: "manual" }] },
    });
    expect(imported.statusCode).toBe(200);
    expect(imported.json().imported).toBe(1);
    expect(imported.json().increment).toBe("I3.20");

    const health = await app.inject({
      method: "GET",
      url: "/v1/notifications/email/health",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(health.json().increment).toBe("I3.20");
  });
});

