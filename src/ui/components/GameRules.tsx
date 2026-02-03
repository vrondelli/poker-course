import React from 'react';

interface RankBoxProps {
  label: string;
  name: string;
  range: string;
  colorClass: string;
  hoverClass: string;
}

const RankBox: React.FC<RankBoxProps> = ({ label, name, range, colorClass, hoverClass }) => (
  <div className={`bg-zinc-800/80 p-3 md:p-4 rounded-xl border border-zinc-700/50 hover:${hoverClass} transition-all group max-w-[140px] mx-auto w-full text-center`}>
    <div className={`${colorClass} font-black text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform`}>{label}</div>
    <div className="text-zinc-500 text-xs md:text-sm uppercase tracking-widest font-bold">{name}</div>
    <div className="text-white font-black text-lg mt-1">{range}</div>
  </div>
);

interface TextureRowProps {
  label: React.ReactNode;
  description: React.ReactNode;
}

const TextureRow: React.FC<TextureRowProps> = ({ label, description }) => (
  <li className="flex justify-between items-center bg-zinc-800/40 p-3 md:p-4 rounded-lg border border-zinc-800 hover:border-blue-500/30 transition-all group max-w-sm mx-auto w-full">
    <span className="font-bold text-lg group-hover:brightness-125 transition-all">{label}</span>
    <span className="font-black text-xl">{description}</span>
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
      label: <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">Rainbow</span>, 
      description: <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent italic">3 Naipes</span> 
    },
    { 
      label: <span className="text-yellow-400">Two-tone</span>, 
      description: <span className="text-yellow-400 italic">2 Naipes</span> 
    },
    { 
      label: <span className="text-purple-600">Monotone</span>, 
      description: <span className="text-purple-600 italic">1 Naipe</span> 
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-[2.5rem] p-6 md:p-10 text-left w-[60%] mx-auto shadow-2xl my-6 relative overflow-hidden ring-1 ring-white/10">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none"></div>

      <h3 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-purple-500 bg-clip-text text-transparent mb-6 text-center tracking-tight px-8 uppercase italic">
        Guia de Classificação
      </h3>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 md:px-8 relative z-10">
        {/* Agrupamento de Ranks */}
        <div className="flex-[1.4] space-y-5">
           <div className="flex items-center gap-4 border-b border-zinc-800 pb-3 mx-2">
             <span className="text-purple-400 font-bold text-xl md:text-2xl tracking-tighter">Structure</span>
             <span className="text-zinc-500 text-base font-light">(Ranks)</span>
           </div>
           
           <div className="flex gap-3 font-mono">
             {ranks.map(rank => (
               <div key={rank.label} className="flex-1">
                 <RankBox {...rank} />
               </div>
             ))}
           </div>

           <div className="bg-zinc-800/20 p-5 md:p-6 rounded-xl border-l-4 border-purple-500/40 mx-auto max-w-sm backdrop-blur-sm text-center">
             <p className="text-zinc-500 text-xs font-bold mb-1 uppercase tracking-widest">Exemplo:</p>
             <p className="text-zinc-200 text-base leading-relaxed">
               Um flop <span className="text-white font-black underline decoration-blue-500 decoration-1 underline-offset-2">A 8 2</span> é <span className="italic tracking-tighter text-xl"><span className="text-blue-400 font-extrabold">H</span><span className="text-yellow-400 font-extrabold">M</span><span className="text-red-400 font-extrabold">L</span></span>.
             </p>
           </div>
        </div>

        {/* Agrupamento de Naipes e Conectividade */}
        <div className="flex-1 space-y-10">
          <div className="space-y-5">
             <div className="flex items-center gap-4 border-b border-zinc-800 pb-3 mx-2">
               <span className="text-blue-400 font-bold text-xl md:text-2xl tracking-tighter">Texture</span>
               <span className="text-zinc-500 text-base font-light">(Naipes)</span>
             </div>
             
             <ul className="flex flex-col gap-3">
               {textures.map(tex => <TextureRow key={tex.label} {...tex} />)}
             </ul>
          </div>

          <div className="space-y-5">
             <div className="flex items-center gap-4 border-b border-zinc-800 pb-3 mx-2">
               <span className="text-green-400 font-bold text-xl md:text-2xl tracking-tighter">Connectivity</span>
               <span className="text-zinc-500 text-base font-light">(Sequência)</span>
             </div>
             
             <ul className="grid grid-cols-2 gap-3">
               <li className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-800 text-center">
                 <div className="text-green-400 font-black text-sm uppercase mb-1">Highly</div>
                 <div className="text-white font-bold text-xs uppercase tracking-widest">T 9 8</div>
               </li>
               <li className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-800 text-center">
                 <div className="text-green-500 font-black text-sm uppercase mb-1">Connected</div>
                 <div className="text-white font-bold text-xs uppercase tracking-widest">T 8 7</div>
               </li>
               <li className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-800 text-center">
                 <div className="text-yellow-500/80 font-black text-sm uppercase mb-1">Low</div>
                 <div className="text-white font-bold text-xs uppercase tracking-widest">T 7 2</div>
               </li>
               <li className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-800 text-center">
                 <div className="text-zinc-500 font-black text-sm uppercase mb-1">None</div>
                 <div className="text-white font-bold text-xs uppercase tracking-widest">K 7 2</div>
               </li>
             </ul>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] text-center italic">Baseado em combos de Straight Draw</p>
          </div>
        </div>
      </div>
    </div>
  );
};
