# Rentalux - Vercel Serverless Deployment Guide

This branch contains the serverless version of Rentalux using Next.js API routes and Vercel Postgres, eliminating the need for Spring Boot backend and AWS Lambda functions.

## Architecture

**Frontend**: Next.js 14 (React + TypeScript)
**API**: Next.js API Routes (serverless functions)
**Database**: Vercel Postgres (serverless PostgreSQL)
**Auth**: Clerk
**Payments**: Stripe
**Hosting**: Vercel (100% free tier compatible)

## Why Serverless?

- **Zero cost**: Vercel free tier includes hosting, serverless functions, and Postgres
- **Auto-scaling**: Handles traffic spikes automatically
- **No server maintenance**: No need to manage Spring Boot or AWS infrastructure
- **Faster deployments**: Deploy with `git push`
- **Better DX**: Single codebase for frontend and backend

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- Git
- Vercel account (free)
- Clerk account (free)
- Stripe account (free for testing)

### 2. Install Dependencies

```bash
cd FrontendNextJs
npm install
```

### 3. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Select **Free tier** (256 MB, 60 hours compute/month)
6. Once created, go to **`.env.local` tab**
7. Copy all environment variables

### 4. Run Database Migration

1. In Vercel Postgres dashboard, click **Query**
2. Copy contents of `db/schema.sql`
3. Paste and run the SQL to create tables

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel env pull .env.local
```

### 5. Configure Environment Variables

Create `.env.local` in `FrontendNextJs` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Vercel Postgres (automatically populated by Vercel)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:8080
```

### 6. Run Locally

```bash
npm run dev
```

Visit `http://localhost:8080`

## API Endpoints

All API routes are under `/api`:

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/[id]` - Get vehicle by ID with reservations
- `POST /api/vehicles` - Create vehicle (requires auth)
- `PUT /api/vehicles/[id]` - Update vehicle (requires auth)
- `DELETE /api/vehicles/[id]` - Delete vehicle (requires auth)

### Reservations
- `GET /api/reservations` - Get all reservations (admin)
- `GET /api/reservations?customerId={id}` - Get customer reservations
- `GET /api/reservations/[id]` - Get reservation by ID
- `POST /api/reservations` - Create reservation (requires auth)
- `PUT /api/reservations/[id]` - Update reservation (requires auth)
- `DELETE /api/reservations/[id]` - Delete reservation (requires auth)

### Stripe
- `POST /api/checkout_sessions` - Create Stripe checkout session
- `POST /api/webhooks/route` - Stripe webhook handler

## Deployment to Vercel

### First Time Setup

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Connect to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Continuous Deployment

Once connected to GitHub:

1. Push to `vercel-postgres` branch
2. Vercel automatically deploys
3. Production URL: `your-project.vercel.app`

### Environment Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add all variables from `.env.local`
3. Restart deployment

## Database Schema

### Tables

**vehicles**
- `id` (UUID, primary key)
- `name` (varchar)
- `description` (text)
- `retail_price` (decimal)
- `mileage` (integer)
- `vehicle_type` (varchar)
- `make` (varchar)
- `images` (text array)
- `created_at`, `updated_at` (timestamps)

**reservations**
- `id` (UUID, primary key)
- `customer_id` (varchar - Clerk user ID)
- `vehicle_id` (UUID, foreign key → vehicles)
- `start_date`, `end_date` (dates)
- `payed` (boolean)
- `stripe_session_id` (varchar)
- `created_at`, `updated_at` (timestamps)

## Migration from Spring Boot

The serverless version replaces:

| Old (Spring Boot + Lambda) | New (Next.js Serverless) |
|----------------------------|-------------------------|
| Spring Boot REST API | Next.js API Routes |
| AWS Lambda functions | Next.js API Routes |
| DynamoDB (2 tables) | Postgres (2 tables) |
| AWS Elastic Beanstalk | Vercel |
| Redis cache | Vercel Edge Caching |
| Java 11 | Node.js 18 |

## Cost Comparison

### Old Architecture (AWS)
- Elastic Beanstalk: ~$25-50/month
- Lambda: Pay per invocation
- DynamoDB: Pay per read/write
- **Total: ~$30-100/month**

### New Architecture (Vercel)
- Hosting: Free
- Serverless Functions: Free (100GB-hrs/month)
- Postgres: Free (256 MB, 60 compute hrs)
- **Total: $0/month** (for most projects)

## Troubleshooting

### Clerk v5 Migration

If you see Clerk auth errors, update imports:

```typescript
// Old (v4)
import { auth } from '@clerk/nextjs';

// New (v5)
import { auth } from '@clerk/nextjs/server';
```

### Database Connection Issues

Verify environment variables:
```bash
vercel env pull .env.local
```

### Stripe Webhook Issues

1. Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:8080/api/webhooks/route
```

2. Update webhook secret in `.env.local`

## Performance

- **Cold start**: < 300ms (Next.js API routes)
- **Database queries**: < 50ms (Vercel Postgres)
- **API response time**: ~100-200ms average
- **Free tier limits**: 100GB-hours serverless execution/month

## Support

For issues specific to this serverless deployment:
1. Check Vercel deployment logs
2. Check Vercel Postgres query logs
3. Verify environment variables in Vercel dashboard
