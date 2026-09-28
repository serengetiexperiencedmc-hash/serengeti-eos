# ADR-0006 Gate C — Item 5 Production migration / backfill / cutover readiness assessment

> **`GATE C ITEM 5 — READ-ONLY READINESS ASSESSMENT`**  
> **`BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE`**  
> **`NOT A PRODUCTION MIGRATION AUTHORIZATION`**  
> **`NOT UAT / NOT PRODUCTION / NOT CUTOVER`**  
> Named personal signature, operator identity, Production row counts, and Production schema versions are **not** invented.

This file records a **read-only** repository and governance assessment of Gate C backlog item 5 (Production migration / backfill / cutover). It does **not** authorize DDL, DML, `migrate()`, UAT, Production, hosting, backup-product selection, or application deployment.

Predecessor: [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) **OA.14** / **OA.15**. Migration 123 remains **EXECUTED / POST-EXECUTION VERIFICATION PASSED** on disposable Gate-B Dev/Test only (run `20260916-021912`). Do **not** re-run it. Item 4 remains **ASSESSED / NO EVIDENCE-SUPPORTED PRODUCTION INDEX NAMED**.

---

## 1. Status

**GATE C ITEM 5 — ASSESSED / BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**

| Item | Record |
| --- | --- |
| Assessment type | Static repository + governance inspection |
| PostgreSQL contacted | **NO** (Gate-B, UAT, and Production all uncontacted) |
| Migration executed | **NO** |
| Production authorization recorded | **NO** |
| Item 5 presentable as a Production execution authorization | **NO** |
| Classification | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** |
| UAT / Production / WP-14 cutover | **NOT AUTHORIZED** |

Architecture already splits this backlog item:

| Work | Documented gate | Status |
| --- | --- | --- |
| Apply schema on Production | Authorization **F** | **NOT AUTHORIZED**; still requires E1 |
| Persist SoR cutover / retire in-memory Store | WP-14 | **NOT AUTHORIZED**; procedure **not defined** |
| Dev/Test additive DDL for items 1–3 | Gate C slice | **COMPLETE** on disposable Gate-B only |

Those three acts remain distinct. This assessment does not merge them.

---

## 2. Scope

In scope: migration catalogue through 123; `migrate()` runner; application startup/persist compatibility; documented Production prerequisites; whether backfill or cutover artifacts exist.

Out of scope: contacting any database; executing SQL; creating migrations; modifying application/tests/infrastructure; recording owner authorization; designing or writing rollback SQL; selecting a hosting provider.

---

## 3. Migration catalogue findings

Sources: `packages/db/schema.sql`; `packages/db/migrations/*.sql` (118 numbered files). Files were **not** executed.

| Fact | Evidence |
| --- | --- |
| Lowest numbered file | `001_i1_admin_shell.sql` |
| Highest numbered file | `123_cd_rfp_programme_relationship_constraints.sql` |
| Files after 123 | **None** |
| Numbering gaps | **112–116** absent; no files `112_*`–`116_*` |
| Discovery/order | Filename sort after `schema.sql` (`listMigrationFiles`) |
| Transaction control in files | **None** (`BEGIN`/`COMMIT` not present in catalogue files) |
| Extensions | `schema.sql` requires `CREATE EXTENSION IF NOT EXISTS pgcrypto` |
| Roles / CREATE USER | **Not found** in catalogue SQL |
| `DROP TABLE` / `DELETE FROM` / `TRUNCATE` | **Not found** in numbered migrations |
| Destructive-adjacent | Constraint **drops** exist (check-constraint replace in `003`/`041`/`046`/`048`; unique-constraint replace in `049`) |
| Data INSERT besides `schema_registry` | **Not found**. `INSERT INTO schema_registry` appears in many files (phase registration, not business-row backfill) |
| `event_catalogue` | Table created in `003_i4_outbox_events.sql`; **no** catalogue event-type seed INSERTs found in migrations or `apps/api` (item 6 remains separate) |

`schema.sql` header states it is **not production-ready**.

### 3.1 Grouping (repository evidence, not a Production apply list)

| Group | Examples | Character |
| --- | --- | --- |
| Kernel/base | `schema.sql` | Tenants, principals, audit, outbox, `pgcrypto` |
| Additive module schema | `001`–`122` (with gaps 112–116) | `CREATE TABLE IF NOT EXISTS`, indexes, FKs to existing parents |
| Constraint/index tighten | `035`, `036`, `049`, **123** | Indexes; `049` replaces uniques with partial uniques; `123` adds FKs + unique partial index |
| Check-constraint replace | `003`, `041`, `046`, `048` | `DROP CONSTRAINT IF EXISTS` then new CHECK |
| Seed/catalogue | `schema_registry` upserts | Metadata, not commercial data |
| Data backfill / repair scripts | **None identified** in `packages/db/migrations` | — |
| Infrastructure-dependent | `schema.sql` `pgcrypto` | Superuser/extension privilege on some hosts |
| Potentially unsafe unbounded Production apply | Full `schema.sql` + `001`–`123` via `migrate()` | Applies CRM/HR/ITSM/GRC/etc. as well as commercial tables; not equivalent to bounded 123 |

Gaps 112–116 are **absent files**, not executed skips. Sort order still applies 111 then 117.

Commercial persist dependencies already used on Gate-B include at least `015`, `016`, `017`, `018`, `019`, `119`, `122`, plus kernel tables from `schema.sql` / bootstrap. That Gate-B path used a **bounded 11-file bootstrap**, not the full catalogue. A Production `migrate()` of 001–123 is a **different, larger** apply set than either that bootstrap or bounded 123.

---

## 4. Migration runner findings

Source: `packages/db/src/index.ts`, `packages/db/src/migrate-cli.ts`, `apps/api/src/main.ts`.

| Behaviour | Observed |
| --- | --- |
| Discovery | `schema.sql` then every `*.sql` in `packages/db/migrations/` sorted by filename |
| Filtering | **None** — all unrecorded files are applied |
| Ledger | Creates `schema_migrations (id TEXT PRIMARY KEY)` if missing; records `schema.sql` as `schema.sql` and others as `migrations/<filename>` |
| Transaction | **Per file**: `BEGIN` → file SQL → `INSERT schema_migrations` → `COMMIT`; failure `ROLLBACK` that file only |
| Cross-file atomicity | **No** — earlier files stay applied if a later file fails |
| Startup coupling | `apps/api/src/main.ts`: if `EOS_DATABASE_URL` is set, **`await migrate(pool)` runs before listen** |
| CLI | `npm run migrate -w @sedmc/db` requires `EOS_DATABASE_URL`; logs `productionReady: false` |
| Tests | `pg.integration.test.ts` / `crm.integration.test.ts` call `migrate()`; Gate B verification is required to remain migration-free |

**Suitability for Production under current governance:** **not suitable** as an automatic Production executor.

Reasons (governance + code, not a performance claim):

1. Startup auto-apply couples schema change to process boot.
2. Unbounded catalogue apply is explicitly **not** the authorized Gate-C 123 path.
3. Gate-B 123 was applied by `psql` **without** `schema_migrations`. A later `migrate()` on that instance would attempt `123` again; `ADD CONSTRAINT` is **not** `IF NOT EXISTS` and would fail if objects exist.
4. Per-file commit means a mid-catalogue failure leaves a partial Production schema.
5. `123` FKs are not idempotent; unique index is `IF NOT EXISTS`.

Existing governance already forbids `migrate()` for Gate-B and for the consumed 123 execute authorization.

---

## 5. Migration 123 Production implications

File: `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql` (immutable for this assessment). Objects:

1. `rfp_rfps_opportunity_id_fkey` — `rfp_rfps.opportunity_id` → `opp_opportunities(id)` `ON DELETE RESTRICT`
2. `prg_programmes_rfp_id_fkey` — `prg_programmes.rfp_id` → `rfp_rfps(id)` `ON DELETE RESTRICT`
3. `prg_programmes_tenant_active_rfp` — unique `(tenant_id, rfp_id) WHERE archived_at IS NULL`

| Question | Repository evidence |
| --- | --- |
| Structural vs data? | **Structural.** No DML in the file. |
| Depends on pre-existing Production data? | Apply **will fail** if existing rows violate FKs or the unique predicate. Whether such rows exist in Production is **unknown** (not inspected). |
| Requires backfill? | **No repository backfill script.** Architecture §15: empty tables expected; no backfill of lost process memory. Disposable Gate-B evidence recorded 0 commercial rows — **not** Production evidence. |
| Requires cleanup before apply? | **Potentially**, if Production already has orphan `opportunity_id` / `rfp_id` or duplicate active programmes. That needs **authorized Production inspection**. |
| Application compatibility? | API already rejects missing opportunity (`invalid_opportunity`), missing RFP (`invalid_rfp`), and a second non-archived programme (`programme_exists_for_rfp`). Persist functions do **not** require the 123 objects to exist. 123 **strengthens concurrent integrity**; it is not an application feature-flag. |
| Special cutover sequence? | **Not defined** for Production. Architecture prefers FKs when parent tables are populated; unique index after duplicates are absent. No Production lock/duration evidence. |

Do **not** claim Production has zero orphans or zero duplicate active programmes.

Post-123 schema work in the catalogue: **none**. Item 4 did not name a follow-on index migration. Optional costing/approval FKs remain separately unauthorized and are **not** in 123.

---

## 6. Backfill findings

Searched: `packages/db/migrations`, application persist/seed paths, governance comments.

| Candidate | Classification | Notes |
| --- | --- | --- |
| Migration 123 itself | **A** as authored (no transformation SQL). **B** for a populated Production database | Apply is additive constraints. If Production already stores commercial rows, compatibility is data-dependent and **uninspected**. |
| Full catalogue 001–122 on a greenfield Production DB | **A** for business-row backfill (schema/create + `schema_registry` only) | Creating empty tables is not a data migration. Still a large schema apply, not authorized. |
| Full catalogue on an unknown existing Production DB | **B** | Production schema version is unknown. `049` unique replacement would fail if archived-code collisions exist. |
| In-memory Store → PostgreSQL row copy | **A** (no script). Architecture forbids using Dev memory as Production SoR | WP-14 / §15: Dev in-memory is **not** a migration source. |
| `seed-demo-data.ts` | **A** as Production backfill | Demo API replay; gated by `EOS_SEED_DEMO=true`; **not** Production data. Architecture says skip-if-CRM-exists must be redesigned so seed does not hide empty `rfp_rfps`. |
| `event_catalogue` event-type rows | Item 6, not evidenced as required for persist | Kernel publishes without catalogue FK. **A** for item 5. |
| Historical UUID conversion / relationship population scripts | **A** — **none found** | — |

**Category C (required backfill evidenced by repository design): none.**

Do not promote 123’s **B** (unknown Production rows) to **C**.

---

## 7. Production-data unknowns

The following are **unknown** and are **not** invented:

- Whether a Production PostgreSQL instance exists
- Production `schema_migrations` contents or whether 001–123 are applied
- Production row counts for `opp_opportunities`, `rfp_rfps`, `prg_programmes`, costing, approval, documents
- Orphan RFP `opportunity_id` values
- Orphan Programme `rfp_id` values
- Duplicate active programmes (`tenant_id`, `rfp_id` where `archived_at IS NULL`)
- Production traffic, lock time, or `EXPLAIN` of 123 DDL
- Whether Production currently uses in-memory Store, dual-write, or per-request SQL SoR

Disposable Gate-B evidence (opp/rfp/prg **0**; tenants **2**; principals **6**; audit **93**; `schema_migrations` **absent**; 123 objects **present** after run `20260916-021912`) describes **that instance only**.

---

## 8. Cutover readiness

**Current state: Not yet defined.**

Architecture pack §15 is a **design sketch** (not executed): additive SQL after 122; no Production data; seed via API after persist; dual-write only if API fails closed; dual-read prefer PG; cutover flip SoR module-by-module; default forward-fix; post-cutover restart + reconciliation. WP-14 is a **separate** cutover authorization. GB-15 was Gate B “document dual-read flags, seed replay, reconciliation checklist” — **no cutover runbook file was found** in this inspection (`*cutover*` glob: 0 files).

Not found as an evidenced Production procedure:

- maintenance window / downtime requirement
- migrate-before-deploy vs deploy-before-migrate
- Production backup-before-migration runbook (Gate-B disposable procedure is **not** that)
- Production restore verification
- smoke / readiness / abort criteria
- compatibility window for app builds with vs without 123
- lock-duration limits

`main.ts` will auto-`migrate()` whenever `EOS_DATABASE_URL` is set, including if `EOS_ENV=production` or `uat`. That is **coupling**, not a defined cutover sequence. `EOS_SEED_DEMO=true` is **not** obviously blocked by `isProduction` in the seed branch.

Classify architecture §15 as **partially sketched design**, not **defined and evidenced** cutover.

---

## 9. Rollback / recovery findings

No down-migration files exist. Architecture default is **forward-fix**, not reverse DDL.

| Category | After COMMIT | Notes |
| --- | --- | --- |
| 123 FKs | Reverse would be `DROP CONSTRAINT` (not authored). Transaction rollback **only** before COMMIT of that file | Restore-from-backup is the evidenced disposable pattern; **not** a designed Production reverse |
| 123 unique index | Reverse would be `DROP INDEX` (not authored). `IF NOT EXISTS` does not make drop automatic | Same |
| Additive `CREATE TABLE IF NOT EXISTS` | Reverse is DROP TABLE (destructive; not authored) | Restore is the practical undo |
| `049` unique replacement | Reverse is not a simple undo of live archived duplicates | Restore |
| `schema_registry` upsert | Overwrites phase/status metadata | Not a commercial-data rollback |
| Application SoR cutover | Depends on deploying a prior API build **and** whether PG remains SoR | Memory-SoR rollback is **explicitly rejected** as a Production strategy (architecture §15) |
| Mid-`migrate()` failure | Already-committed earlier files remain | Partial schema; repair is forward-fix or restore |

**Highlight:** for Production, “rollback” of 123 after a successful commit **means restore-from-backup** (or separately authorized reverse DDL), not an in-file undo. Production backup/restore capability is **not** evidenced (see §10).

---

## 10. Production backup / recovery dependency

| Evidence class | Status |
| --- | --- |
| Gate-B disposable backup/restore for 123 prerequisite | **PASS** (run `20260916-014121`) — **not** Production |
| Stage 4B laboratory `pg_dump` / WAL / PITR | **LABORATORY DEMONSTRATED** on synthetic tables — **not** Production |
| ADR-0011 | Accepted for **Development/Test evidence-register only**. Production backup **product TBD** |
| Named Production backup/PITR product | **Not selected** |
| Production restore-test cadence | **Not evidenced** |
| E1 backup/DR placement | **NOT APPROVED / UNKNOWN** |

Gate-B dump evidence **must not** be treated as Production backup evidence.

A Production migration authorization that relies on “backup then DDL then restore if needed” is **blocked** until a Production backup product and restore proof exist under their own authorizations.

---

## 11. Production hosting / persistence dependencies

Documented prerequisites that remain **unresolved** (not solved here):

| Dependency | Recorded status |
| --- | --- |
| Gate E1 legal / data placement | `OPEN — REQUIRES LEGAL/DPO VALIDATION`; Production PG placement **NOT APPROVED** |
| Gate E3 hosting | `OPEN — HOSTING EVIDENCE IN PROGRESS`; provider/region/topology **not selected** |
| Authorization **F** (Production migration) | **NOT AUTHORIZED**; architecture: still needs E1 |
| Authorization **E** (Production persistence implementation) | **NOT AUTHORIZED** |
| Authorization **G** (Production deployment) | **NOT AUTHORIZED** |
| Gate D UAT | **NOT AUTHORIZED** |
| WP-14 Store SoR cutover | **NOT AUTHORIZED** |
| ADR-0006 / DP-0006 Production hosting/residency | **not closed** by Gate C |
| ADR-0012 secrets / ADR-0013 IdP | **OPEN** |
| RM-01 durable Production SoR for Commercial/RFP/Programme | **OPEN** |
| Production RTO/RPO product evidence | Laboratory only; **not** Production-closed |
| HA / DR / geo-replication | **not selected** |

Item 5 cannot proceed as Production DDL while these remain unresolved. This assessment does **not** select or approve any of them.

---

## 12. Application compatibility findings

| Topic | Finding |
| --- | --- |
| RFP create | Loads opportunity by tenant; `invalid_opportunity` if missing. Copies `opportunity_id`. Does not query 123 FK. |
| Programme create | Requires RFP (`invalid_rfp`); rejects existing non-archived programme (`programme_exists_for_rfp`); uniqueness follows `archived_at`, not `status`. |
| Durable SoR | When `store.dbPool` is set, commercial modules use per-request SQL. When unset, in-memory Store remains SoR. |
| Startup | `EOS_DATABASE_URL` → `migrate()` → `syncStoreToPostgres` → hydrate CRM/notifications/outbox. Auto-schema-apply is **not** a Production control. |
| Expectation that 123 exists | **Not required** for current persist code to run. Gate B persist **passed** before 123. After 123 on Gate-B, persist is expected still to work; that is disposable-instance evidence, not Production. |
| Concurrent duplicate programmes | App check then insert; 123 unique index would reject a race the app might miss. That is integrity, not a new API contract. |
| Demo seed | `EOS_SEED_DEMO=true` replays via HTTP; not a Production backfill. |

---

## 13. Missing prerequisites

Before a **separate** Production migration execution authorization could even be drafted, the following are missing (non-exhaustive):

1. Approved Production PostgreSQL (product, region, residency) — E1 + hosting
2. Production backup/PITR product and restore evidence — ADR-0011 Production TBD
3. Authorized Production (or UAT) **read-only preflight** of schema version and 123-incompatible rows
4. Decision: bounded 123-only apply vs unbounded `migrate()` of `schema.sql`+001–123 (current runner does the latter on startup)
5. Decision: disable or gate auto-`migrate()` on Production boot
6. Written cutover procedure (WP-14), including migrate/deploy order, abort criteria, and app SoR flip
7. UAT of persisted commercial modules (Gate D) — **not** implied by Gate-B
8. Authorizations E / F / G as distinct records
9. Item 4 remains without a named Production index; it is **not** a 123 blocker, but is not a substitute for F
10. Optional costing/approval FKs and item 6 catalogue seed — unspecified relative to Production 123

---

## 14. Recommended future governed stages

These stages are **supported by existing gate split (A–G, WP-14, E1/E3)**. They are **not** authorized by this file.

1. **Production database readiness** — hosting + E1 placement + PostgreSQL 16-class instance exists
2. **Production backup/restore readiness** — named product, backup, isolated restore proof (not Gate-B dump)
3. **Production preflight data validation** — authorized read-only orphan/duplicate/schema_migrations inspection
4. **Migration execution authorization** — bounded objects, method (not silent startup `migrate()`), abort rules
5. **Bounded migration execution** — authorized environment only
6. **Post-migration verification** — catalog objects; no assumed row-count success without measurement
7. **Application deployment / SoR cutover** — WP-14; distinct from DDL
8. **Post-cutover validation** — restart, reconciliation, fail-closed persist
9. **Rollback/restore decision** — restore-from-backup vs forward-fix; criteria written before execute

Do **not** treat this list as an execution plan or as owner approval.

---

## 15. Database-contact statement

**Gate-B database contacted: NO**  
**UAT contacted: NO**  
**Production contacted: NO**  
**Cloud infrastructure contacted: NO**  
**`psql` executed: NO**

---

## 16. Migration-execution statement

**No migration was executed.**  
**`migrate()` was not invoked.**  
**No DDL or DML was executed.**  
**Migration 123 was not re-run.**  
**No new SQL migration was created.**  
**Migration 123 was not modified.**

---

## 17. Authorization statement

**No Production authorization was recorded.**  
**No UAT authorization was recorded.**  
**No WP-14 cutover authorization was recorded.**  
**No Authorization F/E/G was recorded.**  
**No backup-product or hosting selection was recorded.**

Operator identity: **REQUIRES HUMAN**

---

## 18. Item 5 classification

**BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**

Not “Production ready.” Not ready for a separate Production **execution** authorization. Repository evidence does not show a required business-data backfill script. Cutover is not defined. Production data state is unknown. Auto-`migrate()` on API startup is incompatible with the existing bounded-DDL governance model.

---

## 19. Next governed action

Do **not** authorize Production migration, backfill, cutover, UAT, or Production access from this assessment.

Keep Gate C **OPEN**. Do **not** re-run migration 123.

Next separately authorized work, when the owner chooses a later package, is **not** item-5 execution. It remains Production architecture prerequisites (E1, hosting, backup product, Production PostgreSQL) and, only after those, distinct authorizations for preflight, bounded DDL, and WP-14 cutover.

**STOP.**
