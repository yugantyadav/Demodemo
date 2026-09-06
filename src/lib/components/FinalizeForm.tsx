'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadGAItineraries } from '@/lib/ga';
import { useApp } from '@/lib/app-context';

export default function FinalizeForm() {
  const { state, setCurrentScreen, setItinerary, setTravelers, setDuration, setStartCity, setTransportMode: setCtxTransportMode } = useApp() as any;
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState<{ age: number }[]>([]);
  const [nights, setNights] = useState(5);
  const [startCity, setLocalStartCity] = useState(state.startCity || '');
  const [isBusinessTrip, setIsBusinessTrip] = useState(false);
  const [busyDays, setBusyDays] = useState<number[]>([]);
  const [accommodationPreference, setAccommodationPreference] = useState('');
  const [transportMode, setTransportMode] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addChild = () => {
    if (children.length < 4) {
      setChildren(prev => [...prev, { age: 8 }]);
    }
  };

  const removeChild = (index: number) => {
    setChildren(prev => prev.filter((_, i) => i !== index));
  };

  const setChildAge = (index: number, age: number) => {
    setChildren(prev => prev.map((c, i) => i === index ? { age } : c));
  };

  const toggleBusyDay = (day: number) => {
    setBusyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTravelers({ adults, children });
    setDuration(nights);
    setStartCity(startCity);
    setCtxTransportMode(transportMode);

    setTimeout(() => {
      const variants = loadGAItineraries(state.cart.map((item:any) => item.poi));
      setItinerary(variants);
      setIsGenerating(false);
      setCurrentScreen('itinerary');
    }, 2500);
  };

  const inputBase = {
    background: 'var(--color-surface-3)',
    border: '1px solid var(--color-hairline-separator-light)',
    color: 'var(--color-text-foreground)',
    fontFamily: 'var(--font-family-sans)',
  };

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-accent-blue)';
    e.currentTarget.style.borderColor = 'transparent';
  };

  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.borderColor = 'var(--color-hairline-separator-light)';
  };

  return (
    <div className="min-h-screen pt-20 pb-8" style={{ background: 'var(--color-surface-3)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-caption-uppercase mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Almost there
          </motion.p>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-title-lg font-semibold"
            style={{ color: 'var(--color-brand-black)' }}
          >
            Finalize your {state.destination} trip
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {state.cart.length} places curated for you
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-6 sm:p-8 space-y-8"
          style={{
            background: 'var(--color-brand-white)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Travelers */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>Who&apos;s traveling?</h2>
            <div className="flex items-center justify-between p-4 rounded-2xl"
              style={{ background: 'var(--color-surface-3)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#000' }}>Adults</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>18+ years</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full font-bold flex items-center justify-center transition-all active:scale-95"
                  style={{ background: 'var(--color-brand-black)', color: 'white' }}
                >
                  −
                </button>
                <span className="text-title-md font-semibold w-6 text-center" style={{ color: '#000' }}>{adults}</span>
                <button
                  onClick={() => setAdults(prev => Math.min(12, prev + 1))}
                  className="w-8 h-8 rounded-full font-bold flex items-center justify-center transition-all active:scale-95"
                  style={{ background: 'var(--color-brand-black)', color: 'white' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="mt-3 space-y-2">
              {children.map((child, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: 'var(--color-surface-3)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#000' }}>Child {index + 1}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>0-17 years</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={child.age}
                      onChange={(e) => setChildAge(index, parseInt(e.target.value))}
                      className="px-3 py-1.5 rounded-full text-sm outline-none"
                      style={inputBase}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    >
                      {[...Array(18)].map((_, i) => (
                        <option key={i} value={i}>{i} year{i !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeChild(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ color: 'var(--color-semantic-error)', background: 'white' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {children.length < 4 && (
                <button
                  onClick={addChild}
                  className="w-full p-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-1 transition-all hover:opacity-80"
                  style={{
                    background: 'transparent',
                    border: '1px dashed var(--color-hairline-separator-light)',
                    color: 'var(--color-accent-blue)',
                  }}
                >
                  + Add child
                </button>
              )}
            </div>
          </div>

          {/* Starting City */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>Where are you starting your trip?</h2>
            <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: 'var(--color-surface-3)' }}>
              <span className="text-lg">📍</span>
              <input
                value={startCity}
                onChange={(e)=>setLocalStartCity(e.target.value)}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--color-text-foreground)' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>We’ll calculate travel time & transport from here to {state.destination || 'destination'}</p>
          </div>

          {/* Duration */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>How long?</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl" style={{ background: 'var(--color-surface-3)' }}>
                <label className="text-xs mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                  Arrival date
                </label>
                <input type="date" className="w-full text-sm outline-none bg-transparent"
                  style={{ color: 'var(--color-text-foreground)' }} />
              </div>
              <div className="p-4 rounded-2xl" style={{ background: 'var(--color-surface-3)' }}>
                <label className="text-xs mb-2 block" style={{ color: 'var(--color-text-muted)' }}>
                  Night(s)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNights(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-full font-bold flex items-center justify-center"
                    style={{ background: 'var(--color-brand-black)', color: 'white' }}
                  >
                    −
                  </button>
                  <span className="text-title-sm font-semibold w-8 text-center" style={{ color: '#000' }}>{nights}</span>
                  <button
                    onClick={() => setNights(prev => Math.min(30, prev + 1))}
                    className="w-7 h-7 rounded-full font-bold flex items-center justify-center"
                    style={{ background: 'var(--color-brand-black)', color: 'white' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Business Trip */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-title-sm font-semibold" style={{ color: '#000' }}>Is this a business trip?</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  We&apos;ll plan around your work schedule
                </p>
              </div>
              <button
                onClick={() => setIsBusinessTrip(prev => !prev)}
                className="relative w-12 h-6 rounded-full transition-all"
                style={{
                  background: isBusinessTrip ? 'var(--color-semantic-success)' : 'var(--color-category-gray-4)',
                }}
              >
                <motion.div
                  animate={{ x: isBusinessTrip ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white"
                />
              </button>
            </div>

            <AnimatePresence>
              {isBusinessTrip && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4"
                >
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Which days are you busy? We&apos;ll plan around them.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleBusyDay(day)}
                        className="w-9 h-9 rounded-full text-sm font-medium transition-all active:scale-95"
                        style={{
                          background: busyDays.includes(day) ? 'var(--color-semantic-error)' : 'var(--color-surface-3)',
                          color: busyDays.includes(day) ? 'white' : 'var(--color-text-foreground)',
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accommodation */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>Staying style</h2>
            <div className="flex flex-wrap gap-2">
              {['Hotel', 'Boutique stay', 'Hostel', 'Heritage stay', 'Mix'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAccommodationPreference(opt)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                  style={{
                    background: accommodationPreference === opt ? 'var(--color-brand-black)' : 'var(--color-surface-3)',
                    color: accommodationPreference === opt ? 'white' : 'var(--color-text-foreground)',
                    border: `1px solid ${accommodationPreference === opt ? 'var(--color-brand-black)' : 'var(--color-hairline-separator-light)'}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>Getting around</h2>
            <div className="flex flex-wrap gap-2">
              {['Flight', 'Train', 'Private car', 'Bus', 'Mix'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTransportMode(opt)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                  style={{
                    background: transportMode === opt ? 'var(--color-brand-black)' : 'var(--color-surface-3)',
                    color: transportMode === opt ? 'white' : 'var(--color-text-foreground)',
                    border: `1px solid ${transportMode === opt ? 'var(--color-brand-black)' : 'var(--color-hairline-separator-light)'}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <h2 className="text-title-sm font-semibold mb-4" style={{ color: '#000' }}>Anything else?</h2>
            <textarea
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="Dietary, accessibility, must-sees... We'll keep them in mind."
              rows={3}
              className="w-full p-4 rounded-2xl text-sm outline-none transition-all resize-none"
              style={inputBase}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 rounded-full text-base font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            style={{
              background: 'linear-gradient(135deg, var(--color-atmospheric-hero-gradient-start), var(--color-atmospheric-hero-gradient-end))',
              color: 'var(--color-brand-black)',
            }}
          >
            {isGenerating ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⚙️
                </motion.span>
                Optimizing your perfect days...
              </>
            ) : (
              <>
                ✨ Create My Itinerary
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}