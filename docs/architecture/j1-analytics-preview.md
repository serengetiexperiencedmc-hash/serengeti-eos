# J1 Commercial Analytics — Preview

**Domain J** delivers post-programme and in-flight commercial intelligence from live OLTP rollups (Dev/Test — no lakehouse).

## Kernel

- `packages/kernel/src/analytics.ts` — `CommercialAnalyticsSummary`, win rate / margin helpers

## API (`/v1/analytics/commercial`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/summary` | Pipeline value, win rate, RFP count, margins, bookings |
| GET | `/pipeline` | Opportunities grouped by stage |
| GET | `/margins` | Cost sheet margin rollups |

Permission: `analytics:read:commercial`

## UI

- `/commercial/analytics` — Commercial Intelligence dashboard (live from API)

## Metrics included

- Pipeline value (open opportunities)
- Win rate (won / total)
- Active RFP count
- Average margin from costing sheets
- Booking handover counts
- Outstanding invoices (I8)
- Reconciliation exceptions (I8)
- Field sync conflicts (I9)
- **Dashboard** (`/commercial`) stat cards wired to J1 summary

See also: [J2 Operations Analytics preview](./j2-ops-analytics-preview.md) · [J3 Finance Analytics preview](./j3-finance-analytics-preview.md)
