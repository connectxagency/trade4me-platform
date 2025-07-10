# Deployment Guide

This guide covers deploying Connect<span className="text-blue-500">X</span> Platform to various hosting providers.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Supabase project

### Step 1: Prepare Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Connect Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
  - Select your Connect<span className="text-blue-500">X</span> repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Environment Variables

Add these environment variables in Vercel:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed site

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🌐 Netlify Deployment

### Option 1: Git Integration

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add Supabase credentials

### Option 2: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag `dist` folder to Netlify deploy area
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## ☁️ Other Hosting Providers

### AWS S3 + CloudFront

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   - Create S3 bucket
   - Enable static website hosting
   - Upload `dist` contents

3. **Configure CloudFront**
   - Create distribution
   - Set S3 as origin
   - Configure custom error pages

### Google Firebase

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Project**
   ```bash
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### DigitalOcean App Platform

1. **Connect Repository**
   - Go to DigitalOcean Apps
   - Connect GitHub repository

2. **Configure Build**
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Add Environment Variables**
   - Add Supabase credentials in app settings

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Run Migrations**
   - Use Supabase Dashboard SQL Editor
   - Run migration files in order from `supabase/migrations/`

3. **Configure RLS**
   - Ensure Row Level Security is enabled
   - Verify policies are working

4. **Get Credentials**
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Project Settings → API

### Environment Variables

Required for all deployments:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🔧 Build Optimization

### Performance Tips

1. **Enable Compression**
   - Gzip/Brotli compression
   - Image optimization
   - Code splitting

2. **CDN Configuration**
   - Cache static assets
   - Set proper headers
   - Use edge locations

3. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

## 🔒 Security Considerations

### Production Checklist

- [ ] Environment variables are secure
- [ ] HTTPS is enabled
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] Error pages don't expose sensitive info
- [ ] Database RLS policies tested
- [ ] Admin access restricted

### Headers Configuration

Add to `vercel.json` or hosting provider config:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring

### Analytics Setup

1. **Vercel Analytics**
   - Enable in project settings
   - View performance metrics

2. **Google Analytics**
   - Add tracking code
   - Configure goals

3. **Error Tracking**
   - Sentry integration
   - Error monitoring

### Health Checks

Monitor these endpoints:
- `/` - Homepage loads
- `/api/health` - API status
- Database connectivity

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify dependencies
   - Review build logs

2. **Environment Variables**
   - Ensure all required vars are set
   - Check for typos
   - Verify Supabase credentials

3. **Routing Issues**
   - Configure redirects for SPA
   - Check `vercel.json` rewrites

4. **Database Connection**
   - Verify Supabase URL
   - Check RLS policies
   - Test API endpoints

### Support

- Check deployment logs
- Review hosting provider docs
- Contact support if needed

## 🎯 Post-Deployment

### Final Steps

1. **Test All Features**
   - User registration/login
   - Partner dashboard
   - Admin functions
   - Payment flows

2. **Performance Testing**
   - Load testing
   - Mobile performance
   - SEO optimization

3. **Backup Strategy**
   - Database backups
   - Code repository
   - Environment configs

Congratulations! Your Connect<span className="text-blue-500">X</span> Platform is now live! 🎉