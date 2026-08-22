-- I9 Operations — Field offline sync (Development/Test).

CREATE TABLE IF NOT EXISTS ops_field_sync_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  device_id TEXT NOT NULL,
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  last_sync_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cache_expires_at TIMESTAMPTZ NOT NULL,
  policy_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, principal_id, device_id, booking_id)
);

CREATE TABLE IF NOT EXISTS ops_sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  session_id UUID NOT NULL REFERENCES ops_field_sync_sessions (id),
  booking_id UUID NOT NULL REFERENCES bkg_bookings (id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('field_task', 'brief', 'manifest_entry')),
  entity_id UUID NOT NULL,
  server_version INTEGER NOT NULL,
  client_version INTEGER NOT NULL,
  server_payload JSONB NOT NULL,
  client_payload JSONB NOT NULL,
  resolution TEXT CHECK (resolution IN ('server_wins', 'client_wins', 'manual')),
  resolved_at TIMESTAMPTZ,
  resolved_by_principal_id UUID REFERENCES principals (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ops_sync_conflicts_open
  ON ops_sync_conflicts (tenant_id, booking_id)
  WHERE resolution IS NULL;
