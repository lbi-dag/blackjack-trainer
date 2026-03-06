import type { Card, Rank } from '../types/game';
import { getPerfectMove } from './strategyEngine';

function makeCard(rank: Rank): Card {
  return {
    rank,
    suit: 'spades',
    value: rank === 'A' ? 11 : ['10', 'J', 'Q', 'K'].includes(rank) ? 10 : Number(rank),
  };
}

function getMove(playerRanks: [Rank, Rank], dealerRank: Rank) {
  return getPerfectMove({
    playerCards: [makeCard(playerRanks[0]), makeCard(playerRanks[1])],
    dealerCard: makeCard(dealerRank),
    canDouble: true,
    canSplit: true,
    canSurrender: true,
  });
}

describe('getPerfectMove', () => {
  it('matches core hard total decisions', () => {
    expect(getMove(['10', '6'], '10')).toBe('surrender');
    expect(getMove(['10', '2'], '4')).toBe('stand');
    expect(getMove(['5', '6'], '6')).toBe('double');
  });

  it('matches core soft total decisions', () => {
    expect(getMove(['A', '7'], '3')).toBe('double');
    expect(getMove(['A', '7'], '9')).toBe('hit');
    expect(getMove(['A', '8'], '6')).toBe('stand');
    expect(getMove(['A', '4'], '10')).toBe('hit');
    expect(getMove(['A', '5'], 'A')).toBe('hit');
  });

  it('matches pair decisions', () => {
    expect(getMove(['8', '8'], '10')).toBe('surrender');
    expect(getMove(['9', '9'], '7')).toBe('stand');
    expect(getMove(['A', 'A'], '6')).toBe('split');
  });
});

