-- Add buyer_id column to listings table for tracking deal requests
ALTER TABLE listings ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES users(id) ON DELETE SET NULL;

-- Allow RLS: buyers can see listings they requested
CREATE POLICY "Buyers can see their requested listings"
ON listings FOR SELECT
TO authenticated
USING (buyer_id = (SELECT id FROM users WHERE auth_id = auth.uid()::text LIMIT 1));
