# C6 Costing Engine — Preview

Increment **C6** adds cost sheets, line items, markup/margin calculation, and version snapshots linked to C5 programmes.

## Kernel

- `packages/kernel/src/costing.ts` — `CostSheet`, `CostLineItem`, `computeCostTotals`, `buildCostSheetCode`
- `packages/kernel/src/costing-events.ts` — domain event catalogue

## Database

- `packages/db/migrations/018_c6_costing.sql` — `cost_sheets`, `cost_line_items`, `cost_sheet_versions`

## API (`/v1/costing`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health |
| GET | `/sheets?programmeId=&rfpId=` | List cost sheets |
| POST | `/sheets` | Create sheet (optional nested line items) |
| GET | `/sheets/by-programme/:programmeId` | Sheet + lines + category totals |
| GET | `/sheets/:id` | Detail + version history |
| POST | `/sheets/:id/line-items` | Add line item + recalculate |
| POST | `/sheets/:id/recalculate` | Update markup/sell + recalculate |
| POST | `/sheets/:id/versions` | Snapshot version |

Permissions: `costing:read:sheet`, `costing:write:sheet`, `costing:write:line_item`, `costing:write:version`

## UI

- Programme builder **Live Costing** panel wired to `/v1/costing/sheets/by-programme/:programmeId`
- RFP detail commercial summary from cost sheet by RFP

## Demo seed

`CST-2026-0847` — $198,400 cost, $285,000 sell, 30.4% margin (5 category lines matching mock UI).

## Next

**C7 Commercial Approval** — margin floor workflow gates via I2.
