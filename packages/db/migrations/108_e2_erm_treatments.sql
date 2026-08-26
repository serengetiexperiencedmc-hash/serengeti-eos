-- E2 Treatment register (Development/Test).
-- Human treatment-register labels only. No formulas, measurements, units,
-- targets, thresholds, RAG, scoring, residual-risk calculation, effectiveness,
-- dates, cost, priority, strategy taxonomy, alerts, dashboards, scheduled jobs,
-- KRI linkage, or I15 mutation. risk_id is a nullable identifier only —
-- no foreign-key cascade to erm_risks.

CREATE TABLE IF NOT EXISTS erm_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  treatment_code TEXT NOT NULL,
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
  UNIQUE (tenant_id, treatment_code)
);

CREATE INDEX IF NOT EXISTS erm_treatments_tenant_status
  ON erm_treatments (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('erm-treatments', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
