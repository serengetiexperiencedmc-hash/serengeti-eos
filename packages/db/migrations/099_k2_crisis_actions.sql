-- K2 Crisis action register (Development/Test).
-- Action register only. No I18 case/timeline mutation, K1 mutation, emcomms, SLA, or principal assignment.

CREATE TABLE IF NOT EXISTS crisis_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  action_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  owner_label TEXT,
  notes TEXT,
  crisis_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, action_code)
);

CREATE INDEX IF NOT EXISTS crisis_actions_tenant_status
  ON crisis_actions (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('crisis-actions', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
