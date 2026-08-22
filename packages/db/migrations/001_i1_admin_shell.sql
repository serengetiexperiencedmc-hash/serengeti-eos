-- I1 Admin Shell additive schema (Development). Not production-ready.
-- Apply after packages/db/schema.sql

ALTER TABLE org_units
  ADD COLUMN IF NOT EXISTS unit_type TEXT NOT NULL DEFAULT 'department'
    CHECK (unit_type IN ('business_unit', 'department', 'team', 'desk'));

ALTER TABLE org_units
  ADD COLUMN IF NOT EXISTS cost_center_id UUID;

ALTER TABLE org_units
  ADD COLUMN IF NOT EXISTS location_id UUID;

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  country_code TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  row_version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  row_version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID NOT NULL REFERENCES groups (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  PRIMARY KEY (group_id, principal_id)
);

ALTER TABLE principals
  ADD COLUMN IF NOT EXISTS external_subject_id TEXT;

ALTER TABLE principals
  ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS principals_external_subject
  ON principals (tenant_id, external_subject_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('admin', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
