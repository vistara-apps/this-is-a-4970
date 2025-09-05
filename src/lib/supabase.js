import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

// Create Supabase client
export const supabase = config.supabase.url && config.supabase.anonKey 
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null

// Database schema types for TypeScript-like documentation
export const DatabaseSchema = {
  users: {
    id: 'uuid',
    email: 'text',
    subscription_status: 'text', // 'free', 'premium', 'trial'
    preferred_language: 'text', // 'en', 'es'
    location_info: 'jsonb',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  legal_guides: {
    id: 'uuid',
    state: 'text',
    title: 'text',
    content: 'jsonb',
    language: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },
  interaction_records: {
    id: 'uuid',
    user_id: 'uuid', // foreign key to users
    timestamp: 'timestamp',
    location: 'text',
    notes: 'text',
    audio_url: 'text',
    generated_card_url: 'text',
    created_at: 'timestamp'
  }
}

// SQL schema for database setup
export const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'trial')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es')),
  location_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE IF NOT EXISTS legal_guides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  state TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, language)
);

-- Interaction records table
CREATE TABLE IF NOT EXISTS interaction_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  notes TEXT,
  audio_url TEXT,
  generated_card_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_legal_guides_state_lang ON legal_guides(state, language);
CREATE INDEX IF NOT EXISTS idx_interaction_records_user_id ON interaction_records(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_records_timestamp ON interaction_records(timestamp);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_records ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own interaction records
CREATE POLICY "Users can view own records" ON interaction_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON interaction_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON interaction_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON interaction_records FOR DELETE USING (auth.uid() = user_id);

-- Legal guides are public (read-only)
CREATE POLICY "Legal guides are public" ON legal_guides FOR SELECT TO public USING (true);
`

// Helper functions for database operations
export const dbHelpers = {
  // Get or create user
  async getOrCreateUser(email, userData = {}) {
    if (!supabase) return null
    
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return existingUser
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ email, ...userData }])
      .select()
      .single()

    if (error) throw error
    return newUser
  },

  // Get legal guide for state
  async getLegalGuide(state, language = 'en') {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Save interaction record
  async saveInteractionRecord(userId, recordData) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('interaction_records')
      .insert([{ user_id: userId, ...recordData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user's interaction records
  async getUserRecords(userId, limit = 10) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('interaction_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}
