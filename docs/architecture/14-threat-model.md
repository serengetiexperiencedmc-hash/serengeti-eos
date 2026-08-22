# 14. Threat Model (STRIDE)

Scope: Phase 1 kernel + intended enterprise surface. This is a living document. It is **not** a penetration-test report.

## 14.1 Assets

| Asset | Sensitivity |
| --- | --- |
| Guest PII / travel docs / health notes | Restricted / Highly Restricted |
| Employee PII, payroll | Restricted |
| Commercial pipeline, rates, margins | Confidential |
| Privileged credentials, signing keys | Highly Restricted |
| Audit and evidence integrity | High integrity |
| Programme operational safety data | Confidential / Restricted |
| AI prompts, tools, and retrieved context | Varies; can leak if mis-scoped |

## 14.2 STRIDE by component

| Component | Spoofing | Tampering | Repudiation | Info disclosure | DoS | Elevation |
| --- | --- | --- | --- | --- | --- | --- |
| Web / mobile | Session theft, phishing | Client-side bypass (must not be trusted) | Missing actor on writes | Over-broad UI queries | Login flooding | Hidden admin routes |
| API | Stolen tokens, confused deputy | Unsigned webhooks | No audit | IDOR, verbose errors | Expensive queries | Missing ABAC |
| IAM | Credential stuffing | Role tampering | Unlogged impersonation | Token leakage | Lockouts | Standing privileged roles |
| DB | Stolen creds | Silent UPDATEs of audit | DBA deniability | Backup theft | Connection exhaustion | Superuser |
| Events | Fake publisher | Payload mutation | Unattributed events | Over-subscribed consumers | Flood | Consumer running as admin |
| AI | Prompt injection as “user” | Tool argument injection | Unmarked AI actions | Training/egress leak | Token burn | Agent self-approval |
| Backup | Fake job success | Unencrypted copies | No restore evidence | Offsite breach | Ransom | Restore to wrong tenant |
| Partners | Token reuse | Scope creep | Unlogged calls | Cross-tenant | Abuse | Internal API reachability |
| Field offline | Stolen device | Cache tamper | Sync as someone else | Cache dump | Sync storm | Stale privilege |

## 14.3 Priority mitigations (build in this order)

1. Tenant isolation + ABAC + IDOR tests
2. Tamper-evident audit (hash chain)
3. No standing admin; PAM later, dual-control now for role grants
4. DLP gate before AI egress
5. Idempotency and SoD on money and approvals
6. Encrypted, restore-tested backups
7. Rate limits and lockout with monitoring
8. Agent identity distinct from user identity

## 14.4 Abuse cases (defensive tests, not exploits)

- User A reads User B’s guest passport by guessing UUID
- Agent drafts a payment and a second agent “approves” it
- Partner token used against internal `/v1/admin`
- Prompt-injected itinerary note causes tool call to export HR data
- Backup marked success without restore probe

These are **authorization and control tests** in our suite. No exploit payloads or offensive tooling.
