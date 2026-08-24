-- I16 Internal Audit (Development/Test).
-- Engagements and workpapers only. No Opinion aggregate. No evidence object store.

CREATE TABLE IF NOT EXISTS ia_engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  engagement_code TEXT NOT NULL,
  title TEXT NOT NULL,
  objective TEXT,
  owner_label TEXT,
  status TEXT NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, engagement_code)
);

CREATE INDEX IF NOT EXISTS ia_engagements_tenant_status
  ON ia_engagements (tenant_id, status);

CREATE TABLE IF NOT EXISTS ia_workpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  engagement_id UUID NOT NULL REFERENCES ia_engagements (id),
  workpaper_code TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'finalized')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, workpaper_code)
);

CREATE INDEX IF NOT EXISTS ia_workpapers_tenant_engagement
  ON ia_workpapers (tenant_id, engagement_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('audit-ia', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
