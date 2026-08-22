import type { EnterpriseEventEnvelope } from "./events.js";

/** Dev/Test stand-in only — not production transport. */
export type EventTransportKind = "in-memory-dev" | "nats-jetstream";

export type EventTransport = {
  readonly kind: EventTransportKind;
  publish(envelope: EnterpriseEventEnvelope): void | Promise<void>;
  health(): { ok: boolean; detail: string };
};

/**
 * Development/Test transport stand-in.
 * NOT production event infrastructure — see ADR-0010.
 */
export function createInMemoryDevTransport(
  bus: EnterpriseEventEnvelope[],
  opts: { allowDuplicateRepublish?: boolean } = {},
): EventTransport {
  const published = new Set<string>();
  return {
    kind: "in-memory-dev",
    publish(envelope: EnterpriseEventEnvelope) {
      if (!opts.allowDuplicateRepublish && published.has(envelope.eventId)) {
        return;
      }
      bus.push({ ...envelope });
      published.add(envelope.eventId);
    },
    health() {
      return { ok: true, detail: "in-memory-dev-stand-in-not-production-transport" };
    },
  };
}

/** Placeholder — Production NATS is not configured in Dev/Test. */
export function createNatsJetStreamTransportStub(): EventTransport {
  return {
    kind: "nats-jetstream",
    publish() {
      throw new Error("nats_not_configured: Production transport requires ADR and infrastructure approval");
    },
    health() {
      return { ok: false, detail: "nats_not_configured" };
    },
  };
}
