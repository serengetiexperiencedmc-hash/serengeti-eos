# C2 Opportunity / Pipeline — Preview

## Lifecycle status (reconciled after C2 completion)

| Field | Value |
| --- | --- |
| Architecture status | Existing committed preview remains the C2 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| C1 Gate | PASS — Development/Test only (predecessor) |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `015_c2_opportunity.sql` (schema-only until a separately authorized persist increment). ADR-0017 not reopened |
| Production / UAT / AI | Not authorized |
| Next increments | Not assigned by C2 |

The sections after this heading are the architecture contract.

---

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
