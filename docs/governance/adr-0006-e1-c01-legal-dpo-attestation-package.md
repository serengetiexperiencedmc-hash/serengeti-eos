# ADR-0006 Gate E1-C01 — Human / DPO / Legal attestation package

> **`E1-C01 — HUMAN/DPO/LEGAL ATTESTATION PACKAGE`**  
> **`COMPANY BUSINESS POSITION — COMPLETE`** (separate file; **not** this instrument)  
> **`AI-GENERATED COUNSEL-STYLE ANALYSIS — RECORDED`** (separate file; **not** attestation)  
> **`PROPOSED COUNSEL-STYLE DETERMINATIONS — RECORDED`** (separate file; adopted by Legal Counsel with conditions; **not** a signed regulatory approval)  
> **`LEGAL COUNSEL DETERMINATION: COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026`**  
> **`LEGAL COUNSEL ATTESTATION: COMPLETED — A.T.N`**  
> **`DPO DETERMINATION: NOT ESTABLISHED BY THIS ATTESTATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`E1 OWNER DECISION NOT YET RECORDED`**  
> **`E1 IS NOT APPROVED`**  
> **`PRODUCTION HOSTING IS NOT AUTHORIZED`**  
> **`UAT IS NOT AUTHORIZED`**

LA-01–LA-17 numbering and questions are reproduced from [`adr-0006-e1-evidence-closure-package.md`](adr-0006-e1-evidence-closure-package.md) §4. They are **not** re-numbered. E1.1–E1.13 remain as defined in [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md).

Legal Counsel fields below are recorded from **authorized company-supplied attestation**. Cursor did **not** invent the attestor identity, role, date, or approval mark. Cursor did **not** invent a DPO appointment, qualification, bar admission, law firm, or regulator number.

This file is an **instrument**. Completing the file template is **not** Production authorization. Filling Legal Counsel fields from company-supplied attestation is **not** a DPO determination.

`ABSENCE OF AN ATTESTATION IS NOT AN APPROVAL.`

**Starting worktree (git):** branch `master`. Pre-existing uncommitted files were not modified except a navigation pointer on the E1-C01 row in the evidence-closure package (see §12).

---

## 1. STATUS

**E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE**

This is **not** combined Legal/DPO completion. DPO determination is **not established**. E1 remains **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**.

| Statement | Record |
| --- | --- |
| Package purpose | Obtain documented human Legal and, separately, DPO confirmation of placement questions |
| Legal Counsel determination | **COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026** |
| Legal Counsel attestation | **COMPLETED — A.T.N** |
| DPO determination | **NOT ESTABLISHED BY THIS ATTESTATION** — no appointment record in the repository; Legal Counsel is **not** recorded as DPO |
| Combined Legal/DPO attestation | **NOT COMPLETE** |
| Candidate / preferred geography | **NOT** an approved Production jurisdiction |
| Architecture / ADR proposal | **NOT** owner approval of hosting |
| Company business position (LA-01–LA-17) | **COMPLETE** in [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md) |
| Proposed counsel-style determinations | **ADOPTED** by Legal Counsel with all recorded conditions — [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) |
| E1-C01 complete (combined Legal/DPO + remaining mandatory evidence) | **NO** |

---

## 2. PURPOSE

This package exists so a **qualified human** can record determinations concerning:

- data-controller / establishment;
- applicable privacy / data-protection regimes;
- Production primary-data placement;
- backup placement;
- DR placement;
- warm-standby placement (if in scope);
- Restricted / Highly Restricted / Restricted+ placement and failover;
- cross-border transfers and transfer documentation;
- foreign support access;
- logging / monitoring;
- identity-provider processing;
- CDN / WAF / edge processing;
- cloud subprocessors;
- contracts, permits, and transfer safeguards.

It does **not** select a hosting provider, region, or option class. It does **not** authorize infrastructure, databases, migrations, UAT, or deployment.

---

## 3. ATTESTOR

### Legal Counsel (company-supplied; recorded as supplied)

| Field | Value |
| --- | --- |
| Attestor Name | THOMAS NGULUMA |
| Role | LEGAL COUNSEL |
| Role / Qualification | LEGAL COUNSEL (qualification, bar admission, practising certificate, and law firm **not supplied — not invented**) |
| Organization | **NOT SUPPLIED — NOT INVENTED** |
| Qualification / basis for review | **NOT SUPPLIED — NOT INVENTED** |
| Review date | 15TH SEPTEMBER 2026 |
| Date | 15TH SEPTEMBER 2026 |
| Jurisdiction(s) reviewed | As adopted in LA-01–LA-17 / L-01–L-17 (Tanzania primary framework; Kenya / EU / UK fact-specific). No additional jurisdiction list was supplied. |
| Supporting documents | This instrument; [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md); [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md). Factual/external artefacts listed in §8 remain **NOT VERIFIED**. |
| Signature / approval mechanism | A.T.N |
| Signature | A.T.N |
| Signature image / electronic-signature certificate | **NOT SUPPLIED — NOT INVENTED** |

### Legal Counsel confirmation (company-supplied)

> I confirm that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position.

This is a **Legal Counsel** confirmation of the reviewed position. It does **not** mean that all factual evidence has been independently verified; that all regulatory registrations have been completed; that all Production providers have been approved; that all transfer permits have been obtained; or that Production has been legally cleared.

### DPO (separate from Legal Counsel)

| Field | Value |
| --- | --- |
| DPO Name | **NOT ESTABLISHED BY THIS ATTESTATION** |
| DPO appointment | **NOT EVIDENCED** in this repository |
| DPO determination | **NOT ESTABLISHED** |
| Note | THOMAS NGULUMA is recorded as **LEGAL COUNSEL** only. This attestation does **not** identify him as Data Protection Officer. |

Overall package determination:

| Component | Selection |
| --- | --- |
| Legal Counsel (reviewed position) | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determinations, including all recorded conditions) |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO instrument | **NOT COMPLETE** |
| Production / UAT / hosting | **NOT AUTHORIZED** |

---

## 4. FAILURE MODES THIS DOCUMENT FORBIDS

| Failure mode | Rule |
| --- | --- |
| Blank Human answer / Attestor / Date | **Not** approval |
| Fact-pack or governance **draft** | **Not** legal approval |
| “Tanzania PDPA design basis” (L2 draft) | **Not** confirmation that PDPA applies as attested law |
| Tanzania as Owner **candidate for assessment** | **Not** an approved Production jurisdiction |
| Proposed backup/DR geography in architecture sketches | **Not** approved backup/DR placement |
| Technical architecture proposal | **Not** legal advice |
| ADR-0006 / DP-0006 **proposed / OPEN** | **Not** owner approval of hosting |
| Company business position recorded | **Not** Legal/DPO attestation, applicable-law confirmation, or jurisdiction approval |
| AI-generated counsel-style legal analysis | **Not** a signed legal opinion, DPO attestation, regulator approval, or Determination |
| Proposed counsel-style determinations | **Not** human attestation, a signed legal opinion, DPO appointment, regulatory approval, or Production authorization |
| Tanzania as **preferred** Production geography | **Not** an approved Production jurisdiction |

`ABSENCE OF AN ATTESTATION IS NOT AN APPROVAL.`

---

## 5. HUMAN/DPO/LEGAL vs OWNER DECISION

### Human / DPO / Legal determinations (this package)

Legal/privacy/placement questions LA-01–LA-17.

**A legal/DPO attestation does not itself select a hosting provider or authorize Production infrastructure.**

### Owner decisions (not this package)

Option class; provider; region; backup model; DR model; warm standby as an architecture choice; cost/control tradeoffs.

**An owner hosting decision does not substitute for required legal/DPO review.**

### Company business position layer (not this instrument)

SEDMC factual/business-position responses for LA-01–LA-17 are recorded in [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md).

| Layer | Status |
| --- | --- |
| Company business position | **COMPLETE** (17/17 recorded) |
| AI-generated counsel-style legal analysis | **RECORDED** in [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md) |
| Proposed counsel-style determinations | **ADOPTED** by Legal Counsel with conditions — [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) |
| Legal Counsel Human answer / Determination / Attestor / Date (this file) | **COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026** · approval **A.T.N** |
| DPO determination | **NOT ESTABLISHED BY THIS ATTESTATION** |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |

Legal Counsel has reviewed the **actual SEDMC position** and adopted the proposed counsel-style determinations **with all recorded qualifications**. That adoption does **not** verify missing factual/external artefacts and does **not** complete a DPO determination.

| LA | Company layer | Legal Counsel Human answer | Legal Counsel Determination | DPO | Item status |
| --- | --- | --- | --- | --- | --- |
| LA-01 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-02 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-03 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-04 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-05 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-06 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-07 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-08 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-09 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-10 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-11 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-12 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-13 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-14 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-15 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-16 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |
| LA-17 | **RECORDED** | **CONFIRMED/ADOPTED** (with conditions) | **APPROVED / CONFIRMED** | **NOT ESTABLISHED** | **LEGAL COUNSEL RECORDED** |

Counts: company positions **17/17**; Legal Counsel LA determinations **17/17 CONFIRMED/ADOPTED** (with conditions); DPO determinations **0/17**; combined Legal/DPO **not complete**.

---

## 6. ANSWER FORMAT (EVERY LA ITEM)

The human reviewer must complete, for each item:

| Field | Allowed values / instruction |
| --- | --- |
| Determination | Exactly one of: `APPROVED / CONFIRMED` · `NOT APPROVED` · `CONDITIONALLY APPROVED` · `NOT APPLICABLE` · `REQUIRES FURTHER REVIEW` — **attestor selects; Cursor must not** |
| Scope | Systems / data / processing covered |
| Jurisdictions | Where relevant |
| Conditions | Limitations |
| Evidence | Document/reference supporting the determination |
| Review date | Human-provided |
| Attestor | Human-provided |

Until a **DPO** determination is separately evidenced, DPO fields remain **NOT ESTABLISHED**.

Legal Counsel fields for LA-01–LA-17 and L-01–L-17 are recorded in §7 and §7A from the company-supplied attestation dated 15TH SEPTEMBER 2026.

---

## 7. LA-01–LA-17 ATTESTATION REGISTER

Questions below are **exact** reproductions from the evidence-closure package §4.

**Analysis prepared by (not attestation):** proposed counsel-style determinations for LA-01–LA-17 remain in [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md).

**Legal Counsel attestation by:** THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N.

**DPO attestation by:** **NOT ESTABLISHED BY THIS ATTESTATION**.

### LA-01 — Controller / establishment (GC-04, L1)

| Field | Content |
| --- | --- |
| ID | LA-01 |
| Related E1 item | Prerequisite to E1.1–E1.13 (controller/establishment; GC-04, L1) |
| Attestation question | Please identify the controller(s) and place(s) of establishment for EOS Production processing. |
| Current repository evidence | `docs/governance/adr-0006-stakeholder-fact-pack.md` L1; `adr-0006-stakeholder-gap-closure-register.md` GC-04; `adr-0006-e1-evidence-closure-package.md` §4 |
| Current documented position | Controller/legal-entity establishment remains **UNKNOWN**. Draft applicable-law text on L1 is **not** establishment. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-02 — Tanzania PDPA (LE-01, L2)

| Field | Content |
| --- | --- |
| ID | LA-02 |
| Related E1 item | LE-01; L2 (feeds E1.1 / E1.7 / E1.13) |
| Attestation question | Please confirm whether Tanzania’s Personal Data Protection Act, 2022 (and which regulations) apply to SEDMC’s intended Production processing, as a Legal/DPO determination rather than a design-basis draft. |
| Current repository evidence | fact pack L2; `adr-0006-legal-data-placement-evidence.md` LE-01; evidence-closure §4 |
| Current documented position | **Draft design basis — not a confirmed legal determination and not Legal/DPO attestation.** |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-03 — Kenya DPA (LE-05, L3)

| Field | Content |
| --- | --- |
| ID | LA-03 |
| Related E1 item | LE-05; L3 |
| Attestation question | Please confirm whether, and for which processing activities/data subjects, Kenya’s Data Protection Act applies. |
| Current repository evidence | fact pack L3; legal-placement LE-05; evidence-closure §4 |
| Current documented position | Applicability **to be assessed** where Kenyan-jurisdiction processing exists. **Not** a determination that Kenya DPA does or does not apply to all SEDMC processing. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-04 — GDPR / UK GDPR (LE-06, L4, L5)

| Field | Content |
| --- | --- |
| ID | LA-04 |
| Related E1 item | LE-06; L4; L5 |
| Attestation question | Please confirm whether GDPR and/or UK GDPR apply, do not apply, or remain undetermined pending specified facts. |
| Current repository evidence | fact pack L4, L5; legal-placement LE-06, LE-07; evidence-closure §4 |
| Current documented position | GDPR **potentially** applicable, **not automatically**. UK GDPR: **UNKNOWN** — no dedicated determination. This is **not** confirmation that GDPR applies and **not** confirmation that it does not. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-05 — Data-subject geography (L8, GC-14)

| Field | Content |
| --- | --- |
| ID | LA-05 |
| Related E1 item | L8; GC-14 (feeds E1.1, E1.7) |
| Attestation question | Please identify which jurisdictions may contain data subjects, customers, employees, or suppliers whose personal data EOS would process. |
| Current repository evidence | fact pack L8; GC-14; evidence-closure §4 |
| Current documented position | **UNKNOWN — REQUIRES FORMAL LEGAL/PRIVACY DECISION / STAKEHOLDER MAPPING.** No verified census. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-06 — Production primary-data geography (E1.1)

| Field | Content |
| --- | --- |
| ID | LA-06 |
| Related E1 item | **E1.1** |
| Attestation question | Please identify which jurisdictions are permitted, permitted-with-conditions, or forbidden for Production primary storage, by data class. |
| Current repository evidence | workplan E1.1; legal-placement Production cells **NOT APPROVED**; Owner Decision 7 (Tanzania = candidate for assessment, **not** approval); evidence-closure E1.1 |
| Current documented position | Production jurisdiction **UNKNOWN** / `REQUIRES LEGAL/DPO VALIDATION`. No Production geography approved. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-07 — Backup geography (E1.2, LE-08)

| Field | Content |
| --- | --- |
| ID | LA-07 |
| Related E1 item | **E1.2**; LE-08 |
| Attestation question | Please identify which jurisdictions are permitted for backups and snapshots, separately from Production. |
| Current repository evidence | workplan E1.2; LE-08; ADR-0011 (Production product **TBD**); evidence-closure E1.2 |
| Current documented position | Backup geography **NOT APPROVED**. Separate from Production. Gate-B/lab dumps are **not** this determination. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-08 — DR / replica geography (E1.3, LE-09)

| Field | Content |
| --- | --- |
| ID | LA-08 |
| Related E1 item | **E1.3**; LE-09 |
| Attestation question | Please identify which jurisdictions are permitted for disaster-recovery replicas. |
| Current repository evidence | workplan E1.3; LE-09; laboratory results (non-geographic); evidence-closure E1.3 |
| Current documented position | DR geography **NOT APPROVED**. Lab site-failure tests are **not** a DR jurisdiction. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-09 — Warm-standby geography (E1.4, LE-10)

| Field | Content |
| --- | --- |
| ID | LA-09 |
| Related E1 item | **E1.4**; LE-10 |
| Attestation question | Please confirm whether a warm-standby copy is in scope; if so, please identify permitted jurisdictions for that copy. |
| Current repository evidence | workplan E1.4; LE-10; GC-03/GC-08; evidence-closure E1.4 |
| Current documented position | Topology **not selected**. Warm standby **not assumed**. LE-10 **NOT APPROVED**. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-10 — Cross-border transfers (E1.7)

| Field | Content |
| --- | --- |
| ID | LA-10 |
| Related E1 item | **E1.7** |
| Attestation question | Please confirm whether cross-border transfer safeguards are required for any contemplated Production, backup, DR, support, logging, IdP, email, or edge path. |
| Current repository evidence | workplan E1.7; fact pack L9–L10; LE-03; evidence-closure E1.7 / §4 LA-10 |
| Current documented position | **UNKNOWN** — no mechanism approved. Transfers are a controlled legal requirement, not an infrastructure-only choice. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-11 — Transfer mechanism (E1.13)

| Field | Content |
| --- | --- |
| ID | LA-11 |
| Related E1 item | **E1.13** |
| Attestation question | Please identify any lawful transfer mechanism, contractual instrument, or Tanzanian notification/permit that would be required **if** a destination outside the relevant jurisdiction is proposed. Please do not treat an ordinary cloud contract as sufficient unless that is the attested position. |
| Current repository evidence | workplan E1.13; fact pack L10; LE-03/LE-04/LE-07; evidence-closure §4 LA-11 |
| Current documented position | **UNKNOWN**. No SCCs or adequacy finding cited. No permit evidence cited. Ordinary cloud contract **not** assumed sufficient. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-12 — Restricted data (E1.5)

| Field | Content |
| --- | --- |
| ID | LA-12 |
| Related E1 item | **E1.5** |
| Attestation question | Please identify approved jurisdictions (and prohibitions) for Restricted data. |
| Current repository evidence | workplan E1.5; fact pack L13; legal-placement §4; GC-07/GC-18; evidence-closure §4 LA-12 |
| Current documented position | **REQUIRES LEGAL/DPO VALIDATION**. No dedicated Restricted geographic determination. Matrix rows **NOT APPROVED**. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-13 — Highly Restricted / Restricted+ (E1.6)

| Field | Content |
| --- | --- |
| ID | LA-13 |
| Related E1 item | **E1.6** |
| Attestation question | Please confirm the default (remain in the primary **approved** jurisdiction unless expressly excepted) or state the attested alternative. Please identify the primary approved jurisdiction **or** confirm that none is approved. |
| Current repository evidence | workplan E1.6; legal-placement §7; fact pack Highly Restricted default; evidence-closure §4 LA-13 |
| Current documented position | Stage 1 default is documented. **Primary jurisdiction is not approved.** Tanzania is **not** that approval. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-14 — Restricted+ failover (L14, GC-07)

| Field | Content |
| --- | --- |
| ID | LA-14 |
| Related E1 item | L14; GC-07 (related to E1.5 / E1.6) |
| Attestation question | Please identify whether Restricted+ data may fail over to any secondary region and, if so, which jurisdictions are approved for failover. |
| Current repository evidence | fact pack L14; GC-07; evidence-closure §4 LA-14 |
| Current documented position | Legal acceptability of failover destinations is **NOT APPROVED**. Production failover/replication **NOT AUTHORIZED**. No DR region selected. Failover architecture is **not inferred**. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-15 — Subprocessors (E1.12)

| Field | Content |
| --- | --- |
| ID | LA-15 |
| Related E1 item | **E1.12** |
| Attestation question | Please confirm the review standard for subprocessors once a `CANDIDATE — NOT SELECTED` offering exists (locations, flow-down, prohibitions). |
| Current repository evidence | workplan E1.12; LE-12; hosting-capability empty candidate slots; evidence-closure §4 LA-15 |
| Current documented position | **UNKNOWN**. No `CANDIDATE — NOT SELECTED` offering. LE-12 requires provider contract review once a candidate exists. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-16 — Administrative / support geography (E1.8)

| Field | Content |
| --- | --- |
| ID | LA-16 |
| Related E1 item | **E1.8** |
| Attestation question | Please identify from which countries personnel may access Production systems or data, and which controls are required. |
| Current repository evidence | workplan E1.8; legal-placement §9; LE-11; HE-29; evidence-closure §4 LA-16 |
| Current documented position | **REQUIRES LEGAL/DPO VALIDATION**. No support-country list. Remote viewing can be a transfer. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

### LA-17 — Logs / IdP / CDN / WAF / email (E1.9–E1.11)

| Field | Content |
| --- | --- |
| ID | LA-17 |
| Related E1 item | **E1.9**, **E1.10**, **E1.11** (email: LE-12 component L) |
| Attestation question | Please confirm whether proposed processing models for telemetry, identity, edge, and email require additional contractual safeguards, and which destinations are permitted. |
| Current repository evidence | workplan E1.9–E1.11; LE-13–LE-15; ADR-0012; ADR-0013; evidence-closure §4 LA-17 |
| Current documented position | Log/telemetry destinations **UNKNOWN**. IdP product **OPEN** (ADR-0013). CDN/WAF **not selected**. Email Production publisher **not selected**. |
| Proposed counsel-style analysis (adopted by Legal Counsel with conditions) | See [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §3 for this LA ID. All qualifications in that row are **preserved**. |
| Human answer | **CONFIRMED/ADOPTED.** Legal Counsel confirms that the Legal/DPO answers represent the reviewed legal, privacy, residency and transfer position. The adopted substance for this LA ID is the proposed counsel-style determination, including all conditions. This is **not** independent verification of missing factual/external artefacts and is **not** Production clearance. |
| Determination | **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED of the proposed counsel-style determination for this LA ID, including all recorded conditions) |
| Scope | EOS Production legal/privacy/residency/transfer position for this LA ID, as recorded in proposed counsel-style determination §3. Architecture-dependent locations remain unset. |
| Jurisdictions | As recorded for this LA ID in proposed counsel-style determination §3 (Tanzania primary framework; Kenya / EU / UK and others fact-specific where relevant). |
| Conditions | All conditions in proposed counsel-style determination §3 for this LA ID are preserved (including fact-and-contract dependence; non-exclusivity of Tanzania law; conditional Kenya and EU/UK applicability; geography-layer distinction; Tanzania as preferred not mandatory hosting; backup/DR/transfer/subprocessor/support/service-specific qualifications). Factual/external artefacts remain **NOT VERIFIED**. Named Production locations remain **NOT SELECTED**. |
| Supporting evidence | Company-supplied Legal Counsel confirmation dated 15TH SEPTEMBER 2026; proposed counsel determinations §3; company business position; Phase 1 drafts as cited. **Not** PDPC registration, DPO appointment, executed DPAs, transfer permits, or provider/region evidence. |
| Attestor | THOMAS NGULUMA — LEGAL COUNSEL |
| Date | 15TH SEPTEMBER 2026 |
| DPO | **NOT ESTABLISHED BY THIS ATTESTATION** |
| Status | **LEGAL COUNSEL DETERMINATION RECORDED** — DPO **NOT ESTABLISHED** — not Production authorization |

LA-17 as defined in the repository is a **combined** question covering telemetry, identity, edge, and email. It is **not** split into separate LA numbers. The human reviewer may attach sub-answers for: application logs; audit logs; security telemetry; monitoring; traces; support diagnostics; IdP processing; CDN/WAF/edge; email — still under **LA-17**.

**Preserved Legal Counsel qualifications (not altered):**

- LA-01: controller/processor determination is fact and contract dependent.
- LA-02: Tanzania PDPA is the primary framework; this does **not** prove all processing is exclusively governed by Tanzania law.
- LA-03: Kenya applicability is conditional/fact specific.
- LA-04: EU/UK GDPR applicability is potentially applicable and fact specific.
- LA-05: data-subject geography must be distinguished from client and destination geography.
- LA-06: Tanzania is the preferred legal/control baseline, not an automatic legal prohibition on foreign hosting.
- LA-07: backups containing personal data remain subject to privacy/transfer analysis.
- LA-08: foreign DR is architecture/transfer dependent.
- LA-09: warm standby is not automatically legally required.
- LA-10: cross-border processing requires a documented transfer assessment.
- LA-11: transfer mechanism is path-specific.
- LA-12: SEDMC Restricted is an internal classification and not itself a statutory sensitive-data category.
- LA-13: heightened controls apply to relevant sensitive/high-risk categories.
- LA-14: Restricted+ failover must respect approved jurisdictional controls.
- LA-15: Production subprocessors must be identified and assessed.
- LA-16: foreign administrative/support access requires appropriate controls.
- LA-17: connected services must be separately assessed for processing and geography.

---

## 7A. L-01–L-17 LEGAL COUNSEL DETERMINATIONS (NOT DPO; NOT ARCHITECTURE CLOSURE)

**Analysis prepared by:** proposed counsel-style determinations remain in [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §4.

**Legal Counsel attestation by:** THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N.

**DPO attestation by:** **NOT ESTABLISHED BY THIS ATTESTATION**.

**L-05 and L-17 are not finally closed.** They remain `DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`.

| L | Legal Counsel determination (CONFIRMED/ADOPTED of proposed analysis) | Architecture / evidence note | Attestor | Date | DPO | Status |
| --- | --- | --- | --- | --- | --- | --- |
| L-01 | **APPROVED / CONFIRMED.** PDPC registration is a Production prerequisite, subject to verification of actual registration status. | Registration **NOT VERIFIED**. Legal Counsel confirmation does **not** prove registration exists. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — FACTUAL EVIDENCE NOT VERIFIED** |
| L-02 | **APPROVED / CONFIRMED.** DPO requirement must be assessed and formally addressed where required by Tanzanian law/registration. Verify actual appointment. Do **not** equate with GDPR DPO. THOMAS NGULUMA is **LEGAL COUNSEL**, **not** DPO. | Appointment **NOT VERIFIED**. P1 role key `dpo` ≠ appointment. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — DPO NOT EVIDENCED** |
| L-03 | **APPROVED / CONFIRMED.** Authoritative EOS processing inventory **REQUIRED**. | E-04 draft is not a completed Production RoPA. Recipients/locations wait on architecture. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-04 | **APPROVED / CONFIRMED.** Controller/processor role matrix **REQUIRED**. | Contracts **NOT VERIFIED**. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-05 | **APPROVED / CONFIRMED** as a required Production control. Production data-flow map **REQUIRED** and remains architecture dependent. | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not finally closed.** | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — OPEN — DEFERRED** |
| L-06 | **APPROVED / CONFIRMED.** International transfer register **REQUIRED**. | Populated paths **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. Framework rule adopted. **Not closed** as a populated register. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — PATHS DEFERRED** |
| L-07 | **APPROVED / CONFIRMED.** Transfer mechanism **REQUIRED WHERE** a regulated transfer exists. Path-specific. Assess Tanzania permit requirements where applicable. | Path instruments **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. Permit **NOT VERIFIED**. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — INSTRUMENTS DEFERRED** |
| L-08 | **APPROVED / CONFIRMED.** Production subprocessor register **REQUIRED**. | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed** as a populated register. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — OPEN — DEFERRED** |
| L-09 | **APPROVED / CONFIRMED.** Appropriate data-processing/role contracts **REQUIRED WHERE** controller/processor relationships exist. | DPAs **NOT VERIFIED**. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — CONTRACTS NOT VERIFIED** |
| L-10 | **APPROVED / CONFIRMED.** Privacy notice **REQUIRED**. | E-12 remains `DRAFT — NOT LEGALLY APPROVED`. Recipients wait on vendors. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-11 | **APPROVED / CONFIRMED.** Retention schedule **REQUIRED**. | Periods TBD. Backup overlay waits on E-22. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — PERIODS NOT SET** |
| L-12 | **APPROVED / CONFIRMED.** Technical and organizational measures **REQUIRED**. | Production TOMs wait on a selected stack. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — TOMs DEFERRED** |
| L-13 | **APPROVED / CONFIRMED.** Incident/breach response and applicable notification mapping **REQUIRED**. | Implemented/tested process **NOT VERIFIED**. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-14 | **APPROVED / CONFIRMED.** Sensitive-data controls **REQUIRED WHERE** applicable. Internal classification ≠ statutory classification. | File census incomplete. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-15 | **APPROVED / CONFIRMED.** DPIA/privacy-risk screening **REQUIRED**; full DPIA where legally triggered. | Screening record **NOT VERIFIED**. P2 register ≠ Production DPIA. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-16 | **APPROVED / CONFIRMED.** Source-market legal applicability assessment **REQUIRED** on a risk-based basis (Tanzania, Kenya, EU/EEA, UK first). | Screening ≠ a full memo per country. | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED** |
| L-17 | **APPROVED / CONFIRMED** as **MANDATORY BEFORE PRODUCTION**. Final legal review of the **actual** Production architecture **REQUIRED**. | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not finally closed.** | THOMAS NGULUMA — LEGAL COUNSEL | 15TH SEPTEMBER 2026 | **NOT ESTABLISHED** | **LEGAL COUNSEL RULE ADOPTED — OPEN — DEFERRED** |

Legal Counsel L coverage: **17/17 CONFIRMED/ADOPTED** (including explicit deferrals of L-05 and L-17). DPO L coverage: **0/17**. L-05, L-17, E-08, E-09, E-11, E-19–E-30: **not closed**.

---

## 8. EVIDENCE ATTACHMENT REGISTER

Existing repository paths cite **drafts and gap registers**. They are **not** completed attestations.

Evidence categories **must not** be collapsed: **A** legal authority; **B** SEDMC factual evidence; **C** company position; **D** AI counsel-style analysis; **E** human Legal Counsel determination (now recorded) / DPO determination (**not established**); **F** provider/architecture evidence.

Legal Counsel confirmation is **not** evidence that SEDMC registration, DPO appointment, contracts, providers, regions, transfer permits, DPIA, or Production architecture exist. Those remain **`NOT VERIFIED`**.

Proposed counsel-style analysis and official legal-authority URLs: [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md). Official URLs may be marked **`VERIFIED SOURCE`**. That mark is **not** SEDMC compliance evidence.

| Evidence ID | Related LA | Required evidence | Current status | Existing repository path (draft / gap only) |
| --- | --- | --- | --- | --- |
| EV-LA-01 | LA-01 | Controller/establishment determination | **OPEN** | fact pack L1; GC-04 |
| EV-LA-02 | LA-02 | Tanzania PDPA applicability analysis (attested) | **OPEN** | fact pack L2 **draft**; LE-01 |
| EV-LA-03 | LA-03 | Kenya DPA applicability analysis (attested) | **OPEN** | fact pack L3 **draft**; LE-05 |
| EV-LA-04 | LA-04 | GDPR / UK GDPR territorial-scope assessment (attested) | **OPEN** | fact pack L4/L5; LE-06/LE-07 |
| EV-LA-05 | LA-05 | Data-subject jurisdiction census | **OPEN** | fact pack L8; GC-14 |
| EV-LA-06 | LA-06 | Production placement rule by data class | **OPEN** | workplan E1.1; legal-placement matrix **NOT APPROVED** |
| EV-LA-07 | LA-07 | Backup placement rule | **OPEN** | E1.2; LE-08; ADR-0011 product TBD |
| EV-LA-08 | LA-08 | DR replica placement rule | **OPEN** | E1.3; LE-09 |
| EV-LA-09 | LA-09 | Warm-standby in-scope + placement rule | **OPEN** | E1.4; LE-10; GC-03/GC-08 |
| EV-LA-10 | LA-10 | Cross-border safeguard necessity determination | **OPEN** | E1.7; L9–L10; LE-03 |
| EV-LA-11 | LA-11 | Transfer instrument / permit determination | **OPEN** | E1.13; L10 — **no SCCs/permits cited** |
| EV-LA-12 | LA-12 | Restricted geography rules | **OPEN** | E1.5; L13 |
| EV-LA-13 | LA-13 | Highly Restricted default + primary jurisdiction | **OPEN** | E1.6; legal-placement §7 |
| EV-LA-14 | LA-14 | Restricted+ failover rules | **OPEN** | L14; GC-07 |
| EV-LA-15 | LA-15 | Subprocessor review standard (and later schedules) | **OPEN** | E1.12; LE-12; **no candidate offering** |
| EV-LA-16 | LA-16 | Support-access country rules | **OPEN** | E1.8; LE-11 |
| EV-LA-17 | LA-17 | Telemetry / IdP / edge / email destination rules | **OPEN** | E1.9–E1.11; ADR-0012; ADR-0013 |
| EV-EA-01–EA-10 | Framework sources | Official Tanzania PDPC, Kenya ODPC, EU GDPR, UK ICO texts/pages | **`VERIFIED SOURCE`** (URL registered) — **not** SEDMC compliance | [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §2 |
| EV-PROPOSED-COUNSEL | LA-01–LA-17; L-01–L-17 | Proposed counsel-style determinations adopted by Legal Counsel | **ADOPTED** as category **D** supporting category **E** (Legal Counsel only) | [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) |
| EV-LC-ATTESTATION | LA-01–LA-17; L-01–L-17 | Legal Counsel identity, confirmation, and determinations | **RECORDED** — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N. **Not** DPO; **not** factual verification of missing artefacts | This instrument §3, §7, §7A |

SEDMC registration, DPO appointment, contracts, providers, regions, transfer permits, DPIA, and Production architecture remain **`NOT VERIFIED`**. Legal Counsel confirmation does **not** change that classification.

Do not fabricate evidence documents. Human-supplied artefacts should be referenced in Supporting evidence fields when they exist.

---

## 9. E1-C01 COMPLETION CRITERIA

This instrument distinguishes Legal Counsel from DPO. Combined Legal/DPO completion is **not** automatic when only Legal Counsel has attested.

| Criterion | Status after this recording |
| --- | --- |
| LA-01–LA-17 reviewed by Legal Counsel | **Yes** — THOMAS NGULUMA |
| Determination recorded per LA item | **Yes** — **APPROVED / CONFIRMED** (CONFIRMED/ADOPTED with conditions) |
| Supporting evidence identified | **Partial** — legal position referenced; factual/external artefacts remain missing |
| Conditions recorded | **Yes** |
| Legal Counsel attestor identity recorded | **Yes** |
| Review date recorded | **Yes** — 15TH SEPTEMBER 2026 |
| Unresolved matters identified | **Yes** — DPO not established; architecture deferred; factual/external evidence missing |
| DPO determination recorded | **No** |
| Blank item treated as approval | **Forbidden** (still) |

**`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**

This is **not** `E1-C01 = COMPLETE`. DPO determination is not established. Remaining mandatory evidence (entity extract, PDPC registration, DPO appointment, contracts, providers, transfer instruments, Production architecture, DPIA, retention periods, tested breach process) remains missing.

The proposed counsel-style determinations do **not** themselves complete E1-C01. Legal Counsel adoption of those determinations completes the **Legal Counsel** component only.

---

## 10. DOWNSTREAM EFFECT

Completing E1-C01, even when genuinely done later by a human, does **not** automatically authorize:

- provider selection;
- region selection;
- cloud procurement;
- infrastructure provisioning;
- Production PostgreSQL;
- Production backup;
- Production DR;
- migrations;
- cutover;
- UAT;
- Production deployment.

Those remain separate governance gates (E1-C02 onward; Authorizations D–G; Gate C item 5; ADR-0011/0012/0013).

**Next action (current):** collect remaining factual/external evidence per [`adr-0006-e1-c01-evidence-collection-queue.md`](adr-0006-e1-c01-evidence-collection-queue.md), starting with the legal-entity extract and PDPC registration status. DPO evidence if/when appointed. Architecture remains unselected. Do **not** treat Tanzania preference as jurisdiction approval. Do **not** treat Legal Counsel confirmation as Production authorization, UAT authorization, PDPC registration, DPO appointment, or transfer-permit completion.

After combined Legal/DPO and remaining evidence gaps are genuinely closed, the **next** governed action must be taken from remaining E1 evidence gaps (evidence-closure register E1-C02–E1-C08), **not** assumed in advance by this file.

---

## 11. AUTHORIZATION BOUNDARY

- E1 owner decision: **NOT RECORDED**
- Hosting provider / region / backup / DR / warm-standby selection: **NOT AUTHORIZED**
- Infrastructure provisioning: **NOT AUTHORIZED**
- Production PostgreSQL / backup deployment / migration / cutover / UAT / Production deployment: **NOT AUTHORIZED**
- Legal advice from Cursor: **NOT PROVIDED**

**Database contacted: NO**  
**External/cloud services contacted: NO**  
**Technical files changed: NONE** (this task)

Operator identity: **REQUIRES HUMAN**

---

## 12. GOVERNANCE POINTER

Navigation pointers: this instrument; company positions in [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md); proposed counsel-style determinations in [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md); post-attestation audit in [`adr-0006-e1-c01-post-attestation-reconciliation-audit.md`](adr-0006-e1-c01-post-attestation-reconciliation-audit.md).

Legal Counsel: THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N.  
DPO: **NOT ESTABLISHED**.  
E1: **NOT APPROVED / BLOCKED BY MISSING EVIDENCE**.  
Production: **NOT AUTHORIZED**.  
UAT: **NOT AUTHORIZED**.

**STOP.**
