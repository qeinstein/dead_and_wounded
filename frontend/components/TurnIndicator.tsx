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
      <div className="flex items-center justify-center gap-2 text-center">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="text-xs text-muted">Your move — deduce the secret 4-digit code</span>
      </div>
    );
  }

  const isP1 = currentTurn === 'PLAYER_1';
  const tone = isP1
    ? 'border-accent/30 bg-accent/[0.06]'
    : 'border-win/30 bg-win/[0.06]';
  const text = isP1 ? 'text-accent' : 'text-win';
  const dot = isP1 ? 'bg-accent' : 'bg-win';

  return (
    <div className={`mx-auto flex max-w-md items-center justify-between rounded-xl border px-4 py-3 transition-all animate-fade-in ${tone}`}>
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <div>
          <p className="eyebrow">Current turn</p>
          <p className={`text-sm font-semibold ${text}`}>{isP1 ? 'Player 1' : 'Player 2'}</p>
        </div>
      </div>
      <p className="text-right text-[11px] font-medium text-muted">
        Cracking {isP1 ? "Player 2's" : "Player 1's"} code
      </p>
    </div>
  );
};
