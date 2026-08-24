# Admin access — Digital Bahir Dar

There is **no default password** in the app. Admin is a Supabase Auth user whose `profiles.role` is `admin` or `moderator`.

## Primary admin email

| Field | Value |
|-------|--------|
| Email | `bahirdar333@gmail.com` |
| Password | Whatever you set in Supabase Auth (or when registering in the app). **Not stored in git.** |
| Role | `admin` (set by migration `20260824120000_admin_bootstrap.sql` once the profile exists) |

## First-time setup

1. **Create the Auth user** (pick one):
   - App: open `/auth` → Register with `bahirdar333@gmail.com` and a strong password, **or**
   - Supabase Dashboard → **Authentication → Users → Add user** (same email + password).

2. **Apply migrations** (includes admin bootstrap):
   - Supabase SQL Editor: run files under `supabase/migrations/` in order, **or**
   - `supabase db push` if you use the CLI.

3. **If the profile already existed before the migration**, run this once:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) = lower('bahirdar333@gmail.com');
```

4. Sign in at `/auth` with that email/password → open `/admin`.

## Promote another user

```sql
UPDATE public.profiles
SET role = 'admin'   -- or 'moderator'
WHERE lower(email) = lower('someone@example.com');
```

## Reset password

Supabase Dashboard → Authentication → Users → select user → **Send password recovery** or set a new password.

## Security

- Never commit real passwords or `service_role` keys.
- RLS still enforces staff-only writes; the UI only checks `profiles.role`.
