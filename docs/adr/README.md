# Architecture Decision Register

Status values: `proposed` (needs human approval), `accepted` (approved), `superseded`, `open` (explicitly pending).

**Phase 0 baseline:** approved for continued development (see `docs/governance/phase0-i0-approval.md`).  
**Production readiness:** not approved.  
**Open production blockers:** ADR-0006, ADR-0012, ADR-0013 — decision papers in `docs/decisions/`.

| ID | Title | Status |
| --- | --- | --- |
| [ADR-0001](ADR-0001-isolate-platform-from-collateral.md) | Isolate EOS from branding collateral | accepted for Development |
| [ADR-0002](ADR-0002-modular-monolith.md) | Modular monolith first | accepted for Development |
| [ADR-0003](ADR-0003-postgresql-system-of-record.md) | PostgreSQL system of record | accepted for Development |
| [ADR-0004](ADR-0004-nats-jetstream.md) | NATS JetStream for Phase 1 events | proposed |
| [ADR-0005](ADR-0005-oidc-identity.md) | OIDC as identity protocol | accepted for Development (product TBD) |
| [ADR-0006](ADR-0006-hosting-and-residency.md) | Hosting and data residency | **OPEN — blocked for Prod** |
| [ADR-0007](ADR-0007-workflow-engine.md) | Embedded workflow kernel first | proposed |
| [ADR-0008](ADR-0008-multi-provider-ai.md) | Multi-provider AI, no vendor lock | proposed (AI deferred until after I4) |
| [ADR-0009](ADR-0009-logical-multitenancy.md) | Logical multi-tenancy | accepted for Development |
| [ADR-0010](ADR-0010-transactional-outbox.md) | Transactional outbox | proposed |
| [ADR-0011](ADR-0011-backup-1900-eat.md) | Daily 19:00 EAT backup + restore proof | proposed (requirement accepted) |
| [ADR-0012](ADR-0012-secrets-platform.md) | Secrets platform | **OPEN — blocked for UAT+** |
| [ADR-0013](ADR-0013-corporate-idp.md) | Corporate IdP product | **OPEN — blocked for Prod** |
| [ADR-0014](ADR-0014-defensive-security-only.md) | Defensive security only | accepted for Development |
| [ADR-0015](ADR-0015-identity-secrets-abstraction.md) | Identity & secrets abstraction | accepted for Development |
| [ADR-0016](ADR-0016-workflow-rules-kernel.md) | Embedded Workflow + Rules kernel (I2) | accepted for Development |

## Open assumptions (not silently decided)

- See [External Systems Discovery Register](../discovery/external-systems-register.md) — all listed systems remain **Unknown / Not Invented**
- Cardholder data in-scope: **unknown** (assume out of scope until Finance confirms)
- Official currencies and legal entities: **unknown**
- Headcount and concurrent-user SLOs: **unknown**
- Swahili UI: **later**
- Tanzania PDPA / Kenya DPA / GDPR applicability: **legal review required**
