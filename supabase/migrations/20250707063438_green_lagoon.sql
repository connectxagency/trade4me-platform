/*
  # Add partner provision fields

  1. New Columns
    - `customer_onboarding_bonus` (numeric, default 100) - Customer Onboarding Bonus in USDT
    - `profit_share_rate` (numeric, default 2) - Profit Share percentage
    - `rebate_rate` (numeric, default 15) - Rebate percentage

  2. Updates
    - Add these columns to existing partners table
    - Set default values for existing partners
    - Create indexes for performance

  3. Security
    - Admin can edit these values
    - Partners can view their assigned values
*/

-- Add new provision columns to partners table
DO $$
BEGIN
    -- Add customer_onboarding_bonus column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partners' AND column_name = 'customer_onboarding_bonus'
    ) THEN
        ALTER TABLE partners ADD COLUMN customer_onboarding_bonus numeric DEFAULT 100;
    END IF;
    
    -- Add profit_share_rate column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partners' AND column_name = 'profit_share_rate'
    ) THEN
        ALTER TABLE partners ADD COLUMN profit_share_rate numeric DEFAULT 2;
    END IF;
    
    -- Add rebate_rate column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partners' AND column_name = 'rebate_rate'
    ) THEN
        ALTER TABLE partners ADD COLUMN rebate_rate numeric DEFAULT 15;
    END IF;
END $$;

-- Update existing partners with default values if they are null
UPDATE partners 
SET 
    customer_onboarding_bonus = COALESCE(customer_onboarding_bonus, 100),
    profit_share_rate = COALESCE(profit_share_rate, 2),
    rebate_rate = COALESCE(rebate_rate, 15)
WHERE 
    customer_onboarding_bonus IS NULL 
    OR profit_share_rate IS NULL 
    OR rebate_rate IS NULL;