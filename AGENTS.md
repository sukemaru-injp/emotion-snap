# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/`: `app/` (Next.js App Router), `common/` (shared UI, utils, types), `libs/` (Supabase, S3, Rekognition), and `styles/`.
- Generated DB types in `modules/database.types.ts` (via Supabase CLI).
- Static assets go in `public/`.
- Tests colocate with code under `__tests__/` (e.g., `src/app/.../__tests__/Presenter.test.tsx`).

## Build, Test, and Development Commands
- `pnpm dev` — Run the dev server on `http://localhost:3100`.
- `pnpm build` — Production build of the Next.js app.
- `pnpm start` — Start the built app.
- `pnpm test` — Run Vitest (jsdom, RTL).
- `pnpm lint` / `pnpm format` / `pnpm check` — Biome lint/format/check with import organize.
- `pnpm gen:db-types` — Generate Supabase types. Requires `supabase` CLI and `SUPABASE_PROJECT_ID` in `.env.local`.

## Coding Style & Naming Conventions
- TypeScript-first. Components as `.tsx` (PascalCase, e.g., `LoginView.tsx`).
- Hooks/utility files use camelCase (e.g., `useCamera.ts`, `generateRandomId.ts`).
- Use CSS Modules for scoped styles when needed (e.g., `*.module.css`).
- Biome enforces tabs for indentation, single quotes, semicolons, 80-char line width, no unused imports/vars.

## Testing Guidelines
- Framework: Vitest + React Testing Library (`jsdom`, globals enabled).
- Test files: `src/**/*.{test,spec}.{js,ts,jsx,tsx}`. Prefer colocated `__tests__/` dirs.
- Write interaction-focused tests; verify user-visible behavior.
- Run locally: `pnpm test` or `pnpm test --watch`.

## Commit & Pull Request Guidelines
- Use clear, imperative commits (e.g., "feat: add ranking modal"). Reference issues when applicable.
- Before PR: run `pnpm lint && pnpm test && pnpm build`.
- PRs to `main` should include: purpose/summary, screenshots or clips for UI changes, and any config notes.
- CI mirrors Node 22 + pnpm 10.12.3 and runs lint/tests/build.

## Security & Configuration Tips
- Keep secrets in `.env.local`. Never commit secrets.
- Do not expose secrets in client components; use server actions/route handlers.
- When changing DB schema, regenerate types via `pnpm gen:db-types`.

## Environment
- Node 22.x, pnpm 10.12.x. Install deps with `pnpm install`.

