-- CD Phase 1 — optional hotel profile for accommodation suppliers.

CREATE TABLE IF NOT EXISTS sup_hotel_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  supplier_id UUID NOT NULL,
  property_name TEXT,
  star_rating SMALLINT CHECK (star_rating IS NULL OR (star_rating >= 1 AND star_rating <= 5)),
  room_categories TEXT[] NOT NULL DEFAULT '{}',
  meal_plans TEXT[] NOT NULL DEFAULT '{}',
  destination_label TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  classification TEXT NOT NULL DEFAULT 'Confidential',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, supplier_id)
);

CREATE INDEX IF NOT EXISTS sup_hotel_profiles_tenant
  ON sup_hotel_profiles (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('supplier-hotel-profiles', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
