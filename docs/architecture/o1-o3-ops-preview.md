# O1–O4 Operations Modules — Preview

Post-commercial **operations** increments extend C9 handover checklist items into first-class operational entities.

## Increments

| ID | Module | Handover task key |
| --- | --- | --- |
| **O1** | Supplier Confirmations | `supplier_confirm` |
| **O2** | Guest Manifests | `guest_manifest` |
| **O3** | Field Ops (brief + tasks) | `ops_brief` |
| **O4** | Guest Vouchers | `guest_vouchers` |

## Kernel

- `packages/kernel/src/ops-supplier-confirmation.ts`
- `packages/kernel/src/ops-manifest.ts`
- `packages/kernel/src/ops-field.ts`
- `packages/kernel/src/ops-voucher.ts`
- `packages/kernel/src/ops-events.ts`

## Database

- `022_o1_ops_supplier_confirmation.sql`
- `023_o2_ops_manifest.sql`
- `024_o3_ops_field.sql`
- `029_o4_vouchers.sql`

## API (`/v1/ops`)

| Area | Key endpoints |
| --- | --- |
| Supplier confirmations | `POST /supplier-confirmations/generate`, `POST /:id/confirm` |
| Manifests | `POST /manifests/by-booking/:id`, `POST /:id/entries`, `POST /:id/publish` |
| Field ops | `PUT /briefs/by-booking/:id`, `POST /briefs/.../issue`, `POST /field-tasks` |
| Vouchers | `POST /vouchers/generate`, `POST /vouchers/:id/issue`, `POST /vouchers/issue-all` |

Permissions: `ops:read:operations`, `ops:write:operations`, `ops:confirm:supplier`, `ops:write:manifest`, `ops:publish:manifest`

Completing ops work **auto-completes** matching C9 handover checklist items by `task_key`.

See also: [O4 Guest Vouchers preview](./o4-vouchers-preview.md)

## UI

- `/commercial/operations/[bookingId]` — tabbed workspace (suppliers, manifest, field ops, vouchers)
- Linked from booking detail **Operations Workspace**

## Demo seed

`BKG-2026-0847` — supplier confirmations generated, 3-guest manifest published, guest vouchers issued, ops brief issued, field task created.
