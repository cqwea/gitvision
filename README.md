# AI Review Hub

A community-driven platform to rate and review the latest AI models. Built with Next.js 16 and Supabase.

## Features

- Browse AI models sorted by popularity (most reviews)
- Submit reviews with rating, text, pros/cons, and optional name
- Anonymous reviews supported
- Full admin dashboard to manage models and reviews
- Responsive design (mobile + desktop)

## Prerequisites

- Node.js 20.9+
- A [Supabase](https://supabase.com) account (free tier)
- A [Vercel](https://vercel.com) account (free tier)

## Setup

### 1. Database

1. Create a Supabase project
2. Open the SQL Editor and run the contents of `seed.sql`
3. Copy your project URL and service_role key from Settings → API

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
```

### 3. Seed Models (Optional)

Run the seed script to populate 20 popular AI models:

```bash
npx tsx scripts/seed.ts
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add the three environment variables in Vercel settings
4. Deploy

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS v4
- **Auth:** Simple token-based admin auth
- **Deployment:** Vercel
