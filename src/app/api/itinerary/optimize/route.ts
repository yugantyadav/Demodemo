import { NextRequest, NextResponse } from 'next/server';
import { loadGAItineraries } from '@/lib/ga';
import { rajasthanPOIs } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const poiIds: string[] = body.poiIds || [];
  const selected = poiIds.map(id => rajasthanPOIs.find(p => p.poiId === id)).filter(Boolean) as typeof rajasthanPOIs;

  const variants = loadGAItineraries(selected);

  return NextResponse.json({
    itineraryId: `it_${Date.now()}`,
    travelers: body.travelers || { adults: 2, children: [] },
    duration: body.duration || 5,
    variants,
  });
}