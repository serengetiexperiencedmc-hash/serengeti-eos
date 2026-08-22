# I3 In-App Notifications — Preview

Increment **I3** delivers a live action inbox computed from OLTP state (no separate notification queue in Dev/Test).

## Kernel

- `packages/kernel/src/notification.ts` — `NotifItem`, severity sorting, dismissal model

## Database

- `packages/db/migrations/028_i3_notifications.sql` — per-principal dismissals

## API (`/v1/notifications`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Module health |
| GET | `/` | List actionable notifications + unread count |
| GET | `/unread-count` | Unread badge count |
| POST | `/:key/dismiss` | Dismiss single notification |
| POST | `/dismiss-all` | Dismiss all current items |

Permissions: `notification:read:inbox`, `notification:write:inbox`

## Live sources

| Category | Trigger |
| --- | --- |
| **RFP** | SLA at-risk or breached |
| **Finance** | Reconciliation exception |
| **Operations** | Unresolved field sync conflict |
| **Approval** | Pending payment release (SoD) |
| **Handover** | Booking with pending checklist items |

## UI

- **Topbar bell** — dropdown with dismiss + deep links
- **`/commercial/notifications`** — full action inbox page
- **Nav badge** — unread count on Notifications link

Dismissals are per-principal; underlying issues remain until resolved in source module.

## I3.1 — Email adapter (Dev/Test)

See **`i3-email-preview.md`** for outbox schema, dispatch digest API, and UI outbox panel.
