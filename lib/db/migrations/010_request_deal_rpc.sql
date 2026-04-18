-- ============================================================
-- Migration 010: Create RPC function for requesting a deal
-- Run this in Supabase SQL Editor
-- This function runs with SECURITY DEFINER so it bypasses RLS,
-- but enforces its own validation logic inside.
-- ============================================================

CREATE OR REPLACE FUNCTION request_deal(p_listing_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_listing RECORD;
  v_result JSON;
BEGIN
  -- Get the user's internal id from the auth context
  SELECT id INTO v_user_id
    FROM users
   WHERE auth_id = auth.uid()::text;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Fetch the listing
  SELECT * INTO v_listing
    FROM listings
   WHERE id = p_listing_id;

  IF v_listing IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF v_listing.status <> 'active' THEN
    RAISE EXCEPTION 'This listing is no longer available';
  END IF;

  IF v_listing.seller_id = v_user_id THEN
    RAISE EXCEPTION 'You cannot request your own listing';
  END IF;

  -- Perform the update
  UPDATE listings
     SET status     = 'in_process',
         buyer_id   = v_user_id,
         updated_at = NOW()
   WHERE id = p_listing_id
     AND status = 'active';

  -- Return success
  SELECT json_build_object(
    'id', p_listing_id,
    'status', 'in_process',
    'buyer_id', v_user_id
  ) INTO v_result;

  RETURN v_result;
END;
$$;
