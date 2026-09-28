# E1-C — Human Evidence / Decision Required Register

> **`CLASS B ITEMS ONLY`**  
> **`DO NOT INVENT NAMES, NUMBERS, APPOINTMENTS, SIGNATURES, DATES, APPROVALS, BUDGETS, OR AUTHORITY`**  
> **`ADDITIVE 2026-09-17: SEE END — OWNER DECISIONS RECORDED; APPOINTMENT/PDPC EVIDENCE STILL REQUIRED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**

**Date:** 2026-09-17.  
**Parent classification:** [`adr-0006-e1-c-gap-closure-classification.md`](adr-0006-e1-c-gap-closure-classification.md)

Legal Counsel attestation already exists. It is **not** a DPO appointment, PDPC registration, entity extract, budget, or Production approval.

---

| ID | Related gap(s) | Evidence / decision required | Why it cannot be invented | Who must provide / decide | Blocks provider evaluation? | Blocks Production? | Current status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HUM-01 | GAP-LEG-01 | Authoritative registry extract for company-provided name **Makundi Serengeti Experience DMC** (number, office, incorporation as applicable) | Name is COMPANY-PROVIDED FACT only. Seed `Serengeti Experience DMC Ltd` is not verification. | Company officer / corporate secretary (not invented) | **No** (intake). **Yes** for verified contracting identity. | **YES** | NOT VERIFIED |
| HUM-02 | GAP-LEG-02 | Company-specific PDPC registration artefact **or** documented status including confirmed non-registration **if** that artefact exists | Public PDPC pages ≠ SEDMC status. Absence ≠ unregistered. | Company + Legal Counsel; DPO once established | **No** for E1-B3 intake | **YES** if required and unknown | NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED |
| HUM-03 | GAP-LEG-03, GAP-LEG-04 | DPO appointment record **or** documented non-appointment by a competent human | P1 `dpo` key ≠ appointment. **Thomas Nguluma is Legal Counsel only.** | Company appointment authority (not invented) | **No** for intake | **YES** if appointment required; E1 combined Legal/DPO incomplete until resolved | DPO APPOINTMENT NOT ESTABLISHED |
| HUM-04 | GAP-LEG-08 | Data-subject / offering geography facts (census distinct from target market) | Draft E-05/E-18 are not a census | Commercial/ops + Legal | **No** for receiving RFI | **DECISION-BLOCKING** for Kenya/GDPR/UK GDPR conclusions | DRAFT / PREPARATORY |
| HUM-05 | GAP-IDN-01 | Which corporate IdP the company actually uses (Entra, Google Workspace, none, or other) | ADR-0013 records the question as unknown | Company IT | **No** | **YES** (ADR-0013 blocked Production) | UNKNOWN / REQUIRES DECISION |
| HUM-06 | GAP-SEC-01 | Secrets/KMS **product choice** after hosting evidence (Vault vs cloud KMS vs other) — choice only, not a selected host | ADR-0012 pending; evaluating options is not selection of Production hosting | IT + Owner after ADR-0006 evidence | **No** | **YES** (blocked UAT/Production) | proposed — blocked |
| HUM-07 | GAP-REC-03 | Which BCM recovery sequence **governs** (see BCM reconciliation artifact) | Two written sequences exist; Cursor must not pick | Owner | **No** | **DECISION-BLOCKING** for recovery priority packaging | COMPANY DECISION REQUIRED (CD-01 OPEN) |
| HUM-08 | GAP-OPS-01 | Named Production operational ownership (restore, backup, on-call) — roles may be recorded without inventing personal names | E1-B sender (Reservations Consultant) ≠ Production ops | Company | **No** | **YES** | TBD — no names invented |
| HUM-09 | GAP-TCO-01, GAP-GOV-01 | Production **budget** envelope if a later acceptance decision is required | No figure in repo; COMPANY DECISION REQUIRED | Finance / Owner | **No** for receiving quotes | **YES** for cost-acceptance | NO APPROVED NUMBER |
| HUM-10 | GAP-RES-01, GAP-DR-01, backup jurisdiction | Production / backup / DR **jurisdiction decisions** after evidence | Tanzania preferred baseline ≠ approval | Owner + Legal | **No** for evaluation criteria | **YES** | UNSELECTED |
| HUM-11 | GAP-GOV-04 / E1-B HR-04 | Whether to **execute** authorized RFI/clarification sends; personal sender name if a process demands one | Role mailbox rfp@serengetiexperiencedmc.com recorded; personal name **not recorded — not fabricated** | Company communicator | Send required before responses exist | No | Role CONFIRMED FOR PREPARATION; send **not** evidenced |
| HUM-12 | GAP-LEG-07, GAP-OPS-02 | Privacy-notice publication and Production IR owner | Drafts exist; publication needs entity/DPO/recipients | Legal / company | **No** | **YES** to publish / go live | DRAFT |
| HUM-13 | GAP-GOV-01, GAP-GOV-02, GAP-GOV-03 | Owner approval of ADR-0006, DP-0006, E1 | Attestation and options evaluation are not owner hosting approval | Owner | **No** | **YES** | NOT RECORDED |
| HUM-14 | E1-B HR-06 / HR-08 | Signatory / corporate-authority instrument **if** a later contracting process requires them | Authorization signature fields blank by rule | Board / company officer (not invented) | **No** for information-gathering | **Blocks contracting** | BLANK — NOT FABRICATED |
| HUM-15 | GAP-BKP-02 | Whether PITR/WAL is **adopted** as a Production control (candidate today) | Business zero-loss ≠ selected topology | Owner + IT after evidence | **No** | Relative to zero-loss envelope | CANDIDATE — NOT SELECTED |

Provider evaluation (E1-B3 intake) is **not** blocked by HUM-01–HUM-15 except that **no responses exist until a human sends** (HUM-11). Combined Legal/DPO and Production **are** blocked by several items above.

---

## Additive — 2026-09-17 owner decision (not a rewrite of the table)

Instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md). Table rows above remain the **pre-decision** register.

| ID | Current status |
| --- | --- |
| HUM-01 | **NOT PROVIDED / EVIDENCE REQUIRED** |
| HUM-02 | **NOT ESTABLISHED / EXTERNAL EVIDENCE REQUIRED** |
| HUM-03 | Company decision **CLOSED / OWNER-CONFIRMED** (Wensley Shirima, IT Manager, DPO). Formal appointment evidence **REQUIRED**. PDPC **NOT ESTABLISHED**. Thomas Nguluma **not** DPO |
| HUM-07 | **CLOSED / FORMALLY CONFIRMED** — S2; Patrick Makundi; PDM. CD-01 **CLOSED**. Technical RTO/RPO **NOT DEMONSTRATED** |
| HUM-08 | Privacy/DPO = Wensley Shirima. Other personnel **NOT ESTABLISHED** |
| HUM-09 | **TCO-FIRST / BUDGET NOT YET FIXED** — no dollar amount |
| HUM-11 | Named sender **CLOSED** (Patrick Makundi). Decision **SEND**. Transmission **not evidenced**. Recipients **NOT ESTABLISHED** |
| HUM-12 | Privacy owner = Wensley Shirima (DPO function). IR **NOT YET NAMED** |
| HUM-14 | **NOT ESTABLISHED**. RFI authority ≠ contracting signatory |
| HUM-15 | **OPEN / PROVIDER- AND ARCHITECTURE-DEPENDENT** |
