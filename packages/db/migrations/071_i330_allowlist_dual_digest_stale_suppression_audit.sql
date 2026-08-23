-- I3.30 — persist stale allowlist dual digest snooze/ack/clear audit (append-only)

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_stale_suppression_audit (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  action TEXT NOT NULL,
  snoozed_until TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS notif_allowlist_dual_digest_stale_suppression_audit_tenant_created_idx
  ON notif_allowlist_dual_digest_stale_suppression_audit (tenant_id, created_at);
