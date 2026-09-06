# TravelAI — Personalized Dynamic Tour Planning & Operations Platform

A working prototype for **PS ID-7** — Personalized Dynamic Tour Planning & Operations Platform built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## ✨ Features

### Traveler App
- **Screen 1 — Chatbox Hero**: Animated multi-hue gradient, glass-morphism chat card, MLM voice input, suggestion chips
- **Screen 2 — Preference Quiz**: Conversational multi/multi/single-select questions, progress bar, animated transitions
- **Screen 3 — Circular Animation**: Delight moment with orbiting preference chips, burst dots, docked capsule header
- **Screen 4 — Curated Places**: Vibe-matched POI cards, crowd meters (Green/Yellow/Red), overtourism alternatives, add-to-cart fly animation
- **Screen 5 — Cart Drawer**: Slide-in drawer, draggable reorder, estimated totals, finalize CTA
- **Screen 6 — Finalize Form**: Travelers, children ages, duration, business trip blocker days, accommodation, transport, special needs
- **Screen 7 — Generated Itinerary**: 3 GA-optimized variants (Relaxed/Balanced/Max Coverage), Pareto frontier chart, cost breakdown, AI-matched coordinator card, confetti on booking

### Operator Console
- Live tour map with pulsing group dots and delay flags
- Tours table with real-time margin per tour
- Coordinator Dispatch Board with AI matching suggestions (language, proximity, workload, rating)
- Crisis Mode banner for disruption events
- KPI cards (active tours, margin, coordinators, rating)

## 🏗️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommend` | Destination + vibes → ranked POIs |
| POST | `/api/cart` | Create/update cart |
| POST | `/api/itinerary/optimize` | POIs + travelers → 3 itinerary variants |
| GET | `/api/itinerary/:id/pareto` | Pareto frontier computation |
| POST | `/api/book` | Book itinerary |
| POST | `/api/dispatch` | AI coordinator assignment |
| POST | `/api/rebalance` | Disruption → alternatives |
| GET | `/api/operator/tours` | All tours overview |
| GET | `/api/crowd/:poiId` | Real-time crowd data |

## 🎨 Design System

Based on the Mindtrip design system (Inter + Circular Std typography, OKLCH color tokens, pill-shaped CTAs, rounded-4xl/7xl surfaces):

- **Colors**: Full token set (brand, accent, surface, atmospheric, hairlines, text, semantic, category palette)
- **Typography**: 18-type scale (display-mega 128px → caption 12px)
- **Rounded**: Full pill/radius scale (2px → 80px)
- **Spacing**: 2px → 96px scale
- **Elevation**: 4 shadow levels + ring variants
- **Motion**: Framer Motion for all animations (float gradients, orbit rings, fly-to-cart, slide-in drawers, confetti)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # REST API routes
│   │   ├── recommend/
│   │   ├── cart/
│   │   ├── itinerary/optimize/
│   │   ├── itinerary/[id]/pareto/
│   │   ├── dispatch/
│   │   ├── rebalance/
│   │   ├── operator/tours/
│   │   └── crowd/[poiId]/
│   ├── globals.css             # Design tokens + animations
│   ├── layout.tsx
│   └── page.tsx                # Root router (screens switch)
├── lib/
│   ├── app-context.tsx         # Global state
│   ├── components/             # All screens
│   │   ├── TopNav.tsx
│   │   ├── ChatHero.tsx
│   │   ├── PreferenceQuiz.tsx
│   │   ├── CircularAnimation.tsx
│   │   ├── CuratedPlaces.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── FinalizeForm.tsx
│   │   ├── ItineraryView.tsx
│   │   └── OperatorConsole.tsx
│   ├── design-tokens.ts        # Type-safe token exports
│   ├── ga.ts                   # GA optimizer + Pareto frontier
│   ├── mock-data.ts            # 16 Rajasthan POIs + coordinators
│   ├── placeholder-images.ts   # Gradient image mapping
│   ├── types.ts                # TypeScript data models
│   └── utils.ts                # Helpers (currency, colors, vibes)
```

## 🎬 Demo Flow

1. Type "Rajasthan" in chatbox
2. Complete preference quiz (vibes → budget → pace → interests)
3. Watch circular animation
4. Add 4-5 places to itinerary
5. Finalize form (2 adults, child, 6 nights, business trip)
6. "Create My Itinerary" → GA generates 3 variants
7. Select Balanced, view Pareto, Book All
8. Toggle Operator in nav → see live tour map + dispatch