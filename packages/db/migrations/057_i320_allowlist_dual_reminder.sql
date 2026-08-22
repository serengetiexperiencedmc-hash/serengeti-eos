-- I3.20 — dual-control reminder snooze / dismiss reason on allowlist entries

ALTER TABLE notif_email_allowlist
  ADD COLUMN IF NOT EXISTS dual_reminder_snooze_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dual_reminder_snoozed_by_principal_id UUID,
  ADD COLUMN IF NOT EXISTS dual_reminder_dismissed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dual_reminder_dismiss_reason TEXT,
  ADD COLUMN IF NOT EXISTS dual_reminder_dismissed_by_principal_id UUID;
