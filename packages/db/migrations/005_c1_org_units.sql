-- C1.2 Organizations + Units integrity constraints (Development/Test).
-- Adds tenant-safe uniqueness for active organizations and scoped unit names.

CREATE UNIQUE INDEX IF NOT EXISTS crm_org_tenant_active_legal_name
  ON crm_organizations (tenant_id, lower(legal_name))
  WHERE archived_at IS NULL AND merged_into_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS crm_org_unit_scoped_name
  ON crm_organization_units (
    organization_id,
    COALESCE(parent_unit_id, '00000000-0000-0000-0000-000000000000'::uuid),
    lower(name)
  );

UPDATE schema_registry
SET phase = 3, status = 'active'
WHERE context_key = 'crm';
