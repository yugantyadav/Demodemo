import { NextRequest, NextResponse } from 'next/server';
import { allPOIs, vibeOptions } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { destination, vibes, budget } = body;

  let pois = [...allPOIs];

  if (Array.isArray(vibes) && vibes.length > 0) {
    pois = pois
      .map(poi => {
        const vibeScore = Object.entries(poi.vibeScores).reduce((best, [key, val]) => {
          return vibes.includes(key) ? Math.max(best, val) : best;
        }, 0);
        return { poi, score: vibeScore };
      })
      .sort((a, b) => b.score - a.score)
      .filter(({ score }) => score > 0.3)
      .map(({ poi }) => poi);
  }

  if (budget === 'budget') {
    pois = pois.filter(p => p.cost <= 500);
  } else if (budget === 'luxury') {
    pois = pois.filter(p => p.cost >= 400 || p.category === 'hotel');
  }

  return NextResponse.json({
    destination,
    vibes: vibes?.map((v: string) => ({
      id: v,
      label: vibeOptions.find(o => o.id === v)?.label || v,
      emoji: vibeOptions.find(o => o.id === v)?.emoji || '✨',
    })),
    count: pois.length,
    pois: pois.slice(0, 20),
  });
}