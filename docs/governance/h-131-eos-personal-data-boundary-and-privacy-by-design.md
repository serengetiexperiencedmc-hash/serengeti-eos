# H-131 — EOS Personal-Data Boundary and Privacy by Design

> **GOVERNANCE / ARCHITECTURE DOCUMENTATION ONLY**  
> Establishes the intended privacy-by-design boundary: EOS is **not** a system of record for personal data.  
> **NOT** application-code change. **NOT** schema/migration. **NOT** infrastructure. **NOT** Production configuration.  
> **NOT** PDPC registration. **NOT** a PDPC exemption. **NOT** legal advice.  
> Prior records H-119, H-125, H-126, H-128, H-129, H-130, and `h-131-tin-certificate-evidence-reconciliation.md` inspected and **not modified**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 509.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.  
**Commit / push:** **NONE**.

This file is a **distinct** H-131 artefact from `h-131-tin-certificate-evidence-reconciliation.md`. It does **not** replace, reopen, or alter TIN or BRELA evidence.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC registration status = OPEN / NOT COMPLETED
H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS (H-119) — unchanged
H-80 ACTIVE · H-81 NOT STARTED
```

Commercial system of record remains **outside EOS** (Office / Excel / mail / WhatsApp / phone), as already recorded in H-126. This document adds a **personal-data** boundary; it does not change the commercial SoR finding.

---

## 1. Purpose

Record the Owner-directed architectural policy:

```text
EOS shall not be designed or implemented as a system of record for personal data.
```

SEDMC has confirmed that EOS should **not** store personal data. This increment documents that boundary so that later design, implementation, ingestion, logging, and storage decisions can be judged against it.

This document:

- defines what EOS **may** retain as ordinary business/commercial information;
- defines what EOS **must not** intentionally collect, retain, or use as ordinary business records;
- defines how external communications that contain personal data must be handled;
- states the relationship to PDPC registration **without** asserting exemption.

This document does **not** implement, remediate, or recertify application behaviour.

---

## 2. Scope

**In scope**

- EOS architectural / privacy-by-design intent.
- Categories of commercial facts EOS may hold.
- Categories of personal data EOS must not intentionally hold.
- External-source and communications ingestion boundary.
- Logging, audit, backup, and attachment implications **as policy**, not as a Production design.
- Change-control for any future personal-data functionality.

**Out of scope**

- Application-code changes.
- Database schema or migrations.
- Infrastructure, hosting, region, or Production configuration (ADR-0006, DP-0006, ADR-0012, ADR-0013 remain **OPEN** as previously recorded).
- PDPC registration, filing, or certificate.
- Legal determination of whether SEDMC’s **wider** business must register with PDPC.
- Reassessment of BRELA or TIN evidence (already recorded separately; not altered here).
- UAT re-acceptance (H-119 remains valid with documented limitations).

---

## 3. Current EOS privacy boundary

Governed intended boundary:

1. EOS is **not** intended to be a system of record for information that identifies, or can reasonably identify, a natural person.
2. EOS is intended to hold **business/commercial** facts needed for commercial workflow (accounts as organisations, opportunities, RFPs, programmes, rates, statuses, and similar).
3. Personal data that exists in SEDMC’s wider operations (email, WhatsApp, spreadsheets, attachments, phone, paper) remains **outside EOS** unless a later governed change explicitly authorizes a different design.
4. This increment does **not** audit application source, schema, or runtime stores, and does **not** certify that every existing code path already complies. Alignment of any existing surface with this policy is a **separate** change-controlled action. This increment performs **no** implementation.

Owner facts already on record and reused here without alteration:

- Production is **not authorized / not ready**.
- PDPC registration has **not** been completed (H-126 / H-129).
- EOS is **not** the commercial system of record (H-126).
- No hosting provider, cloud region, privacy certification, or security certification is established by this document.

---

## 4. Data categories EOS may retain

Where appropriate for commercial workflow, EOS may be designed around **non-personal business information**, including:

- company / account names (organisational, not individual identity records);
- opportunity / RFP identifiers;
- programme / event identifiers;
- destination;
- travel / event dates (as event or programme dates, not dates of birth);
- participant / delegate **counts**;
- budgets;
- currencies;
- commercial rates;
- supplier / company information;
- proposal status;
- commercial workflow status;
- approved business metrics;
- operational status.

These categories remain **business facts**. They must not be used as a vehicle to smuggle personal data (for example, putting a person’s name or personal email into a “company name” or “notes” field).

---

## 5. Data categories EOS must not intentionally retain

EOS shall **not** intentionally collect, retain, or use as ordinary business records:

- individual traveller names;
- individual client contact names;
- personal email addresses;
- personal telephone numbers;
- passport numbers;
- national identification numbers;
- personal residential addresses;
- dates of birth;
- health information;
- biometric information;
- banking / payment information belonging to individuals;
- personal WhatsApp message content;
- personal email content;
- uploaded personal identity documents;
- employee personal records;
- other information that identifies or can reasonably identify a natural person.

Work emails or phone numbers of named natural persons, contact directories, traveller lists, and employee files are **personal-data categories** for this boundary, even if they appear in a commercial context. They are **not** authorized as ordinary EOS records by this document.

Do **not** introduce pseudonymous identifiers and then treat them as a substitute for an approved privacy architecture unless separately governed.

---

## 6. External-source boundary

If an RFP, email, spreadsheet, WhatsApp message, attachment, or other external business communication contains personal data, EOS **must not** automatically ingest or persist that personal data.

Preferred pattern: extract only the **necessary non-personal business facts**.

EOS is not the store for the source communication. The source remains in the operational tools already recorded as the commercial SoR (Office / Excel / mail / WhatsApp / phone).

No ingestion of booking history, message archives, or identity documents is authorized by this document (H-126 already recorded that no ingestion / booking history is introduced; this document does not reopen that).

---

## 7. RFP / email / WhatsApp ingestion boundary

Where EOS needs information from an external communication, record only commercial facts.

**Instead of** recording:

`John Smith, john.smith@example.com, 150 delegates`

**record only:**

`150 delegates`

**Instead of** recording:

`Contact Mary at +255…`

**record only:**

`Client contact available externally`

Rules:

- No automatic ingest of email bodies, WhatsApp threads, or attachments into EOS.
- No CRM-style contact records (name + email + phone of a natural person) as ordinary EOS data.
- No traveller / delegate name lists.
- If a human operator must refer to a person, the referral stays **outside EOS** (“contact available externally”).
- Illustrative names and addresses in this section are **examples only**, not stored records.

Email ingestion, WhatsApp ingestion, CRM contact records, traveller records, and employee records are **not** authorized here. Any proposal to add them requires the change-control in §13.

---

## 8. Logging / audit / backup implications

Policy implications only. This document does **not** select logging products, backup products, regions, or Production architecture.

- Logs, audit trails, traces, error reports, and backups **must not** become a system of record for personal data.
- Ordinary operational logs should not capture personal emails, phone numbers, passport/ID numbers, message bodies, or identity-document contents.
- Support dumps, screenshots, and diagnostic artefacts must be handled so that personal data is not retained as a side effect of troubleshooting.
- Backup/restore of EOS, if later designed, must preserve this boundary: EOS backups are backups of **commercial facts**, not a personal-data archive.
- Because Production infrastructure is **not** authorized and hosting/provider/region remain **OPEN**, this section does not specify a Production logging or backup implementation.

---

## 9. Attachments / document-storage implications

- EOS must **not** be used as a repository for uploaded personal identity documents (passports, national IDs, visas, personal certificates) or other attachments whose ordinary content is personal data.
- Commercial documents that are in scope for EOS (for example, proposal/status artefacts that do not contain personal data) remain a **separate** document class already treated under commercial-document governance; this policy does not reopen those records.
- If an otherwise commercial attachment contains personal data, that personal data must **not** be persisted into EOS as ordinary content. Redact, omit, or keep the source outside EOS.
- No document-management product, object store, or Production file service is selected by this document.

---

## 10. Privacy-by-design principles

These are **design principles** for EOS, not legal advice and not a certification.

1. **Non-collection by default.** Do not collect personal data unless a later governed decision explicitly authorizes a specific purpose, lawful basis assessment, and design.
2. **Data minimisation.** Prefer counts, statuses, identifiers of companies/opportunities/programmes, dates of events, and amounts — not identities of natural persons.
3. **Purpose limitation.** EOS purpose here is commercial workflow for SEDMC business facts, not a CRM, HR, or traveller dossier.
4. **Separation from operational SoR.** Personal communications and contact books stay in existing operational tools outside EOS.
5. **No quiet substitution.** Hashing, tokenising, or “contact IDs” for natural persons is **not** an approved workaround unless separately governed as a privacy architecture.
6. **Fail closed on ingestion.** If a source may contain personal data and EOS cannot extract only non-personal facts, **do not ingest**.
7. **Change control.** New personal-data capability is a governance event (§13), not a routine feature.

No privacy certification, ISO/SOC statement, or PDPC approval is claimed.

---

## 11. Relationship to PDPC registration

State **exactly** the following, and no broader legal conclusion:

1. EOS is intentionally designed to avoid collecting, processing and retaining personal data.
2. This materially reduces EOS’s personal-data exposure.
3. SEDMC’s wider business activities may still involve personal data outside EOS.
4. The applicability of PDPC registration to SEDMC’s wider business operations remains a separate regulatory/legal determination.
5. No PDPC registration exemption is being asserted by this document.

Already established and unchanged:

- PDPC registration has **not** been completed.
- H-129 remains the PDPC registration readiness pack; this document does not mark PDPC complete, exempt, or unnecessary.
- Legal Counsel L-01 remains an adopted **rule** in prior records (confirm actual PDPC status before Production personal-data processing **if PDPA applies**). This document does not weaken that rule and does not determine whether PDPA applies.

Do **not** read this boundary as:

```text
SEDMC does not need PDPC registration.
```

That statement is **not** made here.

---

## 12. What this document does NOT establish

This document does **not** establish:

- that SEDMC is legally exempt from PDPC registration;
- that PDPA / PDPC rules do not apply to SEDMC’s wider operations;
- legal advice or a regulator determination;
- PDPC registration, filing, certificate, or approval;
- Production authorization or Production readiness;
- hosting provider, cloud region, or Production architecture;
- privacy certification or security certification;
- that current application code has been audited or remediated to this boundary;
- a change to BRELA evidence (H-128) or TIN evidence (`h-131-tin-certificate-evidence-reconciliation.md`);
- H-80 exit, H-81 start, or EOS operational adoption;
- a new commercial system of record inside EOS.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```

---

## 13. Future change-control requirement

Any future proposal to introduce any of the following **requires a new governance / privacy review before implementation**:

- personal-data collection, processing, or storage in EOS;
- attachments containing personal data;
- email ingestion;
- WhatsApp ingestion;
- CRM contact records (individual names, personal emails, personal telephone numbers);
- employee records;
- traveller / delegate identity records;
- passport, national-ID, health, biometric, or individual payment data;
- pseudonymous personal identifiers treated as a privacy architecture;
- any similar functionality that would make EOS a system of record, in whole or in part, for information identifying a natural person.

Until that review exists and is accepted by the Owner (and, where applicable, legal/regulatory advice), such functionality is **not authorized**.

This increment performs **no subsequent implementation action**.

---

## 14. Ambiguity reserved for Owner / legal / regulatory determination

The following remain **outside** this repository action:

1. Whether SEDMC’s wider processing of personal data (email, WhatsApp, spreadsheets, HR, traveller handling, payments) requires PDPC registration — **separate regulatory/legal determination**.
2. Whether any existing ungoverned application surface already stores personal data and, if so, what remediation is required — **separate review**; not performed here.
3. Lawful basis, retention schedules, and DPO regulator-facing evidence for any **future** personal-data design — **not specified here**.

Cursor / EOS governance must **not** guess these outcomes.

---

## 15. Production and next action

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```

No PDPC submission. No implementation. No commit. No push.

Next implementation work, if any, is **not** automatic and must respect §13.
