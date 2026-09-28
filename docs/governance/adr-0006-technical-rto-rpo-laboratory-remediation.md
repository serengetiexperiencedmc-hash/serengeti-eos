# ADR-0006 Stage 4B laboratory remediation register

> **DEV/TEST FINDINGS ONLY — NOT PRODUCTION REMEDIATION AUTHORIZATION**  
> **RUN:** `20260915-183034`  
> Source: [`adr-0006-technical-rto-rpo-laboratory-results.md`](adr-0006-technical-rto-rpo-laboratory-results.md)

Do **not** implement Production remediation from this register. Status values are governance tracking only.

**Dev/Test laboratory evidence only. This result does not constitute Production readiness, Production authorization, or Production proof.**

| ID | Finding | Affected topology | Affected failure model | Why failed / not fully demonstrated | Required capability | Recommended remediation (non-Production until authorized) | Production significance | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RM-01 | EOS jointly-critical modules are not a durable PostgreSQL SoR | All Production classes | F1 and all data-loss models | ADR-0017 in-memory `Store` remains API SoR; synthetic lab tables are stand-ins | Durable Production SoR for Commercial/RFP and Programme Building | Separate persistence-cutover authorization (not this stage) | Blocks treating lab PASS as Stage 1 function recovery | IT; Owner | OPEN |
| RM-02 | T1 backup-only loses committed work after the dump | T1 | F4/F5/F11 between backups | LAB-01: `MARKER-POST-BACKUP` lost | WAL/PITR and/or replication if business zero-loss must be qualified for those models | Do not select backup-only as sufficient without Owner qualification of the failure model | Directly conflicts with **unqualified** zero business-loss | IT; Owner | OPEN |
| RM-03 | No Production backup/PITR product | T1, T2 | F7, F8, F9 | ADR-0011 is a BCM **register**; lab used `pg_dump`/`pg_basebackup` in Docker | Named Production backup + WAL archive product (still TBD) | Gate E3 provider evidence; do not name a vendor here | Production backup still TBD | IT | OPEN |
| RM-04 | Sync/async replica tests were one Docker host | T3, T4, T5, T6 | F6, F12 | Independent AZ/region not present | Independent failure domain + fencing | Provider/facility HA evidence (E3); Legal E1 for replica geography | Lab promote times are not multi-AZ proof | IT; Legal | OPEN |
| RM-05 | Async replica loses committed work under lag | T4 | F4, F12 | LAB-05/10: unreplicated markers lost | Either sync replica for those models, or Owner-qualified technical RPO > 0 | Record failure-model qualification (workplan Q3) | Cannot label async as zero-loss | Owner; IT | OPEN |
| RM-06 | EOS application warm standby not present | T5 | F11, F12 | LAB-06 PARTIAL: DB promote only | Application process/config standby + traffic switch | Design later; **not selected** now | DB RTO ≠ application RTO | IT | OPEN |
| RM-07 | LAB-07 did not prove in-memory loss | F1 | F1 | CRM org `UNEXPECTEDLY_PRESENT`; likely `npm.cmd` kill left Node running | Process-tree kill / dedicated lab API harness | Optional later Dev/Test re-run; not Production work | In-memory SoR risk remains from ADR-0017, not from this failed witness | IT | OPEN |
| RM-08 | F12 is not Legal-approved DR | T4 | F12 | Two containers ≠ jurisdiction/facility | Legal/DPO DR placement (E1) | Stage 4A / E1 — **not** closed by this lab | Replica location is a transfer | Legal/DPO | OPEN |
| RM-09 | Production dependencies not in lab | — | F13 | IdP, secrets, CDN, WAF, email, object storage absent | Dependency recovery in RTO clock | E3 stand-ins/candidates `CANDIDATE — NOT SELECTED` | Function can be down with data intact | IT; Legal | OPEN |
| RM-10 | No automated HA product | T6 | F11, F14 | Scripted `pg_promote` / rebuild | Controlled or automated failover **product** still not selected | Do not treat LAB-04/12 as Patroni/managed-HA proof | Operator error / split-brain remain | IT | OPEN |
| RM-11 | F7 backup corruption not tested | T1, T2 | F7 | Not in run | Dual backup / restore-probe against independent media | Later lab if authorized | Recovery path can vanish | IT | OPEN |
| RM-12 | F10 dual-primary split-brain not tested | T3, T6 | F10 | LAB-10 used disconnect+kill, not two writers | Fencing / fail-closed writes | Later lab if authorized | Can duplicate or lose acknowledged writes | IT | OPEN |
| RM-13 | Lab detection was scripted | All | All | Not an ops monitoring stack | Production detection/alerting | Observability design later (E3) | Real RTO includes detection | IT | OPEN |
| RM-14 | Single-run, not repeated | All | All | Repeatability = single run | Second independent lab run | Optional later authorization | Repeatability not proven | IT | OPEN |

No Production infrastructure, migrations, or application persistence changes are authorized by this register.
