# E1-C — Implementation & Testing Closure Sprint

> **`PROVIDER-NEUTRAL GAP CLOSURE SPRINT`**  
> **`SEDMC IS NOT PRODUCTION READY`**  
> **`E1 = NOT APPROVED / BLOCKED`**  
> **`GATE C = OPEN / NOT AUTHORIZED FOR PRODUCTION`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TRANSMISSION`**

**Date:** 2026-09-17.  
**Companion (prior sprint):** [`adr-0006-e1-c-provider-neutral-readiness-advancement-record.md`](adr-0006-e1-c-provider-neutral-readiness-advancement-record.md)

---

## 1. Scope

Close or materially advance remaining provider-neutral **IMPLEMENTATION/TESTING** gaps:

- GAP-PER-02 (durable audit + outbox on critical writes)
- GAP-IDN-02 (MFA / Production identity)
- GAP-OBS-02 (audit log durability)
- GAP-DR-02 (failover/failback procedures / recovery harness)

Also inspect GAP-DEP-02, GAP-INF-01, GAP-GOV-05. Do **not** force closure. Do **not** select a provider, geography, or architecture. Do **not** authorize Production, UAT, or migrations. Do **not** send E1-B.

---

## 2. Starting state

| Fact | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` **VERIFIED** |
| Branch | `master` |
| Working tree | Dirty (~243 lines at prior checkpoint); Class A/B diffs **preserved** |
| Gate A / Gate B | **APPROVED** (Gate B Dev/Test) |
| Gate C | **OPEN / NOT AUTHORIZED FOR PRODUCTION** |
| E1 / ADR-0006 / DP-0006 | **NOT APPROVED / OPEN** |
| Technical RTO/RPO | **NOT DEMONSTRATED** |
| DPO | Wensley Shirima **OWNER-DESIGNATED**; appointment evidence **REQUIRED**. Thomas Nguluma = Legal Counsel only |
| E1-B | **9 / 2 / 1** · **0 transmissions** |

---

## 3. Gaps targeted

See §8–§10. Primary targets: GAP-PER-02, GAP-IDN-02, GAP-OBS-02, GAP-DR-02. Inspected without forcing closure: GAP-DEP-02, GAP-INF-01, GAP-GOV-05.

---

## 4. Existing changes preserved

No reset, stash, discard, commit, or push. Prior Class A/B application diffs, Gate B dual-path persistence, previous-sprint outbox await + header echo, and uncommitted governance artefacts remain in the working tree.

---

## 5. Implementation performed

**IMPLEMENTED / DEV-TEST ONLY.**

| Area | Change |
| --- | --- |
| GAP-PER-02 | Generic `commitWithOutbox` now inserts **chained audit + outbox in one `runDurableTx`** when `dbPool` is set. CRM `commitCrmWithOutbox` now persists **entity + chained audit + outbox** in the same transaction. Failures **ROLLBACK** memory and SQL. Generic I4 domain mutate remains process-local (outbox/audit durable; payments Map is not PG SoR). |
| GAP-IDN-02 | `local-password-dev` is **forbidden** when `EOS_ENV` is production/uat or `NODE_ENV` is production. `login()` returns `identity_not_production_ready`; HTTP maps to **503** with `productionReady: false`, `mfaEnabled: false`. API `main.ts` **exits** on that boundary. **MFA is not implemented.** No IdP selected. No credentials invented. |
| GAP-OBS-02 | `/health` and `/ready` advertise `identity.mode=local-password-dev`, `mfaEnabled: false`, `productionIdpSelected: false`. Auth-failure logs no longer include raw email. Durable audit is now in the same TX as outbox on the CRM and generic I4 paths. `productionReady` remains **false**. |
| GAP-DR-02 | Disposable recovery harness: if `pg_dump`/`pg_restore` are absent, a **SQL-logical** dump/restore of a marker tenant is attempted on a **new disposable database** (never `eos_gateb`). Results labelled **DEV/TEST ONLY**; `productionRtoClaimed: false`; `elapsedMs` recorded. Connection timeout 2s. Application-restart harness (`newProcessAgainstPool`) covered by unit test. |
| F1 | `shouldApplyStartupMigrations` **skips** `migrate()` on `eos_gateb` and on Production-like env. Gate C remains OPEN. Tracker on `eos_gateb` was **not** rewritten. `migrate()` was **not** executed against `eos_gateb`. |

---

## 6. Tests performed

**DEV/TEST ONLY.** Full suite / `migrate()` against `eos_gateb` **not executed**.

| Command | Result |
| --- | --- |
| `npx tsc --noEmit -p tsconfig.json` (`apps/api`) | **PASS** |
| Targeted vitest (19 files: closure outbox-audit, identity/F1/restart, closure observability, prior E1-C outbox/headers, Class A token/HTTP/LocalFs/logging, Class B CRM TX / dump / ready / inventory, Gate B fail-closed, I4 outbox/hardening/security, C1.11 atomicity, CRM security) | **81 passed / 0 failed** |
| Full API suite | **NOT RUN** (F1) |
| `EOS_RUN_PG_TESTS=1` Gate B persist integration (`gate-b.persistence.integration.test.ts`, no `migrate()`) | **NOT RUN this sprint** (harness exists; requires already-provisioned Dev/Test URL) |
| Disposable dump/restore actual binary drill | Test **PASS** via blocked-or-verified path; **no Production RTO/RPO** |

---

## 7. Actual evidence

- `e1-c-closure.outbox-audit-tx.test.ts` — BEGIN/COMMIT includes `INSERT INTO audit_events` and `INSERT INTO outbox_events`; ROLLBACK restores audit length.
- `e1-d-class-b.crm-same-tx.test.ts` — CRM TX now also inserts `audit_events`.
- `e1-c-closure.identity-f1-restart.test.ts` — Production-like login refused; startup migrate skipped for `eos_gateb` and Production-like; restart harness empty SoR.
- `e1-c-closure.observability.test.ts` — `/health`/`/ready` identity honesty; no email in auth-failure logs; `persistence_failed` with `productionReady: false`.
- `e1-d-class-b.pg-dump-restore.test.ts` — refuses `eos_gateb`; labels **DEV/TEST ONLY**.

---

## 8. Gaps closed

**None of the four targeted IMPLEMENTATION/TESTING gaps are CLOSED.**  
GAP-REC-03 sequence remains **CLOSED** from the owner decision (prior record). This sprint does not re-close it.

---

## 9. Gaps partially advanced

| GAP ID | Previous | New | Evidence | Remaining limitation |
| --- | --- | --- | --- | --- |
| GAP-PER-02 | IMPLEMENTATION/TESTING | **IMPLEMENTATION/TESTING** | Same-TX audit+outbox for CRM and generic I4 when `dbPool` set | Generic domain mutate still in-memory; Production event transport unselected; not all SoRs in same TX |
| GAP-IDN-02 | IMPLEMENTATION/TESTING | **PROVIDER EVIDENCE** | Local IdP fail-closed in Production-like env; `mfaEnabled: false` advertised | MFA not implemented; Production IdP unselected (ADR-0013 OPEN) |
| GAP-OBS-02 | IMPLEMENTATION/TESTING | **IMPLEMENTATION/TESTING** | Durable audit in TX on CRM/I4 Dev/Test paths; log redaction | Production audit durability/retention/location unproven; no monitoring vendor |
| GAP-DR-02 | IMPLEMENTATION/TESTING | **IMPLEMENTATION/TESTING** | SQL-logical disposable harness + restart unit test | Production failover/failback not documented/tested; GAP-DR-01 site unselected; dump tools may still be absent |

GAP-DEP-02, GAP-INF-01, GAP-GOV-05 remain **CAN PROGRESS NOW** and **not CLOSED** (DP-0006 OPEN; isolated Production does not exist; C/D letters await approval pack).

---

## 10. Gaps still open

All Production-blocking gaps remain open except GAP-REC-03 (sequence only). See live table in the advancement record plus §9 deltas.

---

## 11. Provider-dependent items

Unchanged **OPEN / UNSELECTED**: Production cloud, region, backup/DR geography, architecture, KMS, secrets manager, IdP, CDN/WAF, PITR, TCO, hosting, subprocessors, support geography.

---

## 12. Human-evidence dependencies

Formal DPO appointment evidence **REQUIRED**. PDPC **NOT ESTABLISHED**. Entity extract unverified. Named RFI recipients **NOT ESTABLISHED**. **0 transmissions**. HUM-09 budget not fixed. E1 **NOT APPROVED**.

---

## 13. F1 migration status

**Classification: B (explicit authorization to reconcile `schema_migrations` on `eos_gateb`) + C (Production-gated for remaining Gate C) + A implemented (startup skip).**

Root cause: `migrate()` applies `schema.sql` `CREATE TABLE tenants` without `IF NOT EXISTS`. `eos_gateb` already has `tenants` and an empty tracker. Tests that call `migrate()` against that database fail. Gate B persist tests correctly **do not** call `migrate()`.

This sprint: API startup **does not** `migrate()` `eos_gateb` or Production-like env. **Did not** stamp `schema_migrations` on `eos_gateb`. **Did not** run `migrate()` against Production.

---

## 14. Recovery-harness status

**DEV/TEST ONLY.** SQL-logical fallback implemented when `pg_dump`/`pg_restore` are missing. Never targets `eos_gateb`. Never claims Production RTO/RPO. Application restart against a pool is simulated (`newProcessAgainstPool`). Production failover **NOT TESTED**.

---

## 15. E1-B status

**UNCHANGED.** 9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD. **0 transmissions.** Frozen hashes **VERIFIED UNCHANGED**. Cursor did not send.

---

## 16. Production gate status

Production / UAT / Gate C / deploy / credentials: **NOT AUTHORIZED**. Technical RTO/RPO **NOT DEMONSTRATED**.

---

## 17. Exact next action

**Patrick Makundi** executes the authorized E1-B transmission **outside Cursor** (9 FULL-RFI + 2 SCOPE CLARIFICATION; **no CU-05**). In parallel: collect DPO appointment evidence, PDPC, entity extract. Do not select a provider. Do not authorize Production.

**SEDMC is NOT Production Ready.**
