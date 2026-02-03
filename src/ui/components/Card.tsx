import React from 'react';
import type { Card as CardType } from '../../core/domain/types';

// Map suits/colors
const SUIT_SYMBOLS: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' };

const SUIT_BG_COLORS: Record<string, string> = { 
  s: 'bg-zinc-800 border-2 border-zinc-600 shadow-zinc-900/50',  
  h: 'bg-red-600 border-2 border-red-500 shadow-red-900/50',   
  d: 'bg-blue-600 border-2 border-blue-500 shadow-blue-900/50',  
  c: 'bg-green-600 border-2 border-green-500 shadow-green-900/50' 
};

const SUIT_TEXT_COLORS: Record<string, string> = { 
  s: 'text-zinc-900',
  h: 'text-red-500',
  d: 'text-blue-500',
  c: 'text-green-500'
};

interface Props {
  card: CardType;
  theme?: 'color' | 'white';
}

export const Card: React.FC<Props> = ({ card, theme = 'color' }) => {
  const symbol = SUIT_SYMBOLS[card.suit];
  const isTen = card.rank === 'T';
  
  // Theme: White
  if (theme === 'white') {
     const textColor = SUIT_TEXT_COLORS[card.suit];
     return (
      <div className={`
        relative w-14 h-20 bg-white rounded-lg shadow-lg select-none overflow-hidden border border-zinc-200
        ${textColor} hover:scale-105 transition-transform duration-200
      `}>
        {/* Top Left */}
        <div className="absolute top-0.5 left-2 flex flex-col items-center leading-none">
          <span className="font-bold text-4xl tracking-tighter">{card.rank === 'T' ? '10' : card.rank}</span>
        </div>
        
        {/* Symbol moved to bottom right */}
        <div className="absolute bottom-[-4px] right-0 text-5xl leading-none">
          {symbol}
        </div>
      </div>
     );
  }

  // Theme: Color (Default)
  const bgClass = SUIT_BG_COLORS[card.suit];
  return (
    <div className={`
      relative w-14 h-20 rounded-lg shadow-lg select-none text-white overflow-hidden
      ${bgClass} hover:scale-105 transition-transform duration-200
    `}>
      {/* Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-black/10 pointer-events-none" />
      
      {/* Top Left: Rank + Symbol */}
      <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none z-10">
        <span className={`font-black tracking-tighter leading-none ${isTen ? 'text-xl' : 'text-2xl'}`}>{card.rank === 'T' ? '10' : card.rank}</span>
        <span className="text-xs">{symbol}</span>
      </div>

      {/* Bottom Right: Huge Rank filling the space */}
      <div className="absolute bottom-0 right-2 leading-none z-0 opacity-90 pb-1">
         <span className="font-black tracking-tighter text-[2.75rem]">{card.rank === 'T' ? '10' : card.rank}</span>
      </div>
    </div>
  );
};
