import { describe, expect, it } from "vitest";
import { seedStore } from "../src/app.js";
import { commitWithOutbox, consumeEventIdempotent, publishPendingOutbox } from "../src/outbox.js";

describe("I4 event performance baseline (dev evidence)", () => {
  it("records publish/consume throughput samples", () => {
    const store = seedStore("test-secret");
    const carol = [...store.principals.values()].find((p) => p.email === "carol.admin@sedmc.local")!;

    const commitSamples: number[] = [];
    const n = 100;
    for (let i = 0; i < n; i++) {
      const t0 = performance.now();
      commitWithOutbox(store, carol, {
        eventType: "platform.ping.v1",
        payload: { ping: true, n: i },
        classification: "Internal",
        correlationId: `perf-${i}`,
        mutate: () => undefined,
      });
      commitSamples.push(performance.now() - t0);
    }

    const pubT0 = performance.now();
    const pub = publishPendingOutbox(store);
    const publishMs = performance.now() - pubT0;

    const consumeSamples: number[] = [];
    for (const evt of store.publishedBus) {
      const t0 = performance.now();
      consumeEventIdempotent(store, carol, {
        event: evt,
        consumer: "platform-observer",
        handler: () => undefined,
      });
      consumeSamples.push(performance.now() - t0);
    }

    const avgCommit = commitSamples.reduce((a, b) => a + b, 0) / n;
    const avgConsume = consumeSamples.reduce((a, b) => a + b, 0) / consumeSamples.length;
    expect(pub.published).toBe(n);
    expect(avgCommit).toBeLessThan(20);
    expect(publishMs).toBeLessThan(500);
    expect(avgConsume).toBeLessThan(5);
    expect(store.eventMetrics.eventsCommitted).toBe(n);
  });
});
