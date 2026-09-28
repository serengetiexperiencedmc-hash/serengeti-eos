# GPTA-H-01 — Path B Capability Selection Decision

> **`GPTA-H-01 STATUS: CLOSED — DECISION RECORDED / PATH B ON HOLD`**  
> **`PATH B DECISION: HOLD`**  
> **`OWNER DECISION: HOLD PATH B`**  
> **`SELECTED CAPABILITY: NONE`**  
> **`LINEAGE_REGISTER: UNSELECTED / FUTURE CANDIDATE`**  
> **`QUALITY_RULE_REGISTER: UNSELECTED / FUTURE CANDIDATE`**  
> **`IMPLEMENTATION AUTHORIZATION: NOT GRANTED`**  
> **`COMMIT AUTHORIZATION: SEPARATE DECISION`** (`GPTA-H-02`)  
> **`PATH_B_GENERAL_AUTO_SELECTION=PAUSED`**  
> **`NEXT_INCREMENT=NONE_AUTHORIZED`**  
> **`E1-C — CONTROLLED PAUSE`** · **`NA-A-22 — OPEN`**  
> **`CAP-GATE-01 — NOT COMPLETE`** · **`STAGE 1 — NOT APPROVED / NOT COMPLETE`**  
> **`SEDMC — NOT PRODUCTION READY`**  
> **`NO IMPLEMENTATION THIS SPRINT`** · **`NO COMMIT`** · **`NO PUSH`**

**Date prepared:** 2026-09-17.  
**Auditable timestamp (package):** **2026-09-17T20:03:00+03:00**.  
**Owner decision recorded:** **2026-09-17T20:22:00+03:00** — **OPTION C — HOLD PATH B** (§11).  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged).  
**Branch:** `master`.  
**Working tree:** **DIRTY** — pre-existing Class A/B application work **untouched**.  
**This file does not select a capability. It does not grant implementation. It does not rank options.**

Companions: [`gpta-h-01-capability-decision-analysis.md`](gpta-h-01-capability-decision-analysis.md); [`adr-0006-governance-portfolio-transition-assessment.md`](adr-0006-governance-portfolio-transition-assessment.md); [`classification-register-authorized.md`](classification-register-authorized.md); [`dataset-register-authorized.md`](dataset-register-authorized.md); [`cd-phase1-commercial-foundation-authorized.md`](cd-phase1-commercial-foundation-authorized.md); [`../architecture/02-module-domain-map.md`](../architecture/02-module-domain-map.md) §2.2; [`../backlog/increments.md`](../backlog/increments.md).

**Disambiguation:** **Path B** in this file is the EOS **leftover-noun capability-selection mechanism** (`PATH_B_GENERAL_AUTO_SELECTION`). It is **not** **HUM-CAP-RV-01 Path B** disposable PostgreSQL restore.

---

## Decision

**GPTA-H-01 — historically OPEN at package authoring.** Current flags: banner and **§11**.

The Owner must choose **exactly one** of (historical options; **OPTION C recorded in §11**):

### OPTION A — SELECT

Select **exactly one** currently available Path B leftover-noun capability from §4 (repository-defined remaining `dg` nouns after DG2).

### OPTION B — HOLD

Keep Path B on **HOLD**. Authorize **no** new implementation increment. Leave `NEXT_INCREMENT=NONE_AUTHORIZED` and `PATH_B_GENERAL_AUTO_SELECTION=PAUSED`.

Neither option is preselected.

---

## Owner decision fields (historical — unfilled at authoring)

> **Current flags are in the banner and §11.** This table is the 2026-09-17T20:18 unresolved snapshot and is **not rewritten**.

| Field | Value (historical) |
| --- | --- |
| `GPTA-H-01 STATUS` | **OPEN** |
| `PATH B DECISION` | **SELECT / HOLD — NOT YET DECIDED** |
| `SELECTED CAPABILITY` | **NONE — PENDING OWNER DECISION** |
| `OWNER DECISION` | **PENDING** |
| `OWNER` | **NOT YET RECORDED** |
| `DECISION DATE` | **NOT YET RECORDED** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT GRANTED** |
| `COMMIT AUTHORIZATION` | **SEPARATE DECISION** (`GPTA-H-02`) |
| `STAGE 1 AUTHORING` | **NOT AUTHORIZED by this package** |
| `STAGE 1 APPROVAL` | **NOT AUTHORIZED by this package** |
| `CAPABILITY ID ASSIGNMENT` | **NOT EXECUTED** |
| `PREVIEW / UAT / PRODUCTION` | **NOT AUTHORIZED by this package** |

If OPTION A is later recorded, fill `SELECTED CAPABILITY` with **exactly one** of: `LINEAGE_REGISTER` or `QUALITY_RULE_REGISTER`. Do **not** invent a third name in this package.

---

## 1. What Path B is (authoritative)

Path B is the governed **leftover-noun register** selection used after C1–C10 / closed increment families. The Owner names a domain-map 2.2 aggregate that has **not** yet been selected as a bounded **existence catalogue** (not an engine, not a programme).

Standing flags (unchanged by this package):

- `PATH_B_GENERAL_AUTO_SELECTION=PAUSED` — Cursor must **not** auto-pick.  
- `EXECUTION_QUEUE=EMPTY`  
- `NEXT_INCREMENT=NONE_AUTHORIZED`  
- `NEW_CAPABILITY_AUTHORIZED=NONE`

**Selection does not itself authorize implementation.** The last consumed Path B increment (DG2) used a **separated** sequence that this package preserves:

```text
SELECTION                    ← GPTA-H-01 OPTION A, if later recorded
-> STAGE 1 CONTRACT AUTHORING
-> STAGE 1 REVIEW / APPROVAL
-> CAPABILITY ID ASSIGNMENT
-> DEV/TEST IMPLEMENTATION AUTHORIZATION
-> PREVIEW
-> COMMIT / PUSH               ← GPTA-H-02 is a different decision (dirty tree today)
-> UAT
-> Production / deployment / migrations   ← remain NOT_AUTHORIZED
```

**Selection ≠ Stage 1 authoring.**  
**Stage 1 authoring ≠ Stage 1 approval.**  
**ID assignment ≠ implementation authorization.**  
**Stage 1 approval ≠ implementation authorization.**  
**UAT PASS ≠ Production.**  
**Capability selection ≠ commit of the existing dirty tree (`GPTA-H-02`).**

Precedent: DG2 Classification (2026-09-01) required **separate** Owner lines for selection/authoring, Stage 1 approval, ID assignment, and implementation. Name-only undefer of a **deferred** stream (PO) is a **different** gate ([`procurement-po-undefer-authorized.md`](procurement-po-undefer-authorized.md)) and is **not** opened by GPTA-H-01.

---

## 2. Current execution queue (unchanged)

| Item | Status |
| --- | --- |
| Last selected / consumed Path B increment | **DG2 Classification Register** — UAT **PASS** (Dev/Test in-memory, 2026-09-05) |
| DG1 Dataset Register | **CONSUMED** — do not reopen |
| C1–C10 | **CONSUMED** — do not reopen |
| CD Phase 1 successor | **NOT AUTHORIZED** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| E1-D Class B–F umbrella | **PREPARED — NOT GRANTED** |
| Local Dev/Test | Standing activity — **not** a product increment |
| E1-C | **CONTROLLED PAUSE** |
| E1-B RFI | **PAUSED** |
| NA-A-22 | **OPEN** |
| CAP-GATE-01 | **NOT COMPLETE** |
| E1-C Stage 1 | **NOT APPROVED / NOT COMPLETE** |

This package does **not** change those statuses.

---

## 3. Closed / not in OPTION A

Do **not** reopen or select as GPTA-H-01 OPTION A:

Consumed Path B / register increments (non-exhaustive; all **CLOSED** Dev/Test): DG1, DG2, PR1, PR2, P1–P3, ITA1, ITL1, ITE1, ITC1, ITP1, ITR1, E1-KRI, E2 Treatment, H1, G1–G5, O6, K1, K2, C1–C10, I10, I11, I12–I20 (bounded), I16–I19.

**Not created** family IDs in authorized files (placeholders, **not** selectable capability names): C11, G6, O7, K3, H2, I24, I20.23, PG.30, I11.x / family `.x` reopeners.

**Deferred / untouched (class D in Path B authorized files)** — **not** in the current leftover-noun OPTION A set. Undefer (PO precedent) would be a **separate** owner instrument, then a later selection:

| Deferred token | Where recorded |
| --- | --- |
| **CAL** (Calendar) | commercial-roadmap; CD Phase 1; Path B D-lists |
| **C11+** | C1/CD records: **not created / not authorized** |
| **I21 / I22 / I23** | backlog: **DEFERRED — not a pending queue item** |
| **EMCOMMS / EXER** | I18/K1/K2 D-lists |
| **SAMPLE** | Path B authorized files: remains deferred |
| **payroll / I20X / EXT / SUCC** | Path B D-lists |

This package does **not** undefer those streams.

---

## 4. Currently available Path B leftover-noun options

After **DG2**, domain map 2.2 `dg` still names **Dataset, Classification, Lineage, QualityRule**. Dataset = DG1 **consumed**. Classification = DG2 **consumed**. DG1 and DG2 records state **Lineage** and **QualityRule** remain **not selected**. Those two nouns are the **only** leftover-noun Path B options the current governance model explicitly leaves open after the last increment.

No ranking. No scores. No “best.”

| Capability | Existing repository definition | Dependencies | Governance gate | Implementation impact | Production dependency | Current status |
| --- | --- | --- | --- | --- | --- | --- |
| **LINEAGE_REGISTER** (noun **Lineage**) | Domain map 2.2 `dg`; DG1/DG2: **not selected**; DG2 UAT recorded `/v1/dg` lineage paths **404** | Must **not** reopen DG1/DG2; not a lineage **engine** | GPTA-H-01 SELECT → then separate Stage 1 authoring / approval / ID / implementation | Dev/Test bounded **existence catalogue** only, if later granted | **None** at selection | **NOT SELECTED** — available for OPTION A |
| **QUALITY_RULE_REGISTER** (noun **QualityRule**) | Domain map 2.2 `dg`; DG1/DG2: **not selected**; DG2 UAT recorded quality-rules paths **404** | Must **not** reopen DG1/DG2; not a quality **engine** | Same separated Path B sequence | Dev/Test bounded **existence catalogue** only, if later granted | **None** at selection | **NOT SELECTED** — available for OPTION A |

If not selected: **no action** on that noun.

---

## 5. Consequences if OPTION A is later recorded

Applies to **either** leftover noun. This package still **does not** grant the later gates.

### If selected

| Topic | Record |
| --- | --- |
| Governance gate that would open | **Selection recorded** only. Next Owner gates remain: Stage 1 **authoring**, Stage 1 **approval**, **ID assignment**, Dev/Test **implementation** — each separate, as DG2. |
| Authorization required | Later explicit Owner lines. **Not** granted here. |
| Implementation boundary | Path B **register minimum** (existence catalogue: required title, optional notes, open/done/cancelled class used by DG1/DG2/ITE1/P3 siblings). **Not** an engine. **Not** lakehouse/DLP. **Not** I0 clearance. |
| Application code | **Would change only after** a later implementation grant. **Not now.** |
| Schema / migration | DG2: SQL **ABSENT** / **NOT_AUTHORIZED**. Same default unless a **later Gate C** grant says otherwise. **Not now.** |
| Depends on E1-C? | **No** for Dev/Test leftover-noun register (see §6). |
| Affects Production? | **No** at selection. Production remains **NOT_AUTHORIZED**. |
| Evidence / UAT eventually | If later implemented: Dev/Test tests + Preview; UAT only if **separately** authorized (DG2 pattern: in-memory Preview UAT). Production UAT **not** implied. |

### If not selected

No work on that noun. No manufactured blocker.

### If OPTION B — HOLD

No new increment. Queue remains empty. Auto-selection remains paused. Local Dev/Test may continue. E1-C remains **CONTROLLED PAUSE**. Dirty tree remains subject only to **GPTA-H-02**.

---

## 6. E1-C independence (both leftover nouns)

| Required for leftover-noun Path B Dev/Test register? | LINEAGE_REGISTER | QUALITY_RULE_REGISTER |
| --- | --- | --- |
| Independent validator appointment | **No** | **No** |
| Facility selection | **No** | **No** |
| Production infrastructure | **No** | **No** |
| Production database | **No** | **No** |
| Production credentials | **No** | **No** |
| Production migration | **No** | **No** |
| Production deployment | **No** | **No** |
| Procurement | **No** | **No** |
| RFI/RFQ | **No** | **No** |
| Production RTO/RPO | **No** | **No** |

Selecting either noun **must not** silently change: E1-C **CONTROLLED PAUSE**, **NA-A-22 OPEN**, **CAP-GATE-01 NOT COMPLETE**, E1-C Stage 1 **NOT APPROVED**, SEDMC **NOT Production Ready**.

A later **Production** promotion of any Path B increment **would** depend on E1 / DP-0006 / Gates D–G. That is **out of GPTA-H-01**.

---

## 7. GPTA-H-02 — commit/push (separate)

The working tree is **DIRTY** (E1-D Class A/B application work and governance files).

**GPTA-H-02 — COMMIT/PUSH DECISION — SEPARATE**

- Capability **SELECT** does **not** authorize commit or push of that dirty tree.  
- Capability **HOLD** does **not** authorize commit or push.  
- This sprint does **not** commit or push.

---

## 8. E1-C / E1-B boundary (preserved)

| Statement | Status |
| --- | --- |
| E1-C | **CONTROLLED PAUSE** |
| NA-A-22 | **OPEN** |
| CAP-GATE-01 | **NOT COMPLETE** |
| Stage 1 (E1-C) | **NOT APPROVED / NOT COMPLETE** |
| SEDMC | **NOT Production Ready** |
| E1-B RFI | **PAUSED** |

---

## 9. How the Owner records a later decision

When the Owner decides, a **dated additive** instrument (or filled fields on a successor of this file) must state:

1. `PATH B DECISION` = **SELECT** or **HOLD**  
2. If SELECT: `SELECTED CAPABILITY` = **exactly one** of `LINEAGE_REGISTER` | `QUALITY_RULE_REGISTER`  
3. `OWNER`, `DECISION DATE`  
4. Explicitly: **implementation still NOT GRANTED** unless a **separate** implementation line is also granted (not this package’s default)  
5. Explicitly: **GPTA-H-02 unchanged** unless separately decided  

Do **not** treat filling this template as that recording until the Owner actually records it.

---

## Final governance audit (this sprint)

| Check | Result |
| --- | --- |
| Branch `master` | **Yes** |
| HEAD `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | **Yes** |
| Working tree DIRTY | **Yes** — Class A/B preserved |
| Application / schema / migrate / restore / infra / Production / procurement / RFI / contact | **Not performed** |
| Capability silently selected | **No** |
| Capability implemented | **No** |
| NA-A-23 created | **No** |
| NA-A-22 | **OPEN** |
| E1-C | **CONTROLLED PAUSE** |

---

## Ambiguity (not rewritten)

1. DG2 authorized file “Next Owner decision is Production / deployment / migrations” is **not** a Production grant and is **not** GPTA-H-01.  
2. Domain map 2.2 contains other unused aggregates (e.g. `vuln`, `graph`, `lakehouse`). They are **not** listed as current Path B leftover options because the **last increment** only left **Lineage** and **QualityRule** explicitly **not selected**. Selecting another domain would be **outside** this OPTION A set (and must not be inferred here).  
3. Deferred tokens (CAL, I21–I23, C11+, …) exist in the model but require **undefer**, not GPTA-H-01 SELECT.  
4. **Path B restore** (HUM-CAP-RV-01) ≠ **Path B capability selection**.

---

## 10. Additive — 2026-09-17 unresolved owner decision after factual analysis

**Auditable timestamp:** **2026-09-17T20:18:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged).  
**Authority of this section:** records that the factual analysis exists and that the **Owner has not yet decided**. Historical sections above are **not rewritten**.

Companion analysis: [`gpta-h-01-capability-decision-analysis.md`](gpta-h-01-capability-decision-analysis.md).

The analysis established that both leftover `dg` nouns lack a positive Stage 1 definition, contract, kernel type, fields, capability ID, and runtime (routes **404**). It did **not** select either capability. It did **not** rank, score, or recommend. **This prompt / this additive section is not Owner selection.**

| Field | Recorded state |
| --- | --- |
| `GPTA-H-01 STATUS` | **OPEN** |
| `PATH B DECISION` | **SELECT / HOLD — NOT YET DECIDED** |
| `SELECTED CAPABILITY` | **NONE — PENDING OWNER DECISION** |
| `OWNER DECISION` | **PENDING** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT GRANTED** |
| Stage 1 (E1-C) | **NOT APPROVED / NOT COMPLETE** |
| Stage 2 | **NOT AUTHORIZED** |
| GPTA-H-02 | **SEPARATE** |
| E1-C | **CONTROLLED PAUSE** |
| NA-A-22 | **OPEN** |
| `PATH_B_GENERAL_AUTO_SELECTION` | **PAUSED** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |

### Future Owner options (none recorded)

Until the Owner separately records one of the following, the repository remains unresolved. Selecting a leftover noun, if later recorded, **only opens the next governance definition gate** for that noun. It does **not** execute that gate. It does **not** authorize Stage 1 implementation, application code, schema, migration, API, UI, Dev/Test implementation, Preview, UAT, commit, push, Production, procurement, or external engagement.

#### OPTION A — Select `LINEAGE_REGISTER`

If later recorded: `SELECTED CAPABILITY=LINEAGE_REGISTER`. Opens the next **definition** gate for leftover noun **Lineage** only. Does **not** authorize any implementation or Production activity listed above. Does **not** assign a capability ID (do **not** invent DG3). Does **not** change E1-C / NA-A-22 / CAP-GATE-01.

#### OPTION B — Select `QUALITY_RULE_REGISTER`

If later recorded: `SELECTED CAPABILITY=QUALITY_RULE_REGISTER`. Opens the next **definition** gate for leftover noun **QualityRule** only. Does **not** authorize any implementation or Production activity listed above. Does **not** assign a capability ID. Does **not** change E1-C / NA-A-22 / CAP-GATE-01.

#### OPTION C — `HOLD PATH B`

If later recorded: Path B remains paused; `SELECTED CAPABILITY` stays **NONE**; `NEXT_INCREMENT=NONE_AUTHORIZED`; `PATH_B_GENERAL_AUTO_SELECTION=PAUSED`. No new increment. Does **not** authorize implementation, commit, or Production.

**None of OPTION A, OPTION B, or OPTION C is selected by this section.**

---

## 11. Additive — 2026-09-17 Owner decision: OPTION C — HOLD PATH B

**Auditable timestamp:** **2026-09-17T20:22:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged).  
**Authority:** Product Owner execution request **GPTA-H-01: OPTION C — HOLD PATH B**. Historical sections above are **not rewritten**. Factual analysis ([`gpta-h-01-capability-decision-analysis.md`](gpta-h-01-capability-decision-analysis.md)) remains valid and is **not** rewritten to justify this HOLD.

The Owner **deliberately chose HOLD**. This is an **intentional hold**, not an unresolved PENDING state, and not abandonment, rejection, deletion, technical infeasibility, or cancellation of Lineage or QualityRule.

**Path B is intentionally placed on HOLD. `LINEAGE_REGISTER` and `QUALITY_RULE_REGISTER` remain future candidate capabilities and are not selected at this time.**

| Field | Recorded state |
| --- | --- |
| `GPTA-H-01 STATUS` | **CLOSED — DECISION RECORDED / PATH B ON HOLD** |
| `OWNER DECISION` | **HOLD PATH B** |
| `PATH B DECISION` | **HOLD** |
| `SELECTED CAPABILITY` | **NONE** |
| `LINEAGE_REGISTER` | **UNSELECTED / FUTURE CANDIDATE** |
| `QUALITY_RULE_REGISTER` | **UNSELECTED / FUTURE CANDIDATE** |
| Stage 1 (Path B definition) | **NOT AUTHORIZED** — no capability authorized for Stage 1 |
| `IMPLEMENTATION AUTHORIZATION` | **NOT GRANTED** |
| New Path B increment | **NOT CREATED** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| `PATH_B_GENERAL_AUTO_SELECTION` | **PAUSED** |
| GPTA-H-02 | **SEPARATE** — HOLD does **not** authorize commit or push |
| E1-C | **CONTROLLED PAUSE** — unchanged; HOLD is **not** an E1-C dependency |
| NA-A-22 | **OPEN** — unchanged |
| CAP-GATE-01 | **NOT COMPLETE** |
| Stage 1 (E1-C) | **NOT APPROVED / NOT COMPLETE** |
| Stage 2 | **NOT AUTHORIZED** |
| Production / procurement / RFI | **NOT AUTHORIZED** |

OPTION A (`LINEAGE_REGISTER`) was **not** selected. OPTION B (`QUALITY_RULE_REGISTER`) was **not** selected. No Stage 1 definition gate was opened. No implementation authorization was created. No capability ID (including DG3) was assigned.

### Future reopening

Path B may be reopened **only** through a **future explicit Owner decision**. Reopening MUST:

1. Be an explicit Owner decision (no automatic reopen).  
2. Identify the capability to be reconsidered.  
3. Open a new or reopened governed **definition** gate as appropriate.  
4. **Not** auto-select a leftover noun from the domain map.  
5. **Not** auto-grant implementation authorization, commit, push, or Production.

Do **not** create a dependency ID merely for this future possibility. Do **not** convert HOLD into `NA-A-23` or into an E1-C next-action.
