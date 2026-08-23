-- I4.29 — persist last-used DLQ SLA digest stale-audit export filter per tenant + principal

CREATE TABLE IF NOT EXISTS notif_dlq_sla_digest_stale_audit_export_last_filter (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  action TEXT,
  since_text TEXT,
  until_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
