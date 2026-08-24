# I14 PAM — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I14** |
| Capability name | PAM / bounded Dev/Test secrets |
| Predecessor | I1 (CLOSED); I13 SOC closed and not reopened |
| Architecture status | This document is the I14 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `085_i14_pam.sql`. ADR-0017 not reopened |
| Runtime health increment | `I14` |
| Production / UAT / AI | Not authorized |

Authority: backlog I14 (JIT, vault refs; not custom VPN) plus explicit 2026-08-24 governance **I14 = B**: opaque `secretRef` strings, no real secrets, no production vault, in-memory JIT grants with expiry, RBAC `pam:*`, audit via existing request/audit mechanisms. ADR-0012 remains the production secrets platform and is **not** reopened. ZTNA/custom VPN is out of scope.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **bounded Dev/Test PAM workspace**: register opaque secret references (never values) and issue time-bounded JIT permission grants that overlay the existing RBAC set until expiry or revoke.

## User / business purpose

Phase 3 PAM starts without choosing HashiCorp Vault or cloud KMS. Operators need a Dev/Test place to record vault-shaped refs and grant short-lived extra permissions.

## Scope

| Deliverable | In scope |
| --- | --- |
| Opaque `secretRef` catalogue (`ref://…` only) | Yes |
| Retire a ref (no delete of history) | Yes |
| JIT grant of an existing catalog permission with TTL | Yes |
| Overlay active grants onto the caller’s permissions at request time | Yes |
| Tenant-scoped `/v1/pam/health` increment `I14` | Yes |
| Visible **Security → PAM** | Yes |
| Production vault / KMS / real secret values | No |
| ZTNA / custom VPN / session recording appliance | No |
| Dual-control break-glass (platform.break_glass) | No |

## Non-scope

- Reopening ADR-0012 / ADR-0013
- Storing passwords, tokens, or key material
- Claiming production secrets capability
- I15+ GRC, I17 backup, I19 knowledge

## Domain model

**pam_secret_refs**

- `refCode` unique per tenant (`SRF-0001`)
- `label` required
- `secretRef` opaque, must match `ref://` + path (not a secret value)
- `status`: `active` \| `retired`
- optional `purpose` (max 500 chars)
- timestamps + createdByPrincipalId (not returned)

**pam_jit_grants**

- `grantCode` unique per tenant (`JIT-0001`)
- subject is a same-tenant principal (stored internally; responses expose `subjectEmail` only)
- `permissionKey` from the tenant role-permission catalog
- `expiresAt` from TTL (60–28800 seconds)
- `revokedAt` optional
- computed `status`: `active` \| `expired` \| `revoked`
- optional `reason` (max 500 chars)

JIT cannot grant `pam:write:grant`, `pam:revoke:grant`, or `pam:write:ref` (PAM administration is not JIT-elevatable).

## Persistence / migration

`085_i14_pam.sql`. Runtime remains in-memory. Live PostgreSQL UNVERIFIED.

## Workflow

| Action | Result |
| --- | --- |
| create ref | active |
| retire ref | retired (terminal for write) |
| create grant | active until expiry |
| revoke grant | revoked |
| request after expiry | grant ignored in overlay |

## API

All JSON omits `tenantId` and `principalId`. Responses never include a secret value field.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/pam/health` | `pam:read:ref` |
| GET | `/v1/pam/refs` | `pam:read:ref` |
| POST | `/v1/pam/refs` | `pam:write:ref` |
| GET | `/v1/pam/refs/:id` | `pam:read:ref` |
| POST | `/v1/pam/refs/:id/retire` | `pam:write:ref` |
| GET | `/v1/pam/grants` | `pam:read:grant` |
| POST | `/v1/pam/grants` | `pam:write:grant` |
| POST | `/v1/pam/grants/:id/revoke` | `pam:revoke:grant` |

Create ref: `{ label, secretRef, purpose? }`.  
Create grant: `{ subjectEmail, permissionKey, ttlSeconds, reason? }`.

## RBAC

| Permission | Intent |
| --- | --- |
| `pam:read:ref` | Health + list/get refs |
| `pam:write:ref` | Create / retire refs |
| `pam:read:grant` | List grants |
| `pam:write:grant` | Issue JIT |
| `pam:revoke:grant` | Revoke JIT |

`platform.admin` — all. Alice and partner — 403. `security.analyst` and `it.agent` do not receive PAM.

## Tenant isolation

Every query is tenant-scoped. Missing / wrong-tenant id → 404. Cross-tenant `subjectEmail` → 404.

## UI

- `/commercial/pam`
- Nav **Security → PAM**
- Ref form (opaque `ref://` only), queue, retire
- JIT form (subject email, permission, TTL), revoke
- Loading / empty / error states

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Invalid `secretRef` / empty label / bad TTL | 400 |
| Duplicate active `secretRef` | 409 |
| Illegal retire / revoke | 409 |
| Unknown subject email | 404 |
| Protected PAM permission as JIT target | 400 |

## Security

No tenant/principal ids in JSON. No secret values. ADR-0012 not reopened. Tests are authz/control tests.

## Audit

Create/retire/grant/revoke use existing request logs. No extra audit stream.

## Testing

- 401/403, Alice/partner, tenant isolation, no secret leak
- Ref create/retire; reject non-`ref://` values
- JIT overlay lets a subject call a previously forbidden read API until expiry/revoke
- Web typecheck
- Regression I13

## Acceptance criteria

1. Carol can register a `ref://` pointer and issue a JIT grant from **Security → PAM**.
2. Alice and partner cannot read PAM APIs.
3. No secret value is stored or returned.
4. Health increment is `I14`.
5. ADR-0012 is not reopened; no vault product name.

## Exclusions

- ZTNA, custom VPN, production vault, I15+, numeric placeholder IDs
- UAT, autonomous AI

## Verification limitations

Live PostgreSQL UNVERIFIED. Live preview verification uses the existing `dev:preview` process when it already serves I14; otherwise UNVERIFIED (stale process is not a governance blocker).

## Rollback

Additive migration and in-memory collections. Disable by not registering routes.

## Dependencies

I1 principals/roles. I13 is not a runtime dependency and stays closed.
