# E1-D — Observability Remediation Plan

> **`DESIGN ONLY`**  
> **`DEV/TEST ≠ PRODUCTION SIEM`**  
> **`NO MONITORING PRODUCT SELECTED`**  
> **`NO RTO/RPO FROM LOGS`**

**Date:** 2026-09-17.  
**Verified:** `observability.ts`, `server.ts` `/health` `/ready`, `obs/routes.ts`, `obs/service.ts`, `security/service.ts`.

Labels: **implemented** · **Dev/Test** · **design only** · **provider dependent** · **Production only**

---

| Topic | State | Notes |
| --- | --- | --- |
| Application logs | **implemented** · **Dev/Test** | `createLogger` JSON lines to stdout/stderr |
| Structured logs | **implemented** · **Dev/Test** | `ts`, `level`, `msg`, `service`, `productionReady: false` |
| Secret redaction | **implemented** · **Dev/Test** | password, token, EOS_TOKEN_SECRET, bootstrap password keys |
| Correlation | **implemented** · **Dev/Test** | `x-correlation-id`; requestId |
| Request completion / error hooks | **implemented** · **Dev/Test** | `request_completed`, `request_error` |
| Audit events | **implemented** · **Dev/Test** on Gate B path (PG `audit_events` when pool set); memory `store.audit` otherwise | Production durability **Production only** / **provider dependent** (location) |
| Security events | **implemented** · **Dev/Test** | Alerts `source: "devtest.webhook"`; ITSM ticket path in Dev |
| Metrics | **design only** for a Production product | Module `health` counters are **Dev/Test** JSON, not a metrics backend |
| Health `/health` | **implemented** · **Dev/Test** | Always `status: ok` with `productionReady: false` — liveness, not dependency truth |
| Readiness `/ready` | **implemented** · **Dev/Test** | Uses `dbHealth` **or** `{ ok: true, mode: "memory" }` — **design only** to fail when dual-path expected (TECH-OBS-02 **B**) |
| Dependency health | **Dev/Test** partial | Event infrastructure health on `/ready`; obs probes: api/web/oltp — web often `unknown` |
| Database health | **Dev/Test** when `EOS_DATABASE_URL` and `checkDatabaseHealth` wired in `main.ts` | Unwired in many tests |
| Backup health | **provider dependent** · **Production only** for real jobs | ADR-0011 register is **not** PG backup health |
| Recovery evidence | **Dev/Test** lab run folders; GB-14 harness | Production recovery evidence **Production only** |
| Alerting | **Dev/Test** webhook label | Production alerting **provider dependent** |
| Retention | **design only** · human/legal (E-13 draft) | Not a logging-product selection |
| Access control | **implemented** Dev on `/v1/obs/*` and `/v1/security/health` (authn) | Production IdP **human/provider** |
| Evidence export | **Dev/Test** CSV/JSON in several notification/audit export routes | Production evidence export **Production only** / retention decision |

---

## Remediation design (not implemented here)

1. Keep `productionReady: false` until a Production authorization exists.  
2. Do not select Datadog/CloudWatch/etc.  
3. Ready-probe honesty (TECH-OBS-02) needs **implementation authorization**.  
4. Backup/recovery health waits for a backup **product** (**C**) and Production (**F**).  
5. Do not treat log volume or lab timings as measured RTO/RPO.
