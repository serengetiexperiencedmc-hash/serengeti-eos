-- I3.6 SES bounce/complaint delivery tracking (Development/Test).

ALTER TABLE notif_email_outbox DROP CONSTRAINT IF EXISTS notif_email_outbox_status_check;
ALTER TABLE notif_email_outbox
  ADD CONSTRAINT notif_email_outbox_status_check
  CHECK (status IN ('queued', 'sent', 'failed', 'bounced', 'complained'));

ALTER TABLE notif_email_outbox
  ADD COLUMN IF NOT EXISTS ses_message_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS notif_email_outbox_ses_message_id
  ON notif_email_outbox (ses_message_id)
  WHERE ses_message_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS notif_email_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants (id),
  outbox_id UUID REFERENCES notif_email_outbox (id),
  event_type TEXT NOT NULL CHECK (event_type IN ('bounce', 'complaint', 'delivery')),
  ses_message_id TEXT,
  sns_message_id TEXT,
  recipient_email TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sns_message_id)
);

CREATE INDEX IF NOT EXISTS notif_email_delivery_ses_message
  ON notif_email_delivery_events (ses_message_id)
  WHERE ses_message_id IS NOT NULL;
