# GPTA-H-03 — E1-D Closure / Remediation Decision Readiness Assessment

> **`GOVERNANCE ASSESSMENT ONLY — NOT AN AUTHORIZATION`**  
> **`NO IMPLEMENTATION`** · **`NO COMMIT`** · **`NO PUSH`** · **`NOTHING STAGED`**  
> **`NEXT_INCREMENT=NONE_AUTHORIZED`**  
> **`GPTA-H-02 = NO VALID COMMIT SCOPE ESTABLISHED`**  
> **`E1-D IS NOT CLOSED`**  
> **`NA-A-23 IS NOT CREATED`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T21:50:00+03:00**.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.

This assessment does **not** close E1-D. It does **not** grant remediation, UAT, commit, or push. The Owner must choose among the outcomes in §16. **No outcome is selected here.**

---

## 1. Executive summary

The existing E1-D work in the dirty tree is **implemented in named slices** and **audited**, but **E1-D as a programme is not closed**. Class A is `COMPLETE WITH TEST-ENVIRONMENT EXCEPTION` (uncommitted). Narrow Class B NB1–NB4 is `CLOSED` for the authorized mutation/inventory/port/`/ready` slice. NB5 is **`HARNESS EXISTS ≠ DRILL COMPLETED`** (`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`; `pg_dump`/`pg_restore` not on PATH). Umbrella Class B remains `PREPARED — NOT GRANTED`. Class C–F remain open and depend on paused E1-B, human decisions, Gate C remainder, and Production — none of which this assessment may reopen.

GPTA-H-02 established **`NO COHERENT COMMIT SCOPE`**. Required Class A/B callers (`main.ts`, `server.ts`, kernel ports, CRM/persistence) are **mixed with protected overlays**. Absorbing them to manufacture closure would reopen Gate B persist, E1-C portability, login/preview, and/or SQL 123. Completing NB5 would require **provisioning dump tools**, which governing records **forbid**. F1 (`eos_gateb` `42P07`) is a **pre-existing test-environment defect**, not an E1-D Class A/B regression; its commit/closure impact remains **`F1 = OWNER/GOVERNANCE DECISION REQUIRED`**. UAT: **`UAT EVIDENCE REQUIRED`** for any later commit/closure campaign; Class A/B **audits are not UAT**; governing Dev/Test grants **explicitly excluded UAT**.

A bounded increment that would **close E1-D** cannot be named without reopening unrelated work.

**`NO BOUNDED REMEDIATION SCOPE ESTABLISHED`**

Parking is **viable**: the work already exists in the dirty tree; it must **not** be deleted, reverted, or staged; reopening requires a **future explicit Owner grant** naming files and gates.

**Owner outcomes A/B/C are unselected.** Assessment status (not an Owner choice):

`GPTA-H-03 STATUS = FORMAL PARKING/DEFERMENT DECISION REQUIRED`

---

## 2. Repository state

| Item | Fact |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | **DIRTY** (~289 porcelain: 79 modified, 210 untracked — prior GPTA-H-02 count; this task did not re-count by mutating the tree) |
| Index | **EMPTY** |
| Remote | `origin` exists |
| Upstream for `master` | **absent** |
| Ahead/behind | **NOT ESTABLISHED** |
| Commit | **NOT GRANTED** |
| Push | **NOT GRANTED** |
| New implementation increment | **NONE AUTHORIZED** |

GPTA-H-02: `OWNER DECISION PACKAGE READY — NO VALID COMMIT SCOPE ESTABLISHED`.

---

## 3. Current governance state (unchanged)

| Item | Status |
| --- | --- |
| E1-C | **CONTROLLED PAUSE** |
| NA-A-22 | **OPEN** |
| GPTA-H-01 | **CLOSED — PATH B ON HOLD** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| E1-B RFI | **CONTROLLED PAUSE** (0 transmissions) |
| Production deploy/migrate | **NOT AUTHORIZED** |
| Production infrastructure | **NOT APPROVED** |
| Procurement | **NOT AUTHORIZED** |
| Stage 1 | **NOT APPROVED / NOT COMPLETE** |
| CAP-GATE-01 | **NOT COMPLETE** |
| GPTA-H-02 commit | **NOT GRANTED** |
| GPTA-H-02 push | **NOT GRANTED** |
| E1-D programme | **NOT CLOSED** |
| Umbrella Class B request | **PREPARED — NOT GRANTED** |
| Narrow NB1–NB5 grant | **AUTHORIZED — DEV/TEST ONLY** (implementation already performed; drill remaining environment-blocked) |

This assessment does **not** reopen or advance the paused/held workstreams above.

---

## 4. E1-D inventory

Sources: Class A implementation record + post-implementation audit; narrow Class B authorization + implementation record + reconciliation + audit; GPTA-H-02 assessment and Owner decision package.

| Increment / workstream | Exact paths (primary) | Auth | Implementation | Tests | Reconciliation | Audit | UAT | Dependency | Closure | Commit | Blocker(s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Class A helpers | `apps/api/src/devtest-http-controls.ts`; `apps/api/src/devtest-token-secret.ts` (untracked) | Stage prompt + record (pack file still `PREPARED — NOT GRANTED`) | Recorded complete | Used by 11/11 focused PASS | Audit: inside Dev/Test boundary | `PASS WITH TEST-ENVIRONMENT EXCEPTION` | **EVIDENCE NOT FOUND** | Runtime/compile: `server.ts`, `main.ts`; later E1-C files also import token helper | Class A **slice** complete-with-exception; **E1-D not closed** | **NOT GRANTED** | Mixed callers; no UAT; no commit grant; F1 full-suite not green |
| Class A tests (4) | `apps/api/src/e1-d-class-a.devtest-http.test.ts`; `e1-d-class-a.token-bootstrap.test.ts`; `e1-d-class-a.observability.test.ts`; `e1-d-class-a.localfs-recovery.test.ts` | same | Tests exist | **11/11 PASS** (impl + audit re-run) | — | Re-ran 11/11 | **EVIDENCE NOT FOUND** | Test-only vs helpers; HTTP tests go through `buildServer` (`server.ts`) | Slice tests complete | **NOT GRANTED** | Same as helpers |
| Class A mixed callers | `apps/api/src/server.ts`; `apps/api/src/main.ts`; `infra/compose/dev.yaml`; `.env.example` | Named in Class A record | **Overlaid** after Class A (Gate B, login, E1-C) | Not isolatable as Class A-only | Audit already noted Gate B overlay on `main`/`server` | Mixed-file note recorded | **EVIDENCE NOT FOUND** | Protected / mixed | **Cannot close as Class A-only** | **OUTSIDE** (GPTA-H-02) | Mixing; security on `.env.example` |
| NB1 SoR inventory | `apps/api/src/persistence/sor-inventory.ts`; `docs/governance/adr-0006-e1-d-class-b-sor-inventory.md` | Narrow **AUTHORIZED — DEV/TEST ONLY** | Recorded complete (inventory, not expansion) | In Class B 55-pass / 10/10 focused | **CLOSED** as inventory | Audit **PASS** | **EVIDENCE NOT FOUND** | Test-only import of constant | NB1 **CLOSED**; SoR **expansion** still B6 **not authorized** | **NOT GRANTED** | Expansion is a different class; commit mixed |
| NB2 `DocumentStorage.delete` | `packages/kernel/src/ports.ts`; `packages/kernel/src/commercial-document.ts`; `apps/api/src/commercial-documents/storage.ts`; `service.ts`; `apps/api/src/supplier/contracts.ts` | Narrow grant | Recorded complete for Dev/Test port | In 10/10 Class B + inventory tests | **CLOSED** for authorized port | Audit **PASS** | **EVIDENCE NOT FOUND** | Kernel callers mixed with persistence overlay | NB2 **CLOSED**; Production object store **C** unselected; Gate C item 7 remainder **OPEN** | Callers **OUTSIDE** | Mixed kernel/commercial files; provider Class C |
| NB3 `/ready` honesty | `apps/api/src/server.ts` (`/ready`); Class B `e1-d-class-b.ready.test.ts` | Narrow grant | Recorded complete for Dev/Test | 10/10 includes ready tests | **CLOSED** for Dev contract | Audit **PASS** | **EVIDENCE NOT FOUND** | **Runtime in `server.ts`** (protected mixed) | NB3 **CLOSED**; Production `/ready` **B5 / F not authorized** | `server.ts` **OUTSIDE** | Cannot commit probe without mixed `server.ts` |
| NB4 CRM same-TX | `apps/api/src/crm/events.ts`; `persistence/crm.ts`; `durable.ts`; `pg-repository.ts`; CRM callers; `e1-d-class-b.crm-same-tx.test.ts` | Narrow grant | **CLOSED** for mutation+outbox TX | Mock pool PASS | **CLOSED** for authorized path; live PG **not** proven | Audit **PASS** | **EVIDENCE NOT FOUND** | Mixed with Gate B dual-path / I4 overlay; `outbox.ts` residual **OUT OF SCOPE** | Slice closed; CRM PG SoR **B6 not authorized** | CRM files **OUTSIDE** | Live PG blocked by F1 isolation; mixed persistence |
| NB5 harness | `apps/api/src/persistence/disposable-pg-recovery.ts`; `e1-d-class-b.pg-dump-restore.test.ts` | Narrow grant includes harness **and** drill **if** safe target exists | Harness exists; **drill not executed** | Blocked-path **PASS** | **BLOCKED** | Audit **PASS (blocked as designed)** | **EVIDENCE NOT FOUND** | Needs `pg_dump`/`pg_restore` on PATH + disposable DB ≠ `eos_gateb`. **Must not provision.** | **Not closed** as recovery | **NOT** as completed recovery | **`HARNESS EXISTS ≠ DRILL COMPLETED`** |
| E1-D Class A/B records | Named `docs/governance/adr-0006-e1-d-class-a-*`; `adr-0006-e1-d-class-b-narrow-*`; classification/plans/pack | Records of prior grants | Docs complete as records | N/A | Reconciliation **PARTIAL** for NB slice | Audits exist | N/A | Banners **NO COMMIT**; pack still not granted | Records ≠ programme closure | GPTA-H-02 SET C default **OUTSIDE** | Committing docs could be misread as authorization |
| Other E1-D plans (C–F) | `adr-0006-e1-d-security-remediation-plan.md`; observability; recovery-dr; classification; migration-boundary; test-strategy | Strategy / classification only | **Not implemented** as C–F | Strategy file: strategy **NOT RUN** as that stage | Open | N/A | N/A | Provider / human / Production / Gate C | **Open** | N/A | Must not treat plans as closure |

**Also present, not E1-D increment work:** login/preview web files; E1-C portability (`deployment-config.ts`, `infrastructure-contract.ts`, `e1-c-*.test.ts`); Gate B persist overlay; SQL `123_cd_rfp_programme_relationship_constraints.sql`.

---

## 5. Class A reconciliation

### A. Authorization

**Yes, for A1–A10 Dev/Test implementation**, recorded in [`adr-0006-e1-d-class-a-dev-test-implementation-record.md`](adr-0006-e1-d-class-a-dev-test-implementation-record.md). The umbrella pack [`adr-0006-e1-d-dev-test-implementation-authorization-pack.md`](adr-0006-e1-d-dev-test-implementation-authorization-pack.md) remains **`PREPARED — NOT GRANTED`**. That wording contradiction is **documented and not rewritten**. The pack scope is **Not UAT. Not Production.**

**Not authorized:** Class B–F, UAT, commit, push, Production.

### B. Implementation

**Complete with test-environment exception** for A1–A10 (headers, CORS, in-memory login limiter, token fail-closed, bootstrap hygiene, logger label, compose comment, fixtures, LocalFs recovery tests, recorded tests). Exceptions: full suite not green (**F1**); token fallback still exists for non-Production-like Dev; no HSTS (acceptable for Class A). Audit: **no Class-A remediation required** (not F3/F4).

### C. Tests

| Set | Status |
| --- | --- |
| Four focused Class A files | **11/11 PASS** (implementation + audit) |
| Typecheck | **PASS** |
| Targeted regression (security / gate-b.fail-closed / cd-phase1 / api.test) | **31/31 PASS** |
| Full `@sedmc/api` vitest | **600 PASS / 21 FAIL** — all classified **F1**, not Class A |
| Missing Class A focused tests | **None named** as missing for A1–A10 |

### D. Integration

Class A helpers **do not** form a running API without callers:

| Dependent | Relationship | Kind |
| --- | --- | --- |
| `apps/api/src/server.ts` | imports HTTP controls + `resolveDevTestTokenSecret`; wires headers/CORS/limiter | **compile-time + runtime** |
| `apps/api/src/main.ts` | imports `resolveDevTestTokenSecret` for fail-closed boot | **compile-time + runtime** |
| `apps/api/src/ports/identity.ts` | imports `isProductionLikeEnv` | **compile-time** (also E1-C overlay) |
| `apps/api/src/deployment-config.ts` | imports token helper | **compile-time** — **E1-C**, not Class A |
| `apps/api/src/infrastructure-contract.ts` | same | **E1-C** |
| `apps/api/src/events/transport-init.ts` | same | **E1-C / events** |
| `apps/api/src/persistence/startup-migrations.ts` | same | **Gate B / persist overlay** |
| `apps/api/src/e1-c-deployment-config.test.ts` | imports fallback constant | **test-only E1-C** |
| `.env.example` | Class A one-line token note, later overlaid | **configuration** |
| `infra/compose/dev.yaml` | Class A banner | **configuration** |

Helpers **can** exist as modules without being committed with callers, but that would be an **incoherent increment** (dead code relative to the running server). GPTA-H-02 already recorded that.

### E. Reconciliation

Audit: **PASS WITH TEST-ENVIRONMENT EXCEPTION**. Residual: F1 documented; Class B–F remain; pack-file wording; mixed Gate B lines on `main.ts`/`server.ts` observed, not treated as Class A creep.

### F. UAT

**EVIDENCE NOT FOUND.** Audit banner: **does not authorize UAT**. Focused tests ≠ UAT.

### G. Closure

**Class A slice** is already marked complete-with-exception in the implementation record. **E1-D programme closure** is **not** permitted by Class A completion. Conditions that would still be required *if* the Owner wanted Class A treated as a closed, committable increment (not granted here):

1. Owner commit grant naming exact paths.  
2. Mixed-caller policy (`main.ts`/`server.ts` remain **OUTSIDE** unless a **new** reviewed grant).  
3. Owner F1 accept/defer (`F1 = OWNER/GOVERNANCE DECISION REQUIRED`).  
4. UAT: either an explicit waive or a later UAT grant (`UAT EVIDENCE REQUIRED` if required).  
5. Security clearance for `.env.example` if that file is in any commit.  
6. Separate push decision.

Those conditions **close a commit question**, not E1-D as a whole.

---

## 6. Class B reconciliation

Class B is **B1 Dev/Test persist/observability/recovery**, not Class A HTTP hygiene. It remains Class B because TECH-PER-02/09/11, TECH-OBS-02, TECH-REC-01 were classified **B** in [`adr-0006-e1-d-technical-remediation-classification.md`](adr-0006-e1-d-technical-remediation-classification.md).

| Artifact | Why Class B | Authorized? | Complete? | Tests | Reconciliation | UAT | Unresolved dependencies | Park? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NB1 inventory | TECH-PER-11 inventory vs expansion | Narrow grant **yes** | Inventory **yes**; expansion **no** | In 55-pass | **CLOSED** as inventory | **EVIDENCE NOT FOUND** | Expansion B6 not authorized | Slice can remain parked as closed inventory |
| NB2 delete port | TECH-PER-09 | **yes** | Dev/Test port **yes** | PASS | **CLOSED** | **EVIDENCE NOT FOUND** | Object store **C**; mixed kernel files | Port closed; callers mixed |
| NB3 `/ready` | TECH-OBS-02 Dev honesty | **yes** | Dev contract **yes** | PASS | **CLOSED** | **EVIDENCE NOT FOUND** | Lives in mixed `server.ts`; Production `/ready` F/B5 | Probe closed; file protected |
| NB4 CRM TX | TECH-PER-02 remaining module | **yes** | Mutation TX **yes** | Mock PASS; live PG **not** proven | **CLOSED** for authorized path | **EVIDENCE NOT FOUND** | F1 isolation; I4 `void persistOutboxInsert` **OUT OF SCOPE**; mixed CRM | Slice closed; overlay mixed |
| NB5 dump/restore | TECH-REC-01 | Harness **yes**; drill **if** tools exist | Harness **yes**; drill **no** | Blocked PASS | **BLOCKED** | **EVIDENCE NOT FOUND** | PATH tools; disposable DB ≠ `eos_gateb`; **do not provision** | **Must remain parked** as incomplete recovery |
| MFA / Helmet / NATS / SoR expansion / Production `/ready` | B2–B6 / B4 / B5 | Umbrella **NOT GRANTED** | **Not implemented** (by design) | N/A | Open | N/A | Human/provider/Production | Remain **out**; not this assessment’s increment |

Umbrella Class B: **PREPARED — NOT GRANTED**. Narrow grant: **AUTHORIZED — DEV/TEST ONLY** for NB1–NB5 only. **Not** E1-D overall closure.

---

## 7. NB1–NB5 reconciliation

| Item | Implementation | Tests | Reconciliation | UAT | Closure | Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| **NB1** | Inventory markdown + `E1D_CLASS_B_SOR_INVENTORY` data constant | Inventory assertions in Class B set | **CLOSED** as inventory | **EVIDENCE NOT FOUND** | Closed **as inventory only** | SoR expansion **not** this item; commit mixed |
| **NB2** | Kernel `delete` + LocalFs + compensateBytes / supplier orphan cleanup | put/get/delete tests PASS | **CLOSED** for Dev/Test port | **EVIDENCE NOT FOUND** | Closed for authorized port | Production adapter **C**; mixed `ports.ts` / commercial callers |
| **NB3** | `/ready` probes `dbHealth` or `dbPool`; memory-ok only if neither; 503 on failed probe; `productionReady: false` | Ready tests PASS | **CLOSED** for Dev contract | **EVIDENCE NOT FOUND** | Closed for Dev `/ready` | Implementation sits in **protected mixed** `server.ts` |
| **NB4** | `commitCrmWithOutbox` awaits `runDurableTx` + same-TX outbox | Mock pool PASS | **CLOSED** for mutation TX | **EVIDENCE NOT FOUND** | Closed for authorized path | Live PG **not** proven; F1 files not used; CRM overlay mixed |
| **NB5** | Harness refuses `eos_gateb`; would `CREATE DATABASE` `eos_e1d_b5_*` | Blocked-path PASS (~ms) | **BLOCKED** | **EVIDENCE NOT FOUND** | **Not closed** | **`HARNESS EXISTS ≠ DRILL COMPLETED`**. Exact: **`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`** because `pg_dump`/`pg_restore` **not on PATH**. Drill **not run**. This assessment **did not** run the drill or modify the harness. |

---

## 8. F1 analysis

### 1. Exact origin

`eos_gateb` at `127.0.0.1:5434` has relation `tenants` and `schema_migrations` with **0** rows. `schema.sql` `CREATE TABLE tenants` has no `IF NOT EXISTS`. Six `*.integration.test.ts` files call `migrate()` when `EOS_RUN_PG_TESTS=1` and `EOS_DATABASE_URL` is set → PostgreSQL **`42P07` relation "tenants" already exists**. Standing full-suite result: **21 FAIL**. Gate B migration-free persist tests on the **same** URL **PASS**.

### 2. Pre-existing vs E1-D

Class A audit: **F1 — PRE-EXISTING TEST ENVIRONMENT DEFECT**. Class A does not call `migrate()`. Class B proofs use mock pool / LocalFs / inject / blocked dump path. **Not introduced by E1-D Class A/B.** **Not F3.** Residual latent parallel-`migrate()` isolation = **F2**, not the observed cause.

### 3. Functionality

**No evidence** that F1 breaks Class A HTTP/token/LocalFs behavior or Class B mock/LocalFs/`/ready`/blocked-harness behavior. It **does** prevent migrate()-based PG integration tests from applying schema on `eos_gateb`.

### 4. Test validity

Focused Class A (11) and Class B (10) sets **do not depend** on those six files. Full suite **must not** be claimed green. Using F1 files as NB4 live-PG proof is **forbidden** by the Class B plan.

### 5. UAT

**Not established** as a UAT blocker or waive. No E1-D UAT grant exists. **`F1 = OWNER/GOVERNANCE DECISION REQUIRED`** for any UAT that would use migrate()-based PG tests or `eos_gateb`.

### 6. Governance closure

F1 is **listed as remaining** in the Class B reconciliation residual matrix. E1-D closure records **do not** treat F1 as the sole remaining closer. Class C–F would still remain even if F1 were isolated.

### 7. Commit authorization

GPTA-H-02: **`F1 COMMIT IMPACT = OWNER/GOVERNANCE DECISION REQUIRED`**. Audits **do not authorize commit**. F1 is **neither** an automatic commit block **nor** an automatic allow.

### 8. Remediation required?

Records: **NONE** in Class A/B stages. Correct future work: isolate migrate()-based tests from Gate B already-provisioned schema. **Must not** DROP `eos_gateb`. **Must not** patch `schema.sql` solely to green the suite. **Must not** migrate `eos_gateb` as F1 repair. Isolation would need a **separate authorization**. `NEXT_INCREMENT=NONE_AUTHORIZED`.

### 9. Explicit Owner exception?

**Possible as an Owner decision**, not as an inference. Class A is already **complete-with-test-environment-exception** as a **slice status**, which is **not** a commit or E1-D-close waive.

### 10. Acceptance mechanism

**No named instrument** (form, SHA-bound F1-accept ADR, or Owner signature block) was found that, if signed, would close F1 or authorize commit. The mechanism in force is: **document F1; do not fix in these stages; Owner/governance decides later**.

**`F1 = OWNER/GOVERNANCE DECISION REQUIRED`**

This assessment does **not** waive F1, remediate F1, or declare F1 harmless.

---

## 9. UAT analysis

Separate states (none implies the next):

| State | E1-D evidence |
| --- | --- |
| IMPLEMENTATION COMPLETE | Class A: complete-with-exception. NB1–NB4: authorized slice complete. NB5: **not**. E1-D programme: **not**. |
| TESTS PASS | Focused Class A **11/11**; Class B focused **10/10** (NB5 via blocked branch); combined recorded **55 PASS**. Full suite **not** PASS. |
| AUDIT COMPLETE | Class A audit **PASS WITH TEST-ENVIRONMENT EXCEPTION**. Narrow Class B audit **PASS** (NB5 blocked as designed). |
| RECONCILIATION COMPLETE | Class B slice **PARTIAL** (NB5 blocked). E1-D **NOT CLOSED**. |
| UAT COMPLETE | **EVIDENCE NOT FOUND** |
| GOVERNANCE CLOSED | **NO** — E1-D **NOT CLOSED** |
| COMMIT AUTHORIZED | **NO** |
| PUSH AUTHORIZED | **NO** |

**Do E1-D records require UAT before slice implementation closure?** Class A pack and audits: scope is **Dev/Test**, **Not UAT**. Implementation closure of Class A **does not** require UAT. Class B narrow grant: Dev/Test tests, **not** a UAT campaign.

**Do records require UAT before E1-D programme closure or commit?** No E1-D record was found that states “UAT is the next mandatory closer of E1-D.” Programme closure is blocked by **Class C–F**, NB5 drill, human/provider/Production/Gate C — not by a missing UAT script. GPTA-H-02 still recorded commit-package UAT **EVIDENCE NOT FOUND** and **`NOT COMMIT-READY — UAT EVIDENCE REQUIRED`** unless the Owner **explicitly** waives.

**`UAT EVIDENCE REQUIRED`** for any later Owner-required UAT/commit campaign.

**Minimum UAT evidence if later granted (not executed here):** named Dev/Test (not Production) environment; named behaviors (Class A headers/CORS/429; Class B `/ready` 503; DocumentStorage delete; CRM TX if in scope); named actor; dated record; **must not** use Production data/credentials; **must not** treat mixed login/Gate B/E1-C overlays as in-scope unless the UAT grant names them. This assessment **does not** execute UAT or create test data.

---

## 10. Mixed dependency analysis

GPTA-H-02 claim **confirmed**: named helpers/tests cannot form a coherent standalone **commit** because required callers are mixed/protected.

| Candidate artifact | Caller / dependent | Relationship | Kind | E1-D? | Protected/unrelated? | Safe without it? | Incoherent if separated? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `devtest-http-controls.ts` | `server.ts` | hooks/limiter/CORS/headers | runtime + compile | Class A wiring | **Yes** — also login + Gate B | Module yes; **running API no** | **Yes** |
| `devtest-token-secret.ts` | `main.ts`, `server.ts` | fail-closed secret | runtime + compile | Class A | **Yes** — mixed | Same | **Yes** |
| same | `identity.ts`, `deployment-config.ts`, `infrastructure-contract.ts`, `transport-init.ts`, `startup-migrations.ts` | `isProductionLikeEnv` | compile | **E1-C / persist overlay using helper** | **Yes** — E1-C / Gate B | Helper can exist; those files are **not** Class A | Bundling them **reopens E1-C/persist** |
| Class A tests | `buildServer` / helpers | test | test-only | Class A | Tests new; `server.ts` mixed | Tests can run in dirty tree | Commit of tests without wiring is incomplete increment |
| `sor-inventory.ts` | Class B tests only | data constant | test-only | NB1 | Low runtime coupling | **Yes** as docs+constant | Least coupled; still no commit grant |
| Kernel `delete` | `storage.ts`, `service.ts`, `contracts.ts` | port implementers | compile + runtime | NB2 | Mixed with commercial persist overlay | Port without callers is incomplete | **Yes** |
| NB3 `/ready` | `server.ts` | HTTP route | runtime | NB3 | **Protected mixed** | **No** | **Yes** |
| NB4 | `crm/events.ts`, `crm.ts`, `durable.ts`, `pg-repository.ts`, CRM modules | TX persist | runtime + compile | NB4 | **Persistence / Gate B overlay** | Helpers without CRM files don’t deliver NB4 | **Yes** |
| NB5 harness | none required for blocked tests | harness + PATH tools | runtime when drill runs | NB5 | Must not use `eos_gateb` | Harness can sit unused | Completing drill is **environment**, not a file split |
| `package.json` | unspecified 3-line/other diffs | config | configuration | **Not named Class A** (Class A record: **not** changed) | Unresolved provenance | N/A | **OUTSIDE** |
| `ci.yml` | 3-line diff | CI | configuration | **Not named** | Unresolved | N/A | **OUTSIDE** |
| `.env.example` | token note + later overlays | config | configuration | Partially Class A | **SECURITY CLEARANCE REQUIRED** | N/A | **OUTSIDE** |

Do **not** absorb protected work into E1-D to manufacture coherence.

---

## 11. Protected work

Remains **outside** E1-D closure/remediation unless a **future separate** authorization names it. **Not modified** by this assessment.

- `apps/api/src/main.ts` — `OUTSIDE COMMIT — MIXED/UNRESOLVED`  
- `apps/api/src/server.ts`  
- login/preview: `EosSessionProvider.tsx`, `eos-session.ts`, `eos-proxy.ts`, `apps/web/src/app/eos-api/[...path]/route.ts`, `eos-proxy.test.ts`, `scripts/dev-preview.mjs`, `apps/web/next.config.ts`  
- persistence / Gate B overlay (repositories, `durable.ts`, `gate-b-*`, CRM/commercial/costing/rfp/programme/pipeline/`store.ts`/`app.ts`/I4 tests)  
- E1-C portability (`deployment-config.ts`, `infrastructure-contract.ts`, `e1-c-*.test.ts`, NATS/observability overlays)  
- `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`  
- `.env.example`  
- `apps/web/src/lib/eos-session.ts`  
- unresolved mixed callers (`package.json`, `ci.yml`, `ports.ts` as mixed, `performance-baseline.md`)

---

## 12. Security considerations

| File | Effect on E1-D closure / commit |
| --- | --- |
| `.env.example` | Named in Class A hygiene; later overlaid. **`SECURITY CLEARANCE REQUIRED`**. Blocks inclusion in any candidate commit until clearance. Does **not** by itself close or un-close Class A implementation. |
| `apps/web/src/lib/eos-session.ts` | Login/preview — **not** an E1-D increment file. **`SECURITY CLEARANCE REQUIRED`**. Must remain outside E1-D closure scope. |

No values printed. No rotation. No file changes.

---

## 13. Closure prerequisites

**E1-D programme closure** (from Class A audit + Class B reconciliation §14) would require, at minimum, **all** of the following — **none** of which this assessment grants:

1. Remaining **Class B** items the Owner actually wants (MFA, NATS, SoR expansion, Production `/ready`) — umbrella **NOT GRANTED**; several are human/provider/Production.  
2. **NB5 drill complete** under existing grant **only if** dump tools and a disposable DB already exist — currently **BLOCKED**.  
3. **Class C** (object store, KMS, WAF, backup product, SIEM, email, hosted IdP, DR region, SLA, …) — **provider evidence**; E1-B **0 transmissions / PAUSED**.  
4. **Class D** (IdP, BCM sequence, ops RACI, MFA policy, PITR adopt, IR owner) — **human** records.  
5. **Class E** Gate C remainder / new SQL — **NOT AUTHORIZED**.  
6. **Class F** Production SoR, TLS, deploy, measured RTO/RPO — Production **NOT AUTHORIZED**; architecture **UNSELECTED**.  
7. ADR-0006 / DP-0006 **OPEN**; E1 **NOT APPROVED / BLOCKED**.  
8. F1 isolation **or** Owner exception — **`F1 = OWNER/GOVERNANCE DECISION REQUIRED`**.  
9. UAT if the Owner requires it — **`UAT EVIDENCE REQUIRED`**.  
10. Mixed-tree commit policy — GPTA-H-02 **no valid commit scope**.  
11. Separate **commit** then **push** grants.

Class A slice completion **does not** satisfy (1)–(11).

---

## 14. Bounded remediation analysis

**Test:** can a genuinely bounded increment be defined that would allow E1-D **closure** (or a named sub-closure that is currently blocked only by a small action)?

| Candidate | Purpose | Exact files | Behavior | Tests | UAT | Acceptance | Auth required | Exclusions | Bounded? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Split `main.ts`/`server.ts` | Isolate Class A lines | Those files | Line-level extract | Re-run Class A 11 | Unclear | Clean Class A commit | Would be new implementation + review | Must not touch Gate B/login | **No** — GPTA-H-02 / this task **forbid splitting**; mixed classification unresolved |
| F1 isolation | Green migrate() tests | Six `*.integration.test.ts` and/or dedicated empty DB | Stop using `eos_gateb` for `migrate()` | Those six files | Not UAT | Isolation recorded | **New** test-env grant; `NONE_AUTHORIZED` now | No DROP `eos_gateb`; no `schema.sql` green-fix | **Not E1-D closure**; Class C–F remain |
| NB5 drill | Complete recovery proof | Harness already present | `pg_dump`/`pg_restore` of disposable DB ≠ `eos_gateb` | Existing dump/restore tests live path | Not Production RTO | Restored-row verification | **Existing** narrow grant **if tools already exist** | **Do not install tools / provision hosts** | **Not available in this environment**; manufacturing tools **violates** grant |
| Class A UAT only | Human exercise of headers/CORS/429 | Running API via mixed `server.ts` | Browser/HTTP checks | Not a substitute for UAT record | **Would be the UAT** | Dated UAT record | **New UAT grant** | Production; login/preview unless named | **Not bounded** — exercises **mixed** runtime |
| Commit SET A helpers only | Persist tests/helpers | GPTA-H-02 SET A | No wiring | Existing tests | No | Commit | GPTA-H-02 OPTION A — **empty include list** | Callers outside | **Incoherent** (already established) |

**Result:** **`NO BOUNDED REMEDIATION SCOPE ESTABLISHED`**

A future Owner **may** still authorize a **new named** slice; this assessment **must not** manufacture that increment.

---

## 15. Formal parking analysis

| Question | Fact |
| --- | --- |
| What remains incomplete? | NB5 drill; Class B umbrella items; Class C–F; F1 isolation; UAT; commit/push; mixed-file policy |
| Why blocked? | Environment (no dump tools; must not provision); paused E1-B (provider Class C); human Class D; Gate C E **NOT AUTHORIZED**; Production F **NOT AUTHORIZED**; `NEXT_INCREMENT=NONE_AUTHORIZED`; mixed protected callers; GPTA-H-02 no commit scope |
| Evidence/dependency to reopen? | Explicit Owner grant naming: increment ID, exact files, environment, tests, UAT yes/no, F1 handling, exclusions. For NB5 drill only: dump tools + disposable DB **already** present (existing grant). Must **not** reopen E1-C/E1-B/Path B/Production by implication |
| What remains preserved? | Entire dirty tree including Class A helpers/tests, NB1–NB5 artefacts, mixed callers, login, E1-C, Gate B overlay, SQL 123, governance docs |
| What must **not** be touched? | All protected work in §11; no DROP `eos_gateb`; no revert/stash/clean of Class A/B |
| Can it safely remain parked? | **Yes.** Records already say leave working tree unchanged; implementation ≠ commit; parking ≠ abandonment |

Parking **does not** delete or revert the work.

---

## 16. Decision matrix

**None selected.**

| Outcome | Factual basis | Prerequisites | Consequences | Unresolved questions |
| --- | --- | --- | --- | --- |
| **A — CLOSURE READY** | Class A slice **is** complete-with-exception; NB1–NB4 **are** closed for the authorized slice. **E1-D programme is not.** Audits **forbid** treating audit as UAT/commit/Production. | Would require treating slice-complete as programme-closed — **contradicts** written records | If chosen contrary to records, would **mis-state** E1-D | None that make A factually available for **E1-D** |
| **B — BOUNDED REMEDIATION / UAT** | Remaining **actions exist** (NB5 if tools appear; F1 isolation; optional UAT; mixed-file review) | A **named** bounded increment this assessment **could not** establish without reopening protected/paused work | Would still leave Class C–F open; would need **new** auth (`NONE_AUTHORIZED` today) | Exact files, UAT necessity, F1, whether tools may ever be installed (currently **no**) |
| **C — FORMALLY PARK / DEFER** | No coherent commit; no bounded E1-D-closing increment; NB5 blocked without provisioning; C–F depend on paused/unapproved tracks; dirty tree already holds the work | Owner records park; **no** delete/revert; reopen rule | Work remains uncommitted; E1-D stays **NOT CLOSED**; other GPTA/E1 tracks unchanged | When/whether Owner later names a reopen grant |

---

## 17. Required Owner decisions

Unselected. The Owner must decide:

1. **Park / defer** E1-D dirty implementation (Outcome C), **or** later name a **new** grant (not manufactured here).  
2. Whether **F1** is accepted, deferred, or separately remediable — **`F1 = OWNER/GOVERNANCE DECISION REQUIRED`**.  
3. Whether **UAT** is required before any future commit — **`UAT EVIDENCE REQUIRED`** if yes; waive only by **explicit** Owner record.  
4. GPTA-H-02 OPTIONS A–D remain **unselected**; this assessment **does not** grant commit/push.  
5. **Do not** treat parking as Path B reopen, E1-C resume, RFI send, Stage 1, or Production.

---

## 18. Dependencies

| Dependency | Status | Effect |
| --- | --- | --- |
| GPTA-H-02 | **NO VALID COMMIT SCOPE** | Commit not available as E1-D closer |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** | No new implementation/F1 isolation increment |
| Narrow NB5 grant | Live; drill **environment-blocked** | Cannot finish recovery without existing tools |
| Umbrella Class B | **NOT GRANTED** | MFA/NATS/expansion/Production `/ready` out |
| E1-B | **PAUSED**, 0 transmissions | Class C provider items blocked |
| E1-C | **CONTROLLED PAUSE** | Must not absorb portability files into E1-D |
| GPTA-H-01 | **PATH B ON HOLD** | Unrelated; do not reopen |
| NA-A-22 | **OPEN** | Independent validation; not an E1-D closer |
| Gate C remainder / SQL 123 | **NOT AUTHORIZED** | Class E blocked |
| Production / Stage 1 / CAP-GATE-01 | **NOT AUTHORIZED / NOT COMPLETE** | Class F blocked |
| ADR-0006 / DP-0006 | **OPEN** | Architecture/deploy not approved |
| F1 | **SEPARATE** | Owner decision |
| Security clearance | **REQUIRED** for `.env.example` / `eos-session.ts` | Blocks those files from any commit |

---

## 19. Explicit exclusions

This assessment **did not** and **must not**:

- Implement or remediate application code, tests, SQL, migrations, infrastructure, configuration, CI, or package files  
- Run NB5 drill, F1 isolation, or UAT  
- DROP or migrate `eos_gateb`  
- Stage, commit, push, clean, reset, stash, rebase, or amend  
- Create NA-A-23  
- Grant implementation, commit, or push  
- Change E1-C, GPTA-H-01, Stage 1, Production, procurement, facility, NA-A-22  
- Reopen E1-B RFI, CD successor/C11+, SEO, website, LinkedIn, paid media  
- Absorb protected work into E1-D  
- Rank or select Owner outcomes A/B/C  

---

## 20. Final status

E1-D Class A/B **slices** are recorded as implemented/audited to the limits of their grants. **E1-D is NOT CLOSED.** Commit remains **NOT GRANTED**. A bounded remediation that would close E1-D **was not established**. Formal parking/deferment is **viable** and does **not** abandon the preserved dirty tree.

Owner Outcomes A/B/C remain **unselected**.

`GPTA-H-03 STATUS = FORMAL PARKING/DEFERMENT DECISION REQUIRED`
