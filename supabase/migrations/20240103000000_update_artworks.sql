-- Add new columns for Admin Panel management
ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'Common',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Ensure RLS policies allow the new columns to be managed (existing policies use TRUE/TRUE so they cover this, but good to verify)
-- Existing: CREATE POLICY "Artworks can be updated by authenticated users" ON artworks FOR UPDATE USING (true);
