-- PG.3.1 CRM accounts + notes persistence indexes (Development/Test).

CREATE INDEX IF NOT EXISTS crm_account_tenant_updated ON crm_accounts (tenant_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS crm_note_tenant_updated ON crm_notes (tenant_id, updated_at DESC);
