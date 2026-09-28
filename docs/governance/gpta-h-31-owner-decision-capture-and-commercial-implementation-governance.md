# GPTA-H-31 — Owner Decision Capture and Commercial Implementation Governance

> **`GOVERNANCE-ONLY — OWNER DECISION CAPTURE`**  
> **`NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NOT A CODING TASK`** · **`NOT A SCHEMA TASK`** · **`NOT A MIGRATION TASK`**  
> **`NO APPLICATION CHANGE`** · **`NO C11+`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T14:16:00+03:00**.  
**HEAD at capture:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved; Class A/B and unrelated files untouched by this task).

**Authority:** authorized commercial decision-maker / company governance, recorded against the GPTA-H-30 Owner decision package.

These are **company governance decisions**. They are **not** application implementation authorization.

```text
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION DEPLOYMENT = NOT AUTHORIZED
PRODUCTION MIGRATION = NOT AUTHORIZED
PROCUREMENT = NOT AUTHORIZED
EXTERNAL SUPPLIER ENGAGEMENT = NOT AUTHORIZED
```

No numerical commercial target, margin floor **value**, or qualification threshold is invented. OR-04 remains `NO NUMERICAL TARGET AUTHORIZED`. Commercial floor **value** remains `NOT AUTHORIZED`. DR-008 remains **DEFERRED**. NA-A-22 remains **OPEN**.

H-16–H-30 historical bodies are **not rewritten**.

---

## 1. Capture rule

GPTA-H-30 distinguished three states. This capture updates only the Owner choices. It does **not** collapse them.

| State | After GPTA-H-31 |
| --- | --- |
| Requirements complete | **YES** — H-29 **APPROVED** (Decision 1) |
| Implementation ready | **NO** — F0 baseline not yet executed; F1 specification not yet produced; Decision 5 remains not authorized |
| Implementation authorized | **NO** — Decision 5 = `IMPLEMENTATION NOT AUTHORIZED` |

Approval of Decisions 1–4 does **not** authorize coding, schema change, migration, UAT execution, Production, commit, or push.

---

## 2. Decision 1 — H-29 remediation requirements

**Decision:** `APPROVED`

**Scope:** C1–C10 remediation requirements defined in [`gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md`](gpta-h-29-c1-c10-remediation-requirements-and-source-of-truth.md).

**Conditions:**

1. Requirements must remain traceable to GPTA-H-17 through GPTA-H-30.  
2. No requirements may be silently expanded.  
3. Any material change requires a new documented governance decision.  
4. Existing Dev/Test capability must be assessed before reuse.  
5. No assumption may be made that existing C1–C10 functionality is operationally fit merely because it exists in Dev/Test.

**Rationale:** The H-29 requirements provide the necessary structure to address qualified RFPs, conversion, response speed, pipeline visibility, source-of-truth discipline, costing, approvals, proposals, bookings, and KPI visibility.

**Does not authorize:** implementation, C1–C10 code change, or treating H-28 Dev/Test demonstration as operational fitness.

---

## 3. Decision 2 — Source-of-truth model

**Decision:** `APPROVED`

### 3.1 EOS owns structured commercial facts

Including, where applicable:

* Accounts  
* Market  
* Buyer / account type  
* Qualification status and evidence  
* SOURCE and CHANNEL  
* Opportunity ownership  
* Next actions and follow-up  
* RFP identity  
* Programme identity  
* Costing identity  
* Approval identity  
* Proposal identity  
* Booking identity  
* Supplier-rate snapshots  
* Loss reasons  
* KPI facts  

### 3.2 Office remains the document-production environment

Office may continue to be used for:

* Programme and itinerary documents  
* Financial proposals  
* Other client-facing documents  

Structured commercial facts and workflow status **must not** depend exclusively on disconnected Office files.

### 3.3 Communication channels remain communication channels

The following remain valid communication channels:

* Email  
* WhatsApp  
* Phone  
* Other approved communication channels  

Communication channels must **not** be confused with SOURCE attribution or structured commercial ownership.

### 3.4 Explicit constraints

* SOURCE and CHANNEL remain separate dimensions.  
* Market and buyer/account type remain separate dimensions.  
* Proposal-send authority remains distinct from commercial approval authority.  
* The approved model **does not** authorize implementation by itself.

**Current operating reality (unchanged by this decision):** live commercial process remains Office / Excel / Outlook-Gmail / WhatsApp / phone until a later authorized increment is accepted. This decision sets the **future** SoR model, not a live cutover.

---

## 4. Decision 3 — Implementation scope

**Decision:** `APPROVED`  
**Scope:** `C1–C10 ONLY`

### 4.1 Explicitly excluded from current implementation scope

* C11 and later capabilities  
* Unapproved new commercial modules  
* Unapproved broad ERP functionality  
* Unapproved marketing automation  
* Unapproved production infrastructure work  
* Unapproved procurement  
* Unapproved external supplier engagement  
* Unapproved production deployment  
* Unapproved migration execution  

Digital programmes such as LinkedIn, SEO/website, Google Ads, and Instagram remain **commercial programmes and requirements**. They do **not** create authorization for application implementation, advertising expenditure, website changes, automation, or external campaign execution.

Any future expansion beyond C1–C10 requires a **separate** governance decision.

---

## 5. Decision 4 — Implementation sequence

**Decision:** `APPROVED`  
**Sequence:** `F0 → F1 → F2 → F3 → F4 → F5 → F6`

### 5.1 Disambiguation from GPTA-H-30 §H

GPTA-H-30 §H proposed a **candidate technical capability slice** also labelled F0–F6 (identity/taxonomy → qualification/RFP → rates → programme/costing/proposal → approval → booking → KPI). That candidate remains **historical** in H-30 and is **not** the sequence approved here.

This Decision 4 approves a **governance lifecycle sequence**. Labels F0–F6 in GPTA-H-31 mean **only** the steps below. They do **not** silently adopt H-30 §H technical increments, and they do **not** authorize F2 coding.

### 5.2 Approved lifecycle

#### F0 — Governance and requirements baseline

* Confirm approved requirements.  
* Confirm traceability.  
* Confirm scope boundaries.  
* Confirm unresolved parameters and dependencies.  
* Confirm test and rollback expectations.  
* Confirm no production authorization.  

**F0 is specification / baseline only.** It is the **next action**. It is **not** implementation.

#### F1 — Detailed design and implementation specification

* Define the target workflow.  
* Define data ownership and lifecycle rules.  
* Define API and UI requirements.  
* Define migration and backward-compatibility considerations.  
* Define security, auditability, and validation requirements.  
* Define measurable acceptance criteria.  

**Do not implement until separately authorized.** F1 itself is specification, not coding.

#### F2 — Controlled implementation

* Only after a **separate** implementation authorization (not this Decision 4; not Decision 5 as recorded below).  
* Limit changes to the approved C1–C10 scope.  
* Preserve existing application behavior unless explicitly approved for change.  
* Maintain migration and rollback discipline.  

#### F3 — Developer testing and technical verification

* Execute relevant unit, integration, API, UI, data-integrity, and regression tests.  
* Record failures and remediation.  
* Do not treat successful compilation alone as acceptance.  

#### F4 — Controlled Dev/Test validation

* Validate the approved commercial workflow.  
* Validate C1–C10 requirements.  
* Validate source-of-truth behavior.  
* Validate role and approval boundaries.  
* Validate auditability and error handling.  
* Use controlled test data only.  

#### F5 — Owner/User Acceptance Testing

* Obtain documented UAT evidence.  
* Confirm business workflow suitability.  
* Record defects, exceptions, and unresolved decisions.  
* Do not infer acceptance from technical test success.  

#### F6 — Release readiness and separate deployment decision

* Confirm governance gates.  
* Confirm migration readiness.  
* Confirm rollback plan.  
* Confirm operational ownership.  
* Confirm production infrastructure and security readiness.  
* Require a **separate explicit production authorization**.  

**No production deployment is authorized by this Decision 4.**

---

## 6. Decision 5 — Implementation authorization

**Decision:** `IMPLEMENTATION NOT AUTHORIZED`

Also recorded:

| Item | Status |
| --- | --- |
| Implementation | **NOT AUTHORIZED** |
| Commit | **NOT AUTHORIZED** |
| Push | **NOT AUTHORIZED** |
| Production deployment | **NOT AUTHORIZED** |
| Production migration | **NOT AUTHORIZED** |
| Procurement | **NOT AUTHORIZED** |
| External supplier engagement | **NOT AUTHORIZED** |

Approval of H-29, the source-of-truth model, C1–C10 scope, and the F0–F6 sequence **does not** constitute authorization to implement.

A later decision must **separately** authorize implementation **after** F0 and the required readiness evidence are complete. F1 specification, if later produced, still does **not** by itself authorize F2.

---

## 7. Traceability (references only; historical documents not rewritten)

| Document | Role |
| --- | --- |
| GPTA-H-16 | Stage 1 commercial objective and freeze |
| GPTA-H-17 | Business requirements and acceptance criteria |
| GPTA-H-18 | C1–C10 capability-gap analysis |
| GPTA-H-19 through GPTA-H-25 | Business-rule resolution (H-25 authorized baseline) |
| GPTA-H-26 | Requirements closure and implementation readiness |
| GPTA-H-27 | Targeted requirements closure and 1B validation plan |
| GPTA-H-28 | C1–C10 live-validation results |
| GPTA-H-29 | Remediation requirements and source-of-truth model — **now APPROVED** under Decision 1 |
| GPTA-H-30 | Implementation authorization readiness and Owner decision package — choices **now captured** here |

Unresolved items **not closed** by Decisions 1–5:

* OR-04 numerical targets remain unauthorized.  
* Commercial Parameter Register **values** (including margin floor) remain unauthorized.  
* DR-008 account-flag taxonomy remains **DEFERRED**.  
* E1 / E1-C / E1-D / Path B / NA-A-22 remain as previously recorded.  
* H-30 Gate “implementation ready” remains **NO**.

---

## 8. Explicit non-authorizations

This capture does **not**:

* authorize application, schema, migration, or data change  
* authorize F2 implementation  
* authorize F5 UAT execution  
* authorize F6 production deployment  
* introduce C11+  
* invent numerical targets  
* close DR-008  
* unpark E1-C, E1-D, or Path B  
* treat existing Dev/Test C1–C10 as operationally fit  
* grant commit or push  

---

## 9. Governance status

```text
GPTA-H-31 STATUS = OWNER DECISIONS RECORDED — REQUIREMENTS AND GOVERNANCE MODEL APPROVED; IMPLEMENTATION NOT AUTHORIZED

COMMERCIAL OBJECTIVE = APPROVED / FROZEN
STAGE 1 = APPROVED / FROZEN
H-29 REQUIREMENTS = APPROVED
SOURCE-OF-TRUTH MODEL = APPROVED
SCOPE = C1–C10 ONLY
SEQUENCE = F0 → F6 APPROVED
IMPLEMENTATION = NOT AUTHORIZED
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED

IMPLEMENTATION READY = NO
IMPLEMENTATION AUTHORIZED = NO

NEXT ACTION = F0 GOVERNANCE AND REQUIREMENTS BASELINE — SPECIFICATION ONLY
```
