-- H-203 issued client document delivery (Development/Test).
-- Insert-only DEL-* authorization and DLA-* attempts for the mock provider path.
-- Does not authorize real email, SMTP, Production send, client/public access, or portal/download.

CREATE TABLE IF NOT EXISTS issued_client_document_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  delivery_code TEXT NOT NULL CHECK (delivery_code LIKE 'DEL-%'),
  kind TEXT NOT NULL DEFAULT 'issued_client_document_delivery'
    CHECK (kind = 'issued_client_document_delivery'),
  issued_client_document_id UUID NOT NULL REFERENCES issued_client_documents (id),
  document_code TEXT NOT NULL CHECK (document_code LIKE 'DOC-%'),
  issued_proposal_id UUID NOT NULL REFERENCES issued_proposals (id),
  issued_code TEXT NOT NULL CHECK (issued_code LIKE 'ISS-%'),
  programme_id UUID NOT NULL REFERENCES prg_programmes (id),
  related_organization_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_confirmed BOOLEAN NOT NULL CHECK (recipient_confirmed = true),
  sender_key TEXT NOT NULL CHECK (sender_key = 'h203.devtest.organizational_sender'),
  sender_organization_name TEXT NOT NULL CHECK (sender_organization_name = 'Serengeti Experience DMC'),
  sender_address TEXT NOT NULL CHECK (sender_address = 'noreply@sedmc.invalid'),
  sender_mode TEXT NOT NULL CHECK (sender_mode = 'devtest-mock'),
  authorization_principal_id UUID NOT NULL REFERENCES principals (id),
  authorization_authority TEXT NOT NULL CHECK (authorization_authority IN ('ceo_md', 'commercial_director', 'platform.admin')),
  authorized_at TIMESTAMPTZ NOT NULL,
  content_sha256 TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  template_version TEXT NOT NULL CHECK (template_version = 'h203-del-v1'),
  authorize_superseded_document BOOLEAN NOT NULL DEFAULT false,
  state TEXT NOT NULL DEFAULT 'queued' CHECK (state = 'queued'),
  immutable BOOLEAN NOT NULL DEFAULT true CHECK (immutable = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, delivery_code),
  UNIQUE (tenant_id, idempotency_key),
  UNIQUE (tenant_id, issued_client_document_id, recipient_email)
);

CREATE INDEX IF NOT EXISTS issued_client_document_deliveries_tenant_doc
  ON issued_client_document_deliveries (tenant_id, issued_client_document_id);

CREATE TABLE IF NOT EXISTS issued_client_document_delivery_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants (id),
  attempt_code TEXT NOT NULL CHECK (attempt_code LIKE 'DLA-%'),
  kind TEXT NOT NULL DEFAULT 'issued_client_document_delivery_attempt'
    CHECK (kind = 'issued_client_document_delivery_attempt'),
  delivery_id UUID NOT NULL REFERENCES issued_client_document_deliveries (id),
  delivery_code TEXT NOT NULL CHECK (delivery_code LIKE 'DEL-%'),
  issued_client_document_id UUID NOT NULL REFERENCES issued_client_documents (id),
  issued_proposal_id UUID NOT NULL REFERENCES issued_proposals (id),
  recipient_email TEXT NOT NULL,
  content_sha256 TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1),
  requested_at TIMESTAMPTZ NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('accepted_by_provider', 'failed', 'cancelled')),
  recipient_delivered BOOLEAN NOT NULL DEFAULT false CHECK (recipient_delivered = false),
  failure_reason TEXT,
  provider_name TEXT NOT NULL CHECK (provider_name = 'devtest-mock'),
  provider_reference TEXT,
  actor_principal_id UUID NOT NULL REFERENCES principals (id),
  immutable BOOLEAN NOT NULL DEFAULT true CHECK (immutable = true),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, attempt_code),
  UNIQUE (tenant_id, delivery_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS issued_client_document_delivery_attempts_delivery
  ON issued_client_document_delivery_attempts (tenant_id, delivery_id, attempt_number);

CREATE OR REPLACE FUNCTION issued_client_document_deliveries_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'issued_client_document_deliveries are insert-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issued_client_document_deliveries_no_update ON issued_client_document_deliveries;
CREATE TRIGGER issued_client_document_deliveries_no_update
  BEFORE UPDATE OR DELETE ON issued_client_document_deliveries
  FOR EACH ROW EXECUTE FUNCTION issued_client_document_deliveries_immutable();

CREATE OR REPLACE FUNCTION issued_client_document_delivery_attempts_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'issued_client_document_delivery_attempts are insert-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issued_client_document_delivery_attempts_no_update ON issued_client_document_delivery_attempts;
CREATE TRIGGER issued_client_document_delivery_attempts_no_update
  BEFORE UPDATE OR DELETE ON issued_client_document_delivery_attempts
  FOR EACH ROW EXECUTE FUNCTION issued_client_document_delivery_attempts_immutable();
