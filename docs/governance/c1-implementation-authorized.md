# C1 Implementation Authorization — 2026-08-22

> **CURRENT STATE (2026-08-24 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`4f2ffd3afbf28b547f8e6deadd1c4f5241562cfb`**  
> C1 remains **COMPLETE / CLOSED** (Dev/Test). C1 Gate **PASS**. **C2–C10 CLOSED** under later authorizations. **C11+ is not created and not authorized.**  
> This record does not authorize new implementation. **EXECUTION_QUEUE=EMPTY** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

| Gate | Decision |
| --- | --- |
| C1 Architecture Preview | **APPROVED** |
| C1 Implementation | **AUTHORIZED — Dev/Test** |
| C1.1 Database/domain foundation | **COMPLETE** |
| C1.2 Organizations + units | **COMPLETE** |
| C1.3 Contacts + relationships | **COMPLETE** |
| C1.4 CRM activities + interaction history | **COMPLETE** |
| C1.5 Accounts + notes + tasks | **COMPLETE** |
| C1.6 Search + duplicates | **COMPLETE** |
| C1.7 Controlled merge + bulk import | **COMPLETE** |
| C1.8 Tags + external identifiers | **COMPLETE** |
| C1.9 CRM domain events | **COMPLETE** |
| C1.10 CRM completion / hardening | **COMPLETE** |
| C1.11 C1 Gate remediation | **COMPLETE** |
| C1 Gate | **PASS — Development/Test only** (`c1-gate-decision.md`) |
| C2–C10 | **CLOSED** (Dev/Test, prior authorizations — not pending on this C1 gate) |
| New C11+ | **NOT AUTHORIZED** / not created |
| AI / UAT / Production | BLOCKED |
| ADR-0006 / 0012 / 0013 | OPEN |
| ADR-0010 | Development/Test only |

Official statement unchanged: not UAT-ready, not Production-ready.

## C1.2 implementation notes (Dev/Test)

- Organization duplicate prevention uses normalized `legalName` (trim, collapse whitespace, strip trailing legal suffixes such as Ltd/LLC/Inc, lowercase). **"Corporation" is retained** in the name token so entities like "Acme Corporation" are not over-normalized.
- Cross-tenant organization/unit reads return **404** before RBAC evaluation (consistent with payment tenant isolation).
- Lifecycle transitions and archive endpoints implemented per approved API spec; full transition matrix in `packages/kernel/src/crm-org.ts`.
- `GET /v1/crm/organization-units/:id` added for unit retrieval (retrieve requirement; PATCH path already specified).

## C1.3 implementation notes (Dev/Test)

- Contacts are **person records** without direct `organizationId` FK — org association is via **relationships** only (approved architecture).
- Contact↔org relationships use `fromContactId` + `toOrganizationId`; optional `organizationUnitId` scoped to the target organization (migration `006`).
- Org↔org relationships use `fromOrganizationId` + `toOrganizationId` (e.g. subsidiary/parent types from C1.1 catalogue).
- Contact lifecycle: `Active` ↔ `Inactive` via PATCH; `Archived` via archive endpoint. Relationship lifecycle via `POST .../transitions`.
- Email duplicate prevention: exact normalized email match within tenant for active non-merged contacts — **not** a global uniqueness claim; same person may exist without email or with different emails.
- Personal names: trim + whitespace collapse only (no organization suffix stripping).
- **No primary relationship flag** — not defined in approved architecture.
- Cross-tenant contact/relationship reads return **404** before RBAC (C1.2 pattern preserved).

## C1.4 implementation notes (Dev/Test)

- **Activities** are business interaction history — separate from system/security **audit** (`crm/audit.ts`). Audit records mutations; activities record meetings, calls, etc.
- Activity types use the C1.1-style **catalogue** (`crm_activity_types` / in-memory seed) — keys from approved domain model (meeting, telephone, email, …).
- Associations: at least one of `contactId`, `organizationId`, or `relationshipId` required; optional `organizationUnitId` scoped to organization. **Associations are immutable after create** (historical integrity).
- `occurredAt` stored as ISO-8601 UTC; distinct from `createdAt`.
- Classification inherits max clearance from linked contact/org; list endpoints omit activities above principal clearance.
- Corrections via PATCH (`If-Match`); void via archive — no hard delete.
- **Notes and tasks not implemented** (out of C1.4 scope per authorization).
- `Idempotency-Key` remains deferred (same as C1.2/C1.3).

## C1.5 implementation notes (Dev/Test)

- **Account** references canonical **Organization** — does not duplicate org identity. ER model allows multiple accounts per org; duplicate **account name** blocked per org (case-insensitive).
- Account lifecycle: `Prospect → Active → OnHold → Closed → Archived` (separate from org lifecycle).
- **Notes** use `entityType` + `entityId` (organization, organization_unit, contact, relationship, account, activity). Permissions reuse `crm:read/write:activity` per API spec. Audit stores metadata only, not note body.
- **Tasks** are actionable items — **not** activities. Task completion does **not** create C1.4 activities.
- Task lifecycle per architecture: Open, InProgress, Completed, Cancelled, Deferred with validated transitions.
- `estimatedCommercialValue` removed from domain type (pipeline/revenue out of scope); optional commercial fields limited to architecture-approved metadata.
- Migration `008_c1_accounts_notes_tasks.sql`; schema registry phase **6**.
- Version **0.8.0-c1.5**; C1.5 test evidence: **88 passed / 0 failed / 2 skipped** (9 C1.5 tests in `c1.accounts-notes-tasks.test.ts`).
- Live Postgres integration: **not executed** (2 skipped tests require `EOS_DATABASE_URL`).

## C1.6 implementation notes (Dev/Test)

- **Search** (`GET /v1/crm/search`) — tenant-scoped, deterministic substring matching on organizations, contacts, accounts, activities, tasks. Uses existing entity read permissions (no dedicated search permission). Ranking: exact → prefix → contains. Cursor pagination; **no total count** (prevents restricted-record leakage).
- **Duplicate detection** — separate from search. Deterministic scoring in `packages/kernel/src/crm-duplicate.ts`; threshold **80**. Organization signals: normalized legal name (100), trading/legal cross-match (90), domain (90). Contact signals: email exact (100), phone normalized (80); same-name + shared org (60, below threshold — does not auto-flag).
- **Duplicate candidates** persisted in `crm_duplicate_candidates` (in-memory + migration `009`). Status: `PotentialDuplicate → ConfirmedDuplicate | NotDuplicate` via review. **No automatic merge.**
- Scorer runs on organization/contact create and update. Rejected pairs suppressed **90 days** before re-flagging.
- Permissions: `crm:read:duplicate`, `crm:review:duplicate`. Cross-tenant duplicate reads → **404**.
- C1.5 regression: cross-tenant note list + classification-aware search covered in C1.6 tests.
- Version **0.9.0-c1.6**; test evidence: **99 passed / 0 failed / 2 skipped** (11 C1.6 tests in `c1.search-duplicates.test.ts`).

## C1.7 implementation notes (Dev/Test)

- **Controlled merge** (`POST /v1/crm/merges`) — organizations and contacts only. Requires `ConfirmedDuplicate` candidate, explicit `survivorId` + `duplicateIds[]`, `fieldResolutions`, `reason`, and **`Idempotency-Key`**. Optimistic concurrency via `expectedVersions`. Loser receives `mergedIntoId` + `archivedAt`; dependents re-pointed. Merge history in `crm_merge_records` with `affectedCounts`. **No automatic merge.**
- Field conflicts: only fields explicitly listed in `fieldResolutions` are applied to survivor.
- **Bulk import** — CSV UTF-8, create-only for organizations and contacts. Workflow: create → validate (dry-run) → execute (requires `Idempotency-Key`). All-or-nothing execute with in-memory rollback. Max 500 rows / 1MB.
- Permissions: `crm:merge:record`, `crm:import:bulk`.
- Migration `010_c1_merge_import.sql`; schema registry phase **8**.
- Version **0.10.0-c1.7**; test evidence: **106 passed / 0 failed / 2 skipped** (7 C1.7 tests).
- Live Postgres integration: **not executed** (2 skipped tests require `EOS_DATABASE_URL`).

## C1.8 implementation notes (Dev/Test)

- **Tags** — tenant-scoped catalogue (`crm_tags`) with normalized machine keys (`trim`, lowercase, whitespace → `_`). Unique by `tenant + normalized key` among active tags. Lifecycle: create, PATCH label (`If-Match`), soft archive. Permissions: `crm:read:tag`, `crm:write:tag` (platform admin seed; not granted to commercial manager by default).
- **Tag assignments** — polymorphic junction (`crm_entity_tags`) for organization, organization_unit, contact, relationship, account, activity, task. Duplicate assignments blocked. Entity read/write + classification clearance required. Archived tags cannot receive new assignments; existing assignments remain.
- **External identifiers** — data-only mapping (`crm_external_identifiers`); **no external integration or sync**. Entity types: organization, contact. `systemKey` and `externalId` normalized; unique by `tenant + systemKey + externalId`. Reassignment to another entity rejected with `409 external_identifier_owned`. Lookup: `GET /v1/crm/external-identifiers/lookup/:systemKey/:externalId` (tenant + RBAC + ABAC).
- **Merge compatibility** — non-conflicting identifiers re-pointed to survivor; identical survivor/duplicate pairs deduplicated; third-party collisions reject merge (`409 external_identifier_conflict`). Tags re-pointed on merge (C1.7 pattern extended).
- **Search / import** — unified C1.6 search unchanged (no tag filter or external-ID fuzzy search). C1.7 import unchanged (external IDs not in CSV scope).
- Migration `011_c1_tags_external_identifiers.sql`; schema registry phase **9**.
- Version **0.11.0-c1.8**; test evidence: **117 passed / 0 failed / 2 skipped** (11 C1.8 tests in `c1.tags-external-identifiers.test.ts`).
- **No domain events emitted** (`crm.record.merged.v1` and tag/external-id events remain C1.9).
- Live Postgres integration: **not executed** (2 skipped tests require `EOS_DATABASE_URL`).

## C1.9 implementation notes (Dev/Test)

- **CRM domain event catalogue** — authoritative registry in `packages/kernel/src/crm-events.ts` (`buildCrmEventCatalogue()`). Versioned types `crm.<entity>.<verb>.v1`; registered in I4 event catalogue on CRM collection init.
- **Emission** — `emitCrmEvent()` in `apps/api/src/crm/events.ts` writes to existing I4 transactional outbox after successful mutations. Events are **not** audit records; audit behaviour unchanged.
- **Envelope** — standard I4 `EnterpriseEventEnvelope` (`eventId`, `eventType`, `eventVersion`, `occurredAt`, `tenantId`, `aggregateId`, actor, `correlationId`, classification, payload). Payload includes `entityType`, `entityId`, and reference-first fields only.
- **Payload rules** — no email, phone, passwords, CSV content, or full note bodies. Classification enforced per catalogue entry.
- **Merge** — `crm.record.merged.v1` + entity-specific merged events emitted only after successful merge; idempotent replay does not duplicate events.
- **Import** — created / validated / committed / failed events; execute idempotency preserved.
- **Dev/Test inspection** — `GET /v1/crm/dev/outbox-events` (`events:read:operations`, tenant-scoped). No external delivery, webhooks, or production transport.
- Migration `012_c1_events.sql`; schema registry phase **10**.
- Version **0.12.0-c1.9**; test evidence: **128 passed / 0 failed / 2 skipped** (11 C1.9 tests in `c1.events.test.ts`).
- Live Postgres integration: **not executed** (2 skipped tests require `EOS_DATABASE_URL`).

## C1.10 implementation notes (Dev/Test)

- **Security regression suite** — `apps/api/src/crm.security.regression.test.ts` implements TI/AZ/IN/MG/EV/AU cases from `docs/architecture/c1/security-test-plan.md`.
- **Integration tests** — `apps/api/src/crm.integration.test.ts` (static migration sequence always; live Postgres gated on `EOS_RUN_PG_TESTS=1` + `EOS_DATABASE_URL`).
- **Merge tag deduplication** — `repointEntityTags()` removes duplicate assignments when survivor already has the same tag.
- **Import rollback** — failed execute rolls back organizations, contacts, duplicate candidates, and outbox events emitted during the attempt.
- **Event hardening** — `validateCrmEventEmission()` dry-run; simulation mode blocks CRM event emission (`simulation_cannot_publish`).
- Migration `013_c1_hardening.sql`; schema registry phase **11**.
- Version **0.13.0-c1.10**; test evidence in security regression + integration suites.
- **C1 Gate** — **PASS — Development/Test only** (`c1-gate-decision.md`). C2+ still requires its own authorization.
- Live Postgres integration: **not executed** (3 skipped tests require `EOS_DATABASE_URL` + `EOS_RUN_PG_TESTS=1`).

## C1.11 implementation notes (Dev/Test — Gate remediation)

- **Task search fix** — `search.ts` task ranking uses `bestRank`; regression in `c1.search-duplicates.test.ts`.
- **Event atomicity** — `commitCrmWithOutbox()` couples CRM mutation + outbox with rollback; failure-injection in `c1.11.atomicity.test.ts`.
- **Input validation** — `validateOrganizationLegalName()`, `isValidUuid()` for IN-01–IN-03.
- **Security coverage** — 100% disposition in `docs/architecture/c1/security-coverage-disposition.md` (22 pass, 1 N/A, 2 waived).
- **OpenAPI** — `docs/architecture/openapi/crm-c1.yaml` (59 paths / 79 operations).
- **Performance baseline** — `docs/architecture/c1/performance-baseline.md` (captured by `c1.11.performance.test.ts`).
- **PostgreSQL boundary** — migrations 004–013 validated statically; live PG tests gated. **CRM runtime remains in-memory**; PG stores schema only until a future persistence increment. Gate test confirms PG row count stays 0 after API create when `EOS_RUN_PG_TESTS=1`.
- **Typecheck** — `npm run typecheck` exits 0.
- Version **0.14.0-c1.11**; test evidence: **157 passed / 0 failed / 4 skipped** (without live PG).
- **C1 Gate** recorded 2026-08-24 as PASS — Development/Test only. Not automatic for C2+, UAT, or Production.
