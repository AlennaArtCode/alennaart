-- ALENNAVERSE LOGIC SCHEMA
-- Handles User Profiles (Wallets), Seasons, and Quest Progress

-- 1. PROFILES (Wallets as Users)
-- We use wallet_address as the primary identifier since auth is wallet-based.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL, -- Cardano address (stake key preferred for persistence)
  username TEXT,
  avatar_url TEXT,
  is_holder BOOLEAN DEFAULT FALSE, -- Cached status of Season Pass ownership
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SEASONS (The 8-week cycles)
CREATE TABLE IF NOT EXISTS seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL, -- e.g., "Season 1: Genesis"
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. QUESTS (Tasks for users)
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID REFERENCES seasons(id),
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 100,
  category TEXT NOT NULL CHECK (category IN ('social', 'collection', 'community')), -- Enforce categories
  required_policy_id TEXT, -- If the quest is "Hold NFT X"
  verification_type TEXT DEFAULT 'manual', -- 'manual', 'automatic_onchain'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER PROGRESS
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet TEXT REFERENCES profiles(wallet_address),
  quest_id UUID REFERENCES quests(id),
  status TEXT DEFAULT 'completed',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tx_hash TEXT -- Optional: Link to the transaction that verified this quest
);

-- RLS POLICIES (Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public seasons read" ON seasons FOR SELECT USING (true);
CREATE POLICY "Public quests read" ON quests FOR SELECT USING (true);
CREATE POLICY "Public progress read" ON user_quest_progress FOR SELECT USING (true);

-- Insert/Update: In a real app, this would be restricted to the service_role (backend) 
-- or specific authenticated users. For now, we allow authenticated (wallet) users to insert their *Own* progress.
-- (Assuming we will implement a backend function to verify quests securely later)
