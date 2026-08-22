# C1 — Workflow Integration Design

**Status:** Proposed — consumes I2 only

## Principle

Use I2 workflow where a **multi-step human process** exists. Do not force ordinary CRUD through workflows.

## C1 workflow templates (Dev/Test)

| Template key | Trigger | Steps |
| --- | --- | --- |
| `crm.duplicate.merge` | Merge requested (high-value org) | Review → Approve → Execute merge |
| `crm.bulk_import.commit` | Import batch validated | Review → Approve → Commit |
| `crm.export.sensitive` | Export requested (Confidential+) | Request → Approve → Export |
| `crm.organization.reopen_disqualified` | Disqualified → Active | Reason → Manager approve |

## Integration pattern

```typescript
// After domain validation + RBAC
const wf = startWorkflowInstance(store, principal, {
  definitionKey: "crm.duplicate.merge",
  businessKey: duplicateCandidateId,
  context: { survivorId, duplicateId },
}, correlationId);
// Merge execution only when workflow instance completes approved path
```

## C1.1 behaviour

- Templates may be **stubbed** (direct merge with SoD + audit) until templates published
- Workflow task completion uses existing I2 human approval (no AI)
- CRM module stores optional `workflowInstanceId` on duplicate candidate / import batch

## Out of scope

CRM-local approval state machines duplicating I2.
