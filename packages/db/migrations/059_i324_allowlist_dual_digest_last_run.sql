-- I3.24 — persist allowlist dual-control digest last-run stamp per tenant

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_last_run (
  tenant_id UUID PRIMARY KEY,
  day TEXT NOT NULL,
  last_run_at TIMESTAMPTZ NOT NULL,
  last_run_by_principal_id UUID NOT NULL,
  pending_count INT NOT NULL DEFAULT 0,
  dispatched_count INT NOT NULL DEFAULT 0,
  skipped_count INT NOT NULL DEFAULT 0,
  recipient_count INT NOT NULL DEFAULT 0
);
