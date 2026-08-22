-- PG.5 supplier import batch dual-write (Development/Test).
-- Tables from 014_c4_supplier.sql; runtime persistence added here.

CREATE INDEX IF NOT EXISTS pg5_sup_import_tenant_created
  ON sup_import_batches (tenant_id, created_at DESC);
