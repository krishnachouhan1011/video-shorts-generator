# Video Shorts Generator

An AI-assisted workspace that turns long-form videos into timestamped transcripts and ranked YouTube Shorts moments.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/video-shorts-generator/src/` — React dashboard, shared shell, and workflow pages
- `artifacts/api-server/src/routes/video.ts` — demo-backed project, transcript, Shorts, save, and export APIs
- `lib/api-spec/openapi.yaml` — source of truth for the typed API client and Zod schemas
- `lib/api-client-react/src/generated/` — generated React Query hooks and response types
- `artifacts/video-shorts-generator/src/index.css` — workspace theme tokens and global styling

## Architecture decisions

- The first release uses seeded in-memory project data so the complete creator workflow can be previewed without blocking on external media storage or AI credentials.
- API contracts are defined in OpenAPI and generated into the shared client before frontend work.
- Video processing actions return explicit processing states, leaving room to connect FFmpeg and a speech-to-text provider without changing the UI contract.
- The dashboard uses one active project context across transcript and Shorts views to keep navigation fast and focused.

## Product

Creators can upload a recording, browse timestamped transcript segments, search and jump through the transcript, review AI-ranked Shorts opportunities, save moments, and start an export with resolution and subtitle options. The dashboard includes usage metrics, recent activity, and project status.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Vite build requires `PORT` and `BASE_PATH` from the managed workflow; use the artifact workflow for normal development.
- Run API codegen after every OpenAPI change so frontend hooks and server validators stay in sync.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
