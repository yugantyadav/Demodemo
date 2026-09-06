import { NextRequest, NextResponse } from 'next/server';
import { allPOIs } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const {
    itineraryId,
    affectedPoiId,
    reason = 'Schedule change',
  } = body;

  const affected = allPOIs.find(p => p.poiId === affectedPoiId);
  const alternatives = allPOIs
    .filter(p => p.poiId !== affectedPoiId && p.crowdLevel !== 'high' && p.category !== 'hotel')
    .slice(0, 3)
    .map((poi, i) => ({
      optionId: `opt_${i + 1}`,
      description: i === 0
        ? `Keep tour shifted +2h (+₹1,200 transfer)`
        : i === 1
          ? `Replace ${affected?.name} with ${poi.name} (₹0 extra)`
          : `Move ${affected?.name} to Day ${i + 2} + add ${poi.name} food walk`,
      costDelta: i === 0 ? 1200 : 0,
      preferenceRetention: i === 0 ? 0.9 : 0.75,
      feasibility: 0.95 - i * 0.1,
      changes: [
        {
          poiId: poi.poiId,
          action: i === 0 ? 'shift' : 'replace',
          newTime: i === 0 ? '+2h' : undefined,
          newPoiId: i === 0 ? undefined : poi.poiId,
        },
      ],
    }));

  return NextResponse.json({
    rebalanceId: `rb_${Date.now()}`,
    itineraryId,
    triggeredBy: reason,
    affectedPoi: affected,
    alternatives,
    simulationCount: 200,
  });
}