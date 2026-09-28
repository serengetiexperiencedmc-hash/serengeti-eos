# E1-C — Recovery Validation Plan (preparation)

> **`PLAN ONLY — NO PRODUCTION RECOVERY TESTING`**  
> **`NO RTO/RPO MEASUREMENT CLAIMED`**  
> **`NO DR CLAIMED FROM MARKETING`**  
> **`E2 LAB = DEV/TEST ONLY`**  
> **`BUSINESS ZERO-LOSS ≠ TECHNICAL RPO=0`**

**Date:** 2026-09-17.

This plan defines **evidence that would be required**. It does **not** record that the evidence exists.

Business targets (not technical measurements): critical RTO **≤ 3 hours**; overall RTO **≤ 4 hours**; zero tolerated **business** data loss.

---

## 1. Evidence objects required

| ID | Capability | Required evidence | Allowed environment | Current repository evidence |
| --- | --- | --- | --- | --- |
| RV-01 | PostgreSQL backup | Dated backup artefact + manifest; encryption noted; location disclosed | Dev/Test labelled **Dev/Test**; Production **PRODUCTION ONLY** | ADR-0011 evidence register **not** a real PG copy. E2 lab dump **LAB / DEV/TEST ONLY**. Production: **none** |
| RV-02 | PITR / WAL | WAL archive location independent of primary disk; granularity; restore-to-time proof | Same labelling | E2 lab **PARTIAL**. Production: **none**. Adoption **HUMAN DECISION** |
| RV-03 | Restore | Restore of the same backup to a clean instance; checksum/row proof | Dev/Test or Production as labelled | Lab synthetic tables. **Not** EOS Production Commercial/Programme SoR |
| RV-04 | Document recovery | Metadata in PG + bytes via DocumentStorage round-trip after restore | Labelled | LocalFs Dev; Production adapter unselected |
| RV-05 | Audit / outbox consistency | After restore, audit chain and outbox rows match committed business writes | Labelled | Target architecture; Production **not demonstrated** |
| RV-06 | Application recovery | API serves Commercial-first functions from restored SoR (not process memory) | Labelled | Gate B Dev persist **DEV/TEST ONLY** |
| RV-07 | Dependency recovery | IdP, DNS, object store, email, secrets available or workaround documented | Production class | **UNSELECTED** products |
| RV-08 | Measured RTO | Clocked restore+bring-up against business ≤3h/≤4h | Label environment | **No Production measurement.** Do not treat lab window as Production RTO |
| RV-09 | Measured RPO | Data lost vs last backup/PITR/replica; **do not report 0 from business zero-loss** | Label environment | **No Production measurement** |
| RV-10 | Failover | If DR exists: failover test to assessed location; Restricted+ rule | Production class | **UNSELECTED** |
| RV-11 | Failback | Return path after failover | Production class | **UNSELECTED** |
| RV-12 | Backup integrity | Job success **insufficient**; restore probe required (ADR-0011) | Labelled | Dev BCM register is **not** PG backup |
| RV-13 | Restore integrity | Application-level checks (Commercial records, documents, audit) | Labelled | Lab markers only |
| RV-14 | Evidence capture | Timestamp, operator role (not invented), environment label, hashes, pass/fail | All runs | E2 lab has run IDs for **lab only** |

---

## 2. Sequencing

1. Durable SoR in the environment under test (not memory as authority).  
2. Backup (RV-01) including encryption/location.  
3. Restore (RV-03) then integrity (RV-13, RV-04, RV-05, RV-06).  
4. Optional PITR (RV-02) if adopted.  
5. Measure RTO/RPO (RV-08, RV-09) **after** a real test.  
6. Failover/failback (RV-10, RV-11) **only if** a DR topology is selected later.

Dev/Test tests **do not** close Production gaps GAP-REC-01 / GAP-REC-02.

---

## 3. Explicit non-claims

- No RTO or RPO has been **achieved** for Production by this plan.  
- Provider advertisements are **not** DR evidence.  
- This file does **not** authorize or execute tests.
