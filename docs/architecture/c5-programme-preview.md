# C5 Programme Builder — Preview

## Lifecycle status (reconciled for C5 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C5** |
| Capability name | Programme Builder |
| Predecessor | C4 Supplier Management |
| Architecture status | Existing committed preview remains the C5 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `017_c5_programme.sql` (schema-only). ADR-0017 not reopened |
| Production / UAT / AI | Not authorized |

The sections after this heading are the architecture contract.

---

Increment **C5** adds a structured itinerary/programme model linked to C3 RFPs and C4 suppliers.

## Objective

Let commercial users build a day-by-day programme against an RFP, attaching C4 suppliers to itinerary items, with tenant-isolated APIs and a usable builder UI (not API-only).

## User / business purpose

After an RFP is in intake/programme, the commercial manager structures the operational itinerary before costing (C6).

## Kernel

- `packages/kernel/src/programme.ts` — `PrgProgramme`, `PrgDay`, `PrgItem`, `buildProgrammeCode`
- `packages/kernel/src/programme-events.ts` — domain event catalogue

## Database

- `packages/db/migrations/017_c5_programme.sql` — `prg_programmes`, `prg_days`, `prg_items`

## API (`/v1/programmes`)

| Method | Path | Permission |
|--------|------|------------|
| GET | `/health` | `programme:read:programme` (tenant-scoped counts) |
| GET | `/programmes?rfpId=` | `programme:read:programme` |
| POST | `/programmes` | `programme:write:programme` |
| GET | `/programmes/by-rfp/:rfpId` | `programme:read:programme` |
| GET | `/programmes/:id` | `programme:read:programme` |
| POST | `/programmes/:id/days` | `programme:write:day` |
| POST | `/programmes/:id/days/:dayId/items` | `programme:write:item` |

Health increment remains `C5`.

### Validation

- Create requires a valid tenant RFP; title defaults to the RFP title
- Add day requires `dayNumber` and non-empty `title`
- Add item requires non-empty `title`
- One programme per RFP (409 `programme_exists_for_rfp`)

### Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Wrong tenant / unknown id | 404 |
| Duplicate programme for RFP / day number | 409 |
| Invalid input | 400 |

### Persistence / tenant isolation / audit

Dev/Test in-memory SoR. All reads/writes tenant-scoped. Mutations emit programme audit events. Responses omit `tenantId`.

## UI

- `/commercial/programme?rfpId=<uuid>` — three-panel builder (supplier library, live itinerary, live costing from C6)
- RFP detail links to programme builder with `rfpId`
- Create programme when none exists for the RFP
- Add day and add itinerary item from the builder
- Filter suppliers; attach a supplier to a selected day as an item
- Loading / empty / error states

## Demo seed

`PRG-2026-0847` for RFP-2026-0847 — 3 days (Arusha arrival, Serengeti balloon, Gala evening) with supplier references from the demo library.

## Tests

C5 API tests plus 401/403/404, tenant-scoped health, title required on add day/item.

## Explicit exclusions

- PDF preview (button remains disabled)
- Drag-and-drop onto the canvas (click-to-add is the C5 builder action)
- C6 costing engine changes (right panel already consumes C6)
- UAT / Production / AI / ADR-0017
- I3.38 / I4.35 / I20.23 / PG.30

## Dependencies

C3 RFP, C4 Supplier Library.

## Next

**C6 Costing Engine** — already wired in the builder right panel; remaining C6 contract gaps are a separate increment.
