'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { formatCurrency } from '@/lib/utils';
import { X, XCircle, GripVertical, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const { state, removeFromCart, reorderCart, toggleCart, setCurrentScreen } = useApp();
  const total = state.cart.reduce((sum, item) => sum + item.poi.cost, 0);

  return (
    <AnimatePresence>
      {state.isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 bottom-0 flex flex-col"
            style={{
              right: 0,
              width: '100%',
              maxWidth: '448px',
              background: '#ffffff',
              zIndex: 60,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b"
              style={{ borderColor: 'var(--color-hairline-separator-light)' }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} style={{ color: 'var(--color-brand-black)' }} />
                <h2 className="text-title-md font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                  Your Itinerary
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-surface-3)', color: 'var(--color-text-muted)' }}>
                  {state.cart.length} places
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-gray-100"
              >
                <X size={18} style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-4xl mb-4">🛍️</p>
                  <p className="text-title-sm font-semibold mb-1" style={{ color: 'var(--color-brand-black)' }}>
                    Your cart is empty
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Add places to your itinerary as you explore
                  </p>
                  <button
                    onClick={() => { toggleCart(); setCurrentScreen('places'); }}
                    className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: 'var(--color-brand-black)',
                      color: 'var(--color-brand-white)',
                    }}
                  >
                    Explore Places
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {state.cart.map((item, index) => (
                      <motion.div
                        key={item.poiId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          background: 'var(--color-surface-3)',
                        }}
                      >
                        <div className="flex items-center cursor-grab" style={{ color: 'var(--color-text-muted)' }}>
                          <GripVertical size={16} />
                        </div>

                        <button
                          onClick={() => reorderCart(index, Math.max(0, index - 1))}
                          className="flex-1 text-left min-w-0"
                        >
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-brand-black)' }}>
                            {item.poi.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              {item.poi.city}
                            </span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                              {formatCurrency(item.poi.cost)}
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => removeFromCart(item.poiId)}
                          className="p-1.5 rounded-full hover:bg-white transition-all"
                          style={{ color: 'var(--color-semantic-error)' }}
                        >
                          <XCircle size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {state.cart.length > 0 && (
              <div className="p-6 border-t"
                style={{ borderColor: 'var(--color-hairline-separator-light)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Activity costs
                  </span>
                  <span className="text-title-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Estimated transport
                  </span>
                  <span className="text-sm font-semibold"
                    style={{ color: 'var(--color-semantic-warning)' }}>
                    Calculated at finalize
                  </span>
                </div>
                <button
                  onClick={() => { toggleCart(); setCurrentScreen('finalize'); }}
                  className="w-full h-12 rounded-full text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--color-brand-black)',
                    color: 'var(--color-brand-white)',
                  }}
                >
                  Finalize Itinerary →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}