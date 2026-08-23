-- I3.37 — persist allowlist stale-audit export preset usage and last-used preset
-- Snapshot-based. No FK to notif_allowlist_dual_digest_stale_audit_export_preset.

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_stale_audit_export_preset_usage (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  preset_id UUID NOT NULL,
  preset_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS notif_allowlist_dual_digest_stale_audit_export_last_preset (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  preset_id UUID NOT NULL,
  preset_name TEXT NOT NULL,
  used_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
