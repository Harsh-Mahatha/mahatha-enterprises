# Mahatha Enterprises

In-house invoicing, customer ledger, sales, and stock management application.

See [`Mahatha_Enterprises_V1_Claude_Code_Prompt.md`](../Mahatha_Enterprises_V1_Claude_Code_Prompt.md) for the full V1 product scope and build plan.

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
│   └── validation/     Shared Zod validation schemas
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
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
| `AUTH_SECRET` | apps/api | Secret used for session/token signing |
| `WEB_ORIGIN` | apps/api | Frontend origin allowed by CORS |
| `NEXT_PUBLIC_API_URL` | apps/web | Base URL the frontend uses to call the API |

Never commit a real `.env` file.

## Database setup

1. Make sure PostgreSQL is running and `DATABASE_URL` in `.env` points to it.
2. Run migrations: `npm run db:migrate`
3. Seed development data: `npm run db:seed`

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
