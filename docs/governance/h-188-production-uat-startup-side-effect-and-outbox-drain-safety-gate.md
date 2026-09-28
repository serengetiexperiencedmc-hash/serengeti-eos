# H-188 — Production/UAT Startup Side-Effect and Outbox Drain Safety Gate

> **DEV/TEST ENGINEERING SAFETY AND CONTROL-FLOW AUDIT ONLY.**  
> Determines I4 startup outbox-drain semantics and makes the Production/UAT transport boundary explicit.  
> **NOT** Production deployment. **NOT** UAT. **NOT** Production readiness. **NOT** Production implementation authorization.  
> H-181 through H-187 were **inspected and not rewritten**. H-81 remains **OUT OF SCOPE**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 691  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-188 STATUS = COMPLETE — CASE A WITH EXPLICIT TRANSPORT GATE
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## 1. Repository baseline

Verified at H-188 start:

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | 691 |
| Tracked diff vs HEAD | 182 |
| H-187 | complete; artefact present; **not rewritten** |

---

## 2. H-187 dependency

H-187 made `syncStoreToPostgres` and CRM catalogue startup writes explicit Dev/Test-only operations. It recorded `publishPendingOutbox` as a remaining I4 operational drain that can `UPDATE` pending outbox rows if Production validation later passes. H-188 resolves that remaining concern without weakening H-187.

---

## 3. Startup control-flow trace

Actual order in `apps/api/src/main.ts` after H-188:

1. Environment / `isProduction`
2. `validateDeploymentConfig` — Production-like fatals `process.exit(1)`
3. Token / identity / bootstrap
4. In-memory `seedStore` (`outboxEvents: []`)
5. Bounded / H-112 named-branch decisions (Production-like **refuse**)
6. Pool + migrate decision + H-187 store-sync decision + CRM `persistCatalogues`
7. SELECT hydrates (including pending outbox **read**)
8. `initEventTransport` (Production-like requires live NATS; forbids in-memory/stub)
9. **H-188** `shouldDrainOutboxOnStartup` → `publishPendingOutbox` or skip
10. `initEventConsumers`
11. `buildServer` / demo-seed gate / `listen`

Drain is **after** transport init and **before** consumer wrap, so startup publish does not locally invoke `DEFAULT_EVENT_CONSUMER`. Bounded F2 startup still skips the default drain.

---

## 4. Complete startup mutation inventory

| Startup operation | Reachable from startup? | DB mutation? | Environment(s) | Explicit gate? | Intended Production behavior |
| --- | ---: | ---: | --- | --- | --- |
| `migrate()` | default DB path | schema write | Dev/Test isolated catalogs | `shouldApplyStartupMigrations` | **Not** auto-run (`production_gate_c_not_authorized`) |
| `syncStoreToPostgres` | default DB path | upsert seed | Dev/Test | H-187 | **Not** run |
| CRM catalogue upserts | hydrate | write | Dev/Test | H-187 `persistCatalogues` | **Not** run |
| Other `hydrate*` | default DB path | SELECT | when URL set | none (read) | Load SoR; not seed |
| `hydratePendingOutbox` | default DB path | SELECT | when URL set | none (read) | Load pending events |
| `publishPendingOutbox` | after transport init | `UPDATE outbox_events` status/attempts | Dev/Test in-memory; Production/UAT only healthy NATS | **H-188** `shouldDrainOutboxOnStartup` | I4 recovery **when** live NATS is ready (ADR-0010 / ADR-0017 PG.2) |
| `seedDemoCommercialData` | after `buildServer` | writes via APIs | Dev/Test flag | Production-like fatal | **Forbidden** |
| F2 persist | request path / bounded | gated writes | Dev/Test | `production_not_authorized` | **Not** authorized |
| `seedStore` | always | in-memory only | all | n/a | Not a DB write |
| HTTP `/v1/events/outbox/publish` | not startup | drain | Dev/Test labelled | RBAC | Not a startup path |

No other startup INSERT/UPDATE/DELETE class was found beyond H-187 seed writes and I4 outbox status bookkeeping.

---

## 5. `publishPendingOutbox()` analysis

| Question | Evidence |
| --- | --- |
| Call sites | Startup (`main.ts`); Dev/Test HTTP `POST /v1/events/outbox/publish`; I4 tests |
| Environment | Previously ungated; now `shouldDrainOutboxOnStartup` |
| Reads? | Filters in-memory `status=pending` (after PG hydrate) |
| DB mutations | `persistOutboxPublish` → `UPDATE outbox_events SET status, published_at, attempts, last_error` |
| Idempotent? | At-least-once: already-`published` rows are not re-selected; consumers must be idempotent (ADR-0010 / i4-operational-recovery) |
| External events? | `transport.publish(envelope)` — in-memory bus in Dev/Test; NATS JetStream when that transport is live |
| Business state? | Does **not** mutate CRM/opportunity rows; may DLQ the outbox row; consumers run later |
| Before HTTP ready? | **Yes** (after transport, before `listen`) |
| After restart? | **Yes** — pending rows survive PG and are drained again |
| Retry | `maxAttempts` default 3; then dead-letter |
| Partial complete | Yes (crash injection points exist for tests) |
| Transport dependent? | **Yes** |
| Unreachable today in Production? | **Yes** — `validateDeploymentConfig` still fails closed first |
| If validation later passed? | Drain **only** if healthy `nats-jetstream`; otherwise skip and **do not** mark published against in-memory/stub |

Classification:

```text
Database state mutation     = outbox row status bookkeeping (UPDATE)
External event publication  = EventTransport.publish (NATS when live)
Operational retry bookkeeping = attempts / last_error / DLQ
```

The HTTP publish route remains labelled Dev/Test. That does **not** make startup drain Dev/Test-only: ADR-0017 PG.2 is “Insert on emit, **drain on startup**”.

---

## 6. Production semantics

I4 recovery is an intended Production runtime responsibility **once** a live event bus exists:

- ADR-0010: publisher pushes to the bus; NATS intended for Production; in-memory is Dev/Test.
- ADR-0017 PG.2: drain on startup.
- `docs/architecture/i4-operational-recovery.md`: on restart, publisher drains `status=pending`.
- `docs/architecture/pg-persistence-preview.md`: hydrate + drain when `EOS_DATABASE_URL` is set.

H-188 does **not** disable Production drain because it writes. It forbids marking rows `published` against the in-memory or NATS **stub** (which would drop events). Production drain is permitted only through an initialized, `health().ok` NATS transport.

Today that path is still unreachable: validation (IdP, secrets, infra, NATS URL, object store, email) fails closed first. Production event product remains **unselected**.

---

## 7. UAT semantics

UAT is Production-like (`isProductionLikeEnv`).

| Operation | UAT |
| --- | --- |
| Auto migrate | skipped |
| Demo seed | forbidden |
| In-memory store sync | skipped (H-187) |
| CRM catalogue seed persist | skipped (H-187) |
| In-memory / stub outbox drain | **skipped** (H-188) |
| Drain via healthy UAT NATS | **permitted** as I4 recovery (same rule as Production) |
| Real Production bus | not selected by this increment; UAT would only hit whatever `EOS_NATS_URL` is configured |

UAT must not silently publish through the Dev/Test stand-in.

---

## 8. Case A / B / C outcome

```text
CASE A — Production outbox drain is intentionally permitted
         with an explicit transport-readiness gate
```

Why not B: architecture documents drain-on-startup as I4 recovery, not a Dev/Test-only leftover. Disabling Production drain merely because it `UPDATE`s would remove legitimate recovery.

Why not C: intended semantics are established in ADR-0010, ADR-0017, and I4 operational recovery. The gap was implementation ordering (drain **before** `initEventTransport`), which would have published to in-memory and then marked PG rows published if validation were later satisfied.

---

## 9. Exact code changes

| File | Change |
| --- | --- |
| `apps/api/src/persistence/startup-outbox.ts` | **new** `shouldDrainOutboxOnStartup` |
| `apps/api/src/main.ts` | hydrate-only in the DB block; drain after `initEventTransport`, before consumers; skip bounded branch |
| `apps/api/src/h188-startup-outbox-drain-safety.test.ts` | **new** |

H-187 functions **unchanged**. `validateDeploymentConfig` **unchanged**. Migrate semantics **unchanged**. `publishPendingOutbox` body **unchanged**.

---

## 10. Exact tests

| Suite | Tests | Result |
| --- | --- | --- |
| `h188-startup-outbox-drain-safety` | 8 | passed |
| `h187-startup-write-safety` | 7 | passed |
| `e1-c-closure.identity-f1-restart` | 6 | passed |
| `e1-c-deployment-config` | 8 | passed |
| `e1-d-class-a.token-bootstrap` | 4 | passed |
| `f2-dp-01.bounded-devtest-api-startup` | 14 | passed |
| `f2-dp-01.bounded-devtest-shutdown-observability` | 9 | passed |
| `h112-full-schema-startup` | 5 | passed |
| `i4.outbox` | 6 | passed |
| **Total this increment** | **67** | **67 passed, 0 failed** |

**Not run:** full workspace `npm test`.  
**Skipped:** Cloud Run, P19, Production migrate, live NATS.

---

## 11. Compiled-runtime evidence

`npx tsc -p tsconfig.json` (`apps/api`) **exit 0**. Used **`node dist/main.js`**, not `tsx`.

Compiled decision:

```text
prodDrainNoT / uatDrainNoT apply:false reason:production_like_transport_not_ready
prodDrainNats apply:true transportKind:nats-jetstream
prodMig/prodSync apply:false reason:production_gate_c_not_authorized
```

Production compiled start: **exit 1**, `deployment_config_refused`, no migrate, no seed sync, no `outbox_startup_drain`, no `api_listening`, no `ERR_MODULE_NOT_FOUND`.

Dev/Test compiled start log order: `database_migrated` → `database_seed_synced` → `outbox_startup_hydrate` → `event_transport_ready` (`in-memory-dev`) → `outbox_startup_drain` (`published:0` then later restart `published:5`) → `api_listening`.

---

## 12. Disposable database evidence

Catalog `eos_h188_rehearsal` on `127.0.0.1:55435` (container `eos-h188-pg`). Password **not recorded**. Container **removed**.

| Moment | Fingerprint |
| --- | --- |
| Empty after compiled Production start | `tables=0; ledger=absent; outbox=absent` |
| After compiled Dev/Test migrate+sync | `tables=158; ledger=121\|2026-09-22 21:10:18.048885+00; outbox=0\|p=0\|pub=0; tenants=2` |
| After compiled Production against that catalog | **identical** |
| After smoke + restart | ledger **unchanged**; `opp_opportunities=1`; CRM hydrate `organizations:1` `accounts:1` |

```text
schema mutation on Production/UAT start: NONE
business-row mutation on Production/UAT start: NONE
outbox-row mutation on Production/UAT start: NONE
external publication attempt on Production/UAT start: NONE
```

---

## 13. Remaining ambiguity

None on the Case A/B/C question.

Production NATS **product still unselected**. A future grant that satisfies validation and supplies a live `EOS_NATS_URL` **will** drain pending outbox at startup onto that bus. That is the documented I4 recovery behavior, not a new authorization of Production hosting.

---

## 14. Known follow-ups

- Select and implement the Production event product (ADR-0006 / GAP-PER-02) before any Production drain can actually run.
- HTTP `/v1/events/outbox/publish` remains a Dev/Test manual drain; not converted to a Production operator API here.
- Owner/POA implementation grant, IdP/MFA, secrets, DNS/TLS, DR/P19, HUM-08, H-181 **authorized / sent NONE**.

---

## 15. Production readiness status

```text
Production NOT READY
Production implementation NOT AUTHORIZED
```

H-188 is engineering safety evidence only. It does not authorize Production, UAT sign-off, or GCP provisioning.
