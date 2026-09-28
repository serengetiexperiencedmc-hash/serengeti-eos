# E-12 / E-13 / E-15 / E-16 / E-17 / E-18 — Evidence Completeness, Consistency, and Authority Audit

> **`READ-ONLY GOVERNANCE AUDIT`**  
> **`THIS IS NOT LEGAL OPINION, DPO ATTESTATION, PDPC REGISTRATION, APPROVED PRIVACY NOTICE, COMPLETED DPIA, OR PRODUCTION AUTHORIZATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`DPO DETERMINATION: NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO: NOT COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`** · **`UAT = NOT AUTHORIZED`**  
> **`Migration = NOT AUTHORIZED`** · **`Deployment = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE: UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**  
> **`THOMAS NGULUMA — LEGAL COUNSEL ONLY`**

**Audit date (repository calendar):** 2026-09-16.  
**Scope:** completeness, consistency, and evidence-authority of:

- [`adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md)
- [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md)
- [`adr-0006-e1-c01-e15-personal-data-incident-response.md`](adr-0006-e1-c01-e15-personal-data-incident-response.md)
- [`adr-0006-e1-c01-e16-data-classification-legal-mapping.md`](adr-0006-e1-c01-e16-data-classification-legal-mapping.md)
- E-17 material (no dedicated Phase 1 screening artefact; P2 DPIA **register** only)
- [`adr-0006-e1-c01-e18-source-market-applicability-screening.md`](adr-0006-e1-c01-e18-source-market-applicability-screening.md)

**Compared against:** E-04 / E-05 / E-06; adopted Legal Counsel LA-01–LA-17 and L-01–L-17; company business position; current evidence register; collection queue; consolidated Human Legal/DPO review pack; proposed counsel determinations; P2 DPIA register (`docs/governance/p2-dpia-register-authorized.md`, `docs/architecture/p2-dpia-register-preview.md`, `packages/db/migrations/104_p2_privacy_dpias.sql`, `packages/kernel/src/privacy-dpias.ts`).

**This audit does not:** rewrite those evidence documents; alter Legal Counsel attestation; alter LA/L determinations; change E-01–E-06 status; invent retention periods, notification clocks, DPO identity, PDPC status, GDPR/UK GDPR/Kenya applicability, or a Production DPIA; select architecture.

---

## Authority vocabulary used in this audit

| Label | Meaning |
| --- | --- |
| **FACT** | Directly evidenced by repository material. |
| **COMPANY-PROVIDED FACT** | Company-supplied factual string (e.g. legal-name string for E-01). Not verification. |
| **COMPANY POSITION** | SEDMC business/planning statement. |
| **DESIGN INTENT** | Architecture or control intended but not Production-selected or Production-implemented. |
| **APPLICATION / SCHEMA EVIDENCE** | Modelled capability. Not Production processing census. |
| **LEGAL COUNSEL ANALYSIS** | Adopted Legal Counsel legal/control position (Thomas Nguluma). Not regulator approval. |
| **PUBLIC REGULATORY GUIDANCE** | Official public pages. Not SEDMC-specific compliance. |
| **HUMAN LEGAL/DPO DETERMINATION** | Remaining qualified-human characterisation. DPO **NOT ESTABLISHED**. |
| **EXTERNAL EVIDENCE REQUIRED** | Artefact from registry, regulator, counterparty, or vendor is absent. |
| **ARCHITECTURE-DEPENDENT** | Cannot be completed until actual Production topology/providers exist. |

Do not convert one category into another.

A privacy-notice draft is not an approved notice. A proposed retention class is not a legally established period. An incident-response document is not an implemented/tested process. Internal classification is not statutory sensitive-data classification. A DPIA register is not a completed DPIA. A source-market list is not proof that a jurisdiction’s law applies.

---

## A. Executive conclusion

**NO MATERIAL CONTRADICTION FOUND.**

The six items remain consistent with the adopted Legal Counsel position and with E-04 / E-05 / E-06. They do not:

- identify a DPO or claim PDPC registration;
- invent lawful bases, retention periods, provider names, or statutory notification deadlines;
- equate Restricted+ with legally sensitive personal data;
- present a completed Production DPIA;
- convert target markets into automatic applicability;
- claim Tanzania hosting has been selected;
- claim a cross-border transfer path that does not exist.

None of E-12, E-13, E-15, E-16, E-17, or E-18 is VERIFIED. None closes E1.

| Item | Classification (multiple, as applicable) | Closes the item? |
| --- | --- | --- |
| **E-12** | **PREPARATORY — SUBSTANTIALLY COMPLETE** as a skeleton that refuses to invent unresolved fields; **PREPARATORY — MATERIAL GAPS** versus a publishable notice; **REQUIRES HUMAN LEGAL/DPO DETERMINATION**; **REQUIRES EXTERNAL EVIDENCE** (entity; PDPC/DPO if required); **ARCHITECTURE-DEPENDENT** (recipients, transfers, providers) | **No** |
| **E-13** | **PREPARATORY — SUBSTANTIALLY COMPLETE** as a class matrix with all periods TBD; **REQUIRES HUMAN LEGAL/DPO DETERMINATION** (and Finance/contracts); **REQUIRES EXTERNAL EVIDENCE** (contractual/statutory periods once applicable law is known); **ARCHITECTURE-DEPENDENT** (backup/IdP/log TTL) | **No** |
| **E-15** | **PREPARATORY — SUBSTANTIALLY COMPLETE** as a documented-process draft; **NOT YET COMPLETED** as implemented/tested control; **REQUIRES HUMAN LEGAL/DPO DETERMINATION**; **REQUIRES EXTERNAL EVIDENCE** (contracts; DPO if required); **ARCHITECTURE-DEPENDENT** (monitoring, logging, vendor notice, backup/DR) | **No** |
| **E-16** | **PREPARATORY — SUBSTANTIALLY COMPLETE** for the internal ≠ statutory distinction; **REQUIRES HUMAN LEGAL/DPO DETERMINATION** for statutory columns; **ARCHITECTURE-DEPENDENT** / file-census residual for document bytes | **No** |
| **E-17** | **PREPARATORY — MATERIAL GAPS** (P2 is a register **capability**, not a screening methodology); **NOT YET COMPLETED** (no Production screening record; no completed DPIA); **REQUIRES HUMAN LEGAL/DPO DETERMINATION**; **ARCHITECTURE-DEPENDENT** for a full Production DPIA if triggered | **No** |
| **E-18** | **PREPARATORY — SUBSTANTIALLY COMPLETE** as a factual screening table; **REQUIRES HUMAN LEGAL/DPO DETERMINATION** on every row; **REQUIRES EXTERNAL EVIDENCE** (establishment extract; actual census/offering facts); **ARCHITECTURE-DEPENDENT** (transfers, monitoring) | **No** |

Preserved (unchanged by this audit):

| Item | Status |
| --- | --- |
| E-01 | **NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED** |
| E-02 | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |
| E-03 | **DPO APPOINTMENT NOT ESTABLISHED** |
| E-04 / E-05 / E-06 | **PREPARATORY — SUBSTANTIALLY COMPLETE / MATERIAL GAPS** (prior audit) |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |
| E1-C01 Legal Counsel component | **COMPLETE** |
| DPO component | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT / Production / Migration / Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |
| Tanzania | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** |
| L-05 / L-17 | **ARCHITECTURE-DEPENDENT** |

---

## B. E-12 findings

Audited artefact: [`adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md). Self-status **`DRAFT — NOT LEGALLY APPROVED`**. Does **not** close E-12. Consistent with L-10 (notice required before Production personal-data use; lawful basis only where applicable law requires it; do not fabricate a completed notice).

### Supported

| Topic | What the draft does | Evidence category |
| --- | --- | --- |
| Processing described | Lists only modelled EOS classes aligned with E-04 (orgs, contacts, users, RFP/programme/costing/approvals, suppliers/hotels, commercial files, audit, HR certification register, notifications). Explicitly excludes named delegates, passport/national ID, health/accessibility, payment-card, biometrics as structured processing. | **APPLICATION / SCHEMA EVIDENCE** via E-04; draft is **DESIGN INTENT** / preparatory text, not an approved notice |
| Document uploads / free text | Filenames and unstructured file bytes; contents unknown; free text might name people. | **FACT** relative to E-04 P-DOC / free-text residual |
| Purposes | Business description only. **Lawful basis: not stated.** | **COMPANY POSITION** / product design; **not** a legal basis |
| Recipients, providers, locations, transfers, retention, rights, DPO, registration, contacts | Explicitly **not stated**. | Correct restraint. **ARCHITECTURE-DEPENDENT** / **EXTERNAL EVIDENCE REQUIRED** / **HUMAN LEGAL/DPO DETERMINATION** |
| Tanzania hosting | Not implied. Processing geography **NOT SELECTED** (E-05 Layer D). | **ARCHITECTURE-DEPENDENT** |
| SEDMC identity | **Not stated.** Points to E-01 **MISSING**. Does not use branding or the company-provided name string as a verified legal identity. | **EXTERNAL EVIDENCE REQUIRED** (E-01 remains **NOT VERIFIED**). Company-provided **Makundi Serengeti Experience DMC** is **COMPANY-PROVIDED FACT**, not used here — correct. |
| Cookies / tracking | Not addressed. | See gap B-gap-1. |

### Gaps and dependencies

| ID | Gap | Category | Remaining action |
| --- | --- | --- | --- |
| B-gap-1 | No cookies/tracking section. No Production analytics/cookie evidence was found in this audit. Session authentication exists as modelled user accounts. | **PREPARATORY — MATERIAL GAPS** only if Production web tracking/cookies are later used; not invented here | Address if/when Production tracking exists. Do not invent a cookie notice. |
| B-gap-2 | Security measures not described (L-10 contemplates security “at an appropriate level”). Omission is restraint, not a TOM claim. | **ARCHITECTURE-DEPENDENT** (E-14 Production TOMs) | Do not invent TOMs in the notice. |
| B-gap-3 | Publishable notice still needs: verified identity (E-01); DPO/contact if required (E-03); PDPC/regulator statements if required (E-02); rights wording tied to applicable law (E-18); recipients/providers (architecture); retention numbers (E-13); roles (E-06). | **REQUIRES EXTERNAL EVIDENCE** · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **ARCHITECTURE-DEPENDENT** | Queue Q-C-07 after those facts exist. Do **not** publish this skeleton. |

**Status:** **PREPARATORY — SUBSTANTIALLY COMPLETE** (as a non-misleading skeleton) · **PREPARATORY — MATERIAL GAPS** (versus L-10 complete notice) · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **REQUIRES EXTERNAL EVIDENCE** · **ARCHITECTURE-DEPENDENT**. **NOT YET COMPLETED** as an approved notice.

---

## C. E-13 findings

Audited artefact: [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md). Self-status **`DRAFT`**. Periods: **`TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT`**. Does **not** close E-13. Does **not** implement deletion. Consistent with L-11.

### Supported

| Record class requested | Covered in E-13? | Authority |
| --- | --- | --- |
| Business / CRM / organisations | Yes | **APPLICATION / SCHEMA EVIDENCE** (class exists); period **not** legal |
| RFP / versions / proposals | Yes | Same |
| Programme records | Yes; future delegates would need a separate rule | Same + E-04 P-PRG-03 **FUTURE** |
| Costing / approvals | Yes | Same |
| Contracts / supplier / hotel | Yes | Same |
| Documents | Yes; `status=deleted` ≠ physical destruction | **FACT** (application flag) |
| Employee / user / authentication / sessions | Yes (credentials/sessions; HR certification register) | **APPLICATION / SCHEMA EVIDENCE**; Production IdP **NOT SELECTED** |
| Audit events | Yes; insert-only trigger noted; erasure vs immutability **PENDING** | **FACT** (schema); **HUMAN LEGAL/DPO DETERMINATION** for rights conflict |
| Security logs | Yes; Production log store **NOT SELECTED** | **ARCHITECTURE-DEPENDENT** |
| Backups | Yes; overlay **MISSING**; TTL unknown | **ARCHITECTURE-DEPENDENT** · **COMPANY POSITION** LA-07 |
| Dormant / closed records | CRM statuses include Dormant/Archived in schema; E-13 has no **separate** dormant-row period (covered under CRM classes as TBD) | Non-blocking completeness — see C-gap-1 |

No Tanzania, Kenya, GDPR, or UK statutory period is claimed. Soft-delete (`deleted_at`) is recorded as **FACT** / technical capability, **not** a legal period. Legal hold is named as a possible audit basis, not a numbered rule.

### Gaps and dependencies

| ID | Gap | Category | Remaining action |
| --- | --- | --- | --- |
| C-gap-1 | No dedicated dormant/closed-account retention row. | **PREPARATORY — MATERIAL GAPS** (minor) | Legal/Finance/ops may split active vs dormant later. Do not invent periods. |
| C-gap-2 | Statutory, contractual, tax/accounting, security-log, and backup periods all unknown. | **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **REQUIRES EXTERNAL EVIDENCE** (contracts/statute once applicable law known) · **ARCHITECTURE-DEPENDENT** (backup/IdP/logs) | Queue Q-A-06. Do not implement deletion in this audit. |
| C-gap-3 | Audit immutability vs erasure rights unresolved. | **REQUIRES HUMAN LEGAL/DPO DETERMINATION** | E-13 §5 item 5. |

**Status:** **PREPARATORY — SUBSTANTIALLY COMPLETE** (class matrix; TBD discipline) · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **REQUIRES EXTERNAL EVIDENCE** · **ARCHITECTURE-DEPENDENT**. **NOT YET COMPLETED** as a Production schedule.

---

## D. E-15 findings

Audited artefact: [`adr-0006-e1-c01-e15-personal-data-incident-response.md`](adr-0006-e1-c01-e15-personal-data-incident-response.md). Self-status **`DRAFT` / `DOCUMENTED PROCESS`**. **IMPLEMENTED CONTROL: NOT EVIDENCED**. **TESTED CONTROL: NOT EVIDENCED**. Consistent with L-13 (jurisdiction-specific mapping; no unsourced universal deadline).

### Lifecycle coverage

| Step requested | In E-15? | Control state recorded |
| --- | --- | --- |
| 1. Detection | Yes (§2.1) | Monitoring **NOT SELECTED** |
| 2. Triage / initial classification | Yes (§2.2) | Internal labels (E-16); legal characterisation deferred to step 7 |
| 3. Containment | Yes (§2.3) | **NOT IMPLEMENTED** as Production control |
| 4. Preservation | Yes (§2.5 Evidence preservation) | Audit insert-only **FACT**; Production evidence locker **not evidenced** |
| 5. Assessment | Yes (§2.4 investigation; §2.6 data-impact) | Topology **UNKNOWN** |
| 6. Escalation | Yes (roles §3; crisis overlay **DESIGN INTENT**) | Appointments **MISSING** |
| 7. Legal/DPO assessment | Yes (§2.7) | E-03 DPO **MISSING**; **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| 8. Regulator notification where legally required | Yes (§2.8) | **Do not apply unsourced deadlines.** Authority mapping **MISSING** until E-18 / E-03 |
| 9. Data-subject notification where legally required | Yes (§2.10); client/contract notice separate (§2.9) | Contracts **MISSING** (E-07) |
| 10. Remediation | Yes (§2.11) | Backup/DR **NOT SELECTED** |
| 11. Recovery | Folded into remediation (restore only if integrity verified) | **ARCHITECTURE-DEPENDENT** |
| 12. Post-incident review | Yes (§2.12) | **Not tested** |
| 13. Evidence retention | Preservation at step 5; no separate numbered retention period (see E-13 audit/security rows) | Period **TBD** |

Notification types are distinguished: internal process vs contractual (client) vs regulator vs data-subject. No “72-hour” or other statutory clock is adopted. Gate-B/E2 lab is excluded as a privacy-incident test.

### Gaps and dependencies

| ID | Gap | Category | Remaining action |
| --- | --- | --- | --- |
| D-gap-1 | No named incident owner, detector, coordinator, or security lead. | **REQUIRES HUMAN LEGAL/DPO DETERMINATION** / company appointment (internal) | Queue Q-A-07. Do **not** invent names. Do **not** appoint a DPO. |
| D-gap-2 | Implemented and tested process **MISSING**. | **NOT YET COMPLETED** | Do not claim Production IR readiness. |
| D-gap-3 | Vendor/subprocessor notification clauses, monitoring, logging, secrets platform, backup/DR. | **EXTERNAL EVIDENCE REQUIRED** · **ARCHITECTURE-DEPENDENT** | After contracts and stack exist. |
| D-gap-4 | §3 cell “attestation blank” refers to the **DPO** function, which remains **NOT ESTABLISHED**. Legal Counsel attestation is otherwise complete. | Non-blocking wording lag in a Phase 1 snapshot | Do not rewrite E-15 in this audit. DPO status unchanged. |

**Status:** **PREPARATORY — SUBSTANTIALLY COMPLETE** (documented lifecycle) · **NOT YET COMPLETED** (implemented/tested) · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **REQUIRES EXTERNAL EVIDENCE** · **ARCHITECTURE-DEPENDENT**.

---

## E. E-16 findings

Audited artefact: [`adr-0006-e1-c01-e16-data-classification-legal-mapping.md`](adr-0006-e1-c01-e16-data-classification-legal-mapping.md). Self-status **`DRAFT` / `PARTIALLY EVIDENCED`**. Does **not** close E-16. Consistent with LA-12, LA-13, L-14.

### Supported distinction

The document **does not** say “Restricted+ = legally sensitive personal data.”

| Internal security classification | Treatment |
| --- | --- |
| Public / Internal / Confidential / Restricted / Highly Restricted | Schema/architecture **FACT** + **DESIGN INTENT** |
| Restricted / Restricted+ | **COMPANY POSITION** (LA-12 / LA-13) |
| Restricted, Highly Restricted, Restricted+ | Explicitly **handling controls**, not Tanzania/Kenya/EU/UK statutory terms |

| Legal / statutory characterisation | Treatment |
| --- | --- |
| Ordinary personal data; identity/passport/national ID; health/accessibility; biometric; financial/payment (PAN vs costing); credentials; security-sensitive; commercially confidential rates/budgets/contracts; employee certification | Candidate labels only; **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Commercial pricing / RFP budgets / supplier rates | **Yes** as Confidential/Restricted internally; **not** automatically statutory sensitive PD |
| Passport/health/biometric/PAN structured processing | **Not currently evidenced** (E-04); possible in document bytes (**UNKNOWN**) |

### Gaps and dependencies

| ID | Gap | Category | Remaining action |
| --- | --- | --- | --- |
| E-gap-1 | Two overlapping internal taxonomies (5-level architecture vs Restricted+). | **PREPARATORY — MATERIAL GAPS** / Production handling standard not selected | Do not collapse schemes in this audit. |
| E-gap-2 | Statutory column cannot close until applicable law (E-18) and file census. | **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · residual **UNKNOWN** document bytes | Queue Q-C-05. |

**Status:** **PREPARATORY — SUBSTANTIALLY COMPLETE** (mandatory internal ≠ statutory statement) · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · file-content residual **NOT YET COMPLETED**.

---

## F. E-17 findings

**No dedicated Phase 1 E-17 screening artefact exists** in `docs/governance/` analogous to E-12/E-13/E-15/E-16/E-18.

What exists:

| Material | What it is | What it is not |
| --- | --- | --- |
| P2 DPIA Register (`p2-dpia-register-authorized.md`; `p2-dpia-register-preview.md`; `104_p2_privacy_dpias.sql`; `privacy-dpias.ts`) | Dev/Test **register capability**: human label that a DPIA **case** exists (`title`, optional `notes`, status `open`/`done`/`cancelled`). `done` is **not** legal sign-off. | Not a DPIA product; not lawful-basis determination; not residual-risk scoring; not PDPA/GDPR interpretation; not Production authorization |
| Current evidence register E-17 row | **HUMAN/DPO ACTION REQUIRED**; P2 capability only; no Production screening record | Not a completed screening |
| Queue Q-C-06 | Asks for a screening **record**, not a fabricated DPIA | Outstanding |
| L-15 (adopted) | **REQUIRED AS PRIVACY-RISK/DPIA SCREENING; FULL DPIA WHERE LEGALLY TRIGGERED.** P2 ≠ completed Production DPIA. Screening record **NOT VERIFIED**. | **LEGAL COUNSEL ANALYSIS** (rule), not an E-17 work product |

### Screening-elements check

| Element requested | Present as an E-17/Production screening? |
| --- | --- |
| Screening methodology | **No** dedicated methodology document |
| Triggers / criteria | **No** (P2 has no trigger fields) |
| Processing activities requiring review | E-04 inventory exists separately; not bound into an E-17 screening |
| Risk categories / affected subjects / sensitive data / large-scale / systematic monitoring / cross-border / new technology / vulnerable subjects | **Not** recorded as a completed screen. Cross-border and monitoring are **ARCHITECTURE-DEPENDENT** / **NOT SELECTED** |
| Mitigation / residual-risk / approval-escalation | P2 **explicitly excludes** residual-risk and legal-conclusion fields |
| Evidence of an actual completed DPIA | **None** |

Expected state, confirmed:

**DPIA / privacy-risk screening framework (register capability) prepared; Production DPIA not completed because Production architecture and actual processing scope remain unselected. A human screening record whether DPIA/equivalent is required is also not present.**

This audit does **not** create a Production DPIA or a substitute screening product.

**Status:** **PREPARATORY — MATERIAL GAPS** · **NOT YET COMPLETED** · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **ARCHITECTURE-DEPENDENT** (full DPIA if triggered). Consistent with L-15.

---

## G. E-18 findings

Audited artefact: [`adr-0006-e1-c01-e18-source-market-applicability-screening.md`](adr-0006-e1-c01-e18-source-market-applicability-screening.md). Self-status **`DRAFT` · `PARTIALLY EVIDENCED`**. Applicability on every row: **`REQUIRES HUMAN/DPO/LEGAL DETERMINATION`**. Does **not** close E-18. Consistent with LA-03, LA-04, LA-05, L-16.

### Distinctions verified

The screening questions separate: target/source-market relevance; actual data-subject jurisdiction (E-05 Layer B — **no Production census**); establishment; offering; monitoring; possible international transfer; need for deeper analysis; evidence now; applicability (all pending). Programme destination is not treated as automatic law. Hosting preference is not treated as selected geography.

### Per-jurisdiction classification (this audit — no new legal conclusions)

| Jurisdiction | Factual relevance | Potential applicability (adopted Legal Counsel **framework**, not an E-18 finding that the law applies) | This audit’s classification of the E-18 row |
| --- | --- | --- | --- |
| Tanzania | **COMPANY POSITION**: Tanzania-based DMC; core destination; preferred hosting **not selected**. Establishment extract **MISSING** (E-01). | Legal Counsel LA-02: Tanzania PDPA is the **primary privacy-law baseline** for the Tanzania operation, **with conditions** (does not prove exclusive governance of every activity; PDPC/DPO still **NOT VERIFIED**). | **Factual relevance** · **requires fact-specific legal assessment** (establishment still unverified) · **EXTERNAL EVIDENCE REQUIRED** (E-01). E-18 correctly does **not** conclude the Act applies as a completed factual test. |
| Kenya | **COMPANY POSITION**: significant destination/commercial market. Delegates **FUTURE**. No Kenya establishment extract. | Legal Counsel LA-03: **CONDITIONALLY APPLICABLE — FACT SPECIFIC**. Destination ≠ automatic Kenya DPA. | **Factual relevance** · **potential applicability** · **requires fact-specific legal assessment**. No “programme in Kenya = Kenya DPA” rule. |
| Europe / EEA | **COMPANY POSITION**: source market. No EU census; no EU establishment; offering/monitoring **not evidenced**. | Legal Counsel LA-04: **POTENTIALLY APPLICABLE — DO NOT EXCLUDE**. No universal “international clients = GDPR”. | **Factual relevance** · **potential applicability** · **requires fact-specific legal assessment**. |
| UK | Same pattern; treated separately from EU. | Legal Counsel LA-04: UK GDPR territorial scope is fact-specific. | Same. |
| South Africa, Middle East, Canada, USA, Latin America | **COMPANY POSITION**: source markets (ME and LATAM are **regions**, not one statute). No actual-subject census. | Legal Counsel L-16: screening-level; deeper memo only if facts require. | **Factual relevance** · **requires fact-specific legal assessment** if actual contracts/contacts appear. **EXTERNAL EVIDENCE REQUIRED** for those facts. |

No row concludes that a law applies because SEDMC markets there. No row concludes that a law does not apply because SEDMC operates in Tanzania.

### Non-blocking observation (not a contradiction)

E-18 Tanzania “deeper analysis” cell cites “company **LA-09**” as “primary framework candidate.” In the company-position document, **LA-09 is warm standby**; Tanzania PDPA primary-framework **company** text is **LA-02**; hosting preference is **LA-06**. This is a **citation slip** in a Phase 1 snapshot. It does **not** adopt a law-applies conclusion and was **not** rewritten in this audit.

E-18 §4 says the screening does not itself “select a primary legal framework.” That remains true of **this factual table**. Legal Counsel LA-02 is a separate **legal/control rule** already adopted. Those layers must stay distinct.

**Status:** **PREPARATORY — SUBSTANTIALLY COMPLETE** (screening table) · **REQUIRES HUMAN LEGAL/DPO DETERMINATION** · **REQUIRES EXTERNAL EVIDENCE** · **ARCHITECTURE-DEPENDENT** (transfers/monitoring). **NOT YET COMPLETED** as applicability findings.

---

## H. Cross-document consistency

Compared against E-04, E-05, E-06, LA-01–LA-17, L-01–L-17, Legal Counsel attestation, current register, collection queue, consolidated review pack, and proposed counsel determinations.

| Check | Result |
| --- | --- |
| Privacy notice claims a DPO exists? | **No.** |
| Privacy notice claims PDPC registration? | **No.** |
| Privacy notice implies Tanzania hosting selected? | **No.** |
| Privacy notice invents legal bases, retention, providers, transfer mechanisms? | **No.** |
| Notice processing classes vs E-04? | **Aligned.** |
| Retention invents statutory periods? | **No.** All TBD. Soft-delete ≠ legal period. |
| Incident response invents notification deadlines? | **No.** Explicitly forbids unsourced clocks. |
| Internal classification presented as statutory? | **No.** E-16 mandatory alignment statement. |
| DPIA represented as complete? | **No.** P2 register ≠ DPIA; register and queue say screening missing. |
| Source-market screening used as automatic applicability? | **No.** |
| Transfer claims without an identified path? | **No.** Transfers **Unknown** until Layer D selected. |
| E-06 roles invented in the notice? | **No.** Recipients not stated. |
| Thomas Nguluma identified as DPO? | **No.** |
| Register / queue vs these six items | **Consistent:** drafts/preparatory; E-17 human/DPO action; Q-C-04–Q-C-07 outstanding. |

Phase 1 banners saying `E1-C01: INCOMPLETE` describe **combined Legal/DPO incompleteness and evidence gaps**. They do **not** contradict **E1-C01 Legal Counsel component COMPLETE**. Those banners were **not** rewritten.

**NO MATERIAL CONTRADICTION FOUND.**

---

## I. Remaining dependencies

### Company / internal

- Incident ownership, detection intake, whether any tabletop has actually been run (Q-A-07).
- Business / finance / contractual **candidate** retention needs (Q-A-06) — still not statutory invention.
- Off-EOS processes and file-content census (feeds E-12/E-13/E-16 residuals; Q-A-02).
- Actual client/contact geography and offering/monitoring facts for E-18 (Q-A-03, Q-A-09).

### Human Legal / DPO

- Adequacy review of a future complete notice (Q-C-07) — **after** entity, roles, recipients, retention.
- Lawful bases **only where applicable law requires them** (L-10).
- Statutory / contractual retention numbers and audit-vs-erasure design (L-11).
- Jurisdiction-specific incident-notification mapping (L-13; Q-C-04).
- Statutory sensitive/special-category characterisation (L-14; Q-C-05).
- DPIA/privacy-risk **screening record** and whether full DPIA/equivalent is required (L-15; Q-C-06).
- Fact-specific applicability for TZ / KE / EU / UK and whether other markets need a deeper memo (L-16).
- DPO appointment remains **NOT ESTABLISHED**. THOMAS NGULUMA is **LEGAL COUNSEL ONLY**. Combined Legal/DPO remains **INCOMPLETE**.

### External

- E-01 legal-entity / establishment extract — **NOT VERIFIED**.
- E-02 SEDMC-specific PDPC registration/status — **NOT VERIFIED**. Do not claim registered or not registered.
- E-03 DPO appointment/designation — **NOT ESTABLISHED**.
- E-07 contracts (retention clauses; incident-notice clauses; role terms).

### Architecture-dependent

- Recipients, subprocessors, transfer mechanisms, provider names/locations (E-12, E-18, L-05, L-17).
- Backup / DR / log / IdP retention overlays (E-13).
- Monitoring, logging, secrets platform, vendor breach-notice tooling (E-15).
- Full Production DPIA if screening triggers it (E-17).
- Production TOMs (E-14) if a notice later describes security.

This audit does **not** select hosting, cloud provider, region, backup/DR geography, IdP, email, monitoring, CDN/WAF, KMS, or subprocessors.

---

## J. Governance conclusion

E-12, E-13, E-15, E-16, and E-18 are **preparatory drafts suitable for later qualified human Legal/DPO review**. E-17 has a Dev/Test **register capability** only; the Production screening record and any DPIA product remain **NOT YET COMPLETED**.

None of these items is an approved privacy notice, a legal retention schedule, an implemented incident process, a completed statutory mapping, a completed DPIA, or a finding that extra-Tanzanian law applies.

**E1-C01 Legal Counsel component COMPLETE.**

**DPO component NOT ESTABLISHED.**

**Combined Legal/DPO INCOMPLETE.**

**E1 NOT APPROVED / BLOCKED BY MISSING EVIDENCE.**

**UAT / Production / Migration / Deployment NOT AUTHORIZED.**

Legal Counsel attestation (THOMAS NGULUMA — LEGAL COUNSEL ONLY — 15TH SEPTEMBER 2026 — A.T.N) is **not** altered. It does **not** establish DPO appointment, PDPC registration, regulatory approval, an approved notice, or Production authorization.

**STOP.** Do not manufacture a notice, retention schedule, notification clock, DPIA, DPO, registration, or applicability finding to advance the gate.
