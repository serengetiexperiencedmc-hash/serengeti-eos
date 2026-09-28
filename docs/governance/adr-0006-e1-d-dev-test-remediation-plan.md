# E1-D — Dev/Test Remediation Plan (Class A and B)

> **`DESIGN ONLY — NOT IMPLEMENTED THIS STAGE`**  
> **`THIS FILE IS NOT IMPLEMENTATION AUTHORIZATION`**  
> **`NO NEW MIGRATIONS`** · **`NO PRODUCTION CODE PATH CLAIMED`**

**Date:** 2026-09-17.  
**Source classification:** [`adr-0006-e1-d-technical-remediation-classification.md`](adr-0006-e1-d-technical-remediation-classification.md).

Priority order below follows repository evidence (HTTP controls missing; secrets fallback present; Gate B persist already exists).

Existing authorizations that **do not** cover this plan’s new work: Gate B CLOSED (Commercial dual-path); Migration 123 **consumed**; Gate C remainder **NOT AUTHORIZED**.

---

## Priority 1 — Security headers (TECH-SEC-03) — Class A

| Field | Content |
| --- | --- |
| Objective | Emit explicit security headers on the Fastify API in isolated Dev/Test |
| Current behavior | No Helmet; no CSP/XFO/Referrer-Policy found in `server.ts` |
| Desired behavior | Conservative headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy` default deny for API JSON). **HSTS not claimed useful without TLS** |
| Files/modules likely affected | `apps/api/src/server.ts`; possibly small helper; `apps/api/package.json` **only if** a header plugin is chosen |
| Tests required | Inject `/health` and `/v1/auth/login` — assert header names. **NOT RUN** |
| Security considerations | Do not leak internal versions beyond existing `productionReady: false` payload |
| Rollback | Remove hook/plugin; tests fail closed on missing headers |
| Data implications | None |
| Migration implications | None |
| Observability | Log plugin registration at info, Dev-labelled |
| Governance boundary | Dev/Test API only. Not Production TLS/WAF |

---

## Priority 2 — CORS (TECH-SEC-04) — Class A

| Field | Content |
| --- | --- |
| Objective | Explicit allowlist: Dev web origin only |
| Current behavior | No API CORS plugin. Next `allowedDevOrigins: ["127.0.0.1"]` is **not** API CORS |
| Desired behavior | Allow `http://localhost:*` / `http://127.0.0.1:*` as configured for Dev. **Reject `*`** |
| Files/modules | `server.ts`; tests |
| Tests required | OPTIONS preflight allow vs deny. **NOT RUN** |
| Security | Credentialed CORS must not use `*` |
| Rollback | Remove plugin; browsers may already work via Next proxy `eos-api` |
| Data / migration | None |
| Observability | Log origin rejects |
| Governance | Production origins **out of scope** until DNS exists |

---

## Priority 3 — HTTP rate limiting (TECH-SEC-05) — Class A

| Field | Content |
| --- | --- |
| Objective | In-memory rate limit on `/v1/auth/login` and optionally other anonymous routes |
| Current behavior | No HTTP limiter; “rate season” is commercial pricing |
| Desired behavior | 429 after bounded attempts per IP/identity in a Dev window |
| Files/modules | `server.ts` / `app.ts` login; tests. **No Redis** |
| Tests required | Burst login → 429. **NOT RUN** |
| Security | Does not replace MFA (TECH-IDN-02) |
| Rollback | Remove hook |
| Data | None if in-memory |
| Migration | **If** a shared store table/Redis is proposed → **E** and **out of this A item** |
| Observability | Count 429s in Dev logs |
| Governance | Dev/Test only. Production limiter product **C** |

---

## Priority 4 — MFA / security hardening (TECH-IDN-02, TECH-SEC-06, TECH-SEC-08) — Class B

| Field | Content |
| --- | --- |
| Objective | Design privileged MFA in Dev/Test **after** a specific implementation authorization |
| Current behavior | Password IdP; no TOTP; Helmet not a dependency |
| Desired behavior | Either (1) Dev TOTP/step-up for admin principals **or** (2) document that MFA waits for corporate IdP (TECH-IDN-01 **D**). **Not chosen here** |
| Files/modules | `ports/identity.ts`; `app.ts` login/session; possibly kernel. Helmet add = `package.json` (**B**) |
| Tests required | MFA required for admin; replay/bypass tests. **NOT RUN** |
| Security | Do not store TOTP seeds in git; Dev secrets env only |
| Rollback | Feature flag off |
| Data | TOTP seed table → **MIGRATION AUTHORIZATION REQUIRED** |
| Observability | Auth success/fail without secrets |
| Governance | **Excluded** from the A-only future auth pack unless a human extends it. Production MFA **F/C** |

---

## Priority 5 — Secrets hygiene (TECH-SEC-01, TECH-SEC-07) — Class A

| Field | Content |
| --- | --- |
| Objective | Keep `"dev-only-change-me"` impossible to treat as Production; keep bootstrap users Dev-only |
| Current behavior | Fallback in `main.ts`/`server.ts`; Production flags already exit on missing bootstrap secrets |
| Desired behavior | Tests documenting fallback; optional refuse-fallback when `EOS_ENV` is unset in CI. **Do not create Production secrets** |
| Files/modules | `main.ts`, `server.ts`, new tests |
| Tests required | Assert fallback string never used when production flags set. **NOT RUN** this stage |
| Security | Default JWT key is a known value |
| Rollback | Revert guard |
| Data / migration | None |
| Observability | Existing `bootstrap_secrets_missing_using_dev_defaults` warning |
| Governance | ADR-0012 product remains **C/D**. This item is hygiene only |

---

## Priority 6 — Audit / observability (TECH-OBS-01, TECH-OBS-05, TECH-OBS-02) — A and B

| Field | Content |
| --- | --- |
| Objective A | Keep JSON logs, redaction, `productionReady: false` |
| Objective B | Stop `/ready` reporting `ok: true, mode: "memory"` when operators believe dual-path is required — **authorization required** because it changes availability semantics |
| Current behavior | Ready succeeds with memory mode if `dbHealth` omitted |
| Desired behavior B | Configurable: fail ready if `EOS_DATABASE_URL` expected |
| Files | `server.ts`, `observability.ts`, `obs/routes.ts` |
| Tests | Ready 503 when DB required and down. **NOT RUN** |
| Security | Do not log tokens (redaction already) |
| Rollback | Revert ready policy |
| Data / migration | Durable Production audit remains **F/E** |
| Governance | Do not ship logs to a Production SIEM product (**C**) |

---

## Priority 7 — Application resilience (TECH-PER-04 already tested; TECH-OBS-02 B)

| Field | Content |
| --- | --- |
| Objective | Preserve GB-13 fail-closed; do not add fail-open memory writes for Commercial when pool set |
| Current | Fail-closed test exists |
| Desired | No regression; optional extend fail-closed tests to rfp/programme |
| Files | Gate B tests; domain modules |
| Tests | Existing GB-13; extensions **NOT RUN** if not written |
| Security | Fail-open hides loss |
| Rollback | N/A for keeping current |
| Migration | None |
| Governance | Production proof remains **F** |

---

## Priority 8 — Recovery tooling (TECH-REC-01, TECH-REC-07) — B and A

| Field | Content |
| --- | --- |
| Objective A | Keep LocalFs document round-trip tests |
| Objective B | Extend GB-14 harness to labelled **pg_dump/restore on disposable Dev PG** without calling `migrate()` to apply **new** files |
| Current | Harness attaches pool / new process only |
| Desired B | Documented Dev restore drill producing RV-style artefacts labelled **Dev/Test** |
| Files | `gate-b-recovery-harness.ts`; test files; **not** Production runbooks |
| Tests | Restore then read opportunity by id. **NOT RUN** as a Production RTO |
| Security | Dumps stay local; no live PII |
| Rollback | Delete dump files |
| Migration | **Forbidden** to create new SQL in the harness |
| Governance | Does not close GAP-REC-01/02. **Does not** choose CD-01 order |

---

## Priority 9 — Durable persistence hardening (TECH-PER-02, TECH-PER-09, TECH-PER-11, TECH-EVT-01) — Class B

| Field | Content |
| --- | --- |
| Objective | CRM/other `void persistOutboxInsert` → same-TX outbox; kernel `DocumentStorage.delete`; module SoR map; optional local NATS |
| Current | Commercial TX path exists; CRM fire-and-forget; kernel put/get only; in-memory events |
| Desired | After **separate persist authorization** (Gate B does **not** cover CRM TX rewrite) |
| Files | `crm/events.ts`, `persistence/outbox.ts`, `packages/kernel/src/commercial-document.ts` |
| Tests | Rollback leaves no outbox row. **NOT RUN** |
| Security | Orphan events |
| Rollback | Feature flag dual-path |
| Migration | New tables for undual-pathed modules → **E** |
| Governance | Gate C item 7 remains OPEN until kernel port authorized. Production NATS **C/F** |

---

## Explicitly not in A/B implementation design

Provider products, jurisdictions, Production TLS/WAF/KMS, PITR adoption, BCM sequence, Production migrate, MFA schema without auth, Helmet-as-unreviewed dependency without B auth.
