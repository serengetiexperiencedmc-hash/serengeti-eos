# E1-C — Owner Planning Baseline & Disposable Restore Authorization (Sprint 4)

> **`OWNER DECISION CAPTURE`**  
> **`APPROVED PLANNING BASELINE — NOT PRODUCTION CAPACITY EVIDENCE`**  
> **`HUM-CAP-01 = APPROVED — ASSESSMENT ONLY`**  
> **`HUM-CAP-RV-01 PATH B = AUTHORIZED — DISPOSABLE DEV/TEST ONLY`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED / NOT COMPLETE`**  
> **`NO PROCUREMENT`** · **`NO FACILITY SELECTION`** · **`NO PROVIDER SELECTION`**  
> **`NO RFI/RFQ`** · **`E1-B = PAUSED`**  
> **`Technical Production RTO = NOT DEMONSTRATED`** · **`Technical Production RPO = NOT DEMONSTRATED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC remains NOT Production Ready.`**

**Decision date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T18:51:00+03:00** (EAT; owner decisions as supplied this session).  
**Restore drill window:** **2026-09-17T18:55:01+03:00** to **2026-09-17T18:55:10+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Decision owner:** **Patrick Makundi** (Owner), as supplied in this governance session.  
**Sprint 3 file:** [`adr-0006-e1-c-human-decision-capture-sprint-3.md`](adr-0006-e1-c-human-decision-capture-sprint-3.md) — **not present** in the repository at recording.  
**Sprint 2 companion:** [`adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md`](adr-0006-e1-c-human-evidence-and-decision-closure-sprint-2.md).  
**Sprint 1 companion:** [`adr-0006-e1-c-evidence-gap-closure-sprint-1.md`](adr-0006-e1-c-evidence-gap-closure-sprint-1.md).  
**Authorization parent:** [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md).  
**Assessor (restore execution):** repository documentation executor.  
**Reviewer:** **NOT ESTABLISHED**.  
**Independent validator:** **REQUIRED — NOT YET APPOINTED**.

This file **does not** rewrite historical 500/200/30% planning assumptions. Those remain visible as superseded **for the current planning baseline only**.

**Not done:** Production database/data/migration/schema/deployment; procurement; supplier contact; RFI/RFQ; facility/hardware/cloud/provider selection; Stage 1 approval; CAP-GATE-01 forced complete; application-code changes; uncontrolled load testing; fabricated current census; commit; push.

---

## 1. Purpose and scope

Record owner-approved **planning baseline** inputs, headroom **policy**, role-based operational ownership, independent-validation **requirement**, and **HUM-CAP-RV-01 Path B** disposable restore authorization; then execute the existing dump/restore harness against disposable Dev/Test PostgreSQL only.

Planning baseline **≠** technical design **≠** Production evidence **≠** Stage 1 approval.

---

## 2. Repository state at recording

| Item | Value |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | **DIRTY** — pre-existing work preserved |
| E1-B | **PAUSED** · frozen hashes unchanged |
| E1 | **NOT APPROVED / BLOCKED** |

---

## 3. Owner-approved planning baseline

Classification legend:

- **`OWNER-APPROVED PLANNING INPUT`** — owner decision for future modelling
- **`APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS`**
- **`PROVISIONAL INFRASTRUCTURE-PLANNING ENVELOPE`**
- **`DERIVED PLANNING FIGURE`** — arithmetic from owner inputs; not measured
- **`DEV/TEST MEASUREMENT`** — labelled technical observation
- **`PRODUCTION EVIDENCE`** — none of the figures below

### 3.1 Users (WORKLOAD-01)

| Field | Value |
| --- | --- |
| Production planning users | **100** |
| Classification | **`APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS`** |
| Current actual user census | **UNKNOWN** — not fabricated |
| Previous 500-user figure | **`PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE`** (BCM pack Priority 10 / E1-B questionnaire; historical records **not deleted**) |

Derived 10% / 3-year trajectory from **100** (not a census): Year 0 **100** · Year 1 **110** · Year 2 **121** · Year 3 **133.10** — all **`DERIVED PLANNING FIGURE`**.

### 3.2 Peak concurrency (WORKLOAD-02)

| Field | Value |
| --- | --- |
| Peak concurrent users | **50** |
| Classification | **`OWNER-APPROVED PLANNING INPUT — NOT A TECHNICAL MEASUREMENT`** |
| Previous 200-concurrent figure | **`PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE`** |
| Session TTL (Dev/Test) | **3600 s** — **`DEV/TEST MEASUREMENT`** only |

### 3.3 Growth (WORKLOAD-03)

| Field | Value |
| --- | --- |
| Annual growth | **10%** |
| Planning horizon | **3 years** |
| Classification | **`OWNER-APPROVED PLANNING INPUT`** |
| Measured historical growth rate? | **No** |
| Previous ~30% modelling figure | **`PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE`** (that 30% was **growth**, distinct from the new **30% headroom policy** in §4) |

### 3.4 Peak periods (WORKLOAD-04)

| Period | Purpose | Use |
| --- | --- | --- |
| **March–May** | Program / proposal building | **Primary business peak** — must be considered in future capacity and resilience planning |
| **June–October** | Operational delivery | **Secondary / business operations peak** — must be considered in future capacity and resilience planning |

Exact transaction rates and daily volumes: **not invented**. Status vs Sprint 2 “peak profile not specified”: **OWNER-APPROVED PLANNING INPUT** for **season windows only**.

### 3.5 Organizations / accounts (WORKLOAD-05)

| Field | Value |
| --- | --- |
| Current accounts (planning) | **20** |
| Account growth | **15% annually** |
| Horizon | **3 years** |
| Classification | **`OWNER-APPROVED PLANNING INPUT`** (not an independently audited census artefact) |

Derived trajectory (**`DERIVED PLANNING FIGURE`**): Year 0 **20** · Year 1 **23** · Year 2 **26.45** · Year 3 **30.42**.

### 3.6 Documents (WORKLOAD-06)

| Field | Value |
| --- | --- |
| Current actual document census | **UNKNOWN** |
| Planning envelope | **5,000 documents/year** |
| Classification | **`PROVISIONAL INFRASTRUCTURE-PLANNING ENVELOPE`** |
| Annual growth for planning | **10%** (aligned to user-growth planning input) |
| Average document size | **NOT ESTABLISHED** — no authoritative business size exists; Dev/Test LocalFs ~20-byte average is **not** used |
| Later validation | Actual document volume **requires later business validation** |

**Do not** state that SEDMC currently possesses 5,000 documents.

Derived envelope trajectory (**`DERIVED PLANNING FIGURE`**, documents/year): Year 0 **5,000** · Year 1 **5,500** · Year 2 **6,050** · Year 3 **6,655**.

Dev/Test LocalFs 21 files / 420 bytes remains **`DEV/TEST MEASUREMENT`** only.

---

## 4. HUM-CAP-16 — Headroom policy

| Field | Value |
| --- | --- |
| Policy | **30% headroom** |
| Classification | **`OWNER-APPROVED PLANNING POLICY`** |
| Demonstrated on current infrastructure? | **No** — **not claimed** |

Apply **conceptually** to future capacity planning for: CPU; memory; PostgreSQL connections; database storage; document storage; network capacity; background processing; peak demand; growth.

The policy is a **planning margin**. Technical evidence must still demonstrate whether a **future design** satisfies it. Idle Dev/Test PostgreSQL does **not** demonstrate 30% headroom.

---

## 5. HUM-08 — Operational ownership

Repository search found **no** named individuals recorded as **Director of Operations** or **Managing Director**. Role-based assignment only. No DBA / infrastructure engineer / security officer / backup administrator / on-call engineer / incident commander invented.

| Function | Assignment |
| --- | --- |
| Primary operational owner | **Director of Operations** (role) |
| Executive oversight | **Managing Director** (role) |
| Technical sub-roles (infra, app, PG/DB, backup/restore, security, incident commander, on-call, escalation, change, BC, secondary personnel) | **`ROLE-LEVEL OWNERSHIP ESTABLISHED; INDIVIDUAL TECHNICAL ASSIGNMENTS REMAIN OPEN`** |

Already-recorded names (unchanged roles; **not** reassigned by this file):

- **Patrick Makundi** — Owner
- **Wensley Shirima** — DPO designation / IT Manager (formal appointment still **REQUIRED**)
- **THOMAS NGULUMA** — Legal Counsel only

---

## 6. HUM-CAP-VAL-01 — Independent validation

**Independent external validation is required.**

Required profile (not a selected provider):

- independent of SEDMC implementation work
- independent of the E1-C assessment execution
- competent in infrastructure/capacity assessment and/or database/business continuity
- able to review evidence and challenge conclusions

| Field | Value |
| --- | --- |
| Status | **`REQUIRED — NOT YET APPOINTED`** |
| Provider named? | **No** |
| Procurement / contact? | **Not performed** |

Absence of the validator **remains visible** in CAP-GATE-01. No CAP-GATE-01 PASS on self-assessment alone.

---

## 7. HUM-CAP-RV-01 — Path B authorization

**Path B — Explicit disposable migration authorization: GRANTED** by the owner this session, with the following bounds.

`migrate()` may be executed **ONLY** against a **disposable Dev/Test PostgreSQL environment** for the **sole purpose** of enabling and executing the E1-C backup/restore assessment.

**Not permitted:** Production migration; Production database access; Production data; Production schema changes; Production deployment; schema promotion; infrastructure procurement; provider selection; facility selection; Production readiness declaration.

| Constraint | Record |
| --- | --- |
| Database | Disposable only |
| Credentials | Dev/Test `eos` / `eos-dev-only` from compose — **no Production credentials** |
| Connection | `postgres://eos:eos-dev-only@127.0.0.1:5432/eos` — **not** a Production connection string |
| Production data copy-in | **Forbidden — not performed** |
| Non-disposable DROP/migrate | **Forbidden** — harness refuses `eos_gateb`; migrate only on `eos_e1d_b5_*` created by the harness |

Path A (migrate-free implementation) remains **not implemented** and was **not** used.

---

## 8. Restore drill execution (DEV/TEST ONLY)

### 8.1 Pre-execution safety

| Check | Result |
| --- | --- |
| Instance | `compose-postgres-1` · image `postgres:16-alpine` · created 2026-09-17T15:04:39Z |
| Role | Isolated Dev/Test compose from [`infra/compose/dev.yaml`](../../infra/compose/dev.yaml) |
| Databases present | `eos`, `postgres`, `template0`, `template1` — **no** `eos_gateb` |
| `eos` user relations | **none** (empty catalog) — **safe to use as admin connection** for CREATE DATABASE of a sibling disposable DB |
| Production data | **Not present** |
| Authorization | HUM-CAP-RV-01 Path B (this file) |
| Harness | `apps/api/src/persistence/disposable-pg-recovery.ts` `runDisposablePgDumpRestoreDrill` — **unchanged** |
| Host `pg_dump` | **NOT ON PATH** → expected method **sql-logical** |

### 8.2 Execution

| Field | Value |
| --- | --- |
| Executed? | **Yes** |
| Start | **2026-09-17T18:55:01+03:00** |
| End | **2026-09-17T18:55:10+03:00** |
| Wall clock (including runner) | **9542 ms** |
| Harness `elapsedMs` | **7653** |
| Environment | **DEV/TEST ONLY** |
| Admin URL database | `eos` on `127.0.0.1:5432` |
| Disposable database | `eos_e1d_b5_mu5pnm3r` (created, migrated, dumped, dropped, recreated, restored, verified, **dropped** in `finally`) |
| `migrate()` | **Yes** — **only** on the disposable database `eos_e1d_b5_mu5pnm3r` |
| Method | **sql-logical** |
| Result JSON | `ok=true`, `dumped=true`, `restored=true`, `verified=true`, `label=DEV/TEST ONLY`, `productionRtoClaimed=false` |
| Dump artefact size | **N/A as a retained file** — sql-logical dumped **1** `tenants` marker row in process memory; temp dump dir removed |
| Integrity | `verifyMarker`: `SELECT slug FROM tenants WHERE slug = 'e1d-b5-disp'` **rowCount = 1** |
| Post-drill `eos` | Still **no user relations**; size **7519 kB** — application schema **not** left on `eos` |
| Errors | **None** (exit 0) |
| Warnings | npm `Unknown env config "devdir"` (tooling; **not** a restore failure) |

### 8.3 Limitations (mandatory)

- **sql-logical** is not `pg_dump -Fc`; no portable custom-format dump retained.
- Marker is a single internal tenant row, **not** Commercial-first Production data.
- DocumentStorage / SHA-256 round-trip **not** in this harness.
- Application API **not** served from restored SoR.
- Audit/outbox consistency **not** checked beyond the tenant marker.
- Duration **7653 ms** is **labelled Dev/Test restore of a tiny disposable DB** — **not** Production RTO.
- Technical Production RTO/RPO remain **NOT DEMONSTRATED**.
- Business ≤3h / ≤4h / zero critical-data-loss remain **business requirements**, not demonstrated technical capability.

### 8.4 RV reconciliation after drill

| ID | Status after Sprint 4 | Note |
| --- | --- | --- |
| RV-01 | **PARTIALLY EVIDENCED** | Dated labelled logical dump of marker row; **no retained portable dump/manifest file** |
| RV-02 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | PITR not adopted; `archive_mode=off` |
| RV-03 | **EVIDENCE COLLECTED** (labelled Dev/Test) | Clocked restore to clean disposable instance; **not** Production |
| RV-04 | **EVIDENCE REQUIRED** | Documents not in harness |
| RV-05 | **EVIDENCE REQUIRED** | Audit/outbox not verified |
| RV-06 | **EVIDENCE REQUIRED** | API not served from restore |
| RV-07 | **PARTIALLY EVIDENCED** | Dependency products still **UNSELECTED** |
| RV-08 | **PARTIALLY EVIDENCED** | **7653 ms** labelled; **not** Production RTO |
| RV-09 | **PARTIALLY EVIDENCED** | Marker round-trip only; **not** technical RPO=0 |
| RV-10 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | DR topology **UNSELECTED** |
| RV-11 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | Depends on RV-10 |
| RV-12 | **PARTIALLY EVIDENCED** | Marker probe ≠ full backup-integrity programme |
| RV-13 | **PARTIALLY EVIDENCED** | Tenant marker only; not Commercial-first app checks |
| RV-14 | **EVIDENCE COLLECTED** | This packet: timestamps, env, result JSON, limitations |

**No PASS as Production restore capability.**

---

## 9. Capacity assessment reconciliation

| Topic | Owner planning input | Dev/Test measurement | Production evidence |
| --- | --- | --- | --- |
| Users | **100** planning baseline | 4 Dev bootstrap identities **≠** census | **MISSING** |
| Peak concurrency | **50** | TTL 3600 s; no live peak count | **MISSING** |
| Growth | **10%** / **3 years** | — | **MISSING** (not a measured rate) |
| Peaks | Mar–May; Jun–Oct | — | Rates **MISSING** |
| Accounts | **20** + **15%** / 3y | — | **MISSING** as audited census |
| Documents | **5,000/year envelope** + 10% | LocalFs 21 / 420 B | Current census **UNKNOWN** |
| Headroom | **30% policy** | — | **NOT DEMONSTRATED** |
| PostgreSQL | — | 16.15; empty `eos` 7519 kB; pool default 10; disposable restore **7653 ms** sql-logical | **MISSING** |
| Network / facility | — | localhost Dev | **MISSING** — no candidate site |
| Hardware / BOM | — | — | **Not produced** |

Do **not** treat derived Year-3 figures as Production sizing. **No hardware BOM.**

---

## 10. CAP-GATE-01 recalculation

| # | Prerequisite | State |
| --- | --- | --- |
| 1 | CAP / workload assumptions | **PARTIALLY CLOSED** — owner planning baseline recorded; not a measured census; load tests still open |
| 2 | PG evidence | **PARTIALLY CLOSED** — idle + labelled disposable restore; not Production |
| 3 | Document storage | **PARTIALLY CLOSED** — envelope ≠ current volume |
| 4 | Network | **OPEN — EVIDENCE REQUIRED** / **BLOCKED** without site |
| 5 | Backup/restore | **PARTIALLY CLOSED** — disposable sql-logical drill; Production restore **NOT DEMONSTRATED** |
| 6 | Facility | **BLOCKED** — no authorized candidate site |
| 7 | Legal/privacy identified | **PARTIALLY CLOSED** — identification; evidence/review **OPEN** |
| 8 | Operational ownership | **PARTIALLY CLOSED** — role-level DoO / MD; individual technical assignments **OPEN** |
| 9 | TCO inputs | **PARTIALLY CLOSED** — categories; **PRICE INPUT REQUIRED — FUTURE STAGE** |
| 10 | Exceptions documented | **PARTIALLY CLOSED** |
| 11 | Technical vs business RTO/RPO | **PARTIALLY CLOSED** — distinguished; technical **NOT DEMONSTRATED** |
| 12 | Human decisions recorded | **PARTIALLY CLOSED** — baseline/headroom/Path B recorded; validator **OPEN** |
| — | Independent validation | **OPEN — HUMAN DECISION REQUIRED** — **REQUIRED — NOT YET APPOINTED** |

**CAP-GATE-01 = NOT COMPLETE.**

Not automatically closed: facility; site-dependent network; independent validation; legal/privacy evidence; Production capacity validation; Production RTO/RPO.

---

## 11. Stage 1 and Production boundary

**Stage 1 — NOT APPROVED / NOT COMPLETE**

This planning baseline is an **input** to future technical design. It is **not** the technical design.

Not produced: server sizing; hardware BOM; facility/cloud/provider recommendation; procurement plan; supplier shortlist; RFI/RFQ; Production architecture approval.

**Assessment authorization does not constitute Production authorization.**

**SEDMC remains NOT Production Ready.**

---

## 12. Safety check

| Check | Result |
| --- | --- |
| Production database / data / migration / schema / deployment | **Not accessed / not performed** |
| Provider / facility / procurement / RFI | **Not performed** |
| Uncontrolled load testing | **Not performed** |
| Fabricated current user or document census | **Not performed** (UNKNOWN where unknown) |
| Fabricated technical capacity / RTO/RPO / validator / legal | **Not performed** |
| 30% headroom as demonstrated capacity | **Not claimed** — policy only |
| 5,000 documents/year as current volume | **Not claimed** — envelope only |
| 100 users as measured census | **Not claimed** — planning baseline only |
| Dev/Test labels | **Applied** |
| CAP-GATE-01 forced complete | **Not performed** |
| Application-code changes | **Not performed** (harness unchanged) |
| Commit / push | **Not performed** |

**Assessment authorization does not constitute Production authorization.**  
**SEDMC remains NOT Production Ready.**

---

## Additive — 2026-09-17 owner-acceptance reconciliation (same Sprint 4; does not rewrite §3–§8.4)

Owner acceptance of the E1-C recommendations is recorded against the **already executed** Sprint 4 baseline and disposable restore. The restore drill was **not re-run**. Historical 500/200/~30% growth rows **remain**. Sprint 3 file **still not present** (not fabricated).

### Classification alignment (authoritative wording)

| Input | Value | Classification |
| --- | --- | --- |
| Users | **100** | **`OWNER-APPROVED PLANNING BASELINE — NOT A MEASURED CURRENT USER CENSUS`** |
| Peak concurrency | **50** | **`OWNER-APPROVED PLANNING INPUT — NOT A TECHNICAL MEASUREMENT`** |
| Growth / horizon | **10%** / **3 years** | **`OWNER-APPROVED PLANNING INPUT`** |
| Peaks | Mar–May; Jun–Oct | **`OWNER-APPROVED PLANNING INPUT`** — no RPS/CPU/memory invented |
| Accounts | **20** + **15%** / 3y | **`OWNER-APPROVED PLANNING INPUT`** |
| Account Y3 **30.42** | derived | **`DERIVED PLANNING FIGURE — NOT MEASURED CENSUS`** |
| User Y3 **133.10** | derived | **`DERIVED PLANNING FIGURE — NOT MEASURED CENSUS`** |
| Documents | **5,000/year** | **`PROVISIONAL INFRASTRUCTURE-PLANNING ENVELOPE`** — current census **UNKNOWN** |
| Document Y3 **6,655**/year | derived envelope | **`DERIVED PLANNING FIGURE — NOT MEASURED CENSUS`** |
| Headroom | **30%** | **`OWNER-APPROVED PLANNING POLICY`** — **not** demonstrated spare capacity |
| 500 users / 200 concurrent / ~30% growth | historical | **`PREVIOUS PLANNING ASSUMPTION — SUPERSEDED FOR CURRENT PLANNING BASELINE`** |

### Operational / validation wording

- Technical seats: **`INDIVIDUAL TECHNICAL ASSIGNMENT — OPEN`**
- Independent validator: **`REQUIRED — NOT YET APPOINTED`** and **`OPEN — HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR`**
- Facility: **`FAC-01–FAC-24 — EVIDENCE REQUIRED`** · **`FACILITY EVIDENCE BLOCKED — NO AUTHORIZED CANDIDATE SITE`**

### Harness fields not emitted (do not invent)

Existing `runDisposablePgDumpRestoreDrill` does **not** return schema object count, retained dump file size, or restored relation count. Those remain **EVIDENCE REQUIRED** as numeric artefacts. Known: method **sql-logical**; dump file size **N/A (no retained file)**; integrity = 1 marker tenant row; PostgreSQL **16.15**.

### RV statuses using allowed vocabulary (does not delete §8.4)

| ID | Status |
| --- | --- |
| RV-01 | **PARTIALLY CLOSED** |
| RV-02 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** |
| RV-03 | **PARTIALLY CLOSED** (labelled Dev/Test restore — **not** Production) |
| RV-04 | **EVIDENCE REQUIRED** |
| RV-05 | **EVIDENCE REQUIRED** |
| RV-06 | **EVIDENCE REQUIRED** |
| RV-07 | **PARTIALLY CLOSED** |
| RV-08 | **PARTIALLY CLOSED** (7653 ms labelled — **not** Production RTO) |
| RV-09 | **PARTIALLY CLOSED** (marker only — **not** technical RPO=0) |
| RV-10 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** |
| RV-11 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** |
| RV-12 | **PARTIALLY CLOSED** |
| RV-13 | **PARTIALLY CLOSED** |
| RV-14 | **PARTIALLY CLOSED** (this packet) |

No RV item is **CLOSED** as Production restore capability. **`TECHNICAL PRODUCTION RTO/RPO — NOT DEMONSTRATED`**. Business ≤3h / ≤4h / zero critical-data-loss remain business objectives only.

**CAP-GATE-01 — NOT COMPLETE.** Independent validation, facility, site-dependent network, legal/privacy evidence, Production capacity validation, and Production RTO/RPO remain open.

**STAGE 1 — NOT APPROVED / NOT COMPLETE**

Live dependency remains **NA-A-22** (not rewritten; no NA-A-23 invented for this restatement).
