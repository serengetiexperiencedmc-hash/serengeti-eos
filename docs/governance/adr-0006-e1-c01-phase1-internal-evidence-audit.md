# E1-C01 Phase 1 Internal Evidence Integrity & Completeness Audit

> **`READ-ONLY GOVERNANCE / EVIDENCE AUDIT`**  
> **`E1-C01 = INCOMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**  
> **`THIS AUDIT DOES NOT CLOSE E1-C01`**  
> **`THIS AUDIT DOES NOT ATTEST LEGAL/DPO DETERMINATIONS`**

**Audit type:** read-only integrity and completeness review of Phase 1 internal evidence artefacts.  
**Audit date (repository calendar):** 2026-09-16.  
**Branch observed:** `master`.  
**Outcome:** **PASS WITH NON-BLOCKING OBSERVATIONS.**

Phase 1 internal evidence **preparation is substantially complete** for the purpose of routing fact-specific questions to qualified Human Legal/DPO review. The legal/DPO evidence-closure gate remains **open**.

This file does **not** modify Phase 1 artefacts, the formal attestation package, application code, schema, or infrastructure.

---

## 1. Executive Summary

The Phase 1 artefacts are factually grounded in repository models and governance records. They keep **FACT**, **COMPANY POSITION**, **DESIGN INTENT**, **AI COUNSEL ANALYSIS**, **HUMAN LEGAL/DPO DETERMINATION**, and **EXTERNAL EVIDENCE** separate. They do not invent a legal entity, DPO, provider, region, statutory retention period, transfer mechanism, or applicability finding.

Cross-check against CRM, RFP, programme, costing, documents, supplier/hotel, principals, audit, event forbidden keys, and P1/P2 register capability **supports** the inventory’s claim that structured EOS processing does **not** currently include passport, national ID, date of birth, health, accessibility, or payment-card fields. Document-byte contents are correctly left **UNKNOWN**.

No Phase 1 document upgrades Dev/Test capability into Production evidence, or company position into legal attestation.

Non-blocking observations remain: the evidence-closure **action plan** still shows Phase 1 actions as `READY FOR COLLECTION` without pointers to the new files; some inventory evidence paths cite index/preview files rather than the creating migration; outbox/event-catalogue retention is not given its own inventory row; the Human/DPO review pack still navigates to the older evidence-closure **package** rather than the E-01–E-32 register and Phase 1 artefacts.

**E-01 result:** `INTERNAL FACT PREPARATION COMPLETE — LEGAL ESTABLISHMENT NOT VERIFIED`.

---

## 2. Scope

In scope:

- All listed E1-C01 Phase 1 artefacts (index, E-01 placeholder, E-04–E-06, E-12, E-13, E-15, E-16, E-18).
- Evidence closure register and action plan.
- Company position, AI counsel analysis, L-01–L-17 counsel review, human review pack, formal attestation package (read-only).
- Related ADR-0006 / DP-0006 / Gate A–C / privacy-classification records as needed for consistency.
- Kernel/schema/migrations required to validate factual processing claims.

Out of scope: technical implementation; provider/region selection; filling attestation; answering legal questions.

---

## 3. Governance Status

Observed across Phase 1 banners, the evidence-closure register, the action plan, the review pack, counsel analysis, and the attestation instrument:

| Item | Status observed | Consistent? |
| --- | --- | --- |
| E1-C01 | `INCOMPLETE` | Yes |
| E1 | `NOT APPROVED / BLOCKED BY MISSING EVIDENCE` | Yes |
| Production | `NOT AUTHORIZED` | Yes |
| UAT | `NOT AUTHORIZED` | Yes |
| Provider / region | `NOT SELECTED` | Yes |
| L-01–L-17 human attestation | Not completed; attestor fields blank | Yes |
| ADR-0006 | Proposed — blocked (register) | Yes |
| DP-0006 | OPEN (register) | Yes |

No Phase 1 artefact authorizes Production, UAT, hosting, or a legal determination.

---

## 4. File Coverage

### Present (expected Phase 1 set)

| Path | Result |
| --- | --- |
| `docs/governance/adr-0006-e1-c01-phase1-internal-evidence-index.md` | Present |
| `docs/governance/adr-0006-e1-c01-e01-legal-entity-establishment.md` | Present (controlled placeholder; authorized by Phase 1 instructions) |
| `docs/governance/adr-0006-e1-c01-e04-eos-processing-inventory.md` | Present |
| `docs/governance/adr-0006-e1-c01-e05-data-subject-geography-map.md` | Present |
| `docs/governance/adr-0006-e1-c01-e06-processing-role-matrix.md` | Present |
| `docs/governance/adr-0006-e1-c01-e13-retention-requirements.md` | Present |
| `docs/governance/adr-0006-e1-c01-e15-personal-data-incident-response.md` | Present |
| `docs/governance/adr-0006-e1-c01-e16-data-classification-legal-mapping.md` | Present |
| `docs/governance/adr-0006-e1-c01-e18-source-market-applicability-screening.md` | Present |
| `docs/governance/adr-0006-e1-c01-e12-eos-privacy-notice-draft.md` | Present (optional; marked draft) |
| `docs/governance/adr-0006-e1-c01-evidence-closure-register.md` | Present; updated with Phase 1 pointers; items not closed |
| `docs/governance/adr-0006-e1-c01-evidence-closure-action-plan.md` | Present |
| `docs/governance/adr-0006-e1-c01-counsel-style-legal-analysis.md` | Present |
| `docs/governance/adr-0006-e1-c01-l01-l17-counsel-review.md` | Present |
| `docs/governance/adr-0006-e1-c01-human-legal-dpo-review-pack.md` | Present |
| `docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md` | Present; **not modified by this audit** |

### Missing requested filename (pre-existing; not created)

| Path | Result |
| --- | --- |
| `docs/governance/adr-0006-e1-c01-counsel-review.md` | **Does not exist** |

Register §2 and §8, and the action plan header, state that the authoritative counsel-review artefact is `adr-0006-e1-c01-l01-l17-counsel-review.md` and that the shorter filename was **not** created to “fix” the discrepancy.

**Audit judgement:** references are **understandable and non-misleading**. This audit does **not** create a duplicate file.

### Unexpected duplicate

None. No second counsel-review file. No duplicate Phase 1 inventory.

### Incorrect / stale pointers (see §14 and Findings)

- Human review pack §A and counsel-style analysis still label `adr-0006-e1-evidence-closure-package.md` as “Evidence-closure register”. The E-01–E-32 register is `adr-0006-e1-c01-evidence-closure-register.md`. **Stale pointer** (pre-dates Phase 1).
- Action plan Phase 1 rows remain `READY FOR COLLECTION` and do not cite the new artefact paths. **Stale status pointer**; closure criteria still unmet, so `COMPLETE` would be wrong.

---

## 5. E-01 Audit

**File:** `adr-0006-e1-c01-e01-legal-entity-establishment.md`

| Claim / distinction | Audit result | Authority |
| --- | --- | --- |
| Tanzania-based DMC is COMPANY POSITION, not registry proof | Correct (company position LA-01) | COMPANY POSITION |
| Branding / README is not legal personality | Correct | FACT (negative) |
| Dev seed `legalName: "Serengeti Experience DMC Ltd"` and `ARU` / Arusha in `apps/api/src/store.ts` is DESIGN/DEV SEED | **Verified.** Seed exists at organisations map ~line 1307 and location `code: "ARU"`. Not treated as BRELA/incorporation | DESIGN INTENT / Dev seed |
| `organisations.legal_name` is schema capability only | Verified (`packages/db/schema.sql`) | FACT (capability) |
| Fact-pack L1 establishment UNKNOWN | Consistent with attestation §7 stale cell and fact pack | FACT (gap record) |
| No incorporation extract in repository | No BRELA/certificate artefact found | EXTERNAL EVIDENCE absent |
| Human legal validation not provided | Attestation Determination `AWAITING HUMAN INPUT` | HUMAN LEGAL/DPO DETERMINATION absent |

No document audited states that the legal entity or Tanzania establishment has been **legally verified**.

**Expected outcome (met):** `INTERNAL FACT PREPARATION COMPLETE — LEGAL ESTABLISHMENT NOT VERIFIED`.

---

## 6. E-04 Audit

**File:** `adr-0006-e1-c01-e04-eos-processing-inventory.md`

### Cross-check (structured processing)

| Area | Repository evidence used | Inventory treatment | Verdict |
| --- | --- | --- | --- |
| CRM organisations/contacts | `004_c1_crm.sql`; `packages/kernel/src/crm.ts` | Personal data on contacts (name, email, phone, country); org email/phone possibly personal; no passport/DoB | **Supported** |
| Opportunities | `015_c2_opportunity.sql` | Possibly via links | **Supported** (file exists) |
| RFPs | `016_c3_rfp.sql` (`pax_count` integer; destinations text) | Not named delegates | **Supported** |
| Programmes / days / items | `017_c5_programme.sql`; `122_cd_programme_item_extensions.sql` | Staff IDs; `pax_count`; location text; P-PRG-03 FUTURE | **Supported** |
| Costing / approvals | `018_c6_costing.sql`; `019_c7_commercial_approval.sql`; kernel `approval_tasks` in `schema.sql` | Staff identity; commercial facts | **Supported** (approval_tasks live in schema, not a separate kernel module — path imprecision only) |
| Documents | `119_cd_commercial_documents.sql`; `LocalFsDocumentStorage` | Metadata limited; **bytes UNKNOWN** | **Supported** |
| Suppliers / hotels | `014_c4_supplier.sql` `sup_contacts`; `121_cd_hotel_profiles.sql` | Possibly personal via contacts; hotel notes unconstrained | **Supported**; inventory cites `044_pg6_supplier_entities.sql` (indexes) rather than creating migration `014_c4_supplier.sql` |
| Principals / credentials / sessions | `schema.sql` | Email, display name, password **hash** | **Supported** |
| Audit | `audit_events` insert-only | JSONB may copy contact fields | **Supported** |
| P1/P2/P3 registers | `092_p1_privacy_ropa_dsr.sql`; `104_p2_privacy_dpias.sql`; `110_p3_consent_records.sql`; P1 authorized Dev/Test only | Capability ≠ Production RoPA | **Supported**; P1 creating migration not named in P-PRV-01 |
| Bookings | `021_c9_booking.sql` — `pax_count`, no guest identity table | Guest passport/health **not evidenced** | **Supported** |
| Event forbidden keys | `event-schema.ts` `SENSITIVE_KEYS`; `event-sensitive-data-policy.md`; `crm-events.ts` | passport, nationalId, dateOfBirth, email, phone, etc. forbidden in **event payloads** (CRM still stores email) | **Supported**; distinction held |
| Passport / national ID / DoB / health / accessibility / PAN | No domain columns found; architecture 05 examples are DESIGN INTENT | FUTURE / NOT CURRENTLY EVIDENCED | **Supported** |

`sup_contacts` also stores `whatsapp`. The inventory’s “contacts if stored” wording is not false; it is **under-specified**.

Outbox (`outbox_events`) and event-catalogue `retentionDays` are covered only indirectly via the event policy. That is a **completeness observation**, not a false claim of processing.

P1 authorization records a software role key `dpo`. That is **not** DPO appointment evidence. Phase 1 artefacts do not treat it as appointment (correct). Completeness: the inventory could have noted the role-key vs appointment distinction.

**Does not imply current storage of:** passport numbers; national IDs; dates of birth; health; accessibility; payment cards — except as **unknown document bytes**.

---

## 7. E-05 Audit

**File:** `adr-0006-e1-c01-e05-data-subject-geography-map.md`

| Requirement | Result |
| --- | --- |
| Layer A client/org country ≠ Layer B individual jurisdiction | Held |
| Layer C programme destination ≠ A/B/D | Held |
| Layer D processing/storage ≠ selected Production geography | Held — all Production components **NOT SELECTED** / object store **CANDIDATE — NOT SELECTED** |
| `TARGET MARKET` vs `ACTUAL DATA-SUBJECT JURISDICTION` | Held; actual census **MISSING** |
| Target markets not treated as actual subject jurisdictions | Held |
| Tanzania preferred hosting ≠ selected | Held (LA-06) |
| Dev seed Arusha ≠ establishment | Held (points to E-01) |
| Hypothetical worked examples labelled non-facts | Held |

`principals` has **no** `country` column (`schema.sql`) — Layer B staff census claim is correct.

Company LA-05 lists South Africa, Europe, Middle East, Canada, USA, Latin America; Europe and the UK are also described as source markets. E-05’s market table matches that **COMPANY POSITION** without converting it into a census.

---

## 8. E-06 Audit

**File:** `adr-0006-e1-c01-e06-processing-role-matrix.md`

| Requirement | Result |
| --- | --- |
| Roles labelled **candidates** / factual | Yes |
| Legal determination pending on every row | Yes — `PENDING HUMAN/DPO/LEGAL DETERMINATION` |
| No role legally confirmed | Yes |
| DPAs/instructions not assumed | Yes — **None evidenced** |
| Named delegate processing not invented | Yes — FUTURE / not structured in EOS |
| Vendors not confirmed processors | Yes — **NOT SELECTED**; “if engaged”; “role not determined” |
| Commercial vs hosting vs legal role | Held: purpose/means columns are factual observations, not legal tests |
| AI counsel processor hypothesis not copied as determination | Yes (§3.4) |

“FACT: C1 implemented” is true as **Dev/Test implementation**, not Production authorization. Context of the matrix makes this readable; residual misread risk is an observation only.

---

## 9. E-12 Audit

**File:** `adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`

| Check | Result |
| --- | --- |
| Banner `DRAFT — NOT LEGALLY APPROVED` | Present (header and §10) |
| DPO identity invented? | No |
| Legal basis invented? | No — “not stated” |
| Registration number invented? | No |
| Transfer mechanism invented? | No |
| Production provider/region invented? | No |
| Retention period invented? | No — points to E-13 TBD |
| Vendor list invented? | No |
| Privacy contact / legal entity invented? | No — E-01 MISSING |
| Processing limited to evidenced models? | Yes, aligned with E-04; unstructured bytes unknown; FUTURE categories excluded |

Sufficient as a **skeleton for later Legal/DPO drafting**. Not publication-ready. Does not close E-12.

---

## 10. E-13 Audit

**File:** `adr-0006-e1-c01-e13-retention-requirements.md`

| Check | Result |
| --- | --- |
| Statutory periods invented? | **No** — all periods `TO BE DETERMINED — LEGAL/CONTRACTUAL/BUSINESS REQUIREMENT` |
| Legal vs contractual vs business vs security/audit vs backup vs deletion | Columns distinguish these; backup overlay architecture-dependent |
| Soft-delete treated as legal period? | **No** — DESIGN INTENT / technical capability |
| Deletion claimed implemented? | **No** — explicit non-action; `status=deleted` not physical destruction |
| Audit immutability vs erasure left open | Yes — FACT insert-only trigger; legal treatment pending |
| Event-catalogue `retentionDays` | **Not listed** — completeness observation (design field, not a legal period) |

C1 ADR impact “CRM PII retention & lawful basis before UAT with real contact data” is correctly treated as an open design/governance topic, not a schedule.

---

## 11. E-15 Audit

**File:** `adr-0006-e1-c01-e15-personal-data-incident-response.md`

| Portion | Classification |
| --- | --- |
| 12-step playbook | **`DOCUMENTED PROCESS` / `DRAFT`** |
| Crisis-command architecture | **DESIGN INTENT** (intended control) |
| Production monitoring, on-call, evidence locker, secrets rotation | **IMPLEMENTED CONTROL: NOT EVIDENCED** |
| Tabletop/live exercise of this privacy process | **TESTED CONTROL: NOT EVIDENCED** |
| Gate-B/E2 lab restore | FACT of Dev/Test lab; correctly **not** a privacy-breach test |
| Formal decision package monitoring/IR | FACT: **NOT READY** |

| Check | Result |
| --- | --- |
| Detection claimed Production-ready? | No |
| Notification obligations universal without mapping? | No — no unsourced clocks; 72-hour explicitly not adopted |
| Tested IR claimed? | No |
| Vendor notice clauses assumed? | No — E-07/E-30 MISSING |
| DPO/legal appointments invented? | No — E-03 MISSING; “Do not invent a DPO name” |

---

## 12. E-16 Audit

**File:** `adr-0006-e1-c01-e16-data-classification-legal-mapping.md`

| Check | Result |
| --- | --- |
| `SEDMC security classification ≠ statutory legal classification` | Explicit and preserved |
| Restricted / Restricted+ / Highly Restricted treated as statutory categories? | **No** — handling labels / company position |
| Passport, health, biometric, payment, credentials vs commercial rates/budgets | Separate rows; commercial confidentiality ≠ statutory sensitive PD unless criteria met |
| Legal column | `PENDING HUMAN/DPO/LEGAL DETERMINATION` throughout |
| Architecture 05 passport/health examples | DESIGN INTENT, not current structured processing |

Two overlapping internal taxonomies (5-level architecture vs Restricted+) are correctly left as a Production handling-standard gap, not collapsed into law.

---

## 13. E-18 Audit

**File:** `adr-0006-e1-c01-e18-source-market-applicability-screening.md`

Markets inspected: Tanzania; Kenya; EU/EEA; United Kingdom; South Africa; Middle East; Canada; United States; Latin America.

| Check | Result |
| --- | --- |
| Target market vs potential relevance vs actual applicability | Held; applicability column is `REQUIRES HUMAN/DPO/LEGAL DETERMINATION` on every row |
| Law-applies conclusion? | **None** — §4 forbids concluding PDPA/DPA/GDPR/UK GDPR/POPIA apply |
| AI counsel converted into legal conclusion? | **No** — “not copied as a determination”; AI notes labelled AI COUNSEL ANALYSIS |
| Establishment evidenced? | Tanzania **No** (E-01); others **No** |
| Actual EOS data subjects evidenced? | **No** Production census |
| Monitoring / offering legal-test facts | Not evidenced beyond COMPANY POSITION |
| Transfers | Unknown until Layer D selected |

EU row wording “likely **if** EU personal data is processed and storage is outside the EEA” is hypothetical and still pending human determination. Residual risk of over-reading “likely”: **OBSERVATION**, not a silent legal finding.

---

## 14. Cross-Document Consistency

| Topic | Comparison | Classification |
| --- | --- | --- |
| E1 / E1-C01 / Production / UAT banners | Phase 1, register, action plan, review pack, counsel analysis, attestation | **Consistent** |
| Hosting provider / region / backup / DR | All NOT SELECTED / preferred ≠ approved | **Consistent** |
| DPO identity | None named; E-03 missing; attestation blank | **Consistent** |
| Legal entity verified | E-01 MISSING vs attestation §7 establishment UNKNOWN | **Consistent** (stale §7 wording preserved by instruction; company LA-01 is a **position**, not a Determination) |
| Company-position banner `PREPARED` vs attestation “COMPANY BUSINESS POSITION — COMPLETE” | Same 17/17 recorded substance; already reconciled in register §8 | **Non-substantive wording** |
| Index statuses `EVIDENCED` vs register `EVIDENCE PRESENT` | Different allowed vocabularies | **Non-substantive wording** |
| Controller/processor legally confirmed | E-06 pending; counsel “likely” remains analysis | **Consistent** |
| Retention periods | E-13 TBD; E-12 does not invent | **Consistent** |
| Transfer mechanisms | E-10 missing; E-12/E-18 do not invent | **Consistent** |
| Statutory applicability | E-18 pending; AI counsel not used as finding | **Consistent** |
| Production implementation vs design | E-14/E-15 implemented/tested missing; crisis architecture design | **Consistent** |
| Action plan still `READY FOR COLLECTION` for AP-E04–E18 after drafts exist | Drafts do **not** meet closure criteria (human validation / extract / periods) | **Stale pointer** — status not false as `COMPLETE`, but does not cite new files |
| Review pack / counsel analysis “register” → `adr-0006-e1-evidence-closure-package.md` | Older Gate E1 package, not E-01–E-32 register / Phase 1 index | **Stale pointer** |
| Register updates | Points to Phase 1 files; does **not** close items or change E1 status | **Consistent** |

No **substantive** contradiction found that would mean Phase 1 secretly approved E1, selected hosting, or attested law.

---

## 15. Formal Attestation Protection Check

**File:** `docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`

| Check | Result |
| --- | --- |
| Modified by this audit? | **No** |
| Attestor name/role/org/qualification/date/signature | Remain `REQUIRES HUMAN INPUT` |
| LA Human answer / Determination | Remain `AWAITING HUMAN INPUT` |
| Stale §7 `UNKNOWN` / fact-pack cells | Still present; **not** rewritten by Phase 1 or this audit |
| Cursor instruction not to answer | Intact |

No genuine qualified human attestor completion was found in the repository.

---

## 16. Architecture-Dependent Boundary

Confirmed still identified as architecture-dependent in the register (and not determined by Phase 1):

| ID | Still architecture-dependent? | Phase 1 premature selection? |
| --- | --- | --- |
| E-08 | Yes | No |
| E-09 | Yes | No |
| E-11 | Yes | No |
| E-19–E-30 | Yes | No |
| L-05 | Yes | No |
| L-17 | Yes | No |

Phase 1 does **not** select: Production provider; cloud region; backup location; DR location; object storage (Dev FS only); IdP (ADR-0013 OPEN); monitoring; email; CDN/WAF; subprocessors.

SES/allowlist appears in E-04 as **Dev mention** with Production email **NOT SELECTED** — not a provider selection.

---

## 17. Evidence Authority Matrix

| Evidence | Current state | Authority | Verified against repo? | Human review required? | External evidence required? | Architecture dependent? |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | Placeholder complete; legal establishment **not verified** | COMPANY POSITION (TZ-based); Dev seed ≠ FACT of incorporation; EXTERNAL EVIDENCE absent | Yes (seed, schema, no extract) | **Yes** | **Yes** (registry/corporate extract) | No |
| E-04 | Draft inventory from models; not Production RoPA | FACT (schemas/kernel); COMPANY POSITION (intended classes); DESIGN INTENT (future delegate/passport/health) | Yes (spot-checked CRM/RFP/PRG/docs/ID/audit/events/P1) | **Yes** (completeness + legal characterisation) | Recipients later | Recipients/locations **yes** |
| E-05 | Draft A–D map; actual subject census MISSING; Layer D NOT SELECTED | COMPANY POSITION (target markets); FACT (country **fields**); DESIGN INTENT (hosting) | Yes | **Yes** (legal geography) | Vendor regions for Layer D | Layer D **yes** |
| E-06 | Factual candidate matrix; legal roles pending | FACT (who operates EOS in Dev); COMPANY POSITION (LA-01/LA-04); AI COUNSEL ANALYSIS not used as determination | Yes | **Yes** | **Yes** (contracts/DPAs) | Vendor rows **yes** |
| E-12 | Skeleton `DRAFT — NOT LEGALLY APPROVED` | FACT (modelled processing only) | Yes vs E-04 | **Yes** (adequacy) | Recipients/providers later | Recipients/transfers **yes** |
| E-13 | Class matrix; periods TBD; deletion not implemented | DESIGN INTENT (soft-delete); no legal periods | Yes (deleted_at; audit trigger) | **Yes** (Legal/Finance) | Backup TTL later | Backup overlay **yes** |
| E-15 | Documented process draft; not implemented/tested | DESIGN INTENT (crisis architecture); FACT (IR NOT READY) | Yes (crisis doc; formal decision package row 22) | **Yes** (notification mapping) | Vendor notice clauses | Provider clauses **yes** |
| E-16 | Internal≠statutory worksheet; legal column pending | COMPANY POSITION + DESIGN INTENT + schema FACT | Yes (architecture 05; classification columns) | **Yes** | File census later | Census **partial** |
| E-18 | Factual screening; no applicability finding | COMPANY POSITION (markets); AI COUNSEL ANALYSIS separate | Yes vs LA-05/LA-03 and E-01/E-05 | **Yes** | TZ extract; later transfers | Transfer facts **yes** |
| E-31 | Human LA-01–LA-17 determinations absent | HUMAN LEGAL/DPO DETERMINATION required | Yes (attestation blank) | **Yes** (the determination itself) | Some answers need extracts/vendors | Some LA items remain conditional |
| E-32 | Formal L-01–L-17 closure absent | HUMAN LEGAL/DPO DETERMINATION required | Yes | **Yes** | Supporting artefacts as above | L-05/L-17 **yes** |

---

## 18. Human Legal/DPO Questions

Do **not** treat the following as answered. They are routing questions only.

### A. Legal entity / establishment

- What is the legally registered SEDMC entity name, registration number, registry, and registered office?
- What trading name(s) may be used in EOS if different from the registered name?
- What facts constitute Tanzania establishment for applicable privacy/company law (registered office, place of business, other)?
- Is the Dev/Test seed string `Serengeti Experience DMC Ltd` aligned with, or distinct from, the registered name?

### B. Controller / processor roles

- What role does SEDMC occupy for CRM, RFP, programme, supplier/hotel, costing, approvals, and documents under each **applicable** law?
- What role does a corporate client occupy where it supplies employee/agent contact data?
- If named delegate/traveller data is later ingested, does that create a processor relationship, joint control, or something else — and is that in scope for first Production?
- Once providers exist, which are processors, subprocessors, or independent controllers?

### C. Applicability

- Which Tanzania requirements apply to EOS Production processing once E-01 facts exist?
- Which Kenya requirements apply to **actual** processing (not merely Kenya as a destination)?
- Does GDPR apply to any actual EOS processing (offering / monitoring / establishment facts)?
- Does UK GDPR apply, separately from EU/EEA?
- Which other source-market laws (ZA, Middle East states, Canada, US states, LATAM states) require a deeper memo on evidenced facts?

### D. Sensitive / special-category data

- Which **actual** EOS structured fields are personal data under each applicable law?
- Which unstructured document contents (unknown today) would fall within statutory sensitive/special-category or identity-document rules if uploaded?
- How should Restricted / Restricted+ / Highly Restricted be used operationally without being mistaken for statutory labels?

### E. Retention

- What legal/contractual/business retention periods apply to CRM, RFPs, programmes, costing, contracts, audit, logs, auth, and HR certification records?
- What deletion/erasure obligations apply, including vs soft-delete and commercial document `status=deleted`?
- How should immutable `audit_events` be handled if erasure rights apply?
- How should backups interact with erasure (TTL, restore rehydration)?

### F. Transfers

- Which actual processing paths will constitute cross-border transfers once architecture is selected?
- Which transfer mechanism, permit, or safeguard is required for each path? (Do not assume a PDPC permit.)

### G. DPIA / privacy risk

- Does any actual planned Production processing require a DPIA or equivalent assessment? (P2 is a register **capability**, not a completed Production DPIA.)

### H. Incident response

- Which regulatory notification rules apply to SEDMC’s actual processing activities (no unsourced clocks)?
- Which contractual vendor/client notifications would be required once contracts exist?

### I. Privacy notice

- What legal bases and notices are required, to whom, and in which language/jurisdiction, once E-01, roles, retention, applicability, and recipients exist?

---

## 19. External Evidence Required

Still required from outside the repository (collect only where Human Legal/DPO determines they are needed, except the corporate extract which is required to close E-01):

- Corporate registry / incorporation extract (E-01).
- PDPC registration record **if** required (E-02).
- DPO appointment / introduction evidence **if** required (E-03).
- Executed DPAs / role-appropriate contracts (E-07, E-30).
- Vendor region, subprocessor lists, data-location commitments (E-11, E-19–E-28).
- Transfer permit or other legally recognized instrument **if** a path exists and law requires it (E-10).
- Provider security certifications **only if** later relied upon as evidence (not claimed now).

---

## 20. Remaining Architecture-Dependent Evidence

Unchanged:

- E-08 Production data-flow map  
- E-09 transfer register (populated paths)  
- E-11 subprocessor register  
- E-19–E-28 component locations (hosting, PostgreSQL, object storage, backup, DR, IdP, email, monitoring, CDN/WAF, KMS)  
- E-29 support/admin **countries**  
- E-30 subprocessor contracts/transfer flow-down  
- L-05, L-17  

Phase 1 correctly leaves these open.

---

## 21. Findings / Observations

No **BLOCKER** was found **in the Phase 1 artefacts themselves** (they do not falsely close E1). E1 remains blocked by missing human/external/architecture evidence, which the artefacts correctly record.

### F-01 — Action plan not pointed at Phase 1 artefacts

- **Severity:** OBSERVATION (stale pointer)
- **Evidence:** `adr-0006-e1-c01-evidence-closure-action-plan.md` AP-E04–AP-E18 still `READY FOR COLLECTION`; Phase 1 files exist and register cites them.
- **Impact:** A reviewer using only the action plan may think internal drafts have not been started.
- **Required action:** Later governance hygiene — add artefact paths; do **not** mark `COMPLETE` (closure criteria still include human validation / extracts / periods).
- **Responsible authority:** SEDMC governance owner.

### F-02 — Review pack / counsel analysis “register” pointer

- **Severity:** MINOR (stale pointer)
- **Evidence:** Human review pack §A and counsel-style analysis point “Evidence-closure register” to `adr-0006-e1-evidence-closure-package.md` rather than `adr-0006-e1-c01-evidence-closure-register.md` and the Phase 1 index.
- **Impact:** Navigation friction for Human Legal/DPO routing; not a status contradiction.
- **Required action:** Future pack update to cite Phase 1 index + E-01–E-32 register. **Not silently edited in this audit.**
- **Responsible authority:** SEDMC governance owner.

### F-03 — E-04 supplier evidence path

- **Severity:** MINOR
- **Evidence:** P-SUP-01 cites `044_pg6_supplier_entities.sql` (indexes). Creating tables/contacts are in `014_c4_supplier.sql` (`sup_contacts` includes `whatsapp`).
- **Impact:** Path imprecision; underlying “suppliers and contacts exist” claim is true.
- **Required action:** Optional inventory footnote on next revision.
- **Responsible authority:** Privacy/ops (document owner).

### F-04 — P1 creating migration not named

- **Severity:** OBSERVATION
- **Evidence:** P-PRV-01 / index IDX-E04-02 cite P2/P3 migrations and “P1 previews”; `092_p1_privacy_ropa_dsr.sql` exists (register-only; no live erasure).
- **Impact:** Completeness of citations, not a false RoPA-complete claim.
- **Required action:** Optional citation add on next revision.
- **Responsible authority:** Privacy/ops.

### F-05 — Outbox / event-catalogue retention not a dedicated inventory row

- **Severity:** OBSERVATION
- **Evidence:** `outbox_events` and `EventSchemaDefinition.retentionDays` exist; E-04 covers forbidden payload keys; E-13 does not list catalogue days (correctly not as a legal period).
- **Impact:** Secondary processing location slightly under-described.
- **Required action:** Optional P-EVT/P-OUT row on next revision; do not treat `retentionDays` as statutory.
- **Responsible authority:** Privacy/ops + security.

### F-06 — Software role key `dpo` vs DPO appointment

- **Severity:** OBSERVATION
- **Evidence:** `docs/governance/p1-privacy-ropa-dsr-authorized.md` Role `dpo`. Phase 1 does not treat this as E-03 appointment (correct).
- **Impact:** A reader of P1 APIs could confuse a permission key with a statutory DPO.
- **Required action:** When routing E-03, state explicitly that the role key is not appointment evidence.
- **Responsible authority:** Human Legal/DPO + product.

### F-07 — Company PREPARED vs attestation COMPLETE label

- **Severity:** OBSERVATION (non-substantive wording)
- **Evidence:** Company-position banner `PREPARED`; attestation header “COMPANY BUSINESS POSITION — COMPLETE”; register §8 already reconciles 17/17 substance.
- **Impact:** None on legal status if readers follow register §8.
- **Required action:** None required for E1; do not “fix” by filling attestation.
- **Responsible authority:** Governance (already documented).

### F-08 — Counsel-review filename discrepancy

- **Severity:** OBSERVATION (already controlled)
- **Evidence:** `adr-0006-e1-c01-counsel-review.md` absent; `adr-0006-e1-c01-l01-l17-counsel-review.md` present and cited.
- **Impact:** None if the documented reconciliation is used.
- **Required action:** Do **not** create a duplicate file.
- **Responsible authority:** Governance.

No finding that Phase 1 invented: legal entity; DPO; attorney; signature; permit; registration; DPA; certification; legal determination; Production provider; or Production region.

---

## 22. Final Governance Status

`E1-C01 = INCOMPLETE`

`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`

`Production = NOT AUTHORIZED`

`UAT = NOT AUTHORIZED`

Phase 1 internal evidence preparation is **substantially complete** for routing fact-specific Human Legal/DPO questions, **except** that E-01 remains legally unverified and architecture-dependent rows remain unassessable.

The legal/DPO evidence-closure gate remains **open**. Draft artefacts do **not** close E-01, E-04, E-05, E-06, E-12, E-13, E-15, E-16, E-18, E-31, or E-32.

---

## 23. Recommended Next Governance Action

Review this audit together with the Phase 1 artefacts; refresh action-plan and review-pack **pointers** in a later governance hygiene pass if desired (do not mark items complete); then route the §18 questions to a qualified Human Legal/DPO reviewer using the formal attestation package — **before** Production-architecture selection.

`NEXT GOVERNANCE ACTION: ROUTE THE PHASE 1 FACT PACK AND THE IDENTIFIED FACT-SPECIFIC LEGAL QUESTIONS TO QUALIFIED HUMAN/DPO/LEGAL REVIEW; DO NOT SELECT PRODUCTION ARCHITECTURE UNTIL E1 PLACEMENT RULES CAN BE ATTESTED AGAINST EVIDENCED FACTS.`

---

## Final integrity check (this audit)

| Check | Result |
| --- | --- |
| Technical files changed | **No** |
| Database changed | **No** |
| Migration files changed | **No** |
| Migration executed | **No** |
| Production changed | **No** |
| UAT changed | **No** |
| Provider selected | **No** |
| Region selected | **No** |
| DPO invented | **No** |
| Attorney invented | **No** |
| Legal determination invented | **No** |
| External evidence fabricated | **No** |
| Formal attestation package touched | **No** |
| Phase 1 evidence artefacts modified | **No** |
| Git commit | **No** |
| Git push | **No** |
| PR | **No** |
| Merge | **No** |

**File created by this audit only:** `docs/governance/adr-0006-e1-c01-phase1-internal-evidence-audit.md`.

**STOP.**
