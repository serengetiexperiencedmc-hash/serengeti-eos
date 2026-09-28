# H-163 — POA Decision: Cloud SQL Regional High Availability

> **GOVERNANCE / DECISION CAPTURE ONLY**  
> Records the Owner/POA requirement that Production EOS Cloud SQL PostgreSQL shall use **regional High Availability (HA)** within `africa-south1` (Johannesburg), subject to confirmation during implementation that the selected Cloud SQL configuration supports the required HA architecture.  
> **NOT** authorization to deploy or configure GCP. **NOT** a Cloud SQL instance. **NOT** HA enablement, a standby instance, failover testing, or cross-region DR.  
> H-154 through H-162, historical ADR-0006, historical DP-0006, ADR-0012, and ADR-0013 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 657  
**Porcelain after this increment:** 658 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP project / Cloud SQL / HA / standby / replica / backup / PITR / logging / Cloud Run configuration applied:** **NONE**  
**Credentials / secrets / DNS / IAM / KMS:** **NONE**  
**Provider contract accepted:** **NO**  
**Commit / push:** **NONE**  
**H-164:** **NOT CREATED**

```text
H-163 STATUS = COMPLETE — REGIONAL HA DIRECTION RECORDED, NOT CONFIGURED
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
| Porcelain at start | 657 (matches H-162 after-count) |
| Prior increment | H-162 created only `docs/governance/h-162-cloud-sql-pitr-residency-owner-decision.md` |
| GCP resources | **NONE** |
| Production | **NOT AUTHORIZED / NOT READY** |

Records read and **not rewritten:** H-154, H-157, H-158, H-159, H-160, H-161, H-162; historical ADR-0006 / DP-0006; ADR-0012 (`proposed — blocked for UAT and Production`); ADR-0013 (`proposed — blocked for Production`).

H-159 recorded Cloud SQL HA vs zonal as **not selected** and as a requirement that affects RTO **inside Johannesburg**, not cross-region DR. This increment records the Owner selection of **regional HA** only.

---

## 2. POA authority

The Owner/Principal is exercising POA. This increment captures a **design decision only**. It does **not** prove that Google Cloud supports the requested HA configuration for the eventual edition, and it does **not** configure HA.

---

## 3. Owner HA decision

> Production EOS Cloud SQL PostgreSQL shall use the regional High Availability (HA) configuration within `africa-south1`, subject to confirmation during implementation that the selected Cloud SQL configuration supports the required HA architecture.

```text
CLOUD SQL HA (POA):
Regional High Availability within africa-south1.

Primary region remains africa-south1.
HA is across zones within Johannesburg.
This addresses zonal / infrastructure failure within the primary region.
```

This increment does **not** state that HA has been configured, that a standby exists, or that failover has been tested.

---

## 4. Intended Production database architecture

| Component | Owner direction | Implementation |
| --- | --- | --- |
| Cloud Run | `africa-south1` (H-158) | OPEN |
| Cloud SQL PostgreSQL | `africa-south1` (H-158) | OPEN |
| Cloud SQL HA | regional HA within `africa-south1` (this increment) | OPEN |
| Standard backups | custom `africa-south1` (H-160) | OPEN |
| PITR transaction-log storage | intended `africa-south1`, subject to evidence (H-162) | OPEN |
| Cloud Logging storage | `africa-south1` (H-161) | OPEN |
| Cross-region DR | **OPEN** — separate Owner decision | OPEN |

None of these is implementation-complete. Cloud SQL edition remains **OPEN** (see §11).

---

## 5. HA versus DR distinction

H-163 **must not** collapse regional HA and cross-region disaster recovery into one control.

### Regional HA (selected here)

Purpose:

- resilience against a zonal failure or certain infrastructure failures;
- primary and standby within the same selected region;
- primary region remains `africa-south1`.

### Cross-region DR (not selected here)

Purpose:

- recovery when the entire primary region becomes unavailable;
- requires a separate recovery architecture;
- may involve cross-region replication, backup/restore, or another supported mechanism;
- requires a **separate Owner decision**.

```text
H-163 selects regional HA within africa-south1;
it does NOT select cross-region DR.
```

A Johannesburg regional outage does **not** automatically authorize restoration of SEDMC Production data into another geographic region. Regional HA does **not** substitute for a DR architecture.

---

## 6. H-160 continuity

H-160 is **preserved unchanged** and remains authoritative for backup residency.

H-160: Production Cloud SQL **standard backups** must use custom `africa-south1`. Default nearest-multi-region backup storage is **not accepted**. H-160 implementation/evidence remains **OPEN**.

This increment does **not** state that backups are configured.

---

## 7. H-161 continuity

H-161 is **preserved unchanged** and remains authoritative for Cloud Logging storage.

H-161: Production EOS Cloud Logging **storage** → `africa-south1`. Default/global storage is not accepted. Implementation and evidence remain **OPEN**. Broader logging / Monitoring / control-plane / query / export residency questions remain **OPEN**. H-163 does **not** imply those questions are resolved.

This increment does **not** state that logging is configured.

H-157 PDPC boundary remains: EOS is a non-personal commercial system; EOS-specific PDPC registration is not being pursued; wider SEDMC PDPC remains separate; no exemption or compliance claim.

---

## 8. H-162 continuity

H-162 is **preserved unchanged** and remains authoritative for PITR direction.

H-162: Production PITR transaction-log storage is **intended** to remain in `africa-south1`, where supported, subject to provider/implementation confirmation. Actual PITR storage remains **unestablished**. H-162 implementation/evidence remains **OPEN**.

This increment does **not** claim PITR is configured.

Standard backup residency, PITR transaction-log residency, and regional HA are related but are **not** automatically identical configuration questions.

---

## 9. Implementation / evidence requirements

```text
HA direction:        selected
HA implementation:   not configured
HA evidence:         not available
Actual standby:      does not exist as a result of H-163
Failover test:       not performed
Production database: does not exist as a result of H-163
```

The later implementation stage must establish (do **not** invent answers now):

- selected Cloud SQL edition;
- regional HA support for that edition;
- primary/standby zone arrangement;
- network architecture;
- private connectivity;
- failover behaviour;
- maintenance behaviour;
- application connection behaviour;
- backup / PITR interaction;
- monitoring;
- operational ownership;
- failover testing.

```text
Owner direction ≠ configured HA
Owner direction ≠ standby instance
Owner direction ≠ tested failover
Owner direction ≠ regional DR
```

---

## 10. Cloud SQL edition decision remains open

H-163 does **not** select:

- Enterprise;
- Enterprise Plus;
- any other Cloud SQL edition.

The edition decision remains **OPEN** because later DR requirements may affect the appropriate feature set. Advanced DR is **not** assumed and is **not** selected merely because regional DR remains open.

This increment does **not** make a pricing decision, a cost assumption, or invent an RTO or RPO.

---

## 11. Cross-region DR remains open

```text
DR STATUS: OPEN — separate Owner decision required
```

H-163 does **not** select:

- a DR country;
- a DR region;
- a cross-region replica;
- cross-region backup/restore as the selected DR architecture;
- automatic cross-region failover;
- manual cross-region failover.

Cross-region restoration is **not** authorized. Regional disaster recovery has **not** been designed or tested.

The existing H-160 / H-161 / H-162 position remains:

> A Johannesburg regional outage does not automatically authorize restore into another region.

---

## 12. Production blocker reconciliation

H-154’s 28-blocker inventory remains authoritative. The inventory has **no separate HA line**. H-163 is recorded as an **additive Owner direction** under the database / availability architecture (items 2–4), with implementation and evidence still **OPEN**. It does **not** invent a new blocker number and does **not** close item 24 (rollback / DR).

> **Cloud SQL regional HA direction selected — `africa-south1`; implementation and evidence OPEN.**

| # | Gate | After H-163 |
| ---: | --- | --- |
| 1 | Production authorization | **OPEN** — NOT GRANTED |
| 2–4 | Hosting / ADR-0006 / DP-0006 | Direction selected; **not fully closed**. Additive: regional Cloud SQL HA within `africa-south1`; **implementation/evidence OPEN**. |
| 5–13 | Catalog, migrate, secrets, IdP, MFA, HTTPS, DNS, DB TLS, CORS | **OPEN** |
| 14 | Backup | H-160 custom `africa-south1` direction; **implementation/evidence OPEN** |
| 15 | Restore / PITR evidence | **OPEN**. H-162 intended PITR `africa-south1`; provider evidence and configuration OPEN. Restore drill still absent. |
| 16–21 | Ops, on-call, legal/privacy, NATS, email, supervision | **OPEN**. HA direction does **not** close operations ownership or failover runbooks. |
| 22 | Observability / logging | H-161 `africa-south1` log-storage direction; **implementation/evidence OPEN** |
| 23 | Production-like start | **OPEN** |
| **24** | Rollback / DR | **OPEN** — HA is not DR; cross-region DR not selected; not designed; not authorized |
| 25–26 | SoR / access model | **OPEN** |
| 27 | Current-code UAT | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | EI-01 | **CLOSED BY OWNER ACCEPTANCE** |

The HA-related Production gate is **not** fully closed. Production is **not** marked READY.

---

## 13. ADR-0006 reconciliation

Historical `docs/adr/ADR-0006-hosting-and-residency.md` is **not overwritten**.

```text
ADR-0006 = SELECTED DIRECTION — NOT FULLY CLOSED FOR PRODUCTION

Cloud Run:                         africa-south1
Cloud SQL PostgreSQL:              africa-south1
Cloud SQL HA:                      regional HA within africa-south1
Standard backups:                  custom africa-south1
PITR transaction-log storage:      intended africa-south1, subject to provider evidence
Cloud Logging storage:             africa-south1
Cross-region DR:                   OPEN
```

---

## 14. DP-0006 reconciliation

Historical `docs/decisions/DP-0006-hosting-data-residency.md` is **not overwritten**.

```text
DP-0006 = SELECTED — PENDING PRODUCTION IMPLEMENTATION / PROVIDER EVIDENCE
```

Provider implementation has **not** occurred. Regional HA direction is additive; it is **not** completed availability evidence and **not** a DR design.

ADR-0012 and ADR-0013 remain OPEN as previously recorded.

---

## 15. No-implementation / no-GCP-resource / Production status statements

```text
No GCP resources were created.
HA is not configured.
No Cloud SQL instance was created.
No standby instance was created.
No cross-region replica was created.
No backup, PITR, logging, networking, IAM, or KMS configuration was applied.
Production remains NOT AUTHORIZED / NOT READY.
```

Application code unchanged. Database schema unchanged. Migration 126 not created. Live migration not run. No credentials used. No DNS change. No Production deployment.

---

## 16. Future evidence requirements (not executed)

Do **not** begin H-164 in this increment. Later implementation/evidence (without preference implied as authorization) must still establish:

- Cloud SQL edition selection (remains OPEN);
- regional HA support for that edition;
- primary/standby zone arrangement;
- network architecture and private connectivity;
- failover and maintenance behaviour;
- application connection behaviour during failover;
- backup / PITR interaction with HA;
- monitoring and operational ownership;
- failover testing;
- Artifact Registry location;
- Secret Manager / Cloud KMS location (ADR-0012 still OPEN);
- DR / restore-to-another-region Owner decision (item 24);
- DPA / subprocessors / Legal review;
- Production authorization grant (only after evidence, not now).

None of these is performed here.

---

## 17. Repository safety

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 657 → 658 |
| Files changed this increment | `docs/governance/h-163-cloud-sql-regional-ha-owner-decision.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-163
H-164 NOT CREATED
```
