# 16. Human Approval Matrix

AI cannot manufacture approval. Approvals are workflow tasks bound to a principal, recorded in Decision Management + Audit.

| Action class | Min authority (proposed) | Dual control | AI allowed | Irreversible? |
| --- | --- | --- | --- | --- |
| Financial posting / payment release | Finance approver per matrix | Yes above threshold | Recommend/draft only | Often |
| Discount / margin below floor | Commercial + Finance | If material | Recommend | No |
| Supplier create | Procurement | No | Draft | No |
| Supplier approve / bank change | Procurement + Finance | Yes | No execute | Risky |
| Contract execute | Legal + domain owner | Yes if material | Draft | Yes |
| Employment offer / terminate | HR + manager | Terminate: yes | Draft | Yes |
| Privileged role grant | IAM owner | Yes | No | Reversible with lag |
| Break-glass | CISO / IT duty | Yes (or post-review if life-safety) | No | Session |
| Production deploy high-risk | Change approver ≠ developer | Yes | No | Risky |
| External crisis communication | Crisis Commander / Exec | Yes if public | Draft | Yes |
| Regulatory submission | Compliance + Exec | Yes | Draft | Yes |
| Sensitive data bulk export | Data owner + DPO | Yes | No | Depends |
| Security containment (prod isolate, mass disable) | CISO | Yes except pre-approved micro-containment | Recommend | Risky |
| AI autonomy map change | AI owner + CISO | Yes | No | Yes |
| Knowledge publish as authoritative | Domain owner | No | Draft | No |
| Programme go-live | MICE/Ops manager | If high-risk itinerary | Recommend | No |
| Guest medical data access | Need-to-know + purpose | Break-glass logged | No | No |
| Backup restore to prod | BCM + IT | Yes | No | Yes |
| Provider failover for payments | Finance + IT | Yes | No | Risky |
| Data erasure (DSR) | DPO | Yes | No | Yes |

Threshold amounts, named roles, and delegations are **configuration**, not code. Values above are a starting policy for approval.

Life-safety exception: a named duty officer may act first; the system still records the action and requires post-event review.
