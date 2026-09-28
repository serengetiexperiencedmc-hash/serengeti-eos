# ADR-0006 Legal / Data-Placement Evidence Package

> **`DRAFT — LEGAL / DATA-PLACEMENT EVIDENCE PACKAGE — NOT LEGAL APPROVAL`**  
> **STAGE: 4A — GATE E1**  
> **STATUS: `OPEN — REQUIRES LEGAL/DPO VALIDATION`**

This package collects **decision-quality questions, matrices, and evidence requirements** for Gate E1. It is **not** legal advice, regulatory approval, DPO approval, Owner signature, stakeholder attestation, provider contractual commitment, jurisdictional guarantee, or compliance certification.

Where evidence is unavailable, status is: `UNKNOWN` · `REQUIRES LEGAL/DPO VALIDATION` · `REQUIRES PROVIDER CONTRACT REVIEW` · `REQUIRES EVIDENCE`.

**Gate source:** [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) § Gate E1  
**Draft Legal text (not attested):** [`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md) L1–L17, Section 8  
**Stage 1 business geography:** [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) Decision 7  
**Stage 2 Legal rows:** [`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md) A1–A20  

This document does **not** change Stage 1/2/3 decisions, ADR-0006, or DP-0006.

---

# 3. Baseline legal position

**Primary design baseline (draft; not Legal/DPO attestation):**

- Tanzania’s Personal Data Protection Act, 2022 and applicable regulations.

**Potentially applicable** depending on data subjects, customers, processing activities and territorial scope — **not automatically applicable:**

- Kenya data protection requirements  
- GDPR  
- UK GDPR  
- other applicable international privacy/data-protection regimes  

**Applicability must be determined according to the actual processing activities, data subjects, counterparties and territorial scope.**

Controller/legal-entity establishment remains `UNKNOWN` (fact pack O1 / L1). No hosting jurisdiction is selected here.

---

# 4. Data categories — legal-placement matrix

Categories align with fact pack L7 (draft inventory, not a RoPA). Restricted / Highly Restricted **schedules are not approved**; rows 8–9 are **governance labels pending Legal/DPO classification**, not invented approved classes that override the fact pack.

**Placement columns:** `NOT APPROVED` / `UNKNOWN` unless an authoritative attested record says otherwise. None does.

| # | Data category | Likely sensitivity (draft) | Production placement | Backup placement | DR placement | Warm-standby placement | Foreign support access | Logging/monitoring | Transfer considerations | Legal status | Evidence required |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Ordinary business data | Lower relative to identity/travel/payment; still may include commercial confidentiality | NOT APPROVED | NOT APPROVED (separate decision) | NOT APPROVED | NOT APPROVED | REQUIRES LEGAL/DPO + IT/SECURITY VALIDATION | UNKNOWN destinations | Treat copies as transfers if they leave the processing jurisdiction | REQUIRES LEGAL/DPO VALIDATION | Classification schedule; processing map |
| 2 | Customer/client contact data | PII — stronger controls (L7) | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Identifiers in logs: minimisation required (residency Q13 draft) | Cross-border = controlled legal requirement (L9) | REQUIRES LEGAL/DPO VALIDATION | Data-subject map (L8 UNKNOWN) |
| 3 | Employee data | PII — stronger controls (L7) | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Same | Employment + privacy law overlay `UNKNOWN` | REQUIRES LEGAL/DPO VALIDATION | HR processing inventory |
| 4 | Passport/identity information | High — stronger controls (L7) | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Avoid unnecessary copies in logs | Heightened transfer/security assessment | REQUIRES LEGAL/DPO VALIDATION | Inventory; legal basis |
| 5 | Travel arrangements | May become sensitive depending on individual/circumstances (L7) | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Same | Purpose limitation; minimisation | REQUIRES LEGAL/DPO VALIDATION | Actual processing inventory |
| 6 | Payment-related **metadata** | Lower than raw CHD; still financial | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Status/reference only by design | PCI: no raw CHD in normal EOS architecture | REQUIRES LEGAL/DPO VALIDATION; PCI evidence open | Processor flows (LE-19) |
| 7 | Potentially sensitive / special-category data | Highest among personal data if processed (L7: potentially; minimise) | NOT APPROVED | NOT APPROVED | NOT APPROVED | NOT APPROVED | Same | Strong minimisation | Heightened legal basis and safeguards | REQUIRES LEGAL/DPO VALIDATION | Confirm whether processed; legal basis |
| 8 | Restricted data | Pending approved schedule (L13: no dedicated determination) | NOT APPROVED — only in jurisdictions later approved for Restricted | NOT APPROVED | NOT APPROVED | NOT APPROVED unless later approved for Restricted | Same | Same | Lawful mechanism + safeguards if cross-border | REQUIRES LEGAL/DPO VALIDATION | Approved classification-to-geography matrix |
| 9 | Highly Restricted data | Default: remain in **primary formally approved** jurisdiction unless Legal/DPO expressly approves otherwise. **Primary jurisdiction is not approved.** | NOT APPROVED | NOT APPROVED (default: not outside primary unless express approval) | NOT APPROVED | Default **no** unless express Legal/DPO approval | Express approval required | Express approval if identifiers leave primary | Any copy/access is a controlled exception | REQUIRES LEGAL/DPO VALIDATION | Confirm default + exception process; **do not treat Tanzania as already approved primary** |
| 10 | Backups containing any of the above | Same as source data | N/A (backup is not Production) | **Separate governance decision** — NOT APPROVED | If backups used for DR, still a copy | N/A | Restore/support access = transfer/access | Backup catalogues may contain identifiers | Backup must not silently introduce unapproved transfer (L12) | REQUIRES LEGAL/DPO VALIDATION | Backup data-flow; encryption; destination |
| 11 | Logs/monitoring containing identifiers | Often PII | NOT APPROVED | Log retention copies NOT APPROVED | Same | Same | Vendor SOC access | **Destinations UNKNOWN** | Telemetry leaving primary = transfer | REQUIRES LEGAL/DPO VALIDATION | Log data-flow; retention; redaction |
| 12 | Support-access data | Whatever the supporter can see | Access location ≠ hosting location | Same | Same | Same | **Separate issue from physical hosting** | Session recordings may be logs | Remote viewing can be a transfer | REQUIRES LEGAL/DPO + IT/SECURITY VALIDATION | Support model; access countries |

Raw payment-card data is **out of normal EOS architecture** (Stage 1 PCI). It is **not** listed as an approved stored category. If discovered, PCI/Legal assessment is required (`PCI DSS STATUS NOT ESTABLISHED`).

---

# 5. Component location matrix

Current status for all rows: **`NOT APPROVED / UNKNOWN`**. No provider selected. ADR-0012/0013 remain OPEN.

| ID | Component | Data processed (typical) | Possible geographic location | Cross-border transfer | Subprocessor implications | Security safeguards (required class, not implemented) | Contractual requirements | Evidence required | Current status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Production application | All classes the app can display/process | Candidate classes A–D; **none selected** | If users, app, or support ≠ data-subject/controller jurisdiction | Hosting provider + PaaS | TLS, IAM, segmentation, secrets | DPA; no silent subprocessors | E1.1; LE-20 | NOT APPROVED / UNKNOWN |
| B | PostgreSQL Production database | Persistent SoR including PII if stored | Same | DB location is primary processing | Managed PG vendor if used | Encryption at rest; access control | Processor terms; location disclosure | LE-01–03 | NOT APPROVED / UNKNOWN |
| C | PostgreSQL backups | Full copies of B | **Separate decision** | Copy = transfer if ≠ Production | Backup vendor/region | Encryption; isolation | Backup location in contract | LE-08 | NOT APPROVED / UNKNOWN |
| D | WAL / PITR archives | Transaction history; may include personal data | **Separate decision** | Same as backups | Archive storage vendor | Encryption; retention control | Retention/deletion | LE-08; LE-16 | NOT APPROVED / UNKNOWN |
| E | DR replica | Copy of B (possibly lagged) | **Separate decision** | Replica location = transfer | DR hosting | Encryption; access; fail-over auth | DR geography in contract | LE-09 | NOT APPROVED / UNKNOWN |
| F | Warm standby | Live/near-live copy | **Separate decision** | Same | Same | Same + continuous access path | Same | LE-10 | NOT APPROVED / UNKNOWN |
| G | Object/file storage | Files/objects; may include identity/travel docs | **Separate / may differ from DB** | Object region = transfer | Object-storage vendor | Encryption; least privilege | Location + subprocessors | E1.1 | NOT APPROVED / UNKNOWN |
| H | Application logs | May contain identifiers | Often vendor SaaS | High risk of extra-region processing | Observability vendor | Minimisation; redaction | Subprocessor + transfer terms | LE-15 | NOT APPROVED / UNKNOWN |
| I | Audit logs | Security/accountability events; identifiers | Same | Same | Same | Integrity; retention | Legal hold / retention | LE-15; LE-16 | NOT APPROVED / UNKNOWN |
| J | Monitoring/telemetry | Metrics, traces, possibly PII in attributes | Same | Same | Same | Minimisation | Same | LE-15 | NOT APPROVED / UNKNOWN |
| K | Identity provider | Authn events, identifiers, MFA | **ADR-0013 OPEN** | IdP region often ≠ app region | IdP subprocessors | MFA; least privilege | DPA; location | LE-13 | NOT APPROVED / UNKNOWN |
| L | Email service | Addresses, message metadata/content if stored | UNKNOWN | Common extra-region processing | Email vendor | Encryption; retention | DPA | LE-12 | NOT APPROVED / UNKNOWN |
| M | CDN | URLs, IPs, cached content; possibly cookies | Edge PoPs worldwide possible | Typical extra-region | CDN subprocessors | TLS; cache policy | DPA; PoP disclosure | LE-14 | NOT APPROVED / UNKNOWN |
| N | WAF | IPs, URLs, payloads (risk of PII in requests) | Edge / vendor cloud | Typical extra-region | WAF vendor | Least privilege; payload handling policy | DPA | LE-14 | NOT APPROVED / UNKNOWN |
| O | Support tooling | Whatever tickets/sessions contain | Vendor + agent location | Support access = transfer/access | ITSM/RMM vendors | Time-limited, MFA, logging | Contractual authorization | LE-11 | NOT APPROVED / UNKNOWN |
| P | External subprocessors | Per service | UNKNOWN until candidates listed as `CANDIDATE — NOT SELECTED` | Each subprocessor location | Chain of processors | Flow-down | Subprocessor schedule | LE-12 | NOT APPROVED / UNKNOWN |

---

# 6. Jurisdiction options (candidates only)

**Do not call any jurisdiction “approved.”**

**Company position to record (governance, not legal advice or approval):**

Tanzania is the preferred jurisdictional **candidate for assessment** because it aligns with the company's operating base and may simplify certain data-governance considerations. **This is a candidate preference, not legal approval.**

| Candidate | Data protection regime | Cross-border implications | Transfer mechanism requirements | Backup/DR implications | Restricted | Highly Restricted | Foreign support | Subprocessors | Regulatory uncertainty | Evidence required | Suitability as **candidate** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **A. Tanzania** | PDPA 2022 + applicable regulations — **design baseline, not attested determination** | Onshore Production may still involve **foreign** SaaS, support, logs | If data stays in TZ, some transfers may still arise from K–P above | Backup/DR in TZ **or** abroad are **separate** decisions; TZ Production ≠ automatic TZ backups | Still requires approved Restricted rules | Default: primary **approved** jurisdiction — **TZ is not that approval yet** | TZ hosting does not legalise foreign admin access | Local facility still has vendors | Permit/notification `UNKNOWN` | LE-01, LE-02, LE-04, facility/legal due diligence | **Preferred candidate for assessment** |
| **B. Kenya** | Kenya DPA — **assess where Kenyan-jurisdiction processing exists**; not all-SEDMC determination | Kenya Production may be a transfer from TZ controller (establishment `UNKNOWN`) | `REQUIRES LEGAL/DPO VALIDATION` | Copies in Kenya vs TZ vs third country — all assessed | Same | Same | Same | Same | Applicability facts incomplete | LE-05 | **Comparison candidate** — not approved |
| **C. EU/EEA** | GDPR **potentially** applicable, **not automatically**. EU hosting is **not** automatically lawful or unlawful | TZ→EU and (if GDPR applies) EU→non-EEA both need assessment | If GDPR applies: appropriate mechanism; ordinary cloud contract **not assumed sufficient**. **No SCCs/adequacy cited** | EU backup/DR is additional processing | Same | Same | EU vendor support may still be extra-EEA | Hyperscale subprocessors typical | Territorial scope `UNKNOWN` | LE-06, LE-07 | **Comparison candidate** — not approved |
| **D. Other** | Map by data-subject/customer/processing (L6); markets listed in L6 are **not** approved geography | Each destination is a transfer analysis | Per destination law | Same | Same | Same | Same | Same | High until mapped | L6 census; LE-03 | Only if evidence supports — **not selected** |

---

# 7. Highly Restricted data

**Existing company position (Stage 1 / fact pack matrix):**

Highly Restricted data should, **by default**, remain within the **primary formally approved** jurisdiction unless Legal/DPO **expressly** approves foreign processing, backup, replication, DR, support access or other transfer.

**This is not a claim that Tanzania is already the approved primary jurisdiction.** No primary jurisdiction is currently approved.

---

# 8. Cross-border transfer control

**Required before any Production cross-border processing** (none of these is recorded as obtained):

| Control | Status |
| --- | --- |
| Identified legal basis | `REQUIRES LEGAL/DPO VALIDATION` |
| Applicable transfer mechanism | `UNKNOWN` — none approved |
| Destination documented | `UNKNOWN` — none selected |
| Recipient documented | `UNKNOWN` |
| Purpose documented | `REQUIRES EVIDENCE` |
| Data categories documented | `REQUIRES EVIDENCE` (inventory incomplete) |
| Minimisation | `REQUIRES LEGAL/DPO VALIDATION` |
| Contractual safeguards | `REQUIRES PROVIDER CONTRACT REVIEW` |
| Processor/subprocessor controls | `REQUIRES PROVIDER CONTRACT REVIEW` |
| Security controls | `REQUIRES EVIDENCE` |
| Encryption | `REQUIRES EVIDENCE` |
| Access controls | `REQUIRES EVIDENCE` |
| Retention/deletion | `REQUIRES LEGAL/DPO VALIDATION` |
| Incident management | `REQUIRES EVIDENCE` |
| Regulatory permit/approval where required | `UNKNOWN` |
| Documented Owner/Legal/DPO decision | **Not obtained** — no fabricated signature |

---

# 9. Foreign support access

**Separate issue from physical hosting.** Hosting in Tanzania (or anywhere) does **not** automatically authorize foreign administrators.

Must be assessed for: support personnel location; access necessity; legal transfer implications; contractual authorization; least privilege; MFA; time-limited access; logging; approval workflow; emergency access; revocation; data minimisation.

**Status:** `REQUIRES LEGAL/DPO + IT/SECURITY VALIDATION`

---

# 10. Identity / CDN / WAF / logging / email / support platforms

These services **may process metadata (and sometimes content) outside** the application/database region even if Production compute is later placed in a preferred candidate country.

| Service | Provider location | Processing location | Subprocessors | Data categories | Transfer implications | Contractual safeguards | Security controls |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IdP | **No provider selected** (ADR-0013 OPEN) | UNKNOWN | UNKNOWN | Identifiers, auth events | Likely extra-region | `REQUIRES PROVIDER CONTRACT REVIEW` | MFA, logging — not Production-proven |
| Email | **No provider selected** | UNKNOWN | UNKNOWN | Addresses; possible content | Likely extra-region | Same | Encryption/retention `REQUIRES EVIDENCE` |
| CDN | **No provider selected** | Edge UNKNOWN | UNKNOWN | IPs, URLs, cache | Typical extra-region | Same | TLS; cache policy `REQUIRES EVIDENCE` |
| WAF | **No provider selected** | UNKNOWN | UNKNOWN | IPs, URLs, possible payloads | Typical extra-region | Same | Payload handling `REQUIRES EVIDENCE` |
| Monitoring | **No provider selected** | UNKNOWN | UNKNOWN | Metrics/traces; possible PII | High | Same | Minimisation `REQUIRES EVIDENCE` |
| Logging | **No provider selected** | UNKNOWN | UNKNOWN | Identifiers | High | Same | Redaction `REQUIRES EVIDENCE` |
| Support platforms | **No provider selected** | Agent + vendor UNKNOWN | UNKNOWN | Ticket/session contents | Support access = transfer/access | Same | Time-limit, MFA, revoke `REQUIRES EVIDENCE` |

**No provider is selected at this stage.** Later names must be `CANDIDATE — NOT SELECTED`.

---

# 11. Backup / DR / warm-standby residency

- **Backup location is a separate governance decision.**  
- **DR location is a separate governance decision.**  
- **Warm-standby location is a separate governance decision.**

Do **not** assume: Production in Tanzania ⇒ backups must be Tanzania.  
Do **not** assume: Production outside Tanzania ⇒ Tanzania law does not matter.

All locations must be assessed against: data category; applicable law; transfer requirements; business continuity; security; contractual restrictions.

Production replication remains **NOT AUTHORIZED**. Topology remains **NOT SELECTED**.

---

# 12. Legal evidence register

| ID | Requirement | Evidence needed | Source | Owner | Status | Validation date | Decision impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LE-01 | Tanzania PDPA applicability | Legal/DPO determination; any registration | Counsel/DPO; not this pack | Legal/DPO | REQUIRES LEGAL/DPO VALIDATION | | Design baseline vs attested law |
| LE-02 | Applicable regulations | Regulation list + applicability | Same | Legal/DPO | UNKNOWN | | Obligations overlay |
| LE-03 | Cross-border transfer requirements | Transfer assessment | Same | Legal/DPO | UNKNOWN — no mechanism approved | | Blocks foreign copies/support |
| LE-04 | Tanzania destination / foreign-cloud requirements | PDPA transfer/notification/permit check | Same | Legal/DPO | UNKNOWN | | Options A/B/D |
| LE-05 | Kenya applicability | Processing/data-subject facts + legal analysis | Owner facts + Legal | Legal/DPO | REQUIRES LEGAL/DPO VALIDATION | | Option Kenya candidate |
| LE-06 | GDPR applicability triggers | Territorial-scope assessment | Legal/DPO | Legal/DPO | UNKNOWN (not confirmed apply/not apply) | | Option B |
| LE-07 | EU transfer mechanism | If GDPR applies: mechanism + safeguards | Legal/DPO | Legal/DPO | UNKNOWN | | Option B; EU subprocessors |
| LE-08 | Backup residency | Legal position on backup geography | Legal/DPO | Legal/DPO | NOT APPROVED | | Separate from Production |
| LE-09 | DR residency | Legal position on replica geography | Legal/DPO | Legal/DPO | NOT APPROVED | | Separate |
| LE-10 | Warm-standby residency | Legal position if that class is proposed | Legal/DPO | Legal/DPO | NOT APPROVED | | Separate |
| LE-11 | Foreign support access | Access-country rules + contract | Legal + IT | Legal/DPO; IT/Security | REQUIRES LEGAL/DPO + IT/SECURITY VALIDATION | | All options |
| LE-12 | Subprocessor locations | Schedules for any candidate | Provider (candidate only) | Legal; IT | REQUIRES PROVIDER CONTRACT REVIEW | | All options |
| LE-13 | IdP processing location | Candidate IdP locations | Candidate marked not selected | Legal; IT | UNKNOWN | | ADR-0013 still OPEN |
| LE-14 | CDN/WAF processing location | PoP/vendor regions | Candidate | Legal; IT | UNKNOWN | | Edge transfer |
| LE-15 | Logging/monitoring location | Telemetry destinations | Candidate | Legal; IT | UNKNOWN | | Extra-region PII |
| LE-16 | Retention/deletion | Periods by class; backup/WAL | Legal; Owner | Legal/DPO | REQUIRES LEGAL/DPO VALIDATION | | Storage copies |
| LE-17 | Restricted data rule | Approved matrix | Legal; Owner; Security | Legal/DPO | REQUIRES LEGAL/DPO VALIDATION | | Placement |
| LE-18 | Highly Restricted data rule | Confirm default + exceptions; **primary not approved** | Legal; Owner | Legal/DPO | REQUIRES LEGAL/DPO VALIDATION | | Strongest placement constraint |
| LE-19 | PCI / payment-data implications | Flows; processor evidence; scope | Finance; IT; Legal | Joint | PCI DSS STATUS NOT ESTABLISHED | | CHD must not enter EOS stores/backups/DR by design |
| LE-20 | Contractual requirements | DPA, transfer, audit, deletion, subprocessors | Legal; procurement | Legal/DPO | REQUIRES PROVIDER CONTRACT REVIEW | | Any later provider |

---

# 13. Legal decision options (not a final legal decision)

**Preliminary company governance recommendation (NOT legal advice or approval):**  
**L3** should be treated as the most flexible governance model, with **Tanzania as the preferred candidate for primary hosting assessment** and **stronger restrictions for Highly Restricted data**.

### OPTION L1 — Tanzania-primary

Production and sensitive recovery functions remain in Tanzania **where technically and commercially viable**. Cross-border services only where legally permitted and safeguarded.

| | |
| --- | --- |
| Benefits | Aligns with operating-base **candidate** preference; may reduce some transfer analyses **if** data and copies actually stay in TZ |
| Limitations | Does not by itself approve a facility; SaaS/IdP/CDN/logs/support may still leave TZ; geo-DR may require a second location |
| Risks | Assuming TZ-primary without facility/Legal evidence; treating candidate as approval |
| Evidence required | LE-01–04, LE-08–12, Tanzanian facility/legal due diligence |

### OPTION L2 — Approved-jurisdiction model

Production/backup/DR may be located in **any jurisdiction formally approved** through Legal/DPO assessment.

| | |
| --- | --- |
| Benefits | Fits Option A/B comparison; explicit approval gate |
| Limitations | Requires functioning Legal approval process **before** each location; none approved today |
| Risks | Rubber-stamping a managed-cloud region without transfer analysis |
| Evidence required | LE-03, LE-06–10, per-destination assessment |

### OPTION L3 — Classification-based model

Location controls **vary** by data classification and legal requirements (Restricted vs Highly Restricted vs other).

| | |
| --- | --- |
| Benefits | Matches fact pack matrix intent; allows Highly Restricted default without freezing all data in one unapproved country |
| Limitations | Needs an **approved** classification schedule (not yet); more operational complexity (Option D risk if split) |
| Risks | Split-brain hybrid without Legal rules; Highly Restricted copies in logs/backups forgotten |
| Evidence required | LE-17, LE-18, inventory, component matrix §5 |

---

# 14. Hard legal blockers (would block ADR-0006 approval)

- Unidentified applicable law  
- Unacceptable cross-border transfer exposure  
- No legally acceptable processing location  
- Inability to control backup/DR location  
- Unacceptable subprocessor exposure  
- Unacceptable foreign support access  
- Missing contractual safeguards  
- Required regulatory approval/permit not obtained  
- Inability to satisfy Restricted/Highly Restricted controls  
- Unresolved PCI/data-processing issue  

**None of these is declared as already fatal; none is declared as cleared.** They remain **blocking conditions** until evidence shows otherwise.

---

# 15. Stage 4A / Gate E1 exit criteria

Gate E1 is **sufficiently closed** only when:

1. Applicable legal regimes are identified **sufficiently for architecture decision**;  
2. An acceptable jurisdictional **model** is established (L1/L2/L3 or attested variant);  
3. Production location **requirements** are documented;  
4. Backup location requirements are documented;  
5. DR location requirements are documented;  
6. Warm-standby location requirements are documented;  
7. Cross-border transfer **rules** are documented;  
8. Support-access rules are documented;  
9. Subprocessors are addressed;  
10. Restricted/Highly Restricted treatment is documented;  
11. Legal/DPO review/attestation is obtained **where required**.

**Until then:**

`E1 = OPEN / REQUIRES LEGAL-DPO VALIDATION.`

This package **structures** items 3–10 as requirements; it does **not** satisfy item 11.

---

# 16. Relation to Options A–D

**Do not eliminate any option yet.**

| Option | Legal evidence impact |
| --- | --- |
| **A — African managed cloud** | Legal evidence **required before selection**. Africa ≠ Tanzania. Foreign African region is still a transfer unless Legal says otherwise. |
| **B — EU/EEA managed cloud** | Transfer mechanism **and** GDPR applicability assessment required **where applicable**. EU hosting not automatically lawful or unlawful. |
| **C — Tanzania-controlled hosting** | Still requires **provider/facility/legal/security** evidence. Candidate preference ≠ approval. |
| **D — Hybrid** | Requires the **most detailed** location/transfer mapping because components may span jurisdictions. |

---

# 17. Governance status

E1:  
`OPEN — REQUIRES LEGAL/DPO VALIDATION`

ADR-0006:  
`PROPOSED — NOT APPROVED`

DP-0006:  
`OPEN — NOT APPROVED`

Provider:  
`NOT SELECTED`

Region:  
`NOT SELECTED`

Topology:  
`NOT SELECTED`

Production:  
`NOT AUTHORIZED`

Deployment:  
`NOT AUTHORIZED`

Migrations:  
`NOT AUTHORIZED`

Implementation:  
`NOT AUTHORIZED`

Legal/DPO reviewer (not populated):

Name: `________________`  Date: `________________`  Decision: `___`
