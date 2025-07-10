/*
  # Create partners table

  1. New Tables
    - `partners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `partner_type` (text, constrained to 'affiliate', 'kol', 'community')
      - `company_name` (text, optional)
      - `website_url` (text, optional)
      - `social_media_links` (text, optional)
      - `audience_size` (integer, optional)
      - `experience_level` (text, default 'beginner')
      - `preferred_strategies` (text, optional)
      - `status` (text, default 'pending')
      - `commission_rate` (numeric, default 0)
      - `total_earnings` (numeric, default 0)
      - `total_referrals` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `partners` table
    - Add policies for authenticated users to manage their own data

  3. Performance
    - Add indexes on user_id, partner_type, and status
    - Add trigger for automatic updated_at timestamp updates
*/

-- Create the partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_type text NOT NULL CHECK (partner_type IN ('affiliate', 'kol', 'community')),
  company_name text,
  website_url text,
  social_media_links text,
  audience_size integer,
  experience_level text NOT NULL DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_strategies text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  commission_rate numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS partners_user_id_idx ON partners(user_id);
CREATE INDEX IF NOT EXISTS partners_partner_type_idx ON partners(partner_type);
CREATE INDEX IF NOT EXISTS partners_status_idx ON partners(status);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own partner data" ON partners;
DROP POLICY IF EXISTS "Users can insert own partner data" ON partners;
DROP POLICY IF EXISTS "Users can update own partner data" ON partners;

-- Create policies for RLS
CREATE POLICY "Users can read own partner data"
  ON partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own partner data"
  ON partners
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own partner data"
  ON partners
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();