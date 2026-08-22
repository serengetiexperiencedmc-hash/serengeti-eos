-- C3 RFP Management schema (Development/Test).

CREATE TABLE IF NOT EXISTS rfp_rfps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  rfp_code TEXT NOT NULL,
  opportunity_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  workflow_stage TEXT NOT NULL DEFAULT 'intake' CHECK (workflow_stage IN (
    'intake', 'programme', 'costing', 'approval', 'proposal', 'sent', 'closed'
  )),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  programme_type TEXT,
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  travel_dates TEXT,
  destinations TEXT,
  budget_min NUMERIC(14, 2),
  budget_max NUMERIC(14, 2),
  currency TEXT DEFAULT 'USD',
  requirements_text TEXT,
  sla_due_at TIMESTAMPTZ,
  sla_status TEXT CHECK (sla_status IS NULL OR sla_status IN ('on_track', 'at_risk', 'breached')),
  assigned_principal_id UUID REFERENCES principals (id),
  current_version INTEGER NOT NULL DEFAULT 1,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, rfp_code)
);

CREATE INDEX IF NOT EXISTS rfp_rfps_tenant_stage
  ON rfp_rfps (tenant_id, workflow_stage, status)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS rfp_rfps_opportunity
  ON rfp_rfps (tenant_id, opportunity_id);

CREATE TABLE IF NOT EXISTS rfp_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  rfp_id UUID NOT NULL REFERENCES rfp_rfps (id),
  version_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (rfp_id, version_number)
);

CREATE INDEX IF NOT EXISTS rfp_versions_rfp
  ON rfp_versions (tenant_id, rfp_id, version_number DESC);
