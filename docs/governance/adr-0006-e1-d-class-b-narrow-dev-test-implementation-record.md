# E1-D — Narrow Class-B Dev/Test Implementation Record

> **`PARTIAL — B1 DEV/TEST SLICE`**  
> **Authorization:** [`adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md`](adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md) **`AUTHORIZED — DEV/TEST ONLY`**  
> **Umbrella Class-B request remains `PREPARED — NOT GRANTED`**  
> **NOT PRODUCTION** · **NO MIGRATION** · **NO PROVIDER**  
> **Class A not reopened** · **F1 not repaired** · **eos_gateb not dropped**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (unchanged; no commit).

---

## Scope

Exactly five authorized items: NB1 SoR inventory; NB2 kernel `DocumentStorage.delete`; NB3 Dev/Test `/ready` honesty; NB4 CRM same-TX outbox; NB5 disposable pg_dump/restore harness.

---

## Authorization

Narrow record status **`AUTHORIZED — DEV/TEST ONLY`**. No fabricated signature.

---

## Implementation

| Item | What changed |
| --- | --- |
| NB1 | `docs/governance/adr-0006-e1-d-class-b-sor-inventory.md`; `apps/api/src/persistence/sor-inventory.ts` (data only) |
| NB2 | Kernel `DocumentStorage.delete`; LocalFs already implemented; `compensateBytes` and supplier contract orphan cleanup use the port |
| NB3 | `/ready` probes `dbHealth` **or** `store.dbPool` via `checkDatabaseHealth`; memory-ok only when neither. `productionReady` remains false |
| NB4 | `commitCrmWithOutbox` / `emitCrmEvent` async; when `dbPool` set, `runDurableTx` persists CRM entity + `insertOutboxEventOn` (no `void persistOutboxInsert` on the mutation path). Callers awaited. CRM **reads remain Store SoR** |
| NB5 | `apps/api/src/persistence/disposable-pg-recovery.ts` — refuses `eos_gateb` as target; may `CREATE DATABASE` a disposable name on the existing local server; `migrate()` **only** on that empty disposable DB; `pg_dump`/`pg_restore` if on PATH |

**Not changed as SoR expansion, MFA, Helmet, NATS, Production `/ready`, Migration 123, `eos_gateb` schema.**

---

## Tests

cwd `apps/api`.

| Command | Result |
| --- | --- |
| `npx tsc -p tsconfig.json --noEmit` | **PASS** |
| `npx vitest run` Class-B + Class-A + `c1.11.atomicity` + targeted regression (see STEP 7 command) | **13 files, 55 passed** |
| Class A focused (included) | **11/11 PASS** |
| Targeted regression security/gate-b.fail-closed/cd-phase1-foundation/api.test | **31/31 included in the 55** |
| Full `npx vitest run` | **NOT RE-RUN**. Prior **600/21 F1** stands. **Not claimed green** |

---

## Recovery

- Disposable DB available as a **new** database name: **not proven** in this environment.  
- `pg_dump` / `pg_restore` on PATH: **not available** (drill returned in ~5ms on the blocked path).  
- Actual pg_dump executed: **NO**.  
- Actual restore executed: **NO**.  
- Verification of restored rows: **NO**.  
- Exact blocked reason: **`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`** (`pg_dump/pg_restore not on PATH`). Harness refuses `eos_gateb`. **No fake success.** **eos_gateb not modified.**

---

## Migration

- Created: **NONE**  
- Executed as this stage (Gate C / new files): **NONE**  
- `migrate()` against `eos_gateb`: **NO**  
- Migration 123: **not modified / not re-executed**  
- Harness **would** call `migrate()` only on a newly created empty disposable DB if dump tools existed; that path **did not run**

---

## Production

- Production data accessed: **NO**  
- Production credentials accessed: **NO**  
- Production deployment: **NO**  
- Production infrastructure: **NO**

---

## Provider

No provider contacted or selected.

---

## Residual

Excluded: MFA/TOTP (B2); Helmet; SoR expansion (B6); local NATS (B4); Production `/ready` (B5). Class C–F unchanged. CD-01 OPEN. DPO NOT ESTABLISHED. E1 NOT APPROVED.

---

## F1

Unchanged: `eos_gateb` has `tenants`; `schema_migrations` empty; `migrate()`-based integration tests still `42P07`. Not a Class-B regression to “fix” by DROP.

---

## Verdict

**`PARTIAL — B1 DEV/TEST SLICE`**

NB1–NB4 implemented and tested. NB5 harness exists and correctly refuses Gate-B; **live dump/restore not executed** because dump tools were unavailable. E1-D overall **not closed**. Full API suite **not** green.
