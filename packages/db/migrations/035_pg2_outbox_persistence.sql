-- PG.2 I4 outbox dual-write persistence (Development/Test).
-- Runtime insert on commit + hydrate/drain on startup when EOS_DATABASE_URL set.

CREATE INDEX IF NOT EXISTS outbox_events_pending ON outbox_events (status, created_at)
  WHERE status = 'pending';
