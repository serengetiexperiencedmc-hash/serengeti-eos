# GPTA-H-82 — Owner Decision Matrix — Future EOS Commercial System Completion

> **`OWNER DECISION MATRIX`**  
> **`GOVERNANCE-ONLY`**  
> **`NO OPTION SELECTED IN THIS RECORD`**  
> **`NOT AN IMPLEMENTATION PLAN`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NOT EOS / SOFTWARE ADOPTION`**  
> **`NOT OPERATIONAL SoR AUTHORIZATION`**  
> **`NOT PRODUCTION AUTHORIZATION`**  
> **`H-75 PROCESS ADOPTION UNCHANGED`**  
> **`H-80 CONTROLLED WAIT UNCHANGED`**  
> **`H-81 NOT STARTED UNCHANGED`**  
> **`F2-I1–I11 REMAIN FROZEN`**  
> **`F2-I12 NOT AUTHORIZED`**  
> **`PATH D = REQUIREMENTS ONLY`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / PERSISTENCE / INFRASTRUCTURE / UI / TEST CHANGE`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-20.  
**Auditable timestamp:** **2026-09-20T22:35:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-82 STATUS = OWNER DECISION MATRIX RECORDED — NO OWNER SELECTIONS MADE

OWNER DECISION MATRIX = GOVERNANCE-ONLY
ALL G-01 THROUGH G-12 = OPEN — NO DECISION MADE IN THIS RECORD
H-75 COMMERCIAL PROCESS ADOPTION = YES (UNCHANGED)
H-75 ≠ SOFTWARE IMPLEMENTATION AUTHORIZATION
H-75 ≠ EOS / SOFTWARE ADOPTION
H-75 ≠ OPERATIONAL SoR AUTHORIZATION FOR EOS
H-80 CONTROLLED WAIT = ACTIVE (UNCHANGED)
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED (UNCHANGED)
F2-I1–I11 = FROZEN PREVIEW-ONLY EVIDENCE
F2-I12 = NOT AUTHORIZED
PATH D = FUTURE REQUIREMENTS ONLY
C1–C10 SOFTWARE EXPANSION = PAUSED
PRODUCTION = NOT AUTHORIZED
SOFTWARE IMPLEMENTATION AUTHORIZATION = NO
NO NUMERICAL COMMERCIAL TARGET IS AUTHORIZED
NO INVENTED KPI BASELINE IS AUTHORIZED
250K/20% = LEGACY / NOT APPROVED AS F2 QUALIFICATION RULE
NO MAILBOX / EXCEL / WHATSAPP INGEST IS AUTHORIZED
NO FX PROVIDER IS AUTHORIZED
NO PRODUCTION MIGRATION IS AUTHORIZED
NO MIGRATION OF eos_gateb IS AUTHORIZED
NO NEW COMMERCIAL RULE IS INVENTED BY THIS RECORD
```

This record converts open governance questions **G-01 through G-12** into an auditable Owner decision sheet.

It does **not** select any option.  
It does **not** rank options.  
It does **not** authorize software.  
It does **not** thaw F2-I1–I11.  
It does **not** start F2-I12.  
It does **not** alter H-74, H-75, H-80, or H-81.

H-10 questionnaire items also used identifiers `G-01` / `G-02`. Those H-10 items are **a different register**. Identifiers **G-01 through G-12 in this H-82 record** apply only to **Future EOS Commercial System Completion**. They do not reopen or answer the H-10 baseline questionnaire.

---

## 1. Document Control

| Field | Record |
| --- | --- |
| Document | GPTA-H-82 — Owner Decision Matrix — Future EOS Commercial System Completion |
| Path | `docs/governance/gpta-h-82-owner-decision-matrix-future-eos-commercial-system-completion.md` |
| Date | 2026-09-20 |
| Type | Governance-only Owner decision matrix — options recorded, none selected |
| Sequence | H-75 adoption → H-76–H-79 evidence → H-80 wait → H-81 dormant → **H-82 matrix (this record)** |
| Does this record overwrite another file? | **NO** |
| Does this record authorize implementation? | **NO** |

**Authoritative predecessors (not overwritten):**

| Record | Role retained |
| --- | --- |
| H-29 | Controlling C-spine numbering and commercial-rule baseline |
| H-38 / H-44 | Path B qualitative; F2 C1–C10 Dev/Test only; increment paused |
| H-64 | Controlling preview UAT dispositions and limitations |
| H-73 | Path A + Path D selected as governance direction; implementation **NO** |
| H-74 | Process design; not software |
| H-75 | Commercial process adoption **YES**; software authorization **NO** |
| H-77 | Path D remains requirements-only |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** — evidence trigger not satisfied |
| C1–C10 technical completion assessment (session, Cursor response) | Factual gap inventory used as input; not a grant |

---

## 2. Purpose and limits

### 2.1 Purpose

Make the Owner's unresolved decisions **explicit and auditable** so that, **if and only if** the Owner later chooses to proceed, a **separate** bounded implementation authorization can be written.

### 2.2 This record is not

| Distinguishing authorization | Status in this record |
| --- | --- |
| H-75 commercial **process** adoption | Unchanged (`YES`) — not expanded, not reversed |
| EOS **software** adoption | **Not granted** |
| Future **software implementation** authorization | **Not granted** |
| Operational **SoR** authorization for EOS | **Not granted** |
| **Production** authorization | **Not granted** |

### 2.3 How each decision is presented

Every G-item uses the same three layers:

| Layer | Meaning |
| --- | --- |
| **A. VERIFIED FACT** | What the repository / governance record currently establishes |
| **B. DECISION REQUIRED** | What the Owner must decide |
| **C. IMPLEMENTATION CONSEQUENCE** | What would become possible or remain prohibited **if** an option were later selected in a **separate** Owner record |

Options are **unranked**. No option in this file is labelled recommended, preferred, best, correct, optimal, or highest priority.

```text
NO DECISION MADE IN THIS RECORD
```

---

## 3. Repository and governance baseline (verified)

Inspected before this record:

| Fact | Status |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | **EMPTY** |
| Working tree | **DIRTY** — preserved; not reset, cleaned, stashed, or discarded |
| Application / schema / migration / test / UI / infrastructure change by this record | **NONE** |

**Current commercial SoR (verified, H-64-FND-08 / H-75):** Office / Excel / Outlook/Gmail / WhatsApp / phone remain the live commercial practice. EOS preview does **not** replace that practice.

**F2 commercial facts (verified, C1–C10 assessment / H-64-FND-06):** process-local `WeakMap`; durable SoR (`Boolean(store.dbPool)`) returns conflict `f2_iN_in_memory_preview_only`.

**Current commercial SoR ≠ H-29 future-state sentence.** H-29 described a *future-state* model in which EOS would be the structured-facts SoR. That sentence is **requirements language**. It is **not** current operational SoR authorization and does **not** decide G-01.

---

## 4. Matrix overview — all items OPEN

| ID | Title | Status in this record |
| --- | --- | --- |
| G-01 | Whether EOS should eventually become the commercial system of record | **OPEN** |
| G-02 | Exact scope of durable commercial facts | **OPEN** |
| G-03 | Mixed legacy fields versus F2-authoritative fields | **OPEN** |
| G-04 | Treatment / isolation of legacy 250k / 20% logic | **OPEN** |
| G-05 | Booking scope, including cancellation and booking commercial facts | **OPEN** |
| G-06 | Costing / proposal versioning and sent-cost reconstruction | **OPEN** |
| G-07 | KPI definitions, historical observations, and financial fact definitions | **OPEN** |
| G-08 | Operator UI scope | **OPEN** |
| G-09 | C-spine naming and authoritative C9/C10 interpretation | **OPEN** |
| G-10 | Migration and coexistence strategy | **OPEN** |
| G-11 | Relationship between software work and H-80 / H-81 evidence gating | **OPEN** |
| G-12 | Future increment naming and whether any future work may be called F2-I12 | **OPEN** |

Selecting any option requires a **later** Owner decision record. This matrix does not write those selections.

---

## 5. G-01 — Whether EOS should eventually become the commercial system of record

### Decision ID

`G-01`

### Decision title

Whether EOS should eventually become the commercial system of record.

### A. VERIFIED FACT — current verified position

- H-75: `COMMERCIAL PROCESS ADOPTION = YES` for the H-74 human operating process (Office / email / WhatsApp / phone).
- H-75: `SOFTWARE IMPLEMENTATION AUTHORIZATION = NO`. H-75 is **not** EOS/software adoption.
- H-64-FND-08: Office / Excel / Outlook/Gmail / WhatsApp / phone remain the live commercial SoR.
- H-29 future-state SoR wording is **not** a present cutover.
- F2-I1–I11 are frozen **preview** evidence, not an operational SoR.

### Why the decision matters

Without G-01, later persist/UI/booking work can be mistaken for SoR cutover, or H-75 process adoption can be mistaken for software adoption.

### B. DECISION REQUIRED — question for the Owner

Should EOS, at a future time and only under later grants, become the commercial system of record for named fact types, or should the H-75 human/Office process remain the commercial SoR?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-01-A** | H-75 human/Office process remains the commercial SoR. EOS is not designated as a future commercial SoR by that selection. |
| **G-01-B** | Owner records that EOS **may** become the commercial SoR in future, subject entirely to later bounded grants. No cutover date, persist, or implementation is authorized by that selection alone. |
| **G-01-C** | Owner records that EOS is the **intended** future commercial SoR for named fact types, still without implementing, cutting over, or authorizing Production. Named fact types would be listed in the later selection record, not invented here. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-01-A** | Software completion is not justified as SoR-building. H-75 process use continues. Path D remains requirements-only. | No SoR persist grant follows from G-01-A. Preview may remain preview. |
| **G-01-B** | SoR remains undecided as a destination until a later grant. | Still **no** implementation. A later grant would still need G-02–G-12. |
| **G-01-C** | Intended destination is recorded; H-75 process adoption still ≠ software adoption; operational SoR authorization still separate. | Still **no** implementation. Persist would still need G-02, G-03, G-10, G-11 and a separate software grant. |

### Dependencies / decisions that must precede it

None inside this matrix. G-01 is a root destination decision. H-80/H-81 remain independent evidence gates (G-11).

### No decision made in this record

```text
G-01 = OPEN — NO DECISION MADE IN THIS RECORD
```

---

## 6. G-02 — Exact scope of durable commercial facts

### Decision ID

`G-02`

### Decision title

Exact scope of durable commercial facts.

### A. VERIFIED FACT — current verified position

Preview sidecars (I2–I11) hold, in process memory only:

- opportunity qualification / loss / ownership / next action;
- RFP SOURCE/CHANNEL, receipt, first response, clarification;
- Path B qualitative approval;
- account type / market;
- supplier-rate identity;
- programme commercial facts;
- KPI **preview computation** (not a history store);
- costing/proposal **trace preview**.

No booking commercial-facts map or route exists. Durable SoR returns `f2_iN_in_memory_preview_only`. H-64-FND-06: persist is required before any operational-adoption claim; persist is **not** authorized by H-64.

Path D ten items remain **requirements only** (H-73 / H-77).

### Why the decision matters

“Make it durable” is not a scope. A later grant must name fact types or it cannot be bounded.

### B. DECISION REQUIRED — question for the Owner

Which already-specified F2 fact types, if any, may later be in scope for **durable** storage under a separate implementation grant?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-02-A** | No durable commercial facts. F2 remains in-memory preview. |
| **G-02-B** | Durable persist limited to intake/qualification facts already specified: opportunity facts (I2), RFP SOURCE/CHANNEL and stamps/clarification (I2/I8/I9), account type/market (I5). |
| **G-02-C** | G-02-B plus durable Path B approval records (I3) and the generate/send gate’s Path B state (I4 dependency). |
| **G-02-D** | Durable persist of all existing I2–I11 sidecar maps **except** booking facts and except KPI **history** (history is G-07). |
| **G-02-E** | G-02-D plus booking commercial facts — **only if** G-05 later includes booking facts. G-02 cannot by itself add booking. |

Catalogues, keys, and validators remain those already specified in frozen F2-I1. This decision does **not** add fields or rules.

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-02-A** | Operational-adoption claim for EOS facts remains unavailable (H-64-FND-06). | No persist increment for F2 facts. |
| **G-02-B** | Bounded facts SoR (if later granted) covers qualification/intake classification only. | Later grant could persist those maps only; I3–I11 remain preview unless other G-items expand. |
| **G-02-C** | Path B evidence could become durable **if** later granted. | Mixed 250k/20% still untouched (G-04). |
| **G-02-D** | Broader facts persist still excluding booking/KPI history unless G-05/G-07 say otherwise. | Still requires separate software grant, G-03, G-10. |
| **G-02-E** | Booking facts remain gated on G-05. | G-02-E without G-05 does not authorize booking routes. |

### Dependencies / decisions that must precede it

G-01 (destination). G-03 (authority of mixed vs F2). G-10 (which environment). G-11 (H-81/waiver). G-05 if option E is later selected.

### No decision made in this record

```text
G-02 = OPEN — NO DECISION MADE IN THIS RECORD
```

---

## 7. G-03 — Treatment of mixed legacy fields versus F2-authoritative fields

### Decision ID

`G-03`

### Decision title

Treatment of mixed legacy fields versus F2-authoritative fields.

### A. VERIFIED FACT — current verified position

Dual models coexist:

| Mixed / legacy | F2 preview |
| --- | --- |
| Opportunity stage includes `new_qualified` (workflow stage, not OR-01) | `qualificationStatus` on I2 sidecar |
| `CrmAccount.market` unstructured string | I5 catalogue (I5 tests reject mixed “Europe” / “Kenya” as sidecar-invalid) |
| RFP `source` unstructured; comment historically combined origin and intake | Distinct SOURCE and CHANNEL catalogues |
| `POST` RFP `receivedAt: input.receivedAt ?? now` | F2 receipt only with `explicit_business_fact` |
| Mixed J3 analytics `STAGE_VALUES` / `75000` | I7 KPI preview; not F2-authoritative |

H-64-FND-07: mixed `receivedAt` default is **not** F2-authoritative receipt. Mixed RFP was **not** changed by preview UAT.

### Why the decision matters

Persisting F2 facts while leaving mixed fields live, without an authority rule, would create two receipts, two markets, and two “sources.”

### B. DECISION REQUIRED — question for the Owner

For named commercial facts, which model is authoritative, and what happens to mixed fields?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-03-A** | Mixed APIs remain as they are. F2 sidecar/facts remain a separate preview model and are not declared authoritative over mixed fields. |
| **G-03-B** | For fact types named in a later G-02 selection, F2 is authoritative. Mixed fields are retained for compatibility and **must not** be used as F2 reporting/receipt/qualification/source/market authority. |
| **G-03-C** | For fact types named in a later G-02 selection, F2 is authoritative, and mixed fields for those types are frozen against further semantic expansion. Mapping mixed strings into F2 catalogues is **not** defined here and would require a later mapping grant with explicit maps — this option does not invent those maps. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-03-A** | Dual-model risk remains accepted. | Later persist of F2 would still be a second store, not mixed replacement. |
| **G-03-B** | Reporting rules must cite F2 for named facts. | Later grant must not copy mixed `now` into F2 receipt; must not treat stage as qualification. |
| **G-03-C** | Stronger isolation; mapping still not specified. | No silent conversion of “Europe” into a market key without a later mapping grant. |

### Dependencies / decisions that must precede it

G-02 names which facts. G-01 frames whether authority matters for SoR.

### No decision made in this record

```text
G-03 = OPEN — NO DECISION MADE IN THIS RECORD
```

---

## 8. G-04 — Treatment / isolation of legacy 250k / 20% logic

### Decision ID

`G-04`

### Decision title

Treatment / isolation of legacy 250k / 20% logic.

### A. VERIFIED FACT — current verified position

- Kernel `DEFAULT_SELL_THRESHOLD_USD = 250_000` remains. Mixed `requestCommercialApproval` still calls `evaluateCommercialApprovalGate`.
- Costing create still defaults `marginFloorPercent ?? 20`.
- F2 Path B is qualitative categories, declared not inferred; I1 contract does not contain `DEFAULT_SELL_THRESHOLD`.
- H-64-FND-04 disposition **D4**: mixed 250k/20% is **not** the approved F2 Path B rule. **Owner decision is required before any replacement**, numerical CPR, or floor inference.
- H-29: 250,000 USD / margin floor **must not** remain the governing commercial approval rule for the approved F2 path.
- **No numerical commercial target is authorized.** This matrix does **not** create a replacement number, percentage, score, rank, or CPR.

### Why the decision matters

Operators can confuse the residual mixed gate with Path B. Replacing it with another number in this sheet would invent a commercial rule, which is forbidden.

### B. DECISION REQUIRED — question for the Owner

What should happen to the **existing** mixed 250k / 20% logic — without adopting any new numerical commercial rule in this record?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-04-A** | Leave mixed 250k/20% **unchanged** in mixed callers. Record it as **legacy, not F2 Path B, not F2 qualification**. Isolation is documentary / test-labelling only. |
| **G-04-B** | Later grant may **isolate** mixed callers (fail-closed, disabled, or unreachable from F2 generate/send) **without substituting any number**. Path B remains the F2 approval model. |
| **G-04-C** | Owner defers any code treatment. A **separate commercial-rule decision record** would be required before mixed logic is replaced. That future record is **not** this matrix and **must not** be pre-filled with a threshold. |

**Forbidden as an outcome of G-04 (all options):**

- treating 250k or 20% as the F2 qualification rule;
- inventing a new sell threshold, margin floor, CPR, score, or rank;
- inferring Path B categories from price or margin.

If the Owner later wishes to authorize **any** numerical commercial rule, that is a **new H-25/H-29-class commercial-rule decision**, not an option listed here.

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-04-A** | Dual-gate residual remains; F2 Path B remains qualitative. | No mixed-gate code change from G-04-A. |
| **G-04-B** | Mixed gate would not govern F2 send **if** a later grant implements isolation. | Isolation only; **no new number**. |
| **G-04-C** | Replacement remains blocked until a commercial-rule record exists. | No mixed-gate change and no F2 numerical gate. |

### Dependencies / decisions that must precede it

G-02-C/D if Path B persist is in scope. A commercial-rule grant **before** any replacement number (none is offered here).

### No decision made in this record

```text
G-04 = OPEN — NO DECISION MADE IN THIS RECORD
G-04 DOES NOT AUTHORIZE A NEW NUMERICAL COMMERCIAL RULE
```

---

## 9. G-05 — Booking scope, including cancellation and booking commercial facts

### Decision ID

`G-05`

### Decision title

Booking scope, including cancellation and booking commercial facts.

### A. VERIFIED FACT — current verified position

- Mixed booking: create only from proposal `accepted`; create status `confirmed`; list/get; handover / command-center.
- Kernel `BookingStatus` includes `cancelled`. **No public cancel API** in `booking/routes.ts`.
- **No** `/v1/bookings/:id/commercial-facts`. F2 memory has **no** bookings map.
- H-64: GAP-01 cancel **D2**; GAP-02 sidecar/win-copy **D2**; GAP-03 facts route **D2**. GAP-02 and GAP-03 remain distinct. Both described as needing a decision before any I12-class increment. **Not authorized.**
- H-71 / H-76 / H-77: won booking **not available / not presented**. `BOOKING VALIDATION = NOT ESTABLISHED`. That does **not** mean the booking process is defective.
- Path D “booking commercial facts” remains requirements-only.

**Evidence rule for G-05:** lack of observed booking or cancellation evidence must **not** be converted into fabricated test evidence, fabricated win files, or invented cancelled bookings.

### Why the decision matters

H-64 treated GAP-02/03 as I12-class surface. Building booking SoR to compensate for missing operational wins is barred by H-77’s Path D status rule.

### B. DECISION REQUIRED — question for the Owner

Which booking capabilities, if any, may be named in a **later** software grant?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-05-A** | Defer all booking completion. Mixed create/handover remains as-is. No cancel API. No booking commercial-facts. No win-copy. |
| **G-05-B** | Later grant may include a **cancel** capability only. No booking commercial-facts. No win-copy. |
| **G-05-C** | Later grant may include **booking commercial-facts** (and only then a facts route). No cancel. No win-copy unless separately named. |
| **G-05-D** | Later grant may include cancel **and** commercial-facts as separately named items (H-64: keep GAP-01 / GAP-02 / GAP-03 distinct). Win-copy only if explicitly named. |
| **G-05-E** | Booking remains out of software scope until genuine booking and/or cancellation evidence is presented under H-80/H-81. Absence of evidence is **not** a defect finding and **not** a reason to fabricate UAT data. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-05-A** | H-64 D2 rows remain deferred. | No booking increment. |
| **G-05-B** | Cancel UAT (H-63 NOT_EXECUTED) could be in a later UAT pack. | Cancel route only if later granted; still no fabricated cancelled bookings in evidence files. |
| **G-05-C** | Path D booking facts could leave “requirements-only” **only** by a later grant, not by this matrix. | Facts route only if later granted; G-12 still controls whether that grant is named I12. |
| **G-05-D** | Broader booking surface still not started here. | Two (or three) named items, not one conflated “booking module.” |
| **G-05-E** | Evidence leads booking software. | No booking software to manufacture H-81 evidence (see G-11). |

### Dependencies / decisions that must precede it

G-01, G-11. G-02-E cannot add booking without G-05. G-12 if the work would be named F2-I12. Genuine evidence **or** an explicit Owner statement that evidence absence is accepted as a remaining limitation — **not** fabricated data.

### No decision made in this record

```text
G-05 = OPEN — NO DECISION MADE IN THIS RECORD
DO NOT FABRICATE BOOKING OR CANCELLATION EVIDENCE
```

---

## 10. G-06 — Costing / proposal versioning and sent-cost reconstruction

### Decision ID

`G-06`

### Decision title

Costing / proposal versioning and sent-cost reconstruction.

### A. VERIFIED FACT — current verified position

- Mixed `CostSheetVersion` stores `summary`, totals, `lineCount` — **not** a full line-item sent-cost snapshot.
- Mixed proposal/booking `version` fields exist (booking create uses `version: 1`). That is **not** Path D proposal versioning.
- H-64-FND-09 **D2**: sent-cost snapshot not written; identifier trace is not freeze-of-sent-cost.
- Path D “proposal versioning” remains requirements-only.
- I11 is costing/proposal **trace preview**, not a durable lineage store.

### Why the decision matters

Without a definition of “sent,” persist could freeze the wrong object or claim reconstruction it cannot perform.

### B. DECISION REQUIRED — question for the Owner

What reconstruction, if any, must a later grant support for costing and proposal evidence?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-06-A** | Defer sent-cost freeze and Path D proposal versioning. Identifier trace (I11-class) remains preview unless G-02 includes it as identifiers only. |
| **G-06-B** | Later grant may persist **identifier trace** (programme / RFP / costing / proposal links) without a full cost-line freeze. |
| **G-06-C** | Later grant may add a **freeze-on-send** snapshot of the cost sheet (and/or proposal totals) as then defined in that grant. This matrix does not specify snapshot schema. |
| **G-06-D** | Later grant may include Path D **proposal versioning** as a commercial version workflow, distinct from mixed integer `version` fields. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-06-A** | OR-08 reconstruction remains unmet. | No versioning increment. |
| **G-06-B** | Trace completeness ≠ sent-cost completeness (H-64). | Durable IDs only. |
| **G-06-C** | Sent-cost SoR possible only after a later grant defines freeze event. | Schema/payload change would be in that grant, not here. |
| **G-06-D** | Path D versioning still requirements-only until that grant. | Must not relabel mixed `version: 1` as Path D versioning. |

### Dependencies / decisions that must precede it

G-02 if programme/trace maps persist. G-03 if mixed proposal totals vs F2 freeze. G-04 if freeze interacts with mixed margin floor (floor is not F2 qualification).

### No decision made in this record

```text
G-06 = OPEN — NO DECISION MADE IN THIS RECORD
```

---

## 11. G-07 — KPI definitions, historical observations, and financial fact definitions

### Decision ID

`G-07`

### Decision title

KPI definitions, historical observations, and financial fact definitions.

### A. VERIFIED FACT — current verified position

- I7 `GET /v1/commercial/kpis/preview`: every metric `numericalTargetAuthorized: false`.
- `revenue` unavailable: costing/proposal/booking `sellPrice` **are not revenue**.
- `profit_per_booking` unavailable: costing margin **is not** profit.
- `response_time` unavailable unless sidecar `receivedAt` **and** `firstResponseAt` exist with `explicit_business_fact`; incomplete population is not dropped to manufacture an average (H-64-FND-13).
- Conversion derived only with sufficient booking facts; cancelled branch not UAT’d (H-64-FND-14 / GAP-01).
- No KPI history store (H-64-FND-15). Preview volume is not a company baseline.
- Owner estimates ~25 / ~3 / ~12% remain unused and must stay outside system data (H-64-FND-16).
- Mixed `analytics/commercial.ts` `STAGE_VALUES` / `75000` is **not** F2-authoritative.
- No numerical commercial target is authorized. Numerical CPR is not authorized.

### Why the decision matters

A “KPI completion” grant without definitions would load sellPrice, margin, or owner estimates as if they were facts.

### B. DECISION REQUIRED — question for the Owner

Which KPI behaviours, if any, may a later grant persist or expose — within the prohibitions below?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-07-A** | No KPI history. I7-class preview computation remains non-durable. Revenue and profit remain undefined. |
| **G-07-B** | Later grant may persist **historical observations** of metrics I7 already computes from **recorded** facts (counts, conversion only when booking facts exist, response-time only from complete stamp chains). Still `numericalTargetAuthorized: false` unless a **separate commercial-rule** record says otherwise (not this matrix). |
| **G-07-C** | Revenue and/or profit remain **out of scope** until a **separate finance / recognition definition** exists. G-07 cannot define revenue or profit. |
| **G-07-D** | Mixed J3 analytics remain non-authoritative for F2. A later grant must not promote `STAGE_VALUES` / `75000` to F2 KPI facts. |

Options may later be combined in a selection record (for example B+C+D). Combination is **not** selected here.

### Explicit prohibitions (all options)

A later grant, and this matrix, **must not**:

- infer **revenue** from sell price;
- infer **profit** from costing margin;
- introduce **numerical CPR**;
- load **~25 / ~3 / ~12%** (or any other unaudited estimate) as facts;
- silently exclude incomplete response-time records to manufacture a better KPI;
- introduce numerical commercial targets.

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-07-A** | H-64 D5 history gap remains. | No KPI history table. |
| **G-07-B** | History only from recorded facts. | Persist observations; keep unavailable reasons. |
| **G-07-C** | Finance definitions remain a separate gate. | No revenue/profit columns. |
| **G-07-D** | Mixed analytics cannot be cited as F2 KPIs. | No wiring of `STAGE_VALUES` into F2 KPI persist. |

### Dependencies / decisions that must precede it

G-02/G-03 for stamp and qualification facts. G-05 if conversion history is wanted. Finance definition record **before** any revenue/profit metric (none is defined here).

### No decision made in this record

```text
G-07 = OPEN — NO DECISION MADE IN THIS RECORD
REVENUE ≠ SELL PRICE
PROFIT ≠ COSTING MARGIN
NO NUMERICAL CPR
NO ~25 / ~3 / ~12% AS SYSTEM DATA
INCOMPLETE RESPONSE-TIME CHAINS REMAIN UNAVAILABLE
```

---

## 12. G-08 — Operator UI scope

### Decision ID

`G-08`

### Decision title

Operator UI scope.

### A. VERIFIED FACT — current verified position

- H-64-FND-05A **D1**: no commercial-facts UI; API-led preview UAT accepted for that baseline.
- H-64-FND-05B **D6**: UI is a future candidate, **not authorized**, not ranked.
- `apps/web` has **no** `commercial-facts` or `kpis/preview` client usage (C1–C10 assessment).
- H-62 grant was preview-only UAT, not company-wide UI adoption.

### Why the decision matters

UI without durable facts would write to memory that dies on restart. UI is not implied by persist, and persist is not implied by UI.

### B. DECISION REQUIRED — question for the Owner

What operator interface, if any, may a later grant include?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-08-A** | API-only. No commercial-facts UI. |
| **G-08-B** | Later grant may include a **commercial-facts UI** for fact types named in G-02, after those facts are durable **or** with explicit acceptance that preview UI is non-durable (H-64: non-durable blocks operational adoption). |
| **G-08-C** | Later grant may include a broader commercial UI (pipeline/RFP/proposal screens beyond facts forms). Scope would be named in that grant. |
| **G-08-D** | UI remains out of scope until G-01/G-02/G-10 are decided and a **separate UI grant** exists (H-64-FND-05B). |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-08-A** | Operator adoption via UI remains unavailable. | No web facts screens. |
| **G-08-B** | UI grant still separate from this matrix. | Web write path only for named facts. |
| **G-08-C** | Broader UX still not Production UX. | Must not be treated as Production readiness. |
| **G-08-D** | UI blocked until a dedicated grant. | No UI work. |

Inbox, Excel, WhatsApp, or Gmail **clients / ingest** are **not** UI options here (ingest remains unauthorized).

### Dependencies / decisions that must precede it

G-02, G-10. Durable facts if operational UI use is claimed.

### No decision made in this record

```text
G-08 = OPEN — NO DECISION MADE IN THIS RECORD
```

---

## 13. G-09 — C-spine naming and authoritative C9/C10 interpretation

### Decision ID

`G-09`

### Decision title

C-spine naming and authoritative C9/C10 interpretation.

### A. VERIFIED FACT — current verified position

H-29 controlling C-spine:

| ID | Capability |
| --- | --- |
| C1 | CRM |
| C2 | Opportunity |
| C3 | RFP |
| C4 | Supplier rates |
| C5 | Programme |
| C6 | Costing |
| C7 | Approval |
| C8 | Proposal |
| C9 | Booking |
| C10 | KPI |

H-29 also records: **C10 command center** is a **booking handover/ops/finance rollup** and is **not** the C10 KPI pack. Domain J analytics is not C10.

Verified in code/tests: booking module health string `increment: "C9-C10"`; test file `c10-command-center.test.ts` covers handover, not I7 KPI. Prompt/UAT packs have historically used shifted maps; H-64/H-59 numbering collision is a recorded governance fact, not a reason to rewrite H-29 in this matrix.

### Why the decision matters

A later grant that says “complete C10” is ambiguous unless C10 means KPI (H-29) rather than command-center.

### B. DECISION REQUIRED — question for the Owner

What naming rule binds future grants and UAT packs?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-09-A** | Reaffirm H-29 as controlling: **C9 = Booking**, **C10 = KPI**. Booking command-center is **not** C10 KPI. Future grants must use H-29 IDs. |
| **G-09-B** | Reaffirm H-29 as in G-09-A, and require future grants to **alias** colliding labels (`c10-command-center`, health `C9-C10`) explicitly as booking handover, not KPI. |
| **G-09-C** | Record the collision as a known limitation only; do not reaffirm or amend numbering in a later grant until a dedicated numbering record exists. H-29 remains unamended by this matrix in any case. |

This matrix **does not amend H-29**.

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-09-A** | Later UAT/grants cite H-29. | No rename required by G-09-A itself. |
| **G-09-B** | Collision must be spelled out in grant text. | Optional later label/comment changes only if a software grant names them — not authorized here. |
| **G-09-C** | Ambiguity remains until a numbering record. | No change. |

### Dependencies / decisions that must precede it

None. G-09 can be decided independently and should be cited by any later G-05/G-07 grant.

### No decision made in this record

```text
G-09 = OPEN — NO DECISION MADE IN THIS RECORD
H-29 IS NOT AMENDED BY THIS RECORD
```

---

## 14. G-10 — Migration and coexistence strategy

### Decision ID

`G-10`

### Decision title

Migration and coexistence strategy.

### A. VERIFIED FACT — current verified position

The following are **distinct** and must stay distinct:

| Mode | Verified position |
| --- | --- |
| **Preview / in-memory** | F2 facts in `WeakMap`; lost on restart |
| **Dev/Test persistence** | Dual-path SoR when `store.dbPool` set; F2 facts currently **409 preview-only** on durable SoR |
| **Migration** | Production migration **NOT AUTHORIZED**. **No migration of `eos_gateb` is authorized.** Gate C remainder is not this grant. Dirty Class A/B persist work exists in the working tree and is **parked / preserved**, not authorized as F2 commercial-facts persist |
| **Production persistence** | Not the same as Dev/Test persist |
| **Production authorization** | **NOT AUTHORIZED**. E1 not approved. This matrix cannot grant it |

Mailbox/Excel/WhatsApp ingest and FX providers remain unauthorized.

### Why the decision matters

Turning on PG for F2 facts, running migrations, touching `eos_gateb`, and “going to Production” are four different acts. Conflating them would violate standing controls.

### B. DECISION REQUIRED — question for the Owner

In which environment, if any, may a later software grant persist F2 facts, and what is excluded?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-10-A** | Remain **preview / in-memory** only. No F2 facts persist grant. |
| **G-10-B** | A later grant may allow **Dev/Test persistence** of G-02-named facts on an **authorized disposable Dev/Test** store. This is **not** Production persistence. **Not** `eos_gateb` migrate. **Not** Production authorization. |
| **G-10-C** | A later grant may specify **coexistence**: mixed persist continues; F2 persist is additional; authority follows G-03. Still Dev/Test only unless a Production grant exists. |
| **G-10-D** | Owner records that **Production persistence** is reserved exclusively to a **separate Production authorization**. Selecting G-10-D in a later record still does **not** authorize Production, hosting, or production migration. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-10-A** | Operational-adoption claim remains blocked. | No F2 persist migration. |
| **G-10-B** | Dev/Test SoR possible only after a persist grant. | Migrations, if any, only on the named disposable Dev/Test target in that grant. **Not** `eos_gateb`. |
| **G-10-C** | Dual-write/read rules must be in the later grant. | Mixed + F2 coexist; G-03 decides authority. |
| **G-10-D** | Production remains separately gated. | No Production schema/cutover from G-10. |

**G-10 cannot authorize:** Production, production migration, `eos_gateb` migrate, ingest, FX, or bundling unrelated dirty Class A/B work unless a later grant names that bundle (this matrix does not).

### Dependencies / decisions that must precede it

G-01, G-02, G-03, G-11. Production-class desire still needs a Production grant **outside** G-10.

### No decision made in this record

```text
G-10 = OPEN — NO DECISION MADE IN THIS RECORD
DEV/TEST PERSISTENCE ≠ PRODUCTION PERSISTENCE
PRODUCTION PERSISTENCE ≠ PRODUCTION AUTHORIZATION
NO eos_gateb MIGRATION
NO PRODUCTION MIGRATION
```

---

## 15. G-11 — Relationship between software work and H-80 / H-81 evidence gating

### Decision ID

`G-11`

### Decision title

Relationship between software work and H-80 / H-81 evidence gating.

### A. VERIFIED FACT — current verified position

- H-80: controlled wait for **natural** post-adoption commercial evidence is **ACTIVE**. No numerical wait or case count. Wait ≠ “software is next.”
- H-81: **NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED**. Triggered review, not scheduled. Do not search solely to force start. Do not skip from H-80 to implementation.
- Sequence: `PROCESS ADOPTION → LIVE USE → OBSERVATION → EVIDENCE → MATURITY → REQUIREMENTS VALIDATION → SEPARATE IMPLEMENTATION DECISION`.
- This matrix does **not** alter H-80 or H-81.
- Software must **not** be created to manufacture the evidence H-81 requires.

### Why the decision matters

A persist increment during H-80 can be misread as skipping the evidence sequence, or as a tool to generate fake post-adoption cases.

### B. DECISION REQUIRED — question for the Owner

May any software implementation grant be written while H-81 remains unstarted, and under what explicit condition?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-11-A** | **No** software implementation grant until H-81 has executed a substantive review after its evidence trigger is satisfied. Governance/documentation-only work may continue. |
| **G-11-B** | Governance and **design-only** records may continue. Software implementation remains **NO** until H-81 substantive completion **or** an **explicit Owner waiver** recorded in a later decision record that names H-80 as still active. |
| **G-11-C** | Owner may later record a **waiver** allowing a **named, bounded** persist grant for **already-specified** F2 catalogues while H-80 remains active, **provided** the grant states that the work is **not** for manufacturing H-81 evidence and **not** a finding that Path D is validated. |

A waiver, if later recorded, must be explicit. **This matrix is not that waiver.**

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-11-A** | H-80/H-81 fully precede software. | No implementation grant. |
| **G-11-B** | Design docs allowed; code still blocked without H-81 or waiver. | No code until those conditions. |
| **G-11-C** | Parallel persist only if a later waiver exists. | Still no ingest, no fabricated cases, no H-81 force-start. |

### Dependencies / decisions that must precede it

None to keep H-80/H-81 as-is. Any waiver is a **later** Owner record. G-01–G-10 remain necessary inside any grant that a waiver might permit.

### No decision made in this record

```text
G-11 = OPEN — NO DECISION MADE IN THIS RECORD
THIS RECORD IS NOT AN H-81 WAIVER
DO NOT IMPLEMENT SOFTWARE TO MANUFACTURE H-81 EVIDENCE
H-80 = ACTIVE
H-81 = NOT STARTED
```

---

## 16. G-12 — Future increment naming and whether any future work may be called F2-I12

### Decision ID

`G-12`

### Decision title

Future increment naming and whether any future work may be called F2-I12.

### A. VERIFIED FACT — current verified position

- F2-I1–I11 are **frozen** preview-only evidence.
- **F2-I12 = NOT AUTHORIZED** and **not started**.
- H-64: GAP-02 and GAP-03 describe an **I12-class surface**; that description is **not** a grant to start I12.
- H-75 / H-73 / H-81: F2-I12 remains unauthorized.
- Thawing frozen I-modules is **not** authorized.

### Why the decision matters

Calling work “F2-I12” without a grant would appear to continue a frozen sequence. Using a new name without deciding G-12 would hide the H-64 I12-class booking surface.

### B. DECISION REQUIRED — question for the Owner

If a later software grant exists, how must it be named, and may it use the identifier F2-I12?

### Options (unranked; none selected)

| Option | Statement |
| --- | --- |
| **G-12-A** | Future work, if any, must **not** be called F2-I12. A later grant must use a **new** increment identifier. F2-I12 remains NOT AUTHORIZED. |
| **G-12-B** | F2-I12 remains NOT AUTHORIZED unless a **later** Owner grant **explicitly names** F2-I12, states scope, and thaws only what it names. This matrix does not name or start I12. |
| **G-12-C** | Frozen I1–I11 remain frozen. A later grant may add a **new** increment that consumes already-specified catalogues **without** thawing I1–I11 source for unrelated edits. Still not started here. |

### C. IMPLEMENTATION CONSEQUENCE

| Option | Governance consequence | Software consequence |
| --- | --- | --- |
| **G-12-A** | I12 identifier stays unused. | No I12 files or routes. |
| **G-12-B** | I12 can exist only after an explicit later grant. | This matrix starts nothing. |
| **G-12-C** | Freeze of I1–I11 preserved. | Later increment is additive only if granted. |

### Dependencies / decisions that must precede it

G-02, G-05, G-11. Booking facts (G-05-C/D) do not automatically equal “start I12.”

### No decision made in this record

```text
G-12 = OPEN — NO DECISION MADE IN THIS RECORD
F2-I12 = NOT AUTHORIZED
F2-I1–I11 REMAIN FROZEN
```

---

## 17. Cross-reference — Path D and H-64 (not reopened as grants)

Path D remains **requirements only**. Mapping below is **informational** for Owner review of G-items. It does **not** convert Path D into backlog.

| Path D requirement | Related G-item(s) |
| --- | --- |
| Structured qualification | G-02, G-03 |
| Loss-reason recording | G-02, G-03 |
| SOURCE and CHANNEL | G-02, G-03 |
| Market and account classification | G-02, G-03 |
| Proposal versioning | G-06 |
| Approval evidence | G-02, G-04 |
| Supplier-rate provenance | G-02 |
| Booking commercial facts | G-05, G-12 |
| KPI history | G-07 |
| Response-time evidence | G-02, G-03, G-07 |

H-64 carried-forward gaps remain **not authorized** by this matrix:

| H-64 item | Related G-item(s) |
| --- | --- |
| Booking cancellation | G-05 |
| Booking sidecar / win-copy | G-05 |
| Booking commercial-facts route | G-05, G-12 |
| KPI / revenue / profit limitations | G-07 |
| Sent-cost evidence | G-06 |
| Non-durable sidecar / UI | G-02, G-08, G-10 |
| Legacy 250k/20% | G-04 |

---

## 18. Decision Gate — What Must Be True Before Any Future Software Implementation Grant

This section does **not** authorize implementation.

A later software implementation grant would require an **explicit Owner authorization** identifying **at minimum**:

| Grant element | Must identify |
| --- | --- |
| Named increment / scope | Identifier (G-12) and in-scope capabilities |
| Fact types being persisted | Exact G-02 selection (named maps/fields already specified; no new rules) |
| Authoritative model | G-03 mixed vs F2 |
| Treatment of mixed legacy fields | Including receipt, source, market, stage ≠ qualification |
| Treatment of 250k/20% | G-04 — **no new number invented in the grant unless a separate commercial-rule record exists** |
| Allowed environment | Preview in-memory vs Dev/Test persist vs (only if separately authorized) Production — G-10 |
| Migration boundaries | **No** `eos_gateb` migrate unless a **separate** record authorizes it; **no** Production migration unless Production is authorized |
| UAT scope | API vs UI (G-08); whether H-63 NOT_EXECUTED booking scenarios are in; no fabricated bookings (G-05) |
| Explicit exclusions | Ingest, FX, revenue/profit, numerical CPR, owner KPI estimates, Production (unless a Production grant), C1–C10 expansion beyond named scope, thaw of unnamed frozen modules |
| UI included? | G-08 yes/no and which surfaces |
| Booking included? | G-05 cancel / facts / win-copy named separately |
| KPI history included? | G-07, with prohibitions on revenue, profit, CPR, ~25/~3/~12%, incomplete response-time dropping |
| H-81 | **Satisfied** (substantive review after trigger) **or** an **explicit Owner waiver** recorded (G-11). This H-82 record is **neither**. |

Until such a grant exists:

```text
SOFTWARE IMPLEMENTATION AUTHORIZATION = NO
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
C1–C10 SOFTWARE EXPANSION = PAUSED
F2-I1–I11 = FROZEN
H-80 = ACTIVE
H-81 = NOT STARTED
```

This decision matrix is **not** that grant.

---

## 19. Authorization matrix (this record)

| Area | H-82 status |
| --- | --- |
| Owner selections G-01–G-12 | **NONE — ALL OPEN** |
| H-75 process adoption | **UNCHANGED (YES)** |
| EOS / software adoption | **NOT GRANTED** |
| Software implementation | **NOT AUTHORIZED** |
| Operational SoR for EOS | **NOT AUTHORIZED** |
| F2-I12 | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| Commit / push | **NOT AUTHORIZED** |
| H-80 / H-81 | **UNCHANGED** |
| Application / schema / migration / UI / infrastructure | **NOT CHANGED BY THIS RECORD** |

---

## 20. Next GOVERNANCE action after Owner review

Owner / POA review of **G-01 through G-12**.

If the Owner later selects options, those selections belong in a **separate** Owner decision record (not this matrix). That later record would still **not** be a software grant unless it also satisfies §18.

Until then:

- H-80 controlled wait remains **ACTIVE**;
- H-81 remains **NOT STARTED** until its evidence trigger is satisfied;
- do **not** implement, thaw I1–I11, start I12, migrate, or authorize Production;
- do **not** manufacture post-adoption cases or booking evidence.

```text
NEXT GOVERNANCE ACTION = OWNER / POA REVIEW OF G-01 THROUGH G-12
NEXT SOFTWARE ACTION = NONE AUTHORIZED
```

---

## 21. Status block

```text
OWNER DECISION MATRIX = GOVERNANCE-ONLY
SOFTWARE IMPLEMENTATION AUTHORIZATION = NO
F2-I12 = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```
