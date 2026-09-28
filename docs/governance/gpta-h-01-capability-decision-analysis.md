# GPTA-H-01 — Path B capability decision analysis

> **Read-only factual analysis.** Does **not** select a capability. Does **not** rank, score, or recommend. Does **not** grant implementation, Stage 1, commit, or Production.

**Date prepared:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T20:08:00+03:00**.  
**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Working tree:** **DIRTY** — Class A/B application work **untouched**.

Companion decision package (status **unchanged** by this file): [`gpta-h-01-path-b-capability-selection-decision.md`](gpta-h-01-path-b-capability-selection-decision.md).

Standing flags **unchanged**:

| Flag | Status |
| --- | --- |
| `GPTA-H-01 STATUS` | **OPEN** |
| `PATH B DECISION` | **SELECT / HOLD — NOT YET DECIDED** |
| `SELECTED CAPABILITY` | **NONE — PENDING OWNER DECISION** |
| `IMPLEMENTATION AUTHORIZATION` | **NOT GRANTED** |
| `GPTA-H-02` | **SEPARATE** — not modified |
| E1-C | **CONTROLLED PAUSE** |
| NA-A-22 | **OPEN** |
| CAP-GATE-01 | **NOT COMPLETE** |
| Stage 1 (E1-C) | **NOT APPROVED / NOT COMPLETE** |
| SEDMC | **NOT Production Ready** |

**Disambiguation:** **Path B** here is leftover-noun capability selection. It is **not** HUM-CAP-RV-01 disposable PostgreSQL restore.

---

## A. Purpose

Give the Owner repository evidence for the GPTA-H-01 choice among:

1. Select `LINEAGE_REGISTER`
2. Select `QUALITY_RULE_REGISTER`
3. Place Path B on **HOLD**

Neither candidate has a Stage 1 contract, field list, API, store, UI, or capability ID. Positive business prose for either noun is **absent**. Most meaning is **negative** (what DG1/DG2 must not become) plus the domain-map name.

Where meaning is taken from sibling Path B registers or from the domain-map name rather than an explicit Lineage/QualityRule contract, the text is labelled:

`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`

---

## B. LINEAGE_REGISTER

### B.1 Authoritative definition (what exists)

There is **no** Stage 1 file named lineage-register. There is **no** kernel/API type `Lineage`. The name `LINEAGE_REGISTER` is the GPTA-H-01 leftover-noun label for domain-map aggregate **Lineage**.

| Source | What it actually says |
| --- | --- |
| [`../architecture/02-module-domain-map.md`](../architecture/02-module-domain-map.md) §2.2 | Bounded context `dg` (Data Governance); core aggregates **Dataset, Classification, Lineage, QualityRule**; owner role **CDO**; phase **4**. No field list, no relationships, no process. |
| Same file §2.5 | Department **Data / Analytics** default workspace **Data**; primary contexts `lakehouse`, `di`, `dg`. |
| [`dataset-register-authorized.md`](dataset-register-authorized.md) | DG1 is leftover noun **Dataset** only. Does **not** select Lineage as a product or engine. |
| [`../architecture/dataset-register-preview.md`](../architecture/dataset-register-preview.md) | Lineage remains **not selected**. DG1 must **not** discover lineage, lineage-trace, add lineage edges/graphs, or become a lineage platform/engine/crawler. Forbidden status includes `lineaged`. |
| [`classification-register-authorized.md`](classification-register-authorized.md) | DG2 does **not** select Lineage. UAT: `/v1/lineage` **404**. |
| [`../architecture/classification-register-preview.md`](../architecture/classification-register-preview.md) | Lineage / QualityRule remaining `dg` nouns **Not selected**. No lineage edges/graph on DG2. Nested `…/lineage` routes **not** added. |
| [`../architecture/20-phased-roadmap.md`](../architecture/20-phased-roadmap.md) Phase 4 banner | “Classification, Lineage, and QualityRule remain **unselected** and are **not** a queue.” (**Stale** as to Classification: DG2 later consumed Classification. Lineage still unselected.) |
| [`../backlog/increments.md`](../backlog/increments.md) DG1 row | Out of DG1: “Classification / Lineage / QualityRule engines”. |
| GPTA-H-01 | Currently available leftover option: **LINEAGE_REGISTER** (noun **Lineage**); Path B existence catalogue **if later granted**; not a lineage **engine**. |
| API test `dg2-classification-register.test.ts` | `GET /v1/lineage` **404**; `POST /v1/classifications/:id/lineage` **404**. |
| Kernel `dataset-register.test.ts` / `classification-register.test.ts` | Status `lineaged` is **invalid** on DG1/DG2 rows. |

**No glossary definition of Lineage was found.**

### B.2 Business / domain purpose

**What business/domain problem it represents**

Not stated as a problem statement. The repository only places **Lineage** as a `dg` aggregate next to Dataset and Classification.

`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`: if selected under Path B, Owner intent would be interpreted **narrowly** as a human **existence catalogue** that a lineage **register row exists** (DG1: “catalogue that a dataset exists”; DG2: “catalogue that a classification register row exists”) — **not** a lineage-tracing product.

**What information would eventually be recorded**

**Unknown** until Stage 1. No Lineage fields are defined.

Sibling Path B register minimum (DG1/DG2/ITE1/P3): required `title`, optional `notes`, statuses `open` / `done` / `cancelled`, tenant-unique register code. That pattern is **not** authored for Lineage.

DG1/DG2 **explicitly forbid** on those registers: lineage edges, lineage graph, `datasetId` (DG2), scanner output.

**Who would likely use that information**

Documented **role**, not a named person: domain-map owner **CDO**. Department mapping: Data / Analytics → Data workspace (`dg`).

DG1/DG2 human surfaces are **Data → Datasets / Classifications** on the commercial shell. No CDO named individual was found (unlike DPO designation elsewhere).

No Lineage-specific users or workflows are documented.

**What decisions it could support**

**Not explicitly documented.**

`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`: catalogue membership only (a row exists / is done / is cancelled), matching how DG1 `done` “does **not** mean … lineage-complete”.

**What it explicitly does NOT do** (from DG1/DG2 exclusions — these constrain the *current* `dg` programme and Path B engine prohibition; a future Stage 1 could not silently become an engine without a STOP-rule return to governance)

- Lineage **engine**
- Automated lineage **discovery**
- **Crawlers**
- Lineage **graphs** / **edges** as DG1/DG2 features
- Lakehouse / DLP / I0 clearance reuse
- Reopen DG1 or DG2
- Production / SQL / Path B auto-selection

### B.3 Current domain scope

| Topic | Evidence |
| --- | --- |
| Entity/noun | Domain-map aggregate **Lineage** only |
| Fields/attributes | **None defined** |
| Relationships | **None defined**. Same `dg` context as Dataset and Classification (catalogue co-location only) |
| Dependencies on other nouns | No write dependency. DG2: DG1 is a **closed sibling, not a write dependency**. Same would have to be decided at Stage 1 for Lineage. |
| References from other modules | Negative only (do not add lineage to DG1/DG2/C1–C10) |
| Purely a register/catalogue? | GPTA-H-01 / Path B pattern: **yes, if selected**. Domain map lists it as a core aggregate with no subtype. Stage 1 must interpret. |
| Engine / process / automation / rules execution / reporting | **Not defined.** DG1/DG2 treat lineage **engine / discovery / graphs / dashboards** as **out of scope** for those increments. |
| Current implementation | **None.** Routes **404**. |

### B.4 Implementation surface (not a requirement)

**Known**

- Not selected; no Stage 1; no ID; no implementation.
- `GET /v1/lineage` absent (**404**).
- Path B sequence applies if later selected (section F).
- Selection does not authorize implementation or Production.
- DG1/DG2 STOP rules treat lineage **engine** as a governance return, not a silent add-on.

**Likely** (`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`; **not** a requirement)

- Existence-catalogue sibling of DG1/DG2: human-only mutate; dedicated store/API/health/UI; in-memory Dev/Test SoR unless a later migration gate says otherwise; no nested `/v1/datasets/:id/lineage` if DG2’s “sibling collection, not nested” pattern is reused.
- UI nav sibling under **Data**.
- No FK to `dataset_records` unless Stage 1 adds one (DG2 Classification **forbade** `datasetId`).

**Unknown** (requires future Stage 1 authoring)

- Capability ID (must **not** invent DG3 here).
- Code prefix, JSON wrapper name, permissions, role name.
- Whether any lineage-specific attributes (source, target, dataset link, graph) appear at all.
- SQL filename / migration (DG2 SQL remained **ABSENT**).
- Preview/UAT scope.
- Any reporting.

No development-hour estimate.

### B.5 Relationships to consumed capabilities

| Capability | Documented relationship |
| --- | --- |
| **DG1** | Same `dg` family; closed sibling. DG1 does not select Lineage. No FK. Do **not** reopen DG1. |
| **DG2** | Same `dg` family; closed sibling. DG2 does not select Lineage. Negative API tests. Do **not** reopen DG2. |
| **C1–C10** | **No** Lineage relationship documented. Consumed; do **not** reopen. |
| **I0 Classification** | Kernel clearance enum; **not** Lineage; **not** DG2 Classification. |
| **`graph` (Node, Edge, ImpactQuery)** | Separate Phase 5 context. **Not** selected as Lineage. Conceptual name overlap only. |
| **`lakehouse` (Pipeline, Dataset, SemanticModel)** | Separate Phase 5 context; DG1 Dataset is **not** lakehouse Dataset. |
| Other Path B registers (P1–P3, ITE1, …) | DG1/DG2 forbid privacy/knowledge FKs on `dg` rows. No Lineage link defined. |

All such ties are **conceptual / exclusionary**, not implemented relationships.

---

## C. QUALITY_RULE_REGISTER

### C.1 Authoritative definition (what exists)

There is **no** Stage 1 file named quality-rule-register. There is **no** kernel/API type `QualityRule`. The name `QUALITY_RULE_REGISTER` is the GPTA-H-01 leftover-noun label for domain-map aggregate **QualityRule**.

| Source | What it actually says |
| --- | --- |
| Domain map 2.2 | Same `dg` row: **QualityRule** is a core aggregate; owner **CDO**; phase 4. No fields. |
| DG1 authorized / preview | Does **not** select QualityRule as product or engine. Must **not** evaluate data quality, quality-test, add quality scores, quality dashboards, or QualityRule engine / automated quality evaluation. Forbidden status includes `quality_failed`. `done` on DG1 is **not** quality-passed. |
| DG2 authorized / preview | Does **not** select QualityRule. No quality scores. Nested `…/quality` **not** added. UAT: `/v1/quality-rules` **404**. |
| Roadmap Phase 4 banner | QualityRule **unselected** / not a queue (same stale Classification clause as B.1). |
| Backlog DG1 row | Out of DG1: QualityRule **engines**. |
| GPTA-H-01 | Currently available leftover option: **QUALITY_RULE_REGISTER**; existence catalogue **if later granted**; not a quality **engine**. |
| API test DG2 | `GET /v1/quality-rules` **404**; `POST /v1/classifications/:id/quality` **404**. |

**No glossary definition of QualityRule was found.**

### C.2 Homonyms (not this capability)

These are **different** repository objects. They are **not** `QUALITY_RULE_REGISTER`.

| Object | Location | Why it is not QualityRule |
| --- | --- | --- |
| C1 “Data quality states” | [`../architecture/c1/lifecycle-state-model.md`](../architecture/c1/lifecycle-state-model.md) | CRM org/contact verification (`Unverified` → `Verified`); “rules kernel” as **business policy** for CRM. C1 **consumed**. |
| I2 Rules kernel | Domain `rules` (RuleSet, RuleVersion); ADR-0016 | Platform workflow/rules. Not `dg` QualityRule. |
| Evidence “quality rules” in E1-C01 legal pack | Legal evidence completeness, not `dg` | Unrelated phrase. |

### C.3 Business / domain purpose

**What business/domain problem it represents**

Not stated as a problem statement. The repository only names **QualityRule** as a `dg` aggregate.

`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`: if selected under Path B, interpreted **narrowly** as a human **existence catalogue** that a quality-rule **register row exists** — **not** a data-quality evaluation product.

**What information would eventually be recorded**

**Unknown** until Stage 1. No QualityRule fields are defined (no expression, threshold, dataset link, score, schedule).

Sibling Path B minimum (title / notes / open-done-cancelled / register code) is **not** authored for QualityRule.

DG1/DG2 **forbid** on those registers: quality scores, quality dashboards, quality-rule execution.

**Who would likely use that information**

Same documented **CDO** role and Data / Analytics → Data workspace mapping as Lineage. No QualityRule-specific users or workflows. No named CDO.

**What decisions it could support**

**Not explicitly documented.**

`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`: catalogue membership only. DG1 states `done` does **not** mean data is validated or quality-passed.

**What it explicitly does NOT do**

- QualityRule **engine**
- Automated quality **evaluation** / quality-rule **execution**
- Quality **scores** / quality **dashboards** as DG1/DG2 features
- Statuses implying engine outcome (`quality_failed`, `valid`/`invalid` as DG1 quality)
- Reopen DG1, DG2, or C1
- Replace I2 Rules kernel
- Lakehouse / DLP / Production / Path B auto-selection

### C.4 Current domain scope

| Topic | Evidence |
| --- | --- |
| Entity/noun | Domain-map aggregate **QualityRule** only |
| Fields/attributes | **None defined** |
| Relationships | **None defined**. Same `dg` context as Dataset, Classification, Lineage |
| Dependencies | No write dependency documented |
| References from other modules | Negative only |
| Purely a register/catalogue? | GPTA-H-01 / Path B pattern: **yes, if selected**. Stage 1 must interpret. |
| Engine / automation / execution / analytics | **Not defined.** DG1/DG2 treat quality **engine / execution / dashboards / scores** as **out of scope** for those increments. |
| Current implementation | **None.** Routes **404**. |

### C.5 Implementation surface (not a requirement)

**Known**

- Not selected; no Stage 1; no ID; no implementation.
- `GET /v1/quality-rules` absent (**404**).
- Path B sequence if later selected.
- Selection does not authorize implementation or Production.
- DG1/DG2 STOP rules treat QualityRule **engine** as a governance return.

**Likely** (`INFERRED FROM DOMAIN MODEL — NOT EXPLICITLY DOCUMENTED`; **not** a requirement)

- Existence-catalogue sibling of DG1/DG2 (human-only; dedicated collection; in-memory Dev/Test SoR; Data nav).
- No quality-expression language, scheduler, or score field unless Stage 1 adds them (sibling pattern historically would **STOP**).

**Unknown** (requires future Stage 1 authoring)

- Capability ID (do **not** invent here).
- Code prefix, permissions, role, JSON shape.
- Any rule body, dataset link, threshold, or result store.
- SQL / migration.
- Preview/UAT.
- Reporting.

No development-hour estimate.

### C.6 Relationships to consumed capabilities

| Capability | Documented relationship |
| --- | --- |
| **DG1** | Same `dg` family; QualityRule not selected; no quality score on Dataset rows. Do **not** reopen. |
| **DG2** | Same `dg` family; QualityRule not selected; negative API tests. Do **not** reopen. |
| **C1–C10** | C1 has **orthogonal CRM data-quality states** — **not** this aggregate. Do **not** reopen C1–C10. |
| **I2 Rules** | Different bounded context. No documented FK. |
| **P1–P3 / I19 / lakehouse** | Excluded from DG1/DG2 `dg` rows. No QualityRule link defined. |

Conceptual / exclusionary only.

---

## D. Side-by-side factual comparison

No winner, best, score, rank, or recommendation.

| Dimension | LINEAGE_REGISTER | QUALITY_RULE_REGISTER |
| --- | --- | --- |
| Domain purpose | Domain-map `dg` aggregate **Lineage**. No problem statement. Path B inference: existence catalogue of lineage rows, not a tracing product. | Domain-map `dg` aggregate **QualityRule**. No problem statement. Path B inference: existence catalogue of quality-rule rows, not an evaluation product. |
| Existing definition | Name + “not selected” + engine exclusions. No Stage 1. | Name + “not selected” + engine exclusions. No Stage 1. |
| Existing relationships | Conceptual sibling of DG1/DG2 in `dg`. No FKs. Not `graph` / lakehouse. | Conceptual sibling of DG1/DG2 in `dg`. No FKs. Not C1 CRM quality states; not I2 Rules. |
| Current implementation | None. `/v1/lineage` **404**. | None. `/v1/quality-rules` **404**. |
| Automation defined? | **No.** Discovery/crawlers excluded on DG1/DG2. | **No.** Execution/evaluation excluded on DG1/DG2. |
| Primary unknowns | Fields, ID, prefix, graph vs catalogue, dataset link, SQL, UAT. | Fields, ID, prefix, rule body vs catalogue, dataset link, SQL, UAT. |
| Future implementation boundary | Path B register minimum **if** Stage 1 follows DG1/DG2; engine remains a STOP-rule expansion. | Same Path B register minimum **if** Stage 1 follows DG1/DG2; engine remains a STOP-rule expansion. |
| E1-C dependency | **None at selection** (section E). | **None at selection** (section E). |
| Production dependency at selection | **None.** Production remains **NOT_AUTHORIZED**. | **None.** Production remains **NOT_AUTHORIZED**. |

---

## E. E1-C independence (verified)

GPTA-H-01 already recorded that leftover-noun **selection** does not require E1-C items. Rechecked against DG1/DG2 Path B pattern and this analysis:

| Required for **selection** of either leftover noun? | LINEAGE_REGISTER | QUALITY_RULE_REGISTER |
| --- | --- | --- |
| E1-C validator appointment | **No** | **No** |
| Facility selection | **No** | **No** |
| Production infrastructure | **No** | **No** |
| Production database | **No** | **No** |
| Production credentials | **No** | **No** |
| Production migration | **No** | **No** |
| Production deployment | **No** | **No** |
| Procurement | **No** | **No** |
| RFI/RFQ | **No** | **No** |
| Production RTO/RPO | **No** | **No** |

A later **Production** promotion of any increment would still sit under E1 / DP-0006. That is **not** opened by selection.

This analysis does **not** change E1-C **CONTROLLED PAUSE**, NA-A-22 **OPEN**, CAP-GATE-01 **NOT COMPLETE**, or E1-C Stage 1 **NOT APPROVED**.

---

## F. Future governance sequence (not executed)

For **either** candidate, if the Owner later records GPTA-H-01 OPTION A, the existing DG2-separated sequence still applies. **None of these steps is executed by this file.**

1. GPTA-H-01 selection  
2. Stage 1 authoring  
3. Stage 1 approval  
4. ID assignment  
5. Implementation authorization  
6. Dev/Test implementation  
7. Preview  
8. Commit authorization (**GPTA-H-02** remains a **separate** dirty-tree decision; not granted here)  
9. UAT (only if separately authorized)  
10. Any later Production decision under E1 / DP-0006  

**Selection ≠ Stage 1 ≠ implementation ≠ commit ≠ Production.**

If the Owner records OPTION B (**HOLD**), this sequence does not start.

---

## G. Owner decision

`GPTA-H-01 remains OPEN.`

`OWNER MUST SELECT LINEAGE_REGISTER, SELECT QUALITY_RULE_REGISTER, OR PLACE PATH B ON HOLD.`

Decision fields remain unfilled. This analysis does not fill them.

---

## H. Ambiguity / conflict (not rewritten)

1. **No positive definition.** Both nouns are defined mainly by exclusion from DG1/DG2. The Owner is choosing names that still lack Stage 1 meaning.
2. **Domain-map aggregate vs Path B catalogue.** §2.2 lists Lineage and QualityRule as core aggregates (same row as Dataset/Classification). Path B historically **narrows** a leftover noun to an existence catalogue **not** an engine. Stage 1 must repeat that narrowing explicitly, as DG2 did for Classification.
3. **Stale roadmap banner** still says Classification is unselected; DG2 consumed Classification. Lineage and QualityRule remain unselected.
4. **Homonyms:** C1 data-quality states; I2 Rules; graph Edge; lakehouse Dataset; I0 Classification; HUM-CAP-RV-01 “Path B”.
5. **Capability IDs** for a later increment are **not assigned**. Do not invent DG3 in this analysis.
6. DG2 “next Owner decision is Production” is **not** GPTA-H-01 and is **not** a Production grant.

---

## Final governance audit (this sprint)

| Check | Result |
| --- | --- |
| Branch `master` / HEAD `75ee4c3…` | Inspected at preparation |
| Application / schema / migrate / infra / Production / procurement / RFI | **Not performed** |
| Capability selected | **No** |
| GPTA-H-01 | **OPEN** (decision file not status-changed) |
| GPTA-H-02 | **SEPARATE** |
| NA-A-23 | **Not created** |
| E1-C / NA-A-22 / CAP-GATE-01 / Stage 1 | **Unchanged** |

---

## Additive — 2026-09-17 companion decision recorded (analysis unchanged)

This analysis is **not rewritten**. Companion [`gpta-h-01-path-b-capability-selection-decision.md`](gpta-h-01-path-b-capability-selection-decision.md) §11 records Owner **OPTION C — HOLD PATH B**. Neither leftover noun was selected. Implementation remains **NOT GRANTED**.

