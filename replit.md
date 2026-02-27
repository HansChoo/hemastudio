# HEMA Studio Portfolio

A React + TypeScript + Vite frontend for HEMA Studio, a Korean creative production studio offering wedding videos, cover recordings, album production, and AI music services.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Backend**: Firebase (Authentication + Cloud Firestore)
- **Styling**: Tailwind CSS (CDN), Framer Motion for animations
- **Icons**: Lucide React
- **Payments**: Toss Payments widget (CDN)

## Project Structure

```
/
├── index.html          # Entry HTML with Tailwind CDN and app entry
├── index.tsx           # React root entry point
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants (categories, image pools)
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── lib/
│   ├── firebase.ts     # Firebase initialization
│   ├── auth.ts         # Authentication (sign in/up/out, onAuthStateChanged)
│   └── firestore.ts    # Firestore CRUD (portfolios, orders)
├── components/
│   ├── AdminDashboard.tsx  # Admin panel with CRUD for portfolios/orders
│   ├── FilterBar.tsx
│   ├── Hero.tsx
│   ├── LoginModal.tsx      # Email/password login with Firebase Auth
│   ├── PaymentModal.tsx
│   ├── PortfolioCard.tsx
│   ├── PortfolioModal.tsx
│   └── ProductPage.tsx
└── scripts/
    └── setup-admin.ts  # Script to create admin account
```

## Firebase Setup

- **Authentication**: Email/password login
- **Firestore Collections**:
  - `portfolios` - Portfolio items (CRUD from admin dashboard)
  - `orders` - Customer orders
  - `users` - User profiles with `isAdmin` flag

### Creating Admin Account

```bash
npx tsx scripts/setup-admin.ts <email> <password> [name]
```

### Environment Variables (VITE_ prefix)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Development

- **Dev server**: `npm run dev` → runs on port 5000 (0.0.0.0)
- **Build**: `npm run build` → outputs to `dist/`
- **Workflow**: "Start application" runs `npm run dev`

## Deployment

Configured as a static site deployment:
- Build: `npm run build`
- Public directory: `dist/`

## Key Configuration

- `vite.config.ts`: Port 5000, `allowedHosts: true` for Replit proxy compatibility
- `index.html`: Tailwind CSS CDN + Toss Payments script
