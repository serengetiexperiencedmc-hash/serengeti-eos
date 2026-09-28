# E1-C01 Legal / DPO Evidence Closure Register and Gap Assessment

> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`LEGAL COUNSEL DETERMINATION: COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026`**  
> **`LEGAL COUNSEL ATTESTATION: COMPLETED — A.T.N`**  
> **`DPO DETERMINATION: NOT ESTABLISHED BY THIS ATTESTATION`**  
> **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION HOSTING / DATABASE / INFRASTRUCTURE / MIGRATION / DEPLOYMENT: NOT AUTHORIZED`**  
> **`UAT: NOT AUTHORIZED`**

This register converts L-01–L-17 Production conditions into a **controlled evidence assessment**. It does **not** approve E1, complete E1-C01, select a provider or region, or authorize Production.

Status values used (only these):

- `EVIDENCE PRESENT`
- `PARTIALLY EVIDENCED`
- `EVIDENCE MISSING`
- `EXTERNAL EVIDENCE REQUIRED`
- `HUMAN/DPO/LEGAL DETERMINATION REQUIRED`
- `DEPENDENT ON PRODUCTION ARCHITECTURE`
- `NOT YET ASSESSABLE`

Not used: `APPROVED` · `COMPLIANT` · `LEGALLY CLEARED`.

Formal attestation package: [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md) — Legal Counsel THOMAS NGULUMA recorded 15TH SEPTEMBER 2026, approval A.T.N. DPO determination **not established**. Proposed counsel-style analysis was adopted with conditions. Stale §7 `UNKNOWN` “Current documented position” cells remain residual fact-pack text. Factual/external artefacts remain **NOT VERIFIED**.

---

## 1. Status preserved

| Item | Status |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** (combined Legal/DPO **not** complete) |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| Legal Counsel LA/L determinations | **COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026** (L-05/L-17 rules adopted, maps/architecture **not** finally closed) |
| DPO determination | **NOT ESTABLISHED** |
| Production hosting / database / infrastructure / migration / deployment | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Provider / region | **NOT SELECTED** |

---

## 2. Authoritative inputs

| File | Role |
| --- | --- |
| [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md) | SEDMC company/business layer |
| [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md) | AI counsel-style LA analysis |
| [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md) | L-01–L-17 counsel review |
| [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) | Proposed counsel-style LA-01–LA-17 and L-01–L-17 determinations + EA-01–EA-10 official sources — **not** human attestation |
| [`adr-0006-e1-c01-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-human-legal-dpo-review-pack.md) | Review companion |
| [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md) | Formal instrument — Legal Counsel recorded; DPO **not established** |
| [`adr-0006-e1-evidence-closure-package.md`](adr-0006-e1-evidence-closure-package.md) | Gate E1 evidence-closure sequence |
| `docs/governance/adr-0006-e1-c01-counsel-review.md` | **NOT FOUND** — see §8 reconciliation |
| [`adr-0006-e1-c01-phase1-internal-evidence-index.md`](adr-0006-e1-c01-phase1-internal-evidence-index.md) | Phase 1 internal evidence index (does **not** close items) |
| [`adr-0006-e1-c01-consolidated-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-consolidated-human-legal-dpo-review-pack.md) | Consolidated Human Legal/DPO review navigation (does **not** replace attestation) |

Phase 1 internal artefacts (prepared; **not** closure): [`e01`](adr-0006-e1-c01-e01-legal-entity-establishment.md) · [`e04`](adr-0006-e1-c01-e04-eos-processing-inventory.md) · [`e05`](adr-0006-e1-c01-e05-data-subject-geography-map.md) · [`e06`](adr-0006-e1-c01-e06-processing-role-matrix.md) · [`e12`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md) · [`e13`](adr-0006-e1-c01-e13-retention-requirements.md) · [`e15`](adr-0006-e1-c01-e15-personal-data-incident-response.md) · [`e16`](adr-0006-e1-c01-e16-data-classification-legal-mapping.md) · [`e18`](adr-0006-e1-c01-e18-source-market-applicability-screening.md). Human review routing (not attestation): [`adr-0006-e1-c01-human-legal-dpo-review-routing.md`](adr-0006-e1-c01-human-legal-dpo-review-routing.md).

Related: [`adr-0006-e1-production-hosting-residency-readiness-assessment.md`](adr-0006-e1-production-hosting-residency-readiness-assessment.md); [`adr-0006-legal-data-placement-evidence.md`](adr-0006-legal-data-placement-evidence.md); [`adr-0006-hosting-capability-evidence.md`](adr-0006-hosting-capability-evidence.md); ADR-0006 **proposed — blocked**; DP-0006 **OPEN**; ADR-0011/0012/0013 not Production-closed.

P1 RoPA/DSR and P2 DPIA Register are **Dev/Test register capabilities**. They are **not** a completed Production inventory or a completed Production DPIA.

---

## 3. Master evidence register (E-01–E-32)

“Blocks E1?” means: absence prevents **E1 closure** (Legal/DPO placement rules sufficient to allow or forbid option classes, plus remaining E1-Cxx artefacts). It does **not** mean every Production implementation artefact is an immediate E1 blocker. See §7.

| ID | Requirement | Related L Item | Evidence Required | Repository Evidence | Evidence Status | Evidence Owner/Source | External Evidence? | Human/DPO/Legal Review? | Production Architecture Dependency? | Blocks E1? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | Legal entity / Tanzania establishment | L-04; LA-01 | Incorporation/legal-entity extract; attested place(s) of establishment | Company position: SEDMC is Tanzania-based (business fact). Fact pack L1 establishment **UNKNOWN**. **No** BRELA/incorporation extract. Dev seed `legalName` is **not** evidence. Phase 1 placeholder: [`adr-0006-e1-c01-e01-legal-entity-establishment.md`](adr-0006-e1-c01-e01-legal-entity-establishment.md) | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | SEDMC (internal records); Legal/DPO | Yes if registry extract needed | **Yes** | No | **Yes — current** (LA-01 cannot be attested without entity/establishment facts) |
| E-02 | PDPC registration | L-01 | PDPC controller/processor registration covering Production activities, **or** attested determination that registration is not required | PDPC process cited; **no** registration record | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | SEDMC + PDPC | **Yes** (PDPC) | **Yes** (whether required) | Low | **Split:** applicability determination = current E1; certificate = Production implementation if required |
| E-03 | DPO / privacy lead | L-02 | Appointment/designation under each applicable law | **None.** Legal Counsel THOMAS NGULUMA is **not** recorded as DPO. No DPO appointment, name, qualification, date, or letter. P1 role key `dpo` ≠ appointment | `EVIDENCE MISSING` · DPO determination **NOT ESTABLISHED** | SEDMC; Legal/DPO | Possible (PDPC introduction) | **Yes** (which laws require it) — Legal Counsel rule adopted: address where Tanzanian law requires | No | **Split:** trigger rule adopted by Legal Counsel; appointment artefact still missing |
| E-04 | Processing inventory | L-03 | Activity-level inventory of personal vs corporate data for CRM contacts, RFPs, programmes, delegates, suppliers, hotels, employees, documents, audit, authentication, support access, logs/monitoring | Company LA-01/LA-12 **intended** classes. P1 RoPA is a **Dev/Test register capability**, not a completed EOS Production inventory. Phase 1 draft from actual models: [`adr-0006-e1-c01-e04-eos-processing-inventory.md`](adr-0006-e1-c01-e04-eos-processing-inventory.md) (named delegates/passport/health = **FUTURE / NOT CURRENTLY EVIDENCED** as structured processing). **Does not close E-04** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` | SEDMC privacy/ops | No for first draft | Review of completeness | Partial (recipients/locations wait on architecture) | **Partial — current** for knowing classes; locations **architecture-dependent** |
| E-05 | Data-subject geography map | L-16; LA-05 | Census distinguishing client geography, data-subject geography, programme destination, processing location | Company source-market **list** (ZA, Europe, ME, CA, US, LATAM). **No** verified individual geography census. Phase 1 map (layers A–D; target vs actual): [`adr-0006-e1-c01-e05-data-subject-geography-map.md`](adr-0006-e1-c01-e05-data-subject-geography-map.md). **Does not close E-05** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` | SEDMC commercial/privacy | No for first map | **Yes** (legal geography) | Processing location = architecture | **Partial — current** (LA-05); processing location **architecture-dependent** |
| E-06 | Controller/processor matrix | L-04 | Activity-level roles: SEDMC controller; SEDMC processor; client-controlled; joint-controller; vendor/subprocessor | Counsel/company **analysis of likely roles**. Phase 1 **factual** matrix (legal column pending): [`adr-0006-e1-c01-e06-processing-role-matrix.md`](adr-0006-e1-c01-e06-processing-role-matrix.md). **No** human legal roles; **no** contracts. **Does not close E-06** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | SEDMC + Legal/DPO | Vendor role depends on contracts | **Yes** | Vendor rows depend on providers | **Yes — current** for SEDMC/client roles; vendor rows **post-provider** |
| E-07 | Contracts / DPA evidence | L-09 | Executed DPAs / controller–processor / joint-controller / confidentiality / transfer terms | **None** | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` | SEDMC legal; counterparties | **Yes** | Review of sufficiency | **Yes** (counterparties unknown) | **Post-provider-selection** |
| E-08 | Production data-flow map | L-05; L-17 | Map of application, PostgreSQL, object storage, backup, DR, email, IdP, monitoring, CDN/WAF, KMS, support, integrations, geographies, recipients, subprocessors | Dev Compose / `LocalFsDocumentStorage` **not** Production. No Production topology | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical + vendor | Vendor location data | After map exists | **Yes** | **Architecture-dependent** |
| E-09 | Transfer register | L-06 | Per-path source, destination, recipient, category, subjects, purpose, framework, mechanism, safeguards, contract, retention, onward transfer | **None** (no Production paths) | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | SEDMC privacy | Destinations from vendors | **Yes** per path | **Yes** | **Architecture-dependent** |
| E-10 | Transfer mechanisms | L-07 | Lawful mechanism per actual transfer; no universal tool; no invented PDPC permit | **No** permit, SCCs, adequacy finding, or IDTA. Counsel framework only | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` · `DEPENDENT ON PRODUCTION ARCHITECTURE` | Legal/DPO; PDPC/vendors | **Yes** if permit/instrument needed | **Yes** | **Yes** | Framework rule = **current E1** (LA-11); instruments = **architecture/Production** |
| E-11 | Subprocessor register | L-08 | Production register of material providers | Hosting-capability slots **empty**. No `CANDIDATE — NOT SELECTED` | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical/commercial | **Yes** (vendor lists) | After candidates exist | **Yes** | **Architecture-dependent** |
| E-12 | Privacy notice | L-10 | EOS-relevant notice covering who, purposes, categories, basis where required, recipients, transfers, retention, rights, complaints, contact | **No** Production/EOS notice. Phase 1 skeleton only (`DRAFT — NOT LEGALLY APPROVED`; no bases/DPO/providers/contacts invented): [`adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md). **Does not close E-12** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` | SEDMC | Recipients wait on vendors | **Yes** (adequacy) | Partial | **Production implementation** (internal draft started; recipients architecture-dependent) |
| E-13 | Retention schedule | L-11 | Legal, contractual, operational, backup, audit, deletion — not indefinite by default | Company wants defined backup retention. Phase 1 matrix with periods **TO BE DETERMINED**: [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md). **No** legal periods invented. **Does not close E-13** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` | SEDMC | Backup overlay needs vendor | Review | Backup overlay **yes** | Operational classes **internal**; backup overlay **architecture-dependent** |
| E-14 | Production TOMs | L-12 | Implemented Production technical/organisational measures | Design/Dev controls; `productionReady: false`. **Not** Production TOMs | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` | Technical/security | Vendor shared-responsibility | Review vs law | **Yes** | **Production implementation** after architecture |
| E-15 | Breach / incident process | L-13 | Documented, implemented, and (where claimed) tested personal-data incident process; law-specific notification mapping | Phase 1 **documented process** draft: [`adr-0006-e1-c01-e15-personal-data-incident-response.md`](adr-0006-e1-c01-e15-personal-data-incident-response.md). **Implemented control** and **tested control** **not evidenced**. No jurisdiction-specific deadlines prescribed. **Does not close E-15** | `PARTIALLY EVIDENCED` · `EVIDENCE MISSING` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` (notification mapping) | SEDMC + Legal/DPO | Regulator mapping | **Yes** | Provider notice clauses **yes** | Documented process **internal**; tested/regulator mapping **split** |
| E-16 | Sensitive-data mapping | L-14 | Map SEDMC Restricted / Highly Restricted / Restricted+ to statutory sensitive/special-category concepts | Company **internal** classes recorded. Phase 1 map (internal ≠ statutory; legal column pending): [`adr-0006-e1-c01-e16-data-classification-legal-mapping.md`](adr-0006-e1-c01-e16-data-classification-legal-mapping.md). **No** human statutory classification. **Does not close E-16** | `PARTIALLY EVIDENCED` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | SEDMC + Legal/DPO | No for mapping policy | **Yes** | Census of stored files **yes** | **Yes — current** for legal characterisation; census **architecture/implementation** |
| E-17 | DPIA / privacy-risk screening | L-15 | Documented screening whether EOS Production needs DPIA/equivalent | P2 is a **DPIA register capability**, explicitly not a DPIA product or completed Production DPIA. **No** Production screening record | `PARTIALLY EVIDENCED` (capability only) · `EVIDENCE MISSING` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | SEDMC + Legal/DPO | No for screening | **Yes** (whether required) | Processing profile **partial** | **Yes — current** as screening; full DPIA if triggered may wait on facts |
| E-18 | International source-market assessment | L-16 | Fact-specific screening TZ, KE, EU/EEA, UK, ZA, ME, CA, US, LATAM — not a full memo per country unless facts require | Company market list; AI counsel on TZ/KE/GDPR/UK GDPR. Phase 1 factual screening (no law-applies conclusion): [`adr-0006-e1-c01-e18-source-market-applicability-screening.md`](adr-0006-e1-c01-e18-source-market-applicability-screening.md). **No** human assessments. **Does not close E-18** | `PARTIALLY EVIDENCED` · `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Legal/DPO + commercial facts | No for screening | **Yes** | Transfers depend on architecture | **Yes — current** for TZ/KE/EU/UK screening; others screening-level |
| E-19 | Production hosting jurisdiction | L-17; LA-06 | Selected, evidenced Production hosting jurisdiction | Tanzania **preferred**, **not selected**. ADR-0006 blocked | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Owner/commercial | Vendor region evidence | **Yes** before approval | **Yes** | **Architecture-dependent** (do **not** select here) |
| E-20 | PostgreSQL location | L-05; L-17 | Production PostgreSQL geography | Intended SoR = PostgreSQL. Gate-B/Dev PG **not** Production | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical | Managed-PG region | After selection | **Yes** | **Architecture-dependent** |
| E-21 | Document/object storage | L-05; L-17 | Production provider, location, subprocessors | `DocumentStorage` port; Dev `LocalFsDocumentStorage`. Production object store **CANDIDATE — NOT SELECTED** | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-22 | Backup location | L-05; LA-07 | Production backup geography and provider | Gate-B/Gate-C **Dev/Test** dumps **excluded** | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical; ADR-0011 TBD | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-23 | DR location | L-05; LA-08 | Production DR geography and provider | None. Lab site-failure ≠ DR jurisdiction | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-24 | IdP | L-05; LA-17 | Production IdP product and processing geography | ADR-0013 **OPEN**. Local password IdP is Dev | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical/IAM | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-25 | Email | L-05; LA-17 | Production email provider, geography, subprocessors | Dev SES mentions are **not** Production hosting evidence. Production email **not selected** | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-26 | Monitoring / logging | L-05; LA-17 | Production monitoring/logging services and geographies | **Not selected** | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical/security | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-27 | CDN / WAF | L-05; LA-17 | Production CDN/WAF providers and locations | **Not selected** | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-28 | KMS / secrets | L-05; LA-17 | Production KMS/secrets provider and geography | ADR-0012 **OPEN**; env secrets Dev-only | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Technical/security | **Yes** | After selection | **Yes** | **Architecture-dependent** |
| E-29 | Foreign admin/support access | L-12; LA-16 | Production support/admin countries and contractual/security controls | Company **preferred controls** recorded. **No** Production support geography or vendor access model | `PARTIALLY EVIDENCED` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** (countries/vendor model) | Technical + vendor + Legal | **Yes** | **Yes** | **Yes** | Control standard = **current E1** (LA-16); countries = **architecture-dependent** |
| E-30 | Subprocessor contracts and transfer controls | L-08; L-09; L-07 | Executed terms and transfer tools for material Production subprocessors | **None** — no providers | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | Legal + vendors | **Yes** | **Yes** | **Yes** | **Post-provider-selection** |
| E-31 | Human Legal/DPO determinations LA-01–LA-17 | All L; LA-01–LA-17 | Human Determination, reasoning, conditions, authority, identity, qualification, date, signature | **Legal Counsel component recorded:** THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N. Proposed analysis **ADOPTED with conditions**. **DPO component NOT ESTABLISHED.** Qualification/bar/firm **not supplied**. Factual artefacts still missing | `PARTIALLY EVIDENCED` (Legal Counsel) · DPO **NOT ESTABLISHED** | Qualified human reviewer | No for the Legal Counsel determination itself | Legal Counsel **yes**; DPO **pending** | Some answers remain conditional on architecture | **Yes — current** for Legal Counsel; combined Legal/DPO **not** complete |
| E-32 | Formal L-01–L-17 closure | L-01–L-17 | Per L item: determination, conditions, legal authority/evidence, reviewer identity, role/qualification, date, signature | Legal Counsel adopted L-01–L-17 rules (including L-05/L-17 **DEFERRED**). **No** DPO L-item closure. Factual completion of registers/maps **not** claimed | `PARTIALLY EVIDENCED` (Legal Counsel rules) · DPO **NOT ESTABLISHED** | Qualified human reviewer | Supporting artefacts as above | Legal Counsel **yes** for rules; DPO **pending** | L-05/L-17 remain architecture-dependent | Legal Counsel rule adoption **current**; L-17 remains architecture-dependent; combined closure **not** complete |

**Coverage: E-01–E-32 = 32/32.** No provider or region selected. No PDPC permit claimed. No DPO identity invented.

---

## 4. L-01–L-17 mapping

| L ID | Condition | Required Evidence IDs | Evidence Status | Human/DPO/Legal Status | Architecture Dependency | E1 Blocking? |
| --- | --- | --- | --- | --- | --- | --- |
| L-01 | PDPC registration if PDPA applies | E-02, E-31, E-32 | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Low | Applicability **current**; certificate **Production implementation** |
| L-02 | DPO/privacy lead where required | E-03, E-31, E-32 | `EVIDENCE MISSING` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | No | Trigger **current**; appointment artefact **Production implementation** |
| L-03 | Processing inventory | E-04 | `PARTIALLY EVIDENCED` | Review of completeness | Recipients/locations **yes** | Classes **current**; locations **architecture-dependent** |
| L-04 | Controller/processor matrix | E-01, E-06, E-07, E-31 | `PARTIALLY EVIDENCED` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Vendor rows **yes** | SEDMC/client roles **current** |
| L-05 | Data-flow map | E-08, E-19–E-29 | `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | After map exists | **Yes** | **Architecture-dependent** |
| L-06 | Transfer register | E-09, E-08 | `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** (populated paths) | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` per path | **Yes** | **Architecture-dependent** |
| L-07 | Transfer mechanism per path | E-10, E-09, E-30 | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | **Yes** for instruments; **no** for “no universal mechanism” rule | Rule **current E1**; instruments **architecture-dependent** |
| L-08 | Subprocessor register | E-11, E-30 | `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | After candidates | **Yes** | **Architecture-dependent** |
| L-09 | Contractual controls | E-07, E-30 | `EVIDENCE MISSING` · `EXTERNAL EVIDENCE REQUIRED` | Sufficiency review | **Yes** | **Post-provider-selection** |
| L-10 | Privacy notice | E-12 | `PARTIALLY EVIDENCED` (skeleton draft only) | Adequacy review | Recipients **yes** | **Production implementation** |
| L-11 | Retention/deletion | E-13, E-22 | `PARTIALLY EVIDENCED` (classes listed; periods TBD) | Review | Backup overlay **yes** | Policy **internal**; backup **architecture-dependent** |
| L-12 | Production TOMs | E-14, E-29 | `EVIDENCE MISSING` · `DEPENDENT ON PRODUCTION ARCHITECTURE` | Review vs law | **Yes** | **Production implementation** |
| L-13 | Breach process | E-15 | `PARTIALLY EVIDENCED` (documented process draft; not implemented/tested) | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` (notification mapping) | Provider clauses **yes** | Playbook **internal**; mapping **current E1** |
| L-14 | Sensitive-data controls | E-16, E-04 | `PARTIALLY EVIDENCED` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Stored-file census **yes** | Characterisation **current E1** |
| L-15 | DPIA/equivalent where required | E-17 | `PARTIALLY EVIDENCED` (P2 capability only) | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Full DPIA may need topology | Screening **current E1** |
| L-16 | Source-market screening | E-05, E-18 | `PARTIALLY EVIDENCED` | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | Transfer facts **yes** | TZ/KE/EU/UK screening **current E1** |
| L-17 | Review of **actual** architecture | E-08, E-19–E-30, E-31, E-32 | `DEPENDENT ON PRODUCTION ARCHITECTURE` · `NOT YET ASSESSABLE` · **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`** | `HUMAN/DPO/LEGAL DETERMINATION REQUIRED` | **Yes — blocking** | **Architecture-dependent hard gate** |

**No L item is closed.** None has determination, conditions, legal authority, reviewer identity, qualification, date, and signature. Proposed counsel analysis (category **D**) is **not** L-item closure.

---

## 5. Three gap types

### A. Evidence SEDMC can provide internally

| IDs | Gap |
| --- | --- |
| E-01 | Legal-entity / establishment records (company files, not branding). Phase 1 **placeholder only** — extract still required |
| E-04 | First processing inventory (personal vs corporate). Phase 1 **draft from models** exists — completeness review + recipients/locations remain |
| E-05 | Data-subject vs client vs destination geography map. Phase 1 **draft** exists — actual census and processing geography remain |
| E-06 | Draft controller/processor matrix (pre-vendor). Phase 1 **factual** matrix exists — legal determination remains |
| E-12 | Draft EOS privacy notice (recipients TBD). Phase 1 **skeleton** exists — not legally approved |
| E-13 | Retention/deletion policy for operational classes. Phase 1 matrix exists — **periods TBD** |
| E-15 | Documented incident/breach playbook. Phase 1 **documented process** exists — not implemented/tested |
| E-16 | Internal Restricted / Restricted+ schedule (already started in company position). Phase 1 mapping exists — statutory column pending human Legal/DPO |

### B. Evidence from providers / regulators / third parties

| IDs | Gap |
| --- | --- |
| E-02 | PDPC registration record (if required) |
| E-03 | PDPC DPO introduction (if that process applies) |
| E-07, E-30 | Executed vendor DPAs, location commitments, subprocessor lists |
| E-10 | Permits / legally recognized transfer instruments if required for actual paths |
| E-11, E-19–E-28 | Vendor region, subprocessors, support geography |
| E-14 | Shared-responsibility / certification **only if** later used as evidence (not claimed here) |

### C. Evidence requiring qualified human Legal/DPO determination

| IDs | Gap |
| --- | --- |
| E-31, E-32 | Formal LA-01–LA-17 and L-01–L-17 attestation |
| E-01, E-06 | Controller/processor/establishment as **legal** conclusions |
| E-02, E-03 | Whether PDPC registration / DPO are legally required |
| E-10, E-07 | Transfer mechanism and contract sufficiency |
| E-16 | Statutory sensitive/special-category characterisation |
| E-17 | Whether a DPIA/equivalent is required |
| E-18 | Jurisdiction applicability (not automatic from client country) |
| L-17 | Final legal sufficiency of the **actual** Production architecture |

AI counsel-style analysis and this register are **not** Type C evidence.

---

## 6. E1 BLOCKING EVIDENCE

### Current E1 blockers

Absence **now** prevents E1 closure, even before a cloud is chosen:

1. **E-31 / E-32** — Legal Counsel component recorded; **DPO determination not established**; combined Legal/DPO not complete
2. **E-01** — no legal-entity/establishment evidence beyond a business statement
3. **E-06** (SEDMC/client roles) — no attested role matrix
4. **E-16** — no statutory mapping of Restricted+ vs sensitive/special-category data
5. **E-17** — no Production DPIA/equivalent **screening** (P2 register ≠ screening)
6. **E-18** — no human applicability screening for Tanzania, Kenya, GDPR, UK GDPR
7. **E-10 (framework only)** — no human determination of the *rule* that extra-territorial paths need a lawful mechanism (instruments themselves wait on destinations)
8. **E-02 / E-03 (applicability only)** — whether registration/DPO are required is an E1 legal question; certificates are not yet the E1 hosting decision itself

Related Gate E1 sequence still **OPEN**: E1-C03 candidate offerings, E1-C04–C07 vendor/cost/IdP placement — those are **architecture/commercial**, listed below, and also block a full E1 **owner hosting decision**.

### Architecture-dependent blockers

Cannot be completed until a Production topology is proposed (still **not selected** here):

- E-08 data-flow map
- E-09 transfer register (populated paths)
- E-11 subprocessor register
- E-19 hosting jurisdiction
- E-20 PostgreSQL location
- E-21 object/document storage
- E-22 backup location (Gate-B/C dumps **out of scope**)
- E-23 DR location
- E-24 IdP
- E-25 email
- E-26 monitoring/logging
- E-27 CDN/WAF
- E-28 KMS/secrets
- E-29 support/admin **countries**
- L-05, L-17

### Post-provider-selection evidence

- E-07 contracts/DPAs
- E-10 path-specific instruments/permits
- E-30 subprocessor flow-down and transfer terms
- Vendor subprocessors, DPA schedules, data-location commitments

### Production implementation evidence

Not required to **write** E1 placement rules, but required before Production personal-data processing (L-01–L-17 as Production gates):

- E-02 registration certificate **if** required
- E-03 appointment artefacts **if** required
- E-12 published notice
- E-13 operational deletion including backup overlay
- E-14 implemented Production TOMs
- E-15 implemented/tested incident process
- E-04/E-05 completed operational inventory/census

Do **not** treat implementation gaps as a reason to select hosting in this task.

---

## 7. What is already evidenced (narrow)

| Present | What it is | What it is not |
| --- | --- | --- |
| Company LA-01–LA-17 positions | Business/factual layer | Legal attestation |
| AI counsel-style analysis + L-01–L-17 counsel review | Reviewable analysis | Signed opinion / DPO attestation |
| Proposed counsel-style determinations + EA-01–EA-10 official sources | Category **D** analysis; category **A** `VERIFIED SOURCE` URLs | Human Legal/DPO determination; SEDMC compliance evidence |
| Human/DPO/Legal Review Pack | Navigation/checklist | Determinations |
| Attestation instrument | Place to record human answers; proposed analysis referenced | Completed E1-C01 |
| Intended PostgreSQL SoR; Tanzania **preference** | Architecture intent | Selected region/provider |
| Internal Restricted / Restricted+ labels | IS classification | Statutory mapping |
| Phase 1 internal artefacts (inventory, maps, matrices, drafts) | Gap-controlled **preparation**; not closure | Completed E-01–E-18; not Legal/DPO attestation |
| Gate-B/C PG evidence | Disposable Dev/Test | Production backup/DR/hosting |

---

## 8. Reconciliation

| Observation | Handling |
| --- | --- |
| Requested path `docs/governance/adr-0006-e1-c01-counsel-review.md` **does not exist** | Authoritative counsel-review artefact is [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md). This register does **not** create the missing filename. |
| Company-position banner **PREPARED** vs analysis/attestation **COMPLETE** for 17/17 company answers | Same substance (17/17 recorded). Authoritative for **content**: company-position file. Neither is Legal/DPO attestation. |
| Attestation §7 “Current documented position” still `UNKNOWN` / fact-pack draft | Residual fact-pack text. Legal Counsel determinations are in the Human answer / Determination fields, not those cells. |
| Evidence-closure package E1-C01 still **OPEN** / E1 **BLOCKED BY MISSING EVIDENCE** | **Consistent** if E1-C01 is read as combined Legal/DPO + remaining evidence. Legal Counsel component is now recorded. |
| L-01–L-17 counsel review: conditions framework-sound | **Consistent.** Legal Counsel adopted those rules; L items are not factually closed. |
| Hosting-capability empty candidates | **Consistent** with E-11/E-19 `DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`. |
| AI analysis is not counted as E-31 | **Consistent.** Legal Counsel adoption in the attestation package is the E-31 Legal Counsel component. DPO remains missing. |
| Phase 1 internal evidence artefacts created | Index + E-01 placeholder + E-04/E-05/E-06/E-13/E-15/E-16/E-18 + E-12 skeleton. Items remain **not closed**. Human attestation remains incomplete. |

Formal human attestor identity, signature, date, and Determination remain **unfilled**.

---

## 9. Executive summary

### Current evidence posture

- **Already evidenced:** company positions 17/17; AI counsel materials; proposed counsel-style determinations 17/17 LA + 17/17 L; Legal Counsel attestation THOMAS NGULUMA 15TH SEPTEMBER 2026 A.T.N (category **E** Legal Counsel only); EA-01–EA-10 official sources (`VERIFIED SOURCE`, not SEDMC compliance); Tanzania as **preferred** (not selected); PostgreSQL as **intended** SoR; internal Restricted+ labels; Dev/Test privacy *capabilities* (P1/P2) that are not Production evidence.
- **Partially evidenced:** E-01 establishment (business claim + Phase 1 placeholder; **no extract**); E-04 intended classes + Phase 1 model-based inventory draft; E-05 market list + Phase 1 A–D map; E-06 likely-role analysis + Phase 1 factual matrix; E-12 notice **skeleton**; E-13 retention **classes** (periods TBD); E-15 documented-process **draft**; E-16 internal classification + Phase 1 statutory-mapping worksheet; E-17 P2 capability; E-18 AI screening + Phase 1 factual screening; E-29 preferred support controls; E-31/E-32 Legal Counsel component only.
- **Missing:** legal-entity extract; PDPC registration; **DPO appointment**; completed Production inventory/census; contracts; Production data-flow; transfer register/mechanisms; subprocessors; approved notice; legal retention periods; Production TOMs; implemented/tested breach process; DPO determination; Production component locations.
- **External evidence required:** PDPC artefacts; vendor locations/DPAs/subprocessors; any transfer permit/instrument; corporate registry extract for E-01; DPO appointment if required.
- **Human/DPO/Legal determination required:** DPO component of E-31/E-32; remaining factual completeness of legal conclusions still depends on missing artefacts.
- **Depends on future Production architecture:** E-08, E-09, E-11, E-19–E-30, L-05, L-17 — **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. Provider/location-specific transfer assessments are likewise deferred.

### E1 readiness

E1 remains **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**. Legal Counsel attestation is recorded. DPO determination is **not established**. No Production topology is selected, so L-05/L-17 and component-location rows remain **not finally closed**. Completing this register does **not** authorize Production.

### Production authorization

**PRODUCTION REMAINS NOT AUTHORIZED.**

---

## 10. Authorization boundary

This register does **not** select a cloud provider, region, backup provider, DR provider, IdP, email, CDN/WAF, or KMS product. It does **not** authorize infrastructure, databases, migrations, UAT, or deployment.

**Database contacted: NO**  
**Technical files changed: NONE** (governance documents only)  
**Git commit / push / PR / merge: NO**

**STOP.**
