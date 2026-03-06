import { useEffect, useState } from 'react';
import { BookOpen, BrainCircuit, Spade } from 'lucide-react';
import { ModeSwitch } from './components/ModeSwitch';
import { ReferenceGuide } from './components/ReferenceGuide';
import { StatsBar } from './components/StatsBar';
import { TrainerBoard } from './components/TrainerBoard';
import type { ActionAvailability, FeedbackState, Move, TrainingHand, TrainingMode } from './types/game';
import { createTrainingHand, getHandDescriptor, isPair } from './utils/deckUtils';
import { getStrategyHint } from './utils/strategyReference';
import { describeDecision, formatMoveLabel, getPerfectMove } from './utils/strategyEngine';

const CORRECT_DELAY_MS = 900;
type AppView = 'trainer' | 'reference';

function getActionAvailability(hand: TrainingHand): ActionAvailability {
  return {
    hit: true,
    stand: true,
    double: true,
    split: isPair(hand.playerCards),
    surrender: true,
  };
}

export default function App() {
  const [view, setView] = useState<AppView>('trainer');
  const [mode, setMode] = useState<TrainingMode>('random');
  const [currentHand, setCurrentHand] = useState<TrainingHand>(() => createTrainingHand('random'));
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({ status: 'idle' });
  const [showHint, setShowHint] = useState(false);

  const dealNextHand = (nextMode: TrainingMode = mode) => {
    setCurrentHand(createTrainingHand(nextMode));
    setFeedback({ status: 'idle' });
    setShowHint(false);
  };

  useEffect(() => {
    dealNextHand(mode);
  }, [mode]);

  useEffect(() => {
    if (feedback.status !== 'correct') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dealNextHand(mode);
    }, CORRECT_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [feedback.status, mode]);

  const actionAvailability = getActionAvailability(currentHand);
  const perfectMove = getPerfectMove({
    playerCards: currentHand.playerCards,
    dealerCard: currentHand.dealerCard,
    canDouble: actionAvailability.double,
    canSplit: actionAvailability.split,
    canSurrender: actionAvailability.surrender,
  });
  const hint = getStrategyHint(currentHand.playerCards);

  const handleMove = (move: Move) => {
    if (feedback.status !== 'idle') {
      return;
    }

    setAttempted((previous) => previous + 1);

    if (move === perfectMove) {
      setCorrect((previous) => previous + 1);
      setFeedback({ status: 'correct' });
      return;
    }

    setFeedback({
      status: 'incorrect',
      correctMove: formatMoveLabel(perfectMove),
      explanation: describeDecision({
        playerCards: currentHand.playerCards,
        dealerCard: currentHand.dealerCard,
        move: perfectMove,
      }),
    });
  };

  return (
    <main className="min-h-screen px-4 py-8 text-cream sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-[2rem] border border-brass-400/20 bg-charcoal-950/70 p-6 shadow-table">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-brass-400/30 bg-brass-400/10 p-3 text-brass-400">
                  <Spade className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.34em] text-brass-400/80">Blackjack Lab</p>
                  <h1 className="mt-1 text-3xl font-black tracking-tight text-cream md:text-4xl">
                    Basic Strategy Trainer
                  </h1>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Drill the correct opening move for every starting hand under 4-8 deck, S17, DAS rules.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trainer Style</p>
                  <p className="text-sm font-semibold text-slate-100">Flashcard Decision Reps</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setView('trainer')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                view === 'trainer'
                  ? 'border-brass-400 bg-brass-400/15 text-brass-400'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <BrainCircuit className="h-4 w-4" />
              Trainer
            </button>
            <button
              type="button"
              onClick={() => setView('reference')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                view === 'reference'
                  ? 'border-brass-400 bg-brass-400/15 text-brass-400'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Rules & Strategy
            </button>
          </div>
        </header>

        {view === 'trainer' ? (
          <>
            <StatsBar correct={correct} attempted={attempted} mode={mode} />
            <ModeSwitch mode={mode} onChange={setMode} />
            <TrainerBoard
              hand={currentHand}
              playerLabel={getHandDescriptor(currentHand.playerCards)}
              feedback={feedback}
              actionAvailability={actionAvailability}
              hint={hint}
              showHint={showHint}
              onMove={handleMove}
              onNextHand={() => dealNextHand(mode)}
              onToggleHint={() => setShowHint((previous) => !previous)}
            />
          </>
        ) : (
          <ReferenceGuide />
        )}
      </div>
    </main>
  );
}
