# H-134 — Personal-Data Remediation Implementation Blueprint

> **GOVERNANCE + ENGINEERING DEPENDENCY MAPPING ONLY**  
> Converts the H-133 disposition specification into a sequenced implementation blueprint.  
> **NO IMPLEMENTATION IS AUTHORIZED.**  
> Does **not** modify application code, schema, migrations, APIs, UI, tests, fixtures, infrastructure, configuration, database data, or Production.  
> Does **not** delete tables, columns, endpoints, files, fixtures, routes, components, or data.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Porcelain at start of this increment:** 515.  
**Commit / push:** **NONE**.

This file is distinct from `h-134-personal-data-capability-disposition-and-remediation-specification.md` (prior specification artefact). That file, all H-131/H-132/H-133 artefacts, and TIN H-132 are **not modified**.

Legend used below:

- **Fact** — observed in repository paths cited  
- **Inferred** — follows from those facts but is not a separate runtime dump  
- **Proposed** — future implementation; **not executed**  
- **Owner Decision Required** — H-133 / this blueprint cannot uniquely choose  

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 = OPEN
DP-0006 = OPEN
```

---

## 1. Governance status

| Item | Status |
| --- | --- |
| Mode | Governance + dependency mapping |
| Implementation | **NONE** |
| H-133 dispositions | Binding **target direction** for later authorized phases |
| H-119 UAT | Remains valid with documented limitations until a **new** UAT grant |
| H-80 / H-81 | ACTIVE / NOT STARTED (unchanged) |

---

## 2. Repository baseline

```text
Branch: master
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index: empty (git diff --cached --quiet)
Porcelain count at start: 515
```

HEAD/branch match the expected baseline. Index not changed.

---

## 3. Authoritative source documents

| File | Role |
| --- | --- |
| `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` | Privacy boundary |
| `docs/governance/h-132-eos-personal-data-surface-audit.md` | Capability audit (filename collision with TIN H-132 preserved) |
| `docs/governance/h-133-eos-personal-data-surface-audit.md` | Additional audit artefact (not rewritten) |
| `docs/governance/h-133-personal-data-capability-disposition-and-remediation-specification.md` | **Authoritative dispositions** |
| `docs/governance/h-132-tin-identity-reconciliation-and-evidence-gate.md` | TIN identity; **EI-01 unchanged** |

Historical numbering collisions are **left as-is**.

---

## 4. Target EOS personal-data boundary

**Fact (H-131):** EOS shall not be a system of record for personal data.

**Retain (commercial SoR in EOS):** organizations/accounts, opportunities, programmes, RFPs, proposals, commercial facts, rates, rate identity, destinations, hotels/suppliers **as companies**, pax counts, dates, budgets, commercial statuses, approval/handoff state.

**Must not remain as EOS person SoR:** traveller/guest names, emails, phones, dietary/mobility, guest manifests, guest-level vouchers, client individual contacts, supplier individual contacts, employee/leave/sick records, personal WhatsApp identifiers, DSR subject records, personal consent notes, arbitrary personal documents, unrestricted personal-data free text.

**Technical operator identity:** retain only as needed for authentication, authorization, roles, permissions, tenant isolation, auditability. Minimize. **No IdP selected.**

---

## 5. Capability disposition summary

From H-133 (approved target direction). **Proposed future only.**

| Capability | Disposition |
| --- | --- |
| CRM person/contact SoR | **REMOVE** (optional later business-level “contact available externally” — do not invent product now) |
| HR employees / leave / sick | **REMOVE** |
| Supplier named contacts (email/phone/WhatsApp) | **REMOVE** person record; **retain** `sup_suppliers` + rates |
| Guest manifests / guest-level voucher person fields | **REMOVE** |
| Person-row CSV imports | **REMOVE** |
| DSR/consent identifying fields | **REMOVE** (catalogue without subject identity: Owner Decision) |
| Org switchboard email/phone/address | **RETAIN WITH REDESIGN** — organisation-only semantics |
| Free-text / JSONB / snapshots | **RETAIN WITH REDESIGN** / controlled non-personal content |
| DocumentStorage | **RETAIN WITH REDESIGN** |
| Operator principals | **RETAIN — MINIMAL TECHNICAL IDENTITY** |
| Notification `recipient_email` | **OWNER DECISION REQUIRED** |
| Logging | **RETAIN WITH REDESIGN** |
| Field-ops cache | **RETAIN WITH REDESIGN** after guests removed |

---

## 6. Data-model dependency inventory

| Object | Current Purpose | Personal Data | Target Disposition | Referenced By | Migration Impact | API Impact | UI Impact | Test Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `crm_contacts` | Named client contacts | given/family name, email, telephone, mobile **(Fact)** | REMOVE | `crm_relationships.from_contact_id` / `to_contact_id`; notes/activities `entity_type=contact`; duplicates; import; events `crm.contact.*` | Later: drop/stop-write table + FKs | `/v1/crm/contacts*` REMOVE | CRM Contacts tab | `c1.contacts.test.ts`, merge-import, seed |
| `crm_relationships` (contact legs) | Link contact↔org | Contact FKs **(Fact)** | REDESIGN: org–org only | CRM relationship APIs | Drop contact FK columns later | Relationship create with contact ids | CRM if it lists contact rels | relationship tests |
| `crm_notes` | Free text on entities | `body` **(C)**; contact-entity notes **(D path)** | Contact notes REMOVE; org notes REDESIGN | `/v1/crm/notes`, `/contacts/:id/notes` | Keep table if org notes remain | Filter entity types | CRM | notes tests |
| `crm_import_batches` | CSV ingest | `csv_content`; entityType `contact` **(Fact)** | REMOVE person entity type | `/v1/crm/imports*` | Stop persisting person CSV | Import execute | CRM import UI | `c1.merge-import.test.ts`, seed |
| `crm_organizations` | Company | `primary_email`, `primary_telephone`, `address` JSONB **(C)** | REDESIGN org-only semantics | Pipeline/RFP org ids | Unlikely drop; constrain semantics | Org PATCH | CRM orgs | org tests |
| `crm_accounts` | Commercial account | account name / org link **(B)** | RETAIN | `organization_id` | None for privacy REMOVE | `/v1/crm/accounts*` RETAIN | CRM Accounts; `/crm/accounts/[id]` | account tests |
| `hr_employees` | Employee directory | given/family name, email **(Fact)** | REMOVE | `hr_leave_requests`, skills, certifications, `principal_id` optional | Drop/stop-write; leave FK | `/v1/hr/employees*` | `/commercial/hr` | `i10-hr-core.test.ts` |
| `hr_leave_requests` | Leave incl. sick | employee-linked; sick type **(Fact)** | REMOVE | employee_id **(Inferred from I10 schema)** | Drop with HR | `/v1/hr/leave*` | HR page | HR tests |
| `sup_contacts` | Named supplier people | given/family, email, telephone, whatsapp **(Fact)** | REMOVE | `supplier_id` → `sup_suppliers`; import_batch_id | Drop/stop-write | `/v1/suppliers/:id/contacts*` | `/commercial/suppliers` contact form | `pg9-supplier-contact-rate.test.ts` |
| `sup_suppliers` / `sup_rates` | Company + rates | company email/phone **(C)**; rates **(B)** | RETAIN company/rates; org-only comms | Costing line items, programme items, contracts | **Must not drop** | `/v1/suppliers`, rates RETAIN | suppliers page (non-contact) | rate tests RETAIN |
| `ops_manifests` / `ops_manifest_entries` | Guest list | guest_name, email, dietary, mobility **(Fact)** | REMOVE | `ops_vouchers.manifest_entry_id` **(Fact)** | Order: vouchers **before or with** manifests | `/v1/ops/manifests*` | `/commercial/operations/[bookingId]` | `o1-ops.test.ts`, seed |
| `ops_vouchers` | Guest vouchers | `guest_name` NOT NULL; `manifest_entry_id` NOT NULL **(Fact)** | REMOVE guest-level; supplier_label may remain as **company** label if redesigned later | booking_id | Cannot leave NOT NULL guest_name/manifest_entry_id if guests go | `/v1/ops/vouchers*` | operations page voucher list | `o4-vouchers.test.ts` |
| `bkg_bookings` | Booking header | paxCount/status **(B)** | RETAIN | manifests, vouchers, field tasks | Keep; drop guest FKs later | booking APIs | bookings pages | `c9.booking.test.ts` |
| `principals` | Operator identity | email, display_name **(Fact)** | RETAIN MINIMAL | Almost every `created_by_principal_id` | **Do not drop** | `/v1/auth/login` | session | All login tests |
| `principal_credentials` | Password hash | secret, not traveller SoR | RETAIN (auth) | principals | Do not drop | login | — | token-bootstrap tests |
| `notif_email_outbox` | Outbound mail | `recipient_email`, `body_text` **(Fact)** | OWNER DECISION | templates, delivery events, allowlist, suppressions | Depends on decision | `/v1/notifications/email/*` | `/commercial/notifications` | `i3*.test.ts` |
| `notif_email_allowlist` / suppressions / digest recipients | Routing emails | email columns **(Fact)** | OWNER DECISION | outbox | Same | allowlist/suppression APIs | notifications | i3 allowlist/suppression tests |
| Commercial documents + DocumentStorage bytes | File SoR | opaque bytes **(C)** | RETAIN WITH REDESIGN | RFP docs; supplier contract documents | Keep metadata; restrict MIME/kind | `/v1/rfps/:id/documents`, content GET | RFP upload; supplier contracts | `cd-phase1-foundation.test.ts`, Class A/B storage tests |
| `privacy_dsr_cases` | DSR register | `subject_label` **(Fact)** | REMOVE identifying fields | `/v1/privacy/dsrs` | Drop or stop subject labels | privacy DSR routes | `/commercial/dsr`, `/commercial/privacy` | `p1-privacy-ropa-dsr.test.ts` |
| `consent_records` | Consent register | `notes` **(C)** | REMOVE identifying notes | `/v1/consents` | Drop notes or table | consents | `/commercial/consents` | `p3-consent-register.test.ts` |
| `privacy_processing_activities` | RoPA-style catalogue | title/purpose **(B/C)** | OWNER DECISION if no subject | `/v1/privacy/activities` | Optional retain | activities | privacy page | p1 tests |
| F2 commercial facts `payload JSONB` | Commercial overlays | unconstrained JSON **(C)** | REDESIGN bounded keys | persist routes | Do not drop facts tables | commercial-facts APIs | facts panels | `f2-*.test.ts` |
| Programme/proposal snapshots | Version snapshots | typed commercial **(B)** + JSONB **(C)** | REDESIGN if unconstrained | versions APIs | Keep versions | programmes/proposals | programme/proposal UI | c5/c8 tests |
| Field-ops cache (browser) | Offline field tasks/briefs | briefs **(C)**; guests **denied offline** **(Fact)** | REDESIGN | `localStorage`; `/v1/ops/sync/*` | No SQL table for cache blob | sync pull/push RETAIN tasks | `/field/[bookingId]`; `/commercial/sync` | field-sync tests if any |
| `ops_briefs.content` | Field brief | free text **(C)** | REDESIGN | sync bundle | Keep if non-personal | `/v1/ops/briefs*` | operations + field | o1-ops |
| Events / outbox payloads | CRM events | forbidden PII keys **(Fact)**; entity ids remain | REDESIGN after contact REMOVE | I4 outbox | Event types for contacts retire | CRM outbox debug | — | i4/crm event tests |
| Logger | JSON logs | no body by default; email/name/phone **not** redacted **(Fact)** | REDESIGN | `observability.ts` | N/A | all requests | observability page | e1-c observability tests |

**Fact:** `ops_vouchers.manifest_entry_id` and `guest_name` make guest REMOVE **non-isolated**. **Proposed:** sequence vouchers with manifests (Phase 1).

---

## 7. API dependency inventory

Classifications are **proposed** for later phases. APIs are **not** altered now.

### Person SoR — REMOVE

| Endpoint | Role |
| --- | --- |
| `GET/POST /v1/crm/contacts` | list/create contacts |
| `GET/PATCH /v1/crm/contacts/:id` | read/update |
| `POST /v1/crm/contacts/:id/archive` | archive |
| `GET /v1/crm/contacts/:id/relationships` | contact relationships |
| `GET /v1/crm/contacts/:id/activities` | contact activities |
| `GET /v1/crm/contacts/:id/notes` | contact notes |
| `POST /v1/crm/imports` + validate/execute when `entityType=contact` | person CSV |
| `GET /v1/hr/employees`, `POST`, `GET/PATCH /:id` | employees |
| `POST/DELETE /v1/hr/employees/:id/skills` | employee skills |
| `GET/POST /v1/hr/leave` + submit/approve/reject/cancel | leave incl. sick |
| `POST/PATCH/DELETE /v1/suppliers/:id/contacts[/:contactId]` | supplier persons |
| `POST /v1/suppliers/imports*` when `entity_type=supplier_contact` | person CSV |
| `GET/POST /v1/ops/manifests/by-booking/:bookingId` | manifest |
| `POST /v1/ops/manifests/:id/entries` | guest rows |
| `POST /v1/ops/manifests/:id/publish` | publish guests |
| `GET/POST /v1/ops/vouchers*` (generate/issue/issue-all) | guest_name vouchers |
| `GET/POST /v1/privacy/dsrs*` | DSR cases with subject_label |
| `GET/POST/PATCH /v1/consents*` | consent notes |

### Search / duplicates — REMOVE or REDESIGN

| Endpoint | Note |
| --- | --- |
| `GET /v1/crm/search` | **Fact:** CRM search exists; **Inferred:** likely includes contacts — treat person hits as REMOVE |
| `GET /v1/crm/duplicates*` | Contact email/phone/name signals **(Fact)** — REMOVE person duplicate path |

### REPLACE (business-level, not invented as code)

| Endpoint class | Note |
| --- | --- |
| Org/account APIs | RETAIN; no automatic “contact available externally” field unless a later grant specifies it |
| Supplier company APIs | RETAIN `/v1/suppliers`, rates, seasons, contracts, hotel-profile |

### REDESIGN

| Endpoint | Note |
| --- | --- |
| `GET/POST/PATCH /v1/crm/notes*` | Drop contact entity; bound org notes |
| `GET/PUT /v1/ops/briefs*` | Non-personal brief semantics |
| `POST /v1/ops/sync/pull|push` | Keep tasks; no guest bundle (**already denied offline**) |
| `POST /v1/rfps/:id/documents`, `GET .../content` | Restrict kinds/MIME |
| `POST /v1/suppliers/:id/contracts/:id/documents` | Same |
| Logger (not an HTTP resource) | Redact email/name/phone |

### RETAIN (commercial / auth)

`/v1/auth/login`; `/v1/pipeline/opportunities*`; `/v1/crm/organizations*`; `/v1/crm/accounts*`; `/v1/programmes*`; `/v1/rfps*` (non-document); `/v1/costing/*`; `/v1/proposals*`; `/v1/suppliers` (non-contact); rate conflict/heatmap/calendar; commercial-facts routes; booking header routes.

### OWNER DECISION REQUIRED

`/v1/notifications/email/outbox`, allowlist, suppressions, digest recipients, SES webhook, templates — all persist or route **email addresses**.

### Unrestricted PD-capable payloads — REDESIGN

Any `notes`, `body`, `content`, `requirementsText`, AI draft `body`, commercial-facts `payload` POST/PUT — **C** capability **(Fact from audits)**.

---

## 8. UI dependency inventory

| Route/page | Component (as implemented) | Data source | API | Disposition | Later phase |
| --- | --- | --- | --- | --- | --- |
| `/commercial/crm` | Contacts tab; import | crm-api | `/v1/crm/contacts`, imports | REMOVE person tab/import | 3, 4 |
| `/commercial/crm` | Organizations/Accounts/Tasks | crm-api | orgs/accounts | RETAIN | — |
| `/commercial/crm/accounts/[id]` | Account + commercial facts panel | crm + facts APIs | accounts, facts | RETAIN | — |
| `/commercial/hr` | Given/family name form | hr-api | `/v1/hr/employees`, leave | REMOVE | 3 |
| `/commercial/hr/certifications` | HR certs | HR APIs | HR | REMOVE with HR **(Inferred)** | 3 |
| `/commercial/suppliers` | Contact form givenName/email | suppliers-api | `/contacts` | REMOVE contact form; RETAIN company/rates | 3, 4 |
| `/commercial/operations/[bookingId]` | Guest name input; voucher list | ops-api | manifests, vouchers | REMOVE guest UI | 3 |
| `/commercial/operations` | Ops list | ops | workbench | RETAIN minus guests | 3 |
| `/field/[bookingId]`, `/field` | Field sync cache | field-sync-api, field-offline-cache | `/v1/ops/sync/*` | REDESIGN briefs; guests already offline-denied | 6 |
| `/commercial/sync` | Sync policy UI | ops sync | policy/pull | REDESIGN | 6 |
| `/commercial/dsr`, `/commercial/privacy` | DSR / activities | privacy-api | `/v1/privacy/dsrs`, activities | REMOVE DSR subjects; activities Owner Decision | 3 |
| `/commercial/consents` | Consent notes | consent-register-api | `/v1/consents` | REMOVE identifying notes | 3 |
| `/commercial/rfps/[id]` | Document upload | commercial-documents-api | documents POST/GET | REDESIGN upload policy | 5 |
| `/commercial/notifications` | Email outbox/allowlist surfaces | notifications APIs | email/* | OWNER DECISION | 6 |
| `/commercial/pipeline`, `/pipeline/[id]` | Opportunities + facts | pipeline-api | opportunities | RETAIN | — |
| `/commercial/programme` | Programmes | programme APIs | programmes | RETAIN; notes REDESIGN | 5 |
| `/commercial/proposals`, `/proposals/[id]` | Proposals | proposal APIs | proposals | RETAIN | — |
| `/commercial/ai` | AI drafts | AI APIs | drafts **body** | REDESIGN free text | 5 |
| Login / session | EosSessionProvider, eos-session.ts | `/v1/auth/login`; sessionStorage email | login | RETAIN MINIMAL | 6 minimize |

**Fact:** no dedicated “create contact” form is required on CRM list; **API + CSV + display** still constitute person SoR.

---

## 9. Import/export dependency inventory

| Pathway | Endpoint | Parser / schema | Persistence | UI | Tests | Target |
| --- | --- | --- | --- | --- | --- | --- |
| CRM contact CSV | `POST /v1/crm/imports` entity `contact` | `crm-import.ts` givenName, familyName, email, telephone | `crm_contacts` + `csv_content` | CRM import | `c1.merge-import.test.ts`, seed | **REMOVE** |
| CRM org CSV | same imports, entity `organization` | legal name etc. | `crm_organizations` | CRM import | merge-import | **RETAIN/REDESIGN** company-only |
| Supplier contact CSV | `POST /v1/suppliers/imports` `supplier_contact` | `supplier-import.ts` name, email, telephone, whatsapp | `sup_contacts` + csv | suppliers | supplier import tests | **REMOVE** |
| Supplier / rate / content_block CSV | same | company/rate columns | `sup_suppliers`, `sup_rates` | suppliers | pg-supplier, pg29 season | **RETAIN/REDESIGN** |
| Season import | `/v1/suppliers` season import paths | season CSV | seasons | suppliers | `pg29-season-import.test.ts` | **RETAIN** (commercial) |
| Suppression import | `POST /v1/notifications/email/suppressions/import` | email list | suppressions | notifications | i3 suppression tests | **OWNER DECISION** |
| Heatmap / digest / allowlist **export** | GET `.../export` | CSV/JSON export | read-only | notifications, suppliers heatmap | i3/i4 export tests | **REDESIGN** if emails exported |
| Commercial document upload | not CSV person-row; file bytes | MIME allowlist | DocumentStorage | RFP page | cd-phase1 tests | **REDESIGN** §11 |
| RFP “import” of mailbox | — | — | — | — | — | **Fact:** no inbound email ingest connector |

**Proposed:** removing UI contact forms **without** removing `entityType=contact` / `supplier_contact` import still allows person ingest (**Fact** of import APIs).

---

## 10. Free-text / JSON / JSONB dependency inventory

Do not merely list names: **enter → persist → display → export/transmit**.

| Field | Enter | Persist | Display | Export/transmit | Kind | Future |
| --- | --- | --- | --- | --- | --- | --- |
| `crm_notes.body` | POST `/v1/crm/notes` | `crm_notes` | CRM | outbox events (body forbidden on CRM events **Fact**) | Arbitrary | Contact notes REMOVE; org notes bound |
| RFP `notes`, `requirementsText` | RFP PATCH/create | rfp row | `/commercial/rfps/[id]` | not a mailbox ingest | Arbitrary / commercial narrative | Controlled non-personal |
| Programme `internalNotes`, `clientNotes`, item `description`/`notes` | programme APIs | programme tables | programme page | snapshots | Mixed | Bound or REMOVE client-facing identity |
| Opportunity `programmeSummary` | pipeline POST | opportunities | pipeline | — | Narrative | Bound |
| `ops_briefs.content` | PUT briefs | `ops_briefs` | operations + **sync bundle** + field cache | field devices | Arbitrary | Bound; cache follows |
| AI draft `body` | AI APIs | ai_drafts | `/commercial/ai` | — | Arbitrary | Bound or REMOVE as PD dump |
| Commercial facts `payload JSONB` | facts PUT | F2 tables | facts panels | persist tests | Intended commercial; unconstrained | Bound keys |
| Proposal/programme `snapshot` JSONB | version POST | snapshot columns | proposal/programme | — | Mostly commercial **(Fact types)** | Keep shape; forbid extra person keys |
| Org `address` JSONB; contact `communication_preferences` | org/contact PATCH | CRM | CRM | — | C / D | Org-only; contact prefs die with contacts |
| Import `csv_content`, `validation_results` JSONB | import POST | batches | import status | — | Person CSV | REMOVE person batches |
| SES delivery `payload` JSONB | webhook | delivery events | notifications | — | May include recipient | Owner Decision |
| Knowledge/crisis/audit `body` | respective APIs | those tables | crisis/knowledge/audit-ia | — | Arbitrary **(C)** | Bound; not commercial-path required |

**Owner Decision:** whether remaining commercial notes are allowed at all vs structured-only fields.

---

## 11. DocumentStorage dependency inventory

**Fact:**

| Piece | Location |
| --- | --- |
| Port | `packages/kernel/src/commercial-document.ts` (`DocumentStorage`, MIME allowlist PDF/DOCX/XLSX/CSV/JPEG/PNG, 10 MiB) |
| Adapter | `LocalFsDocumentStorage` `apps/api/src/commercial-documents/storage.ts` (`put/get/exists/stat/delete` on **filesystem**; HTTP delete **not** registered on commercial-document routes) |
| Upload HTTP | `POST /v1/rfps/:id/documents`; `POST /v1/suppliers/:id/contracts/:contractId/documents` |
| List/meta | `GET /v1/rfps/:id/documents`; `GET /v1/commercial-documents/:id` |
| Download | `GET /v1/commercial-documents/:id/content` |
| Service | `uploadCommercialDocument` in `commercial-documents/service.ts` |
| UI | RFP page “Upload PDF / DOCX / XLSX”; supplier contracts |
| Authz | principal + Human-only mutate (`canMutateCommercialDocument`) |
| Tests | `cd-phase1-foundation.test.ts`; e1-d Class A/B localfs tests |
| Production | local-fs **forbidden** in production-like config (`infrastructure-contract.ts`); object store **unselected** (ADR-0006 OPEN) |

**No repository evidence** that identity documents are stored. Generic bytes **can** contain personal data.

**Proposed later:** restrict kinds to approved commercial documents; reject identity-doc purpose; optional move storage outside EOS. **No vendor chosen.**

---

## 12. Notification dependency inventory

**Fact:** I3 email outbox `notif_email_outbox.recipient_email`, `body_text`; templates; SES webhook; allowlist; suppressions; DLQ/allowlist digest **recipient** APIs; `/commercial/notifications`. Adapter is Dev/Test (migration comment: records instead of SMTP). Credentials/secrets: bootstrap passwords exist as env names in logger redact set; **no Production mail credentials asserted**.

**Architectural consequences (not a product choice):**

| Option | Consequence |
| --- | --- |
| **A. Remove recipient email from EOS** | Outbox/allowlist/suppression/digest-recipient tables and APIs cannot store personal (or any) recipient addresses; operators use external mail. DLQ/ops alerting **leaves EOS**. |
| **B. Retain capability via external communication** | EOS emits a **non-address** signal (principal id / org id); an **unselected** external system sends mail. Still **Owner Decision**; no vendor. |
| **C. Minimal technical notification** | In-app `/v1/notifications` dismiss/unread **without** email outbox — **Fact:** in-app notification list exists separately from email outbox. Could remain if it does not persist personal emails. |

**Do not send email. Do not create credentials. Do not claim Production readiness.**

---

## 13. Logging dependency inventory

**Fact (`apps/api/src/observability.ts`):** `onRequest` sets correlation/request ids; `onResponse` logs method/path/status/correlation — **not** bodies; `onError` logs `error.message`; redact set is passwords/tokens/secrets **only**.

**Where person data could appear (Inferred from code paths + audit):** if handlers pass contact/guest/HR objects to `logger.*`; if `error.message` includes submitted email; notification modules logging `recipient_email`; CRM search query strings.

**Proposed later:** extend redact keys (email, telephone, mobile, guestName, whatsapp, givenName, familyName); keep no-body default; never log `csv_content` or document bytes. Preserve correlation ids.

---

## 14. Field-ops cache dependency inventory

**Fact:**

- Policy: `allowedEntities: field_task, brief`; `deniedOfflineEntities` includes `manifest_entry` (`apps/api/src/ops/field-sync.ts`).
- Bundle: booking id/code/title, field tasks, **brief content** (`apps/web/src/lib/field-sync-api.ts`).
- Browser: encrypted payload in `localStorage` (`field-offline-cache.ts`); device id + salt; TTL 24h; survives browser restart until TTL/clear; **not** a server DB blob for the encrypted cache.
- APIs: `GET /v1/ops/sync/policy`, `POST /v1/ops/sync/pull|push`, conflicts.
- UI: `/field/[bookingId]`, `/commercial/sync`.

**Guests:** not in offline cache **(Fact)**; **online** manifests still person SoR until REMOVE.

**After guest REMOVE:** cache still holds **briefs** (free-text). Redesign briefs then cache. Field **tasks** (title/status) can remain.

---

## 15. Technical identity dependency inventory

**Fact:**

| Item | Location |
| --- | --- |
| Table | `principals` (`email`, `display_name`, tenant, actor_type, status) `packages/db/schema.sql` |
| Credentials | `principal_credentials.password_hash` |
| Kernel type | `Principal` (`types.ts`): id, tenantId, actorType, email?, displayName, status, roles, permissions |
| Login | `POST /v1/auth/login` (`apps/api/src/server.ts`) |
| Session | `sessionStorage` token + email (`eos-session.ts`) |
| Authz | `authorize()` on routes; `principalFromAuthHeader` |
| Audit | `created_by_principal_id` / `updated_by_principal_id` on most tables |
| Tests | nearly all API tests login as `*.sedmc.local` |

**Remain:** principal id, tenant, actor type, status, roles/permissions, credential verification, audit principal ids.

**Minimize later:** display_name; sessionStorage email if token suffices; avoid logging email.

**Do not delete authentication. Do not select an IdP. Do not change auth in this task.**

---

## 16. Commercial workflow dependency analysis

**Fact — supporting objects (must NOT be removed by privacy remediation):**

```text
Opportunity     GET/POST /v1/pipeline/opportunities*
                UI /commercial/pipeline, /pipeline/[id]
                Store: opp opportunities; organizationId, accountId?, paxCount, stage

Account / Org   /v1/crm/organizations*, /v1/crm/accounts*
                UI CRM orgs/accounts; /crm/accounts/[id]
                Keys commercial path without crm_contacts

Programme       /v1/programmes*
                UI /commercial/programme
                rfpId, opportunityId, organizationId, paxCount, dates, destinations

RFP             /v1/rfps* (routes in rfp module)
                UI /commercial/rfps, /rfps/[id]
                organizationId, opportunityId, paxCount, travelDates, destinations, budgets

Proposal / facts  /v1/proposals*, costing /v1/costing/sheets*, commercial-facts
                UI proposals, pipeline facts panels
                Rate identity overlays on suppliers/rates — **not** sup_contacts

Rate identity   /v1/suppliers/:id/rates*, calendar, conflicts, heatmap
                UI /commercial/suppliers (non-contact)

Approval/handoff  commercial-approval routes; bookings /v1/ops + c9 booking
                Booking header RETAIN; guest manifest NOT required for proposal send
```

**Person-data dependencies on this path:** **none as mandatory FKs on opportunity/RFP/programme/proposal/rate (Fact of kernel types).** Ancillary: CRM contact counts on org UI; supplier contact form on same suppliers page as rates; ops guests after booking.

**Least-disruptive replacement if a screen today shows a person:** show organisation/supplier **company** + “contact available externally” **only if** a later grant adds that **business** flag — **not invented as schema in this blueprint**.

**Commercial workflow preserved: YES** provided Phases 1–3 drop person SoR **without** dropping orgs, accounts, pipeline, programmes, RFPs, costing, proposals, supplier **companies**, or rates.

---

## 17. Migration dependency analysis

**Do not write or execute migrations.** Production data state is **not established**.

| Object | Migrate data? | Remove columns later? | FK changes? | Indexes? | Seed? | History/compat? | Order? | Transitional layer? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crm_contacts | Dev/Test synthetic rows exist **(Fact)**; Production **unknown** | Yes eventually | relationship contact FKs | email indexes | seed CSV | Event types crm.contact.* | After stop-write APIs | Optional hide UI first |
| hr_* | Capability + tests | Yes | leave → employee | email unique | — | — | With HR API stop | — |
| sup_contacts | Tests | Yes | supplier_id | supplier index | import tests | entity_type supplier_contact | After import stop | — |
| ops_manifest_entries + ops_vouchers | Seed/tests | Yes | voucher.manifest_entry_id **NOT NULL** | booking indexes | seed guests | Vouchers cannot remain guest-named | **Vouchers + manifests together** | Do not leave orphan NOT NULL guest_name |
| principals | **Do not migrate away** | Minimize email later | Keep all created_by FKs | — | bootstrap users | Auth break if dropped | Never drop in privacy REMOVE phases | — |
| notif_email_outbox | Unknown Production | Depends on Owner Decision | — | — | — | Digest recipients | After decision | — |
| documents | Bytes in local-fs Dev/Test | Restrict MIME/kind | rfp/supplier FKs stay | — | upload tests | No identity-doc claim | Phase 5 | Kind allowlist |
| DSR/consent | Tests | subject_label/notes | — | — | — | — | With privacy UI | — |
| csv_content | Test batches | Stop person entity types | — | — | seed | Old batches may contain person CSV | Stop execute first | — |

**Do not claim Production contains these records. Do not claim it contains none.**

---

## 18. Test / fixture dependency analysis

| Item | Classification | Note |
| --- | --- | --- |
| `c1.contacts.test.ts` | **REWRITE / REMOVE** person cases | Contact CRUD |
| `c1.merge-import.test.ts` | **REMOVE** contact entityType cases; **REWRITE** org import | |
| `c1.search-duplicates.test.ts` | **REWRITE** drop person duplicate cases | |
| `c1.accounts-notes-tasks.test.ts` | **REWRITE** if notes use contact entity | Keep account tests |
| `crm.integration.test.ts`, `crm.security.regression.test.ts` | **REWRITE** | Org/account RETAIN |
| `i10-hr-core.test.ts`, `h1-hr-certifications.test.ts` | **REMOVE** or rewrite without employees | HR REMOVE |
| `pg9-supplier-contact-rate.test.ts` | **REWRITE** rates without contacts | |
| Supplier import tests using `supplier_contact` | **REMOVE** those cases | Keep supplier/rate import |
| `o1-ops.test.ts` guest entries | **REMOVE** guest cases; keep booking/field tasks | |
| `o4-vouchers.test.ts` | **REMOVE/REWRITE** without guestName | |
| `seed-demo-data.ts` contact CSV + guest rows | **REPLACE WITH BUSINESS-ENTITY DATA** | Orgs, rates, pax counts |
| `p1-privacy-ropa-dsr.test.ts` | **REWRITE** without subject_label | |
| `p3-consent-register.test.ts` | **REWRITE** without personal notes | |
| `i3*.test.ts`, `i4.17` digest recipients | **OWNER DECISION REQUIRED** | Email addresses |
| `cd-phase1-foundation.test.ts`, e1-d storage tests | **REWRITE** for restricted MIME/kind | Keep storage port tests |
| `c2.pipeline.test.ts`, `c5.programme.test.ts`, `c8.proposal.test.ts`, `c9.booking.test.ts`, `f2-*.test.ts` | **RETAIN** | Prove commercial path **without** contacts/guests |
| Login `*.sedmc.local` | **RETAIN** | Technical identity, synthetic |
| Web vitest CRM/facts panels | **REWRITE** if they assume contacts | Keep org/facts |
| UAT (H-119) | **RETAIN** until new UAT after Phases 8–9 | Do not reopen now |

**Proposed:** future tests must still prove Opportunity→Proposal→rates **without** creating `crm_contacts`, `sup_contacts`, `ops_manifest_entries`, or `hr_employees`.

---

## 19. Proposed phased remediation sequence

**None of these phases is executed by H-134.**

| Phase | Scope |
| ---: | --- |
| **1 Domain/schema** | Stop-write then remove/redesign `crm_contacts`, HR, `sup_contacts`, manifests/vouchers (order: vouchers+manifests together); keep orgs/accounts/rates/bookings/principals |
| **2 API/service** | Remove endpoints in §7 REMOVE; redesign notes/briefs/docs; do not remove pipeline/programme/RFP/proposal/costing/supplier-company |
| **3 UI** | Remove CRM Contacts, HR, supplier contact form, guest UI, DSR subject UI |
| **4 Import/export** | Remove person entity types; keep company/rate import; exports without personal emails unless Owner Decision |
| **5 Free-text/document** | Bound notes/JSONB; restrict DocumentStorage |
| **6 Notification/logging/cache** | After Owner Decision on mail; redact logs; redesign briefs/cache |
| **7 Tests/fixtures** | §18 |
| **8 Dev/Test regression** | Full relevant suite |
| **9 Formal UAT** | Only after Dev/Test evidence is clean; new grant |
| **10 Production readiness reassessment** | Still blocked by H-119/H-120 P0s; **not** authorization |

Do not collapse into one uncontrolled change.

---

## 20. Risks and unresolved Owner Decisions

**Owner Decisions Required:**

1. Notification outbox: remove recipient persistence vs external send vs in-app-only (A/B/C in §12).  
2. Whether organisation `primary_email` / `primary_telephone` remain as **company switchboard** (schema does **not** currently distinguish person vs switchboard — **Fact**).  
3. Whether a non-identifying processing-activity catalogue remains after DSR subject labels go.  
4. Whether any “contact available externally” **business flag** is added (H-131 pattern exists; **no** current column — do not invent in code now).  
5. Whether commercial free-text remains at all vs structured-only.

**Risks (not claimed as Production incidents):**

- Removing contacts while leaving `entityType=contact` import → residual ingest.  
- Removing manifests without vouchers → NOT NULL `guest_name` / `manifest_entry_id` break.  
- Removing HR `principal_id` links without checking leftover FKs.  
- Free-text/documents reintroduce PD after column REMOVE.  
- Logger still not redacting email if APIs still accept it during a transitional phase.

**Unresolved external evidence:** EI-01 TIN; PDPC; Production catalog contents; ADR-0006 object store.

---

## 21. Governance gates remaining open

```text
PDPC = OPEN
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
Production = NOT AUTHORIZED / NOT READY
ADR-0006 = OPEN
DP-0006 = OPEN
```

The EOS personal-data boundary does **not** create a PDPC exemption. SEDMC’s wider obligations are **not** extinguished. This increment does **not** perform PDPC registration or modify external regulatory evidence.

---

## 22. Explicit non-actions

This increment did **not**:

- modify application code, schema, migrations, APIs, UI, tests, fixtures, infrastructure, configuration, or database data  
- delete tables, columns, endpoints, files, or records  
- rename/delete existing governance artefacts  
- commit, push, reset, clean, stash, revert, or discard the dirty worktree  
- change authentication or select an IdP  
- send email or create credentials  
- configure or modify Production  

---

## 23. Conclusion

```text
The current EOS implementation is not aligned with the Owner-established
personal-data boundary. This blueprint maps the dependencies required for
controlled, phased remediation. No remediation was implemented.
Commercial workflow objects can be preserved if person SoR is removed
without dropping organizations, accounts, pipeline, programmes, RFPs,
proposals, costing, supplier companies, or rates.
```

**Next implementation phase (not authorized here):** Phase 1 domain/schema remediation **only after** an explicit Owner/implementation grant.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
```
