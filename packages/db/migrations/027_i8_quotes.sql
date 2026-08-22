-- I8 Finance — Quotes (Development/Test).

CREATE TABLE IF NOT EXISTS fin_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  quote_code TEXT NOT NULL,
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  organization_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'expired')),
  currency TEXT NOT NULL DEFAULT 'USD',
  amount NUMERIC(14, 2) NOT NULL,
  valid_until DATE NOT NULL,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, quote_code)
);

CREATE INDEX IF NOT EXISTS fin_quotes_booking ON fin_quotes (tenant_id, booking_id, status);
