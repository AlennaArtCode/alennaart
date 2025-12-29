-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  size TEXT,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  color TEXT,
  season TEXT,
  mood TEXT,
  type TEXT,
  episode TEXT,
  collection TEXT,
  marketplace_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create music_releases table
CREATE TABLE IF NOT EXISTS music_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Alenna',
  category TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  cover_url TEXT NOT NULL,
  cover_path TEXT NOT NULL,
  audio_url TEXT,
  audio_path TEXT,
  audio_file_name TEXT,
  color TEXT,
  size TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create writings table
CREATE TABLE IF NOT EXISTS writings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_url TEXT,
  cover_path TEXT,
  category TEXT NOT NULL,
  read_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

-- Policies for Artworks
CREATE POLICY "Public artworks are viewable by everyone" ON artworks FOR SELECT USING (true);
CREATE POLICY "Artworks can be inserted by authenticated users" ON artworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Artworks can be updated by authenticated users" ON artworks FOR UPDATE USING (true);
CREATE POLICY "Artworks can be deleted by authenticated users" ON artworks FOR DELETE USING (true);

-- Policies for Music Releases
CREATE POLICY "Public music releases are viewable by everyone" ON music_releases FOR SELECT USING (true);
CREATE POLICY "Music releases can be inserted by authenticated users" ON music_releases FOR INSERT WITH CHECK (true);
CREATE POLICY "Music releases can be updated by authenticated users" ON music_releases FOR UPDATE USING (true);
CREATE POLICY "Music releases can be deleted by authenticated users" ON music_releases FOR DELETE USING (true);

-- Policies for Writings
CREATE POLICY "Public writings are viewable by everyone" ON writings FOR SELECT USING (true);
CREATE POLICY "Writings can be inserted by authenticated users" ON writings FOR INSERT WITH CHECK (true);
CREATE POLICY "Writings can be updated by authenticated users" ON writings FOR UPDATE USING (true);
CREATE POLICY "Writings can be deleted by authenticated users" ON writings FOR DELETE USING (true);
