# C1 — Test Matrix

**Status:** Proposed — C1 gate acceptance criteria

## Unit tests

| Area | Cases |
| --- | --- |
| Organization lifecycle | Valid/invalid transitions per state model |
| Relationship lifecycle | Including backward with reason |
| Task lifecycle | Open → InProgress → Completed/Cancelled/Deferred |
| Duplicate scoring | Name, domain, email combinations |
| Normalization | Email, phone, org name |
| Merge re-point logic | Relationships, activities, tasks |
| Rules integration | Effective rule deny/allow |
| Optimistic concurrency | Version mismatch |

## API tests

| Area | Cases |
| --- | --- |
| CRUD | All entity types |
| Search | Tenant-scoped results |
| Archive | Soft archival |
| Idempotency | Create org, merge with same key |
| Pagination | Cursor stability |
| Validation | Required fields |

## Security tests

See [security-test-plan.md](./security-test-plan.md) — all TI/AZ/SD/IN/MG cases.

## Integration tests

| Area | Cases |
| --- | --- |
| PostgreSQL | CRUD + FK constraints (`EOS_RUN_PG_TESTS=1`) |
| Audit chain | Create → update → transition verifiable |
| Outbox | Domain write + event pending; publish cycle |
| Workflow stub | Merge workflow instance linkage (if enabled) |

## Concurrency tests

| Area | Cases |
| --- | --- |
| Simultaneous org update | One wins, one 409 |
| Duplicate concurrent create same domain | Two candidates or dedupe |
| Concurrent merge | Safe failure |
| Task assignment race | Single assignee |

## Failure scenarios

| Scenario | Expected |
| --- | --- |
| DB unavailable | 503 on /ready; no partial commit |
| Outbox write failure | Domain rollback |
| Event publish failure | Outbox pending; recoverable |
| Stale If-Match | 409 |
| Unauthorized mutation | 403 + deny audit |
| Tenant mismatch | 404 |
| Partial bulk import failure | Batch status failed; no half-commit |
| Failed merge mid-flight | No partial merge; audit error |

## C1 DoD checklist

- [ ] Organization + units
- [ ] Contacts + relationships (incl. org-org)
- [ ] Accounts + ownership
- [ ] Activities + notes + tasks
- [ ] Lifecycles enforced
- [ ] Tenant isolation
- [ ] RBAC/ABAC/SoD
- [ ] Audit complete
- [ ] Duplicate detection + merge
- [ ] Search
- [ ] PostgreSQL persistence
- [ ] I4 events registered + emitted
- [ ] Observability metrics
- [ ] Security regression pass
- [ ] Concurrency tests pass
- [ ] Documentation complete

Evidence = Development/Test only.
