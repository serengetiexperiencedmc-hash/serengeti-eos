# ADR-0016 — Embedded Workflow + Rules kernel (I2)

- Status: **accepted for Development**
- Date: 2026-08-22

## Context

I2 requires enterprise workflow and business rules before commercial modules or AI agents.

## Decision

Implement an embedded Workflow + Rules kernel in the modular monolith (ADR-0007), with:

- Distinct Definition / Version / Instance / Task / Decision / Action concepts
- Human-only approval for `human_approval` tasks
- Rule lifecycle Draft→…→Effective with SoD on approve
- Simulation endpoints that never execute consequential actions
- PostgreSQL schema in migration `002_i2_workflow_rules.sql`

Temporal (or equivalent) remains a future extraction option.

## Consequences

Business modules must consume this kernel rather than inventing private approval engines. AI agents remain unauthorized in I2.
