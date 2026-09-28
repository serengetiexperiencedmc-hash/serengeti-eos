# H-182 companion — Production DR implementation package (not implemented)

> **PREPARATION ONLY.** Selected architecture: H-169.  
> **NOT implemented. NOT Production. NOT a DR test. NOT a replica. NOT measured RTO/RPO.**  
> Placeholders must not be filled with invented IDs, secrets, DNS names, or prices.

**Date:** 2026-09-22. **Parent:** H-182. **Architecture:** H-169.

```text
PACKAGE STATUS = PREPARED — NOT IMPLEMENTED
Primary: africa-south1 (Johannesburg)
Secondary: europe-west1 (Belgium)
Edition: Cloud SQL Enterprise Plus
Mechanism: Advanced DR + designated DR replica
Pairing: N2 series (values not selected)
RTO ≤ 4h / RPO ≤ 1h = BUSINESS REQUIREMENTS, not measurements
Application DR: active-passive direction
Cloud SQL failover ≠ EOS application failover
```

---

## 1. Prerequisites (must exist before any create)

| # | Prerequisite | Source | Status now |
| --- | --- | --- | --- |
| 1 | Written Production implementation grant | H-171 §5; P01 | **ABSENT** |
| 2 | GCP project + billing (not invented IDs) | P02 | **ABSENT** |
| 3 | Belgium legal/contract acceptance or recorded refusal | P11; H-181 D12 informational only | **OPEN** |
| 4 | Commercial approval of attributable cost | P12; H-181 D13 informational only | **OPEN** |
| 5 | Named HUM-08 RACI | P13 | **UNASSIGNED** |
| 6 | PostgreSQL Production version after compatibility evidence | P03 | **NOT SELECTED** |
| 7 | Sizing values after workload evidence | P04 | **NOT SELECTED** |
| 8 | PSA or PSC named | P05 | **NOT SELECTED** |
| 9 | Encryption direction (Google-managed vs CMEK) | P06 | **NOT SELECTED** |
| 10 | Secrets platform (ADR-0012) | P07 | **OPEN** |
| 11 | Separate DR-test grant | P19 | **NOT GRANTED** |

Do **not** create Cloud SQL, a replica, or Cloud Run until 1–4 (at minimum) and an explicit implementation increment exist.

---

## 2. Required Cloud SQL configuration (target, not applied)

- Primary instance region: `africa-south1`.
- Edition: Enterprise Plus.
- Machine series: N2 (vCPU/memory/storage: **TBD** from EV-T04/EV-T05).
- PostgreSQL version: **TBD** from EV-T01–EV-T03. Dev 16-class is **not** the Production lock.
- Private IP required for documented write endpoint. PSA vs PSC: **TBD**.
- Regional HA within `africa-south1` per H-163 **direction**.
- Custom backup location `africa-south1` per H-160 **direction**.
- PITR intended in `africa-south1` per H-162 **direction**, subject to provider evidence.
- Encryption: Google-managed or CMEK — **TBD** (H-159: CMEK not mandatory).
- Database TLS `require` in production-like env (existing fail-closed contract).
- Enhanced backups vs DR replica incompatibility: follow current provider docs at create time; do not assume both.

---

## 3. Networking (target, not built)

- VPC / private path in `africa-south1` and DR path to `europe-west1`.
- Cloud Run → Cloud SQL connectivity on the named PSA or PSC path.
- No DNS records until `[PRODUCTION DNS NAME TO BE DETERMINED]` is Owner-set.
- Write endpoint: use only where Plus + private IP conditions are met (H-169).

---

## 4. Security (target, not configured)

- Secrets not in git or images (standing rule).
- Secret Manager / KMS locations intended `africa-south1` if that product is later selected (H-159 candidate, not ADR-0012 close).
- IAM least privilege; break-glass **roles** only until HUM-08 names exist.
- No Production credentials in this repository.

---

## 5. Backup / PITR / HA (direction vs applied)

| Topic | Direction | Applied |
| --- | --- | --- |
| Backup location | `africa-south1` (H-160) | **NOT APPLIED** |
| PITR | Intended `africa-south1` (H-162) | **NOT APPLIED** |
| Regional HA | Within `africa-south1` (H-163) | **NOT APPLIED** |
| Logging bucket | `africa-south1` (H-161) | **NOT APPLIED** |

Replica: billed as standalone; backups typically not configured on replica until promotion (provider docs). Do not invent retention days.

---

## 6. DR replica (target, not created)

- Designated DR replica in `europe-west1`.
- Advanced DR designation after instance exists.
- Cross-region replication **after** P11 legal acceptance (or recorded refusal that changes architecture).
- Monitoring of replica lag vs RPO **requirement** (1 hour) — measurement only after authorized test.

---

## 7. Application failover handling (active-passive)

Cloud SQL failover **does not** restore EOS. Prepare (not deploy):

- Passive Cloud Run service **design** in `europe-west1` (artefact, config, secrets availability).
- Connection-string / write-endpoint handling.
- Auth, events, email transport, logging in the DR path.
- Operator steps distinct from database promote/failover.

---

## 8. Procedures to execute only after later grants

1. **Failover** — declared outage or approved test start → DB promote/failover per provider Advanced DR → app endpoint/config cutover → validation (H-182 validation procedure).
2. **Application recovery** — start/reuse passive Cloud Run; confirm auth and dependencies.
3. **Validation** — see companion validation procedure.
4. **Switchback** — only when both sides healthy; prefer documented switchover (zero-loss path when both healthy) over disaster failover.
5. **Rollback** — abort test; restore primary as writer; revert app routing; capture evidence of abort.
6. **Evidence capture** — timestamps, operator, request IDs, logs; store under a later evidence folder. **No values invented here.**

---

## 9. Monitoring and alerting (target)

- Replica lag, instance health, backup job success, Cloud Run availability in both regions.
- Alert routing: HUM-08 owners **when named**. No invented on-call roster.

---

## 10. Explicit non-claims

```text
No GCP resource was created.
No DR replica exists.
No failover was performed.
Measured RTO = NOT AVAILABLE
Measured RPO = NOT AVAILABLE
```
