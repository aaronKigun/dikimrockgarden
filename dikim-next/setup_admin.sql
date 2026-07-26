-- ============================================================
-- DIKIM ROCK GARDEN — Admin user + booking column fix
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1) Ensure bookings can store arrival date (safe if already added)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS arrival_date DATE;

-- 2) Create an admin login (Supabase Auth)
--    Change the email and password below before running.
--    After this, sign in at: https://dikim-rock-garden.com.ng/admin/login

DO $$
DECLARE
  v_email    text := 'dikimrockgarden@gmail.com';  -- change if needed
  v_password text := 'ChangeMe_StrongPassword1!';  -- CHANGE THIS
  v_user_id  uuid;
BEGIN
  -- Skip if this email already exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = lower(v_email)
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE 'Admin user already exists: % (id=%)', v_email, v_user_id;
    RETURN;
  END IF;

  v_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    lower(v_email),
    crypt(v_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"admin"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', lower(v_email)),
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Admin created. Email: %  — use the password you set in this script.', v_email;
END $$;
