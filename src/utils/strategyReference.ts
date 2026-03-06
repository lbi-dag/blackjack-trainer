import type { Card } from '../types/game';
import { getHandValue, getPairRank, isSoftHand } from './deckUtils';

export type StrategyReferenceRow = {
  label: string;
  content: string;
};

export type StrategyHint = {
  category: 'Hard Totals' | 'Soft Totals' | 'Pairs';
  label: string;
  content: string;
};

export const hardRows: StrategyReferenceRow[] = [
  { label: '17+', content: 'Stand against all dealer up-cards.' },
  { label: '13-16', content: 'Stand vs 2-6, hit vs 7-A.' },
  { label: '12', content: 'Stand vs 4-6, hit vs 2-3 and 7-A.' },
  { label: '11', content: 'Double vs 2-10, hit vs A.' },
  { label: '10', content: 'Double vs 2-9, hit vs 10 or A.' },
  { label: '9', content: 'Double vs 3-6, otherwise hit.' },
  { label: '8 or less', content: 'Always hit.' },
];

export const softRows: StrategyReferenceRow[] = [
  { label: 'A,8-A,9', content: 'Stand against all dealer up-cards.' },
  { label: 'A,7', content: 'Double vs 3-6, stand vs 2,7,8, hit vs 9-A.' },
  { label: 'A,6', content: 'Double vs 3-6, otherwise hit.' },
  { label: 'A,4-A,5', content: 'Double vs 4-6, otherwise hit.' },
  { label: 'A,2-A,3', content: 'Double vs 5-6, otherwise hit.' },
];

export const pairRows: StrategyReferenceRow[] = [
  { label: 'A,A', content: 'Always split.' },
  { label: '10,10', content: 'Never split. Stand.' },
  { label: '9,9', content: 'Split vs 2-6 and 8-9, stand vs 7, 10, A.' },
  { label: '8,8', content: 'Split vs 2-9, surrender vs 10 or A if allowed.' },
  { label: '7,7', content: 'Split vs 2-7, otherwise hit.' },
  { label: '6,6', content: 'Split vs 2-6, otherwise hit.' },
  { label: '5,5', content: 'Never split. Play as hard 10.' },
  { label: '4,4', content: 'Split vs 5-6 only with DAS, otherwise hit.' },
  { label: '2,2 and 3,3', content: 'Split vs 2-7, otherwise hit.' },
];

function findRow(rows: StrategyReferenceRow[], label: string): StrategyReferenceRow {
  const row = rows.find((entry) => entry.label === label);

  if (!row) {
    throw new Error(`Missing strategy reference row for ${label}`);
  }

  return row;
}

export function getStrategyHint(cards: Card[]): StrategyHint {
  const pairRank = getPairRank(cards);

  if (pairRank) {
    const pairLabelMap: Record<string, string> = {
      A: 'A,A',
      '10': '10,10',
      '9': '9,9',
      '8': '8,8',
      '7': '7,7',
      '6': '6,6',
      '5': '5,5',
      '4': '4,4',
      '3': '2,2 and 3,3',
      '2': '2,2 and 3,3',
    };
    const label = pairLabelMap[pairRank];
    const row = findRow(pairRows, label);

    return {
      category: 'Pairs',
      label: row.label,
      content: row.content,
    };
  }

  const handValue = getHandValue(cards);

  if (isSoftHand(cards)) {
    const softLabel =
      handValue.total >= 19
        ? 'A,8-A,9'
        : handValue.total === 18
          ? 'A,7'
          : handValue.total === 17
            ? 'A,6'
            : handValue.total >= 15
              ? 'A,4-A,5'
              : 'A,2-A,3';
    const row = findRow(softRows, softLabel);

    return {
      category: 'Soft Totals',
      label: row.label,
      content: row.content,
    };
  }

  const hardLabel =
    handValue.total >= 17
      ? '17+'
      : handValue.total >= 13
        ? '13-16'
        : handValue.total === 12
          ? '12'
          : handValue.total === 11
            ? '11'
            : handValue.total === 10
              ? '10'
              : handValue.total === 9
                ? '9'
                : '8 or less';
  const row = findRow(hardRows, hardLabel);

  return {
    category: 'Hard Totals',
    label: row.label,
    content: row.content,
  };
}
