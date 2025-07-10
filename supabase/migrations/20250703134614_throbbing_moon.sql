/*
  # Create demo user and partner data

  1. Demo Data
    - Creates a demo user in auth.users table
    - Creates corresponding partner profile
    - Provides login credentials for testing

  2. Notes
    - Demo user email: demo.community@connectx.com
    - Demo user password: demo123456
    - Partner type: community
    - Status: approved
*/

-- Create demo user in auth.users table
-- Note: This is a simplified approach for demo purposes
DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
    existing_user_count integer;
    existing_partner_count integer;
BEGIN
    -- Check if demo user already exists in auth.users
    SELECT COUNT(*) INTO existing_user_count 
    FROM auth.users 
    WHERE id = demo_user_id;
    
    -- Only create user if it doesn't exist
    IF existing_user_count = 0 THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            invited_at,
            confirmation_token,
            confirmation_sent_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at
        ) VALUES (
            demo_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo.community@connectx.com',
            '$2a$10$8K1p/a0dhrxSHxN1nByqhOxHl7mMaVAp6JeuKIpI4PHOGKV5XMjIu', -- demo123456
            now(),
            null,
            '',
            null,
            '',
            null,
            '',
            '',
            null,
            null,
            '{"provider": "email", "providers": ["email"]}',
            '{"first_name": "Demo", "last_name": "Community"}',
            false,
            now(),
            now(),
            null,
            null,
            '',
            '',
            null,
            '',
            0,
            null,
            '',
            null,
            false,
            null
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