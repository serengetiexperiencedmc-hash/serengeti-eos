# I2 — Workflow + Rules Kernel (Architecture)

**Status:** Authorized for implementation after I1 DoD closure  
**Governing preview:** [i2-workflow-rules-preview.md](i2-workflow-rules-preview.md)  
**Production readiness:** Not approved  
**AI agents / commercial modules:** Not authorized in I2

## 1. Workflow domain model

| Concept | Meaning |
| --- | --- |
| **WorkflowDefinition** | Named process template (`key`, owner, classification) |
| **WorkflowVersion** | Immutable published snapshot of definition (graph + policies) |
| **WorkflowInstance** | Running execution of a specific version |
| **Task** | Work item on an instance (human / system; **not** AI approval) |
| **Decision** | Recorded approval/rejection outcome (authority-bound) |
| **Action** | Side-effecting step after authorized decision |

These must not collapse into one record type.

## 2. Workflow state model

**Instance:** `draft → running → suspended → completed | cancelled | failed`

**Task:** `pending → claimed → completed | rejected | cancelled | escalated | timed_out`

Transitions are version-aware and audited.

## 3. Rule domain model

| Field | Purpose |
| --- | --- |
| ruleId / key | Stable identity |
| version | Integer |
| status | Draft → Test → Review → Approve → Effective → Retire |
| effectiveFrom / expiresAt | Temporal |
| owner / purpose | Governance |
| condition | JSONLogic-like predicate (I2: structured JSON conditions) |
| result | Structured outcome (allow/deny/route/limit) |
| priority | Conflict ordering |
| approval | Required before Effective |
| testCases | Simulation fixtures |
| audit history | Via platform audit chain |

**Unapproved rules cannot become Effective.**

## 4. Approval model

```
Task → (optional future AI recommendation) → Human review → Decision → Action
```

Hard rules:

- AI cannot satisfy human approval tasks  
- No AI-approves-AI  
- Self-approval blocked when SoD requires  
- Authority expiry enforced  
- Tenant-bound  
- Decision bound to workflow version  

## 5. Authorization model

| Permission | Use |
| --- | --- |
| `workflow:read:definition` | View definitions |
| `workflow:write:definition` | Draft/edit definitions |
| `workflow:publish:definition` | Publish version (≠ execute) |
| `workflow:execute:instance` | Start/progress instances |
| `workflow:approve:task` | Complete approval tasks |
| `rules:write:rule` | Draft rules |
| `rules:approve:rule` | Approve rules (SoD vs author) |
| `rules:simulate:rule` | Simulation only |

**Executor ≠ definition editor** by default (separate permissions).  
**Rule author ≠ rule approver** (SoD).

## 6. Audit model

Every consequential transition records: workflowId, version, instanceId, taskId, actor, actorType, tenant, timestamp, previous/new state, decision, reason, ruleVersion, correlationId, evidence.

## 7. Rule testing / simulation

`POST /v1/rules/simulate` — evaluates condition against input **without** executing actions.

## 8. Workflow simulation

`POST /v1/workflows/simulate` — dry-run path prediction (no real-world side effects).

## 9. Failure / retry / idempotency

- Task completion requires `idempotencyKey`  
- Retries are safe no-ops when key repeats  
- Timer/escalation creates new tasks; does not duplicate decisions  
- Failed actions → instance `failed` or compensation hook (stub in I2)

## 10. Observability

Metrics/logs: execution, task duration, failures, retries, timeouts, SLA breach, rule execution, approval latency, escalations. Correlation IDs on all APIs.

## 11. Threat analysis (I2)

| Threat | Control |
| --- | --- |
| Unauthorized definition change | RBAC + audit + publish permission |
| Approval forgery | Session + permission + SoD + tenant |
| Rule smuggling to Effective | Approval lifecycle |
| Cross-tenant instance access | Tenant filter + 404 |
| Replay of completion | Idempotency keys |
| AI satisfying approval | Task type `human_approval` rejects AiAgent |

## 12. API (summary)

See OpenAPI updates. Core:

- `POST /v1/workflows/definitions`  
- `POST /v1/workflows/definitions/:id/versions`  
- `POST /v1/workflows/definitions/:id/publish`  
- `POST /v1/workflows/instances`  
- `POST /v1/workflows/tasks/:id/complete`  
- `POST /v1/workflows/simulate`  
- `POST /v1/rules` / approve / simulate  

## 13. Persistence

Tables in `packages/db/migrations/002_i2_workflow_rules.sql`.

## 14. Test matrix

Functional, negative, authz, SoD, tenant, audit, idempotency, simulation, timer/escalation, persistence (when DB available).

## 15. Out of scope

AI agents, CRM/MICE/Finance modules, Production IdP/secrets/hosting decisions (ADR-0006/12/13 remain OPEN).
