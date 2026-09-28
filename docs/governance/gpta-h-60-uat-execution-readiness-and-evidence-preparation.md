# GPTA-H-60 — F2 C1–C10 UAT Execution Readiness and Evidence Preparation

> **`UAT READINESS / EVIDENCE PREPARATION ONLY`**  
> **`UAT NOT EXECUTED`**  
> **`F2-I12 NOT AUTHORIZED`**  
> **`NO APPLICATION IMPLEMENTATION`**  
> **`NO SCHEMA / MIGRATION / PERSISTENCE / GATE B / PRODUCTION CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:10:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-59 historical bodies are **not rewritten**. Application code is **not modified**. Limitations found on inspection remain **findings**. They are **not** implementation authorization.

```text
GPTA-H-60 STATUS = UAT EXECUTION READINESS AND EVIDENCE PREPARATION COMPLETED

UAT NOT EXECUTED
F2-I12 NOT AUTHORIZED
NO APPLICATION IMPLEMENTATION PERFORMED
NO SCHEMA CHANGE
NO MIGRATION
NO PRODUCTION CHANGE
NO COMMIT
NO PUSH
```

---

## Repository state

Inspected before this record:

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` — **confirmed** |
| Index | **EMPTY** |
| Working tree | **DIRTY** — Class A/B and F2-I1–I11 **preserved** |
| This record | Governance documentation only |

---

## Authorization and appointments

| Item | Status |
| --- | --- |
| H-44 | F2 **AUTHORIZED** — C1–C10 Dev/Test only |
| H-58 | **OPTION A — CONTROLLED PAUSE** |
| H-59 | [`gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md`](gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md) — scenario pack **COMPLETED**; **UAT NOT EXECUTED** |
| F2-I1–I11 | Frozen preview baseline |
| F2-I12 | **NOT AUTHORIZED** |
| Technical Increment Owner | **Patrick Makundi** |
| UAT Authority | **Patrick Makundi** |
| Combined role | **YES** |

Technical evidence (automated tests) ≠ UAT evidence. Only the UAT Authority may later assign PASS/FAIL.

Identified execution environment (not production): Dev/Test **in-memory preview** (historical: API `127.0.0.1:8080`, web `http://localhost:3001/commercial/`). Durable F2 fact routes return `f2_iN_in_memory_preview_only` and are **out of this execution pack**.

---

## Numbering

H-59 **scenario IDs** remain the inventory keys (UAT-C1-01 … UAT-C10-10).

This record labels **capability** using the H-60 commissioning map (aligned to those scenario IDs):

C1 CRM · C2 Qualification · C3 RFP/Clarification/Follow-up · C4 Programme/Itinerary · C5 Costing/Supplier Rates · C6 Approval · C7 Proposal · C8 Booking/Commercial Conversion · C9 Commercial/Account Relationship · C10 KPI/Commercial Reporting.

H-29 source file §B.2 uses a different C-spine (C2 Opportunity, C4 Supplier rates, C5 Programme, C7 Approval, C8 Proposal, C9 Booking). H-59 already recorded that conflict. **H-29 is not rewritten.** Scenario IDs are not a redefinition of the H-29 file.

---

## Inspection findings that remain findings (not fixes)

| Finding | Implication for UAT |
| --- | --- |
| No `apps/web` commercial-facts / Path B / KPI-preview screens | Execution surface is **API-led**. Mixed commercial UI may show mixed identity only. |
| F2 sidecar is process-local WeakMap, not seeded | Restart loses F2 facts. Demo PUTs must be done in the live preview session. |
| Preview seed (`seed-demo-data.ts`) has mixed chain `OPP-2026-GLOB` → `RFP-2026-0847` → programme/costing/proposal/booking | Mixed **identity** exists. It is **not** labelled UAT DEMO DATA. Mixed org type `incentive_house` and free-text “United Kingdom” are **not** F2 OR-03 facts. |
| Seed budget 250000–300000 USD | Must **not** be treated as CPR or qualification. Budget is not a mandatory OR-01 condition. |
| No booking cancel route under `apps/api/src/booking` | `cancelled` exists on the kernel type; create always sets `confirmed`. UAT-C8-03 cannot construct a cancelled booking via the frozen public booking API. |
| No `/v1/bookings/:id/commercial-facts` | Win-dimension UAT remains **NOT_READY** (H-58 Option A). |
| Mixed `evaluateCommercialApprovalGate` 250k/20% still present | Residual visibility only — not F2 Path B authority. |
| Mixed POST `/v1/rfps` may default `receivedAt` to now | Not F2-authoritative receipt. Use sidecar `receivedAt`. |
| Mixed J3 analytics | Not F2-authoritative. Do not use as UAT evidence. |

Do **not** fix these in H-60.

---

## Evidence model

### Classes

| Class | What it is | What it is not |
| --- | --- | --- |
| **UAT evidence** | Controlled request/input; API response; record state; before/after; calculation result; business-rule observation; screen observation of mixed identity if used; tester observation; evidence reference | Automated test output by itself |
| **Technical evidence** | F2-I1–I11 vitest results; kernel contract tests | UAT PASS |
| **Operational evidence** | Office/Excel/mail/WhatsApp/phone SoR | Not in this preview UAT pack |

### Required fields when a scenario is later executed

| Field | Rule |
| --- | --- |
| Scenario ID | H-59 ID |
| Tester | Patrick Makundi |
| Execution date/time | Recorded |
| Preconditions | As executed |
| Input/action | Recorded |
| Expected result | From H-59 / this matrix |
| Actual result | Observed, not assumed |
| PASS / FAIL | UAT Authority only |
| Evidence reference | Response body / IDs / notes |
| Limitation / observation | Always if any |
| Defect or governance finding | Class A–F below; **not** an implementation grant |

Do **not** execute these scenarios in this record. Do **not** populate actual results.

---

## Test-data governance

```text
UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA
```

| Rule | Status |
| --- | --- |
| Any records created for UAT must carry that label in the evidence log | Required |
| Do not seed ~25 RFPs / ~3 bookings / ~12% as system or historical facts | Forbidden |
| Do not manufacture revenue, profit, conversion, or history to force a KPI PASS | Forbidden |
| Where a KPI is unavailable, UAT tests the **unavailability** | Required |
| Creating demo records via **existing** mixed POST + F2 PUT at execution time | Does **not** change application behaviour |
| Editing `seed-demo-data.ts` or adding persist/seed code | **Forbidden** in this pause |

H-59 demo IDs (UAT-DEMO-ACC-SA-IH, … UAT-DEMO-KPI-POP) remain the naming scheme. They **do not yet exist** as labelled F2 facts.

**Already exists:** mixed preview seed identity chain and mixed supplier/CRM records (unlabelled; not F2-authoritative).  
**Does not exist:** labelled UAT demo F2 sidecar facts; SA incentive F2 account facts; cancelled booking via API; booking win-dimension sidecar.

---

## Finding classification (for future execution)

| Code | Name | Meaning |
| --- | --- | --- |
| **A** | Evidence Gap | Capability exists; captured evidence was insufficient |
| **B** | Defect | Observed behaviour does not match approved requirement/design |
| **C** | Capability Gap | Required capability is absent from the frozen F2-I1–I11 baseline |
| **D** | Governance Decision Required | Requirement, rule, parameter, scope, or policy unresolved |
| **E** | Out of Scope | Depends on capability outside F2 (mailbox, FX, DR-008, C11+, production, numerical CPR) |
| **F** | Data Limitation | Capability exists; required factual data unavailable |

Do **not** convert B/C/D/E/F into development authorization. A gap is a finding.

---

## UAT entry criteria (execution not granted here)

1. H-59 scenario pack exists.
2. H-60 readiness matrix exists (this record).
3. F2-I1–I11 baseline remains frozen.
4. UAT Authority is identified (Patrick Makundi).
5. Test data is clearly separated from historical business data.
6. Evidence capture method is defined (this record).
7. UAT execution has not yet occurred.
8. Any scenario marked NOT_READY / BLOCKED / OUT_OF_SCOPE has an explicit reason.
9. No scenario requires unauthorized F2-I12 implementation.
10. No scenario requires production access.

This record does **not** authorize UAT execution.

---

## UAT exit criteria (future; not production approval)

Future UAT may only be considered **complete as UAT** when:

- every **executable** scenario has an actual result;
- PASS/FAIL is recorded by the UAT Authority;
- an evidence reference exists;
- limitations are documented;
- failures are classified (A–F);
- defects are distinguished from governance decisions;
- gaps are not silently converted into implementation work;
- the UAT Authority records the final disposition.

Do **not** call that future result production approval, operational adoption, or full C1–C10 completion.

---

## Execution-log template (blank; copy per scenario)

```text
Scenario ID:
Tester: Patrick Makundi
Date/time:
Preconditions:
Demo data reference: (UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA)
Action/input:
Expected result:
Actual result:
PASS/FAIL:                    (UAT Authority only)
Evidence reference:
Finding classification:       (A / B / C / D / E / F / none)
Limitation:
UAT Authority comment:
```

Do not populate actual execution results in H-60.

---

## Shared expected-result locations

| Family | Where to look |
| --- | --- |
| Account facts | `GET/PUT /v1/crm/accounts/:id/commercial-facts` |
| Opportunity facts | `GET/PUT /v1/pipeline/opportunities/:id/commercial-facts` |
| RFP facts | `GET/PUT /v1/rfps/:id/commercial-facts` |
| Path B | `GET/PUT /v1/rfps/:id/path-b-approval` · `POST /v1/rfps/:id/path-b-approval/decision` |
| Rate identity | `GET/PUT /v1/suppliers/:supplierId/rates/:rateId/commercial-facts` · `GET /v1/costing/sheets/:id/rate-identities` |
| Programme + trace | `GET/PUT /v1/programmes/:id/commercial-facts` |
| KPI | `GET /v1/commercial/kpis/preview` → `metrics[]`, `dimensions` |
| Proposal generate | `POST /v1/proposals` |
| Proposal send | `POST /v1/proposals/:id/transitions` (to `sent`) |
| Mixed booking | `GET /v1/bookings` · `GET /v1/bookings/:id` |

Supporting technical tests (not UAT): `f2-i2` … `f2-i11` and kernel `commercial-contract.test.ts`.

---

## Readiness matrix

Legend for demo columns:

- **Seeded mixed?** Unlabelled preview seed identity (not F2).
- **Labelled F2 demo exists?** Sidecar facts named in H-59 data pack.
- **New demo required?** Operator must PUT/POST via existing APIs at execution.
- **Behaviour change?** Would creating that data require code/schema change?

Statuses used: `READY_FOR_UAT` · `READY_WITH_LIMITATION` · `NOT_READY` · `OUT_OF_SCOPE` · `BLOCKED`.

Not used: COMPLETE · APPROVED · PRODUCTION_READY · PRODUCTION_APPROVED.

### C1 — CRM

| ID | Capability | Execution surface | Endpoint / harness | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change to create data? | Expected result | Evidence required | Capture method | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C1-01 | C1 taxonomy / PCO distinct | Preview API | `PUT/GET .../crm/accounts/:id/commercial-facts`; kernel keys | Dev/Test preview; mixed account id | UAT-DEMO-ACC-PCO, ACC-EA; remaining 9 types via PUT or catalogue walk | Mixed orgs exist; type `incentive_house` ≠ F2 `pco` | **No** | **Yes** | **No** (existing PUT) | Eleven F2 types; `pco` ≠ `event_agency`; `isPco` only for `pco` | Request/response for PCO vs Event Agency + type list | API body + tester note | Mixed CRM taxonomy **not** rewritten; no F2 UI | READY_WITH_LIMITATION |
| UAT-C1-02 | C1 market ⊥ type; SA and UK | Preview API | same account facts | Mixed account(s) | UAT-DEMO-ACC-SA-IH `south_africa`; additional PUT `united_kingdom` | Seed “United Kingdom” is mixed free-text, **not** F2 `united_kingdom` | **No** | **Yes** | **No** | `south_africa` and `united_kingdom` accepted; not inferred from name/email/phone/destination; type independent | PUT/GET showing keys/labels | API body | Operator supplies market; no geo-inference (must not be added) | READY_WITH_LIMITATION |
| UAT-C1-03 | SOURCE ≠ CHANNEL | Preview API | `PUT/GET /v1/rfps/:id/commercial-facts` | Mixed RFP linked to SA incentive demo account | UAT-DEMO-RFP-01 e.g. `existing_partner_agency` + `email` | Mixed `RfpRecord.source` may exist; **not** F2 | **No** | **Yes** | **No** | Both dimensions explicit and independent | RFP facts GET | API body | SOURCE/CHANNEL live on **RFP**, not account | READY_WITH_LIMITATION |
| UAT-C1-04 | Reject invalid type/market | Preview API | account facts PUT | Any mixed account | Invalid `"VIP client"`, `"Cape Town"` | N/A | **No** | **Yes** (invalid payload) | **No** | `invalid_account_type` / `invalid_market`; GET unchanged | Error body | API body | Mixed free-text fields may still accept non-F2 values | READY_WITH_LIMITATION |

### C2 — Qualification

| ID | Capability | Execution surface | Endpoint / harness | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C2-01 | OR-01 + all OR-01-B + next action | Preview API | opportunity commercial-facts PUT/GET | Owner on opportunity | UAT-DEMO-OPP-01; nine conditions true; next action; **budget not required** | Mixed opp `OPP-2026-GLOB` exists; stage ≠ OR-01 | **No** | **Yes** | **No** | `qualificationStatus=qualified` only with all conditions + next action; `or01Qualified=true` | Payload + Patrick’s business notes | API + tester notes | Sidecar; `evidenceRefs` operator strings; Office not ingested | READY_WITH_LIMITATION |
| UAT-C2-02 | `new_qualified` ≠ qualification | Preview API + mixed GET opportunity | opportunity facts GET; mixed opportunity GET | Mixed stage `new_qualified`; sidecar not qualified | UAT-DEMO-OPP-02 | Create defaults stage `new_qualified` | **No** | **Yes** (sidecar) | **No** | `newQualifiedStageIsNotQualification`; KPI ignores stage | Side-by-side stage vs status | API | Mixed UI may still say “qualified” | READY_WITH_LIMITATION |
| UAT-C2-03 | Incomplete stays unqualified | Preview API | opportunity facts PUT | Incomplete conditions | OPP-02 variant | Seed not F2-qualified | **No** | **Yes** | **No** | `or01_b_conditions_incomplete` | Error body | API | Preview only | READY_WITH_LIMITATION |
| UAT-C2-04 | Qualification auditable | Preview API | opportunity facts GET after C2-01 | After qualified PUT | Same as C2-01 | No | **No** | Reuse C2-01 | **No** | Status, conditions, actor/time recoverable in-session | GET body | API | Lost on process restart (non-durable) | READY_WITH_LIMITATION |

### C3 — RFP / clarification / follow-up

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C3-01 | Explicit `receivedAt` ≠ `createdAt` | Preview API | RFP facts PUT/GET | Mixed RFP | UAT-DEMO-RFP-02 datetime ≠ mixed `createdAt` | Mixed POST may default `receivedAt` | **No** | **Yes** | **No** | Sidecar `receivedAtStatus=observed`; mixed default **not** F2 evidence | Sidecar vs mixed timestamps | API | Mailbox ingest **E**; mixed default non-authoritative | READY_WITH_LIMITATION |
| UAT-C3-02 | Clarification requested / answered | Preview API | RFP facts PUT events | Mixed RFP | Events with explicit `eventAt` | No F2 events | **No** | **Yes** | **No** | Both events retained; status change does not invent times | Event array | API | Observation, not full workflow | READY_WITH_LIMITATION |
| UAT-C3-03 | `firstResponseAt`; reject negative interval | Preview API | RFP facts PUT | `receivedAt` present | Valid later time; then earlier invalid | No | **No** | **Yes** | **No** | Valid stored; `negative_response_interval`; not `proposal.sentAt` | Success + error | API | Preview only | READY_WITH_LIMITATION |
| UAT-C3-04 | Response-time derived iff complete population | Preview API | `GET /v1/commercial/kpis/preview` | Every RFP in window has both timestamps | UAT-DEMO-KPI-POP complete | Seed RFPs lack sidecar timestamps | **No** | **Yes** (all RFPs in window) | **No** | `metrics[response_time].status=derived` | KPI JSON + population IDs | API | Population = preview-tenant RFPs in window, not Office history | READY_WITH_LIMITATION |
| UAT-C3-05 | Incomplete timestamps → unavailable | Preview API | KPI GET | ≥1 RFP missing sidecar times | UAT-DEMO-RFP-03 in same window | Default missing sidecar | **No** | **Yes** | **No** | `unavailable`; reason `insufficient_timestamps_no_complete_received_to_response_chain`; incomplete not dropped | KPI JSON | API | Preview population | READY_WITH_LIMITATION |

### C4 — Programme / itinerary

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C4-01 | Programme identity ↔ RFP | Preview API | `GET /v1/programmes/:id/commercial-facts` | Mixed programme with `rfpId` | UAT-DEMO-PRG-01 | Mixed PRG-2026-0847 chain exists | **No** (F2 observation) | PUT optional; GET uses mixed FK | **No** | `rfpStatus=observed` if mixed FK present; no invented link | Programme facts | API | Office remains itinerary SoR | READY_WITH_LIMITATION |
| UAT-C4-02 | Programme facts ≠ RFP identity | Preview API | Programme GET vs RFP GET | Same | Same | Mixed ids distinct | **No** | **No** beyond GET | **No** | Programme id ≠ RFP id | Both GETs | API | Version observe only if mixed version exists | READY_WITH_LIMITATION |
| UAT-C4-03 | Missing costing/proposal unavailable | Preview API | Programme facts GET | Programme without matching sheets **or** mismatched FKs | UAT-DEMO-CST-02 | Seed chain may already have matching FKs — mismatch record may need extra mixed sheet **or** observe incomplete programme | Partial | **Yes** if seed already complete | **No** if extra mixed create via existing costing POST | Completeness `partial`/`unavailable`; unsupported IDs listed; nothing fabricated | Trace object | API | Identifiers only; item/costing consistency not validated | READY_WITH_LIMITATION |

### C5 — Costing / supplier rates

Five **source classes:** `direct_supplier_contract`, `supplier_contracted_rate_sheet`, `written_supplier_quotation`, `trade_partner_net_agreement`, `public_benchmark`.  
Five **rate types** (H-29/I1/I6; not four): `negotiated_contracted`, `trade_net`, `public`, `promotional`, `quoted_ad_hoc`.

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C5-01 | OR-08 identity | Preview API | rate commercial-facts PUT/GET | Mixed supplier+rate | UAT-DEMO-RATE-01 | Mixed rates in seed | **No** | **Yes** | **No** | Supplier, source class, type, original currency, season, validity, expiry state, version, item identity | Identity GET | API | `CostSheetVersion.snapshot` **not** written — reconstruction **C** | READY_WITH_LIMITATION |
| UAT-C5-02 | Five source classes distinct | Preview API | rate facts PUT | Distinct mixed rates or sequential | Five class keys | Mixed rates exist | **No** | **Yes** | **No** | Five classes; invalid rejected | GETs | API | Do not describe as four classes | READY_WITH_LIMITATION |
| UAT-C5-03 | Five rate types distinct | Preview API | rate facts PUT | Distinct identities | Five type keys | No F2 types | **No** | **Yes** | **No** | Five types distinct | GETs | API | Prompt “four types” not adopted | READY_WITH_LIMITATION |
| UAT-C5-04 | Original currency; no FX | Preview API | rate facts | RATE-01 e.g. ZAR | ISO-4217 | Mixed currency fields exist | **No** | **Yes** | **No** | Currency preserved; no conversion | Currency field | API | FX **E / OUT_OF_SCOPE** | READY_WITH_LIMITATION |
| UAT-C5-05 | Overlap; no auto-winner | Preview API | two rate identities | Overlapping validity | UAT-DEMO-RATE-02 | Mixed `preferredInConflict` may exist — **not** F2 winner | **No** | **Yes** | **No** | Both visible; `version_identity_exists` on rewrite | Two GETs | API | F1-C-03 live choice not automated | READY_WITH_LIMITATION |
| UAT-C5-06 | FK trace completes only when aligned | Preview API | programme commercial-facts | On-trace vs mismatch | CST-01, PROP-01, CST-02 | Seed may be on-trace | **No** F2 view until GET | Mismatch may need extra mixed record | **No** | Complete iff programmeId **and** rfpId (and proposal costSheetId on-trace); no sellPrice-as-revenue | Trace JSON | API | Identifiers only | READY_WITH_LIMITATION |

### C6 — Approval

Path B categories declared, never inferred. Eight qualitative keys in kernel `PATH_B_EXCEPTIONAL_APPROVAL_CATEGORIES`.

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C6-01 | No Path B category | Preview API | Path B GET; `POST /v1/proposals` | Empty categories | UAT-DEMO-RFP-04 | Mixed 250k approval may exist on seed — **ignore as F2** | **No** | **Yes** (Path B default not_required) | **No** | `required=false` `not_required`; generate allowed | Path B + generate | API | Durable mixed gate still 250k | READY_WITH_LIMITATION |
| UAT-C6-02 | One outstanding blocks | Preview API | Path B PUT; generate/send | One pending category | UAT-DEMO-RFP-05 | No | **No** | **Yes** | **No** | `path_b_approval_required` | Error body | API | Preview generate/send only | READY_WITH_LIMITATION |
| UAT-C6-03 | Multiple categories preserved | Preview API | Path B PUT/GET | ≥2 categories | UAT-DEMO-RFP-06 | No | **No** | **Yes** | **No** | Array preserved; no rank/score | GET body | API | Declared not inferred | READY_WITH_LIMITATION |
| UAT-C6-04 | Approve then progress | Preview API | `POST .../path-b-approval/decision`; generate | Pending then approved | Same RFP | No | **No** | **Yes** | **No** | `status=approved`; generate allowed | Decision + generate | API | Needs principal with commercial-approval permission (carol.admin in preview) | READY_WITH_LIMITATION |
| UAT-C6-05 | No ranking / numerical CPR | Preview API | Inspect Path B JSON from C6-01–04 | — | Same | Mixed 250k residual | **No** | Reuse | **No** | No score, rank, 250k, 20% in **F2 Path B** payload | Path B JSON | API | Mixed residual documented in C6-06 | READY_WITH_LIMITATION |
| UAT-C6-06 | Legacy 250k/20% residual visibility | Observation | Mixed `evaluateCommercialApprovalGate` / `DEFAULT_SELL_THRESHOLD_USD` | Durable/mixed C7 still present | None as F2 rule | Mixed seed uses 250k budget fields | N/A | **No** | **Must not** replace mixed gate | Written acknowledgement: residual **not** Owner/F2 Path B authority | This sheet + mixed observation | Notes | Replacement **not authorized**; not a PASS of 250k | READY_WITH_LIMITATION |

### C7 — Proposal

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C7-01 | Generate; Path B not required | Preview API | `POST /v1/proposals` | Cost sheet + programme + RFP; Path B not_required | May reuse seed chain after Path B default | Mixed PROP may already exist | Path B sidecar **No** | Path B GET/PUT as needed | **No** | 2xx generate on preview without 250k Path B force | Proposal id | API | Durable generate still mixed-gated | READY_WITH_LIMITATION |
| UAT-C7-02 | Generate after Path B approved | Preview API | POST proposals | After C6-04 | RFP-05/06 approved | No | **No** | Reuse | **No** | 2xx | Proposal id + Path B status | API | Preview | READY_WITH_LIMITATION |
| UAT-C7-03 | Outstanding Path B blocks generate | Preview API | POST proposals | Pending Path B | RFP-05 pending | No | **No** | Reuse | **No** | `path_b_approval_required` | Error | API | Preview | READY_WITH_LIMITATION |
| UAT-C7-04 | RFP→Programme→Costing→Proposal trace | Preview API | programme commercial-facts | On-trace FKs | UAT-DEMO-PROP-01 | Seed chain likely aligned | **No** F2 GET until called | GET sufficient if FKs match | **No** | `trace.completeness=complete` when aligned | Trace JSON | API | Not OR-08 freeze / snapshot | READY_WITH_LIMITATION |
| UAT-C7-05 | Proposal value ≠ revenue | Preview API | KPI `revenue` + proposal GET | Any proposal | None manufactured | Mixed sellPrice exists | N/A | **No** | **No** | `metrics` revenue `status=unavailable`; do not treat sellPrice as revenue | KPI + proposal | API | Mixed prices exist; must not be labelled revenue | READY_FOR_UAT |

### C8 — Booking / commercial conversion

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C8-01 | Booking linked where FKs exist | Mixed booking API | `GET /v1/bookings/:id` | Mixed booking | UAT-DEMO-BKG-01 | Seed booking likely exists | No F2 booking sidecar | **No** if seed booking present | **No** | `opportunityId` / `rfpId` / `programmeId` as stored; no invented win copies | Booking JSON | API | Mixed only | READY_WITH_LIMITATION |
| UAT-C8-02 | Conversion without numerical thresholds | Preview KPI | `GET /v1/commercial/kpis/preview` | Qualified sidecar + ≥0 bookings | Explicit qualification; optional booking | Seed booking exists; not F2-qualified until PUT | **No** | **Yes** (qualification facts) | **No** | Derived only if qualified>0 **and** bookings>0; formula non-cancelled linked to qualified / qualified; `legacySellThresholdApplied=false`; no 250k | Conversion metric | API | Mixed booking statuses | READY_WITH_LIMITATION |
| UAT-C8-03 | Cancelled vs conversion | Preview KPI + booking | KPI GET | Would need `status=cancelled` | UAT-DEMO-BKG-CX | Create always `confirmed`; **no cancel route** in `booking/` | **No** | Cannot via frozen public API | **Yes if code added** — **forbidden** | Formula **would** exclude cancelled **if** such a record existed. Actual UAT: document **cannot construct cancelled booking** without mixed rewrite. Do not manufacture cancel. | Code/API observation + KPI with confirmed-only set | API + limitation note | Capability gap for **creating** cancelled via API (**C**); formula present (**not** a fake PASS of cancellation) | READY_WITH_LIMITATION |
| UAT-C8-04 | Unavailable booking behaviours | Governance observation | None | Frozen baseline | None | Mixed FKs only | N/A | **Must not** invent | **Must not** implement I12 | Gap list: win-time Market/type/SOURCE/CHANNEL copies; repeat-from-booking; durable F2 booking facts; Office conversion as EOS SoR; finance as revenue | This matrix | Notes | H-58 Option A | NOT_READY |

### C9 — Commercial / account relationship

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C9-01 | Type ⊥ market | Preview API | account facts (reuse C1-01/02) | Same as C1 | Same | No F2 | **No** | Reuse C1 | **No** | Independent dimensions | C1 evidence | API | Preview | READY_WITH_LIMITATION |
| UAT-C9-02 | SOURCE ⊥ CHANNEL | Preview API | RFP facts (reuse C1-03) | Same | Same | Mixed source collapsed | **No** | Reuse | **No** | Independent | C1-03 evidence | API | On RFP not account | READY_WITH_LIMITATION |
| UAT-C9-03 | Repeat = `existing_client_repeat` only | Preview KPI | KPI `repeat_business` | One RFP with that SOURCE; one without (similar name OK) | Explicit SOURCE | No | **No** | **Yes** | **No** | Count only explicit SOURCE; names/~3 bookings do not infer | KPI + SOURCE values | API | Not prior-booking evidence; DR-008 **E** | READY_WITH_LIMITATION |
| UAT-C9-04 | Booking win-dimension | None in baseline | No booking commercial-facts route | Frozen I1–I11 | None | No | N/A | **Must not** add I12 | **Must not** | Record **NOT_READY**; do not PASS | Absence of route | Notes | H-58 Option A | NOT_READY |

### C10 — KPI / commercial reporting

`GET /v1/commercial/kpis/preview` only. Mixed J3 **forbidden** as evidence.

| ID | Capability | Execution surface | Endpoint | Starting state | Demo required | Seeded mixed? | Labelled F2 demo exists? | New demo required? | Behaviour change? | Expected result | Evidence | Capture | Limitation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C10-01 | RFP volume | Preview KPI | KPI GET | Preview RFPs in window | Count live preview set; **not** ~25 | Seed RFPs exist | N/A | Optional extra RFPs via existing POST | **No** | `rfp_volume` observed = non-archived RFPs in window | Metric + list | API | Preview set ≠ historical volume | READY_WITH_LIMITATION |
| UAT-C10-02 | Qualified count | Preview KPI | KPI GET | Sidecar qualifications | Explicit `qualified` vs stage | Stage `new_qualified` common | **No** | **Yes** | **No** | Count `qualificationStatus === qualified` only | Metric + facts | API | Preview | READY_WITH_LIMITATION |
| UAT-C10-03 | Conversion completeness | Preview KPI | KPI GET | With and without bookings/qualified | Explicit facts; **not** ~12% | Seed may have bookings | **No** | **Yes** (qualification) | **No** | Derived only if qualified>0 and bookings>0; else unavailable `no_booking_outcome_facts_in_population` or `no_qualified_opportunities_in_population` | Conversion object | API | Mixed bookings | READY_WITH_LIMITATION |
| UAT-C10-04 | Response-time derivation | Preview KPI | KPI GET | See C3-04 / C3-05 | Complete vs incomplete | No sidecar times | **No** | **Yes** | **No** | Derived iff complete explicit timestamps; else unavailable | Metric | API | Preview | READY_WITH_LIMITATION |
| UAT-C10-05 | Pipeline = explicit `estimatedValue` | Preview KPI | KPI GET | Some opps with value, some without | Explicit numbers; **no 250k filter** | Seed may have values | Mixed field exists | Optional PUT mixed estimatedValue via existing opportunity API | **No** | Sum explicit only; `legacyApprovalThresholdApplied=false` | Pipeline metric | API | Missing not invented | READY_WITH_LIMITATION |
| UAT-C10-06 | Repeat SOURCE only | Preview KPI | KPI GET | Reuse C9-03 | Explicit SOURCE | No | **No** | Reuse | **No** | Explicit `existing_client_repeat` only | Repeat metric | API | Preview | READY_WITH_LIMITATION |
| UAT-C10-07 | Revenue unavailable | Preview KPI | KPI GET | Any | **Do not manufacture revenue** | Mixed sell/cost exist | N/A | **No** | **No** | `revenue.status=unavailable`; no costing/proposal/booking substitution | Revenue object | API | Finance out | READY_FOR_UAT |
| UAT-C10-08 | Profit unavailable | Preview KPI | KPI GET | Any | **Do not manufacture profit / margin-as-profit** | Mixed margin exists | N/A | **No** | **No** | `profit_per_booking.status=unavailable` | Profit object | API | Costing margin ≠ profit | READY_FOR_UAT |
| UAT-C10-09 | Provenance | Preview KPI | KPI GET | Any | — | — | N/A | **No** | **No** | Each metric: status, unit, period, population, calculation method, source facts, data sufficiency | Full metrics array | API | Preview | READY_WITH_LIMITATION |
| UAT-C10-10 | Segmentation independence | Preview KPI | `dimensions.byMarket/byAccountType/bySource/byChannel` | After C1/C3 facts | Independent facts | Empty maps until sidecar PUTs | **No** | **Yes** | **No** | Dimensions independent; missing → no invented bucket | `dimensions` object | API | Empty until facts PUT | READY_WITH_LIMITATION |

---

## Counts

| Status | Count | IDs |
| --- | --- | --- |
| READY_FOR_UAT | **3** | UAT-C7-05, UAT-C10-07, UAT-C10-08 |
| READY_WITH_LIMITATION | **46** | All others except the two NOT_READY |
| NOT_READY | **2** | UAT-C8-04, UAT-C9-04 |
| OUT_OF_SCOPE | **0** scenarios (mailbox/FX/DR-008/numerical CPR appear as **limitations / class E** on executable rows) | — |
| BLOCKED | **0** scenarios (250k **replacement** is unauthorized; C6-06 is residual **observation**) | — |
| **Total inventoried** | **51** | UAT-C1-01…C1-04, C2-01…04, C3-01…05, C4-01…03, C5-01…06, C6-01…06, C7-01…05, C8-01…04, C9-01…04, C10-01…10 |

No scenario requires F2-I12. No scenario requires production access. Executable scenarios use existing preview/mixed APIs only.

---

## Next governance gate

```text
NEXT GATE = UAT AUTHORITY REVIEW OF EXECUTION READINESS
            THEN A SEPARATE OWNER DECISION ON WHETHER
            CONTROLLED PREVIEW-ONLY UAT EXECUTION MAY BEGIN

THAT AUTHORIZATION IS NOT GRANTED BY THIS RECORD
F2-I12 = NOT AUTHORIZED
UAT EXECUTION = NOT EXECUTED
```

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT | **NOT EXECUTED** |
| F2-I12 | **NOT AUTHORIZED** |
| Application / schema / migration / persist | **NOT MODIFIED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** / **NOT READY** |
| Operational adoption | **NOT CLAIMED** |
| Full C1–C10 completion | **NOT CLAIMED** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

```text
GPTA-H-60 STATUS = UAT EXECUTION READINESS AND EVIDENCE PREPARATION COMPLETED
```
