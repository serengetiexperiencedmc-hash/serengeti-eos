-- C1.6 CRM search + duplicate detection (Development/Test).

ALTER TABLE crm_duplicate_candidates
  ADD COLUMN IF NOT EXISTS detection_rule TEXT,
  ADD COLUMN IF NOT EXISTS match_reason TEXT;

CREATE INDEX IF NOT EXISTS crm_dup_candidate_tenant_status
  ON crm_duplicate_candidates (tenant_id, status, detected_at DESC);

CREATE INDEX IF NOT EXISTS crm_org_tenant_legal_name
  ON crm_organizations (tenant_id, lower(legal_name));

CREATE INDEX IF NOT EXISTS crm_contact_tenant_email
  ON crm_contacts (tenant_id, lower(email))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS crm_account_tenant_name
  ON crm_accounts (tenant_id, lower(account_name));

UPDATE schema_registry
SET phase = 7, status = 'active'
WHERE context_key = 'crm';
