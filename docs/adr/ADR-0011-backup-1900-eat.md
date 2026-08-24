# ADR-0011 — Daily 19:00 EAT backup with restore proof

- Status: **accepted for Development/Test** (evidence-register only). Production backup **product remains TBD**.
- Date: 2026-08-21
- I17=A: 2026-08-24

## Decision

Encrypted backups daily at **19:00 Africa/Nairobi (EAT)**, remote copy, and restore tests. Success means **verified recoverability**, not job completion.

**I17=A (2026-08-24):** Until a production backup product is named, Development/Test implements a **BCM evidence register** only:

- one backup-job record per tenant per calendar date, stamped **19:00 EAT**;
- restore-probe records attached to a **completed** job;
- a completed job is **unproven** until a **passed** restore probe exists;
- object-level SoD: the principal who recorded the job cannot record its restore probe;
- in-memory store + additive SQL; ADR-0017 not reopened.

This is **not** a backup appliance, vendor, hot site, object-storage product, or production recovery platform. No real copy of PostgreSQL, object storage, or the event store is taken.

## Consequences

BCM evidence objects must store restore probe results. Job-green dashboards are insufficient.

Production still requires a named backup product before UAT/Production. I18 Crisis is a separate increment. **I18=A (2026-08-24)** separately authorized a bounded Dev/Test crisis overlay (human declaration + immutable timeline); it is not this ADR.
