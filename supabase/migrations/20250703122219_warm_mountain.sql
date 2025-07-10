/*
  # Create partners table

  1. New Tables
    - `partners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `partner_type` (text, enum: affiliate, kol, community)
      - `company_name` (text, optional)
      - `website_url` (text, optional)
      - `social_media_links` (text, optional)
      - `audience_size` (integer, optional)
      - `experience_level` (text, enum: beginner, intermediate, advanced)
      - `preferred_strategies` (text, optional)
      - `status` (text, enum: pending, approved, rejected)
      - `commission_rate` (numeric, optional)
      - `total_earnings` (numeric, default 0)
      - `total_referrals` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `partners` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_type text NOT NULL CHECK (partner_type IN ('affiliate', 'kol', 'community')),
  company_name text,
  website_url text,
  social_media_links text,
  audience_size integer,
  experience_level text NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  preferred_strategies text,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  commission_rate numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS partners_user_id_idx ON partners(user_id);
CREATE INDEX IF NOT EXISTS partners_status_idx ON partners(status);
CREATE INDEX IF NOT EXISTS partners_partner_type_idx ON partners(partner_type);