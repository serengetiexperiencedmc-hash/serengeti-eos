# E1-C — Production Readiness Gap Register

> **`ADDITIVE 2026-09-17: E1-B TRANSMISSION PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`INTERIM / PROVIDER EVIDENCE PENDING`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`NO RANKING`** · **`NO SEVERITY SCORES`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Production = NOT AUTHORIZED`**

**Date:** 2026-09-17.  
**Baseline:** [`adr-0006-e1-c-production-architecture-readiness-baseline.md`](adr-0006-e1-c-production-architecture-readiness-baseline.md)

**Closure status (2026-09-17 gap-closure stage):** **0 of 53 objectively closed.** All original GAP IDs remain. Classification: [`adr-0006-e1-c-gap-closure-classification.md`](adr-0006-e1-c-gap-closure-classification.md). Historical rows below are **not rewritten**.

Blocking level (not a score):

| Level | Meaning |
| --- | --- |
| **NON-BLOCKING** | Work can proceed; does not by itself stop RFI evaluation or Production packaging |
| **DECISION-BLOCKING** | Stops a named decision (e.g. ADR/DP close, class selection) until resolved |
| **PRODUCTION-BLOCKING** | Production must not be authorized while this gap remains |

“Can proceed while RFI is outstanding?” means SEDMC can **work the gap** without waiting for a provider reply — not that Production can go live.

---

## Persistence

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-PER-01 | Production must not use process-local `Store` as SoR | Gate B dual-path **DEV/TEST ONLY**; historical in-memory SoR | PostgreSQL-class SoR; per-request reads | Gate B CLOSED (Dev/Test); ADR-0003; persistence architecture | Hosting that supports PG | **YES** (Dev/Test hardening) | **PRODUCTION-BLOCKING** | No (principle known) | **YES** (Production PG offering) | Keep Gate B isolated; do not promote Dev PG to Production |
| GAP-PER-02 | Durable audit + outbox on critical writes | Target defined; Production NATS not implemented | Same transaction as business write; durable audit | Persistence architecture; ADR-0004 Dev stand-in | Event transport product | **YES** (Dev patterns) | **PRODUCTION-BLOCKING** | Event-bus product later | **YES** if managed bus used | Continue Dev outbox; do not select Production NATS |
| GAP-PER-03 | Document metadata vs bytes | Port exists; LocalFs Dev; Production adapter unselected | PG metadata + portable bytes | DocumentStorage; E1 object location | Object store + Legal location | **Partial** | **PRODUCTION-BLOCKING** | Object-store class | **YES** | Keep port; do not pick adapter |
| GAP-PER-04 | Optimistic lock / fail-closed persist | Gate B Dev; Production unproven | Enforced `version`; persist failure fails API | Gate B tests **DEV/TEST ONLY** | Production DB | **YES** | **PRODUCTION-BLOCKING** | No | **YES** (runtime on Production PG) | Retain fail-closed; no Production cutover |
| GAP-PER-05 | Gate C schema/migration remainder | 123 bounded on disposable Dev/Test historically; remainder **NOT AUTHORIZED** | Authorized Production schema path | Gate C backlog | Production authorization | **NO** for Production migrate | **PRODUCTION-BLOCKING** | **YES** — Gate C | No for Dev remainder design | Do not run Production migrations |

## Hosting

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-HST-01 | No Production host/region | Unselected | Selected **after** evidence | ADR-0006 proposed blocked; DP-0006 OPEN | E1-B + Legal + Owner | **YES** — this baseline | **DECISION-BLOCKING** and **PRODUCTION-BLOCKING** | **YES** | **YES** | Wait for responses; do not select |
| GAP-HST-02 | Compute/runtime product unnamed | Dev local | Named runtime | None Production | GAP-HST-01 | **YES** — requirements matrix | **PRODUCTION-BLOCKING** | **YES** | **YES** | Keep portable app assumption |
| GAP-HST-03 | CU-05/10/11 hosting scope | HOLD / SCOPE CLARIFICATION | Scope known before full RFI | E1-B4.5/B4.6 | Clarification send (not done) | **YES** — questions prepared | **DECISION-BLOCKING** for those CU-IDs | No for holding | **YES** if clarification sent | Do not full-RFI CU-10/11; do not transmit CU-05 |

## Data residency

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-RES-01 | Production jurisdiction unselected | Tanzania **PREFERRED BASELINE ONLY** | Approved jurisdiction | LA-06 preference ≠ approval | Owner + Legal + regions | **YES** — criteria | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | **YES** | **YES** | Do not treat preference as approval |
| GAP-RES-02 | E-08 Production data-flow map | Dev topology only | Actual Production map | L-05 deferred | Architecture | **NO** (needs topology) | **PRODUCTION-BLOCKING** | After topology | **YES** | Defer map; keep component inventory |
| GAP-RES-03 | E-09 transfer register | Empty | Paths registered | LA-10/11 | Destinations | **NO** | **PRODUCTION-BLOCKING** | Path-by-path | **YES** | Do not invent paths |
| GAP-RES-04 | Restricted+ failover site | Criterion only (LA-14) | Pre-assessed equivalent location if Restricted+ used | E-16 draft | What is stored + DR | **Partial** (policy) | **PRODUCTION-BLOCKING** if Restricted+ processed | **YES** (content census) | **YES** (copy locations) | Census can start internally |

## Legal / privacy

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-LEG-01 | E-01 entity not verified | Company-provided name only | Registry/extract | E-01 register | Company files | **YES** | **PRODUCTION-BLOCKING** | Company supply | No | Collect extract; do not use seed `Ltd` |
| GAP-LEG-02 | E-02 PDPC | NOT VERIFIED | Company-specific status artefact | Acquisition notes | PDPC / Legal files | **YES** | **PRODUCTION-BLOCKING** if required/unknown | Legal | No | External collection; do not claim status |
| GAP-LEG-03 | E-03 DPO | NOT ESTABLISHED | Appointment if required | Counsel is not DPO | Company | **YES** | **PRODUCTION-BLOCKING** if required; E1 combined incomplete | **YES** | No | Do not appoint via this register |
| GAP-LEG-04 | Combined Legal/DPO | INCOMPLETE | Both complete for E1 close | Attestation package | GAP-LEG-03 | **Partial** | **DECISION-BLOCKING** for E1 | **YES** | No | Keep Legal Counsel complete as-is |
| GAP-LEG-05 | E-07 contracts/DPAs | None in repo | Production vendor contracts | Absent | Named provider | **YES** for **existing** client paper | **PRODUCTION-BLOCKING** for vendors | Legal | **YES** after provider | Collect existing paper; do not invent DPAs |
| GAP-LEG-06 | L-17 connected services | Deferred | Each service assessed | LA-17 | Topology | **NO** | **PRODUCTION-BLOCKING** | Legal after topology | **YES** | Do not assume Tanzania app = Tanzania processing |
| GAP-LEG-07 | E-12 privacy notice | Draft | Complete after entity/DPO/recipients | Skeleton | E-01/E-03/providers | **Partial** | **PRODUCTION-BLOCKING** to publish | Legal | Recipients | Keep draft unpublished |
| GAP-LEG-08 | Kenya/GDPR/UK GDPR applicability | Conditional rules adopted | Fact-specific determination | LA-03/04; E-05/E-18 drafts | Census + offering facts | **YES** census | **DECISION-BLOCKING** for those regimes | Legal | Paths later | Census from company records |

## Identity

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-IDN-01 | Production IdP | ADR-0013 OPEN blocked Production | Named OIDC IdP | Dev local issuer | Company directory | **YES** — discover corporate IdP | **PRODUCTION-BLOCKING** | **YES** | **YES** if IdP is hosted | Inventory company IdP; do not select EOS host as IdP by default |
| GAP-IDN-02 | MFA | Required for support; Production admin **UNVERIFIED** | MFA on Production privileged access | Q-I-07 company answer | IdP | **YES** — policy | **PRODUCTION-BLOCKING** | Scope | **YES** | Keep requirement; do not claim implemented |

## Secrets

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-SEC-01 | ADR-0012 secrets platform | Blocked UAT/Production | Named secrets/KMS; rotation owners | Dev env files | ADR-0006 then 0012 | **YES** — options list only | **PRODUCTION-BLOCKING** | **YES** | **YES** | No secrets in git; no product selection |
| GAP-SEC-02 | Backup encryption keys | Unselected | Encrypted backups; key location known | ADR-0011 intent | KMS | **Partial** | **PRODUCTION-BLOCKING** | Key ownership | **YES** | Do not invent key locations |

## Security

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-SEU-01 | WAF/CDN | Not selected | Assess if used (LA-17) | None | Topology | **YES** — whether-needed note | **PRODUCTION-BLOCKING** if used and unassessed | **YES** (include or not) | **YES** | Do not assume edge products |
| GAP-SEU-02 | Encryption at rest / in transit | Unverified Production | Required envelope | None Production | Provider | **YES** — requirements | **PRODUCTION-BLOCKING** | No | **YES** | Ask via E1-B; do not assume |
| GAP-SEU-03 | Support access controls | MFA + session logs **required** | Implemented | Q-I-07/08 | Provider support model | **YES** — requirements | **PRODUCTION-BLOCKING** | No | **YES** | Keep as RFI evaluation criteria |
| GAP-SEU-04 | Government access / legal process | Unknown | Disclosed and assessed | None | Provider | **NO** for facts | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | Legal | **YES** | Wait for PE/Q answers |

## Network

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-NET-01 | Production network/DNS/TLS | TBD | Isolated Production network; DNS; TLS | None | Host | **YES** — requirements | **PRODUCTION-BLOCKING** | DNS owner | **YES** | No Production DNS change |
| GAP-NET-02 | Hybrid/cloud-connect | CU-05 HOLD | Only if hybrid selected later | E1-B4 connectivity ≠ hosting | Scope clarification | **YES** — hold | **DECISION-BLOCKING** for CU-05 | Scope | **YES** if later in scope | No SEND to CU-05 |

## Observability

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-OBS-01 | Production logging/monitoring/alerting | Not selected | Logs, metrics, alerts for persist/backup/restore | Dev logs ≠ Production | Provider + ops | **YES** — requirements | **PRODUCTION-BLOCKING** | On-call | **YES** | Define signals; do not pick product |
| GAP-OBS-02 | Audit log durability | Target PG; Dev historically memory | Durable audit | Gate B Dev | Persistence | **YES** | **PRODUCTION-BLOCKING** | Retention | Location | Continue Dev durable audit |

## Backup

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-BKP-01 | Production backup product | TBD; ADR-0011 Dev evidence register only | Named product; encrypted; remote copy; 19:00 EAT future schedule | Lab dumps excluded | Provider + Legal location | **YES** — requirements | **PRODUCTION-BLOCKING** | **YES** (product later) | **YES** | Do not treat lab dump as Production backup |
| GAP-BKP-02 | WAL/PITR | Candidate; not selected | If adopted, location/granularity disclosed | E2 lab PARTIAL | Architecture | **YES** — keep as candidate | **PRODUCTION-BLOCKING** relative to zero-loss business rule | **YES** (adopt PITR?) | **YES** | Do not claim RPO=0 from daily backup |

## Recovery

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-REC-01 | Application recovery not demonstrated | Lab synthetic only | Restore of real EOS Production state | E2 PARTIAL | Durable Production SoR | **NO** for Production proof | **PRODUCTION-BLOCKING** | Accept measured RTO | **YES** | Do not treat lab timings as Production RTO |
| GAP-REC-02 | Technical RTO/RPO unapproved | Business ≤3h/≤4h; zero-loss ≠ RPO=0 | Measured technical values | Company position; E2 distinctions | Provider tests | **YES** — keep distinctions | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | **YES** | **YES** | Preserve business vs technical split |
| GAP-REC-03 | BCM sequence dual records | Company-response sequence vs historical BCM pack | Reconciled sequence (CD-01) | Company-response; historical pack | Owner | **YES** | **DECISION-BLOCKING** | **YES** | No | Do not rewrite historical pack here |

## DR

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-DR-01 | DR site unselected | Unselected; warm standby not automatically legally mandatory | If used: assessed jurisdiction; Restricted+ rule | LA-08/09/14 | Architecture | **YES** — criteria | **PRODUCTION-BLOCKING** if DR used without assessment | **YES** | **YES** | Do not invent DR region |
| GAP-DR-02 | Failover/failback procedures | None | Documented; tested | None | GAP-DR-01 | **Partial** (templates) | **PRODUCTION-BLOCKING** if DR in topology | Ops owner | **YES** | No Production failover test |

## Deployment

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-DEP-01 | Production/UAT deploy unauthorized | Not authorized | Approved DP-0006 + runbook | DP-0006 OPEN | ADR-0006 | **YES** — runbook skeleton only | **PRODUCTION-BLOCKING** | **YES** | Host facts | Do not deploy |
| GAP-DEP-02 | No Production IaC lock | Rule: do not lock via Terraform/K8s | Portable until DP-0006 approved | DP-0006 | Hosting decision | **YES** | **DECISION-BLOCKING** if someone implements a cloud | **YES** | Later | Do not provision |

## Infrastructure

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-INF-01 | Production credentials/data | None allowed | Isolated Production; no live PII in Dev | Increment 0 local only | Authorization | **YES** — keep isolation | **PRODUCTION-BLOCKING** if violated | No | No | Do not create Production credentials |
| GAP-INF-02 | Email product | Dev only | Production email | Dev SES ≠ Production | Subprocessor | **YES** — requirements | **PRODUCTION-BLOCKING** | Product | **YES** | Do not use Dev email as Production |

## Operations

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-OPS-01 | Production operational ownership | TBD (E1-B sender ≠ Production ops) | Named restore/on-call/backup owners | None | Company | **YES** | **PRODUCTION-BLOCKING** | **YES** | Support model | Assign owners on paper; no go-live |
| GAP-OPS-02 | IR not Production-ready | E-15 draft | Production IR with provider notify | Draft | DPO/Legal | **YES** — draft | **PRODUCTION-BLOCKING** | **YES** | Provider IR contacts | Keep draft |
| GAP-OPS-03 | Support SLA | Unknown | Agreed hours vs EAT Commercial RTO | None | Provider | **NO** for numbers | **PRODUCTION-BLOCKING** | **YES** | **YES** | Wait for quotes/SLA text |

## Governance

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-GOV-01 | ADR-0006 unapproved | proposed — blocked | Approved after evidence | ADR-0006 | E1 pack | **YES** — this baseline | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | **YES** | **YES** | Do not update ADR status |
| GAP-GOV-02 | DP-0006 unapproved | OPEN; option not selected | Approved | DP-0006 | Same | **YES** | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | **YES** | **YES** | Do not close DP-0006 |
| GAP-GOV-03 | E1 not approved | BLOCKED missing evidence | Evidence + Owner | E1-C01 | Legal/DPO + architecture | **YES** — collection | **DECISION-BLOCKING** | **YES** | **YES** | Do not close E1 |
| GAP-GOV-04 | E1-B not transmitted | 0/9 full-RFI; 0/2 clarification | Human send if company executes | E1-B6; routing reconciliation | HR-04 mailbox | **YES** — execution checklist | **DECISION-BLOCKING** for evaluation | Send is human | N/A (send) | Do not send from Cursor |
| GAP-GOV-05 | DP-0006 vs E1-A C/D letter swap | Documented non-blocking | Consistent letters at approval time | E1-A nomenclature note | Approval pack | **YES** | **NON-BLOCKING** | Clarify at decision pack | No | Record in decision pack later; do not rewrite DP-0006 now |

## Commercial / TCO

| GAP ID | Description | Current state | Required state | Evidence | Dependency | Can proceed while RFI outstanding? | Blocking level | Human decision required? | Provider evidence required? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-TCO-01 | No quotes | QUOTE REQUIRED categories | Indicative quotes; no invented budget | Company-response TCO structure | E1-B send | **YES** — structure | **DECISION-BLOCKING** / **PRODUCTION-BLOCKING** | **YES** (budget) | **YES** | Do not fabricate costs |
| GAP-TCO-02 | Currency/tax/exit fees unknown | Unknown | Stated in quotes | None | Provider | **NO** for numbers | **DECISION-BLOCKING** | Finance | **YES** | Wait for Q-N answers |

---

## Counts (by category)

| Category | Gap IDs | Count |
| --- | --- | --- |
| Persistence | GAP-PER-01–05 | 5 |
| Hosting | GAP-HST-01–03 | 3 |
| Data residency | GAP-RES-01–04 | 4 |
| Legal/privacy | GAP-LEG-01–08 | 8 |
| Identity | GAP-IDN-01–02 | 2 |
| Secrets | GAP-SEC-01–02 | 2 |
| Security | GAP-SEU-01–04 | 4 |
| Network | GAP-NET-01–02 | 2 |
| Observability | GAP-OBS-01–02 | 2 |
| Backup | GAP-BKP-01–02 | 2 |
| Recovery | GAP-REC-01–03 | 3 |
| DR | GAP-DR-01–02 | 2 |
| Deployment | GAP-DEP-01–02 | 2 |
| Infrastructure | GAP-INF-01–02 | 2 |
| Operations | GAP-OPS-01–03 | 3 |
| Governance | GAP-GOV-01–05 | 5 |
| Commercial/TCO | GAP-TCO-01–02 | 2 |
| **Total** | | **53** |

No severity scores. No ranking of gaps against each other.

---

## Additive — 2026-09-17 deployment / infrastructure / governance readiness sprint

Companion: [`adr-0006-e1-c-deployment-infrastructure-governance-readiness-sprint.md`](adr-0006-e1-c-deployment-infrastructure-governance-readiness-sprint.md). Historical rows **above are not rewritten**.

| GAP ID | Previous status | New status | Remaining dependency |
| --- | --- | --- | --- |
| GAP-DEP-02 | CAN PROGRESS NOW | **IMPLEMENTATION/TESTING** (open) | DP-0006 OPEN; no Production IaC lock |
| GAP-INF-01 | CAN PROGRESS NOW | **IMPLEMENTATION/TESTING** (open) | Isolated Production does not exist |
| GAP-GOV-05 | CAN PROGRESS NOW | **HUMAN EVIDENCE/DECISION** (open) | Consistent C/D letters at approval pack. Not RFI send (GAP-GOV-04) |

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 E1 hosting decision-pack preparation

Companions: nomenclature reconciliation, hosting decision matrix, decision-pack readiness audit. Historical rows **above are not rewritten**.

| GAP ID | Status | Note |
| --- | --- | --- |
| GAP-GOV-05 | **HUMAN EVIDENCE/DECISION** (open) | Canonical live letters prepared (E1-A/E1-B). DP-0006 file **unchanged**. Owner confirmation still required. **Not CLOSED** |

**SEDMC is NOT Production Ready.**

