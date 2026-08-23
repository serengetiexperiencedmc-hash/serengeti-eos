-- I20.4 — persist AI draft artefacts so they survive API restart

CREATE TABLE IF NOT EXISTS ai_drafts (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  recommendation_key TEXT NOT NULL,
  artefact_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  autonomy_level SMALLINT NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_principal_id UUID NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by_principal_id UUID,
  discarded_at TIMESTAMPTZ,
  discarded_by_principal_id UUID,
  applied_entity_type TEXT,
  applied_entity_id UUID,
  related_organization_id UUID,
  related_contact_id UUID
);

CREATE INDEX IF NOT EXISTS ai_drafts_tenant_status_created_idx
  ON ai_drafts (tenant_id, status, created_at DESC);
