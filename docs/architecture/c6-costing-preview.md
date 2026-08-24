# C6 Costing Engine — Preview

## Lifecycle status (reconciled for C6 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C6** |
| Capability name | Costing Engine |
| Predecessor | C5 Programme Builder |
| Architecture status | Existing committed preview remains the C6 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `018_c6_costing.sql` (schema-only). ADR-0017 not reopened |
| Production / UAT / AI | Not authorized |

The sections after this heading are the architecture contract.

---

Increment **C6** adds cost sheets, line items, markup/margin calculation, and version snapshots linked to C5 programmes.

## Objective

Produce a tenant-isolated cost sheet for a programme, with line items, sell/margin math, and a usable Live Costing panel (create sheet, add lines, recalculate).

## Kernel

- `packages/kernel/src/costing.ts` — `CostSheet`, `CostLineItem`, `computeCostTotals`, `buildCostSheetCode`
- `packages/kernel/src/costing-events.ts` — domain event catalogue

## Database

- `packages/db/migrations/018_c6_costing.sql` — `cost_sheets`, `cost_line_items`, `cost_sheet_versions`

## API (`/v1/costing`)

| Method | Path | Permission |
|--------|------|------------|
| GET | `/health` | `costing:read:sheet` (tenant-scoped counts) |
| GET | `/sheets?programmeId=&rfpId=` | `costing:read:sheet` |
| POST | `/sheets` | `costing:write:sheet` |
| GET | `/sheets/by-programme/:programmeId` | `costing:read:sheet` |
| GET | `/sheets/:id` | `costing:read:sheet` |
| POST | `/sheets/:id/line-items` | `costing:write:line_item` |
| POST | `/sheets/:id/recalculate` | `costing:write:sheet` |
| POST | `/sheets/:id/versions` | `costing:write:version` |

Health increment remains `C6`. One sheet per programme (409 `cost_sheet_exists_for_programme`). Line items require description. Responses omit `tenantId`.

## UI

- Programme builder **Live Costing** panel: create sheet when missing, add line items, Save & Cost recalculate
- RFP detail commercial summary from cost sheet by RFP

## Demo seed

`CST-2026-0847` — $198,400 cost, $285,000 sell, 30.4% margin (5 category lines matching mock UI).

## Tests

C6 API tests plus 401/403/404, tenant-scoped health, sanitized sheet.

## Explicit exclusions

- UAT / Production / AI / ADR-0017
- I3.38 / I4.35 / I20.23 / PG.30
- C7 approval workflow (next increment)

## Next

**C7 Commercial Approval** — margin floor workflow gates via I2.
