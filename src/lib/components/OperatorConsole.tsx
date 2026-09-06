'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { AlertTriangle, Radio, X, UserPlus } from 'lucide-react';

interface Tour {
  id: string;
  customer: string;
  destination: string;
  dates: string;
  status: 'active' | 'arriving' | 'planning' | 'completed';
  margin: number;
  coordinator: string;
  nextAction: string;
  impacted: boolean;
}

export default function OperatorConsole() {
  const { state, assignCoordinatorToTour, addCoordinator } = useApp();
  const tours = state.tours as Tour[];
  const coordinators = state.coordinators;
  const [activeTab, setActiveTab] = useState<'overview' | 'tours' | 'vendors' | 'dispatch' | 'finance'>('overview');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [assignFor, setAssignFor] = useState<string | null>(null);
  const [chosenTourId, setChosenTourId] = useState<string>('');
  const [showAddCoord, setShowAddCoord] = useState(false);
  const [newCoord, setNewCoord] = useState({ name:'', languages:'', expertise:'' });
  const unassigned = tours.filter(t => t.coordinator === '—');

  const totalMargin = tours.reduce((s, t) => s + t.margin, 0);
  const activeTours = tours.filter(t => t.status === 'active');
  const impactedTours = tours.filter(t => t.impacted);

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--color-surface-3)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-display-sm font-black" style={{ fontFamily: 'var(--font-family-display)', letterSpacing: '-0.06em' }}>
              Operator Command Center
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Real-time view of all personalized tours
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'var(--color-brand-white)', border: '1px solid var(--color-hairline-separator-light)' }}>
              <Radio size={12} className="inline mr-1" style={{ color: 'var(--color-semantic-success)' }} />
              Live
            </button>
            <button className="px-4 py-2 rounded-full text-xs font-medium"
              style={{ background: 'var(--color-brand-black)', color: 'white' }}>
              Crisis Mode
            </button>
          </div>
        </div>

        {/* Crisis Banner */}
        {impactedTours.length > 0 && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{ background: 'var(--color-semantic-error)', color: 'white' }}
          >
            <AlertTriangle size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {impactedTours.length} tours impacted by Jaipur rain — auto-rebalanced, review?
              </p>
              <p className="text-xs opacity-80">Amber Fort closed 14:00-18:00 • Alternative: City Palace + food walk</p>
            </div>
            <button
              onClick={() => setActiveTab('tours')}
              className="px-4 py-2 rounded-full text-xs font-bold"
              style={{ background: 'white', color: 'var(--color-semantic-error)' }}
            >
              Review →
            </button>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Tours', value: `${activeTours.length}`, sub: 'across 3 destinations', icon: '🌍', color: 'var(--color-brand-black)' },
            { label: 'Total Margin', value: formatCurrency(totalMargin), sub: 'next 30 days', icon: '💰', color: 'var(--color-semantic-success)' },
            { label: 'Coordinators', value: `${coordinators.length}`, sub: '1 available', icon: '👥', color: 'var(--color-accent-blue)' },
            { label: 'Avg. Rating', value: '4.8★', sub: 'last 30 days', icon: '⭐', color: '#d97706' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl p-5"
              style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <p className="text-2xl mb-2">{kpi.icon}</p>
              <p className="text-title-lg font-bold" style={{ color: kpi.color, letterSpacing: '-0.025em' }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{kpi.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['overview', 'tours', 'vendors', 'dispatch', 'finance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all capitalize"
              style={{
                background: activeTab === tab ? 'var(--color-brand-black)' : 'var(--color-brand-white)',
                color: activeTab === tab ? 'white' : 'var(--color-text-foreground)',
                border: `1px solid ${activeTab === tab ? 'transparent' : 'var(--color-hairline-separator-light)'}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map View */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden relative"
            style={{ minHeight: 400, background: 'var(--color-category-teal-4)' }}>
            {/* Simulated Map */}
            <div className="relative w-full h-full p-6">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
              
              <button className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
                style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--color-brand-black)' }}>
                Live Tour Map
              </button>

              {/* Tour dots */}
              {tours.filter(t => t.status === 'active').map((tour) => {
                const positions = [
                  { x: '30%', y: '30%' },
                  { x: '65%', y: '40%' },
                  { x: '45%', y: '70%' },
                  { x: '75%', y: '25%' },
                  { x: '20%', y: '60%' },
                ];
                const pos = positions[activeTours.indexOf(tour) % positions.length];
                return (
                  <motion.button
                    key={tour.id}
                    onClick={() => setSelectedTour(tour)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pos.x, top: pos.y }}
                    whileHover={{ scale: 1.2 }}
                  >
                      <motion.div
                        className="relative"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-4 h-4 rounded-full"
                          style={{
                            background: tour.impacted ? 'var(--color-semantic-error)' : 'var(--color-semantic-success)',
                            boxShadow: '0 0 0 3px rgba(255,255,255,0.8)',
                          }} />
                      </motion.div>
                  </motion.button>
                );
              })}

              {/* Selected tour card */}
              {selectedTour && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl z-10"
                  style={{ background: 'var(--color-brand-white)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{selectedTour.id} • {selectedTour.customer}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                      style={{ background: 'var(--color-semantic-attraction-bg)', color: 'var(--color-semantic-attraction-dot)' }}>
                      {selectedTour.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p style={{ color: 'var(--color-text-muted)' }}>📅 {selectedTour.dates}</p>
                    <p style={{ color: 'var(--color-text-muted)' }}>👤 {selectedTour.coordinator}</p>
                    <p style={{ color: 'var(--color-text-muted)' }}>📍 {selectedTour.nextAction}</p>
                    <p className="font-semibold" style={{ color: 'var(--color-semantic-success)' }}>
                      Margin: {formatCurrency(selectedTour.margin)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Side Panel - Tours */
            }
          <div className="rounded-3xl p-5"
            style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 className="text-title-sm font-semibold mb-4" style={{ color: 'var(--color-brand-black)' }}>
              Tours Overview
            </h3>
            <div className="space-y-2">
              {tours.map((tour) => (
                <button
                  key={tour.id}
                  onClick={() => setSelectedTour(tour)}
                  className="w-full text-left p-3 rounded-xl transition-all hover:bg-gray-50"
                  style={{
                    background: selectedTour?.id === tour.id ? 'var(--color-surface-3)' : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        tour.status === 'active' ? 'bg-success' : 
                        tour.status === 'arriving' ? 'bg-warning' :
                        tour.status === 'planning' ? 'bg-info' : 'bg-gray-400'
                      }`}
                      style={{
                        background: tour.impacted ? 'var(--color-semantic-error)' : 
                          tour.status === 'active' ? 'var(--color-semantic-success)' :
                          tour.status === 'arriving' ? 'var(--color-semantic-warning)' :
                          tour.status === 'planning' ? 'var(--color-accent-blue)' : 'var(--color-category-gray-4)',
                      }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--color-brand-black)' }}>{tour.customer}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-semantic-success)' }}>
                      {formatCurrency(tour.margin)}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-brand-black)' }}>
                    {tour.destination} • {tour.dates}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dispatch Board */}
        <div className="mt-8 rounded-3xl p-6"
          style={{ background: 'var(--color-brand-white)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
              Coordinator Dispatch Board
            </h3>
            <button onClick={()=>setShowAddCoord(!showAddCoord)} className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#000', color: 'white' }}><UserPlus size={12} /> Add Coordinator</button>
          </div>

          {showAddCoord && (
            <div className="mb-4 p-4 rounded-2xl flex flex-wrap gap-2" style={{ background: 'var(--color-surface-3)' }}>
              <input placeholder="Name" value={newCoord.name} onChange={e=>setNewCoord({...newCoord, name:e.target.value})} className="px-3 py-2 rounded-full text-xs flex-1 min-w-[120px]" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#000' }} />
              <input placeholder="Languages (comma)" value={newCoord.languages} onChange={e=>setNewCoord({...newCoord, languages:e.target.value})} className="px-3 py-2 rounded-full text-xs flex-1 min-w-[140px]" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#000' }} />
              <input placeholder="Expertise (comma)" value={newCoord.expertise} onChange={e=>setNewCoord({...newCoord, expertise:e.target.value})} className="px-3 py-2 rounded-full text-xs flex-1 min-w-[140px]" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#000' }} />
              <button onClick={()=>{
                if(!newCoord.name) return;
                addCoordinator({ coordinatorId: `coord_${Date.now()}`, name: newCoord.name, photo: '', languages: newCoord.languages.split(',').map(s=>s.trim()).filter(Boolean), expertise: newCoord.expertise.split(',').map(s=>s.trim()).filter(Boolean), location: {lat:26, lng:75}, rating: 4.8, workload: 0, availability: [], bio: 'New coordinator' });
                setNewCoord({ name:'', languages:'', expertise:'' }); setShowAddCoord(false);
              }} className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: '#000', color: 'white' }}>Add</button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coordinators.map((c) => (
              <motion.div
                key={c.coordinatorId}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl"
                style={{ background: 'var(--color-surface-3)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'var(--color-atmospheric-warm-peach)' }}>
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-accent-blue)' }}>
                      {c.name}
                    </p>
                    <p className="text-xs" style={{ color: '#d97706' }}>
                      ⭐ {c.rating} • {' '}
                      {c.languages.join(', ')}
                    </p>
                  </div>
                  <div className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: c.workload < 2 ? 'var(--color-semantic-success)' : 'var(--color-semantic-warning)', color: 'white' }}>
                    {c.workload < 2 ? 'Available' : `${c.workload} tours`}
                  </div>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                  {c.expertise.join(' • ')}
                </p>
                <button
                  onClick={() => { setAssignFor(c.name); setChosenTourId(unassigned[0]?.id || ''); }}
                  className="w-full py-2 rounded-full text-xs font-medium transition-all active:scale-[0.98]"
                  style={{ background: 'var(--color-brand-black)', color: 'white' }}
                >
                  Assign to Tour
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {assignFor && (
            <>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setAssignFor(null)} className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 50 }} />
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-3xl p-6" style={{ background: 'white', zIndex: 60, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: '#000' }}>Assign {assignFor} to tour</h3>
                  <button onClick={()=>setAssignFor(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#f5f5f5' }}><X size={14} /></button>
                </div>
                {unassigned.length===0 ? (
                  <p className="text-sm py-4" style={{ color: 'var(--color-text-muted)' }}>No unassigned tours. New bookings will appear here.</p>
                ) : (
                  <>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Booked itineraries waiting for operator assignment:</p>
                    <select value={chosenTourId} onChange={e=>setChosenTourId(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', color: '#000' }}>
                      {unassigned.map(t => <option key={t.id} value={t.id}>{t.id} • {t.customer} • {t.destination} • {t.dates}</option>)}
                    </select>
                    <button onClick={()=>{
                      if(chosenTourId && assignFor) { assignCoordinatorToTour(chosenTourId, assignFor); setAssignFor(null); }
                    }} className="w-full mt-4 py-3 rounded-full text-sm font-bold" style={{ background: '#000', color: 'white' }}>Confirm Assignment →</button>
                  </>
                )}
                <p className="text-xs mt-3 text-center" style={{ color: 'var(--color-text-muted)' }}>Traveler will see coordinator in My Itinerary</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}