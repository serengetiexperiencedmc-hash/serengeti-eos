-- I3.9 SES email suppression list (Development/Test).

CREATE TABLE IF NOT EXISTS notif_email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('bounce', 'complaint', 'reject', 'manual')),
  source_event_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lifted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS notif_email_suppressions_active_email
  ON notif_email_suppressions (tenant_id, lower(email))
  WHERE lifted_at IS NULL;

CREATE INDEX IF NOT EXISTS notif_email_suppressions_tenant
  ON notif_email_suppressions (tenant_id, created_at DESC);
