-- C1 CRM Foundation schema (Development/Test). Not production-ready.
-- Bounded context: commercial customer/partner organizations (distinct from I1 internal org).

CREATE TABLE IF NOT EXISTS crm_organization_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS crm_relationship_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS crm_import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  source_system TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'validated', 'committed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS crm_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  organization_type_id UUID NOT NULL REFERENCES crm_organization_types (id),
  country TEXT,
  region TEXT,
  market TEXT,
  website TEXT,
  domain TEXT,
  primary_email TEXT,
  primary_telephone TEXT,
  address JSONB,
  status TEXT NOT NULL CHECK (status IN (
    'Prospect', 'Engaged', 'Qualified', 'Active', 'Dormant', 'Disqualified', 'Archived'
  )),
  data_quality_status TEXT NOT NULL DEFAULT 'Unverified' CHECK (data_quality_status IN (
    'Unverified', 'PartiallyVerified', 'Verified', 'NeedsReview', 'DuplicateSuspected', 'Archived'
  )),
  classification TEXT NOT NULL DEFAULT 'Internal',
  owner_principal_id UUID REFERENCES principals (id),
  source TEXT,
  source_system TEXT,
  source_record_id TEXT,
  import_batch_id UUID REFERENCES crm_import_batches (id),
  version INTEGER NOT NULL DEFAULT 1,
  merged_into_id UUID REFERENCES crm_organizations (id),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS crm_org_tenant_name ON crm_organizations (tenant_id, lower(legal_name));
CREATE INDEX IF NOT EXISTS crm_org_tenant_domain ON crm_organizations (tenant_id, domain) WHERE domain IS NOT NULL;

CREATE TABLE IF NOT EXISTS crm_organization_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  organization_id UUID NOT NULL REFERENCES crm_organizations (id),
  parent_unit_id UUID REFERENCES crm_organization_units (id),
  name TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  preferred_name TEXT,
  job_title TEXT,
  department TEXT,
  email TEXT,
  telephone TEXT,
  mobile TEXT,
  country TEXT,
  timezone TEXT,
  language TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived')),
  data_quality_status TEXT NOT NULL DEFAULT 'Unverified',
  classification TEXT NOT NULL DEFAULT 'Confidential',
  communication_preferences JSONB,
  source TEXT,
  merged_into_id UUID REFERENCES crm_contacts (id),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS crm_contact_tenant_email ON crm_contacts (tenant_id, lower(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS crm_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  relationship_type_id UUID NOT NULL REFERENCES crm_relationship_types (id),
  status TEXT NOT NULL DEFAULT 'Unknown',
  from_organization_id UUID REFERENCES crm_organizations (id),
  to_organization_id UUID REFERENCES crm_organizations (id),
  from_contact_id UUID REFERENCES crm_contacts (id),
  to_contact_id UUID REFERENCES crm_contacts (id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS crm_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  organization_id UUID NOT NULL REFERENCES crm_organizations (id),
  relationship_id UUID REFERENCES crm_relationships (id),
  account_name TEXT NOT NULL,
  owner_principal_id UUID NOT NULL REFERENCES principals (id),
  market TEXT,
  strategic_classification TEXT,
  priority TEXT,
  estimated_commercial_value NUMERIC,
  currency TEXT,
  next_action TEXT,
  status TEXT NOT NULL DEFAULT 'Prospect',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  activity_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  organization_id UUID REFERENCES crm_organizations (id),
  contact_id UUID REFERENCES crm_contacts (id),
  account_id UUID REFERENCES crm_accounts (id),
  owner_principal_id UUID NOT NULL REFERENCES principals (id),
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS crm_activity_tenant_occurred ON crm_activities (tenant_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  body TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  title TEXT NOT NULL,
  description TEXT,
  assignee_principal_id UUID NOT NULL REFERENCES principals (id),
  priority TEXT,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'InProgress', 'Completed', 'Cancelled', 'Deferred')),
  related_organization_id UUID REFERENCES crm_organizations (id),
  related_contact_id UUID REFERENCES crm_contacts (id),
  related_account_id UUID REFERENCES crm_accounts (id),
  related_activity_id UUID REFERENCES crm_activities (id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS crm_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  UNIQUE (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS crm_entity_tags (
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  tag_id UUID NOT NULL REFERENCES crm_tags (id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  PRIMARY KEY (tenant_id, tag_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS crm_external_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  system_key TEXT NOT NULL,
  external_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, system_key, external_id)
);

CREATE TABLE IF NOT EXISTS crm_duplicate_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('organization', 'contact')),
  entity_id_a UUID NOT NULL,
  entity_id_b UUID NOT NULL,
  score NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'PotentialDuplicate',
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by_principal_id UUID REFERENCES principals (id),
  review_reason TEXT
);

CREATE TABLE IF NOT EXISTS crm_merge_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('organization', 'contact')),
  survivor_id UUID NOT NULL,
  merged_ids JSONB NOT NULL,
  field_resolutions JSONB NOT NULL DEFAULT '{}'::jsonb,
  reason TEXT NOT NULL,
  merged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  merged_by_principal_id UUID NOT NULL REFERENCES principals (id)
);

INSERT INTO schema_registry (context_key, phase, status)
VALUES ('crm', 2, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active', phase = 2;
