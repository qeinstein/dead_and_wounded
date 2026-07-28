'use client';

import React from 'react';
import { GuessRecord, GameMode, Player } from '@/lib/api';

interface GuessHistoryProps {
  history: GuessRecord[];
  player1History?: GuessRecord[];
  player2History?: GuessRecord[];
  mode: GameMode;
  currentTurn?: Player;
}

export const GuessHistory: React.FC<GuessHistoryProps> = ({
  history,
  player1History = [],
  player2History = [],
  mode,
  currentTurn,
}) => {
  const is2P = mode === 'TWO_PLAYER_SAME_DEVICE';

  if (is2P) {
    const p1List = [...(player1History.length > 0 ? player1History : history.filter(r => r.player === 'PLAYER_1'))].reverse();
    const p2List = [...(player2History.length > 0 ? player2History : history.filter(r => r.player === 'PLAYER_2'))].reverse();
    const isP1Turn = currentTurn === 'PLAYER_1';

    return (
      <div className="w-full space-y-3">
        <div className="text-xs font-semibold text-neutral-400 px-1">
          Match History (Side-by-Side)
        </div>

        {/* Dual Side-by-Side Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Player 1 Table */}
          <div className={`p-3 bg-surface-1 rounded-xl border transition-all space-y-2 ${
            isP1Turn ? 'border-accent shadow-sm shadow-accent/10' : 'border-surface-border opacity-80'
          }`}>
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-xs font-bold text-accent">Player 1 History</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">vs P2 Code</span>
            </div>

            {p1List.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-neutral-600">No guesses yet</div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {p1List.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-surface-2 rounded-lg border border-surface-border text-xs"
                  >
                    <span className="font-mono text-xs font-bold tracking-wider text-white">
                      {item.guess}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={item.dead > 0 ? 'text-dead font-bold' : 'text-neutral-600'}>
                        {item.dead}D
                      </span>
                      <span className={item.wounded > 0 ? 'text-wounded font-bold' : 'text-neutral-600'}>
                        {item.wounded}W
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player 2 Table */}
          <div className={`p-3 bg-surface-1 rounded-xl border transition-all space-y-2 ${
            !isP1Turn ? 'border-purple-400 shadow-sm shadow-purple-500/10' : 'border-surface-border opacity-80'
          }`}>
            <div className="flex items-center justify-between border-b border-surface-border pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-xs font-bold text-purple-400">Player 2 History</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">vs P1 Code</span>
            </div>

            {p2List.length === 0 ? (
              <div className="text-center py-6 text-[11px] text-neutral-600">No guesses yet</div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {p2List.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-surface-2 rounded-lg border border-surface-border text-xs"
                  >
                    <span className="font-mono text-xs font-bold tracking-wider text-white">
                      {item.guess}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={item.dead > 0 ? 'text-dead font-bold' : 'text-neutral-600'}>
                        {item.dead}D
                      </span>
                      <span className={item.wounded > 0 ? 'text-wounded font-bold' : 'text-neutral-600'}>
                        {item.wounded}W
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Single Player Mode History Table
  if (history.length === 0) {
    return (
      <div className="text-center py-8 space-y-1">
        <p className="text-xs text-neutral-600">No guesses yet</p>
        <p className="text-[11px] text-neutral-700">Your history will appear here</p>
      </div>
    );
  }

  const reversed = [...history].reverse();

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-neutral-400">
          Guess History ({history.length})
        </span>
      </div>

      <div className="space-y-1.5 max-h-[360px] sm:max-h-[420px] overflow-y-auto">
        {reversed.map((item, index) => {
          const round = history.length - index;

          return (
            <div
              key={index}
              className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-surface-1 rounded-xl border border-surface-border hover:border-neutral-700 transition-colors animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-600 w-5">
                  #{round}
                </span>
                <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-white">
                  {item.guess}
                </span>
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
