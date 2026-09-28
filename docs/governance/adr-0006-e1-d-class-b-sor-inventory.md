# E1-D Class B — SoR inventory (Dev/Test)

> **`INVENTORY ONLY — NOT SoR EXPANSION`**  
> **`NOT PRODUCTION SoR`** · **`productionReady remains false`**

**Date:** 2026-09-17.  
**Authorized by:** [`adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md`](adr-0006-e1-d-class-b-narrow-dev-test-implementation-authorization.md) item NB1.

This document records **current** authority. It does **not** authorize moving additional modules to PostgreSQL as system of record.

| Module | Authoritative SoR (current) | Persistence mechanism | Transaction boundary | Dev/Test | Production status | Known gap |
| --- | --- | --- | --- | --- | --- | --- |
| Opportunity | PostgreSQL when `store.dbPool` set; else process-local Store | `isDurableSoR` + `runDurableTx` | Same TX: domain + chained audit + outbox | Dual-path | Production SoR **F** (unselected host) | None for this inventory |
| RFP | Same as opportunity | Same | Same | Dual-path | **F** | — |
| Programme | Same | Same | Same | Dual-path | **F** | — |
| Costing | Same | Same | Same | Dual-path | **F** | — |
| Commercial approvals | Same | Same | Same | Dual-path | **F** | — |
| Commercial document **metadata** | PostgreSQL when pool set | `isDurableSoR` + `runDurableTx` | Metadata TX; bytes compensated via `DocumentStorage.delete` | Dual-path | Metadata host **F**; object store **C** | Kernel delete vs adapter (NB2) |
| Commercial document **bytes** | LocalFs `DocumentStorage` | Files under tmp/dev root | Not SQL | Dev LocalFs | Adapter **unselected** | GAP-PER-03 |
| CRM (orgs, contacts, etc.) | **Process-local Store** (reads) | Dual-write upserts when pool set | NB4: entity upsert + outbox **same TX** when pool set; Store remains CRM SoR | Dual-write | Not Production CRM SoR | Expansion **B6** excluded |
| Supplier / hotel / contracts refs | Process-local Store | `void persistSup*` dual-write | Fire-and-forget persist (not this grant) | Dual-write | — | Not expanded |
| Audit events | PostgreSQL when pool set (`listAudit` loads SQL); else Store.audit | `insertChainedAudit` in Commercial TX | Commercial: same TX | Dual-path | — | CRM audit still in-memory snapshot unless persist path writes it |
| Outbox | Memory `store.outboxEvents`; PG `outbox_events` when pool | Commercial: `insertDomainOutbox` in TX. CRM: NB4 `insertOutboxEventOn` in TX | See module | Dev | NATS **B4** excluded | CRM was fire-and-forget before NB4 |
| Process-local Store | Authoritative whenever `dbPool` unset, and for non-dual-path modules even when set | In-process arrays | Snapshot rollback (CRM) | Default tests | **Not** Production SoR | TECH-PER-11 |
| Notifications / AI / HR / ITSM / GRC / etc. | Process-local Store | Various `persist*` dual-writes | Not jointly-critical Commercial TX | Dev | — | Expansion excluded |

**PostgreSQL-backed SoR (when pool set):** opportunity, rfp, programme, costing, commercial-approval, commercial-document metadata, audit reads via `listAudit`.

**Dual-write, Store still SoR:** CRM (after NB4: PG entity+outbox atomic, reads still Store), supplier, many I3/I4/I20 persist helpers.

**LocalFs:** document bytes only.

This inventory is **not** SoR expansion.
