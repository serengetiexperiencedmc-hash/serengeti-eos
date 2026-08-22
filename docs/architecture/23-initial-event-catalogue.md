# 23. Initial Event Catalogue

Status: **draft**. Only kernel events are implemented in Increment 0.

| Event type | Classification | Publisher | Consumers (planned) | Payload essentials |
| --- | --- | --- | --- | --- |
| `sedmc.identity.principal.created.v1` | Internal | identity | audit, hr, graph | principalId, type |
| `sedmc.identity.principal.suspended.v1` | Confidential | identity | session-revoker, notify | principalId, reasonCode |
| `sedmc.identity.session.revoked.v1` | Internal | identity | api-cache | sessionId |
| `sedmc.identity.role.granted.v1` | Confidential | identity | audit, sod | principalId, roleId, expiry |
| `sedmc.org.unit.updated.v1` | Internal | org | graph | unitId |
| `sedmc.audit.chain.checkpoint.v1` | Internal | audit | bcm | lastHash, count |
| `sedmc.config.version.approved.v1` | Confidential | config | workflow, notify | itemKey, version |
| `sedmc.identity.role.granted.v1` | Confidential | identity | audit, sod | principalId, roleId, expiry |
| `sedmc.admin.org_unit.created.v1` | Internal | admin | graph | unitId |
| `sedmc.admin.session.revoked.v1` | Internal | admin | api-cache | sessionId |
| `sedmc.notify.delivery.failed.v1` | Internal | notify | itsm | messageId |
| `sedmc.ai.invocation.completed.v1` | Confidential | ai | audit, cost | agentId, model, tokens |

Phase 2 candidates (not active): `sedmc.mice.rfp.received.v1`, `sedmc.finance.payment.requested.v1`, `sedmc.ops.incident.opened.v1`.

Unregistered types are rejected by the publisher in Test+.
