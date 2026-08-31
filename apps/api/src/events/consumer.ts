import type { EnterpriseEventEnvelope, EventTransport } from "@sedmc/kernel";
import type { Principal } from "@sedmc/kernel";
import { consumeEventIdempotent } from "../outbox.js";
import type { Store } from "../store.js";
import { getEventHandler } from "./handlers.js";

export const DEFAULT_EVENT_CONSUMER = "platform-observer";

export function resolveConsumerPrincipal(store: Store, tenantId: string): Principal | undefined {
  for (const p of store.principals.values()) {
    if (p.tenantId === tenantId && p.actorType === "Service" && p.displayName === "Platform Observer") {
      return p;
    }
  }
  for (const p of store.principals.values()) {
    if (p.tenantId === tenantId && p.permissions.includes("events:consume:outbox")) {
      return p;
    }
  }
  return undefined;
}

export function processEventEnvelope(
  store: Store,
  envelope: EnterpriseEventEnvelope,
  consumer: string = DEFAULT_EVENT_CONSUMER,
): { delivered: boolean; processed: boolean; reason?: string } {
  const principal = resolveConsumerPrincipal(store, envelope.tenantId);
  if (!principal) return { delivered: false, processed: false, reason: "consumer_principal_missing" };

  const handlerFn = getEventHandler(envelope.eventType);
  if (!handlerFn) return { delivered: false, processed: false, reason: "no_handler_registered" };

  const result = consumeEventIdempotent(store, principal, {
    event: envelope,
    consumer,
    handler: (event) => handlerFn(event, store),
  });

  if ("delivered" in result && result.delivered) {
    return {
      delivered: true,
      processed: result.processed,
      ...(result.reason !== undefined ? { reason: result.reason } : {}),
    };
  }
  return { delivered: false, processed: false, reason: result.reason };
}

export function wrapTransportWithConsumer(
  store: Store,
  inner: EventTransport,
  consumer: string = DEFAULT_EVENT_CONSUMER,
): EventTransport {
  return {
    kind: inner.kind,
    health: () => inner.health(),
    publish(envelope: EnterpriseEventEnvelope) {
      const result = inner.publish(envelope);
      const runConsumer = () => {
        processEventEnvelope(store, envelope, consumer);
      };
      if (result instanceof Promise) {
        void result.then(runConsumer);
        return result;
      }
      runConsumer();
    },
  };
}

export function drainInMemoryPublishedBus(
  store: Store,
  consumer: string = DEFAULT_EVENT_CONSUMER,
): { processed: number; skipped: number } {
  let processed = 0;
  let skipped = 0;
  while (store.publishedBus.length > 0) {
    const envelope = store.publishedBus.shift();
    if (!envelope) break;
    const result = processEventEnvelope(store, envelope, consumer);
    if (result.processed) processed += 1;
    else skipped += 1;
  }
  return { processed, skipped };
}
