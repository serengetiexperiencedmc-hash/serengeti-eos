# E1-C01 Human Legal / DPO Review Routing Package

> **`READY FOR QUALIFIED HUMAN LEGAL/DPO REVIEW`**  
> **`THIS IS NOT LEGAL CLEARANCE`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**  
> **`NO PROVIDER / REGION SELECTED`**  
> **`NO DPO / ATTESTOR / SIGNATURE INVENTED`**

Formal determinations must be recorded only in:

[`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

This routing file is **not** that instrument. Completing a review of this package does **not** complete E1-C01.

---

## 1. Purpose

This document packages **audited Phase 1 factual evidence** and **unresolved legal/privacy questions** so a qualified Human Legal Counsel, DPO, privacy professional, or other authorized legal/privacy reviewer can perform review.

It is:

- a **review-routing and evidence map**;
- a **question list** with supporting artefacts;
- a **blank decision template** for the human reviewer.

It is **not**:

- a legal opinion;
- a DPO attestation;
- regulatory approval;
- Production authorization;
- UAT authorization;
- architecture selection;
- a completed Record of Processing Activities;
- a finding that any jurisdiction’s law applies.

AI-generated materials cited below remain **AI COUNSEL ANALYSIS** only. They are not signed legal opinions, external counsel opinions, DPO determinations, or regulator decisions.

Phase 1 audit result (read-only): **PASS WITH NON-BLOCKING OBSERVATIONS** — [`adr-0006-e1-c01-phase1-internal-evidence-audit.md`](adr-0006-e1-c01-phase1-internal-evidence-audit.md).

**“Ready for review”** means the factual package is organized for a human reviewer. It does **not** mean legal clearance exists.

---

## 2. Current governance status

| Item | Status (unchanged) |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| Production hosting / database / infrastructure / migration / deployment | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Provider / region / backup / DR / IdP / email / CDN/WAF / monitoring / object storage | **NOT SELECTED** |
| Human LA-01–LA-17 determinations | **Legal Counsel 17/17 CONFIRMED/ADOPTED** — THOMAS NGULUMA — 15 SEPTEMBER 2026. **DPO 0/17 NOT ESTABLISHED** |
| L-01–L-17 | **Legal Counsel rules CONFIRMED/ADOPTED 17/17**; L-05/L-17 **DEFERRED**; DPO **NOT ESTABLISHED** |
| ADR-0006 | Proposed — **blocked** |
| DP-0006 | **OPEN** |

Company Tanzania hosting **preference** is **not** selected hosting. Preferred ≠ approved.

---

## 3. Evidence authority hierarchy

Lower-level material **must not** be silently promoted.

| Rank | Category | Meaning in this package |
| --- | --- | --- |
| 1 | **FACT** | Directly supported by a repository record or identifiable business artefact |
| 2 | **COMPANY POSITION** | SEDMC business/design preference (LA-01–LA-17 company-position file) |
| 3 | **DESIGN INTENT** | Intended future architecture/control, not implemented Production evidence |
| 4 | **AI COUNSEL ANALYSIS** | [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md), [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md), and [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) — analysis/review **support only**; proposed determinations **≠** human attestation |
| 5 | **HUMAN LEGAL/DPO DETERMINATION** | Must be entered by a qualified human in the **formal attestation package** |
| 6 | **EXTERNAL EVIDENCE** | Registry extract, regulator record, executed contract, vendor location proof, etc. |

A company position is not a fact of incorporation.  
A design intent is not an implemented control.  
AI counsel analysis is not a human legal determination.  
A Dev/Test capability (including P1 RoPA register and a software role key `dpo`) is not Production evidence and is not a DPO appointment.

---

## 4. Reading order for the reviewer

1. Consolidated review pack (primary navigation): [`adr-0006-e1-c01-consolidated-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-consolidated-human-legal-dpo-review-pack.md).  
2. This routing package (question IDs RQ-E* / XE-*).  
3. Phase 1 audit: [`adr-0006-e1-c01-phase1-internal-evidence-audit.md`](adr-0006-e1-c01-phase1-internal-evidence-audit.md).  
4. Phase 1 index: [`adr-0006-e1-c01-phase1-internal-evidence-index.md`](adr-0006-e1-c01-phase1-internal-evidence-index.md).  
5. Phase 1 artefacts E-01, E-04, E-05, E-06, E-13, E-15, E-16, E-18, optional E-12.  
6. Company positions: [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md).  
7. Evidence closure register: [`adr-0006-e1-c01-evidence-closure-register.md`](adr-0006-e1-c01-evidence-closure-register.md).  
8. AI counsel analysis and L-01–L-17 counsel review (**support only**).  
9. Companion review pack: [`adr-0006-e1-c01-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-human-legal-dpo-review-pack.md).  
10. Record determinations **only** in [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md).

Stale §7 `UNKNOWN` cells in the attestation package were **intentionally not rewritten**. Company positions override the fact pack for **business** facts; legal Determination fields remain human.

Counsel-review filename: use [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md). Path `adr-0006-e1-c01-counsel-review.md` **does not exist** (do not create a duplicate).

---

## 5. Human review question matrix

Every **Human determination required** cell is:

`PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW`

No cell below is a legal conclusion.

| ID | Question | Evidence supporting review | Human determination required | External evidence potentially required | Architecture dependent? |
| --- | --- | --- | --- | --- | --- |
| RQ-E01 | What is the legally registered SEDMC entity, registered office, and Tanzania establishment (if any) for EOS? | E-01 placeholder; company LA-01 **position**; fact-pack L1 UNKNOWN; Dev seed `legalName` is **not** incorporation evidence | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Corporate registry / incorporation extract; registered-office evidence | No |
| RQ-E02 | If Tanzania PDPA applies, is PDPC controller/processor registration required for EOS Production processing? | Company LA-02 position; AI counsel L-01 **support only**; E-18 TZ screening (no applicability finding) | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | PDPC registration record **if** determined required; official PDPC process texts | Low (applicability now; certificate later if required) |
| RQ-E03 | Which applicable laws require a DPO or other privacy-responsible function? Has one been appointed? | E-03 gap; P1 software role key `dpo` is **not** appointment; no name in repository | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Appointment / PDPC introduction **if** required | No for trigger; artefact later if required |
| RQ-E04 | Is the Phase 1 EOS processing inventory complete and accurate for intended Production (personal vs corporate; current vs FUTURE)? | E-04 inventory; audit PASS; named delegates/passport/health **FUTURE / NOT CURRENTLY EVIDENCED**; document bytes **UNKNOWN** | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` (completeness / characterisation) | Off-EOS processes (mailboxes, WhatsApp, spreadsheets) if they exist | Recipients/locations **yes** |
| RQ-E05 | What is the actual data-subject geography vs client geography vs programme destination vs EOS processing location? | E-05 layers A–D; target markets ≠ actual census; Layer D **NOT SELECTED** | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` (legal geography) | Client/contact census if required; vendor regions for Layer D | Layer D **yes** |
| RQ-E06 | For each major activity, is SEDMC controller, processor, joint controller, or other — and what is the client’s role? | E-06 factual candidate matrix; no DPAs found; delegate processing not structured in EOS | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Executed client/vendor DPAs and instructions | Vendor rows **yes** |
| RQ-E10 | What **framework rule** applies to extra-territorial transfers (no universal mechanism)? Which path-specific tool is required once paths exist? | Company LA-10/LA-11 positions; AI counsel L-07 **support only**; no SCCs/permit/IDTA in repo | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Permit/instrument **if** a path exists and law requires one | Instruments **yes**; framework rule **current** |
| RQ-E11 | Once offerings exist, which providers are subprocessors, where do they process, and what flow-down is required? | E-11/E-19–E-30 **NOT SELECTED**; hosting-capability slots empty | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` after candidates exist | Provider location docs; subprocessor lists; DPAs | **Yes** |
| RQ-E12 | What privacy notice is required, and is the E-12 skeleton adequate as a starting point? | E-12 `DRAFT — NOT LEGALLY APPROVED`; no bases/DPO/providers/contacts invented | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Recipients after vendors; contact details after E-01 | Recipients/transfers **yes** |
| RQ-E13 | What retention, deletion, and erasure rules apply, including audit immutability and backups? | E-13 matrix; all periods TBD; deletion **not implemented** | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Contracts/tax statutes; backup TTL after vendor | Backup overlay **yes** |
| RQ-E15 | Which personal-data incident/breach notification rules apply (regulator, client, data subject, vendor)? | E-15 documented process **draft**; implemented/tested **not evidenced**; no unsourced clocks | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Contractual notice clauses; regulator mapping | Provider clauses **yes** |
| RQ-E16 | Which actual EOS/document data are statutory sensitive/special-category (or equivalent) under applicable law? | E-16 internal ≠ statutory; Restricted/Restricted+/Highly Restricted are **internal** labels | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | File-content census | Census **partial** |
| RQ-E17 | Does planned EOS Production processing require a DPIA or equivalent privacy-risk assessment? | P2 is a **register capability**, not a completed Production DPIA; no Production screening record | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | None for a screening record; full DPIA may need topology | Full DPIA may **yes** |
| RQ-E18 | Which of TZ, KE, EU/EEA, UK, ZA, Middle East, CA, US, LATAM laws actually apply to evidenced EOS facts? | E-18 screening; company target markets; **no** law-applies finding | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | E-01 extract; later transfer facts | Transfer facts refine later |
| RQ-E19-30 | What are the Production locations and providers for hosting, PG, objects, backup, DR, IdP, email, monitoring, CDN/WAF, KMS, support geography? | Register E-19–E-30 **MISSING** / architecture-dependent; Tanzania **preferred not selected** | Reviewer may set **placement rules**; must **not** select architecture here | Vendor region/subprocessor evidence **when** candidates exist | **Yes** |
| RQ-E31 | Formal LA-01–LA-17 determinations with identity, qualification, date, signature | Attestation §7 blank; company positions recorded 17/17 as **company layer only** | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | As listed per LA in §8 | Some LA items conditional on architecture |
| RQ-E32 | Formal L-01–L-17 closure or explicit deferral of architecture-dependent items | Counsel review: framework-sound with conditions; **NOT COMPLETED** | `PENDING QUALIFIED HUMAN/DPO/LEGAL REVIEW` | Supporting E-items as mapped | L-05 / L-17 **yes** |

---

## 6. Human review checklist

The reviewer should work through the checklist. Ticking a box here is **not** attestation. Record determinations in the formal package.

### 6.1 Corporate / legal status

- [ ] Legal entity name (not branding; not Dev seed)
- [ ] Registration / incorporation number and registry
- [ ] Registered office
- [ ] Place(s) of establishment relevant to privacy law
- [ ] Operating jurisdictions (business fact vs legal establishment)
- [ ] Trading name used in EOS vs registered name

### 6.2 Processing roles

- [ ] SEDMC role per major activity (controller / processor / joint / other)
- [ ] Client role where the client supplies personal data
- [ ] Supplier/hotel/vendor role
- [ ] Technology provider role **if/when** selected (do not assume processor)
- [ ] Whether named delegate/traveller processing is in first Production scope

### 6.3 Data inventory

- [ ] Current EOS structured fields (E-04)
- [ ] Unstructured document bytes (**UNKNOWN**)
- [ ] Personal data vs purely corporate/commercial information
- [ ] Sensitive/special-category (statutory — not internal Restricted+)
- [ ] Employee / principal / HR certification data
- [ ] Supplier/hotel contact data (including `sup_contacts`)
- [ ] Programme/delegate information (**not** currently structured as named delegates)
- [ ] Off-EOS processing (email mailboxes, messaging, spreadsheets) if any

### 6.4 Jurisdiction

Do **not** assume every listed market’s law applies.

- [ ] Tanzania
- [ ] Kenya
- [ ] EU/EEA
- [ ] United Kingdom
- [ ] South Africa
- [ ] Middle East (region ≠ one statute)
- [ ] Canada
- [ ] United States
- [ ] Latin America (region ≠ one statute)

### 6.5 Transfers (paths not selected)

Reviewer may define **rules**. Do not select locations here.

- [ ] Hosting
- [ ] Backup
- [ ] DR
- [ ] Support / foreign admin
- [ ] Email
- [ ] IdP
- [ ] Monitoring / logging
- [ ] CDN / WAF
- [ ] Object storage
- [ ] Subprocessors

### 6.6 Retention

- [ ] Operational / CRM / RFP / programme records
- [ ] Commercial / costing / approvals
- [ ] Contracts
- [ ] Financial records
- [ ] Audit logs (immutability vs erasure)
- [ ] Security logs
- [ ] Documents (application `deleted` ≠ destruction)
- [ ] Backups / restore rehydration
- [ ] Erasure / anonymisation design

### 6.7 Incident response

- [ ] Detection (not Production-ready)
- [ ] Containment
- [ ] Assessment
- [ ] Internal escalation
- [ ] Regulator notification mapping (**no unsourced deadlines**)
- [ ] Data-subject notification
- [ ] Client notification
- [ ] Processor/vendor notification

### 6.8 Privacy governance

- [ ] Privacy notice (E-12 skeleton only)
- [ ] Data-subject rights
- [ ] Lawful basis **where applicable law requires a basis**
- [ ] DPIA / equivalent screening
- [ ] Records of processing (P1 capability ≠ completed Production RoPA)
- [ ] DPO / privacy lead
- [ ] Regulator registration
- [ ] Transfer documentation

---

## 7. External evidence request list

Status vocabulary: `REQUESTED` · `RECEIVED` · `VERIFIED`.  
**No item is RECEIVED or VERIFIED.** Repository search did not find these artefacts.

| ID | Artefact | Status | Why a reviewer may request it | Related questions |
| --- | --- | --- | --- | --- |
| XE-01 | Corporate registry / incorporation extract | `REQUESTED` | Close E-01 / LA-01 establishment | RQ-E01, RQ-E31 |
| XE-02 | Certificate of incorporation / equivalent | `REQUESTED` | Confirm legal personality | RQ-E01 |
| XE-03 | Registered-office / establishment evidence | `REQUESTED` | Tanzania (and other) establishment tests | RQ-E01, RQ-E18 |
| XE-04 | PDPC registration evidence | `REQUESTED` | Only **if** RQ-E02 determines registration is required | RQ-E02 |
| XE-05 | DPO appointment / PDPC introduction | `REQUESTED` | Only **if** RQ-E03 determines a DPO is required | RQ-E03 |
| XE-06 | Other regulator correspondence | `REQUESTED` | If any exists | RQ-E02, RQ-E18 |
| XE-07 | Executed client DPAs / instructions | `REQUESTED` | Role and notice mapping | RQ-E06, RQ-E15 |
| XE-08 | Executed supplier/vendor DPAs | `REQUESTED` | Supplier/hotel processing | RQ-E06 |
| XE-09 | Provider data-processing terms | `REQUESTED` | After a provider is later selected | RQ-E11, RQ-E19-30 |
| XE-10 | Provider geographic-location documentation | `REQUESTED` | After selection | RQ-E11, RQ-E19-30 |
| XE-11 | Subprocessor lists | `REQUESTED` | After selection | RQ-E11 |
| XE-12 | Transfer permits / SCCs / IDTA / other mechanisms | `REQUESTED` | Only for **actual** paths if required — **do not assume a PDPC permit** | RQ-E10 |
| XE-13 | Current public/client privacy notices | `REQUESTED` | Compare with E-12 skeleton | RQ-E12 |
| XE-14 | Approved retention schedule | `REQUESTED` | Periods are TBD in E-13 | RQ-E13 |
| XE-15 | Contracts with retention/limitation clauses | `REQUESTED` | Commercial/contract retention | RQ-E13 |
| XE-16 | Incident-response contractual clauses | `REQUESTED` | Client/vendor notice | RQ-E15 |
| XE-17 | Provider security documentation | `REQUESTED` | After selection; not claimed now | RQ-E19-30, E-14 |
| XE-18 | DPIA / privacy-risk assessment | `REQUESTED` | If RQ-E17 determines one is required | RQ-E17 |
| XE-19 | Production architecture / location evidence | `REQUESTED` | Does **not** exist; do not invent | RQ-E19-30, L-05, L-17 |

Dev/Test Gate-B/Gate-C dumps and `LocalFsDocumentStorage` are **not** Production location evidence.

---

## 8. Attestation preparation map

Record answers **only** in the formal package. This map is navigation. Stale §7 “Current documented position” cells are **not** reproduced as completed determinations.

### 8.1 LA-01 → LA-17

| LA | Topic | Phase 1 / related evidence | Human question | External evidence | Formal attestation field |
| --- | --- | --- | --- | --- | --- |
| LA-01 | Controller / establishment | E-01, E-06; company LA-01 | RQ-E01, RQ-E06 | XE-01–XE-03 | Attestation **§7 LA-01** Human answer / Determination / Attestor / Date |
| LA-02 | Tanzania PDPA | E-18 TZ row; company LA-02 | RQ-E02, RQ-E18 | XE-04 if required | **§7 LA-02** |
| LA-03 | Kenya DPA | E-18 KE; E-05 Layer C; company LA-03 | RQ-E18 | Possibly contracts/census | **§7 LA-03** |
| LA-04 | GDPR / UK GDPR | E-18 EU/UK; E-05 target markets | RQ-E18 | Offering/monitoring facts if any | **§7 LA-04** |
| LA-05 | Data-subject geography | E-05; E-18 | RQ-E05 | Census if required | **§7 LA-05** |
| LA-06 | Production primary-data geography | E-19; company **preference** only | RQ-E19-30 — **rules, not selection** | XE-10, XE-19 when candidates exist | **§7 LA-06** |
| LA-07 | Backup geography | E-22 | Placement **rules** only | XE-10, XE-19 | **§7 LA-07** |
| LA-08 | DR / replica geography | E-23 | Placement **rules** only | XE-10, XE-19 | **§7 LA-08** |
| LA-09 | Warm-standby geography | Company LA-09; no Production warm standby selected | Placement **rules** only | XE-19 | **§7 LA-09** |
| LA-10 | Cross-border transfers | E-09/E-10; E-18 | RQ-E10 | XE-12 when paths exist | **§7 LA-10** |
| LA-11 | Transfer mechanism | E-10; company LA-11 | RQ-E10 | XE-12 | **§7 LA-11** |
| LA-12 | Restricted data | E-16, E-04 | RQ-E16 | File census | **§7 LA-12** |
| LA-13 | Highly Restricted / Restricted+ | E-16, E-04 | RQ-E16 | File census | **§7 LA-13** |
| LA-14 | Restricted+ failover | E-16; architecture unset | Rules only; no topology | XE-19 | **§7 LA-14** |
| LA-15 | Subprocessors | E-11, E-30 | RQ-E11 | XE-09–XE-11 | **§7 LA-15** |
| LA-16 | Administrative / support geography | E-29; company control **preference** | Standard now; countries later | XE-09; support geography after vendor | **§7 LA-16** |
| LA-17 | Logs / IdP / CDN / WAF / email | E-24–E-28 | RQ-E19-30 | XE-10, XE-19 | **§7 LA-17** |

Attestation **§3 Attestor** block records THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N. DPO remains **NOT ESTABLISHED**. Do not fill a DPO identity here.

### 8.2 L-01 → L-17

| L | Topic | Phase 1 / related evidence | Human question | External evidence | Formal destination |
| --- | --- | --- | --- | --- | --- |
| L-01 | PDPC registration if PDPA applies | RQ-E02; E-02 | RQ-E02 | XE-04 if required | E-32 / attestation (human L closure; package is LA-structured — record L closure in attestation supporting evidence / conditions as the reviewer directs) |
| L-02 | DPO / privacy lead | RQ-E03 | RQ-E03 | XE-05 if required | E-32 |
| L-03 | Processing inventory | E-04 | RQ-E04 | Off-EOS processes | E-32 |
| L-04 | Controller/processor matrix | E-01, E-06 | RQ-E06 | XE-07, XE-08 | E-32; LA-01 |
| L-05 | Data-flow map | E-08, E-19–E-29 | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | XE-19 | **Architecture-dependent** |
| L-06 | Transfer register | E-09 | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** (populated paths) | XE-12, XE-19 | **Architecture-dependent** |
| L-07 | Transfer mechanism | E-10 | RQ-E10 (rule now; instruments later) | XE-12 | E-32; LA-11 |
| L-08 | Subprocessor register | E-11 | RQ-E11 | XE-11 | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** |
| L-09 | Contracts | E-07, E-30 | Sufficiency when contracts exist | XE-07–XE-09 | Post-provider |
| L-10 | Privacy notice | E-12 | RQ-E12 | XE-13 | E-32; later publication |
| L-11 | Retention/deletion | E-13, E-22 | RQ-E13 | XE-14, XE-15 | E-32 |
| L-12 | Production TOMs | E-14, E-29 | After stack selected | XE-17 | Production implementation |
| L-13 | Breach / incident | E-15 | RQ-E15 | XE-16 | E-32 |
| L-14 | Sensitive data | E-16, E-04 | RQ-E16 | File census | E-32; LA-12/13 |
| L-15 | DPIA / equivalent | E-17 | RQ-E17 | XE-18 if required | E-32; LA related screening |
| L-16 | Source-market assessment | E-05, E-18 | RQ-E18 | XE-01, census | E-32; LA-02–LA-05 |
| L-17 | Review of **actual** architecture | E-08, E-19–E-30 | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed.** | XE-19 | **Architecture-dependent hard gate** |

L-item determinations are **not** pre-filled. Counsel review assessed **framework quality** only (`NOT COMPLETED`).

---

## 9. Question categories (not legal determinations)

This classification organizes work. It is **not** a finding that a law applies or that a role is legally held.

### Category A — Factually prepared

The repository contains enough **facts / positions / drafts** for the reviewer to understand the issue:

- EOS modelled processing classes (E-04), including what is **not** structured (delegates/passport/health/PAN).
- Geography **layers** and target-market list (E-05, E-18).
- Factual purpose/means observations (E-06).
- Retention **classes** without periods (E-13).
- Draft incident process vs unimplemented/untested controls (E-15).
- Internal vs statutory classification worksheet (E-16).
- Company LA-01–LA-17 **positions**.
- Governance status: no provider/region; Production unauthorized.

### Category B — Human legal determination required

Evidence exists (or gaps are documented) but **legal interpretation** is required:

- RQ-E02, RQ-E03 applicability/triggers.
- RQ-E06 legal roles.
- RQ-E10 transfer **framework rule**.
- RQ-E12 notice adequacy / lawful basis (where a basis is required).
- RQ-E13 legal/contractual periods and erasure vs immutable audit.
- RQ-E15 notification mapping.
- RQ-E16 statutory sensitive/special-category characterisation.
- RQ-E17 whether DPIA/equivalent is required.
- RQ-E18 applicability of TZ/KE/EU/UK and whether other markets need a deeper memo.
- RQ-E31 / RQ-E32 formal attestation.

### Category C — External evidence required

The repository **cannot** establish the fact:

- Legal entity / establishment extract (XE-01–XE-03).
- PDPC registration / DPO appointment artefacts **if** required (XE-04, XE-05).
- Executed DPAs and provider terms (XE-07–XE-11).
- Transfer instruments for actual paths (XE-12).
- Contractual retention and IR clauses (XE-15, XE-16).

### Category D — Architecture-dependent

Cannot be finalized until Production architecture/provider/location exists. Marked **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**:

- E-08, E-09, E-11, E-19–E-30.
- L-05, L-17.
- Provider/location-specific transfer assessments.
- Recipients in the notice; backup overlay; populated transfer register; subprocessor register; support **countries**.

The reviewer may issue **placement constraints**. This package must **not** be used to select Tanzania hosting, African cloud, EU hosting, Tanzania backup, EU backup, African DR, warm standby, or any named provider.

---

## 10. Reviewer decision template (blank)

Copy one block per question. **Leave human identity fields blank until a real reviewer completes them.** Do not insert a fictitious reviewer.

```
Question ID:                 ________________
Determination:               [ ] APPROVED / CONFIRMED
                             [ ] NOT APPROVED
                             [ ] CONDITIONALLY APPROVED
                             [ ] NOT APPLICABLE
                             [ ] REQUIRES FURTHER REVIEW
Scope:                       ________________
Conditions:                  ________________
Supporting evidence:         ________________
Legal source(s), if applicable: ________________
Reviewer name:               ________________
Reviewer role:               ________________
Organization:                ________________
Qualification / authority:   ________________
Date:                        ________________
Signature:                   ________________
Follow-up action:            ________________
Evidence required:           ________________
Status:                      OPEN
```

Authoritative recording location remains the **formal attestation package**, not this template.

---

## 11. Formal attestation package (do not complete here)

Inspect, do not fill:

[`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

Fields the human reviewer should complete **there** (listed, not populated):

- §3 Attestor identity, role, organization, qualification, review date, jurisdictions, supporting documents, signature/approval mechanism, overall package determination.
- §5/§7 per LA-01–LA-17: Human answer, Determination, Scope, Jurisdictions, Conditions, Supporting evidence, Attestor, Date.
- Status of each item from OPEN to the reviewer’s chosen determination.

This routing package does **not** reproduce those answers. Stale §7 “Current documented position” `UNKNOWN` wording is a known non-blocking observation; **do not treat it as the company’s current business-position file**, and **do not treat it as a completed Determination**.

---

## 12. Architecture gate

The following remain unresolved until a Production architecture exists. This review package does **not** select or imply Tanzania hosting, African cloud, EU hosting, Tanzania backup, EU backup, African DR, warm standby, or a specific provider.

| ID | Why it waits |
| --- | --- |
| E-08 | No Production data-flow map |
| E-09 | No Production transfer paths |
| E-11 | No Production subprocessors |
| E-19 | Hosting jurisdiction not selected (Tanzania is **preferred only**) |
| E-20 | Production PostgreSQL location not selected (Gate-B/Dev PG excluded) |
| E-21 | Production object storage not selected (`LocalFsDocumentStorage` is Dev) |
| E-22 | Production backup location not selected (Gate-B/C dumps excluded) |
| E-23 | Production DR not selected (lab site-failure ≠ DR jurisdiction) |
| E-24 | Production IdP not selected (ADR-0013 OPEN) |
| E-25 | Production email not selected |
| E-26 | Production monitoring not selected |
| E-27 | Production CDN/WAF not selected |
| E-28 | Production KMS/secrets not selected (ADR-0012 OPEN) |
| E-29 | Support/admin **countries** not known (control **standard** may be reviewed now) |
| E-30 | Subprocessor contracts wait on providers |
| L-05 | Requires the actual data-flow map |
| L-17 | Requires legal/privacy review of the **actual** selected architecture |

The reviewer may establish **legal placement, transfer, role, retention, sensitive-data, and privacy-risk constraints**. Actual architecture selection remains a **later governed decision** and is **not authorized** by this document.

---

## 13. AI counsel material — do not overstate

| File | What it is | What it is not |
| --- | --- | --- |
| [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md) | AI-generated counsel-style analysis of LA-01–LA-17 | Signed opinion; external counsel opinion; DPO determination; regulator decision |
| [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md) | AI counsel-style review of L-01–L-17 condition quality | Formal L-item closure; human attestation |
| [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) | Proposed counsel-style LA-01–LA-17 / L-01–L-17 determinations + EA-01–EA-10 official sources | Human attestation; signed legal opinion; SEDMC compliance evidence; Production authorization |

The reviewer may use them as **issue-spotting support**. They must not be copied into attestation Determination fields as if they were the human answer.

---

## 14. Final review-routing status

`LEGAL COUNSEL ATTESTATION RECORDED — DPO NOT ESTABLISHED`

and simultaneously:

`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`

`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`

`Production = NOT AUTHORIZED`

`UAT = NOT AUTHORIZED`

Ready for review = the factual package is organized. It is **not** legal clearance, DPO attestation, regulatory approval, or permission to select Production architecture.

---

## NEXT GOVERNANCE ACTION

`BEGIN EVIDENCE COLLECTION: LEGAL-ENTITY EXTRACT AND PDPC REGISTRATION STATUS; DPO EVIDENCE IF/WHEN APPOINTED; ARCHITECTURE REMAINS UNSELECTED.`

Do not recommend or perform Production architecture selection until Human Legal/DPO review establishes the applicable placement, transfer, processing-role, retention, sensitive-data, and privacy-risk constraints.
