# TravelAI — Demodemo

> Personalized Dynamic Tour Planning — Chat-to-itinerary

## Architecture

```
src/
├── app/
│   ├── page.tsx                # Main entry point (AppRouter)
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Global styles & CSS variables
│   ├── favicon.ico             # Favicon
│   ├── api/                    # Backend API routes
│   │   ├── cart/route.ts       # Create cart from POI IDs
│   │   ├── crowd/[poiId]/route.ts  # Crowd level for a POI
│   │   ├── dispatch/route.ts   # Assign coordinator to itinerary
│   │   ├── itinerary/optimize/route.ts  # Generate itinerary variants
│   │   ├── itinerary/[id]/pareto/route.ts  # Pareto frontier analysis
│   │   ├── operator/tours/route.ts  # Mock tour management
│   │   ├── rebalance/route.ts  # Auto-rebalance disrupted tours
│   │   └── recommend/route.ts  # POI recommendations by vibe/budget
│   └── frontend/
│       └── components/         # Frontend React components
│           ├── ChatHero.tsx          # Landing/search hero
│           ├── PreferenceQuiz.tsx    # Vibe/budget/pace quiz
│           ├── CuratedPlaces.tsx     # POI grid for selected destination
│           ├── CircularAnimation.tsx # Visual tour animation
│           ├── ItineraryView.tsx     # Day-by-day itinerary
│           ├── FinalizeForm.tsx      # Booking confirmation
│           ├── MyItinerary.tsx       # User itinerary dashboard
│           ├── OperatorConsole.tsx   # Operator dispatch board
│           ├── TopNav.tsx            # Navigation bar
│           ├── CartDrawer.tsx        # Shopping cart
│           └── DevFab.tsx            # Dev tools fab button
└── lib/
    ├── types.ts            # TypeScript interfaces (POI, Coordinator, etc.)
    ├── mock-data.ts        # POI data for Rajasthan, Goa, Kerala + coordinators
    ├── utils.ts            # Helper functions (formatCurrency, getVibeColor, etc.)
    ├── ga.ts               # Genetic algorithm for itinerary optimization
    ├── placeholder-images.ts # Gradient fallbacks for failed images
    └── app-context.tsx     # React context (global state + localStorage persistence)
```

## State Persistence

App state (`currentScreen`, `destination`, selected vibes, budget, pace, etc.) is persisted to `localStorage` so the app restores the last visited screen on page refresh.

## Destinations

- **Rajasthan** — Amber Fort, City Palace, Hawa Mahal, Jal Mahal, Nahargarh, Jaisalmer Fort, Udaipur Palace, etc.
- **Goa** — Calangute Beach, Basilica of Bom Jesus, Fort Aguada, Spice Plantation, Dudhsagar Falls, Palolem Beach, etc.
- **Kerala** — Alleppey Houseboat, Munnar Tea Gardens, Periyar Wildlife, Padmanabhaswamy Temple, Kovalam Beach, Wayanad, Fort Kochi, Ayurveda Retreat, etc.

## Running

```bash
npm run dev   # Starts on http://localhost:3000
npm run build # Production build
```
