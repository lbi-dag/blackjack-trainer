export type Move = 'hit' | 'stand' | 'double' | 'split' | 'surrender';
export type TrainingMode = 'random' | 'soft';
export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type DealerKey = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'A';
export type PairRank = 'A' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
export type StrategyCode = 'H' | 'S' | 'Dh' | 'Ds';

export interface Card {
  rank: Rank;
  suit: Suit;
  value: number;
}

export interface HandValue {
  total: number;
  isSoft: boolean;
}

export interface TrainingHand {
  playerCards: Card[];
  dealerCard: Card;
}

export interface StrategyDecisionInput {
  playerCards: Card[];
  dealerCard: Card;
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
}

export interface StrategyExplanationInput {
  playerCards: Card[];
  dealerCard: Card;
  move?: Move;
}

export interface ActionAvailability {
  hit: boolean;
  stand: boolean;
  double: boolean;
  split: boolean;
  surrender: boolean;
}

export interface FeedbackState {
  status: 'idle' | 'correct' | 'incorrect';
  correctMove?: string;
  explanation?: string;
}
