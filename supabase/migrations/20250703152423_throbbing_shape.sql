/*
  # Create Demo User Account

  1. Demo User Creation
    - Creates a demo user account in auth.users with proper authentication
    - Email: demo.community@connectx.com
    - Password: demo123456
    - Sets up proper metadata and confirmation

  2. Demo Partner Profile
    - Creates corresponding partner profile for the demo user
    - Sets up as approved community partner with sample data
    - Includes earnings and referral data for demonstration

  3. Security
    - Uses proper password hashing
    - Sets email as confirmed
    - Follows Supabase auth structure
*/

-- Create demo user account
DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
    existing_user_count integer;
    existing_partner_count integer;
BEGIN
    -- Check if demo user already exists
    SELECT COUNT(*) INTO existing_user_count 
    FROM auth.users 
    WHERE email = 'demo.community@connectx.com';
    
    -- Only create user if it doesn't exist
    IF existing_user_count = 0 THEN
        -- Insert into auth.users with proper structure
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            demo_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo.community@connectx.com',
            '$2a$10$8K1p/a0dhrxSHxN1nByqhOxHl7mMaVAp6JeuKIpI4PHOGKV5XMjIu', -- bcrypt hash for 'demo123456'
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"first_name": "Demo", "last_name": "Community"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );

        -- Also insert into auth.identities
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            demo_user_id,
            jsonb_build_object(
                'sub', demo_user_id::text,
                'email', 'demo.community@connectx.com'
            ),
            'email',
            now(),
            now(),
            now()
        );
    END IF;
    
    -- Check if demo partner already exists
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
END $$;