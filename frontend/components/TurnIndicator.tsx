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
    <div className={`text-center py-3 px-4 rounded-xl border transition-colors animate-fade-in ${
      isP1
        ? 'bg-accent/5 border-accent/20'
        : 'bg-purple-500/5 border-purple-500/20'
    }`}>
      <p className="text-xs text-neutral-500 mb-0.5">Current Turn</p>
      <p className={`text-sm font-bold ${isP1 ? 'text-accent' : 'text-purple-400'}`}>
        {isP1 ? 'Player 1' : 'Player 2'}
      </p>
    </div>
  );
};
