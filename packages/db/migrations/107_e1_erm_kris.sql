-- E1 KRI register (Development/Test).
-- Human KRI-register labels only. No formulas, units, targets, thresholds,
-- RAG, measurements, time-series, dashboards, alerting, scoring, scheduled
-- jobs, Treatment Register, or I15 mutation. risk_id is a nullable identifier
-- only — no foreign-key cascade to erm_risks.

CREATE TABLE IF NOT EXISTS erm_kris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  kri_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'retired')),
  notes TEXT,
  owner_label TEXT,
  risk_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, kri_code)
);

CREATE INDEX IF NOT EXISTS erm_kris_tenant_status
  ON erm_kris (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('erm-kris', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
