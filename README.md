# Next Digital Technical Test

## Project Overview

This project implements a banking backend system simulating ATM operations for a financial institution. It allows clients to interact with their accounts via ATMs, supporting operations such as viewing account movements, withdrawing and depositing cash, making transfers, activating cards, and changing PINs. The system is built with NestJS, Prisma ORM, and PostgreSQL, and is fully containerized with Docker.

## Features

- **Account Movements:**
  - View all movements (deposits, withdrawals, fees, incoming/outgoing transfers) for any account.
  - Each movement is labeled by type.
- **Withdrawals:**
  - Only from the account linked to the inserted card.
  - Debit cards: only if sufficient balance.
  - Credit cards: up to the credit limit.
  - Always respects card withdrawal limits.
  - If the ATM is from another bank, commissions are applied.
- **Deposits:**
  - Only allowed at ATMs of the same bank as the account.
  - Only to the account linked to the inserted card.
- **Transfers:**
  - To any valid IBAN (same or different bank).
  - IBAN format is validated.
  - Transfers to other banks may incur commissions.
- **Card Activation:**
  - Card must be activated (with PIN) before any operation.
- **PIN Management:**
  - PIN can be changed at any time.
  - Changing PIN is mandatory after initial activation.
- **Security:**
  - PINs are never stored in plain text (hashed with bcrypt).

## API Endpoints

All endpoints are prefixed with `/api/v1/`. Full Swagger documentation is available at `/api/v1/docs` when the app is running.

### Accounts

- `GET /api/v1/accounts` — List all accounts
- `GET /api/v1/accounts/:id` — Get account by ID
- `POST /api/v1/accounts` — Create account
- `DELETE /api/v1/accounts/:id` — Delete account

### Cards

- `GET /api/v1/cards` — List all cards (PIN is never returned)
- `GET /api/v1/cards/:id` — Get card by ID
- `POST /api/v1/cards` — Create card (initially inactive)
- `PATCH /api/v1/cards/:id` — Update card (e.g., withdrawal limit)
- `POST /api/v1/cards/:id/activate` — Activate card (requires PIN)
- `POST /api/v1/cards/:id/change-pin` — Change PIN (requires old and new PIN)

### ATMs

- `GET /api/v1/atms` — List all ATMs
- `GET /api/v1/atms/:id` — Get ATM by ID
- `POST /api/v1/atms` — Create ATM
- `POST /api/v1/atms/withdraw` — Withdraw cash (requires card, PIN, ATM, amount)
- `POST /api/v1/atms/deposit` — Deposit cash (requires card, PIN, ATM, amount)

### Transactions

- `GET /api/v1/transactions` — List all transactions
- `GET /api/v1/transactions/:id` — Get transaction by ID
- `GET /api/v1/transactions/account/:accountId` — List all transactions for an account (movements)
- `POST /api/v1/transactions/transfer` — Make a transfer (requires card, PIN, source account, destination IBAN, amount)

### Banks

- `GET /api/v1/banks` — List all banks
- `GET /api/v1/banks/:id` — Get bank by ID
- `POST /api/v1/banks` — Create bank
- `PATCH /api/v1/banks/:id` — Update bank
- `DELETE /api/v1/banks/:id` — Delete bank

## Running with Docker

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
POSTGRES_USER=youruser
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=yourdb
POSTGRES_PORT=5432
```

### Start the Application

```
docker-compose up --build
```

- This will start both the PostgreSQL database and the app.
- Database migrations are automatically applied at startup.
- The API will be available at `http://localhost:3000/api/v1/`
- Swagger docs: `http://localhost:3000/api/v1/docs`

## Testing

- **Unit tests:** Located in `src/**/**/*.spec.ts` (services, controllers, etc.)
- Run all tests locally:
  ```
  pnpm install
  pnpm test
  ```

## Security Considerations

- PINs are hashed with bcrypt before storage.
- No sensitive data (like PINs) is ever returned by the API.
- Card operations require activation and PIN validation.

## CI/CD

- The project is ready for integration with CI/CD tools (GitHub Actions, GitLab CI, Jenkins, etc.).
- Recommended: run tests and build the Docker image on every push.

## Technologies Used

- **NestJS** (Node.js framework)
- **Prisma ORM** (database access)
- **PostgreSQL** (database)
- **Docker** (containerization)
- **Jest** (testing)

## Project Structure

```
src/
  account/        # Account logic and endpoints
  atm/            # ATM logic and endpoints
  bank/           # Bank logic and endpoints
  card/           # Card logic and endpoints
  transaction/    # Transaction logic and endpoints
  prisma/         # Prisma schema and migrations
```
