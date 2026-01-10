# Smart Parking Platform

A production-ready smart parking platform with live maps, real-time slot tracking, and payment integration.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/smart-parking)

## Features

- 🗺️ Live interactive maps with GPS tracking
- 🚗 36 parking slots with real-time availability
- 💳 Stripe payment integration
- 📱 Mobile-first responsive design
- 👨‍💼 Admin dashboard with analytics
- 🤖 AI-powered slot recommendations

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn UI
- Leaflet (Maps)
- Supabase (Backend)
- Stripe (Payments)

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Add your API keys to .env.local

# Run development server
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### Quick Steps:

1. Create Supabase project at https://supabase.com
2. Run SQL schema from DEPLOYMENT.md
3. Add environment variables
4. Deploy to Vercel:
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_MAPBOX_TOKEN` - Mapbox access token

## License

MIT
