# ADR-0008 — Multi-provider AI

- Status: **proposed**
- Date: 2026-08-21

## Decision

AI is accessed only through an orchestration port with provider registry, health, cost limits, and failover policy. No SDK from a single vendor in domain code.

## Consequences

Slightly more abstraction. Enables controlled failover and vendor change without rewriting modules.
