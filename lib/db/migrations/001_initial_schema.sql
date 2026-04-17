-- ============================================================
-- Second-Hand-Style — Full Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Create ENUM types
-- ============================================================

DO $$ BEGIN
  CREATE TYPE "category" AS ENUM ('Furniture', 'Electronics', 'Kitchen', 'Clothing', 'Other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "condition" AS ENUM ('New', 'Used', 'Refurbished', 'Special Deal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "city" AS ENUM ('Tel Aviv', 'Jerusalem', 'Haifa', 'Eilat');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "listing_status" AS ENUM ('active', 'in_process', 'sold', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- 2. Create USERS table
-- ============================================================

CREATE TABLE IF NOT EXISTS "users" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "auth_id"    text NOT NULL UNIQUE,       -- links to Supabase auth.users.id
  "full_name"  text NOT NULL,
  "phone"      text NOT NULL,
  "avatar_url" text,
  "is_admin"   boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);


-- 3. Create LISTINGS table
-- ============================================================

CREATE TABLE IF NOT EXISTS "listings" (
  "id"             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "seller_id"      uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title"          text NOT NULL,
  "description"    text NOT NULL,
  "category"       "category" NOT NULL,
  "condition"      "condition" NOT NULL,
  "city"           "city" NOT NULL,
  "original_price" integer NOT NULL,
  "sell_price"     integer NOT NULL,
  "images"         text[] NOT NULL DEFAULT '{}',
  "status"         "listing_status" NOT NULL DEFAULT 'active',
  "created_at"     timestamptz NOT NULL DEFAULT now(),
  "updated_at"     timestamptz NOT NULL DEFAULT now()
);


-- 4. Create WATCHLIST table (composite primary key)
-- ============================================================

CREATE TABLE IF NOT EXISTS "watchlist" (
  "user_id"    uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "listing_id" uuid NOT NULL REFERENCES "listings"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "listing_id")
);


-- 5. Create indexes for common queries
-- ============================================================

CREATE INDEX IF NOT EXISTS "idx_listings_seller"   ON "listings"("seller_id");
CREATE INDEX IF NOT EXISTS "idx_listings_category"  ON "listings"("category");
CREATE INDEX IF NOT EXISTS "idx_listings_city"      ON "listings"("city");
CREATE INDEX IF NOT EXISTS "idx_listings_status"    ON "listings"("status");
CREATE INDEX IF NOT EXISTS "idx_listings_created"   ON "listings"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_users_auth_id"      ON "users"("auth_id");
CREATE INDEX IF NOT EXISTS "idx_watchlist_user"     ON "watchlist"("user_id");
CREATE INDEX IF NOT EXISTS "idx_watchlist_listing"  ON "watchlist"("listing_id");


-- ============================================================
-- DONE — Tables: users, listings, watchlist
-- Enums: category, condition, city, listing_status
-- ============================================================
