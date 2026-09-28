# H-111 Day 3 Report

> **`H-111 DAY 3 IMPLEMENTATION REPORT`**  
> **`RFP → AUTHORIZED COMMERCIAL FACTS → CONTROLLED PUT → F2 SIDECAR → RFP UI`**  
> **`NO PRODUCTION`** · **`NO GATE B`** · **`NO migrate() 001–123`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOT H-113`**  
> **`NOT PRODUCTION READY`** · **`NOT H-80 EXIT`** · **`NOT H-81 EVIDENCE`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T13:55:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Prior artefacts:** [`accelerated-build-day-1-system-gap-matrix.md`](accelerated-build-day-1-system-gap-matrix.md), [`accelerated-build-day-1-report.md`](accelerated-build-day-1-report.md), [`accelerated-build-day-2-report.md`](accelerated-build-day-2-report.md).

```text
DAY 3 STATUS = IMPLEMENTATION COMPLETE WITH FINDINGS
INCREMENT = EOS-7D-ACCEL
F2-I12 = NOT STARTED
G-08-B = NOT BUILT
H-80 = ACTIVE
H-81 = NOT STARTED
PRODUCTION READY = NOT CLAIMED
RATE IDENTITY = STILL STOPPED
```

---

## 1. Executive Summary

Day 3 completed a **safe RFP commercial-facts vertical slice** on already-authorized facts: SOURCE, CHANNEL, received timestamp, first-response timestamp, clarification status, and explicit clarification events.

The existing PUT `/v1/rfps/:id/commercial-facts` was **consumed, not reinvented**. Two safety corrections were added: immutable identifier rejection (`rfpId` / `id` / `tenantId`) and a structured sidecar persist-failure response that does **not** fall back to mixed SQL.

The RFP detail UI now displays those facts and, where `rfp:write:rfp` is present, allows partial updates through the same PUT. SOURCE and CHANNEL remain distinct kernel catalogues. Missing timestamps stay absent. A PUT does not stamp “now” as first response or clarification.

Live `127.0.0.1:5432/eos` was **not** re-touched. Migrations 001–123 were **not** applied. Rate identity remains stopped. Mixed `evaluateCommercialApprovalGate` was not altered. Web TypeScript still fails on **pre-existing** `EosSessionProvider` TS2345 errors; Day-3 files are not in that error list.

---

## 2. RFP PUT Implementation

Existing route: `PUT /v1/rfps/:id/commercial-facts` (`rfp:write:rfp`). Existing service: `putRfpCommercialFacts`.

Day-3 changes in `apps/api/src/commercial-facts/service.ts` only:

| Behaviour | Result |
| --- | --- |
| Validate catalogues / ISO timestamps / clarification event type | **already present** |
| Partial update (`input.x ?? current.x`) | **already present** |
| Immutable `receivedAt` / `firstResponseAt` once observed | **already present** |
| Persistence envelope `{ recorded, mode, mixedSqlDurable }` | **already present** (Day 2) |
| Write via `writeRfpFacts` (F2-DP-01 sidecar when persist enabled) | **already present** |
| Reject body `rfpId`/`id` mismatch vs path | **added** → `409 rfpId_immutable` |
| Reject body `tenantId` mismatch | **added** → `409 tenantId_immutable` |
| Matching `rfpId` is ignored as a write target | **allowed** (identifier not rewritten) |
| Sidecar persist throw | **added** → `409 f2_sidecar_persist_failed`; memory map not updated |

No new general-purpose update framework. No RFP domain-model redesign. Mixed RFP `source` on create (`email`) remains a **legacy collapsed** field and is not F2 SOURCE or F2 CHANNEL.

---

## 3. SOURCE / CHANNEL Semantics

Kernel OR-07 catalogues were used unchanged (`COMMERCIAL_SOURCE_KEYS` / `COMMERCIAL_CHANNEL_KEYS`). No new taxonomy.

**SOURCE ≠ CHANNEL** is field-level and catalogue-level:

- SOURCE examples used: `referral`, `website_organic`, `trade_show_industry_event`, `existing_client_repeat`, `existing_partner_agency`.
- CHANNEL examples used: `email`, `whatsapp`, `phone`, `website_web_form`, `trade_show_in_person`.
- `email` as SOURCE is **invalid** (`invalid_primary_source`).
- `referral` as CHANNEL is **invalid** (`invalid_channel`).
- Sending only SOURCE or only CHANNEL when the other is unset is **rejected** (`primary_source_and_channel_required`). Neither is inferred from the other. Neither falls back to legacy `rfp.source`.
- Response flag `sourceDistinctFromChannel` remains `true`.
- `legacyCollapsedSourceAuthoritativeForF2` remains `false`.

Shared string keys (`linkedin`, `other`) exist in **both** catalogues with different meanings. That is an existing kernel fact, not a collapse. Day 3 did not add a “values must differ” rule.

Web labels copy the kernel catalogues. Free-text mixed `rfp.source` is displayed only as legacy collapsed source in the API view and is not promoted to F2 SOURCE in the UI selects.

---

## 4. Timestamp Semantics

Inspected: `putRfpCommercialFacts`, `rfpFactsView`, F2-I8 tests, F2-I9 first-response preview.

| Field | Classification | Day-3 treatment |
| --- | --- | --- |
| F2 `receivedAt` | **A** until first observation, then **B** immutable | Explicit ISO required. Empty string invalid. Not synthesized from `createdAt`. |
| F2 `firstResponseAt` | **A** until first observation, then **B** immutable | Explicit ISO required. **Not** PUT request time. Negative interval vs receivedAt rejected. |
| Clarification `eventAt` | **A** (append-only explicit event) | Requires `eventType` + ISO `eventAt`. Status change does not create an event. |
| `clarificationStatus` | **A** (status fact, not a timestamp) | Mutable independently. **C/D not used as a timestamp source**. |
| Mixed `rfp.createdAt` | **C/D — not F2 received** | `createdAtUsedAsReceivedAt = false`. |
| Mixed `rfp.receivedAt` | **D — not F2 authoritative** | Exposed as `legacyRfpRecordReceivedAt`; `legacyRfpRecordReceivedAtAuthoritativeForF2 = false`. |
| Proposal sent / KPI response time | **C** only when both F2 timestamps observed | Unchanged; Day 3 does not stamp them. |

**Gap (documented, not invented):** there is no separate mailbox “receipt event” entity and no first-response **event stream** beyond the single `firstResponseAt` observation field with provenance `explicit_business_fact`. Creating those event types would be a new business rule. **STOPPED.**

---

## 5. First-Response / Receipt / Clarification Handling

Preserved distinctions:

| Act | Representation |
| --- | --- |
| Record edited (partial PUT) | Unrelated fields retained; omitted timestamps stay absent |
| Receipt | F2 `receivedAt` as an **explicit business fact**, not an ingest/mailbox event |
| First response | F2 `firstResponseAt` only when the caller supplies an ISO instant for an actual first-response observation |
| Clarification | Status is not a timestamp. Events are `requested` \| `answered` with caller-supplied `eventAt` |

A PUT that updates SOURCE/CHANNEL does **not** write `firstResponseAt`. Clarification status `started` does **not** append an event. Clarification event without `eventAt` is `400 invalid_clarification_timestamp`.

No mailbox, Gmail, Outlook, WhatsApp, or phone integration was added.

---

## 6. RFP UI

Extended existing `/commercial/rfps/[id]` panel only (`RfpCommercialFactsPanel`). Not a G-08-B admin console.

| Fact | UI |
| --- | --- |
| SOURCE | Display + select from kernel SOURCE catalogue |
| CHANNEL | Display + select from kernel CHANNEL catalogue |
| Received at | Display; ISO text input until observed, then disabled/immutable |
| First response at | Display; ISO text input until observed; placeholder says leave blank unless recorded |
| Clarification status | Display + select |
| Clarification events | Read-only list; optional append requires type **and** timestamp |
| Path B | **Display only** (“unavailable” if missing). Day-3 mutation does not write Path B |

Editable vs immutable vs unavailable vs derived:

- Editable: unset SOURCE/CHANNEL pair, unset received/first-response ISO, clarification status, new clarification event.
- Immutable: observed receivedAt / firstResponseAt; identifiers never in the form.
- Unavailable: missing timestamps labelled “not recorded”; Path B labelled “unavailable”.
- Derived: none fabricated. Panel states timestamps are not inferred from page load or save.

H91-TEST RFP codes/titles show the controlled Dev/Test residue banner.

`canWrite` only shows the form. Authorization remains server-side `rfp:write:rfp`.

---

## 7. Authorization

Existing conventions only:

- GET: `rfp:read:rfp` → 401 unauthenticated, 403 forbidden, 404 other tenant.
- PUT: `rfp:write:rfp` → same.
- Finance member (Alice) has neither permission → **403** on PUT (tested).
- UI 403 on facts GET sets `unauthorized` and hides the editor.
- UI hiding is **not** treated as authorization.

No new permission model. No IDOR write of `rfpId`/`tenantId` from the body (rejected unless equal to the path/resource).

---

## 8. Persistence

- Writes go through `writeRfpFacts` → `upsertF2RfpFacts` when F2-DP-01 persist is enabled; otherwise in-memory preview.
- Bounded sidecar-only: `persistence.mode = f2_dp01_sidecar`, `mixedSqlDurable = false`.
- Recording-pool test: SQL contains `f2_rfp_facts`; no `INSERT`/`UPDATE` of mixed `rfp_` tables; no `schema_migrations`; no `opp_opportunities`.
- Persist failure: `409 f2_sidecar_persist_failed`; GET still shows unrecorded facts.
- Hydration: memory-pool PUT then cache clear then GET restores SOURCE, CHANNEL, `receivedAt`.
- Mixed SQL is not a durable fallback because `dbPool` exists.

No new tables. No 001–123. No `eos_gateb`. No Gate B. No Production.

---

## 9. Web TypeScript Investigation

Command: `npx tsc -p tsconfig.json --noEmit` in `apps/web` after Day-3 UI/tests.

**Errors (complete list):**

```text
src/components/commercial/EosSessionProvider.tsx(206,43): error TS2345:
  Argument of type 'string' is not assignable to parameter of type 'SetStateAction<"carol.admin@sedmc.local">'.
src/components/commercial/EosSessionProvider.tsx(218,42): error TS2345:
  Argument of type 'string' is not assignable to parameter of type 'SetStateAction<"test-carol-not-for-prod">'.
```

| Question | Evidence |
| --- | --- |
| Files | Only `EosSessionProvider.tsx` |
| Cause | `DEV_PREVIEW_LOGIN` is `as const`; `useState(DEV_PREVIEW_LOGIN.email\|password)` infers literal state; `onChange` passes `string` |
| Pre-date Day 2? | **Yes** — Day 2 report recorded the same TS2345 on this file; Day 2 did not modify it |
| Day-2/Day-3 dependence? | **No.** Day-3 RFP page uses `useEosSession()`, not `DevLoginPanel` form state. No Day-3 file appears in `tsc` output |
| Architectural defect on Day-3 path? | **No** |
| Action | **Not rewritten** (unrelated dirty-tree; instruction: do not rewrite merely to make global typecheck green) |

API `tsc --noEmit`: **0 errors**.

---

## 10. API Tests

New file: `apps/api/src/f2-dp-01.rfp-facts-put.test.ts` (**13 passed**).

| # | Requirement | Result |
| --- | --- | --- |
| 1 | GET existing RFP | pass — no synthesized timestamps; legacy source not F2 SOURCE |
| 2 | Authorized PUT | pass — SOURCE, CHANNEL, timestamps, clarification, persistence envelope |
| 3 | Persist / hydration | pass — memory-pool cache clear |
| 4 | Partial update | pass — clarification does not erase SOURCE/CHANNEL/receivedAt |
| 5 | Invalid SOURCE | pass — invented key and CHANNEL key `email` |
| 6 | Invalid CHANNEL | pass — invented key and SOURCE key `referral` |
| 7 | SOURCE ≠ CHANNEL | pass — no inference; both required together |
| 8 | Unauthorized update | pass — 401 anon, 403 Alice |
| 9 | Immutable identifiers | pass — 409 mismatch; matching `rfpId` allowed |
| 10 | Timestamp validation | pass — garbage firstResponse rejected; SOURCE PUT does not stamp firstResponse |
| 11 | Missing/empty timestamps | pass — empty string 400; observed receivedAt immutable |
| 12 | Persistence failure | pass — 409; facts not recorded |
| 13 | Mixed SQL not fallback | pass — sidecar SQL only |

Existing F2-I8 PUT timestamp/clarification tests remain passing (not weakened).

---

## 11. Web Tests

New file: `apps/web/src/rfp-commercial-facts-panel.test.tsx` (**9 passed**). Same vitest + `renderToStaticMarkup` convention.

| # | Requirement | Result |
| --- | --- | --- |
| 1 | RFP detail renders | pass |
| 2 | SOURCE renders | pass — Referral label |
| 3 | CHANNEL renders | pass — WhatsApp label, distinct from SOURCE |
| 4 | Timestamps render | pass — “not recorded” vs explicit ISO + immutable |
| 5 | Authorized edit | pass — Save + SOURCE/CHANNEL selects |
| 6 | Unauthorized edit blocked | pass — no Save |
| 7 | Partial update preserves fields | pass — `buildRfpFactsPutPayload` omits unchanged SOURCE/CHANNEL/timestamps; rejects SOURCE-only and CHANNEL-as-SOURCE |
| 8 | Unavailable facts not fabricated | pass — Path B unavailable / display only |
| 9 | Persistence status | pass |

---

## 12. Regression Tests

Re-run (vitest `--maxWorkers=1`):

| Suite | Result |
| --- | --- |
| Day-3 RFP PUT | 13 passed |
| F2-I8 RFP timestamps | passed |
| F2-I9 first-response preview | passed |
| F2-DP-01 persist | 3 passed |
| Day-2 mixed-SQL sidecar-only | 3 passed |
| Bounded Dev/Test startup | 14 passed |
| Deterministic shutdown observability | 9 passed |
| Deterministic shutdown trigger | 7 passed |
| **API focused total this run** | **68 passed / 8 files** |
| Opportunity F2 UI (Day 2) | 7 passed |
| RFP F2 UI (Day 3) | 9 passed |
| **Web total** | **16 passed** |

No existing tests were deleted or weakened. `evaluateCommercialApprovalGate` was not modified.

---

## 13. Runtime Validation

**Not performed against live PostgreSQL.** In-process memory-pool, throwing-pool, and recording-pool tests established PUT, hydration, persist failure, and mixed-SQL fail-closed behaviour.

Bounded startup was exercised in unit tests only. Deterministic loopback shutdown was **not** re-hit live. Windows SIGINT was **not** tested. Gate B was not used. Production was not used.

If a later day needs live proof of an RFP sidecar row on `127.0.0.1:5432/eos`, use the already-validated bounded F2-DP-01 startup path only.

---

## 14. Database Integrity

This increment **did not** connect to live `127.0.0.1:5432/eos` and **did not** run migrate.

| Question | Record |
| --- | --- |
| Migrations 001–123 applied this increment? | **NO** |
| `schema_migrations` created? | **NO** |
| Migration 124 re-executed? | **NO** |
| New tables created? | **NO** |
| H91 synthetic rows deleted? | **NO** |
| Mixed SQL written to unavailable tables? | **NO** (recording-pool assertion) |
| Live sidecar re-count? | **NOT QUERIED** — last evidence remains H-89/H-91 |

---

## 15. Governance Blockers

Unchanged and not solved in code:

- Full mixed PostgreSQL C-spine on `eos` (001–123) — **GOVERNANCE-BLOCKED**
- Default `migrate()` if bounded flag omitted — **documented; default path not redesigned**
- Booking authority — **GOVERNANCE-BLOCKED**
- KPI history / revenue / profit / FX — **GOVERNANCE-BLOCKED**
- G-08-B wholesale UI — **not built**
- F2-I12 / I1–I11 thaw — **not started**
- Rate identity operating UI — **STOPPED** (Day-2 decision retained)
- Mailbox / first-response **event stream** beyond the single explicit timestamp — **requirements gap; not invented**
- Live mixed identity survival across API restart on 124-only `eos` — still requires mixed schema **or** a new identity grant

---

## 16. Remaining P0/P1 Gaps

- Operator can still invoke default `main.ts` + `migrate()` without the bounded env flag (P0 foot-gun).
- Mixed RFP/opportunity identity remains process-local on the 124-only path.
- Programme F2 **write** UI still GET-only.
- Path B remains display-only on the RFP page (existing PUT not wired in Day 3 to avoid threshold invention).
- Rate identity still blocked on mixed supplier/costing surfaces.
- Pre-existing web `EosSessionProvider` TS2345 remains.
- Production / IdP still blocked.

---

## 17. Day-4 Recommendation

1. Keep bounded Dev/Test startup as the only operator path against `127.0.0.1:5432/eos`. Do not apply 001–123.
2. Next safe slice: **programme identity trace** already GET-displayed — add PUT **only** for already-authorized programme facts, same F2 sidecar rules.
3. Path B category UI **only** if it reuses the existing Path B PUT without inventing 250k/20% or a new CPR.
4. Do **not** start rate identity, booking, KPI persist, ingest, or G-08-B.
5. Do **not** rewrite `EosSessionProvider` unless a Day-4 web change depends on it.
6. Do not treat H91 rows as adoption evidence. Do not delete them.

---

## 18. Repository State

| Item | Before Day 3 | After Day 3 |
| --- | --- | --- |
| Branch | `master` | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Index | EMPTY | EMPTY |
| Porcelain | **449** (Day 2 complete) | **452** (449 + Day-3 PUT test + RFP web test + this report; other intent files were already dirty/untracked) |
| Commit / push | not performed | not performed |

H-113 was **not** created.

**Day-3 intent files (among the preserved dirty tree):**

- `apps/api/src/commercial-facts/service.ts` — identifier guard + persist-failure mapping
- `apps/api/src/f2-dp-01.rfp-facts-put.test.ts` — new
- `apps/web/src/lib/commercial-facts-api.ts` — catalogues, payload builder, `putRfpCommercialFacts`
- `apps/web/src/components/commercial/RfpCommercialFactsPanel.tsx` — view + authorized edit
- `apps/web/src/app/commercial/rfps/[id]/page.tsx` — draft/save wiring
- `apps/web/src/rfp-commercial-facts-panel.test.tsx` — new
- `docs/governance/accelerated-build-day-3-report.md` — this file

Unrelated dirty-tree files were **not** reset, cleaned, stashed, reverted, or discarded.

---

## 19. Authorization Confirmation

- **H-111 remains the governing implementation authority.**
- **H-80 remains ACTIVE.**
- **H-81 remains NOT STARTED.**
- No excluded scope was implemented: no Production, UAT, Gate B, `eos_gateb`, F2-I12, I1–I11 thaw, SoR cutover, ingest, mailbox/Excel/Gmail/Outlook/WhatsApp/phone integration, booking, KPI persistence/history, revenue, profit, FX, Path D maturity, G-08-B wholesale commercial-facts UI, H91 synthetic-row deletion, Windows SIGINT testing, rate identity, 250k/20% threshold change, or migrations 001–123.
- This report is **not** commercial adoption evidence and is **not** H-80 exit evidence.

**STOP.** Day 3 is complete. Do not commit. Do not push. Do not create H-113.

---

**End of H-111 Day 3 report.**
