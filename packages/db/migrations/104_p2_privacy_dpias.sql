-- P2 DPIA register (Development/Test).
-- DPIA case labels only. No P1 RoPA/DSR mutation, consent, DLP, live erasure,
-- legal opinion, lawful-basis, or residual-risk engine.

CREATE TABLE IF NOT EXISTS privacy_dpias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  dpia_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, dpia_code)
);

CREATE INDEX IF NOT EXISTS privacy_dpias_tenant_status
  ON privacy_dpias (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('privacy-dpias', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
