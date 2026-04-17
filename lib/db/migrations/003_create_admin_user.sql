-- ============================================================
-- Create admin user for admin@marketplace.com
-- Run this in Supabase SQL Editor AFTER creating the auth user
-- ============================================================
--
-- STEP 1: First, create the auth user in Supabase Dashboard:
--   Go to Authentication → Users → Add user
--   Email: admin@marketplace.com
--   Password: QAZplm1290@@
--   Check "Auto Confirm User" 
--
-- STEP 2: After creating the auth user, run the query below.
--   It finds the auth user's ID automatically and creates the admin profile.
-- ============================================================

INSERT INTO "users" ("auth_id", "full_name", "phone", "is_admin")
SELECT 
  id::text,
  'Admin',
  '0000000000',
  true
FROM auth.users
WHERE email = 'admin@marketplace.com'
ON CONFLICT ("auth_id") DO UPDATE SET "is_admin" = true;

-- Verify it worked:
-- SELECT * FROM "users" WHERE "is_admin" = true;
