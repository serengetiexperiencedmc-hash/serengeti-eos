# Decision Paper — ADR-0006 Hosting & Data Residency

**Status:** OPEN — for formal human approval before UAT/Production infrastructure  
**Related ADR:** [ADR-0006](../adr/ADR-0006-hosting-and-residency.md)  
**Rule:** Do not lock this decision by implementing Production Terraform/K8s against a chosen cloud.

## Decision required

Where Serengeti EOS Production (and UAT) will run, where data resides, and where backups/DR copies live.

## Comparison dimensions

| Dimension | What to evaluate |
| --- | --- |
| Hosting model | Public cloud / African region / EU region / colo / hybrid |
| Geographic regions | Primary compute, primary DB, backup, DR |
| Data residency | Guest PII, employee PII, commercial data |
| Regulatory implications | Tanzania PDPA 2022; Kenya DPA if applicable; GDPR if EU data subjects — **legal review, not claimed certification** |
| Security controls | Encryption at rest/in transit, KMS, network isolation, IAM |
| Backup location | Must support 19:00 EAT schedule + remote copy (ADR-0011) |
| DR location | Same region vs secondary region; RTO/RPO feasibility |
| Availability | Multi-AZ vs single-AZ; SLA |
| Latency | Field ops in East Africa; admin users |
| Cost | Steady-state + egress + backup + DR |
| Scalability | Workforce hundreds → partner APIs later |
| Vendor lock-in | Proprietary services vs portable (Postgres, containers) |
| Exit strategy | Export data, IaC portability, DNS cutover |
| BCM | Manual workarounds if region fails |

## Options under consideration (not selected)

| Option | Sketch | Pros | Cons |
| --- | --- | --- | --- |
| A — African public-cloud region (if available for chosen vendor) | Primary in Africa | Latency, residency narrative | Region feature gaps, cost |
| B — EU region + transfer safeguards | Mature controls | Strong security tooling | Cross-border transfer assessment required |
| C — Hybrid (app cloud, sensitive offline/manual) | Split risk | Limits cloud PII | Operational complexity |
| D — Colocation Tanzania/Kenya | Local control | Residency | Ops burden, slower scale |

**Recommended option:** *Not selected — awaiting business, legal, and IT input.*

## Alternatives for approval packet

Present at least: recommended option + one lower-cost alternative + one higher-control alternative, each with residency and exit notes.

## Gate

UAT/Production hosting must not be finalized until this paper is approved and ADR-0006 status updated.
