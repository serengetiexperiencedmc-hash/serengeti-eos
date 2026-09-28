# ADR-0006 Stakeholder Fact Pack & BIA

> **STATUS: AWAITING STAKEHOLDER INPUT**  
> **SECTION 1 (OWNER O1–O13): OWNER INPUT — PROVIDED BY OWNER; REVIEW/ATTESTATION STATUS MUST FOLLOW EXISTING GOVERNANCE RECORD**  
> **SECTION 2 (LEGAL/DPO L1–L17): DRAFT LEGAL / DPO POSITION — REQUIRES ACTUAL LEGAL/DPO STAKEHOLDER REVIEW AND ATTESTATION**  
> **SECTION 3 (IT I1–I19): DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION**  
> **SECTION 4 (PCI): DRAFT IT/FINANCE INPUT — REQUIRES STAKEHOLDER REVIEW AND ATTESTATION**  
> **SECTION 5 (BIA A–J / BUSINESS / BCM): DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION**  
> **SECTION 7 (RECOVERY POSTURE): DRAFT RECOVERY POSTURE INPUT — BUSINESS/BCM AND IT POSITION; REQUIRES FORMAL STAKEHOLDER REVIEW, TECHNICAL VALIDATION, AND GOVERNANCE APPROVAL**  
> **SECTION 8 (DATA RESIDENCY): DRAFT DATA RESIDENCY POSITION — REQUIRES FORMAL LEGAL/DPO AND OWNER REVIEW/ATTESTATION**  
> **SECTION 9 (DECISION GAPS / COST / EXIT): DRAFT COST/FINANCE AND EXIT/PORTABILITY POSITIONS — REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**  
> **HOSTING OPTION: NONE SELECTED**  
> **PRODUCTION: NOT AUTHORIZED**  
> **DEPLOYMENT: NOT AUTHORIZED**  
> **MIGRATIONS: NOT AUTHORIZED**

This document collects **decision inputs only** for ADR-0006 (Hosting & Residency) and DP-0006.

It does **not** constitute:

- hosting selection (A / B / C / D or any provider/region);
- legal approval or DPA/PDPA/GDPR certification;
- Production authorization;
- deployment authorization;
- migration or database authorization;
- ADR-0006 closure;
- DP-0006 approval.

**Fill rule:** Only explicit human stakeholder answers may populate any `Answer` field. Do not infer from repository geography, company location, Dev/Test adapters, Docker Compose, SES/GitHub, or prior informal statements. Leave blanks until the named stakeholder answers.

**Section 1 exception:** O1–O13 may record **Owner-provided business inputs**. Review/attestation status must follow the existing governance record. Owner name, signature and formal approval are **not** fabricated. Unanswered Owner geography/budget/hosting-preference fields remain `UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT` and are **not** filled from architecture, IT, Legal/DPO, or prior conversations. Owner-supplied interruption/RTO/RPO/data-loss values are **business requirements**, not technically approved RTO/RPO and not a hosting selection.

**Section 2 exception:** L1–L17 may contain a **draft Legal/DPO position** marked `DRAFT LEGAL / DPO POSITION — REQUIRES ACTUAL LEGAL/DPO STAKEHOLDER REVIEW AND ATTESTATION`. Draft answers are **not** an actual legal opinion, legal certification, regulatory determination, confirmation that GDPR applies or does not apply, confirmation that a particular hosting country is legally approved, PCI DSS certification, stakeholder attestation, or approval. They do **not** select a hosting jurisdiction and do **not** change ADR-0006, DP-0006, or Production / deployment / migration authorization. `Status` remains one of the four allowed values and is **not** `CONFIRMED BY LEGAL/DPO` until the named Legal/DPO stakeholder attests. `Reviewer` remains blank until that attestation. “Legal should approve the final architecture” is **not** evidence that Legal has already approved a Production architecture.

**Section 3 exception:** I1–I19 may contain **draft IT expert input** marked `DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION`. Draft answers are **not** IT attestation, **not** approved requirements, **not** hosting selection, and **not** Production / deployment / migration authorization. They do **not** satisfy the fill rule for Owner, BIA, RTO/RPO, recovery posture, residency matrix, or sign-off.

**Section 4 exception:** The PCI table’s Finance and IT rows, and the PCI Notes, may contain **draft IT/Finance input** marked `DRAFT IT/FINANCE INPUT — REQUIRES STAKEHOLDER REVIEW AND ATTESTATION`. Draft PCI text is **not** Finance, IT, Owner, or Legal/DPO attestation, **not** a PCI DSS compliance claim, **not** a determination that SEDMC is in or out of PCI DSS scope, and **not** hosting selection. Owner and Legal/DPO PCI rows remain blank until those stakeholders answer. `PCI STATUS` checkboxes remain unset until stakeholders have explicitly aligned.

**Section 5 exception:** BIA A–J may contain **draft Business/BCM input** marked `DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION`. These are business-impact inputs only. They are **not** IT-validated technical requirements, **not** an approved technical RTO or RPO, **not** an approved DR architecture, **not** Legal/DPO findings, and **not** formal Business/BCM attestation. Section 6 stakeholder-approved RTO/RPO remains unset (not approved).

**Section 7 exception:** Recovery-posture fields may contain **draft Business/BCM and IT input** marked `DRAFT RECOVERY POSTURE INPUT — BUSINESS/BCM AND IT POSITION; REQUIRES FORMAL STAKEHOLDER REVIEW, TECHNICAL VALIDATION, AND GOVERNANCE APPROVAL`. Primary-posture checkboxes remain unset until stakeholders formally select one option. Draft text is **not** an approved technical architecture, **not** implemented recovery capability, **not** approved RTO/RPO, **not** Legal/DPO-approved recovery jurisdictions, and **not** Production authorization.

**Section 8 exception:** The data-residency matrix and mapped residency questions may contain a **draft data-residency position** marked `DRAFT DATA RESIDENCY POSITION — REQUIRES FORMAL LEGAL/DPO AND OWNER REVIEW/ATTESTATION`. Geography cells record **not approved** / **requires human decision**. They do **not** select a Production, backup, DR, or warm-standby jurisdiction, provider, or facility.

**Section 9 exception:** Decision-gap rows plus mapped Cost/Finance and Exit/Portability questions may contain **draft governance positions** marked as requiring human Finance/Owner/Legal/IT decision or attestation. They do **not** approve a budget, TCO ceiling, contract term, termination period, or hosting option.

**Related (do not modify by filling this pack):** [`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md), [`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md).

---

## Section 1 — Owner O1–O13

> **OWNER INPUT — PROVIDED BY OWNER; REVIEW/ATTESTATION STATUS MUST FOLLOW EXISTING GOVERNANCE RECORD**
>
> Responsible: Owner / accountable business decision-maker. No Owner name, title, signature, or formal attestation is recorded here.
>
> Pack questions O1–O13 are preserved. Owner-supplied criticality, recovery-order and RTO/RPO answers (questionnaire O1–O3 / Q1–Q13) are mapped below onto the **corresponding** pack fields. They are **not** written into geography questions as if those had been answered. Values **2 hours**, **Zero**, **4 hours**, **3 hours**, and the recovery order **Commercial first, then Finance, then Operations, then CRM, then Procurement/Suppliers** are preserved exactly as Owner business requirements. They are **not** technically approved RTO/RPO, **not** IT-validated, and **not** reconciled with Section 5 / Section 7.
>
> Historical/contextual recovery sequences found elsewhere (including “Reservations/RFP → Operations → CRM → Finance”) are **not** treated as current Owner input.

> **RTO/RPO/BIA RECONCILIATION REQUIRED — OWNER INPUT AND BUSINESS/BCM INPUT CONTAIN MATERIAL DIFFERENCES.**
>
> **CRITICAL BUSINESS CONTINUITY RECONCILIATION REQUIRED:** Owner O1/O3 (as mapped) and Business/BCM/Recovery Posture contain materially different disruption and data-loss requirements. No technical RTO/RPO should be frozen until the accountable stakeholders reconcile these values. These values must **not** be reconciled automatically. Section 6 stakeholder-approved RTO/RPO remains blank.

Unanswered-field template used for O1–O7 and O9–O13: **UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT.** Not derived from architecture, hosting analysis, prior conversations, IT recommendations, Legal/DPO recommendations, commercial strategy, or current technology.

### O1 — Controller/legal entity and establishment

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O2 — Business operating geography

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred. (Questionnaire items on geographic operating model / countries of operation remain unanswered.)
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O3 — Primary processing geography preference

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O4 — Backup geography preference

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O5 — DR geography preference

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O6 — Restricted/Highly Restricted data geographic restrictions

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O7 — Restricted+ failover geographic restrictions

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O8 — Required availability/business continuity posture

- Answer: **OWNER-PROVIDED BUSINESS REQUIREMENTS — NOT TECHNICALLY APPROVED RTO/RPO AND NOT A TECHNICAL ARCHITECTURE DECISION.**
  - Critical business services/functions: Sales & Marketing (Commercial and CRM).
  - Functions that must recover first: Commercial functions.
  - Maximum acceptable business interruption for each critical function: **2 hours**.
  - Consequences if unavailable beyond that period: Loss of revenue, brand/reputation damage.
  - Acceptable data loss for critical functions: **Zero**.
  - Approved order of recovery: **Commercial first, then Finance, then Operations, then CRM, then Procurement/Suppliers**.
  - Functions that must recover before others because of customer/operational/financial/contractual/regulatory consequences: Yes, RFP and Program building.
  - Dependencies between recovery priorities: Yes, Program Building depends on Finance and Suppliers.
  - Required RTO for the overall platform: **4 hours**.
  - Required RTO for each business-critical function, if different: **3 hours**.
  - Required RPO for the overall platform: **3 hours**.
  - Required RPO for each critical data/service class, if different: **3 hours**.
  - Business rationale/evidence supporting those RTO/RPO values: **Not available yet**.
  These are Owner business requirements only. They are **not** IT-validated. They do **not** freeze Section 6. They do **not** overwrite Section 5 / Section 7. See reconciliation flag above.
- Evidence/source: Owner-provided input recorded 2026-09-15. Rationale/evidence for RTO/RPO: Not available yet. Not an Owner signature. Not technical validation.
- Stakeholder: Owner / accountable business decision-maker (name not recorded)
- Date: 2026-09-15 (input recorded; not attestation)
- Approval status: OWNER INPUT — PROVIDED BY OWNER; REVIEW/ATTESTATION STATUS MUST FOLLOW EXISTING GOVERNANCE RECORD. Not a technically approved RTO/RPO.

### O9 — Restore-from-backup vs warm standby preference

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred from Section 5/7 restore-from-backup or warm-standby draft positions.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O10 — Infrastructure budget/envelope

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred from Section 9 Cost/Finance draft (budgets remain not specified).
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O11 — Existing enterprise cloud/platform preference or constraint

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O12 — Production operating model / responsible team

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred from IT I6.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

### O13 — Final business priorities/decision criteria for hosting

- Answer: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
- Evidence/source: None. Not inferred. Questionnaire items on growth, user scale, operational hours, lock-in, portability, cost/control balance, unacceptable hosting models, and non-negotiable requirements remain unanswered on this pack question.
- Stakeholder:
- Date:
- Approval status: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

Owner-supplied questionnaire O1–O3 (Q1–Q13) mapped onto pack O8 (availability/BC). Pack labels O1–O7 and O9–O13 remain unanswered as listed above.

1. What business services/functions are considered critical to Serengeti EOS? Sales & Marketing (Commercial and CRM)
2. Which functions must recover first following a major outage? Commercial functions
3. What is the maximum acceptable business interruption for each critical function? 2 hours
4. What business consequences occur if those functions remain unavailable beyond that period? Loss of revenue, brand/reputation damage
5. What level of data loss is acceptable for critical functions? Zero
6. What is the approved order of recovery across the major business domains? Commercial first, then Finance, then Operations, then CRM, then Procurement/Suppliers
7. Are there functions that must recover before others because of customer, operational, financial, contractual, or regulatory consequences? Yes, RFP and Program building
8. Are there dependencies between those recovery priorities? Yes, Program Building depends on Finance and Suppliers
9. What is the required RTO for the overall platform? 4 hours
10. What is the required RTO for each business-critical function, if different? 3 hours
11. What is the required RPO for the overall platform? 3 hours
12. What is the required RPO for each critical data/service class, if different? 3 hours
13. What business rationale/evidence supports those RTO/RPO values? Not available yet
14. Business/geographic operating model: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
15. Countries/regions from which business must operate: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
16. Availability/continuity expectations: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT (beyond O8 recorded values)
17. Growth requirements: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
18. Customer/user scale: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
19. Operational hours: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
20. Business constraints hosting must respect: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
21. Acceptable cloud/vendor lock-in: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
22. Portability/exit capability: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
23. Balance between cost, control, resilience, geographic proximity and operational complexity: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
24. Hosting models explicitly unacceptable: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT
25. Non-negotiable business requirements: UNANSWERED — REQUIRES OWNER STAKEHOLDER INPUT

---

## Section 2 — Legal/DPO L1–L17

> **DRAFT LEGAL / DPO POSITION — REQUIRES ACTUAL LEGAL/DPO STAKEHOLDER REVIEW AND ATTESTATION**
>
> This section documents the Legal/DPO position provided for review. It is **not** an actual legal opinion, legal certification, regulatory determination, confirmation that GDPR applies, confirmation that GDPR does not apply, confirmation that a particular hosting country is legally approved, PCI DSS certification, stakeholder attestation, or approval. The named SEDMC Legal/DPO stakeholder must review, amend where necessary, provide supporting evidence, and formally attest before these inputs are treated as authoritative.
>
> Evidence labels used in `Evidence/source`: `UNKNOWN` · `REQUIRES LEGAL VERIFICATION` · `REQUIRES STAKEHOLDER INPUT` · `NOT APPROVED`. `VERIFIED` is used only if the repository already contains authoritative documentary evidence. None of the L1–L17 answers below is `VERIFIED`. None is `CONFIRMED BY LEGAL/DPO`.
>
> Pack headings L1–L17 are preserved. Questionnaire Legal L1–L17 answers are mapped onto the **corresponding** pack fields. Pack headings that have no dedicated questionnaire analogue are **not** filled by inference.
>
> **LEGAL / HOSTING RECONCILIATION:** Questionnaire L8 states Production jurisdiction is **UNKNOWN**. Backup/DR jurisdictions are also **not approved**. Therefore no hosting provider, Production region, backup region, DR region or warm-standby region may be selected based on these inputs alone. “Legal should approve the final architecture before Production processing begins” is **not** evidence that Legal has already approved a Production architecture.

For every legal conclusion, `Status` must be exactly one of:

- `CONFIRMED BY LEGAL/DPO`
- `AWAITING LEGAL/DPO`
- `NOT APPLICABLE`
- `REQUIRES FURTHER REVIEW`

Repository facts and geography must **not** substitute for Legal/DPO confirmation.

### L1 — Controller establishment/jurisdictions

- Answer: Controller/legal-entity establishment remains **UNKNOWN** until Owner and Legal/DPO identify the actual controller(s) and place(s) of establishment. **Not inferred** from Owner O1 (unanswered) or from repository geography. **Questionnaire L1 — applicable laws/regulations (draft position, not certification):** Tanzania's Personal Data Protection Act, 2022 and applicable regulations should be treated as the primary privacy framework. Depending on customers, employees, suppliers and data subjects, other jurisdictions' laws may also apply, including Kenya's Data Protection Act and, where applicable, GDPR/UK GDPR or other overseas privacy regimes. Exact applicability requires a processing/data-subject assessment. No hosting jurisdiction is selected here.
- Status: AWAITING LEGAL/DPO
- Evidence/source: UNKNOWN (controller establishment); REQUIRES LEGAL VERIFICATION (applicable-law position); REQUIRES STAKEHOLDER INPUT (legal entity / establishment facts). No legal opinion, incorporation extract, or regulatory determination is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L2 — Tanzania PDPA applicability

- Answer: Yes. SEDMC should design Production processing on the basis that the Tanzania PDPA applies to personal-data processing conducted by the company in Tanzania. Controller/processor obligations, security, data-subject rights, retention and transfers should be addressed. **Draft design basis — not a confirmed legal determination and not Legal/DPO attestation.**
- Status: AWAITING LEGAL/DPO
- Evidence/source: REQUIRES LEGAL VERIFICATION. No Legal/DPO opinion, PDPA registration, or regulatory correspondence is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L3 — Kenya DPA applicability

- Answer: Applicable where SEDMC processes personal data falling within Kenya's jurisdiction. Because the business operates across East Africa and may handle Kenyan clients, suppliers, employees or travellers, Kenya DPA applicability should be assessed for relevant processing activities. **Not** a determination that the Kenya DPA does or does not apply to all SEDMC processing.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (actual Kenyan data-subject / processing facts). No Legal/DPO assessment is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L4 — GDPR applicability

- Answer: Potentially applicable, but not automatically. It depends on factors such as whether SEDMC offers services to, monitors, or otherwise processes personal data relating to individuals in the EEA in circumstances bringing the processing within GDPR territorial scope. Legal should perform a formal applicability assessment. **This is not confirmation that GDPR applies and not confirmation that GDPR does not apply.**
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: UNKNOWN (whether GDPR applies); REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (data-subject location, offering, monitoring facts). No GDPR Article 3 assessment is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L5 — UK GDPR / UK data protection applicability

- Answer: **No dedicated UK GDPR determination was supplied in the current questionnaire.** Questionnaire L1 notes that, where applicable, GDPR/UK GDPR or other overseas privacy regimes may also apply, subject to a processing/data-subject assessment. Exact UK GDPR applicability is **not inferred** as confirmed or excluded. Current determination: **UNKNOWN**.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: UNKNOWN; REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT. No UK GDPR assessment is cited. Not Legal/DPO attestation. Not inferred from GDPR (L4).
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L6 — Other applicable privacy/data-residency regimes

- Answer: Potentially yes. Because SEDMC targets Europe, South Africa, North America, Latin America, the Middle East and other international markets, applicable local privacy laws should be mapped according to the location of the data subjects, customers and processing activities. Listing those markets is **not** an approved Production-data geography and **not** a hosting selection.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (actual data-subject / contract map). No comparative legal memo is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L7 — Categories of personal data processed

- Answer: Personal data should be classified according to sensitivity and legal risk. Personally identifiable information, passport/identity information, travel arrangements, contact details, payment-related information, employee information and potentially sensitive/special-category data require stronger controls. **Questionnaire L7 — sensitive/special-category data:** Potentially processed. Travel operations can involve information that may become sensitive, depending on the individual and circumstances. SEDMC should minimise collection and apply heightened controls where special-category/sensitive personal data is involved. This is a **draft privacy position**, not an inventory of data actually processed and not Legal/DPO attestation.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: REQUIRES STAKEHOLDER INPUT (actual processing inventory); REQUIRES LEGAL VERIFICATION (legal bases / special-category handling). No approved data-classification schedule or RoPA attestation is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L8 — Data-subject jurisdictions

- Answer: **UNKNOWN — REQUIRES FORMAL LEGAL/PRIVACY DECISION / STAKEHOLDER MAPPING.** No verified data-subject jurisdiction census is supplied. Questionnaire L5 requires mapping according to the location of data subjects, customers and processing activities. That mapping is **not** a verified census and **not** an approved Production-data geography. No jurisdiction is legally approved for Production, backup or DR merely because data subjects may be located there.
- Status: AWAITING LEGAL/DPO
- Evidence/source: UNKNOWN; REQUIRES STAKEHOLDER INPUT; REQUIRES LEGAL VERIFICATION. No data-subject register is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L9 — Cross-border transfer requirements

- Answer: Cross-border transfers should be treated as a controlled legal requirement, not simply an infrastructure decision. Before transferring personal data outside the relevant jurisdiction, SEDMC should identify the legal basis/mechanism, applicable transfer restrictions, contractual safeguards and any required regulatory measures. No transfer destination or mechanism is approved in this draft (see L10–L11). Interacts with ADR-0006 / DP-0006 hosting and backup/DR geography; those decisions remain open / not approved.
- Status: AWAITING LEGAL/DPO
- Evidence/source: REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (destinations, providers, data categories). No transfer-impact assessment is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L10 — Approved transfer mechanisms

- Answer: **NOT APPROVED — no transfer mechanism is approved at this stage.** **Questionnaire L10 — Tanzania → foreign cloud:** Potentially permissible subject to applicable Tanzanian requirements and the specific transfer arrangement. Legal should verify the PDPA requirements, destination, provider role, contractual protections, security measures and any regulatory notification/approval requirements that apply. **Questionnaire L11 — EU/EEA → Tanzania or other non-EEA destination:** If GDPR applies, international transfers require an appropriate GDPR transfer mechanism and associated safeguards. No assumption should be made that a normal cloud contract alone is sufficient. **This is not confirmation that GDPR applies.** This does **not** select a cloud provider, region, data centre or colo.
- Status: AWAITING LEGAL/DPO
- Evidence/source: NOT APPROVED (no approved mechanism); REQUIRES LEGAL VERIFICATION; UNKNOWN (destination / provider). No SCCs, adequacy finding, or Tanzanian transfer approval is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L11 — Prohibited processing/transfer locations

- Answer: **UNKNOWN — REQUIRES FORMAL LEGAL/PRIVACY DECISION.** **Questionnaire L8 — approved jurisdictions for Production data:** No jurisdiction should be treated as legally approved merely because infrastructure is technically available there. Primary, backup and disaster-recovery locations must all be assessed. **Questionnaire L12 — data localisation requirement:** Do not assume that all data must physically remain in Tanzania. The legal position should be established from the applicable law and the categories of data involved. However, where localisation is legally required or commercially mandated, the architecture must enforce it. This draft does **not** publish a verified prohibited-location list and does **not** approve any Production, backup or DR jurisdiction.
- Status: AWAITING LEGAL/DPO
- Evidence/source: UNKNOWN; NOT APPROVED; REQUIRES LEGAL VERIFICATION. No regulatory localisation determination is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L12 — Backup/DR geographic restrictions

- Answer: Backup and disaster-recovery locations must be subjected to the same or an appropriately assessed privacy/residency regime as Production data. A backup copy must not silently introduce an unapproved cross-border transfer. Legal acceptability of proposed backup and DR jurisdictions must be established **before** Production replication is authorised. Production replication remains **NOT AUTHORIZED**. No backup/DR geography is selected or approved here.
- Status: AWAITING LEGAL/DPO
- Evidence/source: REQUIRES LEGAL VERIFICATION; NOT APPROVED (no backup/DR jurisdiction); UNKNOWN (proposed locations). No DR-transfer assessment is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L13 — Restricted/Highly Restricted data restrictions

- Answer: **No dedicated Restricted / Highly Restricted geographic-restriction determination was supplied.** Questionnaire L6/L7 require classification by sensitivity and legal risk, with stronger controls for PII, passport/identity information, travel arrangements, contact details, payment-related information, employee information and potentially sensitive/special-category data. Exact Restricted / Highly Restricted categories, legal bases and geographic restrictions are **not inferred**. No Production geography is approved for Restricted / Highly Restricted data in this draft.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (actual Restricted/HR inventory). No approved classification-to-geography matrix is cited. Not Legal/DPO attestation. Not inferred.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L14 — Restricted+ failover restrictions

- Answer: **No dedicated Restricted+ failover determination was supplied.** Questionnaire L13 requires that backup and disaster-recovery locations be subjected to the same or an appropriately assessed privacy/residency regime as Production data; a backup copy must not silently introduce an unapproved cross-border transfer. Questionnaire L8 states Production and backup/DR jurisdictions are **UNKNOWN / not approved**. Legal acceptability of failover destinations is **NOT APPROVED**. Production failover/replication remains **NOT AUTHORIZED**. No DR region is selected. Failover architecture is **not inferred**.
- Status: AWAITING LEGAL/DPO
- Evidence/source: NOT APPROVED; REQUIRES LEGAL VERIFICATION. No failover-jurisdiction decision is cited. Not Legal/DPO attestation. Not inferred.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L15 — Processor/subprocessor requirements

- Answer: Any cloud/hosting provider processing personal data should be subject to appropriate contractual, privacy, security and subprocessor controls. The company should know where the provider stores/processes data and who its relevant subprocessors are. **No provider should be treated as legally approved until this assessment is completed.** This does **not** select a cloud/hosting provider.
- Status: AWAITING LEGAL/DPO
- Evidence/source: REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT (procurement / provider identity); NOT APPROVED (no provider). No DPA, subprocessor schedule, or assurance report is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L16 — PCI/cardholder-data legal scope

- Answer: SEDMC should avoid storing raw payment-card data unless there is a compelling, formally approved reason. If payment processing is required, the preferred legal/security posture is to use a compliant payment processor and minimise SEDMC's PCI DSS scope. The actual payment architecture requires confirmation. **This is not confirmation that PCI DSS compliance exists** and does **not** determine that SEDMC is in or out of PCI DSS scope. Section 4 remains **OPEN — PCI DSS STATUS NOT YET ESTABLISHED**. This draft does **not** fill the Section 4 Legal/DPO attestation row.
- Status: REQUIRES FURTHER REVIEW
- Evidence/source: OPEN — REQUIRES FINANCE/IT/LEGAL RECONCILIATION; REQUIRES STAKEHOLDER INPUT (Finance/IT evidence listed in Section 4). No PCI DSS ROC/AOC or Legal/DPO PCI determination is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

### L17 — Formal Legal/DPO confirmation and conditions

- Answer: **Not confirmed.** **Questionnaire L15 — data retention/deletion:** SEDMC should establish documented retention periods based on legal, contractual, operational and accounting requirements. Personal data should not be retained indefinitely merely because storage is inexpensive. Secure deletion/anonymisation should occur when retention is no longer justified, subject to legal holds and other obligations. **Questionnaire L17 — legal restrictions on hosting choice:** Yes. The hosting decision must account for privacy law, cross-border transfers, confidentiality, security, contractual commitments, regulatory requirements, backup/DR geography, subprocessors and data-subject location. Legal should approve the final architecture before Production processing begins. **“Legal should approve” is not evidence that Legal has already approved a Production architecture.** No hosting option is selected or approved here.
- Status: AWAITING LEGAL/DPO
- Evidence/source: NOT APPROVED; REQUIRES LEGAL VERIFICATION; REQUIRES STAKEHOLDER INPUT. No Legal/DPO sign-off, opinion of counsel, or regulatory approval is cited. Not Legal/DPO attestation.
- Reviewer:
- Date: 2026-09-15 (draft prepared; not attestation)

Questionnaire Legal L1–L17 mapped onto pack L1–L17 (headings unchanged):

1. Applicable laws/regulations → pack L1 (applicable-law text; controller establishment remains UNKNOWN)
2. Tanzania privacy requirements → pack L2
3. Kenya requirements → pack L3
4. GDPR applicability → pack L4
5. Other international privacy laws → pack L6 (pack L5 UK GDPR: no dedicated determination; not inferred)
6. Data classification → pack L7
7. Sensitive/special-category data → pack L7
8. Approved jurisdictions for Production data → pack L11 (**UNKNOWN**)
9. Cross-border data transfers → pack L9
10. Tanzania → foreign cloud → pack L10
11. EU/EEA → Tanzania or other non-EEA destination → pack L10
12. Data localisation requirement → pack L11
13. Backup/DR residency → pack L12
14. Third-party/cloud provider requirements → pack L15
15. Data retention/deletion → pack L17
16. PCI/payment-card data → pack L16
17. Legal restrictions on hosting choice → pack L17

**LEGAL/DPO DRAFT CONCLUSION:**

The legal and privacy position does not presently justify selecting a particular Production hosting jurisdiction. Questionnaire L8 states Production jurisdiction is **UNKNOWN**. Backup and DR jurisdictions are **not approved**. No hosting provider, Production region, backup region, DR region or warm-standby region may be selected based on these inputs alone.

The hosting decision must therefore remain open pending actual Legal/DPO review and stakeholder attestation.

No statement in this draft should be interpreted as legal certification, regulatory approval, PCI DSS certification, confirmation that GDPR applies or does not apply, confirmation that a particular hosting country is legally approved, or a formal opinion of counsel.

---

## Section 3 — IT I1–I19

> **DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION**
>
> This section is expert-draft input for IT review. It does **not** attest, approve, or select hosting, region, data centre, colo, cloud account, or Production infrastructure. It does **not** change ADR-0006, DP-0006, or Production / deployment / migration authorization.
>
> **Classification legend used in `Confidence` (exactly these labels):** `APPROVED` · `RECOMMENDED` · `PLANNING ASSUMPTION` · `UNKNOWN` · `NOT PROVEN` · `REQUIRES DECISION`
>
> Named `IT owner` remains blank until the IT stakeholder attests. `Date` is the draft-prepared date, **not** an attestation date.

### I1 — Existing cloud provider/account estate

- Answer: **UNKNOWN / NOT CURRENTLY EVIDENCED** for any approved reusable Production cloud account, Production data centre, or Production-grade infrastructure estate. Treat Production infrastructure as **greenfield**. Cloud-first or hybrid **can be supported** (managed PostgreSQL, containerized services, private application/data tiers, public edge/WAF, monitoring, secrets/KMS, backups, Infrastructure as Code), but the Production model is **not yet formally selected**. This does **not** select Option A / B / C / D, a provider, a region, a data centre, or a colo.
- Evidence/source: Draft IT expert input (2026-09-15). No Production cloud-account, data-centre, or reusable Production-estate evidence is cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN (existing Production estate / approved cloud account / approved data centre); RECOMMENDED (cloud-first or hybrid *can* be supported); REQUIRES DECISION (Production model / provider / region — ADR-0006 / DP-0006)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I2 — Existing corporate identity provider / directory

- Answer: **UNKNOWN / NOT CURRENTLY EVIDENCED** as a named Production corporate IdP/directory product. **RECOMMENDED** Production identity/access pattern, where available: enterprise identity / OIDC / SAML, MFA, RBAC, least privilege, separate privileged identities, and audit logging. Exact IdP product remains **REQUIRES DECISION** (ADR-0012 remains OPEN; this draft does not select an IdP).
- Evidence/source: Draft IT expert input (2026-09-15). No attested Production IdP inventory is cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN (existing IdP/directory product); RECOMMENDED (enterprise identity / OIDC / SAML / MFA / RBAC pattern); REQUIRES DECISION (named IdP)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I3 — DNS ownership/provider

- Answer: **UNKNOWN / NOT CURRENTLY EVIDENCED.** No Production DNS owner or provider is named in this draft. This draft does not select a DNS product.
- Evidence/source: Draft IT expert input (2026-09-15). No DNS evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I4 — Corporate email provider

- Answer: **UNKNOWN / NOT CURRENTLY EVIDENCED.** No Production corporate email provider is named in this draft. This draft does not select an email product.
- Evidence/source: Draft IT expert input (2026-09-15). No email-provider evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I5 — SIEM/logging/observability platform

- Answer: **UNKNOWN / NOT CURRENTLY EVIDENCED** as a named Production SIEM/logging/observability product. **RECOMMENDED** Production capabilities: centralized monitoring, central logging, security alerts, and security monitoring as part of 24/7 operations. Named platform remains **REQUIRES DECISION**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production SIEM/observability product evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN (named platform); RECOMMENDED (central monitoring / logging / security alerting capabilities)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I6 — Production operations/support team

- Answer: Business/product ownership and technical coordination exist, but a complete 24/7 SRE / DevOps / security / database operations function is **NOT PROVEN**. **24/7 Production** **RECOMMENDED** to require monitoring, alerting, incident response, on-call escalation, backup monitoring, security monitoring, recovery procedures, and access to skilled technical support. A **hybrid internal + managed provider** operations model is **acceptable** (not selected). If used, the provider should supply/support Production compute, network, storage, physical infrastructure, redundancy, infrastructure security, managed services, backups/DR, and 24/7 infrastructure support as required. Named Production operating team and provider remain **REQUIRES DECISION** (also Owner O12).
- Evidence/source: Draft IT expert input (2026-09-15). No attested 24/7 on-call roster, SRE function, or Production support contract is cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: NOT PROVEN (complete internal 24/7 SRE/DevOps/security/DB ops); RECOMMENDED (24/7 capability set); REQUIRES DECISION (named team / outsourcing mix)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I7 — Production network architecture/constraints

- Answer: No approved reusable Production network estate is **currently evidenced** (**UNKNOWN / NOT PROVEN** as Production-grade). **RECOMMENDED** pattern if Production is later authorized: private application/data tiers; public edge/WAF; network segmentation; DDoS protection as appropriate. Cloud-first or hybrid **can be supported**; Production model **not yet formally selected**. Mandatory security-related network controls (segmentation, WAF, DDoS as appropriate, tenant isolation) are **RECOMMENDED** Production expectations, **not APPROVED** requirements and **not** a provider/region choice.
- Evidence/source: Draft IT expert input (2026-09-15). No Production network diagram, firewall estate, or approved DC/cloud network evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN / NOT PROVEN (existing Production network); RECOMMENDED (segmentation, private tiers, public edge/WAF); REQUIRES DECISION (ADR-0006 hosting model)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I8 — Existing firewall/WAF/TLS capability

- Answer: Existing Production-grade firewall / WAF / TLS estate is **NOT CURRENTLY EVIDENCED** as an approved reusable Production capability. **RECOMMENDED** Production controls: WAF; DDoS protection as appropriate; TLS 1.2+ in transit, TLS 1.3 preferred. Named WAF/firewall products remain **UNKNOWN / REQUIRES DECISION**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production WAF/firewall/TLS certificate-estate evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN / NOT PROVEN (existing Production capability); RECOMMENDED (WAF, DDoS as appropriate, TLS 1.2+ / TLS 1.3 preferred)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I9 — Managed PostgreSQL requirements/constraints

- Answer: Managed PostgreSQL **can be supported** as part of a cloud-first or hybrid Production model (**RECOMMENDED** capability class, **not** a selected vendor). **RECOMMENDED** encryption: at rest for databases (and for storage/backups/logs where sensitive data exists); TLS 1.2+ in transit, TLS 1.3 preferred. Provider, edition, region, and HA topology remain **UNKNOWN / REQUIRES DECISION** (ADR-0006 / DP-0006). Database migrations remain **NOT AUTHORIZED**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production PostgreSQL subscription, region, or SLA evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (managed PostgreSQL capability class; encryption at rest/in transit); REQUIRES DECISION (vendor/region/HA); UNKNOWN (existing Production database estate)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I10 — Multi-AZ/HA requirements

- Answer: IT **RECOMMENDS** failure-domain redundancy for Production. Final **mandatory** Multi-AZ / multi-site requirement **depends on business-approved RTO/RPO and cost/risk analysis** (Owner/BIA; Section 6 currently blank). Geographic DR is **technically recommended**; final DR jurisdiction **must satisfy Legal/DPO residency and transfer requirements** (L9–L12 / L17). **RTO/RPO architecture cannot be selected** until business-approved RTO/RPO exists: relaxed RTO/RPO may support restore-from-backup; tighter requirements may require warm standby or stronger resilience. Baseline IT recovery-model **recommendation** is restore-from-backup for lower-cost resilience, with warm standby **evaluated** if approved RTO requires faster recovery. **Active/active is not justified at this stage.** `<=1h` RTO / `<=15m` RPO is **NOT PROVEN** and must **not** be treated as an approved requirement. Section 7 recovery-posture checkboxes remain **UNDECIDED**.
- Evidence/source: Draft IT expert input (2026-09-15). No measured failover, replication-lag, or DR-test evidence cited. Architecture 12.3 RTO/RPO values remain PROPOSED / NOT APPROVED and are not adopted here. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (failure-domain redundancy; geographic DR technically); REQUIRES DECISION (mandatory Multi-AZ / DR topology — depends on approved RTO/RPO, cost/risk, Legal/DPO, ADR-0006); NOT PROVEN (`<=1h` RTO / `<=15m` RPO)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I11 — Redis/cache requirements

- Answer: No Production Redis/cache product is selected. Caching is **RECOMMENDED where justified** as part of a horizontal scaling pattern, not as a sole scaling strategy and not as a named product mandate. Named cache platform remains **UNKNOWN / REQUIRES DECISION**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production Redis/cache estate evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (caching where justified); UNKNOWN / REQUIRES DECISION (named Redis/cache product)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I12 — Event transport/NATS requirements

- Answer: No Production event-transport / NATS product is selected (**UNKNOWN**). Asynchronous processing is **RECOMMENDED where appropriate** as part of scaling, not as a named NATS mandate. Named event-transport product remains **REQUIRES DECISION**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production NATS/event-bus estate evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN (named event transport / NATS); RECOMMENDED (asynchronous processing where appropriate); REQUIRES DECISION (named product)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I13 — Object storage requirements

- Answer: Object/storage capability **can be supported** in a cloud-first or hybrid model. **RECOMMENDED:** encryption at rest for storage (and backups/logs where sensitive data exists). Named object-storage product, region, and residency remain **UNKNOWN / REQUIRES DECISION** (ADR-0006 / DP-0006; Legal/DPO for location). This draft does not select a storage provider.
- Evidence/source: Draft IT expert input (2026-09-15). No Production object-storage account or residency evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (encrypted storage capability class); UNKNOWN / REQUIRES DECISION (named product / region / residency)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I14 — Secrets/KMS/Vault capability

- Answer: **RECOMMENDED:** Production keys should use KMS/HSM or equivalent, with strict IAM, rotation, audit logging, and separation from application code; secure secrets; privileged-access controls. Exact provider and key-management jurisdiction remain **UNKNOWN / REQUIRES DECISION** (pending hosting/security decision; ADR-0013 remains OPEN). This draft does not select Vault, a cloud KMS, or an HSM vendor.
- Evidence/source: Draft IT expert input (2026-09-15). No Production KMS/HSM/Vault estate evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (KMS/HSM or equivalent; IAM/rotation/audit; secrets separated from code); REQUIRES DECISION (provider / jurisdiction)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I15 — Backup tooling and restore capability

- Answer: Backup **frequency must derive from approved RPO** (Section 6 currently blank). Daily backup alone is **insufficient for a 15-minute RPO**; continuous WAL/transaction archiving or equivalent would be required for such a target. Exact Production backup frequency remains **UNKNOWN** pending approved RPO. **RECOMMENDED** restore capability: documented restore runbooks; database/application/data recovery; integrity validation; regular restore tests; full DR exercises; measured recovery times; evidence capture; encrypted backups; encrypted DR replicas; backup protection. **RECOMMENDED** evidence set: approved RTO/RPO; measured restore times; application recovery time; infrastructure provisioning time; replication lag where applicable; failover/failback measurements; provider SLA; dependency recovery times; DR test evidence. Baseline recovery-model **recommendation:** restore-from-backup for lower-cost resilience; evaluate warm standby if approved RTO requires faster recovery; active/active **not justified** at this stage. Production backup product remains **TBD** (ADR-0011). Feasibility of `<=1h` RTO / `<=15m` RPO is **NOT PROVEN** until business approval, Production architecture, implementation, and recovery testing exist.
- Evidence/source: Draft IT expert input (2026-09-15). No Production backup product, restore-test evidence, or measured recovery times cited. ADR-0011 Production backup product remains TBD; architecture 12.2 daily 19:00 EAT schedule is not converted into an approved Production RPO here. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: UNKNOWN (exact backup frequency / named product); RECOMMENDED (encrypted backups/DR replicas; restore runbooks/tests/evidence); NOT PROVEN (`<=1h` RTO / `<=15m` RPO feasibility); REQUIRES DECISION (depends on Owner/BIA RTO/RPO)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I16 — Monitoring/alerting/on-call capability

- Answer: Existing complete 24/7 monitoring / alerting / on-call function is **NOT PROVEN**. **RECOMMENDED** for 24/7: monitoring, alerting, incident response, on-call escalation, backup monitoring, security monitoring, vulnerability management, patching, and access to skilled technical support. Hybrid internal + managed provider support is **acceptable** (not selected). Named monitoring/on-call platform and roster remain **UNKNOWN / REQUIRES DECISION**.
- Evidence/source: Draft IT expert input (2026-09-15). No Production on-call rota, alerting runbook, or monitoring-platform contract cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: NOT PROVEN (existing 24/7 function); RECOMMENDED (monitoring/alerting/on-call/IR capability set); UNKNOWN / REQUIRES DECISION (named platform and roster)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I17 — Container/orchestration preference

- Answer: Containerized services **can be supported** (**RECOMMENDED** capability class). **RECOMMENDED** scaling pattern: horizontal scaling using stateless application replicas, load balancing, managed database scaling, connection pooling, caching where justified, asynchronous processing, and autoscaling where appropriate. Vertical scaling remains available but **should not be the sole scaling strategy**. Named orchestrator (Kubernetes or otherwise) remains **UNKNOWN / REQUIRES DECISION**. This draft does not select a container platform.
- Evidence/source: Draft IT expert input (2026-09-15). No Production container/orchestration estate evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (containerized services; horizontal scaling pattern); UNKNOWN / REQUIRES DECISION (named orchestrator)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I18 — Production deployment/CI/CD constraints

- Answer: Infrastructure as Code **can be supported** as part of a cloud-first or hybrid Production model (**RECOMMENDED** capability). No approved reusable Production CI/CD / deployment estate is **currently evidenced** (**UNKNOWN / NOT PROVEN**). Named pipeline, environment promotion path, and Production deploy tooling remain **REQUIRES DECISION**. Deployment remains **NOT AUTHORIZED**; this draft does not authorize Production pipelines or releases.
- Evidence/source: Draft IT expert input (2026-09-15). No Production CI/CD platform or approved release-path evidence cited. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (IaC capability); UNKNOWN / NOT PROVEN (existing Production deploy estate); REQUIRES DECISION (named CI/CD)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

### I19 — Other material infrastructure constraints

- Answer:
  - **Mandatory Production security (RECOMMENDED expectations, not APPROVED requirements):** MFA; RBAC; least privilege; privileged-access controls; network segmentation; WAF; DDoS protection as appropriate; TLS; secure secrets; patching; vulnerability management; monitoring; central logging; incident response; tenant isolation; backup protection; security testing.
  - **Encryption (RECOMMENDED):** at rest for databases/storage/backups/logs where sensitive data exists; TLS 1.2+ in transit, TLS 1.3 preferred; encrypted backups; encrypted DR replicas.
  - **Capacity (PLANNING ASSUMPTION only):** 500+ users — provider sizing and performance testing required; **not APPROVED**.
  - **Concurrency (PLANNING ASSUMPTION only):** 200+ concurrent users — load testing required; **not APPROVED**.
  - **Growth (PLANNING ASSUMPTION only):** 30% over 3–5 years — business validation and capacity modelling required; **not APPROVED**.
  - **Performance (RECOMMENDED engineering targets, not approved business requirements):** establish measurable SLOs. Candidate targets may include approximately `<=500ms` for normal API requests at the agreed percentile and approximately 1–2 seconds for normal critical user transactions.
  - **RTO/RPO feasibility:** **NOT PROVEN** until business approval, Production architecture, implementation, and recovery testing exist. Do **not** treat `<=1h` RTO / `<=15m` RPO as approved requirements.
  - **Approved Production data centre / cloud account / reusable Production estate:** **UNKNOWN / NOT CURRENTLY EVIDENCED**; treat as greenfield.
  - None of the above selects a hosting provider, cloud region, data centre, colo, or ADR-0006 option.
- Evidence/source: Draft IT expert input (2026-09-15). Planning assumptions and engineering targets are not measured Production evidence and are not Owner/BIA/Legal attestation. Not stakeholder attestation.
- IT owner:
- Date: 2026-09-15 (draft prepared; not attestation)
- Confidence: RECOMMENDED (security/encryption/SLO engineering targets); PLANNING ASSUMPTION (500+ users / 200+ concurrent / 30% growth); NOT PROVEN (RTO/RPO feasibility); UNKNOWN (Production DC / cloud account / estate)
- Approval/status: DRAFT IT INPUT — REQUIRES IT STAKEHOLDER REVIEW AND ATTESTATION

---

## Section 4 — PCI / cardholder reconciliation

> **DRAFT IT/FINANCE INPUT — REQUIRES STAKEHOLDER REVIEW AND ATTESTATION**
>
> PCI DSS means Payment Card Industry Data Security Standard. Current SEDMC PCI DSS status is **NOT ESTABLISHED**. This section does **not** claim PCI DSS compliance, does **not** place SEDMC in or out of PCI DSS scope, does **not** select a hosting provider or region, and does **not** attest Owner, Finance, IT, or Legal/DPO approval.
>
> Do **not** infer PCI compliance merely because a third-party payment processor may be PCI compliant. Do **not** infer that SEDMC is outside PCI scope merely because the intended architecture uses a third-party payment provider.
>
> Classification labels used below: `UNKNOWN` · `NOT ESTABLISHED` · `NOT PROVEN` · `REQUIRES VERIFICATION` · `RECOMMENDED` · `PREFERRED ARCHITECTURE` · `OPEN`. None of these is `APPROVED`.

Do **not** resolve contradictions automatically. Record each stakeholder’s statement separately, then set `PCI STATUS` only when stakeholders have explicitly aligned.

| Stakeholder | PCI/cardholder scope | Evidence | Status | Date |
| --- | --- | --- | --- | --- |
| Owner | | | | |
| Finance | **DRAFT (not attestation).** Store/process/transmit of payment-card data: **UNKNOWN — REQUIRES FINANCE/IT VERIFICATION** across EOS, website, email, spreadsheets, messaging, payment forms, accounting systems and other SEDMC-controlled channels. Payment processors/gateways/banks/acquirers: **UNKNOWN — REQUIRES FINANCE INPUT**. Processor PCI DSS validation: **REQUIRES EVIDENCE FROM FINANCE/IT** (current documentation, not marketing statements). SEDMC PCI DSS status: **NOT ESTABLISHED**. Preferred commercial posture: cardholder-data minimisation; third-party capture of card details; SEDMC retains only minimum reconciliation information. Routine email, WhatsApp/messaging, and spreadsheet handling of full card details should be prohibited pending verification of current practice. PCI reconciliation remains **OPEN**. | None cited. Required: complete processor/gateway list; payment-flow diagrams; email/WhatsApp/spreadsheet/file review; provider PCI DSS validation docs and contracts; accounting/reconciliation workflow. Not stakeholder attestation. | DRAFT IT/FINANCE INPUT — REQUIRES STAKEHOLDER REVIEW AND ATTESTATION. **UNKNOWN** / **NOT ESTABLISHED** / **REQUIRES VERIFICATION** / **OPEN**. | 2026-09-15 (draft prepared; not attestation) |
| Legal/DPO | | | | |
| IT | **DRAFT (not attestation).** Intended EOS Production architecture: **PREFERRED ARCHITECTURE** is cardholder-data minimisation — EOS should **not** store, process, or directly handle raw payment-card data. EOS database: raw cardholder data **NOT PERMITTED AS THE DEFAULT ARCHITECTURE**. Backups and DR replicas: raw cardholder data should not enter EOS stores so it cannot appear in backups/replicas/DR; if discovered, those environments must be assessed. EOS may retain only minimum non-sensitive payment status/reference data (status, transaction/reference ID, amount, currency, date/time, provider, invoice/booking reference, reconciliation status) — not full PAN, CVV/CVC, or other SAD. Current storage/process/transmit in SEDMC-controlled systems: **NOT PROVEN / UNKNOWN — REQUIRES VERIFICATION**. SEDMC PCI DSS status: **NOT ESTABLISHED**. Scope remains **OPEN** until evidence is collected. This does **not** select a payment provider, host, or region. | None cited. Required: EOS database/data-model review; website/payment-form review; confirmation whether SEDMC systems receive or transmit CHD; backup/DR data-content review if CHD is found. Not stakeholder attestation. | DRAFT IT/FINANCE INPUT — REQUIRES STAKEHOLDER REVIEW AND ATTESTATION. **PREFERRED ARCHITECTURE** / **NOT PROVEN** / **UNKNOWN** / **NOT ESTABLISHED** / **OPEN**. | 2026-09-15 (draft prepared; not attestation) |

**PCI STATUS** (exactly one, when explicitly set by stakeholders):

- [ ] IN SCOPE
- [ ] OUT OF SCOPE
- [ ] PARTIAL
- [ ] UNKNOWN
- [ ] REQUIRES FORMAL REVIEW

Draft IT/Finance position (not a stakeholder-aligned `PCI STATUS` selection): **OPEN — PCI DSS STATUS NOT YET ESTABLISHED.** Checkboxes above remain unset because Owner, Finance, IT, and Legal/DPO have not explicitly aligned. Do **not** treat this draft as IN SCOPE or OUT OF SCOPE.

Notes / unresolved contradiction:

**Unresolved:** Current payment-processing arrangements are not sufficiently evidenced. SEDMC PCI DSS status is **NOT ESTABLISHED**. Reconciliation remains **OPEN** until evidence is collected and applicable PCI DSS scope is determined. No contradiction among attested stakeholders is recorded because Owner and Legal/DPO rows are blank and Finance/IT rows are draft only.

The numbered items below are a **mapping of draft IT/Finance decision inputs** onto this existing PCI section. They are **not** additional official fact-pack questions, **not** Owner/Legal answers, and **not** `APPROVED` requirements.

1. **Does SEDMC store, process or transmit payment-card data?** **UNKNOWN — REQUIRES FINANCE/IT VERIFICATION.** Current arrangements have not been sufficiently evidenced. Assessment must cover the EOS application, website, email, spreadsheets, messaging channels, payment forms, accounting systems, and any other SEDMC-controlled systems or processes.

2. **Does SEDMC store cardholder data in its own systems?** No cardholder-data storage should be permitted in the SEDMC EOS Production platform unless explicitly justified, designed, authorised, and assessed for PCI DSS requirements. Current status: **NOT PROVEN — REQUIRES VERIFICATION** that no cardholder data is currently stored in SEDMC-controlled systems or business processes. **PREFERRED ARCHITECTURE:** a PCI-compliant payment provider collects and processes card details directly; SEDMC receives only the minimum transaction/reference information required for reconciliation and operations. Provider PCI compliance does **not** establish SEDMC PCI DSS compliance or out-of-scope status.

3. **Does SEDMC process payment-card data?** **UNKNOWN — REQUIRES FINANCE/IT VERIFICATION.** Commercial payment processing does not establish that SEDMC’s own systems process cardholder data. Finance and IT must identify the actual payment workflow and whether card data enters, passes through, or is handled by any SEDMC-controlled application, system, device, file, or communication channel.

4. **Does SEDMC transmit payment-card data?** **UNKNOWN — REQUIRES VERIFICATION.** IT and Finance must determine whether payment-card data is transmitted through SEDMC-controlled channels, including website, EOS, email, spreadsheets, messaging applications, APIs, payment terminals, or integrations. If cardholder data is ever transmitted, the transmission mechanism and PCI DSS scope must be formally assessed.

5. **What payment processor/payment gateway does SEDMC use?** **UNKNOWN — REQUIRES FINANCE INPUT.** Finance must provide the complete list of payment processors, payment gateways, banks, acquiring institutions, and other third parties involved in receiving or processing card payments. Each provider’s contractual role, data flow, and applicable PCI DSS documentation should then be reviewed by IT/Finance. This draft does **not** name or select a processor.

6. **Is the payment processor PCI DSS compliant?** **REQUIRES EVIDENCE FROM FINANCE/IT.** Obtain current PCI DSS compliance/validation documentation from each relevant processor where applicable; do not rely solely on marketing statements. Evidence should identify provider, relevant service, validation date/period, and applicable documentation. No processor is asserted compliant in this pack.

7. **Is SEDMC itself PCI DSS compliant?** **NOT ESTABLISHED.** SEDMC should not represent itself as PCI DSS compliant unless it has completed the applicable PCI DSS assessment and possesses the required validation documentation. No PCI DSS certification/compliance status should be inferred from use of a PCI-compliant third-party payment processor.

8. **Is the EOS platform expected to handle cardholder data?** **No** as **PREFERRED ARCHITECTURE** (not an attested as-is fact). Intended Production architecture should exclude storage, processing, and direct handling of raw payment-card data by EOS wherever reasonably possible. Card entry/processing should preferably occur directly in an appropriately compliant third-party payment-processing environment. EOS should receive only the minimum non-sensitive payment status/reference information necessary for operations and reconciliation.

9. **Should cardholder data be stored in the EOS database?** **No — NOT PERMITTED AS THE DEFAULT ARCHITECTURE** (RECOMMENDED / PREFERRED ARCHITECTURE, not APPROVED PCI scope). Raw cardholder data should not be stored in the EOS PostgreSQL database. A future proposal to store cardholder data must trigger a separate security, legal, PCI DSS, and architecture assessment before implementation. Database/migrations remain **NOT AUTHORIZED**.

10. **Should cardholder data be stored in backups?** **No, by design** (PREFERRED ARCHITECTURE). Prevent raw cardholder data from entering the EOS data store so it cannot appear in EOS database backups, replicas, or DR environments. If cardholder data is discovered in any backup, that backup environment must be included in the applicable PCI/security assessment and appropriately protected.

11. **Should cardholder data be transmitted to DR replicas?** **No, by design** (PREFERRED ARCHITECTURE). Avoid ingesting raw cardholder data so it is not replicated into DR systems. Any architecture that causes cardholder data to enter a DR environment must undergo a separate PCI DSS and security assessment, including DR jurisdiction and provider. DR jurisdiction also depends on Legal/DPO and ADR-0006/DP-0006; this item does **not** select a DR region.

12. **Can card details be sent through email?** SEDMC should **prohibit** the routine transmission of full payment-card details through ordinary email (**RECOMMENDED**). If card details are currently received by email, Finance and IT must identify that workflow (**REQUIRES VERIFICATION**) and establish an appropriate compliant alternative. Employees should not be instructed to forward, copy, store, or manually transcribe full card details into SEDMC systems.

13. **Can card details be sent through WhatsApp or other messaging platforms?** SEDMC should **prohibit** the routine transmission or storage of full payment-card details through WhatsApp or other general-purpose messaging channels (**RECOMMENDED**). Existing practices must be reviewed (**REQUIRES VERIFICATION**). Where such data is received inadvertently, follow incident/data-handling procedure and do not copy it into EOS, spreadsheets, databases, or other uncontrolled repositories.

14. **Can card details be stored in Excel or other spreadsheets?** **No** — raw payment-card data should not be stored in ordinary Excel spreadsheets or other uncontrolled business files (**RECOMMENDED**). Finance must verify whether historical spreadsheets contain cardholder data and, if so, conduct an appropriate review and secure remediation (**REQUIRES VERIFICATION**). Reconciliation should use transaction IDs, payment references, amounts, dates, and statuses rather than raw card numbers wherever possible.

15. **What payment information may EOS retain?** **PREFERRED ARCHITECTURE / RECOMMENDED:** only the minimum required for legitimate business and financial reconciliation, such as payment status; transaction/reference ID; amount; currency; date/time; payment provider; invoice/booking reference; reconciliation status. EOS should not retain full PAN, CVV/CVC, or other sensitive authentication data. Not an approved data-retention policy until stakeholders attest.

16. **What is the preferred payment architecture?** **PREFERRED ARCHITECTURE:** third-party payment-processing. The customer/cardholder should enter payment-card information directly into the appropriately secured payment-provider environment wherever practical. SEDMC systems should receive only the minimum transaction information required for operational and financial reconciliation. This is intended to minimise exposure and reduce PCI DSS scope; **it does not by itself establish PCI DSS compliance** and does **not** place SEDMC outside PCI DSS scope.

17. **What PCI controls are required if SEDMC ever handles cardholder data?** If SEDMC ever stores, processes, or transmits cardholder data, IT and Finance must first establish applicable PCI DSS scope and requirements. Controls would **potentially** include: network segmentation; access control; MFA; least privilege; encryption; secure key management; vulnerability management; secure configuration; logging and monitoring; security testing; incident response; data retention/deletion controls; third-party/service-provider management; applicable PCI DSS validation requirements. The precise control set must be determined from the actual cardholder-data environment. **RECOMMENDED** contingency only — **not APPROVED** and **not** a claim that SEDMC currently handles CHD.

18. **What evidence is required?** Collect before the PCI position is considered resolved: (1) complete list of payment processors/gateways; (2) payment-flow/data-flow diagrams; (3) confirmation whether SEDMC systems receive cardholder data; (4) whether email contains cardholder data; (5) whether WhatsApp/messaging channels contain cardholder data; (6) whether spreadsheets/files contain cardholder data; (7) payment-provider PCI DSS compliance/validation documentation where applicable; (8) contractual/service-provider documentation; (9) EOS database/data-model review; (10) website/payment-form review; (11) accounting/payment reconciliation workflow; (12) determination of SEDMC’s resulting PCI DSS scope.

19. **Final reconciliation / decision:** **OPEN — PCI DSS STATUS NOT YET ESTABLISHED.** SEDMC should not store raw payment-card data in EOS or ordinary business repositories. Preferred architecture is direct card entry and processing through an appropriately compliant third-party payment provider, with EOS receiving only minimum non-sensitive transaction/reconciliation information. Finance and IT must verify current processors and all channels through which card data may be received, stored, or transmitted. Provider PCI DSS evidence and SEDMC’s resulting PCI DSS scope must be documented before this item is closed. **No PCI DSS compliance claim should be made without appropriate validation.**

---

## Section 5 — BIA A–J

> **DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION**
>
> These answers are **business / BCM input only**. They are **not** IT-validated technical requirements, **not** infrastructure specifications, **not** Legal/DPO findings, and **not** formal stakeholder approval.
>
> Do **not** convert **3 hours** maximum tolerable disruption into a formally approved technical RTO. Do **not** convert **Zero** data-loss tolerance into a formally approved technical RPO of 0 minutes. Do **not** convert **Immediately** into a technical failover SLA. Do **not** convert **Restore from backup** into an approved technical DR architecture. IT must later assess technical feasibility. Section 6 stakeholder-approved RTO/RPO and Section 7 recovery-posture checkboxes remain unset.
>
> The same nine business answers apply to every scenario A–J. The business function for every scenario is Programme building. Scenario headings A–J are preserved as failure modes; they do **not** invent different business functions.
>
> Do **not** insert proposed architecture-12.3 RTO/RPO values here. Those remain **PROPOSED / NOT APPROVED** in Section 6.

### A — Complete EOS outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### B — Database outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### C — Authentication outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### D — Event transport outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### E — Email outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### F — Redis/search projection outage

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### G — One hosting zone failure

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### H — Primary region failure

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### I — Backup copy failure

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

### J — Data corruption

1. Business impact: Business function: Most of the time will be Programme building. Criticality: Very critical. Impact of outage: The business will stop, relationships with clients will be damaged, and losses in revenue will occur. Time-to-impact: Unknown.
2. Operational impact: Failure to deliver the expected results.
3. Financial/reputational impact: Financial: Loss of revenue. Customer: Relationship damage and loss of clients. Contractual: Legal action will be taken against the company (stated business stakeholder concern; not an independent assertion that legal action is legally guaranteed). Regulatory: Unknown. Reputational: Huge damage to the brand.
4. Maximum tolerable downtime: 3 hours. BUSINESS REQUIREMENT (maximum tolerable disruption as stated). NOT a formally approved technical RTO. IT must subsequently determine the technical capability required to satisfy this business requirement.
5. Maximum tolerable data loss: Zero. BUSINESS REQUIREMENT (data-loss tolerance as stated). NOT a formally approved technical RPO of 0 minutes. Technical feasibility and architecture must be assessed separately by IT.
6. Recovery priority: Immediately. BUSINESS recovery priority as stated. NOT a technical failover SLA or failover target. Recovery requirement (BUSINESS/BCM preferred recovery capability, NOT an approved technical DR architecture): Restore from backup. IT must determine whether restore-from-backup can satisfy the business requirements.
7. Business owner: Not named. Formal owner name, title, signature and attestation are not recorded in this draft.
8. Evidence/source: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not an attested BIA workshop record. Not IT validation. Time-to-impact remains Unknown. Regulatory consequence remains Unknown and is not filled from the Legal/DPO section.
9. Approval status: DRAFT BUSINESS / BCM INPUT — PROVIDED BY BUSINESS STAKEHOLDER; REQUIRES FORMAL STAKEHOLDER REVIEW AND ATTESTATION. Not formally approved.

---

## Section 6 — RTO/RPO

Architecture proposal status (repository architecture 12.3): **PROPOSED / NOT APPROVED**

Do **not** convert that proposal into approved requirements by filling the blanks below.

Do **not** convert Section 5 Business/BCM **3 hours** maximum tolerable disruption or **Zero** data-loss tolerance into the approved technical RTO/RPO fields below. Those remain business requirements until separately approved.

Do **not** convert Owner-supplied values (critical-function maximum interruption **2 hours**; critical-function data-loss tolerance **Zero**; overall RTO **4 hours**; critical-function RTO **3 hours**; overall and critical data/service RPO **3 hours**) into the approved technical RTO/RPO fields below. Those remain Owner business requirements. See Section 1 reconciliation flag: **RTO/RPO/BIA RECONCILIATION REQUIRED**.

- Stakeholder-approved RTO:
- Stakeholder-approved RPO:
- Approving stakeholder:
- Approval date:
- Evidence:

---

## Section 7 — Recovery posture

> **DRAFT RECOVERY POSTURE INPUT — BUSINESS/BCM AND IT POSITION; REQUIRES FORMAL STAKEHOLDER REVIEW, TECHNICAL VALIDATION, AND GOVERNANCE APPROVAL**
>
> This section distinguishes: (1) Business/Owner recovery requirements; (2) IT technical recommendations; (3) technically feasible architecture in principle; (4) formally approved RTO/RPO (**none** — Section 6 remains blank / not approved); (5) Legal/DPO-approved recovery jurisdictions (**none**); (6) implemented and tested recovery capability (**none claimed**).
>
> **3 hours** is the current Business/BCM maximum tolerable disruption. **Zero** is the current Business/BCM data-loss tolerance. Neither is a formally approved technical RTO/RPO. Warm standby, geographically separate DR, continuous replication, and restore-from-backup are **not** represented as implemented, proven sufficient, or assigned to a jurisdiction. No Production recovery architecture is approved or implemented merely by documenting these answers. No cloud provider, hosting region, country, or DR site is selected.

**Primary posture** (exactly one, when stakeholders decide):

- [ ] RESTORE_FROM_BACKUP
- [ ] WARM_STANDBY
- [ ] ACTIVE/ACTIVE
- [ ] OTHER
- [ ] UNDECIDED

Draft note (not a stakeholder-aligned checkbox selection): restore-from-backup is **not established as sufficient**; warm standby is **recommended/likely required** but **not implemented and not approved infrastructure**; active/active is **not** selected. Checkboxes remain unset because no recovery architecture has been formally decided.

- Owner decision: **BUSINESS REQUIREMENT — NOT A TECHNICAL ARCHITECTURE DECISION.** High-availability recovery posture capable of restoring critical business operations within 3 hours, with zero business-tolerated data loss. Immediate recovery is required for critical functions. The final technical recovery architecture should be determined by IT based on these business requirements. Maximum tolerable disruption: 3 hours for the critical business function. Recovery priority: immediately. These values are **not** an approved technical RTO of 3 hours and **not** a technical failover SLA.
- IT assessment: **TECHNICAL RECOMMENDATION / FEASIBILITY POSITION — NOT IMPLEMENTED.** A cloud-based high-availability architecture with multi-failure-domain Production deployment, continuous database protection/replication, encrypted backups, and a warm-standby or equivalent geographically separate recovery environment is technically feasible **in principle**. Actual RTO/RPO performance is **not yet proven** because Production infrastructure has not been selected, implemented, and tested. Pending formal RTO/RPO approval: a backup-only recovery model should **not** be assumed sufficient against the current business 3-hour / zero data-loss requirements. Provisional technical direction (not implemented, not approved): high availability plus warm standby/geographically separate recovery, with continuous database protection/replication and tested restoration. Final recovery architecture must be validated against the **formally approved** RTO/RPO (none exists in Section 6). Backup frequency must be derived from approved RPO; daily backups are insufficient as the **sole** protection mechanism given zero tolerated data loss — continuous transaction/WAL archiving or equivalent, supplemented by scheduled full/incremental backups, is the technical recommendation, **not** a final Production backup schedule. Restoration testing is **recommended** at least quarterly (plus after material change, plus periodic DR/failover simulations); these tests are **not** claimed to have occurred. Recoverability evidence listed in Q11 is a **requirement**, not existing evidence.
- BCM assessment: **BUSINESS REQUIREMENT / REQUIRES IT VALIDATION.** Restore-from-backup may be used as a recovery mechanism but is **not established as sufficient** until it is demonstrated to satisfy maximum 3-hour disruption and zero tolerated data loss; if it cannot, a stronger recovery model is required. Warm standby is **recommended/likely required** for critical functions, subject to IT confirmation — **not implemented**. Geographically separate DR is **recommended** as a business continuity requirement for critical services, subject to Legal/DPO approval of the recovery jurisdiction and IT feasibility — **not implemented** and **no DR site/jurisdiction selected**.
- Legal/DPO constraints: **LEGAL/DPO + HOSTING GOVERNANCE DEPENDENCY.** Recovery copies may reside **only** in jurisdictions and facilities approved through the Legal/DPO, hosting and data-residency decision process (ADR-0006 / DP-0006; Section 2 L9–L15, L17). Recovery copies must be encrypted, access-controlled, independently protected from the primary environment, and geographically separated where required for DR. **No Production backup or DR jurisdiction is currently approved.** This field does **not** override Section 2 and does **not** select Tanzania, Kenya, South Africa, the EU, or any other jurisdiction.
- Evidence: None cited. No dated restore/DR test records, measured recovery times, integrity-validation evidence, implemented warm-standby/geo-DR estate, or approved RTO/RPO approval record is claimed. ADR-0011 Production backup product remains TBD.
- Approval: DRAFT RECOVERY POSTURE INPUT — BUSINESS/BCM AND IT POSITION; REQUIRES FORMAL STAKEHOLDER REVIEW, TECHNICAL VALIDATION, AND GOVERNANCE APPROVAL. Not formally approved. Not Production authorization.

The numbered items below map Owner/Business questions 1–5 and IT questions 6–11 onto this existing recovery-posture section. They do **not** replace the fields above and are **not** additional official fact-pack questions that change Section 6 approved RTO/RPO status.

1. **What recovery posture does the business require?** High-availability recovery posture capable of restoring critical business operations within 3 hours, with zero business-tolerated data loss. Immediate recovery is required for critical functions. The final technical recovery architecture should be determined by IT based on these business requirements. Classification: BUSINESS REQUIREMENT — NOT A TECHNICAL ARCHITECTURE DECISION.
2. **Is restore-from-backup sufficient?** Not established as sufficient. Restore-from-backup may be used as a recovery mechanism, but it must be demonstrated that it can satisfy the business requirement of maximum 3-hour disruption and zero tolerated data loss. If it cannot, a stronger recovery model is required. Classification: BUSINESS REQUIREMENT / REQUIRES IT VALIDATION.
3. **Is warm standby required?** Recommended/likely required for critical business functions, subject to IT confirmation. Given the 3-hour maximum tolerable disruption and zero data-loss tolerance, the business requires a recovery capability materially stronger than an untested backup-only model. Classification: BUSINESS/BCM POSITION — REQUIRES IT FEASIBILITY VALIDATION. Warm standby is **not** implemented and **not** approved infrastructure.
4. **Is geographically separate DR required?** Yes, recommended as a business continuity requirement for critical services, subject to Legal/DPO approval of the recovery jurisdiction and IT feasibility. Recovery copies must not reside in an unapproved jurisdiction. Classification: BUSINESS/BCM REQUIREMENT / LEGAL AND IT VALIDATION REQUIRED. No country, cloud region, provider, or DR site is selected.
5. **What level of downtime is acceptable?** Maximum tolerable disruption: 3 hours for the critical business function. Recovery priority: immediately. Classification: BUSINESS/BCM REQUIREMENT. This is **not** labelled as approved technical RTO = 3 hours.
6. **What recovery posture is technically feasible?** A cloud-based high-availability architecture with multi-failure-domain Production deployment, continuous database protection/replication, encrypted backups, and a warm-standby or equivalent geographically separate recovery environment is technically feasible in principle. However, the actual RTO/RPO performance is not yet proven because the Production infrastructure has not been selected, implemented, and tested. Classification: TECHNICAL RECOMMENDATION / FEASIBILITY POSITION — NOT IMPLEMENTED. Synchronous/asynchronous replication, warm standby, active/active, multi-region, and any particular provider/region are **not** approved.
7. **What recovery model satisfies the approved RTO/RPO?** Pending formal RTO/RPO approval. Based on the current Business/BCM requirements of maximum 3-hour disruption and zero tolerated data loss, a backup-only recovery model should not be assumed sufficient. The provisional technical direction is high availability plus warm standby/geographically separate recovery, with continuous database protection/replication and tested restoration. Final recovery architecture must be validated against the formally approved RTO/RPO. Classification: PENDING BUSINESS RTO/RPO APPROVAL AND IT VALIDATION. Section 6 contains **no** stakeholder-approved RTO or RPO.
8. **What backup frequency is required?** Backup frequency must be derived from the approved RPO. Given the current business requirement of zero tolerated data loss, daily backups are insufficient as the sole protection mechanism. The technical design should use continuous transaction/WAL archiving or equivalent continuous data protection, supplemented by scheduled full/incremental backups. Exact backup intervals and retention require IT/security and business approval. Classification: TECHNICAL RECOMMENDATION — REQUIRES RPO VALIDATION. This is **not** a final Production backup schedule.
9. **Where may recovery copies reside?** Recovery copies may reside only in jurisdictions and facilities approved through the Legal/DPO, hosting and data-residency decision process. Recovery copies must be encrypted, access-controlled, independently protected from the primary environment, and geographically separated where required for DR. No Production backup or DR jurisdiction is currently approved. Classification: LEGAL/DPO + HOSTING GOVERNANCE DEPENDENCY. No jurisdiction is selected.
10. **How frequently must restoration be tested?** At least quarterly for formal restore/recovery testing, with additional testing after material architecture, infrastructure, database, backup, or recovery changes. Critical recovery procedures should also be exercised through periodic DR/failover simulations. Test results must be documented and remediation tracked. Classification: TECHNICAL/OPERATIONAL RECOMMENDATION. These tests are **not** claimed to have already occurred.
11. **What evidence must demonstrate recoverability?** Documented and repeatable evidence should demonstrate that backups are completing successfully, recovery copies are available and protected, restoration has been successfully performed, recovered data is complete and consistent, application dependencies can be restored, recovery procedures are executable, recovery times are measured, data-loss/recovery points are measured, failover/failback procedures are tested where applicable, and test results demonstrate achievement against the approved RTO/RPO. Evidence should include dated restore/DR test records, logs, measured recovery times, integrity validation, replication/backup status, identified failures, and remediation actions. Classification: RECOVERABILITY EVIDENCE REQUIREMENT. **No such evidence is claimed to exist** in this pack.

---

## Section 8 — Data-residency matrix

> **DRAFT DATA RESIDENCY POSITION — REQUIRES FORMAL LEGAL/DPO AND OWNER REVIEW/ATTESTATION**
>
> This matrix does **not** select a Production provider, hosting region, backup region, DR region, warm-standby region, data centre, or colo. Named countries below, if mentioned, are **candidate / assessment** positions only. No Production jurisdiction is currently pre-approved. Where a human factual, legal, or financial decision is still required: **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.

Do **not** populate geography with an approved location until Legal/DPO and Owner have attested. Cells below record **not approved** status, not a selected geography.

| Data classification | Primary geography | Backup geography | DR geography | Restricted+ failover allowed? | Prohibited locations | Legal confirmation |
| --- | --- | --- | --- | --- | --- | --- |
| Public | NOT APPROVED. Production data may be hosted only in jurisdictions formally approved through Legal/DPO, Owner and hosting-governance. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION** / REQUIRES FORMAL HOSTING/RESIDENCY DECISION. | NOT APPROVED. Backups only in jurisdictions approved for the relevant classification and transfer rules; encrypted; access-controlled; independently protected; must not introduce an unapproved international transfer. NO BACKUP JURISDICTION CURRENTLY APPROVED. | NOT APPROVED. DR replicas only in a jurisdiction approved for the replica’s data and transfer rules. NO DR JURISDICTION CURRENTLY APPROVED. | NOT APPROVED. Warm standby only in a jurisdiction approved for the replicated data and operational access. NO WARM-STANDBY JURISDICTION CURRENTLY APPROVED. | No specific country list invented. Any jurisdiction that fails applicable legal/privacy/security/contractual/residency/regulatory/BCM requirements, or that has not received required approval for the relevant classification and activity, is prohibited for that use case until formally approved. | REQUIRES LEGAL/DPO ATTESTATION |
| Internal | Same as Public: no Production jurisdiction currently pre-approved. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. | NO BACKUP JURISDICTION CURRENTLY APPROVED. | NO DR JURISDICTION CURRENTLY APPROVED. | NO WARM-STANDBY JURISDICTION CURRENTLY APPROVED. | No specific country list invented (same rule as Public). | REQUIRES LEGAL/DPO ATTESTATION |
| Confidential | Same as Public: no Production jurisdiction currently pre-approved. Cross-border processing requires applicable lawful transfer mechanism and safeguards. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. | NO BACKUP JURISDICTION CURRENTLY APPROVED. | NO DR JURISDICTION CURRENTLY APPROVED. | NO WARM-STANDBY JURISDICTION CURRENTLY APPROVED. | No specific country list invented (same rule as Public). | REQUIRES LEGAL/DPO ATTESTATION |
| Restricted | REQUIRES DATA-CLASSIFICATION AND LEGAL/DPO VALIDATION. Restricted data may be hosted only in jurisdictions approved for Restricted data after Legal/DPO, security and contractual assessment. No Restricted geography selected. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. | NO BACKUP JURISDICTION CURRENTLY APPROVED for Restricted data. | NO DR JURISDICTION CURRENTLY APPROVED for Restricted data. | Only if Legal/DPO, security and contractual assessment approves the failover jurisdiction for Restricted data. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. | No specific country list invented (same rule as Public). | REQUIRES LEGAL/DPO ATTESTATION |
| Highly Restricted | DEFAULT RESTRICTIVE POSTURE. Highly Restricted data should, by default, remain within the primary approved jurisdiction. **No primary jurisdiction is currently approved.** Exceptions (processing, backup or recovery elsewhere) require express Legal/DPO approval and established legal, contractual, technical and organisational safeguards. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. | Default: not outside the (not-yet-approved) primary jurisdiction unless Legal/DPO expressly approves. NO BACKUP JURISDICTION CURRENTLY APPROVED. | Default: not outside the (not-yet-approved) primary jurisdiction unless Legal/DPO expressly approves. NO DR JURISDICTION CURRENTLY APPROVED. | Default: **no**, unless Legal/DPO expressly approves. EXCEPTIONS REQUIRE FORMAL APPROVAL. | No specific country list invented (same rule as Public). Unapproved jurisdictions remain prohibited for Highly Restricted use until expressly approved. | REQUIRES LEGAL/DPO ATTESTATION |

The numbered items below map questionnaire Part 7 (data residency) onto this existing matrix section. They do **not** select a provider or approved geography.

1. **Where may Production data be hosted?** Production data may be hosted only in jurisdictions formally approved through the Legal/DPO, Owner and hosting-governance process, taking into account applicable privacy law, contractual obligations, data classification, cross-border transfer requirements, security, operational resilience and business requirements. No Production jurisdiction is currently pre-approved by this decision record. Status: REQUIRES FORMAL HOSTING/RESIDENCY DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
2. **Where may backups be hosted?** Backups may be hosted only in jurisdictions approved for the relevant data classification and cross-border transfer requirements. Backup locations must not introduce an unapproved international transfer. Backups must be encrypted, access-controlled and protected independently from the primary environment. Status: NO BACKUP JURISDICTION CURRENTLY APPROVED.
3. **Where may DR replicas be hosted?** DR replicas may be hosted only in a jurisdiction approved for the data contained in the replica and for the applicable cross-border transfer requirements. The DR location must provide appropriate security, availability and recovery capability and must be consistent with the approved hosting/residency architecture. Status: NO DR JURISDICTION CURRENTLY APPROVED.
4. **Where may warm standby be hosted?** Warm standby may be hosted only in a jurisdiction approved for the replicated data and associated operational access. The location must satisfy Legal/DPO, security, recovery and business-continuity requirements. Status: NO WARM-STANDBY JURISDICTION CURRENTLY APPROVED.
5. **Where may Restricted data be hosted?** Restricted data may be hosted in jurisdictions approved for Restricted data following Legal/DPO, security and contractual assessment. Cross-border processing must have an applicable lawful transfer mechanism and appropriate safeguards. Status: REQUIRES DATA-CLASSIFICATION AND LEGAL/DPO VALIDATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
6. **Where may Highly Restricted data be hosted?** Highly Restricted data should, by default, remain within the primary approved jurisdiction unless Legal/DPO expressly approves processing, backup or recovery in another jurisdiction and the necessary legal, contractual, technical and organisational safeguards are established. Status: DEFAULT RESTRICTIVE POSTURE; EXCEPTIONS REQUIRE FORMAL APPROVAL. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
7. **Are Tanzania locations permitted?** Yes, subject to confirmation of the specific facility/provider and compliance with applicable security, privacy, operational and contractual requirements. Tanzania should be treated as a **permitted candidate jurisdiction**, **not** as an automatically approved Production location. Status: CANDIDATE JURISDICTION — SPECIFIC FACILITY/PROVIDER REQUIRES APPROVAL. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. This does **not** select Tanzania as the Production, backup, or DR region.
8. **Are Kenya locations permitted?** Potentially, subject to Legal/DPO assessment and applicable cross-border transfer requirements. Kenya should not be treated as automatically approved merely because it is within East Africa. Status: REQUIRES LEGAL/DPO CONFIRMATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. This does **not** select Kenya.
9. **Are EU locations permitted?** Potentially, subject to Legal/DPO assessment, applicable contractual requirements, data classification and any applicable international-transfer obligations. EU hosting should not be treated as automatically approved or automatically prohibited. Status: REQUIRES LEGAL/DPO CONFIRMATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. This does **not** select an EU region.
10. **Are other jurisdictions permitted?** Potentially, on a case-by-case basis following Legal/DPO, security, contractual, data-residency and transfer assessment. No jurisdiction outside the approved policy should be used for Production, backup or DR without explicit approval. Status: REQUIRES FORMAL POLICY/APPROVAL. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
11. **Which jurisdictions are prohibited?** Any jurisdiction that fails the applicable legal, privacy, security, contractual, data-residency, regulatory or business-continuity requirements, or that has not received the required approval for the relevant data classification and processing activity, is prohibited for that use case until formally approved. Status: NO SPECIFIC COUNTRY LIST TO BE INVENTED.
12. **Can support personnel access the data remotely from another country?** Remote access from another country may be permitted only where the access is legally permitted, contractually authorised, necessary, secured and appropriately controlled. Access should follow least privilege, MFA, logging, approved support procedures and data-minimisation principles. Remote access locations must be considered part of the cross-border data-processing assessment. Status: REQUIRES LEGAL/DPO AND SECURITY VALIDATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
13. **Can monitoring/logging systems process identifiers outside the primary jurisdiction?** Potentially, subject to data minimisation and Legal/DPO approval. Monitoring and logging systems should avoid unnecessary personal data and use pseudonymisation or redaction where practical. If identifiers or personal data leave the primary jurisdiction, the transfer must be assessed and appropriately safeguarded. Status: REQUIRES LEGAL/DPO AND TECHNICAL VALIDATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
14. **Can identity/email/CDN services process relevant data outside the primary jurisdiction?** Potentially, subject to Legal/DPO and security assessment. Third-party identity, email, CDN, observability and other SaaS services must be included in the data-flow and subprocessor assessment. Their processing locations, subprocessors, contractual terms and international-transfer mechanisms must be documented before Production use. Status: REQUIRES LEGAL/DPO AND SECURITY REVIEW. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. This does **not** select an identity, email, or CDN product.
15. **What cross-border transfer safeguards are required?** Cross-border transfers must have an applicable legal basis/transfer mechanism and appropriate safeguards, including data minimisation, purpose limitation, appropriate contractual provisions, security controls, encryption, access controls, processor/subprocessor due diligence, documented transfer destinations, retention/deletion controls and incident-management provisions. Where required by applicable law, regulatory approval/permit must be obtained before transfer. Status: LEGAL/DPO REQUIREMENT. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION** (no transfer permit is invented or recorded as obtained).

---

## Section 9 — Decision gaps

> This section records open gaps. Questionnaire **Part 8 (Cost / Finance)** and **Part 9 (Exit / Portability)** have **no separate numbered sections** in this pack; their draft positions are mapped below so they are not lost and so Section 10 sign-off is not renumbered or fabricated.

| Gap | Required stakeholder | Evidence required | Status | Blocking ADR-0006? |
| --- | --- | --- | --- | --- |
| Formal Production / backup / DR / warm-standby jurisdiction and facility/provider approval | Legal/DPO; Owner | Legal/DPO residency and transfer assessment; Owner attestation; hosting-governance decision (ADR-0006 / DP-0006) | OPEN — REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION. No jurisdiction selected. | Yes |
| Finance/Owner implementation budget, recurring opex ceiling, 3-year TCO ceiling, and whether a hard monthly/annual hosting maximum exists | Finance; Owner | Comparable hosting options and estimates; 3-year TCO covering compute, database, storage, backup, DR, networking, CDN/WAF, monitoring, logging, security, identity, support, licensing, implementation, migration, testing, professional services, expected growth, exit/migration costs | OPEN — REQUIRES HUMAN FINANCE/OWNER DECISION. No monetary values invented. | Yes |
| Kenya / EU / other-jurisdiction permission for Production, backup, DR, remote support, logging, and SaaS subprocessors | Legal/DPO; Security; IT | Transfer assessment; subprocessor/data-flow map; contractual terms | OPEN — REQUIRES LEGAL/DPO CONFIRMATION | Yes |
| Restricted / Highly Restricted classification-to-geography rules and any Highly Restricted exception | Legal/DPO; Owner; Security | Approved data-classification schedule; Legal/DPO exception record if any | OPEN — REQUIRES DATA-CLASSIFICATION AND LEGAL/DPO VALIDATION | Yes |
| Provider exit assistance duration/commercial limits and termination notice period | Owner; Legal; Finance | Negotiated contract terms | OPEN — REQUIRES OWNER/LEGAL/FINANCE CONTRACTUAL DECISION | Yes |
| Decision-packet alternatives (recommended + lower-cost viable + higher-control/resilience) with comparable 3-year TCO | Owner; Finance; IT | Option sketches; TCO; trade-offs. Does **not** select Option A/B/C/D. | OPEN — recommended governance requirement; packet not yet produced | Yes |
| RTO/RPO/BIA values across Owner O1/O3, Business/BCM Section 5, and Recovery Posture Section 7 | Owner; Business/BCM | Accountable stakeholder reconciliation of disruption, RTO, RPO and data-loss values. Do **not** auto-reconcile. | OPEN — **RTO/RPO/BIA RECONCILIATION REQUIRED — OWNER INPUT AND BUSINESS/BCM INPUT CONTAIN MATERIAL DIFFERENCES.** No technical RTO/RPO frozen. | Yes |

### Draft Cost / Finance position (questionnaire Part 8)

> **DRAFT COST / FINANCE POSITION — FINANCE/OWNER INPUT REQUIRED FOR MONETARY THRESHOLDS**
>
> No budget, TCO figure, or hosting-cost ceiling is invented. These are proposed governance positions, **not** an approved budget and **not** a hosting selection.

1. **What is the acceptable initial implementation budget?** Not yet specified. Finance/Owner should establish an approved budget range after receiving comparable hosting options and implementation estimates. The decision should not be based on the cheapest option alone. Status: REQUIRES HUMAN FINANCE/OWNER DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
2. **What recurring annual operating budget is acceptable?** Not yet specified. Finance/Owner should establish an annual operating-cost ceiling or preferred range after receiving comparable Production hosting, backup, DR, security, support and licensing estimates. Status: REQUIRES HUMAN FINANCE/OWNER DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
3. **What is the acceptable 3-year TCO?** Not yet established. A comparable three-year TCO must be prepared for each viable hosting option before the final hosting decision. The TCO comparison must include, where applicable: compute; database; storage; backup; DR; networking; CDN/WAF; monitoring; logging; security; identity; support; licensing; implementation; migration; testing; professional services; expected growth; exit/migration costs. Status: REQUIRES HUMAN FINANCE/OWNER TCO CEILING. TCO ANALYSIS TO BE PERFORMED BEFORE FINAL HOSTING DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
4. **Is there a maximum monthly/annual hosting cost?** Not yet specified. Finance/Owner should establish whether a hard maximum exists or whether the decision should instead use an approved budget range. Status: REQUIRES HUMAN FINANCE/OWNER DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
5. **How should cost be weighted against resilience/control?** Cost should be evaluated alongside resilience, compliance, security, recoverability, operational capability and vendor risk. Lowest cost should not be the overriding criterion where it materially increases business continuity, regulatory or security risk. Status: RECOMMENDED DECISION PRINCIPLE.
6. **Is a higher-cost option acceptable if it materially improves compliance/resilience?** Yes, where the additional cost provides a material and demonstrable improvement in legal/regulatory compliance, security, recoverability, availability or business continuity, provided the cost remains commercially sustainable and is approved by Owner/Finance. Status: RECOMMENDED OWNER/FINANCE POSITION — REQUIRES ATTESTATION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**.
7. **Is a lower-cost alternative mandatory in the final decision packet?** Yes. The final hosting decision packet should include at least: (1) the recommended option, (2) a lower-cost viable alternative, and (3) a higher-control/resilience alternative where materially relevant, with comparable three-year TCO and key trade-offs. Status: RECOMMENDED GOVERNANCE REQUIREMENT. This does **not** select those options or approve a packet.

### Draft Exit / Portability position (questionnaire Part 9)

> **DRAFT EXIT / PORTABILITY POSITION — OWNER/IT/LEGAL REVIEW AND ATTESTATION REQUIRED**
>
> These are proposed portability/exit positions, **not** a selected provider, **not** negotiated contract terms, and **not** an implemented migration capability.

1. **How important is avoiding vendor lock-in?** High. Vendor lock-in should be minimised because the system contains business-critical data and must remain capable of changing providers for commercial, regulatory, resilience or operational reasons.
2. **Must the system be capable of moving to another provider?** Yes. The system should be architected so that it can be migrated to another suitable provider or infrastructure environment without requiring a fundamental application rewrite.
3. **Must PostgreSQL data be exportable?** Yes. Production PostgreSQL data must be exportable in standard, documented formats and restorable to another supported PostgreSQL environment.
4. **Must files/object storage be exportable?** Yes. Business files and objects must be exportable in their original usable form together with sufficient metadata to reconstruct the relevant application relationships.
5. **Must configuration be exportable?** Yes. Material application and infrastructure configuration should be version-controlled and exportable. Secrets must not be exported in plaintext; secret references and documented re-provisioning procedures must be portable.
6. **Must the system be restorable outside the incumbent provider?** Yes. The system should be capable of restoration in an alternative supported environment using portable application artefacts, database backups, configuration and infrastructure definitions. This capability should be periodically tested. Periodic tests are **not** claimed to have occurred.
7. **How much migration assistance should be contractually required?** The provider should be contractually required to provide reasonable and documented exit assistance, including data export, technical documentation, cooperation with migration, transition support and secure handover. The required duration and commercial limits should be negotiated in the provider contract. Status: REQUIRES OWNER/LEGAL/FINANCE CONTRACTUAL DECISION ON EXACT COMMERCIAL TERMS. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. Exact duration/fees are **not** invented.
8. **What data deletion/return obligations are required at termination?** At termination, the provider must return/export SEDMC data in an agreed usable format and securely delete remaining SEDMC data and copies within the contractually and legally required period, subject to documented legal retention obligations. The provider should provide appropriate deletion/return confirmation or evidence. Backup copies and replicas must be covered by the termination/deletion provisions.
9. **What termination notice is acceptable?** A commercially reasonable notice period that provides sufficient time for an orderly migration and tested transition. The exact notice period should be established during contract negotiation based on system criticality and provider dependencies. Status: REQUIRES OWNER/LEGAL/FINANCE CONTRACTUAL DECISION. **REQUIRES HUMAN STAKEHOLDER DECISION / ATTESTATION**. Exact days/months are **not** invented.
10. **What level of proprietary technology is acceptable?** Low. Proprietary technology may be used where it provides material business value, but core business data, application logic, deployment configuration and recovery capability should not depend unnecessarily on proprietary technology that prevents migration. Open standards and widely supported technologies should be preferred for core components. This does **not** select a proprietary or open-source product.

---

## Section 10 — Stakeholder sign-off

> No named approvals, signatures, or attestations are recorded below. Newly documented Part 1 Owner inputs and Part 2 draft Legal/DPO positions are **not** covered by any Part 10 sign-off. Existence of this section must **not** be used to conceal unresolved RTO/RPO/BIA contradictions, unanswered Owner O4–O13 items, or the absence of Legal/DPO attestation. If a later Part 10 approval is given, the accountable stakeholders must confirm they reviewed the **exact final content** of Parts 1–3.

### Owner

- Name:
- Decision:
- Date:
- Status:

### Legal/DPO

- Name:
- Decision:
- Date:
- Status:

### IT

- Name:
- Decision:
- Date:
- Status:

### Business/BCM

- Name:
- Decision:
- Date:
- Status:

---

## Section 11 — Governance state

Recorded as current programme state. **Filling this worksheet does not change these values.**

| Item | Value |
| --- | --- |
| ADR-0006 | OPEN |
| DP-0006 | NOT APPROVED |
| ADR-0012 | OPEN |
| ADR-0013 | OPEN |
| ADR-0011 Production backup | TBD |
| Production | NOT AUTHORIZED |
| Deployment | NOT AUTHORIZED |
| Migrations | NOT AUTHORIZED |
| SQL 123 | ABSENT |
| Database | UNCHANGED |
| Path B general auto-selection | PAUSED |
