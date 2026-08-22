# I4 Hardening Gate — Definition of Done

**Status:** Development/Test hardening complete (automated evidence)  
**Production readiness:** NOT APPROVED  
**CRM/MICE authorization:** BLOCKED until formal gate review after this DoD

## Gates verified

| # | Gate | Evidence |
| --- | --- | --- |
| 1 | Transactional consistency | `i4.outbox.test.ts`, `i4.hardening.test.ts` matrix |
| 2 | Publisher crash / failure injection | `i4.hardening.test.ts` (before_read, after_read, before_publish, after_publish_before_mark, during_retry, shutdown) |
| 3 | Duplicate delivery + consumer idempotency | `i4.outbox.test.ts`, hardening crash-after-publish test |
| 4 | Event ordering (aggregate key) | `getOrderedPublishedEvents` + hardening test |
| 5 | Schema governance | `EventCatalogueEntry` + `validateEnvelopeSchema` + catalogue registration |
| 6 | Sensitive data policy | `reference_only` forbidden keys + `docs/governance/event-sensitive-data-policy.md` |
| 7 | Tenant isolation | outbox + consume + replay + DLQ tests |
| 8 | Replay safety | `requestReplay` + `executeReplayRequest` with reason + auth |
| 9 | DLQ lifecycle | extended `DlqLifecycleStatus` |
| 10 | Observability | `getEventOperationsView`, `/v1/events/operations`, metrics |
| 11 | Health/readiness | `/ready` distinguishes `applicationReady` vs `eventInfrastructureReady` |
| 12 | Transport abstraction | `EventTransport` + `in-memory-dev` stand-in (NOT Production) |
| 13 | Security regression | `i4.security.regression.test.ts` |
| 14 | Performance baseline | `i4.performance.test.ts` (dev evidence, not SLO) |
| 15 | Operational recovery | `docs/architecture/i4-operational-recovery.md` |

## Explicit non-goals (still blocked)

- Production NATS installation/configuration
- CRM / MICE / Supplier modules
- AI agents
- UAT / Production
- ADR-0006 / ADR-0012 / ADR-0013 closure

## Next step

Return for **CRM/MICE authorization gate review** with test evidence bundle. Do not start business-domain modules until approved.
