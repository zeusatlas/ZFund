# ZFund

Frontend for ZFund, built with [Next.js](https://nextjs.org) (App Router), React, TypeScript and Tailwind CSS v4.

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer (`node -v` to check)
- npm (comes with Node)
- Git

## Getting started

```bash
# 1. Clone the repository
git clone <repository-url>
cd ZFund

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page links to the dashboard at [/dashboard](http://localhost:3000/dashboard).

## Scripts

| Command         | What it does                      |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Create a production build         |
| `npm run start` | Run the production build          |
| `npm run lint`  | Lint the code with ESLint         |

Run `npm run lint` and `npm run build` before opening a pull request.

## Project structure

```
app/
  layout.tsx          Root layout
  page.tsx            Home page (links to /dashboard)
  globals.css         Tailwind import and brand colors
  dashboard/
    layout.tsx        Dashboard shell: sidebar + header
    page.tsx          /dashboard (empty, build your pages here)
components/
  layout/
    Sidebar.tsx       Dark blue sidebar
    Header.tsx        Top header
    MobileNav.tsx     Hamburger + slide-in sidebar for small screens
    UserMenu.tsx      Avatar dropdown with log out (placeholder user)
```

New pages go in `app/` as folders containing a `page.tsx` (e.g. `app/dashboard/funds/page.tsx` becomes `/dashboard/funds`). Shared UI goes in `components/`. Import with the `@/` alias, e.g. `import Sidebar from "@/components/layout/Sidebar"`.

## Brand colors

Defined in [app/globals.css](app/globals.css) and available as Tailwind utilities (`bg-navy`, `text-gold`, `border-steel`, etc.). Do not hardcode hex values; use these.

| Name       | Hex       | Typical use                  |
| ---------- | --------- | ---------------------------- |
| `navy`     | `#0b2545` | Primary buttons, headings    |
| `steel`    | `#2e4c6d` | Hover states, borders        |
| `gold`     | `#c08a2e` | Accents, highlights          |
| `crimson`  | `#a13d3d` | Errors, destructive actions  |
| `stone`    | `#f5f2ec` | Page background              |
| `stone-light` | `#faf8f5` | Dashboard main area       |
| `midnight` | `#10192b` | Sidebar                      |
| `ink`      | `#1c1f26` | Body text                    |

The app is light mode only. Do not add `dark:` styles.

## Included libraries

- `react-hook-form` + `zod` + `@hookform/resolvers`: forms and validation
- `axios`: API requests
- `lucide-react`: icons
- `sonner`: toast notifications
- `date-fns`: date formatting

## Note on Next.js version

This project uses a recent Next.js version with changes from older releases. When unsure, check the docs bundled in `node_modules/next/dist/docs/` rather than relying on older tutorials.

## Workflow

1. Create a branch from `main`: `git checkout -b feature/your-feature`
2. Make your changes and commit them with clear messages
3. Push and open a pull request for review
