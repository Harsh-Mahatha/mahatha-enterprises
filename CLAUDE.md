# Mahatha Enterprises — Monorepo

Business management app (invoicing, customer ledger, sales, stock). See `Mahatha_Enterprises_V1_Claude_Code_Prompt.md` (repo root, one level up) for the full V1 build plan, phases, and engineering principles — read it before making architectural decisions.

## Layout

- `apps/web` — Next.js frontend (App Router, Tailwind CSS). Has its own `CLAUDE.md`/`AGENTS.md` for Next.js-specific conventions.
- `apps/api` — Express + TypeScript backend. Layering: route → middleware → controller → service → repository/Prisma.
- `packages/types` — shared TypeScript domain/API types, built with `tsc` (consumed as compiled JS + `.d.ts`, not raw TS).
- `packages/validation` — shared Zod schemas, same build model as `packages/types`.
- `packages/config` — shared runtime constants used by both apps (e.g. the session cookie name).
- `packages/calculations` — the canonical invoice calculation (`calculateInvoice`, `getInvoiceOutstanding`) and stock-status rule (`isLowStock`); both `apps/web` and `apps/api` import from here rather than reimplementing.
- `prisma/` — single Prisma schema and migrations for the whole app (used by `apps/api`).

## Conventions

- npm workspaces (not pnpm/yarn). Run workspace scripts as `npm run <script> -w <workspace>`.
- `npm run dev` at the repo root starts both apps concurrently (do not start them separately).
- Business logic belongs in `apps/api/src/services`, not controllers or the frontend.
- One canonical invoice calculation module — never reimplement totals in the UI, print view, or reports.
- Prefer deactivation (`active = false`) over hard deletes for customers/products.
