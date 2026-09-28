# H-171 — Production Implementation Authorization & Prerequisite Decision Gate

> **GOVERNANCE / PREREQUISITE DECISION GATE ONLY**  
> Establishes the controlled decision state between architecture selection and Production implementation authorization.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning. **NOT** database, replica, Cloud Run, DNS, IAM, KMS, secrets, IdP, migration, failover, or DR-test work.  
> H-154, H-158 through H-170, historical ADR-0006, historical DP-0006, ADR-0003, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 665  
**Porcelain after this increment:** 666 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / replica / Advanced DR / backup / PITR / HA / Cloud Run / DNS configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract / DPA / purchase:** **NONE**  
**Commit / push:** **NONE**  
**H-172:** **NOT CREATED**

```text
H-171 STATUS = COMPLETE — IMPLEMENTATION-AUTHORIZATION PREREQUISITES DEFINED; IMPLEMENTATION NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Repository state

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 665 (matches H-170 after-count) |
| H-170 file | `docs/governance/h-170-production-dr-implementation-readiness-gate.md` |
| H-170 status | **COMPLETE** — implementation-readiness gates recorded; implementation not authorized |
| ADR-0006 (historical) | `docs/adr/ADR-0006-hosting-and-residency.md` — not rewritten |
| DP-0006 (historical) | `docs/decisions/DP-0006-hosting-data-residency.md` — not rewritten |
| ADR-0003 | PostgreSQL 16 OLTP SoR — **accepted for Development**; not a Production Cloud SQL lock |
| ADR-0012 | `proposed — blocked for UAT and Production` |
| ADR-0013 | `proposed — blocked for Production` |
| Production infrastructure | **NONE** |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |

Stages are **not** collapsed:

1. architecture selection;
2. Production implementation authorization;
3. actual Production implementation;
4. operational validation;
5. DR testing;
6. measured RTO/RPO acceptance;
7. final Production readiness.

H-169 completed stage 1 as a **selection**. This increment defines the gate into stage 2. Stages 2–7 remain **not entered**.

---

## 2. H-170 reconciliation

H-170 is **preserved unchanged** and remains authoritative for implementation-readiness.

### Architecture (POA-selected; not implemented)

| Element | State |
| --- | --- |
| Primary | `africa-south1` (Johannesburg) — Cloud Run / Cloud SQL PostgreSQL |
| Secondary DR | `europe-west1` (Belgium) |
| Cloud SQL edition | Enterprise Plus — architectural selection only; not purchased |
| DR mechanism | Cloud SQL Advanced DR |
| Topology | Designated cross-region DR replica |
| Machine-series pairing | N2 on primary and replica (H-169 constraint) |
| Application DR shape | Active-passive; DR Cloud Run **deployable** in `europe-west1` |
| RTO | ≤ **4 hours** (H-166) |
| RPO | ≤ **1 hour** (H-166) |
| Residency exception | H-168 in principle; H-169 refined to this topology |
| H-160 / H-161 / H-162 / H-163 | Primary-region controls unchanged; implementation **OPEN** |
| H-170 Gate A | **COMPLETE** (architecture selection) |
| H-170 Gates B–I | **OPEN / NOT STARTED** as recorded in H-170 |

### Still unresolved (no values invented)

- Production authorization (Item 1);
- GCP project / account ownership / billing;
- PostgreSQL version (Production Cloud SQL);
- Cloud SQL sizing (vCPU/memory/storage);
- connectivity architecture (PSA vs PSC vs other supported private path);
- CMEK vs Google-managed encryption;
- secrets / KMS (ADR-0012);
- IdP / MFA (ADR-0013);
- Cloud Run DR model details (active-passive direction exists; deployable artefact, config, routing **not** defined as Production values);
- endpoint / write-path strategy;
- DNS / routing;
- logging / monitoring implementation;
- backup / PITR **implementation**;
- legal / contractual review;
- DPA and Belgium residency implications;
- cost / commercial approval;
- operational ownership (HUM-08);
- DR runbook (content required; not executable Production runbook);
- DR test **authorization**;
- measured RTO / RPO.

Provider documentation does **not** constitute EOS RTO/RPO evidence. Cloud SQL failover is **not** EOS application failover.

---

## 3. Production implementation prerequisite matrix

`configuration requirement` ≠ `selected production value`.

| Gate | Requirement | Current status | Evidence available | Missing evidence | Owner/POA decision required | Implementation dependency | Production-readiness impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **A. Production authorization** | Named Owner/POA Production grant | **OPEN** | H-154 Item 1; H-169/H-170 explicitly **not** a grant | Written Production grant document | **Yes** — cannot be inferred from H-169 or H-170 | Blocks all Production acts | Item 1 remains **OPEN**; Production **NOT AUTHORIZED** |
| **B. Cloud/GCP commercial foundation** | GCP project, billing account, ownership, support arrangement, production account controls, budget/cost monitoring | **NOT STARTED** | H-158 hosting **direction** only; no project exists | Project identity, billing owner, support tier, budget controls | **Yes** for ownership/commercial; **external** for Google account artefacts | Required before Gate G | No Production host exists |
| **C. PostgreSQL compatibility/version** | Production Cloud SQL major/minor compatible with EOS and Enterprise Plus | **OPEN** | ADR-0003: PostgreSQL **16** OLTP SoR, **accepted for Development**. Dev/Test compose/`postgres:16-alpine`; Gate C lab evidence recorded **16.15** on disposable catalogs. Plus docs: PG 12–18; PG 16+ defaults to Plus. | Production compatibility pack: EOS migrate/runtime vs chosen Cloud SQL PG version; Plus regional support at create time | **Yes** to **select** Production version; **not selected here**. Lab 16.15 is **not** a Production lock. | Needed before instance create | Wrong version would block migrate/SoR |
| **D. Cloud SQL Enterprise Plus configuration** | Machine/tier, storage, HA, maintenance, backup, PITR, deletion protection, encryption, flags, monitoring | **PARTIALLY DEFINED** as **requirements**; **no Production values** | H-163 HA direction; H-160 backup location; H-162 PITR intent; H-169 N2 pairing; H-170 open sizing | Workload sizing; retention days; maintenance UTC mapping; flags; applied backup/PITR settings | Sizing/retention/flags: **Yes** after evidence. HA/backup **location**/PITR **intent** already directed, not implemented. | Instance create | Undersize/misconfig blocks RTO/RPO demonstration |
| **E. Connectivity** | Application-to-database; DR replica; security; write-endpoint eligibility | **OPEN** — PSA **vs** PSC **not** chosen | H-170: write endpoint documents Plus + **private IP + PSA**; PSC is a **separate** documented path with DNS automation flags | Selected private-connectivity design; VPC; DR-region path; Cloud Run connector choice | **Yes** — must not silently choose PSA or PSC | Networking before replica and write endpoint | Without private path, documented write endpoint may be unavailable |
| **F. Encryption/KMS** | Google-managed vs CMEK; key ownership; rotation; recovery; access | **OPEN** | H-159: CMEK vs Google-managed **REQUIRES OWNER DECISION**. No record **requires** CMEK. | Owner encryption choice; if CMEK: key location `africa-south1` for primary, replica implications, rotation, IAM | **Yes** | Before encrypted instance create | Unchosen encryption blocks secure create |
| **G. Secrets and identity** | Secret storage/rotation; service identities; IAM; IdP; MFA; least privilege; break-glass | **OPEN** | ADR-0012/0013 **OPEN**. H-154 identity owner **UNASSIGNED**. No Production credentials. | Selected secrets platform; IdP/MFA; IAM model; break-glass | **Yes** (ADR-0012/0013) | Before any Production secret or operator login | UAT+ and Production blocked on secrets/IdP |
| **H. Application DR** | Complete EOS recovery beyond Cloud SQL Advanced DR | **PARTIALLY DEFINED** | H-167/H-169/H-170: DB DR ≠ EOS DR; active-passive; DR Cloud Run deployable in `europe-west1` | Production Cloud Run artefact/config; secrets; write endpoint usage; app DNS; auth; email/NATS; observability in recovery state | **Yes** for remaining app-DR design details | After identity/secrets/network | DB failover alone **cannot** close Item 24 |
| **I. Backup/PITR** | Automated backups; location; PITR; WAL location; retention; deletion protection; restore procedure | **DIRECTION SELECTED; IMPLEMENTATION OPEN** | H-160 custom `africa-south1` backups; H-162 intended PITR `africa-south1`; Plus PITR default-on is **capability**; enhanced backups incompatible with DR replica | Applied settings; restore drill; WAL geography confirmation | Location/intent already Owner-directed. Retention/applied config still **Yes**. | Before claiming restore evidence | Items 14–15 remain **OPEN** |
| **J. DR topology** | `africa-south1` → `europe-west1` Plus Advanced DR designated replica | **SELECTED; NOT CREATED** | H-169/H-170 | Actual Plus instance, replica, designation, networking, IAM, monitoring, backup/PITR prerequisites on the **real** system | Implementation **not** authorized here | After Gates A–G, I | Item 24 remains **OPEN** until implemented **and** tested |
| **K. Legal / contractual / residency** | Data categories, Belgium, terms, DPA, subprocessors, transfer, encryption, retention, deletion, access, incidents | **NOT STARTED** | H-168 exception in principle; H-169 data-category list; H-157 EOS PDPC boundary (not a DPA) | DPA; contract; subprocessors; transfer mechanism; Legal acceptance of Belgium replica | **Yes** (Legal/Owner). **No legal conclusion here.** | Before replicating Production data | Item 18 / Gate C **OPEN** |
| **L. Cost** | Separated cost evidence for Plus primary, replica, HA, storage, backup, PITR, cross-region transfer, Cloud Run, networking, logging, monitoring, KMS/secrets, support, other Production services | **OPEN** | Pricing **categories** documented (replica billed as instance; cross-region transfer charged). **No totals.** | Current quote/calculator inputs; commercial approval | **Yes** | Before procurement/provision | Gate D **OPEN** |
| **M. Operations / HUM-08** | Service, DB, app, on-call, DR incident authority, escalation, runbook, evidence, failover, post-failover validation owners | **OPEN** | H-154 items 16–17 **OPEN**. Recorded humans only: PDM; Wensley Shirima (DPO designation, not HUM-08 close); Legal Counsel. **No 24/7 NOC.** DBA/identity/backup/DNS **UNASSIGNED**. | Named RACI | **Yes**. Do not invent names. | Before operational DR | Cannot run Production or DR safely |
| **N. DR testing** | Separate authorization; measured EOS RTO ≤4h and RPO ≤1h | **NOT AUTHORIZED** | H-166 measurement definitions; H-170 test requirements | Test authorization; actual EOS measurements | **Yes** to authorize a test **later**; **not** now | After implementation + runbook | Provider docs **cannot** substitute for measured EOS results |

---

## 4. Decision register

Classifications: `DECIDED` · `OPEN — OWNER DECISION REQUIRED` · `OPEN — EXTERNAL EVIDENCE REQUIRED` · `OPEN — IMPLEMENTATION REQUIRED` · `BLOCKED` · `NOT STARTED`

No decision is manufactured to reduce OPEN items.

| Item | Classification |
| --- | --- |
| Hosting provider / primary region GCP `africa-south1` | **DECIDED** (H-158) — not implemented |
| Cloud Run + Cloud SQL PostgreSQL direction | **DECIDED** (H-158) — not implemented |
| Custom backup location `africa-south1` | **DECIDED** (H-160) — **OPEN — IMPLEMENTATION REQUIRED** |
| Cloud Logging storage `africa-south1` | **DECIDED** (H-161) — **OPEN — IMPLEMENTATION REQUIRED** |
| Intended PITR storage `africa-south1` | **DECIDED** as intent (H-162) — **OPEN — EXTERNAL EVIDENCE REQUIRED** + implementation |
| Regional HA `africa-south1` | **DECIDED** (H-163) — **OPEN — IMPLEMENTATION REQUIRED** |
| RTO ≤ 4 hours / RPO ≤ 1 hour | **DECIDED** (H-166) — not measured |
| Cross-region DR exception in principle | **DECIDED** (H-168) |
| Secondary `europe-west1` + Plus Advanced DR + designated replica + N2 pairing | **DECIDED** (H-169) — not implemented |
| Application DR = active-passive; DB DR ≠ EOS DR | **DECIDED** (H-169/H-170) — app recovery details **OPEN** |
| Production implementation authorization | **OPEN — OWNER DECISION REQUIRED** (not granted) |
| GCP project / billing / ownership / support / budget | **NOT STARTED** / **OPEN — OWNER DECISION REQUIRED** + **OPEN — EXTERNAL EVIDENCE REQUIRED** |
| Production PostgreSQL version | **OPEN — OWNER DECISION REQUIRED** after compatibility evidence. ADR-0003 PG 16 is **Development SoR**, not a Cloud SQL Production patch selection. |
| Cloud SQL vCPU/memory/storage | **OPEN — EXTERNAL EVIDENCE REQUIRED** (workload) then Owner confirmation |
| PSA vs PSC (or other supported private connectivity) | **OPEN — OWNER DECISION REQUIRED** — **not chosen** |
| Google-managed encryption vs CMEK | **OPEN — OWNER DECISION REQUIRED**. CMEK **not** established as mandatory. |
| Secrets platform (ADR-0012) | **OPEN — OWNER DECISION REQUIRED** |
| IdP / MFA (ADR-0013) | **OPEN — OWNER DECISION REQUIRED** + **OPEN — EXTERNAL EVIDENCE REQUIRED** (corporate directory) |
| Write endpoint / DNS / app routing | **OPEN — OWNER DECISION REQUIRED** for strategy; **OPEN — IMPLEMENTATION REQUIRED** later |
| Legal / DPA / Belgium / subprocessors | **OPEN — EXTERNAL EVIDENCE REQUIRED** / **OPEN — OWNER DECISION REQUIRED**. **No legal conclusion.** |
| Cost / procurement | **OPEN — EXTERNAL EVIDENCE REQUIRED** / **OPEN — OWNER DECISION REQUIRED**. **No total invented.** |
| HUM-08 / on-call | **OPEN — OWNER DECISION REQUIRED** |
| DR runbook (executable Production) | **NOT STARTED** |
| DR test authorization | **NOT STARTED** / **BLOCKED** on implementation + ownership + grant |
| Measured RTO/RPO | **NOT STARTED** / **BLOCKED** until controlled EOS test |
| ADR-0006 / DP-0006 Production closure | **OPEN** — selected direction **not fully closed**; **PENDING IMPLEMENTATION / PROVIDER EVIDENCE** |
| H-170 Gates C–I | **NOT STARTED** or **OPEN** as in H-170; Gate G **BLOCKED** on C–F and Item 1 |

---

## 5. Implementation authorization gate

Architectural design **alone does not satisfy this gate**.

Minimum conditions before Production **implementation** may be authorized:

1. Production project/billing ownership established.
2. Production authorization explicitly granted.
3. ADR-0006 closed for Production.
4. DP-0006 closed with provider/implementation evidence.
5. PostgreSQL version selected and compatibility evidence available.
6. Cloud SQL sizing selected from workload evidence.
7. Connectivity architecture selected.
8. Encryption/KMS decision completed.
9. Secrets/IAM/IdP/MFA controls defined.
10. Application DR architecture defined (beyond H-169 active-passive direction: artefact, config, routing, auth, dependencies).
11. DNS/routing/write-endpoint strategy defined.
12. Backup/PITR controls defined as **applied Production settings** (H-160/H-162 directions already exist).
13. Legal/contractual/Belgium residency review completed or formally accepted by the authorized Owner.
14. Cost evidence and commercial approval completed.
15. HUM-08 operational ownership established.
16. Production monitoring/logging requirements defined (H-161 storage direction already exists).
17. Production deployment and rollback plan defined.
18. DR runbook defined.
19. DR test plan defined.
20. Explicit Production **implementation** authorization recorded.

None of 1–20 is satisfied by H-171. H-169/H-170 do **not** grant items 2 or 20.

---

## 6. Future evidence chain

Do **not** skip stages.

```text
H-171
  → prerequisite / decision closure

then
Production Implementation Authorization
  → actual infrastructure implementation

then
Production Infrastructure Evidence
  → configuration verification

then
Application Production Validation
  → EOS runtime validation

then
Controlled DR Test Authorization
  → controlled failover/recovery exercise

then
Measured RTO/RPO Evidence
  → actual EOS measurements

then
Production Readiness Closure
  → only if every required control passes
```

---

## 7. Status

| Topic | State |
| --- | --- |
| Architecture | **COMPLETE** (selection) |
| Implementation prerequisites | **PARTIALLY DEFINED** |
| Production authorization | **OPEN** |
| Production infrastructure | **NOT IMPLEMENTED** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |

### Production blockers (H-154 inventory; none closed by H-171)

| # | After H-171 |
| ---: | --- |
| 1 | **OPEN** — NOT GRANTED |
| 2–4 | Direction selected; implementation/evidence **OPEN**; ADR-0006/DP-0006 **not fully closed** |
| 5–13 | **OPEN** |
| 14 | **OPEN** (H-160) |
| 15 | **OPEN** (H-162) |
| 16–21 | **OPEN** (HUM-08, on-call, legal/DPA, NATS, email, supervision) |
| 22 | **OPEN** (H-161) |
| 23 | **OPEN** |
| **24** | **OPEN** — architecture selected; implementation not authorized; configuration evidence, DR test, measured RTO/RPO outstanding |
| 25–26 | **OPEN** |
| 27 | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | **CLOSED BY OWNER ACCEPTANCE** |

---

## 8. Governance integrity

H-171 is a governance decision/prerequisite gate only.

It does **not** authorize:

- GCP provisioning;
- Production deployment;
- database creation;
- DR replica creation;
- data migration;
- application deployment;
- schema migration;
- failover;
- DR testing.

Any such action requires a **subsequent explicit governance authorization**.

```text
No GCP resources were created.
Application code unchanged.
Database schema unchanged.
Migrations unchanged.
Infrastructure-as-code unchanged.
Deployment configuration unchanged.
Migration 126 not created.
Live migration not run.
No Production data moved.
No credentials created.
No vendor contacted.
No legal/contractual commitment made.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006 remains **SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION**.  
Historical DP-0006 remains **SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE**.  
Those files were **not rewritten**.

---

## 9. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 665 → 666 |
| Files changed this increment | `docs/governance/h-171-production-implementation-authorization-prerequisite-decision-gate.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-171
H-172 NOT CREATED
NEXT GATE (not executed): prerequisite/decision closure
  leading to an explicit Production Implementation Authorization grant.
That grant is NOT this increment.
```
