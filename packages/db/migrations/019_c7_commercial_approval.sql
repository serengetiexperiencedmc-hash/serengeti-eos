-- C7 Commercial Approval schema (Development/Test).

CREATE TABLE IF NOT EXISTS com_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  request_code TEXT NOT NULL,
  cost_sheet_id UUID NOT NULL,
  rfp_id UUID NOT NULL,
  programme_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  gate_type TEXT NOT NULL CHECK (gate_type IN ('margin_floor', 'sell_threshold', 'standard_review')),
  gate_reason TEXT NOT NULL,
  margin_percent NUMERIC(8, 2) NOT NULL,
  margin_floor_percent NUMERIC(8, 2) NOT NULL,
  total_cost NUMERIC(14, 2) NOT NULL,
  sell_price NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  margin_meets_floor BOOLEAN NOT NULL,
  requested_by_principal_id UUID NOT NULL REFERENCES principals (id),
  decided_by_principal_id UUID REFERENCES principals (id),
  decided_at TIMESTAMPTZ,
  decision_notes TEXT,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, request_code)
);

CREATE INDEX IF NOT EXISTS com_approval_requests_cost_sheet
  ON com_approval_requests (tenant_id, cost_sheet_id, status);

CREATE INDEX IF NOT EXISTS com_approval_requests_rfp
  ON com_approval_requests (tenant_id, rfp_id, status);
