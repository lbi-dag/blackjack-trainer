import type {
  DealerKey,
  Move,
  PairRank,
  StrategyCode,
  StrategyDecisionInput,
  StrategyExplanationInput,
} from '../types/game';
import { getDealerKey, getHandValue, getPairRank, isPair, isSoftHand } from './deckUtils';

const DEALER_KEYS: DealerKey[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

function buildTable(...moves: StrategyCode[]): Record<DealerKey, StrategyCode> {
  return DEALER_KEYS.reduce<Record<DealerKey, StrategyCode>>((table, key, index) => {
    table[key] = moves[index];
    return table;
  }, {} as Record<DealerKey, StrategyCode>);
}

const HARD_TOTAL_TABLE: Record<number, Record<DealerKey, StrategyCode>> = {
  5: buildTable('H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'),
  6: buildTable('H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'),
  7: buildTable('H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'),
  8: buildTable('H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'),
  9: buildTable('H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  10: buildTable('Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H'),
  11: buildTable('Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H'),
  12: buildTable('H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'),
  13: buildTable('S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'),
  14: buildTable('S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'),
  15: buildTable('S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'),
  16: buildTable('S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'),
  17: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
  18: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
  19: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
  20: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
};

const SOFT_TOTAL_TABLE: Record<number, Record<DealerKey, StrategyCode>> = {
  13: buildTable('H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  14: buildTable('H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  15: buildTable('H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  16: buildTable('H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  17: buildTable('H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'),
  18: buildTable('S', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'),
  19: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
  20: buildTable('S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'),
};

const SPLIT_TABLE: Partial<Record<PairRank, DealerKey[]>> = {
  A: DEALER_KEYS,
  '9': ['2', '3', '4', '5', '6', '8', '9'],
  '8': ['2', '3', '4', '5', '6', '7', '8', '9'],
  '7': ['2', '3', '4', '5', '6', '7'],
  '6': ['2', '3', '4', '5', '6'],
  '4': ['5', '6'],
  '3': ['2', '3', '4', '5', '6', '7'],
  '2': ['2', '3', '4', '5', '6', '7'],
};

function resolveCode(code: StrategyCode, canDouble: boolean): Move {
  if (code === 'H') {
    return 'hit';
  }

  if (code === 'S') {
    return 'stand';
  }

  if (code === 'Dh') {
    return canDouble ? 'double' : 'hit';
  }

  return canDouble ? 'double' : 'stand';
}

function shouldSurrender(input: StrategyDecisionInput, dealerKey: DealerKey): boolean {
  if (!input.canSurrender) {
    return false;
  }

  const pairRank = getPairRank(input.playerCards);
  const handValue = getHandValue(input.playerCards);

  if (pairRank === '8') {
    return dealerKey === '10' || dealerKey === 'A';
  }

  if (isPair(input.playerCards)) {
    return false;
  }

  if (handValue.total === 16) {
    return dealerKey === '9' || dealerKey === '10' || dealerKey === 'A';
  }

  if (handValue.total === 15) {
    return dealerKey === '10';
  }

  return false;
}

function shouldSplit(pairRank: PairRank | null, dealerKey: DealerKey): boolean {
  if (!pairRank) {
    return false;
  }

  return SPLIT_TABLE[pairRank]?.includes(dealerKey) ?? false;
}

export function getPerfectMove(input: StrategyDecisionInput): Move {
  const dealerKey = getDealerKey(input.dealerCard);
  const handValue = getHandValue(input.playerCards);
  const pairRank = getPairRank(input.playerCards);

  if (shouldSurrender(input, dealerKey)) {
    return 'surrender';
  }

  if (input.canSplit && shouldSplit(pairRank, dealerKey)) {
    return 'split';
  }

  if (isSoftHand(input.playerCards) && handValue.total <= 20) {
    return resolveCode(SOFT_TOTAL_TABLE[handValue.total][dealerKey], input.canDouble);
  }

  const boundedHardTotal = Math.min(Math.max(handValue.total, 5), 20);
  return resolveCode(HARD_TOTAL_TABLE[boundedHardTotal][dealerKey], input.canDouble);
}

function formatDealerReference(dealerKey: DealerKey): string {
  return dealerKey === 'A' ? 'dealer ace' : `dealer ${dealerKey}`;
}

export function describeDecision(input: StrategyExplanationInput): string {
  const dealerKey = getDealerKey(input.dealerCard);
  const move =
    input.move ??
    getPerfectMove({
      playerCards: input.playerCards,
      dealerCard: input.dealerCard,
      canDouble: true,
      canSplit: isPair(input.playerCards),
      canSurrender: true,
    });
  const handValue = getHandValue(input.playerCards);
  const pairRank = getPairRank(input.playerCards);

  if (move === 'split') {
    if (pairRank === 'A') {
      return 'Always split aces because each ace can become a strong new hand starting from 11.';
    }

    if (pairRank === '8') {
      return 'Always split 8s because hard 16 is a weak hand and two fresh 8s have more upside.';
    }

    if (pairRank === '9') {
      return `Split 9s against ${formatDealerReference(dealerKey)} because two hands outperform standing on 18 here.`;
    }

    return `Split this pair against ${formatDealerReference(dealerKey)} because DAS rules make two separate hands more profitable.`;
  }

  if (move === 'surrender') {
    return `Surrender saves chips because this starting hand is a long-term loser against ${formatDealerReference(dealerKey)}.`;
  }

  if (move === 'double') {
    if (handValue.isSoft) {
      return `Double this soft ${handValue.total} because the ace protects you from busting while the dealer shows weakness.`;
    }

    return `Double ${handValue.total} because this is a strong one-card improvement spot against ${formatDealerReference(dealerKey)}.`;
  }

  if (move === 'stand') {
    if (handValue.isSoft) {
      return `Stand on soft ${handValue.total} because your hand is already strong enough and the dealer can make mistakes.`;
    }

    if (handValue.total >= 17) {
      return `Stand on ${handValue.total} because you already have a made hand that should not improve by hitting.`;
    }

    return `Stand because ${handValue.total} is best defended by letting the dealer try to bust from ${formatDealerReference(dealerKey)}.`;
  }

  if (handValue.isSoft) {
    return `Hit this soft ${handValue.total} because the ace keeps you flexible while you chase a stronger total.`;
  }

  return `Hit because ${handValue.total} is too weak to stand profitably against ${formatDealerReference(dealerKey)}.`;
}

export function formatMoveLabel(move: Move): string {
  return move.charAt(0).toUpperCase() + move.slice(1);
}
