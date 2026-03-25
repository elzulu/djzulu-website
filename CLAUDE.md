# CLAUDE.md — DJ Zulu Website

This file is the persistent development guide for the DJ Zulu Website project. Read it at the start of every session.

---

## Project Overview

A full-stack **Next.js 14 web application** for a DJ service. It serves two audiences:
1. **Public visitors** — portfolio/landing page showcasing events, services, and pricing
2. **Admin (DJ owner)** — CMS panel to manage events, media, and site configuration

**Tech stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (DB + Auth + Storage) + Vercel

---

## Architecture

### Pattern
- **Monorepo** with a single Next.js app — no separate backend or frontend projects
- **Server & Client Components** — server components fetch data from Supabase, client components handle interactivity
- **ISR** — public home page revalidates every 60 seconds

### Key Entry Points
| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Public home page (SSR + ISR) |
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard |
| `/admin/login` | `src/app/admin/login/page.tsx` | Login form |
| `/admin/eventos` | `src/app/admin/eventos/page.tsx` | Events CRUD list |
| `/admin/eventos/nuevo` | `src/app/admin/eventos/nuevo/page.tsx` | Create event |
| `/admin/eventos/[id]` | `src/app/admin/eventos/[id]/page.tsx` | Edit event |
| `/admin/galeria` | `src/app/admin/galeria/page.tsx` | Media upload management |
| `/admin/config` | `src/app/admin/config/page.tsx` | Site settings editor |

### Folder Structure
```
src/
├── app/
│   ├── page.tsx             # Home page (server component, calls getData())
│   ├── layout.tsx           # Root layout with metadata + Toaster
│   ├── globals.css          # Global styles (font variables)
│   └── admin/               # Protected admin CMS routes
│       ├── page.tsx
│       ├── layout.tsx       # Auth guard, sidebar wrapper
│       ├── login/
│       ├── eventos/
│       ├── galeria/
│       └── config/
├── components/
│   ├── layout/              # Public-facing sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── ReelsGrid.tsx    # Client component, events modal
│   │   ├── Servicios.tsx
│   │   ├── Precios.tsx
│   │   └── Footer.tsx
│   └── admin/               # Admin panel components
│       ├── AdminSidebar.tsx
│       ├── EventoForm.tsx
│       ├── MediaUploader.tsx
│       ├── MediaGrid.tsx
│       ├── ConfigForm.tsx
│       ├── TogglePublicadoBtn.tsx
│       └── DeleteEventoBtn.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser-side Supabase client (createBrowserClient)
│   │   └── server.ts        # Server-side Supabase client (createServerClient + cookies)
│   └── utils.ts             # Formatting helpers, WhatsApp URL builder
├── types/
│   └── index.ts             # Interfaces: Evento, Media, Servicio, Precio, Config
└── middleware.ts             # Auth middleware — guards /admin/* routes
```

---

## Database (Supabase / PostgreSQL)

### Tables

#### `eventos`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| titulo | text NOT NULL | |
| descripcion | text | |
| lugar | text | |
| fecha | date NOT NULL | |
| tipo | enum | fiesta, corporativo, boda, quinceañera, festival, club, otro |
| portada_url | text | Cover image URL from Supabase Storage |
| publicado | boolean | Visibility flag for public site |
| created_at / updated_at | timestamptz | |

#### `media`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| evento_id | uuid FK → eventos.id | CASCADE DELETE |
| tipo | enum | video, imagen |
| url | text NOT NULL | Public Supabase Storage URL |
| nombre_original | text | |
| duracion_seg | int | For videos |
| orden | int | Display order |

#### `servicios`
Fields: id, nombre, descripcion, icono, orden, activo

#### `precios`
Fields: id, nombre, precio, periodo, destacado, features (jsonb), orden, activo

#### `config` (key-value store)
Primary key is `clave` (string key). Known keys:
- `nombre_artistico`, `tagline`, `descripcion`, `ciudad`
- `whatsapp`, `youtube_url`, `tiktok_url`
- `eventos_count`, `anos_experiencia`, `logo_url`

### Storage Buckets (public)
- `media` — event photos/videos. Path: `{evento_id}/{timestamp}-{index}.{ext}`
- `logos` — site logo. Path: `logo-{timestamp}.{ext}`

### RLS Policies
- Public SELECT on all tables (eventos filtered by `publicado=true`)
- Authenticated users can INSERT/UPDATE/DELETE on all tables
- Public read on both storage buckets; authenticated upload/delete

---

## Authentication

- **Provider:** Supabase Auth (email + password)
- **Session:** Cookie-based via `@supabase/ssr`
- **Middleware** (`src/middleware.ts`): Intercepts `/admin/*`, redirects to `/admin/login` if unauthenticated
- **Client login:** `supabase.auth.signInWithPassword()` in `src/app/admin/login/page.tsx`
- **No RBAC:** Any authenticated user = admin

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
ADMIN_EMAIL=admin@example.com
```

---

## Styling & Theme

- **Tailwind CSS** with custom extensions in `tailwind.config.ts`
- **Colors:**
  - `blue.electric`: `#00b4ff`
  - `purple.neon`: `#b44fff`
  - `dark.DEFAULT`: `#07071a` (page background)
  - `dark.card`: `#0d0d2b`
  - `dark.border`: `rgba(0,180,255,0.15)`
- **Fonts:** Bebas Neue (`bebas`) for headings, Rajdhani (`rajdhani`) for body
- **Custom animations:** `eq1`/`eq2` (equalizer bars), `scan`, `pulse-border`

---

## Deployment

- **Platform:** Vercel (serverless Next.js)
- **CI/CD:** GitHub → Vercel, auto-deploys on push to main
- **Config:** `vercel.json` at project root
- **Build command:** `npm run build`

---

## Development Conventions

- TypeScript path alias: `@/*` → `./src/*`
- Server components fetch data directly from Supabase (no REST layer)
- Client components marked with `'use client'` directive
- Toast notifications via `react-hot-toast` for all admin actions
- File uploads use Supabase Storage SDK directly (no server action layer)
- `src/lib/utils.ts` for shared helpers (don't duplicate logic)
- `src/types/index.ts` is the single source of truth for TypeScript types

---

## Key Dependencies
```
next: 14.2.5
react: ^18
@supabase/supabase-js: ^2.44.4
@supabase/ssr: ^0.4.0
framer-motion: ^11.3.8
react-player: ^2.16.0
react-hot-toast: ^2.4.1
lucide-react: ^0.400.0
tailwindcss: ^3.4.1
```

---

## Local Setup
```bash
npm install
npm run dev   # http://localhost:3000
```

Database schema is in `supabase-migration.sql` — run in Supabase SQL editor to initialize.
