-- I17 BCM backup evidence (Development/Test).
-- Evidence register only. No backup appliance, vendor, hot site, or production copy.

CREATE TABLE IF NOT EXISTS bcm_backup_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  job_code TEXT NOT NULL,
  backup_date DATE NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, job_code),
  UNIQUE (tenant_id, backup_date)
);

CREATE INDEX IF NOT EXISTS bcm_backup_jobs_tenant_status
  ON bcm_backup_jobs (tenant_id, status);

CREATE TABLE IF NOT EXISTS bcm_restore_probes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  job_id UUID NOT NULL REFERENCES bcm_backup_jobs (id),
  probe_code TEXT NOT NULL,
  outcome TEXT NOT NULL
    CHECK (outcome IN ('passed', 'failed')),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, probe_code)
);

CREATE INDEX IF NOT EXISTS bcm_restore_probes_tenant_job
  ON bcm_restore_probes (tenant_id, job_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('bcm', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
