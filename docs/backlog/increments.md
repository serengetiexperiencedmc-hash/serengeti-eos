# Development backlog — independently deployable increments

> **CURRENT STATE (2026-08-24 ITR1 Stage 2 implemented Dev/Test)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`c55b608001e6af764fc80bd41ce9844b24da60d8`**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=IT_RELEASE_REGISTER** · **CAPABILITY_ID=ITR1** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES**  
> **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> ITR1 Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test. Do not infer UAT/Production from this row.

Each increment must be releasable to **Test** on its own (Production only after ADRs and gates). Dependencies are listed; do not skip.

| ID | Increment | Depends on | Includes | Not included |
| --- | --- | --- | --- | --- |
| **I0** | Platform kernel | Phase 0 docs | Tenancy, principals, local OIDC-dev login, RBAC/ABAC, SoD, audit hash chain, config versions, approval tasks, OpenAPI, CI tests | UI polish, BPM designer, AI, business modules |
| **I1** | Org + admin shell | I0 | Org hierarchy, locations, cost centers, principal lifecycle, role grants, config versioning/approval, session revoke, IdP/secrets abstractions | PAM, corporate IdP product, Prod secrets |
| **I2** | Workflow + rules kernel | I1 | Process instances, human tasks, versioned rules, simulation | Temporal |
| **I3** | Notifications | I2 | Templates, in-app + email adapter interface | SMS/Teams until contracted |
| **I4** | Event bus productionisation | I0 | Outbox publisher, NATS, DLQ, registry enforcement | Kafka |
| **I5** | CRM + Sales | I2–I4 | Parties, leads, opportunities — **IMPLEMENTED / CLOSED** as **C1–C2** (Dev/Test), [`c1-crm-preview.md`](../architecture/c1-crm-preview.md) | Marketing automation; C11+ not created |
| **I6** | Supplier master | I5 | Suppliers, contracts metadata, performance stub — **IMPLEMENTED / CLOSED** as **C4** (Dev/Test) | Rate engines |
| **I7** | MICE RFP → proposal | I5–I6 | RFP, programme, itinerary, costing, margin gates — **IMPLEMENTED / CLOSED** as **C3 / C5–C8** (Dev/Test) | Channel manager |
| **I8** | Finance quotes/invoices | I7 | Quotes, invoices, SoD payments (no bank file until provider known) — **IMPLEMENTED** (Dev/Test), [`i8-finance-preview.md`](../architecture/i8-finance-preview.md) | GL replacement |
| **I9** | Operations + field offline | I7 | Tasks, assignments, encrypted cache — **IMPLEMENTED** (Dev/Test) as **O1–O6** + I9 field | UEM |
| **C1–C10** | Commercial chain | I0–I4 | CRM Foundation through Booking Command Center — **IMPLEMENTED / CLOSED** (Dev/Test), [`commercial-roadmap.md`](../architecture/commercial-roadmap.md), [`c10-booking-command-center-preview.md`](../architecture/c10-booking-command-center-preview.md) | C11+ not created; **PO** Procurement and **CAL** Calendar remain **DEFERRED** |
| **I10** | HR core | I1 | Employee, leave, skills — **IMPLEMENTED** (Dev/Test), [`i10-hr-core-preview.md`](../architecture/i10-hr-core-preview.md) | Payroll engine |
| **H1** | HR Certification Register | I10 | Certification register — **IMPLEMENTED / CLOSED** (Dev/Test), [`h1-hr-certification-register-preview.md`](../architecture/h1-hr-certification-register-preview.md) | Payroll / LMS / H1.x not created |
| **I11** | ITSM + CMDB | I4 | Tickets, CIs — **IMPLEMENTED** (Dev/Test), [`i11-itsm-cmdb-preview.md`](../architecture/i11-itsm-cmdb-preview.md) | Discovery |
| **ITC1** | IT Change Register | I11 | Change register — **IMPLEMENTED / CLOSED** (Dev/Test), [`itc1-it-change-register-preview.md`](../architecture/itc1-it-change-register-preview.md) | CAB / ITC1.x not created. ITR1 is a separate selected capability, not ITC1 |
| **ITP1** | IT Problem Register | I11, ITC1 | Problem register — **IMPLEMENTED / CLOSED** (Dev/Test) at last implementation HEAD, [`itp1-it-problem-register-preview.md`](../architecture/itp1-it-problem-register-preview.md) | RCA engine / ITP1.x not created. ITR1 is a separate selected capability, not ITP1 |
| **ITR1** | IT Release Register | I11 | Release register — **IMPLEMENTED / CLOSED** (Dev/Test), [`itr1-it-release-register-preview.md`](../architecture/itr1-it-release-register-preview.md), [`itr1-it-release-register-authorized.md`](../governance/itr1-it-release-register-authorized.md) | Release Management / deploy / CAB / CI/CD; ITR1.x not created; UAT/Production not authorized; not I11.x / ITC1.x / ITP1.x |
| **I12** | Observability | I11 | OTel, health dependency map — **IMPLEMENTED** (Dev/Test), [`i12-observability-preview.md`](../architecture/i12-observability-preview.md) | Full AIOps |
| **I13** | Defensive SOC integration | I12 | Alert ingest, IR casefile — **IMPLEMENTED** (Dev/Test), [`i13-defensive-soc-preview.md`](../architecture/i13-defensive-soc-preview.md) | Homegrown SIEM |
| **I14** | PAM / secrets / ZTNA | I1, ADR-0012/13 | JIT, vault refs — **IMPLEMENTED** bounded Dev/Test (opaque refs + in-memory JIT; not production vault), [`i14-pam-preview.md`](../architecture/i14-pam-preview.md) | Custom VPN |
| **I15** | ERM + compliance + privacy | I2 | Registers, RoPA, DSR workflow — **IMPLEMENTED** risk register only (obligations = G1; RoPA/DSR = P1; controls = G2; findings = G3; campaigns = G4; mappings = G5; I15 not reopened), [`i15-erm-risk-register-preview.md`](../architecture/i15-erm-risk-register-preview.md) | Legal opinion automation |
| **G1** | Compliance obligations | I2 | Obligation register — **IMPLEMENTED** (Dev/Test), [`g1-compliance-obligations-preview.md`](../architecture/g1-compliance-obligations-preview.md). Authorized COMP=A; not I15.x | Tests |
| **P1** | Privacy RoPA + DSR | I2 | Processing activities + DSR cases — **IMPLEMENTED** (Dev/Test), [`p1-privacy-ropa-dsr-preview.md`](../architecture/p1-privacy-ropa-dsr-preview.md). Authorized PRIV=A; not I15.x | Consent / DPIA / DLP / live erasure |
| **G2** | GRC Control Catalogue | I2 | Internal controls + optional G1 obligation reference — **IMPLEMENTED** (Dev/Test), [`g2-grc-control-catalogue-preview.md`](../architecture/g2-grc-control-catalogue-preview.md). Authorized GRC=A; not I15.x | Tests |
| **G3** | Findings register | I2 | Findings + optional G2 control reference — **IMPLEMENTED** (Dev/Test), [`g3-findings-register-preview.md`](../architecture/g3-findings-register-preview.md). Authorized FIND=A; not I15.x | Sampled execution |
| **G4** | Control-test campaign register | I2 | Campaigns + optional G2 control reference — **IMPLEMENTED** (Dev/Test), [`g4-control-test-campaigns-preview.md`](../architecture/g4-control-test-campaigns-preview.md). Authorized TEST=A; not I15.x | Sampled execution |
| **G5** | Regulation-to-control mapping | I2 | Mapping register + optional G1/G2 references — **IMPLEMENTED** (Dev/Test), [`g5-regulation-control-mapping-preview.md`](../architecture/g5-regulation-control-mapping-preview.md). Authorized MAP=A; not I15.x | Sampled execution / live feeds |
| **O6** | Operational issues register | O5, C9 | Issue register against a booking — **IMPLEMENTED** (Dev/Test), [`o6-operational-issues-preview.md`](../architecture/o6-operational-issues-preview.md). Authorized O6; not G6 / not I15.x | Autonomous remediation / SLA / O5 signal automation |
| **K1** | Crisis decision log | I18 | Decision register against an open I18 case — **IMPLEMENTED** (Dev/Test), [`k1-crisis-decision-log-preview.md`](../architecture/k1-crisis-decision-log-preview.md). Authorized K1; not I18.x / not O7 / not G6 | Emcomms / exercises / action tracker |
| **K2** | Crisis action register | I18 | Action register against an open I18 case — **IMPLEMENTED** (Dev/Test), [`k2-crisis-action-register-preview.md`](../architecture/k2-crisis-action-register-preview.md). Authorized K2; not I18.x / not O7 / not G6 / not K1 | Emcomms / exercises / 13.2 tracker / SLA |
| **I16** | Internal audit | I15 | Engagements, workpapers — **IMPLEMENTED** (Dev/Test), [`i16-internal-audit-preview.md`](../architecture/i16-internal-audit-preview.md) | Opinion / external GRC |
| **I17** | BCM + backup proof | ADR-0011 | 19:00 EAT job, restore probe evidence — **IMPLEMENTED** Dev/Test evidence-register only (no backup product), [`i17-bcm-backup-evidence-preview.md`](../architecture/i17-bcm-backup-evidence-preview.md) | Hot site unless ADR |
| **I18** | Crisis + emcomms + exercises | I3, I17 | Command center — **IMPLEMENTED** bounded Dev/Test (human declaration + immutable timeline only; no emcomms/exercises), [`i18-crisis-overlay-preview.md`](../architecture/i18-crisis-overlay-preview.md) | Voice / SMS / Teams / exercises until provider |
| **I19** | Knowledge + search | I0 | Authority states, permissioned search — **IMPLEMENTED** tenant-scoped SQL-shaped search (no graph/external index), [`i19-knowledge-search-preview.md`](../architecture/i19-knowledge-search-preview.md) | Graph DB |
| **I20** | AI orchestration | I19, ADR-0008 | Providers, prompts, agents L0–L1 — **IMPLEMENTED** bounded through **I20.22** (Dev/Test) | L3+ tools; autonomous apply; I20X deferred |
| **I21** | Decision intelligence | I20 | Forecasts labelled as estimates | **DEFERRED** — not a pending queue item |
| **I22** | Partner edge | I0, I4 | Partner IAM, isolation tests | **DEFERRED** — not a pending queue item |
| **I23** | Process mining / AIOps | I4, I12 | | **DEFERRED** — Autonomous remediation |

## Highest-priority build order (historical — closed in Dev/Test)

This section is **not** a live build order. All items below are **CLOSED** for Development/Test. **EXECUTION_QUEUE=EMPTY.**

1. ~~I0 kernel~~ — Development/Testing only  
2. ~~I1 admin shell~~ — **CLOSED** for Development/Testing  
3. ~~I2 workflow/rules~~ — **HARDENED** for Dev/Test  
4. ~~I4 outbox/events~~ — **ACCEPTED** + hardened for Dev/Test  
5. ~~C1 CRM Foundation~~ — **CLOSED / IMPLEMENTED** (Dev/Test). Gate **PASS** ([`c1-implementation-authorized.md`](../governance/c1-implementation-authorized.md), [`c1-gate-decision.md`](../governance/c1-gate-decision.md)). [`c1-crm-preview.md`](../architecture/c1-crm-preview.md) is a historical contract.  
6. ~~C2–C10 commercial chain~~ — **CLOSED / IMPLEMENTED** (Dev/Test) ([commercial-roadmap.md](../architecture/commercial-roadmap.md)). **C11+ is not created and not authorized.** Procurement (**PO**) and Calendar (**CAL**) remain **DEFERRED**.

AI agents (beyond bounded I20 L0–L1), UAT and Production remain blocked. ADR-0006 / ADR-0012 / ADR-0013 + Production Readiness Review still required for Production.

Official status: **frozen Development/Test product** at HEAD `c55b608001e6af764fc80bd41ce9844b24da60d8` — not UAT-ready, not Production-ready. Do not treat remaining backlog or roadmap bullets as core-exit work.
