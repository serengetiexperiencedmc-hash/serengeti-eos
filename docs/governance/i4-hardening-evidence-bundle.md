# I4 Hardening Gate — Evidence Bundle (for CRM/MICE authorization review)

**Date:** 2026-08-22  
**Environment:** Development/Test only — **NOT Production certification**

## 1. Test evidence

**47 passed / 2 skipped** (PostgreSQL integration skipped unless `EOS_RUN_PG_TESTS=1`)

| Suite | File |
| --- | --- |
| Transactional outbox | `apps/api/src/i4.outbox.test.ts` |
| Hardening gate | `apps/api/src/i4.hardening.test.ts` |
| Security regression | `apps/api/src/i4.security.regression.test.ts` |
| Performance baseline | `apps/api/src/i4.performance.test.ts` |

## 2. Failure-injection results

Publisher injection points tested: `before_read`, `after_read`, `before_publish`, `after_publish_before_mark`, `during_retry`, `during_shutdown`.  
`after_publish_before_mark` confirms duplicate transport delivery with idempotent consumer.

## 3. Event schema catalogue

Governed registration via `POST /v1/events/catalogue` (`events:register:catalogue`).  
Seed schema: `platform.ping.v1` with required fields, forbidden PII keys, retention, compatibility.  
Kernel validation: `packages/kernel/src/event-schema.ts`.

## 4. Security regression

Unauthorized publish/consume/replay/DLQ, tenant crossing, PII in payload, oversize payload, unregistered types, schema mismatch.

## 5. Tenant isolation

Publish/consume/replay/DLQ scoped to principal tenant; cross-tenant envelope rejected.

## 6. Replay / DLQ evidence

DLQ lifecycle statuses; privileged `requestReplay` + `executeReplayRequest`; audit on request/execute.

## 7. Observability

`GET /v1/events/operations`, `GET /v1/events/trace/:correlationId`, event metrics, structured publisher logs.

## 8. Performance baseline (dev samples)

~100 events commit/publish/consume latency samples in `i4.performance.test.ts` — not an SLO.

## 9. Architecture / ADR status

- I4 accepted Dev/Test; Production **NOT APPROVED**
- ADR-0010 accepted Dev/Test only
- ADR-0006 / 0012 / 0013 **OPEN**
- Transport: `EventTransport` abstraction; `in-memory-dev` stand-in — **not Production NATS**

## 10. Proposed CRM/MICE domain architecture (preview only — NOT AUTHORIZED)

When authorized, business modules consume platform capabilities only:

```
CRM / MICE API
  → IAM + RBAC/ABAC + SoD
  → Workflow + Rules
  → Audit
  → Event outbox (domain events via catalogue)
  → Notifications (I3, when available)
  → Config management
```

Sequence: **I5 CRM → I6 Supplier → I7 MICE RFP/Costing**. No parallel control-plane reimplementation. No AI agents until governed AI platform increment.

**Awaiting formal gate approval before implementation.**
