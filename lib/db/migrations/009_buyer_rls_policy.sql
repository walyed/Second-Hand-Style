-- ============================================================
-- Migration 009: Add RLS policy allowing buyers to request deals
-- Run this in Supabase SQL Editor
-- ============================================================

-- Allow any authenticated user (who is NOT the seller) to
-- transition an active listing into in_process and set their buyer_id.
CREATE POLICY "Buyers can request a deal on active listings"
  ON "listings" FOR UPDATE
  USING (
    status = 'active'
    AND seller_id NOT IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
    AND EXISTS (
      SELECT 1 FROM "users" WHERE auth_id = auth.uid()::text
    )
  )
  WITH CHECK (
    status = 'in_process'
    AND buyer_id IN (
      SELECT id FROM "users" WHERE auth_id = auth.uid()::text
    )
  );
