# H-111 Day 5 Report

> **`H-111 DAY 5 D5-S1 IMPLEMENTATION REPORT`**  
> **`READ/WRITE SECURITY BEHAVIOUR ON EXISTING OPPORTUNITY AND RFP F2 PANELS`**  
> **`NO ACCOUNT UI`** · **`NO PROGRAMME UI`** · **`NO PATH B UI`**  
> **`NO G-08-B`** · **`NO NEW FACTS`** · **`NO PERSISTENCE CHANGE`**  
> **`NO /v1/me PERMISSION EXPANSION`** · **`NO NEW ROUTES`**  
> **`NO PRODUCTION`** · **`NO GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`** · **`NOT ADOPTION EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T15:45:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Day-5 slice authorization:** Owner/POA Candidate **D5-S1** (this increment).  
**Prior artefacts:** Day 1–4 reports.

```text
DAY 5 STATUS = D5-S1 IMPLEMENTATION COMPLETE
INCREMENT = EOS-7D-ACCEL
SLICE = D5-S1 READ/WRITE SECURITY ON EXISTING OPPORTUNITY + RFP F2 PANELS
F2-I12 = NOT STARTED
G-08-B = NOT BUILT
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

---

## 1. D5-S1 authorization implemented

Authorized entities **only**:

1. Opportunity — existing operating UI from Day 2
2. RFP — existing operating UI from Day 3

Authorized UI surfaces **only**:

- `/commercial/pipeline/[id]`
- `/commercial/rfps/[id]`

Authorized routes **only** (existing; not modified):

- `GET/PUT /v1/pipeline/opportunities/:id/commercial-facts`
- `GET/PUT /v1/rfps/:id/commercial-facts`

Authorized permissions **only** (unchanged):

- Opportunity: `pipeline:read:opportunity` / `pipeline:write:opportunity`
- RFP: `rfp:read:rfp` / `rfp:write:rfp`

Authorized behaviour **only**:

- Do not imply write merely because F2 facts are readable.
- Where already-available client state establishes a non-write (GET 403, or observed PUT 403), hide Save.
- If write permission cannot be determined without a permission API, keep server `authorize()` authoritative (do not invent `/v1/me` keys).
- Opportunity PUT 403 is an authorization failure, never a successful save.
- RFP GET 403 masking and PUT 403 unauthorized-update copy are preserved.
- Never fabricate or locally persist facts after a rejected PUT.
- UI hiding is **not** authorization.

Day-4 D1 identifier protection and persist-failure behaviour were **not** modified.

---

## 2. Files changed

| File | Why |
| --- | --- |
| `apps/web/src/lib/commercial-facts-api.ts` | Client Save-visibility helper + PUT-failure mapping. Not a permission API. |
| `apps/web/src/app/commercial/pipeline/[id]/page.tsx` | Opportunity PUT 403 → write-forbidden; Save uses helper; facts not updated on 403 |
| `apps/web/src/app/commercial/rfps/[id]/page.tsx` | Same write-forbidden after PUT 403; GET 403 masking unchanged |
| `apps/web/src/opportunity-commercial-facts-panel.test.tsx` | D5-S1 Opportunity read-only Save + PUT 403 tests |
| `apps/web/src/rfp-commercial-facts-panel.test.tsx` | D5-S1 RFP GET/PUT 403 + authorized-edit regression |
| `docs/governance/accelerated-build-day-5-report.md` | This report |

**API files changed:** **none**.

**Not changed:** F2 panels (presentational `canWrite` already hid Save); `EosSessionProvider.tsx`; account/programme/Path B UI; commercial-facts routes; persistence; schema; migrations; `/v1/me`.

---

## 3. Routes / API

No API routes added, removed, or modified.

Server `authorize()` on the existing four commercial-facts methods remains authoritative.

`/v1/me` was **not** extended with permission keys. No permission-discovery endpoint was created.

---

## 4. Behaviour implemented

### Opportunity

1. GET 403 continues to set `unauthorized` and hide facts/editor.
2. Successful GET still cannot prove write permission (no permission API). Save remains visible until a PUT 403 is observed — server `authorize()` stays the write gate.
3. PUT 403 maps to `Not authorized to update opportunity commercial facts.`, sets `writeForbidden`, hides Save, and does **not** replace facts/persistence from the rejected PUT.
4. Non-403 PUT errors keep the existing failure copy and do not set write-forbidden.

### RFP (reference pattern preserved)

1. GET 403 continues to hide facts/editor (`Not authorized to read RFP commercial facts.`).
2. PUT 403 continues to show `Not authorized to update RFP commercial facts.`
3. After an observed PUT 403, Save is also hidden (`writeForbidden`). Readable facts remain displayed. Draft is not replaced from the rejected PUT.
4. Authorized editing (`canWrite: true`) is unchanged.

Tenant semantics were not modified: 401 unauthenticated, 403 forbidden, other-tenant 404 remain server-side.

---

## 5. Tests run and results

**Web (D5-S1 + Days 2–3 panels):** 24 passed / 2 files

| Suite | Tests | Result |
| --- | --- | --- |
| Day-2 Opportunity panel (preserved) | 7 | passed |
| D5-S1 Opportunity read/write security | 4 | passed |
| Day-3 RFP panel (preserved) | 9 | passed |
| D5-S1 RFP read/write security | 4 | passed |
| **Web total this run** | **24** | **passed** |

D5-S1 Opportunity checks:

- readable facts + `canWrite: false` → no Save
- PUT 403 copy + facts still shown → not success
- PUT 403 mapper → `writeForbidden`
- GET success is not a write grant once PUT 403 observed

D5-S1 RFP checks:

- GET 403 masking intact
- PUT 403 unauthorized-update intact; Save hidden; not success
- authorized editing not regressed
- PUT 403 mapper uses the established RFP copy

Existing authorization tests were not weakened. UI hiding is not claimed as authorization.

**API regressions (no API code change; `--maxWorkers=1`):** 25 passed / 4 files

| Suite | Result |
| --- | --- |
| Day-4 D1 write-integrity | 6 passed |
| Day-3 RFP PUT | 13 passed |
| F2-DP-01 persist | 3 passed |
| Day-2 mixed-SQL sidecar-only | 3 passed |

Live browser against a running eos process was **not** used (live eos is out of D5-S1). Verification is static markup + PUT-failure mapping tests.

---

## 6. TypeScript

| Check | Result |
| --- | --- |
| `apps/api` `tsc --noEmit` | **0 errors** |
| `apps/web` `tsc --noEmit` | **FAIL** — pre-existing only |

Web errors (complete list; **unchanged** from Days 2–4):

```text
src/components/commercial/EosSessionProvider.tsx(206,43): error TS2345
src/components/commercial/EosSessionProvider.tsx(218,42): error TS2345
```

| Kind | Count |
| --- | --- |
| New failures | **none** |
| Pre-existing | **2** (`EosSessionProvider` TS2345 lines 206 and 218) |
| Unrelated | **none** in this `tsc` output |

`EosSessionProvider.tsx` was **not** modified. D5-S1 did not cause those errors.

---

## 7. Runtime / database / UAT / Production

| Item | Status |
| --- | --- |
| Live `127.0.0.1:5432/eos` | **NOT RUN** |
| Migrations 001–123 | **NOT RUN** |
| New migrations / tables / sidecar columns | **NONE** |
| F2-DP-01 persistence / `write*Facts` | **NOT MODIFIED** |
| Day-4 D1 identifier + persist-fail | **NOT MODIFIED** |
| UAT | **NOT RUN** |
| Production | **NOT RUN** |
| Gate B / `eos_gateb` | **NOT USED** |
| H-113 | **NOT CREATED** |
| Commit / push / PR | **NOT DONE** |

---

## 8. Remaining blockers

Unchanged from Day 4 except D5-S1 UI/security on the two existing panels:

- Client still cannot pre-hide Save for a read-only user **before** a PUT 403 without a later permission-discovery grant (`/v1/me` remains without permission keys, as required).
- Account / programme write UI still not authorized.
- Path B write UI still excluded.
- G-08-B remains ungranted.
- Rate identity remains STOPPED.
- Pre-existing web TS2345 remains.

---

## 9. Repository state

| Item | Before D5-S1 | After D5-S1 |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **454** | **455** (454 + this report; other D5-S1 files were already dirty/untracked) |
| Commit / push | not performed | not performed |

---

## 10. Authorization confirmation

- **H-111** remains governing; this increment implemented **only** Owner/POA **D5-S1**.
- **H-80 remains ACTIVE.**
- **H-81 remains NOT STARTED.**
- **Rate identity remains STOPPED.**
- **G-08-B remains ungranted.**
- This report is **not** H-80 exit evidence, adoption evidence, UAT evidence, Production evidence, or approval evidence.

**STOP.** Day 5 D5-S1 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 5 D5-S1 report.**
