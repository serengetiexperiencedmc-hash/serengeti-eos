# C1 — Implementation Sequence

**Status:** Proposed — execute only after architecture approval

## Phased delivery

| Phase | Scope | Exit criteria |
| --- | --- | --- |
| **C1.1** | Database/domain foundation | Migration, domain types, module skeleton |
| **C1.2** | Organization + organization units | CRUD, lifecycle, audit |
| **C1.3** | Contacts + relationships | Multi-org links, org-org relationships |
| **C1.4** | Accounts | Ownership, ABAC |
| **C1.5** | Activities + notes + tasks | Full activity model |
| **C1.6** | Search + duplicate detection | Tenant-safe search, candidate queue |
| **C1.7** | Controlled merge | Re-point, provenance, events |
| **C1.8** | Authorization + audit integration | Permissions, SoD, full audit |
| **C1.9** | I4 event integration | Catalogue registration, outbox |
| **C1.10** | Security/concurrency/integration tests | Full test matrix green |

Do **not** build complete CRM UI + all backend in one step.

## Module layout

```
apps/api/src/crm/
  organization.ts
  organization-unit.ts
  contact.ts
  relationship.ts
  account.ts
  activity.ts
  note.ts
  task.ts
  duplicate.ts
  merge.ts
  search.ts
  tags.ts
  external-identifier.ts
  routes.ts
packages/db/migrations/004_c1_crm.sql
apps/api/src/crm.security.regression.test.ts
apps/api/src/crm.integration.test.ts
docs/architecture/openapi/crm-c1.yaml
```

## C1 gate submission

After C1.10, return with:

1. Architecture diff (preview vs implemented)
2. Database migrations
3. API specification (OpenAPI)
4. RBAC/ABAC evidence
5. Tenant-isolation evidence
6. SoD evidence
7. Audit evidence
8. Duplicate-detection evidence
9. Merge evidence
10. Event evidence
11. Concurrency evidence
12. Security regression results
13. Performance baseline (CRM API latency samples)
14. Observability evidence
15. Test results (full matrix)
16. Unresolved risks
17. ADR changes (if any)

**Do not advance to C2** until gate approval — passing tests alone is insufficient.

## Authorization reminder

| Status | |
| --- | --- |
| C1 architecture | READY FOR REVIEW |
| C1 implementation | NOT YET AUTHORIZED |
| C2+ | BLOCKED until C1 gate |
