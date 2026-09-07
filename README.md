# TravelAI — Demodemo

> Personalized Dynamic Tour Planning — Chat-to-itinerary

AI-powered travel planner that turns a chat message into a curated, multi-day, bookable itinerary with real-time operator oversight.

## Architecture

```
src/
├── app/
│   ├── page.tsx                # Main entry (AppRouter with AnimatePresence)
│   ├── layout.tsx              # Root layout, Inter font, metadata
│   ├── globals.css             # Design tokens & global styles (brand, surface, atmospheric, semantic palettes)
│   ├── api/                    # Backend API routes
│   │   ├── cart/route.ts       # Create cart from POI IDs
│   │   ├── crowd/[poiId]/      # Crowd level for a POI
│   │   ├── dispatch/           # Assign coordinator to itinerary
│   │   ├── itinerary/optimize/ # Generate GA itinerary variants
│   │   ├── itinerary/[id]/pareto/ # Pareto frontier analysis
│   │   ├── operator/tours/     # Mock tour management
│   │   ├── rebalance/          # Auto-rebalance disrupted tours
│   │   └── recommend/          # POI recommendations by vibe/budget
│   └── frontend/
│       └── components/
│           ├── ChatHero.tsx          # Landing hero (chat + floating destination photos)
│           ├── PreferenceQuiz.tsx    # Vibe/budget/pace/interest quiz (required validation)
│           ├── CircularAnimation.tsx # Weaving preferences animation
│           ├── CuratedPlaces.tsx     # POI grid (filter, crowd meter, add to cart)
│           ├── CartDrawer.tsx        # Slide-in cart (reorder, remove)
│           ├── FinalizeForm.tsx      # Travelers, duration, start city, transport
│           ├── ItineraryView.tsx     # Day-by-day timeline, Pareto chart, cost breakdown, free-days recommendations
│           ├── ItineraryCustomizer.tsx # Full itinerary editor (add/remove/reorder/time/duration, synced across variants)
│           ├── MyItinerary.tsx       # Confirmed trip view + coordinator
│           ├── OperatorConsole.tsx   # Operator command center (KPI cards, tours, dispatch board)
│           ├── MapView.tsx           # Leaflet map with POI markers (dynamic, SSR disabled)
│           ├── TopNav.tsx            # Glass navigation bar
│           └── DevFab.tsx            # Dev tools FAB (user avatar)
└── lib/
    ├── types.ts            # POI, ItineraryVariant, Coordinator, etc.
    ├── mock-data.ts        # 32 POIs (Rajasthan 16, Goa 8, Kerala 8) with rich fields + 5 coordinators + questions
    ├── app-context.tsx     # Global state + localStorage persistence + itinerary mutations
    ├── ga.ts               # Genetic-algorithm itinerary generator (multi-day distribution, clustering by city)
    └── utils.ts            # formatCurrency, crowd/vibe helpers
public/
└── user-avatar.svg         # User avatar for DevFab
```

## State Persistence

App state (`currentScreen`, `destination`, vibes, budget, pace, interests, cart, itinerary, travelers, duration, startCity, transportMode, devMode, etc.) is persisted to `localStorage` (`travelai_state`) and hydrated on mount. Refreshing at any screen restores the exact state.

## Destinations

- **Rajasthan (16)** — Amber Fort, City Palace, Hawa Mahal, Jal Mahal, Nahargarh, Johari Bazaar, Lassiwala, City Palace Udaipur, Lake Pichola, Saheliyon Ki Bari, Food Walk, Jaisalmer Fort, Desert Safari, Patwon Ki Haveli, Gadisar Lake, Niwas Haveli
- **Goa (8)** — Calangute Beach, Basilica of Bom Jesus, Fort Aguada, Spice Plantation, Anjuna Beach, Dudhsagar Falls, Palolem Beach, Old Goa Heritage Walk
- **Kerala (8)** — Alleppey Houseboat, Munnar Tea Gardens, Periyar Wildlife, Padmanabhaswamy Temple, Kovalam Beach, Wayanad, Fort Kochi, Ayurveda Retreat

Each POI carries: `bestTimeToVisit`, `transportTip`, `proTip`, `nearbyAttractions`, `entryFeeDetails`.

## Features

- Chat → Quiz (required) → Animation → Curated Places → Finalize → Itinerary → My Trip
- Multi-day itinerary (3 variants: Most Relaxed, Balanced, Max Coverage) — POIs clustered by city and distributed across `duration` days
- Itinerary customizer: add/remove/reorder, edit time & duration per slot, synced across variants with cost/experience recalc (Pareto chart live)
- Free-days recommendations → add to itinerary + cart
- Operator console with Leaflet map (34 markers, category colors, popups) + dispatch board
- Page persistence across refresh

## Running

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # production build
```
