-- I20.19 — persist named tenant stale recommend audit export presets

CREATE TABLE IF NOT EXISTS ai_recommend_stale_audit_export_preset (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  action TEXT,
  since_text TEXT,
  until_text TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_recommend_stale_audit_export_preset_tenant_name
  ON ai_recommend_stale_audit_export_preset (tenant_id, lower(name));
