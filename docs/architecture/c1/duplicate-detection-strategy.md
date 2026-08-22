# C1 — Duplicate Detection & Merge Strategy

**Status:** Proposed — mandatory from C1

## Detection signals

| Entity | Signals | Weight (Dev default) |
| --- | --- | --- |
| Organization | Normalized legal/trading name | High |
| Organization | Domain / website | High |
| Organization | Country + name fuzzy | Medium |
| Organization | External identifier match | Definitive |
| Contact | Email exact | High |
| Contact | Phone normalized | Medium |
| Contact | Name + org link | Medium |

## States

`PotentialDuplicate → UnderReview → ConfirmedDuplicate | NotDuplicate`

Never auto-merge. Never silently merge.

## Normalization

- Email: lowercase, trim
- Phone: E.164 where parseable
- Org name: trim, remove common suffixes (Ltd, LLC, …), lowercase for compare
- Domain: strip protocol/www

## Review flow

```
Create/Update → Scorer → if score ≥ threshold → DuplicateCandidate (PotentialDuplicate)
  → GET /duplicates queue
  → POST /duplicates/:id/review { confirm | reject, reason }
  → if confirm → POST /merges (Idempotency-Key) [+ workflow if policy]
```

## Merge architecture

```
Duplicate A + Duplicate B
  → Review → Select survivor → Merge → Preserve provenance → Audit → Event crm.record.merged.v1
```

### Re-point on merge

- Relationships, activities, tasks, account refs, external identifiers, tags
- Audit history: retain all records; loser gets `mergedIntoId`, `archivedAt`
- Field-level resolution map stored on `crm_merge_records`

### Concurrency

- Optimistic lock on both entities during merge
- Merge conflict → `409` with reason `concurrent_modification`

## Suppression

Rejected pairs: suppress re-flagging for configurable period (e.g. 90 days) unless material field change.
