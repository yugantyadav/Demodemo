'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { Send, Mic, Sparkles } from 'lucide-react';
import { destinations } from '@/lib/mock-data';

const suggestions = [
  { text: 'Rajasthan', subtitle: 'Royal Heritage & Deserts' },
  { text: 'Kerala', subtitle: 'Backwaters & Ayurveda' },
  { text: 'Goa', subtitle: 'Beaches & Nightlife' },
];

export default function ChatHero() {
  const { setDestination, setCurrentScreen } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setIsTyping(true);
    const dest = destinations.find(d => 
      d.name.toLowerCase().includes(input.toLowerCase())
    );
    const destName = dest ? dest.name : input.trim();
    setDestination(destName);
    
    setTimeout(() => {
      setCurrentScreen('quiz');
    }, 800);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setDestination(text);
    setTimeout(() => {
      setCurrentScreen('quiz');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-hero-gradient opacity-80" />
      
      {/* Floating Destination Images - hidden on small screens to avoid overlap */}
      <motion.div
        className="hidden sm:block absolute top-[15%] left-[8%] w-48 h-36 rounded-2xl overflow-hidden animate-float-1 opacity-90"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop&q=80" alt="Rajasthan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <p className="absolute bottom-2 left-3 text-white text-xs font-bold">Rajasthan</p>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute top-[20%] right-[10%] w-40 h-28 rounded-2xl overflow-hidden animate-float-2 opacity-90"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <img src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&auto=format&fit=crop&q=80" alt="Kerala" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <p className="absolute bottom-2 left-3 text-white text-xs font-bold">Kerala</p>
      </motion.div>

      <motion.div
        className="hidden sm:block absolute bottom-[20%] left-[15%] w-36 h-24 rounded-2xl overflow-hidden animate-float-3 opacity-90"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&auto=format&fit=crop&q=80" alt="Goa" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <p className="absolute bottom-2 left-3 text-white text-xs font-bold">Goa</p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mb-3 tracking-tight"
            style={{ letterSpacing: '-0.06em' }}>
            Where do you want<br />
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              to go?
            </span>
          </h1>
          <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-muted)' }}>
            Tell us your dream destination and we&apos;ll craft your perfect trip
          </p>
        </motion.div>

        {/* Chatbox Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.2)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-atmospheric-voice-halo-1)' }}>
              <Sparkles size={20} style={{ color: 'var(--color-semantic-success)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-brand-black)' }}>
                AI Travel Assistant
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Available 24/7 to plan your perfect trip
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder='Where do you want to go? 💬 e.g., "Rajasthan for 5 days"'
              className="w-full h-14 pl-5 pr-24 rounded-full text-base outline-none transition-all"
              style={{
                background: 'var(--color-surface-3)',
                border: '1px solid var(--color-hairline-separator-light)',
                color: 'var(--color-text-foreground)',
                fontFamily: 'var(--font-family-sans)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-accent-blue)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-hairline-separator-light)';
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-gray-200"
                style={{ color: 'var(--color-text-muted)' }}>
                <Mic size={18} />
              </button>
              <button
                onClick={handleSubmit}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: input.trim() ? 'var(--color-brand-black)' : 'var(--color-category-gray-4)',
                  color: 'var(--color-brand-white)',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--color-accent-blue)' }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Understanding your travel dreams...
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion Chips */}
          <div className="mt-5">
            <p className="text-xs font-medium mb-3 uppercase" style={{
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}>
              Popular destinations
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <motion.button
                  key={s.text}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestion(s.text)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: 'var(--color-surface-3)',
                    border: '1px solid var(--color-hairline-separator-light)',
                    color: 'var(--color-brand-black)',
                  }}
                >
                  {s.text} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>• {s.subtitle}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}