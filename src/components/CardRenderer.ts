export const suits: Record<string, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣',
  '♠': '♠',
  '♥': '♥',
  '♦': '♦',
  '♣': '♣',
};

const SUIT_BG_COLORS: Record<string, string> = { 
  s: 'bg-zinc-800 border-2 border-zinc-600 shadow-zinc-900/50',  
  h: 'bg-red-600 border-2 border-red-500 shadow-red-900/50',   
  d: 'bg-blue-600 border-2 border-blue-500 shadow-blue-900/50',  
  c: 'bg-green-600 border-2 border-green-500 shadow-green-900/50' 
};

export function renderCard(rank: string, suit: string): string {
  // If suit is missing, pick a random one
  if (!suit) {
    const suitKeys = ['s', 'h', 'd', 'c'];
    suit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
  }

  // Normalize suit
  let suitKey = suit.toLowerCase();
  if (['♠'].includes(suit)) suitKey = 's';
  if (['♥'].includes(suit)) suitKey = 'h';
  if (['♦'].includes(suit)) suitKey = 'd';
  if (['♣'].includes(suit)) suitKey = 'c';

  const symbol = suits[suitKey] || suits[suit] || '?';
  const bgClass = SUIT_BG_COLORS[suitKey] || 'bg-zinc-800';
  const isTen = rank === 'T' || rank === '10';
  const displayRank = isTen ? '10' : rank.toUpperCase();
  
  // Premium Design matching Card.tsx (Color Theme)
  // Size: w-14 h-20 (same as Card.tsx default, which is larger than previous 48px)
  return `
    <div class="relative w-14 h-20 rounded-lg shadow-lg select-none text-white overflow-hidden ${bgClass} inline-block align-middle mx-1 transform hover:scale-105 transition-transform duration-200">
      <!-- Gloss Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-black/10 pointer-events-none"></div>
      
      <!-- Top Left: Rank + Symbol -->
      <div class="absolute top-1 left-1.5 flex flex-col items-center leading-none z-10">
        <span class="font-black tracking-tighter leading-none ${isTen ? 'text-xl' : 'text-2xl'}">${displayRank}</span>
        <span class="text-xs">${symbol}</span>
      </div>

      <!-- Bottom Right: Huge Rank -->
      <div class="absolute bottom-0 right-2 leading-none z-0 opacity-90 pb-1">
         <span class="font-black tracking-tighter text-[2.75rem] font-sans">${displayRank}</span>
      </div>
    </div>
  `;
}

// Helper to parse "Ah Ks" string
export function renderHand(handString: string, _size?: string): string {
  // Regex to match card pairs like "Ah", "Ks", "10d", or symbol "A♠", or just "A"
  // Added support for 10 being '10' or 'T'
  const cardRegex = /([2-9TJQKA]|10)([shdc♠♥♦♣]?)/gi;
  const cards: string[] = [];
  
  let match;
  while ((match = cardRegex.exec(handString)) !== null) {
    cards.push(renderCard(match[1], match[2]));
  }
  
  if (cards.length === 0) return '';
  
  // Container for the hand
  return `<div class="inline-flex gap-2 items-center align-middle mx-1">${cards.join('')}</div>`;
}
