import type { EventTransport } from "@sedmc/kernel";
import { createInMemoryDevTransport, createNatsJetStreamTransportStub } from "@sedmc/kernel";
import type { Logger } from "../observability.js";
import type { Store } from "../store.js";
import { createNatsJetStreamTransport, createNatsTransportFromEnv } from "./nats-transport.js";

export async function initEventTransport(store: Store, logger: Logger): Promise<void> {
  const requested = process.env.EOS_EVENT_TRANSPORT ?? "in-memory-dev";
  store.eventTransportKind = requested === "nats-jetstream" ? "nats-jetstream" : "in-memory-dev";

  if (store.eventTransportKind !== "nats-jetstream") {
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    logger.info("event_transport_ready", { kind: "in-memory-dev" });
    return;
  }

  const opts = createNatsTransportFromEnv();
  if (!opts) {
    store.eventTransport = createNatsJetStreamTransportStub();
    logger.warn("event_transport_nats_missing_url", { note: "Set EOS_NATS_URL to enable JetStream" });
    return;
  }

  try {
    store.eventTransport = await createNatsJetStreamTransport(opts);
    logger.info("event_transport_ready", { kind: "nats-jetstream", url: opts.url, stream: opts.stream });
  } catch (err) {
    store.eventTransport = createNatsJetStreamTransportStub();
    logger.error("event_transport_nats_connect_failed", {
      err: err instanceof Error ? err.message : "unknown",
    });
  }
}

export function resolveEventTransport(store: Store, opts?: { allowDuplicateRepublish?: boolean }): EventTransport {
  if (store.eventTransport) return store.eventTransport;
  if (store.eventTransportKind === "nats-jetstream") {
    return createNatsJetStreamTransportStub();
  }
  const transportOpts =
    opts?.allowDuplicateRepublish !== undefined ? { allowDuplicateRepublish: opts.allowDuplicateRepublish } : {};
  return createInMemoryDevTransport(store.publishedBus, transportOpts);
}
