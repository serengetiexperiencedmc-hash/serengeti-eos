-- P1 Privacy RoPA + DSR (Development/Test).
-- Register only. No live erasure, consent platform, DPIA, or DLP.

CREATE TABLE IF NOT EXISTS privacy_processing_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  activity_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'retired')),
  purpose TEXT,
  owner_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, activity_code)
);

CREATE INDEX IF NOT EXISTS privacy_processing_activities_tenant_status
  ON privacy_processing_activities (tenant_id, status);

CREATE TABLE IF NOT EXISTS privacy_dsr_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  dsr_code TEXT NOT NULL,
  request_type TEXT NOT NULL
    CHECK (request_type IN ('access', 'erasure', 'rectification')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  subject_label TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, dsr_code)
);

CREATE INDEX IF NOT EXISTS privacy_dsr_cases_tenant_status
  ON privacy_dsr_cases (tenant_id, status);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('privacy', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
