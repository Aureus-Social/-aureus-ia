-- Migration: Create aureus_api_keys table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jwjtlpewwdjxdboxtbdf/sql

CREATE TABLE IF NOT EXISTS aureus_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','expired')),
  plan TEXT NOT NULL DEFAULT 'AI-Powered Access',
  monthly_price INTEGER NOT NULL DEFAULT 300,
  api_price INTEGER NOT NULL DEFAULT 5000,
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_status ON aureus_api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_email ON aureus_api_keys(client_email);

-- RLS: only service role can access
ALTER TABLE aureus_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON aureus_api_keys
  USING (auth.role() = 'service_role');

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON aureus_api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
