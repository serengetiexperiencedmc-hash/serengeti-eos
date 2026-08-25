# C1 — Implementation Sequence

> **CURRENT STATE (2026-08-24 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`**  
> This sequence is **historical and already executed**. C1.1–C1.11 are **COMPLETE**. C1 Gate is **PASS** (Dev/Test only). C2–C10 are **CLOSED**. **C11+ is not created and not authorized.**  
> Do not treat this file as an open runbook. **EXECUTION_QUEUE=EMPTY** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED**

**Status:** Historical sequence — **executed** (C1 CLOSED / IMPLEMENTED for Dev/Test)

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

**Do not advance to C2** until gate approval — passing tests alone is insufficient. *(Historical Stage 1/C1-gate sentence. C1 Gate later **PASS**; C2–C10 later **CLOSED**. Not a live queue.)*

## Authorization reminder

| Status | Historical (this document) | Current (HEAD) |
| --- | --- | --- |
| C1 architecture | READY FOR REVIEW | Historical contract — Gate **PASS** |
| C1 implementation | NOT YET AUTHORIZED | **COMPLETE / CLOSED** (Dev/Test) |
| C2+ | BLOCKED until C1 gate | **C2–C10 CLOSED** (Dev/Test, prior authorizations). **C11+ NOT AUTHORIZED** / not created |
