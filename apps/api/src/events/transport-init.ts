import type { EventTransport } from "@sedmc/kernel";
import { createInMemoryDevTransport, createNatsJetStreamTransportStub } from "@sedmc/kernel";
import { isProductionLikeEnv } from "../devtest-token-secret.js";
import type { Logger } from "../observability.js";
import type { Store } from "../store.js";
import { createNatsJetStreamTransport, createNatsTransportFromEnv } from "./nats-transport.js";
import { redactUrlUserinfo } from "../production-dependency-contract.js";

export async function initEventTransport(
  store: Store,
  logger: Logger,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): Promise<void> {
  const requested = env.EOS_EVENT_TRANSPORT ?? "in-memory-dev";
  store.eventTransportKind = requested === "nats-jetstream" ? "nats-jetstream" : "in-memory-dev";

  if (isProductionLikeEnv(env)) {
    if (store.eventTransportKind !== "nats-jetstream") {
      throw new Error(
        "Production-like environment forbids in-memory-dev event transport; refusing silent Dev/Test substitution",
      );
    }
    const prodOpts = createNatsTransportFromEnv(env);
    if (!prodOpts) {
      throw new Error(
        "EOS_NATS_URL is required in Production-like environment; refusing NATS stub substitution",
      );
    }
    store.eventTransport = await createNatsJetStreamTransport(prodOpts);
    logger.info("event_transport_ready", {
      kind: "nats-jetstream",
      url: redactUrlUserinfo(prodOpts.url),
      stream: prodOpts.stream,
      productionReady: false,
    });
    return;
  }

  if (store.eventTransportKind !== "nats-jetstream") {
    store.eventTransport = createInMemoryDevTransport(store.publishedBus);
    logger.info("event_transport_ready", { kind: "in-memory-dev" });
    return;
  }

  const opts = createNatsTransportFromEnv(env);
  if (!opts) {
    store.eventTransport = createNatsJetStreamTransportStub();
    logger.warn("event_transport_nats_missing_url", { note: "Set EOS_NATS_URL to enable JetStream" });
    return;
  }

  try {
    store.eventTransport = await createNatsJetStreamTransport(opts);
    logger.info("event_transport_ready", { kind: "nats-jetstream", url: redactUrlUserinfo(opts.url), stream: opts.stream });
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
