-- I3.2 Email notification templates (Development/Test).
-- Tenant-scoped overrides; kernel defaults apply when no row exists.

CREATE TABLE IF NOT EXISTS notif_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  template_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, template_key)
);

CREATE INDEX IF NOT EXISTS notif_email_templates_tenant ON notif_email_templates (tenant_id, template_key);
