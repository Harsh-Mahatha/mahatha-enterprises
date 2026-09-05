# Mahatha Enterprises

In-house invoicing, customer ledger, sales, and stock management application.

See [`Mahatha_Enterprises_V1_Claude_Code_Prompt.md`](../Mahatha_Enterprises_V1_Claude_Code_Prompt.md) for the full V1 product scope and build plan.

## Features (V1)

- **Authentication** — login, logout, change password (server-side sessions, not JWT)
- **Company settings** — business details used on invoices
- **Customers** — CRUD, deactivation, opening balances
- **Customer ledger** — opening balance, invoice, and payment entries with a running balance
- **Payments** — record full/partial payments, payment history
- **Products & inventory** — product CRUD, stock entry, stock adjustment, stock movement history, low-stock indicator
- **Sales invoices** — line items, multiple discount lines, partial/full payment at time of sale, atomic stock + ledger updates, printable invoice
- **Dashboard** — today's sales, outstanding, customer count, low stock, today's invoices, recent invoices
- **Reports** — sales (date/customer filterable), outstanding, stock, stock movements

## Tech stack

- **Frontend** — Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend** — Node.js, Express, TypeScript
- **Database** — PostgreSQL
- **ORM** — Prisma

## Repository structure

```text
mahatha-enterprises/
├── apps/
│   ├── web/          Next.js frontend
│   └── api/           Express backend
├── packages/
│   ├── types/          Shared TypeScript types
│   ├── validation/     Shared Zod validation schemas
│   ├── config/         Shared runtime constants (e.g. session cookie name)
│   └── calculations/   Canonical invoice/stock calculations (used by UI + API)
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── prisma.config.ts     Prisma 7 config (schema path, migrations, datasource)
└── package.json         Workspace root
```

This is an npm workspaces monorepo. Run workspace-scoped scripts with `npm run <script> -w <workspace>` (e.g. `npm run dev -w apps/api`).

## Environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Used by | Description |
| --- | --- | --- |
| `DATABASE_URL` | apps/api, prisma | PostgreSQL connection string |
| `PORT` | apps/api | Port the Express server listens on (default `4000`) |
| `NODE_ENV` | apps/api | `development` / `production` |
| `WEB_ORIGIN` | apps/api | Frontend origin allowed by CORS |
| `NEXT_PUBLIC_API_URL` | apps/web | Base URL the frontend uses to call the API |

Never commit a real `.env` file.

## Database setup

1. Make sure PostgreSQL is running and `DATABASE_URL` in `.env` points to it.
2. Run migrations: `npm run db:migrate`
3. Seed development data: `npm run db:seed`

Prisma 7 reads connection/schema/migration config from `prisma.config.ts` at
the repo root rather than from `schema.prisma`. `apps/api` connects at
runtime through `@prisma/adapter-pg` (see `apps/api/src/config/prisma.ts`) —
a driver adapter is required in Prisma 7, there is no default connection
string handling in the generated client.

Seeding (`npm run db:seed`) resets and repopulates: a `Mahatha Enterprises`
`CompanySettings` row, three customers (ABC Traders, XYZ Distributors, Rahul
Kumar) with opening-balance ledger entries, and three products (Product A/B/C)
with initial stock movements — Product C is seeded at its minimum stock level
to exercise the low-stock case.

## Authentication

Sessions are opaque, random tokens stored server-side (`Session` table),
issued as an httpOnly `mahatha_session` cookie — not JWTs, so logout and
"invalidate other sessions on password change" are simple DB deletes rather
than needing a blocklist. `apps/web/src/proxy.ts` performs a cheap
cookie-presence check to redirect signed-out visitors to `/login`; the
Express `requireAuth` middleware is the actual authority on every API
request.

Seeded dev login: `admin@mahathaenterprises.example` / `password123` (see
`npm run db:seed` output).

## Prisma commands

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Create and apply a dev migration |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:seed` | Run the seed script |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Drop, recreate, migrate, and reseed the dev database |

## Development

```bash
npm install
npm run dev
```

`npm run dev` builds the shared packages once, then starts the Next.js frontend and the Express backend concurrently:

- Frontend — http://localhost:3000
- Backend — http://localhost:4000

## Build

```bash
npm run build
```

## Lint & typecheck

```bash
npm run lint
npm run typecheck
```
