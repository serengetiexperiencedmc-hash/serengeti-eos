-- I3.28 — persist stale allowlist dual digest snooze/ack per tenant

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_stale_suppression (
  tenant_id UUID PRIMARY KEY,
  acknowledged_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL
);
