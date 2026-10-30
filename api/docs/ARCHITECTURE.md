# ZFund Backend Architecture

This document describes the architectural principles, layers, request-handling lifecycle, and module design for the **ZFund** backend.

---

## 1. Architectural Pattern: Mandatory 5-Tier Request Flow

The ZFund backend strictly adheres to a unidirectional 5-tier architecture:

```
[ HTTP Request ]
       │
       ▼
1. Routes (URL paths, HTTP methods, route wiring)
       │
       ▼
2. Middleware (Correlation ID, Rate limiting, Authentication, RBAC, Zod Validation, Multipart uploads)
       │
       ▼
3. Controllers (Read validated input, invoke domain service, send standardized HTTP responses)
       │
       ▼
4. Services (Business logic, financial transactions, USSD state machine, workflow orchestration)
       │
       ▼
5. Data Access & External Integrations (TypeORM entities, Repositories, Redis, RobsPay, NALO, SMS)
       │
       ▼
[ HTTP Response / Provider Response ]
```

### 1.1 Strict Layer Responsibilities

| Layer | Responsibilities | Strict Anti-Patterns / Forbidden Practices |
|---|---|---|
| **Routes** | Defines HTTP endpoints and mounts necessary middleware and controller handlers. | **No business logic, database queries, or request body mutations.** |
| **Middleware** | Cross-cutting concerns: correlation ID injection, security headers (Helmet), CORS, rate limiting, JWT extraction, role/permission verification, Zod schema validation, multipart file parsing. | **No direct database transactions or business decision-making.** |
| **Controllers** | Thin request adaptors: read `req.params`, `req.query`, `req.body` (already validated), read `req.user`, call domain service methods, format standardized JSON via `ApiResponse.success` or `ApiResponse.paginated`. | **Never execute SQL/TypeORM queries, payment calculations, USSD state logic, or financial operations in controllers.** |
| **Services** | Core business domain logic, financial consistency, state machine transitions, entity composition, orchestration of external providers. | **Services must never touch Express `req` or `res` objects.** |
| **Data Access & Integrations** | TypeORM entities and repositories, Redis cache/locking, RobsPay API client, NALO USSD adapter, SMS provider abstractions. | **Never leak raw database entities with passwords, secret hashes, or private storage paths to clients.** |

---

## 2. Directory Structure & Module Topology

All application code is located inside `api/src`:

```
api/
├── src/
│   ├── common/                       # Shared utilities, middleware, error hierarchy, types
│   │   ├── errors/                   # AppError, BadRequestError, UnauthorizedError, etc.
│   │   ├── middleware/               # Auth, RBAC, Validation, Rate Limiters, Webhook Auth
│   │   ├── types/                    # Express extensions, Auth roles & permissions
│   │   └── utils/                    # Decimal math (MoneyUtil), Crypto & JWT (CryptoUtil), ApiResponse
│   ├── config/                       # Application configuration
│   │   ├── database.ts               # TypeORM DataSource & entity registration
│   │   ├── env.ts                    # Zod environment schema & runtime validation
│   │   ├── logger.ts                 # Pino structured logger with secret redaction
│   │   ├── redis.ts                  # Redis connection with in-memory test fallback
│   │   └── swagger.ts                # OpenAPI / Swagger definition
│   ├── database/                     # 39 TypeORM entities registry & database seeder
│   │   ├── entities.ts               # Central export of all registered entities
│   │   └── seed.ts                   # Idempotent development & initial setup seed
│   ├── modules/                      # Domain feature modules
│   │   ├── audit/                    # Comprehensive system audit trail
│   │   ├── auth/                     # Authentication, Argon2id, JWT, refresh rotation, sessions
│   │   ├── users/                    # User accounts, status, RBAC management
│   │   ├── organizations/            # Multi-tenant organizations, verification status
│   │   ├── projects/                 # Projects, unique event codes, contribution purposes
│   │   ├── ussd/                     # Database-driven USSD engine, NALO adapter, runtime execution
│   │   ├── payments/                 # RobsPay provider, payments, webhook processor
│   │   ├── contributions/            # Public contributions, contributor records
│   │   ├── refunds/                  # Refund request, approval, processing, ledger sync
│   │   ├── financial/                # Double-entry ledger, reporting & reconciliation
│   │   ├── notifications/            # Multi-provider SMS abstraction, Arkesel, templates
│   │   ├── documents/                # Private file storage, verification review workflow
│   │   └── system/                   # Health checks, readiness probes, system settings
│   ├── app.ts                        # Express application factory & middleware pipeline
│   └── server.ts                     # HTTP server startup & graceful shutdown
├── storage/                          # Private local file storage (excluded from public web)
└── tests/                            # Jest & Supertest automated test suites
```

---

## 3. Standardized Response Envelope

All API endpoints return a uniform JSON envelope:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Projects retrieved",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error description",
  "code": "BAD_REQUEST",
  "correlationId": "4a7b9c1d-8e2f-4a3b-9c1d-8e2f4a3b9c1d"
}
```

---

## 4. Multi-Tenant Organization Boundaries

ZFund enforces strict multi-tenancy:
1. **Organizations:** Multiple users belong to an organization with distinct roles (`ORG_ADMIN`, `PROJECT_MANAGER`, `FINANCE_OFFICER`).
2. **Projects:** Projects are owned by an organization or an individual account owner.
3. **Data Isolation:** All queries for projects, contributions, and documents filter by the requesting user's organization boundary.
4. **Platform Staff:** High-privilege roles (`SUPER_ADMIN`, `PLATFORM_ADMIN`, `VERIFICATION_OFFICER`, `AUDITOR`) have cross-organization visibility for compliance, support, and audit purposes.
