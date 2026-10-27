# ZFund — Contribution Management Platform (Backend API)

**ZFund** is a production-grade USSD and web-based contribution management platform enabling individuals, churches, schools, alumni associations, event organizers, and community initiatives to collect contributions from the general public via Mobile Money.

---

## 1. Architectural Highlights

- **Mandatory 5-Tier Request Architecture:** `Routes → Middleware → Controllers → Services → Data Access / External Integrations`.
- **Database-Driven USSD Engine:** USSD menus, prompts, options, and transitions are loaded dynamically from PostgreSQL. **No project menus are hardcoded in source code.**
- **Telecom Integration (NALO Gateway):** Supports general dial (`*920*969#`) and direct project entry (`*920*969*<EVENT_CODE>#`) with 120-character telecom limit enforcement.
- **Payment Processing (Paystack):** Mobile Money collections, HMAC SHA-512 webhook authentication, timing-safe signatures, and database-level idempotency.
- **Double-Entry Financial Ledger:** Every confirmed payment automatically records balanced entries across Cash/Clearing, Contributions Payable, and Payment Gateway Fee accounts using exact decimal arithmetic (`BigNumber.js`).
- **Refund Management:** Strict refund validation, approval workflows, Paystack refund API execution, and automatic ledger adjustments.
- **Multi-Provider SMS Messaging:** Abstracted provider system with `MockSmsAdapter` and `ArkeselSmsAdapter`, database notification templates, and non-blocking delivery.
- **Enterprise Security:** Argon2id password hashing, short-lived JWT access tokens, SHA-256 hashed refresh token session rotation in PostgreSQL, role-based access control (RBAC), and private document storage with authorized streaming.
- **Database Synchronization:** Uses TypeORM `synchronize: true` across 39 registered entities with production safeguards. **Zero migration scripts or migration directories required.**

---

## 2. Technology Stack

- **Runtime & Language:** Node.js (v18+) & TypeScript (Strict Mode)
- **Framework:** Express.js
- **Database:** PostgreSQL with TypeORM (`synchronize: true`)
- **Caching & Locking:** Redis (with automatic in-memory fallback for offline test environments)
- **Authentication:** Argon2id & JSON Web Tokens (Access + Rotating Refresh Tokens)
- **Payment Gateway:** Paystack (Mobile Money, Card, Webhooks, Refunds)
- **USSD Gateway:** NALO Solutions USSD Gateway
- **SMS Gateway:** Arkesel & Mock Provider
- **Validation:** Zod
- **Logging:** Pino (Structured logging with automatic secret/credential redaction)
- **Testing:** Jest, Supertest, pg-mem

---

## 3. Quick Start & Setup

### 3.1 Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ running locally or in Docker
- Redis 6+ (optional; an in-memory fallback is included for offline development)

### 3.2 Environment Configuration
Copy the provided environment example file:
```bash
cp .env.example .env
```
Ensure your database credentials match your local PostgreSQL configuration:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=zfund_db
TYPEORM_SYNCHRONIZE=true

JWT_ACCESS_SECRET=your_super_secret_access_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here

PAYSTACK_SECRET_KEY=sk_test_placeholder_key_for_zfund_integration
PAYSTACK_WEBHOOK_SECRET=sk_test_placeholder_key_for_zfund_integration

SMS_PROVIDER=mock
```

### 3.3 Installation
```bash
npm install
```

### 3.4 Database Seeding (Initial Setup)
Run the idempotent seed script to populate default system roles, permissions, administrative accounts, project categories, and notification templates:
```bash
npm run seed
```

### 3.5 Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:5000`.

### 3.6 Automated Testing
Execute the complete test suite (8 test suites, 46 tests):
```bash
npm test
```

### 3.7 Production Build & Execution
```bash
npm run build
npm start
```

---

## 4. API Documentation (Swagger / OpenAPI)

Once the server is running, explore and test the interactive API documentation:
```
http://localhost:5000/api/docs
```

### Base API Endpoints Summary (`/api/v1`)
- **Health Checks:** `GET /api/v1/health`, `GET /api/v1/health/ready`
- **Authentication:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh-token`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/profile`
- **Organizations:** `GET /api/v1/organizations`, `POST /api/v1/organizations`, `PATCH /api/v1/organizations/:id/verify`
- **Projects:** `GET /api/v1/projects`, `POST /api/v1/projects`, `PATCH /api/v1/projects/:id/publish`
- **USSD Menus:** `GET /api/v1/ussd/flows`, `POST /api/v1/ussd/flows`, `POST /api/v1/ussd/flows/:id/publish`
- **USSD Runtime:** `POST /api/v1/ussd/nalo`
- **Payments:** `POST /api/v1/payments/initiate`, `GET /api/v1/payments/verify/:reference`, `POST /api/v1/payments/webhook/paystack`
- **Refunds:** `POST /api/v1/refunds`, `PATCH /api/v1/refunds/:id/review`, `POST /api/v1/refunds/:id/process`
- **Financial Ledger:** `GET /api/v1/financial/summary`, `GET /api/v1/financial/ledger`
- **Notifications & SMS:** `GET /api/v1/notifications`, `POST /api/v1/notifications/test-sms`
- **Private Documents:** `POST /api/v1/documents/upload`, `GET /api/v1/documents/:id/download`, `PATCH /api/v1/documents/:id/review`

---

## 5. Technical Documentation Index

For in-depth architectural and provider specifications, consult the documents inside `docs/`:

1. [Architecture & Request Lifecycle](docs/ARCHITECTURE.md)
2. [Database Design & TypeORM Synchronize Guidelines](docs/DATABASE.md)
3. [Database-Driven USSD Engine & Action Registry](docs/USSD-ENGINE.md)
4. [NALO USSD Gateway Integration](docs/NALO-INTEGRATION.md)
5. [Paystack Payment & Webhook Integration](docs/PAYSTACK-INTEGRATION.md)
6. [SMS Provider Architecture & Templates](docs/SMS-INTEGRATION.md)
7. [Security Controls, Cryptography & RBAC](docs/SECURITY.md)
8. [Implementation Status & Delivery Report](docs/IMPLEMENTATION-STATUS.md)
