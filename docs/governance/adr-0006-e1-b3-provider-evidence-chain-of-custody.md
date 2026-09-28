# E1-B3 — Provider Evidence Chain of Custody

> **`PROCEDURE FOR FUTURE ACTUAL SUBMISSIONS`**  
> **`NO PROVIDER RESPONSE RECEIVED`**  
> **`DO NOT EXECUTE AGAINST FICTITIOUS EVIDENCE`**  
> **`RECEIVED ≠ VERIFIED`** · **`PROVIDER ASSERTION ≠ INDEPENDENTLY VERIFIED FACT`**  
> **`ORIGINAL SUBMISSION IS IMMUTABLE IN THE GOVERNANCE EVIDENCE CHAIN`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`Provider UNSELECTED`** · **`Architecture UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.  
**Repository calendar date:** 2026-09-16.

**Companions:** [`adr-0006-e1-b3-provider-evidence-receipt-register.md`](adr-0006-e1-b3-provider-evidence-receipt-register.md) · [`adr-0006-e1-b3-provider-evidence-id-convention.md`](adr-0006-e1-b3-provider-evidence-id-convention.md) · [`adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md`](adr-0006-e1-b3-candidate-provider-evidence-evaluation-framework.md) · [`adr-0006-e1-b3-provider-response-intake-template.md`](adr-0006-e1-b3-provider-response-intake-template.md) · [`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md)

This procedure is **not** a send of the RFI/RFQ, not a vendor contact, not contracting, and not Production authorization. It is executed **only** when a genuine submission arrives.

---

## 1. Purpose

Preserve original provider material, assign object-reference identifiers, and keep an auditable link from every later finding to source evidence — without altering originals, silently resolving contradictions, or treating receipt as verification.

---

## 2. Receive-and-preserve procedure

Execute **in order** when (and only when) an actual response exists.

| Step | Action |
| --- | --- |
| 1 | Receive the actual response. Do not invent one. |
| 2 | Preserve the **original** submission (complete transmission: body, attachments, headers if email, envelope metadata if physical). |
| 3 | Assign a receipt identifier `RCPT-nnn` and, for a new logical package, `SUB-nnn` (ID convention). Identifiers mean **received / object reference only**. |
| 4 | Record receipt metadata in the blank receipt register (one row per file/artefact). |
| 5 | Calculate a hash (SHA-256 where technically possible). If hashing is not possible, record **NOT PERFORMED** — do not invent a hash. |
| 6 | Preserve the **original filename**. Do not rename the original object. |
| 7 | Record **all** accompanying documents, including items the sender treats as incidental. |
| 8 | Record questionnaire version (frozen E1-B, 168 questions) and evidence-package version (PE-01–PE-48). |
| 9 | Map evidence to Q-ID and/or PE-ID on the intake copy. Mapping is factual coverage, not a score. Unmapped is allowed and recorded as unmapped. |
| 10 | Do **not** alter original evidence. |
| 11 | Create **working copies** only where necessary (`WC-EV-SUB-nnn-mmm-k`). Review on copies, not on the original. |
| 12 | Record every transformation or extraction (what was copied, converted, redacted for a summary, or excerpted). |
| 13 | Record reviewer and date on the register. Reviewer ≠ attestor of verification or selection. |
| 14 | Record **verification status separately from receipt**. Default after receipt: **RECEIVED** / **RECEIVED — NOT VERIFIED**. Never auto-promote to **VERIFIED**. |
| 15 | Record clarifications **separately** (`CL-nn` and, when a clarification **response** arrives, a **new** `RCPT`). Do not edit the original response to insert the clarification. |
| 16 | Preserve contradictory evidence. Record `CX-nn`. Do **not** silently drop, overwrite, or “clean” a conflict. |
| 17 | Maintain an auditable link from every evaluation finding (`FN-nn`) to its source evidence (`EV-SUB-nnn-mmm`) or mark the finding as an internal observation (see §6). |

This session does **not** perform steps 1–17 against any file. No original exists.

---

## 3. RECEIVED versus VERIFIED

| Term | Meaning |
| --- | --- |
| **RECEIVED** | An object is in custody and registered. Integrity check, if done, is about **file** integrity (hash/completeness), not suitability. |
| **VERIFIED** | A later governed verification step has independently assessed a **stated fact**. Forbidden until that step actually occurs. |

Receipt, hash PASS, and reviewer sign-off of **intake completeness** do **not** equal VERIFIED.

---

## 4. PROVIDER ASSERTION versus INDEPENDENTLY VERIFIED FACT

Aligns to the evaluation framework claim classes.

| Term | Meaning |
| --- | --- |
| **PROVIDER ASSERTION** | Statement in a response, cover email, or marketing without (or beyond) supporting artefact. Status **ASSERTED**. |
| **DOCUMENTARY EVIDENCE** | Artefact supplied by the provider. Status **DOCUMENTED** — still not independently verified. |
| **INDEPENDENTLY VERIFIED FACT** | Checked against an independent source or a later governed verification step. Status **VERIFIED** or **PARTIALLY VERIFIED**. |

A signed provider letter is still a **provider** artefact (hierarchy rank 1–2). It is not automatically an independently verified fact. A certificate is not SEDMC compliance. Legal Counsel attestation already on file is **not** verification of a provider claim.

---

## 5. Evidence immutability

The **original provider submission is immutable** within the governance evidence chain.

If corrections or clarifications are later received:

- **retain** the original (`EV-SUB-nnn-mmm` unchanged);  
- create a **new receipt record** (`RCPT-nnn+`);  
- **reference** the prior submission (`SUB` link; `clarifies` / `corrects` / `supplements` / `replaces` as a **relationship**, not a delete);  
- record **what changed**;  
- **do not overwrite** historical evidence.

A “replacement document” from the provider is a **new** evidence object. The superseded object remains in the chain with status that it was **superseded as a later provider statement**, not erased.

Working copies may be discarded only if the original remains and the transformation log remains. Prefer retaining working copies that were used to support a finding.

---

## 6. Provenance of findings

Every future evaluation finding requires:

| Field | Required |
| --- | --- |
| Finding ID | `FN-nn` |
| Q-ID / PE-ID | Frozen IDs, or explicit “none — internal” |
| Provider statement | Quote or precise paraphrase, or “none” |
| Evidence reference | `EV-SUB-nnn-mmm` and/or `RCPT-nnn` |
| Evidence location | File/document name, section/page/URL if applicable |
| Verification status | Framework §H |
| Evaluator observation | Factual; not a score or recommendation |
| Clarification status | `CL-nn` or none |
| Conclusion limited to the evidence available | Must not exceed the artefacts cited |

**No finding may exist without traceable source evidence** unless explicitly marked:

**INTERNAL GOVERNANCE OBSERVATION — NOT PROVIDER EVIDENCE**

That mark is for evaluator process notes, gap classification, or pointers to **internal** SEDMC governance (e.g. ADR-0006 remains OPEN). It must not be written as if it were a provider fact.

---

## 7. Confidentiality

Do **not** assume a submission is public, confidential, commercially sensitive, or legally privileged **unless** the source or a governing agreement establishes that status. Default: **UNSTATED**.

| Rule | Application |
| --- | --- |
| Record the sender’s marking if present | Copy the marking into the register field; do not upgrade it. |
| Unmarked material | Classification **UNSTATED** — handle as internally restricted by default **without** claiming legal privilege. |
| Governance summaries | Do **not** reproduce unnecessary confidential material. Cite `EV-SUB-nnn-mmm` + location instead of pasting secrets, personal data, or full contract text. |
| Personal data in an RFI response | Disclose onward only as strictly necessary for the RFI evidence process (E1-B authorization limit). No Production data is to be in this chain. |
| This procedure | Does not create an NDA and does not waive one. |

---

## 8. Response version control

| Kind | How to record |
| --- | --- |
| Initial response | New `SUB-nnn` + `RCPT-nnn` + `EV-SUB-nnn-mmm` |
| Revised response | New `RCPT`; new `EV-SUB` objects; link `revises` prior `SUB` or same `SUB` as a new version sequence — **keep** prior objects |
| Clarification | `CL-nn` outbound (when a human later sends it); inbound answer = new `RCPT` + new `EV-SUB` linked `clarifies` |
| Corrected response | Same as revised: new objects; original retained; record the stated correction |
| Supplementary evidence | New `RCPT` + new `EV-SUB`; relationship `supplements` |
| Replacement document | New `EV-SUB`; relationship `replaces` / `replaced-by`; **never delete** the replaced object |

**Never delete or overwrite a prior provider submission.**

Version labels (`v1`, `v2`) are metadata on the submission, not a quality rank.

---

## 9. Evidence-gap protection

**Absence of evidence is not evidence of provider non-compliance.**

Classify absence as:

- **NOT RECEIVED**, or  
- **REQUIRES CLARIFICATION**

unless **authoritative evidence** establishes otherwise (e.g. the provider explicitly states a component is not offered, with justification → `NOT APPLICABLE — PROVIDER JUSTIFICATION REQUIRED`).

Similarly:

**A provider assertion is not automatically treated as verified fact.**

Do not treat empty PE rows as a score. Gap class (critical / material / minor) describes **evidence-file readiness**, not provider rank (framework §I).

---

## 10. What this procedure does not authorize

It does not: select, rank, score, shortlist, or recommend a provider or architecture; approve ADR-0006 or DP-0006; appoint a DPO; verify PDPC; authorize contracting, infrastructure, UAT, migration, deployment, or Production; send email; create vendor accounts.

**Current execution state:** not started. No original to preserve. No working copy. No finding.

**Exact next trigger:** Receipt of the first genuine provider response. Preserve the original response, register its receipt, assign evidence identifiers, and begin E1-B3 evidence intake. Do not evaluate beyond the evidence actually supplied.
