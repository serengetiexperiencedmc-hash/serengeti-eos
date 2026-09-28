# E-06 — Factual Controller / Processor Role Matrix (Phase 1)

> **`E1-C01 PHASE 1 INTERNAL EVIDENCE`**  
> **`STATUS: PARTIALLY EVIDENCED` / `DRAFT` / `REQUIRES HUMAN REVIEW`**  
> **`LEGAL DETERMINATION: PENDING HUMAN/DPO/LEGAL DETERMINATION` on every row**  
> **`E1-C01: INCOMPLETE`** · **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION: NOT AUTHORIZED`** · **`UAT: NOT AUTHORIZED`**

This document records **factual processing relationships** inferred from EOS functionality and SEDMC company positions. It does **not** determine legal controller/processor/joint-controller status.

Do **not** treat company position LA-04 or AI counsel analysis as a legal role conclusion.

---

## 1. Method

For each activity:

- **SEDMC role candidate** = factual description of what SEDMC appears to do (who runs EOS, who decides commercial purposes).
- **Client role candidate** = what a client organisation appears to do.
- **Vendor role candidate** = what a technology/service provider would do **if** engaged. Production vendors are **NOT SELECTED**.
- **Actual instructions?** = whether a documented instruction/DPA exists in this repository (**None found**).
- **Who determines purpose / means?** = factual observation, not a legal test result.
- **Legal determination** = always **`PENDING HUMAN/DPO/LEGAL DETERMINATION`**.

Evidence quality: FACT (system behaviour), COMPANY POSITION (LA-01/LA-04), DESIGN INTENT (hosting), AI COUNSEL ANALYSIS (not copied as determination).

---

## 2. Matrix

| Processing activity | SEDMC role candidate (factual) | Client role candidate (factual) | Vendor role candidate (factual) | Actual instructions? | Who determines purpose? (factual) | Who determines means? (factual) | Evidence | Legal determination |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEDMC CRM / contact management | Operates EOS CRM; staff enter and use contact records for SEDMC’s commercial pipeline | May supply contact details of their employees/agents when requesting services | Hosting/DB/email **not selected**; would process CRM data if used as infrastructure | **None evidenced** in repository | SEDMC determines CRM as a business system (COMPANY POSITION LA-01; FACT: C1 implemented) | SEDMC currently determines Dev/Test means; Production means **NOT SELECTED** | E-04 P-CRM-*; `004_c1_crm.sql`; company LA-01 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| RFP processing | Captures RFPs to sell and deliver DMC programmes | Issues the commercial request; may specify programme needs | Same infrastructure vendors **not selected** | **None evidenced** | SEDMC uses RFPs for its bidding/delivery process; client defines the trip request commercially | SEDMC designs EOS RFP workflow (FACT: C3); Production hosting means **NOT SELECTED** | E-04 P-RFP-*; `016_c3_rfp.sql` | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Programme management | Builds itinerary in EOS against RFP | May review/approve itinerary commercially (process **outside** EOS not fully evidenced) | Same | **None evidenced** | SEDMC builds programmes as its operational product | SEDMC designs C5; Production means **NOT SELECTED** | E-04 P-PRG-*; `017_c5_programme.sql` | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Supplier / hotel management | Maintains supplier/hotel master data for sourcing | Generally not the operator of this master data | Same | **None evidenced** | SEDMC sources suppliers for delivery | SEDMC | E-04 P-SUP / P-HTL | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Costing / approvals / commercial documents | SEDMC prices, approves, and stores commercial files | Client may receive proposals; may upload specs into documents | Object storage **NOT SELECTED**; Dev local FS | **None evidenced** | SEDMC’s commercial process | SEDMC (app) + unspecified Production storage | E-04 P-CST, P-APR, P-DOC | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Employee / principal data | SEDMC (or a group employer — **entity MISSING**, see E-01) manages user accounts | Not typically the client | Production IdP **NOT SELECTED** (ADR-0013 OPEN) | **None evidenced** (no employment contract pack in repo) | Employer/SEDMC access-control purpose (factual: principals exist for EOS login) | SEDMC Dev local IdP; Production IdP unknown | `schema.sql` principals/credentials; E-01 placeholder | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Client-provided named delegate / traveller information | **Not currently structured in EOS** | Would typically supply lists **if** that process exists outside EOS | n/a in EOS today | **None evidenced** | **Not currently evidenced in EOS** | **Not currently evidenced in EOS** | E-04 P-PRG-03 **`FUTURE / NOT CURRENTLY EVIDENCED`**. Counsel notes processor *possible* **if** facts arise — **not** a present determination | **PENDING HUMAN/DPO/LEGAL DETERMINATION** (and **not currently an EOS structured activity**) |
| Documents (unstructured bytes) | SEDMC stores files users upload | May author or receive files | Object storage vendor **NOT SELECTED** | **None evidenced** | Depends on file and who requested storage — **facts incomplete** | SEDMC chooses DocumentStorage port; Production provider unknown | `119_cd_commercial_documents.sql` | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Email / notifications | SEDMC triggers notifications from EOS | Recipients may be client or staff contacts | Production email provider **NOT SELECTED** | **None evidenced** | SEDMC notification purposes as implemented | Provider would supply send infrastructure **if selected** | I3 templates; E-25 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Hosting / application runtime | SEDMC would be the customer of a host **if selected** | Not the host | Host would operate infrastructure on SEDMC’s behalf **if** engaged as a processor-type vendor — **role not determined** | **None** (no host selected, no DPA) | SEDMC business purposes for running EOS | Production hosting **NOT SELECTED**; means therefore **not fixed** | E-19; ADR-0006 blocked | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Database (PostgreSQL) | SEDMC application SoR intent | Not the DB operator | Managed-PG vendor **NOT SELECTED** | **None** | SEDMC | Production DB location/operator **NOT SELECTED** | E-20; ADR-0006 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Backups | SEDMC recovery intent | Not the backup operator | Backup vendor **NOT SELECTED** | **None** | SEDMC continuity purpose (COMPANY POSITION LA-07) | **NOT SELECTED** | E-22 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Support / admin access | SEDMC and/or vendor support **if** contracted | Unlikely | Foreign admin access possible; COMPANY POSITION LA-16 prefers controls | **None evidenced** | Support purpose would be SEDMC’s operational need if engaged | Vendor tooling unknown | E-29 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |
| Monitoring / logging | SEDMC security/ops intent | Not the monitor | Monitoring vendor **NOT SELECTED** | **None** | SEDMC security/ops | **NOT SELECTED** | E-26 | **PENDING HUMAN/DPO/LEGAL DETERMINATION** |

---

## 3. Factual observations (not legal conclusions)

1. EOS is designed as **SEDMC’s** commercial operating system (COMPANY POSITION LA-01; FACT: product scope). That **tends to look like** SEDMC determining many **purposes**, but Legal/DPO must still decide the legal role per activity and per jurisdiction.
2. No executed DPA, instruction schedule, or joint-controller agreement was found in this repository (**EXTERNAL EVIDENCE MISSING** — E-07).
3. No Production vendor is selected; vendor rows cannot be legally classified yet.
4. Named delegate processing under client instructions is a **hypothesis in AI counsel analysis**, not an evidenced current EOS activity.
5. Employer identity for staff data depends on E-01 (legal entity **MISSING**).

---

## 4. What this matrix does **not** prove

- That SEDMC is legally a controller, processor, or joint controller for any activity.
- That any vendor is a processor or subprocessor.
- That client contracts currently contain privacy instructions.
- Joint-control, independent controllership, or “mere hosting” conclusions.

---

## 5. Human / DPO / Legal questions (do not answer here)

1. For CRM/RFP/programme/supplier activities, is SEDMC controller under each **applicable** law (applicability itself is E-18)?
2. If named delegates are later ingested, does the client contract create a processor relationship?
3. Are any activities joint-control with clients or hotels?
4. Once providers are selected, which are processors vs independent controllers (e.g. some telecom/email facts vary)?

---

## 6. Status

| Field | Value |
| --- | --- |
| Matrix status | **`DRAFT` · `PARTIALLY EVIDENCED`** (facts only) |
| Legal roles | **`PENDING HUMAN/DPO/LEGAL DETERMINATION`** |
| Vendor rows | Incomplete until providers selected |
| Closes E-06? | **No** |
