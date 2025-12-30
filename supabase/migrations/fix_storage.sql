
-- 1. Create the 'portfolio' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (good practice, often enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Everyone can SEE images (Public Read)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- 4. Policy: Authenticated users (Admin) can UPLOAD
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- 5. Policy: Authenticated users can UPDATE/DELETE
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );
