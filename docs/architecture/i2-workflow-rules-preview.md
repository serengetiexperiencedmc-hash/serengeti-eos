# I2 — Workflow + Rules Kernel (pre-implementation)

**Status:** Architecture + test strategy — implement only after I1 DoD met  
**Depends on:** I1 Admin Shell  

## Purpose

Foundational BPM and business-rules infrastructure for all later modules.

Lifecycle (mandatory):

**Draft → Review → Approval → Execution → Verification → Closure**

## Workflow requirements

| Capability | Requirement |
| --- | --- |
| Versioning | Process definitions versioned; instances pin a version |
| Approvals | Human tasks; SoD; no AI self-approval |
| Escalations | Timer → escalate assignee/role |
| SLAs | Track breach; emit events |
| Timers | Durable delays |
| Exceptions | Explicit exception paths |
| Retries | Idempotent activity retries |
| Idempotency | Command keys on side-effecting steps |
| Compensation | Rollback/compensate where modelled |
| Audit | Every transition audited |

Engine: embedded kernel first (ADR-0007). Temporal only if complexity demands later ADR.

## Business Rules Engine

- Separate from application code for changeable policies  
- Versioned, effective-dated, testable, approvable, auditable, explainable  
- Simulation + conflict detection before activate  
- Rules advise; Decision Management records Recommendation ≠ Decision  

## Test strategy (before coding I2)

| Suite | Examples |
| --- | --- |
| Functional | Happy-path approval flow completes |
| Negative | Closed instance rejects transitions |
| Authorization | Only assignee/role can complete task |
| SoD | Creator cannot approve same object |
| Tenant | Cross-tenant instance 404 |
| Audit | Transition produces hash-chained event |
| Failure | Timer/worker crash recovers idempotently |
| Idempotency | Duplicate complete is no-op |
| Compensation | Compensating path restores prior business state where modelled |

## Exit to I4

I2 is sufficiently stable when: core approval process runs end-to-end in Test, rules can gate a config or payment threshold, and the suites above pass without regressing I0/I1.
