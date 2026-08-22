# C3 RFP Management — Preview

Increment **C3** adds RFP workflow management linked to C2 opportunities and C1 CRM organizations.

## Kernel

- `packages/kernel/src/rfp.ts` — workflow stages, SLA helpers, `RfpRecord`, `RfpVersion`
- `packages/kernel/src/rfp-events.ts` — domain event type catalogue

## Database

- `packages/db/migrations/016_c3_rfp.sql` — `rfp_rfps`, `rfp_versions`

## API (`/v1/rfps`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health + RFP count |
| GET | `/workflow-stages` | Workflow stage catalogue |
| GET/POST | `/rfps` | List / create (auto v1, may advance linked opp to `rfp_received`) |
| GET | `/rfps/:id` | Detail + version history |
| POST | `/rfps/:id/transitions` | Advance workflow stage |
| POST | `/rfps/:id/versions` | Create new version snapshot |

Permissions: `rfp:read:rfp`, `rfp:write:rfp`, `rfp:transition:stage`, `rfp:write:version`

## UI

- `/commercial/rfps` — active RFP list with SLA indicators
- `/commercial/rfps/[id]` — detail view (requirements, workflow steps, version history)
- Dashboard RFP table wired to live API

## Demo seed

`RFP-2026-0847` for Global Incentives Ltd — workflow at **Approval**, SLA at-risk (6h), three versions.
