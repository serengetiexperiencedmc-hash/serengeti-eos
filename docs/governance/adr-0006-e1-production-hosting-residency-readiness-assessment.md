# ADR-0006 Gate E1 — Production hosting, data residency & environment architecture readiness assessment

> **`E1 READ-ONLY GOVERNANCE ASSESSMENT`**  
> **`BLOCKED BY MISSING EVIDENCE`**  
> **`E1 OWNER DECISION NOT YET RECORDED`**  
> **`NOT HOSTING SELECTION`** · **`NOT PROVIDER SELECTION`** · **`NOT REGION SELECTION`**  
> **`NOT UAT`** · **`NOT PRODUCTION`** · **`NOT DEPLOYMENT`** · **`NOT MIGRATION`**  
> Named personal signature, Legal/DPO attestation, provider quotes, and Production compliance claims are **not** invented.

This file is a repository/document assessment of whether evidence is sufficient for a defensible **E1 Production Hosting & Data-Residency** owner decision. It does **not** approve ADR-0006 or DP-0006. It does **not** select a provider or region. It does **not** authorize infrastructure, databases, migrations, UAT, or deployment.

**Starting worktree (git, this assessment):** branch `master`. Pre-existing uncommitted Gate B/C application and governance files were present and were **not** modified by this task. This assessment adds **only** this file.

---

## 1. STATUS

**E1 — ASSESSED / BLOCKED BY MISSING EVIDENCE**

| Item | Record |
| --- | --- |
| Assessment type | Static repository + governance inspection |
| PostgreSQL / cloud / Production contacted | **NO** |
| Provider selected | **NO** |
| Region selected | **NO** |
| Jurisdiction approved for Production / backup / DR | **NO** |
| ADR-0006 | **proposed — blocked for Production** / register: **OPEN — blocked for Prod** |
| DP-0006 | **OPEN — for formal human approval before UAT/Production infrastructure** |
| Stage 5 formal decision package | **DEFER / NOT READY** · architecture decision **NOT YET APPROVED** |
| Gate E1 (workplan) | **OPEN — REQUIRES LEGAL/DPO VALIDATION** |
| Owner E1 decision | **NOT YET RECORDED** |
| Company business position (LA-01–LA-17) | **PREPARED** — [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md); **not** Legal/DPO attestation |
| E1-C01 Legal/DPO attestation | **STILL REQUIRED** |
| This file authorizes provisioning / migrate / deploy | **NO** |

---

## 2. ASSESSMENT SCOPE

In scope: documented hosting option **classes**; residency/legal drafts; topology requirements; environment-separation policy; persistence compatibility; backup/DR evidence classes; secrets/identity gates; missing E1 inputs.

Out of scope: contacting any database or cloud account; choosing a provider; writing Terraform/K8s; executing migrations; modifying application/infrastructure; recording owner approval.

Sources inspected (contents, not filenames alone): `docs/adr/ADR-0006-hosting-and-residency.md`; `docs/decisions/DP-0006-hosting-data-residency.md`; `docs/adr/README.md`; ADR-0003, 0004, 0005, 0011, 0012, 0013, 0015; `docs/governance/adr-0006-stakeholder-fact-pack.md`; `adr-0006-architecture-decision-package.md`; `adr-0006-architecture-evidence-workplan.md`; `adr-0006-legal-data-placement-evidence.md`; `adr-0006-hosting-capability-evidence.md`; `adr-0006-formal-decision-package.md`; `adr-0006-tco-evidence.md`; `adr-0006-owner-business-bcm-decision-pack.md`; `adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md`; `adr-0006-gate-c-migration-backlog.md`; `docs/architecture/19-technology-stack.md`; `infra/compose/dev.yaml`; `.github/workflows/ci.yml`; `.env.example`; `apps/api/src/main.ts` / `server.ts` (`productionReady: false`).

No Terraform, Kubernetes, or Production compose files were found. Infra present: **Dev Compose only**.

---

## 3. GOVERNANCE CONSTRAINTS

Carried forward; not re-decided here.

| Constraint | Documented position | Class |
| --- | --- | --- |
| Tanzania PDPA 2022 | Primary **design-basis** privacy framework (fact pack L2 **draft**) | Documented company/Legal **draft** — **not** attested Legal determination |
| Kenya DPA / GDPR / other | May apply depending on data subjects/processing (L3/L4) | Legal applicability **question** |
| Production jurisdiction | **UNKNOWN**; no pre-approved geography | Unknown |
| Cross-border processing | Controlled legal requirement; **no** transfer mechanism approved (L9–L10) | Architecture proposal + Legal unknown |
| Restricted+ failover | Must not fail over to an unapproved region; failover geography **NOT APPROVED** (L14) | Documented requirement; model **undefined** |
| PostgreSQL SoR | Intended durable OLTP SoR (ADR-0003 Development; Production class in architecture pack) | Architecture proposal for Production; Dev accepted |
| Redis / search | Projections, not SoR (ADR-0003) | Architecture proposal |
| NATS JetStream | Phase-1 event direction; Production pending ADR-0006 (ADR-0004) | Architecture proposal |
| Backup schedule | Encrypted daily **19:00 Africa/Nairobi (EAT)** + remote copy + restore proof (ADR-0011) | Proposed Production **requirement**; Dev/Test is evidence-register only |
| Default recovery posture | Restore-from-backup until warm-standby/HA decided (fact pack IT draft; Stage 1) | Architecture proposal; **not** implemented Production |
| Business RTO/RPO | MTD/critical RTO **<= 3h**; overall **<= 4h**; zero tolerated **business** data loss; technical RPO **not** proven | Business requirement — **not** technically proven |
| Provider/region | **Not formally selected** | Owner decision **absent** |
| Production deploy / infra / migration | **NOT AUTHORIZED** | Governance |
| Gate C item 5 | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** | Governance |

Do not convert proposed requirements into implemented facts.

---

## 4. CURRENT DOCUMENTED HOSTING OPTIONS

DP-0006 and the architecture decision package define **four option classes**. **No option is selected.** Hosting-capability evidence records **empty** candidate slots (`A-CAND-1` … `D-CAND-1`: `_none recorded_`).

DP-0006: **Recommended option: Not selected — awaiting business, legal, and IT input.**  
Architecture pack: **INSUFFICIENT EVIDENCE FOR FINAL RANKING.**  
This assessment: **NO OWNER-APPROVED RECOMMENDATION FOUND.**

A **lower-cost alternative** and a **higher-control alternative** are **required as packet structure** (DP-0006; Stage 1 cost packet A/B/C; architecture pack Finance item 4). They are **not populated** with named providers, regions, or quotes. TCO lines remain `UNKNOWN — QUOTE REQUIRED`.

### 4.1 Option A — African-region managed cloud

| Criterion | Evidence |
| --- | --- |
| Provider | **not documented** (class only; no vendor) |
| Region | **not documented** (Africa ≠ a country; no catalogue) |
| Tanzania residency | **unknown** (Africa ≠ Tanzania; foreign African region is still a transfer) |
| Cross-border transfer | **undefined** (requires Legal if outside Tanzania) |
| Kenya implications | **unknown** |
| GDPR implications | **unknown** (not automatic from African hosting) |
| Restricted+ failover | **undefined** |
| PostgreSQL placement | **undefined** (class: managed PG feasible in principle, unproven) |
| Backup placement | **undefined** |
| DR placement | **undefined** |
| Encryption/key model | **undefined** (KMS product not selected) |
| Network architecture | **undefined** |
| Identity/secrets | **undefined** (ADR-0012/0013 OPEN) |
| Portability | **defined as principle** (Postgres/containers); **not** evidenced for a vendor |
| Cost model | **undefined** (`UNKNOWN — QUOTE REQUIRED`) |
| Support/SLA | **undefined** |
| Exit strategy | **defined as dimension** (DP-0006); **not** evidenced |
| Evidence sufficient for owner decision | **no** |

### 4.2 Option B — EU/EEA managed cloud + transfer safeguards

| Criterion | Evidence |
| --- | --- |
| Provider | **not documented** |
| Region | **not documented** (`.env.example` comments `EOS_SES_REGION=eu-west-1` as **optional Dev SES**, not Production hosting) |
| Tanzania residency | **unknown** / likely a transfer until Legal attests |
| Cross-border transfer | **undefined** (Tanzania→EU **NOT APPROVED**; if GDPR applies, EU→non-EEA mechanism required; no SCCs cited) |
| Kenya implications | **unknown** |
| GDPR implications | **unknown** (potentially applicable, not automatic; EU hosting ≠ GDPR determination) |
| Restricted+ failover | **undefined** |
| PostgreSQL placement | **undefined** |
| Backup placement | **undefined** (second EU region would be a second transfer) |
| DR placement | **undefined** |
| Encryption/key model | **undefined** |
| Network architecture | **undefined** |
| Identity/secrets | **undefined** |
| Portability | **defined as principle** only |
| Cost model | **undefined** |
| Support/SLA | **undefined** (foreign support access still a transfer/access issue) |
| Exit strategy | **defined as dimension** only |
| Evidence sufficient for owner decision | **no** |

### 4.3 Option C — Tanzania colo / local cloud / hybrid-onshore (DP-0006 “D” sketch; architecture pack Option C)

DP-0006 table lists “Colocation Tanzania/Kenya” as option **D** in the paper’s own lettering; the architecture pack labels Tanzania-controlled hosting as Option **C**. Same **class**; letters differ. This assessment uses architecture-pack letters A–D and notes the DP-0006 lettering mismatch.

| Criterion | Evidence |
| --- | --- |
| Provider | **not documented** (no facility survey) |
| Region | **not documented** (Tanzania is **candidate for assessment**, not approval) |
| Tanzania residency | **unknown** until a facility is named and Legal attests |
| Cross-border transfer | **undefined** (onshore Production may still use foreign SaaS/support/logs) |
| Kenya implications | **unknown** (DP-0006 colo sketch also mentions Kenya; not selected) |
| GDPR implications | **unknown** |
| Restricted+ failover | **undefined**; Tanzania-only DR may lack geographic separation unless a second approved site exists |
| PostgreSQL placement | **undefined** |
| Backup placement | **undefined** |
| DR placement | **undefined** |
| Encryption/key model | **undefined** |
| Network architecture | **undefined** (last-mile/DDoS unsurveyed) |
| Identity/secrets | **undefined** |
| Portability | colo may reduce hyperscaler lock-in and increase **operational** lock-in (provisional) |
| Cost model | **undefined** |
| Support/SLA | **undefined** (24/7 **NOT PROVEN**) |
| Exit strategy | **defined as dimension** only |
| Evidence sufficient for owner decision | **no** |

### 4.4 Option D — Hybrid (app vs data / classification split)

| Criterion | Evidence |
| --- | --- |
| Provider | **not documented** |
| Region | **not documented** (split **unspecified**) |
| Tanzania residency | **unknown** until classification-to-geography exists |
| Cross-border transfer | **undefined** (each split is a path) |
| Kenya implications | **unknown** |
| GDPR implications | **unknown** |
| Restricted+ failover | **undefined**; Highly Restricted default = primary **approved** jurisdiction — **none approved** |
| PostgreSQL placement | **undefined** |
| Backup placement | **undefined** |
| DR placement | **undefined** |
| Encryption/key model | **undefined** |
| Network architecture | **undefined** |
| Identity/secrets | **undefined** |
| Portability | **undefined** (may reduce or dual lock-in) |
| Cost model | **undefined** (typically not lowest-cost; unquoted) |
| Support/SLA | **undefined** |
| Exit strategy | **undefined** |
| Evidence sufficient for owner decision | **no** |

Architecture pack: hybrid is **not** the default; neither “Legal requires split” nor “single-region cannot meet RTO/residency” is evidenced.

**This assessment does not rank options and does not select a provider.**

---

## 5. PROVIDER / REGION STATUS

| Question | Status |
| --- | --- |
| Named Production hosting provider | **NOT SELECTED** · candidate slots empty |
| Named cloud/colo region | **NOT SELECTED** |
| Named Production PostgreSQL product | **NOT SELECTED** |
| Named backup region | **NOT SELECTED** |
| Named DR / warm-standby region | **NOT SELECTED** |
| AWS / Azure / GCP as chosen Production host | **Not selected.** AWS appears only as **optional Dev SES/SNS** adapters and env names, not as ADR-0006 approval |
| Terraform / Kubernetes Production estate | **Absent** from repository |
| Compose | **Dev/Test only** (`infra/compose/dev.yaml`: `postgres:16-alpine`, `redis:7-alpine`, `nats:2.10-alpine`, **dev credentials**) |
| CI | GitHub Actions **test/typecheck** on `ubuntu-latest` — **not** a Production deploy pipeline |

Owner Decision 7: Tanzania is a **preferred candidate for assessment, not an automatic approval.** Kenya, EU/EEA and others **may be evaluated.** No jurisdiction is pre-approved.

---

## 6. DATA-RESIDENCY STATUS

A draft residency matrix exists (`adr-0006-legal-data-placement-evidence.md`; fact pack Section 8). **Every Production / backup / DR / warm-standby cell is NOT APPROVED / UNKNOWN.**

| Data class | Primary storage jurisdiction | Backup jurisdiction | DR jurisdiction | Transfer mechanism | Access location |
| --- | --- | --- | --- | --- | --- |
| Commercial / RFP / Programme | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **UNKNOWN** |
| CRM | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **UNKNOWN** |
| Supplier | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **UNKNOWN** |
| Documents (bytes + metadata) | **NOT APPROVED** (object storage may differ from DB) | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **UNKNOWN** |
| Audit | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **UNKNOWN** |
| Backups | N/A (copy of source) | **NOT APPROVED** (separate decision) | If used for DR, still a copy | **NOT APPROVED** | **UNKNOWN** |
| Logs / telemetry | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | **NOT APPROVED** | Destinations **UNKNOWN** |

Controller establishment: **UNKNOWN** (L1). Data-subject census: **UNKNOWN** (L8). Restricted / Highly Restricted geographic rules: **not inferred**; Highly Restricted default refers to a **primary formally approved** jurisdiction — **none exists**.

**E1.1–E1.13** (workplan) remain `UNKNOWN` / `REQUIRES LEGAL/DPO VALIDATION`. Gate E1 exit (Legal/DPO rule sufficient to allow or forbid option classes A–D for Production **and copies**) is **not met**.

---

## 7. PRODUCTION TOPOLOGY STATUS

Required **class** (architecture pack §2; stack doc §19) vs **defined Production instance**.

| Component | Required class documented | Production instance defined |
| --- | --- | --- |
| Web (Next.js) | Yes (modular monolith + local preview pattern) | **NO** |
| API (Fastify) | Yes | **NO** (`127.0.0.1:8080` Dev) |
| PostgreSQL 16-class SoR | Yes (ADR-0003 Development; Production class) | **NO** (Compose Dev only) |
| Redis | Yes (projection/cache) | **NO** (Compose Dev) |
| Search | Later/optional (OpenSearch Phase 5 in stack doc) | **NO** |
| NATS JetStream | Proposed Production; Dev in-memory stand-in (ADR-0004) | **NO** (Compose Dev NATS exists; Production pending ADR-0006) |
| Object / document storage | S3-compatible class; DocumentStorage port | **NO** product/region |
| Email / outbox | Outbox ADR-0010 Dev/Test; SES optional Dev | **NO** Production publisher |
| Monitoring | OpenTelemetry class; Production collector not claimed | **NO** |
| Backups | ADR-0011 schedule + restore proof | **NO** product |
| Secrets / KMS | ADR-0012 pending | **NO** |
| Identity provider | OIDC protocol (ADR-0005); product ADR-0013 | **NO** (local password IdP is Dev) |
| WAF / load balancer | Required class (Stage 2 B26) | **NO** |
| Private networking | Required class (network isolation) | **NO** |
| Administrative access | Foreign support = transfer (E1.8) | **NO** |

Current runtime evidence: API reports `productionReady: false`. In-memory `Store` remains SoR unless `EOS_DATABASE_URL` is set (Gate B durable path is Dev/Test, not Production hosting).

---

## 8. ENVIRONMENT-SEPARATION STATUS

Policy documented: strict Dev/Test vs Production; **no live Production PII in Dev/Test**.

| Surface | Dev/Test (observed) | UAT | Production |
| --- | --- | --- | --- |
| Accounts / projects | Local Docker / GitHub Actions ubuntu | **NOT AUTHORIZED** · **undefined** | **undefined** |
| Networks | Host ports 5432/6379/4222 on loopback/LAN Compose | **undefined** | **undefined** |
| Databases | `eos` / `eos-dev-only`; disposable Gate-B `eos_gateb` | **undefined** | **undefined** |
| Credentials | `.env.example` bootstrap passwords labelled not-for-prod | **undefined** | **undefined** |
| Secrets | `EnvSecretsProvider` / gitignored env | ADR-0012 **blocked for UAT+** | **undefined** |
| Encryption keys | Not a Production KMS | **undefined** | **undefined** |
| Storage | Local volumes `eos_pg` / `eos_nats` | **undefined** | **undefined** |
| Identity | `LocalPasswordIdentityProvider` | **undefined** | Corporate OIDC **not chosen** |
| CI/CD | `ci.yml` install/typecheck/test only | No UAT workflow found | **No Production deploy workflow found** |

Separation is a **requirement**, not an implemented Production estate.

---

## 9. POSTGRESQL / PERSISTENCE COMPATIBILITY

No architectural **contradiction** between the intended Production class and the approved persistence **direction**, provided Production uses durable PostgreSQL rather than in-memory Store.

| Capability | Persistence direction | E1 implication |
| --- | --- | --- |
| PostgreSQL as SoR | ADR-0003; Gate B per-request SQL when `dbPool` set | E1 must place a PostgreSQL 16-class instance in an **approved** jurisdiction |
| Durable Commercial/RFP/Programme | Target architecture; Gate B Dev/Test persist; Production SoR cutover **WP-14 NOT AUTHORIZED** | Hosting without SoR cutover does not recover jointly critical modules (RM-01 **OPEN**) |
| Durable audit / outbox | `audit_events` / `outbox_events` in schema | Placement follows Production PG (+ any log sinks) |
| DocumentStorage metadata vs bytes | Metadata PG (`119`); bytes behind port | **Two** placement decisions (DB + object store) |
| Optimistic locking / transactional writes | Application `version` + PG transactions | Compatible with managed or self-managed PG **class** |
| Post-commit events | Outbox; NATS Production pending ADR-0006 | Event bus location is an E1/subprocessor issue |
| Recovery from backup | Intended; product TBD | Blocked until backup jurisdiction + product exist |
| Future HA/DR | Lab demonstrated **class** behaviours on synthetic tables | Not Production topology; Restricted+ failover still **undefined** |

Contradiction if E1 tried to treat current Dev in-memory Store or disposable Gate-B Docker as Production SoR: governance **forbids** that. Gate C item 5 already records Production migration **blocked** until E1/hosting/backup exist.

Portability principle (Postgres, containers, ports for IdP/secrets) is **documented**. No Production IaC exists to prove an exit.

---

## 10. BACKUP / RECOVERY DEPENDENCIES

| Layer | What it is | What it is not |
| --- | --- | --- |
| 1. Gate-B / Gate-C disposable `pg_dump`/`pg_restore` | Dev/Test evidence for migration-123 prerequisite (run `20260916-014121`) | **Not** Production backup |
| 2. Stage 4B laboratory dump/WAL/PITR | **LABORATORY DEMONSTRATED** on synthetic tables (run `20260915-183034`) | **Not** Production product; **not** EOS commercial-module recovery |
| 3. ADR-0011 I17 evidence register | Dev/Test **records** that a 19:00 EAT slot and restore probe were logged | **Not** a copy of PostgreSQL or object storage |
| 4. Proposed Production requirement | Encrypted daily 19:00 EAT, remote copy, verified restore | **Not implemented** |

Production decisions still **missing**: backup product/mechanism; whether daily is sufficient vs WAL/PITR for business zero-loss; retention; encryption and **key ownership**; backup jurisdiction; restore target; restore-test cadence; PITR/WAL; DR location; failover model; **measured** RTO/RPO.

Business RTO/RPO must **not** be reported as technically proven.

---

## 11. SECURITY / IDENTITY DEPENDENCIES

| Item | Classification | Evidence |
| --- | --- | --- |
| `EOS_TOKEN_SECRET` | **E1 blocker** for a Production runtime using current env pattern; **downstream** ADR-0012 product | `.env.example` is Dev-only; Production secret location is also an E1 placement issue |
| Dev-only identity / local password IdP | **E1 blocker** if Production used current IdP; **independent later gate** ADR-0013 for product | ADR-0005: local passwords must not go to Production |
| Bootstrap users | **Downstream** of Production IdP; not a hosting-class substitute | Dev bootstrap secrets labelled not-for-prod |
| Environment secrets (`EnvSecretsProvider`) | **E1 blocker** for Production completeness; **independent later gate** ADR-0012 | UAT+ blocked until secrets system exists |
| Secrets management product | **Downstream dependency** after hosting class narrowed; **E1 blocker** for KMS/secrets **jurisdiction** (E1 analog to E1.10) | ADR-0012 **OPEN**; Vault vs cloud KMS **not chosen** |
| Key management | Same as secrets | Empty HE-KMS cells |
| Access separation (Prod vs Dev accounts) | **E1 blocker** | Production accounts **undefined** |
| TLS | **Downstream** capability class; product/termination **unknown** | Lab: encryption **NOT DEMONSTRATED** |
| WAF | **E1 blocker** for complete E1 if edge/WAF used (E1.11); else later gate | Product **not selected**; processing location **UNKNOWN** |
| Network segmentation | **E1 blocker** for Production topology | **undefined** |
| Corporate IdP location | **E1 blocker** for Gate E1 exit (E1.10) | ADR-0013 **OPEN** (Entra / Google / Keycloak fallback — none chosen) |

E1 **class** selection can be discussed without naming Vault/Entra, but E1 **exit** (allow/forbid A–D **and copies**) cannot close while IdP, KMS, logs, WAF, and support locations remain `UNKNOWN`.

---

## 12. LEGAL / COMPLIANCE UNKNOWNs

Not a legal opinion. Distinctions:

| Topic | Kind |
| --- | --- |
| Tanzania PDPA as design-basis framework | Documented **draft** Legal/DPO position — **requires attestation** |
| Kenya DPA / GDPR / UK GDPR applicability | **Legal applicability question** — not determined |
| Controller establishment | **Unknown** |
| Approved Production/backup/DR countries | **Unknown** / **NOT APPROVED** |
| Transfer mechanism (SCCs, adequacy, Tanzanian notification/permit) | **NOT APPROVED** — none cited |
| “Legal should approve the final architecture before Production” | Process statement — **not** evidence of existing approval |
| Owner Decision 7 Tanzania preference | **Owner business candidate** — not Legal approval |
| Option A–D viability “if Legal confirms” | **Architecture proposal** |
| Compose PostgreSQL 16-alpine | **Verified technical fact** (Dev) |
| Any named provider is PDPA/GDPR “compliant” | **Not stated** in repository; **do not claim** |

LE-01–LE-20: **not attested**. Stage 2 Legal pack A1–A20: **OPEN**.

---

## 13. E1 DECISION INPUTS STILL MISSING

Minimum pack vs repository:

| Input | Present? |
| --- | --- |
| A. Recommended architecture position | **NO OWNER-APPROVED RECOMMENDATION FOUND** |
| B. Lower-cost alternative (named, quoted) | **Structure only** — not populated |
| C. Higher-control alternative (named, quoted) | **Structure only** — not populated |
| D. Data-residency matrix with approved cells | **Draft matrix only** — all geographies **NOT APPROVED** |
| E. Production topology instances | **Class list only** |
| F. Environment separation (accounts/keys/CI) | **Policy only** |
| Legal/DPO attested placement rule (E1 exit) | **Missing** |
| At least one `CANDIDATE — NOT SELECTED` offering with verified HE/LE cells | **Missing** |
| Comparable 3-year TCO | **Missing** (`UNKNOWN — QUOTE REQUIRED`) |
| Named backup product + restore proof on real SoR | **Missing** |
| Technical RPO architecture decision | **Missing** (not converted from business zero-loss) |

An owner **cannot** make a defensible E1 selection from current evidence without inventing provider, region, transfer mechanism, or cost.

---

## 14. BLOCKERS

1. No attested Legal/DPO placement rule for Production **and** copies (Gate E1 exit unmet).  
2. No named provider or region; candidate slots empty.  
3. No approved transfer mechanism.  
4. Restricted+ / Highly Restricted failover geography **NOT APPROVED**.  
5. Production backup product and backup/DR jurisdictions **TBD / NOT APPROVED**.  
6. TCO quotes **not received**.  
7. Production secrets/IdP locations **OPEN** (blocks complete copy-location map).  
8. Stage 5 already recorded **DEFER / NOT READY**.

---

## 15. NON-BLOCKING GAPS

These do not by themselves prevent **preparing** an E1 evidence pack, but they are not closed:

- Lettering mismatch DP-0006 option D (colo) vs architecture pack option C (Tanzania-controlled).  
- Search/OpenSearch deferred to a later phase in the stack doc.  
- NestJS mentioned in stack doc vs Fastify API in runtime — Dev stack documentation drift; **not** a hosting-provider decision.  
- Item 4 Production indexes: no category-C index; **not** an E1 geography decision.  
- Migration 123 executed on disposable Gate-B only — **not** E1.

---

## 16. DEPENDENCIES ON ADR-0006 / DP-0006 / ADR-0011 / ADR-0012 / ADR-0013

| Record | Relationship to E1 |
| --- | --- |
| ADR-0006 | **This is the hosting/residency ADR.** Status remains **blocked for Production**. E1 evidence is an input to changing that status — **not** done here. |
| DP-0006 | Decision paper **OPEN**. UAT/Production hosting must not be finalized until the paper is approved and ADR-0006 updated. |
| ADR-0011 | Production backup **product TBD**; 19:00 EAT is a **future schedule requirement**. Backup **jurisdiction** is an E1 cell (E1.2). |
| ADR-0012 | Secrets platform **blocked for UAT and Production**; evaluate after ADR-0006. Secret-store **location** is still an E1 placement issue. |
| ADR-0013 | Corporate IdP **blocked for Production**; IdP processing location is E1.10. |

Closing E1 (when evidence exists) would still leave 0012/0013 as **separate product gates**.

---

## 17. READINESS VERDICT

**BLOCKED BY MISSING EVIDENCE**

Not an owner decision event. Not Production authorization.

---

## 18. NEXT GOVERNED ACTION

Smallest next governed action (do **not** execute in this task):

**Commission Gate E1 evidence closure — Legal/DPO attested placement rules (E1.1–E1.13) plus at least one `CANDIDATE — NOT SELECTED` offering per option class the owner wishes to keep in play — without selecting a provider and without provisioning infrastructure.**

Do **not** treat that work as Authorization F, WP-14, UAT, or deployment.

---

## 19. EXPLICIT AUTHORIZATION BOUNDARY

**E1 OWNER DECISION NOT YET RECORDED.**

Resolving E1, even in a future authorized decision, does **not** automatically authorize:

- cloud or colo **provisioning**;
- Production **database creation**;
- `migrate()` or any SQL migration;
- Production **cutover** (WP-14);
- **UAT**;
- Production **deployment** (Authorization G).

Those remain separate gates (architecture Authorizations D–G; Gate C item 5; ADR-0011/0012/0013).

### Cross-references (effect of this finding)

| Topic | Effect |
| --- | --- |
| ADR-0006 / DP-0006 | Remain **OPEN / blocked**; this file does not approve them |
| Gate C item 5 | Remains **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**; E1 missing evidence is a stated blocker |
| Production backup/DR | Cannot be sited until E1.2/E1.3 exist; ADR-0011 product still TBD |
| Production PostgreSQL | No approved place to put it |
| Production secrets/identity | ADR-0012/0013 remain OPEN; locations unknown |
| UAT readiness | DP-0006: UAT hosting must not be finalized until the paper is approved |
| Production deployment | **NOT AUTHORIZED** |
| Company business position | **PREPARED**; does **not** change this assessment verdict |

### Database / change-control statements

**Database contacted: NO** (Gate-B, UAT, Production, cloud: **NO**).  
**Migration executed: NO.**  
**Infrastructure provisioned: NO.**  
**Technical files changed: NONE** (this assessment file only).  
**Git commit / push / PR / merge: NO.**

Operator identity: **REQUIRES HUMAN**

**STOP.**
