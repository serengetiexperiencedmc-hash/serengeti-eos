# ADR-0004 — NATS JetStream for Phase 1 events

- Status: **accepted for Development/Test** (in-memory event bus stand-in; I4). Production NATS JetStream remains **proposed** pending ADR-0006.
- Date: 2026-08-21
- Updated: 2026-08-24 (documentation hygiene — status vs Dev/Test reality; decision body unchanged)

## Decision

Use NATS JetStream rather than Kafka at the start. Revisit if retention, fan-out, or compliance archive requirements exceed NATS operations.

## Consequences

Lower ops burden. Kafka migration would require an anti-corruption consumer layer (acceptable).
