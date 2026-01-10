# Production Deployment Guide

## Prerequisites

You'll need accounts for:
1. **Supabase** (database + auth) - https://supabase.com
2. **Stripe** (payments) - https://stripe.com  
3. **Mapbox** (maps) - https://mapbox.com
4. **Vercel** (hosting) - https://vercel.com

All have free tiers sufficient for MVP.

---

## Step 1: Supabase Setup

### Create Project
1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and region
4. Set database password (save this!)

### Run SQL Schema
Copy and paste this into SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parking Locations
CREATE TABLE parking_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  total_spots INTEGER NOT NULL,
  available_spots INTEGER NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  amenities JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parking Spots
CREATE TABLE parking_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES parking_locations(id),
  spot_number TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_ev_charging BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES parking_locations(id),
  spot_id UUID REFERENCES parking_spots(id),
  vehicle_number TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE parking_spots;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Insert demo data
INSERT INTO parking_locations (name, address, city, latitude, longitude, total_spots, available_spots, hourly_rate, amenities) VALUES
('Phoenix Market City', 'Viman Nagar, Pune', 'Pune', 18.5679, 73.9143, 500, 45, 40, '{"evCharging": true, "covered": true, "security": true}'),
('Seasons Mall', 'Hadapsar, Pune', 'Pune', 18.5018, 73.9263, 300, 12, 30, '{"covered": true, "security": true}'),
('Pune Airport', 'Lohegaon, Pune', 'Pune', 18.5821, 73.9197, 1000, 150, 60, '{"evCharging": true, "covered": true, "security": true, "valet": true}');
```

### Get API Keys
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (for admin operations)

---

## Step 2: Environment Variables

Create `.env.local` in your project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Mapbox
VITE_MAPBOX_TOKEN=pk.xxx
```

---

## Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js @stripe/stripe-js stripe
```

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... add all env vars
```

### Option B: Vercel Dashboard
1. Go to https://vercel.com
2. Click "New Project"
3. Import from Git
4. Add environment variables in settings
5. Deploy

---

## Step 5: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret
5. Add to environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 6: Test Production

1. Visit your Vercel URL
2. Create account
3. Search for parking
4. Make a booking
5. Complete payment
6. Verify in Supabase dashboard

---

## Monitoring

- **Supabase**: Check Database → Tables for live data
- **Stripe**: Check Payments → All payments
- **Vercel**: Check Deployments → Logs

---

## Cost Estimates (Monthly)

- Supabase Free: $0 (up to 500MB database, 50K auth users)
- Stripe: $0 + 2.9% + $0.30 per transaction
- Mapbox Free: $0 (up to 50K map loads)
- Vercel Free: $0 (100GB bandwidth)

**Total: $0/month** for MVP with moderate traffic!

---

## Support

- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Vercel Docs: https://vercel.com/docs
