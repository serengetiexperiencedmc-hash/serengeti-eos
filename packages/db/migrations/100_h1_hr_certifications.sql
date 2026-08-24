-- H1 HR certification register (Development/Test).
-- Certification register only. No I10 employee/leave/skill mutation, payroll, LMS, or expiry automation.

CREATE TABLE IF NOT EXISTS hr_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  certification_code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'held'
    CHECK (status IN ('held', 'revoked')),
  issuer_label TEXT,
  issued_on DATE,
  expires_on DATE,
  notes TEXT,
  employee_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, certification_code)
);

CREATE INDEX IF NOT EXISTS hr_certifications_tenant_status
  ON hr_certifications (tenant_id, status);

CREATE INDEX IF NOT EXISTS hr_certifications_tenant_employee
  ON hr_certifications (tenant_id, employee_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('hr-certifications', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
