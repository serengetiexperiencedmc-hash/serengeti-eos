-- Serengeti EOS Increment 0 kernel schema
-- Not production-ready. No live data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('internal', 'partner')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  name TEXT NOT NULL,
  legal_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  row_version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE org_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  organisation_id UUID NOT NULL REFERENCES organisations (id),
  parent_id UUID REFERENCES org_units (id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  row_version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, code)
);

CREATE TABLE principals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('Human', 'Service', 'AiAgent')),
  email TEXT,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'deprovisioned')),
  org_unit_id UUID REFERENCES org_units (id),
  classification_clearance TEXT NOT NULL DEFAULT 'Internal'
    CHECK (classification_clearance IN ('Public', 'Internal', 'Confidential', 'Restricted', 'HighlyRestricted')),
  owner_principal_id UUID REFERENCES principals (id),
  autonomy_level INTEGER CHECK (autonomy_level BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID,
  updated_by_principal_id UUID,
  row_version INTEGER NOT NULL DEFAULT 1,
  deprovisioned_at TIMESTAMPTZ
);

CREATE TABLE principal_credentials (
  principal_id UUID PRIMARY KEY REFERENCES principals (id),
  password_hash TEXT NOT NULL,
  algorithm TEXT NOT NULL DEFAULT 'scrypt',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE (tenant_id, key)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles (id),
  permission_id UUID NOT NULL REFERENCES permissions (id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE principal_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  role_id UUID NOT NULL REFERENCES roles (id),
  scope_org_unit_id UUID REFERENCES org_units (id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  granted_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE abac_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  version INTEGER NOT NULL,
  effect TEXT NOT NULL CHECK (effect IN ('allow', 'deny')),
  body JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'approved', 'retired')),
  UNIQUE (tenant_id, key, version)
);

CREATE TABLE sod_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  action_a TEXT NOT NULL,
  action_b TEXT NOT NULL,
  same_object BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL CHECK (status IN ('draft', 'approved', 'retired')),
  UNIQUE (tenant_id, key)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  token_id TEXT NOT NULL UNIQUE
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('Human', 'Service', 'AiAgent')),
  actor_principal_id UUID REFERENCES principals (id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  correlation_id UUID NOT NULL,
  authorization TEXT NOT NULL CHECK (authorization IN ('allow', 'deny')),
  previous_state JSONB,
  new_state JSONB,
  evidence JSONB,
  prev_hash TEXT NOT NULL,
  row_hash TEXT NOT NULL,
  sequence BIGINT GENERATED ALWAYS AS IDENTITY
);

CREATE UNIQUE INDEX audit_events_tenant_sequence ON audit_events (tenant_id, sequence);

CREATE OR REPLACE FUNCTION audit_events_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_events are insert-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION audit_events_immutable();

CREATE TABLE config_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  classification TEXT NOT NULL,
  owner_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, key)
);

CREATE TABLE config_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_item_id UUID NOT NULL REFERENCES config_items (id),
  version INTEGER NOT NULL,
  value JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'approved', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  approved_by_principal_id UUID REFERENCES principals (id),
  approved_at TIMESTAMPTZ,
  UNIQUE (config_item_id, version)
);

CREATE TABLE approval_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  action_class TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'escalated', 'expired')),
  requested_by_principal_id UUID NOT NULL REFERENCES principals (id),
  assigned_to_principal_id UUID REFERENCES principals (id),
  decision_by_principal_id UUID REFERENCES principals (id),
  decision_at TIMESTAMPTZ,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  classification TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE idempotency_keys (
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, key)
);

CREATE TABLE schema_registry (
  context_key TEXT PRIMARY KEY,
  phase INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'active'))
);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('identity', 1, 'active'),
  ('org', 1, 'active'),
  ('audit', 1, 'active'),
  ('config', 1, 'active'),
  ('workflow', 1, 'planned'),
  ('crm', 2, 'planned'),
  ('mice', 2, 'planned'),
  ('finance', 2, 'planned');
