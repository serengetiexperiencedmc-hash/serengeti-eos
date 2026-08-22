# 29. Platform Risk Register (the EOS programme itself)

These are risks **to building and running the platform**, distinct from the DMC operational risk register (Phase 4).

| ID | Risk | Inherent | Treatment | Residual (target) | Owner |
| --- | --- | --- | --- | --- | --- |
| PR-01 | Scope explosion: attempting all 70 sections at once | High | Phased increments; completeness definition | Medium | Product owner |
| PR-02 | False production-ready claims | High | Explicit status banners; test gates | Low | Engineering |
| PR-03 | Building inside branding repo / destroying collateral | Medium | Isolated `serengeti-eos/` | Low | Engineering |
| PR-04 | Unknown hosting/residency → unlawful processing | High | ADR-0006 before Prod data | Medium | DPO / Exec |
| PR-05 | Invented integrations and credentials | High | No fake vendors; adapters only when contracted | Low | Engineering |
| PR-06 | AI treated as authority | High | Autonomy matrix, SoD, audit | Medium | CISO / AI owner |
| PR-07 | IDOR / tenant leak | High | Authz tests, 404 pattern | Medium | Engineering |
| PR-08 | Audit log tampering | High | Hash chain + insert-only | Medium | CISO |
| PR-09 | Backup theatre (job OK, restore fails) | High | Restore probes | Medium | BCM |
| PR-10 | Standing privileged access | High | JIT, dual control | Medium | IAM |
| PR-11 | Premature microservices | Medium | Modular monolith ADR | Low | Architecture |
| PR-12 | Secret leakage in git | High | Scan, gitignore, no sample live keys | Medium | Engineering |
| PR-13 | Regulatory misstatement (claiming certified GDPR etc.) | High | Considerations only until legal | Low | Compliance |
| PR-14 | Field device loss with guest data | High | Minimise offline cache, encrypt, wipe | Medium | Ops / CISO |
| PR-15 | Single AI/email/SMS provider outage | Medium | Primary/backup policy | Medium | Platform |
| PR-16 | SoD bypass via dual roles | High | SoD engine on object | Medium | Finance / IAM |
| PR-17 | Unmaintainable “enterprise” complexity for a DMC team | High | Kernel-first; extract later | Medium | CTO |
| PR-18 | Partner portal reading internal tenant | High | Separate edge Phase 6; tests | Medium | CISO |

Scoring is qualitative until risk appetite is approved in Phase 4.
