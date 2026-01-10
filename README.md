# Smart Parking Platform

This project is a Smart Parking and Valet Management system that I built as part of a company assignment and for learning real-world product development.

The idea was to create a system where customers can book parking, drivers can accept and park vehicles, and admins can manage parking locations and slots.

I designed and developed the complete flow myself including the UI, logic, and system behavior.

---

## What this app does

This app simulates how a real parking or valet service works:

- Customers can see parking locations and available slots  
- Customers can request parking for their vehicle  
- Drivers can sign up and log in  
- Drivers can see parking requests and accept them  
- Drivers can park the vehicle and mark it as “Parked”  
- Admins can monitor parking locations and slots  

---

## Features

- Live parking locations with available slots  
- Customer booking system  
- Driver login, signup and request handling  
- Parking status updates (Pending, Accepted, Parked)  
- Admin panel for managing parking data  
- Mobile-friendly interface  

---

## Tech Stack

- React 18  
- Vite  
- Tailwind CSS  
- Leaflet (for maps)  
- Supabase (database and authentication)  
- Stripe (for payments)  

---

## How to run locally

```bash
npm install
cp .env.example .env.local
npm run dev
Deployment

The project can be deployed on Vercel.
See DEPLOYMENT.md for detailed steps.

Basic steps:

Create a Supabase project

Add database schema

Add environment variables

Deploy using:

vercel --prod

Environment Variables

You need the following:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

VITE_STRIPE_PUBLISHABLE_KEY

VITE_MAPBOX_TOKEN

Notes

This project was built for learning and evaluation purposes to demonstrate how a real parking platform could work in production.

License

MIT
