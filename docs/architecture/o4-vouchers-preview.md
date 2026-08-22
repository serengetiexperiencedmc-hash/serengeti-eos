# O4 Guest Vouchers — Preview

Increment **O4** issues per-guest activity vouchers from a **published manifest**, completing the C9 handover task `guest_vouchers` when all vouchers are issued.

## Kernel

- `packages/kernel/src/ops-voucher.ts` — `OpsVoucher`, `buildVoucherCode`, `canIssueVoucher`

## Database

- `packages/db/migrations/029_o4_vouchers.sql` — `ops_voucher` table

## API (`/v1/ops`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/vouchers?bookingId=` | List vouchers for a booking |
| POST | `/vouchers/generate` | Create draft vouchers from published manifest entries |
| POST | `/vouchers/:id/issue` | Issue a single draft voucher |
| POST | `/vouchers/issue-all` | Issue all draft vouchers for a booking |

Permissions: `ops:read:operations`, `ops:write:operations`

## Behaviour

- **Generate** — one `guest_activity` voucher per manifest entry; skips entries that already have a non-void voucher
- **Voucher codes** — `VCH-{booking}-001` pattern via `buildVoucherCode`
- **Handover sync** — when every non-void voucher for a booking is `issued`, auto-completes handover task `guest_vouchers`

## UI

- `/commercial/operations/[bookingId]` — **Vouchers** tab: generate from manifest, issue all, issue individual

## Demo seed

`BKG-2026-0847` — after manifest publish, 3 guest vouchers generated and issued (handover task complete).

## Notifications (I3)

Draft vouchers pending issue surface as an actionable alert in the notifications inbox.
