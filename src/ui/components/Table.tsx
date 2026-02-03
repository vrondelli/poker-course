import React from 'react';
import type { TableState } from '../../core/game/GameEngine';
import { Card } from './Card';
import { WizardButton } from './WizardButton';
import type { BoardStructure, BoardTexture, BoardPairing, BoardConnectivity } from '../../core/domain/types';
import { getStructureOptions } from '../../core/domain/FlopAnalysis';

interface Props {
  tableState: TableState;
  cardTheme?: 'color' | 'white';
  currentAnswer: {
    texture?: BoardTexture;
    structure?: BoardStructure;
    pairing?: BoardPairing;
    connectivity?: BoardConnectivity;
  };
  onPartialUpdate: (field: string, value: any) => void;
  onSubmit: () => void;
  showResult?: boolean;
}

const TEXTURE_OPTIONS: BoardTexture[] = ['Rainbow', 'Two-tone', 'Monotone'];
const PAIRING_OPTIONS: BoardPairing[] = ['Unpaired', 'Paired', 'Trips'];
const CONNECTIVITY_OPTIONS: BoardConnectivity[] = ['Disconnected', 'Connected'];

export const Table: React.FC<Props> = ({ 
  tableState, 
  cardTheme = 'color',
  currentAnswer,
  onPartialUpdate,
  onSubmit,
  showResult = false
}) => {
  const { texture, structure, pairing, connectivity } = currentAnswer;
  const correct = tableState.correctCategory;

  const structureOptions = React.useMemo(() => {
    return getStructureOptions(tableState.flop);
  }, [tableState.flop]);

  const progressPercent = (tableState.timeLeftMs / tableState.totalTimeMs) * 100;
  let progressColor = 'bg-green-500';
  if (progressPercent < 50) progressColor = 'bg-yellow-500';
  if (progressPercent < 20) progressColor = 'bg-red-500';

  const getTextureBg = (opt: BoardTexture) => {
    // Game Rules Palette: Rainbow (Pink), Two-tone (Yellow), Monotone (Purple)
    if (opt === 'Rainbow') return 'bg-gradient-to-r from-pink-700/90 via-pink-600/90 to-pink-500/90 shadow-inner';
    if (opt === 'Two-tone') return 'bg-gradient-to-r from-yellow-600/90 via-yellow-500/90 to-yellow-400/90 shadow-inner';
    if (opt === 'Monotone') return 'bg-purple-600/90 shadow-inner';
    return undefined;
  };

  const getStructureBgClass = (opt: string) => {
    const chars = opt.split('');
    if (chars.every(c => c === chars[0])) {
      if (chars[0] === 'H') return 'bg-blue-600/40';
      if (chars[0] === 'M') return 'bg-yellow-500/40';
      if (chars[0] === 'L') return 'bg-red-500/40';
    }
    return undefined;
  };

  const getPairingBg = (opt: BoardPairing) => {
    if (opt === 'Paired') return 'bg-yellow-600/40 shadow-inner';
    if (opt === 'Trips') return 'bg-blue-700/40 shadow-inner';
    return 'bg-red-900/40';
  };

  const getConnectivityBg = (opt: BoardConnectivity) => {
    if (opt === 'Connected') return 'bg-green-500/50 shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]';
    return 'bg-red-900/40';
  };

  const renderStructureLabel = (str: string) => {
    return (
      <span className="flex gap-[4px] md:gap-[6px] items-center justify-center">
        {str.split('').map((char, i) => {
          let color = 'text-white';
          if (char === 'H') color = 'text-blue-400';
          else if (char === 'M') color = 'text-yellow-400';
          else if (char === 'L') color = 'text-red-400';
          return <span key={i} className={`${color} font-black text-xs md:text-lg tracking-tighter`}>{char}</span>;
        })}
      </span>
    );
  };

  const renderTextureLabel = (label: string) => label;

  const isTableCorrect = tableState.status === 'submitted' && 
    texture === correct.texture && 
    structure === correct.structure && 
    pairing === correct.pairing && 
    connectivity === correct.connectivity;

  return (
    <div className={`bg-zinc-900 border ${showResult ? (isTableCorrect ? 'border-green-500/50 shadow-green-500/10' : 'border-red-500/50 shadow-red-500/10') : 'border-zinc-700'} rounded-2xl ${showResult ? 'p-2 md:p-3 gap-1' : 'p-4 md:p-6 gap-5 md:gap-6'} flex flex-col shadow-lg w-full max-w-sm md:max-w-none md:w-full mx-auto transition-all ${!showResult && 'hover:scale-[1.02]'} duration-200 relative`}>
      {/* Header / Timer / Result Label */}
      <div className="flex flex-col gap-2">
        {!showResult ? (
          <div className="w-full h-2 md:h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${progressColor}`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : (
          <div className={`text-center py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isTableCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {tableState.status === 'timeout' ? 'Tempo Esgotado' : (isTableCorrect ? 'Mesa Correta' : 'Mesa Incorreta')}
          </div>
        )}
      </div>

      {/* Flop Display */}
      <div className={`flex justify-center gap-4 md:gap-6 relative ${showResult ? 'h-16' : 'h-24 md:h-36'} items-center bg-zinc-800/30 rounded-xl p-4 transition-all overflow-hidden`}>
        {[...tableState.flop].sort((a, b) => {
          const order = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
          return order.indexOf(a.rank) - order.indexOf(b.rank);
        }).map((card) => (
          <div key={`${tableState.id}-${card.rank}${card.suit}`} className={`transform ${showResult ? 'scale-[0.8]' : 'scale-1.1 md:scale-135'} transition-all`}>
             <Card card={card} theme={cardTheme} />
          </div>
        ))}
      </div>

      {/* Synchronized Wizard Controls / Results */}
      <div className={`w-full flex-1 flex flex-col ${showResult ? 'space-y-0.5' : 'space-y-4'}`}>
        
        {/* Step 1: Texture */}
        <div className={`flex flex-col ${showResult ? 'gap-0' : 'gap-1 md:gap-2'} animate-in fade-in duration-300`}>
          <div className="flex justify-between px-1">
            <span className="text-xs uppercase text-blue-400 font-bold tracking-wider font-mono">Texture</span>
          </div>
          <div className={`grid grid-cols-3 w-fit mx-auto ${showResult ? 'gap-1.5' : 'gap-3'}`}>
            {TEXTURE_OPTIONS.map(opt => (
              <WizardButton
                key={opt}
                label={renderTextureLabel(opt)}
                selected={texture === opt}
                onClick={() => onPartialUpdate('texture', opt)}
                color={opt === 'Rainbow' ? 'pink' : opt === 'Two-tone' ? 'yellow' : 'purple'}
                allowCustomColors={true}
                disabled={showResult}
                correct={showResult && correct.texture === opt}
                wrong={showResult && texture === opt && correct.texture !== opt}
                size={showResult ? 'sm' : 'md'}
                customBg={getTextureBg(opt)}
              />
            ))}
          </div>
        </div>

        {/* Step 2: Structure */}
        <div className={`flex flex-col ${showResult ? 'gap-0' : 'gap-1 md:gap-2'} animate-in fade-in duration-300`}>
          <div className="flex justify-between px-1">
            <span className="text-xs uppercase text-purple-400 font-bold tracking-wider font-mono">Structure</span>
          </div>
          <div className={`grid grid-cols-4 w-fit mx-auto ${showResult ? 'gap-1.5' : 'gap-3'}`}> 
            {structureOptions.map(opt => (
              <WizardButton
                key={opt}
                label={renderStructureLabel(opt)}
                selected={structure === opt}
                onClick={() => onPartialUpdate('structure', opt)}
                color="blue"
                allowCustomColors={true}
                disabled={showResult}
                correct={showResult && correct.structure === opt}
                wrong={showResult && structure === opt && correct.structure !== opt}
                size="sm"
                customBg={getStructureBgClass(opt)}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Pairing */}
        <div className={`flex flex-col ${showResult ? 'gap-0' : 'gap-1 md:gap-2'} animate-in fade-in duration-300`}>
          <div className="flex justify-between px-1">
            <span className="text-xs uppercase text-orange-400 font-bold tracking-wider font-mono">Pairing</span>
          </div>
          <div className={`grid w-fit mx-auto ${showResult ? 'grid-cols-3 gap-1.5' : 'grid-cols-3 gap-3'}`}>
            {PAIRING_OPTIONS.map(opt => (
              <WizardButton
                key={opt}
                label={opt}
                selected={pairing === opt}
                onClick={() => onPartialUpdate('pairing', opt)}
                color={opt === 'Trips' ? 'blue' : opt === 'Paired' ? 'yellow' : 'red'}
                disabled={showResult}
                correct={showResult && correct.pairing === opt}
                wrong={showResult && pairing === opt && correct.pairing !== opt}
                size={showResult ? 'sm' : 'md'}
                customBg={getPairingBg(opt)}
              />
            ))}
          </div>
        </div>

        {/* Step 4: Connectivity */}
        <div className={`flex flex-col ${showResult ? 'gap-0' : 'gap-1 md:gap-2'} animate-in fade-in duration-300`}>
          <div className="flex justify-between px-1">
            <span className="text-xs uppercase text-green-400 font-bold tracking-wider font-mono">Connectivity</span>
          </div>
          <div className={`grid grid-cols-2 w-fit mx-auto ${showResult ? 'gap-1.5' : 'gap-3'}`}>
            {CONNECTIVITY_OPTIONS.map(opt => (
              <WizardButton
                key={opt}
                label={opt === 'Connected' ? 'Conectado' : 'Desconectado'}
                selected={connectivity === opt}
                onClick={() => onPartialUpdate('connectivity', opt)}
                color={opt === 'Connected' ? 'green' : 'red'}
                disabled={showResult}
                correct={showResult && correct.connectivity === opt}
                wrong={showResult && connectivity === opt && correct.connectivity !== opt}
                size="sm"
                customBg={getConnectivityBg(opt)}
              />
            ))}
          </div>
        </div>

        {/* Submit Button Section */}
        {!showResult && (
          <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <button
              onClick={onSubmit}
              disabled={!(texture && structure && pairing && connectivity)}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group
                ${(texture && structure && pairing && connectivity)
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95'
                  : 'bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed border border-zinc-700'
                }`}
            >
              Confirmar Mesa
              {(texture && structure && pairing && connectivity) && (
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
