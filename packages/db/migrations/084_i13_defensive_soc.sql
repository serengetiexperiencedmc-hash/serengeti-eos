-- I13 Defensive SOC (Development/Test).
-- Alert ingest adapter. IR casefile is itsm_tickets (I11), not a second incident model.
-- Not a SIEM.

CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  alert_code TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source = 'devtest.webhook'),
  title TEXT NOT NULL,
  summary TEXT,
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'acknowledged', 'closed')),
  external_id TEXT,
  ci_id UUID REFERENCES cmdb_cis (id),
  ticket_id UUID REFERENCES itsm_tickets (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, alert_code)
);

CREATE UNIQUE INDEX IF NOT EXISTS security_alerts_tenant_external
  ON security_alerts (tenant_id, lower(external_id))
  WHERE external_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS security_alerts_tenant_status
  ON security_alerts (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('security', 3, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
