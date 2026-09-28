# E1-C — Production Operations Readiness Plan (framework)

> **`FRAMEWORK ONLY — OPERATIONAL READINESS NOT CLAIMED`**  
> **`NO NAMED ON-CALL PERSON INVENTED`**  
> **`E1-B SENDER ≠ PRODUCTION OPS`**  
> **`NO PRODUCTION AUTHORIZATION`**

**Date:** 2026-09-17.

Ownership cells are **TBD** until a company human records roles. Do not invent personal names.

| Function | Purpose | Current evidence | Required before Production | Status |
| --- | --- | --- | --- | --- |
| Operational ownership | Named roles for restore, backup, app, identity | None | HUM-08 | **NOT READY** |
| On-call | Coverage overlapping Commercial RTO window (EAT) | None | Human roster | **NOT READY** |
| Incident response | Detect, contain, notify, learn | E-15 draft | Production IR; DPO if appointed; provider contacts | **DRAFT ≠ READY** |
| Escalation | Internal then provider | None | HUM-08 + provider support path | **NOT READY** |
| Backup monitoring | Job + restore-probe (ADR-0011) | Dev evidence register only | Production product + alerts | **NOT READY** |
| Restore monitoring | Restore test cadence | Lab only | RV plan | **NOT READY** |
| Security monitoring | Auth failures, admin actions, MFA | Dev security alerts `devtest.webhook` | Production SIEM/IdP | **NOT READY** |
| Access reviews | Periodic privileged access | SoD rules exist in Dev | IdP + owner | **NOT READY** |
| Certificate management | TLS issuance/renewal | None Production | Provider/DNS owner | **NOT READY** |
| Secrets rotation | Rotate token/DB/KMS | Env Dev | ADR-0012 | **NOT READY** |
| Vendor escalation | Named provider support path | Official routes verified ≠ contract | After contracting | **NOT READY** |
| Provider support | SLA vs ≤3h critical RTO | AWAITING PROVIDER RESPONSE | Quotes/SLA | **NOT READY** |
| Change management | Controlled Production change | Gate C not authorized | Authorization | **NOT READY** |
| Deployment | Repeatable Production deploy | Forbidden to lock IaC | DP-0006 | **NOT READY** |
| Rollback | Documented rollback | None Production | After topology | **NOT READY** |
| Disaster recovery | DR runbook matching assessed site | Unselected | After DR decision | **NOT READY** |
| Evidence retention | Keep restore/IR artefacts | Lab run folders exist for lab | Retention decision (E-13 draft) | **NOT READY** for Production |

**Operational readiness is not claimed.**
