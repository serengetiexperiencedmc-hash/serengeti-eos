-- PG.3 CRM persistence indexes (Development/Test).

CREATE INDEX IF NOT EXISTS crm_org_tenant_updated ON crm_organizations (tenant_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS crm_contact_tenant_updated ON crm_contacts (tenant_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS crm_activity_tenant_updated ON crm_activities (tenant_id, updated_at DESC);
