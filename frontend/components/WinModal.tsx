'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { Game } from '@/lib/api';

interface WinModalProps {
  game: Game;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ game, onPlayAgain }) => {
  useEffect(() => {
    // Launch confetti on mount
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const totalGuesses = game.history.length;
  const is2Player = game.mode === 'TWO_PLAYER_SAME_DEVICE';

  let winnerText = 'You Cracked the Code!';
  if (is2Player) {
    if (game.status === 'PLAYER1_WON') {
      winnerText = 'Player 1 Wins!';
    } else if (game.status === 'PLAYER2_WON') {
      winnerText = 'Player 2 Wins!';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-5 transform transition-all scale-100">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-4 h-4" /> Code Broken <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-black text-white">{winnerText}</h2>
        </div>

        {/* Revealed Secret Code */}
        {game.revealedSecretCode && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Secret Code Was</div>
            <div className="text-2xl font-mono font-extrabold tracking-[0.3em] text-indigo-400">
              {game.revealedSecretCode}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
          <div className="space-y-0.5">
            <div className="text-slate-400">Total Guesses</div>
            <div className="text-lg font-bold text-white">{totalGuesses}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-slate-400">Game Mode</div>
            <div className="text-xs font-semibold text-indigo-300 pt-1">
              {is2Player ? 'Pass &amp; Play' : 'VS Computer'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>
      </div>
    </div>
  );
};
