import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { GameEngine, type TableState, type GameStats } from '../../core/game/GameEngine';
import { Table } from '../components/Table';
import { GameRules } from '../components/GameRules';
import type { BoardStructure, BoardTexture, BoardPairing, BoardConnectivity } from '../../core/domain/types';
import { api } from '../../infra/api';



type TableAnswer = {
  texture?: BoardTexture;
  structure?: BoardStructure;
  pairing?: BoardPairing;
  connectivity?: BoardConnectivity;
};

const PERSISTENCE_KEY = 'flop_mastery_state';

export const TrainerPage: React.FC = () => {
  // Load initial state from localStorage
  const savedState = useMemo(() => {
    const data = localStorage.getItem(PERSISTENCE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return null;
  }, []);

  const engine = useMemo(() => {
    if (savedState?.engineState) {
      return new GameEngine(savedState.engineState);
    }
    return new GameEngine();
  }, [savedState]);

  const [tables, setTables] = useState<TableState[]>(savedState?.engineState?.tables || []);
  const [stats, setStats] = useState<GameStats>(savedState?.engineState?.stats || { correct: 0, incorrect: 0, avgTimeMs: 0 });
  const [isPlaying, setIsPlaying] = useState(savedState?.isPlaying || false);
  const [userName, setUserName] = useState(savedState?.userName || '');
  const [userId, setUserId] = useState<number | null>(savedState?.userId || null);
  const [cardTheme, setCardTheme] = useState<'color' | 'white'>(savedState?.cardTheme || 'color');

  // Global Flow State
  const [globalAnswers, setGlobalAnswers] = useState<Record<number, TableAnswer>>(savedState?.globalAnswers || {});
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Effect to save state to localStorage
  useEffect(() => {
    const stateToSave = {
      userName,
      userId,
      isPlaying,
      globalAnswers,
      cardTheme,
      engineState: {
        tables: engine.getTables(),
        stats: engine.getStats(),
        totalAnswerTimeMs: engine.getTotalAnswerTimeMs()
      }
    };
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(stateToSave));
  }, [userName, userId, isPlaying, globalAnswers, cardTheme, tables, stats]);

  // Sync engine start/stop with isPlaying state
  useEffect(() => {
    if (isPlaying && !showRoundResults && !showRules) {
      engine.start();
    } else {
      engine.stop();
    }
  }, [isPlaying, showRoundResults, showRules, engine]);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newTables, newStats) => {
      setTables(newTables);
      setStats(newStats);
    });
    return () => {
      unsubscribe();
      engine.stop();
    };
  }, [engine]);

  // We need a separate effect or ref to track previous handIds to detect changes
  const [prevHandIds, setPrevHandIds] = useState<Record<number, number>>({});

  useEffect(() => {
    // Detect hand ID changes to clear answers
    const currentHandIds: Record<number, number> = {};
    let hasChanges = false;
    const nextAnswers = { ...globalAnswers };

    tables.forEach(t => {
      currentHandIds[t.id] = t.handId;
      if (prevHandIds[t.id] && prevHandIds[t.id] !== t.handId) {
        // Hand changed! Clear answer for this table
        delete nextAnswers[t.id];
        hasChanges = true;
      }
    });

    if (JSON.stringify(prevHandIds) !== JSON.stringify(currentHandIds)) {
        setPrevHandIds(currentHandIds);
    }

    if (hasChanges) {
      setGlobalAnswers(nextAnswers);
      // Also, if a hand resets, we might need to verify if ActiveStage is still valid?
      // If we are in 'structure', and one table resets, it now needs 'texture' again.
      // This blocks the flow. The user must fill Texture for the new hand.
      // The Global Flow logic will automatically handle this:
      // checkStageProgression sees that Table X lacks 'texture'.
      // But 'activeStage' might be 'structure'.
      // If activeStage is 'structure' but a table lacks 'texture', checkStageProgression doesn't revert stage.
      // We should probably revert stage if prerequisites are lost?
      // "allHaveTexture" will now be false.
      // We should arguably reset activeStage to the lowest common denominator?
      // Let's implement that in checkStageProgression.
    }
  }, [tables]); 

  // Reset logic for new game / round
  // Ideally GameEngine has a 'onRoundStart' event.
  // For now, let's reset when `tables` change significantly? No, that's flaky.
  // We'll reset when user successfully submits all?
  
  const resetStage = () => {
    setGlobalAnswers({});
  };

  const handleNextRound = () => {
    setShowRoundResults(false);
    resetStage();
    engine.startNextRound();
    engine.start();
  };

  const handleLogin = async () => {
    if (!userName) return;
    try {
      const user = await api.login(userName);
      setUserId(user.id);
    } catch (e) {
      console.error(e);
      alert('Error connecting to server. Ensure backend is running.');
    }
  };

  const handleStart = () => {
    setIsPlaying(true);
    setShowRoundResults(false);
    resetStage();
    engine.start();
  };

  const handleStop = async () => {
    setIsPlaying(false);
    engine.stop();
    if (userId) {
      await api.saveSession(userId, stats);
      alert('Session saved!');
    }
  };

  const checkStageProgression = useCallback((_currentAnswers: Record<number, TableAnswer>, currentTables: TableState[]) => {
    if (currentTables.length === 0) return;

    // A round is over if all tables are either timed out or have all connectivity
    const roundOver = currentTables.every(t => t.status !== 'playing');

    if (roundOver && !showRoundResults) {
       setShowRoundResults(true);
       engine.stop();
       return;
    }
  }, [engine, showRoundResults]);

  const handlePartialUpdate = (id: number, field: keyof TableAnswer, value: any) => {
    setGlobalAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSubmit = (id: number) => {
    const ans = globalAnswers[id];
    if (ans?.texture && ans?.structure && ans?.pairing && ans?.connectivity) {
      engine.submitAnswer(id, ans as any);
    }
  };

  // Effect to check progression whenever answers or tables change
  useEffect(() => {
    checkStageProgression(globalAnswers, tables);
  }, [globalAnswers, tables, checkStageProgression]);


  if (!userId) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 text-white gap-12 md:gap-24 p-4 pt-24 md:pt-4 relative overflow-y-auto">
        <a 
          href="index.html" 
          className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group z-50"
          title="Voltar ao Curso"
        >
          <span className="bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </span>
          <span className="uppercase text-[10px] font-black tracking-widest hidden md:inline">Voltar</span>
        </a>
        <div className="text-center flex flex-col gap-8">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Flop Mastery
          </h1>
          <p className="text-zinc-400 text-xl md:text-3xl font-light tracking-wide">Train your poker mind.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl items-center">
          <input 
            type="text" 
            value={userName} 
            onChange={e => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="flex-1 w-full md:w-auto h-16 px-6 bg-zinc-800 rounded-2xl border-2 border-zinc-700 text-white text-xl text-center focus:border-blue-500 focus:outline-none transition-all placeholder:text-zinc-600 placeholder:text-center"
          />
          <button 
            onClick={handleLogin}
            className="w-full md:w-44 h-16 px-0 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-blue-900/30 whitespace-nowrap flex items-center justify-center"
          >
            Start
          </button>
        </div>
      </div>
     )
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 text-white gap-4 md:gap-6 p-2 pt-20 md:pt-8 relative overflow-y-auto">
        <a 
          href="index.html" 
          className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group z-50"
          title="Voltar ao Curso"
        >
          <span className="bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </span>
          <span className="uppercase text-[10px] font-black tracking-widest hidden md:inline">Voltar</span>
        </a>
        <div className="text-center flex flex-col gap-2 md:gap-3">
          <h1 className="text-3xl md:text-6xl font-bold text-white text-center">
            Welcome, <span className="text-blue-400">{userName}</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-center text-sm md:text-lg font-light tracking-wide">
             Categorize the flop: Texture &rarr; Structure &rarr; Pairing &rarr; Connectivity.
          </p>
        </div>

        <GameRules />

        <button 
          onClick={handleStart}
          className="w-full md:w-80 h-16 md:h-20 px-0 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl md:text-2xl transition-all hover:scale-105 shadow-xl shadow-blue-900/30 whitespace-nowrap flex items-center justify-center animate-pulse shrink-0"
        >
          Start Training
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/90 text-white p-4 flex flex-col items-center relative">
      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
           <button 
            onClick={() => setShowRules(false)}
            className="fixed top-4 right-4 z-[60] bg-zinc-800 text-white p-3 rounded-full hover:bg-zinc-700 transition"
           >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
           <div className="max-w-5xl w-full my-auto">
             <GameRules />
           </div>
        </div>
      )}

      <div className="w-full max-w-[85vw] flex flex-col gap-6 h-full flex-1">
        {/* Header Stats / Round Results Controller */}
        <header className={`flex flex-col md:flex-row justify-between items-center bg-zinc-900 border ${showRoundResults ? 'border-blue-500/30 py-4 px-10' : 'border-zinc-800 p-4 md:p-6'} rounded-[2.5rem] backdrop-blur-md shadow-xl gap-4 transition-all duration-500`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Back to Course Button */}
              <a 
                href="index.html" 
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                title="Voltar ao Curso"
              >
                <span className="bg-zinc-800 p-2 rounded-lg group-hover:bg-zinc-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </span>
                <span className="uppercase text-[10px] font-black tracking-widest hidden md:inline">Voltar</span>
              </a>

              {/* Rules Toggle Button */}
              <button
                onClick={() => setShowRules(true)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
                title="Ver Regras"
              >
                 <span className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                 </span>
                 <span className="uppercase text-[10px] font-black tracking-widest hidden md:inline">Regras</span>
              </button>
            </div>

            <div className="text-center md:text-left">
              <h2 className={`${showRoundResults ? 'text-4xl' : 'text-3xl'} font-black italic uppercase tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all`}>
                {showRoundResults ? 'Rodada Finalizada' : 'Treino em Curso'}
              </h2>
              {showRoundResults && <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em] mt-0.5">Confira seus resultados abaixo</p>}
            </div>
            
            {!showRoundResults && (
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                  <button 
                    onClick={() => setCardTheme('color')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${cardTheme === 'color' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Color
                  </button>
                  <button 
                    onClick={() => setCardTheme('white')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${cardTheme === 'white' ? 'bg-zinc-100 text-black shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    White
                  </button>
                </div>
                
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`flex ${showRoundResults ? 'gap-12' : 'gap-8'} text-sm font-medium transition-all`}>
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mb-1">Taxa de Acerto</span>
                <span className={`font-mono ${showRoundResults ? 'text-4xl text-white' : 'text-2xl text-green-400'} font-black transition-all`}>
                  {showRoundResults 
                    ? `${Math.round((stats.correct / (stats.correct + stats.incorrect || 1)) * 100)}%` 
                    : stats.correct}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mb-1">{showRoundResults ? 'Tempo Médio' : 'Erros'}</span>
                <span className={`font-mono ${showRoundResults ? 'text-4xl text-white' : 'text-2xl text-red-400'} font-black transition-all`}>
                  {showRoundResults 
                    ? `${Math.round(stats.avgTimeMs / 1000)}s` 
                    : stats.incorrect}
                </span>
              </div>
              {!showRoundResults && (
                <div className="flex flex-col items-center">
                  <span className="text-zinc-500 uppercase text-[10px] font-black tracking-widest mb-1">Avg Time</span>
                  <span className="text-blue-400 font-mono text-2xl font-black">{(stats.avgTimeMs / 1000).toFixed(1)}s</span>
                </div>
              )}
            </div>

            {showRoundResults ? (
              <button 
                onClick={handleNextRound}
                className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-2xl transition-all hover:scale-[1.05] shadow-xl shadow-blue-900/40 flex items-center justify-center gap-4 group animate-in fade-in zoom-in duration-300"
              >
                Próxima Rodada
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </button>
            ) : (
              <button 
                onClick={handleStop} 
                className="px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
              >
                Encerrar
              </button>
            )}
          </div>
        </header>

        {/* Current Stage Title (Mobile) - REMOVED */}

        {/* Tables Grid - Centered for single flop */}
        <div className="flex flex-1 items-center justify-center py-4">
          <div className="w-full max-w-xl">
          {tables.map(table => (
            <div key={table.id} className="flex justify-center w-full">
              <Table 
                tableState={table} 
                cardTheme={cardTheme}
                currentAnswer={globalAnswers[table.id] || {}}
                onPartialUpdate={(field, value) => handlePartialUpdate(table.id, field as keyof TableAnswer, value)}
                onSubmit={() => handleSubmit(table.id)}
                showResult={showRoundResults}
              />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
