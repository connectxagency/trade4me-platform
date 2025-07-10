/*
  # Add partner referral link field

  1. Schema Changes
    - Add partner_referral_link column to partners table
    - Allow admins to update this field

  2. Security
    - Maintain existing RLS policies
    - Allow admin updates to the new field
*/

-- Add partner_referral_link column to partners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'partner_referral_link'
  ) THEN
    ALTER TABLE partners ADD COLUMN partner_referral_link text;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS partners_partner_referral_link_idx ON partners(partner_referral_link);