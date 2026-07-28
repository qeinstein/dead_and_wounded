'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { GameSetup } from '@/components/GameSetup';
import { TurnIndicator } from '@/components/TurnIndicator';
import { KeypadInput } from '@/components/KeypadInput';
import { GuessHistory } from '@/components/GuessHistory';
import { WinModal } from '@/components/WinModal';
import { createGame, submitGuess, getGame, Game, GameMode } from '@/lib/api';

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (mode: GameMode, p1Code?: string, p2Code?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const g = await createGame({
        mode,
        player1SecretCode: p1Code,
        player2SecretCode: p2Code,
      });
      setGame(g);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start game.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = async (guess: string) => {
    if (!game) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitGuess(game.id, guess);
      if (result.gameOver) {
        const fullGame = await getGame(game.id);
        setGame(fullGame);
      } else {
        setGame(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: result.status,
            currentTurn: result.nextTurn || prev.currentTurn,
            history: result.history,
            player1History: result.player1History || prev.player1History,
            player2History: result.player2History || prev.player2History,
          };
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid guess.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGame(null);
    setError(null);
  };

  const isGameOver: boolean = Boolean(
    game && (game.status === 'WON' || game.status === 'PLAYER1_WON' || game.status === 'PLAYER2_WON')
  );

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar mode={game?.mode} onReset={handleReset} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-dead/10 border border-dead/20 text-xs text-dead text-center animate-fade-in">
            {error}
          </div>
        )}

        {!game ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <GameSetup onStartGame={handleStart} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <TurnIndicator mode={game.mode} currentTurn={game.currentTurn} />

            {/* Layout: Keypad on top/left, Side-by-Side Dual History Tables on right/bottom */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              <div className="w-full lg:w-[300px] lg:flex-shrink-0">
                <KeypadInput onSubmit={handleGuess} isLoading={isLoading || isGameOver} />
              </div>
              <div className="w-full lg:flex-1 lg:min-w-0">
                <GuessHistory
                  history={game.history}
                  player1History={game.player1History}
                  player2History={game.player2History}
                  mode={game.mode}
                  currentTurn={game.currentTurn}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Win Modal */}
      {game && isGameOver ? <WinModal game={game} onPlayAgain={handleReset} /> : null}

      <footer className="py-3 text-center text-[10px] text-neutral-700 border-t border-surface-border">
        Dead &amp; Wounded &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
