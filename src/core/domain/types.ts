export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Flop = [Card, Card, Card];


export type BoardTexture = 'Rainbow' | 'Two-tone' | 'Monotone';
export type BoardStructure = 'HHH' | 'HHM' | 'HHL' | 'HMM' | 'HML' | 'HLL' | 'MMM' | 'MML' | 'MLL' | 'LLL';
export type BoardPairing = 'Unpaired' | 'Paired' | 'Trips';
export type BoardConnectivity = 'Disconnected' | 'Connected';

export interface FlopCategory {
  texture: BoardTexture;
  structure: BoardStructure;
  pairing: BoardPairing;
  connectivity: BoardConnectivity;
  hasAce: boolean;
}
