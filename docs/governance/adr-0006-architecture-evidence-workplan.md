# ADR-0006 Architecture Evidence & Decision Workplan

> **`DRAFT — EVIDENCE ACQUISITION WORKPLAN — NOT AN APPROVAL`**  
> **STAGE: 4**  
> **CURRENT STATUS: `RED — ADR-0006 NOT CLEARED`**

This workplan converts the Stage 3 architecture **class** comparison into a controlled **evidence-acquisition** plan. It does **not** approve ADR-0006 or DP-0006, select a provider or Production region, select a topology, authorize Production/UAT/deployment/migrations, or implement infrastructure.

Laboratory or market evidence collected under this plan must remain **non-Production**. Timed tests do **not** become Production RTO/RPO merely because a diagram or a lab run looks successful.

**Inputs (not modified by this document):**  
[`adr-0006-architecture-decision-package.md`](adr-0006-architecture-decision-package.md)  
[`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md)  
[`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md)  
[`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md)  
[`adr-0006-stakeholder-gap-closure-register.md`](adr-0006-stakeholder-gap-closure-register.md)  
[`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md)  
[`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md)  
Related: ADR-0011 (Production backup TBD), ADR-0012 (secrets OPEN), ADR-0013 (IdP OPEN).

---

# Section 1 — Current decision baseline

Carried forward accurately. **Not altered.**

## Business requirements

| Item | Baseline |
| --- | --- |
| Critical functions | Include **Commercial/RFP intake** and **Programme Building** (jointly critical). Programme Building depends on Commercial inputs, Finance, and Suppliers. |
| Recovery order | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers |
| Critical MTD | **3 hours** |
| Critical RTO target | **<= 3 hours** (business requirement) |
| Overall RTO target | **<= 4 hours** (business requirement) |
| Recovery action | Begins **immediately** (commencement of recovery, not instantaneous restoration) |
| Business data-loss tolerance | **ZERO** tolerated business loss of **critical** data |
| Technical RPO | **NOT** declared as zero. Must be measured/qualified. Historical **3-hour RPO** is **superseded**. |
| Restore-from-backup | Desired **recovery capability**, **NOT** an approved topology |

## Architecture

| Item | Baseline |
| --- | --- |
| In-memory Store | **NOT** acceptable as Production system of record |
| Production SoR | Durable **PostgreSQL** unless a later **approved** architecture changes this |
| HA, replication, WAL, PITR, backup, DR, warm standby | **Candidates only** |
| Topology | **NOT SELECTED** |

## Governance

| Item | Status |
| --- | --- |
| ADR-0006 | **PROPOSED — NOT APPROVED / BLOCKED FOR PRODUCTION** |
| DP-0006 | **OPEN — NOT APPROVED** |
| Provider | **NOT SELECTED** |
| Region | **NOT SELECTED** |
| Production topology | **NOT SELECTED** |
| Production / Deployment / Migrations / UAT | **NOT AUTHORIZED** |

---

# Section 2 — Evidence gates

Status vocabulary for gate items: `UNKNOWN` · `REQUIRES LEGAL/DPO VALIDATION` · `CONFIRMED` · `REQUIRES TEST` · `REQUIRES QUOTE` · `EVIDENCE AVAILABLE`.  
**No item below is `CONFIRMED` at the date of this workplan** unless an existing attested record says so. Current attested Legal/IT/Finance confirmation: **none**.

---

## GATE E1 — Legal / data placement

**Owner:** Legal/DPO (with Owner for business geography; IT for proposed locations).  
**Current overall status:** `REQUIRES LEGAL/DPO VALIDATION` / `UNKNOWN`

Preferred **candidate for assessment:** Tanzania.  
Comparison candidates: Kenya; EU/EEA; other viable jurisdictions **if evidence supports them**.

**“Candidate” is not “approved.”**

| ID | Placement / control | Current status | Evidence to obtain |
| --- | --- | --- | --- |
| E1.1 | Production jurisdiction | `UNKNOWN` / `REQUIRES LEGAL/DPO VALIDATION` | Written Legal/DPO position: permitted / permitted-with-conditions / forbidden, by data class |
| E1.2 | Backup jurisdiction | Same | Same for backup copies and snapshots |
| E1.3 | DR jurisdiction | Same | Same for replicas used for disaster recovery |
| E1.4 | Warm-standby jurisdiction | Same | Same **if** that class is later proposed; topology still **not selected** |
| E1.5 | Restricted data placement | `REQUIRES LEGAL/DPO VALIDATION` | Classification-to-geography rules |
| E1.6 | Highly Restricted data placement | Stage 1: remain in **primary approved** jurisdiction unless explicitly approved otherwise; **primary not approved** | Confirm default + exception process |
| E1.7 | Cross-border transfers | `UNKNOWN` — no mechanism approved | Lawful mechanism(s), destinations, data categories |
| E1.8 | Foreign support access | `REQUIRES LEGAL/DPO VALIDATION` | Allowed support countries and controls |
| E1.9 | Logging/monitoring processing locations | `REQUIRES LEGAL/DPO VALIDATION` | Log/telemetry destinations and minimisation |
| E1.10 | Identity-provider processing location | `UNKNOWN` (ADR-0013 OPEN) | IdP processing/subprocessor locations **once a candidate IdP is listed as** `CANDIDATE — NOT SELECTED` |
| E1.11 | CDN/WAF processing locations | `UNKNOWN` | Edge/WAF processing locations for any candidate |
| E1.12 | Cloud subprocessors | `UNKNOWN` | Subprocessor lists for any `CANDIDATE — NOT SELECTED` offering |
| E1.13 | Contracts / transfer mechanisms / permits / approvals | `UNKNOWN` | DPA, SCCs/adequacy/other **if applicable**, Tanzanian notification/permit check — **not invented** |

Do **not** record legal conclusions as certainty without that evidence.

**Gate E1 exit:** Legal/DPO placement rule sufficient to allow or forbid Option classes A/B/C/D for Production **and** copies (see Q1).

---

## GATE E2 — Technical RPO/RTO lab evidence

**Owner:** IT/Security.  
**Environment:** **Non-Production only** (lab / Dev/Test). Must **not** use live Production PII. Must **not** be treated as Production authorization, UAT authorization, or migration authorization.

**Do not claim an RPO or RTO is achieved merely because an architecture diagram suggests it.**

### Result classification (mandatory on every test)

| Label | Meaning |
| --- | --- |
| Theoretical capability | Mechanism exists in literature or vendor docs |
| Design expectation | Intended behaviour of a candidate design |
| Laboratory result | Timed, repeatable measurement in a **non-Production** lab |
| Production-proven result | **Not claimed** until Production exists and is tested; **out of scope for this gate** |

### Minimum topologies to evaluate (candidates — **not selected**)

| Test ID | Candidate topology | Failure model (define before run) | Record |
| --- | --- | --- | --- |
| E2.1 | PostgreSQL primary + backup | Primary loss **after** last backup; backup media available | See template below |
| E2.2 | WAL archiving + PITR | Loss/corruption with WAL available to a chosen time | Same |
| E2.3 | Synchronous replication | Loss of primary with sync standby surviving | Same |
| E2.4 | Asynchronous geographic replication | Primary-region/site loss; replica lag at failure | Same |
| E2.5 | Warm standby | Promotion of standby; application re-point | Same |
| E2.6 | HA failover | AZ/node failure of primary | Same |
| E2.7 | Backup restoration | Restore to empty instance; integrity check | Same |
| E2.8 | Dependency restoration | App + DB + identity/secrets **stand-ins** + object storage stub as applicable | Same |
| E2.9 | Application recovery | EOS process/config bring-up against restored SoR | Same |
| E2.10 | Failover / failback | Round-trip including failback | Same |

### Per-run record template

For **each** Test ID, complete (leave blank until a lab run exists):

| Field | Value |
| --- | --- |
| Failure model | `___` |
| Data-loss **expectation** (design) | `___` |
| Measured recovery time (RTO lab) | `UNKNOWN` until test — then duration + clock start/stop definition |
| Measured data-loss point (technical RPO lab) | `UNKNOWN` until test — last committed txn vs replica/backup |
| Operational complexity | `___` |
| Dependency requirements | `___` |
| Limitations | `___` |
| Evidence artifact (path/id) | `___` |
| Repeatable? (Y/N + second run id) | `___` |
| Result class | Theoretical / Design expectation / **Laboratory result** — never Production-proven by this gate |

**Gate E2 exit:** Laboratory results sufficient to say, for at least one topology class, whether <=3h / <=4h is **demonstrable in lab**, and what **qualified technical RPO** was measured under a **stated failure model** — without converting that into approved Production RTO/RPO.

---

## GATE E3 — Hosting class evidence

**Owner:** IT (collection); Legal (placement overlay); Owner (direction).  
**Priority order for collection:**

1. **Option A** — African-region managed cloud  
2. **Option B** — EU/EEA managed cloud (**mandatory comparison**)  
3. **Option C** — Tanzania-controlled hosting (keep viable until evidence eliminates it)  
4. **Option D** — Hybrid (keep viable until evidence eliminates it)

This sequence is an **evidence-collection recommendation**, **not** an approval of Option A or B.

Providers, if named in later artefacts, must be marked:

`CANDIDATE — NOT SELECTED.`

This workplan **does not** name or select a provider.

### Evidence checklist (repeat for each class A–D)

| Topic | Status now | Required evidence |
| --- | --- | --- |
| Available regions/facilities | `UNKNOWN` | Catalogue of **candidate** regions/facilities in that class |
| PostgreSQL capability | `UNKNOWN` | Managed or self-managed PG 16-class capability |
| HA capability | `UNKNOWN` | Multi-failure-domain options |
| Backup capability | `UNKNOWN` | Backup frequency, encryption, isolation |
| PITR | `UNKNOWN` | WAL/PITR support |
| Replication | `UNKNOWN` | Sync/async options |
| DR | `UNKNOWN` | Second-site/region options **without selecting one** |
| Network architecture | `UNKNOWN` | Segmentation, private data path |
| Encryption | `UNKNOWN` | In transit / at rest |
| KMS / key control | `UNKNOWN` | Key location and control (ADR-0012 still OPEN) |
| Identity integration | `UNKNOWN` | OIDC feasibility (ADR-0013 still OPEN) |
| MFA | `UNKNOWN` | IdP MFA capability |
| Logging | `UNKNOWN` | Destinations (feeds E1.9) |
| Monitoring | `UNKNOWN` | Alerting/on-call hooks |
| WAF | `UNKNOWN` | Application protection options |
| Support | `UNKNOWN` | Hours, escalation, foreign-access implications (E1.8) |
| SLA evidence | `UNKNOWN` | Written SLA — **not marketing** |
| Security certifications/evidence | `UNKNOWN` | Assurance reports as applicable — **not claimed compliance for SEDMC** |
| Data-processing / subprocessors | `UNKNOWN` | Feeds E1.12 |
| Portability | `UNKNOWN` | PG/object/IaC export |
| Exit mechanism | `UNKNOWN` | Contractual exit/return/deletion |
| Implementation complexity | `UNKNOWN` | Cutover from in-memory Dev/Test |
| Operational burden | `UNKNOWN` | SEDMC vs managed ops |

**Gate E3 exit:** Comparable evidence packs for **A and B** at minimum; C and D documented enough to keep or eliminate under Section 4.

---

## GATE E4 — Finance / 3-year TCO

**Owner:** Finance + Owner; IT supplies quantities (not prices).  
**Do not invent prices.**

Standard TCO model — **one sheet per Option A–D** (and Stage 1 A/B/C packet variants: balanced / lower-cost viable / higher-control **where applicable**).

| Cost category | Figure |
| --- | --- |
| Production compute | `UNKNOWN — QUOTE REQUIRED` |
| PostgreSQL | `UNKNOWN — QUOTE REQUIRED` |
| Storage | `UNKNOWN — QUOTE REQUIRED` |
| Backups | `UNKNOWN — QUOTE REQUIRED` |
| DR | `UNKNOWN — QUOTE REQUIRED` |
| Warm standby if applicable | `UNKNOWN — QUOTE REQUIRED` or `NOT APPLICABLE` if that class is not in the sketch |
| Networking | `UNKNOWN — QUOTE REQUIRED` |
| CDN/WAF | `UNKNOWN — QUOTE REQUIRED` |
| Monitoring | `UNKNOWN — QUOTE REQUIRED` |
| Logging | `UNKNOWN — QUOTE REQUIRED` |
| Identity | `UNKNOWN — QUOTE REQUIRED` |
| Security tooling | `UNKNOWN — QUOTE REQUIRED` |
| Support | `UNKNOWN — QUOTE REQUIRED` |
| Implementation | `UNKNOWN — QUOTE REQUIRED` |
| Migration | `UNKNOWN — QUOTE REQUIRED` |
| Testing | `UNKNOWN — QUOTE REQUIRED` |
| Professional services | `UNKNOWN — QUOTE REQUIRED` |
| Projected growth (30% planning assumption — **not measured usage**) | `UNKNOWN — QUOTE REQUIRED` |
| Exit/migration | `UNKNOWN — QUOTE REQUIRED` |
| Owner/Finance envelope | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` |

**Gate E4 exit:** Comparable 3-year TCO using **quotes**, plus an Owner/Finance envelope (Q4) — still **not** a hosting selection.

---

# Section 3 — Decision matrix (evidence status)

No fabricated numerical scores.

| Criterion | Option A African managed | Option B EU/EEA managed | Option C Tanzania-controlled | Option D Hybrid |
| --- | --- | --- | --- | --- |
| 1. Legal/residency | `REQUIRES LEGAL REVIEW` | `REQUIRES LEGAL REVIEW` | `REQUIRES LEGAL REVIEW` | `REQUIRES LEGAL REVIEW` |
| 2. Technical RPO | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` |
| 3. RTO | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` |
| 4. HA | `UNKNOWN` / `REQUIRES QUOTE` | `UNKNOWN` / `REQUIRES QUOTE` | `UNKNOWN` / `REQUIRES QUOTE` | `UNKNOWN` |
| 5. DR | `UNKNOWN` / `REQUIRES LEGAL REVIEW` | Same | Same | Same |
| 6. Backup/recovery | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` | `REQUIRES TEST` |
| 7. Security | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 8. Scalability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 9. Supportability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 10. Operational complexity | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 11. 3-year TCO | `REQUIRES QUOTE` | `REQUIRES QUOTE` | `REQUIRES QUOTE` | `REQUIRES QUOTE` |
| 12. Portability | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 13. Vendor lock-in | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 14. Implementation risk | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |
| 15. Exit risk | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` | `UNKNOWN` |

`EVIDENCE AVAILABLE` is **not** used for any cell: Stage 3 comparison is conceptual; it is **not** Production evidence.

---

# Section 4 — Elimination criteria

An option class **may** be eliminated **only with recorded evidence**. This workplan **does not eliminate** A, B, C, or D.

| Criterion | Eliminate if evidence shows |
| --- | --- |
| Legal/privacy | Cannot satisfy applicable legal/privacy requirements for Production and copies |
| Data location | Cannot provide required data-location controls (including Highly Restricted default) |
| Recovery | Cannot demonstrate required recovery characteristics in **lab** against <=3h/<=4h **or** cannot qualify technical RPO vs zero tolerated **business** loss |
| SoR | Cannot support durable PostgreSQL Production SoR |
| HA/DR | Cannot provide acceptable HA/DR under the Legal placement rule |
| Security | Unacceptable security posture (identity, secrets, encryption, audit, segmentation) |
| Operations | Unacceptable operational dependency (e.g. no support model compatible with immediate recovery **initiation**) |
| Lock-in | Unacceptable vendor lock-in relative to Stage 1 portability |
| Exit | Unacceptable exit risk (no export/return/deletion path) |
| TCO | TCO **materially exceeds** Owner/Finance envelope **once that envelope exists** (envelope currently `UNANSWERED`) |

Until such evidence exists, keep A–D **open**.

---

# Section 5 — Owner decision questions

For the Owner/governance group. **Not pre-answered.**

**Q1.** What legal/data-placement rule should govern Production, backup, DR and warm standby?  
(Tanzania remains a **candidate for assessment**, not an approval.)

**Q2.** Which architecture class should be laboratory-tested first?  
Recommended **evidence sequence:** Option A first, with Option B as **mandatory comparison**. Options C and D remain viable until eliminated. **This recommendation is not an approval.**

**Q3.** What technical RPO can be demonstrated under defined failure models while preserving the business requirement of zero tolerated critical-data loss?  
(Technical RPO is **not** declared zero. Qualification is allowed only if Owner accepts a stated failure model.)

**Q4.** What Finance/Owner TCO envelope should be used for the three-year comparison?  
**Do not invent a monetary value.** Current: `UNANSWERED — REQUIRES FINANCE/OWNER INPUT`.

---

# Section 6 — Evidence artifact register

Status now: all `UNKNOWN` / not obtained. Dates blank. No fabricated artefacts.

| ID | Evidence required | Owner | Source | Status | Date obtained | Validation method | Decision impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AR-01 | Legal placement position (Prod/backup/DR/warm standby) | Legal/DPO; Owner | Written Legal/DPO record | UNKNOWN | | Legal review + Owner acknowledge | Enables/forbids option classes |
| AR-02 | Transfer mechanism (if any cross-border copy/access) | Legal/DPO | Contract/legal memo | UNKNOWN | | Legal review | Blocks foreign region/support |
| AR-03 | Provider/region **class** evidence (A then B; C/D as needed) | IT | Vendor materials marked `CANDIDATE — NOT SELECTED` | UNKNOWN | | IT review; not a selection | Feeds E3 |
| AR-04 | Security evidence (controls, assurance reports as applicable) | IT/Security | Candidate documentation | UNKNOWN | | Security review — **not SEDMC certification** | Security column |
| AR-05 | PostgreSQL HA evidence | IT | Lab + candidate capability | UNKNOWN | | Lab test E2.6 | HA/RTO |
| AR-06 | Backup/PITR evidence | IT | Lab E2.1, E2.2, E2.7; ADR-0011 remains TBD for Production product | UNKNOWN | | Lab restore + integrity | Backup/RPO |
| AR-07 | DR evidence | IT; Legal | Lab E2.4/E2.5 + placement | UNKNOWN | | Lab + Legal | DR/residency |
| AR-08 | RPO test result (laboratory) | IT | Timed lab log | UNKNOWN | | Repeatable lab | Q3; **not** Production RPO |
| AR-09 | RTO test result (laboratory) | IT | Timed lab log | UNKNOWN | | Repeatable lab | <=3h/<=4h **lab** only |
| AR-10 | TCO evidence (3-year, A–D) | Finance; IT quantities | Quotes | UNKNOWN — QUOTE REQUIRED | | Finance comparison | Q4; elimination on envelope |
| AR-11 | Portability evidence | IT | Export/restore drill in lab | UNKNOWN | | Restore to alternate lab | Lock-in/exit |
| AR-12 | Exit terms | Legal; Finance; Owner | Draft contract positions | UNKNOWN | | Legal/Finance | Exit risk |
| AR-13 | PCI evidence | Finance; IT; Legal | Processor list, flows, validation docs | UNKNOWN — `PCI DSS STATUS NOT ESTABLISHED` | | Joint review | Architecture CHD boundary |
| AR-14 | Identity processing location | IT; Legal | Candidate IdP `CANDIDATE — NOT SELECTED` | UNKNOWN | | Legal A13 | E1.10 |
| AR-15 | Subprocessor list | Legal; IT | Candidate DPA | UNKNOWN | | Legal | E1.12 |

---

# Section 7 — Decision readiness gate

Minimum evidence before a **final** ADR-0006 decision:

| # | Minimum | Current |
| --- | --- | --- |
| 1 | Legal placement decision sufficiently established | **Not established** |
| 2 | Hosting class evidence available (A and B at minimum) | **Not available** |
| 3 | Technical recovery evidence available (lab) | **Not available** |
| 4 | Technical RPO measured/qualified under a stated failure model | **Not measured** |
| 5 | RTO tested (lab) against <=3h/<=4h definitions | **Not tested** |
| 6 | Finance TCO comparison available | **No quotes** |
| 7 | Security architecture sufficiently evidenced | **Not evidenced for Production** |
| 8 | PCI position established sufficiently for architecture decision | **NOT ESTABLISHED** |
| 9 | Portability/exit risks understood | **Principles only** |
| 10 | Unresolved blockers explicitly recorded | This workplan records them |

**ADR-0006 is NOT ready for final approval until the blocking evidence gates above are sufficiently closed.**

---

# Section 8 — Next governed action

Do **not** jump to implementation.

| Stage | Action |
| --- | --- |
| **4A** | Legal/data-placement evidence (Gate E1, Q1) |
| **4B** | Controlled technical RPO/RTO lab evidence (Gate E2, Q3) — **non-Production** |
| **4C** | African-region managed-cloud **and** EU/EEA managed-cloud evidence collection (Gate E3; Q2 sequence) |
| **4D** | TCO comparison (Gate E4, Q4) |
| **5** | Formal ADR-0006 / DP-0006 **decision record** (only after gates sufficiently closed) |

Options C and D remain in the comparison until eliminated under Section 4.

---

# Section 9 — Governance stop conditions

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

UAT:  
`NOT AUTHORIZED`

Implementation:  
`NOT AUTHORIZED`

---

## Validation (this workplan)

- No provider, region, topology, budget, technical RPO, or RTO is represented as **approved** or **achieved**.  
- Stage 1/2/3 baselines are carried forward, not rewritten as new business numbers.  
- Lab results, when they exist later, remain **laboratory results**, not Production proof.  
- `CANDIDATE — NOT SELECTED` is the only permitted way to name a vendor in later evidence packs.
