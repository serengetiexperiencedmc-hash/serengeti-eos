# I12 Observability — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I12** |
| Capability name | Observability |
| Predecessor | I11 ITSM + CMDB (complete); I1 foundational logs/health |
| Architecture status | This document is the I12 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory span ring + additive SQL `083_i12_observability.sql` (schema_registry only). ADR-0017 not reopened |
| Runtime health increment | `I12` |
| Production / UAT / AI | Not authorized |

Authority: committed backlog (`docs/backlog/increments.md` I12 — OTel, health dependency map; not Full AIOps), Phase 3 domain map (`observability` — Signal, SLO, Alert; IT workspace includes observability), technology stack (OpenTelemetry for logs, metrics, traces, correlation IDs), I1 DoD (“Observability beyond health (I12)”), existing `/health` + `/ready`, I11 CMDB `depends_on`, and I1 structured JSON logs with `correlationId` / `requestId`.

The sections after this heading are the architecture contract.

---

## 1. Purpose

Give an internal operator a **Dev/Test health dependency map** over authorised CIs, plus **OTel-shaped request traces** correlated with existing `x-correlation-id`, without standing up production telemetry infrastructure.

## 2. Predecessor

I11 supplies the CI graph. I1 supplies JSON logs, correlation/request IDs, `/health`, and `/ready`. I4 supplies event-infrastructure probes already folded into `/ready`. I12 composes those; it does not replace them.

## 3. Scope

| Deliverable | In scope |
| --- | --- |
| In-process OTel-shaped HTTP spans (traceId = correlation UUID, span per request) | Yes |
| Tenant-scoped span list API | Yes |
| Health dependency map from CMDB `depends_on` + in-process probes | Yes |
| Computed Dev/Test SLO snapshot (request count, error rate, p95) from in-memory spans | Yes |
| Tenant-scoped `/v1/observability/health` increment `I12` | Yes |
| Visible **IT → Observability** UI | Yes |
| Production OTLP exporter / collector / SaaS | No |
| Alert routing, paging, SIEM (I13) | No |
| Full SLO catalog / error-budget policy engine | No |
| Full AIOps / autonomous remediation (I23) | No |

Domain-map **Signal** = spans + map status. Domain-map **SLO** = computed snapshot only. Domain-map **Alert** is I13.

## 4. Non-scope

- OTLP export, OpenTelemetry Collector, Jaeger/Tempo/Prometheus backends
- Production alert routing, PagerDuty, enterprise SIEM
- Discovery / auto-CI from telemetry (I11 non-scope; AI must not create CIs)
- Mutating CMDB from health status
- Operations Workbench field-ops health (O5 remains booking/field)
- Reopening ADR-0017 or changing `/health` and `/ready` auth model

## 5. Dev/Test boundary

Runtime is the in-memory store. Spans are a bounded ring (not OLTP). Live PostgreSQL UNVERIFIED. No production collector. `productionReady` remains false.

## 6. Observability architecture

```
HTTP request
  → I1 hooks (JSON log, correlationId, requestId, x-correlation-id)
  → I12 span ring (tenant-tagged when authenticated)
/ready (unauthenticated)
  → dbHealth + eventInfrastructureHealth
I12 map
  → I11 CMDB nodes + depends_on edges
  → overlay probes: api (process), oltp (/ready db), web (unknown in-process)
```

No second dependency graph. Edges are CMDB `depends_on` only.

## 7. Telemetry model (OTel-shaped)

Each authenticated request records one SERVER span:

| Field | Source |
| --- | --- |
| `traceId` | `correlationId` with hyphens stripped (32 hex) |
| `spanId` | new 16-hex id |
| `name` | `{method} {route}` |
| `startTime` / `durationMs` | request clock |
| `status` | `error` if HTTP ≥ 500, else `ok` |
| `httpMethod` / `httpRoute` / `httpStatus` | request |

Query string and bodies are not stored. Redaction follows I1 logger rules. Unauthenticated requests are not listed on the tenant trace API (process logs remain on stdout).

No OTLP exporter in I12. Trace join to I4 remains `GET /v1/events/trace/:correlationId`.

## 8. Health model

| Surface | Auth | Role |
| --- | --- | --- |
| `GET /health` | none | Process liveness (unchanged) |
| `GET /ready` | none | Process readiness: DB + events (unchanged) |
| `GET /v1/{module}/health` | bearer + module perm | Existing tenant module counts |
| `GET /v1/observability/health` | `observability:read:map` | I12 increment + map/SLO summary |

I12 does not change `/health` or `/ready` payloads except that I12 consumes the same `dbHealth` function `/ready` uses.

## 9. Dependency model

Nodes = tenant CIs with lifecycle `active` or `maintenance` (query `lifecycle=all` includes planned/retired).

Edges = `relType === "depends_on"` only (`runs_on` / `provides` remain CMDB, not map edges).

Probes (convention, not a new CI attribute):

| Probe | Match | Result |
| --- | --- | --- |
| `api` | `ciClass=application` and name matches `/api/i` | `ok` while this process handles the request |
| `oltp` | `ciClass=database` | `ok` / `unavailable` from `dbHealth` (same as `/ready`) |
| `web` | `ciClass=application` and name matches `/web/i` | `unknown` (Next.js is out of API process) |
| none | anything else | `unknown` |

Roll-up (dependencies first):

- self `unavailable` → node `unavailable`
- else if any dependency is `unavailable` or `degraded` → node `degraded` (unless self is `unavailable`)
- else self status (`ok` / `unknown`)

Seeded I11 graph: EOS Web `depends_on` EOS API `depends_on` EOS OLTP.

## 10. API

All JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/observability/health` | `observability:read:map` |
| GET | `/v1/observability/map` | `observability:read:map` |
| GET | `/v1/observability/traces?limit=` | `observability:read:signal` |

Health includes `increment: "I12"`, node counts by status, span count, SLO snapshot.

Map returns `{ nodes, edges, generatedAt }` where nodes have `ciId`, `ciCode`, `name`, `ciClass`, `lifecycle`, `probe`, `status`, `reason`.

Traces return `{ items: SpanView[] }` newest first. `limit` default 50, max 200.

## 11. UI

- `/commercial/observability`
- Nav: **IT → Observability** (domain map: IT Service = itsm, cmdb, observability)
- Not under Operations (O5 is field/booking workbench)
- Map table/list with status badges, dependency lines, probe label
- Trace table
- Filters, loading/empty/error, link to CMDB
- Cross-link from Service Desk/CMDB via existing IT nav

## 12. RBAC

| Permission | Intent |
| --- | --- |
| `observability:read:map` | Health + dependency map |
| `observability:read:signal` | Traces / SLO counts |

`platform.admin` and `it.agent` receive both. Alice and partner: 403.

## 13. Tenant isolation

Map uses tenant CIs/relationships only. Traces stored with internal `tenantId` and filtered on read. Foreign CI ids are not applicable (map is a collection). Missing permission → 403. Unauthenticated → 401.

## 14. Persistence

No span table (ephemeral telemetry). Migration `083_i12_observability.sql` registers `observability` in `schema_registry`. ADR-0017 unchanged.

## 15. Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Invalid `limit` | 400 `invalid_request` |
| DB probe fail | oltp node `unavailable`; dependents `degraded` |
| No CIs | empty map, health `ok` with zero nodes |

## 16. Migration

`083_i12_observability.sql` — schema_registry only. Next SQL increment is **084**.

## 17. Testing

- Kernel: roll-up, cascade, probe matching
- API: 401/403, tenant-scoped traces, map uses I11 `depends_on`, db fail cascade, no secret leak
- Web typecheck
- Regression: I11, I10; O5 and J3 health/auth where practical

## 18. Acceptance criteria

1. Carol can open **IT → Observability** and see the seeded Web→API→OLTP map with statuses.
2. Alice and partner cannot read observability APIs.
3. Traces never include `tenantId` / `principalId` / secrets.
4. `/health` and `/ready` remain unauthenticated and I12 does not require a collector.
5. Map edges are CMDB `depends_on`, not a parallel graph.

## 19. Security constraints

No tokens, passwords, or Authorization headers in spans. I1 redaction remains. Classification of CIs is displayed as CMDB already allows (name/class/lifecycle), not raw logs.

## 20. Production / UAT exclusions

No collector, no SaaS, no UAT, no autonomous AI, no production SLO enforcement.

## 21. Relationship to CMDB

Read-only overlay. Health status is not written back to CI lifecycle. Operators use CMDB to edit relationships.

## 22. Relationship to Operations Workbench

None. Observability is the IT workspace. O5 stays under Operations.

## 23. Relationship to `/health` and `/ready`

Unchanged public probes. I12 reuses `dbHealth` for the oltp probe. Event-bus readiness stays on `/ready` and is not a CMDB node unless a CI exists (I11 seed has none).

## Exclusions

- I13+ Phase 3
- C11, I3.38, I4.35, I20.23, PG.30
- Calendar / Procurement (still domain-map only)

## Dependencies

I11 CMDB. I1 observability hooks. I4 `/ready` event probes (consumed, not replaced).
