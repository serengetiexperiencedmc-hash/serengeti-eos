# C1 — API Specification (Preview)

**Status:** Proposed — OpenAPI file on implementation approval  
**Base path:** `/v1/crm`  
**Auth:** Bearer token (Dev/Test local IdP)

## Conventions

- `Authorization: Bearer <token>` required
- `X-Correlation-Id` propagated to audit + outbox
- `Idempotency-Key` on: create org/contact, merge, bulk import commit, archive, owner reassignment
- Optimistic concurrency: `If-Match: <version>` on PATCH
- Cross-tenant ID → `404`
- Pagination: cursor (`?cursor=&limit=`)

## Organizations

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/organizations` | `crm:read:organization` |
| POST | `/organizations` | `crm:write:organization` |
| GET | `/organizations/:id` | `crm:read:organization` |
| PATCH | `/organizations/:id` | `crm:write:organization` |
| POST | `/organizations/:id/transitions` | `crm:transition:organization` |
| POST | `/organizations/:id/archive` | `crm:archive:organization` |

## Organization units

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/organizations/:orgId/units` | `crm:read:organization` |
| POST | `/organizations/:orgId/units` | `crm:write:organization` |
| PATCH | `/organization-units/:id` | `crm:write:organization` |

## Contacts

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/contacts` | `crm:read:contact` |
| POST | `/contacts` | `crm:write:contact` |
| GET | `/contacts/:id` | `crm:read:contact` |
| PATCH | `/contacts/:id` | `crm:write:contact` |
| POST | `/contacts/:id/archive` | `crm:write:contact` |

## Relationships

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/relationships` | `crm:read:relationship` |
| POST | `/relationships` | `crm:write:relationship` |
| PATCH | `/relationships/:id` | `crm:write:relationship` |
| POST | `/relationships/:id/transitions` | `crm:write:relationship` |

## Accounts

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/accounts` | `crm:read:account` |
| POST | `/accounts` | `crm:write:account` |
| GET | `/accounts/:id` | `crm:read:account` |
| PATCH | `/accounts/:id` | `crm:write:account` |
| POST | `/accounts/:id/reassign-owner` | `crm:reassign:account_owner` |

## Activities & notes

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/activities` | `crm:read:activity` |
| POST | `/activities` | `crm:write:activity` |
| GET | `/activities/:id` | `crm:read:activity` |
| POST | `/notes` | `crm:write:activity` |
| GET | `/notes` | `crm:read:activity` |

## Tasks

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/tasks` | `crm:read:task` |
| POST | `/tasks` | `crm:write:task` |
| PATCH | `/tasks/:id` | `crm:write:task` |
| POST | `/tasks/:id/complete` | `crm:write:task` |
| POST | `/tasks/:id/cancel` | `crm:write:task` |

## Search

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/search` | read per entity type |

Query params: `q`, `types[]=organization|contact|account|activity|task`, filters (status, owner, country, type). **Tenant filter mandatory at service layer.**

## Duplicates & merge

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/duplicates` | `crm:read:duplicate` |
| GET | `/duplicates/:id` | `crm:read:duplicate` |
| POST | `/duplicates/:id/review` | `crm:review:duplicate` |
| POST | `/merges` | `crm:merge:record` |

Review body: `{ "decision": "confirm"|"reject", "reason": "..." }`  
Merge body: `{ "survivorId", "duplicateIds[]", "fieldResolutions": {}, "reason" }`

## Tags & external identifiers

| Method | Path | Permission |
| --- | --- | --- |
| GET/POST | `/tags` | admin read/write |
| POST | `/external-identifiers` | `crm:write:organization` or contact |

## Error model

```json
{ "error": "forbidden|not_found|conflict|invalid_request", "reason": "..." }
```

## Implementation artifact

On C1 approval: `docs/architecture/openapi/crm-c1.yaml`
