# E1-C — BCM Recovery Sequence Reconciliation Required (CD-01)

> **`HUMAN DECISION REQUIRED`**  
> **`DO NOT INVENT THE FINAL RECOVERY ORDER`**  
> **`HISTORICAL ARTEFACTS NOT REWRITTEN`**  
> **`NO ARCHITECTURE SELECTED`**

**Date:** 2026-09-17.  
**Related:** GAP-REC-03; CD-01 in [`adr-0006-e1-b-company-response-human-required-register.md`](adr-0006-e1-b-company-response-human-required-register.md).

This file **investigates**. It does **not** close CD-01.

---

## 1. Two written sequences

### Sequence S1 — Company-response / E1-B session (2026-09-17)

Recorded in [`adr-0006-e1-b-company-response-to-provider-rfi-rfq.md`](adr-0006-e1-b-company-response-to-provider-rfi-rfq.md):

1. Commercial  
2. Finance  
3. Operations  
4. CRM  
5. Procurement/Suppliers  

Programme Building **depends on** Finance and Suppliers (not given its own numbered step in that list).

CD-01: reconcile with the prior BCM pack; **prior pack not rewritten**.

This task’s standing business order (as restated for E1-C) remains this **five-step** list unless a human supersedes it. That restatement is **not** a new Owner signature.

### Sequence S2 — Owner BCM decision pack

[`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) Priority 7 records a **CHANGED** “Owner-authorized” six-step sequence:

1. Commercial / RFP intake  
2. Programme Building  
3. Operations  
4. CRM  
5. Finance  
6. Procurement / Suppliers  

It also records Commercial and Programme Building as **jointly critical**, and that Programme Building depends on Finance and Suppliers **while placing Finance at position 5**.

The same pack still prints the historical five-step Owner order (Commercial → Finance → Operations → CRM → Procurement/Suppliers) as **historical, not erased**.

---

## 2. Where they differ

| Topic | S1 (company-response / CD-01 left side) | S2 (Owner pack “final” sequence) | Substantive? |
| --- | --- | --- | --- |
| Number of steps | 5 | 6 | **YES** |
| Programme Building | Dependency, not a numbered recovery step | **Step 2** | **YES** |
| Finance | **Step 2** | **Step 5** | **YES** |
| Operations | Step 3 | Step 3 | Same relative to CRM |
| CRM | Step 4 | Step 4 | Same number, different predecessors |
| Procurement/Suppliers | Step 5 | Step 6 | Position shift |
| Joint criticality | Not stated as jointly critical in the five-step list | Commercial / Programme Building jointly critical | **YES** |

The difference is **substantive**. Finance-before-Programme-Building (S1) vs Programme-Building-before-Finance (S2) changes recovery packaging even if both say Programme Building **depends** on Finance.

---

## 3. Current authority (not a choice of winner)

| Artefact | What it claims | What E1-C may treat |
| --- | --- | --- |
| Owner BCM decision pack | Records an Owner-authorized **CHANGED** six-step sequence | A governing **historical Owner pack**. Not erased. |
| E1-B company-response + CD-01 | Later session recorded five-step order and **explicitly left reconciliation OPEN**; did **not** rewrite the Owner pack | CD-01 remains **COMPANY DECISION REQUIRED** |
| This E1-C file | Investigation only | **Does not** adopt S1 or S2 as the single Production recovery order |

Because CD-01 was opened **after** the Owner pack’s “CHANGED” sequence, the Owner pack’s internal “already reconciled” language **does not close CD-01**. Closing CD-01 by silently treating S2 as current would erase the company-response instruction not to rewrite the pack and not to invent the final order.

---

## 4. Human decision required

**YES.** A competent Owner/company human must state which sequence (or a new dated sequence) **governs** for Production BCM packaging.

Until then:

- Critical RTO ≤3 hours and overall RTO ≤4 hours remain **business** targets (both sources agree on those magnitudes).  
- Zero tolerated business data loss remains a **business** requirement (not technical RPO=0).  
- Commercial remains **first** in both numbered lists.  
- Do **not** implement a recovery runbook that pretends S1 and S2 are the same.

---

## 5. Reconciliation artefact needed

This file **is** the investigation artefact. The **closure** artefact must be a later Owner/company decision record that:

1. cites S1 and S2;  
2. states the governing sequence;  
3. states whether the Owner pack, the company-response, or a new document is authoritative;  
4. does not fabricate a signature.

**CD-01 remains OPEN.**
