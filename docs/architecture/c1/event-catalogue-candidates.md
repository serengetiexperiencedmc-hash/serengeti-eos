# C1 — Event Catalogue Candidates

**Status:** CANDIDATES — not approved contracts until registered via I4 governance  
**Rule:** Register in event catalogue before emit; payload reference-first per [event-sensitive-data-policy](../../governance/event-sensitive-data-policy.md)

## Naming convention

`crm.<entity>.<verb>.v1` — version suffix mandatory.

## Candidate events

| Candidate type | Ordering key | Classification | Notes |
| --- | --- | --- | --- |
| `crm.organization.created.v1` | organizationId | Internal | Ref payload |
| `crm.organization.updated.v1` | organizationId | Internal | |
| `crm.organization.archived.v1` | organizationId | Internal | |
| `crm.organization.lifecycle_changed.v1` | organizationId | Internal | previous/new status |
| `crm.contact.created.v1` | contactId | Confidential | No full PII in payload |
| `crm.contact.updated.v1` | contactId | Confidential | |
| `crm.contact.archived.v1` | contactId | Confidential | |
| `crm.relationship.created.v1` | relationshipId | Internal | |
| `crm.relationship.updated.v1` | relationshipId | Internal | |
| `crm.relationship.status_changed.v1` | relationshipId | Internal | |
| `crm.account.created.v1` | accountId | Internal | |
| `crm.account.updated.v1` | accountId | Internal | |
| `crm.account.owner_changed.v1` | accountId | Internal | |
| `crm.activity.created.v1` | activityId | Confidential | |
| `crm.task.created.v1` | taskId | Internal | |
| `crm.task.completed.v1` | taskId | Internal | |
| `crm.duplicate.detected.v1` | duplicateCandidateId | Internal | |
| `crm.record.merged.v1` | survivorId | Internal | survivor + merged ids |

## Payload shape (example)

```json
{
  "organizationId": "uuid",
  "legalName": "Acme Incentives Ltd",
  "status": "Active",
  "correlationId": "..."
}
```

Contact events prefer `{ "contactId", "displayNameRef" }` — email/phone retrieved via API.

## Registration workflow

1. Add entry to catalogue via `POST /v1/events/catalogue` (platform admin)
2. Define required/forbidden fields, max size, retention
3. Simulate publish in Dev/Test
4. Mark lifecycle `active` after review

## Consumers (future)

| Consumer | Events |
| --- | --- |
| search-indexer (stub) | `*.created`, `*.updated` |
| audit-analytics (stub) | all |
| C2 opportunity linker | `account.*`, `relationship.*` |

No consumer may subscribe without catalogue authorization.
