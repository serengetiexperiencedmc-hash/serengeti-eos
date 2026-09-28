# ADR-0006 Application Persistence and Recovery Readiness Assessment

> **`READ-ONLY CODE INSPECTION — NOT IMPLEMENTATION AUTHORIZATION`**  
> **STAGE: 6A**  
> **CRITICAL FINDING: `NOT DEMONSTRATED`**

This assessment establishes **factual evidence** about the current EOS application persistence architecture and what must exist before Production-grade RTO/RPO and **application** recovery of jointly critical Commercial/RFP and Programme Building state can be demonstrated.

It does **not** implement persistence, create or execute migrations, modify schema or infrastructure, select a hosting provider/region/topology, approve ADR-0006 or DP-0006, or authorize Production, UAT, implementation, or cutover.

**Evidence vocabulary used below:**

| Label | Meaning |
| --- | --- |
| **OBSERVED** | Directly read from repository source, schema, or tests in this inspection |
| **INFERRED** | Reasonable consequence of observed code; **this stage did not execute the failure** |
| **GOVERNANCE** | Carried from prior ADR-0006 packs; not re-decided |
| **LABORATORY** | Stage 4B run `20260915-183034` — synthetic PostgreSQL, not EOS modules |
| **UNKNOWN** | Not established in code or tests |

Do not treat **INFERRED** as a executed test. Do not treat **LABORATORY** as application recovery.

---

# 1. Governance baseline (carried forward)

| Item | Position | Class |
| --- | --- | --- |
| Critical functions | Commercial/RFP intake and Programme Building are **jointly critical** | **GOVERNANCE** (Stage 1) |
| Recovery sequence | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers | **GOVERNANCE** |
| MTD | **<= 3 hours** | **GOVERNANCE** |
| Critical RTO | **<= 3 hours** | **GOVERNANCE** |
| Overall RTO | **<= 4 hours** | **GOVERNANCE** |
| Recovery action | Begins **immediately** | **GOVERNANCE** |
| Business data-loss | **Zero tolerated loss of critical business data** | **GOVERNANCE** |
| Technical RPO | **NOT** declared zero. Historical 3-hour RPO **superseded** | **GOVERNANCE** |
| In-memory Store | **Not** acceptable as Production durable SoR | **GOVERNANCE** + **OBSERVED** (ADR-0017; runtime code) |
| Stage 4B | Synthetic PostgreSQL stand-ins. Did **not** recover actual Commercial/Programme Building runtime | **LABORATORY** / **GOVERNANCE** |
| Stage 5 | **DEFER / NOT READY** | **GOVERNANCE** |
| Provider / region / topology | **NOT SELECTED** | **GOVERNANCE** |
| Implementation / migration | **NOT AUTHORIZED** | **GOVERNANCE** |

Related (not modified): ADR-0003 (PG SoR — Development), ADR-0017 (phased persistence — Development), ADR-0010 (outbox), ADR-0011 (Production backup TBD), ADR-0012 (secrets OPEN), ADR-0013 (IdP OPEN), ADR-0015 (ports).

---

# 2. Current persistence architecture (factual)

## 2.1 Runtime source of truth

**OBSERVED:** Dev/Test API reads for jointly critical Commercial/RFP and Programme Building data are served from process-local arrays on a singleton in-memory `Store` (`apps/api/src/store.ts`), not from PostgreSQL.

ADR-0017 (**accepted for Development**): in-memory `Store` remains authoritative for API reads in Dev/Test; PostgreSQL is a **phased dual-write/hydrate** mirror for **named increments only**. Commercial RFP/Programme were **not** given a persistence gate in ADR-0017. Architecture preview `docs/architecture/c3-rfp-preview.md` states C3 persistence is **schema-only**.

`docs/architecture/pg-persistence-preview.md` lists completed PG.1–PG.3+ (notifications, outbox, CRM, suppliers). It does **not** list RFP, programme, costing, approval, proposal, or booking dual-write. Future section still says “Read-through hydration for all modules” and “Production SoR cutover” — **not done**.

## 2.2 Application state stores (relevant modules)

Lifecycle: created empty in `seedStore()`; mutated by service functions; **not** serialized on shutdown. Replica behavior: **one process heap**. A second API process would have a **separate** `Store` (**INFERRED**, not multi-instance tested this stage).

| Module | Path / type | Mechanism | Persistence | Restart | Durability | Transactions | Replica |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **RFP** | `Store.rfpRfps`, `rfpVersions` — `apps/api/src/rfp/rfp.ts` | In-memory arrays | **VOLATILE.** Schema `rfp_rfps` / `rfp_versions` **EXISTS**; **no** runtime insert/hydrate **OBSERVED** | Lost on process exit | None at runtime | Array push; `version` increment is **not** a DB transaction | Diverges per process (**INFERRED**) |
| **Programme Building** | `Store.prgProgrammes`, `prgDays`, `prgItems`, `prgProgrammeVersions` — `apps/api/src/programme/programme.ts` | In-memory arrays | **VOLATILE.** Schema **EXISTS**; **no** persist/hydrate **OBSERVED** | Lost | None at runtime | In-process mutation only | Same |
| **Opportunity / pipeline** (Commercial predecessor) | `Store.oppOpportunities`, `oppStageHistory` — `apps/api/src/pipeline/opportunity.ts` | In-memory | **VOLATILE.** Schema `015_c2_opportunity.sql` **EXISTS**; **no** persist/hydrate **OBSERVED** | Lost | None at runtime | In-process | Same |
| **Costing** | `costSheets`, `costLineItems`, `costSheetVersions` — `apps/api/src/costing/sheet.ts` | In-memory | **VOLATILE.** Schema `018_c6_costing.sql` **EXISTS**; **no** persist **OBSERVED** | Lost | None | In-process | Same |
| **Commercial approval** | `comApprovalRequests` | In-memory | Schema `019_c7_commercial_approval.sql` **EXISTS**; runtime **VOLATILE** | Lost | None | In-process | Same |
| **Proposal** | `propProposals`, `propProposalVersions` | In-memory | Schema `020_c8_proposal.sql` **EXISTS**; runtime **VOLATILE** | Lost | None | In-process | Same |
| **Booking** | `bkgBookings`, `bkgHandoverTasks` | In-memory | Schema `021_c9_booking.sql` **EXISTS**; runtime **VOLATILE** | Lost | None | In-process | Same |
| **Commercial documents (metadata)** | `commercialDocuments` — `apps/api/src/commercial-documents/service.ts` | In-memory metadata | Table `commercial_documents` **EXISTS** (`119_cd_commercial_documents.sql`); **no** persist/hydrate **OBSERVED** | Metadata lost | None at runtime | In-process | Same |
| **Commercial documents (bytes)** | `LocalFsDocumentStorage` — `apps/api/src/commercial-documents/storage.ts` | Local filesystem under `EOS_DOCUMENT_ROOT` or `os.tmpdir()/serengeti-eos-documents` | **Process-host files.** Comment: does **not** bind ADR-0006 / Production object storage | Survives process restart **only if** the same host path remains (**INFERRED**). Tempdir is **not** a durable Production store | Host disk, not PG | `wx` create | Not shared across hosts (**INFERRED**) |
| **Hotel profiles** | `supHotelProfiles` — `supplier/contracts.ts` | In-memory | Table `121_cd_hotel_profiles.sql` **EXISTS**; **no** persist in `persistence/supplier.ts` **OBSERVED** | Lost | None | In-process | Same |
| **Supplier contracts** | `supContracts`, `supContractVersions` | In-memory | Table `120_cd_supplier_contracts.sql` **EXISTS**; supplier persist module does **not** list contracts/hotels **OBSERVED** | Lost | None | In-process | Same |
| **CRM** | CRM arrays — `apps/api/src/crm/*`, `persistence/crm.ts` | In-memory **read SoR**; dual-write + startup hydrate when `EOS_DATABASE_URL` | **PARTIAL DURABLE MIRROR** (PG.3+). Reads still from Store (ADR-0017) | Hydrate on startup **if** pool set (`main.ts`) | PG when dual-write succeeds; fire-and-forget catch swallows persist errors **OBSERVED** | Persist **after** in-memory commit (`void persistCrmEntityAfterCommit`) — **not** a single app+DB transaction | Hydrate can converge replicas **only if** all writes reached PG (**INFERRED**) |
| **Suppliers (entities/rates/imports)** | `persistence/supplier.ts` | Dual-write + hydrate (PG.5/PG.6/PG.8) | **PARTIAL DURABLE MIRROR** | Hydrate on startup if pool | Same fire-and-forget pattern | After-commit persist | Same |
| **I3 notifications / I4 outbox** | `persistence/notifications.ts`, `outbox.ts`, `processed-events.ts` | Dual-write + hydrate | **PARTIAL DURABLE MIRROR** (PG.1, PG.2) | Hydrate + drain on startup | Outbox insert on emit when pool set | Outbox has persist path | Event transport default `in-memory-dev` **VOLATILE** |
| **IAM / tenants / sessions / seeded audit** | `persistence/sync.ts` `syncStoreToPostgres` | Bootstrap upsert on startup | Seed principals/tenants/sessions/audit **snapshot at boot**, not a full audit dual-write path | Re-seeded from `seedStore` then upserted | PG for bootstrap rows | `insertAuditEvent` used in bootstrap **and** tests; **runtime** `recordAudit` only `store.audit.push` **OBSERVED** | Sessions: `persistSessionRevocation` if pool |
| **Identity** | `createLocalPasswordIdentityProvider` — `apps/api/src/ports/identity.ts` | In-memory principal + password hash | Dev IdP. ADR-0013 **OPEN** | Re-seeded from `seedStore` | Password hashes upserted in bootstrap sync | N/A | Local only |
| **Secrets** | `createEnvSecretsProvider` — `ports/secrets.ts` | Process env | ADR-0012 **OPEN** | Env must be re-supplied | Host env | N/A | Per process |
| **Event bus** | `publishedBus`, `createInMemoryDevTransport` | In-memory | ADR-0004 Dev stand-in | Lost | None | N/A | Not shared |
| **Operations (manifests, rooming)** | `opsManifests` / entries — `ops/manifests.ts` | In-memory; `rooming` is a **string field** on manifest entries | Schema for ops **EXISTS** (e.g. `023_o2_ops_manifest.sql`); **no** programme-level rooming entity; **no** persist **OBSERVED** for ops in this inspection’s persist modules | Lost | None | In-process | Same |
| **Finance references** | `finInvoices`, `finPaymentLinks`, etc. | In-memory | Schemas exist for some finance increments; **no** RFP persist | Lost | None | In-process | Same |
| **Configuration** | `configVersions`; env | Mixed | Bootstrap sync of config versions | Seed + env | Partial | Bootstrap | Env per process |
| **Background jobs** | Notification digest last-run rows, etc. | Some dual-written (I3/I4); others memory | Partial | Partial hydrate | Partial | Fire-and-forget | Partial |

**PostgreSQL pool:** optional `store.dbPool` set in `apps/api/src/main.ts` only when `EOS_DATABASE_URL` is present. `packages/db` `createPool` uses `pg.Pool` `max: 10`. **No** reconnect/retry wrapper **OBSERVED** in API source.

## 2.3 What `main.ts` hydrates (and does not)

**OBSERVED** hydrate list when `EOS_DATABASE_URL` is set:

CRM; email templates/suppressions/allowlist; DLQ and allowlist digest metadata; AI drafts/recommend stale-audit rows; pending outbox; processed events; NATS consumer offsets; supplier imports/entities/idempotency/heatmap rollups.

**OBSERVED absent from hydrate:** `rfpRfps`, `rfpVersions`, `prgProgrammes`, `prgDays`, `prgItems`, `prgProgrammeVersions`, `oppOpportunities`, `costSheets`, `comApprovalRequests`, `propProposals`, `bkgBookings`, `commercialDocuments`, `supContracts`, `supHotelProfiles`.

Demo seed (`EOS_SEED_DEMO=true`) **skips** if CRM organisations or opportunities already exist in the Store (`seed-demo-data.ts`). After CRM hydrate, skip is **likely**, so demo RFPs are **not** reconstructed from PostgreSQL — they were never written there (**INFERRED** from observed skip predicate + missing RFP persist).

---

# 3. Commercial / RFP data lifecycle

**OBSERVED** path (`apps/api/src/rfp/routes.ts` → `rfp/rfp.ts`):

HTTP `/v1/rfps` → `principalFromAuthHeader` → authorize (`rfp:write:rfp` / `rfp:read:rfp` / `rfp:transition:stage` / `rfp:write:version`) → validate opportunity exists in `store.oppOpportunities` → uniqueness of `rfpCode` in memory → `store.rfpRfps.push` + `store.rfpVersions.push` → optional in-memory opportunity stage `new_qualified` → `rfp_received` → `allowRfpAudit` → `store.audit.push`.

**No** `dbPool` call. **No** outbox emit **OBSERVED** in `rfp/` (`RFP_EVENT_TYPES` exists in `packages/kernel/src/rfp-events.ts` but is **not** referenced from `apps/api/src` in this inspection).

## 3.1 Entities and relationships (runtime)

| Entity | ID | Relationships | Notes |
| --- | --- | --- | --- |
| `RfpRecord` | UUID `newId()` | `opportunityId` → in-memory opportunity; `organizationId` copied from opportunity; `assignedPrincipalId`; tenant | Workflow: intake → programme → costing → approval → proposal → sent → closed |
| `RfpVersion` | UUID | `rfpId` | Snapshot summary, not a full document clone |
| Opportunity | UUID | CRM organization / optional account | **Required** to create RFP; also **VOLATILE** |
| CRM organization | UUID | Classification copied onto RFP | CRM **may** hydrate from PG; RFP does **not** |

Fields **OBSERVED** on `RfpRecord` (`packages/kernel/src/rfp.ts`): `rfpCode`, `title`, `workflowStage`, `status`, `programmeType`, `paxCount`, `travelDates`, `destinations`, `budgetMin`/`budgetMax`, `currency`, `requirementsText`, `notes`, `source`, `receivedAt`, `slaDueAt`/`slaStatus`, `currentVersion`, `classification`, `version`, `archivedAt`, `createdAt`/`updatedAt`, `createdByPrincipalId`/`updatedByPrincipalId`.

**Audit:** `rfp/audit.ts` → in-memory chained `store.audit`. Runtime `recordAudit` does **not** call `insertAuditEvent`. Bootstrap `syncStoreToPostgres` copies **seed-time** audit only.

**Attachments:** optional `commercialDocuments` with `rfpId`; bytes in local FS; metadata in memory.

**Financial references:** budget fields on RFP; costing sheets reference `rfpId` in memory.

**Supplier references:** not on the RFP header; appear on programme items / cost lines.

**Programme references:** programme created from `rfpId`; RFP stage may advance to `programme` in memory.

**Optimistic locking:** `version` is incremented on mutation; **no** If-Match / expected-version check **OBSERVED** in `rfp.ts` or `programme.ts`.

## 3.2 What survives process restart

| Artifact | Survives restart? | Evidence |
| --- | --- | --- |
| User-created RFP / versions | **No** | Arrays empty after `seedStore`; no hydrate |
| Linked opportunity (if only in memory) | **No** | No opp persist |
| Linked CRM org (if dual-written and `EOS_DATABASE_URL`) | **Possibly** (hydrate) | `hydrateCrmFromPostgres` |
| RFP audit rows created after boot | **No** (runtime audit not dual-written) | `recordAudit` |
| Local document bytes | **Maybe** if same `EOS_DOCUMENT_ROOT` | FS; metadata still lost → orphan files **INFERRED** |
| PostgreSQL `rfp_rfps` rows | **N/A at runtime** — table unused by API | No INSERT from API **OBSERVED** |

---

# 4. Programme Building data lifecycle

**OBSERVED** (`apps/api/src/programme/programme.ts`):

HTTP `/v1/programmes` → authorize → require in-memory RFP → uniqueness `programme_exists_for_rfp` / `programmeCode` (`RFP-` → `PRG-`) → `store.prgProgrammes.push` → optional days/items → may set RFP `workflowStage` to `programme` → audit.

## 4.1 Entities

| Entity | Durability class | Content |
| --- | --- | --- |
| Programme (`PrgProgramme`) | **VOLATILE** | code, `rfpId`, `opportunityId`, `organizationId`, title, status draft/active/archived, dayCount, start/end dates, pax, destinations, `internalNotes`, `clientNotes`, classification, version, audit timestamps |
| Day (`PrgDay`) | **VOLATILE** | dayNumber, title, location, calendarDate, sortOrder |
| Item (`PrgItem`) | **VOLATILE** | startTime, title, description, `supplierId` / `supplierRateId` / `supplierLabel`, `itemType` (accommodation, activity, experience, transport, flight, meal, meeting_event, other), quantity, unit, notes, visibility |
| Programme version (`PrgProgrammeVersion`) | **VOLATILE** | `snapshot` JSON `{ title, dayCount, itemCount, destinations? }` — **not** a full itinerary dump |
| Hotels | **VOLATILE** / **DERIVED** | No separate hotel-stay entity. Accommodation is an **itemType** plus optional `supHotelProfiles` (also in-memory) |
| Transport / activities | **VOLATILE** | Item types on `PrgItem` |
| Costing | **VOLATILE** / **DERIVED** totals | Separate cost sheet; totals recalculated in memory |
| Suppliers | **PARTIAL** if PG dual-write succeeded | Item holds IDs; supplier row may hydrate |
| Client information | **VOLATILE** / **EXTERNAL** | Via `organizationId` / RFP / CRM contact — not a programme-guest list **OBSERVED** |
| Dates | **VOLATILE** | Programme start/end; day `calendarDate` |
| Participants | **VOLATILE** / **UNKNOWN as a first-class entity** | `paxCount` only on programme/RFP; **no** participant register **OBSERVED** on programme |
| Rooming | **VOLATILE** (ops) / **NOT on programme** | `rooming` string on **ops manifest entries**, not programme items |
| Documents | **VOLATILE** metadata + local FS bytes | Linked via RFP/supplier/contract, not programme id on `CommercialDocument` type **OBSERVED** (`rfpId`, `supplierId`, `contractId`) |
| Approvals | **VOLATILE** | Commercial approval module; RFP stage `approval` |
| Status / versioning | **VOLATILE** | `status`, `version`, programme version snapshots |
| Audit history | **VOLATILE** (runtime) | `programme/audit.ts` → `store.audit` |

Classification of programme information:

| Information | Class |
| --- | --- |
| Itinerary structure (days/items) | **VOLATILE** |
| Cost totals | **DERIVED** (from in-memory lines) then stored on sheet — still **VOLATILE** |
| Supplier labels copied onto items | **VOLATILE** copy; supplier master **PARTIAL** if PG |
| CRM organisation legal name | **PARTIAL** if CRM hydrate |
| Classification label | **VOLATILE** copy from RFP |
| PostgreSQL `prg_*` tables | **EXISTS TODAY** as schema; **REQUIRED BUT MISSING** as runtime SoR |

---

# 5. PostgreSQL current state

## 5.1 Version and access

| Item | Finding | Class |
| --- | --- | --- |
| Engine assumption | PostgreSQL **16** (ADR-0003; `infra/compose/dev.yaml` `postgres:16-alpine`; lab used same image) | **OBSERVED** |
| Production PG | **Not authorized**; compose is **Dev** with `eos-dev-only` credentials | **OBSERVED** / **GOVERNANCE** |
| Client | `pg` Pool in `packages/db/src/index.ts` — **not** an ORM | **OBSERVED** |
| Migrations | `schema.sql` + `packages/db/migrations/*.sql` applied by `migrate()` in a per-file transaction | **OBSERVED** |
| Highest numbered migration **OBSERVED** | `122_cd_programme_item_extensions.sql` | **OBSERVED** |
| Migration `123` | **Not present** (matches prior fact-pack “SQL 123 ABSENT”) | **OBSERVED** |
| Production migrations | **NOT AUTHORIZED** | **GOVERNANCE** |

## 5.2 Schema that EXISTS TODAY vs runtime

**EXISTS TODAY (schema, Development/Test):**

- Kernel: `schema.sql` — tenants, organisations, principals, credentials, roles, sessions, `audit_events`, etc.
- C2 `opp_opportunities`, `opp_stage_history` (`015`)
- C3 `rfp_rfps`, `rfp_versions` (`016`); CD columns `notes`, `source`, `received_at` (`122`)
- C5 `prg_programmes`, `prg_days`, `prg_items` (`017`); notes/item_type/quantity/visibility (`122`); `prg_programme_versions` JSONB snapshot (`122`)
- C6 costing (`018`), C7 approval (`019`), C8 proposal (`020`), C9 booking (`021`)
- CRM persist tables (PG.3+)
- Supplier persist tables (PG.5+)
- `commercial_documents` metadata (`119`) — **bytes not in PG** (comment in SQL)
- `sup_hotel_profiles` (`121`), `sup_contracts` (`120`)
- Notifications, outbox, NATS offsets, AI assist tables, GRC/ops/HR/IT as later numbered migrations

**REQUIRED BUT MISSING (runtime for jointly critical recovery):**

- Repository/hydrate/persist for RFP, programme, opportunity, costing, approval, proposal, booking, commercial document metadata, hotel profiles, contracts
- FK from `rfp_rfps.opportunity_id` to `opp_opportunities` — **not declared** in `016` (**OBSERVED**: plain UUID)
- FK from `prg_programmes.rfp_id` to `rfp_rfps` — **not declared** in `017`
- Application-level transaction covering RFP + opportunity stage + audit + outbox
- Production backup product (ADR-0011 TBD)
- Read-through SoR cutover

**Indexes/constraints that EXIST on unused RFP/programme tables:** unique `(tenant_id, rfp_code)` / `(tenant_id, programme_code)`; CHECKs on workflow/status; indexes on stage and `rfp_id`. These do **not** protect the in-memory Store.

**JSONB:** `prg_programme_versions.snapshot` **EXISTS**; runtime writes the snapshot **only** to memory (`prgProgrammeVersions.push`).

**`withTransaction`:** exists in `pg-repository.ts`; used by some PG paths/tests. RFP/programme services **do not** use it.

---

# 6. Restart and failure analysis (current architecture)

This stage **did not inject** these failures. Outcomes are **OBSERVED** from code or **INFERRED**. Stage 4B **LABORATORY** results apply to **synthetic** `lab_*` tables only.

| ID | Scenario | Expected data outcome | Survives? | Reconstructable? | Loss possible? | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | Application process restart | New `seedStore`; RFP/programme arrays empty; CRM/supplier **may** hydrate | Critical Commercial/Programme **no** | Demo seed **may** recreate **demo** data only if skip predicate false; **not** user RFPs | **Yes** | `store.ts` seed; `main.ts` hydrate list; `seed-demo-data.ts` skip | **HIGH** (code). Restart **NOT TESTED** this stage |
| F2 | Application container restart | Same as F1 unless volumes preserve FS docs / PG | Same | Same | **Yes** | Compose volumes `eos_pg` for **PG data**, not Store | **HIGH** code / **INFERRED** container |
| F3 | Application crash | Same as F1; uncommitted in-memory writes discarded | No for RFP/PRG | No | **Yes** | No durable write path | **HIGH** code. Crash **NOT TESTED** this stage (LAB-07 was API+PG kill on **lab** CRM org, **PARTIAL**) |
| F4 | Multiple application replicas | Independent Stores; conflicting RFP codes possible; CRM dual-write last-writer **UNKNOWN** | Inconsistent | Weak | **Yes** | Singleton Store in process | **MEDIUM** **INFERRED**. **NOT TESTED** |
| F5 | PostgreSQL unavailable | `/ready` **503** if `dbHealth` wired (`server.ts`); `/health` still static; RFP routes **do not** require pool | In-memory RFP still served until process dies | N/A | Dual-write modules lose PG mirror | `server.ts` ready vs rfp.ts no pool | **MEDIUM** **INFERRED**. **NOT TESTED** this stage |
| F6 | PostgreSQL restart | In-memory RFP unaffected; hydrate on **next app** start still has no RFP rows | RFP still only in dying/living process | No | CRM persist errors swallowed | Fire-and-forget catch | **MEDIUM** **INFERRED** |
| F7 | Application/database failover | **No** app HA product; no RFP in PG to fail over | RFP not on standby DB | Restore PG ≠ restore RFP | **Yes** | No persist; Stage 4B T5 app standby **PARTIAL** (DB only) | **HIGH** gap / lab **PARTIAL** |
| F8 | Host failure | Heap gone; local FS docs gone unless networked volume | No | No | **Yes** | Local Store + `LocalFsDocumentStorage` | **HIGH** **INFERRED**. **NOT TESTED** |
| F9 | Database corruption / PG recovery | Restored PG has schema + CRM/supplier/outbox **if** previously written; **empty** `rfp_rfps` at runtime usage | RFP **not** recovered from PG restore | Application cannot list user RFPs | **Yes** vs business zero-loss | Unused tables; Stage 4B T1/T2 recovered **lab** tables only | **HIGH** code + **LABORATORY** not equivalent |
| F10 | Regional failure | No Production region selected | N/A | N/A | **UNKNOWN** in Production | Governance: region **NOT APPROVED** | **UNKNOWN** as Production; architecture still loses in-memory first |

---

# 7. Application-level recovery gap

Question: can the **current** system demonstrate the following as **application** recovery of jointly critical functions?

| # | Capability | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Restore PostgreSQL | **PARTIAL** | **LABORATORY** T1/T2 on synthetic tables. Dev compose volume **EXISTS**. **NOT TESTED** this stage. Unused `rfp_*`/`prg_*` would restore as empty of runtime writes |
| 2 | Start EOS application | **NOT TESTED** this stage (normal `main.ts` listen is **OBSERVED** in code). Not a recovery proof |
| 3 | Reconnect application to recovered PostgreSQL | **PARTIAL** / **UNKNOWN** | Pool created if URL set; **no** reconnect policy **OBSERVED**. `/ready` checks `SELECT 1` |
| 4 | Restore critical Commercial state | **FAIL** | No RFP persist/hydrate **OBSERVED** |
| 5 | Restore critical Programme Building state | **FAIL** | No programme persist/hydrate **OBSERVED** |
| 6 | Re-establish dependencies | **PARTIAL** | CRM/supplier **may** hydrate; IdP/CDN/WAF/email/KMS Production **not** present (ADR-0012/0013; Stage 4B RM-09) |
| 7 | Verify referential integrity (app) | **FAIL** | Runtime integrity is in-memory scans, not DB FK for RFP↔opportunity. Schema FKs for those links **MISSING** |
| 8 | Verify business workflow integrity | **FAIL** | Workflow exists in kernel; not recoverable after restart |
| 9 | Accept a new RFP after recovery | **PARTIAL** | Code can create RFP in a **fresh** Store (**OBSERVED**); that is **not** recovery of prior state. **NOT TESTED** as a recovery probe this stage |
| 10 | Build/update a programme | **PARTIAL** | Same — works on empty Store if a new RFP is created; prior programmes gone |
| 11 | Retrieve existing programmes | **FAIL** | List is in-memory only |
| 12 | Preserve audit/history | **FAIL** (runtime RFP/PRG audit) | `recordAudit` memory-only; PG audit = bootstrap + whatever else dual-writes (not RFP) |
| 13 | Preserve critical documents/references | **FAIL** / **PARTIAL** | Metadata **VOLATILE**; bytes **maybe** on local disk; no Production object store |

**Overall:** application-level recovery of Commercial/RFP and Programme Building is **NOT DEMONSTRATED**.

---

# 8. Data classification (application inventory — not legal conclusions)

Legal placement remains E1 **OPEN**. This table is an **application** map.

| Data class | Module | Current storage | Required Production storage (capability, not vendor) | Backup | Recovery | Legal review |
| --- | --- | --- | --- | --- | --- | --- |
| Ordinary business (RFP title, programme itinerary, costing) | RFP, Programme, Costing | In-memory | Durable SoR (PostgreSQL class per ADR-0003 unless later approved equivalent) | Required with restore proof | Must meet business RTO/RPO qualification | E1 ordinary business row **NOT APPROVED** |
| Personal data (names, email, phone) | CRM contacts; possibly document filenames | CRM: memory + optional PG mirror; docs: FS | Durable SoR + access control | Required | Required | E1 customer/employee **NOT APPROVED** |
| Identity / passport | Event schema **forbids** payload keys `passport` / `nationalId` in places; **no** passport field on `CrmContact` **OBSERVED** | **UNKNOWN** if stored in document bytes | If processed later: Highly Restricted default | If present, stricter | If present, stricter | LE-18; do not invent processing |
| Travel data | RFP `travelDates`/`destinations`; programme days/items | In-memory | Durable SoR | Required | Required | E1 travel row **NOT APPROVED** |
| Financial / payment references | RFP budget; cost sheets; `finPaymentLinks`; design: no raw CHD | In-memory | Durable SoR; CHD remains out of EOS by **design position** | Required for metadata; **not** CHD | Required | PCI **NOT ESTABLISHED** |
| Supplier data | PG.5+ dual-write **PARTIAL**; contracts/hotels memory | Mixed | Durable SoR for all supplier master used by programmes | Required | Required | Subprocessors E1.12 |
| Employee data | `hrEmployees` in-memory; IAM principals bootstrap PG | Mixed | Durable SoR | Required | Required | E1 employee **NOT APPROVED** |
| Documents | FS bytes + memory metadata | Not Production object storage | Encrypted object + metadata in SoR | Independent copies | Restore bytes **and** metadata together | Document classification Confidential default in SQL |
| Audit / security | Memory chain; PG `audit_events` at bootstrap | Incomplete | Durable append-only audit | Required | Required for accountability | Log location E1.9 |

---

# 9. Persistence gap matrix

| Component | Current state | Production requirement | Gap | Evidence | Severity | Required future action | Authorization needed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Commercial / Opportunity | In-memory; schema only | Durable SoR | No persist/hydrate | `opportunity.ts`; `015` SQL | **Critical** | WP-05 predecessor | Persistence design + implementation + migration auths |
| **RFP** | In-memory; schema only | Durable SoR; transactional with workflow | No persist/hydrate; events unused | `rfp.ts`; `016`; ADR-0017; C3 preview | **Critical** | WP-06 | Same |
| **Programme Building** | In-memory; schema only | Durable SoR; items+days integrity | No persist/hydrate | `programme.ts`; `017`/`122` | **Critical** | WP-07 | Same |
| CRM dependencies | Dual-write + hydrate; **read SoR still memory** | Production read/write SoR; transactional persist | Fire-and-forget; not Production-closed | ADR-0017; `persistence/crm.ts`; `crm.integration.test.ts` | **High** | Complete CRM SoR cutover | Separate CRM persistence gate |
| Documents | Local FS + memory metadata | Durable object + DB metadata | No PG metadata; tempdir default | `storage.ts`; `119` | **High** | WP-09 | Object-storage + migration auths; Legal location |
| Audit trail | Memory `recordAudit` | Durable chained audit | Runtime not dual-written | `store.ts` `recordAudit`; `sync.ts` bootstrap only | **High** | WP-08 | Persistence auth |
| Authentication / identity | Dev local password IdP | Production IdP (ADR-0013) | OPEN | `ports/identity.ts` | **High** | Identity architecture | ADR-0013; not this stage |
| Financial references | In-memory sheets/invoices | Durable SoR; no CHD | No persist | `costing/sheet.ts` | **High** | Costing/finance persist | Persistence + PCI scope |
| Supplier references | Entities **PARTIAL** PG; contracts/hotels memory | All referenced suppliers durable | Contracts/hotels/gap vs items | `persistence/supplier.ts` vs `contracts.ts` | **High** | Extend supplier persist | Persistence auth |
| Notifications / email | Dual-write **PARTIAL** | Production email + outbox | Dev SES artefacts; not Production | PG.1; ADR-0010 | **Medium** | Keep gated; Production publisher pending ADR-0006 | Not this stage |
| Configuration | Env + bootstrap PG | Managed config + secrets | ADR-0012 OPEN | `ports/secrets.ts` | **High** | Secrets platform | ADR-0012 |
| Background jobs | Partial PG for digest metadata | Durable job state | Mixed | `notifications.ts` | **Medium** | Job SoR | Persistence auth |
| Event state | In-memory bus default | Durable transport | ADR-0004 stand-in | `event-transport.ts` | **High** | Production NATS pending hosting | ADR-0006 later |

---

# 10. Required future architecture (capabilities — no vendor)

Do **not** treat this as a selected Production topology.

| Capability | Rating |
| --- | --- |
| Durable PostgreSQL (or later **approved** equivalent) as SoR for jointly critical modules | **REQUIRED** |
| Transactional writes (RFP + related opportunity/programme/audit) | **REQUIRED** |
| Constraints and referential integrity (including FKs currently missing on RFP/PRG headers) | **REQUIRED** |
| Explicit transaction boundaries (no silent fire-and-forget as the only persist) | **REQUIRED** |
| Idempotency for create/transition APIs | **REQUIRED** |
| Concurrency control (version already stored; **enforcement** missing) | **REQUIRED** |
| Optimistic and/or pessimistic locking where appropriate | **RECOMMENDED** (optimistic matches existing `version` field) |
| Audit history durable | **REQUIRED** |
| Versioning of RFP/programme | **REQUIRED** (exists in memory; must persist) |
| Backup | **REQUIRED** (capability; product **TBD**) |
| PITR / WAL | **REQUIRED** to evaluate vs business zero-loss (Stage 4B lab implication) | 
| HA | **REQUIRED** to **evaluate** (Stage 4C envelope); **not** selected |
| Application connection management | **REQUIRED** |
| Connection failure recovery / retry | **REQUIRED** (absent today) |
| Secrets management | **REQUIRED** (ADR-0012) |
| Observability (detect loss, lag, persist failures) | **REQUIRED** (persist errors currently swallowed) |
| Application startup/recovery (hydrate **or** read-through SoR) | **REQUIRED** |
| Document bytes in durable storage with metadata in SoR | **REQUIRED** |
| Production IdP | **REQUIRED** for Production (ADR-0013); **not** a substitute for data persist |

---

# 11. Migration readiness (assessment only — no work performed)

| Area | Status | Notes |
| --- | --- | --- |
| Schema readiness | **PARTIAL** | Additive SQL **EXISTS** for RFP/PRG; FKs incomplete; CD columns added in `122` |
| Migration runner | **EXISTS** (`migrate()`); Production apply **NOT AUTHORIZED** | Per-file transactions |
| Repository / service abstraction | **PARTIAL** | CRM/supplier persist modules are a **pattern**; RFP/PRG have **no** equivalent |
| Test coverage | **PARTIAL** | `c3.rfp.test.ts`, `c5.programme.test.ts` are in-memory. PG integration tests **do not** cover RFP persist |
| Seed / data strategy | **PARTIAL** | Demo seed reconstructs **demo** graph via HTTP; skip if CRM present; **not** a recovery tool |
| Data conversion | **NOT READY** | No in-memory → PG exporter for RFP/PRG **OBSERVED** |
| Backward compatibility | **UNKNOWN** until persist design | Dual-write then read-cutover is ADR-0017 pattern |
| Rollback strategy | **NOT READY** | Not designed for RFP SoR cutover |
| Migration sequencing | **NOT READY** | Opportunity persist likely before RFP; RFP before programme (FK intent) |
| Cutover strategy | **NOT READY** | ADR-0017: explicit module gates; not big-bang. **Not authorized** |
| Reconciliation | **NOT READY** | No Store vs `rfp_rfps` checker |
| Validation | **NOT READY** | No post-restore business probes for RFP/PRG |
| Recovery testing | **NOT YET TESTABLE** at application level | See §14 |

---

# 12. Application RTO/RPO test design gap

| Prerequisite | Status |
| --- | --- |
| Actual durable application state for RFP/PRG | **NOT YET TESTABLE** |
| Deterministic test dataset in SoR | **NOT YET TESTABLE** (demo seed ≠ durable SoR) |
| Transaction markers in **application** tables | **NOT YET TESTABLE** (Stage 4B used `lab_markers`) |
| Application recovery procedure | **NOT YET TESTABLE** |
| Dependency inventory | **PARTIAL** (this document); Production deps unproven |
| Database recovery | **CURRENTLY TESTABLE** only as **LABORATORY** PG / Dev volume — **not** application SoR |
| Application startup | **CURRENTLY TESTABLE** as process start; **not** as recovered SoR |
| Integrity validation of programmes | **NOT YET TESTABLE** post-restore |
| Business workflow probes (accept RFP, build programme, retrieve) | **CURRENTLY TESTABLE** only on a **live empty/fresh** Store — **not** recovery |
| Measured RTO timestamps for **application** recovery | **NOT YET TESTABLE** |
| Failure injection against durable RFP/PRG | **NOT YET TESTABLE** |
| Failover / failback of app+DB with RFP/PRG | **NOT YET TESTABLE** |

Stage 4B remains valid **laboratory mechanism** evidence. It is **not** application RTO/RPO evidence (RM-01 **OPEN**).

---

# 13. Critical finding

**Can the current EOS implementation demonstrate Production-grade recovery of Commercial/RFP and Programme Building state?**

# **NOT DEMONSTRATED.**

Reasons (evidence-based):

1. Runtime SoR for those modules is the in-memory `Store` (**OBSERVED**).  
2. PostgreSQL tables for RFP/programme **exist** but are **not written or hydrated** by the API (**OBSERVED**).  
3. Stage 4B **PASS** results recovered **synthetic** PostgreSQL markers, not `RfpRecord` / `PrgProgramme` (**LABORATORY** / RM-01).  
4. Laboratory PostgreSQL success is **not** an application recovery **PASS**.  
5. Stage 5 already recorded **DEFER / NOT READY**; this inspection **confirms** the persistence blocker in source.

---

# 14. Future implementation work packages (documentation only)

**None of the following is authorized or implemented by this stage.**

| ID | Objective | Dependency | Evidence needed | Authorization required | Status |
| --- | --- | --- | --- | --- | --- |
| **WP-01** Persistence model | Define SoR per module, dual-write vs read-through, cutover gates | ADR-0003/0017; Stage 6A | Written model; Owner/IT | Persistence **design** package | **NOT STARTED** |
| **WP-02** PostgreSQL schema | Close FK/integrity gaps; align CD columns with runtime | WP-01 | Schema review; still Dev until migration auth | Schema change + **migration authorization** | Schema **PARTIAL**; runtime gap |
| **WP-03** Repositories / data access | RFP/PRG/opp repositories following `persistence/crm.ts` pattern without fire-and-forget as sole integrity | WP-02 | Tests against PG | Implementation authorization | **NOT STARTED** |
| **WP-04** Transactional service layer | Single transaction for create/transition + audit + outbox | WP-03 | Isolation tests | Implementation authorization | **NOT STARTED** |
| **WP-05** Commercial (opportunity) persistence | Durable pipeline predecessor to RFP | WP-03/04 | Hydrate + API tests | Implementation + migration | **NOT STARTED** |
| **WP-06** RFP persistence | Durable RFP + versions + workflow | WP-05 | Restart test retrieves same RFP | Same | **NOT STARTED** |
| **WP-07** Programme Building persistence | Durable programmes/days/items/versions | WP-06 | Restart test retrieves itinerary | Same | **NOT STARTED** |
| **WP-08** Audit / versioning | Dual-write or SoR `recordAudit`; persist programme versions | WP-04 | Audit chain after restart | Implementation | **NOT STARTED** (runtime) |
| **WP-09** Document references | Persist metadata; durable bytes; restore pairing | WP-03; Legal object location | Round-trip get after restore | Implementation + E1 for storage location | **NOT STARTED** |
| **WP-10** Application recovery | Startup hydrate **or** read-through; runbook | WP-06/07 | Documented procedure | Implementation | **NOT STARTED** |
| **WP-11** HA / reconnection | Pool retry; multi-instance Store elimination | WP-10; hosting class | Reconnect tests | Not a provider selection | **NOT STARTED** |
| **WP-12** Backup/PITR integration | Application markers on real SoR | WP-06/07; ADR-0011 product TBD | Restore probe of RFP/PRG | Backup product still TBD; **not** topology approval | **NOT STARTED** |
| **WP-13** Application-level recovery testing | Timed F1–F10 against durable modules | WP-10–12 | Lab/Dev **application** results — still not Production proof | Separate test authorization | **NOT YET TESTABLE** |
| **WP-14** Migration / cutover | Dual-write → read cutover → retire Store SoR | WP-06/07 | Reconciliation report | **Separate** cutover + migration auths | **NOT AUTHORIZED** |
| **WP-15** Observability | Persist-failure metrics; lag; startup hydrate counts for RFP/PRG | WP-03 | Dashboards/alerts design | Implementation | Persist failures currently swallowed |
| **WP-16** Security / secrets | Stop env-only secrets; IdP for Production | ADR-0012/0013 | Attested products `CANDIDATE — NOT SELECTED` | Identity/secrets ADRs | **OPEN** |

---

# 15. Governance impact (statuses **unchanged**)

| Gate / record | Status (unchanged) | How 6A findings affect it |
| --- | --- | --- |
| **E1 Legal** | `OPEN — REQUIRES LEGAL/DPO VALIDATION` | Persistence cutover will **increase** the need for placement rules (PG, backups, document bytes). 6A does **not** close E1. |
| **E2 RTO/RPO** | `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED` | Confirms RM-01: lab PG ≠ application recovery. E2 **cannot** close for jointly critical functions until WP-06/07/13 exist. Status **not** changed. |
| **E3 Hosting** | `OPEN — HOSTING EVIDENCE IN PROGRESS` | Hosting class still must support durable PG + app recovery. 6A does **not** select a host. |
| **E4 TCO** | `OPEN — TCO EVIDENCE INCOMPLETE` | Persistence/cutover/professional services remain **UNKNOWN — QUOTE REQUIRED** cost lines. No prices invented. |
| **ADR-0006** | `PROPOSED — BLOCKED FOR PRODUCTION` | Persistence gap remains a **BLOCKING** item from Stage 5. ADR **not** approved. |
| **DP-0006** | `OPEN — NOT APPROVED` | Unchanged. |

A hosting option that restores PostgreSQL but not EOS RFP/programme state **does not** meet Stage 1 jointly critical recovery.

---

# 16. Next governed action

Persistence is **not** ready for Production-grade application recovery testing.

**Recommended next governed action:**

**Persistence architecture implementation design and authorization package** (future stage).

That package should specify WP-01–WP-07 design, sequencing, test plan, and **explicit authorization requests**. It must **not** itself implement code, migrations, or cutover unless a later task **explicitly** authorizes implementation.

**Implementation requires separate authorization.**  
**Migrations require separate authorization.**  
**UAT, Production, and deployment remain NOT AUTHORIZED.**

Do **not** jump from this assessment to persistence implementation.

---

# 17. Final governance status (unchanged)

E1: `OPEN — REQUIRES LEGAL/DPO VALIDATION`  
E2: `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`  
E3: `OPEN — HOSTING EVIDENCE IN PROGRESS`  
E4: `OPEN — TCO EVIDENCE INCOMPLETE`  

ADR-0006: `PROPOSED — BLOCKED FOR PRODUCTION`  
DP-0006: `OPEN — NOT APPROVED`  

Provider: **NOT SELECTED**  
Region: **NOT APPROVED**  
Production topology: **NOT SELECTED**  
Implementation: **NOT AUTHORIZED**  
Migration: **NOT AUTHORIZED**  
UAT: **NOT AUTHORIZED**  
Production deployment: **NOT AUTHORIZED**

---

## Validation (this assessment)

- Findings are traceable to cited source paths, ADRs, or prior governance packs.  
- **INFERRED** and **NOT TESTED** are labelled.  
- Stage 4B is not treated as application PASS.  
- No application code, schema, migration, or infrastructure was modified by this stage.  
- ADR-0006 and DP-0006 files were not modified.  
- No implementation, cutover, UAT, or Production action.
