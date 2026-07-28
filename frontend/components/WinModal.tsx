'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw } from 'lucide-react';
import { Game } from '@/lib/api';

interface WinModalProps {
  game: Game;
  onPlayAgain: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ game, onPlayAgain }) => {
  useEffect(() => {
    const end = Date.now() + 2000;
    const colors = ['#4f46e5', '#059669', '#d97706', '#e11d48'];
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const total = game.history.length;
  const is2P = game.mode === 'TWO_PLAYER_SAME_DEVICE';

  let winner = 'You cracked it!';
  if (is2P) winner = game.status === 'PLAYER1_WON' ? 'Player 1 wins' : 'Player 2 wins';

  const p1Code = game.revealedPlayer1SecretCode || (is2P ? '????' : null);
  const p2Code = game.revealedPlayer2SecretCode || game.revealedSecretCode || '????';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-fade-in">
      <div className="panel w-full max-w-sm space-y-6 p-7 text-center animate-scale-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
          <Trophy className="h-6 w-6 text-accent" />
        </div>

        <div className="space-y-1.5">
          <span className="eyebrow text-win">Match complete</span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{winner}</h2>
        </div>

        {is2P ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-surface-border bg-surface-2 py-3">
              <p className="eyebrow mb-1">Player 1</p>
              <p className="font-mono text-lg font-bold tracking-[0.3em] text-accent">{p1Code}</p>
            </div>
            <div className="rounded-xl border border-surface-border bg-surface-2 py-3">
              <p className="eyebrow mb-1">Player 2</p>
              <p className="font-mono text-lg font-bold tracking-[0.3em] text-win">{p2Code}</p>
            </div>
          </div>
        ) : (
          game.revealedSecretCode && (
            <div className="rounded-xl border border-surface-border bg-surface-2 py-4">
              <p className="eyebrow mb-1.5">Secret code</p>
              <p className="font-mono text-3xl font-bold tracking-[0.4em] text-accent">{game.revealedSecretCode}</p>
            </div>
          )
        )}

        <div className="flex items-center justify-center gap-8 border-t border-surface-border pt-5">
          <div>
            <p className="text-2xl font-semibold text-slate-900">{total}</p>
            <p className="eyebrow mt-0.5">Rounds</p>
          </div>
          <div className="h-8 w-px bg-surface-border" />
          <div>
            <p className="text-sm font-semibold text-slate-800">{is2P ? '2-Player' : 'Solo'}</p>
            <p className="eyebrow mt-0.5">Mode</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPlayAgain}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white shadow-glow transition-all hover:bg-accent-dim active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      </div>
    </div>
  );
};
