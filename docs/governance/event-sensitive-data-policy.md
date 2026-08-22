# Event Sensitive Data Policy (Development/Test)

**Scope:** Serengeti EOS event payloads — all environments  
**Production:** Policy applies; technical enforcement matures with I4 hardening and Production readiness review

## Principle

Prefer **Reference → Authoritative Service** over embedding personal or sensitive data in events.

The event bus must not become an uncontrolled secondary data warehouse.

## Rules

1. **Default:** `sensitiveDataPolicy: reference_only` in the Event Catalogue.
2. **Forbidden keys** (non-exhaustive): email, phone, passport, nationalId, password, dateOfBirth, address — enforced at publish via schema catalogue.
3. **When embedding is required:** classify appropriately, minimize fields, restrict consumers in catalogue, audit access, define retention.
4. **Classification:** event envelope classification must meet or exceed catalogue minimum.
5. **Changes:** breaking payload changes require new schema version and compatibility review — no silent contract changes.

## Enforcement (Dev/Test)

- `validateEnvelopeSchema` at outbox commit and consume
- Catalogue registration via `events:register:catalogue` (platform admin)
- Security regression: `i4.security.regression.test.ts`

## Production prerequisites (not yet met)

- Encryption in transit/at rest per ADR-0006
- Production secrets platform (ADR-0012)
- Formal privacy/DPIA alignment for event retention
