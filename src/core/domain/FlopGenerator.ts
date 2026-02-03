import type { Card, Flop, Rank, Suit } from './types';
import { analyzeFlop } from './FlopAnalysis';

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export const generateRandomFlop = (): { flop: Flop, analysis: ReturnType<typeof analyzeFlop> } => {
  const deck: Card[] = [];
  for (const r of RANKS) {
    for (const s of SUITS) {
      deck.push({ rank: r, suit: s });
    }
  }

  // Shuffle and pick 3
  const flopCards: Card[] = [];
  while (flopCards.length < 3) {
    const idx = Math.floor(Math.random() * deck.length);
    flopCards.push(deck[idx]);
    deck.splice(idx, 1);
  }

  const flop = flopCards as Flop;
  const analysis = analyzeFlop(flop);

  return { flop, analysis };
};

export const generateBalancedRound = (count: number = 4): Array<{ flop: Flop, analysis: ReturnType<typeof analyzeFlop> }> => {
  let attempts = 0;
  while (attempts < 100) {
    const round: Array<{ flop: Flop, analysis: ReturnType<typeof analyzeFlop> }> = [];
    const usedStructures = new Set<string>();
    const textureCounts: Record<string, number> = {};
    
    // Try to fill the round
    let roundAttempts = 0;
    while (round.length < count && roundAttempts < 50) {
      const candidate = generateRandomFlop();
      
      // Constraint 1: Unique Structure
      if (usedStructures.has(candidate.analysis.structure)) {
        roundAttempts++;
        continue;
      }

      // Constraint 2: Limited Texture Repetition (Max 2)
      // Actually user said "count of same texture should not be higher than [implied low number]"
      // Let's set limit to 2.
      const currentTexCount = textureCounts[candidate.analysis.texture] || 0;
      if (currentTexCount >= 2) {
        roundAttempts++;
        continue;
      }

      // Accept candidate
      round.push(candidate);
      usedStructures.add(candidate.analysis.structure);
      textureCounts[candidate.analysis.texture] = (textureCounts[candidate.analysis.texture] || 0) + 1;
    }

    if (round.length === count) {
      return round;
    }
    attempts++;
  }

  // Fallback if constraints too hard (unlikely for 4 tables)
  return Array.from({ length: count }).map(() => generateRandomFlop());
};
