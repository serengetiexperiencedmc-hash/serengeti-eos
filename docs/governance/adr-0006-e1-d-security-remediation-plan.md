# E1-D — Security Remediation Plan

> **`DESIGN ONLY — NO APPLICATION CODE CHANGED THIS STAGE`**  
> **`NO PRODUCTION IDP OR KMS SELECTED`**  
> **`NO PRODUCTION SECRETS CREATED`**  
> **`NO COMPLIANCE CERTIFICATION CLAIMED`**  
> **`THOMAS NGULUMA = LEGAL COUNSEL ONLY — NOT DPO`**

**Date:** 2026-09-17.  
**Verified:** `apps/api/src/app.ts` login/JWT; `main.ts`; `server.ts`; `ports/identity.ts`; `ports/secrets.ts`; `security/service.ts`; `apps/api/package.json` (no helmet, cors, rate-limit).

---

## DEV/TEST SAFE

Work that can be designed (and later implemented under a Dev/Test authorization) **without** choosing a Production provider, architecture, or jurisdiction.

| Item | Current | Dev/Test target | Must not do |
| --- | --- | --- | --- |
| HTTP security headers | **NOT IMPLEMENTED** | Conservative API headers | Claim PCI/ISO; enable HSTS as Production proof |
| CORS | **NOT IMPLEMENTED** on API | Allowlist localhost/127.0.0.1 | `Access-Control-Allow-Origin: *` |
| HTTP rate limiting | **NOT IMPLEMENTED** | In-memory limit on login | Select Redis/WAF as Production limiter |
| Token secret fallback | `"dev-only-change-me"` if unset | Labelled Dev-only; refuse when production flags set (already exits on missing **bootstrap** passwords) | Put a Production secret in repo or `.env` committed |
| Bootstrap users | `TEST_BOOTSTRAP_SECRETS`; carol.admin@sedmc.local | Remain Dev/Test | Copy into UAT/Production |
| Password IdP | `local-password-dev` | Remain Dev until HUM-05 | Treat as corporate IdP |
| JWT/sessions | `signToken` / `verifyToken`; 3600s; `revokeSession` | Keep; test expiry/revoke | Claim Production session security |
| Access control | Kernel authorize, SoD, PAM JIT | Keep in Dev | Claim Production IAM/MFA |
| Logger redaction | REDACT_KEYS including token/password | Keep; `productionReady: false` | Set productionReady true |
| Security alerts | `source: "devtest.webhook"` | Keep labelled | Claim Production SOC |
| Secrets provider | `env-dev` process env | Gitignored env only | Select Vault/cloud KMS |

**MFA** is technically addable in Dev (TOTP) but is **Class B** (implementation authorization) and may need **schema (E)** and **policy (D)**. It is **not** treated as unconditionally Dev/Test safe in this plan.

---

## PRODUCTION DEPENDENT

| Item | Why |
| --- | --- |
| Corporate OIDC IdP | ADR-0013 OPEN; HUM-05 unknown; hosted location **C** |
| MFA on Production admin/support | Q-I-07; provider support MFA **C**; Production proof **F** |
| KMS / secrets platform | ADR-0012 blocked UAT/Production; HUM-06 |
| Backup encryption keys location | GAP-SEC-02 |
| TLS termination / certificates | GAP-NET-01; TECH-TLS-01 |
| WAF / CDN / edge | GAP-SEU-01 |
| At-rest / in-transit envelope | GAP-SEU-02 |
| Production SIEM / alerting product | GAP-OBS-01 |
| Government access disclosure | GAP-SEU-04 (provider; not implemented here) |
| Production network isolation | GAP-NET-01 |

---

## Explicit non-actions

- Do not select Entra vs Google vs Keycloak as **the** Production IdP.  
- Do not select Vault vs cloud KMS.  
- Do not invent SOC2/ISO/PCI claims.  
- Do not create Production credentials or token secrets.  
- Do not implement code in this E1-D stage.

Legal/privacy completeness remains **DPO NOT ESTABLISHED** and **PDPC NOT VERIFIED**. This plan is **not** a legal determination.
