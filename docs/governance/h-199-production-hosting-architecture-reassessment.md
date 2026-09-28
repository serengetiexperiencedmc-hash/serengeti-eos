# H-199 — Production Hosting Architecture Reassessment

> **GOVERNANCE AND ARCHITECTURE REASSESSMENT ONLY.**  
> Compares SEDMC-controlled / self-managed infrastructure (Option A) with the previously selected Google Cloud architecture (Option B).  
> **This assessment does not select a Production hosting provider and does not authorize Production implementation.**  
> It does **not** claim either architecture is Production-ready.  
> H-154 through H-198 were inspected and **not rewritten**. The H-198 Google Cloud submission remains **unsent**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 717 (H-198 start 715; H-198 final 717)

```text
H-199 STATUS = COMPLETE — REASSESSMENT ONLY; NO PROVIDER SELECTED
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
productionReady = false
H-81 = NOT STARTED
GOOGLE CLOUD FORM SUBMITTED = NO
H-198 SUBMISSION = UNSENT
DR TEST = NOT PERFORMED
GCP RESOURCES CREATED = NONE
SEDMC PRODUCTION SERVERS = NOT IN PLACE (repository evidence)
```

---

## 1. Purpose and non-selection

The Owner/POA asked whether Google Cloud remains necessary, or whether SEDMC-controlled infrastructure can satisfy EOS Production requirements.

H-199 answers with **evidence status**, **requirement burden**, and a **decision framework**. It does **not**:

* select Option A or Option B;
* submit H-198;
* contact Google Cloud;
* purchase, provision, or deploy anything;
* invent server specifications, capacity, uptime, pricing, SLA, or DR capability.

GCP is **not** treated as mandatory merely because H-158/H-169 selected it as current **direction**. That direction remains **historical selected architecture**, not implemented infrastructure.

---

## 2. Baseline

| Item | Observed |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | **717** |
| Dirty worktree | **preserved** |
| H-198 | Package **COMPLETE**; form **NOT SUBMITTED** |
| Commercial SoR | Office / Excel / Outlook-Gmail / WhatsApp / phone (unchanged) |
| EOS Production-deployed | **NO** |

---

## 3. What “our servers” actually means (inventory)

Repository search covered E1-C SEDMC-owned direction, capacity/facility assessment, H-154–H-198, ADRs, and Dev/Test records.

**Finding:** the repository contains **no meaningful evidence of existing SEDMC Production-class infrastructure**. E1-C records an **intention** to build owned servers, not an inventory of commissioned servers.

| Item | Status | Source |
| --- | --- | --- |
| Physical / dedicated Production servers | **NOT FOUND** — recorded **NOT IN PLACE** | `adr-0006-e1-c-sedmc-owned-infrastructure-direction.md` §B |
| Server specifications / BOM | **NOT FOUND** — hardware **NOT SELECTED** | E1-C direction §B; capacity results: no hardware BOM |
| VPS / dedicated hosted servers | **NOT FOUND** | No contract or inventory |
| Data-centre / Tanzanian facility | **NOT FOUND** — **PREFERRED FUTURE LOCATION — not selected, not contracted** | E1-C direction §B |
| Hosting / colocation contract | **NOT FOUND** — **NOT SELECTED / NOT AUTHORIZED** | E1-C direction §B, §F |
| Virtualization platform | **NOT FOUND** | — |
| Production PostgreSQL hosting | **NOT FOUND** | Capacity results: PG families **BLOCKED**; local compose is **DEV/TEST ONLY** |
| Backup infrastructure | **NOT FOUND** | BKP-01–BKP-08 **BLOCKED / EVIDENCE REQUIRED** |
| NAS/SAN | **NOT FOUND** | — |
| Object storage (Production) | **NOT FOUND** | LocalFs = Dev/Test only (H-194 rejects local-fs for Production) |
| Network / firewall / VPN / public IP | **NOT FOUND** as Production design | NET-01–NET-09 **EVIDENCE REQUIRED**; Dev/Test localhost only |
| Production DNS / TLS | **NOT FOUND** | Hostname **OPEN** (D194-12); no Production certs |
| Monitoring / alerting (Production) | **NOT FOUND** | — |
| Disaster recovery / secondary site | **NOT FOUND** | Technical RTO/RPO **NOT DEMONSTRATED** |
| Off-site backups | **NOT FOUND** | — |
| Support / operations personnel (HUM-08 specialists) | **NOT FOUND** as appointments | D194-13–16 **NOT YET APPOINTED**; **HUM-08 APPOINTMENT REQUIRED** |
| Infrastructure ownership (Production) | **UNKNOWN** as commissioned plant | Intention recorded; assets **NOT IN PLACE** |
| Local development machine | **VERIFIED** as **DEV/TEST ONLY** | E1-C §C; not Production |
| Disposable / local PostgreSQL | **VERIFIED** as Dev/Test pattern | Not Production hosting |
| GCP Production resources | **VERIFIED ABSENT** | H-158–H-198: none created |

Do **not** infer that Production servers exist because the phrase “our servers” was used. That phrase maps to E1-C **preferred future direction**, not verified plant.

---

## 4. The two options (defined, not chosen)

### Option A — SEDMC-controlled / self-managed infrastructure

Interpreted to include, if later evidenced:

* SEDMC-owned physical infrastructure;
* SEDMC-controlled dedicated servers;
* SEDMC-controlled hosted servers;
* a managed data-centre environment operated on SEDMC’s behalf.

These are **distinct** from public-cloud managed services (Cloud Run, Cloud SQL). The repository does **not** show which of those models SEDMC actually has. Present state: **none of them exist as Production**.

### Option B — Previously selected Google Cloud architecture (not reinterpreted)

Historical selected **direction** (H-158, H-169, D194-02), **not implemented**:

* Primary: Google Cloud `africa-south1` / Johannesburg
* Application: Cloud Run
* Database: Cloud SQL for PostgreSQL
* DR: `europe-west1` / Belgium
* DR mechanism: Cloud SQL Enterprise Plus Advanced DR with designated DR replica
* Business requirements: RTO ≤ 4 hours; RPO ≤ 1 hour (H-166) — **not measured**

H-169 remains **selected historical direction, not implemented infrastructure**.

---

## 5. Requirement matrix

Classifications:

* `SATISFIED BY VERIFIED EVIDENCE`
* `CAN SATISFY — EVIDENCE REQUIRED`
* `PARTIALLY SATISFIABLE`
* `NOT CURRENTLY DEMONSTRATED`
* `UNKNOWN`
* `NOT SUITABLE`

| # | Requirement | Option A (SEDMC-controlled) | Option B (selected GCP direction) |
| --- | --- | --- | --- |
| 1 | Application hosting | **NOT CURRENTLY DEMONSTRATED** — no Production compute | **CAN SATISFY — EVIDENCE REQUIRED** — Cloud Run selected, **not deployed** |
| 2 | PostgreSQL compatibility | **CAN SATISFY — EVIDENCE REQUIRED** — portable URL/TLS port; no Production instance | **CAN SATISFY — EVIDENCE REQUIRED** — Plus compatibility pack unsent (H177-D03) |
| 3 | PostgreSQL durability | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — managed service direction; not provisioned |
| 4 | Database backups | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — H-160 direction; not applied |
| 5 | Point-in-time recovery | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — H-162 direction; not applied |
| 6 | Backup retention | **UNKNOWN** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 7 | Restore capability | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — no restore drill |
| 8 | Primary-site failure | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — regional HA direction (H-163); not configured |
| 9 | Regional/site disaster recovery | **NOT CURRENTLY DEMONSTRATED** — no second site | **CAN SATISFY — EVIDENCE REQUIRED** — H-169 Advanced DR; replica **not created**; DR test **NOT PERFORMED** |
| 10 | RTO ≤ 4 hours | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — requirement recorded; **not measured** |
| 11 | RPO ≤ 1 hour | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — requirement recorded; **not measured** |
| 12 | DR testing | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — P19 / H177-D15 not selected for outbound; H-81 **NOT STARTED** |
| 13 | Object/document storage | **NOT CURRENTLY DEMONSTRATED** — LocalFs **NOT SUITABLE** as Production (D194-06) | **CAN SATISFY — EVIDENCE REQUIRED** — managed object store **required**; product **OPEN** |
| 14 | Event transport / NATS | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — managed NATS **required**; vendor **OPEN** |
| 15 | Secrets management | **NOT CURRENTLY DEMONSTRATED** — ADR-0012 blocked | **CAN SATISFY — EVIDENCE REQUIRED** — managed secrets **required**; product **OPEN** |
| 16 | Encryption | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — Google-managed default direction (D194-05); not applied |
| 17 | TLS | **NOT CURRENTLY DEMONSTRATED** (Production) | **CAN SATISFY — EVIDENCE REQUIRED** — H-191 contracts exist; hostname **OPEN** |
| 18 | Identity provider | **NOT CURRENTLY DEMONSTRATED** — HUM-05 not established | **CAN SATISFY — EVIDENCE REQUIRED** — federated+MFA direction; Identity Platform **candidate**, not final |
| 19 | MFA | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — mandatory MFA direction; not implemented |
| 20 | IAM/access control | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 21 | Network security | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — PSA vs PSC **DEFERRED** (D194-10) |
| 22 | Public HTTPS endpoint | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — dedicated hostname **required**; FQDN **OPEN** |
| 23 | DNS | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 24 | Monitoring | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 25 | Logging | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — H-161 `africa-south1` direction; not applied |
| 26 | Alerting | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 27 | Process supervision | **PARTIALLY SATISFIABLE** conceptually; **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — Cloud Run operational model; not deployed |
| 28 | Patch management | **NOT CURRENTLY DEMONSTRATED** — SEDMC would own OS/DB patches | **CAN SATISFY — EVIDENCE REQUIRED** — platform-managed for Cloud SQL/Run; still needs owner process |
| 29 | Vulnerability management | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** |
| 30 | Capacity/scaling | **NOT CURRENTLY DEMONSTRATED** — CAP-GATE-01 **NOT COMPLETE** | **CAN SATISFY — EVIDENCE REQUIRED** — sizing **DEFERRED** (D194-11) |
| 31 | Availability | **NOT CURRENTLY DEMONSTRATED** | **CAN SATISFY — EVIDENCE REQUIRED** — not an SLA claim |
| 32 | Operational ownership | **NOT CURRENTLY DEMONSTRATED** — **HUM-08 APPOINTMENT REQUIRED** | **NOT CURRENTLY DEMONSTRATED** — same HUM-08 gap |
| 33 | 24/7 escalation/on-call | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — **NO DEDICATED NOC AT INITIAL LAUNCH**; on-call still required if business-critical (D194-17) |
| 34 | Backup operator | **HUM-08 APPOINTMENT REQUIRED** | **HUM-08 APPOINTMENT REQUIRED** |
| 35 | DR operator | **HUM-08 APPOINTMENT REQUIRED** | **HUM-08 APPOINTMENT REQUIRED** — DR Coordinator **NOT YET APPOINTED** |
| 36 | Incident response | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** |
| 37 | Vendor support | **UNKNOWN** | **CAN SATISFY — EVIDENCE REQUIRED** — GCP support **policy** not obtained (H177-D02 unsent) |
| 38 | Data residency | **UNKNOWN** — Tanzania preferred, **not selected**; legal incomplete | **PARTIALLY SATISFIABLE** — primary Johannesburg **direction**; Belgium DR **DEFERRED — LEGAL REVIEW** (D194-18) |
| 39 | Legal/privacy | **NOT CURRENTLY DEMONSTRATED** | **NOT CURRENTLY DEMONSTRATED** — D12 not outbound in H-198 |
| 40 | Procurement/commercial | **NOT CURRENTLY DEMONSTRATED** — procurement **NOT AUTHORIZED** (E1-C) | **NOT CURRENTLY DEMONSTRATED** — **NO PROCUREMENT COMMITMENT** (D194-19); H-198 unsent |
| 41 | Cost structure | **UNKNOWN** — **QUOTE / CALCULATOR INPUT REQUIRED** | **UNKNOWN** — **QUOTE / CALCULATOR INPUT REQUIRED** |
| 42 | Migration complexity | **UNKNOWN** until a target exists | **UNKNOWN** until implementation authorized |
| 43 | Operational complexity | **NOT CURRENTLY DEMONSTRATED** — self-managed burden is larger in principle; not a score | **CAN SATISFY — EVIDENCE REQUIRED** — platform ops remain; fewer OS/hardware tasks |
| 44 | Lock-in | **UNKNOWN** — facility/hardware lock-in possible | **UNKNOWN** — GCP service lock-in possible; app ports designed to remain portable (E1-C §E) |
| 45 | Evidence before Production approval | **NOT CURRENTLY DEMONSTRATED** — full inventory + DR proof required | **NOT CURRENTLY DEMONSTRATED** — H-171 §5 unsatisfied; H-198 unsent |

**No row is Production-ready.** Option B has more **selected-but-unproven platform directions**. Option A has **no Production plant** to prove against.

This is **not** equivalence. Option A is not a demonstrated alternative today. Option B is not a demonstrated implementation today.

---

## 6. Critical DR analysis (RTO ≤ 4 hours / RPO ≤ 1 hour)

H-166 approved **RTO ≤ 4 hours** and **RPO ≤ 1 hour** as **business acceptance requirements**, not measured results. H-167/H-169: **database DR ≠ EOS DR**. Backup in the **same** site/region does **not** demonstrate recovery from a **complete site/regional outage while that site is down**.

### Distinguish

| Concept | Meaning | Same-site copy |
| --- | --- | --- |
| **BACKUP** | A recoverable copy exists | May share fate with the primary site |
| **RESTORE** | A backup can be applied and the service returned | Still needs compute, config, secrets, DNS, people, and time **within RTO** |
| **HIGH AVAILABILITY** | Survive instance/zone failure **within** a site | Does **not** equal disaster recovery |
| **DISASTER RECOVERY** | Survive loss of the **primary site/region** | Requires **geographically separated** capacity and a tested procedure |

### What Option A would have to demonstrate

To meet the **existing** RTO/RPO **as Production DR acceptance** (complete primary-site loss), SEDMC-controlled infrastructure would need **evidence**, not assertion, of typically:

* a **second physical or independently failing site** (geographically separated);
* spare compute and application runtime at that site (or rapid rebuild **inside RTO**);
* PostgreSQL mechanism capable of **RPO ≤ 1 hour** (asynchronous replication and/or PITR whose copies are **reachable while the primary site is down**);
* standby or rebuildable database;
* **off-site** backup (not only disks in the same room/rack/building);
* object-storage / document durability off-site;
* DNS/TLS failover design;
* documented recovery procedure;
* named DR operator (**HUM-08 APPOINTMENT REQUIRED**);
* **tested** restore, application redeployment, database recovery, and **end-to-end** recovery with **measured** RTO/RPO.

H-199 **does not select** any of those mechanisms.

**Would Option A require a second geographically separated environment?**  
For the **existing** DR objective as interpreted in H-167/H-169 (survive complete primary-site/region loss): **yes — a second geographically separated environment would be required.** Same-site backup is **NOT SUITABLE** as regional/site DR.

If the Owner later **changed** the DR objective (accepting longer RTO, larger RPO, or “restore when the building returns”), that would be a **new** H-166-class decision — **not made here**.

### Option B DR burden (unchanged)

H-169 Advanced DR remains **selected direction**. Replica **not created**. Failover **not tested**. Measured RTO/RPO **NOT AVAILABLE**. Belgium legal review **DEFERRED**. Application DR, secrets, identity, DNS still required (H-167).

---

## 7. Cost-component comparison (no invented prices)

All unknown prices: **QUOTE / CALCULATOR INPUT REQUIRED**. No numerical estimates are recorded in repository evidence for either Production option.

### Option A categories needing pricing

Hardware; server rental/colocation; bandwidth; electricity; cooling; storage; backup storage; secondary-site infrastructure; PostgreSQL support; monitoring; security; certificates; DNS; support personnel; replacement hardware; DR infrastructure; maintenance; software/licensing where applicable.

### Option B categories needing pricing

Cloud Run; Cloud SQL; Enterprise Plus / Advanced DR; secondary-region DR; storage; networking; logging/monitoring; backups; object storage; event transport; secrets; identity; DNS; support.

HUM-09 TCO remains **BUDGET NOT YET FIXED** (E1-C). D194-19: **no procurement commitment**.

---

## 8. Operational responsibility

Specialist names are **not invented**. Where unappointed: **HUM-08 APPOINTMENT REQUIRED**.

| Responsibility | Option A | Option B |
| --- | --- | --- |
| PostgreSQL administration | SEDMC (or contracted DBA) — **HUM-08 APPOINTMENT REQUIRED** | Shared: Cloud SQL platform + SEDMC Database Owner — **NOT YET APPOINTED** (D194-13) |
| OS patching | SEDMC / facility operator — **HUM-08 APPOINTMENT REQUIRED** | Largely platform for Cloud Run/SQL; host OS not SEDMC’s for those products |
| Application deployment | SEDMC — **HUM-08 APPOINTMENT REQUIRED** | SEDMC — same gap |
| Backups / restore | SEDMC backup owner — **UNASSIGNED** | SEDMC backup owner + platform features — **UNASSIGNED** |
| DR | SEDMC DR Coordinator — **NOT YET APPOINTED** (D194-15) | Same appointment still required |
| Security / certificates / IAM | Security/Access Owner — **NOT YET APPOINTED** (D194-14) | Same |
| Monitoring / incidents / capacity | SEDMC ops — **HUM-08 APPOINTMENT REQUIRED** | SEDMC ops + GCP support channel (unevidenced) |
| Hardware / network failures | SEDMC / colo — **HUM-08 APPOINTMENT REQUIRED** | Google Cloud platform (account still **NONE**) |
| Vendor escalation | Facility/hardware vendors **UNKNOWN** | GCP Contact Sales form **identified**, **not submitted** (H-197/H-198) |
| 24/7 emergency response | **NO DEDICATED NOC**; roster beyond PDM escalation **UNASSIGNED** | Same D194-17 condition |

PDM remains an **escalation path** in prior records, **not** a substitute for appointed Database Owner / DR Coordinator / on-call roster.

Option A **shifts more failure domains onto SEDMC-operated roles** that are not appointed. Option B **does not remove** the need for those appointments.

---

## 9. Evidence burden before Production authorization

Neither architecture may receive P01 on current evidence.

| Evidence | Option A | Option B |
| --- | --- | --- |
| Infrastructure inventory | **REQUIRED — ABSENT** | GCP project/account **REQUIRED — ABSENT** |
| PostgreSQL version compatibility | **REQUIRED** | **REQUIRED** (H177-D03 unsent) |
| Capacity / load test | **REQUIRED — CAP-GATE-01 incomplete** | **REQUIRED — D194-11 deferred** |
| Backup + **restore** evidence | **REQUIRED — ABSENT** | **REQUIRED — not applied, not drilled** |
| DR test + measured RTO/RPO | **REQUIRED — ABSENT** | **REQUIRED — NOT PERFORMED** |
| Second-site / geo-separation proof | **REQUIRED for current DR objective** | Secondary region **selected**, **not built** |
| Network resilience / security / TLS / DNS | **REQUIRED — ABSENT** | **REQUIRED — hostname OPEN** |
| Monitoring / runbooks / RACI | **REQUIRED — HUM-08 open** | **REQUIRED — HUM-08 open** |
| Support arrangements | **REQUIRED** | **REQUIRED** (H177-D02 unsent) |
| Legal/privacy review | **REQUIRED** (facility + processing) | **REQUIRED** (Belgium DR deferred; DPA open) |
| Cost approval | **REQUIRED — no quotes** | **REQUIRED — no quotes** |

Do **not** claim any of these are complete.

---

## 10. Reassess the existing GCP decision (no Owner decision)

### A. Why was GCP selected?

GCP Johannesburg was selected as a **POA implementation direction** (H-158), later refined by H-169 DR architecture. It was **not** selected because EOS application code can run **only** on Google Cloud. E1-C already required **portability** among local Dev/Test, SEDMC-owned, and qualified third-party/cloud. H-158 **resolved the then-unselected tension** between H-125 OA-09 (managed-cloud direction) and E1-C (SEDMC-owned preferred) **for current Production direction**. That is a **governance direction**, not a physics constraint of EOS.

### B. Which EOS requirements genuinely require a public cloud provider?

**None of the listed EOS Production requirements inherently require Google Cloud (or any named public cloud) as the only possible implementation.** PostgreSQL, HTTPS, backups, IAM, and geo-separated DR can exist on non-GCP infrastructure **if** that infrastructure is built, staffed, and **demonstrated**.

What **does** require **geographically separated** infrastructure (cloud **or** second SEDMC/colo site) is the **current** DR acceptance objective: recover from **complete primary-site loss** within RTO ≤ 4 hours and RPO ≤ 1 hour.

### C. Which requirements can be satisfied on SEDMC-controlled infrastructure?

**In principle (CAN SATISFY — EVIDENCE REQUIRED):** application hosting, PostgreSQL, backups, restore, TLS, DNS, monitoring, and even DR — **if** plant, people, and tests exist.

**Today (NOT CURRENTLY DEMONSTRATED):** all of those, because Production servers are **NOT IN PLACE**.

### D. Which requirements become materially harder to demonstrate under self-managed infrastructure?

PITR with off-site copies; intra-site HA vs true DR; **measured** RTO/RPO; 24/7 patching and hardware replacement; secret/KMS operational discipline; object-storage durability; NATS operations; vendor-backed support SLAs. Harder **evidence burden**, not a prohibition.

### E. Second geographically separated environment?

**Yes**, to meet the **existing** RTO/RPO as **site/region disaster** recovery (H-167/H-169 interpretation). Not required only if the Owner **changes** the DR objective — **not done in H-199**.

### F. Evidence before self-managed infrastructure could **replace** the GCP architecture

Minimum: commissioned inventory; facility/legal review; PostgreSQL compatibility; capacity; backup **and** restore; geo-separated DR design; **tested** end-to-end recovery with measured RTO/RPO; HUM-08 appointments; on-call; cost approval; and an explicit Owner/POA **reconfirmation** amending H-158/H-169/D194-02.

### G. Governance that would need revisit if Option A is chosen

H-158 hosting direction; H-159–H-163 GCP-specific backup/PITR/HA/logging directions; H-168 Belgium residency exception (geography would change); H-169 DR architecture; D194-02 architecture acceptance; H-181–H-198 GCP evidence/submission chain (H-198 would remain unsent unless separately withdrawn/superseded); possibly ADR-0006 / DP-0006 additive state. E1-C files already record owned-infrastructure **preference** and would need **new** Production architecture selection, not silent revival.

H-199 **does not** make those amendments.

---

## 11. No false equivalence / no false necessity

* **Technical capability:** Option B’s managed services are a **documented provider product family** (H-169 citations = capability references, not ACCEPTED evidence). Option A’s technical capability is **unproven** because there is no Production plant.
* **Demonstrated capability:** **Neither** option has demonstrated Production RTO/RPO, restore, or DR test.
* **Operational burden:** Option A places OS, hardware, facility, and replication operations on unappointed SEDMC roles. Option B still requires SEDMC owners, on-call, and implementation authorization.
* **Evidence burden:** Option A must **create** infrastructure then prove it. Option B must **obtain provider evidence** (H-198 unsent) then **implement and test**.
* **Commercial:** both **QUOTE / CALCULATOR INPUT REQUIRED**; no purchase authorized.
* **Governance:** Option B is the **current selected direction**. Option A is a **reopened alternative**, not a silent default. **GCP is not required** by EOS logic. **Option A is not currently a demonstrated substitute.**

Do **not** conclude “both are equally suitable.” Do **not** conclude “GCP is required.”

---

## 12. Owner/POA decision framework

### A. Existing selected architecture

Google Cloud `africa-south1` Cloud Run + Cloud SQL PostgreSQL; DR `europe-west1` Cloud SQL Enterprise Plus Advanced DR with designated replica; RTO ≤ 4 hours; RPO ≤ 1 hour. **Selected as direction. Not implemented. Not Production-ready.**

### B. Alternative architecture (what Option A would need to look like)

SEDMC-controlled compute and PostgreSQL **plus** durable document store, secrets, identity/MFA, TLS/DNS, monitoring, and a **geographically separated** recovery environment with tested failover/restore meeting RTO ≤ 4 hours and RPO ≤ 1 hour (unless those business requirements are later changed by Owner/POA). Facility, hardware, and operators **selected and evidenced**. Local Dev/Test machines **do not** satisfy this.

### C. What is already known

* EOS is portable at the adapter boundary (E1-C §E).
* SEDMC-owned Production servers are **NOT IN PLACE**.
* GCP Production resources are **NONE**.
* H-198 is **unsent**.
* HUM-08 specialists are **unappointed**.
* `productionReady = false`. P01 **NOT GRANTED**. H-81 **NOT STARTED**.

### D. What is unknown

Commissioned SEDMC plant; facility; second site; all Option A specifications; GCP account; provider evidence; quotes; measured RTO/RPO; IdP product; object-store/NATS/secrets products; hostname; legal clearance for any geography.

### E. What must be verified before choosing

Owner/POA confirmation of the **DR objective** (keep vs change RTO/RPO/site-loss). Then either: (B) H-198 execution + evidence intake + implementation grant, **or** (A) infrastructure inventory + second-site plan + legal/cost + HUM-08 + tests as §9. **Do not choose on preference language alone.**

### F. Governance impact

Selecting Option A would require **explicit amendment/reconfirmation** of H-158, H-169, D194-02, and dependent GCP-specific gates (§10.G). H-199 does **not** perform that.

### G. Immediate status

```text
Production NOT READY
Production implementation NOT AUTHORIZED
GCP submission NOT EXECUTED
H-81 NOT STARTED
productionReady = false
H-198 Google Cloud submission remains unsent
```

---

## 13. Non-authorizations

H-199 did **not** provision GCP; submit H-198; send email; purchase; select a vendor; create servers or databases; deploy EOS; create a DR replica; modify application/schema/migrations/Production `.env`; create credentials/DNS/TLS; change P01; claim Production readiness; invent infrastructure facts; commit, push, reset, clean, stash, revert, or discard.

---

## 14. Final status

```text
H-199 STATUS = COMPLETE — REASSESSMENT ONLY; NO PROVIDER SELECTED
Neither architecture is Production-ready
H-169 = selected historical direction, not implemented infrastructure
H-198 SUBMISSION = UNSENT
P01 = NOT GRANTED
PRODUCTION = NOT READY
PRODUCTION IMPLEMENTATION = NOT AUTHORIZED
H-81 = NOT STARTED
```
