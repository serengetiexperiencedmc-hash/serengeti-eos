# E1-B1 — Provider-Neutral RFI/RFQ Issuance-Readiness Audit

> **`READ-ONLY AUDIT`**  
> **`NOT ISSUANCE`** · **`NOT PROVIDER CONTACT`** · **`NOT PROVIDER IDENTIFICATION`**  
> **`NOT ARCHITECTURE SELECTION`** · **`NOT PROVIDER SELECTION`** · **`NOT RANKING`** · **`NOT SCORING`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`E1 = OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`E1-B = RFI/RFQ AND PROVIDER-EVIDENCE PACK PREPARED`**  
> **`Legal Counsel = COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`** · **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`Tanzania = PREFERRED BASELINE ONLY`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Audit date (repository calendar):** 2026-09-16.  
**Determination:** **READY FOR COMPANY AUTHORIZATION TO ISSUE**  
**This audit does not authorize issuance.**

---

## 1. Document control

| Field | Value |
| --- | --- |
| Document | E1-B1 Provider-Neutral RFI/RFQ Issuance-Readiness Audit |
| Path | `docs/governance/adr-0006-e1-b-rfi-rfq-issuance-readiness-audit.md` |
| Nature | READ-ONLY governance audit |
| Objects audited | The three E1-B documents listed in §4 |
| Objects **not** modified | The three E1-B documents; ADR-0006; DP-0006; Legal/DPO attestation package; E-01–E-32; application code; schema; infrastructure; Git |
| Decision produced | Issuance-readiness determination only |
| Authorization produced | **None.** |

---

## 2. Scope

Determine whether the E1-B package is internally complete, coherent, non-misleading, and **safe to issue externally IF AND ONLY IF** a later explicit company authorization is provided.

This audit does **not**: contact providers; identify providers for engagement; issue the RFI/RFQ; request quotations; select architecture or provider; rank or score; approve ADR-0006 or DP-0006; appoint a DPO; close E1; authorize UAT, Production, migration, or deployment.

Finding labels used: **PASS** · **PASS WITH NON-BLOCKING OBSERVATION** · **REQUIRES CORRECTION** · **BLOCKED**.  
Labels **not** used: BEST, WORST, WINNER, LOSER, RANK, SCORE.

---

## 3. Current governance state

| Item | Status (unchanged by this audit) |
| --- | --- |
| E1 | OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED · **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| E1-B | RFI/RFQ AND PROVIDER-EVIDENCE PACK PREPARED |
| ADR-0006 | OPEN / proposed — blocked for Production |
| DP-0006 | OPEN — NOT APPROVED |
| Legal Counsel | COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N. |
| DPO | NOT ESTABLISHED |
| Combined Legal/DPO | INCOMPLETE |
| E-01 | Company-provided legal name **Makundi Serengeti Experience DMC** — authoritative registry evidence **pending** / **NOT VERIFIED** |
| E-02 | PDPC **NOT VERIFIED** |
| E-03 | DPO appointment **NOT ESTABLISHED** |
| L-05 / L-17 | DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE |
| Architecture | UNSELECTED |
| Provider | UNSELECTED |
| Tanzania | PREFERRED BASELINE ONLY — not an approved Production location |
| Production / UAT / Migration / Deployment | NOT AUTHORIZED |

---

## 4. Documents audited

| # | Path | Role |
| --- | --- | --- |
| 1 | `docs/governance/adr-0006-e1-b-provider-neutral-rfi-rfq.md` | Questionnaire (RFI/RFQ) |
| 2 | `docs/governance/adr-0006-e1-b-provider-evidence-requirements.md` | Evidence checklist PE-01–PE-48 |
| 3 | `docs/governance/adr-0006-e1-b-standard-provider-response-template.md` | Comparable response template |

**Authoritative context inspected (present):**

| Input | Present? |
| --- | --- |
| `docs/adr/ADR-0006-hosting-and-residency.md` | Yes — proposed, blocked for Production |
| `docs/decisions/DP-0006-hosting-data-residency.md` | Yes — OPEN; Recommended option Not selected |
| `docs/governance/adr-0006-e1-production-hosting-data-residency-readiness-audit.md` | Yes |
| `docs/governance/adr-0006-e1-production-hosting-data-residency-options-evaluation.md` | Yes — OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED |
| `docs/governance/adr-0006-e1-c01-current-evidence-readiness-register.md` | Yes |
| `docs/governance/adr-0006-e1-c01-consolidated-evidence-gap-and-closure-readiness-audit.md` | Yes |
| `docs/governance/adr-0006-e1-c01-proposed-counsel-determinations.md` (LA-01–LA-17 / L-01–L-17) | Yes |
| `docs/adr/ADR-0011-backup-1900-eat.md` | Yes — Dev/Test evidence-register; Production product TBD |
| `docs/adr/ADR-0012-secrets-platform.md` | Yes — proposed, blocked UAT/Production |
| `docs/adr/ADR-0013-corporate-idp.md` | Yes — proposed, blocked Production |
| `docs/governance/adr-0006-tco-evidence.md` | Yes — OPEN; UNKNOWN — QUOTE REQUIRED; no invented budget |

E-01–E-32 were **not** re-opened. This audit uses the current register and consolidated gap audit as the evidence-state source.

---

## 5. Architecture classes

The E1-B pack uses the **same** four classes as E1-A. Labels are **not** changed by this audit.

| Class | Meaning in E1-A / E1-B |
| --- | --- |
| A | African managed cloud |
| B | EU/EEA managed cloud |
| C | Tanzania-controlled colocation / local infrastructure |
| D | Hybrid |

**DP-0006 nomenclature (non-blocking, unchanged):** DP-0006 Option C is Hybrid and Option D is Colocation Tanzania/Kenya. E1-A / E1-B use C = Tanzania-controlled colo/local and D = Hybrid. This audit does **not** rewrite DP-0006. Letter identity is **not** a ranking device.

No class is ranked. The questionnaire is specified for **identical** later use across A–D.

---

## 6. Internal consistency audit

**Result: PASS WITH NON-BLOCKING OBSERVATION**

| Check | Result |
| --- | --- |
| RFI question numbering Q-A-01–Q-N-12 complete, no gaps | **PASS** — 168 questions |
| Duplicate question IDs | **None** |
| PE numbering PE-01–PE-48 complete, no gaps | **PASS** |
| Duplicate PE IDs | **None** |
| Response template has a slot for every question ID | **PASS** — 168 `### Q-…` headings |
| All PE verification statuses | **NOT REQUESTED** (48/48) |
| Any PE marked VERIFIED | **None** |
| Contradictory hard requirements | **None found** |
| Impossible silent requirements | **None found** — N/A is permitted for unoffered components |
| Four classes share one framework | **PASS** |
| Terminology (Tanzania preferred baseline; Restricted+ internal; PDPC NOT VERIFIED; DPO NOT ESTABLISHED) | **PASS** across all three files |

**Non-blocking observations (internal):**

1. RFI §B instructs the six location fields for **Q-B-01–Q-B-16**; Q-B-17/Q-B-18 are list/confirmation questions. The template still supplies the standard response block for 17/18. Not ambiguous.
2. Q-K-01 asks compute including RAM; Q-K-02 asks memory again. Overlap, not contradiction.
3. Q-J-09 says “especially Class C facilities” for power redundancy. This is explanatory for colo, **not** a ranking of Class C. Cloud candidates can still answer.

---

## 7. Question / evidence traceability

**Result: PASS WITH NON-BLOCKING OBSERVATION**

Material Production, legal/privacy, recovery, security, and TCO requirements in the questionnaire have an evidence path (PE ID + template capture). No PE item lacks a questionnaire home.

### 7.1 Traceability matrix (PE → questions)

| PE | Requirement (short) | Primary RFI questions | Template capture | Production-path? |
| --- | --- | --- | --- | --- |
| PE-01 | Provider identity | Q-A-01, Q-A-03, Q-A-04 | Yes | Yes |
| PE-02 | Contracting entity | Q-A-02, Q-A-07, Q-A-08 | Yes | Yes |
| PE-03 | Primary hosting geography | Q-B-01, Q-A-05, Q-B-18 | Yes + location table | Yes |
| PE-04 | Database geography | Q-B-02 | Yes + location table | Yes |
| PE-05 | Object-storage geography | Q-B-03, Q-F-04 | Yes | Yes |
| PE-06 | Backup geography | Q-B-04, Q-D-03 | Yes | Yes |
| PE-07 | DR geography | Q-B-06, Q-D-04 | Yes | Yes |
| PE-08 | Support geography | Q-B-16, Q-D-05, Q-I-04 | Yes | Yes |
| PE-09 | Subprocessors | Q-A-06, Q-B-17, Q-C-03, Q-C-04, Q-D-06, Q-N-05 | Yes | Yes |
| PE-10 | DPA | Q-C-01, Q-N-02 | Yes | Yes |
| PE-11 | Transfer mechanism | Q-C-05, Q-D-07, Q-D-08, Q-N-09 | Yes | Yes (if transfer exists) |
| PE-12 | Residency guarantee | Q-C-06, Q-D-02, Q-N-08 | Yes | Yes |
| PE-13 | Encryption / TLS | Q-E-10, Q-F-02, Q-H-01–Q-H-03 | Yes | Yes |
| PE-14 | KMS / key control | Q-B-11, Q-E-11, Q-F-03, Q-H-04 | Yes | Yes |
| PE-15 | IAM / MFA | Q-E-12, Q-H-06, Q-H-07, Q-I-07 | Yes | Yes |
| PE-16 | Logging | Q-B-08, Q-E-13, Q-F-12, Q-H-09, Q-I-08 | Yes | Yes |
| PE-17 | Monitoring | Q-B-09, Q-H-10 | Yes | Yes |
| PE-18 | Incident response | Q-C-09, Q-H-14, Q-N-06 | Yes | Yes |
| PE-19 | Backup | Q-E-07, Q-F-06, Q-G-03, Q-H-03 | Yes | Yes |
| PE-20 | Restore | Q-E-08, Q-E-09, Q-G-05, Q-G-07, Q-G-08 | Yes | Yes |
| PE-21 | PITR / WAL | Q-B-05, Q-E-05, Q-E-06, Q-G-04 | Yes | Yes |
| PE-22 | DR | Q-G-06, Q-G-09–Q-G-12, Q-J-10, Q-N-12 | Yes | Yes |
| PE-23 | Technical RTO | Q-G-01 | Yes + quantitative | Yes |
| PE-24 | Technical RPO | Q-G-02 | Yes + quantitative | Yes |
| PE-25 | SLA / availability | Q-J-01–Q-J-04, Q-E-14, Q-N-03 | Yes + quantitative | Yes |
| PE-26 | Capacity | Q-K-01–Q-K-06, Q-K-09, Q-K-10 | Yes + quantitative | Yes |
| PE-27 | Scalability | Q-K-07, Q-K-08 | Yes + quantitative | Yes |
| PE-28 | Portability | Q-E-15, Q-F-10, Q-M-01–Q-M-05, Q-M-09 | Yes | Yes |
| PE-29 | Exit | Q-L-06, Q-L-07, Q-M-10–Q-M-14 | Yes | Yes |
| PE-30 | Pricing | Q-L-01–Q-L-08 | Yes + cost tables | Yes (TCO; budget unknown) |
| PE-31 | Support | Q-I-01–Q-I-10 | Yes | Yes |
| PE-32 | Security assurance | Q-C-13, Q-H-11, Q-H-15, Q-H-16 | Yes | Yes |
| PE-33 | Contractual protections | Q-N-01–Q-N-12 | Yes | Yes |
| PE-34 | Tanzania hosting capability | Q-D-01, Q-D-02 | Yes | If Tanzania is later in topology |
| PE-35 | Automatic data movement | Q-B intro, Q-F-05, Q-D-07 | Yes | Yes |
| PE-36 | Government access | Q-C-10 | Yes | Yes |
| PE-37 | Audit rights | Q-C-11, Q-C-12, Q-N-10 | Yes | Yes |
| PE-38 | Deletion / retention | Q-C-07, Q-C-08, Q-F-07, Q-F-08, Q-M-10, Q-N-07 | Yes | Yes |
| PE-39 | Email geography | Q-B-13 | Yes | If email in hosting scope |
| PE-40 | IdP geography | Q-B-10, Q-M-08 | Yes | If IdP in hosting scope |
| PE-41 | CDN / WAF | Q-B-14, Q-B-15, Q-H-13 | Yes | If in scope |
| PE-42 | Warm standby | Q-B-07 | Yes | If used |
| PE-43 | PostgreSQL 16 | Q-E-01–Q-E-16 | Yes | Yes (application SoR constraint) |
| PE-44 | Object-store capability | Q-F-01, Q-F-09, Q-F-11 | Yes | Yes |
| PE-45 | Insurance / liability | Q-N-11 | Yes | Yes |
| PE-46 | Controller / processor roles | Q-C-02, Q-C-14 | Yes | Yes |
| PE-47 | DNS / identity / IaC portability | Q-M-06–Q-M-08 | Yes | Yes |
| PE-48 | Secrets management | Q-B-12, Q-H-05 | Yes | Yes |

### 7.2 Questions without a dedicated PE ID (still captured)

These remain answerable in the template. They do **not** block issuance.

| Question | Capture path | Note |
| --- | --- | --- |
| Q-H-12 Network isolation | Template maps to **PE-13** | Loose mapping; isolation ≠ encryption. Written answer + architecture note still constitute an evidence path. |
| Q-J-05 Redundancy | PE-22 / PE-25 | Adequate |
| Q-J-06 Failure domains | PE-22 | Adequate |
| Q-J-08 Network redundancy | PE-25 | Adequate |
| Q-J-09 Power redundancy | PE-25 | No dedicated facility-PE; still asked and templated |

**Legal/privacy evidence path:** PE-10, PE-11, PE-12, PE-18, PE-36, PE-37, PE-38, PE-46.  
**Recovery evidence path:** PE-19–PE-24, PE-42.  
**Security evidence path:** PE-13–PE-18, PE-31, PE-32, PE-48.  
**TCO evidence path:** PE-30, PE-29.

---

## 8. Legal / privacy safety audit

**Result: PASS**

The three documents **do not** imply:

| Prohibited implication | Finding |
| --- | --- |
| PDPC registration completed | **Not implied.** Customer PDPC is **NOT VERIFIED**; registered / unregistered / exempt are forbidden. |
| DPO appointed | **Not implied.** DPO **NOT ESTABLISHED**. |
| Company incorporated under unverified name | **Not implied.** Company-provided name only; registry pending. Serengeti Experience DMC Ltd and branding SEDMC are **not** verified legal identity. |
| Tanzania already approved as Production jurisdiction | **Not implied.** Preferred baseline only; Q-D is capability, not selection. |
| Foreign hosting prohibited | **Not implied.** “Not automatically prohibited” + requires legal/transfer analysis. |
| Foreign hosting automatically lawful | **Not implied.** Same clause. |
| GDPR automatically applies / does not apply | **Not implied.** Kenya / EU / UK applicability is **fact-specific**. |
| Kenya law automatically applies / does not apply | **Not implied.** |
| Certification = SEDMC compliance | **Not implied.** Marketing pages insufficient; scope required; marketing is a claim. |
| DPA satisfies all transfer requirements | **Not implied.** Transfer mechanisms asked separately; no mechanism selected. |
| Transfer mechanism already selected | **Not implied.** Examples listed as options only; “do not assume a Tanzania PDPC permit exists or is always required.” |
| Any regulator approved EOS architecture | **Not implied.** |

**Preserved positions:**

| Position | Present in all three E1-B files? |
| --- | --- |
| Company-provided legal name: Makundi Serengeti Experience DMC | Yes |
| Authoritative registry evidence pending | Yes |
| PDPC NOT VERIFIED | Yes |
| DPO NOT ESTABLISHED | Yes |
| THOMAS NGULUMA = LEGAL COUNSEL ONLY | Yes |
| Tanzania = PREFERRED BASELINE ONLY | Yes |
| Restricted / Restricted+ / Highly Restricted = internal, not automatically statutory | Yes (Q-C-14; PE-46; banners) |
| Provider statements ≠ legal conclusions / SEDMC certification | Yes |
| Backups and DR can be additional processing/transfers | Yes |
| Foreign support access assessed separately | Yes |
| Tanzania PDPA = adopted primary baseline | Yes (RFI §C) |

Provider answers are labelled **statements of offering**, not SEDMC determinations.

---

## 9. Data-residency audit

**Result: PASS**

The RFI separately requests location (country; region/city where disclosed; operator; contractual guarantee; automatic movement; remote support access) for:

| Component | ID |
| --- | --- |
| Primary application hosting | Q-B-01 |
| PostgreSQL | Q-B-02 |
| Object / document storage | Q-B-03 |
| Backups | Q-B-04 |
| PITR / WAL | Q-B-05 |
| DR | Q-B-06 |
| Warm standby | Q-B-07 |
| Logging | Q-B-08 |
| Monitoring | Q-B-09 |
| IdP | Q-B-10 |
| KMS | Q-B-11 |
| Secrets | Q-B-12 |
| Email | Q-B-13 |
| CDN | Q-B-14 |
| WAF | Q-B-15 |
| Support and administrative access | Q-B-16 |
| Subprocessors | Q-B-17 |

Q-B-18 requires hosting, processing, storage, backup, DR, support-access, and subprocessor locations to be identified **separately**. The RFI states a Tanzania-hosted application does **not** automatically mean all processing occurs in Tanzania.

Automatic movement is explicit (Q-B intro, Q-F-05, PE-35). Remote support access is explicit (Q-B-16, Q-D-05, Q-I-04–Q-I-10, PE-08).

---

## 10. Recovery audit

**Result: PASS**

| Topic | Pack position |
| --- | --- |
| Business critical target | <= 3 hours |
| Business overall target | <= 4 hours |
| Business data-loss tolerance | Zero tolerated **business** loss |
| Technical RPO = 0 | **Not stated. Explicitly forbidden** to equate business zero-loss with technical RPO = 0 |
| Providers asked for actual technical RTO | Q-G-01 |
| Actual technical RPO (backup / PITR / sync / async) | Q-G-02 |
| Backup frequency | Q-G-03 / Q-E-07 |
| PITR granularity | Q-G-04 / Q-E-05 |
| Restore duration evidence | Q-G-05 |
| Failover / failback | Q-G-09 / Q-G-10 |
| DR testing + evidence | Q-G-11 / Q-G-12 |
| Lab / other-customer tests ≠ SEDMC Production evidence | Stated |
| ADR-0011 19:00 EAT | Asked as possible alignment; Production product **TBD** |
| Warm standby | Not automatically legally mandatory |

Quantitative template tables for Q-G-01 and Q-G-02 keep business targets in the “SEDMC requirement” column **labelled as business targets, not verified technical RTO/RPO**.

---

## 11. Security audit

**Result: PASS WITH NON-BLOCKING OBSERVATION**

| Control | Asked? |
| --- | --- |
| TLS | Q-H-01 |
| Encryption at rest | Q-H-02, Q-E-10, Q-F-02 |
| Backup encryption | Q-H-03 |
| KMS | Q-H-04 |
| Key ownership/control | Q-H-04, PE-14 |
| Secrets | Q-H-05, PE-48 |
| IAM | Q-H-06 |
| MFA | Q-H-07, Q-I-07 |
| Privileged access | Q-H-08, Q-I-06 |
| Logging | Q-H-09, Q-I-08 |
| Monitoring | Q-H-10 |
| Vulnerability management | Q-H-11 |
| Incident response | Q-H-14, Q-C-09 |
| Network isolation | Q-H-12 |
| WAF | Q-H-13, Q-B-15 |
| DDoS | Q-H-13 |
| Security assurance / certifications | Q-H-15, Q-H-16, Q-C-13 — **evidence with scope**, not automatic compliance |
| Support access controls | Q-I-05–Q-I-10 |

ADR-0012 and ADR-0013 remain **OPEN**. The pack does not claim SEDMC implementation and does **not** name Vault, Entra, Keycloak, or a cloud KMS product.

**Observation:** Q-H-12 is mapped to PE-13 in the template (see §7.2). Not a missing question.

---

## 12. TCO audit

**Result: PASS**

Standardized quotation lines present: setup; compute; database; storage; object storage; backup; PITR; DR; standby; bandwidth; egress; monitoring; logging; WAF; CDN; KMS; secrets; IdP; email; support; implementation; migration; recovery testing; professional services; taxes; minimum commitments; termination; retrieval/egress.

Also required: monthly estimate; annual estimate; one-time; optional; assumptions; volume assumptions; currency; tax treatment.

**SEDMC budget = COMPANY DECISION REQUIRED** is preserved in all three files. No budget is invented. Zero is forbidden as a placeholder for unknown. Quotes are labelled **QUOTE**. The current pack **does not authorize sending** the questionnaire and **does not** request a binding quote **now**.

Comparable assumptions: planning load (500 users / 200 concurrent / ~30% growth) is labelled **planning assumption only**. Currency and tax must be stated, so later quotes can be compared on a common structure.

This is consistent with `adr-0006-tco-evidence.md` (`UNKNOWN — QUOTE REQUIRED`; no invented prices).

---

## 13. Provider-evidence audit

**Result: PASS**

Evidence types requested across PE-01–PE-48 include: contract; DPA; SLA; provider documentation; architecture documentation; security report / pen-test sharing terms; certification/attestation **with scope**; subprocessor list; location statement; recovery-test evidence; pricing schedule; written provider response; register/certificate of provider identity.

**Current status: ALL PROVIDER EVIDENCE = NOT REQUESTED.**  
None RECEIVED, UNDER REVIEW, VERIFIED, REJECTED, or NOT APPLICABLE (except that PE-39/40/41 **may later** be N/A with reason — none so marked now).

No provider has been engaged. Marketing is treated as a claim requiring evidence.

---

## 14. Response-template audit

**Result: PASS**

Every question has:

| Field | Present |
| --- | --- |
| Provider answer | Yes |
| Evidence reference | Yes (PE mapping) |
| Document | Yes |
| Section | Yes |
| Page | Yes |
| URL if applicable | Yes |
| Contractual guarantee | Yes |
| Assumptions | Yes |
| Exceptions | Yes |
| Verification status | Yes — default **NOT REQUESTED** |
| Reviewer notes | Yes |

Quantitative requirements additionally capture: **Provider value**; **SEDMC requirement**; **Provider evidence**; **Gap**; **Condition**. Gap is labelled factual, **not a score**.

Candidate header: Scoring / ranking = **NOT PERFORMED**. Completeness = 0. Candidate identifier blank. Date issued **NOT ISSUED**.

Comparability rules forbid score, weight, rank, or winner.

---

## 15. Governance / authorization audit

**Result: PASS WITH NON-BLOCKING OBSERVATION**

Issuing the RFI later, **if** separately authorized, would **not itself** imply architecture selection, provider selection, ADR-0006 approval, DP-0006 approval, Production approval, UAT approval, migration authorization, deployment authorization, or legal clearance. The pack states it does **not** contact providers, select Classes A–D, select a region, approve ADR-0006/DP-0006, appoint a DPO, claim PDPC registration, verify the company name, or authorize UAT/Production/migration/deployment.

**Verbatim sentence check.** The exact sentence *“RFI/RFQ issuance is an information-gathering and market-evidence activity only.”* is **not** in the three E1-B files.

Equivalent language **is** present:

- questionnaire is **preparation only**;
- **not** authorization to contact providers, request binding quotes, sign contracts, provision infrastructure, or approve ADR-0006 / DP-0006;
- pack **does not** request a binding quote and **does not** authorize sending the questionnaire;
- completed template is **not** provider selection, architecture selection, ADR/DP approval, or Production authorization.

**“Separate governed evaluation” of responses:** not verbatim. Implied by: do not score/rank; later identical evaluation of A–D; completed template is not selection; PE statuses remain NOT REQUESTED until a later governed contact.

These wording gaps are **non-blocking**. They should appear on any **later transmittal / company-authorization cover** if issuance is authorized. They do **not** make the questionnaire misleading if issued under an explicit company decision that states the same limits.

**Issuance mechanics** (candidate identification, NDA, who signs, how sent) are **out of scope** of E1-B and belong to the human/company issuance decision. Their absence does **not** make the questionnaire internally unusable.

---

## 16. Entity / DPO audit

**Result: PASS**

| Check | Result |
| --- | --- |
| Makundi Serengeti Experience DMC = company-provided legal name | **PASS** |
| Upgraded to VERIFIED corporate/registry evidence | **No** |
| Serengeti Experience DMC Ltd treated as legal entity | **No** — explicitly not verified |
| SEDMC treated as a legal entity | **No** — branding only, not verified identity |
| THOMAS NGULUMA identified as DPO | **No** — LEGAL COUNSEL ONLY |
| DPO = NOT ESTABLISHED | **PASS** |

---

## 17. Findings

| ID | Classification | Finding |
| --- | --- | --- |
| F-01 | PASS | Question, PE, and template IDs are complete and unique (168 / 48 / 168). |
| F-02 | PASS | Legal/privacy safety positions are preserved; no prohibited implications found. |
| F-03 | PASS | Data-residency components are requested separately; hosting is not a proxy for all processing. |
| F-04 | PASS | Business RTO/RPO-tolerance is distinguished from technical RPO; technical RPO = 0 is forbidden. |
| F-05 | PASS | TCO structure is comparable; budget remains COMPANY DECISION REQUIRED. |
| F-06 | PASS | All PE items are NOT REQUESTED; none VERIFIED. |
| F-07 | PASS | Template is usable, comparable, and non-scoring. |
| F-08 | PASS | No provider is named; no architecture is selected. |
| F-09 | PASS WITH NON-BLOCKING OBSERVATION | Exact “information-gathering and market-evidence activity only” sentence is absent; equivalent non-authorization language is present. Place the exact sentence on any later transmittal if issuance is authorized. |
| F-10 | PASS WITH NON-BLOCKING OBSERVATION | “Future provider responses require a separate governed evaluation” is implied, not verbatim. |
| F-11 | PASS WITH NON-BLOCKING OBSERVATION | DP-0006 C/D letter mapping differs from E1-A/E1-B class letters. Not rewritten. |
| F-12 | PASS WITH NON-BLOCKING OBSERVATION | Q-H-12 network isolation is loosely mapped to PE-13; Q-J-08/Q-J-09 have no dedicated PE. Questions and template slots exist. |
| F-13 | PASS WITH NON-BLOCKING OBSERVATION | PostgreSQL 16 and S3-compatible-or-equivalent are **application SoR / storage-port constraints** applied equally to A–D, not a hosting-class selection. **ARCHITECTURE-INDEPENDENT for classes A–D; APPLICATION-PLATFORM-DEPENDENT.** |
| F-14 | PASS WITH NON-BLOCKING OBSERVATION | Some wording is cloud-flavored (VPC/VNet, AZ) but includes “equivalent” / disk-host-rack failure domains so Class C can answer. |
| F-15 | PASS WITH NON-BLOCKING OBSERVATION | Issuance mechanics (candidate list, NDA, transmittal) are not in the pack; they are part of the later company authorization, not a questionnaire defect. |

**REQUIRES CORRECTION:** none.  
**BLOCKED:** none.

---

## 18. Contradictions

**No material contradiction** between the three E1-B documents, or between the pack and adopted Legal Counsel positions (LA-01–LA-17 / L-01–L-17), E1-A class labels, ADR-0006 OPEN status, DP-0006 OPEN status, ADR-0011 Production product TBD, ADR-0012/0013 OPEN, or TCO “no invented budget.”

**Non-material nomenclature difference only:** DP-0006 letters C/D vs E1-A/E1-B letters C/D (see §5). Previously recorded in E1-A; still present; not blocking.

---

## 19. Non-blocking observations

See F-09 through F-15. Additional notes:

- E1-B banners state architecture unselected and Production not authorized; they do not always repeat the E1-A phrase **E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE**. This audit restates that E1 remains not approved. Not a reason to treat the questionnaire as an E1 approval.
- Section D Tanzania questions are asked of **all** classes, including EU/EEA. That is capability screening against the preferred baseline, **not** selection of Tanzania.
- PE-11 / L-05 / L-17 remain **ARCHITECTURE-DEPENDENT** as to *which* transfer facts exist. The questions that collect those facts are architecture-neutral.
- TCO evidence pack’s “managed cloud preferred direction” is **not** imported into E1-B as a ranking. Correct.

---

## 20. Required corrections

**None.** Do not modify the three E1-B documents as a condition of this audit’s determination.

If company later authorizes issuance, the **authorization / transmittal** should (as a condition of *that* decision, not of this audit):

1. State: **RFI/RFQ issuance is an information-gathering and market-evidence activity only.**
2. State that responses require a **separate governed evaluation** and do not select architecture, provider, or approve ADR-0006 / DP-0006.
3. State whether requested figures are **indicative / non-binding**.
4. Identify candidates, NDA, and sending method — **after** explicit authorization, not in this audit.

---

## 21. Issuance-readiness determination

### Issue-readiness test

| # | Question | Answer |
| --- | --- | --- |
| A | Internally coherent? | **Yes** |
| B | Provider-neutral? | **Yes** |
| C | Legally cautious? | **Yes** |
| D | Technically usable by a future provider? | **Yes** |
| E | Commercially comparable? | **Yes** |
| F | Safe to issue **IF** company authorization is later granted? | **Yes** — this is **not** authorization to issue |

**Determination (exactly one):**

# READY FOR COMPANY AUTHORIZATION TO ISSUE

This is **not** `AUTHORIZED TO ISSUE`.

The next governance gate is a separate **HUMAN/COMPANY DECISION**:

**“SEDMC AUTHORIZES EXTERNAL ISSUANCE OF THE PROVIDER-NEUTRAL E1-B RFI/RFQ.”**

Until that explicit decision exists: **NO EXTERNAL ISSUANCE.**

---

## 22. Explicit non-authorization statement

# ISSUANCE-READINESS AUDIT COMPLETE — NO EXTERNAL ISSUANCE AUTHORIZED.

- No provider contacted.
- No provider identified for engagement.
- No quotation requested.
- No architecture selected.
- No provider selected.
- No ranking/scoring.
- ADR-0006 remains OPEN.
- DP-0006 remains OPEN.
- E1 remains blocked/not approved.
- Legal Counsel remains complete.
- DPO remains not established.
- Combined Legal/DPO remains incomplete.
- Production remains not authorized.
- UAT remains not authorized.
- Migration remains not authorized.
- Deployment remains not authorized.

---

## 23. Next governed action

**HUMAN / COMPANY DECISION REQUIRED:**

Whether SEDMC authorizes external issuance of the provider-neutral E1-B RFI/RFQ.

Until that decision exists, do **not** identify candidates, send the questionnaire, or request quotations.

That later decision, if made, would still **not** be: architecture selection; provider selection; ADR-0006 approval; DP-0006 approval; Combined Legal/DPO completion; E1 closure; or UAT/Production/migration/deployment authorization.

Parallel evidence blockers for any later **contracting** remain: E-01 registry verification; E-02 PDPC; E-03 DPO; Combined Legal/DPO; L-05 / L-17 topology evidence.

---

## Technical / Git integrity

This audit created **one** new governance file. It did **not**:

- modify application code, schema, or migrations;
- change a database;
- create infrastructure, Terraform, Kubernetes, CI/CD, secrets, or DNS;
- deploy;
- perform UAT or Production work;
- commit, push, create a PR, or merge;
- modify the three E1-B documents, ADR-0006, DP-0006, the Legal/DPO attestation package, or E-01–E-32.
