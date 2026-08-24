-- ITP1 IT problem register (Development/Test).
-- Problem register only. No I11 ticket/CI mutation, ITC1 change mutation, RCA, known-error, major-incident, Release, or CAB.

CREATE TABLE IF NOT EXISTS itsm_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  problem_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  ticket_id UUID,
  ci_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, problem_code)
);

CREATE INDEX IF NOT EXISTS itsm_problems_tenant_status
  ON itsm_problems (tenant_id, status);

CREATE INDEX IF NOT EXISTS itsm_problems_tenant_ticket
  ON itsm_problems (tenant_id, ticket_id);

CREATE INDEX IF NOT EXISTS itsm_problems_tenant_ci
  ON itsm_problems (tenant_id, ci_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('itsm-problems', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
