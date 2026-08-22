import { describe, expect, it } from "vitest";
import { createInMemoryDevTransport } from "@sedmc/kernel";
import { seedStore, TEST_BOOTSTRAP_SECRETS } from "../src/app.js";
import { resolveEventTransport } from "../src/events/transport-init.js";

describe("I4 NATS transport selection", () => {
  it("defaults to in-memory dev transport", () => {
    const store = seedStore("i4-test", TEST_BOOTSTRAP_SECRETS);
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    const transport = resolveEventTransport(store);
    expect(transport.kind).toBe("in-memory-dev");
    expect(transport.health().ok).toBe(true);
  });

  it("falls back to stub when nats-jetstream requested without connection", () => {
    const store = seedStore("i4-test", TEST_BOOTSTRAP_SECRETS);
    store.eventTransportKind = "nats-jetstream";
    const transport = resolveEventTransport(store);
    expect(transport.kind).toBe("nats-jetstream");
    expect(transport.health().ok).toBe(false);
  });
});
