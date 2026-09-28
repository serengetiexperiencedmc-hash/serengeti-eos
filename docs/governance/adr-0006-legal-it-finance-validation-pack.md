# ADR-0006 Stage 2 — Legal/DPO + IT/Security + Finance Validation Pack

> **`DRAFT FOR STAKEHOLDER VALIDATION — DECISION PREPARATION`**  
> **STAGE: 2**  
> **CURRENT STATUS: `RED — ADR-0006 NOT CLEARED`**  
> **No answer in this document constitutes Legal/DPO, IT/Security, or Finance approval until the responsible reviewer attests.**  
> **No personal signature, statutory approval, provider, region, architecture, or monetary figure is invented here.**

This pack takes the **Stage 1 Owner-authorized business baseline** as input and identifies what Legal/DPO, IT/Security, and Finance must **validate, decide, and evidence** before an ADR-0006 architecture decision package can be constructed.

It does **not** approve ADR-0006, approve DP-0006, select a cloud provider or Production region, approve hosting or Production architecture, or authorize implementation, migrations, or deployment.

**Stage 1 source:** [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md)  
**Historical questionnaire:** [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md)  
**Gap register:** [`adr-0006-stakeholder-gap-closure-register.md`](adr-0006-stakeholder-gap-closure-register.md)  
**Decision records (status unchanged):** [`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md) — **proposed — blocked for Production**; [`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md) — **OPEN / NOT APPROVED**

---

## How to complete this pack

1. Do **not** alter Stage 1 business values in this document.
2. Fill `Proposed decision` / `Finance decision` only with actual stakeholder positions.
3. Leave `Status` as `OPEN — REQUIRES … VALIDATION` until attested.
4. Leave reviewer/attestation lines blank until a named person actually reviews.
5. Draft fact-pack Legal/IT/Finance text is **input for review**, not attestation.

---

# Stage 1 business baseline (carried forward, not altered)

Owner-authorized company decision positions. Not personal signatures. Not Legal/IT/Finance approval.

| Area | Stage 1 position (do not change here) |
| --- | --- |
| Critical capability | Commercial / Programme Building **jointly critical**. Commercial/RFP intake **initiates**. Programme Building depends on Commercial inputs, **Finance**, and **Suppliers**. |
| Recovery priority | 1. Commercial / RFP intake → 2. Programme Building → 3. Operations → 4. CRM → 5. Finance → 6. Procurement / Suppliers |
| MTD | <= **3 hours** (critical business operations). Prior Owner 2-hour figure is superseded historical input. |
| Critical-function RTO | <= **3 hours** (business requirement) |
| Overall EOS RTO | <= **4 hours** (business requirement) |
| Recovery initiation | Recovery **action begins immediately** (not instantaneous technical restoration) |
| Data loss | **Zero tolerated loss of critical business data** (business requirement) |
| Technical RPO | **NOT approved.** IT must determine measurable technical RPO and architecture, and whether the business requirement is technically achievable. |
| Recovery architecture | **Not selected.** Must be capable of meeting the outcomes above. “Restore from backup” is a desired **capability**, not approved topology. |
| Hosting direction | **Managed cloud** preferred direction. **No provider selected. No Production region selected.** |
| Geography | **No jurisdiction pre-approved.** Tanzania = preferred **candidate for assessment**, not approval. Kenya, EU/EEA and others **may be assessed**. |
| Highly Restricted | Remain in the **primary approved** jurisdiction unless explicitly approved otherwise. Primary jurisdiction **not yet approved**. |
| Portability | High portability / low vendor lock-in |
| Scale (planning targets, not measured usage) | Up to **500** users; up to **200** concurrent; **30%** annual growth planning assumption |
| Non-negotiables | Strong data protection; tested recovery; secure backup/DR; strong access control; auditability; Dev/Test vs Production separation; no live Production PII in Dev/Test; secure secrets; controlled Production changes |
| PCI | EOS should **not** store raw cardholder data; prefer third-party processing; **no PCI DSS compliance claim**; scope/evidence **open** |
| Cost principle | Cost must not override material security, compliance, recoverability, or BCM. Future packet: balanced / lower-cost / higher-control with comparable 3-year TCO. **No budgets invented.** |

Fact pack Section 6 stakeholder-approved RTO/RPO remains **blank**. Architecture 12.3 RTO/RPO remains **PROPOSED / NOT APPROVED**.

---

# Part A — Legal / DPO validation

**Label for all existing fact-pack L1–L17 text:** `DRAFT — REQUIRES LEGAL/DPO REVIEW AND ATTESTATION`  
**Do not treat any row as legal certification, GDPR confirmation, or hosting-country approval.**

Status values until attested: `OPEN — REQUIRES LEGAL/DPO VALIDATION`

### A1. Applicable privacy / data-protection laws

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Operate under applicable law; no jurisdiction pre-approved; cross-border access must be assessed and controlled. |
| Existing draft Legal input (not attested) | Fact pack L1: Tanzania PDPA 2022 as primary design-basis framework; other regimes may apply subject to assessment. |
| Legal/DPO question | Which laws actually apply to SEDMC Production processing, and on what evidence? |
| Evidence required | Processing/data-subject assessment; controller establishment (Owner O1 still open). |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A2. Tanzania PDPA applicability

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Tanzania is a preferred **candidate for assessment**, not automatic approval. |
| Existing draft Legal input | Fact pack L2: design Production on the basis that Tanzania PDPA applies to processing conducted by the company in Tanzania — **draft, not determination**. |
| Legal/DPO question | Does Tanzania PDPA apply, and what controller/processor, security, rights, retention, and transfer obligations follow? |
| Evidence required | Legal analysis; any registration/notification requirements. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A3. Kenya DPA applicability where relevant

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Kenya **may be evaluated**; not approved. |
| Existing draft Legal input | Fact pack L3: assess where processing falls within Kenya’s jurisdiction. |
| Legal/DPO question | For which processing activities (if any) does Kenya DPA apply? |
| Evidence required | Kenyan data-subject / client / employee / supplier / traveller facts. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A4. GDPR / UK GDPR territorial applicability where relevant

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | EU/EEA (and by extension other overseas markets) **may be assessed**; not approved. |
| Existing draft Legal input | L4: GDPR potentially applicable, not automatically. L5: no dedicated UK GDPR determination — **UNKNOWN**. |
| Legal/DPO question | Does GDPR and/or UK GDPR apply, in whole or to identified processing, under territorial scope rules? |
| Evidence required | Formal territorial-scope assessment (offering, monitoring, data-subject location). |
| Proposed decision | `___` (must not be inferred as “applies” or “does not apply”) |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A5. Other international privacy regimes

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Other jurisdictions may be assessed according to data subjects and processing. |
| Existing draft Legal input | L6: potentially yes; map by data-subject/customer/processing location. |
| Legal/DPO question | Which additional regimes are triggered, and which can be scoped out with evidence? |
| Evidence required | Market / data-subject map (L8 census still UNKNOWN). |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A6. Production jurisdiction approval requirements

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | **No Production jurisdiction pre-approved.** Tanzania = candidate for assessment only. Managed cloud preferred; **no provider/region selected**. |
| Existing draft Legal input | L8/L11: UNKNOWN / NOT APPROVED. |
| Legal/DPO question | What must be true before any Production country/region/facility is legally approvable? |
| Evidence required | Transfer assessment; localisation analysis; data-classification overlay. |
| Proposed decision | `___` **Do not name an approved Production region here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A7. Backup jurisdiction approval requirements

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Backup locations must satisfy legal/privacy/security/contractual/operational/BCM requirements. **Not selected. Not pre-approved.** |
| Existing draft Legal input | L12; residency Q2: backup copy must not silently create an unapproved transfer. |
| Legal/DPO question | What constraints apply to backup geography, including copies and snapshots? |
| Evidence required | Backup data-flow; encryption/access; destination list once IT proposes options. |
| Proposed decision | `___` **Do not select a backup region here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A8. DR jurisdiction approval requirements

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Same class of requirements as Production/backup. **Not selected.** |
| Existing draft Legal input | L12; residency Q3. Production replication **NOT AUTHORIZED**. |
| Legal/DPO question | What must be approved before any DR replica location is used? |
| Evidence required | Replica contents; failover access locations; transfer mechanism. |
| Proposed decision | `___` **Do not select a DR region here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A9. Warm-standby jurisdiction approval requirements

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Warm standby **not selected** as architecture. If later proposed, location must meet the same legal tests. |
| Existing draft Legal input | Residency Q4: no warm-standby jurisdiction currently approved. |
| Legal/DPO question | If IT later proposes warm standby, what jurisdictional conditions apply? |
| Evidence required | Same as DR plus continuous replica/access assessment. |
| Proposed decision | `___` **Do not approve warm standby or a region here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A10. Cross-border transfer requirements

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Cross-border access and processing must be assessed and controlled. |
| Existing draft Legal input | L9–L10: transfers are a legal requirement; **no mechanism approved**; Tanzania→foreign cloud potentially permissible subject to verification; GDPR transfers (if GDPR applies) need an appropriate mechanism. |
| Legal/DPO question | What lawful transfer mechanism(s) are required for each destination class? |
| Evidence required | Destinations, data categories, provider role, contracts — once options exist. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A11. Remote foreign support access

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Cross-border access must be assessed and controlled. |
| Existing draft Legal input | Residency Q12: remote access only if legally permitted, necessary, secured, logged. |
| Legal/DPO question | From which countries may support personnel access Production data, under what controls? |
| Evidence required | Support model (IT B37); access locations; MFA/logging. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A12. Monitoring / logging destinations

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Auditability is a non-negotiable; logging geography not approved. |
| Existing draft Legal input | Residency Q13: potentially, subject to minimisation and Legal/DPO approval. |
| Legal/DPO question | May identifiers/personal data in logs leave the primary jurisdiction? |
| Evidence required | Log data-flow; retention; redaction/pseudonymisation design (IT B23/B32). |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A13. Identity / email / CDN / service-provider processing locations

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Managed cloud preferred; subprocessors not selected; IdP/secrets products **not** selected (ADR-0012/0013 OPEN). |
| Existing draft Legal input | Residency Q14; L15. |
| Legal/DPO question | What location/subprocessor disclosure is required before Production use of identity, email, CDN, observability, or similar SaaS? |
| Evidence required | Subprocessor lists; processing locations; transfer terms. |
| Proposed decision | `___` **Do not select IdP/email/CDN products here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A14. Restricted-data handling

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Stronger controls implied by non-negotiables; detailed Restricted geography matrix **not** fully specified in Stage 1. |
| Existing draft Legal input | L7/L13: classify by sensitivity; no approved Restricted geography. |
| Legal/DPO question | Which categories are Restricted, and what geographic/handling rules apply? |
| Evidence required | Classification schedule; inventory. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A15. Highly Restricted-data handling

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Highly Restricted data should remain in the **primary approved** jurisdiction unless explicitly approved otherwise. **No primary jurisdiction is currently approved.** |
| Existing draft Legal input | Residency matrix Highly Restricted row: default restrictive; exceptions need express Legal/DPO approval. |
| Legal/DPO question | Confirm default, exception process, and what counts as Highly Restricted. |
| Evidence required | Classification; exception record template. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A16. Subprocessors

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Low lock-in; contractual controls required; no provider selected. |
| Existing draft Legal input | L15: appropriate contractual/privacy/security/subprocessor controls; know storage locations and subprocessors. |
| Legal/DPO question | What subprocessor due-diligence and flow-down terms are mandatory before Production? |
| Evidence required | DPA templates; subprocessor schedule once a provider is proposed (not selected here). |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A17. Data retention / deletion

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Not a numeric retention schedule in Stage 1. |
| Existing draft Legal input | L17: documented periods; no indefinite retention merely because storage is cheap. |
| Legal/DPO question | What retention periods and deletion/anonymisation rules apply by data class? |
| Evidence required | Legal/contractual/accounting/operational bases; legal-hold process. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A18. Data return / deletion at provider termination

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Exit support, data return, secure deletion, and reasonable migration notice should be addressed **contractually**. Duration/fees **not invented**. |
| Existing draft Legal input | Fact pack Exit Q8: draft principle covering backups/replicas. |
| Legal/DPO question | What return/deletion/backup-and-replica destruction obligations must the hosting contract contain? |
| Evidence required | Contract playbook; alignment with C14. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A19. Payment-card data / PCI boundary

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | EOS must **not** store raw cardholder data in normal architecture; prefer third-party processing; minimum reconciliation metadata only; **no PCI DSS compliance claim**; scope/evidence **open**. |
| Existing draft Legal input | L16; Section 4: `PCI DSS STATUS NOT ESTABLISHED`. |
| Legal/DPO question | What legal/PCI conditions apply to the preferred architecture, and what evidence is required before scope is declared? |
| Evidence required | Processor list; data-flow; validation documents (Finance/IT). |
| Proposed decision | `___` **Do not claim compliance or in/out of scope here.** |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

### A20. Required contractual / privacy / security safeguards

| Field | Content |
| --- | --- |
| Existing Owner-authorized position | Strong access control, auditability, encryption implied by non-negotiables; portability/exit contractual. |
| Existing draft Legal input | L17: hosting must account for privacy, transfers, confidentiality, security, contracts, backup/DR geography, subprocessors, data-subject location. “Legal should approve” is **not** existing approval. |
| Legal/DPO question | What minimum contractual and organisational safeguards are mandatory for any later provider? |
| Evidence required | Clause checklist; mapping to A10–A18. |
| Proposed decision | `___` |
| Status | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| Legal/DPO reviewer / attestation | Name `________________` Date `________________` Decision `___` |

---

# Part B — IT / Security validation

**Purpose:** identify what IT must **decide and prove**.  
**Do not** decide the final provider, cloud, region, database topology, DR topology, or exact technical RPO in this pack unless an **existing approved** governance decision already establishes it. None does for Production.

Draft fact-pack I1–I19 is **not** IT attestation. ADR-0012 / ADR-0013 remain **OPEN**. ADR-0011 Production backup product remains **TBD**. ADR-0017 is **accepted for Development** (phased persistence; Dev/Test in-memory primary).

Status until attested: `OPEN — REQUIRES IT/SECURITY VALIDATION`

| ID | Business requirement | Current technical state (known, not approved Production) | Technical question | Evidence / test required | Proposed decision | Dependency | Status | IT/Security reviewer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Durable Production capability for jointly critical Commercial / Programme Building | **ADR-0017:** Dev/Test runtime SoR is largely **in-memory `Store`**; PostgreSQL often schema-readiness / optional mirror. Not Production SoR. | What is the current persistence model per module, and what must change for Production? | Module SoR inventory | `___` | ADR-0017; B2 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B2 | Production system of record for critical data | Planned OLTP is PostgreSQL (ADR-0003 accepted for Development). Production PG **not authorized**. Migrations **NOT AUTHORIZED**. | What is the Production SoR, and when may it be cut over? | SoR decision record; **do not authorize migrations here** | `___` | B1; Legal A6 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B3 | PostgreSQL architecture capable of RTO/RPO outcomes | I9: managed PostgreSQL **can be supported**; vendor/region/HA **UNKNOWN**. No vendor selected. | What Production PostgreSQL topology (without selecting a vendor unless already approved — none is)? | HA/backup/restore design options | `___` **No vendor selected here** | B2; B7; B8 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B4 | Durable persistence of critical business data | Dev/Test in-memory is **not** Production durability | What write-path durability is required for critical functions? | Durability/failure tests | `___` | B2; B7 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B5 | Secure backup/DR; tested recovery | ADR-0011: Dev/Test **BCM evidence register** only; Production backup **product TBD**. I15 draft. | What Production backup architecture is required (product **not** selected here)? | Backup design; encryption; isolation | `___` | B7; A7 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B6 | Zero tolerated **business** data loss | I15: daily backup insufficient as **sole** mechanism for very tight RPO; WAL/CDP **recommended** in draft, **not approved** | Is continuous protection / WAL (or equivalent) required to qualify the business requirement? | Feasibility note; no product lock | `___` | B7 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B7 | Zero tolerated loss of critical business data | Technical RPO **not approved**. Historical 3h RPO superseded. Section 6 blank. `<=15m` RPO **NOT PROVEN**. | What **measurable technical RPO** is required, and is the business requirement achievable? | Model + restore/lag measurements once an option exists | `___` **Do not set technical RPO = 0 by assumption** | Stage 1; Finance C6 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B8 | Critical-function RTO <= 3 hours | Section 6 blank. Architecture 12.3 **not approved**. `<=1h` RTO **NOT PROVEN**. | What technical RTO can be achieved for Commercial / Programme Building, and with what architecture class? | Timed restore/failover tests | `___` | B10–B14 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B9 | Overall EOS RTO <= 4 hours | Same as B8 | What is achievable for the full platform including sequence positions 3–6? | Dependency recovery times | `___` | Recovery order Stage 1 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B10 | High availability for critical functions | I10: failure-domain redundancy **recommended**; mandatory Multi-AZ **depends on approved RTO/RPO** (none). | What HA level is required vs optional? | Failure-injection tests | `___` **No topology selected** | B8; C6 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B11 | Failure-domain strategy | I10 draft; no Production estate evidenced | Single-AZ vs multi-failure-domain vs multi-site — which classes can meet B8/B9? | Option sketches | `___` | A6–A8 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B12 | DR strategy meeting outcomes | No DR site. Warm standby / active-active **not selected** in Stage 1. | What DR **class** can meet outcomes without selecting a region? | DR option paper | `___` **No DR region selected** | A8; B7–B9 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B13 | Warm standby requirement assessment | Stage 1: **not selected**. IT draft: recommended/likely required, **not implemented**. | Is warm standby **necessary** to meet B7–B9, or can another class suffice? | Feasibility vs backup-only | `___` **Do not select warm standby here** | B14; C10 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B14 | Backup-only recovery feasibility | Stage 1: restore-from-backup is a desired **capability**, not approved architecture. IT: **not established as sufficient**. | Can backup-only meet <=3h critical RTO and zero tolerated business data loss? If not, what class is required? | Restore timing and RPO modelling | `___` **Do not select backup-only here** | B7; B8 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B15 | Tested recovery (non-negotiable) | ADR-0011 Dev/Test restore-probe objects; Production restore tests **not claimed** | What restore-test cadence and pass criteria are required? | Documented restore tests | `___` | B5; B38 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B16 | Failover / failback testing | None claimed for Production | If HA/DR is used, what failover/failback tests are mandatory? | Test records | `___` | B10–B13 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B17 | Production / backup / DR geography | Tanzania candidate only; **no region selected**. Legal A6–A9 open. | Which geography **options** can IT support that Legal can assess? | Option list **without selection** | `___` | A6–A9 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B18 | Strong access control; identity | ADR-0013 **OPEN**. I2: named IdP **UNKNOWN**. Dev/Test local issuer only. | What Production identity/authentication pattern is required? | IdP options **not selected here** | `___` | A13; ADR-0013 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B19 | Secure secrets management | ADR-0012 **OPEN**. I14: KMS/HSM recommended; provider unknown. Secrets must not be in code (Stage 1). | What secrets/KMS approach is required, including key jurisdiction? | No Vault/cloud KMS selected here | `___` | A6; ADR-0012 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B20 | Network segmentation | I7/I8: existing Production network **UNKNOWN**; segmentation/WAF recommended in draft | What segmentation is mandatory for Production? | Network design options | `___` | A19 PCI | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B21 | TLS / encryption in transit | I8/I19: TLS 1.2+ / 1.3 preferred — **draft, not approved requirement set** | What in-transit encryption standard is mandatory? | Config/test evidence | `___` | A20 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B22 | Encryption at rest | I9/I13/I19: recommended for DB/storage/backups where sensitive — draft | What at-rest encryption is mandatory for Production data, backups, logs? | KMS dependency B19 | `___` | B19 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B23 | Auditability | I0/kernel audit exists in Dev/Test scope; Production SIEM **UNKNOWN** (I5) | What audit-log completeness, integrity, and retention are required in Production? | Log content/retention design | `___` | A12; A17 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B24 | Monitoring / alerting | I16: 24/7 function **NOT PROVEN**; named platform UNKNOWN | What monitoring/alerting is required to support immediate recovery **initiation**? | Alert/on-call design | `___` | B37 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B25 | Security incident response | Draft I19 includes IR as recommended expectation | What IR capability is mandatory for Production? | IR runbook; no product selected | `___` | B24 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B26 | Rate limiting / application protection | I8 WAF/DDoS recommended; not approved | What application-layer protections are mandatory? | WAF/rate-limit options | `___` | B20 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B27 | Session / token security | Dev/Test sessions exist; Production IdP open | What session/token controls are required once identity is chosen? | Session policy | `___` | B18 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B28 | Dev/Test vs Production separation; no live Production PII in Dev/Test | Stage 1 non-negotiable. ADR-0006: Increment 0 local Dev; do not copy live personal data. | How will environments, data, and secrets be separated? | Environment policy; anonymisation approach | `___` | A15; B19 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B29 | Capacity for up to 500 users / 200 concurrent | I19 **PLANNING ASSUMPTION only**, not approved. Stage 1: planning targets requiring IT validation. | Can a later Production option meet these targets? What tests prove it? | Load test plan | `___` | C13 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B30 | 30% annual growth planning assumption | Same as B29 — planning assumption, not measured growth | What capacity-planning process is required? | Growth model | `___` | B29 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B31 | Integration dependencies | Stage 1: important business integrations **not named**. Programme Building depends on Finance and Suppliers **as business functions**. | Which technical integrations are on the recovery critical path? | Integration map — **do not invent vendors** | `___` | Stage 1 sequence | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B32 | Observability | I5 named platform UNKNOWN | What traces/metrics/logs are required for recovery and audit? | Observability design; geography A12 | `___` | B23; B24 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B33 | Backup retention | Stage 1: no numeric retention. Legal A17 open. | What backup retention meets legal + RPO/restore needs? | Retention options | `___` | A17; C10 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B34 | Restore integrity verification | ADR-0011 Dev/Test restore-probe pattern; Production not proven | How is restored data proven complete and consistent? | Integrity checks | `___` | B15; B38 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B35 | Portability / provider exit | Stage 1 Decision 12 principles; no incumbent Production provider | How will PG, files, config, and backups be exportable/restorable outside an incumbent? | Exit test plan | `___` | C14; A18 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B36 | Infrastructure-as-code portability | I18: IaC **can be supported**; named CI/CD UNKNOWN. Deployment **NOT AUTHORIZED**. | What IaC/portable standards are required without selecting a Production pipeline? | IaC principles | `___` | B35 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B37 | Operational support model | I6: 24/7 **NOT PROVEN**; hybrid acceptable **not selected**. Owner O12 unanswered. | Who operates Production, and what on-call is required for immediate recovery initiation? | Support model — **not selected here** | `___` | Owner O12; C12 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |
| B38 | Recovery evidence requirements | Fact pack Section 7 Q11: evidence **required**, **none claimed** | What dated evidence will prove RTO/RPO/integrity before Production? | Evidence catalogue | `___` | B15; B16; B7–B9 | OPEN — REQUIRES IT/SECURITY VALIDATION | Name `________________` Date `________________` |

---

# Part C — Finance validation

**Do not invent monetary values.**  
Where no figure exists, the decision field is:

`UNANSWERED — REQUIRES FINANCE/OWNER INPUT`

Stage 1: cost must not override material security, compliance, recoverability, or BCM. Future packet must compare **A** recommended balanced, **B** lower-cost viable, **C** higher-control/resilience, each with comparable **3-year TCO**. O10 remains without a figure.

| ID | Decision required | Why it matters | Evidence / estimate required | Finance decision | Finance reviewer / attestation |
| --- | --- | --- | --- | --- | --- |
| C1 | Initial implementation budget | Filters viable hosting/resilience options | Comparable implementation estimates for option classes **A/B/C** (not selected) | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C2 | Maximum recurring annual operating budget | Recurring opex may rule out HA/DR classes | Hosting+ops+security+support estimates | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C3 | Maximum acceptable monthly hosting cost | May cap region/HA choices | Monthly hosting sketches | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C4 | Maximum acceptable annual hosting/technology cost | Broader than C3 (licences, security, identity) | Annual technology envelope | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C5 | Three-year TCO | Stage 1 requires comparable 3-year TCO for A/B/C | TCO model: compute, DB, storage, backup, DR, network, CDN/WAF, monitoring, logging, security, identity, support, licensing, implementation, migration, testing, professional services, growth, exit | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C6 | Acceptable premium for higher resilience/security/compliance | Stage 1: cost must not override material BCM/security; premium still needs a bound | Delta TCO for meeting B7–B9 vs a weaker class that **fails** business outcomes | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C7 | Lower-cost viable alternative requirement | Stage 1 Decision 11 item B | Option B sketch with TCO; **must still be viable** against MTD/RTO/data-loss — do not select it here | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` (requirement to **include** B in the packet is Stage 1; the **option itself is not selected**) | Name `________________` Date `________________` Decision `___` |
| C8 | Recommended balanced option | Stage 1 Decision 11 item A | Option A sketch with TCO — **not selected here** | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C9 | Higher-control/resilience option | Stage 1 Decision 11 item C | Option C sketch with TCO — **not selected here** | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C10 | Backup/DR cost | Driven by B5–B14; Legal A7–A9 | Backup/DR line items in TCO | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C11 | Security/monitoring cost | Non-negotiables B18–B26, B32 | Security/observability line items | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C12 | Support/operations cost | Immediate recovery initiation; B37 | 24/7 vs business-hours vs hybrid cost | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C13 | Migration / implementation cost | Cutover from Dev/Test in-memory to Production SoR | Implementation/migration estimates | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |
| C14 | Exit / migration cost | Stage 1 portability; A18 | Exit assistance, dual-run, re-platform estimates. **Duration/fees not invented** | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Name `________________` Date `________________` Decision `___` |

---

# Part D — Cross-discipline decision matrix

These cannot be finalized independently. **None is finalized in this pack.**

| # | Decision | Disciplines | Why it is joint | Current state |
| --- | --- | --- | --- | --- |
| 1 | Hosting jurisdiction | Legal + IT + Owner | Owner candidate (Tanzania) ≠ Legal approval ≠ IT feasibility | **Not approved; no region selected** |
| 2 | Backup/DR jurisdiction | Legal + IT + Owner | Copies are transfers; must still meet RTO/RPO outcomes | **Not approved; no region selected** |
| 3 | Technical RPO | Business + IT + Finance | Zero tolerated **business** loss vs achievable/affordable technical RPO | **Technical RPO not approved** |
| 4 | Recovery architecture | Business + IT + Finance | Outcomes fixed; topology and cost open | **Not selected** |
| 5 | High availability level | Business + IT + Finance | HA class drives TCO and RTO proof | **Not selected** |
| 6 | Data classification and geography | Legal + IT | Restricted/HR rules constrain placement | **No primary jurisdiction approved** |
| 7 | PCI architecture | Legal/Finance + IT | Preferred no-raw-CHD design vs evidenced scope | **`PCI DSS STATUS NOT ESTABLISHED`** |
| 8 | Identity architecture | IT + Security + Legal | Access to personal data; subprocessor locations | **ADR-0013 OPEN; no IdP selected** |
| 9 | Backup retention | Legal + IT + Finance | Legal periods vs storage cost vs restore needs | **No period set** |
| 10 | Vendor lock-in / portability | Owner + IT + Finance | Stage 1 low lock-in vs managed-cloud preference vs TCO | **Principles only; no provider** |

---

# Part E — Decision priority

Dependency order for unresolved Stage 2 work (no repository evidence showed a better order):

| Priority | Focus |
| --- | --- |
| **1** | Technical/business RTO/RPO feasibility (B7–B9, B13–B14 vs Stage 1 outcomes) |
| **2** | Legal/DPO Production and DR geography constraints (A6–A10) |
| **3** | Hosting and resilience architecture **options** (not a final selection) |
| **4** | Finance/TCO constraints (C1–C10) |
| **5** | Security/identity/secrets architecture (B18–B28; ADR-0012/0013) |
| **6** | Operational support and recovery testing (B15–B16, B37–B38) |
| **7** | Portability and exit requirements (B35–B36, C14, A18) |

---

# Part F — Architecture gate

The purpose of Stage 2 is to establish the **constraints and evidence** required for the ADR-0006 architecture decision.

**Stage 2 does not itself select the final Production architecture.**

The eventual ADR-0006 decision package must compare viable options against:

- business continuity
- RTO/RPO
- data residency
- privacy
- security
- PCI
- cost/TCO
- scalability
- operational support
- portability
- exit risk

Options remain DP-0006 sketches A–D **unselected**. Stage 1 requires the packet to include a recommended balanced option, a lower-cost viable option, and a higher-control/resilience option where justified, with comparable 3-year TCO.

---

# Part G — Governance status

Current status:  
`RED — ADR-0006 NOT CLEARED`

ADR-0006:  
`PROPOSED — BLOCKED FOR PRODUCTION`

DP-0006:  
`OPEN — NOT APPROVED`

Production:  
`NOT AUTHORIZED`

Deployment:  
`NOT AUTHORIZED`

Migrations:  
`NOT AUTHORIZED`

Architecture:  
`NOT FINALLY APPROVED`

Stage 2:  
`VALIDATION / DECISION PREPARATION`

Implementation authorization:  
`NOT CREATED BY THIS DOCUMENT`

---

## Ready for stakeholder decision?

**Yes, as a validation worksheet:** Legal/DPO, IT/Security, and Finance can now record decisions against A1–A20, B1–B38, and C1–C14.

**No, as an ADR-0006 clearance package:** named reviewers are blank; all Status fields remain OPEN; no geography, provider, technical RPO, recovery topology, or budget is approved.

Next sequence (do not skip):

`Stage 2 validation (this pack, when attested)`  
→ `ADR-0006 Decision Package (options A/B/C + TCO)`  
→ `Owner/Legal/IT/Finance Decision`  
→ `ADR-0006 / DP-0006 Update`  
→ `Architecture Decision`  
→ `Separate Implementation Authorization`
