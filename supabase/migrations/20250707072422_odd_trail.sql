/*
  # Partner Referral System

  1. New Tables
    - `partner_referrals`
      - `id` (uuid, primary key)
      - `referrer_partner_id` (uuid, foreign key to partners)
      - `referred_partner_id` (uuid, foreign key to partners)
      - `referral_code` (text, unique)
      - `status` (text, enum: pending, active, inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on partner_referrals table
    - Add policies for partners to read their own referrals
    - Add admin policies for full access

  3. Performance
    - Indexes on referrer_partner_id, referred_partner_id, referral_code
    - Triggers for updated_at timestamps

  4. Functions
    - Function to generate unique referral codes
*/

-- Create partner_referrals table
CREATE TABLE IF NOT EXISTS partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  referred_partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  referral_code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(referrer_partner_id, referred_partner_id)
);

-- Enable Row Level Security
ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS partner_referrals_referrer_idx ON partner_referrals(referrer_partner_id);
CREATE INDEX IF NOT EXISTS partner_referrals_referred_idx ON partner_referrals(referred_partner_id);
CREATE INDEX IF NOT EXISTS partner_referrals_code_idx ON partner_referrals(referral_code);
CREATE INDEX IF NOT EXISTS partner_referrals_status_idx ON partner_referrals(status);

-- Create policies for partner_referrals
CREATE POLICY "Partners can read their own referrals"
  ON partner_referrals
  FOR SELECT
  TO authenticated
  USING (
    referrer_partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can insert referrals for themselves"
  ON partner_referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    referrer_partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Admin policies for partner_referrals
CREATE POLICY "Admins can manage all partner referrals"
  ON partner_referrals
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create trigger for updated_at on partner_referrals
CREATE TRIGGER update_partner_referrals_updated_at
  BEFORE UPDATE ON partner_referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_partner_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    code text;
    exists_count integer;
BEGIN
    LOOP
        -- Generate a random 8-character code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_count 
        FROM partner_referrals 
        WHERE referral_code = code;
        
        -- If code doesn't exist, return it
        IF exists_count = 0 THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;

-- Add referral_code column to partners table for their own referral code
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partners' AND column_name = 'affiliate_referral_code'
    ) THEN
        ALTER TABLE partners ADD COLUMN affiliate_referral_code text UNIQUE;
    END IF;
END $$;

-- Create index for affiliate_referral_code
CREATE INDEX IF NOT EXISTS partners_affiliate_referral_code_idx ON partners(affiliate_referral_code);

-- Generate referral codes for existing partners
UPDATE partners 
SET affiliate_referral_code = upper(substring(md5(random()::text || id::text) from 1 for 8))
WHERE affiliate_referral_code IS NULL;

-- Function to handle partner registration with referral
CREATE OR REPLACE FUNCTION handle_partner_referral()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_partner_id uuid;
    referral_code text;
BEGIN
    -- Generate affiliate referral code for new partner if not set
    IF NEW.affiliate_referral_code IS NULL THEN
        NEW.affiliate_referral_code := upper(substring(md5(random()::text || NEW.id::text) from 1 for 8));
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new partners
CREATE TRIGGER generate_affiliate_referral_code_trigger
  BEFORE INSERT ON partners
  FOR EACH ROW
  EXECUTE FUNCTION handle_partner_referral();