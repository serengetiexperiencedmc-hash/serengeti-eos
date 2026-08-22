# ADR-0009 — Logical multi-tenancy

- Status: **proposed**
- Date: 2026-08-21

## Decision

`tenant_id` on tenant-scoped rows. Internal enterprise is one tenant. Future partner/client portals are separate tenants. No shared-row visibility.

Physical isolation (separate DB per tenant) may be added for high-risk partners later.

## Consequences

Row-level mistakes are the main leak path — mitigated by mandatory repository helpers and IDOR tests.
