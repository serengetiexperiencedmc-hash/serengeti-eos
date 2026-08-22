-- PG.11 supplier soft-delete: partial unique codes + archive scan indexes (Development/Test).

-- Allow reusing supplier_code / rate_code / block_code after soft-archive.
ALTER TABLE sup_suppliers DROP CONSTRAINT IF EXISTS sup_suppliers_tenant_id_supplier_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS sup_suppliers_tenant_active_code
  ON sup_suppliers (tenant_id, supplier_code)
  WHERE archived_at IS NULL;

ALTER TABLE sup_rates DROP CONSTRAINT IF EXISTS sup_rates_tenant_id_supplier_id_rate_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS sup_rates_tenant_supplier_active_code
  ON sup_rates (tenant_id, supplier_id, rate_code)
  WHERE archived_at IS NULL;

ALTER TABLE sup_content_blocks DROP CONSTRAINT IF EXISTS sup_content_blocks_tenant_id_supplier_id_block_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS sup_content_blocks_tenant_supplier_active_code
  ON sup_content_blocks (tenant_id, supplier_id, block_code)
  WHERE archived_at IS NULL;

-- Archive scan helpers
CREATE INDEX IF NOT EXISTS pg11_sup_suppliers_tenant_archived
  ON sup_suppliers (tenant_id, archived_at DESC)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS pg11_sup_contacts_tenant_archived
  ON sup_contacts (tenant_id, archived_at DESC)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS pg11_sup_rates_tenant_archived
  ON sup_rates (tenant_id, archived_at DESC)
  WHERE archived_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS pg11_sup_content_tenant_archived
  ON sup_content_blocks (tenant_id, archived_at DESC)
  WHERE archived_at IS NOT NULL;
