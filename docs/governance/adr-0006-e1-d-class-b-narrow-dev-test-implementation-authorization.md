# E1-D — Narrow Class-B Dev/Test Implementation Authorization

> **`AUTHORIZED — DEV/TEST ONLY`**  
> **`THIS RECORD AUTHORIZES FIVE B1 ITEMS ONLY`**  
> **`NOT PRODUCTION`** · **`NOT MIGRATION`** · **`NOT PROVIDER SELECTION`**  
> **`NOT A HUMAN DECISION SUBSTITUTE`**  
> **Umbrella Class-B request remains `PREPARED — NOT GRANTED`**

**Date:** 2026-09-17.  
**HEAD at authorization:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**No signature, named approver, or corporate instrument is recorded.** This file is the stage grant for the isolated Dev/Test slice named below.

The broader artefact [`adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md`](adr-0006-e1-d-class-b-dev-test-implementation-authorization-request.md) stays **`PREPARED — NOT GRANTED`**.

Class A remains **`PASS WITH TEST-ENVIRONMENT EXCEPTION`**. Do not reopen Class A. Do not “fix” F1 by dropping `eos_gateb`.

---

## Purpose

Authorize isolated Development/Test implementation of **exactly five** B1 items classified in the Class-B preparation, without implementing MFA, Helmet, NATS, SoR expansion, or Production `/ready`.

---

## Five authorized B1 items

| Code | Item | Bound |
| --- | --- | --- |
| **NB1** | SoR inventory | Documentation/tests of **current** SoR. **Not** expansion |
| **NB2** | Kernel `DocumentStorage.delete` | Port + LocalFs/callers/tests. **Not** object-store product |
| **NB3** | Dev/Test `/ready` honesty | Probe when `dbPool` or `dbHealth` present; memory-ok only when neither. `productionReady` remains **false** |
| **NB4** | CRM same-TX outbox | Existing tables; `runDurableTx`; **not** CRM PG SoR promotion |
| **NB5** | Disposable PG dump/restore harness | New disposable DB only. **Never** DROP/migrate/`eos_gateb`. No Production RTO/RPO. If no safe target: **BLOCKED**, do not fake |

---

## Explicit exclusions

MFA/TOTP/MFA tables/policy; Helmet; NATS/JetStream; SoR expansion; new SoR modules; object storage; KMS; secrets platform; WAF/CDN; Production email; hosted IdP; Production `/ready`; Production hosting/deploy/DNS/TLS/DB/recovery/RTO/RPO/PITR/DR/failover; new migrations; migrate execution as a Gate C grant; Migration 123 modification/re-execution; Gate C schema; Production credentials/data; provider contact.

---

## Authorization boundary

- Environment: isolated Dev/Test only.  
- `productionReady` remains `false`.  
- F1 (`eos_gateb` tenants exist, `schema_migrations` empty) remains **untouched**.  
- No human HUM items closed. DPO still **NOT ESTABLISHED**. E1 still **NOT APPROVED**. ADR-0006 / DP-0006 still **OPEN**.

---

## Expected tests

- SoR inventory assertions (current map only).  
- DocumentStorage put/get/delete/get-after-delete.  
- `/ready`: memory-only; healthy DB probe; failed DB → 503; `productionReady: false`.  
- CRM: mutation+outbox success; mutation failure; outbox failure; TX rollback (no partial PG persist).  
- Dump/restore: **only** if a disposable DB exists; otherwise record **BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE**.  
- Class A focused tests + targeted regression + typecheck.  
- Full suite **not** claimed green.

---

## Rollback

Revert kernel `delete`, `/ready` probe, CRM TX await path, inventory tests/docs, dump/restore helpers. **No schema rollback. Do not DROP `eos_gateb`.**

---

## Stop conditions

Stop an item (do not broaden) if it requires: new SQL/migration; provider; human policy/IdP; Production architecture; DROP of `eos_gateb`; Helmet/MFA/NATS/SoR expansion.

---

## Status

**`AUTHORIZED — DEV/TEST ONLY`** for NB1–NB5. Not Production authorization. Not E1-D overall closure.
