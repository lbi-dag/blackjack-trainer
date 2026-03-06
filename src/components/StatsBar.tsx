import { Percent, Target } from 'lucide-react';
import type { TrainingMode } from '../types/game';

type StatsBarProps = {
  correct: number;
  attempted: number;
  mode: TrainingMode;
};

export function StatsBar({ correct, attempted, mode }: StatsBarProps) {
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);

  return (
    <section className="grid gap-4 rounded-3xl border border-white/10 bg-charcoal-900/70 p-4 md:grid-cols-[1fr_auto]">
      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-brass-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Accuracy</p>
          <p className="text-lg font-semibold text-cream">
            {correct}/{attempted} Correct - {accuracy}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Percent className="h-5 w-5 text-emerald-300" />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Current Drill</p>
          <p className="text-sm font-semibold text-slate-200">
            {mode === 'soft' ? 'Soft Hands Only' : 'Random Mode'}
          </p>
        </div>
      </div>
    </section>
  );
}
