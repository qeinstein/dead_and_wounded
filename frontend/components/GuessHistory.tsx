'use client';

import React from 'react';
import { GuessRecord, GameMode } from '@/lib/api';
import { Target, Zap, History } from 'lucide-react';

interface GuessHistoryProps {
  history: GuessRecord[];
  mode: GameMode;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({ history, mode }) => {
  if (history.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 text-center space-y-2">
        <History className="w-8 h-8 mx-auto text-slate-600 animate-pulse-slow" />
        <h3 className="text-sm font-semibold text-slate-300">No Guesses Yet</h3>
        <p className="text-xs text-slate-500">Enter a 4-digit guess above to receive Dead & Wounded feedback.</p>
      </div>
    );
  }

  // Reverse array so latest guess is top
  const reversed = [...history].reverse();

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Guess History ({history.length})</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Latest on Top</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {reversed.map((item, index) => {
          const roundNumber = history.length - index;
          const isP1 = item.player === 'PLAYER_1';

          return (
            <div
              key={index}
              className="p-3 bg-slate-950/70 border border-slate-800/90 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-6">#{roundNumber}</span>
                <div>
                  <div className="text-lg font-mono font-bold tracking-widest text-white">{item.guess}</div>
                  {mode === 'TWO_PLAYER_SAME_DEVICE' && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isP1 ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}
                    >
                      {isP1 ? 'Player 1' : 'Player 2'}
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback badges */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    item.dead > 0
                      ? 'bg-red-950/60 text-red-300 border-red-800/80'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title={`${item.dead} digits in exact position`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{item.dead} Dead</span>
                </div>

                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    item.wounded > 0
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title={`${item.wounded} digits in secret code but wrong position`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{item.wounded} Wounded</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
