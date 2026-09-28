# E-01 — Legal Entity / Tanzania Establishment (Controlled Placeholder)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`E1-C01: INCOMPLETE`**  
> **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`**  
> **`UAT: NOT AUTHORIZED`**  
> **`STATUS: MISSING` (authoritative documentary evidence absent)**  
> **`HUMAN LEGAL VALIDATION REQUIRED`**  
> **`EXTERNAL EVIDENCE REQUIRED` (registry extract / equivalent)**

This is a **controlled placeholder and action record**. It does **not** constitute legal-entity evidence, Tanzania establishment attestation, or Legal/DPO determination.

---

## 1. Evidence quality rules applied

| Category | Status for E-01 |
| --- | --- |
| FACT | **Not established** for legal name, registration number, incorporation date, registered office, or attested establishment |
| COMPANY POSITION | SEDMC states it is Tanzania-based and operates as a Tanzania DMC (business position; not a registry extract) |
| DESIGN INTENT | Dev/Test seed records use trading-style names; these are **not** incorporation facts |
| AI COUNSEL ANALYSIS | Counsel-style analysis treats establishment as a **fact to be evidenced**, not as proved |
| HUMAN LEGAL/DPO DETERMINATION | **Not provided** |
| EXTERNAL EVIDENCE | **Not present** (no BRELA / equivalent extract, certificate, or attested corporate document in this repository) |

---

## 2. What was inspected

| Source | What it is | What it proves | What it does **not** prove |
| --- | --- | --- | --- |
| [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md) LA-01 | COMPANY POSITION: Tanzania-based DMC; EOS is SEDMC’s business system | That SEDMC has recorded a **business** Tanzania-establishment position | Legal name, registration number, registered office, directors, shareholding, or formal establishment under Tanzania law |
| [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md) L1 | Establishment recorded as **UNKNOWN** | That the fact pack did **not** close establishment | Nothing affirmative about incorporation |
| [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md) | Formal instrument; human fields blank | That attestation is **not** complete | Entity identity |
| Repository branding (`README.md`, product names) | Product/workspace branding | That the software is named/branded for Serengeti Experience DMC | Legal personality, registration, or establishment |
| `apps/api/src/store.ts` Dev seed (`slug: "sedmc"`, organisation `legalName: "Serengeti Experience DMC Ltd"`, location seed `ARU` / Arusha) | **DESIGN / DEV SEED** for local Development/Test | That a Dev/Test fixture uses that string | Incorporation, BRELA registration, or operating establishment |
| `packages/db/schema.sql` `organisations.legal_name` | Schema capability | That EOS **can store** a legal name field | That any stored value is the real entity |
| Email domains, employee names, repository path names | Not inspected as legal evidence | — | Must **not** be used to infer the legal entity |

**Do not infer** legal-entity information from website branding, email addresses, repository names, employee names, or business descriptions.

---

## 3. Required closure evidence (not present)

To close E-01, SEDMC must supply **authoritative documentary evidence**, then obtain **human legal validation** as appropriate. Typical artefacts (to be supplied externally; **not invented here**):

1. Current legal entity name as registered.
2. Registration / incorporation number and registry (e.g. BRELA or other competent registry — **not assumed**).
3. Date and place of incorporation / registration.
4. Registered office / principal place of business.
5. Evidence of Tanzania establishment (registered office, branch, or other legally relevant presence — **to be determined by Legal**).
6. Trading name(s) used in EOS, if different from the legal name.
7. Human Legal confirmation that the documents are current and sufficient for LA-01 / L-04.

Until those artefacts exist, the legal entity and Tanzania establishment remain **MISSING**.

---

## 4. Action record

| Action ID | Action | Owner | Status |
| --- | --- | --- | --- |
| E01-A1 | Obtain current incorporation / legal-entity extract from the competent registry or corporate records | SEDMC company secretary / Legal | **OPEN** |
| E01-A2 | Record registered office and operating location(s) from authoritative documents | SEDMC Legal | **OPEN** |
| E01-A3 | Distinguish trading name used in EOS from registered legal name | SEDMC Legal + product owner | **OPEN** |
| E01-A4 | Human Legal validation that LA-01 Tanzania-establishment position is supported by the extract | Qualified human Legal reviewer | **OPEN** |
| E01-A5 | File the extract (or certified copy reference) as EXTERNAL EVIDENCE against E-01 | SEDMC Legal / privacy | **OPEN** |

No legal name, registration number, or establishment conclusion is recorded in this placeholder.

---

## 5. Governance status (unchanged)

- E1-C01 = **INCOMPLETE**
- E1 = **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**
- Production = **NOT AUTHORIZED**
- UAT = **NOT AUTHORIZED**
- This placeholder does **not** close E-01.
