# E1 — Human Closure Decision Pack (BCM, DPO, RFI Sender, Outstanding Evidence)

> **`PREPARATION PACK — ADDITIVE OWNER-DECISION CURRENT STATUS IN §10`**  
> **`NO FORMAL HUMAN DECISION WAS RECORDED BY CREATING THIS PACK`** *(original; later owner instrument exists — see §10)*  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`DPO = OWNER-DESIGNATED (WENSLEY SHIRIMA); FORMAL APPOINTMENT EVIDENCE REQUIRED`** · **`HUM-03 company decision = CLOSED; appointment evidence REQUIRED`**  
> **`CD-01 = CLOSED / FORMALLY CONFIRMED (S2)`** · **`HUM-07 = CLOSED / FORMALLY CONFIRMED`**  
> **`BCM S2 = FORMALLY CONFIRMED`** (no longer merely provisional)  
> **`E1-B = 9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD / 0 TRANSMISSIONS`**  
> **`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**  
> **`NAMED SENDER = PATRICK MAKUNDI; SEND CONFIRMED; NOT YET TRANSMITTED`**  
> **`E1 = NOT APPROVED / BLOCKED`** · **`E1-D = OPEN`**  
> **`NO PROVIDER SELECTED`** · **`NO PRODUCTION GEOGRAPHY SELECTED`**  
> **`NO PRODUCTION / UAT / MIGRATION / DEPLOYMENT AUTHORIZATION`**

**Date of pack creation:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` on `master`.  
**Latest consistency audit:** [`adr-0006-e1-governance-consistency-audit.md`](adr-0006-e1-governance-consistency-audit.md) — verdict **`PASS WITH NON-BLOCKING FINDINGS`**.

Companion session artefacts (created with this pack; none close HUM items):

| Artefact | Path |
| --- | --- |
| Decision form (fill in session) | [`adr-0006-e1-human-closure-decision-form.md`](adr-0006-e1-human-closure-decision-form.md) |
| Session agenda | [`adr-0006-e1-human-closure-session-agenda.md`](adr-0006-e1-human-closure-session-agenda.md) |
| Existing capture form | [`adr-0006-e1-human-input-capture-form.md`](adr-0006-e1-human-input-capture-form.md) |
| Existing session checklist | [`adr-0006-e1-human-closure-session-checklist.md`](adr-0006-e1-human-closure-session-checklist.md) |

This pack makes remaining human actions **clear and executable**. It does **not** complete those actions. Do not treat a blank field, a provisional direction, or the existence of this file as `CONFIRMED`, `VERIFIED`, or `CLOSED`.

---

## 0. How to use this pack

| Kind | Meaning | Present in this pack as |
| --- | --- | --- |
| **Provisional direction** | Working company instruction pending formal confirmation | BCM S2; RFI issuance in principle; proposed DPO/privacy-lead |
| **Recommendation / proposed direction** | Intent without appointment or approval | DPO/privacy-lead designation |
| **Formal decision** | Named owner, date, and instrument | **NOT ESTABLISHED** for CD-01 / HUM-03 / HUM-07 / HUM-11 send |
| **Human attestation** | Existing Legal Counsel attestation only | THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N. |
| **External evidence** | Registry, PDPC, provider replies | **Not present** |

**Session outcome vocabulary** (use on the decision form; **do not prepopulate formal outcomes as CONFIRMED**):

`CONFIRMED` · `REPLACED` · `DEFERRED` · `NOT ESTABLISHED` · `EVIDENCE REQUIRED` · `NOT APPLICABLE`

Creating this pack does **not** change HUM-01–HUM-15 statuses.

---

## 1. Sources reviewed (not rewritten)

- [`adr-0006-e1-human-input-capture-form.md`](adr-0006-e1-human-input-capture-form.md)  
- [`adr-0006-e1-human-closure-session-checklist.md`](adr-0006-e1-human-closure-session-checklist.md)  
- [`adr-0006-e1-next-action-dependency-register.md`](adr-0006-e1-next-action-dependency-register.md)  
- [`adr-0006-e1-c-human-decision-evidence-closure-matrix.md`](adr-0006-e1-c-human-decision-evidence-closure-matrix.md)  
- [`adr-0006-e1-c-human-action-queue.md`](adr-0006-e1-c-human-action-queue.md)  
- [`adr-0006-e1-c-provisional-bcm-direction-record.md`](adr-0006-e1-c-provisional-bcm-direction-record.md)  
- [`adr-0006-e1-c-provisional-dpo-direction-record.md`](adr-0006-e1-c-provisional-dpo-direction-record.md)  
- [`adr-0006-e1-c-interim-role-based-raci.md`](adr-0006-e1-c-interim-role-based-raci.md)  
- [`adr-0006-e1-c-bcm-sequence-decision-record.md`](adr-0006-e1-c-bcm-sequence-decision-record.md)  
- [`adr-0006-e1-b-provisional-issuance-direction-record.md`](adr-0006-e1-b-provisional-issuance-direction-record.md)  
- [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md)  
- [`adr-0006-e1-b-rfi-human-sender-readiness.md`](adr-0006-e1-b-rfi-human-sender-readiness.md)  
- [`adr-0006-e1-governance-consistency-audit.md`](adr-0006-e1-governance-consistency-audit.md)  

Frozen E1-B questionnaire, PE pack, response template, and routing files are **not** modified by this pack.

---

## 2. A. BCM decision

Present **without ranking**. Neither option is selected as the governing sequence by this pack.

### Option S1 (retained)

`Commercial → Finance → Operations → CRM → Procurement/Suppliers`

Programme Building is a **dependency** (depends on Finance and Suppliers), not a numbered step.

### Option S2 (provisional direction only)

`Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers`

Programme Building remains dependent on Finance and Suppliers. Provisional **order** places Programme Building as numbered step 2 and Finance as numbered step 5. That tension is recorded, not erased.

A competent human may instead provide **another documented sequence** in full, with date and owner.

| Field | Current record | Formal session status |
| --- | --- | --- |
| Provisional direction currently recorded | **S2** — [`adr-0006-e1-c-provisional-bcm-direction-record.md`](adr-0006-e1-c-provisional-bcm-direction-record.md) | **PROVISIONAL ONLY** |
| Formal status | CD-01 **OPEN** · HUM-07 **NOT ESTABLISHED** | **OPEN** |
| Decision required | Confirm S2, select S1, or provide another documented sequence | **NOT ESTABLISHED** |
| Named decision-maker | **NOT ESTABLISHED** | **NOT ESTABLISHED** |
| Signature / date | **NOT ESTABLISHED** | **NOT ESTABLISHED** |

**Do not mark CD-01 or HUM-07 closed** on the basis of this pack or the provisional S2 record.

Live pointer (already audited; **not rewritten here**): [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) §1 still prints S2 as a recovery-order baseline under a **DRAFT — NOT AN APPROVAL** header. That is **not** CD-01 closure.

---

## 3. B. DPO / privacy decision

Provide **explicit choices**. Do not infer an appointment from Legal Counsel status, the interim RACI, the application key `dpo`, or the proposed privacy-lead direction.

### Established Legal Counsel (not DPO)

| Field | Value |
| --- | --- |
| Name | **THOMAS NGULUMA** |
| Role | **LEGAL COUNSEL only** |
| Date | **15TH SEPTEMBER 2026** |
| Approval | **A.T.N.** |
| DPO? | **NO** |

No DPO appointment may be inferred. Do **not** convert Thomas Nguluma to DPO.

### Choices for the named human

1. **Appoint** a formally designated DPO (name, title, scope, authority, effective date, and appointment instrument required).  
2. **Document that no DPO is currently appointed** and identify the **interim privacy-responsibility owner** (name or title, scope, and instrument required).  
3. **Defer** the decision with a **documented reason and deadline**.

| Field | Current record |
| --- | --- |
| DPO appointment | **NOT ESTABLISHED** |
| HUM-03 | **OPEN** until supported by appropriate evidence |
| Combined Legal/DPO | **INCOMPLETE** |
| Proposed direction | Designate a qualified DPO or privacy lead through a **formal company decision** — **not** an appointment ([`adr-0006-e1-c-provisional-dpo-direction-record.md`](adr-0006-e1-c-provisional-dpo-direction-record.md)) |
| Interim RACI Privacy named person | **NOT ESTABLISHED** |
| Appointment evidence still required | Name, role scope, authority, effective date, instrument / reference |
| Statutory evidence (HUM-02 PDPC) | **Outstanding** and **separate** from HUM-03 |

HUM-03 remains open until appointment **or** documented non-appointment is supported by evidence. Deferral keeps HUM-03 **OPEN**.

---

## 4. C. RFI sender and recipient

**Operational routing (authoritative):** [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md).

| Set | Count | Members | Transmitted? |
| --- | --- | --- | --- |
| **FULL-RFI** | **9** | CU-01 Africa Data Centres; CU-02 AWS; CU-03 Google Cloud; CU-04 Hetzner; CU-06 Azure; CU-07 Oracle; CU-08 OVHcloud; CU-09 Raxio; CU-12 Wingu | **NO** |
| **SCOPE CLARIFICATION** | **2** | CU-10 SEACOM; CU-11 WIA (E1-B4.6 questions only; **not** the four-document pack) | **NO** |
| **HOLD** | **1** | CU-05 Liquid C2 (receives **nothing**) | **NO** |

**Transmissions: 0.** Acknowledgements: **0.** Provider responses: **0.** Package: **READY / NOT SENT**.

The existing information-gathering-only sentence is **unchanged**:

**`E1-B = EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY`**

This pack does **not** re-authorize, expand, or transmit that issuance.

### Constraints that remain true

- Role mailbox `rfp@serengetiexperiencedmc.com` is **not** a named person.  
- Verified organizational routing does **not** establish a named recipient.  
- No transmission may be represented as completed without evidence.  
- CU-05 remains HOLD. CU-10 / CU-11 remain clarification-only unless a later governed decision changes routing (this pack does **not** change routing).  
- This pack does **not** itself authorize Cursor or any unidentified person to send.

### Fields for a named human to complete (blank until completed on the decision form)

| Field | Current known value |
| --- | --- |
| Named sender | **NOT ESTABLISHED** |
| Sender title | Role recorded: **Reservations Consultant** (not a named person) |
| Sender authority confirmation | **NOT ESTABLISHED** as a named instrument |
| Sending mailbox | `rfp@serengetiexperiencedmc.com` — **role mailbox only** |
| Named recipient person, where available | **NOT ESTABLISHED** for CU-01–CU-12 |
| Recipient organization | Organizational routes **ROUTE VERIFIED** where previously recorded |
| Official route | See capture form Section I / routing reconciliation |
| Date authorized for transmission | Personal send-authorization date **NOT ESTABLISHED** |
| Transmission evidence reference | **NONE** |

---

## 5. D. Human evidence register

Statuses below are **current**. None is `VERIFIED` or `CLOSED`. “Blocks RFI sending” means blocks **actual transmission** of a named send, not the existing information-gathering **authorization**. “Blocks Production approval” means the item is required before Production / Combined Legal-DPO / ops go-live as already mapped — it does **not** imply Production is otherwise close.

| ID | Item | Current status | Required human input | Required evidence | Blocks RFI sending? | Blocks Production approval? | Provider-dependent? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HUM-01 | Entity extract | **NOT ESTABLISHED** / company name **NOT VERIFIED** | Supply registry extract for **Makundi Serengeti Experience DMC**, or documented inability to locate it | BRELA/registry extract, number, office, date as applicable | **No** | **Yes** for verified contracting identity | **No** |
| HUM-02 | PDPC status | **NOT ESTABLISHED** (may **REQUIRES EXTERNAL EVIDENCE**) | Supply company-specific PDPC artefact or documented status; do **not** infer from absence | Certificate, correspondence, or confirmed status artefact | **No** | **Yes** for privacy completeness if required and unknown | **No** for SEDMC-as-customer status (regulator/company files). **Not** a provider-hosting fact |
| HUM-03 | DPO appointment / non-appointment | **NOT ESTABLISHED** · **OPEN** | Choice 1, 2, or 3 in §3. Do **not** name Thomas Nguluma as DPO | Appointment instrument **or** written non-appointment (plus interim owner if choice 2) **or** deferral reason + deadline | **No** | **Yes** for Combined Legal/DPO | **No** |
| HUM-04 | Geography census | **NOT ESTABLISHED** (draft lists ≠ census) | Census of data-subject / offering geography distinct from target-market and destination lists | Internal commercial/ops census artefact | **No** | **Decision-blocking** for Kenya DPA / GDPR / UK GDPR conclusions; required before treating applicability as closed | **No** for the census. Transfer **paths** later **yes** |
| HUM-05 | Current IdP | **NOT ESTABLISHED** | Current corporate IdP **or** documented none. Do **not** select Production IdP here | IT inventory note | **No** | **Yes** (ADR-0013 blocked for Production) | **No** for current-state fact. Hosted Production IdP location **yes** later |
| HUM-07 | BCM confirmation | **NOT ESTABLISHED** · CD-01 **OPEN** · S2 **provisional only** | Confirm S2, select S1, or document another sequence; named owner + date + instrument | Formal decision instrument | **No** | **Decision-blocking** for recovery-priority packaging | **No** |
| HUM-08 | Named RACI | **NOT ESTABLISHED** (interim role structure only) | Attach names and/or titles to roles. Do **not** invent persons. Sender role ≠ Production ops | Named RACI or titled roles with evidence/reference | **No** | **Yes** for operational readiness | **No** for paper RACI. Support **model** later **yes** |
| HUM-09 | Budget / TCO envelope | **NOT ESTABLISHED** · **NO APPROVED NUMBER** | Optional envelope **only if real**. Do **not** invent a figure | Amount, currency, period if supplied; quotes remain separate | **No** | **Yes** for cost-acceptance | **Quotes yes.** Envelope **no** if the company already has one |
| HUM-10 | Approved jurisdictions | **UNSELECTED** · Tanzania **PREFERRED BASELINE ONLY** | Do **not** approve Production/backup/DR geography in this session | Provider region evidence **then** Owner+Legal decision | **No** | **Yes** (this is architecture geography) | **Yes** |
| HUM-11 | Named sender and transmission | Package **READY / NOT SENT** · named sender **NOT ESTABLISHED** · **0 transmissions** | Named sender + authority, then execute send **or** record hold | Sender identity; sent-mail / form artefacts **if** sent | **Yes** — named sender (and human acceptance of recorded routes) blocks **actual send** | **No** by itself | **No** (send precedes responses) |
| HUM-12 | Notice and incident-response ownership | **NOT ESTABLISHED** · drafts unpublished | Assign owner **title** (and name if known). Do **not** publish a complete notice | Ownership assignment. Complete notice still needs entity, DPO, recipients | **No** | **Yes** to publish / go live | Recipients / provider notify contacts **yes**. Owner **title** **no** |
| HUM-14 | Signatory process | **NOT ESTABLISHED** | Identify whether later contracting demands a named instrument. Do **not** invent MSA signatory | Process note; names blank if unknown | **No** | Blocks **contracting**; not hosting by itself | **No** |
| HUM-15 | PITR adoption decision | **NOT ESTABLISHED** · **CANDIDATE** | Do **not** adopt as Production control in this session | Provider WAL/PITR capability **then** Owner+IT adopt/not-adopt | **No** | Relative to zero-loss envelope / backup architecture | **Yes** |

HUM-06 (KMS product) and HUM-13 (ADR-0006 / DP-0006 / E1 approval) remain **out of this pack’s executable session core**. They wait for provider evidence and a later approval pack. They stay **NOT ESTABLISHED**.

---

## 6. E. Governance boundaries

This pack:

- **is not** an approval of E1, E1-D, ADR-0006, DP-0006, Production, UAT, deployment, or migration;  
- **does not** appoint personnel;  
- **does not** establish statutory compliance (PDPC, DPO statute, registry identity);  
- **does not** select a provider or architecture;  
- **does not** approve Production, UAT, deployment, or migration;  
- **does not** authorize external communication by itself (issuance remains **EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY**; actual send still needs a named human);  
- **does not** claim achieved RTO/RPO;  
- **does not** modify frozen E1-B materials;  
- **does not** close CD-01, HUM-03, HUM-07, or HUM-11 as executed send;  
- **does not** contact providers;  
- **does not** implement application code, change schemas, or create/execute migrations;  
- **does not** commit or push.

---

## 7. F. Session output (structure only — not prepopulated as confirmed)

Record outcomes **only** on [`adr-0006-e1-human-closure-decision-form.md`](adr-0006-e1-human-closure-decision-form.md) after a named human acts. Until then every formal outcome below remains **`NOT ESTABLISHED`**.

| Decision / evidence item | Allowed outcome statuses | Status in this pack |
| --- | --- | --- |
| BCM sequence (CD-01 / HUM-07) | CONFIRMED / REPLACED / DEFERRED / NOT ESTABLISHED / EVIDENCE REQUIRED | **NOT ESTABLISHED** |
| DPO / privacy (HUM-03) | CONFIRMED / REPLACED / DEFERRED / NOT ESTABLISHED / EVIDENCE REQUIRED / NOT APPLICABLE (if documented non-appointment of a DPO role) | **NOT ESTABLISHED** |
| RFI named sender (HUM-11 / HR-04) | CONFIRMED / DEFERRED / NOT ESTABLISHED / EVIDENCE REQUIRED | **NOT ESTABLISHED** |
| RFI transmission | CONFIRMED (only with evidence) / DEFERRED / NOT ESTABLISHED / NOT APPLICABLE (hold recorded) | **NOT ESTABLISHED** (**0 transmissions**) |
| HUM-01 entity extract | EVIDENCE REQUIRED / CONFIRMED (after artefact) / DEFERRED / NOT ESTABLISHED | **EVIDENCE REQUIRED** (current; not a fabricated extract) |
| HUM-02 PDPC | EVIDENCE REQUIRED / CONFIRMED / DEFERRED / NOT ESTABLISHED | **EVIDENCE REQUIRED** |
| HUM-04 census | EVIDENCE REQUIRED / CONFIRMED / DEFERRED / NOT ESTABLISHED | **NOT ESTABLISHED** |
| HUM-05 current IdP | CONFIRMED / EVIDENCE REQUIRED / DEFERRED / NOT ESTABLISHED | **NOT ESTABLISHED** |
| HUM-08 named RACI | CONFIRMED / DEFERRED / NOT ESTABLISHED / EVIDENCE REQUIRED | **NOT ESTABLISHED** |
| HUM-09 budget envelope | CONFIRMED / DEFERRED / NOT ESTABLISHED / NOT APPLICABLE / EVIDENCE REQUIRED | **NOT ESTABLISHED** |
| HUM-10 jurisdictions | DEFERRED / NOT ESTABLISHED / NOT APPLICABLE this session (wait for provider) | **NOT ESTABLISHED** — wait for provider |
| HUM-12 notice/IR ownership | CONFIRMED / DEFERRED / NOT ESTABLISHED | **NOT ESTABLISHED** |
| HUM-14 signatory process | CONFIRMED / DEFERRED / NOT ESTABLISHED / NOT APPLICABLE | **NOT ESTABLISHED** |
| HUM-15 PITR adoption | DEFERRED / NOT ESTABLISHED / NOT APPLICABLE this session | **NOT ESTABLISHED** — wait for provider |

Do **not** mark any row `CONFIRMED` without a named human, date, and (where required) artefact. `EVIDENCE REQUIRED` on HUM-01/HUM-02 above describes **current outstanding evidence**, not a session confirmation.

---

## 8. Recommended session order (executable; not ranked as business preference)

1. Hygiene: Thomas Nguluma remains Legal Counsel only; no DPO inferred; S1 and S2 presented without treating S2 as closed.  
2. BCM: confirm S2, select S1, replace with another sequence, or defer with reason — **leave CD-01 OPEN** unless a named instrument exists.  
3. DPO: appoint, document non-appointment + interim owner, or defer with reason and deadline.  
4. Optional parallel evidence if artefacts are in hand: HUM-01, HUM-02, HUM-04, HUM-05.  
5. Optional ownership: HUM-08 titles, HUM-12 owner title, HUM-14 process.  
6. RFI: record named sender and authority, then **either** the human sends per existing checklist **or** records a hold. Cursor does **not** send.  
7. Explicitly **do not** select provider, architecture, Production geography, or approve E1 / E1-D / Production.

---

## 9. Explicit non-actions (this pack)

- No application code.  
- No database changes.  
- No migrations.  
- No provider contact.  
- No RFI transmission.  
- No Production activity.  
- No personnel appointment.  
- No statutory assertion.  
- No commit.  
- No push.  
- No rewrite of historical governance records.  
- No change to frozen E1-B questionnaire, PE pack, template, or routing.

---

## 10. Status after creating this pack

| Item | Status |
| --- | --- |
| Formal BCM confirmation | **NOT ESTABLISHED** |
| CD-01 | **OPEN** |
| HUM-07 | **OPEN** |
| DPO appointment | **NOT ESTABLISHED** |
| HUM-03 | **OPEN** |
| Named sender | **NOT ESTABLISHED** |
| Named recipients | **NOT ESTABLISHED** |
| RFI transmissions | **0** |
| E1 | **NOT APPROVED / BLOCKED** |
| E1-D | **OPEN** |
| Provider / architecture / Production geography | **UNSELECTED** |

---

## 11. Additive — 2026-09-17 formal owner decision (not a rewrite of §§1–10)

Governing instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md).

This pack remains a **preparation artefact**. It did **not** itself confirm decisions. A later named owner instrument now records:

| Item | Current status |
| --- | --- |
| BCM / CD-01 / HUM-07 | **CLOSED / FORMALLY CONFIRMED** — **S2**; Patrick Makundi; PDM. S1 not selected. RTO/RPO **NOT DEMONSTRATED** |
| DPO | **Wensley Shirima**, IT Manager — **OWNER-DESIGNATED**. Appointment evidence **REQUIRED**. PDPC **NOT ESTABLISHED** |
| HUM-03 company decision | **CLOSED / FORMALLY CONFIRMED** |
| Named sender | **Patrick Makundi**, Owner, PDM |
| RFI | **SEND** confirmed; **NOT YET TRANSMITTED**; **0** transmissions |
| HUM-09 | **TCO-FIRST / BUDGET NOT YET FIXED** |
| E1 / E1-D / Production | Unchanged: **NOT APPROVED / BLOCKED**; **OPEN**; **NOT APPROVED** |

Body sections that still say OPEN / NOT ESTABLISHED are **preparation-time**. Use this §11 and the owner decision record for live status.
