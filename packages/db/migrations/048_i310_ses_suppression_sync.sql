-- I3.10 SES account-level suppression reason (Development/Test).

ALTER TABLE notif_email_suppressions DROP CONSTRAINT IF EXISTS notif_email_suppressions_reason_check;
ALTER TABLE notif_email_suppressions
  ADD CONSTRAINT notif_email_suppressions_reason_check
  CHECK (reason IN ('bounce', 'complaint', 'reject', 'manual', 'ses_account'));
