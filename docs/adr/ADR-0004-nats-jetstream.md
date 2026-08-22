# ADR-0004 — NATS JetStream for Phase 1 events

- Status: **proposed**
- Date: 2026-08-21

## Decision

Use NATS JetStream rather than Kafka at the start. Revisit if retention, fan-out, or compliance archive requirements exceed NATS operations.

## Consequences

Lower ops burden. Kafka migration would require an anti-corruption consumer layer (acceptable).
