# Supabase Setup Guide for Non-Technical Users

This guide will walk you through setting up Supabase for the Trade4me Platform step by step. No technical experience required!

## What is Supabase?

Supabase is a cloud service that provides a database and authentication system for web applications. Think of it as the "brain" that stores all your platform's data securely in the cloud.

## Step 1: Create a Supabase Account

1. **Open your web browser** and go to [https://supabase.com](https://supabase.com)

2. **Click "Start your project"** (green button on the homepage)

3. **Sign up for a free account:**
   - Click "Sign up" 
   - Use your GitHub account (recommended) OR
   - Enter your email and create a password
   - Verify your email if prompted

4. **You'll be taken to your dashboard** - this is where you'll manage your projects

## Step 2: Create a New Project

1. **On your Supabase dashboard**, click the **"New Project"** button

2. **Fill in the project details:**
   - **Project Name**: Enter "Trade4me Platform" (or any name you prefer)
   - **Database Password**: Create a strong password and **WRITE IT DOWN SAFELY**
     - Use a mix of letters, numbers, and symbols
     - Example: `MyTrade4me2024!`
   - **Region**: Choose the region closest to you or your users
     - US East (N. Virginia) for US users
     - Europe (Ireland) for European users
     - Asia Pacific for Asian users

3. **Click "Create new project"**

4. **Wait 2-3 minutes** for your project to be created (you'll see a loading screen)

## Step 3: Get Your Supabase Keys

Once your project is ready, you need to copy two important pieces of information:

### 3.1 Get Your Project URL

1. **Look for the "Settings" tab** in the left sidebar of your project
2. **Click on "API"** under Settings
3. **Find "Project URL"** section
4. **Copy the URL** - it looks like: `https://your-project-id.supabase.co`
5. **Save this URL somewhere safe** (like a notepad file)

### 3.2 Get Your Anonymous Key

1. **On the same API page**, scroll down to find **"Project API keys"**
2. **Look for "anon public"** key
3. **Click the "Copy" button** next to the long text string
4. **Save this key somewhere safe** - it's a long string that looks like:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

⚠️ **Important**: Keep these keys private and secure!

## Step 4: Set Up Your Database

1. **Click on "SQL Editor"** in the left sidebar

2. **Copy and paste the database setup script:**
   - You'll need to run the SQL migration files to create your database tables
   - Contact your developer for the specific SQL scripts to run
   - Or look in the `supabase/migrations/` folder of your project

3. **Click "RUN"** to execute the script

## Step 5: Configure Your Application

Now you need to tell your Trade4me Platform where to find your Supabase database:

### 5.1 Create Environment File

1. **In your project folder**, find the file called `.env.example`
2. **Make a copy** of this file and **rename the copy to `.env`**
3. **Open the `.env` file** in a text editor

### 5.2 Add Your Supabase Information

Replace the placeholder values with your real Supabase information:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

**Replace:**
- `https://your-project-id.supabase.co` with your actual Project URL from Step 3.1
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here` with your actual Anonymous Key from Step 3.2

### 5.3 Save the File

- **Save the `.env` file**
- **Never share this file** or commit it to version control - it contains sensitive information

## Step 6: Test Your Setup

1. **Start your application** (ask your developer how to do this)
2. **Try to register a new user** on your platform
3. **Check your Supabase dashboard:**
   - Go to "Authentication" → "Users" 
   - You should see the new user appear

## Step 7: Set Up Authentication Providers (Optional)

If you want users to sign in with Google, GitHub, etc.:

1. **Go to Authentication** → **Providers** in your Supabase dashboard
2. **Enable the providers you want** (Google, GitHub, etc.)
3. **Follow the setup instructions** for each provider
4. **Add the redirect URLs** as instructed

## Common Issues and Solutions

### "Invalid API Key" Error
- Double-check that you copied the anon key correctly
- Make sure there are no extra spaces in your `.env` file

### "Project not found" Error
- Verify your Project URL is correct
- Make sure your project is still active in Supabase

### Database Connection Issues
- Ensure you ran all the migration scripts
- Check that your database password is correct

## Security Best Practices

1. **Never share your keys publicly**
2. **Use strong passwords** for your database
3. **Enable Row Level Security (RLS)** in Supabase for production
4. **Regularly rotate your keys** if needed

## Getting Help

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Contact your developer** for project-specific help

## Quick Reference

**Your Supabase Information** (fill this out):
- Project URL: `_____________________`
- Anonymous Key: `_____________________`
- Database Password: `_____________________`
- Project Region: `_____________________`

---

✅ **Congratulations!** Your Supabase backend is now set up and ready to power your Trade4me Platform!