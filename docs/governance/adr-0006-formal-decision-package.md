# ADR-0006 / DP-0006 Formal Decision Package

> **`FORMAL DECISION PACKAGE — DECISION-READINESS GATE — NOT PRODUCTION AUTHORIZATION`**  
> **STAGE: 5**  
> **RECOMMENDED OUTCOME: `DEFER / NOT READY`**  
> **ARCHITECTURE DECISION: `NOT YET APPROVED`**

This package is the Stage 5 **decision-readiness** record for ADR-0006 (Hosting and data residency) and DP-0006 (Hosting & Data Residency). It determines whether current evidence is sufficient to make a **defensible** architecture decision.

**It is not.** The supported outcome is **DEFER / NOT READY**, with explicit evidence gaps and mandatory closure conditions.

This stage does **not**:

- select a hosting provider, cloud vendor, region, or Production topology;
- invent provider capabilities, prices, legal approvals, Finance approval, IT/Security approval, or stakeholder signatures;
- invent Production RTO/RPO guarantees;
- approve a jurisdiction;
- approve ADR-0006 or DP-0006;
- authorize implementation, migrations, UAT, Production, or deployment.

**ADR-0006 approval is not Production authorization.**  
**DP-0006 approval is not implementation authorization.**  
**Architecture selection is not implementation authorization.**  
**None of those approvals is granted by this package.**

This document does **not** rewrite prior governance files, ADR-0006, or DP-0006.

---

# 1. Documents reviewed (audit trail)

Reviewed, not rewritten:

| Document | Role in this package |
| --- | --- |
| [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md) | Historical questionnaire; Legal L1–L17 **draft**; IT I1–I19 **draft**; Part 10 **unsigned** |
| [`adr-0006-stakeholder-gap-closure-register.md`](adr-0006-stakeholder-gap-closure-register.md) | `RED — NOT CLEARED` |
| [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) | Stage 1 Owner-authorized **business** positions; named attestations **blank** |
| [`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md) | Stage 2 A1–A20 / B1–B38 **OPEN**; C1–C14 **UNANSWERED** |
| [`adr-0006-architecture-decision-package.md`](adr-0006-architecture-decision-package.md) | Stage 3 Options A–D; **INSUFFICIENT EVIDENCE FOR FINAL RANKING** |
| [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) | Gates E1–E4; Stage 5 intended after gates sufficiently closed |
| [`adr-0006-legal-data-placement-evidence.md`](adr-0006-legal-data-placement-evidence.md) | Stage 4A; E1 **OPEN**; LE-01–LE-20 not attested |
| [`adr-0006-technical-rto-rpo-laboratory-test-plan.md`](adr-0006-technical-rto-rpo-laboratory-test-plan.md) | Stage 4B plan + run actuals |
| [`adr-0006-technical-rto-rpo-laboratory-results.md`](adr-0006-technical-rto-rpo-laboratory-results.md) | Run `20260915-183034`; **laboratory evidence only** |
| [`adr-0006-technical-rto-rpo-laboratory-remediation.md`](adr-0006-technical-rto-rpo-laboratory-remediation.md) | RM-01–RM-14 **OPEN** |
| [`adr-0006-hosting-capability-evidence.md`](adr-0006-hosting-capability-evidence.md) | Stage 4C; E3 **OPEN**; HE-01–HE-40 none **CONFIRMED** |
| [`adr-0006-tco-evidence.md`](adr-0006-tco-evidence.md) | Stage 4D; E4 **OPEN**; TE-01–TE-27 **NOT RECEIVED** / **UNKNOWN** |
| [`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md) | **proposed — blocked for Production** |
| [`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md) | **OPEN — NOT APPROVED** |
| [`evidence/e2-lab/SAFETY.md`](evidence/e2-lab/SAFETY.md) | Isolated Dev/Test lab; torn down after run |
| [`evidence/e2-lab/runs/20260915-183034/`](evidence/e2-lab/runs/20260915-183034/) | LAB-01–LAB-12 JSON artefacts |

Related records **not modified:** ADR-0003, ADR-0004, ADR-0005, ADR-0011, ADR-0012, ADR-0013, ADR-0015, ADR-0017.

**Workplan note:** Stage 4 / Gate E4 exit criteria stated that Stage 5 should occur only after gates are sufficiently closed. They are **not**. This package is therefore a **formal deferral**, not a hosting selection.

---

# 2. Current baseline (carried forward exactly)

These are **existing** governance positions. They are **not** re-decided here.

## 2.1 Business requirements

| Item | Position | Evidence class |
| --- | --- | --- |
| Critical functions | **Commercial/RFP intake** and **Programme Building** are jointly critical | **BUSINESS REQUIREMENT** (Stage 1) |
| Recovery sequence | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers | **BUSINESS REQUIREMENT** (Stage 1) |
| MTD | **<= 3 hours** | **BUSINESS REQUIREMENT** (Stage 1) |
| Critical RTO | **<= 3 hours** | **BUSINESS REQUIREMENT** (Stage 1) |
| Overall RTO | **<= 4 hours** | **BUSINESS REQUIREMENT** (Stage 1) |
| Recovery action | Begins **immediately** (commencement, not instantaneous restoration) | **BUSINESS REQUIREMENT** (Stage 1) |
| Business data-loss | **Zero tolerated loss of critical business data** | **BUSINESS REQUIREMENT** (Stage 1) |
| Technical RPO | **NOT** declared as zero. Must be established through qualified architecture and evidence. Historical **3-hour RPO** is **superseded** | **BUSINESS REQUIREMENT** + open **DESIGN EXPECTATION** |
| Restore-from-backup | Desired **recovery capability**, **not** an approved Production topology | **BUSINESS REQUIREMENT** / **DESIGN EXPECTATION** |
| Named Stage 1 attestation | **Blank** — company decision positions exist; they are **not** personal signatures | Governance recording required |

## 2.2 Architecture

| Item | Position | Evidence class |
| --- | --- | --- |
| In-memory `Store` | **Not** acceptable as Production durable SoR (ADR-0017 Dev/Test) | **ARCHITECTURE FACT** |
| Production SoR | Durable **PostgreSQL** unless a later **approved** architecture establishes an equivalent (ADR-0003) | **DESIGN EXPECTATION** |
| Stage 4B | Synthetic PostgreSQL laboratory run `20260915-183034` demonstrated useful recovery **mechanisms** | **LABORATORY OBSERVATION** |
| Stage 4B did **not** recover actual EOS Commercial/Programme Building runtime | Architecture-critical (RM-01) | **ARCHITECTURE FACT** + **LABORATORY OBSERVATION** |
| Synchronous replication | Zero transaction loss **only** for the tested laboratory failure model/configuration (LAB-04); one host | **LABORATORY OBSERVATION** |
| Asynchronous replication | Non-zero potential data loss (LAB-05, LAB-10) | **LABORATORY OBSERVATION** |
| Warm standby | **PARTIAL** — database level only (LAB-06) | **LABORATORY OBSERVATION** |
| Application + database recovery | **PARTIAL** (LAB-07) | **LABORATORY OBSERVATION** |
| Production IdP / CDN / WAF / email / KMS | **Not demonstrated** | **NOT PRODUCTION EVIDENCE** |
| Independent AZ / region failure | **Not demonstrated** | **NOT PRODUCTION EVIDENCE** |
| Lab RTO ~2.3–10.1 s | **Laboratory observation only** — **not** Production RTO | **LABORATORY OBSERVATION** |

## 2.3 Legal

| Item | Position | Evidence class |
| --- | --- | --- |
| Production jurisdiction | **Not approved** | **NOT LEGAL APPROVAL** |
| Tanzania | Preferred **candidate for assessment**, **not** an approved Production jurisdiction | **BUSINESS REQUIREMENT** (preference) |
| Kenya / EU/EEA / other | Remain **candidates** subject to Legal/DPO assessment | Open |
| Highly Restricted data | Stricter **approved-jurisdiction** rule; **primary jurisdiction is not approved** | **BUSINESS REQUIREMENT** pending Legal |
| Cross-border processing / remote support | Require appropriate legal/security controls; **no mechanism approved** | **REQUIRES LEGAL/DPO VALIDATION** |
| Stage 4A LE-01–LE-20 | Not attested | E1 **OPEN** |
| Fact-pack Legal text | **DRAFT** — not certification | **NOT LEGAL APPROVAL** |

## 2.4 Financial

| Item | Position | Evidence class |
| --- | --- | --- |
| Finance/Owner budget ceiling | **Not provided** (C1–C14 unanswered; O10 no figure) | **NOT FINANCE APPROVAL** |
| Provider quotes | **None received** (TE-03–TE-06) | **NOT** a price |
| 3-year TCO | **Not established** — totals `UNKNOWN — QUOTE REQUIRED` | Structure only |
| Prices in this package | **None invented** | — |

## 2.5 Governance

| Item | Status |
| --- | --- |
| E1 | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| E2 | `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED` |
| E3 | `OPEN — HOSTING EVIDENCE IN PROGRESS` |
| E4 | `OPEN — TCO EVIDENCE INCOMPLETE` |
| ADR-0006 | `PROPOSED — BLOCKED FOR PRODUCTION` |
| DP-0006 | `OPEN — NOT APPROVED` |
| Provider / region / topology | **NOT SELECTED** / **NOT APPROVED** |
| Production / deployment / migrations / implementation / UAT | **NOT AUTHORIZED** |

Planning capacity assumptions (Stage 1; **not** measured Production usage): **up to 500 users**, **up to 200 concurrent**, **30% growth**.

---

# 3. Evidence classification (do not conflate)

| Category | Meaning | May be used to |
| --- | --- | --- |
| **BUSINESS REQUIREMENT** | Stage 1 Owner-authorized company position | Define the outcome the architecture must serve |
| **DESIGN EXPECTATION** | Intended behaviour of a candidate class, not measured in Production | Frame capability envelope |
| **LABORATORY OBSERVATION** | Timed Dev/Test result, run `20260915-183034` | Inform architecture implications; **not** Production proof |
| **PROVIDER CLAIM** | Vendor assertion | **None recorded** — no candidate named |
| **LEGAL APPROVAL** | Attested Legal/DPO decision | **None recorded** |
| **FINANCE APPROVAL** | Attested budget/TCO envelope | **None recorded** |
| **PRODUCTION EVIDENCE** | Tested on an authorized Production (or Production-like) estate | **None recorded** |
| **PRODUCTION AUTHORIZATION** | Explicit permission to run live Production | **Not granted** |

**Prohibited inferences in this package:**

- Laboratory RTO ≠ Production RTO.  
- Laboratory zero committed-loss on one host ≠ Production RPO = 0.  
- Business zero data-loss ≠ technical RPO automatically 0.  
- Tanzania candidate preference ≠ approved jurisdiction.  
- Managed-cloud **preference** ≠ selected provider or region.  
- Draft Legal fact-pack text ≠ Legal/DPO approval.  
- Missing price ≠ zero cost.  
- Option class remaining open ≠ option selected.  
- Stage 5 existing as a document ≠ ADR-0006 approved.

---

# 4. Decision-readiness matrix

Vocabulary: **READY** · **PARTIALLY READY** · **NOT READY**

**READY** means evidence is sufficient to support a defensible Production architecture **decision** on that item (not that Production is authorized).  
Unknowns are **not** converted into assumptions.

| # | Item | Status | Basis |
| --- | --- | --- | --- |
| 1 | Business requirements | **PARTIALLY READY** | Stage 1 records jointly critical functions, sequence, MTD, RTO, business data-loss, non-negotiables. Named Owner/BCM signatures remain **blank**. Fact pack / gap register remain `RED`. Controller/establishment (O1) still required. |
| 2 | RTO | **PARTIALLY READY** | **Business** critical RTO <=3 h and overall <=4 h are recorded. **Technical** Production RTO is **not** proven. Lab RTO 2.3–10.1 s is **LABORATORY OBSERVATION** of synthetic PostgreSQL on one host, not recovery of jointly critical EOS modules. |
| 3 | Technical RPO | **NOT READY** | Technical RPO is **not** formally established. Lab RPO is **qualified per failure model** (T1 loss after backup; T3 zero committed loss for tested F11; T4 RPO > 0). Workplan Q3 unanswered. B7 **OPEN**. |
| 4 | Persistence architecture | **PARTIALLY READY** | Requirement known: Production SoR = durable PostgreSQL unless later approved equivalent. Current runtime for jointly critical modules remains in-memory `Store` (ADR-0017). Cutover **NOT AUTHORIZED**. RM-01 **OPEN**. |
| 5 | PostgreSQL production design | **NOT READY** | No Production PostgreSQL topology, product, HA control plane, or managed offering is selected or attested. Lab used `postgres:16-alpine` in isolated Docker. ADR-0003 is Development. B3 **OPEN**. |
| 6 | HA capability | **PARTIALLY READY** | Lab T3 **DEMONSTRATED** (one host); T6 **PARTIALLY DEMONSTRATED** (scripted promote, not a product). Independent AZ, fencing, split-brain (F10) **not** demonstrated. HE-09/HE-12 unverified. |
| 7 | Geographic DR | **NOT READY** | DR jurisdiction **NOT APPROVED** (LE-09). Lab T4 simulated site on one laptop — **not** geography. Async **LABORATORY** RPO > 0. No candidate DR offering. |
| 8 | Backup / PITR | **PARTIALLY READY** | Lab T1/T2/LAB-08/09 **DEMONSTRATED** on synthetic data. ADR-0011 Production backup product **TBD**. F7 untested. No provider backup/PITR evidence (HE-06–HE-08). 19:00 EAT is a **future** schedule requirement, not a proven job. |
| 9 | Application recovery | **NOT READY** | LAB-07 **PARTIAL**; CRM org `UNEXPECTEDLY_PRESENT`; jointly critical modules not on PostgreSQL SoR. Application warm standby missing (RM-06). HE-37 **REQUIRES TECHNICAL TEST**. |
| 10 | Security architecture | **NOT READY** | Envelope F specified; HE-18–HE-27 none **CONFIRMED**. Lab did not demonstrate encryption/KMS/WAF. ADR-0012 **OPEN**. |
| 11 | Identity architecture | **NOT READY** | ADR-0013 **OPEN**. Dev local issuer is not a Production IdP. E1.10 / LE-13 **UNKNOWN**. |
| 12 | Network architecture | **NOT READY** | Envelope H; HE-23–HE-25 **UNKNOWN**. No candidate VPC/WAF/CDN evidence. |
| 13 | Data residency | **NOT READY** | No Production, backup, or DR jurisdiction approved. Tanzania is a **candidate**. All Stage 4A placement cells **NOT APPROVED**. |
| 14 | Legal transfer mechanism | **NOT READY** | None approved (LE-03, L10). Foreign support is a separate transfer (LE-11). |
| 15 | PCI scope | **NOT READY** | Design position: no raw CHD in normal EOS architecture. `PCI DSS STATUS NOT ESTABLISHED` (Decision 13; LE-19; AR-13). |
| 16 | Provider capability evidence | **NOT READY** | No named `CANDIDATE — NOT SELECTED`. HE-01–HE-40 none **CONFIRMED**. No **PROVIDER CLAIM** recorded. |
| 17 | Region capability evidence | **NOT READY** | No region catalogue verified. HE-01–HE-03 **UNKNOWN**. |
| 18 | Finance budget envelope | **NOT READY** | C1–C14 `UNANSWERED — REQUIRES FINANCE/OWNER INPUT`. TE-01, TE-21, TE-22 **NOT RECEIVED**. |
| 19 | 3-year TCO | **NOT READY** | Comparison structure exists; all Option A–D totals `UNKNOWN — QUOTE REQUIRED`. Confidence **UNKNOWN**. |
| 20 | Exit / portability | **PARTIALLY READY** | Stage 1 Decision 12 principles recorded. Contractual exit duration, fees, notice **not invented**. AR-12 / TE-17 **UNKNOWN**. |
| 21 | Operational support | **NOT READY** | I6 24/7 **NOT PROVEN**. O12 operating model still required. HE support items unverified. Foreign support Legal **OPEN**. |
| 22 | Monitoring / incident response | **NOT READY** | Lab detection was scripted (RM-13). No Production observability stack evidenced. |
| 23 | Production capacity | **NOT READY** | Planning assumptions 500/200/30% only. CPU/RAM/GB/RPS/log volume **not invented**. TE-25 **NOT RECEIVED**. |
| 24 | DR testing capability | **PARTIALLY READY** | Isolated lab drills exist as **LABORATORY OBSERVATION**. Production DR exercise programme, cadence, and failback on a candidate estate **not** evidenced. |

**Overall decision-readiness:** **NOT READY**

Count: **READY = 0** · **PARTIALLY READY = 8** · **NOT READY = 16**

---

# 5. Hard-blocker analysis

Classification:

- **BLOCKING** — a defensible Production architecture **selection** cannot be made until closed.  
- **CONDITIONALLY BLOCKING** — does not by itself forbid recording a later **conditional** class direction, but **does** block final ADR-0006/DP-0006 approval and any provider/region/topology selection until closed.  
- **NON-BLOCKING** — may remain open without preventing a later architecture **class** decision, provided it is tracked.

No item below is treated as cleared. None is treated as already fatal to all option classes.

| Unresolved item | Class | Why |
| --- | --- | --- |
| Unresolved **Production jurisdiction** | **BLOCKING** | E1.1 / LE placement matrices are **NOT APPROVED**. Selecting Option A, B, C, or D as Production hosting would imply a jurisdiction class. Legal/DPO has not permitted, permitted-with-conditions, or forbidden any destination. |
| Unresolved **backup / DR jurisdiction** | **BLOCKING** | Copies are separate legal decisions (L12; LE-08–LE-10). An architecture that includes backup, WAL, replica, or standby **places data**. Those locations are not approved. Stage 1 requires secure backup and DR as business non-negotiables. |
| Unresolved **technical RPO** | **BLOCKING** | Business requires zero tolerated **critical** data loss. Technical RPO is **not** zero by declaration. Without a formally established, failure-model-qualified technical RPO, no topology can be shown to meet or qualify the business requirement. Q3 unanswered. |
| Unresolved **actual application persistence** | **BLOCKING** | Jointly critical Commercial/Programme Building runtime is still in-memory. Lab recovered **synthetic PostgreSQL**, not those modules (RM-01). An architecture cannot be selected as meeting Stage 1 function recovery while the SoR of those functions remains non-durable. |
| Unresolved **application + DB recovery** | **BLOCKING** | LAB-07 **PARTIAL**. Warm standby app path missing (RM-06). Envelope I requires application + PostgreSQL + critical dependencies. That combined recovery is **not** demonstrated on the actual critical runtime. |
| Unresolved **Production identity / secrets** | **BLOCKING** (for Production architecture that includes live identity/secrets) / **CONDITIONALLY BLOCKING** (for a later class-only direction) | ADR-0012 and ADR-0013 **OPEN**. Production IdP/KMS locations are E1 issues. A named Production stack cannot be approved without them. A **conditional architecture direction** may still list IAM/MFA/KMS as required capabilities without selecting products. |
| Unresolved **provider evidence** | **BLOCKING** (for provider or class **selection**) | E3 open; no candidate named; no **CONFIRMED** HE item. Selecting a class as the Production architecture without any verified offering in that class would invent capability. |
| Unresolved **security capabilities** | **BLOCKING** (for final approval) / **CONDITIONALLY BLOCKING** (for class direction) | Stage 1 non-negotiables include access control, auditability, secrets, data protection. None **PRODUCTION PROVEN**. HE security rows **UNKNOWN**. |
| Unresolved **Finance envelope** | **CONDITIONALLY BLOCKING** | Stage 1 requires comparable 3-year TCO and forbids cost overriding recovery/legal/security — but also requires financial sustainability. Envelope unanswered. A class cannot be **ranked** or **approved** as affordable. Cost principles still allow **deferral** without inventing a budget. |
| Unresolved **TCO** | **CONDITIONALLY BLOCKING** | E4 incomplete. Workplan: do not eliminate on TCO until envelope exists. Do **not** select an option as cheapest or dearest. Blocks **approval** of a financially comparable packet; does not invent a winner. |
| Unresolved **PCI scope** | **CONDITIONALLY BLOCKING** | Design position excludes raw CHD from normal EOS stores/backups/DR. Scope **NOT ESTABLISHED**. Blocks claiming PCI-compliant architecture; does not by itself select or eliminate A–D **if** the design position is later validated. |
| Unresolved **operational support** | **CONDITIONALLY BLOCKING** | Immediate recovery **initiation** is a business requirement. 24/7 SEDMC function **NOT PROVEN**. Support model and foreign-access Legal remain open. Blocks proving operational feasibility of any class. |
| Unresolved **exit terms** | **CONDITIONALLY BLOCKING** | Decision 12 requires contractual exit/return/deletion. Exact fees/notice **unknown**. Blocks treating any class as portable in contract; principles exist. |

**Conclusion:** Multiple **BLOCKING** items are open. A defensible **selection** of Option A, B, C, or D — or of a provider, region, or topology — is **not** supported.

---

# 6. Options A–D (unselected; not ranked; not eliminated)

No option is ranked. No option is eliminated. There is **no** authoritative evidence proving that A, B, C, or D **cannot** satisfy a mandatory requirement. E1/E3/E4 remain open.

Stage 3 remains: **INSUFFICIENT EVIDENCE FOR FINAL RANKING.**  
Stage 4C screen remains: A and B **technically plausible with conditions**; C **evidence gap** (kept viable); D **evidence gap** (not default). That screen is **not** a selection.

## OPTION A — African-region managed cloud

| Aspect | Record |
| --- | --- |
| Potential strengths | Aligns with Stage 1 **managed cloud preferred direction** (preference only). Possible East Africa latency vs EU (**unmeasured**). Managed HA/backup/PITR **class** is a **DESIGN EXPECTATION**, not proven for any named offering. |
| Potential weaknesses | Africa ≠ Tanzania. Foreign African region is still a **transfer** unless Legal says otherwise. Region feature gaps **UNKNOWN**. No catalogue (HE-01). |
| Evidence currently available | Stage 3 conceptual comparison; Stage 4C envelope; Stage 4B lab mechanisms (provider-neutral); Stage 1 managed-cloud **preference**. |
| Evidence missing | Named `CANDIDATE — NOT SELECTED`; Legal approval of a specific African jurisdiction for Production **and** copies; provider HA/PITR/DR/security/support/SLA; quotes; latency measurements. |
| Legal dependency | E1.1–E1.13; LE-03, LE-04, LE-08–LE-12. **OPEN**. |
| Technical dependency | Envelope A–I on a real offering; RM-01 persistence; multi-AZ not lab-proven. |
| Financial dependency | TE-03, TE-07–TE-17 **NOT RECEIVED**. |
| Operational dependency | Support hours; foreign support access; SEDMC vs managed ops. |
| Exit / portability | Decision 12 principles; contract terms **UNKNOWN**. |
| Current decision status | **NOT SELECTED** — remains a **viable candidate class** pending evidence. |

## OPTION B — EU/EEA managed cloud

| Aspect | Record |
| --- | --- |
| Potential strengths | Workplan **mandatory comparison** class. Mature managed-cloud **class** is a **DESIGN EXPECTATION**. Same laboratory mechanism bar as A. |
| Potential weaknesses | Tanzania→EU and (if GDPR applies) EU→non-EEA transfers **unassessed**. EU hosting is **not** automatically lawful or unlawful. East Africa latency **unmeasured**. GDPR applicability **UNKNOWN** (LE-06). No SCCs/adequacy cited. |
| Evidence currently available | Same provider-neutral lab + envelope as A. No EU region catalogue (HE-02). |
| Evidence missing | GDPR/UK GDPR applicability; transfer mechanism; subprocessors; latency; quotes; named candidate. |
| Legal dependency | LE-06, LE-07, LE-08–LE-12. **OPEN**. |
| Technical dependency | Same envelope; latency vs <=3 h RTO for field/admin users **REQUIRES TECHNICAL TEST** (HE-39). |
| Financial dependency | TE-04 **NOT RECEIVED**; egress/replication often material — amounts **UNKNOWN**. |
| Operational dependency | EU vendor support may still be extra-EEA access (transfer). |
| Exit / portability | Same as A until contracts exist. |
| Current decision status | **NOT SELECTED** — remains a **viable candidate class** pending evidence. |

## OPTION C — Tanzania-controlled hosting

| Aspect | Record |
| --- | --- |
| Potential strengths | Aligns with Owner **candidate** geography **if** data and copies actually remain in Tanzania. May reduce some transfer analyses **if** SaaS/IdP/CDN/logs/support also stay in-jurisdiction — **not evidenced**. |
| Potential weaknesses | No facility survey (HE-03). HA/failure-domain **UNKNOWN**. Tanzania Production ≠ automatic Tanzania backups. Geo-DR may still force a transfer. Ops burden **may** be higher; 24/7 **NOT PROVEN**. Do **not** assume sufficient local cloud/facility capability. |
| Evidence currently available | Stage 1 candidate preference; Stage 4A L1 sketch (not approval); laboratory mechanisms are **not** a Tanzanian facility test. |
| Evidence missing | Facility/provider catalogue; SLA; power/network; restore tests at the facility; Legal due diligence; second-site or approved offshore copy; quotes (TE-05). |
| Legal dependency | LE-01, LE-02, LE-04, LE-08–LE-12; onshore facility still has vendors. **OPEN**. |
| Technical dependency | Same envelope without assuming a managed control plane, **or** the facility must supply it. |
| Financial dependency | TE-05 **NOT RECEIVED**. |
| Operational dependency | SEDMC or local operator model (O12 unanswered). |
| Exit / portability | May reduce hyperscaler lock-in and increase **operational** lock-in — **provisional**, not measured. |
| Current decision status | **NOT SELECTED** — **kept viable** until evidence eliminates or supports it. |

## OPTION D — Hybrid

| Aspect | Record |
| --- | --- |
| Potential strengths | Only becomes rational **after** classification-to-geography rules exist (Legal A14–A15 **OPEN**; L3 is a **company recommendation**, not legal advice). Can split by classification **if** Legal requires it. |
| Potential weaknesses | Highest complexity; more transfer paths; split-brain and partial-outage risk; harder recovery testing; typically not lowest cost (**unquoted**). Stage 3: **not** the default. |
| Evidence currently available | Conceptual Stage 3/4C mapping. HE-04 hybrid component map **UNKNOWN**. Lab did **not** demonstrate hybrid. |
| Evidence missing | Approved classification matrix; per-component locations; join RTO/RPO tests; dual-estate operations; component quotes (TE-06). |
| Legal dependency | LE-17, LE-18; every split is a transfer/access path. **OPEN**. |
| Technical dependency | Combined recovery of jointly critical functions across the join still <=3 h / <=4 h — **not demonstrated**. |
| Financial dependency | TE-06 **NOT RECEIVED**. |
| Operational dependency | Two estates unless a managed operator runs both. |
| Exit / portability | Dual lock-in possible. |
| Current decision status | **NOT SELECTED** — **kept viable** until evidence eliminates it; **not** recommended as default. |

---

# 7. Decision outcomes — which is supported now?

| Code | Outcome | Meaning | Supported now? |
| --- | --- | --- | --- |
| **A. APPROVE** | Select an architecture class and update ADR-0006/DP-0006 to approved | Requires closed blocking gates | **No** |
| **B. APPROVE WITH CONDITIONS** | Approve a class with explicit residual conditions | Still requires enough evidence to name the class without inventing capability, legality, or cost | **No** — blocking Legal, persistence, provider, and technical-RPO items remain |
| **C. DEFER / NOT READY** | Record that evidence is insufficient; keep A–D open; do not select | Matches current evidence | **Yes — selected outcome of this package** |
| **D. REJECT CURRENT OPTIONS** | Eliminate A–D as a set | Requires authoritative proof that **no** remaining class can satisfy mandatory requirements | **No** — no such proof |
| **E. REOPEN EVALUATION** | Discard the option set and start a new comparison frame | No evidence that A–D are the wrong frame | **No** — keep A–D |

**Determined outcome:**

# `C. DEFER / NOT READY`

Required evidence is absent. Inventing a selection would violate the governance boundary.

ADR-0006 remains **proposed — blocked for Production**.  
DP-0006 remains **OPEN — NOT APPROVED**.  
This package does **not** amend those records.

---

# 8. Conditional architecture direction

The following is a **CONDITIONAL ARCHITECTURE DIRECTION** only.

It is inferred from Stage 1 business requirements, Stage 4B **LABORATORY OBSERVATION**, and the Stage 4C capability envelope. It is **not**:

- a final Production architecture selection;
- a selected option among A–D;
- a named provider, region, or topology;
- Production authorization;
- a claim that these controls already exist.

**CONDITIONAL ARCHITECTURE DIRECTION** (capabilities to evaluate and, if later selected, to implement under separate authorization):

1. **Durable PostgreSQL** as Production system of record for jointly critical Commercial/RFP and Programme Building state (and other durable business state), unless a later **approved** equivalent architecture is established. Current in-memory `Store` is **not** acceptable as Production SoR.  
2. **Same-failure-domain synchronous HA** as a **candidate** mechanism if Owner requires qualification of **zero committed-transaction loss** for primary-loss models in which a sync standby survives. Lab: LAB-04 only; one host; **not** independent AZ; **not** a HA product.  
3. **Geographic asynchronous replication / WAL-based DR** as a **candidate** for site/region loss, with **explicit non-zero technical RPO** unless later evidence proves otherwise. Lab: LAB-05/10 **RPO > 0**. Do **not** claim zero RPO for async geo-DR.  
4. **WAL archiving and PITR** for logical corruption, operator error, and point-in-time recovery. Lab: LAB-02/08/09. HA replicas **replicate** logical corruption; PITR remains required even if sync HA exists.  
5. **Independent, encrypted backups** with restore testing; backup-only **cannot** meet **unqualified** zero business loss between backups (LAB-01). Restore-from-backup remains a desired **capability**, not an approved sole topology.  
6. **Strong IAM / MFA** and Production identity (OIDC to a corporate IdP — product **not** selected; ADR-0013 **OPEN**).  
7. **Managed secrets / KMS** (ADR-0012 **OPEN** — product **not** selected).  
8. **Secure network segmentation**, TLS, and evaluation of WAF/DDoS — processing locations are Legal issues (E1.11).  
9. **Application + database + critical-dependency recovery** (identity, secrets, email, object storage as applicable) inside the business RTO clock. **Not** demonstrated for actual jointly critical EOS modules.  
10. **Tested restoration, failover, and failback** on the chosen class, including detection time (lab detection was scripted — RM-13).

**Managed cloud** remains the Stage 1 **preferred direction only**. It does **not** select Option A or B, and it does **not** eliminate C or D.

**No provider is named.** No authoritative provider evidence exists in this repository.

---

# 9. Formal decision conditions (mandatory closure before APPROVE or APPROVE WITH CONDITIONS)

None of the following is claimed as already completed unless separately evidenced — **none is**.

1. Legal/DPO approves the applicable data-placement model (Production, backup, DR, warm standby if proposed, support, logs, IdP, CDN/WAF).  
2. Production, backup, and DR jurisdictions are **identified and approved** (Tanzania remains a candidate until that occurs).  
3. Technical RPO is **formally established** under stated failure models, without converting business zero-loss into RPO = 0 by assumption.  
4. Application persistence is **resolved** (Production SoR for jointly critical modules; in-memory Store not used as Production SoR).  
5. Application + database recovery is **demonstrated** for the actual critical runtime (not only synthetic laboratory tables).  
6. Provider capability evidence is obtained for remaining candidate class(es), labelled `CANDIDATE — NOT SELECTED` until selection is authorized.  
7. Security and identity architecture is validated (including ADR-0012/ADR-0013 closure or an attested interim).  
8. Finance/Owner budget envelope is established **or** formally marked intentionally open.  
9. Comparable 3-year TCO is established from quotes/evidence (no fabricated prices; UNKNOWN ≠ 0).  
10. PCI scope is established sufficiently for the architecture decision (`PCI DSS STATUS NOT ESTABLISHED` today).  
11. Operational support model is defined (including 24/7 / hybrid / foreign support Legal overlay).  
12. Exit/portability terms are confirmed at a contractual level sufficient for Decision 12.  
13. Required stakeholder attestations are obtained (Owner/BCM named blocks; Legal/DPO; IT/Security; Finance — currently blank).  
14. ADR-0006 is **formally updated** after a supported outcome other than DEFER.  
15. DP-0006 is **formally updated** after a supported outcome other than DEFER.

Until these conditions are met, **APPROVE** and **APPROVE WITH CONDITIONS** remain unsupported.

---

# 10. Governance decision record

| Field | Value |
| --- | --- |
| **Decision** | **DEFER / NOT READY** — evidence is insufficient for a defensible architecture selection |
| **Decision date** | **NOT RECORDED** — no named authority has dated an approval or rejection in this package |
| **Decision authority** | **NOT RECORDED** — this package does not fabricate Owner, Legal/DPO, IT/Security, or Finance authority |
| **Decision status** | **DEFERRED — NOT READY FOR ADR-0006 / DP-0006 APPROVAL** |
| **Scope** | Hosting and data residency architecture **class** comparison for Serengeti Experience DMC EOS (Production/UAT hosting, data residence, backup/DR copies) |
| **Selected option** | **NOT SELECTED** |
| **Selected provider** | **NOT SELECTED** |
| **Selected region** | **NOT DECIDED / NOT APPROVED** |
| **Selected topology** | **NOT SELECTED** |

Residual ADR/DP status (unchanged by this task):

| Record | Status |
| --- | --- |
| ADR-0006 | **proposed — blocked for Production** |
| DP-0006 | **OPEN — NOT APPROVED** |

---

# 11. Risk register

Likelihood and impact are **qualitative**. No percentages. Residual uncertainty remains high where evidence is absent.

| ID | Risk | Impact | Likelihood | Current controls | Residual uncertainty | Closure condition |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Data loss beyond a later technical RPO / beyond business zero-loss expectation | **HIGH** — critical commercial/programme data | **UNKNOWN** in Production (lab: T1 and T4 lose committed work under stated models; T3 did not for tested F11) | Stage 1 business requirement; lab characterisation; envelope forbids backup-only as unqualified zero-loss | Production failure models, detection delay, replica geography | Formal technical RPO + tested topology on durable SoR |
| R-02 | Application state not durable | **HIGH** — jointly critical functions | **HIGH** on current Dev/Test runtime (ADR-0017) | Governance recognition; RM-01 **OPEN**; Production SoR requirement recorded | Cutover design, dual-write gaps, migration authorization | Persistence implemented and tested under separate authorization |
| R-03 | Recovery of actual critical runtime unproven | **HIGH** | **HIGH** (LAB-07 PARTIAL; synthetic stand-ins) | Lab register; remediation RM-01/RM-06/RM-07 | Process tree, app standby, dependency RTO | Combined app+DB+deps recovery of Commercial/Programme Building |
| R-04 | Unapproved data jurisdiction | **HIGH** — legal/regulatory | **HIGH** until E1 closes (every placement **NOT APPROVED**) | Stage 4A matrices; Highly Restricted default; no silent Production copy | Applicable law, transfers, subprocessors | Legal/DPO approved placement model |
| R-05 | Provider capability uncertainty | **HIGH** — selected class may not exist as evidenced | **HIGH** (no candidate named) | Provider-neutral envelope; HE register | Entire HE-01–HE-40 set | Verified candidate evidence |
| R-06 | TCO uncertainty | **MEDIUM–HIGH** — unaffordable or false economy | **HIGH** (no quotes; envelope unanswered) | TCO model structure; cost principles 1–10 | All amounts | Quotes + Finance envelope; reproducible 3-year TCO |
| R-07 | Identity/security dependency | **HIGH** — availability and confidentiality | **HIGH** (ADR-0012/0013 OPEN; lab deps absent) | Ports/ADR intent; envelope F/G | Product, region, MFA, keys, audit | Validated identity/secrets architecture |
| R-08 | DR dependency | **HIGH** — site loss; RPO > 0 if async | **HIGH** (Legal DR **NOT APPROVED**; lab ≠ geography) | Lab T4 characterisation; separate Legal copy rule | Location, lag, failback, foreign support | Approved DR jurisdiction + tested promote/failback |
| R-09 | PCI uncertainty | **MEDIUM** if design position holds; **HIGH** if CHD enters EOS | **UNKNOWN** | Decision 13 design position; no compliance claim | Actual flows, processors, scope | PCI scope established; CHD remains out of EOS stores/backups/DR |
| R-10 | Vendor lock-in / exit risk | **MEDIUM–HIGH** | **UNKNOWN** (no contracts) | Decision 12 principles | Fees, notice, proprietary PaaS, deletion evidence | Contractual exit/return/deletion + restore-elsewhere drill |
| R-11 | Operational support risk | **HIGH** vs immediate recovery initiation | **HIGH** (24/7 **NOT PROVEN**; O12 open) | Business requirement recorded; I6 draft not attestation | On-call, foreign access, detection (RM-13) | Defined support model + Legal overlay + monitoring |
| R-12 | Migration complexity | **HIGH** — in-memory → PostgreSQL; dual-run; data migration | **HIGH** relative to current runtime | Migrations **NOT AUTHORIZED**; schema-readiness exists as additive SQL only | Duration, integrity, cutover RPO | Separate persistence-cutover and migration authorizations |

---

# 12. Implementation gate

**Even if ADR-0006 later becomes APPROVED, that does not authorize implementation.**

After a future architecture decision, a **separate implementation authorization** is required.

Required subsequent sequence (none of these steps is current except the deferred architecture decision):

1. Architecture decision *(this package: **DEFERRED**)*  
2. Implementation design  
3. Implementation authorization  
4. Build  
5. Technical testing  
6. UAT authorization  
7. UAT  
8. Production readiness  
9. Production authorization  
10. Deployment authorization  
11. Deployment  

**Migrations require separate authorization.** They are **NOT AUTHORIZED** now.

PostgreSQL persistence cutover, HA, backup product implementation, and DR implementation each require their own authorization and must **not** be inferred from this deferral or from Stage 4B laboratory work.

---

# 13. Production gate

**Production remains blocked** until all applicable gates are satisfied.

At minimum — **none of the following is currently complete**:

- ADR-0006 approved;  
- DP-0006 approved;  
- Production jurisdiction approved;  
- backup/DR jurisdictions approved;  
- persistence implemented and tested;  
- technical RTO/RPO demonstrated on the Production-class architecture (laboratory evidence is **not** this gate);  
- security controls implemented and tested;  
- identity/secrets architecture implemented and tested;  
- backup/restore tested;  
- DR tested;  
- operational monitoring established;  
- incident/recovery procedures tested;  
- PCI scope addressed;  
- Production readiness review passed;  
- Production authorization granted;  
- deployment authorization granted.

Stage 4B run `20260915-183034` remains **Dev/Test laboratory evidence**. Lab containers were removed. It is **not** Production evidence and **not** Production authorization.

---

# 14. Audit trail

## 14.1 Evidence used

- Stage 1 Owner-authorized business positions (functions, sequence, MTD, RTO, business data-loss, Tanzania **candidate**, managed-cloud **preference**, non-negotiables, planning 500/200/30%, cost principles, PCI design position, portability principles).  
- Stage 2 validation worksheets remaining OPEN/UNANSWERED.  
- Stage 3 class comparison remaining unranked.  
- Stage 4A Legal structure with **no** attestation.  
- Stage 4B laboratory register LAB-01–LAB-12 and RM-01–RM-14.  
- Stage 4C capability envelope and HE register (none CONFIRMED).  
- Stage 4D TCO model and TE register (no quotes).  
- ADR-0006 / DP-0006 current statuses.

## 14.2 Evidence not available

- Legal/DPO attested placement or transfer mechanism.  
- Named provider/region/facility evidence.  
- Finance/Owner monetary envelope.  
- Provider quotes or reproducible 3-year TCO.  
- Production or Production-like RTO/RPO of jointly critical EOS modules.  
- Independent AZ/region failure test.  
- Production IdP/CDN/WAF/email/KMS.  
- PCI scope validation pack.  
- Named stakeholder signatures (fact pack Part 10; Stage 1 attestation blocks; Stage 2 reviewer names).  
- Exit contract terms.

## 14.3 Assumptions (explicit; limited)

- Planning capacity 500 / 200 / 30% remains a **planning assumption**, not measured usage.  
- ADR-0003 PostgreSQL SoR remains the intended Production durability class unless later **approved** otherwise.  
- Options A–D remain the comparison frame unless a later **REOPEN EVALUATION** decision is recorded.  
- Stage 1 company decision positions remain the business baseline pending named attestation.

No other material assumptions are adopted to force a selection.

## 14.4 Unresolved questions (carried from workplan Q1–Q4)

**Q1.** What legal/data-placement rule governs Production, backup, DR, and warm standby? **UNANSWERED** (E1 OPEN).  
**Q2.** Which architecture class should be evidenced first on a named candidate? Workplan **collection** sequence (A then B, C/D kept) is **not** an approval. **UNANSWERED** as a selection.  
**Q3.** What technical RPO can be demonstrated under defined failure models while preserving zero tolerated **business** loss of critical data? **UNANSWERED** as a formal technical target.  
**Q4.** What Finance/Owner TCO envelope applies? **UNANSWERED**.

## 14.5 Governance decisions recorded by this package

- Outcome **DEFER / NOT READY**.  
- Options A–D **not ranked, not eliminated, not selected**.  
- **CONDITIONAL ARCHITECTURE DIRECTION** recorded as capability pattern only.  
- ADR-0006 / DP-0006 **not** updated to approved.  
- Implementation, migration, UAT, Production, deployment **not** authorized.

## 14.6 Gap-register overlay

The stakeholder gap-closure register remains `RED — NOT CLEARED`. Stage 1 reconciled some business-layer conflicts for **governance progression**; it did **not** close Legal/IT/Finance attestation gaps or named signatures. This Stage 5 package does **not** clear the register.

---

# 15. Relationship to gates E1–E4

| Gate | Status | Relation to Stage 5 |
| --- | --- | --- |
| **E1 Legal** | `OPEN — REQUIRES LEGAL/DPO VALIDATION` | Stage 5 **does not** close E1. A legally unapproved placement cannot be selected. |
| **E2 Technical** | `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED` | Laboratory mechanisms inform the conditional direction. They **do not** prove Production RTO/RPO or actual module recovery. Stage 5 **does not** close E2. |
| **E3 Hosting** | `OPEN — HOSTING EVIDENCE IN PROGRESS` | No candidate confirmed. Stage 5 **does not** close E3. |
| **E4 TCO** | `OPEN — TCO EVIDENCE INCOMPLETE` | Stage 4D exit criteria **not** met. Stage 5 **does not** close E4. |

**A financially attractive option that fails Legal, technical recovery, security, or mandatory capability requirements is not viable.**  
**A technically attractive laboratory mechanism that fails Legal or Finance gates is not a Production architecture.**

Because E1–E4 are not sufficiently closed, Stage 5 **cannot** produce APPROVE or APPROVE WITH CONDITIONS without inventing evidence.

---

# 16. Next governed action

Do **not** skip to implementation.

Recommended sequence after this deferral (not authorized by this document):

1. Close or formally condition **E1** (Legal/DPO placement).  
2. Continue **E3** candidate evidence (`CANDIDATE — NOT SELECTED`) for Option A then B, keeping C and D until eliminated by evidence.  
3. Obtain **E4** quotes and Finance/Owner envelope (or an attested “intentionally open” envelope).  
4. Close **E2** Production-class gaps that remain architecture-critical — especially **RM-01** persistence of jointly critical modules — under **separate** authorization (not this package).  
5. Re-enter a Stage 5 decision record only when blocking items in §5 and conditions in §9 are sufficiently closed.  
6. Only then consider updating ADR-0006 and DP-0006.  
7. Only after that, a **separate** implementation authorization.

---

# 17. Final governance status

E1:  
`OPEN — REQUIRES LEGAL/DPO VALIDATION`

E2:  
`PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`

E3:  
`OPEN — HOSTING EVIDENCE IN PROGRESS`

E4:  
`OPEN — TCO EVIDENCE INCOMPLETE`

ADR-0006:  
`PROPOSED — BLOCKED FOR PRODUCTION`

DP-0006:  
`OPEN — NOT APPROVED`

Provider:  
`NOT SELECTED`

Region:  
`NOT APPROVED`

Production topology:  
`NOT SELECTED`

Architecture decision:  
`NOT YET APPROVED` — current evidence supports **DEFER / NOT READY** only

Implementation:  
`NOT AUTHORIZED`

Migration:  
`NOT AUTHORIZED`

UAT:  
`NOT AUTHORIZED`

Production deployment:  
`NOT AUTHORIZED`

---

## Validation (this package)

- No provider was invented or selected.  
- No price was invented; UNKNOWN is not represented as zero.  
- No legal approval, Finance approval, or stakeholder signature was invented.  
- No Production RTO/RPO guarantee was invented.  
- Stage 4B remains laboratory evidence (run `20260915-183034`).  
- Options A–D remain unselected, unranked, and not eliminated.  
- Unknowns remain unknown.  
- ADR-0006 and DP-0006 files are **not** modified by this package.  
- This package does not authorize Production, UAT, implementation, or migration.
