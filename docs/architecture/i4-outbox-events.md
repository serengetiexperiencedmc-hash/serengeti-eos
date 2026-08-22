# I4 — Transactional Outbox + Event Infrastructure

**Status:** Authorized for Development/Test implementation after I2 hardening  
**Production:** NOT APPROVED — ADR-0006 / 0012 / 0013 remain OPEN

## Pattern

Business mutation and outbox insert occur in the **same logical transaction**. Publisher retries with backoff; exhausted attempts become **dead-letter operational objects**. Consumers distinguish **delivered** vs **processed** and are idempotent by `(tenantId, consumer, eventId)`.

## Envelope (minimum)

`eventId`, `eventType`, `schemaVersion`, `aggregateId`, `tenantId`, `producer`, `actor`, `actorType`, `occurredAt`, `correlationId`, `causationId`, `classification`, `payload`, `eventVersion`

Prefer references over unnecessary PII in payloads.

## Ordering

No global ordering. Where required, order by **aggregate/entity ID** (document per event type).

## Security

Catalogue registration required. Producer and consumer authorization inherited from platform kernel. Tenant isolation on consume. Simulation mode cannot publish.

## Transport abstraction

```
Application → EventTransport interface → in-memory-dev (Dev/Test default)
                                       → nats-jetstream (I4.1 — Production NOT configured)
```

Business logic must not depend on NATS APIs directly. Production transport remains a future ADR-gated decision.

## Ordering

No global ordering. Per-aggregate ordering when catalogue `orderingKey=aggregateId`.

## Out of scope for I4 increment

- ~~CRM / Supplier / MICE business events as product modules~~ → CRM events designed in [c1-crm-preview.md](./c1-crm-preview.md); register at implementation
- AI agents
- Closing hosting / secrets / IdP ADRs by implicit provider choice

## Tests

See `apps/api/src/i4.outbox.test.ts`.
