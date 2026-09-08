'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { allPOIs } from '@/lib/mock-data';
import { ItineraryVariant } from '@/lib/types';
import { X, Plus, Trash2, ChevronUp, ChevronDown, Clock, MapPin, GripVertical } from 'lucide-react';

interface ItineraryCustomizerProps {
  variant: ItineraryVariant;
  onClose: () => void;
}

export default function ItineraryCustomizer({ variant, onClose }: ItineraryCustomizerProps) {
  const { removeSlotFromItinerary, addPoiToItinerary, moveSlotInItinerary, updateSlotTime, state } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDay = variant.days[selectedDay];

  const existingPoiIds = useMemo(() => {
    const ids = new Set<string>();
    variant.days.forEach(day => {
      day.slots.forEach(slot => {
        if (slot.poiId) ids.add(slot.poiId);
      });
    });
    return ids;
  }, [variant]);

  const availablePois = useMemo(() => {
    const city = state.destination || 'Rajasthan';
    let pool = allPOIs.filter(p => !existingPoiIds.has(p.poiId));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(p => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
    }
    return pool.slice(0, 12);
  }, [existingPoiIds, searchQuery, state.destination]);

  const handleRemove = (slotIndex: number) => {
    removeSlotFromItinerary(variant.id, selectedDay, slotIndex);
  };

  const handleMoveUp = (slotIndex: number) => {
    if (slotIndex > 0) {
      moveSlotInItinerary(variant.id, selectedDay, slotIndex, slotIndex - 1);
    }
  };

  const handleMoveDown = (slotIndex: number) => {
    if (currentDay && slotIndex < currentDay.slots.length - 1) {
      moveSlotInItinerary(variant.id, selectedDay, slotIndex, slotIndex + 1);
    }
  };

  const handleAddPoi = (poi: any) => {
    addPoiToItinerary(variant.id, selectedDay, poi);
    setShowAddPanel(false);
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', zIndex:1000 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col"
        style={{ background: 'white' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#eee' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#000' }}>Customize Itinerary</h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Add, remove, or reorder places</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: '#666' }}>
            <X size={18} />
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 p-4 overflow-x-auto" style={{ background: '#f9fafb' }}>
          {variant.days.map((day, i) => (
            <button
              key={day.day}
              onClick={() => { setSelectedDay(i); setShowAddPanel(false); }}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: selectedDay === i ? '#000' : 'white',
                color: selectedDay === i ? 'white' : '#000',
                border: `1px solid ${selectedDay === i ? '#000' : '#e5e7eb'}`,
              }}
            >
              Day {day.day} — {day.city}
            </button>
          ))}
        </div>

        {/* Slots List */}
        <div className="flex-1 overflow-y-auto p-5">
          {currentDay && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#000' }}>
                  Day {currentDay.day} — {currentDay.city}
                </h3>
                <button
                  onClick={() => setShowAddPanel(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                  style={{ background: '#000', color: 'white' }}
                >
                  <Plus size={12} /> Add Place
                </button>
              </div>

              {currentDay.slots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No places in this day yet</p>
                  <button
                    onClick={() => setShowAddPanel(true)}
                    className="mt-2 px-4 py-2 rounded-full text-xs font-bold"
                    style={{ background: '#000', color: 'white' }}
                  >
                    Add your first place
                  </button>
                </div>
              ) : (
                currentDay.slots.map((slot, i) => (
                  <motion.div
                    key={`${slot.poiId}-${i}`}
                    layout
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#f9fafb' }}
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(i)}
                        disabled={i === 0}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 disabled:opacity-30"
                        style={{ color: '#666' }}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(i)}
                        disabled={i === currentDay.slots.length - 1}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 disabled:opacity-30"
                        style={{ color: '#666' }}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#000' }}>{slot.poi?.name || 'Transit'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {slot.poi?.city}</span>
                      </div>
                      {/* Time & Duration Pickers */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: '#666' }}>
                          <Clock size={11} /> Time:
                          <input
                            type="time"
                            value={slot.time || '09:00'}
                            onChange={(e) => updateSlotTime(variant.id, selectedDay, i, e.target.value, slot.duration)}
                            className="px-2 py-1 rounded-lg text-[11px] outline-none"
                            style={{ background: 'white', border: '1px solid #e5e7eb', color: '#000' }}
                          />
                        </label>
                        <label className="flex items-center gap-1 text-[11px] font-medium" style={{ color: '#666' }}>
                          Duration:
                          <select
                            value={slot.duration}
                            onChange={(e) => updateSlotTime(variant.id, selectedDay, i, slot.time, parseInt(e.target.value))}
                            className="px-2 py-1 rounded-lg text-[11px] outline-none"
                            style={{ background: 'white', border: '1px solid #e5e7eb', color: '#000' }}
                          >
                            {[30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 420, 480].map(m => (
                              <option key={m} value={m}>{m >= 60 ? `${Math.floor(m/60)}h${m%60 ? ` ${m%60}m` : ''}` : `${m}m`}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(i)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Add Panel */}
        <AnimatePresence>
          {showAddPanel && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-0 flex flex-col"
              style={{ background: 'white', zIndex: 10 }}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#eee' }}>
                <h3 className="text-sm font-bold" style={{ color: '#000' }}>Add a place</h3>
                <button onClick={() => setShowAddPanel(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: '#666' }}>
                  <X size={18} />
                </button>
              </div>

              <div className="p-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places..."
                  className="w-full px-4 py-2.5 rounded-full text-sm outline-none"
                  style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', color: '#000' }}
                  autoFocus
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="space-y-2">
                  {availablePois.map(poi => (
                    <motion.button
                      key={poi.poiId}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddPoi(poi)}
                      className="w-full text-left p-3 rounded-xl flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      style={{ background: '#f9fafb' }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={poi.imageUrl} alt={poi.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#000' }}>{poi.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{poi.city} • {poi.estimatedDuration}m • ★{poi.rating}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {poi.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px]" style={{ background: '#e5e7eb', color: '#666' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold" style={{ color: '#000' }}>₹{poi.cost}</p>
                        <Plus size={16} style={{ color: '#000' }} className="ml-auto mt-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: '#eee' }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-bold"
            style={{ background: '#f5f5f5', color: '#000' }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
