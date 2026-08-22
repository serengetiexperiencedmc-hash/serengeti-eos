-- C1.7 Controlled merge + bulk import (Development/Test).

ALTER TABLE crm_merge_records
  ADD COLUMN IF NOT EXISTS duplicate_candidate_id UUID REFERENCES crm_duplicate_candidates (id),
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS affected_counts JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE crm_import_batches
  ADD COLUMN IF NOT EXISTS entity_type TEXT CHECK (entity_type IN ('organization', 'contact')),
  ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'create_only',
  ADD COLUMN IF NOT EXISTS row_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valid_count INTEGER,
  ADD COLUMN IF NOT EXISTS invalid_count INTEGER,
  ADD COLUMN IF NOT EXISTS committed_count INTEGER,
  ADD COLUMN IF NOT EXISTS csv_content TEXT,
  ADD COLUMN IF NOT EXISTS validation_results JSONB,
  ADD COLUMN IF NOT EXISTS execute_idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS committed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS committed_by_principal_id UUID REFERENCES principals (id);

CREATE UNIQUE INDEX IF NOT EXISTS crm_merge_tenant_idempotency
  ON crm_merge_records (tenant_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_merge_tenant_survivor
  ON crm_merge_records (tenant_id, survivor_id, merged_at DESC);

CREATE INDEX IF NOT EXISTS crm_import_tenant_status
  ON crm_import_batches (tenant_id, status, created_at DESC);

UPDATE schema_registry
SET phase = 8, status = 'active'
WHERE context_key = 'crm';
