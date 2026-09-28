# E1 — Hosting Class Nomenclature Reconciliation (DP-0006 / E1-A)

> **`GOVERNANCE CONSISTENCY ONLY`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`NOT GEOGRAPHY SELECTION`**  
> **`NOT PRODUCTION APPROVAL`** · **`NOT UAT`** · **`NOT MIGRATION`**  
> **`GAP-GOV-05 = PREPARED FOR OWNER CONFIRMATION — NOT CLOSED`**  
> **`HUMAN DECISION REQUIRED` to adopt this as the approval-pack letter table**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**This file does not rewrite** `docs/decisions/DP-0006-hosting-data-residency.md`, `docs/adr/ADR-0006-hosting-and-residency.md`, or frozen E1-B artefacts.

---

## 1. Why the mismatch exists

Four **semantic hosting classes** have been evaluated since ADR-0006 / DP-0006:

1. African managed cloud  
2. EU/EEA managed cloud  
3. Tanzania-controlled colocation / local infrastructure  
4. Hybrid (split placement)

**Letters A and B are stable** across documents (African managed; EU/EEA managed).

**Letters C and D were assigned twice:**

| Source era | C | D |
| --- | --- | --- |
| Original decision paper `DP-0006` (OPEN, not approved) | Hybrid (app cloud, sensitive offline/manual) | Colocation Tanzania/Kenya |
| Architecture pack, E1-A options evaluation, frozen E1-B questionnaire/transmittal, E1-B4 candidate universe, E1-C baseline | Tanzania-controlled colo/local | Hybrid |

This is a **label swap of the same two class types**. It is **not** a fifth architecture, **not** a ranking, and **not** a selected option. E1-A already recorded it as **non-blocking nomenclature**. GAP-GOV-05 required consistent letters **at approval time**.

ADR-0006 itself (`docs/adr/ADR-0006-hosting-and-residency.md`) **does not assign letters**. It names candidates as “African cloud regions, EU regions with transfer tools, or Tanzanian colo/hybrid.”

---

## 2. Which documents use which labels

| Document | C | D | Role |
| --- | --- | --- | --- |
| `docs/decisions/DP-0006-hosting-data-residency.md` | Hybrid | Colo Tanzania/Kenya | Original OPEN decision paper. **Historical letter assignment.** File **unchanged**. |
| `docs/adr/ADR-0006-hosting-and-residency.md` | *(no letters)* | *(no letters)* | Proposed — blocked. Semantic types only. **Unchanged.** |
| `docs/governance/adr-0006-architecture-decision-package.md` | Tanzania-controlled hosting | Hybrid | Architecture pack OPTION C / D. Historical evaluation. **Unchanged.** |
| `docs/governance/adr-0006-architecture-evidence-workplan.md` | Tanzania-controlled | Hybrid | Evidence-collection sequence. **Unchanged.** |
| E1-A options evaluation | Tanzania-controlled colo/local | Hybrid | Adopted class types for E1. Historical. **Unchanged.** |
| Frozen E1-B questionnaire (168 questions) | Tanzania-controlled colo/local | Hybrid | **Frozen.** Hash locked. **Must not be modified.** |
| Frozen E1-B transmittal template | same | same | Required cover for FULL-RFI. **Do not treat as frozen questionnaire, but do not rewrite class letters.** |
| E1-B4 candidate universe / routing | Class C = TZ colo (e.g. CU-09, CU-10, CU-11, CU-12 coverage) | Class D = hybrid / interconnect potential | Operational routing. Historical 11-provider SEND set **SUPERSEDED**; class letters still E1-A. |
| E1-C baseline / gap register GAP-GOV-05 | Documents the swap | Documents the swap | Live gap: consistent letters at pack time |
| This reconciliation | **Canonical live letters = E1-A** | **Canonical live letters = E1-A** | Live pointer. **Not an architecture decision.** |

---

## 3. Semantic definitions of each class

Letters do not change the **meaning**. Meaning is taken from DP-0006 sketches **and** E1-A/architecture-pack prose, reconciled as types.

| Class (canonical live letter) | Semantic definition | Not |
| --- | --- | --- |
| **A** | Managed public-cloud hosting whose **primary** Production region/jurisdiction is in Africa, capable in principle of PostgreSQL-class SoR, backup, and DR — **vendor and country unselected.** | Not “Tanzania approved.” Africa ≠ Tanzania. Not a named hyperscaler. |
| **B** | Managed public-cloud hosting whose **primary** Production region/jurisdiction is in the EU/EEA, with transfer safeguards **where required** — **vendor and country unselected.** UK is not automatically EEA. GDPR applicability is **fact-specific**, not automatic. | Not automatic lawfulness or unlawfulness of EU hosting. |
| **C** | Production infrastructure **controlled in Tanzania** (colocation, local facility, or Tanzanian landing zone). Capability **not assumed**. Geographic-separation DR may still require a second Tanzanian site **or** a later Legal-approved copy. | Not an approved Production location. Tanzania remains **preferred baseline only**. |
| **D** | **Hybrid:** application / data / control-plane / backup / DR / identity components split across class types or jurisdictions according to later legal and resilience rules. Each split is a separate processing/access path (LA-17). | Not the default. Not “safer because split.” Not CU-05 selection. |

DP-0006 Option C text (“Hybrid (app cloud, sensitive offline/manual)”) and architecture-pack Option D (“components distributed…”) are the **same class type** (hybrid). DP-0006 Option D (“Colocation Tanzania/Kenya”) and architecture-pack Option C (“Tanzania-controlled hosting”) are the **same class type** (local/colo control). Kenya in the DP-0006 colo sketch is a **possible facility geography inside that class**, not a selected country.

---

## 4. Canonical terminology (based on existing governance intent)

**This is not a preference among architectures.** It is which **letter** should be used when referring to an already-defined class.

**Canonical live nomenclature (proposed for all future live pointers, intake, and the approval pack):**

| Canonical letter | Semantic class | Authoritative live sources |
| --- | --- | --- |
| **A** | African managed cloud | DP-0006 A; E1-A; frozen E1-B; architecture pack |
| **B** | EU/EEA managed cloud | DP-0006 B; E1-A; frozen E1-B; architecture pack |
| **C** | Tanzania-controlled colocation / local infrastructure | E1-A; frozen E1-B (168 questions + transmittal); E1-B4 universe; architecture pack OPTION C |
| **D** | Hybrid | E1-A; frozen E1-B; architecture pack OPTION D |

**Why E1-A letters, not DP-0006 letters, for live use:**

1. The **frozen** provider questionnaire and transmittal **cannot be changed** and already tell providers C = Tanzania colo, D = Hybrid.  
2. E1-B4 candidate classification and routing already use those letters (Class C Tanzania facilities vs Class D hybrid/interconnect). Changing letters now would mis-route CU records.  
3. The architecture decision package and E1-A evaluation already adopted those letters and treated DP-0006 as a **known swap**.  
4. ADR-0006 has no competing letters.  
5. DP-0006 remains **OPEN / not approved**, so its C/D letter table has never been an approved instrument.

**DP-0006 letters C/D are SUPERSEDED AS LIVE NOMENCLATURE.** The DP-0006 **file** remains the historical OPEN paper and is **not silently rewritten**.

---

## 5. Historical documents that remain unchanged

For evidentiary integrity, **do not rewrite**:

- `docs/decisions/DP-0006-hosting-data-residency.md`  
- `docs/adr/ADR-0006-hosting-and-residency.md`  
- Frozen E1-B questionnaire, PE pack, response template  
- E1-A options evaluation (already contains the nomenclature note)  
- Architecture decision package OPTION C/D sections  
- E1-B4/B5/B6 historical routing files (operational 11-provider SEND set already **SUPERSEDED**; class letters inside remain E1-A)

Readers of DP-0006 must use **this file** as the live letter map: DP-0006 “C” = canonical **D**; DP-0006 “D” = canonical **C**.

---

## 6. Live pointers that require amendment

Amend **additively** (do not erase history):

| Live pointer | Amendment |
| --- | --- |
| GAP-GOV-05 live status | Remain **OPEN**. Record: reconciliation **PREPARED**; closure still requires **owner confirmation at approval-pack time** |
| E1 hosting decision matrix / decision-pack audit (this sprint) | Use canonical A–D table above |
| Next-action / parallel-work registers | Point here; architecture **UNSELECTED** |
| Future DP-0006 / E1 approval pack | Print canonical table; footnote DP-0006 historical C/D swap |

No application-code change. No frozen-file change.

---

## 7. Owner approval

**HUMAN DECISION REQUIRED.**

Patrick Makundi / Owner must **confirm** that the approval pack will use the canonical live letters in §4 (E1-A / frozen E1-B letters). Until that confirmation, GAP-GOV-05 remains **HUMAN EVIDENCE/DECISION** and **not CLOSED**.

This confirmation would **not** select a class, provider, or geography. It only locks **which letter names which already-defined type**.

---

## 8. Substantive architectural effect

**None.**

- No provider is selected.  
- No architecture class is selected.  
- No Production geography is selected.  
- DP-0006 and ADR-0006 remain OPEN.  
- E1 remains NOT APPROVED / BLOCKED.  

A later owner decision still requires provider evidence (E1-B responses), legal artefacts, and an explicit architecture/geography decision — none of which this file supplies.

---

## 9. Canonical terminology table (Task A)

| Class | Semantic definition | Current live usage | Authoritative source for live letters | Conflicting usage | Resolution required? |
| --- | --- | --- | --- | --- | --- |
| **A** | African managed cloud | Consistent | DP-0006 A; E1-A; frozen E1-B | None material | No |
| **B** | EU/EEA managed cloud | Consistent | DP-0006 B; E1-A; frozen E1-B | UK ≠ automatic EEA (already documented) | No (clarification only) |
| **C** | Tanzania-controlled colo/local | E1-A / E1-B / architecture pack / E1-B4 | Frozen E1-B + E1-A (intent for issuance and intake) | DP-0006 labels this type **D** | **Yes — live letters = E1-A C; DP-0006 file unchanged** |
| **D** | Hybrid split placement | E1-A / E1-B / architecture pack | Frozen E1-B + E1-A | DP-0006 labels this type **C** | **Yes — live letters = E1-A D; DP-0006 file unchanged** |

**SEDMC is NOT Production Ready.**
