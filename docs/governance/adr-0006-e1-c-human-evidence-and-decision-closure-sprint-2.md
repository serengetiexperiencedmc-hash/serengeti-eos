# E1-C — Human Evidence & Decision Closure Sprint 2

> **`GOVERNANCE / CONTROLLED ASSESSMENT FOLLOW-UP`**  
> **`HUM-CAP-01 = APPROVED — ASSESSMENT ONLY`**  
> **`THIS FILE = DECISION PACKAGE / EVIDENCE REQUEST — NOT A DECISION GRANT`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED / NOT COMPLETE`**  
> **`NO PROCUREMENT`** · **`NO FACILITY SELECTION`** · **`NO PROVIDER SELECTION`**  
> **`NO RFI/RFQ TRANSMISSION`** · **`E1-B = PAUSED`**  
> **`NO APPLICATION-CODE CHANGES`** · **`NO MIGRATE()`** · **`NO RESTORE DRILL EXECUTED`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC remains NOT Production Ready.`**

**Sprint date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T18:29:00+03:00** (EAT).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Governing authorization:** [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md).  
**Sprint 1 companion:** [`adr-0006-e1-c-evidence-gap-closure-sprint-1.md`](adr-0006-e1-c-evidence-gap-closure-sprint-1.md).  
**Assessment results:** [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md).  
**Specification:** [`adr-0006-e1-c-capacity-and-facility-assessment-specification.md`](adr-0006-e1-c-capacity-and-facility-assessment-specification.md).  
**Execution package:** [`adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md`](adr-0006-e1-c-capacity-and-facility-assessment-execution-package.md).  
**Assessor:** repository documentation executor (this sprint).  
**Reviewer:** **NOT ESTABLISHED**.  
**Independent validator:** **NOT ESTABLISHED**.

This file **does not** convert proposals into decisions. Blank and **OPEN** fields remain **OPEN**. Filling a field later requires a separately recorded human decision with owner, date, and evidence.

**Not done this sprint:** procurement; supplier/facility contact; RFI/RFQ send; facility/hardware/cloud/vendor selection; Stage 1 approval; CAP-GATE-01 closure; application-code changes; schema/migrate; restore-drill execution; uncontrolled load testing; invented workload/headroom/owners/legal conclusions; commit; push.

New decision IDs in this file (**HUM-CAP-VAL-01**, **HUM-CAP-RV-01**) are **additive human-decision identifiers** for this closure package. They do **not** invent new CAP/PG/DOC/NET/BKP/OPS/FAC/RV requirement IDs. Historical HUM-CAP-01–HUM-CAP-17 and HUM-08 remain as previously specified.

---

## 1. Purpose

Convert remaining open **business-input** and **human-decision** dependencies from Sprint 1 into a **controlled, explicit decision package**: evidence-request structures, decision fields, owners where already established, prohibited assumptions, and closure criteria.

This sprint **does not** collect new technical measurements, start or stop infrastructure, execute restore, or grant Path A/B restore authorization.

---

## 2. Scope

**In scope**

- WORKLOAD-01–WORKLOAD-06 evidence-request structures
- HUM-CAP-16 headroom-policy decision fields (unfilled)
- HUM-08 operational-roster decision fields (unfilled except already-recorded roles)
- HUM-CAP-VAL-01 independent-validation decision fields (unfilled)
- HUM-CAP-RV-01 disposable restore-drill authorization paths (not granted)
- FAC-01–FAC-24 evidence checklist without a candidate site
- Legal/privacy dependency reconciliation without new conclusions
- CAP-GATE-01 prerequisite reconciliation
- Additive NA-A-21 / parallel-work register entries

**Out of scope**

- Stage 1 design approval; Stage 2 procurement; Production architecture/deployment/migration
- Hardware BOM, server sizing, cloud/facility/provider ranking
- Application-code or migration changes
- Execution of `migrate()` or the existing dump/restore harness
- Uncontrolled load testing
- E1-B RFI/RFQ transmission

---

## 3. Repository state

| Item | Value |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | **DIRTY** — pre-existing Class A/B and E1-C diffs **preserved** |
| Commit / push | **Not performed** |
| Frozen E1-B hashes | Unchanged at sprint start (questionnaire / PE / template) |
| E1-B | **PAUSED** · **0 / 0 / 0** |
| E1 | **NOT APPROVED / BLOCKED** |
| ADR-0006 / DP-0006 / Gate C | **OPEN** |

---

## 4. Governing authorization

| Field | Value |
| --- | --- |
| Gate | HUM-CAP-01 |
| Status | **APPROVED — ASSESSMENT ONLY** |
| Decision owner | **Patrick Makundi** |
| Approval date | **2026-09-17** |
| Auditable timestamp | **2026-09-17T17:50:00+03:00** |
| Does this sprint grant Stage 1? | **No** |
| Does this sprint grant Path B migrate-on-disposable? | **No** |
| Does this sprint complete CAP-GATE-01? | **No** |

---

## 5. Current CAP-GATE-01 and Stage 1

| Gate | Status |
| --- | --- |
| CAP-GATE-01 | **NOT COMPLETE** |
| Stage 1 | **NOT APPROVED / NOT COMPLETE** |
| Stage 2 | **NOT AUTHORIZED** |
| Production architecture | **NOT APPROVED** |
| Production deployment / migration | **NOT AUTHORIZED** |

---

## 6. Open evidence register (Sprint 2 view)

| ID | Topic | State | Maps to |
| --- | --- | --- | --- |
| GAP-CAP-01 | Business workload | **OPEN — EVIDENCE REQUIRED** | WORKLOAD-01, 02, 05, 06; CAP-01 |
| GAP-CAP-02 | Growth | **OPEN — EVIDENCE REQUIRED** | WORKLOAD-03; CAP-07 |
| GAP-CAP-03 | Peak periods | **OPEN — EVIDENCE REQUIRED** | WORKLOAD-04; CAP-08 |
| GAP-CAP-04 | Headroom | **OPEN — HUMAN DECISION REQUIRED** | HUM-CAP-16; CAP-09 |
| GAP-PG-01 | Disposable PG reachability | **CLOSED FOR REACHABILITY — DEV/TEST ONLY** | Sprint 1 |
| GAP-PG-02 | PG measurements | **PARTIALLY CLOSED** — idle Dev/Test only | PG-01–PG-13 |
| GAP-RV-01 | Restore drill | **BLOCKED** | HUM-CAP-RV-01 |
| GAP-OPS-01 | Operational roster | **OPEN — HUMAN DECISION REQUIRED** | HUM-08 |
| GAP-FAC-01 | Facility evidence | **BLOCKED** | FAC-01–FAC-24 |
| GAP-LEGAL-01 | Legal/privacy | **OPEN** (item-dependent) | §11 |
| GAP-VAL-01 | Independent validator | **OPEN — HUMAN DECISION REQUIRED** | HUM-CAP-VAL-01 |

---

## 7. Required human decisions (this package)

| Decision ID | Title | State this sprint |
| --- | --- | --- |
| HUM-CAP-16 | Headroom policy | **OPEN — HUMAN DECISION REQUIRED — HEADROOM POLICY** |
| HUM-08 | Operational roster | **OPEN — HUMAN DECISION REQUIRED** (except already-recorded roles below) |
| HUM-CAP-VAL-01 | Independent validation | **OPEN — HUMAN DECISION REQUIRED** |
| HUM-CAP-RV-01 | Disposable restore-drill authorization | **OPEN — HUMAN DECISION REQUIRED** |
| WORKLOAD-01–06 | Authoritative business census | **OPEN — EVIDENCE REQUIRED** |
| HUM-CAP-02 | Facility selection | **NOT THIS SPRINT** — remains after assessment |
| HUM-CAP-03–05 | Procurement / budget / TCO | **NOT THIS SPRINT** |
| HUM-CAP-07–15 | Backup/DR, PITR, HA, IdP, secrets, email, events, monitoring, legal/site | **OPEN** as previously recorded; not granted here |
| HUM-CAP-17 | Renewed E1-B RFI | **Not required**; E1-B **PAUSED** |

**HUM-CAP-01** remains **APPROVED — ASSESSMENT ONLY** and is **not** re-granted.

---

## 8. Evidence owners already established vs unresolved ownership

| Role / function | Name | Source | May this sprint treat them as Production ops? |
| --- | --- | --- | --- |
| Company owner; HUM-CAP-01 authorizer | **Patrick Makundi** | HUM-CAP-01; owner formal decision | **No** — owner ≠ named DBA/on-call |
| DPO designation; IT Manager | **Wensley Shirima** | DPO owner-designation record | **No** — designation ≠ formal appointment; **not** auto-assigned infra/app/DB/backup/on-call |
| Legal Counsel | **THOMAS NGULUMA** | Legal Counsel attestation 15TH SEPTEMBER 2026, A.T.N | **No** — counsel only; **not** DPO |
| E1-B named sender | **Patrick Makundi** | HUM-11 | **No** — sender ≠ Production ops |
| Independent validator | **NOT ESTABLISHED** | Sprint 1 GAP-VAL-01 | — |
| Infrastructure / application / PostgreSQL / backup / security / on-call / escalation / change / BC owners | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** | HUM-08 | — |
| Incident-response owner | **NOT YET NAMED** | HUM-12 | — |
| Census / workload-form owner | **NOT ESTABLISHED** (authorization owner is Patrick Makundi) | Sprint 1 | — |

Do **not** assign technical or operational responsibilities merely because a name already appears in the repository.

---

## 9. Decision dependencies

```
HUM-CAP-01 (assessment only; already approved)
  → WORKLOAD-01–06 authoritative business input
  → HUM-CAP-16 headroom policy
       → CAP-09 / PG-04 sizing inputs (still not a BOM)
  → HUM-08 operational roster
       → OPS-06 / OPS-07 / HUM-CAP-06
  → HUM-CAP-VAL-01 independent validator
       → CAP-GATE-01 validation condition
  → HUM-CAP-RV-01 Path A or Path B (not granted)
       → then RV-01–RV-14 execution under that grant
  → FAC-01–FAC-24 remain blocked until a legitimately accessible candidate site exists
       → HUM-CAP-02 is facility *selection* and is later than evidence collection
  → CAP-GATE-01 remains NOT COMPLETE until listed conditions are genuinely satisfied
  → Stage 1 remains a *separate* human design approval after CAP-GATE-01
```

Completing this package **does not** complete CAP-GATE-01 or Stage 1.

---

## 10. Prohibited assumptions

- Treating **up to 500 users**, **up to 200 concurrent**, or **~30% annual growth** as approved Production demand.
- Inferring headroom percentages from industry practice.
- Inventing names, legal conclusions, facility facts, or validation results.
- Treating idle Dev/Test PostgreSQL (7519 kB empty `eos`, default GUCs, localhost/`EXPLAIN ANALYZE SELECT 1`) as Production capacity.
- Treating LocalFs 21 files / 420 bytes as business document volume.
- Treating C1 in-memory CRM micro-benchmarks as a Production SLA.
- Treating harness existence as restore PASS.
- Treating DPO **designation** as formal **appointment**.
- Treating HUM-CAP-01 as Production or Stage 1 authorization.
- Contacting suppliers/facilities; sending RFI/RFQ; selecting/ranking vendors or sites.

---

## 11. Proposed evidence format (for later human completion)

Each WORKLOAD / HUM-* answer, when later supplied, should record:

| Field | Required |
| --- | --- |
| ID | WORKLOAD-* / HUM-* |
| Decision or evidence statement | Plain language; no invented numbers |
| Source artefact | Named document, extract, or owner statement |
| Date | Actual date of the human record |
| Decision owner | Named human already authorized to decide |
| Environment applicability | Business / Dev/Test / Production — labelled honestly |
| Limitations | What the figure does **not** prove |
| Reviewer | Independent validator if HUM-CAP-VAL-01 later filled; else **NOT ESTABLISHED** |
| Status | Approved capacity input **or** still planning assumption |

Until those fields are filled by a human, status remains **OPEN**.

---

## 12. Closure criteria for this sprint

This Sprint 2 package is **closed as a package** when:

1. WORKLOAD-01–06 request structures exist (this file).
2. HUM-CAP-16, HUM-08, HUM-CAP-VAL-01, HUM-CAP-RV-01 decision fields exist and remain **unfilled** unless a human has separately recorded values.
3. Facility evidence remains **blocked** without a candidate site.
4. Legal items remain identified without new conclusions.
5. CAP-GATE-01 is reconciled and **not** forced complete.
6. NA-A-21 is recorded.

This sprint is **not** closed as CAP-GATE-01. Human answers to the fields below are **future** governed work.

---

# WORKLOAD-01 — Users

**State:** **OPEN — EVIDENCE REQUIRED**  
**Maps to:** CAP-01; GAP-CAP-01  
**Existing figure:** up to **500 users** (BCM pack Priority 10; E1-B questionnaire) = **`PLANNING ASSUMPTION — NOT APPROVED CAPACITY INPUT`**

| Field | Required input | Current record |
| --- | --- | --- |
| Current active users | Authoritative count | **BUSINESS INPUT REQUIRED** — BCM pack: “not a measured figure” |
| Expected users at initial Production launch | Authoritative count | **BUSINESS INPUT REQUIRED** |
| Maximum expected users within planning horizon | Authoritative count + horizon | **BUSINESS INPUT REQUIRED** |
| Internal users | Count / definition | **BUSINESS INPUT REQUIRED** |
| External / partner users | Count / definition | **BUSINESS INPUT REQUIRED** |
| Distinction: registered vs active vs concurrently active | Definitions + counts | **BUSINESS INPUT REQUIRED** |
| Decision owner | Named | Authorization owner **Patrick Makundi**; census owner **NOT ESTABLISHED** |
| Approved capacity input? | Yes/no with date | **No** |

Do **not** assume 500 is approved.

---

# WORKLOAD-02 — Concurrency

**State:** **OPEN — EVIDENCE REQUIRED**  
**Maps to:** CAP-01 / CAP-02 count; GAP-CAP-01  
**Existing figure:** up to **200 concurrent users** = **`PLANNING ASSUMPTION — NOT APPROVED CAPACITY INPUT`**

| Field | Required input | Current record |
| --- | --- | --- |
| Expected normal concurrent users | Authoritative count | **BUSINESS INPUT REQUIRED** |
| Expected peak concurrent users | Authoritative count | **BUSINESS INPUT REQUIRED** |
| Basis for the estimate | Method / source | **BUSINESS INPUT REQUIRED** |
| Expected peak duration | Hours / days / event length | **BUSINESS INPUT REQUIRED** |
| Session TTL (technical, Dev/Test) | Prior observation | **3600 s** — **DEV/TEST ONLY**; **not** a concurrent-count |
| Approved capacity input? | Yes/no | **No** |

Do **not** assume 200 is authoritative.

---

# WORKLOAD-03 — Growth

**State:** **OPEN — EVIDENCE REQUIRED**  
**Maps to:** CAP-07; PG-02; DOC-02; GAP-CAP-02  
**Existing figure:** approximately **30% annual** = **`PLANNING ASSUMPTION — REQUIRES BUSINESS VALIDATION`**

| Field | Required input | Current record |
| --- | --- | --- |
| Annual growth assumption | Approved % or other model | **BUSINESS INPUT REQUIRED** |
| Planning horizon | Years | **BUSINESS INPUT REQUIRED** |
| Basis for growth | Business justification | **BUSINESS INPUT REQUIRED** |
| Shape | Linear / seasonal / event-driven / other | **BUSINESS INPUT REQUIRED** |
| Approved capacity input? | Yes/no | **No** |

No conversion from 30% to disk, RPS, or CPU is documented.

---

# WORKLOAD-04 — Peak periods

**State:** **`BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED`**  
**Maps to:** CAP-08; CAP-14; GAP-CAP-03  
**BCM pack Priority 10:** “Major seasonal peaks — **Not specified in this authorization**.”

| Peak class | Required identification | Current record |
| --- | --- | --- |
| Seasonal peaks | Named seasons / months | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Event / trade-show peaks | Named events | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Campaign peaks | Named campaigns | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Month-end / quarter-end peaks | Yes/no + timing | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Known operational deadlines | RFP/costing/document deadlines | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Unusual burst periods | Description | **BUSINESS INPUT REQUIRED — PEAK PROFILE NOT SPECIFIED** |
| Peak vs normal workload ratio | If known | **BUSINESS INPUT REQUIRED** |

Do **not** invent MICE seasonality numbers.

---

# WORKLOAD-05 — Organizations / accounts

**State:** **OPEN — EVIDENCE REQUIRED**  
**Maps to:** GAP-CAP-01; multi-tenant implications (no Production tenant census)

| Field | Required input | Current record |
| --- | --- | --- |
| Number of organizations / accounts | Authoritative count | **BUSINESS INPUT REQUIRED** |
| Expected growth | Count or % + horizon | **BUSINESS INPUT REQUIRED** |
| Large-account concentration | Yes/no + description if known | **BUSINESS INPUT REQUIRED** |
| Multi-tenant implications | If applicable | **BUSINESS INPUT REQUIRED** — Production tenancy model **NOT SELECTED** as architecture |

Dev bootstrap identities in `.env.example` are **not** an organization census.

---

# WORKLOAD-06 — Documents

**State:** **OPEN — EVIDENCE REQUIRED**  
**Maps to:** CAP-06 (business volume); DOC-01–DOC-08; GAP-CAP-01  
**Do not** estimate from repository LocalFs (21 files / 420 bytes = **DEV/TEST ONLY** residual artefacts).

| Field | Required input | Current record |
| --- | --- | --- |
| Current business document volume | Count + bytes (business SoR) | **BUSINESS INPUT REQUIRED** |
| Expected annual document growth | Count/bytes + basis | **BUSINESS INPUT REQUIRED** |
| Typical document sizes | Distribution / typical | **BUSINESS INPUT REQUIRED** |
| Large-file scenarios | Max size / frequency | **BUSINESS INPUT REQUIRED** |
| Retention period | Policy | **HUMAN DECISION REQUIRED** (E-13 not closed) **and** **LEGAL REVIEW REQUIRED** |
| Expected retrieval frequency | Rate | **BUSINESS INPUT REQUIRED** |

---

# HUM-CAP-16 — Headroom Policy

**State:** **`HUMAN DECISION REQUIRED — HEADROOM POLICY`**  
**Maps to:** CAP-09; PG-04; GAP-CAP-04  
**Stage-1-blocking (specification §8):** Yes for sizing — **not** granted here.

No approved SEDMC headroom policy exists. The **30%** figure is a **growth modelling assumption**, not a headroom margin. **No percentage is selected.**

### Distinction (mandatory)

| Layer | What it is | Current fact |
| --- | --- | --- |
| 1. Observed Dev/Test measurements | Technical observations labelled **DEV/TEST ONLY** | Idle PG 7519 kB empty `eos`; pool default 10; TTL 3600 s; LocalFs 21/420 B; C1 in-memory CRM micro-benchmarks |
| 2. Production workload assumptions | Business planning figures **not** approved as capacity input | 500 / 200 / 30% = planning assumptions only |
| 3. Production capacity requirements | Derived **after** approved workload + headroom | **NOT ESTABLISHED** — would still **not** be a hardware BOM |
| 4. Headroom policy | Owner-approved margins | **HUMAN DECISION REQUIRED — HEADROOM POLICY** |

### Decision fields (unfilled — do not select values)

| Field | Applies to | Value |
| --- | --- | --- |
| Normal operating headroom | Overall | **NOT SELECTED** |
| Peak headroom | Overall | **NOT SELECTED** |
| Growth headroom | Overall | **NOT SELECTED** |
| Failure / degraded-mode headroom | Overall | **NOT SELECTED** |
| Separate rule — CPU | Yes/no + value | **NOT SELECTED** |
| Separate rule — memory | Yes/no + value | **NOT SELECTED** |
| Separate rule — storage | Yes/no + value | **NOT SELECTED** |
| Separate rule — database connections | Yes/no + value | **NOT SELECTED** |
| Separate rule — network | Yes/no + value | **NOT SELECTED** |
| Separate rule — document storage | Yes/no + value | **NOT SELECTED** |
| Separate rule — background jobs | Yes/no + value | **NOT SELECTED** |
| Decision owner | — | **Patrick Makundi** (authorization); decision **not recorded** |
| Date approved | — | **N/A** |
| Basis | — | **N/A** |

---

# HUM-08 — Operational Roster Decision

**State:** **OPEN — HUMAN DECISION REQUIRED**  
**Maps to:** OPS-06, OPS-07; HUM-CAP-06; GAP-OPS-01  
**Existing HUM-08 record:** Privacy/DPO = **Wensley Shirima**. **Other personnel = NOT ESTABLISHED** ([`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md) §7).

Names below may be referenced **only** in already-documented roles. This table **does not** assign technical/operational duties to them.

| Function | Incumbent | Status |
| --- | --- | --- |
| Company owner | **Patrick Makundi** | **ESTABLISHED** as owner only |
| Legal Counsel | **THOMAS NGULUMA** | **ESTABLISHED** as Legal Counsel only |
| DPO designation | **Wensley Shirima** | **OWNER-DESIGNATED**; formal appointment **REQUIRED** |
| Infrastructure owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Application owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| PostgreSQL / DB owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Backup / restore owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Security owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Incident commander | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** (HUM-12 IR **NOT YET NAMED**) |
| On-call owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Escalation owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Change-management owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |
| Business continuity owner | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** (BCM **S2** is a recovery **order**, not a named BC owner) |
| Legal / privacy escalation | Counsel / DPO designation as above | Counsel and DPO designation **identified**; Production privacy ops roster **NOT ESTABLISHED** |
| Secondary / backup personnel | — | **NOT ESTABLISHED — HUMAN DECISION REQUIRED** |

No names invented. No automatic assignment.

---

# HUM-CAP-VAL-01 — Independent Validation Decision

**State:** **OPEN — HUMAN DECISION REQUIRED**  
**Maps to:** GAP-VAL-01; CAP-GATE-01 validation condition

| Fact | Record |
| --- | --- |
| Independent validation established? | **No** |
| Validator appointed? | **No** |
| Validation result exists? | **No** |
| CAP-GATE-01 PASS on self-assessment alone | **Not permitted** while independent validation is required by the governing assessment package and remains **NOT ESTABLISHED** |

### Decision fields (unfilled — do not nominate a validator)

| Field | Value |
| --- | --- |
| Validator identity | **NOT ESTABLISHED** |
| Independence basis | **NOT ESTABLISHED** |
| Scope | **NOT ESTABLISHED** |
| Appointment / authorization evidence | **NOT ESTABLISHED** |
| Validation date | **N/A** |
| Findings | **N/A** |
| Disposition | **N/A** |

Absence of independent validation **remains visible** in CAP-GATE-01.

---

# HUM-CAP-RV-01 — Disposable Restore Drill Authorization Decision

**State:** **`OPEN — HUMAN DECISION REQUIRED`**  
**Prior sprint:** **RESTORE DRILL BLOCKED — IMPLEMENTATION CHANGE REQUIRED** because `runDisposablePgDumpRestoreDrill` invokes `migrate()`.

This sprint: **does not** modify the harness, **does not** execute `migrate()`, **does not** execute the restore drill, **does not** grant Path A or Path B.

Business recovery targets remain ≤3h / ≤4h / zero tolerated loss of **critical business data**. Technical RTO/RPO remain **NOT DEMONSTRATED**.

### Path A — Migrate-free restore test

A future **implementation change** (separate authorization) may provide a restore path that does **not** invoke application migrations. After that change exists, a later controlled assessment could execute it on disposable Dev/Test data only.

Path A is **not implemented** and **not authorized** by this file.

### Path B — Explicit disposable migration authorization

A **separately approved** governance decision could permit `migrate()` against a **disposable Dev/Test database solely** for the restore drill.

If Path B is later considered, it must state **all** of:

- disposable database only
- Dev/Test only
- no Production database
- no Production data
- no Production migration
- no schema promotion
- no deployment
- no procurement
- no Production authorization

**Path B is not granted in this sprint.**

| Field | Value |
| --- | --- |
| Chosen path | **NOT SELECTED** |
| Authorization owner | **NOT RECORDED** for Path A/B |
| Date | **N/A** |
| Technical RTO/RPO claimed if later executed | Must remain **NOT CLAIMED** as Production even after a labelled drill |

---

# Facility evidence (FAC-01–FAC-24)

**State:** **`FACILITY EVIDENCE BLOCKED — NO AUTHORIZED CANDIDATE SITE`**  
**Family status:** **FAC-01–FAC-24 — EVIDENCE REQUIRED**  
**HUM-CAP-02 (selection):** **not** this sprint.

**FACILITY EVIDENCE CANNOT BE CLOSED WITHOUT A LEGITIMATELY ACCESSIBLE CANDIDATE SITE.**

No supplier contact. No candidate selected. No ranking. No recommendation.

Evidence that would be required **from a later, legitimately accessible candidate** (not collected now):

| Topic | Related IDs (indicative) | Status now |
| --- | --- | --- |
| Physical security | FAC-01 | **EVIDENCE REQUIRED** |
| Access control / physical access logging | FAC-02, FAC-16 | **EVIDENCE REQUIRED** |
| Environmental controls | FAC-03 | **EVIDENCE REQUIRED** |
| Cooling | FAC-04 | **EVIDENCE REQUIRED** |
| Power | FAC-05 | **EVIDENCE REQUIRED** |
| UPS | FAC-06 | **EVIDENCE REQUIRED** |
| Generator | FAC-07 | **EVIDENCE REQUIRED** |
| Fire protection | FAC-08 | **EVIDENCE REQUIRED** |
| Water / environmental risk | FAC-09 | **EVIDENCE REQUIRED** |
| Connectivity | FAC-10; NET-01 | **EVIDENCE REQUIRED** |
| Redundancy | FAC-11; NET-04 | **EVIDENCE REQUIRED** |
| Equipment space / rack | FAC-12 | **EVIDENCE REQUIRED** |
| Equipment protection | FAC-13 | **EVIDENCE REQUIRED** |
| Maintenance | FAC-14, FAC-24 | **EVIDENCE REQUIRED** |
| Monitoring | FAC-15 | **EVIDENCE REQUIRED** |
| Occupancy / legal status | FAC-17, FAC-18 | **EVIDENCE REQUIRED** / **LEGAL REVIEW REQUIRED** |
| Physical location / geography | FAC-20 | Preferred Tanzania **direction only** — **NOT SELECTED** |
| Legal / privacy for that site | FAC-19 | **LEGAL REVIEW REQUIRED** |
| Disaster recovery / secondary location | FAC-21 | **EVIDENCE REQUIRED** |
| Business continuity implications | FAC-22 | **EVIDENCE REQUIRED** |
| Insurance / legal evidence | FAC-23 | **EVIDENCE REQUIRED** |
| Incident response (site) | FAC-15 / ops | **EVIDENCE REQUIRED** |

---

# Legal / privacy dependencies

No new legal conclusions. Combined Legal/DPO remains **INCOMPLETE**. DPO **designation** is **not** a completed formal appointment.

| Topic | Classification | Notes |
| --- | --- | --- |
| Legal entity verification | **IDENTIFIED** · **EVIDENCE REQUIRED** · **LEGAL REVIEW REQUIRED** | E-01 **NOT VERIFIED** |
| PDPC status | **IDENTIFIED** · **EVIDENCE REQUIRED** · **LEGAL REVIEW REQUIRED** | **NOT ESTABLISHED** |
| Formal DPO appointment | **IDENTIFIED** · **EVIDENCE REQUIRED** · **HUMAN DECISION REQUIRED** · **LEGAL REVIEW REQUIRED** | Owner-designated **Wensley Shirima**; appointment evidence **REQUIRED** |
| PDPA review | **IDENTIFIED** · **LEGAL REVIEW REQUIRED** | No new conclusion |
| Data residency | **IDENTIFIED** · **LEGAL REVIEW REQUIRED** | Architecture/site **NOT SELECTED** |
| Site occupancy / legal review | **IDENTIFIED** · **EVIDENCE REQUIRED** · **LEGAL REVIEW REQUIRED** | No candidate site |
| Retention | **IDENTIFIED** · **HUMAN DECISION REQUIRED** · **LEGAL REVIEW REQUIRED** | E-13 not closed |
| Incident-response ownership | **IDENTIFIED** · **HUMAN DECISION REQUIRED** | **NOT YET NAMED** |
| Contractual / privacy requirements | **IDENTIFIED** · **LEGAL REVIEW REQUIRED** | No Production contracts executed under this assessment |

---

# CAP-GATE-01 reconciliation

Execution-package conditions (1)–(12). **PASS is not used.** Idle PostgreSQL, fresh-volume size, LocalFs size, localhost/`SELECT 1` latency, default GUCs, and C1 in-memory benchmarks are **not** Production-capacity evidence.

| # | Prerequisite | State |
| --- | --- | --- |
| 1 | Applicable CAP items assessed | **PARTIALLY CLOSED** — WORKLOAD-01–06 / HUM-CAP-16 still **OPEN** |
| 2 | PG evidence | **PARTIALLY CLOSED** — idle **DEV/TEST ONLY**; restore/load **BLOCKED** / **OPEN** |
| 3 | Document-storage evidence | **PARTIALLY CLOSED** — Dev/Test inventory only; business volume **OPEN — EVIDENCE REQUIRED** |
| 4 | Network evidence | **OPEN — EVIDENCE REQUIRED** / **BLOCKED** without a site |
| 5 | Backup/restore evidence | **BLOCKED** — HUM-CAP-RV-01 **OPEN — HUMAN DECISION REQUIRED** |
| 6 | Facility evidence | **BLOCKED** — **NO AUTHORIZED CANDIDATE SITE** |
| 7 | Legal/privacy dependencies identified | **PARTIALLY CLOSED** — identified; evidence/review **OPEN** |
| 8 | Operational ownership identified | **OPEN — HUMAN DECISION REQUIRED** (HUM-08) |
| 9 | TCO inputs identified | **PARTIALLY CLOSED** — categories listed; **PRICE INPUT REQUIRED — FUTURE STAGE** |
| 10 | Exceptions documented | **PARTIALLY CLOSED** — exceptions written; not a completion substitute |
| 11 | Technical vs business RTO/RPO distinguished | **PARTIALLY CLOSED** — methodology defined; technical **NOT DEMONSTRATED** |
| 12 | Human decisions recorded | **PARTIALLY CLOSED** — this package records **open** decisions; they are **not** granted |
| — | Independent validation | **OPEN — HUMAN DECISION REQUIRED** (HUM-CAP-VAL-01) |

**CAP-GATE-01 = NOT COMPLETE.**

---

# Production-readiness boundary

| Item | Status |
| --- | --- |
| Stage 1 | **NOT APPROVED / NOT COMPLETE** |
| Stage 2 | **NOT AUTHORIZED** |
| Production architecture | **NOT APPROVED** |
| Production deployment | **NOT AUTHORIZED** |
| Production migration | **NOT AUTHORIZED** |
| Hardware BOM / server sizing | **Not produced** |
| Cloud / facility / provider recommendation | **Not produced** |
| Procurement plan / supplier shortlist | **Not produced** |
| RFI/RFQ transmission | **Not performed** · E1-B **PAUSED** |

**Stage 1 — NOT APPROVED / NOT COMPLETE**

**Assessment authorization does not constitute Production authorization.**

**SEDMC remains NOT Production Ready.**

---

# Next-action dependencies

Live pointer: **NA-A-21** in [`adr-0006-e1-next-action-dependency-register.md`](adr-0006-e1-next-action-dependency-register.md).

The next controlled closure path is **human evidence and decision completion** against this package (WORKLOAD-01–06, HUM-CAP-16, HUM-08, HUM-CAP-VAL-01, HUM-CAP-RV-01), **not** procurement, RFI transmission, facility selection, or Stage 1 approval.

Facility evidence remains **blocked** without a legitimately accessible candidate site. Restore remains **blocked** until HUM-CAP-RV-01 grants Path A (after a separate implementation) or Path B (explicit disposable-migrate authorization).

---

# Safety check (this sprint)

| Check | Result |
| --- | --- |
| Application-code / migration / schema changes | **Not performed** |
| `migrate()` / restore harness execution | **Not performed** |
| Procurement / supplier contact / RFI | **Not performed** |
| Facility / hardware / cloud / provider selection | **Not performed** |
| Production deploy / migrate / Production data | **Not performed** |
| Uncontrolled load testing | **Not performed** |
| Invented workload / headroom / owners / legal / facility / validation | **Not performed** |
| CAP-GATE-01 forced complete | **Not performed** |
| Stage 1 approved | **Not performed** |
| Commit / push | **Not performed** |
| Pre-existing dirty work | **Preserved** |

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready.**
