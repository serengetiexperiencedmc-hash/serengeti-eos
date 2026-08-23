-- I20.15 — persist stale recommend snooze/ack/clear audit (append-only)

CREATE TABLE IF NOT EXISTS ai_recommend_stale_suppression_audit (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  action TEXT NOT NULL,
  snoozed_until TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_recommend_stale_suppression_audit_tenant_principal_created_idx
  ON ai_recommend_stale_suppression_audit (tenant_id, principal_id, created_at);
