# J2 Operations Analytics — Preview

Increment **J2** delivers live operations intelligence from O1–O4 OLTP state (Dev/Test — no lakehouse).

## Kernel

- `packages/kernel/src/analytics.ts` — `OpsAnalyticsSummary`, `OpsBookingReadinessRollup`, `computeHandoverProgress`

## API (`/v1/analytics/operations`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/summary` | Ops rollups: handover, suppliers, manifests, vouchers, field tasks, sync |
| GET | `/bookings` | Per-booking ops readiness with handover progress % |

Permission: `analytics:read:operations`

## Metrics included

- Active bookings and handover task counts
- Supplier confirmation pending / confirmed
- Manifest draft / published and guest count
- Voucher draft / issued (O4)
- Field tasks open / complete (O3)
- Ops briefs issued
- Field sync conflicts (I9)
- **Per-booking readiness** — links to Operations Workspace

## UI

- `/commercial/analytics` — **J2 Operations** tab alongside J1 Commercial
- **Dashboard** — second stat row wired to J2 ops summary (handover, suppliers, vouchers, field tasks)

## Demo seed

`BKG-2026-0847` contributes to J2 rollups when demo seed is enabled.

See also: [J1 Commercial Analytics preview](./j1-analytics-preview.md)
