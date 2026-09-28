# H-111 Day 6 D6-T6 Web Live Integration Report

> **`H-111 DAY 6 D6-T6`**  
> **`LIVE WEB-TO-BOUNDED-API INTEGRATION VALIDATION`**  
> **`NOT UAT`** · **`NOT PRODUCTION`** · **`NOT H-81`**  
> **`NOT EOS ADOPTION`** · **`NOT GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T17:25:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Slice:** Owner/POA **D6-T6** (this increment).  
**Prior:** Days 1–5; D6-T1 **PASS**; D6-T4 **PASS — REMEDIATED**; D6-T5 **PASS WITH FINDINGS — LIVE DEV/TEST INTEGRATED**.

```text
DAY 6 D6-T6 STATUS = PASS WITH FINDINGS — LIVE WEB-TO-BOUNDED-API INTEGRATED
INCREMENT = EOS-7D-ACCEL
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

---

## 1. Authority

H-111 remains controlling. This increment determined whether the existing commercial web application could be connected, using an **already-supported Dev/Test API-target mechanism**, to the bounded F2-DP-01 API on `http://127.0.0.1:18115`, then validated Opportunity and RFP commercial-facts UI against that actual process.

No application-source redesign. No Production defaults changed. No `authorize()` / `/v1/me` modification. No schema/migration. No Gate B. No Windows SIGINT against the API. API shutdown only via `POST /eos-devtest/f2-dp-01/bounded-shutdown`. Commit/push not performed.

This is **Dev/Test integration evidence only**. It is not UAT, not Production readiness, not H-81 evidence, and not EOS adoption evidence.

---

## 2. Initial repository state

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | EMPTY (`git diff --cached --name-only` empty) |
| Porcelain | **457** |

No reset, clean, stash, revert, or restore. Existing dirty-tree Days 2–5 / D6-T4 application files were left in place.

---

## 3. Existing web/API routing architecture

Inspected before any runtime action.

| Surface | Behaviour |
| --- | --- |
| Browser client | `apps/web/src/lib/eos-client.ts`: `API_BASE = process.env.NEXT_PUBLIC_EOS_API_BASE ?? "/eos-api"` |
| Next App Router proxy | `apps/web/src/app/eos-api/[...path]/route.ts`: `API_ORIGIN = process.env.EOS_API_URL ?? "http://127.0.0.1:8080"` |
| Proxy helper | `apps/web/src/lib/eos-proxy.ts` builds upstream URL from that origin |
| Documented mechanism | `apps/web/README.md`: `/eos-api/*` → `http://127.0.0.1:8080/*` (**override with `EOS_API_URL`**) |
| Next rewrites | **none** for the API; proxy is the route handler |
| `next.config.ts` | `distDir: ".next-local"`; no API origin |
| `.env.example` | documents `EOS_PORT=8080` for the **API**; does **not** set web `EOS_API_URL` |
| `scripts/dev-preview.mjs` | starts API+web with `EOS_SEED_DEMO=true` and strips `EOS_DATABASE_URL` unless `EOS_PREVIEW_USE_DATABASE=1` — **incompatible** with bounded sidecar (not used) |
| `npm run dev -w @sedmc/web` | `next dev --webpack --port 3001` |

**Why Next `:3001` → `:8080` rather than `:18115`:** port `8080` is the **documented default**, not a hard-only compiled target. The long-running Next PID **36512** (started 2026-09-17) was using that default. It cannot be retargeted without restarting that process. PID 36512 restart was out of scope.

---

## 4. Existing API-target mechanism discovered

**Supported Dev/Test mechanism:** process environment `EOS_API_URL` consumed by the existing Next server proxy.

**Not used:** `NEXT_PUBLIC_EOS_API_BASE` (would send the browser directly at the API). CORS would allow `http://127.0.0.1` / `localhost`, but that is a different client path than the documented `/eos-api` proxy. Kept `NEXT_PUBLIC_EOS_API_BASE` unset so the browser continued to call `/eos-api`.

**Not used:** `npm run dev:preview` (`EOS_SEED_DEMO` + stripping `EOS_DATABASE_URL`).

**Not used:** changing `route.ts` defaults, `next.config.ts` `distDir`, or Production-like env (`NODE_ENV`/`EOS_ENV` production|uat).

---

## 5. Decision on how the bounded API was targeted

**CASE B** — existing mechanism, supplied as local Dev/Test startup configuration without modifying application source.

| Attempt | Result |
| --- | --- |
| Retarget existing Next `:3001` (PID 36512) | Requires restart/kill of 36512 — **refused** |
| Second `next dev --webpack --port 3016` **in `apps/web`** with `EOS_API_URL=http://127.0.0.1:18115` | Next 16 lock: `Another next dev server is already running` / PID 36512 / Dir `apps/web` |
| Isolated copy of `apps/web` at `%TEMP%\eos-d6-t6-web` (junction to repo `node_modules`; own `.next-local`; **no worktree edit**) + `EOS_API_URL=http://127.0.0.1:18115` + `--port 3016 --hostname 127.0.0.1` | **Used** |

Supplied configuration (isolated process only):

```text
EOS_API_URL=http://127.0.0.1:18115
NEXT_PUBLIC_EOS_API_BASE  unset (browser stays on /eos-api)
NODE_ENV                  unset
```

Proof the isolated web used the bounded API: `GET http://127.0.0.1:3016/eos-api/health` → **200** same bounded payload as `GET http://127.0.0.1:18115/health`.

No new proxy architecture. No committed Production default change.

---

## 6. Web process/listener

| Item | Recorded |
| --- | --- |
| Isolated Next cwd | `%TEMP%\eos-d6-t6-web` |
| Command | `npx next dev --webpack --port 3016 --hostname 127.0.0.1` |
| Ready | Next.js 16.3.2 (webpack), **Ready in 978ms**, Local `http://127.0.0.1:3016` |
| Listener PID | **800** (`next/dist/server/lib/start-server.js`) |
| Wrapper PID | **32948** (PowerShell) |
| API target | `EOS_API_URL=http://127.0.0.1:18115` |
| Using bounded API | **yes** (`/eos-api/health` matched bounded `/health`) |
| Existing Next PID 36512 | **not killed as an action of this increment** (see Finding 3) |

---

## 7. API process/listener

Bounded restart of actual `apps/api/src/main.ts` (D6-T5 process had already been shut down).

| Item | Recorded |
| --- | --- |
| Opt-in | `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` |
| Database | `.env.example` `EOS_DATABASE_URL` → TCP `127.0.0.1:5432/eos` |
| `EOS_SEED_DEMO` / `NODE_ENV` / `EOS_ENV` | **unset** |
| Listen | `EOS_PORT=18115` `EOS_LISTEN_HOST=127.0.0.1` |
| Listener PID | **22280** |
| Wrapper | shell **422447** / PID **35200** |
| Startup | `f2_dp01_bounded_devtest_api_startup` opportunities=**2** rfps=**2** pathB=**1** accounts=**1** rates=**1** programmes=**1** `mixedSqlDurable=false` `globalMigrateInvoked=false` namedBranch=`F2-DP-01-BOUNDED-DEVTEST-API-STARTUP` |
| `/health` `/ready` | **200**, `applicationReady=true`, `database.ok=true` |

Gate B `127.0.0.1:5434` / `eos_gateb` not used. Unrelated API on **8080** PID **17868** not replaced.

---

## 8. Authentication evidence

Existing Dev/Test path. `authorize()` and `/v1/me` **not modified**.

| Check | Result |
| --- | --- |
| Direct `GET /v1/me` no token | **401** |
| Isolated web `GET /eos-api/v1/me` no token | **401** `{"error":"unauthenticated"}` |
| Login `carol.admin@sedmc.local` / `test-carol-not-for-prod` / `tenantSlug=sedmc` | **200**, principal id `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee` |
| Browser **Dev sign-in** on `:3016` | session established (`Sign out` visible) |
| `GET /v1/me` authenticated | keys `id,tenantId,actorType,displayName,email,roles` — **`permissions` key absent** (unchanged) |
| Client-side bypass | **not introduced** |

---

## 9. Opportunity UI evidence

Controlled Dev/Test identity (not genuine commercial activity):

| Field | Value |
| --- | --- |
| Organization | `D6-T6-TEST Client Ltd` id `3bb9d597-f8bb-43b4-912f-ade633723b09` |
| Opportunity code | `D6-T6-TEST-OPP` |
| Opportunity id | `ac005edc-69e7-48b9-aade-3dc7d7a5693a` |
| Title | `D6-T6-TEST opportunity (controlled Dev/Test residue)` |

Browser `http://127.0.0.1:3016/commercial/pipeline/ac005edc-69e7-48b9-aade-3dc7d7a5693a` after Dev sign-in:

- Opportunity **loaded**; identity heading and `D6-T6-TEST-OPP · D6-T6-TEST` displayed.
- Related RFP link `D6-T6-TEST-RFP` displayed.
- F2 panel: **“No F2 facts recorded yet. F2-DP-01 sidecar (not mixed PostgreSQL C-spine). mixed SQL not durable on this path.”**
- **“Qualification is independent of workflow stage.”** No revenue/profit/FX/booking values shown.
- Qualification status combobox **Not yet assessed**.
- After Save: **“F2 facts recorded. F2-DP-01 sidecar (not mixed PostgreSQL C-spine). mixed SQL not durable on this path.”**
- After reload (still signed in): next-action field still **`D6-T6-TEST controlled next action`**.

API GET after UI PUT: `recorded=true` `mode=f2_dp01_sidecar` `mixedSqlDurable=false` `or01Qualified=false` `qualificationStatus=not_yet_assessed` `nextAction=D6-T6-TEST controlled next action` `opportunityId` unchanged.

---

## 10. RFP UI evidence

| Field | Value |
| --- | --- |
| RFP code | `D6-T6-TEST-RFP` |
| RFP id | `0a78fb25-4293-43e3-80ea-6ccf46e35ad9` |
| Title | `D6-T6-TEST RFP (controlled Dev/Test residue)` |
| Legacy C-spine `source` on POST | `email` (CHANNEL catalogue; **not** treated as F2 SOURCE) |

Browser `http://127.0.0.1:3016/commercial/rfps/0a78fb25-4293-43e3-80ea-6ccf46e35ad9`:

- RFP **loaded** (`D6-T6-TEST — D6-T6-TEST RFP (controlled Dev/Test residue)`).
- Panel copy: legacy collapsed source is **not** F2 SOURCE; SOURCE and CHANNEL remain distinct; timestamps **not** inferred.
- Primary source and Channel are **separate** comboboxes.
- Clarification **Not started**. Event type left **Do not append an event**. Received-at / first-response left blank.
- Path B API `GET /v1/rfps/:id/path-b-approval`: `status=not_required` `required=false` `recorded=false` `mode=f2_dp01_sidecar` (display GET; no Path B write).
- UI set SOURCE **Referral** and CHANNEL **Email**, then **Save F2 RFP facts**.
- After save: **“F2 facts recorded. F2-DP-01 sidecar … mixed SQL not durable on this path.”** Comboboxes remained Referral / Email. Clarification still Not started. Timestamps still empty.

API GET after UI PUT: `primarySource=referral` `channel=email` `sourceDistinctFromChannel=true` `receivedAt`/`firstResponseAt` empty `clarificationStatus=not_started` `legacyCollapsedSourceAuthoritativeForF2=false` `rfpId` unchanged.

---

## 11. Browser → API → sidecar persistence round-trip

### Opportunity

```text
Browser :3016
  → PUT /eos-api/v1/pipeline/opportunities/ac005edc-…/commercial-facts
  → bounded API :18115  (log 2026-09-21T14:20:30.817Z PUT 200)
  → F2-DP-01 sidecar
  → GET 200 nextAction=D6-T6-TEST controlled next action
  → UI refresh still shows that next action
```

Conflicting body `opportunityId` → **409**.

### RFP

```text
Browser :3016
  → PUT /eos-api/v1/rfps/0a78fb25-…/commercial-facts
  → bounded API :18115  (log 2026-09-21T14:22:44.487Z PUT 200)
  → F2-DP-01 sidecar
  → GET 200 referral / email
  → UI shows F2 facts recorded; SOURCE Referral; CHANNEL Email
```

Conflicting body `rfpId` → **409**.

Sidecar counts after both PUTs: opportunity facts **3**, RFP facts **3** (H91 + D6-T5 + D6-T6).

---

## 12. SOURCE/CHANNEL evidence

| Check | Result |
| --- | --- |
| F2 SOURCE | `referral` (origin) |
| F2 CHANNEL | `email` (intake path) |
| `sourceDistinctFromChannel` | **true** |
| Email treated as SOURCE | **not** on this PUT |
| Legacy POST `source=email` | C-spine field only; `legacyCollapsedSourceAuthoritativeForF2=false` |
| First-response / clarification events | **not invented** |

---

## 13. OR-01 evidence

Immediately after opportunity POST, **before** RFP create:

| Field | Value |
| --- | --- |
| `workflowStage` | `new_qualified` |
| `qualificationStatus` | `not_yet_assessed` |
| `or01Qualified` | **false** |
| `newQualifiedStageIsNotQualification` | **true** |
| `mixedSqlDurable` | **false** |

UI after RFP existed still showed qualification **Not yet assessed** and independent-of-stage copy. Save of next-action did **not** mark qualified. No revenue/profit/FX/booking facts.

---

## 14. Database integrity

Via `docker exec compose-postgres-1 psql -U eos -d eos` after UI PUTs, before shutdown.

| Check | Result |
| --- | --- |
| `current_database()` | `eos` |
| `schema_migrations` | **absent** |
| Six sidecar tables | present |
| Counts | opp **3**, rfp **3**, pathB **1**, account **1**, rate **1**, programme **1** |
| H91 opportunity marker | **preserved** |
| D6-T5-TEST sidecar | **preserved** |
| D6-T6-TEST sidecar | **present** (labelled) |
| Mixed `opp_%` / `rfp_%` tables | **none** |
| `migrate()` / 001–123 / 125+ | **not run** |

---

## 15. Shutdown/process cleanup

### Bounded API

```text
POST http://127.0.0.1:18115/eos-devtest/f2-dp-01/bounded-shutdown
Content-Type: application/json
{}
```

HTTP **202** `{ accepted: true, signal: "deterministic-trigger", … }`.

| Phase | Observed |
| --- | --- |
| `f2_dp01_bounded_devtest_shutdown_trigger_accepted` | 2026-09-21T14:24:19.810Z |
| `shutdown_signal_received` | 14:24:19.811Z `deterministic-trigger` |
| `shutdown_started` | 14:24:19.812Z |
| `shutdown_fastify_close_invoked` | 14:24:19.812Z |
| `shutdown_pool_end_invoked` | 14:24:19.826Z |
| `shutdown_completed` | 14:24:19.827Z `listenerReleased=true` |
| Process exit | **0** |
| `127.0.0.1:18115` | **RELEASED** |

No SIGINT / `Stop-Process` / forced kill of the API.

### Isolated Dev/Test web (this increment’s process)

Stopped with Next’s normal SIGTERM session-stop on listener PID **800**. Port **3016 RELEASED**. Unrelated API PID **17868** (`:8080`) remained **ALIVE**.

### Existing Next PID 36512

This increment **did not** issue `Stop-Process`, `taskkill`, or SIGINT against PID 36512. After the bounded-API POST shutdown, PID 36512 was **observed DEAD** and port **3001 FREE**. Cause is **not established**. Recorded as Finding 3. The process was **not** restarted here (would be a further interference).

---

## 16. Regression tests

| Suite | Result |
| --- | --- |
| Web `opportunity-commercial-facts-panel` + `rfp-commercial-facts-panel` | **24 passed / 2 files** |
| API write-integrity + RFP PUT + persist + mixed-SQL | **25 passed / 4 files** |

---

## 17. Type-check results

| Check | Result |
| --- | --- |
| `apps/web` `tsc -p tsconfig.json --noEmit` | **0 errors** |
| `apps/api` `tsc --noEmit` | **0 errors** |

No application source was modified in D6-T6.

---

## 18. Findings

1. **Default `8080` occupied** (PID **17868**). Bounded API used existing `EOS_PORT=18115`. Same class as D6-T5 Finding 1. Not a web-routing defect.
2. **Next 16 instance lock** refuses a second `next dev` in `apps/web` while another Next holds that directory. Existing PID 36512 could not be retargeted. CASE B used an isolated copy + `EOS_API_URL` without editing repository source.
3. **PID 36512 observed dead** after bounded-API shutdown, with port 3001 released, **without** this increment sending Stop-Process/SIGINT/`taskkill` to 36512. Not claimed as authorized termination. Cause unknown.
4. **React hydration overlay** from existing `src/components/commercial/Shell.tsx` (line 232) appeared on the isolated Next. Login and Save still completed. Not remediated (out of D6-T6 scope).
5. Opportunity/RFP **HTTP identity is process-local** on 124-only `eos`. UI used labelled `D6-T6-TEST-*` entities. H91 and D6-T5 sidecar rows remain.
6. `scripts/dev-preview.mjs` is **not** a safe bounded-sidecar starter (`EOS_SEED_DEMO` + optional database URL strip).
7. Expected Dev/Test warnings: in-memory transport, dev-outbox, loopback bind, bootstrap secret defaults.

Findings **1, 2, 4, 6, 7** do not invalidate the live web→bounded-API round-trip. Finding **3** is an environmental observation. Finding **5** is the established 124-only identity gap from D6-T5.

---

## 19. Limitations

- Isolated Next was a **Dev/Test operational copy**, not a committed second-app architecture.
- Not Playwright suite / full CI.
- Not UAT, Production, Gate B, H-81, or adoption.
- Path B remains **display GET** (`path-b-approval`); no Path B write.
- Existing `:3001` process was **not** the validated web (it defaulted to `:8080`); the validated web was `:3016`.
- PID 36512 was not restored.

---

## 20. Final classification

```text
PASS WITH FINDINGS — LIVE WEB-TO-BOUNDED-API INTEGRATED
```

The authorized path executed: existing `EOS_API_URL` mechanism → isolated Dev/Test Next `:3016` → actual bounded `main.ts` `:18115` → F2-DP-01 sidecar persist/retrieve for Opportunity and RFP from the **browser UI** → SOURCE ≠ CHANNEL → OR-01 `new_qualified` is not qualified → identifiers fail-closed 409 → mixed SQL not used → deterministic API shutdown exit 0.

---

## 21. Not UAT / Production / H-81 / adoption

This report is **not** UAT evidence, Production evidence, H-81 evidence, EOS adoption evidence, or H-80 exit evidence. H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Rate identity remains **STOPPED**.

---

## 22. Final repository state

| Item | Before | After |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Branch | `master` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **457** | **458** (457 + this report) |
| Application files | unchanged by D6-T6 | unchanged |
| Commit / push | not performed | not performed |

**STOP.** D6-T6 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 6 D6-T6 web live integration report.**
