-- O6 Operational issues register (Development/Test).
-- Issue register only. No O5 workbench mutation, SLA, or autonomous remediation.

CREATE TABLE IF NOT EXISTS operational_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  issue_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  description TEXT,
  owner_label TEXT,
  booking_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, issue_code)
);

CREATE INDEX IF NOT EXISTS operational_issues_tenant_status
  ON operational_issues (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('operational-issues', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
