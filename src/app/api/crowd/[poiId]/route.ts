import { NextRequest, NextResponse } from 'next/server';
import { rajasthanPOIs } from '@/lib/mock-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ poiId: string }> }
) {
  const { poiId } = await params;
  const poi = rajasthanPOIs.find(p => p.poiId === poiId);

  if (!poi) {
    return NextResponse.json({ error: 'POI not found' }, { status: 404 });
  }

  const crowdData = {
    poiId,
    name: poi.name,
    currentLevel: poi.crowdLevel,
    occupancyPercent: poi.crowdLevel === 'high' ? 85 : poi.crowdLevel === 'medium' ? 55 : 25,
    peakHours: ['09:00-11:00', '17:00-19:00'],
    recommendedSlot: poi.crowdLevel === 'high' ? '14:00-16:00' : 'Anytime',
  };

  return NextResponse.json(crowdData);
}