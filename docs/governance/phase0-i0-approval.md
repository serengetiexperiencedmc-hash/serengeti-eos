# Phase 0 / Increment 0 — Human Decision Record

**Date:** 2026-08-21  
**Decision authority:** Serengeti Experience DMC programme direction (chat approval)

## Decisions

| Item | Decision | Scope |
| --- | --- | --- |
| Phase 0 architecture (30 deliverables) | **APPROVED** as versioned architecture baseline | Continued development |
| Increment 0 platform kernel | **APPROVED** for Development/Testing only | Not Production |
| Production readiness | **NOT APPROVED** | Remains false until Production Readiness Review |
| ADR-0006 Hosting / data residency | **OPEN / PENDING** | Do not lock via infrastructure |
| ADR-0012 Secrets platform | **OPEN / PENDING** | Dev mechanism only; UAT+ blocked |
| ADR-0013 Corporate IdP | **OPEN / PENDING** | Identity abstraction required |
| I1 Admin Shell | **APPROVED to proceed** | Behind IdP/secrets abstractions |
| AI agents in kernel | **Deferred** | After identity, authz, audit, workflow, rules, events, data governance |

## Explicit distinctions (mandatory)

1. **Architectural approval** ≠ development readiness ≠ production readiness  
2. 14/14 I0 tests = development functionality evidence only — **not** security certification, compliance certification, or production readiness  
3. Architecture artifacts are **versioned**; contradictions require ADR updates, not silent workarounds  
4. Collateral / public website / partner environments remain **isolated** from `serengeti-eos/`

## Authoritative registers

- Architecture Decision Register: `docs/adr/README.md`
- External Systems Discovery Register: `docs/discovery/external-systems-register.md`
- Decision papers (open ADRs): `docs/decisions/`
