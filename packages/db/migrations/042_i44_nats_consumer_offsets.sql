-- I4.4 NATS JetStream consumer offset persistence (Development/Test).

CREATE TABLE IF NOT EXISTS nats_consumer_offsets (
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  consumer TEXT NOT NULL,
  stream TEXT NOT NULL,
  last_stream_seq BIGINT NOT NULL DEFAULT 0,
  last_event_id UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, consumer, stream)
);

CREATE INDEX IF NOT EXISTS nats_consumer_offsets_stream
  ON nats_consumer_offsets (stream, updated_at DESC);
