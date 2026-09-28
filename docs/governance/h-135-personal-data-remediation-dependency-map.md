# H-135 — Personal-Data Remediation Dependency Map

> **ANALYSIS ONLY — CONCRETE REPOSITORY DEPENDENCY MAP**  
> Answers: if the Owner authorizes H-133 remediation, **which files, tables, APIs, UI, tests, events and caches change**.  
> This is **not** an audit, boundary policy, disposition, or remediation specification.  
> H-133 dispositions are **inputs**. They are not restated as the deliverable.  
> **No implementation.** Existing H-131/H-132/H-133/H-134 artefacts are **not modified**.

**Date:** 2026-09-21.

---

## 1. Purpose and correction from H-134

H-134 produced disposition/specification artefacts (`h-134-personal-data-capability-disposition-and-remediation-specification.md` and later `h-134-personal-data-remediation-implementation-blueprint.md`). Those remain historical records.

**This document maps the live codebase.** Paths and symbols below were located in the repository. Where a search did not find a binding, the text says `NOT FOUND IN REPOSITORY SEARCH`.

---

## 2. Repository baseline

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain count at start: 516
```

Matches expected HEAD/branch.

---

## 3. Source governance documents

| Path | Use here |
| --- | --- |
| `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` | Boundary (not rewritten) |
| `docs/governance/h-132-eos-personal-data-surface-audit.md` | Capability evidence |
| `docs/governance/h-133-personal-data-capability-disposition-and-remediation-specification.md` | Approved target |
| `docs/governance/h-132-tin-identity-reconciliation-and-evidence-gate.md` | TIN; not modified |
| `docs/governance/h-134-personal-data-capability-disposition-and-remediation-specification.md` | Historical; not modified |

---

## 4. Evidence standard

- **Located:** file path, table, or symbol found.  
- **NOT FOUND IN REPOSITORY SEARCH:** no invented path.  
- Opportunity/RFP/programme/proposal **do not** declare `contactId` in kernel types or `opp_opportunities` (see §17).

---

## 5. CRM dependency map

### Schema / model

```text
packages/db/migrations/004_c1_crm.sql
  TABLE crm_contacts
    given_name TEXT NOT NULL
    family_name TEXT NOT NULL
    email TEXT
    telephone TEXT
    mobile TEXT
    INDEX crm_contact_tenant_email (tenant_id, lower(email)) WHERE email IS NOT NULL
  TABLE crm_relationships
    from_contact_id UUID REFERENCES crm_contacts (id)
    to_contact_id UUID REFERENCES crm_contacts (id)
  TABLE crm_activities
    contact_id UUID REFERENCES crm_contacts (id)
  TABLE crm_notes  body TEXT, entity_type, entity_id  (no FK; polymorphic)
  TABLE crm_tasks
    related_contact_id UUID REFERENCES crm_contacts (id)
  TABLE crm_entity_tags  entity_type / entity_id (polymorphic)
  TABLE crm_import_batches  (csv_content added in 010_c1_merge_import.sql)

packages/db/migrations/006_c1_contacts_relationships.sql  — version/unit columns, unique indexes on contact-org
packages/db/migrations/007_c1_activities.sql              — INDEX crm_activity_tenant_contact
packages/db/migrations/008_c1_accounts_notes_tasks.sql
packages/db/migrations/009_c1_search_duplicates.sql       — recreates crm_contact_tenant_email
packages/db/migrations/010_c1_merge_import.sql            — csv_content TEXT
packages/db/migrations/011_c1_tags_external_identifiers.sql
packages/db/migrations/013_c1_hardening.sql

packages/kernel/src/crm.ts           type CrmContact, CrmActivity.contactId?, CrmTask.relatedContactId?
packages/kernel/src/crm-contact.ts   normalizeEmail, isPlausibleEmail, isPlausiblePhone
packages/kernel/src/crm-import.ts    ContactImportRow; parseCsv
packages/kernel/src/crm-duplicate.ts CONTACT_EMAIL_EXACT, CONTACT_PHONE_EXACT, CONTACT_NAME_SAME_ORG
packages/kernel/src/crm-events.ts    CRM_EVENT_TYPES CONTACT_*; forbiddenPayloadKeys includes email/phone
packages/db/migrations/064_i204_ai_drafts.sql  related_contact_id UUID
packages/kernel/src/ai-draft.ts      relatedContactId?
```

**ORM:** no separate ORM package. In-memory `Store.crmContacts` (`apps/api/src/store.ts`) + Postgres upsert `upsertCrmContact` / `loadCrmContacts` in `apps/api/src/persistence/pg-repository.ts`, wired by `apps/api/src/persistence/crm.ts`.

### Service → API → UI → test

```text
apps/api/src/crm/contact.ts
  listContacts, getContact, createContact, patchContact, archiveContact
  permissions: crm:read:contact, crm:write:contact
    → apps/api/src/crm/routes.ts
         GET    /v1/crm/contacts
         POST   /v1/crm/contacts
         GET    /v1/crm/contacts/:id
         PATCH  /v1/crm/contacts/:id
         POST   /v1/crm/contacts/:id/archive
         GET    /v1/crm/contacts/:id/relationships
         GET    /v1/crm/contacts/:id/activities
         GET    /v1/crm/contacts/:id/notes
    → apps/web/src/lib/crm-api.ts  type CrmContact; list contacts
    → apps/web/src/app/commercial/crm/page.tsx  Contacts tab (givenName, familyName, email, search, import)
    → apps/api/src/c1.contacts.test.ts
```

### Adjacent CRM surfaces that **FK or key to contacts**

```text
apps/api/src/crm/relationship.ts  fromContactId / toContactId
apps/api/src/crm/activity.ts      contactId query + payload
apps/api/src/crm/note.ts          entityType contact + lookup store.crmContacts
apps/api/src/crm/task.ts          relatedContactId (kernel CrmTask)
apps/api/src/crm/search.ts        entity "contact"; permission crm:read:contact
apps/api/src/crm/duplicate.ts     contact email/phone/name; crm:read:contact
apps/api/src/crm/import.ts        entityType contact; store.crmContacts.push; csvContent
apps/api/src/crm/tag.ts           entityType contact → crm:write:contact / crm:read:contact
apps/api/src/crm/external-identifier.ts  entityType contact permissions
apps/api/src/crm/merge.ts         (merge contacts — c1.merge-import.test.ts)
apps/api/src/ai/drafts.ts         relatedContactId / assoc.contactId
apps/api/src/crm/events.ts        snapshots include crmContacts
```

### Commercial path (no contact FK)

```text
opp_opportunities.organization_id  packages/db/migrations/015_c2_opportunity.sql
packages/kernel/src/opportunity.ts  organizationId — contactId NOT FOUND
packages/kernel/src/rfp.ts          organizationId — contactId NOT FOUND
packages/kernel/src/programme.ts    organizationId — contactId NOT FOUND
packages/kernel/src/proposal.ts     organizationId — contactId NOT FOUND
apps/api/src/pipeline/              contactId NOT FOUND IN REPOSITORY SEARCH
```

**Export endpoint for contacts as a dedicated CSV export:** `NOT FOUND IN REPOSITORY SEARCH` (import exists; UI list is in-app).

**Chain:**

```text
crm_contacts (004_c1_crm.sql)
  → CrmContact (packages/kernel/src/crm.ts)
  → upsertCrmContact / Store.crmContacts
  → contact.ts
  → /v1/crm/contacts*
  → crm-api.ts + crm/page.tsx
  → c1.contacts.test.ts, c1.merge-import.test.ts, c1.search-duplicates.test.ts,
     c1.accounts-notes-tasks.test.ts, c1.activities.test.ts, pg-crm.integration.test.ts,
     seed-demo-data.ts contact CSV
```

---

## 6. HR dependency map

```text
packages/db/migrations/081_i10_hr_core.sql
  hr_employees  given_name, family_name, email, principal_id → principals, org_unit_id, location_id
  UNIQUE (tenant_id, employee_code)
  UNIQUE INDEX hr_employees_tenant_email (tenant_id, lower(email))
  UNIQUE INDEX hr_employees_tenant_principal (tenant_id, principal_id) WHERE principal_id IS NOT NULL
  hr_skills
  hr_employee_skills  employee_id REFERENCES hr_employees (id)
  hr_leave_requests   employee_id REFERENCES hr_employees (id); leave types include sick (kernel)

packages/kernel/src/hr.ts
apps/api/src/hr/hr.ts          list/create/patch employees; leave; permissions hr:write:employee
apps/api/src/hr/routes.ts
  GET/POST /v1/hr/employees
  GET/PATCH /v1/hr/employees/:id
  POST/DELETE /v1/hr/employees/:id/skills[/:skillId]
  GET/POST /v1/hr/skills[/:id]
  GET/POST /v1/hr/leave + /submit|/approve|/reject|/cancel
apps/web/src/lib/hr-api.ts
apps/web/src/app/commercial/hr/page.tsx   givenName / familyName inputs

packages/db/migrations/100_h1_hr_certifications.sql  notes TEXT; employee linkage via service
apps/api/src/hr-certifications/service.ts  resolveEmployeeId → store.hrEmployees
apps/api/src/hr-certifications/routes.ts   query employeeId
apps/web/src/lib/hr-certifications-api.ts
apps/web/src/app/commercial/hr/certifications/page.tsx

Tests: apps/api/src/i10-hr-core.test.ts
       apps/api/src/h1-hr-certifications.test.ts
```

**Commercial workflow dependency on `hr_employees`:** `NOT FOUND IN REPOSITORY SEARCH` for `contactId`/`employeeId` on opportunity, RFP, programme, proposal, costing, or rate identity kernel types. Optional `hr_employees.principal_id` points **to** `principals`, not the reverse required by login.

**Non-HR commercial capability requiring employee rows:** **no FK from opp/rfp/programme/proposal/sup_rates located.** Certifications **do** require employees (`hr-certifications/service.ts`).

---

## 7. Supplier-contact dependency map

```text
packages/db/migrations/014_c4_supplier.sql
  sup_import_batches  entity_type CHECK (..., 'supplier_contact', ...)
                      csv_content TEXT
  sup_suppliers       legal_name, telephone, email (company-level columns)
  sup_contacts
    supplier_id UUID NOT NULL REFERENCES sup_suppliers (id)
    given_name, family_name NOT NULL
    email, telephone, whatsapp
    notes TEXT
    INDEX sup_contacts_supplier
  sup_rates           supplier_id REFERENCES sup_suppliers (id)  — NOT sup_contacts

packages/kernel/src/supplier.ts     type SupContact { givenName, familyName, email?, telephone?, whatsapp? }
packages/kernel/src/supplier-import.ts  CSV columns email, telephone, whatsapp for contact rows

apps/api/src/supplier/contacts.ts   create/patch/archive
apps/api/src/supplier/routes.ts
  POST   /v1/suppliers/:id/contacts
  PATCH  /v1/suppliers/:id/contacts/:contactId
  DELETE /v1/suppliers/:id/contacts/:contactId
apps/api/src/supplier/import.ts     csvContent; entity supplier_contact
apps/api/src/persistence/pg-repository.ts  upsertSupContact, loadSupContacts, countSupContacts
apps/api/src/persistence/supplier.ts

apps/web/src/lib/suppliers-api.ts   givenName on contact create
apps/web/src/app/commercial/suppliers/page.tsx  contact form + list {c.givenName} {c.familyName}

Tests: apps/api/src/pg9-supplier-contact-rate.test.ts
       apps/api/src/c4.import.test.ts
```

**Rates/proposals after contact removal:** `sup_rates.supplier_id` → `sup_suppliers` only. `packages/kernel/src/costing.ts` / programme items use `supplierId` / `supplierRateId`. **No `sup_contacts` FK on rates located.** Company + rates remain via `/v1/suppliers`, `/v1/suppliers/:id/rates*`, commercial-facts on rates (`apps/api/src/commercial-facts/routes.ts`).

**New personal-contact product:** not designed here.

---

## 8. Guest / operations dependency map

```text
packages/db/migrations/023_o2_ops_manifest.sql
  ops_manifests  booking_id REFERENCES bkg_bookings (id) UNIQUE (tenant_id, booking_id)
  ops_manifest_entries
    manifest_id REFERENCES ops_manifests (id) ON DELETE CASCADE
    guest_name TEXT NOT NULL
    email, rooming, dietary, mobility, flight_reference

packages/db/migrations/029_o4_vouchers.sql
  ops_vouchers
    booking_id REFERENCES bkg_bookings (id)
    manifest_entry_id UUID NOT NULL   — no REFERENCES clause in this file
    guest_name TEXT NOT NULL
    notes TEXT

packages/kernel/src/ops-manifest.ts  OpsManifestEntry.guestName
packages/kernel/src/ops-voucher.ts   guestName
packages/kernel/src/ops-field-sync.ts  OpsSyncEntityType includes "manifest_entry"

apps/api/src/ops/manifests.ts
apps/api/src/ops/vouchers.ts         copies entry.guestName; dietary → notes
apps/api/src/ops/routes.ts
  GET/POST /v1/ops/manifests/by-booking/:bookingId
  POST     /v1/ops/manifests/:id/entries
  POST     /v1/ops/manifests/:id/publish
  GET/POST /v1/ops/vouchers, /generate, /:id/issue, /issue-all
apps/api/src/ops/field-sync.ts
  deniedOfflineEntities: ["fin_invoice", "fin_payment", "manifest_entry"]
  allowedEntities: ["field_task", "brief"]

apps/web/src/lib/ops-api.ts
apps/web/src/app/commercial/operations/[bookingId]/page.tsx  guestName input; voucher.guestName
apps/web/src/app/field/[bookingId]/page.tsx
apps/web/src/lib/field-offline-cache.ts
apps/web/src/lib/field-sync-api.ts   bundle: fieldTasks + brief; no guestName in SyncBundle type

Booking header (retain):
  packages/kernel/src/booking.ts     paxCount?, status, title, organizationId
  packages/db/migrations (bkg_bookings referenced from 023)
  apps/api/src/booking/routes.ts     GET/POST /v1/bookings*
  apps/web/src/app/commercial/bookings/page.tsx
  apps/web/src/app/commercial/bookings/[id]/page.tsx

Seed: apps/api/src/dev/seed-demo-data.ts  guestName / dietary rows
Tests: apps/api/src/o1-ops.test.ts
       apps/api/src/o4-vouchers.test.ts
       apps/api/src/j2-ops-analytics.test.ts  guestName
```

**Breaks if guest rows disappear without voucher change:** `ops_vouchers.manifest_entry_id` NOT NULL and `guest_name` NOT NULL; `vouchers.ts` copies `entry.guestName`; UI lists guest names. Field cache **does not** include guests in `SyncBundle` (located). Online manifests still persist guests.

---

## 9. DSR / consent dependency map

```text
packages/db/migrations/092_p1_privacy_ropa_dsr.sql
  privacy_processing_activities
  privacy_dsr_cases  subject_label TEXT, note TEXT, request_type access|erasure|rectification

packages/db/migrations/110_p3_consent_records.sql
  consent_records  notes TEXT

packages/db/migrations/104_p2_privacy_dpias.sql  notes TEXT

apps/api/src/privacy/service.ts   subject_label_too_long; create/patch/transition DSR
apps/api/src/privacy/routes.ts    registerPrivacyRoutes
  GET/POST /v1/privacy/activities, retire
  GET/POST /v1/privacy/dsrs, patch, transition
apps/web/src/lib/privacy-api.ts
apps/web/src/app/commercial/privacy/page.tsx
apps/web/src/app/commercial/dsr/page.tsx
apps/web/src/app/commercial/dpia/page.tsx

apps/api/src/consent-register/service.ts
apps/web/src/lib/consent-register-api.ts
apps/web/src/app/commercial/consents/page.tsx  /v1/consents

Tests: apps/api/src/p1-privacy-ropa-dsr.test.ts
       apps/api/src/p3-consent-register.test.ts
       apps/api/src/dg1-dataset-register.test.ts  (migration file presence)
```

**Commercial workflow:** DSR/consent APIs are **independent** of `opp_opportunities` / RFP / rates — **no FK located** from those tables to `privacy_dsr_cases`. Coupled to privacy UI, not to proposal send.

---

## 10. Import / export dependency map

### CRM

```text
source:     POST /v1/crm/imports  body csv + entityType
parser:     packages/kernel/src/crm-import.ts parseCsv
            apps/api/src/crm/import.ts  batch.csvContent
validation: validate then execute
persist:    crm_import_batches.csv_content (010_c1_merge_import.sql)
            entityType organization → crm_organizations
            entityType contact → crm_contacts
UI:         apps/web/src/app/commercial/crm/page.tsx import
tests:      apps/api/src/c1.merge-import.test.ts
seed:       apps/api/src/dev/seed-demo-data.ts  givenName,familyName,email,telephone CSV
```

`csv_content` is **persistent batch storage** (not only a request transport). For `contact` it **is** a personal-data store. For `organization` it holds company rows (same column, different entityType).

### Supplier

```text
source:     POST /v1/suppliers/imports
parser:     packages/kernel/src/supplier-import.ts
            apps/api/src/supplier/import.ts
persist:    sup_import_batches.csv_content (014_c4_supplier.sql)
            entity_type supplier | supplier_contact | supplier_rate | supplier_content_block
tests:      apps/api/src/c4.import.test.ts
            apps/api/src/pg29-season-import.test.ts
            apps/api/src/pg18-rate-season-import.test.ts
```

### Notification exports (email lists)

```text
GET /v1/notifications/email/suppressions/export
GET /v1/notifications/email/allowlist/export
GET /v1/notifications/email/dlq-sla-digest-stale/export
… allowlist-dual-digest stale export
POST /v1/notifications/email/suppressions/import
apps/api/src/notifications/routes.ts
tests: apps/api/src/i3.12-suppression-export.test.ts and i3/i4 digest export tests
```

**Dedicated CRM contact CSV export endpoint:** `NOT FOUND IN REPOSITORY SEARCH`.

---

## 11. Free-text / JSON / JSONB dependency map (material)

Classification is **implementation capability**, not a legal finding.

| Location | Column / field | API in | API out | UI | Export | Downstream | Class |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `crm_notes.body` `004_c1_crm.sql` | body | POST/PATCH `/v1/crm/notes` `apps/api/src/crm/note.ts` | same | CRM | events forbid `body` (`crm-events.ts`) | contact entity lookup | clearly person-capable when entityType=contact; potentially otherwise |
| `crm_activities.notes` / `subject` | notes, subject | `/v1/crm/activities` | yes | CRM Activities tab | — | optional contactId | potentially / person-capable if contact-linked |
| `crm_tasks.description` | description | `/v1/crm/tasks` | yes | CRM Tasks | — | related_contact_id | potentially |
| `crm_relationships.notes` | notes | `/v1/crm/relationships` | yes | — | — | from_contact_id | potentially |
| `opp_opportunities.programme_summary` `015_c2_opportunity.sql` | programme_summary | `/v1/pipeline/opportunities` `pipeline/opportunity.ts` | yes | `/commercial/pipeline` | — | no contact FK | potentially |
| RFP notes/requirementsText | `packages/kernel/src/rfp.ts` | PATCH `/v1/rfps/:id` `rfp/rfp.ts` | yes | `/commercial/rfps/[id]/page.tsx` | — | — | potentially |
| programme internalNotes, clientNotes, item description/notes | `programme.ts`; `017_c5_programme.sql` description | `/v1/programmes*` `programme/routes.ts` | yes | `/commercial/programme/page.tsx` | snapshot JSONB `122_cd_programme_item_extensions.sql` | — | potentially |
| costing line `description` `018_c6_costing.sql` | description NOT NULL | `/v1/costing/sheets/:id/line-items` | yes | costing UI if present | — | commercial line | business-only **as priced item text**; still unconstrained |
| `ops_briefs.content` `024_o3_ops_field.sql` | content | PUT `/v1/ops/briefs/by-booking/:bookingId` | yes | operations + **SyncBundle.brief** | field cache | field-sync.ts | potentially |
| `ops_vouchers.notes` | notes | voucher generate | yes | operations page | copies dietary | vouchers.ts | person-capable (dietary copy) |
| `sup_contacts.notes` | notes | supplier contacts | yes | suppliers page | — | — | person-capable |
| `sup_rates.notes` | notes | rate PATCH | yes | suppliers | heatmap commercial | — | potentially |
| F2 `payload JSONB` `124_f2_dp01_commercial_facts.sql` | payload | PUT commercial-facts routes | yes | facts panels | persist tests | — | potentially (unconstrained JSON) |
| proposal `snapshot JSONB` `020_c8_proposal.sql` | snapshot | `/v1/proposals/:id/versions` | yes | proposals | — | — | potentially |
| AI `body` `064_i204_ai_drafts.sql` | body; related_contact_id | AI draft APIs `ai/drafts.ts` | yes | `/commercial/ai/page.tsx` | — | contact association | person-capable if relatedContactId |
| `privacy_dsr_cases.subject_label`, `note` | subject_label | `/v1/privacy/dsrs` | yes | dsr/privacy pages | — | — | person-capable |
| `consent_records.notes` | notes | `/v1/consents` | yes | consents page | — | — | potentially |
| import `csv_content` | TEXT | import POST | GET import | CRM/supplier import | batches persist | person rows | person-capable for contact entity types |
| GRC/ITSM/crisis `notes`/`body` (e.g. `088_i16_internal_audit.sql`, `090_i18_crisis_overlay.sql`, `087_i19_knowledge.sql`) | notes/body | respective `/v1/...` | yes | `/commercial/audit-ia`, `/crisis`, `/knowledge` | — | **no opp/rfp FK located** | potentially; independent of commercial send |

`NOT FOUND IN REPOSITORY SEARCH`: a single central “comments” table.

---

## 12. DocumentStorage dependency map

```text
port:     packages/kernel/src/commercial-document.ts
            COMMERCIAL_DOC_MIME_ALLOWLIST pdf/docx/xlsx/csv/jpeg/png
            DocumentStorage.put/get/exists/stat/delete
table:    commercial_documents  packages/db/migrations/119_cd_commercial_documents.sql
            storage_ref TEXT NOT NULL  — bytes NOT in PostgreSQL
            rfp_id, supplier_id, contract_id (no FK constraints in this file)
adapter:  apps/api/src/commercial-documents/storage.ts  LocalFsDocumentStorage
            put flag wx; unlink on delete; rootDir
service:  apps/api/src/commercial-documents/service.ts  uploadCommercialDocument, getCommercialDocumentContent
HTTP:     apps/api/src/commercial-documents/routes.ts
            POST /v1/rfps/:id/documents
            GET  /v1/rfps/:id/documents
            GET  /v1/commercial-documents/:id
            GET  /v1/commercial-documents/:id/content
          HTTP DELETE document route: NOT FOUND IN REPOSITORY SEARCH
          adapter.delete used in tests:
            apps/api/src/e1-d-class-b.inventory-storage.test.ts
            apps/api/src/e1-d-class-a.localfs-recovery.test.ts
supplier: apps/api/src/supplier/contracts.ts  uploadCommercialDocument
          POST /v1/suppliers/:id/contracts/:contractId/documents  supplier/routes.ts
config:   apps/api/src/infrastructure-contract.ts  resolveDocumentStorageKind; local-fs forbidden production-like
UI:       apps/web/src/lib/commercial-documents-api.ts
          apps/web/src/app/commercial/rfps/[id]/page.tsx  uploadRfpDocument
tests:    apps/api/src/cd-phase1-foundation.test.ts
```

Commercial objects referencing documents: **RFP** (`rfp_id`), **supplier** (`supplier_id`), **contract** (`contract_id`). Identity-document contents in repo: **not demonstrated**.

---

## 13. Notification dependency map

```text
schema:   packages/db/migrations/032_i3_email_outbox.sql  notif_email_outbox.recipient_email, body_text
          034_i3_email_templates.sql
          041_i36_ses_delivery_events.sql  recipient_email
          047_i39_email_suppressions.sql
          050_i314_email_allowlist.sql
kernel:   packages/kernel/src/notification-email.ts
producer: apps/api/src/notifications/email.ts  buildEmailFromNotification, persistNotifEmailOutbox
transport: apps/api/src/notifications/ses-transport.ts
           apps/api/src/notifications/smtp-transport.ts
config:   apps/api/src/notifications/email-config.ts  resolveEmailAdapterName
webhook:  apps/api/src/notifications/ses-webhook.ts
in-app:   apps/api/src/notifications/notifications.ts  (in-app list; distinct from outbox)
persist:  apps/api/src/persistence/notifications.ts  persistNotifEmailOutbox
API:      apps/api/src/notifications/routes.ts
            GET  /v1/notifications/email/outbox
            POST /v1/notifications/email/dispatch-digest
            GET/POST allowlist, suppressions, digest recipients, templates, SES webhook
UI:       apps/web/src/app/commercial/notifications/page.tsx
tests:    apps/api/src/i3.2-email.test.ts and i3.* / i4.* digest-recipient tests
```

**OWNER DECISION REQUIRED** on retaining `recipient_email`. No mail vendor chosen here. No email sent in this task.

In-app `GET /v1/notifications` (dismiss/unread) does **not** require outbox addresses (separate module).

---

## 14. Logging dependency map

```text
apps/api/src/observability.ts
  REDACT_KEYS: password, passwordHash, accessToken, token, authorization, secret,
               EOS_TOKEN_SECRET, EOS_BOOTSTRAP_*_PASSWORD
  createLogger JSON to console
  onRequest: correlationId, requestId; does not log body
  onResponse: request_completed statusCode correlationId
  onError: request_error err: error.message
```

**Entry of names/emails/phones:** not in default request log. **Can** enter if a handler passes fields to `logger.*`, or `error.message` includes submitted values, or notification code logs `recipientEmail` (`ses-webhook.ts` uses recipientEmail in payload). **Email/name/phone are not in REDACT_KEYS.**

Audit: `apps/api/src/crm/audit.ts` `allowCrmAudit` / `denyCrmAudit`; `apps/api/src/ops/` ops audit helpers. CRM event payloads forbid email/phone keys (`packages/kernel/src/crm-events.ts`).

---

## 15. Field-ops cache dependency map

```text
type:     browser localStorage encrypted blob
keys:     sedmc-field-device-id
          sedmc-field-cache-salt
          sedmc-field-cache:{bookingId}
          sedmc-field-cache-meta:{bookingId}
files:    apps/web/src/lib/field-offline-cache.ts
          apps/web/src/lib/field-sync-api.ts  SyncBundle { fieldTasks, brief }
          packages/kernel field-cache-crypto (encryptFieldCachePayload)
source:   POST /v1/ops/sync/pull  apps/api/src/ops/field-sync.ts pullSyncBundle
consumer: apps/web/src/app/field/[bookingId]/page.tsx
sync:     POST /v1/ops/sync/push; GET /v1/ops/sync/policy, /conflicts
offline:  deniedOfflineEntities includes manifest_entry
persist:  localStorage until TTL/clear; survives tab restart; not a Postgres cache table
          sessions: store.opsFieldSyncSessions in field-sync.ts
tests:    o1-ops.test.ts (ops); dedicated field-cache unit tests:
          NOT FOUND IN REPOSITORY SEARCH for field-offline-cache.test.ts
```

**Guest data in cache payload:** `SyncBundle` type has **no** `guestName`. Policy **denies** `manifest_entry` offline. **Online** APIs still serve manifests.

---

## 16. Technical identity dependency map

```text
packages/db/schema.sql
  principals (email, display_name, tenant_id, actor_type, status, org_unit_id)
  principal_credentials (password_hash)
packages/kernel/src/types.ts  Principal
apps/api/src/server.ts        POST /v1/auth/login
apps/web/src/lib/eos-session.ts  sessionStorage token + email
apps/web/src/components/commercial/EosSessionProvider.tsx
apps/api/src/app.ts           principalFromAuthHeader
authorize() on domain services
created_by_principal_id / updated_by_principal_id / owner_principal_id
  on opp_opportunities, CRM, HR, ops, documents, etc.
```

Commercial features depend on **principal id** for ownership and audit (e.g. `opp_opportunities.owner_principal_id` `015_c2_opportunity.sql`), **not** on `crm_contacts` or `hr_employees`.

Do not remove authentication. No IdP selected.

---

## 17. Commercial workflow dependency proof

| Stage | Table / type | Service | API | UI | Key relationships | Tests | Person object required? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Opportunity | `opp_opportunities` `015_c2_opportunity.sql`; `packages/kernel/src/opportunity.ts` | `apps/api/src/pipeline/opportunity.ts` | `/v1/pipeline/opportunities*` `pipeline/routes.ts` | `apps/web/src/app/commercial/pipeline/page.tsx`, `pipeline/[id]/page.tsx` | `organization_id`, `account_id`, `owner_principal_id`; **no contact_id column** | `c2.pipeline.test.ts` | **No** |
| Account / Org | `crm_organizations`, `crm_accounts` `004_c1_crm.sql` | `crm/organization.ts`, `crm/account.ts` | `/v1/crm/organizations*`, `/v1/crm/accounts*` | `crm/page.tsx`, `crm/accounts/[id]/page.tsx` | account → organization | `c1.organizations.test.ts`, `c1.accounts-notes-tasks.test.ts` | **No** (contacts optional sidecar) |
| Programme | `017_c5_programme.sql`; `programme.ts` | `apps/api/src/programme/programme.ts` | `/v1/programmes*` | `programme/page.tsx` | rfpId, opportunityId, organizationId, supplierId on items | `c5.programme.test.ts` | **No** |
| RFP | rfp table via rfp module; `rfp.ts` | `apps/api/src/rfp/rfp.ts` | `/v1/rfps*` `rfp/routes.ts` | `rfps/page.tsx`, `rfps/[id]/page.tsx` | opportunityId, organizationId | RFP tests under `apps/api/src` (e.g. f2-i8/i9) | **No** |
| Proposal / facts | `020_c8_proposal.sql`; `124_f2_dp01_commercial_facts.sql` | `proposal/proposal.ts`; `commercial-facts/` | `/v1/proposals*`; PUT commercial-facts on opp/rfp/account/programme/rates | proposals pages; facts panels | organizationId; rate facts → supplier **rate** not contact | `c8.proposal.test.ts`, `f2-*.test.ts` | **No** |
| Rate identity | `014_c4_supplier.sql` `sup_rates`; commercial-facts rate routes | `supplier/` rates; `commercial-facts/rate-identity.ts` | `/v1/suppliers/:id/rates*`; GET/PUT `.../rates/:rateId/commercial-facts` | `suppliers/page.tsx` (rates; contact form is separate) | `sup_rates.supplier_id` → `sup_suppliers` | `f2-i6.c4-supplier-rate-identity-preview.test.ts`, pg rate tests | **No** (contacts are sibling, not FK) |
| Approval / handoff | commercial-approval; `bkg_bookings` | `commercial-approval/approval.ts`; `booking/` | `/v1/commercial-approvals*`; `/v1/bookings*` | proposals/bookings | organizationId on approval type | `c8.proposal.test.ts`; `c9.booking.test.ts` | **No** for header. Guests are **ops sidecar** after booking |

**Proof:** commercial send path is keyed by `organization_id` / programme / RFP / proposal / `sup_rates`, not `crm_contacts`, `sup_contacts`, `ops_manifest_entries`, or `hr_employees`.

---

## 18. Database / schema migration impact

Do **not** write migrations. Production row counts: **not established**.

| Current Object | Actual Repository Location | Change Eventually Required | Dependency Count | Migration Risk | Implementation Phase |
| --- | --- | --- | --- | --- | --- |
| `crm_contacts` | `004_c1_crm.sql` | Stop-write then drop/archive table | High (relationships, activities, tasks, notes, tags, import, AI, duplicates) | FK order | A |
| `crm_relationships` contact columns | `004` / `006` | Drop contact FKs or org-only rows | Medium | Unique indexes on contact-org | A |
| `crm_activities.contact_id` | `004`, `007` | Null/drop column | Medium | Index crm_activity_tenant_contact | A |
| `crm_tasks.related_contact_id` | `004` | Drop column | Low-medium | FK | A |
| `ai_drafts.related_contact_id` | `064_i204_ai_drafts.sql` | Drop column | Low | AI drafts | A |
| `crm_import_batches.csv_content` | `010_c1_merge_import.sql` | Stop `contact` entityType; column remains for org import | Medium | Dual use | D |
| `hr_employees` + leave + skills | `081_i10_hr_core.sql` | Drop cluster | Medium (certs) | certs FK employee | A |
| HR certifications | `100_h1_hr_certifications.sql` | Drop or unlink | Depends on employees | Must follow employees | A |
| `sup_contacts` | `014_c4_supplier.sql` | Drop table | Medium (import entity type) | `sup_rates` independent | A |
| `sup_import_batches` contact entity | `014` CHECK | Remove `supplier_contact` from CHECK | Medium | Constraint change | D |
| `ops_manifests` / `_entries` | `023_o2_ops_manifest.sql` | Drop | **Coupled to vouchers** | CASCADE entries | A |
| `ops_vouchers` | `029_o4_vouchers.sql` | Drop guest_name / manifest_entry_id or whole guest voucher | **Blocks isolated manifest drop** | NOT NULL | A **with** manifests |
| `privacy_dsr_cases.subject_label` | `092_p1_privacy_ropa_dsr.sql` | Drop column or table | Low | Independent | A |
| `consent_records.notes` | `110_p3_consent_records.sql` | Drop notes or table | Low | Independent | A |
| `commercial_documents` | `119_cd_commercial_documents.sql` | Restrict kinds/MIME not drop table | Medium | storage_ref files | E |
| `notif_email_outbox` | `032_i3_email_outbox.sql` | Owner Decision | High (I3/I4) | Recipients | F |
| `principals` | `schema.sql` | **Do not drop** | Universal audit FKs | Auth break | — |
| F2 payload JSONB | `124_f2_dp01_commercial_facts.sql` | Constrain keys | Low on commercial path | Overlay | E |

**Dependency count** is qualitative (fan-in of FKs/callers), not a row count.

---

## 19. API impact matrix

| Endpoint | Method | Current Capability | Personal-Data Dependency | Future Disposition | Dependent UI/Service | Phase |
| --- | --- | --- | --- | --- | --- | --- |
| `/v1/crm/contacts` | GET POST | list/create contacts | crm_contacts | REMOVE | crm/page.tsx, contact.ts | B |
| `/v1/crm/contacts/:id` | GET PATCH | read/update | crm_contacts | REMOVE | crm-api.ts | B |
| `/v1/crm/contacts/:id/archive` | POST | archive | crm_contacts | REMOVE | contact.ts | B |
| `/v1/crm/contacts/:id/relationships` | GET | list | from_contact_id | REMOVE/REDESIGN | relationship.ts | B |
| `/v1/crm/contacts/:id/activities` | GET | list | contact_id | REMOVE | activity.ts | B |
| `/v1/crm/contacts/:id/notes` | GET | list | entityType contact | REMOVE | note.ts | B |
| `/v1/crm/search` | GET | search incl. contacts | crm/search.ts contact entity | REDESIGN drop contact entity | crm page search | B |
| `/v1/crm/duplicates*` | GET POST | duplicate review | email/phone/name | REMOVE person path | duplicate.ts | B |
| `/v1/crm/imports*` | POST GET | CSV | csv_content + contact entity | REMOVE contact entityType | import.ts, crm page | D |
| `/v1/crm/organizations*` | * | companies | org email/phone **C** | RETAIN org | CRM orgs | — |
| `/v1/crm/accounts*` | * | accounts | no contact FK required | RETAIN | accounts pages | — |
| `/v1/hr/employees*` | * | employees | hr_employees | REMOVE | hr/page.tsx | B |
| `/v1/hr/leave*` | * | leave incl sick | hr_leave_requests | REMOVE | hr.ts | B |
| `/v1/hr/skills*` | * | catalogue | used with employee skills | REMOVE with HR or keep catalogue | hr.ts | B |
| HR certifications routes | * | certs | employeeId | REMOVE with employees | hr-certifications | B |
| `/v1/suppliers/:id/contacts*` | POST PATCH DELETE | named contacts | sup_contacts | REMOVE | suppliers/page.tsx | B |
| `/v1/suppliers/imports*` | POST GET | CSV | supplier_contact entity | REMOVE that entity | import.ts | D |
| `/v1/suppliers` `/rates*` | * | company + rates | **not** sup_contacts | RETAIN | suppliers page | — |
| `/v1/ops/manifests*` | GET POST | guests | ops_manifest_entries | REMOVE | operations/[bookingId] | B |
| `/v1/ops/vouchers*` | GET POST | guest vouchers | guest_name, manifest_entry_id | REMOVE guest-level | vouchers.ts | B |
| `/v1/ops/briefs*` | GET PUT POST | briefs | content TEXT | REDESIGN | field cache | E/F |
| `/v1/ops/sync/*` | GET POST | field sync | briefs; guests denied offline | REDESIGN briefs | field/[bookingId] | F |
| `/v1/privacy/dsrs*` | * | DSR | subject_label | REMOVE identifying | dsr/privacy pages | B |
| `/v1/consents*` | * | consent register | notes | REMOVE identifying notes | consents page | B |
| `/v1/privacy/activities*` | * | processing catalogue | no subject_label on activities table | OWNER DECISION | privacy page | — |
| `/v1/rfps/:id/documents*` `/v1/commercial-documents/:id/content` | POST GET | files | opaque bytes | REDESIGN | rfps/[id]/page.tsx | E |
| `/v1/notifications/email/*` | * | outbox/allowlist/suppressions | recipient_email | OWNER DECISION | notifications/page.tsx | F |
| `/v1/notifications` | GET POST dismiss | in-app | not outbox address | RETAIN if no email persist | notifications | — |
| `/v1/auth/login` | POST | login | principals.email | RETAIN | eos-session.ts | — |
| `/v1/pipeline/opportunities*` | * | pipeline | organization_id | RETAIN | pipeline pages | — |
| `/v1/programmes*` | * | programmes | organizationId | RETAIN | programme page | — |
| `/v1/rfps*` | * | RFPs | organizationId | RETAIN | rfp pages | — |
| `/v1/proposals*` | * | proposals | organizationId | RETAIN | proposal pages | — |
| `/v1/costing/*` | * | costing | organizationId | RETAIN | costing | — |
| `/v1/commercial-approvals*` | * | approval | organizationId | RETAIN | — | — |
| `/v1/bookings*` | * | booking header | paxCount | RETAIN | bookings pages | — |
| commercial-facts GET/PUT | * | facts JSONB | unconstrained payload | REDESIGN keys | facts panels | E |

---

## 20. UI impact matrix

| Route/Component | Current Capability | Personal-Data Dependency | Future Disposition | API Dependency | Phase |
| --- | --- | --- | --- | --- | --- |
| `apps/web/src/app/commercial/crm/page.tsx` Contacts tab | list name/email; import | crm_contacts | REMOVE tab/import | `/v1/crm/contacts`, imports | C |
| same file Organizations/Accounts/Tasks | org/account | companies | RETAIN | orgs/accounts | — |
| `apps/web/src/app/commercial/crm/accounts/[id]/page.tsx` | account + facts | account id | RETAIN | accounts, commercial-facts | — |
| `apps/web/src/lib/crm-api.ts` | CrmContact type | contacts | REMOVE contact helpers | contacts | C |
| `apps/web/src/app/commercial/hr/page.tsx` | employee form | givenName | REMOVE | `/v1/hr/employees` | C |
| `apps/web/src/app/commercial/hr/certifications/page.tsx` | certs | employeeId | REMOVE | hr-certifications | C |
| `apps/web/src/app/commercial/suppliers/page.tsx` contact form | named contacts | givenName/email | REMOVE form; RETAIN company/rates UI | `/contacts` | C |
| `apps/web/src/app/commercial/operations/[bookingId]/page.tsx` | guests/vouchers | guestName | REMOVE guest UI | manifests/vouchers | C |
| `apps/web/src/app/field/[bookingId]/page.tsx` | field sync | briefs | REDESIGN briefs | `/v1/ops/sync/pull` | F |
| `apps/web/src/lib/field-offline-cache.ts` | localStorage | briefs | REDESIGN | sync bundle | F |
| `apps/web/src/app/commercial/dsr/page.tsx` | DSR | subject_label | REMOVE identifying | `/v1/privacy/dsrs` | C |
| `apps/web/src/app/commercial/privacy/page.tsx` | activities + DSR | DSR | REDESIGN | privacy-api.ts | C |
| `apps/web/src/app/commercial/consents/page.tsx` | consents | notes | REMOVE identifying | `/v1/consents` | C |
| `apps/web/src/app/commercial/rfps/[id]/page.tsx` | RFP + upload | documents | REDESIGN upload; RETAIN RFP | rfp + documents | E |
| `apps/web/src/app/commercial/notifications/page.tsx` | email admin | recipient_email | OWNER DECISION | email/* | F |
| `apps/web/src/app/commercial/pipeline/page.tsx` `[id]/page.tsx` | opportunities | organizationId | RETAIN | pipeline | — |
| `apps/web/src/app/commercial/programme/page.tsx` | programmes | notes potentially | RETAIN programme; REDESIGN notes | programmes | E |
| `apps/web/src/app/commercial/proposals/page.tsx` `[id]/page.tsx` | proposals | commercial | RETAIN | proposals | — |
| `apps/web/src/app/commercial/ai/page.tsx` | drafts | body, relatedContactId | REDESIGN | ai/drafts.ts | E |
| `apps/web/src/lib/eos-session.ts` | session email | operator email | RETAIN MINIMAL | `/v1/auth/login` | — |
| `apps/web/src/components/commercial/EosSessionProvider.tsx` | session | login | RETAIN | login | — |

---

## 21. Test / fixture impact matrix

| Test/Fixture | Capability | Current Dependency | Future Action | Phase |
| --- | --- | --- | --- | --- |
| `apps/api/src/c1.contacts.test.ts` | CRM contacts | POST /v1/crm/contacts | REMOVE/REWRITE | G |
| `apps/api/src/c1.merge-import.test.ts` | import | contact CSV | REMOVE contact cases; KEEP org | G |
| `apps/api/src/c1.search-duplicates.test.ts` | duplicates | email/phone | REWRITE drop person | G |
| `apps/api/src/c1.accounts-notes-tasks.test.ts` | notes on contact | contactId | REWRITE org notes only | G |
| `apps/api/src/c1.activities.test.ts` | activities | contactId | REWRITE org-only | G |
| `apps/api/src/c1.events.test.ts` | CRM events | contact events | REWRITE | G |
| `apps/api/src/pg-crm.integration.test.ts` | PG CRM | contacts | REWRITE | G |
| `apps/api/src/crm.integration.test.ts` `crm.security.regression.test.ts` | CRM | mixed | REWRITE | G |
| `apps/api/src/c1.11.*.test.ts` | CRM perf/openapi/atomicity | contacts likely | REWRITE | G |
| `apps/api/src/i10-hr-core.test.ts` | HR | employees/leave | REMOVE/REWRITE | G |
| `apps/api/src/h1-hr-certifications.test.ts` | certs | employeeId | REMOVE/REWRITE | G |
| `apps/api/src/pg9-supplier-contact-rate.test.ts` | contacts+rates | /contacts | REWRITE rates without contacts | G |
| `apps/api/src/c4.import.test.ts` | supplier import | supplier_contact | REMOVE those cases | G |
| `apps/api/src/o1-ops.test.ts` | manifests | guestName | REMOVE guest cases | G |
| `apps/api/src/o4-vouchers.test.ts` | vouchers | guestName | REMOVE/REWRITE | G |
| `apps/api/src/j2-ops-analytics.test.ts` | analytics | guestName | REWRITE | G |
| `apps/api/src/dev/seed-demo-data.ts` | seed | contact CSV + guests | REPLACE WITH BUSINESS-ENTITY DATA | G |
| `apps/api/src/p1-privacy-ropa-dsr.test.ts` | DSR | subject_label | REWRITE | G |
| `apps/api/src/p3-consent-register.test.ts` | consents | notes | REWRITE | G |
| `apps/api/src/i3.2-email.test.ts` + i3/i4 recipient tests | notifications | recipientEmail | OWNER DECISION | G/F |
| `apps/api/src/cd-phase1-foundation.test.ts` | documents | upload | REWRITE MIME/kind | G |
| `apps/api/src/c2.pipeline.test.ts` | pipeline | org | **RETAIN** | — |
| `apps/api/src/c5.programme.test.ts` | programme | org | **RETAIN** | — |
| `apps/api/src/c8.proposal.test.ts` | proposal | org | **RETAIN** | — |
| `apps/api/src/c9.booking.test.ts` | booking header | pax | **RETAIN** | — |
| `apps/api/src/f2-*.test.ts` | commercial facts | JSONB | **RETAIN** commercial keys; constrain later | E/G |
| Login `*.sedmc.local` across tests | principals | email login | **RETAIN** | — |

---

## 22. Cross-cutting dependency graph

```text
crm_contacts (004_c1_crm.sql)
    → CrmContact / Store.crmContacts / upsertCrmContact
    → contact.ts → /v1/crm/contacts*
    → crm/page.tsx + crm-api.ts
    → relationships.from_contact_id | activities.contact_id | tasks.related_contact_id
      | notes.entityType=contact | tags | duplicates | search | import csv_content
      | ai_drafts.related_contact_id | crm.contact.* events
    → tests c1.contacts / merge-import / search-duplicates / activities / seed

opp_opportunities.organization_id ──X── crm_contacts
    (no FK; commercial path independent)

hr_employees (081_i10_hr_core.sql)
    → hr/hr.ts → /v1/hr/employees* /leave*
    → hr/page.tsx
    → hr_leave_requests, hr_employee_skills
    → hr_certifications.employeeId (hr-certifications/service.ts)
    → i10-hr-core.test.ts, h1-hr-certifications.test.ts
    ──X── opp / rfp / rates (no FK located)

sup_contacts (014_c4_supplier.sql)
    → supplier/contacts.ts → /v1/suppliers/:id/contacts*
    → suppliers/page.tsx contact form
    → import entity_type=supplier_contact + csv_content
    → pg9-supplier-contact-rate.test.ts
sup_rates.supplier_id → sup_suppliers  (survives without sup_contacts)

ops_manifest_entries.guest_name (023)
    → manifests.ts → /v1/ops/manifests*
    → operations/[bookingId]/page.tsx
    → ops_vouchers.manifest_entry_id + guest_name (029) → vouchers.ts
    → field-sync DENIES manifest_entry offline
    → seed-demo-data.ts, o1-ops.test.ts, o4-vouchers.test.ts
bkg_bookings / paxCount ── survives as header

privacy_dsr_cases.subject_label + consent_records.notes
    → privacy/service.ts, consent-register
    → /commercial/dsr, /privacy, /consents
    ──X── commercial send path
```

**Safe order implication:** vouchers **with** manifests; HR certs **with** employees; contact-linked notes/activities/tasks/duplicates/import/search/AI **with** contacts; rates/orgs/pipeline **before or without** those removals.

---

## 23. Proposed future implementation sequence

**Not executed.**

| Phase | Based on graph |
| --- | --- |
| **A Schema/domain** | Stop-write then drop/unlink: vouchers+manifests together; crm_contacts + contact FKs + AI related_contact_id; hr_employees cluster + certifications; sup_contacts; DSR subject_label / consent identifying notes |
| **B Services/API** | Remove §19 REMOVE routes; keep pipeline/programme/RFP/proposal/costing/supplier-company/rates/bookings/login |
| **C UI** | Remove §20 REMOVE pages/forms |
| **D Imports/exports** | Remove contact / supplier_contact entity types; keep org/supplier/rate CSV; `csv_content` remains for company batches |
| **E Documents/free text** | Restrict DocumentStorage; bound notes/JSONB/briefs/AI body |
| **F Notifications/logging/cache** | After Owner Decision on outbox; redact logger; redesign briefs in cache |
| **G Tests/fixtures** | §21 |
| **H Dev/Test regression** | Full relevant suite |
| **I UAT** | New grant after H |
| **J Production readiness reassessment** | Independent of this map; still NOT AUTHORIZED |

---

## 24. Owner decisions remaining

From repository inspection + H-133 (not invented beyond these):

1. **Notification outbox** — retain `recipient_email` vs in-app-only vs external send (`notif_email_outbox`, allowlist, suppressions, digest recipients).  
2. **Processing-activity catalogue** — `privacy_processing_activities` has no `subject_label`; keep as non-identifying register or not.

Organisation switchboard vs person mailbox is a **semantics** issue on existing `crm_organizations.primary_email` / `primary_telephone` columns (`004_c1_crm.sql`); not a missing table. H-133 already flagged redesign; not a new product invention.

---

## 25. Governance gates

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production: NOT AUTHORIZED / NOT READY
```

No PDPC exemption, legal compliance, Production readiness, Production data state, or regulatory registration is claimed.

---

## 26. Explicit non-actions

This increment did not modify application code, schema, migrations, APIs, UI, tests, fixtures, seeds, infrastructure, configuration, or data. It did not delete structures, commit, push, reset, clean, stash, revert, or overwrite unrelated work. Only this file was added.

---

## 27. Conclusion

If implementation is later authorized, change concentrates in:

- `packages/db/migrations/004_c1_crm.sql` (+ 006–013, 010 csv_content, 064 AI) and `apps/api/src/crm/*`, `apps/web/.../crm/`  
- `081_i10_hr_core.sql`, `100_h1_hr_certifications.sql`, `apps/api/src/hr/`, `hr-certifications/`, `apps/web/.../hr/`  
- `014_c4_supplier.sql` `sup_contacts` + import entity, `apps/api/src/supplier/contacts.ts`, suppliers UI contact form — **not** `sup_rates`  
- `023_o2_ops_manifest.sql` + `029_o4_vouchers.sql` **together**, ops UI, seed guests  
- `092`/`110` privacy/consent + dsr/consents UI  
- DocumentStorage `119` + `commercial-documents/*` + RFP upload (redesign, not drop)  
- `observability.ts` redaction; `field-offline-cache.ts` briefs  
- `notif_email_outbox` only after Owner Decision  

The commercial chain `opp_opportunities` → organisations/accounts → programmes → RFPs → proposals/facts → `sup_rates` → approvals/bookings **has no located FK to person tables** and can survive if those person clusters are removed without dropping the commercial objects.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```
