# TravelAI Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/yugantyadav/Demodemo.git
cd Demodemo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm run dev
```

### 4. Open in browser
http://localhost:3000

## Project Structure
```
Demodemo/
├── src/app/              # Next.js 16 (Turbopack) + Tailwind CSS + Framer Motion
│   ├── page.tsx          # AppRouter (currentScreen routing)
│   ├── globals.css       # Design tokens (brand, surface, atmospheric, semantic)
│   └── frontend/components/
│       ├── ChatHero.tsx          # Landing (hero gradient + floating photos + chat)
│       ├── PreferenceQuiz.tsx    # 6-question quiz (validation required)
│       ├── CircularAnimation.tsx # Weaving animation
│       ├── CuratedPlaces.tsx     # POI grid (filter + crowd meter)
│       ├── CartDrawer.tsx        # Cart (reorder/remove)
│       ├── FinalizeForm.tsx      # Travelers, duration, start city, transport
│       ├── ItineraryView.tsx     # Timeline + Pareto + cost + free-days + book
│       ├── ItineraryCustomizer.tsx # Editor (time/duration, add/remove/reorder)
│       ├── MyItinerary.tsx       # Confirmed trip
│       ├── OperatorConsole.tsx   # Command center (KPIs + dispatch)
│       ├── MapView.tsx           # Leaflet map (dynamic import)
│       ├── TopNav.tsx            # Glass nav
│       └── DevFab.tsx            # Dev FAB (avatar)
├── src/lib/
│   ├── mock-data.ts      # 32 POIs + 5 coordinators + questions
│   ├── app-context.tsx   # State + localStorage + itinerary mutations
│   ├── ga.ts             # GA generator (multi-day, city clustering)
│   └── types.ts          # POI, ItineraryVariant, Coordinator
└── public/
    └── user-avatar.svg   # Avatar for DevFab
```

## Flow
Chat → Quiz → Animation → Places (add to cart) → Finalize (travelers/duration/city/transport) → Itinerary (3 variants, customize, free-days) → My Trip (booked) → Operator (map + tours)

## Notes
- State persists to `localStorage` (`travelai_state`) — refresh restores screen.
- Leaflet map uses OpenStreetMap tiles (no API key).
- Build: `npm run build` must pass before push.
