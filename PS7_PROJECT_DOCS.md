# PS7: Personalized Dynamic Tour Planning & Operations Platform

## Project Overview

PS7 is a next-generation travel planning platform that transforms chat-based destination selection into optimized, bookable itineraries with live operator coordination. Built as a hackathon prototype, it demonstrates innovative travel technology integrated with modern web aesthetics and intelligent optimization algorithms.

## Design System

### Visual Theme
- **Primary palette**: OKLCH color space for perceptually uniform colors
- **Background**: `#[fafaf9]` (warm neutral) with `#[0a0a0a]` splash screen
- **Accent**: Gradient `from-teal-600 to-indigo-600` for CTA elements
- **Text**: `#[111]` (near-black) for primary, `#[000]` forced on surfaces for legibility
- **Surface layers**: `surface-1`, `surface-2`, `surface-3` with `#[000]` text color

### Typography
- **Primary font**: Inter (system UI fallback)
- **Secondary**: Circular Std tokens reference
- **Hierarchy**: `text-xs` to `text-4xl` with `font-black` weights
- **Letter tracking**: `tracking-[0.3em]` on uppercase, `tracking-[-0.05em]` on display

### Components
- **Pill-shaped CTAs**: `rounded-full` with `min-h-70px`, `active:scale-98`
- **Surfaces**: `rounded-4xl/7xl` with `bg-white` and `backdrop-blur-xl`
- **Focus rings**: `focus-ring` utility for accessibility
- **Glassmorphism**: `backdrop-blur-xl` with `rgba` overlays

## Screen Flow

### 1. Landing Screen (Screen 0)
**Duration**: 2-second splash animation

```
+------------------------------------------+
|                                          |
|   [PS7 Hackathon]                        | ← Centered pill, static from start
|   PS7                                                                    |
|   TravelAI                                                               |
|                                          |
|   ← White bar grows from left →          | ← Split above/below logo, merges right
|   (lower bar)                                                          |
|                                          |
|   → 2s → Splash exits (slide up + fade)  | → Hero animates in with 0.2s delay
|                                          |
+------------------------------------------+
```

**Animation sequence** (2000ms total):
- **0-500ms**: Logo slides up `y:20→0` + fades in, loading bar starts growing from width 0→100% at bottom
- **0-2000ms**: Splash slides `bottom:0→-100%` + fades `opacity:1→0`
- **200ms delay**: Hero section fades in
- **2000ms**: Splash fully exits, navigation becomes accessible

**Elements**:
- PS7 logo (white, rounded-2xl, text-2xl, shadow-xl) — **fixed center, no movement**
- TravelAI text (uppercase, text-xs, tracking-[0.3em]) — below logo
- White loading bar (h-px, bg-white) — grows from left edge across bottom
- Background: linear-gradient(135deg, #c4e8e0 0%, #e2dfc5 50%, #c8d6e8 100%)

### 2. Chat Hero (Screen 1)
- Animated multi-hue gradient background
- Glass-morphism card with voice input
- Suggestion chips for common queries

### 3. Preference Quiz (Screen 2)
- 6 conversational questions with progress bar
- Covers: vibes, budget, pace, interests, dietary, special needs

### 4. Circular Animation (Screen 3)
- Orbiting preference chips
- Burst dots animation
- Docked capsule header

### 5. Curated Places (Screen 4)
- 16 Rajasthan POIs with real Unsplash images
- Vibe tags with amber rating badges
- Crowd meters (Green/Yellow/Red)
- Overtourism alternatives

### 6. Cart Drawer (Screen 5)
- Slide-in from right (`maxWidth:448px`, `zIndex:60`)
- Draggable reorder
- Live totals display

### 7. Finalize Form (Screen 6)
- Traveler counts, child ages
- Start city selection (Mumbai/Delhi/etc.)
- Transport mode, accommodation type
- Special needs input

### 8. Generated Itinerary (Screen 7)
- **3 GA optimizer variants**: Relaxed/Balanced/Max Coverage
- **Pareto frontier chart**: Cost vs Experience tradeoff
- **Cost breakdown**: Transport, accommodation, entries, guide
- **AI coordinator card**: Suggested operator
- **Confetti on book**: Celebration animation

### 9. My Itinerary (Post-booking)
- **Day 0 travel leg**: Mumbai→Jaipur calculation
  - Flight: 2h15m | Train: 17h | Car: 16h + 1,150km
- **Day-wise timeline** with filler for free days
- **Coordinator contact**: Name, language, rating
- **Total paid**: Itemized breakdown

### 10. Operator Console (Admin)
- **Live tour map**: Pulsing dots for tour locations
- **KPI cards**: Active tours, margin, coordinators, avg rating
- **Dispatch board**: Assign coordinators by language/proximity
- **Crisis mode**: Banner + emergency re-balancing
- **Assign coordinator modal**: Filter by language, load, rating

## Core Innovations

### 1. Travel DNA
- 6-question vibe quiz generates user profile
- Maps to preference categories: relaxation/ adventure/culture/foodie/luxury/budget
- Persisted in app context across screens

### 2. Vibe Matching
- 16 Rajasthan POIs each have:
  - Vibe score (0-100)
  - Color tag (amber, teal, indigo, rose)
  - Icon (MapPin, Sparkles, etc.)
  - Crowd meter (Green/Yellow/Red threshold)
- Alternative suggestions when crowd meter = Red

### 3. Genetic Algorithm Optimizer
- **3 itinerary variants** generated per booking:
  - **Relaxed**: Lower coverage, higher rest time, cheaper
  - **Balanced**: Mixed experience/cost ratio
  - **Max Coverage**: All POIs visited, minimal downtime
- Algorithm minimizes backtracking, respects travel_time constraints
- Each variant has: total cost, duration, satisfaction score

### 4. Pareto Pricing
- **Frontier chart**: Cheapest vs Best Experience tradeoff
- Users can slide to choose preferred balance
- Automatic detection of Pareto-optimal points
- Cost categories: `£` (budget), `££` (moderate), `£££` (premium)

### 5. Rebalancing Engine
- Triggers on: delay, weather, no-show, emergency
- Re-optimizes remaining legs in real-time
- Auto-reassigns coordinators if needed
- Maintains schedule integrity

### 6. Crew Dispatch
- **Operator console** live map with 50+ tour markers
- Assign coordinators by:
  - Language match (user UI language / coordinator language)
  - Proximity to tour location
  - Current load/capacity
  - Rating history
- Crisis mode: instant re-balance + alternate coordinator

### 7. Overtourism Avoidance
- Each POI has crowd meter threshold
- Alternative gems suggested when thresholds exceeded
- Dynamic rerouting based on real-time crowd data
- API: `/api/crowd/:poiId` returns current crowd level

### 8. Operator Command Center
- Live tour map with pulsing dot markers
- Coordinator dispatch board
- KPI dashboard: active tours, margin, avg rating, utilization
- One-click crisis mode with automatic re-balancing
- Coordinator assign modal with filtering

## API Routes (9 endpoints)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/recommend` | POST | POI recommendations based on vibe profile |
| `/api/cart` | POST/GET | Add/remove items, calculate totals |
| `/api/itinerary/optimize` | POST | GA optimization: 3 variants + Pareto |
| `/api/itinerary/:id/pareto` | GET | Pareto frontier data for variant |
| `/api/dispatch` | POST | Assign coordinator to tour |
| `/api/rebalance` | POST | Re-optimize after disruption |
| `/api/operator/tours` | GET | List all active tours |
| `/api/crowd/:poiId` | GET | Real-time crowd level for POI |

All routes return mock data integrated with app context state.

## Technical Stack

- **Framework**: Next.js 16.3.4 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 13
- **Icons**: Lucide React
- **State**: React Context (app-context.tsx)
- **Build**: `npm run build` → static + server components

### Key Files

```
src/
├── app/
│   └── page.tsx          # Root router, screen orchestration
│   └── api/              # 9 mock API routes
├── lib/
│   ├── app-context.tsx   # Global state (screens, cart, itinerary, coordinators)
│   ├── ga.ts             # GA optimizer + Pareto frontier
│   ├── utils.ts          # Currency, vibe/color/icon helpers
│   └── mock-data.ts      # 16 POIs, 3 coordinators, Unsplash URLs
└── components/
    ├── Landing.tsx       # Splash + registration flow
    ├── Logo.tsx          # PS7 + TravelAI logos
    ├── ChatHero.tsx      # Screen 1
    ├── PreferenceQuiz.tsx # Screen 2
    ├── CircularAnimation.tsx # Screen 3
    ├── CuratedPlaces.tsx # Screen 4
    ├── CartDrawer.tsx    # Screen 5
    ├── FinalizeForm.tsx  # Screen 6
    ├── ItineraryView.tsx # Screen 7
    ├── MyItinerary.tsx   # Post-booking view
    ├── OperatorConsole.tsx # Operator command center
    └── DevFab.tsx        # Dev mode N-circle panel
```

## User Flow: Chat → Itinerary → Book

```
Register
  ↓
Chat your destination (e.g., "Jaipur for 3 days")
  ↓
Vibe Quiz (6 questions: budget/pace/interests/dietary/special)
  ↓
Circular Animation (preference visualization)
  ↓
16 Curated Places with crowd meters & alternatives
  ↓
Cart Drawer (reorder, live totals)
  ↓
Finalize Form (travelers, dates, start city, transport, accommodation)
  ↓
GA Optimizer (3 variants: Relaxed/Balanced/Max Coverage)
  ↓
Pareto Frontier (cost vs experience tradeoff)
  ↓
Book → Confetti + AI coordinator assignment
  ↓
My Itinerary (day-wise timeline, travel legs, coordinator contact)
  ↓
Operator Console (live map, dispatch, crisis mode)
```

## Screens Summary

### Landing (page.tsx router entry)
- 2s PS7 splash with TravelAI + loading bar
- Registration form (name/email/phone → localStorage)
- "How it works" accordion (6-step overview)
- Bottom Nav: PS7 pill only (no Map/ShoppingCart icons)

### TopNav
- Left: TravelAI logo pill (`bg:white text:#111`)
- Right: Operator/Traveler toggle button
- Cart count: Floating CTA button (not pill icons)

### Chat Hero
- Animated multi-hue gradient background
- Glass-morphism card with voice input mic icon
- Suggestion chips: "Beach trip", "Mountain hiking", "City break", "Culture tour", "Food adventure", "Wildlife safari"
- Placeholder: "Chat your destination →"

### Preference Quiz
- Progress bar (0%→100% across 6 questions)
- Each question: conversational format
- Example questions:
  1. "What's your travel vibe?" (Relaxed/Adventure/Culture/Foodie/Luxury/Backpacking)
  2. "Budget range?" (Under $500/$500-$1500/$1500+)
  3. "Pace?" (Relaxed/Medium/Full throttle)
  4. "Interests?" (History/Nature/Shopping/Photography/Street food)
  5. "Dietary?" (No restrictions/Vegetarian/Vegan/Gluten-free)
  6. "Special needs?" (None/Mobility assistance/Family with kids)

### Curated Places Grid
- 16 POIs in 4x4 grid
- Each card:
  - Top: Unsplash high-res image (object-cover, rounded-tl-4xl)
  - Middle: Vibe tag (pill, color-coded) + rating badge (amber-4 on #fef3c7)
  - Bottom: Crowd meter (Green/Yellow/Red badge + indicator dots)
  - Bottom-right: "Alternative" badge when crowd=Red
- Hover: lift shadow, image zoom

### Cart Drawer
- Slide-in from right with `transform: translateX(0)` animation
- `max-w-448px`, `z-60`, white panel with shadow
- Header: "Your Cart" + close X
- List of selected POIs with remove buttons
- Summary: Subtotal, Discount (Pareto-aware), Total
- CTA: "Finalize →" button (black pill, min-h-70px)

### Finalize Form
- Horizontal layout: two columns on desktop, stacked on mobile
- Fields:
  - **Travelers**: Number input (adults/children)
  - **Child ages**: Comma-separated list
  - **Start city**: Dropdown (Mumbai, Delhi, Bengaluru, Chennai, Kolkata)
  - **Transport mode**: Radio (Flight/Train/Car)
  - **Accommodation**: Star rating selector (3*/4*/5*)
  - **Special needs**: Textarea
- Numbers forced `color:#000` on `surface-3`
- Start city + transport mode persisted in context

### Itinerary View
- **Variant tabs**: Relaxed / Balanced / Max Coverage
- **Pareto chart**: Canvas-based, shows cost (x-axis) vs experience score (y-axis)
- **Cost breakdown**:
  - Transport: $X
  - Accommodation: $X/night × X nights
  - Entry fees: $X
  - Guide: $X
  - **Total: $X**
- **AI coordinator card**: Photo, language, rating, "Assign" button
- **Book button**: Confetti on click, transitions to My Itinerary

### My Itinerary
- **Day 0 travel leg**: Mumbai→Jaipur
  - Mode options: Flight (2h15m), Train (17h), Car (16h + 1,150km)
  - Auto-calculated from start city + transport mode
- **Day-wise timeline**:
  - Day 1: AM - POI A, PM - POI B, Evening - dinner
  - Day 2: Free day + optional activities
  - Day 3: Departure leg
- **Free-day filler**: Suggested optional activities
- **Coordinator contact**: Phone, language, rating, "Chat" button
- **Total paid**: Bold summary at bottom

### Operator Console
- **Live map**: Canvas with pulsing dot markers for each tour
- **KPI cards** (top row):
  - Active tours (number + trend arrow)
  - Margin (%) + $ value
  - Coordinators (count + utilization %)
  - Average rating (⭐ 4.8/5.0)
- **Dispatch board**: List of available coordinators with assign buttons
- **Crisis banner**: Red, appears on no-show/weather delay
- **Assign coordinator modal**:
  - Filter: Language, Load, Rating
  - Search by name
  - Confirmation before assign

## Dev Mode

- **DevFab**: Black "N" circle fixed bottom-left
- **Functions**:
  - Jump to any screen via number input
  - Show current state dump (JSON)
  - Reset app to landing state
  - Disable dev mode (removes N-circle)
- **Useful for**: Testing all screens, resetting user data, debugging API routes

## Design Refinements & Polishing

### Recent Fixes
1. **Green alternative badge text contrast**: Changed from muted `var(--color-category-amber-6)` to bold `#92400e` on `#fef3c7` background for readability
2. **Rating visibility**: Same fix - bold text on light background
3. **Mumbai→Jaipur travel leg**: Auto-calculation now works (Flight 2h15m/Train 17h/Car 16h + 1,150km)
4. **Start city + transport mode persistence**: Saved in context, survives screen transitions
5. **Number legibility**: All number displays (adults/nights spans, labels) forced `color:#000` on `surface-3`
6. **TopNav cleanup**: Removed Map/ShoppingCart icons from pill; clean "TravelAI" + "PS7 Hackathon" pill only
7. **Splash timing**: 2s timeout (was 2.5s), pure opacity + scale animation, no y-jitter
8. **Bar animation**: White bar grows from left edge at bottom of splash, logo stays fixed center

### Accessibility
- All pill buttons: `min-h-70px`, `active:scale-98`, disabled `opacity-30`
- Focus rings via `focus-ring` utility on interactive elements
- Color contrast: Minimum 4.5:1 for text/background combinations
- Screen reader: Landmark regions, descriptive alt text on icons
- Keyboard navigation: Tab order through all form elements, Enter/Space activates

### Dark Mode
- Currently light-only theme
- Tokens prepared for `.dark` class addition:
  - `color-foreground-dark`: `#[fafaf9]`
  - `surface-1/2` remaps for dark surface colors
  - Accent gradients adjusted for dark mode
- Would need: `@media (prefers-color-scheme: dark)` or manual toggle

## Deployment

### Build Commands
```bash
npm run build     # Static + server build
npm run dev       # Dev server with Turbopack (localhost:3000)
npm run lint      # ESLint check
```

### Environment
- Development: `localhost:3000` (hard refresh Cmd+Shift+R after changes)
- Production: `next start` or Vercel deployment
- All 9 API routes function as mock endpoints integrated with context state

### Next Steps for Production
1. Replace mock API routes with real backend endpoints
2. Integrate actual Unsplash API with proper attribution
3. Implement GA optimizer with real constraint solving
4. Add user authentication + persistent itineraries
5. Deploy operator console with real-time WebSocket updates
6. Add dark mode toggle with full token support
7. Implement email/ SMS notification system
8. Add payment integration for booking flow