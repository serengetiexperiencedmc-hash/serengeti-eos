# H-111 Day 1 — EOS System Gap Matrix

> **`H-111 DAY 1 AUDIT ARTEFACT`**  
> **`NO IMPLEMENTATION`** · **`NO SCHEMA CHANGE`** · **`NO MIGRATION APPLY`** · **`NO PRODUCTION`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-112`**  
> **`NOT PRODUCTION READY`** · **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T13:05:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Increment:** `EOS-7D-ACCEL` (H-111). **Must not be called F2-I12.**  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).

```text
DAY 1 STATUS = AUDIT COMPLETE — BASELINE ESTABLISHED
IMPLEMENTATION = NOT PERFORMED
PRODUCTION READINESS = NOT CLAIMED
H-80 = ACTIVE
H-81 = NOT STARTED
F2-I12 = NOT AUTHORIZED
G-08-B = UNGRANTED AS GENERAL COMMERCIAL-FACTS UI INCREMENT
H-111 UI = ONLY UI REQUIRED FOR VERIFIED OPERATING WORKFLOWS
DEV/TEST TARGET = 127.0.0.1:5432/eos
GATE B / eos_gateb = FORBIDDEN
```

---

## 1. Executive Summary

The repository is a **pnpm/npm monorepo** (`packages/*`, `apps/*`) with a Fastify API (`apps/api`), a Next.js commercial UI (`apps/web`), a domain kernel (`packages/kernel`), and PostgreSQL migrations (`packages/db`). A large, **intentionally dirty** working tree contains uncommitted Class A/B persistence, F2 commercial-facts sidecar work, F2-DP-01 persist/startup/shutdown, and extensive governance records.

**What currently works (evidenced):**

- Kernel catalogues and validators for C1–C10 identity types and F2 commercial-contract fields (H-44 / H-45 / H-46 / H-29 / `packages/kernel`).
- Fastify HTTP APIs for CRM, pipeline, RFP, programme, costing, commercial approval, proposal, booking, supplier, and F2 commercial-facts GET/PUT (routes registered in `apps/api/src/server.ts`).
- Next.js pages for CRM, pipeline, RFPs, programmes, costing, approvals, proposals, bookings, suppliers, and a commercial dashboard — **without** commercial-facts UI clients.
- F2-DP-01: six JSONB sidecar maps, migration `124_f2_dp01_commercial_facts.sql`, persist/hydrate, bounded Dev/Test API startup, shutdown observability, and loopback deterministic shutdown trigger. Live Dev/Test validation **PASS WITH FINDINGS** (H-91, H-96, H-106).
- Local-password identity for Dev/Test; server-side `authorize()` on commercial-facts and mixed commercial services.
- Isolated compose Postgres 16 / Redis / NATS at `infra/compose/dev.yaml`.

**What is partial:**

- Mixed C1–C10 entities exist as APIs + UI + kernel, but H-28 classified them **PARTIALLY DEMONSTRATED**; C10 KPI **NOT DEMONSTRATED**.
- F2 facts persist to PostgreSQL **only** when `store.dbPool` is set, persist decision allows it, and tables from migration 124 exist. In-memory maps remain the non-durable path.
- Authorized Dev/Test database `eos` received **migration 124 only** (H-89). `schema_migrations` is **absent**. Default `main.ts` cannot safely start against that database because `migrate()` would apply schema.sql + 001–124 (H-87 STOP / H-93 Stage A). Bounded startup is the **only** evidenced safe API process against 124-only `eos`.
- Uncommitted mixed PG repositories (CRM, costing, programme, RFP, opportunity, etc.) exist in the dirty tree but **cannot be assumed live on 124-only `eos`**.

**What is missing / broken / blocked:**

- No `apps/web` client for F2 commercial-facts APIs (G-08-B remains ungranted as a general increment; H-111 allows **only** UI required for verified operating workflows).
- Booking **software exists** but **booking authority is GOVERNANCE-BLOCKED** (H-83 G-05-E / H-111 exclusion).
- KPI history, revenue, profit, and FX **GOVERNANCE-BLOCKED** (G-07-A / H-111). I7 remains a **non-durable preview**.
- Full schema apply to `127.0.0.1:5432/eos`, Gate B, Production, UAT, ingest, SoR cutover, F2-I12, I1–I11 thaw, H-81, Windows SIGINT, and H91 synthetic-row deletion are **OUT-OF-SCOPE / GOVERNANCE-BLOCKED**.
- `apps/web` has **zero** `*.test.ts` / `*.spec.ts` files.
- Default listen port 8080 was historically occupied; bounded live validation used alternate ports (18096 / 18100 / 18106).

**Seven-day feasibility:** A **usable Dev/Test core** (bounded F2 persist + mixed in-memory/API workflows + operating-workflow UI for already-specified F2 maps) is feasible if Days 2–7 stay inside H-111 and **do not** apply 001–123, thaw I1–I11, or invent commercial rules. A **full mixed PostgreSQL SoR for C1–C10 on the authorized `eos` database** is **not safely completable in seven days** without a separate migration grant. **Production readiness is not a Day 1–7 outcome.**

---

## 2. Repository Baseline

Recorded at Day 1 start (read-only git; no reset/clean/stash/revert).

| Item | Value |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | EMPTY |
| Tracking | local `master`; remote tracking not required for this audit |
| Porcelain (H-111 after, Day 1 before these two files) | **431** paths (`git status --porcelain`) |
| Working tree | **DIRTY — preserved** |
| Commit / push | **NOT PERFORMED** |

The dirty tree includes (non-exhaustive): uncommitted API persistence (Class A/B), F2 commercial-facts, F2-DP-01 bounded startup/shutdown/trigger, large `docs/governance` H-57–H-111 set, ADR-0006 family, web proxy/session edits, CI and `.env.example` edits. **Do not discard.**

**After Day 1:** only the two authorized artefacts in §13/§14 of the Day 1 prompt are added. HEAD and index unchanged. Expected porcelain **433**.

---

## 3. Governance Baseline

H-111 is the **current implementation authority** for the seven-day programme. Mention in an earlier record is **not** authorization.

| Record | Status (as recorded; not rewritten) | Day 1 use |
| --- | --- | --- |
| H-80 | **ACTIVE**. Wait for NATURAL post-H-75 commercial evidence (M1–M5). Software ≠ that evidence. | Do not treat software completion as H-80 exit. |
| H-81 | **NOT STARTED**. Evidence trigger unsatisfied. | OUT-OF-SCOPE. |
| H-82 | Process / next-action inventory lineage into H-83. | Context only. |
| H-83 | POA selections G-01–G-13. Controlling commercial-rule lock. | Authoritative exclusions and persist scope. |
| H-84 | G-11-C waiver COMPLETE. | Enabled later persist while H-80 active. |
| H-85 | F2-DP-01 persist grant COMPLETE. | Six maps; not booking; not KPI history. |
| H-86 | Implementation evidence COMPLETE. | Evidence of persist code. |
| H-87 | Live PG grant; **EXECUTION STOPPED** (migrate would apply ~120 files). | Do not run global `migrate()` on `eos`. |
| H-88 | 124-only mechanism COMPLETE. | Only authorized apply path used in H-89. |
| H-89 | Applied **124 only** to `127.0.0.1:5432/eos`. Six tables. `schema_migrations` absent. | Live DB state. |
| H-90 | H-89 evidence audit PASS. | Confirms 124-only. |
| H-91 | Persist/retrieve PASS WITH FINDINGS. Six `H91-TEST-*` rows left. | Do not delete (H-111 exclusion). |
| H-92 | H-91 evidence audit PASS WITH FINDINGS. | |
| H-93 | Default `main.ts` **cannot safely start** against 124-only `eos`. Stage B STOPPED. | Default path ≠ authorized live DB. |
| H-94 / H-95 | Bounded Dev/Test API startup implemented + evidence. | Authorized start path. |
| H-96 / H-97 | Live bounded startup PASS WITH FINDINGS. | Listen/health/ready evidenced; SIGINT incomplete. |
| H-98 / H-99 | Shutdown observability implemented + audit PASS. | |
| H-100 / H-101 | Live SIGINT **STOP / NOT VALIDATED** (Windows). | Do not retest Windows SIGINT. |
| H-102–H-106 | Deterministic POST trigger implemented; live **PASS WITH FINDINGS**. | Bounded shutdown path evidenced. |
| H-107 | Disposition of bounded validation. | Findings remain (I1 label, secrets warning, port 8080). |
| H-108 | No leftover implementation grant after H-107. | Superseded by H-111 for this programme only. |
| H-109 | G-13-B defer F2 while H-80 active. | **Superseded only to the extent of H-111.** |
| H-110-B | H-80 remains ACTIVE; exit not justified. | Still controlling for H-80. |
| H-111-A | 7-day accelerated software programme. | **Controlling for Days 1–7.** |

**Also authoritative for requirements (not implementation grants unless later granted):** H-16 freeze, H-17–H-19, H-25 OR-01–OR-08, H-26/H-27, H-28 live validation, H-29 C-spine + remediation requirements, H-38 Path B, H-41 TIO, H-44 F2 C1–C10 Dev/Test, H-58 F2-I1–I11 freeze, H-63/H-64 UAT preview, H-75 process adoption in force.

**H-83 selections that bind Day 2–7 (do not reopen):**

| ID | Binding effect |
| --- | --- |
| G-01-C | Intended future SoR for named types; **no cutover / Production**. |
| G-02-D | Durable persist of I2–I11 sidecar maps **except booking facts and except KPI history**. |
| G-03-B | F2 authoritative for G-02 types; mixed compatibility. |
| G-04-B | Later grant may isolate mixed 250k/20% **without substituting a number**. |
| G-05-E | Booking **out of software** until genuine H-80/H-81 evidence. |
| G-06-B | Identifier trace without full cost-line freeze. |
| G-07-A | No KPI history; I7 preview non-durable; revenue/profit undefined. |
| G-08-B | Later commercial-facts UI after durable facts; **still ungranted as a general increment**. H-111 allows only operating-workflow UI. |
| G-09-B | H-29 C9=Booking, C10=KPI; alias colliding labels. |
| G-10-C | Coexistence mixed continues; F2 additional; Dev/Test only. |
| G-11-C | Waiver path used by H-84/H-85. |
| G-12-C | I1–I11 frozen; F2-I12 not authorized; consume already-specified catalogues only. |
| G-13-B | Deferred F2 while H-80 active — **superseded only by H-111 programme scope**. |

---

## 4. Architecture Inventory

### 4.1 Applications

| App | Path | Role | Notes |
| --- | --- | --- | --- |
| API | `apps/api` | Fastify HTTP + outbox/event consumers in-process | `main.ts` default vs bounded F2-DP-01 startup |
| Web | `apps/web` | Next.js 16 commercial UI | Port 3001; proxies `/eos-api` |
| Workers | none as separate packages | Outbox / NATS / email digest run inside API process | Not a distinct deployable |
| Supporting | `infra/compose/dev.yaml` | Postgres 16, Redis 7, NATS 2.10 | Isolated Dev/Test only |

### 4.2 Packages

| Package | Path | Role |
| --- | --- | --- |
| `@sedmc/kernel` | `packages/kernel` | Domain types, RBAC/ABAC helpers, C-spine + F2 catalogues, tests |
| `@sedmc/db` | `packages/db` | `schema.sql`, migrations `001`–`124`, `migrate()`, 124-only CLI (H-88) |

No additional domain/infra packages beyond these two plus apps.

### 4.3 Data

| Item | Evidence |
| --- | --- |
| Technology | PostgreSQL 16 (compose). Dual-path: in-memory `Store` when `dbPool` unset; durable when `store.dbPool` set (`isDurableSoR`). |
| Migrations | **119** SQL files under `packages/db/migrations`, including `124_f2_dp01_commercial_facts.sql`. |
| Live `eos` (H-89/H-91) | **124 only**. Tables: `f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts`. `schema_migrations` **absent**. |
| Repositories | Mixed: `persistence/pg-repository.ts`, CRM, costing, programme, RFP, opportunity, commercial-document/approval, `f2-commercial-facts-repository.ts`. Many **uncommitted**. |
| F2 persist | JSONB sidecar upsert/select + hydrate into in-memory maps (`commercial-facts/persist.ts`). |
| Seed/demo | `EOS_SEED_DEMO` **forbidden** on bounded startup. Demo seed exists historically for H-28 in-memory preview. |

### 4.4 API

- **~50** `**/routes.ts` modules under `apps/api/src` (CRM, pipeline, RFP, programme, costing, commercial-approval, proposal, booking, commercial-facts, supplier, plus GRC/ITSM/HR/ERM/privacy/ops/notifications/etc.).
- Auth: `principalFromAuthHeader` → 401 `unauthenticated`; services call `authorize()`.
- Errors: `http-error.ts` + per-module 400/403/404/409 mapping.
- Health: `/health`, `/ready` evidenced 200 on bounded live start (H-96).
- F2 commercial-facts: GET/PUT opportunity, RFP, Path B, account, rates, programme; KPI **preview** GET; follow-up transfer POST.

### 4.5 UI

- **57** `page.tsx` files under `apps/web/src/app`.
- Commercial surfaces include `/commercial`, CRM, pipeline, RFPs, programme, proposals, bookings, suppliers.
- Session: `EosSessionProvider` + local token / eos-proxy.
- **No** web references to `commercial-facts` or `path-b-approval` routes (grep: zero matches in `apps/web/src`).
- Role handling: UI session token; **server-side authorize remains the control**. UI masking is not a substitute.

### 4.6 Infrastructure

| Item | State |
| --- | --- |
| Docker compose | `infra/compose/dev.yaml` only (this audit glob). |
| Env | `.env.example` documents `EOS_DATABASE_URL` for Dev/Test; production-like env refused by F2 persist and bounded startup. |
| Startup | Default `main.ts`: migrate/sync/hydrate mixed + F2 if persist enabled. Bounded: `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true\|1`, host `127.0.0.1`, DB `eos` not `eos_gateb`. |
| Shutdown | Bounded: SIGINT/SIGTERM + POST `/eos-devtest/f2-dp-01/bounded-shutdown`. Windows SIGINT **not validated**. |
| Health/ready | Present; bounded live 200. |

### 4.7 Testing (static discovery only)

| Suite | Count / command |
| --- | --- |
| Root | `npm test` → workspaces `--if-present` |
| API | `vitest run` — **237** `*.test.ts` under `apps/api/src` |
| Kernel | `vitest run` — **53** `*.test.ts` |
| DB | `vitest run --passWithNoTests` — includes 124-only mechanism tests |
| Web | **no test script**; **0** frontend test files |
| CI | `.github/workflows/ci.yml`: `npm ci`, `typecheck`, `npm test`, `build` |
| E2E | **not found** as a first-class Playwright/Cypress package in this inventory |

Broad `npm test` **not executed** on Day 1 (H-111: read-safe discovery only). Prior focused evidence: F2-DP-01 persist + 14 startup + 9 shutdown + 7 trigger tests passed in H-103; `tsc` 0.

### 4.8 Documentation

Large `docs/governance` (H-16–H-111, ADR-0006 family, E1-B/C/D), `docs/architecture`, operational notes. **Authoritative commercial requirements** cluster at H-25, H-27, H-29, H-44, F2-I1 contract, H-83, H-85, H-111.

---

## 5. Requirements Inventory

**Rule:** do not invent requirements. Status is engineering observation against existing grants.

### A. Clearly authorized and buildable (under H-111, Dev/Test)

| ID / source | Description | Implementation | Status |
| --- | --- | --- | --- |
| H-44 / H-85 / G-02-D | Persist/retrieve six F2 maps (opportunity, RFP, Path B, account, rate identity, programme) | API + PG 124 + hydrate | **Implemented and live-validated** (H-91/H-96). UI absent. |
| H-94–H-106 | Bounded Dev/Test API start / hydrate / deterministic shutdown | `bounded-startup.ts`, `bounded-shutdown.ts`, trigger | **Implemented; live PASS WITH FINDINGS** |
| H-25 OR-01–OR-08 / F2-I1 `commercial-contract.ts` / F2-I2–I11 catalogues | Qualification, SOURCE≠CHANNEL, market vs account type, timestamps, first response, programme identity, rate identity, Path B categories, costing/proposal trace **as already specified** | Kernel + commercial-facts services + preview tests `f2-i2`…`f2-i11` | **Catalogues + API present; I1–I11 frozen; consume don't thaw** |
| H-111 §5.1–5.8 | Core workflows, persistence integrity, authn/authz, APIs, **UI for verified operating workflows**, reliability, tests, docs | Mixed + F2 | **Partial** — Day 2–7 queue |
| H-29 retainable identity chain | Opp→RFP→PRG→CST→APR→PROP (+ booking identity exists but booking **authority** blocked) | Kernel + mixed APIs + UI pages | **Partial** (H-28) |

### B. Authorized but dependent on another capability

| Item | Depends on |
| --- | --- |
| Mixed PG CRM/opportunity/RFP/programme/costing/approval/proposal durability on `eos` | Schema 001–123 **not applied** to authorized DB; applying them is **not granted** by H-111 (H-87 STOP pattern). |
| Operator UI for F2 facts | Existing commercial-facts APIs (present) + H-111 operating-workflow UI grant (**not** G-08-B wholesale). |
| G-04-B isolation of mixed 250k/20% | F2 generate path already has persist-enabled guards in `proposal.ts` / Path B; remaining mixed callers. |
| Bounded live API + web together | Bounded env flags, free listen port, local-password session, proxy to API. |

### C. Mentioned but not currently authorized

| Item | Mention | Authority |
| --- | --- | --- |
| G-08-B general commercial-facts UI increment | H-83 | **Ungranted**. Do not build a standalone “facts admin” product. |
| G-01-C SoR cutover | H-83 | Intended future; not this programme. |
| F2-I12 | H-58 / H-83 G-12-C / H-111 | **NOT AUTHORIZED**. |
| Path D maturity | H-111 | Requirements only. |
| G-04-B numerical substitute | Forbidden; isolate only without inventing a number. |

### D. Explicitly excluded by H-111

Production deployment/migration/data; UAT sign-off; Gate B / `eos_gateb`; F2-I12; I1–I11 thaw; SoR cutover; mailbox/Excel/Gmail/Outlook/WhatsApp/phone ingestion; booking **authority**; KPI history; revenue/profit definitions; FX rules; Path D maturity; H-81; EOS adoption evidence; H91 row deletion; Windows SIGINT testing; unrelated architecture rewrites; external commercial systems.

### E. Ambiguous or contradictory

| Conflict | Handling |
| --- | --- |
| Prompt/UAT C-spine labels vs H-29 C9=Booking C10=KPI | **H-29 / G-09-B controlling**. Alias only. |
| H-28 “booking partially demonstrated” vs G-05-E “booking out of software” | Software **exists**; **authority to operate booking as EOS capability is blocked**. Treat as GOVERNANCE-BLOCKED for Day 2–7 completion. |
| G-08-B vs H-111 operating-workflow UI | Build **only** UI that is required to operate already-verified F2 maps inside existing commercial pages. Do not open a new G-08-B increment. |
| H-93 default startup vs H-111 “complete persistence” | Completing persistence **does not** authorize `migrate()` of 001–123. Fail-closed: bounded + 124 sidecar. |
| Dirty uncommitted Class A/B PG vs 124-only live DB | Code may assume tables that **are not** on live `eos`. |

### F. Unknown

- Exact live table inventory on `eos` **beyond** H-89/H-91 six F2 tables (Day 1 did not query Postgres).
- Whether compose volume contains older leftover objects from pre-H-89 experiments.
- Current occupancy of port 8080 / PID 17868.
- Whether full workspace `npm test` currently passes (dirty tree; not run).
- Coverage percentages (not measured).

---

## 6. Functional Capability Matrix

| Capability | Requirement Source | Current State | Evidence | Priority | Authority | Complexity | Dependency | Day 2–7 Action |
| ---------- | ------------------ | ------------- | -------- | -------- | --------- | ---------- | ---------- | -------------- |
| C1 CRM (orgs/contacts/accounts) | H-25/H-29/H-44; H-28 PARTIAL | API+UI+kernel; mixed PG code dirty; live `eos` 124-only | `crm/routes.ts`; web CRM pages; H-28 | P1 | AUTHORIZED (Dev/Test in-memory / mixed code); **DEPENDENCY-BLOCKED** for full PG on `eos` | MEDIUM | 001–123 not applied | Operate via existing APIs/UI; do not migrate 001–123 |
| C1 F2 account facts (market vs type, PCO) | H-25 OR-03; F2-I5; H-85 | API persist+hydrate; **no UI** | `commercial-facts/account.ts`; H-91 | P1 | AUTHORIZED (maps); UI = operating-workflow only | SMALL | F2 APIs present | Add minimal fields on existing account UI |
| C2 Opportunity identity + stages | H-29; H-44 | API+pipeline UI; H-28 PARTIAL | `pipeline/routes.ts`; `/commercial/pipeline` | P1 | AUTHORIZED | MEDIUM | Dual-path Store | Keep mixed stages; do not invent workflow stages |
| C2 F2 opportunity facts (OR-01 qualification ≠ stage) | H-25 OR-01; F2-I2; H-85 | API persist; **no UI** | `commercial-facts/service.ts`; `f2-i2` tests | P0 | AUTHORIZED | SMALL | F2 APIs | Operating UI on opportunity; fail-closed if qualification missing per existing validators |
| C3 RFP + timestamps / clarification / first response | H-25; F2-I8/I9; H-85 | API persist; preview tests; **no facts UI** | `rfp/`; commercial-facts RFP routes | P1 | AUTHORIZED | SMALL | F2 APIs | Minimal RFP operating fields |
| C3 Path B categories (no numerical CPR) | H-38; F2-I3; G-02-D | API persist Path B; mixed 250k/20% still in mixed approval | `path-b.ts`; `f2-i3` tests | P1 | AUTHORIZED (F2); G-04-B isolate mixed **without a number** | MEDIUM | Mixed C7 | Prefer F2 Path B; do not invent thresholds |
| C4 Supplier rates + F2 rate identity | H-29; F2-I6; G-06-B | Supplier APIs+UI; F2 rate identity persist; **no facts UI** | `supplier/`; `rate-identity.ts` | P1 | AUTHORIZED (identity trace, not full cost-line freeze) | MEDIUM | Costing | Identity fields only |
| C5 Programme identity | H-29; F2-I10; H-85 | Programme API+UI; F2 programme facts persist | `programme/`; `f2-i10` tests | P1 | AUTHORIZED | SMALL | F2 APIs | Minimal programme facts UI |
| C5/C6 Costing + proposal trace | H-29; F2-I11; G-06-B | Costing/proposal APIs+UI; trace preview tests | `costing/`; `proposal/`; `f2-i11` | P1 | AUTHORIZED (trace, not freeze all lines) | MEDIUM | Identity chain | Keep mixed costing; F2 trace only |
| C7 Commercial approval | H-29; H-27 categories vs mixed 250k/20% | Approval API+UI; Path B F2 map | `commercial-approval/`; H-28 PARTIAL | P1 | AUTHORIZED for F2 Path B; mixed numerical **REQUIREMENTS-AMBIGUOUS** if used as SoR | MEDIUM | G-04-B | Do not treat 250k/20% as F2 rule |
| C8 Proposal | H-29; H-44 | Proposal API+UI; persist guards when durable | `proposal/proposal.ts`; H-28 PARTIAL | P1 | AUTHORIZED | MEDIUM | C6/C7 | Dev/Test generate; no Office ingest |
| C9 Booking | H-29 identity; **G-05-E** | Routes+pages+kernel **exist** | `booking/routes.ts`; web bookings | P2 (identity) / P0 if treated as operating booking | **GOVERNANCE-BLOCKED** (authority) | n/a | H-80/H-81 | Leave code; do not complete booking ops |
| C10 KPI pack | H-29; **G-07-A** | Preview GET only; not durable | `kpis.ts`; H-28 NOT DEMONSTRATED | P3 | **GOVERNANCE-BLOCKED** (history/revenue/profit) | n/a | Definitions excluded | Keep preview; do not persist history |
| F2 six-map persist | H-85 | COMPLETE WITH FINDINGS | H-86–H-92 | P0 (must not regress) | AUTHORIZED | n/a (done) | 124 tables | Preserve; no H91 delete |
| Bounded startup/hydrate | H-94 | COMPLETE WITH FINDINGS | H-95–H-97 | P0 (authorized runtime) | AUTHORIZED | n/a (done) | Env flag + 127.0.0.1 + `eos` | Day 2 **use this path**; do not “fix” via full migrate |
| Bounded shutdown + trigger | H-98/H-102 | COMPLETE WITH FINDINGS | H-99, H-104–H-106 | P1 (reliability) | AUTHORIZED | n/a (done) | Loopback POST | Do not Windows SIGINT |
| Default `main.ts` vs 124-only `eos` | H-93 | **Unsafe** (would migrate 001–124) | H-87/H-93 | P0 | **GOVERNANCE-BLOCKED** to apply full migrate | LARGE | New POA for 001–123 | STOP; document operator path |
| Commercial-facts operator UI | H-111 §5.7; not G-08-B | **MISSING** | web grep = 0 | P0 | AUTHORIZED (workflow-minimal) | MEDIUM | F2 APIs | Embed in existing C1–C5 pages |
| Authn local-password Dev/Test | H-111 §5.4 | Present; production-like refused | identity / token bootstrap tests | P1 | AUTHORIZED (Dev/Test) | SMALL | Session proxy | Harden fail-closed; no IdP |
| Authz server-side | kernel `authorize` / permissions | Present on commercial-facts and mixed services | service `authorize(` | P1 | AUTHORIZED | SMALL | RBAC catalogue | Audit gaps on any new UI routes |
| Ingest (mail/Excel/chat/phone) | H-19 channels; H-111 exclude | Not in programme | H-111 §6 | — | **OUT-OF-SCOPE** | — | — | None |
| Production deploy / IdP / NATS prod | ADR-0006 OPEN | Not ready | compose + H-111 | — | **OUT-OF-SCOPE** | — | E1/ADR | None |
| I1–I11 thaw / F2-I12 | H-58; G-12-C | Frozen / not started | H-111 | — | **OUT-OF-SCOPE** | — | — | Consume catalogues only |
| Web automated tests | H-111 §5.7 tests | **MISSING** | glob 0 files | P1 | AUTHORIZED | MEDIUM | UI work | Add focused tests for operating UI |
| Full workspace CI green on dirty tree | CI workflow | **UNKNOWN** | not run Day 1 | P1 | AUTHORIZED to run Dev/Test tests | UNKNOWN | Dirty diffs | Day 2 focused tests; not Gate B |

---

## 7. Data / Persistence Assessment

| Topic | Finding |
| --- | --- |
| Foreign keys (F2 124) | Sidecar tables keyed by tenant + entity id (JSONB payload). **Not** a full relational C-spine on live `eos`. |
| Uniqueness | F2 upserts by natural keys in repository; H-91 JSONB key-order finding. |
| Required fields | Enforced in kernel validators / commercial-facts services, not necessarily by PG CHECK on JSONB. |
| Nullability / timestamps | F2 maps carry explicit receipt/first-response/clarification fields per I8/I9 catalogues. Mixed entities have `receivedAt`/`sentAt` (H-29 retainable). |
| Identifiers | UUID principals/entities; commercial labels (OPP-/RFP-…) in mixed preview. H91 synthetic tenant `91919191-0000-4000-a091-000000000001` **must remain**. |
| JSON/JSONB | F2 facts are JSONB; overwrite = upsert of document. |
| Transactions | `runDurableTx` used for F2 persist when durable. Mixed CRM “same-tx” tests exist in dirty tree (`e1-d-class-b.crm-same-tx.test.ts`) — **not proven on 124-only `eos`**. |
| Update/overwrite | F2 PUT replaces sidecar document; mixed PATCH on CRM/pipeline. |
| Auditability | Outbox/audit patterns exist in mixed I4; F2 persist is not a full audit log. Durability ≠ authority (H-83). |
| Live DB vs code | **P0 mismatch:** dirty mixed repositories expect mixed schema; live authorized DB is 124 sidecar only. |

**Status:** F2 sidecar **READY FOR FURTHER VALIDATION**. Mixed PG on `eos` **BLOCKED** (migration grant). In-memory mixed **READY FOR FURTHER VALIDATION** as Dev/Test coexistence (G-10-C).

---

## 8. API Assessment

| Topic | Finding |
| --- | --- |
| Completeness (C-spine) | CRUD/list/transition routes exist for CRM, pipeline, RFP, programme, costing, approval, proposal, booking, supplier. F2 facts routes exist. |
| Completeness (F2 UI clients) | APIs without web callers. |
| Validation | Kernel + service validators; Fastify 415 without Content-Type (H-106 Finding). |
| Status codes | 401 unauthenticated; 403/404/409/400 mapped; trigger 202/403/404/415. |
| Persistence | Dual-path: memory vs F2 JSONB vs mixed PG (latter not on live `eos`). |
| Authorization | Header principal + `authorize()` on F2 services. |
| Consistency | Mixed 250k/20% vs F2 Path B; I1 health label leftover (H-107). |

**Status:** F2 + mixed HTTP **READY FOR FURTHER VALIDATION** in Dev/Test. Production API **BLOCKED**.

---

## 9. UI Assessment

Assess **only** UI required for authorized operating workflows.

| Surface | State | H-111 |
| --- | --- | --- |
| Commercial dashboard | Present; live stats + AI panels | Peripheral; do not expand AI as P0 |
| CRM / pipeline / RFP / programme / costing / proposal | Pages present; talk to mixed APIs | **AUTHORIZED** to complete operating fields |
| F2 commercial-facts | **No pages / no client lib calls** | **AUTHORIZED** as **minimal embed** in those pages — **not** G-08-B |
| Bookings UI | Present | **GOVERNANCE-BLOCKED** as operating booking |
| GRC/ITSM/HR/etc. pages | Present | **OUT-OF-SCOPE** unless required for authz plumbing |
| Role masking | Session token | Insufficient without server authz |

**Status:** Mixed commercial UI **PARTIAL**. F2 operating UI **GAP**. G-08-B-scale UI **GOVERNANCE-BLOCKED**.

---

## 10. Security Assessment

| Area | State | Mark |
| --- | --- | --- |
| Authentication | Local-password Dev/Test; production-like bootstrap refused | READY FOR FURTHER VALIDATION (Dev/Test); Production **BLOCKED** |
| Authorization | Server `authorize()` + permissions; UI is not the control | READY FOR FURTHER VALIDATION |
| Secrets | Env provider; compose `eos-dev-only`; H-96 secrets warning finding | GAP (ops hygiene); Production **BLOCKED** |
| Validation | Kernel catalogues; Fastify content-type | READY FOR FURTHER VALIDATION |
| Access controls | Loopback-only shutdown trigger; Gate B name refuse; persist refuse production/`eos_gateb` | READY FOR FURTHER VALIDATION |
| Dev/Test HTTP controls | CORS/headers/rate-limit (`devtest-http-controls.ts`) — **not** a shutdown API | READY FOR FURTHER VALIDATION |

---

## 11. Testing Assessment

| Kind | Discovery | Day 1 execution |
| --- | --- | --- |
| Unit / API (vitest) | 237 API + 53 kernel | **Not run** (broad). Prior F2-DP-01 focused = pass. |
| DB | 124-only tests present | Not run |
| Frontend | **None** | — |
| E2E | Not inventoried as a package | — |
| Governance / fail-closed | `gate-b.fail-closed.test.ts`, F2 bounded decide tests | Not run |
| Integration PG | Many `pg*.test.ts`, `pg-crm`, `pg-i4` — typically need schema **beyond 124** | Do not point at Gate B; do not assume they pass on 124-only `eos` |
| Known failures | H-101 Windows SIGINT; H-87 migrate STOP; H-93 default startup unsafe | Documented, not re-run |
| Coverage | Not measured | UNKNOWN |

**Missing critical coverage for H-111:** web operating-workflow UI; end-to-end bounded API + F2 PUT/GET + UI; mixed PG tests **must not** be “fixed” by applying 001–123 under this programme.

---

## 12. Infrastructure / Runtime Assessment

| Area | State | Mark |
| --- | --- | --- |
| Compose Postgres/Redis/NATS | Present; Dev/Test only | READY FOR FURTHER VALIDATION |
| `127.0.0.1:5432/eos` | 124 applied; H91 rows leftover | READY FOR FURTHER VALIDATION (F2 only) |
| Default API startup | Unsafe vs 124-only | **BLOCKED** (governance) |
| Bounded API startup | Live validated | READY FOR FURTHER VALIDATION |
| Port 8080 | Historically occupied | GAP (ops) |
| Event transport | Default in-memory-dev on bounded | GAP vs Production; OK Dev/Test |
| Windows SIGINT | NOT VALIDATED | **OUT-OF-SCOPE** |
| Gate B `eos_gateb` | Forbidden | **BLOCKED** |

---

## 13. Production-Readiness Gap Assessment

**Do not mark the system Production Ready.**

| Area | Mark | Note |
| --- | --- | --- |
| Application startup | READY FOR FURTHER VALIDATION | Bounded path only |
| Health | READY FOR FURTHER VALIDATION | 200 evidenced |
| Readiness | READY FOR FURTHER VALIDATION | 200 evidenced |
| Shutdown | READY FOR FURTHER VALIDATION | POST trigger; not Windows SIGINT |
| Failure handling | GAP | Dual-path / migrate foot-gun |
| Schema integrity | GAP | 124-only ≠ full C-spine |
| Migration safety | GAP | Global migrate forbidden |
| Indexes/constraints | UNKNOWN on live `eos` beyond 124 file | |
| Transactions | READY FOR FURTHER VALIDATION (F2 tx helpers) | Mixed unproven on `eos` |
| Authentication | GAP | No Production IdP |
| Authorization | READY FOR FURTHER VALIDATION | Dev/Test |
| Secrets | GAP | Dev credentials in compose |
| Validation | READY FOR FURTHER VALIDATION | |
| Access controls | READY FOR FURTHER VALIDATION | Fail-closed flags |
| Durability | READY FOR FURTHER VALIDATION | F2 JSONB only on live `eos` |
| Consistency | GAP | Mixed vs F2 vs memory |
| Identifiers | READY FOR FURTHER VALIDATION | |
| Auditability | GAP | Not a complete commercial audit SoR |
| Logging | READY FOR FURTHER VALIDATION | Structured F2 lifecycle logs |
| Configuration | GAP | Dual startup modes |
| Deployment | **BLOCKED** | Production not authorized; ADR-0006 open |
| Environment separation | READY FOR FURTHER VALIDATION | production-like refuse |
| Monitoring | GAP | Health only |
| Error recovery | GAP | Bounded vs default |
| Determinism | READY FOR FURTHER VALIDATION | F2 trigger path |
| Failure modes | GAP | document migrate() risk |
| Setup docs | GAP | Need Day 2 operator bounded runbook |
| Known limitations | READY FOR FURTHER VALIDATION | This matrix |

---

## 14. Governance-Blocked Items

Do **not** implement in Days 2–7:

1. Production / UAT / Gate B / `eos_gateb` / `migrate()` of 001–123 on `eos`
2. Booking **authority** and booking-as-operating-capability completion (G-05-E)
3. KPI history; revenue; profit; FX (G-07-A)
4. F2-I12; thaw of frozen I1–I11 increments
5. SoR cutover; ingest channels; H-81; H-80 exit evidence
6. G-08-B as a general commercial-facts UI product
7. Windows SIGINT testing; H91 synthetic-row deletion
8. Inventing OR-04 numerical target / CPR numbers / 250k/20% as F2 rules
9. Unrelated architecture rewrites; E1 provider selection; ADR-0006 close

A P0/P1 item that is governance-blocked is **not implementation-ready**.

---

## 15. P0/P1 Implementation Queue

Ordered for Days 2–7. **AUTHORIZED** items only.

### P0 — AUTHORIZED

| ID | Gap | Complexity | Validation |
| --- | --- | --- | --- |
| P0-1 | Operator path: **always** bounded F2-DP-01 startup against `127.0.0.1:5432/eos`; refuse documenting default `migrate()` | SMALL (docs + fail-closed checks; no schema apply) | Existing decide tests; no live Production |
| P0-2 | Minimal operating UI for F2 opportunity facts (OR-01 qualification, ownership/follow-up already in API) on existing pipeline/opportunity surfaces | MEDIUM | Focused API+UI tests; no G-08-B shell |
| P0-3 | Do not regress F2 persist/hydrate/shutdown trigger | n/a preserve | Keep H-91 rows; re-run focused F2 tests |

### P1 — AUTHORIZED

| ID | Gap | Complexity | Validation |
| --- | --- | --- | --- |
| P1-1 | Minimal F2 fields on account, RFP (timestamps/clarification/first response), Path B, programme, rate identity — **embedded in existing pages** | MEDIUM | Per-map PUT/GET + UI |
| P1-2 | Server-side authz review on any new web→API calls; 401/403 behaviour | SMALL | Existing authorize tests + new route tests |
| P1-3 | Dual-path clarity: memory vs F2 JSONB when `dbPool` set; no silent mixed-PG writes against missing tables | MEDIUM | Fail-closed tests if mixed repo would hit missing relations |
| P1-4 | Focused web tests for operating workflows | MEDIUM | New vitest/playwright **only if** kept small; typecheck |
| P1-5 | Day 2–6 operator/runbook: bounded env, ports, no Gate B, no SIGINT Windows | SMALL | Docs only as later day artefacts |
| P1-6 | Isolate mixed 250k/20% from F2 generate **without substituting a number** (G-04-B) where still reachable | MEDIUM | Fail-closed tests |

### P0/P1 — NOT implementation-ready

| ID | Gap | Authority |
| --- | --- | --- |
| P0-G1 | Full C-spine PostgreSQL on `eos` | GOVERNANCE-BLOCKED (001–123) |
| P0-G2 | Booking operating capability | GOVERNANCE-BLOCKED |
| P0-G3 | KPI/revenue/profit/FX | GOVERNANCE-BLOCKED |
| P1-G1 | G-08-B standalone facts UI | GOVERNANCE-BLOCKED |
| P1-G2 | Default startup “made safe” by applying all migrations | GOVERNANCE-BLOCKED |

---

## 16. Seven-Day Dependency Graph

```text
H-111 Day 1 audit (this document)
        │
        ▼
P0-1 bounded operator path (docs/fail-closed)
        │
        ├──────────────► P0-3 preserve F2-DP-01 (no migrate 001–123)
        │
        ▼
P0-2 opportunity F2 operating UI ──depends on──► existing F2 APIs (done)
        │
        ▼
P1-1 embed remaining five maps in existing C1/C3/C4/C5 pages
        │
        ├─► P1-2 authz
        ├─► P1-3 dual-path fail-closed (no mixed schema)
        └─► P1-6 Path B vs mixed numerical isolation
                │
                ▼
P1-4 tests + P1-5 runbook
                │
                ▼
Day 7 readiness classification (COMPLETE / WITH FINDINGS / PARTIAL / NOT IMPLEMENTED / BLOCKED / DEFERRED)
        │
        ✕  P0-G1 full PG schema
        ✕  booking / KPI / ingest / Production / F2-I12 / H-81
```

---

## 17. Risks

1. **Migration foot-gun:** `npm run migrate -w @sedmc/db` on `eos` would apply ~120 files (H-87). High chance of accidental Production-like schema expansion. **Mitigation:** Day 2 fail-closed + runbook; never Gate B.
2. **Dirty tree:** uncommitted Class A/B code may compile against tables that do not exist on live `eos`. **Mitigation:** bounded path + in-memory mixed; fail-closed if durable mixed SQL runs.
3. **G-08-B creep:** building a new facts admin UI exceeds H-111. **Mitigation:** embed only in existing commercial pages.
4. **Booking UI temptation:** pages exist; completing them violates G-05-E.
5. **Invented rules:** OR-04, revenue, profit, FX, 250k/20% as F2 — fail-closed.
6. **Port 8080 occupied:** live validation used alternate ports; operators may think the API is down.
7. **H91 rows:** deleting them is excluded; tests must tolerate them.
8. **H-80 confusion:** shipping software ≠ adoption evidence.
9. **Windows SIGINT:** do not spend Day 2–7 on it.
10. **CI vs dirty tree:** unknown full-suite health; OOM historically required `--maxWorkers=1`.

---

## 18. Recommended Day 2–7 Sequence

| Day | Objective | In | Out |
| --- | --- | --- | --- |
| **2** | Lock operator runtime + first operating UI | P0-1, P0-3, start P0-2 (opportunity facts on pipeline/opportunity) | No migrate 001–123; no booking; no G-08-B app |
| **3** | RFP + Path B operating fields | P1-1 (C3/Path B), P1-6 | No numerical CPR |
| **4** | Account + programme + rate identity fields | P1-1 remainder | No cost-line freeze |
| **5** | Dual-path fail-closed + authz | P1-2, P1-3 | No mixed schema apply |
| **6** | Tests + runbook | P1-4, P1-5; focused F2 regression | No unrestricted Production; no Gate B |
| **7** | Readiness classification audit | Evidence only; no new scope | Classifications per H-111; not “95% complete”; not Production Ready |

---

## 19. Items That Cannot Safely Be Completed Under H-111

- Full mixed PostgreSQL C-spine on authorized `eos` (requires 001–123 / `schema_migrations` — separate POA).
- Production-ready authn (IdP), secrets, deploy, NATS/JetStream operations, monitoring.
- Booking as an operating EOS capability.
- Durable KPI history; revenue/profit/FX engines.
- Ingest / SoR cutover / F2-I12 / I1–I11 thaw.
- Windows-proven SIGINT lifecycle.
- UAT sign-off, H-81, H-80 exit, EOS adoption.
- Clean git history / commit of the 431-file dirty tree (commit not granted).
- Proving full `npm test` + CI on the dirty tree within seven days without a dedicated test-stabilization grant (UNKNOWN size).

---

## 20. Day-1 Conclusion

The authoritative engineering baseline for Days 2–7 is:

1. **Treat F2-DP-01 bounded Dev/Test API + migration 124 sidecar as the only evidenced durable commercial-facts path** on `127.0.0.1:5432/eos`.
2. **Treat mixed C1–C8 APIs and existing web pages as the operating shell**, completing **minimal F2 fields** there under H-111 §5.7 — not G-08-B.
3. **Do not** apply global migrations, complete booking, persist KPIs, thaw I1–I11, or claim Production readiness.
4. **P0 gaps that are buildable:** operator bounded path discipline; opportunity (and then sibling) F2 operating UI; non-regression of persist/shutdown.
5. **P0 gaps that are not buildable:** full PG SoR; booking authority; Production.
6. Seven-day outcome, if executed with discipline: **PARTIAL / COMPLETE WITH FINDINGS** Dev/Test operating core — **not** Production Ready, **not** H-80 exit, **not** H-81.

**STOP.** Day 1 implementation is **not authorized**. Next increment is Day 2 **only** under a separate execution prompt still bounded by H-111.

---

**End of H-111 Day 1 system gap matrix.**
