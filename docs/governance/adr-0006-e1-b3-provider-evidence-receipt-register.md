# E1-B3 — Provider Evidence Receipt Register (blank)

> **`BLANK CONTROLLED REGISTER`**  
> **`NO PROVIDER RESPONSE RECEIVED`**  
> **`DO NOT POPULATE PROVIDER-SPECIFIC VALUES IN THIS MASTER COPY`**  
> **`A RECEIPT ID IS AN OBJECT REFERENCE ONLY — NOT VERIFIED / ACCEPTED / COMPLIANT / SUITABLE / PREFERRED / SELECTED`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`E1-B3 FRAMEWORK PREPARED — NO PROVIDER RESPONSE RECEIVED`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Repository calendar date of this blank register:** 2026-09-16.

**Does not duplicate:** frozen 168-question RFI/RFQ; PE-01–PE-48 text; evaluation methodology.  
**Complements:** [`adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md`](adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md) · [`adr-0006-e1-b3-provider-response-intake-template.md`](adr-0006-e1-b3-provider-response-intake-template.md) · [`adr-0006-e1-b3-provider-evidence-id-convention.md`](adr-0006-e1-b3-provider-evidence-id-convention.md) · [`adr-0006-e1-b3-provider-evidence-chain-of-custody.md`](adr-0006-e1-b3-provider-evidence-chain-of-custody.md)

One **row per received file or discrete artefact** within a transmission. One transmission may produce several rows sharing a Receipt ID. Do **not** invent rows.

Questionnaire version (when a real row is later filled): frozen E1-B RFI/RFQ — 168 questions.  
Evidence-package version: frozen PE-01–PE-48.

---

## Register (empty)

| Receipt ID | Provider identifier | Submission date/time | Received by | Transmission channel | Response version | Questionnaire version | Evidence-package version | File/document name | File type | File size | SHA-256/hash where available | Source | Confidentiality/classification | Claimed scope | Actual scope | Related Q-ID(s) | Related PE-ID(s) | Evidence category | Chain-of-custody notes | Integrity check | Intake status | Reviewer | Review date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | | | | | | | | | | | | | | | | | |

**Row count:** 0.

---

## Field rules (when a genuine submission later exists)

| Field | Rule |
| --- | --- |
| Receipt ID | `RCPT-nnn` per ID convention. Object reference only. |
| Provider identifier | As stated on the submission. Filing label only — **not** selection. |
| Submission date/time | As received or as stated; timezone recorded. Do not invent. |
| Received by | Human who took custody. Do not fabricate. |
| Transmission channel | e.g. email, portal, courier, in-person — as fact. This register is **not** itself a send. |
| Response version | Provider’s version if any; else record “unstated”. |
| Questionnaire version | Frozen E1-B 168-question pack. |
| Evidence-package version | Frozen PE-01–PE-48. |
| File/document name | **Original** filename preserved. |
| File type | As received. |
| File size | If known; else blank. |
| SHA-256/hash | If technically calculated; else blank — do not invent a hash. |
| Source | Sender as identified on the transmission. |
| Confidentiality/classification | Only if the source or a governing agreement states it. Else **UNSTATED**. |
| Claimed scope | What the sender says the file covers. |
| Actual scope | What the file actually contains after inspection — factual, not a score. |
| Related Q-ID(s) | Frozen Q-IDs; blank if not yet mapped. |
| Related PE-ID(s) | Frozen PE-IDs; blank if not yet mapped. |
| Evidence category | Align to framework claim class / hierarchy rank — not a ranking of the provider. |
| Chain-of-custody notes | Pointer to custody log; original vs working copy. |
| Integrity check | PASS / FAIL / NOT PERFORMED — of **file integrity**, not provider suitability. |
| Intake status | `NOT RECEIVED` (master) · after a real row: `RECEIVED — NOT VERIFIED` until a separate verification step. |
| Reviewer / Review date | Blank until a human reviews. Review ≠ verification ≠ selection. |
| Notes | Factual. No recommendation language. |

**Evidence category** (when used) may be: original submission · accompanying document · clarification · corrected response · supplementary evidence · replacement document · working copy (derived). Not: verified, accepted, compliant, suitable, preferred, selected.

**Intake status must not be VERIFIED** solely because a row exists.

---

## Current state

No receipt recorded. No file inventoried. No hash recorded. No provider identified for engagement in this register.

This register does **not** send the RFI/RFQ, contact a provider, approve ADR-0006 or DP-0006, or authorize UAT, Production, migration, deployment, or contracting.
