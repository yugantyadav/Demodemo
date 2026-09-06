import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCrowdColor(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'var(--color-semantic-success)';
    case 'medium': return 'var(--color-semantic-warning)';
    case 'high': return 'var(--color-semantic-error)';
  }
}

export function getCrowdLabel(level: 'low' | 'medium' | 'high'): string {
  switch (level) {
    case 'low': return 'Quiet';
    case 'medium': return 'Moderate';
    case 'high': return 'Crowded';
  }
}

export function getVibeColor(vibe: string): string {
  const vibeColors: Record<string, string> = {
    recharge: 'var(--color-category-mint-6)',
    adventure: 'var(--color-category-tomato-6)',
    romance: 'var(--color-category-crimson-6)',
    culture: 'var(--color-category-indigo-6)',
    family: 'var(--color-category-amber-6)',
    spiritual: 'var(--color-category-violet-6)',
    nightlife: 'var(--color-category-plum-6)',
    foodie: 'var(--color-category-orange-6)',
  };
  return vibeColors[vibe.toLowerCase()] || 'var(--color-accent-blue)';
}

export function getVibeBg(vibe: string): string {
  const vibeBgs: Record<string, string> = {
    recharge: 'var(--color-category-mint-4)',
    adventure: 'var(--color-category-tomato-4)',
    romance: 'var(--color-category-crimson-4)',
    culture: 'var(--color-category-indigo-4)',
    family: 'var(--color-category-amber-4)',
    spiritual: 'var(--color-category-violet-4)',
    nightlife: 'var(--color-category-plum-4)',
    foodie: 'var(--color-category-orange-4)',
  };
  return vibeBgs[vibe.toLowerCase()] || 'var(--color-accent-blue-1)';
}

export function getVibeIcon(vibe: string): string {
  const icons: Record<string, string> = {
    recharge: '🧘',
    adventure: '🏔️',
    romance: '💕',
    culture: '🏛️',
    family: '👨‍👩‍👧',
    spiritual: '🕉️',
    nightlife: '🌙',
    foodie: '🍽️',
  };
  return icons[vibe.toLowerCase()] || '✨';
}