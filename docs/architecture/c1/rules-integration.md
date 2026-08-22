# C1 — Rules Integration Design

**Status:** Proposed — consumes I2 Rules Kernel

## Principle

Business validation and data-quality policy → **versioned rules**. Controllers perform syntactic validation only.

## Draft rule keys

| Rule key | Trigger | Outcome |
| --- | --- | --- |
| `crm.organization.require_owner_on_active` | Transition to Active | Deny if no owner |
| `crm.organization.require_name` | Create/update | Deny if legalName empty |
| `crm.contact.require_email_or_phone` | Create | Deny if neither |
| `crm.duplicate.block_auto_merge` | Any merge | Deny automated merge |
| `crm.duplicate.score_threshold` | Create/update org | Flag candidate if score ≥ threshold |
| `crm.account.require_organization` | Create account | Deny if org missing |
| `crm.export.require_approval_confidential` | Export Confidential+ | Route to workflow |
| `crm.stale_account.flag` | Scheduled eval (future) | Create task if no activity N days |

## Lifecycle

`draft → test (simulate) → review → effective` per I2. Unapproved rules cannot execute live.

## Simulation

Use I2 `simulateRuleVersion` for rule design — never mutates production CRM state.

## C1 implementation

- Rules stored in existing `businessRuleVersions` with namespace prefix `crm.`
- CRM domain calls `evaluateEffectiveRule` before consequential transitions
