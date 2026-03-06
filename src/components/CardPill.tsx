import { Club, Diamond, Heart, Spade } from 'lucide-react';
import type { Card } from '../types/game';

const SUIT_ICONS: Record<Card['suit'], typeof Spade> = {
  spades: Spade,
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
};

const SUIT_COLORS: Record<Card['suit'], string> = {
  spades: 'text-slate-200',
  hearts: 'text-rose-300',
  diamonds: 'text-amber-300',
  clubs: 'text-emerald-300',
};

type CardPillProps = {
  card: Card;
  accent?: 'dealer' | 'player';
};

export function CardPill({ card, accent = 'player' }: CardPillProps) {
  const accentClasses =
    accent === 'dealer'
      ? 'border-brass-400/40 bg-charcoal-900/85'
      : 'border-emerald-400/30 bg-felt-900/50';
  const SuitIcon = SUIT_ICONS[card.suit];

  return (
    <div
      className={`flex min-w-[88px] flex-col rounded-2xl border px-4 py-3 shadow-lg ${accentClasses}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <span className="text-2xl font-black tracking-wide text-cream">{card.rank}</span>
      <span className={`mt-1 ${SUIT_COLORS[card.suit]}`}>
        <SuitIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </div>
  );
}
