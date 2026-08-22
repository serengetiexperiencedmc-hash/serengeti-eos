# ADR-0017 — Persistence increment boundary (PG.1)

- Status: **accepted for Development**
- Date: 2026-08-22
- Supersedes: partial ambiguity in ADR-0003 implementation scope

## Context

PostgreSQL 16 is the planned OLTP system of record (ADR-0003). Migrations 001–034 define schema for I0–I3 modules. Runtime code has used an in-memory `Store` as the Dev/Test source of truth, with PG limited to I1 bootstrap sync on startup.

Commercial modules (C1 CRM, C4 suppliers, etc.) remain **schema-only** in PG per C1 governance — not runtime-persisted until a dedicated gate.

## Decision

Adopt a **phased persistence increment** model:

| Phase | Module | PG role | Runtime SoR (Dev/Test) |
| --- | --- | --- | --- |
| **I1** (done) | Kernel IAM, audit, sessions | Bootstrap sync on startup | In-memory + optional sync |
| **PG.1** (this increment) | I3 notifications | Dual-write on dismiss + email outbox | In-memory primary; PG mirror when `EOS_DATABASE_URL` set |
| **PG.2** (done) | I4 transactional outbox | Insert on emit, drain on startup | Per ADR-0010 |
| **PG.3** (done — Dev/Test gate) | C1 CRM orgs/contacts/activities | Dual-write + hydrate on startup | Separate gate; in-memory read SoR |

### PG.1 rules

1. When `store.dbPool` is set (via `main.ts` on `EOS_DATABASE_URL`), notification dismissals and email outbox entries are **dual-written** to PG.
2. In-memory `Store` remains authoritative for API reads in Dev/Test (no read-through from PG yet).
3. Integration tests gated by `EOS_RUN_PG_TESTS=1` + `EOS_DATABASE_URL`.
4. Column mapping: runtime `to` ↔ PG `recipient_email`.

### Out of scope for PG.1

- CRM, finance, bookings, ops modules
- PG read path / hydration on startup
- Production deployment

## Consequences

- Developers can validate I3 notification DDL against real Postgres without flipping the entire platform.
- Dual-write adds minimal latency; failures should be logged (future: retry queue).
- Full SoR cutover requires PG.2+ and explicit module gates — not a big-bang migration.

## References

- [ADR-0003](ADR-0003-postgresql-system-of-record.md)
- [ADR-0010](ADR-0010-transactional-outbox.md)
- `docs/architecture/pg-persistence-preview.md`
- `docs/governance/c1-implementation-authorized.md`
