# E1-C — Human Decision & Evidence Closure Matrix

> **`EVIDENCE / DECISION PREPARATION ONLY`**  
> **`16/16 B-CLASS GAPS ACCOUNTED FOR`** · **`HUM-01–HUM-15 ACCOUNTED FOR`**  
> **`NO FACT, DECISION, APPROVAL, DPO, PDPC, BUDGET, OR SIGNATURE INVENTED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO PRODUCTION AUTHORIZATION`**  
> **`E1-B OPEN IN PARALLEL — 9 / 2 / 1 ; 0 TRANSMISSIONS`**

**Date:** 2026-09-17.  
**Parents:** [`adr-0006-e1-c-human-evidence-required-register.md`](adr-0006-e1-c-human-evidence-required-register.md); [`adr-0006-e1-c-gap-closure-classification.md`](adr-0006-e1-c-gap-closure-classification.md).  
**BCM:** [`adr-0006-e1-c-bcm-sequence-decision-record.md`](adr-0006-e1-c-bcm-sequence-decision-record.md).  
**Request pack:** [`adr-0006-e1-c-human-evidence-request-pack.md`](adr-0006-e1-c-human-evidence-request-pack.md).

This matrix consolidates Class B gaps and HUM-01–HUM-15 so humans can supply facts or record decisions **without waiting for provider responses** where that is genuinely possible. Completing a row is **not** Production authorization.

Legal Counsel attestation already exists (`THOMAS NGULUMA`, 15 September 2026, `A.T.N`). It is **not** a DPO appointment, PDPC registration, entity extract, budget, architecture selection, or Production approval.

Where a named person is not recorded in the repository, owner is **OWNER NOT ESTABLISHED**.

---

## Phase 2 — Facts vs decisions vs provider-dependent facts

| Set | Meaning | This sprint |
| --- | --- | --- |
| **A. FACTUAL EVIDENCE TO BE SUPPLIED** | Existing corporate/legal/operational facts. Cannot be invented. | HUM-01, HUM-02, HUM-03 (appointment artefact **or** documented non-appointment), HUM-04, HUM-05 (current IdP), existing contracts (related to GAP-LEG-05 harvest), HUM-08 (current ops ownership if any), HUM-14 (authority instrument if it exists) |
| **B. COMPANY DECISIONS** | Choices the company must record. Not provider answers. | HUM-07 (BCM order), HUM-03 (whether to appoint), HUM-08 (RACI if not already fact), HUM-09 (budget envelope), HUM-10 (jurisdictions **after** region evidence), HUM-06 (KMS **after** hosting evidence), HUM-11 (whether to send), HUM-13 (ADR/DP/E1), HUM-15 (adopt PITR **after** capability evidence) |
| **C. PROVIDER-DEPENDENT FACTS** | Already mapped in [`adr-0006-e1-c-provider-evidence-dependency-register.md`](adr-0006-e1-c-provider-evidence-dependency-register.md). **AWAITING PROVIDER RESPONSE.** | Production region, Tanzania residency proof, backup/DR geography, Restricted+ copies, PostgreSQL offering, PITR/WAL, restore proof, technical RTO/RPO, failover, subprocessors, government access, deletion/portability, encryption, KMS offering, identity hosting, WAF, monitoring, support, TCO quotes |

A human decision **must not** substitute for a provider fact. Example: choosing “Tanzania preferred” is already recorded; it does **not** prove a provider region exists.

---

## Coverage

### Sixteen B-class gaps

| GAP ID | HUM ID(s) | Kind |
| --- | --- | --- |
| GAP-LEG-01 | HUM-01 | Fact |
| GAP-LEG-02 | HUM-02 | Fact |
| GAP-LEG-03 | HUM-03 | Fact + decision |
| GAP-LEG-04 | HUM-03 | Fact (DPO component of combined Legal/DPO) |
| GAP-LEG-07 | HUM-12 | Fact + decision; recipients also provider-dependent |
| GAP-LEG-08 | HUM-04 | Fact |
| GAP-IDN-01 | HUM-05 | Fact (current state); Production host later |
| GAP-SEC-01 | HUM-06 | Decision after provider evidence |
| GAP-RES-01 | HUM-10 | Decision after provider region evidence |
| GAP-REC-03 | HUM-07 | Decision (CD-01) |
| GAP-OPS-01 | HUM-08 | Fact/decision |
| GAP-OPS-02 | HUM-12 | Fact/decision; provider notify later |
| GAP-GOV-01 | HUM-09, HUM-13 | Decision; provider pack required for approval |
| GAP-GOV-02 | HUM-13 | Decision; provider pack required |
| GAP-GOV-03 | HUM-13 | Decision; Legal/DPO + architecture remaining |
| GAP-GOV-04 | HUM-11 | Decision to execute send |

**16/16 B-class gaps appear above.**

### HUM items that are not solely B-class

| HUM ID | Also maps | Note |
| --- | --- | --- |
| HUM-09 | GAP-TCO-01 (**C**) | Budget is a company decision; **quotes** remain provider-dependent |
| HUM-10 | GAP-DR-01 (**C**), backup jurisdiction (**C**) | Human decides **after** region evidence; must not invent regions |
| HUM-14 | E1-B HR-06 / HR-08 (not a Class B gap) | Contracting authority; does not block E1-B intake |
| HUM-15 | GAP-BKP-02 (**C**) | Adopt-PITR is a company decision; WAL geography remains provider-dependent |

---

## Matrix (HUM-01–HUM-15)

Legend:

- **Can be resolved now?** = the missing **human** fact or **company** decision can be supplied without a provider reply. **YES** does not mean already closed. **NO** means wait for provider evidence or a later gate.
- **Blocks provider evaluation?** = blocks **E1-B3 intake of an actual response**. Intake is already unblocked except that **no responses exist until a human sends** (HUM-11).
- **Result/status** = current; nothing in this sprint closes a row.

| HUM ID | Related GAP ID(s) | Decision/evidence description | Current state | Evidence already available | Missing evidence | Exact human input required | Appropriate decision/evidence owner | Legal Counsel involvement required? | DPO involvement required? | Management/company decision required? | Provider evidence also required? | Blocks provider evaluation? | Blocks architecture selection? | Blocks Production? | Can be resolved now? | Proposed resolution mechanism | Result/status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HUM-01 | GAP-LEG-01 | Authoritative registry extract for company-provided name **Makundi Serengeti Experience DMC** | COMPANY-PROVIDED FACT; **NOT VERIFIED** | Name recorded in E-01 register; seed `Serengeti Experience DMC Ltd` unresolved | BRELA/registry extract, number, office, incorporation as applicable | Supply registry artefact **or** documented inability to locate it | Company officer / corporate secretary — **OWNER NOT ESTABLISHED** (named person) | Review of artefact **yes**; Counsel does not create the extract | Not required to collect the extract; DPO **NOT ESTABLISHED** | Company must supply files | **No** | **No** (intake). **Yes** for verified contracting identity | **No** | **YES** | **YES** | Company files + Legal Counsel review; do not invent number | OPEN — NOT VERIFIED |
| HUM-02 | GAP-LEG-02 | Company-specific PDPC registration/status evidence | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** | Acquisition notes; public PDPC process pages (EA-02) ≠ SEDMC status | Certificate, correspondence, or documented confirmed status including confirmed non-registration **if** that artefact exists | Supply PDPC artefact **or** documented status; do not infer from absence | Company + Legal Counsel (**THOMAS NGULUMA**). DPO once established. Named company officer **OWNER NOT ESTABLISHED** | **YES** | **YES once established**; currently **cannot** be obtained as DPO | Company collection | **No** for status of SEDMC as customer | **No** for E1-B3 intake | **No** | **YES** if required and unknown | **YES** | Company/Legal file search; do not claim registered/unregistered/unnecessary | OPEN — NOT VERIFIED |
| HUM-03 | GAP-LEG-03, GAP-LEG-04 | DPO appointment **or** documented non-appointment; Combined Legal/DPO completeness | DPO **NOT ESTABLISHED**. Legal Counsel **COMPLETE**. Combined **INCOMPLETE** | Legal Counsel attestation; P1 `dpo` key is **not** appointment | Appointment record (identity, date, terms) **or** competent non-appointment decision | Record appointment **or** non-appointment. **Do not convert Thomas Nguluma to DPO.** | Company appointment authority — **OWNER NOT ESTABLISHED**. **DPO NOT ESTABLISHED** | Advise **yes**; Counsel attestation **is not** the appointment | **YES** (this **is** the DPO item) | **YES** | **No** | **No** for intake | **No** | **YES** if appointment required; E1 combined Legal/DPO incomplete | **YES** | Company appointment instrument or written non-appointment | OPEN — DPO NOT ESTABLISHED |
| HUM-04 | GAP-LEG-08 | Data-subject / offering geography census distinct from target market | DRAFT / PREPARATORY (E-05/E-18) | Destinations and target markets as **company-supplied** lists; LA-03/LA-04 conditional | Census of where data subjects actually are / will be, distinct from destination and buyer-market lists | Supply census from commercial/ops records | Commercial/ops + Legal Counsel. Named ops owner **OWNER NOT ESTABLISHED** | **YES** for applicability | **YES once established** | Company records | Paths/transfers **later** (provider) | **No** for receiving RFI | **No** for class evaluation | **DECISION-BLOCKING** for Kenya/GDPR/UK GDPR conclusions | **YES** | Internal records census; drafts are not a census | OPEN — DRAFT |
| HUM-05 | GAP-IDN-01 | Which corporate IdP the company **actually uses** today (Entra, Google Workspace, none, or other) | UNKNOWN / REQUIRES DECISION (ADR-0013) | Dev `local-password-dev` only; ADR-0013 unknown | Company IT fact of current IdP (or documented none) | State current corporate IdP product **or** that none exists | Company IT — **OWNER NOT ESTABLISHED** | Not required for inventory | No | **YES** (inventory / later product) | **YES** if Production IdP is hosted (location) | **No** | Hosted IdP location **yes** later | **YES** (ADR-0013 blocked Production) | **YES** for **current-state fact**. Production IdP **hosting** waits | IT inventory note; do not treat Dev IdP as Production | OPEN — UNKNOWN |
| HUM-06 | GAP-SEC-01 | Secrets/KMS **product choice** (Vault vs cloud KMS vs other) after hosting evidence | ADR-0012 **proposed — blocked UAT/Production** | Dev `EnvSecretsProvider`; evaluate-after-ADR-0006 rule | Named product + rotation owners; hosting KMS offering | Do **not** choose now. After provider KMS evidence, record product + owners | IT + Owner after ADR-0006 evidence — **OWNER NOT ESTABLISHED** | Review of placement **later** | No | **YES** after evidence | **YES** (KMS offering) | **No** | Coupled to architecture | **YES** | **NO** | Wait PE/Q KMS; keep Dev secrets out of git | OPEN — blocked; do not select product |
| HUM-07 | GAP-REC-03 | Which BCM recovery sequence **governs** (S1 vs S2 vs new dated sequence) | **CD-01 OPEN / DECISION REQUIRED** | S1 company-response; S2 Owner pack; investigation file | Authorized human decision stating the governing sequence | Choose S1, S2, or a new dated sequence; cite sources; do not fabricate signature | Owner / BCM authority — **OWNER NOT ESTABLISHED** (named). Owner pack is **not** a named signature | Not required to pick order | No | **YES** | **No** | **No** | **No** (class evaluation) | **DECISION-BLOCKING** for recovery-priority packaging | **YES** | [`adr-0006-e1-c-bcm-sequence-decision-record.md`](adr-0006-e1-c-bcm-sequence-decision-record.md); Owner records governing sequence | OPEN — CD-01 not closed by this sprint |
| HUM-08 | GAP-OPS-01 | Named Production operational ownership (restore, backup, on-call) | TBD — no names invented | Reservations Consultant is **E1-B sender role only**, not Production ops | Named humans **or** established roles without inventing personal names | Assign roles on paper (titles acceptable if names unknown) | Company — **OWNER NOT ESTABLISHED** | No | No | **YES** | Support **model** later (provider) | **No** | **No** | **YES** | **YES** for paper RACI | RACI draft; no go-live | OPEN — TBD |
| HUM-09 | GAP-TCO-01 (**C**), GAP-GOV-01 | Production **budget** envelope if later acceptance is required | NO APPROVED NUMBER | TCO structure; COMPANY DECISION REQUIRED | Amount, currency, period if the company will accept cost | Optional envelope now; **do not invent a figure**. Cost-acceptance waits for quotes | Finance / Owner — **OWNER NOT ESTABLISHED** | No | No | **YES** | **YES** (quotes) | **No** for receiving quotes | Cost may constrain later selection | **YES** for cost-acceptance | **NO** for acceptance. Envelope **may** be recorded independently **if** company supplies one | Wait quotes; do not fabricate | OPEN — NO APPROVED NUMBER |
| HUM-10 | GAP-RES-01, GAP-DR-01 (**C**), backup jurisdiction (**C**) | Production / backup / DR **jurisdiction decisions** after evidence | Tanzania **PREFERRED BASELINE ONLY**; jurisdictions **UNSELECTED** | LA-06 preference; Legal Counsel adopted conditions; L-05/L-17 deferred | Actual provider regions; Owner/Legal decision after evidence | Do **not** approve jurisdictions now. After PE-03/06/07, record decisions | Owner + Legal Counsel. Named Owner **OWNER NOT ESTABLISHED** | **YES** | **YES once established** | **YES** | **YES** (regions) | **No** for evaluation **criteria** | **YES** (this **is** architecture geography) | **YES** | **NO** | Keep preference ≠ approval; wait provider regions | OPEN — UNSELECTED |
| HUM-11 | GAP-GOV-04 | Whether to **execute** authorized full-RFI (9) and scope-clarification (2) sends | PACKAGE READY / NOT SENT; **0 TRANSMISSIONS**. Role **Reservations Consultant** / `rfp@serengetiexperiencedmc.com` confirmed for **preparation**. Personal name **not recorded** | E1-B authorization (information-gathering); routing 9/2/1; checklist | Sent-mail / form artefacts **if** a human sends | Company communicator executes or records a decision **not** to send yet. Personal name **not fabricated** | Reservations Consultant (role established). Personal name **OWNER NOT ESTABLISHED** | No | No | **YES** (execute vs hold) | N/A (send precedes responses) | Send required **before responses exist** | **No** | **No** | **YES** | Human send per E1-B6 checklist; Cursor does not send | OPEN — NOT SENT |
| HUM-12 | GAP-LEG-07, GAP-OPS-02 | Privacy-notice publication completeness; Production IR owner | Notice **DRAFT**; IR **DRAFT** | E-12 / E-15 drafts; Legal Counsel rules | Entity, DPO, recipients, published notice; IR owner; provider notify contacts | Assign IR/notice **ownership** now. Do **not** publish a complete notice until entity/DPO/recipients exist | Legal Counsel for legal text. Publication/IR owner **OWNER NOT ESTABLISHED**. DPO **NOT ESTABLISHED** | **YES** | **YES once established** | **YES** (owner + publish) | **YES** (recipients / provider contacts) | **No** | Recipients later | **YES** to publish / go live | **NO** for complete notice/IR. **YES** for assigning an owner title | Keep unpublished; assign owner without inventing DPO | OPEN — DRAFT |
| HUM-13 | GAP-GOV-01, GAP-GOV-02, GAP-GOV-03 | Owner approval of ADR-0006, DP-0006, E1 | ADR-0006 **proposed — blocked for Production**. DP-0006 **OPEN**. E1 **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**. E1 Owner decision **NOT YET RECORDED** | Options evaluation (unselected); Legal Counsel attestation; E1-C baseline | Evidence pack including provider evidence, Legal/DPO completeness, architecture | Do **not** approve now | Owner — **OWNER NOT ESTABLISHED** | Counsel pack exists; not Owner hosting approval | Combined Legal/DPO still incomplete | **YES** | **YES** | **No** for intake | **This is** the selection/approval gate | **YES** | **NO** | Prepare pack; do not change ADR/DP status | OPEN — NOT RECORDED |
| HUM-14 | E1-B HR-06 / HR-08 (not Class B) | Signatory / corporate-authority instrument **if** later contracting requires them | BLANK — NOT FABRICATED | E1-B authorization recorded as company session authorization; signature fields blank by rule | Named signatory, role, authority instrument **if** demanded | Identify process; do not invent names | Board / company officer — **OWNER NOT ESTABLISHED** | Not automatically the signatory | No | **YES** if contracting | **No** for information-gathering | **No** for intake | **No** | **Blocks contracting**, not Production hosting by itself | **NO** for executing a contract. Process identification **YES** | Leave blank until contracting; do not use Counsel as default signatory | OPEN — BLANK |
| HUM-15 | GAP-BKP-02 (**C**) | Whether PITR/WAL is **adopted** as a Production control (candidate today) | CANDIDATE — NOT SELECTED | Business zero tolerated data loss ≠ technical RPO=0; E2 lab PARTIAL | Provider WAL/PITR capability; Owner/IT adopt/not-adopt | Do **not** adopt now. After evidence, record adopt or not | Owner + IT — **OWNER NOT ESTABLISHED** | Placement of WAL **later** | No | **YES** after evidence | **YES** | **No** | Affects backup architecture | Relative to zero-loss envelope | **NO** | Keep candidate; do not claim RPO=0 | OPEN — CANDIDATE |

---

## DECISIONS POTENTIALLY RESOLVABLE NOW

These do **not** require a provider reply. They still require a competent human. **None is marked resolved by this file.**

| Item | Why it can proceed now |
| --- | --- |
| HUM-01 entity extract | Company files / registry |
| HUM-02 PDPC status artefact | Company / regulator / Legal Counsel files |
| HUM-03 DPO appointment or documented non-appointment | Company appointment authority |
| HUM-04 geography census | Internal commercial/ops records |
| HUM-05 current corporate IdP fact | Company IT inventory |
| HUM-07 BCM governing sequence (CD-01) | Company Owner/BCM decision; both sequences already written |
| HUM-08 paper operational RACI | Company assignment of roles |
| HUM-11 whether to send the authorized RFI/clarification | Human communicator; package already READY / NOT SENT |
| HUM-12 IR/notice **owner title** (not publication) | Company assignment |
| HUM-14 whether a later contracting process will demand a named instrument | Company process fact |

Existing-contract harvest (GAP-LEG-05 **existing paper only**) is a **fact collection** that can proceed now. **Vendor Production DPAs** remain provider-dependent.

---

## DECISIONS THAT SHOULD WAIT FOR PROVIDER EVIDENCE

Do **not** make these decisions in this sprint. A human preference is **not** a substitute for provider geography, product, or quote evidence.

| Item | Why it should wait |
| --- | --- |
| HUM-10 Production jurisdiction | Need PE-03 / actual regions. Tanzania preference ≠ approval |
| HUM-10 backup jurisdiction | Need PE-06 |
| HUM-10 DR jurisdiction | Need PE-07; Restricted+ copies depend on location |
| HUM-06 KMS/secrets **product** | ADR-0012: evaluate after ADR-0006 hosting evidence |
| HUM-05 Production IdP **hosting** (if not purely on-prem/corporate already evidenced) | Identity processing location is provider-dependent if hosted |
| HUM-09 cost-acceptance / TCO decision | Need quotes (GAP-TCO-01/02) |
| HUM-13 ADR-0006 / DP-0006 / E1 approval | Need evidence pack including provider evidence |
| HUM-15 adopt PITR as Production control | Need WAL/PITR capability evidence |
| Technical recovery requirements acceptance (measured RTO/RPO) | Class E; lab ≠ Production |
| Architecture / provider selection | Explicitly out of scope |

---

## Closed this sprint

**None.** Preparation ≠ closure.

---

## Additive — 2026-09-17 owner decision (not a rewrite of the matrix)

Instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md). The matrix table above remains the **sprint-preparation** snapshot.

Later owner confirmation closed **HUM-07 / CD-01** (S2) and the **HUM-03 company-decision component** (Wensley Shirima designated DPO) and **HUM-11 named sender + SEND** (Patrick Makundi). Formal appointment evidence, PDPC, entity extract, census, IdP, other RACI names, jurisdictions, PITR adoption, and **actual RFI transmission** remain open. Combined Legal/DPO remains **INCOMPLETE**. E1 remains **NOT APPROVED / BLOCKED**. Technical RTO/RPO remain **NOT DEMONSTRATED**.
