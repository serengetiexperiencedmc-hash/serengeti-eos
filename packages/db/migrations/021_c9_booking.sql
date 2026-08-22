-- C9 Booking & Handover schema (Development/Test).

CREATE TABLE IF NOT EXISTS bkg_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_code TEXT NOT NULL,
  proposal_id UUID NOT NULL,
  rfp_id UUID NOT NULL,
  programme_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'handover_pending', 'handed_over', 'cancelled')),
  pax_count INTEGER CHECK (pax_count IS NULL OR pax_count >= 0),
  travel_dates TEXT,
  destinations TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  sell_price NUMERIC(14, 2) NOT NULL,
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  handover_completed_at TIMESTAMPTZ,
  assigned_operations_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, booking_code)
);

CREATE INDEX IF NOT EXISTS bkg_bookings_tenant_proposal
  ON bkg_bookings (tenant_id, proposal_id)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS bkg_handover_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  task_key TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  completed_by_principal_id UUID REFERENCES principals (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, task_key)
);

CREATE INDEX IF NOT EXISTS bkg_handover_tasks_booking
  ON bkg_handover_tasks (tenant_id, booking_id, sort_order);
