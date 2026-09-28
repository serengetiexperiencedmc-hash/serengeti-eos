# H-117 — Formal UAT execution report

> **TECHNICAL UAT EXECUTION** · **NOT HUMAN UAT SIGN-OFF** · **NOT PRODUCTION** · **NOT H-80 EXIT** · **NOT H-81 ADOPTION** · **NOT SoR CUTOVER**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Classification:** `H-117 UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED`

Application-code change this tranche: **ZERO**. Defects were recorded, not repaired.

---

## 1. Authorization basis

Owner/POA explicitly authorized **H-117 Formal UAT execution only**, after H-116 `READY WITH DOCUMENTED LIMITATIONS`.

Governing package (scope not redefined):

- `docs/governance/h-116-uat-readiness-matrix.md`
- `docs/governance/h-116-uat-scenario-catalogue.md`
- `docs/governance/h-116-uat-entry-criteria.md`
- `docs/governance/h-116-uat-data-plan.md`
- `docs/governance/h-116-uat-readiness-report.md`

Also used: H-115 audit, H-114 Rate Identity evidence, H-112 full-schema evidence, prior lifecycle/shutdown evidence.

This action is **not** authorization for Production deployment/migration/data, Gate B / `eos_gateb`, H-80 exit, H-81 adoption, SoR cutover, mailbox/Excel/WhatsApp ingestion, booking, KPI history, revenue/profit definitions, FX, or unresolved Rate Identity policies.

---

## 2. UAT environment identity

Recorded in `docs/governance/h-117-evidence/uat-environment-identity.json`.

| Item | Value |
| --- | --- |
| Database host | `127.0.0.1` |
| Database/catalog | `eos_h117_uat` on published port **5436** |
| Container | `serengeti-eos-h117-uat-pg` (`postgres:16-alpine`), user `eos_h117` |
| Migration state | 120 rows in `schema_migrations`; `db/schema.sql` … `migrations/124_f2_dp01_commercial_facts.sql`; numbering hole `112`–`116` |
| API endpoint | `http://127.0.0.1:18117` |
| Web endpoint | `http://127.0.0.1:3017` |
| Startup mode | Default Dev/Test full-schema path: `EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP` **unset**, bounded opt-in **unset**, `EOS_SEED_DEMO=false`, `EOS_ENV=development` |
| Env vars (non-secret) | `EOS_LISTEN_HOST=127.0.0.1`; `EOS_PORT=18117`; `EOS_DATABASE_URL` → redacted `postgres://127.0.0.1:5436/eos_h117_uat`; web `EOS_API_URL=http://127.0.0.1:18117` |
| Test users | Carol `carol.admin@sedmc.local` / `platform.admin`; Alice `alice.finance@sedmc.local` / `finance.member`; tenant `sedmc`; passwords from `.env.example` only (not copied here) |
| Synthetic-data namespace | Codes `UAT-OPP-001`, `UAT-RFP-001`, `UAT-SUP-001`, `UAT-SGL`; names `UAT Synthetic *` |
| UAT initialization | Container created 2026-09-21 ~16:38Z; migrate applied 120 files; API `api_listening` 2026-09-21T16:41:26.534Z |

`EOS_ENV=uat` is a **production-like** flag in this codebase and is refused. Formal UAT therefore ran with `EOS_ENV=development` against a **UAT-named isolated catalog**, not by setting `EOS_ENV=uat`.

---

## 3. Environment isolation evidence

**Did not alter:** `127.0.0.1:5432/eos` or `127.0.0.1:5435/eos_h112_full`.

Pre/post controls:

- `eos`: `to_regclass('public.schema_migrations')` **NULL** (124-only preserved).
- `eos_h112_full`: still **120** migration rows.
- Gate B container remained running and unused (`127.0.0.1:5434`).
- CLI migrate against `eos` refused `h111_eos_124_only_preserved` (exit 1, no apply).

Fail-closed H-112 named-branch decisions (`h-117-evidence/uat-01-isolation-decisions.json`):

| Target | Decision |
| --- | --- |
| `127.0.0.1:5436/eos_h117_uat` + H-112 flag | **refuse** `listen_port_not_approved` |
| `127.0.0.1:5432/eos` + H-112 flag | **refuse** `bounded_eos_not_authorized` |
| `127.0.0.1:5434/eos_gateb` + H-112 flag | **refuse** `eos_gateb_not_authorized` |
| `EOS_ENV=uat` + H-112 flag | **refuse** `production_like_not_authorized` |
| H-112 flag + `eos_h112_full` | would enter `full_schema` — **UAT did not set this URL** |
| No H-112 flag + UAT catalog | `default` — **authorized H-117 runtime** |

The H-112 named branch cannot target a UAT-named catalog or port 5436 without an application change. That change was **not** made. Isolated UAT used the existing default Dev/Test migrate+hydrate+`dbPool` path. Mixed SQL durable: restart hydrate `suppliers:1` `rates:1`; sidecar persist `mode: f2_dp01_sidecar`, `mixedSqlDurable: true`.

---

## 4. Migration state

`npm run migrate -w @sedmc/db` against **only** `eos_h117_uat` applied the validated chain (`productionReady: false`). First API start logged `database_migrated` `applied: []` (idempotent). Restart again `applied: []`.

UAT sidecar after writes (pre-restart):

| Table | Count |
| --- | --- |
| `f2_account_facts` | 1 |
| `f2_opportunity_facts` | 1 |
| `f2_rfp_facts` | 1 |
| `f2_path_b` | 1 |
| `f2_programme_facts` | 1 |
| `f2_rate_identities` | 12 |

---

## 5. Test-data identity

Synthetic only, created during execution by Carol (except 401/403). No Production/customer/employee/financial copy. No copy of H-91 residue from `eos`.

| Label | Runtime id |
| --- | --- |
| organizationType `corporate` | `6a52fa1d-3310-4c91-bf63-cd315b124539` (GET after hydrate) |
| ORG-UAT-001 | `4f477993-d531-4c52-a4ef-e45a76b7a686` |
| ACC-UAT-001 | `f07a8d59-3a24-4fee-beef-1f7d1cf10853` |
| OPP-UAT-001 | `fdf1a820-4e31-4379-a77a-190d7e5f2f67` |
| RFP-UAT-001 | `e94c4561-5d7c-4cb4-855c-f5dc803848c9` |
| PRG-UAT-001 | `eb60f5b2-a2b3-48ca-8d80-79ebefdc9bd6` |
| SUP-UAT-001 | `433bd5f0-2357-4d4d-b61d-d4715df2770d` |
| RATE-UAT-001 | `7d50bfb4-419a-4638-96e8-135e7d823a78` |

See `h-117-evidence/uat-ids.json`.

---

## 6. Scenario execution summary

All H-116 catalogue IDs were executed (mandatory and the two OPTIONAL negatives). Restart scenarios shared **one** process bounce (UAT-REC-01) as the catalogue allows.

No scenario was silently skipped. Governance exclusions were recorded as **GOVERNANCE**, not FAIL.

---

## 7. Detailed results

| Scenario | Result | Evidence | Defect | Classification | Notes |
| -------- | ------ | -------- | ------ | -------------- | ----- |
| UAT-01 env/access/isolation | PASS | identity JSON; isolation JSON; startup log; web Ready | — | — | Isolated catalog; H-112 flag cannot target it |
| UAT-AUTH-01 | PASS | wave1 | — | — | 200 token present (not copied) |
| UAT-AUTH-02 | PASS | wave1 | — | — | 401, no token |
| UAT-AUTH-03 | PASS | wave1 | — | — | 401 |
| UAT-AUTH-04 | PASS | wave1 | — | — | Alice 403 GET and PUT overlay |
| UAT-ACC-01 | PASS | wave1 | — | — | Org+account 201; PG type id |
| UAT-ACC-02 | PASS | wave1; web account PNG | — | — | Name match |
| UAT-ACC-03 | PASS | wave1; web account PNG | — | — | PCO ≠ market; independents true |
| UAT-ACC-04 | PASS | wave2; restart hydrate accounts=1 | H117-D-01 | DATA/ENVIRONMENT | Wrapper exit 1; facts survived |
| UAT-OPP-01 | PASS | wave1 | — | — | 201 |
| UAT-OPP-02 | PASS | wave1; web opportunity PNG | — | — | Code + owner |
| UAT-OPP-03 | PASS | wave1; UI stage ≠ qualification | — | GOVERNANCE (250k/20%) | `not_yet_assessed` vs `rfp_received` |
| UAT-OPP-04 | PASS | wave1 | — | — | Next action round-trip |
| UAT-OPP-05 | PASS | wave1 | — | — | 409 immutable |
| UAT-OPP-06 | PASS | wave2 | H117-D-01 | DATA/ENVIRONMENT | Same restart |
| UAT-RFP-01 | PASS | wave1 | — | — | 201 |
| UAT-RFP-02 | PASS | wave1; web RFP PNG | — | — | SOURCE referral ≠ CHANNEL email |
| UAT-RFP-03 | PASS | wave1 | — | — | Explicit receipt; first-response not invented |
| UAT-RFP-04 | PASS | wave1 | — | — | `not_started`; no extra events |
| UAT-RFP-05 | PASS | wave1; UI Path B | — | GOVERNANCE (KPI/revenue) | Category round-trip; no sell-price fields |
| UAT-RFP-06 | PASS | wave2 | H117-D-01 | DATA/ENVIRONMENT | Same restart |
| UAT-RFP-07 | PASS | wave1 | — | — | OPTIONAL 401 |
| UAT-PRG-01 | PASS | wave1 | — | — | 201 |
| UAT-PRG-02 | PASS | wave1; web programme PNG | — | GOVERNANCE (profit/freeze) | `rfpObserved` true; sell-price-not-revenue |
| UAT-PRG-03 | PASS | wave2 | H117-D-01 | DATA/ENVIRONMENT | Same restart |
| UAT-RI-01 | PASS | wave1 PUT identity | — | GOVERNANCE (winner/FX) | Overlay TZS; mixed 250 USD |
| UAT-RI-02 | PASS | wave1 | — | — | identities length 1 at that step |
| UAT-RI-03 | PASS | wave1 | — | — | v1 TZS unchanged; v2 EUR |
| UAT-RI-04 | PASS | wave1 | — | — | 409 `version_identity_exists` |
| UAT-RI-05 | PASS | wave2; hydrate rates=12 | H117-D-01 | DATA/ENVIRONMENT | Same restart |
| UAT-RI-06 | PASS | wave1 | — | — | 401 |
| UAT-RI-07 | PASS | wave1 | — | — | Three 400s |
| UAT-RI-08 | PASS | wave1 | — | GOVERNANCE (ranking) | All five + five 200 |
| UAT-RI-09 | PASS | wave1; suppliers a11y | — | GOVERNANCE | `overlapResolution: none`; FX false; copy lists unresolved policies |
| UAT-SEC-01 | PASS | wave1 | — | — | OPTIONAL invalid dates 400 |
| UAT-SEC-02 | PASS | wave1 | — | — | Unknown opportunity facts 404 |
| UAT-REC-01 | PASS | wave2; mixed supplier GET 200 | H117-D-01 | DATA/ENVIRONMENT | All overlays + mixed parents after one restart |
| UAT-REC-02 | PASS | `eos` schema_migrations NULL | — | — | UAT writes not on `:5432/eos` |

---

## 8. Defect register

| ID | Class | Reproducible | Affected | Description | In-cycle repair? |
| --- | --- | --- | --- | --- | --- |
| H117-D-01 | DATA/ENVIRONMENT | Yes (Windows `npx tsx` wrapper) | Restart scenarios | SIGTERM of listen PID 37644 released `:18117`; wrapper exit **1**; no `shutdown_completed`. Same known process-control limitation as H-112/H-114. Bounded in-process POST trigger is **not** registered on this non-bounded path. Application hydrate after restart succeeded. | **No** |
| H117-D-02 | MINOR | Yes in `next dev` | Web UAT | Next.js hydration overlay (`Shell.tsx` ~232) appeared on several UAT pages. Authorized facts still loaded. | **No** |

No **BLOCKER**, **CRITICAL**, or **MAJOR** application defects were found. Harness JSON-path mistakes (RI-01 envelope vs `identity`; REC-01 GET `/rates/:id` which is not a retrieve route) were **not** recorded as product defects after the HTTP payloads were inspected.

---

## 9. Governance-blocked scenarios

Not judged as software FAIL (H-116 taxonomy **GOVERNANCE**):

- rate overlap / winner / preferred / ranking
- live-proposal freeze
- expired-rate use on live proposal
- public-for-sale approval
- FX conversion
- overlay vs mixed SoR precedence
- booking operator authority
- KPI history; revenue; profit definitions

UAT-RI-09 **PASS** means those policies were **absent / explicitly non-implemented**, which is the authorized expected result.

---

## 10. Browser evidence status

Isolated Next started on **3017** with `EOS_API_URL=http://127.0.0.1:18117`. `GET http://127.0.0.1:3017/eos-api/health` matched `GET http://127.0.0.1:18117/health`. Default `:3001`→`:8080` was **not** used (`:3001` was not listening). An unrelated process on `:8080` was not used as the UAT API.

Carol signed in via Dev sign-in. Session storage rehydrates a few seconds after full navigation (login chrome flashes first; then `Sign out` + facts). That delay is operator-visible, not a failed facts contract.

| Surface | Status |
| --- | --- |
| Account facts | PNG `h117-web-account.png` — PCO / United Kingdom |
| Opportunity facts | PNG `h117-web-opportunity.png` — `UAT-OPP-001`; qualification ≠ stage; next action |
| RFP + Path B | PNG `h117-web-rfp.png` — Referral / Email; Path B pending required |
| Programme | PNG `h117-web-programme.png` — `rfpObserved` yes; note retained |
| Rate Identity | Accessibility snapshot on `/commercial/suppliers` after selecting UAT Synthetic Lodge: mixed USD 250 “not F2 identity”; versions 1 (TZS) and 2 (EUR) plus catalogue versions 10–14 and 20–24; governance copy present. Dedicated overlay PNG not saved (browser tab closed). |
| Alice 403 in UI | Not repeated in browser; **API** AUTH-04 403 captured |

H117-D-02 (hydration overlay) did not block the above.

---

## 11. Persistence / restart evidence

Method: `node process.kill(listenPid, 'SIGTERM')` on PID **37644** (not Windows `Stop-Process` as primary). Port released. Wrapper exit 1 (H117-D-01). In-process bounded POST shutdown **not available** on this startup path; not modified.

Restart hydrate (`uat-api-restart.log`):

```text
f2_dp01_commercial_facts_hydrate opportunities:1 rfps:1 pathB:1 accounts:1 rates:12 programmes:1
pg3_crm_hydrate organizations:1 accounts:1
supEntitiesMerged suppliers:1 rates:1
api_listening http://127.0.0.1:18117
```

GET-after-restart: account pco/UK; opportunity next action; RFP referral/email; programme `rfpObserved`; overlay v1 TZS + v2 EUR. Mixed GET `/v1/suppliers/:id` 200 with `UAT-SGL` amount 250 USD.

---

## 12. Authentication / authorization evidence

- Valid Carol login 200.
- Wrong password 401, no token.
- Unauthenticated `/v1/me`, RFP facts, overlay GET → 401.
- Alice overlay GET and PUT → 403; Carol overlay unchanged.
- Conflicting opportunityId → 409.
- Unknown opportunity facts → 404.
- Invalid overlay source/type/currency/dates → 400.

---

## 13. Known limitations

Restated from H-116 §6, plus H-117 observations:

1. Formal UAT used a **new** catalog `eos_h117_uat`, not `eos_h112_full` (H-117 isolation).
2. H-112 named-branch opt-in cannot target this catalog/port without code change (fail-closed; left unchanged).
3. `EOS_ENV=uat` cannot be used; it is production-like refuse.
4. Windows `npx tsx` SIGTERM wrapper exit 1 / no `shutdown_completed` (H117-D-01).
5. Bounded POST shutdown is bounded-plane only.
6. `EOS_SEED_DEMO` remained false.
7. Organization-type ids taken from GET after hydrate.
8. Numbering hole `112`–`116`.
9. Next.js `dev` hydration overlay (H117-D-02).
10. Static UI copy still mentions `npm run dev:preview` / API 8080 / UI 3001; actual UAT proxy was 3017→18117.
11. Browser overlay PNG not retained after tab close; a11y snapshot is the Rate Identity UI evidence.
12. Alice UI 403 not separately screenshot; API 403 is recorded.

---

## 14. H-116 exit-criteria assessment

| # | Criterion | Assessment |
| ---: | --- | --- |
| 1 | All MANDATORY catalogue scenarios executed (or waived in writing) | **Met** — all mandatory IDs executed; none waived |
| 2 | BLOCKER and CRITICAL resolved or human-accepted | **Met** — none found |
| 3 | MAJOR dispositioned | **Met** — none found |
| 4 | GOVERNANCE-blocked identified as not judged | **Met** — §9 |
| 5 | Evidence pack complete per H-116 §5 | **Met** — this report + index + `h-117-evidence/` |
| 6 | Known limitations restated | **Met** — §13 |
| 7 | Final UAT result submitted for **human** acceptance | **Pending human** — this document is the submission, not the acceptance |

No percentage pass threshold was used.

---

## 15. Human acceptance boundary

| Layer | Status |
| --- | --- |
| Technical UAT execution | Complete against isolated `eos_h117_uat` |
| UAT evidence | Recorded in this report, the evidence index, and `docs/governance/h-117-evidence/` |
| UAT result | Technical execution supports submitting the pack for human acceptance; no BLOCKER/CRITICAL/MAJOR product defects recorded |
| Human acceptance | **Not given.** Cursor must not simulate sign-off. Named UAT owner/testers remain a human appointment (H-116 items 13–14). |

---

## 16. Production exclusion

UAT completion does **not** authorize Production migration, deployment, credentials, data, or SoR cutover. None of those were performed. No Production connection strings were used.

---

## 17. H-80 / H-81 exclusion

UAT completion does **not** establish H-80 exit, H-81 adoption, operational EOS adoption, or commercial SoR migration. None of those claims are made.

---

## 18. Repository state

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty (`INDEX_EMPTY`) |
| Porcelain count at H-117 docs | 494 (H-116 baseline) + this evidence pack (untracked `docs/governance/h-117-*`) |
| Application-code changes this tranche | **ZERO** (pre-existing dirty `apps/` / `packages/` worktree from prior governed tranches was not reset, cleaned, stashed, reverted, or overwritten) |
| Commit / push | **Not performed** |

UAT evidence files created: `docs/governance/h-117-uat-execution-report.md`, `docs/governance/h-117-uat-evidence-index.md`, and `docs/governance/h-117-evidence/**` (harnesses, logs, JSON, screenshots). Harness `.mjs` files are UAT evidence tooling, not API/web application source.

---

## 19. Final UAT classification

**`H-117 UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED`**

Technical execution of the approved H-116 catalogue against an isolated full-schema UAT catalog completed. Mandatory scenarios passed. No Blocker or Critical application defects were found. Open items are the known wrapper SIGTERM evidence limitation (DATA/ENVIRONMENT), a non-blocking Next.js hydration overlay (MINOR), and governance-blocked commercial policies (not software fails).

Formal business acceptance remains a **human** action. This report must not be treated as that action.

---

## Stop

H-117 authorized UAT execution and evidence only. No H-118. No defect repair. No Production. No governance rewrite. No EOS adoption.
