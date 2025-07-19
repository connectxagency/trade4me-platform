# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Architecture Overview

This is a React TypeScript application for a cryptocurrency trading partner platform called "Trade4me" (formerly ConnectX). It's built with:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Deployment**: Vercel

### Key Architecture Patterns

1. **Authentication Context Pattern**: Uses React Context (`src/contexts/AuthContext.tsx`) for global auth state management with Supabase Auth
2. **Protected Routes**: `ProtectedRoute.tsx` component wraps authenticated pages
3. **Type-Safe Database**: Full TypeScript definitions for Supabase tables in `src/lib/supabase.ts`
4. **Component Organization**: Flat structure in `src/components/` with page components in `src/pages/`

### Database Schema

Main tables (defined in `src/lib/supabase.ts`):
- `partners` - Partner profiles with types: affiliate, kol, community
- `partner_referrals` - Referral tracking system
- `consultations` - Appointment booking
- `available_slots` - Available consultation times  
- `tutorials` - Learning materials

### Partner Types

The platform supports three partner types with different workflows:
1. **Affiliate** - Commission-based referrals
2. **KOL** (Key Opinion Leader) - Influencer partnerships  
3. **Community** - Group licensing

### Authentication Flow

- Uses Supabase Auth with JWT tokens
- Row Level Security (RLS) enabled on all tables
- Admin access controls with special admin email checks
- Demo accounts available for testing (see README.md)

### Environment Variables

Required:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

Copy `.env.example` to `.env` and fill in values.

### Key Components

- `AuthContext.tsx` - Global auth state with session management
- `ProtectedRoute.tsx` - Route protection wrapper
- Admin components: `AdminDashboard.tsx`, `AdminPartnerManagement.tsx`
- Partner-facing: `Dashboard.tsx`, `Trade4meLanding.tsx`
- Booking system: `ConsultationModal.tsx`, `WebinarBookingModal.tsx`

### Database Migrations

All SQL migrations are in `supabase/migrations/` - run in chronological order to set up schema.

### Documentation Structure

All documentation is located in the `@docs/` directory:
- `@docs/CLAUDE.md` - Development guidance for Claude Code
- `@docs/SUPABASE.md` - Supabase configuration and setup
- `@docs/API.md` - API documentation

### Deployment

Configured for Vercel deployment with `vercel.json`. Set environment variables in Vercel dashboard.