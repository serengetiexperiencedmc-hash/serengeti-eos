-- C6 Costing Engine schema (Development/Test).

CREATE TABLE IF NOT EXISTS cost_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  sheet_code TEXT NOT NULL,
  programme_id UUID NOT NULL,
  rfp_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  currency TEXT NOT NULL DEFAULT 'USD',
  markup_percent NUMERIC(6, 2),
  sell_price NUMERIC(14, 2),
  margin_floor_percent NUMERIC(6, 2) NOT NULL DEFAULT 20,
  total_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  margin_percent NUMERIC(8, 2) NOT NULL DEFAULT 0,
  margin_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  per_person NUMERIC(14, 2),
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  current_version INTEGER NOT NULL DEFAULT 1,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, sheet_code)
);

CREATE INDEX IF NOT EXISTS cost_sheets_tenant_programme
  ON cost_sheets (tenant_id, programme_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS cost_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  cost_sheet_id UUID NOT NULL REFERENCES cost_sheets (id),
  category TEXT NOT NULL CHECK (category IN (
    'accommodation', 'transport', 'activities', 'av_events', 'park_fees_misc', 'other'
  )),
  description TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit_cost NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  line_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  supplier_id UUID,
  supplier_rate_id UUID,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cost_line_items_sheet
  ON cost_line_items (tenant_id, cost_sheet_id, sort_order);

CREATE TABLE IF NOT EXISTS cost_sheet_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  cost_sheet_id UUID NOT NULL REFERENCES cost_sheets (id),
  version_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  total_cost NUMERIC(14, 2) NOT NULL,
  sell_price NUMERIC(14, 2) NOT NULL,
  margin_percent NUMERIC(8, 2) NOT NULL,
  line_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (cost_sheet_id, version_number)
);

CREATE INDEX IF NOT EXISTS cost_sheet_versions_sheet
  ON cost_sheet_versions (tenant_id, cost_sheet_id, version_number DESC);
