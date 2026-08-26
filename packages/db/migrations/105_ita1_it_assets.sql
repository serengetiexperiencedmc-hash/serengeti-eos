-- ITA1 IT asset register (Development/Test).
-- Human asset-register labels only. No discovery, UEM, license engine,
-- endpoint inventory, CMDB mutation, or I11/ITC1/ITP1/ITR1 linkage.

CREATE TABLE IF NOT EXISTS it_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  asset_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, asset_code)
);

CREATE INDEX IF NOT EXISTS it_assets_tenant_status
  ON it_assets (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('it-assets', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
