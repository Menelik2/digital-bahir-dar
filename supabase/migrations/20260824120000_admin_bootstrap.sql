-- Bootstrap staff role for primary admin email.
-- Safe to re-run: only updates when the profile row already exists
-- (created automatically on first sign-up via handle_new_user).

UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) = lower('bahirdar333@gmail.com')
  AND (role IS DISTINCT FROM 'admin');

-- Optional: if email was stored only on auth.users and profiles.email is null
UPDATE public.profiles p
SET
  email = COALESCE(p.email, u.email),
  role = 'admin'
FROM auth.users u
WHERE p.id = u.id
  AND lower(u.email) = lower('bahirdar333@gmail.com')
  AND (p.role IS DISTINCT FROM 'admin' OR p.email IS NULL);
