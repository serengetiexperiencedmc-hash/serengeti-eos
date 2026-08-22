-- I3.14 — transactional email allowlist (bypass suppressions)

CREATE TABLE IF NOT EXISTS notif_email_allowlist (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  revoked_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS notif_email_allowlist_active_email
  ON notif_email_allowlist (tenant_id, lower(email))
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS notif_email_allowlist_tenant
  ON notif_email_allowlist (tenant_id, created_at DESC);
