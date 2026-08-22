-- I4.3 processed_events dual-write persistence (Development/Test).
-- Runtime insert on idempotent consume + hydrate on startup when EOS_DATABASE_URL set.

CREATE INDEX IF NOT EXISTS processed_events_tenant_consumer
  ON processed_events (tenant_id, consumer, processed_at DESC);
