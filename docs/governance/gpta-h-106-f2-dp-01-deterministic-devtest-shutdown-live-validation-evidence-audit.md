# GPTA-H-106 — F2-DP-01 Deterministic Dev/Test Shutdown Trigger Live Validation Evidence and Audit

> **`EXECUTION EVIDENCE AND INDEPENDENT AUDIT`**  
> **`NOT AN AUTHORIZATION`**  
> **`NOT A NEW IMPLEMENTATION GRANT`**  
> **`NOT A CODE-CHANGE GRANT`**  
> **`NOT A MIGRATION GRANT`**  
> **`NOT H-81 EVIDENCE`**  
> **`NOT UAT`**  
> **`NOT EOS / SOFTWARE ADOPTION`**  
> **`NOT PATH D VALIDATION`**  
> **`NOT OPERATIONAL SoR CUTOVER`**  
> **`NOT PRODUCTION AUTHORIZATION`**  
> **`NOT F2-I12`**  
> **`H-80 REMAINS ACTIVE`**  
> **`H-81 REMAINS NOT STARTED`**  
> **`F2-I1–I11 REMAIN FROZEN`**  
> **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T12:06:00+03:00**.  
**HEAD (verified `git rev-parse HEAD`):** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.

```text
GPTA-H-106 STATUS = H-105 LIVE DEV/TEST DETERMINISTIC SHUTDOWN TRIGGER EXECUTION EVIDENCE RECORDED AND AUDITED

INCREMENT IDENTIFIER = F2-DP-01
NAMED INCREMENT = F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER
NAMED STARTUP BRANCH = F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
NAMED SHUTDOWN RUNNER = F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
THIS INCREMENT MUST NOT BE CALLED F2-I12
F2-I12 = NOT AUTHORIZED
H-105 EXECUTION CLASSIFICATION = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED
THIS AUDIT DOES NOT UPGRADE THAT RESULT TO AN UNCONDITIONAL PASS
THIS RECORD IS NOT AN AUTHORIZATION
THIS RECORD DOES NOT GRANT IMPLEMENTATION
THIS RECORD DOES NOT START H-81
THIS RECORD IS NOT H-81 EVIDENCE
H-96 REMAINS PASS WITH FINDINGS
H-101 HISTORICAL CLASSIFICATION REMAINS STOP / NOT VALIDATED FOR WINDOWS SIGINT
H-101 IS SUPERSEDED ONLY TO THE EXTENT DIRECTLY SUPPORTED BY THIS EVIDENCE
H-80 = ACTIVE
H-81 = NOT STARTED — EVIDENCE TRIGGER NOT YET SATISFIED
PRODUCTION = NOT AUTHORIZED
UAT = NOT AUTHORIZED
NO eos_gateb
NO GLOBAL migrate()
NO SCHEMA CHANGE
PATH D = REQUIREMENTS ONLY
CURRENT COMMERCIAL SoR = Office / Excel / Outlook/Gmail / WhatsApp / phone
OPERATIONAL SoR CUTOVER = NOT AUTHORIZED
H-107 = NOT CREATED
```

This record documents **completed H-105 execution** and an **independent audit** of that execution against H-105. It is based **only** on actual observed runtime evidence. It does **not** grant further work. H-36 F1-C-11 remains: authorization ≠ later operational adoption.

H-80 through H-105 and H-29 are **not overwritten**. This documentation action does **not** start another API process, does **not** modify source, and does **not** create H-107.

---

## 1. Purpose

Record that GPTA-H-105 was **executed as authorized**: the already-implemented named increment `F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER` was technically validated by starting the **actual** `apps/api/src/main.ts` process on the existing fail-closed bounded Dev/Test path against TCP `127.0.0.1:5432/eos`, confirming bounded mode, then invoking:

```text
POST http://127.0.0.1:18106/eos-devtest/f2-dp-01/bounded-shutdown
```

and observing the existing bounded shutdown runner lifecycle through process exit.

Independently audit that evidence. Classify the execution. Retain findings. **Do not remediate** them under this record. **Do not manufacture a PASS.**

This document is **evidence and audit only**. It is **not** an H-81 evidence record.

```text
AUDIT CLASSIFICATION = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED
```

---

## 2. Governing predecessor records

| Record | Role |
| --- | --- |
| H-80 | Controlled wait **ACTIVE** |
| H-81 | **NOT STARTED** |
| H-94 / H-95 | Named bounded startup branch authorized and implemented |
| H-96 | Live bounded API startup validation **PASS WITH FINDINGS** |
| H-97 | H-96 evidence/audit; **PASS — evidence/audit only** |
| H-98 / H-99 | Shutdown-observability implementation + evidence/audit |
| H-100 | Live shutdown-observability validation authorization (Windows JS SIGINT not proveable without code change) |
| H-101 | Live shutdown-observability execution; historical **STOP / NOT VALIDATED** |
| H-102 | Deterministic-trigger implementation authorization |
| H-103 | Implementation + focused tests; **complete** |
| H-104 | Implementation evidence/audit; **PASS — implementation evidence/audit only** |
| **H-105** | **Controlling authorization** for this live validation |

Authority: **Patrick Makundi** (company POA; instrument number not recorded / not invented). H-105 Owner/POA decision: **APPROVED**.

H-105 SHA-256 at H-106 creation: `173F9AF1BA6E4089BA48FFA61D7FBAD948D396BD73304C7D0F86044E471D4180`.  
H-104 SHA-256 (unchanged): `5D0E7631AB82D4CF929FDE6B5E55A2002B2D1ADD27722856987F6276E39AB2BA`.  
H-102 SHA-256 (unchanged): `111E023DB6F0AD5DACDBAF9CB55A2B23312199E8494FEDF0289E2A1E265CA894`.  
H-100 SHA-256 (unchanged): `2F916EDD2917508E063A1748E11E104FA718AAA790292956C3F8164D092F1E9C`.

---

## 3. Classification

```text
H-105 EXECUTION = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED
```

This is **not** an unconditional PASS. Findings in §14 are technical Dev/Test conditions of the run. They do **not** negate the observed trigger → runner → lifecycle → exit sequence. They are **not** treated as authorization breaches.

Do **not** infer Production readiness from this classification.

---

## 4. H-101 status after this validation

H-101 remains historically:

```text
STOP / NOT VALIDATED
```

for the Windows `process.kill(pid, 'SIGINT')` method. That method is still not JS-handler proof. H-106 does **not** rewrite H-101 into a PASS.

H-101 is **superseded only to the extent directly supported by this evidence**:

- the **purpose** of H-101 (observe the JavaScript shutdown lifecycle of the live bounded `main.ts` process) is now met **via the deterministic POST trigger**, not via Windows SIGINT;
- the Windows SIGINT / `Stop-Process` path remains **not validated**;
- default/non-bounded SIGINT/SIGTERM handling was **not** re-validated by this run.

---

## 5. Runtime target

Controlling identity is the **application TCP** connection used by the API process.

| Item | Recorded (credentials redacted) |
| --- | --- |
| Host | `127.0.0.1` |
| PostgreSQL port | `5432` |
| Database | `eos` |
| Live host-TCP `current_database()` | `eos` |
| Live host-TCP `inet_server_port()` | `5432` |
| Compose container | `compose-postgres-1` (`postgres:16-alpine`, `0.0.0.0:5432->5432/tcp`) |
| PostgreSQL | **16.15** alpine |
| Class | isolated non-production-like Dev/Test |
| `NODE_ENV` / `EOS_ENV` in the execution process | **unset** (`isProductionLikeEnv` therefore **false**) |
| `EOS_SEED_DEMO` | **unset** |
| Gate B `serengeti-eos-gate-b-pg` / `127.0.0.1:5434` / `eos_gateb` | **running but not used** |
| Production / UAT | **not used** |

`EOS_DATABASE_URL` was set to the documented Dev/Test TCP form matching `postgres://…@127.0.0.1:5432/eos`. Credentials were not printed in command output, logs, or this record.

Unix-socket `inet_server_port` from inside the container is **not** controlling. Host TCP is controlling.

---

## 6. Actual process used

| Item | Recorded |
| --- | --- |
| Entrypoint | existing `apps/api/src/main.ts` via `npx tsx src/main.ts` |
| Working directory | `apps/api` |
| Opt-in | `EOS_F2_DP01_BOUNDED_DEVTEST_API_STARTUP=true` |
| Listen host | `EOS_LISTEN_HOST=127.0.0.1` |
| Listen port | `EOS_PORT=18106` (default `8080` occupied; see Finding 1) |
| Wrapper PID | `15244` |
| Listener owning process | PID **38164** on `127.0.0.1:18106` |
| Substitutes used | **NONE** — not Vitest, not Fastify `inject()`, not direct `requestShutdown()`, not Windows `process.kill`, not `Stop-Process` |

---

## 7. Bounded startup evidence

Observed process log (excerpt):

```text
msg=f2_dp01_bounded_devtest_api_startup
opportunities=1 rfps=1 pathB=1 accounts=1 rates=1 programmes=1
increment=F2-DP-01
namedBranch=F2-DP-01-BOUNDED-DEVTEST-API-STARTUP
productionReady=false
ts=2026-09-21T09:04:46.270Z
```

Absent from the process log (not observed):

- `database_migrated`
- `database_startup_migrate_skipped` (default-path message; bounded path does not take that branch)
- `database_seed_synced`
- mixed CRM / notification / supplier hydrates
- `demo_seed_complete`
- `f2_dp01_bounded_devtest_api_startup_refused`

Six-map hydration therefore completed as `1/1/1/1/1/1`, matching the pre-existing H-91 sidecar rows. No new commercial facts were inserted by this validation.

---

## 8. API listening evidence

```text
msg=f2_dp01_bounded_devtest_shutdown_handlers_installed
namedIncrement=F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
windowsExternalKillIsNotCatchable=true
ts=2026-09-21T09:04:46.604Z

msg=f2_dp01_bounded_devtest_shutdown_trigger_registered
namedIncrement=F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER
shutdownRunner=F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
method=POST
path=/eos-devtest/f2-dp-01/bounded-shutdown
ts=2026-09-21T09:04:46.604Z

msg=api_listening
url=http://127.0.0.1:18106
productionReady=false
increment=I1
ts=2026-09-21T09:04:46.631Z
```

Trigger registration occurred **before** `api_listening`, as implemented.

Pre-POST confirmation:

- TCP listen on `127.0.0.1:18106` owned by PID **38164**;
- `GET /ready` returned **HTTP 200**, `applicationReady=true`, `database.ok=true`.

`api_listening` still logs `increment: "I1"`. `/ready` reports pre-existing version/increment fields. Those are existing labels. They do **not** establish F2-I12.

---

## 9. Exact deterministic POST result

### 9.1 First POST (no Content-Type)

`POST /eos-devtest/f2-dp-01/bounded-shutdown` without a media type returned **HTTP 415** (`FST_ERR_CTP_INVALID_MEDIA_TYPE` / Unsupported Media Type). Process logs:

```text
msg=request_error path=/eos-devtest/f2-dp-01/bounded-shutdown err=Unsupported Media Type
msg=request_completed statusCode=415
ts=2026-09-21T09:05:33.982Z / 09:05:33.983Z
```

No `trigger_accepted` and no shutdown phases were emitted. The process **remained listening**. This did **not** enter the shutdown runner. See Finding 2.

### 9.2 Second POST (authorized trigger invocation)

Real HTTP request against the live listener:

```text
POST http://127.0.0.1:18106/eos-devtest/f2-dp-01/bounded-shutdown
Content-Type: application/json
Body: {}
```

HTTP result:

```text
POST_STATUS=202
POST_BODY={"accepted":true,"signal":"deterministic-trigger","namedIncrement":"F2-DP-01-BOUNDED-DEVTEST-DETERMINISTIC-SHUTDOWN-TRIGGER","productionReady":false}
```

Process log:

```text
msg=f2_dp01_bounded_devtest_shutdown_trigger_accepted
signal=deterministic-trigger
path=/eos-devtest/f2-dp-01/bounded-shutdown
shutdownRunner=F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY
ts=2026-09-21T09:05:52.048Z

msg=request_completed method=POST path=/eos-devtest/f2-dp-01/bounded-shutdown statusCode=202
ts=2026-09-21T09:05:52.050Z
```

This POST was the shutdown trigger. Fastify `inject()`, direct `requestShutdown()`, Windows `process.kill`, `Stop-Process`, and `taskkill` were **not** used.

---

## 10. Complete shutdown lifecycle evidence

Observed sequence after the accepted POST, all with `signal=deterministic-trigger` and `namedIncrement=F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY`:

| # | Observed log | Timestamp (UTC) |
| --- | --- | --- |
| 1 | `f2_dp01_bounded_devtest_shutdown_trigger_accepted` | 2026-09-21T09:05:52.048Z |
| 2 | `shutdown_signal_received` | 2026-09-21T09:05:52.048Z |
| 3 | `shutdown_started` | 2026-09-21T09:05:52.048Z |
| 4 | `shutdown_fastify_close_invoked` | 2026-09-21T09:05:52.048Z |
| 5 | POST `request_completed` status 202 | 2026-09-21T09:05:52.050Z |
| 6 | `shutdown_pool_end_invoked` | 2026-09-21T09:05:52.050Z |
| 7 | `shutdown_completed` `listenerReleased=true` | 2026-09-21T09:05:52.050Z |

No `shutdown_failed`. No second `shutdown_started`. No SIGINT/SIGTERM signal name. The runner that ran was the existing bounded shutdown runner (`namedIncrement=F2-DP-01-BOUNDED-DEVTEST-SHUTDOWN-OBSERVABILITY`), invoked by the trigger (`signal=deterministic-trigger`).

This sequence is distinguishable from external Windows process termination, which in H-101 produced no `shutdown_started` and wrapper exit `4294967295`.

---

## 11. Final process exit and cleanup

| Item | Recorded |
| --- | --- |
| Wrapper / process exit code | **0** |
| Terminal status | `succeeded` |
| `ended_at` | 2026-09-21T09:05:54.174Z |
| `shutdown_completed.listenerReleased` | **true** |
| Post-run `127.0.0.1:18106` | **released** (`PORT_18106_RELEASED=YES`) |
| Listener PID 38164 | **gone** |
| Forced termination (`Stop-Process` / `taskkill` / `process.kill`) | **NOT USED** |

The application completed its own authorized shutdown lifecycle. No forced cleanup was required. No H-105 API process remained running.

A freed TCP port is recorded as corroboration of `listenerReleased=true` and exit 0. It is **not** treated as standalone proof.

---

## 12. Migration / schema / mixed-init safety

| Check | Result |
| --- | --- |
| Global `migrate()` / `database_migrated` | **not observed** |
| `schema_migrations` before | `to_regclass` **NULL** |
| `schema_migrations` after | `to_regclass` **NULL** |
| Six sidecar row counts before | 1 / 1 / 1 / 1 / 1 / 1 |
| Six sidecar row counts after | 1 / 1 / 1 / 1 / 1 / 1 |
| Mixed-store hydrates | **not observed** |
| `eos_gateb` used as API target | **NO** |
| Source / test / configuration change during validation | **NONE** |

No synthetic database writes were introduced beyond the already-existing bounded startup hydration of the six maps.

---

## 13. Independent audit findings (authorization fidelity)

### A. Process identity — PASS

The actual `main.ts` process ran. Vitest / `inject()` / direct runner invocation were not substituted.

### B. Bounded isolation — PASS

Opt-in bounded branch entered. Production-like env unset. Target `127.0.0.1:5432/eos`. Gate B not used. Default migrate/sync/mixed path not taken.

### C. Trigger identity — PASS

The accepted POST was a real HTTP request to the live loopback listener. It emitted `trigger_accepted` then invoked the existing runner with `signal=deterministic-trigger`.

### D. Lifecycle completeness — PASS

All required phases were observed in order, including Fastify close, pool end, `shutdown_completed`, listenerReleased=true, and process exit 0.

### E. Distinguished from H-101 Windows kill — PASS

H-101: no `shutdown_started`; wrapper exit `4294967295`.  
H-106: `trigger_accepted` → `shutdown_started` → close → pool end → `shutdown_completed` → exit 0.

### F. No implementation during validation — PASS

No source, test, migration, or configuration change was made to make the validation pass.

---

## 14. Findings (do not upgrade to unconditional PASS)

### Finding 1 — default listen port occupied

`127.0.0.1:8080` remained occupied by unrelated PID **17868**. Validation used existing `EOS_PORT=18106`. Same class as H-96 Finding 1. Not a bounded-branch defect. The unrelated listener was not disturbed.

### Finding 2 — Fastify 415 without Content-Type

A bodyless POST without `Content-Type` received Fastify **415 Unsupported Media Type** and did **not** enter the shutdown runner. A subsequent POST with `Content-Type: application/json` and body `{}` received **202** and entered the runner. No source change was made. This is a client media-type condition of Fastify’s content-type parser, not absence of the trigger.

### Finding 3 — bootstrap secrets warning

`bootstrap_secrets_missing_using_dev_defaults` was emitted, as in H-96/H-100. Existing Dev/Test default path. Not treated as a shutdown-lifecycle defect.

### Finding 4 — `api_listening` still labels `increment=I1`

Existing log field. Does **not** authorize or start F2-I12.

---

## 15. Governance exclusions confirmed

H-105 execution did **not**:

- modify source, tests, or configuration;
- run migrations;
- write `schema_migrations`;
- initialize full application schema;
- use Production, UAT, Gate B, or `eos_gateb`;
- start F2-I12 or thaw I1–I11;
- perform ingest, UI, booking, KPI, revenue, profit, or FX work;
- perform SoR cutover or EOS adoption validation;
- manufacture H-81 evidence;
- commit or push.

Legacy **250k / 20%** remains **legacy**.

```text
DURABILITY ≠ AUTHORITY
TECHNICAL SHUTDOWN VALIDATION ≠ EOS ADOPTION
TECHNICAL SHUTDOWN VALIDATION ≠ SoR CUTOVER
TECHNICAL SHUTDOWN VALIDATION ≠ PRODUCTION READINESS
H-106 EVIDENCE ≠ H-81 EVIDENCE
WINDOWS process.kill(SIGINT) REMAINS NOT JS-HANDLER PROOF
H-101 HISTORICAL CLASSIFICATION REMAINS STOP / NOT VALIDATED FOR THAT METHOD
```

---

## 16. Repository state

| Fact | H-105 execution | This H-106 documentation action |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | **EMPTY** | **EMPTY** |
| Porcelain | **425** | **426** (this file only; expected) |
| Source / schema / migration change | **NONE** | **NONE** |
| Commit | **NONE** | **NONE** |
| Push | **NONE** | **NONE** |

Pre-existing dirty-worktree changes were preserved exactly.

---

## 17. Conclusion

H-105 live Dev/Test validation of the deterministic bounded shutdown trigger is recorded and audited as **PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED**.

The actual `main.ts` process entered bounded startup, hydrated six maps `1/1/1/1/1/1`, listened on `http://127.0.0.1:18106`, accepted `POST /eos-devtest/f2-dp-01/bounded-shutdown` with HTTP 202, invoked the existing runner with `signal=deterministic-trigger`, emitted `shutdown_started` → Fastify close → pool end → `shutdown_completed` (`listenerReleased=true`), and exited **0**. The listener was released. No migration or `schema_migrations` activity occurred. Forced termination was not used.

H-101 remains historically **STOP / NOT VALIDATED** for Windows SIGINT. It is superseded **only** to the extent that the live JavaScript shutdown lifecycle of the bounded process has now been observed through the deterministic POST trigger.

```text
GPTA-H-106 = H-105 LIVE DETERMINISTIC SHUTDOWN TRIGGER EXECUTION EVIDENCE RECORDED AND AUDITED
CLASSIFICATION = PASS WITH FINDINGS — LIVE DEV/TEST VALIDATED
H-101 HISTORICAL = STOP / NOT VALIDATED (Windows SIGINT)
H-96 REMAINS PASS WITH FINDINGS
H-81 = NOT STARTED
THIS RECORD IS NOT H-81 EVIDENCE
COMMIT = NOT AUTHORIZED
PUSH = NOT AUTHORIZED
H-107 = NOT CREATED
```

---

## 18. Next governance gate

This record **does not authorize** the next action.

```text
LOGICAL NEXT GATE = SEPARATE OWNER/POA DECISION WHETHER ANY FURTHER GOVERNED STEP IS REQUIRED
THIS RECORD DOES NOT MAKE THAT DECISION
THIS RECORD DOES NOT CREATE H-107
THIS RECORD DOES NOT AUTHORIZE CODE CHANGES, TEST CHANGES, MIGRATION, UAT, UI, PRODUCTION, H-81, OR SoR CUTOVER
```
