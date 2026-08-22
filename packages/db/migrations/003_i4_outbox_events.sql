-- I4 Transactional Outbox enhancements (Development/Test)
-- Does not close ADR-0006 / ADR-0012 / ADR-0013.

ALTER TABLE outbox_events
  ADD COLUMN IF NOT EXISTS envelope JSONB,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS last_error TEXT,
  ADD COLUMN IF NOT EXISTS correlation_id TEXT,
  ADD COLUMN IF NOT EXISTS aggregate_id TEXT;

ALTER TABLE outbox_events DROP CONSTRAINT IF EXISTS outbox_events_status_check;
ALTER TABLE outbox_events
  ADD CONSTRAINT outbox_events_status_check
  CHECK (status IN ('pending', 'published', 'dead_letter'));

CREATE TABLE IF NOT EXISTS event_catalogue (
  event_type TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  purpose TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  classification TEXT NOT NULL,
  producer TEXT NOT NULL,
  consumers JSONB NOT NULL DEFAULT '[]',
  retention_days INTEGER NOT NULL,
  compatibility TEXT NOT NULL CHECK (compatibility IN ('backward', 'forward', 'none')),
  lifecycle TEXT NOT NULL CHECK (lifecycle IN ('draft', 'active', 'deprecated'))
);

CREATE TABLE IF NOT EXISTS dead_letter_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outbox_id UUID NOT NULL REFERENCES outbox_events (id),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  event_type TEXT NOT NULL,
  failure_reason TEXT NOT NULL,
  consumer TEXT NOT NULL,
  attempts INTEGER NOT NULL,
  first_failure_at TIMESTAMPTZ NOT NULL,
  last_failure_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'remediated', 'replayed')),
  owner TEXT,
  remediation TEXT
);

CREATE TABLE IF NOT EXISTS processed_events (
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  consumer TEXT NOT NULL,
  event_id UUID NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, consumer, event_id)
);

INSERT INTO schema_registry (context_key, phase, status)
VALUES ('events', 1, 'active')
ON CONFLICT (context_key) DO UPDATE SET status = 'active';

UPDATE schema_registry SET status = 'active' WHERE context_key = 'workflow';
