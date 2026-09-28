# E-04 / E-05 / E-06 — Evidence Completeness, Consistency, and Authority Audit

> **`READ-ONLY GOVERNANCE AUDIT`**  
> **`THIS IS NOT LEGAL OPINION, DPO ATTESTATION, PDPC REGISTRATION, OR PRODUCTION AUTHORIZATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`DPO DETERMINATION: NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO: NOT COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`** · **`UAT = NOT AUTHORIZED`**  
> **`Migration = NOT AUTHORIZED`** · **`Deployment = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE: UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**  
> **`THOMAS NGULUMA — LEGAL COUNSEL ONLY`**

**Audit date (repository calendar):** 2026-09-16.  
**Scope:** completeness, consistency, and evidence-authority of:

- [`adr-0006-e1-c01-e04-eos-processing-inventory.md`](adr-0006-e1-c01-e04-eos-processing-inventory.md)
- [`adr-0006-e1-c01-e05-data-subject-geography-map.md`](adr-0006-e1-c01-e05-data-subject-geography-map.md)
- [`adr-0006-e1-c01-e06-processing-role-matrix.md`](adr-0006-e1-c01-e06-processing-role-matrix.md)

**Method:** read those three artefacts; inspect corresponding EOS schema, kernel types, document-storage implementation, and migrations; compare against adopted Legal Counsel LA-01–LA-17 / L-01–L-17, company business position, current evidence register, collection queue, consolidated Human Legal/DPO review pack, and proposed counsel determinations.

**This audit does not:** rewrite E-04/E-05/E-06; alter Legal Counsel attestation; alter LA/L determinations; change E-01/E-02/E-03 status; select architecture; appoint a DPO; invent lawful bases, registrations, or data-subject countries.

---

## Authority vocabulary used in this audit

| Label | Meaning |
| --- | --- |
| **FACT** | Directly evidenced by repository material (schema, types, code, existing governance artefact). |
| **COMPANY-PROVIDED FACT** | Company-supplied factual string (not used as the primary class in this audit’s E-04–E-06 findings). |
| **COMPANY POSITION** | SEDMC business/planning statement (LA-01–LA-17 company layer). |
| **DESIGN INTENT** | Architecture or control intended but not Production-selected or Production-implemented. |
| **APPLICATION / SCHEMA EVIDENCE** | Modelled capability. Not proof that Production data is processed. |
| **LEGAL COUNSEL ANALYSIS** | Adopted Legal Counsel legal/control position (Thomas Nguluma). Not a regulator certificate. |
| **PUBLIC REGULATORY GUIDANCE** | Official public pages. Not SEDMC-specific evidence. |
| **HUMAN LEGAL/DPO DETERMINATION** | Remaining qualified-human characterisation. DPO **NOT ESTABLISHED**. |
| **EXTERNAL EVIDENCE REQUIRED** | Artefact from registry, regulator, counterparty, or vendor is absent. |
| **ARCHITECTURE-DEPENDENT** | Cannot be completed until actual Production topology/providers exist. |

Do not convert one category into another.

---

## A. Executive result

| Item | Classification (multiple, as applicable) | Closes the evidence item? |
| --- | --- | --- |
| **E-04 — EOS Processing Inventory** | **PREPARATORY — SUBSTANTIALLY COMPLETE** for modelled EOS structured processing; **PREPARATORY — MATERIAL GAPS** for off-EOS census and some modelled surfaces not given dedicated inventory IDs; **REQUIRES HUMAN LEGAL/DPO DETERMINATION**; **ARCHITECTURE-DEPENDENT** for recipients, Production locations, subprocessors, and document-storage geography | **No.** Not VERIFIED. Not a Production RoPA. |
| **E-05 — Data-Subject Geography Map** | **PREPARATORY — SUBSTANTIALLY COMPLETE** for Layers A–D and target-market listing; **PREPARATORY — MATERIAL GAPS** for later analysis fields (source, purpose, recipient, transfer indicator); **REQUIRES HUMAN LEGAL/DPO DETERMINATION**; **REQUIRES EXTERNAL EVIDENCE** (actual census from company records); **ARCHITECTURE-DEPENDENT** for Layer D | **No.** Actual data-subject jurisdiction **MISSING**. Processing geography **NOT SELECTED**. |
| **E-06 — Processing Role Matrix** | **PREPARATORY — SUBSTANTIALLY COMPLETE** as a factual/candidate matrix that does **not** declare legal roles; **PREPARATORY — MATERIAL GAPS** for buyer-type granularity and dedicated geography/transfer/data-category columns; **REQUIRES HUMAN LEGAL/DPO DETERMINATION** on every row; **REQUIRES EXTERNAL EVIDENCE** (contracts/DPAs); **ARCHITECTURE-DEPENDENT** for provider rows | **No.** Legal roles remain **PENDING HUMAN/DPO/LEGAL DETERMINATION**. |

**Blocking contradiction:** **None found.**

The three documents remain consistent with the adopted Legal Counsel position:

- SEDMC is to be treated as **controller** where it determines purposes and essential means; **processor** / **joint-controller** status **may** arise depending on actual client arrangements and contracts (LA-01). E-06 records factual candidates only and does **not** declare those legal roles.
- Target market ≠ data-subject jurisdiction ≠ programme destination ≠ processing location (LA-05). E-05 keeps Layers A–D separate.
- Kenya DPA / GDPR / UK GDPR are **not** treated as automatically applicable because a market or destination appears on a list (LA-03, LA-04, L-16).
- Passport / national ID / date of birth / health / payment-card data are **not** currently structured EOS processing; document/free-text contents remain **UNKNOWN** (LA-13). E-04 records both facts.
- Recipients, Production locations, transfers, and vendor processor status wait on architecture and contracts (L-03, L-04, L-05, L-17).

**Not VERIFIED:** E-04, E-05, and E-06 remain preparatory. Schema capability is not Production processing. Legal Counsel attestation does not close these items.

Preserved (unchanged by this audit):

| Item | Status |
| --- | --- |
| E-01 | **NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED** |
| E-02 | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |
| E-03 | **DPO APPOINTMENT NOT ESTABLISHED** |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |
| E1-C01 Legal Counsel component | **COMPLETE** |
| DPO component | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT / Production / Migration / Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |
| Tanzania | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** |
| L-05 / L-17 | **ARCHITECTURE-DEPENDENT** |

---

## B. E-04 findings

Audited artefact: [`adr-0006-e1-c01-e04-eos-processing-inventory.md`](adr-0006-e1-c01-e04-eos-processing-inventory.md). Self-status **`DRAFT` · `PARTIALLY EVIDENCED`**. Does **not** claim to close E-04. Consistent with L-03 (inventory required; draft is a starting point, not a completed Production RoPA).

### B.1 Modelled current EOS processing (structured)

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| B-01 | E-04 correctly inventories organisations/clients (`crm_organizations`), contacts (`crm_contacts`), opportunities, RFPs and RFP versions, programmes / days / items, costing, commercial approvals, commercial document **metadata**, suppliers and supplier contacts, hotel profiles, principals / credentials / sessions, audit events, HR certification register, privacy-register **capability**, and booking commercial records. | Migrations `004_c1_crm.sql`, `015_c2_opportunity.sql`, `016_c3_rfp.sql`, `017_c5_programme.sql`, `018_c6_costing.sql`, `019_c7_commercial_approval.sql`, `020_c8_proposal.sql`, `014_c4_supplier.sql`, `119_cd_commercial_documents.sql`, `120_cd_supplier_contracts.sql`, `121_cd_hotel_profiles.sql`, `021_c9_booking.sql`, `100_h1_hr_certifications.sql`, `092_p1_privacy_ropa_dsr.sql` / `104_p2` / `110_p3`; `packages/db/schema.sql` (`principals`, `principal_credentials`, `sessions`, `audit_events`); kernel `CrmContact`. | **APPLICATION / SCHEMA EVIDENCE** · **FACT** that those models exist | Capability ≠ Production census. Environment is Dev/Test unless separately authorized. No live customer data is claimed — and none was found as Production population. | Company/ops completeness vs off-EOS processes (Queue A Q-A-02). Do not treat the inventory as a populated Production RoPA. |
| B-02 | Named delegates / travellers are **not** structured EOS processing. `pax_count` is an integer on RFP, programme, opportunity, costing, proposal, and booking records. | `pax_count INTEGER` in `016_c3_rfp.sql`, `017_c5_programme.sql`, `015_c2_opportunity.sql`, `018_c6_costing.sql`, `020_c8_proposal.sql`, `021_c9_booking.sql`. Booking table has no guest-identity columns. E-04 P-PRG-03 labelled **`FUTURE / NOT CURRENTLY EVIDENCED`**. | **FACT** / **APPLICATION / SCHEMA EVIDENCE** | Does not prove delegates will never be processed outside EOS or in free text / files. | Product + privacy confirmation whether named-delegate processing will be added before Production (E-04 §5). |
| B-03 | Structured EOS fields do **not** currently establish structured processing of passport numbers, national IDs, dates of birth, health/accessibility information, or payment-card data. Event payloads **forbid** `passport`, `nationalId`, `dateOfBirth` (and related keys). | `CrmContact` has name/email/telephone/job title/country — no passport/DoB. Event `SENSITIVE_KEYS` in `packages/kernel/src/event-schema.ts`; `docs/governance/event-sensitive-data-policy.md`. No health/accessibility/PAN domain fields found in inspected CRM/programme/booking schemas. Architecture examples of those classes remain **DESIGN INTENT**. | **FACT** for absence of structured fields; **DESIGN INTENT** for architecture examples; **COMPANY POSITION** (LA-12/LA-13) for intended controls **if** those classes are later processed | Absence of structured fields ≠ proof that such data cannot enter via free text or document bytes. | Keep residual-risk label. File/free-text census remains outstanding. Do not invent that those categories “cannot” be processed. |
| B-04 | Personal-data fields that **are** represented in current models include: contact given/family/preferred name, email, telephone, mobile, job title, department, country, timezone, language; organisation primary email/telephone/address JSONB; principal email and display name; password **hash**; supplier contact name/email/telephone; staff actor IDs on approvals, audit, and ownership fields. | `004_c1_crm.sql` `crm_contacts` / `crm_organizations`; `schema.sql` `principals` / `principal_credentials`; `014_c4_supplier.sql` `sup_contacts`. | **APPLICATION / SCHEMA EVIDENCE** | Field existence ≠ actual Production population. Organisation email/phone/address may or may not identify a natural person. | Characterise personal vs corporate contents in an actual census (human/ops). |

### B.2 Document processing

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| B-05 | EOS stores commercial **document metadata** in PostgreSQL: filename, mime type, size, SHA-256 checksum, `storage_ref`, classification, kind (`rfp` / `contract` / `rate_sheet` / `other`), status, uploader principal, optional RFP/supplier/contract links. | `119_cd_commercial_documents.sql`; `packages/kernel/src/commercial-document.ts`. Comment in migration: bytes are **not** stored in PostgreSQL. | **FACT** | Metadata classification is an internal label, not a legal characterisation of file contents. | Do not treat metadata classification as a content census. |
| B-06 | Document **bytes** are outside the database, behind a `DocumentStorage` port. Current implementation evidence is Dev/Test `LocalFsDocumentStorage` (local filesystem under `EOS_DOCUMENT_ROOT` or a temp directory). Production object-storage provider and geography are **NOT SELECTED**. | `apps/api/src/commercial-documents/storage.ts`; E-04 P-DOC-01/02; register E-21. | **FACT** (Dev adapter); **DESIGN INTENT** / **ARCHITECTURE-DEPENDENT** (Production) | Repository evidence does **not** establish Production document location. Allowed MIME types (PDF, DOCX, XLSX, CSV, JPEG, PNG) **could** contain personal or sensitive information. Contents are **UNKNOWN**. | Keep document-content classification unresolved. Do not select an object store in this audit. Ops/privacy file census (Q-A-02). |

### B.3 Recipients, purposes, lawful basis, geography

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| B-07 | Business purposes listed (CRM/sales, RFP management, programme building, costing, approvals, supplier/hotel coordination, commercial documentation, audit/accountability, security/access control) are defensible as **product/business purposes** matching implemented modules. Lawful bases are **not** invented. Retention is **TO BE DETERMINED**. | E-04 inventory columns; company position LA-01 purpose list; E-13 periods TBD. Legal Counsel L-10: lawful basis **only where legally applicable**. | **COMPANY POSITION** (purposes); **APPLICATION / SCHEMA EVIDENCE** (modules exist); **LEGAL COUNSEL ANALYSIS** (do not invent bases) | Purpose ≠ lawful basis. Inventory does not prove which purposes will run in Production. | Human Legal/DPO lawful-basis determination **where applicable law requires it**. Retention numbers remain E-13. |
| B-08 | Recipients are recorded as SEDMC staff / Dev storage, with Production recipients, subprocessors, and processing geography **NOT SELECTED**. Client send-path for proposals is **not** Production-evidenced. | E-04 recipient / geographic columns; ADR-0013 OPEN; email/IdP/monitoring **NOT SELECTED**. | **ARCHITECTURE-DEPENDENT** | Does not prove absence of off-EOS recipients (mailboxes, WhatsApp, spreadsheets). | Architecture-dependent recipient map (E-08). Internal completeness for off-EOS channels. |
| B-09 | E-04 correctly refuses to close on detail alone. Remaining gaps it already records: Production RoPA, providers/recipients, human review, document bytes, future delegate processing. | E-04 §§4–6. | **FACT** that the draft self-limits | Additional modelled surfaces (below) are not given dedicated IDs. | See B-10. Completeness still requires human/ops sign-off. |

### B.4 Non-blocking completeness observations (not contradictions)

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| B-10 | Domain **outbox events** (`outbox_events` JSONB payload) and **access-control** tables (`roles`, `permissions`, `principal_roles`, `abac_policies`, `sod_rules`) exist in schema. E-04 covers audit events, identity, and email outbox, but does not give dedicated inventory IDs to domain outbox or access-control information. | `packages/db/schema.sql`; `003_i4_outbox_events.sql`; event sensitive-data policy. | **APPLICATION / SCHEMA EVIDENCE** | Outbox payloads are constrained against embedding listed sensitive keys; JSONB could still copy other contact/state fields. Access-control records identify principals and role assignments. | Optional later inventory rows. Not a blocking contradiction: identity/audit/email processing is already inventoried. |
| B-11 | Additional free-text / identifier surfaces not given dedicated E-04 field lists: programme `internal_notes` / `client_notes` (`122_cd_programme_item_extensions.sql`); programme-version `snapshot` JSONB; supplier-contact `whatsapp`; supplier-entity `email` / `telephone` on `sup_suppliers`. E-04 already treats CRM notes/activities and document bytes as possible personal/sensitive free text. | Migration `122`; `014_c4_supplier.sql` `sup_contacts.whatsapp`; kernel `programme.ts` `clientNotes`. | **APPLICATION / SCHEMA EVIDENCE** | Same residual-risk class as E-04 free-text / document-bytes warnings. | Include in any later completeness pass. Do not invent that these fields currently contain Production personal data. |
| B-12 | CRM organisation **type keys** in Dev seed include `incentive_house`, `corporate_travel_agency`, `travel_advisor`, `mice_agency`, `corporate`, `supplier`, and others. There is no dedicated `pco` or `event_agency` key. Company position LA-04/LA-05 lists PCOs and event agencies as expected relationship types. | `DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` in `packages/kernel/src/crm.ts`; company position LA-04/LA-05. | **APPLICATION / SCHEMA EVIDENCE** vs **COMPANY POSITION** | Type keys are configurable per tenant. Absence of a key ≠ absence of those counterparties in business. | Do not treat seed keys as a legal party census. E-06 granularity gap recorded in §D. |

**E-04 audit conclusion:** the inventory is **sufficiently prepared** as a modelled-processing baseline for later qualified Legal/DPO review and for later Production-architecture assessment. It is **not** verified, **not** a Production RoPA, and **must not** be closed from repository inference.

---

## C. E-05 findings

Audited artefact: [`adr-0006-e1-c01-e05-data-subject-geography-map.md`](adr-0006-e1-c01-e05-data-subject-geography-map.md). Self-status **`DRAFT` · `PARTIALLY EVIDENCED`**. Actual data-subject jurisdiction **MISSING**. Layer D **NOT SELECTED**. Does **not** close E-05. Consistent with LA-05 and L-16.

### C.1 Layer separation (required)

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| C-01 | E-05 clearly separates **Layer A** (client/organisation geography), **Layer B** (individual data-subject geography), **Layer C** (programme destination), and **Layer D** (EOS processing/storage/recipient geography), and states they are not interchangeable. | E-05 opening table; §2–§5; worked non-equivalence examples labelled **hypothetical, not facts**. | **FACT** (document structure); **COMPANY POSITION** (market list); **APPLICATION / SCHEMA EVIDENCE** (country/destination fields exist) | Map is a framework, not a census. | Keep layers separate in all later analysis. |
| C-02 | Target markets are represented as **`TARGET MARKET`**, not as verified actual data-subject jurisdictions: Tanzania, Kenya, South Africa, Europe/EU-EEA, United Kingdom, Middle East, Canada, United States, Latin America. | E-05 §2; company position LA-03/LA-05; register §9. | **COMPANY POSITION** | Company expectation that EOS **may** contain data relating to those markets is not proof that any listed-market individual is an EOS data subject. | Collect actual client/contact geography from company records (Q-A-03). Do not infer GDPR, UK GDPR, Kenya DPA, or Tanzania PDPA applicability from the list. |
| C-03 | Schema **can** store organisation `country` / `region` / `market` and contact `country`. Destination/location on RFP/programme/day are **text**. Principals have email/display name and **no** country field. Dev seed location `ARU` Arusha is **DEV SEED**, not establishment evidence. | `004_c1_crm.sql`; `016_c3_rfp.sql` `destinations`; `017_c5_programme.sql` `destinations` / `prg_days.location`; `schema.sql` `principals`; `apps/api/src/store.ts` seed `legalName: "Serengeti Experience DMC Ltd"` and Arusha HQ. | **APPLICATION / SCHEMA EVIDENCE** · **DESIGN INTENT** (seed) | Stored country field ≠ census. Seed name is **not** E-01 verification (E-01 remains **NOT VERIFIED**). | Do not resolve seed-name discrepancy in this audit. |
| C-04 | Layer D correctly records application, PostgreSQL, object storage, backups, DR, IdP, email, monitoring, CDN/WAF/KMS as **NOT SELECTED** for Production. Tanzania hosting is **preferred**, not selected. Gate-B/Gate-C dumps are excluded as Production backup/DR evidence. | E-05 §5; Legal Counsel LA-06; register §10. | **ARCHITECTURE-DEPENDENT** · **COMPANY POSITION** (preference) · **LEGAL COUNSEL ANALYSIS** (preference ≠ selection) | Unselected architecture ≠ proof that no cross-border path will exist, and ≠ proof that a path already exists. | Defer Layer D until architecture exists (L-05 / L-17). |
| C-05 | E-05 does **not** conclude that GDPR, UK GDPR, Kenya DPA, or any other law applies merely because a country appears on the market or destination list. It points legal-geography characterisation to E-18 and human Legal/DPO review. | E-05 §1 last paragraph; §4 Kenya/Tanzania interchangeability warnings; counsel L-16. | **LEGAL COUNSEL ANALYSIS** (framework); map itself is **DRAFT** | Screening support ≠ completed applicability memo. | E-18 / human Legal/DPO fact-specific assessment. DPO **NOT ESTABLISHED**. |

### C.2 Fields useful later — present vs missing

| Field needed later | In E-05 today? | Classification |
| --- | --- | --- |
| Data-subject category | **Yes** (Layer B classes) | Preparatory |
| Jurisdiction/country | **Target markets listed**; **actual census MISSING** | **REQUIRES EXTERNAL EVIDENCE** / company records |
| Source of data | **No dedicated column** | **PREPARATORY — MATERIAL GAPS** |
| Relationship to SEDMC | **Partial** (class labels; not per-record) | Preparatory |
| Programme/destination | **Yes** (Layer C) | Preparatory |
| Processing purpose | **No dedicated per-subject column** (see E-04) | **PREPARATORY — MATERIAL GAPS** |
| Recipient | **No dedicated column** | **PREPARATORY — MATERIAL GAPS** / **ARCHITECTURE-DEPENDENT** |
| Storage/processing geography | **Yes** as Layer D **NOT SELECTED** | **ARCHITECTURE-DEPENDENT** |
| Transfer indicator | **No dedicated column** | **PREPARATORY — MATERIAL GAPS** / **ARCHITECTURE-DEPENDENT** |
| Applicable-law assessment status | **Points to E-18**; not a per-row law-applies flag | Correct restraint; **REQUIRES HUMAN LEGAL/DPO DETERMINATION** |

No actual data-subject countries were invented. **Correct.**

**E-05 audit conclusion:** the map is **sufficiently prepared** as a four-layer framework for later fact-specific applicability analysis. It is **not** a verified geography census and **must not** be used as proof that any extra-Tanzanian statute applies or does not apply.

---

## D. E-06 findings

Audited artefact: [`adr-0006-e1-c01-e06-processing-role-matrix.md`](adr-0006-e1-c01-e06-processing-role-matrix.md). Self-status **`DRAFT` · `PARTIALLY EVIDENCED`**. Legal determination on every row: **`PENDING HUMAN/DPO/LEGAL DETERMINATION`**. Does **not** close E-06. Consistent with L-04 and LA-01.

### D.1 Role-declaration restraint

| Finding | Statement | Evidence | Evidence category | Limitation | Remaining action |
| --- | --- | --- | --- | --- | --- |
| D-01 | E-06 does **not** declare SEDMC legally a controller, processor, or joint controller. It records factual role **candidates** (who operates EOS; who appears to determine commercial purposes/means in Dev/Test) and leaves legal determination pending. | E-06 §§1–4; every matrix legal column **PENDING**. Observation 1: EOS “tends to look like” SEDMC determining many purposes, **but** Legal/DPO must still decide. | **APPLICATION / SCHEMA EVIDENCE** (what EOS does); **COMPANY POSITION** (LA-01 business purposes); **LEGAL COUNSEL ANALYSIS** (adopted LA-01 framework — not copied as a per-row legal conclusion) | Factual similarity to controllership is not a legal conclusion. Employer identity for staff data still depends on E-01 (**NOT VERIFIED**). | Human Legal/DPO per activity and per **applicable** law (applicability itself is E-18). Contracts (E-07) **EXTERNAL EVIDENCE REQUIRED**. |
| D-02 | Adopted Legal Counsel position is preserved and not contradicted: treat SEDMC as **controller** where it determines purposes and essential means; SEDMC **may** act as **processor** where a client determines purposes and means of delegate/client-data processing; **joint-controller** status may arise depending on actual arrangements; technology providers **may** be processors/subprocessors once engaged. Named delegate processing is **not** currently structured in EOS. | Proposed counsel determinations LA-01 (attested 15 September 2026); E-06 delegate row **FUTURE / NOT CURRENTLY EVIDENCED**; E-04 P-PRG-03. | **LEGAL COUNSEL ANALYSIS** · **APPLICATION / SCHEMA EVIDENCE** (delegates not structured) | LA-01 is a legal/control **framework**, not proof of actual contracts or of a completed DPO determination. DPO **NOT ESTABLISHED**. THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**. | Final role classification must follow actual processing and contracts (LA-01 condition). Do not appoint a DPO in this audit. |
| D-03 | No executed DPA, instruction schedule, or joint-controller agreement was found. Provider rows remain **NOT SELECTED**. E-06 does not claim any vendor is a processor. | E-06 observations 2–3; register E-07; queue Q-B-04 / Q-E-04. | **EXTERNAL EVIDENCE REQUIRED** · **ARCHITECTURE-DEPENDENT** | “None evidenced” ≠ “no contract exists anywhere in the company.” It means **none in this repository**. | Collect existing paper if it exists (Q-A-05 / Q-B-04). Do not invent DPAs. Vendor classification after provider selection. |

### D.2 Coverage of requested party types

| Party / relationship | How E-06 treats it | Audit note |
| --- | --- | --- |
| SEDMC | Factual operator of EOS commercial modules | Consistent with company LA-01; legal role pending |
| Corporate clients | Client role candidate on CRM/RFP/programme/document rows | Not a dedicated legal-role conclusion |
| Event agencies / PCOs / MICE agencies / travel agencies / corporate travel companies / destination-event specialists | **Not separate matrix rows.** Subsumed under generic “client” / CRM counterparties. Dev org-type keys include `mice_agency`, `incentive_house`, `corporate_travel_agency`, `travel_advisor`, `corporate` — **not** dedicated `pco` / `event_agency` keys | **PREPARATORY — MATERIAL GAPS** for later instruction/control analysis. **COMPANY POSITION** lists these types (LA-04/LA-05). Do not invent distinct legal roles from type labels. |
| Programme/delegate data sources | Dedicated row: **not currently structured in EOS** | Consistent with E-04 P-PRG-03 |
| Hotels / suppliers / transport-activity providers | Supplier/hotel master-data row; supplier categories include accommodation, vehicle_hire, excursion | Factual sourcing by SEDMC; legal role pending; vendor location ≠ contact residence (E-05) |
| Hosting / email / IdP / monitoring / other technology providers | Dedicated rows; Production **NOT SELECTED**; role **not determined** | **ARCHITECTURE-DEPENDENT**. Does not select providers. |

### D.3 Required matrix dimensions

| Dimension requested for later Legal/DPO use | Present in E-06? |
| --- | --- |
| Factual relationship | **Yes** (SEDMC / client / vendor candidates) |
| Proposed/likely legal role | **Not declared** (correct). Legal Counsel “likely controller where purposes/means determined by SEDMC” is a **framework**, left pending per row |
| Processing purpose | **Partial** (who determines purpose; not a dedicated purpose taxonomy column) |
| Data categories | **By reference to E-04**, not a dedicated column |
| Instructions / control | **Yes** (`Actual instructions?` = none evidenced; who determines purpose/means) |
| Contract / DPA status | **Yes** (none evidenced) |
| Geography | **No dedicated column** — **PREPARATORY — MATERIAL GAPS** / **ARCHITECTURE-DEPENDENT** |
| Transfer implications | **No dedicated column** — same |
| Human Legal/DPO determination status | **Yes** — **PENDING** on every row |

**E-06 audit conclusion:** the matrix is **sufficiently prepared** as a factual candidate instrument that preserves Legal Counsel’s role **framework** without converting it into per-activity legal conclusions. It is **not** verified. Contracts and provider evidence remain outstanding. Buyer-type granularity and geography/transfer columns would help later review but their absence is **not** a blocking contradiction.

---

## E. Cross-document consistency

Compared against: company business position; proposed counsel determinations (attested); Legal Counsel attestation package; L-01–L-17 counsel review; current evidence register; evidence collection queue; consolidated Human Legal/DPO review pack.

| Check | Result |
| --- | --- |
| Target market treated as actual data-subject jurisdiction? | **No.** E-05 labels **`TARGET MARKET`**. Register §9 matches. |
| Programme destination treated as processing location? | **No.** E-04/E-05 distinguish destination text from Layer D **NOT SELECTED**. |
| Provider declared a processor without provider evidence? | **No.** E-06 vendor rows: not selected; role not determined. |
| GDPR / UK GDPR / Kenya DPA claimed as definitely applicable? | **No.** Consistent with LA-03 **CONDITIONALLY APPLICABLE — FACT SPECIFIC**, LA-04 **POTENTIALLY APPLICABLE — DO NOT EXCLUDE**, L-16 risk-based screening. |
| Lawful bases claimed? | **No.** E-04: depends on applicable law, not determined. L-10: only where legally applicable. |
| Sensitive data claimed as currently structured when only future capability exists? | **No.** Passport/health/PAN/delegates labelled **`FUTURE / NOT CURRENTLY EVIDENCED`**. |
| Claim that sensitive data **cannot** enter via documents/free text? | **No.** E-04 residual risk: document bytes **UNKNOWN**. |
| Cross-border transfer claimed as existing without a path? | **No.** |
| Cross-border transfer claimed as absent merely because architecture is unselected? | **No.** Unselected ≠ no transfer and ≠ a transfer. LA-10/L-06 registers remain empty until topology exists. |
| Legal Counsel attestation used as PDPC registration, DPO appointment, or Production authorization? | **No.** Distinct facts preserved. |
| Thomas Nguluma identified as DPO? | **No.** **LEGAL COUNSEL ONLY.** |
| E-01/E-02/E-03 statuses altered by E-04–E-06 drafts? | **No.** |
| Register / queue vs E-04–E-06 self-status | **Consistent:** all three remain **DRAFT / PREPARATORY**; Queue A Q-A-02/03/04 still correctly require internal completeness, census, and factual role confirmation. |

**No material contradiction was found** among E-04, E-05, E-06, the adopted Legal Counsel position, the company business position, the current evidence register, or the collection queue.

Non-blocking observations (B-10, B-11, B-12, C.2 missing later fields, D.2 buyer-type granularity, D.3 missing geography/transfer columns) are **completeness aids for later review**, not status upgrades and not contradictions.

E-04/E-05/E-06 banners still say `E1-C01: INCOMPLETE`. That describes **combined Legal/DPO incompleteness and Phase 1 evidence gaps**. It does **not** contradict **E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE**. Those banners were **not** rewritten in this audit (historical Phase 1 snapshots).

---

## F. Remaining dependencies

### Internal / company evidence

- Off-EOS personal-data processes (email mailboxes, messaging, spreadsheets) — Q-A-02.
- Whether unstructured commercial files **will** contain identity/health/other personal data — Q-A-02; E-16 residual.
- Actual client/contact/staff geography census, distinct from the target-market list — Q-A-03.
- Factual confirmation of which activities SEDMC vs clients actually control today — Q-A-04.
- Whether named-delegate processing will be added before Production — E-04 §5 / E-06 delegate row.
- Optional inventory completeness: domain outbox, access-control records, WhatsApp/supplier-org contact fields, programme notes/snapshots (B-10, B-11).

### Human Legal / DPO decisions

- Lawful basis **where applicable law requires it** (L-10) — **not** to be invented in these drafts.
- Per-activity controller / processor / joint-controller determination (LA-01, L-04) after facts and contracts.
- Fact-specific applicability (Tanzania primary framework already adopted as a **rule**; Kenya conditional; EU/UK potentially applicable) — E-18; **do not** convert markets into applicability.
- Completeness sign-off of E-04 as against intended Production scope.
- DPO appointment remains **NOT ESTABLISHED**. Combined Legal/DPO remains **INCOMPLETE**. THOMAS NGULUMA is **LEGAL COUNSEL ONLY**.

### External evidence

- E-01 legal-entity / establishment extract — **NOT VERIFIED**.
- E-02 SEDMC-specific PDPC registration/status — **NOT VERIFIED**. **NO SEDMC-SPECIFIC AUTHORITATIVE PDPC REGISTRATION/STATUS EVIDENCE IS AVAILABLE IN THE REPOSITORY.** Do not claim registered or not registered.
- E-03 DPO appointment/designation or regulatory DPO record — **NOT ESTABLISHED**.
- E-07 executed DPAs / role-appropriate contracts — none in repository.

### Architecture-dependent evidence

- Production processing/storage/recipient geography (E-05 Layer D; E-04 recipient/location columns).
- Hosting, PostgreSQL region, object storage, backup, DR, IdP, email, monitoring, CDN/WAF, KMS — **UNSELECTED**.
- Transfer register / mechanisms / subprocessors (E-08, E-09, E-11, E-19–E-30).
- Vendor processor vs independent-controller classification.
- **L-05** and **L-17** remain **ARCHITECTURE-DEPENDENT**.

This audit does **not** select a cloud provider, region, Tanzania or EU hosting, backup/DR geography, IdP, email provider, CDN/WAF, KMS, object storage, or any subprocessor.

---

## G. Governance conclusion

E-04, E-05, and E-06 are **preparatory instruments suitable for later qualified human Legal/DPO review and for later Production-architecture assessment**. They are **not** closed, **not** VERIFIED, and **not** a substitute for:

- a populated Production RoPA;
- an actual data-subject geography census;
- executed role-appropriate contracts;
- DPO appointment;
- PDPC registration/status evidence;
- selected Production topology.

**E1-C01 remains incomplete because the DPO component and factual/external evidence remain outstanding.**

**E1 remains NOT APPROVED / BLOCKED BY MISSING EVIDENCE.**

**Production/UAT/Migration/Deployment remain NOT AUTHORIZED.**

Legal Counsel attestation (THOMAS NGULUMA — LEGAL COUNSEL ONLY — 15TH SEPTEMBER 2026 — A.T.N) remains complete for the Legal Counsel component and is **not** altered by this audit. It does **not** establish DPO appointment, PDPC registration, regulatory approval, or Production authorization.

**STOP.** Do not manufacture a RoPA, census, appointment, certificate, provider selection, or legal-role conclusion to advance the gate.
)
