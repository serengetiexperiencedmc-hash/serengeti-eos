# H-151 — Targeted remediation of H-149 P1 defects

> **TARGETED DEV/TEST REMEDIATION ONLY.** Not Production. Not SoR cutover. Not migration 126.  
> H-149 and H-150 were **not** overwritten. OD-01–OD-16 were **not** changed. H-146 was **not** reopened.  
> Rate Identity was **not** modified. Migration 125 was **not** modified further.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**Authority exercised:** Patrick Makundi / Commercial Director, under Owner-granted POA.

```text
H-151 STATUS: COMPLETE
AUTHORIZED SCOPE: H149-D-01 + H149-D-03 ONLY
H-149 DISPOSITION (UNCHANGED): PASS WITH FINDINGS
H149-UI-02: PASS
PRODUCTION: NOT AUTHORIZED / NOT READY
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
STOPPED AFTER H-151: YES
```

---

## A. Baseline

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
| Porcelain | **637** | **643** |

**Existing dirty paths preserved (H-149):**

* `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` (H149-I-01 CHECK retained; not edited)
* `apps/web/next.config.ts` (`EOS_WEB_DIST_DIR` isolation retained)
* `apps/web/tsconfig.json` (Next auto-includes extended for H-151 distDirs)
* `.gitignore` (H-149 `.next-h149-uat/` retained; H-151 distDirs added)

Did **not** use Production. Isolated validation used `eos_h149_uat` on `127.0.0.1:5439` via new API processes **18151** / **18152** (did not kill the historical 18149 process). Isolated web: `127.0.0.1:3051` with `EOS_WEB_DIST_DIR=.next-h151-d03`.

---

## B. D-01 — Durable proposal generation

### Defect

H-149 `POST /v1/proposals` returned **404** `rfp_not_found` for RFP `a38b5c4a-e4d8-4965-9e4d-ad8b801d122d` while `GET /v1/rfps/:id` returned **200**. Same Carol / `sedmc` tenant.

### Root cause

Mixed-SQL `createRfp` persists PostgreSQL and does not push `store.rfpRfps`. `generateProposal` read only the in-memory store.

### Files changed

| File | Change |
| --- | --- |
| `apps/api/src/proposal/proposal.ts` | Async generate/get/list; PG-first RFP/programme/costing/approval lookup with memory fallback for F2-DP-01 in-process pools; persist via existing `prop_proposals` |
| `apps/api/src/proposal/routes.ts` | `await` the async handlers |
| `apps/api/src/persistence/proposal-repository.ts` | **New.** Same repository pattern as costing/RFP. Uses existing migration **020** tables. No 126. |
| `apps/api/src/h151-d01.durable-proposal.test.ts` | **New.** Mixed-SQL generate, restart-style GET, tenant isolation, OD-09 key reject |

### Exact remediation

1. `generateProposal` loads the RFP with `getRfpById(pool, tenantId, id)` when mixed-SQL durable. Memory is used only if PG has no row (F2-DP-01 in-process memory pool tests).
2. Programme, cost sheet, and approved mixed `com_approval_requests` resolve from existing repositories, then memory.
3. When mixed-SQL **and** `approvalRequestId` is present, the proposal and version are inserted in `runDurableTx` into `prop_proposals` / `prop_proposal_versions` (existing 020 schema). `approval_request_id` remains NOT NULL; Path B-only generate without a mixed approval row is unchanged in-memory (no 126).
4. `getProposalDetail` / `getProposalByRfp` / `listProposals` read PG first so retrieval does not depend on process-local `store.propProposals`.
5. OD-09 `rejectPersonDomainContent` on generate is unchanged.

Business semantics (Path B gate, `canGenerateProposal`, no FX / 250k / new thresholds) were not rewritten.

### Tests

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| Vitest mixed-SQL generate with empty `store.rfpRfps` | no `rfp_not_found`; INSERT captured | 201-equivalent success object; 1 `prop_proposals` row | **PASS** |
| Vitest GET after clearing in-memory collections | persisted row returned | GET success from mock PG | **PASS** |
| Vitest foreign tenant + Carol permissions | `rfp_not_found` | `{ error: "not_found", reason: "rfp_not_found" }` | **PASS** |
| Vitest OD-09 `guestName` on generate | `person_domain_removed` | `invalid_request` / `person_domain_removed` | **PASS** |
| `c8.proposal.test.ts` | existing in-memory generate | 3 tests PASS | **PASS** |
| `f2-i4` + `f2-i11` Path B / trace | existing preview behaviour | 12 tests PASS (incl. F2 memory-pool Test 6) | **PASS** |
| Live GET RFP `a38b5c4a-…` on **18151** (new process, empty memory) | 200 | 200 | **PASS** |
| Live POST `/v1/proposals` same RFP after Path B decision | 201, not `rfp_not_found` | **201** id `153f6db1-8e9e-4404-848b-2d19974e0b3d` | **PASS** |
| Live GET proposal + by-rfp | 200 | 200 / 200 | **PASS** |
| Live GET proposal on **18152** (second process) | 200 | 200 same `rfpId` | **PASS** |
| Live partner-demo POST same RFP | not a sedmc generate | **403** (no `proposal:write`) | **PASS** (authz); lookup isolation covered by Vitest |
| Live person-key POST | 400 | 400 | **PASS** |

First live POST before Path B decision returned **409** (Path B pending from H-149 UAT-RFP-05). That is existing Path B semantics, **not** `rfp_not_found`. Bob decided Path B (`POST .../path-b-approval/decision` 200), then generate 201.

### Durability evidence

API **18151** hydrated mixed-SQL from `eos_h149_uat` (`database_migrated` applied `[]`; F2 hydrate pathB/rfps/programmes = 1). `store.rfpRfps` was not the SoR. Generate 201 wrote `prop_proposals`. API **18152** (fresh process, same catalog) `GET /v1/proposals/153f6db1-…` **200**.

### Tenant isolation evidence

Vitest: principal cloned onto tenant `22222222-…` cannot load sedmc RFP `a38b5c4a-…`. Live: `partner-demo` login 200; POST proposals **403**.

---

## C. D-03 — Web client bundle `node:crypto`

### Defect

Isolated Next webpack `UnhandledSchemeError` for `node:crypto` because `apps/web/src/lib/field-offline-cache.ts` imported `findPersonDomainObjectKeys` from the `@sedmc/kernel` barrel, which re-exports `crypto.ts` (`node:crypto`). Isolated `distDir` contributed by forcing a cold compile.

### Root cause

Client module used the Node kernel barrel. `@sedmc/kernel/field-cache-crypto` was already the Web Crypto path.

### Files changed

| File | Change |
| --- | --- |
| `packages/kernel/package.json` | Export `./personal-data-content-contract` (no `node:crypto`) |
| `apps/web/src/lib/field-offline-cache.ts` | Import helper from that subpath |
| `apps/web/src/h151-d03.client-bundle.test.ts` | **New.** Barrel import forbidden; helper still rejects keys |
| `apps/web/tsconfig.json` | Next auto-added `.next-h151-d03` and `.next-h151-build` includes |
| `.gitignore` | Ignore those isolated distDirs (H-149 `.next-h149-uat/` kept) |

`EOS_WEB_DIST_DIR` in `next.config.ts` was **not** removed. It remains UAT isolation, not the D-03 fix. No webpack polyfill. No Production Next redesign.

### Exact remediation

Client field-cache now imports `@sedmc/kernel/personal-data-content-contract` instead of `@sedmc/kernel`. The barrel still exports `node:crypto` for the API; the browser no longer pulls it.

### Build / runtime / browser evidence

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| Web typecheck | pass | `tsc` exit 0 | **PASS** |
| Web vitest D-03 + H-141 | pass | 6 tests PASS | **PASS** |
| Isolated `next build` `EOS_WEB_DIST_DIR=.next-h151-build` | compile | Compiled successfully; `/field` and `/commercial/crm` in route table | **PASS** |
| Isolated `next dev --webpack` `:3051` | Ready, no `UnhandledSchemeError` | Ready in 945ms | **PASS** |
| GET `/commercial/crm` and `/field` | 200 | 200 / 200 | **PASS** |
| Browser `/field` then `/commercial/crm` | renders; login works | Field login, CRM orgs/accounts/tasks loaded | **PASS** |

Incidental (not remediated): Next hydration overlay on `/field` from `getOrCreateDeviceId()` during render. Not `node:crypto`. Outside H-151 scope.

---

## D. H149-UI-02

**PASS.**

Evidence on `http://127.0.0.1:3051`:

1. Authenticated: Dev sign-in on `/field`; CRM on `/commercial/crm` showed Organizations/Accounts/Activities/Tasks **(1)**.
2. Field-cache: two `sedmc-field-cache*` keys were present before logout.
3. Logout: **Sign out** clicked; CRM returned to “Sign in to load CRM data”.
4. Cleanup: `fieldCacheKeyCount: 0`; session/email/principal keys absent.

H-141 unit coverage of `clearSession` → `clearFieldCaches` remains PASS.

---

## E. Non-remediated findings

* **H149-RI-01** — harness false-negative. No Rate Identity code change. Live overlay GET `.../commercial-facts?at=2026-09-21` **200**.
* **H149-REC-01** — unsupported GET-by-id. No GET `/v1/suppliers/:id/rates/:rateId` added.
* **H149-I-01** — migration 125 CHECK retained. No further 125 edit. **No migration 126.**

---

## F. Production

```text
PRODUCTION NOT AUTHORIZED / NOT READY
```

PDPC · EI-01 · ADR-0006 · DP-0006 · hosting/provider/region · Production catalog · Production migration · secrets/KMS · IdP · MFA · HTTPS/DNS/TLS/CORS · backup/restore · operations/on-call · event transport · email provider · supervision · observability · rollback/DR · SoR cutover · Production access model remain **OPEN**.

---

## Test matrix (grant §14)

| Test | Expected | Actual | Result |
| --- | --- | --- | --- |
| RFP durable create | persisted | H-149 RFP still GET 200 after new API processes | **PASS** |
| RFP GET | 200 | 200 on 18151 and 18152 | **PASS** |
| Proposal generation | succeeds | 201 (after Path B decision; 409 pending was Path B, not RFP lookup) | **PASS** |
| Proposal persistence | persisted | `prop_proposals` row; GET by id 200 | **PASS** |
| Proposal after restart | succeeds | 18152 GET 200 | **PASS** |
| Tenant isolation | enforced | Vitest `rfp_not_found`; live partner 403 | **PASS** |
| Web typecheck | pass | pass | **PASS** |
| Web build | pass | `next build` compiled | **PASS** |
| Web runtime | renders | `:3051` Ready; `/field` `/commercial/crm` 200 | **PASS** |
| Browser flow | renders | CRM loaded after login | **PASS** |
| Field-cache logout | verified | Sign out; cache count 0; session absent | **PASS** |
| Privacy regression | preserved | OD-09 generate 400; H-145/H-140/H-141 targeted tests PASS | **PASS** |
| Rate Identity regression | unchanged | overlay GET 200; no RI code edits | **PASS** |

API typecheck after D-01: PASS.

---

## Changed files this action

Application / tests:

* `apps/api/src/proposal/proposal.ts`
* `apps/api/src/proposal/routes.ts`
* `apps/api/src/persistence/proposal-repository.ts` (new)
* `apps/api/src/h151-d01.durable-proposal.test.ts` (new)
* `packages/kernel/package.json`
* `apps/web/src/lib/field-offline-cache.ts`
* `apps/web/src/h151-d03.client-bundle.test.ts` (new)

Incidental UAT/isolation hygiene (Next auto + gitignore):

* `apps/web/tsconfig.json`
* `.gitignore`

Governance:

* `docs/governance/h-151-targeted-h149-p1-remediation.md` (this file)

H-149 four paths remain. Migration 125 content unchanged in this action.

---

## Final safety check

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

Expected: HEAD `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`; `master`; empty index; no commit; no push; no live migration; no Production action.

---

## STOP

H-151 implemented **only** D-01 and D-03, ran the focused regression, and recorded this file.

Did **not**: start Production; implement GET rate-by-id; change Rate Identity; create migration 126; begin H-81 / C11+ / F2-I12 / Path D / ingestion / SoR cutover; create H-152.
