# ADR-0006 Gate C — Item 4 Production query-plan index readiness assessment

> **`GATE C ITEM 4 — READ-ONLY READINESS ASSESSMENT`**  
> **`NO PRODUCTION INDEX REQUIREMENT ESTABLISHED`**  
> **`NOT A MIGRATION AUTHORIZATION`**  
> **`NOT UAT / NOT PRODUCTION`**  
> Named personal signature, operator identity, and Production performance figures are **not** invented.

This file records a **read-only** repository assessment of Gate C backlog item 4 (additional Production query-plan indexes). It does **not** authorize DDL, a new migration, UAT, Production, or access to any live PostgreSQL instance.

Predecessor: [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md) **OA.14**. Migration 123 remains **EXECUTED / POST-EXECUTION VERIFICATION PASSED** (run `20260916-021912`). Do **not** re-run it. Do **not** drop or alter `prg_programmes_tenant_rfp` or `prg_programmes_tenant_active_rfp`.

---

## 1. Status

**GATE C ITEM 4 — ASSESSED / NO EVIDENCE-SUPPORTED PRODUCTION INDEX NAMED**

| Item | Record |
| --- | --- |
| Assessment type | Static schema + application SQL inspection |
| PostgreSQL contacted | **NO** |
| Production statistics / `EXPLAIN` | **Unavailable** (not authorized; not fabricated) |
| Category C (evidence-supported Production index) | **None** |
| Item 4 presentable as a named migration | **NO** |
| Item 4 resolved | **NO** — remains **OPEN** pending Production workload evidence or a later bounded design that names indexes |
| UAT / Production | **NOT AUTHORIZED** |

---

## 2. Scope

In scope: Commercial/RFP/Programme domain tables and the application SQL that reads them, plus adjacent costing, approval, commercial-document, audit, and outbox queries used by that persist path.

Out of scope: executing SQL; UAT/Production access; cloud; creating or modifying migrations; application/test/infrastructure changes; owner authorization of indexes.

Table name `rfp_rfp_versions` does **not** exist. The repository table is `rfp_versions`.

---

## 3. Existing index inventory (repository SQL through migration 123)

Sources: `packages/db/schema.sql`; migrations `015`, `016`, `017`, `018`, `019`, `020`, `035`, `119`, `122`, `123`. No live catalog dump was taken for this assessment.

### 3.1 Opportunity

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `opp_opportunities_pkey` | PK | `id` |
| `UNIQUE (tenant_id, opportunity_code)` | unique | equality on tenant + code |
| `opp_opportunities_tenant_stage` | partial btree | `(tenant_id, stage, status) WHERE archived_at IS NULL` |
| `opp_stage_history_pkey` | PK | `id` |
| `opp_stage_history.opportunity_id` | FK | → `opp_opportunities(id)` |
| `opp_stage_history_opportunity` | btree | `(tenant_id, opportunity_id, changed_at DESC)` |

### 3.2 RFP

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `rfp_rfps_pkey` | PK | `id` |
| `UNIQUE (tenant_id, rfp_code)` | unique | equality on tenant + code |
| `rfp_rfps_tenant_stage` | partial btree | `(tenant_id, workflow_stage, status) WHERE archived_at IS NULL` |
| `rfp_rfps_opportunity` | btree | `(tenant_id, opportunity_id)` — **not** partial; includes archived rows |
| `rfp_rfps_opportunity_id_fkey` | FK (123) | `opportunity_id` → `opp_opportunities(id)` `ON DELETE RESTRICT` |
| `rfp_versions_pkey` | PK | `id` |
| `UNIQUE (rfp_id, version_number)` | unique | version identity |
| `rfp_versions_rfp` | btree | `(tenant_id, rfp_id, version_number DESC)` |

### 3.3 Programme

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `prg_programmes_pkey` | PK | `id` |
| `UNIQUE (tenant_id, programme_code)` | unique | equality on tenant + code |
| `prg_programmes_tenant_rfp` | partial non-unique btree (017) | `(tenant_id, rfp_id) WHERE archived_at IS NULL` |
| `prg_programmes_tenant_active_rfp` | partial **unique** btree (123) | `(tenant_id, rfp_id) WHERE archived_at IS NULL` |
| `prg_programmes_rfp_id_fkey` | FK (123) | `rfp_id` → `rfp_rfps(id)` `ON DELETE RESTRICT` |
| `prg_days_pkey` / `UNIQUE (programme_id, day_number)` | PK / unique | day identity |
| `prg_days_programme` | btree | `(tenant_id, programme_id, sort_order)` |
| `prg_items_pkey` | PK | `id` |
| `prg_items.day_id` | FK | → `prg_days(id)` |
| `prg_items_day` | btree | `(tenant_id, day_id, sort_order)` |
| `prg_programme_versions` unique `(programme_id, version_number)` | unique | version identity |
| `prg_programme_versions_programme` | btree | `(tenant_id, programme_id, version_number DESC)` |

### 3.4 Costing / approval / documents / proposal

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `cost_sheets` unique `(tenant_id, sheet_code)` | unique | code lookup |
| `cost_sheets_tenant_programme` | partial btree | `(tenant_id, programme_id) WHERE archived_at IS NULL` |
| `cost_line_items_sheet` | btree | `(tenant_id, cost_sheet_id, sort_order)` |
| `cost_sheet_versions_sheet` | btree | `(tenant_id, cost_sheet_id, version_number DESC)` |
| `com_approval_requests` unique `(tenant_id, request_code)` | unique | code lookup |
| `com_approval_requests_cost_sheet` | btree | `(tenant_id, cost_sheet_id, status)` |
| `com_approval_requests_rfp` | btree | `(tenant_id, rfp_id, status)` |
| `commercial_documents_tenant_rfp` | partial btree | `(tenant_id, rfp_id) WHERE rfp_id IS NOT NULL AND status = 'active'` |
| `commercial_documents_tenant_supplier` | partial btree | `(tenant_id, supplier_id) WHERE supplier_id IS NOT NULL AND status = 'active'` |
| `prop_proposals_tenant_rfp` | partial btree | `(tenant_id, rfp_id) WHERE archived_at IS NULL` |

No FK from `cost_sheets.programme_id` / `rfp_id` or `com_approval_requests` to parent tables was found in these files. Item 4 does not fill that gap; costing/approval FKs remain separately unauthorized.

### 3.5 Audit / outbox

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `audit_events_tenant_sequence` | unique btree | `(tenant_id, sequence)` |
| `outbox_events_pending` | partial btree (035) | `(status, created_at) WHERE status = 'pending'` |
| `processed_events` PK | PK | `(tenant_id, consumer, event_id)` |

No index on `audit_events.resource_id` or `outbox_events.aggregate_id` appears in repository SQL.

### 3.6 CRM (adjacent persist path)

| Object | Kind | Definition (as authored) |
| --- | --- | --- |
| `crm_org_tenant_updated` | btree (036) | `(tenant_id, updated_at DESC)` |
| `crm_contact_tenant_updated` | btree (036) | `(tenant_id, updated_at DESC)` |
| `crm_activity_tenant_updated` | btree (036) | `(tenant_id, updated_at DESC)` |
| `crm_account_tenant_updated` | btree (037) | `(tenant_id, updated_at DESC)` |
| `crm_note_tenant_updated` | btree (037) | `(tenant_id, updated_at DESC)` |
| `crm_dup_candidate_tenant_status` | btree (009) | `(tenant_id, status, detected_at DESC)` |
| `crm_org_tenant_legal_name` | btree (009) | `(tenant_id, lower(legal_name))` |
| `crm_contact_tenant_email` | partial btree (009) | `(tenant_id, lower(email)) WHERE email IS NOT NULL` |
| `crm_account_tenant_name` | btree (009) | `(tenant_id, lower(account_name))` |

Commercial list tables (`opp_opportunities`, `rfp_rfps`, `prg_programmes`, `cost_sheets`) do **not** have a `(tenant_id, updated_at DESC)` index of this form. That contrast is schema evidence of a **pattern difference**, not Production workload evidence that commercial lists require the same index.

---

## 4. Query-pattern evidence (application SQL)

Sources: `apps/api/src/persistence/opportunity-repository.ts`, `rfp-repository.ts`, `programme-repository.ts`, `costing-repository.ts`, `commercial-approval-repository.ts`, `commercial-document-repository.ts`, `durable.ts`, `pg-repository.ts`. Dual-path in-memory store queries are not PostgreSQL plans.

No `LIMIT`/`OFFSET` pagination was found on these commercial list queries. Lists return all matching tenant rows ordered by a timestamp or sort_order.

| Query | Tables | WHERE | JOIN | ORDER BY | Existing support | 123 relevance |
| --- | --- | --- | --- | --- | --- | --- |
| Opportunity by id | `opp_opportunities` | `id`, `tenant_id`, `archived_at IS NULL` | none | none | PK | none |
| Opportunity code exists | `opp_opportunities` | `tenant_id`, `opportunity_code` | none | none | unique `(tenant_id, opportunity_code)` | none |
| List opportunities | `opp_opportunities` | `tenant_id`, `archived_at IS NULL`; optional `stage`, `status`, `organization_id` | none | `updated_at DESC` | `opp_opportunities_tenant_stage` covers tenant + optional stage/status; **not** `organization_id`; **not** `updated_at` | none |
| Stage history | `opp_stage_history` | `tenant_id`, `opportunity_id` | none | `changed_at DESC` | `opp_stage_history_opportunity` | none |
| RFP by id | `rfp_rfps` | `id`, `tenant_id`, `archived_at IS NULL` | none | none | PK | FK exists; lookup is by id |
| RFP code exists | `rfp_rfps` | `tenant_id`, `rfp_code` | none | none | unique `(tenant_id, rfp_code)` | none |
| List RFPs | `rfp_rfps` | `tenant_id`, `archived_at IS NULL`; optional `opportunity_id`, `workflow_stage`, `status` | none | `updated_at DESC` | `rfp_rfps_opportunity` or `rfp_rfps_tenant_stage` depending on filters; **not** `updated_at` | FK + `rfp_rfps_opportunity` already support opportunity filter |
| RFP versions | `rfp_versions` | `tenant_id`, `rfp_id` | none | `version_number DESC` | `rfp_versions_rfp` | none |
| Programme by id | `prg_programmes` | `id`, `tenant_id`, `archived_at IS NULL` | none | none | PK | none |
| Programme by RFP (active) | `prg_programmes` | `tenant_id`, `rfp_id`, `archived_at IS NULL` | none | none | `prg_programmes_tenant_active_rfp` (and `prg_programmes_tenant_rfp`) | **123 unique index is the lookup+uniqueness object** |
| Programme code exists | `prg_programmes` | `tenant_id`, `programme_code` | none | none | unique `(tenant_id, programme_code)` | none |
| List programmes | `prg_programmes` | `tenant_id`, `archived_at IS NULL`; optional `rfp_id`, `status` | none | `updated_at DESC` | tenant/rfp partial indexes; **not** `status`; **not** `updated_at` | 123 uniqueness when `rfp_id` present |
| Programme days | `prg_days` | `tenant_id`, `programme_id` | none | `sort_order`, `day_number` | `prg_days_programme` | none |
| Programme items by programme | `prg_items` | `tenant_id`, `programme_id` | none | `sort_order` | `prg_items_day` is `(tenant_id, day_id, …)` — **does not lead with `programme_id`** | none |
| Cost sheet by id / by programme | `cost_sheets` | `tenant_id`, id or `programme_id`, `archived_at IS NULL` | none | none | PK / `cost_sheets_tenant_programme` | none |
| List cost sheets | `cost_sheets` | `tenant_id`, `archived_at IS NULL`; optional `programme_id` or `rfp_id` | none | `updated_at DESC` | programme filter supported; **`rfp_id` not a leading indexed column** | none |
| Cost lines / versions | `cost_line_items`, `cost_sheet_versions` | tenant + sheet id | none | `sort_order` / `version_number DESC` | matching indexes | none |
| Approval by id | `com_approval_requests` | `id`, `tenant_id` | none | none | PK | none |
| Pending approval for sheet | `com_approval_requests` | `tenant_id`, `cost_sheet_id`, `status = 'pending'` | none | none | `com_approval_requests_cost_sheet` | none |
| List approvals | `com_approval_requests` | `tenant_id`; optional `cost_sheet_id`, `rfp_id`, `status` | none | `created_at DESC` | sheet/rfp+status indexes; **not** `created_at` | none |
| Documents for RFP | `commercial_documents` | `tenant_id`, `rfp_id`, `status = 'active'` | none | `created_at DESC` | `commercial_documents_tenant_rfp` matches predicates; **not** `created_at` | none |
| Pending approval count | `com_approval_requests` | `tenant_id`, `status = 'pending'` | none | none | existing indexes lead with sheet or rfp, then status | none |
| Audit chain load | `audit_events` | `tenant_id` | none | `sequence ASC` | `audit_events_tenant_sequence` | none |
| Last audit hash | `audit_events` | `tenant_id` | none | `sequence DESC LIMIT 1` | same unique index | none |
| Audit count by tenant | `audit_events` | `tenant_id` | none | none | leading column of unique index | none |
| Pending outbox hydrate | `outbox_events` | `status = 'pending'` | none | `created_at ASC` | `outbox_events_pending` | none |
| Pending outbox count (optional tenant) | `outbox_events` | `status = 'pending'` and optional `tenant_id` | none | none | partial `(status, created_at)`; tenant is extra filter | none |

No repository SQL `JOIN` among `opp_opportunities` / `rfp_rfps` / `prg_programmes` was found in these persist functions. Relationships are followed by separate keyed lookups.

---

## 5. Candidate index analysis

Classification key:

- **A** — existing PK/unique/index already matches the coded predicate
- **B** — query shape could use an extra index; no workload/selectivity evidence to require it for Production
- **C** — sufficient evidence to formally consider a named Production index
- **D** — no credible repository case

| ID | Candidate (not created) | Query it would target | Classification | Notes |
| --- | --- | --- | --- | --- |
| I-01 | (none) additional on PK id lookups | get-by-id | **A** | PK is sufficient |
| I-02 | (none) additional on tenant+code | code-exists | **A** | unique constraints already exist |
| I-03 | (none) additional on RFP-by-opportunity | list RFPs with `opportunityId` | **A** | `rfp_rfps_opportunity`; 123 FK is integrity, not a new lookup index |
| I-04 | (none) additional on active Programme-by-RFP | `getProgrammeByRfpId` | **A** | 123 unique partial index; 017 non-unique index remains |
| I-05 | (none) additional on cost sheet by programme | `getCostSheetByProgrammeId` | **A** | `cost_sheets_tenant_programme` |
| I-06 | (none) additional on pending approval by sheet | `findPendingApprovalForSheet` | **A** | `com_approval_requests_cost_sheet` |
| I-07 | (none) additional on documents by RFP | `listDocumentsForRfp` | **A** | `commercial_documents_tenant_rfp` |
| I-08 | (none) additional on days by programme | `listProgrammeDays` | **A** | `prg_days_programme` |
| I-09 | (none) additional on audit sequence | `loadAuditEvents` / last hash | **A** | `audit_events_tenant_sequence` |
| I-10 | (none) additional on pending outbox drain | `hydratePendingOutboxEvents` | **A** | `outbox_events_pending` |
| I-11 | `(tenant_id, updated_at DESC) WHERE archived_at IS NULL` on `opp_opportunities` | tenant list `ORDER BY updated_at` | **B** | stage/status index does not include `updated_at`; no Production rowcount/sort cost |
| I-12 | same pattern on `rfp_rfps` | tenant RFP list | **B** | same limitation |
| I-13 | same pattern on `prg_programmes` | tenant programme list | **B** | tenant/rfp indexes do not include `updated_at` or `status` |
| I-14 | `opp_opportunities (tenant_id, organization_id) WHERE archived_at IS NULL` | list by organization | **B** | optional filter exists; no selectivity evidence |
| I-15 | `cost_sheets (tenant_id, rfp_id) WHERE archived_at IS NULL` | list cost sheets by RFP | **B** | optional `rfpId` filter; existing index is programme-led |
| I-16 | `prg_items (tenant_id, programme_id, sort_order)` | list items by programme | **B** | current index is day-led; items still have `programme_id` column; no volume evidence |
| I-17 | `audit_events (tenant_id, resource_id)` | verification/test lookups by resource | **B** | persist path loads by `tenant_id`+`sequence`; resource_id appears in Gate B verification/integration SQL, not the product list API |
| I-18 | `outbox_events (tenant_id, status, created_at)` or `(aggregate_id)` | tenant pending count / aggregate lookup | **B** | drain already has pending partial index; `aggregate_id` used in verification cleanup |
| I-20 | `com_approval_requests (tenant_id, status)` | pending count by tenant | **B** | existing indexes are `(tenant_id, cost_sheet_id, status)` and `(tenant_id, rfp_id, status)` |
| I-21 | include `created_at DESC` on `commercial_documents_tenant_rfp` | `listDocumentsForRfp` order | **B** | predicate already indexed; sort column is not |
| I-22 | `(tenant_id, updated_at DESC)` on commercial list tables, by analogy with CRM 036/037 | tenant lists | **B** | CRM already has this shape; commercial tables do not. Analogy is not Production selectivity |
| I-23 | additional CRM tenant+updated / name indexes | CRM tenant listing/search | **A** | 009/036/037 already exist |
| I-24 | new CRM indexes for unscoped `ORDER BY created_at` hydrate | `pg-repository` full-table CRM loads | **D** | not a tenant Production list; not item-4 commercial scope |
| I-19 | Unnamed “Production query-plan indexes” from the original backlog text | unspecified | **D** | no named objects; cannot be a migration |

Write overhead for I-11–I-22 is **not** measured. Each extra btree would maintain on insert/update/archive of the parent table. That cost is a reason **not** to treat B as C without workload evidence.

**Category C count: 0.**

No candidate is promoted from B to C. Plausible btree shapes are not Production requirements.

---

## 6. Redundancy analysis

`prg_programmes_tenant_rfp` (017, non-unique) and `prg_programmes_tenant_active_rfp` (123, unique) use the **same** leading columns `(tenant_id, rfp_id)` and the **same** predicate `archived_at IS NULL`.

For active-row lookup (`getProgrammeByRfpId`, list with `rfpId`), PostgreSQL can use the unique index. The non-unique index is therefore redundant as a lookup structure for those predicates. It is **not** redundant as a governance object: owner authorization required it to **remain**. This assessment does **not** propose dropping, merging, or altering either index.

`rfp_rfps_opportunity` is not made redundant by `rfp_rfps_opportunity_id_fkey`. A foreign key is not a btree. The existing `(tenant_id, opportunity_id)` index remains the lookup support for tenant-scoped opportunity filters.

Partial `WHERE archived_at IS NULL` indexes do **not** cover queries that omit that predicate. Coded commercial get/list functions include `archived_at IS NULL` except approval lists (no archive column on `com_approval_requests`) and document lists (status predicate instead).

---

## 7. Production-evidence limitations

The following were **not** available and are **not** invented:

- Production or UAT row counts, cardinality, or histogram statistics
- Production query frequency or traffic mix
- `EXPLAIN` / `EXPLAIN ANALYZE` of any instance
- measured latency or buffer hit ratios
- evidence that list `ORDER BY updated_at DESC` currently sorts a large set
- evidence that `prg_items` by `programme_id` is a hot path at scale

Dev/Test Gate-B counts from migration-123 evidence (opp/rfp/prg **0**; tenants **2**; principals **6**; audit **93**) describe a disposable instance. They are **not** Production selectivity evidence.

Schema evidence and application SQL evidence are the only bases used here.

---

## 8. Recommendation by candidate

| ID | Recommendation |
| --- | --- |
| I-01–I-10, I-23 | **Existing support** — do not add a duplicate index |
| I-11–I-18, I-20–I-22 | **Potential candidate** — may be reconsidered only after named Production (or authorized lab) plan evidence |
| I-19, I-24 | **Not justified by current evidence** |

Do not authorize a migration that creates I-11–I-22 from this file.

---

## 9. Gate C item 4 disposition

Item 4 **cannot** be treated as:

- resolved by proving that Production needs no further indexes forever; or
- ready for a bounded index-creation migration.

Item 4 **is**:

- **not resolved** as a closed Gate C requirement;
- **not** an evidence-supported Production index list;
- **supported in the repository** for the coded commercial lookup/list shapes by **existing** PK/unique/partial indexes plus migration 123’s unique active Programme index;
- **requiring additional Production (or separately authorized laboratory plan) evidence** before any new named index can be classified **C**;
- **requiring a future bounded design** only if that later evidence names specific indexes, predicates, and a target environment.

A future migration authorization for item 4 is **not** justified now.

---

## 10. Database-change statement

**No database was contacted.**  
**No DDL or DML was executed.**  
**No migration file was created or modified.**  
**Migration 123 was not re-run.**  
**`schema_migrations` was not created or written.**  
**Application, tests, runner, Docker, and infrastructure were not modified.**

Operator identity: **REQUIRES HUMAN**

---

## 11. Next governed action

Do **not** authorize Production indexes, UAT, Production migration, or Production access from this assessment.

Gate C remains **OPEN**. Remaining separately authorized work still includes item 4 (pending Production evidence), items 5–7, UAT, and Production.

**STOP.**
