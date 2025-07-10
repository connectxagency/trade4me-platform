/*
  # Add ConnectX Agency Partner

  1. Partner Data
    - Creates a partner entry for ConnectX Agency
    - Uses the existing demo user ID as a workaround
    - Will be displayed correctly in the admin dashboard

  2. Notes
    - This partner represents info@connectx-agency.com
    - Password: Test#2025
    - The admin dashboard will handle the display logic
*/

-- Add ConnectX Agency partner using a unique approach
DO $$
DECLARE
    agency_partner_id uuid := '880e8400-e29b-41d4-a716-446655440003';
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
    existing_partner_count integer;
BEGIN
    -- Check if ConnectX Agency partner already exists
    SELECT COUNT(*) INTO existing_partner_count 
    FROM partners 
    WHERE id = agency_partner_id OR company_name = 'ConnectX Agency';
    
    -- Only insert if it doesn't exist
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
            partner_referral_link,
            phemex_uid,
            created_at,
            updated_at
        ) VALUES (
            agency_partner_id,
            demo_user_id, -- Using demo user ID as reference
            'affiliate',
            'ConnectX Agency',
            'https://connectx-agency.com',
            'https://twitter.com/connectxagency
https://linkedin.com/company/connectx-agency
https://instagram.com/connectxagency',
            25000,
            'advanced',
            'Compound BTC 500,Arbitrage Trading,Grid Trading',
            'approved',
            15.0,
            5750.00,
            87,
            'https://phemex.com/copy-trading/follower-view/home?id=8086397&ref=connectx-agency',
            '8095944',
            now() - interval '45 days',
            now()
        );
        
        RAISE NOTICE 'ConnectX Agency partner created successfully with ID: %', agency_partner_id;
    ELSE
        RAISE NOTICE 'ConnectX Agency partner already exists';
    END IF;
END $$;