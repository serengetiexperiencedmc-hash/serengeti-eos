# 19. Technology Stack Recommendation

Recommendations are for a **governable DMC-scale enterprise platform**. They are not vendor contracts. Flagged items need human approval.

## 19.1 Proposed default (Increment 0+)

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript | One typed language across API, web, events, tests |
| API | NestJS + Fastify adapter | Modular bounded contexts, OpenAPI, guards |
| Web | Next.js App Router | Workspaces, SSR for command centers later |
| OLTP | PostgreSQL 16 | Integrity, JSONB where useful, mature backup |
| ORM / migrations | Drizzle | SQL-first, explicit migrations, no hidden magic |
| Cache / locks | Redis 7 | Rate limits, distributed locks |
| Events | NATS JetStream | Operable event bus before Kafka complexity |
| Objects | S3-compatible | Evidence and documents |
| Auth protocol | OIDC / OAuth2 | Do not invent SSO |
| API docs | OpenAPI 3.1 | Contract-first |
| Observability | OpenTelemetry | Logs, metrics, traces, correlation IDs |
| Tests | Vitest + supertest + Playwright later | Fast unit/API; e2e when UI exists |
| Containers | Docker Compose (dev/test) | Kubernetes later if cloud ADR says so |
| CI | GitHub Actions (or Azure DevOps if IdP ADR requires) | Pipeline as code |
| IaC | Terraform (when cloud chosen) | Repeatable envs |

## 19.2 Explicitly later / optional

| Need | Candidate | Phase |
| --- | --- | --- |
| Durable BPM at scale | Temporal | 2–3 if workflow complexity warrants |
| Search | OpenSearch | 5 |
| Lakehouse | TBD (Iceberg + warehouse) | 5 |
| Graph | Neo4j or Postgres AGE | 5 if SQL graph insufficient |
| SIEM | Existing market SIEM, not a custom one | 3 |
| UEM/MDM | Commercial UEM | 3 |
| Vault | HashiCorp Vault or cloud KMS | 1 UAT+ |

## 19.3 Rejected for now

| Idea | Reason |
| --- | --- |
| Microservices-from-day-one | Operability and audit cost |
| Hardcoded single AI vendor | Violates provider architecture |
| Mongo as system of record | Weak constraints for finance/IAM |
| Building a SIEM from application logs only | Insufficient; integrate later |
| Offensive security modules | Disallowed |

## 19.4 Pending human ADRs

Cloud provider and region, IdP product, secrets product, whether Kubernetes is required in year one.
