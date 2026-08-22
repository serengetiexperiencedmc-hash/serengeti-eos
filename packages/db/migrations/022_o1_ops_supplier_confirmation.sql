-- O1 Operations — Supplier Confirmations (Development/Test).

CREATE TABLE IF NOT EXISTS ops_supplier_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  programme_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  programme_item_id UUID,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'declined')),
  supplier_reference TEXT,
  notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  responded_by_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (booking_id, supplier_id, programme_item_id)
);

CREATE INDEX IF NOT EXISTS ops_supplier_confirmations_booking
  ON ops_supplier_confirmations (tenant_id, booking_id);
