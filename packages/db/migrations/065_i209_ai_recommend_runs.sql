-- I20.9 — last recommend run per tenant + principal (keys only, no PII)

CREATE TABLE IF NOT EXISTS ai_recommend_runs (
  tenant_id UUID NOT NULL,
  principal_id UUID NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  provider TEXT NOT NULL,
  item_count INTEGER NOT NULL,
  keys TEXT[] NOT NULL,
  PRIMARY KEY (tenant_id, principal_id)
);
