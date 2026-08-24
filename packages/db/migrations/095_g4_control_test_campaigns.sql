-- G4 Control-test campaign register (Development/Test).
-- Campaign register only. No mapping engine, sampled execution, or G1/G2/G3 mutations.

CREATE TABLE IF NOT EXISTS control_test_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  campaign_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'in_progress', 'closed')),
  description TEXT,
  owner_label TEXT,
  control_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, campaign_code)
);

CREATE INDEX IF NOT EXISTS control_test_campaigns_tenant_status
  ON control_test_campaigns (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('control_tests', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
