# J3 Finance Analytics — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **J3** |
| Capability name | Finance Analytics |
| Predecessor | J2 Operations Analytics; I8.4 Booking Financial Control |
| Architecture status | This document is the J3 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | Computed at runtime from C9 + I8 + C6. Schema comment `080_j3_finance_analytics.sql`. ADR-0017 not reopened |
| Runtime health increment | `J3` |
| Production / UAT / AI | Not authorized |

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Finance** analytics view that rolls up client revenue, supplier cost, margin, invoiced/paid/outstanding amounts from live OLTP (not a duplicate dataset), with optional date-range filtering.

## User / business purpose

J1 counts outstanding invoices; I8.4 shows one booking. Management still cannot see tenant-wide finance performance. J3 is the Finance → Analytics connection.

## Scope

| Deliverable | In scope |
| --- | --- |
| `GET /v1/analytics/finance/summary` | Yes |
| Tenant-scoped analytics health + permission | Yes |
| Analytics UI Finance tab + date range | Yes |
| Nav: Analytics as its own section | Yes |
| Lakehouse / warehouse | No |
| Reopening J1/J2 metric definitions | No — new endpoint |
| Live PostgreSQL | No |

## UI

- `/commercial/analytics` — third tab **J3 Finance**
- Stat cards: revenue, supplier cost, margin %, outstanding
- Secondary: invoiced, paid, invoice count, recon exceptions
- Date inputs `from` / `to` (inclusive, filter on booking `confirmedAt`)
- Empty/loading/error states
- Link to `/commercial/finance`

## Navigation

Move **Analytics** out of the Operations section into its own **Analytics** section (`href` unchanged). Operations keeps Workbench, Event Infrastructure, Field App, Sync Conflicts.

## API

| Method | Path | Permission |
|--------|------|------------|
| GET | `/v1/analytics/health` | `analytics:read:commercial` (tenant-scoped; increment `J3`) |
| GET | `/v1/analytics/finance/summary?from=&to=` | `analytics:read:finance` |

Add `analytics:read:finance` to existing `ANALYTICS_PERMS` (Carol, commercial manager). Alice remains 403. Partner 403.

Date params are ISO dates (`YYYY-MM-DD`). Invalid dates → 400 `invalid_date_range`. Omitted → all bookings.

Bookings in range: tenant, not archived, `status !== cancelled`, `confirmedAt` within `[from, to]` (end of `to` day inclusive). Cost sheets matched by programme/RFP as in I8.4.

## Summary payload (no `tenantId`)

`bookingCount`, `clientRevenue`, `supplierCost`, `marginAmount`, `marginPercent`, `invoicedTotal`, `paidTotal`, `outstandingTotal`, `outstandingInvoiceCount`, `reconciliationExceptions`, `currency`, `asOf`, optional `from`, `to`.

Uses `computeMarginAmount` / `computeMarginPercent` / `computeFinanceOutstanding`.

## Data / migration

No new tables. `080_j3_finance_analytics.sql` — schema comment.

## Failure semantics

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Invalid from/to | 400 |
| No bookings in range | 200 with zero totals |

## Acceptance criteria

1. Finance tab shows amount-based KPIs from C9/I8/C6, not fabricated series.
2. Date range filters booking-confirmed population.
3. Health tenant-scoped and permissioned (`J3`).
4. Alice 403 on health and finance summary.
5. Web typecheck passes.

## Tests

- Health 401/403, tenant-scoped
- Finance summary math + date filter + Alice 403
- Regression: `o1-ops.test.ts` J1 case, `j2-ops-analytics.test.ts`

## Exclusions

- Forecasts / AI
- Supplier scorecards beyond cost rollup
- UAT, Production
- C11, I3.38, I4.35, I20.23, PG.30

## Dependencies

J1–J2 UI tabs, I8.4 helpers, C9 bookings, C6 cost sheets.
