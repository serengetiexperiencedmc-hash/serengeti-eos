# H-150 — H-149 Findings Triage and Remediation Authorization Assessment

> **GOVERNANCE / TRIAGE ONLY.** Not broad remediation. Not UAT re-run. Not Production.  
> H-149 was **not** overwritten. H-145/H-146 were **not** reopened. OD-01–OD-16 were **not** changed.  
> This action classifies H-149 findings and identifies candidates for a **later, separately controlled** remediation grant. It does **not** implement those repairs.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**Authority exercised:** Patrick Makundi / Commercial Director, under Owner-granted POA.

```text
H-150 STATUS: COMPLETE
OWNER TRIAGE AUTHORIZATION: GRANTED UNDER POA
BROAD REMEDIATION: NOT AUTHORIZED
H-149 DISPOSITION (UNCHANGED): PASS WITH FINDINGS
PRODUCTION: NOT AUTHORIZED / NOT READY
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
APPLICATION CODE THIS ACTION: UNCHANGED
STOPPED AFTER H-150: YES
```

---

## A. Baseline

**Commands (this increment, before and after the H-150 record):**

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

| Item | Before H-150 record | After H-150 record |
| --- | --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` | unchanged (confirmed §Final safety) |
| Branch | `master` | unchanged |
| Index | empty (`git diff --cached --quiet` exit 0) | empty |
| Porcelain | **636** | **637** (this file added; no other path discarded or reset) |
| Worktree | dirty (preserved) | dirty (preserved); H-149 four application paths still present |

**Current UAT environment (H-149; not reused as a new campaign):**

| Item | Value |
| --- | --- |
| Catalog | `eos_h149_uat` |
| Database | `127.0.0.1:5439` |
| Container | `serengeti-eos-h149-uat-pg` |
| API | `http://127.0.0.1:18149` |
| Web | `http://127.0.0.1:3049` |
| EOS_ENV | `development` |
| Migration level | 125 (`schema_migrations` count **121**) |
| Synthetic data | YES |
| Production | **NOT AUTHORIZED / NOT READY** |

Did **not** use `eos`, `eos_h112_full`, `eos_gateb`, historical `eos_h117_uat`, or Production.

H-149 campaign record: `docs/governance/h-149-current-code-uat-campaign.md`.  
H-149 evidence: `docs/governance/h-149-evidence/`.

---

## B. H-149 reconciliation

H-149 completed as **PASS WITH FINDINGS**. This increment does **not** convert that to PASS.

| H-149 reported | Confirmed |
| --- | --- |
| 67 total scenarios | Yes (65 HTTP harness rows + 2 UI rows) |
| 62 HTTP PASS | Yes (`wave1-results.json` / `wave2-restart-results.json`) |
| 3 HTTP FAIL | UAT-RI-01, UAT-PROP-01, UAT-REC-01 |
| 1 UI FAIL | UAT-UI-01 (`node:crypto` / UnhandledSchemeError) |
| 1 UI BLOCKED | UAT-UI-02 field-cache logout |
| Privacy regression | **PASS** (H-149 §D) |
| Commercial regression | **PASS WITH FINDINGS** (proposal generate failed; Rate Identity HTTP otherwise passed) |
| Production | **NOT READY** |

Exact H-149 finding IDs retained:

| ID | H-149 label | H-149 reported class |
| --- | --- | --- |
| H149-I-01 | Migration 125 CHECK expanded to allow `retired` (no 126) | Schema completeness during UAT apply |
| H149-H-01 / UAT-RI-01 | Rate Identity harness false-negative | Instrumentation |
| H149-D-01 / UAT-PROP-01 | `POST /v1/proposals` 404 `rfp_not_found` while GET RFP 200 | Application |
| H149-D-03 / UAT-UI-01 | Isolated Next webpack `UnhandledSchemeError` `node:crypto` | Application + environment |
| H149-D-02 / H149-REC-01 / UAT-REC-01 | Mixed GET rate-by-id 404 after restart; overlays survived | Contract / application |
| H149-UI-02 / UAT-UI-02 | Live field-cache logout | BLOCKED |

H-149 four worktree application/config paths (still present; not discarded):

1. `packages/db/migrations/125_h135_phase1_personal_data_domain.sql`
2. `apps/web/next.config.ts`
3. `apps/web/tsconfig.json`
4. `.gitignore`

---

## C. Finding-by-finding disposition

### 1. H149-I-01 — Migration 125 CHECK modification

**Evidence**

- File `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` is **not in git HEAD** (`git ls-files` pathspec error). It has been untracked worktree content since H-135/H-136, not a rewrite of committed migrations 001–124.
- `packages/db/schema.sql` lines 224–228: `schema_registry.status` CHECK is `IN ('planned', 'active')` only.
- Pre-H-149 125 already contained `UPDATE schema_registry SET status = 'retired' WHERE context_key IN ('hr', 'hr-certifications')` (authorized H-135/H-136 Phase A). The CHECK expansion was **not** present before H-149.
- Current 125 lines 100–108:

```text
ALTER TABLE schema_registry DROP CONSTRAINT IF EXISTS schema_registry_status_check;
ALTER TABLE schema_registry
  ADD CONSTRAINT schema_registry_status_check
  CHECK (status IN ('planned', 'active', 'retired'));
```

then the existing `UPDATE` to `retired`.

- Exact CHECK change: `('planned', 'active')` → `('planned', 'active', 'retired')`.
- Why H-149 changed it: first migrate of empty `eos_h149_uat` failed PostgreSQL **23514** (UPDATE to `retired` violated the CHECK). After the expansion, migrate applied 125 (`schema_migrations` **121**).
- Which UAT test required it: **none of the HTTP/UI scenarios**. The change was required to **apply** authorized 125 on a fresh isolated catalog so the campaign could start.
- Isolation (`uat-01-isolation.json`): `eos` `schema_migrations` **NULL**; `eos_h112_full` and `eos_h117_uat` still **120** rows; Gate B unused; only `eos_h149_uat` includes 125.
- No Production catalog was modified. No 126 was created. Migrations 001–124 were not edited.

**Classification:** UAT-setup / authorized-125 completeness, **plus** a **governance process** finding that H-149 altered uncommitted migration 125 without a separate schema-history grant.

**Root cause:** 125’s intended H-135 `UPDATE … status = 'retired'` was incomplete relative to the CHECK inherited from `schema.sql` / early CREATE. Fresh apply cannot succeed without expanding the CHECK **inside 125** (or a later 126, which is forbidden here).

**Severity:** P2 governance / schema-apply. **Not** a runtime application defect.

**Genuine application defect?** No (runtime). Yes as **schema-file completeness** of already-authorized 125.

**Does it alter intended historical migration semantics?** It alters the **uncommitted 125 file** relative to the pre-H-149 worktree (CHECK was omitted). It does **not** alter 001–124. No catalog successfully applied 125 *without* the CHECK (first apply failed). The only applied 125 (`eos_h149_uat`) includes the expanded CHECK.

**Should the change remain?** **Yes.** Do not revert. Do not reset. Do not create 126. Keep it so authorized 125 can apply on a later fresh Dev/Test catalog. Eventual governed repository state, when Owner first commits 125, should include this CHECK in **125**, not a follow-on 126.

**Remediation required this action?** No further 125 edit.

**Separate authorization?** Yes, for any **commit** of 125 (including this CHECK) into the governed tree. Not authorized here.

---

### 2. H149-RI-01 / H149-H-01 — Rate Identity harness result

**Evidence**

- Harness `execute-scenarios.mjs` UAT-RI-01 pass condition required top-level `riFacts.amountIsNotIdentity` or `ri1.amountIsNotIdentity`.
- Actual PUT overlay body (`wave1-results.json`): HTTP **201 / 201 / 200**; flag is nested `identity.amountIsNotIdentity: true`; `originalCurrency: "TZS"`; mixed rate `amount: 250`, `currency: "USD"`; `fxProviderImplemented: false`; overlap none.
- Supplier `87cc65a4-4f9e-41ef-ac3f-38c8caf7aebc`, rate `ee3e141d-869e-4c46-baf2-045547e5dfb9`, overlay identity `069d37d2-8360-438e-93b3-8f57b61bfd00`.
- UAT-RI-02 through UAT-RI-09 **PASS**. UAT-RI-05 restart **PASS** (v1 TZS, v2 EUR; overlay GET 200).
- Tenant: Carol / `sedmc` (`tenantId` `11111111-1111-4111-8111-111111111111`). Effective-date GET `?at=2026-09-21` used and passed on RI-02/RI-05.

**Classification:** **Harness false-negative.** Underlying Rate Identity functionality **passed**.

**Root cause:** Assertion looked at the wrong JSON path; contract places `amountIsNotIdentity` on `identity`.

**Severity:** P3 instrumentation.

**Genuine application defect?** **No.**

**Remediation required?** Harness assertion only, in a later UAT/harness grant. **Do not modify Rate Identity** for this finding.

**Separate authorization?** Optional harness fix only. Not an application rem grant.

---

### 3. H149-D-01 — Proposal generation 404

**Evidence (isolated H-149 UAT, same process, pre-restart)**

| Step | Identifier | Result |
| --- | --- | --- |
| POST `/v1/rfps` | created `a38b5c4a-e4d8-4965-9e4d-ad8b801d122d` | **201** |
| Subsequent GET `/v1/rfps/:id` and overlay/Path B | **same** `rfpId` | **200** (wave1 RFP scenarios PASS; wave2 mixed GET rfp **200**) |
| POST `/v1/proposals` | body `{ rfpId: ids.rfpId, title: "UAT synthetic proposal" }` — **same** id | **404** (`createStatus: 404`; no `proposalId`) |
| GET proposal | `ids.proposalId` undefined | **404** (follow-on; generation never created a row) |
| Approval | `3f23e84e-f67f-41bf-81be-8eba113f1081` | **201** then Bob decision **200** |

- Actor for generate: `carol.admin@sedmc.local` (`carolToken`), same tenant as RFP create (`11111111-1111-4111-8111-111111111111`). Bob was used only for approval decision, then Carol posted proposals. Not a tenant mismatch. Not a stale/other RFP id.
- `getRfp` → `loadRfp` → mixed-SQL `getRfpById(store.dbPool, tenantId, id)` (`apps/api/src/rfp/rfp.ts`).
- `createRfp` mixed-SQL path persists to PostgreSQL then **returns without** `store.rfpRfps.push` (push is only on the in-memory branch after that return).
- `generateProposal` (`apps/api/src/proposal/proposal.ts` ~227–230) is **synchronous** and reads **only** `store.rfpRfps.find(...)`. Missing row returns `{ error: "not_found", reason: "rfp_not_found" }`. Route maps `not_found` → HTTP 404 (`apps/api/src/proposal/routes.ts`).
- Same class of skip-store-push exists on programme create, costing sheet create, and approval create (mixed-SQL returns after PG commit). `generateProposal` also reads `store.prgProgrammes`, `store.costSheets`, `store.comApprovalRequests`, then **only** `store.propProposals.push` (no `prop_proposals` insert). Those are **latent** mixed-SQL gaps behind the first 404; they were not reached in H-149.

**Classification:** **Genuine application defect.**

**Root cause:** Mixed-SQL durable SoR vs process-local Store. Proposal generate does not use `loadRfp` (or equivalent PG lookup). Identifier, tenant, and route/payload were correct.

**Affected file(s):** `apps/api/src/proposal/proposal.ts` (primary); `apps/api/src/proposal/routes.ts` (must become async if lookup/persist is awaited). Related mixed-SQL loaders already exist in `rfp.ts`, `programme.ts`, `costing/sheet.ts`, `commercial-approval/approval.ts`. Table `prop_proposals` exists (`020_c8_proposal.sql`) but generate does not persist to it.

**Minimal remediation (NOT implemented):** Make `generateProposal` durable-aware: `await loadRfp`, load programme/cost sheet/approved request from mixed-SQL repositories, persist proposal+version in the same durable transaction pattern used by RFP/programme/costing. Do **not** treat “push the RFP into `store.rfpRfps` after create” as sufficient — restart would still lose an in-memory-only proposal.

**Regression risk:** Medium. Touches commercial Path B / approval gate inside `generateProposal`; must not invent FX, 250k/20%, or new thresholds. Must keep OD-09 `rejectPersonDomainContent` on generate.

**Exact test required after a future rem grant:** Isolated Dev/Test mixed-SQL: create RFP (GET 200) → programme → costing → approval decision → `POST /v1/proposals` **201** with same `rfpId`; GET proposal 200; process restart; GET proposal 200. Repeat UAT-PROP-01. Do not claim Production UAT from that test.

**Severity:** P1 commercial current-code.

**Genuine defect?** **Yes.**

**Remediation required?** Yes, under a **separate** controlled grant. **Not authorized in H-150.**

**Separate authorization?** **Yes — candidate for next rem action.**

---

### 4. H149-D-03 — UI / `node:crypto` failure

**Evidence**

- Isolated Next `:3049` with `EOS_WEB_DIST_DIR=.next-h149-uat` cold-compiled and failed webpack `UnhandledSchemeError` for `node:crypto`.
- Import chain: `apps/web/src/lib/field-offline-cache.ts` imports `findPersonDomainObjectKeys` from **`@sedmc/kernel`** (package barrel `packages/kernel/src/index.ts`), which `export * from "./crypto.js"`, and `packages/kernel/src/crypto.ts` imports `node:crypto`.
- The same file **already** imports encryption helpers from `@sedmc/kernel/field-cache-crypto` (Web Crypto / `field-cache-crypto.ts`), which is the client-safe path. The barrel import is unnecessary for that helper.
- `EOS_WEB_DIST_DIR` did **not** introduce `node:crypto`. Isolated `distDir` **contributed** by forcing a cold webpack compile (existing `:3001` held `.next-local` lock; H-149 did not kill it and did not point `:3001` at UAT).
- `apps/web/next.config.ts` vs HEAD: `distDir` became `process.env.EOS_WEB_DIST_DIR ?? ".next-local"`; `allowedDevOrigins: ["127.0.0.1"]` added. Neither redesigns Production hosting.

**Classification:** **Genuine client-bundle / application defect**, **exacerbated by** isolated UAT cold `distDir`. Not a browser-harness-only fault. Not an excuse to redesign Production Next.

**Root cause:** Client module pulls the Node kernel barrel.

**Severity:** P1 for current-code UI.

**Genuine defect?** **Yes** (web bundle). Isolated UAT config is a **contributing environment** factor, not the root import.

**Remediation required?** Yes, under a **separate** grant: stop importing `@sedmc/kernel` barrel from client field-cache (e.g. a client-safe subpath export of `findPersonDomainObjectKeys`). Do **not** add Production webpack shims or unrelated dependencies merely to suppress the error. Do **not** treat `EOS_WEB_DIST_DIR` as the fix.

**Separate authorization?** **Yes — candidate for next rem action.** Isolated UAT `distDir` itself is classified in §9, not as this defect’s repair.

---

### 5. H149-REC-01 — Rate GET-by-id 404

**Evidence (independent of Rate Identity overlay)**

- Restart GET `GET /v1/suppliers/${supplierId}/rates/${rateId}` with supplier `87cc65a4-4f9e-41ef-ac3f-38c8caf7aebc` and **rate id** `ee3e141d-869e-4c46-baf2-045547e5dfb9` → **404**.
- Overlay GET `.../rates/:rateId/commercial-facts` → **200**. Hydrate mixed `suppliers:1 rates:1`. Costing GET **200**. Account/opportunity/RFP/programme mixed GETs **200**.
- `apps/api/src/supplier/routes.ts`: POST create rate; PATCH `/rates/:rateId`; DELETE archive; POST prefer. **No GET** `/v1/suppliers/:id/rates/:rateId`. No `getSupplierRate` handler.
- Identifier used is the **supplier rate id**, not the overlay identity id (`069d37d2-…`). The route is not specified to support GET-by-id.
- Record **survived restart** on the overlay and mixed hydrate paths. Proposal mixed GET status **0** because generation never created an id (D-01), not because costing/rate overlay vanished.

**Classification:** **Harness used an unsupported GET** against current contract; **404 is expected** for that URL. Overlay/rate persistence **passed**. Optional future GET-by-id would be a **product change**, not a persistence bug.

**Root cause:** UAT-REC-01 asserted `rateMix.status === 200` on a method/route that is not implemented.

**Severity:** P3 contract/harness (H-149 labelled P2). Persistence of overlays is not failed.

**Genuine application defect?** **No** for persistence. **No** for “rate disappeared.” Missing GET is **current contract**, not a regression of overlay SoR.

**Remediation required?** Harness should GET overlay (or list/calendar) unless Owner separately authorizes a GET-by-id route.

**Separate authorization?** Only if Owner wants GET-by-id as product. Not required to close overlay persistence.

---

### 6. H149-UI-02 — Field-cache logout blocked

**Evidence**

- UAT-UI-01 never rendered; webpack failed before commercial UI.
- Logout was **not** exercised in the isolated browser.
- Source still: `clearSession()` → `clearFieldCaches()` (`apps/web/src/lib/eos-session.ts`). H-141 unit coverage remains historical; live UAT-UI-02 was not run.

**Classification:** **Test-environment / blocked** (UI compile prevented exercise). Not PASS. Not FAIL of logout behavior.

**Root cause:** Dependent on H149-D-03. Cache was not shown to be inaccessible as a separate product bug; the page never loaded.

**Severity:** P2 blocked coverage.

**Genuine defect?** **Unresolved as behavior** (not tested). The blocking defect is D-03.

**Remediation required?** Do not claim logout PASS. After D-03 rem, re-run live UAT-UI-02 under a later UAT grant.

**Separate authorization?** Coverage re-test after UI rem; not a standalone logout rem.

---

## D. Remediation authorization

**Blanket remediation authority: NOT GRANTED.**

H-150 does **not** implement, and does **not** authorize implementing:

- proposal generate mixed-SQL fix;
- UI/`node:crypto` client import fix;
- Rate Identity application changes;
- further edits to migration 125;
- migration 126;
- GET rate-by-id product route;
- Production work.

**Confirmed genuine defects (candidates for a later separately controlled rem grant):**

| Candidate | ID | Scope bound |
| --- | --- | --- |
| 1 | H149-D-01 | Durable-aware `generateProposal` (RFP + related programme/costing/approval lookup and proposal persist). Dev/Test only. |
| 2 | H149-D-03 | Client-safe import of person-domain key helper; no Production Next redesign. |

The Owner/POA is **prepared to authorize** those two targeted repairs in a subsequent named action. That action is **not** this record and is **not** auto-created as H-151.

**Not candidates for application rem:**

| ID | Why |
| --- | --- |
| H149-H-01 / RI-01 | Harness false-negative |
| H149-REC-01 | Unsupported GET; overlay persisted |
| H149-UI-02 | Blocked test |
| H149-I-01 | CHECK should **remain**; no further 125 work; commit of 125 needs its own later governance |

---

## E. UAT disposition

```text
H-149 = PASS WITH FINDINGS
```

This is **not** converted to PASS because some failures are harness/environment issues. Proposal generate and isolated UI compile remain genuine current-code defects. Privacy regression remains PASS. Commercial regression remains PASS WITH FINDINGS.

```text
UAT PASS ≠ PRODUCTION READY
```

---

## F. Production

H-149 and H-150 do **not** close Production gates.

The following remain **OPEN** and **unclosed**:

PDPC · EI-01 · ADR-0006 · DP-0006 · hosting/provider/region · Production catalog · Production migration · secrets/KMS · IdP · MFA · HTTPS/DNS/TLS/CORS · backup/restore · operations/on-call · event transport · email provider · supervision · observability · rollback/DR · SoR cutover · Production access model

```text
PRODUCTION NOT AUTHORIZED / NOT READY
```

`validateDeploymentConfig()` / `productionReady: false` unchanged. Isolated UAT does not validate Production.

---

## 9. H-149 application changes reconciliation

Inspected in place. **None discarded.**

| File | Why changed | Required by UAT? | Product change? | Temporary/UAT-only? | Should remain? |
| --- | --- | --- | --- | --- | --- |
| `packages/db/migrations/125_h135_phase1_personal_data_domain.sql` | CHECK expanded so authorized `UPDATE … retired` can apply on a fresh catalog | Required to **apply** 125 on `eos_h149_uat`; not required by a named HTTP scenario | Yes: completes uncommitted 125 semantics | No (needed for any fresh 125 apply) | **Yes.** Do not revert. Commit later only under separate governance. |
| `apps/web/next.config.ts` | `distDir` from `EOS_WEB_DIST_DIR` (default still `.next-local`); `allowedDevOrigins: ["127.0.0.1"]` vs HEAD | Isolated web needed a distinct distDir because `:3001` locked `.next-local` | Adjacent Dev/preview config; default distDir unchanged | Env override is UAT-useful; `allowedDevOrigins` is Dev-preview, not Production infra | **Yes** remain in worktree. Not a Production hosting redesign. Do not treat as the D-03 fix. |
| `apps/web/tsconfig.json` | Next auto-include `.next-h149-uat/types/**` and `dev/types/**`; `exclude` gained `**/*.test.ts(x)` vs HEAD | Include is a side-effect of isolated distDir compile; test exclude is typecheck hygiene | Test exclude is product-adjacent; h149 includes are local | `.next-h149-uat` includes are UAT-named | **Yes** remain (do not discard). Harmless; not the `node:crypto` root cause. |
| `.gitignore` | Ignore `.next-h149-uat/` | Hygiene so isolated distDir is not committed | No runtime product behavior | UAT-named ignore; same class as `.next-local/` | **Yes** remain. |

---

## 10. Privacy stream

H-146 was **not** reopened. OD-01–OD-16 were **not** changed.

| Check | Result |
| --- | --- |
| H-145 OD-09 leftover writes still invoke `rejectPersonDomainContent` | Confirmed on authorized leftover paths including `proposal.ts` `generateProposal`, costing, supplier, programme item, activity, task, AI drafts, content-blocks |
| H-149 privacy regression | **PASS** (H-149 §D) |
| H-146 **20** CONTROLLED/ACCEPTED | Remain controlled/accepted |
| H-146 **3** CLOSED (`H142-IMP-08`, `H142-DOC-10`, `H142-FC-07`) | Remain closed |

No new privacy remediation programme.

---

## 11. Roadmap boundary

Not implemented and not authorized: H-81 · C11+ · F2-I12 · Path D · Gmail/mailbox ingestion · WhatsApp ingestion · Excel ingestion · FX providers · KPI history · revenue/profit reconstruction · booking commercial-facts expansion · 250k/20% rule · new commercial thresholds · Production deployment.

Commercial SoR remains Office, Excel, Outlook/Gmail, WhatsApp, and phone.

---

## Final safety check

Executed after writing this record:

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

Expected and confirmed in the closing operator check:

- HEAD unchanged: `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`
- Branch unchanged: `master`
- Index empty
- Existing worktree preserved (porcelain 636 → 637 = this file only as the new path)
- No commit · no push · no live migration · no Production action · no 126

---

## STOP

H-150 classification and governance documentation are complete.

**Do not** implement the proposal fix.  
**Do not** fix the UI.  
**Do not** modify Rate Identity.  
**Do not** modify migration 125 further.  
**Do not** create migration 126.  
**Do not** begin Production.  
**Do not** create H-151 automatically.
