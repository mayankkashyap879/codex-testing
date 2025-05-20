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

Run the development servers:

```bash
pnpm dev:client    # Next.js frontend
pnpm dev:server    # Express backend
```

See `AGENTS.md` for contributor guidelines.
