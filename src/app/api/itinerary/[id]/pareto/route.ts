import { NextRequest, NextResponse } from 'next/server';
import { computeParetoFrontier } from '@/lib/ga';
import { loadGAItineraries } from '@/lib/ga';
import { allPOIs } from '@/lib/mock-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const variants = loadGAItineraries(allPOIs.slice(0, 6));

  return NextResponse.json({
    itineraryId: id,
    variants,
    paretoFrontier: computeParetoFrontier(variants),
  });
}