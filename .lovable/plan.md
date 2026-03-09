

## Fix RovingFocusGroup Error + Build Stripe Subscription Flow

### 1. Fix RovingFocusGroup Error

The error comes from a Radix UI version incompatibility -- `@radix-ui/react-tabs` (v1.1.12) internally uses `RovingFocusGroup`, and a mismatch between Radix package versions causes the context to break even though no page directly uses the Tabs component. The fix is to **upgrade `@radix-ui/react-tabs` to the latest version** (matching the other Radix packages at their latest) to resolve the internal dependency conflict.

### 2. Database Migration: `subscriptions` Table

Create a `subscriptions` table:
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, NOT NULL, references auth.users ON DELETE CASCADE)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text, UNIQUE)
- `plan` (text, default 'pro')
- `status` (text, default 'active') -- active, canceled, past_due
- `current_period_start` (timestamptz)
- `current_period_end` (timestamptz)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

RLS: Users can SELECT their own subscription (`auth.uid() = user_id`). Service role handles inserts/updates from edge functions.

Add an `update_updated_at` trigger on this table.

### 3. Edge Functions

**`create-checkout-session`** (`supabase/functions/create-checkout-session/index.ts`)
- Accepts `{ priceId }` in POST body
- Extracts user from JWT (Authorization header)
- Creates/retrieves Stripe customer by email
- Creates a Stripe Checkout session (mode: subscription, success_url, cancel_url)
- Returns `{ url }` for redirect
- `verify_jwt = false` in config.toml (manual JWT validation in code)

**`stripe-webhook`** (`supabase/functions/stripe-webhook/index.ts`)
- `verify_jwt = false`
- Receives raw body, verifies Stripe signature (using STRIPE_WEBHOOK_SECRET -- will need to add this secret)
- Handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- On checkout complete: upsert into `subscriptions` table using service role client
- On update/delete: update status accordingly

**`manage-subscription`** (`supabase/functions/manage-subscription/index.ts`)
- Accepts POST, extracts user from JWT
- Looks up `stripe_customer_id` from subscriptions table
- Creates Stripe Customer Portal session
- Returns `{ url }`

### 4. Frontend Changes

**`src/hooks/useSubscription.ts`** (new)
- Queries `subscriptions` table for current user
- Returns `{ subscription, loading, isProUser }` 

**`src/pages/Pricing.tsx`** (update)
- Replace current static pricing page with dynamic version
- Pro plan button calls `create-checkout-session` edge function and redirects to Stripe
- Free plan button links to `/auth`
- Enterprise button links to `/contact`
- No Radix Tabs or RovingFocusGroup -- uses simple Cards (already the case)

**`src/pages/SubscriptionSuccess.tsx`** (new)
- Simple success page with confetti-style messaging, link back to dashboard

**`src/pages/SubscriptionCancel.tsx`** (new)
- Simple cancel page with link back to pricing

**`src/App.tsx`** (update)
- Add routes for `/subscription/success` and `/subscription/cancel`

**`src/pages/Dashboard.tsx`** (update)
- Show subscription status badge (Free/Pro) using `useSubscription` hook

### 5. Secrets Needed

- `STRIPE_API_KEY` -- already exists
- `STRIPE_WEBHOOK_SECRET` -- **needs to be added** (user will need to configure webhook in Stripe dashboard pointing to the `stripe-webhook` edge function URL, then paste the webhook signing secret)

### 6. Config Updates

**`supabase/config.toml`** -- add entries for all three new edge functions with `verify_jwt = false`

### Implementation Order

1. Fix Radix version (upgrade `@radix-ui/react-tabs`)
2. Create `subscriptions` table migration
3. Deploy `create-checkout-session` edge function
4. Deploy `stripe-webhook` edge function  
5. Deploy `manage-subscription` edge function
6. Add `STRIPE_WEBHOOK_SECRET` secret
7. Create `useSubscription` hook
8. Update Pricing page with checkout flow
9. Create success/cancel pages + routes
10. Update Dashboard with subscription status

