-- ============================================================
-- Row Level Security (RLS) policies
-- Run this in Supabase SQL Editor
-- Required for the frontend to access data via the anon key
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "watchlist" ENABLE ROW LEVEL SECURITY;

-- ─── USERS ──────────────────────────────────────────────────

-- Anyone can read user profiles (for seller info on listings)
CREATE POLICY "Users are viewable by everyone"
  ON "users" FOR SELECT
  USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON "users" FOR INSERT
  WITH CHECK (auth.uid()::text = auth_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "users" FOR UPDATE
  USING (auth.uid()::text = auth_id)
  WITH CHECK (auth.uid()::text = auth_id);

-- ─── LISTINGS ───────────────────────────────────────────────

-- Anyone can read listings
CREATE POLICY "Listings are viewable by everyone"
  ON "listings" FOR SELECT
  USING (true);

-- Authenticated users can create listings (must own the seller_id)
CREATE POLICY "Authenticated users can create listings"
  ON "listings" FOR INSERT
  WITH CHECK (
    seller_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings"
  ON "listings" FOR UPDATE
  USING (
    seller_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete own listings"
  ON "listings" FOR DELETE
  USING (
    seller_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- Admin can update any listing (for status changes)
CREATE POLICY "Admins can update any listing"
  ON "listings" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "users" WHERE auth_id = auth.uid()::text AND is_admin = true
    )
  );

-- ─── WATCHLIST ──────────────────────────────────────────────

-- Users can view their own watchlist
CREATE POLICY "Users can view own watchlist"
  ON "watchlist" FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- Users can add to their own watchlist
CREATE POLICY "Users can add to own watchlist"
  ON "watchlist" FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- Users can remove from their own watchlist
CREATE POLICY "Users can remove from own watchlist"
  ON "watchlist" FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );

-- ============================================================
-- DONE — RLS enabled with proper policies
-- ============================================================
