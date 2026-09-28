# H-153 — Current-Code UAT Acceptance and Production-Readiness Gate

> **GOVERNANCE AND EVIDENCE-RECONCILIATION ONLY.** Not remediation. Not application change. Not schema change.  
> **Not Production authorization. Not Production deployment. Not live migration. Not SoR cutover.**  
> H-147, H-149, H-150, H-151, and H-152 were **not** overwritten. OD-01–OD-16 were **not** changed. H-146 was **not** reopened.  
> Rate Identity was **not** modified. Migration 125 was **not** modified. Migration 126 was **not** created.  
> Hydration findings were **not** repaired. GET rate-by-id was **not** added. H-154 was **not** created.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**Authority exercised:** Patrick Makundi / Commercial Director, under Owner-granted POA.

```text
H-153 STATUS: COMPLETE
AUTHORIZED SCOPE: CURRENT-CODE UAT ACCEPTANCE + PRODUCTION-READINESS RECONCILIATION
CURRENT-CODE UAT: ACCEPTED WITH DOCUMENTED LIMITATIONS
PRODUCTION: NOT AUTHORIZED / NOT READY
UAT ACCEPTED ≠ PRODUCTION READY
PRODUCTION AUTHORIZATION: NOT GRANTED
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
MIGRATION 126: NOT CREATED
STOPPED AFTER H-153: YES
H-154: NOT CREATED
```

Authoritative sources for this assessment (read in this action; not rewritten):

1. `docs/governance/h-147-eos-readiness-gap-reconciliation.md`
2. `docs/governance/h-149-current-code-uat-campaign.md`
3. `docs/governance/h-150-h149-findings-triage-and-remediation-authorization.md`
4. `docs/governance/h-151-targeted-h149-p1-remediation.md`
5. `docs/governance/h-152-post-h151-current-code-uat-revalidation.md`
6. `docs/governance/h-152-evidence/` (`wave1-results.json`, `wave2-restart-results.json`, `wave1-misdirected-18149.json`, `uat-ids.json`, `uat-ids-misdirected-18149.json`)

---

## A. Two gates

H-153 answers two different questions.

| Gate | Question | Decision |
| --- | --- | --- |
| Current-code UAT | Is the current EOS worktree’s UAT now acceptable, with documented limitations, following H-151 remediation and H-152 revalidation? | **ACCEPTED WITH DOCUMENTED LIMITATIONS** |
| Production readiness | Is EOS Production-ready? | **NOT READY / NOT AUTHORIZED** |

These decisions are **not** interchangeable.

```text
CURRENT-CODE UAT ACCEPTED WITH DOCUMENTED LIMITATIONS
≠
PRODUCTION READY
≠
PRODUCTION AUTHORIZED
```

Do **not** call the UAT flawless or defect-free. Do **not** treat UAT acceptance as a Production grant.

---

## B. Baseline

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
| Porcelain | **647** (H-152 closed at **645**; unrelated later dirty paths preserved, including local-preview trailing-slash files) | **648** (this file only as the new H-153 path) |

**H-152 UAT environment (authoritative campaign; not re-executed here):**

| Item | Value |
| --- | --- |
| Catalog | `eos_h152_uat` on `127.0.0.1:5440` |
| Migration level | **125** (`schema_migrations` count **121**). No 126 file. No 126 row. |
| EOS_ENV | `development` |
| API | `http://127.0.0.1:18153`; restart-equivalent `http://127.0.0.1:18154` |
| Web | `http://127.0.0.1:3052` (`EOS_WEB_DIST_DIR=.next-h152-uat`) |
| Data | Synthetic only (`H152 Synthetic *`; Dev identities `carol.admin@sedmc.local`, `bob.approver@sedmc.local`, `partner@external.local`) |
| Production connection | **None** |

Historical `eos_h149_uat` on `:5439` remains in place. H-153 did **not** delete, reset, or clean that catalog.

Commercial SoR remains Office / Excel / Outlook-Gmail / WhatsApp / phone. EOS has **not** replaced SoR.

---

## C. H-149 / H-150 / H-151 / H-152 chain

Prior records are **not** rewritten. Their dispositions remain as written.

| Action | What it did | Disposition retained |
| --- | --- | --- |
| **H-149** | Isolated current-code UAT on `eos_h149_uat` `:5439` / API `:18149` / web `:3049`. Exposed proposal durability defect, client-bundle defect, field-cache UI blocked by that compile failure, Rate Identity harness false-negative, unsupported GET rate-by-id, and other non-blocking findings. Privacy regression **PASS**. | **PASS WITH FINDINGS** |
| **H-150** | Classified those findings. Did **not** repair them. Authorized no blanket rem. Identified H149-D-01 and H149-D-03 as the only candidates for a later targeted rem grant. | Triage complete; H-149 unchanged |
| **H-151** | Owner-authorized **only** H149-D-01 and H149-D-03 in Dev/Test. D-01: mixed-SQL PG-first proposal generate/persist. D-03: client-safe `@sedmc/kernel/personal-data-content-contract` import. H149-UI-02 then **PASS** on isolated `:3051`. | Targeted rem complete; D-01 and D-03 remediated in Dev/Test |
| **H-152** | Post-H-151 revalidation on a **new** catalog `eos_h152_uat` `:5440` / API `:18153`+`:18154` / web `:3052`. D-01 **PASS**. D-03 **PASS**. H149-UI-02 **PASS**. Findings H152-F-01 / F-02 / F-03 recorded, not remediated. | **PASS WITH FINDINGS** |

H-152 is the appropriate evidence for current-code UAT acceptance. H-149 remains the original campaign that found D-01 and D-03. H-153 does **not** reopen D-01 or D-03.

---

## D. Current-code UAT acceptance

```text
CURRENT-CODE UAT: ACCEPTED WITH DOCUMENTED LIMITATIONS
```

**Reason:** The post-H-151 current-code UAT revalidation (H-152) demonstrated that the two H-149 P1 defects authorized for remediation were successfully resolved and revalidated. The remaining findings are non-blocking hydration defects and a UAT harness/process-control issue, none of which invalidates the tested commercial/privacy flows.

This is **not** a clean PASS of H-149 itself. H-149 stays **PASS WITH FINDINGS**. H-153 accepts the **current-code UAT** on the strength of H-152 revalidation plus the documented limitations below.

### D.1 Demonstrated on H-152 evidence (not re-run in H-153)

| Item | Evidence | Result |
| --- | --- | --- |
| H149-D-01 durable RFP/proposal path | `wave1-results.json` against **18153 / eos_h152_uat**: RFP `f9aa6489-52a1-4ca8-8d9f-2e8f7a673af9` create 201 / GET 200 | **PASS** |
| Path B approval gate preserved | pending generate **409** `path_b_approval_required` (not `rfp_not_found`); Bob decision 200; then generate 201 | **PASS** |
| Proposal persistence | proposal `28ff6667-d083-4420-8091-bed3d47edb71`; GET 200; by-rfp 200; `prop_proposals` row `H152-RFP-001` | **PASS** |
| Fresh-process persistence | `wave2-restart-results.json` against **18154**: GET RFP 200; GET proposal 200 same `rfpId` | **PASS** |
| Tenant isolation | partner GET RFP **404**; POST proposals **403**; GET proposal **404**; restart GET 404/404 | **PASS** |
| H149-D-03 client bundle | isolated typecheck/build/runtime; no `UnhandledSchemeError` / `node:crypto` bundle failure | **PASS** |
| Field-cache logout (H149-UI-02) | CRM session then Sign out; `fieldCacheKeyCount: 0`; session absent | **PASS** |
| Privacy regression | OD-09 leftover `guestName` 400; person-domain writes 400; import fail-closed; notification leftover key 400 | **PASS** |
| Rate Identity overlay | PUT **200**; GET `.../commercial-facts?at=2026-09-21` **200**; mixed amount **250 USD**; identities length **1** | **PASS** |
| Commercial regression | H-149 HTTP chain through costing **PASS**; H-152 proposal generate/persist **PASS** | **PASS** for UAT acceptance of the tested chain |
| Focused tests | API 6 files / 30 tests; web 2 files / 6 tests; both typechecks exit 0 | **PASS** (focused only) |

### D.2 Commercial chain (UAT acceptance only)

The following current-code commercial chain has been demonstrated **sufficiently for UAT acceptance**:

Organization/account context → Opportunity/RFP → Programme → Supplier/rates → Rate Identity → Costing → Proposal generation/persistence, with Path B approval preserved.

That chain is **Dev/Test / isolated UAT evidence**. It does **not** mean:

- EOS has replaced the commercial SoR;
- EOS is operationally adopted in Production;
- historical KPI, revenue, or profit data exists or was reconstructed;
- FX, 250k/20%, or new commercial thresholds were implemented.

### D.3 UAT limitations (minimum)

1. **H152-F-01** — `/field` hydration mismatch remains unresolved.
2. **H152-F-02** — `Shell.tsx` hydration overlay remains unresolved.
3. **H152-F-03** — H-152’s first harness wave used a stale API URL and wrote one historical synthetic record into `eos_h149_uat`; controlled rerun against `18153 / eos_h152_uat` passed. The historical H-149 row remains in place and must **not** be deleted.
4. Focused tests were executed; **no full-suite claim** is made.
5. UAT remains **synthetic / Dev-Test evidence** and does **not** constitute Production evidence.

Additional already-documented environment limitations carried forward (not new defects): `EOS_ENV=development` on a UAT-named catalog (`EOS_ENV=uat` remains production-like and refused); in-memory event transport / dev-outbox labelled not Production; Windows `npx tsx` process-control class (H117-D-01).

---

## E. H-152 finding dispositions

F-01 and F-02 are **not** combined. They remain two findings.

### E.1 H152-F-01 — `/field` hydration mismatch

| Field | Record |
| --- | --- |
| Classification | **Genuine application defect** |
| Blocks H-152 / H-153 UAT acceptance? | **No** (non-blocking) |
| Overlay | Next.js **development** diagnostic overlay |
| Same as H149-D-03 `node:crypto`? | **No** |
| Reopen D-03? | **No** |
| Remediated in H-152 or H-153? | **No** |
| Application edit this action? | **None.** `apps/web/src/app/field/page.tsx` was **not** modified. |

H-152 observed on `http://127.0.0.1:3052/field`: React hydration error at `src\app\field\page.tsx (81:9) @ FieldHomePage`. Current code: `"use client"` `FieldHomePage` calls `getOrCreateDeviceId()` during render; server branch returns `"server"`; client reads/writes `localStorage`. Next reported the hydration mismatch. Collapsed, the field login form still rendered. Isolated `next build` compiled `/field` without that overlay (dev-only UI). The mismatch is application code, not Production infrastructure, and is **not** a reason to reopen D-03.

Recorded for a later separately authorized action. **Not** authorized here.

### E.2 H152-F-02 — `Shell.tsx` hydration overlay

| Field | Record |
| --- | --- |
| Classification | **Genuine application defect** |
| Blocks H-152 / H-153 UAT acceptance? | **No** (non-blocking) |
| Overlay | Next.js **development** diagnostic overlay |
| Same finding as F-01? | **No** — separate surface (`Shell.tsx` vs `/field`) |
| Remediated in H-152 or H-153? | **No** |
| Application edit this action? | **None.** `apps/web/src/components/commercial/Shell.tsx` was **not** modified. |

H-152 observed an incidental overlay after CRM login at `src\components\commercial\Shell.tsx (232:17)` (nav `Link` / `mounted` badge). Same class as F-01 (genuine hydration, non-blocking, not D-03) but a **distinct** defect. H-118’s historical H117-D-02 Cursor-instrumentation disposition is **not** used to collapse or close F-02.

Recorded for a later separately authorized action. **Not** authorized here.

### E.3 H152-F-03 — stale `UAT_API_URL`

| Field | Record |
| --- | --- |
| Classification | **UAT harness / process-control finding** |
| EOS application defect? | **No** |
| Blocks UAT acceptance after controlled rerun? | **No** |
| Application edit this action? | **None** (do not compensate in application code) |

H-152 first harness wave inherited leftover `UAT_API_URL=http://127.0.0.1:18149` (pre-D-01 API against historical `eos_h149_uat`). That wave wrote synthetic `H152-RFP-001` into **historical `eos_h149_uat`**. Evidence: `wave1-misdirected-18149.json` (12 PASS / 3 FAIL, including `rfp_not_found` on Path B generate against the stale process). Authoritative rerun used `H152_API_URL` default `http://127.0.0.1:18153` against `eos_h152_uat` (`wave1-results.json` **15/15 PASS**). Restart on **18154** **PASS**.

The historical H-149 row in `eos_h149_uat` **remains in place** and must **not** be deleted. H-153 does **not** clean historical H-149 data.

**Future test-control lesson:** UAT campaigns must verify API URL and catalog identity **before the first write**.

---

## F. D-01 / D-03 / UI-02 reconciliation

| ID | H-149 | H-150 | H-151 | H-152 | H-153 |
| --- | --- | --- | --- | --- | --- |
| **H149-D-01** | FAIL (`POST /v1/proposals` 404 `rfp_not_found` while GET RFP 200) | Genuine P1; rem candidate; not repaired | Remediated (PG-first generate + `prop_proposals`) | **PASS** (Path B 409 then 201; persist; restart; tenant) | **Not reopened.** Accepted as remediable P1 now revalidated. |
| **H149-D-03** | FAIL (isolated webpack `UnhandledSchemeError` `node:crypto`) | Genuine P1 client-bundle; rem candidate; not repaired | Remediated (subpath import; no webpack polyfill) | **PASS** (typecheck/build/runtime/browser) | **Not reopened.** F-01/F-02 are **not** D-03. |
| **H149-UI-02** | BLOCKED (UI never compiled) | Blocked coverage; re-test after D-03 | **PASS** on `:3051` | **PASS** on `:3052` | Logout evidence accepted. Hydration overlays do **not** convert this back to FAIL. |

---

## G. Rate Identity

- Overlay regression on H-152 remained **PASS** (PUT 200; GET overlay 200; mixed **250 USD**; identity count **1**).
- **H149-RI-01 / H149-H-01** was correctly classified in H-150 as a **harness false-negative** (assertion looked at the wrong JSON path; `amountIsNotIdentity` lives on `identity`). Underlying functionality passed in H-149 HTTP and again in H-152.
- **No Rate Identity implementation change** occurred in H-152 or H-153.
- **H149-REC-01** GET `/v1/suppliers/:id/rates/:rateId` remains **unsupported**. H-152 confirmed **404** route-not-found (`REC-01-UNCHANGED` **PASS** as “still not a resource GET”). It was **intentionally not added**. Overlay persistence is not failed.

H-153 does **not** authorize or implement GET rate-by-id. Rate Identity semantics are **unchanged**.

---

## H. Privacy / H-145 / H-146 (carried forward)

H-145 and H-146 are **not** reopened. No new privacy requirements are invented. Accepted residual capabilities remain accepted.

```text
H-145: OD-01 through OD-16 CONFIRMED
H-146: 23 findings reconciled
CLOSED: 3 (H142-IMP-08, H142-FC-07, H142-DOC-10)
CONTROLLED / ACCEPTED: 20
REMAINING / DEFERRED: 0
BLOCKED / FUTURE OWNER DECISION: 0 among those 23
OD-09: verified (H-145 leftover-key contract; H-152 generate guestName 400 person_domain_removed)
H-152 privacy regression: PASS
```

```text
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

H-142/H-146 privacy remediation status ≠ PDPC / regulatory readiness ≠ Production readiness. Do **not** claim PDPC closure.

---

## I. Migration 125 / migration 126

| Item | Record |
| --- | --- |
| Current isolated UAT apply level | **125** (`125_h135_phase1_personal_data_domain.sql`) |
| H-149 completeness CHECK allowing `retired` | **Remains in the worktree** (H149-I-01). Do **not** revert. |
| Migration 126 | **Not created.** No `packages/db/migrations/126*` file. |
| Live / Production schema migration | **None.** Not authorized. |
| Migrations 001–124 | **Not modified** by H-153. |

The worktree modification of uncommitted 125 is **not** Production approval. `productionReady` remains **false**.

---

## J. Production-readiness reconciliation

```text
Is EOS Production-ready?
NOT READY

Is Production authorized by H-153?
NOT GRANTED
```

```text
UAT ACCEPTED ≠ PRODUCTION READY
```

`validateDeploymentConfig()` / `productionReady: false` is unchanged. Isolated UAT success does not validate Production hosting, credentials, DNS, TLS, IdP, or operational controls.

### J.1 Named blocker inventory (H-147 count preserved)

H-147 named **28** Production blockers (26 H-120 P0s + current-tree UAT re-acceptance + EI-01). H-153 does **not** silently drop that inventory to a smaller number.

**Transparent reconciliation of item 27 only:**

| Named # | Gate | H-147 | H-153 |
| ---: | --- | --- | --- |
| 27 | UAT of **current worktree** (H147-R-36) | OPEN — historical H-117 stale vs migration 125 + privacy work | **SATISFIED AS UAT EVIDENCE ONLY** by H-152 revalidation + this acceptance. Still **not** Production validation. Still **not** a Production catalog, host, or grant. |

**OPEN Production blockers after this reconciliation: 27 of the 28 named items** (1–26 and 28). Named inventory remains **28 rows**. Item 27 is closed as a **current-code UAT prerequisite**, not as a Production-environment close.

| # | Gate | H-153 status |
| ---: | --- | --- |
| 1 | Production authorization grant | **OPEN** — H-153 does not grant it |
| 2 | Hosting/provider/region | **OPEN** |
| 3 | ADR-0006 formal approval | **OPEN** — proposed, blocked for Production |
| 4 | DP-0006 named option approval | **OPEN** — not approved |
| 5 | Production database/catalog (not eos / h112 / h117 / h149 / h152 / gateb) | **OPEN** — does not exist |
| 6 | Authorized Production schema migrate | **OPEN** — Gate C blocked |
| 7 | Secrets/KMS | **OPEN** |
| 8 | Identity provider | **OPEN** |
| 9 | MFA at IdP | **OPEN** |
| 10 | HTTPS | **OPEN** |
| 11 | DNS | **OPEN** |
| 12 | Database TLS attached to a real Production DB | **OPEN** |
| 13 | Production CORS origins | **OPEN** |
| 14 | Backup product | **OPEN** |
| 15 | Restore evidence of Production state | **OPEN** |
| 16 | Operations ownership / HUM-08 | **OPEN** / partial Owner-attested titles only |
| 17 | On-call roster | **OPEN** |
| 18 | E1-C legal/privacy Production-blocking (PDPC, DPO combined close, DPAs) | **OPEN** |
| 19 | Production event transport (NATS product) | **OPEN** |
| 20 | Production email product + DPA | **OPEN** |
| 21 | Process supervision (not `tsx`) | **OPEN** |
| 22 | Observability sink + alerting | **OPEN** |
| 23 | Passing production-like start on **real** config | **OPEN** (fail-closed code exists) |
| 24 | Rollback/DR procedure on Production topology | **OPEN** |
| 25 | SoR / adoption (deploy ≠ live operations) | **OPEN** — cutover not authorized; H-81 **NOT STARTED** |
| 26 | Production security/access model (IdP-linked principals) | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** (H-153). Not Production evidence. |
| 28 | EI-01 TIN identity reconciliation | **OPEN / REQUIRES OWNER EVIDENCE REVIEW** |

```text
PDPC OPEN
EI-01 OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 OPEN
DP-0006 OPEN
```

H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Catalogs `eos`, `eos_h112_full`, `eos_h117_uat`, `eos_h149_uat`, `eos_h152_uat`, and `eos_gateb` **are not Production**.

---

## K. Production authorization (explicit)

```text
Production authorization is NOT GRANTED by H-153.
```

H-153 is only (1) acceptance of the current-code UAT evidence and (2) reconciliation of the Production-readiness gate.

**Not authorized:**

- Production deployment
- Production infrastructure
- credentials, secrets, KMS, users
- DNS, TLS, IdP, MFA
- Production catalog creation
- live / Production migration
- external service provisioning
- Production user creation

No hosting provider is selected. No Production origin is invented.

---

## L. Explicitly excluded (not started)

```text
H-154: NOT CREATED
H-81: NOT STARTED
C11+: NOT AUTHORIZED
F2-I12: NOT AUTHORIZED
Path D: NOT AUTHORIZED
mailbox / Gmail / WhatsApp / Excel ingestion: NOT AUTHORIZED
FX providers: NOT AUTHORIZED
historical KPI / revenue / profit reconstruction: NOT AUTHORIZED
booking commercial-facts expansion: NOT AUTHORIZED
250k / 20% rule: NOT AUTHORIZED
GET rate-by-id: NOT IMPLEMENTED
Rate Identity semantics: UNCHANGED
hydration repair (F-01 / F-02): NOT PERFORMED
migration 126: NOT CREATED
```

---

## M. Changed files this action

**Only:**

* `docs/governance/h-153-current-code-uat-acceptance-and-production-readiness-gate.md` (this file)

H-153 did **not** modify application, schema, or infrastructure files. H-153 did **not** modify prior H-147 / H-149 / H-150 / H-151 / H-152 records. Unrelated dirty worktree paths (including H-149–H-152 artefacts and later local-preview files) were **preserved**.

---

## N. Final safety check

Expected and confirmed in the closing operator check:

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

- HEAD unchanged: `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`
- Branch unchanged: `master`
- Index empty
- Existing worktree preserved
- No commit · no push · no live migration · no Production action · no 126
- No H-154

---

## STOP

H-153 recorded current-code UAT **ACCEPTED WITH DOCUMENTED LIMITATIONS** and Production **NOT READY / NOT AUTHORIZED**.

Did **not**: remediate F-01/F-02; compensate for F-03 in application code; reopen D-01/D-03; add GET rate-by-id; change Rate Identity; revert or extend migration 125; create migration 126; begin H-81 / C11+ / F2-I12 / Path D / ingestion / SoR cutover; start Production; create H-154.
