# E-04 — EOS Processing Inventory (Phase 1 Internal)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: PARTIALLY EVIDENCED` / `DRAFT` / `REQUIRES HUMAN REVIEW`**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

This inventory is prepared from **actual EOS domain models, schemas, and documented business requirements**. It is **not** a completed Production Record of Processing Activities (RoPA). P1 RoPA remains a **Dev/Test register capability**, not this inventory.

Evidence quality:

- **FACT** = schema/kernel/API capability exists in the repository.
- **COMPANY POSITION** = intended Production classes from SEDMC LA-01/LA-12.
- **DESIGN INTENT** = architecture that is not yet Production processing.
- Recipients, processing geography, lawful basis, and retention periods are **not invented**.

Environment: all listed capabilities are **Development/Test** unless separately Production-authorized. No live customer data is claimed.

---

## 1. Scope rules

1. Distinguish **personal data** from purely **corporate/commercial** information.
2. Do **not** treat a schema capability as a completed Production census.
3. Do **not** invent delegate, passport, or health processing.
4. If a category is only a future capability, label it **`FUTURE / NOT CURRENTLY EVIDENCED`**.
5. Document-byte contents are **UNKNOWN** unless a structured field exists.
6. Legal/framework dependency is recorded as a **dependency**, not as a determination that a law applies.

---

## 2. Categories explicitly not currently evidenced as EOS structured processing

| Category | Finding | Label |
| --- | --- | --- |
| Delegate / traveller identity lists (named individuals as programme participants) | Programme/RFP models store `pax_count` (integer) and destination/location **text**, not a delegate identity table | **`FUTURE / NOT CURRENTLY EVIDENCED`** as structured EOS processing |
| Passport / national ID fields on CRM or programme records | `CrmContact` has no passport field. Event catalogue **forbids** payload keys `passport`, `nationalId`, `dateOfBirth` (`docs/governance/event-sensitive-data-policy.md`; `packages/kernel/src/event-schema.ts`) | **Not currently evidenced** as structured processing |
| Health / accessibility data | No EOS domain field found. Architecture examples in `docs/architecture/05-data-architecture.md` are **DESIGN INTENT** examples, not implemented processing | **`FUTURE / NOT CURRENTLY EVIDENCED`** |
| Payment card / PAN | Highly Restricted example in data architecture; **not** an implemented commercial payment-instrument store | **`FUTURE / NOT CURRENTLY EVIDENCED`** |
| Biometric data | **Not found** | **`FUTURE / NOT CURRENTLY EVIDENCED`** |

Company position LA-12 **intends** stronger controls **if** passport/health/financial data are processed. That is **COMPANY POSITION**, not evidence that EOS currently processes those categories.

Unstructured **document bytes** (`commercial_documents` + `DocumentStorage`) **could** contain any of the above if a user uploads such a file. Contents are **UNKNOWN**. Treat as a residual risk, not as evidenced structured processing.

---

## 3. Inventory

Legend for “Personal data involved?”:

- **Yes** = the activity, as modelled, stores identifiers or contact data of natural persons.
- **Possibly** = mixed corporate/personal; depends on field contents.
- **No (corporate)** = organisation/commercial facts without a natural-person identifier in the modelled fields (contacts stored separately).
- **Unknown (document bytes)** = file contents not inventoried.

Retention: see [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md). Periods are **TO BE DETERMINED** unless already documented.

Geography: see [`adr-0006-e1-c01-e05-data-subject-geography-map.md`](adr-0006-e1-c01-e05-data-subject-geography-map.md). Processing/storage geography is **NOT SELECTED**.

### 3.1 Commercial / CRM

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-CRM-01 | CRM organisations | Maintain commercial accounts (clients, partners, prospects) | C1 CRM · `crm_organizations` | Typically legal persons; contact emails/phones on the org record may identify individuals | Organisation identifiers; `legal_name`, `country`, `region`, `market`, `primary_email`, `primary_telephone`, `address` JSONB | **Possibly** (org email/phone/address may be personal) | Low in structured fields; address JSONB contents **uncontrolled** | User entry; import batches | SEDMC staff with CRM access; **Production recipients NOT SELECTED** | Create, read, update, archive, merge | TO BE DETERMINED | Org `country` is a **stored field**, not a census | Depends on applicable law (not determined) | FACT: `packages/db/migrations/004_c1_crm.sql`; `packages/kernel/src/crm.ts` |
| P-CRM-02 | CRM contacts | Maintain named commercial contacts | C1 CRM · `crm_contacts` / `CrmContact` | Client, supplier, partner, and other **natural-person** contacts | Name, job title, department, email, telephone, mobile, country, timezone, language, communication preferences, source | **Yes** | Ordinary contact data as modelled. No passport/DoB field. Restricted+ **not** evidenced in this table | User entry; import | SEDMC staff; **Production recipients NOT SELECTED** | Create, read, update, archive, search, duplicate handling, merge | TO BE DETERMINED | Contact `country` is a **stored field**, not a census of data-subject jurisdiction | Depends on applicable law | FACT: `packages/kernel/src/crm.ts` (`CrmContact`); `004_c1_crm.sql` |
| P-CRM-03 | CRM relationships, notes, tasks, activities | Commercial relationship management | C1 extensions | Contacts and staff (as authors) | Relationship notes; activity text; may contain personal data in free text | **Possibly** | Free-text **could** contain sensitive data if entered; not a dedicated health/passport store | User entry | SEDMC staff | Create, read, update | TO BE DETERMINED | Same as CRM | Depends on applicable law | FACT: `006_c1_contacts_relationships.sql`, `007_c1_activities.sql`, `008_c1_accounts_notes_tasks.sql` |
| P-OPP-01 | Opportunities | Pipeline / commercial pursuit | C2 · opportunities | Contacts/orgs linked; assigned principals | Opportunity metadata linked to organisations/contacts | **Possibly** (via linked contacts and assignee) | Commercial confidentiality ≠ statutory sensitive data | User entry | SEDMC commercial staff | Create, read, update | TO BE DETERMINED | Client geography ≠ processing geography | Depends on applicable law | FACT: `packages/db/migrations/015_c2_opportunity.sql` |

### 3.2 RFP

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-RFP-01 | RFP records | Capture client request and commercial workflow | C3 · `rfp_rfps` | Client organisation; assigned principal; contacts via org/opportunity | Title, programme type, `pax_count` (integer), travel dates text, destinations text, budget, requirements text, assignee | **Possibly** (assignee is a principal; requirements_text is free text; **pax_count is not named delegates**) | Free-text requirements **could** mention individuals; not a delegate identity store | User entry; linked opportunity/org | SEDMC commercial staff | Create, version, workflow, archive | TO BE DETERMINED | `destinations` is programme destination **text**, not data-subject geography | Depends on applicable law | FACT: `packages/db/migrations/016_c3_rfp.sql` |
| P-RFP-02 | RFP versions / proposals | Versioned commercial offer | C3/C8 proposal | Same as RFP; authors | Proposal/version metadata and content fields as modelled | **Possibly** | Commercial rates/budgets are **not** automatically statutory sensitive personal data | User / system versioning | SEDMC commercial staff; **client send path not Production-evidenced** | Version, store, send-stage workflow | TO BE DETERMINED | Client location ≠ storage location | Depends on applicable law | FACT: `020_c8_proposal.sql`; RFP `current_version` |

### 3.3 Programme

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-PRG-01 | Programme header | Build itinerary against RFP | C5 · `prg_programmes` | Assigned/created-by principals; **not** named delegates | Title, dates, `pax_count`, destinations text, classification | **Limited** (staff identifiers). **Named delegates: not in this table** | None evidenced in structured fields | User entry | SEDMC programme/commercial staff | Create, update, archive | TO BE DETERMINED | Destinations = **programme destination**, not data-subject jurisdiction | Depends on applicable law | FACT: `017_c5_programme.sql`; `docs/architecture/c5-programme-preview.md` |
| P-PRG-02 | Programme days / items | Day-by-day itinerary; supplier attachment | C5 · `prg_days`, `prg_items` | Staff; supplier contacts via supplier link | Location text, item descriptions, supplier references | **Possibly** (free text; supplier link) | Not a health/passport store | User entry | SEDMC staff | Create, update | TO BE DETERMINED | Day `location` = operational geography | Depends on applicable law | FACT: `017_c5_programme.sql`; `122_cd_programme_item_extensions.sql` |
| P-PRG-03 | Named delegates / travellers / passports / health | Programme delivery identity | **Not implemented as structured EOS processing** | Would be travellers/delegates **if** later implemented | — | **Not currently evidenced** | COMPANY POSITION contemplates this class **if** processed | — | — | — | — | — | Would require Legal/DPO if introduced | **`FUTURE / NOT CURRENTLY EVIDENCED`** |

### 3.4 Commercial (costing, budgets, commissions, approvals, documents)

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-CST-01 | Costing sheets | Price a programme | C6 costing | Staff authors; may reference supplier/commercial contacts | Cost lines, rates, margins, commissions as modelled | **Possibly** (author IDs; free-text notes) | Commercial confidentiality ≠ statutory sensitive personal data | User entry | SEDMC commercial/finance staff | Calculate, store, update | TO BE DETERMINED | Not a geography census | Depends on applicable law; financial-record duties **TO BE DETERMINED** | FACT: `018_c6_costing.sql` |
| P-APR-01 | Commercial approvals | Authorise commercial outcomes | C7 · approval tasks / commercial approval | Approvers and requesters (principals) | Approval state, comments, actor IDs | **Yes** (staff identity in approval trail) | Unlikely statutory sensitive as modelled | Workflow | SEDMC authorised roles | Create, decide, record | TO BE DETERMINED | — | Depends on applicable law | FACT: `019_c7_commercial_approval.sql`; kernel `approval_tasks` |
| P-DOC-01 | Commercial document metadata | Track RFP/contract/rate-sheet files | CD · `commercial_documents` | Uploaders; possibly persons named **inside files** | Filename, mime, size, checksum, `storage_ref`, classification, kind | **Metadata: limited.** **Bytes: Unknown** | **Unknown (document bytes)** — files **could** contain identity/health/contract PII | User upload | SEDMC staff with document access; Dev storage = local FS, **Production NOT SELECTED** | Store metadata; store/retrieve bytes via `DocumentStorage` port | TO BE DETERMINED | Object-storage geography **NOT SELECTED** | Depends on applicable law **and** file contents | FACT: `119_cd_commercial_documents.sql` |
| P-DOC-02 | Document byte contents | Same | `DocumentStorage` (Dev: `LocalFsDocumentStorage`) | Unknown until contents classified | Unstructured | **Unknown (document bytes)** | **Unknown** | Upload | Same | Store, read, delete-status | TO BE DETERMINED | **Architecture-dependent** | Depends on contents and law | FACT: port + Dev local FS. Production object store **CANDIDATE — NOT SELECTED** |

### 3.5 Supplier / hotel

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-SUP-01 | Supplier entities | Source and manage suppliers | C4 / PG supplier · supplier tables | Supplier organisation; supplier **contacts** if stored as contacts | Supplier profile, location, commercial status | **Possibly** (contacts separate or embedded) | Rates/contracts commercially confidential; not automatically statutory sensitive PD | User / import | SEDMC commercial/ops | Create, update, archive, import | TO BE DETERMINED | Supplier country ≠ data-subject jurisdiction automatically | Depends on applicable law | FACT: `014_c4_supplier.sql` (`sup_contacts`); index overlay `044_pg6_supplier_entities.sql`; import migrations |
| P-HTL-01 | Hotel profiles | Hotel master data | CD · hotel profiles | Hotel organisation; contacts if linked | Hotel profile fields as modelled | **Possibly** | Same as supplier | User entry | SEDMC staff | Create, update | TO BE DETERMINED | Hotel location = **destination/vendor geography** | Depends on applicable law | FACT: `121_cd_hotel_profiles.sql` |
| P-CON-01 | Supplier contracts | Commercial contract records | CD · supplier contracts | Signatories **if** named in records/files | Contract metadata; linked documents | **Possibly** / **Unknown (document bytes)** | Contract PD unknown | User / upload | SEDMC commercial/legal staff | Create, link, store | TO BE DETERMINED | — | Contractual retention **TO BE DETERMINED** | FACT: `120_cd_supplier_contracts.sql` |
| P-RATE-01 | Rates | Commercial rates | Supplier/rate features | Staff; not typically data subjects unless names in notes | Rate values | **No (corporate)** unless notes contain names | Commercial confidentiality | User / import | SEDMC staff | Store, compare | TO BE DETERMINED | — | Depends on applicable law | FACT: rate-related migrations (e.g. `053_pg16_rate_preferred_conflict.sql`) |

### 3.6 Identity, employees, audit, system

| ID | Processing activity | Business purpose | EOS component | Data subject(s) | Personal-data category | Personal data involved? | Sensitive-data possibility | Source | Recipient | Processing operation | Retention requirement | Geographic consideration | Legal/framework dependency | Evidence source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P-ID-01 | Principals (users) | Authenticate and authorise EOS users | I1 kernel · `principals` | Employees, contractors, service/AI actors | Email, display name, status, org unit, classification clearance | **Yes** | Ordinary identity; not passport | Admin / seed | Platform/tenant admins; **Production IdP NOT SELECTED** (ADR-0013 OPEN) | Create, update, suspend, deprovision | TO BE DETERMINED | Processing geography **NOT SELECTED** | Employment + privacy law **TO BE DETERMINED** | FACT: `packages/db/schema.sql` `principals` |
| P-ID-02 | Credentials | Authenticate humans in Dev local IdP | `principal_credentials` | Same principals | Password **hash**, algorithm | **Yes** (security-sensitive) | Credentials = Highly Restricted **internal** class (DESIGN INTENT / company LA-12). Statutory class **PENDING HUMAN/DPO/LEGAL DETERMINATION** | User set | Auth subsystem | Store hash, verify | TO BE DETERMINED | Same | Same | FACT: `schema.sql` `principal_credentials`. Production IdP **NOT SELECTED** |
| P-ID-03 | Sessions | Maintain login sessions | `sessions` | Principals | Session identifiers, timing | **Yes** (indirect) | Security logs | Auth subsystem | Auth subsystem | Create, expire | TO BE DETERMINED | Same | Same | FACT: `schema.sql` `sessions` |
| P-HR-01 | HR certification register | Record employee certifications | H1 · `hr_certifications` | Employees (via `employee_id`) | Certification name, issuer, dates, notes | **Yes** (employee-linked). **Not** payroll, leave, or full HRIS | Notes unconstrained | User entry | HR/admin roles as implemented | Create, update, revoke | TO BE DETERMINED | — | Employment law **TO BE DETERMINED** | FACT: `100_h1_hr_certifications.sql` (register only; no payroll) |
| P-AUD-01 | Audit events | Integrity and accountability of consequential actions | Kernel · `audit_events` | Actors (principals); possibly subjects in `previous_state`/`new_state`/`evidence` JSONB | Actor id, action, resource, state JSONB | **Yes** / **Possibly** in JSONB payloads | JSONB **could** copy contact fields from mutations; not a passport store by design | System | Security/compliance roles | Insert-only; immutable | TO BE DETERMINED (audit often longer than operational data) | Same as DB geography **NOT SELECTED** | Legal retention **TO BE DETERMINED** | FACT: `schema.sql` `audit_events` |
| P-LOG-01 | Application / security logs and monitoring | Operate and secure the system | Logging/monitoring (Production **NOT SELECTED**) | Users; possibly IP/device | Log lines, metrics | **Possibly** | Security-sensitive | System | Operators; **Production monitoring NOT SELECTED** | Collect, store, alert | TO BE DETERMINED | **Architecture-dependent** | Depends on applicable law | DESIGN INTENT / FACT that Production stack is **not selected** (`E-26`) |
| P-MAIL-01 | Transactional email / allowlist | Notify users | I3 email templates / SES allowlist (Dev mentions) | Recipients | Email address, notification content | **Yes** | Notification body **could** contain business PII | System / templates | Email provider **NOT SELECTED** for Production | Send, suppress, allowlist | TO BE DETERMINED | **Architecture-dependent** | Depends on applicable law | FACT: `034_i3_email_templates.sql`, allowlist migrations. Production email **NOT SELECTED** |
| P-PRV-01 | Privacy registers (RoPA/DSR/DPIA/consent) | Privacy operations **capability** | P1/P2/P3 | Requestors; case metadata | DSR/DPIA/consent **register** fields | **Yes** (privacy-case metadata) | May describe other processing; **not** itself a completed EOS Production RoPA | Privacy operators | Privacy operators | Register, update | TO BE DETERMINED | — | Privacy law **TO BE DETERMINED** | FACT: `092_p1_privacy_ropa_dsr.sql`, `104_p2_privacy_dpias.sql`, `110_p3_consent_records.sql`; P1/P2 previews. **Not** a completed Production inventory |

### 3.7 Other modules observed (bounded)

| ID | Processing activity | Notes | Personal data involved? | Label |
| --- | --- | --- | --- | --- |
| P-BKG-01 | Booking financial control / bookings | Commercial booking records (`021_c9_booking.sql` and related) | **Possibly** (staff; linked programme/org; guest identity **not** inventoried as a passport store) | Current capability — guest identity fields **not evidenced** as structured passport/health processing |
| P-ITSM-01 | ITSM / CMDB / assets / endpoints | IT operations records | **Possibly** (assignees, asset custodians) | Current capability for IT objects; not commercial delegate PII |
| P-AI-01 | AI drafts / recommendations | Dev/Test AI features; ADR-0008 AI blocked for Production as recorded elsewhere | **Possibly** if prompts include CRM text | DESIGN INTENT / Dev capability; **no Production AI authorization** |

---

## 4. What this inventory does **not** prove

- That Production processing of these classes has begun.
- Recipients, subprocessors, or processing locations.
- Lawful basis, PDPC registration, or DPO appointment.
- That Tanzania, Kenya, GDPR, or UK GDPR apply to any row.
- Completeness of unstructured document contents.
- That P1 RoPA has been populated for Production.

---

## 5. Human review required

| Question | Why |
| --- | --- |
| Completeness vs actual intended Production scope | Ops/privacy must confirm no omitted live process (email mailboxes outside EOS, WhatsApp, spreadsheets) |
| Whether document uploads will include identity/health files | Changes E-16 and possibly DPIA screening |
| Whether named delegate processing will be added before Production | Would move P-PRG-03 out of FUTURE |
| Lawful basis per activity | **PENDING HUMAN/DPO/LEGAL DETERMINATION** — not recorded here |

---

## 6. Status

| Field | Value |
| --- | --- |
| Inventory status | **`DRAFT` · `PARTIALLY EVIDENCED`** |
| Production RoPA | **Not completed** |
| Provider/recipient rows | **MISSING** (architecture-dependent) |
| Human/DPO/Legal review | **Required** for completeness and legal characterisation |
| Closes E-04? | **No** |
