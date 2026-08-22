-- I3.17 — dual-control for SES-noted VIP allowlist overrides

ALTER TABLE notif_email_allowlist
  ADD COLUMN IF NOT EXISTS ses_dual_control_status TEXT
    CHECK (ses_dual_control_status IS NULL OR ses_dual_control_status IN ('not_required', 'pending', 'approved')),
  ADD COLUMN IF NOT EXISTS ses_approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ses_approved_by_principal_id UUID,
  ADD COLUMN IF NOT EXISTS ses_approval_requested_by_principal_id UUID;
