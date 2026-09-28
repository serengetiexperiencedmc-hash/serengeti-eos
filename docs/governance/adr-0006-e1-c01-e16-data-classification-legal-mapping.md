# E-16 — Internal Classification to Statutory Mapping (Phase 1)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: PARTIALLY EVIDENCED` / `DRAFT` / `REQUIRES HUMAN REVIEW`**  
> **`SEDMC security classification ≠ statutory legal classification`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

This artefact maps **SEDMC internal security classifications** to **candidate statutory concepts**. It does **not** declare that any category is legally sensitive/special-category data.

Legal classification column: **`PENDING HUMAN/DPO/LEGAL DETERMINATION`** unless a human determination is later recorded (none is recorded here).

---

## 1. Internal schemes in the repository (do not collapse)

| Scheme | Where | Type |
| --- | --- | --- |
| Public / Internal / Confidential / Restricted / Highly Restricted | `docs/architecture/05-data-architecture.md`; `principals.classification_clearance`; many table `classification` columns | DESIGN INTENT + schema FACT |
| Restricted / Restricted+ (company privacy position) | Company position LA-12 / LA-13 | COMPANY POSITION |
| Event forbidden keys | `docs/governance/event-sensitive-data-policy.md` | FACT (event policy); not a legal taxonomy |

**SEDMC Restricted / Restricted+ / Highly Restricted is an internal security handling label. It is not a statutory legal classification.**

Commercially confidential rates, RFP budgets, commissions, and costing are **not** legally sensitive personal data merely because they are Confidential/Restricted internally — unless they **contain** personal data that meets statutory criteria (**PENDING HUMAN/DPO/LEGAL DETERMINATION**).

---

## 2. Mapping table

| Data category (factual / intended) | Currently evidenced in EOS structured processing? (E-04) | Typical SEDMC internal class (company/architecture) | Candidate statutory concepts (illustrative labels only) | Legal classification | Notes |
| --- | --- | --- | --- | --- | --- |
| Ordinary commercial contact data (name, work email, phone, job title) | **Yes** (CRM contacts, principals email) | Often Internal / Confidential / Restricted depending on context — **not standardised in Production policy** | Ordinary personal data under many privacy laws **if** the law applies | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Do not assume GDPR “personal data” label applies to every contact |
| Organisation legal names, rates, budgets without natural-person identifiers | **Yes** (orgs, costing, RFPs) | Confidential | Often **not** personal data if truly non-identifying | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Mixed records (org + `primary_email`) may still be personal data |
| Identity / passport / national ID | **Not** in CRM/programme structured fields. Forbidden on event payloads. **Possible in document bytes (unknown)** | Architecture example: Restricted / Highly Restricted; company Restricted+ **if processed** | Passport/ID may be regulated identity data; **not declared here** | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Structured processing **`FUTURE / NOT CURRENTLY EVIDENCED`** |
| Health / accessibility | **Not** evidenced as structured fields. Architecture **example** only | Architecture: Restricted; company Restricted+ **if processed** | May be special-category / sensitive **under some laws if processed and if those laws apply** | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | **`FUTURE / NOT CURRENTLY EVIDENCED`** as EOS structured processing |
| Biometric | **Not found** | Would be Highly Restricted / Restricted+ **if** introduced | Often highly regulated **if** processed | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | **`FUTURE / NOT CURRENTLY EVIDENCED`** |
| Financial / payment (PAN, payment instruments) | **Not** evidenced as a cardholder-data store. Costing/commercial amounts **are** evidenced | Architecture: Highly Restricted **if PAN**; costing typically Confidential | Payment-instrument data ≠ commercial quotes. PCI and privacy are separate questions | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Do not label costing sheets as “financial sensitive PD” automatically |
| Credentials (password hashes, session tokens) | **Yes** in Dev local IdP (`principal_credentials`, `sessions`) | Highly Restricted (architecture) | Security data; statutory “sensitive” status **varies** and is **not** assumed | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Production IdP **NOT SELECTED** |
| Security-sensitive information (IR evidence, break-glass, audit JSONB) | Audit events **Yes**; IR evidence locker **not evidenced** | Highly Restricted (architecture examples) | Not automatically special-category PD | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Audit JSONB may copy ordinary PD |
| Commercially confidential information (rates, commissions, proposals) | **Yes** | Confidential / Restricted | Generally **not** statutory sensitive PD **unless** personal data criteria met | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Preserve commercial vs privacy distinction |
| Employee certification records | **Yes** (H1 register) | Internal / Confidential (not Production-standardised) | Employment data; some jurisdictions treat employee data specifically | **PENDING HUMAN/DPO/LEGAL DETERMINATION** | Not payroll |

---

## 3. Alignment statement (mandatory)

| Internal label | Statutory meaning |
| --- | --- |
| Restricted | **Handling control** (need-to-know, purpose limitation as designed) |
| Highly Restricted | **Handling control** (vault/dual-control **DESIGN INTENT**) |
| Restricted+ | **Company position** for designated high-protection classes **if** those data are processed |

**None of the above equals** “sensitive personal data”, “special category data”, or any Tanzania/Kenya/EU/UK statutory term.

If Restricted+ **contains** passport, health, biometric, payment-instrument, or similar data, **those legal requirements must be assessed separately** under applicable law — **PENDING HUMAN/DPO/LEGAL DETERMINATION**.

---

## 4. Gaps

| Gap | Impact |
| --- | --- |
| No Production census of document-byte contents | Residual unknown statutory risk |
| Two overlapping internal taxonomies (5-level architecture vs Restricted+) | Need a single Production handling standard — **not selected here** |
| Applicable law not determined (E-18) | Statutory columns cannot be completed |
| Human Legal/DPO mapping not provided | E-16 cannot close |

---

## 5. Status

| Field | Value |
| --- | --- |
| Internal classes | **`PARTIALLY EVIDENCED`** (documented in company position + architecture) |
| Statutory mapping | **`REQUIRES HUMAN REVIEW`** |
| Closes E-16? | **No** |
