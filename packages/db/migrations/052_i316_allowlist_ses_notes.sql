-- I3.16 — SES sync notes on transactional allowlist

ALTER TABLE notif_email_allowlist
  ADD COLUMN IF NOT EXISTS ses_noted_at TIMESTAMPTZ;

ALTER TABLE notif_email_allowlist
  ADD COLUMN IF NOT EXISTS ses_sync_note TEXT;
