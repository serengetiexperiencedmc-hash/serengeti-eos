# GPTA-H-28 — Controlled 1B C1–C10 Live Validation Results

> **`GOVERNANCE-ONLY — DEV/TEST VALIDATION`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO APPLICATION CODE CHANGE`**  
> **`NO SCHEMA / MIGRATION / DATA MODEL CHANGE`**  
> **`NO C1–C10 REDESIGN`** · **`NO C11+`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:36:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Plan executed: [`gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md`](gpta-h-27-targeted-requirements-closure-and-1b-live-validation-plan.md). Historical H-16–H-27 **not rewritten**.

```text
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

Defects found were **recorded, not fixed**. No new Owner decisions were invented. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`.

Result vocabulary (observed capability, **not** code existence):

`DEMONSTRATED` · `PARTIALLY DEMONSTRATED` · `NOT DEMONSTRATED` · `NOT TESTABLE` · `NOT APPLICABLE`

---

## A. Executive conclusion

C1–C10 in the **in-memory commercial preview** are **not reusable as-is** against GPTA-H-25 / H-27 Stage 1 rules.

They are **reusable with requirements-aligned remediation** as **Dev/Test structure**, after a **separate** implementation authorization (not granted here).

They are **not** the operational commercial SoR. GPTA-H-19 remains: Office / Excel / Outlook-Gmail / WhatsApp / phone.

Domain J analytics endpoints exist beside C10 and **do not** constitute the approved KPI pack or C11+.

---

## B. Validation environment

| Item | Record |
| --- | --- |
| Environment | Local **in-memory** `npm run dev:preview` (API `127.0.0.1:8080`, UI `localhost:3001`) |
| `EOS_PREVIEW_USE_DATABASE` | **not set** (terminal 704659) |
| Date/time | 2026-09-18 ~00:32–00:36 +03:00 |
| HEAD | `75ee4c3` |
| API `/health` | `status=ok`, `version=1.04.0-i3.37`, `increment=I9.2-encrypted-field-cache`, `productionReady=false`, identity `local-password-dev` |
| Database | **None** for this preview (in-memory store + demo seed at API start **2026-09-17T16:38:22Z**) |
| Operator | Dev/Test principal `carol.admin@sedmc.local` (UI Dev sign-in) |
| Test-data methodology | **Read-only** of existing **demo seed**. **No** new records created. **No** real customer/supplier commitments |
| Disposable IDs observed | `OPP-2026-EURO`, `OPP-2026-SUMM`, `OPP-2026-GLOB`; `RFP-2026-0847`; `PRG-2026-0847`; `CST-2026-0847`; `APR-2026-0847`; `PROP-2026-0847`; `BKG-2026-0847` |

---

## C. C1–C10 results table

| Capability | Result | Evidence | Requirement coverage | Operational status | Remediation needed |
| --- | --- | --- | --- | --- | --- |
| **C1 CRM** | `PARTIALLY DEMONSTRATED` | 3 orgs, 3 accounts, 13 org types via GET `/v1/crm/*`; UI CRM link present; **0** CRM tasks | Owner on account; org `country` not H-27 Market list; type keys omit **PCO**; no SOURCE/CHANNEL pair | **Not used live** (H-19) | Taxonomy/Market/SOURCE-CHANNEL/RFP-bound follow-up — **not authorized** |
| **C2 Opportunity** | `PARTIALLY DEMONSTRATED` | GET `/v1/pipeline/opportunities`: 3 items; UI `/commercial/pipeline` columns **New / Qualified**, RFP Received, Proposal Sent, Negotiation, Won; `$1.2M` header | Stages exist; `new_qualified` is a **stage**; no OR-01 fields; no LR catalogue; no next-action on opportunity | Demo seed only | Qualification ≠ stage; loss reasons; next action — **not authorized** |
| **C3 RFP** | `PARTIALLY DEMONSTRATED` | `RFP-2026-0847` GET: `receivedAt`, destinations, dates, pax, budget, requirements, `assignedPrincipalId`, workflow `closed`; UI Active RFPs = **0** (closed filtered) | No clarification stage; `source` **absent** on observed payload; no clarification start/complete stamps | Demo seed; Office is SoR | Clarification stamps; SOURCE≠CHANNEL — **not authorized** |
| **C4 Supplier rates** | `PARTIALLY DEMONSTRATED` | 5 suppliers; lodge rates `validFrom`/`validTo`/`seasonLabel`/`currency`/`status`; AV supplier `defaultCurrency=TZS` but rates **USD** | Not H-25 rate types; **no** verification date; expired 2025 windows still `status=active`; overlap High-season DBL vs SGL not blocked; `rateType` **not** on observed GET | Demo metadata | OR-08 types, expiry, overlap, FX identity, snapshot — **not authorized** |
| **C5 Programme** | `PARTIALLY DEMONSTRATED` | `PRG-2026-0847` days/items with `supplierId`; title “8 Days” but `dayCount=3` | Linked to RFP/opp/org; not proven as client-facing Office equivalent | **Office remains itinerary SoR** | Fit-to-Office; completeness — **not authorized** |
| **C6 Costing** | `PARTIALLY DEMONSTRATED` | `CST-2026-0847` totals 198400 / sell 285000 / margin 30.39% / floor **20**; line items with `supplierId`; versions | Links RFP/programme/opp; **no** `supplierRateId` on observed lines; no FX basis | Demo math ≠ live SEDMC | Rate-version snapshot; OR-06 floor not a governance number — **not authorized** |
| **C7 Approval** | `PARTIALLY DEMONSTRATED` | `APR-2026-0847` `approved`; `requestedBy` ≠ `decidedBy`; `decidedAt`; `gateType=sell_threshold`; reason cites **250,000 USD** | Send ≠ approval **partially** (proposal `canGenerate` requires approved); **does not** implement H-27 risk matrix; numerical floor **exists in app** contrary to “do not invent floor” as **business** rule | Unused live | Align to H-27 matrix **without** treating 20%/250k as Owner targets — **not authorized** |
| **C8 Proposal** | `PARTIALLY DEMONSTRATED` | `PROP-2026-0847` `accepted`; `sentAt`; `clientViewedAt`; versions; cost lines copied; `approvalRequestId` | No recipient type; no distinct sender vs creator; snapshot is totals/itinerary counts not full OR-08 rate snapshot | **Office remains proposal SoR** | Office vs C8; send/approval roles — **not authorized** |
| **C9 Booking** | `PARTIALLY DEMONSTRATED` | `BKG-2026-0847` `handed_over`; links opp/RFP/programme/proposal; `sellPrice`; `confirmedAt` | **No** Market / Account Type / SOURCE on booking; conversion reporting incomplete | Demo only | Dimension persistence — **not authorized** |
| **C10 Command Center** | `NOT DEMONSTRATED` as KPI pack | Booking command-center = handover/ops/finance **rollup** for one booking. Dashboard “J1+J2 live analytics” is **not** C10 | Missing qualified-RFP, loss reasons, SOURCE, Market, response speed, repeat; `confirmedBookings=0` while a `handed_over` booking exists | Not a commercial KPI pack | Process KPI pack **or** later analytics — **C11+ not authorized** |

---

## D. Acceptance-criteria traceability (H-17 / H-27)

| Criterion | Result | Observed |
| --- | --- | --- |
| AC-Q Qualification (OR-01) | `NOT DEMONSTRATED` | No qualification status/evidence object; only stage `new_qualified` / label “New / Qualified” |
| AC-L Loss (OR-02) | `NOT DEMONSTRATED` | No LR-01–LR-12; `lost` stage unused in seed; won notes “Booking … confirmed” |
| AC-F Follow-up | `NOT DEMONSTRATED` | GET `/v1/crm/tasks` = `[]`; tasks not RFP-bound |
| AC-S SOURCE / CHANNEL | `NOT DEMONSTRATED` | Org `sourceSystem=demo-seed`; RFP `source` absent on GET; no primary/secondary SOURCE |
| AC-M Market vs Account Type | `PARTIALLY DEMONSTRATED` | Org types exist (Incentive House, MICE Agency, Corporate, …) **without PCO**; `country` on org **≠** H-27 Market list; account `market` **unset** on seed |
| AC-P Sent proposal | `PARTIALLY DEMONSTRATED` | Version, `sentAt`, approval id, financial totals; sender/approval-matrix/rate snapshot incomplete |
| AC-R Rates used for costing | `PARTIALLY DEMONSTRATED` | Cost lines have supplier, amount, currency; **not** linked rate version/type/verification |
| AC-T Response stamps | `PARTIALLY DEMONSTRATED` | `receivedAt` and `sentAt` exist; **no** clarification start/complete; no proposal-started stamp |
| AC-005 Conversion method | `PARTIALLY DEMONSTRATED` | Analytics `winRatePercent=33.3` (1/3 opps) **≠** qualified→booking; unaudited 12% not from EOS |
| AC-009 KPI categories | `NOT DEMONSTRATED` | J1 summary: pipeline value, win rate, margin, bookings-in-handover — **not** the H-17 pack |
| AC-012 No new EOS until gate | `DEMONSTRATED` (governance) | This exercise did not implement |

---

## E. Cross-capability trace (demo chain)

Seed chain **does** persist identity from opportunity → RFP → programme → costing → approval → proposal → booking:

`OPP-2026-GLOB` (`7a34debd-…`) → `RFP-2026-0847` → `PRG-2026-0847` → `CST-2026-0847` → `APR-2026-0847` → `PROP-2026-0847` → `BKG-2026-0847`.

| Transition | Result |
| --- | --- |
| RFP/opportunity represented | `DEMONSTRATED` (demo) |
| Qualification distinct from stage | `NOT DEMONSTRATED` |
| Clarification | `NOT DEMONSTRATED` |
| Programme | `PARTIALLY DEMONSTRATED` |
| Costing | `PARTIALLY DEMONSTRATED` |
| Approval | `PARTIALLY DEMONSTRATED` (numerical gate, not H-27 matrix) |
| Proposal | `PARTIALLY DEMONSTRATED` |
| Follow-up | `NOT DEMONSTRATED` |
| Booking | `PARTIALLY DEMONSTRATED` |
| Reporting / KPI pack | `NOT DEMONSTRATED` |
| RFP identity persistence | `DEMONSTRATED` on this chain |
| Ownership persistence | `PARTIALLY DEMONSTRATED` (`ownerPrincipalId` / `assignedPrincipalId` / ops assignee; **no** transfer audit of follow-up) |
| Market / buyer-type / source-channel persistence | `NOT DEMONSTRATED` through the chain |

**Breaks:** qualification, clarification, SOURCE/CHANNEL, loss reasons, follow-up binding, H-27 approval categories, rate snapshot, KPI pack.

---

## F. Office vs EOS operating reality

| Process step | EOS capability exists | EOS demonstrated in Dev/Test | EOS operationally used | Actual operating method |
| --- | --- | --- | --- | --- |
| RFP receipt | Yes (C3) | Partial (`receivedAt`) | **No** | Outlook/Gmail/WhatsApp/phone (H-19) |
| Clarification | **No stage** | Not demonstrated | **No** | Email |
| Programme/itinerary | Yes (C5) | Partial demo | **No** | Microsoft Office |
| Financial proposal | Yes (C6/C8) | Partial demo | **No** | Office / Excel |
| Send | Yes (`sentAt`) | Demo `sentAt` | **No** | Email |
| Follow-up | Tasks exist in model | **0 tasks** | **No** | Manual email |
| Confirm/reject | C8/C9 | Demo accepted→booking | **No** | Client confirm/reject outside EOS |

External tools are **not** validation failures. They are the **current SoR**.

---

## G. Reuse assessment

### Potentially reusable structure

C4 rate/season/validity/currency **fields**; C5 day/item/supplier links; C6 sheet+lines+versions+margin; C7 request/decision/timestamp **shape**; C8 proposal versions/`sentAt`/totals; C9 booking FKs to opp/RFP/programme/proposal.

### Requirements-aligned remediation required *(findings only — not tasks)*

OR-01 vs `new_qualified`; OR-02 catalogue; OR-03/PCO vs seed types; H-27 Market list vs `country`; SOURCE≠CHANNEL; clarification stamps; follow-up bound to RFP/opp; C7 matrix vs 20%/USD 250k gates; cost line→rate version; booking dimensions; KPI process vs C10/J1.

### Capability absent

Clarification workflow; H-27 SOURCE/CHANNEL; LR catalogue; qualification evidence object; commercial parameter register as H-27 placeholder; C10 KPI pack.

---

## H. Data / evidence limitations

* In-memory preview only; **not** PostgreSQL dual-path.  
* Demo seed only; three mock opportunities; one closed RFP (hidden from “Active RFPs” UI).  
* Hydration error overlay on Shell.tsx during UI (did not block API reads).  
* Costing list path `/v1/costing` **404**; sheets at `/v1/costing/sheets`.  
* Supplier nested `GET .../rates` **404**; rates on `GET /v1/suppliers/:id`.  
* Overlap **resolution**, rate **version history**, and public-vs-negotiated **types** could not be exercised without creating/changing data or schema → `NOT TESTABLE` as live edge-case **behavior**.  
* Ownership **change** was not executed (would mutate store); historical owner vs current not separately evidenced beyond stageHistory actors.  
* No production data; no external comms.

---

## I. Governance conclusion

```text
GPTA-H-28 STATUS = 1B LIVE VALIDATION COMPLETE — C1–C10 EVIDENCE RECORDED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
NEXT ACTION = GOVERNANCE REVIEW OF 1B FINDINGS (REUSE VS OFFICE SoR) — NO IMPLEMENTATION
```

A later **remediation-requirements** document may be authorized separately. This record **does not** authorize it.
