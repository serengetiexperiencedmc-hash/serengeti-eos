# ADR-0008 — Multi-provider AI

- Status: **accepted for Development/Test** (orchestration port / I20 L0–L1). Autonomous apply, L3+, and Production AI remain blocked.
- Date: 2026-08-21
- Updated: 2026-08-24 (documentation hygiene — status vs I20; decision body unchanged)

## Decision

AI is accessed only through an orchestration port with provider registry, health, cost limits, and failover policy. No SDK from a single vendor in domain code.

## Consequences

Slightly more abstraction. Enables controlled failover and vendor change without rewriting modules.
