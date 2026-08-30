-- CD Phase 1 — programme / rate / RFP column extensions (Development/Test).
-- Additive only; does not alter PR1/PR2 tables.

ALTER TABLE prg_programmes
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS client_notes TEXT;

ALTER TABLE prg_items
  ADD COLUMN IF NOT EXISTS item_type TEXT
    CHECK (item_type IS NULL OR item_type IN (
      'accommodation', 'activity', 'experience', 'transport', 'flight',
      'meal', 'meeting_event', 'other'
    )),
  ADD COLUMN IF NOT EXISTS quantity NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS unit TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT
    CHECK (visibility IS NULL OR visibility IN ('internal', 'client', 'both'));

ALTER TABLE rfp_rfps
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ;

ALTER TABLE sup_rates
  ADD COLUMN IF NOT EXISTS contract_id UUID,
  ADD COLUMN IF NOT EXISTS occupancy TEXT,
  ADD COLUMN IF NOT EXISTS meal_plan TEXT,
  ADD COLUMN IF NOT EXISTS blackout_notes TEXT,
  ADD COLUMN IF NOT EXISTS supplements_notes TEXT;

CREATE TABLE IF NOT EXISTS prg_programme_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  version_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (programme_id, version_number)
);

CREATE INDEX IF NOT EXISTS prg_programme_versions_programme
  ON prg_programme_versions (tenant_id, programme_id, version_number DESC);
