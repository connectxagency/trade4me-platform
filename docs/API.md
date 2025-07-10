# API Documentation

Connect<span className="text-blue-500">X</span> Platform uses Supabase for backend services. This document covers the main API endpoints and database schema.

## 🔐 Authentication

All API calls require authentication via Supabase Auth.

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

### Register
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
```

## 📊 Database Schema

### Partners Table

```sql
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_type text CHECK (partner_type IN ('affiliate', 'kol', 'community')),
  company_name text,
  website_url text,
  social_media_links text,
  audience_size integer,
  experience_level text DEFAULT 'beginner',
  preferred_strategies text,
  status text DEFAULT 'pending',
  commission_rate numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  partner_referral_link text,
  phemex_uid text,
  customer_onboarding_bonus numeric DEFAULT 100,
  profit_share_rate numeric DEFAULT 2,
  rebate_rate numeric DEFAULT 15,
  affiliate_referral_code text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Partner Referrals Table

```sql
CREATE TABLE partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  referred_partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  referral_code text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Consultations Table

```sql
CREATE TABLE consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  topic text NOT NULL,
  message text,
  consultation_date date NOT NULL,
  consultation_time time NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Tutorials Table

```sql
CREATE TABLE tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('video', 'pdf')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  duration integer,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔍 API Endpoints

### Partners

#### Get Partner Profile
```typescript
const { data, error } = await supabase
  .from('partners')
  .select('*')
  .eq('user_id', user.id)
  .single();
```

#### Update Partner Profile
```typescript
const { data, error } = await supabase
  .from('partners')
  .update({
    company_name: 'New Company',
    website_url: 'https://example.com'
  })
  .eq('user_id', user.id);
```

#### Get All Partners (Admin Only)
```typescript
const { data, error } = await supabase
  .from('partners')
  .select('*')
  .order('created_at', { ascending: false });
```

### Consultations

#### Book Consultation
```typescript
const { data, error } = await supabase
  .from('consultations')
  .insert({
    name: 'John Doe',
    email: 'john@example.com',
    topic: 'Partnership Opportunities',
    consultation_date: '2025-01-15',
    consultation_time: '14:00'
  });
```

#### Get Available Slots
```typescript
const { data, error } = await supabase
  .from('available_slots')
  .select('*')
  .eq('is_available', true)
  .gte('date', new Date().toISOString().split('T')[0])
  .order('date')
  .order('time');
```

### Tutorials

#### Get Active Tutorials
```typescript
const { data, error } = await supabase
  .from('tutorials')
  .select('*')
  .eq('is_active', true)
  .order('sort_order')
  .order('created_at');
```

#### Create Tutorial (Admin Only)
```typescript
const { data, error } = await supabase
  .from('tutorials')
  .insert({
    title: 'Getting Started',
    description: 'Introduction tutorial',
    type: 'video',
    file_url: 'https://example.com/video.mp4',
    file_name: 'intro.mp4',
    category: 'basics'
  });
```

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Partners Table Policies
- Users can read/update their own partner data
- Admins can read/update all partner data

### Consultations Table Policies
- Anyone can insert consultations (for booking)
- Admins can read/update all consultations

### Tutorials Table Policies
- Anyone can read active tutorials
- Admins can manage all tutorials

## 🛡️ Admin Functions

### Check Admin Status
```typescript
const { data, error } = await supabase.rpc('is_admin');
```

### Admin Policies
Admin access is controlled by the `is_admin()` function which checks if the user's email is in the admin list.

## 📝 Error Handling

Always handle errors appropriately:

```typescript
const { data, error } = await supabase
  .from('partners')
  .select('*');

if (error) {
  console.error('Database error:', error);
  // Handle error appropriately
  return;
}

// Use data
console.log('Partners:', data);
```

## 🔄 Real-time Subscriptions

Subscribe to real-time changes:

```typescript
const subscription = supabase
  .channel('partners')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'partners' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## 📊 Analytics Queries

### Partner Performance
```sql
SELECT 
  p.company_name,
  p.total_earnings,
  p.total_referrals,
  p.commission_rate,
  COUNT(pr.id) as direct_referrals
FROM partners p
LEFT JOIN partner_referrals pr ON p.id = pr.referrer_partner_id
WHERE p.status = 'approved'
GROUP BY p.id
ORDER BY p.total_earnings DESC;
```

### Consultation Statistics
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM consultations
GROUP BY month
ORDER BY month DESC;
```

## 🚀 Rate Limiting

Supabase provides built-in rate limiting. For additional protection, implement client-side throttling:

```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .ilike('company_name', `%${query}%`);
}, 300);
```

## 📱 Mobile Considerations

When building mobile apps, consider:
- Offline support with local storage
- Image optimization for mobile networks
- Touch-friendly UI components
- Push notifications via Supabase

For more detailed information, refer to the [Supabase Documentation](https://supabase.com/docs).