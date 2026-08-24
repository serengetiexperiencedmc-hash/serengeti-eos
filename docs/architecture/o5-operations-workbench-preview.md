# O5 Operations Workbench — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **O5** |
| Capability name | Operations Workbench |
| Predecessor | O4 Guest Vouchers (ops family); phase predecessor C10 Booking Command Center |
| Architecture status | This document is the O5 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Computed at runtime from C9 bookings + O1–O4 + I9 conflicts. Schema comment `078_o5_operations_workbench.sql`. ADR-0017 not reopened |
| Runtime health increment | `O5` |
| Production / UAT / AI | Not authorized |

The sections after this heading are the architecture contract.

---

## Objective

Give operations users a tenant-isolated **workbench** of active bookings so they can find and execute O1–O4 work without typing a booking UUID or entering only via Commercial booking detail.

## User / business purpose

After C9 confirmation and C10 command-center snapshot, operations still cannot discover “what needs work” from the application shell. The workbench is the Booking → Operations connection: a queue of bookings with handover, supplier, manifest, voucher, field-task, and sync-exception signals, linking into the existing `/commercial/operations/[bookingId]` workspace.

## Scope (O5 increment)

| Deliverable | In scope |
| --- | --- |
| Ops workbench list API | Yes — `GET /v1/ops/workbench` |
| Tenant-scoped ops health + `ops:read:operations` | Yes |
| UI `/commercial/operations` | Yes — table, filters, empty/loading/error, links |
| Navigation | Yes — Operations Workbench under Operations |
| New operational entities (issues register, documents, comms) | No |
| Drag-and-drop / assignment board | No |
| Reopening O1–O4 workspace behaviour | No — link only |
| Live PostgreSQL verification | No (ADR-0017) |

## UI requirements

- Page `/commercial/operations` — workbench table of active bookings
- Columns: booking code/title, client (CRM org name when available), status, handover %, attention flags, actions
- Actions: **Open workspace** → `/commercial/operations/[bookingId]`; **Command center** → `/commercial/bookings/[id]`
- Filter: All vs Needs attention; optional status filter
- Search: booking code / title (client-side on loaded items is acceptable if API also supports `q`)
- Loading, empty, unauthenticated, and error states
- Existing booking workspace gains a **Workbench** back link

## Navigation requirements

Add **Operations Workbench** as the first item in the existing Operations nav section (`href: /commercial/operations`). Do not invent a new department. Do not remove Event Infrastructure, Analytics, Field App, or Sync Conflicts.

## API requirements

| Method | Path | Permission |
|--------|------|------------|
| GET | `/v1/ops/health` | `ops:read:operations` (tenant-scoped counts; increment `O5`) |
| GET | `/v1/ops/workbench` | `ops:read:operations` |

### Workbench query

| Param | Meaning |
| --- | --- |
| `attention=true` | Only bookings with pending handover, pending supplier confs, draft vouchers, open field tasks, or unresolved sync conflicts |
| `status` | Filter by booking status |
| `q` | Case-insensitive match on `bookingCode` or `title` |

Active booking statuses (same as J2): `confirmed`, `handover_pending`, `handed_over`.

### Workbench item (no `tenantId`)

`bookingId`, `bookingCode`, `title`, `organizationId`, `status`, `handoverProgressPercent`, `pendingHandoverTasks`, `supplierConfirmationsPending`, `manifestStatus`, `vouchersDraft`, `fieldTasksOpen`, `syncConflicts`, `attentionRequired`, optional `paxCount`, `travelDates`.

J2 `/v1/analytics/operations/bookings` remains the analytics-permissioned rollup. O5 does not replace J2.

## Data / schema / migration

No new tables. Runtime aggregation from `bkg_bookings`, `bkg_handover_tasks`, O1 confirmations, O2 manifests, O3 field tasks, O4 vouchers, I9 sync conflicts.

Migration `078_o5_operations_workbench.sql` — schema comment only.

## Permissions / authentication / tenant isolation

- Unauthenticated → 401
- Missing `ops:read:operations` → 403 (Alice finance fixture)
- Wrong-tenant rows never appear in health counts or workbench items
- Object IDs from another tenant are simply absent from the list (list endpoint is not a 404)
- Partner fixture (`partner@external.local`) has no `ops:read:operations` → 403 (same as Alice)

## Workflow / state transitions

None. O5 is a read-only queue. Mutations remain O1–O4.

## Validation / failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Unknown query keys | Ignored |
| Empty result | 200 `{ items: [] }` |

## Persistence / audit

Dev/Test in-memory SoR. No new audit events (read-only). Responses omit `tenantId`.

## Acceptance criteria

1. Authenticated ops reader sees tenant bookings that need operational work, with links into the existing workspace.
2. Health counts are tenant-scoped and require `ops:read:operations`.
3. Alice cannot read health or workbench (403).
4. Partner tenant does not see SEDMC bookings on the workbench.
5. Nav exposes the workbench without duplicating O1–O4 tabs.
6. Web typecheck passes.

## Tests

- API: health 401/403, tenant-scoped counts, workbench items, `attention` filter, partner isolation
- Regression: existing `o1-ops.test.ts`, `o4-vouchers.test.ts`
- Web typecheck

## Explicit exclusions

- New issue/exception entity beyond existing sync conflicts and pending ops signals
- Supplier payment tracking (Finance family)
- Analytics date-range / finance KPIs (J family)
- UAT, Production, live PostgreSQL, AI/LLM apply
- C11, I3.38, I4.35, I20.23, PG.30

## Dependencies

O1–O4, C9 bookings, I9 conflicts (read), C1 organizations for client names in UI.
