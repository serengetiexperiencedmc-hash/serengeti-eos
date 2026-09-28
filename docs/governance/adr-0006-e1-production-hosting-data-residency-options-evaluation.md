# E1-A — Production Hosting & Data-Residency OPTIONS EVALUATION

> **`E1 = OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE APPROVAL`** · **`NOT RANKING`** · **`NOT RECOMMENDATION`**  
> **`ADR-0006 = OPEN / proposed — blocked for Production`**  
> **`DP-0006 = OPEN — NOT APPROVED`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Legal Counsel component = COMPLETE`**  
> **`THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`PRODUCTION ARCHITECTURE = UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**  
> **`UAT / Production / Migration / Deployment = NOT AUTHORIZED`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**

---

## 1. Document control

| Field | Value |
| --- | --- |
| Document | E1-A Production Hosting & Data-Residency Options Evaluation |
| Path | `docs/governance/adr-0006-e1-production-hosting-data-residency-options-evaluation.md` |
| Date (repository calendar) | 2026-09-16 |
| Gate | E1-A options evaluation (opened by [`adr-0006-e1-production-hosting-data-residency-readiness-audit.md`](adr-0006-e1-production-hosting-data-residency-readiness-audit.md)) |
| Decision produced | **None.** No architecture, provider, region, or topology is selected. |
| Authorization produced | **None.** |

This file does **not** modify ADR-0006, DP-0006, Legal Counsel attestation, LA/L determinations, E-01–E-32 artefacts, application code, schema, or infrastructure.

---

## 2. Purpose

Evaluate four **architecture classes** against governed requirements so a later human/company selection can be made on evidence.

This step is **READY TO EVALUATE**. It is **not** REQUIRED BEFORE SELECTION completion, and **not** REQUIRED BEFORE PRODUCTION completion.

Classes evaluated:

| Class | Meaning in this evaluation |
| --- | --- |
| **A** | African managed cloud |
| **B** | EU/EEA managed cloud |
| **C** | Tanzania-controlled colocation / local infrastructure |
| **D** | Hybrid architecture |

No fifth class is added. ADR-0006 / DP-0006 already authorize evaluation of these class **types**.

**Nomenclature (non-blocking):** DP-0006 letters C/D (hybrid vs colo) differ from the architecture workplan letters C/D (Tanzania-controlled vs hybrid). This evaluation uses the **class types in the table above**, not letter identity as a ranking device.

---

## 3. Governance status

| Item | Status |
| --- | --- |
| ADR-0006 | **OPEN / proposed — blocked for Production** |
| DP-0006 | **OPEN — not approved** |
| E1 | **NOT APPROVED / BLOCKED** |
| Legal Counsel | **COMPLETE** — THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| E-01 | **NOT VERIFIED — EXTERNAL / COMPANY EVIDENCE REQUIRED** (company-provided name **Makundi Serengeti Experience DMC** only) |
| E-02 | **NOT VERIFIED — EXTERNAL EVIDENCE REQUIRED** |
| E-03 | **DPO APPOINTMENT NOT ESTABLISHED** |
| E-07 / contracts | **EXTERNAL EVIDENCE REQUIRED** |
| Production architecture | **UNSELECTED** |
| Tanzania | **PREFERRED BASELINE ONLY** — not an approved Production location |
| UAT / Production / migration / deployment / infrastructure / provider onboarding | **NOT AUTHORIZED** |
| Gate C migration | Governed separately; **not** this evaluation |
| Named Production provider, region, PostgreSQL service, object store, backup, DR, IdP, email, monitoring, CDN/WAF, KMS, subprocessor | **None selected** |
| L-05 / L-17 | **ARCHITECTURE-DEPENDENT** |

---

## 4. Authoritative inputs

Inspected and reconciled (present unless noted):

| Input | Use in this evaluation |
| --- | --- |
| `docs/adr/ADR-0006-hosting-and-residency.md` | Class types; **no** Production choice |
| `docs/decisions/DP-0006-hosting-data-residency.md` | Comparison dimensions; recommended option **Not selected** |
| `docs/governance/adr-0006-stakeholder-fact-pack.md` | BCM/owner inputs; many geography cells unanswered |
| `docs/governance/adr-0006-e1-c01-current-evidence-readiness-register.md` | E-01–E-32 current status |
| `docs/governance/adr-0006-e1-c01-consolidated-evidence-gap-and-closure-readiness-audit.md` | Closure classes A–D |
| `docs/governance/adr-0006-e1-production-hosting-data-residency-readiness-audit.md` | Gate: READY TO OPEN OPTIONS EVALUATION |
| Persistence / recovery readiness; owner-BCM pack; hosting-capability and TCO packs; legal data-placement pack | Requirements, not selected topology |
| `docs/adr/ADR-0011-backup-1900-eat.md` | Dev/Test evidence-register; Production backup **product TBD** |
| `docs/adr/ADR-0012-secrets-platform.md` | **OPEN** — blocked for UAT/Production |
| `docs/adr/ADR-0013-corporate-idp.md` | **OPEN** — blocked for Production |
| Legal Counsel LA-01–LA-17 / L-01–L-17 | Evaluation **rules**, not geography approval |
| E-04–E-06, E-12–E-18 Phase 1 drafts and completeness audits | Preparatory facts |

**Absent as a named Production offering:** any `CANDIDATE — NOT SELECTED` provider row with verified jurisdiction, DPA, or quote. Hosting-capability slots remain empty. That is an **evidence gap**, not a fifth architecture class.

---

## 5. Evaluation rules

1. **No winner, ranking, score, preferred option, or recommendation.**  
2. Language permitted: potential fit; potential constraint; requires validation; evidence required; architecture-dependent; unknown; company decision required.  
3. Do **not** convert Tanzania preference into an approved location.  
4. Do **not** claim a jurisdiction is legally approved.  
5. Do **not** name a provider or region as selected.  
6. Do **not** invent prices, certifications, data-centre locations, contracts, PDPC status, DPO appointment, or Production recovery proof.  
7. Keep **hosting, processing, storage, backup, DR, support-access, and subprocessor** locations separate.  
8. A Tanzania-hosted application does **not** automatically mean all processing occurs in Tanzania (LA-17).  
9. Zero tolerated **business** data loss is **not** technical RPO = 0.  
10. Planning figures (500 users / 200 concurrent / 30% growth) are **planning assumptions**, not measured Production load.  
11. Legal Counsel rules are **inputs**. DPO is **not established**. Combined Legal/DPO remains **incomplete**.

---

## 6. Business requirements

| Requirement | Documented value | Class for evaluation |
| --- | --- | --- |
| Jointly critical functions | Commercial/RFP and Programme Building | All classes must be able to recover these first |
| Recovery sequence | Commercial/RFP → Programme Building → Operations → CRM → Finance → Procurement/Suppliers | All |
| Critical RTO | **<= 3 hours** | Requires validation per class; not proven |
| Overall RTO | **<= 4 hours** | Requires validation per class; not proven |
| Recovery action | Begins immediately (commencement, not instant restore) | All |
| Business data loss | **Zero tolerated loss of critical business data** | Qualify per failure model |
| Technical RPO | **NOT** defined as zero | Evidence required |
| Production SoR | Durable PostgreSQL; no process-local Store | All |
| Backup schedule (future Production requirement) | Encrypted daily **19:00 EAT** + remote copy + restore proof (ADR-0011); **product TBD** | All |
| Cost vs control | Cost must not override security, compliance, recoverability, BCM | Company decision required for envelope |

---

## 7. Legal / privacy constraints

Adopted Legal Counsel **rules** (not geography approval):

| Constraint | Rule | Effect on A–D |
| --- | --- | --- |
| Tanzania PDPA | Primary **baseline** (LA-02), with conditions; PDPC **NOT VERIFIED** | Any class still needs E-02 artefact and E-01 identity |
| Controller / processor | SEDMC controller where it determines purposes/means; processor/joint-controller **may** arise; vendors **may** be processors (LA-01) | Vendor rows **architecture-dependent** |
| Kenya DPA | Fact-specific; destination ≠ automatic (LA-03) | Not decided by class letter |
| EU / UK GDPR | Potentially applicable; do not exclude; no “international clients = GDPR” (LA-04) | Class B does **not** automatically make GDPR apply or not apply |
| Transfers | Register paths; **no universal mechanism**; permit **where applicable**, not assumed (LA-10, LA-11, L-06, L-07) | Extra-TZ processing **requires validation** |
| Restricted / Restricted+ | Internal labels ≠ statutory (LA-12, E-16) | Placement of Restricted+ failover **requires validation** (LA-14) |
| Foreign support | Conditionally permissible with controls (LA-16) | Support geography **UNKNOWN / PROVIDER-DEPENDENT** |
| Subprocessors | Register required (LA-15) | Empty until a candidate exists |
| Each service | Assessed separately (LA-17) | Hybrid does not inherit Tanzania-only from the app tier |

**Legal evidence required before selection (all classes):** E-01 extract; E-02 PDPC status; E-03 DPO decision; E-07 existing paper; path-specific transfer tools **if** a transfer exists; vendor DPA once a candidate is named. None of these is a class winner.

---

## 8. Data-flow requirements

Any later selected topology must map, as **separate** cells:

application; PostgreSQL; object/document storage; backups; DR; logging/monitoring; IdP; email; CDN/WAF; KMS/secrets; support/admin access; subprocessors.

Today every Production cell is **UNKNOWN / NOT SELECTED**. Options evaluation records **typical class implications**, not actual locations.

---

## 9. Recovery requirements

| Topic | Criterion |
| --- | --- |
| Backup | Encrypted; independent of primary disk; 19:00 EAT Production requirement; restore proof |
| PITR / WAL-equivalent | Laboratory demonstrated on synthetic PG; Production product **UNKNOWN** |
| Restore-from-backup | Desired capability; not an approved Production topology |
| Warm standby | Not automatically legally mandatory (LA-09); lab **PARTIAL** (DB only); **NOT SELECTED** |
| Geographic separation | BCM consideration **and** residency (LA-07/LA-08) |
| Failover / failback | Restricted+ must not fail over to an unapproved jurisdiction (LA-14) |
| Recovery testing | Lab ≠ Production; evidence required to prove <=3h / <=4h |

Do **not** claim any class currently achieves these objectives.

---

## 10. Security requirements

TLS; encryption at rest; encrypted backups; KMS (ADR-0012 **OPEN**); secrets; IdP (ADR-0013 **OPEN**); MFA; least privilege; privileged-access logging; audit logging; monitoring; incident response (E-15 draft); foreign-support controls (LA-16); network isolation; WAF/CDN where used; vulnerability/security operations.

None is implemented as Production. Exact products are **PROVIDER-DEPENDENT**.

---

## 11. Operational requirements

24/7 support; incident escalation; monitoring; backup and restore operations; patching; upgrades; database administration; privileged access; change management; recovery testing; support geography; support staffing; operational ownership.

Named Production operating model: **UNKNOWN**. Company decision required for ownership.

---

## 12. Commercial / TCO requirements

Categories that must be quoted later (all currently **QUOTE REQUIRED**): compute; PostgreSQL; storage; object/document storage; backups; DR; bandwidth/egress; monitoring/logging; WAF/CDN; KMS/secrets; IdP; email; support; licensing; implementation; operations; recovery testing; compliance/legal; exit/migration.

No unverified market price is used as a quotation. Comparable 3-year TCO **cannot** be calculated in this evaluation.

---

## 13. Provider evidence requirements

Provider-neutral checklist. Must eventually be obtained for **any** candidate (none named here). All cells today: **EVIDENCE REQUIRED**.

| Evidence | Status now |
| --- | --- |
| Legal entity / provider identity | EVIDENCE REQUIRED |
| Hosting country and region | EVIDENCE REQUIRED |
| Physical data location | EVIDENCE REQUIRED |
| Database location | EVIDENCE REQUIRED |
| Object-storage location | EVIDENCE REQUIRED |
| Backup location | EVIDENCE REQUIRED |
| DR location | EVIDENCE REQUIRED |
| Support location | EVIDENCE REQUIRED |
| Subprocessors | EVIDENCE REQUIRED |
| DPA / data-processing terms | EVIDENCE REQUIRED |
| Transfer mechanisms where applicable | EVIDENCE REQUIRED |
| Security certifications/attestations if claimed | EVIDENCE REQUIRED |
| Encryption (in transit / at rest / backups) | EVIDENCE REQUIRED |
| Key-management model | EVIDENCE REQUIRED |
| Access-control model | EVIDENCE REQUIRED |
| MFA | EVIDENCE REQUIRED |
| Logging | EVIDENCE REQUIRED |
| Incident notification | EVIDENCE REQUIRED |
| Retention / deletion | EVIDENCE REQUIRED |
| Backup/restore capabilities | EVIDENCE REQUIRED |
| SLA / availability commitments | EVIDENCE REQUIRED |
| Recovery capabilities | EVIDENCE REQUIRED |
| Portability / export | EVIDENCE REQUIRED |
| Exit assistance / contractual terms | EVIDENCE REQUIRED |
| Data deletion on termination | EVIDENCE REQUIRED |

Do **not** claim any provider currently satisfies this list.

---

## 14. Architecture class A — African managed cloud

**Definition:** Production runtime and managed services offered by a cloud operator with a processing/storage footprint in **an African country/region**. Africa is **not** equivalent to Tanzania. A non-Tanzania African region remains a **potential** cross-border path relative to the Tanzania baseline (LA-02/LA-10). **No provider or region is named.**

### Potential fit
- Managed PostgreSQL, backup, and HA **may** exist as product classes (**requires validation** per offering).
- Latency to East African operations **may** be more favourable than a distant region (**requires validation**; not measured).
- Company preference order lists “another appropriate African jurisdiction” **after** Tanzania if Tanzania cannot meet requirements (LA-06) — **preference only**, not approval.

### Potential constraint
- **Tanzania residency compatibility:** **Requires validation.** African ≠ Tanzanian. Placement in a non-TZ African jurisdiction is a **potential** transfer.
- Feature completeness, support hours, and managed-PG availability are **UNKNOWN / PROVIDER-DEPENDENT**.
- Subprocessor and support geographies may lie **outside** Africa even if the advertised region is African (LA-17).

### Location cells (all UNKNOWN / PROVIDER-DEPENDENT until a candidate exists)

| Cell | Class A implication |
| --- | --- |
| Application / PostgreSQL / object storage | Typically in the chosen African region — **UNKNOWN** until named |
| Backup / DR | May be same region, second African region, or extra-African — **UNKNOWN**; second site may be a **further** transfer |
| Logging, IdP, email, CDN/WAF, KMS | Often **separate** from compute region — **UNKNOWN**; must not be assumed African |
| Support / subprocessors | **UNKNOWN**; commonly multi-country |

### Persistence
**Potential fit** with PostgreSQL SoR, transactional writes, audit, outbox, `DocumentStorage` port, fail-closed writes, optimistic concurrency — **if** a managed PG 16-class offering and durable object store exist. Process-local Store remains **unacceptable**. Evidence required: offering compatibility, not assumed.

### Recovery
Backup/PITR/HA **may** be available as managed features (**requires validation**). Async geo-DR typically implies **technical RPO > 0** (laboratory observation on async replication). RTO <=3h/<=4h: **evidence required**. Warm standby: **company decision required** if used.

### Security / operations / portability / cost
Security controls **PROVIDER-DEPENDENT** (ADR-0012/0013 remain OPEN regardless of class). Operations often vendor-shared-responsibility (**requires validation**). Portability: PostgreSQL/containers are the documented portable core; proprietary managed add-ons are a **potential constraint**. TCO: **QUOTE REQUIRED**.

### Unresolved questions
Which African country? Same as Tanzania or not? Where are backups, support, and KMS? Does the offering support 19:00 EAT restore-proof backups?

---

## 15. Architecture class B — EU/EEA managed cloud

**Definition:** Production runtime and managed services in an **EU/EEA** country/region. **No provider or region is named.** EU hosting does **not** determine that GDPR applies, and does **not** determine that Tanzania PDPA does not apply.

### Potential fit
- Mature managed PostgreSQL, KMS, logging, and HA product **classes** are commonly marketed in EU/EEA clouds (**requires validation** per offering; not claimed as a selected vendor).
- If EU/UK GDPR later applies on facts (LA-04), processing **inside** the EEA **may** reduce some EU-outbound transfer questions for **that** dataset — **requires fact-specific assessment**. It does **not** remove Tanzania-baseline duties.

### Potential constraint
- Relative to a Tanzania-based controller/operation (company position; E-01 **unverified**), EU/EEA placement of the SoR is a **potential** Tanzania-outbound transfer (LA-10). Transfer mechanism: **evidence required**; **no universal tool** (LA-11).
- Restricted+ failover into the EU is **not** approved (LA-14; no approved jurisdiction).
- Support/subprocessors may include non-EEA locations (**UNKNOWN**).
- Latency to East African field operations: **requires validation**; not measured.

### Location cells
All **UNKNOWN / PROVIDER-DEPENDENT**. Typical class implication: compute/DB **may** be EU/EEA; backups/DR **may** be a second EU region (still extra-TZ) or elsewhere; IdP/email/CDN/KMS/support **must be mapped separately** (LA-17).

### Persistence / recovery / security / operations / portability / cost
Same PostgreSQL SoR compatibility test as A. Recovery: managed backup/PITR **may** exist (**requires validation**); geo-DR **technical RPO** not zero unless a specific offering is proven. Security: **PROVIDER-DEPENDENT**; ADR-0012/0013 still OPEN. Portability: same portable core; EU-specific services are a **potential** lock-in constraint. TCO: **QUOTE REQUIRED** (egress and transfer-assessment cost are additional **categories**, not amounts).

### Unresolved questions
Which EU/EEA country? Adequacy/SCC/IDTA/Tanzania permit **if** a transfer exists? Where do logs, support, and subprocessors sit? Does EU placement change PDPC registration facts (unknown; E-02 unverified)?

---

## 16. Architecture class C — Tanzania-controlled colocation / local infrastructure

**Definition:** Production infrastructure under SEDMC (or a Tanzania facility operator) **control** in Tanzania — colocation, local data centre, or equivalent **local** hosting. **No facility is named.** Tanzania preference (LA-06) is **not** approval of this class.

### Potential fit
- **Potential** alignment of **primary SoR hosting location** with the Tanzania preferred baseline (**requires validation** of the actual facility).
- May reduce **some** extra-TZ SoR-location transfer questions **if** PostgreSQL, documents, and backups remain in Tanzania — **requires validation**. Connected services (email, IdP, monitoring, CDN, KMS) may still sit abroad (LA-17).
- Operational proximity to SEDMC operations: **potential fit** (**requires validation** of staffing).

### Potential constraint
- Managed HA, PITR, multi-AZ, 24/7 DBA, and restore-proof 19:00 EAT operations are **UNKNOWN** until a facility/operator evidences them.
- Geographic separation for backup/DR **inside** Tanzania vs extra-TZ DR: **company decision required** and **requires validation** against LA-07/LA-08/LA-14.
- Implementation and operational complexity **may** be higher than a managed cloud class (**requires validation**; not a ranking).
- Scalability to planning figures (500 users / 200 concurrent / 30% growth): **evidence required**.
- Facility physical security, power, connectivity: **EVIDENCE REQUIRED**.

### Location cells
If a later candidate is strictly Tanzania-local for app+PG+objects+backups, those cells **might** be Tanzania — still **UNKNOWN** until named. IdP, email, monitoring, CDN/WAF, KMS, and support remain **UNKNOWN / PROVIDER-DEPENDENT** even under Class C.

### Persistence / recovery / security / operations / portability / cost
PostgreSQL SoR is **compatible in principle** if SEDMC (or the facility) operates PG 16-class with durable disks, WAL archive, and fail-closed writes. Recovery: restore-from-backup **may** be the initial posture; warm standby **not selected**. Security: KMS/IdP still OPEN; on-prem secrets are **not** a selected ADR-0012 outcome. Operations: SEDMC operational ownership **company decision required**. Portability: high **potential** for PostgreSQL dump/export; facility lock-in is a **potential constraint**. TCO: **QUOTE REQUIRED** (facility, power, staff, hardware refresh).

### Unresolved questions
Which facility? Who operates PG? Where is the remote backup copy? Can <=3h/<=4h be evidenced? Is local 24/7 support available?

---

## 17. Architecture class D — Hybrid architecture

**Definition:** Split placement — for example application in one class of location and PostgreSQL, documents, backups, IdP, or email in another. DP-0006 sketches “app cloud, sensitive offline/manual” as **one** hybrid pattern; other splits are possible. **No split is selected.**

### Potential fit
- **Potential** to keep designated high-protection data in a tighter residency envelope while using managed services for other tiers (**requires validation**; Restricted+ ≠ statutory).
- **Potential** to combine Tanzania-local SoR with non-local operational tooling — **requires validation** against LA-17 (each service assessed separately).

### Potential constraint
- **More** transfer paths, subprocessors, and E-08 map cells than a single-location class — **requires validation**.
- Operational complexity (two operating models, fail-closed across boundaries, restore order): **potential constraint**.
- A Tanzania app with EU database (or the reverse) still requires path-specific transfer assessment; hybrid is **not** a legal shortcut.
- Manual/offline sensitive handling, if used, must not become an undocumented personal-data process (E-04 off-EOS census).

### Location cells
By definition **split** and therefore **UNKNOWN** until a sketch names each cell. Hybrid **forbids** treating “the architecture is in Tanzania” as true for backups, DR, IdP, email, or support.

### Persistence / recovery / security / operations / portability / cost
PostgreSQL SoR must still be durable and fail-closed. Recovery must define which site is authoritative and how failback works; **technical RPO** likely depends on replication class (**UNKNOWN**). Security: two key/IdP domains are a **potential constraint**. Portability: more export surfaces. TCO: **QUOTE REQUIRED** (duplicate or split estates).

### Unresolved questions
Which components are local vs remote? What is the Restricted+ placement rule in the split? Who owns incident command across sites?

---

## 18. Cross-option comparison matrix

Descriptive only. **No scores. No winner.**

| Dimension | A African managed cloud | B EU/EEA managed cloud | C Tanzania-controlled colo/local | D Hybrid |
| --- | --- | --- | --- | --- |
| Tanzania residency compatibility | **Requires validation.** Africa ≠ TZ. Non-TZ African region is a **potential** transfer | **Potential constraint** for primary SoR vs TZ baseline; **requires validation** | **Potential fit** for primary SoR **if** facility evidenced in TZ; connected services still **UNKNOWN** | **Split / UNKNOWN**; must map each cell |
| Cross-border complexity | **Requires validation** (region + support + subprocessors) | **Potential** TZ-outbound SoR path; mechanism **evidence required** | **Potential** reduction for SoR **if** fully TZ; other services **UNKNOWN** | **Potential** increase in path count |
| Backup placement | **UNKNOWN / PROVIDER-DEPENDENT** | **UNKNOWN / PROVIDER-DEPENDENT** | **UNKNOWN**; remote copy vs local failure **company decision required** | **UNKNOWN**; may differ from primary |
| DR placement | **UNKNOWN**; second region may be further transfer | **UNKNOWN**; second EU region still extra-TZ | **UNKNOWN**; in-TZ vs extra-TZ DR | **UNKNOWN** |
| Restricted+ placement | **Requires validation**; LA-14 unapproved failover geography | Same | Same | Same, plus split-path **requires validation** |
| PostgreSQL SoR | **Potential fit** if managed PG 16-class evidenced | **Potential fit** if evidenced | **Potential fit** if operated/evidenced | **Potential fit** only for the nominated SoR site |
| Document storage | **UNKNOWN / PROVIDER-DEPENDENT** | **UNKNOWN / PROVIDER-DEPENDENT** | **UNKNOWN / PROVIDER-DEPENDENT** | **UNKNOWN**; may split from DB |
| Recovery model | Managed backup/HA **requires validation** | Same | Restore-from-backup **may** be initial posture; **requires validation** | Must define authority site; **requires validation** |
| RTO feasibility (<=3h / <=4h) | **Evidence required** | **Evidence required** | **Evidence required** | **Evidence required** |
| Technical RPO | **NOT** zero; async geo typically > 0 | Same | Same unless a specific local sync design is evidenced | Depends on replication class; **UNKNOWN** |
| Security controls | **PROVIDER-DEPENDENT**; ADR-0012/0013 OPEN | Same | Same; facility controls **EVIDENCE REQUIRED** | Two-domain controls **potential constraint** |
| Support model | **UNKNOWN**; often vendor 24/7 **requires validation** | Same | **Company decision required** / local operator **UNKNOWN** | Dual support **potential constraint** |
| Operational complexity | Shared responsibility **requires validation** | Same | **Potential** higher SEDMC ops load | **Potential** highest coordination load |
| Scalability (planning 500 / 200 / 30%) | **Requires validation** | **Requires validation** | **Requires validation** | **Requires validation** |
| Portability | PG/containers **potential fit**; proprietary add-ons **potential constraint** | Same | PG dump **potential fit**; facility lock-in **potential constraint** | More export surfaces; **requires validation** |
| TCO evidence | **QUOTE REQUIRED** | **QUOTE REQUIRED** | **QUOTE REQUIRED** | **QUOTE REQUIRED** |
| Legal evidence | E-01/E-02/E-03/E-07 + path tools if transfer | Same | Same | Same; more paths if split |
| Provider / facility evidence | Checklist §13 | Checklist §13 | Facility + operator checklist | Checklist for **each** component operator |
| Production readiness dependencies | E-08–E-11, E-19–E-30, L-05, L-17 | Same | Same | Same |

---

## 19. Evidence gaps

| Gap | Applies to |
| --- | --- |
| No named candidate offering (`CANDIDATE — NOT SELECTED` slots empty) | A, B, D (cloud); C (facility) |
| E-01 legal entity extract | Contracting for all classes |
| E-02 PDPC status | All |
| E-03 DPO | Combined instrument; some notices/IR |
| E-07 / vendor DPAs | All, once a counterparty exists |
| Actual data-subject census (E-05 Layer B) | Applicability overlay, not class winner |
| Production data-flow (E-08) | All |
| Quotes / cost envelope | All — **COMPANY DECISION REQUIRED** + **QUOTE REQUIRED** |
| ADR-0011 Production backup product | All |
| ADR-0012 / ADR-0013 products | All |
| Production recovery test of jointly critical modules | All (lab ≠ Production; Dev Store not Production SoR) |
| Support/admin countries | All |

---

## 20. Selection prerequisites

**REQUIRED BEFORE SELECTION** (not required to have completed this evaluation):

1. Authoritative legal-entity evidence (E-01).  
2. PDPC registration/status artefact or documented status (E-02) — do not invent registered/unregistered.  
3. DPO decision/status (E-03) — do not appoint via this file.  
4. Processing inventory completeness sufficient for the named topology (E-04).  
5. Data-subject geography facts plus Layer D of the **candidate** (E-05).  
6. Role matrix legal column against actual contracts (E-06, E-07).  
7. Retention candidates at least for operational classes (E-13); backup TTL after backup geography.  
8. Incident-process ownership (E-15); vendor notice once a vendor exists.  
9. DPIA/privacy-risk **screening record** (E-17); full DPIA if triggered.  
10. Source-market screening updated for actual paths (E-18).  
11. Recovery design vs <=3h/<=4h and qualified technical RPO.  
12. Security control mapping for the **named** stack (ADR-0012/0013 still OPEN until chosen).  
13. Provider/facility evidence pack (§13).  
14. Cost envelope (**COMPANY DECISION REQUIRED**) and comparable quotes.  
15. Operational ownership and support model.

---

## 21. Production prerequisites

**REQUIRED BEFORE PRODUCTION** (includes selection prerequisites plus):

- ADR-0006 approved and DP-0006 approved by the competent human/company decision.  
- E1 **APPROVED** (currently **NOT APPROVED / BLOCKED**).  
- Combined Legal/DPO complete if the instrument requires DPO.  
- L-05 data-flow map of the **actual** topology.  
- L-17 review of the **actual** topology.  
- E-19–E-30 populated for the selected stack.  
- Production TOMs implemented (E-14).  
- Backup product named and restore-tested (ADR-0011 Production).  
- UAT authorized under a **separate** gate (currently **NOT AUTHORIZED**).  
- No live personal data in Dev/Test.

This evaluation does **not** authorize any of the above.

---

## 22. Architecture-dependent E1 items

These **cannot close** until an actual topology/provider exists. Class A–D evaluation does **not** close them.

| Item | Effect of A–D evaluation |
| --- | --- |
| E-04 recipient/location overlays | Still open |
| E-05 Layer D | Still **NOT SELECTED** |
| E-06 provider-role rows | Still pending vendor |
| E-08 / L-05 | Still architecture-dependent |
| E-09 transfer register | Empty |
| E-10 path instruments | Rule adopted; paths absent |
| E-11 subprocessors | Empty |
| E-12 notice recipients/transfers | Draft remains draft |
| E-13 backup/log/IdP overlay | TBD |
| E-14 Production TOMs | Architecture-dependent |
| E-15 monitoring/vendor notice/recovery tooling | Draft only |
| E-17 full Production DPIA | May wait on topology |
| E-18 transfer/monitoring overlay | Facts incomplete |
| E-19–E-30 | **UNSELECTED** |
| E-32 L-05 / L-17 closure | Deferred |

E-01, E-02, E-03, E-07 remain **company/external/human** and also block **selection**, independent of class letter.

---

## 23. Open questions

1. Will the later decision use a single-location class (A, B, or C) or a split (D)?  
2. If African managed (A), is the region Tanzania or another African jurisdiction?  
3. How will backup geographic separation be reconciled with LA-07/LA-14?  
4. Is restore-from-backup the initial Production posture, or is HA/warm standby required for <=3h?  
5. How is “zero tolerated business loss” qualified per failure model?  
6. What is the Finance/Owner cost envelope?  
7. Who is the Production operational owner?  
8. When will E-01/E-02/E-03 artefacts exist so a candidate DPA can name the company?  
9. Which connected services (IdP, email, monitoring, CDN, KMS) are allowed to sit outside the SoR jurisdiction?  
10. Will Restricted+ classes actually be stored in Production EOS?

---

## 24. Decision record template (for a **later** human/company selection)

Do **not** complete this template in this evaluation.

```
Decision: ADR-0006 / DP-0006 architecture class selection
Date:
Decision-maker (role):
Class selected (A / B / C / D):     [leave blank until decided]
Named provider/facility:            [leave blank until decided]
Named regions (app / PG / objects / backup / DR / IdP / email / monitoring / KMS / support):
Transfer register attached (E-09):  yes/no
Provider evidence pack attached:    yes/no
E-01 / E-02 / E-03 / E-07 status:
Legal Counsel consulted (not DPO unless appointed):
DPO (if established):
Finance/Owner cost envelope attached: yes/no
L-05 map attached: yes/no
L-17 review attached: yes/no
Statement: This decision is not UAT or Production authorization.
```

---

## 25. Explicit non-decision statement

**OPTIONS EVALUATION COMPLETE — NO ARCHITECTURE SELECTED.**

- ADR-0006 remains **OPEN**.  
- DP-0006 remains **OPEN**.  
- E1 remains **NOT APPROVED / BLOCKED**.  
- No provider selected.  
- No region selected.  
- No Production topology selected.  
- No Production authorization.  
- No UAT authorization.  
- No migration authorization.  
- No deployment authorization.  

Tanzania remains **PREFERRED BASELINE / DESIGN PREFERENCE ONLY**.  
THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**. DPO remains **NOT ESTABLISHED**. Combined Legal/DPO remains **INCOMPLETE**.

**E1 = OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED.**
