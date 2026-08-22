-- PG.3+ CRM relationships, tasks, and tags persistence indexes (Development/Test).

CREATE INDEX IF NOT EXISTS crm_relationship_tenant_updated ON crm_relationships (tenant_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS crm_task_tenant_updated ON crm_tasks (tenant_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS crm_tag_tenant_updated ON crm_tags (tenant_id, updated_at DESC);
