-- PG.6 supplier entity dual-write indexes (Development/Test).

CREATE INDEX IF NOT EXISTS pg6_sup_suppliers_tenant_updated
  ON sup_suppliers (tenant_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS pg6_sup_contacts_tenant_updated
  ON sup_contacts (tenant_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS pg6_sup_rates_tenant_updated
  ON sup_rates (tenant_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS pg6_sup_content_tenant_updated
  ON sup_content_blocks (tenant_id, updated_at DESC);
