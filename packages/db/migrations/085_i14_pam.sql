-- I14 PAM (Development/Test).
-- Opaque secret references and JIT grants. Not a production vault. ADR-0012 not reopened.

CREATE TABLE IF NOT EXISTS pam_secret_refs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  ref_code TEXT NOT NULL,
  label TEXT NOT NULL,
  secret_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'retired')),
  purpose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, ref_code)
);

CREATE UNIQUE INDEX IF NOT EXISTS pam_secret_refs_tenant_active_ref
  ON pam_secret_refs (tenant_id, lower(secret_ref))
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS pam_jit_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  grant_code TEXT NOT NULL,
  subject_principal_id UUID NOT NULL REFERENCES principals (id),
  permission_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, grant_code)
);

CREATE INDEX IF NOT EXISTS pam_jit_grants_tenant_subject
  ON pam_jit_grants (tenant_id, subject_principal_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('pam', 3, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
