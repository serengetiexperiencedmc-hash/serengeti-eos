-- PR1 Procurement Catalogue (Development/Test).
-- Human catalogue that a purchase request and/or purchase order exists,
-- or was cancelled. Existence register only.
-- Not a sourcing, RFQ/tender, scoring, rate/costing, approval, inventory,
-- matching, invoice/AP, payment, bank, GL, or booking engine.
-- Optional supplier_id is a same-tenant C4 identifier only — no foreign-key
-- cascade and no C4 mutation. Authorized migration number is the next unused
-- file after committed 111_dg1_dataset_records.sql that does not collide with
-- uncommitted PQL drafts (109–115) and does not revive unused ITE1 draft 116.

CREATE TABLE IF NOT EXISTS procurement_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  procurement_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'cancelled')),
  notes TEXT,
  owner_label TEXT,
  supplier_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, procurement_code)
);

CREATE INDEX IF NOT EXISTS procurement_records_tenant_status
  ON procurement_records (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('procurement-records', 2, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
