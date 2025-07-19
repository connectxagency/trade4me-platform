# Trade4me Platform - Supabase Documentation

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Authentication & Authorization](#authentication--authorization)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Setup & Configuration](#setup--configuration)
6. [API Usage Patterns](#api-usage-patterns)
7. [Real-time Subscriptions](#real-time-subscriptions)
8. [File Storage](#file-storage)
9. [Error Handling](#error-handling)
10. [Performance Optimization](#performance-optimization)
11. [Migration Guide](#migration-guide)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [Production Considerations](#production-considerations)

---

## Overview

The Trade4me platform uses Supabase as its backend-as-a-service solution, providing:

- **PostgreSQL Database**: Relational database with full SQL support
- **Authentication**: Built-in user management with JWT tokens
- **Real-time**: WebSocket connections for live updates
- **Row Level Security**: Database-level access control
- **Edge Functions**: Server-side logic execution
- **Storage**: File upload and management

### Technology Stack
- **Supabase JS**: v2.39.0
- **Database**: PostgreSQL 15+
- **Authentication**: JWT-based with automatic refresh
- **Real-time**: WebSocket with configurable throttling

---

## Database Schema

### Entity Relationship Diagram (Text-based)

```
auth.users (Supabase Auth)
    ├── partners (1:1)
    ├── webinar_registrations (1:many)
    └── consultations (1:many)

partners
    ├── partner_referrals (1:many) as referrer
    └── partner_referrals (1:many) as referred

webinar_sessions
    └── webinar_registrations (1:many)

consultations
    └── consultation_sessions (1:many)

marketing_materials (standalone)
tutorials (standalone)
```

### Core Tables

#### 1. Partners Table

```sql
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_type text NOT NULL CHECK (partner_type IN ('affiliate', 'kol', 'community')),
  company_name text,
  website_url text,
  social_media_links text,
  audience_size integer,
  experience_level text NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  preferred_strategies text,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  commission_rate numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  total_referrals integer DEFAULT 0,
  partner_referral_link text,
  phemex_uid text,
  customer_onboarding_bonus numeric,
  profit_share_rate numeric,
  rebate_rate numeric,
  affiliate_referral_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Partner Types & Workflows:**

- **Affiliate**: Traditional referral-based partnership with commission rates
- **KOL (Key Opinion Leader)**: Influencer partnerships with audience-based metrics
- **Community**: Community-driven partnerships with shared profit models

#### 2. Partner Referrals Table

```sql
CREATE TABLE partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  referred_partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'inactive')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 3. Webinar System

```sql
-- Webinar Sessions
CREATE TABLE webinar_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'FREE Trade4me Education Webinar',
  description text DEFAULT 'Learn professional crypto trading strategies...',
  date date NOT NULL,
  time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 100,
  zoom_meeting_id text,
  zoom_join_url text,
  zoom_password text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, time)
);

-- Webinar Registrations
CREATE TABLE webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_session_id uuid NOT NULL REFERENCES webinar_sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  registration_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  zoom_registrant_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(webinar_session_id, email)
);
```

#### 4. Consultation System

```sql
-- Consultations
CREATE TABLE consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultation Sessions
CREATE TABLE consultation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  meeting_link text,
  notes text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 5. Marketing Materials

```sql
CREATE TABLE marketing_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('image', 'video', 'banner', 'social', 'document')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  category text NOT NULL DEFAULT 'web',
  dimensions text,
  format text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### 6. Tutorials

```sql
CREATE TABLE tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer,
  category text NOT NULL,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## Authentication & Authorization

### Auth Context Implementation

The application uses a centralized authentication context (`/src/contexts/AuthContext.tsx`):

```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}
```

### Key Features

1. **Automatic Token Refresh**: Configured in `supabase.ts`
2. **Session Persistence**: Uses localStorage with key prefix
3. **Error Handling**: Graceful handling of invalid refresh tokens
4. **Real-time Auth State**: Listens to auth state changes

### Auth Configuration

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});
```

---

## Row Level Security (RLS)

### Admin Function

The platform uses a centralized admin check function:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY definer
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_role')::text = 'admin',
    false
  );
$$;
```

### RLS Policies by Table

#### Partners Table

```sql
-- Users can read their own partner data
CREATE POLICY "Users can read own partner data"
  ON partners FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own partner data
CREATE POLICY "Users can insert own partner data"
  ON partners FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own partner data
CREATE POLICY "Users can update own partner data"
  ON partners FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all partners
CREATE POLICY "Admins can manage all partners"
  ON partners FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

#### Webinar System

```sql
-- Public read access for active sessions
CREATE POLICY "Anyone can read active webinar sessions"
  ON webinar_sessions FOR SELECT TO anon, authenticated
  USING (is_active = true AND date >= CURRENT_DATE);

-- Public registration access
CREATE POLICY "Anyone can register for webinars"
  ON webinar_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin management
CREATE POLICY "Admins can manage all webinar sessions"
  ON webinar_sessions FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

#### Marketing Materials

```sql
-- Public read access for active materials
CREATE POLICY "Anyone can read active marketing materials"
  ON marketing_materials FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Admin management
CREATE POLICY "Admins can manage all marketing materials"
  ON marketing_materials FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

## Setup & Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure Supabase Client**
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **Run Migrations**
   ```bash
   # Using Supabase CLI
   npx supabase migration up
   
   # Or apply via Dashboard
   # Copy migration files to your Supabase project
   ```

### Database Migration Process

The project includes 17 migration files that should be applied in chronological order:

1. `20250703122219_warm_mountain.sql` - Initial partners table
2. `20250703133544_shiny_sound.sql` - Partners table refinements
3. `20250703134614_throbbing_moon.sql` - Additional constraints
4. `20250703135057_shy_snow.sql` - Performance indexes
5. `20250703152423_throbbing_shape.sql` - Security updates
6. `20250704092258_delicate_lab.sql` - Admin function
7. `20250704093701_light_lab.sql` - Admin policies
8. `20250704140822_scarlet_prism.sql` - Consultation system
9. `20250707054348_amber_band.sql` - Partner referral links
10. `20250707061251_steep_spark.sql` - Phemex UID field
11. `20250707061955_frosty_rice.sql` - Commission structure
12. `20250707062423_weathered_desert.sql` - Profit sharing
13. `20250707063438_green_lagoon.sql` - Rebate rates
14. `20250707072422_odd_trail.sql` - Partner referrals table
15. `20250707133254_withered_meadow.sql` - Tutorials system
16. `20250708111931_crystal_dune.sql` - Marketing materials
17. `20250709100609_steep_morning.sql` - Webinar system

---

## API Usage Patterns

### Common Query Patterns

#### Fetching Partner Data

```typescript
const fetchPartnerData = async () => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching partner data:', error);
    throw error;
  }
};
```

#### Creating a Partner

```typescript
const createPartner = async (partnerData: Partial<Partner>) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .insert({
        user_id: user.id,
        ...partnerData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw error;
  }
};
```

#### Webinar Registration

```typescript
const registerForWebinar = async (sessionId: string, userData: {name: string, email: string}) => {
  try {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .insert({
        webinar_session_id: sessionId,
        name: userData.name,
        email: userData.email,
        status: 'confirmed'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error registering for webinar:', error);
    throw error;
  }
};
```

#### Fetching Marketing Materials

```typescript
const fetchMarketingMaterials = async (category?: string) => {
  try {
    let query = supabase
      .from('marketing_materials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching marketing materials:', error);
    throw error;
  }
};
```

### Admin Operations

#### Managing Partners (Admin Only)

```typescript
const updatePartnerStatus = async (partnerId: string, status: 'pending' | 'approved' | 'rejected') => {
  try {
    const { error } = await supabase
      .from('partners')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', partnerId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating partner status:', error);
    throw error;
  }
};
```

---

## Real-time Subscriptions

### Partner Status Updates

```typescript
const subscribeToPartnerUpdates = (partnerId: string, onUpdate: (data: any) => void) => {
  const subscription = supabase
    .channel('partner-updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'partners',
      filter: `id=eq.${partnerId}`
    }, onUpdate)
    .subscribe();
  
  return () => subscription.unsubscribe();
};
```

### Webinar Registration Updates

```typescript
const subscribeToWebinarRegistrations = (sessionId: string, onUpdate: (data: any) => void) => {
  const subscription = supabase
    .channel('webinar-registrations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'webinar_registrations',
      filter: `webinar_session_id=eq.${sessionId}`
    }, onUpdate)
    .subscribe();
  
  return () => subscription.unsubscribe();
};
```

---

## File Storage

### Marketing Materials Storage

```typescript
const uploadMarketingMaterial = async (file: File, category: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `marketing/${category}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('marketing-materials')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data: publicUrlData } = supabase.storage
      .from('marketing-materials')
      .getPublicUrl(filePath);
    
    // Save to database
    const { data, error } = await supabase
      .from('marketing_materials')
      .insert({
        title: file.name,
        type: getFileType(fileExt),
        file_url: publicUrlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        category,
        format: fileExt?.toUpperCase()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading marketing material:', error);
    throw error;
  }
};
```

---

## Error Handling

### Centralized Error Handling

```typescript
export class SupabaseError extends Error {
  constructor(
    public code: string,
    public details: string,
    public hint?: string
  ) {
    super(details);
    this.name = 'SupabaseError';
  }
}

export const handleSupabaseError = (error: any): SupabaseError => {
  if (error?.code) {
    return new SupabaseError(error.code, error.message, error.hint);
  }
  return new SupabaseError('UNKNOWN', error.message || 'An unknown error occurred');
};
```

### Common Error Patterns

```typescript
const safeQuery = async <T>(queryFn: () => Promise<T>): Promise<T | null> => {
  try {
    return await queryFn();
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    
    // Log for debugging
    console.error('Database error:', supabaseError);
    
    // Handle specific error types
    switch (supabaseError.code) {
      case 'PGRST116': // Row not found
        return null;
      case '23505': // Unique constraint violation
        throw new Error('This record already exists');
      case '23503': // Foreign key violation
        throw new Error('Cannot delete record with dependencies');
      default:
        throw new Error('Database operation failed');
    }
  }
};
```

---

## Performance Optimization

### Database Indexes

The schema includes optimized indexes for common query patterns:

```sql
-- Partners table indexes
CREATE INDEX partners_user_id_idx ON partners(user_id);
CREATE INDEX partners_status_idx ON partners(status);
CREATE INDEX partners_partner_type_idx ON partners(partner_type);

-- Webinar indexes
CREATE INDEX webinar_sessions_date_time_idx ON webinar_sessions(date, time);
CREATE INDEX webinar_sessions_is_active_idx ON webinar_sessions(is_active);
CREATE INDEX webinar_registrations_session_idx ON webinar_registrations(webinar_session_id);
CREATE INDEX webinar_registrations_email_idx ON webinar_registrations(email);

-- Marketing materials indexes
CREATE INDEX marketing_materials_type_idx ON marketing_materials(type);
CREATE INDEX marketing_materials_category_idx ON marketing_materials(category);
CREATE INDEX marketing_materials_is_active_idx ON marketing_materials(is_active);
```

### Query Optimization Tips

1. **Use Select Specific Columns**
   ```typescript
   // Good
   .select('id, name, status')
   
   // Avoid
   .select('*')
   ```

2. **Implement Pagination**
   ```typescript
   const { data, error } = await supabase
     .from('partners')
     .select('*')
     .range(0, 9) // First 10 records
     .limit(10);
   ```

3. **Use Filters Efficiently**
   ```typescript
   // Combine filters for better performance
   const { data, error } = await supabase
     .from('partners')
     .select('*')
     .eq('status', 'approved')
     .eq('partner_type', 'affiliate')
     .order('created_at', { ascending: false });
   ```

### Connection Pooling

For production, configure connection pooling:

```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'trade4me-platform',
    },
  },
});
```

---

## Migration Guide

### Running Migrations

1. **Install Supabase CLI**
   ```bash
   npm install -g @supabase/cli
   ```

2. **Initialize Project**
   ```bash
   supabase init
   ```

3. **Link to Remote Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Apply Migrations**
   ```bash
   supabase db push
   ```

### Migration Best Practices

1. **Always backup before migrations**
2. **Test migrations on staging first**
3. **Use transactions for complex migrations**
4. **Keep migrations small and focused**
5. **Document breaking changes**

### Rolling Back Migrations

```sql
-- Create rollback script for each migration
-- Example rollback for partners table
DROP TABLE IF EXISTS partners CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();
```

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem**: "Invalid refresh token" or "Refresh Token Not Found"

**Solution**:
```typescript
// Clear invalid session
localStorage.removeItem('supabase.auth.token');
await supabase.auth.signOut();
```

#### 2. RLS Policy Errors

**Problem**: "Row level security policy violation"

**Solution**:
1. Check if user is authenticated
2. Verify policy conditions
3. Ensure proper user roles

```sql
-- Debug RLS policies
SELECT * FROM pg_policies WHERE tablename = 'partners';
```

#### 3. Connection Issues

**Problem**: Cannot connect to Supabase

**Solution**:
1. Verify environment variables
2. Check network connectivity
3. Validate project URL and keys

```typescript
// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('partners').select('count');
    console.log('Connection test:', { data, error });
  } catch (err) {
    console.error('Connection failed:', err);
  }
};
```

#### 4. Performance Issues

**Problem**: Slow queries

**Solution**:
1. Check query execution plans
2. Add appropriate indexes
3. Optimize WHERE clauses
4. Use pagination

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM partners WHERE status = 'approved';
```

### Debug Mode

Enable debug logging:

```typescript
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: process.env.NODE_ENV === 'development',
  },
});
```

---

## Best Practices

### 1. Security

- **Never expose service keys** in client-side code
- **Use RLS policies** for all tables with sensitive data
- **Validate input** on both client and server side
- **Implement proper error handling** without exposing sensitive information

### 2. Data Modeling

- **Use UUIDs** for primary keys
- **Implement proper foreign key constraints**
- **Add appropriate indexes** for query performance
- **Use enum constraints** for limited value sets

### 3. Error Handling

- **Create typed error responses**
- **Log errors for debugging**
- **Provide user-friendly error messages**
- **Implement retry logic** for transient errors

### 4. Performance

- **Use pagination** for large datasets
- **Select only needed columns**
- **Implement proper caching** strategies
- **Monitor query performance**

### 5. Real-time Features

- **Limit subscription scope** to necessary data
- **Unsubscribe when components unmount**
- **Handle connection state** gracefully
- **Implement reconnection logic**

---

## Production Considerations

### 1. Environment Setup

```env
# Production environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Optional: Service role key for server-side operations
SUPABASE_SERVICE_KEY=your-service-key
```

### 2. Security Configuration

- **Enable RLS** on all tables
- **Review and test** all policies
- **Set up proper CORS** policies
- **Implement rate limiting**

### 3. Backup Strategy

```sql
-- Regular backup schedule
pg_dump --host=db.your-project.supabase.co \
        --port=5432 \
        --username=postgres \
        --dbname=postgres \
        --no-password \
        --file=backup-$(date +%Y%m%d).sql
```

### 4. Monitoring

- **Set up alerts** for failed queries
- **Monitor connection limits**
- **Track API usage** and quotas
- **Log important business events**

### 5. Scaling Considerations

- **Plan for database size growth**
- **Monitor and optimize** slow queries
- **Consider read replicas** for heavy read workloads
- **Implement connection pooling**

### 6. Maintenance

- **Regular security updates**
- **Database maintenance windows**
- **Performance monitoring**
- **Backup verification**

---

## Conclusion

This documentation provides a comprehensive guide to the Trade4me platform's Supabase implementation. The architecture supports:

- **Partner management** with three distinct partner types
- **Webinar booking system** with real-time capabilities
- **Marketing materials** management and distribution
- **Tutorial system** for educational content
- **Consultation booking** for personalized support
- **Robust authentication** and authorization
- **Real-time updates** across the platform

The schema is designed for scalability and includes proper security measures through RLS policies and admin functions. Regular maintenance and monitoring ensure optimal performance in production environments.

For additional support or questions, refer to the [Supabase Documentation](https://supabase.com/docs) or consult the development team.