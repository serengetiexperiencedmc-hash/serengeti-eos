# ADR-0010 — Transactional outbox

- Status: **accepted for Development/Test** (I4 foundation); Production blocked on ADR-0006/12/13
- Date: 2026-08-21
- Updated: 2026-08-22

## Decision

Domain writes and event intent share one logical/database transaction via `outbox_events`. A publisher pushes to the event bus (NATS JetStream intended for Production; in-memory stand-in for Dev/Test).

## Consequences

No dual-write loss. At-least-once delivery; consumers must be idempotent. Delivered ≠ processed. Dead letters are operational objects with controlled replay.
