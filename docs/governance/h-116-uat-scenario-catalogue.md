# H-116 — UAT scenario catalogue

> **UAT PREPARATION ONLY** · **NOT UAT EXECUTION** · **NOT UAT SIGN-OFF**  
> **Synthetic Dev/Test data only.** No customer, supplier-production, employee, financial, or Production data.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Target (preparation baseline, not a formal UAT designation):** `http://127.0.0.1:18116` against `127.0.0.1:5435/eos_h112_full`.  
**Actors:** see [`h-116-uat-data-plan.md`](h-116-uat-data-plan.md).  
**Pass/fail:** compare actual result to **Expected result**. Unresolved policy → classify **GOVERNANCE**, not software fail.

Mandatory scenarios for exit: all IDs marked **MANDATORY**. Optional negatives marked **OPTIONAL**.

Shared preconditions unless stated: full-schema API started per H-112 runbook (`EOS_H112_FULL_SCHEMA_DEVTEST_API_STARTUP=true`, `EOS_SEED_DEMO=false`, bounded flag unset); `GET /health` and `GET /ready` 200; GET `/v1/crm/organization-types` used for org POST (PostgreSQL catalogue ids).

---

## Authentication

### UAT-AUTH-01 — Valid login (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Authorized operator can obtain a Dev/Test session |
| Preconditions | Shared; Carol bootstrap password from `.env.example` |
| Actor/role | `carol.admin@sedmc.local` / `platform.admin` / tenant `sedmc` |
| Test data | Data plan USER-CAROL |
| Exact action | `POST /v1/auth/login` `{ email, password, tenantSlug: "sedmc" }` |
| Expected result | **200**; `accessToken` present |
| Persistence | None required |
| Authorization | Authenticated session issued |
| Evidence | HTTP status + redacted token presence (do not copy secrets into tickets) |
| Pass/fail | 200 with token = pass |
| Exclusion | Production IdP |

### UAT-AUTH-02 — Invalid login (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Wrong password does not grant access |
| Preconditions | Shared |
| Actor/role | Carol email with incorrect password |
| Test data | USER-CAROL email; password `not-the-bootstrap-password` |
| Exact action | `POST /v1/auth/login` |
| Expected result | Not 200 with a usable token (401/403 per existing auth contract) |
| Persistence | No session |
| Authorization | Denied |
| Evidence | Status + error body |
| Pass/fail | No access token = pass |
| Exclusion | Account lockout policy (undefined) |

### UAT-AUTH-03 — Unauthenticated API (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Facts APIs reject missing principal |
| Preconditions | Shared |
| Actor/role | None |
| Test data | Any facts URL (e.g. `/v1/me`) |
| Exact action | GET without `Authorization` |
| Expected result | **401** `unauthenticated` |
| Persistence | None |
| Authorization | Fail-closed |
| Evidence | Status + body |
| Pass/fail | 401 = pass |
| Exclusion | — |

### UAT-AUTH-04 — Unauthorized role (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Finance member cannot operate supplier rate overlay |
| Preconditions | UAT-RI-01 overlay exists; Alice can log in |
| Actor/role | `alice.finance@sedmc.local` / `finance.member` |
| Test data | USER-ALICE; rate from UAT-RI-01 |
| Exact action | GET and PUT rate commercial-facts with Alice token |
| Expected result | **403** on GET and PUT |
| Persistence | Overlay unchanged |
| Authorization | `supplier:read/write:supplier` denied |
| Evidence | Two 403 responses; subsequent Carol GET still shows one version |
| Pass/fail | Both 403 and overlay unchanged = pass |
| Exclusion | Do not grant Alice supplier write for this programme |

---

## Account

### UAT-ACC-01 — Create organization and account (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Operator can create a synthetic account on full-schema |
| Preconditions | Shared; GET organization-types |
| Actor/role | Carol |
| Test data | ORG-UAT-001, ACC-UAT-001 |
| Exact action | POST `/v1/crm/organizations` using **PG type id**; POST `/v1/crm/accounts` |
| Expected result | Both 201 |
| Persistence | Mixed CRM rows in `eos_h112_full` |
| Authorization | `crm:write:organization` / `crm:write:account` |
| Evidence | IDs; HTTP 201 |
| Pass/fail | 201 = pass |
| Exclusion | Demo seed |

### UAT-ACC-02 — Retrieve account (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Created account is readable |
| Preconditions | UAT-ACC-01 |
| Actor/role | Carol |
| Test data | ACC-UAT-001 id |
| Exact action | GET `/v1/crm/accounts/:id` |
| Expected result | 200; name matches |
| Persistence | Mixed retrieve |
| Authorization | `crm:read:account` |
| Evidence | GET body |
| Pass/fail | 200 + name = pass |
| Exclusion | — |

### UAT-ACC-03 — Update account facts (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Account type independent of market |
| Preconditions | UAT-ACC-02 |
| Actor/role | Carol |
| Test data | `{ accountType: "pco", market: "united_kingdom" }` |
| Exact action | PUT `/v1/crm/accounts/:id/commercial-facts` |
| Expected result | 200; type PCO; market UK; `accountTypeIndependentOfMarket: true`; `legacyCrmMarketAuthoritativeForF2: false` |
| Persistence | `f2_account_facts` |
| Authorization | `crm:write:account` |
| Evidence | PUT body + optional sidecar SELECT |
| Pass/fail | Independents true; PCO ≠ event agency = pass |
| Exclusion | Inferring type/market from name |

### UAT-ACC-04 — Restart and persist account facts (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Account overlay survives API restart |
| Preconditions | UAT-ACC-03 recorded |
| Actor/role | Operator + Carol |
| Test data | Same account id |
| Exact action | Stop API (document method); start per runbook; login; GET facts |
| Expected result | Hydrate log includes accounts≥1; GET matches PUT (pco / united_kingdom) |
| Persistence | Sidecar hydrate |
| Authorization | Same as GET |
| Evidence | Startup log + GET |
| Pass/fail | Fields match = pass. Wrapper exit 1 without `shutdown_completed` is **DATA/ENVIRONMENT** if port released and hydrate succeeds |
| Exclusion | Windows SIGINT experiment |

---

## Opportunity

### UAT-OPP-01 — Create (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Create mixed-SQL opportunity |
| Preconditions | ACC-UAT-001 |
| Actor/role | Carol |
| Test data | OPP-UAT-001 code `UAT-OPP-001` |
| Exact action | POST `/v1/pipeline/opportunities` |
| Expected result | 201 |
| Persistence | `opp_opportunities` |
| Authorization | `pipeline:write:opportunity` |
| Evidence | 201 + id |
| Pass/fail | 201 = pass |
| Exclusion | — |

### UAT-OPP-02 — Retrieve and identity (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Opportunity identity is stable |
| Preconditions | UAT-OPP-01 |
| Actor/role | Carol |
| Test data | Opportunity id |
| Exact action | GET opportunity |
| Expected result | 200; code `UAT-OPP-001`; owner present |
| Persistence | Mixed SQL |
| Authorization | read |
| Evidence | GET body |
| Pass/fail | Code + owner = pass |
| Exclusion | — |

### UAT-OPP-03 — Qualification ≠ stage (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | OR-01: qualification independent of workflow stage |
| Preconditions | UAT-OPP-02 |
| Actor/role | Carol |
| Test data | PUT facts qualification `not_yet_assessed` or `qualified` with conditions if required by existing contract |
| Exact action | GET commercial-facts; observe `qualificationIsIndependentOfWorkflowStage`; workflow stage is not `qualified` |
| Expected result | `new_qualified` (if present as stage) is not treated as OR-01 qualified unless overlay says qualified |
| Persistence | Sidecar opportunity facts |
| Authorization | write |
| Evidence | Facts JSON |
| Pass/fail | Independence flags true; no 250k/20% invented = pass |
| Exclusion | G-04-B numeric gate |

### UAT-OPP-04 — Next action and owner (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Follow-up next action is an explicit fact |
| Preconditions | UAT-OPP-03 |
| Actor/role | Carol |
| Test data | `nextAction.description = "UAT follow-up with buyer"` |
| Exact action | PUT commercial-facts |
| Expected result | 200; description persisted; owner principal present |
| Persistence | Sidecar |
| Authorization | write |
| Evidence | PUT/GET |
| Pass/fail | Description round-trip = pass |
| Exclusion | — |

### UAT-OPP-05 — Conflicting identifier 409 (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Path id is immutable |
| Preconditions | UAT-OPP-01 |
| Actor/role | Carol |
| Test data | Body `opportunityId` or `id` = different UUID |
| Exact action | PUT commercial-facts |
| Expected result | **409** `*_immutable` |
| Persistence | Facts not rewritten from conflicting id |
| Authorization | Authenticated |
| Evidence | 409 body |
| Pass/fail | 409 = pass |
| Exclusion | — |

### UAT-OPP-06 — Opportunity facts restart (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Opportunity overlay survives restart |
| Preconditions | UAT-OPP-04 |
| Actor/role | Operator + Carol |
| Test data | Same opportunity id |
| Exact action | Restart API; GET facts |
| Expected result | Next action still present |
| Persistence | Sidecar hydrate |
| Authorization | read |
| Evidence | GET after hydrate |
| Pass/fail | Match = pass |
| Exclusion | Process-local Store as SoR |

---

## RFP

### UAT-RFP-01 — Create (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Create RFP linked to opportunity |
| Preconditions | UAT-OPP-01 |
| Actor/role | Carol |
| Test data | RFP-UAT-001 code `UAT-RFP-001` |
| Exact action | POST `/v1/rfps` |
| Expected result | 201 |
| Persistence | `rfp_rfps` |
| Authorization | `rfp:write:rfp` |
| Evidence | 201 + id |
| Pass/fail | 201 = pass |
| Exclusion | Ingest |

### UAT-RFP-02 — SOURCE ≠ CHANNEL (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Preserve SOURCE catalogue distinct from CHANNEL |
| Preconditions | UAT-RFP-01 |
| Actor/role | Carol |
| Test data | `primarySource: "referral"`, `channel: "email"` |
| Exact action | PUT `/v1/rfps/:id/commercial-facts` |
| Expected result | 200; `sourceDistinctFromChannel: true`; `legacyCollapsedSourceAuthoritativeForF2: false` |
| Persistence | `f2_rfp_facts` |
| Authorization | write |
| Evidence | PUT/GET |
| Pass/fail | SOURCE referral AND CHANNEL email = pass. Fail if they collapse |
| Exclusion | Inferring SOURCE from email |

### UAT-RFP-03 — Timestamps not invented (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Receipt/first-response only when explicit |
| Preconditions | UAT-RFP-02 |
| Actor/role | Carol |
| Test data | Omit timestamps **or** supply explicit ISO `2026-09-10T08:00:00.000Z` for receivedAt only |
| Exact action | PUT then GET |
| Expected result | Omitted fields remain unset; explicit ISO stored; `createdAtUsedAsReceivedAt` false |
| Persistence | Sidecar |
| Authorization | write |
| Evidence | GET flags |
| Pass/fail | No synthesized now() = pass |
| Exclusion | Mailbox |

### UAT-RFP-04 — Clarification (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Clarification status is explicit |
| Preconditions | UAT-RFP-02 |
| Actor/role | Carol |
| Test data | `clarificationStatus: "not_started"`; do not post an event without type+eventAt |
| Exact action | PUT facts |
| Expected result | Status stored; no invented events |
| Persistence | Sidecar |
| Authorization | write |
| Evidence | GET clarificationEvents |
| Pass/fail | No extra events = pass |
| Exclusion | — |

### UAT-RFP-05 — Path B mutation (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Qualitative Path B categories persist |
| Preconditions | UAT-RFP-01 |
| Actor/role | Carol |
| Test data | `{ categories: ["significant_contractual_commitments"] }` |
| Exact action | PUT `/v1/rfps/:id/path-b-approval` then GET |
| Expected result | 200; category present; `required` per existing evaluator (H-112 observed `required: true` / `pending` for this category) |
| Persistence | `f2_path_b` |
| Authorization | write |
| Evidence | GET pathB |
| Pass/fail | Category round-trip = pass. Fail if sell-price/KPI fields appear |
| Exclusion | Revenue/profit/KPI history |

### UAT-RFP-06 — RFP facts restart (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | SOURCE/CHANNEL survive restart |
| Preconditions | UAT-RFP-02 |
| Actor/role | Operator + Carol |
| Test data | Same rfp id |
| Exact action | Restart; GET facts |
| Expected result | referral / email retained |
| Persistence | Hydrate |
| Authorization | read |
| Evidence | GET |
| Pass/fail | Match = pass |
| Exclusion | — |

### UAT-RFP-07 — RFP unauthorized (OPTIONAL)

| Field | Content |
| --- | --- |
| Business objective | Unauthenticated RFP facts denied |
| Preconditions | UAT-RFP-01 |
| Actor/role | None |
| Test data | RFP id |
| Exact action | GET facts without token |
| Expected result | 401 |
| Persistence | None |
| Authorization | Fail-closed |
| Evidence | 401 |
| Pass/fail | 401 = pass |
| Exclusion | — |

---

## Programme

### UAT-PRG-01 — Create (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Create programme on RFP |
| Preconditions | UAT-RFP-01 |
| Actor/role | Carol |
| Test data | PRG-UAT-001 title `UAT programme` |
| Exact action | POST `/v1/programmes` with rfpId and a day item |
| Expected result | 201 |
| Persistence | `prg_programmes` |
| Authorization | programme write |
| Evidence | 201 + id |
| Pass/fail | 201 = pass |
| Exclusion | — |

### UAT-PRG-02 — Identity trace and rfpObserved (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Programme facts observe RFP FK; sell price is not revenue |
| Preconditions | UAT-PRG-01 |
| Actor/role | Carol |
| Test data | Optional note `UAT identifier-trace only` |
| Exact action | GET then PUT `/v1/programmes/:id/commercial-facts` |
| Expected result | `rfpObserved: true`; `sellPriceTreatedAsRevenue: false` |
| Persistence | `f2_programme_facts` |
| Authorization | write |
| Evidence | GET/PUT |
| Pass/fail | rfpObserved true and sell-price-not-revenue = pass |
| Exclusion | Freeze-on-send; profit |

### UAT-PRG-03 — Programme restart (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Programme overlay survives restart |
| Preconditions | UAT-PRG-02 |
| Actor/role | Operator + Carol |
| Test data | Same programme id |
| Exact action | Restart; GET |
| Expected result | Note / observed flags retained |
| Persistence | Hydrate |
| Authorization | read |
| Evidence | GET |
| Pass/fail | Match = pass |
| Exclusion | — |

---

## Rate Identity overlay

### UAT-RI-01 — Create mixed parent + overlay (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Authorized overlay on a mixed C4 rate |
| Preconditions | Shared |
| Actor/role | Carol |
| Test data | SUP-UAT-001; mixed rate unit `per_room_per_night` amount 250 USD; overlay versionIdentity 1, source `direct_supplier_contract`, type `negotiated_contracted`, originalCurrency `TZS`, valid 2026-01-01..2026-12-31 |
| Exact action | POST supplier; POST rate; PUT `/v1/suppliers/:sid/rates/:rid/commercial-facts` |
| Expected result | 201/201/200; `amountIsNotIdentity: true`; `legacyAmount: 250`; `originalCurrency: TZS`; `fxProviderImplemented: false`; `overlapResolution: none` |
| Persistence | `sup_*` mixed + `f2_rate_identities` |
| Authorization | `supplier:write:supplier` |
| Evidence | PUT JSON; optional sidecar SELECT |
| Pass/fail | Overlay TZS and mixed USD both present; amount not identity = pass |
| Exclusion | Winner, FX, freeze, mixed promotion |

### UAT-RI-02 — GET overlay (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Retrieve overlay versions |
| Preconditions | UAT-RI-01 |
| Actor/role | Carol |
| Test data | Same ids |
| Exact action | GET commercial-facts `?at=2026-09-21` |
| Expected result | 200; identities length 1; supplier ownership displayed; identityId ≠ supplierId |
| Persistence | Read sidecar/memory |
| Authorization | `supplier:read:supplier` |
| Evidence | GET JSON |
| Pass/fail | Length 1 + ownership = pass |
| Exclusion | — |

### UAT-RI-03 — Append version (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Append-only versioning |
| Preconditions | UAT-RI-02 |
| Actor/role | Carol |
| Test data | versionIdentity **2**; originalCurrency `EUR` (still no FX) |
| Exact action | PUT overlay |
| Expected result | 200; GET identities [1,2]; v1 still TZS |
| Persistence | Second sidecar row |
| Authorization | write |
| Evidence | GET list |
| Pass/fail | Two versions; v1 unchanged = pass |
| Exclusion | Editing v1 in place |

### UAT-RI-04 — Duplicate version 409 (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Duplicate versionIdentity refused |
| Preconditions | UAT-RI-01 |
| Actor/role | Carol |
| Test data | versionIdentity **1** again |
| Exact action | PUT |
| Expected result | **409** `version_identity_exists` |
| Persistence | No overwrite of v1 payload |
| Authorization | Authenticated write attempt |
| Evidence | 409 body; GET still prior currencies |
| Pass/fail | 409 and v1 still TZS = pass |
| Exclusion | — |

### UAT-RI-05 — Overlay restart (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Overlay hydrate after restart |
| Preconditions | UAT-RI-01 (and 03 if executed) |
| Actor/role | Operator + Carol |
| Test data | Same rate id |
| Exact action | Restart; GET |
| Expected result | `f2_dp01_commercial_facts_hydrate` rates≥1; GET matches last good PUT set |
| Persistence | Sidecar |
| Authorization | read |
| Evidence | Startup log + GET |
| Pass/fail | Match = pass |
| Exclusion | — |

### UAT-RI-06 — Unauthenticated 401 (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Overlay requires session |
| Preconditions | UAT-RI-01 |
| Actor/role | None |
| Test data | Rate URL |
| Exact action | GET without token |
| Expected result | 401 |
| Persistence | None |
| Authorization | Fail-closed |
| Evidence | 401 |
| Pass/fail | 401 = pass |
| Exclusion | — |

### UAT-RI-07 — Catalogues and invalid input (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Invalid source class / mixed unit type as OR-08 / bad currency rejected |
| Preconditions | Mixed rate exists |
| Actor/role | Carol |
| Test data | `sourceClass: "website_inferred"`; `rateType: "per_room_per_night"`; `originalCurrency: "TZ"` |
| Exact action | Three PUTs |
| Expected result | **400** `invalid_source_class` / `invalid_or08_rate_type` / `invalid_original_currency` |
| Persistence | No overlay row from invalid PUTs |
| Authorization | Authenticated |
| Evidence | Three 400 bodies |
| Pass/fail | All three rejected = pass |
| Exclusion | Inventing a sixth class |

### UAT-RI-08 — Five source classes and five OR-08 types (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Frozen catalogues are all usable |
| Preconditions | Two mixed rates or sequential versions |
| Actor/role | Carol |
| Test data | Each of five `SUPPLIER_RATE_SOURCE_CLASSES`; each of five `SUPPLIER_RATE_TYPE_KEYS` |
| Exact action | PUT each as a distinct versionIdentity |
| Expected result | Each 200 |
| Persistence | Sidecar versions |
| Authorization | write |
| Evidence | GET list |
| Pass/fail | All five + five accepted = pass |
| Exclusion | Ranking among them |

### UAT-RI-09 — Negative: no winner / FX / freeze (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | UAT does not require unresolved policy |
| Preconditions | UAT-RI-02 |
| Actor/role | Carol |
| Test data | GET overlay |
| Exact action | Inspect JSON and UI copy |
| Expected result | `overlapResolution: none`; `fxProviderImplemented: false`; no `freezeOnSend`; mixed prefer labelled non-F2 if shown |
| Persistence | N/A |
| Authorization | read |
| Evidence | GET JSON (UI screenshot optional) |
| Pass/fail | Flags absent/false = pass. **GOVERNANCE** if tester “fails” the scenario for missing winner UI |
| Exclusion | Implementing those policies |

---

## Security (additional)

### UAT-SEC-01 — Invalid JSON / invalid dates (OPTIONAL)

| Field | Content |
| --- | --- |
| Business objective | Invalid overlay dates rejected |
| Preconditions | Mixed rate |
| Actor/role | Carol |
| Test data | validFrom after validTo |
| Exact action | PUT |
| Expected result | 400 `invalid_validity_dates` |
| Persistence | None |
| Authorization | Authenticated |
| Evidence | 400 |
| Pass/fail | 400 = pass |
| Exclusion | — |

### UAT-SEC-02 — Cross-entity: facts for unknown id (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Unknown opportunity/rate is not found |
| Preconditions | Shared |
| Actor/role | Carol |
| Test data | Random UUID |
| Exact action | GET opportunity commercial-facts |
| Expected result | **404** |
| Persistence | None |
| Authorization | Authenticated |
| Evidence | 404 |
| Pass/fail | 404 = pass |
| Exclusion | Leaking other tenants |

---

## Recovery / persistence

### UAT-REC-01 — Combined restart (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | Account, opportunity/RFP facts, programme, and rate overlay all survive one restart |
| Preconditions | UAT-ACC-03, UAT-OPP-04, UAT-RFP-02, UAT-PRG-02, UAT-RI-01 completed |
| Actor/role | Operator + Carol |
| Test data | All UAT-* ids |
| Exact action | Single restart; GET each facts endpoint |
| Expected result | All recorded overlays return; mixed parents still retrievable on full-schema |
| Persistence | Hydrate six maps + mixed SQL |
| Authorization | Carol |
| Evidence | Startup hydrate counts + five GETs |
| Pass/fail | All GETs match last PUT = pass |
| Exclusion | Treating Store as mixed SoR; migrating `eos` |

### UAT-REC-02 — Bounded catalog negative control (MANDATORY)

| Field | Content |
| --- | --- |
| Business objective | UAT must not use or migrate 124-only `eos` |
| Preconditions | Compose `eos` running |
| Actor/role | Operator |
| Test data | None |
| Exact action | Confirm `schema_migrations` absent on `eos`; do **not** point UAT API at `:5432/eos` |
| Expected result | Control query only; UAT API remains `:5435` / `:18116` |
| Persistence | `eos` unchanged |
| Authorization | N/A |
| Evidence | `to_regclass('schema_migrations')` NULL |
| Pass/fail | `eos` unmigrated and unused for UAT writes = pass |
| Exclusion | Using bounded plane as UAT SoR |

---

## Execution notes

- Restart scenarios may share one process bounce (UAT-REC-01) instead of five separate restarts.
- Capture evidence per [`h-116-uat-entry-criteria.md`](h-116-uat-entry-criteria.md) §Evidence.
- Testers must not “complete” a scenario by inventing FX, winners, freeze, revenue, or ingest.
