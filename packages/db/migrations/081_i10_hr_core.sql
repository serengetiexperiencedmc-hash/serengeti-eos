-- I10 HR Core (Development/Test).
-- Employee directory, skill catalogue, leave requests. Not payroll.

CREATE TABLE IF NOT EXISTS hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  employee_code TEXT NOT NULL,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  email TEXT,
  principal_id UUID REFERENCES principals (id),
  org_unit_id UUID REFERENCES org_units (id),
  location_id UUID REFERENCES locations (id),
  job_title TEXT,
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'on_leave', 'terminated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, employee_code)
);

CREATE UNIQUE INDEX IF NOT EXISTS hr_employees_tenant_email
  ON hr_employees (tenant_id, lower(email))
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS hr_employees_tenant_principal
  ON hr_employees (tenant_id, principal_id)
  WHERE principal_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS hr_employees_tenant_status
  ON hr_employees (tenant_id, status);

CREATE TABLE IF NOT EXISTS hr_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS hr_skills_tenant_name
  ON hr_skills (tenant_id, lower(name));

CREATE TABLE IF NOT EXISTS hr_employee_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  employee_id UUID NOT NULL REFERENCES hr_employees (id),
  skill_id UUID NOT NULL REFERENCES hr_skills (id),
  proficiency TEXT NOT NULL DEFAULT 'beginner'
    CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, skill_id)
);

CREATE TABLE IF NOT EXISTS hr_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  employee_id UUID NOT NULL REFERENCES hr_employees (id),
  leave_type TEXT NOT NULL
    CHECK (leave_type IN ('annual', 'sick', 'unpaid', 'compassionate')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL CHECK (days >= 1),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS hr_leave_requests_tenant_status
  ON hr_leave_requests (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('hr', 2, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
