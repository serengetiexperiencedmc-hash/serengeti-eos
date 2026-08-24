-- I19 Knowledge / Search (Development/Test).
-- Tenant-scoped documents with authority states. Not a graph database. Not an external search index.

CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  doc_code TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  document_type TEXT NOT NULL
    CHECK (document_type IN ('policy', 'sop', 'note')),
  authority_state TEXT NOT NULL DEFAULT 'draft'
    CHECK (authority_state IN ('draft', 'authoritative', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, doc_code)
);

CREATE INDEX IF NOT EXISTS knowledge_documents_tenant_state
  ON knowledge_documents (tenant_id, authority_state);

CREATE INDEX IF NOT EXISTS knowledge_documents_tenant_type
  ON knowledge_documents (tenant_id, document_type);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('knowledge', 5, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
