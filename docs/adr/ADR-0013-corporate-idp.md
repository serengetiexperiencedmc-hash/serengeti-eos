# ADR-0013 — Corporate IdP product

- Status: **proposed — blocked for Production**
- Date: 2026-08-21

## Context

Unknown whether the company uses Microsoft Entra ID, Google Workspace, or nothing.

## Decision (pending)

Choose an OIDC IdP. Keycloak/Authentik is a fallback if no corporate IdP exists.

## Consequences

Increment 0 local issuer is Development/Test only.
