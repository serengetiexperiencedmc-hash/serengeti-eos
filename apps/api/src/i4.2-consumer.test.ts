import { describe, expect, it } from "vitest";
import { createInMemoryDevTransport } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { wrapTransportWithConsumer } from "../src/events/consumer.js";
import { listRegisteredHandlerEventTypes } from "../src/events/handlers.js";
import { commitWithOutbox, publishPendingOutbox } from "../src/outbox.js";
import { allPrincipals } from "../src/store.js";

describe("I4.2 event consumers", () => {
  const carol = (store: ReturnType<typeof seedStore>) =>
    allPrincipals(store).find((p) => p.email === "carol.admin@sedmc.local")!;

  it("registers handlers for platform and CRM events", () => {
    const types = listRegisteredHandlerEventTypes();
    expect(types).toContain("platform.ping.v1");
    expect(types.some((t) => t.startsWith("crm."))).toBe(true);
  });

  it("processes events idempotently via wrapped in-memory transport", () => {
    const store = seedStore("i42-test", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = wrapTransportWithConsumer(
      store,
      createInMemoryDevTransport(store.publishedBus),
    );

    const committed = commitWithOutbox(store, carol(store), {
      eventType: "platform.ping.v1",
      payload: { ping: true },
      classification: "Internal",
      correlationId: "i42-consume",
      mutate: () => undefined,
    });
    expect(committed.ok).toBe(true);

    publishPendingOutbox(store);
    expect(store.processedEvents).toHaveLength(1);
    expect(store.processedEvents[0]?.consumer).toBe("platform-observer");

    publishPendingOutbox(store, { allowDuplicateRepublish: true });
    expect(store.processedEvents).toHaveLength(1);
  });
});
