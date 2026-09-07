'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { computeParetoFrontier } from '@/lib/ga';
import { formatCurrency } from '@/lib/utils';
import { rajasthanPOIs, sampleCoordinators } from '@/lib/mock-data';
import { ItineraryVariant, ParetoPoint } from '@/lib/types';
import { MapPin, Clock, Home, Check, Download, Share2, Users, CalendarDays, Plus, Sparkles, Pencil } from 'lucide-react';
import dynamic from 'next/dynamic';

const ItineraryCustomizer = dynamic(() => import('./ItineraryCustomizer'), { ssr: false });

const CONFETTI_COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7'];

const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  x1: (i * 37) % 400 - 200,
  x2: (i * 53) % 400 - 200,
  duration: 2 + (i % 4) * 0.5,
}));

function ParetoChart({ points }: { points: ParetoPoint[] }) {
  const maxCost = Math.max(...points.map(p => p.cost));
  const minCost = Math.min(...points.map(p => p.cost));
  const maxExp = Math.max(...points.map(p => p.experienceScore));
  const minExp = Math.min(...points.map(p => p.experienceScore));

  const rangeCost = maxCost - minCost || 1;
  const rangeExp = maxExp - minExp || 1;

  return (
    <div className="relative h-32"
      style={{ borderLeft: '1px solid var(--color-hairline-separator-light)', borderBottom: '1px solid var(--color-hairline-separator-light)' }}>
      {points.map((p) => {
        const x = ((p.cost - minCost) / rangeCost) * 100;
        const y = ((p.experienceScore - minExp) / rangeExp) * 100;
        return (
          <motion.div
            key={p.variantId}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, bottom: `${y}%` }}
          >
            <div className="w-3 h-3 rounded-full"
              style={{ background: 'var(--color-brand-black)' }} />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ItineraryView() {
  const { state, selectItinerary, setCoordinator, setCurrentScreen, addToCart, setBooked, addBookedTour } = useApp() as any;
  const variants = state.itinerary;
  const [activeVariant, setActiveVariant] = useState<ItineraryVariant | null>(
    () => variants.find((v: ItineraryVariant) => v.id === 'it_balanced') || variants[0] || null
  );
  const [isBooked, setIsBooked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan'|'recommendations'>('plan');
  const [showCustomizer, setShowCustomizer] = useState(false);

  const pareto = useMemo(() => computeParetoFrontier(variants), [variants]);

  // Recommend places to fill free days: nights *2.5 slots vs selected
  const cartIds = new Set(state.cart.map((c:any) => c.poiId));
  const recommendations = useMemo(() => {
    const perDay = 3;
    const capacity = state.duration * perDay;
    const freeSlots = Math.max(0, capacity - state.cart.length);
    if (freeSlots === 0) return [];
    const city = state.destination || 'Rajasthan';
    // filter not in cart, near destination (loose: city contains or fallback)
    let pool = rajasthanPOIs.filter(p => !cartIds.has(p.poiId));
    // prefer same city as destination or Jaipur/Udaipur/Jaisalmer when destination is Rajasthan/Goa fallback
    const destCities = city.toLowerCase().includes('goa') ? ['Jaipur'] : pool.map((p:any)=>p.city);
    pool = pool.sort((a:any,b:any) => {
      const aMatch = destCities.includes(a.city) ? 1 : 0;
      const bMatch = destCities.includes(b.city) ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      return b.rating - a.rating;
    });
    return pool.slice(0, Math.min(6, freeSlots + 2));
  }, [state.cart, state.duration, state.destination]);

  const handleSelectVariant = (id: string) => {
    const v = variants.find((x: ItineraryVariant) => x.id === id);
    if (v) setActiveVariant(v);
    selectItinerary(id);
  };

  const travelLeg = useMemo(() => {
    const start = (state as any).startCity as string;
    const mode = (state as any).transportMode as string;
    const destCity = activeVariant?.days?.[0]?.city || state.destination || 'Jaipur';
    if (!start) return null;
    const s = start.toLowerCase();
    const d = destCity.toLowerCase();
    const pick = (flight: string, train: string, drive: string) => {
      if (mode === 'Train') return { mode: 'Train', duration: train, label: `${start} → ${destCity}` };
      if (mode === 'Private car' || mode === 'Bus') return { mode, duration: drive, label: `${start} → ${destCity}` };
      if (mode === 'Flight') return { mode: 'Flight', duration: flight, label: `${start} → ${destCity}` };
      return { mode: 'Flight', duration: flight, label: `${start} → ${destCity}` };
    };
    if (s.includes('mumbai')) {
      if (d.includes('jaipur')) return { ...pick('2h 15m', '17h', '16h'), distance: '1,150 km' };
      if (d.includes('udaipur')) return { ...pick('1h 55m', '16h', '12h'), distance: '750 km' };
      if (d.includes('jaisalmer')) return { ...pick('2h 30m', '19h', '17h'), distance: '1,050 km' };
      return { ...pick('2h', '16h', '15h'), distance: '~900 km' };
    }
    if (s.includes('delhi')) {
      if (d.includes('jaipur')) return { ...pick('1h 05m', '4h 30m', '5h'), distance: '280 km' };
      if (d.includes('udaipur')) return { ...pick('1h 30m', '12h', '10h'), distance: '650 km' };
      return { ...pick('1h 20m', '6h', '7h'), distance: '~500 km' };
    }
    if (s.includes('bangalore') || s.includes('bengaluru') || s.includes('chennai') || s.includes('kolkata')) {
      return { ...pick('2h 45m', '30h+', '30h+'), distance: '1,800+ km' };
    }
    if (s.includes('pune') || s.includes('hyd')) {
      return { ...pick('2h', '20h', '18h'), distance: '~1,000 km' };
    }
    return { mode: mode || 'Flight', duration: '2h', distance: '~1,000 km', label: `${start} → ${destCity}` };
  }, [state, activeVariant]);

  const handleBook = () => {
    setCoordinator(sampleCoordinators[0]);
    setIsBooked(true);
    setBooked(true);
    try { addBookedTour(); } catch {}
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setCurrentScreen('my-itinerary');
    }, 1200);
  };

  if (!activeVariant || variants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-surface-3)' }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🏰</p>
          <p className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
            No itineraries yet
          </p>
          <button
            onClick={() => setCurrentScreen('places')}
            className="mt-4 px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
            style={{ background: 'var(--color-brand-black)', color: 'white' }}
          >
            Go back to places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8" style={{ background: 'var(--color-surface-3)' }}>
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute"
                initial={{ y: -100, x: p.x1, rotate: 0, opacity: 1 }}
                animate={{ y: 600, x: p.x2, rotate: 360, opacity: 0 }}
                transition={{ duration: p.duration, repeat: Infinity, delay: p.id * 0.1 }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: p.color,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-caption-uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Your personalized journey
          </p>
          <h1 className="text-title-lg font-semibold" style={{ color: 'var(--color-brand-black)' }}>
            {state.destination} — 3 itinerary options
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <Users size={14} />
              {state.travelers.adults} adults
              {state.travelers.children.length > 0 && ` + ${state.travelers.children.length} child(ren)`}
            </div>
            <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <CalendarDays size={14} />
              {state.duration} nights
            </div>
          </div>
        </div>

        {/* Variant Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {variants.map((v: ItineraryVariant) => {
            const isActive = activeVariant?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVariant(v.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
                style={{
                  background: isActive ? 'var(--color-brand-black)' : 'var(--color-brand-white)',
                  color: isActive ? 'white' : 'var(--color-text-foreground)',
                  border: `1px solid ${isActive ? 'var(--color-brand-black)' : 'var(--color-hairline-separator-light)'}`,
                }}
              >
                {v.name}
                {v.id === 'it_balanced' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-semantic-success)', color: 'white' }}>
                    ⭐ Recommended
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowCustomizer(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
            style={{
              background: 'var(--color-accent-blue)',
              color: 'white',
            }}
          >
            <Pencil size={14} />
            Customize
          </button>
        </div>

        {/* Plan / Free-days toggle */}
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setActiveTab('plan')} className="px-5 py-2 rounded-full text-sm font-bold" style={{ background: activeTab==='plan'?'#000':'white', color: activeTab==='plan'?'white':'#000', border: activeTab==='plan'?'1px solid #000':'1px solid #e5e7eb' }}>Your plan</button>
          <button onClick={()=>setActiveTab('recommendations')} className="px-5 py-2 rounded-full text-sm font-bold flex items-center gap-1" style={{ background: activeTab==='recommendations'?'#000':'white', color: activeTab==='recommendations'?'white':'#000', border: activeTab==='recommendations'?'1px solid #000':'1px solid #e5e7eb' }}>
            <Sparkles size={14} /> Free days • {Math.max(0, state.duration - Math.ceil(state.cart.length/3))} nights free
            {recommendations.length>0 && <span className="ml-1 px-2 py-0.5 rounded-full text-xs" style={{ background: '#fef3c7', color: '#92400e' }}>{recommendations.length} suggestions</span>}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Timeline / Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {travelLeg && (
              <div className="rounded-3xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>✈️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black" style={{ color: 'white' }}>Day 0 — Travel from {(state as any).startCity}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.8)' }}>{travelLeg.label} • {travelLeg.mode} • {travelLeg.duration} • {travelLeg.distance}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Auto-generated based on your start point and {(state as any).transportMode || 'preferred'} transport. Check-in after arrival.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: 'white' }}>{travelLeg.duration}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{travelLeg.mode}</p>
                </div>
              </div>
            )}
            {activeTab==='recommendations' ? (
              <div className="rounded-3xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 className="font-bold text-sm mb-1" style={{ color: '#000' }}>Recommended for your {state.duration} nights</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>You picked {state.cart.length} place{state.cart.length!==1?'s':''} — {Math.max(0, state.duration*3 - state.cart.length)} slots still free. Add more to fill your trip near {state.destination}:</p>
                {recommendations.length===0 ? (
                  <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>No more suggestions — you&apos;ve covered it all!</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recommendations.map(poi => {
                      const added = cartIds.has(poi.poiId);
                      return (
                        <div key={poi.poiId} className="rounded-2xl p-3 flex gap-3" style={{ background: 'var(--color-surface-3)' }}>
                          <div className="w-16 h-16 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e0e7ff, #fce7f3)' }} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate" style={{ color: '#000' }}>{poi.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{poi.city} • {poi.estimatedDuration}m • ★{poi.rating}</p>
                            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{poi.description}</p>
                            <button onClick={() => { if(!added) addToCart(poi); }} disabled={added} className="mt-2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: added ? '#22c55e' : '#000', color: 'white', opacity: added?0.7:1 }}>
                              {added ? <><Check size={12}/> Added</> : <><Plus size={12}/> Add to trip</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button onClick={()=>setActiveTab('plan')} className="mt-4 w-full py-2 rounded-full text-sm font-bold" style={{ background: '#000', color: 'white' }}>Back to your plan →</button>
              </div>
            ) : (
              <>
            {activeVariant.days.map((day) => (
              <div key={day.day} className="rounded-3xl p-6"
                style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    Day {day.day} — {day.city}
                  </h2>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <Home size={12} />
                    <span>Hotel: Taj Rambagh (check-in 14:00)</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {day.slots.map((slot, i) => (
                    <motion.div
                      key={`${slot.poiId}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 relative pb-6 last:pb-0"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full relative z-10"
                          style={{ background: 'var(--color-semantic-attraction-dot)' }} />
                        {i < day.slots.length - 1 && (
                          <div className="absolute top-3 bottom-0 w-px"
                            style={{ background: 'var(--color-hairline-separator-light)' }} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                            {slot.time}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase"
                            style={{
                              background: 'var(--color-semantic-attraction-bg)',
                              color: 'var(--color-semantic-attraction-dot)',
                              letterSpacing: '0.05em',
                            }}>
                            {slot.type === 'poi' ? 'Visit' : slot.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                          {slot.poi?.name || 'Transit'}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {slot.duration}m
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {slot.poi?.city}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div className="rounded-2xl p-4" style={{ background: 'var(--color-surface-3)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--color-brand-black)' }}>💡 Pro tip:</span> Most
                itineraries run ~09:00-17:00 with buffer between stops. Crowd levels update live.
              </p>
            </div>
              </>
            )}
          </div>

          {/* Right Rail: Pareto + Summary */}
          <div className="space-y-6">
            {/* Pareto Chart */}
            <div className="rounded-3xl p-6"
              style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 className="text-title-sm font-semibold mb-1" style={{ color: 'var(--color-brand-black)' }}>
                Budget vs Experience
              </h3>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Pareto frontier — no option is cheaper AND better
              </p>
              <ParetoChart points={pareto} />
              <div className="flex justify-between mt-2 text-[10px] uppercase"
                style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                <span>Cost →</span>
                <span>Experience →</span>
              </div>

              <div className="mt-4 space-y-1">
                {variants.map((v: ItineraryVariant) => (
                  <div key={v.id} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg"
                    style={{ background: activeVariant?.id === v.id ? 'var(--color-surface-3)' : 'transparent' }}>
                    <span className="font-medium" style={{ color: 'var(--color-brand-black)' }}>
                      {v.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Exp {v.experienceScore}
                      </span>
                      <span className="font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                        {formatCurrency(v.totalCost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="rounded-3xl p-6"
              style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 className="text-title-sm font-semibold mb-4" style={{ color: 'var(--color-brand-black)' }}>
                Cost Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Activities & Entry</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    {formatCurrency(activeVariant.totalCost * 0.6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Accommodation</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    {formatCurrency(activeVariant.totalCost * 0.3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Transport</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    {formatCurrency(activeVariant.totalCost * 0.1)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between" style={{ borderColor: 'var(--color-hairline-separator-light)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    Total (incl. taxes)
                  </span>
                  <span className="text-title-sm font-bold" style={{ color: 'var(--color-brand-black)' }}>
                    {formatCurrency(activeVariant.totalCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coordinator Card */}
            <div className="rounded-3xl p-6 text-center"
              style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                style={{ background: 'var(--color-atmospheric-warm-peach)' }}>
                👩🏽
              </div>
              <h3 className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                {sampleCoordinators[0].name}
              </h3>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Your AI-matched coordinator • ⭐ {sampleCoordinators[0].rating}
              </p>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {sampleCoordinators[0].languages.map((lang) => (
                  <span key={lang} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: 'var(--color-surface-3)' }}>
                    {lang}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {sampleCoordinators[0].bio}
              </p>
            </div>

            {/* Booking CTA */}
            <div className="rounded-3xl p-6"
              style={{ background: 'var(--color-brand-black)', color: 'white' }}>
              <p className="text-sm opacity-80 mb-1">Price</p>
              <p className="text-display-sm font-black mb-4" style={{ fontFamily: 'var(--font-family-display)', letterSpacing: '-0.06em' }}>
                {formatCurrency(activeVariant.totalCost)}
              </p>
              <button
                onClick={handleBook}
                disabled={isBooked}
                className="w-full h-12 rounded-full text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'white', color: 'var(--color-brand-black)' }}
              >
                {isBooked ? <Check size={16} /> : null}
                {isBooked ? 'Booked!' : 'Book All →'}
              </button>
              <div className="flex justify-center gap-4 mt-4">
                <button className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100 transition-all">
                  <Download size={12} /> PDF
                </button>
                <button className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100 transition-all">
                  <Share2 size={12} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Customizer Modal */}
      <AnimatePresence>
        {showCustomizer && activeVariant && (
          <ItineraryCustomizer variant={activeVariant} onClose={() => setShowCustomizer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}