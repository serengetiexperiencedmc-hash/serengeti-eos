import { checkDatabaseHealth, createPool, migrate } from "@sedmc/db";
import { afterAll, describe, expect, it } from "vitest";
import { buildEmailFromNotification } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { createDevOutboxEmailAdapter } from "../src/notifications/email.js";
import { dismissNotification } from "../src/notifications/notifications.js";
import {
  countNotifDismissals,
  countNotifEmailOutbox,
} from "../src/persistence/pg-repository.js";
import { syncStoreToPostgres } from "../src/persistence/sync.js";
import { allPrincipals } from "../src/store.js";

const url = process.env.EOS_DATABASE_URL;
const enabled = process.env.EOS_RUN_PG_TESTS === "1" && Boolean(url);
const describePg = enabled ? describe : describe.skip;

describePg("PG.1 I3 notification dual-write", () => {
  const pool = createPool(url!);
  const tenantId = "11111111-1111-4111-8111-111111111111";
  const carolId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

  afterAll(async () => {
    await pool.end();
  });

  it("persists dismissals and email outbox when dbPool is set", async () => {
    await migrate(pool);
    expect((await checkDatabaseHealth(pool)).ok).toBe(true);

    const store = seedStore("pg-i3-secret", TEST_BOOTSTRAP_SECRETS);
    store.dbPool = pool;
    await syncStoreToPostgres(pool, store);

    const beforeDismiss = await countNotifDismissals(pool, tenantId);
    const beforeOutbox = await countNotifEmailOutbox(pool, tenantId);

    const principal = allPrincipals(store).find((p) => p.id === carolId)!;

    await dismissNotification(store, principal, "test-key:pg-1");
    expect(store.notifDismissals.length).toBeGreaterThan(0);

    const adapter = createDevOutboxEmailAdapter(store, principal);
    const message = buildEmailFromNotification(
      {
        key: "test:pg-outbox",
        category: "rfp",
        severity: "urgent",
        title: "PG test",
        body: "Body",
        href: "/x",
        createdAt: new Date().toISOString(),
      },
      "carol.admin@sedmc.local",
    );
    await adapter.send(message);

    const afterDismiss = await countNotifDismissals(pool, tenantId);
    const afterOutbox = await countNotifEmailOutbox(pool, tenantId);
    expect(afterDismiss).toBeGreaterThan(beforeDismiss);
    expect(afterOutbox).toBeGreaterThan(beforeOutbox);
  });
});
