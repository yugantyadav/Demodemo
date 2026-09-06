'use client';

import { AppProvider, useApp } from '@/lib/app-context';
import TopNav from '@/app/frontend/components/TopNav';
import ChatHero from '@/app/frontend/components/ChatHero';
import PreferenceQuiz from '@/app/frontend/components/PreferenceQuiz';
import CircularAnimation from '@/app/frontend/components/CircularAnimation';
import CuratedPlaces from '@/app/frontend/components/CuratedPlaces';
import CartDrawer from '@/app/frontend/components/CartDrawer';
import FinalizeForm from '@/app/frontend/components/FinalizeForm';
import ItineraryView from '@/app/frontend/components/ItineraryView';
import MyItinerary from '@/app/frontend/components/MyItinerary';
import OperatorConsole from '@/app/frontend/components/OperatorConsole';
import DevFab from '@/app/frontend/components/DevFab';
import { AnimatePresence, motion } from 'framer-motion';

function AppRouter() {
  const { state } = useApp();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-brand-white)' }}>
      <TopNav />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {state.currentScreen === 'chat' && <ChatHero />}
          {state.currentScreen === 'quiz' && <PreferenceQuiz />}
          {state.currentScreen === 'animation' && <CircularAnimation />}
          {state.currentScreen === 'places' && <CuratedPlaces />}
           {state.currentScreen === 'finalize' && <FinalizeForm />}
          {state.currentScreen === 'itinerary' && <ItineraryView />}
          {state.currentScreen === 'my-itinerary' && <MyItinerary />}
          {state.currentScreen === 'operator' && <OperatorConsole />}
        </motion.div>
      </AnimatePresence>
      <CartDrawer />
      <DevFab />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}