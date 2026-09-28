# E1-C01 Consolidated Evidence-Gap and Closure-Readiness Audit

> **`READ-ONLY RECONCILIATION`**  
> **`THIS IS NOT LEGAL OPINION, DPO ATTESTATION, PDPC REGISTRATION, ARCHITECTURE SELECTION, OR PRODUCTION AUTHORIZATION`**  
> **`E1-C01 Legal Counsel component = COMPLETE`**  
> **`DPO component = NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`UAT / Production / Migration / Deployment = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE = UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**  
> **`THOMAS NGULUMA — LEGAL COUNSEL ONLY`**

**Audit date (repository calendar):** 2026-09-16.  
**Purpose:** one current-state view of E-01 through E-32 closure readiness.

**Reconciled against:** Legal Counsel attestation package; proposed counsel determinations (LA-01–LA-17 / L-01–L-17); company business position; current evidence readiness register; evidence collection queue; evidence closure register; evidence closure action plan; consolidated Human Legal/DPO review pack; counsel-style analysis; post-attestation reconciliation; Phase 1 E-01–E-18 artefacts; [`adr-0006-e1-c01-e04-e05-e06-evidence-completeness-audit.md`](adr-0006-e1-c01-e04-e05-e06-evidence-completeness-audit.md); [`adr-0006-e1-c01-e12-e13-e15-e16-e17-e18-evidence-completeness-audit.md`](adr-0006-e1-c01-e12-e13-e15-e16-e17-e18-evidence-completeness-audit.md).

**This audit does not:** rewrite those documents; alter attestation or LA/L determinations; select architecture; appoint a DPO; invent certificates, contracts, periods, or applicability findings.

---

## Status vocabulary

Strongest **achieved** state is recorded first. Remaining gap labels follow. Do not upgrade because a document *discusses* the topic.

| Label | Meaning |
| --- | --- |
| **VERIFIED** | Authoritative company/regulatory artefact proving the stated fact |
| **COMPANY-PROVIDED FACT** | Company-supplied string/fact, not independently verified |
| **LEGAL COUNSEL ADOPTED POSITION** | Adopted legal/control rule (Thomas Nguluma). Not a certificate, appointment, or Production approval |
| **PREPARATORY — SUBSTANTIALLY COMPLETE** | Internal draft/framework suitable for later review |
| **PREPARATORY — MATERIAL GAPS** | Draft exists but material fields/census/methodology missing |
| **HUMAN LEGAL/DPO DETERMINATION REQUIRED** | Remaining qualified-human characterisation. DPO **NOT ESTABLISHED** |
| **EXTERNAL EVIDENCE REQUIRED** | Registry, regulator, counterparty, or vendor artefact absent |
| **ARCHITECTURE-DEPENDENT** | Cannot close until actual Production topology/providers exist |
| **NOT YET COMPLETED** | Required work product not present (screening record, implemented control, combined DPO closure) |

Public PDPC pages ≠ SEDMC registration. Legal Counsel analysis ≠ regulator certificate. Draft ≠ implementation. Schema capability ≠ actual Production processing. `dpo` configuration key ≠ appointment. Target market ≠ data-subject jurisdiction. Preferred hosting ≠ selected Production architecture.

---

## Section 1 — Executive status

| Item | Current status |
| --- | --- |
| E1-C01 Legal Counsel component | **COMPLETE** (THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N) |
| DPO component | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT | **NOT AUTHORIZED** |
| Production | **NOT AUTHORIZED** |
| Migration | **NOT AUTHORIZED** |
| Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |
| Tanzania | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** |
| L-05 | **ARCHITECTURE-DEPENDENT** |
| L-17 | **ARCHITECTURE-DEPENDENT** |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |

**NO MATERIAL CONTRADICTION FOUND** among the current register, collection queue, completeness audits, and adopted Legal Counsel position.

**NO E1 ITEM IS CURRENTLY CLOSURE-READY WITHOUT AN EXTERNAL, HUMAN, COMPANY, OR ARCHITECTURE DEPENDENCY.**

The Legal Counsel *rules* for LA-01–LA-17 and L-01–L-17 are already recorded. That does **not** close the corresponding E-items’ factual, external, DPO, or architecture artefacts.

---

## Section 2 — E-01 through E-32 matrix

### E-01 — Legal entity / establishment

| Field | Record |
| --- | --- |
| **B. Current status** | **NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED** · **COMPANY-PROVIDED FACT** (name string only) |
| **C. Evidenced** | Company-provided legal name **Makundi Serengeti Experience DMC**. Dev seed `legalName` **Serengeti Experience DMC Ltd** exists as application seed. Branding **Serengeti Experience DMC** / **SEDMC**. |
| **D. Not evidenced** | Corporate/registry extract; incorporation certificate; registered office; establishment proof. Relationship among the four name strings **NOT AUTHORITATIVELY VERIFIED**. |
| **E. Authority** | Company-provided; **not** authoritative. Seed is **APPLICATION / SCHEMA EVIDENCE**, not identity. |
| **F. Closure condition** | Authoritative extract (or equivalent) identifying the legal person and relevant registration details, reconciling or confirming the company-provided name. Do **not** use seed data. |
| **G. Dependency** | **SEDMC/company**; **external regulator** (competent registry). Not DPO. |

### E-02 — PDPC registration / status

| Field | Record |
| --- | --- |
| **B. Current status** | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |
| **C. Evidenced** | Public PDPC process page (EA-02) as **PUBLIC REGULATORY GUIDANCE**. Legal Counsel L-01/LA-02 **rule** that registration must be verified before Production. |
| **D. Not evidenced** | SEDMC-specific PDPC confirmation, certificate, number, correspondence, or written status record. |
| **E. Authority** | External-required. Counsel-adopted **rule** only. Public page ≠ company registration. |
| **F. Closure condition** | Artefact identifying the company **or** an authoritative written status record. Do **not** write registered / unregistered / unnecessary without that artefact. |
| **G. Dependency** | **external regulator** (PDPC); **SEDMC/company** (Legal files). |

### E-03 — DPO appointment / designation

| Field | Record |
| --- | --- |
| **B. Current status** | **DPO APPOINTMENT NOT ESTABLISHED** · **NOT YET COMPLETED** |
| **C. Evidenced** | Legal Counsel L-02 **rule**: assess and address DPO where Tanzanian law/registration requires. P1 role key `dpo` exists as configuration. |
| **D. Not evidenced** | Appointment letter, designation, board/director resolution, named DPO, acceptance, PDPC DPO record. |
| **E. Authority** | Absent appointment. Counsel-adopted trigger **rule**. Configuration ≠ appointment. |
| **F. Closure condition** | Company decision whether to appoint; if appointed, appointment/designation artefact; regulator notice **only if** that process actually applies. |
| **G. Dependency** | **SEDMC/company**; **DPO** (if/when appointed); **external regulator** if notice applies. **Do not assign Thomas Nguluma as DPO.** |

### E-04 — EOS processing inventory

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (modelled structured processing) · **PREPARATORY — MATERIAL GAPS** · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **ARCHITECTURE-DEPENDENT** (recipients/locations) |
| **C. Evidenced** | Phase 1 inventory from schema/kernel: CRM, RFP, programme, costing, approvals, documents (metadata), suppliers/hotels, principals, audit, related modules. Named delegates/passport/health/PAN **FUTURE / NOT CURRENTLY EVIDENCED** as structured fields. Document bytes **UNKNOWN**. |
| **D. Not evidenced** | Off-EOS census; Production RoPA; document-content classification; recipient/subprocessor map; Production geography; lawful bases. |
| **E. Authority** | Preparatory + schema FACT. Not a Production census. |
| **F. Closure condition** | Internal completeness pass (off-EOS + file residual) **and** later recipient/location rows after architecture. Completeness sign-off is human/ops, not repository inference. |
| **G. Dependency** | **Operations**; **SEDMC/company**; later **architecture**. |

### E-05 — Data-subject geography map

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (Layers A–D) · **PREPARATORY — MATERIAL GAPS** · **EXTERNAL EVIDENCE REQUIRED** / company records (census) · **ARCHITECTURE-DEPENDENT** (Layer D) |
| **C. Evidenced** | Four-layer map; target markets listed as **TARGET MARKET** only. Schema *can* store country/destination text. Dev seed Arusha ≠ establishment. |
| **D. Not evidenced** | Actual data-subject jurisdictions; Production processing/storage geography. |
| **E. Authority** | Company position (markets) + preparatory map. |
| **F. Closure condition** | Actual client/contact/staff census distinct from the market list; Layer D after architecture selection. |
| **G. Dependency** | **Operations** / commercial; **architecture** for Layer D; **Legal Counsel** / **DPO** for legal-geography characterisation (not automatic from the map). |

### E-06 — Processing-role matrix

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (factual candidates) · **PREPARATORY — MATERIAL GAPS** · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **EXTERNAL EVIDENCE REQUIRED** (contracts) · **ARCHITECTURE-DEPENDENT** (vendors) |
| **C. Evidenced** | Factual candidate matrix. Legal Counsel LA-01 **framework**: controller where SEDMC determines purposes/means; processor/joint-controller **may** arise from actual arrangements. No per-row legal conclusion in E-06. |
| **D. Not evidenced** | Per-activity legal roles; executed DPAs; vendor processor status. |
| **E. Authority** | Preparatory facts + counsel-adopted **framework**. Not contracts. |
| **F. Closure condition** | Internal confirmation of who actually controls activities **plus** executed role-appropriate terms **plus** human legal role column. Vendor rows after providers exist. |
| **G. Dependency** | **Operations**; **Legal Counsel** (framework already recorded); remaining characterisation **DPO** if/when appointed / SEDMC Legal; **external vendor** later. |

### E-07 — Contracts / DPAs

| Field | Record |
| --- | --- |
| **B. Current status** | **EXTERNAL EVIDENCE REQUIRED** |
| **C. Evidenced** | Schema can store supplier-contract **metadata**. Legal Counsel L-09 **rule** that role-appropriate contracts are required where relationships exist. |
| **D. Not evidenced** | Any executed DPA, joint-controller agreement, or privacy instruction schedule in this repository. |
| **E. Authority** | External-required. Metadata ≠ executed contract. |
| **F. Closure condition** | Executed terms from **existing** counterparties if they exist in company files; Production-vendor DPAs only after providers are selected. Do not invent DPAs. |
| **G. Dependency** | **SEDMC/company**; counterparties (**external vendor** / clients); later **architecture**. |

### E-08 — Production data-flow map

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** · **NOT YET COMPLETED** |
| **C. Evidenced** | Dev/Test Compose / local FS / Gate-B disposable PostgreSQL. L-05 **rule** adopted and **deferred**. |
| **D. Not evidenced** | Production map of app, PostgreSQL, object storage, backup, DR, email, IdP, monitoring, CDN/WAF, KMS, support, recipients, subprocessors, geographies. |
| **E. Authority** | Architecture-dependent. Dev topology ≠ Production. |
| **F. Closure condition** | Actual selected Production topology documented as a data-flow map. |
| **G. Dependency** | **architecture**; later Production implementation. |

### E-09 — Transfer register

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** · **NOT YET COMPLETED** |
| **C. Evidenced** | L-06 **rule** that a path register is required. No Production paths. |
| **D. Not evidenced** | Any populated transfer path (destination, recipient, purpose, duration, data, mechanism, safeguards). |
| **E. Authority** | Counsel-adopted rule; architecture-dependent population. |
| **F. Closure condition** | Paths derived from a real Production data-flow (E-08). |
| **G. Dependency** | **architecture**. |

### E-10 — Transfer mechanisms

| Field | Record |
| --- | --- |
| **B. Current status** | **LEGAL COUNSEL ADOPTED POSITION** (no universal mechanism) · **ARCHITECTURE-DEPENDENT** · **EXTERNAL EVIDENCE REQUIRED** (path instruments) |
| **C. Evidenced** | LA-11 / L-07 adopted: no universal tool; assess Tanzania permit **where applicable**; do not assume a permit exists. EA-03/EA-10 are public source pages. |
| **D. Not evidenced** | SCC, IDTA, adequacy finding, or PDPC permit for a named path. |
| **E. Authority** | Counsel-adopted **rule**. Public pages ≠ SEDMC instruments. |
| **F. Closure condition** | Path-specific instrument/permit **if** an actual transfer exists and law requires one. Do not invent SCCs/permits now. |
| **G. Dependency** | **architecture**; **external regulator** / **external vendor** if an instrument is required. |

### E-11 — Subprocessor register

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** · **NOT YET COMPLETED** |
| **C. Evidenced** | LA-15 / L-08 **requirement** to maintain a register. Hosting-capability slots empty. |
| **D. Not evidenced** | Named Production subprocessors. |
| **E. Authority** | Counsel-adopted requirement; empty register. |
| **F. Closure condition** | Populated register after provider selection. |
| **G. Dependency** | **architecture**; **external vendor**. |

### E-12 — EOS privacy notice

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (skeleton restraint) · **PREPARATORY — MATERIAL GAPS** · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **EXTERNAL EVIDENCE REQUIRED** · **ARCHITECTURE-DEPENDENT** · **NOT YET COMPLETED** as an approved notice |
| **C. Evidenced** | Draft skeleton aligned with E-04; omits bases, DPO, PDPC, providers, retention numbers, contacts, Tanzania hosting. **`DRAFT — NOT LEGALLY APPROVED`**. |
| **D. Not evidenced** | Approved/public notice; entity; DPO/contact; rights wording; recipients; transfers. |
| **E. Authority** | Preparatory. L-10 rule adopted (notice before Production personal-data use). |
| **F. Closure condition** | Complete notice **after** E-01, E-03/E-02 as applicable, E-13, E-06/E-07, E-18, and provider selection; then qualified-human adequacy review. Do not publish the skeleton. |
| **G. Dependency** | **SEDMC/company**; **Legal Counsel** (rule already recorded); **DPO** if/when appointed; **architecture**. |

### E-13 — Retention requirements

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (class matrix) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **EXTERNAL EVIDENCE REQUIRED** (contract/statute once known) · **ARCHITECTURE-DEPENDENT** (backup/IdP/log TTL) |
| **C. Evidenced** | Record-class matrix; all periods **TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT**. Soft-delete ≠ legal period. Audit insert-only is FACT. |
| **D. Not evidenced** | Any statutory, contractual, tax, or backup number. Production deletion not implemented. |
| **E. Authority** | Preparatory. L-11 rule adopted. |
| **F. Closure condition** | Category-specific periods from Legal + Finance + contracts; backup overlay after E-22; designed approach to audit immutability vs erasure. Do not invent statutes. |
| **G. Dependency** | **Finance**; **SEDMC/company**; remaining legal characterisation; **architecture** for backup TTL. |

### E-14 — Production TOMs

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** · **NOT YET COMPLETED** |
| **C. Evidenced** | Dev/design controls; `productionReady: false`. L-12 rule adopted. |
| **D. Not evidenced** | Implemented Production technical and organisational measures on a selected stack. |
| **E. Authority** | Design/Dev ≠ Production TOMs. |
| **F. Closure condition** | Architecture-specific TOMs evidenced as implemented. |
| **G. Dependency** | **architecture**; **Production implementation/testing**. |

### E-15 — Personal-data incident response

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (documented process) · **NOT YET COMPLETED** (implemented/tested) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | 12-step draft; distinguishes internal / contractual / regulator / data-subject notice; **no** unsourced statutory clock. |
| **D. Not evidenced** | Named owners; implemented detection; tabletop/live test; jurisdiction-specific clocks; vendor notice clauses. |
| **E. Authority** | Preparatory documented process. L-13 rule adopted. |
| **F. Closure condition** | Internal owners + implemented/tested control **and** law-specific mapping after E-18/E-03 facts. Lab restore ≠ privacy IR test. |
| **G. Dependency** | **Operations**; **SEDMC/company**; **DPO** if/when appointed; **architecture** (monitoring/vendors). |

### E-16 — Data classification / legal mapping

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (internal ≠ statutory) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** |
| **C. Evidenced** | Internal Restricted / Highly Restricted / Restricted+ distinguished from statutory sensitive/special-category concepts. Legal Counsel LA-12/LA-13 / L-14 adopted that distinction. Statutory column **PENDING**. |
| **D. Not evidenced** | Completed statutory characterisation; document-byte census. |
| **E. Authority** | Company position + counsel-adopted distinction + preparatory map. |
| **F. Closure condition** | Qualified-human statutory column under **applicable** law; file census as needed. Do **not** equate Restricted+ with legally sensitive PD. |
| **G. Dependency** | **SEDMC/company**; remaining **DPO** / SEDMC Legal characterisation. |

### E-17 — DPIA / privacy-risk screening

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — MATERIAL GAPS** · **NOT YET COMPLETED** · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **ARCHITECTURE-DEPENDENT** (full DPIA if triggered) |
| **C. Evidenced** | P2 DPIA **register capability** (case labels only). L-15 rule adopted: screening required; full DPIA where legally triggered. |
| **D. Not evidenced** | Screening methodology/triggers as an E-17 work product; Production screening record; completed DPIA. |
| **E. Authority** | Application/schema capability ≠ screening ≠ DPIA. |
| **F. Closure condition** | Human screening record whether DPIA/equivalent is required on current facts. Full DPIA only if triggered and facts/topology suffice. Do not fabricate a DPIA. |
| **G. Dependency** | **DPO** if/when appointed / SEDMC Legal; **architecture** for a full Production DPIA. |

### E-18 — Source-market applicability screening

| Field | Record |
| --- | --- |
| **B. Current status** | **PREPARATORY — SUBSTANTIALLY COMPLETE** (factual table) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** · **EXTERNAL EVIDENCE REQUIRED** (establishment/census facts) · **ARCHITECTURE-DEPENDENT** (transfers/monitoring) |
| **C. Evidenced** | Factual screening for TZ, KE, ZA, EU/EEA, UK, ME, CA, US, LATAM. All applicability cells pending. Legal Counsel: TZ PDPA **primary baseline** (LA-02, with conditions); Kenya **fact-specific** (LA-03); EU/UK GDPR **potentially applicable — do not exclude** (LA-04); L-16 screening ≠ full memo per country. |
| **D. Not evidenced** | Completed applicability findings; offering/monitoring/establishment connecting-factor packs. |
| **E. Authority** | Company position (markets) + preparatory screening + counsel-adopted **framework**. Not automatic law-applies. |
| **F. Closure condition** | Fact-specific human assessment using actual census/offering/establishment facts — not the market list alone. Do not conclude GDPR/UK GDPR/Kenya DPA apply or do not apply from this table. |
| **G. Dependency** | **SEDMC/company** (facts); remaining human determination; **architecture** for transfer overlay. |

### E-19 — Production hosting jurisdiction

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | Tanzania **preferred** (company LA-06; Legal Counsel: preferred baseline, not selected). ADR-0006 blocked as Production hosting decision. |
| **D. Not evidenced** | Selected Production hosting country/region/provider. |
| **E. Authority** | Company preference + counsel-adopted preference **rule**. Preference ≠ selection. |
| **F. Closure condition** | Later governed architecture decision + vendor evidence. **Do not select here.** |
| **G. Dependency** | **architecture**. |

### E-20 — PostgreSQL Production location

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | PostgreSQL is the **intended** durable SoR. Gate-B/Dev PostgreSQL is not Production. |
| **D. Not evidenced** | Production managed-PG region/operator. |
| **E. Authority** | Design intent. |
| **F. Closure condition** | Selected Production PostgreSQL geography. |
| **G. Dependency** | **architecture**. |

### E-21 — Document / object storage

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | `DocumentStorage` port; Dev `LocalFsDocumentStorage`. Production object store **CANDIDATE — NOT SELECTED**. |
| **D. Not evidenced** | Production provider, location, subprocessors. |
| **E. Authority** | Design/Dev. |
| **F. Closure condition** | Selected Production object store. |
| **G. Dependency** | **architecture**. |

### E-22 — Backup location

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | LA-07 rule: backups containing personal data are processing. Gate-B/C dumps **excluded**. |
| **D. Not evidenced** | Production backup provider, geography, TTL. |
| **E. Authority** | Counsel-adopted rule; lab ≠ Production backup. |
| **F. Closure condition** | Selected Production backup offering. |
| **G. Dependency** | **architecture**. |

### E-23 — DR location

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | LA-08 rule for DR as processing location. Lab site-failure ≠ DR jurisdiction. Warm standby **NOT SELECTED** (LA-09 not automatically mandatory). |
| **D. Not evidenced** | Production DR geography/provider. |
| **E. Authority** | Counsel-adopted rule; unselected topology. |
| **F. Closure condition** | Selected Production DR offering. |
| **G. Dependency** | **architecture**. |

### E-24 — Identity provider

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | Dev local password IdP. ADR-0013 **OPEN**. |
| **D. Not evidenced** | Production IdP product and processing geography. |
| **E. Authority** | Design/Dev. |
| **F. Closure condition** | Selected Production IdP. |
| **G. Dependency** | **architecture**. |

### E-25 — Email

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | Dev email/outbox templates. Dev SES mentions ≠ Production. |
| **D. Not evidenced** | Production email provider, geography, subprocessors. |
| **E. Authority** | Design/Dev. |
| **F. Closure condition** | Selected Production email offering. |
| **G. Dependency** | **architecture**. |

### E-26 — Monitoring / logging

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | Formal monitoring/IR recorded **NOT READY**. |
| **D. Not evidenced** | Production monitoring/logging services and geographies. |
| **E. Authority** | Absent Production stack. |
| **F. Closure condition** | Selected Production monitoring. |
| **G. Dependency** | **architecture**. |

### E-27 — CDN / WAF

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | None selected. |
| **D. Not evidenced** | Production CDN/WAF providers and locations. |
| **E. Authority** | Absent. |
| **F. Closure condition** | Selected CDN/WAF **if used**. |
| **G. Dependency** | **architecture**. |

### E-28 — KMS / secrets

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** |
| **C. Evidenced** | ADR-0012 **OPEN**. Env secrets are Dev-only. |
| **D. Not evidenced** | Production KMS/secrets provider and geography. |
| **E. Authority** | Design. |
| **F. Closure condition** | Selected Production KMS. |
| **G. Dependency** | **architecture**. |

### E-29 — Foreign admin / support access

| Field | Record |
| --- | --- |
| **B. Current status** | **LEGAL COUNSEL ADOPTED POSITION** (control standard LA-16) · **ARCHITECTURE-DEPENDENT** (countries) |
| **C. Evidenced** | Preferred controls: least privilege, MFA, individual accounts, logging, approval, confidentiality, review. |
| **D. Not evidenced** | Production support/admin countries; vendor access model. |
| **E. Authority** | Counsel-adopted **controls**; countries unknown. |
| **F. Closure condition** | Vendor access model and countries after a provider exists. |
| **G. Dependency** | **architecture**; **external vendor**. |

### E-30 — Subprocessor contracts / transfer controls

| Field | Record |
| --- | --- |
| **B. Current status** | **ARCHITECTURE-DEPENDENT** · **EXTERNAL EVIDENCE REQUIRED** · **NOT YET COMPLETED** |
| **C. Evidenced** | L-07/L-08/L-09 rules adopted. No providers. |
| **D. Not evidenced** | Executed provider DPAs, location commitments, flow-down, transfer tools. |
| **E. Authority** | Counsel-adopted rules; no artefacts. |
| **F. Closure condition** | Executed terms for material selected subprocessors. |
| **G. Dependency** | **architecture**; **external vendor**. |

### E-31 — LA-01–LA-17 determinations (combined Legal/DPO instrument)

| Field | Record |
| --- | --- |
| **B. Current status** | **LEGAL COUNSEL ADOPTED POSITION** (17/17) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** (DPO 0/17) · **NOT YET COMPLETED** as combined instrument |
| **C. Evidenced** | THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N; confirmation quote recorded. LA-01–LA-17 APPROVED/CONFIRMED/ADOPTED with conditions. L-05/L-17 architecture deferrals preserved. |
| **D. Not evidenced** | DPO determinations; DPO identity; combined Legal/DPO completion. |
| **E. Authority** | Authoritative **for Legal Counsel legal/control rules only**. Not PDPC, DPO, architecture, or Production approval. |
| **F. Closure condition** | DPO component **if/when** a DPO is appointed and the combined instrument requires DPO determinations. Do not re-attest Legal Counsel. |
| **G. Dependency** | **Legal Counsel** complete; remaining **DPO** if/when appointed. |

### E-32 — L-01–L-17 closure

| Field | Record |
| --- | --- |
| **B. Current status** | **LEGAL COUNSEL ADOPTED POSITION** (17/17 rules) · **ARCHITECTURE-DEPENDENT** (L-05, L-17 maps) · **HUMAN LEGAL/DPO DETERMINATION REQUIRED** (DPO) · **NOT YET COMPLETED** as combined artefact closure |
| **C. Evidenced** | L-01–L-17 CONFIRMED/ADOPTED. L-05 and L-17 **DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE**. |
| **D. Not evidenced** | DPO L-item views; populated L-05 map; L-17 review of **actual** topology; factual closure of registers that remain drafts. |
| **E. Authority** | Counsel-adopted **rules**. Rule adoption ≠ artefact closure. |
| **F. Closure condition** | Remaining artefacts per L item; L-05/L-17 only after architecture exists; DPO component if required. |
| **G. Dependency** | **Legal Counsel** complete for rules; **architecture** for L-05/L-17; **DPO** if/when appointed. |

**Coverage: E-01–E-32 = 32/32.**

---

## Section 3 — Class A — Company / internal evidence

Items SEDMC can **advance** from its own records without selecting Production architecture. Advancement ≠ automatic closure (several still need later B/C/D).

| ID | What SEDMC can supply now |
| --- | --- |
| **E-01** | Company files toward legal-entity / establishment evidence (still needs registry artefact for verification) |
| **E-03** | Company decision whether to appoint a DPO (appointment artefact only if appointed) |
| **E-04** | Off-EOS process census; whether commercial files will contain personal data |
| **E-05** | Actual client/contact/staff geography distinct from the target-market list |
| **E-06** | Factual confirmation of which activities SEDMC vs clients control today |
| **E-07** | Any **already executed** client/supplier/employment privacy clauses in company files |
| **E-13** | Business, finance, and contractual **candidate** retention needs (not invented statutes) |
| **E-15** | Named incident owner; whether any tabletop has actually been run (record “none” if none) |
| **E-16** | Which internal Restricted / Restricted+ classes are actually used in EOS today |
| **E-18** | Evidenced offering/monitoring/establishment facts — or explicit “not evidenced” |

**Count: 10 items** with a Class A component.

---

## Section 4 — Class B — Human Legal / DPO

Remaining qualified-human work that is **not** a second Legal Counsel attestation of LA/L rules already adopted. DPO is **NOT ESTABLISHED**. THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**.

| ID | Remaining human determination |
| --- | --- |
| **E-02** | Whether PDPC registration is required (artefact still Class C) |
| **E-03** | Whether appointment is required; DPO function if appointed |
| **E-06** | Per-activity legal roles after facts/contracts |
| **E-12** | Adequacy of a future complete notice (L-10); lawful basis only where applicable |
| **E-13** | Legal/legal-hold periods; audit vs erasure |
| **E-15** | Jurisdiction-specific notification mapping (L-13) |
| **E-16** | Statutory sensitive/special-category characterisation (L-14) |
| **E-17** | DPIA/privacy-risk **screening record** and whether full DPIA is required (L-15) |
| **E-18** | Fact-specific applicability (TZ/KE/EU/UK and whether others need a deeper memo) (L-16) |
| **E-31** | DPO component of LA-01–LA-17 **if** the combined instrument requires it |
| **E-32** | DPO view of remaining L artefacts (not a re-attestation of Legal Counsel rules) |

**Count: 11 items** with a Class B component.

Legal Counsel LA/L **rules** are already complete. Class B is remaining characterisation, DPO, and notice/retention/IR/DPIA **work products**.

---

## Section 5 — Class C — External evidence

| ID | External source |
| --- | --- |
| **E-01** | Competent corporate registry / certified extract |
| **E-02** | PDPC (SEDMC-specific status artefact) |
| **E-03** | PDPC DPO record **if** that process applies after appointment |
| **E-07** | Counterparties (executed DPAs / role-appropriate terms) |
| **E-10** | Regulator/vendor instruments **if** an actual path requires them |
| **E-30** | Selected vendors (DPAs, location commitments, flow-down) |

**Count: 6 items** with a Class C component.

Public PDPC/ODPC/EUR-Lex/ICO URLs (EA-01–EA-10) remain **verified citations only**, not SEDMC compliance evidence.

---

## Section 6 — Class D — Architecture / Production

Cannot be closed until actual Production architecture is selected and documented.

| ID | Why architecture-blocked |
| --- | --- |
| **E-04** | Recipient / Production-location rows |
| **E-05** | Layer D processing/storage geography |
| **E-06** | Vendor/subprocessor legal rows |
| **E-08** | Production data-flow map (**L-05**) |
| **E-09** | Populated transfer register |
| **E-10** | Path-specific transfer instruments |
| **E-11** | Subprocessor register population |
| **E-12** | Recipients / providers / transfers in any Production notice |
| **E-13** | Backup / IdP / log retention overlay |
| **E-14** | Production TOMs |
| **E-15** | Monitoring, vendor breach-notice, Production IR tooling |
| **E-17** | Full Production DPIA **if** screening later triggers it |
| **E-18** | Transfer/monitoring overlay on applicability |
| **E-19** | Hosting jurisdiction |
| **E-20** | PostgreSQL Production location |
| **E-21** | Object storage |
| **E-22** | Backup location |
| **E-23** | DR location (warm standby if used) |
| **E-24** | IdP |
| **E-25** | Email |
| **E-26** | Monitoring / logging |
| **E-27** | CDN / WAF |
| **E-28** | KMS / secrets |
| **E-29** | Support/admin **countries** |
| **E-30** | Subprocessor contracts for selected providers |
| **E-32** | **L-05** and **L-17** artefact closure |

**Count: 26 items** with a Class D component (core unselected stack = E-08, E-09, E-11, E-14, E-19–E-30).

Do not pretend these can be closed now.

---

## Section 7 — Closure-ready now

No E-01–E-32 item can be moved to **VERIFIED** or otherwise **closed** solely from repository material without at least one of: company evidence, external artefact, remaining human/DPO determination, or Production architecture.

Legal Counsel rule adoption for E-31/E-32 is **already recorded**. That is not a remaining “close now” action; the **items** remain open for DPO and artefacts.

**NO E1 ITEM IS CURRENTLY CLOSURE-READY WITHOUT AN EXTERNAL, HUMAN, COMPANY, OR ARCHITECTURE DEPENDENCY.**

---

## Section 8 — Real-world evidence / actions

Smallest practical set that unlocks the most E1 progress. Not a best/worst ranking. Dependencies only.

1. **E-01 legal-entity evidence**  
   Unlocks identity fields in E-12, establishment facts for E-18/LA-01, and any PDPC artefact that must name the company (E-02). Until this exists, registration/status documents cannot be reliably matched.

2. **E-02 PDPC registration/status evidence**  
   Depends on a stable company identity (E-01). Unlocks L-01 artefact follow-up. Does **not** by itself appoint a DPO or select hosting.

3. **E-03 DPO decision / appointment**  
   Company decision first. Appointment artefact only if appointed. Unlocks combined E-31/E-32 DPO component and several Class B work products that the combined instrument treats as DPO-bearing. Legal Counsel is **not** a substitute.

4. **E-07 contracts/DPAs (existing paper)**  
   Unlocks E-06 legal-role facts for current counterparties and feeds E-12/E-13/E-15 contractual clauses. Production-vendor DPAs wait on architecture (E-30).

5. **Actual processing / data-subject census (E-04 / E-05)**  
   Unlocks quality of E-06, E-16, E-17 screening, and E-18 connecting factors. Does **not** select Layer D geography.

6. **Retention / business requirements (E-13)**  
   Unlocks E-12 retention fields and L-11 artefact follow-up. Backup TTL still waits on E-22.

**Suggested order of attack (non-architecture):** E-01 (identity) → E-02 (PDPC status matched to that identity) in parallel with E-03 (company DPO decision) and internal census/contracts/retention (E-04, E-05, E-07 existing paper, E-13). Architecture items stay deferred.

---

## Section 9 — Architecture Gate — NOT YET OPEN

The Architecture Gate remains **closed**. No Production topology has been selected. Tanzania remains a **preferred baseline / design preference only**.

**Not selected:**

- cloud provider  
- region / hosting jurisdiction  
- Production PostgreSQL  
- object-storage location  
- backup location  
- DR location  
- warm standby  
- IdP  
- email provider  
- monitoring provider  
- CDN / WAF  
- KMS / secrets provider  
- subprocessor locations  

E1 items that **depend** on that gate: E-08, E-09, E-10 (instruments), E-11, E-14, E-19, E-20, E-21, E-22, E-23, E-24, E-25, E-26, E-27, E-28, E-29 (countries), E-30, plus overlays on E-04, E-05, E-06, E-12, E-13, E-15, E-17, E-18, and E-32 (**L-05**, **L-17**).

This audit does **not** recommend or choose a provider.

---

## Section 10 — Legal Counsel status

| Field | Value |
| --- | --- |
| Name | THOMAS NGULUMA |
| Role | **LEGAL COUNSEL ONLY** |
| Date | 15TH SEPTEMBER 2026 |
| Approval | A.T.N |
| LA-01–LA-17 | 17/17 APPROVED / CONFIRMED / ADOPTED, qualifications preserved |
| L-01–L-17 | 17/17 CONFIRMED / ADOPTED |
| L-05 / L-17 | Rules adopted; maps/review **DEFERRED** until actual topology |
| DPO | **NOT ESTABLISHED** |
| Thomas Nguluma as DPO | **Not recorded** |

This attestation does **NOT** establish:

- DPO appointment  
- PDPC registration  
- regulatory approval  
- Production architecture approval  
- Production authorization  

The attestation is **not** altered by this audit.

---

## Section 11 — Governance conclusion

E-01 through E-32 have been reconciled. Preparatory inventories, maps, matrices, and drafts exist for several internal items. None of those drafts close E1. Architecture-dependent items remain unselected. Combined Legal/DPO remains incomplete because the DPO component is not established.

**E1-C01 Legal Counsel component COMPLETE.**

**DPO component NOT ESTABLISHED.**

**Combined Legal/DPO INCOMPLETE.**

**E1 NOT APPROVED / BLOCKED BY MISSING EVIDENCE.**

**UAT / Production / Migration / Deployment NOT AUTHORIZED.**

**NO MATERIAL CONTRADICTION FOUND.**

**STOP.** Do not manufacture a certificate, appointment, contract, retention period, DPIA, provider, or applicability finding to advance the gate.
