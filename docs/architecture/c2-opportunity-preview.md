# C2 Opportunity / Pipeline — Preview

Increment **C2** adds sales pipeline management on top of C1 CRM organizations and accounts.

## Kernel

- `packages/kernel/src/opportunity.ts` — stages, transitions, `OppOpportunity`, `OppStageHistory`
- `packages/kernel/src/pipeline-events.ts` — domain event type catalogue

## Database

- `packages/db/migrations/015_c2_opportunity.sql` — `opp_opportunities`, `opp_stage_history`

## API (`/v1/pipeline`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Module health + opportunity count |
| GET | `/stages` | Stage catalogue |
| GET | `/board` | Kanban board columns |
| GET/POST | `/opportunities` | List / create |
| GET | `/opportunities/:id` | Detail + stage history |
| POST | `/opportunities/:id/transitions` | Stage transition |

Permissions: `pipeline:read:opportunity`, `pipeline:write:opportunity`, `pipeline:transition:stage`

## UI

- `/commercial/pipeline` — live kanban from `/v1/pipeline/board`
- Dashboard pipeline value from live board totals

## Demo seed

Three opportunities aligned to mock UI clients (European Pharma, Summit Travel, Global Incentives) with stage transitions applied after CRM import.
