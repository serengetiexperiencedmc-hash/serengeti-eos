# Decision Paper — ADR-0013 Corporate Identity Provider

**Status:** OPEN — for formal human approval before Production  
**Related ADR:** [ADR-0013](../adr/ADR-0013-corporate-idp.md), [ADR-0005](../adr/ADR-0005-oidc-identity.md)

## Decision required

Which OIDC-capable IdP authenticates workforce (and later partner) users in UAT/Production.

## Non-negotiable design constraint (I1+)

EOS maintains an **identity abstraction layer**:

- Application authorization (RBAC/ABAC/SoD) is **independent** of the IdP product  
- Principals are first-class EOS entities (Human, Service, AiAgent)  
- IdP supplies authentication assertions; EOS owns authorization and lifecycle state  
- Development may use a local credential issuer; Production must not  

## Options under consideration (not selected)

| Option | Notes |
| --- | --- |
| Microsoft Entra ID | Common enterprise SSO; unknown if company uses Microsoft 365 |
| Google Workspace OIDC | Common if Google is corporate mail |
| Keycloak / Authentik (self-hosted) | Fallback if no corporate IdP |
| Other OIDC IdP | Acceptable if standards-compliant |

**Recommended option:** *Not selected — confirm corporate directory first.*

## Evaluation criteria

SSO/MFA quality, SCIM/provisioning, session controls, audit export, partner federation readiness, ops complexity, cost, exit (OIDC portability).

## Gate

Production must not permanently couple to an IdP SDK beyond the abstraction. ADR-0013 remains open until chosen.
