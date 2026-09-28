# H-161 — POA Decision: Cloud Logging Storage Residency

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA requirement that Production EOS Cloud Logging **storage** use regional location `africa-south1` (Johannesburg), and that the default/global Cloud Logging storage arrangement is **not accepted** as the intended Production direction.  
> **NOT** authorization to deploy or configure GCP. **NOT** log buckets, sinks, or organization/folder logging settings. **NOT** Production observability implementation.  
> H-154 through H-160, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 655  
**Porcelain after this increment:** 656 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud Logging / Cloud Run / Cloud SQL / backup configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-162:** **NOT CREATED**

```text
H-161 STATUS = COMPLETE — LOGGING RESIDENCY DIRECTION RECORDED, NOT CONFIGURED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 655 (matches H-160 after-count) |
| Prior increment | H-160 created only `docs/governance/h-160-cloud-sql-backup-residency-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

---

## 2. POA authority / Owner decision

The Owner/Principal has exercised POA.

> Production EOS Cloud Logging storage shall use the custom regional location `africa-south1` (Johannesburg).

The default/global Cloud Logging storage arrangement is **NOT** accepted as the intended Production residency direction.

```text
LOGGING STORAGE RESIDENCY REQUIREMENT (POA):
Intended Production EOS Cloud Logging log-storage location = africa-south1.

Default / global Cloud Logging storage is not the intended Production direction.
```

This decision is subject to confirmation during actual Production implementation that the selected Google Cloud configuration, project hierarchy, logging configuration, sinks, and required services support the intended regional storage design.

---

## 3. Selected logging location and intended Production architecture

**SELECTED:** `africa-south1`

Intended Production EOS architecture (additive across H-158 / H-160 / H-161):

```text
Cloud Run:                 africa-south1
Cloud SQL PostgreSQL:      africa-south1
Cloud SQL backups:         custom africa-south1   (H-160)
Cloud Logging storage:     africa-south1          (this increment)
```

---

## 4. Distinction: decision vs implementation

### A. What has been decided

Production Cloud Logging **log-storage location** is directed to `africa-south1`.

### B. What has **not** been configured

| Item | H-161 |
| --- | --- |
| GCP logging bucket created | **NO** |
| `_Default` or `_Required` bucket regionalized | **NO** |
| Logging sink changed | **NO** |
| Organization / folder default logging setting changed | **NO** |
| Production logging configuration applied | **NO** |

```text
IMPLEMENTATION STATUS = NOT CONFIGURED
GCP RESOURCE STATUS = NONE CREATED
```

### C. Narrow, defensible statement

> The intended Production EOS log-storage location is `africa-south1`; additional logging, monitoring, routing, query, control-plane, export, and service-specific residency characteristics remain subject to implementation evidence and separate review.

This increment does **not** claim:

- “All Google Cloud logs remain in Johannesburg.”
- “All monitoring data remains in Johannesburg.”
- “All Google Cloud control-plane data remains in Johannesburg.”
- “All logging queries are processed in Johannesburg.”
- “The entire Google Cloud service is geographically restricted to Johannesburg.”

Regional Cloud Logging **storage** does **not** automatically establish that every logging-related operation remains in `africa-south1`.

---

## 5. Logging-residency limitations and unresolved questions

H-159 documented: `_Default` / `_Required` buckets default to **`global`** unless default resource settings or new regional buckets + sinks are used; existing bucket locations cannot be changed; Log Router may send entries elsewhere based on sinks; Cloud Monitoring is a global product; query processing location is not guaranteed; log-based metrics storage may be unspecified.

The following remain **OPEN**. No answers are invented.

- actual Production log bucket creation in `africa-south1`;
- `_Default` sink routing;
- `_Required` logging behavior;
- organization/folder default resource settings;
- retention policy;
- CMEK/KMS design (ADR-0012 still OPEN);
- logging IAM / access model;
- log views;
- cross-project / folder / organization logging;
- exported logs and external destinations;
- log-based metrics;
- Cloud Monitoring regionality;
- query-processing / storage implications;
- Security Command Center or other services that may consume or share log data;
- Error Reporting implications;
- audit-log requirements;
- provider / subprocessor / legal / DPA review;
- operational ownership;
- Production observability and alerting (H-154 item 22 implementation);
- Production deployment.

---

## 6. H-159 / H-160 continuity

| Record | Preserved |
| --- | --- |
| H-159 | Cloud Run → `africa-south1`; Cloud SQL → `africa-south1`. Backup residency was still an open Owner decision at that increment. |
| H-160 | Cloud SQL Production backups → custom `africa-south1`. Default nearest-multi-region backup location **rejected**. H-160 is **not** reopened. |
| H-161 | Cloud Logging **storage** → `africa-south1`. Default/global storage **not accepted** as intended Production direction. |

PITR remains **OPEN — provider evidence required**.  
DR remains **OPEN — separate Owner decision required**. A Johannesburg outage still does **not** authorize restore into another region.

H-157 PDPC boundary is **preserved**: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim. PDPC work is **not** reopened.

---

## 7. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. H-161 changes **only** the Owner-direction field for **logging storage residency** (item 22 observability, as the inventory’s logging-residency decision). Implementation/evidence remain OPEN. Unrelated blockers are **not** closed.

| # | Gate | After H-161 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed** |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160: custom `africa-south1` direction; **implementation/evidence OPEN** |
| 15 | Restore evidence | **OPEN** |
| 16–17 | Operations / on-call | **OPEN** |
| 18 | Wider legal/privacy | **OPEN** |
| 19–21 | Event transport, email/DPA, process supervision | **OPEN** |
| **22** | Observability / logging | **OWNER DIRECTION SELECTED — `africa-south1` log-storage location; IMPLEMENTATION AND EVIDENCE OPEN**. Broader Monitoring/control-plane/query residency **OPEN**. **Not fully closed.** |
| 23 | Production-like start | **OPEN** |
| 24 | Rollback / DR | **OPEN** |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

---

## 8. ADR-0006 reconciliation

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Cloud Run:              africa-south1
Cloud SQL PostgreSQL:   africa-south1
Cloud SQL backups:      custom africa-south1
Cloud Logging storage:  africa-south1
```

Implementation, evidence, and Production authorization remain outstanding.

---

## 9. DP-0006 reconciliation

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Provider implementation has **not** occurred. Logging-storage direction is added to the selected architecture; it is **not** a completed residency evidence pack.

---

## 10. Next-action candidates (not executed)

Do **not** begin H-162 in this increment. Candidates for a later Owner/POA decision, without preference implied as authorization:

- PITR storage/geography provider-evidence review;
- Artifact Registry location (`africa-south1` vs other);
- Secret Manager / Cloud KMS location (ADR-0012 still OPEN);
- DR / restore-to-another-region Owner decision;
- organization/folder Logging default-resource settings vs new regional buckets + sinks (implementation design, still not configuration);
- DPA / subprocessors / Legal review;
- Production authorization grant (only after evidence, not now).

None of these is performed here.

---

## 11. Explicit safety statements

```text
No GCP resources were created.
No Cloud Logging configuration was applied.
No log buckets, sinks, or org/folder logging settings were changed.
Production remains NOT AUTHORIZED / NOT READY.
```

Application code unchanged. Database schema unchanged. Migration 126 not created. Live migration not run. Infrastructure-as-code not introduced. No credentials created or used. No DNS change. No Production deployment.

---

## 12. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 655 → 656 |
| Files changed this increment | `docs/governance/h-161-cloud-logging-residency-owner-decision.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-161
H-162 NOT CREATED
```
