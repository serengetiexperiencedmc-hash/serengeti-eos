-- I8 Finance — Invoices & Reconciliation (Development/Test).

CREATE TABLE IF NOT EXISTS fin_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  invoice_code TEXT NOT NULL,
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  organization_id UUID NOT NULL,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('deposit', 'progress', 'final')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'void')),
  currency TEXT NOT NULL DEFAULT 'USD',
  amount NUMERIC(14, 2) NOT NULL,
  amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0,
  due_date DATE,
  issued_at TIMESTAMPTZ,
  issued_by_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, invoice_code)
);

CREATE TABLE IF NOT EXISTS fin_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  invoice_id UUID NOT NULL REFERENCES fin_invoices (id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'exception')),
  expected_amount NUMERIC(14, 2) NOT NULL,
  received_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  variance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  matched_payment_ids JSONB NOT NULL DEFAULT '[]',
  resolved_at TIMESTAMPTZ,
  resolved_by_principal_id UUID REFERENCES principals (id),
  resolution_notes TEXT,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (invoice_id)
);

CREATE INDEX IF NOT EXISTS fin_invoices_booking ON fin_invoices (tenant_id, booking_id, status);
