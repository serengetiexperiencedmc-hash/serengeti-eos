# E1-C — Production Architecture & Readiness Baseline

> **`E1-C PRODUCTION ARCHITECTURE & READINESS BASELINE COMPLETE — INTERIM / PROVIDER EVIDENCE PENDING.`**  
> **`E1-B PROVIDER EVIDENCE COLLECTION REMAINS OPEN IN PARALLEL.`**  
> **`INTERIM / PRE-PROVIDER-EVIDENCE`** · **`PROVIDER-NEUTRAL`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`ADR-0006 = OPEN / proposed — blocked for Production`**  
> **`DP-0006 = OPEN — NOT APPROVED`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Legal Counsel = COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`** · **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`PDPC = NOT VERIFIED`** · **`E-01 = NOT VERIFIED`**  
> **`Production / UAT / Migration / Deployment / Contracting = NOT AUTHORIZED`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**  
> **`ASSUMPTION ≠ FACT`** · **`MARKETING ≠ EVIDENCE`** · **`LAB ≠ PRODUCTION`**

**Date:** 2026-09-17.  
**Company-provided legal name:** Makundi Serengeti Experience DMC — authoritative registry evidence pending.

This file is an **interim decision model**. It does **not** wait for provider responses. It does **not** substitute assumptions, estimates, marketing, or generic cloud capability for provider evidence.

Provider-dependent facts are marked **PROVIDER EVIDENCE REQUIRED**, **UNVERIFIED**, **TBD**, or **PROVIDER RESPONSE REQUIRED**.

---

## A. Purpose and status

| Statement | Record |
| --- | --- |
| Purpose | Prepare a provider-neutral Production architecture and readiness baseline so E1-B responses can be mapped on receipt |
| E1-B | Provider evidence collection **ongoing** — **0 transmissions evidenced**; package **READY / NOT SENT** |
| E1-C | Proceeds **in parallel** with E1-B |
| Nature of this file | **Interim / pre-provider-evidence** baseline |
| Provider selected | **None** |
| Architecture selected (A/B/C/D) | **None** |
| ADR-0006 | **OPEN / proposed — blocked for Production** |
| DP-0006 | **OPEN — not approved**; recommended option **Not selected** |
| Production | **Unauthorized** |
| UAT / deployment / migration / provisioning | **Unauthorized** |
| New authorization created | **NO** |

E1-B operational routing (authoritative): [`adr-0006-e1-b5-routing-reconciliation.md`](adr-0006-e1-b5-routing-reconciliation.md) — **9 FULL-RFI ELIGIBLE / 2 SCOPE CLARIFICATION / 1 HOLD; 0 TRANSMISSIONS.**

---

## B. Current business requirements

Sources: company business position (LA-01–LA-17); Legal Counsel attestation (adopted with conditions); company-response to the frozen RFI (business answers only); E2 laboratory **distinctions** (business layer vs technical target). **No new business numbers invented.**

| Requirement | Governed record | Status of technical proof |
| --- | --- | --- |
| Recovery priority | **Commercial** is the first recovery priority. Sequence recorded in the company-response session: Commercial → Finance → Operations → CRM → Procurement/Suppliers; Programme Building depends on Finance and Suppliers. | **HUMAN DECISION REQUIRED** to reconcile with the historical BCM pack (CD-01). This baseline does **not** overwrite the historical pack. |
| Critical RTO | **≤ 3 hours** (business target) | **UNVERIFIED** as a measured Production capability |
| Overall RTO | **≤ 4 hours** (business target) | **UNVERIFIED** as a measured Production capability |
| Business data loss | **Zero tolerated business data loss** as a **business** requirement | Must **not** be translated into a technically guaranteed **RPO = 0** |
| Recovery from backup | **Required capability** | **PROVIDER EVIDENCE REQUIRED**; Dev/Test lab dumps are **not** Production proof |
| Continuous WAL / PITR / equivalent | **Candidate capability** because daily backup alone does **not** satisfy the zero-tolerated-loss business requirement | **PROVIDER EVIDENCE REQUIRED**; not selected as a product |
| Restricted+ failover | Must **not** fail over to an unapproved location (LA-14) | Location **UNSELECTED**; rule is a criterion, not a site |
| Tanzania PDPA | Primary legal **design basis** (LA-02, with conditions) | **NOT** exclusive governance of every activity; PDPC **NOT VERIFIED** |
| Kenya DPA / GDPR / UK GDPR / other | **Conditional** on actual data subjects and processing (LA-03, LA-04, E-18) | **LEGAL/DPO EVIDENCE REQUIRED** for applicability facts; topology **UNSELECTED** |
| DPO | **NOT ESTABLISHED** | Thomas Nguluma is **LEGAL COUNSEL ONLY** |
| PDPC registration | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** (E-02) | Do not claim registered, unregistered, or unnecessary |
| Production jurisdiction | **UNSELECTED** | Tanzania is **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** — not an approved Production location |
| Legal Counsel | **COMPLETE** — THOMAS NGULUMA — 15TH SEPTEMBER 2026 — A.T.N | Does **not** close DPO, PDPC, contracts, or E1 |
| Combined Legal/DPO | **INCOMPLETE** | Blocks E1 approval |

Historical Owner 2-hour / 3-hour RPO figures remain **superseded** as governing targets (E2 lab distinctions). Technical RTO/RPO remain **not approved**.

---

## C. Current EOS technical baseline

Distinguish **IMPLEMENTED**, **DEV/TEST ONLY**, **REQUIRED FOR PRODUCTION**, and **NOT YET IMPLEMENTED**. Laboratory and Gate B evidence is **not** Production evidence.

| Topic | Repository record | Classification |
| --- | --- | --- |
| PostgreSQL 16-class durable SoR | ADR-0003 **accepted for Development**. Target SoR for critical Commercial/RFP/Programme (persistence architecture). | **REQUIRED FOR PRODUCTION** as capability class. **DEV/TEST ONLY** as running instance. Production product/region **TBD**. |
| Dual-path persist | Gate B **CLOSED / VERIFICATION ACCEPTED** (isolated Dev/Test; PostgreSQL when `store.dbPool` set; fail-closed if DB unavailable). | **IMPLEMENTED** in **DEV/TEST ONLY**. **NOT** Production SoR. |
| Process-local `Store` | Historical/default Dev SoR; must **not** be Production SoR. | **DEV/TEST ONLY**. **NOT YET IMPLEMENTED** as eliminated from Production. |
| Per-request SQL reads | Target: read critical state from PostgreSQL per request (or short-lived cache), not process arrays as authority. | **REQUIRED FOR PRODUCTION**. Gate B Dev path **DEV/TEST ONLY**. |
| Optimistic locking | Target: enforce existing `version` fields. | **REQUIRED FOR PRODUCTION**. Dev/Test coverage **PARTIAL** / Gate B isolated. |
| Transactions + durable audit/outbox | Target: create/transition/version + audit (+ outbox) in one transaction; persist failure fails the API. | **REQUIRED FOR PRODUCTION**. Outbox tables exist as Dev patterns. Production NATS **NOT YET IMPLEMENTED**. |
| Redis / search | ADR-0003: projections, **not** SoR. Named Production Redis **UNKNOWN / REQUIRES DECISION**. Compose Dev Redis may exist. | **DEV/TEST ONLY** if present. Production product **TBD**. |
| NATS JetStream | ADR-0004 **accepted for Development/Test** (in-memory stand-in). Production NATS **proposed pending ADR-0006**. | **DEV/TEST ONLY** (stand-in). Production **NOT YET IMPLEMENTED**. |
| Document metadata | Target: PostgreSQL. Dev: metadata historically in memory; bytes via `DocumentStorage`. | Metadata durability **REQUIRED FOR PRODUCTION**. Gate B/Dev status **DEV/TEST ONLY**. |
| DocumentStorage port | Portable `put`/`get`. Dev adapter `LocalFsDocumentStorage`. Production object store **CANDIDATE — NOT SELECTED**. | Abstraction **IMPLEMENTED**. Production adapter **NOT YET IMPLEMENTED**. |
| No process-local SoR in Production | Persistence architecture critical principle. | **REQUIRED FOR PRODUCTION**. |
| Identity | ADR-0013 **proposed — blocked for Production**. Dev local issuer / password IdP. | **DEV/TEST ONLY**. Production IdP **TBD**. |
| Secrets | ADR-0012 **proposed — blocked for UAT and Production**. Dev gitignored env. | **DEV/TEST ONLY**. Production secrets/KMS **TBD**. |
| Backup | ADR-0011 **accepted for Development/Test** (BCM evidence register only). Production backup **product TBD**. Daily 19:00 EAT is a **future** requirement, not a proven Production job. | Evidence register **DEV/TEST ONLY**. Production backup **NOT YET IMPLEMENTED**. |
| Recovery / RTO / RPO | E2 lab **PARTIAL** (synthetic tables, disposable Docker). Application recovery **NOT DEMONSTRATED** for Production. | **LAB / DEV/TEST ONLY**. Production measurement **UNVERIFIED**. |
| Security | MFA for support **required** (company-response Q-I-07); session logging **required** (Q-I-08). WAF/CDN/KMS/IdP **unselected**. | Policy **KNOWN** as company requirement. Controls **NOT YET IMPLEMENTED** for Production. |
| Deployment / infra | No Production Terraform/K8s lock allowed by DP-0006. Gate C remainder **NOT AUTHORIZED** except bounded historical 123 on disposable Gate-B Dev/Test. | Production deployment **NOT YET IMPLEMENTED**. |
| Hosting | No Production region/provider. | **NOT YET IMPLEMENTED**. **PROVIDER EVIDENCE REQUIRED**. |

**Gate C / UAT / Production remain NOT AUTHORIZED.**

---

## D. Provider-independent Production capability model

Evidence currently available is **governance/requirement evidence**, not provider proof. “Provider evidence required?” = whether a later E1-B response (or equivalent) is needed before the item can be treated as a Production fact.

| # | Requirement | Current EOS status | Production requirement | Evidence currently available | Provider evidence required? | Legal/DPO evidence required? | Human decision required? | Open dependency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Compute/runtime | Dev/Test local / Compose | Hosted runtime capable of EOS API; stateless app; shared SoR | Gate B Dev; no Production host | **YES** | Placement (L-17) after topology | Runtime product/class | Provider + architecture |
| 2 | PostgreSQL 16-class database | ADR-0003 Dev accepted; Gate B isolated PG | Durable SoR PostgreSQL 16-class (or later **approved** equivalent) | ADR-0003; Gate B verification **DEV/TEST ONLY** | **YES** | DB geography (PE-04 / L-17) | Equivalent replacement if any | Provider offering + region |
| 3 | Durable storage | PG for rows; local FS for some bytes | Durable volumes/disks for DB and required files | Dev disks only | **YES** | Location | Storage class | Provider |
| 4 | Object/document storage | `DocumentStorage` + LocalFs | Production object store **CANDIDATE — NOT SELECTED** | Port exists; adapter unselected | **YES** | Object geography (PE-05) | Product | Provider + Legal location |
| 5 | Backup | ADR-0011 evidence register only | Encrypted backup; recoverability; 19:00 EAT as future schedule | Lab dumps **excluded** as Production | **YES** | Backup jurisdiction (LA-07) | Product; schedule owner | Provider + Legal |
| 6 | PITR / WAL | Candidate; lab mechanisms only | Disclose WAL location; independence from primary disk; granularity | E2 lab **PARTIAL** | **YES** | WAL location as processing | Whether PITR is adopted as Production control | Provider + architecture |
| 7 | Database restore | Lab restore on synthetic data | Restore of EOS Production DB with proof | Lab ≠ Production | **YES** | Restore copy location | Restore-test cadence | Provider + ops |
| 8 | Full environment recovery | **NOT DEMONSTRATED** | Recover app + DB + docs + identity/config needed for Commercial | None Production | **YES** | All connected services (LA-17) | Recovery runbook owner | Provider + SEDMC ops |
| 9 | DR | **UNSELECTED** | DR that meets LA-08 / LA-14; not automatically legally mandatory as warm standby (LA-09) | None | **YES** | DR jurisdiction | Whether DR site exists; where | Provider + Legal + Owner |
| 10 | Failover | **UNSELECTED** | Restricted+ only to pre-assessed equivalent location | Criterion only | **YES** | LA-14 | Failover policy | Architecture + Legal |
| 11 | Failback | **UNSELECTED** | Failback procedure after failover | None | **YES** | Same as DR | Ops ownership | Provider + ops |
| 12 | Network/connectivity | Dev localhost | Production connectivity, isolation, hybrid paths if used | None Production | **YES** | Path register (E-09) | Network design | Provider + architecture |
| 13 | DNS | **TBD** | Production DNS; exit/cutover noted in DP-0006 | None | **YES** | — | DNS owner | Human + provider |
| 14 | TLS | Dev typical local TLS **UNVERIFIED** as Production | TLS in transit for Production paths | None Production | **YES** | — | Certificate ops | Provider + SEDMC |
| 15 | WAF | **NOT SELECTED** | Assess as connected processing (LA-17) if used | None | **YES** | Edge processing | Whether WAF is in topology | Provider + Legal |
| 16 | CDN | **NOT SELECTED** | Same as WAF if used | None | **YES** | Edge / cache geography | Whether CDN is in topology | Provider + Legal |
| 17 | Secrets / KMS | ADR-0012 blocked UAT/Production | Named secrets/KMS; rotation owners | Dev env files | **YES** | KMS/subprocessor geography | Product (Vault vs cloud KMS **unevaluated as selection**) | ADR-0012 + provider |
| 18 | Identity provider | ADR-0013 blocked Production | Corporate OIDC IdP (or recorded fallback) | Dev local issuer | **YES** | IdP processing (LA) | Which IdP exists in the company | ADR-0013 + company |
| 19 | MFA | Company: MFA for support **required** | MFA for Production admin/support | Requirement recorded; control **UNVERIFIED** | **YES** | Support access (LA-16) | Enforcement scope | Provider + identity |
| 20 | Logging | Support-session logging **required** | Production logs; retention per E-13 (draft) | Dev logs ≠ Production | **YES** | Log location / retention | Retention decision | Provider + Legal |
| 21 | Monitoring | **NOT SELECTED** | Monitoring of SoR, backup, restore, app | None Production | **YES** | Monitor-vendor processing | Product | Provider |
| 22 | Alerting | **NOT SELECTED** | Alert on persist failure, backup fail, restore fail | None Production | **YES** | — | On-call owner | Ops + provider |
| 23 | Auditability | Target durable audit; Dev historically in-memory | Durable audit of critical writes | Gate B Dev **PARTIAL** | **YES** | Audit log location | Retention | Persistence + provider |
| 24 | Email | Dev templates/outbox; Dev SES mention ≠ Production | Production transactional email | None Production | **YES** | Email subprocessor | Product | Provider + Legal |
| 25 | Support | Geography **UNKNOWN** | Enterprise/managed support; MFA + session logs | Company requirements only | **YES** | Support geography (PE-08); LA-16 | Support hours/owner | Provider |
| 26 | Data residency | Jurisdiction **UNSELECTED** | Disclose and assess every processing location | Preference order only | **YES** | LA-02–LA-11; L-05 | Production jurisdiction | Provider + Legal + Owner |
| 27 | Restricted+ placement | Internal classification (LA-12) | Heightened controls **if** processed; no unapproved failover | E-16 mapping draft | **YES** | L-12 / LA-13–14 | What is stored as Restricted+ | Legal + architecture |
| 28 | Cross-border transfer controls | No Production paths | Identify paths; **no universal** transfer mechanism (LA-11) | Empty transfer register (E-09) | **YES** | Permits/SCC/IDTA **path-specific** | Whether to proceed per path | Legal + provider |
| 29 | Subprocessors | Register **empty** | Production register required (LA-15) | None | **YES** | Contract/DPA (E-07, E-30) | Accept each subprocessor | Provider + Legal |
| 30 | Data deletion | **UNVERIFIED** | Provider and SEDMC deletion capability | None | **YES** | Retention (E-13 draft) | Retention schedule | Provider + Legal |
| 31 | Data export/portability | **UNVERIFIED** | Exit/export (DP-0006 exit strategy) | None | **YES** | — | Exit owner | Provider |
| 32 | Incident response | Personal-data IR draft (E-15); **NOT READY** as Production IR | Production IR including provider notification | Draft only | **YES** | PDPC/other notice rules | IR owner; DPO if appointed | Legal + provider + ops |
| 33 | Backup encryption | Required by ADR-0011 intent | Encrypted backups | Lab ≠ Production | **YES** | Key location | KMS decision | Provider + ADR-0012 |
| 34 | Encryption at rest | **UNVERIFIED** Production | At rest for DB, objects, backups | None Production | **YES** | Key geography | KMS | Provider |
| 35 | Encryption in transit | **UNVERIFIED** Production | TLS on Production paths | None Production | **YES** | — | — | Provider |
| 36 | Recovery testing | Lab only | Periodic restore/recovery tests; success = recoverability | Lab | **YES** | Test-copy location | Cadence | Provider + ops |
| 37 | RTO measurement | Business ≤3 h / ≤4 h; technical **not approved** | Measured technical RTO against business targets | E2 lab **not** Production | **YES** | — | Accept technical RTO | Provider + Owner |
| 38 | RPO measurement | Business zero-loss **≠** technical RPO=0 | Measured technical RPO for backup-only vs PITR vs replica | None Production | **YES** | — | Accept technical RPO | Provider + Owner |
| 39 | Operational ownership | Reservations Consultant is E1-B sender only | Production ops, on-call, restore owner **TBD** | None | **Partial** (support model) | — | **YES** — SEDMC ops model | Human |
| 40 | Cost / TCO | Categories QUOTE REQUIRED; no invented budget | Transparent TCO breakdown (company-response structure) | None | **YES** | — | **YES** — budget | Provider quotes + Finance |

---

## E. Architecture classes (no ranking, no selection)

Classes are those evaluated in E1-A. DP-0006 letters C/D (hybrid vs colo) **differ** from E1-A/E1-C letters C/D (Tanzania-controlled vs hybrid). This is a **known non-blocking nomenclature** difference. This baseline uses **E1-A class types**. Letter identity is **not** a rank.

Tanzania as company **preferred baseline** is **not** a class selection and is **not** restated here as a ranking of Class C over A/B/D.

### Class A — African managed cloud

| Lens | Record |
| --- | --- |
| What it could potentially satisfy | Managed compute/DB in an **African** public-cloud region, if a provider actually offers the required EOS services **in that region**. Latency narrative for East Africa **possible**, **UNVERIFIED**. |
| Evidence still required | Exact region; service catalogue **in that region** (PostgreSQL 16-class, backup, PITR, object store, KMS, support). Africa ≠ Tanzania. E1-B4 public African regions cited for hyperscalers are **South Africa**, not Tanzania. |
| Legal/privacy questions | Whether the region is an approved jurisdiction; transfers from Tanzania; support geography; subprocessors; Restricted+ failover. L-05/L-17 **ARCHITECTURE-DEPENDENT**. |
| Technical questions | Feature parity vs required envelope; restore; HA; WAL location; identity/KMS. |
| Operational questions | Support hours covering EAT; SEDMC ops skill; exit. |
| Provider evidence required | Full E1-B pack for FULL-RFI ELIGIBLE Class A-tagged candidates (CU-02, CU-03, CU-06, CU-07 as **tags**, not selection). |
| Human decisions required | Whether an African **non-Tanzania** region is acceptable; budget; owner architecture decision **later**. |

### Class B — EU/EEA managed cloud

| Lens | Record |
| --- | --- |
| What it could potentially satisfy | Managed cloud in EU/EEA regions **if** services exist there. Mature tooling is **marketing unless evidenced**. |
| Evidence still required | Exact region; transfer mechanism **path-specific** (no universal mechanism); GDPR/UK GDPR applicability remains **conditional**. |
| Legal/privacy questions | Cross-border export from Tanzania operation; permits; SCC/IDTA **not** in repository; support access; Restricted+. |
| Technical questions | Same capability envelope as any class: PG, backup, PITR, restore, RTO/RPO. |
| Operational questions | Time-zone support vs EAT; latency **UNVERIFIED**. |
| Provider evidence required | Full E1-B for Class B-tagged FULL-RFI ELIGIBLE candidates (including CU-04, CU-08 and hyperscalers **as tags**). |
| Human decisions required | Whether EU/EEA hosting is legally and commercially acceptable; budget; later owner decision. |

### Class C — Tanzania-controlled colo / local infrastructure

| Lens | Record |
| --- | --- |
| What it could potentially satisfy | Compute/colo **in Tanzania** if a facility and managed-hosting proposition actually exist and can run PostgreSQL-class EOS. |
| Evidence still required | Operational status (CU-09 TZ1 is **Launching 2026 / Coming soon** — **not** operational proof). Managed PostgreSQL vs bare colo. Power, connectivity, backup geography, DR, support. CU-10/CU-11 are **SCOPE CLARIFICATION**, not full-RFI. |
| Legal/privacy questions | Tanzania PDPA still applies as baseline **with conditions**; colocated processing is not automatically “all processing in Tanzania” (LA-17) if backups/IdP/email/monitoring are elsewhere. |
| Technical questions | Who operates PostgreSQL; PITR; restore tests; hybrid on-ramps. |
| Operational questions | SEDMC vs provider ops burden; staff access; spare parts; on-call. |
| Provider evidence required | Full E1-B for CU-09, CU-12 (FULL-RFI ELIGIBLE Class C tags). Narrow SC-01–SC-09 for CU-10, CU-11 before any full pack. |
| Human decisions required | Accept colo ops model; later owner decision. |

### Class D — Hybrid

| Lens | Record |
| --- | --- |
| What it could potentially satisfy | Split of app, DB, objects, backup, DR, identity across more than one model (e.g. colo + cloud, or African + EU). **Could** keep some processing in a Tanzania-aligned path while using cloud for other services — **only if evidenced**. |
| Evidence still required | **Each connected service assessed separately** (LA-17). Data-flow map (E-08). Transfer register (E-09). |
| Legal/privacy questions | Multiple jurisdictions; Restricted+ must not silently land in an unapproved path; subprocessors multiply. |
| Technical questions | Latency, failover complexity, identity spanning sites, backup of each store. |
| Operational questions | Two (or more) ops models; incident ownership. |
| Provider evidence required | Evidence from **each** component provider; CU-01 and CU-12 among FULL-RFI ELIGIBLE hybrid tags; CU-05 remains **HOLD** (connectivity ≠ EOS hosting). |
| Human decisions required | How to split workloads; later owner decision. |

No class is stated as better, optimal, lowest-risk, highest-control, or cheapest.

---

## F. Provider-evidence dependency matrix

Mapping to Production architecture decision. Status vocabulary: **KNOWN** · **UNVERIFIED** · **PROVIDER RESPONSE REQUIRED** · **HUMAN DECISION REQUIRED** · **LEGAL/DPO EVIDENCE REQUIRED**.

| Decision input | E1-B / PE (illustrative) | Status |
| --- | --- | --- |
| Exact Production region | PE-03; Q geography | **PROVIDER RESPONSE REQUIRED** |
| Tanzania residency | PE-03/04/06/07; Class C questions | **PROVIDER RESPONSE REQUIRED**; jurisdiction **HUMAN DECISION REQUIRED** |
| Backup location | PE-06; Q-E backup | **PROVIDER RESPONSE REQUIRED**; **LEGAL/DPO EVIDENCE REQUIRED** once path exists |
| DR location | PE-07 | **PROVIDER RESPONSE REQUIRED**; **LEGAL/DPO EVIDENCE REQUIRED** |
| Restricted+ placement | Classification + failover Qs | **HUMAN DECISION REQUIRED** (what is stored); **PROVIDER RESPONSE REQUIRED** (where copies go); **LEGAL/DPO EVIDENCE REQUIRED** |
| PostgreSQL capability | PE DB; Q-B/Q-E | **PROVIDER RESPONSE REQUIRED** |
| PITR | Q-B-05, Q-E-05/06 | **PROVIDER RESPONSE REQUIRED** |
| Backup retention | Q backup retention | **PROVIDER RESPONSE REQUIRED**; retention policy **HUMAN DECISION REQUIRED** / **LEGAL/DPO EVIDENCE REQUIRED** |
| Restore testing | PE restore proof | **PROVIDER RESPONSE REQUIRED** |
| Failover / failback | DR Qs | **PROVIDER RESPONSE REQUIRED** |
| Technical RTO / RPO | Q-G | **PROVIDER RESPONSE REQUIRED**; acceptance **HUMAN DECISION REQUIRED**. Business ≤3h/≤4h and zero-loss are **KNOWN** as business requirements only |
| Support geography | PE-08 | **PROVIDER RESPONSE REQUIRED**; **LEGAL/DPO EVIDENCE REQUIRED** (LA-16) |
| Subprocessors | PE-09 | **PROVIDER RESPONSE REQUIRED**; **LEGAL/DPO EVIDENCE REQUIRED** |
| Government access | Questionnaire government-access items | **PROVIDER RESPONSE REQUIRED**; **LEGAL/DPO EVIDENCE REQUIRED** |
| Deletion | Portability/deletion Qs | **PROVIDER RESPONSE REQUIRED** |
| Portability / exit | DP-0006 exit; TCO retrieval | **PROVIDER RESPONSE REQUIRED** |
| Encryption | At rest / in transit / backup | **PROVIDER RESPONSE REQUIRED** |
| KMS | Secrets/KMS Qs | **PROVIDER RESPONSE REQUIRED**; product **HUMAN DECISION REQUIRED** (ADR-0012) |
| Identity | IdP Qs | **PROVIDER RESPONSE REQUIRED**; corporate IdP **HUMAN DECISION REQUIRED** (ADR-0013) |
| WAF | Edge Qs | **PROVIDER RESPONSE REQUIRED** if in topology |
| Monitoring | Observability Qs | **PROVIDER RESPONSE REQUIRED** |
| Support SLA | SLA Qs | **PROVIDER RESPONSE REQUIRED**; hours **HUMAN DECISION REQUIRED** |
| Pricing / TCO | Q-N commercial | **PROVIDER RESPONSE REQUIRED**; budget **HUMAN DECISION REQUIRED**. **No fabricated costs** |

E1-B PE items remain **NOT REQUESTED** on the frozen PE pack (pack not modified). Operationally they are **not yet transmitted** (0 sends). Treat as **PROVIDER RESPONSE REQUIRED** for the decision model, not as PE status rewrite.

---

## G. Decision-gate matrix

| Gate / Decision | Current status | Evidence required | Decision owner | Can proceed in parallel? | Blocking for provider evaluation? | Blocking for Production? |
| --- | --- | --- | --- | --- | --- | --- |
| E1-B provider evidence | OPEN — 9/2/1 routing; **0 transmissions** | Actual send artefacts then responses; E1-B3 intake | Reservations Consultant (send); governance (register) | **YES** (this baseline) | **YES** for suitability | **YES** |
| E1-C architecture baseline | **This file — COMPLETE (interim)** | Provider responses to fill TBD cells | Governance / later owner | **YES** | NO — prepares evaluation | NO by itself |
| Legal Counsel | COMPLETE | Already attested | THOMAS NGULUMA (recorded) | N/A | NO | NO alone |
| Legal/DPO completion | **INCOMPLETE** | DPO appointment if required | Company / DPO | **Partial** (rules exist) | NO for receiving RFI | **YES** for E1 close / Production |
| PDPC evidence | **NOT VERIFIED** | Company-specific artefact | Legal / company | **YES** collect | NO | **YES** if required and unknown |
| DPO appointment | **NOT ESTABLISHED** | Appointment artefact | Company | **YES** decide | NO | **YES** if required |
| Production jurisdiction | **UNSELECTED** | Provider regions + Legal assessment | Owner after evidence | Prepare only | NO | **YES** |
| Backup jurisdiction | **UNSELECTED** | PE-06 + Legal | Owner + Legal | Prepare only | NO | **YES** |
| DR jurisdiction | **UNSELECTED** | PE-07 + Legal; LA-14 | Owner + Legal | Prepare only | NO | **YES** if DR used |
| Budget | **NOT ESTABLISHED** | Quotes (non-binding under E1-B) | Finance / Owner | **YES** prepare structure | NO | **YES** |
| Security readiness | OPEN (ADR-0012/0013 blocked) | IdP, KMS, MFA, WAF as applicable | IT + Owner | **Partial** (policy) | NO | **YES** |
| Recovery validation | E2 **PARTIAL** lab only | Production-class restore/RTO/RPO evidence | IT + Owner | Lab analysis **YES**; Production proof **NO** | NO | **YES** |
| ADR-0006 decision | OPEN / proposed blocked | Above + owner decision | Owner | Prepare pack **YES** | NO | **YES** |
| DP-0006 decision | OPEN — not approved | Same | Owner | Prepare pack **YES** | NO | **YES** |
| Production authorization | **NOT AUTHORIZED** | ADR/DP approval + evidence | Owner | **NO** | N/A | **YES** (it is the authorization) |

---

## H. Interim decision posture

No architecture is selected.

No provider is selected.

ADR-0006 remains open. DP-0006 remains open. Production remains unauthorized.

The purpose of E1-C is to **prepare the decision model** so provider responses can be evaluated immediately upon receipt under E1-B3 — without treating those responses as verified, ranked, or selected.

---

## I. Next-evidence ingestion model

Do **not** perform provider evaluation in this file. When a genuine response exists:

1. **Provider response received** (actual artefact only)  
2. **Evidence receipt**  
3. **Evidence ID** (RCPT / SUB / EV-SUB per E1-B3 convention)  
4. **Chain of custody** (original immutable)  
5. **Assertion extracted** (provider claim ≠ verified fact)  
6. **Evidence verification** (E1-B3 statuses)  
7. **Capability mapping** into §D and §F of this baseline (or a dated successor snapshot)  
8. **Legal/DPO review where applicable** (paths, subprocessors, Restricted+, transfers)  
9. **TCO normalization** (quoted categories; no invented numbers)  
10. **Recovery evidence assessment** (backup/PITR/restore/RTO/RPO — technical, not business-zero as RPO=0)  
11. **Architecture implications** (class A–D **relevance**, not selection)  
12. **Decision pack update** (later ADR-0006 / DP-0006 pack — **not** auto-approval)

Sequence: Receive → Register → Preserve → Assign evidence ID → Verify → Clarify if necessary → Evaluate.

**RECEIVED ≠ VERIFIED ≠ SELECTED.**

---

## Document control

| Field | Value |
| --- | --- |
| Companions | [`adr-0006-e1-c-production-readiness-gap-register.md`](adr-0006-e1-c-production-readiness-gap-register.md) · [`adr-0006-e1-c-parallel-work-register.md`](adr-0006-e1-c-parallel-work-register.md) · [`adr-0006-e1-c-production-architecture-readiness-baseline-audit.md`](adr-0006-e1-c-production-architecture-readiness-baseline-audit.md) |
| Frozen RFI/PE/template | **Unmodified** |
| E1-B4 / B4.5 / B4.6 / authorization / historical transmission | **Unmodified** |
