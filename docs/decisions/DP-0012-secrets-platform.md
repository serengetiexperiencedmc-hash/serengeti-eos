# Decision Paper — ADR-0012 Enterprise Secrets Platform

**Status:** OPEN — blocked for UAT and Production  
**Related ADR:** [ADR-0012](../adr/ADR-0012-secrets-platform.md)

## Decision required

Where Production/UAT secrets and keys are stored, rotated, audited, and recovered.

## Development (allowed now)

- Gitignored local `.env` / process env  
- Secrets **references** in code, never values  
- No production credentials in git, images, or config committed to source  

## Comparison dimensions

| Dimension | Evaluate |
| --- | --- |
| Encryption | At rest, envelope encryption |
| Key management | CMK ownership, rotation |
| Rotation | Automated credential rotation |
| Dynamic credentials | DB/cloud short-lived creds |
| Workload identity | Avoid static keys where possible |
| Audit | Who accessed which secret |
| Availability | HA for secret reads at boot |
| Backup/recovery | Break-glass key escrow |
| Integration | API, K8s, CI |
| Operational complexity | Team size vs Vault ops |
| Cost | License + ops |
| Exit strategy | Export / dual-run |

## Options under consideration (not selected)

| Option | Notes |
| --- | --- |
| HashiCorp Vault | Strong control plane; ops cost |
| Cloud Secrets Manager + KMS | Tied to ADR-0006 cloud choice |
| Hybrid Vault + cloud KMS | Higher complexity |

**Recommended option:** *Not selected — depends on ADR-0006.*

## Gate

UAT/Production secrets architecture must not be hard-coded. Application uses a `SecretsProvider` port (see I1 abstractions).
