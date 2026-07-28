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
      const g = await createGame({ mode, player1SecretCode: p1Code, player2SecretCode: p2Code });
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
        setGame((prev) =>
          prev
            ? {
                ...prev,
                status: result.status,
                currentTurn: result.nextTurn || prev.currentTurn,
                history: result.history,
                player1History: result.player1History || prev.player1History,
                player2History: result.player2History || prev.player2History,
              }
            : null
        );
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
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar mode={game?.mode} onReset={handleReset} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {error && (
          <div className="mx-auto mb-6 max-w-md rounded-xl border border-dead/20 bg-dead/10 px-4 py-2.5 text-center text-xs text-dead animate-fade-in">
            {error}
          </div>
        )}

        {!game ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <GameSetup onStartGame={handleStart} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <TurnIndicator mode={game.mode} currentTurn={game.currentTurn} />

            <div className="mx-auto w-full max-w-md">
              <KeypadInput onSubmit={handleGuess} isLoading={isLoading || isGameOver} />
            </div>

            <div className="mx-auto w-full max-w-3xl">
              <GuessHistory
                history={game.history}
                player1History={game.player1History}
                player2History={game.player2History}
                mode={game.mode}
                currentTurn={game.currentTurn}
              />
            </div>
          </div>
        )}
      </main>

      {game && isGameOver ? <WinModal game={game} onPlayAgain={handleReset} /> : null}

      <footer className="border-t border-surface-border py-4 text-center">
        <p className="text-[11px] text-neutral-600">
          Dead &amp; Wounded · concurrent Java service &amp; Next.js client · &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
