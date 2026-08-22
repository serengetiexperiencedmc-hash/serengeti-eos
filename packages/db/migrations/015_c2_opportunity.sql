-- C2 Opportunity / Pipeline schema (Development/Test).

CREATE TABLE IF NOT EXISTS opp_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  opportunity_code TEXT NOT NULL,
  title TEXT NOT NULL,
  organization_id UUID NOT NULL,
  account_id UUID,
  stage TEXT NOT NULL CHECK (stage IN (
    'new_qualified', 'rfp_received', 'proposal_sent', 'negotiation', 'won', 'lost'
  )),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost', 'archived')),
  programme_summary TEXT,
  estimated_value NUMERIC(14, 2),
  currency TEXT,
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  expected_close_date DATE,
  owner_principal_id UUID NOT NULL REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, opportunity_code)
);

CREATE INDEX IF NOT EXISTS opp_opportunities_tenant_stage
  ON opp_opportunities (tenant_id, stage, status)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS opp_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  opportunity_id UUID NOT NULL REFERENCES opp_opportunities (id),
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by_principal_id UUID REFERENCES principals (id),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS opp_stage_history_opportunity
  ON opp_stage_history (tenant_id, opportunity_id, changed_at DESC);
