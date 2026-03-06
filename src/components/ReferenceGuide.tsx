import { BookOpen, CircleHelp, Shield, SplitSquareHorizontal, Zap } from 'lucide-react';
import { hardRows, pairRows, softRows } from '../utils/strategyReference';

const moveCards = [
  {
    title: 'Hit',
    copy: 'Take another card when your total is too weak to stand profitably.',
    icon: Zap,
  },
  {
    title: 'Stand',
    copy: 'Keep your current total and let the dealer try to bust.',
    icon: Shield,
  },
  {
    title: 'Double',
    copy: 'Double your bet, take exactly one card, and use it when the dealer is vulnerable.',
    icon: CircleHelp,
  },
  {
    title: 'Split',
    copy: 'Turn a pair into two hands when basic strategy says the two-hand EV is higher.',
    icon: SplitSquareHorizontal,
  },
];

function StrategyTable({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle: string;
  rows: { label: string; content: string }[];
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-charcoal-950/60 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-cream">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm table-fixed">
          <colgroup>
            <col className="w-[7.5rem] md:w-[8.5rem]" />
            <col />
          </colgroup>
          <tbody className="divide-y divide-white/10">
            {rows.map(({ label, content }) => (
              <tr key={label} className="align-top">
                <th className="bg-white/5 px-4 py-3 text-left font-semibold text-brass-400">{label}</th>
                <td className="px-4 py-3 text-slate-200">{content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ReferenceGuide() {
  return (
    <section className="table-shell felt-sheen p-6 md:p-8">
      <div className="grid gap-6">
        <div className="rounded-[1.75rem] border border-brass-400/20 bg-charcoal-950/65 p-5">
          <div className="flex items-center gap-3 text-brass-400">
            <BookOpen className="h-5 w-5" />
            <p className="text-xs uppercase tracking-[0.34em]">Reference Page</p>
          </div>
          <h2 className="mt-3 text-2xl font-black text-cream">Blackjack Rules and Strategy Guide</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Use this page to review the exact assumptions behind the trainer: standard 4-8 deck blackjack,
            dealer stands on soft 17, doubling after splits is allowed, and late surrender is available on the
            opening hand.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.75rem] border border-white/10 bg-charcoal-950/60 p-5">
            <h3 className="text-lg font-bold text-cream">Core Rules</h3>
            <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-200">
              <p>
                The goal is to finish closer to 21 than the dealer without going over. Face cards count as 10,
                aces count as 1 or 11, and blackjacks are two-card 21s.
              </p>
              <p>
                The dealer must hit until at least 17 and stands on soft 17 in this trainer. That slightly improves
                player standing decisions compared with H17 games.
              </p>
              <p>
                Double after split is allowed. That matters for hands like 4,4, where splitting is only attractive
                because a follow-up double can be profitable.
              </p>
              <p>
                Surrender is late surrender and only applies to the original two-card hand before any other action.
                Use it to lose half a bet instead of playing a very poor situation to completion.
              </p>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-charcoal-950/60 p-5">
            <h3 className="text-lg font-bold text-cream">Dealer Up-card Heuristic</h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="font-semibold text-emerald-200">Weak dealer cards: 2 through 6</p>
                <p className="mt-1 leading-6 text-slate-200">
                  These are bust cards. Basic strategy often stands or doubles here to pressure the dealer.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
                <p className="font-semibold text-rose-200">Strong dealer cards: 7 through ace</p>
                <p className="mt-1 leading-6 text-slate-200">
                  These are made-hand starters. Basic strategy becomes more aggressive with hits and selective surrender.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[1.75rem] border border-white/10 bg-charcoal-950/60 p-5">
          <h3 className="text-lg font-bold text-cream">Move Glossary</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {moveCards.map(({ title, copy, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 text-brass-400">
                  <Icon className="h-5 w-5" />
                  <h4 className="font-semibold text-cream">{title}</h4>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 text-brass-400">
                <CircleHelp className="h-5 w-5" />
                <h4 className="font-semibold text-cream">Surrender</h4>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Give up the hand immediately and lose only half the bet. Save it for the worst opening spots.
              </p>
            </article>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <StrategyTable
            title="Hard Totals"
            subtitle="Use these rules when your hand has no ace counted as 11."
            rows={hardRows}
          />
          <StrategyTable
            title="Soft Totals"
            subtitle="Use these rules when an ace is still being counted as 11."
            rows={softRows}
          />
          <StrategyTable
            title="Pairs"
            subtitle="Split decisions depend heavily on DAS being allowed."
            rows={pairRows}
          />
        </div>

        <section className="rounded-[1.75rem] border border-brass-400/20 bg-brass-400/10 p-5">
          <h3 className="text-lg font-bold text-cream">High-Value Memory Anchors</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-200 md:grid-cols-2">
            <p>Always split aces and 8s.</p>
            <p>Never split 10s or 5s.</p>
            <p>Stand on hard 12 against 4-6, but hit it against 2-3 and 7-A.</p>
            <p>Double 11 against everything except a dealer ace.</p>
            <p>Surrender hard 16 against 9, 10, or ace when surrender is available.</p>
            <p>Soft 18 is strong but tricky: double vs 3-6, stand vs 2, 7, 8, and hit vs 9-A.</p>
          </div>
        </section>
      </div>
    </section>
  );
}
