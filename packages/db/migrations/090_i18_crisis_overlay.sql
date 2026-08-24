-- I18 Crisis overlay (Development/Test).
-- Human declaration + immutable timeline only. No emcomms, exercises, or second incident model.

CREATE TABLE IF NOT EXISTS crisis_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  crisis_code TEXT NOT NULL,
  title TEXT NOT NULL,
  severity TEXT NOT NULL
    CHECK (severity IN ('l2', 'l3')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed')),
  commander_label TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, crisis_code)
);

CREATE INDEX IF NOT EXISTS crisis_cases_tenant_status
  ON crisis_cases (tenant_id, status);

CREATE TABLE IF NOT EXISTS crisis_timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  crisis_id UUID NOT NULL REFERENCES crisis_cases (id),
  entry_code TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by_principal_id UUID REFERENCES principals (id),
  updated_by_principal_id UUID REFERENCES principals (id),
  UNIQUE (tenant_id, entry_code)
);

CREATE INDEX IF NOT EXISTS crisis_timeline_entries_tenant_crisis
  ON crisis_timeline_entries (tenant_id, crisis_id);

INSERT INTO schema_registry (context_key, phase, status) VALUES
  ('crisis', 4, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';
