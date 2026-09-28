# E1-C — Deployment / Infrastructure / Governance Readiness Sprint (Provider-Neutral Preparation)

> **`SEDMC is NOT Production Ready.`**  
> **`E1 = NOT APPROVED / BLOCKED`** · **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`GATE C = OPEN / NOT AUTHORIZED FOR PRODUCTION`**  
> **`NO PROVIDER SELECTED`** · **`NO GEOGRAPHY SELECTED`** · **`NO ARCHITECTURE SELECTED`**  
> **`NO UAT`** · **`NO PRODUCTION DEPLOYMENT`** · **`NO PRODUCTION MIGRATION`**  
> **`E1-B = 9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD / 0 TRANSMISSIONS`**  
> **`THIS RECORD DOES NOT TRANSMIT, DEPLOY, OR SELECT INFRASTRUCTURE`**

**Date:** 2026-09-17.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Working tree:** DIRTY (Class A/B and prior E1-C diffs preserved; this sprint additive).  
**Author of this record:** Cursor (governance + provider-neutral Dev/Test safeguards only).  
**No commit. No push. No merge. No reset. No stash. No discard.**

---

## 1. Scope

Provider-neutral preparation and evidence for three remaining Class A gaps that **can progress now** without selecting a Production provider, geography, architecture, or infrastructure topology:

| Gap | Original required state | This sprint |
| --- | --- | --- |
| **GAP-DEP-02** | Remain portable; do not lock Production IaC until DP-0006 is approved | Deployment-readiness audit; CI/build/start/shutdown/config fail-closed. **No Terraform/Kubernetes/cloud lock.** |
| **GAP-INF-01** | Isolated Production; no live PII / Production credentials in Dev | Inventory existing artefacts; keep isolation; refuse silent Dev/Test substitution in Production-like env. **No Production environment created.** |
| **GAP-GOV-05** | Consistent C/D option letters at approval time (DP-0006 vs E1-A) | Reconcile the **existing** definition. Also confirm E1-B transmission facts (those belong to **GAP-GOV-04**). **Do not rewrite DP-0006.** |

Out of scope: sending RFI; contacting providers; ranking/scoring; UAT; Production secrets; migrate() against `eos_gateb`; Production recovery tests; claiming technical RTO/RPO.

---

## 2. Starting repository state

| Item | Fact |
| --- | --- |
| Remote/repo | serengetiexperiencedmc-hash/serengeti-eos |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | DIRTY (~249 short-status lines at sprint start) |
| Gate A | APPROVED |
| Gate B | APPROVED / DEV-TEST |
| Gate C | OPEN / NOT AUTHORIZED FOR PRODUCTION |
| E1 | NOT APPROVED / BLOCKED |
| Production provider / geography / architecture | NOT SELECTED |
| Technical RTO/RPO | NOT DEMONSTRATED |
| Prior E1-C live statuses | GAP-REC-03 sequence **CLOSED**. GAP-PER-02 / GAP-OBS-02 / GAP-DR-02 **IMPLEMENTATION/TESTING**. GAP-IDN-02 **PROVIDER EVIDENCE**. GAP-DEP-02 / GAP-INF-01 / GAP-GOV-05 **CAN PROGRESS NOW** (open) |

Existing Class A/B application diffs were **not** reset, cleaned, stashed, discarded, or overwritten.

---

## 3. GAP-DEP-02 assessment

**Definition (gap register, unchanged):** “No Production IaC lock. Rule: do not lock via Terraform/K8s. Portable until DP-0006 approved.”

**Objectively closed? NO.** DP-0006 remains OPEN. Portability window remains in force.

### Already deployment-ready independent of provider

- npm workspaces; Node `>=20`; `package-lock.json` present.
- Scripts: root `build` / `typecheck` / `test` / `migrate`; API `dev` (`tsx src/main.ts`), `build` (`tsc`), `test` (vitest); web `build` (`next build`), `typecheck`.
- API process entry: `apps/api/src/main.ts` (listen, hydrate, identity, migrate guard).
- `/health` and `/ready` exist; `productionReady` is **false**; `/ready` probes the pool when present and does not claim Production.
- Gate C startup migrate skip (`shouldApplyStartupMigrations`) for Production-like env and `eos_gateb`.
- Token-secret and local-password IdP fail-closed in Production-like env (prior sprint).
- Dev/Test CORS restricted to localhost/127.0.0.1 HTTP; in-memory login limiter; manual security headers. Not Production WAF/TLS.
- Version identification: package `0.1.0` / Increment I1. Not a Production release train.
- No service worker.

### Requires a provider decision

- Production runtime offering, bind address beyond Dev/Test `127.0.0.1`, object store, managed PostgreSQL, NATS product, email product, secrets manager, CDN, WAF, IdP, TLS certificates, DNS.

### Requires Production authorization

- Any UAT/Production deploy, hosted environment, Production `migrate()`, Production secrets, Production listen/expose, artefact promotion to a live environment (GAP-DEP-01).

### Requires a human decision / evidence

- DP-0006 approval (ends the “do not lock IaC” window or authorizes a later portable lock).
- Owner authorization for UAT/Production (GAP-DEP-01 / Gate C).

### Missing entirely (and correctly not invented)

- Production Dockerfile/Kubernetes/Terraform/Helm. **Not created** — creating them now would risk locking architecture (the gap itself).
- Production CI deploy job. **Not created.**
- Reproducible release-artefact pipeline beyond workspace `npm run build`. CI now runs `npm ci` + typecheck + test + build (this sprint). That is **not** a Production deploy.

### Provider-neutral defects found and fixed

| Defect | Disposition |
| --- | --- |
| API `start` script pointed at `dist/server.js` (module does not listen) | Fixed to `node dist/main.js` |
| CI used `npm install` (non-ci) and omitted `npm run build` | `npm ci` + `npm run build` |
| No SIGTERM/SIGINT graceful shutdown | Added `app.close()` + pool `end()` |
| Production-like env could theoretically continue after incomplete config if earlier guards were bypassed | `validateDeploymentConfig` fail-closed (token placeholder, memory SoR, demo seed, in-memory events, dev-outbox/smtp-stub, documented bootstrap passwords) |
| Event transport stubbed NATS on missing URL / connect failure | **Dev/Test unchanged.** Production-like env now **throws** (no stub) |

**New status:** **IMPLEMENTATION/TESTING** — deployment-readiness advanced in-repo; IaC remains unlocked; **not CLOSED**.

---

## 4. GAP-INF-01 assessment

**Definition:** Production credentials/data none allowed. Required state: isolated Production; no live PII in Dev.

**Objectively closed? NO.** Isolated Production **does not exist**.

### Classification of repository artefacts

| Artefact | Class | Note |
| --- | --- | --- |
| `infra/compose/dev.yaml` (Postgres 16, Redis 7, NATS 2.10 JetStream) | **A** provider-neutral Dev/Test reusable | File already states it does **not** represent Production architecture. Redis/NATS products for Production remain **unselected** (**B** if later adopted). |
| `.env.example` | **A** | Placeholders only. SES region example was `eu-west-1`; replaced with `REPLACE_WITH_PROVIDER_REGION_NOT_SELECTED` so it cannot be read as geography selection. |
| `packages/db` migrate CLI / `schema.sql` | **A** Dev/Test; **C** Production-gated | Startup skips Production-like and `eos_gateb`. Do not run `migrate()` against Production or to “fix” F1. |
| Disposable dump/restore harness | **A** Dev/Test; **C** Production-gated | Refuses `eos_gateb`. No Production backup product. |
| GitHub Actions `eos-kernel-ci` | **A** | Build/test only. No hosted Production. |
| `apps/web/next.config.ts` `distDir: .next-local`, `allowedDevOrigins: 127.0.0.1` | **A** Dev/Test | Windows/Simple Browser workaround. Not a CDN. |
| Dockerfiles | **E** missing | Deliberately **not** added (would imply container architecture). |
| Terraform / Kubernetes / Helm | **E** missing | Required absence until DP-0006 (GAP-DEP-02). |
| Production TLS / reverse-proxy / VPC / KMS / secrets manager / WAF / CDN | **E** missing + **C** Production-gated + **B** provider-dependent | Not invented. |
| Documented Dev bootstrap passwords in `.env.example` | **A** Dev/Test; **D** obsolete if copied to Production | Now **fatal** in Production-like validation. |
| `EOS_SEED_DEMO=true` in `.env.example` | **A** Dev/Test | Forbidden when Production-like. |

**New status:** **IMPLEMENTATION/TESTING** — isolation and fail-closed guards advanced; isolated Production still absent; **not CLOSED**.

---

## 5. GAP-GOV-05 assessment

**Existing definition (authoritative):** DP-0006 vs E1-A **C/D letter swap**. Required state: **consistent letters at approval time**. Evidence: E1-A nomenclature note. Proposed next action: record in the decision pack later; **do not rewrite DP-0006 now**.

This is **not** the RFI transmission gap. Transmission is **GAP-GOV-04** (0 transmissions; human send).

### Letter mapping (for the future approval pack — DP-0006 not rewritten)

| Letter | DP-0006 (architecture-decision / formal package usage) | E1-A / E1-C class types |
| --- | --- | --- |
| **C** | Hybrid | Tanzania-controlled colo |
| **D** | Colo Tanzania/Kenya | Hybrid |

E1-C uses E1-A class types. The swap is **NON-MATERIAL / NON-BLOCKING** until an approval pack. Documentation of the mapping is **advancement, not closure**.

**Does owner RFI SEND authorization close GAP-GOV-05?** **NO.** Authorization of information-gathering issuance does not make C/D letters consistent at DP-0006 approval.

**Can GAP-GOV-05 be CLOSED because authorization itself constitutes closure?** **NO.** The gap definition requires consistent letters **at approval time**. DP-0006 and E1 remain OPEN / NOT APPROVED.

**New status:** **HUMAN EVIDENCE/DECISION** — mapping table recorded; remaining work is wording in the approval pack; **not CLOSED**.

### E1-B transmission reconciliation (GAP-GOV-04; not used to close GAP-GOV-05)

Inspected: final transmission execution sheet; transmission evidence register; owner RFI authorization; routing reconciliation; E1-B4.6; E1-B5/B6 live pointers; next-action register; parallel-work register.

| Fact | Status |
| --- | --- |
| Authorized sender | **Patrick Makundi**, Owner, PDM |
| Authorized sender address | `rfp@serengetiexperiencedmc.com` |
| FULL-RFI routes | **9** (CU-01, 02, 03, 04, 06, 07, 08, 09, 12) |
| SCOPE CLARIFICATION routes | **2** (CU-10 SEACOM, CU-11 WIA) |
| HOLD | **1** (CU-05 Liquid C2) — **DO NOT CONTACT**; receives **nothing** |
| Historical 11-provider SEND set | **SUPERSEDED** |
| Named recipient people | **NOT ESTABLISHED** (`verified organizational route ≠ named recipient`) |
| Official forms/routes | Remain the frozen pack + recorded organizational routes |
| Transmissions recorded | **0** until actual evidence exists |
| Frozen hashes (unchanged; this sprint does not modify those files) | Questionnaire `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE`; PE `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E`; Template `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

GAP-GOV-04 remains **OPEN** / **HUMAN EVIDENCE/DECISION** (send artefacts). Cursor did not send email or submit forms.

---

## 6. Provider-neutral changes implemented

Application / CI (authorized fail-closed / reproducibility only):

1. `apps/api/src/deployment-config.ts` — `validateDeploymentConfig`, `listenHostFromEnv`.
2. `apps/api/src/main.ts` — validate at startup; refuse memory SoR and demo seed in Production-like env; listen host from env (default `127.0.0.1`); SIGTERM/SIGINT shutdown.
3. `apps/api/src/events/transport-init.ts` — Production-like env refuses in-memory-dev and NATS stub.
4. `apps/api/src/events/nats-transport.ts` — `createNatsTransportFromEnv(env)` optional env argument.
5. `apps/api/package.json` — `start` → `node dist/main.js`.
6. `.github/workflows/ci.yml` — `npm ci`; `npm run build`.
7. `.env.example` — Production-like fail-closed comments; SES region placeholder; compose labelled Dev/Test only.

Tests: `apps/api/src/e1-c-deployment-config.test.ts`.

No Dockerfile, Terraform, Kubernetes, Production secrets, or cloud deployment.

---

## 7. Tests executed

| Command | Result | Counts | Notes |
| --- | --- | --- | --- |
| `npm run typecheck -w @sedmc/api` | **PASS** | tsc `--noEmit` exit 0 | Includes new `deployment-config.ts` |
| `npm run typecheck -w @sedmc/web` | **PASS** | tsc `--noEmit` exit 0 | |
| `npm run build -w @sedmc/api` | **PASS** | tsc emit exit 0 | Confirms `dist/main.js` entry compiles. `dist/` gitignored |
| `npm run build -w @sedmc/web` | **PASS** | Next.js 16.3.2 exit 0 | Workspace production **build only**. Not a Production deploy. Output `.next-local` |
| `npx vitest run` (5 files: `e1-c-deployment-config`, `e1-c-closure.identity-f1-restart`, `e1-c-provider-neutral.observability`, `e1-d-class-a.token-bootstrap`, `e1-d-class-a.devtest-http`) | **PASS** | **5 files / 24 tests** | Deployment fail-closed, identity, health/ready honesty, CORS/headers |
| Full API suite / `migrate()` against `eos_gateb` | **NOT RUN** | — | F1 unchanged: `tenants` exists, `schema_migrations` empty. Do not migrate to green tests |
| Production recovery / pg_dump drill | **NOT RUN** | — | Unauthorized |

F1 (unchanged): `eos_gateb` has `tenants` while `schema_migrations` is empty; `schema.sql` `CREATE TABLE tenants` lacks `IF NOT EXISTS`. Tracker repair is unauthorized. Startup skip remains.

---

## 8. Evidence supporting each conclusion

| Conclusion | Evidence |
| --- | --- |
| Not Production Ready | `productionReady: false` on `/health` and `/ready`; Gate C OPEN; E1 blocked; no Production infra |
| GAP-DEP-02 not closed | DP-0006 OPEN; no Production IaC added |
| GAP-INF-01 not closed | No isolated Production; compose is Dev/Test only |
| GAP-GOV-05 not closed | Letters still swapped; approval pack not issued |
| RFI not sent | Transmission evidence register / execution sheet still **NOT TRANSMITTED** / **0** |
| Fail-closed config | `validateDeploymentConfig` tests; identity/token/migrate guards |
| Reproducible CI intent | `npm ci` + typecheck + test + build |

---

## 9. Provider-dependent items deliberately deferred

Cloud provider; region; VPC; Kubernetes; managed database; object storage; Redis product; NATS provider; KMS; secrets manager; CDN; WAF; IdP; Production email (SES region/product); TLS/DNS; backup geography.

---

## 10. Human evidence still required

Entity extract; PDPC artefact; DPO **formal appointment** (Wensley Shirima is OWNER-DESIGNATED only); named RFI recipient people; Patrick Makundi **actual send** of authorized RFI; DP-0006/E1 approval pack C/D letter consistency; budget still not fixed (TCO-first).

---

## 11. Production-gated items still open

Gate C remainder; Production migrate including 123; UAT; Production deploy; Production credentials; Production identity/MFA; Production SoR cutover; technical RTO/RPO demonstration; isolated Production network.

---

## 12. E1-B transmission status

**READY TO SEND — NOT SENT.** **0 transmissions.** **9 / 2 / 1.** CU-05 HOLD. Frozen files unmodified.

---

## 13. Exact remaining blockers

1. Human transmission of authorized RFI (GAP-GOV-04) and subsequent provider evidence.
2. DP-0006 / E1 approval (includes GAP-GOV-05 letter consistency at pack time).
3. Production IdP/MFA (GAP-IDN-01/02).
4. Isolated Production infrastructure (GAP-INF-01 required state) — **after** architecture/provider selection, which is **not** this sprint.
5. Gate C / GAP-DEP-01 Production authorization.
6. F1 tracker on `eos_gateb` — unauthorized to repair via `migrate()`.

---

## 14. Exact next governed action

**Human transmission** of the owner-authorized E1-B pack outside Cursor (Patrick Makundi / `rfp@serengetiexperiencedmc.com`), recording artefacts in the transmission evidence register.

This record **does not transmit**. **Do not select a provider from replies that do not yet exist.**

**SEDMC is NOT Production Ready.**

---

## Appendix A — Provider-neutral deployment prerequisites checklist

Not a Production runbook. Not an architecture selection.

- [x] Lockfile present (`package-lock.json`)
- [x] CI installs via `npm ci`
- [x] CI typecheck
- [x] CI unit/API tests (`npm test`)
- [x] CI production **build** of workspaces (`npm run build`) — does **not** deploy
- [x] API start entry is `dist/main.js`
- [x] `/health` and `/ready` exist and report `productionReady: false`
- [x] Production-like incomplete config fails closed
- [x] Dev/Test listen default `127.0.0.1`
- [x] Graceful SIGTERM/SIGINT
- [x] Startup `migrate()` skipped for Production-like and `eos_gateb`
- [ ] Production IdP selected (deferred — GAP-IDN)
- [ ] Production database/event/email/secrets products selected (deferred)
- [ ] Production deploy authorization (GAP-DEP-01)
- [ ] DP-0006 approved (GAP-GOV-02 / GAP-DEP-02 lock window)

---

## Appendix B — Configuration safety findings (Objective D)

| Topic | Current Dev/Test | Production-like |
| --- | --- | --- |
| localhost defaults | Listen `127.0.0.1`; CORS localhost only | Process must not start (IdP + config validation) |
| Dev token fallback | Allowed when not Production-like | Refused (including documented placeholder) |
| Automatic migrations | Allowed on empty non-`eos_gateb` Dev DB | Skipped (`production_gate_c_not_authorized`) |
| Dev email / in-memory events / in-memory persistence | Allowed with warnings | Fatal |
| Unrestricted CORS | **Not present** (localhost HTTP only) | N/A (process must not start) |
| Security headers | Class A Dev/Test headers; `X-EOS-DevTest: 1` | Not Production HSTS/WAF |
| Rate limits | In-memory login 10/60s | Not Production distributed limiting |
| Silent Dev substitution | Previously possible on NATS stub / ses-stub / memory SoR if Production-like flags were combined with incomplete config | Refused by `validateDeploymentConfig` + transport-init throw |
