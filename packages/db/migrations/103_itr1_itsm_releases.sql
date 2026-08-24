-- ITR1 IT release register (Development/Test).
-- Release register only. No I11 ticket/CI mutation, ITC1 change mutation, ITP1 problem mutation,
-- Release Management, deployment, CAB, windows, or scheduling.

CREATE TABLE IF NOT EXISTS itsm_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  release_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  ci_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, release_code)
);

CREATE INDEX IF NOT EXISTS itsm_releases_tenant_status
  ON itsm_releases (tenant_id, status);

CREATE INDEX IF NOT EXISTS itsm_releases_tenant_ci
  ON itsm_releases (tenant_id, ci_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('itsm-releases', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
