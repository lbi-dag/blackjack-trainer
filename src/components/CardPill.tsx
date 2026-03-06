import type { Card } from '../types/game';

const SUIT_LABELS: Record<Card['suit'], string> = {
  spades: 'S',
  hearts: 'H',
  diamonds: 'D',
  clubs: 'C',
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

  return (
    <div
      className={`flex min-w-[88px] flex-col rounded-2xl border px-4 py-3 shadow-lg ${accentClasses}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <span className="text-2xl font-black tracking-wide text-cream">{card.rank}</span>
      <span className={`text-sm font-semibold uppercase tracking-[0.25em] ${SUIT_COLORS[card.suit]}`}>
        {SUIT_LABELS[card.suit]}
      </span>
    </div>
  );
}
