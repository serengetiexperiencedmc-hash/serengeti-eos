-- I11 ITSM + CMDB (Development/Test).
-- Tickets and configuration items. Discovery is out of scope.

CREATE TABLE IF NOT EXISTS cmdb_cis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  ci_code TEXT NOT NULL,
  name TEXT NOT NULL,
  ci_class TEXT NOT NULL
    CHECK (ci_class IN (
      'business_service', 'technical_service', 'application', 'database',
      'host_cluster', 'network_zone', 'endpoint', 'integration',
      'knowledge_source', 'ai_system'
    )),
  lifecycle TEXT NOT NULL DEFAULT 'planned'
    CHECK (lifecycle IN ('planned', 'active', 'maintenance', 'retired')),
  environment TEXT NOT NULL DEFAULT 'development'
    CHECK (environment IN ('development', 'test', 'staging', 'production')),
  criticality TEXT NOT NULL DEFAULT 'medium'
    CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  classification TEXT NOT NULL DEFAULT 'Internal',
  source_of_truth TEXT NOT NULL DEFAULT 'manual' CHECK (source_of_truth = 'manual'),
  owner_name TEXT,
  custodian_name TEXT,
  rto_minutes INTEGER CHECK (rto_minutes IS NULL OR rto_minutes >= 0),
  rpo_minutes INTEGER CHECK (rpo_minutes IS NULL OR rpo_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, ci_code)
);

CREATE UNIQUE INDEX IF NOT EXISTS cmdb_cis_tenant_name
  ON cmdb_cis (tenant_id, lower(name));

CREATE INDEX IF NOT EXISTS cmdb_cis_tenant_class
  ON cmdb_cis (tenant_id, ci_class);

CREATE TABLE IF NOT EXISTS cmdb_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  from_ci_id UUID NOT NULL REFERENCES cmdb_cis (id),
  to_ci_id UUID NOT NULL REFERENCES cmdb_cis (id),
  rel_type TEXT NOT NULL
    CHECK (rel_type IN (
      'runs_on', 'depends_on', 'connects_to', 'backed_up_by',
      'monitored_by', 'owned_by', 'provides'
    )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  CHECK (from_ci_id <> to_ci_id),
  UNIQUE (tenant_id, from_ci_id, to_ci_id, rel_type)
);

CREATE TABLE IF NOT EXISTS itsm_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  ticket_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('incident', 'request')),
  severity TEXT NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'triaged', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled')),
  assigned_principal_id UUID REFERENCES principals (id),
  environment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, ticket_code)
);

CREATE INDEX IF NOT EXISTS itsm_tickets_tenant_status
  ON itsm_tickets (tenant_id, status);

CREATE TABLE IF NOT EXISTS itsm_ticket_cis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  ticket_id UUID NOT NULL REFERENCES itsm_tickets (id),
  ci_id UUID NOT NULL REFERENCES cmdb_cis (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ticket_id, ci_id)
);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('itsm', 3, 'active'),
  ('cmdb', 3, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
