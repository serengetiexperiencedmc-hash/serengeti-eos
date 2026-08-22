# C1 Security Test Plan — Coverage Disposition

**Phase:** C1.11 gate remediation  
**Environment:** Development/Test only

| ID | Scenario | Disposition | Evidence |
| --- | --- | --- | --- |
| TI-01 | Cross-tenant org GET | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| TI-02 | Cross-tenant search | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| TI-03 | Cross-tenant merge | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| TI-04 | Cross-tenant duplicate queue | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| TI-05 | Cross-tenant audit read | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AZ-01 | No crm:write | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AZ-02 | No crm:merge | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AZ-03 | Clearance denial | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AZ-04 | Account owner reassign | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AZ-05 | Export without permission | **NOT APPLICABLE** | No C1 CRM export endpoint implemented; export deferred beyond C1 scope |
| SD-01 | Same principal merge approve | **FORMALLY WAIVED** | `docs/architecture/c1/workflow-integration.md` — I2 merge workflow stubbed in C1 Dev/Test |
| SD-02 | Import submit + commit SoD | **FORMALLY WAIVED** | `docs/architecture/c1/workflow-integration.md` — direct import with audit in C1 Dev/Test |
| IN-01 | Oversized legal name | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` + `validateOrganizationLegalName()` |
| IN-02 | HTML/script in name | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` + `validateOrganizationLegalName()` |
| IN-03 | Malformed UUID | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` + `isValidUuid()` |
| IN-04 | Invalid lifecycle transition | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| IN-05 | Invalid external system key | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| MG-01 | Unauthorized merge | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| MG-02 | Merge without review | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| MG-03 | Merge audit content | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| MG-04 | Stale version merge | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| EV-01 | Create emits outbox + audit | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| EV-02 | Simulation blocks publish | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |
| AU-01 | Deny audit on denied action | **IMPLEMENTED + PASS** | `crm.security.regression.test.ts` |

**Coverage:** 22 IMPLEMENTED + PASS · 1 NOT APPLICABLE · 2 FORMALLY WAIVED · **100% disposition**
