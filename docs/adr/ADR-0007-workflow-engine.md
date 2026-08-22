# ADR-0007 — Embedded workflow kernel first

- Status: **proposed**
- Date: 2026-08-21

## Decision

Phase 1 uses an embedded workflow/approval state machine. Adopt Temporal (or equivalent) when long-running compensation and timers outgrow the kernel.

## Consequences

Faster SoD/approval delivery. Avoids operating Temporal before the team needs it.
