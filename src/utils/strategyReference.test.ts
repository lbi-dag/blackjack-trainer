import type { Card } from '../types/game';
import { getStrategyHint } from './strategyReference';

function makeCard(rank: Card['rank']): Card {
  return {
    rank,
    suit: 'spades',
    value: rank === 'A' ? 11 : ['10', 'J', 'Q', 'K'].includes(rank) ? 10 : Number(rank),
  };
}

describe('getStrategyHint', () => {
  it('returns pair-table hints for pairs', () => {
    expect(getStrategyHint([makeCard('8'), makeCard('8')])).toEqual({
      category: 'Pairs',
      label: '8,8',
      content: 'Split vs 2-9, surrender vs 10 or A if allowed.',
    });
  });

  it('returns soft-table hints for soft hands', () => {
    expect(getStrategyHint([makeCard('A'), makeCard('7')])).toEqual({
      category: 'Soft Totals',
      label: 'A,7',
      content: 'Double vs 3-6, stand vs 2,7,8, hit vs 9-A.',
    });
  });

  it('returns hard-table hints for hard totals', () => {
    expect(getStrategyHint([makeCard('10'), makeCard('2')])).toEqual({
      category: 'Hard Totals',
      label: '12',
      content: 'Stand vs 4-6, hit vs 2-3 and 7-A.',
    });
  });
});
