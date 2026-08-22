-- C1.8 Tags + external identifiers (Development/Test).

ALTER TABLE crm_tags
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_principal_id UUID REFERENCES principals (id),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

ALTER TABLE crm_entity_tags
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_by_principal_id UUID REFERENCES principals (id);

ALTER TABLE crm_external_identifiers
  ADD COLUMN IF NOT EXISTS created_by_principal_id UUID REFERENCES principals (id);

CREATE UNIQUE INDEX IF NOT EXISTS crm_entity_tags_assignment_id
  ON crm_entity_tags (id)
  WHERE id IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_entity_tags_entity
  ON crm_entity_tags (tenant_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS crm_ext_id_lookup
  ON crm_external_identifiers (tenant_id, system_key, external_id);

UPDATE schema_registry
SET phase = 9, status = 'active'
WHERE context_key = 'crm';
