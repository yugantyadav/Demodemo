import { NextRequest, NextResponse } from 'next/server';
import { allPOIs } from '@/lib/mock-data';

interface CartRequestBody {
  userId?: string;
  destination?: string;
  items?: string[];
  prefs?: {
    vibes?: string[];
    budget?: string;
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as CartRequestBody;
  const items = (body.items || []).map(id => allPOIs.find(p => p.poiId === id)).filter(Boolean);

  return NextResponse.json({
    cartId: `c_${Date.now()}`,
    userId: body.userId || 'u_123',
    destination: body.destination || 'Rajasthan',
    items,
    prefs: body.prefs || { vibes: [], budget: 'mid' },
    totalCost: items.reduce((sum, p) => sum + (p?.cost || 0), 0),
  });
}

export async function GET() {
  return NextResponse.json({ message: 'Cart endpoint ready' });
}