# H-117 — UAT evidence index

> **Technical UAT execution evidence.** Not human UAT sign-off. Not Production. Not H-80/H-81.

**Environment:** `http://127.0.0.1:18117` against `127.0.0.1:5436/eos_h117_uat`  
**Web:** `http://127.0.0.1:3017` with `EOS_API_URL=http://127.0.0.1:18117`  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Date:** 2026-09-21

Result labels: **PASS** / **FAIL** / **BLOCKED** / **NOT APPLICABLE**.

| Scenario ID | Evidence location | Result | Defect / governance classification |
| --- | --- | --- | --- |
| UAT-01 (env: DB/schema/API/web/users/isolation) | `h-117-evidence/uat-environment-identity.json`; `uat-01-isolation-decisions.json`; `uat-api-startup.log` (`database_migrated` applied `[]`, `api_listening`); `uat-web.log` (Ready :3017); proxy `GET /eos-api/health` = API `/health` | PASS | — |
| UAT-AUTH-01 | `h-117-evidence/wave1-results.json` → `UAT-AUTH-01` | PASS | — |
| UAT-AUTH-02 | `wave1-results.json` → `UAT-AUTH-02` (401, no token) | PASS | — |
| UAT-AUTH-03 | `wave1-results.json` → `UAT-AUTH-03` (GET `/v1/me` 401) | PASS | — |
| UAT-AUTH-04 | `wave1-results.json` → `UAT-AUTH-04` (Alice GET/PUT overlay 403) | PASS | — |
| UAT-ACC-01 | `wave1-results.json` → `UAT-ACC-01`; ids `organizationId` `4f477993-d531-4c52-a4ef-e45a76b7a686`, `accountId` `f07a8d59-3a24-4fee-beef-1f7d1cf10853` | PASS | — |
| UAT-ACC-02 | `wave1-results.json` → `UAT-ACC-02`; screenshot `screenshots/h117-web-account.png` | PASS | — |
| UAT-ACC-03 | `wave1-results.json` → `UAT-ACC-03` (pco / united_kingdom; independents true) | PASS | — |
| UAT-ACC-04 | `wave2-restart-results.json` → `UAT-ACC-04`; restart log `f2_dp01_commercial_facts_hydrate` accounts=1 | PASS | Wrapper SIGTERM DATA/ENVIRONMENT H117-D-01 (port released; hydrate succeeded) |
| UAT-OPP-01 | `wave1-results.json` → `UAT-OPP-01`; `opportunityId` `fdf1a820-4e31-4379-a77a-190d7e5f2f67` | PASS | — |
| UAT-OPP-02 | `wave1-results.json` → `UAT-OPP-02`; screenshot `screenshots/h117-web-opportunity.png` | PASS | — |
| UAT-OPP-03 | `wave1-results.json` → `UAT-OPP-03`; UI: workflow `rfp_received`, qualification `Not yet assessed` | PASS | GOVERNANCE: G-04-B 250k/20% not judged |
| UAT-OPP-04 | `wave1-results.json` → `UAT-OPP-04` (nextAction round-trip) | PASS | — |
| UAT-OPP-05 | `wave1-results.json` → `UAT-OPP-05` (409) | PASS | — |
| UAT-OPP-06 | `wave2-restart-results.json` → `UAT-OPP-06` | PASS | H117-D-01 as ACC-04 |
| UAT-RFP-01 | `wave1-results.json` → `UAT-RFP-01`; `rfpId` `e94c4561-5d7c-4cb4-855c-f5dc803848c9` | PASS | — |
| UAT-RFP-02 | `wave1-results.json` → `UAT-RFP-02`; screenshot `screenshots/h117-web-rfp.png` (SOURCE Referral, CHANNEL Email) | PASS | — |
| UAT-RFP-03 | `wave1-results.json` → `UAT-RFP-03` (`receivedAt` explicit; first-response unset) | PASS | — |
| UAT-RFP-04 | `wave1-results.json` → `UAT-RFP-04` (`not_started`, no invented events) | PASS | — |
| UAT-RFP-05 | `wave1-results.json` → `UAT-RFP-05`; UI Path B pending/required `significant_contractual_commitments` | PASS | GOVERNANCE: revenue/KPI not judged |
| UAT-RFP-06 | `wave2-restart-results.json` → `UAT-RFP-06` | PASS | H117-D-01 as ACC-04 |
| UAT-RFP-07 | `wave1-results.json` → `UAT-RFP-07` (401) — OPTIONAL | PASS | — |
| UAT-PRG-01 | `wave1-results.json` → `UAT-PRG-01`; `programmeId` `eb60f5b2-a2b3-48ca-8d80-79ebefdc9bd6` | PASS | — |
| UAT-PRG-02 | `wave1-results.json` → `UAT-PRG-02`; screenshot `screenshots/h117-web-programme.png` (`rfpObserved` yes) | PASS | GOVERNANCE: profit/freeze not judged |
| UAT-PRG-03 | `wave2-restart-results.json` → `UAT-PRG-03` | PASS | H117-D-01 as ACC-04 |
| UAT-06 GET/PUT facts | Covered by ACC-03, OPP-04, RFP-02, PRG-02, RI-01 and GETs after restart | PASS | — |
| UAT-RI-01 | `wave1-results.json` → `UAT-RI-01` (201/201/200; overlay TZS; mixed 250 USD; `amountIsNotIdentity`) | PASS | Initial harness JSON-path false FAIL; reclassified from payload |
| UAT-RI-02 | `wave1-results.json` → `UAT-RI-02` | PASS | — |
| UAT-RI-03 | `wave1-results.json` → `UAT-RI-03` (v1 TZS, v2 EUR) | PASS | — |
| UAT-RI-04 | `wave1-results.json` → `UAT-RI-04` (409 `version_identity_exists`) | PASS | — |
| UAT-RI-05 | `wave2-restart-results.json` → `UAT-RI-05`; hydrate `rates:12` | PASS | H117-D-01 as ACC-04 |
| UAT-RI-06 | `wave1-results.json` → `UAT-RI-06` (401) | PASS | — |
| UAT-RI-07 | `wave1-results.json` → `UAT-RI-07` (three 400s) | PASS | — |
| UAT-RI-08 | `wave1-results.json` → `UAT-RI-08` (five source classes + five OR-08 types, all 200) | PASS | GOVERNANCE: ranking not judged |
| UAT-RI-09 | `wave1-results.json` → `UAT-RI-09`; supplier overlay a11y: overlap winner / FX / freeze listed as unresolved | PASS | GOVERNANCE (expected: not a software fail) |
| UAT-SEC-01 | `wave1-results.json` → `UAT-SEC-01` (400) — OPTIONAL | PASS | — |
| UAT-SEC-02 | `wave1-results.json` → `UAT-SEC-02` (404) | PASS | — |
| UAT-REC-01 | `wave2-restart-results.json` → `UAT-REC-01`; `mixed-supplier-after-restart.json`; sidecar `sidecar-counts-pre-restart.txt` | PASS | Harness first used non-existent GET `/rates/:id` (404); GET `/v1/suppliers/:id` 200 with UAT-SGL 250 USD |
| UAT-REC-02 | docker `compose-postgres-1` `to_regclass('schema_migrations')` NULL on `eos`; UAT writes on `:5436/eos_h117_uat` only | PASS | Catalogue H-116 text said `:5435/:18116`; H-117 isolation superseded that target |

**Supporting files**

| File | Role |
| --- | --- |
| `h-117-evidence/execute-scenarios.mjs` | Wave-1 API harness (not application code) |
| `h-117-evidence/execute-restart.mjs` | Restart GET harness |
| `h-117-evidence/uat-ids.json` | Runtime UUIDs |
| `h-117-evidence/uat-api-startup.log` | First API process |
| `h-117-evidence/uat-api-restart.log` | Hydrate after SIGTERM |
| `h-117-evidence/uat-web.log` | Isolated Next `:3017` |

Browser screenshots live under `h-117-evidence/screenshots/`. Overlay identity list for Rate Identity was captured in the suppliers-page accessibility snapshot (tab closed before a dedicated overlay PNG could be saved).
