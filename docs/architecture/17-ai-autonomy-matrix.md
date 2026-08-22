# 17. AI Autonomy Matrix

Default for all new agents: **Level 1 (Recommend)** and **no tools with side effects**.

| Action class | Max autonomy | Notes |
| --- | --- | --- |
| Summarise a record the user can already read | 1–2 | Citations; mark as AI |
| Draft RFP response / proposal section | 2 | Unpublished until human |
| Suggest CRM next action | 1 | |
| Create draft IT ticket from monitoring | 3 | If rule pack approved |
| Send internal notification to assignee of existing task | 3 | Template only |
| Send client email | 2 draft / human send | External comms |
| External crisis comms | 5 | |
| Create supplier | 2 | |
| Approve supplier or payment | 5 | SoD: agent cannot approve own rec |
| Change price / margin | 1 | |
| Post invoice / payment | 5 | |
| Modify IAM / roles | 5 | |
| Invoke security containment | 1 (recommend) | Micro-containment list is separate, human-approved |
| Publish knowledge as authoritative | 2 | |
| Index / retrieve search | 3 if permission-aware | Never exceed IAM |
| Generate exercise injects | 2 | Synthetic data only |
| Escalate incident severity to Crisis | 1 | |
| Change own prompt, tools, or autonomy | 5 | |
| Delete production data | 5 | |
| Train/fine-tune on production PII | 5 | DPIA required if ever |

Level 4 (conditional automation) requires: written rule, evaluation gate, monitoring, rollback, and named human owner.

**SoD:** An AI agent must not approve its own recommendation. A second autonomous agent must not close that loop either.
