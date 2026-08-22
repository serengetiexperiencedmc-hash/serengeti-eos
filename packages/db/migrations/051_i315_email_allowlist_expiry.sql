-- I3.15 — allowlist expiry for transactional override

ALTER TABLE notif_email_allowlist
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS notif_email_allowlist_expires
  ON notif_email_allowlist (tenant_id, expires_at)
  WHERE revoked_at IS NULL AND expires_at IS NOT NULL;
