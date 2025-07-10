import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session in local storage
    persistSession: true,
    // Handle auth errors gracefully
    detectSessionInUrl: true,
    // Set storage key prefix to avoid conflicts
    storageKey: 'supabase.auth.token',
  },
  // Configure realtime and global settings
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});

export type Database = {
  public: {
    Tables: {
      partners: {
        Row: {
          id: string;
          user_id: string;
          partner_type: 'affiliate' | 'kol' | 'community';
          company_name: string | null;
          website_url: string | null;
          social_media_links: string | null;
          audience_size: number | null;
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          preferred_strategies: string | null;
          status: 'pending' | 'approved' | 'rejected';
          commission_rate: number | null;
          total_earnings: number;
          total_referrals: number;
          created_at: string;
          updated_at: string;
          partner_referral_link: string | null;
          phemex_uid: string | null;
          customer_onboarding_bonus: number | null;
          profit_share_rate: number | null;
          rebate_rate: number | null;
          affiliate_referral_code: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          partner_type: 'affiliate' | 'kol' | 'community';
          company_name?: string | null;
          website_url?: string | null;
          social_media_links?: string | null;
          audience_size?: number | null;
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          preferred_strategies?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          commission_rate?: number | null;
          total_earnings?: number;
          total_referrals?: number;
          created_at?: string;
          updated_at?: string;
          partner_referral_link?: string | null;
          phemex_uid?: string | null;
          customer_onboarding_bonus?: number | null;
          profit_share_rate?: number | null;
          rebate_rate?: number | null;
          affiliate_referral_code?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          partner_type?: 'affiliate' | 'kol' | 'community';
          company_name?: string | null;
          website_url?: string | null;
          social_media_links?: string | null;
          audience_size?: number | null;
          experience_level?: 'beginner' | 'intermediate' | 'advanced';
          preferred_strategies?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          commission_rate?: number | null;
          total_earnings?: number;
          total_referrals?: number;
          created_at?: string;
          updated_at?: string;
          partner_referral_link?: string | null;
          phemex_uid?: string | null;
          customer_onboarding_bonus?: number | null;
          profit_share_rate?: number | null;
          rebate_rate?: number | null;
          affiliate_referral_code?: string | null;
        };
      };
      partner_referrals: {
        Row: {
          id: string;
          referrer_partner_id: string;
          referred_partner_id: string;
          referral_code: string;
          status: 'pending' | 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          referrer_partner_id: string;
          referred_partner_id: string;
          referral_code: string;
          status?: 'pending' | 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          referrer_partner_id?: string;
          referred_partner_id?: string;
          referral_code?: string;
          status?: 'pending' | 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};