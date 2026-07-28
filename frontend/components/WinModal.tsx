'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Game } from '@/lib/api';

interface WinModalProps {
  game: Game;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ game, onPlayAgain }) => {
  useEffect(() => {
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 50, origin: { x: 0, y: 0.7 } });
      confetti({ particleCount: 3, angle: 120, spread: 50, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const total = game.history.length;
  const is2P = game.mode === 'TWO_PLAYER_SAME_DEVICE';

  let winner = 'You cracked it!';
  if (is2P) {
    winner = game.status === 'PLAYER1_WON' ? 'Player 1 wins!' : 'Player 2 wins!';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-surface-1 border border-surface-border rounded-2xl p-6 text-center space-y-5 animate-scale-in">
        {/* Trophy */}
        <div className="text-4xl">🏆</div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-win">Code Broken</p>
          <h2 className="text-xl font-bold text-white">{winner}</h2>
        </div>

        {/* Secret Code Reveal */}
        {game.revealedSecretCode && (
          <div className="py-3 px-4 bg-surface-2 rounded-xl border border-surface-border">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Secret Code</p>
            <p className="text-2xl font-mono font-bold tracking-[0.4em] text-accent">
              {game.revealedSecretCode}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 text-xs">
          <div>
            <p className="text-neutral-500">Guesses</p>
            <p className="text-lg font-bold text-white">{total}</p>
          </div>
          <div>
            <p className="text-neutral-500">Mode</p>
            <p className="text-xs font-semibold text-neutral-300 mt-1">
              {is2P ? 'Pass &amp; Play' : 'Solo'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-accent hover:bg-accent-dim text-white transition-colors active:scale-[0.98]"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
