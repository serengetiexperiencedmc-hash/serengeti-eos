-- ITE1 IT endpoint register (Development/Test).
-- Human endpoint-register labels only. No serial, hostname, IP, MAC,
-- last-seen, discovery, UEM, MDM, EDR, fleet control, or ITA1/ITL1/I11 linkage.
-- Authorized migration number is the next unused file after committed
-- 108_e2_erm_treatments.sql. Do not use local draft number 116.

CREATE TABLE IF NOT EXISTS it_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  endpoint_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, endpoint_code)
);

CREATE INDEX IF NOT EXISTS it_endpoints_tenant_status
  ON it_endpoints (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('it-endpoints', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
