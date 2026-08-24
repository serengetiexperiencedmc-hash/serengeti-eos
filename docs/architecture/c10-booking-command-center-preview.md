# C10 Booking Command Center — Preview

## Lifecycle status (reconciled for C10 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C10** |
| Capability name | Booking Command Center |
| Predecessor | C9 Booking & Handover |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Computed at runtime from C9 + O1–O4 + I8. Schema comment `030_c10_command_center.sql`. ADR-0017 not reopened |

---

Increment **C10** unifies a single booking's commercial, operations, and finance state into one **command center** snapshot (Dev/Test — computed at runtime).

## Kernel

- `packages/kernel/src/booking-command-center.ts` — snapshot types, `computeFinanceOutstanding`

## Database

- `packages/db/migrations/030_c10_command_center.sql` — schema comment only (no new tables; snapshot computed from C9 + O1–O4 + I8)

## API (`/v1/bookings`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/bookings/:id/command-center` | Aggregated snapshot + invoices + quotes + handover tasks |

Permission: `booking:read:command_center`

## Snapshot sections

| Section | Source modules |
| --- | --- |
| **Handover** | C9 checklist progress % |
| **Ops** | O1 supplier confs, O2 manifest, O3 field/brief, O4 vouchers, I9 sync conflicts |
| **Finance** | I8 invoices, quotes, paid/outstanding totals, recon exceptions |
| **Timeline** | Derived milestones (confirmed → deposit → suppliers → manifest → brief → vouchers → handover) |

## UI

- `/commercial/bookings/[id]` — **Booking Command Center** with progress ring, ops cards, finance snapshot, timeline, checklist

## Demo seed

`BKG-2026-0847` — full command center with ops + finance data when demo seed is enabled.

See also: [C9 Booking preview](./c9-booking-preview.md)
