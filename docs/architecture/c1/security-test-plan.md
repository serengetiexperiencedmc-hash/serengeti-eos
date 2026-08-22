# C1 — Security Test Plan

**Status:** Proposed — Dev/Test regression suite

## Objectives

Verify CRM extends the platform security boundary without bypassing kernel controls.

## Test categories

### Tenant isolation

| ID | Scenario | Expected |
| --- | --- | --- |
| TI-01 | Tenant A creates org; Tenant B GET by id | 404 |
| TI-02 | Tenant B search with Tenant A org name | No results |
| TI-03 | Tenant B merge involving Tenant A ids | 403/404 |
| TI-04 | Tenant B duplicate queue | Empty / no cross-tenant |
| TI-05 | Tenant B audit read for Tenant A resource | Deny |

### Authorization

| ID | Scenario | Expected |
| --- | --- | --- |
| AZ-01 | User without crm:write creates org | 403 |
| AZ-02 | User without crm:merge attempts merge | 403 |
| AZ-03 | User without clearance reads Confidential contact | 403 |
| AZ-04 | commercial.user reassigns account owner | 403 |
| AZ-05 | Export without crm:export:crm | 403 |

### SoD

| ID | Scenario | Expected |
| --- | --- | --- |
| SD-01 | Same principal create + approve merge (when policy on) | 403 |
| SD-02 | Import submit + commit same principal | 403 or workflow required |

### Input validation

| ID | Scenario | Expected |
| --- | --- | --- |
| IN-01 | Oversized legal name | 400 |
| IN-02 | HTML/script in organization name | Rejected/sanitized |
| IN-03 | Malformed UUID in path | 400 |
| IN-04 | Invalid lifecycle transition | 409 |
| IN-05 | Forged external system key not in catalogue | 400 |

### Merge & duplicate

| ID | Scenario | Expected |
| --- | --- | --- |
| MG-01 | Unauthorized merge | 403 |
| MG-02 | Merge without review confirm | 409 |
| MG-03 | Merge audit contains survivor + losers + reason | Pass |
| MG-04 | Concurrent merge same entity | 409 safe failure |

### Events & audit

| ID | Scenario | Expected |
| --- | --- | --- |
| EV-01 | Create org emits outbox + audit | Pass |
| EV-02 | Simulation mode cannot publish CRM event | Blocked |
| AU-01 | Denied action creates deny audit | Pass |

## Implementation

File: `apps/api/src/crm.security.regression.test.ts` (on C1 implementation)

## Out of scope (C1)

Penetration test, production WAF, corporate IdP federation tests.
