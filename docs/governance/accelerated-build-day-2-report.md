# H-111 Day 2 — Accelerated EOS Completion Report

> **`H-111 DAY 2 IMPLEMENTATION REPORT`**  
> **`BOUNDED DEV/TEST OPERATING PATH`** · **`OPPORTUNITY F2 UI`**  
> **`NO PRODUCTION`** · **`NO GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT PRODUCTION READY`** · **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T13:35:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Day 1 artefacts:** [`accelerated-build-day-1-system-gap-matrix.md`](accelerated-build-day-1-system-gap-matrix.md), [`accelerated-build-day-1-report.md`](accelerated-build-day-1-report.md).

```text
DAY 2 STATUS = IMPLEMENTATION COMPLETE WITH FINDINGS
INCREMENT = EOS-7D-ACCEL
F2-I12 = NOT STARTED
G-08-B = NOT BUILT
H-80 = ACTIVE
H-81 = NOT STARTED
PRODUCTION READY = NOT CLAIMED
```

---

## Executive Summary

Day 2 established a **safe bounded Dev/Test commercial operating path** and a **minimum useful opportunity-level F2 commercial-facts UI**.

The live 124-only database `127.0.0.1:5432/eos` was **not** migrated. Global `migrate()` was **not** run. Mixed C-spine SQL is now **fail-closed** when F2-DP-01 bounded startup attaches `dbPool` for sidecar maps only.

Opportunity pipeline cards now open `/commercial/pipeline/[id]`, which loads mixed opportunity identity from process-local Store and F2 OR-01 facts from the existing commercial-facts APIs. Persistence is labelled (`f2_dp01_sidecar` vs `in_memory_preview`; mixed SQL durable vs not). H91-TEST labels are shown as controlled Dev/Test residue, not adoption evidence.

Web tests now exist (7 passing). Focused API tests: 43 + 3 persist regressions passed. API `tsc` passed. Web `tsc` still fails on **pre-existing** `EosSessionProvider.tsx` literal-type errors (not introduced by Day 2).

Live PostgreSQL runtime was **not** required after unit/API evidence; schema was not re-queried.

---

## Work Completed

### Priority A — Bounded operator path

- Bounded startup now sets `store.f2Dp01BoundedSidecarOnly = true`.
- New `isMixedSqlDurable(store)`: durable mixed SQL only when `dbPool` is set **and** sidecar-only is false.
- Mixed opportunity / RFP / programme / costing / commercial-approval / commercial-documents paths use `isMixedSqlDurable` instead of `isDurableSoR`.
- CRM outbox/entity persist against PostgreSQL skipped on sidecar-only.
- `persistDenyAudit` uses memory on sidecar-only (no `audit_events` table required).
- F2 persist still uses `isDurableSoR` + sidecar tables.
- Default `shouldApplyStartupMigrations` **unchanged** (still `apply: true` for Dev/Test `eos` when bounded flag is absent).
- `.env.example` documents `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` and forbids `npm run migrate` against 124-only `eos`.

### Priority B — Opportunity F2 UI

- New detail page `/commercial/pipeline/[id]`.
- Pipeline cards link to that page.
- Panel exposes OR-01 qualification (independent of `new_qualified`), owners, next action, linked account type/market when present, persistence caption.
- Save uses existing PUT `/v1/pipeline/opportunities/:id/commercial-facts`.
- No G-08-B admin console. No KPI/revenue/profit/FX/booking UI.

### Priority C — Remaining F2 embeds

- RFP detail: source, channel, receivedAt, firstResponseAt, clarification, Path B (**GET display**).
- Programme builder: identity trace (**GET display**).
- Account type/market shown on opportunity when `c1Account.linked`.
- **Rate identity UI STOPPED** (not on the opportunity path without mixed supplier/costing durability; no new rule).

### Priority D — Authorization

- Server `authorize()` on commercial-facts unchanged and required.
- UI 401/403 handling; GET without token returns 401 (API test).
- UI hiding is not treated as authorization.

### Priority E — Tests

- New API: `f2-dp-01.mixed-sql-sidecar-only.test.ts`.
- New web vitest (existing vitest family; no new framework).

---

## Files Changed

**New (this increment, among the dirty tree):**

- `apps/api/src/f2-dp-01.mixed-sql-sidecar-only.test.ts`
- `apps/web/src/app/commercial/pipeline/[id]/page.tsx`
- `apps/web/src/components/commercial/OpportunityCommercialFactsPanel.tsx`
- `apps/web/src/components/commercial/RfpCommercialFactsPanel.tsx`
- `apps/web/src/components/commercial/ProgrammeCommercialFactsPanel.tsx`
- `apps/web/src/lib/commercial-facts-api.ts`
- `apps/web/src/opportunity-commercial-facts-panel.test.tsx`
- `apps/web/vitest.config.ts`
- `docs/governance/accelerated-build-day-2-report.md` (this file)

**Modified (Day 2 intent; some paths were already dirty/untracked):**

- `apps/api/src/persistence/durable.ts` — `isMixedSqlDurable` / sidecar-only
- `apps/api/src/store.ts` — `f2Dp01BoundedSidecarOnly`
- `apps/api/src/commercial-facts/bounded-startup.ts` — set sidecar-only
- `apps/api/src/commercial-facts/persist.ts` — persistence meta
- `apps/api/src/commercial-facts/{service,account,path-b,programme}.ts` — persistence envelope
- Mixed SQL callers: `pipeline/opportunity.ts`, `rfp/rfp.ts`, `programme/programme.ts`, `costing/sheet.ts`, `commercial-approval/approval.ts`, `commercial-documents/service.ts`, `crm/events.ts`
- `apps/api/src/main.ts` — bounded log `mixedSqlDurable: false`, `globalMigrateInvoked: false`
- `.env.example` — bounded operator warning
- Web pipeline / RFP / programme pages, `pipeline-api.ts`, `package.json`, `tsconfig.json`

Unrelated dirty-tree files were **not** reset, cleaned, or discarded.

---

## P0/P1 Items Addressed

| ID | Item | Result |
| --- | --- | --- |
| P0-1 | Bounded operator path / no accidental mixed SQL on 124-only | **Done** (bounded path). Default migrate-without-flag **still a foot-gun** (unchanged by design). |
| P0-2 | Opportunity F2 operating UI | **Done** |
| P0-3 | Do not regress F2 persist | **Preserve** — persist tests passed |
| P1-1 | Account / RFP / Path B / programme embeds | **Partial** — GET UI; RFP PUT timestamps not built |
| P1-2 | Authz on new web→API | **Done** for opportunity facts |
| P1-3 | Dual-path fail-closed | **Done** (`isMixedSqlDurable`) |
| P1-4 | Web tests | **Done** (7 tests) |
| P1-5 | Operator runbook | **Partial** — `.env.example` only |
| P1-6 | Isolate 250k/20% | **Already present** on F2 persist path (Path B). Mixed `evaluateCommercialApprovalGate` **left in place** (not deleted). |

---

## Bounded Startup / Migration Safety

- Bounded branch still does **not** call `migrate()`, `syncStoreToPostgres`, or mixed hydrates.
- Sidecar-only flag prevents mixed repositories from treating `dbPool` as full C-spine SoR.
- Default architecture outside bounded path **unchanged**: `shouldApplyStartupMigrations` still returns `apply: true` for Dev/Test `eos` if the operator omits the env flag.
- **Do not** run `npm run migrate` against `127.0.0.1:5432/eos`.

---

## Opportunity UI

Usable Dev/Test flow:

1. Start API with `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` against `127.0.0.1:5432/eos`.
2. Sign in.
3. Open pipeline; click an opportunity (or create via existing POST API).
4. View/save OR-01 qualification facts.
5. Persistence caption states sidecar vs preview and that mixed SQL is not durable.

Limitations:

- Mixed opportunity identity is **process-local** on this path. Restart drops mixed entities; F2 sidecar rows remain. H91-TEST sidecar rows are **not** listed as pipeline opportunities (correct: they are not genuine cases).
- Create-opportunity button on the pipeline header remains a stub (not expanded into a G-08-B form).

---

## API Changes

- Persistence envelope on F2 GET/PUT: `{ recorded, mode, mixedSqlDurable }`.
- No new commercial fields, thresholds, or maps.
- No booking/KPI/revenue/profit/FX endpoints added.

---

## Authorization Changes

- No new role model.
- Opportunity facts remain `pipeline:read:opportunity` / `pipeline:write:opportunity`.
- Unauthenticated GET → 401.

---

## Web Tests

`apps/web` now has `vitest run`.

`src/opportunity-commercial-facts-panel.test.tsx` — **7 passed**:

1. authorized/sign-in rendering  
2. loading/missing F2 data  
3. recorded F2 facts  
4. API failure  
5. unauthorized  
6. no fabricated 250k/revenue/profit/FX  
7. H91 residue labelling  

---

## API Tests

Focused (not full workspace):

| Suite | Result |
| --- | --- |
| `f2-dp-01.mixed-sql-sidecar-only.test.ts` | 3 passed |
| `f2-dp-01.bounded-devtest-api-startup.test.ts` | included in 43 |
| shutdown observability + trigger | included in 43 |
| `f2-i2.commercial-facts.test.ts` | included in 43 |
| `f2-i4.in-memory-generation-path-b.test.ts` | included in 43 |
| **Subtotal** | **43 passed** (6 files) |
| `f2-dp-01.commercial-facts-persist.test.ts` | **3 passed** |

---

## Typecheck / Build / Lint

| Check | Result |
| --- | --- |
| `apps/api` `tsc --noEmit` | **0** |
| `apps/web` `tsc --noEmit` | **FAIL** — pre-existing `EosSessionProvider.tsx` TS2345 (literal email/password state). **Not modified** (dirty-tree preserve). |
| Lint on Day-2 UI/API files | no diagnostics |
| Full `npm test` / `npm run build` | **not run** (broad suite; dirty tree) |

---

## Runtime Validation

**Not performed.** Unit/API tests established the fail-closed mixed-SQL behaviour with a recording pool. Live listen/shutdown was not re-run. Windows SIGINT was not tested. Gate B was not used.

---

## Database Integrity

This increment **did not** connect to live `127.0.0.1:5432/eos` and **did not** run migrate.

| Question | Record |
| --- | --- |
| Migrations 001–123 applied this increment? | **NO** (no migrate command) |
| `schema_migrations` created this increment? | **NO** |
| Migration 124 re-executed? | **NO** |
| H91 synthetic rows deleted? | **NO** |
| Live re-count of sidecar tables? | **NOT QUERIED** — last evidence remains H-89/H-91 |

---

## Governance Blockers

Recorded and not solved in code:

- Full mixed PostgreSQL C-spine on `eos` (001–123) — **GOVERNANCE-BLOCKED**
- Default `migrate()` if bounded flag omitted — **documented; default path not redesigned**
- Booking authority — **GOVERNANCE-BLOCKED**
- KPI history / revenue / profit / FX — **GOVERNANCE-BLOCKED**
- G-08-B wholesale UI — **not built**
- F2-I12 / I1–I11 thaw — **not started**
- Rate identity operating UI — **STOPPED** (dependency on mixed supplier/costing surfaces; no new rule)
- RFP timestamp **PUT** UI — deferred (GET only today)
- Live 124-only identity survival across API restart — requires mixed schema **or** a new identity grant (not invented)

---

## Remaining P0/P1 Gaps

- Operator can still invoke default `main.ts` + `migrate()` if the bounded env flag is absent (P0 foot-gun; default path unchanged).
- Mixed opportunity/RFP/programme identity does not survive process restart on 124-only `eos`.
- RFP/programme F2 **write** UI incomplete.
- Rate identity UI not started.
- Pre-existing web typecheck errors in session provider.
- Production/authn/IdP still blocked.

---

## Day-3 Recommendation

1. Keep bounded startup as the only operator path; do not apply 001–123.
2. Add **minimal RFP PUT** for already-authorized receivedAt / first-response / clarification / SOURCE≠CHANNEL (display exists).
3. Path B category declaration UI if it can reuse existing PUT without inventing thresholds.
4. Do **not** start booking, KPI persist, or rate-identity if mixed supplier SQL would be required.
5. Optionally fix pre-existing `EosSessionProvider` typecheck **only if** it is required for Day-3 web build — it is unrelated dirty-tree debt.

---

## Repository State

| Item | Before Day 2 | After Day 2 |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **433** (Day 1 complete) | **449** (expected: 448 + this report) |
| Commit / push | not performed | not performed |

H-113 was **not** created.

---

## Authorization Confirmation

- **H-111** remained the governing implementation authority.
- No excluded scope was implemented: no Production, UAT, Gate B, `eos_gateb`, F2-I12, ingest, SoR cutover, booking authority, KPI history, revenue, profit, FX, Path D maturity, H-81 evidence, H91 deletion, Windows SIGINT, or 001–123 migrations.
- **H-80 remains ACTIVE.**
- **H-81 remains NOT STARTED.**
- G-08-B was not granted and was not built.
- This report is **not** commercial adoption evidence.

**STOP.** Day 2 is complete. Do not commit or push.

---

**End of H-111 Day 2 report.**
