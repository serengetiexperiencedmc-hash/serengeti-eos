# 15. Trust Boundaries

```mermaid
flowchart TB
  subgraph TB0[TB-0 Untrusted public internet]
    BROWSER[Browsers]
    MOBILE[Mobile devices]
    PARTNER_NET[Partner networks]
  end

  subgraph TB1[TB-1 Edge]
    WAF[WAF / TLS terminate]
    GW[API Gateway]
    PARTNER_GW[Partner API edge]
  end

  subgraph TB2[TB-2 Application zone]
    API[Modular monolith]
    WK[Workers]
  end

  subgraph TB3[TB-3 Data zone]
    PG[(PostgreSQL)]
    RD[(Redis)]
    OBJ[Object storage]
    NATS[Event bus]
  end

  subgraph TB4[TB-4 Management / PAM]
    ADMIN[Admin paths]
    VAULT[Secrets]
    BAK[Backup keys]
  end

  subgraph TB5[TB-5 External processors]
    IDP[IdP]
    AI[AI providers]
    NTF[Email/SMS]
  end

  subgraph TB6[TB-6 Field offline]
    CACHE[Encrypted device cache]
  end

  BROWSER --> WAF --> GW --> API
  PARTNER_NET --> PARTNER_GW
  PARTNER_GW -.->|never| API
  PARTNER_GW --> API
  API --> PG
  API --> AI
  API --> NTF
  API --> IDP
  MOBILE --> CACHE
  CACHE --> GW
  ADMIN --> VAULT
```

| Boundary | Rule |
| --- | --- |
| TB-0 → TB-1 | TLS, rate limit, bot/abuse controls |
| TB-1 → TB-2 | Authenticated principal required except health/JWKS |
| Partner edge → app | Partner audience tokens only; no workforce cookies |
| TB-2 → TB-3 | Private network, least-privilege DB roles |
| TB-2 → TB-5 | Egress allowlist, DLP, no Highly Restricted by default |
| TB-4 | Dual control, session recording (PAM Phase 3) |
| TB-6 | Minimised data, expiry, remote wipe, re-auth on sync |
| AI tools → data | Same ABAC as human; citations; no boundary bypass |

Network location is **not** a sufficient credential.
