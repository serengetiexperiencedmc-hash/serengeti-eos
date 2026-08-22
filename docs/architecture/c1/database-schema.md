# C1 — Database Schema Design

**Status:** Proposed — migration `004_c1_crm.sql` on implementation  
**Context:** `crm` bounded context (table prefix `crm_` in modular monolith)

## Tables

| Table | Purpose |
| --- | --- |
| `crm_organization_types` | Configurable type catalogue |
| `crm_relationship_types` | Configurable relationship types |
| `crm_organizations` | Organization master |
| `crm_organization_units` | Hierarchy within org |
| `crm_contacts` | Contact master |
| `crm_relationships` | First-class relationships |
| `crm_accounts` | Commercial account view |
| `crm_activities` | Structured activities |
| `crm_notes` | Annotations |
| `crm_tasks` | CRM tasks (distinct from I2 workflow_tasks) |
| `crm_tags` | Tag catalogue |
| `crm_entity_tags` | Junction |
| `crm_external_identifiers` | External refs + provenance |
| `crm_duplicate_candidates` | Duplicate review queue |
| `crm_merge_records` | Merge audit/provenance |
| `crm_import_batches` | Future bulk import tracking |

## Key constraints

- Every table: `tenant_id NOT NULL REFERENCES tenants(id)`
- FK to `principals` for owners, created_by, updated_by
- `crm_organizations.version INTEGER NOT NULL DEFAULT 1` (optimistic lock)
- `merged_into_id UUID REFERENCES crm_organizations(id)` nullable
- `archived_at TIMESTAMPTZ` nullable — no hard delete by default
- Unique partial indexes where appropriate: `(tenant_id, lower(domain)) WHERE archived_at IS NULL`

## Indexes (minimum)

```sql
CREATE INDEX crm_org_tenant_name ON crm_organizations (tenant_id, lower(legal_name));
CREATE INDEX crm_org_tenant_domain ON crm_organizations (tenant_id, domain) WHERE domain IS NOT NULL;
CREATE INDEX crm_contact_tenant_email ON crm_contacts (tenant_id, lower(email)) WHERE email IS NOT NULL;
CREATE INDEX crm_activity_tenant_occurred ON crm_activities (tenant_id, occurred_at DESC);
CREATE INDEX crm_ext_id_lookup ON crm_external_identifiers (tenant_id, system_key, external_id);
```

## Provenance columns (organizations example)

```sql
import_batch_id UUID REFERENCES crm_import_batches(id),
source_system TEXT,
source_record_id TEXT,
imported_at TIMESTAMPTZ,
verification_status TEXT CHECK (verification_status IN ('unverified','partial','verified')),
data_quality_status TEXT NOT NULL DEFAULT 'unverified'
```

## schema_registry

```sql
UPDATE schema_registry SET status = 'active', phase = 2 WHERE context_key = 'crm';
```

## Separation from I1

No FK from `crm_organizations` to I1 `org_units`. CRM customer orgs are a separate domain.

## Events + outbox

Domain mutations call existing `commitWithOutbox` — outbox row in same logical transaction as CRM insert/update.
