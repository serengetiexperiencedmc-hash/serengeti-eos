-- ITL1 IT license register (Development/Test).
-- Human license-register labels only. No license keys, seats, entitlements,
-- compliance, utilization, expiry/renewal, discovery, UEM, procurement,
-- or ITA1/I11 linkage.

CREATE TABLE IF NOT EXISTS it_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  license_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, license_code)
);

CREATE INDEX IF NOT EXISTS it_licenses_tenant_status
  ON it_licenses (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('it-licenses', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
