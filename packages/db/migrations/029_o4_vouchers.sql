-- O4 Guest Vouchers (Development/Test).

CREATE TABLE IF NOT EXISTS ops_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  manifest_entry_id UUID NOT NULL,
  voucher_code TEXT NOT NULL,
  voucher_type TEXT NOT NULL CHECK (voucher_type IN ('guest_meal', 'guest_activity', 'transfer')),
  guest_name TEXT NOT NULL,
  supplier_label TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'void')),
  issued_at TIMESTAMPTZ,
  issued_by_principal_id UUID REFERENCES principals (id),
  notes TEXT,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, voucher_code)
);

CREATE INDEX IF NOT EXISTS ops_vouchers_booking ON ops_vouchers (tenant_id, booking_id, status);
