'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/app-context';
import { preferenceQuestions } from '@/lib/mock-data';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function PreferenceQuiz() {
  const { state, toggleVibe, setBudget, setPace, toggleInterest, setCurrentScreen, setSelectedVibes } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const totalSteps = preferenceQuestions.length;
  const question = preferenceQuestions[currentStep];

  const handleSingleSelect = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
    if (question.id === 'budget') setBudget(value);
    if (question.id === 'pace') setPace(value);
  }, [question, setBudget, setPace]);

  const handleMultiToggle = useCallback((value: string) => {
    const current = (answers[question.id] as string[]) || [];
    const exists = current.includes(value);
    const updated = exists ? current.filter(v => v !== value) : [...current, value];
    setAnswers(prev => ({ ...prev, [question.id]: updated }));
    if (question.id === 'trip_type') {
      setSelectedVibes(updated);
    }
    if (question.id === 'interests') {
      // sync interests to context via toggleInterest diff
      const toAdd = updated.filter(v => !state.interests.includes(v));
      const toRemove = state.interests.filter(v => !updated.includes(v));
      toAdd.forEach(v => toggleInterest(v));
      toRemove.forEach(v => toggleInterest(v));
    }
  }, [question, answers, state.interests, toggleInterest, setSelectedVibes]);

  const hasAnswer = () => {
    const ans = answers[question.id];
    if (question.type === 'single') return typeof ans === 'string' && ans.length > 0;
    if (question.type === 'multi') return Array.isArray(ans) && ans.length > 0;
    if (question.type === 'text') return typeof ans === 'string' && ans.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (!hasAnswer()) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentScreen('animation');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full px-4 py-20 pt-24 flex justify-center"
      style={{ background: 'var(--color-surface-3)' }}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full"
        style={{ maxWidth: '512px' }}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Personalizing your journey...
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-category-gray-3)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--color-brand-black)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl p-6 sm:p-8 w-full"
            style={{
              background: 'var(--color-brand-white)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              width: '100%',
            }}
          >
            <h2 className="text-title-lg mb-6" style={{ color: 'var(--color-brand-black)' }}>
              {question.question}
            </h2>

            {/* Single Select */}
            {question.type === 'single' && question.options && (
              <div className="space-y-3">
                {question.options.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSingleSelect(opt.value)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                    style={{
                      background: answers[question.id] === opt.value ? 'var(--color-brand-black)' : 'var(--color-surface-3)',
                      color: answers[question.id] === opt.value ? 'var(--color-brand-white)' : 'var(--color-brand-black)',
                      border: `2px solid ${answers[question.id] === opt.value ? 'var(--color-brand-black)' : 'transparent'}`,
                    }}
                  >
                    {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
                    <span className="text-sm font-medium flex-1">{opt.label}</span>
                    {answers[question.id] === opt.value && (
                      <Check size={16} />
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Multi Select */}
            {question.type === 'multi' && question.options && (
              <div className="flex flex-wrap gap-2">
                {question.options.map((opt) => {
                  const selected = ((answers[question.id] as string[]) || []).includes(opt.value);
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleMultiToggle(opt.value)}
                      className="px-4 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
                      style={{
                        background: selected ? 'var(--color-brand-black)' : 'var(--color-surface-3)',
                        color: selected ? 'var(--color-brand-white)' : 'var(--color-brand-black)',
                        border: `2px solid ${selected ? 'var(--color-brand-black)' : 'var(--color-hairline-separator-light)'}`,
                      }}
                    >
                      {opt.emoji && <span>{opt.emoji}</span>}
                      {opt.label}
                      {selected && <Check size={14} />}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Text Input */}
            {question.type === 'text' && (
              <textarea
                placeholder={question.placeholder}
                rows={3}
                className="w-full p-4 rounded-2xl text-sm outline-none transition-all resize-none"
                style={{
                  background: 'var(--color-surface-3)',
                  border: '2px solid transparent',
                  color: 'var(--color-text-foreground)',
                  fontFamily: 'var(--font-family-sans)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-blue)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 h-10 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: 'var(--color-brand-white)',
              color: 'var(--color-brand-black)',
              border: '1px solid var(--color-hairline-separator-light)',
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswer()}
            className="flex items-center gap-2 px-6 h-10 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: hasAnswer() ? 'var(--color-brand-black)' : 'var(--color-category-gray-4)',
              color: 'var(--color-brand-white)',
            }}
          >
            {currentStep === totalSteps - 1 ? 'Let\'s Go!' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}