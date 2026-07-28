'use client';

import React from 'react';
import { GuessRecord, GameMode } from '@/lib/api';

interface GuessHistoryProps {
  history: GuessRecord[];
  mode: GameMode;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({ history, mode }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 space-y-1">
        <p className="text-xs text-neutral-600">No guesses yet</p>
        <p className="text-[11px] text-neutral-700">Your history will appear here</p>
      </div>
    );
  }

  const reversed = [...history].reverse();
  const is2P = mode === 'TWO_PLAYER_SAME_DEVICE';

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-neutral-400">
          History ({history.length})
        </span>
      </div>

      <div className="space-y-1.5 max-h-[360px] sm:max-h-[420px] overflow-y-auto">
        {reversed.map((item, index) => {
          const round = history.length - index;
          const isP1 = item.player === 'PLAYER_1';

          return (
            <div
              key={index}
              className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-surface-1 rounded-xl border border-surface-border hover:border-neutral-700 transition-colors animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-600 w-5">
                  {round}
                </span>
                <div>
                  <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-white">
                    {item.guess}
                  </span>
                  {is2P && (
                    <span className={`ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isP1
                        ? 'bg-accent/10 text-accent'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      P{isP1 ? '1' : '2'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-center min-w-[40px]">
                  <span className={`text-sm font-bold font-mono ${
                    item.dead > 0 ? 'text-dead' : 'text-neutral-600'
                  }`}>
                    {item.dead}
                  </span>
                  <span className="text-[9px] text-neutral-600 ml-0.5">D</span>
                </div>
                <div className="w-px h-4 bg-surface-border" />
                <div className="text-center min-w-[40px]">
                  <span className={`text-sm font-bold font-mono ${
                    item.wounded > 0 ? 'text-wounded' : 'text-neutral-600'
                  }`}>
                    {item.wounded}
                  </span>
                  <span className="text-[9px] text-neutral-600 ml-0.5">W</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
