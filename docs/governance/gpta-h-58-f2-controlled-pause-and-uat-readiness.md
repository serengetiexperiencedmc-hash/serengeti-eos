# GPTA-H-58 — F2 Controlled Pause and UAT Readiness Decision

> **`OWNER DECISION RECORD`**  
> **`OPTION A — CONTROLLED PAUSE`**  
> **`NO F2-I12`** · **`NO NEW FEATURE IMPLEMENTATION`** · **`NOT UAT EXECUTION`**  
> **`NOT PRODUCTION`** · **`NO SCHEMA / MIGRATION / EOS_GATEB`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T21:48:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

H-16–H-57 historical bodies are **not rewritten**. Application code is **not modified**.

---

## Owner decision

```text
GPTA-H-58 OWNER DECISION = OPTION A — CONTROLLED PAUSE
```

This records the Owner choice against GPTA-H-57:

| Option | H-57 status | H-58 |
| --- | --- | --- |
| A — Controlled pause | Recommended, not selected | **SELECTED** |
| B — Optional C9 booking win-dimension preview | Candidate only | **NOT SELECTED** |

Meaning:

- Do **not** implement C9 booking win-dimension preview.
- Do **not** start F2-I12.
- Do **not** add another isolated commercial-facts observation.
- Preserve F2-I1 through F2-I11 as the current Dev/Test evidence baseline.
- Shift the next activity from feature construction to **controlled UAT/readiness preparation**.

This decision does **not** revoke GPTA-H-44. F2 remains authorized **in principle** for C1–C10 Dev/Test. **No further implementation increment is authorized by this decision.**

---

## Rationale

H-57 found that F2-I1–I11 had exhausted most safe additive C-spine preview facts. Remaining operationally meaningful residuals require persistence, mixed-file rewriting, UAT execution, or out-of-scope grants (mailbox, FX, DR-008, numerical CPR). Continuing with another isolated observation would not produce operational capability.

Option A therefore freezes the preview baseline and moves governance to UAT planning/readiness, without treating automated tests as UAT and without authorizing production.

---

## What this record does not authorize

| Item | Status |
| --- | --- |
| Production deployment | **NOT AUTHORIZED** |
| Production migration | **NOT AUTHORIZED** |
| Schema migration | **NOT AUTHORIZED** |
| Infrastructure deployment | **NOT AUTHORIZED** |
| Procurement | **NOT AUTHORIZED** |
| External provider engagement | **NOT AUTHORIZED** |
| Mailbox ingestion | **NOT AUTHORIZED** |
| FX provider implementation | **NOT AUTHORIZED** |
| DR-008-dependent functionality | **NOT AUTHORIZED** |
| Numerical CPR values | **NOT AUTHORIZED** |
| Replacement of the legacy 250k/20% path | **NOT AUTHORIZED** |
| C11+ | **NOT AUTHORIZED** |
| UAT execution | **NOT AUTHORIZED** by this record |
| Commit | **NOT AUTHORIZED** |
| Push | **NOT AUTHORIZED** |

H-44 F2 authorization remains: **C1–C10 Dev/Test only**. It is **not** expanded here.

---

## Repository inspection

Inspected before this record:

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` — **confirmed** |
| Index | **EMPTY** — `git diff --cached` empty |
| Working tree | **DIRTY** — Class A/B and uncommitted F2-I1–I11 **preserved** |
| Application code this record | **NOT MODIFIED** |
| Staging / commit / push / reset / clean / stash / rebase / amend / discard | **NOT PERFORMED** |

---

## F2 evidence baseline (frozen)

| Increment | Scope | Status |
| --- | --- | --- |
| F2-I1 | Kernel commercial contract | H-46 |
| F2-I2 | C2/C3 commercial facts | H-47 |
| F2-I3 | Path B preview approval/send | H-48 |
| F2-I4 | In-memory C7 generation Path B | H-49 |
| F2-I5 | C1 account type/market | H-50 |
| F2-I6 | C4 supplier-rate identity | H-51 |
| F2-I7 | C10 KPI preview | H-52 |
| F2-I8 | C3 RFP receipt/clarification timestamps | H-53 |
| F2-I9 | C3 first-response observation | H-54 |
| F2-I10 | C5 programme identity | H-55 |
| F2-I11 | RFP → Programme → Costing → Proposal trace | H-56 |

```text
F2-I1 THROUGH F2-I11 = IMPLEMENTED / TEST-DEMONSTRATED / PREVIEW-ONLY
F2-I12 = NOT STARTED / NOT AUTHORIZED BY THIS RECORD
```

They are **not**:

- operationally adopted
- durable F2 facts
- UAT-approved
- production-ready

Office / email / WhatsApp remain the operational commercial source of truth (H-19 / H-29).

---

## C1–C10 residual status (H-57 preserved)

H-29 / H-34 / H-45 numbering remains **controlling**:

C1 CRM · C2 Opportunity · C3 RFP · C4 Supplier rates · C5 Programme · C6 Costing · C7 Approval · C8 Proposal · C9 Booking · C10 KPI.

This commissioning prompt again uses a shifted map (C4 Programme, C5 Costing/Rates, C6 Approval, C7 Proposal, C8 Booking, C9 Account relationship). That map is **recorded for UAT coverage headings**, **not adopted** as the controlling C-spine.

**H-57 conclusion is preserved:** every C1–C10 capability is at best **partially implemented**. No capability is upgraded to complete because a preview route or test exists.

| Layer | Status |
| --- | --- |
| Preview implementation | F2-I1–I11 uncommitted |
| Test evidence | Recorded per increment; **≠ UAT** |
| UAT | **NOT PERFORMED** |
| Operational adoption | **NO** |
| Durable source of truth | **NO** for F2 facts |
| Production readiness | **NO** |

---

## UAT authority

Confirmed from GPTA-H-41 (names recorded exactly):

```text
Technical Increment Owner = Patrick Makundi
UAT Authority = Patrick Makundi
Combined role = YES
```

Functions remain separately defined. Technical evidence (F2-I1–I11 tests) **does not constitute UAT**. F5 still requires actual UAT evidence produced under the UAT Authority.

UAT execution is **not started** by this record. Existing governance (H-41 appointment; H-44 F2 Dev/Test implementation; H-31 F5 as a later lifecycle stage) does **not** already authorize UAT execution.

---

## UAT-readiness inventory

Purpose: prepare planned UAT coverage. **Not** a UAT plan approval. **Not** UAT execution.

Legend:

| Readiness | Meaning |
| --- | --- |
| **PLAN** | Preview fact exists; can be included in a future UAT plan using explicit Dev/Test records |
| **PARTIAL** | Some planned checks have preview evidence; others mixed-only, missing, or non-authoritative |
| **NOT READY** | Residual not implemented as F2-authoritative preview; do not invent it in UAT |
| **OUT OF SCOPE** | Blocked by H-44 / M0 / Path B / finance / DR-008 |

Do **not** treat mixed fields (`RfpRecord.source`, default `receivedAt`, 250k gate, J3 invented values) as F2-authoritative UAT evidence.

### C1 — CRM (H-29 C1; prompt C9 overlap for relationship dimensions)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Account type | F2-I5 sidecar | **PLAN** (preview only) |
| Market (15-value) | F2-I5 sidecar | **PLAN** (preview only) |
| PCO distinction | F2-I5 `pco` distinct from Event Agency | **PLAN** (preview only) |
| Account facts | I5 GET/PUT `/v1/crm/accounts/:id/commercial-facts` | **PLAN** (preview only) |
| Opportunity linkage | Mixed opportunity.account + I2/I5 observation | **PARTIAL** |
| SOURCE | I2 RFP facts, not account-level SOURCE | **PARTIAL** (RFP, not account) |
| CHANNEL | I2 RFP facts, not account-level CHANNEL | **PARTIAL** (RFP, not account) |

### C2 — Qualification (H-29 C2)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| OR-01 qualification | I2 sidecar `qualificationStatus` | **PLAN** |
| All mandatory OR-01-B conditions | I2 PUT; completeness still operator-declared | **PARTIAL** |
| `new_qualified` remaining distinct from qualification | I2 sidecar vs mixed stage retained | **PLAN** (must assert distinction; mixed still conflates) |
| Qualification evidence | Sidecar facts; not Office/mail capture | **PARTIAL** |
| Requalification/change behavior | I2 updates; conflict rules limited | **PARTIAL** |

### C3 — RFP / clarification / follow-up (H-29 C3)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| RFP identity | Mixed RFP + I2 facts | **PARTIAL** |
| `receivedAt` | I8 explicit sidecar; mixed POST default `now` is **not** F2-authoritative | **PLAN** if sidecar used; mixed default **must not** be UAT evidence |
| `firstResponseAt` | I9 explicit sidecar | **PLAN** |
| Clarification events | I8 append-only `requested`/`answered` + I2 status | **PARTIAL** (observation, not full workflow) |
| Response-time derivation | I7/I9: derived only when **every** preview RFP has both timestamps | **PLAN** |
| Missing timestamp behavior | I9: incomplete population → unavailable, not dropped | **PLAN** |
| Follow-up ownership | I2 transfers | **PARTIAL** |
| Mailbox ingest | None | **OUT OF SCOPE** |

### C4 — Programme / itinerary (prompt C4 = H-29 C5)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Programme identity | I10 sidecar + mixed programme | **PLAN** (preview observation) |
| RFP relationship | Mixed `programme.rfpId` + I10 | **PLAN** |
| Programme facts | I10 GET/PUT `/v1/programmes/:id/commercial-facts` | **PLAN** |
| Programme-to-costing trace | I11 on-trace only if programmeId **and** rfpId match | **PLAN** (identifiers, not reconstruction) |
| Item/costing consistency | Flagged false in I10 | **NOT READY** |
| Office document as identity | `officeDocumentIsNotIdentity` | **PARTIAL** — Office remains SoR |

### C5 — Costing / supplier rates (prompt C5 = H-29 C4 + C6)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| OR-08 rate identity | I6 sidecar | **PLAN** |
| Source class / rate type | I6 five classes / five types | **PLAN** |
| Original currency | I6 preserved; no FX | **PLAN** |
| Season / validity / expiry | I6 observed; mixed still selectable when expired | **PARTIAL** |
| Version identity | I6 409 `version_identity_exists` | **PLAN** |
| Supplier/rate trace | I6 rate-identities GET on cost sheet | **PLAN** (observation) |
| Costing relationship | I11 on-trace sheets | **PLAN** (identifiers) |
| Reconstruct sent cost / `CostSheetVersion.snapshot` | Not written | **NOT READY** |
| FX conversion | None | **OUT OF SCOPE** |
| Overlap auto-winner | No invented winner (F1-C-03) | **PARTIAL** / owner live-choice residual |

### C6 — Approval (prompt C6 = H-29 C7)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Path B categories | I3 declared, not inferred | **PLAN** (preview send) |
| Multiple categories | I3 | **PLAN** |
| Outstanding category blocking | I3/I4 pending/rejected → generate/send blocked on preview | **PLAN** |
| Approved / not_required allowing progression | I4 generate; I3 send | **PLAN** |
| Qualitative approval semantics | Path B; no numerical CPR | **PLAN** |
| Legacy 250k/20% residual visibility | Mixed `evaluateCommercialApprovalGate` still present | **PLAN** as **residual visibility only** — must **not** be treated as Owner rule |
| Replacement of 250k/20% | Not done | **NOT READY** / **NOT AUTHORIZED** |

### C7 — Proposal (prompt C7 = H-29 C8)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Proposal generation | I4 preview generate | **PLAN** (preview) |
| Path B gate | I3 send + I4 generate | **PLAN** (preview) |
| Proposal identity | Mixed proposal + I11 ids | **PARTIAL** |
| Programme/costing/RFP trace | I11 on-trace completeness | **PLAN** (identifiers) |
| Send transition | I3 Path B at `sent` | **PLAN** (preview) |
| Commercial snapshot OR-08 | Insufficient | **NOT READY** |
| Durable generate vs mixed 250k | Durable still mixed gate | **PARTIAL** — UAT must not confuse paths |

### C8 — Booking / commercial conversion (prompt C8 = H-29 C9)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Booking linkage | Mixed booking FKs only | **PARTIAL** (mixed, not F2 sidecar) |
| Conversion evidence | Mixed booking exists; F2 conversion facts incomplete | **PARTIAL** |
| Cancellation treatment | Mixed booking statuses; not F2-authoritative pack | **PARTIAL** / mixed |
| Commercial conversion | Not F2-complete | **NOT READY** as F2-authoritative |
| Win-time Market/type/SOURCE copies | F2-I12 **not implemented** | **NOT READY** |

### C9 — Commercial / account relationship (prompt C9 = H-29 C1 + AC-C9-02)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| Account relationship | Mixed org/account + I5 | **PARTIAL** |
| Market / buyer type | I5 | **PLAN** (preview) |
| SOURCE / CHANNEL | I2 on RFP | **PARTIAL** (not booking-copied) |
| Repeat-business evidence | I7 explicit `existing_client_repeat` SOURCE only; **not** prior-booking evidence | **PARTIAL** |
| Booking win dimensions | Not implemented (Option B declined) | **NOT READY** |
| DR-008 taxonomy | Deferred | **OUT OF SCOPE** |

### C10 — KPI / commercial reporting (H-29 C10)

| Planned UAT coverage | Preview evidence | Readiness |
| --- | --- | --- |
| RFP volume | I7 observed | **PLAN** (preview population) |
| Qualification | I7 uses explicit qualification, not `new_qualified` | **PLAN** |
| Conversion | I7 derived only when bookings exist, else unavailable | **PLAN** |
| Response time | I7/I9 complete-population rule | **PLAN** |
| Pipeline value | I7 sum of explicit `estimatedValue`; no 250k/20% filter | **PLAN** |
| Repeat business | I7 SOURCE-based; else unavailable | **PLAN** |
| Revenue unavailable | I7 explicit unavailable | **PLAN** (must remain unavailable) |
| Profit unavailable | I7 explicit unavailable | **PLAN** (must remain unavailable) |
| Provenance | observed / derived / unavailable | **PLAN** |
| Population completeness | I9 mixed completeness → unavailable | **PLAN** |
| Segmentation | market / accountType / SOURCE / CHANNEL | **PLAN** |
| Historical series | Not implemented | **NOT READY** |
| Mixed J3 analytics | Invented values; **not F2** | **Must not be used as UAT evidence** |
| Owner ~25 RFP / ~3 booking estimate | Unaudited H-14 narrative | **Must not be seeded or used as KPI baseline** |

---

## UAT data requirements

UAT scenarios, if later authorized, require **explicit Dev/Test records**. Do **not** fabricate historical business data. Do **not** convert the Owner’s unaudited ~25 RFP / ~3 booking estimate into test data or an EOS KPI baseline.

| Scenario family | Data required | Source allowed |
| --- | --- | --- |
| Account type / market / PCO | Explicit I5 facts on preview accounts | Existing preview records **or** controlled demo records created for UAT |
| Qualification ≠ stage | Explicit I2 `qualificationStatus`; mixed stage left distinct | Controlled demo |
| SOURCE / CHANNEL | Explicit I2 RFP facts | Controlled demo — mixed `rfp.source` **not** sufficient |
| Receipt / first response / response time | Explicit I8/I9 ISO datetimes; both present for derivation | Controlled demo — mixed `receivedAt ?? now` **not** sufficient |
| Missing timestamps | At least one RFP lacking sidecar timestamps | Controlled demo |
| Clarification events | Explicit `requested`/`answered` with `eventAt` | Controlled demo |
| Path B | Explicit category declaration; pending vs approved vs not_required | Controlled demo |
| Rate identity | Explicit I6 source class, type, currency, season, validity, version | Controlled demo |
| Programme / costing / proposal trace | Explicit mixed FKs that **match** (and a mismatch case) | Controlled demo |
| KPI conversion | Explicit booking outcomes **if** conversion is to be derived | Controlled demo — do not invent live bookings |
| Repeat business | Explicit SOURCE `existing_client_repeat` **or** leave unavailable | Do not infer from unaudited history |
| Booking win dimensions | Would need F2 copies — **not available** after Option A | **Do not UAT as implemented** |
| Revenue / profit | Must remain unavailable | No finance seed |

Durable PG SoR F2 facts are **not** available. UAT against durable Path B / commercial-facts routes currently returns preview-only 409 responses. A future UAT plan must state whether it is **preview-only UAT** or is blocked pending persist authorization.

---

## Outstanding blockers (not closed by H-58)

| Residual | Status |
| --- | --- |
| Durable persistence of F2 facts | Open |
| Mixed-file integration | Open / PARKED |
| Legacy 250k/20% approval path | Open (retained mixed; not Owner rule) |
| Mailbox ingestion | Out of scope (M0) |
| FX provider | Out of scope |
| DR-008 | Deferred |
| Numerical CPR values | Not authorized |
| Historical KPI series | Unavailable |
| Finance / revenue / profit semantics | Unavailable / out |
| Operational adoption | No |
| UAT execution | Not performed / not authorized here |
| Production architecture / deployment readiness | Not authorized; E1 unresolved |

H-58 does **not** attempt to close these.

---

## Production boundary

```text
Production = NOT AUTHORIZED
Production deployment = NOT AUTHORIZED
Production migration = NOT AUTHORIZED
Production infrastructure = NOT SELECTED
Production RTO/RPO demonstration = NONE
Gate B = UNTOUCHED
E1 = NOT APPROVED / BLOCKED
E1-B = PAUSED
E1-D = FORMALLY PARKED
Persistence / schema / migration = NOT MODIFIED
eos_gateb = NOT TOUCHED
```

---

## Next governance gate

```text
NEXT GATE = UAT PLANNING / READINESS
NEXT IMPLEMENTATION INCREMENT = NONE AUTHORIZED
F2-I12 = NOT AUTHORIZED
```

The next gate is **UAT planning/readiness**, not another implementation increment, and not UAT execution unless a later Owner record grants it.

---

## Status declarations

| Topic | Status |
| --- | --- |
| Owner decision | **OPTION A — CONTROLLED PAUSE** |
| F2 | **AUTHORIZED IN PRINCIPLE — C1–C10 DEV/TEST ONLY** (H-44; no new increment here) |
| F2-I1–I11 | **FROZEN AS PREVIEW EVIDENCE BASELINE** |
| F2-I12 | **NOT STARTED** |
| UAT | **NOT PERFORMED** · **NOT EXECUTED** · inventory prepared only |
| Persistence / schema / migration | **NOT MODIFIED** |
| Gate B | **NOT TOUCHED** |
| Production | **NOT AUTHORIZED** / **NOT READY** |
| Commit | **NOT PERFORMED** |
| Push | **NOT PERFORMED** |
| Full C1–C10 completion | **NOT CLAIMED** |

---

## Governance status

```text
GPTA-H-58 STATUS = F2 CONTROLLED PAUSE / UAT READINESS PREPARATION

GPTA-H-58 OWNER DECISION = OPTION A — CONTROLLED PAUSE

F2 = AUTHORIZED IN PRINCIPLE — C1–C10 DEV/TEST ONLY
F2-I1 THROUGH F2-I11 = IMPLEMENTED / TEST-DEMONSTRATED / PREVIEW-ONLY
F2-I12 = NOT AUTHORIZED / NOT STARTED

OPERATIONAL ADOPTION = NO
DURABLE F2 FACTS = NO
UAT = NOT PERFORMED
PRODUCTION = NOT AUTHORIZED

NEXT GATE = UAT PLANNING / READINESS
NEXT IMPLEMENTATION INCREMENT = NONE

COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED
```
