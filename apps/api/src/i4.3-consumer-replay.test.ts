import { describe, expect, it } from "vitest";
import { createInMemoryDevTransport } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { buildServer } from "../src/server.js";
import { wrapTransportWithConsumer } from "../src/events/consumer.js";
import {
  commitWithOutbox,
  listConsumerProcessedEvents,
  publishPendingOutbox,
  replayEventsToConsumer,
} from "../src/outbox.js";
import { allPrincipals } from "../src/store.js";

describe("I4.3 consumer processed events + replay", () => {
  const carol = (store: ReturnType<typeof seedStore>) =>
    allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

  it("lists processed events for tenant", () => {
    const store = seedStore("i43-list", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = wrapTransportWithConsumer(
      store,
      createInMemoryDevTransport(store.publishedBus),
    );
    commitWithOutbox(store, carol(store), {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i43-list",
      mutate: () => undefined,
    });
    publishPendingOutbox(store);

    const listed = listConsumerProcessedEvents(store, carol(store), { consumer: "platform-observer" });
    expect(listed.ok).toBe(true);
    if (!listed.ok) return;
    expect(listed.items).toHaveLength(1);
  });

  it("replays events to consumer with force", () => {
    const store = seedStore("i43-replay", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = wrapTransportWithConsumer(
      store,
      createInMemoryDevTransport(store.publishedBus),
    );
    const committed = commitWithOutbox(store, carol(store), {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i43-replay",
      mutate: () => undefined,
    });
    expect(committed.ok).toBe(true);
    if (!committed.ok) return;
    publishPendingOutbox(store);
    const eventId = committed.outbox.envelope.eventId;

    const first = replayEventsToConsumer(store, carol(store), {
      consumer: "platform-observer",
      eventIds: [eventId],
      correlationId: "i43-replay-1",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.results[0]?.processed).toBe(false);
    expect(first.results[0]?.reason).toBe("already_processed");

    const forced = replayEventsToConsumer(store, carol(store), {
      consumer: "platform-observer",
      eventIds: [eventId],
      force: true,
      correlationId: "i43-replay-2",
    });
    expect(forced.ok).toBe(true);
    if (!forced.ok) return;
    expect(forced.results[0]?.processed).toBe(true);
  });

  it("exposes HTTP routes for processed list and replay", async () => {
    const store = seedStore("i43-http", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = wrapTransportWithConsumer(
      store,
      createInMemoryDevTransport(store.publishedBus),
    );
    const app = buildServer({ store });
    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "carol.admin@sedmc.local",
        password: TEST_BOOTSTRAP_SECRETS.carolPassword,
        tenantSlug: "sedmc",
      },
    });
    const token = login.json().accessToken as string;

    commitWithOutbox(store, carol(store), {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i43-http",
      mutate: () => undefined,
    });
    publishPendingOutbox(store);
    const eventId = store.outboxEvents[0]!.envelope.eventId;

    const listed = await app.inject({
      method: "GET",
      url: "/v1/events/consumers/processed?consumer=platform-observer",
      headers: { authorization: `Bearer ${token}` },
    });
    expect(listed.statusCode).toBe(200);
    expect(listed.json().increment).toBe("I4.3");
    expect(listed.json().items.length).toBeGreaterThan(0);

    const replay = await app.inject({
      method: "POST",
      url: "/v1/events/consumers/replay",
      headers: { authorization: `Bearer ${token}` },
      payload: { consumer: "platform-observer", eventIds: [eventId], force: true },
    });
    expect(replay.statusCode).toBe(200);
    expect(replay.json().increment).toBe("I4.3");
    expect(replay.json().results[0].processed).toBe(true);
  });
});
