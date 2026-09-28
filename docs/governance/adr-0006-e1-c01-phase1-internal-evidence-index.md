# E1-C01 Phase 1 Internal Evidence Index

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE INDEX`**  
> **`E1-C01: INCOMPLETE`**  
> **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`**  
> **`UAT: NOT AUTHORIZED`**  
> **`L-01–L-17: NOT FORMALLY ATTESTED`**

This index records **repository discovery** and **Phase 1 internal artefacts** for E-01, E-04, E-05, E-06, E-13, E-15, E-16, E-18, and optional E-12.

Status vocabulary (this index only): `EVIDENCED` · `PARTIALLY EVIDENCED` · `MISSING` · `DRAFT` · `NOT APPLICABLE` · `REQUIRES HUMAN REVIEW`.

Not used: `APPROVED` · `COMPLIANT`.

Evidence quality labels used in artefacts: **FACT** · **COMPANY POSITION** · **DESIGN INTENT** · **AI COUNSEL ANALYSIS** · **HUMAN LEGAL/DPO DETERMINATION** · **EXTERNAL EVIDENCE**.

Creating a draft artefact does **not** close the E1 item.

---

## 1. Index

| Evidence ID | E1 Item | Evidence Description | Existing Evidence | Exact Path | Evidence Strength | Missing Information | Owner/Source | Human Review Required? | External Evidence Required? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| IDX-E01-01 | E-01 | Company Tanzania-based DMC position | COMPANY POSITION only | `docs/governance/adr-0006-e1-c01-company-business-position.md` | Does **not** prove legal name, registration, or establishment | Incorporation extract; registered office; attested establishment | SEDMC | Yes | Yes (registry/corporate records) | `PARTIALLY EVIDENCED` |
| IDX-E01-02 | E-01 | Fact-pack establishment | Recorded **UNKNOWN** | `docs/governance/adr-0006-stakeholder-fact-pack.md` | Proves the gap was already open | Affirmative establishment facts | SEDMC | Yes | Yes | `MISSING` |
| IDX-E01-03 | E-01 | Dev seed `legalName` / Arusha location | DESIGN / DEV SEED | `apps/api/src/store.ts` (seed organisations/locations) | Proves a **fixture string** exists | Must **not** be used as BRELA/incorporation evidence | Engineering (seed) | Yes (to reject as legal evidence) | Yes for real entity | `MISSING` (as legal evidence) |
| IDX-E01-04 | E-01 | Product/README branding | Branding | `README.md` and related product docs | Trading/product name only | Legal personality | — | Yes | Yes | `MISSING` (as legal evidence) |
| IDX-E01-05 | E-01 | Controlled placeholder / action record | Newly prepared | `docs/governance/adr-0006-e1-c01-e01-legal-entity-establishment.md` | Records the gap; invents nothing | All authoritative corporate facts | SEDMC Legal | Yes | Yes | `MISSING` / `REQUIRES HUMAN REVIEW` |
| IDX-E04-01 | E-04 | Intended processing classes | COMPANY POSITION LA-01/LA-12 | `docs/governance/adr-0006-e1-c01-company-business-position.md` | Intended classes, not a RoPA | Recipients, locations, lawful bases, Production census | Privacy/ops | Yes | No for first inventory | `PARTIALLY EVIDENCED` |
| IDX-E04-02 | E-04 | P1/P2 privacy **register capability** | Dev/Test capability | `packages/db/migrations/092_p1_privacy_ropa_dsr.sql`; `104_p2_privacy_dpias.sql`; P1/P2 architecture previews | Capability ≠ completed Production inventory | Populated Production RoPA | Privacy | Yes | No | `PARTIALLY EVIDENCED` |
| IDX-E04-03 | E-04 | CRM/RFP/programme/commercial **schema and kernel** | FACT: modelled fields | `packages/kernel/src/crm.ts`; `packages/db/migrations/004_c1_crm.sql`, `015_c2_opportunity.sql`, `016_c3_rfp.sql`, `017_c5_programme.sql`, `018_c6_costing.sql`, `019_c7_commercial_approval.sql`, `119_cd_commercial_documents.sql`, `120_cd_supplier_contracts.sql`, `121_cd_hotel_profiles.sql`; `packages/db/schema.sql` | Proves **what EOS can store**, not live Production data | Production population; document-byte contents; recipients | Product + privacy | Yes (completeness) | Recipients later | `PARTIALLY EVIDENCED` |
| IDX-E04-04 | E-04 | Event forbidden PII keys | FACT | `docs/governance/event-sensitive-data-policy.md`; `packages/kernel/src/event-schema.ts` | Passport/DoB/email **not** in event payloads by policy | Does not prove documents lack those data | Security | Review | No | `EVIDENCED` (event policy only) |
| IDX-E04-05 | E-04 | Named delegates / passport / health structured processing | **Not found** as domain fields | E-04 inventory §2 | Absence recorded | If later added, inventory must be updated | Product | Yes if scope changes | No | `MISSING` (as current processing) / labelled **FUTURE / NOT CURRENTLY EVIDENCED** |
| IDX-E04-06 | E-04 | Phase 1 processing inventory | Newly prepared | `docs/governance/adr-0006-e1-c01-e04-eos-processing-inventory.md` | Draft activity inventory from actual models | Lawful basis; Production recipients/locations; unstructured files | Privacy/ops | Yes | Partial (recipients) | `DRAFT` / `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW` |
| IDX-E05-01 | E-05 | Target source-market list | COMPANY POSITION | Company position LA-05; fact pack | **`TARGET MARKET`** only | **`ACTUAL DATA-SUBJECT JURISDICTION`** census | Commercial/privacy | Yes | No for first map | `PARTIALLY EVIDENCED` |
| IDX-E05-02 | E-05 | Schema country fields | FACT capability | `crm_organizations.country`; `CrmContact.country`; RFP/programme destination text | Can store geography; not a census | Actual values in Production (none authorized) | Product | Review | No | `PARTIALLY EVIDENCED` |
| IDX-E05-03 | E-05 | Processing/storage geography | **NOT SELECTED** | E-19–E-28 in evidence closure register | Proves the gap | Provider/region | Architecture (later) | After selection | Yes (vendor regions) | `MISSING` |
| IDX-E05-04 | E-05 | Phase 1 geography map | Newly prepared | `docs/governance/adr-0006-e1-c01-e05-data-subject-geography-map.md` | Distinguishes layers A–D | Actual subject census; Layer D | Commercial/privacy | Yes | Layer D yes | `DRAFT` / `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW` |
| IDX-E06-01 | E-06 | Likely-role analysis | COMPANY POSITION + AI COUNSEL ANALYSIS | Company position; `adr-0006-e1-c01-counsel-style-legal-analysis.md`; L-04 counsel review | Analysis, **not** determination | Human role findings; contracts | Legal/DPO | **Yes** | Yes (contracts) | `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW` |
| IDX-E06-02 | E-06 | Executed instructions / DPAs | **None found** | — | — | All DPAs | Legal | Yes | **Yes** | `MISSING` |
| IDX-E06-03 | E-06 | Factual role matrix | Newly prepared | `docs/governance/adr-0006-e1-c01-e06-processing-role-matrix.md` | Facts and candidates only | Legal determination every row | Legal/DPO | **Yes** | Vendor rows yes | `DRAFT` / `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW` |
| IDX-E12-01 | E-12 | Existing Production/EOS privacy notice | **None found** as sufficient scoped notice | — | — | Full notice after facts exist | SEDMC | Yes | Recipients | `MISSING` |
| IDX-E12-02 | E-12 | Draft skeleton | Newly prepared | `docs/governance/adr-0006-e1-c01-e12-eos-privacy-notice-draft.md` | Lists evidenced processing only; **`DRAFT — NOT LEGALLY APPROVED`** | Entity, bases, retention, transfers, DPO, contacts, providers | Legal/DPO | **Yes** | Yes (later) | `DRAFT` / `REQUIRES HUMAN REVIEW` |
| IDX-E13-01 | E-13 | Soft-delete / erasure DESIGN INTENT | DESIGN INTENT | `docs/architecture/05-data-architecture.md`; C1 ADR impact (retention open before UAT) | Technical pattern, not periods | All legal/contractual periods | Legal/Finance/privacy | Yes | Backup vendor TTL later | `PARTIALLY EVIDENCED` |
| IDX-E13-02 | E-13 | Proposed retention matrix | Newly prepared | `docs/governance/adr-0006-e1-c01-e13-retention-requirements.md` | Classes listed; periods **TO BE DETERMINED** | Every period; deletion design vs audit immutability | Privacy + Legal + Finance | **Yes** | Backup overlay | `DRAFT` / `REQUIRES HUMAN REVIEW` |
| IDX-E15-01 | E-15 | Crisis/incident architecture | DESIGN INTENT | `docs/architecture/13-crisis-command-center.md` | Generic incident lifecycle | Privacy-breach playbook; tests; regulator clocks | Security | Yes | Provider notice terms | `PARTIALLY EVIDENCED` (design only) |
| IDX-E15-02 | E-15 | Production IR / monitoring | Governance records **NOT READY** | Formal decision package monitoring row; E-26 | Gap evidenced | Implemented/tested controls | Security | Yes | Yes (vendor IR) | `MISSING` |
| IDX-E15-03 | E-15 | Proposed 12-step privacy IR process | Newly prepared | `docs/governance/adr-0006-e1-c01-e15-personal-data-incident-response.md` | **`DOCUMENTED PROCESS`** draft | Implementation, test, DPO, notification mapping | Security + Legal/DPO | **Yes** | Yes | `DRAFT` / `REQUIRES HUMAN REVIEW` |
| IDX-E16-01 | E-16 | Internal classification schemes | COMPANY POSITION + DESIGN INTENT + schema FACT | Company LA-12/LA-13; `docs/architecture/05-data-architecture.md`; `classification` columns | Internal labels exist | Statutory mapping; Production handling standard | Security + Legal | **Yes** | Census of files | `PARTIALLY EVIDENCED` |
| IDX-E16-02 | E-16 | Classification-to-statute map | Newly prepared | `docs/governance/adr-0006-e1-c01-e16-data-classification-legal-mapping.md` | Preserves ≠ statutory; legal column pending | Human mapping under applicable law | Legal/DPO | **Yes** | No for policy map | `DRAFT` / `REQUIRES HUMAN REVIEW` |
| IDX-E18-01 | E-18 | Target markets + AI TZ/KE/EU/UK notes | COMPANY POSITION + AI COUNSEL ANALYSIS | Company position; counsel-style analysis; L-16 counsel review | Markets and analysis, **not** applicability findings | Human screening conclusions; subject census; establishment | Legal/DPO | **Yes** | Establishment extract (TZ) | `PARTIALLY EVIDENCED` / `REQUIRES HUMAN REVIEW` |
| IDX-E18-02 | E-18 | Phase 1 applicability screening | Newly prepared | `docs/governance/adr-0006-e1-c01-e18-source-market-applicability-screening.md` | Factual screening; no law-applies conclusion | Human determinations | Legal/DPO | **Yes** | Transfers after architecture | `DRAFT` / `REQUIRES HUMAN REVIEW` |

---

## 2. Discovery summary (pre-artefact)

| E1 item | What exists | What it does not prove | Current? | Complete? | Proposal/design? | Human/DPO/Legal? | External? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | Business Tanzania position; Dev seed name; branding | Legal entity / establishment | Position current as a **position**; seed is Dev | No | Seed is design | Yes | Yes |
| E-04 | Schemas, kernel types, company intended classes, P1 capability | Production RoPA; delegate/passport/health processing | Models current for Dev/Test | No | P1 is capability | Completeness + legal characterisation | Recipients later |
| E-05 | Target markets; country **fields** | Actual subject jurisdictions; hosting geography | Markets are a position | No | Hosting is design | Yes (legal geography) | Hosting vendors |
| E-06 | Role **analysis** | Legal roles; instructions | Analysis is advisory | No | — | **Yes** | Contracts |
| E-13 | Soft-delete design; company wants defined retention | Any statutory period | Design current | No | Yes | **Yes** | Backup TTL |
| E-15 | Crisis architecture; IR **NOT READY** | Implemented/tested breach process | Design only | No | Yes | **Yes** (notice mapping) | Vendor clauses |
| E-16 | Internal labels | Statutory sensitive/special-category status | Labels current as internal | No | Architecture examples include future data types | **Yes** | File census |
| E-18 | Market list; AI screening notes | That any foreign law applies | Positions current | No | — | **Yes** | Establishment; later transfers |
| E-12 | None adequate | — | — | No | — | **Yes** | Recipients |

---

## 3. Integrity notes

- No human Legal/DPO determination was recorded or fabricated.
- No DPO was named.
- No provider or Production region was selected.
- Dev seed `Serengeti Experience DMC Ltd` is **not** treated as incorporation evidence.
- Architecture examples of guest passports/health are **DESIGN INTENT**, not current structured processing.

---

## 4. Governance status (unchanged)

- E1-C01 = **INCOMPLETE**
- E1 = **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**
- Production = **NOT AUTHORIZED**
- UAT = **NOT AUTHORIZED**
