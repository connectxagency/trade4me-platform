/*
  # Add phemex_uid column to partners table

  1. New Column
    - `phemex_uid` (text, optional) - Stores the Phemex Account UID

  2. Performance
    - Add index for better performance on phemex_uid lookups

  3. Security
    - Column is accessible through existing RLS policies
*/

-- Add phemex_uid column to partners table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partners' AND column_name = 'phemex_uid'
  ) THEN
    ALTER TABLE partners ADD COLUMN phemex_uid text;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS partners_phemex_uid_idx ON partners(phemex_uid);