-- PG.17 — named rate seasons catalogue

CREATE TABLE IF NOT EXISTS sup_seasons (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  season_code TEXT NOT NULL,
  label TEXT NOT NULL,
  valid_from DATE,
  valid_to DATE,
  month_from SMALLINT CHECK (month_from IS NULL OR month_from BETWEEN 1 AND 12),
  month_to SMALLINT CHECK (month_to IS NULL OR month_to BETWEEN 1 AND 12),
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS sup_seasons_active_code
  ON sup_seasons (tenant_id, lower(season_code))
  WHERE archived_at IS NULL;

ALTER TABLE sup_rates
  ADD COLUMN IF NOT EXISTS season_id UUID;
