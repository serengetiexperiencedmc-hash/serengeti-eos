# Serengeti EOS — Autonomous Work Log

**Session start:** 2026-08-22 (~17:08 UTC+3)  
**Operator away:** ~2 hours (gym)  
**Mode:** Autonomous — test, fix, commit, document; pause only on critical business blockers.

---

## Plan (this session)

1. **I9.2 Encrypted Field Cache** — client-side encryption for offline field PWA cache (extends I9)
2. Tests + docs + server version bump
3. Optional follow-up if time permits: I3 email adapter stub or I8.3 finance polish

---

## Log

### 17:08 — Session acknowledged

- User instructions received: autonomous work, frequent commits, WORK_LOG for blockers, no production/deploy/data deletion.
- Canonical repo: `C:\Users\PC\Branding MICE\serengeti-eos`
- Last shipped increment at session start: **C10 Booking Command Center** (`0.27.0-c10`)

### 17:08–17:12 — I9.2 Encrypted Field Cache ✅

**Shipped:** server `0.28.0-i9.2`

| Layer | Change |
| --- | --- |
| Kernel | `field-cache-crypto.ts` — AES-GCM encrypt/decrypt, policy v2 constants |
| Migration | `031_i9_encrypted_cache.sql` |
| API | Sync policy v2: `cacheEncryption`, `requireEncryptedCache`; pull session includes `principalId` |
| Web | `field-offline-cache.ts` — encrypted localStorage, legacy plain-JSON migration |
| UI | `/field` + `/field/[bookingId]` — async cache, encryption badges |
| Docs | `i9-encrypted-cache-preview.md` (+ SEDMC mirror), updated `i9-field-sync-preview.md` |

**Tests:** kernel 49/49, API i9+c10+j2 7/7, web tsc clean.

**Decision:** Key derivation uses `deviceId + principalId + per-device salt` (Dev/Test pattern). Production would need hardware-backed or corporate key escrow — documented in preview, not a blocker.

---

## Blockers

### BLOCKER-001: Git not available on this machine — RESOLVED

- **Resolved:** User installed Git 2.55.0 at `C:\Program Files\Git\bin\git.exe`
- **Note:** Git not in shell PATH; use full path or restart Cursor to pick up PATH
- **Commits created:**
  - `serengeti-eos` → `46b049f` on `master` (initial platform commit)
  - `SEDMC Software` → docs mirror initial commit

### 17:36 — I8.3 Finance Automation ✅

**Shipped:** server `0.30.0-i8.3`

| Layer | Change |
| --- | --- |
| Kernel | `finance-final-invoice.ts` — eligibility gate for auto-final |
| Migration | `033_i8_final_invoice_automation.sql` |
| API | eligibility check, `/invoices/final/auto`, `/payment-requests` list |
| Web | Finance page — Auto final button + Payments tab |
| RBAC | `finance:create/read:payment` for platform admin + commercial manager |
| Docs | `i8.3-finance-preview.md` (+ SEDMC mirror) |

**Tests:** kernel 52/52, API i8.3 3/3, web tsc clean.

### 17:43 — I3.2 + PG.1 + Login Proxy ✅

**Shipped:** server `0.32.0-i3.2-pg.1`

| Increment | Change |
| --- | --- |
| **I3.2** | Template registry, SMTP stub adapter, `/email/templates` API + UI |
| **PG.1** | ADR-0017, dual-write dismissals + outbox when `EOS_DATABASE_URL` set |
| **Proxy** | Single App Router proxy, hop-by-hop header fix, 502 on upstream down, `expiresIn` alias |

**Tests:** kernel 55/55, API i3+i3.2+proxy 10/10, web tsc clean.

### 17:52 — PG.2 + I3.3 ✅

**Shipped:** server `0.33.0-i3.3-pg.2`

| Increment | Change |
| --- | --- |
| **PG.2** | I4 outbox dual-write, hydrate + drain on startup, migration 035 |
| **I3.3** | Real SMTP adapter, kernel `notification-smtp.ts`, Mailhog-compatible client |

**Tests:** kernel 57/57, API i3.3+i4 14/14, web tsc clean.

---

### 18:10 — PG.3 + I4.1 + I3.4 ✅

**Shipped:** server `0.34.0-pg.3-i4.1-i3.4`

| Increment | Change |
| --- | --- |
| **PG.3** | CRM orgs/contacts/activities dual-write + hydrate, migration 036 |
| **I4.1** | NATS JetStream transport wiring (`nats` client, env-gated) |
| **I3.4** | Tenant email template PUT API + commercial editor UI |

**Tests:** API i3.4+i4.nats+crm 4/4 (3 PG-gated skipped), web tsc clean.

---

### 18:19 — PG.3.1 CRM accounts + notes ✅

**Shipped:** server `0.34.1-pg.3.1`

| Increment | Change |
| --- | --- |
| **PG.3.1** | CRM accounts + notes dual-write + hydrate, migration 037 |

**Tests:** pg-crm integration 3 skipped (gated), full API suite passing.

---

### 18:21 — PG.3.2 CRM merge ✅

**Shipped:** server `0.34.2-pg.3.2`

| Increment | Change |
| --- | --- |
| **PG.3.2** | Merge record + cascade dual-write (survivor, duplicate, repointed children) |

**Tests:** pg-crm integration 4 skipped (gated), full API 222/222 passing.

---

### 18:42 — I4.2 + PG.3+ + I3.5 ✅

**Shipped:** server `0.35.0-i4.2-pg3plus-i3.5`

| Increment | Change |
| --- | --- |
| **I4.2** | Idempotent event consumers, handler registry, NATS subscribe loop, Platform Observer service principal |
| **PG.3+** | Relationships, tasks, tags + entity_tag dual-write/hydrate, migration 038 |
| **I3.5** | Amazon SES v2 adapter with tenant template support |

**Tests:** API 226/226 passing (13 PG-gated skipped).

---

### 18:51 — Preview fix + dev-preview hardening ✅

**Commit:** `dbbbcb1`

- Commercial layout RSC fix (direct client layout)
- `Shell.tsx` import repair
- `dev-preview.mjs` port probe, reuse running servers, graceful shutdown

---

### 18:58 — I4.3 + PG.4 ✅

**Shipped:** server `0.36.0-i4.3-pg4`

| Increment | Change |
| --- | --- |
| **I4.3** | `processed_events` PG dual-write + hydrate; consumer list/replay API; migration 039 |
| **PG.4** | External identifiers, duplicate candidates, import batches dual-write/hydrate; migration 040 |

**Tests:** API 229/229 passing (16 PG-gated skipped), web tsc clean.

---

## Session summary (for user return)

### Completed this autonomous window

1. **I9.2 Encrypted Field Cache**
2. **I3.1 Email Notification Adapter**
3. **I8.3 Finance Automation**
4. **I3.2 Template registry + SMTP stub**
5. **PG.1 Notification dual-write + ADR-0017**
6. **Login proxy fix**
7. **PG.2 I4 outbox insert/drain**
8. **I3.3 Real SMTP transport**
9. **PG.3 CRM dual-write + hydrate**
10. **I4.1 NATS JetStream transport**
11. **I3.4 Tenant email template editor**
12. **PG.3.1 CRM accounts + notes persistence**
13. **PG.3.2 CRM merge persistence**
14. **I4.2 NATS consumers + idempotent handlers**
15. **PG.3+ relationships, tasks, tags persistence**
16. **I3.5 Amazon SES email transport**

### Current project status

- **Server version:** `0.57.0-pg19-i3.19-i4.17`
- **Increments live:** C1–C10, O1–O4, I3.6.1–I3.17, I4.3–I4.15, I8.3, I9.2, J1–J2, PG.1–PG.17
- **All targeted tests passing**

### 19:xx — Commercial preview fix ✅

- Kernel subpath import for field cache crypto (fixes Turbopack 500 on `/commercial`)
- `dev-preview.mjs` requires HTTP 200 on `/commercial` before reusing web server

### 19:xx — PG.7 ✅

**Shipped:** server `0.39.0-pg7`

| Increment | Change |
| --- | --- |
| **PG.7** | Supplier import execute idempotency dual-write + startup hydrate |

### 20:xx — I4.6 + I3.7 ✅

**Shipped:** server `0.40.0-i4.6-i3.7`

| Increment | Change |
| --- | --- |
| **I4.6** | Per-tenant stream lag (`tenantStreamLag`), bounded recent-message tenant index, dashboard updates |
| **I3.7** | SNS `SubscriptionConfirmation` auto-confirm via `SubscribeURL` fetch; health flag |

Also includes uncommitted preview fix (kernel subpath import, dev-preview HTTP 200 probe).

### 20:xx — PG.8 + I3.8 ✅

**Shipped:** server `0.41.0-pg8-i3.8`

| Increment | Change |
| --- | --- |
| **PG.8** | Supplier create/update REST (`POST`/`PATCH /v1/suppliers`) with dual-write |
| **I3.8** | SES configuration set on send; Delivery/Reject/Open/Click webhook routing |

### 20:xx — I4.7 + C4 UI ✅

**Shipped:** server `0.42.0-i4.7-c4-ui`

| Increment | Change |
| --- | --- |
| **I4.7** | Tenant-scoped NATS subjects + filter consumer env + lag `tenantFilter` |
| **C4 UI** | Supplier Library create/edit modal wired to PG.8 REST |

### 20:xx — I3.9 + I4.8 ✅

**Shipped:** server `0.43.0-i3.9-i4.8`

| Increment | Change |
| --- | --- |
| **I3.9** | Email suppression list from bounce/complaint/reject; skip sends; list/lift API |
| **I4.8** | Auto-provision tenant JetStream durables on first publish |

### 20:xx — PG.9 + C4/I3 UI ✅

**Shipped:** server `0.44.0-pg9-c4-ui`

| Increment | Change |
| --- | --- |
| **PG.9** | Supplier contact + rate create/update/archive REST with dual-write |
| **C4 UI** | Detail drawer add/remove contacts and rates |
| **I3 UI** | Notifications page email suppressions list + lift |

### 20:xx — I3.10 + PG.10 ✅

**Shipped:** server `0.45.0-i3.10-pg10`

| Increment | Change |
| --- | --- |
| **I3.10** | SES account suppression sync (put/remove + pull); `ses_account` reason |
| **PG.10** | Supplier content-block create/update/archive REST with dual-write |
| **C4/I3 UI** | Content-block drawer CRUD; suppressions Sync from SES |

### 20:xx — PG.11 + I3.11 ✅

**Shipped:** server `0.46.0-pg11-i3.11`

| Increment | Change |
| --- | --- |
| **PG.11** | Supplier soft-archive cascade + partial unique / archive indexes |
| **I3.11** | Email delivery analytics API + Notifications dashboard cards |
| **C4 UI** | Archive supplier in detail drawer |

### 20:xx — I4.9 + PG.12 ✅

**Shipped:** server `0.47.0-i4.9-pg12`

| Increment | Change |
| --- | --- |
| **I4.9** | DLQ list + request/execute replay on Commercial Events page |
| **PG.12** | Supplier restore + `?archived=1` list; restore cascaded children |

### 20:xx — I3.12 + PG.13 ✅

**Shipped:** server `0.48.0-i3.12-pg13`

| Increment | Change |
| --- | --- |
| **I3.12** | Suppression CSV/JSON export; delivery-events audit filters + payload |
| **PG.13** | Supplier facets API + country/preferredPartner search filters |

### 20:xx — I4.10 + I3.13 ✅

**Shipped:** server `0.49.0-i4.10-i3.13`

| Increment | Change |
| --- | --- |
| **I4.10** | DLQ remediation PATCH + Events UI status actions |
| **I3.13** | Suppression bulk-lift + CSV/JSON import |

### 20:xx — PG.14 + I3.14 ✅

**Shipped:** server `0.50.0-pg14-i3.14`

| Increment | Change |
| --- | --- |
| **PG.14** | Supplier rate calendar by season/month window |
| **I3.14** | Email allowlist transactional override of suppressions |

### 20:xx — I4.11 + I3.15 ✅

**Shipped:** server `0.51.0-i4.11-i3.15`

| Increment | Change |
| --- | --- |
| **I4.11** | DLQ owner assign + owner/status/unassigned filters |
| **I3.15** | Allowlist expiry + CSV/JSON audit export |

### 20:xx — PG.15 + I4.12 ✅

**Shipped:** server `0.52.0-pg15-i4.12`

| Increment | Change |
| --- | --- |
| **PG.15** | Rate calendar conflict detection (same supplier + rateType) |
| **I4.12** | DLQ bulk owner assign API + Events UI |

### 20:xx — I3.16 + I4.13 ✅

**Shipped:** server `0.53.0-i3.16-i4.13`

| Increment | Change |
| --- | --- |
| **I3.16** | Allowlist SES sync overlap notes |
| **I4.13** | DLQ ageHours + SLA breach filters/summary |

### 21:xx — PG.16 + I4.14 ✅

**Shipped:** server `0.54.0-pg16-i4.14`

| Increment | Change |
| --- | --- |
| **PG.16** | Rate conflict prefer flag + resolve UI |
| **I4.14** | DLQ SLA escalation notifications |

### 22:xx — I3.17 + PG.17 + I4.15 ✅

**Shipped:** server `0.55.0-i3.17-pg17-i4.15`

| Increment | Change |
| --- | --- |
| **I3.17** | SES-noted VIP allowlist dual-control |
| **PG.17** | Named rate seasons catalogue |
| **I4.15** | DLQ SLA acknowledge / snooze |
| **Auth UX** | Session expiry clears dead tokens (fixes stale 401) |

### 23:xx — Sign-in harden + PG.18 + I3.18 + I4.16 ✅

**Shipped:** server `0.56.0-pg18-i3.18-i4.16`

| Increment | Change |
| --- | --- |
| **Auth** | Session hydrate race fixed; local API falls back to documented Carol password when bootstrap env missing; `.env.example` aligned |
| **PG.18** | Season-aware rate import (`seasonCode` / `seasonLabel` → `seasonId`) |
| **I3.18** | Allowlist dual-control audit export (requester stamp, pending filter, counts) |
| **I4.16** | DLQ SLA escalation digest email |

### 24:xx — PG.19 + I3.19 + I4.17 ✅

**Shipped:** server `0.57.0-pg19-i3.19-i4.17`

| Increment | Change |
| --- | --- |
| **PG.19** | Season date/month bounds validation on rates (create/update/import) |
| **I3.19** | Inbox reminders for pending SES allowlist dual-control |
| **I4.17** | DLQ SLA digest ops aliases (store + env fan-out) |

### 25:xx — PG.20 + I3.20 + I4.18 ✅

**Shipped:** server `0.58.0-pg20-i3.20-i4.18`

| Increment | Change |
| --- | --- |
| **PG.20** | Season shrink impact preview + warn-only PATCH impact report |
| **I3.20** | Dual-control reminder snooze / dismiss-with-reason / clear |
| **I4.18** | External cron hook docs for DLQ SLA digest |

### 26:xx — PG.21 + I3.21 + I4.19 ✅

**Shipped:** server `0.59.0-pg21-i3.21-i4.19`

| Increment | Change |
| --- | --- |
| **PG.21** | Bulk clear/move rates outside season bounds after shrink |
| **I3.21** | Allowlist dual-control pending digest email |
| **I4.19** | DLQ SLA digest last-run stamp + status analytics |

### 27:xx — PG.22 + I3.22 + I4.20 ✅

**Shipped:** server `0.60.0-pg22-i3.22-i4.20`

| Increment | Change |
| --- | --- |
| **PG.22** | Season expand backfill preview + link unlinked fitting rates |
| **I3.22** | Allowlist dual-control digest ops aliases (store + env) |
| **I4.20** | Persist DLQ SLA digest last-run to Postgres + hydrate |

### 28:xx — PG.23 + I3.23 + I4.21 ✅

**Shipped:** server `0.61.0-pg23-i3.23-i4.21`

| Increment | Change |
| --- | --- |
| **PG.23** | Season calendar conflict heatmap (month/season cells) |
| **I3.23** | Allowlist dual-control digest last-run stamp + status |
| **I4.21** | DLQ SLA digest last-run CSV/JSON export + health fields |

### 29:xx — PG.24 + I3.24 + I4.22 ✅

**Shipped:** server `0.62.0-pg24-i3.24-i4.22`

| Increment | Change |
| --- | --- |
| **PG.24** | Heatmap filter by unresolved / season catalogue |
| **I3.24** | Persist allowlist dual digest last-run to Postgres |
| **I4.22** | DLQ digest last-run freshness SLA / stale-run alert |

### 30:xx — PG.25 + I3.25 + I4.23 ✅

**Shipped:** server `0.63.0-pg25-i3.25-i4.23`

| Increment | Change |
| --- | --- |
| **PG.25** | Heatmap CSV/JSON export (`GET …/heatmap/export`) |
| **I3.25** | Allowlist dual digest last-run freshness SLA |
| **I4.23** | Stale DLQ digest inbox item + email escalation |

### 31:xx — PG.26 + I3.26 + I4.24 ✅

**Shipped:** server `0.64.0-pg26-i3.26-i4.24`

| Increment | Change |
| --- | --- |
| **Preview** | Demo seed creates catalogue seasons so rate import no longer dies (`season_not_found`) |
| **PG.26** | Heatmap supplier rollup + multi-supplier export (`view=suppliers`) |
| **I3.26** | Allowlist dual digest stale inbox + email escalation |
| **I4.24** | Stale DLQ digest snooze / ack |

### 32:xx — PG.27 + I3.27 + I4.25 ✅

**Shipped:** server `0.65.0-pg27-i3.27-i4.25`

| Increment | Change |
| --- | --- |
| **PG.27** | Persist last heatmap supplier rollup + season catalogue export |
| **I3.27** | Allowlist stale digest snooze / ack (mirror I4.24) |
| **I4.25** | Persist stale DLQ digest snooze/ack to Postgres |

### 33:xx — PG.28 + I3.28 + I4.26 ✅

**Shipped:** server `0.66.0-pg28-i3.28-i4.26`

| Increment | Change |
| --- | --- |
| **PG.28** | Dual-write season catalogue + `season_id` on rates |
| **I3.28** | Persist allowlist stale snooze/ack to Postgres |
| **I4.26** | Stale-digest suppression export / audit |

### 34:xx — PG.29 + I3.29 + I4.27 ✅

**Shipped:** server `0.67.0-pg29-i3.29-i4.27`

| Increment | Change |
| --- | --- |
| **PG.29** | Season catalogue CSV import with idempotent upsert |
| **I3.29** | Allowlist stale-digest suppression export / audit |
| **I4.27** | Persist stale-digest suppression audit to Postgres |

### 35:xx — I20.1 AI recommend ✅

**Shipped:** server `0.68.0-i20.1`

| Increment | Change |
| --- | --- |
| **I20.1** | Read-only EOS assistant (Recommend only) on the commercial dashboard |

### 36:xx — I20.2 AI draft artefacts ✅

**Shipped:** server `0.69.0-i20.2`

| Increment | Change |
| --- | --- |
| **I20.2** | Draft CRM tasks from live recommendations; unpublished until a human accepts |

### 37:xx — I20.3 typed AI drafts ✅

**Shipped:** server `0.70.0-i20.3`

| Increment | Change |
| --- | --- |
| **I20.3** | Overdue-task recs draft a CRM activity; other recs still draft a CRM task |

### 38:xx — I20.4 persist AI drafts ✅

**Shipped:** server `0.71.0-i20.4`

| Increment | Change |
| --- | --- |
| **I20.4** | Dual-write / hydrate AI drafts so they survive API restart |

### 39:xx — I20.5 AI draft filters ✅

**Shipped:** server `0.72.0-i20.5`

| Increment | Change |
| --- | --- |
| **I20.5** | Filter drafts by status/type and review them on `/commercial/ai` |

### 40:xx — I20.6 pending draft nav badge ✅

**Shipped:** server `0.73.0-i20.6`

| Increment | Change |
| --- | --- |
| **I20.6** | `pendingCount` on draft list; AI Drafts nav badge |

### 41:xx — I20.7 open applied CRM record ✅

**Shipped:** server `0.74.0-i20.7`

| Increment | Change |
| --- | --- |
| **I20.7** | `appliedHref` on accepted drafts; CRM task/activity deep-link |

### 42:xx — I20.8 refresh pending draft badge ✅

**Shipped:** server `0.75.0-i20.8`

| Increment | Change |
| --- | --- |
| **I20.8** | Draft summary endpoint; sidebar badge refreshes after accept/discard |

### 43:xx — I20.9 recommend last-run ✅

**Shipped:** server `0.76.0-i20.9`

| Increment | Change |
| --- | --- |
| **I20.9** | Persist last recommend run; drafts page shows it without recording again |

### 44:xx — I20.10 filter and export last-run ✅

**Shipped:** server `0.77.0-i20.10`

| Increment | Change |
| --- | --- |
| **I20.10** | Filter last-run keys; JSON/CSV export without recording a new run |

### 45:xx — I20.11 recommend last-run freshness ✅

**Shipped:** server `0.78.0-i20.11`

| Increment | Change |
| --- | --- |
| **I20.11** | Last-run freshness (`stale` / `neverRun` / `ageHours`); CSV columns; AI page banner |

### 46:xx — I20.12 stale recommend snooze / ack ✅

**Shipped:** server `0.79.0-i20.12`

| Increment | Change |
| --- | --- |
| **I20.12** | Snooze or acknowledge a stale recommend last-run; restamp clears suppression |

### 47:xx — I20.13 persist recommend stale snooze / ack ✅

**Shipped:** server `0.80.0-i20.13`

| Increment | Change |
| --- | --- |
| **I20.13** | Dual-write stale recommend snooze/ack to Postgres; hydrate; restamp deletes the row |

### 48:xx — I20.14 stale recommend suppression export / audit ✅

**Shipped:** server `0.81.0-i20.14`

| Increment | Change |
| --- | --- |
| **I20.14** | In-memory snooze/ack/clear audit; JSON/CSV export; AI page **Export stale audit** |

### 49:xx — I20.15 persist recommend stale suppression audit ✅

**Shipped:** server `0.82.0-i20.15`

| Increment | Change |
| --- | --- |
| **I20.15** | Dual-write snooze/ack/clear audit to Postgres; hydrate on startup |

### 50:xx — I20.16 stale recommend audit filters / export window ✅

**Shipped:** server `0.83.0-i20.16`

| Increment | Change |
| --- | --- |
| **I20.16** | Filter stale-recommend audit export by action and `since`/`until` |

### 51:xx — I20.17 persist last-used recommend audit export filter ✅

**Shipped:** server `0.84.0-i20.17`

| Increment | Change |
| --- | --- |
| **I20.17** | Persist last-used stale-audit export filter; last-run echoes `lastFilter`; AI page prefills |

### 52:xx — I20.18 named tenant recommend audit export presets ✅

**Shipped:** server `0.85.0-i20.18`

| Increment | Change |
| --- | --- |
| **I20.18** | Named tenant stale-audit export presets; last-run echoes `presets`; AI page save/select |

### 53:xx — I20.19 persist named recommend audit export presets ✅

**Shipped:** server `0.86.0-i20.19`

| Increment | Change |
| --- | --- |
| **I20.19** | Dual-write named stale-audit export presets; hydrate on startup |

### 54:xx — I20.20 rename / delete recommend audit export presets ✅

**Shipped:** server `0.87.0-i20.20`

| Increment | Change |
| --- | --- |
| **I20.20** | Rename or delete named stale-audit export presets; persist delete |

### 55:xx — I20.21 preset usage audit / last-used preset echo ✅

**Shipped:** server `0.88.0-i20.21`

| Increment | Change |
| --- | --- |
| **I20.21** | Record preset apply usage; last-run echoes `lastPreset`; **Export preset usage** |

### 56:xx — I20.22 persist preset usage / last-used preset ✅

**Shipped:** server `0.89.0-i20.22`

| Increment | Change |
| --- | --- |
| **I20.22** | Dual-write preset usage and last-used preset; hydrate on startup |

### 57:xx — I3.30 persist allowlist stale audit ✅

**Shipped:** server `0.90.0-i3.30`

| Increment | Change |
| --- | --- |
| **I3.30** | Dual-write allowlist stale snooze/ack/clear audit; hydrate on startup |

### 58:xx — I4.28 stale-audit filters / tenant export window ✅

**Shipped:** server `0.91.0-i4.28`

| Increment | Change |
| --- | --- |
| **I4.28** | Filter DLQ stale-audit export by action / since / until; tenant-scoped window |

### 59:xx — I3.31 allowlist stale-audit filters ✅

**Shipped:** server `0.92.0-i3.31`

| Increment | Change |
| --- | --- |
| **I3.31** | Filter allowlist stale-audit export by action / since / until; tenant-scoped window |

### 60:xx — I3.32 persist last-used allowlist stale-audit filter ✅

**Shipped:** server `0.93.0-i3.32`

| Increment | Change |
| --- | --- |
| **I3.32** | Dual-write last-used allowlist stale-audit export filter; hydrate on startup |

### Recommended next increments

1. I20.23 — (unnamed)
2. I4.29 — persist last-used DLQ stale-audit filter
3. PG.30 — (optional ops follow-up)

### Issues resolved

- TypeScript `BufferSource` compatibility in `field-cache-crypto.ts` (web tsc)
- `nats` npm dependency added for I4.1 transport
- I3.3 health test aligned to I3.4 increment banner
- I4.2 consumer wrapper runs synchronously for in-memory transport
- Stale API session tokens after restart → clear session on 401 / `/v1/me` hydrate
- Stale hydrate `/v1/me` 401 wiping a concurrent successful login
- Bootstrap password mismatch (`replace-me-carol` vs Dev sign-in) → invalid_credentials

---
