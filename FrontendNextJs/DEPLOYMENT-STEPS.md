# Rentalux - Vercel Deployment Steps

Follow these steps in order to deploy Rentalux to Vercel.

## Step 1: Commit and Push Your Code

```bash
# Make sure you're on vercel-postgres branch
git status

# Add all changes
git add .

# Commit
git commit -m "Serverless migration: Next.js API routes with Vercel Postgres"

# Push to GitHub
git push origin vercel-postgres
```

## Step 2: Set Up Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (it's free)
3. Authorize Vercel to access your GitHub repositories

## Step 3: Import Your Project to Vercel

1. Click **"Add New..."** → **"Project"**
2. Find your **Rentalux** repository
3. Click **"Import"**
4. **Framework Preset**: Next.js (should auto-detect)
5. **Root Directory**: Click "Edit" → Select `FrontendNextJs`
6. **Build Command**: `npm run build` (default)
7. **Output Directory**: `.next` (default)
8. Click **"Deploy"** (it will fail first - that's okay, we need to add database)

## Step 4: Create Vercel Postgres Database

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose **"Free tier"** (256 MB storage, 60 compute hours/month)
5. Name it: `rentalux-db`
6. Click **"Create"**
7. Wait for database creation (~1 minute)

## Step 5: Run Database Migration

1. In Vercel Postgres dashboard, click **"Query"** tab
2. Copy the entire contents from your local file: `FrontendNextJs/db/schema.sql`
3. Paste into the query editor
4. Click **"Run"**
5. You should see: "Success" with tables created

To verify:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see: `vehicles` and `reservations`

## Step 6: Connect Database to Project

1. Go to **Storage** → your `rentalux-db` database
2. Click **"Connect"** tab
3. Click **"Connect Project"**
4. Select your Rentalux project
5. Click **"Connect"**

This automatically adds these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 7: Add Clerk Environment Variables

1. Go to your Clerk dashboard: [clerk.com/dashboard](https://dashboard.clerk.com)
2. Select your application (or create one)
3. Go to **API Keys**
4. Copy your keys

In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Add each variable:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
CLERK_SECRET_KEY = sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
```

## Step 8: Add Stripe Environment Variables

1. Go to Stripe dashboard: [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your **Test mode** API keys

In Vercel **Settings** → **Environment Variables**, add:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
```

For webhook secret (we'll add this after deployment):
```
STRIPE_WEBHOOK_SECRET = whsec_...
```

## Step 9: Add App URL

In Vercel **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
```

(Replace with your actual Vercel URL from Step 3)

## Step 10: Redeploy

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"**
5. Click **"Redeploy"**

Or trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin vercel-postgres
```

## Step 11: Set Up Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-project-name.vercel.app/api/webhooks/route`
4. Select events to listen to:
   - `checkout.session.completed`
5. Click **"Add endpoint"**
6. Click on the webhook you just created
7. Click **"Reveal"** next to **Signing secret**
8. Copy the `whsec_...` value

Back in Vercel:
1. **Settings** → **Environment Variables**
2. Update `STRIPE_WEBHOOK_SECRET` with the `whsec_...` value
3. Redeploy again

## Step 12: Update Clerk URLs

1. Go to Clerk Dashboard → Your app → **Paths**
2. Update the following URLs to your Vercel URL:
   - Homepage URL: `https://your-project-name.vercel.app`
   - Sign in URL: `https://your-project-name.vercel.app/sign-in`
   - Sign up URL: `https://your-project-name.vercel.app/sign-up`

## Step 13: Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test the following:
   - ✅ Homepage loads
   - ✅ Sign in/Sign up works (Clerk)
   - ✅ View vehicles page
   - ✅ Create a reservation (as logged-in user)
   - ✅ Admin dashboard (if you have admin role)
   - ✅ Stripe payment flow

## Step 14: Add Sample Data (Optional)

In Vercel Postgres **Query** tab, add some vehicles:

```sql
INSERT INTO vehicles (name, description, retail_price, mileage, vehicle_type, make, images)
VALUES
  ('Tesla Model 3', 'Electric sedan with autopilot', 45000, 15000, 'Sedan', 'Tesla', ARRAY['https://example.com/tesla.jpg']),
  ('Ford Mustang', 'Classic American muscle car', 35000, 25000, 'Coupe', 'Ford', ARRAY['https://example.com/mustang.jpg']),
  ('Toyota Camry', 'Reliable family sedan', 25000, 30000, 'Sedan', 'Toyota', ARRAY['https://example.com/camry.jpg']);
```

## Troubleshooting

### Deployment fails
- Check **Deployments** tab → click on failed deployment → view logs
- Common issues: Missing environment variables

### Database connection errors
- Verify Postgres database is connected to project
- Check environment variables are set

### Clerk auth not working
- Verify Clerk URLs are updated with Vercel URL
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set

### Stripe webhook not firing
- Verify webhook URL is correct
- Check webhook signing secret matches environment variable
- Test with Stripe CLI: `stripe listen --forward-to https://your-url.vercel.app/api/webhooks/route`

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update all URLs (Clerk, Stripe, env vars) to use custom domain

## Monitoring

- **Vercel Analytics**: Enabled by default
- **Error tracking**: Check **Deployments** → **Logs**
- **Database monitoring**: Check Vercel Postgres dashboard for query performance

---

🎉 **You're live!** Your Rentalux app is now running 100% serverless on Vercel for free!
