-- I3.1 Email notification outbox (Development/Test).
-- Dev/Test adapter records messages here instead of SMTP.

CREATE TABLE IF NOT EXISTS notif_email_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  notification_key TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  template_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  adapter TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, principal_id, notification_key)
);

CREATE INDEX IF NOT EXISTS notif_email_outbox_principal ON notif_email_outbox (tenant_id, principal_id, created_at DESC);
