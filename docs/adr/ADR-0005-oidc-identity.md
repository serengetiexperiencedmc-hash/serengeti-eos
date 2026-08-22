# ADR-0005 — OIDC as identity protocol

- Status: **proposed**
- Date: 2026-08-21

## Decision

Workforce and partner authentication use OIDC/OAuth2. Increment 0 includes a **Development-only local issuer** for tests. Production must use the corporate IdP (ADR-0013).

## Consequences

No proprietary SSO. Local passwords never go to Production.
