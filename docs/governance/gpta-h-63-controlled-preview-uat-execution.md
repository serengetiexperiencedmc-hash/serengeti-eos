# GPTA-H-63 — Controlled Preview-Only UAT Execution

> **`CONTROLLED PREVIEW-ONLY UAT EXECUTION RECORD`**  
> **`UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:33:51+03:00** (session clock from API logs `2026-09-18T19:33:51Z`).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-63 STATUS = CONTROLLED PREVIEW-ONLY UAT EXECUTION COMPLETED

F2-I12 IMPLEMENTATION NOT AUTHORIZED
PRODUCTION NOT AUTHORIZED
UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL
```

This is **not** UAT approved, not operational adoption, not production ready, and not full C1–C10 completion. No overall pass/fail verdict is declared. Capabilities are not ranked.

H-59/H-60/H-61/H-62 are **not overwritten**.

---

## Method

| Item | Record |
| --- | --- |
| Authorization | GPTA-H-62 |
| Environment | In-memory Dev/Test preview via Fastify `inject` on `seedStore` + `buildServer` (**no** `dbPool`; not production; not `eos_gateb`) |
| Tester / UAT Authority | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| Combined role | **YES** |
| Technical vs UAT | HTTP request/response = technical execution evidence. PASS/FAIL below = UAT assessment. Automated vitest runs were **not** used as UAT. |
| Demo data | Labelled **UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA**. ~25 / ~3 / ~12% **not** seeded. Revenue/profit/cancellations/win dimensions **not** manufactured. |

No application, route, kernel, persist, schema, or Class A/B file was modified to obtain results. Findings were **not** fixed.

---

## Population

| Item | Count |
| --- | --- |
| Planned | 51 |
| Authorized execution population | 48 |
| Executed | **48** |
| Excluded (H-62) | **3** — UAT-C8-03, UAT-C8-04, UAT-C9-04 |

---

## UAT Authority assessment of UAT-C2-02

Harness first flagged **FAIL** because it expected mixed `stage` to remain `new_qualified` after an RFP was created. Actual observation:

- Opportunity **create** stage = `new_qualified`.
- After `POST /v1/rfps`, mixed `workflowStage` = `rfp_received`.
- Sidecar `or01Qualified` remained **true**.

That is the approved independence rule: qualification is **not** the workflow stage. The narrow harness check was wrong; the business behaviour **matches** H-59 UAT-C2-02.

**UAT result = PASS_WITH_LIMITATION.** Finding: none (not a product defect). Limitation: mixed stage still moves independently; operators must not read `rfp_received` as unqualified.

---

## Counts (UAT Authority)

| Result | Count |
| --- | --- |
| PASS | **3** (UAT-C7-05, UAT-C10-07, UAT-C10-08) |
| PASS_WITH_LIMITATION | **45** |
| FAIL | **0** |
| NOT_EXECUTED | **3** |

| Finding class | Count | IDs |
| --- | --- | --- |
| A Evidence Gap | 0 | — |
| B Defect | 0 | — |
| C Capability Gap | 3 | UAT-C8-03, UAT-C8-04, UAT-C9-04 |
| D Governance Decision | 0 | — |
| E Out of Scope | 1 | UAT-C6-06 (mixed 250k/20% residual documented, not used as F2 rule) |
| F Data Limitation | 0 | Unavailable KPIs were **expected** results (PASS / PASS_WITH_LIMITATION) |

---

## Scenario log

Tester = Patrick Makundi. Time = 2026-09-18T22:30:00+03:00 unless noted. Demo records = UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA.

| ID | Capability | Preconditions | Demo | Action | Expected | Actual | UAT result | Evidence | Finding | Limitation | UAT Authority observation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UAT-C1-01 | C1 taxonomy / PCO | Preview accounts | ACC-PCO / ACC-EA + 11 types | PUT account commercial-facts | 11 types; PCO ≠ Event Agency | typesOk; isPco true only for pco | PASS_WITH_LIMITATION | PUT 200 ×11 | — | API-led; mixed CRM not rewritten | PCO distinct. Not operational SoR. |
| UAT-C1-02 | Market ⊥ type; SA/UK | Demo accounts | ACC-SA-IH; ACC-UK | PUT south_africa / united_kingdom | Accepted; independent | SA+UK 200; indep=true | PASS_WITH_LIMITATION | account facts | — | Operator supplies market | Catalogue values work. |
| UAT-C1-03 | SOURCE ≠ CHANNEL | SA incentive RFP | RFP-UAT-01 | PUT primarySource+channel | Independent; mixed source not F2 | partner_agency + email; legacyAuthoritative=false | PASS_WITH_LIMITATION | RFP facts | — | On RFP not account | SA incentive example used. |
| UAT-C1-04 | Reject invalid type/market | Existing account | VIP client / Cape Town | PUT invalid | 400 invalid_* | 400 both | PASS_WITH_LIMITATION | error bodies | — | Mixed free-text may still exist | Sidecar rejects. |
| UAT-C2-01 | OR-01-B + next action | Owner present | OPP-UAT-01 | PUT qualified + 9 conditions | or01 true; no budget | 200 or01=true hasBudget=false | PASS_WITH_LIMITATION | opportunity facts | — | Non-durable sidecar | Budget not mandatory. |
| UAT-C2-02 | Stage ≠ qualification | After RFP create | OPP-UAT-01 | GET facts vs stage | Qualification independent of stage | stage rfp_received; or01 true | **PASS_WITH_LIMITATION** | stage vs sidecar | — | Mixed stage advances on RFP | See assessment above. Not a defect. |
| UAT-C2-03 | Incomplete stays unqualified | OPP-UAT-02 | incomplete conditions | PUT qualified with genuine_requirement false | or01_b_conditions_incomplete | 400 | PASS_WITH_LIMITATION | 400 | — | Preview | Stage did not override. |
| UAT-C2-04 | Auditable qualification | After C2-01 | OPP-UAT-01 | GET facts | Status/conditions/next action | 200 qualified + next + refs | PASS_WITH_LIMITATION | GET | — | Lost on restart | In-session only. |
| UAT-C3-01 | Explicit receivedAt | Mixed RFP | RFP-UAT-01 | PUT receivedAt 2026-09-10T08:00:00Z | ≠ createdAt; not mixed default | sidecar 08:00; mixed receivedAt=now; createdAtUsed=false | PASS_WITH_LIMITATION | RFP facts vs mixed | — | Mixed default now; mailbox E | Explicit receipt used. |
| UAT-C3-02 | Clarification events | RFP facts | requested/answered | PUT clarificationEvent ×2 | Both retained | types=requested,answered | PASS_WITH_LIMITATION | events array | — | Not full workflow | Not inferred from status. |
| UAT-C3-03 | firstResponseAt | receivedAt set | 12:00Z then earlier | PUT then conflicting PUT | Valid stored; reject change | 200 then 409 firstResponseAt_already_observed | PASS_WITH_LIMITATION | PUT + 409 | — | Preview | Conflict after observation. |
| UAT-C3-04 | Response-time derived iff complete | Only RFP-01 timestamped | KPI pop n=1 | GET kpis/preview | derived | rt.status=derived; volume=1 | PASS_WITH_LIMITATION | KPI | — | Preview population | Derived when complete. |
| UAT-C3-05 | Incomplete → unavailable | RFP-UAT-03 no times | KPI pop n=2 | GET kpis | unavailable; not dropped | unavailable insufficient_timestamps… volume=2 | PASS_WITH_LIMITATION | KPI | — | Preview | UNAVAILABLE not subset average. |
| UAT-C4-01 | Programme ↔ RFP | Mixed programme | PRG on RFP-01 | GET programme facts | rfpStatus observed | observed; ids linked | PASS_WITH_LIMITATION | GET | — | Office remains SoR | Identity only. |
| UAT-C4-02 | Programme ≠ RFP id | C4-01 | same | Compare ids | Distinct | distinct=true | PASS_WITH_LIMITATION | ids | — | Preview | Not collapsed. |
| UAT-C4-03 | Missing costing/proposal | Before sheet | PRG-01 | GET before costing | unavailable/partial | costing=unavailable proposal=unavailable partial | PASS_WITH_LIMITATION | trace | — | Identifiers only | Missing stayed missing. |
| UAT-C5-01 | OR-08 identity | Mixed rate | RATE-01 | PUT identity | Class, TZS, version | class=direct_supplier_contract currency=TZS version=1 | PASS_WITH_LIMITATION | identity 200 | — | No sent-cost snapshot | Sidecar identity. |
| UAT-C5-02 | Five source classes | Distinct rates | five PUTs | PUT each class | All 5 | 200×5 | PASS_WITH_LIMITATION | PUTs | — | Five not four | All five distinct. |
| UAT-C5-03 | Five rate types | Distinct rates | five PUTs | PUT each type | All 5 | 200×5 | PASS_WITH_LIMITATION | PUTs | — | Five types | Catalogue held. |
| UAT-C5-04 | Original currency; no FX | RATE-01 | TZS | Inspect originalCurrency | TZS; fxProviderImplemented observed falsey | TZS; fxProviderImplemented on body | PASS_WITH_LIMITATION | identity | — | FX E | No FX conversion. |
| UAT-C5-05 | Overlap no winner | Two identities | RATE-01/02 | Second PUT; rewrite v1 | 409 version_identity_exists | 200 + 409 version_identity_exists | PASS_WITH_LIMITATION | 409 | — | Mixed preferredInConflict not F2 | No auto-winner. |
| UAT-C5-06 | FK trace | Public sheet+proposal | CST/PROP | GET programme facts | complete if aligned | completeness=complete sellAsRevenue=false | PASS_WITH_LIMITATION | trace | — | Mismatch not API-constructable; no snapshot | Mismatch not manufactured. |
| UAT-C6-01 | No Path B | New RFP | RFP-UAT-PB | GET path-b | not_required | required=false categories=[] | PASS_WITH_LIMITATION | GET | — | Mixed 250k still in code | No inference from 285k sell. |
| UAT-C6-02 | Outstanding blocks | One category | RFP-UAT-PEND | PUT pending; POST proposals | path_b_approval_required | 409 | PASS_WITH_LIMITATION | 409 | — | Preview | Blocked. |
| UAT-C6-03 | Multiple categories | PUT two | same RFP | PUT two keys | Both preserved | both present; no score | PASS_WITH_LIMITATION | categories | — | Declared not inferred | No ranking. |
| UAT-C6-04 | Approve then generate | Bob decides | same | POST decision; POST proposals | approved; 201 | 200 approved; 201 | PASS_WITH_LIMITATION | decision+generate | — | SoD: Carol 403 self-approve | Qualitative allow. |
| UAT-C6-05 | No numerical CPR | Path B JSON | payloads | Inspect keys | No 250k/score/rank | none | PASS_WITH_LIMITATION | JSON keys | — | Mixed gate residual | Path B qualitative. |
| UAT-C6-06 | 250k residual visibility | Mixed C7 | none as F2 rule | Document residual | Not F2 authority | Path B has no threshold; mixed gate remains | PASS_WITH_LIMITATION | observation | **E** | Replacement not authorized | Residual only. |
| UAT-C7-01 | Generate no Path B | RFP-01 | POST proposals | 201 | 201 sellPrice=12000 pathB not_required | PASS_WITH_LIMITATION | 201 | — | Durable still mixed-gated | Preview generate OK. |
| UAT-C7-02 | Generate after approved Path B | C6-04 | POST proposals | 201 | 201 | PASS_WITH_LIMITATION | 201 | — | Preview | Allowed. |
| UAT-C7-03 | Outstanding blocks generate | C6-02 | POST while pending | path_b_approval_required | 409 | PASS_WITH_LIMITATION | 409 | — | Preview | Blocked. |
| UAT-C7-04 | Trace | C5-06 | GET programme facts | complete; not revenue | complete; sellAsRevenue=false | PASS_WITH_LIMITATION | trace | — | Not OR-08 freeze | Identifier chain. |
| UAT-C7-05 | Proposal ≠ revenue | sellPrice=12000 | GET KPI revenue | unavailable | unavailable (sellPrice not revenue) | **PASS** | KPI | — | Mixed prices exist | Negative assertion held. |
| UAT-C8-01 | Booking FKs | sent+accepted proposal | POST bookings | FKs present | 201 confirmed; opp/rfp/prg linked | PASS_WITH_LIMITATION | GET booking | — | Mixed only; no F2 sidecar | No win copies claimed. |
| UAT-C8-02 | Conversion no 250k | before/after booking | GET KPI | unavailable then derived; no 250k | unavailable then derived=1; legacy=false | PASS_WITH_LIMITATION | two KPI snapshots | — | Cancelled excluded | ~12% not used. |
| UAT-C8-03 | Cancelled treatment | H-62 | — | NOT EXECUTED | — | no cancel API | **NOT_EXECUTED** | H-62 | **C** | No cancel API | Excluded. |
| UAT-C8-04 | Booking win behaviours | H-62 | — | NOT EXECUTED | — | no F2 booking sidecar | **NOT_EXECUTED** | H-62 | **C** | No I12 | Excluded. |
| UAT-C9-01 | Type ⊥ market | C1-02 | reuse | Independence | indep=true | PASS_WITH_LIMITATION | C1-02 | — | Preview | Holds. |
| UAT-C9-02 | SOURCE ⊥ CHANNEL | C1-03 | reuse | Independence | both set | PASS_WITH_LIMITATION | C1-03 | — | On RFP | Holds. |
| UAT-C9-03 | Repeat SOURCE only | explicit existing_client_repeat | KPI | Count=1 not from names | observed value=1 | PASS_WITH_LIMITATION | KPI | — | Not booking-repeat; DR-008 E | ~3 not used. |
| UAT-C9-04 | Win dimensions | H-62 | — | NOT EXECUTED | — | no booking facts route | **NOT_EXECUTED** | H-62 | **C** | No I12 | Excluded. |
| UAT-C10-01 | RFP volume | demo RFPs | GET KPI | observed ≠25 | observed value=5 | PASS_WITH_LIMITATION | KPI | — | Not historical | ~25 not used. |
| UAT-C10-02 | Qualified count | 1 qualified sidecar | GET KPI | value=1 | observed 1 | PASS_WITH_LIMITATION | KPI | — | Preview | Stage not extra qualified. |
| UAT-C10-03 | Conversion completeness | before/after booking | GET KPI | unavailable then derived | matches; formula non_cancelled/qualified | PASS_WITH_LIMITATION | two snapshots | — | Cancelled out | ~12% not used. |
| UAT-C10-04 | Response time | C3-04/05 | KPI | derived then unavailable | derived then unavailable | PASS_WITH_LIMITATION | KPI | — | Incomplete retained | UNAVAILABLE not manufactured. |
| UAT-C10-05 | Pipeline explicit value | 180000 on OPP-01 | GET KPI | 180000; no 250k | derived 180000; legacy=false; partial | PASS_WITH_LIMITATION | KPI | — | Missing not invented | 250k not applied. |
| UAT-C10-06 | Repeat SOURCE | C9-03 | GET KPI | observed | value=1 | PASS_WITH_LIMITATION | KPI | — | Preview | Not inferred. |
| UAT-C10-07 | Revenue unavailable | sell prices exist | GET KPI | UNAVAILABLE | unavailable | **PASS** | KPI | — | Finance out | Expected unavailability. |
| UAT-C10-08 | Profit unavailable | mixed margin | GET KPI | UNAVAILABLE | unavailable | **PASS** | KPI | — | Margin ≠ profit | Expected unavailability. |
| UAT-C10-09 | Provenance | KPI | inspect 8 metrics | required fields | provenanceOk=true | PASS_WITH_LIMITATION | metrics | — | No historical series | Preview pack only. |
| UAT-C10-10 | Segmentation | sidecar facts | dimensions | independent | flags true; SA market; two SOURCE keys | PASS_WITH_LIMITATION | dimensions | — | Not history | Explicit facts only. |

---

## Material limitations (not fixed)

- API-led UAT; no commercial-facts UI.
- F2 sidecar process-local / non-durable.
- Mixed `receivedAt` default now; mixed 250k/20% gate; mixed `preferredInConflict`.
- Office remains operational SoR.
- Sent-cost OR-08 snapshot not written.
- Public costing POST cannot create mismatched FKs.
- No booking-cancel API; no booking commercial-facts; no historical KPI series.
- Mailbox ingest, FX, DR-008, numerical CPR, C11+, production: **out of scope**.

## Data limitations

Unavailable revenue/profit/response-time/conversion were **tested as unavailability**, not forced to a number. Preview seed was not treated as historical. ~25/~3/~12% unused.

## Capability gaps (unchanged; not implemented)

UAT-C8-03, UAT-C8-04, UAT-C9-04. F2-I12 **not** started.

## Defects

**None** as UAT Authority product defects. UAT-C2-02 harness FAIL was reassessment, not a requirement contradiction.

## Governance decisions required

None opened by this session. Mixed 250k replacement remains **not authorized** (E).

---

## Next step

Gaps remain findings. **Do not** start an implementation increment solely because UAT showed limitations.

```text
NEXT = OWNER / UAT AUTHORITY DISPOSITION OF THIS EXECUTION RECORD
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
```

```text
GPTA-H-63 STATUS = CONTROLLED PREVIEW-ONLY UAT EXECUTION COMPLETED
UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL
```
