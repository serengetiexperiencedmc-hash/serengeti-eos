# I3.1 Email Notification Adapter — Preview

Increment **I3.1** adds a Dev/Test email adapter that records urgent and warning inbox alerts to an outbox instead of sending SMTP.

## Kernel

- `packages/kernel/src/notification-email.ts`
  - `EmailNotificationAdapter`, `EmailNotificationMessage`, `NotifEmailOutboxEntry`
  - `buildEmailFromNotification()` — subject/body from live `NotifItem`
  - `shouldEmailNotification()` — urgent + warning only (info stays in-app)

## Database

- `packages/db/migrations/032_i3_email_outbox.sql` — per-principal outbox with unique `(tenant, principal, notification_key)`

## API

| Method | Path | Permission | Description |
| --- | --- | --- | --- |
| GET | `/v1/notifications/email/health` | auth | Adapter health + outbox count |
| GET | `/v1/notifications/email/outbox` | `notification:read:email_outbox` | List dispatched emails for caller |
| POST | `/v1/notifications/email/dispatch-digest` | `notification:dispatch:email` | Send digest for eligible live notifications |

Permissions added: `notification:read:email_outbox`, `notification:dispatch:email` (granted to admin/commercial roles in Dev/Test seed).

## Dev adapter

`dev-outbox` writes to in-memory `notifEmailOutbox` with status `sent`. Duplicate dispatch for the same notification key is skipped (`already_dispatched`).

## UI

- **`/commercial/notifications`** — "Dispatch email digest" action + email outbox panel
- Combined health on `/v1/notifications/health` reports `I3-I3.1` with outbox count

## Future (Phase 1+)

Replace `dev-outbox` with SMTP/SES adapter, template registry, retry queue, and tenant branding — outbox schema is forward-compatible.
