-- Add email column to users table for phone-to-email lookup
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Create index for fast lookup by phone
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Backfill existing users by reading from auth.users
UPDATE users
SET email = au.email
FROM auth.users au
WHERE users.auth_id = au.id::text
AND users.email IS NULL;
