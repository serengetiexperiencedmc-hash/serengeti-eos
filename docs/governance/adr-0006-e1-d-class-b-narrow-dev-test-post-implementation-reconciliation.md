# E1-D — Narrow Class-B Dev/Test Post-Implementation Reconciliation

> **Verdict: `PARTIAL`**  
> **E1-D is NOT CLOSED**  
> **Umbrella Class-B request remains `PREPARED — NOT GRANTED`**  
> **Narrow grant remains `AUTHORIZED — DEV/TEST ONLY` for NB1–NB5**  
> **NOT PRODUCTION** · **NO MIGRATION** · **NO PROVIDER CONTACT** · **NO COMMIT**

**Date:** 2026-09-17.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged).  
**This file does not authorize further implementation.**  
No approver, signature, or corporate instrument is recorded.

---

## 1. Purpose

Independent post-implementation reconciliation of the five authorized B1 Dev/Test items. Confirm what is actually closed, what is blocked, what remains residual, and whether another implementation authorization is required.

This stage does **not** implement code, create/execute migrations, contact providers, or close E1-D.

---

## 2. Authorization basis

| Artefact | Status |
| --- | --- |
| [`adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md`](adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md) | **`AUTHORIZED — DEV/TEST ONLY`** (NB1–NB5 only) |
| [`adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md`](adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md) | **`PREPARED — NOT GRANTED`** (unchanged) |
| Class A | **`PASS WITH TEST-ENVIRONMENT EXCEPTION`** — not reopened |
| F1 | **`PRE-EXISTING / SEPARATE TEST-ENVIRONMENT DEFECT`** — not repaired |

No remaining authorized work exists **inside** NB1–NB4 except documented residuals that do not require a new grant. NB5 **drill** remains executable later **under the existing narrow grant** if a safe disposable PostgreSQL target and `pg_dump`/`pg_restore` already exist. This reconciliation **does not** install tooling or provision infrastructure.

---

## 3. Five-item status table

| ID | Item | Classification | Implemented correctly? | Tests/evidence | Within authorization? | Unintended runtime expansion? | Residual | Closed? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **NB1** | SoR inventory | **`CLOSED`** | Yes — markdown + `E1D_CLASS_B_SOR_INVENTORY` data constant | Inventory tests assert `kind === "inventory"`, `notExpansion`, `productionReady: false` | Yes | **No** — constant is not a runtime SoR switch; imported only by tests | Inventory is **not** SoR expansion authorization. Hotel refs are grouped under supplier. Notifications/AI/etc. listed as process-local | **CLOSED** as inventory |
| **NB2** | Kernel `DocumentStorage.delete` | **`CLOSED`** | Yes — kernel port `put/get/delete`; sole adapter `LocalFsDocumentStorage`; `compensateBytes` and supplier orphan cleanup call `storage.delete` without LocalFs-only casts | put/get/delete/get-after-delete; missing get → `null`; second delete is no-op | Yes | **No** object store; no metadata TX redesign | Bytes vs metadata remain separately compensated (pre-existing model). Production object-store adapter **unselected** (TECH-PER-03 **C**). Gate C item 7 as Production remainder remains **OPEN** | **CLOSED** for authorized Dev/Test port |
| **NB3** | Dev/Test `/ready` honesty | **`CLOSED`** | Yes — `dbHealth` if provided; else `checkDatabaseHealth(store.dbPool)`; else `{ ok: true, mode: "memory" }`; failed probe → **503** `not_ready`; `productionReady: false` | Memory 200; healthy `dbHealth` 200; failed `dbPool` 503; `productionReady` false in all three | Yes | **No** Production `/ready` topology | `applicationReady` follows DB only; `eventInfrastructureReady` is reported but does **not** fail HTTP. `/health` remains liveness-ok. Production-aware `/ready` is **B5 / OUT OF SCOPE** | **CLOSED** for authorized Dev/Test contract |
| **NB4** | CRM same-TX outbox | **`CLOSED`** | Yes — `commitCrmWithOutbox` awaits `runDurableTx` → `persistCrmEntityAfterCommit(client)` + `insertOutboxEventOn(client)`. CRM mutation callers `await`. No `void persistOutboxInsert` on the CRM mutation path. CRM **reads** remain Store SoR | Mock pool: BEGIN+COMMIT+entity INSERT+outbox INSERT on success; ROLLBACK + memory restore on outbox fail; no SQL when mutate throws | Yes — Queryable upserts are the minimum client-capable change, **not** CRM PG SoR promotion | **No** new schema | Residuals **inside CRM but outside mutation TX:** `emitCrmEvent` awaits `persistOutboxInsert` after memory push (not fire-and-forget; not jointly transactional because it has no mutation). Generic I4 `commitWithOutbox` still `void persistOutboxInsert` — **OUT OF SCOPE**. Live PostgreSQL atomicity **not** proven (mock pool; F1 files not used) | **CLOSED** for authorized mutation+outbox TX |
| **NB5** | Disposable PG dump/restore | **`BLOCKED`** | Harness exists and **refuses** `eos_gateb` as disposable target. Drill **not executed** | Name-refusal test PASS. Drill test records blocked reason (~10 ms) | Harness in scope. Live drill **environment-blocked** | **No** DROP/migrate of `eos_gateb` | Exact reason: **`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`** (`pg_dump`/`pg_restore` not on PATH). Harness **would** `migrate()` only a newly created empty disposable DB — **not run**. Plan said recovery proof must not use `migrate()`; that design residual is moot while blocked | **BLOCKED** — do not claim dump/restore success |

Overall slice: **`PARTIAL`**. Four of five items **CLOSED**. Recovery drill **BLOCKED**. E1-D overall **NOT CLOSED**.

---

## 4. Evidence reviewed

Source (not assumed from prior records):

- `packages/kernel/src/commercial-document.ts` — `DocumentStorage.delete`
- `apps/api/src/commercial-documents/storage.ts` — LocalFs `unlink`; missing object swallowed
- `apps/api/src/commercial-documents/service.ts` — `compensateBytes` → `storage.delete`
- `apps/api/src/supplier/contracts.ts` — orphan byte cleanup via port `delete`
- `apps/api/src/server.ts` — `/ready` probe order
- `apps/api/src/crm/events.ts` — `commitCrmWithOutbox` / `emitCrmEvent`
- `apps/api/src/persistence/crm.ts` — `persistCrmEntityAfterCommit` on `Queryable`; **no** try/catch swallow
- `apps/api/src/persistence/durable.ts` — `runDurableTx` / `withTransaction`
- `apps/api/src/persistence/pg-repository.ts` — `insertOutboxEventOn`
- `apps/api/src/persistence/sor-inventory.ts` — inventory constant only
- `apps/api/src/persistence/disposable-pg-recovery.ts` — Gate-B name refusal; PATH check; CREATE DATABASE of `eos_e1d_b5_*`
- `apps/api/src/outbox.ts` — remaining `void persistOutboxInsert` on **non-CRM** `commitWithOutbox`
- `packages/db/src/index.ts` — `migrate()` / `checkDatabaseHealth`; `schema.sql` `CREATE TABLE tenants` without `IF NOT EXISTS`
- Six `*.integration.test.ts` files still calling `migrate()`
- Class-B tests: `e1-d-class-b.*.test.ts`
- Governance: narrow authorization, implementation record, prior audit, classification, Class-B plan/request, Class-A F1 audit
- `apps/api/package.json` — no Helmet/MFA libraries; pre-existing `nats` dependency **unchanged by this slice**

---

## 5. Test evidence

cwd `apps/api`. Re-run 2026-09-17 this reconciliation. Full suite **not** re-run.

| Command | Result |
| --- | --- |
| `npx tsc -p tsconfig.json --noEmit` | **PASS** (`TSC_EXIT:0`) |
| Explicit 13-file vitest (Class B + Class A + `c1.11.atomicity` + targeted regression) | **13 files, 55 passed** |
| Class A focused (4 files) | **11/11 PASS** |
| Class B focused (4 files) | **10/10 PASS** (dump/restore tests pass via **blocked** branch) |
| Targeted: `security.regression`, `gate-b.fail-closed`, `cd-phase1-foundation`, `api.test` | **31/31 PASS** |
| `Get-Command pg_dump` / `pg_restore` | **NOT ON PATH** |
| Full `npx vitest run` | **NOT RE-RUN**. Prior **600 passed / 21 failed** stands. **Not claimed green** |

---

## 6. F1 reconciliation

| Check | Finding |
| --- | --- |
| Six files still call `migrate()` | **YES** — `pg.integration.test.ts`, `crm.integration.test.ts`, `pg-crm.integration.test.ts`, `pg-i3.integration.test.ts`, `pg-i4.integration.test.ts`, `pg-supplier.integration.test.ts` |
| Still gated on `EOS_RUN_PG_TESTS=1` && `EOS_DATABASE_URL` | **YES** |
| Class-A F1 SELECT evidence (`eos_gateb` @ `127.0.0.1:5434`; `tenants` exists; `schema_migrations` 0 rows) | **Uncontradicted**; this stage did **not** DROP, reset, or migrate `eos_gateb` |
| `schema.sql` non-idempotent `CREATE TABLE tenants` | **Unchanged** |
| Class A/B causal relationship | **None established.** Class B proofs use mock pool / LocalFs / `/ready` inject / blocked dump path. They do not call `migrate()` against `eos_gateb` |
| Full suite | Prior **21** `42P07` failures remain the standing result |

**Classification:** `PRE-EXISTING / SEPARATE TEST-ENVIRONMENT DEFECT`

**Remediation this stage:** **NONE.** Must **not** DROP `eos_gateb`. Must **not** edit `schema.sql` solely to make these tests pass. Must **not** execute a migration against `eos_gateb`.

---

## 7. Recovery-drill blocker

**`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`**

| Question | Answer |
| --- | --- |
| Disposable DB used? | **NO** |
| `pg_dump` executed? | **NO** |
| Restore executed? | **NO** |
| Restored-row verification? | **NO** |
| `eos_gateb` dropped/reset/migrated? | **NO** |
| Reason | `pg_dump` and `pg_restore` are **not on PATH**. This stage **must not** install PostgreSQL tooling or provision infrastructure to manufacture a PASS |
| RTO/RPO claimed? | **NO** |
| Production backup claimed? | **NO** |

Harness safeguards verified in source: refuses `eos_gateb` as `EOS_E1D_DISPOSABLE_DATABASE_URL`; creates a distinct `eos_e1d_b5_*` name; `productionRtoClaimed: false` on the unused success path.

---

## 8. Migration status

| | |
| --- | --- |
| Migrations created this stage | **NONE** |
| Migrations executed this stage | **NONE** |
| Migration 123 modified/re-executed | **NO** |
| `migrate()` against `eos_gateb` | **NO** |
| Gate C remainder | **NOT AUTHORIZED** |

The unexecuted disposable harness **contains** a `migrate()` call against a **new empty** database name. That path **did not run**. It is **not** a Gate C grant and **not** an F1 repair.

---

## 9. Production boundary confirmation

| | |
| --- | --- |
| Production data accessed | **NO** |
| Production credentials accessed | **NO** |
| Production deployment | **NO** |
| Production infrastructure | **NO** |
| Production `/ready` | **NOT IMPLEMENTED** |
| `productionReady` | remains **`false`** |

---

## 10. Provider-contact boundary confirmation

No provider contacted. No provider selected. E1-B remains **9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD / 0 TRANSMISSIONS**. Frozen questionnaire/PE/template materials **not modified**.

---

## 11. Residual Class-B matrix

Reconciled against [`adr-0006-e1-d-technical-remediation-classification.md`](adr-0006-e1-d-technical-remediation-classification.md) and [`adr-0006-e1-d-class-b-dev-test-implementation-plan.md`](adr-0006-e1-d-class-b-dev-test-implementation-plan.md). Categories are **not collapsed**.

| ID | Item | Current status | Evidence | Next dependency |
| --- | --- | --- | --- | --- |
| TECH-PER-11 / NB1 | SoR **inventory** | **completed** (inventory only) | Inventory doc + constant + tests | SoR **expansion** remains **B6** — **not authorized** |
| TECH-PER-09 / NB2 | Kernel `DocumentStorage.delete` | **completed** (Dev/Test port) | Kernel type; LocalFs; callers; tests | Production object store **provider dependent (C)**; Gate C item 7 remainder **not closed** |
| TECH-OBS-02 / NB3 | Dev/Test `/ready` honesty | **completed** | `/ready` tests 200/503; `productionReady: false` | Production `/ready` **Production-only / B5** — **not authorized** |
| TECH-PER-02 / NB4 | CRM same-TX outbox | **completed** (CRM mutation path) | `runDurableTx` + tests | Generic I4 `void persistOutboxInsert` **OUT OF SCOPE**. CRM PG SoR **B6**. Live PG proof blocked by **F1 isolation** |
| TECH-REC-01 / NB5 | Disposable dump/restore | **environment blocked** | Harness present; `pg_dump`/`pg_restore` absent | Existing NB5 grant can run the drill **if** tooling/target already exist. **Do not provision.** Production recovery **F**. CD-01 **human-decision** |
| TECH-IDN-02 | MFA / TOTP | **eligible but not yet authorized** (B2) | No MFA tables/policy/code in this slice | **Human-decision** (HUM-05/policy) + likely **migration** if TOTP store + Production **C/F** |
| TECH-SEC-06 | Helmet | **eligible but not yet authorized**; classified **unnecessary** after Class A | No `@fastify/helmet`; Class A headers remain | Do **not** implement unless a later grant **names** Helmet |
| TECH-EVT-01 | Local NATS | **eligible but not yet authorized** (B4) | Default still `in-memory-dev`; pre-existing `nats` package unused as a new experiment | **Provider / architecture** (event-product pre-selection). ADR-0006 **OPEN** |
| TECH-PER-11 expansion | SoR expansion | **not authorized** (B6) | CRM/supplier reads still Store | Persist-architecture grant; may be **migration dependent** |
| TECH-OBS-02 Production | Production `/ready` | **Production-only** | Dev contract only | Production probes / topology |
| I4 `commitWithOutbox` fire-and-forget | Additional persistence behavior | **OUT OF SCOPE** of NB4 | `apps/api/src/outbox.ts` L263 `void persistOutboxInsert` | Separate persist authorization if ever in scope |
| F1 | `migrate()` vs `eos_gateb` | **environment blocked** / separate | Six files; empty tracker; `42P07` | Separate test-environment grant. **Not** DROP. **Not** schema.sql patch solely to green the suite |
| Class C (12) | Object store, KMS, WAF, backup product, SIEM, email, hosted IdP, DR region, SLA, … | **provider dependent** | Classification table | Provider evidence / E1-B replies (**0 transmissions**) |
| Class D (6) | IdP choice, BCM sequence, ops RACI, MFA policy, PITR adopt, IR owner | **human-decision dependent** | HUM/CD-01 | Human records — this file does not substitute |
| Class E (4) | Gate C remainder, indexes, cutover, catalogue rows | **migration dependent** | Migration 123 consumed historically; remainder **NOT AUTHORIZED** | Gate C / new SQL grant |
| Class F (8) | Production SoR, Production fail-closed proof, TLS, deploy, measured RTO/RPO, … | **Production-only** | Dual-path Dev remains | Production architecture **UNSELECTED** |

---

## 12. Remaining dependencies

- **Environment:** `pg_dump`/`pg_restore` + a disposable database **other than** `eos_gateb` to finish NB5 **under the existing grant**.
- **Separate authorization required** for: MFA, Helmet (if ever), local NATS, SoR expansion, Production `/ready`, F1 isolation work, any new SQL, Production recovery/RTO/RPO.
- **Human:** CD-01, HUM-05 IdP, DPO **NOT ESTABLISHED**, ADR-0006 / DP-0006 **OPEN**, E1 **NOT APPROVED**.
- **Provider:** E1-B unsent. Architecture **UNSELECTED**.
- **Do not** treat the existing narrow grant as a license for those residuals.

---

## 13. Recommended next governed stage

**Do not automatically issue another implementation authorization.**

1. **No further implementation under NB1–NB4** is required for closure of those four items.  
2. **NB5 drill** may proceed later **without a new authorization** only if a genuinely safe disposable PostgreSQL target and dump tools are **already** available. Do not install tools or provision hosts merely to obtain a PASS.  
3. The next **new** authorization (if a human later wants more Class B) must name remaining candidates explicitly; the umbrella request stays **`PREPARED — NOT GRANTED`** until then.  
4. **F1** is a **separate** test-environment item. Correct future work is isolating migrate()-based tests from Gate B schema — **not** DROP `eos_gateb`.  
5. E1-B, Legal/DPO, CD-01, and Production architecture remain **parallel tracks**. They are **not** advanced by this reconciliation.

---

## 14. Explicit statement that E1-D is NOT CLOSED

**E1-D is NOT CLOSED.**

Class A remains complete-with-exception. This Class-B **narrow** slice is **`PARTIAL`**. MFA, NATS, SoR expansion, Production `/ready`, Production persistence, provider selection, Gate C remainder, F1, and all Class C–F items remain open. ADR-0006 remains **OPEN**. DP-0006 remains **OPEN — NOT APPROVED**. E1 remains **NOT APPROVED / BLOCKED**.
