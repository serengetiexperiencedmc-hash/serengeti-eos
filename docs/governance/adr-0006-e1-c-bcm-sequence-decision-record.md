# E1-C — BCM Sequence Decision Record (CD-01)

> **`ADDITIVE 2026-09-17 OWNER DECISION: CD-01 CLOSED / S2 FORMALLY CONFIRMED BY PATRICK MAKUNDI, OWNER, PDM — TECHNICAL RTO/RPO NOT DEMONSTRATED`**  
> **`STATUS: OPEN / DECISION REQUIRED`** *(original; superseded by §15)*  
> **`DO NOT SELECT BETWEEN S1 AND S2`** *(original preparation instruction; superseded by §15)*  
> **`ADDITIVE 2026-09-17: A PROVISIONAL S2 COMPANY DIRECTION EXISTS IN adr-0006-e1-c-provisional-bcm-direction-record.md — THAT IS NOT FORMAL APPROVAL AND DOES NOT CLOSE THIS FILE`** *(retained; later superseded by §15)*  
> **`OWNER PACK “CHANGED” / “ALREADY RECONCILED” DOES NOT CLOSE CD-01`**  
> **`NO SIGNATURE FABRICATED`** · **`NO FINAL RECOVERY ORDER INVENTED`** *(wet-ink image still not fabricated)*

**Date:** 2026-09-17.  
**Related:** GAP-REC-03; HUM-07; CD-01 in [`adr-0006-e1-b-company-response-human-required-register.md`](adr-0006-e1-b-company-response-human-required-register.md).  
**Investigation (not this record):** [`adr-0006-e1-c-bcm-sequence-reconciliation-required.md`](adr-0006-e1-c-bcm-sequence-reconciliation-required.md).

This file is the **decision record template and current-state record**. It does **not** resolve CD-01. It does **not** rewrite historical BCM artefacts.

---

## 1. Existing S1

**Five-step numbered recovery sequence** (Programme Building **not** a numbered step):

1. Commercial  
2. Finance  
3. Operations  
4. CRM  
5. Procurement/Suppliers  

Programme Building **depends on** Finance and Suppliers.

This is also the **previously supplied business recovery order** restated for E1-C. That restatement is **historical/session evidence**, **not** a new Owner signature and **not** a silent selection of S1.

---

## 2. Existing S2

**Six-step numbered recovery sequence** recorded as Owner-pack “final” / **CHANGED**:

1. Commercial / RFP intake  
2. Programme Building  
3. Operations  
4. CRM  
5. Finance  
6. Procurement / Suppliers  

Commercial and Programme Building recorded as **jointly critical**. Programme Building depends on Finance and Suppliers **while Finance recovers at position 5**.

---

## 3. Exact source artefact for each sequence

| Sequence | Source artefact | What the source says |
| --- | --- | --- |
| **S1** | [`adr-0006-e1-b-company-response-to-provider-rfi-rfq.md`](adr-0006-e1-b-company-response-to-provider-rfi-rfq.md) company baseline: “Recovery sequence (this session — see condition)” | `1 Commercial · 2 Finance · 3 Operations · 4 CRM · 5 Procurement/Suppliers. Programme Building depends on Finance and Suppliers.` Explicitly does **not** overwrite the prior BCM pack. |
| **S1 (CD-01 left side)** | [`adr-0006-e1-b-company-response-human-required-register.md`](adr-0006-e1-b-company-response-human-required-register.md) row CD-01 | Reconcile this session’s sequence with the prior BCM pack. Status: **COMPANY DECISION**. Prior pack **not rewritten**. Does **not** block RFI issuance. |
| **S1 (historical Owner five-step, preserved)** | [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) Priority 7 “Historical Owner sequence (fact pack O8; not erased)” | Same five-step list as S1. Marked **historical, not erased**. |
| **S2** | Same Owner pack, Priority 7 “Owner-authorized sequence” | Decision: **CHANGED**. Six-step list above. Related gap `GC-02`. Named signature **not fabricated**. |
| **S2 dependencies** | Same Owner pack, Priority 8 | Programme Building immediately dependent on Commercial inputs and also on Finance and Suppliers; Finance sequence position **5**; Suppliers position **6**. |

The Owner pack still prints the historical five-step list **and** the CHANGED six-step list. Printing both is **not** a later CD-01 closure.

---

## 4. Differences

| Topic | S1 | S2 |
| --- | --- | --- |
| Number of numbered steps | 5 | 6 |
| Programme Building | Dependency; **not** numbered | **Step 2** |
| Finance | **Step 2** | **Step 5** |
| Operations | Step 3 | Step 3 |
| CRM | Step 4 | Step 4 |
| Procurement/Suppliers | Step 5 | Step 6 |
| Joint criticality | Not stated as jointly critical on the five-step list. Company-response critical function: Sales & Marketing / Commercial and CRM | Commercial / Programme Building **jointly critical** |
| Commercial | Step 1 in both | Step 1 (RFP intake) |
| Finance vs Programme Building order | Finance recovers **before** Programme Building would be exercised as a numbered function | Programme Building recovers **before** Finance |

---

## 5. Why the difference is substantive

Finance-before-Programme-Building (S1) versus Programme-Building-before-Finance (S2) changes:

- which function is treated as a **numbered recovery object**;
- how the ≤3 hour critical / ≤4 hour overall **business** windows are packaged;
- who is restored when (operational RACI);
- test order for recovery validation.

Both texts can say “Programme Building depends on Finance” and still **disagree** on **when Finance is recovered**. That is a real contradiction, not a wording quibble.

---

## 6. Requirements that depend on the sequence

| Requirement | Why the sequence matters |
| --- | --- |
| Recovery design / runbook order | Functions cannot be restored in two incompatible orders |
| Operational RACI (HUM-08 / GAP-OPS-01) | On-call and restore owners attach to a sequence |
| Recovery testing (E1-C recovery validation plan) | Test packaging follows the governing order |
| Critical-function packaging | Jointly critical Commercial+Programme Building vs Commercial-first five-step list |
| Timebox within business RTO | Same 3h/4h targets; different allocation across functions |
| Supplier/Finance restoration relative to Programme Building | Dependency **agreed**; recovery **position** not agreed |

Business RTO magnitudes (critical ≤3 hours; overall ≤4 hours) and zero tolerated **business** data loss are **agreed** across sources. They are **not** technical RPO=0. They do **not** resolve CD-01.

---

## 7. Whether Programme Building is a separate recovery function or a dependency within Commercial

**UNRESOLVED — HUMAN DECISION REQUIRED.**

| Interpretation | Supported by |
| --- | --- |
| **Dependency (not a numbered recovery function)** | S1 numbering; company-response session list |
| **Separate numbered recovery function (step 2), jointly critical with Commercial** | S2 Owner-pack CHANGED sequence |

This record does **not** choose.

---

## 8. Whether Finance must precede Programme Building

**UNRESOLVED — HUMAN DECISION REQUIRED.**

| Interpretation | Supported by |
| --- | --- |
| **Yes — Finance is numbered step 2; Programme Building is not numbered** | S1 |
| **No — Programme Building is step 2; Finance is step 5**, even though Programme Building **depends on** Finance | S2 |

This record does **not** choose.

---

## 9. Whether Programme Building is dependent on Finance and Suppliers

**AGREED AS A DEPENDENCY STATEMENT** in both S1 and S2 / Priority 8.

**NOT AGREED** is the **recovery order** of those dependencies.

Do not convert the agreed dependency into a silent choice of S1 or S2.

---

## 10. Consequences of each interpretation (descriptive only)

### If S1 were later authorized as governing

- Recovery packaging would restore Finance immediately after Commercial, then Operations, CRM, then Procurement/Suppliers.
- Programme Building would be treated as something that **depends on** Finance and Suppliers rather than a numbered step 2.
- Owner-pack six-step “CHANGED” sequence would need an explicit later supersession (not performed here).

### If S2 were later authorized as governing

- Recovery packaging would restore Programme Building immediately after Commercial/RFP, then Operations, CRM, then Finance, then Procurement/Suppliers.
- Joint criticality of Commercial / Programme Building would govern critical-window packaging.
- Finance would recover **after** CRM despite remaining a stated dependency of Programme Building — a tension the Owner pack already records and that CD-01 later reopened.
- Company-response five-step session list would need an explicit later supersession (not performed here).

### If a new dated sequence were later authorized

- S1 and S2 would remain historical evidence.
- The new document would have to cite both and state what governs.

**None of these outcomes is selected here.**

---

## 11. Exact human decision required

A competent Owner/company human must record, in a dated instrument:

1. Which sequence **governs** for Production BCM packaging: **S1**, **S2**, or a **new dated sequence** written out in full.  
2. Which artefact is authoritative: Owner pack, company-response, or the new instrument.  
3. Whether Programme Building is a **numbered recovery function** or a **dependency**.  
4. Whether Finance recovers **before** or **after** Programme Building.  
5. That the decision is **not** inferred from the Owner pack’s “CHANGED” or “already reconciled” wording alone, because CD-01 was opened **after** that wording.

Do **not** fabricate a signature, date of approval, or attestor name.

---

## 12. Decision owner

Named person: **OWNER NOT ESTABLISHED**.

Repository references an Owner BCM decision pack and a later company-response CD-01. Neither records a named human signature that closes CD-01 after the company-response session.

Legal Counsel (**THOMAS NGULUMA**) is **not** the BCM sequence decision owner by virtue of the Legal Counsel attestation.

---

## 13. Current status

**OPEN / DECISION REQUIRED.**

CD-01 remains open. S1 and S2 remain distinguishable. This sprint does **not** mark the decision resolved.

---

## 14. Additive — 2026-09-17 provisional company direction (not a rewrite of §§1–13)

A later governance session recorded a **provisional** S2 direction in [`adr-0006-e1-c-provisional-bcm-direction-record.md`](adr-0006-e1-c-provisional-bcm-direction-record.md): **`PROVISIONAL COMPANY DIRECTION — PENDING FORMAL HUMAN CONFIRMATION`**.

That direction does **not** close this record. Status remains **`OPEN — FORMAL HUMAN CONFIRMATION REQUIRED`**. S1 remains the retained alternative. Do **not** read this file as “S2 formally approved.” *(status of the provisional-direction session)*

---

## 15. Additive — 2026-09-17 formal owner confirmation (not a rewrite of §§1–14)

Governing instrument: [`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md).

**Patrick Makundi**, Owner, signature notation **PDM**, decision date **2026-09-17**, formally confirmed **S2** as the governing BCM / recovery-priority sequence:

`Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers`

| Field | Status |
| --- | --- |
| CD-01 | **CLOSED / FORMALLY CONFIRMED** |
| HUM-07 | **CLOSED / FORMALLY CONFIRMED** |
| Selected sequence | **S2** |
| S1 | Preserved as previously considered alternative — **not selected** |
| Technical RTO/RPO | **NOT DEMONSTRATED** — this is not a tested recovery-objective claim |

Historical sections §§1–14 remain the investigation and provisional-direction record. They are **not** rewritten. Owner-pack “CHANGED” wording remains **not** the closing instrument; this §15 / owner decision record is.
