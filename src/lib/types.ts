export interface POI {
  poiId: string;
  name: string;
  city: string;
  description: string;
  vibeScores: Record<string, number>;
  crowdLevel: 'low' | 'medium' | 'high';
  openHours: { open: string; close: string };
  cost: number;
  lat: number;
  lng: number;
  imageUrl: string;
  category: 'attraction' | 'activity' | 'restaurant' | 'hotel' | 'location';
  tags: string[];
  rating: number;
  estimatedDuration: number;
  bestTimeToVisit?: string;
  transportTip?: string;
  proTip?: string;
  nearbyAttractions?: string[];
  entryFeeDetails?: string;
}

export interface CartItem {
  poiId: string;
  poi: POI;
  addedAt: Date;
}

export interface ItinerarySlot {
  time: string;
  poiId: string;
  poi?: POI;
  transferId?: string;
  hotelId?: string;
  type: 'poi' | 'transfer' | 'hotel' | 'meal' | 'free';
  duration: number;
  notes?: string;
}

export interface ItineraryDay {
  day: number;
  city: string;
  hotelId: string;
  hotel?: POI;
  slots: ItinerarySlot[];
}

export interface ItineraryVariant {
  id: string;
  name: string;
  description: string;
  days: ItineraryDay[];
  totalCost: number;
  experienceScore: number;
  paceScore: number;
  paretoRank: number;
}

export interface Coordinator {
  coordinatorId: string;
  name: string;
  photo: string;
  languages: string[];
  expertise: string[];
  location: { lat: number; lng: number };
  rating: number;
  workload: number;
  availability: Date[];
  bio: string;
}

export interface VibeOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export interface PreferenceQuestion {
  id: string;
  type: 'single' | 'multi' | 'slider' | 'text';
  question: string;
  options?: { value: string; label: string; emoji?: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ParetoPoint {
  cost: number;
  experienceScore: number;
  paceScore: number;
  variantId: string;
}