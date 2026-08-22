# ADR-0011 — Daily 19:00 EAT backup with restore proof

- Status: **proposed** (requirement accepted; tooling TBD)
- Date: 2026-08-21

## Decision

Encrypted backups daily at **19:00 Africa/Nairobi (EAT)**, remote copy, and restore tests. Success means **verified recoverability**, not job completion.

## Consequences

BCM evidence objects must store restore probe results. Job-green dashboards are insufficient.
