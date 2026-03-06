import type { Card, HandValue, PairRank, Rank, Suit, TrainingHand, TrainingMode } from '../types/game';

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SOFT_MODE_RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9'];
const TEN_VALUE_RANKS: Rank[] = ['10', 'J', 'Q', 'K'];

function getCardValueByRank(rank: Rank): number {
  if (rank === 'A') {
    return 11;
  }

  if (TEN_VALUE_RANKS.includes(rank)) {
    return 10;
  }

  return Number(rank);
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createCard(rank: Rank, suit: Suit = randomItem(SUITS)): Card {
  return {
    rank,
    suit,
    value: getCardValueByRank(rank),
  };
}

export function drawRandomCard(): Card {
  return createCard(randomItem(RANKS));
}

export function getHandValue(cards: Card[]): HandValue {
  let total = cards.reduce((sum, card) => sum + card.value, 0);
  let acesAsEleven = cards.filter((card) => card.rank === 'A').length;

  while (total > 21 && acesAsEleven > 0) {
    total -= 10;
    acesAsEleven -= 1;
  }

  return {
    total,
    isSoft: acesAsEleven > 0,
  };
}

export function isSoftHand(cards: Card[]): boolean {
  return getHandValue(cards).isSoft;
}

export function isPair(cards: Card[]): boolean {
  return cards.length === 2 && cards[0].value === cards[1].value;
}

export function getDealerKey(card: Card): '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'A' {
  return card.rank === 'A'
    ? 'A'
    : (String(Math.min(card.value, 10)) as '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10');
}

export function getPairRank(cards: Card[]): PairRank | null {
  if (!isPair(cards)) {
    return null;
  }

  if (cards[0].rank === 'A' && cards[1].rank === 'A') {
    return 'A';
  }

  if (cards[0].value === 10) {
    return '10';
  }

  return String(cards[0].value) as PairRank;
}

function createSoftTrainingHand(): TrainingHand {
  return {
    playerCards: [createCard('A'), createCard(randomItem(SOFT_MODE_RANKS))],
    dealerCard: drawRandomCard(),
  };
}

function isPlayableTrainingHand(playerCards: Card[]): boolean {
  return getHandValue(playerCards).total < 21;
}

function createRandomTrainingHand(): TrainingHand {
  while (true) {
    const playerCards = [drawRandomCard(), drawRandomCard()];

    if (!isPlayableTrainingHand(playerCards)) {
      continue;
    }

    return {
      playerCards,
      dealerCard: drawRandomCard(),
    };
  }
}

export function createTrainingHand(mode: TrainingMode): TrainingHand {
  return mode === 'soft' ? createSoftTrainingHand() : createRandomTrainingHand();
}

export function getHandDescriptor(cards: Card[]): string {
  const pairRank = getPairRank(cards);
  const handValue = getHandValue(cards);

  if (pairRank) {
    return pairRank === 'A' ? 'Pair of aces' : `Pair of ${pairRank}s`;
  }

  return handValue.isSoft ? `Soft ${handValue.total}` : `Hard ${handValue.total}`;
}
