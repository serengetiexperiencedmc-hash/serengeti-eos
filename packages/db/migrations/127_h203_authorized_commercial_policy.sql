-- H-203 authorized commercial policy (Development/Test).
-- Additive only. Does not authorize Production.
-- Encodes Owner/Commercial Director H-203 policy: 15% GM floor, 25% default markup,
-- USD 200 internal file fee, manual tax/FX, programme deposit/milestones, inclusions,
-- rooming, operational vehicle/guide defaults. Does not implement PDF/email/dispatch.

ALTER TABLE cost_sheets
  ALTER COLUMN margin_floor_percent SET DEFAULT 15;

ALTER TABLE cost_sheets
  ADD COLUMN IF NOT EXISTS file_fee_amount NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS tax_mode TEXT NOT NULL DEFAULT 'none'
    CHECK (tax_mode IN ('none', 'rate', 'amount')),
  ADD COLUMN IF NOT EXISTS tax_rate_percent NUMERIC(8, 4),
  ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fx_currency_pair TEXT,
  ADD COLUMN IF NOT EXISTS fx_rate NUMERIC(18, 8),
  ADD COLUMN IF NOT EXISTS fx_as_of_date DATE,
  ADD COLUMN IF NOT EXISTS fx_source_reference TEXT,
  ADD COLUMN IF NOT EXISTS margin_floor_exception_reason TEXT,
  ADD COLUMN IF NOT EXISTS margin_floor_exception_by_principal_id UUID REFERENCES principals (id),
  ADD COLUMN IF NOT EXISTS margin_floor_exception_at TIMESTAMPTZ;

ALTER TABLE prg_programmes
  ADD COLUMN IF NOT EXISTS deposit_percent NUMERIC(6, 2) NOT NULL DEFAULT 30
    CHECK (deposit_percent >= 0 AND deposit_percent <= 100),
  ADD COLUMN IF NOT EXISTS payment_milestones JSONB NOT NULL DEFAULT
    '[{"code":"confirmation","label":"On confirmation","percent":30},{"code":"days_before_arrival_90","label":"90 days before arrival","percent":40},{"code":"days_before_arrival_30","label":"30 days before arrival","percent":30}]'::jsonb,
  ADD COLUMN IF NOT EXISTS inclusions_text TEXT,
  ADD COLUMN IF NOT EXISTS exclusions_text TEXT,
  ADD COLUMN IF NOT EXISTS night_count_override INTEGER,
  ADD COLUMN IF NOT EXISTS night_count_override_reason TEXT,
  ADD COLUMN IF NOT EXISTS commercial_responsible_role TEXT NOT NULL DEFAULT 'commercial_director'
    CHECK (commercial_responsible_role IN ('ceo_md', 'commercial_director')),
  ADD COLUMN IF NOT EXISTS safari_vehicle_max_passengers INTEGER NOT NULL DEFAULT 6
    CHECK (safari_vehicle_max_passengers >= 1),
  ADD COLUMN IF NOT EXISTS driver_guide_max_guests INTEGER NOT NULL DEFAULT 6
    CHECK (driver_guide_max_guests >= 1),
  ADD COLUMN IF NOT EXISTS required_vehicles_override INTEGER,
  ADD COLUMN IF NOT EXISTS required_vehicles_override_reason TEXT;

CREATE TABLE IF NOT EXISTS prg_rooming_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'twin', 'double', 'triple', 'crew_staff', 'other')),
  room_count INTEGER NOT NULL CHECK (room_count >= 0),
  occupancy INTEGER CHECK (occupancy IS NULL OR occupancy >= 0),
  complimentary BOOLEAN NOT NULL DEFAULT false,
  supplement_notes TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prg_rooming_entries_programme
  ON prg_rooming_entries (tenant_id, programme_id);
