<!-- Copilot instructions for contributors and AI coding agents. Keep concise and focused on project-specific patterns. -->
# HexfieldsDominion — Copilot / AI agent instructions

Purpose: give AI coding agents the minimal, actionable context to be productive in this repo.

- **Big picture:** This is a React + Vite front-end (TypeScript) for a browser game. Rendering of the hex board uses `react-konva` (canvas-like API). The app is single-page, routed with `react-router` and served with a `basename` for GitHub Pages.

- **Key files to read first:**
  - `src/index.tsx` — application entry, `BrowserRouter` with `basename = "/HexfieldsDominion/"`, and `ContextProviderTEST` wrapper.
  - `vite.config.ts` — `base: '/HexfieldsDominion/'` must match the router basename for correct asset routing.
  - `package.json` — dev/build scripts (`dev`, `build`, `preview`) and dependencies.
  - `src/components/game_field.tsx` — main canvas rendering with `react-konva` (zoom, pan, hex generation). Use this as the example for interactive canvas work.
  - `src/pages/play/play.tsx` — demonstrates usage of `import.meta.env.VITE_API_URL`, fetch patterns, and localStorage helpers in `src/constants/storage.ts`.

- **Run / build / dev notes (discovered):**
  - Dev server: README uses `bun`: `bun install` then `bun run dev`. `package.json` script `dev` runs `vite` so `npm run dev` / `pnpm dev` also work.
  - Build: `npm run build` runs `vite build && cp dist/index.html dist/404.html`. Note the `cp` is a Unix command — on Windows CI/use adjust accordingly (this is what the repo currently uses).
  - Preview: `npm run preview` runs `vite preview`.

- **Env / integration points:**
  - API base: `VITE_API_URL` — used in `src/pages/play/play.tsx`. Agents should look for `.env` or CI variables when running integration tasks.
  - Local storage keys: see `src/constants/storage.ts` (`STORAGE_KEYS.IS_LOGGED_IN`). Tests and features rely on these keys for lightweight auth state.

- **Routing / deployment constraint:**
  - Router `basename` (`src/index.tsx`) and Vite `base` (`vite.config.ts`) must be kept in sync — otherwise paths and assets on GitHub Pages will break.

- **Patterns & conventions specific to this project:**
  - Minimal global context: `ContextProviderTEST` is used, named `TestContext` — currently contains only `isLoggedIn` and is used by `ProtectedRoute` (see `src/components/protected_route.tsx`). Follow this pattern when adding app-wide state.
  - Canvas components use `react-konva` primitives (`Stage`, `Layer`, `RegularPolygon`) and manage scale/offset explicitly in component state (see `src/components/game_field.tsx` for pan/zoom math). Reuse this approach when building interactive boards.
  - API calls are plain `fetch` in pages (no centralized API client). Follow existing patterns (try/catch, check response codes, then call `.json()`).
  - Localized comments: some inline comments and text are German (e.g., `// Wenn nicht eingeloggt, zurück zur Home Page`). Agents should not modify translations unless asked.

- **Common pitfalls to avoid (based on repo contents):**
  - Don't change the `basename` or `vite.config.ts` without updating the other.
  - The `build` script uses `cp` — adjust for Windows if adding CI workflows that run on Windows runners.
  - `package.json` uses `vite` from an override (`rolldown-vite`) — prefer using project scripts instead of globally assuming latest `vite` behavior.

- **How to make small changes safely:**
  - Run the dev server (`bun run dev` or `npm run dev`) and open the browser to confirm UI changes quickly.
  - For canvas/konva changes, validate panning/zooming interactively — see `src/components/game_field.tsx` for the expected UX.

- **When adding tests or tooling:**
  - There are no tests in the repo. If adding tests, mirror the project’s script names (`type-check`, `lint`) and add scripts in `package.json`.

If anything in these notes is unclear or you'd like more detail about specific files (for example, `game_field.tsx` zoom math or routing logic), tell me which area and I will expand or add short code examples.
