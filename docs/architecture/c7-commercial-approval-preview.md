# C7 Commercial Approval — Preview

## Lifecycle status (reconciled for C7 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C7** |
| Capability name | Commercial Approval |
| Predecessor | C6 Costing Engine |
| Architecture status | Existing committed preview remains the C7 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `019_c7_commercial_approval.sql` (schema-only). ADR-0017 not reopened |
| Production / UAT / AI | Not authorized |

The sections after this heading are the architecture contract.

---

Increment **C7** adds finance approval gates for commercial cost sheets, building on C6 costing and I2 workflow/rules patterns.

## Objective

Gate high-value or below-floor commercials through finance review with SoD (requester ≠ decider), from the RFP Commercial Summary — including Approve/Reject.

## Kernel

- `packages/kernel/src/commercial-approval.ts` — `ComApprovalRequest`, margin/sell-threshold gates, SoD helpers
- `packages/kernel/src/commercial-approval-events.ts`

## Database

- `packages/db/migrations/019_c7_commercial_approval.sql` — `com_approval_requests`

## Approval gates

| Gate | Trigger |
|------|---------|
| `margin_floor` | Margin below configured floor — **blocks** approval request |
| `sell_threshold` | Sell price ≥ $250,000 USD — finance review required |
| `standard_review` | Normal finance sign-off |

## API (`/v1/commercial-approvals`)

| Method | Path | Permission |
|--------|------|------------|
| GET | `/health` | `commercial:read:approval` (tenant-scoped) |
| GET | `/commercial-approvals` | `commercial:read:approval` |
| POST | `/commercial-approvals/request` | `commercial:request:approval` |
| GET | `/commercial-approvals/:id` | `commercial:read:approval` |
| POST | `/commercial-approvals/:id/decision` | `commercial:decide:approval` (SoD) |

On approve: RFP workflow advances `approval` → `proposal`. Health increment remains `C7`.

## UI

- RFP detail **Commercial Summary** — status badge, **Request Finance Approval**, **Approve** / **Reject** when pending
- Programme builder **Save & Cost** — recalculates cost sheet via API

## Tests

Existing SoD/margin-floor tests plus 401/403, tenant-scoped health.

## Explicit exclusions

- UAT / Production / AI / ADR-0017
- I3.38 / I4.35 / I20.23 / PG.30

## Next

**C8 Proposal Engine** — structured proposals from programme + costing + approved margin.
