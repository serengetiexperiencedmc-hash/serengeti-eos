# ADR-0007 — Embedded workflow kernel first

- Status: **accepted for Development** (embedded kernel via I2 / [ADR-0016](ADR-0016-workflow-rules-kernel.md)). Temporal extraction remains **proposed**.
- Date: 2026-08-21
- Updated: 2026-08-24 (documentation hygiene — status vs I2/ADR-0016; decision body unchanged)

## Decision

Phase 1 uses an embedded workflow/approval state machine. Adopt Temporal (or equivalent) when long-running compensation and timers outgrow the kernel.

## Consequences

Faster SoD/approval delivery. Avoids operating Temporal before the team needs it.
