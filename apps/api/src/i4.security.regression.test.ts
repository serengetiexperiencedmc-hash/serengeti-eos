import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import {
  commitWithOutbox,
  consumeEventIdempotent,
  executeReplayRequest,
  listDeadLetters,
  publishPendingOutbox,
  registerEventType,
  requestReplay,
} from "../src/outbox.js";
import { buildEnvelope } from "@sedmc/kernel";

describe("I4 event security regression", () => {
  const carol = (store: ReturnType<typeof seedStore>) =>
    [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;
  const alice = (store: ReturnType<typeof seedStore>) =>
    [...store.principals.values()].find((p) => p.email === "alice.finance@sedmc.local")!;

  it("rejects unauthorized publish, oversize payload, and sensitive fields", () => {
    const store = seedStore("test-secret");
    const c = carol(store);
    const a = alice(store);

    const unauth = commitWithOutbox(store, a, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "sec-1",
      mutate: () => undefined,
    });
    expect(unauth).toMatchObject({ ok: false });

    const pii = commitWithOutbox(store, c, {
      eventType: "platform.ping.v1",
      payload: { ping: true, email: "secret@example.com" },
      classification: "Internal",
      correlationId: "sec-2",
      mutate: () => undefined,
    });
    expect(pii).toMatchObject({ ok: false, reason: expect.stringContaining("forbidden_sensitive_field") });

    const huge = commitWithOutbox(store, c, {
      eventType: "platform.ping.v1",
      payload: { ping: true, blob: "x".repeat(5000) },
      classification: "Internal",
      correlationId: "sec-3",
      mutate: () => undefined,
    });
    expect(huge).toMatchObject({ ok: false, reason: "payload_too_large" });
  });

  it("rejects forged tenant and unauthorized consumer/DLQ/replay", () => {
    const store = seedStore("test-secret");
    const c = carol(store);
    const a = alice(store);

    commitWithOutbox(store, c, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "sec-4",
      mutate: () => undefined,
    });
    publishPendingOutbox(store);
    const forged = { ...store.publishedBus[0]!, tenantId: "forged-tenant" };
    expect(
      consumeEventIdempotent(store, c, {
        event: forged,
        consumer: "platform-observer",
        handler: () => undefined,
      }),
    ).toMatchObject({ delivered: false, reason: "tenant_isolation" });

    expect(listDeadLetters(store, a)).toMatchObject({ ok: false });

    commitWithOutbox(store, c, {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "sec-5",
      mutate: () => undefined,
    });
    const id = store.outboxEvents.at(-1)!.envelope.eventId;
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([id]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([id]) });
    publishPendingOutbox(store, { maxAttempts: 1, failEventIds: new Set([id]) });
    const dlqId = store.deadLetters.at(-1)!.id;

    expect(
      requestReplay(store, a, {
        reason: "nope",
        intent: "reexecute",
        deadLetterIds: [dlqId],
        correlationId: "sec-6",
      }),
    ).toMatchObject({ ok: false });

    expect(executeReplayRequest(store, a, "fake-id", "sec-7")).toMatchObject({ ok: false });
  });

  it("rejects unregistered event types and schema mismatch on consume", () => {
    const store = seedStore("test-secret");
    const c = carol(store);
    const bad = commitWithOutbox(store, c, {
      eventType: "crm.lead.created.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "sec-8",
      mutate: () => undefined,
    });
    expect(bad).toMatchObject({ ok: false, reason: "event_type_not_registered" });

    const malformed = buildEnvelope({
      eventType: "platform.ping.v1",
      tenantId: c.tenantId,
      producer: "x",
      correlationId: "sec-9",
      classification: "Internal",
      payload: {},
      schemaVersion: 99,
    });
    expect(
      consumeEventIdempotent(store, c, {
        event: malformed,
        consumer: "platform-observer",
        handler: () => undefined,
      }),
    ).toMatchObject({ delivered: false });
  });

  it("requires governed catalogue registration for new event types", () => {
    const store = seedStore("test-secret");
    const c = carol(store);
    const reg = registerEventType(store, c, {
      eventType: "platform.test.v1",
      owner: "platform",
      purpose: "security test",
      schemaVersion: 1,
      classification: "Internal",
      producer: "serengeti-eos-api",
      consumers: ["platform-observer"],
      retentionDays: 7,
      compatibility: "none",
      lifecycle: "active",
      requiredFields: [{ name: "token", type: "string" }],
      maxPayloadBytes: 1024,
      sensitiveDataPolicy: "reference_only",
    }, "sec-10");
    expect(reg.ok).toBe(true);
    const ok = commitWithOutbox(store, c, {
      eventType: "platform.test.v1",
      payload: { token: "ref-1" },
      classification: "Internal",
      correlationId: "sec-11",
      mutate: () => undefined,
    });
    expect(ok.ok).toBe(true);
  });
});
