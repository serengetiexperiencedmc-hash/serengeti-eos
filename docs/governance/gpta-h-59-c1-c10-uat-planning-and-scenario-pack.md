# GPTA-H-59 — C1–C10 UAT Planning and Scenario Pack

> **`UAT PLANNING ONLY`**  
> **`UAT NOT EXECUTED`**  
> **`NO F2-I12 IMPLEMENTATION AUTHORIZED`**  
> **`F2 CONTROLLED PAUSE PRESERVED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / GATE B CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:00:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-58 historical bodies are **not rewritten**. Application code is **not modified**. No scenario in this pack is a development increment.

---

## Governing question

What exactly must **Patrick Makundi** (UAT Authority) demonstrate, using controlled Dev/Test evidence, before any F2 capability can be considered UAT-approved?

Automated tests (F2-I1–I11) are **technical evidence**. They do **not** prove the business process. UAT evaluates workflow behaviour against H-29 rules on the frozen preview baseline.

```text
UAT EXECUTION STATUS = NOT EXECUTED
NO F2-I12 IMPLEMENTATION AUTHORIZED
```

Only the UAT Authority may later assign **PASS** / **FAIL**. This record uses planning classifications only:

`READY_FOR_UAT` · `READY_WITH_LIMITATION` · `NOT_READY` · `OUT_OF_SCOPE` · `BLOCKED`

Do **not** use `COMPLETE`, `PRODUCTION_READY`, or `APPROVED` at planning stage.

---

## Repository state

Inspected before this record:

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` — **confirmed** |
| Index | **EMPTY** |
| Working tree | **DIRTY** — Class A/B and F2-I1–I11 **preserved** |
| Application / schema / persist / Gate B | **NOT MODIFIED** |
| Commit / push | **NOT PERFORMED** |

---

## F2 authorization context

| Item | Controlling status |
| --- | --- |
| GPTA-H-44 | F2 **AUTHORIZED** — C1–C10 Dev/Test only |
| GPTA-H-58 | **OPTION A — CONTROLLED PAUSE** |
| F2-I1–I11 | Frozen Dev/Test evidence baseline |
| F2-I12 | **NOT STARTED** / **NOT AUTHORIZED** |
| C9 booking win-dimension preview | **NOT IMPLEMENTED** |
| C1–C10 | At best **partially implemented** |
| F2 facts | Preview-only, non-durable (durable routes 409 `f2_iN_in_memory_preview_only`) |
| Operational SoR | Office, Excel, Outlook/Gmail, WhatsApp, phone |
| Production / deployment / migration | **NOT AUTHORIZED** |
| Gate B | **UNTOUCHED** |
| E1 / E1-B / E1-D | Unresolved-blocked / paused / parked |

**Technical Increment Owner** = Patrick Makundi.  
**UAT Authority** = Patrick Makundi.  
**Combined role** = YES.  
Functions remain distinct: technical evidence ≠ UAT evidence.

Identified UAT environment (not production): Dev/Test **in-memory preview** (historical local preview: API `127.0.0.1:8080`, web `http://localhost:3001/commercial/`). Durable PostgreSQL F2 facts are **out of this pack**.

---

## Numbering

H-29 / H-34 / H-45 C-spine remains **controlling** for requirements:

C1 CRM · C2 Opportunity · C3 RFP · C4 Supplier rates · C5 Programme · C6 Costing · C7 Approval · C8 Proposal · C9 Booking · C10 KPI.

This pack’s **scenario IDs** follow the H-58 / H-59 commissioning headings (same shifted map as H-57 prompt inventory):

| UAT-C ID | Heading in this pack | H-29 capability |
| --- | --- | --- |
| UAT-C1 | CRM | C1 |
| UAT-C2 | Qualification | C2 |
| UAT-C3 | RFP / clarification / follow-up | C3 |
| UAT-C4 | Programme / itinerary | C5 |
| UAT-C5 | Costing / supplier rates | C4 + C6 |
| UAT-C6 | Approval | C7 |
| UAT-C7 | Proposal | C8 |
| UAT-C8 | Booking / conversion | C9 |
| UAT-C9 | Commercial / account relationship | C1 (+ AC-C9-02 residual) |
| UAT-C10 | KPI / reporting | C10 |

Scenario IDs are **not** a redefinition of H-29.

---

## Evidence capture (required at later execution)

For every executed scenario, capture:

| Field | Required |
| --- | --- |
| Input / business situation | Yes |
| Action performed | Yes |
| System response | Yes |
| Expected result | Yes |
| Actual result | Yes |
| Pass / fail | Yes — UAT Authority only |
| Evidence reference (screenshot, response body, record IDs) | Yes |
| Tester / date | Patrick Makundi / date of execution |
| Limitation / exception | Yes if any |

Do **not** mark PASS solely because an automated test exists.

---

## UAT data pack

All demonstration records are:

```text
UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA
```

Do **not** seed or compare against the unaudited H-14 estimate (~25 RFPs / ~3 bookings / ~12%).

| Demo ID | Purpose | Required facts |
| --- | --- | --- |
| UAT-DEMO-ACC-SA-IH | South African incentive house | `accountType=incentive_house_agency`, `market=south_africa` |
| UAT-DEMO-ACC-PCO | PCO distinctness | `accountType=pco` (not `event_agency`) |
| UAT-DEMO-ACC-EA | Event Agency contrast | `accountType=event_agency` |
| UAT-DEMO-OPP-01 | Qualification happy path | Owner set; all nine OR-01-B conditions true; next action defined |
| UAT-DEMO-OPP-02 | Incomplete / stage trap | Mixed stage `new_qualified`; sidecar `not_yet_assessed` or incomplete conditions |
| UAT-DEMO-RFP-01 | SA incentive example | Linked to ACC-SA-IH; `primarySource` + `channel` both explicit |
| UAT-DEMO-RFP-02 | Timestamp complete | Explicit ISO `receivedAt` and later `firstResponseAt` |
| UAT-DEMO-RFP-03 | Timestamp incomplete | No sidecar `receivedAt` and/or `firstResponseAt` |
| UAT-DEMO-RFP-04 | Path B none | Path B categories empty / `not_required` |
| UAT-DEMO-RFP-05 | Path B one outstanding | One declared category, status `pending` |
| UAT-DEMO-RFP-06 | Path B multiple | ≥2 declared categories preserved |
| UAT-DEMO-RATE-01 | OR-08 identity | All identity fields; original currency ISO-4217; no FX |
| UAT-DEMO-RATE-02 | Overlap | Second identity overlapping validity; no auto-winner |
| UAT-DEMO-PRG-01 | Programme identity | Mixed `rfpId` match |
| UAT-DEMO-CST-01 | On-trace costing | `programmeId` **and** `rfpId` match programme |
| UAT-DEMO-CST-02 | Off-trace costing | Mismatched FK |
| UAT-DEMO-PROP-01 | On-trace proposal | programme + rfp + on-trace `costSheetId` |
| UAT-DEMO-BKG-01 | Linked booking | Mixed `opportunityId` / `rfpId` / `programmeId` where present |
| UAT-DEMO-BKG-CX | Cancelled booking | Mixed `status=cancelled` |
| UAT-DEMO-KPI-POP | KPI population | Explicit set of preview RFPs/opportunities for completeness tests |

Do **not** invent live customer history. Mixed CRM/RFP/programme/costing/proposal/booking **create** APIs may be used only to build these labelled demo records in Dev/Test.

---

## Preview surfaces in scope (exist today)

| Surface | Route / behaviour |
| --- | --- |
| Account facts | `GET/PUT /v1/crm/accounts/:id/commercial-facts` |
| Opportunity facts | `GET/PUT /v1/pipeline/opportunities/:id/commercial-facts` |
| Ownership transfer | `POST .../commercial-facts/transfers` |
| RFP facts (SOURCE/CHANNEL, timestamps, clarification) | `GET/PUT /v1/rfps/:id/commercial-facts` |
| Path B | `GET/PUT /v1/rfps/:id/path-b-approval`, `POST .../decision` |
| Rate identity | `GET/PUT /v1/suppliers/:supplierId/rates/:rateId/commercial-facts` |
| Costing rate identities | `GET /v1/costing/sheets/:id/rate-identities` |
| Programme facts + trace | `GET/PUT /v1/programmes/:id/commercial-facts` |
| KPI preview | `GET /v1/commercial/kpis/preview` |
| Proposal generate / send | Mixed proposal generate and `sent` transition, gated by `evaluatePreviewPathBSend` on preview |
| Mixed booking identity | Existing booking records (`rfpId`, `programmeId`, `opportunityId`, `status`) |

Durable SoR: same F2 fact routes return conflict `f2_iN_in_memory_preview_only`. **Not** UAT targets in this pack.

---

## Scenario register (summary)

| ID | Classification | Why |
| --- | --- | --- |
| UAT-C1-01 | READY_WITH_LIMITATION | Preview account taxonomy; mixed CRM types not F2-authoritative |
| UAT-C1-02 | READY_WITH_LIMITATION | Preview market; not inferred — operator must not invent inference |
| UAT-C1-03 | READY_WITH_LIMITATION | SOURCE/CHANNEL on **RFP** facts, not account |
| UAT-C1-04 | READY_WITH_LIMITATION | Preview rejects invalid type/market |
| UAT-C2-01 | READY_WITH_LIMITATION | Sidecar OR-01-B; operator judgement is the business act |
| UAT-C2-02 | READY_WITH_LIMITATION | `new_qualified` ≠ qualification |
| UAT-C2-03 | READY_WITH_LIMITATION | Incomplete conditions cannot be `qualified` |
| UAT-C2-04 | READY_WITH_LIMITATION | Sidecar evidence refs / conditions auditable in preview |
| UAT-C3-01 | READY_WITH_LIMITATION | Explicit `receivedAt`; mixed default `now` is not F2 evidence |
| UAT-C3-02 | READY_WITH_LIMITATION | Clarification events observation, not full workflow |
| UAT-C3-03 | READY_WITH_LIMITATION | Explicit `firstResponseAt`; negative interval rejected |
| UAT-C3-04 | READY_WITH_LIMITATION | KPI derived only if **entire** preview RFP population complete |
| UAT-C3-05 | READY_WITH_LIMITATION | Incomplete population → unavailable, not dropped |
| UAT-C4-01 | READY_WITH_LIMITATION | Programme identity observation |
| UAT-C4-02 | READY_WITH_LIMITATION | Programme facts ≠ RFP identity |
| UAT-C4-03 | READY_WITH_LIMITATION | Missing costing/proposal stay unavailable |
| UAT-C5-01 | READY_WITH_LIMITATION | OR-08 sidecar identity |
| UAT-C5-02 | READY_WITH_LIMITATION | Five source classes |
| UAT-C5-03 | READY_WITH_LIMITATION | **Five** approved rate types (not four — see scenario) |
| UAT-C5-04 | READY_WITH_LIMITATION | Original currency; no FX |
| UAT-C5-05 | READY_WITH_LIMITATION | Overlap visible; no auto-winner |
| UAT-C5-06 | READY_WITH_LIMITATION | I11 FK alignment |
| UAT-C6-01 | READY_WITH_LIMITATION | Path B `not_required` |
| UAT-C6-02 | READY_WITH_LIMITATION | Outstanding blocks generate/send |
| UAT-C6-03 | READY_WITH_LIMITATION | Multiple categories preserved |
| UAT-C6-04 | READY_WITH_LIMITATION | Approved permits progression |
| UAT-C6-05 | READY_WITH_LIMITATION | No numerical Path B threshold |
| UAT-C6-06 | READY_WITH_LIMITATION | Document mixed 250k/20% residual — **not** Owner rule |
| UAT-C7-01 | READY_WITH_LIMITATION | Preview generate, no Path B |
| UAT-C7-02 | READY_WITH_LIMITATION | Generate after Path B approved |
| UAT-C7-03 | READY_WITH_LIMITATION | Outstanding → `path_b_approval_required` |
| UAT-C7-04 | READY_WITH_LIMITATION | Trace identifiers when FKs align |
| UAT-C7-05 | READY_FOR_UAT | Must **not** label proposal values as revenue |
| UAT-C8-01 | READY_WITH_LIMITATION | Mixed booking FKs only |
| UAT-C8-02 | READY_WITH_LIMITATION | Conversion formula has no 250k/20% |
| UAT-C8-03 | READY_WITH_LIMITATION | Cancelled excluded from conversion numerator |
| UAT-C8-04 | NOT_READY | Record unavailable booking behaviours |
| UAT-C9-01 | READY_WITH_LIMITATION | Type ⊥ market |
| UAT-C9-02 | READY_WITH_LIMITATION | SOURCE ⊥ CHANNEL |
| UAT-C9-03 | READY_WITH_LIMITATION | Repeat = explicit `existing_client_repeat` only |
| UAT-C9-04 | NOT_READY | Booking win-dimension not implemented |
| UAT-C10-01 | READY_WITH_LIMITATION | RFP volume observed in preview set |
| UAT-C10-02 | READY_WITH_LIMITATION | Qualified = sidecar `qualified` only |
| UAT-C10-03 | READY_WITH_LIMITATION | Conversion formula + completeness |
| UAT-C10-04 | READY_WITH_LIMITATION | Response time complete-population rule |
| UAT-C10-05 | READY_WITH_LIMITATION | Pipeline = explicit `estimatedValue`; no 250k filter |
| UAT-C10-06 | READY_WITH_LIMITATION | Repeat SOURCE only |
| UAT-C10-07 | READY_FOR_UAT | Revenue **unavailable** |
| UAT-C10-08 | READY_FOR_UAT | Profit **unavailable** |
| UAT-C10-09 | READY_WITH_LIMITATION | Provenance fields present |
| UAT-C10-10 | READY_WITH_LIMITATION | Independent segmentation dimensions |

A failed or unavailable later execution is **governance evidence**, not automatic authorization for F2-I12 or any other increment.

---

## Shared fail criteria

Fail if any of: expected F2 fact is inferred; mixed field treated as F2-authoritative; ~25/~3/~12% used as baseline; 250k/20% applied as Owner rule; revenue/profit substituted from costing/proposal/booking; durable persist claimed; UAT marked PASS from unit tests alone.

---

## C1 — CRM

### UAT-C1-01 — Account taxonomy and PCO distinctness

| Field | Content |
| --- | --- |
| C capability | C1 CRM (H-29 C1) |
| Business objective | Operator can identify a buyer using the approved OR-03 taxonomy; PCO is not Event Agency. |
| Preconditions | Dev/Test preview; mixed account exists or is created as **UAT DEMO DATA**. |
| Test data | UAT-DEMO-ACC-PCO, UAT-DEMO-ACC-EA, plus one record per remaining type **or** catalogue walk with PUT of each key. |
| User action | PUT account commercial-facts with each approved type; contrast `pco` vs `event_agency`. |
| Expected business result | Eleven approved types available; PCO remains distinct. |
| Expected system evidence | Keys: `incentive_house_agency`, `event_agency`, `pco`, `corporate_end_client`, `corporate_travel_tmc`, `travel_agency_advisor`, `tour_operator_wholesale`, `destination_event_specialist`, `association_non_profit`, `government_public_sector`, `other_strategic_partner`. View: `isPco=true` only for `pco`; `pcoIsDistinctFromEventAgency`. |
| Pass criteria | Each type accepted by preview contract; PCO ≠ Event Agency. |
| Fail criteria | PCO collapsed into Event Agency; free-text type silently stored as F2 fact. |
| Evidence to capture | Request/response for PCO and Event Agency plus catalogue list. |
| Known limitation | Mixed `CrmAccount` org types are **not** F2-authoritative. Preview only. |
| UAT status | **NOT EXECUTED**. Classification: **READY_WITH_LIMITATION**. |

### UAT-C1-02 — Market independent of buyer type

| Field | Content |
| --- | --- |
| C capability | C1 / OR-03-M |
| Business objective | Geographic market is a separate dimension; South Africa is a catalogue value. |
| Preconditions | UAT-DEMO-ACC-SA-IH. |
| Test data | `market=south_africa` with `accountType=incentive_house_agency`. Do not derive market from destination, email, phone, or name. |
| User action | PUT market and type independently; attempt to leave market unset while setting type. |
| Expected business result | South Africa stored as `south_africa` / label “South Africa”. Type and market independent. |
| Expected system evidence | `accountTypeIndependentOfMarket=true`, `marketIndependentOfAccountType=true`. Mixed `account.market` free-text is **not** the F2 market. |
| Pass criteria | Market not inferred by the system from name/contact/destination. |
| Fail criteria | Market invented from email domain, phone, or itinerary destination. |
| Evidence to capture | PUT/GET of SA incentive house. |
| Known limitation | Operator still supplies market; there is no geo-inference engine (and must not be). |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C1-03 — SOURCE ≠ CHANNEL (SA incentive example)

| Field | Content |
| --- | --- |
| C capability | C1/C3 OR-07 (facts live on **RFP**, not account) |
| Business objective | Origin of demand is not the intake path. |
| Preconditions | UAT-DEMO-ACC-SA-IH + UAT-DEMO-RFP-01. |
| Test data | Example (demo only): `primarySource=existing_partner_agency`, `channel=email`. |
| User action | PUT RFP commercial-facts SOURCE and CHANNEL; GET both. |
| Expected business result | Both present and independently changeable. |
| Expected system evidence | `primarySource` and `channel` on `/v1/rfps/:id/commercial-facts`. Mixed `RfpRecord.source` **not** F2-authoritative. |
| Pass criteria | SOURCE and CHANNEL both explicit and different dimensions. |
| Fail criteria | Single collapsed “source” used as F2 evidence. |
| Evidence to capture | RFP facts GET showing both fields. |
| Known limitation | Not stored on the account sidecar. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C1-04 — Reject unsupported type/market

| Field | Content |
| --- | --- |
| C capability | C1 preview contract |
| Business objective | Free-text taxonomy is not silently accepted as F2 fact. |
| Preconditions | Any preview account. |
| Test data | `accountType="VIP client"`, `market="Cape Town"`. |
| User action | PUT invalid values. |
| Expected business result | Rejection; no silent coerce. |
| Expected system evidence | `invalid_account_type` / `invalid_market`. |
| Pass criteria | 4xx with those reasons; GET unchanged. |
| Fail criteria | Invalid string stored as F2 type/market. |
| Evidence to capture | Error body. |
| Known limitation | Mixed CRM may still accept free-text on **non-F2** fields. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

---

## C2 — Qualification

### UAT-C2-01 — OR-01 with all OR-01-B conditions

| Field | Content |
| --- | --- |
| C capability | C2 / OR-01 |
| Business objective | A realistic RFP is qualified only when the operator attests all mandatory conditions. |
| Preconditions | Owner on opportunity (preview rejects qualification without owner). |
| Test data | UAT-DEMO-OPP-01 + linked RFP. Conditions all true: buyer/account fit; genuine requirement; destination/service fit; approximate dates/decision window; sufficient scope; approximate group size/profile; buying process known/active; commercial viability credible; defined next action. |
| User action | Patrick evaluates the **business** RFP (demo), then PUT opportunity commercial-facts `qualificationStatus=qualified` with all nine conditions and next action. |
| Expected business result | Opportunity is OR-01 qualified. Stage is irrelevant. |
| Expected system evidence | `or01Qualified=true`; `qualificationStatus=qualified`; conditions map all true. Reject `or01_b_conditions_incomplete` if any false. |
| Pass criteria | Qualified only with complete OR-01-B + next action. Patrick records **why** each condition is met (business judgement). |
| Fail criteria | Qualified with missing conditions; or API success treated as business proof without Patrick’s judgement notes. |
| Evidence to capture | Condition payload + Patrick’s written assessment against the demo RFP. |
| Known limitation | Sidecar does not ingest Office/email evidence; `evidenceRefs` are operator-supplied strings. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C2-02 — `new_qualified` is not qualification

| Field | Content |
| --- | --- |
| C capability | C2 |
| Business objective | Workflow stage must not be read as OR-01. |
| Preconditions | UAT-DEMO-OPP-02 with mixed `stage=new_qualified` and sidecar `not_yet_assessed` or `not_qualified`. |
| Test data | As above. |
| User action | GET opportunity commercial-facts; GET mixed opportunity. |
| Expected business result | Not treated as qualified. |
| Expected system evidence | `newQualifiedStageIsNotQualification=true` when stage is `new_qualified` and status ≠ `qualified`. KPI qualified count ignores stage. |
| Pass criteria | Patrick states stage ≠ qualification. |
| Fail criteria | Stage used as qualified count. |
| Evidence to capture | Side-by-side stage vs `qualificationStatus`. |
| Known limitation | Mixed UI may still label the stage “qualified”. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C2-03 — Incomplete RFP does not become qualified via stage

| Field | Content |
| --- | --- |
| C capability | C2 |
| Business objective | Incomplete commercial case stays unqualified. |
| Preconditions | Opportunity with incomplete OR-01-B. |
| Test data | At least one condition false; mixed stage may be `new_qualified`. |
| User action | Attempt PUT `qualificationStatus=qualified`. |
| Expected business result | Remains unqualified. |
| Expected system evidence | `or01_b_conditions_incomplete`. |
| Pass criteria | Rejection. |
| Fail criteria | Qualified despite incomplete conditions. |
| Evidence to capture | Error body. |
| Known limitation | Preview only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C2-04 — Qualification evidence auditable

| Field | Content |
| --- | --- |
| C capability | C2 |
| Business objective | A later reviewer can see who decided what. |
| Preconditions | Successful UAT-C2-01 or equivalent. |
| Test data | Decision with `evidenceRefs` if supplied. |
| User action | GET facts after qualification. |
| Expected business result | Status, conditions, actor/time (as stored) visible. |
| Expected system evidence | Opportunity facts record; not Office-only. |
| Pass criteria | GET reproduces the decision. |
| Fail criteria | Qualification exists with no recoverable conditions. |
| Evidence to capture | GET body. |
| Known limitation | Process-local WeakMap; lost on process restart; not durable SoR. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

---

## C3 — RFP / clarification / follow-up

### UAT-C3-01 — Explicit `receivedAt`

| Field | Content |
| --- | --- |
| C capability | C3 |
| Business objective | Receipt time is a business fact, not record creation time. |
| Preconditions | Preview RFP. |
| Test data | ISO datetime `receivedAt` **different from** mixed `createdAt`. |
| User action | PUT RFP facts `receivedAt`; compare GET mixed RFP. |
| Expected business result | Sidecar receipt observed; mixed `receivedAt ?? now` **ignored** as F2 evidence. |
| Expected system evidence | `receivedAtStatus=observed`. Date-only rejected (`invalid_receivedAt`). |
| Pass criteria | F2 receipt ≠ `createdAt`. |
| Fail criteria | Using mixed default `now` as receipt. |
| Evidence to capture | Sidecar vs mixed timestamps. |
| Known limitation | Mixed POST still defaults `RfpRecord.receivedAt`. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C3-02 — Clarification events requested / answered

| Field | Content |
| --- | --- |
| C capability | C3 |
| Business objective | Clarification has explicit event times. |
| Preconditions | Preview RFP. |
| Test data | Event `requested` then `answered` with explicit `eventAt`. |
| User action | PUT clarification events (append-only). |
| Expected business result | Both events retained; status change does not invent timestamps. |
| Expected system evidence | `clarificationEvents` array. |
| Pass criteria | Both types present with operator times. |
| Fail criteria | Timestamp inferred from status. |
| Evidence to capture | Event list. |
| Known limitation | Not a full clarification workflow/mailbox. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C3-03 — Explicit `firstResponseAt` and negative interval

| Field | Content |
| --- | --- |
| C capability | C3 |
| Business objective | First response is explicit; cannot precede receipt. |
| Preconditions | `receivedAt` already observed **or** both set in one PUT. |
| Test data | Valid later `firstResponseAt`; then an earlier invalid value. |
| User action | PUT valid; PUT negative interval. |
| Expected business result | Valid stored; negative rejected. |
| Expected system evidence | `negative_response_interval`. Same-value idempotent; different value 409 `firstResponseAt_already_observed`. |
| Pass criteria | Rejection of negative interval. |
| Fail criteria | Negative interval stored; or `proposal.sentAt` used as first response. |
| Evidence to capture | Success and error bodies. |
| Known limitation | Preview only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C3-04 — Response-time KPI derived only for complete population

| Field | Content |
| --- | --- |
| C capability | C3 / C10 |
| Business objective | Average response time is not computed from a silent subset. |
| Preconditions | Defined preview KPI population (UAT-DEMO-KPI-POP). |
| Test data | **Every** RFP in that population has sidecar `receivedAt` and `firstResponseAt` with non-negative interval. |
| User action | GET `/v1/commercial/kpis/preview`. |
| Expected business result | `response_time` status `derived`. |
| Expected system evidence | Mean of intervals; `dataSufficiency=sufficient`. |
| Pass criteria | Derived only when complete. |
| Fail criteria | Derived while any RFP lacks timestamps. |
| Evidence to capture | KPI payload + population IDs. |
| Known limitation | Population is preview-tenant RFPs in the KPI window, not Office history. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C3-05 — Incomplete timestamps stay unavailable

| Field | Content |
| --- | --- |
| C capability | C3 / C10 |
| Business objective | Incomplete chains are not dropped to make the metric look complete. |
| Preconditions | At least one RFP missing sidecar timestamps (UAT-DEMO-RFP-03) in the same population. |
| Test data | Mix of complete and incomplete RFPs. |
| User action | GET KPI preview. |
| Expected business result | `response_time` `unavailable`; incomplete RFPs remain in population. |
| Expected system evidence | Reason `insufficient_timestamps_no_complete_received_to_response_chain`; `dataSufficiency=partial` or `insufficient`. |
| Pass criteria | Unavailable, not a subset average. |
| Fail criteria | Incomplete RFPs excluded then metric derived. |
| Evidence to capture | KPI payload showing unavailable + RFP list. |
| Known limitation | Preview population only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

---

## C4 — Programme / itinerary (H-29 C5)

### UAT-C4-01 — Programme identity linked to RFP

| Field | Content |
| --- | --- |
| C capability | H-29 C5 |
| Business objective | A programme can be identified against its RFP. |
| Preconditions | Mixed programme with `rfpId`. |
| Test data | UAT-DEMO-PRG-01. |
| User action | GET `/v1/programmes/:id/commercial-facts`. |
| Expected business result | Programme id observed; RFP relationship observed if mixed FK exists. |
| Expected system evidence | `rfpStatus=observed` when `programme.rfpId` present. |
| Pass criteria | Identity visible; no fabricated RFP link. |
| Fail criteria | Invented `rfpId`. |
| Evidence to capture | Programme facts GET. |
| Known limitation | Office document remains operational itinerary SoR (`officeDocumentIsNotIdentity`). |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C4-02 — Programme facts distinct from RFP identity

| Field | Content |
| --- | --- |
| C capability | H-29 C5 |
| Business objective | Programme is not merely the RFP number. |
| Preconditions | UAT-C4-01. |
| Test data | Same. |
| User action | Compare RFP facts GET vs programme facts GET. |
| Expected business result | Separate resources. |
| Expected system evidence | Programme id ≠ RFP id; optional observed client-facing version only if mixed version exists. |
| Pass criteria | Distinct identities. |
| Fail criteria | Programme collapsed to RFP id. |
| Evidence to capture | Both GETs. |
| Known limitation | PUT version only if mixed version exists (`programme_version_already_observed` on conflict). |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C4-03 — Missing costing/proposal remain unavailable

| Field | Content |
| --- | --- |
| C capability | H-29 C5 / I11 |
| Business objective | Trace does not fabricate costing or proposal. |
| Preconditions | Programme with RFP but no matching cost sheet/proposal **or** mismatched FKs (UAT-DEMO-CST-02). |
| Test data | As above. |
| User action | GET programme commercial-facts. |
| Expected business result | Costing/proposal statuses unavailable or unsupported; completeness `partial` or `unavailable`. |
| Expected system evidence | `unsupportedCostSheetIds` / `unsupportedProposalIds` when FKs mismatch; no invented sheets. |
| Pass criteria | Missing stays missing. |
| Fail criteria | Fabricated on-trace costing/proposal. |
| Evidence to capture | Trace object. |
| Known limitation | Identifiers only; not reconstruction. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

---

## C5 — Costing / supplier rates (H-29 C4 + C6)

**Rate-type count:** H-29 / F2-I1 / F2-I6 approve **five** types (`negotiated_contracted`, `trade_net`, `public`, `promotional`, `quoted_ad_hoc`). The commissioning prompt said “four”. Controlling catalogue = **five**. UAT-C5-03 tests five.

### UAT-C5-01 — Observe supplier-rate identity (OR-08)

| Field | Content |
| --- | --- |
| C capability | H-29 C4 OR-08 |
| Business objective | A used rate is identifiable. |
| Preconditions | Mixed supplier + rate. |
| Test data | UAT-DEMO-RATE-01: source class, rate type, original currency, season, validFrom/validTo, version, item identity. |
| User action | PUT then GET `/v1/suppliers/:supplierId/rates/:rateId/commercial-facts`. |
| Expected business result | Identity complete as supplied. |
| Expected system evidence | `supplierId`/`supplierCode`, `sourceClass`, `rateType`, `originalCurrency`, season fields, validity, `versionIdentity`, `itemIdentity` (or mixed `rateCode` fallback). |
| Pass criteria | All listed dimensions present or explicitly unavailable — not invented. |
| Fail criteria | Missing dimensions filled by guess. |
| Evidence to capture | Identity GET. |
| Known limitation | `CostSheetVersion.snapshot` is **not** written; reconstruction of sent cost **NOT_READY**. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C5-02 — Five source classes distinct

| Field | Content |
| --- | --- |
| C capability | OR-08 |
| Business objective | Source class is not collapsed. |
| Test data | Each of: `direct_supplier_contract`, `supplier_contracted_rate_sheet`, `written_supplier_quotation`, `trade_partner_net_agreement`, `public_benchmark` (separate demo rates or sequential PUTs on distinct rates). |
| User action | PUT each class. |
| Expected business result | Five distinct classes. |
| Expected system evidence | Matching `sourceClass` + labels. |
| Pass criteria | No silent merge of classes. |
| Fail criteria | Unknown class accepted. |
| Evidence to capture | Five GET bodies or one catalogue demonstration plus two contrasts. |
| Known limitation | Preview; mixed `preferredInConflict` not F2 winner. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C5-03 — Approved rate types distinct

| Field | Content |
| --- | --- |
| C capability | OR-08 |
| Business objective | Rate type remains a controlled catalogue of **five**. |
| Test data | Five type keys above. |
| User action | PUT each type on distinct identities. |
| Expected business result | Five types distinct. |
| Expected system evidence | `rateType` keys/labels. |
| Pass criteria | All five accepted; invalid type rejected. |
| Fail criteria | Using a four-type subset as if complete; or accepting free-text type. |
| Evidence to capture | Type list from responses. |
| Known limitation | Prompt “four types” is **not** adopted. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C5-04 — Original currency; no FX

| Field | Content |
| --- | --- |
| C capability | OR-08 / H-44 FX out |
| Business objective | Amounts stay in original currency. |
| Test data | `originalCurrency=ZAR` (or another ISO-4217); no converted USD field as F2 fact. |
| User action | PUT identity; inspect GET. |
| Expected business result | Currency preserved; no conversion. |
| Expected system evidence | ISO-4217 currency; no FX rate applied. |
| Pass criteria | No unauthorized FX. |
| Fail criteria | Auto-converted USD as F2 identity. |
| Evidence to capture | Currency field. |
| Known limitation | FX provider **OUT_OF_SCOPE**. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C5-05 — Overlap without automatic winner

| Field | Content |
| --- | --- |
| C capability | F1-C-03 / AC-C4-03 |
| Business objective | Conflicting identities remain distinguishable. |
| Test data | UAT-DEMO-RATE-01 and UAT-DEMO-RATE-02 overlapping validity. |
| User action | Observe both identities; do not expect the system to pick one. |
| Expected business result | Both visible; no silent `preferredInConflict` as F2 winner. |
| Expected system evidence | Two identities; overlap not auto-resolved. Version conflict `version_identity_exists` if same version rewritten. |
| Pass criteria | No automatic winner. |
| Fail criteria | System selects a winner without Owner rule. |
| Evidence to capture | Both GETs. |
| Known limitation | Mixed preferred flag may still exist; **not** F2-authoritative. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C5-06 — Costing/proposal trace completes only on aligned FKs

| Field | Content |
| --- | --- |
| C capability | H-29 C5/C6/C8 via I11 |
| Business objective | Trace is explicit, not “same-looking IDs”. |
| Preconditions | UAT-DEMO-CST-01 + UAT-DEMO-PROP-01 on-trace; CST-02 mismatch. |
| User action | GET programme commercial-facts. |
| Expected business result | Complete only if costing matches programmeId **and** rfpId, and proposal matches those **and** on-trace `costSheetId`. |
| Expected system evidence | `trace.completeness=complete` vs `partial`; unsupported IDs listed. No `sellPrice` as revenue. |
| Pass criteria | Mismatch does not complete the trace. |
| Fail criteria | programmeId-only match treated as complete. |
| Evidence to capture | On-trace and mismatch GETs. |
| Known limitation | Identifiers only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

---

## C6 — Approval (H-29 C7)

Path B categories (declared, never inferred): `exceptional_discounting`, `margin_below_approved_floor`, `unusual_payment_credit`, `non_standard_cancellation_liability`, `significant_contractual_commitments`, `strategic_high_risk_accounts`, `unusually_large_complex_programmes`, `deviation_from_supplier_commercial_policy`.

### UAT-C6-01 — No Path B category

| Field | Content |
| --- | --- |
| C capability | Path B |
| Business objective | Ordinary work does not require exceptional approval. |
| Test data | UAT-DEMO-RFP-04; categories empty. |
| User action | GET path-b-approval; generate proposal. |
| Expected business result | No Path B requirement. |
| Expected system evidence | `required=false`, `status=not_required`; generate allowed on preview. |
| Pass criteria | Progression without Path B. |
| Fail criteria | 250k/20% used to force Path B. |
| Evidence to capture | Path B GET + generate result. |
| Known limitation | Durable path still uses mixed ComApprovalRequest. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C6-02 — One category outstanding blocks progression

| Field | Content |
| --- | --- |
| C capability | Path B |
| Business objective | Outstanding exceptional category blocks send/generate. |
| Test data | UAT-DEMO-RFP-05; one category; status `pending`. |
| User action | PUT Path B; attempt generate and/or send. |
| Expected business result | Blocked. |
| Expected system evidence | `path_b_approval_required`. |
| Pass criteria | Block until approved. |
| Fail criteria | Progression while pending. |
| Evidence to capture | 409/conflict body. |
| Known limitation | Preview generate/send only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C6-03 — Multiple categories preserved

| Field | Content |
| --- | --- |
| C capability | Path B |
| Test data | UAT-DEMO-RFP-06; ≥2 categories. |
| User action | PUT categories; GET. |
| Expected business result | All declared categories retained (unique). |
| Expected system evidence | `categories` array length ≥2. |
| Pass criteria | No dropped category. |
| Fail criteria | Collapsed to a single flag. |
| Evidence to capture | GET body. |
| Known limitation | Categories declared, not inferred. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C6-04 — Approve all required categories

| Field | Content |
| --- | --- |
| C capability | Path B |
| Preconditions | UAT-C6-02 or C6-03 pending. |
| User action | POST `.../path-b-approval/decision` approved (principal with commercial approval permission). Then generate/send. |
| Expected business result | Progression permitted. |
| Expected system evidence | `status=approved`; generate 2xx on preview. |
| Pass criteria | Allowed after approval. |
| Fail criteria | Still blocked after approval; or approval inferred from price. |
| Evidence to capture | Decision + generate. |
| Known limitation | Preview only. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C6-05 — No ranking, score, or numerical threshold

| Field | Content |
| --- | --- |
| C capability | Path B / OR-04 |
| Business objective | Qualitative categories only. |
| User action | Inspect Path B payloads during C6-01–C6-04. |
| Expected business result | No score, rank, 250k, or 20% in F2 Path B decision. |
| Expected system evidence | Categories + status only. |
| Pass criteria | No numerical CPR in Path B. |
| Fail criteria | Threshold introduced as F2 rule. |
| Evidence to capture | Path B JSON. |
| Known limitation | Mixed 250k path still exists — see C6-06. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C6-06 — Legacy 250k/20% residual (documentation)

| Field | Content |
| --- | --- |
| C capability | Mixed C7 residual |
| Business objective | Patrick **sees** the leftover mixed gate and does **not** treat it as the approved rule. |
| User action | Note mixed `evaluateCommercialApprovalGate` / `DEFAULT_SELL_THRESHOLD_USD` still present on durable/mixed C7. Do not execute it as F2 UAT pass. |
| Expected business result | Residual documented; not approved. |
| Expected system evidence | Mixed code/behaviour exists; F2 Path B does not consult it on preview. |
| Pass criteria | Written acknowledgement that 250k/20% is **not** Owner rule. |
| Fail criteria | Using 250k/20% as UAT expected result for F2. |
| Evidence to capture | This scenario sheet signed by UAT Authority. |
| Known limitation | Replacement of mixed gate **NOT AUTHORIZED**. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION** (observation), **BLOCKED** as a replacement test. |

---

## C7 — Proposal (H-29 C8)

### UAT-C7-01 — Generate preview proposal without Path B

| Field | Content |
| --- | --- |
| C capability | H-29 C8 / I4 |
| Preconditions | Cost sheet + programme + RFP; Path B `not_required`. |
| User action | Generate proposal on preview. |
| Expected business result | Proposal created without exceptional approval. |
| Expected system evidence | 2xx generate; no ComApprovalRequest required on preview when Path B not required. |
| Pass criteria | Generated. |
| Fail criteria | Blocked by 250k on preview Path B path. |
| Evidence to capture | Proposal id. |
| Known limitation | Preview; durable generate still mixed-gated. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C7-02 — Generate with approved Path B

| Field | Content |
| --- | --- |
| C capability | I4 |
| Preconditions | UAT-C6-04 approved. |
| User action | Generate. |
| Expected business result | Permitted. |
| Expected system evidence | 2xx. |
| Pass criteria | Generate after approval. |
| Fail criteria | Still `path_b_approval_required`. |
| Evidence to capture | Proposal id + Path B status. |
| Known limitation | Preview. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C7-03 — Generate with outstanding Path B

| Field | Content |
| --- | --- |
| C capability | I4 |
| Preconditions | Pending Path B. |
| User action | Generate. |
| Expected business result | Blocked. |
| Expected system evidence | `path_b_approval_required`. |
| Pass criteria | Block. |
| Fail criteria | Generate succeeds while pending. |
| Evidence to capture | Error body. |
| Known limitation | Preview. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C7-04 — Traceable RFP → Programme → Costing → Proposal

| Field | Content |
| --- | --- |
| C capability | I11 |
| Preconditions | On-trace FKs (UAT-DEMO-PROP-01). |
| User action | GET programme commercial-facts. |
| Expected business result | Complete trace when FKs align. |
| Expected system evidence | `trace.completeness=complete`; proposal id listed; no sellPrice-as-revenue. |
| Pass criteria | Identifiers match the chain. |
| Fail criteria | Completeness claimed on mismatch. |
| Evidence to capture | Trace JSON. |
| Known limitation | Not a commercial snapshot / OR-08 freeze. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C7-05 — Proposal values are not revenue

| Field | Content |
| --- | --- |
| C capability | C10 / C8 |
| User action | Inspect proposal and KPI revenue metric. |
| Expected business result | Proposal totals are not labelled revenue. |
| Expected system evidence | KPI `revenue.status=unavailable`; programme facts must not expose sellPrice as revenue. |
| Pass criteria | No revenue substitution. |
| Fail criteria | Proposal/costing/booking sell used as revenue. |
| Evidence to capture | KPI revenue object + proposal GET. |
| Known limitation | Mixed proposal still has prices; they are **not** F2 revenue. |
| UAT status | **NOT EXECUTED**. **READY_FOR_UAT** (negative assertion). |

---

## C8 — Booking / commercial conversion (H-29 C9)

### UAT-C8-01 — Booking linked where explicit relationships exist

| Field | Content |
| --- | --- |
| C capability | H-29 C9 mixed identity |
| Business objective | A booking can be identified on the chain **if** mixed FKs exist. |
| Test data | UAT-DEMO-BKG-01 with mixed `opportunityId` / `rfpId` / `programmeId`. |
| User action | Read mixed booking record. |
| Expected business result | Linkage visible from explicit FKs only. |
| Expected system evidence | Booking fields as stored; no F2 booking sidecar. |
| Pass criteria | Patrick traces using existing FKs without inventing missing links. |
| Fail criteria | Invented win-dimension copies. |
| Evidence to capture | Booking JSON. |
| Known limitation | Mixed only; no F2 commercial-facts on booking. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C8-02 — Conversion without numerical thresholds

| Field | Content |
| --- | --- |
| C capability | C10 conversion |
| User action | GET KPI preview with qualified opportunities and at least one booking in population. |
| Expected business result | Conversion derived (if bookings exist) **without** 250k/20%. |
| Expected system evidence | Formula `non_cancelled_bookings_linked_to_qualified_opportunities / qualified_opportunities`. If no bookings: `unavailable` / `no_booking_outcome_facts_in_population`. |
| Pass criteria | No 250k filter. |
| Fail criteria | Threshold applied. |
| Evidence to capture | Conversion metric. |
| Known limitation | Mixed booking statuses; qualification must be sidecar `qualified`. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C8-03 — Cancelled bookings vs conversion definition

| Field | Content |
| --- | --- |
| C capability | C10 conversion |
| Test data | UAT-DEMO-BKG-CX `status=cancelled` plus a non-cancelled booking if conversion is to be derived. |
| User action | GET KPI conversion. |
| Expected business result | Cancelled **excluded** from numerator (`status !== cancelled`). |
| Expected system evidence | Numerator counts non-cancelled bookings linked to qualified opportunities. |
| Pass criteria | Cancelled not counted as conversion. |
| Fail criteria | Cancelled counted as win. |
| Evidence to capture | Booking statuses + conversion numerator. |
| Known limitation | Uses mixed `bkgBookings.status`; handover labels in code comments are still “non-cancelled”. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C8-04 — Booking behaviours that cannot currently be UAT-tested

| Field | Content |
| --- | --- |
| C capability | H-29 C9 residuals |
| Business objective | Record gaps honestly. |
| User action | Do **not** invent capabilities. Document unavailable items. |
| Expected business result | Gap list accepted as planning fact. |
| Expected system evidence | None (no F2 surface). |
| Pass criteria | N/A at planning; later UAT Authority confirms the gap list, not a false PASS. |
| Fail criteria | Invented passing booking UAT. |
| Evidence to capture | This gap list. |
| Known limitation | See deferred list below. |
| UAT status | **NOT EXECUTED**. **NOT_READY**. |

**Cannot currently be UAT-tested as F2-authoritative:**

- Booking win-time copies of Market / account type / SOURCE / CHANNEL (F2-I12 not implemented; H-58 Option A).
- Repeat-from-prior-booking (SOURCE `existing_client_repeat` is not booking evidence).
- Durable F2 booking facts.
- Operational conversion in Office/Excel as EOS SoR.
- Finance settlement / invoice as C10 revenue.

---

## C9 — Commercial / account relationship

### UAT-C9-01 — Account type and market independent

| Field | Content |
| --- | --- |
| C capability | C1 |
| User action | Reuse UAT-C1-01/02. Same independence assertion at relationship level. |
| Expected business result | Type ≠ market. |
| Expected system evidence | I5 flags. |
| Pass / fail | Same as C1-02. |
| Known limitation | Preview. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C9-02 — SOURCE and CHANNEL independent

| Field | Content |
| --- | --- |
| C capability | OR-07 |
| User action | Reuse UAT-C1-03. |
| Expected business result | Independent dimensions. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C9-03 — Repeat business only from `existing_client_repeat`

| Field | Content |
| --- | --- |
| C capability | C10 / OR-07 |
| Test data | One RFP with `primarySource=existing_client_repeat`; one without, possibly with a similar account name. |
| User action | GET KPI `repeat` metric. |
| Expected business result | Count only explicit SOURCE; names/history do not infer repeat. |
| Expected system evidence | Calculation method: primarySource `existing_client_repeat`; unavailable if no SOURCE facts. |
| Pass criteria | No name-based inference. |
| Fail criteria | Using ~3 bookings or account names as repeat. |
| Evidence to capture | KPI repeat + SOURCE values. |
| Known limitation | Not prior-booking evidence; DR-008 out. |
| UAT status | **NOT EXECUTED**. **READY_WITH_LIMITATION**. |

### UAT-C9-04 — Booking win-dimension not UAT-ready

| Field | Content |
| --- | --- |
| C capability | AC-C9-02 |
| User action | Confirm no F2 sidecar copies win-time dimensions on booking. |
| Expected business result | Recorded **NOT_READY**. |
| Expected system evidence | No `/v1/bookings/:id/commercial-facts` in F2-I1–I11. |
| Pass criteria | N/A — do not PASS. |
| Fail criteria | Claiming win-dimension UAT PASS. |
| Evidence to capture | This record. |
| Known limitation | H-58 Option A; **no F2-I12**. |
| UAT status | **NOT EXECUTED**. **NOT_READY**. |

---

## C10 — KPI / commercial reporting

GET `/v1/commercial/kpis/preview` only. Mixed J3 analytics **must not** be used.

### UAT-C10-01 — RFP volume

| Field | Content |
| --- | --- |
| Business objective | Observed count of preview RFPs in the window. |
| User action | GET KPI; count mixed non-archived RFPs in the same window. |
| Expected result | `rfp_volume` `observed` equals that count. |
| Pass | Counts match preview set. |
| Fail | Using ~25 as expected count. |
| Classification | **READY_WITH_LIMITATION**. Status: **NOT EXECUTED**. |

### UAT-C10-02 — Qualified opportunities

| Field | Content |
| --- | --- |
| User action | GET KPI. |
| Expected result | Count where sidecar `qualificationStatus === qualified` only. |
| Pass | `new_qualified` stage excluded. |
| Fail | Stage counted. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-03 — Conversion

| Field | Content |
| --- | --- |
| User action | GET KPI with and without booking outcomes. |
| Expected result | Derived only if qualified length > 0 **and** bookings.length > 0; else unavailable. Formula as C8-02. Cancelled excluded from numerator. |
| Pass | Completeness respected. |
| Fail | Invented conversion from ~12%. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-04 — Response time

| Field | Content |
| --- | --- |
| User action | Execute with C3-04 and C3-05 populations. |
| Expected result | Derived iff complete explicit timestamps; else unavailable. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-05 — Pipeline value

| Field | Content |
| --- | --- |
| User action | GET KPI with some opportunities missing `estimatedValue`. |
| Expected result | Sum of **explicit** `estimatedValue` only; `legacyApprovalThresholdApplied=false`; no 250k filter. Missing not invented. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-06 — Repeat business

| Field | Content |
| --- | --- |
| User action | Same as UAT-C9-03. |
| Expected result | Explicit SOURCE only. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-07 — Revenue unavailable

| Field | Content |
| --- | --- |
| User action | GET KPI `revenue`. |
| Expected result | `status=unavailable`. Do **not** substitute costing total, proposal value, or booking sell price. |
| Pass | Remains unavailable. |
| Fail | Any substitution. |
| Classification | **READY_FOR_UAT**. **NOT EXECUTED**. |

### UAT-C10-08 — Profit unavailable

| Field | Content |
| --- | --- |
| User action | GET KPI profit metric. |
| Expected result | `unavailable`. Do **not** substitute costing margin. |
| Classification | **READY_FOR_UAT**. **NOT EXECUTED**. |

### UAT-C10-09 — Provenance

| Field | Content |
| --- | --- |
| User action | Inspect each metric. |
| Expected result | Each has status, unit, period (`observationPeriod`), population, calculation method, source facts, data sufficiency (and formula/reason where used). |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

### UAT-C10-10 — Segmentation independence

| Field | Content |
| --- | --- |
| User action | Where preview facts exist, inspect KPI dimension breakouts for market, account type, SOURCE, CHANNEL. |
| Expected result | Dimensions remain independent; missing dimension → no invented bucket. |
| Fail | Collapsing SOURCE into CHANNEL. |
| Classification | **READY_WITH_LIMITATION**. **NOT EXECUTED**. |

---

## Entry criteria

UAT execution (when later authorized) may start only if:

1. F2-I1 through F2-I11 evidence baseline intact (uncommitted preview code preserved; no silent rewrite).
2. Relevant preview tests still passing (technical hygiene — **not** a UAT PASS).
3. UAT demo data prepared and labelled **UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA**.
4. Environment identified as Dev/Test preview (not production, not `eos_gateb` migration).
5. UAT Authority confirmed: Patrick Makundi.
6. This scenario pack reviewed by the UAT Authority.
7. Known limitations in this record still accurate.
8. No production dependency.
9. No schema/production migration required.
10. No unresolved ambiguity in a scenario’s **expected business result** (if ambiguous, that scenario stays **BLOCKED** or **NOT_READY**, not executed as PASS).

This pack does **not** itself satisfy entry criterion 6 until Patrick reviews it. This pack does **not** authorize execution.

---

## Exit criteria

When UAT is later executed (separate authorization):

1. All **READY_FOR_UAT** and executed **READY_WITH_LIMITATION** scenarios have evidence.
2. Each executed scenario has PASS/FAIL from the UAT Authority.
3. Failed scenarios have disposition (fix / accept limitation / defer) — disposition ≠ auto-implement.
4. **NOT_READY** / **OUT_OF_SCOPE** / **BLOCKED** remain explicitly recorded.
5. No unsupported business rule introduced during UAT (no 250k, no ~12% target, no revenue substitution).
6. UAT Authority records the final UAT decision.

No numerical pass-rate threshold is defined (OR-04: no numerical target authorized).

---

## Known limitations (pack-level)

- Preview sidecar is process-local; restart loses F2 facts.
- Durable F2 facts unavailable (409 preview-only).
- Mixed files still encode 250k/20%, default RFP `receivedAt`, collapsed `source`, `new_qualified` stage, J3 invented analytics.
- Office remains operational SoR.
- Item/costing consistency not validated.
- Sent-cost OR-08 snapshot not persisted.
- No mailbox ingest; first response is operator-entered.
- No FX; no DR-008; no numerical CPR.
- Booking win dimensions not implemented.
- Historical KPI series not implemented.

---

## Deferred / out of scope / blocked

| Item | Class |
| --- | --- |
| F2-I12 / booking win-dimension preview | Deferred (H-58 Option A) — **no implementation authorized** |
| Durable persist / schema / migrations | Not authorized |
| Mixed-file F2 rewrite | Not authorized |
| Replacement of 250k/20% mixed gate | Not authorized |
| Mailbox ingest | **OUT_OF_SCOPE** (M0) |
| FX provider | **OUT_OF_SCOPE** |
| DR-008 | **OUT_OF_SCOPE** / deferred |
| Numerical CPR / ~25/~3/~12% as system baseline | **OUT_OF_SCOPE** |
| C11+ | **OUT_OF_SCOPE** |
| Production / Gate B / E1 architecture | **OUT_OF_SCOPE** |
| UAT execution | **NOT AUTHORIZED** by this record |
| Commit / push | **NOT AUTHORIZED** |

A gap exposed by a scenario is **not** automatic authorization for another development increment.

---

## Next governance gate

```text
NEXT GATE = UAT AUTHORITY REVIEW OF THIS PACK
            THEN OWNER AUTHORIZATION OF UAT EXECUTION (PREVIEW-ONLY)
            IF GRANTED — NOT GRANTED HERE

NEXT IMPLEMENTATION INCREMENT = NONE
F2-I12 = NOT AUTHORIZED
```

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT execution | **NOT EXECUTED** |
| F2-I12 | **NOT AUTHORIZED** |
| Persistence / schema / migration | **NOT MODIFIED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** / **NOT READY** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |

---

## Governance status

```text
GPTA-H-59 STATUS = C1–C10 UAT PLANNING AND SCENARIO PACK COMPLETED

UAT NOT EXECUTED
NO F2-I12 IMPLEMENTATION AUTHORIZED

F2 = AUTHORIZED — C1–C10 DEV/TEST ONLY (CONTROLLED PAUSE)
F2-I1 THROUGH F2-I11 = FROZEN PREVIEW EVIDENCE BASELINE

UAT AUTHORITY = PATRICK MAKUNDI
TECHNICAL INCREMENT OWNER = PATRICK MAKUNDI
COMBINED ROLE = YES

PRODUCTION = NOT AUTHORIZED
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
