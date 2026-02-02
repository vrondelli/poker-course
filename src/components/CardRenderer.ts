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

export const suitColors: Record<string, string> = {
  s: '#030303ff', // Zinc 200 (White-ish for dark mode)
  h: '#ef4444', // Red 500
  d: '#3b82f6', // Blue 500
  c: '#22c55e', // Green 500
  '♠': '#030303ff',
  '♥': '#ef4444',
  '♦': '#3b82f6',
  '♣': '#22c55e',
};

// Override for 2-color if preferred, but 4-color is better for courses.
// Let's stick to 4-color for clarity in study material.
// d = Blue, c = Green. 

export function renderCard(rank: string, suit: string): string {
  // If suit is missing, pick a random one
  if (!suit) {
    const suitKeys = ['s', 'h', 'd', 'c'];
    suit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
  }

  const symbol = suits[suit.toLowerCase()] || suits[suit] || '?';
  const color = suitColors[suit.toLowerCase()] || suitColors[suit] || '#e4e4e7';
  
  // Premium SVG Card Design
  // Rounded rect background, rank/suit in corners, big suit in center (faded?)
  return `
    <div class="poker-card" style="color: ${color}">
      <div class="card-corner top-left">
        <span class="rank">${rank.toUpperCase()}</span>
        <span class="suit">${symbol}</span>
      </div>
      <div class="card-center">
        ${symbol}
      </div>
      <div class="card-corner bottom-right">
        <span class="rank">${rank.toUpperCase()}</span>
        <span class="suit">${symbol}</span>
      </div>
    </div>
  `;
}

// Helper to parse "Ah Ks" string
export function renderHand(handString: string, size?: string): string {
  // Regex to match card pairs like "Ah", "Ks", "10d", or symbol "A♠", or just "A"
  // Added support for 10 being '10' or 'T'
  const cardRegex = /([2-9TJQKA]|10)([shdc♠♥♦♣]?)/gi;
  const cards: string[] = [];
  
  let match;
  while ((match = cardRegex.exec(handString)) !== null) {
    cards.push(renderCard(match[1], match[2]));
  }
  
  if (cards.length === 0) return '';
  
  const sizeClass = size ? ` ${size}` : '';
  return `<div class="poker-hand${sizeClass}">${cards.join('')}</div>`;
}
