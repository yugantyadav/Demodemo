import { NextRequest, NextResponse } from 'next/server';
import { sampleCoordinators } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { itineraryId, requiredLanguages, groupSize } = body;

  let best = sampleCoordinators[0];
  let bestScore = -1;

  for (const coordinator of sampleCoordinators) {
    let score = coordinator.rating * 10 - coordinator.workload * 5;
    if (Array.isArray(requiredLanguages)) {
      const matches = requiredLanguages.filter((lang: string) =>
        coordinator.languages.includes(lang)
      ).length;
      score += matches * 15;
    }
    if (groupSize && groupSize > 4) score += 5;
    if (coordinator.workload < 3) score += 10;
    if (score > bestScore) {
      bestScore = score;
      best = coordinator;
    }
  }

  return NextResponse.json({
    dispatched: true,
    itineraryId,
    coordinator: best,
    matchScore: bestScore,
    reason: `${best.name} — speaks ${best.languages.slice(0, 2).join(', ')}, ${best.rating}★ rating, ${best.workload} current tours`,
  });
}