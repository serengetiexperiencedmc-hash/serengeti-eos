# I2 Hardening Gate — Definition of Done

**Status:** Development/Test hardening complete (evidence via automated tests)  
**Production readiness:** NOT APPROVED

## Gates verified

| Gate | Evidence |
| --- | --- |
| Workflow state integrity | Cancel blocks approval; published version required; terminal conflict |
| Idempotency | Same key replay; different key after complete conflicts |
| Approval integrity | Human-only / SoD / self-approve / authority expiry / after cancel |
| Rules integrity | Unapproved / future / retired blocked for LIVE; audit pins `ruleVersionId` |
| Simulation integrity | `EXECUTION_MODE=SIMULATION` cannot mutate or publish; `sideEffects: []` |
| Concurrency | Task lock + post-complete conflict |
| Audit | Actor, tenant, version, previous/new state, correlation, mode, idempotency |
| Observability | Telemetry: workflow_started/completed, task_*, approval_*, rule_*, simulation_*, idempotency_* |
| Performance baseline | `i2.performance.test.ts` — latency samples only, not an SLO |

## Remaining before UAT

- Remove test bootstrap from UAT path
- Close ADR-0012 / ADR-0013 / ADR-0006 as applicable
- Rotate all development credentials
- Formal UAT security review

## Next authorized increment

**I4 — Transactional Outbox + Event Infrastructure** (generic events only; no CRM/MICE/AI).
