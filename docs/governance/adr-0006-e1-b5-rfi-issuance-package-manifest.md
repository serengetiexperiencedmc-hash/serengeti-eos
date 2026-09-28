# E1-B5 — RFI Issuance Package Manifest

> **`E1-B5 ISSUANCE PACKAGE PREPARED — NOT SENT`**  
> **`PACKAGE READY ≠ SENT`**  
> **`FROZEN MATERIALS IDENTIFIED — NOT MODIFIED`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**

**Repository calendar date:** 2026-09-16.  
**Issuance package version:** `E1-B5-ISSUANCE-PACKAGE`  
**SHA-256 computed:** 2026-09-16 (this session), of the frozen files as they existed on disk. Hashes identify the files; they do **not** mean verified provider evidence or a completed send.

External transmission of this pack is **authorized as an information-gathering activity** by [`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md). **Actual send has not occurred.**

This manifest does **not** modify the listed files.

---

## 1. Items intended for external transmission

### Item 1 — Provider-neutral RFI/RFQ questionnaire

| Field | Value |
| --- | --- |
| Filename | `docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md` |
| Purpose | Frozen 168-question provider-neutral questionnaire |
| Version/status | Frozen E1-B pack; 168 questions |
| Immutable/frozen status | **FROZEN** — not modified by E1-B5 |
| Intended recipient use | Answer identically for classes A–D using the standard response template |
| External transmission authorized? | **Yes — information gathering only** (E1-B authorization). **Not sent.** |
| SHA-256 | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |

### Item 2 — Provider evidence requirements PE-01–PE-48

| Field | Value |
| --- | --- |
| Filename | `docs/governance/adr-0006-e1-b-provider-evidence-requirements.md` |
| Purpose | Frozen PE-01–PE-48 evidence checklist |
| Version/status | Frozen; 48 requirements; item statuses in that file remain pack-preparation snapshot |
| Immutable/frozen status | **FROZEN** — not modified by E1-B5 |
| Intended recipient use | Supply evidence mapped to PE-IDs |
| External transmission authorized? | **Yes — information gathering only.** **Not sent.** |
| SHA-256 | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |

### Item 3 — Standard provider response template

| Field | Value |
| --- | --- |
| Filename | `docs/governance/adr-0006-e1-b-standard-provider-response-template.md` |
| Purpose | Comparable blank response form (no scoring) |
| Version/status | Frozen; 168 question slots |
| Immutable/frozen status | **FROZEN** — not modified by E1-B5 |
| Intended recipient use | Complete one copy; do not score or rank |
| External transmission authorized? | **Yes — information gathering only.** **Not sent.** |
| SHA-256 | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

### Item 4 — Required transmittal language

| Field | Value |
| --- | --- |
| Filename (source of required sentence) | `docs/governance/adr-0006-e1-b-external-issuance-authorization.md` §7 |
| Filename (issuance cover to use) | `docs/governance/adr-0006-e1-b5-rfi-transmittal-template.md` |
| Purpose | Mandatory information-gathering disclaimer on any later send |
| Version/status | Sentence **unchanged** from E1-B authorization |
| Immutable/frozen status | **Required sentence frozen in meaning and wording** |
| Intended recipient use | Read as the legal/commercial character of the request |
| External transmission authorized? | Cover **must** accompany any later send. Cover itself is **not sent** in this session. |
| SHA-256 (authorization file containing the sentence) | `E6D95493F10BE5D1F0F09553AD96F258A33D184E1382AB6EF1A82082F8EF7EEE` |

**Exact required sentence (verified present in authorization §7):**

RFI/RFQ issuance is an information-gathering and market-evidence activity only; responses will be subject to a separate governed evaluation and do not constitute provider or architecture selection, contracting, Production approval, or deployment authorization.

### Item 5 — Response submission instructions (already present)

| Field | Value |
| --- | --- |
| Filename | Same as Item 1 § “How to complete (later)” and Item 3 (standard fields) |
| Purpose | Instruct how to complete answers, evidence references, and statuses |
| Version/status | Already in frozen pack; no separate instruction file created |
| Immutable/frozen status | **FROZEN** (in Items 1 and 3) |
| Intended recipient use | Follow the template fields; N/A with reason where a component is not offered |
| External transmission authorized? | Travels with Items 1 and 3. **Not sent.** |
| SHA-256 | Covered by Item 1 and Item 3 hashes |

No additional submission-instruction file is invented. Recipients are **not** directed to a fabricated portal or email.

---

## 2. Accompanying governance (not necessarily attached to a candidate)

These govern issuance; a human issuer **need not** attach all of them externally:

| File | Attach to candidate? |
| --- | --- |
| Issuance authorization | Optional internally; the **required sentence** must appear on the cover |
| E1-B4 candidate universe | **No** (internal) |
| E1-B3 evaluation framework | **No** by default (internal). Cover states responses are evaluated separately. |
| This manifest | Internal control |
| Issuance control register | Internal control |
| Submission checklist | Internal pre-send control |

---

## 3. Current state

**PACKAGE READY / NOT SENT**

Identifying files in this manifest is **not** external issuance.
