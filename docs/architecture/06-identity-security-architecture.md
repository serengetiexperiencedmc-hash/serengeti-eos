# 6. Identity and Security Architecture

Defensive only. No exploit development, offensive tooling, or attack simulation payloads in this platform. Crisis/cyber **exercises** use authorised scenarios and injected **synthetic** events.

## 6.1 Zero Trust

Never trust a request because it originated “inside the network”.

Every request is evaluated on:

1. Authenticated principal (human, service, or agent)
2. Device posture (Phase 3)
3. Context (tenant, purpose, classification, time, location/network risk)
4. Authorisation policy (RBAC + ABAC)
5. Session freshness and step-up where required
6. Continuous session risk (Phase 3)

## 6.2 Identity planes

| Plane | Subjects | Protocol |
| --- | --- | --- |
| Workforce IAM | Employees, contractors | OIDC/OAuth2 + MFA |
| Partner IAM | External orgs and users | OIDC, scoped tokens, tenant isolation |
| Workload identity | Services, jobs | SPIFFE-like IDs or signed service tokens + mTLS where appropriate |
| AI agent identity | Agents | First-class principals with owner, scopes, autonomy ceiling |
| PAM | Privileged humans | JIT/JEA, vaulted credentials, session recording, dual control, expiry |

## 6.3 Authorisation

- **RBAC** for job function (coarse)
- **ABAC** for tenant, department, classification, programme assignment, purpose, SoD
- **ReBAC** later for graph relationships (“assigned to this programme”)

Policy decision point is central. Enforcement is at API gateway, module, search, AI tools, and event consumers.

## 6.4 Privileged access

| Control | Requirement |
| --- | --- |
| JIT | Privileged roles expire |
| JEA | Commands limited to approved set |
| Dual control | Break-glass and production IAM changes |
| Session monitoring | PAM sessions recorded |
| Automatic revocation | On HR offboarding event, risk lock, or device non-compliance |

Administrators of EOS use PAM. Day-to-day work uses standard IAM.

## 6.5 Application security (secure-by-design)

- TLS 1.2+ everywhere
- Encryption at rest for databases, backups, object storage
- CSRF protection for cookie sessions; prefer bearer tokens for APIs
- Input validation (schema), output encoding
- Secure file handling (type, size, malware scan Phase 3)
- Rate limiting, abuse prevention
- Secret scanning in CI; no secrets in git
- Dependency, SAST; DAST in Test/UAT
- Security headers, session fixation controls
- Audit of authentication failures and authorisation denials

## 6.6 SOC (Phase 3) — defensive

Detection → Triage → Investigation → Containment → Eradication → Recovery → Lessons learned

AI may triage and summarise. **Containment that affects production, accounts, or clients requires human authorisation** except for pre-approved automatic protections (e.g. lock an obviously stolen session) listed in the autonomy matrix.

## 6.7 Secrets and keys

Application code stores **references**, not secret values. Providers:

- Development: `.env` local only, gitignored, never copied to Test+
- Test/UAT/Prod: Vault or cloud KMS (ADR-0012)

Separate encryption keys for: data-at-rest, backups, field offline cache, token signing.

## 6.8 Required secrets (inventory — values not created here)

| Secret | Used by | Rotation |
| --- | --- | --- |
| Database credentials | API, workers | Automated |
| Redis credentials | API, workers | Automated |
| NATS credentials | API, workers | Automated |
| OIDC client secrets | API, web | Automated |
| Token signing keys | Identity | Dual control |
| Object storage keys | API | Automated |
| AI provider keys | AI gateway | Automated, per provider |
| Notification provider keys | Notify worker | Automated |
| Backup encryption keys | BCM | Dual control, offline copies |

No live credentials are fabricated in this repository.
