# C1 — Lifecycle & State Model

**Status:** Proposed — all transitions authorized, auditable, timestamped, attributable

## Organization lifecycle

`Prospect → Engaged → Qualified → Active → Dormant → Disqualified`

| From | To |
| --- | --- |
| Prospect | Engaged, Disqualified |
| Engaged | Qualified, Dormant, Disqualified |
| Qualified | Active, Dormant, Disqualified |
| Active | Dormant |
| Dormant | Engaged, Active, Disqualified |
| Disqualified | Reopen via privileged workflow + reason |

**Archive:** `Active|Dormant → Archived` (soft; retains audit history)

## Relationship lifecycle

`Unknown → Identified → Contacted → Engaged → Partner → Strategic`

Alternatives: `Dormant`, `Disqualified` from most non-terminal states (with reason).

Backward transitions (e.g. Partner → Contacted) require reason + audit.

## Contact lifecycle

`Active → Inactive → Archived`

## Account lifecycle

`Prospect → Active → OnHold → Closed → Archived`

## Task lifecycle

`Open → InProgress → Completed`

Alternatives: `Cancelled`, `Deferred` (with reason + optional new due date)

## Duplicate candidate lifecycle

`PotentialDuplicate → UnderReview → ConfirmedDuplicate | NotDuplicate`

Merge only from `ConfirmedDuplicate` after review (workflow when policy requires).

## Data quality states (orthogonal to lifecycle)

`Unverified → PartiallyVerified → Verified`

Flags: `NeedsReview`, `DuplicateSuspected`, applied alongside lifecycle.

Quality transitions driven by rules kernel where they constitute business policy.

## Implementation notes

- State machines in domain module; invalid transition → `409 conflict`
- `previousState` / `newState` on audit for every transition
- Optional I2 workflow hook on: Disqualified reopen, merge, bulk import commit, sensitive export
