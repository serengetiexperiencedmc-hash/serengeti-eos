# E1-C — Security Readiness Gap Assessment

> **`ASSESSMENT ONLY — NO APPLICATION CODE CHANGED`**  
> **`DEV/TEST ≠ PRODUCTION`**  
> **`NO MFA FOUND IN EOS API`** · **`NO HELMET/CORS/RATE-LIMIT MIDDLEWARE FOUND`**  
> **`DEFAULT TOKEN SECRET FALLBACK IS DEV-ONLY`**

**Date:** 2026-09-17.  
**Inspected:** `apps/api/src/app.ts`, `server.ts`, `main.ts`, `ports/identity.ts`, `ports/secrets.ts`, `observability.ts`, `security/service.ts`, `apps/api/package.json` (no helmet/cors/rate-limit dependencies found).

Classifications: **IMPLEMENTED** · **DEV/TEST ONLY** · **NOT IMPLEMENTED** · **EVIDENCE REQUIRED** · **PROVIDER DEPENDENT** · **PRODUCTION ONLY**

More than one label may apply. Production claims require Production evidence.

| Item | Finding | Classification |
| --- | --- | --- |
| Token / session security | JWT `signToken` / `verifyToken`; session records; `revokeSession`; 3600s expiry in `login` | **IMPLEMENTED** as application behaviour; **DEV/TEST ONLY** as proven environment |
| Token secret handling | `createEnvSecretsProvider` reads `EOS_TOKEN_SECRET`. `main.ts` / `server.ts` fall back to `"dev-only-change-me"` if unset | **DEV/TEST ONLY**. Production secret platform **NOT IMPLEMENTED** (ADR-0012). Fallback must not be used in Production |
| Development credentials | `TEST_BOOTSTRAP_SECRETS`; bootstrap users (carol.admin@sedmc.local and peers in tests) | **DEV/TEST ONLY**. **PRODUCTION ONLY** to forbid |
| Bootstrap users | Seeded principals for Dev/Test | **DEV/TEST ONLY** |
| Password identity provider | `createLocalPasswordIdentityProvider` named `local-password-dev`; password hash verify | **DEV/TEST ONLY**. Corporate OIDC **NOT IMPLEMENTED**. **PROVIDER DEPENDENT** if IdP hosted |
| Access control | Kernel `authorize`, SoD, PAM JIT wrapper | **IMPLEMENTED** in Dev/Test. Production IdP binding **EVIDENCE REQUIRED** |
| MFA | No MFA/TOTP/2FA implementation found in `apps/api` | **NOT IMPLEMENTED**. Company requires MFA for support (Q-I-07). **PROVIDER DEPENDENT** for vendor support; **PRODUCTION ONLY** for Production admin MFA |
| CORS | No CORS plugin/config found in `server.ts` | **NOT IMPLEMENTED** (no evidence of explicit CORS policy) |
| Security headers | No Helmet/`@fastify/helmet` in API package.json; no header middleware found in `server.ts` | **NOT IMPLEMENTED** |
| Helmet / security middleware | Not present as a dependency | **NOT IMPLEMENTED** |
| Rate limiting | No HTTP rate-limit middleware found (business “rate season” is pricing, not HTTP limiting) | **NOT IMPLEMENTED** as HTTP control |
| Audit logging | `recordAudit`; `verifyAuditChain`; Gate B durable path **DEV/TEST ONLY** | **IMPLEMENTED** Dev/Test; Production durability **EVIDENCE REQUIRED** / **PRODUCTION ONLY** |
| Secrets | `EnvSecretsProvider`; gitignored env intended; ADR-0012 blocked UAT/Production | **DEV/TEST ONLY**. Production **PROVIDER DEPENDENT** + human product choice |
| Encryption | Password hashing in kernel verify path. Production at-rest/in-transit **unverified** | Password hashing **IMPLEMENTED** Dev. Envelope encryption **PROVIDER DEPENDENT** / **PRODUCTION ONLY** |
| TLS | No Production TLS termination evidenced | **PROVIDER DEPENDENT** / **PRODUCTION ONLY**. Dev TLS **EVIDENCE REQUIRED** (not claimed) |
| Access logging | `createLogger` with secret redaction; `productionReady: false` on log lines | **DEV/TEST ONLY** |
| Operational logging | Same logger; Fastify default logs not assessed as Production SIEM | **DEV/TEST ONLY**. Production **PROVIDER DEPENDENT** |
| Monitoring | Observability module exists; security alerts source `"devtest.webhook"` | **DEV/TEST ONLY**. Production **PROVIDER DEPENDENT** |
| Alerting | Dev/Test security alert workflow to ITSM ticket | **DEV/TEST ONLY**. Production **PROVIDER DEPENDENT** / **PRODUCTION ONLY** |

**No application code was modified.** No Production security readiness is claimed.

Related gaps remain open: GAP-IDN-02, GAP-SEC-01, GAP-SEU-01–04, GAP-OBS-01, GAP-NET-01.
