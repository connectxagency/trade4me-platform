/*
  # Create demo user and partner data
  
  This migration creates a demo user account that can be used for testing.
  Since we cannot directly insert into auth.users, we'll create a partner
  record that will be linked when the demo user signs up through the auth API.
  
  Demo credentials:
  - Email: demo.community@connectx.com  
  - Password: demo123456
  
  Note: The actual user account must be created through Supabase Auth API
  or by manually signing up with these credentials.
*/

-- Create a function to handle demo user creation
CREATE OR REPLACE FUNCTION create_demo_partner_if_user_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_email text := 'demo.community@connectx.com';
    demo_user_id uuid;
    existing_partner_count integer;
BEGIN
    -- Try to find the user by email in auth.users
    SELECT id INTO demo_user_id 
    FROM auth.users 
    WHERE email = demo_email;
    
    -- If user exists, create partner profile
    IF demo_user_id IS NOT NULL THEN
        -- Check if partner profile already exists
        SELECT COUNT(*) INTO existing_partner_count 
        FROM partners 
        WHERE user_id = demo_user_id;
        
        -- Only insert partner if it doesn't exist
        IF existing_partner_count = 0 THEN
            INSERT INTO partners (
                id,
                user_id,
                partner_type,
                company_name,
                website_url,
                social_media_links,
                audience_size,
                experience_level,
                preferred_strategies,
                status,
                commission_rate,
                total_earnings,
                total_referrals,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                demo_user_id,
                'community',
                'Demo Community Network',
                'https://demo-community.connectx.com',
                'https://twitter.com/democommunity
https://telegram.me/democommunity
https://discord.gg/democommunity',
                15000,
                'intermediate',
                'Compound BTC 500,Grid Trading,DeFi Yield Farming',
                'approved',
                15.0,
                2500.00,
                42,
                now() - interval '30 days',
                now()
            );
        END IF;
    END IF;
END;
$$;

-- Execute the function
SELECT create_demo_partner_if_user_exists();

-- Clean up the function
DROP FUNCTION create_demo_partner_if_user_exists();