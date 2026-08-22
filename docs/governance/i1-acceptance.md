# I1 Acceptance Decision

**Date:** 2026-08-22  
**Decision:** I1 Admin Shell **ACCEPTED FOR DEVELOPMENT/TESTING**

| Gate | Status |
| --- | --- |
| I1 architecture | Approved |
| I1 security model | Approved for continued development |
| I2 Workflow + Rules | Authorized to proceed after I1 DoD closure |
| AI agents | Not authorized |
| Commercial modules | Not authorized |
| UAT / Production | Not approved |

## Accepted I1 capabilities

Organizations, org units, locations, cost centers, Human/Service/AiAgent principals, lifecycle, role grants, RBAC, ABAC, SoD, configuration (draft/approve/history/rollback), sessions + revocation, administrative audit, tenant isolation, IdentityProvider abstraction, SecretsProvider abstraction.

## Bootstrap credentials policy

Development bootstrap users (e.g. carol.admin) are **Development-only**. Passwords must come from environment / SecretsProvider references — never UAT/Production seed data, never production examples. See `.env.example` and ADR-0015.
