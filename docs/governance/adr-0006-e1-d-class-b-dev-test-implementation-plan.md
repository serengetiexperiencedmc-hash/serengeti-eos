# E1-D — Class B Dev/Test Implementation Plan

> **`PLAN ONLY — NOT IMPLEMENTED`**  
> **`NOT AUTHORIZATION`**  
> **Parent request:** [`adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md`](adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md) remains **`PREPARED — NOT GRANTED`**.  
> **Do not execute this plan until that request is granted for the named items.**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Class A:** complete with test-environment exception; **do not reopen**.

---

## 1. Implementation order (after a future grant)

Only section D of the authorization request.

| Step | Item | Why this order |
| --- | --- | --- |
| 1 | SoR inventory (tests/docs, no behavior change) | Informs CRM TX and dump/restore probes; zero runtime risk |
| 2 | Kernel `DocumentStorage.delete` | Narrow port; LocalFs already has `delete`; compensation already used via cast |
| 3 | `/ready` Dev/Test honesty | Narrow HTTP contract; independent of persist TX |
| 4 | CRM same-TX outbox | Uses existing `runDurableTx`; does not require kernel `delete` |
| 5 | Disposable pg_dump/restore harness | Last: needs explicit disposable-DB discipline and F1 isolation |

Steps 2 and 3 may proceed in parallel after step 1. Step 4 is independent of 2–3. Step 5 must not run against `eos_gateb` as a DROP/rebuild target.

**Not in this order:** MFA, Helmet, NATS, SoR expansion, Production `/ready`, F1 table drops.

---

## 2. Prerequisites

- Class A remains as audited (`PASS WITH TEST-ENVIRONMENT EXCEPTION`).  
- Human grant of the authorization request section D.  
- Disposable Dev/Test PostgreSQL **distinct from Production**. Gate-B `eos_gateb` may be **read** for dump **source** only if restore target is a **new** disposable database.  
- No new migration files. No Migration 123 re-execution.  
- F1 remains open: do not use `src/pg*.integration.test.ts` / `crm.integration.test.ts` live `migrate()` tests as the proof suite.  
- CD-01 remains OPEN: dump/restore must not claim BCM sequence closure.  
- `productionReady` stays `false`.

---

## 3. Affected files/modules (expected)

| Step | Likely files (plan, not a license to exceed grant) |
| --- | --- |
| 1 | New test file under `apps/api/src/` (e.g. SoR map assertions). Optional governance inventory note **only if** a later grant names a doc. Prefer tests over new ADRs |
| 2 | `packages/kernel/src/commercial-document.ts`; `apps/api/src/commercial-documents/service.ts`; `apps/api/src/supplier/contracts.ts`; existing LocalFs + `e1-d-class-a.localfs-recovery.test.ts` / Gate B persist compensation tests |
| 3 | `apps/api/src/server.ts` `/ready` handler; new or extended API test; **do not** change `/health` liveness |
| 4 | `apps/api/src/crm/events.ts`; `apps/api/src/persistence/crm.ts` (client-capable upserts); `apps/api/src/persistence/outbox.ts` / `durable.ts` reuse; tests for TS-I-05 |
| 5 | `apps/api/src/persistence/gate-b-recovery-harness.ts` **extension** (dump/restore helpers) + tests using child_process `pg_dump`/`pg_restore` **or** documented operator steps with automated **read** probes after restore. Must **not** import `migrate()` |

`apps/api/package.json`: **no Helmet**, no NATS server install, no MFA library in this plan.

---

## 4. Test sequence

After each step, run **before** starting the next:

1. Step-local new tests.  
2. Class A focused: `npx vitest run src/e1-d-class-a.*.test.ts` — expect 11/11.  
3. Targeted: `src/security.regression.test.ts src/gate-b.fail-closed.test.ts src/cd-phase1-foundation.test.ts src/api.test.ts` — expect 31/31.  
4. If PG available: `src/gate-b.persistence.integration.test.ts` (migration-free) — must still pass.  
5. `npx tsc -p tsconfig.json --noEmit`.

**Do not** treat `npx vitest run` (full suite) as PASS while F1 remains. Record 600/21 if re-run.

Strategy IDs: TS-P-02, TS-F-02, TS-A-02, TS-I-05, TS-R-01, TS-G-01. MFA TS-S-02 **not run as this plan**.

---

## 5. Rollback sequence

Reverse order: remove dump/restore harness → revert CRM TX to `void persist*` → restore `/ready` memory-ok when `dbHealth` omitted → revert kernel `delete` → remove SoR inventory tests.

No down-migration. **Do not** DROP Gate-B tables as rollback.

---

## 6. Migration boundaries

**None in this plan.** Stop if a step appears to need new SQL (TOTP table, new SoR tables, tracker backfill). That is a different authorization (Class E / Gate C).

---

## 7. Provider boundaries

**None.** Do not add `EOS_NATS_URL` as a required Dev default. Do not select object storage. Do not select IdP.

---

## 8. Human decisions (this plan does not make)

MFA policy; HUM-05 IdP; CD-01; ADR-0006/DP-0006; Helmet-vs-manual; NATS product.

---

## 9. Expected evidence (after future implementation)

- Implementation record analogue to Class A: files, commands, pass/fail, no fabricated timings.  
- Kernel type includes `delete`; compensation tests PASS.  
- `/ready` 503 when `dbPool` set and DB down; memory-ok when no pool; `productionReady: false`.  
- CRM TX test: forced outbox failure rolls back CRM row **and** outbox in PG (or memory snapshot when no pool).  
- Dump/restore: restored disposable DB serves opportunity read via new process; labelled Dev/Test; no RTO/RPO claim.  
- Full suite still **not** claimed green.

---

## 10. Stop conditions

Stop implementation and return to governance if any of:

- Grant not in force, or grant text narrower than this plan.  
- New migration file or `schema.sql` edit proposed.  
- DROP/TRUNCATE of `eos_gateb` proposed to “fix” F1.  
- Helmet/MFA/NATS/SoR expansion/Production `/ready` pulled in.  
- Class A headers/CORS/limiter/token refuse regress.  
- Gate B persist tests fail.  
- Production credentials, data, or provider contact.  
- Claim that E1, ADR-0006, or Gate C remainder is closed.  
- Dump/restore claimed as Production RV-03/RTO.

---

## 11. F1 interaction

F1 remains **separate**. This plan **depends on not using** migrate()-based integration files as the Class B proof. CRM TX and dump/restore proofs must follow GB-14 (already-provisioned schema, no `migrate()`). A dump of `eos_gateb` will copy empty `schema_migrations`; restore verification must **not** call `migrate()`.
