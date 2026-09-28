# H-111 Day 7 — Final Engineering Readiness Audit

> **`H-111 DAY 7 D7`**  
> **`FINAL ENGINEERING COMPLETION, REGRESSION & READINESS AUDIT`**  
> **`NOT UAT`** · **`NOT PRODUCTION AUTHORIZATION`** · **`NOT H-81`**  
> **`NOT EOS ADOPTION`** · **`NOT GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT H-80 EXIT`** · **`NOT SoR CUTOVER`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T17:45:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Companion executive report:** [`accelerated-build-day-7-final-report.md`](accelerated-build-day-7-final-report.md).

```text
DAY 7 STATUS = FINAL ENGINEERING AUDIT COMPLETE
ENGINEERING CLASSIFICATION = ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS
INCREMENT = EOS-7D-ACCEL
THIS INCREMENT MUST NOT BE CALLED F2-I12
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
UAT = NOT SIGNED OFF
GATE B / eos_gateb = NOT USED
```

This audit does **not** grant Production, UAT, Gate B, H-81, SoR cutover, F2-I12, I1–I11 thaw, booking, KPI history, revenue/profit/FX, Path D, G-08-B, Windows SIGINT experiment, H91 deletion, commit, or push.

H-111 §7 expected filenames `accelerated-build-day-7-report.md` and `accelerated-build-final-readiness-audit.md`. This D7 execution uses the Owner/POA prompt names (`…-final-report.md` and `…-final-readiness-audit.md`). Contents satisfy the same audit duty.

---

## 1. Authority and method

H-111 remains controlling. Day 7 is a **readiness audit**, not a feature increment.

Method:

1. Record repository state (dirty tree preserved; no reset/clean/stash/revert/commit/push).
2. Read H-111, Day 1 gap matrix and report, Days 2–5 reports, D6-T4 / D6-T5 / D6-T6 reports.
3. Inspect implementation and tests (commercial-facts routes/service/persist, bounded startup/shutdown, web panels, authorization).
4. Run the authorized focused regression suites. Do **not** run `migrate()`.
5. Distinguish **implemented** / **unit-or-focused tested** / **live API validated** / **live web-to-API validated**.
6. Classify remaining gaps as engineering, evidence, governance, environment/deployment, or intentionally out of scope.

**Not inferred:**

- Live validation from unit tests.
- Production readiness from Dev/Test validation.
- UAT from engineering validation.
- Full EOS database readiness from the 124-only sidecar slice.

---

## 2. Initial repository state (before Day-7 artefacts)

```text
git rev-parse HEAD
75ee4c3aabdcf5974f6a589f8c36a0b98727edba

git branch --show-current
master

git diff --cached --quiet
INDEX EMPTY

git status --porcelain
PORCELAIN = 458
```

No reset, clean, stash, revert, discard, or overwrite of unrelated dirty files. H91 synthetic residue was not deleted.

---

## 3. Authoritative evidence inventory

| Artefact | Present | Role |
| --- | --- | --- |
| `gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md` | **yes** | Controlling authorization (H-111-A) |
| `accelerated-build-day-1-system-gap-matrix.md` | **yes** | Day 1 requirements/gap baseline |
| `accelerated-build-day-1-report.md` | **yes** | Day 1 audit (no implementation) |
| `accelerated-build-day-2-report.md` | **yes** | Bounded path + Opportunity UI |
| `accelerated-build-day-3-report.md` | **yes** | RFP facts vertical (SOURCE/CHANNEL/timestamps/clarification) |
| `accelerated-build-day-4-report.md` | **yes** | D1 write-integrity (Opportunity/Account/Programme PUT) |
| `accelerated-build-day-5-report.md` | **yes** | D5-S1 read/write security on Opportunity + RFP panels |
| `accelerated-build-day-6-report.md` | **ABSENT** | H-111 §7 Day-6 filename was not created. Day 6 executed as T1/T4/T5/T6. This absence is recorded; contents are **not invented**. |
| `accelerated-build-day-6-t1-report.md` | **ABSENT** | D6-T1 PASS is recorded in later Day-6 reports only (verification-only; no dedicated file). |
| `accelerated-build-day-6-t4-report.md` | **yes** | Web TS2345 remediated |
| `accelerated-build-day-6-t5-live-integration-report.md` | **yes** | Live **API** integration |
| `accelerated-build-day-6-t6-web-live-integration-report.md` | **yes** | Live **web-to-bounded-API** integration |

Days 4 and 5 reports **exist**. They are not inferred.

---

## 4. What H-111 authorized vs what this audit covers

H-111 §5 authorized a seven-day **engineering** programme: audit, gap matrix, P0/P1 where requirements exist, persistence/API/UI for verified workflows, authz, tests, Dev/Test runtime, shutdown reliability (Windows SIGINT still forbidden), deployment documentation, and a final production-readiness **audit**.

H-111 did **not** authorize Production, UAT sign-off, Gate B, F2-I12, SoR cutover, or treating software completion as H-80 exit / H-81 / adoption.

The executed vertical slice (Days 2–6) is:

- Opportunity F2 commercial facts (OR-01) + operating UI.
- RFP F2 commercial facts (SOURCE ≠ CHANNEL, receipt/first-response/clarification) + operating UI.
- F2-DP-01 sidecar persist/hydrate on bounded Dev/Test `127.0.0.1:5432/eos`.
- Mixed-SQL fail-closed on that 124-only target.
- Identifier immutability and persist fail-closed on Opportunity/Account/Programme/RFP PUTs.
- Client Save-visibility that does not replace server `authorize()`.
- Bounded startup/shutdown + live API and live web-to-API validation.

That slice is **not** the entire EOS system and is **not** equivalent to mixed C-spine PostgreSQL readiness.

---

## 5. D7 focused regression (this audit)

Commands were run against the dirty worktree. Tests were **not** weakened. `migrate()` was **not** run.

### 5.1 Web

```text
cd apps/web
npx vitest run src/opportunity-commercial-facts-panel.test.tsx src/rfp-commercial-facts-panel.test.tsx
npx tsc -p tsconfig.json --noEmit
```

| Check | Result | Baseline |
| --- | --- | --- |
| Focused web tests | **24 passed / 2 files** | 24 passing |
| `tsc -p tsconfig.json --noEmit` | **0 errors** | 0 errors |

D6-T4 `useState<string>` remediation remains in place. No new web TypeScript errors.

### 5.2 API focused persistence/integrity

```text
cd apps/api
npx vitest run --maxWorkers=1 \
  src/f2-dp-01.write-integrity.test.ts \
  src/f2-dp-01.rfp-facts-put.test.ts \
  src/f2-dp-01.commercial-facts-persist.test.ts \
  src/f2-dp-01.mixed-sql-sidecar-only.test.ts
npx tsc --noEmit
```

| Check | Result | Baseline |
| --- | --- | --- |
| Focused API tests | **25 passed / 4 files** | 25 passing |
| `tsc --noEmit` | **0 errors** | 0 errors |

Breakdown: write-integrity **6** + RFP PUT **13** + persist **3** + mixed-SQL sidecar-only **3** = **25**.

### 5.3 Lifecycle

```text
npx vitest run --maxWorkers=1 \
  src/f2-dp-01.bounded-devtest-api-startup.test.ts \
  src/f2-dp-01.bounded-devtest-shutdown-observability.test.ts \
  src/f2-dp-01.bounded-devtest-shutdown-trigger.test.ts
```

| Check | Result | Baseline |
| --- | --- | --- |
| Lifecycle tests | **30 passed / 3 files** | 30 passing |

Breakdown: startup **14** + shutdown observability **9** + shutdown trigger **7** = **30**.

### 5.4 D7 totals

| Suite | Tests | Type-check |
| --- | --- | --- |
| Web focused | 24 passed | 0 errors |
| API focused | 25 passed | 0 errors |
| API lifecycle | 30 passed | (same API tsc) |
| **Focused total this audit** | **79 passed / 9 files** | **web 0 + api 0** |

Deviation from baseline: **none**.

This is **not** a full CI suite, not Playwright, and not the broader `apps/api` / kernel test corpus.

---

## 6. D6-T5 vs D6-T6 reconciliation

These are **different** validation classes. Live API success does **not** equal live web-to-API success.

### 6.1 D6-T5 — live API integration

Status: **PASS WITH FINDINGS — LIVE DEV/TEST INTEGRATED**.

Validated against actual `apps/api/src/main.ts` on `127.0.0.1:18115` with `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` and TCP `127.0.0.1:5432/eos`:

| Claim | Evidence |
| --- | --- |
| Bounded API live integration | `/health` `/ready` 200; named bounded startup log; `mixedSqlDurable=false`; `globalMigrateInvoked=false` |
| Sidecar persistence | Six tables present; Opportunity/RFP GET-PUT-GET; counts after 2/2/1/1/1/1 |
| Opportunity round-trip | Controlled `D6-T5-TEST-*` identity; sidecar upsert |
| RFP round-trip | Controlled RFP facts PUT/GET |
| Authentication / authorization | Unauthenticated 401; existing Dev login; `authorize()` not modified |
| SOURCE ≠ CHANNEL | Established on API path |
| OR-01 | `new_qualified` is not qualification |
| Deterministic shutdown | POST bounded-shutdown **202**; exit **0**; `listenerReleased=true` |
| Web integration | **STOPPED** in D6-T5 (Finding 3): existing Next `:3001` → default `:8080`; retarget would require stopping PID 36512 |

D6-T5 did **not** validate the browser UI against the bounded API.

### 6.2 D6-T6 — live web-to-API integration

Status: **PASS WITH FINDINGS — LIVE WEB-TO-BOUNDED-API INTEGRATED**.

Subsequently validated:

| Claim | Evidence |
| --- | --- |
| Existing `EOS_API_URL` mechanism | Isolated Next copy `%TEMP%\eos-d6-t6-web` `:3016` → `http://127.0.0.1:18115` |
| Browser Opportunity Save | UI PUT → bounded API → sidecar → reload retained next-action |
| Browser RFP Save | SOURCE Referral / CHANNEL Email; `sourceDistinctFromChannel=true` |
| Auth session | Dev sign-in; `/eos-api/v1/me` unauthenticated **401** |
| Identifier conflict | Conflicting body ids → **409** |
| OR-01 in UI | Qualification independent of `new_qualified` |
| Path B | Display GET `path-b-approval` only; no Path B write |
| API shutdown | POST **202**; exit **0**; listener released |

Not claimed by D6-T6:

- The long-running Next on `:3001` was **not** the validated web (it defaulted to `:8080`).
- Isolated Next was a **Dev/Test operational copy**, not a committed second-app architecture.
- Playwright / full CI.
- Account or Programme **web PUT**.
- Rate identity UI.
- Production or UAT.

### 6.3 Distinction required by this audit

```text
live API integration     = D6-T5  (HTTP against bounded main.ts)
live web-to-API integration = D6-T6  (browser :3016 → proxy → bounded API)
```

Do not collapse these into a single “live validated” cell except where both reports support it.

---

## 7. Final requirements matrix

Legend for **Final State** (H-111 §7): `COMPLETE` · `COMPLETE WITH FINDINGS` · `PARTIAL` · `NOT IMPLEMENTED` · `BLOCKED` · `DEFERRED`.

Live columns:

- **Live API** = D6-T5 evidence (or D6-T6 API-side confirmation).
- **Web live** = D6-T6 browser evidence.
- Blank / No = not evidenced at that class.

### 7.1 Commercial facts

| Capability | Implemented | Unit/Focused Tested | Live API | Web Live | Persistence | Governance Status | Final State |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Opportunity commercial facts GET/PUT | Yes — existing routes; Day 2 UI; Day 4 identifier/persist fail-closed | Yes — write-integrity + persist + mixed-SQL; web 11 opportunity tests | Yes — D6-T5/T6 GET-PUT-GET | Yes — D6-T6 Save + reload | Sidecar JSONB `f2_opportunity_facts` when persist enabled | H-111 authorized operating UI | **COMPLETE WITH FINDINGS** (process-local opportunity identity on 124-only DB) |
| RFP commercial facts GET/PUT | Yes — Day 3 consume existing PUT; immutable ids; persist fail-closed | Yes — 13 RFP PUT tests; web 13 RFP tests | Yes — D6-T5/T6 | Yes — D6-T6 SOURCE/CHANNEL Save | Sidecar `f2_rfp_facts` | H-111 authorized | **COMPLETE WITH FINDINGS** (same identity finding) |
| SOURCE | Yes — kernel SOURCE catalogue; not inferred from CHANNEL or legacy `rfp.source` | Yes — RFP PUT tests | Yes | Yes — Referral selected and persisted | Sidecar field | Requirements exist (H-29 / kernel) | **COMPLETE WITH FINDINGS** |
| CHANNEL | Yes — distinct kernel CHANNEL catalogue; `email` is CHANNEL not SOURCE | Yes | Yes | Yes — Email selected and persisted | Sidecar field | Requirements exist | **COMPLETE WITH FINDINGS** |
| Receipt timestamp (`receivedAt`) | Yes — explicit ISO; not synthesized; immutable once observed | Yes — RFP PUT tests | API path exists; D6-T6 left blank (not invented) | UI present; live left blank | Sidecar | Explicit fact; no mailbox ingest | **COMPLETE WITH FINDINGS** (no mailbox receipt entity — stopped as new rule) |
| First-response timestamp semantics | Yes — explicit ISO; not PUT-now; not inferred; negative interval rejected | Yes | Same as receipt | UI present; live left blank | Sidecar | Explicit fact | **COMPLETE WITH FINDINGS** (no first-response event stream beyond the observation field) |
| Clarification status + explicit events | Yes — status independent; events require type + `eventAt` | Yes | D6-T6 status `not_started`; no invented events | UI present | Sidecar | Requirements exist | **COMPLETE WITH FINDINGS** |
| OR-01 qualification | Yes — independent of `new_qualified`; no 250k/20% | Yes — mixed-SQL + web copy | Yes — `or01Qualified=false` after `new_qualified` | Yes — UI copy + status | Sidecar opportunity facts | H-29 / F2 | **COMPLETE WITH FINDINGS** |
| Path B display/read | Yes — GET `/v1/rfps/:id/path-b-approval` (not `/path-b`) | Focused mixed-SQL/persist cover sidecar map; no dedicated H-111 Path B write tests | D6-T6 GET `status=not_required` `recorded=false` | Display GET only | Sidecar `f2_path_b` | Path B write / mixed approval gate not expanded | **PARTIAL** (read/display only) |
| Account commercial facts | Yes — GET/PUT API; Day 4 identifier/persist fail-closed; type/market shown on opportunity when linked | Yes — write-integrity account tests | Not D6-T5/T6 primary path | No dedicated account F2 panel; type/market embed only | Sidecar `f2_account_facts` | G-08-B ungranted | **PARTIAL** |
| Programme commercial facts | Yes — GET/PUT API; Day 4 integrity; GET-only programme panel | Yes — write-integrity programme tests | Not D6-T5/T6 primary path | GET display only (Day 2 panel) | Sidecar `f2_programme_facts` | G-08-B ungranted | **PARTIAL** |
| Rate identity | API/preview maps exist (`rate-identity.ts`, sidecar `f2_rate_identities`) | Pre-H-111 F2-I6 preview tests exist in dirty tree | Hydration count observed; **no H-111 live write** | **STOPPED** — no H-111 UI | Sidecar map defined; not exercised as H-111 operating workflow | **STOPPED** (H-111 Day 2 stop; mixed supplier/costing not durable on 124-only) | **DEFERRED** (governance-gated stop + mixed-SQL dependency) |
| Persistence (F2-DP-01 sidecar) | Yes — six JSONB maps; `write*Facts` / `hydrateF2CommercialFacts` | Yes — persist 3 + mixed-SQL 3 | Yes — D6-T5/T6 row counts | Via API from UI | Sidecar-only on bounded path | Dev/Test coexistence only; Production/`eos_gateb` refused | **COMPLETE WITH FINDINGS** |
| Hydration | Yes — bounded startup hydrates six maps | Yes — startup tests; shutdown observability “does not change six-map hydration” | Yes — startup counts 1 then 2 then 3 on opp/rfp across T5/T6 | N/A (server) | In-memory overlay of sidecar | Bounded opt-in | **COMPLETE WITH FINDINGS** |
| Identifier immutability | Yes — conflicting body entity id / tenantId → 409 `*_immutable` | Yes — D1 + Day 3 RFP | Yes — D6-T6 409 | Exercised via API from D6-T6 | Path id authoritative | Fail-closed | **COMPLETE** |
| Conflict handling (persist throw) | Yes — 409 `f2_sidecar_persist_failed`; memory not updated | Yes — write-integrity + RFP PUT | Not live-injected failure | No | No mixed-SQL fallback | Fail-closed | **COMPLETE** (tested; not live-fault-injected) |
| Authorization (`authorize()`) | Yes — `pipeline:read/write:opportunity`; `rfp:read/write:rfp` | Yes — API 401 tests; D5-S1 web 403 mapping | Yes — D6-T5/T6 | Yes — session + 401 proxy | N/A | Server remains authoritative; `/v1/me` has no permission keys | **COMPLETE WITH FINDINGS** (write visibility may wait for observed PUT 403) |
| Unauthenticated access | Yes — all commercial-facts GET/PUT return 401 without principal | Yes — mixed-SQL test includes 401 | Yes — `/v1/me` and facts 401 | Yes — `/eos-api/v1/me` 401 `unauthenticated` | N/A | Fail-closed | **COMPLETE** |

### 7.2 Runtime

| Capability | Implemented | Unit/Focused Tested | Live API | Web Live | Persistence | Governance Status | Final State |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bounded startup | Yes — opt-in `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP`; exact `127.0.0.1:5432/eos` | Yes — 14 startup tests | Yes — D6-T5/T6 named branch | N/A | Sidecar hydrate only | Production-like / Gate B / stand-in refused | **COMPLETE WITH FINDINGS** (default `:8080` occupied; used `EOS_PORT=18115`) |
| Sidecar hydration | Yes — `runF2Dp01BoundedDevtestApiStartup` → `hydrateF2CommercialFacts` | Yes | Yes | N/A | Six maps | Bounded only | **COMPLETE WITH FINDINGS** |
| Migration isolation | Yes — bounded branch does not call global `migrate()` | Yes — startup tests assert no mixed/schema-history SQL | Yes — `globalMigrateInvoked=false`; `schema_migrations` absent | N/A | 124-only tables already present | 001–123 / 125+ **not authorized** on this DB | **COMPLETE** for bounded slice; **not** full schema readiness |
| Mixed-SQL isolation | Yes — `f2Dp01BoundedSidecarOnly` + `isMixedSqlDurable` | Yes — 3 mixed-SQL tests | Yes — `mixedSqlDurable=false`; no `opp_%`/`rfp_%` tables | Captions state sidecar not mixed C-spine | Mixed SQL **not** used as fallback | Intentional safety boundary | **COMPLETE** for fail-closed bounded path |
| Deterministic shutdown | Yes — loopback POST `/eos-devtest/f2-dp-01/bounded-shutdown` | Yes — trigger + observability | Yes — 202, exit 0, listener released (T5 and T6) | Isolated Next stopped via SIGTERM (web process, not API SIGINT) | Pool end observed | Windows SIGINT experiment **not authorized** | **COMPLETE WITH FINDINGS** |
| Listener release | Yes — observability `listenerReleased` | Yes | Yes — `:18115` released | Isolated `:3016` released | N/A | API used POST; not SIGINT | **COMPLETE WITH FINDINGS** |
| Process exit | Yes — successful close → exit 0 | Yes — observability tests | Yes — API exit 0 | Isolated Next SIGTERM expected | N/A | Finding: PID 36512 later observed dead (cause unknown) | **COMPLETE WITH FINDINGS** |
| Web-to-API connectivity | Existing `/eos-api` proxy + `EOS_API_URL` | Web unit tests mock client | Health match T6 | Yes — CASE B isolated Next `:3016` | Via proxy | Default `:3001`→`:8080` not the validated path | **COMPLETE WITH FINDINGS** (isolated copy; Next 16 lock; hydration overlay) |

### 7.3 Web

| Capability | Implemented | Unit/Focused Tested | Live API | Web Live | Persistence | Governance Status | Final State |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Opportunity panel | Yes — `/commercial/pipeline/[id]` + `OpportunityCommercialFactsPanel` | Yes — 11 tests | Via D6-T6 | Yes | Sidecar through API | Not G-08-B | **COMPLETE WITH FINDINGS** |
| RFP panel | Yes — `/commercial/rfps/[id]` + `RfpCommercialFactsPanel` | Yes — 13 tests | Via D6-T6 | Yes | Sidecar through API | Not G-08-B | **COMPLETE WITH FINDINGS** |
| Authentication / session | Existing `EosSessionProvider` Dev login; D6-T4 `useState<string>` only | Session types compile; live T6 sign-in | Login 200 | Yes — Sign out visible | Process-local identity tokens | Dev/Test credentials; not Production IdP | **COMPLETE WITH FINDINGS** |
| `/v1/me` | Existing; **no permission keys** (unchanged) | Not expanded | Unauth 401; auth keys `id,tenantId,actorType,displayName,email,roles` | Proxy 401 unauthenticated | N/A | D5-S1: do not invent permission API | **COMPLETE WITH FINDINGS** (permissions absent by design) |
| Authorization (UI) | D5-S1 `commercialFactsCanWrite` + PUT 403 mapping; UI hide ≠ authz | Yes — 8 D5-S1 tests | Server 403/401 | Live used authorized carol.admin | N/A | Server `authorize()` authoritative | **COMPLETE WITH FINDINGS** |
| API error handling (client) | `mapCommercialFactsPutFailure`; 403 vs other errors | Yes | 409 live for id conflict | Save success path live; 403 hide tested in unit | Facts not locally persisted on reject | Fail-closed | **COMPLETE WITH FINDINGS** |
| TypeScript status | Web `tsc` 0 errors after D6-T4 | D7 reconfirmed 0 | N/A | N/A | N/A | Pre-existing TS2345 remediated; file was already dirty | **COMPLETE** |

---

## 8. Implemented vs tested vs live validated

| Class | Meaning used here |
| --- | --- |
| Implemented | Source exists in the worktree and is wired on the authorized path |
| Unit/focused tested | D7 (or cited Day) vitest evidence |
| Live API | D6-T5 (and T6 API-side) against real `main.ts` + 124-only `eos` |
| Live web-to-API | D6-T6 browser against isolated Next → bounded API |

Examples of **not** inferring live from tests:

- Account/Programme PUT integrity is **tested**, not web-live.
- Persist-failure 409 is **tested**, not live-fault-injected.
- Bounded startup production-like refuse is **tested**, not run in a production-like env (forbidden).
- Path B write is **not** implemented as an H-111 operating write; GET display is live.

---

## 9. Security / authorization review

Inspected: `commercial-facts/routes.ts`, `service.ts` (opportunity/RFP), `account.ts`, `programme.ts`, `bounded-startup.ts`, `bounded-shutdown-trigger.ts`, `persist.ts` (`f2Dp01PersistDecision`), D5-S1 client helpers, D6-T5/T6 evidence.

| Control | Position |
| --- | --- |
| Unauthenticated access | Commercial-facts GET/PUT require principal; otherwise **401** `unauthenticated`. Confirmed live D6-T5/T6 including `/v1/me` and web proxy. |
| Authorization checks | Server `authorize()` with `pipeline:read/write:opportunity` and `rfp:read/write:rfp` (and corresponding account/programme permissions on those PUTs). Not redesigned. |
| Object identifier manipulation | Path id is authoritative. Conflicting body `opportunityId` / `rfpId` / `accountId` / `programmeId` / `id` → **409** `*_immutable`. Live 409 on Opportunity and RFP in D6-T6. |
| Conflicting identifiers | Same 409 family; matching body id ignored as a write target (not rewritten). |
| Mutation authorization | PUT requires write permission. UI Save hide after PUT 403 is **not** authorization. |
| Immutable identifiers | Entity ids and `tenantId` not rewritten from body. Observed `receivedAt` / `firstResponseAt` remain immutable once set (Day 3 tests). |
| Fail-closed persist | Sidecar throw → 409 `f2_sidecar_persist_failed`; memory map not updated; mixed SQL not a fallback. |
| Production-like environment rejection | Bounded startup refuses `production_like_not_authorized`. Persist refuses `production_not_authorized` and `eos_gateb_not_authorized`. Shutdown trigger refuses `production_like_not_authorized`. |
| Bounded startup restrictions | Exact host/port/database; opt-in required; Gate B / stand-in / ambiguous opt-in refused (14 tests). |
| Loopback shutdown restrictions | Trigger allow only bounded + loopback listen + loopback remote; otherwise 403. Windows SIGINT experiment not performed. |

Authentication was **not** redesigned. `/v1/me` was **not** given permission keys.

---

## 10. Database / persistence review

| Check | Evidence |
| --- | --- |
| Six F2-DP-01 sidecar maps | `f2_opportunity_facts`, `f2_rfp_facts`, `f2_path_b`, `f2_account_facts`, `f2_rate_identities`, `f2_programme_facts` — repository + D6-T5 pre-check |
| JSONB persistence | Upsert/select payload columns; D6-T5/T6 field round-trip |
| Hydration | `hydrateF2CommercialFacts` loads all six maps; live startup counts |
| Field-level round-trip | Opportunity `nextAction` / OR-01; RFP SOURCE/CHANNEL live |
| Sidecar-only mode | `store.f2Dp01BoundedSidecarOnly`; `isMixedSqlDurable = isDurableSoR && !sidecarOnly` |
| Mixed SQL not represented as durable | Envelope `mixedSqlDurable=false`; UI caption “not mixed PostgreSQL C-spine” |
| Identifiers immutable | 409 live + tests |
| H91 synthetic residue | D6-T5/T6: H91 marker **preserved**; not deleted |
| Unauthorized migrations | D6-T5/T6: `schema_migrations` **absent**; no `opp_%`/`rfp_%`; 001–123 / 125+ not applied; D7 did not run `migrate()` |

`f2Dp01PersistDecision` remains Dev/Test coexistence only.

---

## 11. Explicit mixed-SQL limitation

The validated live database is **124-only** `127.0.0.1:5432/eos`:

- Six F2 sidecar tables exist.
- `schema_migrations` is **absent**.
- Mixed C-spine tables (`opp_%`, `rfp_%`, and the broader 001–123 set) are **not** present.
- Bounded startup **intentionally** does not apply 001–123.
- Mixed SQL is **fail-closed** when `f2Dp01BoundedSidecarOnly` is set. It is **not** a durable fallback.

**The existing broader mixed PostgreSQL C-spine is not deployable against the validated 124-only database.**

The bounded F2-DP-01 slice is **not equivalent** to full EOS database readiness. Opportunity/RFP **HTTP identity** on this target is process-local; sidecar facts survive restart, mixed entities do not. H91 sidecar rows are not HTTP-listed as pipeline opportunities without mixed identity (D6-T5 Finding 2).

Default (non-bounded) startup still has a migrate-without-flag foot-gun; that architecture was left unchanged by design. Operators must not run `npm run migrate` / `migrate()` against this 124-only `eos`.

---

## 12. Worktree / change audit

HEAD `75ee4c3` is unchanged throughout H-111 Days 1–7. Index empty. Dirty tree preserved.

Day 1 recorded porcelain **431** after the H-111 authorization file and **433** after the Day 1 matrix + report. D6-T6 ended at **458**. This audit adds the two Day-7 artefacts only.

Do **not** treat the ~430 pre-existing dirty files as Day-7 implementation.

### A. Pre-existing dirty files (not H-111 Days 1–7 implementation)

The large remainder of the dirty tree (ADR-0006 / E1-B/C/D, Gate B harness, I4/DLQ, CRM persistence, deployment-config, Class A/B recovery tests, F2-I2–I11 preview tests, and other uncommitted work present at Day 1 porcelain **431**). These files may still appear `M` or `??`. They were **not** reset and are **not** claimed as Day-7 work.

Notable already-dirty file with a **later two-line H-111 remediation**:

| File | Representation |
| --- | --- |
| `apps/web/src/components/commercial/EosSessionProvider.tsx` | **Already dirty** before Day 2. Days 2–5 **did not** edit it. D6-T4 added only `useState<string>` on `formEmail` and `password` to fix TS2345 exposed by broader verification. Not a commercial-facts or authz-model change. |

F2-DP-01 persist, bounded startup/shutdown, and six sidecar maps **predate** H-111 (H-91 / H-94 / H-106). H-111 **consumed and extended** them (sidecar-only flag, mixed-SQL fail-closed, persistence envelope, write-integrity, live validation). The untracked `apps/api/src/commercial-facts/` directory contains both that prior F2 work and H-111 edits; git cannot split the directory because the whole tree is untracked.

### B. H-111 implementation changes (Days 2–6; not Day 7)

Day 7 added **no** application code.

**New in the H-111 programme (untracked among the dirty tree):**

- `apps/api/src/f2-dp-01.mixed-sql-sidecar-only.test.ts`
- `apps/api/src/f2-dp-01.rfp-facts-put.test.ts`
- `apps/api/src/f2-dp-01.write-integrity.test.ts`
- `apps/web/src/app/commercial/pipeline/[id]/`
- `apps/web/src/components/commercial/OpportunityCommercialFactsPanel.tsx`
- `apps/web/src/components/commercial/RfpCommercialFactsPanel.tsx`
- `apps/web/src/components/commercial/ProgrammeCommercialFactsPanel.tsx`
- `apps/web/src/lib/commercial-facts-api.ts`
- `apps/web/src/opportunity-commercial-facts-panel.test.tsx`
- `apps/web/src/rfp-commercial-facts-panel.test.tsx`
- `apps/web/vitest.config.ts`

**Modified under H-111 intent (several already dirty/tracked):**

- Mixed-SQL fail-closed callers: `durable.ts` (untracked), `store.ts`, `bounded-startup.ts`, `persist.ts`, `pipeline/opportunity.ts`, `rfp/rfp.ts`, `programme/programme.ts`, `costing/sheet.ts`, `commercial-approval/approval.ts`, `commercial-documents/service.ts`, `crm/events.ts`, `main.ts`, `.env.example`
- Day 3–4 service/account/programme identifier + persist fail-closed
- Web pipeline/RFP/programme pages, `pipeline-api.ts`, `apps/web/package.json`, `apps/web/tsconfig.json`
- D6-T4: two type annotations on already-dirty `EosSessionProvider.tsx`

### C. Governance / evidence artefacts

- `docs/governance/gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`
- Day 1 matrix + Day 1–5 reports
- `accelerated-build-day-6-t4-report.md`
- `accelerated-build-day-6-t5-live-integration-report.md`
- `accelerated-build-day-6-t6-web-live-integration-report.md`
- This file and `accelerated-build-day-7-final-report.md`

`accelerated-build-day-6-report.md` was **not** created.

---

## 13. Production-readiness assessment

This is an **assessment**. It does **not** authorize Production.

| Topic | Position | Gap class |
| --- | --- | --- |
| Build / type safety | Web and API `tsc` **0 errors** on D7 | None for the slice |
| Focused tests | 79/79 authorized focused tests passed | Evidence gap for full CI / Playwright / broader API corpus |
| Runtime integration | Live API (T5) and live web-to-API (T6) with findings | Environment/deployment: default 8080 occupied; Next lock; isolated copy |
| Persistence | Sidecar JSONB round-trip live; mixed SQL fail-closed | Engineering: 124-only ≠ full schema |
| Authentication | Dev/Test local password; live 401/login | Environment/deployment: not Production IdP |
| Authorization | Server `authorize()`; live 401/409; D5-S1 UI | Evidence: write grant not discoverable from `/v1/me` |
| Migration strategy | Bounded path isolates migrate(); 001–123 unapplied | Engineering + governance: no authorized Production migration plan executed |
| Database schema completeness | Six sidecar tables only on validated DB | Engineering: mixed C-spine **not deployable** here |
| Deployment configuration | `.env.example` bounded warning; `EOS_PORT` / `EOS_API_URL` | Evidence/ops: operator runbook **partial** (Day 2 P1-5) |
| Observability | Bounded startup/shutdown logs; request_completed | Evidence gap vs Production observability stack |
| Error handling | 401/403/409 fail-closed; client PUT mapping | Findings: isolated React hydration overlay (`Shell.tsx` line 232) not remediated |
| Backup / recovery evidence | Not produced as H-111 evidence for sidecar+identity together | Evidence gap (pre-existing Class A/B work exists in dirty tree; **not** claimed as H-111 Production backup proof) |
| Operational runbook | `.env.example` + Day 2–6 reports | Evidence gap — not a Production runbook |
| Security controls | Loopback shutdown; production-like refuse; no auth redesign | Governance + evidence: no Production security sign-off |
| UAT coverage | **None.** D6-T6 is Dev/Test engineering validation | Governance gate |
| Production migration plan | **Not authorized; not written as an executable Production plan** | Governance gate + engineering (001–123 still unapplied on the live target) |
| Rollback strategy | Bounded shutdown works for Dev/Test process; no Production rollback plan | Governance + evidence |

For every missing Production item above: **do not invent evidence**.

---

## 14. What would still be required before UAT

UAT is **not** granted by this audit. Engineering/evidence items that would still stand in front of any future UAT decision (without converting gated items into “failures”):

1. Owner/POA UAT authorization (governance).
2. A UAT environment that is **not** this 124-only bounded `eos` unless UAT is explicitly scoped to the sidecar slice only.
3. Durable mixed identity **or** an explicit UAT rule that process-local identity is acceptable (today it is a documented limitation).
4. Operator procedure for web→API targeting without relying on an isolated `%TEMP%` copy (Next lock / default 8080).
5. Resolution or accepted waiver of the `Shell.tsx` hydration overlay.
6. UAT scripts/journeys covering Opportunity + RFP facts, 401/403/409, SOURCE ≠ CHANNEL, OR-01 — **not** inferred from D6-T6.
7. Clear exclusion of mailbox/Excel/WhatsApp/phone ingest, booking, KPI history, revenue/profit/FX unless separately authorized.
8. Rate identity remains STOPPED unless separately authorized.

---

## 15. What would still be required before Production

Production is **not** authorized. Items that would still be required before any future Production decision:

1. Separate Owner/POA Production authorization (H-111 §8: prepare ≠ authorize).
2. Authorized migration strategy for the real Production schema (001–123 + 124 + later) — **not** `migrate()` against the validated 124-only Dev/Test DB.
3. Schema completeness equivalent to the mixed C-spine the rest of EOS expects — the current live target does **not** provide it.
4. Production identity, secrets, and non-bootstrap credentials.
5. Deployment topology (not loopback-only shutdown as a Production control surface).
6. Backup/restore evidence for the chosen SoR.
7. Observability, rollback, and operational runbook at Production standard.
8. UAT sign-off (separate).
9. H-80 remains ACTIVE; H-81 NOT STARTED — commercial adoption / SoR cutover remain independent.
10. Gate B / `eos_gateb` remain unauthorized unless separately granted.

---

## 16. GREEN / AMBER / RED / GOVERNANCE-GATED

### GREEN — Implemented and validated

Only where implementation **and** focused tests **and** (for runtime/UI) live evidence exist:

- Opportunity F2 commercial facts GET/PUT + operating UI (live web-to-API).
- RFP F2 commercial facts GET/PUT + SOURCE ≠ CHANNEL + operating UI (live web-to-API).
- OR-01: `new_qualified` is not qualification (live).
- Unauthenticated **401**; conflicting identifiers **409** (live).
- F2-DP-01 sidecar persist/hydrate for Opportunity/RFP (live).
- Mixed SQL **not** used as fallback on 124-only `eos` (live + tests).
- Bounded startup opt-in/fail-closed (tests + live).
- Deterministic loopback shutdown, listener release, API exit 0 (tests + live).
- Web focused 24 + API focused 25 + lifecycle 30; web/api `tsc` 0 errors.
- D6-T4 TypeScript remediation.

Findings attached to several GREEN items are recorded in AMBER where they limit operational generality.

### AMBER — Implemented/tested but live or broader evidence incomplete

- Account commercial-facts PUT integrity (tested; not web-live).
- Programme commercial-facts PUT integrity (tested; GET UI only; not web PUT live).
- Path B **display GET** (live GET; no write).
- Receipt / first-response / clarification **UI and rules** (tested; live left timestamps/events blank — correctly not invented).
- Persist-failure 409 (tested; not live-fault-injected).
- Web-to-API via **isolated Next copy** rather than the default `:3001` process.
- React hydration overlay on isolated Next (`Shell.tsx`).
- Process-local mixed identity on 124-only DB (live finding).
- Operator runbook / deployment docs (partial `.env.example`).
- Default `8080` occupied by unrelated PID; bounded API on `18115`.
- PID 36512 observed dead after T6 API shutdown without this programme issuing Stop-Process (cause unknown).
- Day 6 unified report file absent (T1/T4/T5/T6 used instead).
- Broader API/CI/Playwright not run as D7 evidence.

### RED — Not implemented or technically blocked

- Full mixed PostgreSQL C-spine **on the validated 124-only database** (technically blocked by intentional isolation; not a test failure).
- HTTP listing of H91 sidecar rows as pipeline opportunities without mixed identity tables.
- Mailbox / ingest-backed receipt or first-response event stream (not invented; technically absent).
- Path B **write** / mixed `evaluateCommercialApprovalGate` change (not in H-111 executed slice).
- Dedicated account F2 admin UI.
- Programme F2 **write** UI.
- `scripts/dev-preview.mjs` as a bounded-sidecar starter (`EOS_SEED_DEMO` incompatible).

Rate identity is listed under GOVERNANCE-GATED (stopped), not converted solely into a technical failure, while noting the mixed supplier/costing durability dependency.

### GOVERNANCE-GATED — Not authorized

Do **not** convert these into technical failures:

- Production deployment / Production migration
- UAT sign-off
- Gate B / `eos_gateb`
- F2-I12
- I1–I11 thaw
- SoR cutover
- Mailbox / Excel / WhatsApp / phone ingestion
- Booking capability / authority
- KPI history
- Revenue / profit definitions / FX
- Path D maturity determination
- G-08-B general commercial-facts admin console
- Windows SIGINT experiment
- Deletion of H91 synthetic residue
- H-81 (NOT STARTED)
- H-80 exit (H-80 ACTIVE)
- Commit / push
- Rate identity **STOPPED** for this programme
- Unrelated architecture rewrite

---

## 17. Known findings (roll-up)

1. Default API port **8080** occupied (unrelated PID 17868). Bounded API used **18115**.
2. Opportunity/RFP HTTP identity is **process-local** on 124-only `eos`; sidecar facts are durable; H91 rows not HTTP-reachable as pipeline entities.
3. D6-T5 web path initially **stopped**; D6-T6 unblocked via isolated Next + `EOS_API_URL`, not by retargeting `:3001`.
4. Next 16 refuses a second `next dev` in `apps/web`.
5. Isolated Next is an operational copy, not committed architecture.
6. PID 36512 observed **DEAD** after T6 API shutdown without authorized kill; cause unknown; not restarted.
7. React hydration overlay from existing `Shell.tsx` line 232; login/save still completed; not remediated.
8. `dev-preview.mjs` unsafe for bounded sidecar (`EOS_SEED_DEMO`).
9. `/v1/me` has no permission keys; Save may remain visible until PUT 403 (D5-S1, by design).
10. Unified Day-6 report file **absent**.
11. Mixed C-spine **not** equivalent to this slice.
12. Rate identity STOPPED.
13. Expected Dev/Test warnings (in-memory transport, dev-outbox, loopback, bootstrap secrets).

Findings **do not** authorize Production. They **do** prevent claiming “entire EOS complete.”

---

## 18. Final engineering classification

```text
ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS
```

**Why this classification (H-111 engineering scope only):**

The authorized vertical slice — Opportunity and RFP commercial facts, SOURCE ≠ CHANNEL, OR-01, sidecar persist/hydrate, mixed-SQL fail-closed, identifier immutability, unauthenticated 401, bounded startup/shutdown, and live API plus live web-to-API validation — is **implemented, focused-tested, and Dev/Test-validated**.

It is **not** classified as `ENGINEERING SCOPE COMPLETE FOR AUTHORIZED H-111 VERTICAL SLICE` without qualifier because documented limitations are material: 124-only DB ≠ mixed C-spine; process-local identity; isolated web copy; Path B/account/programme web writes incomplete; rate identity stopped; Day-6 unified artefact absent; hydration overlay; port/proxy operator friction.

It is **not** `ENGINEERING SCOPE NOT COMPLETE`: the authorized Days 2–6 slices passed (with findings), D7 regression matched baseline, and this audit did not find a failed required test.

This classification is **not** UAT approval, Production authorization, H-81 completion, EOS adoption, SoR cutover, or overall company software completion.

---

## 19. Stop condition

Day 7 created this audit and the companion final report. No further implementation cycle is started. No commit. No push. No H-113. H-80/H-81 unmodified.

---

**End of H-111 Day 7 final readiness audit.**
