# ConnectX - Trade4me Partner Platform

A modern professional networking platform for cryptocurrency trading partnerships, built with React, TypeScript, and Supabase.

## 🚀 Features

- **Partner Registration & Management** - Comprehensive onboarding for affiliates, KOLs, and communities
- **Trade4me Landing Pages** - Personalized landing pages with affiliate tracking
- **Admin Dashboard** - Complete partner management and analytics
- **Consultation Booking** - Automated appointment scheduling system
- **Tutorial Management** - Video and PDF tutorial system for partners
- **Real-time Analytics** - Performance tracking and commission management

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Build Tool:** Vite

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/connectx-platform.git
   cd connectx-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

The project uses Supabase with the following main tables:

- `partners` - Partner profiles and settings
- `partner_referrals` - Referral tracking system
- `consultations` - Appointment booking data
- `available_slots` - Available consultation times
- `tutorials` - Video and PDF learning materials

### Database Migration

All SQL migrations are included in the `supabase/migrations/` directory. Run them in order to set up your database schema.

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to GitHub**
   - Push your code to a GitHub repository
   - Connect your GitHub account to Vercel

2. **Deploy with Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Set Environment Variables**
   In your Vercel dashboard, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Custom Domain (Optional)**
   Configure your custom domain in Vercel settings

## 📱 Key Pages & Features

### Public Pages
- **Homepage** (`/`) - Main landing page with services overview
- **Explore Strategies** (`/explore-strategies`) - Trading strategy details
- **Trade4me Landing** (`/trade4me/:code`) - Partner-specific landing pages
- **Registration** (`/register`) - Partner onboarding
- **Login** (`/login`) - Partner authentication

### Protected Pages
- **Partner Dashboard** (`/dashboard`) - Partner analytics and tools
- **Admin Dashboard** (`/admin-dashboard`) - Complete platform management

### Demo Accounts

For testing purposes, demo accounts are available:

**Partner Demo:**
- Email: `demo.community@connectx.com`
- Password: `demo123456`

**Admin Demo:**
- Email: `admin@connectx.com`
- Password: `AdminConnect2025!`

## 🎯 Partner Types

The platform supports three types of partners:

1. **Affiliate Partners** - Commission-based referral system
2. **Key Opinion Leaders (KOLs)** - Influencer partnerships
3. **Community Networks** - Group licensing and management

## 📊 Admin Features

- Partner approval and management
- Commission rate configuration
- Tutorial and content management
- Consultation booking oversight
- Performance analytics
- Referral tracking

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── lib/               # Utilities and configurations
├── pages/             # Page components
└── main.tsx           # Application entry point

supabase/
└── migrations/        # Database migration files

public/               # Static assets
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- Admin access controls
- Input validation and sanitization

## 🌐 Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@connectx.com
- Documentation: [docs.connectx.com](https://docs.connectx.com)

## 🎉 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons

---

**Built with ❤️ for the crypto trading community**