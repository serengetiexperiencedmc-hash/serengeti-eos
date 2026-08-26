-- DG1 Dataset Register (Development/Test).
-- Human dataset-register labels only. Existence catalogue.
-- Not a Data Governance platform, Classification, Lineage, QualityRule,
-- lakehouse, catalog crawler, DLP, ingestion, or P1/P2/P3 linkage.
-- Authorized migration number is the next unused file after committed
-- 110_p3_consent_records.sql. Do not use local uncommitted PQL drafts.

CREATE TABLE IF NOT EXISTS dataset_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  dataset_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, dataset_code)
);

CREATE INDEX IF NOT EXISTS dataset_records_tenant_status
  ON dataset_records (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('dataset-register', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
