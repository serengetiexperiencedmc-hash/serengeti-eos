-- K1 Crisis decision log (Development/Test).
-- Decision register only. No I18 case/timeline mutation, emcomms, or exercises.

CREATE TABLE IF NOT EXISTS crisis_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  decision_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'recorded'
    CHECK (status IN ('recorded', 'superseded')),
  options TEXT,
  chosen_action TEXT,
  rationale TEXT,
  authority_label TEXT,
  crisis_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, decision_code)
);

CREATE INDEX IF NOT EXISTS crisis_decisions_tenant_status
  ON crisis_decisions (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('crisis-decisions', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
