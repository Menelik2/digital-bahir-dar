# Digital Bahir Dar 🇪🇹

**Explore Bahir Dar. Know Where to Go. Know What It Costs.**

Smart City • Tourism • Navigation • AI Travel • Local Services Platform for Bahir Dar, Ethiopia.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Maps**: Google Maps (`@vis.gl/react-google-maps`)
- **State**: TanStack Query + Zustand
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Storage + Edge Functions)
- **Deploy**: Vercel

## Current status

### Phase 1 — Foundation ✅
Scaffold, design system, routing, auth, layout, Home, Supabase schema + RLS, CI

### Phase 2 — Digital Map ✅
- Interactive Google Map (Bahir Dar center)
- GPS / “You are here” marker
- Place markers (from Supabase or DEMO fallback)
- Search
- Category & smart filters (Near Me, Verified, Hotels, Food, …)
- Place bottom sheet (distance, walk/drive ETA)
- Directions panel → open in Google Maps
- Location button

## Quick start

```bash
git clone https://github.com/Menelik2/digital-bahir-dar.git
cd digital-bahir-dar
git checkout main
cp .env.example .env.local
```

Fill in `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_GOOGLE_MAPS_API_KEY=...   # Maps JavaScript API enabled
```

```bash
npm install
npm run dev
```

### Google Maps setup
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API**
3. Create an API key, restrict by HTTP referrer in production
4. Put the key in `VITE_GOOGLE_MAPS_API_KEY`

### Supabase setup
1. Create a project at https://supabase.com
2. Run `supabase/migrations/20260821000000_init.sql`
3. Optionally run `supabase/seed.sql` (categories)
4. Copy URL + anon key into `.env.local`

> Until real places exist in the database, the map shows **DEMO** markers (clearly labeled) so the UI is usable during development. Never treat DEMO data as verified production information.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | Lint |

## Roadmap

1. Phase 1 — Foundation ✅  
2. Phase 2 — Digital Map ✅  
3. Phase 3 — City Services (hotels, restaurants, attractions, banks…)  
4. Phase 4 — Social (favorites, reviews)  
5. Phase 5 — Trip System + Budget  
6. Phase 6 — AI Guide  
7. Phase 7 — Business Portal  
8. Phase 8 — Admin  
9. Phase 9 — PWA & Offline  
10. Phase 10 — Production hardening  

## Security

- Never commit `.env` or service-role keys  
- Frontend is untrusted; RLS enforces access  
- DEMO data is client-side only and labeled  

## License

Private / All rights reserved for now.
