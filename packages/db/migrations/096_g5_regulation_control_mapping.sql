-- G5 Regulation-to-control mapping register (Development/Test).
-- Mapping register only. No sampled execution, live feeds, or G1–G4 mutations.

CREATE TABLE IF NOT EXISTS regulation_control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  mapping_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'retired')),
  description TEXT,
  owner_label TEXT,
  obligation_id UUID,
  control_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, mapping_code)
);

CREATE INDEX IF NOT EXISTS regulation_control_mappings_tenant_status
  ON regulation_control_mappings (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('mappings', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
