# Migration Report: Vite + React SPA → Next.js 16.2.3

## 1. Upgraded Packages & Versions

### Marketplace (`artifacts/marketplace`)

| Package | Before | After | Notes |
|---------|--------|-------|-------|
| **next** | — (not used) | `16.2.3` | New framework |
| **@tailwindcss/postcss** | — | `^4.1.14` | Replaces `@tailwindcss/vite` for Next.js |
| **vite** | `^7.3.0` (catalog) | Removed | Replaced by Next.js + Turbopack |
| **@vitejs/plugin-react** | `^5.0.4` (catalog) | Removed | |
| **@tailwindcss/vite** | `^4.1.14` (catalog) | Removed from marketplace | Kept for mockup-sandbox |
| **wouter** | `^3.3.5` | Removed | Replaced by `next/link` + `next/navigation` |
| **@replit/vite-plugin-cartographer** | `^0.5.1` | Removed | Replit cleanup |
| **@replit/vite-plugin-dev-banner** | `^0.1.1` | Removed | Replit cleanup |
| **@replit/vite-plugin-runtime-error-modal** | `^0.0.6` | Removed | Replit cleanup |

### Kept As-Is (no version changes needed)

- `react` / `react-dom`: `19.1.0`
- `framer-motion`: `12.35.1`
- `@tanstack/react-query`: `^5.90.21`
- `tailwindcss`: `^4.1.14`
- `drizzle-orm`: `^0.45.1`
- All Radix UI / shadcn-ui components
- `lucide-react`: `^0.545.0`
- `typescript`: `~5.9.2`

---

## 2. Breaking Changes & How They Were Handled

### Routing: wouter → Next.js App Router

- **`Link` component**: All imports changed from `import { Link } from 'wouter'` to `import Link from 'next/link'`. The API is compatible — both use `href` prop.
- **`useLocation`**: Replaced with `usePathname()` from `next/navigation` for reading the current path, and `useRouter().push()` for programmatic navigation.
- **`useParams`**: Replaced with `useParams()` from `next/navigation` (same function name, different import).
- **Route definitions**: Moved from explicit `<Route path="/browse">` in `App.tsx` to file-system routes in `src/app/`.

### Build System: Vite → Next.js + Turbopack

- `vite.config.ts` → `next.config.ts`
- `@tailwindcss/vite` → `@tailwindcss/postcss` with `postcss.config.mjs`
- `index.html` entry point removed (Next.js generates HTML automatically)
- `main.tsx` + `App.tsx` removed, replaced by `app/layout.tsx` + `app/providers.tsx`

### SSR Considerations

- All page and interactive components marked with `"use client"` directive (the app is heavily interactive with framer-motion animations, useState, etc.)
- `document` access in `Navbar.tsx` guarded with `typeof document !== 'undefined'` check for SSR compatibility
- Next.js successfully prerenders all pages as static content at build time

### File Structure

| Before (SPA) | After (Next.js App Router) |
|---------------|---------------------------|
| `src/pages/home.tsx` | `src/app/(main)/page.tsx` |
| `src/pages/browse.tsx` | `src/app/(main)/browse/page.tsx` |
| `src/pages/item-detail.tsx` | `src/app/(main)/item/[id]/page.tsx` |
| `src/pages/login.tsx` | `src/app/(main)/login/page.tsx` |
| `src/pages/register.tsx` | `src/app/(main)/register/page.tsx` |
| `src/pages/dashboard.tsx` | `src/app/(main)/dashboard/page.tsx` |
| `src/pages/post-item.tsx` | `src/app/(main)/post/page.tsx` |
| `src/pages/admin.tsx` | `src/app/admin/page.tsx` |
| `src/pages/not-found.tsx` | `src/app/not-found.tsx` |

- **Route group `(main)`**: Pages that share the Navbar + Footer layout
- **`admin`**: Standalone page without Navbar/Footer (dark theme admin panel)
- **`not-found.tsx`**: Next.js global 404 handler

### Layout Architecture

```
app/layout.tsx          ← Root layout (server component): metadata, fonts, <Providers>
app/providers.tsx       ← Client wrapper: QueryClient, TooltipProvider, Toaster, CursorEffect, ScrollProgress
app/(main)/layout.tsx   ← Navbar + Footer wrapper for public pages
app/admin/page.tsx      ← Standalone admin (no shared layout)
app/not-found.tsx       ← Global 404 page
```

---

## 3. Steps to Run the Updated Project Locally

### Prerequisites

- Node.js 18.17+ (recommended: 20+)
- pnpm 10+

### Install & Run

```bash
# Clone and install
pnpm install

# Run the marketplace (Next.js dev server with Turbopack)
cd artifacts/marketplace
pnpm dev

# Or from root:
pnpm --filter @workspace/marketplace dev
```

The dev server starts at `http://localhost:3000` by default.

### Build for Production

```bash
cd artifacts/marketplace
pnpm build    # Creates optimized production build
pnpm start    # Serves the production build
```

### API Server (unchanged)

```bash
cd artifacts/api-server
pnpm dev
```

### Notes for Windows Users

The root `package.json` has a `preinstall` script that uses `sh`. On Windows, use `pnpm install --ignore-scripts` if `sh` is not available, or install Git Bash / WSL.

---

## 4. Replit Cleanup Summary

### Files Deleted

- `.replit` — Replit run configuration
- `.replitignore` — Replit ignore rules
- `replit.md` — Replit project documentation

### Dependencies Removed

- `@replit/vite-plugin-cartographer` — Replit code navigation plugin
- `@replit/vite-plugin-dev-banner` — Replit dev environment banner
- `@replit/vite-plugin-runtime-error-modal` — Replit error overlay

### Configuration Cleaned

- **`pnpm-workspace.yaml`**: Removed `@replit/*` catalog entries, `stripe-replit-sync` from exclusions, and all Replit-specific platform binary suppression overrides (lightningcss, rollup, esbuild, @expo/ngrok-bin, @tailwindcss/oxide platform-specific packages)
- **`artifacts/mockup-sandbox/vite.config.ts`**: Removed `@replit/vite-plugin-runtime-error-modal` import/usage and `REPL_ID`-conditional cartographer plugin
- **`artifacts/mockup-sandbox/package.json`**: Removed `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal` dependencies
- **`.gitignore`**: Replaced `# Replit` section (`.cache/`, `.local/`) with `# Next.js` section (`.next/`)

---

## 5. Remaining Notes & Improvements

- **All pages are client components**: Due to heavy use of `useState`, `framer-motion` animations, and interactive UI, all pages use `"use client"`. Future optimization could extract static parts into server components.
- **Image optimization**: Next.js `<Image>` component is not yet used — pages still use `<img>` tags. Migrating to `next/image` would improve performance with automatic lazy loading, responsive sizing, and WebP conversion.
- **API integration**: The `lib/api-client-react` package still works as-is with TanStack React Query. No changes were needed.
- **Mockup sandbox**: Still uses Vite (intentionally) — it's a separate dev tool, not part of the main app.
- **Database / API server**: `artifacts/api-server` and `lib/db` are unchanged — Express 5 + Drizzle ORM stack is independent of the frontend framework.
