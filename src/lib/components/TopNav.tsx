'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Compass } from 'lucide-react';

export default function TopNav() {
  const { state, setCurrentScreen, toggleCart } = useApp();
  const isOperator = state.currentScreen === 'operator';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-[2] flex justify-center px-4 pt-4"
    >
      <div
        className="flex items-center justify-between w-full max-w-[280px] sm:max-w-[320px] h-12 px-4 rounded-full"
        style={{
          backdropFilter: 'blur(16px)',
          background: 'radial-gradient(107.32% 141.42% at 0 0, rgba(255,255,255,0.35), rgba(255,255,255,0.14))',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={() => setCurrentScreen('chat')}
          className="flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: 'var(--color-brand-black)' }}
        >
          <Compass size={18} />
          <span className="hidden sm:inline">TravelAI</span>
        </button>

        <button
            onClick={() => setCurrentScreen(isOperator ? 'chat' : 'operator')}
            className="px-4 h-8 rounded-full text-xs font-medium transition-all active:scale-95"
            style={{
              background: isOperator ? 'var(--color-brand-black)' : 'var(--color-category-gray-3)',
              color: isOperator ? 'var(--color-brand-white)' : 'var(--color-brand-black)',
            }}
          >
            {isOperator ? 'Traveler' : 'Operator'}
          </button>
      </div>
    </motion.nav>
  );
}