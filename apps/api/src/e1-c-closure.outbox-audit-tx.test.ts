import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import { commitWithOutbox } from "../src/outbox.js";
import type { Store } from "../src/store.js";

function mockPool(failWhen: (sql: string) => boolean): { pool: NonNullable<Store["dbPool"]>; sql: string[] } {
  const sql: string[] = [];
  const query = async (text: string) => {
    sql.push(text);
    if (failWhen(text)) throw new Error("outbox_write_failed");
    return { rows: [], rowCount: 1 };
  };
  return {
    sql,
    pool: { query, connect: async () => ({ query, release() {} }) } as NonNullable<Store["dbPool"]>,
  };
}

describe("E1-C closure generic outbox+audit same transaction (Dev/Test)", () => {
  it("writes chained audit and outbox in one BEGIN/COMMIT when dbPool is set", async () => {
    const store = seedStore("e1c-closure-outbox-audit");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const { pool, sql } = mockPool(() => false);
    store.dbPool = pool;

    const ok = await commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "e1c-closure-audit",
      mutate: () => undefined,
    });

    expect(ok.ok).toBe(true);
    expect(sql.some((s) => s === "BEGIN")).toBe(true);
    expect(sql.some((s) => s === "COMMIT")).toBe(true);
    expect(sql.some((s) => s.includes("INSERT INTO audit_events"))).toBe(true);
    expect(sql.some((s) => s.includes("INSERT INTO outbox_events"))).toBe(true);
    expect(store.audit.some((a) => a.action === "events:outbox:write")).toBe(true);
  });

  it("rolls back audit and outbox together when outbox insert fails", async () => {
    const store = seedStore("e1c-closure-outbox-audit-fail");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const auditBefore = store.audit.length;
    const { pool, sql } = mockPool((text) => text.includes("INSERT INTO outbox_events"));
    store.dbPool = pool;

    const fail = await commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "e1c-closure-audit-fail",
      mutate: () => undefined,
    });

    expect(fail.ok).toBe(false);
    expect(sql.some((s) => s === "ROLLBACK")).toBe(true);
    expect(store.outboxEvents).toHaveLength(0);
    expect(store.audit.length).toBe(auditBefore);
  });
});
