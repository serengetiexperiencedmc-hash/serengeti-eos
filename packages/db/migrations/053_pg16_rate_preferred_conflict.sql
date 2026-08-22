-- PG.16 — preferred rate flag for conflict resolution

ALTER TABLE sup_rates
  ADD COLUMN IF NOT EXISTS preferred_in_conflict BOOLEAN NOT NULL DEFAULT false;
