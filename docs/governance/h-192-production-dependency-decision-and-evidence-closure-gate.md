# H-192 — Production Dependency Decision and Evidence Closure Gate

> **GOVERNANCE-ONLY CLOSURE REGISTER.**  
> Converts remaining Production blockers after H-191 into one authoritative decision/evidence register.  
> **NOT** Production implementation. **NOT** provider/product selection. **NOT** evidence collection. **NOT** H-171 authorization.  
> H-154 through H-191 were **inspected and not rewritten**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 703 (H-191 start was 700; H-191 added three files)  
**Application / schema / migration / infrastructure changes:** **NONE** (this file + focused tests only)  
**GCP / Cloud Run / Cloud SQL / DNS / TLS / IAM / secrets created:** **NONE**  
**H-181 requests sent:** **NONE**  
**Evidence received / accepted:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-192 STATUS = COMPLETE
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
```

---

## 1. Repository baseline

Observed (not assumed):

| Item | Evidence |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | **703** |
| Dirty worktree | **preserved** |
| H-191 start porcelain | 700 |

No prior dirty work discarded.

---

## 2. Governing-chain reconciliation (not rewritten)

| Record | Carried state |
| --- | --- |
| H-154 | Closure plan; 28-row inventory; Production NOT READY; H-81 NOT STARTED |
| H-158 | Hosting **direction** GCP; primary `africa-south1`; Cloud Run + Cloud SQL PostgreSQL — **not implemented** |
| H-160 | Backup location **direction** `africa-south1` — **not implemented** |
| H-161 | Cloud Logging storage **direction** `africa-south1` — **not implemented** |
| H-162 | PITR **intent** `africa-south1` — **not implemented**; WAL geography still needs provider evidence |
| H-163 | Regional HA **direction** `africa-south1` — **not implemented** |
| H-164 | Regional-outage DR **requirement** |
| H-165 / H-166 | RTO ≤4h / RPO ≤1h **accepted as requirements** — **not measured** |
| H-167 | Assessment only; DB DR ≠ EOS DR |
| H-168 | Cross-region residency exception **in principle** — not legal acceptance of Belgium |
| H-169 | DR architecture **SELECTED** (below) — **not implemented / not authorized** |
| H-170 | Implementation-readiness gates B–I **OPEN** |
| H-171 | Implementation authorization **NOT GRANTED**; §5 conditions unsatisfied |
| H-172 / H-173 | Prerequisite plan; Owner session **PREPARED / NOT YET HELD** |
| H-174 | Limited POA directions; D01 deferral; D02 preserve architecture; D03 evidence-package **preparation** |
| H-175 | Evidence requirements **PREPARED**; collection **NOT EXECUTED** |
| H-176–H-180 | Drafts / approval / identity gates; send was not executed |
| H-181 | Outbound collection **AUTHORIZED**; sent **NONE** |
| H-182 | Completion control + DR packages **PREPARED**; replica **NOT CREATED**; P19 **NOT PERFORMED** |
| H-183 | Internal designs narrowed; Google-managed encryption **direction**; HUM-08 **roles** defined; specialists **unappointed** |
| H-184 | Preflight **PREPARED**; no Production IaC |
| H-185 | Disposable rehearsal; Cloud Run rehearsal **NOT EXECUTED** |
| H-186 | Compiled `node dist/main.js` |
| H-187 | Startup migrate/seed/sync **refused** Production-like |
| H-188 | Outbox drain only on healthy live NATS |
| H-189 | Silent Dev/Test substitutions refused |
| H-190 | Provider-neutral **capability** contract `CLOSED WITH LIMITATIONS` |
| H-191 | Deployment **package** contract `CLOSED WITH LIMITATIONS`; no Dockerfile |

Historical ADR-0006 / DP-0006 remain unrewritten. ADR-0012 = `proposed — blocked for UAT and Production`. ADR-0013 = `proposed — blocked for Production`.

---

## 3. Selected architecture vs implementation vs validation

H-169 remains the selected **FUTURE Production direction**. Quoted exactly as governed:

```text
Primary:     africa-south1 Johannesburg
Secondary:   europe-west1 Belgium
Database:    Cloud SQL Enterprise Plus
DR:          Cloud SQL Advanced DR with designated DR replica
Acceptance:  RTO ≤ 4 hours
             RPO ≤ 1 hour
```

Also carried: N2 machine-series **pairing** (not a vCPU/RAM size); active-passive application DR; Cloud SQL failover **is not** complete EOS failover (H-167/H-169).

| Layer | State |
| --- | --- |
| Selected architecture | **YES** (H-169) |
| Implementation authorization | **NO** (H-171; H-174 D01) |
| Implementation | **NONE** (no GCP resources) |
| Measured validation | **NONE** (no P19; no measured RTO/RPO) |

The selected architecture is **not** evidence that infrastructure exists or that RTO/RPO has been demonstrated.

**Not a contradiction:** H-191 records the orchestrator as **not configured in the repository**. That is the **implementation/package** fact. H-158/H-169 remain the **architecture direction**. Application code does not hard-code a Cloud Run service.

---

## 4. H-181 outbound evidence status

```text
H-181 outbound authorization: EXISTS
Requests sent:                NONE
Evidence received:            NONE
Evidence accepted:            NONE
H-192 contact authorization:  NONE
```

Unsent drafts remain in `docs/governance/h-177-controlled-unsent-evidence-request-draft-package.md` (H177-D01–D15). H-181 authorized **controlled outbound execution** of a subset of those drafts (role-based recipients). Authorization **≠** sending. No sender mailbox, recipient personal email, provider account ID, or response body is manufactured here.

---

## 5. Classification vocabulary

| Class | Meaning |
| --- | --- |
| `OWNER_POA_DECISION` | Owner/POA must record a direction or grant |
| `PROVIDER_EVIDENCE` | Dated provider/capability confirmation |
| `TECHNICAL_EVIDENCE` | EOS-specific technical fact (version matrix, connectivity, restore drill) |
| `LEGAL_REVIEW` | Legal/privacy review; **review ≠ accept** |
| `COMMERCIAL_PROCUREMENT` | Quote, price, purchase, support arrangement |
| `IMPLEMENTATION` | Create/configure Production resources after grant |
| `RUNTIME_VALIDATION` | Smoke, DR test, measured RTO/RPO |
| `OPERATIONAL_APPOINTMENT` | Named individual for a HUM-08 specialist role |
| `PREPARATION_ONLY` | Internal checklist/template; does not select a product |

These classes are **not collapsed**.

Named individuals **already evidenced** (not invented): **PDM** (H-125 OA-01/OA-02); **Wensley Shirima** (DPO designation; appointment evidence still required; not GCP admin); **Thomas Nguluma** (E1-C01 counsel; not auto H-181 D12 recipient). Database Owner, Security/Access Owner, DR Coordinator, deputies: **unappointed**.

---

## 6. Authoritative unresolved-dependency register

`DECIDED (direction)` means a governance direction exists. It is **not** implemented unless the Implementation prerequisite column says otherwise.

| ID | Dependency | Current status | Required decision/evidence | Decision class | Current authority state | Implementation prerequisite | Validation prerequisite |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Production implementation grant | OPEN | Written Owner/POA grant (H-171 §5) | OWNER_POA_DECISION | PDM/Owner; grant **NOT GRANTED** (H-174 D01) | Blocks **all** Production acts | N/A until grant |
| A1 | Container base image | OPEN | Image family/version after Node ≥20 contract | OWNER_POA_DECISION + PROVIDER_EVIDENCE | Unselected | P01 + platform | Image scan / runtime |
| A2 | Container registry | OPEN | Registry product/account | OWNER_POA_DECISION + COMMERCIAL_PROCUREMENT | Unselected | P01 + A1 | Push/pull proof |
| A3 | Orchestrator / Cloud Run service | Architecture DECIDED (H-158); service **NONE** | Project, service name, region deploy | IMPLEMENTATION | Direction: Cloud Run `africa-south1`; **no YAML/service** | P01, A1–A2, secrets, identity, network | `/health` `/ready` |
| A4 | Process supervision | App contract CLOSED (H-191 SIGTERM) | Supervisor product/config | IMPLEMENTATION | App handles SIGINT/SIGTERM; platform UNSELECTED | P01 + A3 | Graceful shutdown drill |
| A5 | `PORT` → `EOS_PORT` mapping | Contract CLOSED | Inject `EOS_PORT` (API does **not** read `PORT`) | PREPARATION_ONLY then IMPLEMENTATION | Documented H-191 | A3 injection | Listen on intended port |
| B1 | Production IdP product | OPEN (ADR-0013) | OIDC product selection | OWNER_POA_DECISION | Unselected; `local-password-dev` refused | After HUM-05/directory facts | Federated login |
| B2 | Issuer / JWKS / audience | OPEN | Issuer URL, JWKS/discovery, audience — **not invented** | PROVIDER_EVIDENCE + IMPLEMENTATION | No env consumed (H-190) | B1 selected | Token verify |
| B3 | MFA product/capability | OPEN (GAP-IDN-02) | MFA at IdP for Human actors | OWNER_POA_DECISION + PROVIDER_EVIDENCE | `mfaEnabled: false` | B1 | MFA-enforced session |
| B4 | Production access model | Design PREPARED (H-183 P08) | Bind groups; break-glass; reviews | OPERATIONAL_APPOINTMENT + IMPLEMENTATION | Model decided; directory **not established** | B1–B3; Security/Access Owner | Access review |
| B5 | Administrative access ownership | OPEN | Named Security/Access Owner (GCP/IAM) | OPERATIONAL_APPOINTMENT | Role defined; **unappointed**; DPO ≠ GCP admin | Before Production IAM | Access audit |
| C1 | PostgreSQL product | Architecture DECIDED | Cloud SQL Enterprise Plus **instance** | IMPLEMENTATION | Direction H-169; **no instance** | P01, C2–C6, P06, secrets | Connectivity |
| C2 | Host / account / project | OPEN / NOT STARTED | GCP project, billing, instance name | OWNER_POA_DECISION + COMMERCIAL_PROCUREMENT + PROVIDER_EVIDENCE | No project exists (H-174 P02) | P01 | Console/API identity |
| C3 | PostgreSQL version | OPEN | Production major/minor compatible with EOS + Plus | OWNER_POA_DECISION + TECHNICAL_EVIDENCE | Dev ADR-0003 = PG **16**; lab 16.15 **not** Production lock | Before instance create | Migrate 001–125 on candidate |
| C4 | Sizing | OPEN | vCPU/RAM/disk/IOPS/connections — **not invented** | OWNER_POA_DECISION + TECHNICAL_EVIDENCE | N2 **series** only; values unknown (H-183 P04) | Workload evidence | Capacity vs RTO/RPO **not** proved by size |
| C5 | Connectivity (PSA vs PSC) | OPEN | Private path selection | OWNER_POA_DECISION + PROVIDER_EVIDENCE | **NOT SELECTED** (H-183 P05) | Before write endpoint | App→DB path including DR |
| C6 | TLS / CA | App contract CLOSED | Server CA / client certs as required by `rejectUnauthorized: true` | PROVIDER_EVIDENCE + IMPLEMENTATION | `EOS_DATABASE_TLS_MODE=require` | C1 | TLS handshake |
| C7 | Production catalog name | OPEN | Authorized empty catalog; not `eos` / `eos_gateb` / UAT names | OWNER_POA_DECISION | Forbidden Dev catalogs named in H-184 | Separate **migrate grant** | Ledger = 125 |
| C8 | Backup implementation | Direction DECIDED (H-160) | Applied custom `africa-south1` backups | IMPLEMENTATION + TECHNICAL_EVIDENCE | Location directed; **not applied** | C1 | Restore drill (non-Prod or granted) |
| C9 | PITR implementation | Intent DECIDED (H-162) | Applied PITR + WAL geography confirmation | PROVIDER_EVIDENCE + IMPLEMENTATION | Intent only; enhanced backups vs replica constraints remain | C1 + C8 | PITR restore evidence |
| C10 | Regional HA implementation | Direction DECIDED (H-163) | Applied HA in `africa-south1` | IMPLEMENTATION | Directed; **not applied** | C1 + C4 | HA failover evidence |
| D1 | Secrets platform | OPEN (ADR-0012) | Product after evaluation (Vault vs cloud SM **candidates**, not lock) | OWNER_POA_DECISION | `env-dev` only; H-183 design; Secret Manager candidate **not selected** | Before Production secrets | Rotation drill |
| D2 | Secret references | App: env **names** | Future URI scheme only after D1 | IMPLEMENTATION | Raw `process.env[reference]` | D1 | Injection without git |
| D3 | Secret ownership | Role DECIDED | Named Security/Access Owner + DB Owner for DB secrets | OPERATIONAL_APPOINTMENT | Roles defined; individuals OPEN | Before secret create | Access logs |
| D4 | KMS / CMEK vs Google-managed | Direction DECIDED (H-183 P06) | Google-managed **default**; reopen if legal/security **requires** CMEK | OWNER_POA_DECISION (reopen) + LEGAL_REVIEW | **No keys created** | If CMEK: key location `africa-south1` | Encryption evidence |
| D5 | Field-cache encryption | App: device-local | Whether Production later needs process KMS | OWNER_POA_DECISION | SHA-256/AES-GCM from `deviceId:principalId:salt`; not a process KMS | Optional after D4 | Client cache threat model |
| E1 | Object-storage product | OPEN | Product satisfying `DocumentStorage` | OWNER_POA_DECISION | Port exists; local-fs **fatal** Production-like | P01 | put/get/exists/stat/delete |
| E2 | Bucket / container | OPEN | Identifier — **not invented** | IMPLEMENTATION | None | E1 + residency | Object round-trip |
| E3 | Region / residency | OPEN | Must respect H-158 primary + H-168/H-169 DR exception | OWNER_POA_DECISION + LEGAL_REVIEW | No bucket | Before create | Residency evidence |
| E4 | Credentials / IAM | OPEN | Least-privilege identity | IMPLEMENTATION | None | D1 + B5 | Access denied/allow tests |
| E5 | DocumentStorage adapter | OPEN | Production adapter implementation | IMPLEMENTATION | Unimplemented `future-object-store` fatal | E1–E4 | Commercial document flow |
| E6 | Object backup/retention | OPEN | If documents are SoR bytes, backup policy | OWNER_POA_DECISION | Not defined | E1 | Restore of bytes |
| F1 | NATS hoster/product | OPEN | Product with TLS + auth | OWNER_POA_DECISION + COMMERCIAL_PROCUREMENT | Dev compose NATS is **not** Production | P01 | Connect health |
| F2 | NATS endpoint | OPEN | Non-loopback `tls://` or `nats+tls://` URL | PROVIDER_EVIDENCE | Contract CLOSED; value OPEN | F1 | `health().ok` |
| F3 | NATS TLS certificates | OPEN | Trust bundle | PROVIDER_EVIDENCE | Scheme required; certs unselected | F2 | TLS handshake |
| F4 | NATS credentials | OPEN | Userinfo / nkey / token product | OWNER_POA_DECISION + IMPLEMENTATION | Userinfo **required** in URL; product OPEN | D1 | Auth success; **redact logs** (H-190) |
| F5 | JetStream configuration | Partial Dev defaults | Production stream/consumer names | OWNER_POA_DECISION | `EOS_NATS_STREAM` etc. optional knobs | F1 | Publish/consume |
| F6 | Event operational ownership | OPEN | Platform + on-call | OPERATIONAL_APPOINTMENT | Unappointed specialists | HUM-08 | Consumer restart |
| F7 | Event monitoring | OPEN | Lag/health alerts | IMPLEMENTATION | App emits structured logs only | I1–I2 | Alert receipt |
| G1 | Email adapter selection | OPEN | Choose `ses` **or** `smtp` (supported; **not** selected) | OWNER_POA_DECISION | H-189/H-190 contract | P01 | Send test to allowlisted address |
| G2 | Email provider/product | OPEN | Vendor after G1 | COMMERCIAL_PROCUREMENT | Unselected | G1 | DPA if processing personal data |
| G3 | Email region | OPEN if SES | Region **not** placeholder | PROVIDER_EVIDENCE | `EOS_SES_REGION` refused if placeholder | G1=ses | Regional residency review |
| G4 | Email TLS | Contract CLOSED | SMTP TLS or SES HTTPS | TECHNICAL_EVIDENCE | H-190 SMTP 465/`SECURE=true` | G1 | TLS on wire |
| G5 | Sender identity | OPEN | Production From (not `.local`) | OWNER_POA_DECISION | Unselected | G2 | SPF/DKIM as later ops |
| G6 | Email credentials | OPEN | SMTP user/pass or IAM | IMPLEMENTATION | Optional at send time | D1 | Authenticated send |
| G7 | Email DPA/terms | OPEN | If processor | LEGAL_REVIEW | None received | G2 | Legal acceptance |
| H1 | Production hostname | OPEN | Owner-selected FQDN — **not invented** | OWNER_POA_DECISION | `[PRODUCTION DNS NAME TO BE DETERMINED]` | After grant | HTTPS origin |
| H2 | DNS owner | Role DECIDED | Named DNS operator | OPERATIONAL_APPOINTMENT | HUM-08; unappointed | H1 | Record change control |
| H3 | TLS certificate mechanism | OPEN | Public cert issuance | OWNER_POA_DECISION + IMPLEMENTATION | App does not terminate TLS | H1 + ingress | Valid cert |
| H4 | CORS origin | Contract CLOSED | Value = `EOS_PUBLIC_ORIGIN` | IMPLEMENTATION | https, no localhost, no `*` | H1 | Browser CORS |
| H5 | Ingress / networking | OPEN | HTTPS ingress to `EOS_LISTEN_HOST`/`EOS_PORT` | IMPLEMENTATION | Default loopback **refused** Production-like | A3 + C5 | External reachability |
| H6 | Hostname evidence | OPEN | Ownership/control proof | TECHNICAL_EVIDENCE | None | H1 | Whois/DNS control |
| I1 | Log sink | Direction DECIDED (H-161) | Applied Logging bucket `africa-south1` | IMPLEMENTATION | App stdout JSON; sink UNSELECTED | P01 | Retention location |
| I2 | Monitoring / alerting | OPEN | Product + policies | OWNER_POA_DECISION + IMPLEMENTATION | **Not required to start** (H-190) | HUM-08 destinations | Alert fire |
| I3 | APM | OPEN / optional | Vendor if operations require | OWNER_POA_DECISION | No SDK | Optional | Trace sample |
| I4 | Log retention | OPEN | Days/policy | OWNER_POA_DECISION + LEGAL_REVIEW | None | I1 | Policy evidence |
| I5 | Alert destination | OPEN | Named channels | OPERATIONAL_APPOINTMENT | No NOC claimed | I2 | On-call receipt |
| I6 | Startup vs operational telemetry | DISTINGUISHED | Startup: logs + `/health` `/ready`. Operational sink/APM: **not** a start blocker | PREPARATION_ONLY | Documented H-190/H-191 | — | — |
| J1 | Database Owner | OPEN | Named individual + deputy | OPERATIONAL_APPOINTMENT | Role defined; **unappointed** | Before C8–C10 / migrate | Restore/DR DB acts |
| J2 | Security/Access Owner | OPEN | Named individual + deputy | OPERATIONAL_APPOINTMENT | **Unappointed** (≠ DPO) | Before IAM/IdP/secrets | Access reviews |
| J3 | DR Coordinator | OPEN | Named individual + deputy | OPERATIONAL_APPOINTMENT | **Unappointed** | Before P19 | DR test command |
| J4 | Deputies | OPEN | Named deputies | OPERATIONAL_APPOINTMENT | Required before go-live (H-183) | J1–J3 | Coverage |
| J5 | On-call coverage | OPEN | Escalation path; **not** a staffed NOC | OWNER_POA_DECISION + OPERATIONAL_APPOINTMENT | Escalate to **PDM** until delegated | Before go-live | Incident response |
| J6 | NOC / 24×7 supervision | OPEN / not claimed | Owner decision whether to staff | OWNER_POA_DECISION | **No NOC claimed** (H-183) | Optional | — |
| J7 | Escalation paths | PREPARED | Keep OA-02 until deputies named | PREPARATION_ONLY | PDM escalation recorded | J4–J5 | Incident logs |
| K1 | DPA / provider terms | OPEN | Received + reviewed terms | LEGAL_REVIEW + PROVIDER_EVIDENCE | **NONE received** | Before data in provider | Legal **acceptance** separate |
| K2 | Belgium DR residency legal | OPEN | Legal treatment of H-168/H-169 exception | LEGAL_REVIEW | In-principle exception **≠** approval | Before replica with Production data | Written legal position |
| K3 | Provider contractual terms | OPEN | Contract for GCP/Plus/DR/support | LEGAL_REVIEW + COMMERCIAL_PROCUREMENT | None | Before purchase | Executed contract |
| K4 | Quotations | OPEN | Dated quotes — **no prices invented** | COMMERCIAL_PROCUREMENT | H-181 D13 informational only; sent **NONE** | After scope freeze | Quote vs model |
| K5 | Procurement approval | OPEN | Commercial approval to purchase | OWNER_POA_DECISION + COMMERCIAL_PROCUREMENT | Cost **structure** prepared (H-183 P12); amounts OPEN | K4 | PO/approval record |
| K6 | Cost model inputs | OPEN | Calculator inputs; no totals here | COMMERCIAL_PROCUREMENT | Categories listed; **no amounts** | C4 + A3 + replica | Budget control |

---

## 7. Dependency graph (do not skip)

```text
P01 grant
  └── K5 procurement (needs K4 quotes, C4 sizing, A3/C1 scope)
        └── C2 project/billing
              └── C1 Cloud SQL Plus instance
                    ├── C3 version ── migrate grant ── C7 catalog ── Gate E migrate
                    ├── C5 PSA/PSC ── write endpoint
                    ├── C6 TLS/CA
                    ├── D4 Google-managed (or reopened CMEK)
                    ├── C8 backup ── C9 PITR ── C10 HA
                    └── J1 Database Owner
              └── A3 Cloud Run (needs A1/A2, D1 secrets, B1 IdP, H1 hostname, H5 ingress)
                    └── F1 NATS + E1 object store + G1 email (adapters after products)
                          └── H-188 drain only if NATS healthy
              └── DR replica europe-west1
                    ├── K2 Belgium legal acceptance
                    ├── C5 DR network path
                    ├── J3 DR Coordinator
                    ├── H-182 runbook approved
                    └── P19 test authorization
                          └── measured RTO/RPO (Gate G)
                                └── Gate H Production readiness
```

**Cloud SQL implementation cannot precede:** P01, C2 product/project, C3 version, C5 connectivity, D1/D4 secrets/encryption, C8–C10 backup/PITR/HA **directions applied**, J1 ownership, applicable K1–K3.

**DR testing cannot precede:** Production primary exists; designated replica exists; credentials/secrets exist; DR runbook approved; P19 authorization; J3 + participants appointed.

**H-171 may be revisited only after:** Gate A evidence actually obtained/recorded **and** Gate B Owner/POA decisions close the OPEN product/provider items required by H-171 §5. H-192 does **not** satisfy those conditions.

---

## 8. Internally executable without provider selection

These require **no** new product/hostname/price/account:

* Maintain this register and H-171 §5 checklist
* Evidence **acceptance criteria** (H-175) without sending
* H-177 draft **internal review** (not send)
* Deployment runbook **skeleton** (build → inject → `node dist/main.js` → `/ready` → SIGTERM)
* Migration execution checklist (`npm run migrate -w @sedmc/db`; refuse `eos`/`eos_gateb`; ledger 125; unused numbers 112–116)
* Rollback checklist (previous revision / stop traffic — **no Cloud Run revision IDs invented**)
* H-182 DR validation **procedure** (not execute P19)
* RTO/RPO **measurement procedure** (H-165/H-166 definitions)
* Security/access **checklist** from H-183 P08 model
* HUM-08 RACI **template** (roles only)
* Production smoke-test **checklist** (H-184 §17) against disposable Dev/Test only
* Continue Dev/Test fail-closed tests (H-187–H-191)

---

## 9. Explicitly blocked pending external/Owner/POA closure

* Production infrastructure provisioning (GCP project, VPC, Cloud Run, Cloud SQL)
* Container/platform implementation (Dockerfile/image/registry as Production)
* Production database creation
* Production migration
* Production secrets / KMS key creation
* IdP/MFA configuration
* Object-storage provisioning
* NATS Production provisioning
* Production email configuration / sending
* DNS / TLS certificates
* Production deployment
* DR replica creation
* DR testing (P19)
* Measured RTO/RPO
* Commercial procurement / purchase
* Legal acceptance of DPA/Belgium replica
* Sending H-181 requests is **authorized by H-181** but **not executed** and **not re-authorized or executed by H-192**
* H-81 / mailbox/Excel/WhatsApp ingestion / historical KPI reconstruction

---

## 10. Future governance gates (NOT authorized; NOT completed)

| Gate | Purpose | Status |
| --- | --- | --- |
| **A** External evidence collection | Obtain and record provider/legal/commercial evidence | **NOT STARTED** (authorized to send by H-181; sent NONE) |
| **B** Owner/POA decision closure | Resolve remaining product/provider/appointment decisions | **NOT CLOSED** (session H-173 not held) |
| **C** Production implementation authorization | Revisit **H-171** only after A+B satisfy §5 | **NOT GRANTED** |
| **D** Production implementation | Provision after C | **BLOCKED** |
| **E** Production migration | Separate migrate grant + new catalog | **BLOCKED** |
| **F** Runtime validation | Smoke / security / ops | **BLOCKED** |
| **G** DR implementation and validation | Replica + P19 + measured RTO/RPO | **BLOCKED** |
| **H** Production readiness acceptance | Flip `productionReady` only in a later increment | **BLOCKED**; `productionReady = false` |

---

## 11. Accidental provider-selection audit

Inspected `apps/`, `packages/`, `.env.example` (not governance prose).

| Finding | Classification |
| --- | --- |
| No hard-coded GCP project IDs, Cloud SQL instance names, Cloud Run service names, Production hostnames, buckets, IdP issuers, or JWKS URLs in application runtime | **None found** |
| `.env.example` uses `.invalid` / UNSELECTED comments; no Production secrets | **Legitimate** |
| `ses` / `smtp` / `nats-jetstream` are **supported adapters**, not selected Production products | **Legitimate** (H-189/H-190) |
| `infra/compose/dev.yaml` Postgres/NATS/Redis | **Dev/Test only** |
| SNS `amazonaws.com` host checks | Optional notification signature **capability**, not Production email/IdP selection |
| H-158/H-169 Cloud Run+SQL **architecture** vs H-191 “Cloud Run not configured” | **Controlled distinction**, not a silent selection |

No governance-safe code correction required. No new provider introduced.

---

## 12. H-191 boundary confirmation

Reconfirmed in code/tests this increment:

| Invariant | Status |
| --- | --- |
| Production/UAT loopback DB/NATS/SMTP/origin/listen refused | **INTACT** |
| `EOS_LISTEN_HOST` explicit non-loopback Production-like | **INTACT** |
| Startup migrate/seed/sync skipped Production-like | **INTACT** (H-187) |
| Outbox drain gated (H-188) | **INTACT** |
| local-fs DocumentStorage refused Production-like | **INTACT** |
| in-memory event transport refused Production-like | **INTACT** |
| stub email refused | **INTACT** |
| local-password IdP refused | **INTACT** |
| plaintext NATS / SMTP TLS refused | **INTACT** |
| non-HTTPS origin / wildcard CORS refused | **INTACT** |
| NATS userinfo redacted in logs/health | **INTACT** |
| Compiled entrypoint `node dist/main.js` | **INTACT** |

---

## 13. Tests / compile (this increment)

See execution report. No Production database. No external requests.

---

## 14. Final status

```text
H-192 STATUS = COMPLETE
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
External evidence collected = NONE
EOS fully complete = NO
```

H-192 closes **ambiguity about what remains**. It does **not** close the remaining decisions or evidence.
