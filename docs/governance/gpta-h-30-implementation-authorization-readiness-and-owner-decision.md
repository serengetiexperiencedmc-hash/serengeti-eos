# GPTA-H-30 — C1–C10 Implementation Authorization Readiness & Owner Decision Package

> **`GOVERNANCE-ONLY — DECISION READINESS`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NOT A CODING TASK`** · **`NOT A SCHEMA TASK`** · **`NOT A MIGRATION TASK`**  
> **`NO C1–C10 ALTERATION`** · **`NO C11+`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T00:52:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

Authoritative (not rewritten): GPTA-H-16 · H-17 · H-18 · H-19 · H-25 · H-26 · H-27 · H-28 · [`gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md`](gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md).

```text
REQUIREMENTS COMPLETE        = YES (GPTA-H-29) — pending Owner Decision 1
IMPLEMENTATION READY         = NO
IMPLEMENTATION AUTHORIZED    = NO  (Owner Decision 5 — unselected)

IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
```

These three states are **not** collapsed. Approval of H-29, if later given, does **not** automatically authorize coding.

No numerical commercial target, floor, or qualification threshold is invented here. No Owner option is pre-ticked.

---

## A. Executive decision summary

The C1–C10 remediation programme is **ready to be presented** for Owner decisions. It is **not** implementation-ready and **not** implementation-authorized.

| State | Result |
| --- | --- |
| A. Requirements complete | **YES as defined** in H-29. **Owner approval of that definition is still required** (Decision 1) |
| B. Implementation ready | **NO** — Gate H items 1, 4–5, 8–12, and 14 are not satisfied |
| C. Implementation authorized | **NO** — Decision 5 remains Owner-controlled and **blank** |

**What the Owner must decide (this pack):**

1. Approve / amend / defer **H-29**.  
2. Approve / amend / defer the **source-of-truth** model.  
3. Approve / amend / defer **implementation scope** (C1–C10 remediation only).  
4. Approve / amend / defer **sequencing** (candidate only until chosen).  
5. **`IMPLEMENTATION AUTHORIZED`** or **`IMPLEMENTATION NOT AUTHORIZED`** — a **separate** explicit decision.

**Recommended reading order for the decision-maker:** §G → §J → §I → §D. Do not treat §H as approved merely because it is written.

---

## B. Current governance state

| Item | Status |
| --- | --- |
| Branch / HEAD | `master` / `75ee4c3` |
| Index | **EMPTY** |
| Commercial objective | **APPROVED / FROZEN** (H-16) — Commercial Growth & Sales Effectiveness |
| Stage 1 | **APPROVED / FROZEN** (H-16) |
| Process-first | **YES** (H-16 Decision 7) |
| 1A / 1B | Requirements + 1B live validation **complete** (H-17–H-28) |
| Business rules | **OWNER APPROVED** (H-25); targeted closures **complete** (H-27) |
| H-28 | **1B LIVE VALIDATION COMPLETE** |
| H-29 | **REMEDIATION REQUIREMENTS DEFINED** — Owner approval **open** |
| OR-04 | `NO NUMERICAL TARGET AUTHORIZED` |
| Commercial floor **value** | `NOT AUTHORIZED` |
| DR-008 | **DEFERRED** (not closed) |
| NA-A-22 | **OPEN** |
| E1 | **NOT APPROVED / BLOCKED**; architecture/provider/geography **unselected** |
| E1-C | **CONTROLLED PAUSE** |
| E1-D | **FORMALLY PARKED / DEFERRED** |
| GPTA-H-01 Path B | **HOLD** |
| Application `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| Live commercial SoR | **Office / Excel / Outlook-Gmail / WhatsApp / phone** (H-19 / H-28) |
| C11+ | **NOT AUTHORIZED** |
| UAT / Production / commit / push | **NOT GRANTED** |

H-16 remaining rule: commercial process, baseline, requirements, and EOS operational readiness **must** be established **before** new software development is authorized. H-29 defines the remaining software-facing requirements. This file prepares the **authorization decision**, it does not grant it.

---

## C. H-29 reconciliation

Governance-only check of [`gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md`](gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md). No H-29 body rewritten.

### C.1 Distinctions preserved

| Distinction | H-29 result | H-30 confirmation |
| --- | --- | --- |
| `new_qualified` is a **stage**, not OR-01 | Explicit | **Confirmed** |
| SOURCE ≠ CHANNEL | D1.1 / D1.2; AC-C1-04/05 | **Confirmed** |
| Market ≠ Buyer/Account Type | D1; H-27 15-value Market | **Confirmed** |
| Approval ≠ proposal send | D7; AC-C7-05 | **Confirmed** |
| Office = document production, not future structured SoR | §C.C / C.D | **Confirmed** |
| Email / WhatsApp / phone = channels | §C.B | **Confirmed** |
| Identity chain retained | OPP→…→BKG | **Confirmed** |
| No C11+ in scope | §G exclusions | **Confirmed** |
| No numerical commercial target invented | OR-04 restated | **Confirmed** |
| No unauthorized commercial floor invented | Floor value not set; 250k/20% rejected as governing rule | **Confirmed** |
| No qualification threshold invented | D2 | **Confirmed** |

### C.2 Traceability (requirement → evidence)

| H-29 area | Traces to | H-28 evidence used |
| --- | --- | --- |
| C1 taxonomy / SOURCE / CHANNEL / PCO | H-17 BR-005/007; H-25 OR-03/OR-07; H-27 §6–8 | Partial CRM; no PCO; no SOURCE/CHANNEL pair |
| C2 qualification ≠ stage | H-17 BR-001/PR-009; H-25 OR-01 | `new_qualified` stage only |
| C2 loss | H-17 BR-006; H-25 OR-02; H-27 contributing = same catalogue | No LR capture |
| C3 clarification / follow-up | H-17 BR-003/PR-002/PR-005; H-25 OR-04-FU | No clarification; tasks `[]` |
| C4 rates | H-17 CR-S*; H-25 OR-08; H-27 §10 | Validity fields exist; expiry silent; types not demonstrated |
| C5–C6–C8 programme/costing/proposal | H-17 PR-003/CR-013–025 | Chain partial; snapshot incomplete |
| C7 approval matrix | H-25 OR-05/06; H-27 §9 | Numerical gate observed — **must not be preserved as the rule** |
| C9 booking dimensions | H-17 PR-006/KR-S05 | FKs yes; Market/SOURCE/type no |
| C10 KPI categories | H-17 KR-* / AC-009 | Command center ≠ pack |

No H-29 requirement was found that depends only on unstated Owner invention. DR-008 is **explicitly left deferred**. Commercial Parameter Register **values** are **explicitly not set**.

### C.3 Acceptance criteria — evidence methods

Each H-29 AC in §F is testable by **Dev/Test structured-record inspection** (API/UI/export of disposable records), not by code existence:

| AC family | Evidence method |
| --- | --- |
| AC-C1-* / AC-S / AC-M | Inspect opportunity/account records for Market list value, OR-03 type including PCO, primary+secondary SOURCE, separate CHANNEL, SOURCE change history |
| AC-C2-* / AC-Q / AC-L | Inspect qualification status independent of stage; OR-01-B completeness; LR-01–LR-12 at closed-lost |
| AC-C3-* / AC-F / AC-T | Inspect received/clarification/next-action/owner-transfer stamps; action list without email |
| AC-C4-* / AC-R | Inspect live-proposal rate type, expiry behaviour, overlap resolution, currency, version id |
| AC-C5-* | Inspect programme↔RFP link and Office-file identity against EOS version **if** an Office file is used |
| AC-C6-* | Reconstruct sent costing from snapshot; later edit ≠ overwrite |
| AC-C7-* | Approval trigger class from H-27 list; in-parameter send without executive approval; sender ≠ approver |
| AC-C8-* / AC-P | Sent proposal identity/version/sender/time/links/snapshot |
| AC-C9-* | Booking traces to opportunity; dimensions present at win |
| AC-C10-* | Counts from structured qualification/outcome, not from stage name or booking rollup alone |

### C.4 Ambiguities recorded (not invented closed)

| Ambiguity | Disposition |
| --- | --- |
| DR-008 flag taxonomy vs OR-03 | **Remains DEFERRED** — see §E |
| Commercial Director “visibility” mechanism (queue vs notice vs access) | **Process detail open**; H-29 requires visibility, not a named system |
| Ordinary “in-parameter” without floor **value** | Allowed as **professional judgement against the eight H-27 categories** until register values exist — **only if** Owner Decision 5 / condition 5 explicitly accepts that for the first increment |
| Qualification definition **version label** (H-26 DR-002) | Design detail; OR-01 text is authorized; a version identifier is **not** invented |
| H-28 in-memory only (not PostgreSQL dual-path) | Future test evidence must include the intended Dev/Test store; **not** resolved here |
| Existing `RfpRecord.source` combines intake with origin | Requirements conflict recorded; **no schema change** in this task |

**No contradiction** found that invalidates H-29 as a requirements package. **Implementation readiness** remains separate and **not** declared.

---

## D. Implementation-readiness matrix

Status vocabulary: `SATISFIED` · `DEFINED — NOT APPROVED` · `DEFERRED` · `NOT SATISFIED` · `SEPARATELY GATED`.

**Blocking?** = blocks declaring **IMPLEMENTATION READY** and/or starting an authorized increment. It does **not** block presenting this decision pack.

### D.1 Business governance

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| BG-01 | Commercial objective approved | H-16 Decision 1 | `SATISFIED` | No | Owner (recorded) | None |
| BG-02 | Stage 1 frozen | H-16 | `SATISFIED` | No | Owner (recorded) | None |
| BG-03 | Business requirements defined | H-17 | `SATISFIED` | No | Governance | None |
| BG-04 | Business rules authorized | H-25 | `SATISFIED` | No | Owner (recorded) | None |
| BG-05 | H-29 remediation package defined | H-29 | `DEFINED — NOT APPROVED` | **Yes** for ready | Owner Decision 1 | Approve / amend / defer H-29 |
| BG-06 | Owner approval of H-29 | This pack §J D1 | `NOT SATISFIED` | **Yes** | Owner | Decision 1 |
| BG-07 | Commercial parameters | H-27 register; OR-04 | Definition `SATISFIED`; values `DEFERRED` | **Yes unless** Owner explicitly waives values for increment 1 | Owner / management | Decision 5 condition 5 |
| BG-08 | Qualification rules | H-25 OR-01; H-29 D2 | `SATISFIED` (rules) | No | Owner (recorded) | None for rules |
| BG-09 | Loss taxonomy | H-25 OR-02; H-27 | `SATISFIED` | No | Owner (recorded) | None |
| BG-10 | Account taxonomy (OR-03 + PCO) | H-25 | `SATISFIED` | No | Owner (recorded) | None |
| BG-11 | Market taxonomy | H-27 15 values | `SATISFIED` | No | Owner (recorded) | None |
| BG-12 | SOURCE/CHANNEL rules | H-27 §6 | `SATISFIED` | No | Owner (recorded) | None |
| BG-13 | Approval rules (non-numerical) | H-27 §9; H-29 D7 | `SATISFIED` as categories | Values see BG-07 | Owner (recorded) | Do not restore 250k/20% as Owner rule |

### D.2 Product / application

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| PA-C1 | C1 remediation scope | H-29 D1 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C2 | C2 remediation scope | H-29 D2 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C3 | C3 remediation scope | H-29 D3 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C4 | C4 remediation scope | H-29 D4 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C5 | C5 remediation scope | H-29 D5 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C6 | C6 remediation scope | H-29 D6 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C7 | C7 remediation scope | H-29 D7 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C8 | C8 remediation scope | H-29 D8 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C9 | C9 remediation scope | H-29 D9 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3 |
| PA-C10 | C10 remediation scope | H-29 D10 | `DEFINED — NOT APPROVED` | Yes until D1 | Owner | Decision 1+3; **not** Domain J / C11+ |
| PA-AC | Acceptance criteria | H-29 §F | `DEFINED — NOT APPROVED` | **Yes** | Owner | Decision 1 (AC included) |
| PA-REG | Regression of identity chain | H-28 chain; H-29 retain | `DEFINED` | Yes at test time | Technical owner after authorization | Include in test plan **when authorized** |

### D.3 Data

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| DA-01 | Existing data impact | H-28 demo seed only; live SoR is Office | `DEFINED` | No for Dev/Test; **Yes** if live data touched | Owner | Decision: no live commercial mutation |
| DA-02 | Data ownership | H-29 §C.A–C.C | `DEFINED — NOT APPROVED` | **Yes** | Owner Decision 2 | Approve SoR |
| DA-03 | Migration requirement | H-29 default: **no** automatic Office-history migration | `DEFINED — NOT APPROVED` | **Yes** until explicit | Owner | Decision 2 + condition 6 |
| DA-04 | Historical Office/Excel treatment | Remain working/presentation until SoR cutover | `DEFINED — NOT APPROVED` | **Yes** until explicit | Owner | Same |
| DA-05 | SoR transition | H-29 §C.D | `DEFINED — NOT APPROVED` | **Yes** | Owner Decision 2 | Approve / amend / defer |
| DA-06 | Data quality | Demo seed ≠ live quality | `NOT SATISFIED` as live baseline | Blocks **production** use, not a Dev/Test increment if scoped | Owner | Baselines remain unaudited estimates |
| DA-07 | Auditability | H-29 SOURCE change, owner transfer, qualification change, rate version | `DEFINED` | Yes at test time | Owner + technical | Include in AC tests |

### D.4 Security / privacy

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| SP-01 | Authentication | Preview `local-password-dev`; Production identity **unselected** | Dev/Test exists; Production `SEPARATELY GATED` | Blocks **production**, not a gated Dev/Test increment | E1 / identity governance | Do not treat preview login as Production IAM |
| SP-02 | Authorization | Existing principal/capability model in Dev/Test | `SEPARATELY GATED` for Production | Same | Security governance | Review at increment design **when authorized** |
| SP-03 | Commercial-data access | Classification fields exist on commercial objects | `DEFINED` as need-to-know principle; **not** a new ACL design | Yes for Production | Owner + security | No live customer data in first increment |
| SP-04 | Audit logging | Existing audit/outbox structures (Class A/B parked) | `SEPARATELY GATED` | Production yes | E1-C / I4 | Do not unpark Class A/B in this pack |
| SP-05 | Privacy | DPO designated; PDPC not established; E1 privacy track | `SEPARATELY GATED` | Production yes | DPO / Legal / E1 | Unchanged |
| SP-06 | Document access | Office files remain outside EOS | `DEFINED` | No if Office stays presentation | Owner Decision 2 | Do not ingest mailboxes |
| SP-07 | External communication data | Channels remain email/WhatsApp/phone | `DEFINED` | **Yes** if anyone proposes capturing message bodies | Owner | **Out of first increment** unless separately authorized |

No RTO/RPO, IAM, or hosting values are invented.

### D.5 Testing / UAT

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| TU-01 | Unit/integration testing | Existing API tests; not H-29 AC suite | `NOT SATISFIED` for H-29 ACs | **Yes** before increment complete | Technical after authorization | Test plan (condition 9) |
| TU-02 | End-to-end testing | H-28 demo chain is **validation**, not a future regression plan | `NOT SATISFIED` | **Yes** | Technical | Same |
| TU-03 | Dev/Test validation | H-28 complete for **as-is** | `SATISFIED` as baseline | No for **presenting** decision | Governance | Re-validate **after** any authorized increment |
| TU-04 | UAT scenarios | Not written | `NOT SATISFIED` | **Yes** for UAT; Production UAT `SEPARATELY GATED` | Owner names UAT authority | Condition 8–9 |
| TU-05 | Acceptance authority | Not named | `NOT SATISFIED` | **Yes** | Owner | Decision / condition 8 |
| TU-06 | Rollback criteria | H-29 Gate H item 11 defined as required, not written | `NOT SATISFIED` | **Yes** before increment that mutates stored facts | Technical + Owner | Condition 9 |

### D.6 Production governance

| Gate | Requirement | Evidence | Status | Blocking? | Owner/Authority | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| PG-01 | Production architecture | E1 unselected / blocked | `SEPARATELY GATED` | Blocks **Production**, not Dev/Test increment if Production remains gated | E1 Owner | Unchanged |
| PG-02 | Deployment authorization | Not granted | `NOT SATISFIED` | **Yes** for deploy | Owner | Separate from Decision 5 unless Decision 5 is Dev/Test-only |
| PG-03 | Migration authorization | Not granted | `NOT SATISFIED` | **Yes** | Owner | Default: no Office migration |
| PG-04 | Backup/restore | Gate B historically closed; E1-D parked | `SEPARATELY GATED` | Production yes | E1-D / ops | Do not unpark E1-D here |
| PG-05 | RTO/RPO | Not selected | `SEPARATELY GATED` | Production yes | E1 | Do not invent values |
| PG-06 | Operational ownership | Commercial Director / Sales & BD in H-25; Production ops unselected | Partial (commercial roles yes) | Production yes | Owner | Name increment technical owner **when authorizing** |
| PG-07 | Support model | Not defined for live EOS commercial SoR | `NOT SATISFIED` | Production yes | Owner | After live SoR cutover decision |

### D.7 Readiness conclusion

```text
IMPLEMENTATION READY = NO
```

Reason: Owner has not approved H-29/SoR/scope; commercial-parameter **values** are unauthorized unless explicitly waived for increment 1; migration treatment not Owner-confirmed; test/UAT/rollback artefacts not produced; Production remains separately gated.

```text
READY TO PRESENT IMPLEMENTATION AUTHORIZATION DECISION = YES
```

---

## E. DR-008 reconciliation

H-17 **DR-008** (single requirement, five concerns):

> Account flags: **target / strategic / repeat / direct / agency** — when classified.  
> Priority: **Should**. Classification rules: historically `OWNER CONFIRMATION REQUIRED`. Maps BR-005 / AC-010.

Historical records are **not rewritten**. Latest dispositions:

| Concern | What it is | H-18 | H-26 | H-27 | H-29 | H-30 |
| --- | --- | --- | --- | --- | --- | --- |
| **target** | Flag that an account is a target account | No Owner meaning | `DESIGN DETAIL REQUIRED` | Deferred (not in six-item pack) | Not closed; must not replace OR-03 | **DEFERRED** |
| **strategic** | Strategic-account classification | Field exists; rules unapproved | Same | Deferred | Visibility aid only until DR-008 closed | **DEFERRED** |
| **repeat** | Repeat-business classification | Unknown | Same | Deferred | **Reportability via prior won/booking on same account** required **without** closing the flag | Flag **DEFERRED**; reporting path **defined** in H-29 D1 |
| **direct** | Direct-business flag (vs agency) | Unapproved | Same | Deferred | Not closed | **DEFERRED** |
| **agency** | Agency-relationship flag | Overlaps OR-03 Incentive House / etc. | Flags ≠ Account Type | Deferred | OR-03 remains the type; flag still deferred | **DEFERRED** |

| Question | Answer |
| --- | --- |
| Does H-29 resolve DR-008? | **No.** It **must not** be treated as closed. It supplies a **repeat-from-history** measurement path and forbids using flags as a substitute for OR-03 |
| Remains open? | **Yes — DEFERRED** |
| Blocks presenting this pack? | **No** |
| Blocks **full** AC-010 (“accounts can be classified target/strategic/repeat/direct/agency once rules are approved”)? | **Yes**, until Owner approves flag rules |
| Blocks a **first implementation increment** limited to H-29 D1 (OR-03 + PCO + Market + SOURCE/CHANNEL + repeat-from-history)? | **Only if** the Owner insists AC-010 flag taxonomy is in that increment. Default H-29 scope does **not** implement the flag taxonomy |
| Authority to close | Authorized commercial decision-maker (same class as H-25). **Not** this file |

```text
DR-008 STATUS = DEFERRED
DR-008 ≠ CLOSED
DO NOT SILENTLY CONVERT DEFERRED INTO CLOSED
```

AC-010 remains a **Should** pending flag-rule approval. KR-C04 repeat as a **count from prior bookings** can proceed under H-29 without closing DR-008.

---

## F. Commercial-parameter status

```text
PARAMETER DEFINITION REQUIRED  ≠  PARAMETER VALUE AUTHORIZED
ABSENCE OF A NUMERICAL TARGET ≠ FAILURE OF H-29
```

| Parameter | Definition | Value |
| --- | --- | --- |
| Revenue targets | KPI **category** KR-C02 | `NO NUMERICAL TARGET AUTHORIZED` (OR-04) |
| RFP volume targets | KR-D01 category | Same |
| Conversion targets | KR-S05 category | Same |
| Response-time targets | KR-S01 category | Same |
| Margin floor | H-27 category “below approved floor” | `COMMERCIAL FLOOR VALUE = NOT AUTHORIZED` |
| Approval monetary/percent thresholds | H-27 eight **risk classes** defined | Observed 250k/20% is **not** an Owner value; **must not** be preserved as the governing rule |
| Discount / credit / size / liability numbers | Placeholder register | **Not authorized** |
| Qualification score/threshold | OR-01 qualitative | **Not authorized** (none invented) |

**First increment implication:** C7 can be specified against the **eight H-27 categories** without a floor **number** **if and only if** Owner Decision 5 / condition 5 states that parameter **values** are **not required** for that increment. That statement is **not** made here.

---

## G. Source-of-truth decision

H-29 model (for Decision 2; **not** pre-approved by this file):

| Layer | Role |
| --- | --- |
| **EOS** | System of record for **structured commercial facts** (H-29 §C.A) |
| **Office / Excel** | Document production and working calculator; **not** the future structured SoR |
| **Email / WhatsApp / phone** | Communication channels; **not** the structured SoR |

Facts that **cannot** remain only in Office if EOS is to provide pipeline, conversion, follow-up, and KPI reporting are listed in H-29 §C.A.

**Current** operating SoR remains Office (H-19/H-28) until cutover is separately authorized **after** implementation and acceptance.

---

## H. Proposed implementation sequencing

**Status:** `CANDIDATE — NOT APPROVED`. Decision 4 must be taken explicitly. Do **not** implement.

Process-first (H-16) remains: no coding until Decision 5 authorizes an increment.

| Increment | Objective | Capabilities | Depends on | Acceptance (from H-29) | Test evidence | Rollback | UAT | Production |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **F0 — Foundational identity** | Record Market, OR-03+PCO, SOURCE/CHANNEL, account–opportunity identity without destroying the OPP→BKG chain | C1, C2 identity fields | H-29 D1 approved; DR-008 remains deferred | AC-C1-01–06; AC-S; AC-M | Disposable Dev/Test records; no live accounts | Revert increment; no Office import | Dev/Test first; UAT only if Owner names authority | **Out** |
| **F1 — Qualification & RFP workflow** | Qualification ≠ stage; clarification stamps; RFP-bound follow-up | C2, C3 | F0 | AC-Q; AC-C2-*; AC-F; AC-T; AC-C3-* | Seed + new disposable RFPs | Restore pre-increment behaviour | Same | **Out** |
| **F2 — Supplier-rate integrity** | Types, expiry, overlap, currency, verification | C4 | F0 (identity only weakly) | AC-R; AC-C4-* | Disposable rates; expired must not silently sell | Restore rate handling | Same | **Out** |
| **F3 — Programme / costing / proposal traceability** | Sent snapshot reconstructable | C5, C6, C8 | F0–F2 | AC-C5-*; AC-C6-*; AC-P; AC-C8-* | Disposable programme→cost→proposal | Preserve prior snapshots | Same | **Out** |
| **F4 — Approval ≠ send** | H-27 categories; in-parameter path; sender ≠ approver | C7 | F3 | AC-C7-* | Two disposable proposals: in-parameter vs triggered | Do **not** keep 250k/20% as Owner rule on rollback either | Same | **Out** |
| **F5 — Booking dimensions** | Win retains Market / type / SOURCE / value / origin | C9 | F0, F3 | AC-C9-* | Disposable win from F3/F4 proposal | Identity chain preserved | Same | **Out** |
| **F6 — KPI pack** | Categories from structured data; not command-center-only | C10 | F0–F5 | AC-C10-*; AC-009 categories | Reproduce counts from the same disposable set | Reporting-only rollback | Same | **Out**; **not C11+** |

**Foundational:** F0. **Dependent:** F1 on F0; F3 on F2 for rate snapshot; F4 on F3; F5 on F0+F3; F6 on all structured facts.

A first **authorized** increment, if ever granted, **should** be no larger than **F0**, unless the Owner explicitly authorizes a larger slice. That recommendation is **not** an authorization.

---

## I. Implementation authorization conditions

Coding may begin **only when all** of the following are true. This list is a **checklist**, not a grant.

1. H-29 **approved** (Decision 1 = APPROVE, or an approved amendment recorded).  
2. Source-of-truth model **approved** (Decision 2).  
3. Implementation scope **approved** (Decision 3): C1–C10 requirements-aligned remediation only; no C11+; no unrelated redesign.  
4. All **blocking** business rules for the chosen increment resolved (OR-01–OR-08 and H-27 closures already recorded; DR-008 remains deferred unless the increment claims full AC-010 flags).  
5. Commercial parameters: **values authorized** **or** Owner records that values are **not required** for the first increment (categories/risk list only).  
6. Migration treatment **explicitly decided** (H-29 candidate: no automatic Office-history migration).  
7. Affected C1–C10 acceptance criteria for **that increment** approved.  
8. UAT authority **identified** (or Owner records UAT **not required** for a Dev/Test-only increment).  
9. Test plan **approved** for that increment (Dev/Test disposable data; no production data).  
10. **That implementation increment** explicitly authorized (Decision 5 names the increment, e.g. F0 only).  
11. Production remains **separately gated** (E1 unchanged unless a later pack says otherwise).  
12. Commit/push authority **separately granted** (not implied by Decision 5 unless the Owner writes it).

```text
APPROVAL OF H-29 ≠ AUTHORIZATION TO CODE
DECISION 5 IS A SEPARATE EXPLICIT DECISION
```

---

## J. Owner decision page

**Authority:** authorized commercial decision-maker / Commercial Director (same class as H-16 / H-25).

**Do not tick any option in this file on the Owner’s behalf.**

Leave the recorded choice blank until the Owner records it in a later capture pack.

### Decision 1 — H-29 approval

Approve the remediation requirements and acceptance criteria in GPTA-H-29.

- [ ] **APPROVE H-29**  
- [ ] **AMEND H-29** — amendment text required  
- [ ] **DEFER H-29**

**Recorded choice:** `OWNER DECISION = NOT YET RECORDED`

### Decision 2 — Source-of-truth model

EOS = structured commercial SoR; Office = document production; email/WhatsApp/phone = communication channels (H-29 §C).

- [ ] **APPROVE**  
- [ ] **AMEND** — amendment text required  
- [ ] **DEFER**

**Recorded choice:** `OWNER DECISION = NOT YET RECORDED`

### Decision 3 — Implementation scope

Future implementation limited to requirements-aligned remediation of **C1–C10**; **no C11+**; **no unrelated EOS redesign**; **no** digital-programme implementation; **no** Office-history migration unless Decision 2/condition 6 says otherwise.

- [ ] **APPROVE**  
- [ ] **AMEND**  
- [ ] **DEFER**

**Recorded choice:** `OWNER DECISION = NOT YET RECORDED`

### Decision 4 — Implementation sequencing

Candidate F0→F6 in §H. **Not approved by being written.**

- [ ] **APPROVE** candidate sequence F0→F6  
- [ ] **AMEND** sequence  
- [ ] **DEFER** sequencing until after Decision 5

**Recorded choice:** `OWNER DECISION = NOT YET RECORDED`

### Decision 5 — Implementation authorization

Distinct from Decisions 1–4.

- [ ] **`IMPLEMENTATION AUTHORIZED`** — must name increment, Dev/Test vs Production, and whether commit/push is included (**default: not included**)  
- [ ] **`IMPLEMENTATION NOT AUTHORIZED`**

**Recorded choice:** `OWNER DECISION = NOT YET RECORDED`

If Decision 5 is later **AUTHORIZED**, the recorder **must** also complete conditions 5, 6, 8, 10, and 12 in §I. Silence on those items means they remain **not granted**.

---

## K. Open dependencies

| Class | Item | Blocks implementation ready? |
| --- | --- | --- |
| Business | Owner Decisions 1–5 | **Yes** |
| Business | DR-008 flag taxonomy | **No** for H-29-scoped F0; **Yes** for full AC-010 flags |
| Business | CD visibility mechanism | **No** (visibility required; mechanism open) |
| Commercial parameter | Floor and other **values** | **Yes unless** explicitly waived for increment 1 |
| Technical | Test plan, rollback, H-29 AC suite | **Yes** before increment completion |
| Technical | Dual-path / durable store test beyond H-28 in-memory | **Yes** if the increment will persist commercially |
| Production | E1 architecture, NA-A-22, E1-C/D, Path B | **Yes for Production**; **separately gated** from a Dev/Test increment |
| Production | UAT authority | **Yes** unless Owner waives UAT for Dev/Test-only |

---

## L. Explicit non-authorizations

This pack does **not** authorize:

* application or C1–C10 code change  
* schema or migration  
* data change or Office-history migration  
* C11+ / Domain J as the KPI pack  
* dashboards, digital programmes, Ads/LinkedIn/SEO/Instagram implementation  
* Production deploy, UAT execution, commit, or push  
* numerical targets or a commercial floor **value**  
* restoring 250k/20% as the Owner approval rule  
* closing DR-008  
* unparking E1-C, E1-D, or Path B  
* treating H-29 definition as Gate H passed  

---

## M. Final governance status

The decision pack is complete enough to **present** to the Owner. Implementation remains unauthorized. Implementation-ready is **not** declared.

```text
GPTA-H-30 STATUS = IMPLEMENTATION AUTHORIZATION READINESS PACKAGE COMPLETE — OWNER DECISION REQUIRED

REQUIREMENTS COMPLETE     = YES (H-29 defined; Owner approval pending)
IMPLEMENTATION READY      = NO
IMPLEMENTATION AUTHORIZED = NO

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
OR-04 = NO NUMERICAL TARGET AUTHORIZED
COMMERCIAL FLOOR VALUE = NOT AUTHORIZED
DR-008 = DEFERRED
NA-A-22 = OPEN

IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED

NEXT ACTION = OWNER RECORDING OF GPTA-H-30 DECISIONS 1–5 — NO IMPLEMENTATION
```
