'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { getVibeColor, getVibeBg, getVibeIcon } from '@/lib/utils';

export default function CircularAnimation() {
  const { state, setCurrentScreen } = useApp();
  const [phase, setPhase] = useState<'orbit' | 'dock' | 'reveal'>('orbit');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('dock'), 2500);
    const timer2 = setTimeout(() => setPhase('reveal'), 3500);
    const timer3 = setTimeout(() => setCurrentScreen('places'), 4500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setCurrentScreen]);

  const orbitItems = state.selectedVibes.map((vibe) => ({
    label: vibe,
    icon: getVibeIcon(vibe),
    color: getVibeColor(vibe),
    bg: getVibeBg(vibe),
  }));

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-surface-3)' }}>
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        {/* Orbiting Elements */}
        <AnimatePresence>
          {phase === 'orbit' && orbitItems.map((item, i) => {
            const angle = (i / orbitItems.length) * 360;
            const radius = 140;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [angle, angle + 360],
                }}
                exit={{ opacity: 0, scale: 0.5, y: -80 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                }}
                className="absolute flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: item.bg,
                  left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}px - 28px)`,
                  top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px - 28px)`,
                }}
              >
                <span className="text-xl">{item.icon}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dots bursting inward then outward */}
        {phase === 'orbit' && (
          <>
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 360;
              return (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-accent-blue)' }}
                  initial={{
                    x: 250 * Math.cos((angle * Math.PI) / 180),
                    y: 250 * Math.sin((angle * Math.PI) / 180),
                    opacity: 0,
                  }}
                  animate={{
                    x: 30 * Math.cos((angle * Math.PI) / 180),
                    y: 30 * Math.sin((angle * Math.PI) / 180),
                    opacity: [0, 1, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              );
            })}
          </>
        )}

        {/* Center Destination Name */}
        <motion.div
          className="absolute z-10 text-center"
          animate={phase === 'dock' ? { y: -160, scale: 0.65 } : { y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <motion.div
            className="text-5xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            🏰
          </motion.div>
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-black tracking-tight uppercase"
            style={{ letterSpacing: '-0.06em', color: 'var(--color-brand-black)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {state.destination || 'Rajasthan'}
          </motion.h2>
        </motion.div>

        {/* Docked Capsule */}
        <AnimatePresence>
          {phase === 'dock' && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'var(--color-brand-white)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <span className="font-semibold text-sm" style={{ color: 'var(--color-brand-black)' }}>
                {state.destination || 'Rajasthan'}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>•</span>
              {state.selectedVibes.slice(0, 3).map((v) => (
                <span key={v} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: getVibeBg(v), color: getVibeColor(v) }}>
                  {getVibeIcon(v)} {v}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading text during dock phase */}
        {phase === 'dock' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 text-center"
          >
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Weaving your preferences into the perfect journey...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}