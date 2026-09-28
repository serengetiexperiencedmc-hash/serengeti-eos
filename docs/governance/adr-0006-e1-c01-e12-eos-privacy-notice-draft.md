# E-12 — EOS Privacy Notice (Draft Skeleton)

> **`DRAFT — NOT LEGALLY APPROVED`**  
> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: DRAFT`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

This skeleton lists **only processing that is factually modelled in EOS** (see E-04). It is **not** a public or Production notice.

The following are **not stated** because they are **not evidenced or not determined**:

- Legal bases  
- Retention periods  
- International-transfer mechanisms  
- DPO identity  
- Regulatory registration  
- Provider names  
- Contact details / legal entity name (E-01 **MISSING**)  
- Rights wording tied to a specific statute  

If those fields were invented, this notice would be misleading. They remain **not included**.

---

## 1. Who we are

**Not stated.** Legal entity name, registered office, and establishment are **MISSING** (see [`adr-0006-e1-c01-e01-legal-entity-establishment.md`](adr-0006-e1-c01-e01-legal-entity-establishment.md)). Product branding is not a substitute.

---

## 2. What EOS is (factual)

EOS is a commercial operating system used in **Development/Test** for destination-management commercial work: CRM, opportunities, RFPs, programmes, costing, approvals, suppliers/hotels, and commercial documents. **Production use is not authorized.**

---

## 3. Processing actually modelled (not a legal inventory)

| We may process (as modelled) | Examples of data | Data subjects (typical) |
| --- | --- | --- |
| Account and organisation records | Organisation names, country/market fields, org email/phone if entered | Client/partner organisations; possibly individuals if contact fields are used |
| Commercial contacts | Name, job title, email, telephone, mobile, country, language | Natural-person contacts |
| User accounts | Email, display name, role, password **hash** (Dev local IdP) | Staff and authorised users |
| RFPs, programmes, costing, approvals | Commercial metadata; staff actor IDs; free text that **might** name people | Staff; possibly individuals named in free text |
| Supplier and hotel records | Vendor profiles; linked contacts if stored | Vendor organisations; contacts |
| Commercial files | Filenames and **unstructured file bytes** (contents unknown) | Unknown if files contain personal data |
| Audit trail | Actor, action, resource, state snapshots | Users; possibly contacts copied into JSONB |
| HR certification register | Certification linked to `employee_id` | Employees |
| Notifications (if email features used) | Email address and message content | Recipients |

**Not currently evidenced as structured EOS processing:** named delegate/traveller lists; passport/national ID fields; health/accessibility fields; payment-card data; biometrics.

---

## 4. Purposes (business description only — not lawful bases)

Business purposes evidenced by product design: operate SEDMC commercial pipeline and programme delivery support; authenticate users; keep an audit trail; store commercial files.

**Lawful basis: not stated.**

---

## 5. Recipients

**Not stated.** Production hosting, email, IdP, monitoring, and subprocessors are **NOT SELECTED**. No provider names are listed.

---

## 6. Where data are processed

**Not stated.** Production processing/storage geography is **NOT SELECTED** (E-05 Layer D).

---

## 7. International transfers

**Not stated.** No transfer mechanism is claimed.

---

## 8. Retention

**Not stated.** See E-13: periods are **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT**.

---

## 9. Rights, complaints, contact, DPO

**Not stated.** No DPO is identified. No regulator complaint channel is published here. No notice contact address is invented.

---

## 10. Status

| Field | Value |
| --- | --- |
| This document | **`DRAFT — NOT LEGALLY APPROVED`** |
| Sufficient for Publication / Production? | **No** |
| Closes E-12? | **No** |

A complete notice should be drafted **after** E-01 entity facts, E-06 legal roles, E-13 periods, E-18 applicability, and provider selection exist, then reviewed by qualified human Legal/DPO.
