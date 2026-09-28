# E1-B — SEDMC Company-Side Response to the Provider-Neutral RFI/RFQ

> **`INTERNAL COMPANY ANSWER SET — NOT A PROVIDER RESPONSE`**  
> **`NOT THE FROZEN QUESTIONNAIRE`** · **`FROZEN QUESTIONNAIRE NOT MODIFIED`**  
> **`RFI AUTHORIZED BUT NOT SENT`**  
> **`Architecture UNSELECTED`** · **`Provider UNSELECTED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Legal Counsel = COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL ONLY — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`** · **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`Production / UAT / Migration / Deployment / Contracting = NOT AUTHORIZED`**

**Company-provided legal name:** Makundi Serengeti Experience DMC — **authoritative registry evidence pending.**  
**Brand/trading reference (not verified legal identity):** Serengeti Experience DMC / SEDMC.  
**Website (company-supplied):** https://www.serengetiexperiencedmc.com  
**RFP mailbox (company-supplied):** rfp@serengetiexperiencedmc.com  
**Date:** 2026-09-17.

**Frozen source (recovered, not rewritten):** [`adr-0006-e1-b-provider-neutral-rfi-rfq.md`](adr-0006-e1-b-provider-neutral-rfi-rfq.md) — 168 questions; worktree SHA-256 `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE`.  
**PE source:** [`adr-0006-e1-b-provider-evidence-requirements.md`](adr-0006-e1-b-provider-evidence-requirements.md) — PE-01–PE-48.  
**Response structure source:** [`adr-0006-e1-b-standard-provider-response-template.md`](adr-0006-e1-b-standard-provider-response-template.md).

This file states **SEDMC requirements, facts, and constraints** against each Q-ID. It does **not** answer for any provider. It does **not** select architecture or provider. It is **not** a signature on the RFI.

**Companions:** [`adr-0006-e1-b-company-response-human-required-register.md`](adr-0006-e1-b-company-response-human-required-register.md) · [`adr-0006-e1-b-company-response-summary.md`](adr-0006-e1-b-company-response-summary.md)

---

## Status vocabulary

| Status | Meaning |
| --- | --- |
| ANSWERED | Established company fact or delegated requirement fully states SEDMC’s position. |
| ANSWERED WITH CONDITION | Company position can be stated; still depends on unresolved governance, legal, or provider evidence. |
| COMPANY DECISION | A genuine policy choice is required and is not yet closed. |
| HUMAN EVIDENCE REQUIRED | Needs a name, signature, certificate, registration, appointment, contract, or other human/external artefact. |
| PROVIDER RESPONSE REQUIRED | The Q-ID asks for the provider’s capability, identity, location, price, or evidence. |
| NOT APPLICABLE | Clearly justified. |
| DO NOT ANSWER / OUT OF SCOPE | Outside the RFI’s legitimate purpose. |

Where a Q-ID is primarily a provider question, status is **PROVIDER RESPONSE REQUIRED**. SEDMC’s **evaluation requirement** is still stated so later E1-B3 intake has a company baseline. That baseline is **not** a score.

---

## Company baseline (applies to all Q-IDs)

| Topic | Established position |
| --- | --- |
| Business | Boutique B2B DMC; East Africa and Indian Ocean; MICE/incentive priority. |
| Destinations (company-supplied) | Tanzania, Kenya, Rwanda, Uganda, Zanzibar, Ethiopia, Seychelles, Mauritius. |
| Target markets (company-supplied) | South Africa, Europe, Middle East, Canada, USA, Latin America. |
| Buyer categories (company-supplied) | Incentive/event agencies, PCOs, corporate travel, MICE, destination specialists, travel/luxury advisors, consortia, tour operators. |
| Critical business function (this session) | Sales & Marketing / Commercial and CRM. |
| Recovery sequence (this session — see condition) | 1 Commercial · 2 Finance · 3 Operations · 4 CRM · 5 Procurement/Suppliers. Programme Building depends on Finance and Suppliers. |
| Prior BCM pack (not rewritten) | Jointly critical Commercial/RFP + Programme Building; different sequence recorded historically. **COMPANY DECISION** to reconcile; this file does not overwrite the BCM pack. |
| Business recovery | Critical ~3 hours / MTD 3h; overall 4 hours; zero tolerated **business** data loss. **Not** technical RPO=0. |
| Warm standby / geo-DR | Architectural **candidates**, not selected. Restore-from-backup is a desired capability. |
| Legal | Tanzania PDPA 2022 primary baseline. Kenya DPA / GDPR / UK GDPR **fact-specific**. No universal transfer mechanism selected. |
| E-01 / E-02 / E-03 | Name company-supplied, **NOT VERIFIED**. PDPC **NOT VERIFIED**. DPO **NOT ESTABLISHED**. THOMAS NGULUMA is **LEGAL COUNSEL ONLY**. |
| Architecture / provider | Classes A–D **unranked**. None selected. ADR-0006 OPEN. DP-0006 OPEN. |
| Planning assumptions | Up to ~500 users; up to ~200 concurrent; ~30% growth. **Not** contractual commitments. |
| Budget | **COMPANY DECISION REQUIRED** — no number invented. |
| Production controls | Not claimed implemented. Requirements to evaluate. PCI/raw card storage must not be invented; avoid raw card storage. |

---

## A. Provider identity

| Q-ID | Question (frozen) | Status | SEDMC position |
| --- | --- | --- | --- |
| Q-A-01 | Legal name of the provider entity that would contract. | PROVIDER RESPONSE REQUIRED | SEDMC requires the contracting legal name. Does not select a provider. |
| Q-A-02 | Contracting entity, registration number, jurisdiction. | PROVIDER RESPONSE REQUIRED | Required for later contracting. SEDMC’s own registration number is **HUMAN EVIDENCE REQUIRED** (E-01) and is **not** this Q-ID. |
| Q-A-03 | Operating entity. | PROVIDER RESPONSE REQUIRED | Must be identified if different from contracting entity. |
| Q-A-04 | Jurisdictions of establishment. | PROVIDER RESPONSE REQUIRED | Required for transfer/residency analysis (L-05/L-17 architecture-dependent). |
| Q-A-05 | Data-centre owner/operator. | PROVIDER RESPONSE REQUIRED | Hosting location ≠ processing ≠ backup ≠ support access. |
| Q-A-06 | Named subcontractors. | PROVIDER RESPONSE REQUIRED | Subprocessor register required. No SEDMC Production subprocessors are selected. |
| Q-A-07 | Ultimate parent / group access to data or keys. | PROVIDER RESPONSE REQUIRED | Group access is a transfer/access fact, not equivalent to DC country. |
| Q-A-08 | Authorized signatory role for MSA/DPA. | PROVIDER RESPONSE REQUIRED | Provider role only. SEDMC authorized signatory for later MSA: **HUMAN EVIDENCE REQUIRED** (HR-06). Not invented. Legal Counsel is not that signatory by default. |

---

## B. Geography

SEDMC has **not** selected Production, backup, or DR country. Classes A–D remain unranked evaluation categories. Tanzania is a jurisdiction **baseline in existing governance**, **not** an approved Production location and **not** a ranking of Class C.

**SEDMC requirement (all Q-B):** For every in-scope component, the provider must state country; region/city if disclosed; operator; contractual lock; automatic movement; remote support-access countries.

| Q-ID | Component | Status | SEDMC position |
| --- | --- | --- | --- |
| Q-B-01 | Primary application hosting | PROVIDER RESPONSE REQUIRED | Must be identified separately. Unselected. |
| Q-B-02 | PostgreSQL | PROVIDER RESPONSE REQUIRED | Intended durable SoR is PostgreSQL 16-class. Location unselected. |
| Q-B-03 | Object / document storage | PROVIDER RESPONSE REQUIRED | Production object store unselected. Dev local FS is not Production. |
| Q-B-04 | Backups | PROVIDER RESPONSE REQUIRED | Backups can be additional processing/transfer. Same-jurisdiction backup is a **requirement to evaluate**, not a selected topology. |
| Q-B-05 | PITR / WAL | PROVIDER RESPONSE REQUIRED | WAL location must be disclosed. |
| Q-B-06 | DR | PROVIDER RESPONSE REQUIRED | DR unselected. Restricted/Highly Restricted must not fail over to an **unapproved** geography. |
| Q-B-07 | Warm standby | PROVIDER RESPONSE REQUIRED | Candidate capability, **not selected**, not automatically legally mandatory. |
| Q-B-08 | Logging | PROVIDER RESPONSE REQUIRED | Log geography can be personal-data processing. |
| Q-B-09 | Monitoring | PROVIDER RESPONSE REQUIRED | Telemetry geography must be disclosed. |
| Q-B-10 | IdP | PROVIDER RESPONSE REQUIRED | ADR-0013 OPEN. If offered, location REQUIRES RFI. |
| Q-B-11 | KMS | PROVIDER RESPONSE REQUIRED | ADR-0012 OPEN. Key geography and control required. |
| Q-B-12 | Secrets | PROVIDER RESPONSE REQUIRED | ADR-0012 OPEN. |
| Q-B-13 | Email | PROVIDER RESPONSE REQUIRED | If in hosting scope. Company RFP mailbox exists; Production email provider unselected. |
| Q-B-14 | CDN | PROVIDER RESPONSE REQUIRED | If offered; PoP countries can be transfers. |
| Q-B-15 | WAF | PROVIDER RESPONSE REQUIRED | If offered. |
| Q-B-16 | Support / admin access | PROVIDER RESPONSE REQUIRED | Foreign support conditionally permissible with least privilege, MFA, individual accounts, logging, approval, confidentiality, review, time-limited access where practical. Countries unknown until provider answers. |
| Q-B-17 | Subprocessor geography | PROVIDER RESPONSE REQUIRED | Each subprocessor country of processing. |
| Q-B-18 | Identify hosting/processing/storage/backup/DR/support/subprocessor **separately** | ANSWERED | **SEDMC requires this separation.** A Tanzania-hosted app does not mean all processing is in Tanzania. Provider must confirm they will identify them separately. |

---

## C. Legal / privacy

Tanzania PDPA 2022 is the adopted **primary baseline**. Foreign hosting is **not automatically prohibited** and is **not automatically lawful**. Kenya / EU / UK applicability is **fact-specific**. No transfer mechanism selected. No Production country approved. Restricted / Restricted+ / Highly Restricted are **internal** classifications, not statutory.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-C-01 | PROVIDER RESPONSE REQUIRED | SEDMC requires an executable DPA covering infra, DB, objects, backups, support. Draft must be supplied. Not a completed transfer determination. |
| Q-C-02 | PROVIDER RESPONSE REQUIRED | Provider role labels are not automatically SEDMC determinations. SEDMC acts as controller for EOS personal data unless a later determination says otherwise (LA-01 framework). |
| Q-C-03 | PROVIDER RESPONSE REQUIRED | Current subprocessor list with purpose and country. |
| Q-C-04 | ANSWERED WITH CONDITION | SEDMC requires change-notification and a practical objection path. Exact clause: provider draft. |
| Q-C-05 | ANSWERED WITH CONDITION | **No** universal mechanism selected. Do not assume a PDPC permit exists or is always required. Provider must state what **they** rely on. Lawfulness remains counsel/future DPO. |
| Q-C-06 | ANSWERED WITH CONDITION | SEDMC requires contractual residency wording (or an explicit statement that it cannot be guaranteed), including failover/support/telemetry exceptions. Jurisdiction itself **unselected**. |
| Q-C-07 | ANSWERED WITH CONDITION | SEDMC requires deletion/return including backups/replicas, a timeline, and a deletion certificate if offered. Retention periods E-13 TBD. |
| Q-C-08 | ANSWERED WITH CONDITION | SEDMC requires visibility of customer-configurable vs provider-mandated minimums. Periods not yet set (E-13). |
| Q-C-09 | ANSWERED WITH CONDITION | Marketing “72-hour” is **not** SEDMC’s legal clock. Provider contractual maximum from awareness must be stated. SEDMC incident process is draft (E-15); DPO not established. |
| Q-C-10 | PROVIDER RESPONSE REQUIRED | Government-access process and customer notice where legally permitted. |
| Q-C-11 | ANSWERED WITH CONDITION | SEDMC requires customer audit rights (scope, frequency, confidentiality) in contract. Exact terms: provider draft + legal review. |
| Q-C-12 | ANSWERED WITH CONDITION | SEDMC requires regulatory cooperation including with a competent DPA. PDPC status of SEDMC is **NOT VERIFIED**. |
| Q-C-13 | PROVIDER RESPONSE REQUIRED | Certifications **with scope** (services and locations). Marketing is not SEDMC compliance. |
| Q-C-14 | ANSWERED | **SEDMC requires** that Restricted / Restricted+ / Highly Restricted **not** be treated as statutory categories unless a contract maps them. Provider must confirm. |

PDPC of the **customer** remains NOT VERIFIED. Do not state registered, unregistered, or exempt.

---

## D. Tanzania

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-D-01 | PROVIDER RESPONSE REQUIRED | Company asks whether data **can** be hosted in Tanzania, by component. This is **not** selection of Tanzania as Production. |
| Q-D-02 | PROVIDER RESPONSE REQUIRED | Company requires a yes/no on **contractual** Tanzania residency guarantee, or an explicit cannot. Not a Production approval. |
| Q-D-03 | ANSWERED WITH CONDITION | SEDMC requires the ability to keep backups in the **same later-approved** jurisdiction as primary. Approved jurisdiction does not yet exist. |
| Q-D-04 | ANSWERED WITH CONDITION | Same for DR. Restricted/Highly Restricted must not fail over to an unapproved geography. |
| Q-D-05 | PROVIDER RESPONSE REQUIRED | Foreign support origin countries. Controls as Q-B-16. |
| Q-D-06 | PROVIDER RESPONSE REQUIRED | Subprocessors outside Tanzania must be listed. |
| Q-D-07 | PROVIDER RESPONSE REQUIRED | Default-architecture transfers including telemetry, support copies, DNS, CDN, email, IdP, KMS. |
| Q-D-08 | ANSWERED WITH CONDITION | SEDMC requires transfer documentation: origin, destination, recipient, purpose, data, mechanism, safeguards. Mechanism **unselected**. L-05/L-17 architecture-dependent. |

---

## E. PostgreSQL

Process-local Store is **not** acceptable as Production SoR. PostgreSQL **16-class** is the intended durable SoR (ADR-0003 accepted for Development; Production hosting unselected).

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-E-01 | PROVIDER RESPONSE REQUIRED | SEDMC requires PostgreSQL 16-class support and upgrade path. |
| Q-E-02 | PROVIDER RESPONSE REQUIRED | Managed vs self-managed and who is DBA. Either model may be offered; not pre-selected. |
| Q-E-03 | PROVIDER RESPONSE REQUIRED | HA design required to be described. Not selected. |
| Q-E-04 | PROVIDER RESPONSE REQUIRED | Replication and lag under stated assumptions. |
| Q-E-05 | PROVIDER RESPONSE REQUIRED | PITR capability and granularity. |
| Q-E-06 | PROVIDER RESPONSE REQUIRED | WAL retention, location, independence from primary disk. |
| Q-E-07 | ANSWERED WITH CONDITION | SEDMC requires encrypted backups and restore proof. Alignment with **19:00 Africa/Nairobi (EAT)** is a **future** ADR-0011 Production product **TBD**, not a selected product. Provider must state actual frequency and whether EAT alignment is possible. |
| Q-E-08 | PROVIDER RESPONSE REQUIRED | Restore process, RTO assumptions, who executes. |
| Q-E-09 | ANSWERED WITH CONDITION | SEDMC requires restore **testing** with evidence. Cadence/who executes: provider. Lab/other-customer tests ≠ SEDMC Production evidence. |
| Q-E-10 | ANSWERED WITH CONDITION | SEDMC **requires** encryption at rest and in transit. Not claimed as Production-implemented. |
| Q-E-11 | ANSWERED WITH CONDITION | SEDMC requires disclosure of who holds keys and whether customer-managed keys are available. Key ownership unselected. |
| Q-E-12 | ANSWERED WITH CONDITION | SEDMC requires IAM, roles, network isolation for the database. |
| Q-E-13 | ANSWERED WITH CONDITION | SEDMC requires database audit logging, retention disclosure, export. |
| Q-E-14 | PROVIDER RESPONSE REQUIRED | Maintenance/upgrade notice and freeze windows. |
| Q-E-15 | ANSWERED WITH CONDITION | SEDMC **requires** logical export/dump/portability (low lock-in). Method: provider. |
| Q-E-16 | ANSWERED WITH CONDITION | SEDMC requires fail-closed write rejection if the database is unavailable (no silent local buffering of Production writes). Provider must describe actual behaviour. |

---

## F. Object / document storage

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-F-01 | PROVIDER RESPONSE REQUIRED | S3-compatible **or equivalent**. Surface must be documented. Product unselected. |
| Q-F-02 | ANSWERED WITH CONDITION | Encryption in transit and at rest **required**. Not claimed Production-implemented. |
| Q-F-03 | PROVIDER RESPONSE REQUIRED | Key management / CMK availability. |
| Q-F-04 | PROVIDER RESPONSE REQUIRED | Geographic placement and contractual lock. Unselected. |
| Q-F-05 | ANSWERED WITH CONDITION | Automatic cross-region replication must be disclosed. SEDMC requires control over unapproved-geography copies. |
| Q-F-06 | PROVIDER RESPONSE REQUIRED | Independent backup of objects. |
| Q-F-07 | ANSWERED WITH CONDITION | Retention/legal-hold options required to be available; periods E-13 TBD. |
| Q-F-08 | ANSWERED WITH CONDITION | Deletion including versions/replicas required. |
| Q-F-09 | PROVIDER RESPONSE REQUIRED | Versioning capability. |
| Q-F-10 | ANSWERED WITH CONDITION | Export/bulk retrieval **required** (portability). |
| Q-F-11 | PROVIDER RESPONSE REQUIRED | Lifecycle policies. |
| Q-F-12 | ANSWERED WITH CONDITION | Access logging and log portability required. |

---

## G. Recovery

**Business targets (ANSWERED):** critical functions **≤ 3 hours**; overall **≤ 4 hours**; **zero tolerated business data loss**.

**This is a business continuity requirement and does not constitute a technical RPO=0 guarantee.** Technical RTO/RPO remain architecture/provider questions.

Restore-from-backup is a **desired** capability. Warm standby / geo-DR remain **unselected candidates**.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-G-01 | PROVIDER RESPONSE REQUIRED | Provider must state **technical** RTO for DB restore and full-environment recovery under a documented failure model. Compare later to business ≤3h / ≤4h **without** treating business targets as verified technical RTO. |
| Q-G-02 | PROVIDER RESPONSE REQUIRED | Provider must state **technical** RPO for backup-only, PITR, sync replica, async geo. Do **not** report technical RPO=0 from the business zero-loss rule. |
| Q-G-03 | PROVIDER RESPONSE REQUIRED | Actual backup frequency. |
| Q-G-04 | PROVIDER RESPONSE REQUIRED | PITR granularity. |
| Q-G-05 | PROVIDER RESPONSE REQUIRED | Measured restore evidence (date, size, time). Not SEDMC Production evidence if other-tenant/lab. |
| Q-G-06 | PROVIDER RESPONSE REQUIRED | Full-environment recovery (app + PostgreSQL + documents + identity). |
| Q-G-07 | PROVIDER RESPONSE REQUIRED | Database recovery procedure. |
| Q-G-08 | PROVIDER RESPONSE REQUIRED | Document/object recovery procedure. |
| Q-G-09 | PROVIDER RESPONSE REQUIRED | Failover procedure and who authorizes. SEDMC will not pre-authorize failover to an unapproved geography. |
| Q-G-10 | PROVIDER RESPONSE REQUIRED | Failback procedure. |
| Q-G-11 | ANSWERED WITH CONDITION | SEDMC requires DR testing with customer participation options. Cadence: provider. |
| Q-G-12 | PROVIDER RESPONSE REQUIRED | Attach recovery-test evidence with limitations. |

---

## H. Security

These are **requirements to evaluate**, **not** claims that Production controls exist. ADR-0012 and ADR-0013 remain OPEN.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-H-01 | ANSWERED WITH CONDITION | SEDMC requires TLS for data in transit. Versions/ciphers: provider evidence. |
| Q-H-02 | ANSWERED WITH CONDITION | Encryption at rest for volumes, database, objects **required**. |
| Q-H-03 | ANSWERED WITH CONDITION | Backup encryption **required**. |
| Q-H-04 | ANSWERED WITH CONDITION | KMS and **key ownership/control** must be disclosed. Unselected. |
| Q-H-05 | PROVIDER RESPONSE REQUIRED | Secrets-management offering. Required in evaluation; product unselected. |
| Q-H-06 | ANSWERED WITH CONDITION | IAM / least privilege **required**. |
| Q-H-07 | ANSWERED WITH CONDITION | MFA for console, API, and privileged access **required**. |
| Q-H-08 | ANSWERED WITH CONDITION | Privileged-access control / JIT where offered **required** to be described. |
| Q-H-09 | ANSWERED WITH CONDITION | Audit logging of access to customer data and keys **required**. |
| Q-H-10 | ANSWERED WITH CONDITION | Monitoring/detection offering **required** to be described. |
| Q-H-11 | ANSWERED WITH CONDITION | Vulnerability management (scan cadence, patch SLA) **required** to be stated. |
| Q-H-12 | ANSWERED WITH CONDITION | Network isolation / private DB endpoints **required**. |
| Q-H-13 | ANSWERED WITH CONDITION | WAF and DDoS **where offered / appropriate** — disclose if included. Not a selected CDN/WAF provider. |
| Q-H-14 | ANSWERED WITH CONDITION | Provider IR for incidents affecting the customer **required**. |
| Q-H-15 | PROVIDER RESPONSE REQUIRED | Pen-test / independent assurance with scope, recency, sharing terms. |
| Q-H-16 | PROVIDER RESPONSE REQUIRED | Certifications **in scope** for proposed regions/services. |

Passport/ID, health/accessibility, financial/payment, and security-sensitive information require heightened controls where applicable. **Do not invent PCI / raw card-storage claims.** Avoid raw payment-card storage.

---

## I. Support

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-I-01 | PROVIDER RESPONSE REQUIRED | Hours and languages. SEDMC requires the facts; no hours invented as a company SLA. |
| Q-I-02 | ANSWERED WITH CONDITION | SEDMC requires the provider to state whether 24/7 exists and for which severity. Company has not contracted 24/7. |
| Q-I-03 | PROVIDER RESPONSE REQUIRED | Escalation **targets**, not SEDMC legal clocks. |
| Q-I-04 | PROVIDER RESPONSE REQUIRED | Support-personnel countries. |
| Q-I-05 | ANSWERED WITH CONDITION | Remote admin must be disclosed. SEDMC requires it to be controlled. |
| Q-I-06 | ANSWERED WITH CONDITION | Break-glass must be disclosed and controlled. |
| Q-I-07 | ANSWERED | MFA for support access **required**. |
| Q-I-08 | ANSWERED | Logging of support sessions **required**. |
| Q-I-09 | ANSWERED WITH CONDITION | SEDMC **requires** customer approval before support access, with documented emergency exceptions (Q-I-10). |
| Q-I-10 | PROVIDER RESPONSE REQUIRED | Emergency access when customer unreachable — must be described. |

---

## J. Availability

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-J-01 | PROVIDER RESPONSE REQUIRED | Attach SLA. |
| Q-J-02 | PROVIDER RESPONSE REQUIRED | Uptime %, measurement, credits. No SEDMC uptime % is approved. |
| Q-J-03 | PROVIDER RESPONSE REQUIRED | Maintenance windows. |
| Q-J-04 | PROVIDER RESPONSE REQUIRED | Planned-maintenance notice. |
| Q-J-05 | PROVIDER RESPONSE REQUIRED | Redundancy description. |
| Q-J-06 | PROVIDER RESPONSE REQUIRED | Failure domains. |
| Q-J-07 | PROVIDER RESPONSE REQUIRED | DB HA included vs optional (and cost). |
| Q-J-08 | PROVIDER RESPONSE REQUIRED | Network redundancy. |
| Q-J-09 | PROVIDER RESPONSE REQUIRED | Power redundancy (especially relevant if Class C is later in scope). Not a ranking of Class C. |
| Q-J-10 | PROVIDER RESPONSE REQUIRED | DR included vs optional. |

SEDMC prefers architecture **capable of meeting** the 3h critical / 4h overall **business** targets; that preference is **not** a selected class and **not** a verified technical RTO.

---

## K. Capacity

**ANSWERED (planning assumptions only):** up to approximately **500 users**; up to approximately **200 concurrent users**; approximately **30%** growth. Not measured Production demand. Not contractual volume commitments.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-K-01 | PROVIDER RESPONSE REQUIRED | Provider proposes compute **as assumption** under the planning figures. |
| Q-K-02 | PROVIDER RESPONSE REQUIRED | Memory proposal. |
| Q-K-03 | PROVIDER RESPONSE REQUIRED | Storage initial and Year-3 under 30% growth assumption. |
| Q-K-04 | PROVIDER RESPONSE REQUIRED | IOPS / throughput class. |
| Q-K-05 | PROVIDER RESPONSE REQUIRED | Network assumptions. |
| Q-K-06 | PROVIDER RESPONSE REQUIRED | Database limits. |
| Q-K-07 | PROVIDER RESPONSE REQUIRED | Scaling method and time. |
| Q-K-08 | PROVIDER RESPONSE REQUIRED | Maximum capacity the provider will contractually support. |
| Q-K-09 | PROVIDER RESPONSE REQUIRED | Reservations / committed use (and cost). |
| Q-K-10 | PROVIDER RESPONSE REQUIRED | Any change the provider requires to the planning assumptions. SEDMC does not promise volumes beyond those assumptions. |

---

## L. Cost

**No SEDMC budget number exists.** Do not invent one.

**ANSWERED (structure SEDMC requires):** transparent separation of setup; implementation; compute; database; storage; object storage; backup; PITR; DR; standby; bandwidth; egress; monitoring; logging; WAF; CDN; KMS; secrets; IdP; email; support; professional services; migration; recovery testing; taxes; minimum commitments; termination; data retrieval/exit. Keep monthly, annual, one-time, optional, and usage-based **separate**. Currency and tax treatment must be stated. Quotes are **indicative / non-binding** under E1-B. Zero is not a placeholder for unknown.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-L-01 | PROVIDER RESPONSE REQUIRED | One-time quote lines. Company budget: **COMPANY DECISION / HUMAN EVIDENCE REQUIRED** if a number is demanded. |
| Q-L-02 | PROVIDER RESPONSE REQUIRED | Monthly lines as listed. |
| Q-L-03 | PROVIDER RESPONSE REQUIRED | Annualised total. |
| Q-L-04 | PROVIDER RESPONSE REQUIRED | Taxes. |
| Q-L-05 | PROVIDER RESPONSE REQUIRED | Minimums / commitments. SEDMC requires them disclosed; not pre-accepted. |
| Q-L-06 | PROVIDER RESPONSE REQUIRED | Termination fees. |
| Q-L-07 | PROVIDER RESPONSE REQUIRED | Retrieval / egress on exit. |
| Q-L-08 | PROVIDER RESPONSE REQUIRED | Optional costs, currency, tax, validity. |

---

## M. Portability and exit

SEDMC **requires** portability and low lock-in. Methods and fees: provider.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-M-01 | ANSWERED WITH CONDITION | PostgreSQL export **required**. Format: provider. |
| Q-M-02 | ANSWERED WITH CONDITION | Document export **required**. |
| Q-M-03 | ANSWERED WITH CONDITION | Logical dump **required**. |
| Q-M-04 | ANSWERED WITH CONDITION | Backup export to customer-controlled media **required** to be available. |
| Q-M-05 | ANSWERED WITH CONDITION | Configuration export **required**. |
| Q-M-06 | PROVIDER RESPONSE REQUIRED | What is proprietary vs portable. |
| Q-M-07 | PROVIDER RESPONSE REQUIRED | DNS migration assistance. DNS changes are **not authorized** now. |
| Q-M-08 | PROVIDER RESPONSE REQUIRED | Identity migration if IdP hosted. |
| Q-M-09 | ANSWERED WITH CONDITION | Log export **required**. |
| Q-M-10 | ANSWERED WITH CONDITION | Deletion process and certificate if offered **required**. |
| Q-M-11 | PROVIDER RESPONSE REQUIRED | Exit assistance hours. |
| Q-M-12 | PROVIDER RESPONSE REQUIRED | Migration assistance to a successor. Production migration **not authorized**. |
| Q-M-13 | PROVIDER RESPONSE REQUIRED | Termination notice. |
| Q-M-14 | PROVIDER RESPONSE REQUIRED | Exit and egress fees. |

---

## N. Contracts

No provider contract may be signed under E1-B issuance. Drafts are **information only**.

| Q-ID | Status | SEDMC position |
| --- | --- | --- |
| Q-N-01 | PROVIDER RESPONSE REQUIRED | Attach MSA draft. Not an offer by SEDMC. |
| Q-N-02 | PROVIDER RESPONSE REQUIRED | DPA draft (Q-C-01). |
| Q-N-03 | PROVIDER RESPONSE REQUIRED | SLA draft (Q-J-01). |
| Q-N-04 | PROVIDER RESPONSE REQUIRED | Security addendum. |
| Q-N-05 | ANSWERED WITH CONDITION | Subprocessor terms **required** in contract set. |
| Q-N-06 | ANSWERED WITH CONDITION | Incident-notification terms **required**. |
| Q-N-07 | ANSWERED WITH CONDITION | Deletion terms **required**. |
| Q-N-08 | ANSWERED WITH CONDITION | Residency commitments **required** to be offered or expressly declined. |
| Q-N-09 | ANSWERED WITH CONDITION | Transfer terms **required**; mechanism unselected. |
| Q-N-10 | ANSWERED WITH CONDITION | Audit terms **required**. |
| Q-N-11 | PROVIDER RESPONSE REQUIRED | Liability and insurance. Legal review later. |
| Q-N-12 | ANSWERED WITH CONDITION | BCM obligations in contract **required** to be described. Business 3h/4h are not automatically the contractual SLA. |

SEDMC authorized signatory to execute any later MSA: **HUMAN EVIDENCE REQUIRED**. Not invented. THOMAS NGULUMA is Legal Counsel only.

---

## PE-01–PE-48

All 48 evidence requirements remain **PROVIDER RESPONSE REQUIRED** until a genuine provider submission exists. SEDMC does not mark any PE **VERIFIED**. Mapping is in the frozen PE pack and E1-B3 framework.

---

## Items not in the 168 Q-IDs but required for company completeness

| Item | Status |
| --- | --- |
| Company legal name | ANSWERED WITH CONDITION — Makundi Serengeti Experience DMC (company-supplied). |
| Registry / TIN / registered address / certificate | HUMAN EVIDENCE REQUIRED (E-01). |
| PDPC number / status | HUMAN EVIDENCE REQUIRED (E-02). Not registered/unregistered/exempt claimed. |
| DPO name / appointment | HUMAN EVIDENCE REQUIRED (E-03). Not Thomas Nguluma. |
| Legal Counsel | ANSWERED — THOMAS NGULUMA; 15TH SEPTEMBER 2026; A.T.N. |
| RFI transmittal sender | HUMAN EVIDENCE REQUIRED — not invented; blocks **actual send**, not this document. |
| Named RFI recipient | HUMAN EVIDENCE REQUIRED — not invented; blocks **actual send** to that party. |
| Approved budget figure | COMPANY DECISION / HUMAN EVIDENCE REQUIRED. |
| BCM recovery-sequence reconciliation | COMPANY DECISION — this session vs prior BCM pack; pack not rewritten. |

**NOT APPLICABLE:** none of the 168 Q-IDs.  
**OUT OF SCOPE:** none of the 168 Q-IDs.

This document is **not signed**. It is prepared for later human use. No signature field on the frozen provider RFI is completed.
