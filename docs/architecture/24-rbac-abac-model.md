# 24. Initial RBAC / ABAC Model

## 24.1 Permission grammar

`{domain}:{action}:{resource}`

Examples: `identity:read:principal`, `finance:approve:payment`, `audit:read:event`.

Wildcard `*` is forbidden in Production role grants except a break-glass role that is JIT and dual-controlled.

## 24.2 Seed roles (internal tenant)

| Role | Intent | Typical domains |
| --- | --- | --- |
| `platform.break_glass` | Emergency only | JIT all — dual control |
| `platform.admin` | Configuration, not business approve | config, org structure |
| `iam.admin` | Identity ops | identity (not self-privilege without dual control) |
| `exec.viewer` | Command Center read | aggregated read |
| `commercial.member` | CRM/sales work | crm, sales |
| `mice.member` | Programme work | mice, ops read |
| `ops.member` | Field/ops | ops, calendar |
| `finance.member` | Books | finance (no self-approve) |
| `finance.approver` | Money gates | finance approve |
| `procurement.member` | Buying | procure, supplier |
| `hr.member` | People | hr |
| `it.agent` | ITSM | itsm |
| `security.analyst` | SOC read/investigate | security |
| `security.commander` | Containment approval | security approve |
| `compliance.member` | Obligations | compliance, privacy read |
| `risk.member` | ERM | erm |
| `audit.member` | Internal audit | audit-ia, audit read |
| `dpo` | Privacy | privacy |
| `ai.owner` | Agent config | ai (not autonomy map alone) |
| `crisis.commander` | L3 command | crisis |
| `ai.agent` | Workload | only listed tools |

A principal may hold multiple roles. **SoD engine** rejects forbidden pairs on the same object (e.g. payment creator vs approver).

## 24.3 ABAC attributes

| Attribute | Source |
| --- | --- |
| `tenant_id` | token |
| `principal_id` | token |
| `actor_type` | Human / Service / AiAgent |
| `org_unit_id` | assignment |
| `department` | org unit |
| `classification_clearance` | personnel |
| `programme_ids` | assignment |
| `purpose` | request header / workflow |
| `environment` | runtime |
| `device_posture` | Phase 3 |
| `country` | session risk later |

Policy examples:

- Deny if `resource.tenant_id != principal.tenant_id` (except dual-control auditors with explicit grant)
- Deny AI egress if `resource.classification` ∈ {Restricted, HighlyRestricted} unless DPIA flag
- Allow ops read of guest operational needs if `programme_id ∈ principal.programme_ids` and purpose = `operations`

## 24.4 Decision algorithm

1. Authenticate  
2. Deny if session revoked / expired  
3. SoD check on the action+object  
4. RBAC: any role grants permission  
5. ABAC: all applicable policies must allow  
6. Step-up MFA if policy requires  
7. Audit allow/deny  

Fail closed on policy engine error.
