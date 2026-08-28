-- PR2 SourcingEvent Catalogue (Development/Test).
-- Human catalogue that a sourcing event exists, or was retired.
-- Existence register only. Not an RFQ, tender, bidding, scoring, auction,
-- award, discovery, onboarding, or purchasing engine.
-- No FK to procurement_records or C4 suppliers.
-- Authorized migration number is the next unused file after committed
-- 117_pr1_procurement_records.sql. Do not use uncommitted PQL drafts (109–115).

CREATE TABLE IF NOT EXISTS sourcing_event_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'retired')),
  notes TEXT,
  owner_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS sourcing_event_records_tenant_status
  ON sourcing_event_records (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('sourcing-event-records', 2, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
