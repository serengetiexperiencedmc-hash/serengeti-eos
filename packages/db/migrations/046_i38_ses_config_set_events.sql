-- I3.8 SES configuration-set event types (Development/Test).

ALTER TABLE notif_email_delivery_events DROP CONSTRAINT IF EXISTS notif_email_delivery_events_event_type_check;
ALTER TABLE notif_email_delivery_events
  ADD CONSTRAINT notif_email_delivery_events_event_type_check
  CHECK (event_type IN ('bounce', 'complaint', 'delivery', 'reject', 'open', 'click'));

ALTER TABLE notif_email_outbox DROP CONSTRAINT IF EXISTS notif_email_outbox_status_check;
ALTER TABLE notif_email_outbox
  ADD CONSTRAINT notif_email_outbox_status_check
  CHECK (status IN ('queued', 'sent', 'failed', 'bounced', 'complained', 'delivered', 'rejected'));
