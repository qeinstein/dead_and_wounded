'use client';

import React from 'react';
import { GameMode, Player } from '@/lib/api';
import { User, Users, ShieldAlert } from 'lucide-react';

interface TurnIndicatorProps {
  mode: GameMode;
  currentTurn: Player;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ mode, currentTurn }) => {
  if (mode === 'VS_COMPUTER') {
    return (
      <div className="w-full max-w-md mx-auto py-2.5 px-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Single Player Mode</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-md">
          Computer Code Secret
        </span>
      </div>
    );
  }

  const isP1 = currentTurn === 'PLAYER_1';

  return (
    <div
      className={`w-full max-w-md mx-auto py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 shadow-lg ${
        isP1
          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-indigo-950/50'
          : 'bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-purple-950/50'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`p-1.5 rounded-lg ${
            isP1 ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
          } shadow-sm animate-bounce-short`}
        >
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Current Turn</div>
          <div className="text-sm font-bold flex items-center gap-1.5">
            {isP1 ? 'Player 1' : 'Player 2'}
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Pass device to {isP1 ? 'Player 1' : 'Player 2'}</span>
      </div>
    </div>
  );
};
