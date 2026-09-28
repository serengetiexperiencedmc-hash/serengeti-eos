-- H-135 Phase 1 / H-136 Phase A — Dev/Test personal-data domain/schema remediation.
-- Authorized: drop guest/manifest/voucher, CRM person-contact, HR employee/leave,
-- supplier individual-contact, and DSR/consent person-identifying fields.
-- H-136 Phase A uses this same 125 file; no 126 drop migration.
-- Preserves commercial objects, principals/auth, tenant isolation.
-- Not Production. Not eos_gateb. Not the H-111 124-only `eos` catalog (CLI migrate-guard).
-- Prior migrations in this folder are forward-only CREATE/ALTER files with no down files;
-- rollback is restore-from-prior-CREATE (004/006/014/023/029/081/092/100/110), not a 125 down file.

-- ---------------------------------------------------------------------------
-- A. Guest / manifest / voucher (coupled). Guest-level voucher cannot survive
-- without guest identity (guest_name) + manifest_entry_id NOT NULL.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS ops_vouchers_booking;
DROP TABLE IF EXISTS ops_vouchers;

DROP INDEX IF EXISTS ops_manifest_entries_manifest;
DROP TABLE IF EXISTS ops_manifest_entries;

DROP TABLE IF EXISTS ops_manifests;

-- ---------------------------------------------------------------------------
-- B. CRM person-contact SoR and dependent FKs/indexes/columns.
-- Preserve crm_organizations, crm_accounts, org-org relationships, activities,
-- tasks, notes, tags (non-contact), merge/import batch tables.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS crm_rel_contact_org_type;
DROP INDEX IF EXISTS crm_rel_tenant_contact;
DROP INDEX IF EXISTS crm_contact_tenant_email;
DROP INDEX IF EXISTS crm_contact_tenant_updated;

ALTER TABLE IF EXISTS crm_relationships DROP CONSTRAINT IF EXISTS crm_relationships_from_contact_id_fkey;
ALTER TABLE IF EXISTS crm_relationships DROP CONSTRAINT IF EXISTS crm_relationships_to_contact_id_fkey;
ALTER TABLE IF EXISTS crm_activities DROP CONSTRAINT IF EXISTS crm_activities_contact_id_fkey;
ALTER TABLE IF EXISTS crm_tasks DROP CONSTRAINT IF EXISTS crm_tasks_related_contact_id_fkey;

-- Contact-only relationships cannot remain as org-org rows.
DELETE FROM crm_relationships
WHERE from_organization_id IS NULL
  AND to_organization_id IS NULL
  AND (from_contact_id IS NOT NULL OR to_contact_id IS NOT NULL);

ALTER TABLE IF EXISTS crm_relationships DROP COLUMN IF EXISTS from_contact_id;
ALTER TABLE IF EXISTS crm_relationships DROP COLUMN IF EXISTS to_contact_id;
ALTER TABLE IF EXISTS crm_activities DROP COLUMN IF EXISTS contact_id;
ALTER TABLE IF EXISTS crm_tasks DROP COLUMN IF EXISTS related_contact_id;

-- Polymorphic contact rows (no FK). Dev/Test synthetic only; required so remaining
-- CRM objects do not retain contact-entity pointers after crm_contacts is dropped.
DELETE FROM crm_notes WHERE entity_type = 'contact';
DELETE FROM crm_entity_tags WHERE entity_type = 'contact';
DELETE FROM crm_external_identifiers WHERE entity_type = 'contact';
DELETE FROM crm_duplicate_candidates WHERE entity_type = 'contact';
DELETE FROM crm_merge_records WHERE entity_type = 'contact';

ALTER TABLE IF EXISTS crm_duplicate_candidates DROP CONSTRAINT IF EXISTS crm_duplicate_candidates_entity_type_check;
ALTER TABLE IF EXISTS crm_duplicate_candidates
  ADD CONSTRAINT crm_duplicate_candidates_entity_type_check
  CHECK (entity_type IN ('organization'));

ALTER TABLE IF EXISTS crm_merge_records DROP CONSTRAINT IF EXISTS crm_merge_records_entity_type_check;
ALTER TABLE IF EXISTS crm_merge_records
  ADD CONSTRAINT crm_merge_records_entity_type_check
  CHECK (entity_type IN ('organization'));

DROP TABLE IF EXISTS crm_contacts;

ALTER TABLE IF EXISTS ai_drafts DROP COLUMN IF EXISTS related_contact_id;

-- ---------------------------------------------------------------------------
-- D. Supplier individual-contact SoR. Preserve sup_suppliers and sup_rates.
-- sup_import_batches.entity_type CHECK still lists supplier_contact (Phase 5 ingest).
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS sup_contacts_supplier;
DROP INDEX IF EXISTS pg6_sup_contacts_tenant_updated;
DROP INDEX IF EXISTS pg11_sup_contacts_tenant_archived;
DROP TABLE IF EXISTS sup_contacts;

-- ---------------------------------------------------------------------------
-- C. HR employee/leave (+ certifications/skills that cannot exist without employees).
-- Commercial objects do not FK these tables. Principals remain.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS hr_certifications_tenant_status;
DROP INDEX IF EXISTS hr_certifications_tenant_employee;
DROP TABLE IF EXISTS hr_certifications;

DROP INDEX IF EXISTS hr_leave_requests_tenant_status;
DROP TABLE IF EXISTS hr_leave_requests;

DROP TABLE IF EXISTS hr_employee_skills;

DROP INDEX IF EXISTS hr_skills_tenant_name;
DROP TABLE IF EXISTS hr_skills;

DROP INDEX IF EXISTS hr_employees_tenant_email;
DROP INDEX IF EXISTS hr_employees_tenant_principal;
DROP INDEX IF EXISTS hr_employees_tenant_status;
DROP TABLE IF EXISTS hr_employees;

-- schema.sql CHECK is ('planned','active') only. H-135 retires HR catalogue rows.
ALTER TABLE schema_registry DROP CONSTRAINT IF EXISTS schema_registry_status_check;
ALTER TABLE schema_registry
  ADD CONSTRAINT schema_registry_status_check
  CHECK (status IN ('planned', 'active', 'retired'));

UPDATE schema_registry
SET status = 'retired'
WHERE context_key IN ('hr', 'hr-certifications');

-- ---------------------------------------------------------------------------
-- E. DSR / consent person-identifying fields. Preserve processing-activity
-- catalogue and DSR/consent case registers without subject labels / consent notes.
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS privacy_dsr_cases DROP COLUMN IF EXISTS subject_label;
ALTER TABLE IF EXISTS consent_records DROP COLUMN IF EXISTS notes;
