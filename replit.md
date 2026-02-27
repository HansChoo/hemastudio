# HEMA Studio Portfolio

A React + TypeScript + Vite frontend for HEMA Studio, a Korean creative production studio offering wedding videos, cover recordings, album production, and AI music services.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Backend**: Firebase Cloud Firestore (data storage)
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
│   └── firestore.ts    # Firestore CRUD (portfolios, orders)
├── components/
│   ├── AdminDashboard.tsx      # Admin panel with CRUD for portfolios/orders
│   ├── AdminPasswordModal.tsx  # Password gate for admin access
│   ├── FilterBar.tsx
│   ├── Hero.tsx
│   ├── PaymentModal.tsx
│   ├── PortfolioCard.tsx
│   ├── PortfolioModal.tsx
│   └── ProductPage.tsx
```

## Admin Access

- Admin page accessed via password (set in VITE_ADMIN_PASSWORD env var)
- No user authentication required; admin password gate only
- Click "관리자" button in top nav → enter password → access admin dashboard

## Firebase Setup

- **Firestore Collections**:
  - `portfolios` - Portfolio items (CRUD from admin dashboard)
  - `orders` - Customer orders

### Environment Variables (VITE_ prefix)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_PASSWORD` - Admin dashboard access password

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
