# H-201 — Production Infrastructure Options and Decision Specification

> **DECISION-GRADE INFRASTRUCTURE OPTIONS. NO SELECTION.**  
> **H-201 does not select a Production architecture.**  
> **H-201 converts H-200 requirements into comparable infrastructure options for subsequent technical, commercial, legal, and Owner/POA decision-making.**  
> **No Production infrastructure exists as a result of H-201.**  
> H-158 through H-200 were inspected and **not rewritten**. H-198 remains **unsent**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 721 (H-200 start 719; H-200 final 721)

```text
H-201 STATUS = COMPLETE — OPTIONS SPECIFIED; NO PATH SELECTED
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
H-198 SUBMISSION = UNSENT
GOOGLE CLOUD FORM SUBMITTED = NO
DR TEST = NOT PERFORMED
SEDMC PRODUCTION SERVERS = NOT IN PLACE
GCP PRODUCTION RESOURCES = NONE
RTO ≤ 4 hours
RPO ≤ 1 hour
No provider is selected by H-201
No Production infrastructure is represented as existing
```

---

## 1. Purpose

H-200 defined provider-neutral **requirements**. H-201 defines three **comparable reference options** so later vendor research and commercial comparison can proceed. H-201 does **not** authorize Production, procure, or implement.

| Option | Label | Status in this file |
| --- | --- | --- |
| **A** | SEDMC-controlled / self-managed | Reference architecture — **components do not currently exist** |
| **B** | Google Cloud managed | `PREVIOUSLY SELECTED ARCHITECTURE DIRECTION — NOT IMPLEMENTED` |
| **C** | Hybrid / managed | Pattern family — **no single hybrid pattern selected** |

---

## 2. Baseline (not rewritten)

| Record | Carried fact |
| --- | --- |
| H-200 | Provider-neutral Production requirements |
| H-199 | SEDMC plant **NOT IN PLACE**; GCP not EOS-mandatory; geo-separated DR required for existing RTO/RPO |
| H-198 | GCP evidence package **UNSENT** |
| H-194 | SMTP direction; secrets/object/NATS **OPEN**; Identity Platform **candidate**; P01 **NOT GRANTED** |
| H-169 | GCP `africa-south1` / `europe-west1` Advanced DR — **historical** until reconsidered |
| H-192 | Dependency register — not closed by H-201 |

---

## 3. OPTION A — SEDMC-controlled / self-managed (reference only)

**Does not exist.** Sizes: **SIZING EVIDENCE REQUIRED**. Geography and hardware: **not chosen**.

### Primary site (must exist independently of Dev/Test laptops)

| Component | Reference requirement (H-200) | Existence |
| --- | --- | --- |
| Application compute | Supervised Production runtime; instance redundancy; `/health` `/ready`; graceful shutdown | **NOT CURRENTLY DEMONSTRATED** |
| PostgreSQL | Newest application-compatible provider-supported version at implementation time; durable storage; TLS; auth | **NOT CURRENTLY DEMONSTRATED** |
| Durable object/document storage | Not LocalFs | **NOT CURRENTLY DEMONSTRATED** |
| Backup capability | Scheduled backups **plus** copies reachable if this site is down | **NOT CURRENTLY DEMONSTRATED** |
| Networking / firewall | Private DB path; controlled admin; HTTPS | **NOT CURRENTLY DEMONSTRATED** |
| HTTPS endpoint / DNS / TLS | Dedicated SEDMC-controlled origin; hostname **OPEN** | **NOT CURRENTLY DEMONSTRATED** |
| Monitoring / logging | Structured logs, metrics, alerts to on-call | **NOT CURRENTLY DEMONSTRATED** |
| Secrets | Managed secret platform | **NOT CURRENTLY DEMONSTRATED** |
| Identity integration | Federated IdP + MFA | **NOT CURRENTLY DEMONSTRATED** |
| Messaging | NATS JetStream or equivalent | **NOT CURRENTLY DEMONSTRATED** |
| Email integration | SMTP TLS authenticated; provider **OPEN** | **NOT CURRENTLY DEMONSTRATED** |

### Secondary / DR site (independent failure domain)

Required to satisfy **RTO ≤ 4 hours** and **RPO ≤ 1 hour** against **loss of the primary site** (H-200 §5–§7). **Not** the same building/rack/shared-fate campus.

| DR element | Must exist independently of primary | Existence |
| --- | --- | --- |
| Separate physical/geographic failure domain | Yes — country **not chosen by H-201** | **NOT CURRENTLY DEMONSTRATED** |
| Application recovery | Runtime that can start and serve EOS | **NOT CURRENTLY DEMONSTRATED** |
| PostgreSQL recovery / replication | Standby and/or PITR copies **off** primary site; RPO ≤ 1 hour | **NOT CURRENTLY DEMONSTRATED** |
| Object storage recovery | Documents available in DR path | **NOT CURRENTLY DEMONSTRATED** |
| Backup availability | Backups reachable while primary is down | **NOT CURRENTLY DEMONSTRATED** |
| Configuration / secrets recovery | Secrets/config without primary site | **NOT CURRENTLY DEMONSTRATED** |
| DNS / network recovery | Origin can be pointed at recovered environment | **NOT CURRENTLY DEMONSTRATED** |
| Operational recovery procedure | Written runbook + **HUM-08 APPOINTMENT REQUIRED** (DR Coordinator) | **NOT CURRENTLY DEMONSTRATED** |

Compute/storage quantities: **SIZING EVIDENCE REQUIRED**.

---

## 4. OPTION B — Google Cloud

```text
PREVIOUSLY SELECTED ARCHITECTURE DIRECTION — NOT IMPLEMENTED
Primary: africa-south1 — Cloud Run + Cloud SQL PostgreSQL
DR:      europe-west1 — Cloud SQL Enterprise Plus Advanced DR
RTO ≤ 4 hours    RPO ≤ 1 hour
```

This is **not** a current Production deployment. No GCP project, Cloud Run service, Cloud SQL instance, or replica exists. H-198 remains **unsent**. H-201 does **not** re-select Option B.

**Do not assume every remaining component must be a Google product.** H-194 leaves several products **OPEN** or **candidate**.

| Remaining decision / implementation | Historical note | H-201 status |
| --- | --- | --- |
| Identity | Federated + MFA; Google Identity Platform = **candidate**, not final | **EVIDENCE REQUIRED** — product **OPEN** |
| MFA | Mandatory | **EVIDENCE REQUIRED** |
| Secrets | Managed platform required; product **OPEN** | **EVIDENCE REQUIRED** |
| Object storage | Durable managed store required; GCS **not** selected by H-201 | **EVIDENCE REQUIRED** |
| NATS | Managed JetStream or equivalent; vendor **OPEN** | **EVIDENCE REQUIRED** |
| Email | SMTP direction; SES/vendor **OPEN** | **EVIDENCE REQUIRED** |
| DNS / TLS | Dedicated hostname **OPEN** | **EVIDENCE REQUIRED** |
| Monitoring | Platform + app logs; vendor **OPEN** | **EVIDENCE REQUIRED** |
| IAM | GCP IAM **if** GCP path; still needs SEDMC RACI | **EVIDENCE REQUIRED** |
| Backup / PITR | H-160/H-162 **direction**; not applied | **NOT CURRENTLY DEMONSTRATED** |
| DR | H-169 replica **not created**; DR test **NOT PERFORMED** | **NOT CURRENTLY DEMONSTRATED** |
| Operations | HUM-08 unappointed; no dedicated NOC | **HUM-08 APPOINTMENT REQUIRED** |

Belgium / `europe-west1` remains **historical H-169** and **DEFERRED — LEGAL REVIEW** (D194-18). H-201 does **not** select that country.

---

## 5. OPTION C — Hybrid / managed (pattern family; none selected)

H-200 can be satisfied by **splitting** operation between SEDMC and one or more providers, **if** geo-separated DR, backup/restore, and HUM-08 still hold. H-201 **does not select** a hybrid pattern.

### Patterns that could satisfy H-200 (catalogue only)

| Pattern ID | Division | SEDMC operates | Provider operates | Geo-separation | Backup owner | Restore owner | DR owner | Security owner | Incidents | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Managed compute + managed PostgreSQL | App config, RACI, on-call | Runtime + DB platform | Secondary region/site **required** | **Shared** | **Shared** | **Shared** | **Shared** | **HUM-08 APPOINTMENT REQUIRED** | Inventory + contracts + DR test |
| C2 | Hosted/dedicated app server + managed database | App host, OS (if dedicated) | Managed PG | DB DR region + app recovery host | Provider (DB) / SEDMC (app) | **Shared** | **Shared** | **Shared** | **HUM-08 APPOINTMENT REQUIRED** | Same |
| C3 | SEDMC-controlled primary + managed DR | Primary site | DR target | **Required** by definition | **Shared** | **Shared** | **Shared** | SEDMC primary + provider DR | **HUM-08 APPOINTMENT REQUIRED** | Failover contract + test |
| C4 | Managed primary + independent DR | DR site or second provider | Primary platform | **Required** | **Shared** | **Shared** | **Shared** | **Shared** | **HUM-08 APPOINTMENT REQUIRED** | Dual-provider runbook |
| C5 | Managed database + SEDMC-controlled application | App compute, network | PostgreSQL | App + DB both need DR path | Provider (DB) / SEDMC (app/objects) | **Shared** | **Shared** | **Shared** | **HUM-08 APPOINTMENT REQUIRED** | Connectivity + restore |
| C6 | Managed IdP/secrets/email/NATS; SEDMC or cloud compute/DB | As chosen for compute/DB | Identity, secrets, mail, events as contracted | Same DR rule | Per component | Per component | **Shared** | **Shared** | **HUM-08 APPOINTMENT REQUIRED** | Adapter + DPA evidence |

Object storage, NATS, and email may be managed even when compute is SEDMC-controlled. **LocalFs remains unsuitable** for Production documents on every pattern.

Later commercial work may quote **one** of C1–C6; H-201 does not pick which.

---

## 6. Comparison matrix (H-200 requirements)

Classifications only: `VERIFIED` · `CAN SATISFY` · `EVIDENCE REQUIRED` · `UNKNOWN` · `PARTIALLY SATISFIABLE` · `NOT CURRENTLY DEMONSTRATED`.

No ranking language.

| Requirement | Option A: SEDMC-controlled | Option B: GCP | Option C: Hybrid | Evidence required |
| --- | --- | --- | --- | --- |
| Compute | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** (Cloud Run direction) — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** if a pattern is later chosen — **NOT CURRENTLY DEMONSTRATED** | Inventory, health/ready |
| PostgreSQL | **CAN SATISFY** in principle — **EVIDENCE REQUIRED** | **CAN SATISFY** (Cloud SQL direction) — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Version + migrate pack |
| Database durability | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Durable media / SLA artefacts |
| Backup | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Dated backups |
| Restore | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | Restore drill |
| PITR | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | PITR window proof |
| HA | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Instance/zone test |
| DR | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** only with geo-split — **EVIDENCE REQUIRED** | Geo-separated DR test |
| RTO ≤ 4 hours | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | Measured DR log |
| RPO ≤ 1 hour | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | Data-loss measurement |
| Object storage | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — product **OPEN** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Non-LocalFs restore |
| Event transport | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — vendor **OPEN** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | JetStream-or-equivalent health |
| Email | **UNKNOWN** | **CAN SATISFY** — SMTP direction, vendor **OPEN** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | TLS send + DPA |
| Identity | **NOT CURRENTLY DEMONSTRATED** | **PARTIALLY SATISFIABLE** (candidate IdP) — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Federated IdP |
| MFA | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | MFA enrolment |
| Secrets | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — product **OPEN** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Managed platform |
| Encryption | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | At-rest + TLS |
| TLS | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Certs + origin |
| DNS | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — FQDN **OPEN** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Failover design |
| Network security | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — PSA/PSC deferred — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Private DB path |
| Monitoring | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Metrics path |
| Logging | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Retention |
| Alerting | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | On-call routing |
| Patching | **NOT CURRENTLY DEMONSTRATED** (SEDMC OS/DB) | **CAN SATISFY** (platform) — **EVIDENCE REQUIRED** | **SHARED** — **EVIDENCE REQUIRED** | Patch policy |
| Capacity | **SIZING EVIDENCE REQUIRED** | **SIZING EVIDENCE REQUIRED** | **SIZING EVIDENCE REQUIRED** | Workload pack |
| Scaling | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | **CAN SATISFY** — **EVIDENCE REQUIRED** | Headroom test |
| Operations | **HUM-08 APPOINTMENT REQUIRED** | **HUM-08 APPOINTMENT REQUIRED** | **HUM-08 APPOINTMENT REQUIRED** | RACI |
| On-call | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | Roster |
| Vendor support | **UNKNOWN** | **CAN SATISFY** — H-198 **UNSENT** — **EVIDENCE REQUIRED** | **UNKNOWN** until providers named | Support policy |
| Geographic resilience | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** (H-169 direction) — **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY** if geo-split — **EVIDENCE REQUIRED** | Second failure domain |
| Data residency | **UNKNOWN** | **PARTIALLY SATISFIABLE** (Johannesburg direction; Belgium legal deferred) | **UNKNOWN** until geographies chosen | Legal pack |
| Legal / privacy | **UNKNOWN** | **UNKNOWN** (D12 not sent) | **UNKNOWN** | DPA / review |
| Procurement | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | Quotes + authority |
| Cost | **UNKNOWN** — **CURRENT PRICE / QUOTE REQUIRED** | **UNKNOWN** — **CURRENT PRICE / QUOTE REQUIRED** | **UNKNOWN** — **CURRENT PRICE / QUOTE REQUIRED** | TCO pack |
| Migration | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | Cutover plan |
| Lock-in | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | Exit plan |
| DR testing | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** | H-81 / measured RTO/RPO |

No cell is `VERIFIED` for Production plant. Application portability (H-200/E1-C) is code-level, **not** hosting verification.

---

## 7. Responsibility matrix

Values: `SEDMC` · `Provider` · `Shared`. Named people: **HUM-08 APPOINTMENT REQUIRED**.

| Responsibility | SEDMC-controlled | GCP | Hybrid |
| --- | --- | --- | --- |
| Infrastructure | SEDMC | Provider (platform) + SEDMC (account) = **Shared** | **Shared** (per C1–C6) |
| OS | SEDMC | Provider (Cloud Run/SQL) | **Shared** |
| Application | SEDMC — **HUM-08 APPOINTMENT REQUIRED** | SEDMC — **HUM-08 APPOINTMENT REQUIRED** | SEDMC — **HUM-08 APPOINTMENT REQUIRED** |
| PostgreSQL | SEDMC — **HUM-08 APPOINTMENT REQUIRED** (Database Owner) | **Shared** (D194-13 still **NOT YET APPOINTED**) | **Shared** |
| Backup | SEDMC | **Shared** | **Shared** |
| Restore | SEDMC | **Shared** | **Shared** |
| DR | SEDMC — DR Coordinator **NOT YET APPOINTED** | **Shared** — same appointment | **Shared** |
| Security | SEDMC — Security/Access Owner **NOT YET APPOINTED** | **Shared** | **Shared** |
| Secrets | SEDMC | **Shared** | **Shared** |
| Identity | SEDMC (corporate directory) | **Shared** | **Shared** |
| DNS | SEDMC | **Shared** | **Shared** |
| TLS | SEDMC | **Shared** | **Shared** |
| Monitoring | SEDMC | **Shared** | **Shared** |
| Incident response | SEDMC — **HUM-08 APPOINTMENT REQUIRED** | **Shared** | **Shared** |
| Capacity | SEDMC | **Shared** | **Shared** |
| Patching | SEDMC | **Shared** | **Shared** |
| Vendor escalation | SEDMC (facility/hardware **UNKNOWN**) | Provider channel (H-198 **UNSENT**) + SEDMC | **Shared** |
| 24/7 support | SEDMC — **NO DEDICATED NOC**; on-call **HUM-08 APPOINTMENT REQUIRED** | Same SEDMC on-call + provider support **EVIDENCE REQUIRED** | Same |

---

## 8. Cost structure (no invented prices)

Every unknown: **CURRENT PRICE / QUOTE REQUIRED**. No totals.

### Option A

Hardware; colocation/facility; bandwidth; electricity; cooling; storage; backup; secondary site; support; monitoring; security; replacement hardware; personnel; maintenance; DR.

### Option B

Cloud Run; Cloud SQL; Enterprise Plus / Advanced DR; storage; backup; network; logging; monitoring; secrets; identity; object storage; messaging; email; DNS; support; DR. Non-Google products (NATS, SMTP, IdP if not GCP) are additional **CURRENT PRICE / QUOTE REQUIRED** lines.

### Option C

Map each chosen C1–C6 split onto Option A lines (SEDMC-operated) plus Option B-style managed-service lines (provider-operated). Dual-site/dual-provider adds **CURRENT PRICE / QUOTE REQUIRED** for both legs. Personnel/HUM-08 remains on all patterns.

---

## 9. Implementation complexity (none complete)

| Stage | Option A | Option B | Option C |
| --- | --- | --- | --- |
| Preparation | Facility/legal/HUM-08; sizing | Account/billing evidence (H-198); legal Belgium; HUM-08 | Pattern selection; two contracts; HUM-08 |
| Provisioning | Buy/colo/build primary + DR | GCP project + services (**not authorized**) | Provision each side per pattern |
| Application deployment | Container/process on owned hosts | Cloud Run (**not authorized**) | Deploy to SEDMC and/or managed compute |
| Database migration | Install PG; migrate 001–n | Cloud SQL; migrate | Managed and/or self-hosted PG |
| Dependency configuration | NATS, SMTP, IdP, object store | Same adapters; products **OPEN** | Same |
| Security configuration | OS/IAM/secrets | GCP IAM + SEDMC IdP | Split IAM |
| DNS/TLS | SEDMC origin | SEDMC origin (FQDN **OPEN**) | Same |
| Backup | Local + off-site | Cloud SQL backup/PITR direction | Per owner in §5 |
| Restore validation | Drill | Drill | Drill on **both** legs |
| DR implementation | Second site + replication | Advanced DR replica (**not created**) | Per C3/C4/C1 |
| DR testing | Measured RTO/RPO | Measured RTO/RPO | Measured RTO/RPO |
| Production acceptance | H-200 20-item gate | Same gate | Same gate |
| Operational handover | HUM-08 | HUM-08 | HUM-08 |

Do **not** claim any stage is complete.

---

## 10. Evidence burden before P01 (all options)

Infrastructure inventory; capacity/sizing; PostgreSQL compatibility; backup; restore; DR; measured RTO; measured RPO; security; identity; secrets; object storage; messaging; email; DNS/TLS; monitoring; operational RACI; legal/privacy; commercial approval.

**Option A additionally:** commissioned plant + second-site proof.  
**Option B additionally:** GCP account/project evidence; H-198 responses **ACCEPTED** where applicable; Belgium legal if H-169 retained.  
**Option C additionally:** written split of RACI; both providers’ DPAs; failover across the split.

None of this evidence is complete.

---

## 11. 3-year / 5-year TCO category model (no numbers)

Insert verified quotes later. Categories for **each** option and horizon (Y3 / Y5):

| Category | Notes |
| --- | --- |
| Initial implementation | Build, migrate, professional services |
| Recurring infrastructure | Colo or cloud consumption |
| Recurring software/services | Licences, managed NATS/IdP/SMTP/object store |
| Personnel / operations | HUM-08 time; no invented FTEs |
| Backup / DR | Second site or Advanced DR class charges |
| Security | Certs, IdP, scanning |
| Support | Vendor + internal |
| Replacement / refresh | Hardware cycle (A) or reserved capacity (B/C) |
| Migration / switching cost | If leaving the chosen path |
| Exit / portability cost | Adapter-portable app still has data/egress cost **CURRENT PRICE / QUOTE REQUIRED** |

---

## 12. Owner/POA decision register (undecided)

| ID | Decision | H-201 |
| --- | --- | --- |
| D201-01 | Hosting model (A / B / C, and if C which pattern) | **NOT MADE** |
| D201-02 | Primary geography | **NOT MADE** |
| D201-03 | DR geography | **NOT MADE** (H-169 historical only) |
| D201-04 | Self-managed vs managed responsibility split | **NOT MADE** |
| D201-05 | Required operating coverage (on-call hours) | **NOT MADE** |
| D201-06 | RTO/RPO confirmation (keep ≤4h / ≤1h) | **NOT MADE** — values **preserved**, not re-approved here |
| D201-07 | Budget envelope | **NOT MADE** |
| D201-08 | Data-residency requirements | **NOT MADE** |
| D201-09 | Legal/privacy for cross-border DR | **NOT MADE** |
| D201-10 | Procurement authority | **NOT MADE** |
| D201-11 | Production implementation grant (P01) | **NOT GRANTED** |

---

## 13. Critical conclusion

H-201 does not select a Production architecture.

H-201 converts H-200 requirements into comparable infrastructure options for subsequent technical, commercial, legal, and Owner/POA decision-making.

No Production infrastructure exists as a result of H-201.

```text
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
H-198 SUBMISSION = UNSENT
```

---

## 14. Final status

```text
H-201 STATUS = COMPLETE — OPTIONS SPECIFIED; NO PATH SELECTED
No provider is selected by H-201
No Production infrastructure is represented as existing
RTO ≤ 4 hours
RPO ≤ 1 hour
```
