# I8 Finance Reconciliation — Preview

Increment **I8** extends the commercial chain with quotes, deposit/progress/final invoices, and payment reconciliation with I0 SoD (no live banking).

## Kernel

- `packages/kernel/src/finance-invoice.ts`
- `packages/kernel/src/finance-reconciliation.ts`
- `packages/kernel/src/finance-quote.ts`

## Database

- `packages/db/migrations/025_i8_finance.sql` — invoices & reconciliations
- `packages/db/migrations/027_i8_quotes.sql` — client quotes

## API (`/v1/finance`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Module health |
| GET | `/quotes` | List quotes |
| POST | `/quotes` | Create quote from booking |
| POST | `/quotes/:id/send` | Send quote to client |
| POST | `/quotes/:id/accept` | Accept sent quote |
| GET | `/invoices` | List invoices |
| POST | `/invoices/deposit` | Create 30% deposit from booking |
| POST | `/invoices/progress` | Create progress invoice (40% default) |
| POST | `/invoices/final` | Create final invoice (remaining balance) |
| POST | `/invoices/:id/issue` | Issue invoice + open reconciliation |
| POST | `/invoices/:id/payments` | Record payment against invoice (direct) |
| POST | `/invoices/:id/payment-requests` | Create I0 SoD payment request |
| POST | `/invoices/:id/apply-payment` | Apply approved payment to invoice |
| POST | `/payments/:approvalId/approve` | Finance approver approves payment |
| GET | `/reconciliations` | List reconciliations |
| POST | `/reconciliations/:id/resolve` | Manually resolve exception |

Issuing a deposit invoice auto-completes C9 handover task `deposit_invoice`.

## SoD flow

1. Commercial user requests payment → creates `/v1/payments` with pending approval
2. Different finance approver (`bob.approver@sedmc.local`) approves via `/v1/finance/payments/:approvalId/approve`
3. Apply approved payment to invoice → updates reconciliation

## UI

- `/commercial/finance` — quotes, invoices (issue, SoD payment), reconciliation resolve
- `/commercial/bookings/[id]` — link to finance & operations
- Dashboard second row — suppliers, CRM, sync/recon counts

## Demo seed

`BKG-2026-0847` — quote sent, deposit invoice issued, partial payment (reconciliation exception).

## I8.3 — Final invoice automation

See **`i8.3-finance-preview.md`** for eligibility gate, auto-create endpoint, and payment request queue.
