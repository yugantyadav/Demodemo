'use client';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { formatCurrency } from '@/lib/utils';
import { sampleCoordinators } from '@/lib/mock-data';
import { MapPin, Clock, Home, Phone, Mail, CalendarDays, Users, Star, Download, Share2 } from 'lucide-react';

export default function MyItinerary() {
  const { state, setCurrentScreen } = useApp();
  const variant = state.itinerary.find(v => v.id === state.selectedItineraryId) || state.itinerary[0];
  const coord = state.coordinator || sampleCoordinators[0];

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface-3)' }}>
        <div className="text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No booked trip yet</p>
          <button onClick={() => setCurrentScreen('places')} className="mt-4 px-5 py-2 rounded-full text-sm text-white" style={{ background: '#000' }}>Explore places</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10" style={{ background: 'var(--color-surface-3)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-3xl p-6 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #000 0%, #2a2a2a 100%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest opacity-60">Confirmed • Booking #{Math.random().toString(36).slice(2,7).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-black" style={{ letterSpacing: '-0.03em' }}>Your {state.destination} trip is ready! 🎉</h1>
          <p className="text-sm opacity-60 mt-1">{variant.name} • {state.duration} nights • {state.travelers.adults} adults{state.travelers.children.length ? ` + ${state.travelers.children.length} child` : ''} • {formatCurrency(variant.totalCost)} paid</p>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'white', color: '#000' }}><Download size={12} className="inline mr-1" />PDF</button>
            <button className="px-4 py-2 rounded-full text-xs font-semibold bg-white/15"> <Share2 size={12} className="inline mr-1" />Share</button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {(state as any).startCity && (
              <div className="rounded-3xl p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>✈️</div>
                <div>
                  <p className="text-sm font-black" style={{ color: 'white' }}>Starting from {(state as any).startCity} → {variant.days[0]?.city || state.destination}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{(state as any).transportMode || 'Flight'} • Auto-calculated travel time included • Reach by Day 1 morning</p>
                </div>
              </div>
            )}
            {variant.days.map((day) => (
              <div key={day.day} className="rounded-3xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold" style={{ color: '#000' }}>Day {day.day} — {day.city}</h2>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><Home size={12} /> Taj Rambagh • 14:00</span>
                </div>
                <div className="space-y-4">
                  {day.slots.map((slot, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#0d9488' }} />
                        {i < day.slots.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#eee' }} />}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>{slot.time}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase" style={{ background: '#d9f5ed', color: '#2d9a6f' }}>Visit</span>
                        </div>
                        <p className="text-sm font-bold mt-1" style={{ color: '#000' }}>{slot.poi?.name}</p>
                        <p className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}><Clock size={11} />{slot.duration}m <MapPin size={11} />{slot.poi?.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Fill remaining nights */}
            {variant.days.length < state.duration && (
              <div className="rounded-3xl p-6 border-2 border-dashed" style={{ borderColor: '#e5e7eb', background: 'white' }}>
                <p className="text-sm font-bold" style={{ color: '#000' }}>Free days • {state.duration - variant.days.length} nights still open</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Add recommendations from the list on the right to fill your itinerary</p>
                <button onClick={() => setCurrentScreen('itinerary')} className="mt-3 px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ background: '#000' }}>Browse recommendations →</button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 className="font-bold mb-3" style={{ color: '#000' }}>Travel party</h3>
              <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}><Users size={14} /> {state.travelers.adults} adults{state.travelers.children.length ? `, ${state.travelers.children.length} children` : ''}</p>
              <p className="text-sm flex items-center gap-2 mt-1" style={{ color: 'var(--color-text-muted)' }}><CalendarDays size={14} /> {state.duration} nights • {state.destination}</p>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#eee' }}>
                <p className="text-xs font-bold mb-2" style={{ color: '#000' }}>Your coordinator</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#ffead3' }}>👩🏽</div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#000' }}>{coord.name}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><Star size={11} style={{ fill: '#d97706', color: '#d97706' }} />{coord.rating} • {coord.languages.slice(0,2).join(', ')}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1" style={{ background: '#000', color: 'white' }}><Phone size={12} /> Call</button>
                  <button className="flex-1 py-2 rounded-full text-xs font-semibold" style={{ background: '#f5f5f5' }}><Mail size={12} className="inline mr-1" />Message</button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-6 text-white" style={{ background: '#000' }}>
              <p className="text-xs opacity-60">Total paid</p>
              <p className="text-3xl font-black mt-1">{formatCurrency(variant.totalCost)}</p>
              <p className="text-xs opacity-60 mt-2">Need help? Contact support 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
