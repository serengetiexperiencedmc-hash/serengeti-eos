# E1-C01 Counsel-Style Review of Production Legal Conditions L-01 through L-17

> **`COUNSEL-STYLE REVIEW COMPLETE — HUMAN/DPO/LEGAL ATTESTATION STILL REQUIRED`**  
> **`E1-C01: INCOMPLETE`**  
> **`E1 OVERALL: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`L-01 THROUGH L-17: OPEN / NOT COMPLETE`**  
> **`PRODUCTION HOSTING / INFRASTRUCTURE / DATABASE / MIGRATIONS / UAT / DEPLOYMENT: NOT AUTHORIZED`**

This file is a **companion analysis**. It does **not** replace [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md). It does **not** populate attestor identity, qualification, determination, date, or signature.

---

## A. Status

**`COUNSEL-STYLE REVIEW COMPLETE — HUMAN/DPO/LEGAL ATTESTATION STILL REQUIRED`**

Allowed assessment labels used below (not Production clearance):

- `FRAMEWORK-SOUND`
- `FRAMEWORK-SOUND WITH CONDITIONS`
- `REQUIRES FACTUAL VALIDATION`
- `REQUIRES EXTERNAL LEGAL/DPO EVIDENCE`
- `REQUIRES REVISION` (formulation only, if stated)

Not used: `APPROVED` · `COMPLIANT` · `LEGALLY CLEARED` · `PRODUCTION APPROVED`.

---

## B. Scope

This is an **AI-generated counsel-style legal/governance review** of the previously documented **L-01–L-17 Production conditions**.

It is **not**:

- a signed legal opinion;
- a DPO attestation;
- regulatory approval, registration, permit, or contract;
- a substitute for qualified human Legal/DPO determination;
- Production, UAT, hosting, region, or provider authorization.

Authoritative inputs:

- [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md)
- [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md)
- [`adr-0006-e1-c01-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-human-legal-dpo-review-pack.md)
- [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)
- [`adr-0006-e1-evidence-closure-package.md`](adr-0006-e1-evidence-closure-package.md)
- Related: [`adr-0006-e1-production-hosting-residency-readiness-assessment.md`](adr-0006-e1-production-hosting-residency-readiness-assessment.md); ADR-0006 **proposed — blocked for Production**; DP-0006 **OPEN**; ADR-0011/0012/0013 **not Production-closed**.

Legal frameworks considered (applicability **not** automatic): Tanzania PDPA 2022 and 2023 Regulations; PDPC registration, DPO-process, and cross-border permit materials; Kenya DPA 2019 and 2021 General Regulations; GDPR Article 3 and Chapter V **if** engaged; UK GDPR territorial-scope and transfer rules **if** engaged.

Client, hotel, supplier, delegate, or programme location in a country does **not** by itself make that country’s privacy law applicable.

---

## C. Executive conclusion

The L-01–L-17 condition framework is **substantially sound as a Production-readiness control framework**.

Several conditions are **inherently dependent** on actual Production providers, jurisdictions, contracts, data flows, and processing facts. Those remain `REQUIRES FACTUAL VALIDATION` and/or `REQUIRES EXTERNAL LEGAL/DPO EVIDENCE`.

**Tanzania should remain the preferred legal/governance baseline** for Production, subject to final architecture and human legal validation. That is a **business/legal-risk preference**, not a finding that Tanzania is mandatory or already approved, and **not** a finding that all foreign hosting is automatically unlawful.

**Foreign services are not categorically prohibited**, but require fact-specific transfer/privacy assessment (hosting, PostgreSQL, object storage, backup, DR, support, IdP, email, monitoring, CDN/WAF, KMS/secrets, subprocessors).

**Production must not proceed** until the relevant evidence and human approvals are completed. This review does **not** claim Production legal clearance.

**Formulation corrections** (see §H) refine wording. They do **not** discard any L condition and do **not** complete E1-C01.

---

## D. L-01–L-17 review

Human/DPO/Legal determination status for **every** item: **`NOT COMPLETED`** (attestation fields remain blank).

Production-gate meaning: the condition is a **future Production-readiness gate**, not a present authorization.

---

### L-01 — Tanzania PDPC registration

| Field | Record |
| --- | --- |
| 1. L-ID | L-01 |
| 2. Existing condition | Confirm applicable PDPC registration before EOS processes Production personal data, **if** the PDPA registration duty applies. Evidence: PDPC registration record as controller and/or processor; scope of registered activities. |
| 3. Legal rationale | Current PDPC materials state that a person should not collect or process personal data without registration as a controller or processor. SEDMC’s company position treats Tanzania as the principal operating jurisdiction and does not intend to avoid Tanzanian requirements by foreign hosting. If the PDPA applies to Production processing, registration is a **Production prerequisite**, not a post-go-live optional. |
| 4. Applicable jurisdiction/framework | Tanzania PDPA 2022; 2023 Regulations; PDPC registration process. Other regimes do not substitute for Tanzanian registration **if** Tanzanian law applies. |
| 5. Evidence currently available | Company LA-02; counsel analysis §3.3 / C9 / L-01. **No** PDPC registration artefact. |
| 6. Evidence missing | Applicability determination; registration certificate/record; registered role (controller/processor); activity scope. |
| 7. Provider/fact dependency | Depends on whether Production processing is in PDPA scope; not on a named cloud vendor. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | Formulation: keep the “if PDPA applies” predicate. Do not state registration exists. Human must confirm current PDPC process vs SEDMC facts. |
| 10. Production-readiness implication | **Gate:** do not process Production personal data until registration status is determined and, if applicable, completed. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording (framework, not attestation):** “Before EOS processes Production personal data, confirm whether PDPC registration is legally required for SEDMC’s actual controller/processor activities. If required, obtain and retain evidence of registration covering those activities. Do not treat foreign hosting as a substitute. Registration is **not** recorded in this repository.”

---

### L-02 — DPO / privacy responsible person

| Field | Record |
| --- | --- |
| 1. L-ID | L-02 |
| 2. Existing condition | Designate/appoint a DPO or privacy-responsible function where legally required. Evidence: appointment/introduction; role; independence/reporting as attested. |
| 3. Legal rationale | Current PDPC registration process expects introduction of a DPO. PDPA also addresses DPO/accountability. GDPR/UK GDPR DPO duties are **separate triggers** (not automatic from having EU/UK clients). Kenya has its own accountability/registration overlay **if** that Act applies. One person may serve multiple roles only if each applicable law allows it. |
| 4. Applicable jurisdiction/framework | Tanzania PDPC/PDPA (primary candidate). GDPR Art. 37 / UK equivalent / Kenya DPA **only if** those regimes apply. |
| 5. Evidence currently available | Company/counsel statements that DPO validation is required. **No** appointment, name, or qualification in repository. |
| 6. Evidence missing | Human determination of which laws require a DPO vs another privacy lead; appointment/introduction evidence; contact details for notices. |
| 7. Provider/fact dependency | Low provider dependency; high legal-trigger dependency. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | **Do not** equate “PDPC registration DPO” with “GDPR mandatory DPO.” Do not invent an appointee. |
| 10. Production-readiness implication | **Gate:** privacy-responsible function in place as required by applicable law before Production personal-data processing. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Designate and document the privacy-responsible person(s) required under each **applicable** law. Treat current PDPC DPO-introduction practice as Tanzania-process evidence to verify, not as proof that a GDPR/UK GDPR DPO is required. No appointment is recorded in this repository.”

---

### L-03 — Processing inventory

| Field | Record |
| --- | --- |
| 1. L-ID | L-03 |
| 2. Existing condition | Maintained processing inventory / RoPA-equivalent covering EOS Production classes (what, why, whom, where, how long). |
| 3. Legal rationale | Accountability and transparency under Tanzanian (and, if applicable, Kenyan/EU/UK) frameworks require knowing processing activities. Inventory is also the factual base for L-04–L-07, L-10, L-11, L-14–L-16. |
| 4. Applicable jurisdiction/framework | Tanzania PDPA (if applies). Additional record-keeping if GDPR/UK GDPR/Kenya DPA apply. |
| 5. Evidence currently available | Company LA-01/LA-05/LA-12 lists of **intended** EOS uses and data classes. P1 RoPA preview is **not** a completed Production inventory. |
| 6. Evidence missing | Activity-level inventory distinguishing **personal data** from purely corporate/commercial information, covering at least: CRM contacts; RFPs; programme/delegate information; supplier contacts; hotel contacts; employee information; commercial documents; audit records; authentication information; support/admin access; logs and monitoring. |
| 7. Provider/fact dependency | Categories can be drafted from company position; locations/recipients wait on architecture (L-05/L-17). |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | Prior L-03 text was slightly generic. Specify candidate EOS classes **without** asserting they are already processed in Production (they are not). |
| 10. Production-readiness implication | **Gate:** Production inventory exists and is maintained; not a substitute for L-17. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Maintain a Production processing inventory identifying, for each activity: purpose, personal-data categories (distinct from purely corporate information), data subjects, recipients, locations, retention, and lawful basis **where the applicable law requires a basis**. Candidate EOS classes include CRM contacts, RFPs, programme/delegate information, supplier and hotel contacts, employee information, commercial documents, audit records, authentication information, support/admin access, and logs/monitoring. This inventory is **not** currently completed.”

---

### L-04 — Controller / Processor matrix

| Field | Record |
| --- | --- |
| 1. L-ID | L-04 |
| 2. Existing condition | Formal controller/processor/joint-controller analysis by activity, plus reviewed contracts. |
| 3. Legal rationale | Role is activity-specific. SEDMC is **likely** controller where it determines EOS business purposes (company LA-01). SEDMC may be **processor** for client-supplied delegate lists under documented instructions. **Joint-controller** is possible if purposes/means are jointly determined. Cloud/hosting/email/IdP/monitoring/backup providers are typically **processors/subprocessors** where they process on SEDMC’s behalf — not automatically, and not if they determine independent purposes. |
| 4. Applicable jurisdiction/framework | Controller/processor concepts in PDPA, Kenya DPA, GDPR/UK GDPR **as applicable**. |
| 5. Evidence currently available | Company LA-01 business rule; counsel LA-01 analysis. **No** completed matrix; **no** Production contracts. |
| 6. Evidence missing | Matrix by activity; client, hotel/supplier, and technology contracts. |
| 7. Provider/fact dependency | High — roles follow actual contracts and processing. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | None to the multi-role distinction. Preserve: do **not** assume one role for every EOS activity. |
| 10. Production-readiness implication | **Gate:** matrix complete for material Production activities before go-live. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-05 — Data-flow map

| Field | Record |
| --- | --- |
| 1. L-ID | L-05 |
| 2. Existing condition | System Data-Flow & Processing Register for application, PostgreSQL, backups, DR, object/document storage, email, IdP, secrets/KMS, CDN, WAF, monitoring, logging, support, subprocessors. |
| 3. Legal rationale | Placement, transfer, and subprocessor analysis cannot be completed from “Tanzania-centered preference” alone. A Tanzania application does **not** make downstream services Tanzania-only (Principle 3). |
| 4. Applicable jurisdiction/framework | All potentially applicable regimes; map is factual, then law is applied per flow. |
| 5. Evidence currently available | Intended SoR = PostgreSQL; Dev Compose is **not** Production. ADR-0012/0013 OPEN. **No** Production providers/regions. |
| 6. Evidence missing | Actual components listed by the user: application; PostgreSQL; document storage; backups; DR; email; IdP; monitoring/logging; CDN/WAF; KMS/secrets; support access; external integrations; geographic locations; recipient organisations; subprocessors. |
| 7. Provider/fact dependency | **Blocking** until architecture candidates exist. Do **not** invent providers or regions. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | None to the condition. Cannot be closed pre-architecture. |
| 10. Production-readiness implication | **Gate:** map of the **actual** Production topology before L-06/L-07/L-17 can complete. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-06 — Transfer register

| Field | Record |
| --- | --- |
| 1. L-ID | L-06 |
| 2. Existing condition | Inventory of material extra-territorial flows (origin, destination, recipient, purpose, data, frequency). |
| 3. Legal rationale | Cross-border processing is a controlled legal requirement (company LA-10/LA-11). Paths may include foreign hosting, backup, DR, support, email, IdP, monitoring, CDN, WAF, subprocessors. |
| 4. Applicable jurisdiction/framework | Tanzania outbound rules **if** PDPA applies and data leaves Tanzania. Kenya ss.48–49 / 2021 Regulations **if** Kenya DPA applies. GDPR/UK GDPR Chapter V **if** those regimes apply. |
| 5. Evidence currently available | Company preference to minimize/document. **No** Production transfer register. |
| 6. Evidence missing | Per-transfer: source; destination; recipient; data category; data subjects; purpose; legal framework; transfer mechanism; safeguards; contract; retention; onward-transfer conditions. |
| 7. Provider/fact dependency | High — empty until L-05 exists. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | Expand prior field list as above. Do not invent destinations. |
| 10. Production-readiness implication | **Gate:** material Production paths registered before extra-territorial go-live. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** retain L-06 and require the expanded per-transfer fields. “No universal finding that transfers will occur, or are already lawful.”

---

### L-07 — Transfer mechanism

| Field | Record |
| --- | --- |
| 1. L-ID | L-07 |
| 2. Existing condition | Lawful tool per actual transfer; no universal assumption. PDPC permit/other tool as determined per path. Ordinary cloud contract not assumed sufficient. |
| 3. Legal rationale | There is **no** single mechanism for every jurisdiction. Tanzania: current PDPC permit/safeguard framework **if** PDPA applies and personal data is transferred outside Tanzania — human reviewer must confirm current statutory/regulatory exceptions. Kenya: safeguards/necessity/consent overlay **if** applicable, with heightened conditions for sensitive data transferred out of Kenya. GDPR/UK GDPR: adequacy, appropriate safeguards, or exceptions **if** those regimes apply. |
| 4. Applicable jurisdiction/framework | Determined **per path**, not globally. |
| 5. Evidence currently available | Counsel LA-11; PDPC/GN 449C citations. **No** permit, SCCs, adequacy finding, or IDTA on file. |
| 6. Evidence missing | Per-path mechanism after destinations exist; any PDPC Form 7/8 or other instrument the human determines is required. |
| 7. Provider/fact dependency | Destination, recipient, data, and applicable law. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | Do **not** prescribe PDPC permit as the only possible Tanzanian path, or SCCs as the EU path, without the actual transfer. Do **not** invent a universal mechanism. |
| 10. Production-readiness implication | **Gate:** no extra-territorial Production path without an identified mechanism **if** the applicable law requires one. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-08 — Subprocessor register

| Field | Record |
| --- | --- |
| 1. L-ID | L-08 |
| 2. Existing condition | Production subprocessor register before Production; geography, purpose, data, access, exit. |
| 3. Legal rationale | Material providers must be identifiable (company LA-15). Reputation of a cloud platform does **not** approve a specific offering (Principle 8). |
| 4. Applicable jurisdiction/framework | Processor/subprocessor duties under each applicable law; transfer overlay via L-06/L-07. |
| 5. Evidence currently available | Empty hosting-capability candidate slots. **NO `CANDIDATE — NOT SELECTED` offering.** No provider named. |
| 6. Evidence missing | Per provider: service; legal role; processing activity; data categories; geographic processing locations; their subprocessors; security; contract; deletion/return; breach obligations; international transfers; exit/portability. |
| 7. Provider/fact dependency | **Blocking** — cannot be populated without candidates. Do not name a provider. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | None to the condition. Expand assessment fields as above when candidates exist. |
| 10. Production-readiness implication | **Gate:** material Production subprocessors registered and assessed before authorization. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-09 — Contracts

| Field | Record |
| --- | --- |
| 1. L-ID | L-09 |
| 2. Existing condition | Processor/subprocessor contractual controls: instructions, security, breach, deletion, audit, transfers. |
| 3. Legal rationale | Where a provider processes personal data on SEDMC’s behalf, written processor terms are a standard legal control. Controller–controller and joint-controller terms may also be needed (L-04). Data-location commitments matter because “host wherever the provider places the workload” is insufficient (counsel architecture baseline). |
| 4. Applicable jurisdiction/framework | PDPA processor arrangements; Kenya DPA processor duties if applicable; GDPR/UK GDPR Art. 28-type terms **if** those regimes apply. |
| 5. Evidence currently available | Company requirement for contractual coverage. **No** executed Production DPAs. |
| 6. Evidence missing | DPAs / controller–processor terms; confidentiality; security; breach notification; subprocessor flow-down; international-transfer provisions; deletion/return; audit/access; data-location commitments — executed for material providers. |
| 7. Provider/fact dependency | High. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | Prior title was narrower (“processor/subprocessor”). Broaden to **appropriate contractual controls for the actual role**, including data-location where residency is a SEDMC requirement. Do not fabricate contracts. |
| 10. Production-readiness implication | **Gate:** material Production processing relationships covered by appropriate signed terms. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Execute appropriate contracts for each material Production relationship, including where relevant: DPA/controller–processor terms, confidentiality, security, breach notification, subprocessor controls, international-transfer provisions, deletion/return, audit/access rights, and data-location commitments. Ordinary marketing cloud terms are not assumed sufficient.”

---

### L-10 — Privacy notice

| Field | Record |
| --- | --- |
| 1. L-ID | L-10 |
| 2. Existing condition | Notices covering EOS purposes, recipients, transfers, rights — if personal data is processed. |
| 3. Legal rationale | Transparency is a core PDPA (and, if applicable, Kenya/GDPR/UK GDPR) obligation. Notices should be able to explain: who processes; purposes; categories; legal basis **where the applicable law requires it**; recipients; international transfers; retention; rights; complaints; security at an appropriate level; DPO/contact where required. |
| 4. Applicable jurisdiction/framework | Tanzania if PDPA applies; additional content if other regimes apply. Do not force a GDPR lawful-basis schema onto processing that is not in GDPR scope. |
| 5. Evidence currently available | **No** Production privacy notice. |
| 6. Evidence missing | Drafted and approved notices for relevant data-subject groups; publication/delivery method. |
| 7. Provider/fact dependency | Recipients/transfers wait on L-05/L-08. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | Qualify “legal basis” as **where applicable law requires it**. Do not create a fictional completed notice. |
| 10. Production-readiness implication | **Gate:** appropriate notice in place before Production personal-data collection/use. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-11 — Retention

| Field | Record |
| --- | --- |
| 1. L-ID | L-11 |
| 2. Existing condition | Documented retention/deletion policy plus technical capability. |
| 3. Legal rationale | Storage limitation is a standard data-protection principle. Retention must not be **indefinite by default**. Distinguish legal, contractual, operational, backup, and audit retention, and deletion/exit capability (company portability/exit preference). Backup copies can outlive operational records and must be scheduled. |
| 4. Applicable jurisdiction/framework | PDPA retention principles if applicable; other regimes if applicable; plus contract/tax/commercial record duties (not mapped here). |
| 5. Evidence currently available | Company requirement for defined backup retention. **No** Production retention schedule. |
| 6. Evidence missing | Schedule by class; backup/DR overlay; secure-deletion method; exception/legal-hold process. |
| 7. Provider/fact dependency | Backup product/location (ADR-0011 TBD) affects backup retention. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | Prior L-11 omitted explicit “not indefinite by default” and the five retention types. Add them. |
| 10. Production-readiness implication | **Gate:** documented schedule and deletion capability before Production personal-data retention. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Adopt a Production retention and deletion schedule distinguishing legal, contractual, operational, backup, and audit retention. Default must not be indefinite. Include tested deletion/exit for operational stores and documented backup overlay.”

---

### L-12 — Security controls

| Field | Record |
| --- | --- |
| 1. L-ID | L-12 |
| 2. Existing condition | Documented TOMs aligned to actual Production architecture (not Dev/Test only). |
| 3. Legal rationale | Security of processing is required under PDPA (if applicable) and other candidate regimes. Planned or Dev/Test controls are **not** Production implementation evidence. |
| 4. Applicable jurisdiction/framework | PDPA security duties if applicable; Kenya/GDPR/UK GDPR security duties if applicable. |
| 5. Evidence currently available | Design-basis / Dev controls; API `productionReady: false`. **No** Production TOM pack for a selected topology. |
| 6. Evidence missing | Encryption; access control; least privilege; MFA; secrets management (ADR-0012 OPEN); logging; monitoring; backup protection; incident response linkage to L-13; vulnerability management; privileged-access controls; secure deletion — evidenced on the **actual** Production stack. |
| 7. Provider/fact dependency | High — TOMs follow selected hosting/IdP/KMS. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND** · **REQUIRES FACTUAL VALIDATION** |
| 9. Required remediation | None to the condition. Do not claim implementation because a control is listed. |
| 10. Production-readiness implication | **Gate:** Production TOMs documented and implemented for the chosen architecture. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-13 — Breach / incident response

| Field | Record |
| --- | --- |
| 1. L-ID | L-13 |
| 2. Existing condition | Written personal-data breach process: detect, assess, notify, contain; regulator/notification mapping as attested. |
| 3. Legal rationale | Breach duties exist under PDPA (if applicable) and under Kenya/GDPR/UK GDPR **if** those apply. Recipients, thresholds, and timelines **differ by law**. One process can be designed to branch; it cannot be assumed to satisfy all regimes until applicability is determined. |
| 4. Applicable jurisdiction/framework | Tanzania if PDPA applies; others if applicable. |
| 5. Evidence currently available | **No** Production-attested breach playbook; **no** evidence of operationally tested regulator notification. |
| 6. Evidence missing | Detection; classification; containment; investigation; evidence preservation; notification decision; regulatory notification where applicable; data-subject notification where applicable; client notification; post-incident review; tested roles. |
| 7. Provider/fact dependency | Provider incident-notice clauses (L-09) and monitoring (L-12/L-17). |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** (notification mapping) |
| 9. Required remediation | State that notification mapping is **law-specific**. Do not claim operational testing. |
| 10. Production-readiness implication | **Gate:** documented, role-assigned process before Production personal-data processing. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-14 — Sensitive / special-category data

| Field | Record |
| --- | --- |
| 1. L-ID | L-14 |
| 2. Existing condition | Heightened protection for Restricted+ / statutory sensitive data: minimisation, access, encryption, audit, residency. |
| 3. Legal rationale | SEDMC Restricted / Restricted+ is an **internal security classification** (company LA-12/LA-13; Principle 5). It is **not** automatically statutory sensitive/special-category data. Commercially confidential rates, RFP budgets, commissions, and costing are not legally sensitive personal data **unless** they contain personal data meeting statutory criteria. Where Restricted+ **contains** identity/passport, health/accessibility, biometric, financial/payment, credentials, or other legally sensitive data, **those legal requirements must be assessed separately** (Principle 6). |
| 4. Applicable jurisdiction/framework | PDPA sensitive-personal-data rules if applicable; Kenya sensitive-data and extra-Kenya transfer rules if applicable; GDPR Art. 9 / UK equivalent if applicable. |
| 5. Evidence currently available | Company classification lists. **No** Production census of what is actually stored. |
| 6. Evidence missing | Actual processing of each sensitive class; legal characterisation; extra controls; residency/failover (LA-14). |
| 7. Provider/fact dependency | Whether EOS will store passports, health, biometrics, payment instruments, etc. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | Split the prior bundled phrase “Restricted+ / statutory sensitive data” into (a) internal IS controls and (b) statutory assessment. |
| 10. Production-readiness implication | **Gate:** no Production processing of a statutory sensitive class without the corresponding legal basis/controls; Restricted+ failover still only to pre-assessed locations (LA-14). |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Apply SEDMC Restricted+ technical controls as internal security policy. Separately determine whether any EOS category is statutory sensitive/special-category personal data under applicable law, and apply those legal requirements. Do not treat every commercially confidential item as legally sensitive personal data.”

---

### L-15 — DPIA / privacy risk assessment

| Field | Record |
| --- | --- |
| 1. L-ID | L-15 |
| 2. Existing condition | DPIA or equivalent where legally required; P2 register is **not** a completed Production DPIA. |
| 3. Legal rationale | A CRM/commercial platform does **not** automatically require a GDPR-style DPIA. Assess actual processing: sensitive data; large-scale processing; monitoring; systematic processing; vulnerable individuals (e.g. some delegates); international transfers; new technologies; high-risk combinations. Tanzania/Kenya may require privacy-risk assessment in different form than GDPR Art. 35. |
| 4. Applicable jurisdiction/framework | Law-specific. GDPR DPIA only if GDPR applies **and** Art. 35 threshold met. |
| 5. Evidence currently available | P2 DPIA **register** preview/governance. **Not** a completed Production DPIA. |
| 6. Evidence missing | Screening against actual EOS processing; full DPIA/equivalent if required. |
| 7. Provider/fact dependency | Processing profile and topology (L-03, L-05, L-14). |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | Keep “where required.” Do not state a DPIA has been completed. Do not treat “EOS is a CRM” as the trigger. |
| 10. Production-readiness implication | **Gate:** screening done; DPIA/equivalent completed **if** the applicable law requires it, **before** the high-risk processing starts. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### L-16 — International source-market assessment

| Field | Record |
| --- | --- |
| 1. L-ID | L-16 |
| 2. Existing condition | Written applicability assessments for GDPR/UK GDPR/Kenya/other regimes with connecting factors; **REQUIRED** before treating any extra-TZ regime as inapplicable. |
| 3. Legal rationale | SEDMC target markets include South Africa, Europe, Middle East, Canada, USA, Latin America (company LA-05). **Not every listed country imposes a direct obligation on EOS.** Correct approach: fact-specific screening (establishment, offering, monitoring, data-subject location, contractual role, transfers). Tanzania is the preferred baseline; Kenya, GDPR, and UK GDPR are the currently analysed candidate extra frameworks. Other markets need **screening**, not assumed application or assumed inapplicability without any facts. |
| 4. Applicable jurisdiction/framework | Tanzania (conditional); Kenya / GDPR / UK GDPR (potential); others **unassessed**. |
| 5. Evidence currently available | Company market list; counsel LA-03/LA-04/LA-05. No market-by-market legal memo. |
| 6. Evidence missing | Connecting-factor assessments; at least a screening record for listed markets; deeper analysis where screening indicates possible application. |
| 7. Provider/fact dependency | Data-subject map (LA-05); offering/monitoring facts; architecture transfers. |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND WITH CONDITIONS** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | Prior “REQUIRED before treating any extra-TZ regime as inapplicable” **overstates** the depth required for every country on the marketing list. Replace with screening-then-deep-dive. |
| 10. Production-readiness implication | **Gate:** documented screening of material source markets; no silent assumption that EU/UK/Kenya (or others) are in or out. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

**Corrected wording:** “Perform a fact-specific applicability screening of material source markets (including Tanzania, Kenya, EU/EEA, United Kingdom, South Africa, Middle East, Canada, United States, Latin America). Do not assume a market imposes EOS obligations merely because SEDMC sells there. Where screening indicates possible application, complete a written assessment of connecting factors and resulting duties. Do not treat GDPR, UK GDPR, or Kenya DPA as inapplicable solely because the client is a company rather than an individual.”

---

### L-17 — Production architecture legal/privacy review

| Field | Record |
| --- | --- |
| 1. L-ID | L-17 |
| 2. Existing condition | Qualified Legal/DPO review of the **actual** selected topology (hosting, backup, DR, support, satellite services) before Production authorization. |
| 3. Legal rationale | Framework conditions L-01–L-16 cannot be finally applied until hosting jurisdiction, PostgreSQL location, object/document storage, backup, DR, IdP, email, monitoring, logging, CDN/WAF, KMS/secrets, support access, subprocessors, data flows, and transfer mechanisms **exist**. No provider or geography is selected. The condition **must remain open**. Completing L-01–L-16 checklists on hypothetical architecture is not L-17. |
| 4. Applicable jurisdiction/framework | Those determined under L-01–L-16 applied to the real topology. |
| 5. Evidence currently available | Preference for Tanzania-centered PostgreSQL SoR. ADR-0006 blocked; DP-0006 OPEN; no candidate offering. |
| 6. Evidence missing | The actual Production architecture listed in the condition. |
| 7. Provider/fact dependency | **Blocking.** |
| 8. Counsel-style assessment | **FRAMEWORK-SOUND** · **REQUIRES FACTUAL VALIDATION** · **REQUIRES EXTERNAL LEGAL/DPO EVIDENCE** |
| 9. Required remediation | None. Do not close L-17 on this review. |
| 10. Production-readiness implication | **Hard gate** before Production authorization. This review does **not** satisfy L-17. |
| 11. Human/DPO/Legal determination status | **NOT COMPLETED** |

---

### D-summary table

| L | Existing condition (short) | Counsel assessment | Legal rationale (short) | Required evidence | Production gate | Status |
| --- | --- | --- | --- | --- | --- | --- |
| L-01 | PDPC registration if PDPA applies | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | Current PDPC: do not process without registration | Registration record / not-required determination | Before Production personal-data processing | **OPEN / NOT COMPLETE** |
| L-02 | DPO / privacy lead where required | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | PDPC process ≠ automatic GDPR DPO | Appointment evidence per applicable law | Before Production personal-data processing | **OPEN / NOT COMPLETE** |
| L-03 | Processing inventory | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION | Accountability; fact-base for other L items | Inventory distinguishing personal vs corporate data | Before go-live of those activities | **OPEN / NOT COMPLETE** |
| L-04 | Controller/processor matrix | FRAMEWORK-SOUND · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | Role is activity-specific | Matrix + contracts | Before go-live of material activities | **OPEN / NOT COMPLETE** |
| L-05 | Data-flow map | FRAMEWORK-SOUND · REQUIRES FACTUAL VALIDATION | TZ app ≠ TZ-only processing | Actual component/geography map | Before L-06/L-07/L-17 complete | **OPEN / NOT COMPLETE** |
| L-06 | Transfer register | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION | Extra-territorial copies are processing | Per-path register | Before extra-territorial Production paths | **OPEN / NOT COMPLETE** |
| L-07 | Transfer mechanism per path | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | No universal tool | Per-path mechanism/permit if required | Same as L-06 | **OPEN / NOT COMPLETE** |
| L-08 | Subprocessor register | FRAMEWORK-SOUND · REQUIRES FACTUAL VALIDATION | Assess providers individually | Register; no provider named | Before Production authorization | **OPEN / NOT COMPLETE** |
| L-09 | Contractual controls | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION | Role-appropriate written terms | Executed DPAs/location terms | Before provider processes Production data | **OPEN / NOT COMPLETE** |
| L-10 | Privacy notice | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION | Transparency | Notices for relevant subjects | Before Production collection/use | **OPEN / NOT COMPLETE** |
| L-11 | Retention/deletion | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION | Not indefinite by default | Schedule + deletion capability | Before Production retention of personal data | **OPEN / NOT COMPLETE** |
| L-12 | Production TOMs | FRAMEWORK-SOUND · REQUIRES FACTUAL VALIDATION | Planned ≠ implemented | Architecture-specific TOMs | Before Production processing | **OPEN / NOT COMPLETE** |
| L-13 | Breach process | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | Law-specific notification | Playbook + roles | Before Production personal-data processing | **OPEN / NOT COMPLETE** |
| L-14 | Sensitive-data controls | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | Internal class ≠ statutory class | Census + legal mapping | Before processing those categories | **OPEN / NOT COMPLETE** |
| L-15 | DPIA/equivalent where required | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | CRM ≠ automatic DPIA | Screening; DPIA if required | Before high-risk processing | **OPEN / NOT COMPLETE** |
| L-16 | Source-market screening | FRAMEWORK-SOUND WITH CONDITIONS · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | Markets ≠ automatic law | Screening then deep-dive | Before treating extra-TZ law as settled | **OPEN / NOT COMPLETE** |
| L-17 | Review of **actual** architecture | FRAMEWORK-SOUND · REQUIRES FACTUAL VALIDATION · REQUIRES EXTERNAL LEGAL/DPO EVIDENCE | No topology selected | Selected topology + human review | Hard gate before Production authorization | **OPEN / NOT COMPLETE** |

**Coverage: L-01–L-17 = 17/17. None omitted. None marked COMPLETE. None APPROVED / COMPLIANT / LEGALLY CLEARED / PRODUCTION APPROVED.**

---

## E. Architecture implications

| Component | Legal implication (counsel-style) | Status |
| --- | --- | --- |
| Hosting | Tanzania-centered is **preferred**, not approved. Foreign hosting is **not automatically unlawful** but is a transfer/residency issue if personal data is stored/processed there (Principles 1–2). | **NOT SELECTED** |
| Database (PostgreSQL) | Intended durable SoR. Location is primary processing geography (LA-06). Must appear on L-05 map. | **Production location NOT SELECTED** |
| Object / document storage | May hold Restricted+ files (passports, contracts). Location can differ from the DB and is a separate transfer analysis. | **NOT SELECTED** |
| Backup | Personal-data copy; foreign backup can be a transfer (Principle 4). Identify geography, provider, encryption, access, retention, restore location (LA-07). Gate-B dumps are not Production. | **NOT SELECTED** |
| DR / replica / failover | Not legally invisible because incident-only. Restricted+ must not fail over to an unassessed jurisdiction (Principle 9; LA-14). Warm standby not mandatory (LA-09). | **NOT SELECTED / NOT APPROVED** |
| Support / admin access | Remote viewing can be processing/transfer (Principle 7; LA-16). No standing unrestricted vendor access. | **NOT SELECTED** |
| IdP | Independent geography (ADR-0013 OPEN). Identifiers and auth events. | **OPEN** |
| Email | Addresses and message content/metadata; commonly extra-territorial. | **NOT SELECTED** |
| Monitoring / logging | Identifiers in logs are personal data if they identify a person; destinations often extra-territorial. | **NOT SELECTED** |
| CDN / WAF | IPs, URLs, possibly payloads; edge locations worldwide possible. | **NOT SELECTED** |
| KMS / secrets | Key/secret location is a placement issue (ADR-0012 OPEN). | **OPEN** |
| Subprocessors | Assess each offering (Principle 8). No candidate named. | **NONE RECORDED** |

“Host wherever the cloud provider places the workload” remains **insufficient**.

---

## F. Legal evidence still outstanding

Material evidence still required (none of the following is recorded as obtained):

- Human Legal/DPO determinations for LA-01–LA-17 (attestation package)
- Legal-entity / establishment evidence
- PDPC registration (or attested determination that it is not required)
- DPO / privacy-lead appointment under applicable law
- Production processing inventory and data-subject map
- Controller/processor matrix and actual contracts/DPAs
- Production data-flow map (all components in §E)
- Transfer register and per-path mechanisms (including any PDPC permit if required)
- Subprocessor register for real `CANDIDATE — NOT SELECTED` offerings
- Privacy notice(s); retention/deletion schedule; Production TOMs; breach playbook
- Statutory mapping of Restricted+ vs sensitive/special-category data
- DPIA screening / DPIA-equivalent if required
- Source-market applicability screening
- Final human review of the **actual** Production architecture (L-17)

No hosting provider, region, backup provider, DR provider, IdP, email, CDN/WAF, or KMS product is selected.

---

## G. Human/DPO/Legal attestation boundary

A qualified **human** Legal Counsel, DPO, privacy professional, or other authorized reviewer must:

- make the **final** legal determinations;
- complete [`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md);
- supply identity, role/qualification, scope, determination, supporting authority/evidence, date, and signature.

The reviewer may **accept, amend, reject, or replace** this counsel-style review.

This document does **not** complete E1-C01. Formal attestation §7 stale `UNKNOWN` cells were **not** modified.

**E1-C01 = INCOMPLETE**  
**E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE**  
**PRODUCTION = NOT AUTHORIZED**

---

## H. Corrections to prior L-01–L-17 formulation

These are **wording/qualification corrections**. They do not silently rewrite human determinations (none exist).

| Item | Issue | Proposed correction |
| --- | --- | --- |
| L-02 | Risk of equating PDPC registration DPO with GDPR mandatory DPO | Separate law-specific triggers; do not invent an appointee |
| L-03 | Generic “EOS Production classes” | List candidate classes; distinguish personal vs purely corporate data |
| L-06 | Incomplete per-transfer field list | Expand to source/destination/recipient/category/subjects/purpose/framework/mechanism/safeguards/contract/retention/onward transfer |
| L-07 | Risk of treating PDPC permit as the only Tanzanian path | Mechanism is per-path; permit is to be confirmed if PDPA outbound rules apply |
| L-09 | Title limited to processor terms | Role-appropriate contracts including data-location commitments |
| L-10 | Implied GDPR-style “legal basis” for all processing | Legal basis **where applicable law requires it** |
| L-11 | No explicit ban on indefinite default; retention types not split | Not indefinite by default; legal/contractual/operational/backup/audit |
| L-13 | Single notification mapping | Law-specific branching; not operationally tested |
| L-14 | Bundled Restricted+ with statutory sensitive data | Split internal IS class vs statutory assessment |
| L-16 | “Required before treating any extra-TZ regime as inapplicable” overstated depth for every marketing country | Screening then deep-dive; markets ≠ automatic obligations |
| C1 phrasing (prior analysis) | “Principal legal/operational framework” can be read as attested PDPA applicability | Remain: Tanzania is **preferred baseline**; PDPA applicability is **conditional** pending human determination |

No L item is discarded. No L item is `REQUIRES REVISION` as to **whether the condition should exist**. Several are `FRAMEWORK-SOUND WITH CONDITIONS` for the reasons above.

---

## I. Principles 1–10

| Principle | Counsel finding |
| --- | --- |
| 1 Tanzania-centered preferred; foreign hosting not automatically unlawful | **Sound** — aligns with company LA-06 and C1–C2 |
| 2 Foreign hosting/backup/DR/support/email/IdP/monitoring/CDN/WAF may create transfer issues | **Sound** — LA-10, LA-17, L-05–L-07 |
| 3 Tanzania location of one service ≠ Tanzania-only downstream | **Sound** — LA-17 |
| 4 Backups and DR with personal data are in the privacy/transfer analysis | **Sound** — LA-07/LA-08, L-05/L-06 |
| 5 Restricted+ is internal, not automatically statutory sensitive | **Sound** — LA-12, L-14 |
| 6 If Restricted+ contains legally sensitive data, assess those legal requirements separately | **Sound** — L-14 |
| 7 Foreign admin/support access is part of data-flow/transfer analysis | **Sound** — LA-16 |
| 8 Assess Production providers individually; reputation is not approval | **Sound** — LA-15, L-08 |
| 9 Restricted+ failover location must be legally assessed in advance | **Sound** — LA-14, Principle 9 |
| 10 Applicability from actual facts and law, not merely client/hotel/programme country | **Sound** — LA-03/LA-04/LA-05, L-16 |

---

## J. Authorization boundary

- E1-C01: **INCOMPLETE**
- E1: **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**
- L-01–L-17: **OPEN / NOT COMPLETE**
- Production hosting / infrastructure / database / migrations / UAT / deployment: **NOT AUTHORIZED**
- Provider / region: **NOT SELECTED**
- Formal attestation fields: **not populated by this file**

**Database contacted: NO**  
**Application / schema / infrastructure files changed: NONE**  
**Git commit / push / PR / merge: NO**

**STOP.**
