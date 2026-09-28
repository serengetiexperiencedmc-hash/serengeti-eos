# H-152 — Post-H-151 current-code UAT revalidation

> **FOCUSED CURRENT-CODE UAT REVALIDATION ONLY.** Not Production. Not remediation.  
> H-149, H-150 and H-151 were **not** overwritten. OD-01–OD-16 were **not** changed. H-146 was **not** reopened.  
> Rate Identity was **not** modified. Migration 125 was **not** modified. Migration 126 was **not** created.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**Authority exercised:** Patrick Makundi / Commercial Director, under Owner-granted POA.

```text
H-152 STATUS: COMPLETE
AUTHORIZED SCOPE: POST-H-151 CURRENT-CODE UAT REVALIDATION
OVERALL DISPOSITION: PASS WITH FINDINGS
H149-D-01 REVALIDATION: PASS
H149-D-03 REVALIDATION: PASS
H149-UI-02: PASS
PRODUCTION: NOT AUTHORIZED / NOT READY
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
STOPPED AFTER H-152: YES
H-153: NOT CREATED
```

Evidence directory: `docs/governance/h-152-evidence/`.

---

## A. Environment

**Commands:**

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

| Item | Before this action | After this action |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged |
| Branch | `master` | unchanged |
| Index | empty | empty |
| Porcelain | **643** | **645** |

**UAT isolation:**

| Item | Value |
| --- | --- |
| Catalog | `eos_h152_uat` on `127.0.0.1:5440` |
| Container | `serengeti-eos-h152-uat-pg` (`postgres:16-alpine`), user `eos_h152` |
| Migration level | Current worktree through **125** (`125_h135_phase1_personal_data_domain.sql`). `schema_migrations` count **121**. Last id `migrations/125_h135_phase1_personal_data_domain.sql`. No 126 file. No 126 row. |
| CLI migrate | `{"ok":true,"applied":[...through 125...],"productionReady":false}` against `eos_h152_uat` only |
| API startup migrate | `database_migrated` applied `[]` (18153 and 18154) |
| EOS_ENV | `development` (`EOS_ENV=uat` remains production-like and refused) |
| API | `http://127.0.0.1:18153` (create/generate); restart-equivalent `http://127.0.0.1:18154` |
| Web | `http://127.0.0.1:3052` with `EOS_API_URL=http://127.0.0.1:18153` and `EOS_WEB_DIST_DIR=.next-h152-uat` |
| Synthetic data | YES (`H152 Synthetic *`, Dev identities `carol.admin@sedmc.local`, `bob.approver@sedmc.local`, `partner@external.local`) |
| Production connection | **None** |

Did **not** use `eos`, `eos_h112_full`, `eos_gateb`, or `eos_h117_uat` as the H-152 catalog.

| Catalog | Observation |
| --- | --- |
| `127.0.0.1:5432/eos` | `to_regclass('public.schema_migrations')` **NULL** — unused |
| `127.0.0.1:5436/eos_h117_uat` | still **120** rows — unused |
| `127.0.0.1:5439/eos_h149_uat` | **121** rows including 125 — historical H-149 catalog; see finding H152-F-03 |
| `127.0.0.1:5440/eos_h152_uat` | **121** rows including 125 — H-152 writes |

H-149 worktree paths preserved: migration 125, `apps/web/next.config.ts`, `apps/web/tsconfig.json`, `.gitignore`. No reset/clean/stash/revert/commit/push.

---

## B. D-01 results

Authoritative current-code run: `wave1-results.json` against **18153 / eos_h152_uat**. Restart: `wave2-restart-results.json` against **18154**.

Synthetic IDs: RFP `f9aa6489-52a1-4ca8-8d9f-2e8f7a673af9`; proposal `28ff6667-d083-4420-8091-bed3d47edb71`.

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| D01-A durable RFP create/GET | 201 then 200 | 201 / 200 title `H152 synthetic RFP` | **PASS** |
| D01-B Path B pending blocks generate | 409, not `rfp_not_found` | **409** `path_b_approval_required` | **PASS** |
| D01-B Path B decision | 200 approved | 200 `status: approved` | **PASS** |
| D01-B generate after approval | 201, no `rfp_not_found` | **201** proposal `28ff6667-…`; GET 200; by-rfp 200 | **PASS** |
| D01-B persistence | `prop_proposals` row | PG row `proposal_code` `H152-RFP-001` | **PASS** |
| D01-C restart GET RFP | 200 on 18154 | 200 same title | **PASS** |
| D01-C restart GET proposal | 200 on 18154 | 200 same `rfpId` | **PASS** |
| D01-D tenant | partner cannot use sedmc ids | GET RFP **404**; POST proposals **403**; GET proposal **404**; restart GET 404/404 | **PASS** |
| D01-E costing | 201/200 existing sheet | 201/200 `sellPrice` 12000 | **PASS** |
| D01-E mixed approval | 201 then 200 | 201/200 | **PASS** |

18154 hydrate (fresh process, same catalog): CRM organizations **1** / accounts **1**; F2 pathB **1** / rates **1**; `database_migrated` applied `[]`. Retrieval did **not** depend on 18153 process-local `store.rfpRfps`.

Path B was **not** bypassed.

---

## C. D-03 results

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| D03-A web typecheck | pass | `npm run typecheck` in `apps/web` exit 0 | **PASS** |
| D03-B isolated build | compile; no `UnhandledSchemeError` | `EOS_WEB_DIST_DIR=.next-h152-build npx next build` — Compiled successfully; `/field` and `/commercial/crm` in route table | **PASS** |
| D03-C isolated runtime | Ready; no `node:crypto` bundle failure | `next dev --webpack --port 3052` Ready in 637ms; no `UnhandledSchemeError` | **PASS** |
| D03-D browser | field/CRM render; no crypto bundle error | `/field` login form; `/commercial/crm` Dev sign-in loaded Organizations (1) / Accounts (1) / Pipeline 1 / RFPs 1 | **PASS** |

HTTP: GET `/commercial/crm` **200**; GET `/field` **200**.

---

## D. H149-UI-02

**PASS.**

Evidence on `http://127.0.0.1:3052/commercial/crm`:

1. Authenticated session: Dev sign-in; CRM showed Organizations **(1)** and Accounts **(1)**; `sessionTokenPresent` true before logout.
2. Field-cache: two synthetic `sedmc-field-cache*` keys present (`fieldCacheKeyCount: 2`).
3. Sign out clicked; CRM returned to “Sign in to load CRM data from EOS API”.
4. Cleanup: `fieldCacheKeyCount: 0`; session token/email/principal **not present**.

---

## E. Hydration overlay

**Classification: genuine application defect; non-blocking for this UAT; Next.js development diagnostic overlay.**

Observed on `http://127.0.0.1:3052/field`:

* Next issues overlay: React hydration error, `src\app\field\page.tsx (81:9) @ FieldHomePage`, docs `react-hydration-error`.
* Cause in current code: `"use client"` `FieldHomePage` calls `getOrCreateDeviceId()` during render (`field/page.tsx` line 26) and prints `deviceId` at line 81. Server branch returns `"server"`; client reads/writes `localStorage`. That is a real server/client text mismatch.
* It is **not** `node:crypto` / `UnhandledSchemeError`.
* It is **not** caused by `EOS_WEB_DIST_DIR` isolation.
* Collapsed, the field login form still rendered. Expanded, the overlay intercepted clicks until dismissed. Field login/CRM flows remained usable after leaving `/field`.
* Isolated `next build` compiled `/field` without that overlay (dev-only UI). The mismatch itself is application code, not Production infrastructure.
* Does **not** block H-152 D-03 or UI-02.

**Not remediated** (H-152 is validation only). Recorded for a later separately authorized action.

Incidental second overlay after CRM login: `src\components\commercial\Shell.tsx (232:17)` (nav `Link` / `mounted` badge). Same class: genuine hydration, non-blocking, not remediated, not D-03.

---

## F. Privacy

H-145/H-146 controls were **not** reopened. Focused live checks on 18153:

| Check | Actual | Result |
| --- | --- | --- |
| OD-09 leftover `guestName` on POST `/v1/proposals` | 400 `person_domain_removed` | **PASS** |
| Retired person-domain write on opportunity | 400 `person_domain_removed` | **PASS** |
| CRM contact import fail-closed | 400 `person_domain_removed` | **PASS** |
| Supplier-contact import fail-closed | 400 `person_domain_removed` | **PASS** |
| Notification template leftover key (`PUT .../email/templates/notif.finance.warning`) | 400 `person_domain_removed` | **PASS** |
| Field-cache logout principal binding | cache 0; session absent | **PASS** |

OD-01–OD-16 unchanged.

---

## G. Rate Identity

No Rate Identity code change. Overlay PUT **200**; GET `.../commercial-facts?at=2026-09-21` **200**; mixed amount **250 USD** unchanged; identities length **1**.

GET `/v1/suppliers/:id/rates/:rateId` remains **404** route-not-found. **H149-REC-01 not implemented.**

---

## H. Automated tests

Focused suites only. Full repository suite **not** executed.

| Command | Outcome |
| --- | --- |
| `npm run typecheck -w @sedmc/api` | exit 0 |
| `npm run typecheck` in `apps/web` | exit 0 |
| `npx vitest run` API: `h151-d01.durable-proposal.test.ts`, `c8.proposal.test.ts`, `f2-i4.in-memory-generation-path-b.test.ts`, `f2-i11.path-b-generation-trace.test.ts`, `h145-owner-authorized-structural-keys.test.ts`, `h141-notification-logging-field-cache.test.ts`, `h140-documentstorage-freetext-jsonb.test.ts` | **6 files / 30 tests PASS** |
| `npx vitest run` web: `h151-d03.client-bundle.test.ts`, `h141-notification-logging-field-cache.test.ts` | **2 files / 6 tests PASS** |

---

## I. Overall disposition

**PASS WITH FINDINGS**

Primary H-151 remediations revalidated on current code against a new catalog:

* D-01 durable proposal generation **PASS** (including Path B 409 then 201, PG persistence, restart 18154, tenant isolation).
* D-03 client-bundle `node:crypto` **PASS**.
* H149-UI-02 **PASS**.

Findings (not converted to PASS; not remediated in this action):

| ID | Classification | Blocks UAT? |
| --- | --- | --- |
| **H152-F-01** | `/field` `getOrCreateDeviceId()` hydration mismatch — genuine application defect; Next dev overlay; non-blocking | No |
| **H152-F-02** | Incidental `Shell.tsx` hydration overlay after login — genuine, non-blocking, not D-03 | No |
| **H152-F-03** | First harness wave inherited leftover `UAT_API_URL=http://127.0.0.1:18149` and wrote synthetic `H152-RFP-001` into historical `eos_h149_uat`. Test-environment isolation error. Re-run against 18153/5440 **PASS**. H-149 row left in place (no catalog reset). | No (after re-run) |

H149-RI-01 remains a harness false-negative classification from H-150; overlay behaviour **PASS** here. H149-REC-01 remains unsupported GET-by-id. H149-I-01 migration 125 CHECK retained; **no 126**.

---

## Production gates

```text
PRODUCTION NOT AUTHORIZED / NOT READY
```

PDPC OPEN · EI-01 OPEN / REQUIRES OWNER EVIDENCE REVIEW · ADR-0006 OPEN · DP-0006 OPEN · hosting/provider/region unresolved · Production catalog unresolved · Production migration unauthorized · secrets/KMS unresolved · IdP/MFA unresolved · HTTPS/DNS/TLS/CORS unresolved · backup/restore unresolved · operations/on-call unresolved · provider DPA/subprocessors unresolved · event transport unresolved · email provider unresolved · supervision/observability unresolved · rollback/DR unresolved · SoR cutover unresolved.

Commercial SoR remains Office / Excel / mail / WhatsApp / phone. EOS has **not** replaced SoR. `productionReady` remains false.

---

## Changed files this action

Governance / evidence (new):

* `docs/governance/h-152-post-h151-current-code-uat-revalidation.md`
* `docs/governance/h-152-evidence/execute-d01.mjs`
* `docs/governance/h-152-evidence/execute-d01-restart.mjs`
* `docs/governance/h-152-evidence/wave1-results.json`
* `docs/governance/h-152-evidence/wave1-misdirected-18149.json`
* `docs/governance/h-152-evidence/wave2-restart-results.json`
* `docs/governance/h-152-evidence/uat-ids.json`
* `docs/governance/h-152-evidence/uat-ids-misdirected-18149.json`

Incidental UAT isolation hygiene:

* `.gitignore` (`.next-h152-uat/` / `.next-h152-build/`)
* `apps/web/tsconfig.json` (Next auto-includes for those distDirs)

No application behaviour files were edited. Migration 125 was not modified. Migration 126 was not created.

---

## STOP

H-152 revalidated only D-01 and D-03 on current code, classified the `/field` hydration overlay, and recorded this file.

Did **not**: create H-153; start Production; repair hydration; add GET rate-by-id; change Rate Identity; modify migration 125; create migration 126; begin H-81 / C11+ / F2-I12 / Path D / ingestion; perform SoR cutover.
