'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { GameSetup } from '@/components/GameSetup';
import { TurnIndicator } from '@/components/TurnIndicator';
import { KeypadInput } from '@/components/KeypadInput';
import { GuessHistory } from '@/components/GuessHistory';
import { WinModal } from '@/components/WinModal';
import { createGame, submitGuess, Game, GameMode } from '@/lib/api';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateGame = async (mode: GameMode, customSecretCode?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const newGame = await createGame({ mode, customSecretCode });
      setGame(newGame);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start game session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuessSubmit = async (guess: string) => {
    if (!game) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await submitGuess(game.id, guess);
      setGame((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: result.status,
          currentTurn: result.nextTurn || prev.currentTurn,
          history: result.history,
          revealedSecretCode: result.gameOver ? prev.revealedSecretCode || guess : undefined,
        };
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to evaluate guess.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGame(null);
    setErrorMessage(null);
  };

  const isGameOver: boolean = Boolean(
    game && (game.status === 'WON' || game.status === 'PLAYER1_WON' || game.status === 'PLAYER2_WON')
  );

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar mode={game?.mode} onReset={handleReset} />

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {errorMessage && (
            <div className="max-w-md mx-auto p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2 shadow-lg animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!game ? (
            <GameSetup onStartGame={handleCreateGame} isLoading={isLoading} />
          ) : (
            <div className="space-y-6 animate-fade-in">
              <TurnIndicator mode={game.mode} currentTurn={game.currentTurn} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <KeypadInput onSubmit={handleGuessSubmit} isLoading={isLoading || isGameOver} />
                <GuessHistory history={game.history} mode={game.mode} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Win Modal Overlay */}
      {game && isGameOver ? <WinModal game={game} onPlayAgain={handleReset} /> : null}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        Dead &amp; Wounded &copy; {new Date().getFullYear()} &bull; Master Logic Deduction Game
      </footer>
    </div>
  );
}
