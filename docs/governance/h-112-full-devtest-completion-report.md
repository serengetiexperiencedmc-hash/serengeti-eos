# H-112 — Full EOS Dev/Test completion report

> **`H-112 FULL DEV/TEST COMPLETION TRANCHE`**  
> **`NOT UAT`** · **`NOT PRODUCTION AUTHORIZATION`** · **`NOT H-81`** · **`NOT H-80 EXIT`**  
> **`NOT EOS ADOPTION`** · **`NOT GATE B`** · **`NO COMMIT`** · **`NO PUSH`**  
> **`NOT H-113`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T18:40:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved** (not reset, cleaned, stashed, reverted, or discarded).  
**Controlling authorization:** Owner/POA H-112 grant (this tranche).  
**H-111 baseline:** [`accelerated-build-day-7-final-report.md`](accelerated-build-day-7-final-report.md).  
**Operator procedure:** [`h-112-devtest-operator-runbook.md`](h-112-devtest-operator-runbook.md).  
**Full-schema live evidence:** [`h-112-full-schema-devtest-validation.md`](h-112-full-schema-devtest-validation.md).

```text
H-112 P0 COMPLETE WITH FINDINGS
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

This report does not use a completion percentage. Isolated full-schema Dev/Test is not the bounded H-111 catalog, and neither is Production.

---

## 1. H-112 authority

The Owner/POA authorized a controlled engineering tranche to move from the H-111 **bounded F2-DP-01 commercial vertical slice** toward **full EOS Dev/Test system completion**, without Production, UAT, H-81, SoR cutover, or EOS adoption.

P0 was isolation + migration-chain validation + full-schema API startup + fail-closed dual-environment separation. P1 was Account / Programme / Path B / rate identity / operator runbook / focused tests, only where requirements already existed.

Workstreams that would invent commercial rules, weaken authorization, migrate `127.0.0.1:5432/eos`, or touch Gate B were STOPPED rather than improvised.

---

## 2. H-111 baseline

H-111 closed as **`ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`**.

Preserved and not re-litigated:

- Opportunity and RFP commercial-facts operator workflows on the bounded sidecar.
- Browser → web → API → F2-DP-01 sidecar → persistence → retrieval (D6-T5 / D6-T6).
- SOURCE ≠ CHANNEL; OR-01 qualification independent of `new_qualified`.
- Authentication/authorization; 401 and 409 protections.
- Bounded startup, six-map hydrate, deterministic bounded shutdown evidence.
- Web TypeScript 0 errors; API TypeScript 0 errors; focused 79/79 at Day 7.
- Live API and live web-to-bounded-API: PASS WITH FINDINGS.
- Database `127.0.0.1:5432/eos` is 124-only. `schema_migrations` remains absent. Sidecar opportunity facts remain **3**.

H-112 did **not** run global `migrate()` against `eos`. CLI migrate against that URL now refuses with `h111_eos_124_only_preserved`.

---

## 3. Remaining engineering gaps (pre-implementation map)

Inspected H-111 Day 1 matrix, Days 2–7 reports, migrations, mixed C1–C8 persistence, F2-DP-01 sidecar, API/web routes, authz, Account/Programme/Path B/rate, compose, and tests.

| Area | Pre-H-112 state | H-112 disposition |
| --- | --- | --- |
| Full PostgreSQL C-spine | `001`–`124` in repo; `112`–`116` files absent; never applied to `eos` | Isolated `eos_h112_full` on `:5435`; chain applied; numbering hole recorded |
| Dual-env fail-closed | Bounded opt-in only | Bounded vs full-schema mutually exclusive; `eos` / `eos_gateb` / Production refused |
| Account | API PUT existed; UI incomplete | UI + live PUT/GET on full-schema |
| Programme | API PUT existed; operator write incomplete | UI note/version + live PUT/GET |
| Path B | API PUT/decision existed; UI display-only in H-111 | Mutation UI + live PUT/GET |
| Rate identity | STOPPED | Left STOPPED (governance; no silent restart) |
| Operator runbook | `.env.example` comments only | Dev/Test runbook written |
| Mixed SQL vs Store | CRM hydrates; C2/C3/C5 persist to PG without Store copy | Commercial-facts now look up mixed SQL SoR |
| Demo seed | Default `EOS_SEED_DEMO=true` | Unsafe on mixed SQL; keep **false** on full-schema |
| Booking / KPI history / revenue / profit / FX / ingest / G-08-B / Gate B / Production | Undefined or governance-gated | Not implemented |

Work already completed in H-111 was not recreated.

---

## 4. Migration-chain assessment

`migrate()` applies `packages/db/schema.sql` then alphabetically sorted `packages/db/migrations/*.sql`, recording ids in `schema_migrations`.

- Files present through `124_f2_dp01_commercial_facts.sql`.
- **No `125+` in the repository.** None applied.
- **Numbers `112`–`116` are missing files** (numbering hole: `111_dg1_dataset_records.sql` then `117_pr1_procurement_records.sql`). This is not a failed apply.
- Live apply to `eos_h112_full`: **120** rows in `schema_migrations` (`db/schema.sql` + 119 migration files). **First failing migration: none.** Repair not required.
- `021_c9_booking.sql` and later platform tables exist as schema. Their presence does **not** authorize booking, KPI history, revenue/profit, FX, or ingest workflows.
- Application mixed SQL depends on this chain. Bounded `eos` must not receive it.

CLI and API startup refuse database name `eos` (`h111_eos_124_only_preserved`) and `eos_gateb`.

---

## 5. Full-schema Dev/Test environment

Isolated disposable container, not compose `eos`:

```text
container: serengeti-eos-h112-full-pg
image:     postgres:16-alpine
bind:      127.0.0.1:5435
database:  eos_h112_full
user:      eos_h112
label:     Dev/Test disposable — no Production credentials, no customer data, no operational SoR
```

Compose `127.0.0.1:5432/eos` remained the H-111 124-only catalog. Gate B container `serengeti-eos-gate-b-pg` (`127.0.0.1:5434/eos_gateb`) was not targeted.

Reset: `docker rm -f serengeti-eos-h112-full-pg` then recreate and migrate. That is not a Production rollback.

---

## 6. Completed engineering work

### P0

1. Preserved validated F2 slice (`eos` unmigrated; sidecar count 3).
2. Isolated full-schema database on `:5435`.
3. Validated `schema.sql` → `001` … `124` (with `112`–`116` absent).
4. No failing migration to repair.
5. Full-schema API startup: opt-in `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP`, named branch `H-112-FULL-SCHEMA-DEVTEST-API-STARTUP`, `mixedSqlDurable: true`, listen `127.0.0.1:18116`.
6. Fail-closed separation: mutual exclusion, `eos` refuse, `eos_gateb` refuse, Production-like refuse; default startup against `eos` exits 1.

Additional P0-necessary repairs discovered live:

- CRM organization/relationship type ids: process-local seed UUIDs diverged from `ON CONFLICT (tenant_id, key)` durable rows. Hydrate now **adopts PostgreSQL catalogue ids**.
- Opportunity/RFP/programme commercial-facts 404 on mixed SQL because creates persist to PG without copying into Store. Lookup now prefers mixed SQL SoR (bounded sidecar-only still uses process-local collections).

### P1

- Account operator write UI (`AccountCommercialFactsPanel`) on existing PUT, live-validated.
- Programme operator write (observed note / version) on existing PUT, live-validated.
- Path B mutation UI on existing PUT, live-validated.
- Rate identity **not** restarted.
- Dev/Test operator runbook.
- Focused tests for new behaviour.

`EOS_SEED_DEMO=true` on full-schema failed closed (CRM FKs, then `proposal_create_failed:404 rfp_not_found`). Full-schema API runs with **`EOS_SEED_DEMO=false`**.

---

## 7. Tests

Tests were not weakened. No `as any` / `@ts-ignore` / `@ts-expect-error`.

| Suite | Result |
| --- | --- |
| Web Opportunity + RFP + Account + Programme + Path B panels | **33 passed / 5 files** |
| API H-111 write-integrity + RFP PUT + persist + mixed-SQL + bounded startup/shutdown + H-112 startup/migrate/org-type (10 files) | **63 passed** |
| API mixed-SQL commercial-facts lookup | **2 passed** |
| `@sedmc/db` migrate-guard | **3 passed** |
| `apps/web` `npx tsc -p tsconfig.json --noEmit` | **0 errors** |
| `apps/api` `npx tsc --noEmit` | **0 errors** |

This is focused regression of the authorized H-111 slice plus H-112 additions. It is not full CI and not UAT.

---

## 8. Live Dev/Test validation

See [`h-112-full-schema-devtest-validation.md`](h-112-full-schema-devtest-validation.md).

Summary: full-schema API started against `eos_h112_full`; `/health` and `/ready` 200; unauthenticated `/v1/me` and account-facts 401; carol login 200; organization POST after catalogue adoption 201; account facts PUT/GET 200 (PCO ≠ event agency; market `united_kingdom` independent); opportunity/RFP/programme mixed SQL create 201; after SoR lookup, commercial-facts PUT/GET 200; Path B categories PUT/GET 200 (`required: true`, `pending`); identifier conflict 409; SOURCE ≠ CHANNEL; qualification `not_yet_assessed` independent of workflow stage `rfp_received`; programme `rfpObserved: true`; `sellPriceTreatedAsRevenue: false`; sidecar rows persisted; account facts survived process restart (`f2_dp01_commercial_facts_hydrate` accounts=1).

Live **web browser** against the full-schema API was **not** repeated in H-112. Panel unit tests cover the new UI. H-111 D6-T6 remains the bounded web-to-API live class.

Windows `process.kill(pid, 'SIGTERM')` on the listen PID terminated the `npx tsx` wrapper with **exit 1** and **without** `shutdown_started` / `shutdown_completed` log lines. Port 18116 released. This is a documented finding, not a Windows SIGINT experiment and not a Production drain.

---

## 9. Security / authz validation

| Check | Result |
| --- | --- |
| Unauthenticated `/v1/me` | **401** |
| Unauthenticated account commercial-facts | **401** |
| Login (Dev/Test carol only) | **200** |
| Object routes still use `authorize()` | Unchanged |
| Conflicting `accountId` / `rfpId` on PUT | **409** (`*_immutable`) |
| Production-like full-schema opt-in | Refused by unit tests |
| Bounded + full-schema flags together | Refused |
| Full-schema flag + database `eos` | Refused |
| `eos_gateb` migrate/startup | Refused |
| Identifier immutability | Preserved |
| No authz weakening | Confirmed |

---

## 10. Bounded vs full-schema separation

| | Bounded F2 | Full-schema H-112 |
| --- | --- | --- |
| Target | `127.0.0.1:5432/eos` | `127.0.0.1:5435/eos_h112_full` |
| Opt-in | `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP` | `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP` |
| Mixed SQL durable | false | true |
| `schema_migrations` | **absent** | 120 rows |
| `opp_opportunities` | **absent** | present |
| F2 opportunity facts | **3** (unchanged) | 1 live H-112 row |
| Accidental migrate of `eos` | CLI + startup refuse | n/a |

The bounded catalog was not made to pretend it is a complete EOS database.

---

## 11. Remaining engineering blockers

- `EOS_SEED_DEMO` is unsafe on mixed SQL (CRM FK / proposal 404). Not rewritten in this tranche.
- Numbering hole `112`–`116` (no files). Not invented.
- Full-schema leftover rows from the failed demo-seed attempt (counts: 4 opportunities / 2 RFPs / 2 programmes vs one intentional live org/account). Disposable catalog; recreate if a clean slate is required.
- Windows SIGTERM observability on the `npx tsx` wrapper is not equivalent to the bounded POST shutdown evidence class.
- Process-local vs durable CRM identity is fixed for organization/relationship types; other catalogues (activity types) were not similarly proven live.
- Live web UI against full-schema API not browser-validated in H-112.

---

## 12. Governance-gated items (not implemented)

Per H-112 §12, left outside this tranche:

- Production deployment / Production migration
- UAT sign-off, Gate B, `eos_gateb`, H-81, H-80 exit
- Live operational SoR cutover
- Mailbox / Excel / WhatsApp / phone ingestion
- Booking as an operator workflow (schema `021` exists; requirements remain undefined for this tranche)
- KPI history, revenue/profit, FX
- EOS adoption claims
- Deletion of H91 residue
- Rate-identity operator restart
- G-08-B admin console

---

## 13. Exact repository state

```text
HEAD     = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch   = master
index    = EMPTY
porcelain= 480 lines (dirty tree preserved; H-112 files uncommitted)
commit   = NOT PERFORMED
push     = NOT PERFORMED
```

---

## 14. What is now genuinely finished

- Isolated full-schema Dev/Test database, labelled and disposable.
- Observable fail-closed migrate of the authorized file chain onto that database only.
- Full-schema API startup with fail-closed dual-environment discipline.
- Account, Programme, and Path B **operator write** paths where APIs already existed, with UI and live API evidence on full-schema.
- CRM catalogue id adoption after hydrate.
- Commercial-facts SoR lookup for mixed SQL opportunity/RFP/programme.
- Dev/Test operator runbook distinguishing bounded vs full-schema.
- Focused tests and TypeScript 0 errors on web and API.

The H-111 bounded slice remains valid and separate.

---

## 15. What is still not finished

- Entire EOS product.
- Production, UAT, H-81, H-80 exit, EOS adoption.
- Rate identity operator completion.
- Demo seed on mixed SQL.
- Booking / KPI history / revenue / profit / FX / ingest.
- Migration files `112`–`116`.
- `125+` (absent and out of scope).
- Production runbook / measured RTO/RPO.
- Browser live class against the full-schema API.
- Clean full-schema catalog without failed-seed leftovers (reset is documented, not executed as a second recreate after successful live writes).

---

## P1 classifications

| Item | Classification |
| --- | --- |
| 7. Account write/operator capability | **COMPLETE** |
| 8. Programme write/operator capability | **COMPLETE** |
| 9. Path B mutation capability | **COMPLETE** |
| 10. Rate identity | **GOVERNANCE-GATED** (H-111 STOPPED; H-112 forbade silent restart; live mixed cost-line / FX coupling remains undefined) |
| 11. Operator/runbook documentation | **COMPLETE** (Dev/Test only; not a Production runbook) |
| 12. Focused regression coverage | **COMPLETE** |

---

## Final classification

```text
H-112 P0 COMPLETE WITH FINDINGS
```

Findings are material: numbering hole `112`–`116`; demo seed unsafe; failed-seed leftovers in the disposable catalog; Windows SIGTERM wrapper exit 1 without shutdown logs; full-schema web browser class not repeated. They do not reverse P0 isolation, migration apply, full-schema API startup, or fail-closed separation.

**Production Ready is not claimed.**
