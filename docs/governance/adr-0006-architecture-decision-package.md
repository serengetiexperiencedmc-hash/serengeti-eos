# ADR-0006 Architecture Decision Package

> **`ARCHITECTURE DECISION PREPARATION — NOT FINAL APPROVAL`**  
> **CURRENT STATUS: `RED — ADR-0006 NOT CLEARED`**  
> **This package evaluates architecture option *classes*. It does not approve ADR-0006, approve DP-0006, select a provider or Production region, authorize Production, or authorize implementation.**

Stage 1 Owner-authorized business baseline and Stage 2 Legal/IT/Finance validation constraints are inputs. They are **not** altered here.

**Sources:**  
[`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md)  
[`adr-0006-legal-it-finance-validation-pack.md`](adr-0006-legal-it-finance-validation-pack.md)  
[`adr-0006-stakeholder-fact-pack.md`](adr-0006-stakeholder-fact-pack.md)  
[`../adr/ADR-0006-hosting-and-residency.md`](../adr/ADR-0006-hosting-and-residency.md)  
[`../decisions/DP-0006-hosting-data-residency.md`](../decisions/DP-0006-hosting-data-residency.md)

**Related (not modified):** ADR-0003 (PG SoR — Development), ADR-0004 (NATS — Dev/Test stand-in), ADR-0005 (OIDC — proposed), ADR-0011 (Production backup TBD), ADR-0012 (secrets OPEN), ADR-0013 (IdP OPEN), ADR-0015 (ports), ADR-0017 (Dev/Test persistence).

---

## Architecture decision principles

The final Production architecture must:

- meet or demonstrably support the approved **business** RTO;
- address the zero-data-loss **business** requirement;
- comply with applicable privacy/data-transfer requirements;
- provide appropriate HA/DR;
- protect Production data;
- support planned scale;
- be financially sustainable;
- remain portable;
- minimize unnecessary vendor lock-in;
- be testable;
- be operationally supportable.

---

# 1. Stage 1 / Stage 2 baseline (carried forward, not altered)

| Topic | Position |
| --- | --- |
| Critical functions | Commercial / Programme Building **jointly critical**. Commercial/RFP initiates. Programme Building depends on Commercial inputs, Finance, Suppliers. |
| Recovery order | 1 Commercial/RFP → 2 Programme Building → 3 Operations → 4 CRM → 5 Finance → 6 Procurement/Suppliers |
| MTD | <= 3 hours |
| Critical-function RTO | <= 3 hours (business) |
| Overall EOS RTO | <= 4 hours (business) |
| Recovery action | Begins **immediately** (commencement, not instant restore) |
| Business data-loss tolerance | **ZERO** tolerated loss of critical business data |
| Technical RPO | **NOT approved.** Must be evaluated and proven. **Do not convert zero business loss into technical RPO = 0 automatically.** |
| Recovery topology | **Not selected.** Must meet the outcomes above. |
| Hosting direction | **Managed cloud preferred.** No provider approved. No Production region approved. |
| Geography | Tanzania = preferred **candidate for assessment**, not approval. Kenya, EU/EEA and others **may be evaluated**. No jurisdiction pre-approved. |
| Scale | Planning targets: up to 500 users, up to 200 concurrent, 30% annual growth. **Not measured current usage.** |
| Portability | High / low vendor lock-in |
| PCI | No raw cardholder data in normal EOS architecture; prefer third-party processing; **no PCI DSS compliance claim** |
| Cost | No budgets. Future packet: A balanced / B lower-cost viable / C higher-control with comparable 3-year TCO |

---

# 2. Current technical reality vs required Production architecture

Do **not** assume Production infrastructure already exists. Repository evidence: greenfield Production estate (architecture README; fact pack I1).

## CURRENT DEV/TEST STATE

| Area | Evidence-backed current state |
| --- | --- |
| Persistence | In-memory `Store` is authoritative for API reads in Dev/Test (**ADR-0017**). PostgreSQL is planned SoR (**ADR-0003**, accepted for **Development**). Dual-write/hydrate exists for some modules when `EOS_DATABASE_URL` is set; commercial/runtime SoR remains in-memory for many paths. |
| PostgreSQL | Optional local instance via `infra/compose/dev.yaml` (`postgres:16-alpine`, **dev credentials only**). Not Production. |
| Migrations | Additive SQL under `packages/db/migrations/` (schema-readiness). Fact pack: SQL **123 ABSENT**; migrations **NOT AUTHORIZED** for Production. |
| Event transport | In-memory stand-in for Dev/Test (**ADR-0004**). Production NATS JetStream **proposed**, pending ADR-0006. Compose includes local NATS JetStream for Dev. |
| Authentication | Development **local issuer** / `LocalPasswordIdentityProvider` (**ADR-0005**, **ADR-0015**). Production corporate IdP **not chosen** (**ADR-0013 OPEN**). |
| Secrets | `EnvSecretsProvider` / gitignored env (**ADR-0015**). Production secrets platform **TBD** (**ADR-0012 OPEN**). |
| Email / outbox | Dev/Test outbox + SES-related **Dev** artefacts exist; transactional outbox **ADR-0010** accepted for Dev/Test. Production publisher/bus pending ADR-0006. |
| Web / API | Modular monolith (**ADR-0002**). Local preview pattern: API `127.0.0.1:8080`, web `127.0.0.1:3001` (`scripts/dev-preview.mjs`). Not Production. |
| Deployment / runtime | Local `npm` / compose. **No Production Terraform/Kubernetes** in-repo for hosting selection. CI exists for Dev/Test (`.github/workflows/ci.yml`). Deployment **NOT AUTHORIZED**. |
| Backup / restore | **ADR-0011** accepted for Dev/Test as **BCM evidence register** (job + restore-probe records). **No** Production backup product. **No** real copy of PostgreSQL/object store. Daily 19:00 EAT is a **binding schedule requirement** for a future Production product, not a proven Production RPO. |
| Infrastructure definitions | Compose **Dev only**. No approved Production account, VPC, or region. |
| Production readiness | `UAT=NOT_AUTHORIZED` · `PRODUCTION=NOT_AUTHORIZED` · Path B auto-selection **PAUSED**. |

**The current in-memory Store cannot be treated as the Production system of record.**

## REQUIRED PRODUCTION ARCHITECTURE (constraints, not a selected design)

| Area | Required class (not implemented by this package) |
| --- | --- |
| Persistence | Durable **PostgreSQL** Production SoR unless a later **approved** architecture changes this (**ADR-0003**). |
| Events | Durable event transport (NATS JetStream **proposed**, not selected as a hosting lock). |
| Identity | OIDC to a corporate IdP (**ADR-0005/0013**) — product **not selected**. |
| Secrets | Production KMS/secrets platform (**ADR-0012**) — product **not selected**. |
| Backup | Named Production backup product + remote copy + **restore proof** (**ADR-0011** TBD). |
| Environments | Strict Dev/Test vs Production; **no live Production PII in Dev/Test**. |
| PCI | No raw CHD in EOS stores/backups/DR by **design position**; scope **not established**. |

---

# 3. Architecture options evaluated

Options match DP-0006 sketches. **No option is selected. No provider is named as chosen.** “Managed cloud” means a **class** of service, not a vendor.

## OPTION A — African-region managed cloud

**Concept:** Managed cloud hosting in an African jurisdiction/region that can satisfy legal, security, resilience, and operational requirements (DP-0006 Option A class).

| Dimension | Assessment | Evidence class |
| --- | --- | --- |
| Jurisdiction availability | **UNKNOWN / REQUIRES MARKET VALIDATION.** African public-cloud regions exist for some vendors in general industry knowledge, but **this repository contains no approved vendor, no region catalogue, and no quote.** Do not treat “Africa” as a selected country. | Unknown |
| Tanzania PDPA | **Design baseline:** PDPA remains a design-basis framework (fact pack L2 draft). Hosting **in Africa ≠ Tanzania** and **≠ PDPA approval**. Transfer Tanzania→foreign African region still a **controlled transfer**. | Requires Legal/DPO confirmation |
| Cross-border transfer | **REQUIRES LEGAL VALIDATION** if Production is outside Tanzania or support/logs leave Tanzania. | Requires Legal/DPO confirmation |
| HA / DR / backup | Technically **feasible in principle** on managed-cloud primitives (multi-AZ, snapshots, replicas) — **NOT PROVEN**, no provider selected. | Provisional |
| Support | 24/7 managed-cloud support **possible**; SEDMC 24/7 function **NOT PROVEN** (I6). | Unknown / provisional |
| Latency | East Africa field/admin users: African region **may** improve latency vs EU — **REQUIRES TECHNICAL PROOF** (no measurements in repo). | Unknown |
| Scalability | Planning targets 500/200/30% are **in-principle** compatible with managed cloud — **REQUIRES TECHNICAL PROOF**. | Provisional |
| Portability | Depends on avoiding proprietary services (Stage 1 low lock-in). | Provisional |
| Cost | **REQUIRES PROVIDER QUOTE.** | Unknown |
| Lock-in | Managed PaaS can increase lock-in; portable PG/containers reduce it. | Provisional |

**Hard blockers until resolved:** Legal approval of the **specific** country/region; provider capability evidence; transfer mechanism if not Tanzania.

**Viable if:** An African managed region exists for a (not-yet-selected) provider that Legal approves for Production **and** backup/DR copies, and IT proves RTO/RPO on that option.

## OPTION B — EU/EEA managed cloud

**Concept:** Production in an EU/EEA jurisdiction with appropriate privacy and international-transfer safeguards **where required**.

**Do NOT assert that EU hosting is automatically lawful or unlawful.**

| Dimension | Assessment | Evidence class |
| --- | --- | --- |
| GDPR | **Potentially applicable, not automatically** (fact pack L4). EU hosting does **not** by itself mean GDPR applies to all SEDMC processing, nor that it does not. | Requires Legal/DPO confirmation |
| Tanzania→EU transfer | **Design baseline:** potentially permissible subject to Tanzanian requirements and the specific arrangement (L10 draft). **NOT APPROVED.** | Requires Legal/DPO confirmation |
| EU/EEA→Tanzania or other non-EEA | **If GDPR applies**, an appropriate transfer mechanism is required; ordinary cloud contracts **not** assumed sufficient (L10). GDPR applicability **UNKNOWN**. | Requires Legal/DPO confirmation |
| SCC/adequacy/other | **NOT APPROVED.** No SCCs or adequacy finding is cited in-repo. | Requires Legal/DPO confirmation |
| Data residency | EU Production may still be an **unapproved** location for Tanzanian/Kenyan data until Legal attests. Backup/DR in a second EU region is a **second** transfer. | Requires Legal/DPO confirmation |
| HA / DR / backup | Same **in-principle** managed-cloud feasibility as A. **NOT PROVEN.** | Provisional |
| Support | EU vendor support often 24/7; remote support into Production is still a **cross-border access** issue (residency Q12). | Requires Legal/DPO confirmation |
| Latency | East Africa users: **REQUIRES TECHNICAL PROOF**; may be worse than African region. | Unknown |
| Scalability / portability | Same class comments as A. | Provisional |
| TCO | **REQUIRES PROVIDER QUOTE.** Egress and support may differ from A — **not quantified**. | Unknown |
| Lock-in | Same as A. | Provisional |

**Hard blockers until resolved:** Formal GDPR/UK GDPR applicability; Tanzania PDPA transfer position; backup/DR geography; subprocessors.

**Viable if:** Legal confirms transfer/residency for the **specific** EU region **and** copies; IT proves RTO/RPO and acceptable latency; Finance can sustain TCO.

## OPTION C — Tanzania-controlled hosting

**Concept:** Production infrastructure hosted **within Tanzania**, potentially through an appropriate local provider/facility (colo, local cloud, or Tanzanian landing zone). **Do NOT assume Tanzania has sufficient cloud/facility capabilities without evidence.**

| Dimension | Assessment | Evidence class |
| --- | --- | --- |
| Tanzania residency narrative | Aligns with Owner **candidate** preference and PDPA design-basis **if** data actually stays in Tanzania. **Not automatic legal approval** of a facility. | Requires Legal/DPO confirmation |
| PDPA | Still requires controller/processor, security, rights, retention, and any **onshore** facility due diligence. | Requires Legal/DPO confirmation |
| Availability / failure domains | **UNKNOWN / REQUIRES MARKET VALIDATION.** Repo has **no** facility survey, SLA, or multi-AZ evidence for Tanzanian colo/cloud. | Unknown |
| HA | May be harder if only one facility/power/network path exists. **REQUIRES TECHNICAL PROOF.** | Unknown |
| Backup / DR / geographic separation | A Tanzania-only stack **may fail** geographic-separation DR unless a **second Tanzanian site** or **Legal-approved** offshore copy exists. Stage 1 requires secure backup/DR; Stage 2 Legal: copies must not silently transfer. | Requires Legal + market evidence |
| Support | Local ops burden **may** be higher (fact pack I6: complete 24/7 **NOT PROVEN**). Hybrid internal+managed was **acceptable, not selected**. | Unknown |
| Internet/network resilience | **REQUIRES MARKET VALIDATION** (last-mile, upstream, DDoS). | Unknown |
| Scalability | 500/200/30% **may** need proven compute/storage headroom. **REQUIRES TECHNICAL PROOF.** | Unknown |
| Operational burden | Likely **higher** than managed cloud **if** SEDMC runs the facility — provisional, not measured. | Provisional |
| TCO | **REQUIRES PROVIDER QUOTE** (colo vs local cloud vs managed). | Unknown |
| Exit | Physical colo can reduce hyperscaler lock-in but increase **operational lock-in**. | Provisional |

**Hard blockers until resolved:** Evidence of a facility/provider that can meet HA + tested restore within <=3h/<=4h; Legal review of that facility; DR geography if a second site is needed.

**Viable if:** A specific Tanzanian facility/provider is evidenced (capacity, SLA, security, restore tests) **and** Legal attests **and** DR/backup locations are approved.

## OPTION D — Hybrid

**Concept:** Application/data/control-plane components distributed according to legal, resilience, and operational requirements (e.g. split by classification, or app vs data). **Do not recommend hybrid merely because it sounds safer.**

| Dimension | Assessment | Evidence class |
| --- | --- | --- |
| Complexity | **Higher** than a single-region managed stack (more data flows, more failure modes, more tests). Evidence: general architecture practice; **no** SEDMC hybrid Production to measure. | Provisional |
| Data classification | Stage 1 Highly Restricted: remain in **primary approved** jurisdiction (none approved yet). Hybrid **only** becomes rational **after** classification-to-geography rules (Legal A14–A15 **OPEN**). | Requires Legal/DPO confirmation |
| Cross-border transfer | Each split is a transfer/access path. More paths = more Legal work. | Requires Legal/DPO confirmation |
| Failure modes | Split-brain, partial outage (app up / data down), and inconsistent RTO across components. Must still meet jointly critical Commercial/Programme Building RTO. | Provisional |
| HA / DR | Can improve resilience **if** designed and tested; can **worsen** RTO if dependencies span untested links. | Requires Technical Proof |
| Operational overhead | Higher (two estates, two restore paths). Conflicts with unproven 24/7 SEDMC ops unless a managed provider runs both. | Provisional |
| Security | Larger attack surface (more trust boundaries). | Provisional |
| TCO | **REQUIRES PROVIDER QUOTE**; typically not the lowest-cost. | Unknown |
| Lock-in / portability | Can reduce single-hyperscaler lock-in **or** create dual lock-in. | Provisional |
| Recovery testing | **Harder**; both sides and the join must be tested. | Provisional |

**Hard blockers until resolved:** Classification matrix; Legal rules for each component location; IT proof that the join still meets <=3h/<=4h and zero tolerated **business** data loss.

**Viable if:** Legal **requires** split placement **or** IT proves a single-region class cannot meet RTO/RPO/residency together — **neither is evidenced yet**. Therefore hybrid is **not** the default.

---

# 4. Weighted decision matrix

**Scoring methodology:** No numeric scores are assigned where facts are invented. Cells use:

- **Evidence-backed** — stated in repo ADRs/governance  
- **Provisional assessment** — architecture reasoning without SEDMC Production proof  
- **Unknown** — requires quote, Legal confirmation, market survey, or test  

Weights below are **decision emphasis**, not a calculated ranking.

| # | Criterion | Weight (emphasis) | A African managed | B EU/EEA managed | C Tanzania-controlled | D Hybrid |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Business continuity / RTO | High | Provisional: feasible **if** multi-AZ + proven restore | Provisional: same class; latency **unknown** | Unknown: facility HA **unproven** | Provisional: may help or hurt RTO |
| 2 | Data-loss protection / technical RPO feasibility | High | Provisional: WAL/PITR/replica **possible** on managed PG class | Same class | Unknown: depends on local PG/backup offering | Provisional: more replica paths |
| 3 | Data residency / privacy | High | Unknown + Legal required (Africa ≠ TZ) | Unknown + Legal required (transfer both ways) | Provisional narrative better **if** data stays in TZ; facility still unapproved | Unknown until classification |
| 4 | Security | High | Provisional: mature cloud controls **available in class** | Same | Unknown: facility controls **unsurveyed** | Provisional: more boundaries |
| 5 | HA | High | Provisional | Provisional | Unknown | Provisional |
| 6 | DR | High | Provisional | Provisional | Unknown (geo-separation may need second site / transfer) | Provisional |
| 7 | Backup/recovery | High | Provisional | Provisional | Unknown | Provisional |
| 8 | Scalability | Medium | Provisional vs 500/200/30% | Provisional | Unknown | Provisional |
| 9 | Operational complexity | Medium | Provisional: lower if fully managed | Provisional: lower if fully managed | Provisional: **higher** if SEDMC operates plant | Provisional: **highest** |
| 10 | Supportability | Medium | Unknown (SEDMC 24/7 NOT PROVEN) | Unknown | Unknown | Unknown |
| 11 | 3-year TCO | High | **REQUIRES PROVIDER QUOTE** | **REQUIRES PROVIDER QUOTE** | **REQUIRES PROVIDER QUOTE** | **REQUIRES PROVIDER QUOTE** |
| 12 | Portability | Medium | Provisional: depends on service mix | Same | Provisional | Provisional |
| 13 | Vendor lock-in | Medium | Provisional: PaaS risk | Provisional: PaaS risk | Provisional: facility/ops lock-in | Provisional: dual lock-in risk |
| 14 | Implementation risk | High | Provisional: greenfield + persistence cutover | Same + transfer Legal | High until facility evidence | Highest |
| 15 | Exit risk | Medium | Provisional | Provisional | Provisional | Provisional |

**INSUFFICIENT EVIDENCE FOR FINAL RANKING.**

TCO, jurisdiction legality, Tanzanian facility capability, latency, and RTO/RPO tests are **not** in the repository as Production evidence.

---

# 5. RTO / RPO feasibility (mandatory)

## Distinctions (do not collapse)

| Layer | Statement |
| --- | --- |
| **BUSINESS REQUIREMENT** | Zero tolerated loss of **critical business data**. Critical-function RTO <= 3 hours. Overall RTO <= 4 hours. Recovery **action** begins immediately. |
| **TECHNICAL TARGET** | To be determined. **Not** declared as technical RPO = 0. |
| **TECHNICAL CAPABILITY** | Must be **proven by testing**. `<=1h` RTO / `<=15m` RPO is **NOT PROVEN** (fact pack I10/I15). Architecture 12.3 values remain **PROPOSED / NOT APPROVED**. |

## Architecture mechanisms (evaluated, not chosen)

| Mechanism | Role vs <=3h/<=4h RTO | Role vs zero **business** data-loss | Notes |
| --- | --- | --- | --- |
| Cold / backup-only restore | **May miss** <=3h if restore+rehydrate+dependency bring-up is slow. **REQUIRES TECHNICAL PROOF.** Daily 19:00 EAT backup **alone** cannot bound loss to “zero” for writes after the last backup. | **Does not** by itself meet zero tolerated **business** loss between backups. | Stage 1: restore-from-backup is a **capability**, not approved topology. IT draft: **not established as sufficient**. |
| Backup + rapid restore (runbooks, automation, PITR) | Can meet RTO **if** proven. | PITR/WAL reduces loss vs daily full-only; **still not automatically RPO 0**. | ADR-0011 Production product **TBD**. |
| WAL / continuous archiving | Supports PITR and lower **technical** RPO. | Necessary **candidate** to **qualify** near-zero loss of **committed** DB transactions; does not cover uncommitted work or logical corruption. | **Not implemented** for Production. |
| Asynchronous replication | Good RTO if standby hot; **RPO > 0** under primary loss (lag). | **Conflicts** with unqualified “zero loss” unless lag is proven ~0 and failure mode is bounded. | Not selected. |
| Synchronous replication | Can approach **zero loss of committed transactions** in the sync set. | Achievable **only under specific failure assumptions** (sync set survives; no split-brain; apps fail closed). Geographic sync has latency/cost. | **REQUIRES TECHNICAL PROOF**; not selected. |
| Point-in-time recovery | Recovers to a chosen time; useful for corruption. | Does not prevent loss; it **chooses** a point. | Complements backups. |
| Multi-zone / failure-domain HA | Supports RTO for zone failure. | Does not replace backup for corruption/ransomware. | I10 recommended; **not mandatory** until RTO/RPO approved. |
| Warm standby | Often used when backup-only cannot meet RTO. | Replica lag still defines technical RPO. | Stage 1: **not selected**. |
| Geographic DR | Region/site failure. | Replica location = **transfer** (Legal A8). | No DR region selected. |

## Is “zero data loss” technically achievable?

| Finding | Class |
| --- | --- |
| **Not** achievable as an unqualified guarantee against all failures (including corruption, operator error, or total-region loss without a surviving replica). | Evidence-backed (industry + Stage 2 B7) |
| **Possibly** achievable for **committed PostgreSQL transactions** in a defined failure set (e.g. single-AZ loss with sync replica in another AZ) **if** that design is implemented and **tested**. | Provisional |
| **Requires qualification:** IT must state the failure model, the measurable technical RPO, and whether it **meets or formally qualifies** the business requirement (Stage 1 Decision 4). | Evidence-backed process requirement |
| Current Dev/Test in-memory Store: **does not** provide Production zero-loss durability. | Evidence-backed (ADR-0017) |

**No technical RPO is declared achieved.**

---

# 6. Data residency / legal analysis (by option)

**Label:** design baseline / requires Legal/DPO confirmation / evidence required.  
**Not legal advice as certainty. Not certification.**

| Location class | Option A | Option B | Option C | Option D |
| --- | --- | --- | --- | --- |
| Production data location | African managed region **unspecified**. **NOT SELECTED.** | EU/EEA region **unspecified**. **NOT SELECTED.** | Tanzania facility **unspecified**. **NOT SELECTED.** | Split **unspecified**. |
| Backup location | Must be assessed as a transfer if ≠ Production. **NOT APPROVED.** | Same | Same; TZ-only backup may lack geo-DR | Same |
| DR / warm-standby location | **NOT SELECTED / NOT APPROVED** | Same | Second TZ site **or** Legal-approved offshore — **unknown** | Same |
| Remote support location | **REQUIRES LEGAL VALIDATION** (A11) | Same | Same | Same |
| Logging / monitoring | **REQUIRES LEGAL VALIDATION** (A12) | Same | Same | Same |
| Identity-provider location | ADR-0013 **OPEN** — unknown until product | Same | Same | Same |
| CDN / SaaS | **REQUIRES LEGAL VALIDATION** (A13) | Same | Same | Same |
| Subprocessors | None approved (L15) | Same | Same | Same |

| Regime | Design baseline | Confirmation |
| --- | --- | --- |
| Tanzania PDPA | Treat as primary privacy **design-basis** for processing by the company in Tanzania (L2 draft). | **Requires Legal/DPO confirmation** |
| Cross-border transfer | Controlled legal requirement; **no mechanism approved**. | **Requires Legal/DPO confirmation** |
| Kenya DPA | Assess where Kenyan-jurisdiction processing exists (L3). | **Requires Legal/DPO confirmation** |
| GDPR / UK GDPR | Potentially applicable, **not automatically**. Do **not** assert EU hosting is lawful or unlawful. | **Requires Legal/DPO confirmation** |
| Contractual safeguards | Required before any provider (A16/A20). | Evidence required |
| Regulatory notification/permit | Unknown; verify per destination (L10). | Evidence required |

Owner position remains: **no jurisdiction pre-approved**; Tanzania is a **candidate for assessment only**.

---

# 7. Security architecture

| Capability | CURRENT DEV/TEST | REQUIRED PRODUCTION (class, not product) |
| --- | --- | --- |
| Identity provider | Local issuer / local password port | Corporate OIDC IdP (**ADR-0013 OPEN** — **not selected**) |
| MFA | Not a Production IdP MFA | MFA where appropriate (Stage 1 / architecture 6.x) |
| RBAC | Kernel RBAC/ABAC in Dev/Test | Same model; Production enforcement + audit |
| Secrets management | Env files | KMS/secrets platform (**ADR-0012 OPEN** — **not selected**) |
| TLS | Local HTTP preview typical | TLS 1.2+ / 1.3 preferred — **draft IT, not Production proof** |
| Encryption at rest | Dev volume only | DB/storage/backups where sensitive data exists — **to be designed** |
| Key management | None Production | Tied to secrets platform; **jurisdiction unknown** |
| Network segmentation | Localhost / compose network | Private data tier; public edge — **not implemented** |
| WAF / rate limiting | Not Production | Required class per Stage 2 B26 — **not selected** |
| Audit logs | Dev/Test audit objects | Production retention + integrity (B23) |
| Monitoring / alerting | Not 24/7 Production | Required to **initiate** recovery immediately (B24) |
| Vulnerability management | CI/Dev practices | Production patching/scanning — **not a named tool** |
| Incident response | Not Production IR | Required (B25) |
| Session management | Dev sessions | Production session/token policy (B27) |
| Backup protection | Evidence register only | Encrypted, access-controlled, isolated (ADR-0011 TBD) |
| Privileged access | Dev SoD patterns in places | PAM/JIT as architecture 6.4 — **not a Production product** |
| Dev/Test separation | Intended; preview in-memory | **No live Production PII in Dev/Test** (Stage 1) |

---

# 8. Database / persistence

**The current in-memory Store cannot be treated as the Production system of record.**

Production requires **durable PostgreSQL persistence** unless a later **approved** architecture changes this (**ADR-0003**).

| Topic | Evaluation (not implementation) |
| --- | --- |
| PostgreSQL primary | Required Production SoR class. Vendor/edition/region **UNKNOWN**. Migrations **NOT AUTHORIZED**. |
| Replicas | Candidate for HA/RPO; sync vs async **not chosen** (see §5). |
| WAL | Candidate to **qualify** low technical RPO for committed writes. **Not Production.** |
| PITR | Candidate for operator error/corruption. Needs WAL + backups. |
| Backups | Encrypted, tested, remote copy (ADR-0011). Product **TBD**. |
| Restore | Success = **verified recoverability**, not job-green (ADR-0011). |
| Failover | Depends on replica/HA class; **not selected**. |
| Integrity verification | Required (B34); not Production-proven. |
| Backup encryption / retention | Required class; retention **Legal + IT + Finance** (Part D #9). **No period set.** |
| Cross-region implications | Replica/backup region = **transfer**. Legal A7–A8 **OPEN**. |

---

# 9. Backup / DR topology classes

**No final topology selected.**

| Class | RTO | Technical RPO vs zero **business** loss | Cost | Complexity | Ops burden | Failure coverage | Testing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Backup-only | **Unproven** vs <=3h | **Unlikely** to meet zero tolerated loss between backups | Lower **in class** (no quote) | Lower | Restore skill still required | Weak for zone/region and for post-backup writes | Full restore tests |
| 2. Backup + rapid restore (PITR/WAL) | **Possible if proven** | Better than daily-only; **not automatically RPO 0** | Medium **class** | Medium | Runbooks + WAL ops | Better corruption/PITR; zone loss still slow without HA | Frequent restore + PITR drills |
| 3. Warm standby | Often used for RTO | Depends on replica lag | Higher **class** | Medium–high | Standby care | Instance/zone if in another AZ | Failover tests |
| 4. HA + warm standby | Stronger RTO | Lag still defines RPO unless sync | Higher | Higher | Higher | Zone + instance | HA + failover |
| 5. HA + geographically separate DR | Region failure | DR copy = transfer + lag/RPO | Highest **class** | High | High | Region | Full DR exercises |
| 6. Other | Only if justified by Legal/IT evidence | — | — | — | — | — | — |

TCO cells: **REQUIRES PROVIDER QUOTE** (no invented numbers).

---

# 10. Finance / TCO

**No budget numbers exist. None are invented.**

Finance must compare **comparable 3-year TCO** for option classes A/B/C (Stage 1 Decision 11), covering at least:

implementation; monthly hosting; annual operating; database; storage; backups; DR; networking; security; monitoring; identity; support; licensing; migration; testing; professional services; expected growth; exit/migration.

Status: `UNANSWERED — REQUIRES FINANCE/OWNER INPUT` (Stage 2 C1–C14).

Until quotes exist, **TCO cannot rank Options A–D**.

---

# 11. Portability

Stage 1: PostgreSQL export/restore; files exportable; config portable; secrets not in code; restore outside incumbent; portable standards; contractual exit/return/deletion/notice (**duration/fees not set**).

| Concern | A / B (managed cloud class) | C (TZ-controlled) | D (hybrid) |
| --- | --- | --- | --- |
| PostgreSQL portability | Good **if** standard PG, not proprietary fork | Depends on local offering | Dual estates to export |
| Object/file portability | Use standard object APIs; avoid proprietary metadata | Unknown local object store | Dual |
| Application / container | Modular monolith + containers **can** stay portable (I17 draft) | Same app; ops differs | Same app; more wiring |
| IaC portability | Possible; **no Production IaC selected** | Possible | Two IaC trees |
| Backup portability | Encrypted exportable backups required | Same | Same |
| Provider migration / exit | Contractual (A18/C14) — **unnegotiated** | Facility contract | Two exits |
| Data return / secure deletion | Required class | Required | Required both sides |

---

# 12. Findings (not an Owner decision)

## Evidence-backed

1. Production hosting is **unset**; ADR-0006 **proposed — blocked for Production**; DP-0006 **OPEN**.  
2. Dev/Test **in-memory Store is not** a Production SoR.  
3. Production backup **product is TBD**; restore **not proven** for Production.  
4. IdP and secrets products **OPEN**.  
5. **No** provider, region, or topology is approved.  
6. **No** Finance figures exist.  
7. Legal/DPO has **not** attested; Production jurisdiction **UNKNOWN**.  
8. Technical RPO/RTO **not proven**. Zero business data-loss is **not** an achieved technical RPO.

## Advantages / disadvantages (provisional)

| Option | Material advantage | Material disadvantage |
| --- | --- | --- |
| A | Managed HA/DR **class**; possible East Africa latency | African region **availability and legality** unproven in-repo; Africa ≠ Tanzania |
| B | Mature managed-cloud **class** | Transfer/GDPR **unknown**; latency **unmeasured**; not automatically lawful |
| C | Matches Owner **candidate** geography if data stays in TZ | Facility/HA/DR **evidence absent**; geo-DR may force a transfer anyway |
| D | Only if Legal **forces** split placement | Highest complexity; no evidenced need **yet** |

## Hard blockers (all options)

- Legal/DPO confirmation of Production **and** backup/DR jurisdictions.  
- IT proof of RTO/RPO against a **named option class** (tests).  
- Finance comparable 3-year TCO.  
- Durable Production PostgreSQL cutover plan (migrations still **NOT AUTHORIZED**).  
- IdP + secrets decisions (ADR-0012/0013) before UAT/Production.  
- PCI evidence still **NOT ESTABLISHED**.

## Unknowns requiring evidence (minimum set — not generic fishing)

1. **Market:** At least one **African-region** managed offering **and** one **EU** managed offering **and** one **Tanzanian facility/local cloud** — capability, restore RTO, multi-AZ, support hours — **quotes**, not vendor marketing.  
2. **Legal:** Written confirmation whether Tanzania-only, African-foreign, and EU placements are **approvable** for Production+backup+DR for the relevant data classes; transfer mechanism if needed.  
3. **Technical:** Timed restore and (if proposed) failover tests against a **reference architecture** (can be lab), measuring RTO and **technical** RPO under a stated failure model.  
4. **Finance:** 3-year TCO for three option sketches (balanced / lower-cost viable / higher-control) using those quotes.  
5. **Identity/secrets:** Product shortlist **after** hosting class is narrowed (still not selected here).

## Conditions of viability

Already stated per option in §3. Hybrid is **not** default.

## Preliminary ranking

**INSUFFICIENT EVIDENCE FOR FINAL RANKING.**

No evidence-backed numeric rank is assigned.

## Recommended next decision questions (precise)

1. Does Legal/DPO **forbid**, **permit with conditions**, or **require Tanzania-only** for Production and for backup/DR copies?  
2. Given (1), which **one** option class (A, B, or C) should IT cost and **lab-test** first? (D only if (1) requires split placement.)  
3. What **qualified** technical RPO and failure model will Owner accept as meeting “zero tolerated loss of critical business data”?  
4. Finance: what TCO envelope applies once three quoted sketches exist?

---

# 13. ADR-0006 DECISION READINESS

ADR-0006:  
`PROPOSED — NOT YET APPROVED`

DP-0006:  
`OPEN — NOT APPROVED`

Production:  
`NOT AUTHORIZED`

Deployment:  
`NOT AUTHORIZED`

Migrations:  
`NOT AUTHORIZED`

Final provider:  
`NOT SELECTED`

Final Production region:  
`NOT SELECTED`

Final Production topology:  
`NOT SELECTED`

Implementation:  
`NOT AUTHORIZED BY THIS TASK`

---

# 14. Required next stage

This package is **sufficient to compare option *classes* and to list hard blockers**.

It is **not** sufficient to lock a Production architecture.

**Not:** `READY FOR OWNER ARCHITECTURE DECISION` as a **final** hosting selection.

**Yes:** `READY FOR OWNER DIRECTION ON WHICH OPTION CLASS TO EVIDENCE FIRST`, after or in parallel with the **minimum evidence** in §12 (Legal placement rule, one lab-tested reference architecture, three TCO sketches).

Do not loop on generic questionnaires. The four questions in §12 are the minimum.

Stage 2 remains `VALIDATION / DECISION PREPARATION`. Named Legal/IT/Finance attestations remain **blank**.
