export interface TravelerDNA {
  userId: string;
  embedding: number[];
  vibes: Record<string, number>;
  budgetTier: 'budget' | 'mid' | 'luxury';
  history: string[];
}

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
}

export interface CartItem {
  poiId: string;
  poi: POI;
  addedAt: Date;
}

export interface Cart {
  cartId: string;
  userId: string;
  destination: string;
  items: CartItem[];
  prefs: {
    vibes: string[];
    budget: string;
  };
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

export interface Itinerary {
  itineraryId: string;
  travelers: {
    adults: number;
    children: { age: number }[];
  };
  duration: number;
  variants: ItineraryVariant[];
  selectedVariantId?: string;
  status: 'draft' | 'booked' | 'active' | 'completed' | 'cancelled';
  coordinatorId?: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface Booking {
  bookingId: string;
  itineraryId: string;
  items: {
    poiId: string;
    vendorId: string;
    date: string;
    time: string;
    cost: number;
    status: 'pending' | 'confirmed' | 'cancelled';
  }[];
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial';
  createdAt: Date;
}

export interface DisruptionEvent {
  eventId: string;
  type: 'delay' | 'cancellation' | 'weather' | 'traffic' | 'manual';
  poiId?: string;
  itineraryId: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: Date;
  resolvedAt?: Date;
}

export interface RebalanceOption {
  optionId: string;
  description: string;
  costDelta: number;
  preferenceRetention: number;
  feasibility: number;
  changes: {
    poiId: string;
    newTime?: string;
    newPoiId?: string;
    action: 'shift' | 'replace' | 'remove' | 'add';
  }[];
}

export interface ParetoPoint {
  cost: number;
  experienceScore: number;
  paceScore: number;
  variantId: string;
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