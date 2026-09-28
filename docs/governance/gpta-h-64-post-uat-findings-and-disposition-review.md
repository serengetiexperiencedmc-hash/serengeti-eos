# GPTA-H-64 — Post-UAT Findings and Disposition Review

> **`POST-UAT FINDINGS AND DISPOSITION REVIEW`**  
> **`NOT AN IMPLEMENTATION GRANT`**  
> **`NOT UAT APPROVED FOR PRODUCTION`**  
> **`NOT OPERATIONAL ADOPTION`**  
> **`NOT FULL C1–C10 COMPLETION`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`PRODUCTION NOT AUTHORIZED`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:39:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-64 STATUS = POST-UAT FINDINGS AND DISPOSITION REVIEW COMPLETED

F2-I12 IMPLEMENTATION NOT AUTHORIZED
PRODUCTION NOT AUTHORIZED
UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL
```

This record converts GPTA-H-63 execution evidence into a controlled disposition register. It does **not** decide to build anything. It does **not** authorize F2-I12. It does **not** authorize production. H-63 is **not overwritten**. Automated tests are **not** reinterpreted as UAT. PASS_WITH_LIMITATION results are **not** upgraded to PASS. The three excluded scenarios are **not** converted into failures. No overall UAT pass/fail verdict is declared.

---

## 1. Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — Class A/B and frozen F2-I1–I11 **preserved** |
| Application / schema / persist / Gate B | **NOT MODIFIED** by this record |
| F2-I1–I11 baseline | **NOT MODIFIED** |
| F2-I12 | **NOT AUTHORIZED / NOT STARTED** |
| Commit / push | **NOT PERFORMED** |

---

## 2. Authority and evidence control

| Role | Person |
| --- | --- |
| UAT Authority | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| Combined role | **YES** |

Functions remain distinct. H-63 HTTP request/response evidence is **technical execution evidence**. H-63 PASS / PASS_WITH_LIMITATION / FAIL / NOT_EXECUTED values are the **UAT assessment**. This record is **disposition**, not a new UAT session.

Controlling UAT execution evidence: [`gpta-h-63-controlled-preview-uat-execution.md`](gpta-h-63-controlled-preview-uat-execution.md).

Authorization that permitted that session: [`gpta-h-62-owner-authorization-for-controlled-preview-uat.md`](gpta-h-62-owner-authorization-for-controlled-preview-uat.md).

---

## 3. Numbering

H-59 / H-63 scenario IDs and this commissioning list use:

C1 CRM · C2 Qualification · C3 RFP / Clarification / Follow-up · C4 Programme / Itinerary · C5 Costing / Supplier Rates · C6 Approval · C7 Proposal · C8 Booking / Commercial Conversion · C9 Commercial / Account Relationship · C10 KPI / Commercial Reporting.

H-29 / H-34 file §B.2 numbering remains separately recorded and is **not rewritten**: C1 CRM · C2 Opportunity · C3 RFP · C4 Supplier rates · C5 Programme · C6 Costing · C7 Approval · C8 Proposal · C9 Booking · C10 KPI.

Scenario IDs **UAT-C1-** through **UAT-C10-** follow H-59 / H-63. Cross-walk is unchanged from H-59 / H-57. This review does **not** adopt a new numbering freeze.

---

## 4. H-63 execution summary (authoritative; not restated as new results)

| Item | H-63 value |
| --- | --- |
| Planned scenarios | 51 |
| Authorized execution population | 48 |
| Executed | 48 |
| Excluded / NOT_EXECUTED | 3 — UAT-C8-03, UAT-C8-04, UAT-C9-04 |
| PASS | 3 — UAT-C7-05, UAT-C10-07, UAT-C10-08 |
| PASS_WITH_LIMITATION | 45 |
| FAIL after UAT Authority assessment | 0 |
| Finding A Evidence Gap | 0 |
| Finding B Defect | 0 |
| Finding C Capability Gap | 3 |
| Finding D Governance Decision opened by H-63 | 0 |
| Finding E Out of Scope | 1 — UAT-C6-06 mixed 250k/20% residual |
| Finding F Data Limitation as a product finding | 0 — unavailable KPIs were **expected** results |

Environment: in-memory Dev/Test preview via Fastify `inject` (`seedStore` + `buildServer`; no `dbPool`; not production; not `eos_gateb`). Demo records labelled **UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA**. Owner estimates ~25 RFPs / ~3 bookings / ~12% conversion were **not** seeded.

This review does **not** manufacture additional results.

---

## 5. Disposition vocabulary

| Code | Meaning |
| --- | --- |
| **D1 — ACCEPTED LIMITATION** | Known and controlled for the frozen preview baseline. No immediate action. |
| **D2 — DEFERRED CAPABILITY GAP** | Real gap. No implementation authorized now. Requires future prioritization. |
| **D3 — GOVERNANCE DECISION REQUIRED** | Business rule, commercial policy, scope, or parameter requires Owner decision **before** any future implementation. |
| **D4 — OUT OF CURRENT SCOPE** | Explicitly excluded from current F2 C1–C10 Dev/Test preview scope. |
| **D5 — EVIDENCE / DATA LIMITATION** | Capability cannot currently be established as an operational metric because required factual evidence does not exist. |
| **D6 — FUTURE IMPLEMENTATION CANDIDATE** | Potential future development item. **Not authorized** by H-64. Not a grant. |

Primary disposition is one code per finding. A secondary note may record D6-class candidacy without converting D2/D1 into an implementation prompt.

---

## 6. Findings / disposition register

| Finding ID | Source scenario(s) | Capability | Class (H-63) | Observed evidence | Business impact | Current status | Disposition | Future decision required? | Implementation authorization? | Production relevance | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H64-FND-01 | UAT-C8-03 | C8 Booking / conversion | C | No public booking-cancel API; scenario NOT_EXECUTED | Cancelled bookings cannot be exercised in UAT; conversion formula conceptually excludes cancelled but that branch was not demonstrated | Open — deferred | **D2** | Not required to close this preview increment | **NO** | None now. Must not be treated as production booking lifecycle | GAP-01. See §7. Also D6-class candidate; **not** granted |
| H64-FND-02 | UAT-C8-04 | C8 / C9 / C10 | C | No F2 booking sidecar / win copies / durable booking facts; NOT_EXECUTED | Win copies and booking-derived commercial facts absent | Open — deferred | **D2** | Yes **before** any I12-class increment | **NO** | None now | GAP-02. Linked to H64-FND-03. See §8 |
| H64-FND-03 | UAT-C9-04 | C9 / C10 | C | No `/v1/bookings/:id/commercial-facts`; NOT_EXECUTED | Win-dimension copies have no F2 route | Open — deferred | **D2** | Yes **before** any I12-class increment | **NO** | None now | GAP-03. Distinct interface from GAP-02; keep separate. See §9 |
| H64-FND-04 | UAT-C6-06 | C6 Approval | E | Mixed 250k / 20% gate remains in mixed C7; Path B JSON has no threshold / score / rank | Operators could confuse residual mixed gate with approved F2 Path B | Open — residual in mixed code | **D4** | **YES** before any replacement, numerical CPR, or floor inference | **NO** | Must not be production F2 approval rule | See §10. Not F2 Path B authority |
| H64-FND-05A | UAT-C1–C10 (API-led) | C1–C10 | Limitation | No commercial-facts UI; UAT via API | Preview UAT possible; operators cannot use a facts UI | Accepted for this baseline | **D1** | No for preview UAT | **NO** | Blocks company-wide UI adoption | API-led UAT is controlled, not a defect |
| H64-FND-05B | same | C1–C10 | — | UI absent from frozen I1–I11 | Future operator usability | Candidate only | **D6** | Yes if UI is later proposed | **NO** | Not production UI | **Not authorized**. Not ranked |
| H64-FND-06 | UAT-C2-04, C1–C10 sidecar | C1–C10 | Limitation | Process-local WeakMap; durable routes 409 preview-only | Facts lost on restart; not operational SoR | Accepted for preview | **D1** | Yes before any operational-adoption claim | **NO** | Prevents operational adoption | Durable persist **not** authorized. See §11 |
| H64-FND-07 | UAT-C3-01 | C3 | Limitation | Mixed `POST /v1/rfps` still defaults mixed `receivedAt` to now; F2 sidecar used explicit ISO datetime | Mixed field is **not** F2-authoritative receipt | Accepted for preview sidecar | **D1** | No while mixed field remains non-authoritative | **NO** | Mixed default must not be treated as receipt in production reporting | Mixed RFP **not** changed. Mailbox ingest remains D4 |
| H64-FND-08 | UAT-C4-01; H-19 / H-29 | C1–C10 | Limitation | Office / Excel / Outlook/Gmail / WhatsApp / phone remain live commercial SoR | EOS preview does not replace operating practice | Accepted current operating state | **D1** | Yes before any SoR cutover (not this record) | **NO** | Production SoR unchanged | Do not declare EOS operational |
| H64-FND-09 | UAT-C5-01, C5-06, C7-04 | C5 / C7 | Limitation / gap | OR-08 identity on sidecar; sent-cost snapshot not written; identifiers only | Certain proposal/cost evidence cannot be reconstructed from freeze of sent cost | Open — deferred | **D2** | Yes before treating snapshot as SoR | **NO** | None now | Not implemented. Not a grant |
| H64-FND-10 | UAT-C5-06 | C5 / C7 | Limitation | Public costing POST copies programmeId + rfpId; mismatch FKs not API-constructable | UAT could not exercise mismatched-trace rejection via public POST | Accepted UAT/API limitation | **D1** | No for this review | **NO** | Future integration must not assume mismatch can be POSTed | Mismatch was **not** manufactured. Costing API **not** altered |
| H64-FND-11 | UAT-C7-05, C10-07 | C7 / C10 | Expected unavailability | Revenue **unavailable** despite `sellPrice=12000` | Proposal values are not revenue | Demonstrated PASS | **D4** | Yes before any revenue metric | **NO** | Must not report sellPrice as revenue | Finance / revenue recognition out of F2 preview |
| H64-FND-12 | UAT-C10-08 | C10 | Expected unavailability | Profit **unavailable** despite mixed margin | Margin is not profit | Demonstrated PASS | **D4** | Yes before any profit metric | **NO** | Must not report margin as profit | Out of F2 preview finance scope |
| H64-FND-13 | UAT-C3-04, C3-05, C10-04 | C3 / C10 | Expected unavailability | Response-time **derived** only with complete explicit `receivedAt` + `firstResponseAt`; else **unavailable**; incomplete RFPs retained | Incomplete populations must not yield a subset average | Demonstrated | **D5** | No formula change required now | **NO** | Incomplete timestamps must stay unavailable in any later reporting | Capability exists in preview; data completeness is the constraint |
| H64-FND-14 | UAT-C8-02, C10-03 | C8 / C10 | Expected unavailability | Conversion **unavailable** with no bookings; **derived** after one non-cancelled booking; 250k not applied; ~12% unused | Conversion is honest only with sufficient booking facts | Demonstrated within preview | **D5** | No for this preview honesty | **NO** | Must not substitute owner ~12% | Cancelled branch not UAT’d (H64-FND-01) |
| H64-FND-15 | UAT-C10-01, C10-09 | C10 | Limitation | No historical KPI series; preview volume = 5, not 25 | Historical trend / company baseline cannot be established from EOS | Open as data absence | **D5** | No — do not seed owner estimates | **NO** | Must not invent history | Preview seed is not an authoritative historical dataset |
| H64-FND-16 | H-14 / H-63 data rule | C10 | Data rule | ~25 / ~3 / ~12% remain unaudited owner estimates, unused | Using them would fabricate history | Preserved unused | **D5** | No — estimates stay outside UAT data | **NO** | Must not become production KPIs | D4 character as well: not to be loaded |
| H64-FND-17 | H-38 / H-44 / H-63 OOS | C3 / C5 / C6 / C9 | E / OOS | Mailbox ingest, FX provider, DR-008, numerical CPR, C11+, production | Out of authorized F2 increment | Unchanged | **D4** | Already decided as out of current scope | **NO** | Production and those capabilities remain unauthorized | Bundled. Not ranked |
| H64-FND-18 | UAT-C5-05 | C5 | Limitation | Mixed `preferredInConflict` exists; F2 overlap returns 409 `version_identity_exists`; no auto-winner | Residual mixed conflict helper is not F2 authority | Residual | **D4** | Yes before any F2 overlap-winner rule | **NO** | Must not auto-select a rate in production F2 | F1-C-03 remains requirements-level |
| H64-FND-19 | UAT-C2-02 | C2 | None (not a defect) | Harness expected stage remain `new_qualified`; actual mixed stage `rfp_received` with sidecar still qualified | Operators must not read workflow stage as qualification | **Resolved as evidence mismatch** | n/a — not a D1–D6 product finding | No application change | **NO** | Stage ≠ qualification remains the approved rule | See §13 |

**Primary disposition counts (H64-FND-19 excluded as resolved evidence mismatch):**

| D1 | D2 | D3 | D4 | D5 | D6 |
| --- | --- | --- | --- | --- | --- |
| 5 | 4 | 0 | 5 | 4 | 1 |

Material findings reviewed = **20** (19 dispositioned + 1 resolved harness mismatch).

No **D3** row is opened as a currently pending Owner decision pack. Latent gate: **any** future replacement of mixed 250k/20%, numerical CPR, or F2-I12-class booking work requires a **separate** Owner decision before implementation (see H64-FND-04 / H64-FND-02 / H64-FND-03). That is a standing authorization boundary, not a new decision sheet in this record.

---

## 7. GAP-01 — Booking cancellation (H64-FND-01)

| Question | Determination |
| --- | --- |
| Affected capability | H-59/H-63 **C8** Booking / commercial conversion (H-29 file **C9** Booking) |
| Why UAT-C8-03 could not execute | H-61 / H-62: no public cancel API under booking routes; mixed create always `confirmed`. Cannot meaningfully UAT cancelled treatment |
| True capability gap? | **YES** — cancellation is not present on the frozen preview surface |
| Required for current approved F2 objective? | **NOT REQUIRED** to close the authorized F2 C1–C10 Dev/Test preview increment. Stage 1 conversion honesty is partially demonstrated via non-cancelled booking existence (UAT-C8-02 / UAT-C10-03) |
| Can it remain deferred? | **YES** |
| Disposition | **D2** — deferred capability gap. Also a D6-class candidate. **Not authorized** |

Do not build it. Do not manufacture cancellations.

---

## 8. GAP-02 — Booking sidecar / win copies (H64-FND-02)

| Question | Determination |
| --- | --- |
| Affected capabilities | C8 conversion copies; C9 relationship/win dimensions; C10 KPI dimensions that would copy from booking wins |
| Impact on conversion / KPI | Preview conversion **derived** from mixed booking existence linked to a qualified opportunity, without win copies. Repeat business used explicit SOURCE `existing_client_repeat`, not booking-repeat. Revenue/profit remained unavailable |
| Can preview remain honest without it? | **YES** — provided win dimensions, booking-repeat, and cancelled treatment are **not** claimed. H-63 did not claim them |
| Future decision | Separate Owner authorization would be required before any F2-I12-class increment. H-64 does **not** grant it |
| Disposition | **D2**. Linked to H64-FND-03 |

Do not implement it.

---

## 9. GAP-03 — Booking commercial-facts route (H64-FND-03)

| Question | Determination |
| --- | --- |
| Affected capabilities | C9 win-dimension copies; C10 segmentation that would read booking facts |
| Duplicate of GAP-02? | **NO.** GAP-02 is the **fact model / sidecar / durable booking facts / win copies**. GAP-03 is the **HTTP interface** (`/v1/bookings/:id/commercial-facts`) that UAT-C9-04 required |
| Keep separate? | **YES**, with a hard link. Closing one without the other would still leave UAT-C8-04 or UAT-C9-04 unexecutable |
| Disposition | **D2**, linked to H64-FND-02 |

Do not implement it. Do not start F2-I12.

---

## 10. Legacy 250k / 20% residual (H64-FND-04)

| Item | Record |
| --- | --- |
| Current mixed behaviour | Mixed `evaluateCommercialApprovalGate` / `DEFAULT_SELL_THRESHOLD_USD = 250_000` / margin floor 20% remain in mixed C7 callers. Durable generate can still be mixed-gated |
| Approved F2 Path B | Qualitative exceptional categories, declared not inferred; no ranking; no numerical score; no numerical CPR (H-38 / H-44 / F2-I3 / F2-I4). H-63 Path B payloads contained no 250k / score / rank |
| Distinction | Residual mixed path is **not** F2 Path B authority. H-63 class **E — Out of Scope**. UAT-C6-06 PASS_WITH_LIMITATION documents visibility, not approval of the mixed rule |
| Operational risk | An operator or later implementer could treat 250k/20% as the live approval rule. Preview Path B generate/send did **not** use it as F2 authority |
| Future Owner decision | **Required before** any replacement of the mixed gate, any numerical CPR, or any inferred numerical floor |
| Remain deferred? | **YES** — do not replace it now |
| Disposition | **D4** |

Do not replace it. Do not create a numerical CPR. Do not infer a numerical approval floor.

---

## 11. Material limitation review

### API-led / no commercial-facts UI (H64-FND-05A / 05B)

**Both:** accepted preview limitation (**D1**) and future implementation candidate (**D6**, not authorized). H-61 classified most scenarios READY_WITH_LIMITATION for this reason. API-led UAT was sufficient for H-62’s preview-only grant. Do not build UI.

### Non-durable sidecar (H64-FND-06)

Preview commercial facts are **not** durable F2 operational facts. Durable fact routes return preview-only 409 tokens. This **prevents operational adoption**. It does **not** invalidate H-63 preview evidence. Do not modify persistence.

### Mixed default `receivedAt` (H64-FND-07)

Acceptable as a **preview limitation** while F2 timestamps remain sidecar-authoritative and mixed `receivedAt` is not used as receipt. Future remediation of mixed `rfp.ts` would be a separate increment, not a current governance issue for Path B/KPI preview honesty. Mailbox ingest remains **D4**. Do not change mixed RFP implementation.

### Office remains operational SoR (H64-FND-08)

EOS preview facts have **not** replaced Office, Excel, Outlook/Gmail, WhatsApp, or phone. Do not declare EOS operational.

### No sent-cost snapshot (H64-FND-09)

This is a **deferred capability gap (D2)**, not a missing historical dataset (D5). Identifier trace can be complete while sent-cost OR-08 freeze is absent. Do not implement it.

### Mismatch FKs not constructable via public costing POST (H64-FND-10)

Public costing create copies `programmeId` and `rfpId` from the programme. H-63 therefore demonstrated **aligned** trace completeness, and did **not** manufacture a mismatched graph. This limits UAT coverage of the unsupported-FK branch. It is an accepted API/UAT limitation (**D1**). It may matter for future integration tests. Do not alter the costing API.

---

## 12. KPI / data limitation review

| Topic | H-63 result | Disposition |
| --- | --- | --- |
| Revenue unavailable | PASS (UAT-C7-05, UAT-C10-07) | **D4** — finance/revenue out of F2 preview; also no factual revenue |
| Profit unavailable | PASS (UAT-C10-08) | **D4** — margin ≠ profit; out of scope |
| Incomplete response-time | PASS_WITH_LIMITATION; **unavailable** with reason `insufficient_timestamps_no_complete_received_to_response_chain`; population not dropped | **D5** — formula exists; complete explicit chain required |
| Conversion unavailable if booking population insufficient | unavailable then derived after one booking; legacy 250k not applied | **D5** for empty/insufficient booking facts; cancelled branch still D2 via GAP-01 |
| Historical KPI series absent | volume observed = 5, not 25 | **D5** |
| Booking-derived win dimensions absent | NOT_EXECUTED UAT-C8-04 / UAT-C9-04 | **D2** via H64-FND-02 / 03, not a D5 fabrication issue |
| Owner estimates ~25 / ~3 / ~12% | unused | **D5** / must remain outside system data |

Unavailable metrics are **not** converted to PASS because a formula exists. Synthetic history is **not** created.

---

## 13. C2 harness discrepancy (H64-FND-19)

H-63 recorded:

A harness check for UAT-C2-02 initially flagged FAIL because it expected mixed stage to remain `new_qualified`.

Actual behaviour:

- workflow stage = `rfp_received` after RFP create;
- commercial-facts qualification remained independent (`or01` true).

The approved rule (H-29 / OR-01 / F2-I2) is that `new_qualified` is **not** the qualification definition.

```text
Resolved UAT evidence/harness expectation mismatch — not a product defect.
```

H-63 UAT result remains **PASS_WITH_LIMITATION**. This review does **not** rewrite H-63. Application behaviour is **not** changed. The mixed stage advance remains an operator-communication limitation (do not read `rfp_received` as unqualified).

---

## 14. Operational adoption boundary

UAT success does **not** equal operational adoption.

The following remain true:

- Office / Excel / email / WhatsApp / phone remain operational SoR;
- F2 commercial facts remain preview / non-durable;
- the preview does not constitute production EOS;
- C1–C10 are not fully operational.

EOS is **not** ready for company-wide operational use.

---

## 15. Production boundary

- Production **NOT AUTHORIZED**.
- Production deployment **NOT AUTHORIZED**.
- Production migration **NOT AUTHORIZED**.
- Production infrastructure **NOT AUTHORIZED**.
- Production data migration **NOT AUTHORIZED**.
- E1 production closure **NOT established**.

No production recommendation is made beyond recording these boundaries.

---

## 16. F2-I12 boundary

```text
F2-I12 IMPLEMENTATION NOT AUTHORIZED
```

No finding in H-63 constitutes automatic authorization. GAP-02 and GAP-03 describe the I12-class surface. They remain **D2**. If a future increment is desirable, it must go through a **separate Owner authorization gate**. This record is **not** that gate.

---

## 17. Future-candidate handling (not a roadmap; not ranked)

The following may later be considered. They are **not** ranked, scored, selected, or authorized. No implementation prompt is provided.

- Booking cancellation API (H64-FND-01)
- Booking sidecar / win copies / durable booking facts (H64-FND-02)
- Booking commercial-facts route (H64-FND-03)
- Commercial-facts UI (H64-FND-05B)
- Durable commercial-facts persistence (beyond H64-FND-06 preview)
- Sent-cost OR-08 snapshot (H64-FND-09)

Any of the above would require a **separate** Owner authorization. H-64 grants **none**.

---

## 18. Next step

```text
NEXT = OWNER REVIEW OF THIS DISPOSITION REGISTER
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
APPLICATION NEXT_INCREMENT = NONE AUTHORIZED
```

Gaps remain findings. Do not start an implementation increment solely because this register exists.

```text
GPTA-H-64 STATUS = POST-UAT FINDINGS AND DISPOSITION REVIEW COMPLETED
UAT RESULTS DO NOT CONSTITUTE PRODUCTION APPROVAL
```
