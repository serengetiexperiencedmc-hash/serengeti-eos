# 26. Initial Testing Strategy

A feature is not complete because a test file exists. Critical paths need **authorisation, audit, failure, and recovery** coverage.

## 26.1 Layers

| Layer | Increment 0 | Later |
| --- | --- | --- |
| Unit | Kernel: hash chain, RBAC, ABAC, SoD, approval state machine | Domain costing, SLA |
| API | Health, auth, deny IDOR, tenant isolation | All modules |
| Contract | OpenAPI examples | Pact with consumers |
| Security | Authz negatives, injection of untrusted text as data | SAST/DAST, prompt-injection suites |
| Workflow | Approval cannot self-approve | BPM |
| Recovery | Audit chain verify | Backup restore probe |
| A11y | — | Command Center WCAG |
| Performance | — | SLO tests |
| E2E | — | Playwright critical journeys |
| AI eval | — | Hallucination, tool-use, data-class |

## 26.2 Mandatory negative tests

- Cross-tenant read returns 404 (not 403) for existence hiding where appropriate, else 403 — pick one and test consistently. Increment 0 uses **404** for missing-or-unauthorised resources.
- Creator cannot approve own payment (SoD)
- AI principal cannot grant roles
- Audit table rejects UPDATE
- Idempotent replay of a command does not double-apply

## 26.3 Definition of done (testing)

Kernel increment: unit + API authz tests green in CI.  
Not done: performance, DAST, DR restore, accessibility, AI eval.
