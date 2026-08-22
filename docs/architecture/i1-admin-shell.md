# I1 — Admin Shell

**Status:** In development — Development/Testing only — **not production-ready**  
**Depends on:** I0 kernel  
**DoD:** see end of this document

## Scope

Governed administration of organisation structure, application-side identity, authorization policy, and configuration — without locking corporate IdP, secrets platform, or hosting (ADR-0006/12/13 remain OPEN).

## Capabilities

| Area | Capabilities |
| --- | --- |
| Organisation | Organisations, org units (hierarchy), locations, teams, cost centers |
| Identity | Principals: Human, Service, AiAgent; status lifecycle; attributes; groups |
| Authorization | Roles, permissions, role grants (scoped/expiring), SoD rules, ABAC policy versions |
| Configuration | Registry, draft versions, approval, effective read, rollback |
| Sessions | List/revoke sessions for a principal |
| Audit | Every admin mutation audited; admin cannot bypass authz |

## Abstractionsctions (mandatory)

- `IdentityProvider` — authentication only; EOS owns RBAC/ABAC  
- `SecretsProvider` — resolve secret refs; Dev = env  

## Security controls before complete

- Privileged permission checks on every admin API  
- SoD: config drafter ≠ config approver; role self-escalation denied  
- Tenant isolation on all reads/writes  
- Session binding via token `jti` + revoke list  
- Negative + authorization + audit tests  

## Out of scope (I1)

- PAM / break-glass product  
- Corporate IdP product choice  
- Production secrets vault  
- AI agents / autonomy  
- Business modules (CRM/MICE)  
- Admin UI frontend (API-first; UI can follow)

## Definition of Done

- [x] Requirements implemented (API + domain)  
- [x] Architecture updated (this doc)  
- [x] Schema migration notes (I1 additive SQL)  
- [x] APIs documented (OpenAPI)  
- [x] Authorization implemented  
- [x] Audit implemented  
- [x] Tests + negative + tenant + SoD + audit  
- [ ] Observability beyond health (I12)  
- [x] Documentation + ADR-0015  
- [x] Known limitations documented  

### Known limitations

- In-memory store in Development (Postgres schema exists; not wired as sole runtime yet)  
- No Production IdP or secrets platform  
- No PAM session recording  
- Not production-ready; no Production Readiness Review passed  
