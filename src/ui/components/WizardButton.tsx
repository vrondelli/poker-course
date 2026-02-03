import React from 'react';

type ButtonColor = 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'yellow' | 'pink' | 'teal' | 'violet';

interface Props {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  color: ButtonColor;
  className?: string;
  allowCustomColors?: boolean;
  correct?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  size?: 'md' | 'sm';
  customBg?: string;
  customStyle?: React.CSSProperties;
}

const COLOR_VARIANTS: Record<ButtonColor, string> = {
  blue: 'bg-blue-600 border-blue-400 shadow-blue-900/40',
  purple: 'bg-purple-600 border-purple-400 shadow-purple-900/40',
  orange: 'bg-orange-600 border-orange-400 shadow-orange-900/40',
  green: 'bg-green-600 border-green-400 shadow-green-900/40',
  red: 'bg-red-600 border-red-400 shadow-red-900/40',
  yellow: 'bg-yellow-500 border-yellow-300 shadow-yellow-900/40',
  pink: 'bg-pink-500 border-pink-300 shadow-pink-900/40',
  teal: 'bg-teal-500 border-teal-300 shadow-teal-900/40',
  violet: 'bg-violet-600 border-violet-400 shadow-violet-900/40',
};

const TEXT_COLOR_VARIANTS: Record<ButtonColor, string> = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  pink: 'text-pink-400',
  teal: 'text-teal-400',
  violet: 'text-violet-400',
};

export const WizardButton: React.FC<Props> = ({ 
  label, 
  selected, 
  onClick, 
  color, 
  className = '',
  allowCustomColors = false,
  correct,
  wrong,
  disabled,
  size = 'md',
  customBg,
  customStyle
}) => {
  const isSm = size === 'sm';
  const baseStyles = `${isSm ? 'w-[110px] md:w-[130px]' : 'w-[180px] md:w-[220px]'} ${isSm ? 'px-1' : 'px-4'} ${isSm ? 'h-9 md:h-10 text-[10px] md:text-sm border-2' : 'h-14 md:h-16 text-lg md:text-xl border-2'} flex items-center justify-center font-bold rounded-lg transition-all relative overflow-hidden`;
  
  const activeBg = customBg || COLOR_VARIANTS[color];
  
  let dynamicStyles = "";
  if (selected) {
    dynamicStyles = `${activeBg} text-white scale-[1.1] border-white ring-4 ring-white/50 z-30 shadow-[0_0_25px_rgba(255,255,255,0.25)] brightness-110`;
  } else {
    // Unselected state: Muted and outlined
    const colorText = TEXT_COLOR_VARIANTS[color];
    const borderClass = (customBg || allowCustomColors) ? `border-zinc-700/80` : `border-zinc-700/50`;
    dynamicStyles = `bg-zinc-900/60 ${borderClass} ${colorText} opacity-70 hover:opacity-100 hover:bg-zinc-800 hover:border-zinc-600 scale-100`;
  }
  
  if (correct) {
    dynamicStyles = "bg-green-600 border-white text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-[1.1] z-30 ring-4 ring-green-400/50";
  } else if (wrong) {
    dynamicStyles = "bg-red-600/30 border-red-500/50 text-red-400 opacity-60 scale-95 blur-[0.5px]";
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${dynamicStyles}
        ${!disabled && !selected ? "active:scale-95" : ""}
        ${className}
      `}
      style={!selected ? customStyle : undefined}
    >
      <div className={`absolute inset-0 transition-opacity duration-300 ${selected ? 'opacity-20' : 'opacity-0'} bg-gradient-to-br from-white to-transparent`} />
      
      <span className="relative z-10 flex items-center gap-1.5 justify-center w-full">
        <span className="truncate">{label}</span>
        {selected && !correct && !wrong && <span className={`${isSm ? 'text-[8px]' : 'text-xs'} animate-pulse`}>●</span>}
        {correct && <span className={isSm ? 'text-[10px]' : 'text-lg'}>✓</span>}
        {wrong && <span className={isSm ? 'text-[10px]' : 'text-lg'}>✕</span>}
      </span>
      {correct && (
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none" />
      )}
    </button>
  );
};
