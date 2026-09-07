import { POI, ItineraryVariant, ItineraryDay, ItinerarySlot, ParetoPoint } from './types';

function timeOfDay(order: number): string {
  const baseHour = 9 + order * 2.5;
  const hour = Math.floor(baseHour);
  const min = Math.round((baseHour - hour) * 60);
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function clusterPoisByCity(pois: POI[]): Map<string, POI[]> {
  const cityMap = new Map<string, POI[]>();
  for (const poi of pois) {
    const city = poi.city;
    if (!cityMap.has(city)) cityMap.set(city, []);
    cityMap.get(city)!.push(poi);
  }
  return cityMap;
}

function distributePoisAcrossDays(pois: POI[], numDays: number): POI[][] {
  if (pois.length === 0) return Array.from({ length: numDays }, () => []);
  if (numDays <= 1) return [pois];

  const cityMap = clusterPoisByCity(pois);
  const cities = Array.from(cityMap.keys());

  const days: POI[][] = Array.from({ length: numDays }, () => []);
  const slotsPerDay = Math.max(1, Math.ceil(pois.length / numDays));

  let dayIndex = 0;
  for (const city of cities) {
    const cityPois = cityMap.get(city)!;
    for (const poi of cityPois) {
      if (dayIndex >= numDays) dayIndex = numDays - 1;
      days[dayIndex].push(poi);
      if (days[dayIndex].length >= slotsPerDay && dayIndex < numDays - 1) {
        dayIndex++;
      }
    }
  }

  return days;
}

function buildDays(pois: POI[], numDays: number): ItineraryDay[] {
  if (pois.length === 0) return [];

  const actualDays = Math.max(1, Math.min(numDays, Math.ceil(pois.length / 3)));
  const distributedDays = distributePoisAcrossDays(pois, actualDays);

  return distributedDays.map((dayPois, i) => {
    const slots: ItinerarySlot[] = [];
    const sorted = [...dayPois].sort((a, b) => a.lat + a.lng - (b.lat + b.lng));

    for (let j = 0; j < sorted.length; j++) {
      const poi = sorted[j];
      slots.push({
        time: timeOfDay(j),
        poiId: poi.poiId,
        poi,
        type: 'poi',
        duration: poi.estimatedDuration,
        notes: j === 0 ? 'Starting point' : undefined,
      });
    }

    return {
      day: i + 1,
      city: dayPois[0]?.city || 'Rajasthan',
      hotelId: 'h_1',
      slots,
    };
  });
}

function computeScore(pois: POI[]): number {
  if (pois.length === 0) return 0;
  const avgRating = pois.reduce((s, p) => s + p.rating, 0) / pois.length;
  const uniqueCities = new Set(pois.map(p => p.city)).size;
  return Math.min(10, Math.round((avgRating * 1.5 + uniqueCities * 0.5) * 100) / 100);
}

function computeCost(pois: POI[]): number {
  const baseCost = pois.reduce((s, p) => s + p.cost, 0);
  return Math.round(baseCost * 1.4);
}

export function loadGAItineraries(selectedPois: POI[], numDays: number = 1): ItineraryVariant[] {
  if (!selectedPois.length) return [];

  const allPois = [...selectedPois];

  // Most Relaxed: ~40% of POIs, rest days built in
  const relaxedCount = Math.max(1, Math.floor(allPois.length * 0.4));
  const relaxedPois = allPois.slice(0, relaxedCount);

  // Max Coverage: all POIs
  const coveragePois = [...allPois];

  // Balanced: ~70% of POIs
  const balancedCount = Math.max(1, Math.floor(allPois.length * 0.7));
  const balancedPois = allPois.slice(0, balancedCount);

  const relaxed: ItineraryVariant = {
    id: 'it_relaxed',
    name: 'Most Relaxed',
    description: 'Fewer stops, more time to soak it all in',
    days: buildDays(relaxedPois, numDays),
    totalCost: computeCost(relaxedPois),
    experienceScore: computeScore(relaxedPois),
    paceScore: 2.5,
    paretoRank: 2,
  };

  const coverage: ItineraryVariant = {
    id: 'it_coverage',
    name: 'Max Coverage',
    description: 'See it all, packed efficient itinerary',
    days: buildDays(coveragePois, numDays),
    totalCost: computeCost(coveragePois),
    experienceScore: computeScore(coveragePois),
    paceScore: 8.5,
    paretoRank: 3,
  };

  const balancedIt: ItineraryVariant = {
    id: 'it_balanced',
    name: 'Balanced',
    description: 'The sweet spot between coverage and comfort',
    days: buildDays(balancedPois, numDays),
    totalCost: computeCost(balancedPois),
    experienceScore: computeScore(balancedPois),
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
