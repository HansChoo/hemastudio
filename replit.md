# HEMA Studio Portfolio

A React + TypeScript + Vite frontend for HEMA Studio, a Korean creative production studio offering wedding videos, cover recordings, album production, and AI music services.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN), Framer Motion for animations
- **Icons**: Lucide React
- **Payments**: Toss Payments widget (CDN)

## Project Structure

```
/
├── index.html          # Entry HTML with Tailwind CDN, importmap, and app entry
├── index.tsx           # React root entry point
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants and data
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── components/
    ├── AdminDashboard.tsx
    ├── FilterBar.tsx
    ├── Hero.tsx
    ├── LoginModal.tsx
    ├── PaymentModal.tsx
    ├── PortfolioCard.tsx
    ├── PortfolioModal.tsx
    └── ProductPage.tsx
```

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
- `index.html`: Uses importmap for React CDN + Toss Payments script
