# AGENTS.md

This repository is a Vite + React + TypeScript front end for the OFW Summit app.

## Quick commands
- Start the dev server: `npm run dev`
- Build for production: `npm run build`
- Lint the project: `npm run lint`
- Preview the production build: `npm run preview`

## Project structure
- App entry points: [src/main.tsx](src/main.tsx) and [src/App.tsx](src/App.tsx)
- Router setup and page wiring live in [src/App.tsx](src/App.tsx)
- Protected routes use [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx)
- API calls should go through [src/store/api.ts](src/store/api.ts) rather than raw `fetch`
- Global state is bootstrapped in [src/store/store.ts](src/store/store.ts)
- Pages are grouped under [src/pages](src/pages) and shared UI lives under [src/components](src/components)

## Architecture notes
- The app uses React Router with two route groups:
  - public pages under the shared `Users` layout
  - admin pages behind `ProtectedRoute` and `AdminLayout`
- Authentication is currently token-based through `localStorage` and the `token` key. Keep auth-related changes consistent with [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) and [src/pages/Login.jsx](src/pages/Login.jsx).
- The API base URL is configured in [src/store/api.ts](src/store/api.ts) as `http://localhost:8005`. Keep new requests relative to that base URL.
- The Redux store is intentionally minimal; add slices only when a feature clearly needs shared state.

## Coding conventions
- This codebase mixes JSX/JavaScript files and TypeScript files. Follow the style of the neighboring file instead of forcing a new pattern.
- Styling is a mix of Tailwind utility classes and existing global CSS under [src/styles](src/styles) and [src/App.css](src/App.css). Prefer the existing visual patterns over introducing a new styling system.
- The Vite alias `@` is configured in [vite.config.ts](vite.config.ts); use it for imports from [src](src) when it improves clarity.

## Validation expectations
- There is no dedicated test runner configured in this repo. Verify changes with `npm run build` and `npm run lint`.
- If you add or change routes, update [src/App.tsx](src/App.tsx) and confirm the route still uses the correct layout.
- If you change auth or API behavior, inspect [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx), [src/pages/Login.jsx](src/pages/Login.jsx), and [src/store/api.ts](src/store/api.ts) first.
