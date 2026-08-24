-- ITC1 IT change register (Development/Test).
-- Change register only. No I11 ticket/CI mutation, CAB, Problem, Release, Discovery, or scheduling.

CREATE TABLE IF NOT EXISTS itsm_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  change_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  ci_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, change_code)
);

CREATE INDEX IF NOT EXISTS itsm_changes_tenant_status
  ON itsm_changes (tenant_id, status);

CREATE INDEX IF NOT EXISTS itsm_changes_tenant_ci
  ON itsm_changes (tenant_id, ci_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('itsm-changes', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
