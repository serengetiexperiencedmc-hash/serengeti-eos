-- G1 Compliance obligations (Development/Test).
-- Obligation register only. No controls, tests, findings, or legal product.

CREATE TABLE IF NOT EXISTS compliance_obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  obligation_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_force', 'closed')),
  owner_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, obligation_code)
);

CREATE INDEX IF NOT EXISTS compliance_obligations_tenant_status
  ON compliance_obligations (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('compliance', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
