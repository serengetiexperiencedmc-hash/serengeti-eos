-- C1.3 Contacts + Relationships integrity (Development/Test).

ALTER TABLE crm_contacts
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE crm_relationships
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS organization_unit_id UUID REFERENCES crm_organization_units (id),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

UPDATE crm_relationships
SET updated_by_principal_id = created_by_principal_id
WHERE updated_by_principal_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS crm_rel_contact_org_type
  ON crm_relationships (tenant_id, from_contact_id, to_organization_id, relationship_type_id, COALESCE(organization_unit_id, '00000000-0000-0000-0000-000000000000'::uuid))
  WHERE from_contact_id IS NOT NULL AND to_organization_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS crm_rel_org_org_type
  ON crm_relationships (tenant_id, from_organization_id, to_organization_id, relationship_type_id)
  WHERE from_organization_id IS NOT NULL AND to_organization_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_rel_tenant_contact ON crm_relationships (tenant_id, from_contact_id)
  WHERE from_contact_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_rel_tenant_org ON crm_relationships (tenant_id, to_organization_id)
  WHERE to_organization_id IS NOT NULL;

UPDATE schema_registry
SET phase = 4, status = 'active'
WHERE context_key = 'crm';
