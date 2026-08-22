# ADR-0001 — Isolate EOS from branding collateral

- Status: **accepted for Development**
- Date: 2026-08-21

## Context

The open workspace is MICE HTML/PDF collateral. Mixing an enterprise platform into those trees risks destroying functioning sales assets and confuses git history.

## Decision

Place the platform in `serengeti-eos/` and do not modify collateral as part of platform work.

## Consequences

Two product lines coexist. A future split into a dedicated git remote is recommended (human approval for hosting).
