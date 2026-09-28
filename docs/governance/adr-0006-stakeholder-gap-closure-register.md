# ADR-0006 Stakeholder Gap Closure Register and Stakeholder Action Pack

> **CURRENT STATUS: `RED — NOT CLEARED`**  
> **DOCUMENT TYPE: GOVERNANCE / PLANNING ONLY**  
> **IMPLEMENTATION AUTHORIZATION: NOT AUTHORIZED BY THIS DOCUMENT**  
> **HOSTING OPTION: NONE SELECTED**  
> **ADR-0006: OPEN / proposed — blocked for Production**  
> **DP-0006: NOT APPROVED**  
> **PRODUCTION / DEPLOYMENT / MIGRATIONS: NOT AUTHORIZED**

This register identifies every outstanding item that prevents ADR-0006 stakeholder-questionnaire readiness. It does **not** answer unanswered questions, invent budgets, select providers or regions, approve RTO/RPO, reconcile contradictions, close ADR-0006, or authorize implementation.

**Authoritative questionnaire / answers:** [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md)  
**Authoritative decision records:** [`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md), [`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md)  
**Related open/blocked records:** ADR-0011 (Production backup product TBD), ADR-0012 (secrets), ADR-0013 (corporate IdP)

This document does **not** replace or overwrite the fact pack. Fact-pack answers remain unchanged.

---

## Immediate next action

`Complete stakeholder gap closure and obtain required attestations.`

| Priority | Action |
| --- | --- |
| First | Reconcile RTO/RPO/BIA requirements. |
| Second | Resolve Owner hosting/geography/budget requirements. |
| Third | Obtain Legal/DPO, IT/Security, Business/BCM and Finance validation. |
| Fourth | Establish the ADR-0006 decision package. |

Implementation authorization: **`NOT AUTHORIZED BY THIS TASK.`**

---

## What stakeholders need to decide

### Owner

- business priorities
- RTO/RPO
- hosting/geography
- recovery posture
- budget
- non-negotiables

### Business/BCM

- critical functions
- MTD
- RTO/RPO
- recovery priority
- acceptable recovery model

### Legal/DPO

- applicable legal regimes
- data residency
- transfer mechanisms
- approved/prohibited jurisdictions
- Restricted/Highly Restricted rules
- retention/deletion

### IT/Security

- technical constraints
- hosting requirements
- HA/DR
- identity
- secrets
- backup
- security architecture

### Finance

- implementation budget
- annual operating budget
- hosting ceiling
- TCO ceiling

---

## Classification model (three dimensions)

Do **not** treat these columns as mutually exclusive overlays of the same count. Each gap has one value per dimension.

### Dimension A — Answer State

- `ANSWERED` — a substantive stakeholder-supplied value exists in the fact pack
- `DRAFT` — text exists and is explicitly draft / recommendation / preferred architecture
- `UNANSWERED` — blank, “UNANSWERED”, “UNKNOWN”, “Not available yet”, “Not yet specified”, or no dedicated determination

### Dimension B — Validation State

- `NOT REQUIRED` — not used in this register (no gap is self-clearing)
- `REQUIRES STAKEHOLDER CONFIRMATION` — named attestation still required
- `CONFIRMED` — named attestation exists in the fact pack (none recorded at the date of this register)
- `RECONCILIATION REQUIRED` — recorded values conflict or cannot be used together until stakeholders reconcile them

### Dimension C — Governance Impact

- `BLOCKING` — prevents questionnaire completion and/or ADR-0006 decision-package construction
- `NON-BLOCKING` — may be closed after the decision package is scoped, without selecting hosting now

`CONFIRMED` is **not** recorded for any gap below. Draft text is **not** approval.

---

## Intended governance sequence

Do not skip gates. Questionnaire completion does **not** authorize implementation.

`Stakeholder Gap Closure`  
→ `Stakeholder Attestation`  
→ `ADR-0006 Decision Package`  
→ `Owner/Legal/IT/Finance Decision`  
→ `ADR-0006 / DP-0006 Update`  
→ `Architecture Decision`  
→ `Separate Implementation Authorization`  
→ `Build`  
→ `Test/UAT`  
→ `Production Authorization`  
→ `Deployment`

---

# Priority 1 — RTO / RPO / Business Continuity Reconciliation

`BLOCKING — MUST BE RECONCILED BEFORE PRODUCTION ARCHITECTURE`

Do **not** merge the values below. Do **not** decide that 2 hours means MTD, that 3 hours means RTO, that 4 hours means overall RTO, that Zero means RPO 0, that 3-hour RPO overrides Zero, that restore-from-backup is sufficient, or that warm standby is required. Those are stakeholder decisions.

### Owner requirements currently recorded

Source: fact pack Section 1 / pack O8 / questionnaire Q1–Q12. Classification: Answer State `ANSWERED`; Validation `REQUIRES STAKEHOLDER CONFIRMATION` and `RECONCILIATION REQUIRED`; Impact `BLOCKING`.

- Critical-function maximum interruption: **2 hours**
- Critical-function RTO: **3 hours**
- Overall RTO: **4 hours**
- Overall RPO: **3 hours**
- Critical RPO: **3 hours**
- Data-loss tolerance: **Zero**

Also recorded on O8 and not to be altered here: critical services Sales & Marketing (Commercial and CRM); recover first Commercial functions; recovery order Commercial first, then Finance, then Operations, then CRM, then Procurement/Suppliers; RFP and Program building; Program Building depends on Finance and Suppliers.

Q13 business rationale/evidence: **Not available yet** — Answer State `UNANSWERED`.

### Business/BCM requirements currently recorded

Source: fact pack Section 5 (BIA A–J, identical on all scenarios) and Section 7. Classification: Answer State `DRAFT`; Validation `REQUIRES STAKEHOLDER CONFIRMATION` and `RECONCILIATION REQUIRED`; Impact `BLOCKING`.

- Maximum tolerable disruption: **3 hours**
- Data-loss tolerance: **Zero**
- Recovery priority: **Immediately**
- Recovery requirement: **Restore from backup**

BIA critical function on every scenario: Programme building. This is **not** automatically the same set as Owner “Sales & Marketing (Commercial and CRM)”.

Section 7 “Owner decision” field still frames 3 hours / Immediately / Zero from the BCM draft. That field is **not** a reconciliation of Section 1 Owner values.

### Existing architecture proposal

Source: `docs/architecture/12-bcm-dr-architecture.md` §12.3; fact pack Section 6.

Architecture 12.3 contains **proposed** RTO/RPO values (for example Identity proposed RTO 1 h / RPO 15 min; Programme operations proposed RTO 4 h / RPO 1 h). The fact pack records these as **PROPOSED / NOT APPROVED**. They are **not** approved stakeholder requirements and must **not** be used to settle Owner or BCM figures.

Section 6 stakeholder-approved RTO and RPO remain **blank**.

### Stakeholder decision table (values intentionally blank)

| Decision | Option / Value | Stakeholder Decision Required |
| --- | --- | --- |
| Critical-function maximum interruption | ___ | Owner + BCM |
| Critical-function RTO | ___ | Owner + BCM + IT |
| Overall RTO | ___ | Owner + BCM + IT |
| Critical RPO | ___ | Owner + BCM + IT |
| Overall RPO | ___ | Owner + BCM + IT |
| Business data-loss tolerance | ___ | Owner + BCM |
| Recovery priority | ___ | Owner + BCM |
| Recovery model | Backup / Warm standby / Other | Owner + BCM + IT |

IT may later assess feasibility against the **reconciled** values. IT must **not** pick the numbers.

---

# Gap Closure Register

| ID | Part | Question / Decision | Current State | Required Decision | Responsible Stakeholder | Blocking? | Architecture Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GC-01 | 1, 4, 6 | Reconcile interruption / RTO / RPO / data-loss (O8 Q3, Q5, Q9–Q13; BIA A–J items 4–6; S6; S7 Q1, Q5, Q7; architecture 12.3 not approved) | ANSWERED (Owner values) + DRAFT (BCM) + UNANSWERED (S6 approved fields; Q13 rationale). Validation: RECONCILIATION REQUIRED | Single attested set of MTD / RTO / RPO / data-loss values, or an explicit written distinction of layers | Owner; Business/BCM; IT (feasibility after reconciliation) | Yes | YES |
| GC-02 | 1, 4 | Critical functions and recovery order (O8 Q1, Q2, Q4, Q6–Q8 vs BIA function Programme building) | ANSWERED (Owner) + DRAFT (BCM). Validation: RECONCILIATION REQUIRED | Attested critical-function set and recovery sequence | Owner; Business/BCM | Yes | YES |
| GC-03 | 1, 4, 6, 3 | Recovery model (O9; BIA item 6 Restore from backup; S7 posture checkboxes unset; S7 Q2–Q4, Q6–Q8; I10; I15) | UNANSWERED (O9; S7 checkboxes) + DRAFT (BCM restore-from-backup; IT warm standby recommended). Validation: RECONCILIATION REQUIRED | Select restore-from-backup / warm standby / other **after** GC-01; do not treat recommendations as architecture | Owner; Business/BCM; IT | Yes | YES |
| GC-04 | 1, 2 | Controller / legal entity / establishment (O1; L1 establishment UNKNOWN) | UNANSWERED (O1). DRAFT applicable-law text on L1 is not establishment | Name controller(s) and place(s) of establishment | Owner; Legal/DPO | Yes | YES |
| GC-05 | 1 | Operating geography (O2; Q14–Q15) | UNANSWERED | Geographic operating model and countries/regions of operation | Owner | Yes | YES |
| GC-06 | 1, 7 | Production / backup / DR geography preference (O3, O4, O5) | UNANSWERED | Owner preference for Production, backup, and DR geography (preference ≠ Legal approval) | Owner | Yes | YES |
| GC-07 | 1, 2, 7 | Restricted / Highly Restricted / Restricted+ failover geography (O6, O7; L13, L14; residency Q5–Q6; matrix Restricted/HR rows) | UNANSWERED (Owner). DRAFT (Legal: no dedicated determination) | Classification-to-geography rules and failover permission | Owner; Legal/DPO; Security | Yes | YES |
| GC-08 | 1 | Owner restore-from-backup vs warm standby preference (O9) | UNANSWERED | Owner preference, subject to GC-01 / GC-03 | Owner | Yes | YES |
| GC-09 | 1, 8 | Infrastructure budget / envelope (O10; Cost Q1–Q4) | UNANSWERED | See Priority 6; no figures invented | Owner; Finance | Yes | YES |
| GC-10 | 1, 3 | Enterprise cloud / platform preference (O11; I1) | UNANSWERED (O11). DRAFT (I1 greenfield / cloud-first can be supported, not selected) | Any Owner constraint on cloud/platform; not a provider selection by IT draft | Owner | Yes | YES |
| GC-11 | 1, 3 | Production operating model / responsible team (O12; I6) | UNANSWERED (O12). DRAFT (I6 24/7 hybrid acceptable, not selected) | Who operates Production | Owner; IT | Yes | YES |
| GC-12 | 1 | Remaining Owner criteria (O13; Q16–Q25) | UNANSWERED | Availability expectations beyond O8; growth; scale; hours; hosting constraints; lock-in; portability; cost/control balance; unacceptable models; non-negotiables | Owner | Yes | YES |
| GC-13 | 2 | Applicable-law confirmation (L1 applicable-law text; L2 Tanzania PDPA; L3 Kenya DPA; L4 GDPR; L5 UK GDPR; L6 other regimes) | DRAFT (L1–L4, L6). UNANSWERED (L5 no dedicated UK GDPR determination). Validation: REQUIRES STAKEHOLDER CONFIRMATION. Label: DRAFT — REQUIRES LEGAL/DPO REVIEW AND ATTESTATION | Confirm, amend, or reject draft applicability; perform formal assessments | Legal/DPO | Yes | YES |
| GC-14 | 2 | Data-subject geography census (L8) | UNANSWERED (UNKNOWN) | Verified data-subject jurisdiction map | Legal/DPO; Owner | Yes | YES |
| GC-15 | 2, 7 | Approved / prohibited Production, backup, DR, warm-standby jurisdictions (L11; residency Q1–Q11; matrix all rows NOT APPROVED) | UNANSWERED / NOT APPROVED. Tanzania is a **candidate**, not an approved location | Formal approved and prohibited lists for each activity | Legal/DPO; Owner | Yes | YES |
| GC-16 | 2 | Cross-border transfer mechanisms (L9, L10; residency Q15) | DRAFT; transfer mechanism NOT APPROVED | Lawful mechanism(s) before any foreign hosting/support | Legal/DPO | Yes | YES |
| GC-17 | 2, 6, 7 | Backup / DR transfer and residency (L12; S7 Q9; residency Q2–Q4) | DRAFT; no backup/DR jurisdiction approved | Legal acceptability of proposed backup/DR locations **before** replication is authorized | Legal/DPO; IT | Yes | YES |
| GC-18 | 2 | Data classification / special-category handling (L7) and Restricted/HR legal restrictions (L13, L14) | DRAFT (L7). UNANSWERED dedicated Restricted/HR geography (L13, L14) | Inventory, legal bases, and geographic restrictions | Legal/DPO; Owner; Security | Yes | YES |
| GC-19 | 2, 7 | Processor / subprocessor / remote support / logging / identity-email-CDN (L15; residency Q12–Q14) | DRAFT; no provider approved | Assess locations, subprocessors, and remote-access countries before Production use | Legal/DPO; Security; IT | Yes | YES |
| GC-20 | 2 | Retention / deletion (L17 retention text) | DRAFT | Documented retention periods and deletion/anonymisation rules | Legal/DPO; Owner | Yes | YES |
| GC-21 | 2, 10 | Legal hosting restrictions and Legal/DPO attestation (L17 confirmation **Not confirmed**; Reviewer blank; Part 10 Legal/DPO blank) | DRAFT / UNANSWERED attestation. “Legal should approve” is **not** existing approval | Named Legal/DPO review and attestation of the exact final fact-pack content | Legal/DPO | Yes | YES |
| GC-22 | 3, DP-0006 | Production hosting model (cloud / colo / hybrid; DP-0006 options A–D; I1) | DRAFT IT; DP-0006 recommended option *Not selected* | Select model **after** GC-01, GC-06, GC-15, GC-09 — this register does **not** select A/B/C/D | Owner; IT; Legal/DPO; Finance | Yes | YES |
| GC-23 | 3 | Production region (I1, I9, I13 REQUIRES DECISION) | UNANSWERED / REQUIRES DECISION | Named Production region **after** Legal/Owner jurisdiction approval. Not selected here | IT; Owner; Legal/DPO | Yes | YES |
| GC-24 | 3 | Backup region | UNANSWERED / NOT APPROVED | Named backup region after GC-15 / GC-17. Not selected here | IT; Legal/DPO | Yes | YES |
| GC-25 | 3 | DR / warm-standby region | UNANSWERED / NOT APPROVED | Named DR/warm-standby region after GC-03 / GC-15. Not selected here | IT; Legal/DPO | Yes | YES |
| GC-26 | 3 | PostgreSQL Production architecture (I9) | DRAFT (managed PostgreSQL **can be supported**; vendor/region/HA unknown). Migrations NOT AUTHORIZED | Production PostgreSQL topology after hosting/RTO decisions. No vendor selected here | IT | Yes | YES |
| GC-27 | 3 | HA model (I10) | DRAFT (failure-domain redundancy recommended; mandatory Multi-AZ depends on approved RTO/RPO; Section 6 blank) | HA topology derived from **attested** RTO/RPO. Not selected here | IT | Yes | YES |
| GC-28 | 3 | Backup strategy and Production backup product (I15; ADR-0011 Production TBD; daily 19:00 EAT is Dev/Test evidence-register, not Production RPO) | DRAFT / UNKNOWN frequency; product TBD | Backup strategy derived from attested RPO; named Production product later. No product selected here | IT | Yes | YES |
| GC-29 | 3 | Replication strategy | DRAFT (continuous WAL/CDP recommended against zero data-loss; not approved) | Replication approach after GC-01 / GC-03. Not selected here | IT | Yes | YES |
| GC-30 | 3 | Identity provider (I2; ADR-0013 OPEN) | DRAFT / UNKNOWN named IdP | Named IdP after or with hosting decision. No IdP selected here | IT; Owner | Yes | YES |
| GC-31 | 3 | Secrets-management platform and KMS/encryption (I14; ADR-0012 OPEN) | DRAFT (KMS/HSM recommended; provider unknown) | Named secrets/KMS approach and key jurisdiction. No product selected here | IT; Security | Yes | YES |
| GC-32 | 3 | Object storage (I13) | DRAFT (encrypted storage capability; product/region unknown) | Named object-storage product and residency after GC-15. No product selected here | IT; Legal/DPO | Yes | YES |
| GC-33 | 3 | Networking / WAF / TLS (I7, I8) | DRAFT recommended controls; existing Production estate UNKNOWN | Production network/security pattern after hosting model. No product selected here | IT; Security | Yes | YES |
| GC-34 | 3 | Observability / logging / SIEM (I5, I16; residency Q13) | DRAFT; named platform UNKNOWN | Monitoring/logging architecture and logging geography. No SIEM selected here | IT; Security; Legal/DPO | Yes | YES |
| GC-35 | 3 | Support / on-call model (I6, I16) | DRAFT (24/7 recommended; hybrid acceptable, not selected) | Named operating/support model with Owner (GC-11) | IT; Owner | Yes | YES |
| GC-36 | 3 | DNS, email, cache, event transport, containers, CI/CD (I3, I4, I11, I12, I17, I18) | DRAFT / UNKNOWN named products | Named products as subprocessors/architecture after hosting model. DNS/email locations also GC-19. No products selected here | IT | Yes (DNS/email/CDN locations). I11/I12/I17/I18 named products: Non-blocking for constructing the hosting **option** packet; blocking before Production implementation | YES |
| GC-37 | 3 | Other Production constraints (I19 security/encryption recommended; 500+/200+/30% PLANNING ASSUMPTION not approved; `<=1h`/`<=15m` NOT PROVEN) | DRAFT / PLANNING ASSUMPTION | Confirm or reject planning assumptions; do not treat as approved capacity/RTO | Owner; IT | Non-blocking for option sketches if GC-12 scale/growth is answered; blocking if used as Production sizing | YES if treated as requirements |
| GC-38 | 3, 10 | IT/Security attestation (I1–I19 IT owner blank; Part 10 IT blank) | UNANSWERED attestation | Named IT review of exact final draft IT content | IT | Yes | YES |
| GC-39 | 5, 2 | PCI scope (Section 4 PCI-1–19; PCI STATUS unset; Owner and Legal/DPO rows blank; L16). `PCI DSS STATUS NOT ESTABLISHED` | DRAFT IT/Finance preferred architecture; UNANSWERED attestation and evidence | Establish whether/where CHD is stored, processed, transmitted; resulting EOS PCI scope. No compliance claim | Finance; IT; Owner; Legal/DPO | Yes | YES |
| GC-40 | 8 | Finance monetary thresholds (Cost Q1–Q4) | UNANSWERED — FINANCE/OWNER INPUT REQUIRED | Implementation budget; annual opex; max hosting spend; 3-year TCO ceiling/range. No numbers invented | Finance; Owner | Yes | YES |
| GC-41 | 8 | Cost-versus-resilience principles and decision-packet alternatives (Cost Q5–Q7; Section 9 alternatives gap) | DRAFT recommended principles; packet not produced | Attest weighting; require lower-cost and higher-control alternatives **without** selecting an option here | Finance; Owner; IT | Yes | YES |
| GC-42 | 9 | Exit / portability principles (Exit Q1–Q6, Q8, Q10) | DRAFT PRINCIPLE — not APPROVED CONTRACTUAL REQUIREMENT | Confirm or amend principles | Owner; IT; Legal | Yes | YES |
| GC-43 | 9 | Exit commercial terms (Exit Q7 duration/cost; Q9 termination notice; replica/backup deletion coverage in Q8) | UNANSWERED exact duration, cost, and notice. Q8 deletion is DRAFT PRINCIPLE | Contractual duration, cost limits, notice, return/deletion including backups/replicas. No terms invented | Owner; Legal; Finance | Yes | YES |
| GC-44 | 4, 10 | Business/BCM attestation and BIA completeness (BIA item 7 owner Not named; time-to-impact Unknown; regulatory Unknown; Part 10 Business/BCM blank) | DRAFT; UNANSWERED names and sub-fields | Named BCM/business attestation; complete or explicitly mark N/A for unknown sub-fields | Business/BCM | Yes | YES |
| GC-45 | 10 | Stakeholder sign-off (Owner, Legal/DPO, IT, Business/BCM). Finance has **no** Part 10 row in the fact pack | UNANSWERED (all blank). Newly documented Parts 1–3 are not covered by any Part 10 approval | Named attestations of **exact final** fact-pack content. Finance attestation still required (GC-40) even if Part 10 currently lacks a Finance slot | Owner; Legal/DPO; IT; Business/BCM; Finance | Yes | YES |

No hosting provider, Production region, backup region, DR region, identity provider, secrets product, or backup product is selected by listing these gaps.

---

# Priority 2 — Owner questionnaire gaps

Do **not** fill these answers here. Each item remains as recorded in the fact pack.

| Owner gap | Fact-pack refs | Why it matters | Answer State |
| --- | --- | --- | --- |
| Controller / establishment | O1; Q14 (operating model overlaps) | Legal/DPO cannot finish applicability or transfers without knowing who the controller is and where it is established | UNANSWERED |
| Operating geography | O2; Q14; Q15 | Hosting and transfer analysis depends on where the business operates and from which countries it must run | UNANSWERED |
| Production geography preference | O3 | Owner preference is an input to Legal/IT; it is not a selected region | UNANSWERED |
| Backup geography preference | O4 | Backup copies are transfers; Owner preference is required before Legal can assess them | UNANSWERED |
| DR geography preference | O5 | DR location is a residency and RTO design input | UNANSWERED |
| Restricted-data geographic rules | O6 | Higher-risk data may forbid locations that are acceptable for other classes | UNANSWERED |
| Highly Restricted / Restricted+ failover rules | O7 | Failover must not silently create an unapproved transfer | UNANSWERED |
| Recovery posture preference | O9 | Distinct from BCM “restore from backup” draft and from IT warm-standby recommendation | UNANSWERED |
| Budget / infrastructure envelope | O10 | Options A–D cannot be compared without a cost envelope | UNANSWERED |
| Cloud / platform preference | O11 | Existing enterprise constraint (if any) would filter hosting options | UNANSWERED |
| Production operating model | O12 | Determines 24/7 support, managed-service vs internal ops, and vendor scope | UNANSWERED |
| Availability/continuity expectations beyond O8 | Q16 | O8 records interruption/RTO/RPO values that are unreconciled; remaining continuity expectations are still open | UNANSWERED |
| Growth requirements | Q17 | Capacity, cost, and TCO depend on attested growth, not I19 planning assumptions | UNANSWERED |
| Customer/user scale | Q18 | Sizing and licensing depend on attested scale | UNANSWERED |
| Operational hours | Q19 | Drives on-call, RTO feasibility, and support cost | UNANSWERED |
| Business constraints hosting must respect | Q20 | May rule out models before technical design | UNANSWERED |
| Acceptable cloud/vendor lock-in | Q21 | Constrains managed services vs portable components | UNANSWERED |
| Portability / exit capability | Q22 | Must align with Part 9 draft principles once attested | UNANSWERED |
| Balance of cost, control, resilience, proximity, complexity | Q23 | Decision-packet weighting | UNANSWERED |
| Hosting models explicitly unacceptable | Q24 | May eliminate colo, public cloud, or a region class | UNANSWERED |
| Non-negotiable business requirements | Q25; O13 | Final Owner decision criteria for hosting | UNANSWERED |
| RTO/RPO rationale | Q13 | Recorded as “Not available yet”; cannot freeze targets without evidence or an explicit Owner waiver | UNANSWERED |
| Attestation of already-recorded O8 values | O8; Q1–Q12 | Values exist but are unattested and unreconciled with BCM | ANSWERED + RECONCILIATION REQUIRED |

---

# Priority 3 — Legal / DPO gaps

All existing Legal/DPO answers in the fact pack remain:

`DRAFT — REQUIRES LEGAL/DPO REVIEW AND ATTESTATION`

They are **not** legal certification, GDPR applicability confirmation, hosting-country approval, or PCI compliance.

| Legal/DPO action | Refs | Current State | Required action |
| --- | --- | --- | --- |
| Applicable-law confirmation | L1–L6 | DRAFT (L5 UNANSWERED as dedicated UK GDPR determination) | Review, amend, attest; commission formal assessments where Status is REQUIRES FURTHER REVIEW |
| Controller / establishment | L1; O1 | Establishment UNKNOWN | Confirm controller(s) with Owner |
| Data-subject geography | L8 | UNKNOWN | Produce a census; do not treat market lists as approval |
| Production jurisdiction | L11; residency Q1 | UNKNOWN / NOT APPROVED | Approve or reject specific jurisdictions; do not treat Tanzania candidate language as approval |
| Approved / prohibited jurisdictions | L11; residency Q7–Q11 | UNKNOWN; no country list invented | Issue approved and prohibited lists for Production, backup, DR, warm standby |
| Restricted-data geography | L13; residency Q5 | No dedicated determination | Attest classification-to-geography rules |
| Highly Restricted-data geography | L13; residency Q6 | Default restrictive posture; no primary jurisdiction approved | Attest default and any exception process |
| Cross-border transfer mechanisms | L9, L10 | NOT APPROVED | Specify lawful mechanism(s) for each destination; ordinary cloud contracts are not assumed sufficient |
| Backup/DR transfer implications | L12; residency Q2–Q4 | No backup/DR jurisdiction approved | Assess backup/DR as transfers; replication remains NOT AUTHORIZED |
| Processor / subprocessor requirements | L15; residency Q12–Q14 | No provider approved | Define contractual/privacy/security/subprocessor controls; include remote support and SaaS locations |
| Retention / deletion | L17 | DRAFT | Document periods; no indefinite retention by default |
| Hosting restrictions | L17 | DRAFT “Legal should approve” ≠ already approved | State conditions that any later architecture must meet |
| Legal/DPO attestation | L1–L17 Reviewer blank; Part 10 Legal/DPO blank | NOT ATTESTED | Review the **exact final** fact-pack Legal section and sign Part 10 |

---

# Priority 4 — IT / Security gaps

Purpose: identify decisions still required. **No product, region, or hosting option is selected here.**

| IT/Security decision | Refs | Current State | Required decision (not made here) |
| --- | --- | --- | --- |
| Production hosting model | I1; DP-0006 A–D | DRAFT; none selected | Cloud / colo / hybrid after Owner/Legal/Finance inputs |
| Cloud / colo / hybrid option | I1 | Cloud-first or hybrid *can be supported* only | Formal selection later in the decision package |
| Production region | I1, I9 | REQUIRES DECISION | Named region after GC-15 |
| Backup region | I15; L12 | NOT APPROVED | Named region after GC-15 / GC-17 |
| DR region | I10; S7 Q4, Q9 | NOT APPROVED; no site selected | Named region after GC-03 / GC-15 |
| PostgreSQL Production architecture | I9 | DRAFT capability class; vendor unknown | Topology, edition, encryption; migrations remain NOT AUTHORIZED |
| HA model | I10 | DRAFT; depends on approved RTO/RPO (blank) | Multi-AZ / multi-site mandate after GC-01 |
| Recovery model | I10, I15; S7 | Warm standby recommended, not implemented, not approved | After GC-01 / GC-03 |
| Backup strategy | I15; ADR-0011 Production TBD | Frequency UNKNOWN; daily backup not converted to Production RPO | Derived from attested RPO |
| Replication strategy | I15; S7 Q8 | CDP/WAL recommended against zero data-loss; not approved | After GC-01 |
| Identity provider | I2; ADR-0013 | UNKNOWN named IdP | No IdP selected here |
| Secrets-management platform | I14; ADR-0012 | UNKNOWN provider | No Vault/KMS product selected here |
| KMS / encryption approach | I14; I19 | DRAFT recommended | Provider and key jurisdiction after hosting |
| Object storage | I13 | UNKNOWN product/region | After GC-15 |
| Networking | I7, I8 | Existing estate UNKNOWN; controls recommended | Pattern after hosting model |
| Observability / logging | I5, I16 | Named platform UNKNOWN | After hosting; geography in GC-19 |
| SIEM if required | I5 | UNKNOWN | Whether a SIEM is mandatory, and which, after security review |
| Support model | I6, I16 | 24/7 recommended; hybrid acceptable not selected | With Owner GC-11 |
| Production operating model | I6; O12 | O12 UNANSWERED | Named team / managed-service mix |
| IT/Security attestation | I1–I19 IT owner blank | NOT ATTESTED | Review exact final IT draft |

`<=1h` RTO / `<=15m` RPO remains **NOT PROVEN** and must not be treated as an approved requirement.

---

# Priority 5 — PCI

`PCI DSS STATUS NOT ESTABLISHED`

This checklist does **not** claim PCI DSS compliance, does **not** place SEDMC in or out of scope, and does **not** convert preferred architecture into an approved requirement.

| Checklist item | Fact-pack ref | Current State | Owner of evidence |
| --- | --- | --- | --- |
| Payment channels inventory | PCI-1, PCI-3, PCI-4 | UNKNOWN — REQUIRES FINANCE/IT VERIFICATION | Finance; IT |
| Payment processors / gateways / acquirers | PCI-5 | UNKNOWN — REQUIRES FINANCE INPUT | Finance |
| Whether EOS receives cardholder data | PCI-1, PCI-8 | UNKNOWN / PREFERRED ARCHITECTURE “No” is not as-is fact | IT; Finance |
| Whether EOS stores cardholder data | PCI-2, PCI-9 | NOT PROVEN; default architecture “not permitted” is DRAFT | IT |
| Whether EOS transmits cardholder data | PCI-4 | UNKNOWN — REQUIRES VERIFICATION | IT; Finance |
| Website payment flows | PCI-1, PCI-18 | REQUIRES VERIFICATION | IT; Finance |
| Email payment-card flows | PCI-12 | REQUIRES VERIFICATION; prohibit-routine-email is DRAFT | Finance; IT |
| WhatsApp / messaging flows | PCI-13 | REQUIRES VERIFICATION | Finance; IT |
| Excel / spreadsheet flows | PCI-14 | REQUIRES VERIFICATION | Finance |
| Accounting / reconciliation flows | PCI-15, PCI-18 | REQUIRES VERIFICATION | Finance |
| Third-party processor PCI evidence | PCI-6 | REQUIRES EVIDENCE; no processor asserted compliant | Finance; IT |
| SEDMC PCI DSS evidence | PCI-7 | NOT ESTABLISHED | Finance; Legal; IT |
| Resulting EOS PCI scope | PCI-19; PCI STATUS checkboxes unset | OPEN | Finance; IT; Legal; Owner |
| Owner / Finance / IT / Legal confirmation | Section 4 table; Part 10 | Owner and Legal rows blank; Finance/IT DRAFT | All four |

Preferred architecture (third-party capture; no raw PAN/SAD in EOS, backups, or DR) remains **DRAFT / PREFERRED ARCHITECTURE**, not approval.

---

# Priority 6 — Finance

Do not invent any numbers.

| # | Required decision | Current recorded value |
| --- | --- | --- |
| 1 | Initial implementation budget | `UNANSWERED — FINANCE/OWNER INPUT REQUIRED` |
| 2 | Maximum annual operating budget | `UNANSWERED — FINANCE/OWNER INPUT REQUIRED` |
| 3 | Maximum acceptable hosting spend | `UNANSWERED — FINANCE/OWNER INPUT REQUIRED` |
| 4 | 3-year TCO ceiling/range | `UNANSWERED — FINANCE/OWNER INPUT REQUIRED` |
| 5 | Cost tolerance for higher resilience/compliance | DRAFT recommended principle (Cost Q6) — not an approved envelope |
| 6 | Required lower-cost alternative in the decision packet | DRAFT recommended governance requirement (Cost Q7) — packet **not** produced; **no option selected** |
| 7 | Required higher-control/resilience alternative | DRAFT recommended governance requirement (Cost Q7) — packet **not** produced; **no option selected** |

O10 remains `UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT`.

---

# Priority 7 — Exit / Portability

Distinguish `DRAFT PRINCIPLE` from `APPROVED CONTRACTUAL REQUIREMENT`. No contractual terms are invented.

| Topic | Fact-pack ref | Classification |
| --- | --- | --- |
| Avoiding vendor lock-in | Exit Q1 | `DRAFT PRINCIPLE` |
| Move to another provider without rewrite | Exit Q2 | `DRAFT PRINCIPLE` |
| PostgreSQL portability | Exit Q3 | `DRAFT PRINCIPLE` |
| Object/file portability | Exit Q4 | `DRAFT PRINCIPLE` |
| Configuration portability | Exit Q5 | `DRAFT PRINCIPLE` |
| Restoration outside incumbent | Exit Q6 | `DRAFT PRINCIPLE` (tests not claimed) |
| Migration assistance (principle) | Exit Q7 | `DRAFT PRINCIPLE` |
| Migration assistance duration | Exit Q7 | UNANSWERED — not invented |
| Migration assistance cost | Exit Q7 | UNANSWERED — not invented |
| Data return | Exit Q8 | `DRAFT PRINCIPLE` |
| Secure deletion | Exit Q8 | `DRAFT PRINCIPLE` |
| Backup deletion | Exit Q8 | `DRAFT PRINCIPLE` (must be covered; not a named retention period) |
| Replica deletion | Exit Q8 | `DRAFT PRINCIPLE` |
| Termination notice | Exit Q9 | UNANSWERED exact period — not invented |
| Proprietary technology restrictions | Exit Q10 | `DRAFT PRINCIPLE` |

None of the above is an `APPROVED CONTRACTUAL REQUIREMENT`.

---

# Stakeholder attestation matrix

Do not populate names. No confirmed named stakeholders are recorded in the fact pack Part 10.

| Stakeholder | Required Areas | Current Status | Required Action |
| --- | --- | --- | --- |
| Owner | Business priorities, RTO/RPO, budget, hosting criteria | NOT ATTESTED | Review and attest |
| Legal/DPO | Privacy, residency, transfers, retention | NOT ATTESTED | Review and attest |
| IT/Security | Technical requirements and constraints | NOT ATTESTED | Review and attest |
| Business/BCM | BIA, MTD, RTO/RPO, recovery priority | NOT ATTESTED | Review and attest |
| Finance | Budget/TCO/cost envelope | NOT ATTESTED | Review and attest |

Part 10 of the fact pack currently contains Owner, Legal/DPO, IT, and Business/BCM slots only, all blank. Finance attestation is still required (GC-40 / GC-45) even though the fact pack has no Finance sign-off row. This register does **not** add names or tick Part 10.

---

# ADR-0006 Questionnaire Completion Criteria

The questionnaire will only be considered ready when:

1. all required questions have a substantive answer or explicitly approved N/A;
2. all material contradictions are reconciled;
3. RTO/RPO/BIA requirements are reconciled;
4. Owner requirements are confirmed;
5. Business/BCM requirements are confirmed;
6. Legal/DPO requirements are confirmed;
7. IT/Security requirements are confirmed;
8. Finance requirements are confirmed;
9. PCI scope is established sufficiently for architecture;
10. hosting/residency requirements are defined;
11. recovery requirements are defined;
12. required stakeholder attestations are recorded;
13. ADR-0006 decision inputs are sufficient to construct the formal decision package.

Questionnaire completion is **not** Production approval, deployment authorization, or implementation authorization.

---

# Question coverage map

Every fact-pack question ID maps to at least one gap ID. Mapping is not an answer.

| Source IDs | Gap ID(s) |
| --- | --- |
| O1 | GC-04 |
| O2; Q14; Q15 | GC-05 |
| O3; O4; O5 | GC-06 |
| O6; O7 | GC-07 |
| O8 Q1, Q2, Q4, Q6–Q8 | GC-02 |
| O8 Q3, Q5, Q9–Q12 | GC-01 |
| Q13 | GC-01 |
| O9 | GC-03, GC-08 |
| O10; Cost Q1–Q4 | GC-09, GC-40 |
| O11 | GC-10 |
| O12 | GC-11, GC-35 |
| O13; Q16–Q25 | GC-12 |
| L1 (law text) | GC-13 |
| L1 (establishment) | GC-04 |
| L2; L3; L4; L5; L6 | GC-13 |
| L7 | GC-18 |
| L8 | GC-14 |
| L9; L10 | GC-16 |
| L11 | GC-15 |
| L12 | GC-17 |
| L13; L14 | GC-07, GC-18 |
| L15 | GC-19 |
| L16 | GC-39 |
| L17 retention | GC-20 |
| L17 confirmation / hosting restrictions | GC-21 |
| I1 | GC-22, GC-23 |
| I2 | GC-30 |
| I3; I4 | GC-36, GC-19 |
| I5; I16 | GC-34, GC-35 |
| I6 | GC-11, GC-35 |
| I7; I8 | GC-33 |
| I9 | GC-26 |
| I10 | GC-03, GC-27 |
| I11; I12; I17; I18 | GC-36 |
| I13 | GC-32 |
| I14 | GC-31 |
| I15 | GC-03, GC-28, GC-29 |
| I19 | GC-37 |
| I1–I19 IT owner / Part 10 IT | GC-38, GC-45 |
| PCI-1–PCI-19; PCI STATUS; Section 4 Owner/Legal rows | GC-39 |
| BIA A–J items 1–3, 8–9 | GC-02, GC-44 |
| BIA A–J items 4–6 | GC-01, GC-03 |
| BIA A–J item 7; time-to-impact; regulatory | GC-44 |
| Section 6 approved RTO/RPO | GC-01 |
| Section 7 posture checkboxes; Q1–Q11 | GC-01, GC-03, GC-17 |
| Residency Q1–Q11; matrix rows | GC-15, GC-06, GC-07 |
| Residency Q12–Q15 | GC-16, GC-19 |
| Cost Q5–Q7; Section 9 alternatives gap | GC-41 |
| Exit Q1–Q6, Q8, Q10 | GC-42 |
| Exit Q7, Q9 | GC-43 |
| Part 10 Owner, Legal/DPO, IT, Business/BCM | GC-45 |
| Finance attestation (no Part 10 row) | GC-40, GC-45 |
| Architecture 12.3 proposed RTO/RPO | GC-01 (must remain NOT APPROVED until reconciliation) |
| ADR-0011 Production backup product TBD | GC-28 |
| ADR-0012 | GC-31 |
| ADR-0013 | GC-30 |
| DP-0006 options A–D not selected | GC-22 |

---

## Current status

`RED — NOT CLEARED`

## Immediate next action

`Complete stakeholder gap closure and obtain required attestations.`

## First priority

`Reconcile RTO/RPO/BIA requirements.`

## Second priority

`Resolve Owner hosting/geography/budget requirements.`

## Third priority

`Obtain Legal/DPO, IT/Security, Business/BCM and Finance validation.`

## Fourth priority

`Establish the ADR-0006 decision package.`

## Implementation authorization

`NOT AUTHORIZED BY THIS TASK.`
