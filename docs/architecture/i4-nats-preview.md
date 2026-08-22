# I4.1 NATS JetStream Transport — Preview

Increment **I4.1** wires the event transport abstraction to a real NATS JetStream client for Production-gated deployments.

## Transport selection

Env `EOS_EVENT_TRANSPORT`:

| Value | Behavior |
| --- | --- |
| `in-memory-dev` (default) | Dev/Test stand-in — no external broker |
| `nats-jetstream` | Connect to NATS, ensure stream, publish to JetStream |

Additional env:

- `EOS_NATS_URL` — broker URL (e.g. `nats://127.0.0.1:4222`)
- `EOS_NATS_STREAM` — stream name (default `EOS_EVENTS`)
- `EOS_NATS_SUBJECT_PREFIX` — subject prefix (default `eos.events`)

## Code

- `apps/api/src/events/nats-transport.ts` — JetStream publisher
- `apps/api/src/events/transport-init.ts` — `initEventTransport`, `resolveEventTransport`
- `apps/api/src/outbox.ts` — delegates to resolved transport
- `apps/api/src/main.ts` — initializes transport before listen

## Tests

- `apps/api/src/i4.nats.test.ts` — transport selection unit tests
- `apps/api/src/i4.2-consumer.test.ts` — idempotent in-memory consumer wiring
- `apps/api/src/pg-i4.integration.test.ts` — outbox PG dual-write (PG.2, gated)

## I4.2 — Consumers

- `apps/api/src/events/handlers.ts` — handler registry (`platform.ping.v1`, CRM events)
- `apps/api/src/events/consumer.ts` — `processEventEnvelope`, transport wrapper
- `apps/api/src/events/nats-consumer.ts` — JetStream subscribe loop
- `apps/api/src/events/consumer-init.ts` — startup wiring in `main.ts`
- Service principal **Platform Observer** consumes as `platform-observer`

Env: `EOS_NATS_CONSUMER`, `EOS_NATS_CONSUMER_ENABLED`

## Production gate

NATS remains **NOT APPROVED** for Production until ADR-0006 / 0012 / 0013 close. Dev/Test can exercise the client against a local NATS instance.

## Future

- Consumer subscriptions + idempotent handlers
- Stream retention and replay policies per event catalogue
- mTLS / NKey auth for broker connections
