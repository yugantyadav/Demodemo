'use client';
import { useApp } from '@/lib/app-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Bug, Compass, MapPin, ShoppingCart, FileText, Sparkles, LayoutDashboard } from 'lucide-react';

export default function DevFab() {
  const { state, setCurrentScreen, toggleDevMode, resetApp } = useApp();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!state.devMode && !open) {
    return (
      <button onClick={() => { toggleDevMode(); setOpen(true); }} className="fixed bottom-5 left-5 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black z-50 overflow-hidden" style={{ background: '#111', border: '1px solid #333' }}>
        {!imgError ? (
          <img src="/user-avatar.svg" alt="User" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : 'N'}
      </button>
    );
  }
  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 left-5 w-10 h-10 rounded-full flex items-center justify-center text-white z-50 overflow-hidden" style={{ background: open ? '#fff' : '#111', color: open ? '#000' : '#fff', border: '1px solid #333' }}>
        {open ? <X size={14} /> : (!imgError ? (
          <img src="/user-avatar.svg" alt="User" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : <span className="text-xs font-black">N</span>)}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-16 left-5 w-72 rounded-2xl p-4 z-50" style={{ background: '#111', color: 'white', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold flex items-center gap-1"><Bug size={12} /> Dev Mode</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#22c55e', color: 'black' }}>ON</span>
            </div>
            <p className="text-[11px] opacity-60 mb-3">{state.destination || 'No destination'} • {state.cart.length} in cart • {state.duration} nights • {state.selectedItineraryId || 'no variant'}</p>
            <div className="grid grid-cols-2 gap-2">
              {(['chat','quiz','animation','places','finalize','itinerary','my-itinerary','operator'] as const).map(s => (
                <button key={s} onClick={() => { setCurrentScreen(s); setOpen(false); }} className="py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1" style={{ background: state.currentScreen===s ? 'white' : '#222', color: state.currentScreen===s ? 'black' : 'white' }}>
                  {s==='chat' && <Compass size={12} />}{s==='places' && <MapPin size={12} />}{s==='finalize' && <FileText size={12} />}{s==='itinerary' && <ShoppingCart size={12} />}{s==='my-itinerary' && <Sparkles size={12} />}{s==='operator' && <LayoutDashboard size={12} />}{s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={resetApp} className="flex-1 py-2 rounded-full text-xs font-bold" style={{ background: '#dc2626' }}>Reset</button>
              <button onClick={toggleDevMode} className="flex-1 py-2 rounded-full text-xs font-bold" style={{ background: '#333' }}>Disable</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
