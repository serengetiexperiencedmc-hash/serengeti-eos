# ADR-0015 — Identity and secrets abstraction (I1)

- Status: **accepted for Development**
- Date: 2026-08-21

## Context

ADR-0006, ADR-0012 and ADR-0013 remain OPEN. I1 Admin Shell must proceed without locking hosting, IdP or secrets products.

## Decision

1. Introduce `IdentityProvider` port: authenticate and map external subject → EOS `Principal`. Development uses `LocalPasswordIdentityProvider`. Production will plug OIDC without changing RBAC/ABAC.
2. Introduce `SecretsProvider` port: resolve secret references. Development uses `EnvSecretsProvider`. UAT/Prod provider TBD (ADR-0012).
3. Authorization remains entirely inside EOS (RBAC/ABAC/SoD).

## Consequences

Admin Shell and kernel do not import a permanent corporate IdP SDK. Switching IdP later is an adapter change.
