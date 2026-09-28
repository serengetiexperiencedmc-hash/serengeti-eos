# E1-B — Provider Evidence Requirements

> **`E1-B = RFI/RFQ AND PROVIDER-EVIDENCE PACK PREPARED`**  
> **`NOT PROVIDER SELECTION`** · **`NO PROVIDER EXISTS YET`**  
> **`NO ITEM MAY BE MARKED VERIFIED`**  
> **`ADR-0006 = OPEN`** · **`DP-0006 = OPEN`**  
> **`Legal Counsel = COMPLETE — THOMAS NGULUMA — LEGAL COUNSEL — 15TH SEPTEMBER 2026 — A.T.N`**  
> **`DPO = NOT ESTABLISHED`** · **`COMBINED LEGAL/DPO = INCOMPLETE`**  
> **`Architecture UNSELECTED`** · **`Production / UAT / Migration / Deployment NOT AUTHORIZED`**

**Date (repository calendar):** 2026-09-16.  
**Questionnaire:** [`adr-0006-e1-b-provider-neutral-rfi-rfq.md`](adr-0006-e1-b-provider-neutral-rfi-rfq.md)  
**Response template:** [`adr-0006-e1-b-standard-provider-response-template.md`](adr-0006-e1-b-standard-provider-response-template.md)

This is a **formal evidence checklist** for a **future** identical evaluation of Classes A–D. No provider is named. No request has been sent. All **Provider response** fields are blank. All **Verification status** values are **NOT REQUESTED**.

**Statuses (use only these):** `NOT REQUESTED` · `REQUESTED` · `RECEIVED` · `UNDER REVIEW` · `VERIFIED` · `REJECTED` · `NOT APPLICABLE`.  
**Do not mark anything VERIFIED.** No provider exists yet.

**Company-provided legal name:** Makundi Serengeti Experience DMC — **authoritative registry evidence pending.** PDPC **NOT VERIFIED**. DPO **NOT ESTABLISHED**. THOMAS NGULUMA is **LEGAL COUNSEL ONLY**.

Provider marketing is **not** SEDMC legal certification. Restricted+ is **internal**, not automatically statutory. Tanzania is **preferred baseline only**.

**Architecture dependency** values: `UNSELECTED (A–D)` unless a requirement is class-conditional.

**Production gate relevance:** `REQUIRED BEFORE PRODUCTION` unless noted otherwise. This pack does **not** open a Production gate.

---

## Legend

| Column | Meaning |
| --- | --- |
| Requirement ID | Stable PE-nn |
| Requirement | What must be evidenced |
| Evidence requested | Artefact or statement |
| Evidence type | Contract / Policy / Certificate / Diagram / Quote / Test report / Register |
| Provider response | Left blank |
| Verification status | Always `NOT REQUESTED` in this pack |
| Contractual guarantee required? | Whether later contracting would need a clause |
| Legal review required? | Counsel (and DPO once established) |
| Technical review required? | Architecture / security / operations |
| Architecture dependency | Class A–D unselected |
| Production gate relevance | Later gate; not opened |

---

## PE-01 — Provider identity

| Field | Value |
| --- | --- |
| Requirement ID | PE-01 |
| Requirement | Legal identity of the provider operating entity |
| Evidence requested | Certificate of incorporation / registry extract; legal name; jurisdiction |
| Evidence type | Register / Certificate |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes (named contracting party) |
| Legal review required? | Yes |
| Technical review required? | No |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-02 — Contracting entity

| Field | Value |
| --- | --- |
| Requirement ID | PE-02 |
| Requirement | Contracting entity vs operating entity vs parent, if different |
| Evidence requested | Group chart; contracting-entity papers; authorized-signatory role |
| Evidence type | Register / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | No |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-03 — Primary hosting geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-03 |
| Requirement | Country / region / city (where disclosed) of primary application hosting; operator; contractual lock; automatic movement; remote support access |
| Evidence requested | Region list; facility operator; draft residency clause |
| Evidence type | Contract / Diagram |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); Tanzania preferred baseline only |
| Production gate relevance | REQUIRED BEFORE PRODUCTION; feeds E-08 / E-09 / E-10 / E-11 / L-05 / L-17 |

## PE-04 — Database geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-04 |
| Requirement | PostgreSQL processing and storage location(s) |
| Evidence requested | Same location fields as PE-03 for PostgreSQL |
| Evidence type | Contract / Diagram |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-05 — Object storage geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-05 |
| Requirement | Object/document storage location(s) |
| Evidence requested | Same location fields as PE-03 for object storage |
| Evidence type | Contract / Diagram |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); Production object store unselected |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-06 — Backup geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-06 |
| Requirement | Backup location(s). Backups **can** be additional processing / transfer. |
| Evidence requested | Backup-region statement; whether copies leave the primary jurisdiction |
| Evidence type | Contract / Policy |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0011 Production product TBD |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-07 — DR geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-07 |
| Requirement | DR / replica location(s). DR **can** be additional processing / transfer. |
| Evidence requested | DR-region statement; failover automatic vs authorized |
| Evidence type | Contract / Diagram |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); warm standby not automatically legally mandatory |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-08 — Support geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-08 |
| Requirement | Countries of personnel who can access customer data or keys. Data location ≠ access location. |
| Evidence requested | Support-centre countries; remote-admin statement |
| Evidence type | Policy / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes (access controls + geography disclosure) |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); Class C still may have foreign OEM/support |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-09 — Subprocessors

| Field | Value |
| --- | --- |
| Requirement ID | PE-09 |
| Requirement | Named subprocessors, purpose, country of processing |
| Evidence requested | Current subprocessor list; change-notification terms |
| Evidence type | Register / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION; feeds E-07 / E-32 |

## PE-10 — DPA

| Field | Value |
| --- | --- |
| Requirement ID | PE-10 |
| Requirement | Executable DPA covering roles for infra, DB, objects, backups, support |
| Evidence requested | Draft DPA |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | No (scope review yes) |
| Architecture dependency | UNSELECTED (A–D); DPO not established |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-11 — Transfer mechanism

| Field | Value |
| --- | --- |
| Requirement ID | PE-11 |
| Requirement | International transfer mechanism **if** a transfer exists. No universal mechanism. Do not assume PDPC permit exists. |
| Evidence requested | Named mechanism; destination countries; data categories at high level |
| Evidence type | Contract / Policy |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes if transfer exists |
| Legal review required? | Yes |
| Technical review required? | Yes (path inventory) |
| Architecture dependency | UNSELECTED (A–D); L-05 / L-17 architecture-dependent |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if any extra-Tanzania processing |

## PE-12 — Residency guarantee

| Field | Value |
| --- | --- |
| Requirement ID | PE-12 |
| Requirement | Contractual data-residency commitment (not marketing). Tanzania residency **if offered** must be guaranteed or explicitly declined. |
| Evidence requested | Draft clause; exceptions (failover, support copies, telemetry) |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes if residency is a selection criterion |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-13 — Encryption

| Field | Value |
| --- | --- |
| Requirement ID | PE-13 |
| Requirement | TLS in transit; encryption at rest for volumes, database, objects, backups |
| Evidence requested | Technical statement; cipher/TLS policy; backup encryption |
| Evidence type | Policy / Certificate / Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | No (unless claim of statutory adequacy) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-14 — KMS

| Field | Value |
| --- | --- |
| Requirement ID | PE-14 |
| Requirement | Key-management service; **who owns and controls keys** |
| Evidence requested | KMS product; customer-managed keys option; key geography |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes for key-control claims |
| Legal review required? | Yes if keys leave Tanzania or customer does not control |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0012 OPEN |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-15 — IAM / MFA

| Field | Value |
| --- | --- |
| Requirement ID | PE-15 |
| Requirement | IAM model; MFA for console, API, privileged and support access |
| Evidence requested | IAM documentation; MFA policy |
| Evidence type | Policy |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes for privileged MFA |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0013 OPEN |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-16 — Logging

| Field | Value |
| --- | --- |
| Requirement ID | PE-16 |
| Requirement | Audit logging of access to customer data and keys; log geography; export |
| Evidence requested | Log types, retention, location, export format |
| Evidence type | Policy / Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes for retention/export if required by later DPO/counsel |
| Legal review required? | Yes (personal data in logs) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-17 — Monitoring

| Field | Value |
| --- | --- |
| Requirement ID | PE-17 |
| Requirement | Monitoring / detection offering and telemetry geography |
| Evidence requested | Monitoring product location; data sent off-platform |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If telemetry leaves residency boundary |
| Legal review required? | Yes if telemetry is personal data / transfer |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-18 — Incident response

| Field | Value |
| --- | --- |
| Requirement ID | PE-18 |
| Requirement | Provider incident/breach notification to customer; contractual clock from awareness. Not a substitute for SEDMC E-15. |
| Evidence requested | IR policy; draft notification clause; contact path |
| Evidence type | Policy / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); DPO not established |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-19 — Backup

| Field | Value |
| --- | --- |
| Requirement ID | PE-19 |
| Requirement | Encrypted backups; frequency; independence from primary disk |
| Evidence requested | Backup schedule; encryption; location (PE-06) |
| Evidence type | Policy / Test report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes (location/transfer) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0011 Production TBD |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-20 — Restore

| Field | Value |
| --- | --- |
| Requirement ID | PE-20 |
| Requirement | Documented restore process and measured restore duration under stated assumptions |
| Evidence requested | Restore runbook; last test evidence (scope, size, time) |
| Evidence type | Procedure / Test report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Restore **obligation** yes; measured time is evidence not a legal clock |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-21 — PITR

| Field | Value |
| --- | --- |
| Requirement ID | PE-21 |
| Requirement | PITR / WAL archive: granularity, retention, location |
| Evidence requested | PITR specification; WAL geography |
| Evidence type | Architecture note / Policy |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If PITR is relied upon for RPO |
| Legal review required? | Yes (WAL location) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-22 — DR

| Field | Value |
| --- | --- |
| Requirement ID | PE-22 |
| Requirement | DR capability: failover, failback, testing cadence, included vs optional |
| Evidence requested | DR design; test calendar; customer participation |
| Evidence type | Procedure / Contract / Test report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes if DR is in scope |
| Legal review required? | Yes (PE-07) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-23 — RTO

| Field | Value |
| --- | --- |
| Requirement ID | PE-23 |
| Requirement | Stated **technical** RTO for DB restore and full-environment recovery. SEDMC **business** targets: critical **<= 3 hours**; overall **<= 4 hours**. Do **not** convert business targets into a verified technical RTO. |
| Evidence requested | Provider RTO with failure model, assumptions, evidence |
| Evidence type | SLA / Test report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | SLA RTO if offered; distinguish from business target |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-24 — RPO

| Field | Value |
| --- | --- |
| Requirement ID | PE-24 |
| Requirement | Stated **technical** RPO for backup-only, PITR, sync replica, async geo. SEDMC **business** data-loss tolerance is **zero tolerated BUSINESS loss**. This is **not** technical RPO = 0. |
| Evidence requested | Provider RPO per mechanism; assumptions |
| Evidence type | SLA / Architecture note / Test report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If a technical RPO is sold |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-25 — SLA

| Field | Value |
| --- | --- |
| Requirement ID | PE-25 |
| Requirement | Uptime commitment, measurement, credits, maintenance windows, notice |
| Evidence requested | SLA document |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes (liability/credits) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-26 — Capacity

| Field | Value |
| --- | --- |
| Requirement ID | PE-26 |
| Requirement | Sizing under **planning assumptions only**: up to 500 users; up to 200 concurrent; ~30% growth. Not measured demand. |
| Evidence requested | Compute, memory, storage, IOPS, network, DB limits |
| Evidence type | Quote / Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Capacity reservation if used |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-27 — Scalability

| Field | Value |
| --- | --- |
| Requirement ID | PE-27 |
| Requirement | Scaling method, scaling time, maximum supported capacity |
| Evidence requested | Scaling design; committed max |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If a maximum is contracted |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-28 — Portability

| Field | Value |
| --- | --- |
| Requirement ID | PE-28 |
| Requirement | PostgreSQL export, document export, dump, backup export, config export, log export |
| Evidence requested | Export methods and formats |
| Evidence type | Procedure / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-29 — Exit

| Field | Value |
| --- | --- |
| Requirement ID | PE-29 |
| Requirement | Termination notice, exit/migration assistance, deletion certificate, exit and egress fees |
| Evidence requested | Exit clause; fee schedule |
| Evidence type | Contract / Quote |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-30 — Pricing

| Field | Value |
| --- | --- |
| Requirement ID | PE-30 |
| Requirement | Standardized quotation (setup, compute, DB, storage, objects, backup, PITR, DR, standby, bandwidth, egress, monitoring, logging, WAF, CDN, KMS, secrets, IdP, email, support, implementation, migration, recovery testing, professional services, taxes, minimums, termination, retrieval). Monthly, annual, one-time, optional; currency; tax; assumptions. **SEDMC budget: COMPANY DECISION REQUIRED.** |
| Evidence requested | Quote in Q-L structure. Not a binding request in this pack. |
| Evidence type | Quote |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Price list / order form later |
| Legal review required? | Yes (terms) |
| Technical review required? | Yes (scope vs quote) |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION; TCO envelope unknown |

## PE-31 — Support

| Field | Value |
| --- | --- |
| Requirement ID | PE-31 |
| Requirement | Hours, 24/7, escalation, geography, remote admin, privileged access, MFA, logging, approval, emergency access |
| Evidence requested | Support policy; access-control description |
| Evidence type | Policy / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes (foreign access) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-32 — Security assurance

| Field | Value |
| --- | --- |
| Requirement ID | PE-32 |
| Requirement | Certifications/assurance **in scope** for proposed regions/services; pen-test sharing terms. Marketing is not certification of SEDMC. |
| Evidence requested | ISO/SOC or equivalent **with scope statement**; recent independent test if shared |
| Evidence type | Certificate / Report |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Maintain named certifications if relied upon |
| Legal review required? | Yes (what they actually cover) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-33 — Contractual protections

| Field | Value |
| --- | --- |
| Requirement ID | PE-33 |
| Requirement | MSA, security addendum, subprocessor terms, incident terms, deletion, residency, transfer, audit, liability, insurance, BCM obligations |
| Evidence requested | Draft MSA and addenda |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes (BCM/SLA) |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

---

## Additional requirements

## PE-34 — Tanzania hosting capability

| Field | Value |
| --- | --- |
| Requirement ID | PE-34 |
| Requirement | Whether data **can** be hosted in Tanzania, by component; whether residency can be contractually guaranteed |
| Evidence requested | Answers to Q-D-01 / Q-D-02 |
| Evidence type | Contract / Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If Tanzania is later selected |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); Tanzania preferred baseline only — **not** an approved Production location |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if Tanzania is in the selected topology |

## PE-35 — Automatic data movement

| Field | Value |
| --- | --- |
| Requirement ID | PE-35 |
| Requirement | Whether data may move automatically (replication, failover, support copies, telemetry) |
| Evidence requested | Explicit yes/no per component |
| Evidence type | Contract / Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes (prohibition or documented exceptions) |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-36 — Government access

| Field | Value |
| --- | --- |
| Requirement ID | PE-36 |
| Requirement | Lawful-access / government-request process; customer notice where legally permitted |
| Evidence requested | Policy; contractual notice clause |
| Evidence type | Policy / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes where legally possible |
| Legal review required? | Yes |
| Technical review required? | No |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-37 — Customer audit rights

| Field | Value |
| --- | --- |
| Requirement ID | PE-37 |
| Requirement | Audit rights and regulatory cooperation |
| Evidence requested | Draft audit clause |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes (audit practicality) |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-38 — Deletion and retention

| Field | Value |
| --- | --- |
| Requirement ID | PE-38 |
| Requirement | Configurable retention vs provider minimums; deletion including backups/replicas; certificate if offered |
| Evidence requested | Retention/deletion schedule; certificate process |
| Evidence type | Contract / Policy |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); E-13 retention TBD |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-39 — Email geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-39 |
| Requirement | If email is offered: processing location, subprocessors, transfer |
| Evidence requested | Email-service geography |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If email is in scope |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); may be NOT APPLICABLE if email is out of hosting scope |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if in scope |

## PE-40 — IdP geography

| Field | Value |
| --- | --- |
| Requirement ID | PE-40 |
| Requirement | If IdP is offered: identity-data location and support access |
| Evidence requested | IdP region; directory location |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If IdP is in scope |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0013 OPEN; may be NOT APPLICABLE |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if in scope |

## PE-41 — CDN / WAF

| Field | Value |
| --- | --- |
| Requirement ID | PE-41 |
| Requirement | CDN and WAF: whether traffic/payloads leave the residency boundary; DDoS |
| Evidence requested | PoP countries; payload inspection location |
| Evidence type | Architecture note / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If CDN/WAF is in scope |
| Legal review required? | Yes (possible transfer) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); may be NOT APPLICABLE |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if in scope |

## PE-42 — Warm standby

| Field | Value |
| --- | --- |
| Requirement ID | PE-42 |
| Requirement | Warm-standby offering if any; geography; legal/transfer implications. **Not automatically legally mandatory.** |
| Evidence requested | Standby design; included vs optional cost |
| Evidence type | Architecture note / Quote |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If purchased |
| Legal review required? | Yes |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION if used |

## PE-43 — PostgreSQL 16

| Field | Value |
| --- | --- |
| Requirement ID | PE-43 |
| Requirement | PostgreSQL 16 support, HA, replication, maintenance, upgrade, fail-closed description, portability |
| Evidence requested | Version matrix; HA diagram; export method |
| Evidence type | Architecture note / Procedure |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Version support window |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0003 accepted for Development only |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-44 — Object-storage capability

| Field | Value |
| --- | --- |
| Requirement ID | PE-44 |
| Requirement | S3-compatible or equivalent: versioning, lifecycle, deletion, access logging, export |
| Evidence requested | API compatibility statement; feature list |
| Evidence type | Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Feature commitments if relied upon |
| Legal review required? | No (geography is PE-05) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); Production object store unselected |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-45 — Insurance and liability

| Field | Value |
| --- | --- |
| Requirement ID | PE-45 |
| Requirement | Liability caps; insurance types and limits |
| Evidence requested | Draft limitation clause; insurance certificates if offered |
| Evidence type | Contract / Certificate |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | No |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-46 — Controller / processor roles

| Field | Value |
| --- | --- |
| Requirement ID | PE-46 |
| Requirement | Role per service component. Do not convert provider labels into SEDMC determinations. |
| Evidence requested | Role table in DPA |
| Evidence type | Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Yes |
| Legal review required? | Yes |
| Technical review required? | Yes (processing inventory E-04) |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-47 — DNS / identity / infrastructure portability

| Field | Value |
| --- | --- |
| Requirement ID | PE-47 |
| Requirement | DNS migration, identity migration, IaC/image proprietary lock-in |
| Evidence requested | Exit runbook sections |
| Evidence type | Procedure / Contract |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | Assistance hours |
| Legal review required? | No |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D) |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

## PE-48 — Secrets management

| Field | Value |
| --- | --- |
| Requirement ID | PE-48 |
| Requirement | Secrets-management offering and secret-store geography |
| Evidence requested | Product; location; access model |
| Evidence type | Architecture note |
| Provider response | |
| Verification status | NOT REQUESTED |
| Contractual guarantee required? | If offered as managed service |
| Legal review required? | Yes (location) |
| Technical review required? | Yes |
| Architecture dependency | UNSELECTED (A–D); ADR-0012 OPEN |
| Production gate relevance | REQUIRED BEFORE PRODUCTION |

---

## Status control

| Rule | Application |
| --- | --- |
| Items VERIFIED | **None** |
| Items REQUESTED / RECEIVED / UNDER REVIEW | **None** |
| Items REJECTED | **None** |
| Items NOT APPLICABLE | **None yet** — a later candidate may mark PE-39/40/41 N/A with reason |
| Provider named | **No** |
| Architecture selected | **No** |
| Ranking / scoring | **No** |

**Count:** **48** provider evidence requirements (PE-01–PE-48).

**E1-B: PROVIDER-EVIDENCE PACK PREPARED — NO EVIDENCE RECEIVED.**
