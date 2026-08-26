-- P3 Consent Register (Development/Test).
-- Human consent-register labels only. Existence/case catalogue.
-- Not a consent-management platform, capture, notices, signatures,
-- preference centre, cookies, CMP, DLP, live erasure, or P1/P2 linkage.
-- Authorized migration number is the next unused file after committed
-- 109_ite1_it_endpoints.sql. Do not use local uncommitted PQL drafts.

CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  consent_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, consent_code)
);

CREATE INDEX IF NOT EXISTS consent_records_tenant_status
  ON consent_records (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('consent-register', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
