# Development backlog — independently deployable increments

Each increment must be releasable to **Test** on its own (Production only after ADRs and gates). Dependencies are listed; do not skip.

| ID | Increment | Depends on | Includes | Not included |
| --- | --- | --- | --- | --- |
| **I0** | Platform kernel | Phase 0 docs | Tenancy, principals, local OIDC-dev login, RBAC/ABAC, SoD, audit hash chain, config versions, approval tasks, OpenAPI, CI tests | UI polish, BPM designer, AI, business modules |
| **I1** | Org + admin shell | I0 | Org hierarchy, locations, cost centers, principal lifecycle, role grants, config versioning/approval, session revoke, IdP/secrets abstractions | PAM, corporate IdP product, Prod secrets |
| **I2** | Workflow + rules kernel | I1 | Process instances, human tasks, versioned rules, simulation | Temporal |
| **I3** | Notifications | I2 | Templates, in-app + email adapter interface | SMS/Teams until contracted |
| **I4** | Event bus productionisation | I0 | Outbox publisher, NATS, DLQ, registry enforcement | Kafka |
| **I5** | CRM + Sales | I2–I4 | Parties, leads, opportunities | Marketing automation |
| **I6** | Supplier master | I5 | Suppliers, contracts metadata, performance stub | Rate engines |
| **I7** | MICE RFP → proposal | I5–I6 | RFP, programme, itinerary, costing, margin gates | Channel manager |
| **I8** | Finance quotes/invoices | I7 | Quotes, invoices, SoD payments (no bank file until provider known) | GL replacement |
| **I9** | Operations + field offline | I7 | Tasks, assignments, encrypted cache | UEM |
| **I10** | HR core | I1 | Employee, leave, skills — **IMPLEMENTED** (Dev/Test), [`i10-hr-core-preview.md`](../architecture/i10-hr-core-preview.md) | Payroll engine |
| **I11** | ITSM + CMDB | I4 | Tickets, CIs — **IMPLEMENTED** (Dev/Test), [`i11-itsm-cmdb-preview.md`](../architecture/i11-itsm-cmdb-preview.md) | Discovery |
| **I12** | Observability | I11 | OTel, health dependency map — **IMPLEMENTED** (Dev/Test), [`i12-observability-preview.md`](../architecture/i12-observability-preview.md) | Full AIOps |
| **I13** | Defensive SOC integration | I12 | Alert ingest, IR casefile — **IMPLEMENTED** (Dev/Test), [`i13-defensive-soc-preview.md`](../architecture/i13-defensive-soc-preview.md) | Homegrown SIEM |
| **I14** | PAM / secrets / ZTNA | I1, ADR-0012/13 | JIT, vault refs — **IMPLEMENTED** bounded Dev/Test (opaque refs + in-memory JIT; not production vault), [`i14-pam-preview.md`](../architecture/i14-pam-preview.md) | Custom VPN |
| **I15** | ERM + compliance + privacy | I2 | Registers, RoPA, DSR workflow — **IMPLEMENTED** risk register only (obligations/RoPA/DSR deferred), [`i15-erm-risk-register-preview.md`](../architecture/i15-erm-risk-register-preview.md) | Legal opinion automation |
| **G1** | Compliance obligations | I2 | Obligation register — **IMPLEMENTED** (Dev/Test), [`g1-compliance-obligations-preview.md`](../architecture/g1-compliance-obligations-preview.md). Authorized COMP=A; not I15.x | Controls / tests / findings |
| **I16** | Internal audit | I15 | Engagements, workpapers — **IMPLEMENTED** (Dev/Test), [`i16-internal-audit-preview.md`](../architecture/i16-internal-audit-preview.md) | Opinion / external GRC |
| **I17** | BCM + backup proof | ADR-0011 | 19:00 EAT job, restore probe evidence — **IMPLEMENTED** Dev/Test evidence-register only (no backup product), [`i17-bcm-backup-evidence-preview.md`](../architecture/i17-bcm-backup-evidence-preview.md) | Hot site unless ADR |
| **I18** | Crisis + emcomms + exercises | I3, I17 | Command center — **IMPLEMENTED** bounded Dev/Test (human declaration + immutable timeline only; no emcomms/exercises), [`i18-crisis-overlay-preview.md`](../architecture/i18-crisis-overlay-preview.md) | Voice / SMS / Teams / exercises until provider |
| **I19** | Knowledge + search | I0 | Authority states, permissioned search — **IMPLEMENTED** tenant-scoped SQL-shaped search (no graph/external index), [`i19-knowledge-search-preview.md`](../architecture/i19-knowledge-search-preview.md) | Graph DB |
| **I20** | AI orchestration | I19, ADR-0008 | Providers, prompts, agents L0–L1 | L3+ tools |
| **I21** | Decision intelligence | I20 | Forecasts labelled as estimates | |
| **I22** | Partner edge | I0, I4 | Partner IAM, isolation tests | Public catalogue |
| **I23** | Process mining / AIOps | I4, I12 | | Autonomous remediation |

## Highest-priority build order (now)

1. ~~I0 kernel~~ — Development/Testing only  
2. ~~I1 admin shell~~ — **CLOSED** for Development/Testing  
3. ~~I2 workflow/rules~~ — **HARDENED** for Dev/Test  
4. ~~I4 outbox/events~~ — **ACCEPTED** + hardened for Dev/Test  
5. **C1 CRM Foundation** — preview **READY FOR REVIEW** ([`c1-crm-preview.md`](../architecture/c1-crm-preview.md) + [`c1/`](../architecture/c1/)) — **implementation NOT YET AUTHORIZED**  
6. C2–C9 commercial increments — authorized in dependency order ([commercial-roadmap.md](../architecture/commercial-roadmap.md))  

AI agents, UAT and Production remain blocked. ADR-0006 / ADR-0012 / ADR-0013 + Production Readiness Review still required for Production.

Official status: Development/Test foundation + authorized commercial-domain increments — not UAT-ready, not Production-ready.
