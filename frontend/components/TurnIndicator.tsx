'use client';

import React from 'react';
import { GameMode, Player } from '@/lib/api';

interface TurnIndicatorProps {
  mode: GameMode;
  currentTurn: Player;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ mode, currentTurn }) => {
  if (mode === 'VS_COMPUTER') {
    return (
      <div className="text-center py-2">
        <span className="text-xs text-neutral-500">Your turn — enter a 4-digit guess</span>
      </div>
    );
  }

  const isP1 = currentTurn === 'PLAYER_1';

  return (
    <div className={`text-center py-3 px-4 rounded-xl border transition-all animate-fade-in ${
      isP1
        ? 'bg-accent/5 border-accent/30 text-accent'
        : 'bg-purple-500/5 border-purple-500/30 text-purple-400'
    }`}>
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Current Turn</p>
          <p className="text-sm font-bold">
            {isP1 ? 'Player 1' : 'Player 2'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Target Objective</p>
          <p className="text-xs font-semibold text-neutral-300">
            {isP1 ? "Guessing Player 2's Code" : "Guessing Player 1's Code"}
          </p>
        </div>
      </div>
    </div>
  );
};
