# E-13 — Retention Requirements (Proposed Internal Matrix)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: DRAFT` / `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**  
> **No deletion is implemented by this document. Database retention behaviour is not altered.**

Do **not** invent legal retention periods. Where no period is known:

**`TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT`**

Architecture `docs/architecture/05-data-architecture.md` describes soft-delete (`deleted_at`) and later approved erasure as **DESIGN INTENT**, not a Production retention schedule. C1 ADR impact assessment records “CRM PII retention & lawful basis” as an open topic **before UAT with real contact data**.

---

## 1. Principles (non-legal)

| Principle | Source type | Statement |
| --- | --- | --- |
| Do not retain indefinitely by default | COMPANY POSITION / L-11 counsel framing | A defined schedule is required; this draft does **not** supply the numbers |
| Operational vs audit vs backup may differ | DESIGN INTENT | Backup overlay is **architecture-dependent** (E-22) |
| Legal periods are not inferred from schema `deleted_at` | FACT | Soft-delete is a technical capability, not a legal period |
| Financial/tax/contract periods may exceed privacy-minimisation preferences | Placeholder | **TO BE DETERMINED** by Legal/Finance |

---

## 2. Proposed internal retention matrix

| Record class | Business purpose | Proposed retention basis | Proposed period | Legal/contractual dependency | Deletion requirement | Backup implications | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRM contacts | Commercial relationship | Business need + applicable privacy law | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Privacy + possible contract with client | Define erasure vs archive vs anonymise — **not implemented** | Copies in backups until backup TTL — **TTL unknown** | Privacy + commercial | **`DRAFT`** |
| CRM / internal organisations | Account master data | Business need + company/commercial law | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Company/tax/contract | Linked contacts must be considered | Same | Commercial | **`DRAFT`** |
| Opportunities | Pipeline | Business need | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Possible financial/audit | Linked to org/RFP | Same | Commercial | **`DRAFT`** |
| RFPs | Capture and fulfil requests | Business + possible contract evidence | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract/limitation periods **unknown** | Versions in scope | Same | Commercial | **`DRAFT`** |
| RFP versions / proposals | Offer evidence | Business + dispute/contract | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract | Superseded versions may still be needed | Same | Commercial | **`DRAFT`** |
| Programmes / days / items | Delivery planning | Operational + possible contract | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract | Future delegate data would need a **separate** rule if introduced | Same | Operations | **`DRAFT`** |
| Costing | Pricing | Financial/commercial | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Accounting/tax **unknown** | — | Same | Finance/commercial | **`DRAFT`** |
| Approvals | Accountability | Accountability/audit | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Audit/governance | Approvals often retained longer than drafts — **not decided** | Same | Governance/commercial | **`DRAFT`** |
| Commercial documents (metadata + bytes) | Evidence of RFPs/contracts/rates | Contract + confidentiality | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract limitation; file contents unknown | `status=deleted` is application status, **not** proven physical destruction | Object-store and backup copies **NOT SELECTED** | Commercial/legal | **`DRAFT`** |
| Supplier / hotel records | Sourcing | Business | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract | — | Same | Commercial/ops | **`DRAFT`** |
| Supplier contracts | Rights and obligations | Contractual | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Contract + limitation | Retain through limitation **period unknown** | Same | Legal/commercial | **`DRAFT`** |
| Audit events | Integrity, investigation | Security + legal hold | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Possible statutory log retention **unknown** | Table is insert-only (FACT); erasure design **not** Production-approved | Hash chain complicates selective delete — DESIGN INTENT | Security | **`DRAFT`** |
| Security / application logs | Detect/respond | Security | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Security + privacy | Production log store **NOT SELECTED** | Log backups unknown | Security | **`DRAFT`** |
| Backups | Recovery | Continuity (COMPANY POSITION LA-07) | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Must not silently exceed operational deletion | Restore rehydrates deleted records until TTL | **Architecture-dependent** | IT | **`DRAFT`** · overlay **MISSING** |
| Authentication records (credentials, sessions) | Access control | Security + account lifecycle | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Employment/security | Deprovision vs hash retention **unknown**; Production IdP **NOT SELECTED** | IdP vendor backups unknown | IAM | **`DRAFT`** |
| HR certification register | Competence records | Employment/ops | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Employment law **unknown** | Not a full HRIS | Same | HR | **`DRAFT`** |
| Privacy registers (DSR/DPIA/consent) | Privacy operations | Privacy accountability | **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT** | Privacy law **unknown** | — | Same | Privacy | **`DRAFT`** |

---

## 3. Technical observations (not a schedule)

| Observation | Type | Implication |
| --- | --- | --- |
| Soft-delete columns exist on several tables | FACT | Supports later erasure workflow; **does not** set a period |
| `audit_events` cannot be UPDATEd/DELETEd by trigger | FACT | Retention/erasure for audit needs a **designed** legal/technical approach; not done |
| Commercial document `status=deleted` | FACT | Application flag; physical removal from `DocumentStorage` and backups **not** Production-evidenced |
| Event bus forbidden PII keys | FACT | Reduces (does not eliminate) secondary retention of contact fields in events |
| No Production backup TTL | FACT | Backup implication rows remain open |

---

## 4. Explicit non-actions

This artefact does **not**:

- Implement deletion or anonymisation.
- Alter migrations, schema, or jobs.
- Claim a Tanzania, Kenya, GDPR, or UK statutory period.
- Approve UAT with real contact data (C1 still flags retention/lawful basis as open).

---

## 5. Human / Legal / Finance inputs required

1. Statutory minimum/maximum periods per **applicable** law (applicability = E-18).
2. Contractual limitation periods for RFPs, proposals, and supplier contracts.
3. Tax/accounting record periods.
4. Security-log periods.
5. Whether audit immutability is compatible with erasure rights — **PENDING HUMAN/DPO/LEGAL DETERMINATION**.

---

## 6. Status

| Field | Value |
| --- | --- |
| Schedule | **`DRAFT`** — periods not populated |
| Production deletion | **Not implemented** |
| Closes E-13? | **No** |
