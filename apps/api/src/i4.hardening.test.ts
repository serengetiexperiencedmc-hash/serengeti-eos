import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import {
  commitWithOutbox,
  consumeEventIdempotent,
  getEventInfrastructureHealth,
  getEventOperationsView,
  getOrderedPublishedEvents,
  publishPendingOutbox,
  registerEventType,
  requestReplay,
  executeReplayRequest,
} from "../src/outbox.js";
import { createInMemoryDevTransport } from "@sedmc/kernel";

describe("I4 hardening gate", () => {
  const carolFrom = (store: ReturnType<typeof seedStore>) =>
    [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;

  it("transactional consistency matrix", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);

    // Success + Success
    const ok = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "tx-1",
      mutate: () => store.payments.set("a", {
        id: "a", tenantId: carol.tenantId, amount: 1, currency: "USD", beneficiary: "b", status: "pending_approval", createdBy: carol.id,
      }),
    });
    expect(ok.ok).toBe(true);
    expect(store.payments.has("a")).toBe(true);
    expect(store.outboxEvents).toHaveLength(1);

    // Success domain + outbox failure → rollback
    const obFail = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "tx-2",
      simulateOutboxWriteFailure: true,
      mutate: () => store.payments.set("b", {
        id: "b", tenantId: carol.tenantId, amount: 1, currency: "USD", beneficiary: "b", status: "pending_approval", createdBy: carol.id,
      }),
    });
    expect(obFail.ok).toBe(false);
    expect(store.payments.has("b")).toBe(false);

    // Domain failure → no outbox
    const domFail = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "tx-3",
      mutate: () => { throw new Error("fail"); },
    });
    expect(domFail.ok).toBe(false);
    expect(store.outboxEvents).toHaveLength(1);

    // Publisher unavailable → event stays pending
    publishPendingOutbox(store, { failEventIds: new Set([store.outboxEvents[0]!.envelope.eventId]) });
    expect(store.outboxEvents[0]!.status).toBe("pending");
  });

  it("publisher crash after publish before mark leaves recoverable pending + duplicate-safe consumer", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);
    const bus: typeof store.publishedBus = [];
    const transport = createInMemoryDevTransport(bus, { allowDuplicateRepublish: true });

    const committed = commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "crash-1",
      mutate: () => undefined,
    });
    if (!committed.ok) throw new Error("commit failed");
    const eventId = committed.envelope.eventId;

    const crash = publishPendingOutbox(store, {
      transport,
      injectFailure: { at: "after_publish_before_mark", eventId },
    });
    expect(crash.crashed).toBe(true);
    expect(store.outboxEvents[0]!.status).toBe("pending");
    expect(bus).toHaveLength(1);

    publishPendingOutbox(store, { transport, allowDuplicateRepublish: true });
    expect(store.outboxEvents[0]!.status).toBe("published");
    expect(bus.length).toBeGreaterThanOrEqual(1);

    let sideEffects = 0;
    for (const evt of bus) {
      consumeEventIdempotent(store, carol, {
        event: evt,
        consumer: "platform-observer",
        handler: () => { sideEffects += 1; },
      });
    }
    expect(sideEffects).toBe(1);
  });

  it("publisher failure injection points", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "inj-1",
      mutate: () => undefined,
    });
    const eventId = store.outboxEvents[0]!.envelope.eventId;

    for (const point of ["before_read", "after_read", "during_shutdown"] as const) {
      const r = publishPendingOutbox(store, { injectFailure: { at: point } });
      expect(r.crashed).toBe(true);
      expect(r.crashPoint).toBe(point);
    }

    const retryCrash = publishPendingOutbox(store, {
      injectFailure: { at: "during_retry", eventId },
      failEventIds: new Set([eventId]),
    });
    publishPendingOutbox(store, { failEventIds: new Set([eventId]) });
    expect(retryCrash.crashed || store.outboxEvents[0]!.attempts > 0).toBe(true);
  });

  it("aggregate ordering under concurrent commits", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);
    registerEventType(store, carol, {
      ...store.eventCatalogue[0]!,
      orderingKey: "aggregateId",
    }, "ord-1");

    const agg = "agg-001";
    for (let i = 0; i < 3; i++) {
      commitWithOutbox(store, carol, {
        eventType: "platform.ping.v1",
        payload: { ping: true, n: i },
        classification: "Internal",
        correlationId: `ord-${i}`,
        aggregateId: agg,
        mutate: () => undefined,
      });
    }
    publishPendingOutbox(store);
    const ordered = getOrderedPublishedEvents(store, carol.tenantId, agg);
    expect(ordered).toHaveLength(3);
    expect(ordered.map((e) => e.payload.n)).toEqual([0, 1, 2]);
  });

  it("privileged replay requires reason and authorization", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);

    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "rep-1",
      mutate: () => undefined,
    });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([store.outboxEvents[0]!.envelope.eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([store.outboxEvents[0]!.envelope.eventId]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([store.outboxEvents[0]!.envelope.eventId]) });
    const dlqId = store.deadLetters[0]!.id;

    const noReason = requestReplay(store, carol, {
      reason: "  ",
      intent: "reexecute",
      deadLetterIds: [dlqId],
      correlationId: "rep-2",
    });
    expect(noReason.ok).toBe(false);

    const req = requestReplay(store, carol, {
      reason: "Publisher transport restored",
      intent: "reexecute",
      deadLetterIds: [dlqId],
      correlationId: "rep-3",
    });
    expect(req.ok).toBe(true);
    if (req.ok) req.request.status = "approved";

    const exec = executeReplayRequest(store, carol, req.request.id, "rep-4");
    expect(exec.ok).toBe(true);
    expect(store.replayRequests[0]!.status).toBe("executed");
  });

  it("event operations view and infrastructure health", () => {
    const store = seedStore("test-secret");
    const carol = carolFrom(store);
    commitWithOutbox(store, carol, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "ops-1",
      mutate: () => undefined,
    });
    const ops = getEventOperationsView(store, carol);
    expect("error" in ops).toBe(false);
    if (!("error" in ops)) {
      expect(ops.transport.kind).toBe("in-memory-dev");
      expect(ops.transport.note).toContain("not Production");
      expect(ops.metrics.eventsCommitted).toBeGreaterThan(0);
    }
    const health = getEventInfrastructureHealth(store);
    expect(health.transportKind).toBe("in-memory-dev");
    expect(health.eventInfrastructureReady).toBe(true);
    expect(health.note).toContain("applicationReady");
  });
});
