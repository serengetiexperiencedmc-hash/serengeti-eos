# ADR-0006 Hosting Capability Evidence Package

> **`DRAFT — HOSTING CAPABILITY EVIDENCE — NOT PROVIDER SELECTION`**  
> **STAGE: 4C — GATE E3**  
> **STATUS: `OPEN — HOSTING EVIDENCE IN PROGRESS`**

This package translates Stage 4B laboratory findings into a **provider-neutral** Production hosting **capability specification** and evidence framework for ADR-0006. It does **not** select a provider, region, or topology; does **not** approve ADR-0006 or DP-0006; does **not** authorize Production, deployment, or migrations; and does **not** implement persistence, infrastructure, or application changes.

**Gate source:** [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) § Gate E3  
**Laboratory source:** [`adr-0006-technical-rto-rpo-laboratory-results.md`](adr-0006-technical-rto-rpo-laboratory-results.md) run `20260915-183034`  
**Remediation:** [`adr-0006-technical-rto-rpo-laboratory-remediation.md`](adr-0006-technical-rto-rpo-laboratory-remediation.md)  
**Legal overlay:** [`adr-0006-legal-data-placement-evidence.md`](adr-0006-legal-data-placement-evidence.md) (E1 remains OPEN)

This document does **not** change Stage 1 / 2 / 3 / 4A / 4B decisions, ADR-0006, or DP-0006.

**No named provider is listed in this package.** Any future named offering must be labelled `CANDIDATE — NOT SELECTED` and populated only with **verified** evidence. Unverified cells remain `UNKNOWN — EVIDENCE REQUIRED`.

---

# 2. Stage 4B findings (carried forward — not upgraded)

The following are **laboratory observations** and **architecture implications**. They are **not** Production claims.

| Finding | Status class | Must not be upgraded to |
| --- | --- | --- |
| PostgreSQL backup/restore demonstrated successfully (LAB-01) | **LABORATORY DEMONSTRATED** | Production backup product; Production RTO |
| WAL/PITR demonstrated successfully (LAB-02, LAB-08, LAB-09) | **LABORATORY DEMONSTRATED** | Named Production WAL/PITR product (ADR-0011 Production product remains TBD) |
| Synchronous replication demonstrated **zero transaction loss for the tested configuration and failure model** (LAB-04) | **LABORATORY DEMONSTRATED** | Production RPO = 0; multi-AZ HA; selected topology |
| Asynchronous replication demonstrated **non-zero potential data loss** (LAB-05, LAB-10) | **LABORATORY DEMONSTRATED** | Claim that async geo-DR has zero RPO |
| Warm standby demonstrated **only at database level** (LAB-06 PARTIAL) | **LABORATORY DEMONSTRATED (partial)** | EOS application warm standby; selected T5 |
| Application + database recovery was **only partial** (LAB-07 PARTIAL) | **LABORATORY DEMONSTRATED (partial)** | Combined Production recovery proof |
| Current EOS Commercial/Programme Building runtime remains **in-memory** (ADR-0017) | **ARCHITECTURE FACT** | Production SoR |
| Therefore the laboratory did **NOT** demonstrate recovery of the **actual** critical EOS business modules | **ARCHITECTURE-CRITICAL FINDING** | Stage 1 function recovery evidence |
| Lab RTO observations of approximately **2–10 seconds** | **LABORATORY OBSERVATION ONLY** | Production RTO evidence; comparison to <=3h / <=4h as achieved in Production |
| Independent AZ/region failure was **not** demonstrated (one Docker host) | **NOT DEMONSTRATED** | Multi-AZ / multi-region proof |
| Production IdP / CDN / WAF / email / KMS / security services were **not** demonstrated | **NOT DEMONSTRATED** | Production identity/security stack |
| No Production topology is selected | **GOVERNANCE** | Implied T1–T6 selection |

**Evidence classification used in this package:**

| Label | Meaning |
| --- | --- |
| **LABORATORY DEMONSTRATED** | Timed result in Dev/Test run `20260915-183034` |
| **PROVIDER CLAIM** | Vendor assertion — **none recorded here** (no candidate named) |
| **DESIGN EXPECTATION** | Intended behaviour of a capability class, not measured |
| **PRODUCTION PROVEN** | **Not claimed.** Out of scope until Production exists and is tested |
| **UNKNOWN — EVIDENCE REQUIRED** | Not verified |

**E2 remains:** `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`

**Do not claim any provider can meet zero-loss requirements without testing and architecture evidence.**

---

# 4. Minimum technical capability envelope

A viable Production **hosting class** (Option A, B, C, or D) must be able to **evaluate and, if selected later, provide** the capabilities below. This envelope is a **screen for evidence collection**, not an approved architecture.

Current EOS constraints that the envelope must absorb:

- Intended Production SoR: durable **PostgreSQL 16-class** (ADR-0003), unless a later **approved** architecture changes this.
- Dev/Test runtime SoR for many modules, including jointly critical Commercial/Programme Building paths: **in-memory `Store`** (ADR-0017). **Not** acceptable as Production SoR.
- Identity: OIDC protocol (ADR-0005); Production IdP **OPEN** (ADR-0013); Dev uses `LocalPasswordIdentityProvider` (ADR-0015).
- Secrets: ADR-0012 **OPEN**; Dev uses `EnvSecretsProvider` (ADR-0015).
- Backup product: ADR-0011 Production product **TBD**; 19:00 EAT schedule is a **binding future requirement**, not a proven Production job.
- Web/API: Fastify API + Next.js UI; event transport Dev stand-in `in-memory-dev` (ADR-0004); NATS intended later, not Production-configured.

## A. Database

| Capability | Envelope requirement | Current evidence |
| --- | --- | --- |
| Durable PostgreSQL | Production SoR must be durable PostgreSQL, not in-memory Store | **DESIGN EXPECTATION** (ADR-0003). **LABORATORY DEMONSTRATED** only for synthetic lab tables, not EOS critical modules |
| Supported PostgreSQL version | PostgreSQL **16-class** (ADR-0003 / lab image `postgres:16-alpine`) | Lab used 16-alpine. Provider support: `UNKNOWN — EVIDENCE REQUIRED` |
| Automated backup | Scheduled backups independent of primary disk; restore tested | Lab: manual `pg_dump`. Production product: **TBD**. Provider: `UNKNOWN` |
| WAL archiving | Continuous WAL to storage **independent** of primary volume | **LABORATORY DEMONSTRATED** in Docker lab. Provider: `UNKNOWN` |
| PITR | Restore to named restore point / time for F8/F9 | **LABORATORY DEMONSTRATED** (LAB-02/08/09). Provider: `UNKNOWN` |
| Encryption | At rest for data, backups, WAL; TLS in transit | **NOT DEMONSTRATED** in lab. Provider: `UNKNOWN` |
| Monitoring | DB health, replication lag, backup job outcome, disk | Lab detection was **scripted** (RM-13). Provider: `UNKNOWN` |
| Integrity verification | Restore-probe / checksum / application probe (ADR-0011 intent) | Lab marker/FK probes. Production restore-probe product: `UNKNOWN` |

## B. Primary high availability

**REQUIRED CAPABILITY TO EVALUATE — not an approved architecture.**

Candidate capability (must be **asked and evidenced** for each class; **not selected**):

| Element | Why it is in the envelope | Lab status |
| --- | --- | --- |
| Synchronous PostgreSQL replication | Only lab path that showed **zero committed-transaction loss** for primary-process loss when the sync standby survived (LAB-04) | **LABORATORY DEMONSTRATED** on **one host** — not independent AZ |
| Controlled or automated failover | Scripted `pg_promote` is not a HA product (LAB-04/12; RM-10) | **PARTIALLY DEMONSTRATED** |
| Failure-domain separation | Independent AZ/region **not** demonstrated | **NOT DEMONSTRATED** |
| Quorum / split-brain protection | F10 dual-primary **not** tested (RM-12) | **NOT DEMONSTRATED** |
| Health checks | Production detection ≠ lab script | `UNKNOWN` |
| Fencing where applicable | Lab used container kill/stop only | **NOT DEMONSTRATED** as STONITH |

Backup-only **cannot** by itself satisfy unqualified zero tolerated **business** loss between backups (LAB-01: `MARKER-POST-BACKUP` lost). That is a **DESIGN EXPECTATION** informed by **LABORATORY DEMONSTRATED** T1 behaviour — not a selected topology.

## C. Geographic DR

Candidate capabilities (evaluate; **not selected**):

- Asynchronous replication
- WAL-based geographic recovery
- Warm standby
- Independent backup copies

**Geographic DR may legitimately have a different RPO characteristic from same-failure-domain synchronous HA.**

**Do not claim zero RPO for asynchronous geographic replication.** LAB-05 and LAB-10 **LABORATORY DEMONSTRATED** loss of committed markers that had not reached the async copy.

DR location remains a **separate** Legal/governance decision (E1; Stage 4A). No DR location is approved.

## D. PITR / logical recovery

Must support recovery from accidental deletion, logical corruption, operator error, and unwanted transactions.

Lab: LAB-08 (logical UPDATE) and LAB-09 (DELETE) **LABORATORY DEMONSTRATED** PITR to a restore point. HA/sync replicas **do not** heal logical corruption (corruption is replicated). **DESIGN EXPECTATION:** T2 remains required even if T3/T6 exist.

## E. Backup

Must support: independent copies; encryption; retention policy; restore testing; backup integrity verification; recovery documentation.

ADR-0011: Production backup **product TBD**; success = verified recoverability; 19:00 EAT + remote copy is a **future Production requirement**, not evidenced here. F7 (backup unavailability) was **NOT TESTED**.

## F. Security

Must **evaluate** (none **PRODUCTION PROVEN**; ADR-0012 OPEN):

IAM; MFA; least privilege; KMS/key management; encryption at rest; TLS; network segmentation; WAF; audit logging; monitoring; vulnerability management; incident response; secrets management.

Lab did **not** demonstrate Production IdP/CDN/WAF/email/KMS. Status: `UNKNOWN — EVIDENCE REQUIRED` / `REQUIRES TECHNICAL TEST` on any candidate.

## G. Identity

Evaluate: OIDC/SAML; MFA; RBAC mapping into EOS (authorization stays in EOS — ADR-0015); privileged access; service accounts; emergency access; auditability; **IdP geographic processing** (E1.10; LE-13).

ADR-0013 **OPEN**. Dev local issuer is **not** a Production IdP.

## H. Network

Evaluate: private networking; firewall; ingress/egress; TLS; segmentation; DDoS/WAF; monitoring.

`UNKNOWN — EVIDENCE REQUIRED` for all option classes.

## I. Application recovery

A hosting class must support recovery of:

**application + PostgreSQL + critical dependencies**

not merely PostgreSQL.

LAB-06 showed DB warm standby without an EOS application standby. LAB-07 was **PARTIAL**. LAB-11 showed function unusable while the DB dependency was down even if data later survived.

Critical dependencies to include in the envelope (none selected): IdP, secrets/KMS, DNS, object/file storage, email (if required for the critical path), observability backends.

---

# 5. Failure-mode capability matrix

Expected RPO/RTO below are **DESIGN EXPECTATION** unless marked laboratory. **Do not invent measured Production results.** Lab seconds are **not** copied here as Production RTO.

Legend for hosting-class cells: capability must be **evidenced per class**; current status for A–D is `UNKNOWN — EVIDENCE REQUIRED` except where the **mechanism class** was laboratory-demonstrated in Docker (not on a provider).

| ID | Failure | Expected recovery mechanism (envelope) | Expected RPO characteristics | Expected RTO characteristics | Evidence required | Unknowns (all classes A–D) |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | Application process failure | Restart/replace app against **durable** SoR | Durable committed SoR: design near-0 **if** PG survived. In-memory: unbounded | Minutes-class **DESIGN EXPECTATION**; lab 2–10 s is **not** Production | App restart + SoR survival test on **EOS critical modules** once persisted | EOS SoR cutover not done (RM-01) |
| F2 | Application host failure | Redeploy on remaining host/domain | Same as F1 if DB independent | Includes host replacement | Provider compute HA / runbook | `UNKNOWN` |
| F3 | Database process failure | Crash recovery on surviving storage | Lab: **zero committed loss** for F3 when data dir survived (LAB-03) — **LABORATORY DEMONSTRATED**, not Production | Lab **5.310 s** — **not** Production RTO | Provider crash-recovery / managed restart SLO | Managed restart behaviour `UNKNOWN` |
| F4 | Database host failure | Sync replica in **independent** domain **or** restore | Sync + surviving standby: lab zero committed loss **on one host** (LAB-04). Async: **RPO > 0** (LAB-05). Backup-only: since last backup (LAB-01) | Failover vs restore; restore **may miss** <=3h — **REQUIRES TECHNICAL TEST** on the candidate | Independent-AZ failover test | Independent AZ **NOT DEMONSTRATED** |
| F5 | Storage failure | Replica or backup on **other** storage | Cannot be 0 without independent copy | Same as F4 | Proof backup/replica ≠ same volume | `UNKNOWN` |
| F6 | Failure-domain loss | HA across domains | Sync vs async across AZ | Should be designed inside <=3h **if** HA is real — **REQUIRES TECHNICAL TEST** | Multi-AZ evidence | **NOT DEMONSTRATED** in lab |
| F7 | Backup loss | Alternate copy / replica | May become last other copy or unbounded | May become unbounded | Dual backup; restore-probe | **NOT TESTED** (RM-11) |
| F8 | Accidental deletion | PITR to point before delete | **Not** 0 for later valid writes | Investigation + PITR; lab ~7.3 s **not** Production | PITR product + runbook | Provider PITR `UNKNOWN` |
| F9 | Logical corruption | PITR / backup; **not** failover to streaming replica | Restore-point RPO | May exceed <=3h if investigation is long | LAB-08 class test on candidate | Same |
| F10 | Network partition | Fail-closed writes; fencing; no dual-primary | Can be > 0 if isolated primary accepted commits | Detection + fence | Split-brain test | **NOT TESTED** (RM-12) |
| F11 | Primary DB failure | Controlled/automated failover **or** restore | Per T3 vs T1/T4 | Per topology | HA product evidence (RM-10) | No HA product selected |
| F12 | Regional/site failure | Geo DR (typically **async**) or restore in second site | **Typically RPO > 0**; **do not claim zero RPO for async geo** | Often worse than AZ; must still be judged vs <=3h/<=4h | Second-site test + Legal E1 | Lab laptop ≠ region; Legal **OPEN** |
| F13 | Dependency failure | Restore IdP/DNS/KMS/object/email; RTO clock continues | Data may survive while **function** is down | Includes dependency | LAB-11 class on real deps | IdP/CDN/WAF/KMS **NOT DEMONSTRATED** |
| F14 | Operator / config error | Runbook, PITR, failback | Can be total | Human time | Change control; LAB-12 class | Scripted failback ≠ product |

**Hosting class columns (A/B/C/D):** for every row, current capability status is **`UNKNOWN — EVIDENCE REQUIRED`** until a `CANDIDATE — NOT SELECTED` offering is evidenced. Mechanism **feasibility in principle** on managed PostgreSQL is **DESIGN EXPECTATION**, not **PROVIDER CLAIM**.

---

# 6. Options A–D (not selected)

Workplan evidence-collection order remains A then B (mandatory comparison), C and D kept until eliminated. **This is not an approval of A or B.**

## Option A — African-region managed cloud

| Topic | Requirement / position |
| --- | --- |
| Technical | Envelope §4 A–I. Must evidence PG 16-class, backup, WAL/PITR, sync HA **to evaluate**, async DR **as separate RPO class**. |
| Geographic | Specific African country/region **NOT SELECTED**. Hosting in Africa **≠** Tanzania and **≠** PDPA approval. |
| Legal | E1 OPEN. Transfers if outside Tanzania or if support/logs leave Tanzania. `REQUIRES LEGAL REVIEW` |
| Security | Envelope F–H. `UNKNOWN` |
| HA | Independent failure domains **to evaluate**. Lab did not prove multi-AZ. `REQUIRES TECHNICAL TEST` |
| DR | Separate location decision. Async RPO **> 0 typical**. `REQUIRES LEGAL REVIEW` + `REQUIRES TECHNICAL TEST` |
| Backup | Independent copies; 19:00 EAT requirement for future product; encryption. `UNKNOWN` |
| Support | Hours, escalation, **foreign support access** (E1.8). `UNKNOWN` |
| Scalability | Planning 500/200/30% — `REQUIRES TECHNICAL TEST` / quote |
| Portability | Prefer PostgreSQL + containers over proprietary lock-in (Stage 1). `UNKNOWN` |
| Lock-in | PaaS risk. `UNKNOWN` |
| Operational complexity | Managed ops **may** reduce SEDMC 24/7 burden (I6 NOT PROVEN). `UNKNOWN` |
| Evidence required | HE-01–HE-40 for at least one `CANDIDATE — NOT SELECTED` in class A |

**Preliminary screen:** **technically plausible with conditions** (managed PG class **in principle**; Legal/region/HA evidence missing). **Not selected.**

## Option B — EU/EEA managed cloud

| Topic | Requirement / position |
| --- | --- |
| Technical | Same envelope as A. |
| Geographic | Specific EU/EEA region **NOT SELECTED**. |
| Legal | GDPR/UK GDPR **not automatic**. Tanzania→EU and any EU→TZ copies `REQUIRES LEGAL REVIEW`. No SCC/adequacy claimed. |
| Security | Same envelope; often mature tooling — **not claimed for SEDMC**. `UNKNOWN` |
| HA / DR / backup | Same as A; geo distance may worsen T3 latency and T4 lag. **Do not claim zero RPO for async.** |
| Support | Remote EU support can be a **transfer**. E1.8 OPEN. |
| Scalability / portability / lock-in | Same class comments as A. |
| Operational complexity | Similar to A plus transfer documentation. |
| Evidence required | Mandatory comparison pack vs A (workplan E3). |

**Preliminary screen:** **technically plausible with conditions** (same PG class **in principle**; Legal transfer and latency `UNKNOWN`). **Not selected.**

## Option C — Tanzania-controlled hosting

| Topic | Requirement / position |
| --- | --- |
| Technical | **Same envelope.** Managed-cloud primitives are **not assumed**. Facility must evidence PG 16, backup, WAL/PITR, HA domains, or an equivalent operable stack. |
| Geographic | Tanzania **candidate for assessment**, not approved jurisdiction (Stage 1 / 4A). |
| Legal | Onshore ≠ automatic PDPA approval. Facility due diligence still required. `REQUIRES LEGAL REVIEW` |
| Security | KMS/IAM/WAF/IdP may be self-operated or local vendor. ADR-0012/0013 OPEN. `UNKNOWN` |
| HA | Single-facility risk. Independent failure domain **UNKNOWN**. `REQUIRES TECHNICAL TEST` |
| DR | Second Tanzanian site **or** Legal-approved offshore copy. Neither selected. Async/offshore **RPO ≠ 0**. |
| Backup | Independent media; 19:00 EAT. `UNKNOWN` |
| Support | Local ops burden may be higher; 24/7 SEDMC **NOT PROVEN**. `UNKNOWN` |
| Scalability | Headroom `UNKNOWN`. |
| Portability | May reduce hyperscaler lock-in; increase operational lock-in. |
| Lock-in | Facility/ops lock-in. |
| Operational complexity | **Likely higher** if SEDMC operates the stack — provisional. |
| Evidence required | Named facility still `UNKNOWN`; keep viable until eliminated with evidence. |

**Preliminary screen:** **technically plausible with conditions** **if** a facility can evidence the envelope; currently an **evidence gap** (no facility survey in repo). **Not selected. Not eliminated.**

## Option D — Hybrid

| Topic | Requirement / position |
| --- | --- |
| Technical | Envelope **per component**. Highest mapping burden (LAB-07/11 class). |
| Geographic | Split locations each need E1. **NOT SELECTED.** |
| Legal | Each hop is a transfer/access path. Most detailed location matrix. `REQUIRES LEGAL REVIEW` |
| Security | Two estates, two IAM/KMS stories. `UNKNOWN` |
| HA / DR / backup | Can help or hurt RTO if links untested. `REQUIRES TECHNICAL TEST` |
| Support | Two vendors/facilities possible. |
| Scalability | Uneven. |
| Portability | Mixed. |
| Lock-in | Two lock-in profiles. |
| Operational complexity | **Highest.** Stage 3: hybrid is **not the default**. |
| Evidence required | Component-level location/transfer/recovery map before any selection. |

**Preliminary screen:** **technically plausible with conditions** only if Legal **requires** split placement **or** a single class cannot meet RTO/RPO/residency together — **neither evidenced**. **Evidence gap.** **Not selected. Not default. Not eliminated.**

**Potential elimination conditions** (workplan §4 — **not applied**): cannot satisfy Legal; cannot provide required locations; cannot demonstrate recovery vs <=3h/<=4h / qualified RPO; cannot support durable PG SoR; unacceptable security/ops/lock-in/exit; TCO exceeds envelope **once quotes exist**.

---

# 7. Provider evidence framework

**No provider is named in this document.**

When a vendor is later introduced, every row must use:

`CANDIDATE — NOT SELECTED`

Do **not** imply endorsement. Populate only **verified** fields. Otherwise:

`UNKNOWN — EVIDENCE REQUIRED`

### Candidate slots (empty)

| Slot | Class | Vendor name | Status |
| --- | --- | --- | --- |
| A-CAND-1 | Option A | _none recorded_ | `UNKNOWN — EVIDENCE REQUIRED` |
| B-CAND-1 | Option B | _none recorded_ | `UNKNOWN — EVIDENCE REQUIRED` |
| C-CAND-1 | Option C | _none recorded_ | `UNKNOWN — EVIDENCE REQUIRED` |
| D-CAND-1 | Option D | _none recorded_ | `UNKNOWN — EVIDENCE REQUIRED` |

### Evidence checklist (repeat per candidate)

| Topic | Verified value |
| --- | --- |
| Available regions | `UNKNOWN — EVIDENCE REQUIRED` |
| PostgreSQL managed (or self-managed) capabilities | `UNKNOWN — EVIDENCE REQUIRED` |
| Synchronous HA options | `UNKNOWN — EVIDENCE REQUIRED` |
| Asynchronous DR options | `UNKNOWN — EVIDENCE REQUIRED` |
| PITR | `UNKNOWN — EVIDENCE REQUIRED` |
| Backups | `UNKNOWN — EVIDENCE REQUIRED` |
| Recovery testing | `UNKNOWN — EVIDENCE REQUIRED` |
| Encryption | `UNKNOWN — EVIDENCE REQUIRED` |
| KMS | `UNKNOWN — EVIDENCE REQUIRED` |
| IAM | `UNKNOWN — EVIDENCE REQUIRED` |
| MFA | `UNKNOWN — EVIDENCE REQUIRED` |
| Network controls | `UNKNOWN — EVIDENCE REQUIRED` |
| WAF | `UNKNOWN — EVIDENCE REQUIRED` |
| Logging | `UNKNOWN — EVIDENCE REQUIRED` |
| Monitoring | `UNKNOWN — EVIDENCE REQUIRED` |
| Support model | `UNKNOWN — EVIDENCE REQUIRED` |
| SLA (written, not marketing) | `UNKNOWN — EVIDENCE REQUIRED` |
| Security certifications/assurance reports | `UNKNOWN — EVIDENCE REQUIRED` — not SEDMC certification |
| Data-processing locations | `UNKNOWN — EVIDENCE REQUIRED` |
| Subprocessors | `UNKNOWN — EVIDENCE REQUIRED` |
| Contractual terms | `UNKNOWN — EVIDENCE REQUIRED` |
| Portability | `UNKNOWN — EVIDENCE REQUIRED` |
| Exit support | `UNKNOWN — EVIDENCE REQUIRED` |
| Pricing inputs | `UNKNOWN — REQUIRES QUOTE` |

**Do not invent capabilities.** A marketing page is not `CONFIRMED`.

---

# 8. Legal integration (E1)

Cross-reference: [`adr-0006-legal-data-placement-evidence.md`](adr-0006-legal-data-placement-evidence.md).

Tanzania remains the **preferred jurisdictional candidate for assessment**, **not** legal approval. Highly Restricted data default: remain in the **primary formally approved** jurisdiction — **primary is not approved**.

For **each** future `CANDIDATE — NOT SELECTED` and for each option class, record (all currently **NOT APPROVED / UNKNOWN**):

| Placement | Option A | Option B | Option C | Option D |
| --- | --- | --- | --- | --- |
| Production location | NOT APPROVED / UNKNOWN | NOT APPROVED / UNKNOWN | NOT APPROVED / UNKNOWN | NOT APPROVED / UNKNOWN |
| Backup location | Separate decision — NOT APPROVED | Same | Same | Same |
| DR location | Separate — NOT APPROVED | Same | Same | Same |
| Warm-standby location | Separate — NOT APPROVED | Same | Same | Same |
| Support location | REQUIRES LEGAL/DPO + IT/SECURITY | Same | Same | Same |
| Logging location | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| IdP location | UNKNOWN (ADR-0013 OPEN) | Same | Same | Same |
| CDN/WAF processing | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Subprocessors | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

No location is approved at this stage. Copies are transfers if they leave the processing jurisdiction (Stage 4A).

---

# 9. Technical RPO/RTO integration

| Layer | Statement |
| --- | --- |
| **A. Business requirement** | MTD <= 3 h; critical RTO <= 3 h; overall RTO <= 4 h; recovery begins immediately; zero tolerated **business** loss of critical data. Historical 3-hour RPO superseded. |
| **B. Technical target** | **Not approved.** Do **not** convert business zero-loss into technical RPO = 0. |
| **C. Laboratory observation** | Run `20260915-183034`: T1–T4 mechanisms as in §2; lab RTO ~2–10 s. |
| **D. Architecture implication** | Evaluate sync HA for F4/F11 committed-loss qualification; keep PITR for F8/F9; treat async geo as **RPO > 0** unless proven otherwise; persist critical EOS modules before claiming function recovery. |
| **E. Production requirement** | Unchanged. Not authorized. |

**Do not claim any provider can meet zero-loss requirements without testing and architecture evidence.**

**E2 = PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED**

---

# 10. Application persistence gap (architecture-critical)

**The Stage 4B PostgreSQL laboratory did not demonstrate recovery of the actual EOS Commercial/Programme Building runtime because those modules remain in-memory.**

This is an **architecture-critical finding** (RM-01). Hosting-class evidence **cannot** close Production recovery for jointly critical functions until durable persistence exists and is tested.

Evidence required **before Production** (do **not** implement in Stage 4C):

| Topic | Evidence needed |
| --- | --- |
| Durable persistence of critical business state | Commercial/RFP and Programme Building writes durable in PostgreSQL (or later **approved** SoR) |
| Application/database consistency | Dual-write/hydrate cutover complete; no silent in-memory SoR |
| Transaction semantics | Commit/ack vs durable; outbox survives restore (I4 intent) |
| Restart behavior | Process restart does not lose critical committed state |
| Backup inclusion | Critical tables in backup/WAL |
| Restore behavior | Restore reconstitutes critical functions |
| Failover behavior | App re-point + DB promote with integrity |
| Recovery validation | Markers + business probes on **real** modules, not stand-in tables |

Status: `REQUIRES TECHNICAL TEST` after a **separately authorized** persistence increment. **Not authorized here.**

---

# 11. Provider questionnaire

Issue to each `CANDIDATE — NOT SELECTED`. Answers are evidence, not selection.

### Database

1. PostgreSQL version/support (16-class?)  
2. Synchronous HA (failure domains, sync_commit behaviour, lag/stall)  
3. Asynchronous replication (lag SLO, promote procedure)  
4. WAL/PITR (archive location, restore-point, RPO for archive lag)  
5. Backup retention  
6. Restore testing (who, how often, evidence)  
7. Cross-region recovery (locations, RPO class — **must not claim 0 for async unless proven**)

### Security

8. Encryption (at rest / in transit / backups / WAL)  
9. KMS (key location, customer-managed vs provider)  
10. IAM  
11. MFA  
12. Network controls  
13. WAF  
14. Audit  
15. Monitoring  
16. Incident response

### Residency

17. Production locations  
18. Backup locations  
19. DR locations  
20. Support locations (personnel, not only data centres)  
21. Subprocessors  
22. IdP processing location (if bundled)  
23. CDN/WAF processing  
24. Logs / telemetry locations

### Operations

25. SLA (written)  
26. Support (hours, language, escalation, foreign access)  
27. RTO/RPO **commitments** vs **objectives** (do not equate to SEDMC lab results)  
28. Failover (automated vs controlled)  
29. Failback  
30. Disaster recovery testing

### Commercial

31. Pricing (see §12)  
32. Implementation  
33. Support fees  
34. Data transfer / egress  
35. Backup  
36. DR  
37. Exit/migration  
38. Termination  
39. Portability (PG dump, object export, IaC)

---

# 12. TCO inputs for Stage 4D

**Do not invent prices.** All figures: `UNKNOWN — REQUIRES QUOTE` until a written quote exists. Finance envelope remains `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` (Stage 2 C1–C14).

Required quote lines **per Option A–D** (and per `CANDIDATE — NOT SELECTED`):

| Input | Status |
| --- | --- |
| Monthly Production compute | `UNKNOWN — REQUIRES QUOTE` |
| PostgreSQL | `UNKNOWN — REQUIRES QUOTE` |
| Storage | `UNKNOWN — REQUIRES QUOTE` |
| Backups | `UNKNOWN — REQUIRES QUOTE` |
| WAL/PITR archive storage | `UNKNOWN — REQUIRES QUOTE` |
| HA (extra nodes/control plane) | `UNKNOWN — REQUIRES QUOTE` |
| DR | `UNKNOWN — REQUIRES QUOTE` |
| Networking | `UNKNOWN — REQUIRES QUOTE` |
| WAF/CDN | `UNKNOWN — REQUIRES QUOTE` |
| Monitoring | `UNKNOWN — REQUIRES QUOTE` |
| Logging | `UNKNOWN — REQUIRES QUOTE` |
| KMS | `UNKNOWN — REQUIRES QUOTE` |
| Identity | `UNKNOWN — REQUIRES QUOTE` |
| Support | `UNKNOWN — REQUIRES QUOTE` |
| Implementation | `UNKNOWN — REQUIRES QUOTE` |
| Migration | `UNKNOWN — REQUIRES QUOTE` |
| Testing | `UNKNOWN — REQUIRES QUOTE` |
| Egress | `UNKNOWN — REQUIRES QUOTE` |
| Projected growth (30% planning assumption — not measured usage) | `UNKNOWN — REQUIRES QUOTE` |

Warm standby: `UNKNOWN — REQUIRES QUOTE` or `NOT APPLICABLE` if that class sketch excludes it (**T5 not selected**).

---

# 13. Evidence register HE-01 – HE-40

Status vocabulary: `UNKNOWN` · `REQUIRES QUOTE` · `REQUIRES LEGAL REVIEW` · `REQUIRES TECHNICAL TEST` · `CONFIRMED`  
**No HE item is `CONFIRMED`.**

| ID | Requirement | Evidence | Source | Option | Status | Validation | Decision impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HE-01 | African managed regions catalogue | Verified region list | Candidate (none named) | A | UNKNOWN | IT | Enables/forbids class A geography |
| HE-02 | EU/EEA managed regions catalogue | Verified region list | Candidate | B | UNKNOWN | IT | Class B geography |
| HE-03 | Tanzania facility/provider catalogue | Facility survey | Market | C | UNKNOWN | IT | Class C viability |
| HE-04 | Hybrid component map | Per-component locations | Architecture | D | UNKNOWN | IT + Legal | Class D complexity |
| HE-05 | PostgreSQL 16-class offering | Version/support statement | Candidate | A–D | UNKNOWN | IT | SoR feasibility |
| HE-06 | Automated backup | Product + schedule vs 19:00 EAT | Candidate; ADR-0011 TBD | A–D | UNKNOWN | IT | T1 capability |
| HE-07 | WAL archiving | Archive location independent of primary | Candidate | A–D | UNKNOWN | IT | T2; RPO qualification |
| HE-08 | PITR | Restore-point/time restore evidence | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | F8/F9 |
| HE-09 | Synchronous HA | Sync replica + independent domain | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | F4/F6/F11 vs business loss |
| HE-10 | Async DR | Lag SLO; promote runbook | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | F12; **RPO > 0 unless proven** |
| HE-11 | Warm standby (app+DB) | Running standby app path | Candidate | A–D | UNKNOWN | IT | T5; LAB-06 gap |
| HE-12 | Failover product | Controlled/automated + fencing | Candidate | A–D | UNKNOWN | IT | T6; RM-10 |
| HE-13 | Failback | Documented failback test | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | LAB-12 class |
| HE-14 | Independent backup copies | Second media/region | Candidate | A–D | UNKNOWN | IT + Legal | F7; E1.2 |
| HE-15 | Backup encryption | KMS/CMEK evidence | Candidate | A–D | UNKNOWN | IT/Security | Envelope E/F |
| HE-16 | Backup retention | Policy vs Legal A17 | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal + IT | Retention |
| HE-17 | Restore testing cadence | Dated restore-probe | Candidate | A–D | UNKNOWN | IT | ADR-0011 intent |
| HE-18 | Encryption at rest (data) | Platform evidence | Candidate | A–D | UNKNOWN | Security | Envelope F |
| HE-19 | TLS | Platform evidence | Candidate | A–D | UNKNOWN | Security | Envelope H |
| HE-20 | KMS / key location | Key region + control | Candidate; ADR-0012 OPEN | A–D | UNKNOWN | Security + Legal | E1 + secrets |
| HE-21 | IAM | IdP/cloud IAM model | Candidate | A–D | UNKNOWN | Security | Envelope F/G |
| HE-22 | MFA | IdP MFA | Candidate; ADR-0013 OPEN | A–D | UNKNOWN | Security | Envelope G |
| HE-23 | Network segmentation | VPC/private net | Candidate | A–D | UNKNOWN | Security | Envelope H |
| HE-24 | WAF | Offering + processing locations | Candidate | A–D | UNKNOWN | Security + Legal | E1.11 |
| HE-25 | CDN processing locations | Edge map | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal | E1.11 |
| HE-26 | Logging/telemetry locations | Destinations | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal | E1.9 |
| HE-27 | Monitoring / detection | Alerting vs scripted lab | Candidate | A–D | UNKNOWN | IT | RM-13; real RTO |
| HE-28 | IdP processing location | Subprocessors | Candidate; ADR-0013 | A–D | REQUIRES LEGAL REVIEW | Legal | E1.10 |
| HE-29 | Support locations / foreign access | Personnel countries | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal + IT | E1.8 |
| HE-30 | Subprocessors | DPA list | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal | E1.12 |
| HE-31 | Written SLA | Contract extract | Candidate | A–D | UNKNOWN | IT + Legal | Ops |
| HE-32 | Security assurance reports | SOC/ISO as applicable — not SEDMC cert | Candidate | A–D | UNKNOWN | Security | Envelope F |
| HE-33 | Portability (PG dump/export) | Exit test | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | Lock-in |
| HE-34 | Exit/return/deletion terms | Contract | Candidate | A–D | REQUIRES LEGAL REVIEW | Legal + Finance | Exit |
| HE-35 | Independent AZ evidence | Architecture + test | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | F6; RM-04 |
| HE-36 | Split-brain/fencing | Design + test | Candidate | A–D | REQUIRES TECHNICAL TEST | IT | F10; RM-12 |
| HE-37 | Application+DB+deps recovery | Combined test on EOS modules | After persistence gate | A–D | REQUIRES TECHNICAL TEST | IT | §10; LAB-07 |
| HE-38 | TCO quote pack | §12 lines | Candidate | A–D | REQUIRES QUOTE | Finance | E4 |
| HE-39 | Latency East Africa | Measurement | Candidate | A/B especially | REQUIRES TECHNICAL TEST | IT | Class B vs A |
| HE-40 | PCI / CHD boundary (if any) | Processor flows | Finance/IT/Legal | A–D | UNKNOWN (`PCI DSS STATUS NOT ESTABLISHED`) | Joint | Architecture CHD |

---

# 14. Preliminary technical screen (no numerical rank)

| Class | Screen | Conditions / gaps | Potential elimination condition (not applied) |
| --- | --- | --- | --- |
| **A — African managed** | **Technically plausible with conditions** | No named candidate; region/Legal/HA/PITR unverified | No Legal-approved African location; cannot evidence envelope |
| **B — EU/EEA managed** | **Technically plausible with conditions** | Mandatory comparison; transfer + latency unverified | Cannot lawfully place Production/copies; cannot meet RTO with latency |
| **C — Tanzania-controlled** | **Evidence gap** (kept viable) | No facility survey; HA/DR geography unknown | Cannot evidence HA + tested restore + Legal facility approval |
| **D — Hybrid** | **Evidence gap** (not default) | No split map; higher complexity | Cannot show net RTO/RPO/residency benefit vs single class |

**Do not eliminate A, B, C, or D without recorded evidence.** **Do not select.**

---

# 15. Stage 4C exit criteria

Stage 4C is **sufficiently evidenced** only when:

1. Hosting classes have been mapped — **done as a framework** (this document)  
2. Candidate providers have **verifiable** evidence — **not done** (none named)  
3. PostgreSQL capability understood **per candidate** — **not done**  
4. HA capability understood **per candidate** — **not done** (lab is not provider HA)  
5. DR capability understood **per candidate** — **not done**  
6. Backup/PITR understood **per candidate** — **not done**  
7. Security capability understood — **not done**  
8. Identity capability understood — **not done** (ADR-0013 OPEN)  
9. Application recovery requirements documented — **done as requirements** (§10); **not tested** on EOS modules  
10. Legal placement questions mapped — **mapped**; **not answered** (E1 OPEN)  
11. Provider questions answered sufficiently — **not answered**  
12. TCO inputs available for Stage 4D — **template only**; **REQUIRES QUOTE**

**Gate E3 remains OPEN.** Next governed collection: issue the questionnaire to `CANDIDATE — NOT SELECTED` offerings (A then B, C/D kept), without selecting.

---

# 16. Governance status

E1:  
`OPEN — REQUIRES LEGAL/DPO VALIDATION`

E2:  
`PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`

E3:  
`OPEN — HOSTING EVIDENCE IN PROGRESS`

E4:  
`NOT STARTED`

ADR-0006:  
`PROPOSED — NOT APPROVED`

DP-0006:  
`OPEN — NOT APPROVED`

Provider:  
`NOT SELECTED`

Region:  
`NOT SELECTED`

Topology:  
`NOT SELECTED`

Production:  
`NOT AUTHORIZED`

Deployment:  
`NOT AUTHORIZED`

Migrations:  
`NOT AUTHORIZED`

Implementation:  
`NOT AUTHORIZED`

---

## Validation (this package)

- Stage 4B results are represented as laboratory observations, not Production proof.  
- No provider is selected or named.  
- No region is approved.  
- No Production architecture/topology is selected.  
- No prices are invented.  
- No legal approval is claimed.  
- Stage 1–4B files are not rewritten by this document.
