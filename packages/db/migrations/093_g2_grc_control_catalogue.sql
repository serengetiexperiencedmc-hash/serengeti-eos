-- G2 GRC Control Catalogue (Development/Test).
-- Control catalogue only. No findings, tests, mapping engine, or G1 mutations.

CREATE TABLE IF NOT EXISTS grc_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  control_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'retired')),
  description TEXT,
  owner_label TEXT,
  obligation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, control_code)
);

CREATE INDEX IF NOT EXISTS grc_controls_tenant_status
  ON grc_controls (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('grc', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
