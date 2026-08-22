-- I4.15 — DLQ SLA acknowledge / snooze columns

ALTER TABLE dead_letter_events
  ADD COLUMN IF NOT EXISTS sla_acknowledged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_acknowledged_by_principal_id UUID,
  ADD COLUMN IF NOT EXISTS sla_snooze_until TIMESTAMPTZ;
