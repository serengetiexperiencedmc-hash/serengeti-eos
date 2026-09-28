# H-119 — Formal UAT Acceptance and Production-Readiness Gate Preparation

> **Owner/POA governance decision.** Not Cursor as decision-maker.  
> **Not Production deployment.** **Not Production migration.** **Not SoR cutover.**  
> **Not H-80 exit.** **Not H-81.** **Not EOS adoption.**  
> Historical H-117 evidence is **not rewritten**.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved. Application code **unchanged**.

---

## A. Header

H-119 — Formal UAT Acceptance and Production-Readiness Gate Preparation

---

## B. Authority

The Owner/POA authorized this increment after:

- H-115 `ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`
- H-116 `UAT READINESS — READY WITH DOCUMENTED LIMITATIONS`
- H-117 `UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED`
- H-118 `REMEDIATION COMPLETE WITH LIMITATIONS` (H117-D-02 diagnosis only; no application-code change)

The governance decision recorded here is:

```text
H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS
```

This is **not**:

```text
Production approved
Production ready
EOS live
EOS adopted
H-81 complete
```

Cursor did not make the acceptance decision. The Owner/POA grant for H-119 is the authority. This file records that decision and prepares the Production-readiness gate. It does **not** authorize Production.

---

## C. UAT result

Sources (not rewritten): `h-117-uat-execution-report.md`, `h-117-uat-evidence-index.md`, `h-117-evidence/`, `h-118-h117-d02-remediation-report.md`.

| Item | Recorded result |
| --- | --- |
| Isolated UAT environment | `127.0.0.1:5436/eos_h117_uat` (container `serengeti-eos-h117-uat-pg`); API `http://127.0.0.1:18117`; web `http://127.0.0.1:3017` with `EOS_API_URL=http://127.0.0.1:18117` |
| Isolation | Did not alter `127.0.0.1:5432/eos` or `127.0.0.1:5435/eos_h112_full`. Gate B unused. |
| Mandatory H-116 scenarios | **All passed** |
| Optional scenarios | **Both passed** (UAT-RFP-07 401; UAT-SEC-01 invalid dates 400) |
| Blocker | **None** |
| Critical | **None** |
| Major application defect | **None** |
| H117-D-01 | DATA/ENVIRONMENT — see §C.1 |
| H117-D-02 | Disposition after H-118 — see §C.2 |
| H-118 | `H-118 REMEDIATION COMPLETE WITH LIMITATIONS` |
| Application-code change for H117-D-02 | **None required; none made** |

`EOS_ENV=uat` is production-like refuse in this codebase. Formal UAT therefore ran `EOS_ENV=development` against the UAT-named isolated catalog, not by setting `EOS_ENV=uat`.

### C.1 H117-D-01 final disposition

**Accepted as DATA/ENVIRONMENT. Not an application shutdown defect.**

Observed: Windows `npx tsx` SIGTERM of the listen PID released the UAT API port; wrapper exit was **1**; `shutdown_completed` was **not** observed.

This does **not** demonstrate an application lifecycle defect because deterministic **in-process** shutdown was already validated on the bounded Dev/Test path:

- H-106 / D6-T5 / D6-T6: loopback `POST /eos-devtest/f2-dp-01/bounded-shutdown` → **202** → `shutdown_completed` `listenerReleased=true` → process exit **0**
- That POST is **not registered** on the non-bounded UAT/full-schema startup path (H-117 recorded this; H-118 did not modify shutdown)

After the UAT process bounce, sidecar hydrate succeeded (`opportunities:1 rfps:1 pathB:1 accounts:1 rates:12 programmes:1`) and GET-after-restart recovered authorized facts. Restart scenarios therefore **PASS** with this environment limitation documented.

H-118 did not modify shutdown behaviour. H117-D-01 remains a documented DATA/ENVIRONMENT finding.

### C.2 H117-D-02 final disposition

**No application remediation required.**

H-117 originally classified a Next.js hydration overlay on `Shell.tsx` ~232 as **MINOR**. H-118 reproduced the overlay in the Cursor IDE browser and established:

- mismatch lines were exclusively injected `data-cursor-ref="eN"` attributes;
- 74 live `data-cursor-ref` nodes after Cursor snapshot instrumentation;
- no application HTML/className mismatch was evidenced;
- `Shell.tsx` already defers pathname-based active/badge rendering until after mount;
- `suppressHydrationWarning` was correctly rejected (would hide instrumentation, not fix a product defect);
- **no application-code change**.

**Limitation that remains:** the Cursor IDE browser overlay can appear during development/browser validation. On current evidence this is **not** a Production application Shell defect.

H-117’s original MINOR label in historical H-117 documents is **left intact**. This file records the **final disposition**: DATA/ENVIRONMENT (Cursor instrumentation), not an open product defect.

---

## D. Acceptance limitations

1. UAT was performed against **isolated UAT infrastructure** (`eos_h117_uat` on `:5436`), not Production.
2. **UAT is not Production.** Isolated UAT success does not validate Production hosting, credentials, DNS, TLS, or operational controls.
3. H117-D-01 remains an **environment/process-control** observation (Windows `npx tsx` wrapper). Deterministic in-process shutdown remains the evidenced application path on the bounded plane.
4. Cursor IDE browser instrumentation can generate the observed hydration overlay (`data-cursor-ref`).
5. That overlay does **not** establish a Production Shell defect on current evidence.
6. Production infrastructure and deployment have **not** been validated.
7. Production authorization has **not** been granted.

Additional documented UAT limitations (not defects; restated, not rewritten from H-117 §13): numbering hole `112`–`116`; `EOS_SEED_DEMO` kept false; H-112 named-branch cannot target port 5436; Dev/Test bootstrap identities, not Production IdP; static UI copy still mentions default `:8080`/`:3001` while UAT used `3017`→`18117`.

---

## E. UAT acceptance conclusion

```text
H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS
```

Engineering baseline remains H-115 `ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`. H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. Operational SoR is unchanged.

---

# Production-readiness assessment

This section is a **gate preparation**. It does not deploy, migrate, create Production databases, load Production data, issue Production credentials, change DNS, or claim Production readiness because UAT passed.

`validateDeploymentConfig()` still returns `productionReady: false` by type and by value (`apps/api/src/deployment-config.ts`). Kernel `packages/db/schema.sql` header still states **Not production-ready**. ADR-0006 and DP-0006 remain **OPEN** in the E1-C Production gap register (dated 2026-09-17; 0 of 53 gaps objectively closed at that register’s last closure stage).

Legend used below:

| Token | Meaning |
| --- | --- |
| tested | Exercised in H-117 isolated UAT and/or prior Dev/Test live/automated evidence |
| evidenced | Recorded in repository governance/test artefacts |
| not yet validated | No Production (or Production-equivalent hosting) evidence |

Do **not** infer Production readiness from Dev/Test or isolated UAT evidence.

---

## Production A. Application

| Capability | Tested | Evidenced | Production-validated |
| --- | ---: | ---: | ---: |
| API `GET /health` | Yes (H-117 UAT-01; H-112/H-114; D6-T5) | Yes | **No** |
| API `GET /ready` | Yes (prior lifecycle; full-schema/UAT startups) | Yes (`applicationReady` on Dev/Test) | **No** — `/ready` honesty is Dev/Test; not Production-aware |
| Web TypeScript | Yes (H-118 `tsc` 0 errors; D6-T4/H-112/H-114) | Yes | **No** — no Production web build/host evidence |
| Web focused tests | Yes (H-118: 36 passed) | Yes | **No** |
| Commercial workflows in UAT catalogue | Yes — all mandatory + optional PASS | H-117 report + evidence index | **No** |
| Authentication (Dev/Test local password) | Yes — Carol 200; wrong password 401 | H-117 AUTH-01/02 | **No** — Production IdP unselected (GAP-IDN-01) |
| Authorization `authorize()` | Yes — Alice 403; Carol retained access | H-117 AUTH-04; H-114 | **No** — Production identity provisioning unselected |
| Persistence / hydration | Yes — sidecar hydrate after restart | H-117 wave2; six F2 maps | **No** — Production PostgreSQL unselected |
| API contracts (facts GET/PUT, overlay, 400/401/403/409) | Yes | H-117 wave1 | **No** |
| Web-to-API integration | Yes — isolated Next `3017`→`18117`; `/eos-api/health` matched `/health` | H-117 §10 | **No** — Production origin/CORS/TLS unselected |

**Classification: READY WITH CONDITIONS**

Condition: the **authorized application slice** is evidenced in isolated UAT/Dev/Test. That is **not** a Production runtime, Production identity, or Production hosting validation. `productionReady` remains `false`.

---

## Production B. Database

| Topic | Evidence | Production status |
| --- | --- | --- |
| Production migration plan | Gate C Item 5: **ASSESSED / BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**. Apply-on-Production is authorization **F** — **NOT AUTHORIZED** | **Missing** — DBA/architecture decision required |
| Migration ordering | Filename sort after `schema.sql`; chain through `124_f2_dp01_commercial_facts.sql`; hole **112–116** (files absent; apply succeeded on disposable catalogs) | Documented; **not** a Production apply authorization |
| Migration safety | Numbered files: no `BEGIN`/`COMMIT` in catalogue; no `DROP TABLE`/`DELETE`/`TRUNCATE` found in Gate C Item 5 inspection; some CHECK/unique constraint replacements; `schema.sql` requires `pgcrypto` | **Not proven** on a Production host |
| Rollback / backup | Gate C Item 5: rollback SQL **not designed**. GAP-BKP-01 Production backup product **TBD**. Lab dumps are **not** Production backup | **Missing** |
| Schema state | UAT `eos_h117_uat`: 120 `schema_migrations` rows (`schema.sql` … `124`). Full-schema Dev/Test `eos_h112_full`: same class. Bounded `eos`: `schema_migrations` **NULL** (124-only sidecar preserved) | Production schema **does not exist** in evidence |
| Migration 124 | Applied on authorized disposable full-schema and UAT catalogs only | **Must not** be applied to `eos` |
| Numbering hole 112–116 | Absent files; H-112/H-117 apply succeeded | DBA must treat hole as known, not as a failed apply |
| Unsafe existing-environment apply | CLI/startup refuse migrate against database name `eos` (`h111_eos_124_only_preserved`). Gate B / `eos_gateb` unauthorized. Production-like migrate refused without complete fail-closed config | **Do not** migrate `127.0.0.1:5432/eos` |
| Bounded `eos` catalog | **Must remain untouched** (H-89/H-111/H-112/H-117 control) | Confirmed constraint |
| Clean Production database | Expected if Production is ever authorized: a **new** catalog, not `eos`, not `eos_h112_full`, not `eos_h117_uat` | **Not created**. H-119 did not create one |
| Migration authorization control | Separate Owner/POA grant required; Gate C remainder **NOT AUTHORIZED**; `productionReady: false` on migrate CLI | **Not granted** |

No migration was executed in this increment. No database was modified.

**Classification: NOT READY** (also **GOVERNANCE DECISION REQUIRED** for any future Production catalog/migrate grant; **HUMAN/INFRASTRUCTURE ACTION REQUIRED** for DBA/host/extension privilege).

---

## Production C. Environment

Required Production configuration vs repository evidence. Unknowns are **unknown** — no hostnames, providers, or credentials are invented.

| Item | Current evidence | Production |
| --- | --- | --- |
| API environment | Dev/Test / isolated UAT `EOS_ENV=development`; listen `127.0.0.1` | **Unknown** |
| Web environment | Next `distDir: .next-local`; `allowedDevOrigins: ["127.0.0.1"]`; UAT `:3017` | **Unknown** |
| Database connection | Dev compose `postgres://eos:eos-dev-only@127.0.0.1:5432/eos` in `.env.example` (Dev/Test only); UAT used `:5436/eos_h117_uat` | **Unknown** |
| Secrets | Env-file Dev secrets; ADR-0012 secrets platform **blocked** UAT/Production | **Unknown / unselected** |
| Authentication configuration | Local-password Dev bootstrap (Alice/Bob/Carol/Partner). Production-like **forbids** this IdP (`localPasswordIdentityForbiddenReason`) | **Unselected** (GAP-IDN-01) |
| CORS / origin | `applyDevTestCors`: `http` + `localhost`/`127.0.0.1` only; wildcard rejected | Production origin **unselected** |
| Public hostname / domain | None in repo | **Unknown** |
| TLS / HTTPS | None Production; `EOS_DATABASE_TLS_MODE=require` demanded only when production-like | **Unknown** |
| Logging | Structured JSON + redaction; `productionReady: false`; GAP-OBS-01 sink unselected | Dev logs ≠ Production SIEM |
| Health / ready | Implemented; Production probe policy not authorized | **Not Production-validated** |
| Process supervision | Local `npx tsx` / `next dev` | **Unknown** |
| Restart / shutdown | Bounded POST trigger loopback-only; wrapper SIGTERM H117-D-01 | Production supervisor **unknown** |
| Resource requirements | Not measured for Production | **Unknown** |

`.env.example` states: placeholders are **not** Production values; Isolated Production does not exist; SEDMC is **not** Production Ready.

**Classification: HUMAN/INFRASTRUCTURE ACTION REQUIRED**

---

## Production D. Security

| Control | Dev/Test / UAT evidence | Production |
| --- | --- | --- |
| Authentication | Carol login 200 | Local-password **refused** when `EOS_ENV`/`NODE_ENV` production-like. Named OIDC IdP **unselected** |
| Authorization | `authorize()`; Alice 403; Carol 200 | Same code path; Production principals **not provisioned** |
| 401 / 403 | UAT-AUTH-02/03/04; UAT-RI-06; UAT-RFP-07 | Tested in UAT; not Production IdP-tested |
| Bootstrap identities | `.env.example` `test-*-not-for-prod`; production-like fatal if those exact values are set | **Must not** be used |
| Production identity provisioning | GAP-IDN-01 / ADR-0013 OPEN | **Missing** |
| MFA | GAP-IDN-02 **UNVERIFIED** for Production admin | **Missing** |
| Secret management | Env files; Dev token fallback refused in production-like | ADR-0012 **unselected** |
| Database credential isolation | Distinct UAT user `eos_h117` vs Dev `eos`; Production credentials **not created** | **Missing** |
| CORS | Loopback HTTP only | Production origin/TLS CORS **unselected** |
| HTTPS | Not present | **Missing** |
| Exposed Dev/Test routes | See bounded-shutdown below | Must remain unregistered / refused in Production-like |
| Login rate-limit | In-memory 10/60s Dev/Test only (`devtest-http-controls.ts`) | **Not** a Production distributed limiter |

### Deterministic shutdown route

`POST /eos-devtest/f2-dp-01/bounded-shutdown`

From `apps/api/src/commercial-facts/bounded-shutdown-trigger.ts`:

- **Not registered** unless bounded Dev/Test startup already holds.
- Request-time refuse: `production_like_not_authorized`, `not_bounded_mode`, `listen_host_not_loopback`, `remote_not_loopback`.
- Production-like (`EOS_ENV=production|uat` or `NODE_ENV=production`) → **not registered** / **403** if somehow hit.
- H-117 UAT (default full-schema path, bounded opt-in **unset**) did **not** expose this control.

It is therefore **strictly bounded to Dev/Test bounded startup + loopback**. It is **not** a Production control surface on current code. **No modification in this increment.**

Other fail-closed Production-like refusals already in code (not a substitute for a Production grant): local-password IdP, Dev token fallback, `EOS_SEED_DEMO=true`, in-memory event transport, `dev-outbox`/`smtp-stub` email, local-fs document storage, missing `EOS_DATABASE_URL` / `EOS_DATABASE_TLS_MODE=require`.

**Classification: READY WITH CONDITIONS** for the **Dev/Test/UAT authorization contract** (401/403/409). **NOT READY** for Production identity, secrets, HTTPS, MFA, and CORS.

---

## Production E. Operational readiness

Source: `adr-0006-e1-c-production-operations-readiness-plan.md` (2026-09-17) — **OPERATIONAL READINESS NOT CLAIMED**. Ownership cells TBD; no named on-call invented here.

| Function | Status in evidence |
| --- | --- |
| Deployment procedure | **NOT READY** — DP-0006 OPEN; IaC lock forbidden |
| Migration procedure | **NOT READY** — Gate C Item 5 blocked |
| Rollback procedure | **NOT READY** — none Production |
| Backup / recovery | **NOT READY** — GAP-BKP-01/02; GAP-REC-01 lab synthetic only |
| Monitoring / alerting | **NOT READY** — GAP-OBS-01 product unselected |
| Logging | Dev JSON only |
| Incident response | E-15 draft ≠ Production IR |
| Support ownership | HUM-08 not recorded |
| Operational runbook | H-112 is **Dev/Test only**, not Production |
| Environment separation | Dev/Test/UAT catalogs exist; Production environment **does not** |
| Release procedure | **NOT READY** |

H117-D-01 is relevant to **process supervision** if Production were ever run under `npx tsx`. That is not an evidenced Production runtime. A future Production supervisor is **unknown**.

**Classification: NOT READY**

---

## Production F. Data / SoR

Explicitly preserved:

- Current operational SoR remains **Office / Excel / Outlook/Gmail / WhatsApp / phone** unless separately changed.
- EOS does **not** become the operational SoR because UAT passed or because H-119 accepted UAT.
- No mailbox ingestion.
- No Excel ingestion.
- No WhatsApp ingestion.
- No automated phone ingestion.
- No SoR cutover.

WP-14 persist SoR cutover / retire in-memory Store remains **NOT AUTHORIZED**. H-91 residue on bounded `eos` was **not** deleted.

Production readiness of **software** must not be confused with commercial-system **adoption**.

**Classification: GOVERNANCE DECISION REQUIRED**

---

## Production G. Governance exclusions

These remain **separate** items. They are **not** implemented here and are **not** silently resolved.

| Item | Status |
| --- | --- |
| H-80 exit | **ACTIVE** (not exited) |
| H-81 | **NOT STARTED** |
| SoR cutover | **Not authorized** |
| Ingestion / integration | **GOVERNANCE-BLOCKED** |
| Booking | **GOVERNANCE-BLOCKED** (G-05-E) |
| KPI history | **GOVERNANCE-BLOCKED** (G-07-A) |
| Revenue / profit definitions | **GOVERNANCE-BLOCKED** |
| FX | **GOVERNANCE-BLOCKED** |
| Rate Identity overlap winner / preferred / ranking | **GOVERNANCE-BLOCKED** (H-113 PARTIALLY DEFINED; H-114 overlay-only) |
| Live-proposal rate freeze | **GOVERNANCE-BLOCKED** |
| Expired-rate live-proposal policy | **GOVERNANCE-BLOCKED** |
| Public-for-sale approval | **GOVERNANCE-BLOCKED** |
| Overlay / mixed precedence | **GOVERNANCE-BLOCKED** (`overlapResolution: none`) |
| ADR-0006 / DP-0006 | **OPEN** |
| Gate B / `eos_gateb` | **Unauthorized** |
| F2-I12 / I1–I11 thaw / G-08-B admin console | **Ungranted** |
| Legal / DPO / PDPC / residency / vendor DPAs | E1-C PRODUCTION-BLOCKING gaps remain per 2026-09-17 register |

UAT-RI-09 **PASS** meant those Rate Identity policies were **absent / explicitly non-implemented**, which was the authorized expected result — not a Production policy close.

**Classification: GOVERNANCE DECISION REQUIRED**

---

# Production readiness classification (summary)

| Category | Classification |
| --- | --- |
| Application (authorized slice, isolated UAT/Dev/Test) | **READY WITH CONDITIONS** |
| Database / Production schema | **NOT READY** |
| Environment / hosting / TLS / DNS | **HUMAN/INFRASTRUCTURE ACTION REQUIRED** |
| Security (Production IdP/secrets/HTTPS) | **NOT READY** |
| Security (UAT 401/403/bounded-shutdown isolation) | **READY WITH CONDITIONS** |
| Operational readiness | **NOT READY** |
| Data / SoR / adoption | **GOVERNANCE DECISION REQUIRED** |
| Remaining commercial policy (Rate Identity live-proposal, booking, KPI, FX, …) | **GOVERNANCE DECISION REQUIRED** |
| ADR-0006 Production architecture | **GOVERNANCE DECISION REQUIRED** |

### Overall classification

```text
NOT READY
```

UAT acceptance is a **necessary input** to a later Production gate. It is **not** sufficient. Isolated UAT success plus H-115 engineering completeness do **not** constitute Production authorization, Production infrastructure, or EOS operational SoR.

---

# Production gate checklist

| Gate | Status | Evidence | Remaining Action |
| --- | --- | --- | --- |
| Engineering | **READY WITH CONDITIONS** | H-115 audit | Do not reopen authorized engineering as a substitute for ops/infra |
| Formal UAT | **COMPLETE** | H-117 execution report + `h-117-evidence/` | Do not re-run full UAT unless scope changes |
| UAT acceptance | **ACCEPTED WITH LIMITATIONS** | This file (Owner/POA) | Limitations in §D remain in force |
| Production database | **NOT READY** | Gate C Item 5 blocked; no Production catalog | Human/DBA: new catalog; never migrate `eos` |
| Production configuration | **NOT READY** | `.env.example` Dev/Test; `productionReady: false` | Select Production env values after architecture |
| Secrets/credentials | **NOT READY** | GAP-SEC-01; ADR-0012 blocked | Named secrets/KMS; no git secrets; no Dev passwords |
| Authentication | **NOT READY** (Production) | GAP-IDN-01; local-password refused production-like | Named OIDC IdP; provision Production principals |
| Authorization | **READY WITH CONDITIONS** | H-117 401/403; `authorize()` | Bind to Production identities once IdP exists |
| HTTPS/domain | **NOT READY** | GAP-NET-01; none in repo | DNS owner + TLS after host selection |
| Monitoring/logging | **NOT READY** | GAP-OBS-01 | Named sink, alerts, on-call |
| Backup/recovery | **NOT READY** | GAP-BKP / GAP-REC; lab ≠ Production | Product, encryption, restore test |
| Deployment procedure | **NOT READY** | DP-0006 OPEN | After topology |
| Rollback | **NOT READY** | Gate C Item 5: rollback SQL not designed | After topology + migrate grant |
| Operational runbook | **NOT READY** | H-112 Dev/Test runbook only | Production runbook after host/IdP/backup exist |
| Dev/Test boundary | **READY WITH CONDITIONS** | Dual catalogs; bounded-shutdown not on UAT path; production-like refuse | Keep `eos` / Gate B / UAT catalogs off Production |
| SoR boundary | **GOVERNANCE DECISION REQUIRED** | H-115/H-117 SoR statements | No cutover implied by UAT |
| Governance | **GOVERNANCE DECISION REQUIRED** | H-80 ACTIVE; H-81 NOT STARTED; ADR-0006 OPEN | Separate grants |
| Production authorization | **NOT GRANTED** | This increment explicitly excludes it | Future Owner/POA grant only |

---

# Production-readiness gap list

Priorities use operational impact, not technical interest.

### P0 — must be resolved before Production authorization

1. Explicit **Owner/POA Production authorization** (this increment is not that grant).
2. **Production architecture / hosting / region** (ADR-0006 OPEN; GAP-HST-01/02; DP-0006 OPEN). Preference for Tanzania residency is **not** approval (GAP-RES-01).
3. **Clean Production database** (new catalog) plus **authorized** migrate path. Do not use `eos`, `eos_h112_full`, `eos_h117_uat`, or `eos_gateb`.
4. **Production secrets/KMS** and non-placeholder `EOS_TOKEN_SECRET` (GAP-SEC-01; deployment-config fatal rules).
5. **Production IdP** and privileged **MFA** (GAP-IDN-01/02; ADR-0013). Local-password Dev bootstrap cannot authenticate production-like.
6. **TLS/HTTPS and Production DNS** (GAP-NET-01). Database `EOS_DATABASE_TLS_MODE=require` when production-like.
7. **Production CORS/origin** replacing loopback-only Dev/Test CORS.
8. **Backup product + restore evidence** (GAP-BKP-01; GAP-REC-01). Lab dump ≠ Production backup.
9. **Operational ownership, on-call, incident path** (`e1-c-production-operations-readiness-plan.md` NOT READY).
10. **Legal/privacy PRODUCTION-BLOCKING items** still open in the E1-C gap register (entity verification, PDPC as applicable, DPO if required, vendor DPAs, privacy notice publication). Do not invent closure.
11. Confirm Production-like startup **refuses** Dev substitutions (in-memory NATS, `dev-outbox`, local-fs documents, `EOS_SEED_DEMO=true`, documented bootstrap passwords) **and** that selected Production products actually exist — currently **unselected**.
12. **Event transport and email Production products** remain unselected; production-like env currently **fatal** without them (`nats-jetstream` + `EOS_NATS_URL`; non-stub email adapter).

### P1 — should be resolved before Production where operationally necessary

1. Production **process supervision** (not `npx tsx` wrapper). H117-D-01 is the evidenced wrapper limitation.
2. Production **web build/host** (not `next dev`; not `.next-local` Dev lock; not `allowedDevOrigins` as a Production CORS stand-in).
3. Production **`/ready` probe policy** (Dev/Test honesty is not Production-aware).
4. DBA acknowledgement of migration numbering hole **112–116** and `pgcrypto` privilege.
5. Login **distributed** rate-limit (current limiter is process-local Dev/Test).
6. Document-bytes **Production object store** (GAP-PER-03 adapter unselected).
7. Audit/outbox **Production event-bus** runtime proof (GAP-PER-02; Dev outbox ≠ Production NATS).
8. Operator-visible UAT finding: static UI copy still mentions default `:8080`/`:3001` (H-117 limitation 10) — documentation/ops, not a UAT fail.

### Governance decision (not silently implemented)

- H-80 exit; H-81; SoR cutover; ingestion.
- Booking; KPI history; revenue/profit; FX.
- Rate Identity winner/preferred/ranking; live-proposal freeze; expired-rate live-use; public-for-sale; overlay/mixed precedence.
- Whether overlay-only Rate Identity (H-114) is the authorized Production commercial contract, or whether live-proposal policy must close first (H-113 PARTIALLY DEFINED).
- Whether EOS may be **deployed** without becoming operational SoR (recommended default until a separate adoption grant).

### Infrastructure / human action

- Host/region/compute selection after evidence (do not select in this file).
- DNS owner; certificate management.
- DBA: create Production catalog only after authorization; extension privilege for `pgcrypto`.
- Named secrets rotation owners.
- Named UAT testers were an H-116 human appointment; H-119 records Owner/POA **acceptance of the executed pack**, not a rewrite of tester names.
- Provider contracting / support path (E1-B historically paused/superseded as current next action in the 2026-09-17 register — **not reopened here**).

### Post-Production enhancement (not a Production blocker on current evidence)

- Cursor IDE `data-cursor-ref` hydration overlay (H117-D-02 disposition: environment instrumentation).
- Repeating full H-116 catalogue as a second formal UAT cycle without a scope change.
- Cosmetic UI copy about default Dev ports.
- Broader CI/Playwright corpus beyond this programme’s evidence.

---

# Repository discipline

| Item | Value |
| --- | --- |
| HEAD (baseline = final) | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Application code this increment | **Unchanged** |
| Databases this increment | **Uncontacted for change**; no migrate; no Production command |
| Commit / push | **Not performed** |
| H-120 | **Not started** |

---

# What remains between UAT acceptance and Production authorization

UAT is accepted with limitations. Before any future Production grant, the organisation still needs: a selected Production architecture and host; a new Production database and authorized migrate; Production IdP/MFA/secrets/TLS; backup/restore and ops ownership; closure or explicit deferral of E1-C PRODUCTION-BLOCKING legal/residency gaps; and a **separate** Owner/POA Production authorization. None of those are supplied by H-117, H-118, or this file.

```text
H-117 UAT ACCEPTED WITH DOCUMENTED LIMITATIONS
PRODUCTION AUTHORIZATION = NOT GRANTED
H-80 = ACTIVE
H-81 = NOT STARTED
SoR = UNCHANGED
STOP
```
