# Digital Bahir Dar 🇪🇹

**Explore Bahir Dar. Know Where to Go. Know What It Costs.**

Production-oriented smart city platform for **Bahir Dar, Ethiopia**: tourism, navigation, AI guide, trips, budgets, business listings, and admin moderation.

**Repo:** https://github.com/Menelik2/digital-bahir-dar  
**Version:** 1.0.0 (Phases 1–10)

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS v4 |
| UI | shadcn-style components, Lucide icons |
| Maps | Google Maps (`@vis.gl/react-google-maps`) |
| Data | TanStack Query, Zustand |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) |
| PWA | Custom service worker + web manifest |
| Deploy | Vercel (`vercel.json` SPA rewrites) |

---

## Phases (complete)

| Phase | Scope |
|-------|--------|
| 1 | Foundation, auth, schema, CI |
| 2 | Digital map, GPS, filters, directions |
| 3 | Hotels, restaurants, attractions, banks, place details |
| 4 | Favorites, reviews, reports, profile |
| 5 | Trips, itinerary, expenses, budget planner |
| 6 | AI Guide (Edge Function + DEMO knowledge) |
| 7 | Business portal (register, claim, listings) |
| 8 | Admin dashboard (moderation + metrics) |
| 9 | PWA, offline shell, install prompt, a11y |
| 10 | Launch docs, seed, CI, production checklist |

See **[LAUNCH.md](./LAUNCH.md)** for the production go-live checklist.

---

## Quick start

```bash
git clone https://github.com/Menelik2/digital-bahir-dar.git
cd digital-bahir-dar
cp .env.example .env.local
# Edit VITE_SUPABASE_* and VITE_GOOGLE_MAPS_API_KEY

python3 scripts/generate-pwa-icons.py
npm install
npm run dev
```

Open http://localhost:5173

### Supabase

1. Create a project  
2. Apply SQL files under `supabase/migrations/` in filename order  
3. Optional: run `supabase/seed.sql` for DEMO places  
4. Copy project URL + anon key into `.env.local`

### Production build

```bash
npm run typecheck
npm run build
npm run preview
```

Service worker registers in production builds. In dev, append `?sw=1` to test.

---

## Main routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/map` | Interactive map |
| `/explore` | All places |
| `/hotels` `/restaurants` `/attractions` `/banks` `/transport` | Category lists |
| `/places/:slug` | Place details, reviews, save |
| `/trips` `/trips/:id` | Trip planner |
| `/budget` | Budget calculator |
| `/ai-guide` | AI travel guide |
| `/business` | Business portal |
| `/admin` | Staff moderation |
| `/profile` `/auth` | Account |

---

## Security notes

- **Never** put `service_role` or `AI_API_KEY` in `VITE_*` variables  
- RLS enforces user/staff boundaries; admin UI is gated by `profiles.role`  
- DEMO data is labeled; do not treat it as verified commercial information  

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Vite server |
| `npm run build` | Production bundle |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | oxlint |
| `npm run smoke` | Post-setup file checks |
| `npm run icons` | Generate PWA PNG icons |

---

## License / contribution

Private project for Digital Bahir Dar. Coordinate schema and content changes with maintainers before production seed updates.
