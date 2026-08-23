-- I20.13 — persist stale recommend snooze/ack per tenant + principal

CREATE TABLE IF NOT EXISTS ai_recommend_stale_suppression (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by_principal_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
