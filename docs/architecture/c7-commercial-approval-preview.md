# C7 Commercial Approval — Preview

Increment **C7** adds finance approval gates for commercial cost sheets, building on C6 costing and I2 workflow/rules patterns.

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

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health |
| GET | `/commercial-approvals` | List (filter by costSheetId, rfpId, status) |
| POST | `/commercial-approvals/request` | Request finance approval for cost sheet |
| GET | `/commercial-approvals/:id` | Detail |
| POST | `/commercial-approvals/:id/decision` | Approve/reject (SoD: requester ≠ decider) |

Permissions:
- `commercial:read:approval`, `commercial:request:approval` — commercial manager
- `commercial:decide:approval` — finance approver + platform admin

On approve: RFP workflow advances `approval` → `proposal`.

## UI

- RFP detail **Commercial Summary** — approval status badge, enabled **Request Finance Approval**
- Programme builder **Save & Cost** — recalculates cost sheet via API

## Demo seed

Pending approval `APR-2026-0847` for Global Incentives cost sheet (sell threshold gate).

## Next

**C8 Proposal Engine** — structured proposals from programme + costing + approved margin.
