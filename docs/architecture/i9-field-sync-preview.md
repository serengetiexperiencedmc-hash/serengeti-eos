# I9 Field Offline Sync — Preview

Increment **I9** adds offline-capable field sync on top of O3 field ops.

## Kernel

- `packages/kernel/src/ops-field-sync.ts` — session, conflict rules, version gates

## Database

- `packages/db/migrations/026_i9_field_sync.sql`

## API (`/v1/ops/sync`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Sync module health |
| GET | `/policy` | Cache policy (allowed/denied offline entities) |
| POST | `/pull` | Download assigned booking bundle |
| POST | `/push` | Upload client deltas (field tasks) |
| GET | `/conflicts` | Unresolved conflicts |
| POST | `/conflicts/:id/resolve` | Resolve server_wins / client_wins |

## Conflict rules

- **Field tasks:** version LWW; stale client → conflict
- **Manifest entries:** manual merge only (offline denied)
- **Finance:** never offline-writable

## J1 integration

`fieldSyncConflicts` count exposed in `/v1/analytics/commercial/summary` and dashboard.

## UI

- **`/field`** — mobile-first field PWA (download bundle, offline task completion, sync)
- **`/field/[bookingId]`** — cached tasks + ops brief with offline queue
- **`/commercial/sync`** — ops desk conflict resolution (server wins / accept field)
- Sidebar nav badges wired to live J1 + sync counts

## I9.2 Encrypted cache

Client-side **AES-GCM** encryption for offline bundles. See [I9.2 Encrypted Field Cache preview](./i9-encrypted-cache-preview.md).
