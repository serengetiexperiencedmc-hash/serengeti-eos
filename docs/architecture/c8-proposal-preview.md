# C8 Proposal Engine — Preview

## Lifecycle status (reconciled for C8 completion)

| Field | Value |
| --- | --- |
| Increment ID | **C8** |
| Capability name | Proposal Engine |
| Predecessor | C7 Commercial Approval |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Dev/Test in-memory read SoR; PostgreSQL schema `020_c8_proposal.sql` (schema-only). ADR-0017 not reopened |

---

Increment **C8** generates structured commercial proposals from approved programme and costing data.

## Kernel

- `packages/kernel/src/proposal.ts` — `PropProposal`, `PropProposalVersion`, `canGenerateProposal`, status transitions
- `packages/kernel/src/proposal-events.ts` — domain event catalogue

## Database

- `packages/db/migrations/020_c8_proposal.sql` — `prop_proposals`, `prop_proposal_versions`

## API (`/v1/proposals`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `proposal:read:proposal` (tenant-scoped) |
| GET/POST | `/proposals` | List / generate from RFP |
| GET | `/proposals/by-rfp/:rfpId` | Proposal for an RFP |
| GET | `/proposals/:id` | Detail with programme, cost lines, versions |
| POST | `/proposals/:id/transitions` | Send, accept, reject |
| POST | `/proposals/:id/versions` | New version snapshot |

Permissions: `proposal:read:proposal`, `proposal:write:proposal`, `proposal:transition:status`, `proposal:write:version`

Generation requires an **approved** C7 commercial approval plus programme and cost sheet.

## UI

- `/commercial/proposals` — live proposal list
- `/commercial/proposals/[id]` — detail with programme, costing, send action
- RFP detail links to proposal; generate when finance approved
- Dashboard **Create Proposal** → proposals list

## Demo seed

After Bob approves `APR-2026-0847`, Carol generates `PROP-2026-0847` and sends it ($285,000).

## Next

**C9 Booking & Handover** — confirmation and operational handover from accepted proposals.
