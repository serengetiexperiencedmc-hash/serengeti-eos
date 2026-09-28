# E1-C — Human Evidence Request Pack

> **`PRACTICAL COMPLETION PACK FOR MANAGEMENT / LEGAL / OPERATIONS`**  
> **`EVIDENCE REQUEST ≠ DECISION REQUEST ≠ APPROVAL REQUEST`**  
> **`DO NOT INVENT FACTS, APPOINTMENTS, NUMBERS, SIGNATURES, OR JURISDICTIONS`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO PRODUCTION AUTHORIZATION`**

**Date:** 2026-09-17.  
**Matrix:** [`adr-0006-e1-c-human-decision-evidence-closure-matrix.md`](adr-0006-e1-c-human-decision-evidence-closure-matrix.md).  
**Queue:** [`adr-0006-e1-c-human-action-queue.md`](adr-0006-e1-c-human-action-queue.md).

How to use: complete only the items the company can truthfully complete. Leave blanks. Do not treat a filled preference as provider evidence.

---

## Request types (do not conflate)

| Type | Meaning |
| --- | --- |
| **EVIDENCE REQUEST** | Supply an existing fact or artefact |
| **DECISION REQUEST** | Record a company choice |
| **APPROVAL REQUEST** | Record a gated authorization (ADR/DP/E1/Production). **Not requested as completable in this sprint** where provider evidence is still missing |

---

## 1. Legal entity / registration evidence

| Field | Content |
| --- | --- |
| Item | HUM-01 / GAP-LEG-01 / E-01 |
| Type | **EVIDENCE REQUEST** |
| What is needed | Authoritative registry extract for **Makundi Serengeti Experience DMC** |
| Why it is needed | Company-provided name is **NOT VERIFIED**. Seed `Serengeti Experience DMC Ltd` is not verification. Contracting identity and privacy notice entity fields depend on it |
| Acceptable evidence | Official registry extract (e.g. BRELA or equivalent); registration/incorporation number; registered office as shown on the extract |
| What cannot be substituted | Company-provided string; seed legalName in software; Legal Counsel attestation; this pack |
| Who should provide it | Company officer / corporate secretary — named person **OWNER NOT ESTABLISHED**. Legal Counsel (**THOMAS NGULUMA**) may review |
| Consequence if unresolved | Production identity unverified; Combined legal pack incomplete; contracting blocked |
| Status | **OPEN — NOT VERIFIED** |

---

## 2. PDPC registration / status evidence

| Field | Content |
| --- | --- |
| Item | HUM-02 / GAP-LEG-02 / E-02 |
| Type | **EVIDENCE REQUEST** |
| What is needed | Company-specific PDPC artefact **or** documented status including confirmed non-registration **if** that artefact exists |
| Why it is needed | Public PDPC pages ≠ SEDMC status. Absence ≠ unregistered / unnecessary |
| Acceptable evidence | Certificate, registration number with source, regulator correspondence, or a written Legal/company status determination attached to an artefact |
| What cannot be substituted | Inference from missing files; EA-02 process webpage; Counsel attestation; DPO key in P1 |
| Who should provide it | Company + Legal Counsel (**THOMAS NGULUMA**). DPO once established — **DPO NOT ESTABLISHED** |
| Consequence if unresolved | Privacy evidence incomplete; Production blocked if registration is required and unknown |
| Status | **OPEN — NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |

---

## 3. DPO appointment evidence

| Field | Content |
| --- | --- |
| Item | HUM-03 / GAP-LEG-03 / GAP-LEG-04 / E-03 |
| Type | **EVIDENCE REQUEST** and **DECISION REQUEST** (appoint vs documented non-appointment) |
| What is needed | Appointment record **or** documented non-appointment by a competent human |
| Why it is needed | Combined Legal/DPO is **INCOMPLETE**. Legal Counsel complete ≠ DPO |
| Acceptable evidence | Appointment letter, board/director resolution, employment/role designation, **or** written non-appointment decision |
| What cannot be substituted | **Thomas Nguluma’s Legal Counsel attestation**; P1 `dpo` key; this pack |
| Who should provide it | Company appointment authority — **OWNER NOT ESTABLISHED**. **Do not assign DPO to Thomas Nguluma in this pack** |
| Consequence if unresolved | E1 combined Legal/DPO remains incomplete; DPO-required determinations cannot be made |
| Status | **OPEN — DPO APPOINTMENT NOT ESTABLISHED** |

---

## 4. Data-subject geography census

| Field | Content |
| --- | --- |
| Item | HUM-04 / GAP-LEG-08 / E-05 / E-18 |
| Type | **EVIDENCE REQUEST** |
| What is needed | Census of data-subject / offering geography **distinct from** destination list and target-market list |
| Why it is needed | Kenya DPA / GDPR / UK GDPR remain **conditional**. Draft maps are not a census |
| Acceptable evidence | Internal commercial/ops records showing where data subjects are or will be |
| What cannot be substituted | Target-market list (ZA, Europe, ME, CA, US, LATAM); destination list (TZ, KE, RW, UG, Zanzibar, ET, SC, MU); invented percentages |
| Who should provide it | Commercial/ops + Legal Counsel. Named ops owner **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Applicability and transfer assessments remain decision-blocking for those regimes |
| Status | **OPEN — DRAFT / PREPARATORY** |

---

## 5. Existing contract / processor evidence

| Field | Content |
| --- | --- |
| Item | Related to GAP-LEG-05 harvest (Class C for **vendor** DPAs) |
| Type | **EVIDENCE REQUEST** (existing paper only) |
| What is needed | Register of **existing** client/supplier/processor contracts the company already holds |
| Why it is needed | Repo has no Production vendor DPAs; existing paper can be harvested without waiting for RFI replies |
| Acceptable evidence | Actual agreements, DPA addenda, processor lists already signed |
| What cannot be substituted | Invented DPA; provider marketing; future vendor paper |
| Who should provide it | Legal / company files — **OWNER NOT ESTABLISHED**. Legal Counsel may review |
| Consequence if unresolved | Existing-processor picture remains empty; **vendor Production DPAs still wait for a named provider** |
| Status | **OPEN — absent in repo**. **Do not treat harvest as provider selection** |

---

## 6. Corporate IdP current-state evidence

| Field | Content |
| --- | --- |
| Item | HUM-05 / GAP-IDN-01 / ADR-0013 |
| Type | **EVIDENCE REQUEST** (current state). Production IdP **product/hosting** is **not** an approval in this sprint |
| What is needed | Whether the company uses Microsoft Entra ID, Google Workspace, nothing, or another IdP **today** |
| Why it is needed | ADR-0013 records the question as unknown. Dev `local-password-dev` is not corporate IdP |
| Acceptable evidence | IT inventory, tenant screenshots/admin confirmation, or written “none” |
| What cannot be substituted | Dev local IdP; a guessed hyperscaler because it appears in E1-B4 |
| Who should provide it | Company IT — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | ADR-0013 remains blocked for Production |
| Status | **OPEN — UNKNOWN** |

---

## 7. KMS / secrets decision

| Field | Content |
| --- | --- |
| Item | HUM-06 / GAP-SEC-01 / ADR-0012 |
| Type | **DECISION REQUEST — WAIT FOR PROVIDER EVIDENCE** (not completable as a product choice now) |
| What is needed | Later: named secrets/KMS product and rotation owners |
| Why it is needed | UAT/Production blocked until a secrets system and rotation owners exist |
| Acceptable evidence | Decision **after** ADR-0006 hosting evidence + provider KMS offering |
| What cannot be substituted | Dev env files; `EOS_TOKEN_SECRET` fallback `dev-only-change-me`; picking a cloud KMS because a CU exists |
| Who should provide it | IT + Owner after evidence — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | ADR-0012 remains blocked for UAT/Production |
| Status | **OPEN — do not select product in this sprint** |

---

## 8. BCM recovery-order decision

| Field | Content |
| --- | --- |
| Item | HUM-07 / GAP-REC-03 / CD-01 |
| Type | **DECISION REQUEST** |
| What is needed | Which sequence **governs**: S1, S2, or a new dated sequence |
| Why it is needed | Two substantive written orders exist. Recovery design, RACI, and tests depend on one governing order |
| Acceptable evidence | Dated Owner/company instrument citing S1 and S2 and stating the governing sequence |
| What cannot be substituted | Owner pack “CHANGED” / “already reconciled” wording; this pack; Cursor inference; E1-C restatement of the five-step list as a new signature |
| Who should provide it | Owner / BCM authority — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Recovery-priority packaging remains decision-blocking |
| Status | **OPEN / DECISION REQUIRED** — see [`adr-0006-e1-c-bcm-sequence-decision-record.md`](adr-0006-e1-c-bcm-sequence-decision-record.md) |

S1 and S2 are reproduced in that decision record. They are **not** selected here.

---

## 9. Operations RACI / ownership

| Field | Content |
| --- | --- |
| Item | HUM-08 / GAP-OPS-01 |
| Type | **DECISION REQUEST** (and **EVIDENCE REQUEST** if ownership already exists) |
| What is needed | Production restore, backup, on-call ownership as roles and/or named humans |
| Why it is needed | Operational readiness cannot be claimed without owners |
| Acceptable evidence | Written RACI; role titles if personal names unknown |
| What cannot be substituted | Reservations Consultant / `rfp@serengetiexperiencedmc.com` (E1-B sender, not Production ops); invented personal names |
| Who should provide it | Company — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Production operational readiness remains **NOT READY** |
| Status | **OPEN — TBD** |

---

## 10. Production budget

| Field | Content |
| --- | --- |
| Item | HUM-09 / GAP-TCO-01 / GAP-GOV-01 / HR-07 |
| Type | **DECISION REQUEST — WAIT FOR QUOTES** for cost-acceptance. Optional **EVIDENCE REQUEST** if an approved envelope already exists |
| What is needed | Amount, currency, period **if** the company will accept cost; **do not invent a figure** |
| Why it is needed | Quotes can be received without a budget; **acceptance** cannot |
| Acceptable evidence | Finance/Owner approved envelope, or written “no envelope until quotes” |
| What cannot be substituted | Invented TCO; provider list prices guessed from public pages |
| Who should provide it | Finance / Owner — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Cost-acceptance blocked; receiving quotes **not** blocked |
| Status | **OPEN — NO APPROVED NUMBER** |

---

## 11. Production jurisdiction decision

| Field | Content |
| --- | --- |
| Item | HUM-10 / GAP-RES-01 |
| Type | **DECISION REQUEST — WAIT FOR PROVIDER EVIDENCE**. **Not** an **APPROVAL REQUEST** in this sprint |
| What is needed | Approved Production primary-data jurisdiction **after** actual region evidence |
| Why it is needed | Tanzania is **PREFERRED BASELINE ONLY**. ADR-0006 / DP-0006 remain open |
| Acceptable evidence | Owner + Legal decision citing provider region evidence (PE-03 class) |
| What cannot be substituted | Preference; class A–D unevaluated selection; Legal Counsel attestation; marketing regions |
| Who should provide it | Owner + Legal Counsel. Named Owner **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Architecture geography unselected; Production blocked |
| Status | **OPEN — UNSELECTED**. Do **not** decide in this sprint |

---

## 12. Backup jurisdiction decision

| Field | Content |
| --- | --- |
| Item | HUM-10 / GAP-BKP-01 geography |
| Type | **DECISION REQUEST — WAIT FOR PROVIDER EVIDENCE** |
| What is needed | Approved backup copy jurisdiction **after** PE-06 class evidence |
| Why it is needed | Backup location ≠ primary location; transfer assessment depends on it |
| Acceptable evidence | Owner + Legal decision citing backup geography evidence |
| What cannot be substituted | Lab dumps; ADR-0011 Dev/Test evidence-register; 19:00 EAT as a future requirement |
| Who should provide it | Owner + Legal Counsel — named Owner **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Backup architecture and transfer assessment blocked |
| Status | **OPEN — UNSELECTED**. Do **not** decide in this sprint |

---

## 13. DR jurisdiction decision

| Field | Content |
| --- | --- |
| Item | HUM-10 / GAP-DR-01 |
| Type | **DECISION REQUEST — WAIT FOR PROVIDER EVIDENCE** |
| What is needed | Approved DR/failover jurisdiction **if DR is used**, after PE-07 class evidence |
| Why it is needed | Restricted+ placement and failover design depend on copy location |
| Acceptable evidence | Owner + Legal decision citing DR geography; or documented “DR not in topology” after evidence |
| What cannot be substituted | Assumed secondary region; provider brochure DR |
| Who should provide it | Owner + Legal Counsel — named Owner **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Failover design and Restricted+ placement remain unassessed |
| Status | **OPEN — UNSELECTED**. Do **not** decide in this sprint |

---

## 14. Privacy notice / incident-response ownership

| Field | Content |
| --- | --- |
| Item | HUM-12 / GAP-LEG-07 / GAP-OPS-02 / E-12 / E-15 |
| Type | **DECISION REQUEST** for **ownership**. Publication completeness is **not** an approval in this sprint |
| What is needed | Named role (personal name optional) owning notice publication and Production IR; not a complete published notice |
| Why it is needed | Drafts exist; publication needs entity, DPO, recipients |
| Acceptable evidence | Written owner role; keep notice **unpublished** |
| What cannot be substituted | Completing and publishing the notice without entity/DPO/recipients; assigning DPO to Legal Counsel |
| Who should provide it | Company. Legal Counsel for legal text review. Publication/IR owner **OWNER NOT ESTABLISHED**. DPO **NOT ESTABLISHED** |
| Consequence if unresolved | Cannot publish / go live |
| Status | **OPEN — DRAFT** |

---

## 15. ADR-0006 decision requirements

| Field | Content |
| --- | --- |
| Item | HUM-13 / GAP-GOV-01 |
| Type | **APPROVAL REQUEST — NOT COMPLETABLE IN THIS SPRINT** |
| What is needed | Owner approval of hosting/residency **after** the evidence pack (provider evidence + Legal/DPO remaining items) |
| Why it is needed | ADR-0006 is **proposed — blocked for Production**. Options evaluation did **not** select an architecture |
| Acceptable evidence | Later Owner instrument updating ADR status |
| What cannot be substituted | This pack; Legal Counsel attestation; E1-A options evaluation; E1-C baseline |
| Who should provide it | Owner — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | Production hosting remains unauthorized |
| Status | **OPEN**. **Do not approve ADR-0006 now** |

---

## 16. DP-0006 decision requirements

| Field | Content |
| --- | --- |
| Item | HUM-13 / GAP-GOV-02 |
| Type | **APPROVAL REQUEST — NOT COMPLETABLE IN THIS SPRINT** |
| What is needed | Formal human approval of the decision paper before UAT/Production infrastructure |
| Why it is needed | DP-0006 **OPEN**; Recommended option **Not selected**; rule not to lock IaC |
| Acceptable evidence | Later Owner/approval packet (recommended + alternatives as the DP requires) |
| What cannot be substituted | This pack; letter-swap documentation (GAP-GOV-05 still open); provider universe |
| Who should provide it | Owner — **OWNER NOT ESTABLISHED** |
| Consequence if unresolved | UAT/Production hosting must not be finalized |
| Status | **OPEN**. **Do not approve DP-0006 now** |

---

## Related items in the same pack (not duplicating the 16 numbered requests)

| Item | Type | Status |
| --- | --- | --- |
| HUM-11 execute authorized RFI/clarification | **DECISION REQUEST** (send vs not-yet). Cursor does not send | OPEN — 0 transmissions |
| HUM-14 signatory / corporate instrument | **EVIDENCE REQUEST** if it exists; not required to send information-gathering RFI | OPEN — BLANK |
| HUM-15 adopt PITR | **DECISION REQUEST — WAIT FOR PROVIDER EVIDENCE** | OPEN — CANDIDATE |

---

## DECISIONS POTENTIALLY RESOLVABLE NOW

HUM-01, HUM-02, HUM-03, HUM-04, HUM-05 (current IdP), HUM-07, HUM-08, HUM-11, HUM-12 (owner title only), HUM-14 (process identification), existing-contract harvest.

## DECISIONS THAT SHOULD WAIT FOR PROVIDER EVIDENCE

HUM-06 KMS product; HUM-09 cost-acceptance; HUM-10 Production/backup/DR jurisdictions; HUM-13 ADR/DP/E1 approvals; HUM-15 PITR adoption; technical RTO/RPO acceptance; architecture/provider selection.
