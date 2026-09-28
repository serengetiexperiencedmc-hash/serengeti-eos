# ADR-0006 TCO and Financial Evidence Package

> **`DRAFT — TCO / FINANCIAL EVIDENCE — NOT A HOSTING SELECTION`**  
> **STAGE: 4D — GATE E4**  
> **STATUS: `OPEN — TCO EVIDENCE INCOMPLETE`**

This package establishes the **financial evidence model** required to compare technically viable architecture **classes** for ADR-0006. It does **not** determine the final hosting provider, select a region or Production topology, invent prices, approve ADR-0006 or DP-0006, or authorize Production, deployment, UAT, migrations, or implementation.

**Gate source:** [`adr-0006-architecture-evidence-workplan.md`](adr-0006-architecture-evidence-workplan.md) § Gate E4  
**Capability envelope:** [`adr-0006-hosting-capability-evidence.md`](adr-0006-hosting-capability-evidence.md)  
**Finance worksheet:** [`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md) C1–C14  
**Stage 1 cost principle:** [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) Decision 11  

This document does **not** rewrite Stage 1–4C files, ADR-0006, or DP-0006.

**No numerical price in this package is a quote, budget, or approved figure.** Missing amounts are `UNKNOWN — QUOTE REQUIRED` or `UNANSWERED — REQUIRES FINANCE/OWNER INPUT`. **Zero is not used as a placeholder for an unknown price.**

---

# 2. Governance baseline (carried forward exactly)

These are **existing** governance positions. They are **not** re-decided here.

| Item | Position |
| --- | --- |
| Stage 1 Owner/business/BCM | Decision **positions** exist for governance progression; named signatures/attestations remain blank where applicable. |
| Critical functions | **Commercial/RFP intake** and **Programme Building** are jointly critical. |
| Recovery sequence | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers |
| MTD | **<= 3 hours** |
| Critical RTO | **<= 3 hours** |
| Overall RTO | **<= 4 hours** |
| Recovery action | Begins **immediately** (commencement, not instantaneous restoration) |
| Business data-loss | **Zero tolerated loss of critical business data** |
| Technical RPO | **NOT** declared as zero. Must be established through architecture, qualified failure models, and evidence. Historical **3-hour RPO** is **superseded**. |
| Restore-from-backup | Desired **recovery capability**, **not** an approved Production topology |
| Provider / region / topology | **NOT SELECTED** |
| Tanzania | Preferred **candidate for assessment**, **not** an approved Production jurisdiction |
| Kenya / EU/EEA / other | Remain **candidates** subject to Legal/DPO assessment |
| Highly Restricted data | Stricter **approved-jurisdiction** rule; **primary jurisdiction is not approved** |
| Managed cloud | Preferred **direction** only; provider and region remain open |
| Production SoR | Durable **PostgreSQL** unless a later **approved** architecture establishes an equivalent |
| EOS Commercial/Programme Building runtime | **NOT** demonstrated as Production-grade PostgreSQL recovery (in-memory `Store`; ADR-0017) |
| Stage 4B | Useful PostgreSQL **laboratory** mechanisms (run `20260915-183034`). **Not** Production RTO/RPO. Lab RTO ~2–10 s is **laboratory observation only**. |
| Async replication | **Laboratory:** non-zero potential data loss (LAB-05/10) |
| Sync replication | **Laboratory:** zero transaction loss **only** for the tested configuration/failure model (LAB-04); one host; not independent AZ |
| Warm standby | **PARTIAL** — database level only (LAB-06) |
| App+DB recovery | **PARTIAL** (LAB-07) |
| IdP / CDN / WAF / email / KMS / independent AZ–region | **Unproven** in Production |
| E1 | `OPEN — REQUIRES LEGAL/DPO VALIDATION` |
| E2 | `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED` |
| E3 | `OPEN — HOSTING EVIDENCE IN PROGRESS` |
| E4 (before this pack) | `NOT STARTED` |
| ADR-0006 | **proposed — blocked for Production** |
| DP-0006 | **OPEN — NOT APPROVED** |
| Production / deployment / migrations / implementation | **NOT AUTHORIZED** |

Planning capacity assumptions (Stage 1; **not** measured Production usage): **up to 500 users**, **up to 200 concurrent**, **30% growth**.

---

# 3. Purpose of Stage 4D

Stage 4D does **not** determine the final hosting provider.

Its purpose is to establish the **financial evidence** required to compare the technically viable architecture **classes** (Options A–D) against the Stage 4C minimum capability envelope, without fabricating prices.

The financial analysis must answer:

1. What **cost categories** are materially required to satisfy the minimum capability envelope?  
2. What **information** must be obtained from providers to produce comparable TCO?  
3. What are the expected **cost drivers** (qualitative, not invented percentages)?  
4. What are the **one-time** implementation costs (categories, not amounts)?  
5. What are **recurring** operating costs (categories, not amounts)?  
6. What are likely **DR / backup / network / security** cost drivers?  
7. What information remains **unknown**?  
8. Can the four architecture classes be compared **without fabricated prices**?

**Answer to (8) today:** **No.** Comparable 3-year TCO **cannot** be calculated until quotes and a Finance/Owner envelope exist. The model below is the comparison **structure**. Totals remain `UNKNOWN — QUOTE REQUIRED`.

A financially attractive class that fails Legal (E1), technical recovery (E2), security, or the mandatory capability envelope (E3) is **not viable**.

---

# 4. TCO architecture classes (unselected)

| Class | Meaning | Rank | Eliminated? |
| --- | --- | --- | --- |
| **OPTION A** | African-region managed cloud | **Not ranked** | **No** |
| **OPTION B** | EU/EEA managed cloud | **Not ranked** | **No** |
| **OPTION C** | Tanzania-controlled hosting | **Not ranked** | **No** |
| **OPTION D** | Hybrid architecture | **Not ranked** | **No** |

Do **not** confuse these with **TCO scenarios** A/B/C in §8 (capability intensity), or with Stage 1 Decision 11 packet labels (balanced / lower-cost viable / higher-control).

No class is eliminated: there is **no** authoritative evidence in this repository proving that A, B, C, or D **cannot** satisfy a mandatory requirement. E1/E3 remain open.

---

# 5. TCO cost model (categories only)

Every line is **material to the envelope** unless later marked `NOT APPLICABLE` for a specific scenario **with a written reason**. Amounts: `UNKNOWN — QUOTE REQUIRED`.

**Type codes:** `1x` = one-time; `F` = recurring fixed; `U` = usage-dependent; `G` = growth-dependent; `?` = uncertain until quote/Legal/IT.

## A. Application compute

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Production application compute | F/U/G | vCPU, RAM, instance class, hours/month | UNKNOWN — QUOTE REQUIRED |
| Web compute (Next.js / UI) | F/U/G | Same | UNKNOWN — QUOTE REQUIRED |
| API compute (Fastify) | F/U/G | Same | UNKNOWN — QUOTE REQUIRED |
| Background workers | F/U | Worker count, schedule | UNKNOWN — QUOTE REQUIRED |
| Autoscaling | U/G | Min/max, policy | UNKNOWN — QUOTE REQUIRED |
| Failover capacity (idle/hot) | F | Extra compute for HA | UNKNOWN — QUOTE REQUIRED |

**Do not invent** CPU, RAM, RPS, or instance sizes. Fields remain blank until IT quantities + provider quote.

## B. PostgreSQL

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Primary database | F/U | Version (16-class), instance, storage GB, IOPS tier | UNKNOWN — QUOTE REQUIRED |
| HA database capacity | F | Sync replica / multi-AZ premium | UNKNOWN — QUOTE REQUIRED |
| Standby / replica | F | Async/geo replica if in sketch | UNKNOWN — QUOTE REQUIRED |
| Database storage | U/G | GB now; growth % (planning 30% — not measured DB size) | UNKNOWN — QUOTE REQUIRED |
| IOPS / performance tier | U | IOPS, throughput | UNKNOWN — QUOTE REQUIRED |
| Managed database premium | F | Managed vs self-operated | UNKNOWN — QUOTE REQUIRED |
| Licensing (if any) | F | Engine/support licence | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE until offering known |

## C. Data protection

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| WAL archiving | U | Archive GB, class | UNKNOWN — QUOTE REQUIRED |
| PITR | F/U | Window, restore operations | UNKNOWN — QUOTE REQUIRED |
| Snapshots / backups | F/U | Frequency vs **19:00 EAT** future requirement (ADR-0011 product TBD) | UNKNOWN — QUOTE REQUIRED |
| Backup storage | U/G | GB, redundancy | UNKNOWN — QUOTE REQUIRED |
| Backup retention | F/U | Days/months — Legal A17 **OPEN** | UNKNOWN — QUOTE REQUIRED |
| Immutable backup (if required) | F | Legal/security may require; **not decided** | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE pending Legal |
| Backup transfer / egress | U | Copy to independent location | UNKNOWN — QUOTE REQUIRED |

**Do not omit** backup/DR because they are not required on “day one” of a first deployment (principle 10).

## D. Geographic recovery

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| DR compute | F | Second site/region | UNKNOWN — QUOTE REQUIRED |
| DR database | F | Replica class (**async RPO > 0** unless proven otherwise) | UNKNOWN — QUOTE REQUIRED |
| Warm standby | F | App+DB idle/hot — T5 **not selected**; LAB-06 DB-only | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE if sketch excludes |
| Asynchronous replication / WAL ship | U | Cross-region GB | UNKNOWN — QUOTE REQUIRED |
| DR storage | U | GB | UNKNOWN — QUOTE REQUIRED |
| DR networking | U | Inter-region | UNKNOWN — QUOTE REQUIRED |
| Recovery testing | 1x / L | Drill frequency | UNKNOWN — QUOTE REQUIRED |
| Failover / failback labour | ? | Professional services / internal | UNKNOWN — QUOTE REQUIRED |

DR **location** remains a separate Legal decision (E1). Cost cannot be finalised without that placement.

## E. Networking

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Inbound traffic | U | GB/month — **not invented** | UNKNOWN — QUOTE REQUIRED |
| Outbound / egress | U | GB/month | UNKNOWN — QUOTE REQUIRED |
| Inter-zone traffic | U | GB | UNKNOWN — QUOTE REQUIRED |
| Inter-region traffic | U | GB (replication + DR) | UNKNOWN — QUOTE REQUIRED |
| Replication traffic | U | WAL/replica GB | UNKNOWN — QUOTE REQUIRED |
| VPN / private networking | F | Endpoints | UNKNOWN — QUOTE REQUIRED |
| Dedicated connectivity | F | If relevant | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE until architecture known |

## F. Security

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| WAF | F/U | Requests, regions (processing location = Legal) | UNKNOWN — QUOTE REQUIRED |
| DDoS protection | F | Tier | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE pending IT |
| TLS certificates | F | Count | UNKNOWN — QUOTE REQUIRED |
| KMS / key management | F | Keys, region (ADR-0012 OPEN) | UNKNOWN — QUOTE REQUIRED |
| Secrets management | F | Vault/KMS (ADR-0012 OPEN) | UNKNOWN — QUOTE REQUIRED |
| Vulnerability / security tooling | F | Subscriptions | UNKNOWN — QUOTE REQUIRED |
| Security monitoring | F/U | Events | UNKNOWN — QUOTE REQUIRED |
| Audit logging | U | GB retained | UNKNOWN — QUOTE REQUIRED |

## G. Identity

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| OIDC / SAML / enterprise IdP | F/G | Seats (planning 500 users — not measured) (ADR-0013 OPEN) | UNKNOWN — QUOTE REQUIRED |
| MFA | F/G | Included vs add-on | UNKNOWN — QUOTE REQUIRED |
| Privileged access (PAM/JIT) | F | Seats | UNKNOWN — QUOTE REQUIRED |
| Service accounts | F | Count | UNKNOWN — QUOTE REQUIRED |
| Emergency access controls | F | Break-glass | UNKNOWN — QUOTE REQUIRED |

## H. Observability

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Metrics | F/U | Time series volume — **not invented** | UNKNOWN — QUOTE REQUIRED |
| Logs | U/G | GB ingest + retention | UNKNOWN — QUOTE REQUIRED |
| Traces | U | If required | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE pending IT |
| Log retention | F/U | Days — Legal overlay | UNKNOWN — QUOTE REQUIRED |
| SIEM / security analytics | F | If required | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE pending IT |
| Alerting | F | Channels | UNKNOWN — QUOTE REQUIRED |

## I. Operational support

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Provider support | F | Business hours vs 24/7 (I6 **NOT PROVEN**) | UNKNOWN — QUOTE REQUIRED |
| Managed database support | F | Tier | UNKNOWN — QUOTE REQUIRED |
| 24/7 support if required | F | Premium | UNKNOWN — QUOTE REQUIRED |
| Professional services | 1x / F | Days | UNKNOWN — QUOTE REQUIRED |
| Managed security services | F | If required | UNKNOWN — QUOTE REQUIRED / NOT APPLICABLE pending IT |

## J. Application and platform operations

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Deployment platform | F | PaaS/K8s/VMs — **not selected** | UNKNOWN — QUOTE REQUIRED |
| Container registry | F/U | GB | UNKNOWN — QUOTE REQUIRED |
| Orchestration / platform | F | Control plane | UNKNOWN — QUOTE REQUIRED |
| CI/CD infrastructure | F | If hosted | UNKNOWN — QUOTE REQUIRED |

## K. Implementation (Year 0 / one-time)

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Architecture work | 1x | Person-days | UNKNOWN — QUOTE REQUIRED |
| Infrastructure-as-code | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Migration | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| PostgreSQL persistence cutover | 1x | **Architecture-critical** (Stage 4B RM-01); not authorized here | UNKNOWN — QUOTE REQUIRED |
| Data migration | 1x | Volume unknown | UNKNOWN — QUOTE REQUIRED |
| Application adaptation | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Security hardening | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Backup/restore implementation | 1x | ADR-0011 Production product TBD | UNKNOWN — QUOTE REQUIRED |
| DR implementation | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Testing (incl. recovery) | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Documentation | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Training | 1x | Days | UNKNOWN — QUOTE REQUIRED |

## L. Recurring compliance / security / testing

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Penetration testing | L | Annual | UNKNOWN — QUOTE REQUIRED |
| DR exercises | L | Cadence | UNKNOWN — QUOTE REQUIRED |
| Security reviews | L | Cadence | UNKNOWN — QUOTE REQUIRED |
| Compliance assessments | L | If required — not invented | UNKNOWN — QUOTE REQUIRED |
| Backup restore testing | L | ADR-0011 restore-probe intent | UNKNOWN — QUOTE REQUIRED |

## M. Exit

| Line | Type | Quote / input field | Status |
| --- | --- | --- | --- |
| Data export | 1x | GB, format | UNKNOWN — QUOTE REQUIRED |
| Migration assistance | 1x | Days | UNKNOWN — QUOTE REQUIRED |
| Temporary dual-running | 1x/F | Months overlap | UNKNOWN — QUOTE REQUIRED |
| Final data transfer | 1x | Egress | UNKNOWN — QUOTE REQUIRED |
| Provider termination costs | 1x | Contract | UNKNOWN — QUOTE REQUIRED |
| Secure deletion evidence | 1x | Legal A18 | UNKNOWN — QUOTE REQUIRED |

---

# 6. TCO time horizon

| Period | Contents |
| --- | --- |
| **Year 0 / implementation** | Category K (and any Year-0 licences, dual-run, tests) — **one-time** |
| **Year 1** | Recurring A–J, L; growth applied only with **quoted** unit rates × planning assumption |
| **Year 2** | Recurring + growth |
| **Year 3** | Recurring + growth |
| **3-year TCO** | Year 0 + Year 1 + Year 2 + Year 3 |

Distinguish:

| Kind | Treatment |
| --- | --- |
| One-time costs | Year 0 (and any later one-off drills billed as 1x) |
| Recurring fixed | Support, reserved capacity, licences |
| Usage-dependent | Egress, storage, logs, requests |
| Growth-dependent | Apply **30% planning assumption** only after unit prices exist — **not** measured usage |
| Uncertain costs | FX, tax, Legal-driven retention, PCI if applicable |

**3-year TCO today:** `UNKNOWN — QUOTE REQUIRED` (required pricing inputs missing). **Not zero.**

---

# 7. Capacity assumptions and unknown quantities

**Planning assumptions only (Stage 1; not measured Production usage):**

| Assumption | Value | Label |
| --- | --- | --- |
| Users | up to **500** | PLANNING ASSUMPTION |
| Concurrent users | up to **200** | PLANNING ASSUMPTION |
| Growth | **30%** | PLANNING ASSUMPTION |

**Not invented — quote/input fields remain empty:**

| Quantity | Field | Status |
| --- | --- | --- |
| CPU requirements | `___` vCPU | UNKNOWN |
| RAM requirements | `___` GiB | UNKNOWN |
| Database size | `___` GB | UNKNOWN |
| Storage growth | `___` GB/year | UNKNOWN (30% is not a GB figure) |
| Bandwidth | `___` GB/month | UNKNOWN |
| Transaction rate | `___` TPS | UNKNOWN |
| Requests per second | `___` RPS | UNKNOWN |
| Log volume | `___` GB/month | UNKNOWN |
| Backup volume | `___` GB | UNKNOWN |

IT supplies **quantities**; Finance/providers supply **prices**. Neither exists as Production evidence in this repository.

---

# 8. Cost scenario model (not approved)

These scenarios describe **capability intensity**. They are **not** hosting-class selections and **not** approved architectures.

**Mapping to Stage 1 Decision 11 packet (do not collapse names):**

| This pack | Stage 1 Decision 11 | Hosting Options A–D |
| --- | --- | --- |
| **SCENARIO A** — Minimum viable compliant/resilient configuration | Closest to packet **B** (lower-cost **viable**) | Must be costed for **each** Option A–D that can meet the envelope |
| **SCENARIO B** — Balanced recommended capability configuration | Packet **A** (recommended balanced) | Same |
| **SCENARIO C** — Higher-control/resilience configuration | Packet **C** (higher-control) | Same |

**None of these scenarios is approved.** The cheapest must **not** automatically be preferred.

| Scenario | Intent | Must still include | Typical extra drivers (qualitative) |
| --- | --- | --- | --- |
| **A — Minimum viable** | Lowest cost that still meets **mandatory** Legal, security, and recovery envelope | Durable PG; backup+PITR; qualified HA/DR for the **stated** failure models; encryption; identity MFA; restore testing | Omitting DR/backup/security to “save money” makes it **not viable** (principles 4–5, 10) |
| **B — Balanced** | Envelope + operable detection, support, independent backup copy, documented failover | Scenario A plus monitoring/support sufficient for **immediate recovery initiation** | Support tier; second backup location; HA product vs scripted promote |
| **C — Higher-control** | Stronger isolation, control, and/or resilience | Scenario B plus e.g. independent failure domain, warmer standby, more DR testing, stricter key control — **only if quoted**; **T5/T6 not selected** | Extra replica, WAF, PAM, drills, dual-run |

Compare cost against: resilience, recovery capability, compliance, security, operational burden, portability, vendor lock-in — **not** price alone.

---

# 9. Provider quote input template

Providers may be named later only as `CANDIDATE — NOT SELECTED`. **No candidate is named here.** No prices are populated.

Status vocabulary: `UNKNOWN` · `QUOTE REQUIRED` · `NOT APPLICABLE` · `PROVIDER EVIDENCE REQUIRED`

| Field | Candidate slot (repeat per offering) |
| --- | --- |
| Provider name | _none_ — `PROVIDER EVIDENCE REQUIRED` |
| Label | `CANDIDATE — NOT SELECTED` |
| Hosting class (A/B/C/D) | `___` |
| TCO scenario (A/B/C) | `___` |
| Country / region | `NOT SELECTED` / `QUOTE REQUIRED` |
| Compute pricing | QUOTE REQUIRED |
| Database pricing | QUOTE REQUIRED |
| Storage pricing | QUOTE REQUIRED |
| Backup pricing | QUOTE REQUIRED |
| WAL/PITR pricing | QUOTE REQUIRED |
| Replication pricing | QUOTE REQUIRED |
| DR pricing | QUOTE REQUIRED |
| Networking pricing | QUOTE REQUIRED |
| Egress pricing | QUOTE REQUIRED |
| WAF/CDN pricing | QUOTE REQUIRED |
| Identity pricing | QUOTE REQUIRED |
| KMS/secrets pricing | QUOTE REQUIRED |
| Monitoring/logging pricing | QUOTE REQUIRED |
| Support pricing | QUOTE REQUIRED |
| Implementation services | QUOTE REQUIRED |
| Migration services | QUOTE REQUIRED |
| DR testing costs | QUOTE REQUIRED |
| Contract minimums | QUOTE REQUIRED |
| Commitment discounts | QUOTE REQUIRED |
| Reserved capacity assumptions | QUOTE REQUIRED |
| Currency | UNKNOWN |
| Tax treatment | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| FX assumptions | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| Annual escalation | QUOTE REQUIRED |
| Data transfer assumptions | UNKNOWN (GB not invented) |
| Minimum billing units | QUOTE REQUIRED |
| Service-level / support premiums | QUOTE REQUIRED |
| Termination / exit costs | QUOTE REQUIRED |
| Quote date / validity | NOT RECEIVED |
| Confidence (§14) | UNKNOWN |

---

# 10. Three-year TCO comparison

**Do not use zero because no price is known.** All cells below: `UNKNOWN — QUOTE REQUIRED` unless marked N/A with a reason.

| Category | Option A African managed | Option B EU/EEA managed | Option C Tanzania-controlled | Option D Hybrid |
| --- | --- | --- | --- | --- |
| A. Application compute | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| B. PostgreSQL | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| C. Data protection (backup/WAL/PITR) | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| D. Geographic recovery | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| E. Networking / egress | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| F. Security | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| G. Identity | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| H. Observability | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| I. Operational support | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| J. Platform / CI | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| K. Implementation (Year 0) | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| Persistence cutover (in-memory → PG) | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| L. Recurring compliance/testing | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| M. Exit | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| Growth (30% planning) | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED | UNKNOWN — QUOTE REQUIRED |
| **Year 0 subtotal** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** |
| **Year 1 subtotal** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** |
| **Year 2 subtotal** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** |
| **Year 3 subtotal** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** |
| **3-year TCO** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** | **UNKNOWN — QUOTE REQUIRED** |
| Confidence / evidence | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

Repeat the same table for TCO Scenarios A, B, and C once quotes exist. **Until then, scenario totals are also `UNKNOWN — QUOTE REQUIRED`.**

**The total remains UNKNOWN because required pricing inputs are missing.**

---

# 11. Cost drivers (qualitative)

Likely **material** drivers — **no invented percentages**:

| Driver | Why material | Linked evidence |
| --- | --- | --- |
| PostgreSQL HA | Sync replica / independent domain is the lab path that qualified committed-loss for F11 on one host; Production HA product not selected | LAB-04; HE-09; RM-04/10 |
| Geographic DR | Second site + Legal placement; async typically **RPO > 0** | LAB-05/10; E1 |
| Backup retention | Unknown retention (Legal A17 OPEN) drives storage | HE-16 |
| WAL/PITR | Required for F8/F9 even if HA exists | LAB-08/09 |
| Storage | DB + backups + archives; size **UNKNOWN** | §7 |
| Network egress | Copies, replication, exit | Envelope C/D/E/M |
| Inter-region replication | Option B and geo-DR especially | HE-10 |
| WAF/CDN | Security + extra processing locations | E1.11 |
| Security monitoring / log retention | Non-negotiable observability; volume UNKNOWN | C11 |
| Support level | Immediate recovery initiation; 24/7 NOT PROVEN | C12; I6 |
| Managed service premiums | Option A/B vs C ops burden | Stage 3 |
| Professional services | Persistence cutover, IaC, drills | RM-01; C13 |
| DR testing | Recoverability ≠ job-green | ADR-0011 |
| Implementation complexity | Hybrid (D) highest mapping; in-memory → PG cutover all classes | Option D; §5 K |

---

# 12. Finance governance

All values: `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` unless an attested Finance record already exists. **None does.** (Stage 2 C1–C14 remain unanswered. Stage 1 O10 has **no monetary figure**.)

| Decision | Value | Maps to |
| --- | --- | --- |
| Initial implementation budget | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C1 |
| Annual operating budget | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C2 |
| Maximum acceptable monthly hosting spend | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C3 |
| Maximum acceptable annual hosting spend | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C4 |
| Maximum acceptable 3-year TCO | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C5 |
| Acceptable contingency | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | — |
| Acceptable premium for higher resilience/security/compliance | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | C6 |
| FX assumptions | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | TE-18 |
| Taxation / VAT treatment | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | TE-18 |
| Payment currency | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | TE-18 |
| Procurement requirements | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | — |
| Contract commitment tolerance | `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` | Quote template |

Finance reviewer (not populated):

Name: `________________`  Date: `________________`  Decision: `___`

---

# 13. Decision principles (carried forward)

1. Cost cannot override mandatory **legal** requirements.  
2. Cost cannot override mandatory **security** requirements.  
3. Cost cannot override the approved **recovery** requirement (MTD/RTO/business data-loss).  
4. Cost cannot justify an architecture **incapable** of meeting critical recovery requirements.  
5. A lower-cost option is only **viable** if it satisfies the **same mandatory capability envelope**.  
6. Higher cost may be justified where it materially improves resilience, compliance, security, or recoverability.  
7. Vendor **lock-in** and **exit** cost must be included.  
8. Hidden **operational** costs must be considered.  
9. **Implementation** cost must not be ignored.  
10. **DR and backup** costs must not be omitted simply because they are not required for the first deployment day.

Stage 1 Decision 11: cost is important but **must not override** material security, compliance, recoverability, or BCM.

---

# 14. TCO confidence model

| Class | Meaning | Use in ADR-0006 |
| --- | --- | --- |
| **HIGH** | Authoritative provider quote or contract evidence | Eligible to fill comparison cells |
| **MEDIUM** | Documented provider pricing/calculator evidence with clearly stated assumptions | May inform, must be labelled MEDIUM |
| **LOW** | Indicative estimate requiring validation | Must **not** be treated as confirmed |
| **UNKNOWN** | No defensible evidence | Current state of **all** Option A–D totals |

**Do not convert LOW or UNKNOWN into confirmed financial figures.** Current comparison confidence: **UNKNOWN**.

---

# 15. Evidence register (Stage 4D)

| ID | Requirement | Evidence | Status |
| --- | --- | --- | --- |
| TE-01 | Finance budget input (implementation) | Owner/Finance record | NOT RECEIVED / UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| TE-02 | Annual operating budget | Owner/Finance record | NOT RECEIVED |
| TE-03 | Provider quote — class A | Written quote, `CANDIDATE — NOT SELECTED` | NOT RECEIVED (no provider named) |
| TE-04 | Provider quote — class B | Same | NOT RECEIVED |
| TE-05 | Provider quote — class C | Facility/local quote | NOT RECEIVED |
| TE-06 | Provider quote — class D | Component quotes | NOT RECEIVED |
| TE-07 | Database pricing | Quote line B | UNKNOWN |
| TE-08 | Backup pricing | Quote line C | UNKNOWN |
| TE-09 | DR pricing | Quote line D | UNKNOWN |
| TE-10 | Networking/egress pricing | Quote line E | UNKNOWN |
| TE-11 | Security pricing | Quote line F | UNKNOWN |
| TE-12 | Identity pricing | Quote line G | UNKNOWN |
| TE-13 | Support pricing | Quote line I | UNKNOWN |
| TE-14 | Implementation estimate | Quote / internal estimate | UNKNOWN |
| TE-15 | Migration estimate (incl. PG SoR cutover) | Quote / internal | UNKNOWN |
| TE-16 | DR testing estimate | Quote / cadence | UNKNOWN |
| TE-17 | Exit/migration estimate | Quote + Legal A18 | UNKNOWN |
| TE-18 | Tax/FX assumptions | Finance | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| TE-19 | Three-year TCO model | This document **structure** only; totals unknown | UNKNOWN — QUOTE REQUIRED |
| TE-20 | Finance review | Named attestation | NOT RECEIVED |
| TE-21 | Monthly hosting ceiling | C3 | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| TE-22 | 3-year TCO ceiling | C5 | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| TE-23 | Resilience premium bound | C6 | UNANSWERED — REQUIRES FINANCE/OWNER INPUT |
| TE-24 | Scenario A/B/C quoted packs | Three intensity sheets × Options A–D | NOT RECEIVED |
| TE-25 | IT quantity pack (CPU/RAM/GB/RPS) | IT — not invented | NOT RECEIVED |
| TE-26 | Growth costing (30% planning) | Unit rates × assumption | UNKNOWN until TE-03–06 |
| TE-27 | Procurement / commitment terms | Finance/Legal | NOT RECEIVED |

---

# 16. Relationship to E1–E3

| Gate | Status | Relation to 4D |
| --- | --- | --- |
| **E1 Legal** | `OPEN — REQUIRES LEGAL/DPO VALIDATION` | Placement of Production/backup/DR/support/logs/IdP/CDN drives **which** quotes are even eligible. 4D does **not** close E1. |
| **E2 Technical RPO/RTO** | `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED` | Lab results are **not** Production cost or RTO proof. Cheap T1-only may fail business zero-loss qualification (LAB-01). 4D does **not** close E2. |
| **E3 Hosting capability** | `OPEN — HOSTING EVIDENCE IN PROGRESS` | No named candidate; HE-01–HE-40 unverified. 4D does **not** close E3. |
| **E4 TCO** | This pack: **structure started**; evidence incomplete | See §17 |

**A financially attractive option that fails Legal, technical recovery, security, or mandatory capability requirements is not viable.**

---

# 17. Stage 4D exit criteria

Stage 4D is ready for **Stage 5** (formal ADR-0006 / DP-0006 decision record) only when:

1. Finance/Owner budget envelope is provided **or** formally marked intentionally open.  
2. Comparable provider quotes/evidence are available where required.  
3. Major recurring and one-time cost categories are covered **with evidence**.  
4. Backup/DR/network/security costs are included.  
5. 3-year TCO calculations are **reproducible** from quotes.  
6. Assumptions are documented.  
7. Unknowns are explicit.  
8. Exit costs are considered.  
9. No fabricated prices exist.  
10. Financial comparison is traceable to evidence.

**These conditions are not met.**

**E4 = OPEN — TCO EVIDENCE INCOMPLETE**

---

# 18. Governance status

E1:  
`OPEN — REQUIRES LEGAL/DPO VALIDATION`

E2:  
`PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`

E3:  
`OPEN — HOSTING EVIDENCE IN PROGRESS`

E4:  
`OPEN — TCO EVIDENCE INCOMPLETE`

ADR-0006:  
`PROPOSED — BLOCKED FOR PRODUCTION`

DP-0006:  
`OPEN — NOT APPROVED`

Provider:  
`NOT SELECTED`

Region:  
`NOT APPROVED`

Production topology:  
`NOT SELECTED`

Production implementation:  
`NOT AUTHORIZED`

Production deployment:  
`NOT AUTHORIZED`

Production migration:  
`NOT AUTHORIZED`

UAT:  
`NOT AUTHORIZED`

---

## Validation (this package)

- No price has been fabricated.  
- UNKNOWN is not represented as zero.  
- Options A–D remain unselected and not eliminated.  
- No provider or region selected.  
- Stage 4B remains laboratory evidence only.  
- E1/E2/E3 statuses unchanged.  
- ADR-0006 / DP-0006 statuses unchanged.
