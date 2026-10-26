# agentic-design-workflow
POC for Agentic Design Workflow Option 1

**Phase 1:** a small "Clients" manager (dashboard + CRUD) built on a strict design-system boundary, used as the target app for the design workflow.

## Stack

- Next.js 16 (App Router, TypeScript, `src/`, `@/*` alias, Cache Components on)
- Tailwind CSS v4 + shadcn/ui (`base-nova` style on Base UI, neutral base colour)
- Recharts (via shadcn `chart`), next-themes, sonner
- npm

## Getting started

Requires Node.js 20.9+ (developed on Node 24).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server                           |
| `npm run build`     | Production build                               |
| `npm run start`     | Serve the production build                     |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript)  |
| `npm run typecheck` | Generate route types, then `tsc --noEmit`      |

## Routes

| Route                 | Page                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| `/`                   | Dashboard: 4 stat cards, new clients per month chart, recent clients          |
| `/clients`            | Client table with search and status filter, edit and delete (with confirm)    |
| `/clients/new`        | Create client                                                                 |
| `/clients/[id]/edit`  | Edit or delete a client                                                       |

## Data

There's no database. On first visit the browser is seeded with 25 clients from
`src/data/clients.seed.ts`, and every change is saved to `localStorage`, so CRUD
works on Vercel previews. Each browser has its own copy. To reset, clear site
data or run `localStorage.removeItem("clients-manager:clients:v1")` in the
console.

All data access goes through `src/lib/clients-store.ts`. To move to a real
database, re-implement that module and keep its exports.

## Design system rules

- **Tokens** live only in `src/app/globals.css`, as oklch values in `:root` (light) and `.dark`, mapped to Tailwind in `@theme inline`. This includes app-specific tokens: `--status-*` for client status and `--overlay` for modal backdrops.
- **Primitives:** shadcn/ui components go in `src/components/ui/`. Add more with `npx shadcn@latest add <name>`.
- **App components** go in `src/design-system/`, all exported from `src/design-system/index.ts`: `AppShell`, `PageHeader`, `StatCard`, `StatusBadge`, `ClientTable`, `ClientForm`, `DeleteClientDialog`, `NewClientsChart`, `ThemeProvider`, `ThemeToggle`.
- **Pages** (`src/app/**`) import UI only from `@/design-system` and `@/components/ui`. Data and helpers come from `@/lib/*`.
- **No hardcoded values:** no colours, arbitrary spacing or radius in app code. Use tokens (`bg-primary`, `text-status-active-foreground`) and the Tailwind scale (`p-4`, `gap-6`, `rounded-lg`).

## Project structure

```
src/
├── app/                 # Routes + globals.css (tokens)
├── components/ui/       # shadcn/ui primitives
├── design-system/       # Shared app components + index.ts
├── data/                # Seed data
├── hooks/               # use-mobile (used by the sidebar)
└── lib/                 # clients-store (data access), clients (types/stats), format, utils
```
