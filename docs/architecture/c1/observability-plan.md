# C1 — Observability Plan

**Status:** Proposed — extends platform observability

## Correlation

All CRM routes inherit existing `correlationId` / `requestId` from I1 observability middleware.

## Structured log events

| Event | Fields |
| --- | --- |
| `crm_organization_created` | organizationId, tenantId |
| `crm_merge_executed` | survivorId, mergedCount |
| `crm_duplicate_detected` | candidateId, score |
| `crm_authorization_denied` | action, reason |
| `crm_search_executed` | types, resultCount, durationMs |

No PII in log payloads — use entity IDs.

## Metrics (Dev/Test counters)

| Metric | Type |
| --- | --- |
| `crm.organizations.created` | counter |
| `crm.contacts.created` | counter |
| `crm.duplicates.candidates` | counter |
| `crm.merges.executed` | counter |
| `crm.tasks.open` | gauge |
| `crm.tasks.overdue` | gauge |
| `crm.activities.recorded` | counter |
| `crm.api.latency_ms` | histogram (p50/p95 in tests) |
| `crm.api.errors` | counter |
| `crm.events.published` | counter |

Expose via existing `getEventOperationsView` pattern — optional `GET /v1/crm/operations` for CRM-specific counters.

## Tracing chain

```
HTTP Request → CRM mutation → Audit → Outbox → (publish) → Event
```

Use `GET /v1/events/trace/:correlationId` for cross-module trace.

## Alerts (future Production)

Not configured in C1 — document hooks only.

## Database

Log slow queries > threshold in Dev. Index usage review for search paths.
