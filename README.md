# Digital Bahir Dar 🇪🇹

**Explore Bahir Dar. Know Where to Go. Know What It Costs.**

Smart City • Tourism • Navigation • AI Travel • Local Services Platform for Bahir Dar, Ethiopia.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **State**: TanStack Query + Zustand
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Storage + Edge Functions)
- **Maps**: Google Maps Platform (Phase 2)
- **Deploy**: Vercel

## Phase 1 — Foundation (current)

- Project scaffold & design system
- Routing & layout (desktop + mobile nav)
- Home page with quick actions
- Map page skeleton + GPS permission
- Auth (login / register) wired to Supabase Auth
- Database migration (profiles, categories, places, PostGIS, RLS)
- Seed categories
- CI workflow
- i18n architecture (EN / AM)

## Quick start

```bash
git clone https://github.com/Menelik2/digital-bahir-dar.git
cd digital-bahir-dar
cp .env.example .env.local
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

### Supabase setup

1. Create a project at https://supabase.com
2. Run the migration in `supabase/migrations/20260821000000_init.sql`
3. Optionally run `supabase/seed.sql`
4. Copy project URL + anon key into `.env.local`

## Implementation roadmap

1. **Phase 1** — Foundation ✅
2. **Phase 2** — Digital Map
3. **Phase 3** — City Services
4. **Phase 4** — Social
5. **Phase 5** — Trip System + Budget
6. **Phase 6** — AI Guide
7. **Phase 7** — Business Portal
8. **Phase 8** — Admin
9. **Phase 9** — PWA & Offline
10. **Phase 10** — Production
