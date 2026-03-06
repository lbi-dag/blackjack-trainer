import { createTrainingHand, getHandValue, isPair, isSoftHand } from './deckUtils';

describe('deckUtils', () => {
  it('treats aces as 1 or 11 correctly', () => {
    expect(
      getHandValue([
        { rank: 'A', suit: 'spades', value: 11 },
        { rank: '9', suit: 'hearts', value: 9 },
      ]),
    ).toEqual({ total: 20, isSoft: true });

    expect(
      getHandValue([
        { rank: 'A', suit: 'spades', value: 11 },
        { rank: '9', suit: 'hearts', value: 9 },
        { rank: '8', suit: 'clubs', value: 8 },
      ]),
    ).toEqual({ total: 18, isSoft: false });
  });

  it('soft mode produces only non-pair soft totals', () => {
    for (let index = 0; index < 50; index += 1) {
      const hand = createTrainingHand('soft');
      expect(isSoftHand(hand.playerCards)).toBe(true);
      expect(isPair(hand.playerCards)).toBe(false);
      expect(getHandValue(hand.playerCards).total).toBeGreaterThanOrEqual(13);
      expect(getHandValue(hand.playerCards).total).toBeLessThanOrEqual(20);
    }
  });

  it('random mode produces playable two-card hands', () => {
    for (let index = 0; index < 50; index += 1) {
      const hand = createTrainingHand('random');
      expect(hand.playerCards).toHaveLength(2);
      expect(getHandValue(hand.playerCards).total).toBeLessThan(21);
      expect(hand.dealerCard.rank).toBeTruthy();
    }
  });
});
