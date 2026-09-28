# GPTA-H-61 — UAT Authority Review of Execution Readiness

> **`UAT AUTHORITY REVIEW ONLY`**  
> **`UAT EXECUTION NOT AUTHORIZED BY GPTA-H-61`**  
> **`F2-I12 IMPLEMENTATION NOT AUTHORIZED`**  
> **`NOT UAT APPROVAL`** · **`NOT UAT PASSED`** · **`NOT PRODUCTION READY`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / GATE B / PRODUCTION CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T22:20:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-60 historical bodies are **not rewritten**. H-59 scenario pack is **not rewritten** to make this review pass. Application code is **not modified**. Defects remain findings.

```text
GPTA-H-61 STATUS = UAT AUTHORITY REVIEW OF EXECUTION READINESS COMPLETED

REVIEW OUTCOME = READY_TO_SEEK_UAT_EXECUTION_AUTHORIZATION

UAT EXECUTION NOT AUTHORIZED BY GPTA-H-61
F2-I12 IMPLEMENTATION NOT AUTHORIZED
```

This outcome means H-59/H-60 (as reviewed here) are sufficiently controlled for the UAT Authority to **present a separate Owner decision** on whether preview-only UAT execution may begin. It does **not** mean UAT is authorized, executed, passed, or production-ready.

---

## Appointments

| Role | Person |
| --- | --- |
| UAT Authority | **Patrick Makundi** |
| Technical Increment Owner | **Patrick Makundi** |
| Combined role | **YES** |

Functions remain distinct. This record is the UAT Authority **readiness review**. It does not invent a wet-ink signature and does not convert technical tests into UAT.

---

## Repository state

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved |
| Application / schema / persist / Gate B | **NOT MODIFIED** |

---

## Governing references

| Record | Role in this review |
| --- | --- |
| H-29 / H-31 / H-34–H-36 | Requirements, F1 conditions, blockers |
| H-41 | Appointments |
| H-42–H-45 | F2 presentation, pack, authorization, baseline |
| H-46–H-56 | F2-I1–I11 frozen preview increments |
| H-57 / H-58 | Residual assessment; controlled pause |
| [`gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md`](gpta-h-59-c1-c10-uat-planning-and-scenario-pack.md) | Scenario pack |
| [`gpta-h-60-uat-execution-readiness-and-evidence-preparation.md`](gpta-h-60-uat-execution-readiness-and-evidence-preparation.md) | Execution matrix and evidence model |

Frozen implementation inspected (read-only): `commercial-facts/routes.ts`, `kpis.ts`, `path-b.ts`, `account.ts`, `rate-identity.ts`, `programme.ts`, `booking/booking.ts` (no `cancelled` handler), mixed `proposal.ts` (`sellPrice` present; not F2 revenue).

---

## Three separate decisions

| Decision | Question | H-61 answer |
| --- | --- | --- |
| **A** | Can the UAT package be presented for an Owner authorization decision? | **YES** — `READY_TO_SEEK_UAT_EXECUTION_AUTHORIZATION` |
| **B** | Has the Owner authorized controlled preview-only UAT execution? | **NOT GRANTED** |
| **C** | Has the Owner authorized F2-I12 or another development increment? | **NOT GRANTED** |

H-61 does **not** infer B or C from A. No separate Owner UAT-execution grant exists in the repository.

---

## Scenario inventory

H-59 defines **51** scenarios: UAT-C1-01…C1-04, C2-01…C2-04, C3-01…C3-05, C4-01…C4-03, C5-01…C5-06, C6-01…C6-06, C7-01…C7-05, C8-01…C8-04, C9-01…C9-04, C10-01…C10-10.

Each exists. Each maps to H-59/H-60 capability headings (C1 CRM … C10 KPI). None silently requires F2-I12, production, unauthorized infrastructure, or fabricated ~25/~3/~12% history.

H-29 source-file C-spine (C2 Opportunity / C4 Supplier rates / C5 Programme / …) remains **unrewritten**. Scenario IDs stay H-59 IDs.

---

## Readiness counts

| Status | H-60 (before this review) | H-61 (after this review) |
| --- | --- | --- |
| READY_FOR_UAT | 3 | **3** |
| READY_WITH_LIMITATION | 46 | **45** |
| NOT_READY | 2 | **3** |
| OUT_OF_SCOPE (scenario IDs) | 0 | **0** |
| BLOCKED (scenario IDs) | 0 | **0** |
| Total | 51 | **51** |

### Changed classification

| ID | H-60 | H-61 | Reason |
| --- | --- | --- | --- |
| **UAT-C8-03** | READY_WITH_LIMITATION | **NOT_READY** | H-59 requires verifying **cancelled** booking treatment. Frozen public booking API creates `confirmed` only; `apps/api/src/booking` has **no cancel route**. Observing conversion on confirmed-only bookings, or reading the KPI formula, is **not** meaningful UAT of cancellation. Documenting the gap is correct; executing C8-03 as UAT would be misleading. Finding class **C**. Do **not** implement cancel to pass UAT. |

H-59 text for C8-03 is **not rewritten**. The change is a readiness determination only.

---

## Three READY_FOR_UAT scenarios

These remain READY_FOR_UAT. Each has a controllable input, an observable result on the frozen preview, capturable evidence, and does **not** require a missing capability.

### UAT-C7-05 — Proposal values are not revenue

- **Input:** `GET /v1/proposals/:id` (or list) and `GET /v1/commercial/kpis/preview` in Dev/Test preview. Mixed `sellPrice` may exist.
- **Observable result:** KPI `metrics` entry `key=revenue` has `status=unavailable` and reason that costing/proposal/booking sellPrice are not revenue. Programme facts expose `sellPriceTreatedAsRevenue: false`.
- **Assessable without missing capability:** The negative assertion is the capability. Mixed prices exist and must **not** be treated as revenue.
- **Limitation (does not remove executability):** API-led; no commercial-facts UI.

### UAT-C10-07 — Revenue unavailable

- **Input:** KPI GET only. Do not manufacture revenue.
- **Observable result:** `revenue.status=unavailable` (implementation always returns this).
- **Assessable:** PASS if unavailable and not substituted; FAIL if operator or system treats sell/cost as revenue.
- **Not missing:** Unavailability is implemented, not absent.

### UAT-C10-08 — Profit unavailable

- **Input:** KPI GET. Do not substitute costing margin.
- **Observable result:** `profit_per_booking.status=unavailable`.
- **Assessable:** Same negative-assertion pattern as C10-07.

These three do **not** constitute UAT execution. They were **not** run in this review.

---

## READY_WITH_LIMITATION review (45 remaining)

Rule applied: if bounded behaviour can be tested on an existing surface and the limitation recorded honestly, keep READY_WITH_LIMITATION. If the required capability does not exist, NOT_READY (only C8-03 moved).

Limitations are **known and controlled**. They are **not** development authorization.

| Limitation cluster | IDs (remain READY_WITH_LIMITATION) | Observable UAT still possible? | Misleading if treated as full SoR? | Keep? |
| --- | --- | --- | --- | --- |
| API-led; no commercial-facts UI | All remaining executable rows | Yes — PUT/GET on documented routes | Yes if claimed as operator UI UAT | Keep; record API-led |
| Preview sidecar non-durable (WeakMap; 409 on durable) | C1–C7, C9-01–03, C10-01–06, C10-09–10 | Yes in a live preview session | Yes if claimed durable/historical | Keep |
| Mixed fields not F2-authoritative (`new_qualified`, default `receivedAt`, collapsed source, 250k gate, J3) | C1-03/04, C2-02, C3-01, C6-01/06, C10-02 | Yes if mixed is **excluded** as F2 evidence | Yes if mixed used as pass | Keep |
| F2 facts not seeded; labelled demo must be PUT at execution | C1-01–04, C2, C3, C5, C6, C9-03, C10-01–06, C10-10 | Yes via existing APIs | Yes if seed `OPP-2026-GLOB` treated as F2 facts | Keep |
| SOURCE/CHANNEL on RFP not account | C1-03, C9-02 | Yes on RFP facts | Yes if claimed account-level | Keep |
| Clarification observation ≠ full workflow / mailbox | C3-02 | Yes for requested/answered events | Yes if claimed mailbox UAT | Keep |
| Response-time needs **entire** preview RFP population | C3-04, C3-05, C10-04 | Yes if operator completes or leaves incomplete | Yes if subset averaged | Keep |
| Office remains itinerary SoR; identifiers only | C4-01–03, C5-06, C7-04 | Yes for identity/trace | Yes if claimed document SoR | Keep |
| OR-08 sidecar; snapshot not written; no FX; no auto-winner | C5-01–05 | Yes for identity/overlap/currency | Yes if claimed sent-cost reconstruction or FX | Keep |
| Path B preview only; mixed 250k residual remains | C6-01–06, C7-01–03 | Yes for qualitative block/allow | Yes if 250k treated as F2 rule | Keep C6-06 as residual **observation** |
| Mixed booking FKs; no F2 booking sidecar | C8-01, C8-02 | Yes for identity and conversion formula **without** cancelled construct | Yes if claimed win dimensions | Keep; cancellation moved to NOT_READY |
| Repeat = explicit SOURCE only | C9-03, C10-06 | Yes | Yes if inferred from names/~3 | Keep |
| Pipeline explicit `estimatedValue`; no 250k filter | C10-05 | Yes | Yes if 250k applied | Keep |
| Segmentation empty until sidecar PUTs | C10-10 | Yes after C1/C3 facts | Yes if empty maps treated as “no markets” business fact | Keep |
| Provenance fields on preview metrics | C10-09 | Yes on KPI GET | No if scoped to preview | Keep |

**Not misleading if** PASS/FAIL is scoped to preview sidecar + stated limitation. **Would be misleading if** a PASS were read as operational adoption, durable SoR, or production readiness.

No remaining READY_WITH_LIMITATION row requires F2-I12 or production.

---

## Two original NOT_READY scenarios (plus C8-03)

### UAT-C8-04 — Unavailable booking behaviours

**Absent (frozen baseline):** F2 booking commercial-facts; win-time copies of Market / account type / SOURCE / CHANNEL; repeat-from-prior-booking; durable F2 booking facts; Office conversion as EOS SoR; finance as C10 revenue.

**Why execution would not produce meaningful UAT:** There is no F2 surface on which to supply an input and observe those behaviours. A notes-only “gap list” is governance, not a UAT PASS/FAIL of booking capability. H-58 Option A forbids implementing I12 to create the surface.

**H-61:** remains **NOT_READY**. Class **C** (and **E** for finance/Office SoR). Do not implement.

H-61 commissioning text labelled C8-04 “booking / cancellation.” **Controlling H-59 ID:** cancellation **construct** is **UAT-C8-03** (now NOT_READY). C8-04 remains the **broader unavailable-booking** list. H-59 is not rewritten.

### UAT-C9-04 — Booking win-dimension / account relationship copies

**Absent:** No `GET/PUT /v1/bookings/:id/commercial-facts` (or equivalent) in F2-I1–I11. Independent type/market/SOURCE/CHANNEL **are** testable on account and RFP facts (C1/C9-01–03); **win-time copies on the booking** are not.

**Why execution would not produce meaningful UAT:** There is nothing to GET that would show booking-copied dimensions. Claiming PASS from C1 facts would silently substitute a different capability.

**H-61:** remains **NOT_READY**. Class **C**. F2-I12 **not** authorized to close it.

### UAT-C8-03 — Cancelled vs conversion (reclassified)

**Absent:** Public API to set `BkgBooking.status=cancelled`. Kernel type includes `cancelled`; create sets `confirmed`.

**Why not READY_WITH_LIMITATION:** The H-59 expected business result is cancelled treatment. Without a cancelled record, actual result cannot be compared to expected result except by reading code (technical evidence ≠ UAT).

---

## Data-governance review

| Check | Conclusion |
| --- | --- |
| ~25 / ~3 / ~12% not historical baseline | **Confirmed** — H-59/H-60 forbid seeding; KPI `ownerUnauditedBaselineSeeded=false` |
| Future UAT records labelled `UAT DEMO DATA — NOT HISTORICAL BUSINESS DATA` | **Required** at execution; none created in H-61 |
| Preview seed (`OPP-2026-GLOB` chain, mixed `incentive_house`, free-text United Kingdom, budget 250000) | Mixed **identity only**; **not** F2-authoritative; **not** labelled UAT demo |
| F2 sidecar facts | Process-local; **not** operational historical records |
| Do not manufacture revenue/profit/conversion to force PASS | **Confirmed** as a rule; C10-07/08 test unavailability |

UAT, if later authorized, must not contaminate historical business data. There is no production data access in this pack.

---

## Evidence-governance review

| Class | Distinct? |
| --- | --- |
| Automated tests (F2-I1–I11) | Technical evidence only — **not UAT** |
| UAT evidence | Controlled input, API/record observation, PASS/FAIL by UAT Authority |
| Governance documentation | H-59–H-61 |
| Business-data limitations | Class **F** |
| Implementation defects | Class **B** |
| Capability gaps | Class **C** |

H-60 execution-log fields remain sufficient: Scenario ID, Tester, Date/time, Preconditions, Input/action, Expected result, Actual result, PASS/FAIL, Evidence reference, Finding classification, Limitation, UAT Authority comment.

---

## Finding-classification review

H-60 A–F **retained**:

| Code | Name | Auto-implements? |
| --- | --- | --- |
| A | Evidence Gap | **No** |
| B | Defect | **No** |
| C | Capability Gap | **No** |
| D | Governance Decision Required | **No** |
| E | Out of Scope | **No** |
| F | Data Limitation | **No** |

None of these authorizes F2-I12, persist, mixed rewrite, or production.

---

## Residuals (do not fix)

| Residual | H-61 determination |
| --- | --- |
| No commercial-facts UI | **Controlled limitation** on all API-led scenarios |
| No booking-cancel API | **NOT_READY** for UAT-C8-03; not a build grant |
| Mixed 250k/20% | **Controlled limitation** (C6-06 observation); not F2 Path B authority |
| Mailbox ingest | **Out of scope** (M0); limitation on C3 first-response origin |
| FX provider | **Out of scope**; C5-04 tests preservation / no FX |
| DR-008 | **Out of scope** |
| Numerical CPR | **Out of scope**; C6-05 / C10-05 must not introduce it |
| Historical KPI series | **Capability gap** / not a scenario ID; preview KPI only |
| Revenue/profit unavailability | **READY_FOR_UAT** negative tests (C10-07/08, C7-05) |
| Booking win dimensions | **NOT_READY** (C9-04 / part of C8-04) |
| Non-durable preview facts | **Controlled limitation**; durable 409 is expected |

No scope expansion.

---

## Authorization boundaries

```text
DECISION A = READY_TO_SEEK_UAT_EXECUTION_AUTHORIZATION
DECISION B = UAT EXECUTION NOT AUTHORIZED BY GPTA-H-61
DECISION C = F2-I12 IMPLEMENTATION NOT AUTHORIZED
```

Next gate: **Owner decision** on whether controlled **preview-only** UAT execution may begin, using H-59 scenarios, H-60 evidence model, and H-61 classifications (including C8-03 NOT_READY). That decision is **not** made here.

---

## Status declarations

| Topic | Status |
| --- | --- |
| UAT execution | **NOT AUTHORIZED** · **NOT EXECUTED** |
| F2-I12 | **NOT AUTHORIZED** |
| Application / schema / migration | **NOT MODIFIED** |
| Production | **NOT AUTHORIZED** / **NOT READY** |
| C1–C10 complete | **NOT CLAIMED** |
| Commit / push | **NOT PERFORMED** |

```text
GPTA-H-61 STATUS = UAT AUTHORITY REVIEW OF EXECUTION READINESS COMPLETED
REVIEW OUTCOME = READY_TO_SEEK_UAT_EXECUTION_AUTHORIZATION
```
