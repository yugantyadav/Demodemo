import { POI, ItineraryVariant, ItineraryDay, ItinerarySlot, ParetoPoint } from './types';

function timeOfDay(order: number): string {
  const baseHour = 9 + order * 2.5;
  const hour = Math.floor(baseHour);
  const min = Math.round((baseHour - hour) * 60);
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function buildDay(pois: POI[], day: number): ItineraryDay {
  const slots: ItinerarySlot[] = [];
  const sorted = [...pois].sort((a, b) => a.lat + a.lng - (b.lat + b.lng));

  for (let i = 0; i < sorted.length; i++) {
    const poi = sorted[i];
    slots.push({
      time: timeOfDay(i),
      poiId: poi.poiId,
      poi,
      type: 'poi',
      duration: poi.estimatedDuration,
      notes: i === 0 ? 'Starting point' : undefined,
    });
  }

  return {
    day,
    city: pois[0]?.city || 'Rajasthan',
    hotelId: 'h_1',
    slots,
  };
}

export function loadGAItineraries(selectedPois: POI[]): ItineraryVariant[] {
  if (!selectedPois.length) return [];

  const pois = selectedPois;
  const balanced = [...pois];

  // Create variant: Most Relaxed (fewer per day, more rest)
  const relaxedPois = balanced.slice(0, Math.min(3, balanced.length));

  // Create variant: Max Coverage (all POIs, packed schedule)
  const coveragePois = [...balanced];

  // Create variant: Balanced (a curated mix)
  const balancedAll = balanced.length > 8 ? balanced.slice(0, 6) : balanced;

  const relaxed: ItineraryVariant = {
    id: 'it_relaxed',
    name: 'Most Relaxed',
    description: 'Fewer stops, more time to soak it all in',
    days: [1].map(d => buildDay(relaxedPois, d)),
    totalCost: relaxedPois.reduce((s, p) => s + p.cost, 0) * 1.4,
    experienceScore: 7.2,
    paceScore: 2.5,
    paretoRank: 2,
  };

  const coverage: ItineraryVariant = {
    id: 'it_coverage',
    name: 'Max Coverage',
    description: 'See it all, packed efficient itinerary',
    days: [1].map(d => buildDay(coveragePois, d)),
    totalCost: coveragePois.reduce((s, p) => s + p.cost, 0) * 1.4,
    experienceScore: 9.1,
    paceScore: 8.5,
    paretoRank: 3,
  };

  const balancedIt: ItineraryVariant = {
    id: 'it_balanced',
    name: 'Balanced',
    description: 'The sweet spot between coverage and comfort',
    days: [1].map(d => buildDay(balancedAll, d)),
    totalCost: balancedAll.reduce((s, p) => s + p.cost, 0) * 1.4,
    experienceScore: 8.7,
    paceScore: 5.5,
    paretoRank: 1,
  };

  return [relaxed, coverage, balancedIt];
}

export function computeParetoFrontier(variants: ItineraryVariant[]): ParetoPoint[] {
  const points: ParetoPoint[] = variants.map(v => ({
    cost: v.totalCost,
    experienceScore: v.experienceScore,
    paceScore: v.paceScore,
    variantId: v.id,
  }));

  // Simple non-dominated filter (lower cost AND higher experience)
  const dominated = new Set<number>();
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      if (
        points[j].cost <= points[i].cost &&
        points[j].experienceScore >= points[i].experienceScore
      ) {
        dominated.add(i);
        break;
      }
    }
  }

  return points.filter((_, i) => !dominated.has(i));
}