# C1 — Authorization Matrix

**Status:** Proposed — uses I0 RBAC/ABAC/SoD only

## Role × permission (Dev/Test seed)

| Permission | commercial.user | commercial.manager | commercial.admin | platform.admin |
| --- | --- | --- | --- | --- |
| `crm:read:organization` | own/team | team | tenant | tenant |
| `crm:write:organization` | ✓ | ✓ | ✓ | ✓ |
| `crm:transition:organization` | — | ✓ | ✓ | ✓ |
| `crm:archive:organization` | — | ✓ | ✓ | ✓ |
| `crm:read:contact` | own/team | team | tenant | tenant |
| `crm:write:contact` | ✓ | ✓ | ✓ | ✓ |
| `crm:read:relationship` | ✓ | ✓ | ✓ | ✓ |
| `crm:write:relationship` | ✓ | ✓ | ✓ | ✓ |
| `crm:read:account` | own | team | tenant | tenant |
| `crm:write:account` | own | team | ✓ | ✓ |
| `crm:reassign:account_owner` | — | ✓ | ✓ | ✓ |
| `crm:read:activity` | own/team | team | tenant | tenant |
| `crm:write:activity` | ✓ | ✓ | ✓ | ✓ |
| `crm:read:task` | assigned/team | team | tenant | tenant |
| `crm:write:task` | ✓ | ✓ | ✓ | ✓ |
| `crm:read:duplicate` | — | ✓ | ✓ | ✓ |
| `crm:review:duplicate` | — | — | ✓ | ✓ |
| `crm:merge:record` | — | — | ✓* | ✓ |
| `crm:export:crm` | — | — | ✓* | ✓ |
| `crm:import:bulk` | — | — | ✓* | ✓ |
| `crm:admin:organization_type` | — | — | ✓ | ✓ |
| `crm:admin:relationship_type` | — | — | ✓ | ✓ |

\*SoD may require separate approver via I2 workflow.

## ABAC dimensions

| Dimension | Rule |
| --- | --- |
| Classification | Principal clearance ≥ entity classification |
| Tenant | `resource.tenantId === principal.tenantId` |
| Owner | Account owner + delegated team grants |
| Market/territory | Optional attribute match (future) |

## Owner vs access

| Concept | Meaning |
| --- | --- |
| Record Owner | Accountable principal; appears in UI defaults |
| Record Viewer | Read via role/ABAC |
| Record Editor | Write without ownership change |
| Account Administrator | Type catalogue, merge approval, export |

Ownership does **not** bypass deny rules or classification.

## SoD pairs (high-risk)

| Action A | Action B | Same object |
| --- | --- | --- |
| `crm:write:organization` (create) | `crm:merge:record` (approve merge of same) | optional policy |
| `crm:import:bulk` (submit) | `crm:import:bulk` (commit) | yes |
| `crm:export:crm` (request) | `crm:export:crm` (execute) | yes |

Enforced via existing `sodRules` + I2 approval tasks — not CRM-local SoD.

## Cross-tenant

All permissions evaluated with tenant context. Cross-tenant → **404** (no disclosure).
