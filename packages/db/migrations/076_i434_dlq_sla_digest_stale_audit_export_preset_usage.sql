-- I4.34 — persist DLQ stale-audit export preset usage and last-used preset
-- No FK to notif_dlq_sla_digest_stale_audit_export_preset (I4.32 delete must not cascade).

CREATE TABLE IF NOT EXISTS notif_dlq_sla_digest_stale_audit_export_preset_usage (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  preset_id UUID NOT NULL,
  preset_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS notif_dlq_sla_digest_stale_audit_export_last_preset (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  preset_id UUID NOT NULL,
  preset_name TEXT NOT NULL,
  used_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
