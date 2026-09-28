# H-141 — Notification, Logging and Field-Operations Cache Privacy Remediation

> **AUTHORIZED ASSESSMENT / REMEDIATION RECORD — Dev/Test only.**  
> This is **not** UAT, **not** Production, **not** a PDPC exemption or compliance claim, **not** a personal-data scanner, and **not** live-database validation.  
> Historical H-138, H-139, and H-140 artefacts were **not renamed, deleted, merged, or overwritten**.  
> This file is the authorized H-141 record. A first increment (20 sections, porcelain 612→622) is **expanded in place** to the required 31 sections. It is **not** a new H-142 record.

**Date:** 2026-09-22.  
**Authorization:** Owner / ChatGPT governance layer grant — H-141 notification, logging, and field-operations cache privacy (exhaustive inventory + remaining safe controls).  
**Prior dispositions carried:** H-140 PASS WITH FINDINGS; H-139 PASS WITH FINDINGS.  
**Commit / push:** **NONE**.  
**Live migration:** **NONE**.  
**Migration 126:** **NOT CREATED**.  
**Migration 125:** **unmodified**.

---

## 1. H-141 objective

Determine whether removed person-domain data can still be:

1. Persisted through notification records.
2. Included in notification recipients, subjects, or bodies.
3. Exposed through logs or audit events.
4. Retained in browser storage or field-operation caches.
5. Reintroduced through synchronization or retry payloads.
6. Exposed across accounts or tenants.
7. Retained after logout or account switching.
8. Reintroduced through legacy compatibility or generic payloads.

Safely remediate only what is clearly within H-141 authorization. Preserve legitimate commercial notification, logging, and field-ops functionality.

An address, message, log, cache, or operational payload is **not** treated as non-personal merely because it supports a commercial process. Absence of dedicated person-data tables is **not** proof that personal data cannot be stored.

---

## 2. Authorization boundary

```text
H-141 NOTIFICATION / LOGGING / FIELD-OPS CACHE — AUTHORIZED
Dev/Test only
Do not commit / push / reset / clean / stash / revert / discard
Do not run live migrations or create migration 126
Do not modify Production
Do not invent retention, legal conclusions, or organizational-email definitions
Do not redesign the entire notification, logging, or field-operations architecture
Do not delete historical records, logs, caches, or notification rows
Do not weaken authentication, authorization, tenant isolation, or audit
Do not reopen retired person-domain APIs
Do not start UAT
Do not claim Production readiness or EOS software adoption
```

Governance gates carried forward (unmodified):

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
UAT: NOT STARTED
Production: NOT AUTHORIZED / NOT READY
```

If a required change exceeded this authorization, that sub-area was documented and stopped.

---

## 3. Repository baseline before changes

**Original H-141 increment (first grant, already completed in this worktree):**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch: master
index: empty
porcelain count: 612
```

**This exhaustive H-141 increment (second grant, start of this execution):**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch: master
index: empty (git diff --cached --quiet: true)
porcelain count: 622
```

The known baseline “porcelain before H-141: 612” is **Observed** for the first increment. This exhaustive grant started at **622** because the first increment had already added H-141 files. Dirty worktree preserved. Commands:

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

Carried confirmations (**Observed** / **Historical**):

```text
H-140: PASS WITH FINDINGS
H-139: PASS WITH FINDINGS
Migration 125: unmodified (packages/db/migrations/125_h135_phase1_personal_data_domain.sql present)
Migration 126: not created (no 126_*.sql)
Live migration: not run
```

H-138 / H-139 / H-140 governance records remain present and were not overwritten.

---

## 4. Repository baseline after changes

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba (unchanged)
branch: master (unchanged)
index: empty (unchanged)
porcelain count: 622 (this exhaustive increment modified already-dirty / already-untracked files)
COMMIT: NONE
PUSH: NONE
```

See section 7 for dirty-worktree preservation. Porcelain after this exhaustive increment is recorded again after the governance write.

---

## 5. Branch and HEAD

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
BRANCH: master
```

**Observed.** No checkout, reset, or branch change.

---

## 6. Index state

```text
INDEX: empty
git diff --cached --quiet: true
```

**Observed.** No `git add`. No commit.

---

## 7. Dirty-worktree preservation

All pre-existing dirty and untracked files were left in place. No reset, clean, stash, revert, discard, or overwrite of unrelated work. Historical governance artefacts H-138 (Phase C and import), H-139 (import and residual), and H-140 were not modified.

This exhaustive increment only edited already-dirty H-141 surfaces plus this record.

---

## 8. Notification inventory

Searched `apps/`, `packages/`, `docs/`, `migrations/`. Classification uses the required labels. Recipients are **not** assumed to be organizational mailboxes.

| Surface | Executable? | Auth | Tenant/account | Recipients may identify individuals | Subjects/bodies may contain personal info | Persisted | Failed/rejected persist | Logs | Exports/APIs | Migration 126 | Owner decision | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| In-app inbox `GET /v1/notifications` (`buildLiveNotifications`) | Yes | 401 required (**Tested**) | Tenant-filtered in builder (**Static**) | Allowlist reminder interpolates `entry.email` | Titles/bodies from RFP/booking/finance/DLQ keys; allowlist email in body | Dismissals only (`notif_dismissals`) | N/A for live compute | `request_completed` path only | List/dismiss APIs | No | Recipient/body policy | **RETAIN WITH CONTROL** |
| Dismissals | Yes | Auth | Principal + tenant | No (key + ids) | No | Yes | Rejected dismiss not a person store | Path only | Inbox API | No | No | **RETAIN WITH CONTROL** |
| Email outbox `notif_email_outbox` | Yes (SMTP/SES adapters; stubs in Dev/Test) | 401 (**Tested**) | Tenant + principal scoped list (**Static**) | `recipient_email` may identify a person | `subject` / `body_text` persist; HTTP list **omits** `bodyText`/`bodyHtml` (**Tested**) | Yes including **failed** sends | Failed SMTP/SES still `recordOutboxEntry(..., "failed")` (**Observed**) | Skip reasons are codes after H-141; SMTP exception `smtp_error:${line}` is local socket, not HTTP | Outbox list API; bodies omitted | Changing persistence would be schema/retention | Retention + recipient policy | **RETAIN WITH CONTROL** + residual |
| Digest dispatch | Yes | `notification:dispatch:email` | Tenant | Uses `principal.email` | Template interpolation of notification title/body | Outbox | Failed persist as above | Codes | Outbox | No | Who may receive | **REQUIRES OWNER DECISION** (recipients) |
| Templates `notif_email_templates` | Yes | Auth + permission | Tenant | N/A | Subject/body prose **not scanned**; person-domain **keys** rejected (**Tested**) | Yes after validation | Rejected PUT does not persist (**Tested**) | Path | GET/PUT/preview | No | Prose policy | **RETAIN WITH CONTROL** |
| Allowlist `notif_email_allowlist` | Yes | Auth + permission; partner GET **403** (**Tested**) | `tenantId` on every row (**Static** + **Tested** isolation) | Arbitrary email strings | Notes free text | Yes | Extra keys (`givenName`) rejected with no persist (**Tested**) | Path; query stripped (**Tested**) | List + CSV/JSON export (emails by design) | No | Recipient policy | **RETAIN WITH CONTROL** / **REQUIRES OWNER DECISION** |
| Dual-control / stale allowlist digest + recipients | Yes | Permissioned | Tenant | Digest recipient emails | Bodies include operational counts/emails | Yes | Not redesigned | Path | Export presets | No | Recipients + retention | **DEFER WITH DOCUMENTED FINDING** |
| DLQ SLA digest / recipients / stale export | Yes | Permissioned | Tenant (existing I4 tests isolate partner presets — **Historical**, not re-run this increment) | Recipient emails | Event-type summaries; not a guest store | Yes | Not redesigned | Path | CSV/JSON exports include operational identifiers | No | Recipients + export policy | **DEFER WITH DOCUMENTED FINDING** |
| SES delivery events JSONB | Yes (webhook) | Webhook secret, not principal | Tenant on stored events | `recipient_email` | `payload` JSONB; `includePayload=1` can return it | Yes | Webhook unauthorized does not invent inbox rows (**Static**) | Path | Delivery-events API | Dropping payload = schema | Retention | **DEFER WITH DOCUMENTED FINDING** |
| Suppressions | Yes | Permissioned | Tenant | Email addresses | N/A | Yes | Import of suppressions is email-keyed, not CRM contacts | Path | Export | No | Recipient policy | **DEFER WITH DOCUMENTED FINDING** |
| SMTP transport | Executable when configured | N/A (adapter) | N/A | RCPT TO uses `message.to` | Sends `bodyText` to relay | Relay + outbox | HTTP skip `smtp_send_failed` without exception text (**Observed**) | Not HTTP-logged | N/A | No | No | **RETAIN WITH CONTROL** |
| SES transport | Executable when configured | N/A | Tenant tags | Same | Same | SES + outbox | `ses_send_failed` | Not HTTP-logged | N/A | No | No | **RETAIN WITH CONTROL** |
| WhatsApp / other outbound identifiers | **No outbound adapter found** (**Observed** search) | N/A | N/A | Leftover `SupContact.whatsapp` type / CSV docs / commercial **channel label** `whatsapp` | N/A for dispatch | Historical schema `sup_contacts.whatsapp` (H-135/H-139 domain) | N/A | Logger redacts key `whatsapp` (**Tested**) | N/A | Not created here | Historical leftover vs channel enum | **DEFER WITH DOCUMENTED FINDING** (no executable WhatsApp notification) |
| UI bell / commercial notifications page | Yes | Session | Same APIs | Shows live items | Shows titles/bodies as returned | Client display | N/A | N/A | N/A | No | No | **RETAIN WITH CONTROL** |

Do not claim notification content is non-personal because it is operational.

---

## 9. Notification persistence findings

**Tested:**

- Unauthenticated GET inbox, GET outbox, POST field sync push → **401**.
- Commercial template upsert still **200**.
- Outbox HTTP items omit `bodyText` / `bodyHtml`.
- Allowlist/template/sync payloads with nested person-domain keys (`givenName`, `guestName`) → **400** `person_domain_removed`; allowlist length / template count / `opsSyncConflicts` unchanged.
- Commercial allowlist create without those keys → **201**.
- Partner-demo principal **cannot** list SEDMC allowlist emails (GET **403**; body does not contain the SEDMC address).

**Observed / Static:**

- Failed SMTP/SES still persist a `failed` outbox row including `body_text`. That is **not** a rejected-validation partial write; it is an authorized commercial persist-on-failure. Retention was **not** invented. No historical rows deleted.
- Retry/duplicate path is `already_dispatched` skip; it does not bypass the H-141 key contract on allowlist/template/sync because those writes re-run `rejectPersonDomainContent`.
- Error responses for person-domain rejects are `{ error, reason }` without echoing unrestricted bodies.
- In-app allowlist reminder still interpolates `entry.email` into live notification body (**Observed** in `notifications.ts`). Not removed (would be a product/policy change).

**Deferred (exceeds authorization):**

- Dropping `body_text` / SES JSONB / allowlist emails requires Owner retention/schema decision — possible migration 126 if tables change. **Stopped** that sub-area.

---

## 10. Logging and audit inventory

| Path | What is logged/persisted | Bodies / query / secrets | Evidence |
| --- | --- | --- | --- |
| `request_completed` | method, **path without query**, status, correlation/request ids | **Not** request/response bodies. Query string stripped this increment | **Tested** (`GET /v1/notifications?email=secret.person@example.com` log does not contain the email) |
| `request_error` | `err: error.message` | Not request body | **Static** |
| `authentication_failed` | `tenantSlug` + reason | Not email | **Historical Tested** (e1-c suite; re-run this increment) |
| `authentication_succeeded` | `principalId`, `actorType`, `tenantId` | Not email | **Observed** in this run’s stdout |
| `login_rate_limited` | tenantSlug/remaining | In-memory key includes email; not printed as a request body | **Static** |
| Logger `REDACT_KEYS` | Key-name redaction | Secrets/tokens/passwords; CRM-aligned keys; `recipientEmail`, `bodyText`, `bodyHtml`, `whatsapp` | **Tested** |
| CRM domain events | Forbidden payload keys | `email`, `body`, `csvContent`, etc. | **Static** / prior H-134 |
| NATS consumer failure | `err.message` | Not envelope payload | **Static** |
| Audit `previous_state` / `new_state` JSONB | May snapshot commercial objects | Not redesigned | **Static**; **Deferred** |
| Import validation | Row errors may echo cell text; HTTP sanitize omits CSV (H-139) | Residual | **Tested** residual import suite |
| SMTP local exception | `smtp_error:${line}` on socket fail | Relay response line, not HTTP skip reason | **Static** |
| Client error reporting | No dedicated browser error-reporter posting payloads was found | — | **Static** |
| Background/job logs | Notification adapters return status codes | Failed send not HTTP-logged with body | **Observed** in code |
| Cache/sync errors | Field push 400 `person_domain_removed` | No payload echo | **Tested** |

Absence of a log line is **not** claimed as complete runtime verification of every process. Paths not executed are **Unverified**.

---

## 11. Logging/redaction findings

Established controls **Observed**: no request-body logging on `request_completed`; secret/token/password redaction; correlation ids; `productionReady: false` on log lines.

**This increment (authorized):**

- Strip query string from logged `path` (`requestPathWithoutQuery`).
- Add `whatsapp` to `REDACT_KEYS` (align with `PERSON_DOMAIN_OBJECT_KEYS` / H-134 proposal — **not** a content scanner).
- First increment already added `recipientEmail` / `bodyText` / `bodyHtml`.

**Not claimed:** all free-text is sanitized. Keys such as `to`, SMTP DATA lines, or differently named JSON fields are **not** automatically redacted. Auditability was not weakened (correlation/principal **ids** remain).

---

## 12. Field-operations cache inventory

| Item | Storage | Data written/read | Key | Account/tenant | Logout | Account-switch | Expiration | Stale access | Encryption | Tests | Safe change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Field offline cache | `localStorage` AES-GCM blob | Sync bundle: booking code/title, `field_task` status/title, ops `brief.content`, pending deltas | `sedmc-field-cache:{bookingId}` | Meta `sedmc-field-cache-meta:{bookingId}` = principal UUID; decrypt key includes `deviceId:principalId:salt` | `clearSession` → `clearFieldCaches` | `storeSession` → `clearFieldCaches` (this increment) | Policy `cacheExpiresAt` 24h; **client does not auto-delete** | Pre-H-141: any same-browser user could decrypt using stored meta principal. **Remediated.** | AES-GCM (**Observed** kernel crypto) | **Tested** | Yes (binding + clear + key reject) |
| Pending deltas | Same blob | `SyncPushDelta` payloads | Same | Bound to principal | Cleared with cache | Cleared | Same | Reject person-domain keys before queue | Same | **Tested** | Yes |
| Server sync push | Memory/PG ops collections | `field_task` status/title only after authorize | Session tenant-scoped | Tenant + booking session | N/A | N/A | N/A | Person-domain keys rejected; no conflict persist | Server store | **Tested** | Yes |
| Device id / salt | `localStorage` `sedmc-field-device-id`, `sedmc-field-cache-salt` | Random device UUID + salt | Fixed keys | Not principal-scoped | **Not cleared** (not person-domain records) | Not cleared | None | Remaining after logout | Used as crypto inputs | **Static** | Clearing would be a product decision — **Deferred** |
| `manifest_entry` | Kernel type / denied offline | Guest manifests remain `person_domain_removed` | N/A | N/A | N/A | N/A | N/A | Offline policy denies | N/A | H-138 **Tested** this increment | Not reopened |
| Ops brief `content` | In cache blob | Unconstrained prose | Same cache | Principal-bound after H-141 | Cleared | Cleared | Unscanned | Can contain personal data in strings | Encrypted at rest in blob | Not a scanner | **DEFER WITH DOCUMENTED FINDING** |

No IndexedDB. No service-worker caches. No field-ops product redesign.

---

## 13. Browser-storage inventory

| Store | Contents | Key structure | Logout | Account-switch | Notes |
| --- | --- | --- | --- | --- | --- |
| `sessionStorage` | `sedmc.eos.accessToken`, `sedmc.eos.email`, `sedmc.eos.principalId` | Fixed keys (not tenant-prefixed) | Removed (**Tested**) | Overwritten after cache clear (**Tested**) | Email is the login mailbox. `sessionStorage` is **not** assumed automatically safe. |
| `localStorage` field cache | Encrypted operational bundle + plaintext principal UUID in meta while cached | Prefix + bookingId | Blobs+meta removed (**Tested**) | Same (**Tested**) | `localStorage` is **not** assumed automatically unsafe; the pre-H-141 defect was principal-unbound **read**. |
| IndexedDB | **None found** | — | — | — | **Observed** search |
| Service worker / Cache API | **None found** | — | — | — | **Observed** search |
| In-memory React field-page state | Bundle/tasks | Component state | Lost on navigation | New session | Not durable |

`eos-client.ts` reads the same access-token session key. No additional person-domain cache labels added (**Tested** source assertion).

---

## 14. Cache isolation and stale-data findings

| Risk | Finding | Class |
| --- | --- | --- |
| Cross-principal field-cache read (same browser) | Pre-H-141 decrypt used stored meta principal. Now fail-closed unless `currentPrincipalId` matches stored meta **and** `session.principalId`. | **Observed** defect; **Tested** remediation |
| Cross-tenant allowlist API | Partner GET 403; SEDMC email not in body | **Tested** |
| Cross-tenant outbox | List filtered by tenant+principal in code | **Static**; not a live PG isolation claim |
| Stale cache after logout | Cleared | **Tested** |
| Stale cache after account-switch without logout | `storeSession` now clears first | **Tested** |
| Persistence of removed person-domain fields in cache/deltas | Key walk rejects; queued delta returns null without write | **Tested** |
| Re-submission of retired payloads via sync | Server `rejectPersonDomainContent` after authorize | **Tested** |
| Duplicate/partial sync | Existing conflict gate unchanged (I9 **Tested**) | **Tested** commercial |
| DevTools exposure | Encrypted blob still visible as ciphertext; meta principal UUID visible until logout; device id/salt remain | **Static**; **Deferred** (not a redesign) |
| Error messages | Person-domain rejects do not echo bodies | **Tested** status/reason |

Schema/redesign issues (TTL auto-expire, clearing device salt, scanning brief prose) were **not** implemented.

---

## 15. Reintroduction audit

| Removed domain | Dedicated path | Secondary surfaces this grant | Classification |
| --- | --- | --- | --- |
| CRM individual contacts | Prior fail-closed APIs | Notifications/logs/cache do not recreate `crm_contacts`. Allowlist emails are not CRM contacts. | Dedicated path **Rejected**. Allowlist emails **Persisted** (operational). |
| HR employee / leave | Prior fail-closed | No HR cache/notification store added | **Rejected** dedicated path |
| Supplier individual contacts | H-139 residual **Tested** this increment | No WhatsApp dispatch. Leftover `SupContact.whatsapp` type/docs | **Compatibility-only** / **Historical**. Import retired **Tested**. |
| Guest manifests / vouchers | API `person_domain_removed` | Offline denies `manifest_entry`; leftover `ops-api.ts` guest types | API **Rejected**. Types **Compatibility-only**. UI retired **Tested** (H-138 suite). |
| DSR / consent identifying fields | Prior H-138 | Not reintroduced in notifications/cache | **Rejected** dedicated path |
| Generic JSON / retry / DLQ | Key contract on allowlist/template/sync/cache | String values in subjects/bodies/briefs **unscanned**. Failed outbox **Persisted**. DLQ records are event operational data **Executable** | **Unresolved** for prose; **not** a substitute CRM/HR/guest module |
| Historical JSON / migrations | `sup_contacts.whatsapp` in 014 | Not deleted | **Historical** |
| Test-only | H-141 fixtures use `guestName` only as reject probes | — | **Test-only** |

Historical references were not deleted to reduce search results. A rejected API path is **not** equivalent to removal of every indirect storage capability (outbox bodies, allowlist emails, briefs).

---

## 16. Exact files changed

H-141 implementation and tests (both increments; this exhaustive increment edited the same set):

- `apps/web/src/lib/field-offline-cache.ts`
- `apps/web/src/lib/eos-session.ts`
- `apps/web/src/components/commercial/EosSessionProvider.tsx`
- `apps/web/src/app/field/page.tsx`
- `apps/web/src/app/field/[bookingId]/page.tsx`
- `apps/api/src/ops/field-sync.ts`
- `apps/api/src/notifications/email.ts`
- `apps/api/src/notifications/email-allowlist.ts`
- `apps/api/src/notifications/routes.ts`
- `apps/api/src/observability.ts`
- `apps/api/src/h141-notification-logging-field-cache.test.ts`
- `apps/web/src/h141-notification-logging-field-cache.test.ts`
- `docs/governance/h-141-notification-logging-field-cache-remediation.md` (this record)

H-138 / H-139 / H-140 governance files: **unchanged**.

---

## 17. Exact changes made

**First increment (already in worktree before this exhaustive grant):**

- Field cache: principal-bound reads; `clearFieldCaches`; person-domain key reject on write/delta (kernel `findPersonDomainObjectKeys`; file does not contain the string `guestName` — H-138 source test).
- Session: store `principalId`; logout clears field caches.
- Field pages: pass `getStoredPrincipalId()`.
- Login provider: persist `principal.id`.
- Field sync push: `rejectPersonDomainContent` after authorize.
- Templates/allowlist: key reject; routes pass raw JSON so extra keys reach the contract.
- SMTP/SES HTTP skip reasons: `smtp_send_failed` / `ses_send_failed` (no raw exception).
- Logger: redact `recipientEmail`, `bodyText`, `bodyHtml`.

**This exhaustive increment:**

- `storeSession` clears field caches **before** writing the new session (account-switch without explicit logout).
- Logger: redact `whatsapp`; log `path` without query string.
- Tests: query-strip + whatsapp redact; partner allowlist isolation; web account-switch clear.
- This governance record expanded to 31 sections.

---

## 18. Changes deliberately not made

- No commit / push / reset / clean / stash / revert / discard
- No migration 126; no live migration; no Production change
- No deletion of historical outbox, allowlist, SES payloads, audit rows, or caches
- No notification or field-ops architecture rewrite
- No new identity provider
- No invented organizational-email definition or retention periods
- No scanning of notification/brief/outbox **string values**
- No drop of leftover `ops-api.ts` guest types
- No clearing of device id/salt on logout
- No client TTL auto-expiry of blobs
- No comprehensive DLP / content scanner
- No UAT; no Production readiness claim
- H-138 / H-139 / H-140 records not overwritten

---

## 19. Owner decisions required

1. Whether staff `principal.email`, allowlist addresses, digest recipients, and suppression emails may identify individuals, and what policy applies (no organizational-mailbox definition was invented).
2. Whether outbox `body_text`, SES delivery JSONB, and `includePayload` delivery-event reads may retain notification prose (retention).
3. Whether in-app allowlist reminder may continue to interpolate `entry.email`.
4. Whether ops brief free-text in the field cache must be structured or prohibited.
5. Whether leftover `guestName` TypeScript types in `ops-api.ts` / kernel voucher types should be removed in a later authorized cleanup.
6. Whether device id/salt should be rotated or cleared on logout.
7. H-139 leftover PG CHECKs listing `contact` / `supplier_contact` (still would require Owner-authorized migration 126).
8. PDPC / EI-01 / ADR-0006 / DP-0006 remain OPEN.

---

## 20. Migration 126 status

```text
migration 126: NOT CREATED
status: NOT REQUIRED for H-141 application/client controls
live migration: NONE
migration 125: unmodified
```

**Tested** (`listMigrationFiles()` last file contains `125_h135_phase1_personal_data_domain`; no `/126_` path).

Outbox already stores recipient/subject/body. Changing that would be a schema/retention redesign requiring Owner authorization — **not implemented**. H-139 PG CHECK leftovers remain a **possible** future 126, **not created here**.

---

## 21. Authentication and authorization findings

**Tested:** 401 on unauthenticated inbox, outbox, and field sync push. Partner-demo cannot read SEDMC allowlist (403). Person-domain writes require auth then fail closed.

**Observed / Static:** outbox/allowlist/template/sync use `principalFromAuthHeader` + `authorize` permissions. Tenant columns/filters exist in code.

**Not claimed:** complete security validation, Production SES, live PostgreSQL cross-tenant isolation, or every export/DLQ route in this increment.

Authentication, authorization, tenant isolation, and audit were **not weakened**.

---

## 22. Persistence and partial-write findings

**Tested:** rejected person-domain keys do **not** persist allowlist rows, template rows, or sync conflicts; cache writes throw; queued deltas return null without adding `pendingDeltas`.

**Observed:** failed SMTP/SES **do** persist a complete `failed` outbox row (intentional commercial path). That is not a half-written reject. HTTP errors for validation rejects do not create those rows.

**Unresolved:** historical outbox/allowlist/SES rows were not inspected in a live database and were not deleted.

---

## 23. Tests and exact results

Targeted only. **Not** a full-suite result. Exact commands executed:

```text
apps/web          npx tsc -p tsconfig.json --noEmit     EXIT 0
apps/api          npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/kernel   npx tsc -p tsconfig.json --noEmit     EXIT 0
packages/db       npx tsc -p tsconfig.json --noEmit     EXIT 0
```

```text
packages/kernel
  Command: npx vitest run src/field-cache-crypto.test.ts src/personal-data-content-contract.test.ts
  Test Files  2 passed (2)
  Tests       6 passed (6)
  Failed      0
  Skipped     0
  EXIT 0
```

```text
apps/api
  Command: npx vitest run ^
    src/h141-notification-logging-field-cache.test.ts ^
    src/i3-notifications.test.ts ^
    src/i3.4-email.test.ts ^
    src/i3.14-email-allowlist.test.ts ^
    src/i8-i9.test.ts ^
    src/e1-c-closure.observability.test.ts ^
    src/h139-residual-import-hardening.test.ts
  Test Files  7 passed (7)
  Tests       25 passed (25)
  Failed      0
  Skipped     0
  EXIT 0
  h141-notification-logging-field-cache: 7
  i3-notifications: 2
  i3.4-email: 1
  i3.14-email-allowlist: 2
  i8-i9: 6
  e1-c-closure.observability: 4
  h139-residual-import-hardening: 3
```

```text
apps/web
  Command: npx vitest run src/h141-notification-logging-field-cache.test.ts src/h138-phase-c-personal-data-ui.test.ts
  Test Files  2 passed (2)
  Tests       11 passed (11)
  Failed      0
  Skipped     0
  EXIT 0
  h141: 4
  h138-phase-c: 7
```

Unexecuted suites: full API/web/kernel/db vitest; live PG; SMTP/SES; browser UI; all I3.1x–I4.3x export/DLQ files except what is listed.

No targeted test failed. No test was weakened or removed.

---

## 24. Commercial regression scope

**Actually executed this increment:**

- In-app notifications + dismiss (I3)
- Email template upsert (I3.4 + H-141)
- Commercial allowlist create (I3.14 + H-141)
- Organization import vs retired person import (H-139 residual)
- I8 finance invoices/reconciliation
- I9 field sync pull/push conflict
- Authentication/observability honesty (E1-C)
- Field-cache crypto + person-domain object-key contract (kernel)
- H-138 retired person-domain UI source/route tests

**Not executed / not claimed:** supplier companies, supplier rates, supplier content blocks, opportunities, RFPs, programmes, costing, proposals, Rate Identity, DocumentStorage uploads (H-140 prior only).

---

## 25. Runtime limitations

In-process Vitest and `tsc`. Web cache tests used an in-memory `localStorage`/`sessionStorage` stub, **not** a real browser. No live PostgreSQL, SMTP, SES, NATS, or UAT. No Production logging backend. Query-strip and redaction were verified by capturing `console.log` JSON lines during `app.inject`, which **is** the in-process logger path — **not** a deployed runtime log store.

Static inspection vs tests vs runtime vs unverified behavior are labelled throughout.

---

## 26. UAT status

```text
UAT: NOT STARTED
```

---

## 27. Production status

```text
Production: NOT AUTHORIZED / NOT READY
productionReady = false (unchanged)
EOS software adoption: NOT CLAIMED
```

---

## 28. PDPC and privacy limitations

SEDMC is **not** stated to be exempt from PDPC obligations. This record is **not** a legal conclusion, retention schedule, or privacy-exemption claim.

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

Staff emails, allowlist addresses, outbox bodies, SES payloads, and ops-brief prose can still hold personal data. Key filters, query stripping, and cache principal-binding do **not** complete a privacy boundary.

---

## 29. Remaining findings

1. Notification/outbox/allowlist/digest/suppression emails may identify individuals — Owner policy required.
2. Outbox and SES payloads persist message content — retention deferred; migration 126 not justified without that decision.
3. In-app allowlist reminder still interpolates `entry.email`.
4. Ops brief text in field cache remains unscanned.
5. Leftover `guestName` types in `apps/web/src/lib/ops-api.ts` (compatibility, not live UI).
6. Logger redaction is key-name based; `to` / SMTP DATA / differently named fields are incomplete.
7. Device id/salt remain in `localStorage` after logout.
8. Client does not auto-expire field-cache blobs at `cacheExpiresAt`.
9. H-139 PG CHECK leftovers still need Owner-authorized migration 126 if schema cleanup is later authorized.
10. Audit JSONB snapshots not redesigned.
11. Allowlist/DLQ/suppression **exports** still emit emails by design — not removed.
12. Delivery-events `includePayload=1` can return SES JSONB — not redesigned.
13. No live-database validation of historical notification rows.

---

## 30. Final disposition

```text
PASS WITH FINDINGS
```

Inventory of notification, logging, field-cache, and browser-storage surfaces is evidence-based. Authorized remediations (principal-bound cache, logout and account-switch clear, person-domain key reject on notification/cache/sync writes, query-strip logging, additional redaction keys, SMTP/SES skip-code hygiene) are implemented and tested. Remaining recipient, retention, prose, export, and runtime limitations are recorded.

Not **PASS**: residual personal-data capability remains on operational surfaces.

Not **FAIL**: no tested executable substitute for retired CRM/HR/supplier-contact/guest/DSR domains; authentication was required on tested routes; tenant allowlist isolation held in-process; rejected payloads did not persist; identified shared-device cache exposure was closed in tests; executed commercial suites passed.

---

## 31. Stop confirmation

```text
STOPPED AFTER H-141: YES
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

No H-142 work follows. Dirty worktree preserved.
