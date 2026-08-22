-- PG.7 supplier import execute idempotency dual-write indexes (Development/Test).

CREATE INDEX IF NOT EXISTS pg7_sup_import_idem_batch
  ON sup_import_execute_idempotency (tenant_id, batch_id);
