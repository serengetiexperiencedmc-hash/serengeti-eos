# ADR-0006 Gate E1-C01 — SEDMC company factual / business-position responses (LA-01 to LA-17)

> **`COMPANY BUSINESS POSITION — PREPARED`**  
> **`LEGAL COUNSEL DETERMINATION RECORDED — THOMAS NGULUMA — 15 SEPTEMBER 2026`**  
> **`DPO DETERMINATION — NOT ESTABLISHED`**  
> **`E1 OVERALL — NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION HOSTING — NOT AUTHORIZED`**  
> **`E1 OWNER DECISION NOT YET RECORDED`** (as hosting/ADR-0006 approval)

This file records **Serengeti Experience DMC** factual operating positions and preferred business requirements for EOS Production architecture. It supplies the factual/business layer for subsequent qualified Legal/DPO review of [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md).

It does **not** constitute legal advice, a legal opinion, a DPO attestation, regulatory approval, or Production hosting authorization.

**These responses do not close combined Legal/DPO E1-C01.** Legal Counsel determinations are recorded in the attestation instrument (THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N). DPO determination remains **NOT ESTABLISHED**.

`ABSENCE OF AN ATTESTATION IS NOT AN APPROVAL.`  
A Tanzania **preference** is **not** an approved Production jurisdiction.  
A design-basis PDPA statement is **not** attested applicability.

Cursor did **not** invent these positions. They were supplied as company/business input for recording.

Attestation instrument: [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)  
AI-generated counsel-style analysis (not attestation): [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md)  
E1 assessment: [`adr-0006-e1-production-hosting-residency-readiness-assessment.md`](adr-0006-e1-production-hosting-residency-readiness-assessment.md)

---

# SERENGETI EXPERIENCE DMC

## EOS E1 Production Hosting, Data Residency & Privacy

### Company Factual / Business-Position Responses — LA-01 to LA-17

**Status:** COMPANY BUSINESS POSITION — PENDING QUALIFIED LEGAL/DPO VALIDATION

**Purpose:**
This document records Serengeti Experience DMC's factual operating position and preferred business requirements for the EOS Production architecture. It is intended to provide the factual/business layer required for subsequent qualified legal/DPO review.

It does **not** constitute legal advice, a legal opinion, a DPO attestation, regulatory approval, or Production hosting authorization.

---

## LA-01 — Controller / Establishment

### Company position

Serengeti Experience DMC ("SEDMC") is a Tanzania-based business operating from Tanzania and conducting destination-management, MICE, incentive-travel and related commercial activities across Tanzania, East Africa and Indian Ocean destinations.

SEDMC intends to operate EOS as its internal commercial operating platform.

SEDMC will determine the business purposes for which EOS is used, including:

* managing commercial relationships;
* managing organizations and business contacts;
* receiving and managing RFPs;
* preparing programmes and proposals;
* managing commercial costing and approvals;
* managing suppliers and hotels;
* maintaining commercial documents;
* maintaining operational and audit records;
* supporting sales, marketing and programme delivery.

SEDMC will therefore treat itself, for business-planning purposes, as the organization responsible for determining the purposes and principal means of EOS processing.

Third-party technology providers may process data on SEDMC's behalf where necessary to provide hosting, storage, email, identity, security, monitoring, backup or other technology services.

### Business rule

SEDMC does not intend to transfer responsibility for determining the business purposes of EOS processing to a technology provider.

### Legal/DPO validation required

A qualified reviewer must determine the applicable controller/processor relationships for SEDMC, its clients and its technology/service providers.

---

## LA-02 — Tanzania PDPA

### Company position

Tanzania is SEDMC's principal operating jurisdiction.

SEDMC therefore intends the Tanzania Personal Data Protection Act and applicable Tanzanian data-protection requirements to form a primary consideration in the EOS Production architecture.

SEDMC does not intend to design EOS on the assumption that Tanzanian data-protection requirements can be avoided by selecting a foreign hosting provider.

SEDMC will also maintain the ability to identify where its personal data is hosted, backed up, processed and accessed.

### Business requirement

Production architecture must document:

* primary data location;
* backup location;
* DR location;
* administrative-access locations;
* major subprocessors;
* cross-border processing;
* applicable transfer controls.

### Legal/DPO validation required

Confirm the precise applicability of the Tanzania PDPA to SEDMC's activities, registration obligations and specific processing activities.

The PDPC currently states that a person should not collect or process personal data without registration as a controller or processor.

---

## LA-03 — Kenya DPA

### Company position

Kenya is a significant SEDMC destination and commercial market.

SEDMC may process information relating to:

* Kenyan clients;
* Kenyan business contacts;
* Kenyan suppliers;
* Kenyan hotels;
* Kenyan event partners;
* travellers/delegates participating in programmes involving Kenya.

However, SEDMC will **not** treat the mere fact that a programme occurs in Kenya as automatically determining the applicable privacy law.

### Business requirement

The EOS architecture must remain capable of supporting data associated with Kenya without assuming that all such data is legally governed exclusively by Kenyan law.

### Legal/DPO validation required

Determine whether and when Kenyan data-protection law applies to SEDMC's processing based on the actual data subjects, establishment, processing activities and other relevant connecting factors.

---

## LA-04 — GDPR / UK GDPR

### Company position

Europe and the United Kingdom are strategic SEDMC source markets.

SEDMC expects to maintain commercial relationships with:

* European incentive agencies;
* European event agencies;
* PCOs;
* corporate travel companies;
* MICE agencies;
* travel advisors;
* corporate clients;
* other professional buyers.

EOS may therefore contain personal data relating to individuals connected with European and UK organizations.

SEDMC will not design EOS on the assumption that European/UK privacy requirements are irrelevant.

### Business requirement

The architecture should be capable of supporting appropriate privacy, access, retention, security and transfer controls if European/UK requirements become applicable.

### Legal/DPO validation required

Determine whether GDPR and/or UK GDPR applies to SEDMC's actual processing activities and identify the resulting obligations.

---

## LA-05 — Data-Subject Geography

### Company position

EOS is expected to contain business-contact and operational information associated with multiple jurisdictions.

Relevant groups include:

1. SEDMC employees and authorized personnel;
2. corporate clients;
3. incentive planners;
4. event agencies;
5. PCOs;
6. MICE agencies;
7. corporate travel companies;
8. travel agencies and advisors;
9. destination/event specialists;
10. client representatives;
11. programme/delegate contacts where required for delivery;
12. hotels;
13. suppliers;
14. transport and activity partners;
15. other service providers.

SEDMC's target commercial markets include South Africa, Europe, Middle East, Canada, USA, Latin America and other international markets.

### Business position

EOS should therefore be treated as a **multi-jurisdictional business system**, rather than a Tanzania-only information system.

The exact geographical distribution of individual data subjects should be documented as part of Production privacy/data-flow work.

---

## LA-06 — Production Primary-Data Geography

### Company position

SEDMC's preferred Production geography is:

**Primary preference: Tanzania**

SEDMC would prefer the primary Production personal-data SoR to be located in Tanzania if a commercially viable, technically capable and adequately supported solution exists.

SEDMC's preferred order is:

1. Tanzania;
2. another appropriate African jurisdiction, if Tanzania cannot meet the requirements;
3. EU/EEA or another appropriate jurisdiction where necessary and legally acceptable;
4. other jurisdictions only where justified.

### Business rationale

This preference reflects:

* proximity to SEDMC operations;
* operational control;
* simpler governance;
* reduced unnecessary cross-border processing;
* easier understanding of where the primary system resides;
* alignment with SEDMC's Tanzania-based operating model.

This is a **business preference, not a legal conclusion that Tanzania is mandatory**.

---

## LA-07 — Backup Geography

### Company position

SEDMC prefers Production backups to remain within the same approved privacy/residency framework as the primary Production environment.

SEDMC also requires geographic separation sufficient to protect against a localized infrastructure failure.

Therefore:

> **Backup geography should be selected only after considering both business continuity and data-residency requirements.**

SEDMC does not want an overseas backup selected merely because it is cheaper or technically convenient.

### Business requirement

Production backup must ultimately provide:

* encryption;
* controlled access;
* documented jurisdiction;
* defined retention;
* tested restoration;
* integrity verification;
* documented recovery procedures.

---

## LA-08 — DR / Replica Geography

### Company position

SEDMC supports geographically separated DR where necessary to meet its approved business-continuity requirements.

However, SEDMC prefers DR to remain within an approved jurisdictional/data-residency framework.

Preferred order:

1. Tanzania, if technically viable;
2. another approved African jurisdiction;
3. another jurisdiction only following documented legal/privacy assessment.

### Business requirement

SEDMC's previously established business continuity position requires recovery of critical Commercial operations within approximately **3 hours**, with overall business recovery within approximately **4 hours**.

The historical business requirement for zero tolerated business data loss remains important, but this must not be represented as a technically achieved RPO of zero.

---

## LA-09 — Warm Standby Geography

### Company position

SEDMC does **not yet require automatic warm standby as an unconditional Production requirement**.

The preferred initial Production resilience model should be determined after:

* hosting selection;
* Production PostgreSQL architecture;
* backup architecture;
* measured restoration performance;
* cost analysis;
* approved RTO/RPO;
* legal/data-residency assessment.

If warm standby is ultimately required, it should preferably be located in the same approved jurisdictional framework as primary Production.

### Business principle

SEDMC will not purchase architectural complexity merely for theoretical resilience. The resilience architecture must be justified against the business continuity requirements.

---

## LA-10 — Cross-Border Transfers

### Company position

SEDMC expects that some cross-border processing may be operationally relevant because:

* SEDMC serves international clients;
* EOS may contain international business contacts;
* SEDMC operates across multiple East African and Indian Ocean destinations;
* technology providers may operate from jurisdictions outside Tanzania;
* international email, identity, security, monitoring or hosting services may potentially be involved.

However:

> **SEDMC does not want cross-border processing to occur merely for convenience where an appropriate local or regionally suitable alternative exists.**

Cross-border processing should have a documented operational purpose and be subjected to the applicable legal/privacy review.

### Business requirement

The Production architecture must maintain an inventory of material cross-border processing.

The PDPC's current guidance states that transfers outside Tanzania are subject to regulatory oversight and may require a permit and appropriate safeguards.

---

## LA-11 — Transfer Mechanism

### Company position

SEDMC will not pre-select a legal transfer mechanism without qualified legal/DPO review.

SEDMC's business position is:

1. minimize unnecessary international transfers;
2. identify each material transfer;
3. identify the destination and recipient;
4. identify the purpose;
5. use appropriate contractual and technical safeguards;
6. obtain any required regulatory approval/permit;
7. document the resulting decision.

### Business rule

No Production architecture decision should rely on an undocumented assumption that cross-border data transfer is automatically permitted.

---

## LA-12 — Restricted Data

### Company position

SEDMC considers the following information commercially sensitive and/or requiring controlled access:

* client contact information;
* delegate information;
* travel/programme information;
* RFPs;
* proposals;
* client budgets;
* negotiated rates;
* supplier rates;
* hotel rates;
* contracts;
* costing;
* commissions;
* financial/commercial information;
* employee information;
* authentication credentials;
* security information;
* documents containing confidential client information.

The exact statutory classification of each category must be determined separately.

### Business classification

At minimum:

**Restricted**

* commercial contacts;
* RFPs;
* programmes;
* proposals;
* supplier/hotel commercial information;
* internal commercial documents.

**Highly Restricted / Restricted+ candidate data**

* identity documents;
* passport information;
* health/accessibility information;
* financial/payment information;
* authentication credentials;
* other information which SEDMC's formal data-classification policy identifies as requiring the highest protection.

This classification is an **internal security/business classification**, not a claim about statutory "special category" status.

---

## LA-13 — Highly Restricted / Restricted+

### Company position

SEDMC's strongest protection should apply to information such as:

* passport/identity information;
* health or accessibility information;
* financial/payment information;
* authentication credentials;
* security-sensitive information;
* other information formally designated Restricted+.

### Business requirement

Restricted+ information should:

* be minimized;
* have controlled access;
* be encrypted where appropriate;
* be auditable;
* not be unnecessarily replicated;
* not be unnecessarily transferred internationally;
* be included in backup/DR residency assessments.

### Business preference

SEDMC prefers Restricted+ information to remain within the approved primary jurisdictional framework.

Whether a particular category legally constitutes sensitive/special-category data remains a legal/DPO determination.

---

## LA-14 — Restricted+ Failover

### Company position

SEDMC's preferred model is:

> **Restricted+ data should fail over only to a location that has already been approved for the same data-residency and privacy requirements as the primary environment.**

SEDMC does **not** want an emergency architecture that silently moves Restricted+ data to an unapproved foreign jurisdiction.

If a technically necessary emergency alternative exists, its use should require an explicitly defined legal/business exception and appropriate controls.

### Business continuity principle

Business continuity must not be achieved by silently creating an uncontrolled data-residency violation.

---

## LA-15 — Subprocessors

### Company position

SEDMC expects that EOS may require third-party technology providers for:

* cloud hosting;
* PostgreSQL;
* object/document storage;
* email;
* identity;
* monitoring;
* logging;
* WAF/CDN;
* backups;
* security;
* technical support;
* other infrastructure services.

### Business requirement

Before Production approval, material subprocessors should be:

1. identified;
2. documented;
3. associated with their processing purpose;
4. associated with their geographic locations;
5. assessed for data access;
6. covered by appropriate contractual arrangements;
7. assessed for security;
8. assessed for data deletion/exit;
9. assessed for cross-border implications.

SEDMC prefers the ability to replace a material provider without losing access to its core business data.

---

## LA-16 — Administrative / Support Geography

### Company position

SEDMC's normal administrative access should be controlled and preferably performed by authorized personnel operating from approved locations.

Foreign technical support access may be necessary but should not be unrestricted.

### Preferred controls

Where technically supported, foreign support access should be:

* authorized;
* authenticated strongly;
* least-privilege;
* time-limited where practical;
* logged;
* auditable;
* restricted from unnecessary access to personal data;
* governed contractually.

### Business principle

SEDMC wants vendor support capability without granting unnecessary standing access to Production personal data.

---

## LA-17 — Logs / IdP / CDN / WAF / Email

### Company position

SEDMC recognizes that choosing a Production hosting location alone does not establish the geography of all data processing.

The following components must therefore be separately assessed:

* application logs;
* audit logs;
* security monitoring;
* metrics;
* traces;
* identity provider;
* secrets/KMS;
* CDN;
* WAF;
* email;
* object/document storage;
* backups.

### Business requirement

For each material service, Production readiness should document:

1. provider;
2. processing purpose;
3. data potentially exposed;
4. geographic location;
5. subprocessors;
6. administrative access;
7. retention;
8. security controls;
9. cross-border implications;
10. exit/deletion capability.

### Preferred position

Where a technically and commercially viable alternative exists, SEDMC prefers to avoid unnecessary duplication of personal data across jurisdictions.

---

# Executive SEDMC Position

SEDMC's overall business position is:

> **EOS should be designed as a Tanzania-centered, internationally capable commercial platform. Primary Production data should preferably remain in Tanzania where a technically capable and commercially viable solution exists. Backups and DR should be geographically resilient but remain within an approved privacy/residency framework. Cross-border processing should be minimized, documented and legally assessed rather than assumed to be permissible. Restricted+ information should not fail over to an unapproved jurisdiction. Material subprocessors, support access and infrastructure services should be identifiable and auditable before Production approval.**

This position is a **business architecture preference**, not a legal determination.

---

# Owner-Level Working Positions Embedded in This Position

Unless subsequently changed by SEDMC management, the recommended **working** positions are:

| Decision | Recommended SEDMC position |
| --- | --- |
| Primary Production | Tanzania preferred |
| Backup | Approved jurisdictional framework; geographically separated |
| DR | Approved jurisdictional framework |
| Warm standby | Not yet mandatory |
| Cross-border processing | Minimize and document |
| Transfer mechanism | Legal/DPO determination required |
| Restricted+ primary storage | Approved primary jurisdiction preferred |
| Restricted+ failover | Only to pre-approved equivalent jurisdiction |
| Foreign support | Controlled, logged and least privilege |
| Subprocessors | Identify and assess before Production |
| Data portability | Required |
| Production architecture | PostgreSQL as durable SoR |
| Business recovery | Critical ~3h; overall ~4h |
| Technical RPO | Not yet proven/approved |
| Production provider | Not selected |
| Production region | Not selected |
| Production deployment | Not authorized |
| UAT | Not authorized |

These working positions are **not** ADR-0006 approval, DP-0006 approval, provider selection, or Production authorization.

---

# Governance status after these business positions

| Layer | Status |
| --- | --- |
| Company business position (this file) | **PREPARED** |
| E1-C01 Legal/DPO attestation | **STILL REQUIRED** |
| E1 overall | **NOT APPROVED** · **BLOCKED BY MISSING EVIDENCE** |
| Production hosting | **NOT AUTHORIZED** |
| Provider / region | **NOT SELECTED** |
| UAT / deployment / migration / cutover | **NOT AUTHORIZED** |

The qualified reviewer can now review the actual SEDMC position instead of being asked to invent the company's business requirements.

**Database contacted: NO**  
**External/cloud services contacted: NO**  
**Git commit / push / PR / merge: NO**

**STOP** (recording only).
