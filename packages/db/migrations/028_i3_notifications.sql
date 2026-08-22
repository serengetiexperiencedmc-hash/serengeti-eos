-- I3 Notifications — in-app alerts (Development/Test).

CREATE TABLE IF NOT EXISTS notif_dismissals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  principal_id UUID NOT NULL REFERENCES principals (id),
  notification_key TEXT NOT NULL,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, principal_id, notification_key)
);

CREATE INDEX IF NOT EXISTS notif_dismissals_principal ON notif_dismissals (tenant_id, principal_id);
