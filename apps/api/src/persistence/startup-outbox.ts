import { isProductionLikeEnv } from "../devtest-token-secret.js";
import type { Store } from "../store.js";

export type StartupOutboxDrainDecision =
  | { apply: true; transportKind: "in-memory-dev" | "nats-jetstream" }
  | {
      apply: false;
      reason:
        | "event_transport_not_initialized"
        | "production_like_transport_not_ready"
        | "production_like_in_memory_forbidden"
        | "production_like_transport_unhealthy"
        | "devtest_nats_stub_or_unhealthy";
    };

/**
 * H-188: I4 recovery drains pending outbox on startup (ADR-0010 / ADR-0017 PG.2).
 * Production/UAT may drain only through an initialized, healthy NATS transport.
 * They must not mark outbox rows published against the in-memory or stub stand-in.
 * Dev/Test may drain the in-memory stand-in after transport init.
 */
export function shouldDrainOutboxOnStartup(
  store: Pick<Store, "eventTransport" | "eventTransportKind">,
  env: NodeJS.Dict<string> | NodeJS.ProcessEnv = process.env,
): StartupOutboxDrainDecision {
  const transport = store.eventTransport;
  if (!transport) {
    return {
      apply: false,
      reason: isProductionLikeEnv(env) ? "production_like_transport_not_ready" : "event_transport_not_initialized",
    };
  }

  if (isProductionLikeEnv(env)) {
    if (store.eventTransportKind === "in-memory-dev" || transport.kind === "in-memory-dev") {
      return { apply: false, reason: "production_like_in_memory_forbidden" };
    }
    const health = transport.health();
    if (!health.ok) {
      return { apply: false, reason: "production_like_transport_unhealthy" };
    }
    return { apply: true, transportKind: "nats-jetstream" };
  }

  const health = transport.health();
  if (transport.kind === "nats-jetstream" && !health.ok) {
    return { apply: false, reason: "devtest_nats_stub_or_unhealthy" };
  }
  return { apply: true, transportKind: transport.kind };
}
