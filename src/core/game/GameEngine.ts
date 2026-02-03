import { generateBalancedRound } from '../domain/FlopGenerator';
import type { Flop, FlopCategory } from '../domain/types';

export interface TableState {
  id: number;
  handId: number;
  flop: Flop;
  correctCategory: FlopCategory;
  timeLeftMs: number;
  totalTimeMs: number;
  status: 'playing' | 'submitted' | 'timeout';
}

export interface GameStats {
  correct: number;
  incorrect: number;
  avgTimeMs: number;
}

export type GameListener = (tables: TableState[], stats: GameStats) => void;

const TABLE_COUNT = 1;
const TIME_PER_TABLE_MS = 60000;

export class GameEngine {
  private tables: TableState[] = [];
  private stats: GameStats = { correct: 0, incorrect: 0, avgTimeMs: 0 };
  private listeners: GameListener[] = [];
  private intervalId: any = null;
  private totalAnswerTimeMs = 0;

  constructor(initialData?: { tables: TableState[], stats: GameStats, totalAnswerTimeMs?: number }) {
    if (initialData) {
      this.tables = initialData.tables;
      this.stats = initialData.stats;
      this.totalAnswerTimeMs = initialData.totalAnswerTimeMs || 0;
    } else {
      this.initTables();
    }
  }

  private initTables() {
    const balancedRound = generateBalancedRound(TABLE_COUNT);
    this.tables = balancedRound.map((data, i) => ({
      id: i,
      handId: Date.now() + Math.random(),
      flop: data.flop,
      correctCategory: data.analysis,
      timeLeftMs: TIME_PER_TABLE_MS,
      totalTimeMs: TIME_PER_TABLE_MS,
      status: 'playing'
    }));
  }

  public startNextRound() {
    this.initTables();
    this.notify();
  }

  public start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 100);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    // Decrease timers
    this.tables.forEach(t => {
      if (t.status === 'playing') {
        t.timeLeftMs -= 100;
        if (t.timeLeftMs <= 0) {
          t.timeLeftMs = 0;
          t.status = 'timeout';
          this.stats.incorrect++;
        }
      }
    });
    
    this.notify();
  }

  public submitAnswer(tableId: number, answer: Partial<FlopCategory>) {
    const table = this.tables.find(t => t.id === tableId);
    if (!table || table.status !== 'playing') return;

    // Check answer
    const structureMatch = answer.structure === table.correctCategory.structure;
    const textureMatch = answer.texture === table.correctCategory.texture;
    const pairingMatch = answer.pairing === table.correctCategory.pairing;
    const connectivityMatch = answer.connectivity === table.correctCategory.connectivity;
    
    table.status = 'submitted';

    // Strict check on all 4 dimensions
    if (structureMatch && textureMatch && pairingMatch && connectivityMatch) {
      this.stats.correct++;
      const timeSpent = table.totalTimeMs - table.timeLeftMs;
      this.totalAnswerTimeMs += timeSpent;
      this.stats.avgTimeMs = this.totalAnswerTimeMs / (this.stats.correct || 1);
    } else {
      this.stats.incorrect++;
    }

    this.notify();
  }

  public subscribe(listener: GameListener) {
    this.listeners.push(listener);
    listener(this.tables, this.stats); // Initial emission
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getTables() { return this.tables; }
  public getStats() { return this.stats; }
  public getTotalAnswerTimeMs() { return this.totalAnswerTimeMs; }

  private notify() {
    this.listeners.forEach(l => l([...this.tables.map(t => ({...t}))], { ...this.stats }));
  }
}
