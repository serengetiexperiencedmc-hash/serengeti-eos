# H-156 — POA Authorization for PDPC Requirements Confirmation

> **GOVERNANCE / AUTHORIZATION ONLY**  
> Records a POA decision authorizing the Owner or authorized representative to **confirm current PDPC registration requirements** on the official live PDPC channel, before any application is prepared or submitted.  
> **NOT** PDPC registration. **NOT** PDPC contact by Cursor. **NOT** document upload. **NOT** exemption, compliance, or legal clearance. **NOT** Production authorization.  
> Prior records H-129 through H-155, H-142, H-145, and H-146 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved — no reset, clean, stash, revert, discard, or overwrite)  
**Porcelain at start of this increment:** 650  
**Porcelain after this increment:** 651 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**External PDPC contact this increment:** **NONE**  
**Commit / push:** **NONE**  
**H-157:** **NOT CREATED**

```text
H-156 STATUS = COMPLETE — REQUIREMENTS-CONFIRMATION AUTHORIZED, NOT EXECUTED
PDPC = OPEN
EI-03 = NEXT EXTERNAL ACTION
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
EI-01 = CLOSED BY OWNER ACCEPTANCE (not independently TRA-verified)
ADR-0006 OPEN
DP-0006 OPEN
```

---

## A. Sources read (not overwritten)

| Record | Actual file |
| --- | --- |
| H-129 | `docs/governance/h-129-pdpc-registration-readiness-pack.md` |
| H-130 | `docs/governance/h-130-external-evidence-intake-register.md` |
| H-142 | `docs/governance/h-142-residual-privacy-findings-owner-decision-register.md` |
| H-145 | `docs/governance/h-145-owner-decision-authorization.md` |
| H-146 | `docs/governance/h-146-residual-privacy-findings-closure-assessment.md` |
| H-154 | `docs/governance/h-154-production-readiness-closure-plan.md` |
| H-155 | `docs/governance/h-155-ei-01-owner-acceptance-and-pdpc-readiness-gate.md` |

H-155 identified this confirmation as the **single next executable action** (EI-03 / H-129 outstanding item 4) and recorded that Cursor cannot perform it. This increment authorizes the **Owner/authorized-representative** action. It does **not** execute that action.

Catalogued official PDPC process pointers already on record (H-129) — **not** a captured live form:

- EA-02 registration service page: `https://pdpc.go.tz/services/registration/`
- EA-01 Act page and EA-04 regulations page (URLs catalogued; body text **not** stored in-repo)

```text
AUTHORITATIVE PDPC REQUIREMENT SOURCE NOT PRESENT IN REPOSITORY — EXTERNAL VERIFICATION REQUIRED
```

No answers to the §C questions are invented from those URLs or from H-126’s paraphrase of public guidance.

---

## B. Authorization (POA)

The Owner has exercised POA and authorizes the next governance action in the company’s best interests.

```text
POA DECISION (H-156):
The company authorizes an external Owner/authorized-representative
action to confirm the current PDPC registration requirements through
the official live PDPC channel before preparing or submitting a
registration application.

The purpose is to establish accurate current requirements, not to
claim registration, exemption, compliance, or legal clearance.
```

| Field | Record |
| --- | --- |
| Authority | Owner-granted POA, exercised for Serengeti Experience DMC |
| What is authorized | Requirements-confirmation **preparation** (this record) and **external confirmation** by the Owner or authorized representative on the official live PDPC channel |
| What is **not** authorized | PDPC application submission; Cursor contact or impersonation of PDPC; document upload; controller/processor selection without confirmed factual and regulatory basis; automatic registration after confirmation |
| Who may confirm | Owner / authorized representative — **not** Cursor |
| Official channel | The live PDPC registration process. Catalogued starting pointer: `https://pdpc.go.tz/services/registration/`. Live fields and attachments must be confirmed on that channel, not inferred from this repository |

The company shall **not**, in this action:

- submit a PDPC registration application;
- contact or impersonate PDPC through Cursor;
- upload company documents;
- select controller or processor status without confirmed factual and regulatory basis;
- claim that EOS privacy-by-design eliminates SEDMC’s broader regulatory obligations;
- treat internal readiness preparation as PDPC registration or compliance;
- treat the accepted TRA certificate as independently verified;
- close PDPC, E1-C, or Production legal/privacy gates.

Four distinctions remain in force (H-145 / H-155):

| Layer | Not collapsed with PDPC confirmation |
| --- | --- |
| EOS privacy-by-design | EOS is not intended to be a personal-data system of record (H-142/H-145/H-146). That does **not** eliminate SEDMC operational or PDPC questions. |
| SEDMC operational processing | Office / Excel / Outlook-Gmail / WhatsApp / phone remains the commercial SoR. |
| PDPC regulatory readiness | **OPEN.** This authorization prepares confirmation only. |
| Production legal/privacy readiness | **NOT READY.** H-154 blocker 18 remains OPEN. |

---

## C. Questions for the official PDPC channel

To be asked by the Owner or authorized representative on the **official live PDPC channel**. **Do not invent answers.** Blank cells remain blank until official confirmation is recorded under §D.

The questions are factual. They do not assert that SEDMC must register, is exempt, or is a controller or processor.

| # | Question |
| ---: | --- |
| Q-01 | What is the **current** registration application process for a Tanzanian private business that may collect or process personal data (steps, portal, and any in-person or other official method)? |
| Q-02 | On the facts of Makundi Serengeti Experience DMC’s operations, should the business register as a **data controller**, a **data processor**, both, or another category the Commission currently uses? **Do not select a category in this repository.** |
| Q-03 | What are the **current required application fields** (identity, contact, DPO, processing description, and any others shown on the live form)? |
| Q-04 | What **attachments** does the current process require? |
| Q-05 | What **BRELA** documentation is required (extract, certificate, registration number evidence, or other), and what currency/date of extract is accepted? |
| Q-06 | What **TIN** documentation is required (certificate, identifier only, or other)? |
| Q-07 | Are **audited financial statements** required for this applicant type, optional, or required only in specified cases? If conditional, what is the condition? |
| Q-08 | What **DPO appointment and introduction-letter** evidence does the current process require (internal minute, wet-ink letter, named individual, qualifications, or other)? |
| Q-09 | How is **DPO notification / introduction** completed on the current channel (in-form identification, separate filing, or other)? |
| Q-10 | Does the current process require a **privacy notice**, data-processing description, records of processing, or other supporting privacy documentation? If yes, what form and content? |
| Q-11 | Do **separate certificates or classifications** apply (controller vs processor certificates, sector classes, or other)? |
| Q-12 | What are the **current fees** and the **official payment process**? |
| Q-13 | What **evidence is issued after successful registration** (certificate, registration number, portal confirmation, or other), and how should it be retained? |
| Q-14 | Are there any **current transition, enforcement, or deadline** requirements that apply to this applicant? |
| Q-15 | If facts or classification are uncertain, what is the **official method for obtaining written clarification** (helpdesk, written enquiry, published guidance, or other official route)? |

No answer to Q-01–Q-15 is recorded in this increment.

H-126’s paraphrase of public guidance (BRELA, TIN, audited financial documentation, DPO identification among process notes) remains a **secondary governance note**, not a substitute for live confirmation (H-129).

---

## D. Evidence intake structure (blank — do not fabricate)

Use this checklist **after** official confirmation. Every field below is **empty** in H-156. Filling a field later does **not** close PDPC until H-130/H-129 closure tests and a **separate** governance decision (§F) are met.

Do **not** paste the full TIN, secrets, or scanned certificates into Git. Record status, date, official channel, and a controlled external location only.

| Intake field | Recorded value (H-156) |
| --- | --- |
| Date and time of confirmation | *not yet recorded* |
| Official PDPC channel used (exact URL, office, or correspondence reference) | *not yet recorded* |
| Name or designation of responding official, if available | *not yet recorded* |
| Exact requirements communicated | *not yet recorded* |
| Documents confirmed as **mandatory** | *not yet recorded* |
| Documents confirmed as **conditional** (with the stated condition) | *not yet recorded* |
| Classification guidance (controller / processor / other — official wording only) | *not yet recorded* |
| Fees and payment information | *not yet recorded* |
| Written confirmation or official reference (ticket, letter, screenshot location **outside** Git) | *not yet recorded* |
| Outstanding ambiguities | *not yet recorded* |
| Follow-up actions | *not yet recorded* |
| Responsible person for follow-up | *not yet recorded* |

Map official answers onto existing intake IDs when evidence actually exists:

| ID | What to update later (not now) |
| --- | --- |
| EI-03 | Current PDPC registration requirements — this confirmation |
| EI-02 | Audited financial report, **if** the live process requires it |
| EI-08 | Distinct DPO appointment letter, **if** required beyond H-125 |
| EI-09 / EI-10 | Privacy / data-processing documentation the live process requires |
| EI-04 / EI-05 | Application submission and issued registration evidence — **only after** a later decision to register |

H-130 is **not** rewritten in this increment.

---

## E. Current status (preserved)

| Item | Status after H-156 |
| --- | --- |
| PDPC registration | **OPEN** — not completed; not claimed |
| OA-05 | **OPEN** — authoritative PDPC status evidence still required |
| OA-06 | **MIXED** — internal DPO appointment recorded; regulator component OPEN |
| EI-01 | **CLOSED BY OWNER ACCEPTANCE** (H-155) — **not** independently TRA-verified |
| EI-02 | **CONDITIONAL / OPEN** — audited financials if the live process requires them |
| EI-03 | **NEXT EXTERNAL ACTION** — authorized here; **not executed** |
| EI-04–EI-05 | **OPEN** — application not started; certificate not issued |
| EI-08 | **CONDITIONAL / OPEN** — distinct DPO letter if the live process requires it |
| EI-09–EI-10 | **OPEN** — pending live requirements |
| EI-16 | **BLOCKED ON HOSTING/PROVIDER DECISION** — ADR-0006 / DP-0006 OPEN |
| H-154 blocker 18 | **OPEN** — PDPC, DPO combined close, DPAs |
| Production | **NOT AUTHORIZED / NOT READY** |
| `productionReady` | `false` |
| ADR-0006 | **OPEN** |
| DP-0006 | **OPEN** |
| Current-code UAT | ACCEPTED WITH DOCUMENTED LIMITATIONS (unchanged) |
| Commercial SoR | Office / Excel / Outlook-Gmail / WhatsApp / phone |

H-142/H-145/H-146 residual privacy dispositions remain Dev/Test privacy-engineering evidence. They do **not** close PDPC.

H-154 named inventory remains **28** rows. Item 28 stays **CLOSED BY OWNER ACCEPTANCE**. Items 1–26 stay **OPEN**. Item 27 stays **SATISFIED AS UAT EVIDENCE ONLY**. No additional Production blocker is closed by this authorization.

---

## F. Next-step boundary

Official requirements confirmation, once obtained by the Owner or authorized representative, is **intake**, not registration and not gate closure.

A **separate** subsequent governance decision will be required to:

1. Determine the appropriate registration path (including any official classification guidance — not selected here).
2. Review the required evidence against documents already held (2025 BRELA extract; Owner-accepted TIN certificate with recorded limitations; internal DPO appointment of Wensley Shirima; gaps for audited financials, distinct DPO letter, and privacy documentation as the live process may require).
3. Approve preparation of any documents.
4. Decide whether to **initiate** registration.
5. Record resulting official PDPC evidence (EI-04 / EI-05) if and when issued.

```text
H-156 DOES NOT AUTHORIZE REGISTRATION AUTOMATICALLY.
H-157 IS NOT CREATED.
```

Cursor must **not** contact PDPC, upload documents, or begin registration from this repository.

Remaining dependencies after this authorization (not executed here):

1. External EI-03 confirmation on the live PDPC channel (Owner / authorized representative).
2. Separate decision on registration path and document preparation.
3. OA-05 PDPC status evidence or authoritative written determination.
4. OA-06 regulator-facing DPO component as applicable.
5. EI-16 DPAs after a hosting/provider decision (ADR-0006 / DP-0006).
6. Remaining H-154 Production blockers 1–26.

---

## G. Explicitly excluded (not performed)

```text
H-157: NOT CREATED
PDPC contact by Cursor: NONE
PDPC registration / application / upload: NOT PERFORMED
controller / processor status: NOT SELECTED
PDPC exemption / compliance / legal clearance: NOT CLAIMED
TRA independent verification: NOT CLAIMED
H-129–H-155 overwritten: NO
application / schema / infrastructure: UNCHANGED
migration 126 / live migration: NONE
commit / push: NONE
```

---

## H. Repository safety (this increment)

| Check | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Application / schema / infrastructure | **NONE** |
| Migration 126 / live migration | **NONE** |
| External PDPC contact | **NONE** |
| Documents uploaded | **NONE** |
| Prior H-129–H-155 / H-142 / H-145 / H-146 modified | **NONE** |
| Porcelain | 650 → 651 |
| Files created | `docs/governance/h-156-pdpc-requirements-confirmation-authorization.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
PROCESS STOPPED AFTER H-156
```
