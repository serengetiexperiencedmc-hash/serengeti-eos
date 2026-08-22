# I1 DoD Closure Notes

**Date:** 2026-08-22  
**Status:** Development/Testing — **not production-ready**

## Closed

| Item | Evidence |
| --- | --- |
| Env-managed bootstrap credentials | `bootstrapSecretsFromEnv` + `.env.example`; no hardcoded runtime passwords |
| PostgreSQL migrations | `packages/db` migrate CLI; schema + `001_i1` + `002_i2` |
| Persistence wiring | `apps/api/src/persistence/*`; sync on startup when `EOS_DATABASE_URL` set |
| Observability | Structured JSON logs, correlation/request IDs, authn events, `/ready` DB check |
| Security regression suite | `security.regression.test.ts` |
| Admin audit / SoD / tenant tests | Existing `api.test.ts` + regression |

## Known limitations

- Docker was not available in this environment to execute live PG integration tests; they are gated by `EOS_RUN_PG_TESTS=1`
- In-memory store remains the default for unit tests
- Observability is foundational (logs + health), not a full metrics/tracing backend (I12)
- PAM / corporate IdP / production secrets remain out of scope (ADR-0006/12/13 OPEN)
