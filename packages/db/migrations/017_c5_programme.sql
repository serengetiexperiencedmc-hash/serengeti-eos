-- C5 Programme Builder schema (Development/Test).

CREATE TABLE IF NOT EXISTS prg_programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  programme_code TEXT NOT NULL,
  rfp_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  day_count INTEGER NOT NULL DEFAULT 0 CHECK (day_count >= 0),
  start_date DATE,
  end_date DATE,
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  destinations TEXT,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, programme_code)
);

CREATE INDEX IF NOT EXISTS prg_programmes_tenant_rfp
  ON prg_programmes (tenant_id, rfp_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS prg_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  title TEXT NOT NULL,
  location TEXT,
  calendar_date DATE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (programme_id, day_number)
);

CREATE INDEX IF NOT EXISTS prg_days_programme
  ON prg_days (tenant_id, programme_id, sort_order);

CREATE TABLE IF NOT EXISTS prg_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  day_id UUID NOT NULL REFERENCES prg_days (id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  start_time TEXT,
  title TEXT NOT NULL,
  description TEXT,
  supplier_id UUID,
  supplier_rate_id UUID,
  supplier_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prg_items_day
  ON prg_items (tenant_id, day_id, sort_order);
