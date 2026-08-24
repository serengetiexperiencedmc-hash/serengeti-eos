-- G3 Findings register (Development/Test).
-- Findings register only. No test campaigns, mapping engine, or G1/G2 mutations.

CREATE TABLE IF NOT EXISTS finding_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  finding_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  description TEXT,
  owner_label TEXT,
  control_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, finding_code)
);

CREATE INDEX IF NOT EXISTS finding_records_tenant_status
  ON finding_records (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('findings', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
