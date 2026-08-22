-- I2 Workflow + Rules schema (Development). Not production-ready.

CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  owner_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS workflow_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id UUID NOT NULL REFERENCES workflow_definitions (id),
  version INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'retired')),
  graph JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  published_at TIMESTAMPTZ,
  UNIQUE (definition_id, version)
);

CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  definition_id UUID NOT NULL REFERENCES workflow_definitions (id),
  version_id UUID NOT NULL REFERENCES workflow_versions (id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'running', 'suspended', 'completed', 'cancelled', 'failed')),
  business_key TEXT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_by_principal_id UUID REFERENCES principals (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  instance_id UUID NOT NULL REFERENCES workflow_instances (id),
  node_key TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('human_approval', 'system', 'review')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'claimed', 'completed', 'rejected', 'cancelled', 'escalated', 'timed_out')),
  assignee_principal_id UUID REFERENCES principals (id),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  decision TEXT,
  reason TEXT,
  idempotency_key TEXT,
  UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT,
  owner_principal_id UUID REFERENCES principals (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS business_rule_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES business_rules (id),
  version INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'test', 'review', 'approved', 'effective', 'retired')),
  condition JSONB NOT NULL,
  result JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100,
  effective_from TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by_principal_id UUID REFERENCES principals (id),
  approved_by_principal_id UUID REFERENCES principals (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rule_id, version)
);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('workflow', 1, 'active'),
  ('rules', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
