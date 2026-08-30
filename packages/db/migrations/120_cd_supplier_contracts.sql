-- CD Phase 1 — versioned supplier/hotel contracts (Development/Test).

CREATE TABLE IF NOT EXISTS sup_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_id UUID NOT NULL,
  contract_ref TEXT NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN (
    'rate_agreement', 'allotment', 'service', 'other'
  )),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'active', 'expired', 'superseded'
  )),
  effective_from DATE,
  effective_to DATE,
  currency TEXT,
  notes TEXT,
  current_version INTEGER NOT NULL DEFAULT 1,
  classification TEXT NOT NULL DEFAULT 'Confidential',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, supplier_id, contract_ref),
  CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from)
);

CREATE INDEX IF NOT EXISTS sup_contracts_tenant_supplier
  ON sup_contracts (tenant_id, supplier_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sup_contract_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  contract_id UUID NOT NULL REFERENCES sup_contracts (id),
  version_number INTEGER NOT NULL,
  summary TEXT NOT NULL,
  document_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (contract_id, version_number)
);

CREATE INDEX IF NOT EXISTS sup_contract_versions_contract
  ON sup_contract_versions (tenant_id, contract_id, version_number DESC);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('supplier-contracts', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
