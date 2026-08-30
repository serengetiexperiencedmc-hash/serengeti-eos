-- CD Phase 1 — commercial document metadata (Development/Test).
-- Bytes are NOT stored in PostgreSQL; storage_ref points at DocumentStorage.

CREATE TABLE IF NOT EXISTS commercial_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  kind TEXT NOT NULL CHECK (kind IN ('rfp', 'contract', 'rate_sheet', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'superseded', 'deleted')),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  checksum_sha256 TEXT NOT NULL,
  storage_ref TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  rfp_id UUID,
  supplier_id UUID,
  contract_id UUID,
  classification TEXT NOT NULL DEFAULT 'Confidential',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS commercial_documents_tenant_rfp
  ON commercial_documents (tenant_id, rfp_id)
  WHERE rfp_id IS NOT NULL AND status = 'active';

CREATE INDEX IF NOT EXISTS commercial_documents_tenant_supplier
  ON commercial_documents (tenant_id, supplier_id)
  WHERE supplier_id IS NOT NULL AND status = 'active';

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('commercial-documents', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
