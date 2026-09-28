# H-172 — Production Prerequisite Decision Closure Plan

> **GOVERNANCE / CLOSURE PLAN ONLY**  
> Converts the H-171 prerequisite/authorization gate into a controlled **closure register and sequence**.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning. **NOT** database, replica, Cloud Run, DNS, IAM, KMS, secrets, IdP, migration, failover, or DR-test work.  
> Historical ADR-0006, DP-0006, H-170, and H-171 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 666  
**Porcelain after this increment:** 667 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / replica / Advanced DR / backup / PITR / HA / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract / DPA / purchase:** **NONE**  
**Commit / push:** **NONE**  
**H-173:** **NOT CREATED**

```text
H-172 STATUS = COMPLETE — PREREQUISITE CLOSURE PLAN RECORDED; PREREQUISITES NOT CLOSED; IMPLEMENTATION NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 666 (matches H-171 after-count) |
| H-171 file | `docs/governance/h-171-production-implementation-authorization-prerequisite-decision-gate.md` |
| H-171 status | **COMPLETE** — implementation-authorization prerequisites **defined**; implementation **not** authorized |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |
| Production infrastructure | **NONE** |

A plan is **not** closure. No prerequisite is closed because this file exists.

---

## 2. Authoritative decision baseline

Reconciled from H-169, H-170, and H-171. Architecture selection is **COMPLETE**. Architecture selection is **not** implementation authorization.

| Topic | Established state |
| --- | --- |
| Primary | `africa-south1` — Johannesburg (H-158 / H-169) |
| Secondary DR | `europe-west1` — Belgium (H-169) |
| Cloud SQL edition | Enterprise Plus — architectural only; not purchased (H-169) |
| DR mechanism | Cloud SQL Advanced DR with designated DR replica (H-169) |
| Machine-series pairing | N2 primary and replica (H-169) |
| RTO | ≤ **4 hours** (H-166) |
| RPO | ≤ **1 hour** (H-166) |
| Application DR | Active-passive; DR Cloud Run deployable in `europe-west1` (H-169/H-170) |
| Database vs EOS | Cloud SQL failover is **not** complete EOS application failover (H-167–H-171) |
| Primary backups | Custom `africa-south1` (H-160) — not implemented |
| Primary PITR | Intended `africa-south1` (H-162) — evidence/implementation OPEN |
| Primary HA | Regional HA `africa-south1` (H-163) — not implemented |
| Primary logging storage | `africa-south1` (H-161) — not implemented |
| Residency exception | H-168 in principle; H-169 refined to this DR architecture only — **not** a blanket approval |
| H-170 Gate A | COMPLETE (selection) |
| H-170 Gates B–I | OPEN / NOT STARTED |
| ADR-0006 | SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION |
| DP-0006 | SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE |

---

## 3. Master closure register

Statuses used only from: `DECIDED` · `OWNER DECISION REQUIRED` · `EXTERNAL EVIDENCE REQUIRED` · `LEGAL/CONTRACT REVIEW REQUIRED` · `IMPLEMENTATION REQUIRED` · `VALIDATION REQUIRED` · `BLOCKED` · `NOT STARTED`.

A design direction does **not** close an item that still needs a value, evidence, implementation, or validation.

| ID | Prerequisite/decision | Category | Current status | Required decision or evidence | Responsible authority | Dependency | Production-readiness impact | Next permissible action | Closure evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Production authorization grant | Governance | **OWNER DECISION REQUIRED** | Named Owner/POA Production grant. Not inferred from H-169–H-171. | Owner/POA | H-171 §5 conditions | Item 1 OPEN; blocks all Production acts | Record explicit grant **or** explicit deferral | Written grant document |
| P02 | GCP project, billing, ownership, support, budget controls | Commercial / cloud | **NOT STARTED** | Project identity; billing owner; support arrangement; production account controls; cost monitoring | Owner/POA + commercial | P01 for Production use of a project | No Production host | Decide ownership/billing **without** provisioning | Named project/billing owners; support/budget policy. Project create is **later implementation**. |
| P03 | Production PostgreSQL version | Database | **OWNER DECISION REQUIRED** | Select Production Cloud SQL PG version with compatibility pack. ADR-0003 PG 16 is **Development SoR**, not a Production patch lock. Lab 16.15 is not Production. | Owner/POA after evidence | EXTERNAL EVIDENCE (EOS vs Plus PG 12–18) | Wrong version blocks migrate/SoR | Commission compatibility pack; then Owner selects | Written version + compatibility evidence |
| P04 | Cloud SQL sizing (vCPU/memory/storage) | Database | **EXTERNAL EVIDENCE REQUIRED** | Workload-based sizing. No capacity numbers invented. Framework may be Owner-approved; values need evidence. | Owner/POA confirms after evidence | Workload/evidence pack | Undersize blocks RTO/RPO demonstration | Collect workload evidence; then Owner confirms | Sizing record tied to evidence |
| P05 | PSA versus PSC (private connectivity) | Networking | **OWNER DECISION REQUIRED** | Explicit choice among supported private paths. **Not silently chosen.** | Owner/POA after design evidence | Write-endpoint docs: Plus + private IP; PSA and PSC are distinct | Write endpoint / replica path may be unavailable | Record selected connectivity architecture | Named PSA or PSC (or documented alternative) |
| P06 | CMEK versus Google-managed encryption | Security | **OWNER DECISION REQUIRED** | Encryption choice. CMEK is **not** established as mandatory (H-159). | Owner/POA | If CMEK: key location/IAM/rotation evidence | Blocks secure instance create | Owner records encryption choice | Written encryption decision |
| P07 | Secrets / KMS platform | Security | **OWNER DECISION REQUIRED** | Close or expressly defer ADR-0012. No credentials created. | Owner/POA | UAT+/Production blocked on secrets | Items 7, F | Owner direction on Vault vs cloud KMS/Secret Manager | ADR-0012 Production-ready status **or** recorded deferral with control |
| P08 | IdP / MFA | Identity | **OWNER DECISION REQUIRED** | Close or expressly defer ADR-0013. Corporate directory facts not invented. | Owner/POA | EXTERNAL EVIDENCE of corporate IdP | Items 8–9 | Establish corporate identity facts; then select IdP/MFA | ADR-0013 decision + MFA evidence |
| P09 | Application DR deployment strategy (beyond active-passive direction) | Application | **OWNER DECISION REQUIRED** | Production values for DR Cloud Run artefact, config, routing, auth dependencies. Active-passive **direction** is DECIDED; deployable Production design is not. | Owner/POA | P07, P08, P05, P10 | DB failover ≠ EOS DR | Define app-DR package | Written app-DR design (still not deploy) |
| P10 | Write endpoint and DNS / app routing | Application / DNS | **OWNER DECISION REQUIRED** | DB write-endpoint strategy vs app URL DNS. No DNS records. | Owner/POA | P05 | Failover reconnect may fail | Select endpoint/DNS strategy | Written strategy |
| P11 | Belgium residency / legal acceptance | Legal | **LEGAL/CONTRACT REVIEW REQUIRED** | Formal Owner/Legal acceptance of refined H-168/H-169 exception as implemented later. **No legal conclusion here.** | Owner/POA + Legal Counsel | DPA/contract pack (E-pack) | Blocks Production data replication | Legal review of §7 topics | Written Legal/Owner acceptance **or** recorded refusal |
| P12 | Cost and procurement authorization | Commercial | **EXTERNAL EVIDENCE REQUIRED** | Category quotes/calculator inputs; then commercial approval. **No totals invented.** | Owner/POA + commercial | Provider pricing inputs | Gate D OPEN | Obtain quotes/calculator outputs | Approved commercial pack |
| P13 | HUM-08 operational ownership | Operations | **OWNER DECISION REQUIRED** | Named RACI. Do **not** invent names. DBA/identity/backup/DNS currently UNASSIGNED. No 24/7 NOC inferred. | Owner/POA | H-154 items 16–17 | Cannot operate Production/DR | Owner Session assignments | Named RACI record |
| P14 | Provider instance-specific capability confirmation | Provider | **EXTERNAL EVIDENCE REQUIRED** | Confirm Plus + Advanced DR + N2 + replica + write-endpoint **at create time** in both regions | Implementation team after grant | P01; generic docs are **not** EOS evidence | H-170 Gate B OPEN | After authorization: confirm on real project | Instance-level evidence |
| P15 | EOS–Cloud SQL compatibility pack | Application / DB | **EXTERNAL EVIDENCE REQUIRED** | Migrate/runtime vs selected PG version (P03) | Engineering after P03 framework | P03 | Blocks catalog/migrate | Produce compatibility evidence | Test report against selected version |
| P16 | Primary backup/PITR applied settings | Resilience | **IMPLEMENTATION REQUIRED** | Apply H-160 location and H-162 intent; retention; restore procedure | DBA after grant (role UNASSIGNED) | P01, P03, P04 | Items 14–15 OPEN | After implementation authorization | Applied config + restore evidence |
| P17 | DR replica + Advanced DR configuration | DR | **IMPLEMENTATION REQUIRED** | Create designated replica; designate DR; monitoring | DBA after grant | P01, P03–P06, P11, P12 | Item 24 OPEN | After implementation authorization | Replica exists + designation evidence |
| P18 | DR runbook (executable Production) | Operations | **NOT STARTED** | Runbook covering H-170 §16 content | Runbook owner after P13 | P13 | Cannot test safely | Draft after ownership named | Approved runbook |
| P19 | DR test authorization | Governance | **BLOCKED** | Separate grant for controlled EOS DR test | Owner/POA | P01, P13, P17, P18, application validation | Item 24 cannot close | Later explicit test grant | Written DR-test authorization |
| P20 | Measured RTO ≤4h and RPO ≤1h | Validation | **VALIDATION REQUIRED** | Actual EOS measurements. Provider docs **cannot** substitute. | DR test owner after P19 | P19 | Item 24 / readiness | After authorized test | Measured RTO/RPO records |
| P21 | ADR-0006 / DP-0006 Production closure | Governance | **OWNER DECISION REQUIRED** | Close only with provider/implementation evidence | Owner/POA | Implementation + evidence | Items 2–4 not fully closed | After evidence pack | Updated Production-ready ADR/DP **later**; historical files not rewritten now |

---

## 4. Owner/POA decisions versus evidence / specialist review

Items the authorized Owner/POA **may** decide (values still **not** invented here):

| ID | May Owner/POA decide now, in principle? | Still requires |
| --- | --- | --- |
| P01 Production authorization | **Yes** (the grant itself) — **not granted now** | Prerequisite §5 of H-171 still applies; grant must be explicit |
| P02 GCP ownership and billing | **Yes** for named ownership model | Account artefacts are later implementation |
| P03 PostgreSQL Production version | **Yes** after compatibility evidence | EXTERNAL EVIDENCE first; not selected here |
| P04 Sizing **framework** | **Yes** (how sizing will be derived) | Actual vCPU/memory/storage: EXTERNAL EVIDENCE |
| P05 PSA versus PSC | **Yes** after connectivity design note | Must not be silent; **not chosen here** |
| P06 CMEK versus Google-managed | **Yes** | CMEK not mandatory unless Owner so decides |
| P07 Secrets/KMS direction | **Yes** (ADR-0012) | Product lock still OPEN |
| P08 IdP/MFA direction | **Yes** only with corporate identity facts | EXTERNAL EVIDENCE of directory |
| P09 Application DR deployment strategy | **Yes** to refine H-169 active-passive into a Production design | Secrets/IdP/network |
| P10 Write endpoint and DNS strategy | **Yes** | Connectivity (P05) |
| P11 Belgium residency acceptance | **Yes** only **after** Legal review | LEGAL/CONTRACT REVIEW REQUIRED |
| P12 Cost/procurement authorization | **Yes** after cost evidence | EXTERNAL EVIDENCE; no totals |
| P13 HUM-08 | **Yes** (assign real people) | Do not invent names |

Unresolved because evidence/specialist review is required: P03 values, P04 sizes, P08 directory facts, P11 legal, P12 prices, P14 instance confirmation, P15 compatibility pack, P20 measurements.

---

## 5. External evidence pack

Distinguish evidence **classes**. Generic provider documentation does **not** prove EOS suitability or RTO/RPO.

| Pack ID | Subject | Evidence class required |
| --- | --- | --- |
| E01 | Plus + Advanced DR + N2 in `africa-south1` and `europe-west1` | Provider documentation (exists, H-169/H-170) **plus** provider-specific confirmation at instance create |
| E02 | PostgreSQL version compatibility with EOS migrate/runtime | Actual EOS implementation evidence (Dev/Test 16-class is **not** Production closure) |
| E03 | Advanced DR prerequisites (designated replica, backups/PITR hygiene, HA recommendations, write endpoint conditions) | Provider documentation **plus** configuration evidence after implementation |
| E04 | Connectivity (PSA vs PSC, Cloud Run to SQL, DR-region path) | Provider documentation **plus** design; validation is implementation-dependent |
| E05 | Backup location `africa-south1`; PITR geography/WAL | Provider documentation **plus** applied-config and restore evidence |
| E06 | Encryption/KMS behaviour if CMEK chosen | Provider documentation **plus** key-location/IAM design |
| E07 | Pricing: Plus primary, replica, HA, storage, backup/PITR, cross-region transfer, Cloud Run, network, logging, monitoring, KMS/secrets, support | Commercial quotation / calculator inputs — **OPEN** |
| E08 | DPA, contract, subprocessors, residency, transfer | Legal/contract review — **OPEN** |
| E09 | Operational support / on-call coverage vs 4-hour RTO | Owner assignment + support arrangement — no 24/7 NOC inferred |
| E10 | Measured RTO/RPO | Measured runtime evidence **only** after authorized EOS DR test |

---

## 6. Implementation dependencies

These **cannot** be resolved until authorized implementation occurs. Status: **IMPLEMENTATION REQUIRED** and/or **VALIDATION REQUIRED**.

| Dependency | Cannot close until |
| --- | --- |
| Actual Cloud SQL configuration evidence | Instance exists with applied Plus/HA/backup/PITR/N2 settings |
| Private connectivity validation | VPC/PSA or PSC (once chosen) is built and tested |
| Backup/PITR verification | Backups exist in directed location; restore drill |
| Secrets and IAM validation | Platform selected **and** Production identities exist |
| Cloud Run deployment validation | Primary and DR-runtime services deployed under a grant |
| DNS / write-endpoint validation | Endpoint/DNS implemented and failover-reconnect tested |
| Monitoring and alerting validation | Sinks/alerts exist (H-161 storage direction still Johannesburg) |
| DR replica creation | Authorized create + designation |
| Failover/switchover behaviour | Controlled test — **not** this increment |
| Application recovery validation | Full-stack recovery, not SQL-only |

---

## 7. Legal and residency control

Existing exception **maintained**, not expanded:

- primary remains `africa-south1`;
- secondary DR region is `europe-west1`;
- exception applies **only** to the selected DR architecture;
- **no** blanket residency approval exists;
- legal/contractual confirmation remains **required**.

**No legal conclusion is made.**

Required review topics (all OPEN):

- data categories (H-169 list);
- Belgium storage and processing;
- provider terms;
- DPA;
- subprocessors;
- transfer mechanisms where applicable;
- encryption;
- retention and deletion;
- backup and DR access;
- incident responsibilities.

---

## 8. Cost and commercial control

Pricing and procurement remain **unresolved** until evidence exists. **No totals invented.**

Required later inputs (separate lines):

- primary Cloud SQL Enterprise Plus instance;
- designated DR replica (documented as a separately billable instance);
- HA;
- storage;
- backup/PITR;
- cross-region replication and data transfer;
- Cloud Run;
- networking;
- logging;
- monitoring;
- KMS/secrets;
- support.

---

## 9. Closure sequence

Do **not** combine stages.

1. Owner/POA decisions (P01–P13 as applicable).
2. External provider and commercial evidence (E-pack).
3. Legal/contract review (P11 / E08).
4. Production implementation authorization (explicit grant).
5. Infrastructure implementation.
6. Configuration evidence.
7. Application Production validation.
8. Controlled DR test authorization.
9. Measured RTO/RPO.
10. Production readiness closure.

---

## 10. Authorization boundary

H-172 does **not** authorize:

- GCP provisioning;
- Production deployment;
- database creation;
- DR replica creation;
- migration;
- failover;
- switchover;
- DR testing;
- application or schema changes.

A later **explicit** governance decision is required for each applicable implementation stage.

```text
No GCP resources were created.
Application code unchanged.
Database schema unchanged.
Migrations unchanged.
No credentials created.
No vendor contacted.
No legal/contractual commitment made.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, H-170, and H-171 were **not rewritten**.

---

## 11. Final status

| Topic | State |
| --- | --- |
| Architecture | **COMPLETE** |
| Prerequisite closure | **IN PROGRESS** |
| Production authorization | **OPEN** |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

Item 1 remains **OPEN**. Items 2–4 direction selected, not fully closed. Items 14, 15, 22 remain **OPEN**. Item 27 UAT evidence only. Item 28 closed by Owner acceptance. No blocker is closed because a plan exists.

---

## 12. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 666 → 667 |
| Files changed this increment | `docs/governance/h-172-production-prerequisite-decision-closure-plan.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-172
H-173 NOT CREATED
NEXT GATE (not executed): Owner/POA prerequisite decision session
  against the H-172 register (especially P01–P13),
  then external evidence and legal/contract review,
  then an explicit Production Implementation Authorization grant.
```
