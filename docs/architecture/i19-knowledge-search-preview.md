# I19 Knowledge / Search — Preview

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **I19** |
| Capability name | Knowledge / Search |
| Predecessor | I0 kernel (complete); I15 ERM complete and not a runtime dependency |
| Architecture status | This document is the I19 contract |
| Implementation status | **IMPLEMENTED / COMPLETE** |
| Environment | Development/Test only |
| Persistence | In-memory store + additive SQL `087_i19_knowledge.sql`. ADR-0017 not reopened |
| Runtime health increment | `I19` |
| Production / UAT / AI | Not authorized |

Authority: backlog I19 (authority states, permissioned search; not graph DB) plus explicit 2026-08-24 governance **I19 = B**: document types `policy` \| `sop` \| `note`; authority states `draft` \| `authoritative` \| `retired`; publisher is a tenant principal possessing `knowledge:write:document`; tenant-scoped search with query parameter `q` over title/body; no external search index; no graph database; no autonomous publishing; tenant isolation mandatory.

The sections after this heading are the architecture contract.

---

## Objective

Deliver a **Knowledge** workspace where an internal user can author tenant-scoped documents, publish them as authoritative, retire them, and search title/body — not a knowledge graph, not an external search product, and not AI auto-publish.

## Scope

| Deliverable | In scope |
| --- | --- |
| Document create / list / get / patch (draft only) | Yes |
| Types: `policy` \| `sop` \| `note` | Yes |
| States: `draft` \| `authoritative` \| `retired` | Yes |
| Human publish (`draft` → `authoritative`) | Yes |
| Retire (`draft` or `authoritative` → `retired`) | Yes |
| Tenant-scoped search `GET …?q=` over title and body | Yes |
| Tenant-scoped `/v1/knowledge/health` increment `I19` | Yes |
| Visible **Knowledge → Documents** | Yes |
| External search index / Elasticsearch / vector DB | No |
| Graph database / knowledge-graph projection | No |
| Autonomous / AI publishing | No |
| Version history table | No (single current row) |

## Domain model

**knowledge_documents**

- `docCode` unique per tenant (`DOC-0001`)
- `title` required
- optional `body` (max 20000)
- `documentType`: `policy` \| `sop` \| `note`
- `authorityState`: `draft` \| `authoritative` \| `retired`
- timestamps + createdByPrincipalId (not returned)

Retired is terminal. No graph nodes/edges. No indexed-document sidecar.

## Persistence / migration

`087_i19_knowledge.sql`. Runtime in-memory. Search is an in-process tenant-scoped filter equivalent to SQL `ILIKE` on title/body. Live PostgreSQL UNVERIFIED.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create | draft |
| draft | patch title/body/type | draft |
| draft | publish | authoritative |
| draft / authoritative | retire | retired |
| authoritative / retired | patch | forbidden |
| retired | publish | forbidden |

Publisher: any same-tenant principal with `knowledge:write:document`. No second approver. No autonomous publisher.

## API

JSON omits `tenantId` and `principalId`.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/knowledge/health` | `knowledge:read:document` |
| GET | `/v1/knowledge/documents?q=&type=&state=` | `knowledge:read:document` |
| POST | `/v1/knowledge/documents` | `knowledge:write:document` |
| GET | `/v1/knowledge/documents/:id` | `knowledge:read:document` |
| PATCH | `/v1/knowledge/documents/:id` | `knowledge:write:document` |
| POST | `/v1/knowledge/documents/:id/publish` | `knowledge:write:document` |
| POST | `/v1/knowledge/documents/:id/retire` | `knowledge:write:document` |

`q` matches title or body (case-insensitive). Empty `q` lists the tenant catalogue.

## RBAC

| Permission | Intent |
| --- | --- |
| `knowledge:read:document` | Health + list/get/search |
| `knowledge:write:document` | Create / patch / publish / retire |

`platform.admin` — all. Alice and partner — 403. No invented `knowledge.member` role (24-rbac has none; governance named the permission, not a new role).

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404.

## UI

- `/commercial/knowledge`
- Nav section **Knowledge → Documents**
- Create form, search `q` against the API, queue, detail, publish/retire
- Loading / empty / error states

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Empty title / invalid type or state | 400 |
| Patch when not draft / illegal transition | 409 |

## Security

No tenant/principal ids in JSON. No autonomous publish. Search cannot cross tenants.

## Testing

- 401/403 Alice/partner, tenant isolation
- Create, patch draft, publish, retire; `q` hits body
- Web typecheck
- Regression I15

## Acceptance criteria

1. Carol can create a document, search it by body text, and publish it from **Knowledge → Documents**.
2. Alice and partner cannot read Knowledge APIs.
3. Health increment is `I19`.
4. No graph tables and no external index.

## Exclusions

- I16 internal audit, I17 backup, I20 autonomy expansion, I22 partner edge
- Knowledge graph (doc 10), version history aggregate
- Numeric placeholder IDs, UAT, Production

## Verification limitations

Live PostgreSQL UNVERIFIED. Live preview API UNVERIFIED if the existing process predates I19 (not restarted as a workflow step).

## Rollback

Additive migration. Disable by not registering routes.

## Dependencies

I0 (kernel patterns). I15 is not a runtime dependency.
