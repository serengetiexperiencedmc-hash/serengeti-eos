# E1-B — Provider-Neutral Production Hosting & Data-Residency RFI/RFQ

> **`E1-B = RFI/RFQ AND PROVIDER-EVIDENCE PACK PREPARED`**  
> **`E1 = OPTIONS EVALUATION COMPLETE — ARCHITECTURE UNSELECTED`**  
> **`NOT PROVIDER SELECTION`** · **`NOT ARCHITECTURE SELECTION`** · **`NOT PROVIDER CONTACT`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Legal Counsel = COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`** · **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`Tanzania = PREFERRED BASELINE ONLY`**  
> **`Production / UAT / Migration / Deployment = NOT AUTHORIZED`**

**Date (repository calendar):** 2026-09-16.  
**Companions:** [`adr-0006-e1-b-provider-evidence-requirements.md`](adr-0006-e1-b-provider-evidence-requirements.md) · [`adr-0006-e1-b-standard-provider-response-template.md`](adr-0006-e1-b-standard-provider-response-template.md)

This questionnaire is **preparation only**. It is **not** authorization to contact providers, request binding quotes, sign contracts, provision infrastructure, or approve ADR-0006 / DP-0006.

**Intended later use (not executed now):** the **same** questionnaire, identically, for architecture classes:

| Class | Meaning |
| --- | --- |
| A | African managed cloud |
| B | EU/EEA managed cloud |
| C | Tanzania-controlled colocation / local infrastructure |
| D | Hybrid |

No class is ranked. No provider is named. No provider is assumed.

**Company-provided legal name:** Makundi Serengeti Experience DMC — **authoritative registry evidence pending.** Do not treat **Serengeti Experience DMC Ltd** or branding **SEDMC** as verified legal identity. PDPC registration status is **NOT VERIFIED**. DPO is **NOT ESTABLISHED**. THOMAS NGULUMA is **LEGAL COUNSEL ONLY**.

SEDMC budget envelope: **COMPANY DECISION REQUIRED.**

Provider statements are **not** legal conclusions, certifications of SEDMC compliance, or Production evidence.

---

## How to complete (later)

Use the standard response template. For every question supply: Provider answer; Evidence reference; Document/Section/Page/URL; Contractual guarantee (yes/no/unknown); Assumptions; Exceptions; Verification status (**NOT REQUESTED** until a later governed contact).

Do **not** score or rank.

---

## A. Provider identity

| ID | Question |
| --- | --- |
| Q-A-01 | Legal name of the provider entity that would contract. |
| Q-A-02 | Contracting entity (if different from Q-A-01), including registration number and jurisdiction of incorporation. |
| Q-A-03 | Operating entity that would run the service day-to-day (if different). |
| Q-A-04 | All jurisdictions in which the contracting and operating entities are established. |
| Q-A-05 | Data-centre owner/operator for each site that would hold SEDMC data (name, country). |
| Q-A-06 | Named subcontractors that would process SEDMC data (legal name, role, country). |
| Q-A-07 | Ultimate parent / group companies with access to SEDMC data or keys. |
| Q-A-08 | Authorized signatory role for MSA/DPA (name not required in this pack). |

---

## B. Geography

For **each** of Q-B-01–Q-B-16 state: **country**; **region/city where disclosed**; **legal entity/operator**; **whether the location is guaranteed contractually**; **whether data may move automatically** (including failover, replication, support copies, telemetry); **whether support personnel may access data remotely** (countries).

If a component is not offered, answer **NOT APPLICABLE** with reason.

| ID | Component |
| --- | --- |
| Q-B-01 | Primary application hosting |
| Q-B-02 | PostgreSQL |
| Q-B-03 | Object / document storage |
| Q-B-04 | Backups |
| Q-B-05 | PITR / WAL archive |
| Q-B-06 | Disaster recovery (DR) |
| Q-B-07 | Warm standby (if available) |
| Q-B-08 | Logging |
| Q-B-09 | Monitoring |
| Q-B-10 | Identity provider (if offered) |
| Q-B-11 | KMS |
| Q-B-12 | Secrets management |
| Q-B-13 | Email (if offered) |
| Q-B-14 | CDN (if offered) |
| Q-B-15 | WAF (if offered) |
| Q-B-16 | Support and administrative access (personnel geography, not only ticket desk) |
| Q-B-17 | Subprocessor geography (list each subprocessor country of processing) |
| Q-B-18 | Confirm hosting location, processing location, storage location, backup location, DR location, support-access location, and subprocessor location are identified **separately** (not treated as equivalent). |

Keep these concepts separate. A Tanzania-hosted application does **not** automatically mean all processing occurs in Tanzania.

---

## C. Legal / privacy

Provider answers here are **statements of offering**, not SEDMC legal determinations. Tanzania PDPA is the adopted **primary baseline**. Foreign hosting is **not automatically prohibited** and **requires** applicable legal/transfer analysis. Kenya / EU / UK applicability is **fact-specific**. Backups and DR **can** constitute additional processing/transfers. Foreign support access **must** be assessed separately. Restricted+ is an **internal** security classification and is **not** automatically statutory sensitive personal data.

| ID | Question |
| --- | --- |
| Q-C-01 | Provide the form of Data Processing Agreement (DPA) you would execute. Attach draft. |
| Q-C-02 | State the roles you would assume (processor / independent controller / joint controller / other) for (a) infrastructure, (b) managed PostgreSQL, (c) object storage, (d) backups, (e) support. |
| Q-C-03 | Current subprocessor list for the proposed service, with processing purpose and country. |
| Q-C-04 | Change-notification process and objection rights for new subprocessors. |
| Q-C-05 | International transfer mechanisms you rely on (e.g. intra-group, SCC, IDTA, adequacy, permit, other). **Do not assume** a Tanzania PDPC permit exists or is always required. |
| Q-C-06 | Data-residency commitments you will put in a contract (exact wording or template clause). |
| Q-C-07 | Deletion / return of data on termination, including backups and replicas; timeline; certificate of deletion if offered. |
| Q-C-08 | Retention options the customer can configure vs provider-mandated minimums. |
| Q-C-09 | Personal-data incident / breach notification: who is notified, how, and contractual maximum time from awareness. Do **not** treat a marketing “72-hour” claim as SEDMC’s legal clock. |
| Q-C-10 | Government / law-enforcement access process (notice to customer where legally permitted; challenge policy). |
| Q-C-11 | Customer audit rights (scope, frequency, confidentiality). |
| Q-C-12 | Regulatory cooperation (including with a competent data-protection authority). |
| Q-C-13 | Certifications / assurance reports you claim (ISO, SOC, equivalent). Attach **scope** (which services, which locations). Marketing pages are **not** sufficient. |
| Q-C-14 | Confirm you will **not** treat Restricted / Restricted+ / Highly Restricted labels as statutory categories unless a contract maps them. |

PDPC registration of the **customer** is **NOT VERIFIED**. Do not state that the customer is registered, unregistered, or exempt.

---

## D. Tanzania

Tanzania is a **preferred baseline only**, not an approved Production location.

| ID | Question |
| --- | --- |
| Q-D-01 | Can the service host customer data in **Tanzania**? If yes, which components (app, PostgreSQL, objects, backups, DR, logs, KMS)? |
| Q-D-02 | Can Tanzania data residency be **contractually guaranteed**? Quote the clause or state that it cannot. |
| Q-D-03 | Can backups remain within the **same approved jurisdiction** as the primary (once that jurisdiction is later approved by SEDMC)? |
| Q-D-04 | Can DR remain within the same approved jurisdiction? |
| Q-D-05 | Does support access originate **outside Tanzania**? List countries. |
| Q-D-06 | Are subprocessors **outside Tanzania**? List them. |
| Q-D-07 | Do international transfers occur in the default architecture (including telemetry, support copies, DNS, CDN, email, IdP, KMS)? |
| Q-D-08 | How are those transfers controlled and documented (register fields: origin, destination, recipient, purpose, data, mechanism, safeguards)? |

---

## E. PostgreSQL

Intended Production direction: durable **PostgreSQL 16-class** system of record. Process-local application Store is **not** acceptable as Production SoR.

| ID | Question |
| --- | --- |
| Q-E-01 | PostgreSQL **16** support (major version; upgrade path). |
| Q-E-02 | Managed vs self-managed model; who is the DBA. |
| Q-E-03 | High availability design (sync/async; failure domain). |
| Q-E-04 | Replication options and typical/maximum lag under stated assumptions. |
| Q-E-05 | PITR capability and granularity. |
| Q-E-06 | WAL / archive retention (duration, location, independence from primary disk). |
| Q-E-07 | Backup frequency; alignment possible with **19:00 Africa/Nairobi (EAT)** daily encrypted backup + restore proof (ADR-0011 Production product **TBD**). |
| Q-E-08 | Restore process (steps, RTO assumptions, who executes). |
| Q-E-09 | Restore **testing** (customer-initiated? provider-scheduled? evidence provided?). |
| Q-E-10 | Database encryption at rest and in transit. |
| Q-E-11 | Key management for database encryption (who holds keys; customer-managed keys available?). |
| Q-E-12 | Database access control (IAM, roles, network). |
| Q-E-13 | Database audit logging (what is logged; retention; export). |
| Q-E-14 | Maintenance and upgrade policy (notice, customer freeze windows). |
| Q-E-15 | Logical export / dump / portability (pg_dump, logical replication, other). |
| Q-E-16 | Fail-closed behaviour if the database is unavailable (provider description of write rejection vs silent local buffering). |

---

## F. Object / document storage

Production object store is **unselected**. Dev `LocalFsDocumentStorage` is **not** Production.

| ID | Question |
| --- | --- |
| Q-F-01 | S3-compatible or equivalent API; document the compatibility surface. |
| Q-F-02 | Encryption at rest and in transit. |
| Q-F-03 | Key management / customer-managed keys. |
| Q-F-04 | Geographic placement (country/region) and contractual lock. |
| Q-F-05 | Replication (same-region / cross-region) and whether it is automatic. |
| Q-F-06 | Backup of object data independent of the bucket. |
| Q-F-07 | Retention and legal-hold options. |
| Q-F-08 | Deletion (including versioned objects and replicas). |
| Q-F-09 | Versioning. |
| Q-F-10 | Export / bulk retrieval. |
| Q-F-11 | Lifecycle policies. |
| Q-F-12 | Access logging and portability of those logs. |

---

## G. Recovery

**SEDMC business targets (not technical proof):** critical functions **<= 3 hours**; overall **<= 4 hours**; **zero tolerated BUSINESS data loss**. Technical RPO is **NOT** defined as zero. Do **not** equate business zero-loss with technical RPO = 0.

State **actual technical capability** and **assumptions** (failure model, detection time, people, DNS, object-store restore, IdP).

| ID | Question |
| --- | --- |
| Q-G-01 | Stated technical RTO for (a) database restore, (b) full-environment recovery, under a documented failure model. |
| Q-G-02 | Stated technical RPO for (a) backup-only, (b) PITR, (c) sync replica, (d) async geo replica. |
| Q-G-03 | Backup frequency. |
| Q-G-04 | PITR granularity. |
| Q-G-05 | Restore duration evidence (last test: date, dataset size, measured time). |
| Q-G-06 | Full-environment recovery (app + PostgreSQL + documents + identity). |
| Q-G-07 | Database recovery procedure. |
| Q-G-08 | Document/object recovery procedure. |
| Q-G-09 | Failover procedure and who authorizes it. |
| Q-G-10 | Failback procedure. |
| Q-G-11 | DR testing cadence and customer participation. |
| Q-G-12 | Attach evidence from recovery tests (scope, results, limitations). Lab or other-customer tests are **not** SEDMC Production evidence. |

Warm standby is **not automatically legally mandatory**. If offered, describe it under Q-B-07 and Q-G-09.

---

## H. Security

ADR-0012 (secrets/KMS) and ADR-0013 (IdP) remain **OPEN**. Do not claim SEDMC implementation.

| ID | Question |
| --- | --- |
| Q-H-01 | TLS versions and cipher policy for data in transit. |
| Q-H-02 | Encryption at rest (volumes, database, objects). |
| Q-H-03 | Backup encryption. |
| Q-H-04 | KMS product and **key ownership/control** (provider vs customer). |
| Q-H-05 | Secrets-management offering. |
| Q-H-06 | IAM model. |
| Q-H-07 | MFA for console, API, and privileged access. |
| Q-H-08 | Privileged-access management and just-in-time access. |
| Q-H-09 | Audit logging of access to customer data and keys. |
| Q-H-10 | Monitoring / detection capabilities offered. |
| Q-H-11 | Vulnerability management (scan cadence, patch SLA). |
| Q-H-12 | Network isolation (VPC/VNet/equivalent, private DB endpoints). |
| Q-H-13 | WAF and DDoS controls (if offered). |
| Q-H-14 | Incident-response process for provider-side incidents affecting the customer. |
| Q-H-15 | Penetration testing / independent assurance (scope, recency, sharing terms). |
| Q-H-16 | Security certifications **in scope for the proposed regions/services**. |

---

## I. Support

Foreign support access is **conditionally permissible with controls** (least privilege, MFA, individual accounts, logging, approval, confidentiality, review). Countries are **unknown** until answered.

| ID | Question |
| --- | --- |
| Q-I-01 | Support hours and languages. |
| Q-I-02 | 24/7 availability (yes/no; which severity). |
| Q-I-03 | Escalation matrix (severity → response/restore **targets**, not SEDMC legal clocks). |
| Q-I-04 | Support geography (countries of personnel who can access systems/data). |
| Q-I-05 | Remote administrative access to customer environments. |
| Q-I-06 | Privileged support access (break-glass). |
| Q-I-07 | MFA for support access. |
| Q-I-08 | Logging of support sessions. |
| Q-I-09 | Customer **approval** required before support access (yes/no/exceptions). |
| Q-I-10 | Emergency access procedures when the customer is unreachable. |

---

## J. Availability

| ID | Question |
| --- | --- |
| Q-J-01 | SLA document (attach). |
| Q-J-02 | Uptime commitment (measurement method, credits). |
| Q-J-03 | Maintenance windows. |
| Q-J-04 | Planned-maintenance notice period. |
| Q-J-05 | Redundancy description. |
| Q-J-06 | Failure domains (disk, host, rack, AZ, region). |
| Q-J-07 | Database HA as included vs optional. |
| Q-J-08 | Network redundancy. |
| Q-J-09 | Power redundancy (especially Class C facilities). |
| Q-J-10 | DR capabilities included vs optional. |

---

## K. Capacity

**Planning assumptions only — not measured Production requirements:** up to **500 users**; up to **200 concurrent users**; approximately **30%** annual growth for modelling.

| ID | Question |
| --- | --- |
| Q-K-01 | Compute sizing you would propose under the planning assumptions (vCPU/RAM; label as **assumption**). |
| Q-K-02 | Memory. |
| Q-K-03 | Storage (DB and objects) initial and Year-3 under 30% growth **assumption**. |
| Q-K-04 | IOPS / throughput class. |
| Q-K-05 | Network bandwidth assumptions. |
| Q-K-06 | Database limits (connections, size, IOPS). |
| Q-K-07 | Scaling method (vertical/horizontal) and scaling time. |
| Q-K-08 | Maximum supported capacity you will contractually support. |
| Q-K-09 | Capacity reservations / committed use. |
| Q-K-10 | State any planning-assumption changes you require. |

---

## L. Cost

**Do not invent a SEDMC budget. COMPANY DECISION REQUIRED.** All quoted amounts must be labelled **QUOTE** with currency, tax treatment, assumptions, and volume basis. Zero is not a placeholder for unknown.

Provide a standardized quotation covering:

| Line | Include |
| --- | --- |
| Q-L-01 | One-time: setup, implementation, migration, recovery-testing workshop, professional services |
| Q-L-02 | Recurring monthly: compute, database, storage, object storage, backup, PITR, DR, standby, bandwidth, egress, monitoring, logging, WAF, CDN, KMS, secrets, IdP, email, support |
| Q-L-03 | Annualised total of Q-L-02 |
| Q-L-04 | Taxes |
| Q-L-05 | Contract minimums / minimum commitments |
| Q-L-06 | Termination fees |
| Q-L-07 | Data retrieval / egress charges on exit |
| Q-L-08 | Optional costs not in the base quote; currency; tax treatment; validity period of the quote |

Also state: monthly estimate; annual estimate; one-time costs; optional costs; assumptions; volume assumptions.

This pack does **not** request a binding quote and does **not** authorize sending this questionnaire.

---

## M. Portability and exit

| ID | Question |
| --- | --- |
| Q-M-01 | PostgreSQL export method and format. |
| Q-M-02 | Document / object export. |
| Q-M-03 | Database dump (logical). |
| Q-M-04 | Backup export to customer-controlled media. |
| Q-M-05 | Configuration export. |
| Q-M-06 | Infrastructure-as-code / image portability (what is proprietary). |
| Q-M-07 | DNS migration assistance. |
| Q-M-08 | Identity migration (if IdP hosted). |
| Q-M-09 | Log export. |
| Q-M-10 | Data deletion process and any deletion certificate. |
| Q-M-11 | Exit assistance (hours included). |
| Q-M-12 | Migration assistance to a successor. |
| Q-M-13 | Termination notice period. |
| Q-M-14 | Exit fees and egress fees (point to Q-L-06/Q-L-07). |

---

## N. Contracts

| ID | Question |
| --- | --- |
| Q-N-01 | Master Service Agreement (attach draft). |
| Q-N-02 | DPA (cross-ref Q-C-01). |
| Q-N-03 | SLA (cross-ref Q-J-01). |
| Q-N-04 | Security addendum. |
| Q-N-05 | Subprocessor terms. |
| Q-N-06 | Incident-notification terms. |
| Q-N-07 | Data-deletion terms. |
| Q-N-08 | Residency commitments (cross-ref Q-C-06, Q-D-02). |
| Q-N-09 | Transfer terms. |
| Q-N-10 | Audit terms. |
| Q-N-11 | Liability and insurance. |
| Q-N-12 | Business-continuity obligations in contract. |

---

## Explicit non-actions

This document does **not**: contact any provider; select Classes A–D; select a region; approve ADR-0006 or DP-0006; appoint a DPO; claim PDPC registration; verify the company legal name; authorize UAT, Production, migration, or deployment.

**E1-B: RFI/RFQ PREPARED — NO PROVIDER CONTACTED.**
