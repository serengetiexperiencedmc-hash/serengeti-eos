# H-111 Day 6 D6-T5 Live Integration Report

> **`H-111 DAY 6 D6-T5`**  
> **`BOUNDED LIVE DEV/TEST INTEGRATION VALIDATION`**  
> **`NOT UAT`** · **`NOT PRODUCTION`** · **`NOT H-81`**  
> **`NOT EOS ADOPTION`** · **`NOT GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T16:20:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Slice:** Owner/POA **D6-T5** (this increment).  
**Prior:** Days 1–5; D6-T1 **PASS**; D6-T4 **PASS — REMEDIATED**.

```text
DAY 6 D6-T5 STATUS = PASS WITH FINDINGS — LIVE DEV/TEST INTEGRATED
INCREMENT = EOS-7D-ACCEL
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

---

## 1. Authority

Live validation of Days 2–5 commercial-facts verticals against the already-established bounded Dev/Test runtime (`apps/api/src/main.ts` + `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` + TCP `127.0.0.1:5432/eos`).

No application implementation. No test additions. No schema/migration. No Gate B. No Windows SIGINT / `Stop-Process`. Shutdown only via `POST /eos-devtest/f2-dp-01/bounded-shutdown`.

---

## 2. Initial repository state

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | EMPTY |
| Porcelain | **456** |

No reset, clean, stash, revert, or restore.

---

## 3. Runtime target

| Item | Recorded |
| --- | --- |
| PostgreSQL | `127.0.0.1:5432/eos` (`compose-postgres-1`, `postgres:16-alpine`) |
| Redacted URL | `postgres://127.0.0.1:5432/eos` |
| Gate B `127.0.0.1:5434` / `eos_gateb` | **running, not used** |
| Opt-in | `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` |
| `EOS_SEED_DEMO` | **unset** (forbidden on bounded path) |
| `NODE_ENV` / `EOS_ENV` | **unset** (not production-like) |
| Listen | `127.0.0.1:18115` (`EOS_PORT=18115`; default `8080` occupied by unrelated PID **17868**) |
| Process | listener PID **31940**; wrapper PID **32204** |
| Entry | `npx tsx src/main.ts` from `apps/api` |

---

## 4. Database pre-check

Via `docker exec compose-postgres-1 psql -U eos -d eos` (Unix-socket `inet_server_port` empty, as in H-91; TCP mapping is `0.0.0.0:5432->5432`).

| Check | Result |
| --- | --- |
| `current_database()` | `eos` |
| `schema_migrations` | **absent** |
| Sidecar tables | six present: `f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts` |
| Row counts | **1 / 1 / 1 / 1 / 1 / 1** |
| H91 opportunity marker | present (`H91-TEST-OPP-001` in payload nextAction) |
| Mixed `opp_%` / `rfp_%` tables | **none** |
| Unauthorized migrations | **none observed** |

H91 rows were **not** deleted or mutated in the pre-check.

---

## 5. API startup evidence

Bounded branch entered. Observable log (`2026-09-21T13:09:46.100Z` UTC):

```text
msg=f2_dp01_bounded_devtest_api_startup
opportunities=1 rfps=1 pathB=1 accounts=1 rates=1 programmes=1
namedBranch=F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
mixedSqlDurable=false
globalMigrateInvoked=false
productionReady=false
```

Then:

```text
f2_dp01_bounded_devtest_shutdown_trigger_registered
path=/eos-devtest/f2-dp-01/bounded-shutdown
api_listening url=http://127.0.0.1:18115
```

**Absent** (default path skipped): `database_migrated`, `database_seed_synced`, mixed hydrate series, `f2_dp01_commercial_facts_hydrate` (that message is the default-path hydrate; bounded used the named startup message instead).

`/health` **200**. `/ready` **200**, `applicationReady=true`, `database.ok=true`.

Expected Dev/Test warnings: in-memory event transport; dev-outbox email; listen-host isolation; bootstrap secrets using documented Dev defaults (`carol.admin@sedmc.local`).

---

## 6. Opportunity live validation

H91 sidecar UUID `91919191-0000-4000-a091-000000000011` GET commercial-facts → **404** (no process-local opportunity identity on 124-only `eos`). See Finding 2.

Controlled Dev/Test identity (not genuine commercial activity):

| Step | Result |
| --- | --- |
| CRM import `D6-T5-TEST Client Ltd` | committed org `20527c53-9afe-4f84-aff3-45775d6f8c32` |
| POST opportunity `D6-T5-TEST-OPP` | **201** id `6a5d3066-08f3-43d1-848e-5b663d0b8ec3`, stage `new_qualified` |
| GET opportunity | **200** |
| GET commercial-facts (before PUT) | **200**, `recorded=false`, `mode=f2_dp01_sidecar`, `mixedSqlDurable=false`, `qualificationStatus=not_yet_assessed`, `or01Qualified=false`, `newQualifiedStageIsNotQualification=true` |
| PUT nextAction `D6-T5-TEST controlled next action` | **200**, `recorded=true`, same mode, `or01Qualified` still false |
| GET after PUT | **200**, nextAction preserved, `opportunityId` unchanged |
| PUT conflicting `opportunityId` | **409** `opportunityId_immutable` |
| Unauthenticated GET | **401** `unauthenticated` |

OR-01 semantics preserved: `new_qualified` is not qualified. No revenue/profit/FX/booking facts created.

---

## 7. RFP live validation

H91 RFP UUID GET → **404** (same identity gap).

| Step | Result |
| --- | --- |
| POST RFP `D6-T5-TEST-RFP` | **201** id `2712bab0-21a5-469e-ad51-14bb3319f0b3`, **legacy** `source=email` (C-spine field, not F2 SOURCE) |
| GET RFP | **200** |
| GET commercial-facts before PUT | `recorded=false`, `mode=f2_dp01_sidecar`, `mixedSqlDurable=false`, F2 `primarySource`/`channel`/`receivedAt`/`firstResponseAt` **null**, `clarificationStatus=not_started`, `sourceDistinctFromChannel=true`, `legacyCollapsedSourceAuthoritativeForF2=false`, timestamps **not** inferred from createdAt |
| GET Path B | **200**, `status=not_required`, `required=false`, `recorded=false`, `mode=f2_dp01_sidecar` (display GET only; no Path B write) |
| PUT `primarySource=referral`, `channel=email` | **200**, `recorded=true`, SOURCE ≠ CHANNEL, timestamps still **null** (not invented) |
| GET after PUT | **200**, referral / email persisted |
| PUT `primarySource=email` + `channel=email` | **400** `invalid_primary_source` (email is CHANNEL, not SOURCE) |
| PUT conflicting `rfpId` | **409** `rfpId_immutable` |

No first-response or clarification event was manufactured.

---

## 8. Web/API integration evidence

**This portion STOPPED** (section 8 fail-closed).

| Attempt | Result |
| --- | --- |
| Existing Next on **3001** (PID **36512**) | Already running; default proxy is `EOS_API_URL` → `http://127.0.0.1:8080`, which is an **unrelated** listener (PID **17868**), not the bounded API |
| Start Next `:3015` with `EOS_API_URL=http://127.0.0.1:18115` | Next refused: another `next dev` already holds `apps/web` (PID 36512) |
| Kill PID 36512 | **not performed** (`Stop-Process` forbidden) |

No new login mechanism. `/v1/me` on the **bounded API** returned id/email/roles and **no** `permissions` key. `authorize()` was not modified.

Browser panel load against the bounded process was **not** established.

---

## 9. Persistence round-trip evidence

| Entity | GET → PUT → GET | Sidecar after write |
| --- | --- | --- |
| Opportunity `6a5d3066-…` | nextAction written; qualification unchanged; id immutable | `f2_opportunity_facts` row with `D6-T5-TEST controlled next action` |
| RFP `2712bab0-…` | SOURCE/CHANNEL written; timestamps not invented | `f2_rfp_facts` row `referral` / `email`, rec/fr empty |

`persistence.mode` = `f2_dp01_sidecar` throughout. `mixedSqlDurable` = **false**. Conflicting body ids → 409, not silent rewrite.

---

## 10. Mixed-SQL isolation evidence

| Proof | Result |
| --- | --- |
| Startup `mixedSqlDurable=false` / `globalMigrateInvoked=false` | observed |
| Default migrate/sync logs | **absent** |
| `opp_%` / `rfp_%` tables | **0** before and after |
| Opportunity/RFP identity | process-local (POST 201 without mixed SQL) |
| Facts | JSONB sidecar only |
| H91 GET without process identity | 404 (does not leak sidecar as mixed SoR) |

---

## 11. Shutdown evidence

```text
POST http://127.0.0.1:18115/eos-devtest/f2-dp-01/bounded-shutdown
Content-Type: application/json
{}
```

HTTP **202** `{ accepted: true, signal: "deterministic-trigger", … }`.

| Phase | Observed |
| --- | --- |
| `f2_dp01_bounded_devtest_shutdown_trigger_accepted` | 2026-09-21T13:12:48.774Z |
| `shutdown_signal_received` | 13:12:48.775Z `deterministic-trigger` |
| `shutdown_started` | 13:12:48.775Z |
| `shutdown_fastify_close_invoked` | 13:12:48.775Z |
| `shutdown_pool_end_invoked` | 13:12:48.783Z |
| `shutdown_completed` | 13:12:48.783Z `listenerReleased=true` |
| Process exit | **0** |
| `127.0.0.1:18115` | **RELEASED** |

No SIGINT, no `Stop-Process`, no forced kill of the API.

---

## 12. Post-runtime database integrity

| Check | After |
| --- | --- |
| Six sidecar tables | intact |
| Counts | opp **2**, rfp **2**, pathB **1**, account **1**, rate **1**, programme **1** |
| H91 opportunity marker | **preserved** (1 row) |
| D6-T5-TEST sidecar rows | **retained** as controlled Dev/Test residue (not H91; not genuine commercial facts) |
| `schema_migrations` | still **absent** |
| Mixed `opp_%`/`rfp_%` | still **none** |

Intended mutation: two sidecar upserts. No mixed schema create. No 001–123 / 125+.

---

## 13. Focused regression tests

| Suite | Result |
| --- | --- |
| Web Opportunity + RFP | **24 passed / 2 files** |
| API D1 + RFP PUT + persist + mixed-SQL | **25 passed / 4 files** |

Lifecycle vitest not re-run: live shutdown already exercised the runner; no lifecycle source change in D6-T5.

---

## 14. Type-check results

| Check | Result |
| --- | --- |
| `apps/web` `tsc -p tsconfig.json --noEmit` | **0 errors** |
| `apps/api` `tsc --noEmit` | **0 errors** |

D6-T4 `useState<string>` remediation was **not** broadened.

---

## 15. Findings

1. **Default `8080` occupied** (PID 17868). Used existing `EOS_PORT` **18115**. Same class as H-96 Finding 1. Not a bounded-branch defect.
2. **H91 sidecar facts are not HTTP-reachable** without process-local opportunity/RFP identity (124-only `eos` has no mixed C-spine tables). GET returns **404**. Hydration counts 1/1/1/1/1/1 still prove sidecar attach. Round-trip used marked `D6-T5-TEST-*` entities.
3. **Web UI not live-validated.** Existing Next on 3001 cannot be retargeted to `:18115` without stopping PID 36512, which is out of scope.
4. Expected Dev/Test config warnings (in-memory transport, dev-outbox, loopback bind, bootstrap defaults).
5. Docker `psql` `inet_server_port` empty (Unix socket). TCP identity remains compose `5432`.

Findings **1, 4, 5** do not invalidate the API vertical. Findings **2–3** are documented limitations.

---

## 16. Exact limitations

- Not a browser E2E of Opportunity/RFP panels.
- Opportunity/RFP **identity** on this DB is process-local; only F2 facts are sidecar-durable.
- D6-T5-TEST sidecar rows remain in Dev/Test (labelled; not adoption evidence).
- Not full CI, Playwright, UAT, Production, or Gate B.

---

## 17. Final classification

```text
PASS WITH FINDINGS — LIVE DEV/TEST INTEGRATED
```

The authorized API path executed: bounded `main.ts` → F2-DP-01 startup → sidecar JSONB persist/retrieve for Opportunity and RFP → SOURCE ≠ CHANNEL → identifier fail-closed → mixed SQL not used → deterministic shutdown exit 0.

Web panel load against that process was **not** established (Finding 3).

---

## 18. Not UAT / Production / H-81 / adoption

This report is **not** UAT evidence, Production evidence, H-81 evidence, EOS adoption evidence, or H-80 exit evidence. H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Rate identity remains **STOPPED**.

---

## 19. Final repository state

| Item | Before | After |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Branch | `master` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **456** | **457** (456 + this report) |
| Application files | unchanged | unchanged |
| Commit / push | not performed | not performed |

**STOP.** D6-T5 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 6 D6-T5 live integration report.**
