# H-184 — Production Implementation Preflight and Deployment Readiness Gate

> **PREFLIGHT / EXECUTION-CONTROL PACKAGE ONLY.**  
> Specifies the full Production sequence **if** remaining evidence existed **and** Owner/POA later granted implementation.  
> **NOT** that grant. **NOT** GCP provisioning, Cloud Run deploy, Cloud SQL, replica, migrate, credentials, DNS, TLS, IAM, DR test, or Production readiness.  
> H-181, H-182, and H-183 were **inspected and not rewritten**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 680  
**Porcelain after this increment:** 681 (this file only)  
**Application / schema / migration / infrastructure changes:** **NONE**  
**GCP / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 sent / evidence received:** **NONE**  
**Commit / push:** **NONE**  
**H-185:** **NOT CREATED**

```text
H-184 STATUS = COMPLETE — PREFLIGHT PACKAGE PREPARED; PRODUCTION NOT IMPLEMENTED
productionReady = false (apps/api/src/infrastructure-contract.ts; deployment-config.ts)
PRODUCTION REVISION: TBD AT IMPLEMENTATION AUTHORIZATION
HOSTNAME NOT YET SELECTED
```

Five states (do not collapse): **DESIGN COMPLETE** · **PREPARED** · **EVIDENCE PENDING** · **IMPLEMENTATION AUTHORIZED** · **IMPLEMENTED / VALIDATED**.

---

## 1. Objective

If remaining external evidence were available **and** Owner/POA subsequently granted Production implementation, this file is the ordered preflight: prerequisites, roles, validation, rollback, and acceptance. Completes now only what can be specified without inventing facts or touching Production.

---

## 2. Authority

Owner/POA directed continued completion without idling on external waits. H-183 authorized **preparation**, not implementation. H-184 is the **preflight package**. Implementation remains a **later explicit grant** (H-171 §5; H-183 P01).

HUM-08 **roles** (H-183) are used. Individuals: **PDM** (H-125 Owner/escalation/vendor); **Wensley Shirima** (DPO, appointment evidence required, not GCP admin); **Thomas Nguluma** (E1-C01 counsel). No names invented. Specialists remain unappointed.

---

## 3. Current baseline

| Topic | State |
| --- | --- |
| Architecture | H-169 SELECTED |
| Encryption default | Google-managed (H-183 P06) — not applied |
| Secrets design | H-183 P07 — product OPEN |
| App DR design | H-183 P09 CLOSED at design |
| DNS framework | H-183 P10; hostname TBD |
| Cost structure | H-183 P12; prices absent |
| HUM-08 | Roles defined; specialists OPEN |
| Outbound evidence | H-181 AUTHORIZED; sent NONE |
| DR packages | H-182 companions PREPARED; not implemented |
| Last migration | **125**; **126 does not exist** |
| Dev/Test infra | `infra/compose/dev.yaml` only — **no** Cloud Run/Cloud SQL IaC in repo |
| `productionReady` | **false** (hard-coded) |

---

## 4. Production implementation chain

Roles are HUM-08 titles. **IMPLEMENTATION AUTHORIZED** is **false** today for every execution step.

| Stage | Inputs | Role | Authorization | Execution | Validation | Evidence | Rollback | Exit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Prerequisite evidence | H-175 EV-*; H-181 responses | Vendor/GCP + Legal/Privacy | H-181 send | Collect/review | H-175 §9 classes | Dated artefacts | N/A | Evidence accepted **or** gaps recorded |
| Owner/POA approval | Accepted evidence | Product/System Owner (PDM) | Owner decision | Record P03–P13 values | Decision register | H-series increment | Superseding increment | Values decided |
| **Production implementation authorization** | H-171 §5 | Owner/POA | **Explicit grant** | Written grant | Scope matches architecture | Grant document | Grant revocation | **Grant on file** |
| Infrastructure provisioning | Grant + project | Platform Owner | Grant | GCP project, VPC, logging `africa-south1`, monitoring | Console/API | Project id (not invented now) | Delete unused project **only if grant allows** | Project exists |
| Database provisioning | Version, size, P06 | Database Owner | Grant | Cloud SQL Plus `africa-south1`; HA; backup location; TLS require | Instance API | Instance name | Stop; do not treat as Production catalog `eos*` Dev names | Instance READY |
| Schema migration | 001–125 inventory | Database Owner | **Separate migrate grant** | `npm run migrate -w @sedmc/db` against **new** catalog only | `schema_migrations` = 125 | Migrate log | Restore from backup taken **before** migrate | Ledger = 125 |
| Application deployment | `PRODUCTION REVISION: TBD` | Platform Owner | Grant | Build + Cloud Run `africa-south1` | `/health` `/ready` | Revision SHA at the time | Traffic to previous revision | Ready 200 |
| Security/access validation | IdP/MFA | Security/Access Owner | Grant | Bind groups; refuse local-password | Login + MFA | Screenshots/logs | Disable bindings | local-password refused |
| Smoke test | §17 | Operations + Platform | Grant | §17 suite | Pass/fail | Dated log | Rollback deploy | Suite pass |
| Business acceptance | Smoke + data | Business Owner | Owner | Checklist §18 | Sign-off | Record | Stop go-live | Signed |
| Backup validation | H-160 direction | Database Owner | Grant | Backup job + **non-Production** restore drill if grant allows | Restore procedure H-182 | Restore evidence | N/A if restore is drill | Backup + restore evidence |
| DR configuration | H-182 impl package | Database + Platform + DR Coordinator | Grant + P11 accept | Replica `europe-west1`; Advanced DR; passive Cloud Run | Replica healthy | Designation evidence | Delete replica only per grant | Replica designated |
| DR validation | H-182 procedure | DR Coordinator | **P19** | Failover test | Measured RTO/RPO | Result table | Switchback | Pass ≤4h / ≤1h **or** fail recorded |
| Operational handover | §19 | All HUM-08 | After DR or with documented waiver | Handover pack | Role checklist | Pack | N/A | Pack accepted |
| Production acceptance | All above | Owner/POA | Explicit | Flip `productionReady` **only in a later increment** | Readiness table COMPLETE | Increment | Remain false | **NOT this file** |

---

## 5. Master prerequisite checklist

### Governance

- [ ] Production grant — **IMPLEMENTATION AUTHORIZATION PENDING**
- [ ] ADR-0006 / DP-0006 Production-ready rewrite — **EVIDENCE PENDING** (historical files unrewritten; direction H-158/H-169)
- [ ] Owner/POA decision record — **PREPARED** (H-154–H-183)
- [ ] Evidence acceptance — **EVIDENCE PENDING** (none received)
- [ ] Operational ownership — **PREPARED** roles; **OWNER DECISION PENDING** specialists
- [ ] Legal review — **EVIDENCE PENDING**; **NO LEGAL APPROVAL CLAIMED**
- [ ] Commercial approval — **EVIDENCE PENDING** (no prices)

### GCP

- [ ] Org/account/project/billing — **NOT STARTED** / **EVIDENCE PENDING**
- [ ] Region `africa-south1` — **DESIGN COMPLETE**; **NOT STARTED** live
- [ ] Cloud Run / Cloud SQL Plus / networking / logging / monitoring / alerting — **DESIGN COMPLETE**; repo has **no** Production IaC (only `infra/compose/dev.yaml`)

### Database

- [ ] PG version — **EVIDENCE PENDING** (Dev 16-class constraint H-183)
- [ ] Compatibility / extensions — **EVIDENCE PENDING**
- [ ] Sizing/storage — **PREPARED** framework; values **EVIDENCE PENDING**
- [ ] Connectivity PSA/PSC — **EVIDENCE PENDING**
- [ ] Backup/PITR/HA — **DESIGN COMPLETE** (H-160–H-163); **NOT STARTED** applied
- [ ] Encryption — **DESIGN COMPLETE** Google-managed default; **NOT STARTED**
- [ ] Maintenance/extensions/migrate — **PREPARED** procedure §8; **NOT STARTED**

### Application (repository)

- [ ] Build: `apps/api`, `apps/web` — **Dev/Test implementation** exists
- [ ] Env/secrets injection — fail-closed `validateDeploymentConfig` — **Dev/Test + contract**; Production store **EVIDENCE PENDING**
- [ ] DB connection / TLS require in production-like — **contract exists**; no Production URL
- [ ] Auth: local-password **forbidden** in production-like — **Dev/Test implementation**; IdP **EVIDENCE PENDING**
- [ ] CORS loopback Dev — **implemented**; Production origins **NOT STARTED**
- [ ] `/health` `/ready` — **implemented** (`apps/api/src/server.ts`)
- [ ] Logging — API request log exists; Production sinks **NOT STARTED**

### Security / network / DR / ops

- [ ] IdP/MFA/IAM — **PREPARED** model; **NOT STARTED** accounts
- [ ] Hostname/TLS/DNS — **HOSTNAME NOT YET SELECTED**
- [ ] DR — H-182 packages **PREPARED**; replica **NOT STARTED**; P19 **NOT STARTED**
- [ ] 24/7 coverage — **OWNER DECISION PENDING**; **no NOC claimed** (H-183)

---

## 6. Repository implementation reconciliation

Inspected (not modified): `apps/api`, `apps/web`, `packages/db`, `infra/compose/dev.yaml`, `apps/api/src/server.ts`, `deployment-config.ts`, `infrastructure-contract.ts`, `persistence/startup-migrations.ts`.

| Fact | Evidence |
| --- | --- |
| `productionReady` always `false` | `infrastructure-contract.ts`, `deployment-config.ts` |
| Production-like fail-closed | Token secret, IdP, infra target, `EOS_DATABASE_URL`, `EOS_DATABASE_TLS_MODE=require`, object store, no `EOS_SEED_DEMO` |
| Startup migrate refused when `EOS_ENV=production` | `shouldApplyStartupMigrations` tests |
| Health | `GET /health`; `GET /ready` (503 if DB not ok; memory mode ok in Dev) |
| Migrations | `001`–`125` under `packages/db/migrations/`; **126 absent** |
| Migrate CLI | `packages/db` `tsx src/migrate-cli.ts` via root `npm run migrate` |
| Dev infra | Compose Postgres only |
| Production IaC | **Absent** |
| Document store | `local-fs` Dev-only; Production object store **unselected / not implemented** |
| Identity | `local-password-dev` forbidden in production-like |
| Event transport default | `in-memory-dev`; Production transport **not selected** |
| Email adapter default | `dev-outbox` |
| Catalogs forbidden as Production | `eos`, `eos_h112_full`, `eos_h117_uat`, `eos_h149_uat`, `eos_h152_uat`, `eos_gateb` |

**Authorized Dev/Test gap (not implemented here):** no Production Cloud Run/SQL manifests — would be **implementation authorization**, not a silent Dev/Test fix.

---

## 7. Validation matrix

| Component | Design | Dev/Test implementation | Evidence | Production implementation | Runtime validation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Application | H-158 Cloud Run | Next.js + API in repo | UAT H-153 | **NONE** | **NONE** | PREPARED / IMPLEMENTATION AUTHORIZATION PENDING |
| Database | H-169 Plus | Compose PG 16-class | Lab/UAT catalogs | **NONE** | **NONE** | DESIGN COMPLETE; EVIDENCE PENDING version |
| Schema | ADR-0003 Dev | Migrations 001–125 | Files in git | **NONE** | **NONE** | Dev/Test COMPLETE; Production NOT STARTED |
| Migrations | Gate C blocked on host | CLI exists; startup refuse Production | Tests | **NONE** | **NONE** | PREPARED procedure |
| Secrets | H-183 classes | Dev placeholder refused in prod-like | Contract tests | **NONE** | **NONE** | PREPARED design |
| Identity | H-183 model | local-password Dev | Fail-closed tests | **NONE** | **NONE** | PREPARED model |
| Network/DNS/TLS | H-183 P10 | Loopback CORS | — | **NONE** | **NONE** | PREPARED framework |
| Backup/PITR/HA | H-160–H-163 | Lab dumps **not** Production | — | **NONE** | **NONE** | DESIGN COMPLETE |
| Logging/monitoring/alerting | H-161 direction | API logs | — | **NONE** | **NONE** | DESIGN COMPLETE |
| DR | H-169 + H-182 | **NONE** | Procedure blank | **NONE** | **NONE** | PREPARED |
| Rollback | §16 | Dev preview only | — | **NONE** | **NONE** | PREPARED |
| Operations | HUM-08 | — | H-125 PDM | **NONE** | **NONE** | PREPARED roles |

Do **not** treat a design document as implemented.

---

## 8. Database migration readiness

**Do not execute against Production. Do not create a Production database.**

### Before

- Compatibility: candidate PG version vs EOS 001–125 (EV-T01) — **EVIDENCE PENDING**
- Backup + PITR enabled on **that** instance (H-160/H-162) **before** migrate
- Record `schema_migrations` empty on new catalog
- Inventory: files `packages/db/migrations/001_*.sql` … `125_h135_phase1_personal_data_domain.sql`; **stop; do not apply a 126**
- Application: same revision as `PRODUCTION REVISION: TBD`
- Rollback decision: restore from pre-migrate backup; **do not** forward-fix with ad-hoc SQL

### Migration

- **Authorized command (after migrate grant):** `npm run migrate` (`@sedmc/db` `migrate-cli.ts`) with `DATABASE_URL` of the **new** Production catalog only
- **Forbidden:** startup auto-migrate when `EOS_ENV=production`; catalogs listed in §6; `eos_gateb`
- Ordering: numeric migration files as the CLI already applies
- Duration: **measure at execution**; not invented
- Checkpoints: after apply, query ledger max version = 125

### After

- Schema verification / ledger 125
- App `GET /ready` with TLS require
- §17 smoke
- Rollback: restore backup if ledger or smoke fails

**Claimed success: NONE.**

---

## 9. Application deployment readiness

`PRODUCTION REVISION: TBD AT IMPLEMENTATION AUTHORIZATION` — **no SHA invented.**

1. Identify granted git revision  
2. Build `apps/api` and `apps/web`  
3. Verify artefact hashes  
4. Env: `EOS_ENV=production`; `EOS_DATABASE_URL`; `EOS_DATABASE_TLS_MODE=require`; `EOS_TOKEN_SECRET` from store; **not** `EOS_SEED_DEMO`; **not** local-fs documents; **not** `local-devtest` infra target  
5. Secret **references** only (H-183 classes)  
6. DB connectivity  
7. `GET /health`  
8. `GET /ready` (must not be memory mode in Production)  
9. Authentication via IdP (not local-password)  
10. API smoke §17  
11. Commercial workflow smoke §17  
12. Logging to `africa-south1` sinks (H-161)  
13. Rollback: previous Cloud Run revision / stop traffic  

**Repo gap:** no Cloud Run service YAML/Terraform. Must be **created only after** implementation grant — not in this increment.

---

## 10. Secrets readiness

No values. No fake credentials.

| Secret/config class | Purpose | Storage mechanism | Owner role | Rotation | Evidence |
| --- | --- | --- | --- | --- | --- |
| S1 `EOS_TOKEN_SECRET` | Session/token signing | Named store after ADR-0012; never git | Security/Access Owner | On compromise + policy | Not in repo; prod-like refuses placeholder |
| S2 DB URL/password | Cloud SQL | Store + TLS require | Database Owner | On rotate/instance recreate | URL not in git |
| S3 SMTP/event-bus | Notifications/events | Store; Production adapters **unselected** | Platform Owner | Per product | Adapter names not Dev defaults |
| S4 IdP client secret | OIDC | Store after IdP exists | Security/Access Owner | IdP rotation | ADR-0013 |
| S5 CMEK | N/A under P06 default | — | — | Reopen P06 if required | H-183 |

---

## 11. Identity and access readiness

| Identity | ROLE DEFINED | PERSON APPOINTED | ACCOUNT PROVISIONED |
| --- | --- | --- | --- |
| Administrator | Yes | PDM as Owner (H-125); IdP group **OPEN** | **NO** |
| Developer | Yes | Engineering delegated (H-125) — no Production write standing | **NO** |
| Operations | Yes | PDM escalation; on-call specialist **OPEN** | **NO** |
| Database | Yes | **OPEN** | **NO** |
| Security | Yes | DPO ≠ GCP admin | **NO** |
| Break-glass | Yes (dual-control **roles**) | **OPEN** | **NO** |
| Service identity | Design: Cloud Run SA | N/A | **NO** |
| MFA | Required at IdP | IdP **OPEN** | **NO** |

---

## 12. DNS / TLS readiness

`HOSTNAME NOT YET SELECTED`

| Item | State |
| --- | --- |
| Hostname / DNS record / TLS cert | **NOT STARTED** |
| CORS origin | Production allow-list **after** hostname; Dev loopback stays |
| Ingress | Cloud Run URL then custom domain |
| Health/API | `https://{HOST}/health` `/ready` `/v1/...` |
| DR endpoint | Secondary Cloud Run; same path |
| Failover / rollback | H-183 P10 + H-182 package |

---

## 13. Backup / restore readiness

**Acceptance (when implemented):** backup enabled; retention **TBD from evidence**; region `africa-south1`; encryption Google-managed default; monitoring on job failure.

**Restore:** procedure + environment + schema + app + integrity + evidence + **measured duration** (blank until run). **No Production restore performed. No restore evidence claimed.** Lab dumps excluded (H-154).

---

## 14. DR implementation readiness

Authoritative: `docs/governance/h-182-production-dr-implementation-package.md` and `h-182-production-dr-validation-procedure.md`.

Verified present: Plus; `africa-south1` / `europe-west1`; Advanced DR; designated replica; active-passive app; failover; switchback; RTO ≤4h / RPO ≤1h as **requirements**; prerequisites including P01/P11/P12/P19.

**Not implemented.** Replica **NOT CREATED**. H-182 files **not rewritten** (content sufficient).

---

## 15. RTO / RPO measurement readiness

H-182 validation procedure specifies `T0`/`T1`/`T_COMMIT`, `TX_LAST`, evidence sources, DB/app/business checks, failover/switchback, blank result table. **Result fields remain blank.** Procedure is **PREPARED**; test **RUNTIME VALIDATION PENDING**.

---

## 16. Rollback readiness

| Failure point | Detection | Rollback action | Authority | Validation |
| --- | --- | --- | --- | --- |
| Infra provisioning | API error / mis-region | Stop; do not create replica; Owner decision if project already created (**may be irreversible spend**) | Platform Owner + Owner | No Production traffic |
| Database migrate | Ledger ≠ 125 or smoke fail | **Restore pre-migrate backup** (not reverse migrations) | Database Owner | Ledger/app |
| App deploy | `/ready` 503 or smoke fail | Previous Cloud Run revision | Platform Owner | `/ready` 200 |
| Configuration | Fail-closed fatal on boot | Revert env; do not weaken TLS | Platform Owner | Config validate |
| DNS | Bad TTL/cutover | Revert records; **propagation delay — not instant** | DNS role (unappointed) | Resolve + TLS |
| Security/access | Lockout | Break-glass **roles** only; **stop gate** if dual-control missing | Security Owner + Owner | Login test |
| DR configuration | Replica unhealthy | Do not failover; delete/recreate per grant; **stop** if primary at risk | DR Coordinator + Owner | Primary remains writer |

Irreversible/spend/data: **explicit stop/decision gate** — do not assume automatic rollback.

---

## 17. Smoke-test suite

`READY FOR FUTURE PRODUCTION EXECUTION` (no Production host). Routes **exist in repo** (do not invent):

| Step | Method / path |
| --- | --- |
| Availability | `GET /health` |
| Readiness | `GET /ready` (DB not `mode: memory`) |
| Module health | `GET /v1/crm/health`, `/v1/pipeline/health`, `/v1/proposals/health`, `/v1/costing/health`, `/v1/suppliers/health` |
| Auth | Unauthenticated health as designed; authenticated org/opportunity list **401/403** without token |
| Account | `GET/POST /v1/crm/organizations` (authorized) |
| Opportunity/RFP | `/v1/pipeline/opportunities`, `/v1/rfps` |
| Programme | commercial programme API as registered |
| Rate / commercial facts | supplier/rate and commercial-facts paths used in existing tests |
| Persistence | create + GET by id |
| Update / lifecycle | PATCH/state transitions already in CRM/pipeline tests |
| Boundaries | 403 on unauthorized; production-like refuses local-password |
| Errors | 4xx/5xx shape without leaking secrets |

UAT H-153 limitations remain; this suite does **not** claim defect-free Production.

---

## 18. Business acceptance

**Not claimed now.**

| Layer | Meaning |
| --- | --- |
| Technical | `/ready` + smoke pass |
| Data | Persist/retrieve expected commercial records |
| Security | IdP+MFA; least privilege; no Dev secrets |
| Operational | Monitoring, backup, alerting, HUM-08 specialists appointed |
| Business | Owner accepts commercial workflow for **intended** EOS ops — **not** H-81 SoR cutover |

---

## 19. Production handover package (structure)

Populate **roles**, not invented contacts:

System overview; H-169 architecture; environment TBD; HUM-08 ownership; access model; secret **classes**; backup/restore/DR (H-182); monitoring/alerting; incident + PDM escalation; vendor = official GCP channel (H-181); legal/commercial references H-168/H-169/D12/D13; change management + migrate grant; rollback §16; known limitations (UAT, `productionReady=false` until later increment).

---

## 20. Production readiness gate

| Gate | Requirement | Current status | Evidence | Remaining action |
| --- | --- | --- | --- | --- |
| Design | H-169 + H-183 | **COMPLETE** (design) | H-series | Do not reopen without increment |
| Preflight package | This file + H-182 | **PREPARED** | This path | Execute only after grant |
| External evidence | H-181 | **EVIDENCE PENDING** | Sent NONE | Human send/queue |
| Ownership | HUM-08 specialists | **OWNER DECISION PENDING** | H-125 partial | Appoint DBA/security/DR |
| Legal | P11 | **EVIDENCE PENDING** | No approval claimed | Review then accept/refuse |
| Commercial | P12 | **EVIDENCE PENDING** | No prices | Quotes then approve |
| Implementation grant | P01 | **IMPLEMENTATION AUTHORIZATION PENDING** | H-174 D01 | Written grant |
| Provision/migrate/deploy | Chain §4 | **NOT STARTED** | — | After grant |
| DR test / RTO/RPO | P19/P20 | **RUNTIME VALIDATION PENDING** | Blank procedure | P19 then measure |
| SoR/H-81 | Operational adoption | **OUT OF SCOPE** | H-81 NOT STARTED | Separate grant |
| Production ready | `productionReady=true` | **NOT STARTED** | Hard-coded false | Later increment only |

---

## 21. Remaining blockers (28 rows — not cosmetically closed)

H-183 §19 still applies. H-184 **PREPARES** preflight; does **not** close: grant; provider evidence; legal; pricing; GCP ownership; IdP; credentials; DNS; Production DB; replica; DR test; measured RTO/RPO; unappointed specialists.

**Narrowing only:** implementation **sequence** is now **PREPARED** (this file). Row count remains **28**.

---

## 22. Evidence dependencies

H-181 mailbox/destination; GCP class-2 confirmation; PG compatibility; sizing inputs; PSA/PSC; directory/IdP; DPA/terms; quotes; instance evidence after create.

---

## 23. Production authorization dependency

**H-184 does not grant implementation.** H-171 §5 remains unsatisfied.

---

## 24. Final governance determination

The EOS Production implementation sequence is **fully specified, preflighted, testable in future Production, reversible where §16 allows, and waiting only on explicitly identified evidence, organizational appointments, approvals, implementation authorization, and real-world execution.**

```text
Production NOT READY
Production implementation NOT AUTHORIZED
```

---

## 25. Audit trail

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 680 → 681 |
| Files | this file only |
| H-181–H-183 | not rewritten |
| SHA invented | **NO** |
| Hostname invented | **NO** |
| Commit / push | **NONE** |

Optional Dev/Test live migrate/build was **not** executed (would not constitute Production evidence; avoid extra environment mutation).

```text
PROCESS STOPPED AFTER H-184
H-185 NOT CREATED FOR NUMBERING
NEXT: Human H-181 send/queue (mailbox + official GCP destination),
  in parallel Owner Session specialist appointments.
  Repository preflight is PREPARED; do not provision GCP.
```
