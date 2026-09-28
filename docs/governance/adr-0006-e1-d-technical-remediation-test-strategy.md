# E1-D — Technical Remediation Test Strategy

> **`STRATEGY ONLY`**  
> **`EVERY TEST BELOW: NOT RUN`** unless an **actual** execution is recorded  
> **`NO FABRICATED RESULTS`** · **`NO FABRICATED RTO/RPO`**

**Date:** 2026-09-17.

Existing historical suites (Gate B fail-closed, CD foundation, vitest module tests) **have been run in prior stages** under their own records. **This E1-D stage executed no new tests.** Rows below are the **remediation strategy** and are **NOT RUN** as E1-D evidence.

---

| ID | Type | Purpose | Class / TECH | Result this stage |
| --- | --- | --- | --- | --- |
| TS-U-01 | Unit | Header map helper / CORS origin parser | A TECH-SEC-03/04 | **NOT RUN** |
| TS-U-02 | Unit | Rate-limit window counter | A TECH-SEC-05 | **NOT RUN** |
| TS-U-03 | Unit | Token secret fallback vs production flags | A TECH-SEC-01 | **NOT RUN** |
| TS-U-04 | Unit | OptimisticConcurrencyError / unique violation (already exists historically) | Persist | **NOT RUN** as E1-D (historical file exists) |
| TS-I-01 | Integration | Fastify inject `/health` headers | A | **NOT RUN** |
| TS-I-02 | Integration | OPTIONS CORS allow localhost / deny other | A | **NOT RUN** |
| TS-I-03 | Integration | Login burst 429 | A | **NOT RUN** |
| TS-I-04 | Integration | Dual-path Commercial TX audit+outbox (Gate B historical) | Persist | **NOT RUN** as E1-D |
| TS-I-05 | Integration | CRM same-TX outbox after future B grant | B TECH-PER-02 | **NOT RUN** |
| TS-A-01 | API | Unauthenticated `/v1/security/health` 401 (historical pattern) | Regression | **NOT RUN** as E1-D |
| TS-A-02 | API | `/ready` 503 when DB required and down (future B) | B TECH-OBS-02 | **NOT RUN** |
| TS-S-01 | Security | No `Access-Control-Allow-Origin: *` | A | **NOT RUN** |
| TS-S-02 | Security | MFA bypass (future B) | B TECH-IDN-02 | **NOT RUN** |
| TS-S-03 | Security | Default JWT secret rejected when production flags set | A | **NOT RUN** |
| TS-P-01 | Persistence | GB-13 fail-closed (historical test file) | F proof still Dev-only | **NOT RUN** as E1-D |
| TS-P-02 | Persistence | Per-request SQL read after write when pool set | Historical / B extensions | **NOT RUN** as E1-D |
| TS-C-01 | Concurrency | Two updates same version → one stale_version | Persist | **NOT RUN** as E1-D |
| TS-F-01 | Failure-mode | Pool connect throw → no memory Commercial write | TECH-PER-04 | **NOT RUN** as E1-D |
| TS-F-02 | Failure-mode | Metadata insert fail → bytes compensated (delete) | TECH-PER-09 | **NOT RUN** as E1-D |
| TS-R-01 | Recovery | Disposable pg_dump/restore then read opportunity | B TECH-REC-01 | **NOT RUN** |
| TS-R-02 | Recovery | Document LocalFs round-trip (historical CD tests) | A TECH-REC-07 | **NOT RUN** as E1-D |
| TS-R-03 | Recovery | Production restore | F | **NOT RUN** (forbidden) |
| TS-O-01 | Observability | Log line contains `productionReady: false` and redacted token | A | **NOT RUN** |
| TS-O-02 | Observability | Backup health product | C | **NOT RUN** |
| TS-G-01 | Regression | Existing vitest Gate B persist + fail-closed + CD foundation | After any future A grant | **NOT RUN** as E1-D |

---

## Rules

- Do not paste invented timings, pass counts, or coverage %.  
- Dev/Test recovery timings, if later run, stay labelled **Dev/Test** and are **not** Production RTO/RPO.  
- Production recovery tests are **not** in this strategy’s executable set.
