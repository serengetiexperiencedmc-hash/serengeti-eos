-- O2 Operations — Guest Manifests (Development/Test).

CREATE TABLE IF NOT EXISTS ops_manifests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  programme_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  version INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ,
  published_by_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, booking_id)
);

CREATE TABLE IF NOT EXISTS ops_manifest_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  manifest_id UUID NOT NULL REFERENCES ops_manifests (id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  email TEXT,
  rooming TEXT,
  dietary TEXT,
  mobility TEXT,
  flight_reference TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ops_manifest_entries_manifest
  ON ops_manifest_entries (tenant_id, manifest_id, sort_order);
