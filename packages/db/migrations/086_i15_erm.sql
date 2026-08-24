-- I15 ERM risk register (Development/Test).
-- Residual risk catalogue only. Compliance obligations and Privacy RoPA/DSR are deferred.

CREATE TABLE IF NOT EXISTS erm_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  risk_code TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  likelihood INTEGER NOT NULL DEFAULT 3 CHECK (likelihood BETWEEN 1 AND 5),
  impact INTEGER NOT NULL DEFAULT 3 CHECK (impact BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'mitigating', 'accepted', 'closed')),
  owner_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, risk_code)
);

CREATE INDEX IF NOT EXISTS erm_risks_tenant_status
  ON erm_risks (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('erm', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
