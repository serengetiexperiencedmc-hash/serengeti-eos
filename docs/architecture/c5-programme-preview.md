# C5 Programme Builder — Preview

Increment **C5** adds a structured itinerary/programme model linked to C3 RFPs and C4 suppliers.

## Kernel

- `packages/kernel/src/programme.ts` — `PrgProgramme`, `PrgDay`, `PrgItem`, `buildProgrammeCode`
- `packages/kernel/src/programme-events.ts` — domain event catalogue

## Database

- `packages/db/migrations/017_c5_programme.sql` — `prg_programmes`, `prg_days`, `prg_items`

## API (`/v1/programmes`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health |
| GET | `/programmes?rfpId=` | List programmes |
| POST | `/programmes` | Create programme (optional nested days/items) |
| GET | `/programmes/by-rfp/:rfpId` | Programme for an RFP |
| GET | `/programmes/:id` | Full detail with days + items |
| POST | `/programmes/:id/days` | Add day |
| POST | `/programmes/:id/days/:dayId/items` | Add itinerary item |

Permissions: `programme:read:programme`, `programme:write:programme`, `programme:write:day`, `programme:write:item`

## UI

- `/commercial/programme?rfpId=<uuid>` — three-panel builder (supplier library, live itinerary, costing placeholder)
- RFP detail links to programme builder with `rfpId`

## Demo seed

`PRG-2026-0847` for RFP-2026-0847 — 3 days (Arusha arrival, Serengeti balloon, Gala evening) with supplier references from the demo library.

## Next

**C6 Costing Engine** — live cost rollup in the programme builder right panel.
