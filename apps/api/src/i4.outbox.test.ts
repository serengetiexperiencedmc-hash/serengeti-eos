import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import {
  commitWithOutbox,
  consumeEventIdempotent,
  executeReplayRequest,
  getEventInfrastructureHealth,
  getEventOperationsView,
  getOrderedPublishedEvents,
  publishPendingOutbox,
  registerEventType,
  replayDeadLetter,
  requestReplay,
} from "../src/outbox.js";

describe("I4 transactional outbox", () => {
  it("commits domain + outbox together; rolls back both on mutate failure", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;

    const ok = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "corr-1",
      mutate: () => {
        store.payments.set("p1", {
          id: "p1",
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
    expect(store.payments.has("p1")).toBe(true);
    expect(store.outboxEvents).toHaveLength(1);
    expect(store.outboxEvents[0]!.status).toBe("pending");

    const fail = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: false },
      classification: "Internal",
      correlationId: "corr-2",
      mutate: () => {
        throw new Error("domain_failed");
      },
    });
    expect(fail).toMatchObject({ ok: false, reason: "domain_failed" });
    expect(store.outboxEvents).toHaveLength(1);
  });

  it("rolls back domain when outbox write fails", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const fail = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "corr-2b",
      simulateOutboxWriteFailure: true,
      mutate: () => {
        store.payments.set("p2", {
          id: "p2",
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
    expect(store.payments.has("p2")).toBe(false);
    expect(store.outboxEvents).toHaveLength(0);
  });

  it("publisher failure leaves event pending then dead-letters; replay restores pending", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const committed = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true, n: 1 },
      classification: "Internal",
      correlationId: "corr-3",
      mutate: () => undefined,
    });
    if (!committed.ok) throw new Error("commit failed");
    const eventId = committed.envelope.eventId;

    publishPendingOutbox(store, { maxAttempts: 3, failEventIds: new Set([eventId]) });
    expect(store.outboxEvents[0]!.status).toBe("pending");
    publishPendingOutbox(store, { maxAttempts: 3, failEventIds: new Set([eventId]) });
    publishPendingOutbox(store, { maxAttempts: 3, failEventIds: new Set([eventId]) });
    expect(store.outboxEvents[0]!.status).toBe("dead_letter");
    expect(store.deadLetters).toHaveLength(1);
    expect(store.deadLetters[0]!.status).toBe("failed");

    const replayed = replayDeadLetter(store, carol, store.deadLetters[0]!.id, "corr-4", "reexecute", "test replay");
    expect(replayed.ok).toBe(true);
    expect(store.outboxEvents[0]!.status).toBe("pending");

    const pub = publishPendingOutbox(store);
    expect(pub.published).toBe(1);
    expect(store.publishedBus).toHaveLength(1);
    expect(store.outboxEvents[0]!.status).toBe("published");
  });

  it("distinguishes delivered vs processed; duplicate delivery is idempotent", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const committed = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true, n: 2 },
      classification: "Internal",
      correlationId: "corr-5",
      mutate: () => undefined,
    });
    if (!committed.ok) throw new Error("commit failed");
    publishPendingOutbox(store);
    const event = store.publishedBus[0]!;

    let runs = 0;
    const first = consumeEventIdempotent(store, carol, {
      event,
      consumer: "platform-observer",
      handler: () => {
        runs += 1;
      },
    });
    const second = consumeEventIdempotent(store, carol, {
      event,
      consumer: "platform-observer",
      handler: () => {
        runs += 1;
      },
    });
    expect(first).toMatchObject({ delivered: true, processed: true });
    expect(second).toMatchObject({ delivered: true, processed: false, reason: "already_processed" });
    expect(runs).toBe(1);
  });

  it("enforces tenant isolation and unauthorized consumers", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    registerEventType(store, carol, {
      eventType: "platform.secure.v1",
      owner: "platform",
      purpose: "restricted consumer list",
      schemaVersion: 1,
      classification: "Confidential",
      producer: "serengeti-eos-api",
      consumers: ["allowed-worker"],
      retentionDays: 7,
      compatibility: "backward",
      lifecycle: "active",
      requiredFields: [{ name: "ref", type: "string" }],
      forbiddenPayloadKeys: ["email"],
      maxPayloadBytes: 4096,
      sensitiveDataPolicy: "reference_only",
    }, "reg-1");
    const committed = commitWithOutbox(store, carol, {
      eventType: "platform.secure.v1",
      payload: { ref: "x" },
      classification: "Confidential",
      correlationId: "corr-6",
      mutate: () => undefined,
    });
    if (!committed.ok) throw new Error("commit failed");
    publishPendingOutbox(store);
    const event = { ...store.publishedBus[0]! };

    const badConsumer = consumeEventIdempotent(store, carol, {
      event,
      consumer: "not-allowed",
      handler: () => undefined,
    });
    expect(badConsumer).toMatchObject({ delivered: false, reason: "consumer_not_authorized" });

    event.tenantId = "other-tenant";
    const crossTenant = consumeEventIdempotent(store, carol, {
      event,
      consumer: "allowed-worker",
      handler: () => undefined,
    });
    expect(crossTenant).toMatchObject({ delivered: false, reason: "tenant_isolation" });
  });

  it("blocks simulation from publishing outbox events", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
    const blocked = commitWithOutbox(
      store,
      carol,
      {
        eventType: "platform.ping.v1",
        payload: { ping: true },
        classification: "Internal",
        correlationId: "corr-7",
        mutate: () => undefined,
      },
      "SIMULATION",
    );
    expect(blocked).toMatchObject({ ok: false, reason: "simulation_cannot_publish" });
    expect(store.outboxEvents).toHaveLength(0);
  });
});
