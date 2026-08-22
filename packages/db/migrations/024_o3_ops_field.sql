-- O3 Operations — Field Ops (Development/Test).

CREATE TABLE IF NOT EXISTS ops_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  programme_id UUID NOT NULL,
  principal_id UUID NOT NULL REFERENCES principals (id),
  role TEXT NOT NULL CHECK (role IN ('lead_coordinator', 'field_guide', 'logistics', 'guest_relations')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  notes TEXT,
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS ops_field_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  assignment_id UUID REFERENCES ops_assignments (id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  completed_at TIMESTAMPTZ,
  completed_by_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE TABLE IF NOT EXISTS ops_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  programme_id UUID NOT NULL,
  content TEXT NOT NULL,
  issued_at TIMESTAMPTZ,
  issued_by_principal_id UUID REFERENCES principals (id),
  classification TEXT NOT NULL DEFAULT 'Internal',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, booking_id)
);

CREATE INDEX IF NOT EXISTS ops_assignments_booking
  ON ops_assignments (tenant_id, booking_id);

CREATE INDEX IF NOT EXISTS ops_field_tasks_booking
  ON ops_field_tasks (tenant_id, booking_id, status);
