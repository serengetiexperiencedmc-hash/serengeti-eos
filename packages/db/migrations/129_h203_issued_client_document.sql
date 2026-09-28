-- H-203 issued client document generation (Development/Test).
-- Insert-only metadata for internal PDFs rendered from immutable ISS snapshots.
-- Bytes are NOT stored in PostgreSQL; storage_ref points at DocumentStorage.
-- Does not authorize email, dispatch, client/public access, or Production.

CREATE TABLE IF NOT EXISTS issued_client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  document_code TEXT NOT NULL CHECK (document_code LIKE 'DOC-%'),
  kind TEXT NOT NULL DEFAULT 'issued_client_pdf' CHECK (kind = 'issued_client_pdf'),
  issued_proposal_id UUID NOT NULL REFERENCES issued_proposals (id),
  issued_code TEXT NOT NULL CHECK (issued_code LIKE 'ISS-%'),
  document_type TEXT NOT NULL DEFAULT 'client_proposal_pdf' CHECK (document_type = 'client_proposal_pdf'),
  sequence INTEGER NOT NULL CHECK (sequence >= 1),
  generated_at TIMESTAMPTZ NOT NULL,
  generated_by_principal_id UUID NOT NULL REFERENCES principals (id),
  generation_context TEXT NOT NULL DEFAULT 'internal_document_generation'
    CHECK (generation_context = 'internal_document_generation'),
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status = 'generated'),
  content_sha256 TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/pdf' CHECK (mime_type = 'application/pdf'),
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
  storage_ref TEXT NOT NULL,
  client_content JSONB NOT NULL,
  immutable BOOLEAN NOT NULL DEFAULT true CHECK (immutable = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, document_code),
  UNIQUE (tenant_id, issued_proposal_id, sequence),
  CONSTRAINT issued_client_documents_content_required CHECK (
    client_content ? 'issuingEntity'
    AND client_content ? 'issuedCode'
    AND client_content ? 'clientSellingPrice'
    AND client_content ? 'currency'
    AND client_content ? 'programmeCode'
    AND client_content ? 'programmeTitle'
  ),
  CONSTRAINT issued_client_documents_content_no_internal CHECK (
    NOT (client_content ?| ARRAY[
      'supplierCost',
      'totalCost',
      'grossProfit',
      'grossMargin',
      'markupPercent',
      'fileFee',
      'fileFeeAmount',
      'taxAmount',
      'fxRate',
      'approvalRequestId',
      'costLines',
      'workflow',
      'audit'
    ])
  )
);

CREATE INDEX IF NOT EXISTS issued_client_documents_tenant_issued
  ON issued_client_documents (tenant_id, issued_proposal_id, sequence DESC);

CREATE OR REPLACE FUNCTION issued_client_documents_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'issued_client_documents are insert-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issued_client_documents_no_update ON issued_client_documents;
CREATE TRIGGER issued_client_documents_no_update
  BEFORE UPDATE OR DELETE ON issued_client_documents
  FOR EACH ROW EXECUTE FUNCTION issued_client_documents_immutable();
