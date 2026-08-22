-- C4 Supplier Management schema (Development/Test). Not production-ready.
-- Bounded context: supplier master, rates, contacts, content blocks, bulk import.

CREATE TABLE IF NOT EXISTS sup_import_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  source_system TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'supplier', 'supplier_contact', 'supplier_rate', 'supplier_content_block'
  )),
  mode TEXT NOT NULL DEFAULT 'create_only' CHECK (mode IN ('create_only', 'upsert')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'validated', 'committed', 'failed')),
  row_count INTEGER NOT NULL DEFAULT 0,
  valid_count INTEGER,
  invalid_count INTEGER,
  committed_count INTEGER,
  csv_content TEXT,
  validation_results JSONB,
  execute_idempotency_key TEXT,
  validated_at TIMESTAMPTZ,
  committed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  committed_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS sup_import_tenant_status
  ON sup_import_batches (tenant_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS sup_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_code TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'accommodation', 'vehicle_hire', 'excursion', 'av_entertainment', 'decor',
    'catering', 'venue', 'guide_staff', 'air_charter', 'miscellaneous'
  )),
  subcategory TEXT,
  country TEXT NOT NULL,
  region TEXT,
  city TEXT,
  address TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  telephone TEXT,
  email TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_review', 'active', 'inactive', 'suspended'
  )),
  preferred_partner BOOLEAN NOT NULL DEFAULT false,
  payment_terms_days INTEGER CHECK (payment_terms_days >= 0 AND payment_terms_days <= 365),
  default_currency TEXT,
  tax_registration_number TEXT,
  contract_ref TEXT,
  contract_valid_from DATE,
  contract_valid_to DATE,
  maintained_by_principal_id UUID REFERENCES principals (id),
  notes TEXT,
  data_quality_status TEXT NOT NULL DEFAULT 'Unverified' CHECK (data_quality_status IN (
    'Unverified', 'PartiallyVerified', 'Verified', 'NeedsReview', 'Archived'
  )),
  classification TEXT NOT NULL DEFAULT 'Confidential',
  source_system TEXT,
  source_record_id TEXT,
  import_batch_id UUID REFERENCES sup_import_batches (id),
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, supplier_code)
);

CREATE INDEX IF NOT EXISTS sup_suppliers_tenant_category
  ON sup_suppliers (tenant_id, category, status)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS sup_suppliers_tenant_name
  ON sup_suppliers (tenant_id, lower(legal_name))
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sup_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_id UUID NOT NULL REFERENCES sup_suppliers (id),
  contact_role TEXT NOT NULL CHECK (contact_role IN (
    'reservations', 'operations', 'finance', 'management', 'sales', 'emergency', 'other'
  )),
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  whatsapp TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  import_batch_id UUID REFERENCES sup_import_batches (id),
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE INDEX IF NOT EXISTS sup_contacts_supplier
  ON sup_contacts (tenant_id, supplier_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sup_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_id UUID NOT NULL REFERENCES sup_suppliers (id),
  rate_code TEXT NOT NULL,
  rate_name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN (
    'per_room_per_night', 'per_person_per_night', 'per_vehicle_per_day',
    'per_person', 'flat_fee', 'per_hour', 'per_km', 'percentage'
  )),
  unit_description TEXT,
  amount NUMERIC(14, 4) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  season_label TEXT,
  min_pax INTEGER CHECK (min_pax >= 0),
  max_pax INTEGER CHECK (max_pax >= 0),
  min_nights INTEGER CHECK (min_nights >= 0),
  commission_percent NUMERIC(5, 2) CHECK (commission_percent >= 0 AND commission_percent <= 100),
  includes_tax BOOLEAN NOT NULL DEFAULT false,
  tax_percent NUMERIC(5, 2) CHECK (tax_percent >= 0 AND tax_percent <= 100),
  cancellation_policy_ref TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'active', 'expired', 'superseded'
  )),
  import_batch_id UUID REFERENCES sup_import_batches (id),
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, supplier_id, rate_code),
  CHECK (valid_to >= valid_from)
);

CREATE INDEX IF NOT EXISTS sup_rates_supplier_active
  ON sup_rates (tenant_id, supplier_id, valid_from, valid_to)
  WHERE archived_at IS NULL AND status = 'active';

CREATE TABLE IF NOT EXISTS sup_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_id UUID NOT NULL REFERENCES sup_suppliers (id),
  block_code TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN (
    'description', 'highlights', 'room_type', 'inclusions', 'exclusions',
    'location', 'programme_snippet', 'image_caption', 'terms'
  )),
  title TEXT,
  body TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  asset_filename TEXT,
  asset_alt_text TEXT,
  tags TEXT[],
  is_default BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'reviewed', 'approved', 'archived'
  )),
  import_batch_id UUID REFERENCES sup_import_batches (id),
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, supplier_id, block_code)
);

CREATE INDEX IF NOT EXISTS sup_content_supplier_type
  ON sup_content_blocks (tenant_id, supplier_id, block_type)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sup_import_execute_idempotency (
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  idempotency_key TEXT NOT NULL,
  batch_id UUID NOT NULL REFERENCES sup_import_batches (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, idempotency_key)
);

INSERT INTO schema_registry (context_key, phase, status)
VALUES ('supplier', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active', phase = 1;
