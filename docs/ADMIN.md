# Admin / CMS — Digital Bahir Dar

The **Admin** area is the app’s **CMS** (content management system): a visual screen to organize **text, images, places, and events** without writing code.

## Who can access

- Roles: `admin` or `moderator` on `profiles.role`
- URL: `/admin`

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## CMS content types

| Tab | What you manage |
|-----|------------------|
| **Overview** | Queue of pending places, claims, businesses, reports |
| **Places** | Create/edit listings, status, featured, cover image URL, bulk publish |
| **Events** | City events (title, venue, description, publish/draft) |
| **Categories** | Place categories |
| **Transport** | Verify transport services |
| **Reviews / Claims / Business / Reports / Users** | Moderation |

## How it works (no code)

1. Sign in with a staff account → open **Admin**.
2. **Places → New place** or **Edit** → fill the form (name, text, map coords, **Cover image URL**).
3. Set **Status = published** so visitors see it on Map / Explore.
4. **Events → New event** → fill title, date, venue, description → **Publish**.
5. Changes go to Supabase Postgres; the public site reads published rows.

## Images

- Use a public **image URL** (e.g. Supabase Storage, CDN, or hosted photo).
- Admin sets it as the place **primary cover** in `place_images`.
- Optional later: upload UI into Supabase Storage bucket.

## Migrations required

Run all migrations under `supabase/migrations/`, especially:

- `*_admin*.sql`
- `20260825130000_backend_events_search.sql` (`city_events` + search RPCs)

## Not a page builder

This CMS manages **city data** (places, events, moderation). It does not rebuild the React page layout; routes stay in the app code.
