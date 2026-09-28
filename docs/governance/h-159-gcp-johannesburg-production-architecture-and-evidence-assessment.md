# H-159 — GCP Johannesburg Production Architecture and Evidence Assessment

> **ARCHITECTURE AND EVIDENCE ASSESSMENT ONLY**  
> Documents the POA-selected GCP / Cloud Run / Cloud SQL / `africa-south1` topology against current official Google Cloud documentation and existing SEDMC Production-readiness records.  
> **NOT** authorization to deploy. **NOT** a GCP account, project, or resource. **NOT** credentials, DNS, TLS, contracts, or migrations.  
> H-147 through H-158, historical ADR-0006, and historical DP-0006 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 653  
**Porcelain after this increment:** 654 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP account / project / resource / credential / DNS actions:** **NONE**  
**Provider contract accepted:** **NO**  
**Google Cloud support contacted:** **NO**  
**Commit / push:** **NONE**  
**H-160:** **NOT CREATED**

```text
H-159 STATUS = COMPLETE — ARCHITECTURE ASSESSED, NOT DEPLOYED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

Classification used below (exactly one per item where applied):

| Token | Meaning |
| --- | --- |
| READY FOR DESIGN | Direction is selected; a later design pack can specify configuration. Not deployed. |
| REQUIRES EVIDENCE | Official docs are incomplete, engine-specific, or live project evidence is still needed |
| REQUIRES OWNER DECISION | A configuration or residency choice is documented but not chosen |
| REQUIRES PROVIDER CONFIGURATION | Feasible only after a GCP project exists and is configured |
| BLOCKED | Cannot proceed until a named prior gate exists (account, contract, IdP product, Production grant) |

---

## 1. POA-selected architecture

From H-158 (unchanged):

```text
Users
  |
  v
Google Cloud Run
africa-south1 / Johannesburg
  |
  v
Google Cloud SQL for PostgreSQL
africa-south1 / Johannesburg
```

| Element | Direction |
| --- | --- |
| Provider | Google Cloud Platform |
| Application | Cloud Run |
| Database | Cloud SQL for PostgreSQL |
| Primary region | `africa-south1` — Johannesburg, South Africa |
| Residency objective | Place Production application and PostgreSQL resources in `africa-south1` wherever those services support regional placement |

**Not selected here (future dependencies only):** Artifact Registry, VPC/private connectivity, IAM bindings, Secret Manager, Cloud KMS, Cloud Logging, monitoring/alerting, DNS, HTTPS/load balancing, backup product configuration, restore/DR topology, email transport, event transport (NATS), IdP, cost-management product. Identifying them as dependencies is **not** authorization to provision them.

Planning context only (H-120 family; **not** Production sizing): 100 users; concurrency 50; 10% growth over three years; 30% headroom; 20 current accounts + 15% growth. These are **not** converted into machine types, vCPU, or storage GB in this increment.

---

## 2. Verified provider facts

Sources are **current official Google Cloud documentation**, consulted for this assessment. Not a live probe of a SEDMC GCP project (none exists). Not a contract.

| Fact | Official source | What it does **not** prove |
| --- | --- | --- |
| Cloud Run is regional. `africa-south1` is Johannesburg. “Customer data associated with the Cloud Run resource is stored in the selected region.” | [Cloud Run locations](https://docs.cloud.google.com/run/docs/locations) | All logs, images, traces, load-balancer metadata, or support data stay in Johannesburg |
| Cloud SQL for PostgreSQL is available in `africa-south1` (Johannesburg). Instance region is chosen at creation and cannot be changed. Instance data is stored in the selected region. | [Cloud SQL instance locations](https://docs.cloud.google.com/sql/docs/postgres/locations) | Backups, PITR artefacts, or Admin API control-plane data automatically stay in Johannesburg |
| Cloud SQL, Cloud Run (fully managed), Cloud Logging, and Cloud KMS appear on Google’s list of services that **may be configured** for data location under Cloud terms | [GCP Services Data Residency (archived terms pages)](https://cloud.google.com/archive/terms/data-residency-20250623) | SEDMC has accepted those terms, or that default configurations satisfy residency |
| Assured Workloads documents a **South Africa Data Boundary** control package restricting `gcp.resourceLocations` to `africa-south1`; technical support cases for that package are routed to **global support personnel** | [South Africa Data Boundary](https://docs.cloud.google.com/assured-workloads/docs/control-packages/south-africa-data-boundary) | Assured Workloads is selected, purchased, or sufficient for SEDMC legal requirements |

```text
Do NOT read the above as:
"All Google Cloud data associated with SEDMC will remain in Johannesburg."
That has NOT been established.
```

---

## 3. Cloud Run assessment (application runtime)

| Topic | Assessment | Class |
| --- | --- | --- |
| Region | Direction: `africa-south1`. Feasible per locations doc. | READY FOR DESIGN |
| Service deployment model | Container service; revisions; traffic split. Not designed. | READY FOR DESIGN |
| Container image location | Artifact Registry supports `africa-south1` ([repo locations](https://cloud.google.com/artifact-registry/docs/repositories/repo-locations)). Default/`gcr.io`/multi-region registry would be a residency leak. Registry **not selected**. | REQUIRES OWNER DECISION + REQUIRES PROVIDER CONFIGURATION |
| Service-to-database connectivity | Cloud SQL Auth Proxy, private IP + Direct VPC egress / Serverless VPC Access, or public IP (rejected by existing Production TLS/network intent). None configured. | REQUIRES OWNER DECISION |
| Ingress | Default URL vs custom domain + HTTPS load balancer. Custom domain/DNS **not selected**. | REQUIRES OWNER DECISION |
| Egress | Unrestricted egress vs VPC egress controls. Not designed. | REQUIRES OWNER DECISION |
| Min/max instances, concurrency | Not sized. Planning assumptions must not be converted to Production limits here. | REQUIRES OWNER DECISION (later capacity pack) |
| Startup/shutdown / health checks | Align with existing fail-closed `validateDeploymentConfig()` / health routes. Compiled process (`node dist` / `next start`) maps to container CMD, not `tsx`. | READY FOR DESIGN |
| Process supervision | Cloud Run manages the container process. H-154 blocker 21 (not `tsx`) remains until a real revision exists. | REQUIRES PROVIDER CONFIGURATION |
| Application secrets | Must not live in Git or the image. Secret Manager / KMS still unselected (ADR-0012 OPEN). | BLOCKED on secrets/KMS decision + project |
| Control-plane / operational metadata | H-158 Q1 unanswered. Cloud Run locations statement covers **customer data associated with the resource**, not all Google operational metadata. | REQUIRES EVIDENCE |

---

## 4. Cloud SQL for PostgreSQL assessment

| Topic | Assessment | Class |
| --- | --- | --- |
| Region | Direction: `africa-south1`. Feasible. Immutable after create. | READY FOR DESIGN |
| Edition | Enterprise vs Enterprise Plus **not selected**. Affects backup retention defaults, PITR log retention, HA features. | REQUIRES OWNER DECISION |
| Machine sizing / storage | **Not selected.** Planning assumptions (100 users / 50 concurrency / growth) are context only. | REQUIRES OWNER DECISION (separate capacity decision) |
| HA / zones | Regional HA vs zonal. Not selected. Affects RTO inside Johannesburg, not cross-region DR. | REQUIRES OWNER DECISION |
| Encryption | Google-managed keys vs CMEK in `africa-south1` KMS. CMEK location must match if used. | REQUIRES OWNER DECISION |
| Database TLS | Existing Production-like contract: `EOS_DATABASE_TLS_MODE=require`. Cloud SQL supports TLS; live `require` evidence needs an instance. | REQUIRES PROVIDER CONFIGURATION |
| Authorized networks / private connectivity | Public IP + authorized networks vs private IP. Public exposure conflicts with Production network intent. | REQUIRES OWNER DECISION |
| Service identity | Cloud Run service account + Cloud SQL IAM DB auth vs password secret. Neither exists. | BLOCKED on IAM + secrets |
| Backups / PITR / maintenance / monitoring / restore | See §5–§6. | — |
| Catalog name | New Production catalog only. Must not reuse `eos` / `eos_h112_full` / `eos_h117_uat` / `eos_h149_uat` / `eos_h152_uat` / `eos_gateb`. | READY FOR DESIGN (naming) / BLOCKED (create) until Production grant |

---

## 5. Backup and PITR assessment (critical residency)

Official standard-backup storage rules ([Choose your backup option](https://docs.cloud.google.com/sql/docs/postgres/backup-recovery/backup-options), updated 2026-09-18 UTC):

1. **Default location (if unspecified):** backups are stored in the **multi-region that is geographically closest** to the instance. Documented example: `us-central1` → `us` multi-region. Documented multi-regional backup locations are `asia`, `eu`, and `us` ([instance locations](https://docs.cloud.google.com/sql/docs/postgres/locations)). **There is no documented Africa multi-region.** This assessment **does not infer** which of `asia` / `eu` / `us` is closest to Johannesburg.
2. **Custom location:** Cloud SQL lets you select a custom regional or multi-regional backup location, including for data-residency / Resource Location Restriction policies. Valid regional values include instance locations (which list `africa-south1`).
3. **SEDMC residency objective:** default (unspecified) backup location **does not** satisfy “keep backups in Johannesburg.” Meeting the objective requires an Owner decision to set a **custom backup location** of `africa-south1` (or another explicitly approved boundary), plus later provider configuration. Changing location later does **not** move existing backups.
4. **PITR:** PostgreSQL PITR uses transaction logs stored on **instance disk** or **Cloud Storage** (`transactionalLogStorageState`). Enterprise defaults differ from Enterprise Plus. Cloud Storage “same region as primary” is documented for some Cloud SQL engines’ restore overviews; **PostgreSQL-specific same-region confirmation for PITR Cloud Storage objects remains REQUIRES EVIDENCE** (do not treat MySQL/SQL Server wording as PostgreSQL proof).
5. **Regional / multi-regional behaviour:** standard backups support single-region (zonal replication within the region) or multi-region backup configurations. Enhanced backups (Backup and DR vault) are a **separate product**, not selected; vault location must be compatible with the instance; enhanced backups **cannot** be combined with a DR replica per current limitations.
6. **Johannesburg unavailable:** restoring from a backup during a regional outage is documented as restoring to an instance in a region that is available. That **is** a cross-region restore pattern.
7. **Cross-region DR copy:** a DR replica or restore into a second region would **intentionally** place data outside `africa-south1`. Whether that leaves South Africa depends on the second region chosen. **Not designed.**
8. **Owner decision required before accepting DR that leaves Johannesburg / South Africa.** Do not design it in this increment.

ADR-0011 19:00 EAT backup intent remains an **intent**. Cloud SQL automated backup start time is specified in **UTC**. Mapping 19:00 EAT → UTC and DST is an ops decision, not configured.

**Backup finding:** Cloud SQL **regional instance placement does not automatically mean backup residency in Johannesburg.** Default backups are nearest **multi-region**, which is not an Africa-only location in Google’s documented multi-region list.

| Item | Class |
| --- | --- |
| Custom backup location = `africa-south1` | REQUIRES OWNER DECISION then REQUIRES PROVIDER CONFIGURATION |
| Accept default nearest multi-region backups | REQUIRES OWNER DECISION (would **not** meet current residency objective) |
| Enhanced backups / Backup and DR vault | NOT SELECTED; would require a separate decision |
| PITR Cloud Storage geography (PostgreSQL) | REQUIRES EVIDENCE |
| Cross-region DR | REQUIRES OWNER DECISION; not designed |
| Restore drill evidence | BLOCKED until an instance and backups exist (H-154 item 15) |

---

## 6. Logging and observability assessment

Official Cloud Logging ([Locations](https://cloud.google.com/logging/docs/region-support), [Store log entries](https://docs.cloud.google.com/logging/docs/store-log-entries)):

- Log buckets are **regional**. `africa-south1` (Johannesburg) is a **supported** bucket location.
- For each project, Logging auto-creates `_Required` and `_Default` buckets in the **`global` location** unless organization/folder **default resource settings** set another default. **Existing bucket locations cannot be changed**; new regional buckets + sinks are required to regionalize.
- Log Router processes entries in the region they are received, **may send logs to a different region** based on sink definition, and temporarily buffers logs.
- Sinks can route to Logging buckets, Cloud Storage, BigQuery, or Pub/Sub **in other projects/regions**.

Official Cloud Monitoring ([Data regionality](https://docs.cloud.google.com/monitoring/docs/region-support)):

- Monitoring is a **global** product.
- Time series for zonal/regional Google Cloud resources are stored in the **same region** as the resource when location/zone/region labels are valid.
- Query **processing** location is **not guaranteed** to match storage location.
- Log-based metrics: storage location of those time series is **unspecified**.

H-157: EOS is not a personal-data SoR; application logs **can** still contain commercial facts or accidentally pasted personal data (Class C residual; named-key redaction is incomplete). Logs are **not** automatically non-personal.

| Item | Class |
| --- | --- |
| Create `_Default` replacement bucket in `africa-south1` + sink | REQUIRES OWNER DECISION then REQUIRES PROVIDER CONFIGURATION |
| Leave `_Default` / `_Required` as `global` | Would **not** meet residency objective for log **storage**; REQUIRES OWNER DECISION to accept or reject |
| Sink destinations / SCC sharing | REQUIRES OWNER DECISION (residency leak if routed away) |
| Monitoring time-series processing location | REQUIRES EVIDENCE (docs: no guarantee) |
| Production alerting product | OPEN (H-154 item 22); Cloud Monitoring is a candidate, **not selected** as the named sink |

---

## 7. Security assessment (IAM, secrets, KMS, network, TLS)

### IAM

Human access, service accounts, least privilege, break-glass, owner/admin separation: **READY FOR DESIGN** as a paper model; **BLOCKED** to implement until a GCP project exists. HUM-08 DBA/security/identity owners remain **UNASSIGNED** except PDM as Production Infrastructure Owner until delegated (H-125 OA-08) and Wensley Shirima as internal DPO (not GCP admin). Do not invent names.

### Secrets

Secret Manager supports **regional** secrets in `africa-south1` ([Secret Manager locations](https://docs.cloud.google.com/secret-manager/docs/locations)). Global secrets would not meet the residency objective. No secrets in Git or images (existing rule). ADR-0012 remains **OPEN** (Vault vs cloud KMS/Secret Manager after ADR-0006). This assessment records Secret Manager in `africa-south1` as a **feasible candidate**, **not** an ADR-0012 closure and **not** a product lock.

| Secrets | REQUIRES OWNER DECISION (ADR-0012) + regional vs global |
| --- | --- |

### KMS

Cloud KMS location `africa-south1` exists (Johannesburg; HSM multi-tenant only; EKM available) ([KMS locations](https://cloud.google.com/kms/docs/locations)). CMEK vs Google-managed keys: **REQUIRES OWNER DECISION**. Key rotation and access: **READY FOR DESIGN** after project exists.

### Network

Cloud Run → Cloud SQL: private path preferred. Public Cloud SQL IP would conflict with Production network intent. Direct VPC egress / Cloud SQL Auth Proxy / Serverless VPC Access: **READY FOR DESIGN**, **REQUIRES PROVIDER CONFIGURATION**. Ingress restrictions and egress controls: **REQUIRES OWNER DECISION**.

### TLS

HTTPS for public origin: **BLOCKED** on DNS + certificate (items 10–11). Database TLS `require`: **REQUIRES PROVIDER CONFIGURATION** after instance exists. Certificate management (Google-managed cert vs other): **REQUIRES OWNER DECISION**.

**No implementation. No credentials.**

---

## 8. Identity and MFA

ADR-0013 / H-154 items 8–9 remain **OPEN**. HUM-05 corporate directory **NOT ESTABLISHED**. This increment **does not select** Entra, Google Workspace, Identity Platform, IAP, or Cloud Identity as the EOS IdP.

Cloud Run can later sit behind Identity-Aware Proxy **if** an IdP is chosen. That is **not** authorized here.

| Application-user authentication | Existing EOS OIDC mapping after a named IdP | BLOCKED on ADR-0013 |
| Administrative GCP console access | Google identities + MFA at the **Google account** IdP | REQUIRES OWNER DECISION; distinct from EOS IdP |
| Service-to-service | Cloud Run SA → Cloud SQL | REQUIRES PROVIDER CONFIGURATION |
| Session security | Existing EOS session model; Production principals unprovisioned | OPEN (item 26) |

Do not create accounts.

---

## 9. DNS and HTTPS

| Topic | Status | Class |
| --- | --- | --- |
| Production domain | **Not selected.** Do not invent a hostname. | REQUIRES OWNER DECISION |
| DNS provider | **Not selected.** | REQUIRES OWNER DECISION |
| Cloud Run ingress URL | `*.run.app` is not an approved Production origin. | READY FOR DESIGN (must not be the Production origin without a decision) |
| HTTPS certificate | None. | REQUIRES PROVIDER CONFIGURATION after DNS |
| TLS termination | Cloud Run and/or HTTPS load balancer. Load balancer **not selected**. | REQUIRES OWNER DECISION |
| CORS / allowed origins | Fail-closed loopback today. Named HTTPS origins after DNS. | BLOCKED on hostname (item 13) |

No DNS change. No certificates issued.

---

## 10. Data residency register

| Component | Intended location | Evidence status | Residency risk | Decision required |
| --- | --- | --- | --- | --- |
| Cloud Run | `africa-south1` | Verified: customer data associated with the resource stored in selected region | Low **for that class of customer data**; control-plane metadata **unknown** | No for region choice (already POA); yes for image registry and ingress |
| Cloud SQL instance data | `africa-south1` | Verified: instance region stores instance data | Low **for instance data**; backups/PITR **not** implied | No for instance region (already POA) |
| Cloud SQL backups | TBD — default is nearest **multi-region** (`asia`/`eu`/`us`); custom may be `africa-south1` | Official default + custom-location capability **verified**; default target multi-region for Johannesburg **not inferred** | **OPEN — HIGH if default left unchanged** | **Yes** |
| PITR artefacts | TBD (disk and/or Cloud Storage) | PostgreSQL storage **state** documented; PostgreSQL Cloud Storage **geography** not treated as verified | **OPEN** | **Yes** |
| Cloud Logging | TBD — `_Default`/`_Required` default **`global`**; `africa-south1` buckets supported | Verified | **OPEN — HIGH if defaults left unchanged** | **Yes** |
| Monitoring | Mixed: regional time series for regional resources; product is global; query processing not guaranteed local; log-based metrics unspecified | Partial | **OPEN** | **Yes** (accept residual vs constrain) |
| KMS | `africa-south1` feasible | Location list verified; not configured | **OPEN** until key location chosen | **Yes** |
| Secrets | `africa-south1` regional secrets feasible; global secrets would leak | Location list verified; ADR-0012 OPEN | **OPEN** | **Yes** |
| Container images | `africa-south1` Artifact Registry feasible | Location list verified; not selected | **OPEN** | **Yes** |
| DNS | TBD | Not implemented | **OPEN** | **Yes** |
| Support / subprocessors | TBD — Assured Workloads SA boundary still uses **global support personnel** if that package is used | Contract + subprocessors list required | **OPEN** | **Yes** |
| DR | TBD — not designed; cross-region restore documented as the outage pattern | Not designed | **OPEN** | **Yes** |

No component is labelled legally **compliant**.

---

## 11. Cost-input requirements

**Actual pricing: REQUIRES CURRENT PROVIDER QUOTE / CALCULATOR INPUT.** No SKUs, monthly totals, or commitments are recorded.

A later cost model must collect current calculator/quote inputs for: Cloud Run (CPU/memory/request); Cloud SQL (edition, vCPU, memory, storage, HA); storage; backups (location-sensitive); networking/egress; Logging ingest/storage; Monitoring; Artifact Registry; KMS; Secret Manager; DNS; load balancing (if selected); support tier; DR replica or second-region restore if selected.

No financial commitment is created.

---

## 12. Operational model

From H-120 / H-125 / H-147 / H-154 — **not invented**:

| Role | Recorded state |
| --- | --- |
| Executive / infrastructure owner | PDM until formally delegated (OA-08) |
| Application owner | PDM; technical execution delegated to engineering (title) |
| Database / DBA | **UNASSIGNED** |
| Security owner | **UNASSIGNED** |
| Identity/access owner | **UNASSIGNED** (HUM-05 not established) |
| Backup owner | **UNASSIGNED** |
| Restore authority | **UNASSIGNED** |
| Deployment / rollback authority | **UNASSIGNED** (Production grant itself OPEN) |
| Incident escalation | PDM (OA-02); **not** a 24/7 NOC |
| On-call roster | **OPEN** — none overlapping commercial RTO window |
| Vendor escalation | PDM as vendor relationship owner (title); no Google contract |

Do not invent a 24/7 NOC. Do not claim an on-call roster exists.

---

## 13. Contract / DPA evidence requirements

H-157 preserved: EOS is bounded as a non-personal commercial system; EOS-specific PDPC filing is **not** being pursued. GCP selection does **not** reopen H-156 Q-01–Q-15 as an EOS software trigger.

Before Production, Owner/Legal still need (not obtained here):

- Google Cloud terms of service;
- applicable data-processing terms (Cloud Data Processing Addendum / equivalent);
- subprocessors list;
- service-specific terms (Cloud Run, Cloud SQL, Logging, KMS);
- residency commitments vs defaults documented in §§5–6;
- security commitments;
- support-access geography (global support is documented for the SA Assured Workloads package);
- cross-border processing provisions for backups, logs, DR, and support.

```text
CONTRACT / DPA = REQUIRES OWNER/LEGAL REVIEW
No DPA is claimed to exist.
No contractual terms are accepted in this increment.
```

EI-16 / H-154 item 18 remain **OPEN**.

---

## 14. Production blocker reconciliation

Named inventory remains **28**. Design ≠ closure.

| # | Gate | After H-159 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2 | Hosting/provider/region | **POA SELECTED DIRECTION** (H-158). Architecture assessed here. **Not closed** |
| 3 | ADR-0006 | **POA SELECTED — GCP Johannesburg**. **Not fully closed** |
| 4 | DP-0006 | **SELECTED — PENDING IMPLEMENTATION / PROVIDER EVIDENCE**. **Not fully closed** |
| 5 | Production DB/catalog | **OPEN** — not created |
| 6 | Production migration | **OPEN** — 126 not created; live migrate not authorized |
| 7 | Secrets/KMS | **OPEN** — feasible candidates identified; ADR-0012 not closed |
| 8 | IdP | **OPEN** — not selected |
| 9 | MFA | **OPEN** |
| 10 | HTTPS | **OPEN** |
| 11 | DNS | **OPEN** — domain not selected |
| 12 | DB TLS | **OPEN** |
| 13 | CORS | **OPEN** |
| 14 | Backup | **OPEN** — default residency **does not** meet objective |
| 15 | Restore evidence | **OPEN** |
| 16 | Operations ownership | **OPEN** / partial titles |
| 17 | On-call | **OPEN** |
| 18 | Wider legal/privacy | **OPEN** — DPA/subprocessors/support geography; EOS PDPC filing not reopened |
| 19 | Event transport | **OPEN** — not in selected topology |
| 20 | Email product/DPA | **OPEN** — not in selected topology |
| 21 | Process supervision | **OPEN** until a Cloud Run revision exists |
| 22 | Observability | **OPEN** — logging residency **OPEN** |
| 23 | Production-like start | **OPEN** |
| 24 | Rollback/DR | **OPEN** — not designed |
| 25 | SoR / H-81 | **OPEN** — NOT STARTED |
| 26 | Production access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

---

## 15. H-157 PDPC boundary (preserved)

```text
EOS is bounded as a non-personal commercial system.
EOS-specific PDPC filing is not being pursued.
Wider SEDMC PDPC remains separate and OPEN.
No PDPC exemption claimed.
No company-wide PDPC compliance conclusion.
H-156 Q-01–Q-15 remain unanswered.
```

Architecture evidence identifies **provider residency / DPA / support-geography** issues. Those are **contract and configuration** gates, not a basis to reopen EOS-specific PDPC registration. H-156 is **not** reopened.

---

## 16. Exact open Owner decisions

1. **Cloud SQL backup location:** custom `africa-south1` vs accepting default nearest multi-region (which is not an Africa multi-region in Google’s list).
2. **Johannesburg outage / DR:** restore only inside `africa-south1` (availability risk) vs cross-region copy (residency leaves Johannesburg; may leave South Africa depending on target).
3. **Logging:** regionalize to `africa-south1` buckets + sinks vs accept `global` `_Default`/`_Required`.
4. **Monitoring residual:** accept global product / unspecified processing vs additional constraint (e.g. Assured Workloads SA boundary — which still uses global support).
5. **Assured Workloads South Africa Data Boundary:** adopt or not (separate from H-158 service selection; global support personnel if adopted).
6. **Artifact Registry / Secret Manager / KMS locations:** regional `africa-south1` vs global.
7. **Cloud SQL edition, HA, private connectivity, CMEK.**
8. **Production domain and DNS provider.**
9. **ADR-0012 secrets platform** and **ADR-0013 IdP** (still OPEN; not selected here).
10. **HUM-08 named DBA, security, backup, identity, on-call** (do not invent names).
11. **Owner/Legal review of Google terms, DPA, subprocessors** (not accepted here).
12. **Cost approval** after quote/calculator (no prices invented).
13. **Production authorization grant** (item 1) — only after the above evidence, not now.

Capacity (vCPU/storage) remains a **later** decision; planning assumptions are not sizing.

---

## 17. Recommended next action

```text
NEXT ACTION (not executed; H-160 not created):

Owner/POA decision on Cloud SQL backup residency for the selected
africa-south1 instance direction:

  (a) require a custom backup location of africa-south1 to meet the
      Johannesburg residency objective; or
  (b) explicitly accept default nearest-multi-region backup storage
      (asia, eu, or us — which one is closest is NOT inferred here)
      as a documented residency exception.

Cursor cannot configure backups. No GCP project exists. No contract
is accepted. This decision is the earliest material residency gate
identified by official Cloud SQL documentation.
```

Related logging-bucket and DR decisions should follow the same Owner session but are **not** substituted as the single next action.

---

## 18. Explicitly excluded (not performed)

```text
H-160: NOT CREATED
GCP account / project / Cloud Run / Cloud SQL / buckets / SA / IAM / KMS / secrets: NOT CREATED
DNS / HTTPS / load balancing / backups: NOT CONFIGURED
Production migration / migration 126 / credentials: NONE
Google Cloud support contacted: NO
Provider contract accepted: NO
application / schema / infrastructure: UNCHANGED
H-147–H-158 overwritten: NO
commit / push: NONE
```

---

## 19. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 653 → 654 |
| Files changed | `docs/governance/h-159-gcp-johannesburg-production-architecture-and-evidence-assessment.md` only |
| Cloud resources created | **NONE** |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
PROCESS STOPPED AFTER H-159
```
