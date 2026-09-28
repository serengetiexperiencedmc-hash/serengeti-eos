# H-158 — POA Hosting and Residency Decision: Google Cloud Johannesburg

> **GOVERNANCE / DIRECTION ONLY**  
> Records the Owner/POA selection of Google Cloud Platform in Johannesburg (`africa-south1`) as the current SEDMC Production hosting/residency **direction**.  
> **NOT** Production authorization. **NOT** a Google Cloud contract. **NOT** a GCP project or resource. **NOT** credentials, DNS, TLS, databases, or migrations. **NOT** legal compliance.  
> Historical files `docs/adr/ADR-0006-hosting-and-residency.md` and `docs/decisions/DP-0006-hosting-data-residency.md` were **inspected and not modified**. H-147 through H-157 were **not overwritten**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved — no reset, clean, stash, revert, discard, or overwrite)  
**Porcelain at start of this increment:** 652  
**Porcelain after this increment:** 653 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP account / project / resource actions:** **NONE**  
**Commit / push:** **NONE**  
**H-159:** **NOT CREATED**

```text
H-158 STATUS = COMPLETE — POA HOSTING DIRECTION RECORDED, NOT DEPLOYED
ADR-0006 = POA SELECTED — GCP JOHANNESBURG (pending implementation / provider evidence)
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. POA decision

The Owner has exercised POA and made the following hosting/residency decision in the company’s best interests.

```text
SELECTED PRODUCTION HOSTING DIRECTION (POA):
Google Cloud Platform (GCP)
  Application runtime: Google Cloud Run
  Database:            Google Cloud SQL for PostgreSQL
  Primary region:      Johannesburg, South Africa (africa-south1)

This is DIRECTION under POA.
It is NOT Production authorization.
```

This record is the **current** additive governance state for ADR-0006 / DP-0006. It does **not** rewrite the 2026-08-21 ADR/DP files (those remain historical: ADR-0006 `proposed — blocked for Production`; DP-0006 `OPEN` with recommended option *Not selected*).

It also records that the previously unselected tension between H-125 OA-09 (managed-cloud **direction**) and E1-C (SEDMC-owned Tanzanian facility as **preferred future primary target**, cloud as optional contingency) is **resolved for current Production direction** by this POA selection of GCP Johannesburg. E1-C files are **not** rewritten. No servers are purchased. No facility is contracted.

---

## 2. Selected topology (authorized services only)

No services are added beyond those named in this POA decision.

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

| Element | Selection |
| --- | --- |
| Provider | Google Cloud Platform (GCP) |
| Application platform | Google Cloud Run |
| Database platform | Google Cloud SQL for PostgreSQL |
| Primary Production region | Johannesburg, South Africa |
| GCP region code | `africa-south1` |

**Residency objective:** Production application and PostgreSQL resources should be deployed in `africa-south1` wherever the selected GCP services support regional placement.

This is an **architectural residency objective**. It does **not** prove that all Google Cloud processing, backups, logs, support, or subprocessors occur in Johannesburg or South Africa.

---

## 3. Important limitations (do not infer)

This increment does **not** state or imply:

- that SEDMC has already contracted Google Cloud;
- that a GCP account or project exists;
- that Production resources exist;
- that Production data exists;
- that Production is deployed;
- that all Google Cloud processing occurs in Johannesburg;
- that all backups are necessarily confined to Johannesburg;
- that all support operations or subprocessors are confined to South Africa;
- that the architecture is legally compliant;
- that the hosting decision closes all privacy/legal requirements;
- that NATS, email, observability, KMS, IdP, DNS, or backup products are selected (they are **not** selected here).

---

## 4. Verified provider facts (feasibility only)

Recorded as **background feasibility evidence** from the Owner/POA grant. **Not** Production deployment evidence. **Not** a live probe of Google APIs in this increment.

| Fact | Record |
| --- | --- |
| Cloud Run supports Johannesburg | `africa-south1` |
| Cloud SQL for PostgreSQL supports Johannesburg | `africa-south1` |
| Cloud SQL Admin API documents a regional endpoint | `africa-south1` |

These facts support **feasibility** of the selected regional architecture. Additional capabilities (backup geography, log geography, organization policies, DR, SLA, pricing) are **not** inferred.

---

## 5. Unverified / pending provider facts

| Item | Status |
| --- | --- |
| Actual GCP project / account ownership | **NOT CREATED** / not verified |
| Contractual acceptance with Google | **NOT COMPLETED** |
| Service-specific data-location verification (beyond regional placement support) | **PENDING** |
| Backup-location verification | **PENDING** |
| Logging / observability location | **PENDING** |
| Subprocessors / DPA review | **NOT COMPLETED** |
| Security configuration | **NOT IMPLEMENTED** |
| Production credentials / IAM / secrets / KMS | **NOT CREATED** |
| Network controls / TLS | **NOT CONFIGURED** |
| Backup and restore configuration and evidence | **NOT CONFIGURED** / **NOT AVAILABLE** |
| Operational ownership for this topology | **NOT IMPLEMENTED** (HUM-08 still partial) |
| Cost approval | **NOT RECORDED** |
| Production deployment authorization | **NOT GRANTED** |

---

## 6. ADR-0006 disposition

**Historical file** (`docs/adr/ADR-0006-hosting-and-residency.md`): left unchanged (`proposed — blocked for Production`; “No Production hosting choice is made here”).

**Current additive disposition (this record):**

```text
ADR-0006 direction = POA SELECTED — GCP Johannesburg
```

Not fully closed. Remaining: provider evidence pack, contractual terms, service-specific residency verification, and a later Production authorization grant. Terraform/K8s/Cloud Run/Cloud SQL must **not** be locked as live Production by this record.

---

## 7. DP-0006 disposition

**Historical file** (`docs/decisions/DP-0006-hosting-data-residency.md`): left unchanged (`OPEN`; recommended option *Not selected*; options A–D listed).

**Current additive disposition (this record):**

```text
DP-0006 = POA SELECTED DIRECTION — GCP Johannesburg
         = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

This maps, as Owner/POA direction, onto DP-0006 Option A (African public-cloud region) with a **named** vendor (GCP) and **named** region (`africa-south1`). It is **not** Option B (EU), C (hybrid as the selected primary), or D (Tanzanian/Kenyan colo) as the current Production direction.

DP-0006 is **not** marked fully closed. Owner direction alone does not complete contractual, residency-evidence, backup-location, DPA, or implementation gates. The DP-0006 rule “Do not lock this decision by implementing Production Terraform/K8s against a chosen cloud” remains in force: **no implementation in this increment**.

Outstanding (non-exhaustive): GCP project/account ownership; contractual acceptance; service-specific data-location, backup-location, and logging-location verification; subprocessors/DPA if applicable; security configuration; Production credentials; IAM; secrets/KMS; network controls; TLS; backup and restore; operational ownership; cost approval; Production deployment authorization.

---

## 8. Hosting / residency evidence register

| Item | Status |
| --- | --- |
| GCP selected | **POA CONFIRMED** |
| Cloud Run available in Johannesburg | **CONFIRMED** (feasibility fact; not a deployed service) |
| Cloud SQL PostgreSQL available in Johannesburg | **CONFIRMED** (feasibility fact; not a deployed instance) |
| Primary application region | `africa-south1` |
| Primary DB region | `africa-south1` |
| Production GCP project | **NOT CREATED** |
| Production DB | **NOT CREATED** |
| Production credentials | **NOT CREATED** |
| Production secrets | **NOT CREATED** |
| DNS | **NOT CONFIGURED** |
| HTTPS | **NOT CONFIGURED** |
| Backup configuration | **NOT CONFIGURED** |
| Restore evidence | **NOT AVAILABLE** |
| IAM / access model | **NOT IMPLEMENTED** |
| Provider contract / DPA review | **NOT COMPLETED** |
| Service-specific residency review | **PENDING** |
| Production authorization | **NOT GRANTED** |

---

## 9. Residency questions that remain open

Do **not** answer by inference. Later Production-readiness evidence must address:

1. Where are Cloud Run control-plane and operational metadata processed?
2. Where are Cloud Run logs stored?
3. Where are Cloud SQL automated backups stored?
4. Where are point-in-time recovery artefacts stored?
5. Where are monitoring/observability data stored?
6. Where are security/audit logs stored?
7. What Google Cloud subprocessors are applicable?
8. What contractual / data-processing terms apply?
9. Are any support or administrative operations performed outside South Africa?
10. Can required Production resources be restricted to `africa-south1` through organization policy?
11. Can Production backups be constrained to an approved geographic boundary?
12. What cross-region disaster-recovery design would be required?
13. What would happen to residency if Johannesburg becomes unavailable?
14. What contractual or legal implications follow from the selected architecture?

ADR-0011’s 19:00 EAT backup intent remains an **intent**, not a configured GCP backup product.

---

## 10. Production blocker reconciliation (H-154 inventory)

Named inventory remains **28** rows. H-157 did not close items 1–26. This action changes **only** the *direction* status of hosting/ADR/DP items. It does **not** close them as Production-ready.

| # | Gate | After H-158 |
| ---: | --- | --- |
| 1 | Production authorization grant | **OPEN** — **NOT GRANTED** |
| 2 | Hosting/provider/region | **POA SELECTED DIRECTION** — GCP / Cloud Run / Cloud SQL / `africa-south1`. **Not closed.** Project, contract, and resources still absent |
| 3 | ADR-0006 formal approval | **POA SELECTED — GCP Johannesburg** (additive). Historical ADR file unchanged. **Not fully closed** |
| 4 | DP-0006 named option | **SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE**. **Not fully closed** |
| 5 | Production database/catalog | **OPEN** — not created; existing Dev/UAT catalogs are not Production |
| 6 | Authorized Production schema migrate | **OPEN** — Gate C still blocked on real catalog; migration 126 not created |
| 7 | Secrets/KMS (ADR-0012) | **OPEN** — product still unselected |
| 8 | Identity provider (ADR-0013) | **OPEN** |
| 9 | MFA at IdP | **OPEN** |
| 10 | HTTPS | **OPEN** |
| 11 | DNS | **OPEN** |
| 12 | Database TLS on a real Production DB | **OPEN** |
| 13 | Production CORS origins | **OPEN** |
| 14 | Backup product | **OPEN** |
| 15 | Restore evidence of Production state | **OPEN** |
| 16 | Operations ownership (HUM-08) | **OPEN** / partial Owner-attested titles only |
| 17 | On-call roster | **OPEN** |
| 18 | E1-C legal/privacy (PDPC, DPO combined, DPAs) | **OPEN** — see §11. GCP selection does **not** complete DPAs |
| 19 | Production event transport (NATS) | **OPEN** — not selected here |
| 20 | Production email product + DPA | **OPEN** — not selected here |
| 21 | Process supervision | **OPEN** |
| 22 | Observability sink + alerting | **OPEN** |
| 23 | Production-like start on real config | **OPEN** |
| 24 | Rollback/DR on Production topology | **OPEN** — DR geography unanswered (§9 Q12–Q13) |
| 25 | SoR / adoption | **OPEN** — H-81 **NOT STARTED** |
| 26 | Production security/access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** (H-153) |
| 28 | EI-01 TIN identity | **CLOSED BY OWNER ACCEPTANCE** (H-155; not TRA-verified) |

Items **1** and **5–26** remain independently governed and **OPEN**. Do not treat provider selection as Production authorization.

**OPEN Production blockers: 26 of 28 named items** still require work (1–26). Item 2–4 are direction-selected but **not closed**.

---

## 11. PDPC boundary (H-157 preserved)

H-157 is **not** reopened or rewritten.

```text
EOS is a non-personal-data commercial system by design.
EOS-specific PDPC registration is not currently being pursued because EOS exists.
Wider SEDMC PDPC remains separately tracked and OPEN.
```

GCP selection does **not**:

- reopen an EOS-specific PDPC registration workflow;
- claim PDPC exemption (EOS or company-wide);
- claim legal compliance;
- claim completed registration.

Vendor DPAs (EI-16 / blocker 18) remain **blocked on contractual/provider evidence** and are now **applicable to the selected GCP direction** but **not completed**.

---

## 12. Security / operations dependencies

Still required after this direction, and **not** performed here:

- GCP organization / folder / project IAM;
- secrets / KMS (ADR-0012 still OPEN);
- network (VPC, ingress, Cloud SQL connectivity, DB TLS);
- Cloud Run service identity and scaling policy;
- Cloud SQL instance, flags, maintenance, TLS `require`;
- backup schedule and restore drill;
- logging and observability sinks (location unanswered);
- DNS and HTTPS;
- Production access model (IdP/MFA still OPEN — ADR-0013);
- HUM-08 named specialists and on-call for this topology;
- process supervision of the Cloud Run revision (compiled process contract still applies).

---

## 13. Cost / contract dependency

No cost is invented. No SKU, quote, or committed spend is recorded.

Required before Production authorization, and **not** done here:

- Owner/finance cost approval for the selected services in `africa-south1`;
- contractual acceptance of Google Cloud terms;
- data-processing / DPA review if applicable;
- exit strategy notes required by DP-0006 (export, portability, DNS cutover) still outstanding.

---

## 14. Production is not authorized

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
productionReady = false
H-81 = NOT STARTED
Commercial SoR = Office / Excel / Outlook-Gmail / WhatsApp / phone
Migration 126 = NOT CREATED
Production migration = NOT AUTHORIZED
Current migration worktree = 125
```

Existing catalogs (`eos`, `eos_h112_full`, `eos_h117_uat`, `eos_h149_uat`, `eos_h152_uat`, `eos_gateb`) **are not Production** and **must not** be migrated onto GCP as a substitute for a new Production catalog.

---

## 15. Exact next action

```text
NEXT ACTION (not executed in H-158):
Prepare a provider-specific Production architecture / evidence pack for
GCP africa-south1, covering:

  GCP project/account ownership;
  service configuration;
  IAM;
  KMS/secrets;
  network;
  Cloud Run;
  Cloud SQL;
  backup;
  restore;
  logging;
  observability;
  DNS/TLS;
  service-specific residency (questions §9);
  provider contractual/DPA terms;
  cost;
  operational ownership.

Do not create GCP resources in that pack until a later explicit
implementation / Production authorization says so.
```

H-159 is **not** created in this increment.

---

## 16. Explicitly excluded (not performed)

```text
H-159: NOT CREATED
GCP project / Cloud Run / Cloud SQL: NOT CREATED
credentials / secrets / KMS: NOT CREATED
DNS / TLS: NOT CONFIGURED
Production database / live migration / migration 126: NONE
application / schema / infrastructure code: UNCHANGED
ADR-0006 / DP-0006 historical files: NOT OVERWRITTEN
H-147–H-157: NOT OVERWRITTEN
commit / push: NONE
```

---

## 17. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 652 → 653 |
| Files changed | `docs/governance/h-158-poa-hosting-and-residency-decision.md` only |
| Application / schema / infrastructure | **NONE** |
| External provider account action | **NONE** |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-158
```
