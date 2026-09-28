# E1-B4.5 — Provider Shortlist / Qualification Gate

> **`E1-B4.5 QUALIFICATION GATE COMPLETE — 9 FULL-RFI CANDIDATES / 2 SCOPE CLARIFICATION / 1 HOLD.`**  
> **`QUALIFICATION ≠ SUITABILITY`** · **`QUALIFICATION ≠ PROVIDER SELECTION`** · **`QUALIFICATION ≠ ARCHITECTURE SELECTION`**  
> **`NO RANKING`** · **`NO SCORING`** · **`NO PREFERRED PROVIDER`** · **`NO WINNING ARCHITECTURE`**  
> **`NOT PRODUCTION`** · **`NOT UAT`** · **`NOT MIGRATION`** · **`NOT DEPLOYMENT`** · **`NOT CONTRACTING`**  
> **`NO PROVIDER CONTACTED`** · **`NO RFI TRANSMITTED`**  
> **`E1-B4 UNIVERSE UNMODIFIED`** · **`FROZEN RFI / PE / TEMPLATE UNMODIFIED`**  
> **`E1-B5 AUTHORIZATION UNMODIFIED`**  
> **`ORIGINAL E1-B5 INITIAL_RFI_SEND_SET (11) IS NOT THE CURRENT TRANSMISSION INSTRUCTION`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**

---

## 1. Title and document control

| Field | Value |
| --- | --- |
| Document | E1-B4.5 Provider Shortlist / Qualification Gate |
| Path | `docs/governance/adr-0006-e1-b4-5-provider-shortlist-qualification-gate.md` |
| Gate date | 2026-09-17 |
| Company-provided legal name | Makundi Serengeti Experience DMC — authoritative registry evidence pending |
| Universe source (unmodified) | [`adr-0006-e1-b4-provider-candidate-universe.md`](adr-0006-e1-b4-provider-candidate-universe.md) |
| Universe audit (unmodified) | [`adr-0006-e1-b4-provider-candidate-universe-audit.md`](adr-0006-e1-b4-provider-candidate-universe-audit.md) |
| Issuance authorization (unmodified) | [`adr-0006-e1-b-external-issuance-authorization.md`](adr-0006-e1-b-external-issuance-authorization.md) |
| Frozen questionnaire (unmodified) | [`adr-0006-e1-b-provider-neutral-rfi-rfq.md`](adr-0006-e1-b-provider-neutral-rfi-rfq.md) |
| Frozen PE pack (unmodified) | [`adr-0006-e1-b-provider-evidence-requirements.md`](adr-0006-e1-b-provider-evidence-requirements.md) |
| Frozen response template (unmodified) | [`adr-0006-e1-b-standard-provider-response-template.md`](adr-0006-e1-b-standard-provider-response-template.md) |
| E1-B3 status | FRAMEWORK PREPARED — NO PROVIDER RESPONSE RECEIVED |
| This gate | Qualification / shortlist gate only |

This file does **not** send the RFI/RFQ, contact a provider, create a vendor account, ingest evidence, score or rank candidates, select a provider, select an architecture, or authorize Production, UAT, migration, deployment, or infrastructure provisioning.

---

## 2. Purpose

Determine which members of the existing E1-B4 12-provider candidate universe have **sufficient preliminary architectural relevance** to justify receiving the **full** 168-question RFI/RFQ and PE-01–PE-48 evidence request.

Passing this gate means **only**:

**qualifies for full evidence request.**

It does **not** mean the provider satisfies EOS Production requirements. Provider suitability remains **unverified** until the provider responds and evidence is independently evaluated under E1-B3.

---

## 3. Governance status

| Item | Status |
| --- | --- |
| E1-B4.5 | **QUALIFICATION GATE COMPLETE** |
| E1-B | EXTERNAL ISSUANCE AUTHORIZED — INFORMATION GATHERING ONLY (authorization file unmodified) |
| Actual RFI transmission | **NOT PERFORMED** by this gate |
| E1-B5 INITIAL_RFI_SEND_SET (11) | **Not** the current transmission instruction after this gate |
| Provider selected | **None** |
| Architecture selected | **None** |
| Preferred provider named | **None** |
| Ranking / scoring | **None** |
| Production / UAT / migration / deployment | **NOT AUTHORIZED** |
| ADR-0006 | OPEN |
| DP-0006 | OPEN |
| Tanzania | PREFERRED BASELINE ONLY — not an approved Production location |

---

## 4. Relationship to E1-B4, E1-B5 and E1-B3

| Artefact | Relationship |
| --- | --- |
| **E1-B4** | Source universe. All 12 CU-IDs are preserved exactly. E1-B4 source data is **not** rewritten. Inclusion in the universe is **not** qualification for the full RFI. |
| **E1-B4.5 (this file)** | Qualification gate applied to that universe. Output is eligibility for a **full** evidence request, or a requirement for scope clarification, or HOLD. |
| **E1-B5** | Issuance authorization and frozen package remain in force as information-gathering authorization. The **original 11-member INITIAL_RFI_SEND_SET is not the current transmission instruction**. Routing/transmission documents require a **separate governed reconciliation** before any send. |
| **E1-B3** | Evaluation framework remains prepared. No provider response is received. This gate does not open intake, assign evidence IDs, score, or verify suitability. |

E1-B4 recorded that the universe was **not** a shortlist. This gate is the **first** controlled shortlist/qualification step. Shortlist here means **full-RFI eligibility**, not selection.

---

## 5. Qualification criteria Q1–Q6

Applied **without scoring**. Outcomes used: **PASS** (preliminary relevance only), **CONDITIONAL** (scope clarification required before full RFI), **HOLD** (full RFI not opened).

No numeric score, weight, or rank is assigned.

| ID | Criterion | Meaning |
| --- | --- | --- |
| **Q1** | Relevant infrastructure model | Provider plausibly offers infrastructure relevant to EOS Production. |
| **Q2** | Durable workload plausibility | There is a credible path to hosting the PostgreSQL-based EOS Production system and associated application infrastructure. |
| **Q3** | Relevant geography/residency model | Provider offers a geography or infrastructure model materially relevant to SEDMC’s Tanzania / Africa / EU residency questions. |
| **Q4** | Recovery/security evidence potential | Provider is sufficiently relevant that backup, PITR, DR, security, support and related evidence can reasonably be requested and evaluated. |
| **Q5** | Material architectural relevance | Provider contributes a materially distinct infrastructure/hosting proposition that should not be dismissed without evidence. |
| **Q6** | Official response route | There is an identifiable official route through which the RFI could be submitted. |

**PASS on Q1–Q6 is not satisfaction of the requirement.** It is only enough preliminary relevance to ask the full questions.

---

## 6. Exact 12-provider universe

Copied from E1-B4 CU-IDs and the class tags specified for this gate. Class tags are **potential relevance from E1-B4**, not architecture selection. Order is CU-ID order, **not** a rank.

| CU-ID | Organization | Class tag(s) for this gate |
| --- | --- | --- |
| CU-01 | Africa Data Centres | D |
| CU-02 | Amazon Web Services | A / B / D |
| CU-03 | Google Cloud | A / B / D |
| CU-04 | Hetzner Online | B |
| CU-05 | Liquid C2 (Liquid Intelligent Technologies) | D |
| CU-06 | Microsoft Azure | A / B / D |
| CU-07 | Oracle Cloud Infrastructure | A / B / D |
| CU-08 | OVHcloud | B |
| CU-09 | Raxio Group | C |
| CU-10 | SEACOM Limited | C |
| CU-11 | WIA | C |
| CU-12 | Wingu Africa | C / D |

**Universe total: 12.** No CU-ID added, removed, merged, or renamed.

Architecture classes (not ranked; no class is stated as better than another):

| Class | Meaning |
| --- | --- |
| A | African managed cloud |
| B | EU/EEA managed cloud |
| C | Tanzania-controlled colocation / local infrastructure |
| D | Hybrid |

Africa ≠ Tanzania. A South Africa region or Kenya facility does **not** establish Tanzania Production residency.

---

## 7. Qualification results

| CU-ID | Organization | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Gate result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CU-01 | Africa Data Centres | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-02 | Amazon Web Services | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-03 | Google Cloud | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-04 | Hetzner Online | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-05 | Liquid C2 (Liquid Intelligent Technologies) | HOLD | HOLD | HOLD | HOLD | HOLD | HOLD | **HOLD — SCOPE CLARIFICATION** |
| CU-06 | Microsoft Azure | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-07 | Oracle Cloud Infrastructure | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-08 | OVHcloud | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-09 | Raxio Group | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |
| CU-10 | SEACOM Limited | CONDITIONAL | CONDITIONAL | PASS | CONDITIONAL | PASS | PASS | **CONDITIONAL QUALIFICATION — SCOPE CLARIFICATION REQUIRED BEFORE FULL RFI** |
| CU-11 | WIA | CONDITIONAL | CONDITIONAL | PASS | CONDITIONAL | PASS | PASS | **CONDITIONAL QUALIFICATION — SCOPE CLARIFICATION REQUIRED BEFORE FULL RFI** |
| CU-12 | Wingu Africa | PASS | PASS | PASS | PASS | PASS | PASS | **FULL RFI QUALIFIED** |

PASS / CONDITIONAL / HOLD in this table are **preliminary-relevance labels only**. They are **not** scores.

| Result class | Count | CU-IDs |
| --- | --- | --- |
| FULL RFI QUALIFIED | **9** | CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-12 |
| CONDITIONAL QUALIFICATION — SCOPE CLARIFICATION REQUIRED BEFORE FULL RFI | **2** | CU-10, CU-11 |
| HOLD — SCOPE CLARIFICATION | **1** | CU-05 |
| Universe | **12** | 9 + 2 + 1 = 12 |

---

## 8. Full-RFI-qualified set

These nine candidates are **eligible for the next controlled RFI-routing/issuance step**. Eligibility is **not** transmission and **not** selection.

1. CU-01 — Africa Data Centres  
2. CU-02 — Amazon Web Services  
3. CU-03 — Google Cloud  
4. CU-04 — Hetzner Online  
5. CU-06 — Microsoft Azure  
6. CU-07 — Oracle Cloud Infrastructure  
7. CU-08 — OVHcloud  
8. CU-09 — Raxio Group  
9. CU-12 — Wingu Africa  

**Total: 9.**

Until E1-B5 routing/transmission documents are formally reconciled by a **separate governed step**, **do not transmit** the RFI to these nine (or to any other provider).

---

## 9. Conditional-qualification set

These two candidates are **not** eligible for the full 168-question RFI/RFQ and PE-01–PE-48 pack until a **narrow scope clarification** is completed.

1. CU-10 — SEACOM Limited  
2. CU-11 — WIA  

**Total: 2.**

Do **not** transmit the full RFI to CU-10 or CU-11 under this gate.

---

## 10. HOLD set

1. CU-05 — Liquid C2 (Liquid Intelligent Technologies)  

**Total: 1.**

Remain **HOLD — SCOPE CLARIFICATION**. Do not create a SEND route. Do not transmit. Do not treat connectivity/cloud-connect relevance as EOS Production hosting scope.

---

## 11. Individual rationale for all 12 candidates

PASS below means **preliminary relevance for a full evidence request**, not verified Production capability.

### CU-01 — Africa Data Centres — FULL RFI QUALIFIED

Qualifies because it represents materially relevant data-centre/hybrid infrastructure. The RFI must establish actual managed hosting, PostgreSQL, backup, DR, security, support and residency capability. **Do not assume these capabilities.**

Q1–Q6: PASS (preliminary relevance). Official route exists (E1-B6: enquiries@africadatacentres.com). Kenya/South Africa facilities in E1-B4 are **not** Tanzania residency.

### CU-02 — Amazon Web Services — FULL RFI QUALIFIED

Qualifies as a major managed-cloud candidate with African and European geographic options. Current official AWS documentation records Africa (Cape Town) and multiple European regions. **This establishes relevance, not suitability.**

Cape Town is not Tanzania. PostgreSQL 16, backup geography, DR, support countries and Tanzania lock remain REQUIRES RFI.

### CU-03 — Google Cloud — FULL RFI QUALIFIED

Qualifies as a major managed-cloud candidate with African and European geographic options. Current official Google Cloud documentation records Johannesburg and multiple European regions. **This establishes relevance, not suitability.**

Johannesburg is not Tanzania. Service availability remains REQUIRES RFI.

### CU-04 — Hetzner Online — FULL RFI QUALIFIED

Qualifies as an EU/EEA managed-hosting/cloud alternative materially distinct from hyperscalers. Full RFI required to establish Production capability.

Class B relevance is not a finding that EU/EEA hosting is selected or legally sufficient.

### CU-05 — Liquid C2 (Liquid Intelligent Technologies) — HOLD — SCOPE CLARIFICATION

Remain HOLD. Existing E1-B4 evidence establishes connectivity/cloud-connect relevance but does **not** sufficiently establish equivalent EOS Production hosting scope. Require scope clarification before considering full RFI.

Q1–Q6: HOLD for full-RFI purposes. No SEND route is assigned.

### CU-06 — Microsoft Azure — FULL RFI QUALIFIED

Qualifies as a major managed-cloud candidate with African and European geography. Current Microsoft documentation lists South Africa regions and European regions. **This establishes relevance, not suitability.**

South Africa is not Tanzania. Restricted-region and service-availability facts remain REQUIRES RFI.

### CU-07 — Oracle Cloud Infrastructure — FULL RFI QUALIFIED

Qualifies as a major managed-cloud/hybrid candidate with an established Johannesburg region and broader sovereignty/dedicated-cloud capabilities. **Do not treat public claims as verified Production suitability.**

E1-B4 records Kenya as coming soon on Oracle’s public-cloud-regions page — **not** treated as live. No Tanzania region cited.

### CU-08 — OVHcloud — FULL RFI QUALIFIED

Qualifies as a European cloud/hosting alternative materially distinct from hyperscalers.

Class B relevance is not selection of EU/EEA hosting. Full RFI required for Production capability, PostgreSQL, backup/PITR/DR, security and support.

### CU-09 — Raxio Group — FULL RFI QUALIFIED

Qualifies as a Tanzania/local data-centre candidate. Existing E1-B4 evidence records TZ1 as **“Launching 2026” / “Coming soon”**; **do NOT represent it as operational.** Full RFI should establish actual availability, managed hosting, PostgreSQL, connectivity, backup, DR, security, support and residency.

Q2 PASS is **announced-facility plausibility only**, not live capacity.

### CU-10 — SEACOM Limited — CONDITIONAL QUALIFICATION — SCOPE CLARIFICATION REQUIRED BEFORE FULL RFI

Conditional qualification only. Existing evidence establishes strong African enterprise/connectivity relevance but does **not** yet sufficiently establish the exact Production hosting/managed-infrastructure scope required for the full EOS RFI. Require a **narrow scope clarification** before transmitting the full RFI.

Q3 PASS reflects Tanzania/Africa geographic relevance (including published Tanzania presence). Q1/Q2/Q4 remain CONDITIONAL because EOS-class hosting/managed PostgreSQL/backup/DR scope is not sufficiently established. Q5 PASS means the proposition should not be dismissed without that clarification. Q6 PASS means an official route is identifiable; it is **not** authorization to send the full pack.

Do not treat CLS as proven EOS Production hosting. Do not transmit the full RFI under this gate.

### CU-11 — WIA — CONDITIONAL QUALIFICATION — SCOPE CLARIFICATION REQUIRED BEFORE FULL RFI

Conditional qualification only. Existing evidence establishes Tanzania/African infrastructure relevance but does **not** yet sufficiently establish the exact Production hosting/managed-infrastructure scope required for the full EOS RFI. Require a **narrow scope clarification** before transmitting the full RFI.

E1-B4 records a Tanzania colo self-description; colo ≠ managed PostgreSQL / EOS Production hosting. Q1/Q2/Q4 CONDITIONAL. Q3 and Q5 PASS for geographic/architectural relevance pending clarification. Q6 PASS (identifiable official route) is not a send.

### CU-12 — Wingu Africa — FULL RFI QUALIFIED

Qualifies as a Tanzania/African infrastructure and hybrid candidate. Full RFI required to establish actual EOS Production capability.

Public Tanzania facility/self-description is relevance, not verified managed hosting, PostgreSQL, backup, DR, security, or support.

---

## 12. Evidence limitations

| Limitation | Record |
| --- | --- |
| Public geography / region lists | Relevance only. Not SEDMC suitability. |
| Africa ≠ Tanzania | South Africa and Kenya locations do not establish Tanzania Production residency. |
| CU-09 TZ1 | “Launching 2026” / “Coming soon” — **not** operational proof. |
| Provider marketing / self-description | Not independently verified Production capability. |
| Q1–Q6 PASS | Not requirement satisfaction. |
| Provider responses received | **0** |
| Independent E1-B3 verification | **Not started** — no response to evaluate. |
| Fabricated capabilities | **None.** Unknowns remain REQUIRES RFI or scope clarification. |
| Official route (Q6) | Identifiable channel only. **Not** evidence of transmission. |

This gate does **not** create provider capability findings beyond the preliminary-relevance rationales above.

---

## 13. Explicit non-selection statement

This qualification gate:

- does **not** select a provider;
- does **not** select an architecture;
- does **not** rank providers;
- does **not** score providers;
- does **not** name a preferred provider;
- does **not** recommend a winning architecture;
- does **not** authorize Production, UAT, migration, deployment, infrastructure provisioning, or database migration;
- does **not** constitute contracting or a commitment to any candidate;
- does **not** transmit the RFI or contact any provider.

The nine FULL RFI QUALIFIED candidates are **not** a preferred set. They are the set with sufficient preliminary relevance to receive the **same** frozen 168-question pack **after** a separate routing reconciliation. Equal pack ≠ equal ranking.

---

## 14. Consequences for E1-B5 transmission

The original E1-B5 **INITIAL_RFI_SEND_SET of 11** (CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-10, CU-11, CU-12) **must not** be treated as the current transmission instruction after this gate.

| Candidate | After this gate |
| --- | --- |
| CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-12 | Eligible for the **next controlled RFI-routing/issuance step** (full pack). **Not transmitted.** |
| CU-10 SEACOM Limited | Full RFI **not** authorized until narrow scope clarification. |
| CU-11 WIA | Full RFI **not** authorized until narrow scope clarification. |
| CU-05 Liquid C2 | **HOLD** — not a full-RFI candidate. |

Until E1-B5 routing/transmission documents are **formally reconciled by a separate governed step**:

- do **not** transmit the RFI to any provider;
- do **not** change frozen questionnaire / PE / template files;
- do **not** fabricate transmission evidence;
- do **not** treat the Reservations Consultant execution checklist’s 11-row SEND tracker as the current send instruction.

E1-B5 **authorization** (information-gathering only) is **unchanged**. This gate narrows **who may receive the full pack**, subject to that later routing reconciliation. It does not itself issue, send, or amend the authorization record.

Current issuance/transmission state remains **PACKAGE READY / NOT SENT** with **0 / 11** (and now **0 / 9** full-RFI-eligible) actual transmissions evidenced.

---

## 15. Next controlled actions

1. **Separate governed step:** reconcile E1-B5 routing / transmission-control documents to this gate so the full-RFI-eligible set is CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-12 — and so CU-10 and CU-11 are not treated as full-pack SEND targets. **Not performed by this document.**
2. **Do not transmit** until that reconciliation is complete.
3. Design a **narrow scope-clarification** request for CU-10 SEACOM and CU-11 WIA (not the full 168-question pack) under a later governed instruction. **Not performed here. Not a contact.**
4. Keep CU-05 Liquid C2 on **HOLD — SCOPE CLARIFICATION**.
5. Do **not** open E1-B3 intake until an actual provider response exists.
6. Do **not** score, rank, select provider, select architecture, or authorize Production/UAT/migration/deployment.

---

## 16. Audit checklist

| Check | Result |
| --- | --- |
| Exact 12 candidates | **YES** — CU-01 through CU-12 |
| Exact 9 FULL RFI | **YES** — CU-01, CU-02, CU-03, CU-04, CU-06, CU-07, CU-08, CU-09, CU-12 |
| Exact 2 CONDITIONAL | **YES** — CU-10, CU-11 |
| Exact 1 HOLD | **YES** — CU-05 |
| 9 + 2 + 1 = 12 | **YES** |
| Original CU-IDs preserved exactly | **YES** |
| Provider ranked | **NO** |
| Score assigned | **NO** |
| Provider selected | **NO** |
| Architecture selected | **NO** |
| Preferred provider named | **NO** |
| Frozen RFI modified | **NO** |
| PE-01–PE-48 modified | **NO** |
| Standard response template modified | **NO** |
| E1-B4 candidate-universe source data modified | **NO** |
| E1-B5 authorization silently changed | **NO** |
| External transmission occurred | **NO** |
| Provider contact occurred | **NO** |
| Transmission evidence fabricated | **NO** |
| Capabilities invented | **NO** |

Frozen hashes (identity check; files not altered by this gate):

| File | SHA-256 |
| --- | --- |
| Questionnaire | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` |
| PE pack | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` |
| Response template | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` |

---

## 17. Decision / status statement

**E1-B4.5 QUALIFICATION GATE COMPLETE — 9 FULL-RFI CANDIDATES / 2 SCOPE CLARIFICATION / 1 HOLD.**

Qualification means only that a candidate may receive the full evidence request after a separate routing reconciliation. It does not mean the provider satisfies the requirements.

Provider suitability remains unverified.

No RFI was transmitted by this gate.
