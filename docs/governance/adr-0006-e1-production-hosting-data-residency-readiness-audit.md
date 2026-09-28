# ADR-0006 E1 — Production Hosting / Data-Residency Architecture-Readiness Audit

> **`GOVERNANCE-ONLY ARCHITECTURE-READINESS AUDIT`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE APPROVAL`** · **`NOT PRODUCTION AUTHORIZATION`**  
> **`E1-C01 Legal Counsel component = COMPLETE`**  
> **`DPO = NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION ARCHITECTURE = UNSELECTED`**  
> **`Tanzania = PREFERRED BASELINE / DESIGN PREFERENCE ONLY`**  
> **`UAT / Production / Migration / Deployment = NOT AUTHORIZED`**  
> **`L-05 / L-17 = ARCHITECTURE-DEPENDENT`**  
> **`THOMAS NGULUMA — LEGAL COUNSEL ONLY`**

**Audit date (repository calendar):** 2026-09-16.  
**Question answered:** whether the repository contains enough governed requirements and evidence to **BEGIN** a formal Production hosting/data-residency **options evaluation**.

**This audit does not:** select or rank Options A–D; name a provider or region; approve ADR-0006 or DP-0006; close E1; authorize UAT, Production, migration, or deployment; implement infrastructure or application changes.

---

## 1. Executive conclusion

**READY TO OPEN OPTIONS EVALUATION** — as a **class-level, provider-neutral, non-selecting** evaluation of the four existing option classes against documented legal/control, recovery, persistence, security, operational, and provider-evidence requirements.

That gate is **not**:

- ready for **provider selection**;
- ready for **architecture approval**;
- ready for **E1 owner decision / E1 closure**;
- ready for **Production / UAT / migration / deployment**.

Legal Counsel has adopted the evaluation **rules**. Combined Legal/DPO remains **incomplete**. Factual/external artefacts (entity, PDPC, DPO, contracts) remain **NOT VERIFIED / NOT ESTABLISHED**. Those gaps **do not block opening class-level options evaluation**. They **do prevent** completing vendor contracting, transfer-instrument selection, and any later provider/region decision.

Tanzania remains the company **preferred baseline / design preference only**. It is **not** an approved Production decision.

**NO MATERIAL CONTRADICTION FOUND** with the adopted Legal Counsel position or the E-01–E-32 consolidated gap audit.

---

## 2. Existing legal / residency requirements

Sources: Legal Counsel attestation (LA-01–LA-17, L-01–L-17); company business position; E-16; E-18; legal data-placement pack (historical Stage 4A). **No new legal conclusions.**

| Topic | Documented requirement (authority) | Remaining dependency on actual Production flows |
| --- | --- | --- |
| Tanzania PDPA | **LEGAL COUNSEL ADOPTED POSITION** LA-02: primary privacy-law **baseline** for the Tanzania operation, with conditions (not exclusive governance of every activity). PDPC registration **NOT VERIFIED** (E-02). | Actual hosting/backup/DR/support paths still unselected. Establishment extract **MISSING** (E-01). |
| Kenya DPA | **LEGAL COUNSEL ADOPTED POSITION** LA-03: **CONDITIONALLY APPLICABLE — FACT SPECIFIC**. Destination ≠ automatic applicability. | Actual Kenya subjects, establishment, offering, transfers (E-05, E-18). |
| EU GDPR / UK GDPR | **LEGAL COUNSEL ADOPTED POSITION** LA-04: **POTENTIALLY APPLICABLE — DO NOT EXCLUDE**. No “international clients = GDPR” rule. | Offering/monitoring/establishment facts (E-18); transfer paths after topology. |
| Cross-border transfers | LA-10 / L-06: identify and register paths. LA-11 / L-07: **no universal mechanism**; assess Tanzania permit **where applicable**; do not assume a permit exists. | Every path field waits on E-08/E-09/E-10. |
| Restricted / Restricted+ | LA-12: **internal** security classification, **not** a statutory category. LA-13: heightened controls **if** identity/health/biometric/payment/credentials processed. E-16: Restricted+ **≠** legally sensitive PD. | File/free-text census; whether Restricted+ classes are actually stored. |
| Sensitive / special-category | L-14: required **where** such data is processed. Structured passport/health/PAN **not currently evidenced** (E-04). Document bytes **UNKNOWN**. | Actual content + applicable law. |
| Approved jurisdictions | **None selected.** Company preference order (LA-06): Tanzania → other appropriate African jurisdiction → EU/EEA or other if necessary and legally acceptable → other only if justified. Preference ≠ approval. | Owner architecture decision after options evaluation. |
| Transfer mechanisms | Counsel-adopted **rule** only. No SCC/IDTA/permit in repository. | Path-specific after destinations exist. |
| Foreign support | LA-16: **conditionally permissible with controls** (least privilege, MFA, individual accounts, logging, approval, confidentiality, review). Countries **unknown**. | Vendor access model (E-29). |
| Subprocessors | LA-15 / L-08: Production register **required**. Register **empty**. | Provider selection (E-11, E-30). |
| Backup location | LA-07: backups containing personal data are **processing** and may be transfers. Prefer same approved privacy/residency framework as primary **and** geographic separation for local failure. Gate-B/C dumps **excluded**. | E-22 unselected. |
| DR location | LA-08: DR replicas are processing locations. Restricted+ must **not** automatically replicate to an unapproved jurisdiction (LA-14). Warm standby **not automatically legally mandatory** (LA-09). | E-23 unselected. |
| Failover restrictions | LA-14 / L-12 overlay: Restricted+ failover only to a location assessed for the same privacy/residency requirements. | No DR selected; restriction is a **criterion**, not a chosen site. |
| Each connected service | LA-17: PostgreSQL, object storage, backups, DR, IdP, email, monitoring, CDN, WAF, KMS, support **each assessed separately**. A Tanzania-hosted application does **not** make all connected processing Tanzania-only. | L-17 deferred until actual topology. |

Do **not** treat these rules as a selected geography or as PDPC/DPO completion.

---

## 3. Data-flow requirements

The architecture process has **enough component inventory** to require a later Production map (E-08 / L-05). It does **not** have an actual Production data-flow.

| Component | Current evidence | Production geography |
| --- | --- | --- |
| Application | Dev/Test local / Compose | **NOT SELECTED** |
| PostgreSQL | Intended durable SoR; Gate-B/Dev PG ≠ Production | **NOT SELECTED** |
| Document storage | Dev `LocalFsDocumentStorage`; port `DocumentStorage` | **CANDIDATE — NOT SELECTED** |
| Backups | Lab dumps excluded | **NOT SELECTED** |
| DR | Not selected | **NOT SELECTED** |
| Identity provider | Dev local password IdP; ADR-0013 OPEN | **NOT SELECTED** |
| Email | Dev templates/outbox; Dev SES mentions ≠ Production | **NOT SELECTED** |
| Monitoring / logging | Not selected; IR **NOT READY** | **NOT SELECTED** |
| CDN / WAF | Not selected | **NOT SELECTED** |
| KMS / secrets | ADR-0012 OPEN; Dev env secrets | **NOT SELECTED** |
| Event infrastructure | Dev `in-memory-dev` stand-in (ADR-0004); outbox dual-write path in Dev/Test | Production transport **NOT SELECTED** |
| External subprocessors | None named | **NOT SELECTED** |

### Mandatory distinctions for any options evaluation

| Concept | Meaning | Must not be collapsed into |
| --- | --- | --- |
| **Data location** | Where bytes of the SoR, documents, backups, and replicas physically/logically reside | Application “hosted in Tanzania” |
| **Data access** | Who can read/administer data (SEDMC staff, vendor support, foreign admin) | Data location |
| **Data-subprocessor location** | Where a provider or their subprocessor processes | SEDMC office or programme destination |

**A Tanzania-hosted application does not automatically mean all processing occurs in Tanzania.** (LA-17.)

Options evaluation **must** score each class on **separate** cells for: app runtime; PostgreSQL; object store; backup; DR; IdP; email; monitoring; CDN/WAF; KMS; events; support access. Filling those cells with a named offering is **provider selection** and is **out of scope** for this gate.

---

## 4. Availability / recovery requirements

Sources: owner/BCM decision pack; stakeholder fact pack; TCO pack baseline; laboratory results (non-Production).

| Business requirement | Documented value | Authority |
| --- | --- | --- |
| Critical functions | Commercial/RFP intake and Programme Building — **jointly critical** | COMPANY / BCM position |
| Recovery priority | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers | COMPANY / BCM position |
| Maximum tolerable disruption (reconciled BCM) | **<= 3 hours** | COMPANY / BCM |
| Critical-function recovery target | **<= 3 hours** | COMPANY / BCM |
| Overall recovery target | **<= 4 hours** | COMPANY / BCM |
| Recovery action | Begins **immediately** (commencement, not instantaneous restoration) | COMPANY / BCM |
| Historical Owner critical interruption | **2 hours** — preserved as **superseded historical Owner input**, reconciled to 3 hours in the BCM pack | COMPANY |
| Zero tolerated **business** data loss | **Zero tolerated loss of critical business data** | COMPANY / BCM |
| Technical RPO | **NOT** declared as 0. Historical **3-hour RPO superseded**. Must be designed, qualified per failure model, and evidenced. | GOVERNANCE |
| Restore-from-backup | Desired **recovery capability**; default posture until warm-standby/HA decided; **not** an approved Production topology | COMPANY / IT draft |
| Warm standby | **Not automatically legally mandatory** (LA-09). Lab: database-level **PARTIAL** only. **NOT SELECTED** | LEGAL COUNSEL + LABORATORY |
| Geographic separation | Required as a **BCM consideration** for backup/DR; must also satisfy residency (LA-07/LA-08) | COMPANY + LEGAL COUNSEL |

**Zero tolerated business loss ≠ technical RPO = 0.** Options evaluation must not invent a technical guarantee of RPO 0.

Laboratory (run `20260915-183034`): backup/restore and PITR **demonstrated** on synthetic PostgreSQL; sync replication zero-loss **only** for the tested config/failure model on one Docker host; async geo **non-zero** potential loss; app+DB recovery **PARTIAL**; **not** Production RTO/RPO.

### What must be decided before Production architecture **selection** (not before opening class evaluation)

- Whether restore-from-backup is the initial Production posture or whether HA/warm standby is required to meet <=3h/<=4h for jointly critical functions.
- How “zero tolerated business loss” is qualified per failure model (committed PostgreSQL vs uncommitted client work vs operator destruction).
- Backup and DR geographies consistent with LA-07/LA-08/LA-14.
- That Dev in-memory Store is **not** the Production recovery target (intended SoR = durable PostgreSQL).

---

## 5. Persistence requirements

Intended Production direction (do **not** implement here):

| Direction | Status |
| --- | --- |
| PostgreSQL as durable system of record | **DESIGN INTENT** / ADR-0003 class. Gate-B/Dev PostgreSQL ≠ Production |
| Redis / search as projections where applicable | **DESIGN INTENT** — not SoR |
| No process-local `Store` as Production SoR | **GOVERNANCE** (ADR-0017 Dev dual-path; Store **not** acceptable for Production) |
| Durable document **metadata** in SoR; bytes behind `DocumentStorage` | **FACT** (schema + port). Production object store **NOT SELECTED** |
| Audit durability | Schema `audit_events` insert-only **FACT**. Production geography **NOT SELECTED** |
| Outbox / event durability | Outbox table **FACT**; Dev transport `in-memory-dev`. Production event transport **NOT SELECTED** |

Options evaluation **must** require any class to host a **durable PostgreSQL 16-class SoR** (or an Owner-approved equivalent later). It **must not** treat Dev Compose, local FS documents, or in-memory Store as Production evidence.

---

## 6. Security requirements

| Control | Documented criterion | Implementation |
| --- | --- | --- |
| Encryption in transit | DP-0006 / capability envelope: TLS | **Provider-dependent** |
| Encryption at rest | Same, including DB volumes | **Provider-dependent** |
| Backup encryption | ADR-0011 intent; LA-07 | **Provider-dependent**; Production backup product **TBD** |
| Key management | ADR-0012 **OPEN** | **Provider-dependent** (E-28) |
| Secrets | Dev env secrets **not** Production | **Provider-dependent** |
| Identity | OIDC direction (ADR-0005); Production IdP ADR-0013 **OPEN**; Dev local password IdP | **Provider-dependent** (E-24) |
| MFA | LA-16 for foreign/support access; IdP MFA **unselected** | **Provider-dependent** |
| Least privilege | LA-16; IAM/ABAC schema exists as Dev capability | **Provider-dependent** + Production implementation |
| Audit logging | `audit_events` FACT; Production log/monitor store **NOT SELECTED** | **Architecture-dependent** (E-26) |
| Monitoring | Capability envelope; currently **NOT READY** | **Provider-dependent** |
| Incident response | E-15 documented-process **draft**; not implemented/tested | Requirements exist; stack-dependent |
| Vulnerability management | Not a named Production product | **Provider-dependent** / COMPANY process |
| Access logging | Support access logging required by LA-16 | **Provider-dependent** |
| Foreign support access | LA-16 controls; countries unknown | **Provider-dependent** (E-29) |

Exact products, regions, and shared-responsibility matrices **depend on provider selection** and must remain unset in options evaluation except as **evidence questions**.

---

## 7. Operational requirements

The architecture decision **must consider** (documented as dimensions, not selected models):

| Topic | Present as a requirement/dimension? |
| --- | --- |
| Support model | Yes (LA-16; DP-0006 support/SLA dimension; E-29) |
| Operational ownership | Yes as Owner/IT/BCM roles in fact pack — named Production on-call **MISSING** |
| Monitoring | Yes (E-26; capability envelope) |
| Incident response | Yes (E-15 draft; L-13) |
| Backup operations | Yes (ADR-0011 19:00 EAT **future requirement**; restore proof) |
| Recovery testing | Yes (lab ≠ Production; restore-probe intent) |
| Patching | Capability envelope / IT draft — **provider-dependent** |
| Capacity / scalability | Planning targets: **up to 500 users**, **up to 200 concurrent**, **30% growth assumption** (IT validation required; not measured) |
| Service availability | DP-0006 availability dimension (multi-AZ vs single-AZ) — **unselected** |
| Business continuity | Yes (<=3h / <=4h / zero business loss) |
| Vendor lock-in / portability / exit | Yes (Postgres/containers preference; DP-0006 exit dimension). Exact exit duration/fees **not invented**. |

---

## 8. Commercial requirements

| Item | Repository state |
| --- | --- |
| Maximum / target infrastructure cost | **COMPANY DECISION REQUIRED** (`UNKNOWN — QUOTE REQUIRED` / unanswered Owner budget fields) |
| Backup / DR budget | **COMPANY DECISION REQUIRED** |
| Managed-service preference | Preferred **direction** only; provider/region open |
| Support-cost tolerance | **COMPANY DECISION REQUIRED** |
| Expected capacity | Planning: up to 500 users / 200 concurrent (not measured) |
| Growth assumptions | Planning: 30% annual (not approved measured growth) |
| Cost vs control principle | Cost **must not override** material security, compliance, recoverability, or BCM (Decision 11) |
| Packet structure | Future decision package must include balanced / lower-cost viable / higher-control alternatives (**structure only**; not populated) |

Options evaluation **may begin** with qualitative cost-driver comparison. **Comparable 3-year TCO cannot be completed** until quotes and a Finance/Owner envelope exist. Do not invent figures.

---

## 9. Provider-neutral evidence requirements

Any eventual provider (none is selected; none is claimed to satisfy these) would need to evidence:

| Evidence | Required for later selection? |
| --- | --- |
| Physical / hosting jurisdiction | **Yes** |
| Backup jurisdiction | **Yes** |
| DR jurisdiction | **Yes** |
| Subprocessor locations | **Yes** |
| Support locations | **Yes** |
| Data-processing terms | **Yes** |
| DPA / role-appropriate contract | **Yes** |
| Transfer mechanisms where applicable | **Yes** (no universal tool) |
| Encryption controls | **Yes** |
| Key-management model | **Yes** |
| Access controls | **Yes** |
| Logging | **Yes** |
| Incident-notification commitments | **Yes** |
| Deletion / retention | **Yes** |
| Service availability | **Yes** |
| Backup / restore capabilities | **Yes** |
| Recovery-testing evidence | **Yes** |
| Portability / export | **Yes** |
| Contractual exit provisions | **Yes** |
| Certifications / assurance where relevant | **Yes, if claimed** — do not invent |

Hosting-capability slots (`A-CAND-1` … `D-CAND-1`) remain **empty**. Unverified cells stay `UNKNOWN — EVIDENCE REQUIRED`.

---

## 10. Architecture-dependent E1 items

Documenting requirements **does not close** these items.

| Item | Architecture-dependent treatment (unchanged) |
| --- | --- |
| **E-08** | Production data-flow map — **ARCHITECTURE-DEPENDENT** (L-05) |
| **E-09** | Transfer register population — **ARCHITECTURE-DEPENDENT** |
| **E-10** | Path instruments — **ARCHITECTURE-DEPENDENT** + **EXTERNAL EVIDENCE REQUIRED** (rule already adopted) |
| **E-11** | Subprocessor register — **ARCHITECTURE-DEPENDENT** |
| **E-19–E-30** | Hosting, PostgreSQL, object storage, backup, DR, IdP, email, monitoring, CDN/WAF, KMS, support countries, vendor contracts — **UNSELECTED / ARCHITECTURE-DEPENDENT** |
| **E-04** | Recipient / Production-location overlays |
| **E-05** | Layer D processing/storage geography |
| **E-06** | Provider-role rows |
| **E-12** | Provider / transfer / recipient sections of any Production notice |
| **E-13** | Backup / log / IdP retention overlay |
| **E-15** | Monitoring, vendor notification, Production recovery tooling |
| **E-17** | Full Production DPIA **if** screening later triggers it |
| **E-18** | Actual transfer/monitoring overlay on applicability |
| **E-32** | L-05 / L-17 artefact closure |
| **L-05** | **ARCHITECTURE-DEPENDENT** |
| **L-17** | **ARCHITECTURE-DEPENDENT** |

E-01, E-02, E-03, E-07 remain **company/external/human** blockers for **selection and contracting**, not for opening class-level evaluation.

---

## 11. Decision prerequisites

| # | Prerequisite | State | Blocks **options evaluation**? | Blocks **provider selection**? |
| --- | --- | --- | --- | --- |
| 1 | Legal / entity evidence (E-01) | **missing / external** · **COMPANY-PROVIDED FACT** name only | **No** (evaluation can proceed unnamed) | **Yes** (contracting/DPA identity) |
| 2 | PDPC registration/status (E-02) | **external** · **NOT VERIFIED** | **No** (carry as open constraint) | **Yes if required**; unknown while unverified |
| 3 | DPO decision/status (E-03) | **human/legal** · **NOT ESTABLISHED** | **No** | **Yes** for combined Legal/DPO and if appointment is required |
| 4 | Processing inventory (E-04) | **preparatory** | **No** (sufficient class inventory) | Partial (recipients/locations still open) |
| 5 | Data-subject geography model (E-05) | **preparatory** (Layers A–D) | **No** (model exists) | Layer D yes |
| 6 | Controller/processor matrix (E-06) | **preparatory** | **No** (framework exists) | Vendor rows yes |
| 7 | Contract / DPA evidence (E-07) | **external / missing** | **No** | **Yes** for named providers |
| 8 | Retention requirements (E-13) | **preparatory** (periods TBD) | **No** | Backup TTL yes |
| 9 | Incident-response requirements (E-15) | **preparatory** (draft; not tested) | **No** | Implementation/testing yes |
| 10 | DPIA screening (E-17) | **preparatory / missing** screening record · **human/legal** | **No** (P2 ≠ DPIA) | Full DPIA may wait on topology |
| 11 | Source-market applicability (E-18) | **preparatory** · **human/legal** | **No** (framework exists) | Path-specific yes |
| 12 | Business continuity requirements | **available** as business targets (<=3h / <=4h / zero **business** loss) | **No** | Topology choice yes |
| 13 | Security requirements | **available** as criteria; products **architecture-dependent** | **No** | Product selection yes |
| 14 | Provider evidence requirements | **available** as checklist; slots empty | **No** | **Yes** until populated |
| 15 | Cost / operational requirements | Cost envelope **COMPANY DECISION REQUIRED**; ops dimensions **available**; capacity **preparatory** planning figures | **No** for qualitative evaluation | **Yes** for TCO-based selection |

---

## 12. Gate determination

**Is SEDMC ready to OPEN a formal Production hosting/data-residency OPTIONS EVALUATION?**

### READY TO OPEN OPTIONS EVALUATION

Bounded as follows.

**Permitted now**

- Compare **classes only**: African managed cloud; EU/EEA managed cloud; Tanzania-controlled colocation/local infrastructure; hybrid. ADR-0006 / DP-0006 / the architecture workplan **permit evaluation** of these classes. **No class is selected. No class is ranked. No class is recommended as winner.**
- Score each class against Legal Counsel constraints (Section 2), data-location vs access vs subprocessor-location (Section 3), BCM targets without converting them to technical RPO=0 (Section 4), PostgreSQL SoR direction (Section 5), security criteria (Section 6), operational dimensions (Section 7), qualitative cost drivers (Section 8), and the provider-neutral evidence list (Section 9).
- Record `UNKNOWN — EVIDENCE REQUIRED` wherever a named offering would be needed.
- Keep Tanzania as **preferred baseline / design preference only**.

**Governed inputs required for that stage**

1. This audit plus ADR-0006, DP-0006 (options **not selected**).  
2. Legal Counsel LA-01–LA-17 / L-01–L-17 adopted rules (L-05/L-17 remain deferred).  
3. E-04/E-05/E-06 preparatory artefacts.  
4. Owner/BCM recovery targets and persistence/security ADRs (0003, 0004, 0011 TBD, 0012 OPEN, 0013 OPEN).  
5. Hosting-capability envelope and empty candidate slots.  
6. Explicit non-goals: no provider, region, Terraform, or Production authorization.

**Not permitted under this gate**

- Selecting AWS/Azure/GCP or any other provider.  
- Selecting a Tanzania, EU, or African **region**.  
- Selecting colocation or hybrid as the winner.  
- Approving ADR-0006 or DP-0006.  
- Closing E-08–E-11 or E-19–E-30.  
- Authorizing UAT, Production, migration, or deployment.

**Nomenclature note (non-blocking):** DP-0006 letters C/D (hybrid vs colo) differ from the architecture workplan letters C/D (Tanzania-controlled vs hybrid). Options evaluation must treat **four class types**, not letter identity, and must not “fix” ADR-0006/DP-0006 in this audit.

---

## 13. Remaining blockers / dependencies

These **remain** after the options-evaluation gate opens. They block **selection / E1 closure / Production**, not class-level evaluation.

### Company / internal
E-01 files; E-04/E-05 census; E-07 existing paper; E-13 candidate periods; Finance/Owner **cost envelope**.

### Human Legal / DPO
E-02 whether registration is required; E-03 appointment decision; E-16 statutory column; E-17 screening record; E-18 fact-specific applicability; E-31/E-32 **DPO** component. THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**.

### External
E-01 registry extract; E-02 PDPC artefact; E-07/E-30 contracts; E-10 path instruments **if** required.

### Architecture / Production
E-08, E-09, E-11, E-14, E-19–E-30; overlays on E-04, E-05, E-06, E-12, E-13, E-15, E-17, E-18; **L-05**; **L-17**.

---

## 14. Governance status

| Item | Status |
| --- | --- |
| E1-C01 Legal Counsel component | **COMPLETE** |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| **E1** | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| **Production architecture** | **UNSELECTED** |
| **Tanzania** | **PREFERRED BASELINE / DESIGN PREFERENCE ONLY** |
| **Production / UAT / Migration / Deployment** | **NOT AUTHORIZED** |
| L-05 / L-17 | **ARCHITECTURE-DEPENDENT** |
| ADR-0006 | **proposed — blocked for Production** (unchanged) |
| DP-0006 | **OPEN — NOT APPROVED** (unchanged) |
| THOMAS NGULUMA | **LEGAL COUNSEL ONLY** |

**STOP.** Opening options evaluation does **not** select an architecture, close E1, or authorize Production.
