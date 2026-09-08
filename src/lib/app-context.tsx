'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, POI, ItineraryVariant, Coordinator } from './types';
import { rajasthanPOIs, sampleCoordinators } from './mock-data';

interface AppState {
  currentScreen: 'chat' | 'quiz' | 'animation' | 'places' | 'cart' | 'finalize' | 'itinerary' | 'operator' | 'my-itinerary';
  destination: string;
  selectedVibes: string[];
  budget: string;
  pace: string;
  interests: string[];
  cart: CartItem[];
  isCartOpen: boolean;
  itinerary: ItineraryVariant[];
  selectedItineraryId: string | null;
  coordinator: Coordinator | null;
  isBooked: boolean;
  travelers: { adults: number; children: { age: number }[] };
  duration: number;
  startCity: string;
  transportMode: string;
  devMode: boolean;
  tours: { id: string; customer: string; destination: string; dates: string; status: 'active'|'arriving'|'planning'|'completed'; margin: number; coordinator: string; nextAction: string; impacted: boolean }[];
  coordinators: Coordinator[];
}

interface AppContextType {
  state: AppState;
  setCurrentScreen: (screen: AppState['currentScreen']) => void;
  setDestination: (dest: string) => void;
  setSelectedVibes: (vibes: string[]) => void;
  toggleVibe: (vibe: string) => void;
  setBudget: (budget: string) => void;
  setPace: (pace: string) => void;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  addToCart: (poi: POI) => void;
  removeFromCart: (poiId: string) => void;
  reorderCart: (fromIndex: number, toIndex: number) => void;
  toggleCart: () => void;
  setItinerary: (variants: ItineraryVariant[]) => void;
  selectItinerary: (id: string) => void;
  setCoordinator: (c: Coordinator) => void;
  setBooked: (b: boolean) => void;
  setTravelers: (t: { adults: number; children: { age: number }[] }) => void;
  setDuration: (d: number) => void;
  setStartCity: (s: string) => void;
  setTransportMode: (s: string) => void;
  toggleDevMode: () => void;
  resetApp: () => void;
  addCoordinator: (c: Coordinator) => void;
  assignCoordinatorToTour: (tourId: string, coordinatorName: string) => void;
  addBookedTour: () => void;
  getPoisForDestination: () => POI[];
  removeSlotFromItinerary: (variantId: string, dayIndex: number, slotIndex: number) => void;
  addPoiToItinerary: (variantId: string, dayIndex: number, poi: POI) => void;
  moveSlotInItinerary: (variantId: string, dayIndex: number, fromIndex: number, toIndex: number) => void;
  updateSlotTime: (variantId: string, dayIndex: number, slotIndex: number, time: string, duration: number) => void;
}

const defaultTours = [
  { id: 'T-1024', customer: 'Sarah & Mike', destination: 'Rajasthan', dates: 'Sep 12-18', status: 'active' as const, margin: 22000, coordinator: 'Priya', nextAction: 'Amber Fort transfer', impacted: false },
  { id: 'T-1025', customer: 'Chen Family', destination: 'Rajasthan', dates: 'Sep 13-19', status: 'active' as const, margin: 18500, coordinator: 'Arjun', nextAction: 'Desert safari pickup', impacted: true },
  { id: 'T-1026', customer: 'Anjali R.', destination: 'Kerala', dates: 'Sep 14-20', status: 'planning' as const, margin: 31000, coordinator: '—', nextAction: 'Awaiting payment', impacted: false },
  { id: 'T-1027', customer: 'David & Co.', destination: 'Goa', dates: 'Sep 15-22', status: 'active' as const, margin: 15800, coordinator: 'Meera', nextAction: 'Beach house check-in', impacted: false },
  { id: 'T-1028', customer: 'Priya Family', destination: 'Udaipur', dates: 'Sep 16-18', status: 'arriving' as const, margin: 7300, coordinator: 'Priya', nextAction: 'Arrival pickup 14:00', impacted: false },
  { id: 'T-1029', customer: 'Kate Winslow', destination: 'Jaisalmer', dates: 'Sep 18-22', status: 'planning' as const, margin: 26400, coordinator: '—', nextAction: 'Finalize itinerary', impacted: false },
  { id: 'T-1030', customer: 'Venkat & Shruti', destination: 'Rajasthan', dates: 'Sep 12-19', status: 'completed' as const, margin: 19400, coordinator: 'Arjun', nextAction: 'Awaiting review', impacted: false },
  { id: 'T-1031', customer: 'Emma Group (6)', destination: 'Jaipur', dates: 'Sep 17-20', status: 'active' as const, margin: 41000, coordinator: 'Meera', nextAction: 'City Palace verify', impacted: true },
];

const defaultState: AppState = {
  currentScreen: 'chat',
  destination: '',
  selectedVibes: [],
  budget: '',
  pace: '',
  interests: [],
  cart: [],
  isCartOpen: false,
  itinerary: [],
  selectedItineraryId: null,
  coordinator: null,
  isBooked: false,
  travelers: { adults: 2, children: [] },
  duration: 5,
  startCity: '',
  transportMode: '',
  devMode: false,
  tours: defaultTours,
  coordinators: sampleCoordinators,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('travelai_state');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.tours && Array.isArray(saved.tours)) {
          const seen=new Set(); saved.tours=saved.tours.filter((t:any)=>{ if(seen.has(t.id)) return false; seen.add(t.id); return true; });
        }
        setState(prev => ({ ...prev, ...saved }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    const toPersist = {
      currentScreen: state.currentScreen,
      destination: state.destination,
      selectedVibes: state.selectedVibes,
      budget: state.budget,
      pace: state.pace,
      interests: state.interests,
      travelers: state.travelers,
      duration: state.duration,
      startCity: state.startCity,
      transportMode: state.transportMode,
      devMode: state.devMode,
      cart: state.cart,
      itinerary: state.itinerary,
      selectedItineraryId: state.selectedItineraryId,
      coordinator: state.coordinator,
      isBooked: state.isBooked,
    };
    localStorage.setItem('travelai_state', JSON.stringify(toPersist));
  }, [state.currentScreen, state.destination, state.selectedVibes, state.budget, state.pace, state.interests, state.travelers, state.duration, state.startCity, state.transportMode, state.devMode, state.cart, state.itinerary, state.selectedItineraryId, state.coordinator, state.isBooked]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [state.currentScreen]);

  const setCurrentScreen = useCallback((screen: AppState['currentScreen']) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const setDestination = useCallback((dest: string) => {
    setState(prev => ({ ...prev, destination: dest }));
  }, []);

  const setSelectedVibes = useCallback((vibes: string[]) => {
    setState(prev => ({ ...prev, selectedVibes: vibes }));
  }, []);

  const toggleVibe = useCallback((vibe: string) => {
    setState(prev => {
      const exists = prev.selectedVibes.includes(vibe);
      return {
        ...prev,
        selectedVibes: exists
          ? prev.selectedVibes.filter(v => v !== vibe)
          : prev.selectedVibes.length < 3
            ? [...prev.selectedVibes, vibe]
            : prev.selectedVibes,
      };
    });
  }, []);

  const setBudget = useCallback((budget: string) => {
    setState(prev => ({ ...prev, budget }));
  }, []);

  const setPace = useCallback((pace: string) => {
    setState(prev => ({ ...prev, pace }));
  }, []);

  const setInterests = useCallback((interests: string[]) => {
    setState(prev => ({ ...prev, interests }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setState(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest],
      };
    });
  }, []);

  const addToCart = useCallback((poi: POI) => {
    setState(prev => {
      if (prev.cart.some(item => item.poiId === poi.poiId)) return prev;
      return {
        ...prev,
        cart: [...prev.cart, { poiId: poi.poiId, poi, addedAt: new Date() }],
      };
    });
  }, []);

  const removeFromCart = useCallback((poiId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.poiId !== poiId),
    }));
  }, []);

  const reorderCart = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newCart = [...prev.cart];
      const [moved] = newCart.splice(fromIndex, 1);
      newCart.splice(toIndex, 0, moved);
      return { ...prev, cart: newCart };
    });
  }, []);

  const toggleCart = useCallback(() => {
    setState(prev => ({ ...prev, isCartOpen: !prev.isCartOpen }));
  }, []);

  const setItinerary = useCallback((variants: ItineraryVariant[]) => {
    setState(prev => ({ ...prev, itinerary: variants }));
  }, []);

  const selectItinerary = useCallback((id: string) => {
    setState(prev => ({ ...prev, selectedItineraryId: id }));
  }, []);

  const setCoordinator = useCallback((c: Coordinator) => {
    setState(prev => ({ ...prev, coordinator: c }));
  }, []);

  const setBooked = useCallback((b: boolean) => {
    setState(prev => ({ ...prev, isBooked: b }));
  }, []);

  const setTravelers = useCallback((t: { adults: number; children: { age: number }[] }) => {
    setState(prev => ({ ...prev, travelers: t }));
  }, []);

  const setDuration = useCallback((d: number) => {
    setState(prev => ({ ...prev, duration: d }));
  }, []);

  const setStartCity = useCallback((s: string) => {
    setState(prev => ({ ...prev, startCity: s }));
  }, []);

  const setTransportMode = useCallback((s: string) => {
    setState(prev => ({ ...prev, transportMode: s }));
  }, []);

  const toggleDevMode = useCallback(() => {
    setState(prev => ({ ...prev, devMode: !prev.devMode }));
  }, []);

  const resetApp = useCallback(() => {
    localStorage.removeItem('travelai_state');
    setState({ ...defaultState });
  }, []);

  const addCoordinator = useCallback((c: Coordinator) => {
    setState(prev => ({ ...prev, coordinators: [...prev.coordinators, c] }));
  }, []);

  const assignCoordinatorToTour = useCallback((tourId: string, coordinatorName: string) => {
    setState(prev => ({
      ...prev,
      tours: prev.tours.map(t => t.id === tourId ? { ...t, coordinator: coordinatorName, status: 'active' as const } : t),
    }));
  }, []);

  const addBookedTour = useCallback(() => {
    setState(prev => {
      const variant = prev.itinerary.find(v => v.id === prev.selectedItineraryId) || prev.itinerary[0];
      const cost = variant?.totalCost || 15000;
      const maxId = Math.max(0, ...prev.tours.map(t => parseInt(t.id.replace('T-','')) || 0));
      const newTour = {
        id: `T-${maxId + 1}`,
        customer: 'You • ' + (prev.travelers.adults) + ' adults',
        destination: prev.destination || 'Rajasthan',
        dates: `Sep ${10 + prev.tours.length}-`+`${15 + prev.tours.length}`,
        status: 'planning' as const,
        margin: Math.round(cost * 0.3),
        coordinator: '—',
        nextAction: 'Assign coordinator',
        impacted: false,
      };
      return { ...prev, tours: [newTour, ...prev.tours], isBooked: true };
    });
  }, []);

  const getPoisForDestination = useCallback(() => {
    return rajasthanPOIs;
  }, []);

  const recalcVariants = useCallback((variants: ItineraryVariant[]): ItineraryVariant[] => {
    return variants.map(v => {
      const allPois = v.days.flatMap(d => d.slots.filter(s => s.poi && s.type === 'poi').map(s => s.poi!));
      const baseCost = allPois.reduce((s, p) => s + p.cost, 0);
      const totalDuration = allPois.reduce((s, p) => s + (p.estimatedDuration || 120), 0);
      const experienceScore = allPois.length === 0 ? 0 : Math.min(10, Math.round((allPois.reduce((s, p) => s + p.rating, 0) / allPois.length) * 2 * 100) / 100);
      const totalCost = Math.round(baseCost * 1.4 + (allPois.length > 6 ? 2000 : 0));
      return {
        ...v,
        totalCost,
        experienceScore,
        paceScore: v.paceScore,
      };
    });
  }, []);

  const removeSlotFromItinerary = useCallback((variantId: string, dayIndex: number, slotIndex: number) => {
    setState(prev => {
      const removedPoiId = prev.itinerary.find(v => v.id === variantId)?.days[dayIndex]?.slots[slotIndex]?.poiId;
      const newItinerary = prev.itinerary.map(v => {
        if (v.id !== variantId) {
          if (removedPoiId) {
            const newDays = v.days.map((day, di) => {
              if (di !== dayIndex) return day;
              return { ...day, slots: day.slots.filter(s => s.poiId !== removedPoiId) };
            });
            return { ...v, days: newDays };
          }
          return v;
        }
        const newDays = v.days.map((day, di) => {
          if (di !== dayIndex) return day;
          return { ...day, slots: day.slots.filter((_, si) => si !== slotIndex) };
        });
        return { ...v, days: newDays };
      });
      return { ...prev, itinerary: recalcVariants(newItinerary) };
    });
  }, [recalcVariants]);

  const addPoiToItinerary = useCallback((variantId: string, dayIndex: number, poi: POI) => {
    setState(prev => {
      const newItinerary = prev.itinerary.map(v => {
        const vDayIndex = Math.min(dayIndex, v.days.length - 1);
        const newDays = v.days.map((day, di) => {
          if (di !== vDayIndex) return day;
          const exists = day.slots.some(s => s.poiId === poi.poiId);
          if (exists) return day;
          const lastSlot = day.slots[day.slots.length - 1];
          const lastHour = lastSlot ? parseInt(lastSlot.time.split(':')[0]) : 8;
          const newTime = `${(lastHour + 2) % 24}`.padStart(2, '0') + ':00';
          const newSlot = {
            time: newTime,
            poiId: poi.poiId,
            poi,
            type: 'poi' as const,
            duration: poi.estimatedDuration || 120,
          };
          return { ...day, slots: [...day.slots, newSlot] };
        });
        return { ...v, days: newDays };
      });
      return { ...prev, itinerary: recalcVariants(newItinerary) };
    });
  }, [recalcVariants]);

  const moveSlotInItinerary = useCallback((variantId: string, dayIndex: number, fromIndex: number, toIndex: number) => {
    setState(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(v => {
        const newDays = v.days.map((day, di) => {
          if (di !== dayIndex) return day;
          const newSlots = [...day.slots];
          const [moved] = newSlots.splice(fromIndex, 1);
          newSlots.splice(toIndex, 0, moved);
          return { ...day, slots: newSlots };
        });
        return { ...v, days: newDays };
      }),
    }));
  }, []);

  const updateSlotTime = useCallback((variantId: string, dayIndex: number, slotIndex: number, time: string, duration: number) => {
    setState(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(v => {
        const newDays = v.days.map((day, di) => {
          if (di !== dayIndex) return day;
          return {
            ...day,
            slots: day.slots.map((s, si) => si === slotIndex ? { ...s, time, duration } : s),
          };
        });
        return { ...v, days: newDays };
      }),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        setCurrentScreen,
        setDestination,
        setSelectedVibes,
        toggleVibe,
        setBudget,
        setPace,
        setInterests,
        toggleInterest,
        addToCart,
        removeFromCart,
        reorderCart,
        toggleCart,
        setItinerary,
        selectItinerary,
        setCoordinator,
        setBooked,
        setTravelers,
        setDuration,
        setStartCity,
        setTransportMode,
        toggleDevMode,
        resetApp,
        addCoordinator,
        assignCoordinatorToTour,
        addBookedTour,
        getPoisForDestination,
        removeSlotFromItinerary,
        addPoiToItinerary,
        moveSlotInItinerary,
        updateSlotTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}