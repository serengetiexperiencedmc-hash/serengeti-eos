# H-111 Day 4 Report

> **`H-111 DAY 4 D1 IMPLEMENTATION REPORT`**  
> **`F2 WRITE-INTEGRITY HARDENING`**  
> **`OPPORTUNITY + ACCOUNT + PROGRAMME PUTS ONLY`**  
> **`NO PATH B`** · **`NO RFP CHANGES`** · **`NO RATE IDENTITY`**  
> **`NO UI`** · **`NO PRODUCTION`** · **`NO GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`** · **`NOT ADOPTION EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T14:15:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Day-4 slice authorization:** Owner/POA Candidate **D1** (this increment).  
**Prior artefacts:** Day 1–3 reports.

```text
DAY 4 STATUS = D1 IMPLEMENTATION COMPLETE
INCREMENT = EOS-7D-ACCEL
SLICE = D1 F2 WRITE-INTEGRITY HARDENING
F2-I12 = NOT STARTED
G-08-B = NOT BUILT
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

---

## 1. D1 authorization implemented

Authorized maps **only**:

1. Opportunity — `PUT /v1/pipeline/opportunities/:id/commercial-facts`
2. Account — `PUT /v1/crm/accounts/:id/commercial-facts`
3. Programme — `PUT /v1/programmes/:id/commercial-facts`

Authorized behaviour **only**:

- Path/resource identifier is authoritative; conflicting body `opportunityId` / `accountId` / `programmeId` or `id` → `409 *_immutable`.
- Conflicting body `tenantId` → `409 tenantId_immutable`.
- Matching body entity id is ignored as a write target (not rewritten).
- Sidecar persist throw → `409 f2_sidecar_persist_failed`; memory map not updated; GET `persistence.recorded = false`; `mixedSqlDurable` remains false.
- Existing `write*Facts` / F2-DP-01 sidecar path unchanged.
- No new commercial facts, catalogues, timestamps, audit semantics, UI, routes, or tables.

Day-3 RFP PUT was the **contract/pattern** and was **not** modified.

---

## 2. Files changed

| File | Why |
| --- | --- |
| `apps/api/src/commercial-facts/service.ts` | Opportunity PUT: identifier guard + persist-failure mapping |
| `apps/api/src/commercial-facts/account.ts` | Account PUT: identifier guard + persist-failure mapping |
| `apps/api/src/commercial-facts/programme.ts` | Programme PUT: identifier guard + persist-failure mapping |
| `apps/api/src/f2-dp-01.write-integrity.test.ts` | **New** focused D1 API tests (6) |
| `docs/governance/accelerated-build-day-4-report.md` | This report |

**Not changed:** Path B, RFP PUT, rate identity, web UI, schema, migrations, `EosSessionProvider.tsx`, `transferOpportunityFollowUp` (POST, not in D1 routes).

---

## 3. Routes changed

Existing PUTs only. No new routes.

| Route | Identifier rejection | Persist fail-closed |
| --- | --- | --- |
| `PUT /v1/pipeline/opportunities/:id/commercial-facts` | `opportunityId_immutable` / `tenantId_immutable` | `f2_sidecar_persist_failed` |
| `PUT /v1/crm/accounts/:id/commercial-facts` | `accountId_immutable` / `tenantId_immutable` | `f2_sidecar_persist_failed` |
| `PUT /v1/programmes/:id/commercial-facts` | `programmeId_immutable` / `tenantId_immutable` | `f2_sidecar_persist_failed` |

---

## 4. Behaviour implemented

After `authorize()` allow:

1. If body entity id / `id` ≠ path id → `409`.
2. If body `tenantId` ≠ resource `tenantId` → `409`.
3. Commercial-fact validation **unchanged**.
4. `write*Facts` in try/catch; throw → `409 f2_sidecar_persist_failed` (same Day-3 RFP reason).
5. Persistence envelope still `f2FactsPersistenceMeta(store, true)` only on **successful** write.

No mixed-SQL fallback. Bounded `f2Dp01BoundedSidecarOnly` unchanged.

---

## 5. Tests run and results

**New (D1):** `apps/api/src/f2-dp-01.write-integrity.test.ts` — **6 passed**

| Test | Result |
| --- | --- |
| Opportunity identifier + tenant rejection; matching id allowed | pass |
| Opportunity sidecar persist failure fail-closed | pass |
| Account identifier + tenant rejection; matching id allowed | pass |
| Account sidecar persist failure fail-closed | pass |
| Programme identifier + tenant rejection; matching id allowed | pass |
| Programme sidecar persist failure fail-closed | pass |

**Regressions (same vitest run, `--maxWorkers=1`):**

| Suite | Result |
| --- | --- |
| Day-3 RFP PUT | 13 passed |
| F2-DP-01 persist | 3 passed |
| Day-2 mixed-SQL sidecar-only | 3 passed |
| Bounded startup | 14 passed |
| Shutdown observability | 9 passed |
| Shutdown trigger | 7 passed |
| **API focused total this run** | **55 passed / 7 files** |

**Web:** 16 passed (7 opportunity + 9 RFP). No new web tests (no UI in D1).

No existing tests deleted or weakened. No tests added for Path B, RFP, or rate identity.

---

## 6. TypeScript

| Check | Result |
| --- | --- |
| `apps/api` `tsc --noEmit` | **0 errors** |
| `apps/web` `tsc --noEmit` | **FAIL** — pre-existing only |

Web errors (complete list; **unchanged** from Days 2–3):

```text
src/components/commercial/EosSessionProvider.tsx(206,43): error TS2345
src/components/commercial/EosSessionProvider.tsx(218,42): error TS2345
```

| Kind | Count |
| --- | --- |
| New failures | **none** |
| Pre-existing | **2** (`EosSessionProvider` TS2345) |
| Unrelated | **none** in this `tsc` output |

`EosSessionProvider.tsx` was **not** modified.

---

## 7. Runtime / database / UAT / Production

| Item | Status |
| --- | --- |
| Live `127.0.0.1:5432/eos` | **NOT RUN** |
| Migrations 001–123 | **NOT RUN** |
| New migrations / tables / sidecar columns | **NONE** |
| UAT | **NOT RUN** |
| Production | **NOT RUN** |
| Gate B / `eos_gateb` | **NOT USED** |
| H-113 | **NOT CREATED** |
| Commit / push / PR | **NOT DONE** |

In-process throwing/recording-style pools only.

---

## 8. Remaining blockers

Unchanged from Day 3 except D1 integrity on three PUTs is now present:

- Mixed identity survival on 124-only `eos` still needs 001–123 or a new identity grant.
- Rate identity remains STOPPED.
- Path B PUT integrity **not** in D1 (explicitly excluded).
- Default `migrate()` foot-gun if bounded flag omitted.
- G-08-B ungranted; no write UI for account/programme.
- Pre-existing web TS2345 remains.

---

## 9. Repository state

| Item | Before D1 | After D1 |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **452** | **454** (452 + D1 test file + this report) |
| Commit / push | not performed | not performed |

---

## 10. Authorization confirmation

- **H-111** remains governing; this increment implemented **only** Owner/POA **D1**.
- **H-80 remains ACTIVE.**
- **H-81 remains NOT STARTED.**
- **Rate identity remains STOPPED.**
- This report is **not** H-80 exit evidence, adoption evidence, UAT evidence, Production evidence, or approval evidence.

**STOP.** Day 4 D1 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 4 D1 report.**
