# ADR-0006 Owner + Business/BCM Decision Pack

> **`OWNER-AUTHORIZED DECISION POSITION — REQUIRES GOVERNANCE RECORDING`**  
> **CURRENT PROGRAMME STATUS: `RED — NOT CLEARED`**  
> **These are Owner-authorized company decision positions for governance progression.**  
> **They are not personal signatures, statutory/legal attestations, named individual reviews, or Legal/DPO/IT/Finance approval.**

This decision pack records Owner-authorized business positions so that ADR-0006 work can progress toward a later decision package. It does **not** close ADR-0006, approve DP-0006, select a provider or region, or authorize implementation.

Historical fact-pack values are preserved below as the prior record. Where this pack adopts a new position, it **reconciles** those earlier statements; it does **not** erase them.

---

> **Business requirements are not technical architecture.**
>
> Recording of RTO/RPO/MTD as Owner-authorized **business** positions does not by itself approve a backup, replication, warm-standby, cloud, hosting, database, or DR architecture.
>
> Technical architecture remains subject to separate IT/Security, Legal/DPO, Finance, ADR-0006 and implementation authorization gates.

---

`This decision pack does not close ADR-0006.`

`This decision pack does not approve DP-0006.`

`This decision pack does not authorize Production.`

`This decision pack does not authorize implementation.`

`This decision pack does not fabricate personal signatures or legal attestations.`

**Authoritative historical questionnaire text remains in:** [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md) (not modified by this task)  
**Gap IDs:** [`adr-0006-stakeholder-gap-closure-register.md`](adr-0006-stakeholder-gap-closure-register.md)  
**Decision records (status unchanged):** [`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md) — **proposed — blocked for Production**; [`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md) — **OPEN / NOT APPROVED**

**Classification of positions in this pack:** Owner-authorized company decision position — requires governance recording. Named Part 10 attestation remains **blank**.

---

# Reconciliation summary

| Historical position | New authorized position | Reason |
| --- | --- | --- |
| Owner: critical-function maximum interruption **2 hours** | Maximum tolerable disruption for critical business operations: **3 hours** | Reconciles Owner 2h with BCM 3h. **2 hours is preserved as superseded historical Owner input**, not treated as meaningless. |
| BCM: MTD **3 hours** | Same **3 hours** adopted as authorized business MTD | BCM figure retained as the reconciled MTD. |
| Owner: overall RPO **3 hours** and critical RPO **3 hours** | Business requirement: **zero tolerated loss of critical business data**. Technical RPO **not** set to 0 by this pack | 3-hour RPO is **superseded historical Owner input**. IT must determine architecture and a **measurable technical RPO** that meets or formally qualifies the business requirement. |
| Owner and BCM: data-loss tolerance **Zero** | Confirmed as the **business** requirement (zero tolerated loss of critical business data) | Not converted into an approved technical RPO of 0 minutes. |
| Owner: critical functions Sales & Marketing (Commercial and CRM); BCM: Programme building | **Commercial / Programme Building are jointly critical** | Reconciles the two lists; neither historical statement is erased. |
| Owner recovery order: Commercial → Finance → Operations → CRM → Procurement/Suppliers | **1. Commercial / RFP intake → 2. Programme Building → 3. Operations → 4. CRM → 5. Finance → 6. Procurement / Suppliers** | New sequence reconciles Commercial-first with Programme Building immediate criticality and Finance/Supplier dependency (Finance is required for Programme Building but recovers after CRM in this authorized order). |
| BCM recovery priority **Immediately**; Owner overall RTO **4 hours**, critical RTO **3 hours** | Recovery **action begins immediately**; critical-function RTO **<= 3 hours**; overall EOS RTO **<= 4 hours** | “Immediately” means **commencement of recovery action**, not instantaneous technical restoration. |
| BCM preferred recovery: **Restore from backup**; IT: not established as sufficient; warm standby recommended | Architecture-neutral requirement: must meet immediate initiation, <=3h critical RTO, <=4h overall RTO, zero tolerated loss of critical business data | “Restore from backup” is a **desired recovery outcome/capability**, not an approved technical architecture. Backup-only / warm standby / active-active / DR topology are **not** selected. |
| Architecture 12.3 proposed RTO/RPO (e.g. Identity 1 h / 15 min) | **Unchanged — PROPOSED / NOT APPROVED** | Not used as stakeholder approval. |
| Fact pack Section 6 stakeholder-approved RTO/RPO | **Remain blank** | This pack records business positions only; it does not fill Section 6 technical approval fields. |

`BLOCKING` items that remain after this pack: Legal/DPO jurisdiction approval, IT architecture proof, Finance TCO figures, PCI evidence, named attestations, ADR-0006/DP-0006 closure, Production authorization.

---

# Priority 1 — Critical business functions

### Historical Owner position (fact pack O8; not erased)

Critical functions: `Sales & Marketing (Commercial and CRM)`  
Recovery order: `Commercial → Finance → Operations → CRM → Procurement/Suppliers`  
RFP and Program Building must recover first.  
Program Building depends on Finance and Suppliers.

### Historical Business/BCM position (fact pack BIA A–J / Section 7; not erased)

Function: `Programme building`  
Criticality: `Very critical`  
Recovery priority: `Immediately`  
Preferred recovery: `Restore from backup`

### Owner-authorized reconciled position

`OWNER-AUTHORIZED DECISION POSITION — REQUIRES GOVERNANCE RECORDING`

- Commercial / Programme Building are **jointly critical**.
- Commercial/RFP intake is the **initiating** priority.
- Programme Building is immediately dependent on Commercial inputs and also depends on Finance and Suppliers.

| Decision | Current Position A | Current Position B | Final Owner-authorized position |
| --- | --- | --- | --- |
| Most critical business function | Commercial / CRM | Programme building | **Commercial / Programme Building are jointly critical** |
| Recovery priority | Commercial first | Programme building immediately | **Commercial/RFP intake initiates; Programme Building follows immediately and depends on Commercial inputs** |
| RFP priority | First | Not separately stated | **Commercial / RFP intake is the initiating priority (sequence position 1)** |
| Programme Building priority | First | Very critical / immediate | **Sequence position 2; jointly critical with Commercial** |
| Finance dependency | Required for Programme Building | Not separately defined | **Required for Programme Building; recovers at sequence position 5** |
| Supplier dependency | Required for Programme Building | Not separately defined | **Required for Programme Building; recovers at sequence position 6** |
| Recovery sequence | Commercial → Finance → Operations → CRM → Procurement | Not defined | **See Priority 7 authorized sequence** |

Related gap IDs: `GC-02`.

---

# Priority 2 — Maximum tolerable disruption

### Historical values (preserved)

Owner: `Maximum acceptable interruption for critical functions = 2 hours`  
Business/BCM: `Maximum tolerable disruption = 3 hours`

### Owner-authorized reconciled position

Choice: **B** — the **3-hour** BCM figure is adopted as the authorized business MTD. The **2-hour** Owner response is **superseded historical input**, not discarded as meaningless.

`Final Business MTD = 3 hours` (critical business operations)

Definition: Maximum tolerable disruption for **critical business operations**. This is a **business** threshold. It is **not** a selected technical architecture and **not** fact-pack Section 6 approved RTO.

Owner/BCM attestation (named signature): **not recorded in this task** — see blank attestation blocks.

Related gap IDs: `GC-01`.

---

# Priority 3 — RTO

### Historical recorded values (fact pack O8; not Section 6)

- Overall RTO = 4 hours
- Critical-function RTO = 3 hours
- BCM MTD = 3 hours
- BCM recovery priority = Immediately

Architecture 12.3 remains **PROPOSED / NOT APPROVED** and is not used as approval.

### Owner-authorized position

| RTO Decision | Proposed/Recorded Value | Owner-authorized business requirement |
| --- | ---: | ---: |
| Overall EOS RTO | 4h | **<= 4 hours** |
| Critical-function RTO | 3h | **<= 3 hours** |
| Any tier-1 function RTO | Not defined | **<= 3 hours for critical business functions** (Commercial / Programme Building jointly critical). Further tier split **not** invented. |
| Recovery priority | Immediately | **Recovery action begins immediately** |

“Immediately” refers to **commencement of recovery action**, not instantaneous technical restoration.

This is **not** an infrastructure design. Fact pack Section 6 stakeholder-approved RTO remains blank.

Related gap IDs: `GC-01`.

---

# Priority 4 — Data loss / RPO

### Historical contradiction (preserved)

Owner: data-loss tolerance **Zero**, and also overall RPO **3 hours**, critical RPO **3 hours**.  
BCM: data-loss tolerance **Zero**.

The **3-hour RPO** figures are **superseded historical Owner input**.

### Owner-authorized position

| Decision | Current Value | Owner-authorized position |
| --- | ---: | --- |
| Business data-loss tolerance | Zero | **Zero tolerated loss of critical business data** |
| Critical-function RPO | 3 hours | **Superseded as a business target.** Business requirement is zero tolerated loss of critical business data. Measurable **technical** RPO is for IT to determine. |
| Overall EOS RPO | 3 hours | **Superseded as a business target** (same distinction). |
| RPO 0 required? | Not established | **Not established as an approved technical RPO.** Do **not** automatically state that technical RPO = 0. |

**Business requirement:** zero tolerated loss of critical business data.

**Technical requirement:** IT must determine the architecture, replication/protection mechanism and measurable technical RPO necessary to meet or formally qualify the business requirement.

This distinction affects later backup frequency, WAL/continuous protection, replication, sync/async design, DR, and cost. **None of those mechanisms is selected here.**

Fact pack Section 6 stakeholder-approved RPO remains blank.

Related gap IDs: `GC-01`.

---

# Priority 5 — Recovery model

### Historical positions (preserved)

BCM: `Restore from backup`  
IT draft: restore-from-backup is **not established as sufficient**; warm standby **recommended / likely required**  
Owner O9: unanswered  
Section 7 checkboxes: unset

### Owner-authorized position

**Do not select:** backup-only; warm standby; active-active; a specific DR topology.

SEDMC requires a recovery architecture capable of meeting:

- immediate recovery initiation;
- <=3-hour critical-function RTO;
- <=4-hour overall RTO;
- zero tolerated loss of critical business data.

IT must subsequently determine the technically appropriate recovery architecture and prove it through testing.

“Restore from backup” is a **desired recovery outcome/capability** and is **not** itself an approved technical architecture.

| Recovery Decision | Stakeholder Choice |
| --- | --- |
| Backup restoration only | **Not selected** |
| Warm standby | **Not selected** |
| Active/passive DR | **Not selected** |
| Other | **Not selected** — IT to propose an architecture that meets the business outcomes above |
| Required failover automation | **Not selected** as a technical product. Recovery **action** must begin immediately (Priority 3) |
| Manual recovery acceptable? | **Not decided** as a technical operating model |

Related gap IDs: `GC-03`, `GC-08`.

---

# Priority 6 — Business consequences

Owner-authorized **confirmation** of recorded consequences. No monetary values invented.

| Consequence | Current Position | Confirm / Change |
| --- | --- | --- |
| Financial | Loss of revenue | **Confirmed:** loss of revenue |
| Customer | Relationship/client loss | **Confirmed:** relationship damage; loss of clients |
| Operational | Failure to deliver | **Confirmed:** failure to deliver expected results |
| Contractual | Legal action | **Confirmed as potential legal/contractual consequences** (not a legal determination that action will occur) |
| Regulatory | Unknown | **Confirmed:** unknown / requires legal assessment |
| Reputational | Huge brand damage | **Confirmed:** significant brand damage |

Related gap IDs: `GC-02`, `GC-44`.

---

# Priority 7 — Recovery order

### Historical Owner sequence (fact pack O8; not erased)

1. Commercial  
2. Finance  
3. Operations  
4. CRM  
5. Procurement/Suppliers  

Historical/contextual “Reservations/RFP → Operations → CRM → Finance” remains non-current unless separately revived.

### Owner-authorized sequence (reconciles historical Owner and BCM)

Decision: **CHANGED** (reconciles prior Owner five-step order with jointly critical Commercial / Programme Building).

`Final recovery sequence =`

1. Commercial / RFP intake  
2. Programme Building  
3. Operations  
4. CRM  
5. Finance  
6. Procurement / Suppliers  

Related gap IDs: `GC-02`.

---

# Priority 8 — Dependencies

### Historical recorded dependency (preserved)

`Programme Building depends on Finance and Suppliers.`

### Owner-authorized position

Programme Building is immediately dependent on **Commercial inputs** and also depends on **Finance** and **Suppliers**.

| Dependency | Required? | Priority | Stakeholder Confirmation |
| --- | --- | --- | --- |
| Finance | **Yes** (for Programme Building) | Recovery sequence position **5** | Owner-authorized position recorded; named signature not fabricated |
| Suppliers | **Yes** (for Programme Building) | Recovery sequence position **6** | Owner-authorized position recorded; named signature not fabricated |
| CRM | Recovers at sequence position **4**. Additional dependency beyond the sequence **not invented** | 4 | Sequence recorded; extra dependency not assumed |
| Email | **Not decided** in this authorization | `___` | Do not convert a technical assumption into an approved dependency |
| Identity | **Not decided** in this authorization | `___` | Do not convert a technical assumption into an approved dependency |
| Internet/network | **Not decided** in this authorization | `___` | Do not convert a technical assumption into an approved dependency |
| Other | Commercial/RFP intake is the initiating dependency for Programme Building | 1 then 2 | Recorded above |

Related gap IDs: `GC-02`.

---

# Priority 9 — Owner hosting / geography / model / non-negotiables

Geography preferences are **not** Legal/DPO approval and **not** a selected provider or region.

### Decision 7 — Hosting / geography (Owner-authorized)

- **No Production jurisdiction is automatically pre-approved.**
- **Tanzania is a preferred candidate for assessment, not an automatic approval.**
- **Kenya, EU/EEA and other jurisdictions may be evaluated.**
- Production, backup, DR and warm-standby locations must satisfy applicable legal, privacy, security, contractual, operational and business-continuity requirements.
- **Highly Restricted data should remain in the primary approved jurisdiction unless explicitly approved otherwise.** (No primary jurisdiction is approved yet.)
- Cross-border access and processing must be assessed and controlled.

**No provider or region is selected.**

| Decision | Owner-authorized position |
| --- | --- |
| Operating geography | **Not a full country-of-operation census.** Tanzania is a preferred **candidate for assessment**; Kenya, EU/EEA and others **may be evaluated**. Census remains for Owner/Legal follow-up. |
| Primary Production geography preference | **Tanzania = preferred candidate for assessment only. Not pre-approved. Not a selected region.** |
| Backup geography preference | **Must satisfy legal/privacy/security/contractual/operational/BCM requirements. Not selected. Not pre-approved.** |
| DR geography preference | **Must satisfy the same class of requirements. Not selected. Not pre-approved.** |
| Preferred hosting model | **Managed cloud infrastructure is the preferred direction, subject to ADR-0006 assessment and approval.** Preference only. **Not** Production authorization. **Not** provider selection. |
| Unacceptable hosting models | **Not specified in this authorization** — remains open |
| Cloud preference | **Managed cloud preferred direction** (Decision 8). Final provider and region remain **open**. |
| Production operating hours | **Not specified in this authorization** |
| Expected users | See Priority 10 **planning targets** (not measured usage) |
| Expected concurrent users | See Priority 10 **planning targets** |
| Expected growth | See Priority 10 **planning targets** |
| Important business integrations | **Not specified in this authorization** |
| Maximum acceptable vendor lock-in | **Low vendor lock-in** (Decision 12) |
| Portability requirements | See Decision 12 |
| Business non-negotiables | See Decision 9 |

Additional Owner fields **not** supplied in this authorization (left open; not invented):

| Decision | Fact-pack ref | Position |
| --- | --- | --- |
| Controller / legal entity / establishment | O1 | **Still required — not supplied here** |
| Restricted-data geographic restrictions (beyond Highly Restricted default) | O6 | **Still required in detail — not a full matrix here** |
| Restricted+ failover geographic restrictions | O7 | Highly Restricted: remain in primary approved jurisdiction unless explicitly approved otherwise; **primary jurisdiction not yet approved** |
| Infrastructure budget / envelope | O10 | **No monetary budget invented** — see Decision 11 cost **principle** only |
| Production operating model / responsible team | O12 | **Still required — not supplied here** |

### Decision 8 — Hosting model

Managed cloud infrastructure is the **preferred direction**, subject to ADR-0006 assessment and approval.

This is a **preference**, **NOT** Production authorization and **NOT** provider selection. The final provider and region remain **open**.

### Decision 9 — Non-negotiable business requirements

1. High availability for critical functions.
2. Strong data protection.
3. Tested recovery.
4. Zero tolerated loss of critical business data.
5. <=3-hour critical-function recovery.
6. <=4-hour overall recovery.
7. Secure backup and DR.
8. Strong access control.
9. Auditability.
10. Data portability.
11. Low vendor lock-in.
12. Separation of Dev/Test and Production.
13. No live Production PII in Dev/Test.
14. Secure secrets management.
15. Controlled Production changes.

These are business requirements. They do **not** select Vault, an IdP, a backup product, or a cloud region.

Related gap IDs: `GC-04`–`GC-12`.

---

# Priority 10 — Scale / engineering planning targets

These are **planning targets requiring IT validation**. They are **not** current measured usage and are **not** copied as if they were attested live metrics.

| Business Metric | Required Input |
| --- | --- |
| Current EOS users | **Not a measured figure in this authorization** |
| Expected users Year 1 | **Not separately specified.** Planning target: **up to 500 users** (IT validation required) |
| Expected users Year 3 | **Not separately specified.** Apply **30% annual growth planning assumption** for modelling only (IT validation required) |
| Expected concurrent users | **Planning target: up to 200 concurrent users** (IT validation required) |
| Critical operating hours | **Not specified in this authorization** |
| Growth assumption | **30% annual growth planning assumption** (IT validation required; not approved measured growth) |
| Major seasonal peaks | **Not specified in this authorization** |
| Critical transaction volumes | **Not specified in this authorization** |

Additional authorized planning principles:

- horizontal scalability without fundamental redesign
- capacity monitoring and planning required

Related gap IDs: `GC-12`, `GC-37`.

---

# Decision 11 — Cost principle

Cost is important but **must not override** material security, compliance, recoverability or business-continuity requirements.

The future architecture decision package should compare:

- **A.** recommended balanced option  
- **B.** lower-cost viable option  
- **C.** higher-control/resilience option where justified  

Each should include comparable **3-year TCO**.

**No monetary budgets are recorded or invented.** O10 remains without a figure.

Related gap IDs: `GC-09`, `GC-40`, `GC-41`.

---

# Decision 12 — Portability

Owner-authorized principles (`DRAFT PRINCIPLE` relative to contracts until Legal/Finance negotiate terms):

- High portability / low vendor lock-in.
- PostgreSQL data must be exportable/restorable.
- Files must be exportable in usable formats.
- Application/configuration artefacts should remain portable.
- Secrets must not be embedded in code.
- Backups should be capable of restoration outside the incumbent provider.
- Infrastructure should use portable standards where practical.
- Exit support, data return, secure deletion and reasonable migration notice should be addressed **contractually**.

Exact exit duration, fees, and notice period are **not invented**.

Related gap IDs: `GC-42`, `GC-43`.

---

# Decision 13 — PCI

Company **design position** (not a compliance claim):

- EOS must **not** store raw cardholder data as part of its normal architecture.
- Prefer third-party payment processing.
- EOS may retain minimum payment/reconciliation metadata.
- **Do not claim SEDMC PCI DSS compliance.**
- PCI scope remains subject to actual validation/evidence.

`PCI DSS STATUS NOT ESTABLISHED`

Related gap IDs: `GC-39`.

---

# RTO/RPO rationale (Owner Q13)

Historical: `Not available yet`

Recorded in this authorization as the **business** rationale for the reconciled MTD/RTO/data-loss positions: critical operations cannot sustain disruption beyond **3 hours**; recovery action must **begin immediately**; critical functions must be recoverable within **<= 3 hours** and the platform within **<= 4 hours**; **zero** loss of critical business data is tolerated. Consequences: loss of revenue, client relationships, delivery failure, potential contractual issues, unknown regulatory impact, and significant brand damage.

This is **not** IT test evidence and **not** Section 6 approval.

---

# Decision 14 — Governance status (unchanged by this task)

| Item | Status |
| --- | --- |
| ADR-0006 | **PROPOSED / BLOCKED FOR PRODUCTION** (unchanged) |
| DP-0006 | **OPEN / NOT APPROVED** (unchanged) |
| Production | **NOT AUTHORIZED** |
| Deployment | **NOT AUTHORIZED** |
| Migrations | **NOT AUTHORIZED** |
| Hosting provider / region | **NONE SELECTED** |
| Architecture / DR topology | **NOT APPROVED by this pack** |
| Implementation authorization | **NOT CREATED by this pack** |
| Named Owner / BCM signatures | **NOT FABRICATED** — blocks below remain blank |
| Legal/DPO / IT / Finance attestation | **NOT PROVIDED by this pack** |

---

## Owner Attestation

I confirm that I have reviewed the business requirements recorded in this decision pack and that the final values marked as approved represent the business requirements for Serengeti EOS.

**These fields are not populated by this task.** Company decision positions above are **not** a substitute for a named personal signature.

Name:

`________________`

Role:

`________________`

Decision:

`APPROVED / APPROVED WITH CONDITIONS / NOT APPROVED`

Date:

`________________`

Signature / confirmation:

`________________`

---

## Business / BCM Attestation

I confirm that I have reviewed the Business Impact Analysis, critical functions, recovery priorities, MTD, RTO, RPO and recovery requirements recorded in this decision pack.

**These fields are not populated by this task.**

Name:

`________________`

Role:

`________________`

Decision:

`APPROVED / APPROVED WITH CONDITIONS / NOT APPROVED`

Date:

`________________`

Signature / confirmation:

`________________`

---

## Remaining genuinely unresolved (not invented)

Items **not** covered by Decisions 1–13, still open:

- Named personal Owner and BCM signatures / Part 10 attestation
- Controller / legal entity / establishment (O1)
- Full operating-country census
- Legal/DPO approval of any Production, backup, DR, or warm-standby **jurisdiction**
- Restricted-data geography matrix (detail beyond Highly Restricted default)
- Production operating hours
- Production operating model / responsible team
- Measured current users; Year 1 / Year 3 user forecasts; seasonal peaks; transaction volumes
- Unacceptable hosting models (explicit list)
- Important business integrations (named)
- Monetary budgets, TCO ceilings, hosting spend maxima
- Contractual exit duration, fees, and notice period
- Email / identity / network as **approved** recovery dependencies
- Technical recovery architecture (backup-only / warm standby / etc.)
- Technical RPO (minutes) and proof-by-test
- PCI evidence and in/out-of-scope determination
- Provider, Production region, backup region, DR region

---

## After named attestation (future)

`Stakeholder Gap Closure`  
→ `Stakeholder Attestation` (named signatures — **not** completed by this task)  
→ `ADR-0006 Decision Package`  
→ `Owner/Legal/IT/Finance Decision`  
→ `ADR-0006 / DP-0006 Update`  
→ `Architecture Decision`  
→ `Separate Implementation Authorization`  
→ `Build`  
→ `Test/UAT`  
→ `Production Authorization`  
→ `Deployment`

Until Legal/IT/Finance validation, named attestations, and ADR-0006/DP-0006 decisions occur, overall status remains:

`RED — NOT CLEARED`
