# Digital Bahir Dar — Launch checklist (Phase 10)

Use this before any public production deploy.

## 1. Supabase

- [ ] Create production project
- [ ] Run migrations in order:
  - `20260821000000_init.sql`
  - `20260822000000_city_services.sql`
  - `20260822010000_social.sql`
  - `20260822020000_trips.sql`
  - `20260822030000_business.sql`
  - `20260822040000_admin.sql`
  - remaining `20260822*.sql` files in filename order
- [ ] Optional dev seed: `supabase/seed.sql` (DEMO places only)
- [ ] Enable Email auth (and providers you need)
- [ ] Confirm RLS is enabled on all public tables
- [ ] Promote first admin:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
  ```

## 2. Secrets

### Frontend (Vercel / `.env.local`)

| Variable | Required |
|----------|----------|
| `VITE_SUPABASE_URL` | Yes (for auth, favorites, reviews, trips) |
| `VITE_SUPABASE_ANON_KEY` | Yes |

**Map:** uses free **Leaflet + OpenStreetMap** — no Google Maps API key.

When Supabase has no published places, the app loads **live OpenStreetMap** POIs for Bahir Dar, then falls back to client DEMO markers.

### Edge Functions only (never in frontend)

| Secret | Purpose |
|--------|---------|
| `AI_API_KEY` | Live AI Guide |
| `AI_MODEL` | Optional model id |

```bash
supabase functions deploy ai-guide
supabase secrets set AI_API_KEY=...
```

## 3. Deploy

```bash
npm ci
python3 scripts/generate-pwa-icons.py
npm run typecheck
npm run build
```

- [ ] Connect GitHub repo to Vercel
- [ ] Set env vars in Vercel project settings
- [ ] Default branch `main`
- [ ] Custom domain + HTTPS

## 4. Smoke tests (production)

- [ ] Home loads
- [ ] Map loads (OSM tiles); GPS permission prompt works
- [ ] Explore / Hotels / Restaurants list (DB, OSM, or DEMO)
- [ ] Place details + Save (auth + DB place) + Review form
- [ ] Auth register / login / logout
- [ ] Trips create + Budget calculator
- [ ] AI Guide replies (DEMO or live)
- [ ] Business portal register (pending)
- [ ] Admin dashboard after role promotion
- [ ] PWA install on mobile Chrome
- [ ] Offline banner when network disabled

## 5. Content policy

- [ ] No DEMO-labeled places presented as verified businesses
- [ ] OSM places are community data (ODbL) — not verified commercial listings
- [ ] Prices shown as estimates where applicable
- [ ] Business claims require human approval

## 6. Post-launch

- [ ] Monitor Supabase auth + DB size
- [ ] Rotate keys if leaked
- [ ] Backup strategy for PostgreSQL
