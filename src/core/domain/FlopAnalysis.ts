import type { Flop, FlopCategory, BoardStructure, Rank } from './types';

const RANK_VALUES: Record<Rank, number> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11,
  'T': 10, '9': 9, '8': 8, '7': 7,
  '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const getRankType = (rank: Rank): 'H' | 'M' | 'L' => {
  const Val = RANK_VALUES[rank];
  if (Val >= 10) return 'H'; // A - T
  if (Val >= 6) return 'M';  // 9 - 6
  return 'L';                // 5 - 2
};

const getConnectivityScore = (ranks: Rank[]): number => {
  const boardVals = Array.from(new Set(ranks.map(r => RANK_VALUES[r])));
  if (boardVals.length < 2) return 0; // Paired boards handled differently or lower
  
  let score = 0;
  // Possible hand combinations
  for (let r1 = 2; r1 <= 14; r1++) {
    for (let r2 = r1; r2 <= 14; r2++) {
      const combined = Array.from(new Set([...boardVals, r1, r2])).sort((a, b) => a - b);
      if (combined.length < 4) continue;

      // Check all subsets of 4 that use at least 2 board cards
      let found = false;
      for (let i = 0; i < combined.length; i++) {
        for (let j = i + 1; j < combined.length; j++) {
          for (let k = j + 1; k < combined.length; k++) {
            for (let l = k + 1; l < combined.length; l++) {
              const subset = [combined[i], combined[j], combined[k], combined[l]];
              
              // Count how many board cards are in this subset
              let boardCount = 0;
              for (const v of subset) if (boardVals.includes(v)) boardCount++;
              
              if (boardCount >= 2) {
                // Check span for straight draw (4 cards in span of 5)
                // Normal straight
                if (subset[3] - subset[0] <= 4) {
                  found = true;
                  break;
                }
                // Wheel straight (A=1)
                if (subset.includes(14)) {
                  const wheelSubset = subset.map(v => v === 14 ? 1 : v).sort((a,b) => a-b);
                  if (wheelSubset[3] - wheelSubset[0] <= 4) {
                    found = true;
                    break;
                  }
                }
              }
            }
            if (found) break;
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) score++;
    }
  }
  return score;
};

export const analyzeFlop = (flop: Flop): FlopCategory => {
  const suits = flop.map(c => c.suit);
  const ranks = flop.map(c => c.rank);
  const distinctSuits = new Set(suits).size;

  let texture: FlopCategory['texture'] = 'Rainbow';
  if (distinctSuits === 1) texture = 'Monotone';
  else if (distinctSuits === 2) texture = 'Two-tone';

  const distinctRanks = new Set(ranks).size;
  let pairing: FlopCategory['pairing'] = 'Unpaired';
  if (distinctRanks === 1) pairing = 'Trips';
  else if (distinctRanks === 2) pairing = 'Paired';

  // Structure (H/M/L) Calculation
  const types = ranks.map(getRankType);
  types.sort((a, b) => {
    const order = { H: 3, M: 2, L: 1 };
    return order[b] - order[a];
  });
  
  const structure = types.join('') as BoardStructure;

  const score = getConnectivityScore(ranks);
  let connectivity: FlopCategory['connectivity'] = 'Disconnected';
  if (score >= 16) connectivity = 'Highly Connected';
  else if (score >= 5) connectivity = 'Connected';
  else if (score >= 1) connectivity = 'Low Connected';

  const hasAce = ranks.includes('A');

  return { texture, structure, pairing, connectivity, hasAce };
};

export const getStructureOptions = (flop: Flop): BoardStructure[] => {
  const ranks = flop.map(c => c.rank);
  const correctStructure = analyzeFlop(flop).structure;
  
  // Count known categories - SYNC WITH getRankType
  let hCount = 0;
  let mCount = 0;
  let lCount = 0;

  ranks.forEach(r => {
    const type = getRankType(r);
    if (type === 'H') hCount++;
    else if (type === 'M') mCount++;
    else lCount++;
  });

  const availableStructures: BoardStructure[] = ['HHH', 'HHM', 'HHL', 'HMM', 'HML', 'HLL', 'MMM', 'MML', 'MLL', 'LLL'];

  // Filter impossible options based on strictly visible cards
  // Rule: An option is valid only if it has AT LEAST the count of H/M/L that we see?
  // Actually, we see ALL 3 cards properly categorized. 
  // If we see A (H), 8 (M), 2 (L), we see H, M, L.
  // The structure IS HML. There is no ambiguity if you know the ranks.
  // The puzzle is recognizing the ranks quickly.
  // If we remove impossible ones, we remove everything except HML.
  // So we must be lenient. Maybe we assume the user misreads ONE card?
  // Strategy: The user wants "if I have HML it does no make sense to show LLL".
  // LLL implies 3 Low cards. If I see an Ace, LLL is impossible.
  // So: Filter out options that contradict the presence of High or Low cards specifically?
  // Let's filter out options that miss a category that is present.
  // If we have an H, the option MUST have an H.
  // If we have an L, the option MUST have an L.
  
  const filtered = availableStructures.filter(opt => {
    // Parse option roughly
    const optH = (opt.match(/H/g) || []).length;
    const optL = (opt.match(/L/g) || []).length;

    // Strict check: if looking at board we see X Highs, can we have option with Y Highs?
    // We see 3 cards. We know the category of each.
    // If we follow the user request literally, we might trivial game.
    // But let's follow the "obvious" rule: "LLL" is obvious wrong if Ace is there.
    // So: If hCount > 0, optH must be > 0.
    // If lCount > 0, optL must be > 0.
    // If mCount > 0, optM must be > 0.
    
    if (hCount > 0 && optH === 0) return false;
    if (lCount > 0 && optL === 0) return false;
    // We don't enforce M count as strictly maybe? M is easy to mistake for H or L?
    // Let's stick to H and L as anchors.
    return true;
  });

  // Ensure correct answer is there
  if (!filtered.includes(correctStructure)) {
    filtered.push(correctStructure);
  }

  // Retrieve 4 options (Correct + 3 Random from Filtered)
  const finalOptions = new Set<BoardStructure>();
  finalOptions.add(correctStructure);

  const shuffled = filtered.filter(o => o !== correctStructure).sort(() => Math.random() - 0.5);
  
  for (const opt of shuffled) {
    if (finalOptions.size >= 4) break;
    finalOptions.add(opt);
  }

  // If we still don't have 4 (e.g. HHH only allows HHH, HHL, HML, HLL??), fill with others even if "impossible" to reach 4?
  // Or just show fewer? User said "limit it to 4 answers". Maybe fewer is ok if others are impossible.
  // But standard UI is grid 4.
  // If we have < 4, fill with remaining "impossible" ones as obvious fillers.
  if (finalOptions.size < 4) {
    const remaining = availableStructures.filter(o => !finalOptions.has(o)).sort(() => Math.random() - 0.5);
    for (const opt of remaining) {
      if (finalOptions.size >= 4) break;
      finalOptions.add(opt);
    }
  }

  // Sort them to standard order for consistent UI? Or random?
  // Random position is better for training.
  return Array.from(finalOptions).sort(() => Math.random() - 0.5);
};
