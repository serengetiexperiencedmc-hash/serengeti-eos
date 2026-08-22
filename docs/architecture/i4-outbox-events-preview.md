# I4 — Transactional Outbox / Events (preview only)

**Status:** Superseded for implementation by [`i4-outbox-events.md`](./i4-outbox-events.md) after I2 hardening.  
**Rule:** Preserve `DB transaction → outbox row → publish` consistency (ADR-0010).

## Required envelope

eventId, type, occurredAt, tenantId, correlationId, causationId, producer, actor, classification, schemaVersion, payload

## Controls

Idempotency, retries, DLQ, replay, event catalogue authorization, classification, observability.

## Bus

NATS JetStream (ADR-0004) unless superseded.

ADR-0006/12/13 remain OPEN — no Production event infrastructure assumptions.
