-- I3.32 — persist last-used allowlist stale-audit export filter per tenant + principal

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_stale_audit_export_last_filter (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  action TEXT,
  since_text TEXT,
  until_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
