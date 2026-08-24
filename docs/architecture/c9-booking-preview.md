# C9 Booking & Handover — Preview

## Lifecycle status (reconciled for C9 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C9** |
| Capability name | Booking & Handover |
| Predecessor | C8 Proposal Engine |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `021_c9_booking.sql` (schema-only). ADR-0017 not reopened |

---

Increment **C9** completes the commercial lifecycle: accepted proposal → confirmed booking → operational handover.

## Kernel

- `packages/kernel/src/booking.ts` — `BkgBooking`, `BkgHandoverTask`, `canCreateBooking`, default handover checklist
- `packages/kernel/src/booking-events.ts`

## Database

- `packages/db/migrations/021_c9_booking.sql` — `bkg_bookings`, `bkg_handover_tasks`

## API (`/v1/bookings`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `booking:read:booking` (tenant-scoped; increment `C9-C10`) |
| GET/POST | `/bookings` | List / create from accepted proposal |
| GET | `/bookings/by-proposal/:proposalId` | Lookup by proposal |
| GET | `/bookings/:id` | Detail + handover checklist |
| POST | `/bookings/:id/handover-tasks/:taskId/complete` | Complete checklist item |

Permissions: `booking:read:booking`, `booking:write:booking`, `booking:complete:handover`

Creating a booking:
- Requires proposal status **accepted**
- Advances the linked opportunity to **won** as a C9 booking lifecycle effect (this is not a manual C2 pipeline skip)
- Closes the linked RFP as a C9 booking lifecycle effect (this is not a manual C3 workflow skip)
- Seeds default handover checklist (ops brief, supplier confirm, manifest, deposit invoice reference)

## UI

- `/commercial/bookings` — booking list
- `/commercial/bookings/[id]` — **C10 Booking Command Center** (handover + ops + finance snapshot)
- Proposal detail: **Accept & Create Booking** / **View Booking**

## Demo seed

`BKG-2026-0847` from `PROP-2026-0847` — full ops + finance data for command center when demo seed runs.

## Related increments

- **C10** — [Booking Command Center](./c10-booking-command-center-preview.md)
- **O1–O4** — [Operations modules](./o1-o3-ops-preview.md)
- **J1–J2** — [Analytics](./j1-analytics-preview.md)
