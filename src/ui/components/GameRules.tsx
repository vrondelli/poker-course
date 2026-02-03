import React from 'react';

interface RankBoxProps {
  label: string;
  name: string;
  range: string;
  colorClass: string;
  hoverClass: string;
}

const RankBox: React.FC<RankBoxProps> = ({ label, name, range, colorClass, hoverClass }) => (
  <div className={`bg-zinc-800/80 p-1.5 md:p-2 rounded-xl border border-zinc-700/50 hover:${hoverClass} transition-all group max-w-[90px] md:max-w-[110px] mx-auto w-full text-center`}>
    <div className={`${colorClass} font-black text-lg md:text-xl mb-0.5 group-hover:scale-110 transition-transform`}>{label}</div>
    <div className="text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">{name}</div>
    <div className="text-white font-black text-xs md:text-sm mt-0.5">{range}</div>
  </div>
);

interface TextureRowProps {
  label: React.ReactNode;
  description: React.ReactNode;
}

const TextureRow: React.FC<TextureRowProps> = ({ label, description }) => (
  <li className="flex justify-between items-center bg-zinc-800/40 p-2 md:p-3 rounded-lg border border-zinc-800 hover:border-blue-500/30 transition-all group max-w-sm mx-auto w-full h-10 md:h-auto">
    <span className="font-bold text-sm md:text-base group-hover:brightness-125 transition-all">{label}</span>
    <span className="font-black text-sm md:text-lg">{description}</span>
  </li>
);

export const GameRules: React.FC = () => {
  const ranks: RankBoxProps[] = [
    { label: 'H', name: 'High', range: 'A - T', colorClass: 'text-blue-400', hoverClass: 'border-blue-500/50' },
    { label: 'M', name: 'Mid', range: '9 - 6', colorClass: 'text-yellow-400', hoverClass: 'border-yellow-500/50' },
    { label: 'L', name: 'Low', range: '5 - 2', colorClass: 'text-red-400', hoverClass: 'border-red-500/50' },
  ];

  const textures = [
    { 
      id: 'rainbow',
      label: <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">Rainbow</span>, 
      description: <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent italic">3 Naipes</span> 
    },
    { 
      id: 'twotone',
      label: <span className="text-yellow-400">Two-tone</span>, 
      description: <span className="text-yellow-400 italic">2 Naipes</span> 
    },
    { 
      id: 'monotone',
      label: <span className="text-purple-600">Monotone</span>, 
      description: <span className="text-purple-600 italic">1 Naipe</span> 
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-[2rem] p-4 md:p-6 text-left w-full md:w-[70%] mx-auto shadow-2xl my-2 relative ring-1 ring-white/10">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[120px] rounded-full -ml-32 -mb-32"></div>
      </div>

      <h3 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent mb-3 md:mb-4 text-center tracking-tight px-4 uppercase italic">
        Guia de Classificação
      </h3>
      
      <div className="flex flex-col gap-3 lg:gap-6 px-1 md:px-6 relative z-10 w-full">
        
        {/* Top Row: Structure & Texture */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 w-full">
          {/* Agrupamento de Ranks (Structure) */}
          <div className="flex-1 space-y-2 md:space-y-3">
             <div className="flex items-center gap-3 border-b border-zinc-800 pb-1 md:pb-2 mx-1">
               <span className="text-purple-400 font-bold text-base md:text-lg tracking-tighter">Structure</span>
               <span className="text-zinc-500 text-[10px] md:text-xs font-light">(Ranks)</span>
             </div>
             
             <div className="flex gap-2 md:gap-3 font-mono">
               {ranks.map(rank => (
                 <div key={rank.label} className="flex-1">
                   <RankBox {...rank} />
                 </div>
               ))}
             </div>

             <div className="bg-zinc-800/20 p-2 md:p-3 rounded-xl border-l-4 border-purple-500/40 mx-auto max-w-sm backdrop-blur-sm text-center">
               <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold mb-0.5 md:mb-1 uppercase tracking-widest">Exemplo:</p>
               <p className="text-zinc-200 text-xs md:text-xs leading-relaxed">
                 Um flop <span className="text-white font-black underline decoration-blue-500 decoration-1 underline-offset-2">A 8 2</span> é <span className="italic tracking-tighter text-base md:text-base"><span className="text-blue-400 font-extrabold">H</span><span className="text-yellow-400 font-extrabold">M</span><span className="text-red-400 font-extrabold">L</span></span>.
               </p>
             </div>
          </div>

          {/* Agrupamento de Naipes (Texture) */}
          <div className="flex-1 space-y-2 md:space-y-3">
             <div className="flex items-center gap-3 border-b border-zinc-800 pb-1 md:pb-2 mx-1">
               <span className="text-blue-400 font-bold text-base md:text-lg tracking-tighter">Texture</span>
               <span className="text-zinc-500 text-[10px] md:text-xs font-light">(Naipes)</span>
             </div>
             
             <ul className="grid grid-cols-1 gap-1.5 md:gap-2">
               {textures.map(tex => <TextureRow key={tex.id} {...tex} />)}
             </ul>
          </div>
        </div>

        {/* Bottom Row: Connectivity */}
        <div className="w-full space-y-2 md:space-y-3">
           <div className="flex items-center gap-3 border-b border-zinc-800 pb-1 md:pb-2 mx-1">
             <span className="text-green-400 font-bold text-base md:text-lg tracking-tighter">Connectivity</span>
             <span className="text-zinc-500 text-[10px] md:text-xs font-light">(Sequência)</span>
           </div>
           
           <ul className="grid grid-cols-2 gap-2 md:gap-3 w-full">
             <li className="bg-zinc-800/40 p-2 md:p-3 rounded-lg border border-zinc-800 text-center flex flex-col justify-center min-h-[60px] md:min-h-[70px]">
               <div className="text-green-400 font-black text-xs md:text-xs uppercase mb-0.5 md:mb-1">Conectado</div>
               <div className="text-white font-bold text-[10px] md:text-xs uppercase tracking-widest">T 9 8</div>
             </li>
             <li className="bg-zinc-800/40 p-2 md:p-3 rounded-lg border border-zinc-800 text-center flex flex-col justify-center min-h-[60px] md:min-h-[70px]">
               <div className="text-zinc-500 font-black text-xs md:text-xs uppercase mb-0.5 md:mb-1">Desconectado</div>
               <div className="text-white font-bold text-[10px] md:text-xs uppercase tracking-widest">K 7 2</div>
             </li>
           </ul>
           <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] text-center italic mt-1 md:mt-1">Baseado em combos de Straight Draw</p>
        </div>
      </div>
    </div>
  );
};
