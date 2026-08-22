-- C1.4 CRM Activities + interaction history (Development/Test).

CREATE TABLE IF NOT EXISTS crm_activity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

ALTER TABLE crm_activities
  ADD COLUMN IF NOT EXISTS organization_unit_id UUID REFERENCES crm_organization_units (id),
  ADD COLUMN IF NOT EXISTS relationship_id UUID REFERENCES crm_relationships (id),
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'Internal',
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

UPDATE crm_activities
SET updated_at = created_at,
    updated_by_principal_id = created_by_principal_id
WHERE updated_by_principal_id IS NULL;

CREATE INDEX IF NOT EXISTS crm_activity_tenant_contact
  ON crm_activities (tenant_id, contact_id, occurred_at DESC)
  WHERE contact_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_activity_tenant_org
  ON crm_activities (tenant_id, organization_id, occurred_at DESC)
  WHERE organization_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_activity_tenant_relationship
  ON crm_activities (tenant_id, relationship_id, occurred_at DESC)
  WHERE relationship_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_activity_tenant_unit
  ON crm_activities (tenant_id, organization_unit_id, occurred_at DESC)
  WHERE organization_unit_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_activity_tenant_type
  ON crm_activities (tenant_id, activity_type, occurred_at DESC);

UPDATE schema_registry
SET phase = 5, status = 'active'
WHERE context_key = 'crm';
