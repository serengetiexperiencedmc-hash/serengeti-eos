# E-15 — Personal-Data Incident / Breach Response (Proposed Process)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: DRAFT` / `DOCUMENTED PROCESS` (proposed)**  
> **`IMPLEMENTED CONTROL: NOT EVIDENCED`**  
> **`TESTED CONTROL: NOT EVIDENCED`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

This is a **proposed internal process** for personal-data incidents affecting EOS. It is **not** an operationally tested Production playbook and **not** a Legal/DPO-approved notification matrix.

Do **not** treat architecture crisis-command design as a tested privacy-breach control.

Jurisdiction-specific notification **deadlines are not prescribed** here. No verified, sourced statutory clock is recorded in this artefact.

---

## 1. Evidence quality of related existing documents

| Source | Type | What it is | What it is not |
| --- | --- | --- | --- |
| `docs/architecture/13-crisis-command-center.md` | DESIGN INTENT | Severity ladder; crisis overlay; generic incident lifecycle | Personal-data breach playbook; tested IR; regulator notice procedure |
| `docs/architecture/14-threat-model.md` | DESIGN INTENT | Threat examples including backup/offsite breach | Implemented detection |
| Formal decision package monitoring/IR row | FACT (governance status) | Records monitoring/IR **NOT READY**; lab detection was scripted | Production observability |
| Gate-B/E2 lab | FACT | Disposable Dev/Test recovery laboratory | Production incident test |
| Company position / L-13 counsel | COMPANY POSITION / AI COUNSEL ANALYSIS | Need for a process and law-specific mapping | Appointment of incident lead; notification decisions |

**`DOCUMENTED PROCESS`** = this file (draft).  
**`IMPLEMENTED CONTROL`** = Production monitoring, on-call, evidence locker, comms — **not evidenced**.  
**`TESTED CONTROL`** = tabletop or live exercise of **this** privacy process — **not evidenced**.

---

## 2. Proposed process (12 steps)

### 1. Detection

| Element | Proposed content | Control state |
| --- | --- | --- |
| Sources | User report; audit anomaly; monitoring alert; vendor notice; lost device; misdirected email | Monitoring stack **NOT SELECTED** (E-26). Vendor notice clauses **MISSING** (E-07/E-30) |
| Immediate action | Record time detected vs time occurred if known; do not delay logging for perfect facts | **DOCUMENTED PROCESS** only |

### 2. Initial classification

| Element | Proposed content | Control state |
| --- | --- | --- |
| Questions | Confidentiality, integrity, availability? Personal data involved (see E-04)? Document bytes unknown? Credentials? | Classification uses **internal** SEDMC labels (E-16), not a statutory conclusion |
| Severity | Align operationally with crisis ladder L0–L3 **without** declaring a legal “personal data breach” | Legal characterisation = step 7 |

### 3. Containment

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Disable compromised accounts; rotate secrets (Production secrets platform **NOT SELECTED**, ADR-0012 OPEN); isolate systems; preserve availability where safe | **NOT IMPLEMENTED** as Production control |

### 4. Investigation

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Timeline; systems affected (app, PG, object store, email, backups); actors; data categories from E-04 | Production topology **UNKNOWN** (E-08) |

### 5. Evidence preservation

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Snapshot logs, audit_events, relevant DB rows, document checksums; avoid overwriting | Audit table is insert-only in schema (FACT). Production evidence locker **not evidenced** |

### 6. Data-impact assessment

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Categories, approximate volume, subjects (staff/contacts/unknown file subjects), jurisdictions **if known** (E-05 census **MISSING**), likely consequences | Factual assessment; not a legal notice decision |

### 7. Legal/DPO assessment

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Route to qualified human Legal/DPO (E-03 DPO **MISSING**). Determine whether a notifiable incident exists **under each applicable law** | **PENDING HUMAN/DPO/LEGAL DETERMINATION** per incident. No DPO identity recorded |

### 8. Regulatory notification decision

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Human Legal/DPO decides whether to notify which authority | **Do not apply unsourced deadlines.** Mapping of PDPC / ODPC / ICO / other authorities = **MISSING** until E-18 applicability and E-03 function exist |
| State | Decision record (notify / not notify / still investigating) with reasoning | **DOCUMENTED PROCESS** only |

### 9. Client notification decision

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Human Legal + commercial: whether contract or law requires client notice; who sends | Contracts **MISSING** (E-07) |

### 10. Data-subject notification decision

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Human Legal/DPO: whether subjects must be informed; channel; content | Contact census / notice (E-12) **not legally approved** |

### 11. Remediation

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | Close vulnerability; restore from backup **only** if integrity verified; user communication; vendor actions | Production backup/DR **NOT SELECTED** |

### 12. Post-incident review

| Element | Proposed content | Control state |
| --- | --- | --- |
| Actions | RCA; corrective actions; update this process; consider whether DPIA/screening must be revisited (E-17) | **Not tested** |

---

## 3. Roles (proposed; not appointed)

| Role | Proposed function | Evidence of appointment |
| --- | --- | --- |
| Detector / duty ops | Raise incident | **MISSING** |
| Incident coordinator | Drive steps 1–6 and 11–12 | **MISSING** |
| Security technical lead | Containment and forensics | **MISSING** |
| Qualified Legal/DPO | Steps 7–10 | E-03 **MISSING**; attestation blank |
| Commercial / client owner | Client notice execution if decided | **MISSING** |
| Executive / crisis commander | L2/L3 overlay per crisis architecture | DESIGN INTENT only |

Do **not** invent a DPO name.

---

## 4. Explicit non-claims

- This process has **not** been operationally tested.
- No Production detection SLA is claimed.
- No “72-hour” or other statutory clock is adopted in this file.
- Lab restore tests are **not** personal-data breach exercises.

---

## 5. Status

| Field | Value |
| --- | --- |
| Documented process | **`DRAFT`** |
| Implemented control | **`MISSING`** |
| Tested control | **`MISSING`** |
| Regulator mapping | **`REQUIRES HUMAN REVIEW`** |
| Closes E-15? | **No** |
