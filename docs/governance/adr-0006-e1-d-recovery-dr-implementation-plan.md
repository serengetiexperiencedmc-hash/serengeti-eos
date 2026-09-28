# E1-D — Recovery / DR Implementation Preparation

> **`PREPARATION ONLY — NO PRODUCTION RECOVERY TESTS`**  
> **`NO TECHNICAL RTO/RPO CLAIMED`**  
> **`NO DR PROVIDER/LOCATION SELECTED`**  
> **`CD-01 BCM SEQUENCE REMAINS OPEN`**  
> **`E2 LAB AND GATE B = DEV/TEST ONLY`**  
> **`BUSINESS ZERO-LOSS ≠ TECHNICAL RPO=0`**

**Date:** 2026-09-17.  
**Parent evidence objects:** RV-01–RV-14 in [`adr-0006-e1-c-recovery-validation-plan.md`](adr-0006-e1-c-recovery-validation-plan.md).  
**Harness:** `apps/api/src/persistence/gate-b-recovery-harness.ts` (GB-14).

Business targets (not measurements): critical RTO **≤3 hours**; overall RTO **≤4 hours**.

Until CD-01 is decided, recovery **packaging** must not assume Finance-before-Programme-Building **or** Programme-Building-before-Finance. Commercial remains first in **both** written sequences; tests may use a **Commercial record** as the integrity probe without claiming a full BCM order.

---

| RV | Implementation preparation | Environment | Must not claim |
| --- | --- | --- | --- |
| RV-01 PostgreSQL backup | Dev: optional `pg_dump` of **disposable** Gate-B DB after **separate** TECH-REC-01 authorization. Production: backup **product** (**C**) | Label Dev/Test vs Production | Lab dump = Production backup |
| RV-02 PITR/WAL | Design only until HUM-15 and provider WAL evidence | Labelled | RPO=0 |
| RV-03 Restore | Restore dump to a **clean disposable** instance; GB-14 `newProcessAgainstPool` | Dev/Test | Production restore |
| RV-04 Document recovery | Existing LocalFs tests; Production adapter **C** | Dev/Test | Production object store recovery |
| RV-05 Audit/outbox consistency | After restore, compare audit chain + outbox to committed Commercial writes (Gate B path) | Dev/Test | CRM fire-and-forget is consistent |
| RV-06 Application recovery | API login + read opportunity/RFP from restored PG (not memory) | Dev/Test | Production app recovery |
| RV-07 Dependency recovery | Design only — IdP/DNS/email/object store **unselected** | Production class | Workaround invented |
| RV-08 Measured RTO | Clock Dev restore **labelled Dev/Test**. Production clock **F** | Label | Dev time = Production RTO |
| RV-09 Measured RPO | Count rows lost vs backup/PITR after a **real** test | Label | Business zero-loss = 0 |
| RV-10 Failover | **Not designed as a location.** Wait TECH-DR-01 | Production class | Brochure DR |
| RV-11 Failback | After failover topology exists | Production class | Same |
| RV-12 Backup integrity | Restore probe required (ADR-0011). Evidence-register job-green **insufficient** | Label | Register = PG backup |
| RV-13 Restore integrity | Commercial records + documents + audit checks | Label | Lab markers = EOS Production |
| RV-14 Evidence capture | Timestamp, **role** (not invented person), env label, hashes, pass/fail | All | Invented operator names |

---

## Dev/Test recovery harness (current vs proposed)

**Current (implemented, not a full RV suite):** `attachDurablePool`, `newProcessAgainstPool`. Explicitly does **not** import `migrate()`, take backups, or claim RTO/RPO.

**Proposed (Class B — not authorized by this file):** disposable PG dump/restore drill producing RV-14 artefacts labelled **Dev/Test**.

**Forbidden:** Production tests; creating Production credentials; selecting DR region; closing CD-01; applying **new** migrations inside the harness.
