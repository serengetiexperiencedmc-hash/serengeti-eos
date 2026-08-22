-- C1.5 Accounts + Notes + Tasks (Development/Test).

ALTER TABLE crm_accounts
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'Internal',
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by_principal_id UUID REFERENCES principals (id),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

UPDATE crm_accounts
SET created_by_principal_id = owner_principal_id,
    updated_by_principal_id = owner_principal_id
WHERE created_by_principal_id IS NULL;

ALTER TABLE crm_notes
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'Internal',
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

UPDATE crm_notes
SET updated_at = created_at,
    updated_by_principal_id = created_by_principal_id
WHERE updated_by_principal_id IS NULL;

ALTER TABLE crm_tasks
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'Internal',
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by_principal_id UUID REFERENCES principals (id);

UPDATE crm_tasks
SET updated_at = created_at,
    updated_by_principal_id = created_by_principal_id
WHERE updated_by_principal_id IS NULL;

CREATE INDEX IF NOT EXISTS crm_account_tenant_org ON crm_accounts (tenant_id, organization_id);
CREATE INDEX IF NOT EXISTS crm_account_tenant_owner ON crm_accounts (tenant_id, owner_principal_id);
CREATE INDEX IF NOT EXISTS crm_note_tenant_entity ON crm_notes (tenant_id, entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS crm_task_tenant_status ON crm_tasks (tenant_id, status, due_at);
CREATE INDEX IF NOT EXISTS crm_task_tenant_assignee ON crm_tasks (tenant_id, assignee_principal_id, status);

UPDATE schema_registry
SET phase = 6, status = 'active'
WHERE context_key = 'crm';
