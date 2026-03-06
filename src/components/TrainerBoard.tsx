import { AlertTriangle, CheckCircle2, Forward, Lightbulb, ShieldAlert } from 'lucide-react';
import { CardPill } from './CardPill';
import type { ActionAvailability, FeedbackState, Move, TrainingHand } from '../types/game';
import type { StrategyHint } from '../utils/strategyReference';

type TrainerBoardProps = {
  hand: TrainingHand;
  playerLabel: string;
  feedback: FeedbackState;
  actionAvailability: ActionAvailability;
  hint: StrategyHint;
  showHint: boolean;
  onMove: (move: Move) => void;
  onNextHand: () => void;
  onToggleHint: () => void;
};

const ACTIONS: { move: Move; label: string }[] = [
  { move: 'hit', label: 'Hit' },
  { move: 'stand', label: 'Stand' },
  { move: 'double', label: 'Double' },
  { move: 'split', label: 'Split' },
  { move: 'surrender', label: 'Surrender' },
];

function FeedbackPanel({ feedback, onNextHand }: Pick<TrainerBoardProps, 'feedback' | 'onNextHand'>) {
  if (feedback.status === 'correct') {
    return (
      <div className="animate-pulse-success rounded-3xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-emerald-100">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6" />
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-200/80">Perfect</p>
            <p className="text-lg font-semibold">Correct move. Dealing the next hand...</p>
          </div>
        </div>
      </div>
    );
  }

  if (feedback.status === 'incorrect') {
    return (
      <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 px-5 py-4 text-rose-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 text-rose-300" />
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/80">Mistake</p>
              <p className="mt-1 text-lg font-semibold">Correct move: {feedback.correctMove}</p>
              <p className="mt-2 text-sm leading-6 text-rose-50/90">{feedback.explanation}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNextHand}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Forward className="h-4 w-4" />
            Next Hand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-slate-300">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-brass-400" />
        <p className="text-sm leading-6">
          Choose the perfect opening move for the player hand against the dealer up-card.
        </p>
      </div>
    </div>
  );
}

export function TrainerBoard({
  hand,
  playerLabel,
  feedback,
  actionAvailability,
  hint,
  showHint,
  onMove,
  onNextHand,
  onToggleHint,
}: TrainerBoardProps) {
  const controlsLocked = feedback.status !== 'idle';

  return (
    <section className="table-shell felt-sheen p-6 md:p-8">
      <div className="grid gap-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-charcoal-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Dealer Up-card</p>
          <div className="mt-4 flex items-center gap-4">
            <CardPill card={hand.dealerCard} accent="dealer" />
          </div>
        </div>

        <FeedbackPanel feedback={feedback} onNextHand={onNextHand} />

        <div className="rounded-[1.75rem] border border-emerald-500/15 bg-felt-950/60 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Player Hand</p>
            <p className="mt-2 text-xl font-semibold text-cream">{playerLabel}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            {hand.playerCards.map((card, index) => (
              <CardPill key={`${card.rank}-${card.suit}-${index}`} card={card} />
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-brass-400/20 bg-charcoal-950/60 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Memorization Aid</p>
              <p className="mt-1 text-sm text-slate-300">Reveal the matching reference-table rule for this hand shape.</p>
            </div>
            <button
              type="button"
              onClick={onToggleHint}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brass-400/40 bg-brass-400/10 px-4 py-2 text-sm font-semibold text-brass-400 transition hover:bg-brass-400/15"
            >
              <Lightbulb className="h-4 w-4" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>

          {showHint ? (
            <div className="mt-4 rounded-3xl border border-brass-400/25 bg-brass-400/10 px-5 py-4 text-slate-100">
              <p className="text-xs uppercase tracking-[0.3em] text-brass-400">{hint.category}</p>
              <p className="mt-2 text-lg font-semibold text-cream">{hint.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{hint.content}</p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {ACTIONS.map(({ move, label }) => {
            const available = actionAvailability[move];
            return (
              <button
                key={move}
                type="button"
                onClick={() => onMove(move)}
                disabled={!available || controlsLocked}
                className={`rounded-2xl px-4 py-4 text-base font-black uppercase tracking-[0.18em] transition ${
                  available && !controlsLocked
                    ? 'border border-brass-400/40 bg-charcoal-900/90 text-cream hover:-translate-y-0.5 hover:border-brass-400 hover:bg-charcoal-800'
                    : 'cursor-not-allowed border border-white/5 bg-white/5 text-slate-500'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
