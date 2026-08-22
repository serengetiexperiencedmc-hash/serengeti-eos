-- C8 Proposal Engine schema (Development/Test).

CREATE TABLE IF NOT EXISTS prop_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  proposal_code TEXT NOT NULL,
  rfp_id UUID NOT NULL,
  programme_id UUID NOT NULL,
  cost_sheet_id UUID NOT NULL,
  approval_request_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_approval', 'approved', 'sent', 'accepted', 'rejected'
  )),
  currency TEXT NOT NULL DEFAULT 'USD',
  total_cost NUMERIC(14, 2) NOT NULL,
  sell_price NUMERIC(14, 2) NOT NULL,
  margin_percent NUMERIC(6, 2) NOT NULL,
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  programme_summary TEXT,
  itinerary_day_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  client_viewed_at TIMESTAMPTZ,
  current_version INTEGER NOT NULL DEFAULT 1,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, proposal_code)
);

CREATE INDEX IF NOT EXISTS prop_proposals_tenant_rfp
  ON prop_proposals (tenant_id, rfp_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS prop_proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  proposal_id UUID NOT NULL REFERENCES prop_proposals (id),
  version_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (proposal_id, version_number)
);

CREATE INDEX IF NOT EXISTS prop_proposal_versions_proposal
  ON prop_proposal_versions (tenant_id, proposal_id, version_number DESC);
