# H-160 — POA Decision: Cloud SQL Backup Residency

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA requirement that Production Cloud SQL for PostgreSQL backups use a **custom** `africa-south1` backup location, and that the default nearest-multi-region backup arrangement is **not accepted**.  
> **NOT** authorization to deploy or configure GCP. **NOT** a Cloud SQL instance. **NOT** applied backup settings. **NOT** restore or DR validation.  
> H-154 through H-159, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 654  
**Porcelain after this increment:** 655 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / Cloud Run / backup configuration applied:** **NONE**  
**Credentials / secrets / DNS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-161:** **NOT CREATED**

```text
H-160 STATUS = COMPLETE — BACKUP RESIDENCY DIRECTION RECORDED, NOT CONFIGURED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. POA decision

The Owner has exercised POA. Based on H-159, the Production architecture decision is:

> Cloud SQL for PostgreSQL Production backups shall use the custom `africa-south1` backup location, subject to confirmation that the selected Cloud SQL configuration supports this requirement at implementation time.

```text
BACKUP RESIDENCY REQUIREMENT (POA):
Production Cloud SQL for PostgreSQL backups shall be configured with
custom backup location = africa-south1.

The default nearest-multi-region backup arrangement is NOT accepted
for SEDMC Production.
```

This is a **design requirement**. Implementation and verification remain future Production-readiness activities. No GCP project, Cloud SQL instance, or backup job exists.

---

## 2. Reason for rejecting default nearest-multi-region backup storage

H-159 recorded from official Cloud SQL documentation:

- If backup location is **unspecified**, Cloud SQL stores backups in the **multi-region geographically closest** to the instance.
- Documented multi-regional backup locations are `asia`, `eu`, and `us`. There is **no** documented Africa multi-region.
- Which of those three is closest to Johannesburg was **not inferred**.
- Therefore the default arrangement **does not** satisfy the selected Johannesburg residency objective.

The company rejects substituting `asia`, `eu`, `us`, another multi-region, another country, or another region, unless the Owner later approves an **explicit exception**.

Selected hosting/residency architecture (H-158 + this increment):

```text
Cloud Run            — africa-south1
Cloud SQL instance   — africa-south1
Cloud SQL backups    — africa-south1
```

This preserves the intended Johannesburg residency boundary **as far as the selected GCP service configuration permits**. It does **not** prove that all Google Cloud metadata, support, or control-plane activity remains in South Africa.

---

## 3. Required backup location and instance-region relationship

```text
Production Cloud SQL PostgreSQL
        |
        +---- Instance region: africa-south1
        |
        +---- Backup location: africa-south1
```

| Element | Requirement |
| --- | --- |
| Instance region | `africa-south1` (H-158; immutable after instance create) |
| Backup location | Custom `africa-south1` (this decision) |
| Confirmation at implementation | The chosen Cloud SQL edition/option must **support** custom `africa-south1` backup location before it is treated as implemented |
| Default nearest multi-region | **Not accepted** as intended Production configuration |

H-159 note remains: if backup location is changed later, **existing** backups stay in their original location. First-time configuration must set `africa-south1` from the start.

---

## 4. PITR distinction

Selecting the backup location does **not** automatically resolve Point-in-Time Recovery residency.

| Topic | Status |
| --- | --- |
| Cloud SQL **backup** location | **POA DECISION: `africa-south1`** |
| PITR storage / geography | **OPEN — PROVIDER EVIDENCE REQUIRED** |

H-159: PostgreSQL PITR uses transaction logs on instance disk and/or Cloud Storage; PostgreSQL-specific Cloud Storage geography was not treated as verified from other engines’ docs.

---

## 5. DR distinction

A Johannesburg regional outage does **not** automatically authorize restoration of SEDMC Production data into another geographic region.

| Topic | Status |
| --- | --- |
| Restore to another region during Johannesburg outage | **OPEN — OWNER DECISION REQUIRED** |
| Cross-region DR design | **NOT APPROVED** / **not designed in this increment** |

Later assessment (not this increment): availability of another approved South African region; recovery objectives; restoration feasibility; residency implications; business continuity; cost; operational ownership.

---

## 6. Limitations (not claimed)

This increment does **not** state that:

- backups are already configured or currently exist;
- Production has been deployed;
- `africa-south1` backup configuration has been tested;
- restore has been tested;
- disaster recovery has been validated;
- all backup-related metadata remains in South Africa;
- all Google Cloud support/control-plane activity remains in South Africa;
- Production is legally compliant or residency-compliant as an implemented system.

---

## 7. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. Only the **backup-related decision state** of item 14 changes. Unrelated blockers are **not** closed.

| # | Gate | After H-160 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected (H-158); **not fully closed** |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** (unchanged) |
| **14** | Backup product / configuration | **OWNER DIRECTION SELECTED — `africa-south1` CUSTOM BACKUP LOCATION; IMPLEMENTATION AND EVIDENCE OPEN**. **Not fully closed.** |
| **15** | Restore evidence | **OPEN** |
| 16–23 | Ops, on-call, legal/privacy, NATS, email, supervision, observability, production-like start | **OPEN** (unchanged) |
| **24** | Rollback / DR | **OPEN** |
| 25–26 | SoR / access model | **OPEN** (unchanged) |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

Item 14 is **not** closed: no instance, no applied `settings.backupConfiguration.location`, no backup artefact, no restore drill.

---

## 8. ADR-0006 reconciliation

Historical file `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

**Additive direction (H-158 + H-160):**

```text
Cloud Run:           africa-south1
Cloud SQL:           africa-south1
Cloud SQL backups:   africa-south1
```

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION
```

---

## 9. DP-0006 reconciliation

Historical file `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

The selected architecture direction now includes the backup-location requirement in §3.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Not fully closed. Implementation, custom-location confirmation at create-time, restore evidence, and remaining residency questions remain outstanding.

---

## 10. Remaining residency questions (not closed)

From H-159; **not** resolved by this backup-location decision:

- Cloud SQL PITR geography
- Cloud Logging regionalization (`global` `_Default`/`_Required` vs `africa-south1` buckets)
- Monitoring / query processing
- Artifact Registry location
- Secret Manager location (ADR-0012 remains **proposed — blocked for UAT and Production**)
- Cloud KMS location
- Support / control-plane geography
- Subprocessors
- DPA (REQUIRES OWNER/LEGAL REVIEW; none claimed)
- Assured Workloads South Africa Data Boundary
- DR region / cross-region restore
- Cross-border support
- Cost (still REQUIRES CURRENT PROVIDER QUOTE/CALCULATOR INPUT)
- IAM
- IdP / MFA (ADR-0013 remains **proposed — blocked for Production**)

H-157 PDPC boundary is **preserved**: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim. PDPC work is **not** reopened.

ADR-0011 19:00 EAT backup **intent** remains an intent; Cloud SQL start time is UTC; mapping is not configured here.

---

## 11. Exact next action

```text
NEXT ACTION (not executed; H-161 not created):

Owner/POA decision on Cloud Logging residency for the selected
africa-south1 architecture:

  whether Production logs must be stored in africa-south1 log buckets
  (new regional buckets + sinks), rather than leaving project
  _Default / _Required buckets in the documented default global location.

Cursor cannot create log buckets. No GCP project exists.
PITR evidence and DR-region decisions remain open and are not
substituted as this next action.
```

---

## 12. Explicitly excluded (not performed)

```text
H-161: NOT CREATED
GCP project / Cloud SQL instance / Cloud Run service: NOT CREATED
backup configuration applied: NO
credentials / secrets / DNS: NONE
Production deployment / live migration / migration 126: NONE
application / schema / infrastructure: UNCHANGED
H-154–H-159 overwritten: NO
commit / push: NONE
```

---

## 13. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 654 → 655 |
| Files changed | `docs/governance/h-160-cloud-sql-backup-residency-owner-decision.md` only |
| Cloud resources created | **NONE** |
| Backup configuration applied | **NO** |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
PROCESS STOPPED AFTER H-160
```
