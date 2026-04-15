# FitMeal

AI-powered nutrition, gym coaching, and food delivery platform built with React + TypeScript.

## Features

- **AI Diet Plans** — Personalized meal plans based on BMI, medical conditions, and fitness goals
- **Restaurants & Cloud Kitchens** — Order from 10+ partner restaurants or 3 macro-tracked delivery-only kitchens
- **Gym Instructors** — Browse 8+ verified coaches filtered by gender, specialty, and experience; book and pay via Razorpay
- **Nutritionist Chat** — Real-time consultation with certified nutritionists
- **Admin Dashboard** — Restaurant owners and gym instructors manage listings, pricing, and analytics
- **Razorpay Payments** — Secure checkout for food orders and coaching sessions (test mode; swap key for production)

## Tech Stack

- **React 18** + **TypeScript 5** (strict mode)
- **Vite 5** + **SWC** for fast builds
- **Tailwind CSS 3** + **shadcn/ui** (Radix primitives)
- **TanStack React Query v5** for server state
- **React Hook Form** + **Zod** for forms and validation
- **React Router v6** for routing
- **Razorpay** for payments (test mode)
- **localStorage** API layer (ready to swap to Supabase / Express)

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:8080`.

## Payment Setup

Replace the test key in [`src/lib/api.ts`](src/lib/api.ts):

```ts
key: "rzp_test_placeholder_key",  // replace with your Razorpay key_id
```

Get your key from the [Razorpay Dashboard](https://dashboard.razorpay.com/).

## Project Structure

```
src/
├── components/       # Shared UI components (Navigation, shadcn/ui)
├── pages/            # Route-level components
│   ├── Landing.tsx
│   ├── BMIAssessment.tsx
│   ├── Restaurants.tsx      # + Cloud Kitchens
│   ├── GymInstructors.tsx
│   ├── AdminDashboard.tsx
│   ├── Nutritionist.tsx
│   └── Orders.tsx
├── lib/
│   └── api.ts        # Service layer (localStorage-backed, swappable)
├── types/
│   └── index.ts      # Shared TypeScript interfaces
└── index.css         # Design system tokens
```

## License

MIT © DAALI24
