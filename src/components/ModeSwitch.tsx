import { Layers3, Sparkles } from 'lucide-react';
import type { TrainingMode } from '../types/game';

type ModeSwitchProps = {
  mode: TrainingMode;
  onChange: (mode: TrainingMode) => void;
};

const OPTIONS: { label: string; mode: TrainingMode; icon: typeof Layers3 }[] = [
  { label: 'Random Mode', mode: 'random', icon: Layers3 },
  { label: 'Soft Hands Only', mode: 'soft', icon: Sparkles },
];

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row">
      {OPTIONS.map(({ label, mode: optionMode, icon: Icon }) => {
        const active = optionMode === mode;
        return (
          <button
            key={optionMode}
            type="button"
            onClick={() => onChange(optionMode)}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'border-brass-400 bg-brass-400/15 text-brass-400'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
            }`}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
