# ADR-0006 Gate E1 — Evidence-closure package

> **`E1 — EVIDENCE CLOSURE IN PROGRESS`**  
> **`E1 OWNER DECISION NOT YET RECORDED`**  
> **`E1 IS NOT APPROVED`**  
> **`PRODUCTION HOSTING IS NOT AUTHORIZED`**  
> Named Legal/DPO identity, signatures, dates of attestation, vendor quotes, SLAs, measured Production RTO/RPO, and residency guarantees are **not** invented.

This package **prepares** the evidence required to move Gate E1 toward a later owner decision. It does **not** close E1. It does **not** select a provider or region. It does **not** declare any jurisdiction approved.

Predecessor: [`adr-0006-e1-production-hosting-residency-readiness-assessment.md`](adr-0006-e1-production-hosting-residency-readiness-assessment.md) (**BLOCKED BY MISSING EVIDENCE**).

E1.1–E1.13 numbering is taken from [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) § GATE E1. It is **not** reinvented. Related LE-01–LE-20 and GC-04–GC-20 IDs are cross-referenced, not replaced.

**Starting worktree (git):** branch `master`. Pre-existing uncommitted Gate B/C technical and governance files were present and were **not** modified. This task adds **only** this file.

---

## 1. STATUS

**E1 — EVIDENCE CLOSURE IN PROGRESS**

| Statement | Record |
| --- | --- |
| E1 owner decision | **NOT YET RECORDED** |
| E1 | **NOT APPROVED** |
| Production hosting | **NOT AUTHORIZED** |
| Provider / region | **NOT SELECTED** |
| Verdict of this package | **BLOCKED BY MISSING EVIDENCE** (preparation; no new external evidence supplied) |
| Cursor established legal/vendor facts | **NO** — package identifies gaps only |
| Company business position (LA-01–LA-17) | **PREPARED** in [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md) — **pending qualified Legal/DPO validation** |
| E1-C01 Legal/DPO attestation | **LEGAL COUNSEL COMPLETED — DPO NOT ESTABLISHED — POST-ATTESTATION RECONCILIATION COMPLETE** |

---

## 2. SCOPE AND EVIDENCE CLASSES

Every item below uses exactly one of:

| Class | Meaning |
| --- | --- |
| `REPOSITORY-VERIFIED` | Stated in repository source/governance as a fact of the **documents or Dev/Test code**, not as Production approval |
| `HUMAN-ATTESTATION-REQUIRED` | A named human must confirm, amend, or reject |
| `DPO/LEGAL-REVIEW-REQUIRED` | Qualified Legal/DPO input; this file is not that input |
| `VENDOR-EVIDENCE-REQUIRED` | Offering, contract, region, SLA, or capability from a real vendor |
| `OWNER-DECISION-REQUIRED` | Business/architecture choice, not a technical measurement |
| `TECHNICAL-VALIDATION-REQUIRED` | Lab or named-candidate proof still missing |
| `NOT-YET-AVAILABLE` | No repository or external artefact found |

`LEGAL/DPO ATTESTATION — HUMAN INPUT REQUIRED`

---

## 3. E1.1–E1.13 LEGAL / DATA-PLACEMENT EVIDENCE REGISTER

Definitions: workplan Gate E1 table. Current positions: fact pack L1–L17 (draft); legal-placement pack; E1 assessment.

### E1.1 Production jurisdiction

| Field | Value |
| --- | --- |
| ID | E1.1 |
| Question | What Production jurisdiction is permitted / permitted-with-conditions / forbidden, by data class? |
| Current documented position | **UNKNOWN** / `REQUIRES LEGAL/DPO VALIDATION`. Tanzania is a **preferred candidate for assessment**, not approval (Owner Decision 7; workplan). No Production geography approved (L8, L11). |
| Evidence currently available | `adr-0006-architecture-evidence-workplan.md`; `adr-0006-legal-data-placement-evidence.md`; fact pack L8/L11; owner BCM Decision 7 |
| Evidence type | repository (drafts) / DPO / owner |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Written Legal/DPO position by data class; Owner preference does not substitute |
| Responsible evidence owner | DPO/legal (Owner for business geography preference) |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `OWNER-DECISION-REQUIRED` (preference only) |

### E1.2 Backup jurisdiction

| Field | Value |
| --- | --- |
| ID | E1.2 |
| Question | What jurisdiction is permitted for backup copies and snapshots? |
| Current documented position | **NOT APPROVED**. Backup is a **separate** placement from Production (L12; LE-08). ADR-0011 Production product **TBD**. |
| Evidence currently available | workplan E1.2; LE-08; ADR-0011; Gate-C disposable dump is **not** this cell |
| Evidence type | repository / legal / vendor |
| Status | **REQUIRES HUMAN ATTESTATION** + **REQUIRES EXTERNAL EVIDENCE** (once a candidate exists) |
| What is required to close it | Legal/DPO rule for backup geography; vendor region of any candidate backup offering |
| Responsible evidence owner | DPO/legal; vendor (location of copies) |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `VENDOR-EVIDENCE-REQUIRED` · `NOT-YET-AVAILABLE` (Production copies) |

### E1.3 DR jurisdiction

| Field | Value |
| --- | --- |
| ID | E1.3 |
| Question | What jurisdiction is permitted for replicas used for disaster recovery? |
| Current documented position | **NOT APPROVED** (LE-09). Lab T4 is one Docker host — **not** geography. |
| Evidence currently available | workplan E1.3; LE-09; laboratory results (non-geographic) |
| Evidence type | repository / legal / vendor |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Legal/DPO position for DR replica geography; vendor DR region if a candidate exists |
| Responsible evidence owner | DPO/legal; vendor |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `VENDOR-EVIDENCE-REQUIRED` · `NOT-YET-AVAILABLE` |

### E1.4 Warm-standby jurisdiction

| Field | Value |
| --- | --- |
| ID | E1.4 |
| Question | What jurisdiction is permitted for warm standby **if** that class is later proposed? |
| Current documented position | Topology **not selected**. LE-10 **NOT APPROVED**. Restore-from-backup is the draft default posture until an Owner/IT decision (GC-03/GC-08). |
| Evidence currently available | workplan E1.4; LE-10; fact pack recovery-posture draft |
| Evidence type | repository / legal / owner |
| Status | **OPEN** (depends on whether warm standby is proposed) |
| What is required to close it | Owner/IT decision whether warm standby is in the architecture; if yes, Legal/DPO geography for that copy |
| Responsible evidence owner | owner / technical / DPO/legal |
| Can Cursor establish this? | **NO** |
| Decision impact | **dependency** until topology chosen; **blocking** if warm standby is in the selected model |
| Classification | `OWNER-DECISION-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` |

### E1.5 Restricted data placement

| Field | Value |
| --- | --- |
| ID | E1.5 |
| Question | What classification-to-geography rules apply to Restricted data? |
| Current documented position | **REQUIRES LEGAL/DPO VALIDATION**. No dedicated Restricted geographic determination (L13; LE-17). Matrix rows **NOT APPROVED**. |
| Evidence currently available | workplan E1.5; fact pack L13; legal-placement §4; GC-07/GC-18 |
| Evidence type | legal / owner / repository drafts |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Approved Restricted inventory + permitted/forbidden geographies |
| Responsible evidence owner | DPO/legal; owner; security |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `HUMAN-ATTESTATION-REQUIRED` |

### E1.6 Highly Restricted data placement

| Field | Value |
| --- | --- |
| ID | E1.6 |
| Question | Confirm default (remain in primary **approved** jurisdiction unless expressly excepted) and the exception process. |
| Current documented position | Stage 1 default documented. **Primary jurisdiction is not approved.** Tanzania is **not** that approval. LE-18 open. |
| Evidence currently available | workplan E1.6; legal-placement §7; fact pack Highly Restricted default |
| Evidence type | repository (governance default) / legal |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Attest or amend the default; name the primary approved jurisdiction **or** record that none is approved yet; exception process |
| Responsible evidence owner | DPO/legal; owner |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `OWNER-DECISION-REQUIRED` |

### E1.7 Cross-border transfers

| Field | Value |
| --- | --- |
| ID | E1.7 |
| Question | What lawful mechanism(s), destinations, and data categories apply to cross-border transfers? |
| Current documented position | **UNKNOWN** — no mechanism approved (L9–L10; LE-03). Transfers are a controlled legal requirement, not an infrastructure-only choice. |
| Evidence currently available | workplan E1.7; fact pack L9–L10; LE-03/LE-04/LE-07 |
| Evidence type | legal / repository drafts |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Destinations (if any); mechanism (if required); categories; Tanzanian notification/permit check **if applicable** — not invented |
| Responsible evidence owner | DPO/legal |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` |

### E1.8 Foreign support access

| Field | Value |
| --- | --- |
| ID | E1.8 |
| Question | Which support countries are allowed, and under what controls? |
| Current documented position | **REQUIRES LEGAL/DPO VALIDATION** (LE-11). Remote viewing can be a transfer. No support-country list. |
| Evidence currently available | workplan E1.8; legal-placement §9; HE-29 **UNKNOWN** |
| Evidence type | legal / vendor / technical |
| Status | **REQUIRES HUMAN ATTESTATION** + **REQUIRES EXTERNAL EVIDENCE** (vendor personnel countries, once a candidate exists) |
| What is required to close it | Allowed access countries; MFA/time-limit/logging rules; vendor support geography |
| Responsible evidence owner | DPO/legal; IT/security; vendor |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `VENDOR-EVIDENCE-REQUIRED` |

### E1.9 Logging/monitoring processing locations

| Field | Value |
| --- | --- |
| ID | E1.9 |
| Question | Where may logs/telemetry be processed, and what minimisation is required? |
| Current documented position | **REQUIRES LEGAL/DPO VALIDATION**. Destinations **UNKNOWN** (LE-15; HE-26). |
| Evidence currently available | workplan E1.9; legal-placement rows H–J; no Production collector in repo |
| Evidence type | legal / vendor / repository (Dev OpenTelemetry class only) |
| Status | **REQUIRES HUMAN ATTESTATION** |
| What is required to close it | Telemetry destinations for any candidate; minimisation/redaction rules |
| Responsible evidence owner | DPO/legal; technical; vendor |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** for complete E1 exit |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `VENDOR-EVIDENCE-REQUIRED` · `NOT-YET-AVAILABLE` |

### E1.10 Identity-provider processing location

| Field | Value |
| --- | --- |
| ID | E1.10 |
| Question | Where does a Production IdP (and subprocessors) process identity data? |
| Current documented position | **UNKNOWN**. ADR-0013 **OPEN**. Workplan: obtain locations **once** a candidate IdP is listed `CANDIDATE — NOT SELECTED`. None listed. |
| Evidence currently available | ADR-0013; ADR-0005 (Dev local issuer); ADR-0015 ports; LE-13 |
| Evidence type | repository (Dev IdP) / legal / vendor |
| Status | **OPEN** · **REQUIRES EXTERNAL EVIDENCE** |
| What is required to close it | At least one IdP listed `CANDIDATE — NOT SELECTED` with processing/subprocessor locations; Legal/DPO review of those locations |
| Responsible evidence owner | owner / technical / vendor / DPO/legal |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** for E1 exit; product pick is also a **separate gate** (ADR-0013) |
| Classification | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` · `NOT-YET-AVAILABLE` |

### E1.11 CDN/WAF processing locations

| Field | Value |
| --- | --- |
| ID | E1.11 |
| Question | Where would edge/WAF/CDN process requests (including possible PII in URLs/payloads)? |
| Current documented position | **UNKNOWN**. No WAF/CDN product selected (HE-24/HE-25; LE-14). |
| Evidence currently available | workplan E1.11; architecture pack WAF **required class**; no offering |
| Evidence type | vendor / legal |
| Status | **OPEN** · **REQUIRES EXTERNAL EVIDENCE** |
| What is required to close it | Candidate edge map **or** explicit architecture that Production will not use CDN/WAF (Owner/IT) plus Legal review of whichever path is proposed |
| Responsible evidence owner | technical / vendor / DPO/legal |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** if edge services are in the model; **dependency** if explicitly out of year-one scope (`OWNER DECISION REQUIRED`) |
| Classification | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` · `OWNER-DECISION-REQUIRED` |

### E1.12 Cloud subprocessors

| Field | Value |
| --- | --- |
| ID | E1.12 |
| Question | What subprocessors (and locations) apply to any `CANDIDATE — NOT SELECTED` offering? |
| Current documented position | **UNKNOWN**. Candidate slots empty. LE-12 `REQUIRES PROVIDER CONTRACT REVIEW`. |
| Evidence currently available | workplan E1.12; hosting-capability empty A-CAND-1…D-CAND-1 |
| Evidence type | vendor / legal |
| Status | **REQUIRES EXTERNAL EVIDENCE** |
| What is required to close it | Subprocessor schedule for each candidate kept in play |
| Responsible evidence owner | vendor; DPO/legal |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` · `NOT-YET-AVAILABLE` |

### E1.13 Contracts / transfer mechanisms / permits / approvals

| Field | Value |
| --- | --- |
| ID | E1.13 |
| Question | What DPA, SCCs/adequacy/other (if applicable), and Tanzanian notification/permit checks apply — **not invented**? |
| Current documented position | **UNKNOWN**. No SCCs or adequacy finding cited. No permit evidence cited. |
| Evidence currently available | workplan E1.13; fact pack L10; LE-03/LE-04/LE-07 |
| Evidence type | legal / vendor |
| Status | **REQUIRES HUMAN ATTESTATION** + **REQUIRES EXTERNAL EVIDENCE** |
| What is required to close it | Contract/DPA availability from candidates; Legal/DPO determination of required instruments and any notification/permit |
| Responsible evidence owner | DPO/legal; vendor |
| Can Cursor establish this? | **NO** |
| Decision impact | **blocking** |
| Classification | `DPO/LEGAL-REVIEW-REQUIRED` · `VENDOR-EVIDENCE-REQUIRED` · `NOT-YET-AVAILABLE` |

**Related questions not numbered E1.1–E1.13 but required for those cells:** controller/processor and establishment (L1, GC-04); data-subject geography (L8, GC-14); Tanzania PDPA design basis vs attestation (L2, LE-01); Kenya DPA (L3, LE-05); GDPR (L4, LE-06). See §4.

---

## 4. HUMAN / DPO / LEGAL ATTESTATION REQUIRED

`LEGAL/DPO ATTESTATION — HUMAN INPUT REQUIRED`

Company factual/business-position responses for these same LA items are recorded in [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md). That file is **not** Legal/DPO attestation and does **not** answer the questions below.

Do **not** treat the following as legally answered. No DPO name, lawyer, signature, or date is recorded here.

**LA-01 — Controller / establishment (GC-04, L1)**  
Please identify the controller(s) and place(s) of establishment for EOS Production processing.

**LA-02 — Tanzania PDPA (LE-01, L2)**  
Please confirm whether Tanzania’s Personal Data Protection Act, 2022 (and which regulations) apply to SEDMC’s intended Production processing, as a Legal/DPO determination rather than a design-basis draft.

**LA-03 — Kenya DPA (LE-05, L3)**  
Please confirm whether, and for which processing activities/data subjects, Kenya’s Data Protection Act applies.

**LA-04 — GDPR / UK GDPR (LE-06, L4, L5)**  
Please confirm whether GDPR and/or UK GDPR apply, do not apply, or remain undetermined pending specified facts.

**LA-05 — Data-subject geography (L8, GC-14)**  
Please identify which jurisdictions may contain data subjects, customers, employees, or suppliers whose personal data EOS would process.

**LA-06 — Production primary-data geography (E1.1)**  
Please identify which jurisdictions are permitted, permitted-with-conditions, or forbidden for Production primary storage, by data class.

**LA-07 — Backup geography (E1.2, LE-08)**  
Please identify which jurisdictions are permitted for backups and snapshots, separately from Production.

**LA-08 — DR / replica geography (E1.3, LE-09)**  
Please identify which jurisdictions are permitted for disaster-recovery replicas.

**LA-09 — Warm-standby geography (E1.4, LE-10)**  
Please confirm whether a warm-standby copy is in scope; if so, please identify permitted jurisdictions for that copy.

**LA-10 — Cross-border transfers (E1.7)**  
Please confirm whether cross-border transfer safeguards are required for any contemplated Production, backup, DR, support, logging, IdP, email, or edge path.

**LA-11 — Transfer mechanism (E1.13)**  
Please identify any lawful transfer mechanism, contractual instrument, or Tanzanian notification/permit that would be required **if** a destination outside the relevant jurisdiction is proposed. Please do not treat an ordinary cloud contract as sufficient unless that is the attested position.

**LA-12 — Restricted data (E1.5)**  
Please identify approved jurisdictions (and prohibitions) for Restricted data.

**LA-13 — Highly Restricted / Restricted+ (E1.6)**  
Please confirm the default (remain in the primary **approved** jurisdiction unless expressly excepted) or state the attested alternative. Please identify the primary approved jurisdiction **or** confirm that none is approved.

**LA-14 — Restricted+ failover (L14, GC-07)**  
Please identify whether Restricted+ data may fail over to any secondary region and, if so, which jurisdictions are approved for failover.

**LA-15 — Subprocessors (E1.12)**  
Please confirm the review standard for subprocessors once a `CANDIDATE — NOT SELECTED` offering exists (locations, flow-down, prohibitions).

**LA-16 — Administrative / support geography (E1.8)**  
Please identify from which countries personnel may access Production systems or data, and which controls are required.

**LA-17 — Logs / IdP / CDN / WAF / email (E1.9–E1.11)**  
Please confirm whether proposed processing models for telemetry, identity, edge, and email require additional contractual safeguards, and which destinations are permitted.

Attestation fields (blank — not fabricated):

| Field | Value |
| --- | --- |
| Attestor name | |
| Role (Legal / DPO / other) | |
| Date | |
| Result (confirm / amend / reject) | |
| Conditions | |

---

## 5. HOSTING CANDIDATE EVIDENCE REQUIREMENTS

Option classes (architecture pack letters): **A** African managed; **B** EU/EEA managed; **C** Tanzania-controlled colo/local; **D** Hybrid. DP-0006 uses different letters for colo vs hybrid; classes are the same. **Not ranked. Not selected.**

For **every** class, repository evidence today is the **class sketch only**. Offering-specific cells are missing. The four matrices therefore share the same fill pattern.

**Existing evidence (all classes):** class description in `docs/decisions/DP-0006-hosting-data-residency.md` and `docs/governance/adr-0006-architecture-decision-package.md`. Empty slots `A-CAND-1`…`D-CAND-1` in `adr-0006-hosting-capability-evidence.md`. Dev Compose is **not** a Production offering.

**Missing evidence (all classes):** named provider, region/facility, and every row below except the class sketch.

### 5.1 Option A — African managed cloud

| Evidence | Required? | Existing evidence | Missing evidence |
| --- | --- | --- | --- |
| Provider identity | Yes | Class only | Named provider |
| Region/facility | Yes | “Africa” as class, not a country | Named region |
| Data-residency statement | Yes | Draft: Africa ≠ Tanzania | Vendor + Legal positions |
| PostgreSQL hosting | Yes | Dev `postgres:16-alpine` only | Production PG offering |
| Backup location | Yes | ADR-0011 requirement text | Vendor backup region |
| DR location | Yes | Class feasible-in-principle | Vendor DR region |
| Cross-border transfer implications | Yes | Draft: foreign African region may be a transfer | Legal + vendor path |
| Restricted+ placement | Yes | None | Legal + vendor |
| Restricted+ failover | Yes | None | Legal + vendor |
| Encryption at rest | Yes | Lab: **NOT DEMONSTRATED** as Production | Vendor control + config |
| Encryption in transit | Yes | Same | Vendor control |
| Key-management model | Yes | ADR-0012 OPEN | Product + custody |
| KMS/HSM location | Yes | None | Region of keys |
| Network isolation | Yes | None | VPC/equivalent |
| Private connectivity | Yes | None | Offering |
| SLA | Yes | None | Written SLA |
| Support model | Yes | 24/7 **NOT PROVEN** for SEDMC | Vendor + SEDMC ops |
| Incident notification | Yes | None | Contractual terms |
| Subprocessors | Yes | None | Schedule |
| Data deletion/exit | Yes | DP-0006 exit **dimension** only | Export/deletion evidence |
| Portability | Yes | Principle: PG/containers | Offering lock-in facts |
| Backup restore capability | Yes | Lab/Gate-B **non-Production** | Candidate restore proof |
| PITR/WAL capability | Yes | Lab class only | Candidate WAL/PITR |
| HA/failover capability | Yes | Lab class only | Candidate HA |
| Cost/quote | Yes | `UNKNOWN — QUOTE REQUIRED` | Quote |
| Contract/DPA availability | Yes | None | DPA |

### 5.2 Option B — EU/EEA managed cloud

Same required rows as §5.1. **Existing evidence:** class sketch; GDPR applicability **UNKNOWN**; Tanzania→EU **NOT APPROVED**; no SCCs cited; `.env.example` `eu-west-1` is **Dev SES**, not this offering. **Missing evidence:** identical offering-specific set as §5.1, plus Legal positions on EU placement and any GDPR transfer instrument **if** GDPR is attested to apply.

### 5.3 Option C — Tanzania-controlled colo/local

Same required rows. **Existing evidence:** class sketch; Tanzania **candidate for assessment**; **no** facility survey/SLA. **Missing evidence:** named facility/provider; HA/power/network; second-site or Legal-approved offshore DR; all vendor rows in §5.1.

### 5.4 Option D — Hybrid

Same required rows **per component location**. **Existing evidence:** class sketch; hybrid **not** default. **Missing evidence:** classification-to-geography split; both estates’ vendor evidence; join/failure-mode tests.

---

## 6. CANDIDATE OFFERING REQUIREMENT

**NO CANDIDATE OFFERING EVIDENCE CURRENTLY AVAILABLE**

No repository artefact names a Production hosting provider, colo facility, or managed-PG region as `CANDIDATE — NOT SELECTED`. Empty slots in the hosting-capability pack are **not** candidates.

Do not invent an offering to fill this section.

---

## 7. CANDIDATE EVIDENCE CARDS

No cards. There is no `CANDIDATE-A-01` (or B/C/D) because no offering exists in repository evidence.

If a later human records an offering, use IDs `CANDIDATE-A-01`, `CANDIDATE-B-01`, `CANDIDATE-C-01`, `CANDIDATE-D-01` aligned to architecture-pack classes, status **`CANDIDATE — NOT SELECTED`**, and fill only evidenced fields.

---

## 8. THREE-OPTION DECISION PACK STRUCTURE

DP-0006: present at least **recommended option + one lower-cost alternative + one higher-control alternative**, each with residency and exit notes. Architecture pack / TCO: comparable 3-year sketches (balanced / lower-cost / higher-control).

Because no provider is selected:

| Decision-pack role | Candidate | Status |
| --- | --- | --- |
| Principal candidate | TBD | **OPEN** |
| Lower-cost alternative | TBD | **OPEN** |
| Higher-control alternative | TBD | **OPEN** |

Do not assign “cheapest” or “highest-control” labels to empty slots.

---

## 9. PRODUCTION TOPOLOGY EVIDENCE

| Component | Production requirement | Current evidence | Missing evidence | Gate |
| --- | --- | --- | --- | --- |
| Web | Production Next.js (or equivalent) in approved placement | Local preview pattern; `productionReady: false` | Hosting account, region, TLS, scale | E1 + E3 + G |
| API | Production Fastify API; fail-closed persist | Dev `127.0.0.1:8080`; Gate B Dev persist | Production runtime, secrets, DB URL | E1 + E + G |
| PostgreSQL | Durable PG 16-class SoR | Compose Dev; disposable Gate-B | Production instance, jurisdiction, HA | E1.1 · F |
| Redis | Projection/cache, not SoR | Compose Dev Redis | Production placement if used | E1 · E3 |
| Search | Optional later (stack doc) | None required for year-one unless Owner includes it | Scope decision | `OWNER DECISION REQUIRED` |
| NATS JetStream | Production event bus pending ADR-0006 | Dev in-memory stand-in; Compose NATS Dev | Production NATS placement | E1 · ADR-0004/0006 |
| Document/object storage | S3-compatible class; bytes ≠ PG metadata | DocumentStorage port; no bucket | Product, region, encryption | E1.1 (object may differ from DB) |
| Email/outbox | Durable outbox; Production publisher | ADR-0010 Dev; SES optional Dev | Production email region/DPA | E1.12 · LE-12 |
| Monitoring/logging | Destinations approved | OTel class; no Production collector | Vendor destinations (E1.9) | E1.9 |
| Backup | 19:00 EAT encrypted remote + restore proof | ADR-0011 **requirement**; Dev register; lab/Gate-B dumps | Product, jurisdiction, restore tests | E1.2 · ADR-0011 |
| Secrets | Production secrets platform | `EnvSecretsProvider` Dev | ADR-0012 product + location | E1 analog · ADR-0012 |
| KMS | Key custody and location | None | Product + key region | E1 · ADR-0012 |
| Identity provider | Corporate OIDC | Local password IdP Dev | ADR-0013 candidate + E1.10 | E1.10 · ADR-0013 |
| WAF/load balancer | Required class (Stage 2) | None | Product + E1.11 | E1.11 |
| Private network | Isolation | None | Design + offering | E1 · E3 |
| Administrative access | Controlled countries | None | E1.8 list | E1.8 |

---

## 10. BACKUP / DR EVIDENCE

### Dev/Test evidence (`REPOSITORY-VERIFIED` as Dev/Test only)

| Artefact | What it shows |
| --- | --- |
| Gate-C migration-123 backup/restore | Disposable Gate-B `pg_dump`/`pg_restore` run `20260916-014121` — **not** Production |
| Stage 4B laboratory | Run `20260915-183034` dump/WAL/PITR on **synthetic** tables — **not** Production; **not** EOS commercial-module recovery |
| ADR-0011 I17 | Dev/Test **evidence register** (job + restore-probe records); **no** real PG/object copy |

### Production requirements (`REPOSITORY-VERIFIED` as **requirements text** only)

Daily encrypted backup **19:00 Africa/Nairobi (EAT)**; remote copy; success = verified restore (ADR-0011). Retention, key ownership, backup jurisdiction, restore target, restore-test cadence, PITR/WAL vs daily-only, DR location, failover/failback: **not** decided as Production implementations.

Business RTO <=3h / <=4h and zero tolerated **business** data loss are **business requirements**, not measured Production results.

### Production evidence

**NO PRODUCTION BACKUP/DR IMPLEMENTATION EVIDENCE FOUND**

Classification: `NOT-YET-AVAILABLE` (implementation) · `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` (E1.2/E1.3) · `TECHNICAL-VALIDATION-REQUIRED` (measured recovery on a named offering).

---

## 11. SECURITY / IDENTITY EVIDENCE

| Item | Blocks E1? | Depends on E1? | Downstream Production gate? | Separate authorization? |
| --- | --- | --- | --- | --- |
| Production IdP | Yes for E1.10 exit | IdP location follows candidate | ADR-0013 product | **Yes** (ADR-0013) |
| Secrets management | Yes for secret-store jurisdiction | Product after hosting class (ADR-0012) | ADR-0012 UAT+ | **Yes** (ADR-0012) |
| Token signing secret | Yes if Production used `.env` pattern | Placement of secret store | Runtime config | **Yes** (not this package) |
| KMS/key management | Yes for key location | Tied to hosting class | ADR-0012 | **Yes** |
| Administrative access | Yes (E1.8) | Support geography of candidate | Ops model | Human/Legal |
| Environment separation | Yes (accounts/keys undefined) | Hosting accounts | Deploy G | **Yes** (G) |
| TLS | Capability class; product unknown | Termination location | E3/G | Downstream unless claimed closed |
| WAF | Yes if in model (E1.11) | Edge map | Security product | `OWNER DECISION REQUIRED` if deferred |
| Network segmentation | Yes for Production topology | Offering VPC | E3 | Downstream of candidate |
| Logging/monitoring | Yes (E1.9) | Destinations | Observability product | Legal + vendor |

Do not implement fixes in this task.

---

## 12. PRODUCTION MIGRATION DEPENDENCY

See [`adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md`](adr-0006-gate-c-item-5-production-migration-backfill-cutover-readiness.md).

**Production migration/backfill/cutover remains blocked until the necessary Production architecture, persistence, backup/recovery, security/identity, and cutover evidence has been established and separately authorized.**

This package does **not** authorize migration. It does **not** contain Production `psql`/`migrate()` commands. Authorization **F**, WP-14, UAT, and deployment remain **NOT AUTHORIZED**.

---

## 13. E1 CLOSURE CRITERIA

E1 is **not** ready for owner decision until evidence exists for:

| # | Criterion | Nature |
| --- | --- | --- |
| 1 | Jurisdiction/placement (E1.1, and data-subject/controller facts) | `DPO/LEGAL-REVIEW-REQUIRED` |
| 2 | Cross-border transfer (E1.7, E1.13) | `DPO/LEGAL-REVIEW-REQUIRED` |
| 3 | Restricted+ placement/failover (E1.5, E1.6, LA-14) | `DPO/LEGAL-REVIEW-REQUIRED` · `OWNER DECISION REQUIRED` (classification ownership) |
| 4 | Production PostgreSQL (placement class + candidate capability) | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` |
| 5 | Backup (E1.2 + ADR-0011 product capability) | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` |
| 6 | DR (E1.3; E1.4 if proposed) | Same; E1.4 also `OWNER DECISION REQUIRED` |
| 7 | Secrets/KMS location | `VENDOR-EVIDENCE-REQUIRED`; product is **separate gate** ADR-0012 |
| 8 | Identity location | `VENDOR-EVIDENCE-REQUIRED`; product is **separate gate** ADR-0013 |
| 9 | Environment separation (Prod vs Dev accounts/keys) | `OWNER DECISION REQUIRED` + technical design |
| 10 | Vendor/service capability (HE checklist on a real candidate) | `VENDOR-EVIDENCE-REQUIRED` · `TECHNICAL-VALIDATION-REQUIRED` |
| 11 | Contractual/DPA evidence | `VENDOR-EVIDENCE-REQUIRED` · `DPO/LEGAL-REVIEW-REQUIRED` |
| 12 | Technical feasibility vs business RTO/RPO **on that candidate** | `TECHNICAL-VALIDATION-REQUIRED` (not lab-as-Production) |

Gate E1 **workplan exit:** Legal/DPO placement rule sufficient to **allow or forbid** option classes A/B/C/D for Production **and copies**. That exit is **not** met.

Workplan §15 / legal-placement pack items 1–11: item 11 (attestation) is **not** satisfied.

---

## 14. NEXT ACTION REGISTER

Existing gap-register IDs **GC-04–GC-20** remain authoritative for stakeholder questionnaire closure. This register is the **E1 evidence-closure** sequence (`E1-Cxx`). It does not replace GC-*.

| ID | Action | Evidence owner | Status | Authorization required |
| --- | --- | --- | --- | --- |
| E1-C01 | Complete Legal/DPO placement attestation (LA-01–LA-17; E1.1–E1.13). Instrument: [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md). **Legal Counsel component COMPLETED** — THOMAS NGULUMA, 15TH SEPTEMBER 2026, A.T.N. **DPO component NOT ESTABLISHED.** Proposed counsel-style determinations adopted with conditions. Status: **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE**. Does **not** authorize Production | Human/DPO/Legal | **OPEN** (DPO + remaining evidence) | Human |
| E1-C02 | Record Owner geography **preferences** (not approvals) for Production/backup/DR (GC-06). Working company preferences for LA-06–LA-09 are now written in the company-position file; they remain **preferences**, not jurisdiction approvals. E1-C02 is **not** closed by that recording. | Owner | **OPEN** | Human |
| E1-C03 | Obtain at least one real offering recorded as `CANDIDATE — NOT SELECTED` for each option class kept in play | Commercial/Owner | **OPEN** | Human (no Cursor vendor selection) |
| E1-C04 | Obtain residency/region/subprocessor/DPA evidence for each such candidate | Vendor/Owner/Legal | **OPEN** | Human |
| E1-C05 | Obtain backup/DR/PITR/restore capability evidence on those candidates (not Gate-B dumps) | Technical/Vendor | **OPEN** | Human |
| E1-C06 | Resolve Production identity/KMS **placement** evidence (E1.10; secret-store location) | Owner/Technical/Vendor/Legal | **OPEN** | Separate gates ADR-0012/0013 |
| E1-C07 | Obtain comparable quotes for the DP-0006 three-role packet (principal / lower-cost / higher-control) | Finance/Vendor/Owner | **OPEN** | Human |
| E1-C08 | Assemble owner decision packet **after** E1-C01–C07 have artefacts | Governance | **OPEN** | Later — **not** this file |

Do **not** execute E1-C01–C08 in this task.

---

## 15. READINESS VERDICT

**BLOCKED BY MISSING EVIDENCE**

This task prepared the register. Subsequent recording of SEDMC company business positions does **not** supply Legal/DPO attestation, vendor offerings, quotes, or Production implementation evidence. Status remains **BLOCKED BY MISSING EVIDENCE**.

---

## 16. AUTHORIZATION BOUNDARY

- E1 owner decision: **NOT RECORDED**
- Hosting provider selection: **NOT AUTHORIZED**
- Region selection: **NOT AUTHORIZED**
- Infrastructure provisioning: **NOT AUTHORIZED**
- Production PostgreSQL: **NOT AUTHORIZED**
- Production backup deployment: **NOT AUTHORIZED**
- Production migration: **NOT AUTHORIZED**
- Cutover: **NOT AUTHORIZED**
- UAT: **NOT AUTHORIZED**
- Production deployment: **NOT AUTHORIZED**

**Database contacted: NO**  
**External/cloud services contacted: NO**  
**Technical files changed: NONE**  
**Git commit / push / PR / merge: NO**

Operator identity: **REQUIRES HUMAN**

**STOP.**
