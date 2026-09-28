import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import { commitWithOutbox } from "../src/outbox.js";
import type { Store } from "../src/store.js";

function mockPool(failWhen: (sql: string) => boolean): NonNullable<Store["dbPool"]> {
  const query = async (text: string) => {
    if (failWhen(text)) throw new Error("outbox_write_failed");
    return { rows: [], rowCount: 1 };
  };
  return { query, connect: async () => ({ query, release() {} }) } as NonNullable<Store["dbPool"]>;
}

describe("E1-C provider-neutral generic outbox fail-closed (Dev/Test)", () => {
  it("awaits durable outbox insert when dbPool is set", async () => {
    const store = seedStore("e1c-outbox");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    let inserts = 0;
    store.dbPool = mockPool((sql) => {
      if (sql.includes("INSERT INTO outbox_events")) inserts += 1;
      return false;
    });

    const ok = await commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "e1c-outbox-ok",
      mutate: () => {
        store.payments.set("e1c-p1", {
          id: "e1c-p1",
          tenantId: carol.tenantId,
          amount: 1,
          currency: "USD",
          beneficiary: "test",
          status: "pending_approval",
          createdBy: carol.id,
        });
      },
    });

    expect(ok.ok).toBe(true);
    expect(inserts).toBe(1);
    expect(store.payments.has("e1c-p1")).toBe(true);
    expect(store.outboxEvents).toHaveLength(1);
  });

  it("rolls back memory mutate when durable outbox insert fails", async () => {
    const store = seedStore("e1c-outbox-fail");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    store.dbPool = mockPool((sql) => sql.includes("INSERT INTO outbox_events"));

    const fail = await commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "e1c-outbox-fail",
      mutate: () => {
        store.payments.set("e1c-p2", {
          id: "e1c-p2",
          tenantId: carol.tenantId,
          amount: 2,
          currency: "USD",
          beneficiary: "test",
          status: "pending_approval",
          createdBy: carol.id,
        });
      },
    });

    expect(fail).toMatchObject({ ok: false, reason: "outbox_write_failed" });
    expect(store.payments.has("e1c-p2")).toBe(false);
    expect(store.outboxEvents).toHaveLength(0);
  });
});
