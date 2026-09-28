# E1-C01 Current Evidence Readiness Register

> **`CURRENT EVIDENCE-COLLECTION READINESS REGISTER`**  
> **`THIS IS NOT LEGAL OPINION, DPO ATTESTATION, OR PRODUCTION AUTHORIZATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`DPO DETERMINATION: NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO: NOT COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**  
> **`Migration = NOT AUTHORIZED`**  
> **`Deployment = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE: UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**

**Register date (repository calendar):** 2026-09-16.  
**Purpose:** inventory what evidence is actually present after Legal Counsel attestation, and what remains to collect.  
**Does not:** invent artefacts; select a provider/region; appoint a DPO; close E1; authorize UAT or Production.

Legal Counsel confirmation establishes adoption of a legal/control position (**A**). It does **not** establish that SEDMC has implemented or supplied the corresponding factual/external artefacts (**B**).

Authoritative Legal Counsel record: [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)  
Collection queue: [`adr-0006-e1-c01-evidence-collection-queue.md`](adr-0006-e1-c01-evidence-collection-queue.md)  
E-01 / PDPC collection receipt: [`adr-0006-e1-c01-e01-pdpc-evidence-receipt.md`](adr-0006-e1-c01-e01-pdpc-evidence-receipt.md)  
Entity-name reconciliation: [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md)  
E-02 PDPC acquisition: [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md)  
E-03 DPO acquisition: [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md)  
Prior gap register (not replaced): [`adr-0006-e1-c01-evidence-closure-register.md`](adr-0006-e1-c01-evidence-closure-register.md)

---

## Legal Counsel (already recorded — not re-litigated)

| Field | Value |
| --- | --- |
| Name | THOMAS NGULUMA |
| Role | LEGAL COUNSEL only |
| Date | 15TH SEPTEMBER 2026 |
| Approval | A.T.N |
| Confirmation | “I confirm that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position.” |
| LA-01–LA-17 | 17/17 APPROVED / CONFIRMED / ADOPTED, qualifications preserved |
| L-01–L-17 | 17/17 CONFIRMED / ADOPTED |
| L-05 | DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE |
| L-17 | DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE |
| DPO | NOT ESTABLISHED |
| Thomas Nguluma as DPO | **Not recorded.** LEGAL COUNSEL ONLY. P1 role key `dpo` is not an appointment. |

---

## Classification vocabulary (this register)

Exactly one primary class per inventory item. A document existing is **not** “complete”.

| Class | Meaning |
| --- | --- |
| VERIFIED INTERNAL EVIDENCE | Repository fact that proves the stated thing (schema capability, recorded attestation identity, registered official-source URL). Does **not** mean Production-ready. |
| COMPANY POSITION | SEDMC business/planning statement. |
| LEGAL COUNSEL ADOPTED POSITION | Adopted legal/control rule. Not implementation evidence. |
| DRAFT / PREPARATORY | Internal draft that does not close the requirement. |
| EXTERNAL EVIDENCE REQUIRED | Authoritative artefact from registry, regulator, counterparty, or vendor is absent. |
| HUMAN/DPO ACTION REQUIRED | DPO or remaining qualified human action still required. |
| ARCHITECTURE DEPENDENT | Cannot be completed until an actual Production topology/provider exists. |
| NOT ESTABLISHED | No appointment, selection, or artefact exists. |
| NOT APPLICABLE | Not used in this register unless a requirement is genuinely out of scope. |

Evidence-authority labels used in the table: Application/Dev seed · Company position · Legal Counsel adopted position · Phase 1 draft · Official source URL · Absent.

---

## 1. Inventory summary (Task 1)

| # | Subject | Primary class | Notes |
| --- | --- | --- | --- |
| 1 | Legal entity / establishment | **COMPANY-PROVIDED FACT** + **EXTERNAL EVIDENCE REQUIRED** · **NOT VERIFIED** | Company-provided legal name **Makundi Serengeti Experience DMC**. No extract. Seed `Serengeti Experience DMC Ltd` is **not** verified. Receipt + [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md) |
| 2 | Processing inventory | **DRAFT / PREPARATORY** | Schema/kernel facts are internal; inventory is not a Production RoPA. Recipients/locations wait on architecture. |
| 3 | Data-subject geography | **COMPANY POSITION** (target markets) + **DRAFT / PREPARATORY** (map) | Actual census **MISSING**. Processing location **ARCHITECTURE DEPENDENT**. |
| 4 | Processing-role matrix | **DRAFT / PREPARATORY** | Factual candidates only. Legal Counsel adopted role **framework** (LA-01). Contracts absent. Vendor rows **ARCHITECTURE DEPENDENT**. |
| 5 | Retention requirements | **DRAFT / PREPARATORY** | Classes listed. All periods **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT**. |
| 6 | Incident-response process | **DRAFT / PREPARATORY** | Documented process draft. Implemented/tested control **NOT ESTABLISHED**. |
| 7 | Data classification / legal mapping | **COMPANY POSITION** (internal labels) + **LEGAL COUNSEL ADOPTED POSITION** (internal ≠ statutory) | Statutory column still needs remaining human/DPO characterisation; file census incomplete. |
| 8 | Source-market applicability screening | **COMPANY POSITION** (target list) + **DRAFT / PREPARATORY** (screening) | Target market ≠ actual data-subject jurisdiction ≠ applicable law. |
| 9 | Privacy notice draft | **DRAFT / PREPARATORY** | `DRAFT — NOT LEGALLY APPROVED`. Entity, bases, DPO, recipients, transfers not stated. |
| 10 | Legal Counsel attestation | **LEGAL COUNSEL ADOPTED POSITION** | Recorded as supplied. Does not verify missing artefacts. |
| 11 | LA-01–LA-17 | **LEGAL COUNSEL ADOPTED POSITION** | 17/17 with conditions. Not DPO determinations. |
| 12 | L-01–L-17 | **LEGAL COUNSEL ADOPTED POSITION** | 17/17 rules. L-05 and L-17 also **ARCHITECTURE DEPENDENT** (not finally closed). |
| 13 | External legal authorities EA-01–EA-10 | **VERIFIED INTERNAL EVIDENCE** of **source URLs only** | `VERIFIED SOURCE`. **Not** SEDMC compliance, registration, or permit. |
| 14 | Architecture-dependent evidence | **ARCHITECTURE DEPENDENT** | No Production provider/country/region selected. Tanzania preference ≠ approval. |

---

## 2. Legal-entity evidence (E-01)

| Field | Value |
| --- | --- |
| Subject | Legal Entity / Establishment |
| Company-provided legal name | **Makundi Serengeti Experience DMC** |
| Evidence class | **COMPANY-PROVIDED FACT** |
| Verification | **NOT VERIFIED** |
| Authoritative evidence | **NOT AVAILABLE** |
| Required authoritative evidence | Corporate/registry evidence sufficient to establish the legal entity and relevant registration details |
| Status | **NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED** |

Do **not** mark E-01 VERIFIED. Do **not** treat this name as a BRELA finding. No certificate number, TIN, incorporation date, or registered office is recorded.

**Collection pass (2026-09-16):** repository searched. **No** certificate of incorporation, BRELA extract, TIN certificate, memorandum/articles, or registered-office document received or verified. See [`adr-0006-e1-c01-e01-pdpc-evidence-receipt.md`](adr-0006-e1-c01-e01-pdpc-evidence-receipt.md) and [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md).

| Layer | Present? | What it is |
| --- | --- | --- |
| A. Repository/application seed data | Yes | `apps/api/src/store.ts` Dev seed `legalName: "Serengeti Experience DMC Ltd"`; tenant/org `name: "Serengeti Experience DMC"`; location seed ARU / Arusha. **Application-derived. Not verified legal entity.** |
| B. Company-stated facts | Yes | (1) Tanzania-based DMC (company position). (2) **Legal name: Makundi Serengeti Experience DMC** (company-provided fact, 2026-09-16). Neither is a registry extract. |
| C. Actual authoritative corporate evidence | **No** | No BRELA certificate, certificate number, registered office extract, TIN, or incorporation date in this repository. Fact pack L1 establishment remains **UNKNOWN**. |

**E-01: NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED.**  
Do not treat seed `legalName`, tenant records, Arusha seed, or website/branding as incorporation evidence. A company-provided name is **not** authoritative corporate evidence. An acquisition checklist is **not** evidence.

---

## 3. PDPC registration (E-02)

| Field | Value |
| --- | --- |
| Status | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |
| Evidence | **No SEDMC-specific authoritative PDPC registration evidence available.** |
| Finding | **NO REGISTRATION EVIDENCE AVAILABLE** — not **AUTHORITATIVELY CONFIRMED NON-REGISTRATION** |
| Not claimed | That SEDMC is registered, or that SEDMC is not registered |

**This pass:** no PDPC certificate, registration number, confirmation, correspondence, receipt, or other regulator-issued document identifying the company. EA-02 is public **process** guidance only. See [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md).

Not inferred from: privacy drafts; P1 role key `dpo`; Legal Counsel adoption; application code; EA-02 webpage; company-provided legal name **Makundi Serengeti Experience DMC**.

Acquisition checklist ≠ evidence. Do **not** use “COMPLETE.”

**Final checkpoint (2026-09-16):** re-search found **no new** SEDMC-specific PDPC artefact. **NO SEDMC-SPECIFIC AUTHORITATIVE PDPC REGISTRATION/STATUS EVIDENCE IS AVAILABLE IN THE REPOSITORY.** Status unchanged.

---

## 4. DPO (E-03)

| Field | Value |
| --- | --- |
| Status | **NOT ESTABLISHED** |
| Evidence | **No authoritative DPO appointment evidence available.** |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |

**DPO APPOINTMENT — NOT ESTABLISHED.**

Searched: appointment letter; board/director resolution; formal designation; employment/role documentation; governance approval; PDPC record identifying a DPO. **None found.** P1 role key `dpo` is **not** an appointment. See [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md).

This register does **not** assign the DPO role to Thomas Nguluma. Do **not** use “COMPLETE.”

**Final checkpoint (2026-09-16):** re-search found **no new** appointment/designation artefact. **DPO APPOINTMENT NOT ESTABLISHED.** Status unchanged.

---

## 5. Contracts / DPAs (E-07)

| Kind | Repository finding |
| --- | --- |
| Client agreements / processor agreements / C2P terms / DPAs / subprocessor terms | **None found as executed artefacts** |
| Confidentiality / data-protection clauses | **None found as executed artefacts** |
| Templates / draft contract language | No executed-equivalent DPA pack. Schema can store supplier-contract **metadata** (`120_cd_supplier_contracts.sql`); that is not an executed DPA. |
| Unknown/unavailable | Treat as **unavailable in this repository** |

**Do not infer execution from templates, schema, or Legal Counsel rule adoption (L-09).**

---

## 6. Privacy notice (E-12)

Source: [`adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md)

| Element | Classification |
| --- | --- |
| Modelled processing classes (CRM, RFP, programme, costing, documents, audit, users) | Evidenced as **Dev/Test models** (E-04) |
| Business purposes (operate commercial pipeline) | Company-position / product design |
| “Do not invent bases / DPO / providers” restraint | Consistent with Legal Counsel adopted conditions |
| Legal entity, registered office, lawful bases, retention, transfers, DPO, regulator registration, provider names, rights wording, contacts | **Still requiring factual/legal completion** |

Status remains **`DRAFT — NOT LEGALLY APPROVED`**. This register does **not** convert the draft into an approved legal notice.

---

## 7. Retention (E-13)

Source: [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md)

| Record class | Authoritative period in repository |
| --- | --- |
| CRM contacts | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| RFPs | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Proposals | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Programmes | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Costing | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Contracts | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Supplier records | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Employee records | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Audit logs | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Security logs | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Documents | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** |
| Backups | **TO BE DETERMINED — LEGAL / CONTRACTUAL / BUSINESS REQUIREMENT** (overlay **ARCHITECTURE DEPENDENT**) |

Soft-delete columns and insert-only `audit_events` are technical facts, **not** legal periods. No statutory period is invented.

---

## 8. Incident / breach response (E-15)

Source: [`adr-0006-e1-c01-e15-personal-data-incident-response.md`](adr-0006-e1-c01-e15-personal-data-incident-response.md)

| Aspect | Status |
| --- | --- |
| Policy / documented process | **DRAFT / PREPARATORY** (proposed 12-step process) |
| Implemented control | **NOT ESTABLISHED** |
| Tested control | **NOT ESTABLISHED** |
| Legally reviewed notification matrix | **HUMAN/DPO ACTION REQUIRED** (Legal Counsel adopted L-13 as a **rule**; jurisdiction clocks not prescribed) |
| Jurisdiction-specific notification procedure | **NOT ESTABLISHED** (deadlines not sourced here) |

A written procedure is **not** testing evidence. Gate-B/E2 lab recovery is **not** a Production privacy-incident test.

---

## 9. Source-market / legal applicability (E-05 / E-18)

Company target-market list (position only): Tanzania; Kenya; EU/EEA; UK; South Africa; Middle East; Canada; USA; Latin America.

| Distinction | Current state |
| --- | --- |
| TARGET MARKET | Recorded as company position |
| ACTUAL DATA-SUBJECT JURISDICTION | **No Production census** |
| APPLICABLE LAW | Legal Counsel adopted **framework** (Tanzania primary; Kenya conditional; EU/UK potentially applicable). **Not** automatic applicability of any listed market’s statute |

Do **not** convert the market list into automatic legal applicability.

---

## 10. Architecture-dependent items (explicitly deferred)

All of the following remain **ARCHITECTURE DEPENDENT** / **NOT SELECTED**. No attempt is made to close them by assumption.

Production provider; Production country/region; PostgreSQL location; object storage; backup location; DR location; warm standby; IdP; email; monitoring/logging; CDN; WAF; KMS/secrets; subprocessors; transfer paths; provider-specific DPAs; transfer instruments; **L-05**; **L-17**; **E-08**; **E-09**; **E-11**; **E-19–E-30**.

**Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY.**  
**Tanzania ≠ APPROVED PRODUCTION LOCATION.**

---

## 11. Master table

| Evidence ID | Subject | Current Evidence | Evidence Authority | Status | Can Collect Now? | Required Source | Dependency | Next Action | Production Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | Legal Entity / Establishment | Company-provided legal name **Makundi Serengeti Experience DMC** (**COMPANY-PROVIDED FACT**). Seed `legalName` **Serengeti Experience DMC Ltd** remains application-derived. **No extract received.** Receipt + [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md) | Company-provided fact; **not** a corporate extract | **NOT VERIFIED** · **EXTERNAL / COMPANY EVIDENCE REQUIRED** | **YES** (company/registry files outside this repo) | Corporate/registry evidence sufficient to establish the legal entity and relevant registration details | None | Obtain extract matching or reconciling the supplied name; do not use seed data | **E1 and Production blocker** |
| E-02 | PDPC registration | **No SEDMC-specific authoritative PDPC registration evidence available.** EA-02 = public process page only. Acquisition: [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md) | Official source URL ≠ company registration | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** | **YES** (PDPC / SEDMC Legal files) | Company-specific PDPC artefact **or** documented status (including confirmed non-registration **if** that artefact exists) | L-01 rule adopted; E-01 name not a substitute | Obtain actual status evidence; checklist ≠ evidence | **Production blocker if required**; E1 blocked while unknown |
| E-03 | DPO appointment | **No authoritative DPO appointment evidence available.** Thomas Nguluma is Legal Counsel only. P1 `dpo` ≠ appointment. Acquisition: [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md) | Absent | **NOT ESTABLISHED** | Company decision **yes**; appointment artefact **if** appointed | Appointment / designation **if** made; trigger determination; regulator notice **if applicable** | L-02 rule adopted | Do **not** appoint via this register | **E1 combined Legal/DPO blocker**; Production blocker if appointment is required |
| E-04 | Processing inventory | Phase 1 inventory from models; P1 RoPA capability; named delegates/passport/health **FUTURE** | Phase 1 draft + schema FACT | **DRAFT / PREPARATORY** | **YES** (internal completeness: off-EOS processes, file census) | Privacy/ops inventory completeness | Recipients/locations wait on architecture | Complete internal census; not a Production RoPA yet | Partial E1; locations **Production/architecture** |
| E-05 | Data-subject geography | Target-market list; layers A–D map; no actual census; Layer D unset | Company position + draft | **DRAFT / PREPARATORY** | **YES** for client/contact census from company records | Commercial/privacy census | Processing location = architecture | Collect actual jurisdictions; keep distinct from target markets | Partial E1; Layer D **architecture** |
| E-06 | Processing-role matrix | Factual candidate matrix; no contracts | Phase 1 draft | **DRAFT / PREPARATORY** | **YES** for SEDMC/client facts | SEDMC Legal + contracts | Vendor rows = providers | Do not invent legal roles from the draft | SEDMC/client roles E1-relevant; vendors **post-provider** |
| E-07 | Contracts / DPAs | None executed in repository | Absent | **EXTERNAL EVIDENCE REQUIRED** | **YES** for **existing** client/supplier paper if it exists in company files; **NO** for unnamed Production vendors | Counterparties / SEDMC Legal | Production vendors unknown | Collect existing agreements; do not invent DPAs | Existing client terms may be E1-relevant; vendor DPAs **post-provider** |
| E-08 | Production data-flow map | Dev Compose / local FS only | Dev topology ≠ Production | **ARCHITECTURE DEPENDENT** | **NO** | Actual Production topology | Architecture selection | Defer | **Production blocker** (L-05) |
| E-09 | Transfer register | Empty (no Production paths) | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Actual paths + vendor destinations | Architecture | Defer | **Production blocker** |
| E-10 | Transfer mechanisms | No SCC/IDTA/permit. EA-03/EA-10 are source pages only | Official source URLs ≠ SEDMC instruments | **EXTERNAL EVIDENCE REQUIRED** + **ARCHITECTURE DEPENDENT** | **NO** for path instruments | Path-specific instrument/permit **if** required | Actual transfers | Defer instruments; do not invent SCCs/permits | Instruments **Production**; “no universal mechanism” rule already adopted |
| E-11 | Subprocessor register | Hosting-capability slots empty | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Selected providers | Provider selection | Defer | **Production blocker** |
| E-12 | Privacy notice | Skeleton draft only | Phase 1 draft | **DRAFT / PREPARATORY** | **Partial** (cannot complete entity/DPO/recipients yet) | SEDMC Legal after E-01/E-03/providers | Entity, DPO, architecture | Keep as draft; do not publish as approved | **Production implementation** |
| E-13 | Retention | Matrix with all periods TBD | Phase 1 draft | **DRAFT / PREPARATORY** | **YES** for operational/legal/finance periods | SEDMC Legal + Finance + commercial | Backup TTL = architecture | Collect periods; do not invent statutes | Operational classes E1-relevant; backup **architecture** |
| E-14 | Production TOMs | Dev/design controls; `productionReady: false` | Design/Dev | **ARCHITECTURE DEPENDENT** | **NO** | Production stack | Architecture | Defer | **Production implementation** |
| E-15 | Incident / breach process | Documented-process draft | Phase 1 draft | **DRAFT / PREPARATORY** | **YES** to assign owners and implement internally; **NO** to claim tested/legal clocks | Security + SEDMC Legal; DPO if/when appointed | Monitoring vendor later | Do not claim testing | Documented process collectable; tested/regulator mapping still open |
| E-16 | Classification / legal mapping | Internal Restricted ≠ statutory (adopted). Statutory column not a completed DPO map | Company position + Legal Counsel adopted distinction + draft map | **DRAFT / PREPARATORY** | **YES** for remaining characterisation | SEDMC Legal; DPO if/when appointed | File census may wait on documents/architecture | Preserve internal ≠ statutory | Characterisation E1-relevant |
| E-17 | DPIA / privacy-risk screening | P2 register **capability** only; no Production screening record | Dev/Test capability | **HUMAN/DPO ACTION REQUIRED** | **YES** (screening record, not a fake DPIA) | SEDMC Legal; DPO if/when appointed | Full DPIA may need topology | Record screening; do not invent a completed DPIA | Screening E1-relevant; full DPIA may wait |
| E-18 | Source-market screening | Target list + factual screening; no automatic law-applies | Company position + draft | **DRAFT / PREPARATORY** | **YES** for facts; law conclusions remain qualified-human | Commercial facts + SEDMC Legal; DPO if/when appointed | Transfers after architecture | Keep TARGET vs SUBJECT vs LAW distinct | TZ/KE/EU/UK screening E1-relevant |
| E-19 | Production hosting jurisdiction | Tanzania **preferred**, not selected | Company preference | **ARCHITECTURE DEPENDENT** | **NO** | Later architecture decision | Separate governed architecture decision | Do **not** select here | **Production blocker** |
| E-20 | PostgreSQL Production location | Intended SoR = PostgreSQL. Gate-B/Dev PG ≠ Production | Design intent | **ARCHITECTURE DEPENDENT** | **NO** | Selected managed-PG region | Architecture | Defer | **Production blocker** |
| E-21 | Object storage | Dev `LocalFsDocumentStorage`. Production **NOT SELECTED** | Design/Dev | **ARCHITECTURE DEPENDENT** | **NO** | Selected object store | Architecture | Defer | **Production blocker** |
| E-22 | Backup location | Gate-B/C dumps excluded | Lab ≠ Production | **ARCHITECTURE DEPENDENT** | **NO** | Selected backup provider/location | Architecture | Defer | **Production blocker** |
| E-23 | DR location | None. Lab site-failure ≠ DR jurisdiction | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Selected DR | Architecture | Defer | **Production blocker** |
| E-24 | IdP | ADR-0013 OPEN. Local password IdP is Dev | Design/Dev | **ARCHITECTURE DEPENDENT** | **NO** | Selected IdP | Architecture | Defer | **Production blocker** |
| E-25 | Email | Dev SES mentions ≠ Production | Design/Dev | **ARCHITECTURE DEPENDENT** | **NO** | Selected email provider | Architecture | Defer | **Production blocker** |
| E-26 | Monitoring / logging | Not selected | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Selected monitoring | Architecture | Defer | **Production blocker** |
| E-27 | CDN / WAF | Not selected | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Selected CDN/WAF | Architecture | Defer | **Production blocker** |
| E-28 | KMS / secrets | ADR-0012 OPEN | Design | **ARCHITECTURE DEPENDENT** | **NO** | Selected KMS | Architecture | Defer | **Production blocker** |
| E-29 | Foreign admin/support access | Preferred **controls** recorded; countries unknown | Company position | **ARCHITECTURE DEPENDENT** (countries) | **NO** for countries | Vendor access model | Architecture | Control standard already adopted (LA-16) | Countries **Production** |
| E-30 | Subprocessor contracts / transfer controls | None — no providers | Absent | **ARCHITECTURE DEPENDENT** | **NO** | Selected vendors | Provider selection | Defer | **Post-provider Production** |
| E-31 | LA-01–LA-17 determinations | Legal Counsel 17/17 recorded. DPO 0/17 | Legal Counsel adopted position | **LEGAL COUNSEL ADOPTED POSITION** + **HUMAN/DPO ACTION REQUIRED** (DPO) | DPO only if/when appointed | DPO evidence if required | DPO appointment | Do not treat Legal Counsel as DPO | Combined Legal/DPO still blocks E1-C01 combined completion |
| E-32 | L-01–L-17 closure | Legal Counsel rules 17/17 adopted. L-05/L-17 not finally closed. DPO not established | Legal Counsel adopted position | **LEGAL COUNSEL ADOPTED POSITION** + **ARCHITECTURE DEPENDENT** (L-05/L-17) | No for L-05/L-17 maps | Actual topology | Architecture | Keep deferred items deferred | Rule adoption ≠ artefact closure |
| EA-01–EA-10 | Official legal-source register | Genuine PDPC/ODPC/EUR-Lex/ICO URLs | Official source URL | **VERIFIED INTERNAL EVIDENCE** of citations only | N/A | — | — | Do not treat as SEDMC compliance | Not a Production clearance |
| EV-LC | Legal Counsel attestation | THOMAS NGULUMA; LEGAL COUNSEL; 15TH SEPTEMBER 2026; A.T.N; confirmation quote | Company-supplied Legal Counsel | **LEGAL COUNSEL ADOPTED POSITION** | N/A | — | — | Preserve; do not expand credentials | Does **not** authorize Production |

Warm standby: **NOT SELECTED** (covered with E-23/architecture; LA-09 adopted as not automatically legally mandatory).

---

## 12. Historical vs current

| Document | Treatment |
| --- | --- |
| [`adr-0006-e1-c01-final-legal-package-reconciliation-audit.md`](adr-0006-e1-c01-final-legal-package-reconciliation-audit.md) | **HISTORICAL SNAPSHOT** (pre-attestation; 0/17 human fields). Not rewritten. |
| [`adr-0006-e1-c01-post-attestation-reconciliation-audit.md`](adr-0006-e1-c01-post-attestation-reconciliation-audit.md) | **HISTORICAL SNAPSHOT** of the Legal Counsel consistency audit. Not rewritten as this collection register. |
| Phase 1 E-01/E-04/E-05/E-06/E-12/E-13/E-15/E-16/E-18 artefacts and Phase 1 index/audit | **HISTORICAL PHASE 1 SNAPSHOTS**. Drafts remain drafts. Banners saying `E1-C01: INCOMPLETE` describe combined Legal/DPO incompleteness and Phase 1 evidence gaps; not rewritten. |
| This file | **CURRENT AUTHORITATIVE STATUS** for evidence-collection readiness. |

---

## 13. Governance status (current)

| Item | Status |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO | **NOT COMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| Migration | **NOT AUTHORIZED** |
| Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |

---

## 14. Technical integrity

This register did **not** modify application code, schema, migrations, infrastructure, deployment, or cloud configuration. No provider/country/region was selected. No git commit, push, PR, merge, or deploy.

**STOP.** Do not treat this register as E1 closure or Production readiness.
