# E1-C — Gap Closure Classification

> **`ADDITIVE 2026-09-17: E1-B TRANSMISSION PAUSED / SUPERSEDED AS CURRENT NEXT ACTION`**  
> **`E1-C GAP CLOSURE & EVIDENCE PREPARATION`**  
> **`53/53 GAPS ACCOUNTED FOR`** · **`0 OBJECTIVELY CLOSED`**  
> **`NO RANKING`** · **`NO SCORES`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`NO PRODUCTION AUTHORIZATION`**  
> **`E1-B OPEN IN PARALLEL — 9 / 2 / 1 ; 0 TRANSMISSIONS`**

**Date:** 2026-09-17.  
**Source:** [`adr-0006-e1-c-production-readiness-gap-register.md`](adr-0006-e1-c-production-readiness-gap-register.md) (unmodified row text; this file adds classification only).

Primary classes (exactly one per gap):

| Class | Meaning |
| --- | --- |
| **A** | CAN PROGRESS NOW — existing repo evidence, implementation, or documentation |
| **B** | HUMAN EVIDENCE / DECISION REQUIRED |
| **C** | PROVIDER EVIDENCE REQUIRED |
| **D** | IMPLEMENTATION / TESTING REQUIRED |
| **E** | PRODUCTION GATE |

Creating a preparation document is **not** closure. **Closed this stage: none.**

---

## Counts

| Class | Count | GAP IDs |
| --- | --- | --- |
| A | **3** | GAP-GOV-05, GAP-DEP-02, GAP-INF-01 |
| B | **16** | GAP-LEG-01, GAP-LEG-02, GAP-LEG-03, GAP-LEG-04, GAP-LEG-07, GAP-LEG-08, GAP-IDN-01, GAP-SEC-01, GAP-RES-01, GAP-REC-03, GAP-OPS-01, GAP-OPS-02, GAP-GOV-01, GAP-GOV-02, GAP-GOV-03, GAP-GOV-04 |
| C | **20** | GAP-HST-01, GAP-HST-02, GAP-HST-03, GAP-RES-04, GAP-LEG-05, GAP-SEU-01, GAP-SEU-02, GAP-SEU-03, GAP-SEU-04, GAP-OBS-01, GAP-BKP-01, GAP-BKP-02, GAP-DR-01, GAP-INF-02, GAP-OPS-03, GAP-TCO-01, GAP-TCO-02, GAP-PER-03, GAP-NET-02, GAP-SEC-02 |
| D | **4** | GAP-PER-02, GAP-IDN-02, GAP-OBS-02, GAP-DR-02 |
| E | **10** | GAP-PER-01, GAP-PER-04, GAP-PER-05, GAP-RES-02, GAP-RES-03, GAP-LEG-06, GAP-NET-01, GAP-REC-01, GAP-REC-02, GAP-DEP-01 |
| Total | **53** | 3+16+20+4+10=53 |

Secondary dependencies may exist (e.g. a C-class gap also needs a later human decision). They are recorded in columns; they do not create a second primary class.

---

## Classification table (all 53)

Legend: Can proceed now? = work the gap without a provider reply. Production-only? = cannot close until Production infra/authorization.

| GAP ID | Category | Current state | Required state | Class | Evidence currently available | Missing evidence | Dependency | Can proceed now? | Human decision required? | Provider evidence required? | Implementation required? | Testing required? | Production-only? | Proposed next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-PER-01 | Persistence | Gate B dual-path DEV/TEST ONLY | PostgreSQL-class Production SoR | **E** | Gate B CLOSED; ADR-0003 | Production PG instance; no memory SoR in Production | Hosting | Dev/Test only | No (principle) | YES | YES on Production | YES | **YES** | Do not promote Dev PG |
| GAP-PER-02 | Persistence | Target defined; Production NATS not implemented | Txn audit+outbox | **D** | Persistence architecture; ADR-0004 stand-in | Production event transport; durable audit proof | Event product | Partial Dev | Event-bus later | If managed bus | **YES** | YES | Later | Continue Dev outbox; no product pick |
| GAP-PER-03 | Persistence | LocalFs; port exists | PG metadata + Production object store | **C** | DocumentStorage port | Production adapter; location | Legal location | Partial | Object-store class | **YES** | Adapter later | YES | YES | Do not pick adapter |
| GAP-PER-04 | Persistence | Gate B fail-closed Dev | Same on Production DB | **E** | Gate B tests DEV/TEST | Production runtime proof | Production DB | Dev only | No | YES | YES | **YES** | **YES** | No Production cutover |
| GAP-PER-05 | Persistence | Gate C remainder NOT AUTHORIZED | Authorized Production schema path | **E** | Gate C backlog | Production migrate authorization | Owner | Design only | **YES** Gate C | No for design | YES if authorized | YES | **YES** | Do not migrate Production |
| GAP-HST-01 | Hosting | Unselected | Selected after evidence | **C** | ADR/DP OPEN | Region/offering | Legal + Owner | Criteria yes | **YES** | **YES** | After selection | After | YES | Do not select |
| GAP-HST-02 | Hosting | Dev local | Named runtime | **C** | None Production | Runtime offering | GAP-HST-01 | Requirements yes | **YES** | **YES** | After | After | YES | Keep portable app |
| GAP-HST-03 | Hosting | HOLD / SCOPE CLARIFICATION | Scope before full RFI | **C** | E1-B4.5/B4.6 questions | Clarification replies | Human send | Questions yes | Send is human | **YES** if sent | No | No | No | Do not full-RFI CU-10/11; no CU-05 send |
| GAP-RES-01 | Data residency | Preferred baseline only | Approved jurisdiction | **B** | LA-06 preference | Owner/Legal decision + regions | Provider regions | Criteria yes | **YES** | YES (regions) | No | No | YES | Preference ≠ approval |
| GAP-RES-02 | Data residency | Dev topology | Production data-flow map | **E** | Component inventory | Actual Production flows | Architecture | **NO** | After topology | YES | No | No | **YES** | Defer map |
| GAP-RES-03 | Data residency | Empty transfer register | Paths registered | **E** | LA-10/11 rules | Actual destinations | Topology | **NO** | Path-by-path | YES | No | No | **YES** | Do not invent paths |
| GAP-RES-04 | Data residency | LA-14 criterion only | Pre-assessed Restricted+ location | **C** | E-16 draft | Copy locations; content census | DR + census | Census yes | Census **YES** | **YES** | No | If DR used | If used | Census internally; wait locations |
| GAP-LEG-01 | Legal | Company-provided name | Registry extract | **B** | E-01 register | BRELA/extract | Company files | **YES** | Company supply | No | No | No | Blocks Production | Collect extract |
| GAP-LEG-02 | Legal | PDPC NOT VERIFIED | Company-specific artefact | **B** | Acquisition notes | PDPC status artefact | Legal files | **YES** | Legal | No | No | No | If required | Do not claim status |
| GAP-LEG-03 | Legal | DPO NOT ESTABLISHED | Appointment if required | **B** | Counsel ≠ DPO | Appointment or non-appointment decision | Company | **YES** | **YES** | No | No | No | If required | Do not appoint here |
| GAP-LEG-04 | Legal | Combined Legal/DPO INCOMPLETE | Both complete | **B** | Legal Counsel COMPLETE | DPO component | GAP-LEG-03 | Partial | **YES** | No | No | No | E1 close | Keep Counsel complete |
| GAP-LEG-05 | Legal | No contracts in repo | Production vendor DPAs | **C** | None | Vendor paper; existing client paper is B-harvest | Named provider | Existing paper yes | Legal | **YES** vendors | No | No | YES vendors | Harvest existing; no invented DPA |
| GAP-LEG-06 | Legal | L-17 deferred | Each connected service assessed | **E** | LA-17 rule | Topology | Architecture | **NO** | Legal after | YES | No | No | **YES** | Tanzania app ≠ all processing TZ |
| GAP-LEG-07 | Legal | Privacy notice draft | Complete notice | **B** | Skeleton | Entity, DPO, recipients | E-01/E-03/providers | Partial | Legal | Recipients | No | No | To publish | Keep unpublished |
| GAP-LEG-08 | Legal | Conditional rules | Fact-specific applicability | **B** | LA-03/04; E-05/18 drafts | Census | Company records | **YES** census | Legal | Paths later | No | No | Decision | Census from records |
| GAP-IDN-01 | Identity | ADR-0013 OPEN | Named OIDC IdP | **B** | Dev local-password-dev | Which corporate IdP exists | Company IT | **YES** discover | **YES** | If hosted | Later | Later | YES | Inventory; do not select host as IdP |
| GAP-IDN-02 | Identity | MFA required; not in EOS | MFA on privileged Production access | **D** | Q-I-07 requirement | Implementation; IdP MFA | IdP | Policy yes | Scope | YES support MFA | **YES** | YES | YES | Do not claim implemented |
| GAP-SEC-01 | Secrets | ADR-0012 blocked UAT/Prod | Named KMS/secrets; rotation owners | **B** | EnvSecretsProvider Dev | Product choice | ADR-0006 then 0012 | Options list yes | **YES** | YES | After | After | YES | No product selection |
| GAP-SEC-02 | Secrets | Backup keys unselected | Encrypted backups; key location | **C** | ADR-0011 intent | Key location; product | KMS | Partial | Key ownership | **YES** | After | After | YES | Do not invent locations |
| GAP-SEU-01 | Security | WAF/CDN unselected | Assess if used | **C** | None | Whether in topology; offering | Topology | Note yes | Include/not | **YES** | After | After | If used | Do not assume edge |
| GAP-SEU-02 | Security | Unverified Production encryption | At rest / in transit envelope | **C** | None Production | Provider controls | Provider | Requirements yes | No | **YES** | After | After | YES | Do not assume |
| GAP-SEU-03 | Security | MFA+session logs required | Implemented on provider support | **C** | Q-I-07/08 | Provider model | Support | Criteria yes | No | **YES** | After | After | YES | RFI evaluation criteria |
| GAP-SEU-04 | Security | Government access unknown | Disclosed and assessed | **C** | None | Provider disclosure | Legal | **NO** facts | Legal | **YES** | No | No | YES | Wait PE/Q |
| GAP-NET-01 | Network | Production DNS/TLS TBD | Isolated Production network | **E** | None | Host network | Host | Requirements yes | DNS owner | YES | YES | YES | **YES** | No Production DNS change |
| GAP-NET-02 | Network | CU-05 HOLD | Connect only if hybrid later | **C** | E1-B4 connectivity ≠ hosting | Scope replies if ever in set | Architecture | Hold yes | Scope | **YES** if later | No | No | If hybrid | No SEND CU-05 |
| GAP-OBS-01 | Observability | Products unselected | Prod logs/metrics/alerts | **C** | Dev logger ≠ Production | Offering; on-call | Ops | Requirements yes | On-call | **YES** | After | After | YES | Do not pick product |
| GAP-OBS-02 | Observability | Target PG audit; Dev historical memory | Durable Production audit | **D** | Gate B Dev | Production durability; retention | Persistence | Dev yes | Retention | Location | **YES** | YES | YES | Continue Dev durable audit |
| GAP-BKP-01 | Backup | ADR-0011 evidence register only | Named encrypted backup product | **C** | Lab dumps excluded | Product; location | Legal location | Requirements yes | Product later | **YES** | After | Restore tests | YES | Lab ≠ Production backup |
| GAP-BKP-02 | Backup | PITR candidate | Disclose WAL if adopted | **C** | E2 lab PARTIAL | WAL location/granularity | Architecture | Candidate yes | Adopt PITR? | **YES** | After | YES | YES | Do not claim RPO=0 |
| GAP-REC-01 | Recovery | Lab synthetic only | Restore real EOS Production state | **E** | E2 PARTIAL | Production SoR + restore | Durable Production SoR | **NO** Production proof | Accept RTO | YES | YES | **YES** | **YES** | Lab timings ≠ Production RTO |
| GAP-REC-02 | Recovery | Business targets known; technical unapproved | Measured technical RTO/RPO | **E** | Company position; E2 distinctions | Production measurements | Tests | Distinctions yes | **YES** accept | YES | YES | **YES** | **YES** | Keep business ≠ technical |
| GAP-REC-03 | Recovery | Two BCM sequences | Reconciled sequence | **B** | Owner pack + company-response; CD-01 | Owner decision which governs | Owner | **YES** investigate | **YES** | No | No | No | Decision | See BCM reconciliation artifact; do not invent order |
| GAP-DR-01 | DR | Unselected | Assessed jurisdiction if used | **C** | LA-08/09/14 | Region | Architecture | Criteria yes | **YES** | **YES** | After | If used | If used | Do not invent DR region |
| GAP-DR-02 | DR | No procedures | Documented and tested failover/failback | **D** | None | Runbooks; tests | GAP-DR-01 | Templates yes | Ops owner | YES | **YES** | **YES** | If in topology | No Production failover test |
| GAP-DEP-01 | Deployment | UAT/Production not authorized | Approved DP-0006 + runbook | **E** | DP-0006 OPEN | Approval | ADR-0006 | Skeleton yes | **YES** | Host facts | After | After | **YES** | Do not deploy |
| GAP-DEP-02 | Deployment | Do not lock IaC | Portable until DP-0006 approved | **A** | DP-0006 rule | Approval still open | Hosting decision | **YES** maintain | Later lock | Later | Must not provision now | No | After approval | Do not provision; rule already in force |
| GAP-INF-01 | Infrastructure | No Production credentials/data allowed | Isolated Production; no live PII in Dev | **A** | Increment 0 local; ADR-0006 | Production isolation when it exists | Authorization | **YES** keep isolation | No | No | Must not create Prod creds | No | Production isolation later | Do not create Production credentials |
| GAP-INF-02 | Infrastructure | Dev email only | Production email | **C** | Dev SES ≠ Production | Product; subprocessor | Legal | Requirements yes | Product | **YES** | After | After | YES | Do not use Dev as Production email |
| GAP-OPS-01 | Operations | Ownership TBD | Named restore/on-call/backup owners | **B** | None | Named humans/roles | Company | **YES** RACI draft | **YES** | Support model | No | No | YES | Assign on paper; no go-live |
| GAP-OPS-02 | Operations | E-15 IR draft | Production IR + provider notify | **B** | Draft | Owner; DPO; provider contacts | Legal | Draft yes | **YES** | Contacts | After | After | YES | Keep draft |
| GAP-OPS-03 | Operations | SLA unknown | Hours vs EAT Commercial RTO | **C** | None | SLA text | Provider | **NO** numbers | **YES** | **YES** | No | No | YES | Wait quotes |
| GAP-GOV-01 | Governance | ADR-0006 unapproved | Approved after evidence | **B** | ADR proposed blocked | Owner decision + pack | E1 pack | Prepare yes | **YES** | YES | No | No | YES | Do not update ADR status |
| GAP-GOV-02 | Governance | DP-0006 OPEN | Approved | **B** | DP-0006 | Owner | Same | Prepare yes | **YES** | YES | No | No | YES | Do not close DP-0006 |
| GAP-GOV-03 | Governance | E1 BLOCKED | Evidence + Owner | **B** | E1-C01 | Legal/DPO + architecture | Gaps | Collect yes | **YES** | YES | No | No | YES | Do not close E1 |
| GAP-GOV-04 | Governance | 0 transmissions | Human send if company executes | **B** | Package READY / NOT SENT | Send artefacts | HR-04 mailbox | Checklist yes | **YES** send | N/A | No | No | No | Cursor does not send |
| GAP-GOV-05 | Governance | C/D letter swap documented | Consistent letters at approval | **A** | E1-A note; E1-C GAP-GOV-05 | Decision-pack wording | Approval pack | **YES** | Clarify at pack | No | No | No | At approval | Do not rewrite DP-0006 now |
| GAP-TCO-01 | TCO | No quotes | Indicative quotes; no invented budget | **C** | TCO structure | Quotes | E1-B send | Structure yes | Budget **YES** | **YES** | No | No | YES | Do not fabricate costs |
| GAP-TCO-02 | TCO | Currency/tax/exit unknown | Stated in quotes | **C** | None | Quote fields | Provider | **NO** numbers | Finance | **YES** | No | No | Decision | Wait Q-N |

---

## Phase 2 — Immediate closure work (Class A)

| GAP ID | Objectively closed? | Why |
| --- | --- | --- |
| GAP-GOV-05 | **NO** | Letters remain inconsistent until an approval pack. Documentation exists; that is advancement, not closure. |
| GAP-DEP-02 | **NO** | The standing “do not lock Production IaC” rule is in force (DP-0006). The gap remains open until DP-0006 is approved or the portability window ends by authorized decision. |
| GAP-INF-01 | **NO** | Dev/Test isolation is documented (Increment 0; no Production data). Required state includes **isolated Production**, which does not exist. |

**Closed this stage: 0.**  
**Materially advanced still open:** GAP-GOV-05, GAP-DEP-02, GAP-INF-01, plus Class D/E items prepared by the security assessment, recovery validation plan, and operations readiness plan (preparation ≠ closure).

---

## Additive — 2026-09-17 live reconciliation (do not rewrite rows above)

Companion: [`adr-0006-e1-c-provider-neutral-readiness-advancement-record.md`](adr-0006-e1-c-provider-neutral-readiness-advancement-record.md).

The table above is the **gap-closure preparation** snapshot (0 objectively closed **in that stage**). Live status after the Owner 2026-09-17 decision and provider-neutral Dev/Test advancement:

| GAP ID | Live status | Note |
| --- | --- | --- |
| GAP-REC-03 | **CLOSED** | S2 / CD-01 / HUM-07 formally confirmed. Technical RTO/RPO remain GAP-REC-01/02 **OPEN** |
| All other GAP IDs | **OPEN** | See advancement record §4. Dev/Test outbox/observability work does **not** close GAP-PER-02 or GAP-OBS-01 for Production |

**SEDMC is not Production Ready.** Frozen E1-B materials unmodified.

---

## Additive — 2026-09-17 implementation & testing closure sprint

Companion: [`adr-0006-e1-c-implementation-testing-closure-sprint.md`](adr-0006-e1-c-implementation-testing-closure-sprint.md). Historical rows **above are not rewritten**.

| GAP ID | Live status after this sprint | Note |
| --- | --- | --- |
| GAP-PER-02 | **IMPLEMENTATION/TESTING** | Same-TX audit+outbox advanced in Dev/Test (CRM + generic I4). **Not CLOSED** |
| GAP-IDN-02 | **PROVIDER EVIDENCE** | Local IdP fail-closed in Production-like env. MFA **not** implemented |
| GAP-OBS-02 | **IMPLEMENTATION/TESTING** | Durable Dev/Test audit in TX; Production durability unproven |
| GAP-DR-02 | **IMPLEMENTATION/TESTING** | SQL-logical disposable harness. No Production failover test |
| GAP-DEP-02 / GAP-INF-01 / GAP-GOV-05 | **CAN PROGRESS NOW** | Unchanged; **not CLOSED** |

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 deployment / infrastructure / governance readiness sprint

Companion: [`adr-0006-e1-c-deployment-infrastructure-governance-readiness-sprint.md`](adr-0006-e1-c-deployment-infrastructure-governance-readiness-sprint.md). Historical rows **above are not rewritten**. Frozen E1-B hashes **re-verified**. **0 transmissions.** Production **NOT APPROVED**. **No IaC lock.**

| GAP ID | Previous live status | New live status | Evidence | Implementation | Tests | Remaining dependency |
| --- | --- | --- | --- | --- | --- | --- |
| GAP-DEP-02 | **CAN PROGRESS NOW** | **IMPLEMENTATION/TESTING** | Deployment audit; CI `npm ci` + build; API `start` → `dist/main.js`; graceful shutdown | Provider-neutral only | `e1-c-deployment-config.test.ts` | DP-0006 still OPEN; do not lock Terraform/K8s. **Not CLOSED** |
| GAP-INF-01 | **CAN PROGRESS NOW** | **IMPLEMENTATION/TESTING** | Compose classified Dev/Test; `.env.example` placeholders; fail-closed Production-like config | No Production creds created | Same | Isolated Production **does not exist**. **Not CLOSED** |
| GAP-GOV-05 | **CAN PROGRESS NOW** | **HUMAN EVIDENCE/DECISION** | C/D letter mapping table recorded for the future approval pack. SEND authorization **does not** close this gap | DP-0006 **not** rewritten | N/A (governance) | Consistent letters **at approval time**. GAP-GOV-04 remains **0 transmissions**. **Not CLOSED** |

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 E1 hosting decision-pack preparation

Companions: [`adr-0006-e1-hosting-class-nomenclature-reconciliation.md`](adr-0006-e1-hosting-class-nomenclature-reconciliation.md), [`adr-0006-e1-hosting-decision-matrix.md`](adr-0006-e1-hosting-decision-matrix.md), [`adr-0006-e1-hosting-decision-pack-readiness-audit.md`](adr-0006-e1-hosting-decision-pack-readiness-audit.md). Historical rows **above are not rewritten**. Frozen E1-B hashes **re-verified**. **0 transmissions.** DP-0006 / ADR-0006 **not rewritten**. **No architecture selected.**

| GAP ID | Live status | Note |
| --- | --- | --- |
| GAP-GOV-05 | **HUMAN EVIDENCE/DECISION** | Live canonical letters **prepared** as E1-A / frozen E1-B (C = Tanzania colo/local, D = Hybrid). DP-0006 C/D assignment **superseded as live nomenclature** only. Owner confirmation still required. **Not CLOSED** |

**SEDMC is NOT Production Ready.**

---

## Additive — 2026-09-17 SEDMC-owned infrastructure direction

Companions: [`adr-0006-e1-c-sedmc-owned-infrastructure-direction.md`](adr-0006-e1-c-sedmc-owned-infrastructure-direction.md), [`adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md`](adr-0006-e1-c-sedmc-owned-infrastructure-requirements-framework.md). Historical classification rows **not rewritten**. E1-B pack **frozen**. **0 transmissions.** Preferred direction **does not** close architecture or Production gaps. DP-0006 **OPEN**. E1-B transmission **paused** as current next action.

**SEDMC is NOT Production Ready.**


