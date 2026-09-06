'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { rajasthanPOIs, goaPOIs, keralaPOIs, destinations } from '@/lib/mock-data';
import { POI } from '@/lib/types';
import { getCrowdColor, getCrowdLabel, getVibeColor, getVibeBg, formatCurrency } from '@/lib/utils';
import { Star, MapPin, Clock, Plus, Check, AlertTriangle, ChevronDown } from 'lucide-react';



function CrowdMeter({ level }: { level: 'low' | 'medium' | 'high' }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {['low', 'medium', 'high'].map((l, i) => (
          <div
            key={l}
            className="w-1.5 rounded-full"
            style={{
              height: 6 + i * 2,
              background: ['low', 'medium', 'high'].indexOf(level) >= i ? getCrowdColor(level as 'low' | 'medium' | 'high') : 'var(--color-category-gray-3)',
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: getCrowdColor(level) }}>
        {getCrowdLabel(level)}
      </span>
    </div>
  );
}

function POICard({ poi, isAdded, onAdd }: { poi: POI; isAdded: boolean; onAdd: () => void }) {
  const categoryColors: Record<string, { bg: string; dot: string }> = {
    attraction: { bg: 'var(--color-semantic-attraction-bg)', dot: 'var(--color-semantic-attraction-dot)' },
    activity: { bg: 'var(--color-semantic-activity-bg)', dot: 'var(--color-semantic-activity-dot)' },
    restaurant: { bg: 'var(--color-semantic-restaurant-bg)', dot: 'var(--color-semantic-restaurant-dot)' },
    hotel: { bg: 'var(--color-semantic-hotel-bg)', dot: 'var(--color-semantic-hotel-dot)' },
    location: { bg: 'var(--color-semantic-location-bg)', dot: 'var(--color-semantic-location-dot)' },
  };

  const catColor = categoryColors[poi.category] || categoryColors.attraction;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-lg"
      style={{
        background: 'var(--color-brand-white)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image */}
      <div className="relative w-full sm:w-40 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
        <div className="w-full h-full absolute inset-0" style={{ background: `linear-gradient(135deg, ${catColor.bg}, ${poi.category === 'attraction' ? 'var(--color-atmospheric-warm-lavender)' : 'var(--color-atmospheric-warm-peach)'})` }} />
        <img src={poi.imageUrl} alt={poi.name} className="w-full h-full object-cover relative z-10" loading="lazy" />
        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase flex items-center gap-1"
          style={{ background: catColor.bg, color: catColor.dot, letterSpacing: '0.05em' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor.dot }} />
          {poi.category}
        </div>
        {/* Crowd badge if high */}
        {poi.crowdLevel === 'high' && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
            style={{ background: 'var(--color-semantic-error)', color: 'white' }}>
            <AlertTriangle size={10} /> Very Crowded
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
              {poi.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              <MapPin size={12} />
              <span className="text-xs">{poi.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
            <Star size={12} style={{ color: '#d97706', fill: '#d97706' }} />
            <span className="text-xs font-bold" style={{ color: '#92400e' }}>{poi.rating}</span>
          </div>
        </div>

        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {poi.description}
        </p>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {poi.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CrowdMeter level={poi.crowdLevel} />
            <div className="flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
              <Clock size={12} />
              <span className="text-xs">{poi.estimatedDuration}m</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
              {formatCurrency(poi.cost)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdd}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: isAdded ? 'var(--color-semantic-success)' : 'var(--color-brand-black)',
                color: 'var(--color-brand-white)',
              }}
            >
              {isAdded ? <Check size={16} /> : <Plus size={16} />}
            </motion.button>
          </div>
        </div>

        {/* Overtourism Alternative */}
        {poi.crowdLevel === 'high' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(26,138,92,0.10)', border: '1px solid rgba(26,138,92,0.15)' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1a8a5c' }} />
            <p className="text-xs leading-snug" style={{ color: '#065f46' }}>
              <span className="font-bold">Try quieter alternative — </span>
              {poi.city === 'Jaipur' ? 'Nahargarh quiet trail' : 'Nearby hidden gem'} • 4.7★ • 5 min away • Low crowd 🟢
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function CuratedPlaces() {
  const { state, addToCart, removeFromCart, toggleCart, setCurrentScreen } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [showCount, setShowCount] = useState(12);

  const pois = useMemo(() => {
    let filtered: POI[];
    if (state.destination === 'Goa') {
      filtered = goaPOIs;
    } else if (state.destination === 'Kerala') {
      filtered = keralaPOIs;
    } else {
      filtered = rajasthanPOIs;
    }
    if (filter !== 'all') {
      filtered = filtered.filter(p => p.category === filter);
    }
    return filtered;
  }, [filter, state.destination]);

  const displayPois = pois.slice(0, showCount);

  return (
    <div className="min-h-screen pt-24 pb-8" style={{ background: 'var(--color-surface-3)' }}>
      {/* Sticky Header Capsule */}
      <div className="fixed top-20 left-0 right-0 z-10 flex justify-center px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'var(--color-brand-white)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
            {state.destination ? (destinations.find(d => d.id === state.destination)?.name || state.destination) : 'Rajasthan'}
          </span>
          {state.selectedVibes.slice(0, 2).map((v) => (
            <span key={v} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: getVibeBg(v), color: getVibeColor(v) }}>
              {v}
            </span>
          ))}
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {pois.length} curated places
          </span>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-6">
          <p className="text-caption-uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Curated for you
          </p>
          <h1 className="text-title-lg font-semibold mb-1" style={{ color: 'var(--color-brand-black)' }}>
            Places you&apos;ll love
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Handpicked based on your vibe • Add to your itinerary
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'attraction', 'activity', 'restaurant', 'location'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f ? 'var(--color-brand-black)' : 'var(--color-brand-white)',
                color: filter === f ? 'var(--color-brand-white)' : 'var(--color-text-foreground)',
                border: `1px solid ${filter === f ? 'var(--color-brand-black)' : 'var(--color-hairline-separator-light)'}`,
              }}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* POI Grid */}
        <div className="grid gap-4">
          <AnimatePresence>
            {displayPois.map((poi) => (
              <POICard
                key={poi.poiId}
                poi={poi}
                isAdded={state.cart.some(item => item.poiId === poi.poiId)}
                onAdd={() => {
                  if (state.cart.some(item => item.poiId === poi.poiId)) {
                    removeFromCart(poi.poiId);
                  } else {
                    addToCart(poi);
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {showCount < pois.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowCount(prev => prev + 12)}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
              style={{
                background: 'var(--color-brand-white)',
                border: '1px solid var(--color-hairline-separator-light)',
                color: 'var(--color-brand-black)',
              }}
            >
              <ChevronDown size={14} className="inline mr-1" />
              Show more ({pois.length - showCount} remaining)
            </button>
          </div>
        )}

        {/* Bottom: Explore More + Cart CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: 'transparent',
              color: 'var(--color-accent-blue)',
              textDecoration: 'underline',
            }}
          >
            + Explore more places in {state.destination || 'Rajasthan'}
          </button>

          {state.cart.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentScreen('finalize')}
              className="px-6 py-3 rounded-full text-sm font-medium transition-all"
              style={{
                background: 'var(--color-brand-black)',
                color: 'var(--color-brand-white)',
              }}
            >
              Finalize Itinerary → ({state.cart.length} places)
            </motion.button>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {state.cart.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCart}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-20"
          style={{
            background: 'var(--color-brand-black)',
            color: 'var(--color-brand-white)',
          }}
        >
          <span className="text-sm font-bold">{state.cart.length}</span>
        </motion.button>
      )}
    </div>
  );
}