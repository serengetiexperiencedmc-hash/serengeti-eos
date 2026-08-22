# I9.2 Encrypted Field Cache — Preview

Increment **I9.2** adds **AES-GCM client-side encryption** for field PWA offline cache (extends I9).

## Kernel

- `packages/kernel/src/field-cache-crypto.ts` — `encryptFieldCachePayload`, `decryptFieldCachePayload`, policy constants

## Database

- `packages/db/migrations/031_i9_encrypted_cache.sql` — policy documentation comment

## API (`/v1/ops/sync`)

Policy v2 adds:

| Field | Value |
| --- | --- |
| `policyVersion` | `2` |
| `cacheEncryption` | `aes-gcm-v1` |
| `requireEncryptedCache` | `true` |

Pull session now includes `principalId` for per-device key derivation.

## Client encryption

- Key material: `deviceId + principalId + device salt` → SHA-256 → AES-GCM-256
- Storage: encrypted blob in `localStorage` (legacy plain JSON auto-migrated on read)
- Metadata: principal ID stored in sidecar key for decrypt

## UI

- `/field` — shows encrypted cache indicator
- `/field/[bookingId]` — offline task changes persisted encrypted

## Security note (Dev/Test)

This is **client-side encryption at rest** on the field device — not a substitute for full UEM or hardware-backed keys in Production.

See also: [I9 Field Sync preview](./i9-field-sync-preview.md)
