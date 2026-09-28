# GPTA-H-02 — Owner Commit Scope & Gate Decision Package

> **`GOVERNANCE DECISION PACKAGE — NOT AN AUTHORIZATION`**  
> **`COMMIT AUTHORIZATION: NOT GRANTED`**  
> **`PUSH AUTHORIZATION: NOT GRANTED`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NOTHING STAGED`**  
> **`GPTA-H-01 = CLOSED — PATH B ON HOLD`**  
> **`E1-C = CONTROLLED PAUSE`** · **`NA-A-22 = OPEN`** · **`NA-A-23 IS NOT CREATED`**

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T21:36:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.

This package does **not** authorize commit or push. The Owner must choose OPTION A, B, C, or D below. **No option is selected here.**

---

## 1. Executive decision summary

The dirty tree mixes **multiple workstreams** in shared files. Named E1-D Class A helpers/tests exist and have focused-test evidence, but their **callers** (`main.ts`, `server.ts`, `.env.example`, compose) are **mixed/unresolved** and default **OUTSIDE**. Without those callers, Class A artifacts do not form a coherent increment commit. Class B NB1–NB4 callers are similarly mixed with persistence overlay. NB5 is **harness only; drill BLOCKED**. Login/preview, E1-C portability, Gate B overlay, and SQL 123 are **outside**. Secret-like placeholders exist in files that must stay **outside pending clearance**. Commit-package UAT: **EVIDENCE NOT FOUND**. Class A/B audits **explicitly do not authorize commit/push**.

**`NO COHERENT COMMIT SCOPE ESTABLISHED`**

**Final package state:** `OWNER DECISION PACKAGE READY — NO VALID COMMIT SCOPE ESTABLISHED`

---

## 2. Repository state

| Item | Fact |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | **DIRTY** (~289 porcelain: 79 modified, 210 untracked) |
| Index | **EMPTY** |
| Remote | `origin` → `https://github.com/serengetiexperiencedmc-hash/serengeti-eos.git` |
| Upstream | **None** for `master` |
| Ahead/behind | **NOT ESTABLISHED** |

---

## 3. Current governance state (unchanged)

E1-C **CONTROLLED PAUSE**; NA-A-22 **OPEN**; GPTA-H-01 **CLOSED — PATH B ON HOLD**; `NEXT_INCREMENT=NONE_AUTHORIZED`; E1-B RFI **PAUSED**; Production deploy/migrate **NOT AUTHORIZED**; Production infrastructure **NOT APPROVED**; Procurement **NOT AUTHORIZED**; Stage 1 **NOT APPROVED / NOT COMPLETE**; CAP-GATE-01 **NOT COMPLETE**; commit/push **NOT GRANTED**.

---

## 4. Prior GPTA-H-02 assessment

Authoritative start: [`gpta-h-02-commit-scope-readiness-assessment.md`](gpta-h-02-commit-scope-readiness-assessment.md) (**CONCLUSION B**). This package **does not** grant what that assessment withheld. No factual inconsistency found that would reopen Path B, E1-C, or Production.

---

## 5. SET A — Candidate commit scope (named artifacts only)

These files have **named** E1-D Class A or NB1/test identity. They are **not** “commit-ready.” Remaining blockers apply to **all** rows unless noted: **no GPTA-H-02 grant**; **no commit-package UAT**; **callers mixed/excluded** (coherence failure); F1 does not green the full suite.

| Exact path | Tracked? | Increment | Class | Auth evidence | Completion | Focused tests | UAT | F1 | Gate | Why potentially listed | Remaining blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `apps/api/src/devtest-http-controls.ts` | untracked | E1-D Class A | A helpers | Class A impl record | Impl recorded; commit **not** granted | 11/11 Class A PASS | **EVIDENCE NOT FOUND** | Not a Class A regression | Audit: not commit | Named Class A deliverable | Mixed callers OUTSIDE; UAT; Owner grant |
| `apps/api/src/devtest-token-secret.ts` | untracked | E1-D Class A | A helpers | same | same | same | **EVIDENCE NOT FOUND** | same | same | Named Class A | same |
| `apps/api/src/e1-d-class-a.devtest-http.test.ts` | untracked | E1-D Class A | A tests | same | same | same | **EVIDENCE NOT FOUND** | same | same | Named Class A | same |
| `apps/api/src/e1-d-class-a.localfs-recovery.test.ts` | untracked | E1-D Class A | A tests | same | same | same | **EVIDENCE NOT FOUND** | same | same | Named Class A | same |
| `apps/api/src/e1-d-class-a.observability.test.ts` | untracked | E1-D Class A | A tests | same | same | same | **EVIDENCE NOT FOUND** | same | same | Named Class A | same |
| `apps/api/src/e1-d-class-a.token-bootstrap.test.ts` | untracked | E1-D Class A | A tests | same | same | same | **EVIDENCE NOT FOUND** | same | same | Named Class A | same |
| `apps/api/src/persistence/sor-inventory.ts` | untracked | NB1 | B1 | Narrow Class B auth | NB1 recorded complete | In Class B 55-pass set | **EVIDENCE NOT FOUND** | F1 isolation: not used as proof | Reconciliation PARTIAL | Named NB1 | Callers/docs split; UAT; grant |
| `apps/api/src/e1-d-class-b.crm-same-tx.test.ts` | untracked | NB4 tests | B1 | Narrow auth | NB4 CLOSED for mutation TX | same | **EVIDENCE NOT FOUND** | Mock pool; not F1 files | PARTIAL | Named NB4 tests | Live PG not proven; mixed CRM |
| `apps/api/src/e1-d-class-b.inventory-storage.test.ts` | untracked | NB1/NB2 tests | B1 | Narrow auth | NB1–2 recorded | same | **EVIDENCE NOT FOUND** | — | PARTIAL | Named | Kernel callers mixed |
| `apps/api/src/e1-d-class-b.ready.test.ts` | untracked | NB3 tests | B1 | Narrow auth | NB3 recorded | same | **EVIDENCE NOT FOUND** | — | PARTIAL | Named | `/ready` callers mixed |
| `apps/api/src/e1-d-class-b.pg-dump-restore.test.ts` | untracked | NB5 tests | B1 | Narrow auth | **Blocked-path PASS only** | Blocked branch PASS | **EVIDENCE NOT FOUND** | Must not DROP eos_gateb | Drill **BLOCKED** | Named harness test | **NB5 drill not complete** |
| `apps/api/src/persistence/disposable-pg-recovery.ts` | untracked | NB5 harness | B1 | Narrow auth | Harness only | Blocked ~ms | **EVIDENCE NOT FOUND** | Isolation required | Drill **BLOCKED** | Named NB5 | **Not completed recovery** |
| `docs/governance/adr-0006-e1-d-class-a-dev-test-implementation-record.md` | untracked | Class A docs | C | Implementation record | Record complete | N/A | N/A | Documents F1 | Not commit grant | Records Class A | OPTION C only if enumerated |
| `docs/governance/adr-0006-e1-d-class-a-post-implementation-audit.md` | untracked | Class A docs | C | Audit | Audit complete; **forbids treating as commit** | Re-ran 11/11 | **Does not authorize UAT** | Classifies F1 | Explicit **no commit/push** | Audit evidence | Same |
| `docs/governance/adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md` | untracked | NB grant | C | Auth | Grant exists | N/A | N/A | F1 untouched | Umbrella **not** granted | Auth record | OPTION C |
| `docs/governance/adr-0006-e1-d-class-b-narrow-dev-test-implementation-record.md` | untracked | NB record | C | Impl record | PARTIAL | 55 pass | **EVIDENCE NOT FOUND** | F1 not repaired | NO COMMIT banner | Record | OPTION C |
| `docs/governance/adr-0006-e1-d-class-b-narrow-dev-test-post-implementation-reconciliation.md` | untracked | NB recon | C | Reconciliation | PARTIAL | — | — | F1 separate | NO COMMIT | Record | OPTION C |
| `docs/governance/adr-0006-e1-d-class-b-narrow-dev-test-audit.md` | untracked | NB audit | C | Audit | — | — | — | F1 separate | — | Record | OPTION C |
| `docs/governance/adr-0006-e1-d-class-b-sor-inventory.md` | untracked | NB1 docs | C | NB1 | Inventory doc | — | — | — | — | NB1 artifact | OPTION C / split |

**Do not call SET A commit-ready.**

---

## 6. SET B — Definitely outside the commit

Default: **remain uncommitted** unless a **future separate** authorization names them.

### Protected / mixed / unrelated (exact)

- `apps/api/src/main.ts` — `OUTSIDE COMMIT — MIXED/UNRESOLVED`
- `apps/api/src/server.ts` — mixed Class A + login/Gate B
- `apps/web/src/lib/eos-session.ts` — login/preview; **SECURITY REVIEW REQUIRED — OUTSIDE COMMIT PENDING CLEARANCE**
- `apps/web/src/components/commercial/EosSessionProvider.tsx`
- `apps/web/src/lib/eos-proxy.ts`
- `apps/web/src/app/eos-api/[...path]/route.ts`
- `apps/api/src/eos-proxy.test.ts`
- `scripts/dev-preview.mjs`
- `apps/web/next.config.ts`
- `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`

### Categories (all current dirty files in these groups)

- **Persistence / Gate B overlay:** untracked `apps/api/src/persistence/commercial-*-repository.ts`, `costing-repository.ts`, `durable.ts`, `gate-b-pg-verification.ts`, `gate-b-recovery-harness.ts`, `opportunity-repository.ts`, `programme-repository.ts`, `rfp-repository.ts`, `startup-migrations.ts`; untracked `apps/api/src/gate-b.*.test.ts`; modified CRM modules, commercial-approval/documents, costing, rfp, programme, pipeline, `store.ts`, `pg-repository.ts`, `app.ts`, I4 tests, `pg-*.integration.test.ts`, `packages/db/src/index.ts`.
- **E1-C portability:** `deployment-config.ts`, `infrastructure-contract.ts`, `e1-c-*.test.ts`, `nats-transport.ts`, `transport-init.ts`, `observability.ts`, `ports/identity.ts`.
- **NB5 as completed recovery:** `disposable-pg-recovery.ts` and `e1-d-class-b.pg-dump-restore.test.ts` stay **outside any “complete” implementation commit** (harness ≠ drill). They appear in SET A only as *named* artifacts, not as ready scope.
- **Secret-like pending clearance:** `.env.example` — **SECURITY REVIEW REQUIRED — OUTSIDE COMMIT PENDING CLEARANCE**

Do **not** modify these files.

---

## 7. SET C — Governance decision required (default OUTSIDE)

| Path / set | Why uncertain | Evidence that would resolve | Default |
| --- | --- | --- | --- |
| `apps/api/src/main.ts` | Class A named it; **+110** lines; audit already noted Gate B log overlay | Line-level Owner/review split **not** performed (and **must not** be performed in this task) | **OUTSIDE** |
| `apps/api/src/server.ts` | Class A hooks + login trim + Gate B await | same | **OUTSIDE** |
| `.env.example` | Class A note + later portability; secret-like placeholders | Security clearance + scope review | **OUTSIDE** |
| `infra/compose/dev.yaml` | Class A banner ± later | Diff provenance | **OUTSIDE** |
| `apps/api/package.json` | Class A said **not** changed; now modified | Provenance | **OUTSIDE** |
| `.github/workflows/ci.yml` | 3-line diff; not named Class A/B | Provenance | **OUTSIDE** |
| `packages/kernel/src/ports.ts` | NB2 delete ± other | Line-level scope | **OUTSIDE** |
| `packages/kernel/src/commercial-document.ts` | NB2 caller ± other | same | **OUTSIDE** |
| `apps/api/src/supplier/contracts.ts` | NB2 ± other | same | **OUTSIDE** |
| `apps/api/src/c1.11.atomicity.test.ts` | In Class B 55-pass; also CRM overlay | Scope | **OUTSIDE** |
| CRM/I4/commercial persistence callers (all remaining `M` under `apps/api/src/crm/**`, `outbox.ts`, etc.) | NB4 + dual-path mix | Separate persistence GPTA-H-02 scope | **OUTSIDE** |
| `docs/architecture/c1/performance-baseline.md` | Unrelated/CRLF | Provenance | **OUTSIDE** |
| Remaining untracked `docs/governance/**` except SET A docs **if** Owner later enumerates them | Many workstreams (E1-B paused, E1-C pause, hosting, GPTA HOLD) | Owner OPTION C exact path list | **OUTSIDE** |
| `docs/governance/evidence/` | Unreviewed bundle | Inventory + Owner list | **OUTSIDE** |
| `ai/drafts.ts` | Not named Class A/B | Provenance | **OUTSIDE** |

---

## 8. F1 analysis

**What F1 is:** **PRE-EXISTING TEST ENVIRONMENT DEFECT.** `eos_gateb` has `tenants` and empty `schema_migrations`; `migrate()` hits `42P07` (`relation "tenants" already exists`). Class A audit assigned all **21** full-suite PG integration failures to F1. **Not** a Class A regression. **Must not** DROP `eos_gateb` to green tests.

| Question | Recorded answer |
| --- | --- |
| Does F1 block UAT? | **Not established.** No E1-D UAT grant exists. Audit does **not** authorize UAT. |
| Does F1 block commit? | **Not established as an automatic block or automatic allow.** Audit: **does not authorize commit/push.** F1 is **separate**; future isolation needs **separate authorization**. |
| Does F1 require remediation before any commit? | **Owner/governance decision.** Records say document F1, do not fix in Class A/B stages. |
| Sufficient for Owner consideration? | **Yes, as a known exception to discuss** — not as commit approval. |
| Additional implementation required? | **Not required by this package.** Isolation work is a **separate** grant if ever wanted. |

**`F1 COMMIT IMPACT = OWNER/GOVERNANCE DECISION REQUIRED`**

Do not infer approval. Do not remediate F1 here.

---

## 9. UAT analysis

Separate states: implementation complete ≠ tests passing ≠ audit complete ≠ UAT complete ≠ commit authorized ≠ push authorized.

E1-D Class A audit banner: **does not authorize UAT, Production, or commit/push.**  
No repository record was found that **requires** UAT before commit **for this uncommitted E1-D slice**. Path B DG2 historically committed **before** a later UAT grant — **different increment**, not a standing E1-D rule. CD Phase 1 commit grants were **SHA-specific** and **do not** apply here.

Commit-package UAT: **EVIDENCE NOT FOUND**.

Therefore:

- Implementation/tests/audit **do not** make the slice commit-ready.  
- **`NOT COMMIT-READY — UAT EVIDENCE REQUIRED`** unless the Owner **explicitly** accepts OPTION A/C **without** UAT (OPTION B is “require UAT/F1/governance evidence first”).  
- That acceptance is **not** inferred here.

---

## 10. Class A / Class B reconciliation

| Item | Implementation | Tests | Reconciliation | UAT | Include in commit? | Separate auth? |
| --- | --- | --- | --- | --- | --- | --- |
| Class A `devtest-*` + 4 tests | Recorded complete with F1 exception | 11/11 PASS | Audit PASS WITH TEST-ENVIRONMENT EXCEPTION | **EVIDENCE NOT FOUND** | **No** — incoherent without mixed callers | Commit grant still required |
| Class A `main.ts` / `server.ts` / `.env.example` / compose | Named then **overlaid** | — | Audit already noted mixed Gate B on `main`/`server` | — | **OUTSIDE** | Yes, to include mixed files |
| NB1 `sor-inventory` | Complete (doc+data) | In 55-pass | PARTIAL slice | **EVIDENCE NOT FOUND** | **No** as standalone coherent commit | Commit grant |
| NB2 kernel/callers | Recorded | In 55-pass | PARTIAL | **EVIDENCE NOT FOUND** | Callers **OUTSIDE** (mixed) | Yes |
| NB3 `/ready` | Recorded | In 55-pass | PARTIAL | **EVIDENCE NOT FOUND** | Callers mixed | Yes |
| NB4 CRM TX | CLOSED for mutation path | Mock pool | PARTIAL; live PG not proven | **EVIDENCE NOT FOUND** | CRM files mixed overlay | Yes |
| NB5 | **Harness only; drill BLOCKED** | Blocked-path PASS | Not closed as recovery | **EVIDENCE NOT FOUND** | **Not** as completed work | New drill/tools **not** to be provisioned here |

Umbrella Class B: **PREPARED — NOT GRANTED**. E1-D **NOT CLOSED**.

---

## 11. NB1–NB5 treatment

Preserve: **NB5 = harness only; drill BLOCKED.** Do not treat harness existence as completion. Do not include NB5 as “recovery proven” in any commit narrative.

---

## 12. Security / secret-like material

| File | Classification |
| --- | --- |
| `.env.example` | **SECURITY REVIEW REQUIRED — OUTSIDE COMMIT PENDING CLEARANCE** |
| `apps/web/src/lib/eos-session.ts` | **SECURITY REVIEW REQUIRED — OUTSIDE COMMIT PENDING CLEARANCE** |

No values reproduced. Files **not** altered. Credentials **not** rotated.

---

## 13. Mixed-file treatment

`apps/api/src/main.ts`: Class A referenced it; large overlay; **`OUTSIDE COMMIT — MIXED/UNRESOLVED`**. Not split, edited, reverted, or staged.

Same principle: `server.ts`, `.env.example`, `compose/dev.yaml`, `ports.ts`, CRM/I4 callers → **OUTSIDE**.

---

## 14. Governance-document inclusion analysis

**Inclusion rule (default OUTSIDE):**

1. Do **not** commit all `docs/governance/**` because they are dirty.  
2. Include a governance file **only** if the Owner’s OPTION C (or a later grant) lists **exact paths**.  
3. A file may be listed only if it records an **already-made** decision or assessment and committing it would **not** imply Production, procurement, RFI send, Stage 1 approval, CAP-GATE-01 close, Path B selection, or E1-C resume.  
4. E1-B issuance/transmission packs remain **outside** a default docs commit (paused send; 0 transmissions).  
5. GPTA-H-01 HOLD / trigger / checkpoint / this package are **completed governance records** but still need **OPTION C enumeration** — they are **not** auto-included.  
6. SET A E1-D Class A/B records **explicitly say NO COMMIT** in banners; including them without an Owner commit grant could be misread as authorization. Prefer **outside** until OPTION C names them as **historical evidence only**.

---

## 15. Commit-coherence test

A coherent implementation commit would need one workstream, authorization, completion evidence, compatible gates, no protected files, no unresolved secrets, no Production/SQL leakage, no login/preview.

**Result: `NO COHERENT COMMIT SCOPE ESTABLISHED`**

Reason: SET A helpers/tests cannot ship without mixed callers; mixed callers are SET B/C **OUTSIDE**; combining SET A with persistence/login/E1-C/SQL would mix unrelated dirty work.

A coherent **governance-only** commit is **possible as OPTION C** only if the Owner lists exact paths that do not imply open approvals.

---

## 16. Exact proposed commit boundary

### INCLUDE IF OWNER AUTHORIZES

**Empty.** No file is presently both evidenced and coherent for commit.

(If the Owner later chooses OPTION A after further evidence, they must **enumerate** paths in a **new** grant. SET A is the only named starting list and is **not** included now.)

### EXCLUDE

- All SET B exact paths and categories in §6  
- All SET C rows in §7 (default)  
- SQL `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`  
- Login/preview files in §6  
- Secret-pending files in §12  

### UNRESOLVED / OWNER DECISION REQUIRED

- F1 commit impact  
- Whether UAT is required before any commit  
- OPTION C exact governance path list (if any)  
- Whether mixed files may ever be in-scope (would need a **new** reviewed grant; **not** this package)

---

## 17. Owner decision options

**None selected.**

| Option | Meaning | Factual consequence |
| --- | --- | --- |
| **OPTION A** | Authorize commit of an **explicitly enumerated** validated scope | **Cannot be executed on current evidence** without first producing a coherent enumerated list and accepting/deferring F1/UAT/secrets. Choosing A **now** without that list would still not create a valid scope. |
| **OPTION B** | Require additional UAT / F1 / governance evidence before any commit | Working tree **unchanged**. No commit. Matches `NOT COMMIT-READY — UAT EVIDENCE REQUIRED` unless later waived. |
| **OPTION C** | Authorize **governance-only** commit of **exact paths the Owner lists**; implementation remains outside | Would still require a **follow-on grant naming files**. This package does **not** name that list. Push remains separate. Must not imply Production/RFI/Path B/E1-C. |
| **OPTION D** | Decline/defer commit; leave working tree unchanged | **No commit, no push, no staging.** Dirty Class A/B and all other overlays **preserved**. |

Do not rank. Do not choose.

---

## 18. Push boundary

- `origin` exists.  
- Upstream for `master` is **absent**.  
- Ahead/behind is **not established**.  
- Push authorization is **NOT GRANTED**.  

**`COMMIT AUTHORIZATION AND PUSH AUTHORIZATION REMAIN SEPARATE DECISIONS.`**

Do not configure upstream. Do not push.

---

## 19. Risks and unresolved dependencies

- Accidental commit of mixed `main.ts` / persistence / SQL 123 / login secrets.  
- Misreading F1 as either a hard commit block or a waive.  
- Bundling E1-B packs implying send.  
- Treating NB5 harness as RTO evidence.  
- Using CD Phase 1 historical commit SHA as GPTA-H-02 grant.  
- Pushing `master` with no upstream without a separate push decision.

---

## 20. Final Owner Decision Required

The Owner must choose **OPTION A, B, C, or D**. This package **does not** make that choice. GPTA-H-02 remains **NOT GRANTED**.

---

`OWNER DECISION PACKAGE READY — NO VALID COMMIT SCOPE ESTABLISHED`
