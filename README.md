# Monorepo App

This repository contains a simple full stack monorepo using pnpm workspaces.

## Stack

- **Next.js** with **TypeScript** and **Tailwind CSS** for the frontend.
- **Express** with **TypeScript** for the backend.
- **PostgreSQL** via **Prisma** as the database layer.

## Getting Started

Install dependencies:

```bash
pnpm install
```

This command runs the repository `postinstall` script which invokes
`prisma generate` for the server package.

Configure environment variables by copying
`packages/server/.env.example` to `packages/server/.env` and adjust
the values for your local database connection.

The server's `dev` and `seed` scripts automatically load this `.env` file
using `dotenv`, so you don't need to configure it manually.

Run the development servers:

```bash
pnpm dev:client    # Next.js frontend
pnpm dev:server    # Express backend
```

## Biomarker Tracking

Seed the database with initial biomarkers:

```bash
pnpm --filter server run seed
```

Start the app and visit the client at `http://localhost:3000` to upload lab reports.
After uploading a report you will be given a link to view the parsed biomarker values.

See `AGENTS.md` for contributor guidelines.
