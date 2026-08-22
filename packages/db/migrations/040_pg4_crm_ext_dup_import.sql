-- PG.4 CRM external identifiers, duplicate candidates, import batches dual-write (Development/Test).

CREATE INDEX IF NOT EXISTS pg4_crm_ext_id_tenant_entity
  ON crm_external_identifiers (tenant_id, entity_type, entity_id);

CREATE INDEX IF NOT EXISTS pg4_crm_import_tenant_created
  ON crm_import_batches (tenant_id, created_at DESC);
