# 8. Integration Architecture

## 8.1 Platform components

| Component | Role |
| --- | --- |
| API Gateway | TLS, authn, rate limit, request ID, WAF (later) |
| API Management | Catalogue, versioning, lifecycle, analytics |
| Integration workers | Connectors, mapping, retries, circuit breakers |
| Webhooks | Signed, replay-protected, tenant-scoped |
| Provider router | Primary + backup with policy, not silent cutover |
| Developer portal | Internal first; external isolated later |

## 8.2 API standards

- OpenAPI 3.1 for external and module public APIs
- `/v1` prefix; additive changes preferred; breaking changes require new version and consumer mapping
- Correlation ID on every request (`X-Correlation-Id`)
- Idempotency-Key on mutating financial, booking, and approval endpoints
- Problem+JSON error bodies
- Pagination: cursor-based for operational lists

## 8.3 Partner onboarding (Phase 6)

`Application → Verification → Contract → Security Review → Scope Approval → Sandbox → Testing → Certification → Production Approval`

Partner traffic terminates on a **separate edge** with its own rate limits, keys, and audit. Internal IAM tokens are never accepted on the partner edge.

## 8.4 Future B2B API candidates

Product catalogue, availability, approved rates, programme requests, booking status, documents, operational updates.

None are exposed until partner IAM, contracts, and classification reviews exist.

## 8.5 Connector policy

A connector is production-eligible only with:

- Named owner
- DPA / contract reference
- Classification of data in/out
- Retry and poison-queue behaviour
- Circuit breaker and runbook
- Primary/backup if the process is critical
- Observability and audit

Unknown systems (ERP, CRS, GDS, banks) are **placeholders in architecture only**.
